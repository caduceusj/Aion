/**
 * O calendário fecha consigo mesmo.
 *
 * O céu de Aion é um sistema pequeno o bastante para ser verificado inteiro,
 * e é isso que este arquivo faz: confere que a rota volta ao começo, que as
 * velocidades são mesmo a distância dividida pela viagem, que os doze meses
 * batem com a tabela de 36 trechos e que a aritmética dos dias dá no mês de
 * 30 que todo continente usa.
 *
 * Um calendário inventado só é bom enquanto não se contradiz. Isto é o que
 * impede a contradição de entrar sem ninguém ver.
 */

import { describe, expect, it } from 'vitest';
import {
  CICLOS,
  CONTINENTES,
  CORVISSEIA,
  DIAS_DA_CORVISSEIA,
  DIAS_DA_SEMANA,
  DIAS_DA_VOLTA,
  DIAS_DE_ESTADIA,
  DIAS_DE_VIAGEM,
  DIAS_DO_ANO,
  DIAS_DO_MES,
  MESES,
  ROTA,
  continente,
  continentePorCodigo,
  faseDaConstelacao,
  faseDaLua,
  mes,
  trecho,
  velocidade,
} from './calendario';
import { existe } from './corpus';

/** As velocidades como a prancha do usuário as imprime, em km/s. */
const VELOCIDADES_DA_TABELA = [
  178, 209, 126, 396, 256, 300, 209, 297, 81, 337, 41, 300, 178, 173, 306, 362, 81, 300, 209, 209,
  310, 178, 344, 300, 178, 297, 410, 76, 336, 300, 209, 173, 285, 154, 396, 300,
];

describe('a aritmética do céu', () => {
  it('estadia mais viagem dá o mês que todo continente usa', () => {
    expect(DIAS_DE_ESTADIA + DIAS_DE_VIAGEM).toBe(DIAS_DO_MES);
  });

  it('seis continentes fecham a volta em 180 dias', () => {
    expect(CONTINENTES).toHaveLength(6);
    expect(DIAS_DA_VOLTA).toBe(180);
  });

  it('o ano de Valoran são duas voltas da lua', () => {
    expect(DIAS_DO_ANO).toBe(360);
    expect(DIAS_DO_ANO / DIAS_DA_VOLTA).toBe(2);
    expect(CICLOS.medio.periodo).toBe(DIAS_DO_ANO);
  });

  it('a Corvisseia são seis voltas e três anos, e fecha nos dois', () => {
    expect(DIAS_DA_CORVISSEIA).toBe(1080);
    expect(DIAS_DA_CORVISSEIA / DIAS_DA_VOLTA).toBe(6);
    expect(DIAS_DA_CORVISSEIA / DIAS_DO_ANO).toBe(3);
    expect(CORVISSEIA).toHaveLength(36);
  });

  it('a semana tem um dia por continente', () => {
    expect(DIAS_DA_SEMANA).toHaveLength(CONTINENTES.length);
    expect(DIAS_DO_MES % DIAS_DA_SEMANA.length).toBe(0);
  });

  it('as órbitas crescem com o período, como Kepler manda', () => {
    expect(CICLOS.curto.periodo).toBeLessThan(CICLOS.medio.periodo);
    expect(CICLOS.medio.periodo).toBeLessThan(CICLOS.longo.periodo);
    expect(CICLOS.curto.raioUA).toBeLessThan(CICLOS.medio.raioUA);
    expect(CICLOS.medio.raioUA).toBeLessThan(CICLOS.longo.raioUA);
  });

  it('a órbita média é a que a corda constante de 1,82 UA exige', () => {
    // Dois pontos da mesma órbita a 120° distam 2·a·sen60°. É esse número que
    // fixa o raio médio, e é por isso que Valoran → Yōso nunca muda.
    const corda = 2 * CICLOS.medio.raioUA * Math.sin(Math.PI / 3);
    expect(corda).toBeCloseTo(1.82, 1);
  });
});

describe('a rota de Corvus', () => {
  it('passa por todos os seis continentes, uma vez cada', () => {
    expect(new Set(ROTA).size).toBe(6);
    expect(ROTA).toHaveLength(6);
  });

  it('cada trecho começa onde o anterior terminou, e o ciclo fecha', () => {
    CORVISSEIA.forEach((atual, indice) => {
      const seguinte = CORVISSEIA[(indice + 1) % CORVISSEIA.length];
      expect(atual.para, `trecho ${atual.mes} não emenda no ${seguinte?.mes}`).toBe(seguinte?.de);
    });
  });

  it('a rota se repete igual nas seis voltas', () => {
    for (let volta = 1; volta <= 6; volta += 1) {
      const trechos = CORVISSEIA.filter((t) => t.volta === volta);
      expect(trechos, `volta ${volta}`).toHaveLength(6);
      expect(trechos.map((t) => t.de)).toEqual(ROTA);
    }
  });

  it('nenhum trecho sai de um continente para ele mesmo', () => {
    for (const t of CORVISSEIA) expect(t.de, `trecho ${t.mes}`).not.toBe(t.para);
  });

  it('todo código orbital da tabela é um continente conhecido', () => {
    for (const t of CORVISSEIA) {
      expect(continentePorCodigo(t.de), `${t.de}`).toBeDefined();
      expect(continentePorCodigo(t.para), `${t.para}`).toBeDefined();
    }
  });

  it('Valoran → Yōso mede o mesmo em toda passagem: é o mesmo anel', () => {
    const iguais = CORVISSEIA.filter((t) => t.de === 'C3' && t.para === 'C4');
    expect(iguais).toHaveLength(6);
    for (const t of iguais) expect(t.distanciaUA).toBe(1.82);
  });
});

