import { useEffect, useRef } from 'react';
import { useAionStore } from '@/state/store';
import { atalhosDa } from '@/ui/atalhos';
import { useDialogo } from '@/ui/hooks/useDialogo';
import { IconFechar } from './Icons';
import { ListaDeAtalhos } from './ListaDeAtalhos';
import '@/ui/styles/notation-help.css';

/**
 * A folha de atalhos que o `?` abre, de qualquer tela.
 *
 * Mostra primeiro o que vale na tela em que a pessoa está — na Mesa, as
 * teclas dos dados; no Códice, a busca e o histórico — e depois o resto.
 */
export function AtalhosDeTeclado({
  vista,
  aoFechar,
}: {
  vista: 'menu' | 'mesa' | 'codice';
  aoFechar: () => void;
}) {
  const hotkeys = useAionStore((state) => state.settings.hotkeys);
  const raiz = useRef<HTMLDivElement | null>(null);

  useDialogo(raiz, aoFechar);
  useEffect(() => {
    raiz.current?.focus();
  }, []);

  return (
    <div className="ajuda-fundo" onClick={aoFechar} role="presentation">
      <div
        className="ajuda ajuda--estreita"
        ref={raiz}
        role="dialog"
        aria-modal="true"
        aria-labelledby="teclado-titulo"
        tabIndex={-1}
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="ajuda__topo">
          <div>
            <h2 className="ajuda__titulo" id="teclado-titulo">
              Atalhos de teclado
            </h2>
            <p className="ajuda__sub">
              {hotkeys
                ? 'Teclas soltas ligadas. Dá para desligá-las em Ajustes.'
                : 'As teclas soltas estão desligadas em Ajustes.'}
            </p>
          </div>
          <button
            type="button"
            className="ajuda__fechar"
            onClick={aoFechar}
            aria-label="Fechar a lista de atalhos"
          >
            <IconFechar size={20} />
          </button>
        </header>

        <div className="ajuda__corpo">
          <ListaDeAtalhos grupos={atalhosDa(vista)} nivel={3} />
        </div>
      </div>
    </div>
  );
}
