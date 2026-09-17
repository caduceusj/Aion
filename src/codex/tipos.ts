/**
 * O Códice — contratos dos verbetes.
 *
 * A lore não é guardada como HTML pronto, e sim como dados. É o que permite
 * buscar, filtrar por era, e — o que importa mais — ligar um verbete ao
 * outro: cada menção a uma casa, pessoa ou lugar vira um link navegável.
 *
 * Toda prosa passa por `renderizarProsa`, que entende três marcações:
 *
 *   [[chave]]           vira um link com o título do verbete
 *   [[chave|texto]]     vira um link com o texto escolhido
 *   *ênfase*            vira itálico
 *
 * Um `[[...]]` apontando para chave inexistente é erro de teste, não um link
 * quebrado em produção — ver `codex/integridade.test.ts`.
 */

/**
 * A camada de onde a lore vem.
 *
 * O Códice guarda dois corpos de conhecimento que não têm o mesmo estatuto, e
 * fingir que têm é o que deixaria tudo confuso:
 *
 *   mundo — o que o mundo registrou sobre si: a crônica, os mapas, os livros.
 *           Prosa em inglês, na voz de quem escreveu cada documento.
 *   mesa  — a campanha acontecendo agora, com gente de verdade jogando.
 *           Prosa em português, na voz de quem está à mesa.
 */
export type CamadaId = 'mundo' | 'mesa';

/** O documento de onde um verbete saiu. */
export type FonteId =
  | 'anais'
  | 'gazeta'
  | 'andari'
  | 'biblioteca'
  | 'almanaque'
  | 'wiki'
  | 'notas';

export interface Fonte {
  id: FonteId;
  camada: CamadaId;
  /** Curto, para a etiqueta no alto do verbete. */
  rotulo: string;
  /** Uma linha dizendo o que é o documento. */
  nota: string;
}

/**
 * As sete procedências, e o que cada uma pode saber.
 *
 * Isto é o que evita a contradição virar erro: as Anais fecham em 1570 e não
 * conhecem o nome de um só dos Doze; o almanaque conhece as órbitas mas não
 * conhece política; a wiki conhece fichas. Quando duas discordam, o verbete
 * mostra as duas e diz de onde cada uma veio.
 */
export const FONTES: Record<FonteId, Fonte> = {
  anais: {
    id: 'anais',
    camada: 'mundo',
    rotulo: 'As Anais',
    nota: 'A crônica de Maedrin Rimors, erudito dos Arquivos Imperiais, fechada no ano 1570.',
  },
  gazeta: {
    id: 'gazeta',
    camada: 'mundo',
    rotulo: 'A Gazeta',
    nota: 'O mapa de 1575 — os lugares que o cartógrafo nomeou e a crônica não alcançou.',
  },
  andari: {
    id: 'andari',
    camada: 'mundo',
    rotulo: 'O Ciclo de Andari',
    nota: 'O relato élfico de Andari, que corrige as Anais em cinco pontos.',
  },
  biblioteca: {
    id: 'biblioteca',
    camada: 'mundo',
    rotulo: 'A Biblioteca',
    nota: 'Os livros do Tear Prateado: a Shadowfell, o Grande Pilar, os ritos dos Doze.',
  },
  almanaque: {
    id: 'almanaque',
    camada: 'mundo',
    rotulo: 'O Almanaque',
    nota: 'O calendário dos viajantes do vazio: as órbitas, os meses e a rota de Corvus.',
  },
  wiki: {
    id: 'wiki',
    camada: 'mesa',
    rotulo: 'A Wiki',
    nota: 'AION — RPG: The Complete Wiki, do próprio mestre: fichas, backstories e arcos.',
  },
  notas: {
    id: 'notas',
    camada: 'mesa',
    rotulo: 'As Notas',
    nota: 'As anotações de sessão do mestre, fora da wiki — o que foi dito na mesa.',
  },
};

/** Gaveta do códice. A ordem aqui é a ordem da navegação. */
export type CategoriaId =
  | 'era'
  | 'pessoa'
  | 'casa'
  | 'lugar'
  // O céu: o sistema, as órbitas e o calendário que saiu delas. Fica ao lado
  // dos lugares porque é isso que é — o lugar onde os lugares estão.
  | 'ceu'
  | 'reliquia'
  | 'evento'
  | 'poder'
  // As duas gavetas da mesa de verdade, importadas da wiki do Notion.
  // Separadas das de cima de propósito: as Anais são um documento do mundo,
  // fechado em 1570; o elenco é gente viva, jogando agora.
  | 'jogador'
  | 'npc';

