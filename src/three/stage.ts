/**
 * A mesa 3D: cena, luz, física e o arremesso dos dados.
 *
 * Quem decide o resultado é o dado. A cena arremessa os poliedros, espera
 * pararem, LÊ a face que ficou para cima e devolve esses números — nenhuma
 * face é reetiquetada, nenhum valor troca depois de aparecer. O motor recebe
 * as faces lidas e faz a conta em cima delas.
 *
 * `exibir` é o caminho inverso, e existe por um motivo só: uma rolagem que
 * aconteceu no aparelho de outra pessoa. Aí os dados entram já deitados na
 * face certa, desde o primeiro quadro — sem física fingida e, de novo, sem
 * número trocando na frente de ninguém.
 */

import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import type { DadoPlanejado } from '@/engine';
import type { PolyhedronKind } from '@/engine/types';
import type {
  DiceStage,
  DiceSkin,
  PedidoDeExibicao,
  RollRequest,
  StageEvents,
} from '@/state/types';
import type { DieShape } from './types';
import { createShapeLibrary } from './shapes';
import { SKIN_COLORS, createFaceTexture, needsUnderline } from './textures';

interface ActiveDie {
  plano: DadoPlanejado;
  shape: DieShape;
  mesh: THREE.Mesh;
  body: CANNON.Body;
  aura: THREE.Mesh | null;
  /** Quadros consecutivos em repouso. */
  quietFrames: number;
  /** Face lida quando o dado parou. `null` enquanto ainda rola. */
  valorLido: number | null;
}

const FIXED_STEP = 1 / 120;
const MAX_SUBSTEPS = 14;
const QUIET_FRAMES_NEEDED = 10;
const QUIET_LINEAR = 0.08;
const QUIET_ANGULAR = 0.08;
const SETTLE_TIMEOUT_MS = 6500;
const IMPACT_MIN_INTERVAL_MS = 80;

/** Rótulo impresso em uma face. */
function faceLabel(kind: PolyhedronKind, value: number): string {
  if (kind === 'dF') return value > 0 ? '+' : value < 0 ? '−' : '';
  if (kind === 'd100') return value === 0 ? '00' : String(value);
  return String(value);
}

/** Palco inerte: usado quando não há WebGL, para o app seguir funcionando. */
function createInertStage(): DiceStage {
  return {
    // Sem mesa não há face para ler: devolve vazio e o store cai no gerador.
    arremessar: () => Promise.resolve([]),
    exibir: () => Promise.resolve(),
    esmaecer: () => {},
    clear: () => {},
    setSpeed: () => {},
    dispose: () => {},
    resize: () => {},
  };
}

