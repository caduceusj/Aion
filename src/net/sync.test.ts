import { describe, expect, it } from 'vitest';
import { roll } from '@/engine';
import { fichaDeExemplo, ataqueComArma, danoDaArma, type Arma } from '@/daggerheart/ficha';
import { gerarCodigoDeSala, normalizarCodigo, type RolagemCompartilhada } from './types';

describe('códigos de sala', () => {
  it('gera do tamanho pedido', () => {
    expect(gerarCodigoDeSala()).toHaveLength(4);
    expect(gerarCodigoDeSala(6)).toHaveLength(6);
  });

  it('evita caracteres que se confundem lidos em voz alta ou por foto', () => {
    // O par O/0 e o par I/1 saem inteiros. Já o 5 pode ficar, porque o S —
    // o único com que ele se confunde — está fora.
    const proibidos = /[OI01S]/;
    for (let i = 0; i < 400; i += 1) {
      expect(gerarCodigoDeSala(6)).not.toMatch(proibidos);
    }
  });

  it('praticamente não repete', () => {
    const vistos = new Set<string>();
    for (let i = 0; i < 500; i += 1) vistos.add(gerarCodigoDeSala(4));
    expect(vistos.size).toBeGreaterThan(480);
  });

  it('normaliza o que o jogador digita', () => {
    expect(normalizarCodigo(' a3-b7 ')).toBe('A3B7');
    expect(normalizarCodigo('kqxr')).toBe('KQXR');
    expect(normalizarCodigo('')).toBe('');
  });

  it('não tenta adivinhar letra trocada', () => {
    // Corrigir "O" acertaria às vezes e estragaria um código válido nas
    // outras; melhor deixar o servidor dizer que a sala não existe.
    expect(normalizarCodigo('QO')).toBe('QO');
  });

  it('limita o tamanho', () => {
    expect(normalizarCodigo('ABCDEFGHIJKLMNOP').length).toBeLessThanOrEqual(8);
  });
});

/**
 * A mesa compartilhada inteira depende desta propriedade: como só a
 * expressão e a semente trafegam, cada aparelho reexecuta o motor e precisa
 * chegar ao MESMO resultado. Se isto quebrar, jogadores veem números
 * diferentes para a mesma rolagem.
 */
describe('reprodução de uma rolagem recebida', () => {
  const ficha = fichaDeExemplo('f1');
  const espada = ficha.armas[0] as Arma;

  const expressoes = [
    'dd+2[Força]',
    'dd+2+1d6[Força]',
    'dd-1[Saber]',
    ataqueComArma(ficha, espada).expressao,
    danoDaArma(ficha, espada).expressao,
    danoDaArma(ficha, espada, { critico: true }).expressao,
    '4d6kh3+2',
    '10d10>=7f1',
    '6d6!',
    '2d20kl1+3',
    '4dF',
  ];

  for (const expressao of expressoes) {
    it(`"${expressao}" chega igual do outro lado`, () => {
      const original = roll(expressao);

      const carga: RolagemCompartilhada = {
        id: 'h1',
        expressao: original.expression,
        semente: original.seed,
        momento: original.timestamp,
        personagem: 'Vess',
        skin: 'ambar',
        atalho: null,
        oculta: false,
      };

      // Do outro lado da mesa, só isto é conhecido.
      const reproduzida = roll(carga.expressao, { seed: carga.semente });

      expect(reproduzida.total).toBe(original.total);
      expect(reproduzida.dice.map((d) => d.value)).toEqual(
        original.dice.map((d) => d.value),
      );
      expect(reproduzida.detail).toBe(original.detail);
      expect(reproduzida.duality).toEqual(original.duality);
      expect(reproduzida.critical).toBe(original.critical);
    });
  }

  it('o par de dualidade mantém quem é Esperança e quem é Medo', () => {
    const original = roll('dd+3[Ataque]');
    const reproduzida = roll(original.expression, { seed: original.seed });

    const papeis = (r: typeof original) => r.dice.map((d) => `${d.role}:${d.value}`);
    expect(papeis(reproduzida)).toEqual(papeis(original));
  });

  it('as cores dos dados atravessam a rede', () => {
    const original = roll('dd');
    const reproduzida = roll(original.expression, { seed: original.seed });

    expect(reproduzida.dice.map((d) => d.skinOverride)).toEqual(
      original.dice.map((d) => d.skinOverride),
    );
  });
});
