// @vitest-environment jsdom
/**
 * A tela do Códice, que vive em pacote próprio.
 *
 * O que se prende aqui é o que a pessoa vê enquanto o pacote vem — uma espera
 * que diz o que está acontecendo, e que não pisca quando o pacote já estava à
 * mão — e que a escolha entre as duas não muda no meio da leitura.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import { carregarCodice, codiceCarregado } from '@/ui/carregamento';
import { Codex } from './Codex';
import { VistaDoCodice } from './VistaDoCodice';

vi.mock('@/ui/carregamento', () => ({
  carregarCodice: vi.fn(),
  codiceCarregado: vi.fn(() => null),
}));

const busca = () => screen.getByRole('searchbox', { name: 'Buscar no códice' }) as HTMLInputElement;

/** O pacote "chegando": uma promessa que o teste resolve quando quiser. */
const pacoteAdiado = () => {
  let entrega!: () => void;
  const chegada = new Promise<{ Codex: typeof Codex }>((resolve) => {
    entrega = () => resolve({ Codex });
  });
  vi.mocked(carregarCodice).mockReturnValue(chegada as unknown as ReturnType<typeof carregarCodice>);
  return entrega;
};

beforeEach(() => {
  useAionStore.setState({
    settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false },
    vista: 'codice',
    panel: null,
  });
  window.history.replaceState(null, '', '/');
  vi.mocked(codiceCarregado).mockReturnValue(null);
});
afterEach(cleanup);

// O componente preguiçoso é um só no módulo: o primeiro pedido dele é o único, e
// depois de resolvido ele não suspende mais. Por isso a espera e a chegada são o
// mesmo teste, e vêm antes dos que montam o Códice pelo caminho preguiçoso.
describe('enquanto o pacote do Códice não chegou', () => {
  it('diz o que está acontecendo — e, quando ele chega, troca a espera pelo Códice, com o foco na leitura', async () => {
    const entregar = pacoteAdiado();
    render(<VistaDoCodice />);

    // A espera: um status para o leitor de tela, e o destino do foco da troca de tela.
    const status = screen.getByRole('status');
    expect(status.textContent).toBe('Abrindo o Códice…');
    const tela = status.closest('main') as HTMLElement;
    expect(tela.hasAttribute('data-foco-da-vista')).toBe(true);
    expect(tela.getAttribute('aria-busy')).toBe('true');
    expect(screen.queryByRole('searchbox')).toBeNull();

    // Quem não quer esperar não fica preso: "Voltar" sai do Códice.
    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(useAionStore.getState().vista).not.toBe('codice');
    useAionStore.setState({ vista: 'codice' });

    // A chegada.
    await act(async () => entregar());

    expect(screen.queryByText('Abrindo o Códice…')).toBeNull();
    expect(busca()).toBeTruthy();
    expect(document.activeElement).toBe(document.getElementById('codice-leitura'));
  });
});

describe('com o pacote já à mão (pré-carregado)', () => {
  it('monta direto, sem um quadro de espera', () => {
    vi.mocked(codiceCarregado).mockReturnValue(Codex);
    render(<VistaDoCodice />);

    expect(busca()).toBeTruthy();
    expect(screen.queryByText('Abrindo o Códice…')).toBeNull();
  });

  it('a escolha vale enquanto a tela está aberta: o pacote chegar depois não remonta o Códice', () => {
    // Entrou sem o pacote (caminho preguiçoso, já resolvido em outro teste)…
    const { rerender } = render(<VistaDoCodice />);
    fireEvent.change(busca(), { target: { value: 'arran' } });

    // …e o pacote chega com a pessoa no meio da busca. O App renderiza de novo
    // por qualquer motivo (um ajuste, um personagem): o Códice não pode remontar
    // e perder o que ela digitou.
    vi.mocked(codiceCarregado).mockReturnValue(Codex);
    rerender(<VistaDoCodice />);

    expect(busca().value).toBe('arran');
  });
});