export function createDiceStage(
  canvas: HTMLCanvasElement,
  events: StageEvents = {},
): DiceStage {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return createInertStage();
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x080c14, 18, 46);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 120);
  camera.position.set(0, 17, 11.5);
  camera.lookAt(0, 0, 0);

  // ------------------------------------------------------------ iluminação
  // Uma mesa de taverna: chave quente em cima, preenchimento frio e baixo.
  const ambient = new THREE.AmbientLight(0x5a6d96, 0.9);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffd9a0, 3.1);
  key.position.set(-7, 20, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 60;
  key.shadow.camera.left = -18;
  key.shadow.camera.right = 18;
  key.shadow.camera.top = 18;
  key.shadow.camera.bottom = -18;
  key.shadow.bias = -0.0012;
  key.shadow.normalBias = 0.02;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x6fd2e8, 1.1);
  rim.position.set(9, 8, -10);
  scene.add(rim);

  // Intensidade alta porque a queda é física (decay 2): a essa distância
  // sobra apenas um halo quente sobre o centro da mesa.
  const lantern = new THREE.PointLight(0xffb765, 260, 40, 2);
  lantern.position.set(0, 8, 2);
  scene.add(lantern);

  // ----------------------------------------------------------------- mesa
  const feltTexture = createFeltTexture();
  const table = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshStandardMaterial({
      // A fibra é quase neutra; o tom da mesa vem daqui.
      color: 0x1d4034,
      roughness: 0.97,
      metalness: 0,
      ...(feltTexture ? { map: feltTexture } : {}),
    }),
  );
  table.rotation.x = -Math.PI / 2;
  table.receiveShadow = true;
  scene.add(table);

  // --------------------------------------------------------------- física
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -42, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  (world.solver as CANNON.GSSolver).iterations = 14;

  const diceMaterial = new CANNON.Material('dado');
  const tableMaterial = new CANNON.Material('mesa');

  world.addContactMaterial(
    new CANNON.ContactMaterial(diceMaterial, tableMaterial, {
      friction: 0.55,
      restitution: 0.32,
    }),
  );
  world.addContactMaterial(
    new CANNON.ContactMaterial(diceMaterial, diceMaterial, {
      friction: 0.4,
      restitution: 0.45,
    }),
  );

  const floorBody = new CANNON.Body({ mass: 0, material: tableMaterial });
  floorBody.addShape(new CANNON.Plane());
  floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(floorBody);

  const walls: CANNON.Body[] = [];
  for (let i = 0; i < 4; i += 1) {
    const wall = new CANNON.Body({ mass: 0, material: tableMaterial });
    wall.addShape(new CANNON.Plane());
    world.addBody(wall);
    walls.push(wall);
  }

  // Teto invisível: sem ele, um arremesso forte joga o dado para fora.
  const ceiling = new CANNON.Body({ mass: 0, material: tableMaterial });
  ceiling.addShape(new CANNON.Plane());
  ceiling.quaternion.setFromEuler(Math.PI / 2, 0, 0);
  ceiling.position.set(0, 26, 0);
  world.addBody(ceiling);

  // ------------------------------------------------------------- recursos
  const shapes = createShapeLibrary();
  const materialCache = new Map<string, THREE.MeshStandardMaterial>();
  const textureCache = new Map<string, THREE.Texture>();

  const auraMaterials = {
    max: new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    }),
    min: new THREE.MeshBasicMaterial({
      color: 0xe0523f,
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
    }),
  };

  function materialFor(skin: DiceSkin, kind: PolyhedronKind, value: number): THREE.MeshStandardMaterial {
    const key = `${skin}|${kind}|${value}`;
    const cached = materialCache.get(key);
    if (cached) return cached;

    const definition = SKIN_COLORS[skin];
    const textureKey = `${skin}|${kind}|${value}|tex`;
    let texture = textureCache.get(textureKey);
    if (!texture) {
      const sides = kind === 'd100' ? 100 : Number.parseInt(kind.slice(1), 10) || 6;
      texture = createFaceTexture({
        label: faceLabel(kind, value),
        body: definition.body,
        engraving: definition.engraving,
        underline: needsUnderline(value, sides),
      });
      textureCache.set(textureKey, texture);
    }

    // A cor do corpo já está pintada na textura; a cor do material fica
    // branca para não multiplicar duas vezes e escurecer o dado.
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: definition.metalness,
      roughness: definition.roughness,
      map: texture,
    });

    materialCache.set(key, material);
    return material;
  }

  // ---------------------------------------------------------------- estado
  let arenaHalfX = 10;
  let arenaHalfZ = 10;
  let speed = 1;
  let frameHandle = 0;
  let disposed = false;
  let lastFrameTime = 0;
  let accumulator = 0;
  let lastImpactTime = 0;

  const active: ActiveDie[] = [];
  const retiring: Array<{ mesh: THREE.Mesh; aura: THREE.Mesh | null; born: number }> = [];

  let settleResolve: ((valores: number[]) => void) | null = null;
  let settleDeadline = 0;

  const pointer = new THREE.Vector2(0, 0);
  const cameraBase = camera.position.clone();

  // ------------------------------------------------------------ dimensões
  function groundPointAt(ndcX: number, ndcY: number): THREE.Vector3 | null {
    const target = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
    const direction = target.sub(camera.position).normalize();
    if (Math.abs(direction.y) < 1e-6) return null;
    const distance = -camera.position.y / direction.y;
    if (distance <= 0) return null;
    return camera.position.clone().addScaledVector(direction, distance);
  }

  /** Ajusta as paredes para que a arena caiba exatamente na viewport. */
  function layoutArena(): void {
    const corners = [
      groundPointAt(-1, -1),
      groundPointAt(1, -1),
      groundPointAt(-1, 1),
      groundPointAt(1, 1),
    ].filter((point): point is THREE.Vector3 => point !== null);

    if (corners.length === 0) return;

    // A região visível do chão é um trapézio — estreito perto da câmera e
    // largo ao longe. A arena precisa ser um retângulo INSCRITO nele, por
    // isso o mínimo e não o máximo: com o máximo, os dados assentariam nos
    // cantos próximos, que já estão fora do enquadramento.
    arenaHalfX = Math.min(...corners.map((p) => Math.abs(p.x)));
    arenaHalfZ = Math.min(...corners.map((p) => Math.abs(p.z)));

    arenaHalfX = THREE.MathUtils.clamp(arenaHalfX, 3.2, 16);
    arenaHalfZ = THREE.MathUtils.clamp(arenaHalfZ, 3.2, 14);

    const setWall = (
      index: number,
      position: [number, number, number],
      euler: [number, number, number],
    ): void => {
      const wall = walls[index];
      if (!wall) return;
      wall.position.set(position[0], position[1], position[2]);
      wall.quaternion.setFromEuler(euler[0], euler[1], euler[2]);
    };

    setWall(0, [-arenaHalfX, 0, 0], [0, Math.PI / 2, 0]);
    setWall(1, [arenaHalfX, 0, 0], [0, -Math.PI / 2, 0]);
    setWall(2, [0, 0, -arenaHalfZ], [0, 0, 0]);
    setWall(3, [0, 0, arenaHalfZ], [0, Math.PI, 0]);
  }

  function resize(): void {
    const width = canvas.clientWidth || canvas.width || 1;
    const height = canvas.clientHeight || canvas.height || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;

    // Em telas estreitas e altas, afasta a câmera para a mesa continuar cabendo.
    const portrait = height > width;
    camera.position.z = portrait ? 13.5 : 11.5;
    camera.position.y = portrait ? 20 : 17;
    cameraBase.copy(camera.position);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    layoutArena();
  }

  // ------------------------------------------------------------ arremesso
  function dieSizeFor(count: number): number {
    const spread = Math.min(arenaHalfX, arenaHalfZ);
    const raw = spread / (5 + Math.sqrt(Math.max(count, 1)) * 1.6);
    return THREE.MathUtils.clamp(raw, 0.3, 0.72);
  }

  /**
   * A cor do dado. Normalmente é a do personagem, mas o par de dualidade do
   * Daggerheart força as suas: Esperança dourada, Medo obsidiana.
   */
  function skinDoDado(override: string | undefined, fallback: DiceSkin): DiceSkin {
    if (override && override in SKIN_COLORS) return override as DiceSkin;
    return fallback;
  }

  /** Monta o corpo e a malha de um dado, sem decidir onde ele entra. */
  function criarDado(plano: DadoPlanejado, skin: DiceSkin, size: number): ActiveDie {
    const shape = shapes.get(plano.shape);
    const cor = skinDoDado(plano.skinOverride, skin);

    const materials = shape.faceValues.map((value) => materialFor(cor, plano.shape, value));
    const mesh = new THREE.Mesh(shape.geometry, materials);
    mesh.scale.setScalar(size);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const body = new CANNON.Body({
      mass: 1,
      material: diceMaterial,
      allowSleep: true,
      sleepSpeedLimit: 0.12,
      sleepTimeLimit: 0.2,
    });
    body.addShape(
      new CANNON.ConvexPolyhedron({
        vertices: shape.hullVertices.map(
          ([x, y, z]) => new CANNON.Vec3(x * size, y * size, z * size),
        ),
        faces: shape.hullFaces,
      }),
    );
    world.addBody(body);

    return { plano, shape, mesh, body, aura: null, quietFrames: 0, valorLido: null };
  }

  function spawnDie(plano: DadoPlanejado, skin: DiceSkin, size: number, index: number): ActiveDie {
    const entry = criarDado(plano, skin, size);
    const { body } = entry;

    // Entram alternando os lados e voam para o centro. As paredes do
    // cannon-es são semiespaços infinitos: nascer do lado de fora colocaria
    // o dado dentro do sólido, então o lançamento começa logo por dentro.
    const side = index % 2 === 0 ? -1 : 1;
    const depth = ((index % 5) - 2) * 0.55;
    body.position.set(
      side * Math.max(arenaHalfX - size * 1.6, size * 2),
      6 + (index % 4) * 1.1,
      THREE.MathUtils.clamp(
        depth + (Math.random() - 0.5) * 2,
        -arenaHalfZ + size * 2,
        arenaHalfZ - size * 2,
      ),
    );
    body.velocity.set(
      -side * (10 + Math.random() * 6),
      1 + Math.random() * 3,
      (Math.random() - 0.5) * 8,
    );
    body.angularVelocity.set(
      (Math.random() - 0.5) * 26,
      (Math.random() - 0.5) * 26,
      (Math.random() - 0.5) * 26,
    );
    body.quaternion.setFromEuler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    );

    body.addEventListener('collide', handleCollision);
    return entry;
  }

  /**
   * Põe o dado na mesa já deitado na face pedida, sem física.
   *
   * Serve às rolagens que aconteceram em outro aparelho: o valor é o que a
   * mesa de lá leu, e aqui ele só precisa aparecer. O corpo entra com massa
   * zero e dormindo, para nada empurrar nada.
   */
  function posicionarDado(
    plano: DadoPlanejado,
    valor: number,
    skin: DiceSkin,
    size: number,
    index: number,
    total: number,
  ): ActiveDie {
    const entry = criarDado(plano, skin, size);
    const { body, shape } = entry;

    body.mass = 0;
    body.type = CANNON.Body.STATIC;
    body.updateMassProperties();

    const orientacao = orientacaoParaFace(shape, valor, index);
    body.quaternion.set(orientacao.x, orientacao.y, orientacao.z, orientacao.w);

    // Grade centrada: cabe o mesmo número de dados de qualquer rolagem sem
    // ninguém empilhar ou sair do enquadramento.
    const colunas = Math.max(1, Math.ceil(Math.sqrt(total)));
    const linhas = Math.max(1, Math.ceil(total / colunas));
    const passoX = Math.min((arenaHalfX * 2) / (colunas + 1), size * 3.4);
    const passoZ = Math.min((arenaHalfZ * 2) / (linhas + 1), size * 3.4);
    const coluna = index % colunas;
    const linha = Math.floor(index / colunas);

    body.position.set(
      (coluna - (colunas - 1) / 2) * passoX,
      alturaDeRepouso(entry, orientacao),
      (linha - (linhas - 1) / 2) * passoZ,
    );
    body.velocity.setZero();
    body.angularVelocity.setZero();
    body.sleep();

    entry.valorLido = valor;
    return entry;
  }

  /**
   * Rotação que deixa a face de valor `valor` apontando para cima.
   *
   * Quando o valor se repete em mais de uma face — os "+"/"−" do Fudge — a
   * escolha varia com o índice, para dois dados iguais não caírem gêmeos.
   * Um giro em torno da vertical desfaz o resto do alinhamento perfeito.
   */
  function orientacaoParaFace(shape: DieShape, valor: number, index: number): THREE.Quaternion {
    const candidatos: number[] = [];
    shape.faceValues.forEach((face, i) => {
      if (face === valor) candidatos.push(i);
    });

    const escolhido = candidatos[index % Math.max(candidatos.length, 1)] ?? 0;
    const normal = shape.faceNormals[escolhido];
    if (!normal) return new THREE.Quaternion();

    const alinhamento = new THREE.Quaternion().setFromUnitVectors(
      normal.clone().normalize(),
      new THREE.Vector3(0, 1, 0),
    );
    const giro = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      (index * 2.39996) % (Math.PI * 2),
    );
    return giro.multiply(alinhamento);
  }

  /** Altura em que o vértice mais baixo do dado encosta no feltro. */
  function alturaDeRepouso(entry: ActiveDie, orientacao: THREE.Quaternion): number {
    const escala = entry.mesh.scale.x;
    let menor = Infinity;
    const vertice = new THREE.Vector3();
    for (const [x, y, z] of entry.shape.hullVertices) {
      vertice.set(x * escala, y * escala, z * escala).applyQuaternion(orientacao);
      menor = Math.min(menor, vertice.y);
    }
    return Number.isFinite(menor) ? -menor : escala;
  }

  function handleCollision(event: { contact?: CANNON.ContactEquation }): void {
    if (!events.onImpact) return;
    const now = performance.now();
    if (now - lastImpactTime < IMPACT_MIN_INTERVAL_MS) return;

    const contact = event.contact;
    if (!contact) return;
    const relative = Math.abs(contact.getImpactVelocityAlongNormal());
    if (relative < 1.2) return;

    lastImpactTime = now;
    events.onImpact(THREE.MathUtils.clamp(relative / 16, 0.08, 1), 'd6');
  }

  // ----------------------------------------------------- leitura da face

  /**
   * Índice da face virada para cima, do jeito que um humano leria.
   *
   * O critério é a normal mais alinhada com a vertical. O tetraedro é o
   * único caso ambíguo: apoiado numa face, as outras três ficam inclinadas
   * exatamente no mesmo ângulo, e o desempate por ruído de ponto flutuante
   * escolheria uma face que o jogador não tem como identificar. Aí o
   * critério passa a ser a face voltada para a câmera — a que está
   * literalmente de frente para quem olha.
   */
  function lerFace(entry: ActiveDie): number {
    const quaternion = new THREE.Quaternion(
      entry.body.quaternion.x,
      entry.body.quaternion.y,
      entry.body.quaternion.z,
      entry.body.quaternion.w,
    );

    const alturas = entry.shape.faceNormals.map(
      (normal) => normal.clone().applyQuaternion(quaternion).y,
    );
    const maisAlta = Math.max(...alturas);

    const empatadas: number[] = [];
    alturas.forEach((y, index) => {
      if (maisAlta - y < 0.02) empatadas.push(index);
    });

    const primeira = empatadas[0] ?? 0;
    if (empatadas.length === 1) return primeira;

    const paraCamera = camera.position.clone().normalize();
    let escolhida = primeira;
    let melhor = -Infinity;
    for (const index of empatadas) {
      const normal = entry.shape.faceNormals[index];
      if (!normal) continue;
      const alinhamento = normal.clone().applyQuaternion(quaternion).dot(paraCamera);
      if (alinhamento > melhor) {
        melhor = alinhamento;
        escolhida = index;
      }
    }
    return escolhida;
  }

  /**
   * Deita o dado sobre a face que está apoiada na mesa.
   *
   * Só é usado quando o tempo limite estoura: em vez de congelar um dado
   * torto, equilibrado numa quina, gira o mínimo necessário para a face de
   * baixo ficar plana no feltro. É a face de BAIXO e não a de cima porque
   * num tetraedro nenhuma face olha para cima — deitar pela de cima o
   * deixaria em pé sobre um vértice.
   */
  function snapToRest(entry: ActiveDie): void {
    const current = new THREE.Quaternion(
      entry.body.quaternion.x,
      entry.body.quaternion.y,
      entry.body.quaternion.z,
      entry.body.quaternion.w,
    );

    let apoiada: THREE.Vector3 | null = null;
    let menor = Infinity;
    for (const normal of entry.shape.faceNormals) {
      const mundo = normal.clone().applyQuaternion(current);
      if (mundo.y < menor) {
        menor = mundo.y;
        apoiada = mundo;
      }
    }
    if (!apoiada) return;

    const correction = new THREE.Quaternion().setFromUnitVectors(
      apoiada.normalize(),
      new THREE.Vector3(0, -1, 0),
    );
    const settled = correction.multiply(current);

    entry.body.quaternion.set(settled.x, settled.y, settled.z, settled.w);
    entry.body.position.y = alturaDeRepouso(entry, settled);
    entry.body.sleep();
  }

  /**
   * Aura de crítico, decidida pelo número que o dado mostrou.
   *
   * Não há consulta a resultado nenhum: se a face lida é a maior do sólido,
   * é dourada; se é a menor, é vermelha. O empate da dualidade é o crítico
   * do Daggerheart e acende os dois dados.
   */
  function marcarCritico(entry: ActiveDie, empateDeDualidade: boolean): void {
    const valor = entry.valorLido;
    if (valor === null) return;

    const { sides, faceKind } = entry.plano;
    const maior = faceKind === 'fudge' ? 1 : faceKind === 'percentile' ? 90 : sides;
    const menor = faceKind === 'fudge' ? -1 : faceKind === 'percentile' ? 0 : 1;

    let kind: 'max' | 'min' | null = null;
    if (empateDeDualidade) kind = 'max';
    else if (entry.plano.papel) kind = null; // metade de um percentil não tem crítico próprio
    else if (maior !== menor && valor === maior) kind = 'max';
    else if (maior !== menor && valor === menor) kind = 'min';
    if (!kind) return;

    const aura = new THREE.Mesh(entry.shape.geometry, auraMaterials[kind]);
    aura.scale.copy(entry.mesh.scale).multiplyScalar(1.22);
    aura.position.copy(entry.mesh.position);
    aura.quaternion.copy(entry.mesh.quaternion);
    scene.add(aura);
    entry.aura = aura;
  }

  /** Lê todos os dados parados e acende os críticos. */
  function lerTodos(): number[] {
    for (const entry of active) {
      if (entry.valorLido !== null) continue;
      entry.valorLido = entry.shape.faceValues[lerFace(entry)] ?? 0;
    }

    const esperanca = active.find((entry) => entry.plano.role === 'esperanca');
    const medo = active.find((entry) => entry.plano.role === 'medo');
    const empate =
      esperanca !== undefined &&
      medo !== undefined &&
      esperanca.valorLido === medo.valorLido;

    for (const entry of active) {
      const dualidade = empate && entry.plano.role !== null;
      marcarCritico(entry, dualidade);
    }

    return active.map((entry) => entry.valorLido ?? 0);
  }

  // ------------------------------------------------------------------ ciclo
  function clearDice(): void {
    const now = performance.now();
    for (const entry of active) {
      entry.body.removeEventListener('collide', handleCollision);
      world.removeBody(entry.body);
      retiring.push({ mesh: entry.mesh, aura: entry.aura, born: now });
    }
    active.length = 0;
  }

  function disposeMesh(mesh: THREE.Mesh): void {
    scene.remove(mesh);
    // Geometrias e materiais são compartilhados pelo cache — não descartar.
  }

  function step(delta: number): void {
    accumulator += delta * speed;
    // O teto de substeps evita a espiral da morte em quadros lentos; o
    // resto do tempo é descartado, e a simulação anda mais devagar em vez
    // de travar a aba.
    let guard = 0;
    while (accumulator >= FIXED_STEP && guard < MAX_SUBSTEPS) {
      world.step(FIXED_STEP);
      accumulator -= FIXED_STEP;
      guard += 1;
    }
    if (accumulator > FIXED_STEP * MAX_SUBSTEPS) accumulator = 0;
  }

  function syncMeshes(): void {
    for (const entry of active) {
      entry.mesh.position.set(
        entry.body.position.x,
        entry.body.position.y,
        entry.body.position.z,
      );
      entry.mesh.quaternion.set(
        entry.body.quaternion.x,
        entry.body.quaternion.y,
        entry.body.quaternion.z,
        entry.body.quaternion.w,
      );
      if (entry.aura) {
        entry.aura.position.copy(entry.mesh.position);
        entry.aura.quaternion.copy(entry.mesh.quaternion);
      }
    }
  }

  function checkSettled(now: number): void {
    if (!settleResolve || active.length === 0) return;

    let allQuiet = true;
    for (const entry of active) {
      const linear = entry.body.velocity.lengthSquared();
      const angular = entry.body.angularVelocity.lengthSquared();
      if (linear < QUIET_LINEAR && angular < QUIET_ANGULAR) {
        entry.quietFrames += 1;
      } else {
        entry.quietFrames = 0;
      }
      if (entry.quietFrames < QUIET_FRAMES_NEEDED) allQuiet = false;
    }

    const timedOut = now > settleDeadline;
    if (!allQuiet && !timedOut) return;

    if (timedOut) {
      // Em máquina lenta a simulação pode não terminar a tempo. Em vez de
      // apenas congelar — o que deixaria dados tortos, apoiados em quina —
      // deita cada um sobre a face em que já estava se apoiando. A leitura
      // acontece depois disso, então continua sendo a face que o jogador vê.
      for (const entry of active) {
        entry.body.velocity.setZero();
        entry.body.angularVelocity.setZero();
        snapToRest(entry);
      }
      syncMeshes();
    }

    const valores = lerTodos();

    const resolve = settleResolve;
    settleResolve = null;
    resolve(valores);
  }

  function updateRetiring(now: number): void {
    for (let i = retiring.length - 1; i >= 0; i -= 1) {
      const item = retiring[i];
      if (!item) continue;
      const age = (now - item.born) / 260;
      if (age >= 1) {
        disposeMesh(item.mesh);
        if (item.aura) scene.remove(item.aura);
        retiring.splice(i, 1);
        continue;
      }

      // Encolhe e afunda: os dados da rolagem anterior somem na mesa em vez
      // de desaparecerem em um corte seco.
      item.mesh.scale.multiplyScalar(0.9);
      item.mesh.position.y -= 0.04;
      if (item.aura) {
        item.aura.scale.multiplyScalar(0.9);
        item.aura.position.copy(item.mesh.position);
      }
    }
  }

  function animate(now: number): void {
    if (disposed) return;
    frameHandle = requestAnimationFrame(animate);

    const delta = lastFrameTime === 0 ? FIXED_STEP : Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;

    step(delta);
    syncMeshes();
    checkSettled(now);
    updateRetiring(now);

    // Parallax discreto: a mesa respira quando o ponteiro se move.
    camera.position.x += (cameraBase.x + pointer.x * 0.85 - camera.position.x) * 0.045;
    camera.position.y += (cameraBase.y + pointer.y * 0.5 - camera.position.y) * 0.045;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function handlePointerMove(event: PointerEvent): void {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });

  resize();
  frameHandle = requestAnimationFrame(animate);

  // ------------------------------------------------------------------- API
  /**
   * Encerra a espera da rolagem anterior, se ainda houver uma pendente.
   *
   * Resolve com lista vazia de propósito: quem pediu vai ver que não recebeu
   * uma face para cada dado e descartar o arremesso abortado, em vez de
   * fazer a conta com meia mesa.
   */
  function resolvePending(): void {
    if (!settleResolve) return;
    const resolve = settleResolve;
    settleResolve = null;
    resolve([]);
  }

  return {
    arremessar(pedido: RollRequest): Promise<number[]> {
      // Rolar de novo no meio de uma rolagem substitui a anterior; sem isso
      // a promessa dela ficaria pendurada para sempre.
      resolvePending();
      clearDice();

      const dados = pedido.dados;
      if (dados.length === 0) return Promise.resolve([]);

      const size = dieSizeFor(dados.length);
      dados.forEach((plano, index) => {
        active.push(spawnDie(plano, pedido.skin, size, index));
      });

      settleDeadline = performance.now() + SETTLE_TIMEOUT_MS / Math.max(speed, 0.25);

      return new Promise<number[]>((resolve) => {
        settleResolve = resolve;
      });
    },

    exibir(pedido: PedidoDeExibicao): Promise<void> {
      resolvePending();
      clearDice();

      const dados = pedido.dados;
      if (dados.length === 0) return Promise.resolve();

      const size = dieSizeFor(dados.length);
      dados.forEach((item, index) => {
        active.push(
          posicionarDado(item.plano, item.valor, pedido.skin, size, index, dados.length),
        );
      });
      syncMeshes();

      // Os corpos já estão parados: o assentamento normal detecta isso em
      // poucos quadros e dispara o mesmo som e a mesma revelação de sempre.
      settleDeadline = performance.now() + SETTLE_TIMEOUT_MS / Math.max(speed, 0.25);

      return new Promise<number[]>((resolve) => {
        settleResolve = resolve;
      }).then(() => undefined);
    },

    esmaecer(indices: readonly number[]): void {
      for (const index of indices) {
        const entry = active[index];
        if (!entry) continue;
        // Continuam na mesa, mas param de disputar a atenção com os que contam.
        entry.mesh.scale.multiplyScalar(0.82);
        if (entry.aura) entry.aura.scale.multiplyScalar(0.82);
      }
    },

    clear(): void {
      clearDice();
      resolvePending();
    },

    setSpeed(next: number): void {
      speed = THREE.MathUtils.clamp(next, 0.25, 3);
    },

    resize,

    dispose(): void {
      disposed = true;
      cancelAnimationFrame(frameHandle);
      window.removeEventListener('pointermove', handlePointerMove);

      clearDice();
      for (const item of retiring) {
        disposeMesh(item.mesh);
        if (item.aura) scene.remove(item.aura);
      }
      retiring.length = 0;

      for (const material of materialCache.values()) material.dispose();
      for (const texture of textureCache.values()) texture.dispose();
      materialCache.clear();
      textureCache.clear();

      auraMaterials.max.dispose();
      auraMaterials.min.dispose();
      table.geometry.dispose();
      (table.material as THREE.Material).dispose();
      feltTexture?.dispose();
      shapes.dispose();
      renderer.dispose();
    },
  };
}

/**
 * Fibra do feltro: uma textura pequena e repetível.
 *
 * O granulado não pode vir de uma textura única esticada sobre a mesa
 * inteira — cada texel viraria uma mancha do tamanho de um dado. Aqui ela
 * é fina e se repete; o halo quente do centro fica por conta do lampião,
 * que é luz de verdade e acompanha os dados.
 */
function createFeltTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // A fibra é clara de propósito: quem dá o tom é a cor do material. Uma
  // textura escura multiplicada por uma cor escura apaga a mesa.
  ctx.fillStyle = '#d6d6d6';
  ctx.fillRect(0, 0, size, size);

  const image = ctx.getImageData(0, 0, size, size);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 22;
    data[i] = Math.max(0, Math.min(255, (data[i] ?? 0) + noise));
    data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] ?? 0) + noise));
    data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] ?? 0) + noise));
  }
  ctx.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(26, 26);
  texture.anisotropy = 8;
  return texture;
}
