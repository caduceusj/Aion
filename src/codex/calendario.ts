/**
 * O calendário de Aion — o céu, e como ele virou datas.
 *
 * Aion é a estrela. Seis continentes a rodeiam em três órbitas, e uma lua,
 * Corvus, salta de um continente ao outro em vez de girar em volta de um só.
 * O calendário inteiro sai daí:
 *
 *   Corvus fica 19,5 dias parada sobre um continente e leva 10,5 dias até o
 *   próximo. A magia que a impulsiona continua ardendo no céu que ela deixou
 *   durante a viagem — e é por isso que o mês tem 30 dias em todo continente,
 *   mesmo nos que orbitam em ritmos completamente diferentes.
 *
 * Seis continentes × 30 dias = 180 dias para a lua completar a volta e voltar
 * ao primeiro. Valoran, na órbita média de 360 dias, vê Corvus duas vezes por
 * ano — daí o ano de 12 meses e as quatro estações de três meses.
 *
 * As órbitas elípticas fazem a distância entre dois continentes mudar a cada
 * passagem, então Corvus acelera ou desacelera para manter sempre os mesmos
 * 10,5 dias de viagem. O padrão de distâncias se repete a cada 6 voltas dela
 * — 1080 dias, 36 meses, 3 anos valorianos: A Corvisseia.
 *
 * Nada aqui é estimado: as distâncias vêm da tabela do usuário, e as
 * velocidades são derivadas delas (`velocidade()`), o que o teste confere
 * contra a mesma tabela.
 */

/** Quilômetros em uma unidade astronômica. */
export const UA_EM_KM = 149_597_870.7;

export const DIAS_DO_MES = 30;
export const MESES_DO_ANO = 12;
export const DIAS_DO_ANO = DIAS_DO_MES * MESES_DO_ANO;

/** Quanto Corvus fica parada sobre um continente. */
export const DIAS_DE_ESTADIA = 19.5;
/** Quanto leva de um continente ao próximo, sempre. */
export const DIAS_DE_VIAGEM = 10.5;
/** Uma volta completa de Corvus pelos seis continentes. */
export const DIAS_DA_VOLTA = (DIAS_DE_ESTADIA + DIAS_DE_VIAGEM) * 6;
/** Seis voltas — o padrão de distâncias fecha e recomeça. */
export const DIAS_DA_CORVISSEIA = DIAS_DA_VOLTA * 6;

// =====================================================================
// AS TRÊS ÓRBITAS
// =====================================================================

export type CicloId = 'curto' | 'medio' | 'longo';

export interface Ciclo {
  id: CicloId;
  rotulo: string;
  /** Dias para dar a volta em Aion. */
  periodo: number;
  forma: 'circular' | 'elíptica';
  /**
   * Semi-eixo médio em UA.
   *
   * Derivado, não inventado: o trecho Valoran → Yoso mede 1,82 UA em toda
   * passagem da tabela, e dois pontos da mesma órbita a 120° um do outro
   * distam `2·a·sen 60°`. Isso fixa a órbita média em a ≈ 1,05 UA, e as
   * outras duas saem da terceira lei de Kepler (a ∝ T^⅔).
   */
  raioUA: number;
  nota: string;
}

export const CICLOS: Record<CicloId, Ciclo> = {
  curto: {
    id: 'curto',
    rotulo: 'O Ciclo Curto',
    periodo: 180,
    forma: 'circular',
    raioUA: 0.66,
    nota: 'Al-Hara sozinha, na única órbita perfeitamente circular do sistema.',
  },
  medio: {
    id: 'medio',
    rotulo: 'O Ciclo Médio',
    periodo: 360,
    forma: 'elíptica',
    raioUA: 1.05,
    nota: 'Fentor, Valoran e Yoso, dispostos em pirâmide — sempre a 120° um do outro.',
  },
  longo: {
    id: 'longo',
    rotulo: 'O Ciclo Longo',
    periodo: 540,
    forma: 'elíptica',
    raioUA: 1.38,
    nota: 'Ukanten e Vrednost, em polos opostos da mesma órbita.',
  },
};

