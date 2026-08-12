import { describe, expect, it } from 'vitest';
import { roll, validate } from '@/engine';
import { carregarSrd, type CartaDeDominio } from './index';
import { extrairDanosDaCarta, montarDanoDeCarta } from './dano';

const srd = await carregarSrd();
const porNome = (nome: string): CartaDeDominio => {
  const carta = srd.cartas.find((item) => item.nome === nome);
  if (!carta) throw new Error(`carta não encontrada: ${nome}`);
  return carta;
};

describe('leitura do dano no texto das cartas', () => {
  it('lê dano sem contagem como proficiência', () => {
    // "dealing d8+2 magic damage using your Proficiency"
    const danos = extrairDanosDaCarta(porNome('Bolt Beacon'));
    expect(danos).toHaveLength(1);
    expect(danos[0]).toMatchObject({ quantidade: null, faces: 8, bonus: 2, tipo: 'magic' });
  });

  it('lê dano com contagem fixa como está', () => {
    const danos = extrairDanosDaCarta(porNome('Book of Tyfar'));
    expect(danos[0]).toMatchObject({ quantidade: 2, faces: 6, bonus: 0, tipo: 'magic' });
  });

  it('uma carta pode misturar dano por proficiência e dano fixo', () => {
    // Rain of Blades: "d8+2 ... using your Proficiency" em uma frase e
    // "an extra 1d8 damage" em outra. Cada uma segue a sua própria regra.
    const danos = extrairDanosDaCarta(porNome('Rain of Blades'));
    expect(danos).toHaveLength(2);
    expect(danos[0]).toMatchObject({ quantidade: null, faces: 8, bonus: 2 });
    expect(danos[1]).toMatchObject({ quantidade: 1, faces: 8, bonus: 0 });
  });

  it('a menção à proficiência é lida por parágrafo, não por carta', () => {
    // Book of Exota é um grimório: a habilidade que cita "Spellcast trait"
    // não tem dano, e a que tem dano traz contagem fixa. Ler a carta inteira
    // associaria as duas por engano e dobraria o dano na mesa.
    const danos = extrairDanosDaCarta(porNome('Book of Exota'));
    expect(danos).toHaveLength(1);
    expect(danos[0]).toMatchObject({ quantidade: 2, faces: 10, bonus: 3 });
    expect(danos[0]?.citaProficiencia).toBe(false);
  });

  it('uma carta pode oferecer várias opções de dano', () => {
    // Tempest traz três efeitos, cada um com o seu dano.
    const danos = extrairDanosDaCarta(porNome('Tempest'));
    expect(danos.length).toBeGreaterThanOrEqual(3);
    const assinaturas = danos.map((d) => `${d.quantidade}d${d.faces}+${d.bonus}`);
    expect(new Set(assinaturas).size).toBe(assinaturas.length);
  });

  it('trechos idênticos na mesma carta viram um só botão', () => {
    // Chain Lightning repete "2d8+4 magic damage" em duas frases.
    const danos = extrairDanosDaCarta(porNome('Chain Lightning'));
    expect(danos).toHaveLength(1);
    expect(danos[0]).toMatchObject({ quantidade: 2, faces: 8, bonus: 4 });
  });

  it('não confunde dados que não são dano', () => {
    // "spend any number of Hope to roll that many d6s" não é dano.
    const reflexo = srd.cartas.find((c) => c.nome === 'Arcane Reflection');
    if (reflexo) {
      for (const dano of extrairDanosDaCarta(reflexo)) {
        expect(dano.trecho.toLowerCase()).toContain('damage');
      }
    }
    // E nenhuma carta pode extrair dano de um texto sem a palavra "damage".
    for (const carta of srd.cartas) {
      for (const dano of extrairDanosDaCarta(carta)) {
        expect(dano.trecho.toLowerCase(), `${carta.nome}: ${dano.trecho}`).toContain('damage');
      }
    }
  });

  it('cartas sem dano devolvem lista vazia', () => {
    const semDano = srd.cartas.filter((carta) => extrairDanosDaCarta(carta).length === 0);
    expect(semDano.length).toBeGreaterThan(100);
  });
});

/**
 * Este é o teste que trava a regra descoberta nos dados: se uma atualização
 * do SRD trouxer uma expressão com contagem que fale em Proficiência — ou
 * uma sem contagem que não fale —, a premissa deixou de valer e é melhor
 * quebrar aqui do que dobrar o dano de alguém na mesa.
 */
