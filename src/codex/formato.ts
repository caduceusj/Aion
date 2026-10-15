/**
 * Números do Códice, em português.
 *
 * O ponto decimal de 19.5 e a vírgula de 19,5 parecem detalhe até aparecerem
 * lado a lado numa tela. Este arquivo é o único lugar que decide como um
 * número vira texto, e o almanaque, a prosa dos verbetes e a ficha lateral
 * passam todos por ele.
 */

/** 19,5 e não 19.5; 1,82 e não 1.82. */
export const numero = (valor: number, casas = 2): string =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/** 1.080 e não 1080 — com o ponto de milhar. */
export const inteiro = (valor: number): string => Math.round(valor).toLocaleString('pt-BR');
