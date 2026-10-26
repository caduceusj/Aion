import { useEffect, type RefObject } from 'react';
import { useCamada } from '@/ui/camadas';

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function visivel(elemento: HTMLElement): boolean {
  // `offsetParent` é null para o que está escondido — exceto em `position:
  // fixed`, que o chamador raramente põe dentro de um diálogo.
  return elemento.offsetParent !== null || elemento === document.activeElement;
}

/**
 * O que todo diálogo modal deve a quem navega pelo teclado.
 *
 * - Esc fecha **só ele**, pela pilha de camadas (e não a tela atrás).
 * - Tab e Shift+Tab giram dentro dele em vez de escapar para a página.
 * - Ao fechar, o foco volta ao botão que o abriu. Sem isso o foco cai no
 *   `<body>` e quem usa teclado recomeça a tabulação do topo da página.
 *   (O Safari não foca botões ao clicar; quem precisar desse retorno também
 *   com o mouse devolve o foco por conta própria.)
 *
 * Quem chama decide onde o foco entra (`autoFocus`, ou um `ref.focus()` num
 * efeito próprio): aqui só se guarda de onde ele veio.
 */
export function useDialogo(ref: RefObject<HTMLElement | null>, aoFechar: () => void): void {
  useCamada(true, aoFechar);

  useEffect(() => {
    const origem = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      // Quando o diálogo some com o foco dentro dele, o navegador o larga no
      // <body>. Se alguém já o levou a outro lugar (ao escolher um item, por
      // exemplo), esse destino vale mais que a volta.
      const solto = !document.activeElement || document.activeElement === document.body;
      if (solto && origem && origem !== document.body && origem.isConnected) origem.focus();
    };
  }, []);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return undefined;

    const aoTeclar = (evento: KeyboardEvent): void => {
      if (evento.key !== 'Tab') return;

      const focaveis = [...raiz.querySelectorAll<HTMLElement>(FOCAVEIS)].filter(visivel);
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (!primeiro || !ultimo) {
        evento.preventDefault();
        return;
      }

      const ativo = document.activeElement;
      if (evento.shiftKey && (ativo === primeiro || ativo === raiz)) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && ativo === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    raiz.addEventListener('keydown', aoTeclar);
    return () => raiz.removeEventListener('keydown', aoTeclar);
  }, [ref]);
}