// =====================================================================
// OS SEIS CONTINENTES
// =====================================================================

export type ContinenteId = 'al-hara' | 'fentor' | 'valoran' | 'yoso' | 'vrednost' | 'ukanten';

/** C1 é o mais perto de Aion; C6, o mais longe. É a numeração do almanaque. */
export type CodigoOrbital = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export interface Continente {
  id: ContinenteId;
  codigo: CodigoOrbital;
  nome: string;
  /** Verbete do Códice, para o diagrama poder levar à lore. */
  chave: string;
  ciclo: CicloId;
  /** Onde fica no diagrama, em graus. Os três médios a 120°; os dois longos opostos. */
  angulo: number;
}

export const CONTINENTES: Continente[] = [
  { id: 'al-hara', codigo: 'C1', nome: 'Al-Hara', chave: 'alhara', ciclo: 'curto', angulo: 20 },
  { id: 'fentor', codigo: 'C2', nome: 'Fentor', chave: 'fentor', ciclo: 'medio', angulo: 210 },
  { id: 'valoran', codigo: 'C3', nome: 'Valoran', chave: 'valoran', ciclo: 'medio', angulo: 330 },
  { id: 'yoso', codigo: 'C4', nome: 'Yōso', chave: 'yoso', ciclo: 'medio', angulo: 90 },
  { id: 'vrednost', codigo: 'C5', nome: 'Vrednost', chave: 'vrednost', ciclo: 'longo', angulo: 145 },
  { id: 'ukanten', codigo: 'C6', nome: 'Ukanten', chave: 'unkanten', ciclo: 'longo', angulo: 325 },
];

const POR_CODIGO = new Map(CONTINENTES.map((c) => [c.codigo, c]));
const POR_ID = new Map(CONTINENTES.map((c) => [c.id, c]));

export const continentePorCodigo = (codigo: CodigoOrbital): Continente =>
  POR_CODIGO.get(codigo) as Continente;

export const continente = (id: ContinenteId): Continente => POR_ID.get(id) as Continente;

// =====================================================================
// O MÊS: A SEMANA, AS FASES DA CONSTELAÇÃO, AS FASES DA LUA
// =====================================================================

/** Seis dias, um por continente — a semana é a rota de Corvus em miniatura. */
export const DIAS_DA_SEMANA = [
  'Aionia',
  'Aridia',
  'Lucidia',
  'Fluendia',
  'Elendia',
  'Frígia',
] as const;

export type FaseDaConstelacaoId = 'ascensao' | 'dominio' | 'virada';

export interface FaseDaConstelacao {
  id: FaseDaConstelacaoId;
  rotulo: string;
  /** Primeiro e último dia do mês, inclusive. */
  de: number;
  ate: number;
  nota: string;
}

export const FASES_DA_CONSTELACAO: FaseDaConstelacao[] = [
  {
    id: 'ascensao',
    rotulo: 'Ascensão',
    de: 1,
    ate: 10,
    nota: 'A constelação do mês sobe no horizonte e toma o céu.',
  },
  {
    id: 'dominio',
    rotulo: 'Domínio',
    de: 11,
    ate: 20,
    nota: 'Ela reina no alto — a metade do mês que leva o nome dela.',
  },
  {
    id: 'virada',
    rotulo: 'Virada',
    de: 21,
    ate: 30,
    nota: 'Ela cede, e a do mês seguinte já se anuncia na borda.',
  },
];

export type FaseDaLuaId = 'escura' | 'luz' | 'ecos';

export interface FaseDaLua {
  id: FaseDaLuaId;
  rotulo: string;
  nota: string;
}

export const FASES_DA_LUA: Record<FaseDaLuaId, FaseDaLua> = {
  escura: {
    id: 'escura',
    rotulo: 'Noite Escura',
    nota: 'Corvus está sobre outro continente. O céu daqui não a alcança.',
  },
  luz: {
    id: 'luz',
    rotulo: 'Luz de Corvus',
    nota: 'Os 19 dias e meio em que a lua está parada aqui em cima.',
  },
  ecos: {
    id: 'ecos',
    rotulo: 'Ecos de Corvus',
    nota: 'Ela já partiu, mas a magia do salto continua ardendo no céu que deixou.',
  },
};

