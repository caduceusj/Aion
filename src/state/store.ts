/**
 * Store da aplicação.
 *
 * O ciclo de uma rolagem passa todo por aqui:
 *   rollExpression → motor avalia → entra no histórico → pendingRequest
 *   → a cena 3D executa → onStageSettled → fase 'revelado'
 *
 * Com a física desligada o caminho encurta: o resultado já nasce revelado.
 */

import { create } from 'zustand';
import type { PolyhedronKind } from '@/engine/types';
import { tryRoll, validate } from '@/engine';
import type {
  AionState,
  Character,
  DiceSkin,
  HistoryEntry,
  Macro,
  PanelId,
} from './types';
import { uid } from './ids';
import { loadState, saveState } from './persistence';
import { prefersReducedMotion } from './seed';

const HISTORY_LIMIT = 200;

/** Mantém as fixadas e as mais recentes; o resto envelhece e sai. */
function trimHistory(entries: HistoryEntry[]): HistoryEntry[] {
  if (entries.length <= HISTORY_LIMIT) return entries;

  const pinnedCount = entries.filter((entry) => entry.pinned).length;
  const room = Math.max(0, HISTORY_LIMIT - pinnedCount);

  const survivors = new Set<string>();
  let taken = 0;
  for (const entry of entries) {
    if (entry.pinned) continue;
    if (taken >= room) break;
    survivors.add(entry.id);
    taken += 1;
  }

  return entries.filter((entry) => entry.pinned || survivors.has(entry.id));
}

/**
 * Um campo com apenas "+3" ou "-1" é um modificador solto: o jogador quer
 * somá-lo ao próximo dado rápido, não rolar um número.
 */
function loneModifier(input: string): string {
  const match = input.trim().match(/^([+-])\s*(\d{1,3})$/);
  if (!match) return '';
  return `${match[1]}${match[2]}`;
}

function notationFor(shape: PolyhedronKind, count: number): string {
  if (shape === 'd100') return `${count}d%`;
  if (shape === 'dF') return `${count}dF`;
  return `${count}${shape}`;
}

const persisted = loadState();

/** Respeita a preferência do sistema na primeira abertura. */
const initialSettings = {
  ...persisted.settings,
  reducedMotion: persisted.settings.reducedMotion || prefersReducedMotion(),
};

