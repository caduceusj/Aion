import { useCallback, useEffect, useRef, useState } from 'react';
import { PONTOS_DO_MAPA, type PontoDoMapa } from '@/codex/valoran/cartografia';
import { existe, verbete } from '@/codex/corpus';
import { IconMais, IconMenos, IconAlvo } from '@/ui/components/Icons';
import mapaLimpo from '@/assets/valoran-mapa.webp';
import mapaComRegioes from '@/assets/valoran-mapa-regioes.webp';

const PROPORCAO = 1536 / 2048;

/** As três famílias de marca do mapa, na ordem em que a gazeta as lista. */
const GRUPOS: Array<{ tipo: PontoDoMapa['tipo']; rotulo: string }> = [
  { tipo: 'assentamento', rotulo: 'Assentamentos' },
  { tipo: 'regiao', rotulo: 'Regiões' },
  { tipo: 'acidente', rotulo: 'Acidentes' },
];
const ESCALA_MIN = 1;
const ESCALA_MAX = 6;

interface Vista {
  escala: number;
  x: number;
  y: number;
}

const prender = (valor: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, valor));

/**
 * O Atlas: as duas pranchas de 1575, uma por cima da outra.
 *
 * O usuário desenhou o mesmo mapa duas vezes — um limpo e um com os nomes das
 * regiões. Em vez de escolher por ele, o códice guarda as duas e deixa o
 * rótulo ser um interruptor: a prancha limpa para contemplar, a rotulada para
 * se localizar. A troca é uma fusão, não um corte, então o olho não perde o
 * lugar onde estava.
 *
 * Os pontos clicáveis vivem em coordenadas normalizadas sobre a imagem, então
 * acompanham o zoom sem precisar recalcular nada.
 */
