/**
 * Texturas das faces dos dados, desenhadas em `<canvas>` na hora.
 *
 * Nenhum arquivo de imagem é carregado: um dado de 20 faces precisaria de
 * 20 texturas por skin, e gerar é mais barato (e mais nítido) do que baixar.
 */

import * as THREE from 'three';
import type { DiceSkin } from '@/state/types';
import type { FaceTextureOptions } from './types';

export interface SkinDefinition {
  /** Cor do corpo do dado. */
  body: string;
  /** Cor da gravação dos números. */
  engraving: string;
  metalness: number;
  roughness: number;
  /** Nome exibido na interface. */
  label: string;
}

export const SKIN_COLORS: Record<DiceSkin, SkinDefinition> = {
  ambar: {
    body: '#e8b563',
    engraving: '#3a2708',
    metalness: 0.25,
    roughness: 0.28,
    label: 'Âmbar',
  },
  obsidiana: {
    body: '#23272f',
    engraving: '#d8d3c6',
    metalness: 0.1,
    roughness: 0.62,
    label: 'Obsidiana',
  },
  esmeralda: {
    body: '#2f8f6c',
    engraving: '#eafff5',
    metalness: 0.3,
    roughness: 0.32,
    label: 'Esmeralda',
  },
  rubi: {
    body: '#a83744',
    engraving: '#ffe9ec',
    metalness: 0.3,
    roughness: 0.3,
    label: 'Rubi',
  },
  safira: {
    body: '#33619e',
    engraving: '#e8f2ff',
    metalness: 0.32,
    roughness: 0.3,
    label: 'Safira',
  },
  ametista: {
    body: '#75509e',
    engraving: '#f4ecff',
    metalness: 0.3,
    roughness: 0.32,
    label: 'Ametista',
  },
  osso: {
    body: '#ddd4c0',
    engraving: '#4a4034',
    metalness: 0.02,
    roughness: 0.78,
    label: 'Osso',
  },
  aco: {
    body: '#8f9aab',
    engraving: '#1d2229',
    metalness: 0.86,
    roughness: 0.24,
    label: 'Aço',
  },
};

export const SKIN_ORDER: DiceSkin[] = [
  'ambar',
  'obsidiana',
  'esmeralda',
  'rubi',
  'safira',
  'ametista',
  'osso',
  'aco',
];

/** Sem DOM (testes em node) devolvemos uma textura vazia, sem quebrar. */
function hasCanvas(): boolean {
  return typeof document !== 'undefined' && typeof document.createElement === 'function';
}

const emptyTexture = (): THREE.CanvasTexture => {
  const texture = new THREE.Texture();
  texture.needsUpdate = false;
  return texture as THREE.CanvasTexture;
};

/**
 * Desenha uma face.
 *
 * O fundo é pintado com a cor do corpo, e não deixado transparente: o
 * material multiplica a cor pelo mapa, então um fundo transparente (RGB
 * zero) renderizaria o dado inteiro preto. Pintar o corpo aqui também
 * resolve as bordas — as UVs extrapolam [0,1] de propósito, e o clamp
 * estende justamente a cor do corpo até os cantos da face.
 */
export function createFaceTexture(options: FaceTextureOptions): THREE.CanvasTexture {
  if (!hasCanvas()) return emptyTexture();

  const size = options.size ?? 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) return emptyTexture();

  const label = options.label;
  const center = size / 2;

  ctx.fillStyle = options.body;
  ctx.fillRect(0, 0, size, size);

  // Um brilho suave no centro da face dá relevo sem precisar de normal map.
  const sheen = ctx.createRadialGradient(
    center,
    center * 0.72,
    size * 0.04,
    center,
    center,
    size * 0.78,
  );
  sheen.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0.14)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, size, size);

  if (label.length > 0) {
    // O glifo ocupa um disco central; quanto mais dígitos, menor a fonte,
    // para que "100" caiba no mesmo espaço que "7".
    const digits = label.replace(/[^0-9]/g, '').length || 1;
    const base = size * 0.46;
    const fontSize = digits >= 3 ? base * 0.72 : digits === 2 ? base * 0.88 : base;

    ctx.font = `700 ${fontSize}px ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sombra deslocada para baixo dá a leitura de número gravado, não pintado.
    ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
    ctx.fillText(label, center, center + size * 0.014);

    ctx.fillStyle = options.engraving;
    ctx.fillText(label, center, center);

    if (options.underline) {
      const metrics = ctx.measureText(label);
      const width = Math.min(metrics.width * 0.82, size * 0.42);
      const y = center + fontSize * 0.44;
      ctx.strokeStyle = options.engraving;
      ctx.lineWidth = Math.max(2, size * 0.026);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(center - width / 2, y);
      ctx.lineTo(center + width / 2, y);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  // As UVs das faces extrapolam [0,1] de propósito: a textura é ajustada
  // ao círculo inscrito da face, então os cantos caem fora. O clamp
  // estende a cor do corpo pintada na borda do canvas.
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/** 6 e 9 giram no dado e viram um ao outro; o traço desfaz a dúvida. */
export function needsUnderline(value: number, sides: number): boolean {
  if (sides === 6 || sides === 9) return false;
  return value === 6 || value === 9;
}
