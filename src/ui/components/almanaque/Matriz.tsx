import {
  CORVISSEIA,
  LIMITE_DO_PULO_INTENSO,
  LIMITE_DO_PULO_NORMAL,
  PULOS,
  TRECHOS_DA_ROTA,
  VELOCIDADE_DO_PULO_INTENSO,
  VELOCIDADE_DO_PULO_NORMAL,
  VOLTAS_DA_CORVISSEIA,
  continente,
  continentePorCodigo,
  mesDoTrecho,
  trechoDaRotaDoMes,
  velocidade,
  voltaDoMes,
} from '@/codex/calendario';
import { numero } from '@/codex/formato';
import { COR_DO_PULO, DISTANCIA_DA_ESCALA, GLIFO_DO_PULO, variaveis } from './comum';
import type { Almanaque } from './tipos';

/**
 * A matriz da Corvisseia: seis trechos por seis voltas.
 *
 * É a tabela de 36 linhas dobrada no formato que mostra o que ela diz. As
 * linhas são os seis trechos da rota, que nunca mudam; as colunas são as
 * seis voltas; e cada célula leva a distância, com uma barra por baixo na
 * mesma escala em todas, e a cor da força do pulo. Lida de lado, uma linha
 * conta a história de um trecho — Vrednost → Fentor vai de 0,49 a 2,49 UA —;
 * lida de cima para baixo, uma coluna é uma volta inteira de Corvus.
 *
 * Na última coluna, de quantas em quantas voltas cada trecho se repete.
 * Isso não está na tabela do usuário: foi lido dela, e confere com os
 * períodos das órbitas (veja "Por que seis voltas?").
 */
