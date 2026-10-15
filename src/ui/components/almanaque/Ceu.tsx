import { useEffect, useRef, useState } from 'react';
import {
  CICLOS,
  CONTINENTES,
  DIAS_DA_CORVISSEIA,
  DIAS_DA_VOLTA,
  DIAS_DE_ESTADIA,
  DIAS_DE_VIAGEM,
  DIAS_DO_MES,
  ESTACOES,
  PULOS,
  ROTA,
  afelioUA,
  anguloEm,
  constelacaoVisivel,
  continente,
  continentePorCodigo,
  dentroDaCorvisseia,
  estadoDaLua,
  mesDaCorvisseia,
  perielioUA,
  raioEm,
  trecho,
  velocidade,
} from '@/codex/calendario';
import { numero } from '@/codex/formato';
import { Cena } from './cena';
import { COR_DO_PULO, GLIFO_DO_PULO, dataValoriana } from './comum';
import { Regua } from './Regua';
import type { Almanaque } from './tipos';

/**
 * O céu de Aion, andando.
 *
 * A folha impressa é o resultado; isto é a causa. Seis continentes percorrem
 * as suas elipses no ritmo real de cada uma, Corvus salta entre eles, e as
 * doze constelações ficam paradas ao fundo enquanto todo o resto gira por
 * baixo delas — que é exatamente o motivo de servirem para marcar o tempo.
 *
 * Nada aqui é animação decorativa. O dia vem do casco do almanaque, o mesmo
 * que a folha e a Corvisseia leem, e por isso o que se vê concorda com as
 * outras telas: no dia em que a folha diz que Corvus está sobre Valoran, ela
 * está sobre Valoran aqui. A régua vai até 1080 porque é aí que tudo se
 * repete: deixar rodando até o fim e ver o sistema voltar à posição inicial
 * é a demonstração mais curta do que A Corvisseia quer dizer.
 */

/** Quantos dias do céu passam por segundo de relógio, a 1×: um mês por segundo. */
const DIAS_POR_SEGUNDO = 30;

const VELOCIDADES = [
  { rotulo: '¼×', fator: 0.25 },
  { rotulo: '½×', fator: 0.5 },
  { rotulo: '1×', fator: 1 },
  { rotulo: '2×', fator: 2 },
  { rotulo: '4×', fator: 4 },
];

// ------------------------------------------------------------------ painel

/** Corvus agora: onde está, o que faz e, se viaja, a que velocidade. */
function CartaoDeCorvus({ a }: { a: Almanaque }) {
  const estado = estadoDaLua(a.dia);
  const mesC = mesDaCorvisseia(a.dia);
  const t = trecho(mesC);
  const casa = continentePorCodigo(estado.em);
  const destino = continentePorCodigo(estado.para);
  const noMes = dentroDaCorvisseia(a.dia) % DIAS_DO_MES;
  const parte = DIAS_DE_ESTADIA / DIAS_DO_MES;

  return (
    <section className="ceu__corvus" data-estado={estado.estado} aria-live="off">
      <p className="almanaque__rotulo">Corvus</p>
      <p className="ceu__corvus-frase">
        {estado.estado === 'parada' ? (
          <>
            Pousada sobre <b style={{ color: casa.cor }}>{casa.nome}</b>. Parte para{' '}
            <b style={{ color: destino.cor }}>{destino.nome}</b> em{' '}
            {numero(Math.max(0, DIAS_DE_ESTADIA - noMes), 1)} dias.
          </>
        ) : (
          <>
            A caminho de <b style={{ color: destino.cor }}>{destino.nome}</b>, saindo de{' '}
            <span style={{ color: casa.cor }}>{casa.nome}</span>.
          </>
        )}
      </p>

      {/* O mês de Corvus: 19,5 dias parada, 10,5 viajando, e o instante em que se está. */}
      <div className="ceu__mes-da-lua" aria-hidden="true">
        <i className="ceu__mes-pouso" style={{ flex: parte }} />
        <i className="ceu__mes-viagem" style={{ flex: 1 - parte, background: COR_DO_PULO[t.pulo] }} />
        <b style={{ left: `${(noMes / DIAS_DO_MES) * 100}%` }} />
      </div>
      <p className="ceu__mes-legenda">
        <span>estadia · {numero(DIAS_DE_ESTADIA, 1)} d</span>
        <span>viagem · {numero(DIAS_DE_VIAGEM, 1)} d</span>
      </p>

      <p className="ceu__corvus-pulo" data-pulo={t.pulo}>
        <span className="ceu__glifo">{GLIFO_DO_PULO[t.pulo]}</span>
        <span>
          <strong>{PULOS[t.pulo].rotulo}</strong> · {numero(t.distanciaUA)} UA ·{' '}
          {Math.round(velocidade(t.distanciaUA))} km/s
        </span>
      </p>
      <button
        type="button"
        className="ceu__ligacao"
        onClick={() => a.abrir('corvisseia', { mesC })}
      >
        Ver este trecho na Corvisseia →
      </button>
    </section>
  );
}

