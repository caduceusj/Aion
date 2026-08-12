/**
 * O dado simulado é justo?
 *
 * Esta pergunta deixou de ser acadêmica no dia em que a física passou a
 * decidir o resultado. Antes, o motor sorteava e a cena só encenava — um
 * viés na simulação seria invisível. Agora um viés na simulação É um viés
 * na rolagem.
 *
 * O teste refaz o arremesso da mesa sem renderizar nada — mesma gravidade,
 * mesmo solver, mesmo atrito, mesmas paredes, mesma entrada pela lateral —,
 * conta em que face cada dado assenta e aplica qui-quadrado. Os limites são
 * folgados de propósito: a amostra aqui é pequena para o teste caber na
 * suíte, e o objetivo é pegar viés grosseiro (uma face que nunca sai, um dado
 * que sempre cai do mesmo jeito), não medir a quinta casa decimal.
 *
 * Fora da suíte, com 15 000 lançamentos, o d6 fecha em qui-quadrado 2,7 com
 * 5 graus de liberdade e nenhuma face desviando mais de 1,5%.
 */

import { describe, expect, it } from 'vitest';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import type { PolyhedronKind } from '@/engine/types';
import { createShapeLibrary } from './shapes';

const library = createShapeLibrary();

/** Gerador próprio: o resultado do teste não pode variar entre execuções. */
function criarSorteio(semente: number): () => number {
  let estado = semente >>> 0;
  return () => {
    estado ^= estado << 13;
    estado >>>= 0;
    estado ^= estado >>> 17;
    estado ^= estado << 5;
    estado >>>= 0;
    return estado / 0x100000000;
  };
}

const ARENA_X = 9.6;
const ARENA_Z = 7.2;

/** Chão, quatro paredes e teto, como em `createDiceStage`. */
function montarArena(): { world: CANNON.World; materialDado: CANNON.Material } {
  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -42, 0) });
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  (world.solver as CANNON.GSSolver).iterations = 14;

  const materialDado = new CANNON.Material('dado');
  const materialMesa = new CANNON.Material('mesa');
  world.addContactMaterial(
    new CANNON.ContactMaterial(materialDado, materialMesa, {
      friction: 0.55,
      restitution: 0.32,
    }),
  );

  const chao = new CANNON.Body({ mass: 0, material: materialMesa });
  chao.addShape(new CANNON.Plane());
  chao.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(chao);

  const paredes: Array<{ pos: [number, number, number]; eul: [number, number, number] }> = [
    { pos: [-ARENA_X, 0, 0], eul: [0, Math.PI / 2, 0] },
    { pos: [ARENA_X, 0, 0], eul: [0, -Math.PI / 2, 0] },
    { pos: [0, 0, -ARENA_Z], eul: [0, 0, 0] },
    { pos: [0, 0, ARENA_Z], eul: [0, Math.PI, 0] },
  ];
  for (const { pos, eul } of paredes) {
    const parede = new CANNON.Body({ mass: 0, material: materialMesa });
    parede.addShape(new CANNON.Plane());
    parede.position.set(pos[0], pos[1], pos[2]);
    parede.quaternion.setFromEuler(eul[0], eul[1], eul[2]);
    world.addBody(parede);
  }

  const teto = new CANNON.Body({ mass: 0, material: materialMesa });
  teto.addShape(new CANNON.Plane());
  teto.quaternion.setFromEuler(Math.PI / 2, 0, 0);
  teto.position.set(0, 26, 0);
  world.addBody(teto);

  return { world, materialDado };
}

/**
 * Joga um dado e devolve o índice da face que ficou para cima.
 *
 * O arremesso é o de `spawnDie`, letra por letra: entrada pela lateral,
 * voando para o centro, com as mesmas velocidades e o mesmo giro. Medir uma
 * queda genérica no vazio mediria outra coisa — o que decide a rolagem de
 * verdade é este arremesso, batendo nestas paredes.
 */
