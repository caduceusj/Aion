/**
 * O corpus do Códice: junta os verbetes, indexa e busca.
 *
 * Os dados vivem em `valoran/`, um arquivo por categoria. Aqui eles viram
 * um índice por chave — que é o que transforma um monte de texto em um wiki:
 * qualquer verbete alcança qualquer outro em um salto.
 */

import type { CategoriaId, Verbete } from './tipos';
import { ERAS } from './valoran/eras';
import { PERSONAGENS } from './valoran/personagens';
import { CASAS } from './valoran/casas';
import { LUGARES } from './valoran/lugares';
import { RELIQUIAS } from './valoran/reliquias';
import { EVENTOS } from './valoran/eventos';
import { PODERES } from './valoran/poderes';
import { CARTOGRAFIA, COSTURA_DO_MAPA } from './valoran/cartografia';
import { ANDARI } from './valoran/andari';

const BRUTOS: Verbete[] = [
  ...ERAS,
  ...PERSONAGENS,
  ...CASAS,
  ...LUGARES,
  ...RELIQUIAS,
  ...EVENTOS,
  ...PODERES,
  // A cartografia entra por último: são os lugares que só o mapa de 1575
  // nomeia, e que a crônica de 1570 não alcançou.
  ...CARTOGRAFIA,
  // O ciclo de Andari veio depois das Anais e corrige vários pontos delas.
  ...ANDARI,
];

/**
 * Todos os verbetes, já costurados ao mapa.
 *
 * A costura acrescenta ao "ver também" de cada região os assentamentos que o
 * cartógrafo pôs dentro dela — sem tocar em uma vírgula da prosa da crônica.
 */
export const VERBETES: Verbete[] = BRUTOS.map((entrada) => {
  const vizinhos = COSTURA_DO_MAPA[entrada.chave];
  if (!vizinhos) return entrada;
  const juntos = [...entrada.relacionados];
  for (const chave of vizinhos) if (!juntos.includes(chave)) juntos.push(chave);
  return { ...entrada, relacionados: juntos };
});

const POR_CHAVE = new Map<string, Verbete>(VERBETES.map((v) => [v.chave, v]));

export function verbete(chave: string): Verbete | undefined {
  return POR_CHAVE.get(chave);
}

export function existe(chave: string): boolean {
  return POR_CHAVE.has(chave);
}

/**
 * Títulos que mais de um verbete usa.
 *
 * "Firen" é a lâmina sagrada e o reino que ela nomeou; "Sindaren" é o mar
 * roubado e a região que sobrou. Onde o nome não basta, o índice mostra a
 * gaveta ao lado — que é o que um wiki faz em vez de escolher por você.
 */
const HOMONIMOS = new Set(
  BRUTOS.map((v) => v.titulo).filter((titulo, i, todos) => todos.indexOf(titulo) !== i),
);

export function tituloAmbiguo(titulo: string): boolean {
  return HOMONIMOS.has(titulo);
}

/** Verbetes de uma gaveta. Eras saem em ordem cronológica; o resto, alfabética. */
export function porCategoria(categoria: CategoriaId): Verbete[] {
  const lista = VERBETES.filter((v) => v.categoria === categoria);
  if (categoria === 'era') return lista.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  return lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'en'));
}

/** As cinco eras em ordem — a linha do tempo da abertura. */
export const LINHA_DO_TEMPO: Verbete[] = porCategoria('era');

/**
 * Quem aponta para este verbete.
 *
 * Um wiki honesto mostra os dois sentidos do link: além do "ver também" que
 * o autor escreveu, vale saber quem *cita* você sem que você cite de volta.
 */
export function referenciam(chave: string): Verbete[] {
  return VERBETES.filter(
    (v) =>
      v.chave !== chave &&
      (v.relacionados.includes(chave) ||
        v.secoes.some((s) => s.paragrafos.some((p) => p.includes(`[[${chave}`)))),
  );
}

// ------------------------------------------------------------------- busca

/** Sem acento, sem caixa: "Hōseki" e "hoseki" acham a mesma coisa. */
function dobrar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

interface Indexado {
  verbete: Verbete;
  titulo: string;
  alcunhas: string;
  resumo: string;
  corpo: string;
}

const INDICE: Indexado[] = VERBETES.map((v) => ({
  verbete: v,
  titulo: dobrar(v.titulo),
  alcunhas: dobrar([v.epiteto ?? '', ...(v.alcunhas ?? [])].join(' ')),
  resumo: dobrar(v.resumo),
  // A prosa entra sem a marcação, senão "casa-draco" viraria resultado de
  // busca por "casa" em todo verbete que apenas linka para lá.
  corpo: dobrar(
    v.secoes
      .flatMap((s) => [s.titulo ?? '', ...s.paragrafos])
      .join(' ')
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
      .replace(/\[\[([^\]]+)\]\]/g, ' '),
  ),
}));

export interface Achado {
  verbete: Verbete;
  /** Maior é melhor. Só para ordenar. */
  peso: number;
  /** Onde casou, para a interface poder dizer por quê. */
  origem: 'titulo' | 'alcunha' | 'resumo' | 'corpo';
}

/**
 * Busca por relevância.
 *
 * A ordem importa mais que o algoritmo: quem digita "keaton" quer a Casa
 * Keaton em primeiro lugar, não os seis verbetes que a mencionam.
 */
export function buscar(consulta: string, limite = 40): Achado[] {
  const termo = dobrar(consulta.trim());
  if (termo.length === 0) return [];

  const achados: Achado[] = [];
  for (const item of INDICE) {
    if (item.titulo.startsWith(termo)) {
      achados.push({ verbete: item.verbete, peso: 100 - item.titulo.length, origem: 'titulo' });
    } else if (item.titulo.includes(termo)) {
      achados.push({ verbete: item.verbete, peso: 70, origem: 'titulo' });
    } else if (item.alcunhas.includes(termo)) {
      achados.push({ verbete: item.verbete, peso: 55, origem: 'alcunha' });
    } else if (item.resumo.includes(termo)) {
      achados.push({ verbete: item.verbete, peso: 35, origem: 'resumo' });
    } else if (item.corpo.includes(termo)) {
      achados.push({ verbete: item.verbete, peso: 12, origem: 'corpo' });
    }
  }

  return achados.sort((a, b) => b.peso - a.peso || a.verbete.titulo.localeCompare(b.verbete.titulo)).slice(0, limite);
}
