// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { useAionStore } from './store';
import { DEFAULT_PERSISTED, loadState, saveState } from './persistence';
import { DEFAULT_SETTINGS } from './seed';

/**
 * A física fica desligada por padrão nos testes.
 *
 * Não é conveniência: sem WebGL não existe mesa, e com a mesa ligada uma
 * rolagem fica pendurada esperando faces que nunca chegam. Os testes do
 * caminho com mesa ligam a física explicitamente e entregam as faces na mão.
 */
const reset = (): void => {
  useAionStore.setState({
    history: [],
    macros: [],
    characters: [],
    activeCharacterId: null,
    settings: { ...DEFAULT_SETTINGS, physics3d: false },
    input: '',
    inputError: null,
    vista: 'menu',
    phase: 'ocioso',
    pendingRequest: null,
    pendingExibicao: null,
    lastResult: null,
    lastEntryId: null,
    panel: null,
  });
};

beforeEach(reset);

describe('ciclo de rolagem', () => {
  it('uma expressão válida vira entrada de histórico', () => {
    useAionStore.getState().rollExpression('1d20+5');
    const state = useAionStore.getState();

    expect(state.history).toHaveLength(1);
    expect(state.inputError).toBeNull();
    expect(state.lastResult).not.toBeNull();
    expect(state.phase).toBe('revelado');
    expect(state.lastEntryId).toBe(state.history[0]?.id);
  });

  it('uma expressão inválida vira erro e não mexe no histórico', () => {
    useAionStore.getState().rollExpression('4d6xyz');
    const state = useAionStore.getState();

    expect(state.history).toHaveLength(0);
    expect(state.inputError).not.toBeNull();
    expect(state.pendingRequest).toBeNull();
    expect(state.phase).toBe('ocioso');
  });

  it('divisão por zero é tratada sem derrubar o app', () => {
    expect(() => useAionStore.getState().rollExpression('1d6/0')).not.toThrow();
    expect(useAionStore.getState().history).toHaveLength(0);
    expect(useAionStore.getState().inputError?.message).toContain('zero');
  });

  it('sem física o resultado já nasce revelado', () => {
    useAionStore.getState().rollExpression('2d6');
    const state = useAionStore.getState();

    expect(state.phase).toBe('revelado');
    expect(state.pendingRequest).toBeNull();
    expect(state.history).toHaveLength(1);
  });

  it('movimento reduzido também pula a física', () => {
    useAionStore.getState().updateSettings({ physics3d: true, reducedMotion: true });
    useAionStore.getState().rollExpression('2d6');
    expect(useAionStore.getState().pendingRequest).toBeNull();
    expect(useAionStore.getState().phase).toBe('revelado');
  });
});

