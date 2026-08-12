import { useMemo, useState } from 'react';
import type { Macro } from '@/state/types';
import { useAionStore } from '@/state/store';
import { audio } from '@/audio/sfx';
import { MacroEditor } from './MacroEditor';
import {
  IconAtalhos,
  IconBaixo,
  IconCima,
  IconLapis,
  IconLixeira,
  IconMais,
} from './Icons';
import '@/ui/styles/macros.css';

function MacroCard({ macro, onEdit }: { macro: Macro; onEdit: (macro: Macro) => void }) {
  const runMacro = useAionStore((state) => state.runMacro);
  const removeMacro = useAionStore((state) => state.removeMacro);
  const moveMacro = useAionStore((state) => state.moveMacro);
  const sound = useAionStore((state) => state.settings.sound);
  const [confirmando, setConfirmando] = useState(false);

  return (
    <li className="atalho">
      <button
        type="button"
        className="atalho__corpo"
        onClick={() => {
          if (sound) audio.click();
          runMacro(macro.id);
        }}
      >
        <span className="atalho__glifo" aria-hidden="true">
          {macro.glyph}
        </span>
        <span className="atalho__texto">
          <span className="atalho__nome">{macro.name}</span>
          <span className="atalho__expressao mono">{macro.expression}</span>
        </span>
        {macro.uses > 0 ? (
          <span className="atalho__usos" title={`Usado ${macro.uses}×`}>
            {macro.uses}×
          </span>
        ) : null}
      </button>

      <div className="atalho__acoes">
        <button
          type="button"
          className="atalho__acao"
          onClick={() => moveMacro(macro.id, -1)}
          aria-label={`Subir ${macro.name}`}
          title="Subir"
        >
          <IconCima size={14} />
        </button>
        <button
          type="button"
          className="atalho__acao"
          onClick={() => moveMacro(macro.id, 1)}
          aria-label={`Descer ${macro.name}`}
          title="Descer"
        >
          <IconBaixo size={14} />
        </button>
        <button
          type="button"
          className="atalho__acao"
          onClick={() => onEdit(macro)}
          aria-label={`Editar ${macro.name}`}
          title="Editar"
        >
          <IconLapis size={14} />
        </button>
        <button
          type="button"
          className={`atalho__acao${confirmando ? ' atalho__acao--confirma' : ''}`}
          onClick={() => {
            if (!confirmando) {
              setConfirmando(true);
              setTimeout(() => setConfirmando(false), 3000);
              return;
            }
            removeMacro(macro.id);
          }}
          aria-label={confirmando ? `Confirmar remoção de ${macro.name}` : `Remover ${macro.name}`}
          title={confirmando ? 'Clique de novo para confirmar' : 'Remover'}
        >
          <IconLixeira size={14} />
        </button>
      </div>
    </li>
  );
}

export function MacroPanel() {
  const macros = useAionStore((state) => state.macros);
  const activeCharacterId = useAionStore((state) => state.activeCharacterId);
  const characters = useAionStore((state) => state.characters);

  const [editando, setEditando] = useState<Macro | null>(null);
  const [criando, setCriando] = useState(false);
  const [porUso, setPorUso] = useState(false);

  const ordenar = (list: Macro[]): Macro[] =>
    [...list].sort((a, b) => (porUso ? b.uses - a.uses : a.order - b.order));

  const doPersonagem = useMemo(
    () => ordenar(macros.filter((macro) => macro.characterId === activeCharacterId)),
    [macros, activeCharacterId, porUso],
  );

  const daMesa = useMemo(
    () => ordenar(macros.filter((macro) => macro.characterId === null)),
    [macros, porUso],
  );

  const personagem = characters.find((item) => item.id === activeCharacterId) ?? null;
  const vazio = macros.length === 0;

  const abrirEditor = (macro: Macro): void => {
    setEditando(macro);
    setCriando(false);
  };

  return (
    <div className="atalhos">
      <header className="atalhos__topo">
        <h2 className="atalhos__titulo">Atalhos</h2>
        <div className="atalhos__acoes-topo">
          {macros.length > 1 ? (
            <button
              type="button"
              className="atalhos__ordenar"
              onClick={() => setPorUso((value) => !value)}
              aria-pressed={porUso}
              title="Alternar entre ordem manual e frequência de uso"
            >
              {porUso ? 'Por uso' : 'Manual'}
            </button>
          ) : null}
          <button
            type="button"
            className="atalhos__novo"
            onClick={() => {
              setCriando(true);
              setEditando(null);
            }}
          >
            <IconMais size={16} />
            <span>Novo</span>
          </button>
        </div>
      </header>

      {vazio ? (
        <div className="atalhos__vazio">
          <IconAtalhos size={44} />
          <p className="atalhos__vazio-titulo">Nenhum atalho ainda</p>
          <p className="atalhos__vazio-texto">
            Salve as rolagens que você repete toda sessão — ataque, dano, iniciativa —
            e role cada uma com um toque.
          </p>
          <button
            type="button"
            className="atalhos__novo"
            onClick={() => {
              setCriando(true);
              setEditando(null);
            }}
          >
            <IconMais size={16} />
            <span>Criar o primeiro</span>
          </button>
        </div>
      ) : (
        <div className="atalhos__corpo">
          {doPersonagem.length > 0 ? (
            <section className="atalhos__secao">
              <h3 className="rotulo atalhos__secao-titulo">
                {personagem ? personagem.name : 'Sem personagem'}
              </h3>
              <ul className="atalhos__lista">
                {doPersonagem.map((macro) => (
                  <MacroCard key={macro.id} macro={macro} onEdit={abrirEditor} />
                ))}
              </ul>
            </section>
          ) : null}

          {daMesa.length > 0 ? (
            <section className="atalhos__secao">
              <h3 className="rotulo atalhos__secao-titulo">Da mesa</h3>
              <ul className="atalhos__lista">
                {daMesa.map((macro) => (
                  <MacroCard key={macro.id} macro={macro} onEdit={abrirEditor} />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      {criando || editando ? (
        <MacroEditor
          macro={editando}
          onClose={() => {
            setCriando(false);
            setEditando(null);
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * Faixa compacta com os atalhos mais usados do personagem ativo, para ficar
 * logo acima da doca. Não renderiza nada quando não há o que mostrar.
 */
export function QuickMacroBar() {
  const macros = useAionStore((state) => state.macros);
  const activeCharacterId = useAionStore((state) => state.activeCharacterId);
  const runMacro = useAionStore((state) => state.runMacro);
  const sound = useAionStore((state) => state.settings.sound);

  const favoritos = useMemo(
    () =>
      [...macros]
        .filter((macro) => macro.characterId === activeCharacterId || macro.characterId === null)
        .sort((a, b) => b.uses - a.uses || a.order - b.order)
        .slice(0, 5),
    [macros, activeCharacterId],
  );

  if (favoritos.length === 0) return null;

  return (
    <div className="faixa-atalhos" role="group" aria-label="Atalhos mais usados">
      {favoritos.map((macro) => (
        <button
          key={macro.id}
          type="button"
          className="faixa-atalhos__item"
          onClick={() => {
            if (sound) audio.click();
            runMacro(macro.id);
          }}
          title={`${macro.name} — ${macro.expression}`}
        >
          <span aria-hidden="true">{macro.glyph}</span>
          <span className="faixa-atalhos__nome">{macro.name}</span>
        </button>
      ))}
    </div>
  );
}
