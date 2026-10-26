import { create } from 'zustand';

/**
 * O aviso que acompanha uma ação — "Ficha removida. Desfazer".
 *
 * Confirmar antes de apagar ("tem certeza?") treina a pessoa a clicar em
 * "sim" sem ler; desfazer depois é o que de fato protege, e custa um toque a
 * menos no caso comum, que é apagar de propósito. Por isso toda remoção do app
 * age na hora e deixa aqui o caminho de volta por alguns segundos.
 *
 * Só existe um aviso por vez: um novo substitui o anterior, e quem apagou duas
 * coisas seguidas desfaz a última — que é a que ainda está na cabeça.
 */

export interface Aviso {
  /** Muda a cada aviso, para o temporizador recomeçar mesmo com texto igual. */
  id: number;
  texto: string;
  /** Se existir, o aviso oferece "Desfazer". */
  desfazer?: () => void;
}

interface AvisosState {
  aviso: Aviso | null;
  avisar(texto: string, desfazer?: () => void): void;
  dispensar(): void;
  /** Roda o desfazer do aviso atual, se houver. `true` se havia. */
  desfazerUltimo(): boolean;
}

let proximo = 1;

export const useAvisos = create<AvisosState>((set, get) => ({
  aviso: null,

  avisar(texto, desfazer) {
    set({ aviso: { id: proximo++, texto, ...(desfazer ? { desfazer } : {}) } });
  },

  dispensar() {
    set({ aviso: null });
  },

  desfazerUltimo() {
    const aviso = get().aviso;
    if (!aviso?.desfazer) return false;
    // Dispensa antes de desfazer: o desfazer pode ele mesmo avisar algo.
    set({ aviso: null });
    aviso.desfazer();
    return true;
  },
}));

/** Atalho para quem só emite avisos e não precisa se inscrever no estado. */
export function avisar(texto: string, desfazer?: () => void): void {
  useAvisos.getState().avisar(texto, desfazer);
}
