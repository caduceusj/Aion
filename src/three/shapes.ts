/**
 * Geometrias poliédricas dos dados.
 *
 * As faces não são transcritas à mão. Cada sólido é definido apenas pelos
 * seus vértices, e um detector de planos de suporte descobre as faces —
 * o mesmo código serve ao tetraedro e ao dodecaedro, e não há listas de
 * índices para errar.
 */

import * as THREE from 'three';
import type { PolyhedronKind } from '@/engine/types';
import type { DieShape, ShapeLibrary } from './types';

type V3 = [number, number, number];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const length = (a: V3): number => Math.sqrt(dot(a, a));

function normalize(a: V3): V3 {
  const l = length(a);
  return l < 1e-12 ? [0, 0, 0] : [a[0] / l, a[1] / l, a[2] / l];
}

const PHI = (1 + Math.sqrt(5)) / 2;
const INV_PHI = 1 / PHI;

/** Todas as combinações de sinal de uma tripla. */
function signPermutations(x: number, y: number, z: number): V3[] {
  const out: V3[] = [];
  for (const sx of x === 0 ? [0] : [1, -1]) {
    for (const sy of y === 0 ? [0] : [1, -1]) {
      for (const sz of z === 0 ? [0] : [1, -1]) {
        out.push([x * (sx || 1), y * (sy || 1), z * (sz || 1)]);
      }
    }
  }
  return out;
}

/** Rotações cíclicas das coordenadas, com todos os sinais. */
function cyclicPermutations(a: number, b: number, c: number): V3[] {
  return [
    ...signPermutations(a, b, c),
    ...signPermutations(c, a, b),
    ...signPermutations(b, c, a),
  ];
}

function dedupeVertices(vertices: V3[]): V3[] {
  const out: V3[] = [];
  for (const v of vertices) {
    const duplicate = out.some(
      (w) => Math.abs(w[0] - v[0]) < 1e-9 && Math.abs(w[1] - v[1]) < 1e-9 && Math.abs(w[2] - v[2]) < 1e-9,
    );
    if (!duplicate) out.push(v);
  }
  return out;
}

// --------------------------------------------------------------- sólidos

/**
 * Trapezoedro pentagonal — o corpo do d10.
 *
 * Os dez losangos só são planos para uma razão exata entre a altura dos
 * ápices e a dos anéis equatoriais. Ela sai de exigir que o ápice, dois
 * vértices vizinhos do anel de cima e o vértice do anel de baixo entre eles
 * caiam no mesmo plano.
 */
function pentagonalTrapezohedron(): V3[] {
  const s72 = Math.sin((2 * Math.PI) / 5);
  const c72 = Math.cos((2 * Math.PI) / 5);
  const s36 = Math.sin(Math.PI / 5);
  const c36 = Math.cos(Math.PI / 5);

  const k = -s72 * c36 + (c72 - 1) * s36;
  const height = 1;
  const ring = (height * (k + s72)) / (k - s72);

  const vertices: V3[] = [
    [0, 0, height],
    [0, 0, -height],
  ];

  for (let i = 0; i < 5; i += 1) {
    const upper = (i * 2 * Math.PI) / 5;
    const lower = upper + Math.PI / 5;
    vertices.push([Math.cos(upper), Math.sin(upper), ring]);
    vertices.push([Math.cos(lower), Math.sin(lower), -ring]);
  }

  return vertices;
}

function verticesFor(kind: PolyhedronKind): V3[] {
  switch (kind) {
    case 'd4':
      return [
        [1, 1, 1],
        [-1, -1, 1],
        [-1, 1, -1],
        [1, -1, -1],
      ];
    case 'd6':
    case 'dF':
      return signPermutations(1, 1, 1);
    case 'd8':
      return cyclicPermutations(1, 0, 0);
    case 'd10':
    case 'd100':
      return pentagonalTrapezohedron();
    case 'd12':
      return dedupeVertices([
        ...signPermutations(1, 1, 1),
        ...cyclicPermutations(0, INV_PHI, PHI),
      ]);
    case 'd20':
      return dedupeVertices(cyclicPermutations(0, 1, PHI));
  }
}

// ------------------------------------------------------- detecção de faces

/**
 * Descobre as faces de um poliedro convexo centrado na origem.
 *
 * Para cada trinca de vértices, testa se o plano que eles definem deixa
 * todos os demais vértices de um lado só. Se deixa, é uma face — e todos
 * os vértices sobre esse plano pertencem a ela.
 */
