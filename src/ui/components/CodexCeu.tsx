import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CICLOS,
  CONSTELACOES,
  CONTINENTES,
  DIAS_DA_CORVISSEIA,
  DIAS_DA_VOLTA,
  DIAS_DE_ESTADIA,
  DIAS_DO_ANO,
  DIAS_DO_MES,
  ESTACOES,
  afelioUA,
  anguloEm,
  constelacaoVisivel,
  continentePorCodigo,
  estadoDaLua,
  mes as mesDoAno,
  perielioUA,
  posicaoDaLua,
  posicaoEm,
  raioEm,
  type Continente,
  type Ponto,
} from '@/codex/calendario';
import { existe } from '@/codex/corpus';

/**
 * O céu de Aion, andando.
 *
 * A prancha impressa do calendário é o resultado; isto é a causa. Seis
 * continentes percorrem as suas elipses no ritmo real de cada uma, Corvus
 * salta entre eles, e as doze constelações ficam paradas ao fundo enquanto
 * todo o resto gira por baixo delas — que é exatamente o motivo de servirem
 * para marcar o tempo.
 *
 * Nada aqui é animação decorativa. Cada posição sai de `codex/calendario.ts`,
 * dos mesmos elementos orbitais que o modelo do usuário fixou, e por isso o
 * que se vê na tela concorda com a folha do mês na aba ao lado: no dia em
 * que a folha diz que Corvus está sobre Valoran, ela está sobre Valoran aqui.
 *
 * A régua vai até 1080 porque é aí que tudo se repete. Deixar rodando até o
 * fim e ver o sistema voltar à posição inicial é a demonstração mais curta
 * do que A Corvisseia quer dizer.
 */

// --------------------------------------------------------------- escala

/** Pixels por UA. */
const ESCALA = 60;
/** Metade do lado do quadro na visão geral. */
const MOLDURA = 130;
/** Onde fica o anel das constelações. */
const RAIO_DO_ZODIACO = 110;

const rad = (graus: number): number => (graus * Math.PI) / 180;

interface Tela {
  x: number;
  y: number;
}

/** Do plano do sistema para a tela: o norte é para cima, então o y inverte. */
const naTela = (p: Ponto): Tela => ({ x: p.leste * ESCALA, y: -p.norte * ESCALA });