export function CodexAtlas({ aoNavegar }: { aoNavegar: (chave: string) => void }) {
  const [regioes, setRegioes] = useState(true);
  const [vista, setVista] = useState<Vista>({ escala: 1, x: 0, y: 0 });
  const [medida, setMedida] = useState({ largura: 0, altura: 0 });
  const [focado, setFocado] = useState<string | null>(null);

  const molduraRef = useRef<HTMLDivElement | null>(null);
  const arrasto = useRef<{ ativo: boolean; px: number; py: number; x: number; y: number }>({
    ativo: false,
    px: 0,
    py: 0,
    x: 0,
    y: 0,
  });

  // A prancha é retrato e a área de leitura é paisagem: o palco é o maior
  // retângulo com a proporção do mapa que cabe na moldura.
  useEffect(() => {
    const moldura = molduraRef.current;
    if (!moldura) return undefined;

    const medir = (): void => {
      const { width, height } = moldura.getBoundingClientRect();
      const altura = Math.min(height, width / PROPORCAO);
      setMedida({ largura: altura * PROPORCAO, altura });
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(moldura);
    return () => observador.disconnect();
  }, []);

  /** Impede que o mapa seja arrastado para fora da moldura. */
  const ajustar = useCallback(
    (proposta: Vista): Vista => {
      const escala = prender(proposta.escala, ESCALA_MIN, ESCALA_MAX);
      const sobraX = (medida.largura * escala - medida.largura) / 2;
      const sobraY = (medida.altura * escala - medida.altura) / 2;
      return {
        escala,
        x: prender(proposta.x, -sobraX, sobraX),
        y: prender(proposta.y, -sobraY, sobraY),
      };
    },
    [medida],
  );

  const ampliar = useCallback(
    (fator: number, ancoraX?: number, ancoraY?: number) => {
      setVista((atual) => {
        const escala = prender(atual.escala * fator, ESCALA_MIN, ESCALA_MAX);
        const razao = escala / atual.escala;
        // Sem âncora, amplia pelo centro. Com âncora (a roda do mouse), o
        // ponto sob o cursor fica parado — é o que faz o zoom parecer natural.
        const ax = ancoraX ?? 0;
        const ay = ancoraY ?? 0;
        return ajustar({
          escala,
          x: ax - (ax - atual.x) * razao,
          y: ay - (ay - atual.y) * razao,
        });
      });
    },
    [ajustar],
  );

  useEffect(() => {
    const moldura = molduraRef.current;
    if (!moldura) return undefined;

    // Não dá para usar onWheel do React: ele registra passivo e não deixa
    // impedir a rolagem da página por baixo do mapa.
    const naRoda = (evento: WheelEvent): void => {
      evento.preventDefault();
      const caixa = moldura.getBoundingClientRect();
      ampliar(
        evento.deltaY < 0 ? 1.16 : 1 / 1.16,
        evento.clientX - caixa.left - caixa.width / 2,
        evento.clientY - caixa.top - caixa.height / 2,
      );
    };

    moldura.addEventListener('wheel', naRoda, { passive: false });
    return () => moldura.removeEventListener('wheel', naRoda);
  }, [ampliar]);

  const aoPressionar = (evento: React.PointerEvent<HTMLDivElement>): void => {
    if (evento.button !== 0) return;
    arrasto.current = {
      ativo: true,
      px: evento.clientX,
      py: evento.clientY,
      x: vista.x,
      y: vista.y,
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
  };

  const aoMover = (evento: React.PointerEvent<HTMLDivElement>): void => {
    if (!arrasto.current.ativo) return;
    const passo = arrasto.current;
    setVista(
      ajustar({
        escala: vista.escala,
        x: passo.x + (evento.clientX - passo.px),
        y: passo.y + (evento.clientY - passo.py),
      }),
    );
  };

  const aoSoltar = (): void => {
    arrasto.current.ativo = false;
  };

  const irPara = (ponto: PontoDoMapa): void => {
    if (existe(ponto.chave)) aoNavegar(ponto.chave);
  };

  const destaque = PONTOS_DO_MAPA.find((ponto) => ponto.chave === focado) ?? null;
  const destaqueVerbete = destaque ? verbete(destaque.chave) : undefined;

  const estiloPalco = {
    width: medida.largura || undefined,
    height: medida.altura || undefined,
    transform: `translate(${vista.x}px, ${vista.y}px) scale(${vista.escala})`,
  };

  return (
    <div className="atlas">
      <header className="atlas__topo">
        <div>
          <p className="verbete__rubrica">O Atlas</p>
          <h1 className="atlas__titulo">Valoran</h1>
          <p className="atlas__anno">1575 DA</p>
        </div>

        <div className="atlas__controles">
          <button
            type="button"
            className="atlas__alternar"
            data-ativo={regioes ? 'sim' : undefined}
            onClick={() => setRegioes((r) => !r)}
            aria-pressed={regioes}
          >
            Regiões
          </button>
          <div className="atlas__zoom">
            <button type="button" onClick={() => ampliar(1 / 1.4)} aria-label="Afastar" title="Afastar">
              <IconMenos size={15} />
            </button>
            <span className="atlas__nivel">{Math.round(vista.escala * 100)}%</span>
            <button type="button" onClick={() => ampliar(1.4)} aria-label="Aproximar" title="Aproximar">
              <IconMais size={15} />
            </button>
            <button
              type="button"
              onClick={() => setVista({ escala: 1, x: 0, y: 0 })}
              aria-label="Enquadrar o mapa"
              title="Enquadrar"
            >
              <IconAlvo size={15} />
            </button>
          </div>
        </div>
      </header>

      <div className="atlas__area">
      <div
        className="atlas__moldura"
        ref={molduraRef}
        onPointerDown={aoPressionar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        data-arrastavel={vista.escala > 1 ? 'sim' : undefined}
      >
        <div className="atlas__palco" style={estiloPalco}>
          <img className="atlas__prancha" src={mapaLimpo} alt="Mapa de Valoran em 1575 DA" draggable={false} />
          <img
            className="atlas__prancha atlas__prancha--regioes"
            src={mapaComRegioes}
            alt=""
            aria-hidden="true"
            draggable={false}
            style={{ opacity: regioes ? 1 : 0 }}
          />

          <div className="atlas__pontos">
            {PONTOS_DO_MAPA.map((ponto) => {
              const alvo = verbete(ponto.chave);
              const conhecido = alvo !== undefined;
              // As regiões só têm rótulo na segunda prancha; sem ela, o ponto
              // apontaria para um nome invisível.
              if (ponto.tipo === 'regiao' && !regioes) return null;
              return (
                <button
                  type="button"
                  key={ponto.chave}
                  className="atlas__ponto"
                  data-tipo={ponto.tipo}
                  data-conhecido={conhecido ? 'sim' : undefined}
                  style={{
                    left: `${ponto.x * 100}%`,
                    top: `${ponto.y * 100}%`,
                    // O marcador não pode crescer com o mapa, senão vira um
                    // borrão no zoom máximo.
                    transform: `translate(-50%, -50%) scale(${1 / vista.escala})`,
                  }}
                  onClick={() => irPara(ponto)}
                  onFocus={() => setFocado(ponto.chave)}
                  onBlur={() => setFocado(null)}
                  onPointerEnter={() => setFocado(ponto.chave)}
                  onPointerLeave={() => setFocado(null)}
                  disabled={!conhecido}
                  title={alvo?.resumo ?? ponto.rotulo}
                >
                  <span className="atlas__marca" aria-hidden="true" />
                  <span className="atlas__rotulo" data-visivel={focado === ponto.chave ? 'sim' : undefined}>
                    {ponto.rotulo}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="atlas__gazeta" aria-label="Gazeta do atlas">
        {destaque ? (
          <div className="gazeta__cartucho">
            <p className="verbete__rubrica">
              {destaque.tipo === 'assentamento'
                ? 'Assentamento'
                : destaque.tipo === 'regiao'
                  ? 'Região'
                  : 'Acidente'}
            </p>
            <h2 className="gazeta__nome">{destaque.rotulo}</h2>
            {destaqueVerbete ? (
              <>
                <p className="gazeta__resumo">{destaqueVerbete.resumo}</p>
                <button
                  type="button"
                  className="gazeta__abrir"
                  onClick={() => aoNavegar(destaque.chave)}
                >
                  Abrir o verbete <span aria-hidden="true">→</span>
                </button>
              </>
            ) : (
              <p className="gazeta__resumo">Sem verbete no códice.</p>
            )}
          </div>
        ) : (
          <p className="gazeta__vazio">
            Passe sobre um ponto do mapa para ler o que o códice guarda sobre ele.
          </p>
        )}

        {GRUPOS.map((grupo) => (
          <div className="gazeta__grupo" key={grupo.tipo}>
            <p className="verbete__rubrica">{grupo.rotulo}</p>
            <ul>
              {PONTOS_DO_MAPA.filter((ponto) => ponto.tipo === grupo.tipo).map((ponto) => (
                <li key={ponto.chave}>
                  <button
                    type="button"
                    className="gazeta__item"
                    data-ativo={focado === ponto.chave ? 'sim' : undefined}
                    onClick={() => irPara(ponto)}
                    onPointerEnter={() => setFocado(ponto.chave)}
                    onPointerLeave={() => setFocado(null)}
                    onFocus={() => setFocado(ponto.chave)}
                    onBlur={() => setFocado(null)}
                  >
                    {ponto.rotulo}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
      </div>

      <p className="atlas__nota">
        Duas pranchas do mesmo desenho: <strong>Regiões</strong> acende os nomes das
        províncias. Arraste para mover, role para aproximar, clique num ponto para abrir o
        verbete. O mapa é de 1575 e as Anais fecham em 1570 — o que ele nomeia e o livro
        cala está marcado como tal em cada verbete.
      </p>
    </div>
  );
}
