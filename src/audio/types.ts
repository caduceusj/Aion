/**
 * Aion — contrato da camada de áudio.
 * Todo o som é sintetizado em WebAudio; nenhum arquivo é carregado.
 */

export interface AionAudio {
  /**
   * Destrava o contexto de áudio. Deve ser chamado dentro de um gesto do
   * usuário (clique/toque), senão o navegador mantém o contexto suspenso.
   */
  unlock(): void;
  /** Chacoalhar/arremessar os dados. */
  throwDice(count: number): void;
  /** Impacto de um dado. `intensity` 0..1. */
  impact(intensity: number, shape: string): void;
  /** Fanfarra curta de acerto crítico. */
  critical(): void;
  /** Baque grave de falha crítica. */
  fumble(): void;
  /** Revelação do total (tique ascendente). */
  reveal(): void;
  /** Clique de interface. */
  click(): void;
  setVolume(volume: number): void;
  setEnabled(enabled: boolean): void;
  dispose(): void;
}
