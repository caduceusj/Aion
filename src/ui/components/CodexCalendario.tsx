import { useMemo, useState } from 'react';
import {
  CICLOS,
  CONTINENTES,
  CORVISSEIA,
  DIAS_DA_SEMANA,
  DIAS_DE_ESTADIA,
  DIAS_DE_VIAGEM,
  DIAS_DO_MES,
  ESTACOES,
  FASES_DA_CONSTELACAO,
  FASES_DA_LUA,
  MESES,
  PULOS,
  ROTA,
  continente,
  continentePorCodigo,
  faseDaConstelacao,
  faseDaLua,
  mes as mesDoAno,
  posicaoEm,
  trecho,
  velocidade,
  type ContinenteId,
  type Mes,
} from '@/codex/calendario';
import { existe } from '@/codex/corpus';
import { CodexCeu } from '@/ui/components/CodexCeu';

/**
 * O Almanaque: o calendário de Aion, e o céu de onde ele saiu.
 *
 * Duas coisas em uma vista, porque no mundo elas também são uma só. Em cima,
 * o sistema: três órbitas, seis continentes e a lua que salta entre eles. Em
 * baixo, a prancha do mês — a mesma folha impressa do calendário valoriano,
 * com as fases da constelação pintando os dias e a faixa da lua por baixo.
 *
 * O mês escolhido manda nas duas: trocar de mês gira as órbitas, move Corvus
 * para o continente daquele mês e acende o trecho que ela percorre no fim
 * dele. É a maneira mais curta de mostrar que o calendário não é uma
 * convenção — é a posição de uma lua, escrita em papel.
 */

/** 19,5 e não 19.5: o Códice inteiro fala português. */
const numero = (valor: number, casas = 2): string =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

const CENTRO = 200;
const RAIO_MAXIMO = 150;
/** UA por pixel, fixado pelo afélio da órbita mais externa. */
const ESCALA = RAIO_MAXIMO / (CICLOS.longo.raioUA * (1 + CICLOS.longo.excentricidade));

/**
 * Onde um continente está no mês pedido.
 *
 * A geometria não é deste arquivo: vem de `codex/calendario.ts`, a mesma que
 * move o modelo vivo da aba ao lado. Assim as duas vistas nunca discordam
 * sobre onde um continente está — inclusive sobre a elipse, que aproxima e
 * afasta cada um de Aion ao longo do ano.
 *
 * O dia escolhido é o da partida de Corvus: o fim da estadia dela, que é o
 * instante que o trecho do mês mede.
 */
const diaDoMes = (numeroDoMes: number): number =>
  (numeroDoMes - 1) * DIAS_DO_MES + DIAS_DE_ESTADIA;

function posicao(id: ContinenteId, numeroDoMes: number): { x: number; y: number } {
  const p = posicaoEm(continente(id), diaDoMes(numeroDoMes));
  return { x: CENTRO + p.leste * ESCALA, y: CENTRO - p.norte * ESCALA };
}

/**
 * Onde escrever o nome de um continente.
 *
 * Sempre por cima do disco fazia dois nomes se atropelarem quando dois
 * continentes estavam perto na tela — e eles ficam perto com frequência,
 * porque é disso que o diagrama trata. Empurrar o rótulo para fora, na
 * direção que sai de Aion, separa-os: dois corpos em ângulos diferentes
 * têm rótulos em direções diferentes.
 */
function ondeVaiORotulo(
  p: { x: number; y: number },
  afastamento: number,
): { x: number; y: number; ancora: 'start' | 'middle' | 'end'; base: 'auto' | 'middle' | 'hanging' } {
  const dx = p.x - CENTRO;
  const dy = p.y - CENTRO;
  const distancia = Math.hypot(dx, dy) || 1;
  const ux = dx / distancia;
  const uy = dy / distancia;
  return {
    x: p.x + ux * afastamento,
    y: p.y + uy * afastamento,
    // Quem está à direita do centro escreve para a direita, e assim por diante.
    ancora: ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle',
    base: uy > 0.35 ? 'hanging' : uy < -0.35 ? 'auto' : 'middle',
  };
}

// =====================================================================
// O DIAGRAMA
// =====================================================================

