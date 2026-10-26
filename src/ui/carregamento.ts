/**
 * O que o app carrega sob demanda, e como adiantar isso sem atrapalhar.
 *
 * O menu é a primeira tela, e num celular com rede fraca cada quilobyte conta
 * antes do primeiro quadro. Duas partes pesadas não servem a ele: o palco 3D
 * (three + física, cerca de 500 KB) e o Códice (o acervo inteiro, o atlas e o
 * almanaque). Cada uma vem em seu próprio pacote, pedido só quando a tela que a
 * usa abre — ou antes, quando o navegador fica ocioso e a pessoa ainda está
 * lendo o menu, de modo que o clique raramente espere pela rede.
 */

/** O pacote do palco 3D (three + física). */
export const carregarPalco = () => import('@/three/stage');

type ComponenteDoCodice = (typeof import('@/ui/components/Codex'))['Codex'];

let codice: ComponenteDoCodice | null = null;

/**
 * O pacote do Códice: acervo, atlas, almanaque e as folhas de estilo deles.
 * Guarda o componente ao chegar, para quem entrar depois montá-lo direto.
 */
export const carregarCodice = () =>
  import('@/ui/components/Codex').then((modulo) => {
    codice = modulo.Codex;
    return modulo;
  });

/** O Códice, se o pacote dele já chegou (pré-carregado ou de uma visita anterior). */
export const codiceCarregado = (): ComponenteDoCodice | null => codice;

interface ConexaoDoAparelho {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * O aparelho pediu para poupar dados, ou a rede é de 2G: adiantar o que talvez
 * nunca se use seria gastar o plano de quem avisou que não quer gastar.
 */
function poupandoDados(): boolean {
  const conexao = (navigator as Navigator & { connection?: ConexaoDoAparelho }).connection;
  return Boolean(conexao?.saveData) || /(^|-)2g$/.test(conexao?.effectiveType ?? '');
}

/** O Safari ainda não tem `requestIdleCallback`: um atraso curto faz as vezes. */
function quandoOcioso(tarefa: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(tarefa, { timeout: 4000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(tarefa, 1500);
  return () => window.clearTimeout(id);
}

/**
 * Pede os dois pacotes em segundo plano, um de cada vez, assim que o navegador
 * tem folga. O palco vem primeiro: a Mesa é a porta grande do menu. Um pedido
 * que falha (sem rede) é só ignorado — quem precisar dele de fato o pede de novo
 * e vê o próprio erro. Devolve a função que cancela o que ainda não saiu.
 */
export function precarregarNoOcio(): () => void {
  if (typeof window === 'undefined' || poupandoDados()) return () => {};

  let cancelado = false;
  let cancelaEspera = quandoOcioso(() => {
    void carregarPalco()
      .catch(() => {})
      .then(() => {
        if (cancelado) return;
        cancelaEspera = quandoOcioso(() => {
          void carregarCodice().catch(() => {});
        });
      });
  });

  return () => {
    cancelado = true;
    cancelaEspera();
  };
}
