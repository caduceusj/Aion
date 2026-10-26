import { useEffect, useMemo, useRef } from 'react';
import { NOTATION_HELP, type NotationHelpEntry } from '@/engine';
import { useDialogo } from '@/ui/hooks/useDialogo';
import { IconFechar } from './Icons';
import '@/ui/styles/notation-help.css';

const GROUP_ORDER: Array<NotationHelpEntry['group']> = [
  'Daggerheart',
  'Básico',
  'Manter e descartar',
  'Explodir e rerrolar',
  'Pools de sucesso',
];

export function NotationHelp({
  onClose,
  onPick,
}: {
  onClose: () => void;
  /** Uma linha foi escolhida: quem abriu a ajuda põe a sintaxe no campo. */
  onPick: (syntax: string) => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const grouped = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      group,
      entries: NOTATION_HELP.filter((entry) => entry.group === group),
    })).filter((section) => section.entries.length > 0);
  }, []);

  useDialogo(dialogRef, onClose);
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

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
                      onClick={() => onPick(entry.syntax)}
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
