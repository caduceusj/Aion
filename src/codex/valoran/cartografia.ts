/**
 * A cartografia de Valoran — o mapa de 1575 DA.
 *
 * As duas pranchas do usuário (uma limpa, outra rotulada com as regiões)
 * são o mesmo desenho; o códice as trata como camadas alternáveis.
 *
 * Ponto importante para quem for mexer aqui: o mapa é de 1575 e as Anais
 * fecham em 1570. O mapa nomeia lugares que a crônica nunca menciona —
 * Caryn, Viridier, Dras, Nova Firen, Andari e outros. Não foi inventado
 * nenhum enredo para eles. Cada verbete diz exatamente isso: o cartógrafo
 * escreveu o nome, o cronista não explicou. São ganchos abertos para o
 * Mestre preencher, e não lacunas por descuido.
 *
 * As coordenadas são normalizadas (0..1) sobre a imagem, então continuam
 * valendo em qualquer zoom ou tamanho de tela.
 */

import type { Verbete } from '../tipos';

/** Um ponto clicável sobre o mapa. */
export interface PontoDoMapa {
  /** Chave do verbete que ele abre. */
  chave: string;
  rotulo: string;
  /** 0..1 na largura da imagem. */
  x: number;
  /** 0..1 na altura da imagem. */
  y: number;
  /** Cidades ganham marcador; regiões são áreas rotuladas. */
  tipo: 'assentamento' | 'regiao' | 'acidente';
}

export const PONTOS_DO_MAPA: PontoDoMapa[] = [
  // --- assentamentos ---
  { chave: 'eshmed', rotulo: 'Eshmed', x: 0.291, y: 0.128, tipo: 'assentamento' },
  { chave: 'varna', rotulo: 'Varna', x: 0.78, y: 0.128, tipo: 'assentamento' },
  { chave: 'nova-firen', rotulo: 'Nova Firen', x: 0.5, y: 0.228, tipo: 'assentamento' },
  { chave: 'jappi', rotulo: 'Jappi', x: 0.619, y: 0.253, tipo: 'assentamento' },
  { chave: 'velha-firen', rotulo: 'Velha Firen', x: 0.425, y: 0.288, tipo: 'assentamento' },
  { chave: 'raihad', rotulo: 'Raihad', x: 0.632, y: 0.426, tipo: 'assentamento' },
  { chave: 'ohdartes', rotulo: 'Ohdartes', x: 0.748, y: 0.515, tipo: 'assentamento' },
  { chave: 'gerren', rotulo: 'Gerren', x: 0.326, y: 0.567, tipo: 'assentamento' },
  { chave: 'rhydash', rotulo: 'Rhydash', x: 0.632, y: 0.62, tipo: 'assentamento' },
  { chave: 'luctos', rotulo: 'Luctos', x: 0.485, y: 0.642, tipo: 'assentamento' },
  { chave: 'erbronn', rotulo: 'Erbronn', x: 0.502, y: 0.824, tipo: 'assentamento' },
  { chave: 'andari', rotulo: 'Andari', x: 0.49, y: 0.909, tipo: 'assentamento' },

  // --- regiões (rotuladas só na segunda prancha) ---
  { chave: 'endor', rotulo: 'Endor', x: 0.229, y: 0.313, tipo: 'regiao' },
  { chave: 'aranti', rotulo: 'Aranti', x: 0.783, y: 0.217, tipo: 'regiao' },
  { chave: 'caryn', rotulo: 'Caryn', x: 0.509, y: 0.327, tipo: 'regiao' },
  { chave: 'viridier', rotulo: 'Viridier', x: 0.55, y: 0.45, tipo: 'regiao' },
  { chave: 'khorvari', rotulo: 'Khorvari', x: 0.304, y: 0.634, tipo: 'regiao' },
  { chave: 'ashara', rotulo: 'Ashara', x: 0.47, y: 0.72, tipo: 'regiao' },
  { chave: 'dras', rotulo: 'Dras', x: 0.8, y: 0.63, tipo: 'regiao' },
  { chave: 'ershen', rotulo: 'Ershen', x: 0.3, y: 0.82, tipo: 'regiao' },
  { chave: 'sindaren', rotulo: 'Sindaren', x: 0.651, y: 0.925, tipo: 'regiao' },

  // --- acidentes nomeados ---
  { chave: 'descanso-dos-herois', rotulo: "Heroes' Rest", x: 0.394, y: 0.187, tipo: 'acidente' },
  { chave: 'vale-do-morto', rotulo: "Dead Man's Valley", x: 0.84, y: 0.32, tipo: 'acidente' },
];

