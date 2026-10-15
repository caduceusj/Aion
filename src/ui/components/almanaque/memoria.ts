import { DIAS_DE_ESTADIA, inicioDoMes, type ContinenteId } from '@/codex/calendario';
import type { AbaId } from './tipos';

/**
 * O almanaque lembra onde estava.
 *
 * Quem sai para ler um verbete e volta pelo histórico do Códice não recomeça
 * de Equiral: recomeça de onde parou — a mesma aba, o mesmo dia, o mesmo
 * ponto de vista. É estado de módulo de propósito (vive enquanto a página
 * vive, e nada mais), e por isso mora num arquivo próprio, com uma forma de
 * ser esquecido: um estado global escondido dentro de um componente vazaria
 * de um teste para o seguinte.
 */
export interface Memoria {
  aba: AbaId;
  dia: number;
  onde: ContinenteId;
}

const PADRAO: Readonly<Memoria> = {
  aba: 'ano',
  // Equiral, no meio da estadia: Corvus está parada sobre Valoran, que é o
  // continente de onde se olha por padrão — o único estado em que a folha
  // mostra as três fases da lua.
  dia: inicioDoMes(6) + DIAS_DE_ESTADIA / 2,
  onde: 'valoran',
};

export const memoria: Memoria = { ...PADRAO };

/** Volta ao começo. Usado pelos testes, e por quem quiser recomeçar. */
export const esquecer = (): void => {
  Object.assign(memoria, PADRAO);
};