/** O quadro que enquadra a órbita de um continente, para o zoom. */
function moldura(corpo: Continente): { cx: number; cy: number; meio: number } {
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

// ------------------------------------------------------------ o cenário

/**
 * Tudo o que não se mexe: estrelas de fundo, os três anéis, os pontos de
 * periélio e afélio, Aion, a rosa dos ventos e as doze constelações.
 *
 * Fica num `useMemo` sem dependências de propósito. Como o elemento é
 * sempre o mesmo objeto, o React pula esta subárvore inteira nos sessenta
 * quadros por segundo em que só a metade de baixo muda.
 */
function useCenario() {
  return useMemo(() => {
    const estrelas = Array.from({ length: 250 }, (_, i) => {
      // Semeado à mão para o céu ser o mesmo a cada visita.
      const r = (n: number) => {
        const x = Math.sin((i + 1) * n) * 43758.5453;
        return x - Math.floor(x);
      };
      return {
        cx: (r(12.9898) - 0.5) * 2 * MOLDURA,
        cy: (r(78.233) - 0.5) * 2 * MOLDURA,
        r: r(39.425) * 0.3 + 0.05,
        o: r(11.111) * 0.7 + 0.15,
      };
    });

    return (
      <g className="ceu__cenario">
        <defs>
          <radialGradient id="ceu-aion">
            <stop offset="0%" stopColor="#fff8c0" />
            <stop offset="40%" stopColor="#ffd97a" />
            <stop offset="100%" stopColor="#ff9a3a" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {estrelas.map((e, i) => (
          <circle key={i} cx={e.cx} cy={e.cy} r={e.r} fill="#fff" opacity={e.o} />
        ))}

        {/* Os três anéis, com o foco em Aion e não no centro da elipse. */}
        {CONTINENTES.filter((c) => c.codigo === 'C1' || c.codigo === 'C3' || c.codigo === 'C5').map(
          (corpo) => {
            const ciclo = CICLOS[corpo.ciclo];
            const a = ciclo.raioUA * ESCALA;
            const e = ciclo.excentricidade;
            const b = a * Math.sqrt(1 - e * e);
            const m = moldura(corpo);
            return (
              <ellipse
                key={corpo.ciclo}
                className="ceu__anel"
                cx={0}
                cy={0}
                rx={a}
                ry={b}
                stroke={corpo.cor}
                transform={`translate(${m.cx} ${m.cy}) rotate(${corpo.rumoDoPerielio - 90})`}
              />
            );
          },
        )}

        {/* Periélio e afélio dos dois anéis que os têm. */}
        {CONTINENTES.filter((c) => c.codigo === 'C3' || c.codigo === 'C5').flatMap((corpo) => {
          const rumo = corpo.rumoDoPerielio;
          const p = naTela({
            leste: perielioUA(corpo) * Math.sin(rad(rumo)),
            norte: perielioUA(corpo) * Math.cos(rad(rumo)),
          });
          const a = naTela({
            leste: afelioUA(corpo) * Math.sin(rad(rumo + 180)),
            norte: afelioUA(corpo) * Math.cos(rad(rumo + 180)),
          });
          return [
            <circle key={`${corpo.id}-p`} cx={p.x} cy={p.y} r="1.5" fill="#ffd97a" />,
            <circle key={`${corpo.id}-a`} cx={a.x} cy={a.y} r="1.5" fill="#6ab0ff" />,
            <text key={`${corpo.id}-pt`} className="ceu__apside" x={p.x + 2.5} y={p.y - 2} fill="#ffd97a">
              P
            </text>,
            <text key={`${corpo.id}-at`} className="ceu__apside" x={a.x - 4} y={a.y - 2} fill="#6ab0ff">
              A
            </text>,
          ];
        })}

        {/* Aion. */}
        <circle cx="0" cy="0" r="12" fill="url(#ceu-aion)" />
        <circle cx="0" cy="0" r="4" fill="#fff8c0" />
        <text className="ceu__estrela-nome" x="0" y="18" textAnchor="middle">
          AION
        </text>

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
        {CONSTELACOES.map((constelacao) => {
          const divisa = rad(constelacao.de);
          const meio = rad(constelacao.de + 15);
          const sx = RAIO_DO_ZODIACO * Math.sin(meio);
          const sy = -RAIO_DO_ZODIACO * Math.cos(meio);
          const estrelas = new Map<string, [number, number]>();
          for (const [[x1, y1], [x2, y2]] of constelacao.tracos) {
            estrelas.set(`${x1},${y1}`, [x1, y1]);
            estrelas.set(`${x2},${y2}`, [x2, y2]);
          }
          return (
            <g key={constelacao.nome}>
              <line
                className="ceu__divisa"
                x1={92 * Math.sin(divisa)}
                y1={-92 * Math.cos(divisa)}
                x2={128 * Math.sin(divisa)}
                y2={-128 * Math.cos(divisa)}
              />
              <g transform={`translate(${sx} ${sy})`}>
                {constelacao.tracos.map(([[x1, y1], [x2, y2]], i) => (
                  <line key={i} className="ceu__traco" x1={x1} y1={y1} x2={x2} y2={y2} />
                ))}
                {[...estrelas.values()].map(([x, y]) => (
                  <circle key={`${x},${y}`} cx={x} cy={y} r="0.55" fill="#dfe6ff" />
                ))}
                <text className="ceu__constelacao-nome" x="0" y="10" textAnchor="middle">
                  {constelacao.nome}
                </text>
              </g>
            </g>
          );
        })}
      </g>
    );
  }, []);
}

// -------------------------------------------------------------- o quadro

function Quadro({
  dia,
  zoom,
  aoNavegar,
}: {
  dia: number;
  zoom: Continente | null;
  aoNavegar: (chave: string) => void;
}) {
  const cenario = useCenario();

  const caixa = zoom
    ? (() => {
        const m = moldura(zoom);
        return `${m.cx - m.meio} ${m.cy - m.meio} ${m.meio * 2} ${m.meio * 2}`;
      })()
    : `${-MOLDURA} ${-MOLDURA} ${MOLDURA * 2} ${MOLDURA * 2}`;

  // O rastro de Corvus: onde ela esteve nos últimos doze dias.
  const rastro = useMemo(() => {
    const pontos: Tela[] = [];
    for (let i = 20; i >= 1; i -= 1) {
      const quando = dia - i * 0.6;
      if (quando < 0) continue;
      pontos.push(naTela(posicaoDaLua(quando)));
    }
    return pontos;
  }, [dia]);

  const lua = naTela(posicaoDaLua(dia));
  const estado = estadoDaLua(dia);
  const pousada = estado.estado === 'parada' ? continentePorCodigo(estado.em) : null;

  return (
    <svg className="ceu__quadro" viewBox={caixa} preserveAspectRatio="xMidYMid meet" role="img"
      aria-label={`O sistema de Aion no dia ${Math.floor(dia) + 1} da Corvisseia`}>
      {cenario}

      {rastro.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="0.7" fill="#ff6a9a" opacity={(i / rastro.length) * 0.4} />
      ))}

      {CONTINENTES.map((corpo) => {
        const p = naTela(posicaoEm(corpo, dia));
        const vista = constelacaoVisivel(corpo, dia);
        const aqui = pousada?.id === corpo.id;
        return (
          <g
            key={corpo.id}
            className="ceu__corpo"
            data-lua={aqui ? 'sim' : undefined}
            role="button"
            tabIndex={0}
            onClick={() => existe(corpo.chave) && aoNavegar(corpo.chave)}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter' && existe(corpo.chave)) aoNavegar(corpo.chave);
            }}
          >
            <title>{`${corpo.nome} (${corpo.codigo}) — voltado para ${vista.nome}`}</title>
            <line x1="0" y1="0" x2={p.x} y2={p.y} stroke={corpo.cor} strokeOpacity="0.12" strokeWidth="0.3" />
            {/* A nimbosfera, como o modelo orbital a chama. */}
            <circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill={corpo.cor}
              fillOpacity="0.14"
              stroke={corpo.cor}
              strokeWidth="0.25"
              strokeOpacity="0.5"
            />
            <circle cx={p.x} cy={p.y} r="1.6" fill={corpo.cor} />
            <text className="ceu__corpo-nome" x={p.x + 4.5} y={p.y + 1.2} fill={corpo.cor}>
              {corpo.nome}
            </text>
            <text className="ceu__corpo-vista" x={p.x + 4.5} y={p.y + 4.5}>
              {vista.nome}
            </text>
          </g>
        );
      })}

      <circle cx={lua.x} cy={lua.y} r="1.9" fill="#ff6a9a" stroke="#fff" strokeWidth="0.3" />
      <text className="ceu__lua-nome" x={lua.x + 2.5} y={lua.y - 2.5}>
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

