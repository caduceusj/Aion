import { describe, expect, it } from 'vitest';
import { NOTATION_HELP, roll, replay, shapeForSides, validate } from './index';
import { createRng } from './rng';

/** Rola com semente fixa — todos os testes de valor precisam ser estáveis. */
const seeded = (expr: string, seed = 'semente-de-teste') => roll(expr, { seed });

describe('aritmética básica', () => {
  it('rola um único d20 dentro da faixa', () => {
    for (let i = 0; i < 200; i += 1) {
      const result = roll('1d20');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(20);
      expect(result.dice).toHaveLength(1);
    }
  });

  it('assume quantidade 1 quando ela é omitida', () => {
    const result = seeded('d8');
    expect(result.dice).toHaveLength(1);
    expect(result.expression).toBe('1d8');
  });

  it('soma vários dados', () => {
    const result = seeded('3d6');
    expect(result.dice).toHaveLength(3);
    const sum = result.dice.reduce((acc, die) => acc + die.value, 0);
    expect(result.total).toBe(sum);
  });

  it('aplica modificadores', () => {
    const result = seeded('3d6+4');
    const sum = result.dice.reduce((acc, die) => acc + die.value, 0);
    expect(result.total).toBe(sum + 4);
  });

  it('respeita a precedência de operadores', () => {
    expect(roll('2+3*4', { seed: 'a' }).total).toBe(14);
    expect(roll('(2+3)*4', { seed: 'a' }).total).toBe(20);
  });

  it('entende o menos unário', () => {
    expect(roll('-5+8', { seed: 'a' }).total).toBe(3);
    expect(roll('10--3', { seed: 'a' }).total).toBe(13);
  });

  it('arredonda para baixo quando há divisão', () => {
    expect(roll('7/2', { seed: 'a' }).total).toBe(3);
    expect(roll('10/4', { seed: 'a' }).total).toBe(2);
  });

  it('não arredonda quando não há divisão', () => {
    expect(roll('7*3', { seed: 'a' }).total).toBe(21);
  });

  it('ignora espaços e maiúsculas', () => {
    const a = roll('  2D6 + 3 ', { seed: 'igual' });
    const b = roll('2d6+3', { seed: 'igual' });
    expect(a.total).toBe(b.total);
    expect(a.expression).toBe('2d6+3');
  });
});

describe('manter e descartar', () => {
  it('kh3 mantém os três maiores de quatro', () => {
    const result = seeded('4d6kh3');
    expect(result.dice).toHaveLength(4);
    expect(result.dice.filter((d) => d.dropped)).toHaveLength(1);

    const kept = result.dice.filter((d) => !d.dropped);
    const droppedDie = result.dice.find((d) => d.dropped);
    expect(droppedDie).toBeDefined();
    for (const die of kept) {
      expect(die.value).toBeGreaterThanOrEqual(droppedDie?.value ?? 0);
    }
    expect(result.total).toBe(kept.reduce((sum, d) => sum + d.value, 0));
  });

  it('kl1 é a desvantagem', () => {
    const result = seeded('2d20kl1');
    const kept = result.dice.filter((d) => !d.dropped);
    expect(kept).toHaveLength(1);
    const values = result.dice.map((d) => d.value);
    expect(kept[0]?.value).toBe(Math.min(...values));
  });

  it('kh1 é a vantagem', () => {
    const result = seeded('2d20kh1');
    const kept = result.dice.filter((d) => !d.dropped);
    expect(kept).toHaveLength(1);
    const values = result.dice.map((d) => d.value);
    expect(kept[0]?.value).toBe(Math.max(...values));
  });

  it('k sozinho é sinônimo de kh', () => {
    const a = roll('2d20k1', { seed: 'mesma' });
    const b = roll('2d20kh1', { seed: 'mesma' });
    expect(a.total).toBe(b.total);
  });

  it('dl1 descarta o menor e equivale a kh3', () => {
    const a = roll('4d6dl1', { seed: 'equivalencia' });
    const b = roll('4d6kh3', { seed: 'equivalencia' });
    expect(a.total).toBe(b.total);
  });

  it('dh1 descarta o maior', () => {
    const result = seeded('4d6dh1');
    const dropped = result.dice.filter((d) => d.dropped);
    expect(dropped).toHaveLength(1);
    const values = result.dice.map((d) => d.value);
    expect(dropped[0]?.value).toBe(Math.max(...values));
  });

  it('mantém todos quando n excede a quantidade de dados', () => {
    const result = seeded('2d6kh5');
    expect(result.dice.filter((d) => d.dropped)).toHaveLength(0);
  });

  it('kh0 descarta tudo e zera o total', () => {
    const result = seeded('3d6kh0');
    expect(result.dice.every((d) => d.dropped)).toBe(true);
    expect(result.total).toBe(0);
  });
});

