// @vitest-environment jsdom
/**
 * Apagar sem medo: toda remoção age na hora e deixa o caminho de volta.
 *
 * O que se garante aqui é o que um "desfazer" de verdade precisa — o item volta
 * *ao lugar dele*, não ao fim; o que foi editado nesse meio-tempo fica; e dois
 * cliques seguidos não levam o vizinho junto.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import { fichaEmBranco } from '@/daggerheart/ficha';
import { useAvisos } from '@/ui/avisos';
import {
  limparHistorico,
  removerArma,
  removerAtalho,
  removerEntrada,
  removerExperiencia,
  removerFicha,
  removerPersonagem,
  reinserir,
} from './remocoes';

const reset = (): void => {
  useAionStore.setState({
    history: [],
    macros: [],
    characters: [],
    activeCharacterId: null,
    fichas: [],
    fichaAtivaId: null,
    settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false },
    input: '',
    inputError: null,
    vista: 'mesa',
    phase: 'ocioso',
    pendingRequest: null,
    pendingExibicao: null,
    lastResult: null,
    lastEntryId: null,
    panel: null,
  });
  useAvisos.setState({ aviso: null });
};

const store = () => useAionStore.getState();
const aviso = () => useAvisos.getState().aviso;

/**
 * Um passo de relógio entre uma remoção e outra: sem ele, a trava contra
 * clique duplo (que existe de propósito) engoliria a segunda chamada.
 */
const proximaRemocao = (): void => {
  vi.advanceTimersByTime(1000);
};

// A trava contra clique duplo guarda a hora da última remoção entre os testes.
// Cada teste começa num relógio bem à frente do anterior, para a primeira
// remoção dele nunca cair dentro da janela da última do teste de antes.
let relogio = Date.now();

