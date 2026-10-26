// @vitest-environment jsdom
/**
 * O app inteiro, do menu à gaveta, como quem navega por ele.
 *
 * Aqui o que se confere é a costura: título de aba, landmarks, para onde vai o
 * foco quando a tela troca, o que fica inerte atrás da gaveta, e que o Esc, o
 * "?" e o Ctrl+Z funcionam de ponta a ponta, com os componentes de verdade.
 * Sem WebGL (jsdom), a mesa cai no feltro pintado — que é, também, o
 * comportamento que se quer garantir.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from './App';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import { useAvisos } from '@/ui/avisos';

/** Simula a largura: `estreita` é um celular; senão, um desktop. */
function simularLargura(estreita: boolean): void {
  vi.stubGlobal('matchMedia', (consulta: string) => {
    const vale =
      (consulta.includes('max-width') && estreita) ||
      (consulta.includes('min-width') && !estreita);
    return {
      matches: vale,
      media: consulta,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    };
  });
}

const reset = (): void => {
  useAionStore.setState({
    history: [],
    macros: [
      { id: 'm1', name: 'Ataque', expression: '1d20+5', glyph: '⚔️', characterId: null, order: 0, uses: 0 },
      { id: 'm2', name: 'Dano', expression: '1d8+3', glyph: '🩸', characterId: null, order: 1, uses: 0 },
    ],
    characters: [],
    activeCharacterId: null,
    settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false },
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
  useAvisos.setState({ aviso: null });
  window.history.replaceState(null, '', '/');
};

let relogio = Date.now();

beforeEach(() => {
  // A trava contra clique duplo de `remocoes.ts` guarda a hora da última remoção.
  relogio += 3_600_000;
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(relogio);
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    },
  );
  simularLargura(true);
  reset();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const irParaAMesa = () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /A Mesa/ }));
};

const abrirPaineis = () => fireEvent.click(screen.getByRole('button', { name: 'Abrir os painéis' }));

describe('cada tela diz onde está', () => {
  it('o menu tem título de aba, <main> e <h1>', () => {
    render(<App />);

    expect(document.title).toBe('Aion — Mesa de Dados');
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: 'Aion' })).toBeTruthy();
  });

  it('a Mesa troca o título, ganha o seu <main> e leva o foco até ele', () => {
    irParaAMesa();

    expect(document.title).toBe('A Mesa · Aion');
    const principal = screen.getByRole('main', { name: 'A Mesa' });
    expect(screen.getByRole('heading', { level: 1, name: 'A Mesa' })).toBeTruthy();
    // O botão em que se clicou sumiu com o menu: sem isto o foco cairia no <body>.
    expect(document.activeElement).toBe(principal);
  });

  it('o Códice tem o dele, e voltar ao menu restaura o do site', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /O Códice/ }));
    expect(document.title).toBe('O Códice · Aion');

    fireEvent.click(screen.getByRole('button', { name: 'Menu principal' }));
    expect(document.title).toBe('Aion — Mesa de Dados');
  });
});

describe('a mesa vazia e a primeira rolagem', () => {
  it('ensina o gesto enquanto não há nada rolado, e sai de cena depois', () => {
    irParaAMesa();
    expect(screen.getByText('A mesa está pronta.')).toBeTruthy();

    act(() => {
      useAionStore.getState().rollExpression('1d20');
    });

    expect(screen.queryByText('A mesa está pronta.')).toBeNull();
  });
});

describe('a gaveta num celular', () => {
  it('um botão só abre os painéis — no último que se viu, ou no histórico', () => {
    irParaAMesa();
    abrirPaineis();

    expect(screen.getByRole('complementary', { name: 'Histórico' })).toBeTruthy();
  });

  it('o foco entra na gaveta, e a mesa por trás fica inerte', () => {
    irParaAMesa();
    const cabecalho = screen.getByRole('banner');
    const principal = screen.getByRole('main', { name: 'A Mesa' });
    expect(cabecalho.hasAttribute('inert')).toBe(false);

    abrirPaineis();

    const gaveta = screen.getByRole('complementary', { name: 'Histórico' });
    expect(document.activeElement).toBe(gaveta);
    expect(cabecalho.hasAttribute('inert')).toBe(true);
    expect(principal.hasAttribute('inert')).toBe(true);
  });

  it('o Esc fecha a gaveta, devolve o foco ao botão e tira o inerte', () => {
    irParaAMesa();
    const botao = screen.getByRole('button', { name: 'Abrir os painéis' });
    botao.focus();
    abrirPaineis();

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

    expect(screen.queryByRole('complementary')).toBeNull();
    expect(document.activeElement).toBe(botao);
    expect(screen.getByRole('main', { name: 'A Mesa' }).hasAttribute('inert')).toBe(false);
    expect(useAionStore.getState().vista).toBe('mesa');
  });

  it('as abas de dentro da gaveta trocam de painel, e o botão reabre o último', () => {
    irParaAMesa();
    abrirPaineis();

    fireEvent.click(within(screen.getByRole('navigation', { name: 'Trocar de painel' })).getByRole('button', { name: 'Ajustes' }));
    expect(screen.getByRole('complementary', { name: 'Ajustes' })).toBeTruthy();

    fireEvent.keyDown(document.body, { key: 'Escape' });
    abrirPaineis();
    expect(screen.getByRole('complementary', { name: 'Ajustes' })).toBeTruthy();
  });
});

describe('a gaveta num desktop', () => {
  beforeEach(() => simularLargura(false));

  it('abre sozinha no histórico ao entrar na Mesa, sem roubar o foco nem inertar a mesa', () => {
    irParaAMesa();

    expect(screen.getByRole('complementary', { name: 'Histórico' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('main', { name: 'A Mesa' }));
    expect(screen.getByRole('main', { name: 'A Mesa' }).hasAttribute('inert')).toBe(false);
  });
});

describe('o teclado, de ponta a ponta', () => {
  it('"?" abre a lista de atalhos da tela em que se está; Esc fecha só ela', () => {
    irParaAMesa();

    fireEvent.keyDown(document.body, { key: '?' });
    const dialogo = screen.getByRole('dialog', { name: 'Atalhos de teclado' });
    expect(within(dialogo).getByRole('heading', { name: 'Na Mesa' })).toBeTruthy();

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(useAionStore.getState().vista).toBe('mesa');
  });

  it('com as teclas soltas desligadas, o "?" não abre nada — e o Esc continua valendo', () => {
    irParaAMesa();
    act(() => {
      useAionStore.setState({ settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false, hotkeys: false } });
    });

    fireEvent.keyDown(document.body, { key: '?' });
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(useAionStore.getState().vista).toBe('menu');
  });

  it('remover um atalho avisa; o Ctrl+Z desfaz, sem passar pelo botão', () => {
    irParaAMesa();
    abrirPaineis();
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Trocar de painel' })).getByRole('button', { name: 'Atalhos' }));

    fireEvent.click(screen.getByRole('button', { name: 'Remover Dano' }));
    expect(useAionStore.getState().macros.map((m) => m.name)).toEqual(['Ataque']);
    expect(screen.getByText('Atalho “Dano” removido.')).toBeTruthy();

    fireEvent.keyDown(document.body, { key: 'z', ctrlKey: true });
    expect(useAionStore.getState().macros.map((m) => m.name).sort()).toEqual(['Ataque', 'Dano']);
    expect(screen.queryByText('Atalho “Dano” removido.')).toBeNull();
  });
});
