/**
 * A integridade do Códice.
 *
 * Um wiki morre por link quebrado. Como a prosa é escrita à mão e as chaves
 * são strings, nada além de um teste impede que um `[[casa-herys]]` com um
 * erro de digitação vire texto morto no meio de um parágrafo. Este arquivo é
 * esse impedimento — e roda no mesmo `npm test` que barra o deploy.
 */

import { describe, expect, it } from 'vitest';
import { CATEGORIAS, type Verbete } from './tipos';
import { VERBETES, buscar, porCategoria, referenciam, tituloAmbiguo, verbete } from './corpus';
import { semMarcacao } from './prosa';
import { PONTOS_DO_MAPA } from './valoran/cartografia';

const CHAVES = new Set(VERBETES.map((v) => v.chave));

/** Todo [[alvo]] de um verbete, com o parágrafo em que apareceu. */
function elos(entrada: Verbete): Array<{ chave: string; onde: string }> {
  const saida: Array<{ chave: string; onde: string }> = [];
  for (const secao of entrada.secoes) {
    for (const paragrafo of secao.paragrafos) {
      for (const casamento of paragrafo.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
        saida.push({ chave: (casamento[1] ?? '').trim(), onde: paragrafo.slice(0, 70) });
      }
    }
  }
  return saida;
}

