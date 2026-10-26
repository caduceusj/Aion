import { TOTAL_DE_VERBETES } from '@/codex/contagem';
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
    <main className="menu" tabIndex={-1} data-foco-da-vista>
      <div className="menu__brilho" aria-hidden="true" />

      <header className="menu__topo">
        <IconDado size={36} className="menu__glifo" />
        <h1 className="menu__marca">Aion</h1>
        <p className="menu__lema">Mesa de dados e crônica de Valoran</p>
      </header>

      <nav className="menu__portas" aria-label="Escolha um destino">
        {/* O nome do botão é o nome da porta; a nota e o rodapé vão como
            descrição. Sem isso, o leitor de tela dizia o cartão inteiro como se
            fosse o nome — três linhas antes de saber qual botão era. */}
        <button
          type="button"
          className="porta porta--mesa"
          onClick={() => irPara('mesa')}
          aria-labelledby="porta-mesa-nome"
          aria-describedby="porta-mesa-nota porta-mesa-rodape"
        >
          <span className="porta__glifo" aria-hidden="true">
            <IconDado size={40} />
          </span>
          <span className="porta__nome" id="porta-mesa-nome">
            A Mesa
          </span>
          <span className="porta__nota" id="porta-mesa-nota">
            Dados de verdade, com física. Ficha de Daggerheart, atalhos e mesa
            compartilhada entre aparelhos.
          </span>
          <span className="porta__rodape" id="porta-mesa-rodape">
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

        <button
          type="button"
          className="porta porta--codice"
          onClick={() => irPara('codice')}
          aria-labelledby="porta-codice-nome"
          aria-describedby="porta-codice-nota porta-codice-rodape"
        >
          <span className="porta__glifo" aria-hidden="true">
            <IconLivro size={40} />
          </span>
          <span className="porta__nome" id="porta-codice-nome">
            O Códice
          </span>
          <span className="porta__nota" id="porta-codice-nota">
            As Anais de Valoran e a mesa de hoje: as eras, as casas, o elenco, o
            atlas de 1575 e o almanaque do céu — tudo cruzado por links.
          </span>
          <span className="porta__rodape" id="porta-codice-rodape">
            {TOTAL_DE_VERBETES} verbetes · atlas em duas pranchas · calendário de Aion
          </span>
          <span className="porta__eco">
            <em>“Recovered from the Imperial Archives”</em>
          </span>
        </button>
      </nav>

      <p className="menu__dica">
        <span className="menu__dica-teclado">
          Dentro de qualquer um dos dois, <kbd>C</kbd> troca para o Códice e <kbd>?</kbd>{' '}
          mostra os atalhos de teclado.{' '}
        </span>
        O brasão no canto volta para cá.
      </p>
    </main>
  );
}
