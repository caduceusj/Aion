import { describe, expect, it } from 'vitest';
import { audio, createAudio } from './sfx';

/**
 * Estes testes rodam em node, sem AudioContext. O contrato que importa é
 * que a camada de som degrade para silêncio sem nunca lançar — um erro de
 * áudio jamais pode derrubar a mesa.
 */
describe('degradação sem AudioContext', () => {
  it('cria a instância sem lançar', () => {
    expect(() => createAudio()).not.toThrow();
  });

  it('todos os métodos viram no-op silencioso', () => {
    const sfx = createAudio();
    expect(() => {
      sfx.unlock();
      sfx.throwDice(6);
      sfx.impact(0.5, 'd20');
      sfx.critical();
      sfx.fumble();
      sfx.reveal();
      sfx.click();
      sfx.setVolume(0.4);
      sfx.setEnabled(false);
      sfx.setEnabled(true);
      sfx.dispose();
    }).not.toThrow();
  });

  it('o singleton é seguro de usar direto', () => {
    expect(() => {
      audio.unlock();
      audio.click();
      audio.impact(1, 'd6');
      audio.dispose();
    }).not.toThrow();
  });

  it('aguenta valores fora da faixa sem reclamar', () => {
    const sfx = createAudio();
    expect(() => {
      sfx.setVolume(-5);
      sfx.setVolume(12);
      sfx.impact(-1, 'inexistente');
      sfx.impact(99, 'd20');
      sfx.throwDice(0);
      sfx.throwDice(500);
    }).not.toThrow();
  });

  it('dispose duas vezes seguidas não quebra', () => {
    const sfx = createAudio();
    sfx.dispose();
    expect(() => sfx.dispose()).not.toThrow();
  });
});
