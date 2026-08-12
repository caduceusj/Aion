import { describe, expect, it } from 'vitest';
import { roll, validate } from '@/engine';
import {
  ataqueComArma,
  comModificador,
  danoDaArma,
  fichaDeExemplo,
  fichaEmBranco,
  proficiencia,
  rolagemDeReacao,
  testeDeAtributo,
  type Arma,
} from './ficha';
import {
  DIFICULDADES,
  ESPERANCA_MAXIMA,
  lerDesfecho,
  pontosDeVidaPorDano,
  proficienciaDoNivel,
  TRAITS,
  tierDoNivel,
} from './regras';

const ficha = fichaDeExemplo('f1');
const espada = ficha.armas[0] as Arma;
const arco = ficha.armas[1] as Arma;

describe('dados de dualidade no motor', () => {
  it('rola dois d12 marcados como Esperança e Medo', () => {
    const resultado = roll('dd', { seed: 'dualidade' });

    expect(resultado.dice).toHaveLength(2);
    expect(resultado.duality).not.toBeNull();

    const esperanca = resultado.dice.find((d) => d.role === 'esperanca');
    const medo = resultado.dice.find((d) => d.role === 'medo');

    expect(esperanca?.sides).toBe(12);
    expect(medo?.sides).toBe(12);
    expect(resultado.total).toBe((esperanca?.value ?? 0) + (medo?.value ?? 0));
  });

  it('os dois dados caem com cores diferentes na mesa', () => {
    const resultado = roll('dd', { seed: 'cores' });
    const esperanca = resultado.dice.find((d) => d.role === 'esperanca');
    const medo = resultado.dice.find((d) => d.role === 'medo');

    expect(esperanca?.skinOverride).toBeDefined();
    expect(medo?.skinOverride).toBeDefined();
    expect(esperanca?.skinOverride).not.toBe(medo?.skinOverride);
  });

  it('soma o modificador ao par', () => {
    const resultado = roll('dd+3', { seed: 'mod' });
    const soma = resultado.dice.reduce((acc, d) => acc + d.value, 0);
    expect(resultado.total).toBe(soma + 3);
  });

  it('empate é sucesso crítico', () => {
    let encontrou = false;
    for (let i = 0; i < 600 && !encontrou; i += 1) {
      const resultado = roll('dd');
      const { duality } = resultado;
      if (duality && duality.hope === duality.fear) {
        encontrou = true;
        expect(duality.outcome).toBe('critico');
        expect(resultado.critical).toBe('max');
      }
    }
    expect(encontrou).toBe(true);
  });

  it('classifica Esperança e Medo pelo dado maior', () => {
    for (let i = 0; i < 300; i += 1) {
      const { duality } = roll('dd');
      if (!duality) continue;
      if (duality.hope > duality.fear) expect(duality.outcome).toBe('esperanca');
      else if (duality.fear > duality.hope) expect(duality.outcome).toBe('medo');
      else expect(duality.outcome).toBe('critico');
    }
  });

  it('descreve o desfecho no detalhamento', () => {
    const resultado = roll('dd+2', { seed: 'detalhe' });
    expect(resultado.detail).toContain('Esperança');
    expect(resultado.detail).toContain('Medo');
    expect(resultado.detail).toMatch(/com Esperança|com Medo|sucesso crítico/);
  });

  it('a dualidade é reproduzível pela semente', () => {
    const a = roll('dd+1', { seed: 'auditoria' });
    const b = roll('dd+1', { seed: 'auditoria' });
    expect(b.duality).toEqual(a.duality);
    expect(b.total).toBe(a.total);
  });

  it('rolagens comuns não trazem dualidade', () => {
    expect(roll('2d12', { seed: 'x' }).duality).toBeNull();
    expect(roll('1d20', { seed: 'x' }).dice[0]?.role).toBeNull();
  });

  it('convive com o resto da notação', () => {
    expect(validate('dd+2+1d6')).toBeNull();
    expect(validate('dd-1d6')).toBeNull();
    expect(validate('dd')).toBeNull();

    const comVantagem = roll('dd+2+1d6', { seed: 'vant' });
    expect(comVantagem.dice).toHaveLength(3);
  });
});

