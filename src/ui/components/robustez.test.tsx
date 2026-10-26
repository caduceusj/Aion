// @vitest-environment jsdom
/**
 * Quando algo falha, a pessoa vê o que fazer — nunca uma página em branco.
 *
 * Dois casos: a tela que quebra ao ser desenhada (rede de segurança) e o
 * aparelho que não abre WebGL (a mesa vira feltro e o app avisa).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import { useAvisos } from '@/ui/avisos';
import { ErroNaTela } from './ErroNaTela';
import { Stage } from './Stage';

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

  it('a mesa vira feltro pintado, em vez de um campo preto', () => {
    const { container } = render(<Stage />);

    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('.palco__estatico')).not.toBeNull();
  });

  it('e o app diz por quê, uma vez, sem culpar a pessoa', () => {
    render(<Stage />);

    const aviso = useAvisos.getState().aviso;
    expect(aviso?.texto).toMatch(/não abriu os dados 3D/);
    expect(aviso?.texto).toMatch(/rolagens valem do mesmo jeito/);
  });

  it('as rolagens continuam funcionando', () => {
    render(<Stage />);
    act(() => {
      useAionStore.setState({ settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false } });
      useAionStore.getState().rollExpression('1d20');
    });

    expect(useAionStore.getState().history).toHaveLength(1);
  });
});
