/**
 * Store da aplicação.
 *
 * O ciclo de uma rolagem com física passa todo por aqui, e a ordem importa:
 *
 *   rollExpression → planeja os dados → pendingRequest → a cena arremessa
 *   → concluirArremesso(faces lidas) → motor faz a conta em cima delas
 *   → histórico → fase 'revelado'
 *
 * Repare que o motor entra DEPOIS da mesa. É essa inversão que faz o número
 * que aparece na face ser o número que vale: não há resultado antes do dado
 * parar, então não há nada para trocar depois.
 *
 * Com a física desligada o caminho encurta e o motor sorteia como sempre —
 * é o mesmo motor, só com outra fonte de valores.
 */

import { create } from 'zustand';
import type { PolyhedronKind } from '@/engine/types';
import {
  combinarLeituras,
  parse,
  planejarDados,
  randomSeed,
  roll as rolarExpressao,
  rollComValores,
  tryRoll,
  validate,
  type DadoPlanejado,
} from '@/engine';
import { fichaEmBranco, type Ficha } from '@/daggerheart/ficha';
import { criarConexao, salaDaUrl, urlPadraoDoRelay } from '@/net/sync';
import type { RolagemCompartilhada } from '@/net/types';
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

/**
 * Conexão com a mesa. Vive fora do store porque é um recurso, não estado —
 * o store só guarda o que ela reporta.
 */
const conexao = criarConexao({
  onEstado(estado, erro) {
    useAionStore.setState((s) => ({
      mesa: { ...s.mesa, estado, erro: erro ?? (estado === 'conectado' ? null : s.mesa.erro) },
    }));
  },
  onPresenca(participantes, suaId) {
    useAionStore.setState((s) => ({
      mesa: { ...s.mesa, participantes, suaId: suaId || s.mesa.suaId },
    }));
  },
  onRolagem(carga) {
    aplicarRolagemRemota(carga);
  },
  onRevelar(rolagemId) {
    useAionStore.setState((s) => ({
      history: s.history.map((entry) =>
        entry.id === rolagemId ? { ...entry, hidden: false } : entry,
      ),
    }));
  },
  onMedo(valor) {
    useAionStore.setState((s) => ({ mesa: { ...s.mesa, medo: valor } }));
  },
});

/**
 * Reproduz localmente uma rolagem feita em outro aparelho.
 *
 * Chegam a expressão, a semente e — o que importa — as faces que a mesa de
 * lá leu. Este aparelho não rola nada: recria os mesmos dados, deitados nas
 * mesmas faces, e faz a mesma conta. Ninguém vê um número mudar, aqui nem
 * lá. Nada é retransmitido, senão a mesa entraria em eco.
 */
function aplicarRolagemRemota(carga: RolagemCompartilhada): void {
  const state = useAionStore.getState();
  if (state.history.some((entry) => entry.id === carga.id)) return;

  const brutos = carga.valores ?? [];

  let dados: DadoPlanejado[] = [];
  let result;
  try {
    dados = planejarDados(parse(carga.expressao));
    const leituras = combinarLeituras(dados, brutos);
    result =
      leituras.valores.length > 0
        ? rollComValores(carga.expressao, leituras.valores, carga.semente)
        : // Aparelho antigo, que ainda manda só expressão e semente.
          rolarExpressao(carga.expressao, { seed: carga.semente });
  } catch {
    return; // expressão que este cliente não entende: ignorar é melhor que quebrar
  }

  // O horário é o de quem rolou, para o histórico ficar na mesma ordem em
  // todos os aparelhos.
  result = { ...result, timestamp: carga.momento };

  const entry: HistoryEntry = {
    id: carga.id,
    result,
    characterId: null,
    macroName: carga.atalho ?? carga.personagem,
    hidden: carga.oculta,
    pinned: false,
  };

  const usePhysics = state.settings.physics3d && !state.settings.reducedMotion;
  const podeExibir = usePhysics && dados.length > 0 && brutos.length >= dados.length;
  const idDaExibicao = uid('e');
  if (podeExibir) marcarDescartes(idDaExibicao, result, combinarLeituras(dados, brutos).origem);

  useAionStore.setState({
    history: trimHistory([entry, ...state.history]),
    lastResult: result,
    lastEntryId: entry.id,
    // Já nasce revelado: os dados aparecem parados, não há o que esperar.
    phase: 'revelado',
    pendingRequest: null,
    pendingExibicao: podeExibir
      ? {
          id: idDaExibicao,
          dados: dados.map((plano, index) => ({ plano, valor: brutos[index] ?? 1 })),
          skin: carga.skin,
        }
      : null,
  });
}

