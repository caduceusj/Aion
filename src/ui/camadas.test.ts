import { afterEach, describe, expect, it, vi } from 'vitest';
import { empilhar, fecharTopo, haCamadas } from './camadas';

const retirar: Array<() => void> = [];
const registrar = (fechar: () => void): void => {
  retirar.push(empilhar(fechar));
};

afterEach(() => {
  while (retirar.length > 0) retirar.pop()?.();
});

describe('a pilha do Esc', () => {
  it('sem camada nenhuma, não há o que fechar', () => {
    expect(haCamadas()).toBe(false);
    expect(fecharTopo()).toBe(false);
  });

  it('fecha só a camada do topo, uma por vez', () => {
    const ajuda = vi.fn();
    const editor = vi.fn();
    registrar(ajuda);
    registrar(editor);

    expect(fecharTopo()).toBe(true);
    expect(editor).toHaveBeenCalledTimes(1);
    expect(ajuda).not.toHaveBeenCalled();
  });

  it('quem sai da pilha deixa o de baixo no topo', () => {
    const de_baixo = vi.fn();
    const de_cima = vi.fn();
    registrar(de_baixo);
    const tirarDeCima = empilhar(de_cima);

    tirarDeCima();
    fecharTopo();

    expect(de_cima).not.toHaveBeenCalled();
    expect(de_baixo).toHaveBeenCalledTimes(1);
  });

  it('retirar duas vezes não leva embora a camada de outro', () => {
    const outra = vi.fn();
    registrar(outra);
    const tirar = empilhar(() => {});
    tirar();
    tirar();

    expect(haCamadas()).toBe(true);
    fecharTopo();
    expect(outra).toHaveBeenCalledTimes(1);
  });
});
