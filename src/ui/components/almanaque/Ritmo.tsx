import {
  ANOS_DA_CORVISSEIA,
  CORVISSEIA,
  MESES,
  continentePorCodigo,
  mesDaCorvisseiaDe,
  velocidade,
  PULOS,
} from '@/codex/calendario';
import { numero } from '@/codex/formato';
import {
  ABREVIACOES_DOS_MESES,
  COR_DO_PULO,
  DISTANCIA_DA_ESCALA,
  GLIFO_DO_PULO,
  SIGLAS,
  variaveis,
} from './comum';
import type { Almanaque } from './tipos';

/**
 * O ritmo dos 1080 dias: os 36 meses da Corvisseia, três anos em três fileiras.
 *
 * Cada coluna é um mês. A barra é o salto que Corvus faz no fim dele — a
 * altura é a distância, a cor é a força do pulo —, e embaixo vai a cor do
 * continente sobre o qual ela passou aquele mês. Como os anos ficam
 * empilhados e os meses alinhados, a comparação mais interessante da tabela
 * sai de graça, na vertical: Lereal mede 2,40 UA no primeiro ano, 2,19 no
 * segundo e 0,46 no terceiro, e dá para ver isso sem ler um número.
 *
 * O anel em volta do pouso marca os meses em que a lua está sobre o
 * continente de onde se olha — a resposta imediata a "quando ela passa por
 * mim?".
 */
export function Ritmo({ a, mesC }: { a: Almanaque; mesC: number }) {
  const onde = a.onde;

  // As setas andam de mês em mês (← →) e de ano em ano (↑ ↓), e levam o foco junto.
  const teclas = (evento: React.KeyboardEvent) => {
    const passos: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 12, ArrowUp: -12 };
    const passo = passos[evento.key];
    if (passo === undefined) return;
    evento.preventDefault();
    const destino = Math.min(CORVISSEIA.length, Math.max(1, mesC + passo));
    a.irParaMes(destino);
    requestAnimationFrame(() => document.getElementById(`ritmo-${destino}`)?.focus());
  };

  return (
    <section className="ritmo" aria-label="Os 36 meses da Corvisseia" onKeyDown={teclas}>
      {Array.from({ length: ANOS_DA_CORVISSEIA }, (_, i) => i + 1).map((ano) => (
        <div className="ritmo__ano" key={ano}>
          <p className="ritmo__ano-rotulo">Ano {ano}</p>
          <div className="ritmo__meses" role="group" aria-label={`Ano ${ano}`}>
            {/* Onde o pulo muda de nome: meia UA e uma UA e meia. */}
            <i className="ritmo__guia" data-nivel="intenso" aria-hidden="true" />
            <i className="ritmo__guia" data-nivel="normal" aria-hidden="true" />
            {MESES.map((m) => {
              const c = mesDaCorvisseiaDe(ano, m.numero);
              const t = CORVISSEIA[c - 1]!;
              const casa = continentePorCodigo(t.de);
              const destino = continentePorCodigo(t.para);
              const kms = Math.round(velocidade(t.distanciaUA));
              const aqui = c === mesC;
              return (
                <button
                  type="button"
                  id={`ritmo-${c}`}
                  key={c}
                  className="ritmo__mes"
                  data-pulo={t.pulo}
                  data-selecionado={aqui ? 'sim' : undefined}
                  data-lua={casa.id === onde ? 'sim' : undefined}
                  aria-pressed={aqui}
                  tabIndex={aqui ? 0 : -1}
                  style={variaveis({
                    '--h': Math.min(1, t.distanciaUA / DISTANCIA_DA_ESCALA),
                    '--cor': casa.cor,
                    '--pulo': COR_DO_PULO[t.pulo],
                    '--i': m.numero,
                  })}
                  onClick={() => a.irParaMes(c)}
                  aria-label={`${m.nome}, ano ${ano}: Corvus sobre ${casa.nome}, parte para ${destino.nome}. ${numero(t.distanciaUA)} UA, ${kms} quilômetros por segundo, pulo ${PULOS[t.pulo].rotulo.toLowerCase()}.`}
                  title={`${m.nome}, ano ${ano} — ${casa.nome} → ${destino.nome}\n${numero(t.distanciaUA)} UA · ${kms} km/s · ${GLIFO_DO_PULO[t.pulo]} ${PULOS[t.pulo].rotulo}`}
                >
                  <span className="ritmo__valor">{numero(t.distanciaUA)}</span>
                  <span className="ritmo__area">
                    <i className="ritmo__barra" />
                  </span>
                  <span className="ritmo__pouso">{SIGLAS[casa.id]}</span>
                  <span className="ritmo__nome">{ABREVIACOES_DOS_MESES[m.numero - 1]}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
