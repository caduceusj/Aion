import {
  DIAS_DE_VIAGEM,
  PULOS,
  UA_EM_KM,
  VELOCIDADE_ORBITAL_DA_TERRA,
  continentePorCodigo,
  diaDaPartida,
  trecho,
  trechoDaRotaDoMes,
  velocidade,
} from '@/codex/calendario';
import { inteiro, numero } from '@/codex/formato';
import { COR_DO_PULO, DISTANCIA_DA_ESCALA, GLIFO_DO_PULO, dataValoriana, variaveis } from './comum';
import type { Almanaque } from './tipos';
import { Velocimetro } from './Velocimetro';

/**
 * O trecho escolhido, por inteiro.
 *
 * A matriz e a faixa de ritmo mostram os 36 trechos de uma vez, e por isso
 * cada célula só tem espaço para um número. Aqui há espaço para tudo o que
 * um piloto pergunta antes de cruzar: quanto é, quanto tempo leva, a que
 * velocidade, e se o trecho é dos mansos ou dos que matam. O velocímetro
 * dá a resposta sem exigir que se saiba o que são 247 km/s.
 */
export function Detalhe({ a, mesC }: { a: Almanaque; mesC: number }) {
  const t = trecho(mesC);
  const rota = trechoDaRotaDoMes(mesC);
  const de = continentePorCodigo(t.de);
  const para = continentePorCodigo(t.para);
  const kms = velocidade(t.distanciaUA);
  const data = dataValoriana(diaDaPartida(mesC));
  const milhoes = (t.distanciaUA * UA_EM_KM) / 1_000_000;

  return (
    <aside className="detalhe" aria-label={`O trecho do mês ${mesC}`}>
      <header className="detalhe__topo">
        <p className="almanaque__rotulo">Trecho {mesC} de 36</p>
        <p className="detalhe__quando">
          {data.mes.nome} · ano {data.ano} · volta {t.volta}
        </p>
        <h3 className="detalhe__rota">
          <span style={{ color: de.cor }}>{de.nome}</span>
          <span className="detalhe__seta" aria-hidden="true">
            →
          </span>
          <span style={{ color: para.cor }}>{para.nome}</span>
        </h3>
      </header>

      <dl className="detalhe__numeros">
        <div>
          <dt>Distância</dt>
          <dd>
            {numero(t.distanciaUA)} <small>UA</small>
          </dd>
          <dd className="detalhe__sub">{inteiro(milhoes)} milhões de km</dd>
        </div>
        <div>
          <dt>Prazo</dt>
          <dd>
            {numero(DIAS_DE_VIAGEM, 1)} <small>dias</small>
          </dd>
          <dd className="detalhe__sub">sempre o mesmo</dd>
        </div>
        <div>
          <dt>Velocidade</dt>
          <dd>
            {Math.round(kms)} <small>km/s</small>
          </dd>
          <dd className="detalhe__sub">≈ {numero(kms / VELOCIDADE_ORBITAL_DA_TERRA, 1)}× a Terra em órbita</dd>
        </div>
      </dl>

      <Velocimetro kms={kms} pulo={t.pulo} />

      <p className="detalhe__pulo" data-pulo={t.pulo} style={variaveis({ '--pulo': COR_DO_PULO[t.pulo] })}>
        <span className="detalhe__glifo">{GLIFO_DO_PULO[t.pulo]}</span>
        <span>
          <strong>{PULOS[t.pulo].rotulo}.</strong> {PULOS[t.pulo].nota}
        </span>
      </p>

      <div className="detalhe__sequencia">
        <p className="almanaque__rotulo">Este trecho, nas seis voltas</p>
        <ol className="sequencia">
          {rota.porVolta.map((item) => (
            <li key={item.mes}>
              <button
                type="button"
                data-pulo={item.pulo}
                aria-pressed={item.mes === mesC}
                aria-label={`Volta ${item.volta}: ${numero(item.distanciaUA)} UA`}
                style={variaveis({
                  '--h': Math.min(1, item.distanciaUA / DISTANCIA_DA_ESCALA),
                  '--pulo': COR_DO_PULO[item.pulo],
                })}
                onClick={() => a.irParaMes(item.mes)}
              >
                <span className="sequencia__valor">{numero(item.distanciaUA)}</span>
                <span className="sequencia__area">
                  <i />
                </span>
                <span className="sequencia__volta">{item.volta}ª</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="detalhe__variacao">
          {rota.variacao === 1 ? (
            <>
              Nunca varia: os dois continentes moram no mesmo anel e não se afastam um do outro.
            </>
          ) : (
            <>
              Varia de {numero(rota.menor.distanciaUA)} a {numero(rota.maior.distanciaUA)} UA —{' '}
              {numero(rota.variacao, 1)}×. Repete a cada {rota.repeteACada}{' '}
              {rota.repeteACada === 1 ? 'volta' : 'voltas'}.
            </>
          )}
        </p>
      </div>

      <div className="detalhe__acoes">
        <button type="button" className="detalhe__botao detalhe__botao--forte" onClick={() => a.abrir('ceu', { mesC })}>
          Ver no céu
        </button>
        <button type="button" className="detalhe__botao" onClick={() => a.abrir('ceu', { mesC, tocar: true })}>
          ▶ Tocar este trecho
        </button>
        <button type="button" className="detalhe__botao" onClick={() => a.abrir('ano', { mesC })}>
          Ver a folha
        </button>
      </div>
    </aside>
  );
}