export const useAionStore = create<AionState>((set, get) => ({
  history: persisted.history,
  macros: persisted.macros,
  characters: persisted.characters,
  activeCharacterId: persisted.activeCharacterId,
  settings: initialSettings,

  input: '',
  inputError: null,
  phase: 'ocioso',
  pendingRequest: null,
  lastResult: null,
  lastEntryId: null,
  panel: null,

  // ------------------------------------------------------------- rolagem
  setInput(value) {
    const trimmed = value.trim();
    set({
      input: value,
      // Campo vazio não é erro — é só um campo vazio.
      inputError: trimmed.length === 0 ? null : validate(trimmed),
    });
  },

  rollExpression(expression, meta = {}) {
    const outcome = tryRoll(expression);
    if (!outcome.ok) {
      set({ inputError: outcome.error });
      return;
    }

    const state = get();
    const result = outcome.result;

    const characterId =
      meta.characterId !== undefined ? meta.characterId : state.activeCharacterId;

    const entry: HistoryEntry = {
      id: uid('h'),
      result,
      characterId,
      macroName: meta.macroName ?? null,
      hidden: meta.hidden ?? state.settings.gmMode,
      pinned: false,
    };

    const skin: DiceSkin =
      state.characters.find((character) => character.id === characterId)?.skin ??
      state.settings.defaultSkin;

    const usePhysics = state.settings.physics3d && !state.settings.reducedMotion;

    set({
      history: trimHistory([entry, ...state.history]),
      lastResult: result,
      lastEntryId: entry.id,
      inputError: null,
      phase: usePhysics ? 'lancando' : 'revelado',
      pendingRequest: usePhysics ? { id: uid('r'), result, skin } : null,
    });
  },

  rollFromInput() {
    const input = get().input.trim();
    if (input.length === 0) return;
    get().rollExpression(input);
  },

  rollQuick(shape, count = 1) {
    const modifier = loneModifier(get().input);
    get().rollExpression(`${notationFor(shape, Math.max(1, count))}${modifier}`);
  },

  rollAdvantage(mode) {
    const modifier = loneModifier(get().input);
    const keep = mode === 'vantagem' ? 'kh1' : 'kl1';
    get().rollExpression(`2d20${keep}${modifier}`);
  },

  repeatLast() {
    const previous = get().history[0];
    if (!previous) return;
    get().rollExpression(previous.result.expression, {
      macroName: previous.macroName,
      characterId: previous.characterId,
    });
  },

  onStageSettled() {
    set({ phase: 'revelado', pendingRequest: null });
  },

  // ----------------------------------------------------------- histórico
  revealEntry(id) {
    set((state) => ({
      history: state.history.map((entry) =>
        entry.id === id ? { ...entry, hidden: false } : entry,
      ),
    }));
  },

  togglePin(id) {
    set((state) => ({
      history: state.history.map((entry) =>
        entry.id === id ? { ...entry, pinned: !entry.pinned } : entry,
      ),
    }));
  },

  removeEntry(id) {
    set((state) => ({
      history: state.history.filter((entry) => entry.id !== id),
      lastEntryId: state.lastEntryId === id ? null : state.lastEntryId,
    }));
  },

  clearHistory() {
    set({ history: [], lastEntryId: null, lastResult: null, phase: 'ocioso' });
  },

  // -------------------------------------------------------------- atalhos
  addMacro(macro) {
    set((state) => ({
      macros: [
        ...state.macros,
        {
          id: uid('mac'),
          name: macro.name.slice(0, 32),
          expression: macro.expression,
          glyph: macro.glyph || '🎲',
          characterId:
            macro.characterId !== undefined ? macro.characterId : state.activeCharacterId,
          order: state.macros.length,
          uses: 0,
        },
      ],
    }));
  },

  updateMacro(id, patch) {
    set((state) => ({
      macros: state.macros.map((macro) =>
        macro.id === id ? { ...macro, ...patch, id: macro.id } : macro,
      ),
    }));
  },

  removeMacro(id) {
    set((state) => ({ macros: state.macros.filter((macro) => macro.id !== id) }));
  },

  moveMacro(id, delta) {
    const state = get();
    const ordered = [...state.macros].sort((a, b) => a.order - b.order);
    const index = ordered.findIndex((macro) => macro.id === id);
    if (index < 0) return;

    const target = index + delta;
    if (target < 0 || target >= ordered.length) return;

    const moved = ordered[index];
    const displaced = ordered[target];
    if (!moved || !displaced) return;

    ordered[index] = displaced;
    ordered[target] = moved;

    const orderById = new Map(ordered.map((macro, position) => [macro.id, position]));
    set({
      macros: state.macros.map((macro) => ({
        ...macro,
        order: orderById.get(macro.id) ?? macro.order,
      })),
    });
  },

  runMacro(id) {
    const macro = get().macros.find((item) => item.id === id);
    if (!macro) return;

    set((state) => ({
      macros: state.macros.map((item) =>
        item.id === id ? { ...item, uses: item.uses + 1 } : item,
      ),
    }));

    get().rollExpression(macro.expression, {
      macroName: macro.name,
      characterId: macro.characterId ?? get().activeCharacterId,
    });
  },

  // ---------------------------------------------------------- personagens
  addCharacter(name, skin) {
    const character: Character = {
      id: uid('chr'),
      name: name.trim().slice(0, 40) || 'Sem nome',
      skin,
      accent: `var(--skin-${skin})`,
      createdAt: Date.now(),
    };
    set((state) => ({
      characters: [...state.characters, character],
      activeCharacterId: character.id,
    }));
  },

  updateCharacter(id, patch) {
    set((state) => ({
      characters: state.characters.map((character) =>
        character.id === id ? { ...character, ...patch, id: character.id } : character,
      ),
    }));
  },

  removeCharacter(id) {
    set((state) => {
      const characters = state.characters.filter((character) => character.id !== id);
      return {
        characters,
        // Os atalhos do personagem removido passam a pertencer à mesa, em
        // vez de sumirem junto com ele.
        macros: state.macros.map((macro) =>
          macro.characterId === id ? { ...macro, characterId: null } : macro,
        ),
        activeCharacterId:
          state.activeCharacterId === id ? (characters[0]?.id ?? null) : state.activeCharacterId,
      };
    });
  },

  setActiveCharacter(id) {
    set({ activeCharacterId: id });
  },

  // --------------------------------------------------- preferências e UI
  updateSettings(patch) {
    set((state) => ({ settings: { ...state.settings, ...patch } }));
  },

  setPanel(panel: PanelId) {
    set({ panel });
  },
}));

// Persiste a cada mudança. Não há checagem de "sujou" porque saveState já
// é debounced: mudanças em rajada durante uma rolagem apenas reiniciam o
// temporizador, e uma única escrita acontece quando a poeira baixa.
useAionStore.subscribe((state) => {
  saveState({
    history: state.history,
    macros: state.macros,
    characters: state.characters,
    activeCharacterId: state.activeCharacterId,
    settings: state.settings,
  });
});

/** Seletores usados em mais de um componente. */
export const selectActiveCharacter = (state: AionState): Character | null =>
  state.characters.find((character) => character.id === state.activeCharacterId) ?? null;

export const selectActiveSkin = (state: AionState): DiceSkin =>
  selectActiveCharacter(state)?.skin ?? state.settings.defaultSkin;

export const selectVisibleMacros = (state: AionState): Macro[] =>
  [...state.macros].sort((a, b) => a.order - b.order);
