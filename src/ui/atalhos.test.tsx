// @vitest-environment jsdom
/**
 * O teclado do app como quem navega por ele o usa.
 *
 * Cada caso aqui é um defeito que existiu: o Esc que fechava a ajuda *e* saía
 * da Mesa, o Enter que tomava o clique de qualquer botão, as teclas soltas
 * que não tinham como ser desligadas. E há o contrato da lista — tudo o que
 * `ATALHOS` promete na tela tem de responder de verdade.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import { empilhar } from '@/ui/camadas';
import { useAvisos } from '@/ui/avisos';
import { useAtalhosGlobais } from '@/ui/hooks/useAtalhosGlobais';
import { ATALHOS, atalhosDa } from '@/ui/atalhos';

const reset = (hotkeys = true): void => {
  useAionStore.setState({
    history: [],
    macros: [],
    characters: [],
    activeCharacterId: null,
    settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false, hotkeys },
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
  useAvisos.setState({ aviso: null });
};

/** Liga o teclado global do mesmo jeito que o App liga. */
function Teclado({ aoPedirAjuda }: { aoPedirAjuda: () => void }) {
  useAtalhosGlobais(aoPedirAjuda);
  return (
    <div>
      <button type="button">um botão</button>
      <input aria-label="um campo" />
      <select aria-label="uma lista">
        <option>a</option>
      </select>
    </div>
  );
}

const abrir = (aoPedirAjuda = vi.fn()) => {
  const tela = render(<Teclado aoPedirAjuda={aoPedirAjuda} />);
  return { ...tela, aoPedirAjuda };
};

const tecla = (key: string, init: KeyboardEventInit = {}, alvo: Element = document.body): boolean =>
  fireEvent.keyDown(alvo, { key, bubbles: true, cancelable: true, ...init });

const vista = () => useAionStore.getState().vista;
const painel = () => useAionStore.getState().panel;
const rolagens = () => useAionStore.getState().history.length;

beforeEach(() => reset());
afterEach(cleanup);

describe('o Esc, um degrau por vez', () => {
  it('fecha a camada aberta e não sai da Mesa', () => {
    abrir();
    const fechar = vi.fn();
    const retirar = empilhar(fechar);

    tecla('Escape');
    retirar();

    expect(fechar).toHaveBeenCalledTimes(1);
    expect(vista()).toBe('mesa');
  });

  it('com duas camadas, fecha a de cima primeiro', () => {
    abrir();
    const ajuda = vi.fn();
    const editor = vi.fn();
    const r1 = empilhar(ajuda);
    const r2 = empilhar(editor);

    tecla('Escape');
    r1();
    r2();

    expect(editor).toHaveBeenCalledTimes(1);
    expect(ajuda).not.toHaveBeenCalled();
  });

  it('num campo de texto, só solta o campo — a Mesa fica', () => {
    const { getByLabelText } = abrir();
    const campo = getByLabelText('um campo');
    campo.focus();
    expect(document.activeElement).toBe(campo);

    tecla('Escape', {}, campo);

    expect(document.activeElement).not.toBe(campo);
    expect(vista()).toBe('mesa');
  });

  it('sem camada nem campo, fecha o painel; depois, volta ao menu', () => {
    abrir();
    useAionStore.getState().setPanel('historico');

    tecla('Escape');
    expect(painel()).toBeNull();
    expect(vista()).toBe('mesa');

    tecla('Escape');
    expect(vista()).toBe('menu');
  });

  it('funciona mesmo com as teclas soltas desligadas', () => {
    reset(false);
    abrir();
    useAionStore.getState().setPanel('ajustes');

    tecla('Escape');

    expect(painel()).toBeNull();
  });
});

describe('o Enter pertence a quem o quer', () => {
  it('não tira o clique de um botão focado', () => {
    const { getByRole } = abrir();
    const botao = getByRole('button', { name: 'um botão' });

    const naoCancelado = tecla('Enter', {}, botao);

    expect(naoCancelado).toBe(true);
  });

  it('sem nada focado, leva ao campo de rolagem', () => {
    abrir();
    const ouvinte = vi.fn();
    window.addEventListener('aion:focar-notacao', ouvinte);

    const naoCancelado = tecla('Enter');
    window.removeEventListener('aion:focar-notacao', ouvinte);

    expect(ouvinte).toHaveBeenCalledTimes(1);
    expect(naoCancelado).toBe(false);
  });
});

