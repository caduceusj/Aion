import { useEffect, useRef, useState } from 'react';
import type { PanelId } from '@/state/types';
import { useAionStore } from '@/state/store';
import { SKIN_COLORS } from '@/three/textures';
import { audio } from '@/audio/sfx';
import { useAtalhosGlobais } from '@/ui/hooks/useAtalhosGlobais';
import { Stage } from '@/ui/components/Stage';
import { Dock } from '@/ui/components/Dock';
import { ResultOverlay } from '@/ui/components/ResultOverlay';
import { HistoryRail } from '@/ui/components/HistoryRail';
import { MacroPanel, QuickMacroBar } from '@/ui/components/MacroPanel';
import { SettingsPanel } from '@/ui/components/SettingsPanel';
import { FichaPanel } from '@/ui/components/FichaPanel';
import { MesaPanel } from '@/ui/components/MesaPanel';
import { MesaVazia } from '@/ui/components/MesaVazia';
import { Avisos } from '@/ui/components/Avisos';
import { AtalhosDeTeclado } from '@/ui/components/AtalhosDeTeclado';
import { Codex } from '@/ui/components/Codex';
import { MenuPrincipal } from '@/ui/components/MenuPrincipal';
import {
  IconAjustes,
  IconAtalhos,
  IconDado,
  IconFechar,
  IconHistorico,
  IconMesa,
  IconFicha,
  IconLivro,
  IconPaineis,
} from '@/ui/components/Icons';
import '@/ui/styles/app.css';

type Painel = Exclude<PanelId, null>;

const PAINEIS: Array<{ id: Painel; rotulo: string; Icone: typeof IconDado }> = [
  { id: 'ficha', rotulo: 'Ficha', Icone: IconFicha },
  { id: 'historico', rotulo: 'Histórico', Icone: IconHistorico },
  { id: 'atalhos', rotulo: 'Atalhos', Icone: IconAtalhos },
  { id: 'mesa', rotulo: 'Mesa', Icone: IconMesa },
  { id: 'ajustes', rotulo: 'Ajustes', Icone: IconAjustes },
];

/** Largura a partir da qual o trilho lateral fica sempre visível. */
const LARGURA_TRILHO_FIXO = 1100;

const TITULO_DO_SITE = 'Aion — Mesa de Dados';