// -------------------------------------------------------------- o painel

const numero = (valor: number, casas = 2): string =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

function Painel({
  dia,
  zoom,
  aoZoom,
  aoNavegar,
}: {
  dia: number;
  zoom: Continente | null;
  aoZoom: (corpo: Continente | null) => void;
  aoNavegar: (chave: string) => void;
}) {
  const numeroDoMes = (Math.floor(dia / DIAS_DO_MES) % 12) + 1;
  const mes = mesDoAno(numeroDoMes);
  const diaDoMes = Math.floor(dia % DIAS_DO_MES) + 1;
  const estado = estadoDaLua(dia);

  return (
    <aside className="ceu__painel">
      <section>
        <p className="almanaque__rotulo">Tempo</p>
        <dl className="ceu__fatos">
          <div>
            <dt>Dia da Corvisseia</dt>
            <dd>
              {Math.floor(dia) + 1} <span className="ceu__de">de {DIAS_DA_CORVISSEIA}</span>
            </dd>
          </div>
          <div>
            <dt>Data valoriana</dt>
            <dd>
              {diaDoMes} de {mes.nome}
            </dd>
          </div>
          <div>
            <dt>Constelação</dt>
            <dd className="ceu__constelacao">{mes.constelacao}</dd>
          </div>
          <div>
            <dt>Estação</dt>
            <dd>{ESTACOES[mes.estacao].rotulo}</dd>
          </div>
          <div>
            <dt>Ano · volta</dt>
            <dd>
              {Math.floor(dia / DIAS_DO_ANO) + 1} <span className="ceu__de">de 3</span> ·{' '}
              {Math.floor(dia / DIAS_DA_VOLTA) + 1} <span className="ceu__de">de 6</span>
            </dd>
          </div>
        </dl>
      </section>

      <p className="ceu__corvus" data-estado={estado.estado}>
        <strong>Corvus</strong>
        {estado.estado === 'parada' ? (
          <>
            {' '}pousada sobre <b>{continentePorCodigo(estado.em).nome}</b>
          </>
        ) : (
          <>
            {' '}a caminho de <b>{continentePorCodigo(estado.para).nome}</b>, saindo de{' '}
            {continentePorCodigo(estado.em).nome}
          </>
        )}{' '}
        <span className="ceu__de">{Math.round(estado.progresso * 100)}%</span>
      </p>

      <section>
        <p className="almanaque__rotulo">Os seis continentes</p>
        <div className="ceu__continentes">
          {CONTINENTES.map((corpo) => {
            const r = raioEm(corpo, dia);
            const circular = CICLOS[corpo.ciclo].excentricidade === 0;
            // Um continente só está "no periélio" perto do ponto de fato:
            // comparar distâncias arredondadas acendia o aviso 20° cedo.
            const daApside = (alvo: number) => {
              const bruto = Math.abs(anguloEm(corpo, dia) - alvo) % 360;
              return Math.min(bruto, 360 - bruto);
            };
            const perto = !circular && daApside(corpo.rumoDoPerielio) < 6;
            const longe = !circular && daApside((corpo.rumoDoPerielio + 180) % 360) < 6;
            return (
              <button
                type="button"
                key={corpo.id}
                className="ceu__continente"
                style={{ borderLeftColor: corpo.cor }}
                data-zoom={zoom?.id === corpo.id ? 'sim' : undefined}
                onClick={() => aoZoom(zoom?.id === corpo.id ? null : corpo)}
                title={`Enquadrar a órbita de ${corpo.nome}`}
              >
                <strong style={{ color: corpo.cor }}>
                  {corpo.nome} <span className="ceu__codigo">{corpo.codigo}</span>
                </strong>
                <small>
                  {numero(r)} UA de Aion
                  {circular ? ' · sempre' : ''}
                  {perto ? ' · no periélio' : ''}
                  {longe ? ' · no afélio' : ''}
                </small>
                <small>
                  voltado para <em>{constelacaoVisivel(corpo, dia).nome}</em> ·{' '}
                  {Math.round(anguloEm(corpo, dia))}°
                </small>
              </button>
            );
          })}
        </div>
        <p className="ceu__nota">
          Um continente aqui enquadra a órbita dele; o nome dentro do céu abre o verbete.{' '}
          <button type="button" className="codice-elo" onClick={() => aoNavegar('as-constelacoes')}>
            As doze constelações
          </button>{' '}
          explicam por que os meses se chamam o que se chamam.
        </p>
      </section>
    </aside>
  );
}

