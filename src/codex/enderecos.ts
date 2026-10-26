/**
 * O endereço de cada página do Códice.
 *
 * O Códice vive no hash da URL — `#codice/casa-keaton` — para que um verbete se
 * mande num link e para que "abrir em nova aba" funcione. As três coisas que
 * precisam concordar sobre esse formato (quem lê o hash, quem o escreve e quem
 * desenha o link) importam daqui.
 */

/** Endereço de um verbete na barra do navegador: #codice/casa-keaton. */
export const PREFIXO_HASH = '#codice/';

/**
 * Duas vistas que não são verbetes, e por isso têm endereço próprio.
 *
 * O Atlas é o mapa; o Almanaque é o calendário. Nenhum dos dois cabe em
 * parágrafos — são instrumentos, não leitura — mas os dois precisam de link
 * que se possa colar no grupo, como qualquer verbete.
 */
export const CHAVE_ATLAS = '@atlas';
export const CHAVE_CALENDARIO = '@calendario';

/** O endereço de uma página; `null` é a capa. */
export function enderecoDaPagina(chave: string | null): string {
  return chave === null ? PREFIXO_HASH : PREFIXO_HASH + encodeURIComponent(chave);
}
