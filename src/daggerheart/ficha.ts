/**
 * Ficha de Daggerheart e a montagem automática das rolagens.
 *
 * A ideia é que o jogador nunca precise digitar notação: a ficha sabe o
 * atributo, a proficiência e o dado da arma, e daí sai a expressão pronta
 * para o motor. O que sai daqui é sempre uma string que o motor entende —
 * nada de um caminho paralelo de cálculo, para o histórico e a auditoria
 * continuarem valendo.
 */

import {
  BONUS_EXPERIENCIA,
  DADO_VANTAGEM,
  proficienciaDoNivel,
  TRAIT_BY_ID,
  type TraitId,
} from './regras';

/** Dados de dano que uma arma pode usar. */
export type DadoDeDano = 'd4' | 'd6' | 'd8' | 'd10' | 'd12';

export const DADOS_DE_DANO: DadoDeDano[] = ['d4', 'd6', 'd8', 'd10', 'd12'];

export interface Arma {
  id: string;
  nome: string;
  /** Atributo usado no ataque. */
  atributo: TraitId;
  dado: DadoDeDano;
  /** Somado ao dano depois dos dados. */
  bonus: number;
  tipo: 'fisico' | 'magico';
  /** Texto livre: "Corpo a corpo", "Longe", etc. */
  alcance: string;
}

export interface Experiencia {
  id: string;
  nome: string;
  bonus: number;
}

export interface Ficha {
  id: string;
  nome: string;
  nivel: number;
  classe: string;
  ancestralidade: string;
  comunidade: string;

  atributos: Record<TraitId, number>;

  /** Dificuldade para acertar este personagem. */
  evasao: number;
  limiarMaior: number;
  limiarSevero: number;

  pontosDeVidaTotal: number;
  pontosDeVidaMarcados: number;
  estresseTotal: number;
  estresseMarcado: number;
  armaduraTotal: number;
  armaduraMarcada: number;

  esperanca: number;

  armas: Arma[];
  experiencias: Experiencia[];

  /** Sobrescreve a proficiência derivada do nível, quando a mesa diverge. */
  proficienciaManual: number | null;

  // --- Escolhas do SRD ---
  // Guardadas como ids para o app poder buscar as características; os campos
  // de texto acima seguem valendo para quem joga com material próprio.
  classeId: string | null;
  subclasseId: string | null;
  ancestralidadeId: string | null;
  comunidadeId: string | null;
  /** Ids das cartas de domínio que o personagem tem em mãos. */
  cartas: string[];
}

/** Proficiência efetiva: a manual ganha da tabela por nível. */
export function proficiencia(ficha: Ficha): number {
  return ficha.proficienciaManual ?? proficienciaDoNivel(ficha.nivel);
}

/** Escreve um modificador do jeito que o motor lê e o humano entende. */
export function comModificador(base: string, modificador: number): string {
  if (modificador === 0) return base;
  return modificador > 0 ? `${base}+${modificador}` : `${base}${modificador}`;
}

/** Uma rolagem pronta: o que mandar para o motor e como chamá-la. */
export interface RolagemPronta {
  expressao: string;
  rotulo: string;
}

export interface OpcoesDeTeste {
  /** Soma 1d6. */
  vantagem?: boolean;
  /** Subtrai 1d6. */
  desvantagem?: boolean;
  /** Id da Experiência aplicada (custa 1 Esperança). */
  experienciaId?: string | null;
  /** Qualquer bônus circunstancial da cena. */
  bonusExtra?: number;
}

/**
 * Vantagem e desvantagem se cancelam uma a uma antes de rolar, então ter as
 * duas marcadas equivale a não ter nenhuma.
 */
function dadoDeSituacao(opcoes: OpcoesDeTeste): string {
  const vantagem = opcoes.vantagem === true;
  const desvantagem = opcoes.desvantagem === true;
  if (vantagem === desvantagem) return '';
  return vantagem ? `+${DADO_VANTAGEM}` : `-${DADO_VANTAGEM}`;
}

function bonusDaExperiencia(ficha: Ficha, id: string | null | undefined): number {
  if (!id) return 0;
  const experiencia = ficha.experiencias.find((item) => item.id === id);
  return experiencia ? experiencia.bonus : 0;
}

/**
 * Teste de atributo: dualidade + modificador do atributo.
 * É a rolagem mais comum da mesa, e sai de um toque no atributo.
 */
export function testeDeAtributo(
  ficha: Ficha,
  atributo: TraitId,
  opcoes: OpcoesDeTeste = {},
): RolagemPronta {
  const modificador =
    (ficha.atributos[atributo] ?? 0) +
    bonusDaExperiencia(ficha, opcoes.experienciaId) +
    (opcoes.bonusExtra ?? 0);

  const nome = TRAIT_BY_ID[atributo]?.nome ?? atributo;
  const expressao = `${comModificador('dd', modificador)}${dadoDeSituacao(opcoes)}[${nome}]`;

  return { expressao, rotulo: nome };
}

