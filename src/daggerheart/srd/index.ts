/**
 * Normalizador do Daggerheart SRD.
 *
 * Os arquivos em `dados/` são cópias verbatim do dataset publicado sob a
 * DPCGL — ver `PROCEDENCIA.md`. Este módulo os traduz para formas estáveis
 * e absorve as inconsistências do original, para que o resto do app nunca
 * precise saber que `classes[].name` é uma string em caixa alta enquanto
 * `ancestries[].name` é um objeto localizado.
 *
 * Os dados são carregados sob demanda: são ~230 KB que só interessam a quem
 * abre a ficha, e não devem pesar no primeiro carregamento da mesa.
 */

import type { TraitId } from '../regras';

// ------------------------------------------------------------- formas cruas

/** Texto localizado do dataset. Só existe `en-US` hoje. */
type Localizado = Record<string, string>;

type BlocoCru =
  | { paragraph: Localizado }
  | { list: Localizado[] }
  | Record<string, unknown>;

interface CaracteristicaCrua {
  name?: Localizado;
  description?: BlocoCru[];
}

// ---------------------------------------------------------- formas normais

export type Bloco =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'lista'; itens: string[] };

export interface Caracteristica {
  nome: string;
  blocos: Bloco[];
}

export type DominioId =
  | 'ARCANA'
  | 'BLADE'
  | 'BONE'
  | 'CODEX'
  | 'GRACE'
  | 'MIDNIGHT'
  | 'SAGE'
  | 'SPLENDOR'
  | 'VALOR';

export interface Ancestralidade {
  id: string;
  nome: string;
  descricao: Bloco[];
  caracteristicas: Caracteristica[];
}

export interface Comunidade {
  id: string;
  nome: string;
  descricao: Bloco[];
  personalidades: string[];
  caracteristicas: Caracteristica[];
}

export interface Classe {
  id: string;
  nome: string;
  descricao: Bloco[];
  dominios: DominioId[];
  evasaoInicial: number;
  pontosDeVidaIniciais: number;
  itens: string[];
  caracteristicaDeEsperanca: Caracteristica | null;
  caracteristicas: Caracteristica[];
}

export interface Subclasse {
  id: string;
  nome: string;
  /** Id da classe dona, já normalizado (ex.: "core_class_bard"). */
  classeId: string;
  dominios: DominioId[];
  /** Atributo usado nas rolagens de conjuração, no vocabulário do Aion. */
  atributoDeConjuracao: TraitId | null;
  fundacao: Caracteristica[];
  especializacao: Caracteristica[];
  maestria: Caracteristica[];
}

export type TipoDeCarta = 'ABILITY' | 'GRIMOIRE' | 'SPELL';

export interface CartaDeDominio {
  id: string;
  nome: string;
  dominio: DominioId;
  tipo: TipoDeCarta;
  nivel: number;
  custoDeLembranca: number;
  caracteristicas: Caracteristica[];
}

export interface Srd {
  ancestralidades: Ancestralidade[];
  comunidades: Comunidade[];
  classes: Classe[];
  subclasses: Subclasse[];
  cartas: CartaDeDominio[];
}

// ------------------------------------------------------------- vocabulário

/** Nome e cor de cada domínio, para a interface. */
export const DOMINIOS: Record<DominioId, { nome: string; cor: string }> = {
  ARCANA: { nome: 'Arcana', cor: '#9b6fd4' },
  BLADE: { nome: 'Blade', cor: '#c94f5a' },
  BONE: { nome: 'Bone', cor: '#ddd4c0' },
  CODEX: { nome: 'Codex', cor: '#4a7fd4' },
  GRACE: { nome: 'Grace', cor: '#e07fb0' },
  MIDNIGHT: { nome: 'Midnight', cor: '#5a6d96' },
  SAGE: { nome: 'Sage', cor: '#3fa07a' },
  SPLENDOR: { nome: 'Splendor', cor: '#e8b563' },
  VALOR: { nome: 'Valor', cor: '#d98a4a' },
};

export const TIPOS_DE_CARTA: Record<TipoDeCarta, string> = {
  ABILITY: 'Habilidade',
  GRIMOIRE: 'Grimório',
  SPELL: 'Magia',
};

/**
 * O SRD nomeia os atributos em inglês e em caixa alta; o Aion usa os nomes
 * em português. Este é o único ponto de tradução entre os dois vocabulários.
 */
const ATRIBUTO_POR_NOME_SRD: Record<string, TraitId> = {
  AGILITY: 'agilidade',
  STRENGTH: 'forca',
  FINESSE: 'precisao',
  INSTINCT: 'instinto',
  PRESENCE: 'presenca',
  KNOWLEDGE: 'saber',
};

