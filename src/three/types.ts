/**
 * Aion — contratos da camada 3D.
 * Acordo entre o módulo de geometrias/texturas e a cena.
 */

import type * as THREE from 'three';
import type { PolyhedronKind } from '@/engine/types';

/**
 * Descrição geométrica de um poliedro de dado, já pronta para render e
 * para física.
 */
export interface DieShape {
  kind: PolyhedronKind;
  /** Geometria com grupos de material — um grupo por face rotulada. */
  geometry: THREE.BufferGeometry;
  /**
   * Normal (unitária, espaço local) de cada face rotulada, na mesma ordem
   * dos grupos da geometria. Usada para descobrir qual face ficou para
   * cima após o assentamento.
   */
  faceNormals: THREE.Vector3[];
  /**
   * Valor impresso em cada face, na mesma ordem de `faceNormals`.
   * Para o d10 percentil (dezenas) os valores são 0,10,...,90.
   */
  faceValues: number[];
  /** Vértices do casco convexo, para o corpo rígido do cannon-es. */
  hullVertices: [number, number, number][];
  /** Faces do casco convexo (índices), para o corpo rígido. */
  hullFaces: number[][];
  /** Raio circunscrito, para escala e posicionamento. */
  radius: number;
}

/** Cache de geometrias — construir poliedro é caro, faça uma vez. */
export interface ShapeLibrary {
  get(kind: PolyhedronKind): DieShape;
  dispose(): void;
}

/** Opções para gerar a textura de uma face. */
export interface FaceTextureOptions {
  /** Número (ou "+"/"−"/"" para Fudge) impresso. */
  label: string;
  /** Cor do corpo do dado em hex. */
  body: string;
  /** Cor da gravação. */
  engraving: string;
  /** Lado da textura em px. */
  size?: number;
  /** Sublinha 6 e 9 para evitar ambiguidade. */
  underline?: boolean;
}
