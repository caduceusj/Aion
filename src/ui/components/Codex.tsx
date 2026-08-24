import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIAS } from '@/codex/tipos';
import { VERBETES, buscar, porCategoria, tituloAmbiguo, verbete } from '@/codex/corpus';
import { Brasao } from '@/codex/valoran/heraldica';
import { useAionStore } from '@/state/store';
import {
  IconBusca,
  IconCasa,
  IconCima,
  IconFechar,
  IconIndice,
  IconLivro,
  IconMapa,
} from '@/ui/components/Icons';
import { CodexAbertura } from '@/ui/components/CodexAbertura';
import { CodexVerbete } from '@/ui/components/CodexVerbete';
import { CodexAtlas } from '@/ui/components/CodexAtlas';
import '@/ui/styles/codex.css';

/** Endereço de um verbete na barra do navegador: #codice/casa-keaton. */
const PREFIXO_HASH = '#codice/';

/** O Atlas não é um verbete: é uma vista própria, com endereço próprio. */
const ATLAS = '@atlas';

function chaveDaUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash.startsWith(PREFIXO_HASH)) return null;
  const chave = decodeURIComponent(hash.slice(PREFIXO_HASH.length));
  if (chave === ATLAS) return ATLAS;
  return verbete(chave) ? chave : null;
}

/**
 * O Códice: a lore da campanha por cima da mesa.
 *
 * Não é um painel do trilho — cobre a tela inteira, porque ler uma crônica
 * numa faixa de 320px é castigo. Os dados continuam rolando atrás, com o
 * feltro visível pelas bordas, para não parecer que o app trocou de página.
 *
 * A navegação é de navegador mesmo: pilha com voltar e avançar, e a chave do
 * verbete no hash da URL — assim um jogador manda "olha o verbete da Casa
 * Keaton" com um link em vez de instruções.
 */
export function Codex() {
  const sairDoCodice = useAionStore((state) => state.sairDoCodice);
  const irPara = useAionStore((state) => state.irPara);

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

  const leituraRef = useRef<HTMLDivElement | null>(null);
  const buscaRef = useRef<HTMLInputElement | null>(null);

  const atual = pilha[posicao] ?? null;
  const entrada = atual && atual !== ATLAS ? verbete(atual) : undefined;

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
  useEffect(() => {
    leituraRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [atual]);

  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent): void => {
      const alvo = evento.target as HTMLElement | null;
      const digitando =
        alvo instanceof HTMLElement &&
        (alvo.tagName === 'INPUT' || alvo.tagName === 'TEXTAREA' || alvo.isContentEditable);

      if (evento.key === '/' && !digitando) {
        evento.preventDefault();
        buscaRef.current?.focus();
        return;
      }
      if (evento.key === 'Escape' && digitando) {
        (alvo as HTMLElement).blur();
        return;
      }
      if (digitando) return;

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
  }, [andar]);

  const achados = useMemo(() => (consulta.trim() ? buscar(consulta) : []), [consulta]);
  const buscando = consulta.trim().length > 0;

  return (
    <div
      className="codice"
      role="dialog"
      aria-modal="true"
      aria-label="O Códice de Valoran"
      data-indice={indiceAberto ? 'aberto' : undefined}
    >
      <header className="codice__topo">
        <button
          type="button"
          className="codice__indice-alternar"
          onClick={() => setIndiceAberto((aberto) => !aberto)}
          aria-label="Índice"
          aria-expanded={indiceAberto}
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
            onChange={(evento) => setConsulta(evento.target.value)}
            placeholder="Buscar no códice…  /"
            aria-label="Buscar no códice"
          />
        </label>

        <button
          type="button"
          className="codice__menu"
          onClick={() => irPara('menu')}
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
        <nav className="codice__indice" aria-label="Índice do códice">
          <button
            type="button"
            className="indice__atlas"
            data-ativo={atual === ATLAS ? 'sim' : undefined}
            onClick={() => navegar(ATLAS)}
          >
            <IconMapa size={17} />
            <span>
              <strong>O Atlas</strong>
              <small>O mapa de 1575, em duas pranchas</small>
            </span>
          </button>

          {buscando ? (
            <div className="indice__grupo">
              <p className="indice__rotulo">
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
            CATEGORIAS.map((categoria) => (
              <div className="indice__grupo" key={categoria.id}>
                <p className="indice__rotulo">{categoria.rotulo}</p>
                {porCategoria(categoria.id).map((item) => (
                  <button
                    type="button"
                    className="indice__item"
                    key={item.chave}
                    data-ativo={item.chave === atual ? 'sim' : undefined}
                    onClick={() => navegar(item.chave)}
                  >
                    {item.brasao ? <Brasao id={item.brasao} size={16} /> : null}
                    <span>{item.titulo}</span>
                    {tituloAmbiguo(item.titulo) ? <small>{categoria.singular}</small> : null}
                  </button>
                ))}
              </div>
            ))
          )}

          <p className="indice__contagem">{VERBETES.length} verbetes</p>
        </nav>

        <div
          className="codice__fundo-indice"
          onClick={() => setIndiceAberto(false)}
          role="presentation"
        />

        <div className="codice__leitura" ref={leituraRef}>
          {atual === ATLAS ? (
            <CodexAtlas aoNavegar={navegar} />
          ) : entrada ? (
            <CodexVerbete entrada={entrada} aoNavegar={navegar} />
          ) : (
            <CodexAbertura aoNavegar={navegar} />
          )}
        </div>
      </div>
    </div>
  );
}
