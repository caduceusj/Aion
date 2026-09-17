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
  CONSTELACOES,
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
  afelioUA,
  anguloEm,
  constelacaoNoAngulo,
  constelacaoVisivel,
  distanciaEntre,
  estadoDaLua,
  faseDaConstelacao,
  faseDaLua,
  mes,
  perielioUA,
  posicaoDaLua,
  posicaoEm,
  raioEm,
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

  it('os três semi-eixos são os que Kepler pede, a menos de 1%', () => {
    // a ∝ T^⅔, ancorando a órbita média em 1 UA. Se alguém mexer num raio
    // sem mexer no período, o sistema deixa de poder existir e isto avisa.
    for (const ciclo of Object.values(CICLOS)) {
      const deKepler = Math.pow(ciclo.periodo / CICLOS.medio.periodo, 2 / 3) * CICLOS.medio.raioUA;
      const desvio = Math.abs(ciclo.raioUA - deKepler) / deKepler;
      expect(desvio, `${ciclo.rotulo}: ${ciclo.raioUA} vs ${deKepler.toFixed(3)}`).toBeLessThan(0.01);
    }
  });

  it('só o ciclo curto é um círculo; os outros dois têm periélio e afélio', () => {
    expect(CICLOS.curto.excentricidade).toBe(0);
    expect(CICLOS.medio.excentricidade).toBeGreaterThan(0);
    expect(CICLOS.longo.excentricidade).toBeGreaterThan(0);
    for (const corpo of CONTINENTES) {
      expect(perielioUA(corpo), corpo.nome).toBeLessThanOrEqual(afelioUA(corpo));
      const raios = Array.from({ length: 60 }, (_, i) => raioEm(corpo, i * 9));
      for (const r of raios) {
        expect(r, corpo.nome).toBeGreaterThanOrEqual(perielioUA(corpo) - 1e-9);
        expect(r, corpo.nome).toBeLessThanOrEqual(afelioUA(corpo) + 1e-9);
      }
    }
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

describe('a mecânica do céu', () => {
  it('os três do meio ficam sempre a 120° um do outro', () => {
    const [fentor, valoran, yoso] = ['fentor', 'valoran', 'yoso'].map((id) =>
      CONTINENTES.find((c) => c.id === id)!,
    ) as [typeof CONTINENTES[number], typeof CONTINENTES[number], typeof CONTINENTES[number]];
    for (let dia = 0; dia < DIAS_DA_CORVISSEIA; dia += 17) {
      const separacao = (a: number, b: number) => {
        const bruto = Math.abs(a - b) % 360;
        return Math.min(bruto, 360 - bruto);
      };
      expect(separacao(anguloEm(valoran, dia), anguloEm(yoso, dia)), `dia ${dia}`).toBeCloseTo(120, 6);
      expect(separacao(anguloEm(valoran, dia), anguloEm(fentor, dia)), `dia ${dia}`).toBeCloseTo(120, 6);
    }
  });

  it('quando Vrednost está no periélio, Ukanten está no afélio', () => {
    const vrednost = CONTINENTES.find((c) => c.id === 'vrednost')!;
    const ukanten = CONTINENTES.find((c) => c.id === 'ukanten')!;
    for (let dia = 0; dia < CICLOS.longo.periodo; dia += 13) {
      // Meia volta de diferença, sempre: é isso que faz um estar perto
      // exatamente quando o outro está longe.
      const bruto = Math.abs(anguloEm(vrednost, dia) - anguloEm(ukanten, dia)) % 360;
      expect(Math.min(bruto, 360 - bruto), `dia ${dia}`).toBeCloseTo(180, 6);
    }

    // No dia do periélio de um, o outro está no afélio — o mesmo dia.
    const diaDoPerielio =
      ((vrednost.rumoDoPerielio - vrednost.anguloInicial + 360) % 360) /
      (360 / CICLOS.longo.periodo);
    expect(raioEm(vrednost, diaDoPerielio)).toBeCloseTo(perielioUA(vrednost), 6);
    expect(raioEm(ukanten, diaDoPerielio)).toBeCloseTo(afelioUA(ukanten), 6);
  });

  it('o ano de Valoran começa no periélio dele', () => {
    const valoran = CONTINENTES.find((c) => c.id === 'valoran')!;
    expect(raioEm(valoran, 0)).toBeCloseTo(perielioUA(valoran), 9);
    expect(raioEm(valoran, DIAS_DO_ANO / 2)).toBeCloseTo(afelioUA(valoran), 9);
  });

  it('o modelo fecha em 1080 dias, como a tabela promete', () => {
    // As distâncias entre continentes voltam a ser as mesmas depois de uma
    // Corvisseia — o mesmo período que a tabela de trechos encontrou por
    // outro caminho. As duas fontes concordam nisto.
    for (const a of CONTINENTES) {
      for (const b of CONTINENTES) {
        if (a === b) continue;
        for (let dia = 0; dia < 200; dia += 37) {
          expect(
            Math.abs(distanciaEntre(a, b, dia) - distanciaEntre(a, b, dia + DIAS_DA_CORVISSEIA)),
            `${a.nome}→${b.nome} no dia ${dia}`,
          ).toBeLessThan(1e-9);
        }
      }
    }
  });

  it('Corvus está sempre junto do continente sobre o qual pousou', () => {
    for (let dia = 0; dia < DIAS_DA_CORVISSEIA; dia += 7) {
      const estado = estadoDaLua(dia);
      if (estado.estado !== 'parada') continue;
      const anfitriao = continentePorCodigo(estado.em);
      const lua = posicaoDaLua(dia);
      const casa = posicaoEm(anfitriao, dia);
      expect(Math.hypot(lua.leste - casa.leste, lua.norte - casa.norte), `dia ${dia}`).toBeLessThan(0.1);
    }
  });

  it('a estadia e a viagem somam o mês, dia a dia', () => {
    let parada = 0;
    let viagem = 0;
    for (let dia = 0; dia < DIAS_DO_MES * 2; dia += 0.5) {
      if (estadoDaLua(dia).estado === 'parada') parada += 0.5;
      else viagem += 0.5;
    }
    expect(parada / 2).toBe(DIAS_DE_ESTADIA);
    expect(viagem / 2).toBe(DIAS_DE_VIAGEM);
  });

  it('a lua do mês da tabela é a lua do mês do modelo', () => {
    // Os dois lados do almanaque têm de contar a mesma história: o continente
    // que a prancha imprime como "lua do mês" é o que o modelo mostra com
    // Corvus em cima no meio daquele mês.
    for (const m of MESES) {
      const meio = (m.numero - 1) * DIAS_DO_MES + DIAS_DE_ESTADIA / 2;
      const estado = estadoDaLua(meio);
      expect(estado.estado, `mês ${m.nome}`).toBe('parada');
      expect(continentePorCodigo(estado.em).id, `mês ${m.nome}`).toBe(m.lua);
    }
  });
});

describe('as doze constelações', () => {
  it('são doze, cobrem o céu inteiro e não se sobrepõem', () => {
    expect(CONSTELACOES).toHaveLength(12);
    CONSTELACOES.forEach((c, i) => {
      expect(c.indice).toBe(i);
      expect(c.de).toBe(i * 30);
    });
    expect(new Set(CONSTELACOES.map((c) => c.nome)).size).toBe(12);
  });

  it('cada uma tem o seu desenho de estrelas', () => {
    for (const c of CONSTELACOES) {
      expect(c.tracos.length, c.nome).toBeGreaterThan(0);
      for (const [inicio, fim] of c.tracos) {
        expect(inicio, c.nome).not.toEqual(fim);
      }
    }
  });

  it('a fatia do céu é a mesma dando a volta', () => {
    expect(constelacaoNoAngulo(0).nome).toBe(CONSTELACOES[0]!.nome);
    expect(constelacaoNoAngulo(359.9).nome).toBe(CONSTELACOES[11]!.nome);
    expect(constelacaoNoAngulo(360).nome).toBe(CONSTELACOES[0]!.nome);
    expect(constelacaoNoAngulo(-1).nome).toBe(CONSTELACOES[11]!.nome);
  });

  it('o mês valoriano é a constelação que Valoran atravessa', () => {
    // É esta a razão de os meses terem os nomes que têm, e o teste existe
    // para que ela não possa ser quebrada por engano.
    const valoran = CONTINENTES.find((c) => c.id === 'valoran')!;
    for (const m of MESES) {
      const dia = (m.numero - 1) * DIAS_DO_MES;
      expect(constelacaoVisivel(valoran, dia).nome, `mês ${m.nome}`).toBe(m.constelacao);
      expect(constelacaoVisivel(valoran, dia + 29).nome, `fim de ${m.nome}`).toBe(m.constelacao);
    }
  });

  it('Al-Hara vê as doze duas vezes por ano; o anel longo, uma a cada 45 dias', () => {
    const alhara = CONTINENTES.find((c) => c.id === 'al-hara')!;
    const vistas = new Set<string>();
    for (let dia = 0; dia < DIAS_DO_ANO / 2; dia += 1) vistas.add(constelacaoVisivel(alhara, dia).nome);
    expect(vistas.size).toBe(12);

    const vrednost = CONTINENTES.find((c) => c.id === 'vrednost')!;
    expect(30 / (360 / CICLOS[vrednost.ciclo].periodo)).toBe(45);
  });
});
