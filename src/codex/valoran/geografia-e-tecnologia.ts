/**
 * Geografia e tecnologia perdida — Ridash, a Aquila, Ilidaren, e os Gigantes
 * de Unkanten.
 *
 * Como o resto do material trazido depois das Anais, a prosa segue em
 * inglês — é a língua do documento inteiro — mas o conteúdo vem das notas
 * pessoais do mestre da campanha, não da crônica de Maedrin Rimors. Onde
 * algo foi visto e não lido — a visão da Valquíria, o interior de Ilidaren
 * — este arquivista diz isso abertamente em vez de fingir ter lido um livro
 * que não existe.
 */

import type { Verbete } from '../tipos';

export const GEOGRAFIA_E_TECNOLOGIA: Verbete[] = [
  {
    chave: 'ridash',
    titulo: 'Ridash',
    epiteto: 'The City Under the Dome',
    categoria: 'lugar',
    resumo: 'A drowned city sealed under an unnatural dome of steel, its architecture older than the Empire that copies its style.',
    brasao: 'porto',
    ficha: [
      { rotulo: 'Kind', valor: 'City, submerged beneath a great lake' },
      { rotulo: 'Sealed by', valor: 'A dome of unnatural black steel' },
      { rotulo: 'Architecture', valor: 'Precursor to Aer Firen’s own — twelve-pointed ornament throughout' },
      { rotulo: 'Not to be confused with', valor: '[[rhydash|Rhydash]], the merchant city of House Orhys' },
    ],
    secoes: [
      {
        titulo: 'A Precursor, Not a Ruin',
        paragrafos: [
          'Ridash sits beneath a great lake, sealed inside a dome of black steel that is, by every account brought back of it, plainly unnatural — present, the party was told, since the sky itself fell. Seen from a distance the city reads as ancient ruin, its old buildings worn by time; drawn closer, the resemblance to Aer Firen’s own architecture sharpens, and one detail repeats everywhere the newer empire never kept: a preference for twelve-pointed shapes in every ornament.',
          'This codex takes the name at the party’s own word and notes, once, the risk of confusion: [[rhydash|Rhydash]] is a different place entirely, the merchant seat of [[casa-orhys|House Orhys]] far from any lake.',
        ],
      },
      {
        titulo: 'The People Under the Dome',
        paragrafos: [
          'Those who dwell inside call themselves Aegeon — *children of the Balance*. What that claim means to them, and whether [[a-balanca|the goddess]] answers it, no record here settles.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Who built the dome, when the sky is meant to have fallen, and whether Ridash predates [[imperio-aer-firen|Aer Firen]] or simply looks as though it does — none of it comes with a source. It is set down here as seen, not as read.',
        ],
      },
    ],
    relacionados: ['rhydash', 'a-balanca', 'aquila'],
    eras: ['era-moderna'],
    alcunhas: ['the city under the dome'],
  },

  {
    chave: 'aquila',
    titulo: 'The Aquila',
    epiteto: 'The Oracle Ship',
    categoria: 'reliquia',
    resumo: 'An Imperial Oracle Ship built upon the skeleton of Dartharion himself, and the model Reynkraft tried, and failed, to copy.',
    brasao: 'nau',
    ficha: [
      { rotulo: 'Kind', valor: 'Oracle Ship — military project of the crown' },
      { rotulo: 'Built on', valor: 'The skeleton of [[dartharion|Dartharion]]' },
      { rotulo: 'Copied by', valor: '[[reincraft|Reynkraft]] — imperfectly' },
    ],
    secoes: [
      {
        titulo: 'A Dragon’s Bones, Made a Hull',
        paragrafos: [
          'The Aquila is one of the Empire’s [[naus-oraculo|Oracle Ships]], a class this codex already knows carried [[ayren-herrys-ii|the Young King]]’s armies across [[mar-astral|the Astral Sea]]. What sets the Aquila apart is its keel: it was raised on the bones of [[dartharion|Dartharion]] himself, the calamity four heroes felled to found [[imperio-aer-firen|Aer Firen]] in the first place. A dragon that once burned a kingdom now carries one across the sky.',
          'Documents that passed through [[reincraft|Reynkraft]]’s hands show him studying the Aquila’s technical workings closely, in what this codex reads as an attempted copy that never matched the original.',
        ],
      },
    ],
    relacionados: ['dartharion', 'naus-oraculo', 'reincraft', 'imperio-aer-firen'],
    eras: ['era-primeira-luz', 'era-moderna'],
  },

  {
    chave: 'ilidaren',
    titulo: 'Ilidaren',
    epiteto: 'The Empire of Dragons, and the Riddle It Left',
    categoria: 'lugar',
    resumo: 'A vanished draconic empire, at war with the giants of Orantis, whose capital cannot be found on any map that still exists.',
    brasao: 'dragao',
    ficha: [
      { rotulo: 'Kind', valor: 'Vanished empire — of dragons' },
      { rotulo: 'Rival', valor: 'Orantis, the empire of the giants' },
      { rotulo: 'Backed by', valor: 'The gods of that age' },
      { rotulo: 'Who might know', valor: 'The Giants of Unkanten, who have written this world’s history since the mortal ages began' },
    ],
    secoes: [
      {
        titulo: 'A Society Before the Giants Fought',
        paragrafos: [
          'Before the wars that shaped this age, two societies stood against each other: Orantis of the Giants, and Ilidaren, the Empire of Dragons. The gods of that time backed Ilidaren. What broke between them, and why, is a question that predates every record this codex can reach — millennia lost between then and now.',
          'A being calling itself Jack, questioned on the matter, would say only this much: Ilidaren, so far as he knows, no longer exists anywhere in Aion, not even among the continents. Its old capital has vanished from the map, and no research, no search, has ever found it again.',
        ],
      },
      {
        titulo: 'The Riddle of the Five Pillars',
        paragrafos: [
          'A shape recurs in what little survives of this mystery: a lozenge, or rhombus, seen both in a cave beneath [[alvyriel|Alvyriel]]’s own history and in old noble legends of *the Five Pillars of Il and Daren* — a phrase half-remembered by Firenian historians and never fully explained by any of them.',
          'Jack offers one path forward and only one: seek those who have been writing this world’s history inside their own heads since the first mortal ages — the Giants of Unkanten. They will have the answers, he says, if anyone does.',
        ],
      },
    ],
    relacionados: ['unkanten', 'dartharion', 'alvyriel'],
    eras: ['era-mil-reis', 'era-moderna'],
  },

  {
    chave: 'unkanten',
    titulo: 'Unkanten',
    epiteto: 'The Body of a Storm Giant',
    categoria: 'lugar',
    resumo: 'The northern land of the storm giants — and, by a vision granted to the party, the literal body of a Valkyrie who lost a war against dragons.',
    brasao: 'montanha',
    ficha: [
      { rotulo: 'Kind', valor: 'Land of the storm giants — and, in body, a goddess' },
      { rotulo: 'True name of that goddess', valor: 'Unkanten' },
      { rotulo: 'Missing', valor: 'Her right hand — taken by the victors of an old war' },
      { rotulo: 'Kin', valor: 'A younger brother, now counted among the Twelve as [[os-doze|the Forger]]' },
      { rotulo: 'Source', valor: 'A vision, not a document — this codex reports what was seen' },
    ],
    epigrafe: 'The continent is the body of the Valkyrie.',
    secoes: [
      {
        titulo: 'A Vision, Not a Book',
        paragrafos: [
          'What this entry records did not come from any archive. It came to the party directly, granted by a being who named herself the Valkyrie, questioned about a weapon called *Unkanten, the Skycleaver* — an axe whose design was born, ages ago, when seekers hunting for the hidden refuge of [[unkanten|the Children of the Storm]] had to solve a puzzle: take a wooden axe, and use it to cleave in two the enormous statue of a dragon.',
          'Asked her true name, she answered with the sound of thunder: Unkanten. And with that answer came a second one, unasked: the continent that bears her name is not named for her. It *is* her — her body, made land.',
        ],
      },
      {
        titulo: 'A War the Valkyrie Lost',
        paragrafos: [
          'The vision that followed showed her once, not the size of a continent but the ordinary size of a storm giant, standing alone before an enormous rock-hewn dragon, a small army of other dragons arrayed behind it. Facing them: bands of giants, crystal-formed beings the size of dwarves walking alongside dwarves the size of giants, and the massed host of an ancient empire, bracing to meet the dragons. The vision left as quickly as it came.',
          '“I and others fought, fought, and lost,” she said afterward. “Our new post is a result of that.” Ninety percent of her clerics gain nothing from their devotion; the remaining ten do — one, at the swamp of Syldeax, called down a blessing strong enough to strike a dragon’s skull with lightning in her final act.',
        ],
      },
      {
        titulo: 'The Missing Hand',
        paragrafos: [
          'Where a body is, a piece of the soul is too, she said — and named the rest of her body the continent of Unkanten itself, spent in the last moments of that war to unbind a curse she had held back for years, letting it grow, and letting it, in the end, kill those dragons. Only her right hand is missing from that body: taken by the war’s victors, and kept, she implied, somewhere else entirely.',
          'Of her younger brother she said only that she left him alone when she lost, that he followed her not long after, and that he now stands among the Twelve — the one this codex, and [[os-ritos-dos-doze|Athran Judd]] before it, name the Forger.',
        ],
      },
    ],
    relacionados: ['ilidaren', 'os-doze', 'os-ritos-dos-doze', 'dartharion'],
    eras: ['era-mil-reis', 'era-moderna'],
    alcunhas: ['the Skycleaver', 'the Children of the Storm'],
  },

  {
    chave: 'tres-portas-de-valoran',
    titulo: 'The Three Gates of Valoran',
    epiteto: 'Valdrak, Khorvari, and Sindaren',
    categoria: 'lugar',
    resumo: 'The three ways into Valoran — one frozen and guarded, one held by a reforged horde, and one that needs no introduction at all.',
    brasao: 'cascata',
    ficha: [
      { rotulo: 'Gate one', valor: 'Lake Valdrak — northeast, House Bellias territory' },
      { rotulo: 'Gate two', valor: 'The Khorvari Coast — west, House Vinco and the Iron Hand' },
      { rotulo: 'Gate three', valor: 'Sindaren — the region this whole codex already knows' },
    ],
    secoes: [
      {
        titulo: 'Valdrak, the Impassable',
        paragrafos: [
          'Lake Valdrak — closer to a small frozen ocean than a lake — sits northeast of the continent, in the territory of [[casa-bellias|House Bellias]], nearest of the three gates to the Empire’s capital and currently held by [[lorde-thoren-bellias|Lord Thoren Bellias]], of the crown’s own inner circle. Between the difficult crossing and the Bellias presence — one of the houses most heavily represented in the Firenian army — any strategist with a working brain counts this gate effectively closed.',
        ],
      },
      {
        titulo: 'Khorvari, Under the Iron Hand',
        paragrafos: [
          'The Khorvari Coast, west of the continent and the largest body of water Valoran holds, is kept by [[casa-vinco|House Vinco]] and the Iron Hand, an army of orcs and goblinkin sworn to them — the same people who, as [[horda-da-mao-vermelha|a Horde]] fleeing Fentor, were once taken in by [[imperio-aer-firen|Aer Firen]] rather than repelled from it. Their leader today is Kors, Lord of Iron.',
        ],
      },
      {
        titulo: 'Sindaren, the Third and Best-Known',
        paragrafos: [
          'The last gate is [[sindaren|Sindaren]] — a region this codex has already mapped from every other direction it can be approached from. No introduction is needed here that the rest of this archive has not already given.',
        ],
      },
    ],
    relacionados: ['casa-bellias', 'casa-vinco', 'sindaren', 'lorde-thoren-bellias'],
    eras: ['era-moderna'],
  },
];
