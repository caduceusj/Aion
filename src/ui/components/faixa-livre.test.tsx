// @vitest-environment jsdom
/**
 * O que cabe na faixa livre da mesa.
 *
 * Entre o cabeçalho e a doca sobra uma faixa que encolhe com o texto ampliado,
 * com a tela deitada e num celular pequeno. O aviso de mesa vazia e o painel do
 * resultado não podem passar por cima de um dos dois: medem a faixa e perdem o
 * acessório — nunca o que a pessoa veio ler.
 *
 * O jsdom não tem layout. As medidas que o ajuste lê (`scrollHeight`,
 * `clientHeight`, `offsetHeight`) são escritas à mão, e o que se confere é a
 * decisão: qual nível, quando, e se ela é refeita.
 */

import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import { nivelQueCabe, useNivelQueCabe } from '@/ui/hooks/useNivelQueCabe';
import { MesaVazia } from './MesaVazia';
import { ResultOverlay } from './ResultOverlay';

/** O callback do observador mais recente, para simular a faixa mudando de tamanho. */
let aoRedimensionar: (() => void) | null = null;
let desconectados = 0;

type Medidas = Partial<Record<'scrollHeight' | 'clientHeight' | 'offsetHeight', (el: HTMLElement) => number>>;

/** Escreve medidas de layout que o jsdom não calcula. `delete` as devolve. */
function medir(medidas: Medidas): void {
  for (const [campo, valor] of Object.entries(medidas)) {
    Object.defineProperty(HTMLElement.prototype, campo, {
      configurable: true,
      get(this: HTMLElement) {
        return valor(this);
      },
    });
  }
}

const nivelDe = (el: Element | null): string | undefined => (el as HTMLElement | null)?.dataset.nivel;

beforeEach(() => {
  aoRedimensionar = null;
  desconectados = 0;
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        aoRedimensionar = callback;
      }
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {
        desconectados += 1;
      }
    },
  );
  useAionStore.setState({
    history: [],
    macros: [],
    characters: [],
    activeCharacterId: null,
    settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false },
    phase: 'ocioso',
    lastResult: null,
    lastEntryId: null,
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  for (const campo of ['scrollHeight', 'clientHeight', 'offsetHeight']) {
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)[campo];
  }
});

describe('nivelQueCabe', () => {
  it('se cabe tudo, o nível é 0 — e não pergunta mais nada', () => {
    const perguntas: number[] = [];
    const nivel = nivelQueCabe((n) => {
      perguntas.push(n);
      return true;
    }, 3);

    expect(nivel).toBe(0);
    expect(perguntas).toEqual([0]);
  });

  it('escolhe o primeiro nível, do mais completo ao mais enxuto, em que cabe', () => {
    expect(nivelQueCabe((n) => n >= 2, 3)).toBe(2);
  });

  it('se nem o penúltimo cabe, o último vale sem ser perguntado — não há onde recuar', () => {
    const perguntas: number[] = [];
    const nivel = nivelQueCabe((n) => {
      perguntas.push(n);
      return false;
    }, 3);

    expect(nivel).toBe(3);
    expect(perguntas).toEqual([0, 1, 2]);
  });
});

describe('useNivelQueCabe', () => {
  function Aviso({ coube, quando = 'a' }: { coube: (faixa: HTMLElement) => boolean; quando?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    useNivelQueCabe(ref, ref, 2, coube, quando);
    return <div ref={ref} data-testid="aviso" />;
  }
  const aviso = () => screen.getByTestId('aviso');

  it('escreve o nível mais completo que cabe em data-nivel', () => {
    render(<Aviso coube={(faixa) => faixa.dataset.nivel !== '0'} />);

    expect(nivelDe(aviso())).toBe('1');
  });

  it('refaz a escolha quando a faixa muda de tamanho', () => {
    let altura = 400;
    render(<Aviso coube={(faixa) => (faixa.dataset.nivel === '0' ? 300 : 100) <= altura} />);
    expect(nivelDe(aviso())).toBe('0');

    altura = 150;
    act(() => aoRedimensionar?.());
    expect(nivelDe(aviso())).toBe('1');

    altura = 400;
    act(() => aoRedimensionar?.());
    expect(nivelDe(aviso())).toBe('0');
  });

  it('refaz a escolha quando muda aquilo de que o conteúdo depende (`quando`)', () => {
    let altura = 400;
    const coube = (faixa: HTMLElement): boolean => (faixa.dataset.nivel === '0' ? 300 : 100) <= altura;
    const { rerender } = render(<Aviso coube={coube} quando="a" />);
    expect(nivelDe(aviso())).toBe('0');

    altura = 150;
    rerender(<Aviso coube={coube} quando="b" />);
    expect(nivelDe(aviso())).toBe('1');
  });

  it('solta o observador ao sair de cena', () => {
    const { unmount } = render(<Aviso coube={() => true} />);
    expect(desconectados).toBe(0);

    unmount();
    expect(desconectados).toBe(1);
  });

  it('sem ResizeObserver (navegador antigo, jsdom) não mexe em nada', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    render(<Aviso coube={() => false} />);

    expect(nivelDe(aviso())).toBeUndefined();
  });
});

