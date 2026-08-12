/**
 * Avaliador da árvore sintática.
 *
 * Ordem de aplicação dos modificadores dentro de um grupo:
 *   rerolagem → explosão → limites (min/max) → descarte → contagem de sucessos
 *
 * Essa ordem importa: rerrolar antes de explodir permite que um dado
 * rerrolado exploda, e limitar antes de descartar faz o `min` influenciar
 * quais dados sobrevivem ao `kh`.
 */

import type {
  DiceGroup,
  DieRoll,
  DualityInfo,
  FaceKind,
  PolyhedronKind,
  RollResult,
  RollOptions,
} from './types';
import type { Cond, DiceSpec, Node, ParsedExpression } from './parser';
import { MAX_DICE } from './parser';
import { DiceError } from './tokenizer';
import { createRng, type Rng } from './rng';
import { buildDetail, formatSpec, renderExpression } from './format';

const MAX_REROLLS = 100;
const DEFAULT_MAX_EXPLOSIONS = 100;

/** Poliedro usado para representar um dado de `sides` lados. */
export function shapeForSides(sides: number, faceKind: FaceKind): PolyhedronKind {
  if (faceKind === 'fudge') return 'dF';
  if (faceKind === 'percentile' || sides === 100) return 'd100';

  switch (sides) {
    case 4:
      return 'd4';
    case 6:
      return 'd6';
    case 8:
      return 'd8';
    case 10:
      return 'd10';
    case 12:
      return 'd12';
    case 20:
      return 'd20';
    default:
      break;
  }

  // Lados fora do padrão viram o menor poliedro que os comporta.
  if (sides <= 4) return 'd4';
  if (sides <= 6) return 'd6';
  if (sides <= 8) return 'd8';
  if (sides <= 10) return 'd10';
  if (sides <= 12) return 'd12';
  return 'd20';
}

function matches(cond: Cond, value: number): boolean {
  switch (cond.op) {
    case '=':
      return value === cond.value;
    case '<':
      return value < cond.value;
    case '>':
      return value > cond.value;
    case '<=':
      return value <= cond.value;
    case '>=':
      return value >= cond.value;
  }
}

function facesOf(spec: DiceSpec): number[] {
  if (spec.faceKind === 'fudge') return [-1, 0, 1];
  const sides = spec.faceKind === 'percentile' ? 100 : spec.sides;
  return Array.from({ length: sides }, (_, i) => i + 1);
}

/** Uma condição que casa com todas as faces travaria o laço para sempre. */
function alwaysTrue(cond: Cond, spec: DiceSpec): boolean {
  return facesOf(spec).every((face) => matches(cond, face));
}

function rollFace(rng: Rng, spec: DiceSpec): number {
  if (spec.faceKind === 'fudge') return rng.int(-1, 1);
  if (spec.faceKind === 'percentile') return rng.int(1, 100);
  return rng.int(1, spec.sides);
}

function maxFace(spec: DiceSpec): number {
  if (spec.faceKind === 'fudge') return 1;
  if (spec.faceKind === 'percentile') return 100;
  return spec.sides;
}

function minFace(spec: DiceSpec): number {
  return spec.faceKind === 'fudge' ? -1 : 1;
}

function criticalOf(spec: DiceSpec, face: number): DieRoll['critical'] {
  // Um dado de uma face só não tem drama.
  if (maxFace(spec) === minFace(spec)) return null;
  if (face === maxFace(spec)) return 'max';
  if (face === minFace(spec)) return 'min';
  return null;
}

/** Cores fixas do par de dualidade: Esperança dourada, Medo obsidiana. */
const HOPE_SKIN = 'ambar';
const FEAR_SKIN = 'obsidiana';
const DUALITY_SIDES = 12;

interface Context {
  rng: Rng;
  dice: DieRoll[];
  groups: DiceGroup[];
  duality: DualityInfo | null;
  maxDice: number;
  maxExplosions: number;
  usedDivision: boolean;
  /** Acumuladores dos pools de sucesso encontrados na expressão. */
  successes: number;
  botches: number;
  hasPool: boolean;
}

/** Rola um dado, já resolvendo as rerolagens. */
function rollSingle(spec: DiceSpec, ctx: Context, groupIndex: number): DieRoll {
  if (ctx.dice.length >= ctx.maxDice) {
    throw new DiceError(`Máximo de ${ctx.maxDice} dados por expressão.`, spec.pos);
  }

  const history: number[] = [];
  let face = rollFace(ctx.rng, spec);
  history.push(face);
  let rerolled = false;

  if (spec.reroll && !alwaysTrue(spec.reroll.cond, spec)) {
    let attempts = 0;
    while (matches(spec.reroll.cond, face) && attempts < MAX_REROLLS) {
      face = rollFace(ctx.rng, spec);
      history.push(face);
      attempts += 1;
      rerolled = true;
      if (spec.reroll.once) break;
    }
  }

  const die: DieRoll = {
    id: ctx.rng.id('d'),
    sides: spec.faceKind === 'percentile' ? 100 : spec.sides,
    faceKind: spec.faceKind,
    shape: shapeForSides(spec.sides, spec.faceKind),
    value: face,
    face,
    history,
    kept: true,
    dropped: false,
    rerolled,
    exploded: false,
    critical: criticalOf(spec, face),
    success: null,
    groupIndex,
    role: null,
  };

  ctx.dice.push(die);
  return die;
}

