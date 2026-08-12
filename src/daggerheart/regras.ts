/**
 * Daggerheart — o essencial, condensado.
 *
 * Este arquivo é a única fonte de números e textos de regra do sistema.
 * Ele existe separado da ficha e da interface justamente para que corrigir
 * uma regra seja mexer em uma linha, não caçar valores espalhados pelo app.
 *
 * O que o Aion automatiza é a MONTAGEM das rolagens — que é mecânica e não
 * tem ambiguidade. Os números da ficha (limiares de dano, Evasão, dados de
 * arma) são digitados pelo jogador, porque dependem de classe, ancestral,
 * comunidade e equipamento, e chutá-los seria pior do que perguntar.
 */

/** Os seis atributos. */
export type TraitId =
  | 'agilidade'
  | 'forca'
  | 'precisao'
  | 'instinto'
  | 'presenca'
  | 'saber';

export interface TraitDefinition {
  id: TraitId;
  nome: string;
  /** Nome no material em inglês, para quem joga com o livro original. */
  original: string;
  /** O que esse atributo cobre, em uma linha. */
  usa: string;
  /** Exemplos de ação, para o jogador saber o que rolar. */
  exemplos: string[];
}

export const TRAITS: TraitDefinition[] = [
  {
    id: 'agilidade',
    nome: 'Agilidade',
    original: 'Agility',
    usa: 'Correr, saltar, manobrar',
    exemplos: ['Esquivar', 'Escalar', 'Perseguir'],
  },
  {
    id: 'forca',
    nome: 'Força',
    original: 'Strength',
    usa: 'Erguer, quebrar, agarrar',
    exemplos: ['Arrombar', 'Segurar', 'Arremessar'],
  },
  {
    id: 'precisao',
    nome: 'Precisão',
    original: 'Finesse',
    usa: 'Sutileza, mira, delicadeza',
    exemplos: ['Furtar', 'Mirar', 'Escapulir'],
  },
  {
    id: 'instinto',
    nome: 'Instinto',
    original: 'Instinct',
    usa: 'Perceber, sentir, reagir',
    exemplos: ['Notar', 'Rastrear', 'Pressentir'],
  },
  {
    id: 'presenca',
    nome: 'Presença',
    original: 'Presence',
    usa: 'Encantar, intimidar, inspirar',
    exemplos: ['Persuadir', 'Enganar', 'Acalmar'],
  },
  {
    id: 'saber',
    nome: 'Saber',
    original: 'Knowledge',
    usa: 'Lembrar, deduzir, analisar',
    exemplos: ['Recordar', 'Investigar', 'Decifrar'],
  },
];

export const TRAIT_BY_ID: Record<TraitId, TraitDefinition> = Object.fromEntries(
  TRAITS.map((trait) => [trait.id, trait]),
) as Record<TraitId, TraitDefinition>;

/** Distribuição inicial sugerida para os atributos na criação. */
export const ARRAY_INICIAL = [2, 1, 1, 0, 0, -1];

/**
 * Proficiência por nível.
 *
 * Multiplica os dados de dano da arma: Proficiência 2 com uma arma d8+3
 * rola 2d8+3. CONFIRA com a sua mesa — é o número que mais varia entre
 * versões do material, e está aqui isolado para ser fácil de ajustar.
 */
export const PROFICIENCIA_POR_NIVEL: Record<number, number> = {
  1: 1,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 4,
  9: 4,
  10: 4,
};

export function proficienciaDoNivel(nivel: number): number {
  const limitado = Math.max(1, Math.min(10, Math.floor(nivel)));
  return PROFICIENCIA_POR_NIVEL[limitado] ?? 1;
}

/** Tier a partir do nível — usado para adversários e recompensas. */
export function tierDoNivel(nivel: number): 1 | 2 | 3 | 4 {
  if (nivel >= 8) return 4;
  if (nivel >= 5) return 3;
  if (nivel >= 2) return 2;
  return 1;
}

/** Teto de Esperança acumulada. */
export const ESPERANCA_MAXIMA = 6;

/** Bônus padrão de uma Experiência ao ser usada (custa 1 Esperança). */
export const BONUS_EXPERIENCIA = 2;

/** Dado somado por vantagem e subtraído por desvantagem. */
export const DADO_VANTAGEM = '1d6';

/** Faces dos dados de dualidade. */
export const FACES_DUALIDADE = 12;

/** Escala de Dificuldade, para o Mestre chamar um número sem travar. */
export interface FaixaDificuldade {
  rotulo: string;
  valor: number;
  quando: string;
}

export const DIFICULDADES: FaixaDificuldade[] = [
  { rotulo: 'Trivial', valor: 5, quando: 'Quase não vale rolar' },
  { rotulo: 'Fácil', valor: 10, quando: 'Pressão leve' },
  { rotulo: 'Moderada', valor: 15, quando: 'O padrão da mesa' },
  { rotulo: 'Difícil', valor: 20, quando: 'Exige talento' },
  { rotulo: 'Formidável', valor: 25, quando: 'Feito heroico' },
  { rotulo: 'Extrema', valor: 30, quando: 'Beira o impossível' },
];

/** Quanto dano marca quantos Pontos de Vida. */
export interface FaixaDeDano {
  id: 'menor' | 'maior' | 'severo';
  rotulo: string;
  pontosDeVida: number;
  descricao: string;
}

