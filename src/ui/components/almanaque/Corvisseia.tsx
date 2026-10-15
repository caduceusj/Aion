import {
  CICLOS,
  DIAS_DA_CORVISSEIA,
  DIAS_DA_VOLTA,
  DIAS_DE_ESTADIA,
  DIAS_DE_VIAGEM,
  ROTA,
  TRECHOS_DA_ROTA,
  TRECHO_CONSTANTE,
  TRECHO_MAIS_CURTO,
  TRECHO_MAIS_LONGO,
  TRECHO_QUE_MAIS_VARIA,
  continente,
  continentePorCodigo,
  mesDaCorvisseia,
  mmc,
  trecho,
  velocidade,
  type CodigoOrbital,
} from '@/codex/calendario';
import { inteiro, numero } from '@/codex/formato';
import { COR_DO_PULO, GLIFO_DO_PULO, variaveis } from './comum';
import { Detalhe } from './Detalhe';
import { Matriz } from './Matriz';
import { Ritmo } from './Ritmo';
import type { Almanaque } from './tipos';

/**
 * A Corvisseia: os 1080 dias em que o padrão de distâncias fecha.
 *
 * Esta tela era seis tabelas iguais empilhadas, e o padrão — o assunto da
 * página — só aparecia para quem lesse os 36 números. Agora ela tem três
 * leituras do mesmo dado, que se respondem entre si:
 *
 *   - o ritmo, que mostra os 36 meses em fila e deixa ver a forma;
 *   - a matriz, que dobra a tabela em trechos × voltas e deixa comparar;
 *   - o detalhe, que dá a um trecho o espaço para dizer tudo.
 *
 * Escolher um mês em qualquer uma move o cursor do almanaque inteiro: os
 * outros dois acompanham, e o céu abre no instante exato da partida.
 */

const nomeDoTrecho = (de: CodigoOrbital, para: CodigoOrbital): string =>
  `${continentePorCodigo(de).nome} → ${continentePorCodigo(para).nome}`;

// ----------------------------------------------------------------- números

/** Os quatro números que resumem a tabela — e cada um leva ao trecho que ele cita. */
function Numeros({ a, mesC }: { a: Almanaque; mesC: number }) {
  const maisVaria = TRECHO_QUE_MAIS_VARIA;
  const constante = TRECHO_CONSTANTE;
  const cartoes = [
    {
      id: 'rapido',
      rotulo: 'O trecho mais veloz',
      valor: `${Math.round(velocidade(TRECHO_MAIS_LONGO.distanciaUA))} km/s`,
      nota: `${nomeDoTrecho(TRECHO_MAIS_LONGO.de, TRECHO_MAIS_LONGO.para)} · ${numero(TRECHO_MAIS_LONGO.distanciaUA)} UA`,
      mesC: TRECHO_MAIS_LONGO.mes,
      cor: COR_DO_PULO.intenso,
    },
    {
      id: 'manso',
      rotulo: 'O mais manso',
      valor: `${Math.round(velocidade(TRECHO_MAIS_CURTO.distanciaUA))} km/s`,
      nota: `${nomeDoTrecho(TRECHO_MAIS_CURTO.de, TRECHO_MAIS_CURTO.para)} · ${numero(TRECHO_MAIS_CURTO.distanciaUA)} UA`,
      mesC: TRECHO_MAIS_CURTO.mes,
      cor: COR_DO_PULO['sem-pulo'],
    },
    {
      id: 'varia',
      rotulo: 'Quem mais varia',
      valor: `${numero(maisVaria.variacao, 1)}×`,
      nota: `${nomeDoTrecho(maisVaria.de, maisVaria.para)} · de ${numero(maisVaria.menor.distanciaUA)} a ${numero(maisVaria.maior.distanciaUA)} UA`,
      mesC: maisVaria.maior.mes,
      cor: COR_DO_PULO.normal,
    },
    ...(constante
      ? [
          {
            id: 'constante',
            rotulo: 'Quem nunca varia',
            valor: `${numero(constante.porVolta[0]!.distanciaUA)} UA`,
            nota: `${nomeDoTrecho(constante.de, constante.para)} · nas seis voltas`,
            mesC: constante.porVolta[0]!.mes,
            cor: continente('valoran').cor,
          },
        ]
      : []),
  ];

  return (
    <div className="numeros">
      {cartoes.map((c) => (
        <button
          type="button"
          key={c.id}
          className="numeros__cartao"
          data-ativo={c.mesC === mesC ? 'sim' : undefined}
          style={variaveis({ '--cor': c.cor })}
          onClick={() => a.irParaMes(c.mesC)}
          title="Escolher este trecho"
        >
          <span className="numeros__rotulo">{c.rotulo}</span>
          <strong>{c.valor}</strong>
          <small>{c.nota}</small>
        </button>
      ))}
    </div>
  );
}