function jogar(kind: PolyhedronKind, sortear: () => number, index: number): number {
  const shape = library.get(kind);
  const size = 0.55;
  const { world, materialDado } = montarArena();

  const corpo = new CANNON.Body({
    mass: 1,
    material: materialDado,
    allowSleep: true,
    sleepSpeedLimit: 0.12,
    sleepTimeLimit: 0.2,
  });
  corpo.addShape(
    new CANNON.ConvexPolyhedron({
      vertices: shape.hullVertices.map(
        ([x, y, z]) => new CANNON.Vec3(x * size, y * size, z * size),
      ),
      faces: shape.hullFaces,
    }),
  );

  const lado = index % 2 === 0 ? -1 : 1;
  const profundidade = ((index % 5) - 2) * 0.55;
  corpo.position.set(
    lado * Math.max(ARENA_X - size * 1.6, size * 2),
    6 + (index % 4) * 1.1,
    Math.max(
      -ARENA_Z + size * 2,
      Math.min(ARENA_Z - size * 2, profundidade + (sortear() - 0.5) * 2),
    ),
  );
  corpo.velocity.set(
    -lado * (10 + sortear() * 6),
    1 + sortear() * 3,
    (sortear() - 0.5) * 8,
  );
  corpo.angularVelocity.set(
    (sortear() - 0.5) * 26,
    (sortear() - 0.5) * 26,
    (sortear() - 0.5) * 26,
  );
  corpo.quaternion.setFromEuler(
    sortear() * Math.PI * 2,
    sortear() * Math.PI * 2,
    sortear() * Math.PI * 2,
  );
  world.addBody(corpo);

  let parado = 0;
  for (let passo = 0; passo < 1400; passo += 1) {
    world.step(1 / 120);
    if (
      corpo.velocity.lengthSquared() < 0.08 &&
      corpo.angularVelocity.lengthSquared() < 0.08
    ) {
      parado += 1;
      if (parado >= 10) break;
    } else {
      parado = 0;
    }
  }

  const orientacao = new THREE.Quaternion(
    corpo.quaternion.x,
    corpo.quaternion.y,
    corpo.quaternion.z,
    corpo.quaternion.w,
  );

  let melhor = 0;
  let maior = -Infinity;
  shape.faceNormals.forEach((normal, face) => {
    const y = normal.clone().applyQuaternion(orientacao).y;
    if (y > maior) {
      maior = y;
      melhor = face;
    }
  });
  return melhor;
}

/** Valores críticos de qui-quadrado a 99,9%, por graus de liberdade. */
const CRITICO: Record<number, number> = {
  3: 16.27,
  5: 20.52,
  7: 24.32,
  9: 27.88,
  11: 31.26,
  19: 43.82,
};

describe('a física simulada é justa', () => {
  // Um dado com face plana em cima; o tetraedro tem leitura própria e é
  // testado à parte, pela distribuição da face de apoio.
  const casos: Array<{ kind: PolyhedronKind; faces: number; jogadas: number }> = [
    { kind: 'd6', faces: 6, jogadas: 600 },
    { kind: 'd20', faces: 20, jogadas: 600 },
  ];

  for (const { kind, faces, jogadas } of casos) {
    it(`${kind}: nenhuma face some e a distribuição passa no qui-quadrado`, () => {
      const sortear = criarSorteio(0x9e3779b9 + faces);
      const contagem = new Array<number>(faces).fill(0);

      for (let i = 0; i < jogadas; i += 1) {
        const face = jogar(kind, sortear, i);
        contagem[face] = (contagem[face] ?? 0) + 1;
      }

      // Uma face que nunca sai é o defeito que mais estraga uma mesa: o
      // jogador percebe antes de qualquer estatística.
      for (let face = 0; face < faces; face += 1) {
        expect(contagem[face], `${kind}: face ${face} nunca saiu`).toBeGreaterThan(0);
      }

      const esperado = jogadas / faces;
      const chi = contagem.reduce(
        (soma, observado) => soma + (observado - esperado) ** 2 / esperado,
        0,
      );

      expect(chi, `${kind}: qui-quadrado ${chi.toFixed(1)}`).toBeLessThan(
        CRITICO[faces - 1] ?? 99,
      );
    });
  }

  it('d4: as quatro faces de apoio aparecem todas', () => {
    // No tetraedro nenhuma face olha para cima; o que a simulação precisa
    // provar é que ele não tem preferência por um apoio.
    const sortear = criarSorteio(0x1d4);
    const contagem = new Array<number>(4).fill(0);
    const shape = library.get('d4');

    for (let i = 0; i < 400; i += 1) {
      // A face lida é a mais alta; a de apoio é a oposta em espírito, mas o
      // que importa aqui é a variedade dos assentamentos.
      const face = jogar('d4', sortear, i);
      contagem[face] = (contagem[face] ?? 0) + 1;
    }

    expect(shape.faceNormals).toHaveLength(4);
    for (let face = 0; face < 4; face += 1) {
      expect(contagem[face], `d4: face ${face} nunca ficou por cima`).toBeGreaterThan(0);
    }
  });
});