function detectFaces(vertices: V3[], tolerance = 1e-6): number[][] {
  const faces: number[][] = [];
  // Planos já encontrados, comparados por direção. Uma chave de string
  // arredondada não serve: "-0.00000" e "0.00000" são o mesmo plano.
  const found: V3[] = [];
  const count = vertices.length;

  for (let i = 0; i < count; i += 1) {
    for (let j = i + 1; j < count; j += 1) {
      for (let k = j + 1; k < count; k += 1) {
        const a = vertices[i];
        const b = vertices[j];
        const c = vertices[k];
        if (!a || !b || !c) continue;

        const raw = cross(sub(b, a), sub(c, a));
        if (length(raw) < tolerance) continue; // colineares

        let normal = normalize(raw);
        let distance = dot(normal, a);

        // Queremos sempre a normal apontando para fora.
        if (distance < 0) {
          normal = [-normal[0], -normal[1], -normal[2]];
          distance = -distance;
        }
        if (distance < tolerance) continue; // plano passa pela origem

        const supporting = vertices.every((v) => dot(normal, v) <= distance + tolerance);
        if (!supporting) continue;

        if (found.some((other) => dot(other, normal) > 0.9999)) continue;
        found.push(normal);

        const members: number[] = [];
        for (let m = 0; m < count; m += 1) {
          const v = vertices[m];
          if (v && Math.abs(dot(normal, v) - distance) < tolerance * 10) members.push(m);
        }

        faces.push(orderFace(vertices, members, normal));
      }
    }
  }

  return faces;
}

/** Ordena os vértices da face em sentido anti-horário visto de fora. */
function orderFace(vertices: V3[], members: number[], normal: V3): number[] {
  const centroid = faceCentroid(vertices, members);
  const first = vertices[members[0] ?? 0];
  if (!first) return members;

  const e1 = normalize(sub(first, centroid));
  const e2 = cross(normal, e1);

  return [...members].sort((left, right) => {
    const p = vertices[left];
    const q = vertices[right];
    if (!p || !q) return 0;
    const dp = sub(p, centroid);
    const dq = sub(q, centroid);
    return Math.atan2(dot(dp, e2), dot(dp, e1)) - Math.atan2(dot(dq, e2), dot(dq, e1));
  });
}

/**
 * Normal do plano da face pelo método de Newell, apontando para fora.
 *
 * Não dá para usar a direção do centroide: nos sólidos platônicos ela
 * coincide com a normal por simetria, mas nos losangos do trapezoedro do
 * d10 ela não coincide — e é justamente a normal que diz qual face ficou
 * para cima quando o dado para.
 */
function facePlaneNormal(vertices: V3[], members: number[]): V3 {
  const accumulated: V3 = [0, 0, 0];

  for (let i = 0; i < members.length; i += 1) {
    const current = vertices[members[i] ?? 0];
    const next = vertices[members[(i + 1) % members.length] ?? 0];
    if (!current || !next) continue;
    accumulated[0] += (current[1] - next[1]) * (current[2] + next[2]);
    accumulated[1] += (current[2] - next[2]) * (current[0] + next[0]);
    accumulated[2] += (current[0] - next[0]) * (current[1] + next[1]);
  }

  const normal = normalize(accumulated);
  const centroid = faceCentroid(vertices, members);
  return dot(normal, centroid) < 0 ? [-normal[0], -normal[1], -normal[2]] : normal;
}

function faceCentroid(vertices: V3[], members: number[]): V3 {
  const sum: V3 = [0, 0, 0];
  for (const index of members) {
    const v = vertices[index];
    if (!v) continue;
    sum[0] += v[0];
    sum[1] += v[1];
    sum[2] += v[2];
  }
  const n = Math.max(1, members.length);
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

/** Menor distância do centro da face às suas arestas. */
function faceInradius(vertices: V3[], members: number[], centroid: V3): number {
  let smallest = Number.POSITIVE_INFINITY;
  for (let i = 0; i < members.length; i += 1) {
    const a = vertices[members[i] ?? 0];
    const b = vertices[members[(i + 1) % members.length] ?? 0];
    if (!a || !b) continue;
    const edge = sub(b, a);
    const edgeLength = length(edge);
    if (edgeLength < 1e-12) continue;
    const distance = length(cross(edge, sub(centroid, a))) / edgeLength;
    smallest = Math.min(smallest, distance);
  }
  return Number.isFinite(smallest) ? smallest : 0.5;
}

// ---------------------------------------------------- valores das faces

/**
 * Emparelha faces opostas e distribui os valores de modo que faces
 * opostas somem `sides + 1` — a convenção de todo dado de verdade.
 */
function pairOpposites(normals: V3[]): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  const used = new Set<number>();

  for (let i = 0; i < normals.length; i += 1) {
    if (used.has(i)) continue;
    const ni = normals[i];
    if (!ni) continue;

    let best = -1;
    let bestDot = 0;
    for (let j = 0; j < normals.length; j += 1) {
      if (j === i || used.has(j)) continue;
      const nj = normals[j];
      if (!nj) continue;
      const d = dot(ni, nj);
      if (d < bestDot) {
        bestDot = d;
        best = j;
      }
    }

    if (best >= 0 && bestDot < -0.98) {
      used.add(i);
      used.add(best);
      pairs.push([i, best]);
    }
  }

  return pairs;
}