describe('o corpus está inteiro', () => {
  it('tem verbetes em todas as gavetas', () => {
    for (const categoria of CATEGORIAS) {
      expect(porCategoria(categoria.id).length, `gaveta vazia: ${categoria.rotulo}`).toBeGreaterThan(0);
    }
  });

  it('nenhuma chave se repete', () => {
    const vistas = new Set<string>();
    const repetidas: string[] = [];
    for (const entrada of VERBETES) {
      if (vistas.has(entrada.chave)) repetidas.push(entrada.chave);
      vistas.add(entrada.chave);
    }
    expect(repetidas).toEqual([]);
  });

  it('as chaves são endereços estáveis, em minúsculas e sem espaço', () => {
    const tortas = VERBETES.map((v) => v.chave).filter((c) => !/^[a-z0-9-]+$/.test(c));
    expect(tortas).toEqual([]);
  });

  it('todo verbete tem título, resumo, ficha e ao menos uma seção com texto', () => {
    for (const entrada of VERBETES) {
      expect(entrada.titulo.trim().length, entrada.chave).toBeGreaterThan(0);
      expect(entrada.resumo.trim().length, entrada.chave).toBeGreaterThan(0);
      expect(entrada.ficha.length, `ficha vazia: ${entrada.chave}`).toBeGreaterThan(0);
      expect(entrada.secoes.length, `sem seções: ${entrada.chave}`).toBeGreaterThan(0);
      for (const secao of entrada.secoes) {
        expect(secao.paragrafos.length, `seção vazia em ${entrada.chave}`).toBeGreaterThan(0);
        for (const paragrafo of secao.paragrafos) {
          expect(paragrafo.trim().length, `parágrafo vazio em ${entrada.chave}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('o resumo é UMA frase limpa — sem marcação, para caber no índice', () => {
    for (const entrada of VERBETES) {
      expect(entrada.resumo, entrada.chave).not.toMatch(/\[\[/);
      expect(entrada.resumo.length, `resumo longo demais: ${entrada.chave}`).toBeLessThanOrEqual(190);
      // Duas frases num resumo estouram o cartão e a prévia do link. O
      // ponto final só vale no fim; abreviações com ponto não aparecem aqui.
      const pontos = entrada.resumo.replace(/[.!?]+$/, '').match(/[.!?](\s|$)/g) ?? [];
      expect(pontos.length, `resumo com mais de uma frase: ${entrada.chave}`).toBe(0);
    }
  });
});

describe('nenhum link do códice cai no vazio', () => {
  it('todo [[alvo]] da prosa existe', () => {
    const quebrados: string[] = [];
    for (const entrada of VERBETES) {
      for (const elo of elos(entrada)) {
        if (!CHAVES.has(elo.chave)) {
          quebrados.push(`${entrada.chave} → [[${elo.chave}]] em "${elo.onde}…"`);
        }
      }
    }
    expect(quebrados).toEqual([]);
  });

  it('todo relacionado existe e não aponta para o próprio verbete', () => {
    const problemas: string[] = [];
    for (const entrada of VERBETES) {
      for (const chave of entrada.relacionados) {
        if (!CHAVES.has(chave)) problemas.push(`${entrada.chave} → ${chave} (inexistente)`);
        if (chave === entrada.chave) problemas.push(`${entrada.chave} → si mesmo`);
      }
    }
    expect(problemas).toEqual([]);
  });

  it('as eras declaradas são eras de verdade', () => {
    const eras = new Set(porCategoria('era').map((v) => v.chave));
    const problemas: string[] = [];
    for (const entrada of VERBETES) {
      for (const chave of entrada.eras) {
        if (!eras.has(chave)) problemas.push(`${entrada.chave} → era "${chave}"`);
      }
    }
    expect(problemas).toEqual([]);
  });

  it('todo ponto do mapa abre um verbete', () => {
    const orfaos = PONTOS_DO_MAPA.filter((p) => !CHAVES.has(p.chave)).map((p) => p.rotulo);
    expect(orfaos).toEqual([]);
  });

  it('os pontos do mapa ficam dentro da prancha', () => {
    for (const ponto of PONTOS_DO_MAPA) {
      expect(ponto.x, ponto.rotulo).toBeGreaterThan(0);
      expect(ponto.x, ponto.rotulo).toBeLessThan(1);
      expect(ponto.y, ponto.rotulo).toBeGreaterThan(0);
      expect(ponto.y, ponto.rotulo).toBeLessThan(1);
    }
  });
});

describe('o códice é navegável', () => {
  it('nenhum verbete é um beco sem saída', () => {
    // Sem link de saída nem relacionados, o leitor chega e não tem para onde
    // ir — que é o oposto do que um wiki serve para fazer.
    const becos = VERBETES.filter(
      (v) => v.relacionados.length === 0 && elos(v).length === 0,
    ).map((v) => v.chave);
    expect(becos).toEqual([]);
  });

  it('nenhum verbete é ilha: alguém aponta para cada um', () => {
    const ilhas = VERBETES.filter((v) => referenciam(v.chave).length === 0).map((v) => v.chave);
    expect(ilhas).toEqual([]);
  });

  it('as cinco eras estão em ordem e trazem seu período', () => {
    const eras = porCategoria('era');
    expect(eras).toHaveLength(5);
    eras.forEach((era, indice) => {
      expect(era.ordem, era.chave).toBe(indice + 1);
      expect(era.periodo?.length ?? 0, era.chave).toBeGreaterThan(0);
    });
  });
});

describe('a busca acha o que a mesa procura', () => {
  it('o nome exato traz o verbete no topo', () => {
    // "no topo" e não "em primeiro": há homônimos legítimos — Firen é a
    // lâmina e o reino — e escolher um deles seria arbitrário.
    for (const entrada of VERBETES) {
      const chaves = buscar(entrada.titulo, 4).map((a) => a.verbete.chave);
      expect(chaves, `busca por "${entrada.titulo}"`).toContain(entrada.chave);
    }
  });

  it('homônimos são marcados para o índice poder desempatar', () => {
    const titulos = VERBETES.map((v) => v.titulo);
    for (const titulo of titulos) {
      const quantos = titulos.filter((t) => t === titulo).length;
      expect(tituloAmbiguo(titulo), `"${titulo}" aparece ${quantos}x`).toBe(quantos > 1);
    }
  });

  it('acha sem acento e sem caixa', () => {
    expect(buscar('hoseki').length).toBeGreaterThan(0);
    expect(buscar('HŌSEKI').length).toBeGreaterThan(0);
    expect(buscar('KEATON')[0]?.verbete.chave).toBe('casa-keaton');
  });

  it('campo vazio não devolve o acervo inteiro', () => {
    expect(buscar('')).toEqual([]);
    expect(buscar('   ')).toEqual([]);
  });

  it('não inventa resultado para o que não existe', () => {
    expect(buscar('zzzzznaoexiste')).toEqual([]);
  });
});

describe('a prosa se resolve', () => {
  it('semMarcacao não deixa marcação para trás', () => {
    for (const entrada of VERBETES) {
      for (const secao of entrada.secoes) {
        for (const paragrafo of secao.paragrafos) {
          const limpo = semMarcacao(paragrafo);
          expect(limpo, entrada.chave).not.toMatch(/\[\[|\]\]/);
        }
      }
    }
  });

  it('[[chave|texto]] mantém o texto escolhido', () => {
    expect(semMarcacao('o [[casa-herys|erro]] some')).toBe('o erro some');
  });

  it('[[chave]] vira o título do verbete', () => {
    const alvo = VERBETES[0];
    expect(alvo).toBeDefined();
    if (!alvo) return;
    expect(semMarcacao(`ver [[${alvo.chave}]]`)).toBe(`ver ${alvo.titulo}`);
  });

  it('verbete() só devolve o que existe', () => {
    expect(verbete('nao-existe')).toBeUndefined();
    expect(verbete('casa-keaton')?.titulo).toBe('House Keaton');
  });
});
