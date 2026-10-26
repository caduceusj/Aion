// @vitest-environment jsdom
/**
 * O Atlas no dedo: pinça para ampliar, um toque para ler e outro para abrir,
 * e a página que continua rolando quando o mapa não está ampliado.
 *
 * O mouse não perde nada: parar sobre o ponto mostra o que é e clicar abre.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CodexAtlas } from './CodexAtlas';

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/** Um evento de ponteiro com os campos que o jsdom não monta sozinho. */
function ponteiro(
  alvo: Element,
  tipo: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointerover' | 'pointerout',
  campos: { id?: number; tipo?: string; x?: number; y?: number },
): void {
  // O React não escuta `pointerenter`/`pointerleave`: ele os monta a partir de
  // `pointerover`/`pointerout`, que são os eventos que se disparam aqui.
  const evento = new Event(tipo, { bubbles: true, cancelable: true });
  Object.assign(evento, {
    pointerId: campos.id ?? 1,
    pointerType: campos.tipo ?? 'mouse',
    clientX: campos.x ?? 0,
    clientY: campos.y ?? 0,
    button: 0,
  });
  fireEvent(alvo, evento);
}

const moldura = () => document.querySelector('.atlas__moldura') as HTMLElement;
const nivel = () => screen.getByText(/^\d+%$/).textContent;
const marcador = () => document.querySelector('.atlas__ponto:not(:disabled)') as HTMLElement;

describe('a pinça', () => {
  it('dois dedos que se afastam ampliam o mapa', () => {
    render(<CodexAtlas aoNavegar={() => {}} />);
    expect(nivel()).toBe('100%');

    ponteiro(moldura(), 'pointerdown', { id: 1, tipo: 'touch', x: 100, y: 200 });
    ponteiro(moldura(), 'pointerdown', { id: 2, tipo: 'touch', x: 200, y: 200 });
    ponteiro(moldura(), 'pointermove', { id: 2, tipo: 'touch', x: 300, y: 200 });

    // A distância foi de 100 para 200: o dobro.
    expect(nivel()).toBe('200%');
  });

  it('dois dedos que se aproximam afastam, e nunca abaixo do mapa inteiro', () => {
    render(<CodexAtlas aoNavegar={() => {}} />);

    ponteiro(moldura(), 'pointerdown', { id: 1, tipo: 'touch', x: 100, y: 200 });
    ponteiro(moldura(), 'pointerdown', { id: 2, tipo: 'touch', x: 300, y: 200 });
    ponteiro(moldura(), 'pointermove', { id: 2, tipo: 'touch', x: 150, y: 200 });

    expect(nivel()).toBe('100%');
  });

  it('um dedo só arrasta: não amplia', () => {
    render(<CodexAtlas aoNavegar={() => {}} />);

    ponteiro(moldura(), 'pointerdown', { id: 1, tipo: 'touch', x: 100, y: 200 });
    ponteiro(moldura(), 'pointermove', { id: 1, tipo: 'touch', x: 160, y: 260 });

    expect(nivel()).toBe('100%');
  });

  it('levantar os dedos encerra a pinça — o próximo movimento não amplia', () => {
    render(<CodexAtlas aoNavegar={() => {}} />);

    ponteiro(moldura(), 'pointerdown', { id: 1, tipo: 'touch', x: 100, y: 200 });
    ponteiro(moldura(), 'pointerdown', { id: 2, tipo: 'touch', x: 200, y: 200 });
    ponteiro(moldura(), 'pointerup', { id: 2, tipo: 'touch' });
    ponteiro(moldura(), 'pointermove', { id: 1, tipo: 'touch', x: 400, y: 200 });

    expect(nivel()).toBe('100%');
  });
});

describe('o toque num marcador', () => {
  it('o primeiro toque mostra o que é; só o segundo abre o verbete', () => {
    const navegar = vi.fn();
    render(<CodexAtlas aoNavegar={navegar} />);
    const ponto = marcador();

    ponteiro(ponto, 'pointerdown', { tipo: 'touch' });
    fireEvent.click(ponto, { detail: 1 });

    expect(navegar).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: /Abrir o verbete/ })).toBeTruthy();
    expect(ponto.getAttribute('data-escolhido')).toBe('sim');

    ponteiro(ponto, 'pointerdown', { tipo: 'touch' });
    fireEvent.click(ponto, { detail: 1 });

    expect(navegar).toHaveBeenCalledTimes(1);
  });

  it('a escolha fica depois que o dedo sai: o toque não "paira"', () => {
    render(<CodexAtlas aoNavegar={() => {}} />);
    const ponto = marcador();

    ponteiro(ponto, 'pointerdown', { tipo: 'touch' });
    ponteiro(ponto, 'pointerover', { tipo: 'touch' });
    fireEvent.click(ponto, { detail: 1 });
    ponteiro(ponto, 'pointerout', { tipo: 'touch' });

    expect(screen.getByRole('link', { name: /Abrir o verbete/ })).toBeTruthy();
  });

  it('o mouse não muda: clicar abre direto', () => {
    const navegar = vi.fn();
    render(<CodexAtlas aoNavegar={navegar} />);
    const ponto = marcador();

    ponteiro(ponto, 'pointerdown', { tipo: 'mouse' });
    fireEvent.click(ponto, { detail: 1 });

    expect(navegar).toHaveBeenCalledTimes(1);
  });

  it('parar o mouse sobre o ponto mostra o que é, sem clicar', () => {
    render(<CodexAtlas aoNavegar={() => {}} />);

    ponteiro(marcador(), 'pointerover', { tipo: 'mouse' });

    expect(screen.getByRole('link', { name: /Abrir o verbete/ })).toBeTruthy();
  });

  it('o teclado abre direto mesmo depois de um toque — o clique dele não tem coordenadas', () => {
    const navegar = vi.fn();
    render(<CodexAtlas aoNavegar={navegar} />);
    const ponto = marcador();

    ponteiro(ponto, 'pointerdown', { tipo: 'touch' });
    fireEvent.click(ponto, { detail: 0 });

    expect(navegar).toHaveBeenCalledTimes(1);
  });
});

describe('o texto diz o que serve a cada ponteiro', () => {
  it('guarda as duas versões — o CSS mostra a do dedo ou a do mouse', () => {
    render(<CodexAtlas aoNavegar={() => {}} />);

    expect(document.querySelector('.gazeta__vazio .so-mouse')?.textContent).toMatch(/Passe sobre/);
    expect(document.querySelector('.gazeta__vazio .so-toque')?.textContent).toMatch(/Toque num ponto/);
    expect(document.querySelector('.atlas__nota .so-toque')?.textContent).toMatch(/dois dedos/);
  });
});
