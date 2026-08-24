import type { Verbete } from '@/codex/tipos';
import { CATEGORIAS } from '@/codex/tipos';
import { referenciam, verbete as buscarVerbete } from '@/codex/corpus';
import { Prosa } from '@/codex/prosa';
import { Brasao } from '@/codex/valoran/heraldica';

/**
 * Um verbete aberto.
 *
 * A ficha lateral existe para responder de relance ("de quem é essa casa?",
 * "em que era isso aconteceu?") sem obrigar a ler a prosa inteira — é o que
 * separa um wiki de um capítulo de livro.
 */
export function CodexVerbete({
  entrada,
  aoNavegar,
}: {
  entrada: Verbete;
  aoNavegar: (chave: string) => void;
}) {
  const categoria = CATEGORIAS.find((c) => c.id === entrada.categoria);
  const citam = referenciam(entrada.chave);

  return (
    <article className="verbete" key={entrada.chave}>
      <header className="verbete__topo">
        {entrada.brasao ? (
          <Brasao id={entrada.brasao} size={78} className="verbete__brasao" />
        ) : null}
        <p className="verbete__gaveta">{categoria?.singular ?? ''}</p>
        {entrada.epiteto ? <p className="verbete__epiteto">{entrada.epiteto}</p> : null}
        <h1 className="verbete__titulo">{entrada.titulo}</h1>
        {entrada.periodo ? <p className="verbete__periodo">{entrada.periodo}</p> : null}
      </header>

      {entrada.epigrafe ? (
        <blockquote className="verbete__epigrafe">{entrada.epigrafe}</blockquote>
      ) : null}

      <div className="verbete__corpo">
        <aside className="verbete__ficha" aria-label="Ficha do verbete">
          <dl>
            {entrada.ficha.map((fato) => (
              <div className="verbete__fato" key={fato.rotulo}>
                <dt>{fato.rotulo}</dt>
                <dd>{fato.valor}</dd>
              </div>
            ))}
          </dl>

          {entrada.eras.length > 0 && entrada.categoria !== 'era' ? (
            <div className="verbete__eras">
              <p className="verbete__rubrica">Ages</p>
              <ul>
                {entrada.eras.map((chave) => {
                  const era = buscarVerbete(chave);
                  if (!era) return null;
                  return (
                    <li key={chave}>
                      <button type="button" className="codice-elo" onClick={() => aoNavegar(chave)}>
                        {era.titulo}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </aside>

        <div className="verbete__prosa">
          {entrada.secoes.map((secao, i) => (
            <section className="verbete__secao" key={secao.titulo ?? `secao-${i}`}>
              {secao.titulo ? <h2>{secao.titulo}</h2> : null}
              {secao.paragrafos.map((paragrafo, j) => (
                <p key={j}>
                  <Prosa texto={paragrafo} aoNavegar={aoNavegar} />
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>

      <footer className="verbete__rodape">
        {entrada.relacionados.length > 0 ? (
          <div className="verbete__trilhas">
            <p className="verbete__rubrica">Ver também</p>
            <div className="verbete__fichas">
              {entrada.relacionados.map((chave) => {
                const alvo = buscarVerbete(chave);
                if (!alvo) return null;
                return (
                  <button
                    type="button"
                    className="cartao-verbete"
                    key={chave}
                    onClick={() => aoNavegar(chave)}
                  >
                    {alvo.brasao ? <Brasao id={alvo.brasao} size={30} /> : null}
                    <span>
                      <strong>{alvo.titulo}</strong>
                      <small>{alvo.resumo}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {citam.length > 0 ? (
          <div className="verbete__citacoes">
            <p className="verbete__rubrica">Citado em</p>
            <div className="verbete__pastilhas">
              {citam.map((quem) => (
                <button
                  type="button"
                  className="pastilha-verbete"
                  key={quem.chave}
                  onClick={() => aoNavegar(quem.chave)}
                >
                  {quem.titulo}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </footer>
    </article>
  );
}
