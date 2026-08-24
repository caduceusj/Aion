/**
 * O renderizador da prosa do códice.
 *
 * Três marcações, e nenhuma a mais:
 *
 *   [[chave]]        link com o título do verbete
 *   [[chave|texto]]  link com texto próprio
 *   *ênfase*         itálico
 *
 * É deliberadamente pobre. Markdown completo convidaria a escrever layout
 * dentro do conteúdo; aqui o conteúdo só sabe falar de outros verbetes.
 * Uma chave inexistente vira texto simples em vez de link morto — e o teste
 * de integridade reprova a build antes de isso chegar a alguém.
 */

import type { ReactNode } from 'react';
import { verbete } from './corpus';

const MARCACAO = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|\*([^*]+)\*/g;

export interface ProsaProps {
  texto: string;
  /** Chamado ao clicar num link de verbete. */
  aoNavegar: (chave: string) => void;
}

/** Um parágrafo com os links resolvidos. */
export function Prosa({ texto, aoNavegar }: ProsaProps) {
  const partes: ReactNode[] = [];
  let cursor = 0;
  let n = 0;

  for (const casamento of texto.matchAll(MARCACAO)) {
    const inicio = casamento.index ?? 0;
    if (inicio > cursor) partes.push(texto.slice(cursor, inicio));
    cursor = inicio + casamento[0].length;

    const enfase = casamento[3];
    if (enfase !== undefined) {
      partes.push(
        <em className="codice-enfase" key={(n += 1)}>
          {enfase}
        </em>,
      );
      continue;
    }

    const chave = (casamento[1] ?? '').trim();
    const alvo = verbete(chave);
    const rotulo = casamento[2] ?? alvo?.titulo ?? chave;

    if (!alvo) {
      partes.push(rotulo);
      continue;
    }

    partes.push(
      <button
        type="button"
        className="codice-elo"
        key={(n += 1)}
        onClick={() => aoNavegar(chave)}
        title={alvo.resumo}
      >
        {rotulo}
      </button>,
    );
  }

  if (cursor < texto.length) partes.push(texto.slice(cursor));
  return <>{partes}</>;
}

/** A mesma prosa, sem marcação nenhuma — para títulos e prévias. */
export function semMarcacao(texto: string): string {
  return texto
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, (_, chave: string) => verbete(chave)?.titulo ?? chave)
    .replace(/\*([^*]+)\*/g, '$1');
}