describe('a mesa decide o resultado', () => {
  const comMesa = (): void => {
    useAionStore.getState().updateSettings({ physics3d: true, reducedMotion: false });
  };

  it('enquanto os dados rolam não existe resultado nenhum', () => {
    comMesa();
    useAionStore.getState().rollExpression('2d6');
    const state = useAionStore.getState();

    expect(state.phase).toBe('lancando');
    expect(state.pendingRequest).not.toBeNull();
    expect(state.pendingRequest?.dados).toHaveLength(2);
    // Nada foi decidido: o histórico só recebe a entrada quando os dados param.
    expect(state.history).toHaveLength(0);
    expect(state.lastResult).toBeNull();
  });

  it('o total é a soma das faces lidas, sem exceção', () => {
    comMesa();
    useAionStore.getState().rollExpression('3d6+2');

    const pedido = useAionStore.getState().pendingRequest;
    expect(pedido?.dados).toHaveLength(3);
    useAionStore.getState().concluirArremesso(pedido?.id ?? '', [4, 1, 6]);

    const result = useAionStore.getState().lastResult;
    expect(result?.dice.map((die) => die.face)).toEqual([4, 1, 6]);
    expect(result?.total).toBe(13);
    expect(result?.dice.every((die) => die.fisico)).toBe(true);
  });

  it('a face lida é a que fica no dado — nada é reescrito depois', () => {
    comMesa();
    useAionStore.getState().rollExpression('1d20');

    const pedido = useAionStore.getState().pendingRequest;
    useAionStore.getState().concluirArremesso(pedido?.id ?? '', [20]);

    const result = useAionStore.getState().lastResult;
    expect(result?.dice[0]?.face).toBe(20);
    expect(result?.dice[0]?.value).toBe(20);
    expect(result?.total).toBe(20);
    expect(result?.critical).toBe('max');
  });

  it('a dualidade lê Esperança e Medo na ordem em que foram arremessados', () => {
    comMesa();
    useAionStore.getState().rollExpression('dd+2');

    const pedido = useAionStore.getState().pendingRequest;
    expect(pedido?.dados.map((dado) => dado.role)).toEqual(['esperanca', 'medo']);

    useAionStore.getState().concluirArremesso(pedido?.id ?? '', [9, 3]);

    const result = useAionStore.getState().lastResult;
    expect(result?.duality).toEqual({ hope: 9, fear: 3, outcome: 'esperanca' });
    expect(result?.total).toBe(14);
  });

  it('um percentil são dois dados na mesa: dezenas e unidades', () => {
    comMesa();
    useAionStore.getState().rollExpression('1d%');

    const pedido = useAionStore.getState().pendingRequest;
    expect(pedido?.dados.map((dado) => dado.papel)).toEqual(['dezena', 'unidade']);

    // 70 nas dezenas + 4 nas unidades = 74.
    useAionStore.getState().concluirArremesso(pedido?.id ?? '', [70, 4]);
    expect(useAionStore.getState().lastResult?.total).toBe(74);

    useAionStore.getState().rollExpression('1d%');
    const segundo = useAionStore.getState().pendingRequest;
    // 00 com 10 nas unidades é o 100, como manda a convenção.
    useAionStore.getState().concluirArremesso(segundo?.id ?? '', [0, 10]);
    expect(useAionStore.getState().lastResult?.total).toBe(100);
  });

  it('descarte aponta para os dados certos na mesa', () => {
    comMesa();
    useAionStore.getState().rollExpression('4d6kh3');

    const pedido = useAionStore.getState().pendingRequest;
    useAionStore.getState().concluirArremesso(pedido?.id ?? '', [5, 2, 6, 4]);

    expect(useAionStore.getState().lastResult?.total).toBe(15);
    // O 2 é o segundo dado arremessado.
    expect(useAionStore.getState().indicesDescartados(pedido?.id ?? '')).toEqual([1]);
  });

  it('faces que a mesa não entregou caem no gerador e ficam marcadas', () => {
    comMesa();
    useAionStore.getState().rollExpression('2d6');

    const pedido = useAionStore.getState().pendingRequest;
    // Mesa que devolveu menos faces que o pedido (aba em segundo plano, WebGL
    // ausente): a rolagem não pode simplesmente sumir.
    useAionStore.getState().concluirArremesso(pedido?.id ?? '', [6]);

    const dice = useAionStore.getState().lastResult?.dice ?? [];
    expect(dice).toHaveLength(2);
    expect(dice[0]?.face).toBe(6);
    expect(dice[0]?.fisico).toBe(true);
    expect(dice[1]?.fisico).toBe(false);
  });

  it('um arremesso substituído no meio do caminho é ignorado', () => {
    comMesa();
    useAionStore.getState().rollExpression('1d20');
    const antigo = useAionStore.getState().pendingRequest?.id ?? '';

    useAionStore.getState().rollExpression('1d20');
    useAionStore.getState().concluirArremesso(antigo, [20]);

    expect(useAionStore.getState().history).toHaveLength(0);
    expect(useAionStore.getState().phase).toBe('lancando');
  });

  it('cada rolagem recebe um id de requisição próprio', () => {
    comMesa();
    useAionStore.getState().rollExpression('1d20');
    const first = useAionStore.getState().pendingRequest?.id;
    useAionStore.getState().rollExpression('1d20');
    const second = useAionStore.getState().pendingRequest?.id;

    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(second).not.toBe(first);
  });

  it('expressão sem dado algum não vai para a mesa', () => {
    comMesa();
    useAionStore.getState().rollExpression('12+3');

    expect(useAionStore.getState().pendingRequest).toBeNull();
    expect(useAionStore.getState().lastResult?.total).toBe(15);
  });

  it('onStageSettled fecha o ciclo da exibição', () => {
    useAionStore.getState().onStageSettled();
    const state = useAionStore.getState();

    expect(state.phase).toBe('revelado');
    expect(state.pendingRequest).toBeNull();
    expect(state.pendingExibicao).toBeNull();
  });
});

