/**
 * Parser de descida recursiva para a notação de dados.
 *
 * Gramática:
 *   expr   := term (('+' | '-') term)*
 *   term   := unary (('*' | '/') unary)*
 *   unary  := '-' unary | atom
 *   atom   := number [dice] | dice | '(' expr ')'
 *   dice   := 'd' (number | '%') mods*  |  'dF' mods*
 */

import type { FaceKind } from './types';
import { DiceError, tokenize, type Token } from './tokenizer';

export interface Cond {
  op: '=' | '<' | '>' | '<=' | '>=';
  value: number;
}

export interface KeepMod {
  mode: 'kh' | 'kl' | 'dh' | 'dl';
  n: number;
}

export interface ExplodeMod {
  /** `!` gera um dado novo no pool; `!!` acumula no mesmo dado. */
  mode: 'once' | 'compound';
  cond: Cond | null;
}

export interface RerollMod {
  cond: Cond;
  once: boolean;
}

export interface DiceSpec {
  count: number;
  /** 100 para percentil, 6 para Fudge (faces −1, 0, +1). */
  sides: number;
  faceKind: FaceKind;
  keep: KeepMod | null;
  explode: ExplodeMod | null;
  reroll: RerollMod | null;
  clampMin: number | null;
  clampMax: number | null;
  success: Cond | null;
  failure: Cond | null;
  pos: number;
}

export type Node =
  | { kind: 'num'; value: number; pos: number }
  | { kind: 'neg'; operand: Node; pos: number }
  | { kind: 'binary'; op: '+' | '-' | '*' | '/'; left: Node; right: Node; pos: number }
  | { kind: 'dice'; spec: DiceSpec; pos: number }
  /** Par de dualidade do Daggerheart: um d12 de Esperança e um de Medo. */
  | { kind: 'duality'; pos: number };

export interface ParsedExpression {
  root: Node;
  label: string | null;
  /** Soma dos `count` literais — checagem barata antes de rolar. */
  declaredDice: number;
}

export const MAX_DICE = 500;
export const MAX_SIDES = 1000;
export const MAX_DEPTH = 32;

const KEEP_WORDS = new Set(['k', 'kh', 'kl', 'dh', 'dl']);

class Parser {
  private readonly tokens: Token[];
  private index = 0;
  private depth = 0;
  private declaredDice = 0;
  private label: string | null = null;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(offset = 0): Token {
    const token = this.tokens[this.index + offset];
    // O tokenizador sempre termina com 'eof', então isto nunca é undefined
    // na prática; o fallback existe só para satisfazer o compilador.
    return token ?? { type: 'eof', text: '', value: 0, pos: 0 };
  }

  private advance(): Token {
    const token = this.peek();
    if (token.type !== 'eof') this.index += 1;
    return token;
  }

  private expectNumber(what: string): number {
    const token = this.peek();
    if (token.type !== 'num') {
      throw new DiceError(`Esperava um número depois de ${what}.`, token.pos, token.text);
    }
    this.advance();
    return token.value;
  }

  parse(): ParsedExpression {
    const root = this.parseExpr();

    // Um rótulo, se houver, encerra a expressão.
    if (this.peek().type === 'label') {
      const token = this.advance();
      this.label = token.text.length > 0 ? token.text.slice(0, 60) : null;
    }

    const trailing = this.peek();
    if (trailing.type !== 'eof') {
      throw new DiceError(
        `Sobrou "${trailing.text}" no fim da expressão.`,
        trailing.pos,
        trailing.text,
      );
    }

    return { root, label: this.label, declaredDice: this.declaredDice };
  }

  private parseExpr(): Node {
    let left = this.parseTerm();

    for (;;) {
      const token = this.peek();
      if (token.type !== 'op' || (token.text !== '+' && token.text !== '-')) break;
      this.advance();
      const right = this.parseTerm();
      left = { kind: 'binary', op: token.text, left, right, pos: token.pos };
    }

    return left;
  }

