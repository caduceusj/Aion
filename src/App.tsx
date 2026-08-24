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
  { id: 'codice', rotulo: 'Códice', Icone: IconLivro },
  { id: 'historico', rotulo: 'Histórico', Icone: IconHistorico },
  { id: 'atalhos', rotulo: 'Atalhos', Icone: IconAtalhos },
  { id: 'mesa', rotulo: 'Mesa', Icone: IconMesa },
  { id: 'ajustes', rotulo: 'Ajustes', Icone: IconAjustes },
];

/** Largura a partir da qual o trilho lateral fica sempre visível. */
const LARGURA_TRILHO_FIXO = 1100;

export function App() {
  const panel = useAionStore((state) => state.panel);
  const setPanel = useAionStore((state) => state.setPanel);
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
        if (store.panel !== null) {
          event.preventDefault();
          store.setPanel(null);
        }
        return;
      }

      if (digitando) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      // O códice abre e fecha pela mesma tecla, inclusive por cima de si
      // mesmo — por isso vem antes da guarda logo abaixo.
      if (event.key.toLowerCase() === 'c') {
        event.preventDefault();
        store.setPanel(store.panel === 'codice' ? null : 'codice');
        return;
      }

      // Com o códice aberto, as letras são para ler e buscar; rolar dados
      // por baixo do que está sendo lido seria só barulho.
      if (store.panel === 'codice') return;

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

  // Em telas largas o trilho é permanente e mostra o histórico por padrão.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia(`(min-width: ${LARGURA_TRILHO_FIXO}px)`);

    const aplicar = (): void => {
      const store = useAionStore.getState();
      if (media.matches && store.panel === null) store.setPanel('historico');
    };

    aplicar();
    media.addEventListener('change', aplicar);
    return () => media.removeEventListener('change', aplicar);
  }, []);

  const personagem = characters.find((item) => item.id === activeCharacterId) ?? null;
  const skinAtiva = personagem?.skin ?? defaultSkin;

  return (
    <div className="app" data-trilho={panel !== null && panel !== 'codice' ? 'sim' : undefined}>
      <Stage />

      <header className="cabecalho">
        <div className="marca">
          <IconDado size={22} className="marca__glifo" />
          <span className="marca__nome">Aion</span>
        </div>

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

      {panel === 'codice' ? <Codex /> : null}

      {panel !== null && panel !== 'codice' ? (
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