describe('as três vistas', () => {
  it('o app abre no menu', () => {
    expect(useAionStore.getState().vista).toBe('menu');
  });

  it('o Códice devolve quem veio da mesa para a mesa', () => {
    useAionStore.getState().irPara('mesa');
    useAionStore.getState().irPara('codice');
    expect(useAionStore.getState().vista).toBe('codice');

    useAionStore.getState().sairDoCodice();
    expect(useAionStore.getState().vista).toBe('mesa');
  });

  it('o Códice devolve quem veio do menu para o menu', () => {
    // É o caso de quem chega por um link `#codice/...`: nunca esteve na
    // mesa, e jogá-lo nela ao fechar seria uma surpresa.
    useAionStore.getState().irPara('codice');
    useAionStore.getState().sairDoCodice();
    expect(useAionStore.getState().vista).toBe('menu');
  });

  it('sair da mesa fecha o painel aberto', () => {
    useAionStore.getState().irPara('mesa');
    useAionStore.getState().setPanel('ficha');
    useAionStore.getState().irPara('codice');

    expect(useAionStore.getState().panel).toBeNull();
  });

  it('voltar para a mesa não mexe no painel', () => {
    useAionStore.getState().irPara('mesa');
    useAionStore.getState().setPanel('historico');
    useAionStore.getState().irPara('mesa');

    expect(useAionStore.getState().panel).toBe('historico');
  });

  it('ir para a vista em que já se está não faz nada', () => {
    useAionStore.getState().irPara('mesa');
    useAionStore.getState().irPara('codice');
    // Repetir 'codice' não pode fazer o códice virar a sua própria origem,
    // senão fechar deixaria o leitor preso nele.
    useAionStore.getState().irPara('codice');
    useAionStore.getState().sairDoCodice();

    expect(useAionStore.getState().vista).toBe('mesa');
  });
});

describe('entrada do campo', () => {
  it('valida ao digitar sem bloquear', () => {
    useAionStore.getState().setInput('4d6kh');
    expect(useAionStore.getState().input).toBe('4d6kh');
    expect(useAionStore.getState().inputError).toBeNull();

    useAionStore.getState().setInput('4d6kh$');
    expect(useAionStore.getState().inputError).not.toBeNull();
  });

  it('campo vazio não é erro', () => {
    useAionStore.getState().setInput('   ');
    expect(useAionStore.getState().inputError).toBeNull();
  });

  it('rollFromInput ignora campo vazio', () => {
    useAionStore.getState().setInput('  ');
    useAionStore.getState().rollFromInput();
    expect(useAionStore.getState().history).toHaveLength(0);
  });
});

describe('dados rápidos', () => {
  it('monta a notação de cada poliedro', () => {
    useAionStore.getState().rollQuick('d20');
    expect(useAionStore.getState().history[0]?.result.expression).toBe('1d20');

    useAionStore.getState().rollQuick('d6', 3);
    expect(useAionStore.getState().history[0]?.result.expression).toBe('3d6');

    useAionStore.getState().rollQuick('d100');
    expect(useAionStore.getState().history[0]?.result.expression).toBe('1d%');

    useAionStore.getState().rollQuick('dF', 4);
    expect(useAionStore.getState().history[0]?.result.expression).toBe('4df');
  });

  it('soma um modificador solto do campo', () => {
    useAionStore.getState().setInput('+3');
    useAionStore.getState().rollQuick('d20');
    expect(useAionStore.getState().history[0]?.result.expression).toBe('1d20+3');
  });

  it('não confunde uma expressão inteira com modificador', () => {
    useAionStore.getState().setInput('2d6');
    useAionStore.getState().rollQuick('d20');
    expect(useAionStore.getState().history[0]?.result.expression).toBe('1d20');
  });

  it('vantagem e desvantagem montam o 2d20 correto', () => {
    useAionStore.getState().rollAdvantage('vantagem');
    expect(useAionStore.getState().history[0]?.result.expression).toBe('2d20kh1');

    useAionStore.getState().rollAdvantage('desvantagem');
    expect(useAionStore.getState().history[0]?.result.expression).toBe('2d20kl1');
  });

  it('vantagem respeita o modificador do campo', () => {
    useAionStore.getState().setInput('-2');
    useAionStore.getState().rollAdvantage('vantagem');
    expect(useAionStore.getState().history[0]?.result.expression).toBe('2d20kh1-2');
  });
});

describe('repetir', () => {
  it('repete a última expressão com resultado novo', () => {
    useAionStore.getState().rollExpression('1d20+5');
    useAionStore.getState().repeatLast();

    const history = useAionStore.getState().history;
    expect(history).toHaveLength(2);
    expect(history[0]?.result.expression).toBe('1d20+5');
    expect(history[0]?.result.seed).not.toBe(history[1]?.result.seed);
  });

  it('não faz nada com histórico vazio', () => {
    expect(() => useAionStore.getState().repeatLast()).not.toThrow();
    expect(useAionStore.getState().history).toHaveLength(0);
  });
});