function applyExplosions(spec: DiceSpec, ctx: Context, groupIndex: number, dice: DieRoll[]): void {
  const explode = spec.explode;
  if (!explode) return;

  const cond: Cond = explode.cond ?? { op: '=', value: maxFace(spec) };
  if (alwaysTrue(cond, spec)) return; // explodiria para sempre

  if (explode.mode === 'compound') {
    for (const die of dice) {
      let chained = 0;
      let last = die.face;
      while (matches(cond, last) && chained < ctx.maxExplosions) {
        last = rollFace(ctx.rng, spec);
        die.history.push(last);
        die.value += last;
        die.exploded = true;
        chained += 1;
      }
    }
    return;
  }

  // `!` simples: cada explosão coloca um dado NOVO na mesa.
  let cursor = 0;
  let produced = 0;
  while (cursor < dice.length) {
    const die = dice[cursor];
    cursor += 1;
    if (!die) continue;
    if (!matches(cond, die.face)) continue;
    if (produced >= ctx.maxExplosions) break;
    if (ctx.dice.length >= ctx.maxDice) break;

    die.exploded = true;
    produced += 1;
    dice.push(rollSingle(spec, ctx, groupIndex));
  }
}

function applyClamps(spec: DiceSpec, dice: DieRoll[]): void {
  if (spec.clampMin === null && spec.clampMax === null) return;
  for (const die of dice) {
    if (spec.clampMin !== null && die.value < spec.clampMin) die.value = spec.clampMin;
    if (spec.clampMax !== null && die.value > spec.clampMax) die.value = spec.clampMax;
  }
}

function applyKeep(spec: DiceSpec, dice: DieRoll[]): void {
  const keep = spec.keep;
  if (!keep) return;

  // Ordena por valor mantendo a ordem original como critério de desempate,
  // para que o resultado seja estável entre replays.
  const order = dice.map((die, index) => ({ die, index }));
  const ascending = keep.mode === 'kl' || keep.mode === 'dl';
  order.sort((a, b) =>
    ascending ? a.die.value - b.die.value || a.index - b.index : b.die.value - a.die.value || a.index - b.index,
  );

  const n = Math.min(keep.n, dice.length);
  const isKeepMode = keep.mode === 'kh' || keep.mode === 'kl';

  order.forEach((entry, position) => {
    // Em `kh`/`kl` os n primeiros da ordenação sobrevivem.
    // Em `dh`/`dl` os n primeiros são justamente os descartados.
    const dropped = isKeepMode ? position >= n : position < n;
    entry.die.dropped = dropped;
    entry.die.kept = !dropped;
  });
}

function applyPool(spec: DiceSpec, dice: DieRoll[]): { successes: number; botches: number } {
  let successes = 0;
  let botches = 0;

  if (!spec.success) {
    for (const die of dice) die.success = null;
    return { successes, botches };
  }

  for (const die of dice) {
    if (die.dropped) {
      die.success = null;
      continue;
    }
    const hit = matches(spec.success, die.value);
    die.success = hit;
    if (hit) successes += 1;
    if (spec.failure && matches(spec.failure, die.value)) botches += 1;
  }

  return { successes, botches };
}

function evaluateDice(spec: DiceSpec, ctx: Context): number {
  const groupIndex = ctx.groups.length;
  const dice: DieRoll[] = [];

  for (let i = 0; i < spec.count; i += 1) {
    dice.push(rollSingle(spec, ctx, groupIndex));
  }

  applyExplosions(spec, ctx, groupIndex, dice);
  applyClamps(spec, dice);
  applyKeep(spec, dice);
  const pool = applyPool(spec, dice);

  let subtotal: number;
  if (spec.success) {
    ctx.hasPool = true;
    ctx.successes += pool.successes;
    ctx.botches += pool.botches;
    subtotal = pool.successes - pool.botches;
  } else {
    subtotal = dice.reduce((sum, die) => (die.dropped ? sum : sum + die.value), 0);
  }

  ctx.groups.push({
    index: groupIndex,
    notation: formatSpec(spec),
    count: spec.count,
    sides: spec.faceKind === 'percentile' ? 100 : spec.sides,
    faceKind: spec.faceKind,
    shape: shapeForSides(spec.sides, spec.faceKind),
    dieIds: dice.map((die) => die.id),
    subtotal,
  });

  return subtotal;
}