describe('proficiência', () => {
  it('cresce com o nível', () => {
    expect(proficienciaDoNivel(1)).toBe(1);
    expect(proficienciaDoNivel(2)).toBe(2);
    expect(proficienciaDoNivel(5)).toBe(3);
    expect(proficienciaDoNivel(8)).toBe(4);
  });

  it('limita níveis fora da faixa', () => {
    expect(proficienciaDoNivel(0)).toBe(1);
    expect(proficienciaDoNivel(99)).toBe(4);
  });

  it('a ficha pode sobrescrever a tabela', () => {
    expect(proficiencia({ ...ficha, nivel: 1 })).toBe(1);
    expect(proficiencia({ ...ficha, nivel: 1, proficienciaManual: 3 })).toBe(3);
  });

  it('o tier acompanha o nível', () => {
    expect(tierDoNivel(1)).toBe(1);
    expect(tierDoNivel(3)).toBe(2);
    expect(tierDoNivel(6)).toBe(3);
    expect(tierDoNivel(10)).toBe(4);
  });
});

describe('montagem das rolagens', () => {
  it('teste de atributo soma o modificador da ficha', () => {
    // Força +2 na ficha de exemplo.
    expect(testeDeAtributo(ficha, 'forca').expressao).toBe('dd+2[Força]');
    expect(testeDeAtributo(ficha, 'saber').expressao).toBe('dd-1[Saber]');
    expect(testeDeAtributo(ficha, 'precisao').expressao).toBe('dd[Precisão]');
  });

  it('vantagem soma 1d6 e desvantagem subtrai', () => {
    expect(testeDeAtributo(ficha, 'forca', { vantagem: true }).expressao).toBe(
      'dd+2+1d6[Força]',
    );
    expect(testeDeAtributo(ficha, 'forca', { desvantagem: true }).expressao).toBe(
      'dd+2-1d6[Força]',
    );
  });

  it('vantagem e desvantagem juntas se cancelam', () => {
    expect(
      testeDeAtributo(ficha, 'forca', { vantagem: true, desvantagem: true }).expressao,
    ).toBe('dd+2[Força]');
  });

  it('a Experiência entra como bônus', () => {
    const experiencia = ficha.experiencias[0];
    expect(experiencia).toBeDefined();
    const rolagem = testeDeAtributo(ficha, 'forca', { experienciaId: experiencia?.id });
    expect(rolagem.expressao).toBe('dd+4[Força]');
  });

  it('ataque usa o atributo da arma', () => {
    // Espada usa Força (+2); arco usa Precisão (0).
    expect(ataqueComArma(ficha, espada).expressao).toBe('dd+2[Ataque: Espada longa]');
    expect(ataqueComArma(ficha, arco).expressao).toBe('dd[Ataque: Arco curto]');
  });

  it('dano multiplica os dados pela proficiência', () => {
    expect(danoDaArma(ficha, espada).expressao).toBe('1d8+3[Dano: Espada longa]');

    const nivel5 = { ...ficha, nivel: 5 };
    expect(proficiencia(nivel5)).toBe(3);
    expect(danoDaArma(nivel5, espada).expressao).toBe('3d8+3[Dano: Espada longa]');
  });

  it('dano crítico soma o máximo dos dados', () => {
    // Proficiência 1, d8 => máximo 8, somado ao bônus 3.
    expect(danoDaArma(ficha, espada, { critico: true }).expressao).toBe(
      '1d8+11[Dano crítico: Espada longa]',
    );

    const nivel5 = { ...ficha, nivel: 5 };
    // Proficiência 3, d8 => máximo 24, mais bônus 3.
    expect(danoDaArma(nivel5, espada, { critico: true }).expressao).toBe(
      '3d8+27[Dano crítico: Espada longa]',
    );
  });

  it('reação ignora Experiências mas aceita a situação', () => {
    expect(rolagemDeReacao(ficha, 'instinto').expressao).toBe('dd+1[Reação: Instinto]');
    expect(rolagemDeReacao(ficha, 'instinto', { vantagem: true }).expressao).toBe(
      'dd+1+1d6[Reação: Instinto]',
    );
  });

  it('tudo que a ficha monta é válido para o motor', () => {
    const expressoes: string[] = [];

    for (const trait of TRAITS) {
      expressoes.push(testeDeAtributo(ficha, trait.id).expressao);
      expressoes.push(testeDeAtributo(ficha, trait.id, { vantagem: true }).expressao);
      expressoes.push(testeDeAtributo(ficha, trait.id, { desvantagem: true }).expressao);
      expressoes.push(rolagemDeReacao(ficha, trait.id).expressao);
    }

    for (const arma of ficha.armas) {
      expressoes.push(ataqueComArma(ficha, arma).expressao);
      expressoes.push(danoDaArma(ficha, arma).expressao);
      expressoes.push(danoDaArma(ficha, arma, { critico: true }).expressao);
    }

    for (const expressao of expressoes) {
      expect(validate(expressao), `expressão inválida: ${expressao}`).toBeNull();
      expect(() => roll(expressao, { seed: 'valida' })).not.toThrow();
    }
  });

  it('funciona também com a ficha em branco', () => {
    const vazia = fichaEmBranco('f2');
    const rolagem = testeDeAtributo(vazia, 'agilidade');
    expect(rolagem.expressao).toBe('dd[Agilidade]');
    expect(validate(rolagem.expressao)).toBeNull();
  });

  it('o rótulo chega ao resultado', () => {
    const rolagem = ataqueComArma(ficha, espada);
    const resultado = roll(rolagem.expressao, { seed: 'rotulo' });
    expect(resultado.label).toBe('Ataque: Espada longa');
  });
});