describe('histórico', () => {
  it('revela uma rolagem do mestre', () => {
    useAionStore.getState().updateSettings({ gmMode: true });
    useAionStore.getState().rollExpression('1d20');
    const id = useAionStore.getState().history[0]?.id ?? '';

    expect(useAionStore.getState().history[0]?.hidden).toBe(true);
    useAionStore.getState().revealEntry(id);
    expect(useAionStore.getState().history[0]?.hidden).toBe(false);
  });

  it('fixa e desfixa', () => {
    useAionStore.getState().rollExpression('1d20');
    const id = useAionStore.getState().history[0]?.id ?? '';

    useAionStore.getState().togglePin(id);
    expect(useAionStore.getState().history[0]?.pinned).toBe(true);
    useAionStore.getState().togglePin(id);
    expect(useAionStore.getState().history[0]?.pinned).toBe(false);
  });

  it('remove uma entrada', () => {
    useAionStore.getState().rollExpression('1d20');
    const id = useAionStore.getState().history[0]?.id ?? '';
    useAionStore.getState().removeEntry(id);

    expect(useAionStore.getState().history).toHaveLength(0);
    expect(useAionStore.getState().lastEntryId).toBeNull();
  });

  it('limita o histórico preservando as fixadas', () => {
    for (let i = 0; i < 210; i += 1) useAionStore.getState().rollExpression('1d6');

    // Fixa a mais antiga que ainda sobreviveu e continua rolando.
    const history = useAionStore.getState().history;
    const oldest = history[history.length - 1]?.id ?? '';
    useAionStore.getState().togglePin(oldest);

    for (let i = 0; i < 60; i += 1) useAionStore.getState().rollExpression('1d6');

    const after = useAionStore.getState().history;
    expect(after.length).toBeLessThanOrEqual(200);
    expect(after.some((entry) => entry.id === oldest)).toBe(true);
  });

  it('limpa tudo', () => {
    useAionStore.getState().rollExpression('1d20');
    useAionStore.getState().clearHistory();

    expect(useAionStore.getState().history).toHaveLength(0);
    expect(useAionStore.getState().lastResult).toBeNull();
    expect(useAionStore.getState().phase).toBe('ocioso');
  });
});

describe('atalhos', () => {
  it('cria, roda e conta os usos', () => {
    useAionStore.getState().addMacro({
      name: 'Ataque',
      expression: '1d20+7',
      glyph: '⚔️',
    });

    const macro = useAionStore.getState().macros[0];
    expect(macro).toBeDefined();
    if (!macro) return;

    useAionStore.getState().runMacro(macro.id);

    expect(useAionStore.getState().macros[0]?.uses).toBe(1);
    expect(useAionStore.getState().history[0]?.macroName).toBe('Ataque');
    expect(useAionStore.getState().history[0]?.result.expression).toBe('1d20+7');
  });

  it('rodar um atalho inexistente não quebra', () => {
    expect(() => useAionStore.getState().runMacro('nao_existe')).not.toThrow();
  });

  it('edita e remove', () => {
    useAionStore.getState().addMacro({ name: 'A', expression: '1d4', glyph: '🎲' });
    const id = useAionStore.getState().macros[0]?.id ?? '';

    useAionStore.getState().updateMacro(id, { name: 'B', expression: '1d8' });
    expect(useAionStore.getState().macros[0]?.name).toBe('B');
    expect(useAionStore.getState().macros[0]?.expression).toBe('1d8');

    useAionStore.getState().removeMacro(id);
    expect(useAionStore.getState().macros).toHaveLength(0);
  });

  it('reordena sem sair dos limites', () => {
    for (const name of ['A', 'B', 'C']) {
      useAionStore.getState().addMacro({ name, expression: '1d6', glyph: '🎲' });
    }

    const first = useAionStore.getState().macros[0]?.id ?? '';
    useAionStore.getState().moveMacro(first, 1);

    const ordered = [...useAionStore.getState().macros].sort((a, b) => a.order - b.order);
    expect(ordered[0]?.name).toBe('B');
    expect(ordered[1]?.name).toBe('A');

    // Empurrar a primeira para cima não deve fazer nada.
    const top = ordered[0]?.id ?? '';
    expect(() => useAionStore.getState().moveMacro(top, -1)).not.toThrow();
    expect(
      [...useAionStore.getState().macros].sort((a, b) => a.order - b.order)[0]?.name,
    ).toBe('B');
  });
});