/**
 * Par de dualidade do Daggerheart.
 *
 * Dois d12 rolados juntos: um de Esperança e um de Medo. O total é a soma,
 * e quem ficou maior decide a consequência narrativa. Empate é sucesso
 * crítico — por isso os dois dados são iguais em faces mas nunca em cor.
 */
function evaluateDuality(ctx: Context, pos: number): number {
  if (ctx.dice.length + 2 > ctx.maxDice) {
    throw new DiceError(`Máximo de ${ctx.maxDice} dados por expressão.`, pos);
  }

  const groupIndex = ctx.groups.length;
  const hope = ctx.rng.int(1, DUALITY_SIDES);
  const fear = ctx.rng.int(1, DUALITY_SIDES);

  const make = (value: number, role: 'esperanca' | 'medo', skin: string): DieRoll => ({
    id: ctx.rng.id('d'),
    sides: DUALITY_SIDES,
    faceKind: 'numeric',
    shape: 'd12',
    value,
    face: value,
    history: [value],
    kept: true,
    dropped: false,
    rerolled: false,
    exploded: false,
    critical: null,
    success: null,
    groupIndex,
    role,
    skinOverride: skin,
  });

  const hopeDie = make(hope, 'esperanca', HOPE_SKIN);
  const fearDie = make(fear, 'medo', FEAR_SKIN);
  ctx.dice.push(hopeDie, fearDie);

  const outcome: DualityInfo['outcome'] =
    hope === fear ? 'critico' : hope > fear ? 'esperanca' : 'medo';

  ctx.duality = { hope, fear, outcome };

  ctx.groups.push({
    index: groupIndex,
    notation: 'dd',
    count: 2,
    sides: DUALITY_SIDES,
    faceKind: 'numeric',
    shape: 'd12',
    dieIds: [hopeDie.id, fearDie.id],
    subtotal: hope + fear,
  });

  return hope + fear;
}

function evaluateNode(node: Node, ctx: Context): number {
  switch (node.kind) {
    case 'num':
      return node.value;

    case 'neg':
      return -evaluateNode(node.operand, ctx);

    case 'dice':
      return evaluateDice(node.spec, ctx);

    case 'duality':
      return evaluateDuality(ctx, node.pos);

    case 'binary': {
      const left = evaluateNode(node.left, ctx);
      const right = evaluateNode(node.right, ctx);
      switch (node.op) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          if (right === 0) {
            throw new DiceError('Divisão por zero.', node.pos, '/');
          }
          ctx.usedDivision = true;
          return left / right;
      }
    }
  }
}

/** Crítico da rolagem inteira, na convenção da mesa. */
function overallCritical(dice: DieRoll[]): RollResult['critical'] {
  const d20s = dice.filter(
    (die) => die.sides === 20 && die.faceKind === 'numeric' && !die.dropped,
  );

  if (d20s.length > 0) {
    if (d20s.some((die) => die.critical === 'max')) return 'max';
    if (d20s.some((die) => die.critical === 'min')) return 'min';
    return null;
  }

  // Sem d20 na mesa, um único dado carrega o drama sozinho.
  const kept = dice.filter((die) => !die.dropped);
  const only = kept.length === 1 ? kept[0] : undefined;
  return only ? only.critical : null;
}

export function evaluate(
  parsed: ParsedExpression,
  rawInput: string,
  seed: string,
  options: RollOptions = {},
): RollResult {
  const ctx: Context = {
    rng: createRng(seed),
    dice: [],
    groups: [],
    duality: null,
    maxDice: Math.min(options.maxDice ?? MAX_DICE, MAX_DICE),
    maxExplosions: options.maxExplosions ?? DEFAULT_MAX_EXPLOSIONS,
    usedDivision: false,
    successes: 0,
    botches: 0,
    hasPool: false,
  };

  const raw = evaluateNode(parsed.root, ctx);
  const total = ctx.usedDivision ? Math.floor(raw) : raw;

  const isSuccessPool = ctx.hasPool;
  const expression = renderExpression(parsed.root, parsed.label);

  return {
    expression,
    rawInput,
    total,
    dice: ctx.dice,
    groups: ctx.groups,
    detail: buildDetail(
      parsed.root,
      parsed.label,
      ctx.groups,
      ctx.dice,
      total,
      isSuccessPool,
      ctx.duality,
    ),
    isSuccessPool,
    successes: isSuccessPool ? ctx.successes : null,
    botches: isSuccessPool ? ctx.botches : null,
    // Um crítico de dualidade é o momento alto da mesa em Daggerheart:
    // entra no mesmo canal visual e sonoro do 20 natural.
    critical: ctx.duality
      ? ctx.duality.outcome === 'critico'
        ? 'max'
        : null
      : overallCritical(ctx.dice),
    duality: ctx.duality,
    label: parsed.label,
    seed,
    timestamp: Date.now(),
  };
}
