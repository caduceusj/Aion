import { describe, expect, it } from 'vitest';
import { MAX_DICE, roll, tryRoll, validate } from './index';

describe('erros de sintaxe', () => {
  const cases: Array<{ input: string; contains: string }> = [
    { input: '', contains: 'Digite' },
    { input: '   ', contains: 'Digite' },
    { input: 'd', contains: 'lados' },
    { input: '3d', contains: 'lados' },
    { input: '1d20+', contains: 'incompleta' },
    { input: '1d20*', contains: 'incompleta' },
    { input: '(1d6', contains: 'fechar' },
    { input: '1d6)', contains: 'Sobrou' },
    { input: 'abc', contains: 'entendi' },
    { input: '4d6r', contains: 'condição' },
    { input: '4d6ro', contains: 'condição' },
    { input: '4d6min', contains: 'número' },
    { input: '4d6f1', contains: 'sucesso' },
    { input: '2d6d4', contains: 'operador' },
    { input: '1d20+1[sem fim', contains: 'colchete' },
    { input: '1d0', contains: 'lado' },
    { input: '4d6xyz', contains: 'desconhecido' },
    { input: '4d6min5max2', contains: 'piso' },
  ];

  for (const { input, contains } of cases) {
    it(`rejeita "${input}"`, () => {
      const error = validate(input);
      expect(error, `"${input}" deveria ser inválida`).not.toBeNull();
      expect(error?.message).toContain(contains);
      expect(error?.position).toBeGreaterThanOrEqual(0);
    });
  }

  it('aponta a posição do caractere problemático', () => {
    const error = validate('1d20 # 3');
    expect(error?.position).toBe(5);
    expect(error?.token).toBe('#');
  });

  it('validate devolve null para expressões corretas', () => {
    const valid = ['1d20', '4d6kh3', 'd%', '4dF', '10d10>=7f1', '(2d6+1)*2', '-1d4+10'];
    for (const input of valid) {
      expect(validate(input), `"${input}" deveria ser válida`).toBeNull();
    }
  });

  it('a quantidade em kh/kl é opcional e vale 1', () => {
    expect(validate('2d20kh')).toBeNull();
    const result = roll('2d20kh', { seed: 'opcional' });
    expect(result.dice.filter((d) => !d.dropped)).toHaveLength(1);
    expect(result.expression).toBe('2d20kh1');
  });

  it('a divisão por zero só falha na hora de rolar, não na validação', () => {
    // `validate` apenas analisa a sintaxe; o divisor pode ser um dado, e aí
    // só a rolagem revela o zero. Quem chama deve usar `tryRoll`.
    expect(validate('1d6/0')).toBeNull();
    const outcome = tryRoll('1d6/0');
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.error.message).toContain('zero');
  });
});

describe('limites de segurança', () => {
  it('recusa mais dados do que o teto', () => {
    const error = validate(`${MAX_DICE + 1}d20`);
    expect(error?.message).toContain(String(MAX_DICE));
  });

  it('aceita exatamente o teto', () => {
    expect(validate(`${MAX_DICE}d6`)).toBeNull();
  });

  it('soma as quantidades de todos os grupos ao aplicar o teto', () => {
    expect(validate(`${MAX_DICE}d6+1d6`)).not.toBeNull();
  });

  it('recusa dados com lados demais', () => {
    expect(validate('1d100000')?.message).toContain('lados');
  });

  it('recusa expressões longas demais', () => {
    expect(validate('1d6+'.repeat(200) + '1')?.message).toContain('longa');
  });

  it('recusa parênteses aninhados demais', () => {
    const deep = '('.repeat(40) + '1d6' + ')'.repeat(40);
    expect(validate(deep)?.message).toContain('aninhados');
  });

  it('contém a explosão em um número finito de dados', () => {
    const result = roll('50d6!', { maxExplosions: 20 });
    expect(result.dice.length).toBeLessThanOrEqual(MAX_DICE);
    expect(result.dice.length).toBeLessThanOrEqual(70);
  });

  it('respeita maxDice mesmo com explosões', () => {
    const result = roll('20d6!', { maxDice: 25 });
    expect(result.dice.length).toBeLessThanOrEqual(25);
  });

  it('termina em tempo finito com explosão composta agressiva', () => {
    const result = roll('10d6!!>=2', { maxExplosions: 30 });
    expect(result.dice).toHaveLength(10);
    for (const die of result.dice) {
      expect(die.history.length).toBeLessThanOrEqual(31);
    }
  });
});