export function atributoDoSrd(nome: string | undefined): TraitId | null {
  if (!nome) return null;
  return ATRIBUTO_POR_NOME_SRD[nome.toUpperCase()] ?? null;
}

// -------------------------------------------------------------- utilidades

const IDIOMA = 'en-US';

/**
 * Extrai texto de um campo que pode vir como objeto localizado ou como
 * string plana — o dataset usa as duas formas.
 */
function texto(valor: unknown): string {
  if (typeof valor === 'string') return valor;
  if (valor && typeof valor === 'object') {
    const mapa = valor as Localizado;
    const escolhido = mapa[IDIOMA] ?? Object.values(mapa)[0];
    if (typeof escolhido === 'string') return escolhido;
  }
  return '';
}

/**
 * `classes[].name` chega como "BARD". Vira "Bard" — sem mexer em nomes que
 * já vêm capitalizados corretamente, como "Beastbound".
 */
function nomeApresentavel(valor: unknown): string {
  const bruto = texto(valor);
  if (bruto.length === 0) return '';
  if (bruto !== bruto.toUpperCase()) return bruto;

  return bruto
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((parte) =>
      /^[a-z]/.test(parte) ? parte.charAt(0).toUpperCase() + parte.slice(1) : parte,
    )
    .join('');
}

function blocos(cru: BlocoCru[] | undefined): Bloco[] {
  if (!Array.isArray(cru)) return [];

  const saida: Bloco[] = [];
  for (const bloco of cru) {
    if (!bloco || typeof bloco !== 'object') continue;

    if ('paragraph' in bloco) {
      const conteudo = texto((bloco as { paragraph: unknown }).paragraph);
      if (conteudo) saida.push({ tipo: 'paragrafo', texto: conteudo });
      continue;
    }

    if ('list' in bloco) {
      const bruta = (bloco as { list: unknown }).list;
      const itens = Array.isArray(bruta) ? bruta.map(texto).filter(Boolean) : [];
      if (itens.length > 0) saida.push({ tipo: 'lista', itens });
    }
  }
  return saida;
}

function caracteristicas(cru: CaracteristicaCrua[] | undefined): Caracteristica[] {
  if (!Array.isArray(cru)) return [];
  return cru
    .filter((item): item is CaracteristicaCrua => Boolean(item) && typeof item === 'object')
    .map((item) => ({
      nome: nomeApresentavel(item.name),
      blocos: blocos(item.description),
    }))
    // Uma característica sem nome nem texto não tem o que mostrar.
    .filter((item) => item.nome.length > 0 || item.blocos.length > 0);
}

function dominios(cru: unknown): DominioId[] {
  if (!Array.isArray(cru)) return [];
  return cru
    .map((valor) => String(valor).toUpperCase())
    .filter((valor): valor is DominioId => valor in DOMINIOS);
}

/** Id estável de classe a partir do nome em caixa alta usado nas subclasses. */
function idDeClasse(nome: unknown): string {
  return `core_class_${texto(nome).toLowerCase()}`;
}

// ---------------------------------------------------------- carregamento

let cache: Promise<Srd> | null = null;

/**
 * Carrega e normaliza o SRD. O resultado é memorizado: várias telas podem
 * pedir sem custo extra, e o `import()` dinâmico mantém os ~230 KB fora do
 * carregamento inicial.
 */