describe('limites min e max', () => {
  it('min2 eleva todo dado abaixo de 2', () => {
    for (let i = 0; i < 60; i += 1) {
      const result = roll('6d6min2');
      expect(Math.min(...result.dice.map((d) => d.value))).toBeGreaterThanOrEqual(2);
    }
  });

  it('max5 limita todo dado acima de 5', () => {
    for (let i = 0; i < 60; i += 1) {
      const result = roll('6d6max5');
      expect(Math.max(...result.dice.map((d) => d.value))).toBeLessThanOrEqual(5);
    }
  });

  it('preserva a face natural mesmo depois do limite', () => {
    const result = roll('20d6min4');
    const raised = result.dice.find((d) => d.face < 4);
    if (raised) {
      expect(raised.value).toBe(4);
      expect(raised.face).toBeLessThan(4);
    }
  });
});

describe('explosões', () => {
  it('! coloca dados novos na mesa', () => {
    let found = false;
    for (let i = 0; i < 120 && !found; i += 1) {
      const result = roll('6d6!');
      if (result.dice.length > 6) {
        found = true;
        expect(result.dice.some((d) => d.exploded)).toBe(true);
      }
    }
    expect(found).toBe(true);
  });

  it('!! acumula no mesmo dado sem criar novos', () => {
    let found = false;
    for (let i = 0; i < 200 && !found; i += 1) {
      const result = roll('6d6!!');
      expect(result.dice).toHaveLength(6);
      const compounded = result.dice.find((d) => d.exploded);
      if (compounded) {
        found = true;
        expect(compounded.value).toBeGreaterThan(6);
        expect(compounded.history.length).toBeGreaterThan(1);
      }
    }
    expect(found).toBe(true);
  });

  it('aceita condição própria de explosão', () => {
    let exploded = false;
    for (let i = 0; i < 60 && !exploded; i += 1) {
      const result = roll('10d6!>=5');
      const trigger = result.dice.find((d) => d.exploded);
      if (trigger) {
        exploded = true;
        expect(trigger.face).toBeGreaterThanOrEqual(5);
      }
    }
    expect(exploded).toBe(true);
  });

  it('não trava quando a condição casaria com todas as faces', () => {
    const result = roll('3d6!>=1');
    expect(result.dice).toHaveLength(3);
    expect(result.dice.every((d) => !d.exploded)).toBe(true);
  });

  it('não trava em um dado de uma face só', () => {
    const result = roll('3d1!');
    expect(result.dice).toHaveLength(3);
    expect(result.total).toBe(3);
  });
});

describe('rerolagens', () => {
  it('r1 elimina todos os uns', () => {
    for (let i = 0; i < 80; i += 1) {
      const result = roll('8d6r1');
      expect(result.dice.every((d) => d.value !== 1)).toBe(true);
    }
  });

  it('ro1 rerrola no máximo uma vez', () => {
    let sawSecondOne = false;
    for (let i = 0; i < 400 && !sawSecondOne; i += 1) {
      const result = roll('8d6ro1');
      for (const die of result.dice) {
        if (die.rerolled) {
          expect(die.history).toHaveLength(2);
          if (die.value === 1) sawSecondOne = true;
        }
      }
    }
    // Com ro, um 1 pode sobreviver — é exatamente o comportamento esperado.
    expect(sawSecondOne).toBe(true);
  });

  it('aceita comparadores na rerolagem', () => {
    for (let i = 0; i < 60; i += 1) {
      const result = roll('8d6r<=2');
      expect(result.dice.every((d) => d.value > 2)).toBe(true);
    }
  });

  it('não trava quando a rerolagem casaria com tudo', () => {
    const result = roll('3d6r>=1');
    expect(result.dice).toHaveLength(3);
    expect(result.dice.every((d) => !d.rerolled)).toBe(true);
  });

  it('marca o dado como rerrolado e guarda a sequência', () => {
    let checked = false;
    for (let i = 0; i < 200 && !checked; i += 1) {
      const result = roll('6d6r1');
      const die = result.dice.find((d) => d.rerolled);
      if (die) {
        checked = true;
        expect(die.history[0]).toBe(1);
        expect(die.history.length).toBeGreaterThan(1);
      }
    }
    expect(checked).toBe(true);
  });
});

