import { useMemo, useState } from 'react';
import type { Ficha } from '@/daggerheart/ficha';
import {
  DOMINIOS,
  TIPOS_DE_CARTA,
  cartasDisponiveis,
  dominiosDoPersonagem,
  type CartaDeDominio,
  type Srd,
} from '@/daggerheart/srd';
import { extrairDanosDaCarta, montarDanoDeCarta } from '@/daggerheart/srd/dano';
import { proficiencia as proficienciaDaFicha } from '@/daggerheart/ficha';
import { Blocos } from './EscolhasDoSrd';
import { IconCheck, IconMais } from './Icons';

function Carta({
  carta,
  escolhida,
  proficiencia,
  aoAlternar,
  aoRolar,
}: {
  carta: CartaDeDominio;
  escolhida: boolean;
  proficiencia: number;
  aoAlternar: () => void;
  aoRolar: (expressao: string, rotulo: string) => void;
}) {
  const [aberta, setAberta] = useState(false);
  const cor = DOMINIOS[carta.dominio].cor;

  // Só o que está em mãos ganha botão de rolar: numa lista de busca, um
  // botão de dano em carta que você não tem é convite para erro.
  const danos = useMemo(
    () => (escolhida ? extrairDanosDaCarta(carta) : []),
    [carta, escolhida],
  );

  return (
    <li
      className="carta"
      data-escolhida={escolhida ? 'sim' : undefined}
      style={{ '--cor-dominio': cor } as React.CSSProperties}
    >
      <div className="carta__topo">
        <button
          type="button"
          className="carta__abrir"
          onClick={() => setAberta((v) => !v)}
          aria-expanded={aberta}
        >
          <span className="carta__nome">{carta.nome}</span>
          <span className="carta__meta">
            {DOMINIOS[carta.dominio].nome} · Nível {carta.nivel} ·{' '}
            {TIPOS_DE_CARTA[carta.tipo]} · Recall {carta.custoDeLembranca}
          </span>
        </button>

        <button
          type="button"
          className="carta__pegar"
          onClick={aoAlternar}
          aria-pressed={escolhida}
          aria-label={escolhida ? `Largar ${carta.nome}` : `Pegar ${carta.nome}`}
          title={escolhida ? 'Largar esta carta' : 'Pegar esta carta'}
        >
          {escolhida ? <IconCheck size={15} /> : <IconMais size={15} />}
        </button>
      </div>

      {danos.length > 0 ? (
        <div className="carta__danos">
          {danos.map((dano) => {
            const normal = montarDanoDeCarta(dano, proficiencia, carta.nome);
            const critico = montarDanoDeCarta(dano, proficiencia, carta.nome, {
              critico: true,
            });
            const rotulo = normal.expressao.replace(/\[.*$/, '');

            return (
              <div className="carta__dano" key={dano.trecho}>
                <button
                  type="button"
                  className="carta__rolar"
                  onClick={() => aoRolar(normal.expressao, normal.rotulo)}
                  title={
                    normal.usaProficiencia
                      ? `"${dano.trecho}" — a carta não traz a contagem, então ela vem da sua Proficiência (${proficiencia})`
                      : `"${dano.trecho}" — contagem fixa da carta`
                  }
                >
                  <span className="carta__rolar-rotulo">Dano</span>
                  <span className="carta__rolar-expressao mono">{rotulo}</span>
                </button>
                <button
                  type="button"
                  className="carta__rolar carta__rolar--critico"
                  onClick={() => aoRolar(critico.expressao, critico.rotulo)}
                  title="Dano crítico: soma o máximo dos dados"
                >
                  Crítico
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {aberta ? (
        <div className="carta__corpo">
          {carta.caracteristicas.map((caracteristica, indice) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={indice}>
              {caracteristica.nome ? (
                <strong className="srd__nome">{caracteristica.nome}</strong>
              ) : null}
              <Blocos blocos={caracteristica.blocos} />
            </div>
          ))}
        </div>
      ) : null}
    </li>
  );
}

/**
 * Baralho de domínio do personagem.
 *
 * Mostra primeiro o que está em mãos e depois o que dá para pegar, já
 * filtrado pelos domínios da classe e da subclasse e pelo nível — que é
 * exatamente a pergunta que se faz ao subir de nível.
 */
export function CartasDeDominio({
  ficha,
  srd,
  aoMudar,
  aoRolar,
}: {
  ficha: Ficha;
  srd: Srd;
  aoMudar: (patch: Partial<Ficha>) => void;
  aoRolar: (expressao: string, rotulo: string) => void;
}) {
  const prof = proficienciaDaFicha(ficha);
  const [busca, setBusca] = useState('');
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const dominios = useMemo(
    () => dominiosDoPersonagem(srd, ficha.classeId, ficha.subclasseId),
    [srd, ficha.classeId, ficha.subclasseId],
  );

  const disponiveis = useMemo(
    () => cartasDisponiveis(srd, dominios, mostrarTodas ? 10 : ficha.nivel),
    [srd, dominios, ficha.nivel, mostrarTodas],
  );

  const escolhidas = useMemo(
    () => srd.cartas.filter((carta) => ficha.cartas.includes(carta.id)),
    [srd.cartas, ficha.cartas],
  );

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const naoEscolhidas = disponiveis.filter((carta) => !ficha.cartas.includes(carta.id));
    if (termo.length === 0) return naoEscolhidas;
    return naoEscolhidas.filter((carta) => carta.nome.toLowerCase().includes(termo));
  }, [disponiveis, ficha.cartas, busca]);

  const alternar = (id: string): void => {
    aoMudar({
      cartas: ficha.cartas.includes(id)
        ? ficha.cartas.filter((carta) => carta !== id)
        : [...ficha.cartas, id],
    });
  };

  if (dominios.length === 0) {
    return (
      <p className="ficha__nota">
        Escolha uma classe para ver as cartas dos seus domínios.
      </p>
    );
  }

  return (
    <div className="cartas">
      {escolhidas.length > 0 ? (
        <>
          <span className="rotulo cartas__grupo">Em mãos ({escolhidas.length})</span>
          <ul className="cartas__lista">
            {escolhidas.map((carta) => (
              <Carta
                key={carta.id}
                carta={carta}
                escolhida
                proficiencia={prof}
                aoAlternar={() => alternar(carta.id)}
                aoRolar={aoRolar}
              />
            ))}
          </ul>
        </>
      ) : null}

      <div className="cartas__controles">
        <input
          className="cartas__busca"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar carta…"
          aria-label="Buscar carta de domínio"
        />
        <button
          type="button"
          className="cartas__nivel"
          data-ativo={mostrarTodas ? 'sim' : undefined}
          onClick={() => setMostrarTodas((v) => !v)}
          aria-pressed={mostrarTodas}
          title="Mostrar também cartas acima do seu nível"
        >
          {mostrarTodas ? 'Todos os níveis' : `Até nível ${ficha.nivel}`}
        </button>
      </div>

      {filtradas.length === 0 ? (
        <p className="ficha__nota">
          {busca.trim().length > 0
            ? 'Nenhuma carta com esse nome.'
            : 'Você já pegou todas as cartas disponíveis.'}
        </p>
      ) : (
        <ul className="cartas__lista">
          {filtradas.map((carta) => (
            <Carta
              key={carta.id}
              carta={carta}
              escolhida={false}
              proficiencia={prof}
              aoAlternar={() => alternar(carta.id)}
              aoRolar={aoRolar}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
