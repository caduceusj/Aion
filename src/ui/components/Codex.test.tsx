// @vitest-environment jsdom
/**
 * O Códice como quem lê nele o usa: achar, voltar, sair.
 *
 * O que se prende aqui são decisões de uso — a busca que no celular tem de
 * mostrar seus resultados, o índice que não é uma parede de 176 nomes, o Esc
 * que desfaz uma coisa por vez — e não o conteúdo, que `integridade.test.ts`
 * já confere.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import { useAtalhosGlobais } from '@/ui/hooks/useAtalhosGlobais';
import { useAvisos } from '@/ui/avisos';
import { Codex } from './Codex';

const reset = (): void => {
  useAionStore.setState({
    settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false },
    vista: 'codice',
    panel: null,
  });
  window.history.replaceState(null, '', '/');
};

/** O Códice com o teclado global ligado, como no App. */
function Pagina() {
  useAtalhosGlobais(() => {});
  return <Codex />;
}

const busca = () => screen.getByRole('searchbox', { name: 'Buscar no códice' }) as HTMLInputElement;
const indice = () => within(screen.getByRole('navigation', { name: 'Índice do códice' }));
const gaveta = (nome: RegExp) => indice().getByRole('button', { name: nome });
const escapar = () => fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape', bubbles: true });

/** A barra de "voltar" de dentro da página — não o botão do cabeçalho. */
const barraDeVoltar = (): HTMLElement | null => document.querySelector('.codice__voltar');

/** Abre um verbete pelo índice, como o leitor: a gaveta primeiro, depois o nome. */
const abrirVerbete = (gavetaNome: RegExp, nome: string): void => {
  if (gaveta(gavetaNome).getAttribute('aria-expanded') !== 'true') fireEvent.click(gaveta(gavetaNome));
  fireEvent.click(indice().getByRole('button', { name: new RegExp(`^${nome}`) }));
};

beforeEach(reset);
afterEach(cleanup);

describe('o índice não é uma parede', () => {
  it('na capa, as gavetas chegam fechadas, cada uma com a sua contagem', () => {
    render(<Pagina />);
    const personagens = gaveta(/^Personagens/);

    expect(personagens.getAttribute('aria-expanded')).toBe('false');
    expect(personagens.textContent).toMatch(/\d+$/);
    expect(indice().queryByRole('button', { name: 'Arran Herrys' })).toBeNull();
  });

  it('abrir uma gaveta mostra o que há nela; abrir de novo a fecha', () => {
    render(<Pagina />);
    fireEvent.click(gaveta(/^Personagens/));

    expect(gaveta(/^Personagens/).getAttribute('aria-expanded')).toBe('true');
    expect(indice().getByRole('button', { name: 'Arran Herrys' })).toBeTruthy();

    fireEvent.click(gaveta(/^Personagens/));
    expect(indice().queryByRole('button', { name: 'Arran Herrys' })).toBeNull();
  });

  it('"Abrir todas" abre tudo e vira "Fechar todas"', () => {
    render(<Pagina />);
    fireEvent.click(indice().getByRole('button', { name: 'Abrir todas' }));

    const gavetas = indice().getAllByRole('button').filter((b) => b.hasAttribute('aria-expanded'));
    expect(gavetas.length).toBeGreaterThan(5);
    expect(gavetas.every((b) => b.getAttribute('aria-expanded') === 'true')).toBe(true);

    fireEvent.click(indice().getByRole('button', { name: 'Fechar todas' }));
    expect(gavetas.every((b) => b.getAttribute('aria-expanded') === 'false')).toBe(true);
  });

  it('quem chega por um link já vê o verbete na gaveta dele, marcado', () => {
    window.history.replaceState(null, '', '/#codice/arran-herrys');
    render(<Pagina />);

    expect(gaveta(/^Personagens/).getAttribute('aria-expanded')).toBe('true');
    const atual = indice().getByRole('button', { name: 'Arran Herrys' });
    expect(atual.getAttribute('aria-current')).toBe('page');
  });
});