describe('pools de sucesso', () => {
  it('conta os dados que batem a condição', () => {
    const result = seeded('10d10>=7');
    expect(result.isSuccessPool).toBe(true);
    const expected = result.dice.filter((d) => d.value >= 7).length;
    expect(result.successes).toBe(expected);
    expect(result.total).toBe(expected);
  });

  it('subtrai as falhas críticas', () => {
    for (let i = 0; i < 40; i += 1) {
      const result = roll('10d10>=7f1');
      const successes = result.dice.filter((d) => d.value >= 7).length;
      const botches = result.dice.filter((d) => d.value === 1).length;
      expect(result.successes).toBe(successes);
      expect(result.botches).toBe(botches);
      expect(result.total).toBe(successes - botches);
    }
  });

  it('marca cada dado com seu sucesso', () => {
    const result = seeded('8d10>=6');
    for (const die of result.dice) {
      expect(die.success).toBe(die.value >= 6);
    }
  });

  it('aceita qualquer comparador', () => {
    const result = seeded('8d6>4');
    expect(result.successes).toBe(result.dice.filter((d) => d.value > 4).length);
  });

  it('rolagens comuns não são pools', () => {
    const result = seeded('3d6+2');
    expect(result.isSuccessPool).toBe(false);
    expect(result.successes).toBeNull();
    expect(result.botches).toBeNull();
  });
});

describe('dados especiais', () => {
  it('4dF soma entre -4 e +4', () => {
    for (let i = 0; i < 200; i += 1) {
      const result = roll('4dF');
      expect(result.total).toBeGreaterThanOrEqual(-4);
      expect(result.total).toBeLessThanOrEqual(4);
      expect(result.dice).toHaveLength(4);
      for (const die of result.dice) {
        expect([-1, 0, 1]).toContain(die.value);
        expect(die.shape).toBe('dF');
      }
    }
  });

  it('d% cai entre 1 e 100', () => {
    for (let i = 0; i < 200; i += 1) {
      const result = roll('d%');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(100);
      expect(result.dice[0]?.shape).toBe('d100');
    }
  });

  it('d100 é tratado como percentil', () => {
    const result = seeded('d100');
    expect(result.dice[0]?.faceKind).toBe('percentile');
  });
});

describe('críticos', () => {
  it('marca 20 natural como acerto crítico', () => {
    let found = false;
    for (let i = 0; i < 400 && !found; i += 1) {
      const result = roll('1d20+5');
      if (result.dice[0]?.face === 20) {
        found = true;
        expect(result.critical).toBe('max');
      }
    }
    expect(found).toBe(true);
  });

  it('marca 1 natural como falha crítica', () => {
    let found = false;
    for (let i = 0; i < 400 && !found; i += 1) {
      const result = roll('1d20+5');
      if (result.dice[0]?.face === 1) {
        found = true;
        expect(result.critical).toBe('min');
      }
    }
    expect(found).toBe(true);
  });

  it('ignora o d20 descartado ao decidir o crítico', () => {
    for (let i = 0; i < 300; i += 1) {
      const result = roll('2d20kh1');
      const kept = result.dice.find((d) => !d.dropped);
      expect(result.critical).toBe(kept?.critical ?? null);
    }
  });

  it('não inventa crítico em rolagem de dano', () => {
    for (let i = 0; i < 100; i += 1) {
      const result = roll('2d6+3');
      expect(result.critical).toBeNull();
    }
  });

  it('um dado sozinho carrega o crítico mesmo sem ser d20', () => {
    let found = false;
    for (let i = 0; i < 200 && !found; i += 1) {
      const result = roll('1d6');
      if (result.dice[0]?.face === 6) {
        found = true;
        expect(result.critical).toBe('max');
      }
    }
    expect(found).toBe(true);
  });
});

describe('rótulos', () => {
  it('extrai o rótulo da expressão', () => {
    const result = seeded('1d20+7[Ataque com espada]');
    expect(result.expression).toBe('1d20+7[Ataque com espada]');
    expect(result.detail).toContain('Ataque com espada');
  });

  it('funciona sem rótulo', () => {
    const result = seeded('1d20+7');
    expect(result.expression).toBe('1d20+7');
  });
});

