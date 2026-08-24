import { CATEGORIAS } from '@/codex/tipos';
import { LINHA_DO_TEMPO, porCategoria } from '@/codex/corpus';
import { Brasao } from '@/codex/valoran/heraldica';

/**
 * A capa do códice.
 *
 * É a página que abre quando ninguém escolheu nada: o emblema imperial, a
 * linha do tempo das cinco eras e as gavetas. A linha do tempo vem primeiro
 * de propósito — em uma crônica, saber *quando* é o que orienta todo o resto.
 *
 * O emblema é o mesmo do documento original do usuário, traço por traço.
 */
export function CodexAbertura({ aoNavegar }: { aoNavegar: (chave: string) => void }) {
  return (
    <div className="abertura">
      <header className="abertura__capa">
        <svg className="abertura__emblema" viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden="true">
        <g strokeWidth="2" opacity=".65">
        <circle cx="100" cy="86" r="46"/>
        <g strokeWidth="1.6">
        <line x1="100" y1="16" x2="100" y2="34"/><line x1="100" y1="138" x2="100" y2="156"/>
        <line x1="30" y1="86" x2="48" y2="86"/><line x1="152" y1="86" x2="170" y2="86"/>
        <line x1="50" y1="36" x2="61" y2="47"/><line x1="139" y1="47" x2="150" y2="36"/>
        <line x1="50" y1="136" x2="61" y2="125"/><line x1="139" y1="125" x2="150" y2="136"/>
        <line x1="66" y1="24" x2="73" y2="40"/><line x1="127" y1="40" x2="134" y2="24"/>
        <line x1="66" y1="148" x2="73" y2="132"/><line x1="127" y1="132" x2="134" y2="148"/>
        </g>
        </g>
        <g strokeWidth="3">
        <path d="M64 78 L58 52 L74 66 L100 40 L126 66 L142 52 L136 78 Z" fill="currentColor" stroke="none" opacity=".92"/>
        <circle cx="58" cy="50" r="3.4" fill="currentColor" stroke="none"/><circle cx="100" cy="38" r="3.4" fill="currentColor" stroke="none"/><circle cx="142" cy="50" r="3.4" fill="currentColor" stroke="none"/>
        </g>
        <g strokeWidth="2.4">
        <path d="M100 96 L100 176"/>
        <path d="M100 176 L94 164 M100 176 L106 164"/>
        <path d="M82 104 L118 104" strokeWidth="3"/>
        <circle cx="100" cy="96" r="4" fill="currentColor" stroke="none"/>
        </g>
        </svg>
        <p className="abertura__eyebrow">Recovered from the Imperial Archives</p>
        <h1 className="abertura__titulo">
          The Annals
          <br />
          of Valoran
        </h1>
        <p className="abertura__sub">A Scholar's Account of its History</p>
        <p className="abertura__atribuicao">
          By Maedrin Rimors, Scholar of the Imperial Archives and Explorer of the Further
          Regions — a chronicle sifted from the ashes of ages, from the Age of a Thousand
          Kings unto the present year.
        </p>
        <p className="abertura__anno">Anno 1570</p>
      </header>

      <section className="abertura__cronica" aria-label="Linha do tempo">
        <p className="verbete__rubrica">A Crônica</p>
        <h2 className="abertura__secao">Five Ages of the Continent</h2>
        <ol className="linha-do-tempo">
          {LINHA_DO_TEMPO.map((era) => (
            <li key={era.chave}>
              <button type="button" className="era-item" onClick={() => aoNavegar(era.chave)}>
                {era.brasao ? <Brasao id={era.brasao} size={26} className="era-item__glifo" /> : null}
                <span className="era-item__nome">{era.titulo}</span>
                <span className="era-item__anos">{era.periodo}</span>
                <span className="era-item__nota">{era.resumo}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="abertura__gavetas" aria-label="Gavetas do códice">
        <p className="verbete__rubrica">O Acervo</p>
        <div className="gavetas">
          {CATEGORIAS.filter((c) => c.id !== 'era').map((categoria) => {
            const itens = porCategoria(categoria.id);
            return (
              <div className="gaveta" key={categoria.id}>
                <h3>
                  {categoria.rotulo}
                  <span className="gaveta__conta">{itens.length}</span>
                </h3>
                <p className="gaveta__nota">{categoria.nota}</p>
                <div className="gaveta__itens">
                  {itens.map((item) => (
                    <button
                      type="button"
                      className="pastilha-verbete"
                      key={item.chave}
                      onClick={() => aoNavegar(item.chave)}
                      title={item.resumo}
                    >
                      {item.titulo}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
