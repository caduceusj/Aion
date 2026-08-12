/**
 * Aion — contratos do motor de rolagem.
 *
 * Este arquivo é a fonte da verdade compartilhada entre o motor, a cena 3D,
 * o áudio, o estado e a interface. Alterações aqui afetam todos os módulos.
 */

/** Tipos de face suportados por um dado. */
export type FaceKind =
  /** Faces numeradas de 1..sides. */
  | 'numeric'
  /** Dados Fudge/Fate: faces -1, 0, +1. */
  | 'fudge'
  /** d100 rolado como par de d10 (dezena + unidade). */
  | 'percentile';

/** Dados com representação 3D dedicada. Outros lados caem no genérico. */
export type PolyhedronKind = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100' | 'dF';

/** Marcação de crítico de um dado individual. */
export type CriticalKind = 'max' | 'min' | null;

/**
 * Um único dado físico rolado, com todo o seu histórico.
 * `value` é o valor que efetivamente entrou na conta (0 se descartado).
 */
export interface DieRoll {
  /** Identificador estável, usado para casar com o objeto 3D. */
  id: string;
  /** Número de faces. 100 para percentil, 6 para fudge. */
  sides: number;
  faceKind: FaceKind;
  /** Tipo de poliedro a renderizar. */
  shape: PolyhedronKind;
  /** Valor final deste dado (após explosões/rerolagens). */
  value: number;
  /** Toda a sequência rolada por este dado, em ordem. */
  history: number[];
  /** Entrou na soma final? */
  kept: boolean;
  /** Foi descartado por kh/kl/dh/dl? */
  dropped: boolean;
  /** Sofreu ao menos uma rerolagem? */
  rerolled: boolean;
  /** Explodiu ao menos uma vez? */
  exploded: boolean;
  /** Valor máximo/mínimo natural da face. */
  critical: CriticalKind;
  /** Em pools de sucesso: este dado contou como sucesso/falha? */
  success: boolean | null;
  /** Índice do grupo de dados na expressão (para cores distintas na mesa). */
  groupIndex: number;
}

/** Um grupo `NdX` dentro da expressão, com seus modificadores aplicados. */
export interface DiceGroup {
  index: number;
  /** Notação original do grupo, ex.: "4d6kh3". */
  notation: string;
  count: number;
  sides: number;
  faceKind: FaceKind;
  shape: PolyhedronKind;
  /** Ids dos dados deste grupo. */
  dieIds: string[];
  /** Soma (ou contagem de sucessos) do grupo. */
  subtotal: number;
}

/** Resultado de uma expressão avaliada. */
export interface RollResult {
  /** Expressão normalizada, ex.: "4d6kh3+2". */
  expression: string;
  /** Expressão exatamente como digitada pelo usuário. */
  rawInput: string;
  /** Total final. Em pools de sucesso, é o número de sucessos. */
  total: number;
  /** Todos os dados rolados, na ordem em que aparecem na expressão. */
  dice: DieRoll[];
  /** Grupos NdX encontrados. */
  groups: DiceGroup[];
  /** Detalhamento legível, ex.: "4d6kh3: [6, 5, 4, ~2~] + 2 = 17". */
  detail: string;
  /** Se a expressão usa contagem de sucessos (ex.: 10d10>=7). */
  isSuccessPool: boolean;
  /** Número de sucessos, quando aplicável. */
  successes: number | null;
  /** Número de falhas críticas (botch) em pools, quando aplicável. */
  botches: number | null;
  /**
   * Crítico da rolagem como um todo. Considera apenas o primeiro grupo
   * de d20 (convenção D&D 5e) ou o único dado quando há um só.
   */
  critical: CriticalKind;
  /** Semente usada — permite reproduzir a rolagem para auditoria. */
  seed: string;
  /** Epoch ms. */
  timestamp: number;
}

/** Erro de análise da expressão, com posição para destaque na UI. */
export interface RollError {
  message: string;
  /** Índice do caractere problemático na entrada crua. */
  position: number;
  /** Trecho ofensor. */
  token?: string;
}

/** Opções de avaliação. */
export interface RollOptions {
  /** Semente fixa. Ausente = semente criptográfica nova. */
  seed?: string;
  /** Limite de dados por expressão (proteção contra 9999d20). */
  maxDice?: number;
  /** Limite de explosões por dado. */
  maxExplosions?: number;
}

/** Assinatura pública do motor. */
export interface DiceEngine {
  roll(input: string, options?: RollOptions): RollResult;
  /** Valida sem rolar. Retorna null quando a expressão é válida. */
  validate(input: string): RollError | null;
  /** Reexecuta uma rolagem a partir da expressão + semente. */
  replay(expression: string, seed: string): RollResult;
}
