import { useState } from 'react';
import type { DiceSkin } from '@/state/types';
import { useAionStore } from '@/state/store';
import { SKIN_COLORS, SKIN_ORDER } from '@/three/textures';
import { audio } from '@/audio/sfx';
import { IconLixeira, IconMais } from './Icons';
import '@/ui/styles/settings.css';

const ATALHOS_TECLADO: Array<[string, string]> = [
  ['Enter', 'Foca o campo de notação'],
  ['1 – 8', 'Rola d4, d6, d8, d10, d12, d20, d100, dF'],
  ['R', 'Repete a última rolagem'],
  ['V / D', 'Vantagem / desvantagem'],
  ['H', 'Abre e fecha o histórico'],
  ['A', 'Abre e fecha os atalhos'],
  [',', 'Abre os ajustes'],
  ['Esc', 'Fecha o painel aberto'],
];

function Interruptor({
  id,
  rotulo,
  descricao,
  valor,
  aoMudar,
}: {
  id: string;
  rotulo: string;
  descricao: string;
  valor: boolean;
  aoMudar: (valor: boolean) => void;
}) {
  return (
    <div className="ajuste">
      <label className="ajuste__rotulo" htmlFor={id}>
        <span className="ajuste__nome">{rotulo}</span>
        <span className="ajuste__descricao">{descricao}</span>
      </label>
      <button
        type="button"
        id={id}
        className="interruptor"
        role="switch"
        aria-checked={valor}
        onClick={() => aoMudar(!valor)}
      >
        <span className="interruptor__marcador" />
      </button>
    </div>
  );
}

function Deslizante({
  id,
  rotulo,
  descricao,
  valor,
  min,
  max,
  passo,
  formatar,
  aoMudar,
}: {
  id: string;
  rotulo: string;
  descricao: string;
  valor: number;
  min: number;
  max: number;
  passo: number;
  formatar: (valor: number) => string;
  aoMudar: (valor: number) => void;
}) {
  return (
    <div className="ajuste ajuste--coluna">
      <label className="ajuste__rotulo" htmlFor={id}>
        <span className="ajuste__nome">
          {rotulo}
          <span className="ajuste__valor mono">{formatar(valor)}</span>
        </span>
        <span className="ajuste__descricao">{descricao}</span>
      </label>
      <input
        id={id}
        className="deslizante"
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valor}
        onChange={(event) => aoMudar(Number(event.target.value))}
      />
    </div>
  );
}

