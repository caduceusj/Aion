import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CONTINENTES,
  dentroDaCorvisseia,
  diaDaChegada,
  diaDaPartida,
  type ContinenteId,
} from '@/codex/calendario';
import { Ceu } from '@/ui/components/almanaque/Ceu';
import { Corvisseia } from '@/ui/components/almanaque/Corvisseia';
import { Mes } from '@/ui/components/almanaque/Mes';
import { variaveis } from '@/ui/components/almanaque/comum';
import { memoria } from '@/ui/components/almanaque/memoria';
import type { AbaId, Almanaque } from '@/ui/components/almanaque/tipos';
import '@/ui/styles/almanaque.css';

/**
 * O Almanaque: o calendário de Aion, e o céu de onde ele saiu.
 *
 * Três telas sobre o mesmo assunto, e por isso um só cursor. A folha mostra
 * o mês, o céu mostra a posição de tudo, a Corvisseia mostra os 1080 dias de
 * uma vez — mas "onde estamos" é uma única resposta, guardada aqui. Escolher
 * Lereal na folha leva a lua até Lereal no céu; um trecho da Corvisseia abre
 * o céu no instante exato em que Corvus parte.
 *
 * O segundo estado compartilhado é o ponto de vista: de qual continente se
 * olha. É ele que decide qual faixa de lua aparece na folha, qual
 * constelação acende no céu e quais trechos ganham destaque na Corvisseia —
 * a pergunta de quem mora em Valoran é sempre a mesma: quando ela passa por
 * aqui?
 */

const ABAS: Array<{ id: AbaId; rotulo: string }> = [
  { id: 'ano', rotulo: 'O Ano' },
  { id: 'ceu', rotulo: 'O Céu' },
  { id: 'corvisseia', rotulo: 'A Corvisseia' },
];

export function CodexCalendario({ aoNavegar }: { aoNavegar: (chave: string) => void }) {
  const [aba, setAba] = useState<AbaId>(memoria.aba);
  const [dia, setDia] = useState(memoria.dia);
  const [onde, setOnde] = useState<ContinenteId>(memoria.onde);
  const [tocarAte, setTocarAte] = useState<number | null>(null);

  useEffect(() => {
    memoria.aba = aba;
    memoria.dia = dia;
    memoria.onde = onde;
  }, [aba, dia, onde]);

  // Trocar de tela começa no alto dela: a nova tela tem outra altura, e
  // deixar a rolagem onde estava abria a Corvisseia no meio da matriz.
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    document.querySelector('.codice__leitura')?.scrollTo({ top: 0 });
  }, [aba]);

  // Trocar de aba pelo seletor abandona um "tocar este trecho" que tivesse
  // ficado pendente: sem isto, o céu abriria depois, sozinho, rodando até o
  // fim de um trecho que ninguém mais estava olhando.
  const trocarAba = useCallback((proxima: AbaId) => {
    setTocarAte(null);
    setAba(proxima);
  }, []);
  const irParaDia = useCallback((novo: number) => setDia(dentroDaCorvisseia(novo)), []);
  const irParaMes = useCallback((mesC: number) => {
    setTocarAte(null);
    setDia(diaDaPartida(mesC));
  }, []);
  const escolherOnde = useCallback((id: ContinenteId) => setOnde(id), []);
  const terminouDeTocar = useCallback(() => setTocarAte(null), []);
  const abrir = useCallback<Almanaque['abrir']>((proxima, opcoes) => {
    if (opcoes?.mesC !== undefined) setDia(diaDaPartida(opcoes.mesC));
    setTocarAte(opcoes?.tocar && opcoes.mesC !== undefined ? diaDaChegada(opcoes.mesC) : null);
    setAba(proxima);
  }, []);

  const almanaque: Almanaque = {
    dia,
    onde,
    irParaDia,
    irParaMes,
    escolherOnde,
    abrir,
    tocarAte,
    terminouDeTocar,
    aoNavegar,
  };

  // As setas andam entre as abas, como num tablist de verdade.
  const teclasDasAbas = (evento: React.KeyboardEvent) => {
    const passo = evento.key === 'ArrowRight' ? 1 : evento.key === 'ArrowLeft' ? -1 : 0;
    if (passo === 0) return;
    evento.preventDefault();
    const atual = ABAS.findIndex((x) => x.id === aba);
    const proxima = ABAS[(atual + passo + ABAS.length) % ABAS.length]!;
    trocarAba(proxima.id);
    requestAnimationFrame(() => document.getElementById(`almanaque-aba-${proxima.id}`)?.focus());
  };

  return (
    <div className="almanaque">
      <header className="almanaque__topo">
        <div>
          <p className="almanaque__eyebrow">O Almanaque dos Viajantes</p>
          <h2 className="almanaque__titulo">O Calendário de Aion</h2>
        </div>
        <div className="almanaque__abas" role="tablist" aria-label="O almanaque" onKeyDown={teclasDasAbas}>
          {ABAS.map((x) => (
            <button
              type="button"
              role="tab"
              key={x.id}
              id={`almanaque-aba-${x.id}`}
              aria-selected={aba === x.id}
              aria-controls="almanaque-painel"
              tabIndex={aba === x.id ? 0 : -1}
              data-ativo={aba === x.id ? 'sim' : undefined}
              onClick={() => trocarAba(x.id)}
            >
              {x.rotulo}
            </button>
          ))}
        </div>
      </header>

      <div className="almanaque__ponto" role="group" aria-label="Olhando de qual continente">
        <span className="almanaque__rotulo">Olhando de</span>
        <div className="almanaque__ponto-chips">
          {CONTINENTES.map((c) => (
            <button
              type="button"
              key={c.id}
              aria-pressed={c.id === onde}
              data-ativo={c.id === onde ? 'sim' : undefined}
              style={variaveis({ '--cor': c.cor })}
              onClick={() => setOnde(c.id)}
              title={`Olhar de ${c.nome}: a faixa da lua, o céu e os destaques passam a ser os dele.`}
            >
              <i />
              {c.nome}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" id="almanaque-painel" aria-labelledby={`almanaque-aba-${aba}`} className="almanaque__painel">
        {aba === 'ano' ? <Mes a={almanaque} /> : aba === 'ceu' ? <Ceu a={almanaque} /> : <Corvisseia a={almanaque} />}
      </div>
    </div>
  );
}
