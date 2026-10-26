import { useEffect, useMemo, useRef, useState } from 'react';
import type { PolyhedronKind } from '@/engine/types';
import { useAionStore } from '@/state/store';
import { audio } from '@/audio/sfx';
import {
  GlifoDado,
  IconAjuda,
  IconDesvantagem,
  IconFechar,
  IconRepetir,
  IconRolar,
  IconVantagem,
} from './Icons';
import { NotationHelp } from './NotationHelp';
import '@/ui/styles/dock.css';

const QUICK_DICE: Array<{ kind: PolyhedronKind; label: string; hotkey: string }> = [
  { kind: 'd4', label: 'd4', hotkey: '1' },
  { kind: 'd6', label: 'd6', hotkey: '2' },
  { kind: 'd8', label: 'd8', hotkey: '3' },
  { kind: 'd10', label: 'd10', hotkey: '4' },
  { kind: 'd12', label: 'd12', hotkey: '5' },
  { kind: 'd20', label: 'd20', hotkey: '6' },
  { kind: 'd100', label: 'd100', hotkey: '7' },
  { kind: 'dF', label: 'dF', hotkey: '8' },
];

const PLACEHOLDERS = [
  '1d20+7',
  '4d6kh3',
  '2d6+3[Dano]',
  '10d10>=7',
  '6d6!',
  '2d20kl1',
  '4dF',
];

const LONG_PRESS_MS = 420;

/** Quanto a notação precisa ficar parada e errada antes de reclamarmos. */
const ESPERA_DO_ERRO_MS = 700;

const DICA_CAMPO_VAZIO = 'Escreva uma rolagem, como 2d6+3, ou toque num dado.';

