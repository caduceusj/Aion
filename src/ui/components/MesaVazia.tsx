import { useAionStore } from '@/state/store';

/**
 * O que a mesa diz a quem chega e ainda não rolou nada.
 *
 * Uma mesa vazia é um campo verde e uma fileira de botões sem texto: nada
 * diz que tocar num dado rola um dado, nem que segurá-lo soma mais de um.
 * Estas duas linhas ensinam isso uma vez e saem do caminho — somem na
 * primeira rolagem e não voltam, porque o histórico passa a ter algo.
 */
export function MesaVazia() {
  const rolou = useAionStore((state) => state.history.length > 0 || state.phase !== 'ocioso');
  if (rolou) return null;

  return (
    <div className="mesa-vazia">
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