/** Último dia do mês ainda sob a lua parada — o 20 conta pela metade. */
const ULTIMO_DIA_DE_ESTADIA = Math.ceil(DIAS_DE_ESTADIA);

/**
 * Que fase um continente vê num dia do mês.
 *
 * O cálculo é o mesmo em todo continente, e é o que faz o calendário ser um
 * só: quem está sob a lua tem 20 dias de luz e 10 de eco; quem não está tem
 * 30 de noite escura.
 */
export function faseDaLua(mes: Mes, dia: number, onde: ContinenteId): FaseDaLuaId {
  if (mes.lua !== onde) return 'escura';
  return dia <= ULTIMO_DIA_DE_ESTADIA ? 'luz' : 'ecos';
}

export function faseDaConstelacao(dia: number): FaseDaConstelacao {
  return FASES_DA_CONSTELACAO.find((f) => dia >= f.de && dia <= f.ate) ?? FASES_DA_CONSTELACAO[0]!;
}

// =====================================================================
// OS DOZE MESES
// =====================================================================

export type EstacaoId = 'verao' | 'outono' | 'inverno' | 'primavera';

export interface Estacao {
  id: EstacaoId;
  rotulo: string;
  /** Cor do calendário impresso, para a vista manter a prancha original. */
  cor: string;
}

export const ESTACOES: Record<EstacaoId, Estacao> = {
  verao: { id: 'verao', rotulo: 'Verão', cor: '#f8615a' },
  outono: { id: 'outono', rotulo: 'Outono', cor: '#f79a34' },
  inverno: { id: 'inverno', rotulo: 'Inverno', cor: '#8aa8e8' },
  primavera: { id: 'primavera', rotulo: 'Primavera', cor: '#35c552' },
};

export interface Mes {
  numero: number;
  nome: string;
  constelacao: string;
  estacao: EstacaoId;
  /** Onde Corvus passa os primeiros 19 dias e meio deste mês. */
  lua: ContinenteId;
  /** Onde a prancha impressa diverge do próprio sistema dela. */
  nota?: string;
}

/**
 * O ano valoriano, como a prancha do usuário o imprime.
 *
 * Duas divergências da prancha ficam anotadas em vez de escondidas — as duas
 * contrariam o próprio sistema do calendário, e o Códice registra o conserto
 * sem apagar o original.
 */
export const MESES: Mes[] = [
  { numero: 1, nome: 'Aquiário', constelacao: 'Águia', estacao: 'verao', lua: 'yoso' },
  { numero: 2, nome: 'Lureor', constelacao: 'Lobo', estacao: 'verao', lua: 'al-hara' },
  { numero: 3, nome: 'Helior', constelacao: 'Girassol', estacao: 'verao', lua: 'vrednost' },
  { numero: 4, nome: 'Lereal', constelacao: 'Lebre', estacao: 'outono', lua: 'fentor' },
  { numero: 5, nome: 'Lithral', constelacao: 'Lítope', estacao: 'outono', lua: 'ukanten' },
  {
    numero: 6,
    nome: 'Equiral',
    constelacao: 'Cavalo',
    estacao: 'outono',
    lua: 'valoran',
    nota: 'A prancha escreve "Verão" aqui, mas imprime o mês no bloco do outono, entre Lereal e Caessar. O outono é o que fecha com as quatro estações de três meses.',
  },
  { numero: 7, nome: 'Caessar', constelacao: 'Baleia', estacao: 'inverno', lua: 'yoso' },
  { numero: 8, nome: 'Brassar', constelacao: 'Árvore', estacao: 'inverno', lua: 'al-hara' },
  { numero: 9, nome: 'Felissar', constelacao: 'Felino', estacao: 'inverno', lua: 'vrednost' },
  { numero: 10, nome: 'Rodênio', constelacao: 'Roedor', estacao: 'primavera', lua: 'fentor' },
  {
    numero: 11,
    nome: 'Dracônio',
    constelacao: 'Serpente',
    estacao: 'primavera',
    lua: 'ukanten',
    nota: 'A prancha põe Al-Hara na lua deste mês, o que poria Corvus no mesmo continente duas vezes em três meses. A rota da Corvisseia — C6 → C3 no mês 11 — diz Ukanten.',
  },
  { numero: 12, nome: 'Corvinário', constelacao: 'Corvo', estacao: 'primavera', lua: 'valoran' },
];

