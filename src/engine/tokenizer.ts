/**
 * Tokenizador da notação de dados.
 *
 * O truque que mantém a gramática simples: dígitos quebram sequências de
 * letras. Assim `4d6kh3` vira num(4) word("d") num(6) word("kh") num(3),
 * e o parser nunca precisa adivinhar onde o `d` termina e o modificador
 * começa.
 */

export type TokenType =
  | 'num'
  | 'word'
  | 'op'
  | 'lparen'
  | 'rparen'
  | 'percent'
  | 'bang'
  | 'dbang'
  | 'cmp'
  | 'label'
  | 'eof';

export interface Token {
  type: TokenType;
  /** Texto original (minúsculo para palavras e operadores). */
  text: string;
  /** Valor numérico, quando `type === 'num'`. */
  value: number;
  /** Índice do primeiro caractere na entrada crua. */
  pos: number;
}

/** Erro de análise com posição, convertido em `RollError` na fachada. */
export class DiceError extends Error {
  readonly position: number;
  readonly token: string | undefined;

  constructor(message: string, position: number, token?: string) {
    super(message);
    this.name = 'DiceError';
    this.position = position;
    this.token = token;
  }
}

export const MAX_INPUT_LENGTH = 400;

const isDigit = (c: string): boolean => c >= '0' && c <= '9';
const isLetter = (c: string): boolean => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');

export function tokenize(input: string): Token[] {
  if (input.length > MAX_INPUT_LENGTH) {
    throw new DiceError(
      `Expressão longa demais (máximo de ${MAX_INPUT_LENGTH} caracteres).`,
      MAX_INPUT_LENGTH,
    );
  }

  const tokens: Token[] = [];
  let i = 0;

  const push = (type: TokenType, text: string, pos: number, value = 0): void => {
    tokens.push({ type, text, value, pos });
  };

  while (i < input.length) {
    const c = input[i] ?? '';

    // Espaços são irrelevantes.
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i += 1;
      continue;
    }

    if (isDigit(c)) {
      const start = i;
      while (i < input.length && isDigit(input[i] ?? '')) i += 1;
      const text = input.slice(start, i);
      const value = Number.parseInt(text, 10);
      if (!Number.isSafeInteger(value)) {
        throw new DiceError('Número grande demais.', start, text);
      }
      push('num', text, start, value);
      continue;
    }

    if (isLetter(c)) {
      const start = i;
      while (i < input.length && isLetter(input[i] ?? '')) i += 1;
      push('word', input.slice(start, i).toLowerCase(), start);
      continue;
    }

    if (c === '[') {
      const start = i;
      const end = input.indexOf(']', i + 1);
      if (end === -1) {
        throw new DiceError('Rótulo sem colchete de fechamento.', start, '[');
      }
      push('label', input.slice(i + 1, end).trim(), start);
      i = end + 1;
      continue;
    }

    if (c === '!') {
      const start = i;
      if (input[i + 1] === '!') {
        push('dbang', '!!', start);
        i += 2;
      } else {
        push('bang', '!', start);
        i += 1;
      }
      continue;
    }

    if (c === '>' || c === '<') {
      const start = i;
      if (input[i + 1] === '=') {
        push('cmp', `${c}=`, start);
        i += 2;
      } else {
        push('cmp', c, start);
        i += 1;
      }
      continue;
    }

    if (c === '=') {
      const start = i;
      // Aceita `==` como sinônimo de `=`.
      i += input[i + 1] === '=' ? 2 : 1;
      push('cmp', '=', start);
      continue;
    }

    if (c === '+' || c === '-' || c === '*' || c === '/') {
      push('op', c, i);
      i += 1;
      continue;
    }

    if (c === '(') {
      push('lparen', c, i);
      i += 1;
      continue;
    }

    if (c === ')') {
      push('rparen', c, i);
      i += 1;
      continue;
    }

    if (c === '%') {
      push('percent', c, i);
      i += 1;
      continue;
    }

    throw new DiceError(`Caractere inesperado: "${c}".`, i, c);
  }

  push('eof', '', input.length);
  return tokens;
}