beforeEach(() => {
  vi.useFakeTimers();
  relogio += 3_600_000;
  vi.setSystemTime(relogio);
  reset();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('reinserir', () => {
  const lista = [{ id: 'a' }, { id: 'c' }];

  it('devolve o item à posição em que estava', () => {
    expect(reinserir(lista, { id: 'b' }, 1).map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });

  it('com a lista encolhida, vai para o fim em vez de falhar', () => {
    expect(reinserir(lista, { id: 'z' }, 9).map((x) => x.id)).toEqual(['a', 'c', 'z']);
  });

  it('não duplica um item que já voltou', () => {
    expect(reinserir(lista, { id: 'a' }, 0)).toHaveLength(2);
  });
});

describe('histórico', () => {
  const rolar = (n: number): void => {
    for (let i = 0; i < n; i += 1) store().rollExpression(`1d${6 + i}`);
  };

  it('uma entrada removida volta exatamente ao lugar', () => {
    rolar(3);
    const antes = store().history.map((e) => e.id);
    const meio = antes[1] as string;

    removerEntrada(meio);
    expect(store().history).toHaveLength(2);
    expect(aviso()?.texto).toMatch(/removida do histórico/);

    useAvisos.getState().desfazerUltimo();
    expect(store().history.map((e) => e.id)).toEqual(antes);
  });

  it('limpar tudo avisa quantas eram e desfazer as traz de volta', () => {
    rolar(4);
    const antes = store().history.map((e) => e.id);

    limparHistorico();
    expect(store().history).toHaveLength(0);
    expect(aviso()?.texto).toContain('4 rolagens');

    useAvisos.getState().desfazerUltimo();
    expect(store().history.map((e) => e.id)).toEqual(antes);
  });

  it('o que foi rolado depois de limpar continua por cima do que volta', () => {
    rolar(2);
    const velhas = store().history.map((e) => e.id);

    limparHistorico();
    store().rollExpression('1d20');
    const nova = store().history[0]?.id as string;

    useAvisos.getState().desfazerUltimo();
    expect(store().history.map((e) => e.id)).toEqual([nova, ...velhas]);
  });

  it('limpar um histórico vazio não avisa de nada', () => {
    limparHistorico();
    expect(aviso()).toBeNull();
  });

  it('no singular, fala no singular', () => {
    rolar(1);
    limparHistorico();
    expect(aviso()?.texto).toContain('1 rolagem.');
  });
});

describe('atalhos', () => {
  it('um atalho removido volta no mesmo lugar da ordem', () => {
    store().addMacro({ name: 'Ataque', expression: '1d20+5', glyph: '⚔️', characterId: null });
    store().addMacro({ name: 'Dano', expression: '1d8+3', glyph: '🩸', characterId: null });
    store().addMacro({ name: 'Iniciativa', expression: '1d20', glyph: '⚡', characterId: null });
    const ordem = () => [...store().macros].sort((a, b) => a.order - b.order).map((m) => m.name);
    const antes = ordem();
    const dano = store().macros.find((m) => m.name === 'Dano')?.id as string;

    removerAtalho(dano);
    expect(ordem()).toEqual(['Ataque', 'Iniciativa']);
    expect(aviso()?.texto).toBe('Atalho “Dano” removido.');

    useAvisos.getState().desfazerUltimo();
    expect(ordem()).toEqual(antes);
  });
});

describe('personagens', () => {
  const montar = () => {
    store().addCharacter('Aldric', 'ambar');
    store().addCharacter('Beatrix', 'rubi');
    store().addCharacter('Cael', 'safira');
    const [aldric, beatrix, cael] = store().characters;
    store().setActiveCharacter(beatrix?.id ?? null);
    store().addMacro({
      name: 'Golpe',
      expression: '1d20',
      glyph: '⚔️',
      characterId: beatrix?.id ?? null,
    });
    return { aldric, beatrix, cael };
  };

  it('os atalhos dela passam à mesa — e voltam a ser dela no desfazer', () => {
    const { beatrix } = montar();
    const golpe = store().macros[0]?.id as string;

    removerPersonagem(beatrix?.id as string);
    expect(store().macros.find((m) => m.id === golpe)?.characterId).toBeNull();
    expect(store().activeCharacterId).not.toBe(beatrix?.id);

    useAvisos.getState().desfazerUltimo();
    expect(store().macros.find((m) => m.id === golpe)?.characterId).toBe(beatrix?.id);
    expect(store().activeCharacterId).toBe(beatrix?.id);
  });

  it('volta à mesma posição na lista', () => {
    const { aldric, beatrix, cael } = montar();

    removerPersonagem(beatrix?.id as string);
    expect(store().characters.map((c) => c.id)).toEqual([aldric?.id, cael?.id]);

    useAvisos.getState().desfazerUltimo();
    expect(store().characters.map((c) => c.id)).toEqual([aldric?.id, beatrix?.id, cael?.id]);
  });

  it('se o atalho já foi dado a outro personagem, essa escolha vale mais', () => {
    const { aldric, beatrix } = montar();
    const golpe = store().macros[0]?.id as string;

    removerPersonagem(beatrix?.id as string);
    store().updateMacro(golpe, { characterId: aldric?.id ?? null });

    useAvisos.getState().desfazerUltimo();
    expect(store().macros.find((m) => m.id === golpe)?.characterId).toBe(aldric?.id);
  });

  it('quem não era o ativo não rouba o lugar de quem era', () => {
    const { aldric, beatrix } = montar();

    removerPersonagem(aldric?.id as string);
    useAvisos.getState().desfazerUltimo();

    expect(store().activeCharacterId).toBe(beatrix?.id);
  });
});

describe('fichas', () => {
  it('a ficha removida volta ao lugar e, se era a aberta, reabre', () => {
    store().adicionarFicha('Aldric');
    store().adicionarFicha('Beatrix');
    store().adicionarFicha('Cael');
    const [a, b, c] = store().fichas;
    store().definirFichaAtiva(b?.id ?? null);

    removerFicha(b?.id as string);
    expect(store().fichas.map((f) => f.id)).toEqual([a?.id, c?.id]);
    expect(aviso()?.texto).toBe('Ficha de Beatrix removida.');

    useAvisos.getState().desfazerUltimo();
    expect(store().fichas.map((f) => f.id)).toEqual([a?.id, b?.id, c?.id]);
    expect(store().fichaAtivaId).toBe(b?.id);
  });

  const comItens = () => {
    const ficha = {
      ...fichaEmBranco('fic_x', 'Aldric'),
      experiencias: [
        { id: 'e1', nome: 'Guarda', bonus: 2 },
        { id: 'e2', nome: 'Ler intenções', bonus: 2 },
        { id: 'e3', nome: 'Caçar', bonus: 2 },
      ],
      armas: [
        {
          id: 'w1',
          nome: 'Espada',
          atributo: 'forca' as const,
          dado: 'd8' as const,
          bonus: 1,
          tipo: 'fisico' as const,
          alcance: 'Corpo a corpo',
        },
        {
          id: 'w2',
          nome: 'Arco',
          atributo: 'agilidade' as const,
          dado: 'd6' as const,
          bonus: 0,
          tipo: 'fisico' as const,
          alcance: 'Longe',
        },
      ],
    };
    useAionStore.setState({ fichas: [ficha], fichaAtivaId: ficha.id });
    return ficha;
  };

  const ficha = () => store().fichas[0];

  it('uma experiência removida volta ao lugar', () => {
    comItens();
    removerExperiencia('fic_x', 'e2');
    expect(ficha()?.experiencias.map((e) => e.id)).toEqual(['e1', 'e3']);

    useAvisos.getState().desfazerUltimo();
    expect(ficha()?.experiencias.map((e) => e.id)).toEqual(['e1', 'e2', 'e3']);
  });

  it('desfazer não desfaz o que foi editado enquanto isso', () => {
    comItens();
    removerExperiencia('fic_x', 'e2');

    // A pessoa continua trabalhando na ficha antes de decidir desfazer.
    store().atualizarFicha('fic_x', {
      experiencias: (ficha()?.experiencias ?? []).map((e) =>
        e.id === 'e3' ? { ...e, bonus: 5 } : e,
      ),
    });

    useAvisos.getState().desfazerUltimo();
    const e3 = ficha()?.experiencias.find((e) => e.id === 'e3');
    expect(e3?.bonus).toBe(5);
    expect(ficha()?.experiencias.map((e) => e.id)).toEqual(['e1', 'e2', 'e3']);
  });

  it('uma arma removida volta ao lugar', () => {
    comItens();
    removerArma('fic_x', 'w1');
    expect(ficha()?.armas.map((w) => w.id)).toEqual(['w2']);

    useAvisos.getState().desfazerUltimo();
    expect(ficha()?.armas.map((w) => w.id)).toEqual(['w1', 'w2']);
  });

  it('desfazer depois de a ficha inteira ter sido removida não quebra nada', () => {
    comItens();
    store().adicionarFicha('Outra');
    removerArma('fic_x', 'w1');
    proximaRemocao();
    removerFicha('fic_x');

    // O aviso atual é o da ficha; o da arma já foi substituído.
    expect(() => useAvisos.getState().desfazerUltimo()).not.toThrow();
  });
});

describe('dois cliques seguidos não removem duas coisas', () => {
  it('o segundo, dentro da janela, é ignorado', () => {
    store().rollExpression('1d6');
    store().rollExpression('1d8');
    store().rollExpression('1d10');
    const [a, b] = store().history;

    removerEntrada(a?.id as string);
    removerEntrada(b?.id as string);

    expect(store().history).toHaveLength(2);
  });

  it('uma remoção de propósito, logo depois de olhar a lista, passa', () => {
    store().rollExpression('1d6');
    store().rollExpression('1d8');
    const [a, b] = store().history;

    removerEntrada(a?.id as string);
    proximaRemocao();
    removerEntrada(b?.id as string);

    expect(store().history).toHaveLength(0);
  });
});
