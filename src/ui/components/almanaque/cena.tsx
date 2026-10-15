import { useMemo } from 'react';
import {
  CICLOS,
  CONSTELACOES,
  CONTINENTES,
  afelioUA,
  constelacaoVisivel,
  continente,
  continentePorCodigo,
  diaDaChegada,
  diaDaPartida,
  estadoDaLua,
  mesDaCorvisseia,
  perielioUA,
  posicaoDaLua,
  posicaoEm,
  trecho,
  type Continente,
  type ContinenteId,
  type Ponto,
} from '@/codex/calendario';

/**
 * O céu de Aion como desenho.
 *
 * Uma cena só, usada em dois tamanhos: o céu inteiro, com as doze
 * constelações e a rosa dos ventos, e a miniatura da folha do mês, que tira
 * tudo o que não ajuda a ver o salto. Nada aqui tem geometria própria — cada
 * posição sai de `codex/calendario.ts`, os mesmos elementos orbitais que
 * movem todas as outras telas, e por isso nenhuma delas discorda de onde um
 * continente está.
 *
 * Duas coisas são novas em relação ao modelo original, e as duas respondem
 * a "para onde ela vai?":
 *
 *   - o trajeto do mês: o caminho que Corvus faz da partida à chegada, com
 *     um anel no ponto onde o continente de destino estará quando ela pousar
 *     (ele se mexe durante os 10,5 dias, e é lá que ela chega, não onde ele
 *     estava);
 *   - o ponto de vista: o continente de onde se olha ganha um raio até a
 *     constelação que ele encara, e essa constelação acende.
 */

// ------------------------------------------------------------------ escala

/** Unidades de viewBox por UA. */
export const ESCALA = 60;
/** Metade do lado do quadro na visão geral. */
const MOLDURA = 130;
/** Metade do lado do quadro da miniatura: só até o afélio da órbita externa, e o rótulo. */
const MOLDURA_MINI = 112;
/** Onde ficam os desenhos das constelações. */
const RAIO_DO_ZODIACO = 110;

const rad = (graus: number): number => (graus * Math.PI) / 180;

export interface Tela {
  x: number;
  y: number;
}

/** Do plano do sistema para a tela: o norte é para cima, então o y inverte. */
export const naTela = (p: Ponto): Tela => ({ x: p.leste * ESCALA, y: -p.norte * ESCALA });

/**
 * Para que lado escrever o nome de um corpo.
 *
 * Empurrar o rótulo para fora, na direção que sai de Aion, separa os nomes
 * quando dois continentes passam perto na tela: dois corpos em ângulos
 * diferentes têm rótulos em direções diferentes, que é justamente quando
 * eles se chocariam. Um afastamento negativo escreve para dentro.
 */
export function rotulo(p: Tela, afastamento: number, dir?: Tela) {
  const alvo = dir ?? p;
  const distancia = Math.hypot(alvo.x, alvo.y) || 1;
  const sentido = Math.sign(afastamento) || 1;
  const ux = (alvo.x / distancia) * sentido;
  const uy = (alvo.y / distancia) * sentido;
  const passo = Math.abs(afastamento);
  return {
    x: p.x + ux * passo,
    y: p.y + uy * passo,
    ancora: (ux > 0.3 ? 'start' : ux < -0.3 ? 'end' : 'middle') as 'start' | 'middle' | 'end',
    base: (uy > 0.3 ? 'hanging' : uy < -0.3 ? 'auto' : 'middle') as 'auto' | 'middle' | 'hanging',
  };
}

/** O quadro que enquadra a órbita de um continente, para a aproximação. */
export function moldura(corpo: Continente): { cx: number; cy: number; meio: number } {
  const ciclo = CICLOS[corpo.ciclo];
  const a = ciclo.raioUA * ESCALA;
  const desvio = a * ciclo.excentricidade;
  const rumo = rad(corpo.rumoDoPerielio + 180);
  return {
    cx: ciclo.excentricidade > 0 ? desvio * Math.sin(rumo) : 0,
    cy: ciclo.excentricidade > 0 ? -desvio * Math.cos(rumo) : 0,
    meio: a * 1.35,
  };
}

