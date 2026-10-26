// @vitest-environment jsdom
/**
 * A doca de rolagem: o que a pessoa vê quando erra, quando hesita e quando
 * pede ajuda. A física fica desligada e o som também — é a doca, não a mesa,
 * que está sob teste.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import { useAtalhosGlobais } from '@/ui/hooks/useAtalhosGlobais';
import { Dock } from './Dock';

const reset = (): void => {
  useAionStore.setState({
    history: [],
    macros: [],
    characters: [],
    activeCharacterId: null,
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
};

/** A doca com o teclado global ligado, como no App. */
function Mesa() {
  useAtalhosGlobais(() => {});
  return <Dock />;
}

const campo = () => screen.getByRole('textbox', { name: 'Notação da rolagem' }) as HTMLInputElement;
const rolar = () => screen.getByRole('button', { name: /^Rolar$/ });
const digitar = (valor: string) => fireEvent.change(campo(), { target: { value: valor } });

beforeEach(() => {
  vi.useFakeTimers();
  reset();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('rolar com o campo vazio', () => {
  it('leva ao campo e diz o que falta, em vez de ficar mudo', () => {
    render(<Dock />);
    expect(screen.queryByText(/Escreva uma rolagem/)).toBeNull();

    fireEvent.click(rolar());

    expect(screen.getByRole('status').textContent).toMatch(/Escreva uma rolagem/);
    expect(document.activeElement).toBe(campo());
    expect(useAionStore.getState().history).toHaveLength(0);
  });

  it('o botão parece desligado para quem lê a tela, mas continua clicável', () => {
    render(<Dock />);
    expect(rolar().getAttribute('aria-disabled')).toBe('true');
    expect((rolar() as HTMLButtonElement).disabled).toBe(false);
  });

  it('a dica some na hora em que a pessoa começa a escrever', () => {
    render(<Dock />);
    fireEvent.click(rolar());
    digitar('1d');
    expect(screen.queryByText(/Escreva uma rolagem/)).toBeNull();
  });
});

describe('o erro de notação', () => {
  it('não aparece a cada tecla: espera a pessoa parar', () => {
    render(<Dock />);
    digitar('2d');

    expect(campo().getAttribute('aria-invalid')).toBe('true');
    expect(screen.queryByRole('status')).toBeNull();

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByRole('status').textContent).not.toBe('');
  });

  it('some assim que a expressão fica válida', () => {
    render(<Dock />);
    digitar('2d');
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.queryByRole('status')).not.toBeNull();

    digitar('2d6');
    expect(screen.queryByRole('status')).toBeNull();
    expect(campo().getAttribute('aria-invalid')).toBe('false');
  });

  it('rolar com a notação errada mostra o erro de imediato e não rola', () => {
    render(<Dock />);
    digitar('2d');
    fireEvent.click(rolar());

    expect(screen.queryByRole('status')).not.toBeNull();
    expect(useAionStore.getState().history).toHaveLength(0);
  });
});

describe('a rolagem de verdade', () => {
  it('uma notação válida rola', () => {
    render(<Dock />);
    digitar('2d6+3');
    fireEvent.click(rolar());
    expect(useAionStore.getState().history).toHaveLength(1);
  });

  it('o botão de limpar esvazia o campo e devolve o foco a ele', () => {
    render(<Dock />);
    expect(screen.queryByRole('button', { name: 'Limpar o campo' })).toBeNull();

    digitar('4d6kh3');
    fireEvent.click(screen.getByRole('button', { name: 'Limpar o campo' }));

    expect(campo().value).toBe('');
    expect(document.activeElement).toBe(campo());
  });
});

describe('a quantidade de dados, sem mouse', () => {
  it('as setas mudam a quantidade e o nome do botão acompanha', () => {
    render(<Dock />);
    const d6 = screen.getByRole('button', { name: /^Rolar 1 d6/ });

    fireEvent.keyDown(d6, { key: 'ArrowUp' });
    fireEvent.keyDown(d6, { key: 'ArrowUp' });
    expect(screen.getByRole('button', { name: /^Rolar 3 d6/ })).toBeTruthy();

    fireEvent.keyDown(screen.getByRole('button', { name: /^Rolar 3 d6/ }), { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: /^Rolar 2 d6/ })).toBeTruthy();
  });

  it('nunca passa de vinte nem desce de um', () => {
    render(<Dock />);
    let d4 = screen.getByRole('button', { name: /^Rolar 1 d4/ });
    fireEvent.keyDown(d4, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: /^Rolar 1 d4/ })).toBeTruthy();

    for (let i = 0; i < 30; i += 1) {
      d4 = screen.getByRole('button', { name: /d4/ });
      fireEvent.keyDown(d4, { key: 'ArrowUp' });
    }
    expect(screen.getByRole('button', { name: /^Rolar 20 d4/ })).toBeTruthy();
  });

  it('o dado rola a quantidade escolhida', () => {
    render(<Dock />);
    const d6 = screen.getByRole('button', { name: /^Rolar 1 d6/ });
    fireEvent.keyDown(d6, { key: 'ArrowUp' });
    fireEvent.click(screen.getByRole('button', { name: /^Rolar 2 d6/ }));

    expect(useAionStore.getState().history[0]?.result.expression).toBe('2d6');
  });
});

describe('a ajuda de notação', () => {
  const abrirAjuda = () => fireEvent.click(screen.getByRole('button', { name: 'Como escrever uma rolagem' }));

  it('abre como diálogo, com o foco dentro', () => {
    render(<Mesa />);
    abrirAjuda();

    const dialogo = screen.getByRole('dialog');
    expect(dialogo.getAttribute('aria-modal')).toBe('true');
    expect(dialogo.contains(document.activeElement)).toBe(true);
  });

  it('o Esc fecha a ajuda, devolve o foco ao botão e NÃO sai da Mesa', () => {
    render(<Mesa />);
    const botao = screen.getByRole('button', { name: 'Como escrever uma rolagem' });
    fireEvent.click(botao);

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(useAionStore.getState().vista).toBe('mesa');
    expect(document.activeElement).toBe(botao);
  });

  it('escolher um exemplo preenche o campo e fecha a ajuda', () => {
    render(<Mesa />);
    abrirAjuda();

    const linhas = within(screen.getByRole('dialog')).getAllByRole('button', { name: /Toque|^\S/ });
    const exemplo = linhas.find((b) => b.className.includes('ajuda__linha')) as HTMLElement;
    const sintaxe = exemplo.querySelector('code')?.textContent as string;
    fireEvent.click(exemplo);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(campo().value).toBe(sintaxe);
  });

  it('o Tab gira dentro do diálogo em vez de escapar para a mesa', () => {
    // Sem layout, o jsdom diz que nada tem `offsetParent`; o diálogo usa isso
    // para ignorar o que está escondido. Aqui tudo está visível.
    const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent');
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get() {
        return this.parentNode;
      },
    });

    try {
      render(<Mesa />);
      abrirAjuda();
      const dialogo = screen.getByRole('dialog');
      const botoes = [...dialogo.querySelectorAll<HTMLElement>('button')];
      const primeiro = botoes[0] as HTMLElement;
      const ultimo = botoes[botoes.length - 1] as HTMLElement;

      ultimo.focus();
      fireEvent.keyDown(ultimo, { key: 'Tab' });
      expect(document.activeElement).toBe(primeiro);

      primeiro.focus();
      fireEvent.keyDown(primeiro, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(ultimo);
    } finally {
      if (original) Object.defineProperty(HTMLElement.prototype, 'offsetParent', original);
    }
  });
});
