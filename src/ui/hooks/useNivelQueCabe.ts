import { useLayoutEffect, type RefObject } from 'react';

/**
 * O primeiro nível, do mais completo ao mais enxuto, em que o conteúdo cabe.
 *
 * `cabe` aplica o nível e diz se o conteúdo coube. O último nível vale sem
 * perguntar: é o mais enxuto que existe, não há para onde recuar. Separado do
 * hook porque o jsdom não tem layout — a decisão, sozinha, é o que se testa.
 */
export function nivelQueCabe(cabe: (nivel: number) => boolean, ultimo: number): number {
  for (let nivel = 0; nivel < ultimo; nivel += 1) {
    if (cabe(nivel)) return nivel;
  }
  return ultimo;
}

/**
 * Faz o aviso caber na faixa livre da mesa.
 *
 * A faixa — entre o cabeçalho e a doca — encolhe com o texto ampliado, com a
 * tela deitada, num celular pequeno e quando a doca ganha uma linha de erro. Um
 * texto escrito para o caso comum passa a vazar por cima de um dos dois. Em vez
 * de torcer para que caiba, o hook mede e escolhe: escreve em `data-nivel` do
 * `alvo` o nível mais completo que cabe (0 é tudo, `ultimo` o mais enxuto), e o
 * CSS decide o que cada nível esconde.
 *
 * Roda antes da pintura, então o aviso nunca aparece grande demais por um
 * quadro. O observador fica na `faixa`, que é uma caixa posicionada pelas
 * bordas: o tamanho dela não depende do conteúdo, e mexer nos níveis aqui
 * dentro não o realimenta. `cabe`, `ultimo` e as refs são do chamador e não
 * mudam; só `quando` — o que faz o alvo existir ou ser outro — reinicia a
 * medição.
 */
export function useNivelQueCabe(
  faixa: RefObject<HTMLElement | null>,
  alvo: RefObject<HTMLElement | null>,
  ultimo: number,
  cabe: (faixa: HTMLElement, alvo: HTMLElement) => boolean,
  quando: unknown,
): void {
  useLayoutEffect(() => {
    const livre = faixa.current;
    const conteudo = alvo.current;
    if (!livre || !conteudo || typeof ResizeObserver === 'undefined') return undefined;

    const ajustar = (): void => {
      const nivel = nivelQueCabe((tentativa) => {
        conteudo.dataset.nivel = String(tentativa);
        return cabe(livre, conteudo);
      }, ultimo);
      conteudo.dataset.nivel = String(nivel);
    };

    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(livre);
    return () => observador.disconnect();
  }, [quando]);
}