  private parseTerm(): Node {
    let left = this.parseUnary();

    for (;;) {
      const token = this.peek();
      if (token.type !== 'op' || (token.text !== '*' && token.text !== '/')) break;
      this.advance();
      const right = this.parseUnary();
      left = { kind: 'binary', op: token.text, left, right, pos: token.pos };
    }

    return left;
  }

  private parseUnary(): Node {
    const token = this.peek();
    if (token.type === 'op' && token.text === '-') {
      this.advance();
      return { kind: 'neg', operand: this.parseUnary(), pos: token.pos };
    }
    if (token.type === 'op' && token.text === '+') {
      this.advance();
      return this.parseUnary();
    }
    return this.parseAtom();
  }

  private parseAtom(): Node {
    const token = this.peek();

    if (token.type === 'lparen') {
      this.advance();
      this.depth += 1;
      if (this.depth > MAX_DEPTH) {
        throw new DiceError('Parênteses aninhados demais.', token.pos, '(');
      }
      const inner = this.parseExpr();
      const close = this.peek();
      if (close.type !== 'rparen') {
        throw new DiceError('Faltou fechar o parêntese.', close.pos, close.text);
      }
      this.advance();
      this.depth -= 1;
      return inner;
    }

    // `dd` é o par de dualidade e precisa ser reconhecido antes de `d`,
    // senão o tokenizador entregaria a palavra inteira como dado comum.
    if (token.type === 'word' && token.text === 'dd') {
      this.advance();
      this.declaredDice += 2;
      if (this.declaredDice > MAX_DICE) {
        throw new DiceError(`Máximo de ${MAX_DICE} dados por expressão.`, token.pos);
      }
      return { kind: 'duality', pos: token.pos };
    }

    if (token.type === 'num') {
      this.advance();
      const next = this.peek();
      if (next.type === 'word' && (next.text === 'd' || next.text === 'df')) {
        return this.parseDice(token.value, token.pos);
      }
      return { kind: 'num', value: token.value, pos: token.pos };
    }

    if (token.type === 'word' && (token.text === 'd' || token.text === 'df')) {
      return this.parseDice(1, token.pos);
    }

    if (token.type === 'eof') {
      throw new DiceError('Expressão incompleta.', token.pos);
    }

    throw new DiceError(`Não entendi "${token.text}".`, token.pos, token.text);
  }

  /** `count` já foi consumido; o token atual é o `d` ou `df`. */
  private parseDice(count: number, pos: number): Node {
    const dToken = this.advance();
    const isFudge = dToken.text === 'df';

    let sides: number;
    let faceKind: FaceKind;

    if (isFudge) {
      sides = 6;
      faceKind = 'fudge';
    } else {
      const next = this.peek();
      if (next.type === 'percent') {
        this.advance();
        sides = 100;
        faceKind = 'percentile';
      } else if (next.type === 'num') {
        this.advance();
        sides = next.value;
        faceKind = sides === 100 ? 'percentile' : 'numeric';
        if (sides < 1) {
          throw new DiceError('Um dado precisa de pelo menos 1 lado.', next.pos, next.text);
        }
        if (sides > MAX_SIDES) {
          throw new DiceError(`Máximo de ${MAX_SIDES} lados por dado.`, next.pos, next.text);
        }
      } else {
        throw new DiceError(
          'Faltou o número de lados do dado (ex.: d20).',
          next.pos,
          next.text,
        );
      }
    }

    if (count < 1) {
      throw new DiceError('A quantidade de dados precisa ser pelo menos 1.', pos);
    }

    this.declaredDice += count;
    if (this.declaredDice > MAX_DICE) {
      throw new DiceError(`Máximo de ${MAX_DICE} dados por expressão.`, pos);
    }

    const spec: DiceSpec = {
      count,
      sides,
      faceKind,
      keep: null,
      explode: null,
      reroll: null,
      clampMin: null,
      clampMax: null,
      success: null,
      failure: null,
      pos,
    };

    this.parseModifiers(spec);
    return { kind: 'dice', spec, pos };
  }

