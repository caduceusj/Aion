// @vitest-environment jsdom
/**
 * Quando algo falha, a pessoa vê o que fazer — nunca uma página em branco.
 *
 * Dois casos: a tela que quebra ao ser desenhada (rede de segurança) e o
 * aparelho que não abre WebGL (a mesa vira feltro e o app avisa).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import type { DiceStage } from '@/state/types';
import { useAvisos } from '@/ui/avisos';
import { carregarPalco } from '@/ui/carregamento';
import { ErroNaTela } from './ErroNaTela';
import { Stage } from './Stage';

// O pacote do 3D vem sob demanda (carregamento.ts). Por padrão o teste o pede de
// verdade; os que querem controlar a chegada — ou a falha — trocam o pedido.
vi.mock('@/ui/carregamento', async (original) => {
  const modulo = await original<typeof import('@/ui/carregamento')>();
  return { ...modulo, carregarPalco: vi.fn(modulo.carregarPalco) };
});

/** O 3D abre o pacote do three na primeira vez: dá tempo a isso. */
const ATE_O_PACOTE = { timeout: 15_000 };

function Quebrada(): never {
  throw new Error('estado de ficha impossível');
}

beforeEach(() => {
  // O React escreve o erro capturado no console; aqui ele é esperado.
  vi.spyOn(console, 'error').mockImplementation(() => {});
  useAvisos.setState({ aviso: null });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('a rede de segurança', () => {
  it('uma tela que quebra vira uma explicação, não uma página em branco', () => {
    render(
      <ErroNaTela>
        <Quebrada />
      </ErroNaTela>,
    );

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Algo deu errado' })).toBeTruthy();
    expect(screen.getByText(/ficam guardados neste aparelho/)).toBeTruthy();
    // E quem for consertar tem o que dizer: a mensagem do erro.
    expect(screen.getByText('estado de ficha impossível')).toBeTruthy();
  });

  it('sem erro, não aparece: os filhos seguem normalmente', () => {
    render(
      <ErroNaTela>
        <p>tudo certo</p>
      </ErroNaTela>,
    );

    expect(screen.getByText('tudo certo')).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('recarregar é o primeiro recurso, e já vem em foco', () => {
    const recarregar = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload: recarregar });
    render(
      <ErroNaTela>
        <Quebrada />
      </ErroNaTela>,
    );

    const botao = screen.getByRole('button', { name: 'Recarregar' });
    expect(document.activeElement).toBe(botao);
    fireEvent.click(botao);
    expect(recarregar).toHaveBeenCalledTimes(1);
  });

  it('apagar os dados pede um segundo toque — é o único botão sem desfazer', () => {
    const recarregar = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload: recarregar });
    window.localStorage.setItem('aion:v1', '{"history":[]}');
    render(
      <ErroNaTela>
        <Quebrada />
      </ErroNaTela>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Apagar os dados e recarregar' }));
    expect(window.localStorage.getItem('aion:v1')).not.toBeNull();
    expect(recarregar).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Toque de novo para apagar tudo' }));
    expect(window.localStorage.getItem('aion:v1')).toBeNull();
    expect(recarregar).toHaveBeenCalledTimes(1);
  });
});

describe('um aparelho sem WebGL', () => {
  beforeEach(() => {
    // O jsdom não implementa ResizeObserver nem WebGL: o segundo é o que se
    // quer testar, o primeiro só precisa existir.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      },
    );
    useAionStore.setState({
      settings: { ...DEFAULT_SETTINGS, physics3d: true, reducedMotion: false, sound: false },
    });
  });

  it('a mesa vira feltro pintado, em vez de um campo preto', async () => {
    const { container } = render(<Stage />);

    await waitFor(() => expect(container.querySelector('canvas')).toBeNull(), ATE_O_PACOTE);
    expect(container.querySelector('.palco__estatico')).not.toBeNull();
  }, 20_000);

  it('e o app diz por quê, uma vez, sem culpar a pessoa', async () => {
    render(<Stage />);

    await waitFor(() => expect(useAvisos.getState().aviso).not.toBeNull(), ATE_O_PACOTE);
    const aviso = useAvisos.getState().aviso;
    expect(aviso?.texto).toMatch(/não abriu os dados 3D/);
    expect(aviso?.texto).toMatch(/rolagens valem do mesmo jeito/);
  }, 20_000);

  it('as rolagens continuam funcionando', () => {
    render(<Stage />);
    act(() => {
      useAionStore.setState({ settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false } });
      useAionStore.getState().rollExpression('1d20');
    });

    expect(useAionStore.getState().history).toHaveLength(1);
  });
});

