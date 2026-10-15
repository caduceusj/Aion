import type { ContinenteId } from '@/codex/calendario';

export type AbaId = 'ano' | 'ceu' | 'corvisseia';

/**
 * O que cada tela do almanaque recebe do casco.
 *
 * As três telas — a folha do mês, o céu e a Corvisseia — não são três
 * assuntos, são três nomes para a mesma posição na linha de 1080 dias. Por
 * isso elas não guardam estado de tempo: leem o `dia` daqui, e qualquer uma
 * pode movê-lo. Escolher Lereal na folha leva a lua até Lereal no céu, e uma
 * célula da Corvisseia pode abrir o céu no instante exato em que Corvus parte.
 */
export interface Almanaque {
  /** O cursor: um dia da Corvisseia, de 0 a 1080 (exclusive). */
  dia: number;
  /** De qual continente se olha. Manda na faixa da lua, no céu e nos destaques. */
  onde: ContinenteId;
  irParaDia: (dia: number) => void;
  /** Leva o cursor ao instante em que Corvus parte, no mês da Corvisseia (1 a 36). */
  irParaMes: (mesC: number) => void;
  escolherOnde: (id: ContinenteId) => void;
  /**
   * Troca de tela. Com `mesC`, já posiciona o cursor; com `tocar`, manda a
   * lua percorrer aquele trecho sozinha assim que o céu abrir.
   */
  abrir: (aba: AbaId, opcoes?: { mesC?: number; tocar?: boolean }) => void;
  /** Se há um trecho a tocar, o dia em que a lua deve parar. */
  tocarAte: number | null;
  terminouDeTocar: () => void;
  aoNavegar: (chave: string) => void;
}
