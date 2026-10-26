import { useEffect, useRef } from 'react';

/**
 * A pilha do Esc.
 *
 * Esc significa "feche a coisa de cima". Qual é a coisa de cima só quem a
 * abriu sabe: a ajuda de notação, o editor de atalho, a gaveta do índice do
 * Códice. Antes, cada uma escutava o teclado por conta própria e o App —
 * que também escutava — fechava tudo de uma vez: Esc na ajuda fechava a ajuda
 * *e* saía da Mesa, e a pessoa perdia o lugar sem ter pedido.
 *
 * Agora quem abre algo que o Esc deve fechar se registra aqui, e o App só
 * desce um degrau por vez: a camada do topo, se houver; senão o campo de
 * texto em foco; senão a navegação.
 */

const pilha: Array<() => void> = [];

/** Registra uma camada no topo. Devolve a função que a retira. */
export function empilhar(fechar: () => void): () => void {
  pilha.push(fechar);
  return () => {
    const indice = pilha.lastIndexOf(fechar);
    if (indice >= 0) pilha.splice(indice, 1);
  };
}

/** Fecha a camada do topo. `false` se não havia nenhuma. */
export function fecharTopo(): boolean {
  const topo = pilha[pilha.length - 1];
  if (!topo) return false;
  topo();
  return true;
}

export function haCamadas(): boolean {
  return pilha.length > 0;
}

/**
 * Enquanto `aberta`, o Esc chama `fechar` — antes de qualquer navegação.
 *
 * `fechar` pode mudar a cada render sem reempilhar: a camada guarda a
 * referência, não a função, e por isso não perde a posição na pilha.
 */
export function useCamada(aberta: boolean, fechar: () => void): void {
  const ultima = useRef(fechar);
  ultima.current = fechar;

  useEffect(() => {
    if (!aberta) return undefined;
    return empilhar(() => ultima.current());
  }, [aberta]);
}
