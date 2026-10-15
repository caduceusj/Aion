import {
  ANOS_DA_CORVISSEIA,
  DIAS_DA_SEMANA,
  DIAS_DO_MES,
  ESTACOES,
  FASES_DA_CONSTELACAO,
  FASES_DA_LUA,
  MESES,
  PULOS,
  continente,
  continentePorCodigo,
  diaDaPartida,
  faseDaConstelacao,
  faseDaLua,
  mesDaCorvisseiaDe,
  trecho,
  velocidade,
  type ContinenteId,
  type Mes as MesDoAno,
} from '@/codex/calendario';
import { numero } from '@/codex/formato';
import { Cena } from './cena';
import { COR_DO_PULO, GLIFO_DO_PULO, dataValoriana } from './comum';
import type { Almanaque } from './tipos';

/**
 * A folha do mês: o calendário impresso, e o salto que ele anuncia.
 *
 * Duas texturas de propósito: a folha é papel — o calendário existe impresso
 * no mundo, e mostrá-lo pousado na mesa do arquivo diz isso sem uma linha de
 * texto —, e o cartão ao lado é o céu, em miniatura, do mesmo mês.
 *
 * A folha é a mesma todo ano (os nomes, as constelações, as estações); o
 * que muda de um ano para o outro é o salto de Corvus, e é por isso que o
 * navegador tem os três anos da Corvisseia. Antes, esta tela mostrava
 * sempre o ano 1 sem dizer.
 */

// ------------------------------------------------------------------- folha

/** A folha impressa: 30 dias, cinco semanas de seis, e a faixa da lua. */
function Folha({ mes, onde }: { mes: MesDoAno; onde: ContinenteId }) {
  const estacao = ESTACOES[mes.estacao];
  const dias = Array.from({ length: DIAS_DO_MES }, (_, i) => i + 1);
  const casa = continente(mes.lua);
  const daqui = mes.lua === onde;

  return (
    <article className="folha" style={{ ['--estacao' as string]: estacao.cor }}>
      <header className="folha__topo">
        <div>
          <h3 className="folha__mes">{mes.nome}</h3>
          <p className="folha__linha">Constelação — {mes.constelacao}</p>
          <p className="folha__linha">Estação — {estacao.rotulo}</p>
        </div>
        <div
          className="folha__lua"
          data-aqui={daqui ? 'sim' : undefined}
          title={
            daqui
              ? `Corvus está sobre ${casa.nome}, onde você olha: o céu daqui a alcança.`
              : `Corvus está sobre ${casa.nome}. De ${continente(onde).nome}, é noite escura.`
          }
        >
          <small>Lua sobre</small>
          <strong>{casa.nome}</strong>
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

/** Como ler a folha, encostado nela: o que cada cor e cada faixa quer dizer. */
function ComoLer({ onde }: { onde: ContinenteId }) {
  return (
    <div className="mes__legendas">
      <div>
        <p className="almanaque__rotulo">A constelação do mês</p>
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
        <p className="almanaque__rotulo">A faixa da lua, de {continente(onde).nome}</p>
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

// ------------------------------------------------------------------ cartão

/** O mesmo mês visto de cima: onde Corvus está, para onde vai e quão forte é o salto. */
function CartaoDoMes({ a, mesC }: { a: Almanaque; mesC: number }) {
  const data = dataValoriana(diaDaPartida(mesC));
  const t = trecho(mesC);
  const de = continentePorCodigo(t.de);
  const para = continentePorCodigo(t.para);
  const kms = Math.round(velocidade(t.distanciaUA));

  return (
    <aside className="mes__cartao" aria-label={`O salto de ${data.mes.nome}`}>
      <header>
        <p className="almanaque__rotulo">
          Corvus em {data.mes.nome} · ano {data.ano}
        </p>
        <h3 className="mes__salto">
          <span style={{ color: de.cor }}>{de.nome}</span>
          <span className="mes__seta" aria-hidden="true">
            →
          </span>
          <span style={{ color: para.cor }}>{para.nome}</span>
        </h3>
      </header>

      <div className="mes__cena">
        <Cena dia={diaDaPartida(mesC)} onde={a.onde} modo="mini" aoEscolher={a.escolherOnde} />
      </div>

      <dl className="mes__numeros">
        <div>
          <dt>Distância</dt>
          <dd>{numero(t.distanciaUA)} UA</dd>
        </div>
        <div>
          <dt>Velocidade</dt>
          <dd>{kms} km/s</dd>
        </div>
        <div data-pulo={t.pulo} style={{ ['--pulo' as string]: COR_DO_PULO[t.pulo] }}>
          <dt>Pulo</dt>
          <dd>
            <span className="mes__glifo">{GLIFO_DO_PULO[t.pulo]}</span> {PULOS[t.pulo].rotulo}
          </dd>
        </div>
      </dl>

      <div className="mes__acoes">
        <button type="button" className="mes__botao mes__botao--forte" onClick={() => a.abrir('ceu', { mesC })}>
          Ver no céu
        </button>
        <button type="button" className="mes__botao" onClick={() => a.abrir('corvisseia', { mesC })}>
          Na Corvisseia
        </button>
      </div>

      <p className="mes__nota">
        O desenho segue o modelo orbital; a distância é a da tabela da Corvisseia. As duas fontes não
        coincidem em todo trecho —{' '}
        <button type="button" className="codice-elo" onClick={() => a.aoNavegar('sistema-de-aion')}>
          o verbete explica
        </button>
        .
      </p>
    </aside>
  );
}

// -------------------------------------------------------------------- tela

export function Mes({ a }: { a: Almanaque }) {
  const data = dataValoriana(a.dia);

  return (
    <div className="mes">
      <div className="mes__navegador">
        <div className="mes__anos" role="group" aria-label="Ano da Corvisseia">
          <span className="almanaque__rotulo">Ano</span>
          {Array.from({ length: ANOS_DA_CORVISSEIA }, (_, i) => i + 1).map((ano) => (
            <button
              type="button"
              key={ano}
              aria-pressed={ano === data.ano}
              data-ativo={ano === data.ano ? 'sim' : undefined}
              onClick={() => a.irParaMes(mesDaCorvisseiaDe(ano, data.mes.numero))}
            >
              {ano}
            </button>
          ))}
          <small>A folha é a mesma todo ano. O que muda é o salto de Corvus.</small>
        </div>

        <nav className="almanaque__meses" aria-label="Os doze meses">
          {MESES.map((item) => (
            <button
              type="button"
              key={item.numero}
              className="pastilha-mes"
              data-estacao={item.estacao}
              data-ativo={item.numero === data.mes.numero ? 'sim' : undefined}
              aria-pressed={item.numero === data.mes.numero}
              onClick={() => a.irParaMes(mesDaCorvisseiaDe(data.ano, item.numero))}
              title={`${item.nome} — ${item.constelacao}, ${ESTACOES[item.estacao].rotulo}`}
            >
              <span>{item.nome}</span>
              <small>
                <i style={{ background: continente(item.lua).cor }} />
                {continente(item.lua).nome}
              </small>
            </button>
          ))}
        </nav>
      </div>

      <div className="mes__corpo">
        <div className="mes__folha">
          <Folha mes={data.mes} onde={a.onde} />
          <ComoLer onde={a.onde} />
        </div>
        <CartaoDoMes a={a} mesC={data.mesC} />
      </div>
    </div>
  );
}
