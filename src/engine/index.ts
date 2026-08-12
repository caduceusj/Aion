/**
 * Aion — fachada pública do motor de rolagem.
 *
 * TypeScript puro: sem DOM, sem dependências, determinístico dada uma
 * semente. Tudo que o resto do app precisa saber sobre dados passa por aqui.
 */

import type { DiceEngine, RollError, RollOptions, RollResult } from './types';
import { DiceError } from './tokenizer';
import { parse } from './parser';
import { evaluate } from './evaluator';
import { randomSeed } from './rng';

export type * from './types';
export { shapeForSides } from './evaluator';
export { randomSeed } from './rng';
export { DiceError } from './tokenizer';
export { MAX_DICE, MAX_SIDES } from './parser';

function toRollError(error: unknown): RollError {
  if (error instanceof DiceError) {
    return {
      message: error.message,
      position: error.position,
      ...(error.token !== undefined ? { token: error.token } : {}),
    };
  }
  return {
    message: error instanceof Error ? error.message : 'Expressão inválida.',
    position: 0,
  };
}

export function roll(input: string, options: RollOptions = {}): RollResult {
  const parsed = parse(input);
  const seed = options.seed ?? randomSeed();
  return evaluate(parsed, input, seed, options);
}

export function validate(input: string): RollError | null {
  try {
    parse(input);
    return null;
  } catch (error) {
    return toRollError(error);
  }
}

/** Reexecuta uma rolagem. Mesma expressão + mesma semente = mesmo resultado. */
export function replay(expression: string, seed: string): RollResult {
  return roll(expression, { seed });
}

/**
 * Tenta rolar sem lançar. Útil na interface, onde um erro de digitação não
 * pode derrubar a árvore de componentes.
 */
export function tryRoll(
  input: string,
  options: RollOptions = {},
): { ok: true; result: RollResult } | { ok: false; error: RollError } {
  try {
    return { ok: true, result: roll(input, options) };
  } catch (error) {
    return { ok: false, error: toRollError(error) };
  }
}

export const engine: DiceEngine = { roll, validate, replay };

export interface NotationHelpEntry {
  syntax: string;
  label: string;
  example: string;
  group: 'Básico' | 'Manter e descartar' | 'Explodir e rerrolar' | 'Pools de sucesso';
}

/** Referência de notação exibida na folha de ajuda da doca. */
export const NOTATION_HELP: NotationHelpEntry[] = [
  {
    syntax: 'd20',
    label: 'Um dado de vinte lados',
    example: 'Teste de perícia',
    group: 'Básico',
  },
  {
    syntax: '3d6',
    label: 'Três dados de seis lados, somados',
    example: 'Dano de bola de fogo',
    group: 'Básico',
  },
  {
    syntax: '1d20+7',
    label: 'Soma um modificador ao resultado',
    example: 'Ataque com bônus de +7',
    group: 'Básico',
  },
  {
    syntax: '2d6*2',
    label: 'Multiplicação, divisão e parênteses',
    example: 'Dano crítico dobrado',
    group: 'Básico',
  },
  {
    syntax: 'd%',
    label: 'Percentil de 1 a 100',
    example: 'Tabela de tesouro',
    group: 'Básico',
  },
  {
    syntax: '4dF',
    label: 'Dados Fudge: cada um vale −1, 0 ou +1',
    example: 'Sistemas Fate',
    group: 'Básico',
  },
  {
    syntax: '1d20+5[Ataque]',
    label: 'Dá um nome à rolagem',
    example: 'Aparece no histórico',
    group: 'Básico',
  },
  {
    syntax: '4d6kh3',
    label: 'Rola 4 e mantém os 3 maiores',
    example: 'Distribuir atributos',
    group: 'Manter e descartar',
  },
  {
    syntax: '2d20kh1',
    label: 'Vantagem: mantém o maior',
    example: 'Ataque com vantagem',
    group: 'Manter e descartar',
  },
  {
    syntax: '2d20kl1',
    label: 'Desvantagem: mantém o menor',
    example: 'Ataque com desvantagem',
    group: 'Manter e descartar',
  },
  {
    syntax: '4d6dl1',
    label: 'Descarta o menor',
    example: 'Equivale a 4d6kh3',
    group: 'Manter e descartar',
  },
  {
    syntax: '4d6min2',
    label: 'Nenhum dado vale menos que 2',
    example: 'Elemental de fogo',
    group: 'Manter e descartar',
  },
  {
    syntax: '4d6max5',
    label: 'Nenhum dado vale mais que 5',
    example: 'Dano limitado',
    group: 'Manter e descartar',
  },
  {
    syntax: '6d6!',
    label: 'Explode: cada 6 traz um dado novo',
    example: 'Savage Worlds, Shadowrun',
    group: 'Explodir e rerrolar',
  },
  {
    syntax: '6d6!!',
    label: 'Explosão composta: soma no mesmo dado',
    example: 'Um único número grande',
    group: 'Explodir e rerrolar',
  },
  {
    syntax: '6d6!>=5',
    label: 'Explode com uma condição sua',
    example: 'Explode em 5 e 6',
    group: 'Explodir e rerrolar',
  },
  {
    syntax: '4d6r1',
    label: 'Rerrola todo 1, quantas vezes precisar',
    example: 'Arma élfica',
    group: 'Explodir e rerrolar',
  },
  {
    syntax: '4d6ro1',
    label: 'Rerrola o 1 uma única vez',
    example: 'Grande Arma (D&D 5e)',
    group: 'Explodir e rerrolar',
  },
  {
    syntax: '4d6r<=2',
    label: 'Rerrola tudo que for 2 ou menos',
    example: 'Condição com comparador',
    group: 'Explodir e rerrolar',
  },
  {
    syntax: '10d10>=7',
    label: 'Conta quantos dados atingiram 7',
    example: 'Storyteller / Mundo das Trevas',
    group: 'Pools de sucesso',
  },
  {
    syntax: '10d10>=7f1',
    label: 'Cada 1 anula um sucesso',
    example: 'Falhas críticas do pool',
    group: 'Pools de sucesso',
  },
  {
    syntax: '8d6>4',
    label: 'Sucesso com qualquer comparador',
    example: '>, <, >=, <=, =',
    group: 'Pools de sucesso',
  },
];
