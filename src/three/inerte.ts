import type { DiceStage } from '@/state/types';

/**
 * Palco inerte: no lugar da mesa 3D quando ela não existe — o aparelho não
 * abriu WebGL, ou o pacote do 3D não chegou (sem rede, ou cache velho).
 *
 * Fica fora de `stage.ts` para a interface poder usá-lo sem puxar o three: ele
 * é justamente o que se usa quando o three não veio.
 */
export function createInertStage(): DiceStage {
  return {
    // Sem mesa não há face para ler: devolve vazio e o store cai no gerador.
    arremessar: () => Promise.resolve([]),
    exibir: () => Promise.resolve(),
    esmaecer: () => {},
    clear: () => {},
    setSpeed: () => {},
    dispose: () => {},
    resize: () => {},
    inerte: true,
  };
}