export function carregarSrd(): Promise<Srd> {
  cache ??= (async (): Promise<Srd> => {
    const [ancestriesRaw, communitiesRaw, classesRaw, subclassesRaw, cardsRaw] =
      await Promise.all([
        import('./dados/ancestries.json'),
        import('./dados/communities.json'),
        import('./dados/classes.json'),
        import('./dados/subclasses.json'),
        import('./dados/domain-cards.json'),
      ]);

    const lista = <T,>(modulo: { default: unknown }): T[] =>
      Array.isArray(modulo.default) ? (modulo.default as T[]) : [];

    type AncestryCru = { id: string; name: unknown; description?: BlocoCru[]; features?: CaracteristicaCrua[] };
    type CommunityCru = AncestryCru & { personalities?: unknown[] };
    type ClassCru = {
      id: string;
      name: unknown;
      description?: BlocoCru[];
      domains?: unknown;
      startingEvasion?: number;
      startingHitPoints?: number;
      classItems?: unknown[];
      hopeFeature?: CaracteristicaCrua;
      classFeatures?: CaracteristicaCrua[];
    };
    type SubclassCru = {
      id: string;
      name: unknown;
      class?: unknown;
      domains?: unknown;
      spellcastTrait?: string;
      foundation?: { features?: CaracteristicaCrua[] };
      specialization?: { features?: CaracteristicaCrua[] };
      mastery?: { features?: CaracteristicaCrua[] };
    };
    type CardCru = {
      id: string;
      name: unknown;
      domain?: unknown;
      type?: string;
      level?: number;
      recallCost?: number;
      features?: CaracteristicaCrua[];
    };

    const ancestralidades: Ancestralidade[] = lista<AncestryCru>(ancestriesRaw).map((cru) => ({
      id: cru.id,
      nome: nomeApresentavel(cru.name),
      descricao: blocos(cru.description),
      caracteristicas: caracteristicas(cru.features),
    }));

    const comunidades: Comunidade[] = lista<CommunityCru>(communitiesRaw).map((cru) => ({
      id: cru.id,
      nome: nomeApresentavel(cru.name),
      descricao: blocos(cru.description),
      personalidades: Array.isArray(cru.personalities)
        ? cru.personalities.map(texto).filter(Boolean)
        : [],
      caracteristicas: caracteristicas(cru.features),
    }));

    const classes: Classe[] = lista<ClassCru>(classesRaw).map((cru) => ({
      id: cru.id,
      nome: nomeApresentavel(cru.name),
      descricao: blocos(cru.description),
      dominios: dominios(cru.domains),
      evasaoInicial: typeof cru.startingEvasion === 'number' ? cru.startingEvasion : 10,
      pontosDeVidaIniciais:
        typeof cru.startingHitPoints === 'number' ? cru.startingHitPoints : 6,
      itens: Array.isArray(cru.classItems) ? cru.classItems.map(texto).filter(Boolean) : [],
      caracteristicaDeEsperanca: cru.hopeFeature
        ? (caracteristicas([cru.hopeFeature])[0] ?? null)
        : null,
      caracteristicas: caracteristicas(cru.classFeatures),
    }));

    const subclasses: Subclasse[] = lista<SubclassCru>(subclassesRaw).map((cru) => ({
      id: cru.id,
      nome: nomeApresentavel(cru.name),
      classeId: idDeClasse(cru.class),
      dominios: dominios(cru.domains),
      atributoDeConjuracao: atributoDoSrd(cru.spellcastTrait),
      fundacao: caracteristicas(cru.foundation?.features),
      especializacao: caracteristicas(cru.specialization?.features),
      maestria: caracteristicas(cru.mastery?.features),
    }));

    const cartas: CartaDeDominio[] = lista<CardCru>(cardsRaw).map((cru) => ({
      id: cru.id,
      nome: nomeApresentavel(cru.name),
      dominio: (dominios([cru.domain])[0] ?? 'ARCANA') as DominioId,
      tipo: (cru.type ?? 'ABILITY').toUpperCase() as TipoDeCarta,
      nivel: typeof cru.level === 'number' ? cru.level : 1,
      custoDeLembranca: typeof cru.recallCost === 'number' ? cru.recallCost : 0,
      caracteristicas: caracteristicas(cru.features),
    }));

    return { ancestralidades, comunidades, classes, subclasses, cartas };
  })();

  return cache;
}

/** Exposto para os testes — normalizar sem passar pelo cache. */
export const __interno = { texto, nomeApresentavel, blocos, caracteristicas, dominios, idDeClasse };

// -------------------------------------------------------------- consultas

export function subclassesDaClasse(srd: Srd, classeId: string | null): Subclasse[] {
  if (!classeId) return [];
  return srd.subclasses.filter((subclasse) => subclasse.classeId === classeId);
}

/**
 * Cartas que o personagem pode pegar: dos domínios dele e de nível até o
 * dele. É o filtro que a mesa realmente usa ao subir de nível.
 */
export function cartasDisponiveis(
  srd: Srd,
  dominiosDoPersonagem: DominioId[],
  nivel: number,
): CartaDeDominio[] {
  const permitidos = new Set(dominiosDoPersonagem);
  return srd.cartas
    .filter((carta) => permitidos.has(carta.dominio) && carta.nivel <= nivel)
    .sort((a, b) => a.nivel - b.nivel || a.nome.localeCompare(b.nome, 'pt-BR'));
}

/** Domínios de um personagem: os da classe, mais os da subclasse. */
export function dominiosDoPersonagem(
  srd: Srd,
  classeId: string | null,
  subclasseId: string | null,
): DominioId[] {
  const classe = srd.classes.find((item) => item.id === classeId);
  const subclasse = srd.subclasses.find((item) => item.id === subclasseId);
  const todos = [...(classe?.dominios ?? []), ...(subclasse?.dominios ?? [])];
  return [...new Set(todos)];
}
