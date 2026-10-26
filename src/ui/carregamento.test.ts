// @vitest-environment jsdom
/**
 * O que o app carrega sob demanda — e quando pede.
 *
 * O palco 3D e o Códice são pacotes à parte (carregamento.ts). O que se prende
 * aqui é o momento dos pedidos: nada antes do ócio, o palco antes do Códice,
 * nada para quem pediu para poupar dados, e nenhum pedido depois de cancelado.
 * Os pacotes de verdade pesam e não são o assunto: entram como dublês que só
 * contam quantas vezes foram abertos.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const pedidos = { palco: 0, codice: 0 };

/** Ids de requestIdleCallback e as tarefas que esperam o ócio. */
let proximoId: number;
let emEspera: Array<{ id: number; tarefa: () => void }>;

beforeEach(() => {
  pedidos.palco = 0;
  pedidos.codice = 0;
  // Cada teste abre o módulo do zero — o estado dele (o que já chegou) é parte
  // do que se testa — e registra os dublês de novo, para contar só os seus pedidos.
  vi.resetModules();
  vi.doMock('@/three/stage', () => {
    pedidos.palco += 1;
    return { createDiceStage: () => null };
  });
  vi.doMock('@/ui/components/Codex', () => {
    pedidos.codice += 1;
    return { Codex: function CodexDeMentira() {} };
  });
  proximoId = 0;
  emEspera = [];
  vi.stubGlobal('requestIdleCallback', (tarefa: () => void) => {
    proximoId += 1;
    emEspera.push({ id: proximoId, tarefa });
    return proximoId;
  });
  vi.stubGlobal('cancelIdleCallback', (id: number) => {
    emEspera = emEspera.filter((espera) => espera.id !== id);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  Reflect.deleteProperty(navigator, 'connection');
});

const carregamento = () => import('./carregamento');

/** O navegador fica ocioso: roda a próxima tarefa que pediu esse momento. */
async function ficarOcioso(): Promise<void> {
  emEspera.shift()?.tarefa();
  await vi.dynamicImportSettled();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

const conexao = (campos: { saveData?: boolean; effectiveType?: string }): void => {
  Object.defineProperty(navigator, 'connection', { value: campos, configurable: true });
};

describe('o pré-carregamento no ócio', () => {
  it('não pede nada antes de o navegador ficar ocioso — o menu vem primeiro', async () => {
    const { precarregarNoOcio } = await carregamento();
    precarregarNoOcio();

    expect(pedidos).toEqual({ palco: 0, codice: 0 });
  });

  it('pede o palco primeiro e o Códice só depois: um de cada vez', async () => {
    const { precarregarNoOcio } = await carregamento();
    precarregarNoOcio();

    await ficarOcioso();
    expect(pedidos).toEqual({ palco: 1, codice: 0 });

    await ficarOcioso();
    expect(pedidos).toEqual({ palco: 1, codice: 1 });
  });

  it('quem pediu para poupar dados não gasta nada com o que talvez nunca use', async () => {
    conexao({ saveData: true });
    const { precarregarNoOcio } = await carregamento();
    precarregarNoOcio();

    expect(emEspera).toHaveLength(0);
    expect(pedidos).toEqual({ palco: 0, codice: 0 });
  });

  it.each(['2g', 'slow-2g'])('numa rede %s também não adianta nada', async (tipo) => {
    conexao({ effectiveType: tipo });
    const { precarregarNoOcio } = await carregamento();
    precarregarNoOcio();

    expect(emEspera).toHaveLength(0);
  });

  it('numa rede 4G adianta, como de costume', async () => {
    conexao({ effectiveType: '4g' });
    const { precarregarNoOcio } = await carregamento();
    precarregarNoOcio();

    expect(emEspera).toHaveLength(1);
  });

  it('cancelar antes do ócio cancela tudo', async () => {
    const { precarregarNoOcio } = await carregamento();
    const cancelar = precarregarNoOcio();
    cancelar();

    await ficarOcioso();
    expect(pedidos).toEqual({ palco: 0, codice: 0 });
  });

  it('cancelar com o palco a caminho deixa o Códice de fora', async () => {
    const { precarregarNoOcio } = await carregamento();
    const cancelar = precarregarNoOcio();

    emEspera.shift()?.tarefa();
    cancelar();
    await vi.dynamicImportSettled();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(pedidos.palco).toBe(1);
    expect(emEspera).toHaveLength(0);
    expect(pedidos.codice).toBe(0);
  });

  it('um pedido que falha (sem rede) é ignorado — o Códice ainda é pedido', async () => {
    vi.doMock('@/three/stage', () => {
      throw new Error('Failed to fetch dynamically imported module');
    });
    const { precarregarNoOcio } = await carregamento();
    precarregarNoOcio();

    await ficarOcioso();
    await ficarOcioso();

    expect(pedidos.codice).toBe(1);
  });

  it('no Safari, que não tem requestIdleCallback, um atraso curto faz as vezes', async () => {
    vi.stubGlobal('requestIdleCallback', undefined);
    vi.useFakeTimers();
    const { precarregarNoOcio } = await carregamento();
    precarregarNoOcio();

    expect(pedidos.palco).toBe(0);
    await vi.advanceTimersByTimeAsync(1600);
    await vi.dynamicImportSettled();

    expect(pedidos.palco).toBe(1);
  });
});

describe('o Códice que já chegou', () => {
  it('antes de chegar, não há componente; depois, o componente fica guardado', async () => {
    const { carregarCodice, codiceCarregado } = await carregamento();
    expect(codiceCarregado()).toBeNull();

    await carregarCodice();

    expect(codiceCarregado()).toBeTypeOf('function');
  });
});