describe('tryRoll', () => {
  it('devolve ok em expressão válida', () => {
    const outcome = tryRoll('2d6+1');
    expect(outcome.ok).toBe(true);
    if (outcome.ok) expect(outcome.result.total).toBeGreaterThanOrEqual(3);
  });

  it('devolve erro sem lançar em expressão inválida', () => {
    const outcome = tryRoll('4d6xyz');
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.error.message).toContain('desconhecido');
  });

  it('não lança nem na divisão por zero', () => {
    const outcome = tryRoll('1d6/0');
    expect(outcome.ok).toBe(false);
  });
});

describe('coerência do resultado', () => {
  it('todo dado pertence a um grupo declarado', () => {
    const result = roll('2d20kh1+3d6!+4dF');
    for (const die of result.dice) {
      const group = result.groups[die.groupIndex];
      expect(group).toBeDefined();
      expect(group?.dieIds).toContain(die.id);
    }
  });

  it('os ids dos dados são únicos', () => {
    const result = roll('20d6!');
    expect(new Set(result.dice.map((d) => d.id)).size).toBe(result.dice.length);
  });

  it('kept e dropped são sempre opostos', () => {
    const result = roll('6d6kh3');
    for (const die of result.dice) {
      expect(die.kept).toBe(!die.dropped);
    }
  });

  it('history nunca fica vazio', () => {
    const result = roll('8d6r1!');
    for (const die of result.dice) {
      expect(die.history.length).toBeGreaterThan(0);
      expect(die.history[0]).toBeDefined();
    }
  });

  it('face está sempre dentro das faces do dado', () => {
    const result = roll('20d20r1!');
    for (const die of result.dice) {
      expect(die.face).toBeGreaterThanOrEqual(1);
      expect(die.face).toBeLessThanOrEqual(20);
    }
  });

  it('o subtotal do grupo bate com os dados mantidos', () => {
    const result = roll('4d6kh3');
    const group = result.groups[0];
    const sum = result.dice
      .filter((d) => !d.dropped)
      .reduce((acc, d) => acc + d.value, 0);
    expect(group?.subtotal).toBe(sum);
  });

  it('rawInput preserva o que foi digitado', () => {
    const result = roll('  4D6KH3  ');
    expect(result.rawInput).toBe('  4D6KH3  ');
    expect(result.expression).toBe('4d6kh3');
  });

  it('registra um timestamp plausível', () => {
    const before = Date.now();
    const result = roll('1d6');
    expect(result.timestamp).toBeGreaterThanOrEqual(before);
    expect(result.timestamp).toBeLessThanOrEqual(Date.now());
  });
});

describe('normalização de expressões', () => {
  const cases: Array<[string, string]> = [
    ['d20', '1d20'],
    ['D20', '1d20'],
    [' 3 d 6 + 2 ', '3d6+2'],
    ['4d6k3', '4d6kh3'],
    ['1d%', '1d%'],
    ['2dF', '2df'],
    ['1d20 + 2 * 3', '1d20+2*3'],
    ['(1d6+1)*2', '(1d6+1)*2'],
    ['1d6--2', '1d6--2'],
  ];

  for (const [input, expected] of cases) {
    it(`normaliza "${input}" em "${expected}"`, () => {
      expect(roll(input, { seed: 'n' }).expression).toBe(expected);
    });
  }

  it('a expressão normalizada volta a rolar sem erro', () => {
    const inputs = ['4D6KH3', '10D10>=7F1', '6D6!!>=5', ' 2 d 20 kl 1 + 3 '];
    for (const input of inputs) {
      const normalized = roll(input, { seed: 'x' }).expression;
      expect(validate(normalized), `"${normalized}" deveria ser válida`).toBeNull();
    }
  });
});