export const mes = (numero: number): Mes => MESES[(numero - 1) % MESES_DO_ANO]!;

// =====================================================================
// A CORVISSEIA
// =====================================================================

export type PuloId = 'sem-pulo' | 'normal' | 'intenso';

export interface Pulo {
  id: PuloId;
  rotulo: string;
  nota: string;
}

export const PULOS: Record<PuloId, Pulo> = {
  'sem-pulo': {
    id: 'sem-pulo',
    rotulo: 'Sem pulo',
    nota: 'Menos de meia UA. Corvus atravessa devagar, e o céu mal registra a passagem.',
  },
  normal: {
    id: 'normal',
    rotulo: 'Normal',
    nota: 'Uma UA, mais ou menos. O salto que o calendário toma como padrão.',
  },
  intenso: {
    id: 'intenso',
    rotulo: 'Intenso',
    nota: 'Uma UA e meia ou mais. É o trecho que os pilotos do vazio marcam em vermelho.',
  },
};

export interface Trecho {
  /** 1 a 36 — três anos valorianos de uma Corvisseia. */
  mes: number;
  /** 1 a 6 — qual volta de Corvus. */
  volta: number;
  de: CodigoOrbital;
  para: CodigoOrbital;
  distanciaUA: number;
  pulo: PuloId;
}

/**
 * Os 36 trechos, na ordem em que Corvus os percorre.
 *
 * A rota é sempre a mesma — C4 → C1 → C5 → C2 → C6 → C3 e de volta a C4 —,
 * um ziguezague entre as três órbitas. O que muda é a distância, porque os
 * continentes não estão no mesmo lugar a cada passagem.
 */
