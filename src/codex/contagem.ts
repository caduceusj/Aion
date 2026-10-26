/**
 * Quantos verbetes o acervo tem, para quem não pode importar o acervo.
 *
 * A porta do Códice, no menu, diz "176 verbetes". Importar `corpus` só para
 * contar arrastaria o acervo inteiro (300 KB de texto) para o pacote da
 * primeira tela, que precisa abrir rápido. O número mora aqui, e
 * `contagem.test.ts` falha quando o acervo muda e ele fica para trás.
 */
export const TOTAL_DE_VERBETES = 176;