function Diagrama({
  mes,
  aoNavegar,
}: {
  mes: Mes;
  aoNavegar: (chave: string) => void;
}) {
  const daVez = trecho(mes.numero);
  const origem = continentePorCodigo(daVez.de);
  const destino = continentePorCodigo(daVez.para);
  const de = posicao(origem.id, mes.numero);
  const para = posicao(destino.id, mes.numero);

  return (
    <figure className="almanaque__diagrama">
      {/* Apertado no conteúdo: o afélio da órbita externa mais o rótulo. Com a
          moldura de 400 sobrava margem morta, e no celular margem morta é
          rolagem a mais para ver o mesmo desenho. */}
      <svg viewBox="32 32 336 336" role="img" aria-label="As três órbitas de Aion">
        {(['longo', 'medio', 'curto'] as const).map((id) => {
          const ciclo = CICLOS[id];
          const a = ciclo.raioUA * ESCALA;
          const b = a * Math.sqrt(1 - ciclo.excentricidade * ciclo.excentricidade);
          // O foco é a estrela, então o centro da elipse fica deslocado dela.
          const desvio = a * ciclo.excentricidade;
          const rumo = id === 'longo' ? 134 : 0;
          return (
            <ellipse
              key={id}
              className="orbita__anel"
              cx={0}
              cy={0}
              rx={a}
              ry={b}
              data-ciclo={id}
              transform={`translate(${CENTRO + desvio * Math.sin(((rumo + 180) * Math.PI) / 180)} ${CENTRO - desvio * Math.cos(((rumo + 180) * Math.PI) / 180)}) rotate(${rumo - 90})`}
            />
          );
        })}

        {/* O salto do mês: de onde a lua está para onde ela vai. */}
        <line className="orbita__salto" x1={de.x} y1={de.y} x2={para.x} y2={para.y} />

        <circle className="orbita__estrela" cx={CENTRO} cy={CENTRO} r="11" />
        <text className="orbita__estrela-nome" x={CENTRO} y={CENTRO + 26} textAnchor="middle">
          Aion
        </text>

        {CONTINENTES.map((corpo) => {
          const p = posicao(corpo.id, mes.numero);
          const aqui = corpo.id === mes.lua;
          const alvo = corpo.id === destino.id;
          const rotulo = ondeVaiORotulo(p, aqui ? 21 : 15);
          return (
            <g
              key={corpo.id}
              className="orbita__corpo"
              data-lua={aqui ? 'sim' : undefined}
              data-destino={alvo ? 'sim' : undefined}
              onClick={() => existe(corpo.chave) && aoNavegar(corpo.chave)}
              role="button"
              tabIndex={0}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter' && existe(corpo.chave)) aoNavegar(corpo.chave);
              }}
            >
              <title>{`${corpo.nome} — ${corpo.codigo}, ${CICLOS[corpo.ciclo].rotulo}`}</title>
              <circle className="orbita__disco" cx={p.x} cy={p.y} r={aqui ? 9 : 6.5} />
              {aqui ? <circle className="orbita__halo" cx={p.x} cy={p.y} r="15" /> : null}
              <text
                className="orbita__nome"
                x={rotulo.x}
                y={rotulo.y}
                textAnchor={rotulo.ancora}
                dominantBaseline={rotulo.base}
              >
                {corpo.nome}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption>
        No mês de <strong>{mes.nome}</strong>, Corvus está sobre{' '}
        <strong>{continente(mes.lua).nome}</strong> e parte para{' '}
        <strong>{destino.nome}</strong> — {numero(daVez.distanciaUA)} UA em {numero(DIAS_DE_VIAGEM, 1)}{' '}
        dias, cerca de {Math.round(velocidade(daVez.distanciaUA))} km/s. Os anéis são as órbitas
        de verdade, elipses e tudo, no instante exato em que ela levanta voo.
      </figcaption>
    </figure>
  );
}

// =====================================================================
// A PRANCHA DO MÊS
// =====================================================================

/** A folha impressa: 30 dias, cinco semanas de seis, e a faixa da lua. */
function Folha({ mes, onde }: { mes: Mes; onde: ContinenteId }) {
  const estacao = ESTACOES[mes.estacao];
  const dias = Array.from({ length: DIAS_DO_MES }, (_, i) => i + 1);

  return (
    <article className="folha" style={{ ['--estacao' as string]: estacao.cor }}>
      <header className="folha__topo">
        <div>
          <h3 className="folha__mes">{mes.nome}</h3>
          <p className="folha__linha">Constelação — {mes.constelacao}</p>
          <p className="folha__linha">Estação — {estacao.rotulo}</p>
        </div>
        <div className="folha__lua" data-aqui={mes.lua === onde ? 'sim' : undefined}>
          {continente(mes.lua).nome}
        </div>
      </header>

      <div className="folha__semana">
        {DIAS_DA_SEMANA.map((dia) => (
          <span key={dia}>{dia}</span>
        ))}
      </div>

      <div className="folha__grade">
        {dias.map((dia) => (
          <div className="folha__dia" key={dia} data-fase={faseDaConstelacao(dia).id}>
            <span>{dia}</span>
            <i className="folha__lua-faixa" data-fase={faseDaLua(mes, dia, onde)} />
          </div>
        ))}
      </div>

      {mes.nota ? <p className="folha__nota">{mes.nota}</p> : null}
    </article>
  );
}

function Legendas({ onde }: { onde: ContinenteId }) {
  return (
    <div className="almanaque__legendas">
      <div>
        <p className="almanaque__rotulo">Constelação</p>
        {FASES_DA_CONSTELACAO.map((fase) => (
          <p className="legenda__item" key={fase.id}>
            <i className="legenda__cor" data-fase={fase.id} />
            <strong>{fase.rotulo}</strong>
            <small>
              dias {fase.de}–{fase.ate} · {fase.nota}
            </small>
          </p>
        ))}
      </div>
      <div>
        <p className="almanaque__rotulo">Fases da lua, vistas de {continente(onde).nome}</p>
        {Object.values(FASES_DA_LUA).map((fase) => (
          <p className="legenda__item" key={fase.id}>
            <i className="legenda__cor legenda__cor--lua" data-fase={fase.id} />
            <strong>{fase.rotulo}</strong>
            <small>{fase.nota}</small>
          </p>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// A CORVISSEIA
// =====================================================================

function Corvisseia({
  mesDestacado,
  aoEscolher,
}: {
  mesDestacado: number;
  aoEscolher: (numeroDoMes: number) => void;
}) {
  const voltas = useMemo(() => {
    const mapa = new Map<number, typeof CORVISSEIA>();
    for (const item of CORVISSEIA) {
      mapa.set(item.volta, [...(mapa.get(item.volta) ?? []), item]);
    }
    return [...mapa.entries()];
  }, []);

  return (
    <div className="corvisseia">
      <p className="corvisseia__intro">
        Corvus mantém sempre os mesmos {numero(DIAS_DE_ESTADIA, 1)} dias parada e{' '}
        {numero(DIAS_DE_VIAGEM, 1)} de
        viagem, por mais longe que esteja o próximo continente — ela acelera ou desacelera para
        chegar no mesmo prazo. Seis voltas depois, as distâncias se repetem exatamente, e o
        padrão recomeça: 1080 dias, três anos valorianos, A Corvisseia.
      </p>

      {voltas.map(([volta, trechos]) => (
        <section className="corvisseia__volta" key={volta}>
          <h4>
            Volta {volta}
            <small>
              meses {trechos[0]?.mes}–{trechos[trechos.length - 1]?.mes}
            </small>
          </h4>
          <table className="corvisseia__tabela">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Trecho</th>
                <th>Distância</th>
                <th>Velocidade</th>
                <th>Pulo</th>
              </tr>
            </thead>
            <tbody>
              {trechos.map((item) => {
                const doAno = ((item.mes - 1) % MESES.length) + 1;
                const de = continentePorCodigo(item.de);
                const para = continentePorCodigo(item.para);
                return (
                  <tr
                    key={item.mes}
                    data-ativo={doAno === mesDestacado ? 'sim' : undefined}
                    onClick={() => aoEscolher(doAno)}
                  >
                    <td>
                      <strong>{item.mes}</strong>
                      <small>{mesDoAno(doAno).nome}</small>
                    </td>
                    <td>
                      {de.nome} <span aria-hidden="true">→</span> {para.nome}
                    </td>
                    <td className="corvisseia__numero">{numero(item.distanciaUA)} UA</td>
                    <td className="corvisseia__numero">
                      {Math.round(velocidade(item.distanciaUA))} km/s
                    </td>
                    <td>
                      <span className="corvisseia__pulo" data-pulo={item.pulo}>
                        {PULOS[item.pulo].rotulo}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}

// =====================================================================
// A VISTA
// =====================================================================

export function CodexCalendario({ aoNavegar }: { aoNavegar: (chave: string) => void }) {
  // Abre em Equiral: é um dos dois meses em que a lua está sobre Valoran, e
  // portanto o único estado da prancha em que as três fases aparecem.
  const [numeroDoMes, setNumeroDoMes] = useState(6);
  const [onde, setOnde] = useState<ContinenteId>('valoran');
  const [aba, setAba] = useState<'ano' | 'ceu' | 'corvisseia'>('ano');

  const mes = mesDoAno(numeroDoMes);

  return (
    <div className="almanaque">
      <header className="almanaque__topo">
        <div>
          <p className="almanaque__eyebrow">O Almanaque dos Viajantes</p>
          <h2 className="almanaque__titulo">O Calendário de Aion</h2>
        </div>
        <div className="almanaque__abas" role="tablist" aria-label="O almanaque">
          <button
            type="button"
            role="tab"
            aria-selected={aba === 'ano'}
            data-ativo={aba === 'ano' ? 'sim' : undefined}
            onClick={() => setAba('ano')}
          >
            O Ano
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={aba === 'ceu'}
            data-ativo={aba === 'ceu' ? 'sim' : undefined}
            onClick={() => setAba('ceu')}
          >
            O Céu
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={aba === 'corvisseia'}
            data-ativo={aba === 'corvisseia' ? 'sim' : undefined}
            onClick={() => setAba('corvisseia')}
          >
            A Corvisseia
          </button>
        </div>
      </header>

      {aba === 'ceu' ? null : (
      <nav className="almanaque__meses" aria-label="Os doze meses">
        {MESES.map((item) => (
          <button
            type="button"
            key={item.numero}
            className="pastilha-mes"
            data-estacao={item.estacao}
            data-ativo={item.numero === numeroDoMes ? 'sim' : undefined}
            onClick={() => setNumeroDoMes(item.numero)}
            title={`${item.nome} — ${item.constelacao}, ${ESTACOES[item.estacao].rotulo}`}
          >
            <span>{item.nome}</span>
            <small>{continente(item.lua).nome}</small>
          </button>
        ))}
      </nav>
      )}

      {aba === 'ano' ? (
        <>
          <div className="almanaque__corpo">
            <Diagrama mes={mes} aoNavegar={aoNavegar} />
            <Folha mes={mes} onde={onde} />
          </div>

          <div className="almanaque__ponto-de-vista">
            <p className="almanaque__rotulo">A folha de qual continente?</p>
            <div className="almanaque__continentes">
              {CONTINENTES.map((corpo) => (
                <button
                  type="button"
                  key={corpo.id}
                  data-ativo={corpo.id === onde ? 'sim' : undefined}
                  onClick={() => setOnde(corpo.id)}
                >
                  {corpo.nome}
                  <small>{corpo.codigo}</small>
                </button>
              ))}
            </div>
            <p className="almanaque__nota">
              O mês, a semana e a constelação são os mesmos nos seis continentes — só a faixa da
              lua muda, porque só ela depende de onde você está.
            </p>
          </div>

          <Legendas onde={onde} />

          <section className="almanaque__orbitas">
            <p className="almanaque__rotulo">As três órbitas</p>
            <div className="ciclos">
              {(['curto', 'medio', 'longo'] as const).map((id) => {
                const ciclo = CICLOS[id];
                const moradores = CONTINENTES.filter((c) => c.ciclo === id);
                return (
                  <div className="ciclo" key={id} data-ciclo={id}>
                    <h4>{ciclo.rotulo}</h4>
                    <p className="ciclo__numeros">
                      {ciclo.periodo} dias · {ciclo.forma} ·{' '}
                      {ciclo.excentricidade === 0
                        ? `${numero(ciclo.raioUA)} UA sempre`
                        : `${numero(ciclo.raioUA * (1 - ciclo.excentricidade))}–${numero(ciclo.raioUA * (1 + ciclo.excentricidade))} UA`}
                    </p>
                    <p className="ciclo__moradores">
                      {moradores.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => existe(c.chave) && aoNavegar(c.chave)}
                        >
                          {c.nome}
                        </button>
                      ))}
                    </p>
                    <p className="ciclo__nota">{ciclo.nota}</p>
                  </div>
                );
              })}
            </div>
            <p className="almanaque__nota">
              A rota de Corvus atravessa as três a cada volta:{' '}
              {ROTA.map((codigo) => continentePorCodigo(codigo).nome).join(' → ')} → …
            </p>
          </section>
        </>
      ) : aba === 'ceu' ? (
        <CodexCeu aoNavegar={aoNavegar} />
      ) : (
        <Corvisseia mesDestacado={numeroDoMes} aoEscolher={setNumeroDoMes} />
      )}
    </div>
  );
}
