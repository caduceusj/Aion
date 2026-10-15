import { useMemo } from 'react';
import {
  ANOS_DA_CORVISSEIA,
  CORVISSEIA,
  DIAS_DA_CORVISSEIA,
  DIAS_DO_MES,
  continentePorCodigo,
  dentroDaCorvisseia,
  estadoDaLua,
  type ContinenteId,
} from '@/codex/calendario';
import { DISTANCIA_DA_ESCALA, dataValoriana, variaveis } from './comum';

/**
 * A régua do céu: os 1080 dias de uma Corvisseia numa faixa só.
 *
 * Um `<input type="range">` de 1080 posições é uma régua sem marcas: não diz
 * onde começa um mês, nem um ano, nem para onde a lua vai. Esta mostra tudo
 * isso e continua sendo um controle: cada mês é um bloco de estadia, na cor
 * do continente sobre o qual Corvus está parada, seguido de um bloco de
 * viagem cuja altura é a distância que ela vai percorrer e cuja cor é a
 * força do pulo. Lida da esquerda para a direita, a faixa é a rota — seis
 * cores que se repetem — com os picos de velocidade em cima.
 *
 * Quem recebe o gesto é um `<input type="range">` real, transparente, por
 * cima do desenho: arrastar, tocar e usar o teclado funcionam sem uma linha
 * de lógica de ponteiro, e o leitor de tela anuncia um controle deslizante.
 */
export function Regua({
  dia,
  onde,
  aoMudar,
}: {
  dia: number;
  onde: ContinenteId;
  aoMudar: (dia: number) => void;
}) {
  const meses = useMemo(
    () =>
      CORVISSEIA.map((t) => {
        const casa = continentePorCodigo(t.de);
        return (
          <span
            key={t.mes}
            className="regua__mes"
            data-lua={casa.id === onde ? 'sim' : undefined}
            data-ano-novo={t.mes % 12 === 1 && t.mes > 1 ? 'sim' : undefined}
            style={variaveis({ '--cor': casa.cor, '--h': Math.min(1, t.distanciaUA / DISTANCIA_DA_ESCALA) })}
          >
            <i className="regua__pouso" />
            <i className="regua__viagem" data-pulo={t.pulo} />
          </span>
        );
      }),
    [onde],
  );

  const data = dataValoriana(dia);
  const estado = estadoDaLua(dia);
  const texto = `Dia ${Math.floor(dia) + 1} da Corvisseia: ${data.diaDoMes} de ${data.mes.nome}, ano ${data.ano}. Corvus ${
    estado.estado === 'parada'
      ? `pousada sobre ${continentePorCodigo(estado.em).nome}`
      : `a caminho de ${continentePorCodigo(estado.para).nome}`
  }.`;

  return (
    <div className="regua">
      <div className="regua__anos" aria-hidden="true">
        {Array.from({ length: ANOS_DA_CORVISSEIA }, (_, i) => (
          <span key={i}>Ano {i + 1}</span>
        ))}
      </div>
      <div className="regua__faixa" aria-hidden="true">
        {meses}
        <i className="regua__cursor" style={{ left: `${(dia / DIAS_DA_CORVISSEIA) * 100}%` }} />
      </div>
      <input
        className="regua__entrada"
        type="range"
        min={0}
        max={DIAS_DA_CORVISSEIA}
        step={0.5}
        value={dia}
        aria-label="Dia da Corvisseia"
        aria-valuetext={texto}
        onChange={(evento) => aoMudar(Number(evento.target.value))}
        onKeyDown={(evento) => {
          // O passo nativo é de meio dia: para quem usa o teclado, uma
          // eternidade. A seta anda um dia; com Shift, um mês.
          const passo = evento.shiftKey ? DIAS_DO_MES : 1;
          if (evento.key === 'ArrowRight' || evento.key === 'ArrowUp') {
            evento.preventDefault();
            aoMudar(dentroDaCorvisseia(dia + passo));
          } else if (evento.key === 'ArrowLeft' || evento.key === 'ArrowDown') {
            evento.preventDefault();
            aoMudar(dentroDaCorvisseia(dia - passo));
          } else if (evento.key === 'Home') {
            evento.preventDefault();
            aoMudar(0);
          } else if (evento.key === 'End') {
            evento.preventDefault();
            aoMudar(DIAS_DA_CORVISSEIA - 0.5);
          }
        }}
      />
    </div>
  );
}
