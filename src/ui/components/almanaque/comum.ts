import {
  CORVISSEIA,
  DIAS_DO_MES,
  MESES,
  anoDoMes,
  dentroDaCorvisseia,
  mes as mesDoAno,
  mesDaCorvisseia,
  mesDoAnoDe,
  type ContinenteId,
  type PuloId,
} from '@/codex/calendario';

/**
 * O que as telas do almanaque dividem entre si: as cores do pulo, as siglas
 * dos continentes e a tradução de um dia em data valoriana.
 */

/** Duas letras, as bastantes para não confundir Valoran com Vrednost. */
export const SIGLAS: Record<ContinenteId, string> = {
  'al-hara': 'Al',
  fentor: 'Fe',
  valoran: 'Va',
  yoso: 'Yō',
  vrednost: 'Vr',
  ukanten: 'Uk',
};

/** Azul calmo, âmbar e vermelho: o ritmo do pulo, do mais manso ao mais duro. */
export const COR_DO_PULO: Record<PuloId, string> = {
  'sem-pulo': '#6c7fb0',
  normal: '#c9a24b',
  intenso: '#e0585a',
};

/**
 * Um glifo por classe, para a cor não ser a única pista: ›, ›› e ›››, que
 * lidos de relance são "devagar", "andando" e "correndo".
 */
export const GLIFO_DO_PULO: Record<PuloId, string> = {
  'sem-pulo': '›',
  normal: '››',
  intenso: '›››',
};

/** Aqu, Lur, Hel… — o bastante para rotular uma coluna de 28px. */
export const ABREVIACOES_DOS_MESES = MESES.map((m) => m.nome.slice(0, 3));

/**
 * A escala dos gráficos de distância: 2,5 UA no topo. O maior trecho da
 * tabela mede 2,49, e um teto redondo deixa as linhas de 0,5 e 1,5 — onde o
 * pulo muda de nome — em frações limpas da altura.
 */
export const DISTANCIA_DA_ESCALA = 2.5;

/** Quantos trechos a tabela tem; o gráfico não deve existir sem eles. */
export const TOTAL_DE_TRECHOS = CORVISSEIA.length;

export interface DataValoriana {
  /** 1 a 30. */
  diaDoMes: number;
  /** O mês da Corvisseia, de 1 a 36. */
  mesC: number;
  /** O nome do mês e tudo o que a folha sabe dele. */
  mes: ReturnType<typeof mesDoAno>;
  /** 1 a 3. */
  ano: number;
}

export function dataValoriana(dia: number): DataValoriana {
  const mesC = mesDaCorvisseia(dia);
  return {
    diaDoMes: Math.floor(dentroDaCorvisseia(dia) % DIAS_DO_MES) + 1,
    mesC,
    mes: mesDoAno(mesDoAnoDe(mesC)),
    ano: anoDoMes(mesC),
  };
}

/** Uma propriedade CSS personalizada, tipada o bastante para o `style` aceitar. */
export const variaveis = (v: Record<string, string | number>): React.CSSProperties =>
  v as React.CSSProperties;
