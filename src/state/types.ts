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

/**
 * Pedido de arremesso: o que jogar na mesa.
 *
 * Note que NÃO há resultado aqui. O resultado é o que a física produzir —
 * a cena lê a face de cima quando o dado para, e é esse número que vale.
 */
export interface RollRequest {
  /** Id único desta requisição — evita arremessos duplicados. */
  id: string;
  dados: import('@/engine').DadoPlanejado[];
  skin: DiceSkin;
}

/** Dados que já têm valor e só precisam ser exibidos assentados. */
export interface PedidoDeExibicao {
  id: string;
  dados: Array<{
    plano: import('@/engine').DadoPlanejado;
    /** A face que a mesa de quem rolou leu. Aparece já para cima. */
    valor: number;
  }>;
  skin: DiceSkin;
}

/** Interface que a cena 3D expõe para o resto do app. */
export interface DiceStage {
  /**
   * Arremessa os dados e resolve com as faces LIDAS quando todos param,
   * na mesma ordem em que foram pedidos.
   */
  arremessar(pedido: RollRequest): Promise<number[]>;
  /**
   * Põe na mesa dados que já têm valor, deitados na face certa desde o
   * primeiro quadro. É assim que a rolagem de outra pessoa aparece: sem
   * física fingida e sem número trocando na sua frente.
   */
  exibir(pedido: PedidoDeExibicao): Promise<void>;
  /** Esmaece os dados descartados, depois que a conta é feita. */
  esmaecer(indices: readonly number[]): void;
  /** Limpa a mesa. */
  clear(): void;
  /** Ajusta o passo do tempo da simulação. */
  setSpeed(speed: number): void;
  /** Libera recursos de GPU. */
  dispose(): void;
  /** Reage a resize do container. */
  resize(): void;
}

/**
 * Eventos que a cena 3D emite para áudio/UI reagirem.
 *
 * Não há evento de "assentou": quem arremessou recebe as faces lidas pela
 * própria promessa, e é lá que o som da revelação toca — depois de existir
 * um resultado, nunca antes.
 */
export interface StageEvents {
  /** Um dado bateu em algo. `intensity` 0..1. */
  onImpact?: (intensity: number, shape: string) => void;
}

/** Painel lateral aberto. */
export type PanelId = 'historico' | 'atalhos' | 'ajustes' | 'ficha' | 'mesa' | 'codice' | null;

/** Estado da mesa compartilhada entre aparelhos. */
export interface EstadoDaMesa {
  estado: import('@/net/types').EstadoDaRede;
  /** Código curto que os jogadores digitam para entrar. */
  codigo: string;
  /** Endereço do relay. */
  url: string;
  /** Id deste aparelho na sala. */
  suaId: string;
  participantes: import('@/net/types').Participante[];
  erro: string | null;
  /** Contador de Medo do Mestre (Daggerheart), igual para todos. */
  medo: number;
  souMestre: boolean;
}

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
  /** Arremesso aguardando a cena 3D executar. */
  pendingRequest: RollRequest | null;
  /** Rolagem de outro aparelho, esperando ser exibida já assentada. */
  pendingExibicao: PedidoDeExibicao | null;
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
  /**
   * Chamado pela cena 3D quando os dados param, com as faces lidas.
   * É aqui que a rolagem vira resultado.
   */
  concluirArremesso(id: string, valores: readonly number[]): void;
  /**
   * Quais dados da mesa ficaram de fora da conta neste pedido, para a cena
   * poder esmaecê-los. Só faz sentido depois de `concluirArremesso`.
   */
  indicesDescartados(id: string): number[];
  /** Chamado quando a exibição de uma rolagem remota termina. */
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

  // ---- Fichas de Daggerheart ----
  fichas: import('@/daggerheart/ficha').Ficha[];
  fichaAtivaId: string | null;
  adicionarFicha(nome?: string): void;
  atualizarFicha(id: string, patch: Partial<import('@/daggerheart/ficha').Ficha>): void;
  removerFicha(id: string): void;
  definirFichaAtiva(id: string | null): void;
  /** Rola algo montado pela ficha, já com rótulo. */
  rolarDaFicha(expressao: string, rotulo: string): void;

  // ---- Mesa compartilhada ----
  mesa: EstadoDaMesa;
  conectarMesa(opcoes: { codigo: string; url?: string; mestre?: boolean }): void;
  desconectarMesa(): void;
  /** Ajusta o Medo do Mestre e propaga para a mesa. */
  definirMedo(valor: number): void;

  // ---- Preferências e UI ----
  updateSettings(patch: Partial<Settings>): void;
  setPanel(panel: PanelId): void;
}
