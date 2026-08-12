/**
 * De onde vêm os valores das faces.
 *
 * O motor não sorteia mais por conta própria: ele pede. Isso permite que o
 * valor venha da mesa 3D — o dado cai, a cena lê a face de cima, e é esse
 * número que entra na conta. Nada é reetiquetado depois.
 *
 * Três fontes existem, e a simetria entre elas é o que mantém o resto do
 * app simples:
 *
 *   física  — o dado rolou nesta tela e paramos de olhar quando ele parou
 *   rede    — o dado rolou na tela de outra pessoa e os valores vieram por lá
 *   gerador — não há mesa (física desligada, movimento reduzido, testes)
 */

import type { FaceKind } from './types';
import type { Rng } from './rng';

export interface PedidoDeFace {
  /** Lados do dado. 100 para percentil; 6 para Fudge, que usa −1/0/+1. */
  sides: number;
  faceKind: FaceKind;
}

export interface FaceObtida {
  valor: number;
  /** Veio de um dado que existiu na mesa, e não do gerador. */
  fisico: boolean;
  /**
   * Posição na fila de valores lidos, quando veio de lá.
   *
   * É o fio que liga um `DieRoll` de volta ao objeto que rolou na mesa —
   * sem ele não dá para saber qual dado na tela corresponde a qual dado do
   * resultado quando há explosões ou pares de percentil no meio.
   */
  indice: number | null;
}

export interface FonteDeValores {
  proxima(pedido: PedidoDeFace): FaceObtida;
}

function sortear(rng: Rng, pedido: PedidoDeFace): number {
  if (pedido.faceKind === 'fudge') return rng.int(-1, 1);
  if (pedido.faceKind === 'percentile') return rng.int(1, 100);
  return rng.int(1, pedido.sides);
}

/** Fonte padrão: o gerador semeado. Reproduzível pela semente. */
export function fonteDoGerador(rng: Rng): FonteDeValores {
  return {
    proxima: (pedido) => ({ valor: sortear(rng, pedido), fisico: false, indice: null }),
  };
}

/**
 * Fonte de valores já conhecidos, na ordem em que o motor vai pedi-los.
 *
 * A ordem não é coincidência: `planejarDados` percorre a expressão na mesma
 * sequência em que o avaliador vai consumir, então a enésima face lida na
 * mesa é a enésima face que o motor pede.
 *
 * Quando a fila acaba — só acontece com explosão ou rerolagem, que criam
 * dados imprevisíveis de antemão — cai no gerador, e esses dados ficam
 * marcados como não-físicos para a interface poder dizer isso.
 */
export function fonteDaFila(valores: readonly number[], rng: Rng): FonteDeValores {
  let cursor = 0;

  return {
    proxima(pedido) {
      if (cursor < valores.length) {
        const valor = valores[cursor];
        const indice = cursor;
        cursor += 1;
        if (typeof valor === 'number') return { valor, fisico: true, indice };
      }
      return { valor: sortear(rng, pedido), fisico: false, indice: null };
    },
  };
}