describe('personagens', () => {
  it('cria e ativa', () => {
    useAionStore.getState().addCharacter('Thalia', 'esmeralda');
    const character = useAionStore.getState().characters[0];

    expect(character?.name).toBe('Thalia');
    expect(character?.skin).toBe('esmeralda');
    expect(useAionStore.getState().activeCharacterId).toBe(character?.id);
  });

  it('remover devolve os atalhos para a mesa', () => {
    useAionStore.getState().addCharacter('Thalia', 'rubi');
    const id = useAionStore.getState().activeCharacterId ?? '';
    useAionStore.getState().addMacro({ name: 'Golpe', expression: '1d12', glyph: '⚔️' });

    expect(useAionStore.getState().macros[0]?.characterId).toBe(id);

    useAionStore.getState().removeCharacter(id);
    expect(useAionStore.getState().macros[0]?.characterId).toBeNull();
    expect(useAionStore.getState().characters).toHaveLength(0);
    expect(useAionStore.getState().activeCharacterId).toBeNull();
  });

  it('a skin do personagem ativo vai para a cena', () => {
    useAionStore.getState().updateSettings({ physics3d: true, reducedMotion: false });
    useAionStore.getState().addCharacter('Ruby', 'rubi');
    useAionStore.getState().rollExpression('1d20');
    expect(useAionStore.getState().pendingRequest?.skin).toBe('rubi');
  });

  it('nome vazio recebe um rótulo neutro', () => {
    useAionStore.getState().addCharacter('   ', 'aco');
    expect(useAionStore.getState().characters[0]?.name).toBe('Sem nome');
  });
});

describe('persistência', () => {
  it('sobrevive a JSON corrompido', () => {
    window.localStorage.setItem('aion:v1', '{isso não é json');
    expect(() => loadState()).not.toThrow();
    expect(loadState().settings).toEqual(DEFAULT_SETTINGS);
  });

  it('ignora versão desconhecida', () => {
    window.localStorage.setItem('aion:v1', JSON.stringify({ version: 99, macros: [] }));
    expect(loadState().macros).toEqual(DEFAULT_PERSISTED.macros);
  });

  it('descarta entradas de histórico malformadas', () => {
    window.localStorage.setItem(
      'aion:v1',
      JSON.stringify({
        version: 1,
        history: [{ id: 'a' }, { id: 'b', result: { expression: '1d6', total: 3, dice: [] } }],
      }),
    );
    expect(loadState().history).toHaveLength(1);
  });

  it('limita valores fora da faixa', () => {
    window.localStorage.setItem(
      'aion:v1',
      JSON.stringify({ version: 1, settings: { volume: 42, rollSpeed: -9, defaultSkin: 'roxo' } }),
    );

    const settings = loadState().settings;
    expect(settings.volume).toBe(1);
    expect(settings.rollSpeed).toBe(0.5);
    expect(settings.defaultSkin).toBe('ambar');
  });

  it('um personagem ativo inexistente cai no primeiro da lista', () => {
    window.localStorage.setItem(
      'aion:v1',
      JSON.stringify({
        version: 1,
        characters: [{ id: 'c1', name: 'Um', skin: 'rubi' }],
        activeCharacterId: 'fantasma',
      }),
    );
    expect(loadState().activeCharacterId).toBe('c1');
  });

  it('grava e relê o que importa', async () => {
    window.localStorage.clear();
    saveState({
      history: [],
      macros: [
        {
          id: 'm1',
          name: 'Teste',
          expression: '2d6',
          glyph: '🎲',
          characterId: null,
          order: 0,
          uses: 3,
        },
      ],
      characters: [{ id: 'c1', name: 'Um', skin: 'safira', accent: '#fff', createdAt: 0 }],
      activeCharacterId: 'c1',
      settings: { ...DEFAULT_SETTINGS, volume: 0.25 },
      fichas: [],
      fichaAtivaId: null,
      relayUrl: "",
      souMestre: false,
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    const loaded = loadState();
    expect(loaded.macros[0]?.name).toBe('Teste');
    expect(loaded.macros[0]?.uses).toBe(3);
    expect(loaded.settings.volume).toBe(0.25);
    expect(loaded.activeCharacterId).toBe('c1');
  });
});
