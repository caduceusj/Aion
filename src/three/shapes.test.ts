import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import type { PolyhedronKind } from '@/engine/types';
import type { DieShape } from './types';
import { createShapeLibrary } from './shapes';
import { SKIN_COLORS, SKIN_ORDER, createFaceTexture, needsUnderline } from './textures';

const library = createShapeLibrary();

const EXPECTED_FACES: Record<PolyhedronKind, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
  d100: 10,
  dF: 6,
};

const KINDS = Object.keys(EXPECTED_FACES) as PolyhedronKind[];

describe('contagem de faces', () => {
  for (const kind of KINDS) {
    it(`${kind} tem ${EXPECTED_FACES[kind]} faces`, () => {
      const shape = library.get(kind);
      expect(shape.faceNormals).toHaveLength(EXPECTED_FACES[kind]);
      expect(shape.faceValues).toHaveLength(EXPECTED_FACES[kind]);
      expect(shape.hullFaces).toHaveLength(EXPECTED_FACES[kind]);
    });
  }
});

describe('geometria', () => {
  for (const kind of KINDS) {
    it(`${kind} tem normais unitárias`, () => {
      for (const normal of library.get(kind).faceNormals) {
        expect(normal.length()).toBeCloseTo(1, 6);
      }
    });

    it(`${kind} está normalizado no raio 1`, () => {
      const shape = library.get(kind);
      expect(shape.radius).toBe(1);
      const radii = shape.hullVertices.map(([x, y, z]) => Math.hypot(x, y, z));
      expect(Math.max(...radii)).toBeCloseTo(1, 6);
    });

    it(`${kind} referencia apenas índices válidos`, () => {
      const shape = library.get(kind);
      for (const face of shape.hullFaces) {
        expect(face.length).toBeGreaterThanOrEqual(3);
        for (const index of face) {
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThan(shape.hullVertices.length);
        }
        expect(new Set(face).size).toBe(face.length);
      }
    });

    it(`${kind} produz uma geometria com um grupo por face`, () => {
      const shape = library.get(kind);
      expect(shape.geometry.groups).toHaveLength(EXPECTED_FACES[kind]);
      const position = shape.geometry.getAttribute('position');
      const uv = shape.geometry.getAttribute('uv');
      expect(position.count).toBeGreaterThan(0);
      expect(uv.count).toBe(position.count);

      // Todo vértice aparece em exatamente um grupo.
      const covered = shape.geometry.groups.reduce((sum, group) => sum + group.count, 0);
      expect(covered).toBe(position.count);
    });

    it(`${kind} centraliza a textura em cada face`, () => {
      // As UVs são ajustadas ao círculo inscrito da face, então os cantos
      // extrapolam [0,1] de propósito. O que precisa valer é que cada face
      // fique centrada no meio da textura — é ali que o número é desenhado.
      const shape = library.get(kind);
      const uv = shape.geometry.getAttribute('uv');

      for (const group of shape.geometry.groups) {
        // A triangulação em leque repete vértices, então a média precisa
        // ser sobre os vértices distintos do polígono.
        const distinct = new Map<string, [number, number]>();
        let maxOffset = 0;
        for (let i = group.start; i < group.start + group.count; i += 1) {
          const x = uv.getX(i);
          const y = uv.getY(i);
          distinct.set(`${x.toFixed(6)}:${y.toFixed(6)}`, [x, y]);
          maxOffset = Math.max(maxOffset, Math.hypot(x - 0.5, y - 0.5));
        }

        const corners = [...distinct.values()];
        const sumX = corners.reduce((sum, [x]) => sum + x, 0);
        const sumY = corners.reduce((sum, [, y]) => sum + y, 0);
        expect(sumX / corners.length).toBeCloseTo(0.5, 5);
        expect(sumY / corners.length).toBeCloseTo(0.5, 5);
        // O glifo vive dentro do raio 0,3; a face precisa cobri-lo com folga
        // sem se espalhar tanto que o número vire um ponto.
        expect(maxOffset).toBeGreaterThan(0.35);
        expect(maxOffset).toBeLessThan(1.6);
      }
    });

    it(`${kind} tem faces planas`, () => {
      const shape = library.get(kind);
      shape.hullFaces.forEach((face, faceIndex) => {
        const normal = shape.faceNormals[faceIndex];
        expect(normal).toBeDefined();
        if (!normal) return;
        const distances = face.map((index) => {
          const vertex = shape.hullVertices[index];
          if (!vertex) return 0;
          return normal.x * vertex[0] + normal.y * vertex[1] + normal.z * vertex[2];
        });
        const spread = Math.max(...distances) - Math.min(...distances);
        expect(spread).toBeLessThan(1e-5);
      });
    });

    it(`${kind} tem winding para fora`, () => {
      const shape = library.get(kind);
      shape.hullFaces.forEach((face, faceIndex) => {
        const a = shape.hullVertices[face[0] ?? 0];
        const b = shape.hullVertices[face[1] ?? 0];
        const c = shape.hullVertices[face[2] ?? 0];
        const expected = shape.faceNormals[faceIndex];
        if (!a || !b || !c || !expected) return;

        const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]] as const;
        const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]] as const;
        const nx = ab[1] * ac[2] - ab[2] * ac[1];
        const ny = ab[2] * ac[0] - ab[0] * ac[2];
        const nz = ab[0] * ac[1] - ab[1] * ac[0];
        const dot = nx * expected.x + ny * expected.y + nz * expected.z;
        expect(dot).toBeGreaterThan(0);
      });
    });
  }
});