describe('o aviso de mesa vazia', () => {
  const aviso = () => document.querySelector('.mesa-vazia');
  const clientHeight = 150;

  it('cabendo inteiro, aparece inteiro', () => {
    medir({ scrollHeight: () => 140, clientHeight: () => clientHeight });
    render(<MesaVazia />);

    expect(nivelDe(aviso())).toBe('0');
  });

  it('sem espaço para tudo, a dica do gesto sai primeiro', () => {
    medir({
      scrollHeight: (el) => (el.dataset.nivel === '0' ? 220 : 140),
      clientHeight: () => clientHeight,
    });
    render(<MesaVazia />);

    expect(nivelDe(aviso())).toBe('1');
  });

  it('com menos ainda, fica a instrução — o título é cortesia, ela é o que ensina', () => {
    medir({
      scrollHeight: (el) => ({ '0': 220, '1': 180, '2': 120 })[el.dataset.nivel ?? '0'] ?? 0,
      clientHeight: () => clientHeight,
    });
    render(<MesaVazia />);

    expect(nivelDe(aviso())).toBe('2');
  });

  it('se nem a instrução cabe, o aviso inteiro sai da frente', () => {
    medir({ scrollHeight: () => 999, clientHeight: () => clientHeight });
    render(<MesaVazia />);

    expect(nivelDe(aviso())).toBe('3');
  });

  it('a faixa crescendo — o texto voltou ao tamanho normal — devolve o que tinha saído', () => {
    let faixa = 100;
    medir({
      scrollHeight: (el) => (el.dataset.nivel === '0' ? 200 : 90),
      clientHeight: () => faixa,
    });
    render(<MesaVazia />);
    expect(nivelDe(aviso())).toBe('1');

    faixa = 300;
    act(() => aoRedimensionar?.());
    expect(nivelDe(aviso())).toBe('0');
  });

  it('depois da primeira rolagem não sobra nada para medir, e o observador é solto', () => {
    render(<MesaVazia />);
    expect(aviso()).not.toBeNull();
    const antes = desconectados;

    act(() => {
      useAionStore.getState().rollExpression('1d6');
    });

    expect(aviso()).toBeNull();
    expect(desconectados).toBe(antes + 1);
  });
});

describe('o painel do resultado', () => {
  const painel = () => document.querySelector('.resultado__painel');
  const rolar = (expressao = '2d6+3') =>
    act(() => {
      useAionStore.getState().rollExpression(expressao);
    });

  it('cabendo, mostra tudo', () => {
    medir({ offsetHeight: () => 140, clientHeight: () => 200 });
    render(<ResultOverlay />);
    rolar();

    expect(nivelDe(painel())).toBe('0');
  });

  it('sem espaço, perde os dados e quem rolou antes do título', () => {
    medir({
      offsetHeight: (el) => (el.dataset.nivel === '0' ? 260 : 150),
      clientHeight: () => 200,
    });
    render(<ResultOverlay />);
    rolar();

    expect(nivelDe(painel())).toBe('1');
  });

  it('com menos ainda, perde o título também — e o total continua lá', () => {
    medir({
      offsetHeight: (el) => ({ '0': 260, '1': 210, '2': 120 })[el.dataset.nivel ?? '0'] ?? 0,
      clientHeight: () => 200,
    });
    render(<ResultOverlay />);
    rolar();

    expect(nivelDe(painel())).toBe('2');
    // Escondido é com CSS: o total está no DOM, e o leitor de tela o anuncia à parte.
    expect(document.querySelector('.resultado__total')).not.toBeNull();
    expect(screen.getByRole('status').textContent).toMatch(/2d6\+3: \d+/);
  });

  it('nunca esconde o total: o nível mais enxuto não passa de 2', () => {
    medir({ offsetHeight: () => 999, clientHeight: () => 100 });
    render(<ResultOverlay />);
    rolar();

    expect(nivelDe(painel())).toBe('2');
  });

  it('a rolagem oculta do mestre, ao ser revelada, é medida de novo — o conteúdo mudou', () => {
    useAionStore.setState({ settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false, gmMode: true } });
    let revelada = false;
    medir({
      // Oculta é só um cartão pequeno; revelada traz total, dados e nome.
      offsetHeight: (el) => (revelada ? (el.dataset.nivel === '0' ? 260 : 150) : 100),
      clientHeight: () => 200,
    });
    render(<ResultOverlay />);
    rolar();
    expect(nivelDe(painel())).toBe('0');

    revelada = true;
    fireEvent.click(screen.getByRole('button', { name: 'Revelar' }));

    expect(nivelDe(painel())).toBe('1');
  });
});