// ------------------------------------------------------------ por que seis

const PISTAS = [
  { id: 'curto', rotulo: 'Al-Hara', periodo: CICLOS.curto.periodo, cor: continente('al-hara').cor },
  { id: 'medio', rotulo: 'Fentor · Valoran · Yōso', periodo: CICLOS.medio.periodo, cor: continente('valoran').cor },
  { id: 'longo', rotulo: 'Ukanten · Vrednost', periodo: CICLOS.longo.periodo, cor: continente('ukanten').cor },
];

/**
 * Por que seis voltas e não cinco, nem sete.
 *
 * 1080 é o mínimo múltiplo comum dos períodos do sistema. As três pistas
 * abaixo contam o mesmo tempo, cada uma na sua cadência, e só fecham juntas
 * no fim; as marcas de 180 em 180 dias deixam ver que a de 180 e a de 360
 * coincidem no dia 360, que a de 180 e a de 540 coincidem no 540 — e que só
 * no 1080 as três se encontram.
 */
function PorQueSeis() {
  const marcas = Array.from({ length: DIAS_DA_CORVISSEIA / DIAS_DA_VOLTA }, (_, i) => (i + 1) * DIAS_DA_VOLTA);
  return (
    <section className="porque" aria-labelledby="porque-titulo">
      <p className="almanaque__rotulo" id="porque-titulo">
        Por que seis voltas?
      </p>
      <p className="porque__lead">
        Porque {inteiro(DIAS_DA_CORVISSEIA)} é o primeiro dia em que as três órbitas voltam ao mesmo
        lugar ao mesmo tempo — o mínimo múltiplo comum de {PISTAS.map((p) => p.periodo).join(', ')}.
      </p>

      <div className="engrenagens" role="img" aria-label="Três pistas de tempo, de 180, 360 e 540 dias, que só terminam juntas no dia 1080.">
        <div className="engrenagens__pistas">
          {PISTAS.map((pista) => {
            const voltas = DIAS_DA_CORVISSEIA / pista.periodo;
            return (
              <div className="engrenagens__pista" key={pista.id}>
                <p>
                  {pista.rotulo}
                  <small>
                    {pista.periodo} dias × {voltas}
                  </small>
                </p>
                <div className="engrenagens__trilho" style={variaveis({ '--cor': pista.cor })}>
                  {Array.from({ length: voltas }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
              </div>
            );
          })}
          {/* As marcas de 180 em 180 atravessam as três pistas: duas a duas elas
              coincidem, e só no fim coincidem as três. */}
          {marcas.map((m) => (
            <i
              key={m}
              className="engrenagens__marca"
              style={{ left: `${(m / DIAS_DA_CORVISSEIA) * 100}%` }}
              data-fim={m === DIAS_DA_CORVISSEIA ? 'sim' : undefined}
            />
          ))}
        </div>
        <div className="engrenagens__eixo">
          {marcas.map((m) => (
            <span key={m} style={{ left: `${(m / DIAS_DA_CORVISSEIA) * 100}%` }} data-fim={m === DIAS_DA_CORVISSEIA ? 'sim' : undefined}>
              {inteiro(m)}
            </span>
          ))}
        </div>
      </div>

      <p className="porque__texto">
        A mesma conta diz de quanto em quanto tempo cada trecho se repete: dois continentes só voltam a
        ficar na mesma posição um em relação ao outro quando ambos completam um número inteiro de
        órbitas.
      </p>
      <ul className="porque__lista">
        {TRECHOS_DA_ROTA.map((rota) => {
          const pa = CICLOS[continentePorCodigo(rota.de).ciclo].periodo;
          const pb = CICLOS[continentePorCodigo(rota.para).ciclo].periodo;
          return (
            <li key={rota.posicao}>
              <strong>{nomeDoTrecho(rota.de, rota.para)}</strong>
              <span>
                mmc({pa}, {pb}) = {inteiro(mmc(pa, pb))} dias
              </span>
              <em>
                {rota.repeteACada === 1
                  ? 'nunca varia: moram no mesmo anel'
                  : `a cada ${rota.repeteACada} voltas`}
              </em>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// -------------------------------------------------------------------- tela

export function Corvisseia({ a }: { a: Almanaque }) {
  const mesC = mesDaCorvisseia(a.dia);
  const t = trecho(mesC);
  const de = continentePorCodigo(t.de);
  const para = continentePorCodigo(t.para);

  return (
    <div className="corvisseia">
      <p className="corvisseia__intro">
        Corvus fica {numero(DIAS_DE_ESTADIA, 1)} dias parada e leva {numero(DIAS_DE_VIAGEM, 1)} para chegar ao
        próximo continente — <strong>sempre</strong>. Perto ou longe, o prazo é o mesmo; o que muda é a
        velocidade. Depois de seis voltas, as distâncias se repetem exatamente: {inteiro(DIAS_DA_CORVISSEIA)}{' '}
        dias, três anos valorianos, A Corvisseia.
      </p>

      <Numeros a={a} mesC={mesC} />

      <div className="corvisseia__grade">
        <div className="corvisseia__ritmo">
          <p className="almanaque__rotulo">O ritmo dos {inteiro(DIAS_DA_CORVISSEIA)} dias</p>
          <Ritmo a={a} mesC={mesC} />
          <p className="corvisseia__legenda">
            Cada coluna é um mês: a <strong>barra</strong> é o salto do fim dele — altura é a
            distância, cor é a força do pulo —, e o <strong>bloco embaixo</strong> é o continente
            sobre o qual Corvus passou o mês. Anéis marcam quando ela está sobre{' '}
            <strong style={{ color: continente(a.onde).cor }}>{continente(a.onde).nome}</strong>.
          </p>
        </div>

        <Detalhe a={a} mesC={mesC} />

        <div className="corvisseia__matriz">
          <p className="almanaque__rotulo">Seis trechos, seis voltas</p>
          <p className="corvisseia__rota">
            A rota nunca muda:{' '}
            {ROTA.map((codigo, i) => {
              const c = continentePorCodigo(codigo);
              return (
                <span key={codigo}>
                  <span className="corvisseia__ponto" style={{ background: c.cor }} />
                  {c.nome}
                  {i < ROTA.length - 1 ? <span className="corvisseia__elo"> → </span> : null}
                </span>
              );
            })}
            <span className="corvisseia__elo"> ↺</span>
          </p>
          <Matriz a={a} mesC={mesC} />
        </div>
      </div>

      <PorQueSeis />

      {/* No celular o detalhe fica acima da matriz, fora de vista quando se toca nela:
          esta barra gruda no rodapé e mostra o que acabou de ser escolhido. */}
      <div className="resumo-fixo" data-pulo={t.pulo} style={variaveis({ '--pulo': COR_DO_PULO[t.pulo] })} aria-hidden="true">
        <span className="resumo-fixo__rota">
          <span style={{ color: de.cor }}>{de.nome}</span> → <span style={{ color: para.cor }}>{para.nome}</span>
        </span>
        <span className="resumo-fixo__numeros">
          {numero(t.distanciaUA)} UA · {Math.round(velocidade(t.distanciaUA))} km/s{' '}
          <b>{GLIFO_DO_PULO[t.pulo]}</b>
        </span>
      </div>
    </div>
  );
}
