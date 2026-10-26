import { useEffect, useState } from 'react';
import { useAionStore } from '@/state/store';
import { useAvisos } from '@/ui/avisos';
import { IconFechar } from './Icons';
import '@/ui/styles/avisos.css';

/** Tempo para decidir se desfaz. Longo o bastante para ler e alcançar o botão. */
const DURACAO_MS = 9000;

/**
 * Onde os avisos aparecem.
 *
 * A região de leitura fica sempre montada e só o conteúdo entra e sai: um
 * leitor de tela só anuncia mudanças dentro de uma região que já existia.
 * O aviso não some enquanto o ponteiro ou o foco estão sobre ele — quem
 * está mirando no "Desfazer" não pode ter o botão tirado no meio do gesto.
 */
export function Avisos() {
  const aviso = useAvisos((estado) => estado.aviso);
  const dispensar = useAvisos((estado) => estado.dispensar);
  const desfazerUltimo = useAvisos((estado) => estado.desfazerUltimo);
  const [parado, setParado] = useState(false);
  const comPainel = useAionStore((estado) => estado.vista === 'mesa' && estado.panel !== null);

  const id = aviso?.id ?? null;

  useEffect(() => {
    setParado(false);
  }, [id]);

  useEffect(() => {
    if (id === null || parado) return undefined;
    const timer = setTimeout(dispensar, DURACAO_MS);
    return () => clearTimeout(timer);
  }, [id, parado, dispensar]);

  return (
    <div className="avisos" data-painel={comPainel ? 'sim' : undefined} role="status" aria-live="polite">
      {aviso ? (
        <div
          className="aviso"
          key={aviso.id}
          onPointerEnter={() => setParado(true)}
          onPointerLeave={() => setParado(false)}
          onFocus={() => setParado(true)}
          onBlur={() => setParado(false)}
        >
          <p className="aviso__texto">{aviso.texto}</p>
          {aviso.desfazer ? (
            <button type="button" className="aviso__desfazer" onClick={() => desfazerUltimo()}>
              Desfazer
            </button>
          ) : null}
          <button
            type="button"
            className="aviso__fechar"
            onClick={dispensar}
            aria-label="Dispensar o aviso"
          >
            <IconFechar size={16} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