describe('a regra da proficiência continua valendo no dataset', () => {
  it('sem contagem implica proficiência; com contagem, nunca', () => {
    const violacoes: string[] = [];

    for (const carta of srd.cartas) {
      for (const dano of extrairDanosDaCarta(carta)) {
        const semContagem = dano.quantidade === null;

        if (semContagem && !dano.citaProficiencia) {
          violacoes.push(
            `${carta.nome}: "${dano.trecho}" sem contagem, mas o parágrafo não cita Proficiência`,
          );
        }
        if (!semContagem && dano.citaProficiencia) {
          violacoes.push(
            `${carta.nome}: "${dano.trecho}" tem contagem, mas o parágrafo cita Proficiência`,
          );
        }
      }
    }

    expect(violacoes, violacoes.join('\n')).toEqual([]);
  });

  it('as proporções conhecidas do dataset se mantêm', () => {
    const todos = srd.cartas.flatMap((carta) => extrairDanosDaCarta(carta));
    const semContagem = todos.filter((d) => d.quantidade === null);
    expect(todos.length).toBeGreaterThanOrEqual(25);
    expect(semContagem.length).toBeGreaterThanOrEqual(8);
  });
});

describe('montagem da rolagem de dano', () => {
  const bolt = extrairDanosDaCarta(porNome('Bolt Beacon'))[0];
  const tyfar = extrairDanosDaCarta(porNome('Book of Tyfar'))[0];

  it('multiplica pelos dados da proficiência quando a contagem falta', () => {
    expect(bolt).toBeDefined();
    if (!bolt) return;
    expect(montarDanoDeCarta(bolt, 1, 'Bolt Beacon').expressao).toBe(
      '1d8+2[Dano: Bolt Beacon]',
    );
    expect(montarDanoDeCarta(bolt, 3, 'Bolt Beacon').expressao).toBe(
      '3d8+2[Dano: Bolt Beacon]',
    );
    expect(montarDanoDeCarta(bolt, 3, 'Bolt Beacon').usaProficiencia).toBe(true);
  });

  it('ignora a proficiência quando a carta traz a contagem', () => {
    expect(tyfar).toBeDefined();
    if (!tyfar) return;
    expect(montarDanoDeCarta(tyfar, 1, 'Book of Tyfar').expressao).toBe(
      '2d6[Dano: Book of Tyfar]',
    );
    // Proficiência 4 não muda nada: a carta manda.
    expect(montarDanoDeCarta(tyfar, 4, 'Book of Tyfar').expressao).toBe(
      '2d6[Dano: Book of Tyfar]',
    );
    expect(montarDanoDeCarta(tyfar, 4, 'Book of Tyfar').usaProficiencia).toBe(false);
  });

  it('crítico soma o máximo dos dados, como nas armas', () => {
    expect(bolt).toBeDefined();
    if (!bolt) return;
    // Proficiência 2, d8 => máximo 16, mais o bônus 2.
    expect(montarDanoDeCarta(bolt, 2, 'Bolt Beacon', { critico: true }).expressao).toBe(
      '2d8+18[Dano crítico: Bolt Beacon]',
    );
  });

  it('crítico de dano fixo também soma o máximo', () => {
    expect(tyfar).toBeDefined();
    if (!tyfar) return;
    // 2d6 => máximo 12.
    expect(montarDanoDeCarta(tyfar, 1, 'Book of Tyfar', { critico: true }).expressao).toBe(
      '2d6+12[Dano crítico: Book of Tyfar]',
    );
  });

  it('proficiência zero ou negativa não gera expressão inválida', () => {
    expect(bolt).toBeDefined();
    if (!bolt) return;
    expect(montarDanoDeCarta(bolt, 0, 'x').expressao).toBe('1d8+2[Dano: x]');
    expect(validate(montarDanoDeCarta(bolt, -5, 'x').expressao)).toBeNull();
  });

  it('toda carta com dano gera expressão que o motor aceita', () => {
    let conferidas = 0;

    for (const carta of srd.cartas) {
      for (const dano of extrairDanosDaCarta(carta)) {
        for (const proficiencia of [1, 2, 3, 4]) {
          for (const critico of [false, true]) {
            const pronto = montarDanoDeCarta(dano, proficiencia, carta.nome, { critico });
            expect(
              validate(pronto.expressao),
              `${carta.nome}: ${pronto.expressao}`,
            ).toBeNull();
            expect(() => roll(pronto.expressao, { seed: 'carta' })).not.toThrow();
            conferidas += 1;
          }
        }
      }
    }

    expect(conferidas).toBeGreaterThan(200);
  });

  it('o rótulo chega ao resultado da rolagem', () => {
    expect(tyfar).toBeDefined();
    if (!tyfar) return;
    const pronto = montarDanoDeCarta(tyfar, 1, 'Book of Tyfar');
    expect(roll(pronto.expressao, { seed: 'r' }).label).toBe('Dano: Book of Tyfar');
  });
});