describe('numeração das faces', () => {
  const opposites: PolyhedronKind[] = ['d6', 'd8', 'd10', 'd12', 'd20'];

  for (const kind of opposites) {
    it(`${kind} numera de 1 a N sem repetir`, () => {
      const shape = library.get(kind);
      const sorted = [...shape.faceValues].sort((a, b) => a - b);
      expect(sorted).toEqual(
        Array.from({ length: EXPECTED_FACES[kind] }, (_, i) => i + 1),
      );
    });

    it(`${kind} tem faces opostas somando N+1`, () => {
      const shape = library.get(kind);
      const total = EXPECTED_FACES[kind];

      shape.faceNormals.forEach((normal, index) => {
        let best = -1;
        let bestDot = 0;
        shape.faceNormals.forEach((other, otherIndex) => {
          if (otherIndex === index) return;
          const d = normal.dot(other);
          if (d < bestDot) {
            bestDot = d;
            best = otherIndex;
          }
        });

        expect(bestDot).toBeLessThan(-0.98);
        const a = shape.faceValues[index] ?? 0;
        const b = shape.faceValues[best] ?? 0;
        expect(a + b).toBe(total + 1);
      });
    });
  }

  it('d4 numera de 1 a 4', () => {
    expect([...library.get('d4').faceValues].sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
  });

  it('d100 usa as dezenas de 0 a 90', () => {
    const values = [...library.get('d100').faceValues].sort((a, b) => a - b);
    expect(values).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  });

  it('dF traz duas faces de cada símbolo', () => {
    const values = library.get('dF').faceValues;
    expect(values.filter((v) => v === 1)).toHaveLength(2);
    expect(values.filter((v) => v === -1)).toHaveLength(2);
    expect(values.filter((v) => v === 0)).toHaveLength(2);
  });
});

describe('cache da biblioteca', () => {
  it('devolve a mesma instância para o mesmo tipo', () => {
    expect(library.get('d20')).toBe(library.get('d20'));
  });

  it('dispose limpa o cache sem lançar', () => {
    const scratch = createShapeLibrary();
    scratch.get('d6');
    expect(() => scratch.dispose()).not.toThrow();
  });
});

describe('texturas', () => {
  it('não quebra sem DOM', () => {
    expect(() =>
      createFaceTexture({ label: '20', body: '#fff', engraving: '#000' }),
    ).not.toThrow();
  });

  it('cobre todas as skins com cores e acabamento', () => {
    for (const skin of SKIN_ORDER) {
      const definition = SKIN_COLORS[skin];
      expect(definition.body).toMatch(/^#[0-9a-f]{6}$/i);
      expect(definition.engraving).toMatch(/^#[0-9a-f]{6}$/i);
      expect(definition.metalness).toBeGreaterThanOrEqual(0);
      expect(definition.metalness).toBeLessThanOrEqual(1);
      expect(definition.roughness).toBeGreaterThanOrEqual(0);
      expect(definition.roughness).toBeLessThanOrEqual(1);
      expect(definition.label.length).toBeGreaterThan(0);
    }
    expect(SKIN_ORDER).toHaveLength(Object.keys(SKIN_COLORS).length);
  });

  it('sublinha apenas 6 e 9 em dados que os confundem', () => {
    expect(needsUnderline(6, 20)).toBe(true);
    expect(needsUnderline(9, 20)).toBe(true);
    expect(needsUnderline(8, 20)).toBe(false);
    expect(needsUnderline(6, 6)).toBe(false);
  });
});

describe('ler a face de cima', () => {
  const testaveis: PolyhedronKind[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100', 'dF'];

  /** A mesma leitura que a cena faz: a normal mais alinhada com a vertical. */
  function faceMaisAlta(shape: DieShape, orientacao: THREE.Quaternion): number {
    let melhor = 0;
    let maior = -Infinity;
    shape.faceNormals.forEach((normal, index) => {
      const y = normal.clone().applyQuaternion(orientacao).y;
      if (y > maior) {
        maior = y;
        melhor = index;
      }
    });
    return melhor;
  }

  for (const kind of testaveis) {
    const shape = library.get(kind);

    it(`${kind}: deitar uma face para cima e lê-la de volta devolve a mesma face`, () => {
      // É a garantia de que `exibir` mostra o número que prometeu: girar o
      // dado para a face F ficar em cima e depois ler tem que dar F.
      shape.faceNormals.forEach((normal, index) => {
        const orientacao = new THREE.Quaternion().setFromUnitVectors(
          normal.clone().normalize(),
          new THREE.Vector3(0, 1, 0),
        );
        expect(faceMaisAlta(shape, orientacao), `${kind}: face ${index}`).toBe(index);
      });
    });

    it(`${kind}: toda face tem um número e a leitura nunca cai fora`, () => {
      expect(shape.faceValues).toHaveLength(shape.faceNormals.length);
      for (const value of shape.faceValues) expect(Number.isFinite(value)).toBe(true);
    });
  }

  it('a leitura de um d20 assentado devolve um valor de 1 a 20', () => {
    const shape = library.get('d20');
    for (let i = 0; i < shape.faceNormals.length; i += 1) {
      const normal = shape.faceNormals[i];
      if (!normal) continue;
      const orientacao = new THREE.Quaternion().setFromUnitVectors(
        normal.clone().normalize(),
        new THREE.Vector3(0, 1, 0),
      );
      const lido = shape.faceValues[faceMaisAlta(shape, orientacao)] ?? 0;
      expect(lido).toBeGreaterThanOrEqual(1);
      expect(lido).toBeLessThanOrEqual(20);
    }
  });
});