export function Dock() {
  const input = useAionStore((state) => state.input);
  const inputError = useAionStore((state) => state.inputError);
  const phase = useAionStore((state) => state.phase);
  const history = useAionStore((state) => state.history);
  const sound = useAionStore((state) => state.settings.sound);

  const setInput = useAionStore((state) => state.setInput);
  const rollFromInput = useAionStore((state) => state.rollFromInput);
  const rollQuick = useAionStore((state) => state.rollQuick);
  const rollAdvantage = useAionStore((state) => state.rollAdvantage);
  const repeatLast = useAionStore((state) => state.repeatLast);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const ajudaRef = useRef<HTMLButtonElement | null>(null);
  const [counts, setCounts] = useState<Partial<Record<PolyhedronKind, number>>>({});
  const [helpOpen, setHelpOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0] ?? '1d20');
  /** Posição na navegação por seta para cima, tipo histórico de terminal. */
  const [recallIndex, setRecallIndex] = useState(-1);
  /** O erro só aparece depois que a pessoa para de digitar — "2d" não é um erro, é um caminho. */
  const [erroVisivel, setErroVisivel] = useState(false);
  /** Tentou rolar com o campo vazio: o botão explica em vez de ficar mudo. */
  const [dicaVazio, setDicaVazio] = useState(false);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const rolling = phase === 'lancando' || phase === 'assentando';
  const trimmed = input.trim();
  const vazio = trimmed.length === 0;
  const blocked = !vazio && inputError !== null;

  /** Expressões anteriores, sem repetir, para a seta para cima. */
  const recall = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const entry of history) {
      const expression = entry.result.expression;
      if (seen.has(expression)) continue;
      seen.add(expression);
      out.push(expression);
      if (out.length >= 30) break;
    }
    return out;
  }, [history]);

  // Placeholder rotativo: ensina a notação sem ocupar espaço na tela.
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholder((current) => {
        const index = PLACEHOLDERS.indexOf(current);
        return PLACEHOLDERS[(index + 1) % PLACEHOLDERS.length] ?? current;
      });
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    window.addEventListener('aion:focar-notacao', focus);
    return () => window.removeEventListener('aion:focar-notacao', focus);
  }, []);

  // Um erro que aparece e some a cada tecla faz a doca inteira tremer. Ele
  // entra depois de uma pausa, some na hora em que a expressão fica válida, e
  // — enquanto continua errada — só troca o texto, sem piscar.
  useEffect(() => {
    if (!blocked) {
      setErroVisivel(false);
      return undefined;
    }
    const timer = setTimeout(() => setErroVisivel(true), ESPERA_DO_ERRO_MS);
    return () => clearTimeout(timer);
  }, [blocked, input]);

  const click = () => {
    if (sound) audio.click();
  };

  const countFor = (kind: PolyhedronKind): number => counts[kind] ?? 1;

  const setCount = (kind: PolyhedronKind, value: number): void => {
    setCounts((current) => ({ ...current, [kind]: Math.max(1, Math.min(20, value)) }));
  };

  const handleQuickRoll = (kind: PolyhedronKind): void => {
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    click();
    setDicaVazio(false);
    rollQuick(kind, countFor(kind));
  };

  const startLongPress = (kind: PolyhedronKind): void => {
    longPressFired.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      // Segurar aumenta a quantidade: o gesto natural para "mais dados".
      setCount(kind, countFor(kind) + 1);
      if (sound) audio.click();
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = (): void => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (vazio || blocked) {
      // Um botão que não faz nada e não diz por quê é pior que um botão que
      // erra: leva a pessoa ao campo e mostra o que falta.
      setDicaVazio(vazio);
      setErroVisivel(blocked);
      inputRef.current?.focus();
      return;
    }
    click();
    rollFromInput();
    setRecallIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowUp') {
      if (recall.length === 0) return;
      event.preventDefault();
      const next = Math.min(recallIndex + 1, recall.length - 1);
      setRecallIndex(next);
      setInput(recall[next] ?? '');
      return;
    }

    if (event.key === 'ArrowDown') {
      if (recallIndex < 0) return;
      event.preventDefault();
      const next = recallIndex - 1;
      setRecallIndex(next);
      setInput(next < 0 ? '' : (recall[next] ?? ''));
    }
  };

  const fecharAjuda = (): void => {
    setHelpOpen(false);
    ajudaRef.current?.focus();
  };

  const escolherDaAjuda = (syntax: string): void => {
    setInput(syntax);
    setRecallIndex(-1);
    setDicaVazio(false);
    setHelpOpen(false);
    // No celular, focar o campo abre o teclado por cima de tudo — e quem
    // escolheu um exemplo muitas vezes só quer rolá-lo.
    const comMouse =
      typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches;
    (comMouse ? inputRef.current : ajudaRef.current)?.focus();
  };

  const mostraErro = erroVisivel && blocked;
  const mostraDica = dicaVazio && vazio;

  return (
    <>
      <form className="doca" onSubmit={handleSubmit} aria-label="Rolar dados">
        <div className="doca__dados" role="group" aria-label="Dados rápidos">
          {QUICK_DICE.map(({ kind, label, hotkey }) => {
            const count = countFor(kind);
            return (
              <button
                key={kind}
                type="button"
                className="dado-rapido"
                onClick={(event) => {
                  if (event.shiftKey) {
                    setCount(kind, count + 1);
                    click();
                    return;
                  }
                  handleQuickRoll(kind);
                }}
                onKeyDown={(event) => {
                  // Sem mouse nem toque longo, a quantidade se muda pelas setas.
                  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                    event.preventDefault();
                    setCount(kind, count + (event.key === 'ArrowUp' ? 1 : -1));
                  }
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  setCount(kind, 1);
                }}
                onWheel={(event) => {
                  setCount(kind, count + (event.deltaY < 0 ? 1 : -1));
                }}
                onPointerDown={() => startLongPress(kind)}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                onPointerCancel={cancelLongPress}
                aria-label={`Rolar ${count} ${label} (tecla ${hotkey})`}
                title={`${label} — clique para rolar. Para mudar a quantidade: segure, use shift+clique, a roda do mouse ou as setas.`}
              >
                <GlifoDado kind={kind} size={26} className="dado-rapido__glifo" />
                <span className="dado-rapido__rotulo">{label}</span>
                {count > 1 ? <span className="dado-rapido__qtd">{count}</span> : null}
              </button>
            );
          })}
        </div>

        <div className="doca__linha">
          <div className="doca__campo">
            <input
              ref={inputRef}
              className="doca__input mono"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setRecallIndex(-1);
                setDicaVazio(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              enterKeyHint="send"
              aria-label="Notação da rolagem"
              aria-invalid={blocked}
              {...(mostraErro
                ? { 'aria-describedby': 'doca-erro' }
                : mostraDica
                  ? { 'aria-describedby': 'doca-dica' }
                  : {})}
            />
            {!vazio ? (
              <button
                type="button"
                className="doca__limpar"
                onClick={() => {
                  setInput('');
                  setRecallIndex(-1);
                  inputRef.current?.focus();
                }}
                aria-label="Limpar o campo"
                title="Limpar o campo"
              >
                <IconFechar size={15} />
              </button>
            ) : null}
            <button
              type="button"
              ref={ajudaRef}
              className="doca__ajuda"
              onClick={() => {
                click();
                setHelpOpen(true);
              }}
              aria-label="Como escrever uma rolagem"
              aria-haspopup="dialog"
              title="Referência de notação"
            >
              <IconAjuda size={18} />
            </button>
          </div>

          <div className="doca__acoes">
            <button
              type="button"
              className="doca__botao"
              onClick={() => {
                click();
                rollAdvantage('vantagem');
              }}
              aria-label="Rolar com vantagem (tecla V)"
              title="Vantagem — 2d20, mantém o maior"
            >
              <IconVantagem size={18} />
              <span className="doca__botao-rotulo">Vant.</span>
            </button>
            <button
              type="button"
              className="doca__botao"
              onClick={() => {
                click();
                rollAdvantage('desvantagem');
              }}
              aria-label="Rolar com desvantagem (tecla D)"
              title="Desvantagem — 2d20, mantém o menor"
            >
              <IconDesvantagem size={18} />
              <span className="doca__botao-rotulo">Desv.</span>
            </button>
            <button
              type="button"
              className="doca__botao doca__botao--icone"
              onClick={() => {
                click();
                repeatLast();
              }}
              disabled={history.length === 0}
              aria-label="Repetir a última rolagem (tecla R)"
              title={history.length === 0 ? 'Nada rolado ainda' : 'Repetir a última rolagem'}
            >
              <IconRepetir size={19} />
            </button>

            <button
              type="submit"
              className="doca__rolar"
              aria-disabled={vazio || blocked ? 'true' : undefined}
              data-rolando={rolling ? 'sim' : undefined}
              title={
                blocked
                  ? 'Corrija a expressão para rolar'
                  : vazio
                    ? 'Escreva uma rolagem, como 1d20+5'
                    : 'Rolar'
              }
            >
              <IconRolar size={19} />
              <span>Rolar</span>
            </button>
          </div>
        </div>

        {mostraErro ? (
          <p className="doca__erro" id="doca-erro" role="status">
            {inputError?.message}
          </p>
        ) : mostraDica ? (
          <p className="doca__erro doca__erro--dica" id="doca-dica" role="status">
            {DICA_CAMPO_VAZIO}
          </p>
        ) : null}
      </form>

      {helpOpen ? <NotationHelp onClose={fecharAjuda} onPick={escolherDaAjuda} /> : null}
    </>
  );
}