export function Matriz({ a, mesC }: { a: Almanaque; mesC: number }) {
  const rotaDaVez = trechoDaRotaDoMes(mesC);
  const voltaDaVez = voltaDoMes(mesC);
  const olhar = continente(a.onde);

  // Setas andam pela matriz; o foco vai junto, porque só a célula escolhida
  // está na ordem de tabulação.
  const teclas = (evento: React.KeyboardEvent) => {
    let posicao = rotaDaVez.posicao;
    let volta = voltaDaVez;
    switch (evento.key) {
      case 'ArrowRight':
        volta = Math.min(VOLTAS_DA_CORVISSEIA, volta + 1);
        break;
      case 'ArrowLeft':
        volta = Math.max(1, volta - 1);
        break;
      case 'ArrowDown':
        posicao = Math.min(TRECHOS_DA_ROTA.length - 1, posicao + 1);
        break;
      case 'ArrowUp':
        posicao = Math.max(0, posicao - 1);
        break;
      case 'Home':
        volta = 1;
        break;
      case 'End':
        volta = VOLTAS_DA_CORVISSEIA;
        break;
      default:
        return;
    }
    evento.preventDefault();
    const destino = mesDoTrecho(posicao, volta);
    a.irParaMes(destino);
    requestAnimationFrame(() => document.getElementById(`celula-${destino}`)?.focus());
  };

  return (
    <div className="matriz-bloco">
      <table className="matriz" onKeyDown={teclas} style={variaveis({ '--cor-onde': olhar.cor })}>
        <caption className="matriz__titulo">
          Distância de cada trecho, em UA, nas seis voltas — escolha uma célula
        </caption>
        <thead>
          <tr>
            <th scope="col" className="matriz__canto">
              Trecho
            </th>
            {Array.from({ length: VOLTAS_DA_CORVISSEIA }, (_, i) => i + 1).map((volta) => (
              <th scope="col" key={volta} data-ativa={volta === voltaDaVez ? 'sim' : undefined}>
                <span>
                  <span className="matriz__volta-palavra">Volta </span>
                  {volta}
                </span>
              </th>
            ))}
            <th scope="col" className="matriz__repete">
              Repete
            </th>
          </tr>
        </thead>
        <tbody>
          {TRECHOS_DA_ROTA.map((rota) => {
            const de = continentePorCodigo(rota.de);
            const para = continentePorCodigo(rota.para);
            const toca = de.id === a.onde || para.id === a.onde;
            return (
              <tr key={rota.posicao} data-ativa={rota.posicao === rotaDaVez.posicao ? 'sim' : undefined}>
                <th scope="row" className="matriz__trecho" data-toca={toca ? 'sim' : undefined}>
                  <span className="matriz__ponta" style={variaveis({ '--cor': de.cor })}>
                    <i />
                    {de.nome}
                  </span>
                  <span className="matriz__seta" aria-hidden="true">
                    →
                  </span>
                  <span className="matriz__ponta" style={variaveis({ '--cor': para.cor })}>
                    <i />
                    {para.nome}
                  </span>
                </th>
                {rota.porVolta.map((item) => {
                  const kms = Math.round(velocidade(item.distanciaUA));
                  const aqui = item.mes === mesC;
                  return (
                    <td key={item.mes}>
                      <button
                        type="button"
                        id={`celula-${item.mes}`}
                        className="matriz__celula"
                        data-pulo={item.pulo}
                        data-selecionada={aqui ? 'sim' : undefined}
                        data-volta={item.volta === voltaDaVez ? 'sim' : undefined}
                        aria-pressed={aqui}
                        tabIndex={aqui ? 0 : -1}
                        style={variaveis({
                          '--pct': Math.min(1, item.distanciaUA / DISTANCIA_DA_ESCALA),
                          '--pulo': COR_DO_PULO[item.pulo],
                        })}
                        onClick={() => a.irParaMes(item.mes)}
                        aria-label={`${de.nome} para ${para.nome}, volta ${item.volta}, mês ${item.mes}: ${numero(item.distanciaUA)} UA, ${kms} quilômetros por segundo, pulo ${PULOS[item.pulo].rotulo.toLowerCase()}`}
                      >
                        <strong>{numero(item.distanciaUA)}</strong>
                        <small>{kms} km/s</small>
                        <i className="matriz__barra" />
                      </button>
                    </td>
                  );
                })}
                <td className="matriz__repete">
                  {rota.repeteACada === 1 ? (
                    <span title="Os dois continentes moram no mesmo anel: a distância entre eles não muda.">
                      nunca varia
                    </span>
                  ) : (
                    <span title={`Os dois continentes só voltam à mesma posição relativa a cada ${rota.repeteACada} voltas.`}>
                      a cada {rota.repeteACada}
                      <span className="matriz__voltas"> voltas</span>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ul className="matriz__chave">
        {(['sem-pulo', 'normal', 'intenso'] as const).map((id) => (
          <li key={id} data-pulo={id} style={variaveis({ '--pulo': COR_DO_PULO[id] })}>
            <span className="matriz__glifo">{GLIFO_DO_PULO[id]}</span>
            <strong>{PULOS[id].rotulo}</strong>
            <small>
              {id === 'sem-pulo'
                ? `< ${numero(LIMITE_DO_PULO_NORMAL, 1)} UA · < ${Math.round(VELOCIDADE_DO_PULO_NORMAL)} km/s`
                : id === 'normal'
                  ? `até ${numero(LIMITE_DO_PULO_INTENSO, 1)} UA · ${Math.round(VELOCIDADE_DO_PULO_INTENSO)} km/s`
                  : `≥ ${numero(LIMITE_DO_PULO_INTENSO, 1)} UA · ≥ ${Math.round(VELOCIDADE_DO_PULO_INTENSO)} km/s`}
            </small>
          </li>
        ))}
      </ul>
      <p className="matriz__nota">
        A barra de cada célula é a distância, na mesma escala em todas (até {numero(DISTANCIA_DA_ESCALA, 1)}{' '}
        UA). Os trechos que saem de ou chegam a{' '}
        <strong style={{ color: olhar.cor }}>{olhar.nome}</strong> têm uma marca na cor dele.{' '}
        {CORVISSEIA.length} trechos, {TRECHOS_DA_ROTA.length} por volta.
      </p>
    </div>
  );
}
