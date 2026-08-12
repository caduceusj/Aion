import { useEffect, useMemo, useRef } from 'react';
import { NOTATION_HELP, type NotationHelpEntry } from '@/engine';
import { useAionStore } from '@/state/store';
import { IconFechar } from './Icons';
import '@/ui/styles/notation-help.css';

const GROUP_ORDER: Array<NotationHelpEntry['group']> = [
  'Daggerheart',
  'Básico',
  'Manter e descartar',
  'Explodir e rerrolar',
  'Pools de sucesso',
];

export function NotationHelp({ onClose }: { onClose: () => void }) {
  const setInput = useAionStore((state) => state.setInput);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const grouped = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      group,
      entries: NOTATION_HELP.filter((entry) => entry.group === group),
    })).filter((section) => section.entries.length > 0);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="ajuda-fundo"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="ajuda"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ajuda-titulo"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="ajuda__topo">
          <div>
            <h2 className="ajuda__titulo" id="ajuda-titulo">
              Como escrever uma rolagem
            </h2>
            <p className="ajuda__sub">Toque em qualquer linha para usar no campo.</p>
          </div>
          <button
            type="button"
            className="ajuda__fechar"
            onClick={onClose}
            aria-label="Fechar a referência"
          >
            <IconFechar size={20} />
          </button>
        </header>

        <div className="ajuda__corpo">
          {grouped.map((section) => (
            <section className="ajuda__secao" key={section.group}>
              <h3 className="rotulo ajuda__grupo">{section.group}</h3>
              <ul className="ajuda__lista">
                {section.entries.map((entry) => (
                  <li key={entry.syntax}>
                    <button
                      type="button"
                      className="ajuda__linha"
                      onClick={() => {
                        setInput(entry.syntax);
                        onClose();
                      }}
                    >
                      <code className="ajuda__sintaxe mono">{entry.syntax}</code>
                      <span className="ajuda__descricao">{entry.label}</span>
                      <span className="ajuda__exemplo">{entry.example}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
