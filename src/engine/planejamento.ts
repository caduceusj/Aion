/**
 * Quais dados uma expressão precisa, antes de rolar qualquer coisa.
 *
 * A cena 3D precisa saber o que arremessar antes de existir resultado
 * algum. Este módulo percorre a árvore e lista os dados na MESMA ordem em
 * que o avaliador vai consumi-los — é essa correspondência que permite ler
 * a enésima face da mesa e entregá-la ao enésimo pedido do motor.
 *
 * Explosões e rerolagens não entram: elas dependem do que sair, e por isso
 * não dá para planejá-las. Ver `fonteDaFila`.
 */

import type { FaceKind, PolyhedronKind } from './types';
import type { Node, ParsedExpression } from './parser';
import { FEAR_SKIN, HOPE_SKIN, shapeForSides } from './evaluator';

export interface DadoPlanejado {
  sides: number;
  faceKind: FaceKind;
  shape: PolyhedronKind;
  /** Papel na dualidade, quando faz parte de um par Esperança/Medo. */
  role: 'esperanca' | 'medo' | null;
  /**
   * Metade de um percentil. Um `d%` é um número de 1 a 100 para o motor,
   * mas na mesa são dois dados de dez lados: o das dezenas (00..90) e o das
   * unidades (1..10). `combinarLeituras` junta os dois de volta.
   */
  papel?: 'dezena' | 'unidade';
  /** Cor própria deste dado, ignorando a do personagem. */
  skinOverride?: string;
}

const DUALITY_SIDES = 12;

function percorrer(node: Node, saida: DadoPlanejado[]): void {
  switch (node.kind) {
    case 'num':
      return;

    case 'neg':
      percorrer(node.operand, saida);
      return;

    case 'binary':
      // Esquerda antes da direita: é a ordem que o avaliador segue.
      percorrer(node.left, saida);
      percorrer(node.right, saida);
      return;

    case 'duality':
      saida.push(
        {
          sides: DUALITY_SIDES,
          faceKind: 'numeric',
          shape: 'd12',
          role: 'esperanca',
          skinOverride: HOPE_SKIN,
        },
        {
          sides: DUALITY_SIDES,
          faceKind: 'numeric',
          shape: 'd12',
          role: 'medo',
          skinOverride: FEAR_SKIN,
        },
      );
      return;

    case 'dice': {
      const { count, sides, faceKind } = node.spec;

      if (faceKind === 'percentile') {
        for (let i = 0; i < count; i += 1) {
          saida.push(
            { sides: 100, faceKind: 'percentile', shape: 'd100', role: null, papel: 'dezena' },
            { sides: 10, faceKind: 'numeric', shape: 'd10', role: null, papel: 'unidade' },
          );
        }
        return;
      }

      const planejado: Omit<DadoPlanejado, 'role'> = {
        sides,
        faceKind,
        shape: shapeForSides(sides, faceKind),
      };
      for (let i = 0; i < count; i += 1) saida.push({ ...planejado, role: null });
      return;
    }
  }
}

export function planejarDados(parsed: ParsedExpression): DadoPlanejado[] {
  const saida: DadoPlanejado[] = [];
  percorrer(parsed.root, saida);
  return saida;
}

/** Faces lidas na mesa, já traduzidas para o que o motor pede. */
export interface Leituras {
  /** Um valor por pedido do motor, na ordem em que ele vai pedir. */
  valores: number[];
  /**
   * Para cada valor, quais dados da mesa o produziram. Quase sempre um só;
   * um percentil são dois.
   */
  origem: number[][];
}

/**
 * Converte as faces lidas na mesa nos valores que o motor consome.
 *
 * A única tradução que existe é a do percentil: dezenas + unidades viram um
 * número de 1 a 100, com 00 + 10 valendo 100, como manda a convenção. Todo
 * o resto passa direto — a face lida é o valor, sem exceção.
 */
export function combinarLeituras(
  dados: readonly DadoPlanejado[],
  lidos: readonly number[],
): Leituras {
  const valores: number[] = [];
  const origem: number[][] = [];

  for (let i = 0; i < dados.length; i += 1) {
    const valor = lidos[i];
    if (typeof valor !== 'number') break;

    if (dados[i]?.papel === 'dezena') {
      const unidade = lidos[i + 1];
      if (typeof unidade !== 'number') break;
      // O dado de unidades mostra 1..10; o 10 conta como zero.
      const total = valor + (unidade % 10);
      valores.push(total === 0 ? 100 : total);
      origem.push([i, i + 1]);
      i += 1;
      continue;
    }

    valores.push(valor);
    origem.push([i]);
  }

  return { valores, origem };
}
