// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { useAionStore } from './store';
import { DEFAULT_PERSISTED, loadState, saveState } from './persistence';
import { DEFAULT_SETTINGS } from './seed';

const reset = (): void => {
  useAionStore.setState({
    history: [],
    macros: [],
    characters: [],
    activeCharacterId: null,
    settings: { ...DEFAULT_SETTINGS },
    input: '',
    inputError: null,
    phase: 'ocioso',
    pendingRequest: null,
    lastResult: null,
    lastEntryId: null,
    panel: null,
  });
};

beforeEach(reset);

describe('ciclo de rolagem', () => {
  it('uma expressão válida cria entrada e enfileira a cena', () => {
    useAionStore.getState().rollExpression('1d20+5');
    const state = useAionStore.getState();

    expect(state.history).toHaveLength(1);
    expect(state.inputError).toBeNull();
    expect(state.lastResult).not.toBeNull();
    expect(state.phase).toBe('lancando');
    expect(state.pendingRequest).not.toBeNull();
    expect(state.pendingRequest?.result).toBe(state.lastResult);
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

  it('onStageSettled fecha o ciclo', () => {
    useAionStore.getState().rollExpression('2d6');
    useAionStore.getState().onStageSettled();
    const state = useAionStore.getState();

    expect(state.phase).toBe('revelado');
    expect(state.pendingRequest).toBeNull();
  });

  it('sem física o resultado já nasce revelado', () => {
    useAionStore.getState().updateSettings({ physics3d: false });
    useAionStore.getState().rollExpression('2d6');
    const state = useAionStore.getState();

    expect(state.phase).toBe('revelado');
    expect(state.pendingRequest).toBeNull();
    expect(state.history).toHaveLength(1);
  });

  it('movimento reduzido também pula a física', () => {
    useAionStore.getState().updateSettings({ reducedMotion: true });
    useAionStore.getState().rollExpression('2d6');
    expect(useAionStore.getState().pendingRequest).toBeNull();
    expect(useAionStore.getState().phase).toBe('revelado');
  });

  it('cada rolagem recebe um id de requisição próprio', () => {
    useAionStore.getState().rollExpression('1d20');
    const first = useAionStore.getState().pendingRequest?.id;
    useAionStore.getState().rollExpression('1d20');
    const second = useAionStore.getState().pendingRequest?.id;

    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(second).not.toBe(first);
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
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    const loaded = loadState();
    expect(loaded.macros[0]?.name).toBe('Teste');
    expect(loaded.macros[0]?.uses).toBe(3);
    expect(loaded.settings.volume).toBe(0.25);
    expect(loaded.activeCharacterId).toBe('c1');
  });
});
