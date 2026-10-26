/**
 * Os atalhos de teclado, descritos uma vez só.
 *
 * Quem lê a lista (Ajustes e a folha que o `?` abre) e quem a executa
 * (`useAtalhosGlobais`) são código diferente, e uma lista escrita duas vezes
 * é uma lista que mente em uma delas. Aqui ficam os textos; o comportamento
 * fica no hook, e o teste de `atalhos.test.ts` confere que cada tecla
 * prometida aqui responde lá.
 */

export type Tecla = readonly [tecla: string, acao: string];

export interface GrupoDeAtalhos {
  id: 'geral' | 'mesa' | 'codice';
  titulo: string;
  teclas: readonly Tecla[];
}

export const ATALHOS: readonly GrupoDeAtalhos[] = [
  {
    id: 'geral',
    titulo: 'Em qualquer tela',
    teclas: [
      ['?', 'Mostra esta lista'],
      ['C', 'Abre e fecha o Códice'],
      ['Esc', 'Fecha o que estiver aberto; sem nada aberto, volta ao menu'],
    ],
  },
  {
    id: 'mesa',
    titulo: 'Na Mesa',
    teclas: [
      ['Enter', 'Vai para o campo de rolagem'],
      ['1 – 8', 'Rola d4, d6, d8, d10, d12, d20, d100 ou dF'],
      ['R', 'Repete a última rolagem'],
      ['V / D', 'Rola com vantagem / com desvantagem'],
      ['H', 'Abre e fecha o histórico'],
      ['A', 'Abre e fecha os atalhos de rolagem'],
      ['F', 'Abre e fecha a ficha'],
      ['M', 'Abre e fecha a mesa compartilhada'],
      [',', 'Abre os ajustes'],
    ],
  },
  {
    id: 'codice',
    titulo: 'No Códice',
    teclas: [
      ['/', 'Vai para a busca'],
      ['Alt + ←', 'Volta ao verbete anterior'],
      ['Alt + →', 'Avança'],
    ],
  },
];

/** Os grupos que valem numa tela, na ordem em que a pessoa os procura. */
export function atalhosDa(vista: 'menu' | 'mesa' | 'codice'): GrupoDeAtalhos[] {
  const geral = ATALHOS.filter((grupo) => grupo.id === 'geral');
  const proprio = ATALHOS.filter((grupo) => grupo.id === vista);
  const resto = ATALHOS.filter((grupo) => grupo.id !== 'geral' && grupo.id !== vista);
  return [...proprio, ...geral, ...resto];
}
