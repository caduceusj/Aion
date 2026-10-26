import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIAS } from '@/codex/tipos';
import { VERBETES, buscar, porCategoria, tituloAmbiguo, verbete } from '@/codex/corpus';
import { Brasao } from '@/codex/heraldica';
import { useAionStore } from '@/state/store';
import { useCamada } from '@/ui/camadas';
import {
  IconBaixo,
  IconBusca,
  IconCasa,
  IconCima,
  IconFechar,
  IconIndice,
  IconLivro,
  IconMapa,
  IconOrbita,
} from '@/ui/components/Icons';
import { CodexAbertura } from '@/ui/components/CodexAbertura';
import { CodexVerbete } from '@/ui/components/CodexVerbete';
import { CodexAtlas } from '@/ui/components/CodexAtlas';
import { CodexCalendario } from '@/ui/components/CodexCalendario';
import '@/ui/styles/codex.css';

/** Endereço de um verbete na barra do navegador: #codice/casa-keaton. */
const PREFIXO_HASH = '#codice/';

/**
 * Duas vistas que não são verbetes, e por isso têm endereço próprio.
 *
 * O Atlas é o mapa; o Almanaque é o calendário. Nenhum dos dois cabe em
 * parágrafos — são instrumentos, não leitura — mas os dois precisam de link
 * que se possa colar no grupo, como qualquer verbete.
 */
const ATLAS = '@atlas';
const CALENDARIO = '@calendario';
const VISTAS: string[] = [ATLAS, CALENDARIO];

/** Largura abaixo da qual o índice não cabe ao lado da leitura e vira gaveta. */
const MEDIA_GAVETA = '(max-width: 900px)';

function chaveDaUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash.startsWith(PREFIXO_HASH)) return null;
  const chave = decodeURIComponent(hash.slice(PREFIXO_HASH.length));
  if (VISTAS.includes(chave)) return chave;
  return verbete(chave) ? chave : null;
}

function emGaveta(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(MEDIA_GAVETA).matches
  );
}

/** O nome de uma página do Códice — para o título da aba e para o "voltar a…". */
function tituloDe(chave: string | null): string {
  if (chave === null) return 'A Capa';
  if (chave === ATLAS) return 'O Atlas';
  if (chave === CALENDARIO) return 'O Almanaque';
  return verbete(chave)?.titulo ?? 'A Capa';
}

/**
 * O Códice: a lore da campanha em tela cheia.
 *
 * Não é um painel do trilho — ocupa a tela inteira, porque ler uma crônica
 * numa faixa de 320px é castigo.
 *
 * A navegação é de navegador mesmo: pilha com voltar e avançar, e a chave do
 * verbete no hash da URL — assim um jogador manda "olha o verbete da Casa
 * Keaton" com um link em vez de instruções.
 */
