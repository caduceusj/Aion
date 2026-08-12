/**
 * Persistência em localStorage.
 *
 * Escrita à mão em vez do middleware `persist` do zustand: aqui a
 * validação do que volta do disco é explícita, e dados corrompidos
 * degradam para os padrões em vez de quebrar a aplicação.
 */

import type { Character, HistoryEntry, Macro, Settings } from './types';
import { DEFAULT_SETTINGS, SEED_CHARACTER, SEED_MACROS } from './seed';

const STORAGE_KEY = 'aion:v1';
const VERSION = 1;
const HISTORY_LIMIT = 50;
const SAVE_DEBOUNCE_MS = 300;

export interface PersistedState {
  history: HistoryEntry[];
  macros: Macro[];
  characters: Character[];
  activeCharacterId: string | null;
  settings: Settings;
}

export const DEFAULT_PERSISTED: PersistedState = {
  history: [],
  macros: SEED_MACROS,
  characters: [SEED_CHARACTER],
  activeCharacterId: SEED_CHARACTER.id,
  settings: DEFAULT_SETTINGS,
};

function storage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    // Modo privado de alguns navegadores lança só de tocar no localStorage.
    return null;
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const str = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const num = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const bool = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

function parseSettings(raw: unknown): Settings {
  if (!isObject(raw)) return { ...DEFAULT_SETTINGS };

  const skin = str(raw.defaultSkin, DEFAULT_SETTINGS.defaultSkin);
  const knownSkins = [
    'ambar',
    'obsidiana',
    'esmeralda',
    'rubi',
    'safira',
    'ametista',
    'osso',
    'aco',
  ];

  return {
    physics3d: bool(raw.physics3d, DEFAULT_SETTINGS.physics3d),
    sound: bool(raw.sound, DEFAULT_SETTINGS.sound),
    volume: Math.max(0, Math.min(1, num(raw.volume, DEFAULT_SETTINGS.volume))),
    haptics: bool(raw.haptics, DEFAULT_SETTINGS.haptics),
    rollSpeed: Math.max(0.5, Math.min(2, num(raw.rollSpeed, DEFAULT_SETTINGS.rollSpeed))),
    gmMode: bool(raw.gmMode, DEFAULT_SETTINGS.gmMode),
    reducedMotion: bool(raw.reducedMotion, DEFAULT_SETTINGS.reducedMotion),
    showSeeds: bool(raw.showSeeds, DEFAULT_SETTINGS.showSeeds),
    defaultSkin: (knownSkins.includes(skin) ? skin : 'ambar') as Settings['defaultSkin'],
  };
}

function parseCharacters(raw: unknown): Character[] {
  if (!Array.isArray(raw)) return [...DEFAULT_PERSISTED.characters];

  const characters = raw
    .filter(isObject)
    .filter((item) => typeof item.id === 'string' && item.id.length > 0)
    .map((item) => ({
      id: str(item.id),
      name: str(item.name, 'Sem nome').slice(0, 40),
      skin: parseSettings({ defaultSkin: item.skin }).defaultSkin,
      accent: str(item.accent, '#e8b563'),
      createdAt: num(item.createdAt, 0),
    }));

  return characters.length > 0 ? characters : [...DEFAULT_PERSISTED.characters];
}

function parseMacros(raw: unknown): Macro[] {
  if (!Array.isArray(raw)) return [...DEFAULT_PERSISTED.macros];

  return raw
    .filter(isObject)
    .filter(
      (item) =>
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.expression === 'string',
    )
    .map((item, index) => ({
      id: str(item.id),
      name: str(item.name).slice(0, 32),
      expression: str(item.expression).slice(0, 200),
      glyph: str(item.glyph, '🎲').slice(0, 4),
      characterId: typeof item.characterId === 'string' ? item.characterId : null,
      order: num(item.order, index),
      uses: Math.max(0, Math.floor(num(item.uses, 0))),
    }));
}

/** O histórico é o mais frágil: só aceita entradas com resultado íntegro. */
function parseHistory(raw: unknown): HistoryEntry[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(isObject)
    .filter((item) => {
      const result = item.result;
      return (
        typeof item.id === 'string' &&
        isObject(result) &&
        typeof result.expression === 'string' &&
        typeof result.total === 'number' &&
        Array.isArray(result.dice)
      );
    })
    .slice(0, HISTORY_LIMIT)
    .map((item) => ({
      id: str(item.id),
      result: item.result as HistoryEntry['result'],
      characterId: typeof item.characterId === 'string' ? item.characterId : null,
      macroName: typeof item.macroName === 'string' ? item.macroName : null,
      hidden: bool(item.hidden, false),
      pinned: bool(item.pinned, false),
    }));
}

export function loadState(): PersistedState {
  const store = storage();
  if (!store) return structuredCopy(DEFAULT_PERSISTED);

  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return structuredCopy(DEFAULT_PERSISTED);

    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed)) return structuredCopy(DEFAULT_PERSISTED);
    if (num(parsed.version, 0) !== VERSION) return structuredCopy(DEFAULT_PERSISTED);

    const characters = parseCharacters(parsed.characters);
    const activeId = typeof parsed.activeCharacterId === 'string' ? parsed.activeCharacterId : null;

    return {
      history: parseHistory(parsed.history),
      macros: parseMacros(parsed.macros),
      characters,
      // Um id ativo apontando para um personagem removido viraria uma mesa
      // sem dono; melhor cair no primeiro personagem.
      activeCharacterId: characters.some((c) => c.id === activeId)
        ? activeId
        : (characters[0]?.id ?? null),
      settings: parseSettings(parsed.settings),
    };
  } catch {
    return structuredCopy(DEFAULT_PERSISTED);
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function saveState(state: PersistedState): void {
  const store = storage();
  if (!store) return;

  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      store.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: VERSION,
          history: state.history.slice(0, HISTORY_LIMIT),
          macros: state.macros,
          characters: state.characters,
          activeCharacterId: state.activeCharacterId,
          settings: state.settings,
        }),
      );
    } catch {
      // Cota estourada ou storage bloqueado: a sessão continua na memória.
    }
  }, SAVE_DEBOUNCE_MS);
}

export function clearStoredState(): void {
  try {
    storage()?.removeItem(STORAGE_KEY);
  } catch {
    // Nada a fazer — seguir em frente.
  }
}

function structuredCopy(state: PersistedState): PersistedState {
  return {
    history: [...state.history],
    macros: state.macros.map((macro) => ({ ...macro })),
    characters: state.characters.map((character) => ({ ...character })),
    activeCharacterId: state.activeCharacterId,
    settings: { ...state.settings },
  };
}
