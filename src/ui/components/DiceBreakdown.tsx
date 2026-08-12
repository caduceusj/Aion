import { useState } from 'react';
import type { RollResult } from '@/engine/types';
import { useAionStore } from '@/state/store';
import { GlifoDado, IconCheck, IconCopiar } from './Icons';

function copiar(text: string): Promise<void> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return Promise.resolve();
  return navigator.clipboard.writeText(text).catch(() => undefined);
}

/**
 * O detalhamento honesto de uma rolagem: cada dado, o que foi mantido, o que
 * foi descartado, o que explodiu. É o que responde "esse total está certo?".
 */
export function DiceBreakdown({ result }: { result: RollResult }) {
  const showSeeds = useAionStore((state) => state.settings.showSeeds);
  const [copiado, setCopiado] = useState<'detalhe' | 'semente' | null>(null);

  const marcar = (qual: 'detalhe' | 'semente', texto: string): void => {
    void copiar(texto).then(() => {
      setCopiado(qual);
      setTimeout(() => setCopiado(null), 1600);
    });
  };

  return (
    <div className="detalhe">
      {result.groups.map((group) => {
        const dice = result.dice.filter((die) => die.groupIndex === group.index);
        return (
          <div className="detalhe__grupo" key={group.index}>
            <span className="detalhe__notacao mono">{group.notation}</span>
            <div className="detalhe__pastilhas">
              {dice.map((die) => {
                const titulo = [
                  `Face natural: ${die.face}`,
                  die.history.length > 1 ? `Sequência: ${die.history.join(' → ')}` : null,
                  die.dropped ? 'Descartado' : null,
                  die.exploded ? 'Explodiu' : null,
                  die.rerolled ? 'Rerrolado' : null,
                ]
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <span
                    className="pastilha"
                    key={die.id}
                    title={titulo}
                    data-descartado={die.dropped ? 'sim' : undefined}
                    data-critico={die.critical ?? undefined}
                    data-sucesso={die.success === true ? 'sim' : undefined}
                  >
                    <GlifoDado kind={die.shape} size={30} className="pastilha__silhueta" />
                    <span className="pastilha__valor mono">{die.value}</span>
                    {die.exploded ? <span className="pastilha__marca">⚡</span> : null}
                    {die.rerolled ? <span className="pastilha__marca">↻</span> : null}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="detalhe__matematica">
        <code className="mono">{result.detail}</code>
        <button
          type="button"
          className="detalhe__copiar"
          onClick={() => marcar('detalhe', result.detail)}
          aria-label="Copiar o detalhamento"
          title="Copiar o detalhamento"
        >
          {copiado === 'detalhe' ? <IconCheck size={15} /> : <IconCopiar size={15} />}
        </button>
      </div>

      {showSeeds ? (
        <div className="detalhe__semente">
          <span className="rotulo">Semente</span>
          <code className="mono">{result.seed}</code>
          <button
            type="button"
            className="detalhe__copiar"
            onClick={() => marcar('semente', result.seed)}
            aria-label="Copiar a semente"
            title="Copiar a semente"
          >
            {copiado === 'semente' ? <IconCheck size={15} /> : <IconCopiar size={15} />}
          </button>
          <p className="detalhe__nota">
            Com esta semente e a mesma expressão, a rolagem se repete idêntica — é
            assim que a mesa confere um resultado.
          </p>
        </div>
      ) : null}
    </div>
  );
}