function assignFaceValues(kind: PolyhedronKind, normals: V3[]): number[] {
  const total = normals.length;
  const values = new Array<number>(total).fill(0);

  // O tetraedro não tem faces opostas — numeração direta.
  if (kind === 'd4') {
    for (let i = 0; i < total; i += 1) values[i] = i + 1;
    return values;
  }

  const pairs = pairOpposites(normals);

  if (kind === 'dF') {
    // Duas faces "+", duas "−" e duas vazias, com opostas somando zero.
    const fudge = [1, 0, -1];
    pairs.forEach(([a, b], index) => {
      const value = fudge[index % fudge.length] ?? 0;
      values[a] = value;
      values[b] = -value;
    });
    return values;
  }

  if (kind === 'd100') {
    // Dado das dezenas: 00, 10, … 90, com opostas somando 90.
    pairs.forEach(([a, b], index) => {
      values[a] = index * 10;
      values[b] = 90 - index * 10;
    });
    return values;
  }

  pairs.forEach(([a, b], index) => {
    values[a] = index + 1;
    values[b] = total + 1 - (index + 1);
  });

  // Rede de segurança: se algum par não foi encontrado, completa com os
  // valores que sobraram, para nunca existir face sem número.
  const missing = values
    .map((value, index) => (value === 0 ? index : -1))
    .filter((index) => index >= 0);
  if (missing.length > 0) {
    const taken = new Set(values.filter((value) => value !== 0));
    let next = 1;
    for (const index of missing) {
      while (taken.has(next)) next += 1;
      values[index] = next;
      taken.add(next);
    }
  }

  return values;
}

// ------------------------------------------------------------ construção

function buildShape(kind: PolyhedronKind): DieShape {
  const raw = verticesFor(kind);

  // Normaliza para raio circunscrito 1: todos os dados passam a viver na
  // mesma escala, e a cena decide o tamanho real.
  const maxRadius = Math.max(...raw.map((v) => length(v)));
  const vertices: V3[] = raw.map((v) => [v[0] / maxRadius, v[1] / maxRadius, v[2] / maxRadius]);

  const faces = detectFaces(vertices);

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const faceNormals: THREE.Vector3[] = [];
  const rawNormals: V3[] = [];

  const geometry = new THREE.BufferGeometry();
  let vertexCursor = 0;

  faces.forEach((members, faceIndex) => {
    const centroid = faceCentroid(vertices, members);
    const normal = facePlaneNormal(vertices, members);
    rawNormals.push(normal);
    faceNormals.push(new THREE.Vector3(normal[0], normal[1], normal[2]));

    const first = vertices[members[0] ?? 0];
    if (!first) return;

    // Base de textura: o primeiro vértice aponta para o topo do número, e
    // (u, v, n) é destro para o glifo não sair espelhado.
    const v = normalize(sub(first, centroid));
    const u = cross(v, normal);

    const inradius = faceInradius(vertices, members, centroid);
    const scale = inradius > 1e-9 ? 0.5 / inradius : 1;

    const start = vertexCursor;

    // Leque a partir do primeiro vértice: preserva o sentido anti-horário.
    for (let i = 1; i < members.length - 1; i += 1) {
      const triangle = [members[0], members[i], members[i + 1]];
      for (const index of triangle) {
        const point = vertices[index ?? 0];
        if (!point) continue;
        positions.push(point[0], point[1], point[2]);
        normals.push(normal[0], normal[1], normal[2]);

        const offset = sub(point, centroid);
        uvs.push(0.5 + dot(offset, u) * scale, 0.5 + dot(offset, v) * scale);
        vertexCursor += 1;
      }
    }

    geometry.addGroup(start, vertexCursor - start, faceIndex);
  });

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeBoundingSphere();

  return {
    kind,
    geometry,
    faceNormals,
    faceValues: assignFaceValues(kind, rawNormals),
    hullVertices: vertices,
    hullFaces: faces,
    radius: 1,
  };
}

export function createShapeLibrary(): ShapeLibrary {
  const cache = new Map<PolyhedronKind, DieShape>();

  return {
    get(kind: PolyhedronKind): DieShape {
      const cached = cache.get(kind);
      if (cached) return cached;
      const shape = buildShape(kind);
      cache.set(kind, shape);
      return shape;
    },
    dispose() {
      for (const shape of cache.values()) shape.geometry.dispose();
      cache.clear();
    },
  };
}

/** Exposto para os testes — construir sem passar pelo cache. */
export const __buildShape = buildShape;