describe('a aba diz onde se está', () => {
  it('muda a cada página do Códice', () => {
    window.history.replaceState(null, '', '/#codice/arran-herrys');
    render(<Pagina />);
    expect(document.title).toBe('Arran Herrys · O Códice · Aion');

    abrirVerbete(/^Personagens/, 'Althos Deios');
    expect(document.title).toBe('Althos Deios · O Códice · Aion');

    fireEvent.click(indice().getByRole('button', { name: /^A Capa/ }));
    expect(document.title).toBe('O Códice · Aion');
  });
});

describe('a busca', () => {
  it('só os resultados ficam à vista — os atalhos grandes saem da frente', () => {
    render(<Pagina />);
    expect(indice().getByRole('button', { name: /^O Atlas/ })).toBeTruthy();

    fireEvent.change(busca(), { target: { value: 'beatrix' } });

    expect(indice().queryByRole('button', { name: /^O Atlas/ })).toBeNull();
    expect(indice().getByRole('status').textContent).toMatch(/\d+ verbetes?/);
    expect(indice().getByRole('button', { name: /^Beatrix/ })).toBeTruthy();
  });

  it('o Enter abre o primeiro resultado', () => {
    render(<Pagina />);
    fireEvent.change(busca(), { target: { value: 'beatrix' } });
    fireEvent.keyDown(busca(), { key: 'Enter' });

    expect(document.title).toMatch(/^Beatrix/);
    expect(busca().value).toBe('');
  });

  it('a seta para baixo leva o foco ao primeiro resultado', () => {
    render(<Pagina />);
    fireEvent.change(busca(), { target: { value: 'beatrix' } });
    fireEvent.keyDown(busca(), { key: 'ArrowDown' });

    expect(document.activeElement?.classList.contains('indice__item')).toBe(true);
  });

  it('sem nada achado, diz isso e sugere o que tentar', () => {
    render(<Pagina />);
    fireEvent.change(busca(), { target: { value: 'zzzxqwv' } });

    expect(indice().getByRole('status').textContent).toBe('Nada encontrado');
    expect(indice().getByText(/Tente/)).toBeTruthy();
  });

  it('"/" vai para a busca — e deixa de ir com as teclas soltas desligadas', () => {
    render(<Pagina />);
    fireEvent.keyDown(document.body, { key: '/' });
    expect(document.activeElement).toBe(busca());

    busca().blur();
    act(() => useAionStore.setState({ settings: { ...DEFAULT_SETTINGS, hotkeys: false } }));
    fireEvent.keyDown(document.body, { key: '/' });
    expect(document.activeElement).not.toBe(busca());
  });
});

describe('o Esc desfaz uma coisa por vez', () => {
  it('limpa a busca, solta o campo e só então sai do Códice', () => {
    render(<Pagina />);
    busca().focus();
    fireEvent.change(busca(), { target: { value: 'beatrix' } });

    escapar();
    expect(busca().value).toBe('');
    expect(useAionStore.getState().vista).toBe('codice');

    escapar();
    expect(document.activeElement).not.toBe(busca());
    expect(useAionStore.getState().vista).toBe('codice');

    escapar();
    expect(useAionStore.getState().vista).not.toBe('codice');
  });
});

