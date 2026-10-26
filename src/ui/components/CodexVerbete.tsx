import type { VerbeteNoAcervo } from '@/codex/tipos';
import { CATEGORIAS, FONTES } from '@/codex/tipos';
import { referenciam, tituloAmbiguo, verbete as buscarVerbete } from '@/codex/corpus';
import { Prosa } from '@/codex/prosa';
import { Brasao } from '@/codex/heraldica';
import { LinkDeVerbete } from '@/codex/LinkDeVerbete';
import { copiarLink } from '@/ui/compartilhar';
import { IconCopiar } from '@/ui/components/Icons';

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
  entrada: VerbeteNoAcervo;
  aoNavegar: (chave: string) => void;
}) {
  // O link só leva a verbetes; a capa (`null`) tem os seus próprios botões.
  const ir = (chave: string | null): void => {
    if (chave !== null) aoNavegar(chave);
  };
  const categoria = CATEGORIAS.find((c) => c.id === entrada.categoria);
  const fonte = FONTES[entrada.fonte];
  const citam = referenciam(entrada.chave);

  return (
    <article className="verbete" key={entrada.chave}>
      <header className="verbete__topo">
        {entrada.brasao ? (
          <Brasao id={entrada.brasao} size={78} className="verbete__brasao" />
        ) : null}
        <p className="verbete__gaveta">
          {categoria?.singular ?? ''}
          <span className="verbete__fonte" data-camada={fonte.camada} title={fonte.nota}>
            {fonte.rotulo}
          </span>
        </p>
        {entrada.epiteto ? (
          <p className="verbete__epiteto" lang="en">
            {entrada.epiteto}
          </p>
        ) : null}
        <h1 className="verbete__titulo" lang="en">
          {entrada.titulo}
        </h1>
        {entrada.periodo ? (
          <p className="verbete__periodo" lang="en">
            {entrada.periodo}
          </p>
        ) : null}
        <button
          type="button"
          className="verbete__copiar"
          onClick={() => void copiarLink(entrada.titulo)}
        >
          <IconCopiar size={14} />
          <span>Copiar link</span>
        </button>
      </header>

      {entrada.epigrafe ? (
        <blockquote className="verbete__epigrafe" lang="en">
          {entrada.epigrafe}
        </blockquote>
      ) : null}

      <div className="verbete__corpo">
        <aside className="verbete__ficha" aria-label="Ficha do verbete">
          <dl lang="en">
            {entrada.ficha.map((fato) => (
              <div
                className="verbete__fato"
                key={fato.rotulo}
                data-longo={fato.valor.length > 34 ? 'sim' : undefined}
              >
                <dt>{fato.rotulo}</dt>
                <dd>
                  <Prosa texto={fato.valor} aoNavegar={aoNavegar} />
                </dd>
              </div>
            ))}
          </dl>

          {entrada.eras.length > 0 && entrada.categoria !== 'era' ? (
            <div className="verbete__eras" lang="en">
              <p className="verbete__rubrica">Ages</p>
              <ul>
                {entrada.eras.map((chave) => {
                  const era = buscarVerbete(chave);
                  if (!era) return null;
                  return (
                    <li key={chave}>
                      <LinkDeVerbete className="codice-elo" chave={chave} aoNavegar={ir}>
                        {era.titulo}
                      </LinkDeVerbete>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </aside>

        <div className="verbete__prosa" lang="en">
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
                  <LinkDeVerbete className="cartao-verbete" key={chave} chave={chave} aoNavegar={ir}>
                    {alvo.brasao ? <Brasao id={alvo.brasao} size={30} /> : null}
                    <span>
                      <strong>{alvo.titulo}</strong>
                      <small>{alvo.resumo}</small>
                    </span>
                  </LinkDeVerbete>
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
                <LinkDeVerbete
                  className="pastilha-verbete"
                  key={quem.chave}
                  chave={quem.chave}
                  aoNavegar={ir}
                >
                  {quem.titulo}
                  {/* Dois verbetes com o mesmo nome ("Firen": a lâmina e o reino)
                      eram duas pastilhas idênticas. A gaveta de cada um resolve. */}
                  {tituloAmbiguo(quem.titulo) ? (
                    <small className="pastilha-verbete__gaveta">
                      {CATEGORIAS.find((c) => c.id === quem.categoria)?.singular}
                    </small>
                  ) : null}
                </LinkDeVerbete>
              ))}
            </div>
          </div>
        ) : null}
      </footer>
    </article>
  );
}
