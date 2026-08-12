/**
 * Extração do dano escrito no texto das cartas de domínio.
 *
 * As cartas descrevem dano em prosa ("dealing d8+2 magic damage using your
 * Proficiency"). Este módulo lê esses trechos e devolve algo que o motor
 * consegue rolar, para o jogador não precisar montar a expressão à mão.
 *
 * A REGRA, conferida contra as 189 cartas do SRD:
 *
 *   expressão SEM contagem  → a contagem é a Proficiência  (d8+2  → 2d8+2)
 *   expressão COM contagem  → rola como está               (2d6   → 2d6)
 *
 * Não é chute. Das 31 expressões de dano do dataset, as 9 sem contagem
 * dizem explicitamente que usam a Proficiência (8 com "using your
 * Proficiency", 1 com a variante "using your Spellcast trait"), e nenhuma
 * das 22 com contagem cita Proficiência. A ausência da contagem é o
 * marcador, e é o que o teste `dano.test.ts` trava.
 */

import type { CartaDeDominio } from './index';

export interface DanoDeCarta {
  /** Trecho original, como aparece na carta. */
  trecho: string;
  /** Null quando a quantidade de dados vem da Proficiência. */
  quantidade: number | null;
  faces: number;
  bonus: number;
  /** "magic", "physical" ou null quando a carta não diz. */
  tipo: string | null;
  /**
   * O parágrafo DESTE dano fala em usar a Proficiência.
   *
   * Guardado por parágrafo, não por carta: um grimório como Book of Exota
   * tem uma habilidade que cita "Spellcast trait" e outra, sem relação, com
   * dano fixo. Olhar a carta inteira associaria as duas por engano.
   */
  citaProficiencia: boolean;
}

/**
 * Casa "2d6 damage", "d8+2 magic damage", "1d20 + 3 physical damage".
 * A palavra `damage` é obrigatória: sem ela, um "roll that many d6s" viraria
 * dano por engano.
 */
const PADRAO_DE_DANO = /(\d+)?\s*d(\d+)\s*([+-]\s*\d+)?\s+(?:(magic|physical)\s+)?damage/gi;

/** Como o SRD escreve que a contagem de dados vem da Proficiência. */
const MENCAO_DE_PROFICIENCIA = /using your (Proficiency|Spellcast trait)/i;

function textosDaCarta(carta: CartaDeDominio): string[] {
  const saida: string[] = [];
  for (const caracteristica of carta.caracteristicas) {
    for (const bloco of caracteristica.blocos) {
      if (bloco.tipo === 'paragrafo') saida.push(bloco.texto);
      else saida.push(...bloco.itens);
    }
  }
  return saida;
}

/**
 * Todo dano que a carta descreve. Cartas com mais de uma opção — Tempest
 * oferece três — devolvem uma entrada por opção; repetições literais do
 * mesmo trecho são unificadas, porque virariam dois botões idênticos.
 */
export function extrairDanosDaCarta(carta: CartaDeDominio): DanoDeCarta[] {
  const encontrados: DanoDeCarta[] = [];
  const vistos = new Set<string>();

  for (const texto of textosDaCarta(carta)) {
    const citaProficiencia = MENCAO_DE_PROFICIENCIA.test(texto);

    for (const casamento of texto.matchAll(PADRAO_DE_DANO)) {
      const faces = Number.parseInt(casamento[2] ?? '', 10);
      if (!Number.isFinite(faces) || faces < 2) continue;

      const quantidadeCrua = casamento[1];
      const bonusCru = (casamento[3] ?? '').replace(/\s+/g, '');

      const dano: DanoDeCarta = {
        trecho: casamento[0].trim(),
        quantidade: quantidadeCrua ? Number.parseInt(quantidadeCrua, 10) : null,
        faces,
        bonus: bonusCru ? Number.parseInt(bonusCru, 10) : 0,
        tipo: casamento[4] ? casamento[4].toLowerCase() : null,
        citaProficiencia,
      };

      const chave = `${dano.quantidade ?? 'P'}d${dano.faces}${dano.bonus}`;
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      encontrados.push(dano);
    }
  }

  return encontrados;
}

/** Rolagem pronta para o motor, a partir de um dano de carta. */
export interface DanoPronto {
  expressao: string;
  rotulo: string;
  /** A contagem veio da Proficiência? Rende uma explicação na interface. */
  usaProficiencia: boolean;
}

/**
 * Monta a expressão de dano de uma carta.
 *
 * No crítico vale a mesma regra das armas: soma-se o valor máximo dos dados
 * ao que foi rolado, o que cabe como um bônus fixo e mantém tudo em uma
 * expressão só, auditável pela semente como qualquer outra rolagem.
 */
export function montarDanoDeCarta(
  dano: DanoDeCarta,
  proficiencia: number,
  nomeDaCarta: string,
  opcoes: { critico?: boolean } = {},
): DanoPronto {
  const usaProficiencia = dano.quantidade === null;
  const quantidade = Math.max(1, usaProficiencia ? proficiencia : dano.quantidade ?? 1);
  const critico = opcoes.critico === true;

  const bonus = dano.bonus + (critico ? quantidade * dano.faces : 0);
  const rotulo = critico ? `Dano crítico: ${nomeDaCarta}` : `Dano: ${nomeDaCarta}`;

  const base = `${quantidade}d${dano.faces}`;
  const comBonus = bonus === 0 ? base : bonus > 0 ? `${base}+${bonus}` : `${base}${bonus}`;

  return { expressao: `${comBonus}[${rotulo}]`, rotulo, usaProficiencia };
}
