import { useState } from 'react';
import type { HistoryEntry } from '@/state/types';
import { useAionStore } from '@/state/store';
import { DiceBreakdown } from './DiceBreakdown';
import { IconFixado, IconFixar, IconLixeira, IconOlho, IconRepetir } from './Icons';

/** Hora relativa em pt-BR, sem biblioteca. */
export function tempoRelativo(timestamp: number, agora = Date.now()): string {
  const seconds = Math.max(0, Math.round((agora - timestamp) / 1000));
  if (seconds < 45) return 'agora';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'ontem';
  if (days < 7) return `há ${days} dias`;
  return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function HistoryEntryCard({ entry, destacado }: { entry: HistoryEntry; destacado: boolean }) {
  const [aberto, setAberto] = useState(false);

  const characters = useAionStore((state) => state.characters);
  const revealEntry = useAionStore((state) => state.revealEntry);
  const togglePin = useAionStore((state) => state.togglePin);
  const removeEntry = useAionStore((state) => state.removeEntry);
  const rollExpression = useAionStore((state) => state.rollExpression);

  const { result } = entry;
  const character = characters.find((item) => item.id === entry.characterId) ?? null;
  const critical = result.critical;

  const titulo = entry.macroName ?? result.expression;
  const total = result.isSuccessPool
    ? `${result.total} ${Math.abs(result.total) === 1 ? 'sucesso' : 'sucessos'}`
    : String(result.total);

  return (
    <li
      className="entrada"
      data-critico={critical ?? undefined}
      data-destacado={destacado ? 'sim' : undefined}
    >
      <span
        className="entrada__faixa"
        style={character ? { background: `var(--skin-${character.skin})` } : undefined}
        aria-hidden="true"
      />

      <div className="entrada__conteudo">
        <button
          type="button"
          className="entrada__cabecalho"
          onClick={() => setAberto((value) => !value)}
          aria-expanded={aberto}
        >
          <span className="entrada__identidade">
            <span className="entrada__titulo">{titulo}</span>
            <span className="entrada__meta mono">
              {result.expression}
              <span className="entrada__ponto" aria-hidden="true">
                ·
              </span>
              {tempoRelativo(result.timestamp)}
            </span>
          </span>

          {entry.hidden ? (
            <span className="entrada__selo-oculto">Oculto</span>
          ) : (
            <span className="entrada__total mono">{total}</span>
          )}
        </button>

        <div className="entrada__acoes">
          {entry.hidden ? (
            <button
              type="button"
              className="entrada__acao entrada__acao--revelar"
              onClick={() => revealEntry(entry.id)}
              aria-label="Revelar esta rolagem"
              title="Revelar"
            >
              <IconOlho size={15} />
              <span>Revelar</span>
            </button>
          ) : null}

          <button
            type="button"
            className="entrada__acao"
            onClick={() =>
              rollExpression(result.expression, {
                macroName: entry.macroName,
                characterId: entry.characterId,
              })
            }
            aria-label="Rolar de novo"
            title="Rolar de novo"
          >
            <IconRepetir size={15} />
          </button>

          <button
            type="button"
            className="entrada__acao"
            onClick={() => togglePin(entry.id)}
            aria-label={entry.pinned ? 'Desafixar' : 'Fixar'}
            aria-pressed={entry.pinned}
            title={entry.pinned ? 'Desafixar' : 'Fixar'}
          >
            {entry.pinned ? <IconFixado size={15} /> : <IconFixar size={15} />}
          </button>

          <button
            type="button"
            className="entrada__acao entrada__acao--perigo"
            onClick={() => removeEntry(entry.id)}
            aria-label="Remover do histórico"
            title="Remover"
          >
            <IconLixeira size={15} />
          </button>
        </div>

        {aberto && !entry.hidden ? <DiceBreakdown result={result} /> : null}
      </div>
    </li>
  );
}
