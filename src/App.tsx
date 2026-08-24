import { useEffect, useRef } from 'react';
import type { PolyhedronKind } from '@/engine/types';
import type { PanelId } from '@/state/types';
import { useAionStore } from '@/state/store';
import { SKIN_COLORS } from '@/three/textures';
import { audio } from '@/audio/sfx';
import { Stage } from '@/ui/components/Stage';
import { Dock } from '@/ui/components/Dock';
import { ResultOverlay } from '@/ui/components/ResultOverlay';
import { HistoryRail } from '@/ui/components/HistoryRail';
import { MacroPanel, QuickMacroBar } from '@/ui/components/MacroPanel';
import { SettingsPanel } from '@/ui/components/SettingsPanel';
import { FichaPanel } from '@/ui/components/FichaPanel';
import { MesaPanel } from '@/ui/components/MesaPanel';
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
} from '@/ui/components/Icons';
import '@/ui/styles/app.css';

const HOTKEY_DICE: Record<string, PolyhedronKind> = {
  '1': 'd4',
  '2': 'd6',
  '3': 'd8',
  '4': 'd10',
  '5': 'd12',
  '6': 'd20',
  '7': 'd100',
  '8': 'dF',
};

const PAINEIS: Array<{ id: Exclude<PanelId, null>; rotulo: string; Icone: typeof IconDado }> = [
  { id: 'ficha', rotulo: 'Ficha', Icone: IconFicha },
  { id: 'historico', rotulo: 'Histórico', Icone: IconHistorico },
  { id: 'atalhos', rotulo: 'Atalhos', Icone: IconAtalhos },
  { id: 'mesa', rotulo: 'Mesa', Icone: IconMesa },
  { id: 'ajustes', rotulo: 'Ajustes', Icone: IconAjustes },
];

/** Largura a partir da qual o trilho lateral fica sempre visível. */
const LARGURA_TRILHO_FIXO = 1100;

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

  const desbloqueado = useRef(false);

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const alvo = event.target as HTMLElement | null;
      const digitando =
        alvo instanceof HTMLElement &&
        (alvo.tagName === 'INPUT' ||
          alvo.tagName === 'TEXTAREA' ||
          alvo.tagName === 'SELECT' ||
          alvo.isContentEditable);

      const store = useAionStore.getState();

      if (event.key === 'Escape') {
        event.preventDefault();
        if (store.vista === 'codice') store.sairDoCodice();
        else if (store.panel !== null) store.setPanel(null);
        else if (store.vista === 'mesa') store.irPara('menu');
        return;
      }

      if (digitando) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // O Códice abre e fecha pela mesma tecla, de qualquer vista — por isso
      // vem antes da guarda logo abaixo.
      if (event.key.toLowerCase() === 'c') {
        event.preventDefault();
        if (store.vista === 'codice') store.sairDoCodice();
        else store.irPara('codice');
        return;
      }

      // Fora da mesa as letras são para ler e buscar; rolar dados por baixo
      // do que está sendo lido seria só barulho.
      if (store.vista !== 'mesa') return;

      if (event.key === 'Enter') {
        event.preventDefault();
        window.dispatchEvent(new Event('aion:focar-notacao'));
        return;
      }

      const dado = HOTKEY_DICE[event.key];
      if (dado) {
        event.preventDefault();
        store.rollQuick(dado);
        return;
      }

      const tecla = event.key.toLowerCase();
      if (tecla === 'r') {
        event.preventDefault();
        store.repeatLast();
      } else if (tecla === 'v') {
        event.preventDefault();
        store.rollAdvantage('vantagem');
      } else if (tecla === 'd') {
        event.preventDefault();
        store.rollAdvantage('desvantagem');
      } else if (tecla === 'h') {
        event.preventDefault();
        store.setPanel(store.panel === 'historico' ? null : 'historico');
      } else if (tecla === 'a') {
        event.preventDefault();
        store.setPanel(store.panel === 'atalhos' ? null : 'atalhos');
      } else if (tecla === 'f') {
        event.preventDefault();
        store.setPanel(store.panel === 'ficha' ? null : 'ficha');
      } else if (tecla === 'm') {
        event.preventDefault();
        store.setPanel(store.panel === 'mesa' ? null : 'mesa');
      } else if (event.key === ',') {
        event.preventDefault();
        store.setPanel('ajustes');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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
        store.setPanel('historico');
      }
    };

    aplicar();
    media.addEventListener('change', aplicar);
    return () => media.removeEventListener('change', aplicar);
  }, []);

  const personagem = characters.find((item) => item.id === activeCharacterId) ?? null;
  const skinAtiva = personagem?.skin ?? defaultSkin;

  if (vista === 'menu') return <MenuPrincipal />;
  if (vista === 'codice') return <Codex />;

  return (
    <div className="app" data-trilho={panel !== null ? 'sim' : undefined}>
      <Stage />

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
            title="O Códice (C)"
          >
            <IconLivro size={17} />
            <span>Códice</span>
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

      <ResultOverlay />

      <div className="rodape-mesa">
        <QuickMacroBar />
        <Dock />
      </div>

      {panel !== null ? (
        <>
          <div
            className="trilho-fundo"
            onClick={() => setPanel(null)}
            role="presentation"
          />
          <aside className="trilho" aria-label={PAINEIS.find((p) => p.id === panel)?.rotulo}>
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
}
