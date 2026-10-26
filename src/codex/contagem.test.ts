import { describe, expect, it } from 'vitest';
import { VERBETES } from './corpus';
import { TOTAL_DE_VERBETES } from './contagem';

describe('a contagem que o menu mostra', () => {
  it('bate com o acervo — mudou o número de verbetes, atualize contagem.ts', () => {
    expect(TOTAL_DE_VERBETES).toBe(VERBETES.length);
  });
});
