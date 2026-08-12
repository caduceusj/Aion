/**
 * Estado de estreia: a mesa nunca abre vazia.
 *
 * Um personagem e alguns atalhos que cobrem o que realmente se rola em uma
 * sessão, para que o primeiro clique já role um dado de verdade.
 */

import type { Character, Macro, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  physics3d: true,
  sound: true,
  volume: 0.7,
  haptics: true,
  rollSpeed: 1,
  gmMode: false,
  reducedMotion: false,
  showSeeds: false,
  defaultSkin: 'ambar',
};

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

export const SEED_CHARACTER: Character = {
  id: 'chr_aventureiro',
  name: 'Aventureiro',
  skin: 'ambar',
  accent: '#e8b563',
  createdAt: 0,
};

export const SEED_MACROS: Macro[] = [
  {
    id: 'mac_ataque',
    name: 'Ataque',
    expression: '1d20+5',
    glyph: '⚔️',
    characterId: SEED_CHARACTER.id,
    order: 0,
    uses: 0,
  },
  {
    id: 'mac_dano',
    name: 'Dano',
    expression: '1d8+3',
    glyph: '🩸',
    characterId: SEED_CHARACTER.id,
    order: 1,
    uses: 0,
  },
  {
    id: 'mac_iniciativa',
    name: 'Iniciativa',
    expression: '1d20+2',
    glyph: '⚡',
    characterId: SEED_CHARACTER.id,
    order: 2,
    uses: 0,
  },
  {
    id: 'mac_resistencia',
    name: 'Resistência',
    expression: '1d20+3',
    glyph: '🛡️',
    characterId: SEED_CHARACTER.id,
    order: 3,
    uses: 0,
  },
  {
    id: 'mac_pericia',
    name: 'Perícia',
    expression: '1d20+7',
    glyph: '🎯',
    characterId: SEED_CHARACTER.id,
    order: 4,
    uses: 0,
  },
  {
    id: 'mac_atributos',
    name: 'Atributos',
    expression: '4d6kh3',
    glyph: '✨',
    characterId: null,
    order: 5,
    uses: 0,
  },
];
