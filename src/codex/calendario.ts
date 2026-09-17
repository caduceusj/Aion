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
   * Semi-eixo maior em UA, como o modelo orbital do usuário o fixa.
   *
   * Os três obedecem a terceira lei de Kepler a menos de 1%: ancorando a
   * órbita média em 1 UA, `a ∝ T^⅔` pede 0,630 e 1,3104 para as outras
   * duas, e o modelo traz 0,624 e 1,310. O sistema foi desenhado para
   * fechar com a física, não só com o calendário.
   */
  raioUA: number;
  /** 0 é círculo perfeito. Só Al-Hara tem. */
  excentricidade: number;
  nota: string;
}

export const CICLOS: Record<CicloId, Ciclo> = {
  curto: {
    id: 'curto',
    rotulo: 'O Ciclo Curto',
    periodo: 180,
    forma: 'circular',
    raioUA: 0.624,
    excentricidade: 0,
    nota: 'Al-Hara sozinha, na única órbita perfeitamente circular do sistema.',
  },
  medio: {
    id: 'medio',
    rotulo: 'O Ciclo Médio',
    periodo: 360,
    forma: 'elíptica',
    raioUA: 1.0,
    excentricidade: 0.1,
    nota: 'Fentor, Valoran e Yoso, dispostos em pirâmide — sempre a 120° um do outro.',
  },
  longo: {
    id: 'longo',
    rotulo: 'O Ciclo Longo',
    periodo: 540,
    forma: 'elíptica',
    raioUA: 1.31,
    excentricidade: 0.214,
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
  /**
   * Onde o continente estava no dia 1 do ano 0, em graus de céu a partir do
   * Norte. Os três médios a 120° um do outro; os dois longos em oposição.
   */
  anguloInicial: number;
  /**
   * Para que lado do céu aponta o periélio — o ponto da órbita mais perto de
   * Aion. Sem sentido para Al-Hara, que não tem periélio.
   */
  rumoDoPerielio: number;
  /** A cor com que o modelo orbital desenha este continente. */
  cor: string;
}

export const CONTINENTES: Continente[] = [
  { id: 'al-hara', codigo: 'C1', nome: 'Al-Hara', chave: 'alhara', ciclo: 'curto', anguloInicial: 0, rumoDoPerielio: 0, cor: '#ffb066' },
  { id: 'fentor', codigo: 'C2', nome: 'Fentor', chave: 'fentor', ciclo: 'medio', anguloInicial: 120, rumoDoPerielio: 0, cor: '#6af0c0' },
  { id: 'valoran', codigo: 'C3', nome: 'Valoran', chave: 'valoran', ciclo: 'medio', anguloInicial: 0, rumoDoPerielio: 0, cor: '#7aa8ff' },
  { id: 'yoso', codigo: 'C4', nome: 'Yōso', chave: 'yoso', ciclo: 'medio', anguloInicial: 240, rumoDoPerielio: 0, cor: '#f07ad4' },
  { id: 'vrednost', codigo: 'C5', nome: 'Vrednost', chave: 'vrednost', ciclo: 'longo', anguloInicial: 90, rumoDoPerielio: 134, cor: '#a0e8ff' },
  { id: 'ukanten', codigo: 'C6', nome: 'Ukanten', chave: 'unkanten', ciclo: 'longo', anguloInicial: 270, rumoDoPerielio: 134, cor: '#c0a0ff' },
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

// =====================================================================
// A MECÂNICA DO CÉU
// =====================================================================
//
// Daqui para baixo o calendário deixa de ser tabela e vira geometria. Os
// elementos orbitais são os do modelo do usuário, e todas as posições saem
// deles — nenhuma é desenhada à mão. A convenção é a da rosa dos ventos:
// 0° é o Norte e o ângulo cresce para Leste, que é como o modelo original
// mede o céu.

/** Um ponto do sistema, em UA, visto de cima do plano das órbitas. */
export interface Ponto {
  leste: number;
  norte: number;
}

const rad = (graus: number): number => (graus * Math.PI) / 180;

/** Quantos graus de céu um continente percorre por dia. */
export const grausPorDia = (corpo: Continente): number => 360 / CICLOS[corpo.ciclo].periodo;

/** Onde o continente está na sua órbita num dia, em graus a partir do Norte. */
export const anguloEm = (corpo: Continente, dia: number): number =>
  (((corpo.anguloInicial + dia * grausPorDia(corpo)) % 360) + 360) % 360;

/**
 * A que distância de Aion o continente está num dia.
 *
 * É a equação polar da elipse com o foco na estrela: `r = a(1−e²)/(1+e·cos θ)`,
 * medindo θ a partir do periélio. Numa órbita circular ela devolve sempre o
 * mesmo `a`, que é exatamente o caso de Al-Hara.
 */
export function raioEm(corpo: Continente, dia: number): number {
  const ciclo = CICLOS[corpo.ciclo];
  const e = ciclo.excentricidade;
  if (e === 0) return ciclo.raioUA;
  const theta = rad(anguloEm(corpo, dia) - corpo.rumoDoPerielio);
  return (ciclo.raioUA * (1 - e * e)) / (1 + e * Math.cos(theta));
}

/** Onde o continente está no plano do sistema, em UA. */
export function posicaoEm(corpo: Continente, dia: number): Ponto {
  const r = raioEm(corpo, dia);
  const theta = rad(anguloEm(corpo, dia));
  return { leste: r * Math.sin(theta), norte: r * Math.cos(theta) };
}

/** A distância entre dois continentes num dia, em UA. */
export function distanciaEntre(a: Continente, b: Continente, dia: number): number {
  const pa = posicaoEm(a, dia);
  const pb = posicaoEm(b, dia);
  return Math.hypot(pb.leste - pa.leste, pb.norte - pa.norte);
}

export const perielioUA = (corpo: Continente): number =>
  CICLOS[corpo.ciclo].raioUA * (1 - CICLOS[corpo.ciclo].excentricidade);

export const afelioUA = (corpo: Continente): number =>
  CICLOS[corpo.ciclo].raioUA * (1 + CICLOS[corpo.ciclo].excentricidade);

// =====================================================================
// AS DOZE CONSTELAÇÕES
// =====================================================================

/**
 * O céu de Aion é repartido em doze fatias de 30°, e cada uma tem o seu
 * desenho de estrelas. A fatia para onde um continente aponta é a
 * constelação que ele vê — e é daí que vêm os nomes dos meses.
 *
 * Valoran anda exatamente 1° por dia, porque o seu ano tem 360 dias. Trinta
 * dias, trinta graus, uma fatia inteira: o mês valoriano *é* a constelação
 * que Valoran atravessa. Al-Hara, no dobro da pressa, vê as doze duas vezes
 * por ano; Ukanten e Vrednost levam 45 dias em cada uma.
 *
 * Os traços são o desenho do modelo do usuário, estrela por estrela, em
 * coordenadas locais de −8 a 8.
 */
export interface Constelacao {
  /** 0 a 11, na ordem em que o céu as põe. */
  indice: number;
  nome: string;
  /** Primeiro grau da fatia; ela vai até `de + 30`. */
  de: number;
  /** Pares de pontos ligados por linha: as estrelas e o traço entre elas. */
  tracos: Array<[[number, number], [number, number]]>;
}

const GRAUS_POR_CONSTELACAO = 30;

const TRACOS: Record<string, Array<[[number, number], [number, number]]>> = {
  'Águia': [[[-6, 1], [-2, -2]], [[-2, -2], [0, 2]], [[0, 2], [2, -2]], [[2, -2], [6, 1]], [[0, 2], [0, 6]]],
  Lobo: [[[-4, 5], [-1, -1]], [[-1, -1], [0, -5]], [[0, -5], [1, -1]], [[1, -1], [4, 5]], [[0, -5], [-1, -7]], [[0, -5], [1, -7]]],
  Girassol: [[[0, -6], [0, 6]], [[-5, -3], [5, 3]], [[-5, 3], [5, -3]], [[-3, -5], [3, 5]], [[-3, 5], [3, -5]]],
  Lebre: [[[-3, 4], [-1, -2]], [[-1, -2], [-1, -6]], [[-1, -2], [1, -6]], [[-1, -2], [3, 4]], [[-3, 4], [3, 4]]],
  'Lítope': [[[0, 6], [0, -2]], [[0, -2], [-3, -5]], [[0, -2], [3, -5]], [[-3, -5], [-1, -7]], [[3, -5], [1, -7]]],
  Cavalo: [[[-5, 5], [-2, 0]], [[-2, 0], [0, -4]], [[0, -4], [3, -6]], [[0, -4], [2, 1]], [[2, 1], [5, 5]]],
  Baleia: [[[-6, 0], [0, -3]], [[0, -3], [6, 0]], [[6, 0], [3, 3]], [[3, 3], [-4, 3]], [[-4, 3], [-6, 0]], [[6, 0], [8, -2]]],
  'Árvore': [[[0, 6], [0, -1]], [[0, -1], [-4, -5]], [[0, -1], [4, -5]], [[0, 2], [-3, 5]], [[0, 2], [3, 5]], [[0, -4], [0, -7]]],
  Felino: [[[-4, 5], [-2, 1]], [[-2, 1], [0, -3]], [[0, -3], [2, 1]], [[2, 1], [4, 5]], [[-2, 1], [-3, -2]], [[2, 1], [3, -2]]],
  Roedor: [[[-4, 3], [-1, 0]], [[-1, 0], [0, -3]], [[0, -3], [1, 0]], [[1, 0], [4, 3]], [[0, -3], [-2, -5]], [[0, -3], [2, -5]]],
  Serpente: [[[-6, 3], [-3, -2]], [[-3, -2], [0, 3]], [[0, 3], [3, -2]], [[3, -2], [6, 3]]],
  Corvo: [[[-6, -2], [-1, 1]], [[-1, 1], [0, -3]], [[0, -3], [1, 1]], [[1, 1], [6, -2]], [[0, 1], [0, 5]]],
};

/** Na ordem do céu, que é a ordem dos meses. */
export const CONSTELACOES: Constelacao[] = MESES.map((m, indice) => ({
  indice,
  nome: m.constelacao,
  de: indice * GRAUS_POR_CONSTELACAO,
  tracos: TRACOS[m.constelacao] ?? [],
}));

/** A constelação de uma fatia do céu. */
export const constelacaoNoAngulo = (graus: number): Constelacao =>
  CONSTELACOES[
    Math.floor(((((graus % 360) + 360) % 360) / GRAUS_POR_CONSTELACAO)) % MESES_DO_ANO
  ]!;

/** Para que constelação um continente aponta num dia. */
export const constelacaoVisivel = (corpo: Continente, dia: number): Constelacao =>
  constelacaoNoAngulo(anguloEm(corpo, dia));

// =====================================================================
// CORVUS, DIA A DIA
// =====================================================================

export interface EstadoDaLua {
  /** Parada sobre um continente, ou a caminho do próximo. */
  estado: 'parada' | 'viagem';
  em: CodigoOrbital;
  para: CodigoOrbital;
  /** 0 a 1 dentro da etapa em que ela está. */
  progresso: number;
}

/** Onde Corvus está e o que está fazendo, num dia qualquer da Corvisseia. */
export function estadoDaLua(dia: number): EstadoDaLua {
  const noCiclo = ((dia % DIAS_DA_VOLTA) + DIAS_DA_VOLTA) % DIAS_DA_VOLTA;
  const indice = Math.floor(noCiclo / DIAS_DO_MES) % ROTA.length;
  const noTrecho = noCiclo - indice * DIAS_DO_MES;
  const em = ROTA[indice]!;
  const para = ROTA[(indice + 1) % ROTA.length]!;
  return noTrecho < DIAS_DE_ESTADIA
    ? { estado: 'parada', em, para, progresso: noTrecho / DIAS_DE_ESTADIA }
    : {
        estado: 'viagem',
        em,
        para,
        progresso: (noTrecho - DIAS_DE_ESTADIA) / DIAS_DE_VIAGEM,
      };
}

/**
 * Onde Corvus está no plano do sistema.
 *
 * Parada, ela orbita de perto o continente onde pousou. Em viagem, descreve
 * um arco entre os dois — uma curva, não uma reta, porque nada que se move a
 * centenas de km/s muda de rumo em ângulo reto.
 */
export function posicaoDaLua(dia: number): Ponto {
  const estado = estadoDaLua(dia);
  const origem = posicaoEm(continentePorCodigo(estado.em), dia);

  if (estado.estado === 'parada') {
    const giro = dia * 0.6;
    const orbe = 0.075;
    return { leste: origem.leste + orbe * Math.cos(giro), norte: origem.norte + orbe * Math.sin(giro) };
  }

  const destino = posicaoEm(continentePorCodigo(estado.para), dia);
  // Suaviza a partida e a chegada: ela acelera e freia, não salta.
  const f = estado.progresso * estado.progresso * (3 - 2 * estado.progresso);
  const dl = destino.leste - origem.leste;
  const dn = destino.norte - origem.norte;
  const comprimento = Math.hypot(dl, dn) || 1;
  const arco = 0.12 * comprimento;
  const cl = (origem.leste + destino.leste) / 2 - (dn / comprimento) * arco;
  const cn = (origem.norte + destino.norte) / 2 + (dl / comprimento) * arco;
  return {
    leste: (1 - f) * (1 - f) * origem.leste + 2 * (1 - f) * f * cl + f * f * destino.leste,
    norte: (1 - f) * (1 - f) * origem.norte + 2 * (1 - f) * f * cn + f * f * destino.norte,
  };
}

/** O dia da Corvisseia (0 a 1079) em que um mês começa. */
export const inicioDoMes = (mesDaCorvisseia: number): number =>
  ((mesDaCorvisseia - 1) % CORVISSEIA.length) * DIAS_DO_MES;
