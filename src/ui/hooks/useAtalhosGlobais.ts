import { useEffect, useRef } from 'react';
import type { PolyhedronKind } from '@/engine/types';
import { useAionStore } from '@/state/store';
import { fecharTopo, haCamadas } from '@/ui/camadas';
import { useAvisos } from '@/ui/avisos';

export const DADOS_POR_TECLA: Readonly<Record<string, PolyhedronKind>> = {
  '1': 'd4',
  '2': 'd6',
  '3': 'd8',
  '4': 'd10',
  '5': 'd12',
  '6': 'd20',
  '7': 'd100',
  '8': 'dF',
};

/** `<input>` que não recebe texto: o Esc não precisa "sair" de um slider. */
const INPUT_SEM_TEXTO = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

/** Onde se digita — o que o Esc solta antes de navegar. */
export function ehCampoDeTexto(alvo: EventTarget | null): alvo is HTMLElement {
  if (!(alvo instanceof HTMLElement)) return false;
  if (alvo.isContentEditable || alvo.tagName === 'TEXTAREA') return true;
  return alvo.tagName === 'INPUT' && !INPUT_SEM_TEXTO.has((alvo as HTMLInputElement).type);
}

/** O que consome as teclas de letra por conta própria (digitar, escolher por inicial). */
function consomeLetras(alvo: EventTarget | null): boolean {
  if (!(alvo instanceof HTMLElement)) return false;
  return (
    alvo.isContentEditable ||
    alvo.tagName === 'INPUT' ||
    alvo.tagName === 'TEXTAREA' ||
    alvo.tagName === 'SELECT'
  );
}

/** O que Enter e Espaço já ativam: tomar o Enter daqui quebraria o teclado. */
function ehAtivavel(alvo: EventTarget | null): boolean {
  return (
    alvo instanceof HTMLElement &&
    alvo.closest(
      'a[href], button, summary, select, input, textarea, [role="button"], [role="tab"], [role="switch"], [role="link"], [role="menuitem"], [role="slider"]',
    ) !== null
  );
}

/**
 * Todo o teclado global do app, num lugar só.
 *
 * A ordem do Esc é a parte que importa e é por degraus: a camada aberta
 * (ajuda, editor, gaveta do índice) → o campo de texto em foco → a
 * navegação (sair do Códice, fechar o painel, voltar ao menu). Cada Esc
 * desfaz uma coisa, nunca duas.
 *
 * As teclas soltas (letras, números, vírgula) obedecem ao ajuste `hotkeys`:
 * quem dita texto ou usa leitor de voz não pode ter o app rolando dados a
 * cada palavra. O Esc não é tecla solta de caractere e vale sempre.
 */
export function tratarTecla(evento: KeyboardEvent, aoPedirAjuda: () => void): void {
  if (evento.isComposing) return;

  const store = useAionStore.getState();
  const alvo = evento.target;

  if (evento.key === 'Escape') {
    evento.preventDefault();
    if (fecharTopo()) return;
    if (ehCampoDeTexto(alvo)) {
      alvo.blur();
      return;
    }
    if (store.vista === 'codice') store.sairDoCodice();
    else if (store.panel !== null) store.setPanel(null);
    else if (store.vista === 'mesa') store.irPara('menu');
    return;
  }

  // Desfazer a última remoção. Combina modificador, então não é tecla solta e
  // vale mesmo com os atalhos desligados; num campo de texto o desfazer é do
  // próprio campo.
  if ((evento.ctrlKey || evento.metaKey) && !evento.altKey && !evento.shiftKey && evento.key.toLowerCase() === 'z') {
    if (!consomeLetras(alvo) && useAvisos.getState().desfazerUltimo()) evento.preventDefault();
    return;
  }

  if (!store.settings.hotkeys) return;
  if (evento.metaKey || evento.ctrlKey || evento.altKey) return;
  // Segurar a tecla não pode rolar vinte vezes nem piscar um painel.
  if (evento.repeat) return;
  // Com um diálogo aberto, o que está por trás dele não responde.
  if (haCamadas()) return;

  // Enter só é nosso quando nada o quer: num botão, ele é o clique.
  if (evento.key === 'Enter') {
    if (store.vista === 'mesa' && !ehAtivavel(alvo)) {
      evento.preventDefault();
      window.dispatchEvent(new Event('aion:focar-notacao'));
    }
    return;
  }

  if (consomeLetras(alvo)) return;

  if (evento.key === '?') {
    evento.preventDefault();
    aoPedirAjuda();
    return;
  }

  const tecla = evento.key.toLowerCase();

  // O Códice abre e fecha pela mesma tecla, de qualquer vista — por isso
  // vem antes da guarda logo abaixo.
  if (tecla === 'c') {
    evento.preventDefault();
    if (store.vista === 'codice') store.sairDoCodice();
    else store.irPara('codice');
    return;
  }

  // Fora da mesa as letras são para ler e buscar; rolar dados por baixo
  // do que está sendo lido seria só barulho.
  if (store.vista !== 'mesa') return;

  const dado = DADOS_POR_TECLA[evento.key];
  if (dado) {
    evento.preventDefault();
    store.rollQuick(dado);
    return;
  }

  switch (tecla) {
    case 'r':
      evento.preventDefault();
      store.repeatLast();
      break;
    case 'v':
      evento.preventDefault();
      store.rollAdvantage('vantagem');
      break;
    case 'd':
      evento.preventDefault();
      store.rollAdvantage('desvantagem');
      break;
    case 'h':
      evento.preventDefault();
      store.setPanel(store.panel === 'historico' ? null : 'historico');
      break;
    case 'a':
      evento.preventDefault();
      store.setPanel(store.panel === 'atalhos' ? null : 'atalhos');
      break;
    case 'f':
      evento.preventDefault();
      store.setPanel(store.panel === 'ficha' ? null : 'ficha');
      break;
    case 'm':
      evento.preventDefault();
      store.setPanel(store.panel === 'mesa' ? null : 'mesa');
      break;
    case ',':
      evento.preventDefault();
      store.setPanel('ajustes');
      break;
    default:
      break;
  }
}

/** Liga o teclado global enquanto o App está montado. */
export function useAtalhosGlobais(aoPedirAjuda: () => void): void {
  const ultima = useRef(aoPedirAjuda);
  ultima.current = aoPedirAjuda;

  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent): void => tratarTecla(evento, () => ultima.current());
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, []);
}
