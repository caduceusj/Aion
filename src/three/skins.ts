/**
 * As peles dos dados: cor do corpo, da gravação e o acabamento.
 *
 * Só dados, sem `three`. A interface — o seletor de personagem, os ajustes, a
 * mesa compartilhada — precisa das cores desde o primeiro quadro, e importar
 * isto de `textures.ts` arrastaria o three inteiro (500 KB) para o pacote do
 * menu. O palco 3D, que é quem de fato precisa dele, carrega sob demanda.
 */

import type { DiceSkin } from '@/state/types';

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
