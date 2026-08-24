import { VERBETES } from '@/codex/corpus';
import { useAionStore } from '@/state/store';
import { IconDado, IconLivro } from '@/ui/components/Icons';
import '@/ui/styles/menu.css';

/**
 * A porta de entrada do Aion.
 *
 * São duas coisas diferentes dentro do mesmo app — uma mesa de dados e uma
 * crônica — e obrigar quem quer ler a passar pela mesa (ou o contrário) era
 * uma escolha que o menu desfaz. Cada porta mostra o que há atrás dela: a
 * mesa diz quantas rolagens já guardou, o códice quantos verbetes tem.
 */
export function MenuPrincipal() {
  const irPara = useAionStore((state) => state.irPara);
  const historico = useAionStore((state) => state.history.length);
  const personagens = useAionStore((state) => state.characters.length);
  const ultima = useAionStore((state) => state.history[0] ?? null);

  return (
    <main className="menu">
      <div className="menu__brilho" aria-hidden="true" />

      <header className="menu__topo">
        <IconDado size={36} className="menu__glifo" />
        <h1 className="menu__marca">Aion</h1>
        <p className="menu__lema">Mesa de dados e crônica de Valoran</p>
      </header>

      <nav className="menu__portas" aria-label="Escolha um destino">
        <button type="button" className="porta porta--mesa" onClick={() => irPara('mesa')}>
          <span className="porta__glifo" aria-hidden="true">
            <IconDado size={40} />
          </span>
          <span className="porta__nome">A Mesa</span>
          <span className="porta__nota">
            Dados de verdade, com física. Ficha de Daggerheart, atalhos e mesa
            compartilhada entre aparelhos.
          </span>
          <span className="porta__rodape">
            {historico > 0
              ? `${historico} ${historico === 1 ? 'rolagem guardada' : 'rolagens guardadas'}`
              : 'Nenhuma rolagem ainda'}
            {personagens > 0
              ? ` · ${personagens} ${personagens === 1 ? 'personagem' : 'personagens'}`
              : ''}
          </span>
          {ultima ? (
            <span className="porta__eco">
              última: <strong>{ultima.result.expression}</strong> ={' '}
              {ultima.hidden ? '—' : ultima.result.total}
            </span>
          ) : null}
        </button>

        <button type="button" className="porta porta--codice" onClick={() => irPara('codice')}>
          <span className="porta__glifo" aria-hidden="true">
            <IconLivro size={40} />
          </span>
          <span className="porta__nome">O Códice</span>
          <span className="porta__nota">
            As Anais de Valoran: as cinco eras, as casas, os personagens e o
            atlas de 1575 — tudo cruzado por links.
          </span>
          <span className="porta__rodape">{VERBETES.length} verbetes · atlas em duas pranchas</span>
          <span className="porta__eco">
            <em>“Recovered from the Imperial Archives”</em>
          </span>
        </button>
      </nav>

      <p className="menu__dica">
        Dentro de qualquer um dos dois, <kbd>C</kbd> troca para o Códice e o brasão no
        canto volta para cá.
      </p>
    </main>
  );
}