describe('as velocidades saem das distâncias', () => {
  it('cada trecho bate com a tabela impressa, a menos do arredondamento', () => {
    CORVISSEIA.forEach((t, indice) => {
      const impressa = VELOCIDADES_DA_TABELA[indice] as number;
      const calculada = Math.round(velocidade(t.distanciaUA));
      // A tabela arredonda a distância em duas casas; ±2 km/s é o ruído disso.
      expect(Math.abs(calculada - impressa), `mês ${t.mes}: ${calculada} vs ${impressa}`).toBeLessThanOrEqual(2);
    });
  });

  it('o pulo classifica a distância, e não o contrário', () => {
    for (const t of CORVISSEIA) {
      if (t.pulo === 'sem-pulo') expect(t.distanciaUA, `mês ${t.mes}`).toBeLessThan(0.5);
      if (t.pulo === 'normal') {
        expect(t.distanciaUA, `mês ${t.mes}`).toBeGreaterThanOrEqual(0.5);
        expect(t.distanciaUA, `mês ${t.mes}`).toBeLessThan(1.5);
      }
      if (t.pulo === 'intenso') expect(t.distanciaUA, `mês ${t.mes}`).toBeGreaterThanOrEqual(1.5);
    }
  });
});

describe('os doze meses', () => {
  it('são doze, numerados em ordem', () => {
    expect(MESES).toHaveLength(12);
    MESES.forEach((m, indice) => expect(m.numero).toBe(indice + 1));
  });

  it('cada mês tem nome, constelação e estação próprios', () => {
    expect(new Set(MESES.map((m) => m.nome)).size).toBe(12);
    expect(new Set(MESES.map((m) => m.constelacao)).size).toBe(12);
    for (const estacao of ['verao', 'outono', 'inverno', 'primavera'] as const) {
      expect(MESES.filter((m) => m.estacao === estacao), estacao).toHaveLength(3);
    }
  });

  it('a lua do mês é o continente de onde o trecho daquele mês parte', () => {
    for (const m of MESES) {
      const partida = continentePorCodigo(trecho(m.numero).de);
      expect(partida.id, `mês ${m.numero} (${m.nome})`).toBe(m.lua);
    }
  });

  it('cada continente recebe a lua duas vezes por ano, meio ano entre elas', () => {
    for (const corpo of CONTINENTES) {
      const visitas = MESES.filter((m) => m.lua === corpo.id).map((m) => m.numero);
      expect(visitas, corpo.nome).toHaveLength(2);
      expect((visitas[1] as number) - (visitas[0] as number), corpo.nome).toBe(6);
    }
  });

  it('mes() dá a volta no ano em vez de estourar', () => {
    expect(mes(13).nome).toBe(mes(1).nome);
    expect(mes(24).nome).toBe(mes(12).nome);
  });

  it('todo continente aponta para um verbete que existe', () => {
    for (const corpo of CONTINENTES) {
      expect(existe(corpo.chave), `${corpo.nome} → ${corpo.chave}`).toBe(true);
      expect(continente(corpo.id).nome).toBe(corpo.nome);
    }
  });
});

describe('as fases de um dia', () => {
  it('a constelação cobre os trinta dias, sem buraco nem sobreposição', () => {
    for (let dia = 1; dia <= DIAS_DO_MES; dia += 1) {
      expect(faseDaConstelacao(dia), `dia ${dia}`).toBeDefined();
    }
    expect(faseDaConstelacao(1).id).toBe('ascensao');
    expect(faseDaConstelacao(10).id).toBe('ascensao');
    expect(faseDaConstelacao(11).id).toBe('dominio');
    expect(faseDaConstelacao(20).id).toBe('dominio');
    expect(faseDaConstelacao(21).id).toBe('virada');
    expect(faseDaConstelacao(30).id).toBe('virada');
  });

  it('quem está sob a lua vê luz e depois eco; os outros, noite escura', () => {
    // Equiral: o mês em que Corvus está sobre Valoran.
    const equiral = mes(6);
    expect(equiral.lua).toBe('valoran');
    expect(faseDaLua(equiral, 1, 'valoran')).toBe('luz');
    expect(faseDaLua(equiral, 20, 'valoran')).toBe('luz');
    expect(faseDaLua(equiral, 21, 'valoran')).toBe('ecos');
    expect(faseDaLua(equiral, 30, 'valoran')).toBe('ecos');
    expect(faseDaLua(equiral, 15, 'fentor')).toBe('escura');
  });

  it('todo continente tem exatamente dois meses de luz no ano', () => {
    for (const corpo of CONTINENTES) {
      const comLuz = MESES.filter((m) => faseDaLua(m, 1, corpo.id) === 'luz');
      expect(comLuz, corpo.nome).toHaveLength(2);
    }
  });
});