/** O aviso que abre todo verbete que só existe no mapa. */
const SO_NO_MAPA =
  'The cartographers of 1575 set this name upon the chart. The Annals, sealed five ' +
  'years earlier, never once explain it.';

const fichaDoMapa = (tipo: string, regiao: string): Verbete['ficha'] => [
  { rotulo: 'Kind', valor: tipo },
  { rotulo: 'Region', valor: regiao },
  { rotulo: 'Source', valor: 'Map of 1575 DA' },
  { rotulo: 'In the Annals', valor: 'Unmentioned' },
];

/**
 * Lugares que o mapa nomeia e a crônica cala.
 *
 * Curtos de propósito. Prometer detalhe que não existe seria pior que
 * admitir o vazio — e o vazio, aqui, é convite.
 */
export const CARTOGRAFIA: Verbete[] = [
  {
    chave: 'nova-firen',
    titulo: 'Nova Firen',
    epiteto: 'The Seat That Followed',
    categoria: 'lugar',
    resumo: 'The crowned city of the northern plateau, drawn as the greatest seat on the chart of 1575.',
    brasao: 'herrys',
    ficha: fichaDoMapa('Capital city', 'Caryn'),
    secoes: [
      {
        paragrafos: [
          'Upon the map of 1575 the northern plateau carries a crowned city larger than any other mark on the chart, and the cartographer names it *Nova Firen* — the new Firen. A little to the south, smaller and unwalled, sits [[velha-firen|Velha Firen]], the old.',
          'The chronicle knows only [[firen]], the realm that [[arran-herrys]] forged and [[ayren-herrys-ii]] raised into the [[imperio-aer-firen]]. That there should now be a *new* Firen and an *old* one is the map speaking past the end of the book.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          SO_NO_MAPA,
          'When the seat moved, why it moved, and what became of the elder city — none of it is written. The chart gives the new capital a crown and the old one a plain roof, and leaves the reader to draw the conclusion he dares.',
        ],
      },
    ],
    relacionados: ['velha-firen', 'firen', 'casa-herrys', 'caryn'],
    eras: ['era-moderna'],
    alcunhas: ['New Firen'],
  },
  {
    chave: 'velha-firen',
    titulo: 'Velha Firen',
    epiteto: 'The Elder Seat',
    categoria: 'lugar',
    resumo: 'The old Firen, drawn small and uncrowned a little south of the city that took its name.',
    brasao: 'cidadela',
    ficha: fichaDoMapa('Settlement', 'Caryn'),
    secoes: [
      {
        paragrafos: [
          'A modest mark on the 1575 chart, set below the crowned bulk of [[nova-firen]] and given no wall, no tower and no banner — only a roof and a name that once meant the whole north.',
          'If this is the Firen of [[arran-herrys]], where the sacred blade [[lamina-firen|Firen]] first fell into a mortal hand, then the map records a demotion that the chronicle never reports.',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['nova-firen', 'firen', 'lamina-firen', 'arran-herrys'],
    eras: ['era-moderna'],
    alcunhas: ['Old Firen'],
  },
  {
    chave: 'caryn',
    titulo: 'Caryn',
    categoria: 'lugar',
    resumo: 'The great northern province of the 1575 map, holding both Firens and the plateau between them.',
    brasao: 'coroa',
    ficha: fichaDoMapa('Province', 'The north'),
    secoes: [
      {
        paragrafos: [
          'The chart letters *Caryn* across the whole northern heart of the continent — the plateau that holds [[nova-firen]], [[velha-firen]] and the pass at [[jappi]]. By extent it is the largest named region on the map.',
          'The chronicle calls this country [[firen]] and nothing else. Whether Caryn is a newer name for the same ground, a province carved within it, or something the crown created after the Annals were sealed, the archive does not say.',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['firen', 'nova-firen', 'velha-firen', 'casa-herrys'],
    eras: ['era-moderna'],
  },
  {
    chave: 'viridier',
    titulo: 'Viridier',
    epiteto: 'The Green Country',
    categoria: 'lugar',
    resumo: 'A forested province lettered across the eastern woodlands, unknown to the chronicle.',
    brasao: 'folha',
    ficha: fichaDoMapa('Province', 'The eastern woods'),
    secoes: [
      {
        paragrafos: [
          'East of the plateau the cartographer has drawn a broad belt of forest and named it *Viridier*, with [[raihad]] standing at its heart where the great river runs.',
          'The name shares its root with the Verdant War — [[guerra-verdejante]] — fought against the [[corte-seelie]] beyond the [[mar-astral]]. Whether that is descent, homage, or the coincidence of a green country being called green, no page here decides.',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['raihad', 'guerra-verdejante', 'ashara', 'aranti'],
    eras: ['era-moderna'],
  },
  {
    chave: 'dras',
    titulo: 'Dras',
    categoria: 'lugar',
    resumo: 'The spined eastern country of pale crags, lettered down the length of the map’s right edge.',
    brasao: 'montanha',
    ficha: fichaDoMapa('Province', 'The eastern crags'),
    secoes: [
      {
        paragrafos: [
          'Down the eastern edge of the chart, through a forest of pale stone spines unlike any other relief on the map, the cartographer letters *Dras*. [[ohdartes]] is drawn among the crags.',
          'These are the heights from which the giant-blooded came — the warriors who repelled the [[yuan-ti]] and were raised as [[casa-sturm]]. The chronicle calls them only [[montanhas-orientais|the eastern mountains]] and gives their country no name at all.',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['montanhas-orientais', 'casa-sturm', 'ohdartes', 'yuan-ti'],
    eras: ['era-moderna'],
  },
  {
    chave: 'eshmed',
    titulo: 'Eshmed',
    categoria: 'lugar',
    resumo: 'A walled seat high in the north-western mountains of Endor, on the chart of 1575.',
    brasao: 'draco',
    ficha: fichaDoMapa('Fortified seat', 'Endor'),
    secoes: [
      {
        paragrafos: [
          'Drawn among the peaks of the north-west, within the shield-lands of [[endor]] that [[casa-draco]] holds against the sea.',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['endor', 'casa-draco', 'gerren'],
    eras: ['era-moderna'],
  },
  {
    chave: 'varna',
    titulo: 'Varna',
    categoria: 'lugar',
    resumo: 'A mountain seat in the far north-east, set among the high peaks of Aranti.',
    brasao: 'bellias',
    ficha: fichaDoMapa('Fortified seat', 'Aranti'),
    secoes: [
      {
        paragrafos: [
          'The northernmost of the eastern seats, ringed by the tallest relief the cartographer drew, within [[aranti]] — the realm granted to [[casa-bellias]].',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['aranti', 'casa-bellias', 'vale-do-morto'],
    eras: ['era-moderna'],
  },
  {
    chave: 'jappi',
    titulo: 'Jappi',
    categoria: 'lugar',
    resumo: 'A small open post at the pass where the northern plateau meets the eastern mountains.',
    brasao: 'porto',
    ficha: fichaDoMapa('Waypost', 'Between Caryn and Aranti'),
    secoes: [
      {
        paragrafos: [
          'Alone among the marks of the chart, Jappi is drawn unwalled — a roof and a river crossing where [[caryn]] gives way to the mountains of [[aranti]]. A gate, or a toll, or a village that never needed a wall.',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['caryn', 'aranti', 'nova-firen'],
    eras: ['era-moderna'],
  },
  {
    chave: 'raihad',
    titulo: 'Raihad',
    categoria: 'lugar',
    resumo: 'A river seat in the heart of the Viridier woods, where the great road crosses the water.',
    brasao: 'orhys',
    ficha: fichaDoMapa('Fortified seat', 'Viridier'),
    secoes: [
      {
        paragrafos: [
          'Set where the forest of [[viridier]] meets the river that runs the length of the continent, on the same road that carries south to [[rhydash]].',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['viridier', 'rhydash', 'ashara'],
    eras: ['era-moderna'],
  },
  {
    chave: 'ohdartes',
    titulo: 'Ohdartes',
    categoria: 'lugar',
    resumo: 'A seat set among the pale spires of Dras, in the eastern crags.',
    brasao: 'sturm',
    ficha: fichaDoMapa('Fortified seat', 'Dras'),
    secoes: [
      {
        paragrafos: [
          'Drawn within the stone spines of [[dras]], the country of the giant-blooded from whom [[casa-sturm]] descends.',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['dras', 'casa-sturm', 'montanhas-orientais'],
    eras: ['era-moderna'],
  },
  {
    chave: 'gerren',
    titulo: 'Gerren',
    categoria: 'lugar',
    resumo: 'A seat on the western shore, above the pale shallows that edge the Khorvari coast.',
    brasao: 'vinco',
    ficha: fichaDoMapa('Fortified seat', 'Khorvari'),
    secoes: [
      {
        paragrafos: [
          'The chart sets Gerren above a stretch of pale water along [[khorvari|the Khorvari Coast]] — the shore once raided by the [[horda-da-mao-vermelha]] and now held by [[casa-vinco]].',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['khorvari', 'casa-vinco', 'horda-da-mao-vermelha'],
    eras: ['era-moderna'],
  },
  {
    chave: 'erbronn',
    titulo: 'Erbronn',
    categoria: 'lugar',
    resumo: 'A seat deep in the southern swamp-forest of Ershen.',
    brasao: 'sturm',
    ficha: fichaDoMapa('Fortified seat', 'Ershen'),
    secoes: [
      {
        paragrafos: [
          'Set among the dense southern woods of [[ershen]], the swamplands granted to [[casa-sturm]] for repelling the [[yuan-ti]].',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['ershen', 'casa-sturm', 'andari'],
    eras: ['era-moderna'],
  },
  {
    chave: 'andari',
    titulo: 'Andari',
    epiteto: 'The Last Harbour',
    categoria: 'lugar',
    resumo: 'The southern port, drawn with a ship at the very rim of the world.',
    brasao: 'porto',
    ficha: fichaDoMapa('Port', 'The southern rim'),
    secoes: [
      {
        paragrafos: [
          'At the southern edge of the chart, past [[erbronn]] and the swamps of [[ershen]], the cartographer has drawn a harbour with a vessel at its quay — the only ship on the whole map.',
          'Below it the lettering reads [[sindaren]]. The realm that a cabal of archmages tore from the world in [[roubo-de-sindaren]] lies off that shore, and its waters still pour into the [[mar-astral]] by way of the [[cascata-eterna]]. What a ship does at the last harbour before a void, the chart does not explain.',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['sindaren', 'cascata-eterna', 'ershen', 'naus-oraculo'],
    eras: ['era-moderna'],
  },
  {
    chave: 'descanso-dos-herois',
    titulo: "Heroes' Rest",
    categoria: 'lugar',
    resumo: 'A named place in the northern highlands, lettered on the map and nowhere else.',
    brasao: 'estrela',
    ficha: fichaDoMapa('Named ground', 'Caryn'),
    secoes: [
      {
        paragrafos: [
          'In the highlands west of [[nova-firen]] the chart letters *Heroes’ Rest* across open ground — no wall, no roof, no settlement. A name given to a place rather than to a holding.',
          'Four heroes ended the [[era-mil-reis|Age of a Thousand Kings]] when they felled [[dartharion]]: [[ayren-herrys-i]], [[darron-alabaster]], [[sellias-delios]] and [[rhogar]]. The archive records no burial for any of them.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          SO_NO_MAPA,
          'Whose rest it is, and whether the name is memorial or warning, is not written anywhere in this codex.',
        ],
      },
    ],
    relacionados: ['queda-de-dartharion', 'ayren-herrys-i', 'rhogar', 'nova-firen'],
    eras: ['era-moderna'],
  },
  {
    chave: 'vale-do-morto',
    titulo: "Dead Man's Valley",
    categoria: 'lugar',
    resumo: 'A valley named on the map alone, cutting through the north-eastern mountains of Aranti.',
    brasao: 'eclipse',
    ficha: fichaDoMapa('Named ground', 'Aranti'),
    secoes: [
      {
        paragrafos: [
          'A cleft through the north-eastern range of [[aranti]], east of [[varna]], which the cartographer thought worth naming though he drew no settlement in it.',
        ],
      },
      { titulo: 'What the Record Does Not Say', paragrafos: [SO_NO_MAPA] },
    ],
    relacionados: ['aranti', 'varna', 'casa-bellias'],
    eras: ['era-moderna'],
  },
];

/**
 * A costura entre a crônica e o mapa.
 *
 * Os verbetes da crônica foram escritos antes das pranchas chegarem, e não
 * têm como saber que existe uma Eshmed dentro de Endor. Em vez de reescrever
 * a prosa deles, o códice acrescenta esses vizinhos ao "ver também" na hora
 * de montar o corpus: a região passa a apontar para os assentamentos que o
 * cartógrafo desenhou dentro dela.
 *
 * É só ligação — nenhuma frase da crônica é alterada por isto.
 */
export const COSTURA_DO_MAPA: Record<string, string[]> = {
  firen: ['nova-firen', 'velha-firen', 'caryn'],
  endor: ['eshmed', 'gerren'],
  aranti: ['varna', 'jappi', 'vale-do-morto'],
  khorvari: ['gerren'],
  ashara: ['rhydash', 'viridier'],
  ershen: ['erbronn', 'andari'],
  sindaren: ['andari'],
  luctos: ['ashara'],
  rhydash: ['raihad'],
  'montanhas-orientais': ['dras', 'ohdartes'],
  'casa-herrys': ['nova-firen', 'caryn'],
  'queda-de-dartharion': ['descanso-dos-herois'],
};
