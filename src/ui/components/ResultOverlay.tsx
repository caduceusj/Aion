import { useEffect, useRef, useState } from 'react';
import { useAionStore } from '@/state/store';
import { CriticalFx } from './CriticalFx';
import { IconOlho } from './Icons';
import '@/ui/styles/result.css';

const AUTO_HIDE_MS = 6000;
const COUNT_MS = 450;

/** Contagem animada até o total. Curta o bastante para não atrasar a mesa. */
function useContagem(target: number, active: boolean, animate: boolean): number {
  const [value, setValue] = useState(target);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    if (!animate) {
      setValue(target);
      return undefined;
    }

    const from = Math.abs(target) > 6 ? Math.round(target * 0.55) : 0;
    const start = performance.now();

    const tick = (now: number): void => {
      const progress = Math.min((now - start) / COUNT_MS, 1);
      // Saída suave: acelera e freia perto do número final.
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, active, animate]);

  return value;
}

export function ResultOverlay() {
  const phase = useAionStore((state) => state.phase);
  const result = useAionStore((state) => state.lastResult);
  const lastEntryId = useAionStore((state) => state.lastEntryId);
  const history = useAionStore((state) => state.history);
  const reducedMotion = useAionStore((state) => state.settings.reducedMotion);
  const characters = useAionStore((state) => state.characters);
  const revealEntry = useAionStore((state) => state.revealEntry);

  const [dismissed, setDismissed] = useState(false);

  const entry = history.find((item) => item.id === lastEntryId) ?? null;
  const revealed = phase === 'revelado' && result !== null && !dismissed;
  const hidden = entry?.hidden ?? false;

  const critical = result?.critical ?? null;
  const total = result?.total ?? 0;
  const counted = useContagem(total, revealed && !hidden, !reducedMotion);

  // Some sozinho: o total não pode ficar tapando a mesa até a próxima rolagem.
  useEffect(() => {
    setDismissed(false);
    if (phase !== 'revelado') return undefined;
    const timer = setTimeout(() => setDismissed(true), AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [phase, lastEntryId]);

  // Tremor de tela na falha crítica.
  useEffect(() => {
    if (!revealed || hidden || critical !== 'min' || reducedMotion) return undefined;
    const root = document.documentElement;
    root.classList.add('tremor');
    const timer = setTimeout(() => root.classList.remove('tremor'), 260);
    return () => {
      clearTimeout(timer);
      root.classList.remove('tremor');
    };
  }, [revealed, hidden, critical, reducedMotion]);

  if (!result || phase === 'ocioso') return <div className="resultado" aria-hidden="true" />;

  const character = characters.find((item) => item.id === entry?.characterId) ?? null;
  const titulo = entry?.macroName ?? result.expression;

  const anuncio = hidden
    ? 'Rolagem do mestre, oculta.'
    : `${titulo}: ${total}${
        critical === 'max' ? ', acerto crítico' : critical === 'min' ? ', falha crítica' : ''
      }`;

  return (
    <div className="resultado" data-estado={revealed ? 'revelado' : 'rolando'}>
      <p className="sr-only" role="status" aria-live="polite">
        {revealed ? anuncio : 'Rolando os dados.'}
      </p>

      {revealed && critical === 'min' ? <div className="resultado__vinheta-falha" /> : null}

      {revealed && !hidden && critical && !reducedMotion ? (
        <CriticalFx kind={critical === 'max' ? 'acerto' : 'falha'} />
      ) : null}

      {revealed ? (
        <button
          type="button"
          className="resultado__painel"
          onClick={() => setDismissed(true)}
          data-critico={critical ?? undefined}
          aria-label="Dispensar o resultado"
        >
          {critical === 'max' ? <span className="resultado__selo">Crítico</span> : null}
          {critical === 'min' ? <span className="resultado__selo">Falha crítica</span> : null}

          <span className="resultado__titulo">{titulo}</span>

          {hidden ? (
            <span className="resultado__oculto">
              <IconOlho size={22} />
              <span>Rolagem do Mestre</span>
              <span
                className="resultado__revelar"
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  if (entry) revealEntry(entry.id);
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.stopPropagation();
                  event.preventDefault();
                  if (entry) revealEntry(entry.id);
                }}
              >
                Revelar
              </span>
            </span>
          ) : (
            <>
              <span className="resultado__total mono">{counted}</span>
              {result.isSuccessPool ? (
                <span className="resultado__unidade">
                  {Math.abs(total) === 1 ? 'sucesso' : 'sucessos'}
                </span>
              ) : null}

              <span className="resultado__dados">
                {result.dice.slice(0, 24).map((die) => (
                  <span
                    key={die.id}
                    className="resultado__pastilha mono"
                    data-descartado={die.dropped ? 'sim' : undefined}
                    data-critico={die.critical ?? undefined}
                  >
                    {die.value}
                  </span>
                ))}
                {result.dice.length > 24 ? (
                  <span className="resultado__pastilha resultado__pastilha--mais">
                    +{result.dice.length - 24}
                  </span>
                ) : null}
              </span>

              {character ? (
                <span className="resultado__personagem">{character.name}</span>
              ) : null}
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}
