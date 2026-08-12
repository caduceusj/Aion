import { useEffect, useMemo, useRef, useState } from 'react';
import { tryRoll, validate } from '@/engine';
import type { Macro } from '@/state/types';
import { useAionStore } from '@/state/store';
import { IconCheck, IconFechar, IconRolar } from './Icons';

const GLYPHS = [
  '⚔️', '🗡️', '🏹', '🪄', '🔥', '❄️', '⚡', '🛡️',
  '💀', '🩸', '✨', '🎯', '🧪', '📜', '🔮', '👁️',
  '🐉', '🌙', '☠️', '🕯️', '🪙', '🎲', '🤺', '🧿',
];

interface Props {
  /** Atalho existente, ou null para criar um novo. */
  macro: Macro | null;
  onClose: () => void;
}

export function MacroEditor({ macro, onClose }: Props) {
  const characters = useAionStore((state) => state.characters);
  const activeCharacterId = useAionStore((state) => state.activeCharacterId);
  const addMacro = useAionStore((state) => state.addMacro);
  const updateMacro = useAionStore((state) => state.updateMacro);

  const [name, setName] = useState(macro?.name ?? '');
  const [expression, setExpression] = useState(macro?.expression ?? '');
  const [glyph, setGlyph] = useState(macro?.glyph ?? '🎲');
  const [owner, setOwner] = useState<string | null>(
    macro ? macro.characterId : activeCharacterId,
  );
  const [teste, setTeste] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const erro = useMemo(
    () => (expression.trim().length === 0 ? null : validate(expression)),
    [expression],
  );
  const valido = name.trim().length > 0 && expression.trim().length > 0 && erro === null;

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Prende o foco dentro do editor enquanto ele estiver aberto.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusables = container.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);

  const salvar = (): void => {
    if (!valido) return;
    if (macro) {
      updateMacro(macro.id, {
        name: name.trim(),
        expression: expression.trim(),
        glyph,
        characterId: owner,
      });
    } else {
      addMacro({
        name: name.trim(),
        expression: expression.trim(),
        glyph,
        characterId: owner,
      });
    }
    onClose();
  };

  return (
    <div className="editor-fundo" role="presentation" onClick={onClose}>
      <div
        className="editor"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-titulo"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="editor__topo">
          <h2 className="editor__titulo" id="editor-titulo">
            {macro ? 'Editar atalho' : 'Novo atalho'}
          </h2>
          <button
            type="button"
            className="editor__fechar"
            onClick={onClose}
            aria-label="Fechar o editor"
          >
            <IconFechar size={19} />
          </button>
        </header>

        <div className="editor__campos">
          <label className="editor__campo">
            <span className="rotulo">Nome</span>
            <input
              ref={nameRef}
              className="editor__input"
              value={name}
              maxLength={32}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && valido) salvar();
              }}
              placeholder="Espada longa"
            />
          </label>

          <label className="editor__campo">
            <span className="rotulo">Rolagem</span>
            <input
              className="editor__input mono"
              value={expression}
              onChange={(event) => {
                setExpression(event.target.value);
                setTeste(null);
              }}
              placeholder="1d20+7"
              spellCheck={false}
              autoComplete="off"
              aria-invalid={erro !== null}
            />
            {erro ? <span className="editor__erro">{erro.message}</span> : null}
          </label>

          <div className="editor__teste">
            <button
              type="button"
              className="editor__testar"
              disabled={erro !== null || expression.trim().length === 0}
              onClick={() => {
                const outcome = tryRoll(expression.trim());
                setTeste(outcome.ok ? outcome.result.detail : outcome.error.message);
              }}
            >
              <IconRolar size={15} />
              <span>Testar</span>
            </button>
            {teste ? <code className="editor__resultado mono">{teste}</code> : null}
          </div>

          <fieldset className="editor__campo editor__campo--glifos">
            <legend className="rotulo">Símbolo</legend>
            <div className="editor__glifos">
              {GLYPHS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="editor__glifo"
                  data-ativo={glyph === option ? 'sim' : undefined}
                  onClick={() => setGlyph(option)}
                  aria-label={`Símbolo ${option}`}
                  aria-pressed={glyph === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="editor__campo">
            <span className="rotulo">Dono</span>
            <select
              className="editor__input"
              value={owner ?? ''}
              onChange={(event) => setOwner(event.target.value || null)}
            >
              <option value="">A mesa (todos veem)</option>
              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <footer className="editor__rodape">
          <button type="button" className="editor__cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="editor__salvar" disabled={!valido} onClick={salvar}>
            <IconCheck size={16} />
            <span>Salvar</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