/** O ponto de uma constelação no anel do zodíaco. */
const noZodiaco = (indice: number, raio = RAIO_DO_ZODIACO): Tela => {
  const meio = rad(indice * 30 + 15);
  return { x: raio * Math.sin(meio), y: -raio * Math.cos(meio) };
};

// ----------------------------------------------------------------- cenário

/**
 * Tudo o que não se mexe: estrelas de fundo, os três anéis e, no céu inteiro,
 * os pontos de periélio e afélio, a rosa dos ventos e as doze constelações.
 *
 * Fica num `useMemo` que só depende do modo, de propósito: como o elemento é
 * o mesmo objeto, o React pula esta subárvore inteira nos sessenta quadros
 * por segundo em que só o resto muda.
 */
function useCenario(modo: 'completo' | 'mini') {
  return useMemo(() => {
    const mini = modo === 'mini';
    const lado = mini ? MOLDURA_MINI : MOLDURA;
    const estrelas = Array.from({ length: mini ? 90 : 250 }, (_, i) => {
      // Semeado à mão, para o céu ser o mesmo a cada visita.
      const r = (n: number) => {
        const x = Math.sin((i + 1) * n) * 43758.5453;
        return x - Math.floor(x);
      };
      return {
        cx: (r(12.9898) - 0.5) * 2 * lado,
        cy: (r(78.233) - 0.5) * 2 * lado,
        r: (r(39.425) * 0.3 + 0.05) * (mini ? 1.6 : 1),
        o: r(11.111) * 0.7 + 0.15,
      };
    });
    const id = `ceu-aion-${modo}`;

    return (
      <g className="ceu__cenario">
        <defs>
          <radialGradient id={id}>
            <stop offset="0%" stopColor="#fff8c0" />
            <stop offset="40%" stopColor="#ffd97a" />
            <stop offset="100%" stopColor="#ff9a3a" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {estrelas.map((e, i) => (
          <circle key={i} cx={e.cx} cy={e.cy} r={e.r} fill="#fff" opacity={e.o} />
        ))}

        {/* Os três anéis, com o foco em Aion e não no centro da elipse. */}
        {(['C1', 'C3', 'C5'] as const).map((codigo) => {
          const corpo = CONTINENTES.find((c) => c.codigo === codigo)!;
          const ciclo = CICLOS[corpo.ciclo];
          const a = ciclo.raioUA * ESCALA;
          const b = a * Math.sqrt(1 - ciclo.excentricidade ** 2);
          const m = moldura(corpo);
          return (
            <ellipse
              key={codigo}
              className="ceu__anel"
              cx={0}
              cy={0}
              rx={a}
              ry={b}
              stroke={corpo.cor}
              transform={`translate(${m.cx} ${m.cy}) rotate(${corpo.rumoDoPerielio - 90})`}
            />
          );
        })}

        {/* Periélio e afélio dos dois anéis que os têm. */}
        {mini
          ? null
          : (['C3', 'C5'] as const).flatMap((codigo) => {
              const corpo = CONTINENTES.find((c) => c.codigo === codigo)!;
              const rumo = corpo.rumoDoPerielio;
              const perto = naTela({
                leste: perielioUA(corpo) * Math.sin(rad(rumo)),
                norte: perielioUA(corpo) * Math.cos(rad(rumo)),
              });
              const longe = naTela({
                leste: afelioUA(corpo) * Math.sin(rad(rumo + 180)),
                norte: afelioUA(corpo) * Math.cos(rad(rumo + 180)),
              });
              // As letras vão para dentro da órbita: fora dela fica o anel das
              // constelações, e o "A" caía em cima de *Serpente*.
              const pt = rotulo(perto, -6);
              const at = rotulo(longe, -6);
              return [
                <circle key={`${codigo}-p`} cx={perto.x} cy={perto.y} r="1.5" fill="#ffd97a" />,
                <circle key={`${codigo}-a`} cx={longe.x} cy={longe.y} r="1.5" fill="#6ab0ff" />,
                <text key={`${codigo}-pt`} className="ceu__apside" x={pt.x} y={pt.y} textAnchor={pt.ancora} dominantBaseline={pt.base} fill="#ffd97a">
                  P
                </text>,
                <text key={`${codigo}-at`} className="ceu__apside" x={at.x} y={at.y} textAnchor={at.ancora} dominantBaseline={at.base} fill="#6ab0ff">
                  A
                </text>,
              ];
            })}

        {/* Aion. */}
        <circle cx="0" cy="0" r={mini ? 8 : 12} fill={`url(#${id})`} />
        <circle cx="0" cy="0" r={mini ? 3 : 4} fill="#fff8c0" />
        <text className="ceu__estrela-nome" x="0" y={mini ? 15 : 18} textAnchor="middle">
          AION
        </text>

        {mini ? null : (
          <>
            {/* A rosa dos ventos. */}
            {(
              [
                ['N', 0, -118, 'middle'],
                ['L', 118, 2, 'start'],
                ['S', 0, 122, 'middle'],
                ['O', -118, 2, 'end'],
              ] as const
            ).map(([letra, x, y, ancora]) => (
              <text key={letra} className="ceu__rosa" x={x} y={y} textAnchor={ancora}>
                {letra}
              </text>
            ))}

            {/* As doze fatias de 30°, e o desenho de estrelas de cada uma. */}
            {CONSTELACOES.map((c) => {
              const divisa = rad(c.de);
              const slot = noZodiaco(c.indice);
              const estrelasDoDesenho = new Map<string, [number, number]>();
              for (const [[x1, y1], [x2, y2]] of c.tracos) {
                estrelasDoDesenho.set(`${x1},${y1}`, [x1, y1]);
                estrelasDoDesenho.set(`${x2},${y2}`, [x2, y2]);
              }
              return (
                <g key={c.nome}>
                  <line
                    className="ceu__divisa"
                    x1={92 * Math.sin(divisa)}
                    y1={-92 * Math.cos(divisa)}
                    x2={128 * Math.sin(divisa)}
                    y2={-128 * Math.cos(divisa)}
                  />
                  <g transform={`translate(${slot.x} ${slot.y})`}>
                    {c.tracos.map(([[x1, y1], [x2, y2]], i) => (
                      <line key={i} className="ceu__traco" x1={x1} y1={y1} x2={x2} y2={y2} />
                    ))}
                    {[...estrelasDoDesenho.values()].map(([x, y]) => (
                      <circle key={`${x},${y}`} cx={x} cy={y} r="0.55" fill="#dfe6ff" />
                    ))}
                    <text className="ceu__constelacao-nome" x="0" y="10" textAnchor="middle">
                      {c.nome}
                    </text>
                  </g>
                </g>
              );
            })}
          </>
        )}
      </g>
    );
  }, [modo]);
}

