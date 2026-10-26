import type { Arma, Experiencia } from '@/daggerheart/ficha';
import { useAionStore } from '@/state/store';
import { avisar } from '@/ui/avisos';

/**
 * Toda remoção do app: age na hora e deixa o caminho de volta no aviso.
 *
 * O desfazer devolve **só o que foi removido**, no lugar em que estava, e não
 * uma foto do estado de antes. Numa foto, quem apagou uma arma, editou outra
 * e então desfez perderia a edição; aqui a edição fica e a arma volta.
 */

/**
 * Dois cliques seguidos não removem duas coisas.
 *
 * Tirar um item da lista faz o de baixo subir para o lugar exato do clique —
 * e um clique duplo, ou um dedo que insiste, acertava o botão de remover do
 * vizinho. Dentro desta janela, o segundo clique é ignorado; uma remoção de
 * propósito, depois de olhar a lista, passa folgada.
 */
const JANELA_ENTRE_REMOCOES_MS = 450;
let ultimaRemocao = Number.NEGATIVE_INFINITY;

function remocaoLiberada(): boolean {
  const agora = Date.now();
  if (agora - ultimaRemocao < JANELA_ENTRE_REMOCOES_MS) return false;
  ultimaRemocao = agora;
  return true;
}

/** Devolve `item` à lista na posição em que estava, ou ao fim se a lista encolheu. */
export function reinserir<T extends { id: string }>(
  lista: readonly T[],
  item: T,
  indice: number,
): T[] {
  const copia = [...lista];
  if (copia.some((existente) => existente.id === item.id)) return copia;
  copia.splice(Math.max(0, Math.min(indice, copia.length)), 0, item);
  return copia;
}

const plural = (n: number, singular: string, varios: string): string =>
  n === 1 ? singular : varios;

export function removerEntrada(id: string): void {
  if (!remocaoLiberada()) return;
  const { history, removeEntry } = useAionStore.getState();
  const indice = history.findIndex((item) => item.id === id);
  const entrada = history[indice];
  if (!entrada) return;

  removeEntry(id);
  avisar('Rolagem removida do histórico.', () =>
    useAionStore.getState().restaurarEntrada(entrada, indice),
  );
}

export function limparHistorico(): void {
  if (!remocaoLiberada()) return;
  const { history, clearHistory } = useAionStore.getState();
  if (history.length === 0) return;

  clearHistory();
  avisar(`Histórico limpo: ${history.length} ${plural(history.length, 'rolagem', 'rolagens')}.`, () =>
    useAionStore.getState().restaurarHistorico(history),
  );
}

export function removerAtalho(id: string): void {
  if (!remocaoLiberada()) return;
  const { macros, removeMacro } = useAionStore.getState();
  const macro = macros.find((item) => item.id === id);
  if (!macro) return;

  removeMacro(id);
  avisar(`Atalho “${macro.name}” removido.`, () => useAionStore.getState().restaurarMacro(macro));
}

export function removerPersonagem(id: string): void {
  if (!remocaoLiberada()) return;
  const { characters, macros, activeCharacterId, removeCharacter } = useAionStore.getState();
  const indice = characters.findIndex((item) => item.id === id);
  const personagem = characters[indice];
  if (!personagem) return;

  const macrosIds = macros.filter((macro) => macro.characterId === id).map((macro) => macro.id);
  const eraAtivo = activeCharacterId === id;

  removeCharacter(id);
  avisar(`Personagem “${personagem.name}” removido.`, () =>
    useAionStore.getState().restaurarPersonagem(personagem, { indice, macrosIds, eraAtivo }),
  );
}

export function removerFicha(id: string): void {
  if (!remocaoLiberada()) return;
  const { fichas, fichaAtivaId, removerFicha: remover } = useAionStore.getState();
  const indice = fichas.findIndex((item) => item.id === id);
  const ficha = fichas[indice];
  if (!ficha) return;

  const eraAtiva = fichaAtivaId === id;

  remover(id);
  avisar(`Ficha de ${ficha.nome} removida.`, () =>
    useAionStore.getState().restaurarFicha(ficha, { indice, eraAtiva }),
  );
}

export function removerExperiencia(fichaId: string, experienciaId: string): void {
  if (!remocaoLiberada()) return;
  const { fichas, atualizarFicha } = useAionStore.getState();
  const ficha = fichas.find((item) => item.id === fichaId);
  const indice = ficha?.experiencias.findIndex((item) => item.id === experienciaId) ?? -1;
  const experiencia: Experiencia | undefined = ficha?.experiencias[indice];
  if (!ficha || !experiencia) return;

  atualizarFicha(fichaId, {
    experiencias: ficha.experiencias.filter((item) => item.id !== experienciaId),
  });
  avisar(`Experiência “${experiencia.nome}” removida.`, () => {
    const atual = useAionStore.getState().fichas.find((item) => item.id === fichaId);
    if (!atual) return;
    useAionStore
      .getState()
      .atualizarFicha(fichaId, { experiencias: reinserir(atual.experiencias, experiencia, indice) });
  });
}

export function removerArma(fichaId: string, armaId: string): void {
  if (!remocaoLiberada()) return;
  const { fichas, atualizarFicha } = useAionStore.getState();
  const ficha = fichas.find((item) => item.id === fichaId);
  const indice = ficha?.armas.findIndex((item) => item.id === armaId) ?? -1;
  const arma: Arma | undefined = ficha?.armas[indice];
  if (!ficha || !arma) return;

  atualizarFicha(fichaId, { armas: ficha.armas.filter((item) => item.id !== armaId) });
  avisar(`Arma “${arma.nome}” removida.`, () => {
    const atual = useAionStore.getState().fichas.find((item) => item.id === fichaId);
    if (!atual) return;
    useAionStore.getState().atualizarFicha(fichaId, { armas: reinserir(atual.armas, arma, indice) });
  });
}
