import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { enderecoDaPagina } from './enderecos';

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  /** A página de destino; `null` é a capa do Códice. */
  chave: string | null;
  aoNavegar: (chave: string | null) => void;
  children: ReactNode;
}

/**
 * Um link do Códice, que é um link.
 *
 * Eram botões. Para quem lê numa crônica de 176 verbetes, isso custava o que um
 * link dá de graça: abrir numa aba nova (Ctrl/Cmd+clique, botão do meio),
 * copiar o endereço pelo menu de contexto ou pelo toque longo no celular, e
 * aparecer como "link" — e não como "botão" — na lista de links do leitor de
 * tela. O clique comum continua dentro do app, pela pilha de navegação, sem
 * recarregar nada; os cliques com tecla modificadora vão para o navegador, e o
 * endereço (`#codice/<chave>`) abre o Códice no verbete certo.
 */
export function LinkDeVerbete({ chave, aoNavegar, children, ...resto }: Props) {
  const aoClicar = (evento: MouseEvent<HTMLAnchorElement>): void => {
    if (
      evento.defaultPrevented ||
      evento.button !== 0 ||
      evento.metaKey ||
      evento.ctrlKey ||
      evento.shiftKey ||
      evento.altKey
    ) {
      return;
    }
    evento.preventDefault();
    aoNavegar(chave);
  };

  return (
    <a {...resto} href={enderecoDaPagina(chave)} onClick={aoClicar}>
      {children}
    </a>
  );
}