export function SettingsPanel() {
  const settings = useAionStore((state) => state.settings);
  const characters = useAionStore((state) => state.characters);
  const activeCharacterId = useAionStore((state) => state.activeCharacterId);
  const historyLength = useAionStore((state) => state.history.length);

  const updateSettings = useAionStore((state) => state.updateSettings);
  const addCharacter = useAionStore((state) => state.addCharacter);
  const updateCharacter = useAionStore((state) => state.updateCharacter);
  const removeCharacter = useAionStore((state) => state.removeCharacter);
  const setActiveCharacter = useAionStore((state) => state.setActiveCharacter);
  const clearHistory = useAionStore((state) => state.clearHistory);

  const [novoNome, setNovoNome] = useState('');
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);

  const aplicarSom = (ligado: boolean): void => {
    updateSettings({ sound: ligado });
    audio.setEnabled(ligado);
  };

  const aplicarVolume = (valor: number): void => {
    updateSettings({ volume: valor });
    audio.setVolume(valor);
  };

  return (
    <div className="ajustes">
      <header className="ajustes__topo">
        <h2 className="ajustes__titulo">Ajustes</h2>
      </header>

      <div className="ajustes__corpo">
        <section className="ajustes__secao">
          <h3 className="rotulo ajustes__secao-titulo">Mesa</h3>

          <Interruptor
            id="cfg-fisica"
            rotulo="Dados 3D"
            descricao="Física real na mesa. Desligado, o resultado aparece na hora."
            valor={settings.physics3d}
            aoMudar={(valor) => updateSettings({ physics3d: valor })}
          />
          <Deslizante
            id="cfg-velocidade"
            rotulo="Velocidade"
            descricao="Quão rápido os dados assentam."
            valor={settings.rollSpeed}
            min={0.5}
            max={2}
            passo={0.1}
            formatar={(valor) => `${valor.toFixed(1)}×`}
            aoMudar={(valor) => updateSettings({ rollSpeed: valor })}
          />
          <Interruptor
            id="cfg-mestre"
            rotulo="Modo mestre"
            descricao="Novas rolagens nascem ocultas, para você revelar quando quiser."
            valor={settings.gmMode}
            aoMudar={(valor) => updateSettings({ gmMode: valor })}
          />
          <Interruptor
            id="cfg-sementes"
            rotulo="Mostrar sementes"
            descricao="Exibe a semente de cada rolagem, para conferir um resultado."
            valor={settings.showSeeds}
            aoMudar={(valor) => updateSettings({ showSeeds: valor })}
          />
        </section>

        <section className="ajustes__secao">
          <h3 className="rotulo ajustes__secao-titulo">Som e toque</h3>

          <Interruptor
            id="cfg-som"
            rotulo="Efeitos sonoros"
            descricao="Impactos, críticos e falhas."
            valor={settings.sound}
            aoMudar={aplicarSom}
          />
          <Deslizante
            id="cfg-volume"
            rotulo="Volume"
            descricao="Nível geral dos efeitos."
            valor={settings.volume}
            min={0}
            max={1}
            passo={0.05}
            formatar={(valor) => `${Math.round(valor * 100)}%`}
            aoMudar={aplicarVolume}
          />
          <Interruptor
            id="cfg-vibracao"
            rotulo="Vibração"
            descricao="Resposta tátil no celular."
            valor={settings.haptics}
            aoMudar={(valor) => updateSettings({ haptics: valor })}
          />
          <Interruptor
            id="cfg-movimento"
            rotulo="Movimento reduzido"
            descricao="Desliga física, partículas e tremores."
            valor={settings.reducedMotion}
            aoMudar={(valor) => updateSettings({ reducedMotion: valor })}
          />
        </section>

        <section className="ajustes__secao">
          <h3 className="rotulo ajustes__secao-titulo">Dados padrão</h3>
          <p className="ajustes__nota">
            Usado quando não há personagem ativo.
          </p>
          <div className="skins">
            {SKIN_ORDER.map((skin) => (
              <button
                key={skin}
                type="button"
                className="skin"
                data-ativo={settings.defaultSkin === skin ? 'sim' : undefined}
                style={{ background: SKIN_COLORS[skin].body }}
                onClick={() => updateSettings({ defaultSkin: skin })}
                aria-label={SKIN_COLORS[skin].label}
                aria-pressed={settings.defaultSkin === skin}
                title={SKIN_COLORS[skin].label}
              />
            ))}
          </div>
        </section>

        <section className="ajustes__secao">
          <h3 className="rotulo ajustes__secao-titulo">Personagens</h3>

          <ul className="personagens">
            {characters.map((character) => (
              <li className="personagem" key={character.id} data-ativo={character.id === activeCharacterId ? 'sim' : undefined}>
                <button
                  type="button"
                  className="personagem__ativar"
                  onClick={() => setActiveCharacter(character.id)}
                  aria-label={`Ativar ${character.name}`}
                  aria-pressed={character.id === activeCharacterId}
                  style={{ background: SKIN_COLORS[character.skin].body }}
                />
                <input
                  className="personagem__nome"
                  value={character.name}
                  maxLength={40}
                  onChange={(event) =>
                    updateCharacter(character.id, { name: event.target.value })
                  }
                  aria-label={`Nome de ${character.name}`}
                />
                <select
                  className="personagem__skin"
                  value={character.skin}
                  onChange={(event) =>
                    updateCharacter(character.id, { skin: event.target.value as DiceSkin })
                  }
                  aria-label={`Cor dos dados de ${character.name}`}
                >
                  {SKIN_ORDER.map((skin) => (
                    <option key={skin} value={skin}>
                      {SKIN_COLORS[skin].label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="personagem__remover"
                  onClick={() => removeCharacter(character.id)}
                  aria-label={`Remover ${character.name}`}
                  title="Remover"
                >
                  <IconLixeira size={15} />
                </button>
              </li>
            ))}
          </ul>

          <form
            className="personagem-novo"
            onSubmit={(event) => {
              event.preventDefault();
              if (novoNome.trim().length === 0) return;
              addCharacter(novoNome, settings.defaultSkin);
              setNovoNome('');
            }}
          >
            <input
              className="personagem-novo__campo"
              value={novoNome}
              onChange={(event) => setNovoNome(event.target.value)}
              placeholder="Nome do personagem"
              maxLength={40}
              aria-label="Nome do novo personagem"
            />
            <button type="submit" className="personagem-novo__botao" disabled={novoNome.trim().length === 0}>
              <IconMais size={16} />
              <span>Adicionar</span>
            </button>
          </form>
        </section>

        <section className="ajustes__secao">
          <h3 className="rotulo ajustes__secao-titulo">Atalhos de teclado</h3>
          <dl className="teclas">
            {ATALHOS_TECLADO.map(([tecla, acao]) => (
              <div className="teclas__linha" key={tecla}>
                <dt>
                  <kbd className="tecla">{tecla}</kbd>
                </dt>
                <dd>{acao}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ajustes__secao">
          <h3 className="rotulo ajustes__secao-titulo">Dados guardados</h3>
          <button
            type="button"
            className={`ajustes__perigo${confirmandoLimpeza ? ' ajustes__perigo--confirma' : ''}`}
            disabled={historyLength === 0}
            onClick={() => {
              if (!confirmandoLimpeza) {
                setConfirmandoLimpeza(true);
                setTimeout(() => setConfirmandoLimpeza(false), 3500);
                return;
              }
              clearHistory();
              setConfirmandoLimpeza(false);
            }}
          >
            <IconLixeira size={16} />
            <span>
              {confirmandoLimpeza
                ? 'Confirmar: apagar tudo?'
                : `Limpar histórico (${historyLength})`}
            </span>
          </button>
          <p className="ajustes__nota">
            Tudo fica só neste navegador. O Aion não envia nada para lugar nenhum.
          </p>
        </section>
      </div>
    </div>
  );
}
