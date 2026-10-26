import { useRef } from 'react';
import { useAionStore } from '@/state/store';
import { useNivelQueCabe } from '@/ui/hooks/useNivelQueCabe';

/**
 * Do mais completo ao mais enxuto: 0 tudo · 1 sem a dica do gesto · 2 só a
 * instrução · 3 nada. A instrução fica por último de propósito: o título ("a
 * mesa está pronta") é cortesia; "toque num dado, ou escreva uma rolagem" é o
 * que ensina a usar.
 */
const SEM_NADA = 3;

/** O aviso é a própria faixa: o que passa do fim dela é o que não coube. */
const coube = (faixa: HTMLElement): boolean => faixa.scrollHeight <= faixa.clientHeight;

/**
 * O que a mesa diz a quem chega e ainda não rolou nada.
 *
 * Uma mesa vazia é um campo verde e uma fileira de botões sem texto: nada
 * diz que tocar num dado rola um dado, nem que segurá-lo soma mais de um.
 * Estas linhas ensinam isso uma vez e saem do caminho — somem na primeira
 * rolagem e não voltam, porque o histórico passa a ter algo.
 */
export function MesaVazia() {
  const rolou = useAionStore((state) => state.history.length > 0 || state.phase !== 'ocioso');
  const raiz = useRef<HTMLDivElement>(null);

  useNivelQueCabe(raiz, raiz, SEM_NADA, coube, rolou);

  if (rolou) return null;

  return (
    <div className="mesa-vazia" ref={raiz}>
      <p className="mesa-vazia__titulo">A mesa está pronta.</p>
      <p className="mesa-vazia__texto">
        Toque num dado, ou escreva uma rolagem como <code className="mono">2d6+3</code>.
      </p>
      <p className="mesa-vazia__dica">
        <span className="mesa-vazia__toque">Segure um dado para rolar mais de um.</span>
        <span className="mesa-vazia__teclado">
          Teclas <kbd>1</kbd>–<kbd>8</kbd> rolam os dados; <kbd>?</kbd> mostra todos os atalhos.
        </span>
      </p>
    </div>
  );
}