function Fatos({ a }: { a: Almanaque }) {
  const data = dataValoriana(a.dia);
  const olhar = continente(a.onde);
  const vista = constelacaoVisivel(olhar, a.dia);
  return (
    <section>
      <p className="almanaque__rotulo">Agora</p>
      <dl className="ceu__fatos">
        <div>
          <dt>Data valoriana</dt>
          <dd>
            {data.diaDoMes} de {data.mes.nome}
          </dd>
        </div>
        <div>
          <dt>Estação</dt>
          <dd>{ESTACOES[data.mes.estacao].rotulo}</dd>
        </div>
        <div>
          <dt>Dia da Corvisseia</dt>
          <dd>
            {Math.floor(a.dia) + 1} <span className="ceu__de">de {DIAS_DA_CORVISSEIA}</span>
          </dd>
        </div>
        <div>
          <dt>Ano · volta</dt>
          <dd>
            {data.ano} <span className="ceu__de">de 3</span> · {Math.floor(a.dia / DIAS_DA_VOLTA) + 1}{' '}
            <span className="ceu__de">de 6</span>
          </dd>
        </div>
        <div>
          <dt>De {olhar.nome}, o céu é</dt>
          <dd className="ceu__constelacao" style={{ color: olhar.cor }}>
            {vista.nome}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Continentes({ a }: { a: Almanaque }) {
  return (
    <section>
      <p className="almanaque__rotulo">Os seis continentes</p>
      <div className="ceu__continentes">
        {CONTINENTES.map((corpo) => {
          const r = raioEm(corpo, a.dia);
          const circular = CICLOS[corpo.ciclo].excentricidade === 0;
          // Só está "no periélio" perto do ponto de fato: comparar distâncias
          // arredondadas acendia o aviso 20° cedo.
          const daApside = (alvo: number) => {
            const bruto = Math.abs(anguloEm(corpo, a.dia) - alvo) % 360;
            return Math.min(bruto, 360 - bruto);
          };
          const perto = !circular && daApside(corpo.rumoDoPerielio) < 6;
          const longe = !circular && daApside((corpo.rumoDoPerielio + 180) % 360) < 6;
          const escolhido = corpo.id === a.onde;
          return (
            <div
              className="ceu__continente"
              key={corpo.id}
              style={{ borderLeftColor: corpo.cor }}
              data-escolhido={escolhido ? 'sim' : undefined}
            >
              <button
                type="button"
                className="ceu__continente-corpo"
                aria-pressed={escolhido}
                onClick={() => a.escolherOnde(corpo.id)}
                title={`Olhar de ${corpo.nome}`}
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
                  voltado para <em>{constelacaoVisivel(corpo, a.dia).nome}</em> ·{' '}
                  {Math.round(anguloEm(corpo, a.dia))}°
                </small>
              </button>
              <button
                type="button"
                className="ceu__verbete"
                onClick={() => a.aoNavegar(corpo.chave)}
                aria-label={`Abrir o verbete de ${corpo.nome}`}
                title={`Abrir o verbete de ${corpo.nome}`}
              >
                ↗
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Os três anéis, com os moradores de cada um. Estavam na folha; moram melhor aqui. */
function Orbitas({ a }: { a: Almanaque }) {
  return (
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
                  : `${numero(perielioUA(moradores[0]!))}–${numero(afelioUA(moradores[0]!))} UA`}
              </p>
              <p className="ciclo__moradores">
                {moradores.map((c) => (
                  <button type="button" key={c.id} onClick={() => a.escolherOnde(c.id)}>
                    <i style={{ background: c.cor }} />
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
        {ROTA.map((codigo) => continentePorCodigo(codigo).nome).join(' → ')} → …{' '}
        <button type="button" className="codice-elo" onClick={() => a.aoNavegar('as-constelacoes')}>
          As doze constelações
        </button>{' '}
        explicam por que os meses se chamam o que se chamam.
      </p>
    </section>
  );
}

// -------------------------------------------------------------------- tela

export function Ceu({ a }: { a: Almanaque }) {
  // Se alguém pediu "tocar este trecho", o céu já abre andando.
  const [correndo, setCorrendo] = useState(a.tocarAte !== null);
  const [fator, setFator] = useState(1);
  const [aproximar, setAproximar] = useState(false);

  // O laço de animação vive fora do ciclo de renderização: ele lê estas
  // referências, que a cada renderização apontam para o que há de mais novo.
  const viva = useRef({ fator, tocarAte: a.tocarAte, irParaDia: a.irParaDia, terminou: a.terminouDeTocar });
  viva.current = { fator, tocarAte: a.tocarAte, irParaDia: a.irParaDia, terminou: a.terminouDeTocar };
  const ponteiro = useRef(a.dia);
  // Se o dia mudou por fora (a régua, um mês escolhido), o ponteiro o segue.
  useEffect(() => {
    ponteiro.current = a.dia;
  }, [a.dia]);

  useEffect(() => {
    if (!correndo) return;
    let quadro = 0;
    let anterior = performance.now();
    const passo = (agora: number) => {
      // Tempo de relógio, não de quadro: a 120 Hz a lua não corre o dobro.
      // O teto de 0,1 s evita o salto de quem volta para a aba depois de um minuto.
      const dt = Math.min(0.1, (agora - anterior) / 1000);
      anterior = agora;
      const { fator: f, tocarAte, irParaDia, terminou } = viva.current;
      const delta = DIAS_POR_SEGUNDO * f * dt;
      const seguinte = ponteiro.current + delta;
      if (tocarAte !== null && ponteiro.current < tocarAte && seguinte >= tocarAte) {
        // Era só um trecho: para exatamente onde ele acaba.
        ponteiro.current = dentroDaCorvisseia(tocarAte);
        irParaDia(ponteiro.current);
        setCorrendo(false);
        terminou();
        return;
      }
      ponteiro.current = dentroDaCorvisseia(seguinte);
      irParaDia(ponteiro.current);
      quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [correndo]);

  const data = dataValoriana(a.dia);
  const estado = estadoDaLua(a.dia);
  const t = trecho(data.mesC);
  const olhar = continente(a.onde);

  const parar = () => setCorrendo(false);
  const andar = (dias: number) => {
    parar();
    a.irParaDia(dentroDaCorvisseia(a.dia + dias));
  };

  return (
    <div
      className="ceu"
      onKeyDown={(evento) => {
        // A régua já trata as próprias setas e avisa com preventDefault; sem
        // este teste cada seta andaria duas vezes, uma lá e outra aqui.
        if (evento.defaultPrevented) return;
        const alvo = evento.target as Element;
        // Espaço roda e pausa — menos quando o foco está num botão, onde o
        // espaço já tem o seu trabalho.
        if (evento.key === ' ' && alvo.tagName !== 'BUTTON' && alvo.getAttribute('role') !== 'button') {
          evento.preventDefault();
          setCorrendo((v) => !v);
        } else if (evento.key === 'ArrowRight' || evento.key === 'ArrowLeft') {
          evento.preventDefault();
          andar((evento.key === 'ArrowRight' ? 1 : -1) * (evento.shiftKey ? DIAS_DO_MES : 1));
        }
      }}
    >
      <div className="ceu__palco">
        <div className="ceu__coluna">
          <div className="ceu__tela">
            <Cena
              dia={a.dia}
              onde={a.onde}
              zoom={aproximar ? olhar : null}
              aoEscolher={a.escolherOnde}
            />
            <div className="ceu__selo" aria-hidden="true">
              <strong>
                {data.diaDoMes} de {data.mes.nome}
              </strong>
              <span>
                ano {data.ano} · dia {Math.floor(a.dia) + 1}
              </span>
              {/* Aproximado, o selo diz de quem é a órbita em quadro. O rótulo
                  ficava desenhado dentro do SVG, no canto de cima à esquerda —
                  exatamente onde este selo está, e o escondia. */}
              {aproximar ? (
                <span className="ceu__selo-zoom">
                  ◎ Órbita de <b style={{ color: olhar.cor }}>{olhar.nome}</b> · voltado para{' '}
                  {constelacaoVisivel(olhar, a.dia).nome}
                </span>
              ) : null}
              <span className="ceu__selo-lua" data-estado={estado.estado}>
                {/* Parada, o ponto é de Corvus; em viagem, é a cor do pulo. */}
                <i style={{ background: estado.estado === 'parada' ? '#ff6a9a' : COR_DO_PULO[t.pulo] }} />
                {estado.estado === 'parada'
                  ? `Corvus sobre ${continentePorCodigo(estado.em).nome}`
                  : `${Math.round(velocidade(t.distanciaUA))} km/s rumo a ${continentePorCodigo(estado.para).nome}`}
              </span>
            </div>
          </div>

          <div className="ceu__controles">
            <button
              type="button"
              className="ceu__botao ceu__botao--forte"
              aria-pressed={correndo}
              onClick={() => setCorrendo((v) => !v)}
              title="Espaço"
            >
              {correndo ? '❙❙ Pausar' : '▶ Rodar'}
            </button>
            <span className="ceu__passos" role="group" aria-label="Andar pelo calendário">
              <button type="button" className="ceu__botao" onClick={() => andar(-DIAS_DO_MES)} title="Um mês para trás (Shift + ←)">
                ‹ Mês
              </button>
              <button type="button" className="ceu__botao" onClick={() => andar(DIAS_DO_MES)} title="Um mês para a frente (Shift + →)">
                Mês ›
              </button>
              <button
                type="button"
                className="ceu__botao"
                onClick={() => {
                  parar();
                  a.irParaDia(0);
                }}
                title="Voltar ao dia 1 da Corvisseia"
              >
                ⟲ Início
              </button>
            </span>
            <span className="ceu__velocidades" role="group" aria-label="Velocidade">
              {VELOCIDADES.map((v) => (
                <button
                  type="button"
                  key={v.fator}
                  className="ceu__botao ceu__botao--pequeno"
                  aria-pressed={fator === v.fator}
                  data-ativo={fator === v.fator ? 'sim' : undefined}
                  onClick={() => setFator(v.fator)}
                >
                  {v.rotulo}
                </button>
              ))}
            </span>
            <button
              type="button"
              className="ceu__botao"
              aria-pressed={aproximar}
              data-ativo={aproximar ? 'sim' : undefined}
              onClick={() => setAproximar((v) => !v)}
              title={`Aproximar da órbita de ${olhar.nome}`}
            >
              ◎ Aproximar
            </button>
          </div>

          <Regua
            dia={a.dia}
            onde={a.onde}
            aoMudar={(dia) => {
              parar();
              a.irParaDia(dia);
            }}
          />

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
            <li>
              <i className="ceu__legenda-trajeto" /> Trajeto do mês
            </li>
          </ul>
          <p className="ceu__dica">
            Espaço roda e pausa · ← → andam um dia, com Shift um mês · toque num continente para
            olhar de lá.
          </p>
        </div>

        <aside className="ceu__painel" aria-label="O que o céu mostra agora">
          <CartaoDeCorvus a={a} />
          <Fatos a={a} />
          <Continentes a={a} />
        </aside>
      </div>

      <Orbitas a={a} />
    </div>
  );
}
