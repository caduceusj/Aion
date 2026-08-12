/**
 * Aion — contratos de estado da aplicação.
 * Compartilhado entre store, interface, áudio e cena 3D.
 */

import type { PolyhedronKind, RollError, RollResult } from '@/engine/types';

/** Paleta de cor de um personagem / conjunto de dados. */
export type DiceSkin =
  | 'ambar'
  | 'obsidiana'
  | 'esmeralda'
  | 'rubi'
  | 'safira'
  | 'ametista'
  | 'osso'
  | 'aco';

/** Atalho salvo ("macro") — uma rolagem nomeada. */
export interface Macro {
  id: string;
  /** Ex.: "Espada Longa". */
  name: string;
  /** Ex.: "1d20+7". */
  expression: string;
  /** Emoji ou glifo curto exibido no botão. */
  glyph: string;
  /** Personagem dono do atalho; null = mesa. */
  characterId: string | null;
  /** Ordem de exibição. */
  order: number;
  /** Quantas vezes foi usado — alimenta a ordenação por frequência. */
  uses: number;
}

/** Um personagem sentado à mesa. */
export interface Character {
  id: string;
  name: string;
  skin: DiceSkin;
  /** Cor de destaque em hex, derivada do skin mas sobrescrevível. */
  accent: string;
  createdAt: number;
}

/** Entrada do histórico de rolagens. */
export interface HistoryEntry {
  id: string;
  result: RollResult;
  characterId: string | null;
  /** Nome do atalho que originou a rolagem, se houver. */
  macroName: string | null;
  /** Rolagem do mestre: resultado oculto até ser revelado. */
  hidden: boolean;
  /** Marcada como favorita pelo usuário. */
  pinned: boolean;
}

/** Preferências persistidas. */
export interface Settings {
  /** Física 3D ligada. Desligada = resultado instantâneo. */
  physics3d: boolean;
  /** Efeitos sonoros. */
  sound: boolean;
  /** Volume master 0..1. */
  volume: number;
  /** Vibração no toque (mobile). */
  haptics: boolean;
  /** Velocidade da simulação, 0.5..2. */
  rollSpeed: number;
  /** Modo mestre: novas rolagens nascem ocultas. */
  gmMode: boolean;
  /** Reduz movimento/flashes. */
  reducedMotion: boolean;
  /** Mostra a semente de cada rolagem no histórico. */
  showSeeds: boolean;
  /** Skin padrão dos dados quando não há personagem ativo. */
  defaultSkin: DiceSkin;
}

/** Fase da rolagem, dirige animações e som. */
export type RollPhase = 'ocioso' | 'lancando' | 'assentando' | 'revelado';

/** Comando enviado do estado para a cena 3D. */
export interface RollRequest {
  /** Id único desta requisição — evita rolagens duplicadas. */
  id: string;
  result: RollResult;
  skin: DiceSkin;
}

/** Interface que a cena 3D expõe para o resto do app. */
export interface DiceStage {
  /** Roda os dados. Resolve quando todos assentam. */
  roll(request: RollRequest): Promise<void>;
  /** Limpa a mesa. */
  clear(): void;
  /** Ajusta o passo do tempo da simulação. */
  setSpeed(speed: number): void;
  /** Libera recursos de GPU. */
  dispose(): void;
  /** Reage a resize do container. */
  resize(): void;
}

/** Eventos que a cena 3D emite para áudio/UI reagirem. */
export interface StageEvents {
  /** Um dado bateu em algo. `intensity` 0..1. */
  onImpact?: (intensity: number, shape: string) => void;
  /** Todos os dados pararam. */
  onSettled?: (rollId: string) => void;
}

/** Painel lateral aberto. */
export type PanelId = 'historico' | 'atalhos' | 'ajustes' | null;

/**
 * Contrato completo do store. Toda a interface programa contra esta
 * interface — nenhum componente deve acessar estado por outro caminho.
 */
export interface AionState {
  // ---- Dados persistidos ----
  history: HistoryEntry[];
  macros: Macro[];
  characters: Character[];
  activeCharacterId: string | null;
  settings: Settings;

  // ---- Estado efêmero ----
  /** Conteúdo do campo de notação. */
  input: string;
  /** Erro de validação do campo, ou null. */
  inputError: RollError | null;
  phase: RollPhase;
  /** Rolagem aguardando a cena 3D executar. */
  pendingRequest: RollRequest | null;
  /** Última rolagem concluída — alimenta o painel de resultado. */
  lastResult: RollResult | null;
  /** Id da entrada de histórico da última rolagem. */
  lastEntryId: string | null;
  panel: PanelId;

  // ---- Rolagem ----
  setInput(value: string): void;
  /** Avalia e enfileira uma expressão. Ignora entrada inválida. */
  rollExpression(
    expression: string,
    meta?: { macroName?: string | null; characterId?: string | null; hidden?: boolean },
  ): void;
  /** Rola o conteúdo atual do campo. */
  rollFromInput(): void;
  /** Botões rápidos da doca: `count` dados de um formato. */
  rollQuick(shape: PolyhedronKind, count?: number): void;
  /** Rola 2d20 mantendo o maior ou o menor, somando o modificador do campo. */
  rollAdvantage(mode: 'vantagem' | 'desvantagem'): void;
  /** Repete a última rolagem. */
  repeatLast(): void;
  /** Chamado pela cena 3D quando os dados assentam. */
  onStageSettled(): void;

  // ---- Histórico ----
  revealEntry(id: string): void;
  togglePin(id: string): void;
  removeEntry(id: string): void;
  clearHistory(): void;

  // ---- Atalhos ----
  addMacro(macro: Pick<Macro, 'name' | 'expression' | 'glyph'> & Partial<Macro>): void;
  updateMacro(id: string, patch: Partial<Macro>): void;
  removeMacro(id: string): void;
  moveMacro(id: string, delta: number): void;
  /** Rola um atalho e incrementa seu contador de uso. */
  runMacro(id: string): void;

  // ---- Personagens ----
  addCharacter(name: string, skin: DiceSkin): void;
  updateCharacter(id: string, patch: Partial<Character>): void;
  removeCharacter(id: string): void;
  setActiveCharacter(id: string | null): void;

  // ---- Preferências e UI ----
  updateSettings(patch: Partial<Settings>): void;
  setPanel(panel: PanelId): void;
}
