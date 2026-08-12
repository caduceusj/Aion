import { useMemo, useState } from 'react';
import { useAionStore } from '@/state/store';
import { HistoryEntryCard } from './HistoryEntryCard';
import { IconDado, IconLixeira } from './Icons';
import '@/ui/styles/history.css';

type Filtro = 'todos' | 'fixados' | 'criticos';

const FILTROS: Array<{ id: Filtro; rotulo: string }> = [
  { id: 'todos', rotulo: 'Tudo' },
  { id: 'fixados', rotulo: 'Fixados' },
  { id: 'criticos', rotulo: 'Críticos' },
];

/** Rótulo do dia para os separadores da fita. */
function rotuloDoDia(timestamp: number): string {
  const data = new Date(timestamp);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  const mesmoDia = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (mesmoDia(data, hoje)) return 'Hoje';
  if (mesmoDia(data, ontem)) return 'Ontem';
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

export function HistoryRail() {
  const history = useAionStore((state) => state.history);
  const lastEntryId = useAionStore((state) => state.lastEntryId);
  const clearHistory = useAionStore((state) => state.clearHistory);

  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [confirmando, setConfirmando] = useState(false);

  const visiveis = useMemo(() => {
    if (filtro === 'fixados') return history.filter((entry) => entry.pinned);
    if (filtro === 'criticos') return history.filter((entry) => entry.result.critical !== null);
    return history;
  }, [history, filtro]);

  return (
    <div className="historico">
      <header className="historico__topo">
        <div className="historico__titulo-area">
          <h2 className="historico__titulo">Histórico</h2>
          <span className="historico__contagem">{history.length}</span>
        </div>

        {history.length > 0 ? (
          <button
            type="button"
            className={`historico__limpar${confirmando ? ' historico__limpar--confirma' : ''}`}
            onClick={() => {
              if (!confirmando) {
                setConfirmando(true);
                setTimeout(() => setConfirmando(false), 3500);
                return;
              }
              clearHistory();
              setConfirmando(false);
            }}
          >
            <IconLixeira size={15} />
            <span>{confirmando ? 'Confirmar?' : 'Limpar'}</span>
          </button>
        ) : null}
      </header>

      {history.length > 0 ? (
        <div className="historico__filtros" role="group" aria-label="Filtrar histórico">
          {FILTROS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="historico__filtro"
              data-ativo={filtro === item.id ? 'sim' : undefined}
              onClick={() => setFiltro(item.id)}
              aria-pressed={filtro === item.id}
            >
              {item.rotulo}
            </button>
          ))}
        </div>
      ) : null}

      {visiveis.length === 0 ? (
        <div className="historico__vazio">
          <IconDado size={48} />
          <p className="historico__vazio-titulo">
            {history.length === 0 ? 'A mesa está em silêncio' : 'Nada com esse filtro'}
          </p>
          <p className="historico__vazio-texto">
            {history.length === 0
              ? 'Role um dado e cada resultado fica registrado aqui, com o detalhamento completo.'
              : 'Experimente outro filtro para ver as rolagens.'}
          </p>
        </div>
      ) : (
        <ul className="historico__lista">
          {visiveis.map((entry, index) => {
            const anterior = visiveis[index - 1];
            const dia = rotuloDoDia(entry.result.timestamp);
            const mostrarDia =
              !anterior || rotuloDoDia(anterior.result.timestamp) !== dia;

            return (
              <li key={entry.id} className="historico__bloco">
                {mostrarDia ? <p className="rotulo historico__dia">{dia}</p> : null}
                <ul>
                  <HistoryEntryCard entry={entry} destacado={entry.id === lastEntryId} />
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
