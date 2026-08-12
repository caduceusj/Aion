/** Identificadores curtos e únicos para entradas, atalhos e personagens. */

let counter = 0;

export function uid(prefix = 'id'): string {
  counter += 1;
  const random = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-5);
  return `${prefix}_${time}${counter.toString(36)}${random}`;
}
