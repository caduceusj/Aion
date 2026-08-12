import { describe, expect, it } from 'vitest';
import {
  DOMINIOS,
  TIPOS_DE_CARTA,
  atributoDoSrd,
  carregarSrd,
  cartasDisponiveis,
  dominiosDoPersonagem,
  subclassesDaClasse,
  __interno,
  type DominioId,
} from './index';
import { AVISO_DPCGL } from './licenca';
import { TRAITS } from '../regras';

const srd = await carregarSrd();

/**
 * Estes testes rodam contra os arquivos vendorizados de verdade. Se uma
 * atualização do dataset mudar o formato — nomes virando objeto, campos
 * sumindo, domínio novo — eles quebram aqui, e não na mesa de alguém.
 */
describe('integridade dos dados vendorizados', () => {
  it('traz as 18 ancestralidades', () => {
    expect(srd.ancestralidades).toHaveLength(18);
    expect(srd.ancestralidades.map((a) => a.nome)).toContain('Clank');
    expect(srd.ancestralidades.map((a) => a.nome)).toContain('Firbolg');
  });

  it('traz as 9 comunidades', () => {
    expect(srd.comunidades).toHaveLength(9);
    expect(srd.comunidades.map((c) => c.nome)).toContain('Highborne');
  });

  it('traz as 9 classes', () => {
    expect(srd.classes).toHaveLength(9);
    expect(srd.classes.map((c) => c.nome).sort()).toEqual([
      'Bard',
      'Druid',
      'Guardian',
      'Ranger',
      'Rogue',
      'Seraph',
      'Sorcerer',
      'Warrior',
      'Wizard',
    ]);
  });

  it('traz 18 subclasses, duas por classe', () => {
    expect(srd.subclasses).toHaveLength(18);
    for (const classe of srd.classes) {
      expect(subclassesDaClasse(srd, classe.id), `subclasses de ${classe.nome}`).toHaveLength(2);
    }
  });

  it('traz 189 cartas, 21 por domínio', () => {
    expect(srd.cartas).toHaveLength(189);
    for (const dominio of Object.keys(DOMINIOS) as DominioId[]) {
      expect(
        srd.cartas.filter((carta) => carta.dominio === dominio),
        `cartas de ${dominio}`,
      ).toHaveLength(21);
    }
  });

  it('toda classe tem PV e Evasão iniciais plausíveis', () => {
    for (const classe of srd.classes) {
      expect(classe.pontosDeVidaIniciais, classe.nome).toBeGreaterThanOrEqual(4);
      expect(classe.pontosDeVidaIniciais, classe.nome).toBeLessThanOrEqual(12);
      expect(classe.evasaoInicial, classe.nome).toBeGreaterThanOrEqual(6);
      expect(classe.evasaoInicial, classe.nome).toBeLessThanOrEqual(16);
      expect(classe.dominios, classe.nome).toHaveLength(2);
    }
  });

  it('toda carta tem nível de 1 a 10 e custo de lembrança', () => {
    for (const carta of srd.cartas) {
      expect(carta.nivel, carta.nome).toBeGreaterThanOrEqual(1);
      expect(carta.nivel, carta.nome).toBeLessThanOrEqual(10);
      expect(carta.custoDeLembranca, carta.nome).toBeGreaterThanOrEqual(0);
      expect(carta.tipo in TIPOS_DE_CARTA, `tipo de ${carta.nome}`).toBe(true);
    }
  });

  it('nenhum item fica sem nome', () => {
    const tudo = [
      ...srd.ancestralidades,
      ...srd.comunidades,
      ...srd.classes,
      ...srd.subclasses,
      ...srd.cartas,
    ];
    for (const item of tudo) {
      expect(item.nome.length, `id ${item.id}`).toBeGreaterThan(0);
    }
  });

  it('nenhum texto localizado vazou como objeto', () => {
    // O erro clássico ao consumir este dataset é renderizar "[object Object]"
    // por esquecer que os nomes vêm envelopados.
    const serializado = JSON.stringify(srd);
    expect(serializado).not.toContain('[object Object]');
    expect(serializado).not.toContain('"en-US"');
  });
});

