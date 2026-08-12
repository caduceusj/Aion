/**
 * Renderização de expressões e do detalhamento legível de uma rolagem.
 *
 * O detalhamento é o que a mesa lê para conferir o resultado, então ele
 * precisa mostrar *tudo*: o que foi descartado, o que explodiu, o que foi
 * rerrolado. Nada de esconder dados atrás de um total.
 */

import type { DiceGroup, DieRoll } from './types';
import type { Cond, DiceSpec, Node } from './parser';

/** Marcadores usados no detalhamento. */
export const MARK = {
  droppedOpen: '~',
  droppedClose: '~',
  exploded: '!',
  rerolled: '↻',
  criticalMax: '✦',
  criticalMin: '☠',
  success: '✓',
} as const;

export function formatCond(cond: Cond): string {
  return cond.op === '=' ? String(cond.value) : `${cond.op}${cond.value}`;
}

/** Reconstrói a notação canônica de um grupo, ex.: "4d6kh3r1". */
export function formatSpec(spec: DiceSpec): string {
  let out = `${spec.count}d`;

  if (spec.faceKind === 'fudge') out += 'f';
  else if (spec.faceKind === 'percentile' && spec.sides === 100) out += '%';
  else out += String(spec.sides);

  if (spec.reroll) out += `${spec.reroll.once ? 'ro' : 'r'}${formatCond(spec.reroll.cond)}`;
  if (spec.explode) {
    out += spec.explode.mode === 'compound' ? '!!' : '!';
    if (spec.explode.cond) out += formatCond(spec.explode.cond);
  }
  if (spec.clampMin !== null) out += `min${spec.clampMin}`;
  if (spec.clampMax !== null) out += `max${spec.clampMax}`;
  if (spec.keep) out += `${spec.keep.mode}${spec.keep.n}`;
  if (spec.success) out += formatCond(spec.success);
  if (spec.failure) out += `f${formatCond(spec.failure)}`;

  return out;
}

const PRECEDENCE: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };

interface RenderOptions {
  spaced: boolean;
  /** Substitui cada grupo de dados pelo seu detalhamento. */
  expand: ((index: number, spec: DiceSpec) => string) | null;
}

function renderNode(
  node: Node,
  parentPrecedence: number,
  isRightOperand: boolean,
  options: RenderOptions,
  counter: { index: number },
): string {
  switch (node.kind) {
    case 'num':
      return String(node.value);

    case 'neg':
      return `-${renderNode(node.operand, 3, false, options, counter)}`;

    case 'dice': {
      const index = counter.index;
      counter.index += 1;
      if (options.expand) return options.expand(index, node.spec);
      return formatSpec(node.spec);
    }

    case 'binary': {
      const precedence = PRECEDENCE[node.op] ?? 1;
      const left = renderNode(node.left, precedence, false, options, counter);
      const right = renderNode(node.right, precedence, true, options, counter);
      const joiner = options.spaced ? ` ${node.op} ` : node.op;
      const body = `${left}${joiner}${right}`;
      const needsParens =
        precedence < parentPrecedence || (precedence === parentPrecedence && isRightOperand);
      return needsParens ? `(${body})` : body;
    }
  }
}

/** Expressão normalizada: minúscula, sem espaços, com o rótulo no fim. */
export function renderExpression(root: Node, label: string | null): string {
  const body = renderNode(root, 0, false, { spaced: false, expand: null }, { index: 0 });
  return label ? `${body}[${label}]` : body;
}

function dieToken(die: DieRoll, isPool: boolean): string {
  let token = String(die.value);

  if (die.critical === 'max') token += MARK.criticalMax;
  else if (die.critical === 'min') token += MARK.criticalMin;

  if (die.exploded) token += MARK.exploded;
  if (die.rerolled) token += MARK.rerolled;
  if (isPool && die.success === true) token += MARK.success;

  return die.dropped ? `${MARK.droppedOpen}${token}${MARK.droppedClose}` : token;
}

/**
 * Monta a linha de matemática que a mesa lê.
 *
 * Com um único grupo o formato é o clássico
 *   `4d6kh3: [6, 5, 4, ~2~] + 2 = 17`
 * Com vários, cada grupo aparece colado à sua lista, para não haver dúvida
 * sobre qual dado pertence a qual grupo.
 */
export function buildDetail(
  root: Node,
  label: string | null,
  groups: DiceGroup[],
  dice: DieRoll[],
  total: number,
  isSuccessPool: boolean,
): string {
  const byId = new Map(dice.map((die) => [die.id, die]));
  const single = groups.length === 1;

  const expand = (index: number, spec: DiceSpec): string => {
    const group = groups[index];
    if (!group) return formatSpec(spec);

    const values = group.dieIds
      .map((id) => byId.get(id))
      .filter((die): die is DieRoll => die !== undefined)
      .map((die) => dieToken(die, isSuccessPool));

    const list = `[${values.join(', ')}]`;
    return single ? `${group.notation}: ${list}` : `${group.notation}${list}`;
  };

  const body = renderNode(root, 0, false, { spaced: true, expand }, { index: 0 });

  const suffix = isSuccessPool
    ? `${total} ${Math.abs(total) === 1 ? 'sucesso' : 'sucessos'}`
    : String(total);

  const head = label ? `${label} — ` : '';
  return `${head}${body} = ${suffix}`;
}