/**
 * Um arremesso esperando os dados pararem.
 *
 * Vive fora do store porque é maquinário, não estado de interface: nada na
 * tela depende disso, e enquanto os dados rolam simplesmente não existe
 * resultado para mostrar.
 */
interface ArremessoEmCurso {
  id: string;
  entryId: string;
  expressao: string;
  semente: string;
  dados: DadoPlanejado[];
  skin: DiceSkin;
  characterId: string | null;
  macroName: string | null;
  hidden: boolean;
}

let arremessoEmCurso: ArremessoEmCurso | null = null;

/**
 * Quais dados da mesa saíram da conta no último pedido.
 *
 * Só dá para saber isso depois que a conta é feita — quem sobrevive a um
 * `4d6kh3` depende dos números que saíram. Por isso o esmaecimento acontece
 * num segundo momento, e não junto com o assentamento.
 */
let descartesDaMesa: { id: string; indices: number[] } | null = null;

function marcarDescartes(
  id: string,
  result: import('@/engine/types').RollResult,
  origem: readonly number[][],
): void {
  const indices: number[] = [];
  for (const die of result.dice) {
    if (!die.dropped || die.indiceNaFila === null) continue;
    for (const indice of origem[die.indiceNaFila] ?? []) indices.push(indice);
  }
  descartesDaMesa = { id, indices };
}

interface DadosDaEntrada {
  entryId?: string;
  characterId: string | null;
  macroName: string | null;
  hidden: boolean;
  skin: DiceSkin;
}

/**
 * Fecha o ciclo: resultado no histórico, na tela e na mesa compartilhada.
 *
 * `facesLidas` são as faces que apareceram nos dados desta tela. Vão junto
 * para os outros aparelhos porque é a única forma de eles mostrarem os
 * mesmos dados mostrando os mesmos números.
 */