describe('comModificador', () => {
  it('escreve do jeito que o motor lê', () => {
    expect(comModificador('dd', 0)).toBe('dd');
    expect(comModificador('dd', 3)).toBe('dd+3');
    expect(comModificador('dd', -2)).toBe('dd-2');
    expect(comModificador('2d8', 5)).toBe('2d8+5');
  });
});

describe('leitura do desfecho', () => {
  it('empate é crítico mesmo sem Dificuldade definida', () => {
    expect(lerDesfecho(14, 7, 7, null)?.id).toBe('critico');
    expect(lerDesfecho(14, 7, 7, 30)?.id).toBe('critico');
  });

  it('separa sucesso e falha pela Dificuldade', () => {
    expect(lerDesfecho(16, 9, 5, 15)?.id).toBe('sucesso-esperanca');
    expect(lerDesfecho(16, 5, 9, 15)?.id).toBe('sucesso-medo');
    expect(lerDesfecho(12, 8, 4, 15)?.id).toBe('falha-esperanca');
    expect(lerDesfecho(12, 4, 8, 15)?.id).toBe('falha-medo');
  });

  it('sem Dificuldade, só a consequência é conhecida', () => {
    expect(lerDesfecho(16, 9, 5, null)).toBeNull();
  });

  it('todo desfecho traz o efeito por extenso', () => {
    const desfecho = lerDesfecho(16, 9, 5, 15);
    expect(desfecho?.efeito.length).toBeGreaterThan(10);
  });
});

describe('limiares de dano', () => {
  it('classifica pelas faixas da ficha', () => {
    expect(pontosDeVidaPorDano(4, 7, 13).pontosDeVida).toBe(1);
    expect(pontosDeVidaPorDano(7, 7, 13).pontosDeVida).toBe(2);
    expect(pontosDeVidaPorDano(12, 7, 13).pontosDeVida).toBe(2);
    expect(pontosDeVidaPorDano(13, 7, 13).pontosDeVida).toBe(3);
    expect(pontosDeVidaPorDano(40, 7, 13).pontosDeVida).toBe(3);
  });
});

describe('tabelas de referência', () => {
  it('traz os seis atributos com nome e original', () => {
    expect(TRAITS).toHaveLength(6);
    for (const trait of TRAITS) {
      expect(trait.nome.length).toBeGreaterThan(0);
      expect(trait.original.length).toBeGreaterThan(0);
      expect(trait.exemplos.length).toBeGreaterThan(0);
    }
  });

  it('a escala de Dificuldade é crescente', () => {
    for (let i = 1; i < DIFICULDADES.length; i += 1) {
      expect(DIFICULDADES[i]?.valor).toBeGreaterThan(DIFICULDADES[i - 1]?.valor ?? 0);
    }
  });

  it('o teto de Esperança é o do sistema', () => {
    expect(ESPERANCA_MAXIMA).toBe(6);
  });
});