describe('voltar', () => {
  const lerDoisVerbetes = () => {
    window.history.replaceState(null, '', '/#codice/arran-herrys');
    render(<Pagina />);
    abrirVerbete(/^Personagens/, 'Althos Deios');
  };

  it('a barra de voltar só existe depois de haver para onde voltar, e diz para onde', () => {
    window.history.replaceState(null, '', '/#codice/arran-herrys');
    render(<Pagina />);
    expect(barraDeVoltar()).toBeNull();

    abrirVerbete(/^Personagens/, 'Althos Deios');

    expect(barraDeVoltar()?.textContent).toBe('VoltarArran Herrys');
  });

  it('voltar e avançar andam pela pilha, e o título da aba acompanha', () => {
    lerDoisVerbetes();
    expect(document.title).toBe('Althos Deios · O Códice · Aion');

    fireEvent.click(barraDeVoltar() as HTMLElement);
    expect(document.title).toBe('Arran Herrys · O Códice · Aion');

    fireEvent.click(screen.getByRole('button', { name: 'Avançar' }));
    expect(document.title).toBe('Althos Deios · O Códice · Aion');
  });

  it('a capa é um destino como outro qualquer na pilha', () => {
    window.history.replaceState(null, '', '/#codice/arran-herrys');
    render(<Pagina />);
    fireEvent.click(indice().getByRole('button', { name: /^A Capa/ }));

    expect(barraDeVoltar()?.textContent).toBe('VoltarArran Herrys');

    fireEvent.click(barraDeVoltar() as HTMLElement);
    expect(document.title).toBe('Arran Herrys · O Códice · Aion');
  });

  it('o foco acompanha a leitura quando o link em que se clicou some com a página', () => {
    window.history.replaceState(null, '', '/#codice/arran-herrys');
    render(<Pagina />);
    const leitura = screen.getByRole('main');
    const elo = within(leitura).getAllByRole('button').find((b) => b.className.includes('codice-elo')) as HTMLElement;
    elo.focus();

    fireEvent.click(elo);

    expect(document.activeElement).toBe(leitura);
  });
});

describe('a estrutura da página', () => {
  it('a leitura é o <main>, e a navegação e o cabeçalho têm nome', () => {
    render(<Pagina />);
    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getAllByRole('banner').some((h) => h.classList.contains('codice__topo'))).toBe(true);
    expect(screen.getByRole('navigation', { name: 'Índice do códice' })).toBeTruthy();
  });

  it('o botão do índice declara o que controla e se está aberto', () => {
    render(<Pagina />);
    const alternar = screen.getByRole('button', { name: 'Índice' });

    expect(alternar.getAttribute('aria-expanded')).toBe('false');
    expect(alternar.getAttribute('aria-controls')).toBe('codice-indice');

    fireEvent.click(alternar);
    expect(alternar.getAttribute('aria-expanded')).toBe('true');
  });

  it('a gaveta aberta do celular fecha com o Esc, antes de qualquer saída', () => {
    render(<Pagina />);
    fireEvent.click(screen.getByRole('button', { name: 'Índice' }));
    expect(screen.getByRole('button', { name: 'Índice' }).getAttribute('aria-expanded')).toBe('true');

    escapar();

    expect(screen.getByRole('button', { name: 'Índice' }).getAttribute('aria-expanded')).toBe('false');
    expect(useAionStore.getState().vista).toBe('codice');
  });
});

describe('compartilhar um verbete', () => {
  beforeEach(() => useAvisos.setState({ aviso: null }));
  afterEach(() => vi.unstubAllGlobals());

  it('copia o endereço — que já aponta para o verbete — e confirma num aviso', async () => {
    const escrever = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText: escrever } });
    window.history.replaceState(null, '', '/#codice/arran-herrys');
    render(<Pagina />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Copiar link/ }));
    });

    expect(escrever).toHaveBeenCalledTimes(1);
    expect(escrever.mock.calls[0]?.[0]).toContain('#codice/arran-herrys');
    expect(useAvisos.getState().aviso?.texto).toBe('Link de “Arran Herrys” copiado.');
  });

  it('se o navegador não deixa copiar, diz onde o endereço está', async () => {
    const recusar = vi.fn().mockRejectedValue(new Error('negado'));
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText: recusar } });
    window.history.replaceState(null, '', '/#codice/arran-herrys');
    render(<Pagina />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Copiar link/ }));
    });

    expect(useAvisos.getState().aviso?.texto).toMatch(/barra do navegador/);
  });

  it('a capa não tem link a copiar: não há verbete aberto', () => {
    render(<Pagina />);
    expect(screen.queryByRole('button', { name: /Copiar link/ })).toBeNull();
  });
});