// -------------------------------------------------------------------- cena

export interface CenaProps {
  /** O dia da Corvisseia que a cena mostra. */
  dia: number;
  /** De qual continente se olha: ganha o raio e a constelação acesa. */
  onde: ContinenteId;
  modo?: 'completo' | 'mini';
  /** Aproxima a câmera da órbita de um continente. Só no céu inteiro. */
  zoom?: Continente | null;
  /** Clicar num continente o escolhe como ponto de vista. */
  aoEscolher?: (id: ContinenteId) => void;
}

export function Cena({ dia, onde, modo = 'completo', zoom = null, aoEscolher }: CenaProps) {
  const mini = modo === 'mini';
  // Na miniatura o quadro é menor e o desenho aparece menor na tela, então os
  // corpos crescem na mesma proporção para continuarem legíveis.
  const k = mini ? 1.9 : 1;
  const cenario = useCenario(modo);
  const mesC = mesDaCorvisseia(dia);

  const caixa = zoom
    ? (() => {
        const m = moldura(zoom);
        return `${m.cx - m.meio} ${m.cy - m.meio} ${m.meio * 2} ${m.meio * 2}`;
      })()
    : mini
      ? `${-MOLDURA_MINI} ${-MOLDURA_MINI} ${MOLDURA_MINI * 2} ${MOLDURA_MINI * 2}`
      : `${-MOLDURA} ${-MOLDURA} ${MOLDURA * 2} ${MOLDURA * 2}`;

  // O trajeto do mês, e onde o destino estará quando Corvus chegar.
  const { caminho, pouso } = useMemo(() => {
    const t = trecho(mesC);
    const partida = diaDaPartida(mesC);
    const chegada = diaDaChegada(mesC);
    const pontos = Array.from({ length: 33 }, (_, i) =>
      naTela(posicaoDaLua(partida + ((chegada - 1e-6 - partida) * i) / 32)),
    );
    return {
      caminho: pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' '),
      pouso: naTela(posicaoEm(continentePorCodigo(t.para), chegada)),
    };
  }, [mesC]);

  // O rastro de Corvus: onde ela esteve nos últimos doze dias.
  const rastro = useMemo(() => {
    if (mini) return [] as Tela[];
    const pontos: Tela[] = [];
    for (let i = 20; i >= 1; i -= 1) pontos.push(naTela(posicaoDaLua(dia - i * 0.6)));
    return pontos;
  }, [dia, mini]);

  const lua = naTela(posicaoDaLua(dia));
  const estado = estadoDaLua(dia);
  const pousada = estado.estado === 'parada' ? continentePorCodigo(estado.em) : null;
  // Perto de um continente — pousada, ou no instante exato em que parte ou
  // chega — Corvus fica colada nele, e os dois nomes se somavam. O rótulo
  // dela sai do lado oposto ao do continente, que escreve para fora de Aion:
  // na direção que vai do continente para a lua, e, se ela está exatamente
  // em cima dele, para dentro, em direção à estrela.
  const vizinho = CONTINENTES.map((c) => ({ c, p: naTela(posicaoEm(c, dia)) })).reduce((a, b) =>
    Math.hypot(b.p.x - lua.x, b.p.y - lua.y) < Math.hypot(a.p.x - lua.x, a.p.y - lua.y) ? b : a,
  );
  const folga = Math.hypot(vizinho.p.x - lua.x, vizinho.p.y - lua.y);
  const colada = folga < 8 * k;
  const rotuloDaLua = colada
    ? rotulo(
        lua,
        mini ? 12 : 7,
        folga > 0.8 ? { x: lua.x - vizinho.p.x, y: lua.y - vizinho.p.y } : { x: -vizinho.p.x, y: -vizinho.p.y },
      )
    : rotulo(lua, mini ? 13 : 8);

  // O ponto de vista: o raio até a constelação que ele encara, e essa constelação acesa.
  const olhar = continente(onde);
  const pOlhar = naTela(posicaoEm(olhar, dia));
  const dirOlhar = Math.hypot(pOlhar.x, pOlhar.y) || 1;
  const vista = constelacaoVisivel(olhar, dia);
  const slotVista = noZodiaco(vista.indice);
  const estrelasDaVista = new Map<string, [number, number]>();
  for (const [[x1, y1], [x2, y2]] of vista.tracos) {
    estrelasDaVista.set(`${x1},${y1}`, [x1, y1]);
    estrelasDaVista.set(`${x2},${y2}`, [x2, y2]);
  }

  return (
    <svg
      className="ceu__quadro"
      data-modo={modo}
      viewBox={caixa}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`O sistema de Aion no dia ${Math.floor(dia) + 1} da Corvisseia, visto de ${olhar.nome}`}
    >
      {cenario}

      {/* O trajeto previsto do mês, e o anel onde o destino estará quando ela pousar. */}
      <path className="ceu__trajeto" d={caminho} strokeWidth={0.7 * k} />
      <circle className="ceu__pouso" cx={pouso.x} cy={pouso.y} r={4.8 * k} strokeWidth={0.5 * k} />

      {mini ? null : (
        <>
          {/* Do continente escolhido até a constelação que ele encara. */}
          <line
            className="ceu__visada"
            x1={pOlhar.x}
            y1={pOlhar.y}
            x2={(pOlhar.x / dirOlhar) * 99}
            y2={(pOlhar.y / dirOlhar) * 99}
            stroke={olhar.cor}
          />
          <g transform={`translate(${slotVista.x} ${slotVista.y})`} className="ceu__acesa">
            {vista.tracos.map(([[x1, y1], [x2, y2]], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={olhar.cor} />
            ))}
            {[...estrelasDaVista.values()].map(([x, y]) => (
              <circle key={`${x},${y}`} cx={x} cy={y} r="0.9" fill={olhar.cor} />
            ))}
            <text x="0" y="10" textAnchor="middle" fill={olhar.cor}>
              {vista.nome}
            </text>
          </g>
        </>
      )}

      {rastro.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="0.7" fill="#ff6a9a" opacity={(i / rastro.length) * 0.4} />
      ))}

      {CONTINENTES.map((corpo) => {
        const p = naTela(posicaoEm(corpo, dia));
        const vistaDele = constelacaoVisivel(corpo, dia);
        const aqui = pousada?.id === corpo.id;
        const escolhido = corpo.id === onde;
        const nome = rotulo(p, mini ? 9 : 6);
        return (
          <g
            key={corpo.id}
            className="ceu__corpo"
            data-lua={aqui ? 'sim' : undefined}
            data-escolhido={escolhido ? 'sim' : undefined}
            role="button"
            tabIndex={0}
            aria-pressed={escolhido}
            aria-label={`${corpo.nome} (${corpo.codigo}), voltado para ${vistaDele.nome}. Olhar de lá.`}
            onClick={() => aoEscolher?.(corpo.id)}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                aoEscolher?.(corpo.id);
              }
            }}
          >
            <title>{`${corpo.nome} (${corpo.codigo}) — voltado para ${vistaDele.nome}. Clique para olhar de lá.`}</title>
            {/* Alvo de toque, maior que o corpo: um polegar não acerta 3 unidades. */}
            <circle cx={p.x} cy={p.y} r={8 * k} fill="transparent" />
            {mini ? null : (
              <line x1="0" y1="0" x2={p.x} y2={p.y} stroke={corpo.cor} strokeOpacity="0.12" strokeWidth="0.3" />
            )}
            {escolhido ? (
              <circle className="ceu__halo" cx={p.x} cy={p.y} r={6.2 * k} stroke={corpo.cor} strokeWidth={0.5 * k} />
            ) : null}
            {/* A nimbosfera, como o modelo orbital a chama. */}
            <circle
              cx={p.x}
              cy={p.y}
              r={3.5 * k}
              fill={corpo.cor}
              fillOpacity="0.14"
              stroke={corpo.cor}
              strokeWidth={0.25 * k}
              strokeOpacity="0.5"
            />
            <circle cx={p.x} cy={p.y} r={1.6 * k} fill={corpo.cor} />
            <text
              className="ceu__corpo-nome"
              x={nome.x}
              y={nome.y}
              textAnchor={nome.ancora}
              dominantBaseline={nome.base}
              fill={corpo.cor}
            >
              {corpo.nome}
            </text>
            {mini ? null : (
              <text
                className="ceu__corpo-vista"
                x={nome.x}
                y={nome.y + 3.6}
                textAnchor={nome.ancora}
                dominantBaseline={nome.base}
              >
                {vistaDele.nome}
              </text>
            )}
          </g>
        );
      })}

      <circle cx={lua.x} cy={lua.y} r={1.9 * k} fill="#ff6a9a" stroke="#fff" strokeWidth={0.3 * k} />
      <text
        className="ceu__lua-nome"
        x={rotuloDaLua.x}
        y={rotuloDaLua.y}
        textAnchor={rotuloDaLua.ancora}
        dominantBaseline={rotuloDaLua.base}
      >
        Corvus
      </text>

      {zoom ? (
        <text
          className="ceu__zoom-nome"
          x={moldura(zoom).cx - moldura(zoom).meio + 3}
          y={moldura(zoom).cy - moldura(zoom).meio + moldura(zoom).meio * 0.09 + 2}
          fontSize={Math.max(moldura(zoom).meio * 0.055, 2.2)}
        >
          {zoom.nome} · voltado para {constelacaoVisivel(zoom, dia).nome}
        </text>
      ) : null}
    </svg>
  );
}
