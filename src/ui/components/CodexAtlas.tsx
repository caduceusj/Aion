import { useCallback, useEffect, useRef, useState } from 'react';
import { PONTOS_DO_MAPA, type PontoDoMapa } from '@/codex/mundo/cartografia';
import { existe, verbete } from '@/codex/corpus';
import { LinkDeVerbete } from '@/codex/LinkDeVerbete';
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
  /**
   * O ponto "escolhido" por um toque. O mouse tem `focado` (o que está sob o
   * cursor); o dedo não paira, então precisa de uma escolha que fique depois
   * que ele sai.
   */
  const [escolhido, setEscolhido] = useState<string | null>(null);

  const molduraRef = useRef<HTMLDivElement | null>(null);
  /** Os dedos (ou o mouse) que estão na moldura agora, por identificador. */
  const ponteiros = useRef(new Map<number, { x: number; y: number }>());
  /** De que tipo foi o último toque na moldura: 'touch', 'mouse' ou 'pen'. */
  const tipoDoPonteiro = useRef('mouse');
  /** Distância entre os dois dedos na última medida, enquanto há pinça. */
  const pinca = useRef<number | null>(null);
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

  /** Centro e distância dos dois primeiros dedos na moldura. */
  const medirPinca = (): { meioX: number; meioY: number; distancia: number } | null => {
    const [a, b] = [...ponteiros.current.values()];
    if (!a || !b) return null;
    return {
      meioX: (a.x + b.x) / 2,
      meioY: (a.y + b.y) / 2,
      distancia: Math.hypot(a.x - b.x, a.y - b.y),
    };
  };

  const aoPressionar = (evento: React.PointerEvent<HTMLDivElement>): void => {
    if (evento.pointerType === 'mouse' && evento.button !== 0) return;
    tipoDoPonteiro.current = evento.pointerType;
    ponteiros.current.set(evento.pointerId, { x: evento.clientX, y: evento.clientY });
    // `?.`: nem todo ambiente (nem os de teste) implementa a captura.
    evento.currentTarget.setPointerCapture?.(evento.pointerId);

    if (ponteiros.current.size === 2) {
      // O segundo dedo troca o arrasto pela pinça.
      arrasto.current.ativo = false;
      pinca.current = medirPinca()?.distancia ?? null;
      return;
    }

    arrasto.current = {
      ativo: true,
      px: evento.clientX,
      py: evento.clientY,
      x: vista.x,
      y: vista.y,
    };
  };

  const aoMover = (evento: React.PointerEvent<HTMLDivElement>): void => {
    if (ponteiros.current.has(evento.pointerId)) {
      ponteiros.current.set(evento.pointerId, { x: evento.clientX, y: evento.clientY });
    }

    // Dois dedos: a distância entre eles é o zoom, e o ponto entre eles é a
    // âncora — o pedaço do mapa sob os dedos fica sob os dedos.
    if (ponteiros.current.size >= 2 && pinca.current !== null) {
      const agora = medirPinca();
      const moldura = molduraRef.current;
      if (!agora || !moldura || pinca.current === 0) return;
      const caixa = moldura.getBoundingClientRect();
      ampliar(
        agora.distancia / pinca.current,
        agora.meioX - caixa.left - caixa.width / 2,
        agora.meioY - caixa.top - caixa.height / 2,
      );
      pinca.current = agora.distancia;
      return;
    }

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

  const aoSoltar = (evento: React.PointerEvent<HTMLDivElement>): void => {
    ponteiros.current.delete(evento.pointerId);
    pinca.current = null;

    const restante = [...ponteiros.current.values()][0];
    if (restante) {
      // Levantou um dos dedos: o que ficou continua arrastando, a partir de
      // onde está, sem o mapa dar um salto.
      arrasto.current = { ativo: true, px: restante.x, py: restante.y, x: vista.x, y: vista.y };
    } else {
      arrasto.current.ativo = false;
    }
  };

  const irPara = (ponto: PontoDoMapa): void => {
    if (existe(ponto.chave)) aoNavegar(ponto.chave);
  };

  /**
   * Um marcador do mapa tem 13px. Com o mouse, parar sobre ele já mostra o que
   * é, e clicar abre o verbete. Com o dedo não há "parar sobre": tocar e abrir
   * numa só ação faz um toque torto levar a outra página. O primeiro toque diz o
   * que o ponto é (a gazeta); o segundo, ou o link da gazeta, abre. O teclado
   * (clique sem coordenadas, `detail === 0`) abre direto, como sempre.
   */
  const aoClicarNoPonto = (evento: React.MouseEvent, ponto: PontoDoMapa): void => {
    if (tipoDoPonteiro.current === 'touch' && evento.detail > 0 && escolhido !== ponto.chave) {
      setEscolhido(ponto.chave);
      return;
    }
    irPara(ponto);
  };

  const destaque = PONTOS_DO_MAPA.find((ponto) => ponto.chave === (focado ?? escolhido)) ?? null;
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
                  onClick={(evento) => aoClicarNoPonto(evento, ponto)}
                  onFocus={() => setFocado(ponto.chave)}
                  onBlur={() => setFocado(null)}
                  onPointerEnter={(evento) => evento.pointerType !== 'touch' && setFocado(ponto.chave)}
                  onPointerLeave={(evento) => evento.pointerType !== 'touch' && setFocado(null)}
                  data-escolhido={escolhido === ponto.chave ? 'sim' : undefined}
                  disabled={!conhecido}
                  title={alvo?.resumo ?? ponto.rotulo}
                >
                  <span className="atlas__marca" aria-hidden="true" />
                  <span
                    className="atlas__rotulo"
                    data-visivel={(focado ?? escolhido) === ponto.chave ? 'sim' : undefined}
                  >
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
                <LinkDeVerbete
                  className="gazeta__abrir"
                  chave={destaque.chave}
                  aoNavegar={(chave) => chave !== null && aoNavegar(chave)}
                >
                  Abrir o verbete <span aria-hidden="true">→</span>
                </LinkDeVerbete>
              </>
            ) : (
              <p className="gazeta__resumo">Sem verbete no códice.</p>
            )}
          </div>
        ) : (
          <p className="gazeta__vazio">
            <span className="so-mouse">
              Passe sobre um ponto do mapa para ler o que o códice guarda sobre ele.
            </span>
            <span className="so-toque">
              Toque num ponto do mapa para ler o que o códice guarda sobre ele; toque de novo
              para abrir o verbete.
            </span>
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
                    data-ativo={(focado ?? escolhido) === ponto.chave ? 'sim' : undefined}
                    onClick={() => irPara(ponto)}
                    onPointerEnter={(evento) => evento.pointerType !== 'touch' && setFocado(ponto.chave)}
                    onPointerLeave={(evento) => evento.pointerType !== 'touch' && setFocado(null)}
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
        províncias. Arraste para mover,{' '}
        <span className="so-mouse">role para aproximar, clique num ponto para abrir o verbete.</span>
        <span className="so-toque">
          use dois dedos (ou os botões + e −) para aproximar, toque num ponto para ler sobre
          ele.
        </span>{' '}
        O mapa é de 1575 e as Anais fecham em 1570 — o que ele nomeia e o livro
        cala está marcado como tal em cada verbete.
      </p>
    </div>
  );
}