/** Ataque com uma arma: dualidade + o atributo que a arma usa. */
export function ataqueComArma(
  ficha: Ficha,
  arma: Arma,
  opcoes: OpcoesDeTeste = {},
): RolagemPronta {
  const modificador =
    (ficha.atributos[arma.atributo] ?? 0) +
    bonusDaExperiencia(ficha, opcoes.experienciaId) +
    (opcoes.bonusExtra ?? 0);

  const rotulo = `Ataque: ${arma.nome}`;
  const expressao = `${comModificador('dd', modificador)}${dadoDeSituacao(opcoes)}[${rotulo}]`;

  return { expressao, rotulo };
}

/** Valor máximo de uma face, para o dano crítico. */
function faceMaxima(dado: DadoDeDano): number {
  return Number.parseInt(dado.slice(1), 10);
}

/**
 * Dano da arma: a proficiência multiplica os dados.
 *
 * Proficiência 2 com uma arma d8+3 rola 2d8+3. No crítico, soma-se o valor
 * máximo dos dados de dano ao que foi rolado — o que dá para escrever como
 * um bônus fixo, mantendo tudo em uma expressão só e auditável.
 */
export function danoDaArma(
  ficha: Ficha,
  arma: Arma,
  opcoes: { critico?: boolean; bonusExtra?: number } = {},
): RolagemPronta {
  const prof = proficiencia(ficha);
  const critico = opcoes.critico === true;

  const bonus =
    arma.bonus +
    (opcoes.bonusExtra ?? 0) +
    (critico ? prof * faceMaxima(arma.dado) : 0);

  const rotulo = critico ? `Dano crítico: ${arma.nome}` : `Dano: ${arma.nome}`;
  const expressao = `${comModificador(`${prof}${arma.dado}`, bonus)}[${rotulo}]`;

  return { expressao, rotulo };
}

/**
 * Rolagem de conjuração: dualidade + o atributo que a subclasse define.
 * Qual atributo é depende da subclasse, e isso vem do SRD.
 */
export function rolagemDeConjuracao(
  ficha: Ficha,
  atributo: TraitId,
  opcoes: OpcoesDeTeste = {},
): RolagemPronta {
  const modificador =
    (ficha.atributos[atributo] ?? 0) +
    bonusDaExperiencia(ficha, opcoes.experienciaId) +
    (opcoes.bonusExtra ?? 0);

  const rotulo = 'Conjuração';
  const expressao = `${comModificador('dd', modificador)}${dadoDeSituacao(opcoes)}[${rotulo}]`;

  return { expressao, rotulo };
}

/** Reação: mesma dualidade, sem gerar Esperança nem Medo. */
export function rolagemDeReacao(
  ficha: Ficha,
  atributo: TraitId,
  opcoes: OpcoesDeTeste = {},
): RolagemPronta {
  const modificador = (ficha.atributos[atributo] ?? 0) + (opcoes.bonusExtra ?? 0);
  const nome = TRAIT_BY_ID[atributo]?.nome ?? atributo;
  const rotulo = `Reação: ${nome}`;
  const expressao = `${comModificador('dd', modificador)}${dadoDeSituacao(opcoes)}[${rotulo}]`;

  return { expressao, rotulo };
}

/** Ficha nova, pronta para jogar e para ser editada. */
export function fichaEmBranco(id: string, nome = 'Novo personagem'): Ficha {
  return {
    id,
    nome,
    nivel: 1,
    classe: '',
    ancestralidade: '',
    comunidade: '',
    atributos: {
      agilidade: 0,
      forca: 0,
      precisao: 0,
      instinto: 0,
      presenca: 0,
      saber: 0,
    },
    evasao: 10,
    limiarMaior: 5,
    limiarSevero: 10,
    pontosDeVidaTotal: 6,
    pontosDeVidaMarcados: 0,
    estresseTotal: 6,
    estresseMarcado: 0,
    armaduraTotal: 3,
    armaduraMarcada: 0,
    esperanca: 2,
    armas: [],
    experiencias: [],
    proficienciaManual: null,
    classeId: null,
    subclasseId: null,
    ancestralidadeId: null,
    comunidadeId: null,
    cartas: [],
  };
}

/** Exemplo jogável, para a ficha não abrir vazia na primeira vez. */
export function fichaDeExemplo(id: string): Ficha {
  return {
    ...fichaEmBranco(id, 'Vess'),
    classe: 'Guardiã',
    ancestralidade: 'Humana',
    comunidade: 'Loreborne',
    nivel: 1,
    atributos: {
      agilidade: 1,
      forca: 2,
      precisao: 0,
      instinto: 1,
      presenca: 0,
      saber: -1,
    },
    evasao: 11,
    limiarMaior: 7,
    limiarSevero: 13,
    pontosDeVidaTotal: 7,
    estresseTotal: 6,
    armaduraTotal: 4,
    esperanca: 2,
    armas: [
      {
        id: 'arm_espada',
        nome: 'Espada longa',
        atributo: 'forca',
        dado: 'd8',
        bonus: 3,
        tipo: 'fisico',
        alcance: 'Corpo a corpo',
      },
      {
        id: 'arm_arco',
        nome: 'Arco curto',
        atributo: 'precisao',
        dado: 'd6',
        bonus: 1,
        tipo: 'fisico',
        alcance: 'Longe',
      },
    ],
    experiencias: [
      { id: 'exp_guarda', nome: 'Guarda da cidadela', bonus: BONUS_EXPERIENCIA },
      { id: 'exp_ler', nome: 'Ler intenções', bonus: BONUS_EXPERIENCIA },
    ],
  };
}