export const FAIXAS_DE_DANO: FaixaDeDano[] = [
  {
    id: 'menor',
    rotulo: 'Dano menor',
    pontosDeVida: 1,
    descricao: 'Abaixo do limiar Maior',
  },
  {
    id: 'maior',
    rotulo: 'Dano maior',
    pontosDeVida: 2,
    descricao: 'Do limiar Maior até o Severo',
  },
  {
    id: 'severo',
    rotulo: 'Dano severo',
    pontosDeVida: 3,
    descricao: 'No limiar Severo ou acima',
  },
];

/**
 * Quantos Pontos de Vida um dano marca, dados os limiares da ficha.
 * Os limiares vêm da armadura e do nível — o jogador os informa.
 */
export function pontosDeVidaPorDano(
  dano: number,
  limiarMaior: number,
  limiarSevero: number,
): FaixaDeDano {
  const severo = FAIXAS_DE_DANO[2];
  const maior = FAIXAS_DE_DANO[1];
  const menor = FAIXAS_DE_DANO[0];

  if (severo && dano >= limiarSevero) return severo;
  if (maior && dano >= limiarMaior) return maior;
  return menor ?? { id: 'menor', rotulo: 'Dano menor', pontosDeVida: 1, descricao: '' };
}

/** Os quatro desfechos possíveis de um teste, com o que cada um significa. */
export interface Desfecho {
  id: 'sucesso-esperanca' | 'sucesso-medo' | 'falha-esperanca' | 'falha-medo' | 'critico';
  rotulo: string;
  efeito: string;
}

export const DESFECHOS: Desfecho[] = [
  {
    id: 'critico',
    rotulo: 'Sucesso crítico',
    efeito: 'Você consegue, e com folga. Ganhe 1 Esperança e limpe 1 Estresse.',
  },
  {
    id: 'sucesso-esperanca',
    rotulo: 'Sucesso com Esperança',
    efeito: 'Você consegue o que queria. Ganhe 1 Esperança.',
  },
  {
    id: 'sucesso-medo',
    rotulo: 'Sucesso com Medo',
    efeito: 'Você consegue, mas a cena vira. O Mestre ganha 1 Medo.',
  },
  {
    id: 'falha-esperanca',
    rotulo: 'Falha com Esperança',
    efeito: 'Não deu certo, mas algo sobra a seu favor. Ganhe 1 Esperança.',
  },
  {
    id: 'falha-medo',
    rotulo: 'Falha com Medo',
    efeito: 'Não deu certo e piorou. O Mestre ganha 1 Medo.',
  },
];

export const DESFECHO_POR_ID: Record<Desfecho['id'], Desfecho> = Object.fromEntries(
  DESFECHOS.map((desfecho) => [desfecho.id, desfecho]),
) as Record<Desfecho['id'], Desfecho>;

/**
 * Lê o desfecho a partir do par de dualidade e da Dificuldade.
 * `dificuldade` nula significa que a mesa ainda não definiu o alvo — nesse
 * caso só a consequência de Esperança/Medo é conhecida.
 */
export function lerDesfecho(
  total: number,
  hope: number,
  fear: number,
  dificuldade: number | null,
): Desfecho | null {
  if (hope === fear) return DESFECHO_POR_ID.critico;
  if (dificuldade === null) return null;

  const sucesso = total >= dificuldade;
  const comEsperanca = hope > fear;

  if (sucesso) {
    return comEsperanca
      ? DESFECHO_POR_ID['sucesso-esperanca']
      : DESFECHO_POR_ID['sucesso-medo'];
  }
  return comEsperanca ? DESFECHO_POR_ID['falha-esperanca'] : DESFECHO_POR_ID['falha-medo'];
}

/** Lembretes curtos, do tipo que se esquece no meio da sessão. */
export interface Lembrete {
  titulo: string;
  texto: string;
}

export const LEMBRETES: Lembrete[] = [
  {
    titulo: 'Dualidade',
    texto:
      'Todo teste rola 2d12: um dado de Esperança e um de Medo, somados ao atributo. Quem sair maior decide a consequência; empate é sucesso crítico.',
  },
  {
    titulo: 'Vantagem e desvantagem',
    texto:
      'Vantagem soma 1d6 ao total; desvantagem subtrai 1d6. Cada vantagem cancela uma desvantagem antes de rolar.',
  },
  {
    titulo: 'Experiências',
    texto: `Gaste 1 Esperança para somar +${BONUS_EXPERIENCIA} usando uma Experiência que caiba na cena.`,
  },
  {
    titulo: 'Dano',
    texto:
      'O dano da arma é a Proficiência multiplicando os dados: Proficiência 2 com d8+3 rola 2d8+3. Compare com os limiares para saber quantos Pontos de Vida marcar.',
  },
  {
    titulo: 'Dano crítico',
    texto:
      'Em acerto crítico, some o valor máximo dos dados de dano ao que você rolou.',
  },
  {
    titulo: 'Rolagem de reação',
    texto:
      'Reações usam a dualidade normalmente, mas não geram Esperança nem Medo.',
  },
  {
    titulo: 'Estresse',
    texto:
      'Marcar Estresse é o custo de esforço extra. Sem espaço para marcar, você fica Vulnerável.',
  },
];