describe('inconsistências do dataset', () => {
  it('nome de classe em caixa alta vira apresentável', () => {
    expect(__interno.nomeApresentavel('BARD')).toBe('Bard');
    expect(__interno.nomeApresentavel('SORCERER')).toBe('Sorcerer');
  });

  it('nome já capitalizado não é estragado', () => {
    // "Beastbound" viraria "Beastbound"; mas um nome com maiúscula interna
    // precisa sobreviver intacto.
    expect(__interno.nomeApresentavel({ 'en-US': 'Beastbound' })).toBe('Beastbound');
    expect(__interno.nomeApresentavel({ 'en-US': 'School of Knowledge' })).toBe(
      'School of Knowledge',
    );
  });

  it('lê tanto string plana quanto objeto localizado', () => {
    expect(__interno.texto('Bard')).toBe('Bard');
    expect(__interno.texto({ 'en-US': 'Bard' })).toBe('Bard');
    expect(__interno.texto(undefined)).toBe('');
    expect(__interno.texto(null)).toBe('');
    expect(__interno.texto(42)).toBe('');
  });

  it('a subclasse encontra a classe dona pelo nome em caixa alta', () => {
    expect(__interno.idDeClasse('RANGER')).toBe('core_class_ranger');
    const beastbound = srd.subclasses.find((s) => s.nome === 'Beastbound');
    expect(beastbound?.classeId).toBe('core_class_ranger');
    expect(srd.classes.some((c) => c.id === beastbound?.classeId)).toBe(true);
  });

  it('toda subclasse aponta para uma classe que existe', () => {
    const ids = new Set(srd.classes.map((c) => c.id));
    for (const subclasse of srd.subclasses) {
      expect(ids.has(subclasse.classeId), `${subclasse.nome} -> ${subclasse.classeId}`).toBe(true);
    }
  });

  it('descarta bloco desconhecido em vez de quebrar', () => {
    expect(__interno.blocos([{ tabela: { 'en-US': 'x' } }])).toEqual([]);
    expect(__interno.blocos(undefined)).toEqual([]);
    expect(__interno.blocos([])).toEqual([]);
  });

  it('normaliza parágrafos e listas', () => {
    expect(
      __interno.blocos([
        { paragraph: { 'en-US': 'Um texto.' } },
        { list: [{ 'en-US': 'a' }, { 'en-US': 'b' }] },
      ]),
    ).toEqual([
      { tipo: 'paragrafo', texto: 'Um texto.' },
      { tipo: 'lista', itens: ['a', 'b'] },
    ]);
  });

  it('ignora domínio desconhecido', () => {
    expect(__interno.dominios(['BLADE', 'INVENTADO'])).toEqual(['BLADE']);
    expect(__interno.dominios(undefined)).toEqual([]);
  });
});

describe('ponte entre o vocabulário do SRD e o do Aion', () => {
  it('todo atributo de conjuração vira um atributo da ficha', () => {
    const validos = new Set(TRAITS.map((t) => t.id));
    for (const subclasse of srd.subclasses) {
      if (subclasse.atributoDeConjuracao === null) continue;
      expect(
        validos.has(subclasse.atributoDeConjuracao),
        `${subclasse.nome}: ${subclasse.atributoDeConjuracao}`,
      ).toBe(true);
    }
  });

  it('os seis nomes do SRD estão mapeados', () => {
    expect(atributoDoSrd('AGILITY')).toBe('agilidade');
    expect(atributoDoSrd('STRENGTH')).toBe('forca');
    expect(atributoDoSrd('FINESSE')).toBe('precisao');
    expect(atributoDoSrd('INSTINCT')).toBe('instinto');
    expect(atributoDoSrd('PRESENCE')).toBe('presenca');
    expect(atributoDoSrd('KNOWLEDGE')).toBe('saber');
  });

  it('nome desconhecido não vira atributo inventado', () => {
    expect(atributoDoSrd('CHARISMA')).toBeNull();
    expect(atributoDoSrd(undefined)).toBeNull();
  });

  it('todo domínio citado tem nome e cor na interface', () => {
    const citados = new Set<string>();
    srd.classes.forEach((c) => c.dominios.forEach((d) => citados.add(d)));
    srd.subclasses.forEach((s) => s.dominios.forEach((d) => citados.add(d)));
    srd.cartas.forEach((c) => citados.add(c.dominio));

    for (const dominio of citados) {
      expect(DOMINIOS[dominio as DominioId]?.nome, dominio).toBeTruthy();
      expect(DOMINIOS[dominio as DominioId]?.cor, dominio).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe('consultas da ficha', () => {
  const bardo = srd.classes.find((c) => c.nome === 'Bard');
  const subclasseDoBardo = subclassesDaClasse(srd, bardo?.id ?? null)[0];

  it('os domínios do personagem juntam classe e subclasse', () => {
    const dominios = dominiosDoPersonagem(srd, bardo?.id ?? null, subclasseDoBardo?.id ?? null);
    expect(dominios).toContain('GRACE');
    expect(dominios).toContain('CODEX');
    // Sem repetição, mesmo quando a subclasse repete os domínios da classe.
    expect(new Set(dominios).size).toBe(dominios.length);
  });

  it('sem classe, não há domínio', () => {
    expect(dominiosDoPersonagem(srd, null, null)).toEqual([]);
    expect(subclassesDaClasse(srd, null)).toEqual([]);
  });

  it('as cartas disponíveis respeitam domínio e nível', () => {
    const cartas = cartasDisponiveis(srd, ['GRACE', 'CODEX'], 3);
    expect(cartas.length).toBeGreaterThan(0);
    for (const carta of cartas) {
      expect(['GRACE', 'CODEX']).toContain(carta.dominio);
      expect(carta.nivel).toBeLessThanOrEqual(3);
    }
    // Ordenadas por nível, para o jogador achar o que acabou de destravar.
    const niveis = cartas.map((c) => c.nivel);
    expect([...niveis].sort((a, b) => a - b)).toEqual(niveis);
  });

  it('nível 1 traz só cartas de nível 1', () => {
    const cartas = cartasDisponiveis(srd, ['BLADE'], 1);
    expect(cartas.length).toBeGreaterThan(0);
    expect(cartas.every((c) => c.nivel === 1)).toBe(true);
  });

  it('sem domínio, nenhuma carta', () => {
    expect(cartasDisponiveis(srd, [], 10)).toEqual([]);
  });
});

describe('licença', () => {
  it('o aviso da DPCGL cita a fonte e o detentor', () => {
    expect(AVISO_DPCGL).toContain('Daggerheart System Reference Document');
    expect(AVISO_DPCGL).toContain('Critical Role, LLC');
    expect(AVISO_DPCGL).toContain('Darrington Press Community Gaming License');
  });
});