export function App() {
  const panel = useAionStore((state) => state.panel);
  const vista = useAionStore((state) => state.vista);
  const setPanel = useAionStore((state) => state.setPanel);
  const irPara = useAionStore((state) => state.irPara);
  const characters = useAionStore((state) => state.characters);
  const activeCharacterId = useAionStore((state) => state.activeCharacterId);
  const setActiveCharacter = useAionStore((state) => state.setActiveCharacter);
  const defaultSkin = useAionStore((state) => state.settings.defaultSkin);
  const sound = useAionStore((state) => state.settings.sound);
  const volume = useAionStore((state) => state.settings.volume);

  const [ajudaTeclado, setAjudaTeclado] = useState(false);

  const desbloqueado = useRef(false);
  const trilhoRef = useRef<HTMLElement | null>(null);
  const rodapeRef = useRef<HTMLDivElement | null>(null);
  /** O painel que a pessoa viu por último: é o que o botão do celular reabre. */
  const ultimoPainel = useRef<Painel>('historico');
  /** Abertura feita pelo próprio app (trilho de tela larga): não leva o foco. */
  const aberturaAutomatica = useRef(false);

  useAtalhosGlobais(() => setAjudaTeclado(true));

  // O navegador só deixa criar som dentro de um gesto do usuário.
  useEffect(() => {
    const desbloquear = (): void => {
      if (desbloqueado.current) return;
      desbloqueado.current = true;
      audio.unlock();
      audio.setEnabled(useAionStore.getState().settings.sound);
      audio.setVolume(useAionStore.getState().settings.volume);
    };

    window.addEventListener('pointerdown', desbloquear, { once: true });
    window.addEventListener('keydown', desbloquear, { once: true });
    return () => {
      window.removeEventListener('pointerdown', desbloquear);
      window.removeEventListener('keydown', desbloquear);
    };
  }, []);

  useEffect(() => {
    audio.setEnabled(sound);
  }, [sound]);

  useEffect(() => {
    audio.setVolume(volume);
  }, [volume]);

  // Cada tela tem o próprio título de aba — quem tem várias abertas, ou
  // volta pelo histórico, precisa saber onde está. O Códice, que muda de
  // título a cada verbete, cuida do dele.
  useEffect(() => {
    if (vista === 'menu') document.title = TITULO_DO_SITE;
    else if (vista === 'mesa') document.title = 'A Mesa · Aion';
  }, [vista]);

  // Trocar de tela troca o conteúdo debaixo do foco: o botão em que a pessoa
  // clicou desaparece e o foco cai no <body>, de onde um leitor de tela
  // recomeça do topo sem saber que algo mudou. Leva-o ao conteúdo novo.
  const primeiraVista = useRef(true);
  useEffect(() => {
    if (primeiraVista.current) {
      primeiraVista.current = false;
      return;
    }
    document.querySelector<HTMLElement>('[data-foco-da-vista]')?.focus({ preventScroll: true });
  }, [vista]);

  /**
   * Um link para um verbete abre o Códice sozinho.
   *
   * O hash `#codice/<chave>` é lido lá dentro, mas quem chega pelo link
   * ainda não tem o Códice montado para ler coisa alguma — sem isto, o
   * endereço carregaria a mesa e ficaria esperando um clique que a pessoa
   * não tem como adivinhar que precisa dar.
   *
   * Vem antes do trilho de tela larga de propósito: com o painel já
   * definido aqui, o histórico não rouba a abertura.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const abrirSeForVerbete = (): void => {
      if (window.location.hash.startsWith('#codice/')) {
        useAionStore.getState().irPara('codice');
      }
    };

    abrirSeForVerbete();
    // Também vale para um link colado com o app já aberto: aí não há
    // recarga, e sem escutar `hashchange` a barra mudaria e a tela não.
    window.addEventListener('hashchange', abrirSeForVerbete);
    return () => window.removeEventListener('hashchange', abrirSeForVerbete);
  }, []);

  // Em telas largas o trilho é permanente e mostra o histórico por padrão.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia(`(min-width: ${LARGURA_TRILHO_FIXO}px)`);

    const aplicar = (): void => {
      const store = useAionStore.getState();
      if (media.matches && store.vista === 'mesa' && store.panel === null) {
        aberturaAutomatica.current = true;
        store.setPanel('historico');
      }
    };

    aplicar();
    media.addEventListener('change', aplicar);
    return () => media.removeEventListener('change', aplicar);
    // `vista` entra na lista: o trilho abre ao chegar na Mesa, não só quando a
    // janela cruza a largura — quem vem do menu ou do Códice cai nela com o
    // painel fechado (os dois fecham o trilho ao sair).
  }, [vista]);

  /**
   * A doca da Mesa tem altura que muda: em celular são três fileiras, e a
   * mensagem de erro soma mais uma. O que precisa ficar acima dela — o
   * resultado, a dica de mesa vazia, os avisos — lê a altura real daqui, em
   * vez de chutar um número que só vale numa tela.
   */
  useEffect(() => {
    const rodape = rodapeRef.current;
    if (vista !== 'mesa' || !rodape || typeof ResizeObserver === 'undefined') return undefined;

    const raiz = document.documentElement;
    const medir = (): void => {
      raiz.style.setProperty('--rodape-h', `${Math.ceil(rodape.getBoundingClientRect().height)}px`);
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(rodape);
    return () => {
      observador.disconnect();
      raiz.style.removeProperty('--rodape-h');
    };
  }, [vista]);

  // O foco acompanha o painel: abrir leva a ele, fechar devolve a quem abriu.
  // Sem isso, quem usa teclado aperta H e continua parado no cabeçalho, com o
  // painel novo no fim da ordem de tabulação.
  const painelAnterior = useRef<PanelId>(null);
  const origemDoFoco = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const abriu = painelAnterior.current === null && panel !== null;
    const fechou = painelAnterior.current !== null && panel === null;
    painelAnterior.current = panel;

    if (panel !== null) ultimoPainel.current = panel;

    if (abriu) {
      const automatica = aberturaAutomatica.current;
      aberturaAutomatica.current = false;
      if (automatica) return;
      origemDoFoco.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      trilhoRef.current?.focus({ preventScroll: true });
    } else if (fechou) {
      const origem = origemDoFoco.current;
      origemDoFoco.current = null;
      // Só devolve se o foco ficou sem dono — quando o painel some com ele
      // dentro, o navegador o larga no <body>.
      const solto = !document.activeElement || document.activeElement === document.body;
      if (origem?.isConnected && solto) origem.focus({ preventScroll: true });
    }
  }, [panel]);

  const personagem = characters.find((item) => item.id === activeCharacterId) ?? null;
  const skinAtiva = personagem?.skin ?? defaultSkin;

  const conteudo = ((): React.ReactNode => {
    if (vista === 'menu') return <MenuPrincipal />;
    if (vista === 'codice') return <Codex />;

    return (
      <div className="app" data-trilho={panel !== null ? 'sim' : undefined}>
        <header className="cabecalho">
          <button
            type="button"
            className="marca marca--botao"
            onClick={() => irPara('menu')}
            title="Voltar ao menu (Esc)"
            aria-label="Voltar ao menu"
          >
            <IconDado size={22} className="marca__glifo" />
            <span className="marca__nome">Aion</span>
          </button>

          <div className="cabecalho__direita">
            {characters.length > 0 ? (
              <label className="seletor-personagem">
                <span
                  className="seletor-personagem__cor"
                  style={{ background: SKIN_COLORS[skinAtiva].body }}
                  aria-hidden="true"
                />
                <select
                  value={activeCharacterId ?? ''}
                  onChange={(event) => setActiveCharacter(event.target.value || null)}
                  aria-label="Personagem ativo"
                >
                  <option value="">A mesa</option>
                  {characters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <button
              type="button"
              className="cabecalho__codice"
              onClick={() => irPara('codice')}
              aria-label="Abrir o Códice"
              title="O Códice (C)"
            >
              <IconLivro size={17} />
              <span>Códice</span>
            </button>

            {/* Cinco ícones não cabem ao lado do resto num celular. Aqui vira
                um botão só, que reabre o último painel; a troca entre painéis
                fica nas abas de dentro da gaveta. */}
            <button
              type="button"
              className="cabecalho__paineis"
              onClick={() => setPanel(ultimoPainel.current)}
              aria-label="Abrir os painéis"
              aria-haspopup="dialog"
              title="Ficha, histórico, atalhos, mesa e ajustes"
            >
              <IconPaineis size={19} />
            </button>

            <nav className="cabecalho__nav" aria-label="Painéis">
              {PAINEIS.map(({ id, rotulo, Icone }) => (
                <button
                  key={id}
                  type="button"
                  className="cabecalho__botao"
                  data-ativo={panel === id ? 'sim' : undefined}
                  onClick={() => setPanel(panel === id ? null : id)}
                  aria-label={rotulo}
                  aria-pressed={panel === id}
                  title={rotulo}
                >
                  <Icone size={19} />
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="mesa" id="mesa" tabIndex={-1} aria-labelledby="mesa-titulo" data-foco-da-vista>
          <h1 className="sr-only" id="mesa-titulo">
            A Mesa
          </h1>
          <Stage />
          <ResultOverlay />
          <MesaVazia />

          <div className="rodape-mesa" ref={rodapeRef}>
            <QuickMacroBar />
            <Dock />
          </div>
        </main>

        {panel !== null ? (
          <>
            <div className="trilho-fundo" onClick={() => setPanel(null)} role="presentation" />
            <aside
              className="trilho"
              ref={trilhoRef}
              tabIndex={-1}
              aria-label={PAINEIS.find((p) => p.id === panel)?.rotulo}
            >
              <button
                type="button"
                className="trilho__fechar"
                onClick={() => setPanel(null)}
                aria-label="Fechar o painel"
              >
                <IconFechar size={18} />
              </button>

              {/* Em telas estreitas a gaveta cobre o cabeçalho, então trocar de
                  painel exigiria fechá-la antes. Estas abas resolvem isso. */}
              <nav className="trilho__abas" aria-label="Trocar de painel">
                {PAINEIS.map(({ id, rotulo, Icone }) => (
                  <button
                    key={id}
                    type="button"
                    className="trilho__aba"
                    data-ativo={panel === id ? 'sim' : undefined}
                    onClick={() => setPanel(id)}
                    aria-label={rotulo}
                    aria-pressed={panel === id}
                  >
                    <Icone size={17} />
                  </button>
                ))}
              </nav>
              {panel === 'ficha' ? <FichaPanel /> : null}
              {panel === 'historico' ? <HistoryRail /> : null}
              {panel === 'atalhos' ? <MacroPanel /> : null}
              {panel === 'mesa' ? <MesaPanel /> : null}
              {panel === 'ajustes' ? <SettingsPanel /> : null}
            </aside>
          </>
        ) : null}
      </div>
    );
  })();

  return (
    <>
      {conteudo}
      <Avisos />
      {ajudaTeclado ? (
        <AtalhosDeTeclado vista={vista} aoFechar={() => setAjudaTeclado(false)} />
      ) : null}
    </>
  );
}
