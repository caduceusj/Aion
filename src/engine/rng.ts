/**
 * Gerador de números pseudoaleatórios do Aion.
 *
 * xoshiro128** semeado por string. A escolha é deliberada: precisamos que
 * uma rolagem seja reproduzível a partir da sua semente, para que a mesa
 * possa auditar qualquer resultado. `Math.random` não oferece isso.
 */

export interface Rng {
  /** Float uniforme em [0, 1). */
  next(): number;
  /** Inteiro uniforme em [min, max], inclusivo nas duas pontas. */
  int(min: number, max: number): number;
  /** Identificador determinístico — dois replays geram os mesmos ids. */
  id(prefix?: string): string;
}

const UINT32 = 4294967296;

function fnv1a(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Espalha uma semente de 32 bits em uma sequência bem distribuída. */
function splitmix32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  };
}

function rotl(x: number, k: number): number {
  return ((x << k) | (x >>> (32 - k))) >>> 0;
}

export function createRng(seed: string): Rng {
  const mix = splitmix32(fnv1a(seed || 'aion'));
  let s0 = mix();
  let s1 = mix();
  let s2 = mix();
  let s3 = mix();

  // Estado todo-zero é um ponto fixo do gerador; empurre para fora.
  if ((s0 | s1 | s2 | s3) === 0) {
    s0 = 0x9e3779b9;
    s3 = 0x85ebca6b;
  }

  const nextUint = (): number => {
    const result = Math.imul(rotl(Math.imul(s1, 5) >>> 0, 7), 9) >>> 0;
    const t = (s1 << 9) >>> 0;

    s2 = (s2 ^ s0) >>> 0;
    s3 = (s3 ^ s1) >>> 0;
    s1 = (s1 ^ s2) >>> 0;
    s0 = (s0 ^ s3) >>> 0;
    s2 = (s2 ^ t) >>> 0;
    s3 = rotl(s3, 11);

    return result;
  };

  // Descarta as primeiras saídas: estados semeados por hash correlacionam
  // um pouco no começo da sequência.
  for (let i = 0; i < 8; i += 1) nextUint();

  let counter = 0;

  return {
    next() {
      return nextUint() / UINT32;
    },
    int(min: number, max: number) {
      if (max < min) return min;
      const span = max - min + 1;
      return min + Math.floor((nextUint() / UINT32) * span);
    },
    id(prefix = 'x') {
      counter += 1;
      const a = nextUint().toString(36).padStart(7, '0');
      return `${prefix}${counter.toString(36)}${a}`;
    },
  };
}

/**
 * Semente nova de 16 caracteres hex. Usa entropia criptográfica quando
 * disponível; em ambientes sem `crypto` (alguns runners de teste) cai para
 * `Math.random`, que é aceitável porque a semente só precisa ser
 * imprevisível, não reproduzível.
 */
export function randomSeed(): string {
  const bytes = new Uint8Array(8);
  const webCrypto = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;

  if (webCrypto && typeof webCrypto.getRandomValues === 'function') {
    webCrypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  let out = '';
  for (let i = 0; i < bytes.length; i += 1) {
    out += (bytes[i] ?? 0).toString(16).padStart(2, '0');
  }
  return out;
}
