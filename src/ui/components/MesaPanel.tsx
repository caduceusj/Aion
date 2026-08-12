import { useState } from 'react';
import { useAionStore } from '@/state/store';
import { SKIN_COLORS } from '@/three/textures';
import { gerarCodigoDeSala, normalizarCodigo } from '@/net/types';
import { IconCheck, IconCopiar, IconMais } from './Icons';
import '@/ui/styles/mesa.css';

const ROTULO_DO_ESTADO: Record<string, string> = {
  desconectado: 'Fora da mesa',
  conectando: 'Entrando…',
  conectado: 'Na mesa',
  reconectando: 'Reconectando…',
  erro: 'Falhou',
};

export function MesaPanel() {
  const mesa = useAionStore((s) => s.mesa);
  const conectarMesa = useAionStore((s) => s.conectarMesa);
  const desconectarMesa = useAionStore((s) => s.desconectarMesa);
  const definirMedo = useAionStore((s) => s.definirMedo);

  const [codigo, setCodigo] = useState(mesa.codigo);
  const [url, setUrl] = useState(mesa.url);
  const [mestre, setMestre] = useState(mesa.souMestre);
  const [copiado, setCopiado] = useState(false);

  const conectado = mesa.estado === 'conectado';
  const ocupado = mesa.estado === 'conectando' || mesa.estado === 'reconectando';

  const copiarConvite = (): void => {
    if (typeof window === 'undefined') return;
    const convite = `${window.location.origin}${window.location.pathname}?sala=${mesa.codigo}&relay=${encodeURIComponent(mesa.url)}`;
    void navigator.clipboard
      ?.writeText(convite)
      .then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 1800);
      })
      .catch(() => undefined);
  };

  return (
    <div className="mesa">
      <header className="mesa__topo">
        <h2 className="mesa__titulo">Mesa</h2>
        <span className="mesa__estado" data-estado={mesa.estado}>
          {ROTULO_DO_ESTADO[mesa.estado] ?? mesa.estado}
        </span>
      </header>

      <div className="mesa__corpo">
        {!conectado ? (
          <section className="mesa__secao">
            <p className="mesa__explicacao">
              Todos os aparelhos na mesma sala veem as rolagens uns dos outros, com os
              dados caindo em cada tela. Só a expressão e a semente viajam — o resultado
              é recalculado localmente, então ninguém precisa confiar na palavra de
              ninguém.
            </p>

            <label className="mesa__campo">
              <span className="rotulo">Código da sala</span>
              <div className="mesa__codigo-linha">
                <input
                  className="mesa__codigo mono"
                  value={codigo}
                  onChange={(evento) => setCodigo(normalizarCodigo(evento.target.value))}
                  placeholder="XKQ7"
                  maxLength={8}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Código da sala"
                />
                <button
                  type="button"
                  className="mesa__gerar"
                  onClick={() => setCodigo(gerarCodigoDeSala())}
                  title="Gerar um código novo"
                >
                  <IconMais size={15} />
                  <span>Criar</span>
                </button>
              </div>
            </label>

            <label className="mesa__campo">
              <span className="rotulo">Endereço do relay</span>
              <input
                className="mesa__url mono"
                value={url}
                onChange={(evento) => setUrl(evento.target.value)}
                placeholder="ws://192.168.0.10:8787"
                autoComplete="off"
                spellCheck={false}
                aria-label="Endereço do relay"
              />
              <span className="mesa__dica">
                Rode <code className="mono">npm run relay</code> em um computador da rede
                e use o IP dele aqui — <code className="mono">ws://192.168.0.10:8787</code>,
                não <code className="mono">localhost</code>, senão os outros aparelhos não
                acham. A mesa compartilhada precisa desse processo em algum lugar; o resto
                do Aion funciona sem ele.
              </span>
            </label>

            <label className="mesa__interruptor">
              <input
                type="checkbox"
                checked={mestre}
                onChange={(evento) => setMestre(evento.target.checked)}
              />
              <span>Sou o Mestre desta mesa</span>
            </label>

            <button
              type="button"
              className="mesa__entrar"
              disabled={codigo.trim().length < 3 || url.trim().length === 0 || ocupado}
              onClick={() => conectarMesa({ codigo, url, mestre })}
            >
              {ocupado ? 'Entrando…' : 'Entrar na mesa'}
            </button>

            {mesa.erro ? <p className="mesa__erro">{mesa.erro}</p> : null}
          </section>
        ) : (
          <>
            <section className="mesa__secao">
              <div className="mesa__sala">
                <span className="rotulo">Sala</span>
                <strong className="mesa__sala-codigo mono">{mesa.codigo}</strong>
                <button
                  type="button"
                  className="mesa__copiar"
                  onClick={copiarConvite}
                  title="Copiar o link de convite"
                >
                  {copiado ? <IconCheck size={15} /> : <IconCopiar size={15} />}
                  <span>{copiado ? 'Copiado' : 'Convite'}</span>
                </button>
              </div>
            </section>

            <section className="mesa__secao">
              <h3 className="rotulo mesa__secao-titulo">
                Na mesa ({mesa.participantes.length})
              </h3>
              <ul className="participantes">
                {mesa.participantes.map((participante) => (
                  <li className="participante" key={participante.id}>
                    <span
                      className="participante__cor"
                      style={{
                        background:
                          SKIN_COLORS[participante.skin]?.body ?? 'var(--amber-300)',
                      }}
                      aria-hidden="true"
                    />
                    <span className="participante__nome">{participante.nome}</span>
                    {participante.mestre ? (
                      <span className="participante__selo">Mestre</span>
                    ) : null}
                    {participante.id === mesa.suaId ? (
                      <span className="participante__voce">você</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mesa__secao">
              <h3 className="rotulo mesa__secao-titulo">Medo do Mestre</h3>
              <div className="medo">
                <button
                  type="button"
                  className="medo__botao"
                  onClick={() => definirMedo(mesa.medo - 1)}
                  disabled={mesa.medo <= 0}
                  aria-label="Diminuir o Medo"
                >
                  −
                </button>
                <span className="medo__valor mono">{mesa.medo}</span>
                <button
                  type="button"
                  className="medo__botao"
                  onClick={() => definirMedo(mesa.medo + 1)}
                  aria-label="Aumentar o Medo"
                >
                  +
                </button>
              </div>
              <p className="mesa__dica">
                O contador é o mesmo para todos os aparelhos. Toda rolagem com Medo
                lembra o Mestre de subir um.
              </p>
            </section>

            <button type="button" className="mesa__sair" onClick={desconectarMesa}>
              Sair da mesa
            </button>
          </>
        )}
      </div>
    </div>
  );
}