describe('determinismo', () => {
  it('a mesma semente produz exatamente o mesmo resultado', () => {
    const expressions = ['4d6kh3', '10d10>=7f1', '6d6!', '2d20kl1+3', '4dF', '8d6r1!>=5'];
    for (const expression of expressions) {
      const a = roll(expression, { seed: 'auditoria' });
      const b = roll(expression, { seed: 'auditoria' });
      expect(b.total).toBe(a.total);
      expect(b.dice).toEqual(a.dice);
      expect(b.detail).toBe(a.detail);
    }
  });

  it('replay reproduz a rolagem original', () => {
    const original = roll('4d6kh3+2');
    const again = replay(original.expression, original.seed);
    expect(again.total).toBe(original.total);
    expect(again.dice.map((d) => d.value)).toEqual(original.dice.map((d) => d.value));
  });

  it('sementes diferentes divergem', () => {
    const totals = new Set<number>();
    for (let i = 0; i < 40; i += 1) {
      totals.add(roll('10d20', { seed: `s${i}` }).total);
    }
    expect(totals.size).toBeGreaterThan(10);
  });

  it('cada rolagem sem semente recebe uma semente nova', () => {
    const seeds = new Set<string>();
    for (let i = 0; i < 50; i += 1) seeds.add(roll('1d20').seed);
    expect(seeds.size).toBe(50);
  });
});

describe('distribuição', () => {
  it('o d20 é uniforme dentro do esperado (qui-quadrado)', () => {
    const rolls = 20000;
    const counts = new Array<number>(20).fill(0);
    for (let i = 0; i < rolls; i += 1) {
      const value = roll('1d20').total;
      counts[value - 1] = (counts[value - 1] ?? 0) + 1;
    }

    const expected = rolls / 20;
    const chiSquare = counts.reduce(
      (acc, observed) => acc + (observed - expected) ** 2 / expected,
      0,
    );

    // 19 graus de liberdade: o valor crítico a 0,1% é ~43,8.
    expect(chiSquare).toBeLessThan(43.8);
    expect(Math.min(...counts)).toBeGreaterThan(0);
  });

  it('o gerador semeado cobre toda a faixa pedida', () => {
    const rng = createRng('cobertura');
    const seen = new Set<number>();
    for (let i = 0; i < 4000; i += 1) seen.add(rng.int(1, 6));
    expect([...seen].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('next fica sempre em [0, 1)', () => {
    const rng = createRng('faixa');
    for (let i = 0; i < 5000; i += 1) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('detalhamento', () => {
  it('mostra os dados descartados entre tis', () => {
    const result = seeded('4d6kh3');
    // O dado descartado vem entre tis e pode carregar marcadores de crítico.
    expect(result.detail).toMatch(/~\d+[^~]*~/);
    expect(result.detail).toContain('4d6kh3:');
    expect(result.detail).toContain(`= ${result.total}`);
  });

  it('conta sucessos por extenso no pool', () => {
    const result = seeded('10d10>=7');
    expect(result.detail).toMatch(/sucessos?$/);
  });

  it('lista cada grupo separadamente em expressões compostas', () => {
    const result = seeded('1d20+2d6');
    expect(result.groups).toHaveLength(2);
    expect(result.detail).toContain('1d20[');
    expect(result.detail).toContain('2d6[');
  });
});

describe('shapeForSides', () => {
  it('mapeia os poliedros padrão', () => {
    expect(shapeForSides(4, 'numeric')).toBe('d4');
    expect(shapeForSides(6, 'numeric')).toBe('d6');
    expect(shapeForSides(8, 'numeric')).toBe('d8');
    expect(shapeForSides(10, 'numeric')).toBe('d10');
    expect(shapeForSides(12, 'numeric')).toBe('d12');
    expect(shapeForSides(20, 'numeric')).toBe('d20');
    expect(shapeForSides(100, 'percentile')).toBe('d100');
    expect(shapeForSides(6, 'fudge')).toBe('dF');
  });

  it('aproxima lados fora do padrão', () => {
    expect(shapeForSides(3, 'numeric')).toBe('d4');
    expect(shapeForSides(7, 'numeric')).toBe('d8');
    expect(shapeForSides(30, 'numeric')).toBe('d20');
  });
});

describe('referência de notação', () => {
  it('cobre a notação com exemplos que o motor aceita', () => {
    expect(NOTATION_HELP.length).toBeGreaterThanOrEqual(14);
    for (const entry of NOTATION_HELP) {
      expect(validate(entry.syntax), `sintaxe inválida: ${entry.syntax}`).toBeNull();
      expect(entry.label.length).toBeGreaterThan(0);
      expect(entry.example.length).toBeGreaterThan(0);
    }
  });
});