describe('o pacote do 3D vem sob demanda', () => {
  const palcoFalso = (faces: number[]): DiceStage => ({
    arremessar: vi.fn(() => Promise.resolve(faces)),
    exibir: vi.fn(() => Promise.resolve()),
    esmaecer: vi.fn(),
    clear: vi.fn(),
    setSpeed: vi.fn(),
    dispose: vi.fn(),
    resize: vi.fn(),
  });

  /** Uma promessa que o teste resolve (ou rejeita) quando quiser: o pacote "chegando". */
  const pacoteAdiado = () => {
    let entrega!: (stage: DiceStage) => void;
    let falha!: (erro: unknown) => void;
    const chegada = new Promise<{ createDiceStage: () => DiceStage }>((resolve, reject) => {
      entrega = (stage) => resolve({ createDiceStage: () => stage });
      falha = reject;
    });
    vi.mocked(carregarPalco).mockReturnValueOnce(chegada as unknown as ReturnType<typeof carregarPalco>);
    return { entrega, falha };
  };

  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      },
    );
    useAionStore.setState({
      history: [],
      phase: 'ocioso',
      pendingRequest: null,
      lastResult: null,
      lastEntryId: null,
      settings: { ...DEFAULT_SETTINGS, physics3d: true, reducedMotion: false, sound: false },
    });
  });

  it('até o 3D chegar, o feltro pintado ocupa a mesa — e cede ao canvas quando ele começa a desenhar', async () => {
    const pacote = pacoteAdiado();
    const { container } = render(<Stage />);
    const feltro = () => container.querySelector('.palco__estatico--espera') as HTMLElement;
    const canvas = () => container.querySelector('canvas') as HTMLElement;

    expect(feltro().classList.contains('palco__estatico--saindo')).toBe(false);
    expect(canvas().getAttribute('data-pronto')).toBeNull();

    await act(async () => pacote.entrega(palcoFalso([])));

    expect(feltro().classList.contains('palco__estatico--saindo')).toBe(true);
    expect(canvas().getAttribute('data-pronto')).toBe('sim');
  });

  it('uma rolagem feita antes de o pacote chegar espera por ele, e sai quando o palco aparece', async () => {
    const pacote = pacoteAdiado();
    const stage = palcoFalso([7]);
    render(<Stage />);

    act(() => {
      useAionStore.getState().rollExpression('1d20');
    });
    expect(stage.arremessar).not.toHaveBeenCalled();
    expect(useAionStore.getState().phase).toBe('lancando');

    await act(async () => pacote.entrega(stage));

    expect(stage.arremessar).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(useAionStore.getState().lastResult?.total).toBe(7));
  });

  it('sair da mesa antes de o pacote chegar não deixa palco nenhum para trás', async () => {
    const pacote = pacoteAdiado();
    const stage = palcoFalso([]);
    const { unmount } = render(<Stage />);

    unmount();
    await act(async () => pacote.entrega(stage));

    // O palco nem chega a ser criado; se tivesse sido, estaria solto, sem dono.
    expect(stage.resize).not.toHaveBeenCalled();
  });

  it('se o pacote não chega (sem rede), a mesa cai no palco inerte, avisa e as rolagens valem', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const pacote = pacoteAdiado();
    const { container } = render(<Stage />);

    act(() => {
      useAionStore.getState().rollExpression('2d6');
    });
    await act(async () => pacote.falha(new Error('Failed to fetch dynamically imported module')));

    expect(useAvisos.getState().aviso?.texto).toMatch(/Os dados 3D não carregaram/);
    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('.palco__estatico')).not.toBeNull();
    // A rolagem que esperava o palco cai no gerador, como num aparelho sem WebGL.
    await waitFor(() => expect(useAionStore.getState().history).toHaveLength(1));
  });
});
