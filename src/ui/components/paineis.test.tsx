// @vitest-environment jsdom
/**
 * Os painéis da Mesa como quem os usa: o que o botão diz quando não pode agir,
 * o que o ajuste de teclado faz, e o resultado que não some na cara de quem lê.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useAionStore } from '@/state/store';
import { DEFAULT_SETTINGS } from '@/state/seed';
import { useAvisos } from '@/ui/avisos';
import { MacroEditor } from './MacroEditor';
import { MacroPanel } from './MacroPanel';
import { MesaPanel } from './MesaPanel';
import { ResultOverlay } from './ResultOverlay';
import { SettingsPanel } from './SettingsPanel';

const reset = (settings: Partial<typeof DEFAULT_SETTINGS> = {}): void => {
  useAionStore.setState({
    history: [],
    macros: [],
    characters: [],
    activeCharacterId: null,
    settings: { ...DEFAULT_SETTINGS, physics3d: false, sound: false, ...settings },
    input: '',
    inputError: null,
    vista: 'mesa',
    phase: 'ocioso',
    pendingRequest: null,
    pendingExibicao: null,
    lastResult: null,
    lastEntryId: null,
    panel: null,
    mesa: { ...useAionStore.getState().mesa, estado: 'desconectado', codigo: '', erro: null },
  });
  useAvisos.setState({ aviso: null });
};

// A trava contra clique duplo (`remocoes.ts`) lembra a hora da última remoção
// entre os testes; cada um começa num relógio bem à frente do anterior.
let relogio = Date.now();

beforeEach(() => {
  vi.useFakeTimers();
  relogio += 3_600_000;
  vi.setSystemTime(relogio);
  reset();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('a mesa compartilhada', () => {
  const entrar = () => screen.getByRole('button', { name: 'Entrar na mesa' });
  const codigo = () => screen.getByRole('textbox', { name: 'Código da sala' }) as HTMLInputElement;

  it('"Entrar" sem código leva ao campo e diz o que escrever, em vez de ficar mudo', () => {
    render(<MesaPanel />);
    expect(entrar().getAttribute('aria-disabled')).toBe('true');
    expect((entrar() as HTMLButtonElement).disabled).toBe(false);
    expect(screen.queryByRole('alert')).toBeNull();

    fireEvent.click(entrar());

    expect(screen.getByRole('alert').textContent).toMatch(/código da sala/i);
    expect(document.activeElement).toBe(codigo());
    expect(codigo().getAttribute('aria-invalid')).toBe('true');
    expect(useAionStore.getState().mesa.estado).toBe('desconectado');
  });

  it('o aviso some assim que a pessoa começa a escrever', () => {
    render(<MesaPanel />);
    fireEvent.click(entrar());
    fireEvent.change(codigo(), { target: { value: 'XK' } });

    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('o estado da conexão é anunciado, não só pintado', () => {
    render(<MesaPanel />);
    expect(screen.getByRole('status').textContent).toBe('Fora da mesa');
  });

  it('o texto longo sobre o relay fica recolhido até alguém pedir', () => {
    render(<MesaPanel />);
    const ajuda = screen.getByText('Como achar o endereço do relay?').closest('details') as HTMLDetailsElement;
    expect(ajuda.open).toBe(false);
  });
});

describe('o ajuste das teclas soltas', () => {
  it('liga e desliga, e o estado vai para o store', () => {
    render(<SettingsPanel />);
    const interruptor = screen.getByRole('switch', { name: /Atalhos de uma tecla/ });
    expect(interruptor.getAttribute('aria-checked')).toBe('true');

    fireEvent.click(interruptor);

    expect(useAionStore.getState().settings.hotkeys).toBe(false);
    expect(screen.getByRole('switch', { name: /Atalhos de uma tecla/ }).getAttribute('aria-checked')).toBe('false');
  });

  it('a lista de teclas vem recolhida onde não há mouse, a um toque de distância', () => {
    // O jsdom não tem `matchMedia`: é o caso "sem ponteiro que paire".
    render(<SettingsPanel />);
    const detalhes = screen.getByText('Ver todas as teclas').closest('details') as HTMLDetailsElement;

    expect(detalhes.open).toBe(false);
  });

  it('mostra a lista de teclas inteira, agrupada, logo abaixo', () => {
    render(<SettingsPanel />);
    expect(screen.getByRole('heading', { name: 'Na Mesa' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'No Códice' })).toBeTruthy();
    expect(screen.getByText('Repete a última rolagem')).toBeTruthy();
  });

  it('remover um personagem avisa e deixa desfazer', () => {
    useAionStore.getState().addCharacter('Aldric', 'ambar');
    render(<SettingsPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Remover Aldric' }));
    expect(useAionStore.getState().characters).toHaveLength(0);
    expect(useAvisos.getState().aviso?.texto).toBe('Personagem “Aldric” removido.');

    act(() => {
      useAvisos.getState().desfazerUltimo();
    });
    expect(useAionStore.getState().characters.map((c) => c.name)).toEqual(['Aldric']);
  });

  it('limpar o histórico não pede confirmação: age e deixa desfazer', () => {
    useAionStore.getState().rollExpression('1d6');
    render(<SettingsPanel />);

    fireEvent.click(screen.getByRole('button', { name: /Limpar histórico/ }));

    expect(useAionStore.getState().history).toHaveLength(0);
    expect(useAvisos.getState().aviso?.desfazer).toBeTypeOf('function');
  });
});

describe('a lista de atalhos', () => {
  it('sem personagem ativo, cada atalho da mesa aparece uma vez só', () => {
    useAionStore.getState().addMacro({ name: 'Ataque', expression: '1d20', glyph: '⚔️', characterId: null });
    render(<MacroPanel />);

    expect(screen.getAllByRole('button', { name: 'Remover Ataque' })).toHaveLength(1);
  });

  it('com personagem ativo, os dele ficam numa seção e os da mesa em outra', () => {
    useAionStore.getState().addCharacter('Aldric', 'ambar');
    const aldric = useAionStore.getState().characters[0]?.id ?? null;
    useAionStore.getState().addMacro({ name: 'Golpe', expression: '1d20', glyph: '⚔️', characterId: aldric });
    useAionStore.getState().addMacro({ name: 'Iniciativa', expression: '1d20', glyph: '⚡', characterId: null });
    render(<MacroPanel />);

    expect(screen.getByRole('heading', { name: 'Aldric' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Da mesa' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Remover Golpe' })).toHaveLength(1);
    expect(screen.getAllByRole('button', { name: 'Remover Iniciativa' })).toHaveLength(1);
  });
});

describe('o editor de atalho', () => {
  const dois = () => {
    useAionStore.getState().addMacro({ name: 'Ataque', expression: '1d20', glyph: '⚔️', characterId: null });
    useAionStore.getState().addMacro({ name: 'Dano', expression: '1d8', glyph: '🩸', characterId: null });
    return useAionStore.getState().macros;
  };

  it('um atalho novo não tem posição a mudar', () => {
    render(<MacroEditor macro={null} onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: /Subir/ })).toBeNull();
  });

  it('subir e descer moram aqui — no celular o cartão só tem editar e remover', () => {
    const [ataque, dano] = dois();
    render(<MacroEditor macro={dano ?? null} onClose={() => {}} />);

    expect((screen.getByRole('button', { name: /Descer/ }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Subir/ }));

    const ordem = [...useAionStore.getState().macros].sort((a, b) => a.order - b.order).map((m) => m.id);
    expect(ordem).toEqual([dano?.id, ataque?.id]);
  });

  it('o primeiro da lista não sobe', () => {
    const [ataque] = dois();
    render(<MacroEditor macro={ataque ?? null} onClose={() => {}} />);
    expect((screen.getByRole('button', { name: /Subir/ }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('é um diálogo de verdade: foco dentro e Esc na pilha', () => {
    const [ataque] = dois();
    const onClose = vi.fn();
    render(<MacroEditor macro={ataque ?? null} onClose={onClose} />);

    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
  });
});

describe('o resultado na mesa', () => {
  it('a região de leitura já existe antes da primeira rolagem — senão ela passa calada', () => {
    render(<ResultOverlay />);
    const regiao = screen.getByRole('status');
    expect(regiao.textContent).toBe('');

    act(() => {
      useAionStore.getState().rollExpression('1d6');
    });

    // É a MESMA região, agora com texto: é isso que o leitor de tela anuncia.
    expect(screen.getByRole('status')).toBe(regiao);
    expect(regiao.textContent).toMatch(/1d6: \d/);
  });

  const rolar = (expr = '1d6') => {
    act(() => {
      useAionStore.getState().rollExpression(expr);
    });
  };

  it('tem um botão de dispensar, e dispensar o tira da tela', () => {
    render(<ResultOverlay />);
    rolar();
    const fechar = screen.getByRole('button', { name: 'Dispensar o resultado' });

    fireEvent.click(fechar);

    expect(screen.queryByRole('button', { name: 'Dispensar o resultado' })).toBeNull();
  });

  it('some sozinho, mas não com o ponteiro em cima', () => {
    const { container } = render(<ResultOverlay />);
    rolar();
    const painel = container.querySelector('.resultado__painel') as HTMLElement;

    fireEvent.pointerEnter(painel);
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(container.querySelector('.resultado__painel')).not.toBeNull();

    fireEvent.pointerLeave(painel);
    act(() => {
      vi.advanceTimersByTime(7500);
    });
    expect(container.querySelector('.resultado__painel')).toBeNull();
  });

  it('a rolagem oculta do mestre espera o "Revelar" — não some antes de a pessoa decidir', () => {
    reset({ gmMode: true });
    const { container } = render(<ResultOverlay />);
    rolar();

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(container.querySelector('.resultado__painel')).not.toBeNull();

    // O "Revelar" é um botão de verdade, não um span com role.
    const revelar = screen.getByRole('button', { name: 'Revelar' });
    expect(revelar.tagName).toBe('BUTTON');

    fireEvent.click(revelar);
    expect(useAionStore.getState().history[0]?.hidden).toBe(false);
  });

  it('não há botão dentro de botão', () => {
    reset({ gmMode: true });
    const { container } = render(<ResultOverlay />);
    rolar();

    expect(container.querySelector('button button')).toBeNull();
  });
});
