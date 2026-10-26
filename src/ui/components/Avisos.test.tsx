// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useAvisos, avisar } from '@/ui/avisos';
import { Avisos } from './Avisos';

beforeEach(() => {
  vi.useFakeTimers();
  useAvisos.setState({ aviso: null });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('o aviso com desfazer', () => {
  it('a região de leitura existe antes de haver aviso — é o que a faz anunciar', () => {
    render(<Avisos />);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Desfazer' })).toBeNull();
  });

  it('mostra o texto e o botão, e desfazer chama o caminho de volta', () => {
    const desfazer = vi.fn();
    render(<Avisos />);

    act(() => avisar('Ficha de Aldric removida.', desfazer));
    expect(screen.getByRole('status').textContent).toContain('Ficha de Aldric removida.');

    fireEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
    expect(desfazer).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Ficha de Aldric removida.')).toBeNull();
  });

  it('um aviso sem desfazer não oferece o botão', () => {
    render(<Avisos />);
    act(() => avisar('Copiado.'));
    expect(screen.queryByRole('button', { name: 'Desfazer' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Dispensar o aviso' })).toBeTruthy();
  });

  it('some sozinho depois de alguns segundos', () => {
    render(<Avisos />);
    act(() => avisar('Atalho removido.', () => {}));

    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.queryByText('Atalho removido.')).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.queryByText('Atalho removido.')).toBeNull();
  });

  it('não some com o ponteiro em cima, e a contagem recomeça ao sair', () => {
    render(<Avisos />);
    act(() => avisar('Arma removida.', () => {}));
    const aviso = screen.getByText('Arma removida.').closest('.aviso') as HTMLElement;

    fireEvent.pointerEnter(aviso);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.queryByText('Arma removida.')).not.toBeNull();

    fireEvent.pointerLeave(aviso);
    act(() => {
      vi.advanceTimersByTime(9500);
    });
    expect(screen.queryByText('Arma removida.')).toBeNull();
  });

  it('não some com o foco nele — quem navega por teclado precisa de tempo', () => {
    render(<Avisos />);
    act(() => avisar('Arma removida.', () => {}));

    fireEvent.focus(screen.getByRole('button', { name: 'Desfazer' }));
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.queryByText('Arma removida.')).not.toBeNull();
  });

  it('um aviso novo substitui o antigo e recomeça a contagem', () => {
    render(<Avisos />);
    act(() => avisar('Primeiro.', () => {}));
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    act(() => avisar('Segundo.', () => {}));
    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(screen.queryByText('Primeiro.')).toBeNull();
    expect(screen.queryByText('Segundo.')).not.toBeNull();
  });
});