export function Codex() {
  const sairDoCodice = useAionStore((state) => state.sairDoCodice);
  const irPara = useAionStore((state) => state.irPara);
  const hotkeys = useAionStore((state) => state.settings.hotkeys);

  // Pilha e posição em um estado só: separados, um `navegar` teria de ler a
  // pilha antiga para decidir a posição nova, e é assim que se erra.
  const [nav, setNav] = useState<{ pilha: Array<string | null>; posicao: number }>(() => ({
    pilha: [chaveDaUrl()],
    posicao: 0,
  }));
  const [consulta, setConsulta] = useState('');
  // Em tela estreita o índice não cabe ao lado da leitura; vira gaveta.
  const [indiceAberto, setIndiceAberto] = useState(false);
  const { pilha, posicao } = nav;

  const leituraRef = useRef<HTMLElement | null>(null);
  const buscaRef = useRef<HTMLInputElement | null>(null);
  const indiceRef = useRef<HTMLElement | null>(null);
  const alternarRef = useRef<HTMLButtonElement | null>(null);
  const montado = useRef(false);

  const atual = pilha[posicao] ?? null;
  const entrada = atual && !VISTAS.includes(atual) ? verbete(atual) : undefined;

  /** Gavetas do índice abertas. Começa na do verbete que se está lendo. */
  const [abertos, setAbertos] = useState<ReadonlySet<string>>(
    () => new Set(entrada ? [entrada.categoria] : []),
  );

  const navegar = useCallback((chave: string | null) => {
    setNav((anterior) => {
      if (anterior.pilha[anterior.posicao] === chave) return anterior;
      const cortada = anterior.pilha.slice(0, anterior.posicao + 1);
      return { pilha: [...cortada, chave], posicao: cortada.length };
    });
    setConsulta('');
    setIndiceAberto(false);
  }, []);

  const andar = useCallback((passo: number) => {
    setNav((anterior) => {
      const destino = Math.max(0, Math.min(anterior.pilha.length - 1, anterior.posicao + passo));
      return destino === anterior.posicao ? anterior : { ...anterior, posicao: destino };
    });
  }, []);

  // O hash acompanha o verbete aberto, e não o contrário: quem chega por um
  // link cai no verbete certo, e daí em diante quem manda é a pilha.
  useEffect(() => {
    const alvo = atual ? PREFIXO_HASH + encodeURIComponent(atual) : '';
    if (window.location.hash === alvo) return;
    const url = window.location.pathname + window.location.search + alvo;
    window.history.replaceState(null, '', url);
  }, [atual]);

  // O título da aba diz onde se está: com várias abertas, ou voltando pelo
  // histórico do navegador, "Aion — Mesa de Dados" em todas não ajuda ninguém.
  useEffect(() => {
    document.title = atual === null ? 'O Códice · Aion' : `${tituloDe(atual)} · O Códice · Aion`;
  }, [atual]);

  /**
   * Um link colado com o Códice já aberto leva ao verbete.
   *
   * `replaceState` não dispara `hashchange`, então escutar aqui não briga
   * com o efeito acima que escreve o endereço — só responde a quem mudou a
   * barra na mão, ou clicou num link de fora.
   */
  useEffect(() => {
    const aoTrocarHash = (): void => {
      const chave = chaveDaUrl();
      if (chave !== null) navegar(chave);
    };
    window.addEventListener('hashchange', aoTrocarHash);
    return () => window.removeEventListener('hashchange', aoTrocarHash);
  }, [navegar]);

  // Limpa o hash ao fechar, senão recarregar a página reabriria o códice.
  useEffect(() => {
    return () => {
      if (window.location.hash.startsWith(PREFIXO_HASH)) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
  }, []);

  // Cada salto recomeça a leitura do topo — é o que um livro faz ao virar
  // a página, e sem isso o leitor cai no meio do verbete novo.
  //
  // O foco vai junto quando ficaria órfão: o link em que a pessoa clicou
  // sumiu com a página antiga (e com ele o foco), ou ela escolheu o verbete
  // na gaveta do índice, que se fecha. Com o índice fixo ao lado, o foco
  // fica onde está, para ela seguir descendo a lista com o teclado.
  useEffect(() => {
    const leitura = leituraRef.current;
    // `?.` também no método: nem todo ambiente de teste implementa scrollTo.
    leitura?.scrollTo?.({ top: 0, behavior: 'auto' });
    if (!montado.current) {
      montado.current = true;
      return;
    }
    const ativo = document.activeElement;
    const orfao = !ativo || ativo === document.body || leitura?.contains(ativo);
    const veioDaGaveta = emGaveta() && indiceRef.current?.contains(ativo);
    if (orfao || veioDaGaveta) leitura?.focus({ preventScroll: true });
  }, [atual]);

  // O verbete aberto mostra a gaveta a que pertence — ao chegar por um link,
  // por "voltar" ou por uma referência no texto, o índice acompanha.
  useEffect(() => {
    if (!entrada) return;
    setAbertos((anterior) =>
      anterior.has(entrada.categoria) ? anterior : new Set([...anterior, entrada.categoria]),
    );
  }, [entrada]);

  const fecharIndice = useCallback(() => {
    // Só devolve o foco ao botão quando ele estava dentro da gaveta: quem
    // está digitando na busca não pode perdê-lo porque a gaveta se fechou.
    const dentro = indiceRef.current?.contains(document.activeElement);
    setIndiceAberto(false);
    if (dentro) alternarRef.current?.focus();
  }, []);

  const limparBusca = useCallback(() => setConsulta(''), []);

  const achados = useMemo(() => (consulta.trim() ? buscar(consulta) : []), [consulta]);
  const buscando = consulta.trim().length > 0;

  // Esc desfaz uma coisa por vez: primeiro a gaveta, depois o texto da busca.
  useCamada(buscando, limparBusca);
  useCamada(indiceAberto, fecharIndice);

  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent): void => {
      const alvo = evento.target as HTMLElement | null;
      const digitando =
        alvo instanceof HTMLElement &&
        (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable);
      if (digitando) return;

      if (hotkeys && evento.key === '/' && !evento.ctrlKey && !evento.metaKey && !evento.altKey) {
        evento.preventDefault();
        buscaRef.current?.focus();
        return;
      }

      if (evento.altKey && evento.key === 'ArrowLeft') {
        evento.preventDefault();
        andar(-1);
      } else if (evento.altKey && evento.key === 'ArrowRight') {
        evento.preventDefault();
        andar(1);
      }
    };

    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [andar, hotkeys]);

  const aoDigitarNaBusca = (valor: string): void => {
    setConsulta(valor);
    // Os resultados moram no índice; numa tela estreita ele está fechado, e
    // quem digita não vê nada acontecer. Abre-o por baixo da busca.
    if (valor.trim() && emGaveta()) setIndiceAberto(true);
  };

  const aoTeclarNaBusca = (evento: React.KeyboardEvent<HTMLInputElement>): void => {
    if (evento.key === 'Enter') {
      const primeiro = achados[0];
      if (primeiro) {
        evento.preventDefault();
        navegar(primeiro.verbete.chave);
      }
    } else if (evento.key === 'ArrowDown' && buscando) {
      const primeiro = indiceRef.current?.querySelector<HTMLElement>('.indice__item');
      if (primeiro) {
        evento.preventDefault();
        primeiro.focus();
      }
    }
  };

  const alternarGaveta = (id: string): void => {
    setAbertos((anterior) => {
      const proximo = new Set(anterior);
      if (!proximo.delete(id)) proximo.add(id);
      return proximo;
    });
  };

  const todasAbertas = abertos.size >= CATEGORIAS.length;
  const alternarTodas = (): void =>
    setAbertos(todasAbertas ? new Set() : new Set(CATEGORIAS.map((categoria) => categoria.id)));

  const anterior = posicao > 0 ? (pilha[posicao - 1] ?? null) : undefined;

  return (
    <div className="codice" data-indice={indiceAberto ? 'aberto' : undefined}>
      <header className="codice__topo">
        <button
          type="button"
          ref={alternarRef}
          className="codice__indice-alternar"
          onClick={() => {
            const abrir = !indiceAberto;
            setIndiceAberto(abrir);
            // Quem abre a gaveta pelo teclado precisa entrar nela.
            if (abrir) {
              requestAnimationFrame(() =>
                indiceRef.current?.querySelector<HTMLElement>('button')?.focus(),
              );
            }
          }}
          aria-label="Índice"
          aria-expanded={indiceAberto}
          aria-controls="codice-indice"
          title="Índice"
        >
          <IconIndice size={18} />
        </button>

        <button
          type="button"
          className="codice__marca"
          onClick={() => navegar(null)}
          title="Voltar à capa"
        >
          <IconLivro size={20} />
          <span className="codice__marca-nome">O Códice</span>
          <span className="codice__marca-obra">The Annals of Valoran</span>
        </button>

        <div className="codice__historico">
          <button
            type="button"
            onClick={() => andar(-1)}
            disabled={posicao === 0}
            aria-label="Voltar"
            title="Voltar (Alt+←)"
          >
            <IconCima size={16} className="gira-esquerda" />
          </button>
          <button
            type="button"
            onClick={() => andar(1)}
            disabled={posicao >= pilha.length - 1}
            aria-label="Avançar"
            title="Avançar (Alt+→)"
          >
            <IconCima size={16} className="gira-direita" />
          </button>
        </div>

        <label className="codice__busca">
          <IconBusca size={16} />
          <input
            ref={buscaRef}
            type="search"
            value={consulta}
            onChange={(evento) => aoDigitarNaBusca(evento.target.value)}
            onKeyDown={aoTeclarNaBusca}
            placeholder={hotkeys ? 'Buscar no códice…  /' : 'Buscar no códice…'}
            aria-label="Buscar no códice"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <button
          type="button"
          className="codice__menu"
          onClick={() => irPara('menu')}
          aria-label="Menu principal"
          title="Menu principal"
        >
          <IconCasa size={17} />
          <span>Menu</span>
        </button>

        <button
          type="button"
          className="codice__fechar"
          onClick={() => sairDoCodice()}
          aria-label="Sair do códice"
          title="Sair (Esc)"
        >
          <IconFechar size={18} />
        </button>
      </header>

      <div className="codice__corpo">
        <nav className="codice__indice" id="codice-indice" ref={indiceRef} aria-label="Índice do códice">
          {/* Buscando, o que se quer é a lista de resultados — não três atalhos
              grandes empurrando-a para fora da primeira tela do celular. */}
          {buscando ? null : (
            <>
            <button
              type="button"
              className="indice__atlas"
              data-ativo={atual === null ? 'sim' : undefined}
              {...(atual === null ? { 'aria-current': 'page' as const } : {})}
              onClick={() => navegar(null)}
            >
              <IconLivro size={17} />
              <span>
                <strong>A Capa</strong>
                <small>A crônica em cinco eras e o acervo</small>
              </span>
            </button>

            <button
              type="button"
              className="indice__atlas"
              data-ativo={atual === ATLAS ? 'sim' : undefined}
              {...(atual === ATLAS ? { 'aria-current': 'page' as const } : {})}
              onClick={() => navegar(ATLAS)}
            >
              <IconMapa size={17} />
              <span>
                <strong>O Atlas</strong>
                <small>O mapa de 1575, em duas pranchas</small>
              </span>
            </button>

            <button
              type="button"
              className="indice__atlas"
              data-ativo={atual === CALENDARIO ? 'sim' : undefined}
              {...(atual === CALENDARIO ? { 'aria-current': 'page' as const } : {})}
              onClick={() => navegar(CALENDARIO)}
            >
              <IconOrbita size={17} />
              <span>
                <strong>O Almanaque</strong>
                <small>O céu vivo, os doze meses e a rota de Corvus</small>
              </span>
            </button>
            </>
          )}

          {buscando ? (
            <div className="indice__grupo">
              <p className="indice__rotulo" role="status">
                {achados.length === 0
                  ? 'Nada encontrado'
                  : `${achados.length} ${achados.length === 1 ? 'verbete' : 'verbetes'}`}
              </p>
              {achados.map(({ verbete: achado, origem }) => (
                <button
                  type="button"
                  className="indice__item"
                  key={achado.chave}
                  data-ativo={achado.chave === atual ? 'sim' : undefined}
                  {...(achado.chave === atual ? { 'aria-current': 'page' as const } : {})}
                  onClick={() => navegar(achado.chave)}
                >
                  <span>{achado.titulo}</span>
                  {tituloAmbiguo(achado.titulo) ? (
                    <small>{CATEGORIAS.find((c) => c.id === achado.categoria)?.singular}</small>
                  ) : origem === 'corpo' ? (
                    <small>no texto</small>
                  ) : origem === 'alcunha' ? (
                    <small>{achado.epiteto}</small>
                  ) : null}
                </button>
              ))}
              {achados.length === 0 ? (
                <p className="indice__vazio">
                  O arquivo não guarda esse nome. Tente “Keaton”, “Sindaren” ou “dragon”.
                </p>
              ) : null}
            </div>
          ) : (
            <>
              {/* Cento e setenta e seis nomes numa lista só é uma parede. Cada
                  gaveta abre e fecha, e a do verbete aberto já vem aberta. */}
              <div className="indice__gavetas-topo">
                <span className="indice__rotulo indice__rotulo--solto">O acervo</span>
                <button type="button" className="indice__alternar-todas" onClick={alternarTodas}>
                  {todasAbertas ? 'Fechar todas' : 'Abrir todas'}
                </button>
              </div>

              {CATEGORIAS.map((categoria) => {
                const itens = porCategoria(categoria.id);
                const aberto = abertos.has(categoria.id);
                return (
                  <div className="indice__grupo" key={categoria.id} data-aberto={aberto ? 'sim' : undefined}>
                    <button
                      type="button"
                      className="indice__gaveta"
                      aria-expanded={aberto}
                      aria-controls={`indice-gaveta-${categoria.id}`}
                      onClick={() => alternarGaveta(categoria.id)}
                    >
                      <IconBaixo size={14} className="indice__seta" />
                      <span className="indice__gaveta-nome">{categoria.rotulo}</span>
                      <span className="indice__gaveta-conta">{itens.length}</span>
                    </button>
                    {aberto ? (
                      <div id={`indice-gaveta-${categoria.id}`}>
                        {itens.map((item) => (
                          <button
                            type="button"
                            className="indice__item"
                            key={item.chave}
                            data-ativo={item.chave === atual ? 'sim' : undefined}
                            {...(item.chave === atual ? { 'aria-current': 'page' as const } : {})}
                            onClick={() => navegar(item.chave)}
                          >
                            {item.brasao ? <Brasao id={item.brasao} size={16} /> : null}
                            <span>{item.titulo}</span>
                            {tituloAmbiguo(item.titulo) ? <small>{categoria.singular}</small> : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </>
          )}

          <p className="indice__contagem">{VERBETES.length} verbetes</p>
        </nav>

        <div
          className="codice__fundo-indice"
          onClick={() => setIndiceAberto(false)}
          role="presentation"
        />

        <main
          className="codice__leitura"
          ref={leituraRef}
          tabIndex={-1}
          id="codice-leitura"
          data-foco-da-vista
        >
          {anterior !== undefined ? (
            <button type="button" className="codice__voltar" onClick={() => andar(-1)}>
              <IconCima size={16} className="gira-esquerda" />
              <span className="codice__voltar-acao">Voltar</span>
              <span className="codice__voltar-titulo">{tituloDe(anterior)}</span>
            </button>
          ) : null}

          {atual === ATLAS ? (
            <CodexAtlas aoNavegar={navegar} />
          ) : atual === CALENDARIO ? (
            <CodexCalendario aoNavegar={navegar} />
          ) : entrada ? (
            <CodexVerbete entrada={entrada} aoNavegar={navegar} />
          ) : (
            <CodexAbertura aoNavegar={navegar} />
          )}
        </main>
      </div>
    </div>
  );
}