// ------------------------------------------------------------ a vista

const VELOCIDADES = [
  { rotulo: '1×', fator: 1 },
  { rotulo: '½×', fator: 0.5 },
  { rotulo: '¼×', fator: 0.25 },
];

/** Dias de céu por quadro de animação, na velocidade 1×. */
const PASSO = 0.5;

export function CodexCeu({ aoNavegar }: { aoNavegar: (chave: string) => void }) {
  // Começa em Equiral, o mesmo mês em que a aba do ano abre.
  const [dia, setDia] = useState(5 * DIAS_DO_MES + DIAS_DE_ESTADIA / 2);
  const [correndo, setCorrendo] = useState(false);
  const [fator, setFator] = useState(1);
  const [zoom, setZoom] = useState<Continente | null>(null);

  const fatorRef = useRef(fator);
  fatorRef.current = fator;

  useEffect(() => {
    if (!correndo) return;
    let quadro = 0;
    const passo = () => {
      setDia((anterior) => (anterior + PASSO * fatorRef.current) % DIAS_DA_CORVISSEIA);
      quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [correndo]);

  const reiniciar = useCallback(() => {
    setCorrendo(false);
    setDia(0);
  }, []);

  return (
    <div className="ceu">
      <div className="ceu__palco">
        <div className="ceu__tela">
          <Quadro dia={dia} zoom={zoom} aoNavegar={aoNavegar} />
        </div>
        <Painel dia={dia} zoom={zoom} aoZoom={setZoom} aoNavegar={aoNavegar} />
      </div>

      <div className="ceu__controles">
        <button
          type="button"
          className="ceu__botao ceu__botao--forte"
          onClick={() => setCorrendo((v) => !v)}
        >
          {correndo ? '❙❙ Pausar' : '▶ Rodar'}
        </button>
        <button type="button" className="ceu__botao" onClick={reiniciar}>
          ⟲ Dia 1
        </button>
        <button
          type="button"
          className="ceu__botao"
          onClick={() => setZoom(null)}
          disabled={zoom === null}
        >
          Visão geral
        </button>

        <span className="ceu__velocidades">
          {VELOCIDADES.map((v) => (
            <button
              type="button"
              key={v.fator}
              className="ceu__botao ceu__botao--pequeno"
              data-ativo={fator === v.fator ? 'sim' : undefined}
              onClick={() => setFator(v.fator)}
            >
              {v.rotulo}
            </button>
          ))}
        </span>

        <ul className="ceu__legenda">
          <li>
            <i style={{ background: '#ffd97a' }} /> Periélio
          </li>
          <li>
            <i style={{ background: '#6ab0ff' }} /> Afélio
          </li>
          <li>
            <i style={{ background: '#ff6a9a' }} /> Corvus
          </li>
        </ul>

        <input
          className="ceu__regua"
          type="range"
          min={0}
          max={DIAS_DA_CORVISSEIA}
          step={0.5}
          value={dia}
          aria-label="Dia da Corvisseia"
          onChange={(evento) => {
            setCorrendo(false);
            setDia(Number(evento.target.value));
          }}
        />
      </div>
    </div>
  );
}