  private parseModifiers(spec: DiceSpec): void {
    for (;;) {
      const token = this.peek();

      if (token.type === 'bang' || token.type === 'dbang') {
        this.advance();
        if (spec.explode) {
          throw new DiceError('Explosão declarada duas vezes.', token.pos, token.text);
        }
        spec.explode = {
          mode: token.type === 'dbang' ? 'compound' : 'once',
          cond: this.tryParseCond(),
        };
        continue;
      }

      if (token.type === 'cmp') {
        if (spec.success) {
          throw new DiceError(
            'Condição de sucesso declarada duas vezes.',
            token.pos,
            token.text,
          );
        }
        spec.success = this.parseCond('a condição de sucesso');
        continue;
      }

      if (token.type !== 'word') break;

      if (KEEP_WORDS.has(token.text)) {
        this.advance();
        if (spec.keep) {
          throw new DiceError(
            'Só é possível manter ou descartar uma vez por grupo.',
            token.pos,
            token.text,
          );
        }
        const mode = token.text === 'k' ? 'kh' : (token.text as KeepMod['mode']);
        const n = this.peek().type === 'num' ? this.expectNumber(`"${token.text}"`) : 1;
        if (n < 0) {
          throw new DiceError('Quantidade negativa não faz sentido aqui.', token.pos);
        }
        spec.keep = { mode, n };
        continue;
      }

      if (token.text === 'r' || token.text === 'ro') {
        this.advance();
        if (spec.reroll) {
          throw new DiceError('Rerolagem declarada duas vezes.', token.pos, token.text);
        }
        spec.reroll = {
          cond: this.parseCond(`"${token.text}"`),
          once: token.text === 'ro',
        };
        continue;
      }

      if (token.text === 'min' || token.text === 'max') {
        this.advance();
        const value = this.expectNumber(`"${token.text}"`);
        if (token.text === 'min') spec.clampMin = value;
        else spec.clampMax = value;
        continue;
      }

      if (token.text === 'f') {
        this.advance();
        if (!spec.success) {
          throw new DiceError(
            'A contagem de falhas ("f") só funciona junto de uma condição de sucesso, como 10d10>=7f1.',
            token.pos,
            'f',
          );
        }
        if (spec.failure) {
          throw new DiceError('Condição de falha declarada duas vezes.', token.pos, 'f');
        }
        spec.failure = this.parseCond('"f"');
        continue;
      }

      if (token.text === 'd' || token.text === 'df') {
        throw new DiceError(
          'Faltou um operador entre os dois grupos de dados.',
          token.pos,
          token.text,
        );
      }

      throw new DiceError(`Modificador desconhecido: "${token.text}".`, token.pos, token.text);
    }

    if (spec.clampMin !== null && spec.clampMax !== null && spec.clampMin > spec.clampMax) {
      throw new DiceError('O piso ("min") não pode ser maior que o teto ("max").', spec.pos);
    }
  }

  /** Condição obrigatória. Um número nu significa "igual a". */
  private parseCond(what: string): Cond {
    const token = this.peek();

    if (token.type === 'cmp') {
      this.advance();
      const value = this.expectNumber(`"${token.text}"`);
      return { op: token.text as Cond['op'], value };
    }

    if (token.type === 'num') {
      this.advance();
      return { op: '=', value: token.value };
    }

    throw new DiceError(`Esperava uma condição depois de ${what}.`, token.pos, token.text);
  }

  /** Condição opcional — usada por `!` e `!!`, que têm padrão implícito. */
  private tryParseCond(): Cond | null {
    const token = this.peek();
    if (token.type === 'cmp') return this.parseCond('a explosão');
    if (token.type === 'num') {
      this.advance();
      return { op: '=', value: token.value };
    }
    return null;
  }
}

export function parse(input: string): ParsedExpression {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new DiceError('Digite uma rolagem, como 1d20+5.', 0);
  }
  return new Parser(tokenize(trimmed)).parse();
}