/** Brasões e glifos disponíveis em `heraldica.tsx`. */
export type BrasaoId =
  // escudos das oito casas
  | 'herrys'
  | 'draco'
  | 'bellias'
  | 'sturm'
  | 'deallus'
  | 'vinco'
  | 'orhys'
  | 'keaton'
  // glifos das eras
  | 'dragao'
  | 'sol'
  | 'eclipse'
  | 'aurora'
  | 'fumaca'
  // pessoas
  | 'coroa'
  | 'martelo'
  | 'folha'
  | 'asa'
  | 'serpente-imperial'
  // relíquias e lugares
  | 'lamina'
  | 'lanca'
  | 'nau'
  | 'cascata'
  | 'cidadela'
  | 'montanha'
  | 'porto'
  | 'vazio'
  // conceitos
  | 'estrela'
  | 'serpente'
  | 'mao'
  | 'templo';

/** Uma linha da ficha lateral: "Sangue — Celestial". */
export interface FatoDaFicha {
  rotulo: string;
  valor: string;
}

/** Um bloco do verbete. Sem título, é o corpo de abertura. */
export interface SecaoDoVerbete {
  titulo?: string;
  paragrafos: string[];
}

/**
 * Um verbete do códice.
 *
 * `chave` é o endereço permanente: entra na URL, nos links de prosa e nos
 * relacionados. Mudar uma chave quebra links — trate como identificador.
 */
export interface Verbete {
  chave: string;
  titulo: string;
  /** "The Golden Tyrant", "The Calamity". Aparece sob o título. */
  epiteto?: string;
  categoria: CategoriaId;
  /** Uma frase. Alimenta a busca, os cartões e a prévia dos links. */
  resumo: string;
  brasao?: BrasaoId;
  /** Datas, sangue, sede, condição — o quadro lateral. */
  ficha: FatoDaFicha[];
  secoes: SecaoDoVerbete[];
  /** Citação em destaque, no tom do cronista. */
  epigrafe?: string;
  /** Chaves de outros verbetes — vira a barra "Ver também". */
  relacionados: string[];
  /** Chaves de eras em que o verbete aparece. Alimenta o filtro por época. */
  eras: string[];
  /** Grafias e apelidos que a busca também deve encontrar. */
  alcunhas?: string[];
  /** Só para eras: intervalo exibido na linha do tempo. */
  periodo?: string;
  /** Só para eras: ordem cronológica. */
  ordem?: number;
}

/**
 * Um verbete já no acervo.
 *
 * A procedência não é escrita verbete a verbete: o corpus a atribui por
 * arquivo, porque é o arquivo que corresponde ao documento. Assim nenhum
 * verbete pode mentir sobre de onde veio, e ninguém precisa repetir a fonte
 * mil vezes na mão.
 */
export type VerbeteNoAcervo = Verbete & { fonte: FonteId };

export interface Categoria {
  id: CategoriaId;
  /** Plural, como aparece na navegação. */
  rotulo: string;
  /** Singular, para o cabeçalho do verbete. */
  singular: string;
  /** Uma linha explicando a gaveta. */
  nota: string;
}

/** As gavetas, na ordem em que aparecem na lateral. */
export const CATEGORIAS: Categoria[] = [
  {
    id: 'era',
    rotulo: 'Eras',
    singular: 'Era',
    nota: 'As cinco idades do continente, do primeiro rei ao tirano de hoje.',
  },
  {
    id: 'pessoa',
    rotulo: 'Personagens',
    singular: 'Personagem',
    nota: 'Reis, heróis e monstros cujos nomes a crônica preservou.',
  },
  {
    id: 'casa',
    rotulo: 'Casas',
    singular: 'Casa',
    nota: 'As oito casas nobres, seu sangue, sua sede e sua mágoa.',
  },
  {
    id: 'lugar',
    rotulo: 'Lugares',
    singular: 'Lugar',
    nota: 'Domínios de Valoran, e o que existe além do Mar Astral.',
  },
  {
    id: 'ceu',
    rotulo: 'O Céu',
    singular: 'Céu',
    nota: 'As três órbitas, as doze constelações, a rota de Corvus e o calendário que saiu delas.',
  },
  {
    id: 'reliquia',
    rotulo: 'Relíquias',
    singular: 'Relíquia',
    nota: 'Dádivas divinas, feridas planares e monumentos.',
  },
  {
    id: 'evento',
    rotulo: 'Eventos',
    singular: 'Evento',
    nota: 'As guerras, pragas e catástrofes que viraram as eras.',
  },
  {
    id: 'jogador',
    rotulo: 'Jogadores',
    singular: 'Jogador',
    nota: 'A party de Aion — quem senta à mesa, e quem já sentou.',
  },
  {
    id: 'npc',
    rotulo: 'NPCs',
    singular: 'NPC',
    nota: 'Aliados, neutros e inimigos que a campanha cruzou.',
  },
  {
    id: 'poder',
    rotulo: 'Potências',
    singular: 'Potência',
    nota: 'Deuses, igrejas, hordas e cortes — quem move o tabuleiro.',
  },
];