export const CORVISSEIA: Trecho[] = [
  { mes: 1, volta: 1, de: 'C4', para: 'C1', distanciaUA: 1.08, pulo: 'normal' },
  { mes: 2, volta: 1, de: 'C1', para: 'C5', distanciaUA: 1.27, pulo: 'normal' },
  { mes: 3, volta: 1, de: 'C5', para: 'C2', distanciaUA: 0.76, pulo: 'normal' },
  { mes: 4, volta: 1, de: 'C2', para: 'C6', distanciaUA: 2.4, pulo: 'intenso' },
  { mes: 5, volta: 1, de: 'C6', para: 'C3', distanciaUA: 1.55, pulo: 'intenso' },
  { mes: 6, volta: 1, de: 'C3', para: 'C4', distanciaUA: 1.82, pulo: 'intenso' },

  { mes: 7, volta: 2, de: 'C4', para: 'C1', distanciaUA: 1.27, pulo: 'normal' },
  { mes: 8, volta: 2, de: 'C1', para: 'C5', distanciaUA: 1.8, pulo: 'intenso' },
  { mes: 9, volta: 2, de: 'C5', para: 'C2', distanciaUA: 0.49, pulo: 'sem-pulo' },
  { mes: 10, volta: 2, de: 'C2', para: 'C6', distanciaUA: 2.05, pulo: 'intenso' },
  { mes: 11, volta: 2, de: 'C6', para: 'C3', distanciaUA: 0.25, pulo: 'sem-pulo' },
  { mes: 12, volta: 2, de: 'C3', para: 'C4', distanciaUA: 1.82, pulo: 'intenso' },

  { mes: 13, volta: 3, de: 'C4', para: 'C1', distanciaUA: 1.08, pulo: 'normal' },
  { mes: 14, volta: 3, de: 'C1', para: 'C5', distanciaUA: 1.05, pulo: 'normal' },
  { mes: 15, volta: 3, de: 'C5', para: 'C2', distanciaUA: 1.86, pulo: 'intenso' },
  { mes: 16, volta: 3, de: 'C2', para: 'C6', distanciaUA: 2.19, pulo: 'intenso' },
  { mes: 17, volta: 3, de: 'C6', para: 'C3', distanciaUA: 0.49, pulo: 'sem-pulo' },
  { mes: 18, volta: 3, de: 'C3', para: 'C4', distanciaUA: 1.82, pulo: 'intenso' },

  { mes: 19, volta: 4, de: 'C4', para: 'C1', distanciaUA: 1.27, pulo: 'normal' },
  { mes: 20, volta: 4, de: 'C1', para: 'C5', distanciaUA: 1.27, pulo: 'normal' },
  { mes: 21, volta: 4, de: 'C5', para: 'C2', distanciaUA: 1.88, pulo: 'intenso' },
  { mes: 22, volta: 4, de: 'C2', para: 'C6', distanciaUA: 1.08, pulo: 'normal' },
  { mes: 23, volta: 4, de: 'C6', para: 'C3', distanciaUA: 2.09, pulo: 'intenso' },
  { mes: 24, volta: 4, de: 'C3', para: 'C4', distanciaUA: 1.82, pulo: 'intenso' },

  { mes: 25, volta: 5, de: 'C4', para: 'C1', distanciaUA: 1.08, pulo: 'normal' },
  { mes: 26, volta: 5, de: 'C1', para: 'C5', distanciaUA: 1.8, pulo: 'intenso' },
  { mes: 27, volta: 5, de: 'C5', para: 'C2', distanciaUA: 2.49, pulo: 'intenso' },
  { mes: 28, volta: 5, de: 'C2', para: 'C6', distanciaUA: 0.46, pulo: 'sem-pulo' },
  { mes: 29, volta: 5, de: 'C6', para: 'C3', distanciaUA: 2.04, pulo: 'intenso' },
  { mes: 30, volta: 5, de: 'C3', para: 'C4', distanciaUA: 1.82, pulo: 'intenso' },

  { mes: 31, volta: 6, de: 'C4', para: 'C1', distanciaUA: 1.27, pulo: 'normal' },
  { mes: 32, volta: 6, de: 'C1', para: 'C5', distanciaUA: 1.05, pulo: 'normal' },
  { mes: 33, volta: 6, de: 'C5', para: 'C2', distanciaUA: 1.73, pulo: 'intenso' },
  { mes: 34, volta: 6, de: 'C2', para: 'C6', distanciaUA: 0.94, pulo: 'normal' },
  { mes: 35, volta: 6, de: 'C6', para: 'C3', distanciaUA: 2.4, pulo: 'intenso' },
  { mes: 36, volta: 6, de: 'C3', para: 'C4', distanciaUA: 1.82, pulo: 'intenso' },
];

/** A rota fixa, lida da própria tabela em vez de escrita duas vezes. */
export const ROTA: CodigoOrbital[] = CORVISSEIA.slice(0, 6).map((t) => t.de);

/**
 * Velocidade média de um trecho, em km/s.
 *
 * Não é um dado à parte: é a distância dividida pelos mesmos 10,5 dias de
 * sempre. É daí que sai a única coisa que o almanaque realmente serve para
 * avisar — que no trecho mais longo Corvus cruza 2,49 UA a 410 km/s, e quem
 * estiver no caminho não vai ter tempo de desviar.
 */
export const velocidade = (distanciaUA: number): number =>
  (distanciaUA * UA_EM_KM) / (DIAS_DE_VIAGEM * 86_400);

/** O trecho que Corvus percorre no fim de um mês da Corvisseia (1 a 36). */
export const trecho = (mesDaCorvisseia: number): Trecho =>
  CORVISSEIA[(mesDaCorvisseia - 1) % CORVISSEIA.length]!;