describe('as teclas soltas', () => {
  it('rolam os dados quando ligadas', () => {
    abrir();
    tecla('6');
    expect(rolagens()).toBe(1);
  });

  it('não fazem nada quando desligadas em Ajustes', () => {
    reset(false);
    abrir();

    for (const k of ['1', '6', 'r', 'v', 'd', 'h', 'f', ',', 'c', '?']) tecla(k);

    expect(rolagens()).toBe(0);
    expect(painel()).toBeNull();
    expect(vista()).toBe('mesa');
  });

  it('não disparam enquanto se digita', () => {
    const { getByLabelText } = abrir();
    tecla('6', {}, getByLabelText('um campo'));
    tecla('h', {}, getByLabelText('uma lista'));

    expect(rolagens()).toBe(0);
    expect(painel()).toBeNull();
  });

  it('não disparam com um diálogo aberto por cima', () => {
    abrir();
    const retirar = empilhar(() => {});

    tecla('6');
    tecla('h');
    retirar();

    expect(rolagens()).toBe(0);
    expect(painel()).toBeNull();
  });

  it('segurar a tecla não rola vinte vezes', () => {
    abrir();
    tecla('6');
    tecla('6', { repeat: true });
    tecla('6', { repeat: true });

    expect(rolagens()).toBe(1);
  });

  it('com Ctrl ou Alt são do navegador, não nossas', () => {
    abrir();
    tecla('6', { ctrlKey: true });
    tecla('h', { altKey: true });

    expect(rolagens()).toBe(0);
    expect(painel()).toBeNull();
  });

  it('fora da Mesa, só o C e o ? valem', () => {
    useAionStore.setState({ vista: 'menu' });
    const { aoPedirAjuda } = abrir();

    tecla('6');
    expect(rolagens()).toBe(0);

    tecla('?');
    expect(aoPedirAjuda).toHaveBeenCalledTimes(1);

    tecla('c');
    expect(vista()).toBe('codice');
  });
});

describe('Ctrl+Z desfaz a última remoção', () => {
  it('chama o desfazer do aviso, mesmo com as teclas soltas desligadas', () => {
    reset(false);
    abrir();
    const desfazer = vi.fn();
    useAvisos.getState().avisar('Ficha removida.', desfazer);

    tecla('z', { ctrlKey: true });

    expect(desfazer).toHaveBeenCalledTimes(1);
    expect(useAvisos.getState().aviso).toBeNull();
  });

  it('num campo de texto, o desfazer é do próprio campo', () => {
    const { getByLabelText } = abrir();
    const desfazer = vi.fn();
    useAvisos.getState().avisar('Ficha removida.', desfazer);

    tecla('z', { ctrlKey: true }, getByLabelText('um campo'));

    expect(desfazer).not.toHaveBeenCalled();
  });

  it('sem aviso, não toma o atalho do navegador', () => {
    abrir();
    const naoCancelado = tecla('z', { ctrlKey: true });
    expect(naoCancelado).toBe(true);
  });
});

describe('a lista promete só o que o teclado cumpre', () => {
  it('cada tecla da Mesa responde', () => {
    const { aoPedirAjuda } = abrir();

    for (const k of ['1', '2', '3', '4', '5', '6', '7', '8']) tecla(k);
    expect(rolagens()).toBe(8);

    tecla('r');
    tecla('v');
    tecla('d');
    expect(rolagens()).toBe(11);

    for (const [k, id] of [
      ['h', 'historico'],
      ['a', 'atalhos'],
      ['f', 'ficha'],
      ['m', 'mesa'],
    ] as const) {
      tecla(k);
      expect(painel()).toBe(id);
      tecla(k);
      expect(painel()).toBeNull();
    }

    tecla(',');
    expect(painel()).toBe('ajustes');

    tecla('?');
    expect(aoPedirAjuda).toHaveBeenCalledTimes(1);

    tecla('c');
    expect(vista()).toBe('codice');
    tecla('c');
    expect(vista()).toBe('mesa');
  });

  it('a folha mostra primeiro as teclas da tela em que se está', () => {
    expect(atalhosDa('mesa')[0]?.id).toBe('mesa');
    expect(atalhosDa('codice')[0]?.id).toBe('codice');
    // No menu não há grupo próprio: o geral abre a lista.
    expect(atalhosDa('menu')[0]?.id).toBe('geral');
    // E nenhum grupo some, só muda de lugar.
    expect(atalhosDa('mesa').map((g) => g.id).sort()).toEqual(ATALHOS.map((g) => g.id).sort());
  });
});