function registrarResultado(
  result: import('@/engine/types').RollResult,
  dados: DadosDaEntrada,
  facesLidas: readonly number[] = [],
): void {
  const state = useAionStore.getState();

  const entry: HistoryEntry = {
    id: dados.entryId ?? uid('h'),
    result,
    characterId: dados.characterId,
    macroName: dados.macroName,
    hidden: dados.hidden,
    pinned: false,
  };

  useAionStore.setState({
    history: trimHistory([entry, ...state.history]),
    lastResult: result,
    lastEntryId: entry.id,
    inputError: null,
    phase: 'revelado',
    pendingRequest: null,
  });

  if (state.mesa.estado === 'conectado') {
    conexao.enviarRolagem({
      id: entry.id,
      expressao: result.expression,
      semente: result.seed,
      valores: [...facesLidas],
      momento: result.timestamp,
      personagem:
        state.characters.find((character) => character.id === dados.characterId)?.name ?? null,
      skin: dados.skin,
      atalho: entry.macroName,
      oculta: entry.hidden,
    });
  }
}

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
  pendingExibicao: null,
  lastResult: null,
  lastEntryId: null,
  panel: null,

  fichas: persisted.fichas,
  fichaAtivaId: persisted.fichaAtivaId,

  mesa: {
    estado: 'desconectado',
    codigo: salaDaUrl() ?? '',
    url: persisted.relayUrl || urlPadraoDoRelay(),
    suaId: '',
    participantes: [],
    erro: null,
    medo: 0,
    souMestre: persisted.souMestre,
  },

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
    // Ensaio: avalia uma vez e joga fora. Serve só para pegar o que a
    // análise sintática não pega — divisão por zero, excesso de dados — sem
    // deixar o erro estourar depois que os dados já estiverem no ar.
    const ensaio = tryRoll(expression);
    if (!ensaio.ok) {
      set({ inputError: ensaio.error });
      return;
    }

    const state = get();
    const characterId =
      meta.characterId !== undefined ? meta.characterId : state.activeCharacterId;
    const skin: DiceSkin =
      state.characters.find((character) => character.id === characterId)?.skin ??
      state.settings.defaultSkin;
    const macroName = meta.macroName ?? null;
    const hidden = meta.hidden ?? state.settings.gmMode;

    const usePhysics = state.settings.physics3d && !state.settings.reducedMotion;
    const dados = usePhysics ? planejarDados(parse(expression)) : [];

    // Sem mesa, ou sem dado nenhum na expressão ("12+3"), o motor sorteia
    // como sempre sorteou e o resultado já nasce pronto.
    if (dados.length === 0) {
      registrarResultado(ensaio.result, { characterId, macroName, hidden, skin });
      return;
    }

    // Daqui em diante NÃO existe resultado. Os dados vão para a mesa e a
    // conta só acontece quando eles pararem, em cima das faces lidas.
    arremessoEmCurso = {
      id: uid('r'),
      entryId: uid('h'),
      expressao: expression,
      semente: randomSeed(),
      dados,
      skin,
      characterId,
      macroName,
      hidden,
    };

    set({
      inputError: null,
      phase: 'lancando',
      pendingExibicao: null,
      pendingRequest: { id: arremessoEmCurso.id, dados, skin },
    });
  },

  concluirArremesso(id, valores) {
    const pedido = arremessoEmCurso;
    if (!pedido || pedido.id !== id) return;
    arremessoEmCurso = null;

    // As faces vêm cruas da mesa; só o percentil precisa de tradução, e é
    // uma soma de dezenas com unidades, não uma troca de valor.
    const leituras = combinarLeituras(pedido.dados, valores);

    let result;
    try {
      result = rollComValores(pedido.expressao, leituras.valores, pedido.semente);
    } catch {
      set({ phase: 'ocioso', pendingRequest: null });
      return;
    }

    marcarDescartes(id, result, leituras.origem);
    registrarResultado(result, pedido, valores);
  },

  indicesDescartados(id) {
    return descartesDaMesa?.id === id ? descartesDaMesa.indices : [];
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
    set({ phase: 'revelado', pendingRequest: null, pendingExibicao: null });
  },

  // ----------------------------------------------------------- histórico
  revealEntry(id) {
    set((state) => ({
      history: state.history.map((entry) =>
        entry.id === id ? { ...entry, hidden: false } : entry,
      ),
    }));
    if (get().mesa.estado === 'conectado') conexao.enviarRevelar(id);
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

  // ------------------------------------------------------------- fichas
  adicionarFicha(nome) {
    const ficha = fichaEmBranco(uid('fic'), nome);
    set((state) => ({
      fichas: [...state.fichas, ficha],
      fichaAtivaId: ficha.id,
    }));
  },

  atualizarFicha(id, patch) {
    set((state) => ({
      fichas: state.fichas.map((ficha) =>
        ficha.id === id ? { ...ficha, ...patch, id: ficha.id } : ficha,
      ),
    }));
  },

  removerFicha(id) {
    set((state) => {
      const fichas = state.fichas.filter((ficha) => ficha.id !== id);
      return {
        fichas,
        fichaAtivaId:
          state.fichaAtivaId === id ? (fichas[0]?.id ?? null) : state.fichaAtivaId,
      };
    });
  },

  definirFichaAtiva(id) {
    set({ fichaAtivaId: id });
  },

  rolarDaFicha(expressao, rotulo) {
    get().rollExpression(expressao, { macroName: rotulo });
  },

  // ----------------------------------------------------- mesa compartilhada
  conectarMesa({ codigo, url, mestre }) {
    const state = get();
    const alvo = (url ?? state.mesa.url).trim();
    const sala = codigo.trim().toUpperCase();
    if (sala.length < 3 || alvo.length === 0) return;

    const souMestre = mestre ?? state.mesa.souMestre;
    const personagem = state.characters.find(
      (character) => character.id === state.activeCharacterId,
    );

    set({
      mesa: {
        ...state.mesa,
        codigo: sala,
        url: alvo,
        souMestre,
        erro: null,
        estado: 'conectando',
      },
    });

    conexao.conectar({
      url: alvo,
      sala,
      nome: personagem?.name ?? 'Convidado',
      skin: personagem?.skin ?? state.settings.defaultSkin,
      mestre: souMestre,
    });
  },

  desconectarMesa() {
    conexao.desconectar();
    set((state) => ({
      mesa: { ...state.mesa, estado: 'desconectado', participantes: [], suaId: '' },
    }));
  },

  definirMedo(valor) {
    const limitado = Math.max(0, Math.min(99, Math.floor(valor)));
    set((state) => ({ mesa: { ...state.mesa, medo: limitado } }));
    if (get().mesa.estado === 'conectado') conexao.enviarMedo(limitado);
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
    fichas: state.fichas,
    fichaAtivaId: state.fichaAtivaId,
    relayUrl: state.mesa.url,
    souMestre: state.mesa.souMestre,
  });
});

/** Ficha ativa, ou null quando a mesa não está usando Daggerheart. */
export const selectFichaAtiva = (state: AionState): Ficha | null =>
  state.fichas.find((ficha) => ficha.id === state.fichaAtivaId) ?? null;

/** Seletores usados em mais de um componente. */
export const selectActiveCharacter = (state: AionState): Character | null =>
  state.characters.find((character) => character.id === state.activeCharacterId) ?? null;

export const selectActiveSkin = (state: AionState): DiceSkin =>
  selectActiveCharacter(state)?.skin ?? state.settings.defaultSkin;

export const selectVisibleMacros = (state: AionState): Macro[] =>
  [...state.macros].sort((a, b) => a.order - b.order);
