/**
 * Persistência em localStorage.
 *
 * Escrita à mão em vez do middleware `persist` do zustand: aqui a
 * validação do que volta do disco é explícita, e dados corrompidos
 * degradam para os padrões em vez de quebrar a aplicação.
 */

import type { Character, HistoryEntry, Macro, Settings } from './types';
import { fichaDeExemplo, fichaEmBranco, type Ficha } from '@/daggerheart/ficha';
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
  fichas: Ficha[];
  fichaAtivaId: string | null;
  /** Endereço do relay da mesa, para não redigitar a cada sessão. */
  relayUrl: string;
  souMestre: boolean;
}

const FICHA_EXEMPLO = fichaDeExemplo('fic_exemplo');

export const DEFAULT_PERSISTED: PersistedState = {
  history: [],
  macros: SEED_MACROS,
  characters: [SEED_CHARACTER],
  activeCharacterId: SEED_CHARACTER.id,
  settings: DEFAULT_SETTINGS,
  fichas: [FICHA_EXEMPLO],
  fichaAtivaId: FICHA_EXEMPLO.id,
  relayUrl: '',
  souMestre: false,
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

/**
 * Fichas voltam do disco campo a campo, sobre uma ficha em branco. Uma ficha
 * salva por uma versão anterior do app continua abrindo, só que com os
 * campos novos nos padrões.
 */
function parseFichas(raw: unknown): Ficha[] {
  if (!Array.isArray(raw)) return [...DEFAULT_PERSISTED.fichas];

  const fichas = raw
    .filter(isObject)
    .filter((item) => typeof item.id === 'string')
    .map((item) => {
      const base = fichaEmBranco(str(item.id), str(item.nome, 'Sem nome'));
      const atributos = isObject(item.atributos) ? item.atributos : {};

      return {
        ...base,
        nome: str(item.nome, base.nome).slice(0, 40),
        nivel: Math.max(1, Math.min(10, Math.floor(num(item.nivel, base.nivel)))),
        classe: str(item.classe, '').slice(0, 40),
        ancestralidade: str(item.ancestralidade, '').slice(0, 40),
        comunidade: str(item.comunidade, '').slice(0, 40),
        atributos: {
          agilidade: num(atributos.agilidade, 0),
          forca: num(atributos.forca, 0),
          precisao: num(atributos.precisao, 0),
          instinto: num(atributos.instinto, 0),
          presenca: num(atributos.presenca, 0),
          saber: num(atributos.saber, 0),
        },
        evasao: num(item.evasao, base.evasao),
        limiarMaior: num(item.limiarMaior, base.limiarMaior),
        limiarSevero: num(item.limiarSevero, base.limiarSevero),
        pontosDeVidaTotal: num(item.pontosDeVidaTotal, base.pontosDeVidaTotal),
        pontosDeVidaMarcados: num(item.pontosDeVidaMarcados, 0),
        estresseTotal: num(item.estresseTotal, base.estresseTotal),
        estresseMarcado: num(item.estresseMarcado, 0),
        armaduraTotal: num(item.armaduraTotal, base.armaduraTotal),
        armaduraMarcada: num(item.armaduraMarcada, 0),
        esperanca: num(item.esperanca, base.esperanca),
        armas: Array.isArray(item.armas)
          ? item.armas.filter(isObject).map((arma, index) => ({
              id: str(arma.id, `arm_${index}`),
              nome: str(arma.nome, 'Arma').slice(0, 40),
              atributo: str(arma.atributo, 'forca') as Ficha['armas'][number]['atributo'],
              dado: str(arma.dado, 'd6') as Ficha['armas'][number]['dado'],
              bonus: num(arma.bonus, 0),
              tipo: arma.tipo === 'magico' ? ('magico' as const) : ('fisico' as const),
              alcance: str(arma.alcance, '').slice(0, 30),
            }))
          : [],
        experiencias: Array.isArray(item.experiencias)
          ? item.experiencias.filter(isObject).map((exp, index) => ({
              id: str(exp.id, `exp_${index}`),
              nome: str(exp.nome, 'Experiência').slice(0, 40),
              bonus: num(exp.bonus, 2),
            }))
          : [],
        proficienciaManual:
          typeof item.proficienciaManual === 'number'
            ? Math.max(1, Math.floor(item.proficienciaManual))
            : null,
        classeId: typeof item.classeId === 'string' ? item.classeId : null,
        subclasseId: typeof item.subclasseId === 'string' ? item.subclasseId : null,
        ancestralidadeId:
          typeof item.ancestralidadeId === 'string' ? item.ancestralidadeId : null,
        comunidadeId: typeof item.comunidadeId === 'string' ? item.comunidadeId : null,
        cartas: Array.isArray(item.cartas)
          ? item.cartas.filter((carta): carta is string => typeof carta === 'string')
          : [],
      };
    });

  return fichas.length > 0 ? fichas : [fichaDeExemplo('fic_exemplo')];
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

    const fichas = parseFichas(parsed.fichas);
    const fichaAtiva = typeof parsed.fichaAtivaId === 'string' ? parsed.fichaAtivaId : null;

    return {
      fichas,
      fichaAtivaId: fichas.some((ficha) => ficha.id === fichaAtiva)
        ? fichaAtiva
        : (fichas[0]?.id ?? null),
      relayUrl: str(parsed.relayUrl, ''),
      souMestre: bool(parsed.souMestre, false),
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
          fichas: state.fichas,
          fichaAtivaId: state.fichaAtivaId,
          relayUrl: state.relayUrl,
          souMestre: state.souMestre,
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
    fichas: state.fichas.map((ficha) => ({
      ...ficha,
      atributos: { ...ficha.atributos },
      armas: ficha.armas.map((arma) => ({ ...arma })),
      experiencias: ficha.experiencias.map((exp) => ({ ...exp })),
    })),
    fichaAtivaId: state.fichaAtivaId,
    relayUrl: state.relayUrl,
    souMestre: state.souMestre,
  };
}
