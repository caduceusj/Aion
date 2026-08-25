/**
 * O ciclo de Andari — a Cidade do Lamento.
 *
 * Material trazido pelo usuário depois das Anais: a origem élfica de Andari,
 * a Queda de Corvus, os gêmeos Deios, a fundação da casa Deallus, o Roubo de
 * Sindaren visto do lado de quem o sofreu, e as Invasões Serpentinas.
 *
 * Duas coisas a saber antes de mexer aqui:
 *
 * 1. Esta lore CORRIGE as Anais em vários pontos — Sellias é mulher, gêmea de
 *    Althos, e o sobrenome é Deios (a crônica grafa "Delios"); Ayren I chamava-se
 *    Aran IV antes da coroa; Dartharion é um dragão vermelho ancião; e o mar
 *    arrancado virou o continente de Vrednost. As correções foram aplicadas
 *    nos verbetes originais, e cada uma diz de onde veio.
 * 2. Os nomes próprios ficam como o autor os escreveu, em português —
 *    Tear Prateado, Corrente Dourada, Povos Lunares, Cidade do Lamento. A prosa
 *    segue em inglês porque o códice inteiro é um documento em inglês; onde o
 *    nome português importa, ele aparece em itálico ao lado.
 */

import type { Verbete } from '../tipos';

export const ANDARI: Verbete[] = [
  // =====================================================================
  // A CIDADE
  // =====================================================================
  {
    chave: 'andari',
    titulo: 'Andari',
    epiteto: 'The City of Lament',
    categoria: 'lugar',
    resumo:
      'The oldest city of the continent: raised by exiles from another world, half-ruined by the Theft, and now at war with itself.',
    brasao: 'deallus',
    ficha: [
      { rotulo: 'Kind', valor: 'City — elder than the Empire' },
      { rotulo: 'Founded by', valor: 'The Moon Peoples, after the Fall' },
      { rotulo: 'Held by', valor: 'House Deallus — in name' },
      { rotulo: 'Region', valor: 'The rim of what was Sindaren' },
      { rotulo: 'Standing', valor: 'Fractured into warring factions' },
      { rotulo: 'Former name', valor: 'The City of Moonlight' },
    ],
    epigrafe:
      'It was named for the moon. It is named now for the sound its people make.',
    secoes: [
      {
        titulo: 'Older Than the Empire',
        paragrafos: [
          'Andari is older than [[nova-firen|Nova Firen]], which is the seat of the Empire. It is older, so far as this archive can determine, than any other city standing on Valoran — older than the crown, older than the calendar, older than the [[lamina-firen|blade]] that named the realm.',
          'It was not founded by anyone from this world. The [[povos-lunares|Moon Peoples]] came to Valoran out of [[corvus]], fleeing [[a-queda|a catastrophe]] whose account is kept in the sealed chamber of the [[tear-prateado|Silver Loom]] and read by almost no one. What they built when they arrived, they built on the islands of the lake of [[sindaren|Sindaren]]: two cities, [[valari|Valari]] the City of Secrets and Andari the City of Moonlight. A popular cult unrecognized by the Empire still honors the migrants’ own protector on that road, [[sao-chevalier|São Chevalier]] — a saint the crown calls a pagan figure, and the city calls its own.',
        ],
      },
      {
        titulo: 'The Twins',
        paragrafos: [
          'In the last years of the [[era-mil-reis|Age of a Thousand Kings]], Andari was led by twins — [[sellias-delios|Sellias “Moonwhisper” Deios]] and [[althos-deios|Althos Deios]]. It was Sellias who took a great company of Andari’s elves north to [[caryn]], and there helped the prince Aran IV, whom the chronicle would later name [[ayren-herrys-i|Ayren Herrys I]], put an end to [[dartharion|Dartharion]].',
          'From that company came [[casa-deallus|House Deallus]], one of the four original noble houses of [[imperio-aer-firen|Aer Firen]]. It also came at a cost the histories rarely count: those elves could not go home for years, and the ones who stayed north became [[corrente-dourada|the Golden Chain]]. Andari gave away a generation to make an empire, and got the title in exchange.',
        ],
      },
      {
        titulo: 'The Half-Ruin',
        paragrafos: [
          'Then the archmages took the lake. [[roubo-de-sindaren|The Theft of Sindaren]] carried [[valari|Valari]] away entire and left Andari standing at the rim of a wound, with much of the city broken and in need of rebuilding. The waters that had been its horizon now fall forever into [[mar-astral|the Astral Sea]] as the [[cascata-eterna|Eternal Waterfall]].',
          'That was more than seven hundred years ago, and Andari has been going down ever since. What the [[invasoes-serpentinas|Serpentine Invasions]] did not break, distance did: the Empire drifted, the House fractured, and the city that had been the Moonlight became the Lament.',
        ],
      },
      {
        titulo: 'What It Is Now',
        paragrafos: [
          'Andari today is further from the throne than at any point in its existence, and it is not one thing any more. [[casa-deallus|House Deallus]] has split into sub-families beyond counting, each holding its own ground and its own grievance — some within these walls, some scattered across what is left of Sindaren — and they are at war with one another more or less constantly.',
          'The future of the city and of its people is, in the plainest sense, unknown.',
        ],
      },
    ],
    relacionados: [
      'povos-lunares',
      'valari',
      'casa-deallus',
      'a-queda',
      'roubo-de-sindaren',
      'invasoes-serpentinas',
      'sindaren',
      'imaren',
    ],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['Cidade do Lamento', 'Cidade do Luar', 'City of Moonlight'],
  },

  {
    chave: 'valari',
    titulo: 'Valari',
    epiteto: 'The City of Secrets',
    categoria: 'lugar',
    resumo:
      'The second elven capital, which stood in the lake of Sindaren and was carried off with it — and is a school now.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Kind', valor: 'City — no longer on this continent' },
      { rotulo: 'Founded by', valor: 'The Moon Peoples, after the Fall' },
      { rotulo: 'Stood in', valor: 'The lake of Sindaren' },
      { rotulo: 'Now', valor: 'A seat of the School of Arkanheim, upon Vrednost' },
    ],
    secoes: [
      {
        titulo: 'The Other Capital',
        paragrafos: [
          'When the [[povos-lunares|Moon Peoples]] rebuilt their society on the islands of the lake, they raised two cities and no third. [[andari|Andari]] was the City of Moonlight. Valari was the City of Secrets, and the archive is content to leave the name unexplained, as the name itself seems to prefer.',
        ],
      },
      {
        titulo: 'Taken With the Water',
        paragrafos: [
          'Valari stood *in* the lake, and so when the cabal [[roubo-de-sindaren|tore the lake out of the world]] the city went with it. It did not fall and it was not sacked. It was simply removed, along with the water it sat on, to the continent that the severed realm became: [[vrednost]].',
          'It stands there still, and it is no longer elven. The [[escola-arkanheim|School of Arkanheim]] holds it as a centre of learning. For [[casa-deallus|House Deallus]] this was the deepest cut of the Theft — worse, in the reckoning of Andari, than the loss of the water: a capital of their people turned into a foreign school, intact and unreachable.',
        ],
      },
    ],
    relacionados: ['andari', 'roubo-de-sindaren', 'vrednost', 'escola-arkanheim', 'povos-lunares', 'sindaren'],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-segunda-luz'],
    alcunhas: ['Cidade dos Segredos'],
  },

  {
    chave: 'corvus',
    titulo: 'Corvus',
    epiteto: 'The Shadowfell Home',
    categoria: 'lugar',
    resumo: 'The land in the Shadowfell that the Moon Peoples fled, and to which no page here records a return.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'Kind', valor: 'Land within the Shadowfell' },
      { rotulo: 'Peoples', valor: 'The Moon Peoples, before the Fall' },
      { rotulo: 'Left', valor: 'During the Age of a Thousand Kings' },
      { rotulo: 'Record', valor: 'Sealed in the Silver Loom' },
    ],
    secoes: [
      {
        titulo: 'What Was Left Behind',
        paragrafos: [
          'The elves of [[andari|Andari]] and [[valari|Valari]] are not natives of Valoran. They came from Corvus, in the Shadowfell, and they came because of [[a-queda|the Fall]].',
          'That is nearly everything this codex can state. The account of what happened in Corvus is kept in the sealed chamber of the [[tear-prateado|Silver Loom]], and this archivist has not read it.',
        ],
      },
    ],
    relacionados: ['a-queda', 'povos-lunares', 'tear-prateado', 'andari'],
    eras: ['era-mil-reis'],
    alcunhas: ['Shadowfell'],
  },

  {
    chave: 'tear-prateado',
    titulo: 'The Silver Loom',
    epiteto: 'Library of Andari',
    categoria: 'lugar',
    resumo: 'The library of Andari, whose sealed chamber holds the only account of the Fall that drove the elves from Corvus.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Kind', valor: 'Library' },
      { rotulo: 'Where', valor: 'Andari' },
      { rotulo: 'Holds', valor: 'The books of the Fall, in a sealed chamber' },
      { rotulo: 'Access', valor: 'Not granted to this archive' },
    ],
    secoes: [
      {
        titulo: 'The Sealed Chamber',
        paragrafos: [
          'Andari keeps its memory in the Silver Loom (*Tear Prateado*), and the oldest part of that memory is not on the shelves. The books that detail [[a-queda|the Fall]] — the tragedy that ended the Moon Peoples’ life in [[corvus]] — are kept in a chamber of the library that is closed.',
          'A city whose founding disaster is a restricted document is a city with a particular relationship to its own past. The archivist notes it and moves on, having no better right of entry than anyone else.',
        ],
      },
    ],
    relacionados: ['a-queda', 'corvus', 'andari', 'povos-lunares'],
    eras: ['era-mil-reis', 'era-moderna'],
    alcunhas: ['Tear Prateado'],
  },

  {
    chave: 'nyria',
    titulo: 'Nyria',
    epiteto: 'The Elevator City',
    categoria: 'lugar',
    resumo: 'A city raised by the magic of House Deallus and the building of House Alabaster — the great work of their alliance.',
    brasao: 'montanha',
    ficha: [
      { rotulo: 'Kind', valor: 'City — a work of magical construction' },
      { rotulo: 'Built by', valor: 'House Deallus with House Alabaster' },
      { rotulo: 'Era', valor: 'The height of Deallus' },
      { rotulo: 'Notable', valor: 'The elevator by which it is named' },
    ],
    secoes: [
      {
        titulo: 'Magic and Masonry',
        paragrafos: [
          'For decades [[casa-deallus|House Deallus]] stood among the greatest houses of [[imperio-aer-firen|Aer Firen]]: the vanguard of magical advance, and the architects of great magical constructions. The most famous of them was not built alone.',
          'Nyria — the elevator-city — was raised by Deallus together with the builders of [[casa-alabaster|House Alabaster]], the dwarves of [[darron-alabaster|Darron Alabaster]]’s line. Elven magic and dwarven building: the alliance forged against [[dartharion|the Calamity]] outlived the war by centuries and left a city standing as its proof.',
        ],
      },
    ],
    relacionados: ['casa-deallus', 'casa-alabaster', 'darron-alabaster', 'andari'],
    eras: ['era-primeira-luz', 'era-segunda-luz'],
  },

  {
    chave: 'vrednost',
    titulo: 'Vrednost',
    epiteto: 'The Severed Continent',
    categoria: 'lugar',
    resumo: 'The continent that the stolen sea of Sindaren became — independent, unreclaimed, and carrying Valari with it.',
    brasao: 'vazio',
    ficha: [
      { rotulo: 'Kind', valor: 'Continent' },
      { rotulo: 'Was', valor: 'The inland sea of Sindaren' },
      { rotulo: 'Made', valor: 'By the Theft, in the White Queen’s age' },
      { rotulo: 'Standing', valor: 'Independent — never reclaimed' },
    ],
    secoes: [
      {
        titulo: 'What the Water Became',
        paragrafos: [
          'When the cabal [[roubo-de-sindaren|tore the inland ocean from Valoran]], the water and everything upon it did not cease to exist. It became a continent of its own, and that continent is Vrednost.',
          '[[valari|Valari]] went with it. So did whatever else stood on the islands. And it never came back: [[mayan-herrys|the White Queen]], for all that she is laurelled among the greatest rulers Firen ever had, did nothing to reclaim the severed lands. Vrednost has been independent ever since.',
        ],
      },
      {
        titulo: 'The Grievance',
        paragrafos: [
          'It is worth stating plainly what that inaction meant to [[casa-deallus|House Deallus]]. A house lost its sea, one of its two ancestral capitals, and the greater part of its political weight in a single act — and the sovereign it had served since the founding did not move to recover any of it. The distance between Andari and the throne begins here.',
        ],
      },
      {
        titulo: 'Nine Islands, and a Cult of Transmutation',
        paragrafos: [
          'What Vrednost became, once severed, is nine islands ruled by profane magics — home to [[escola-arkanheim|the transmutation sect]] that grew there once the sea was its own continent. Among that sect’s works, campaign-era notes record rituals meant to control the cycles of lycanthropy through circular marks carved into the flesh — a rival account to the one kept at [[templo-anciao|the Ancient Temple]], which blames the same curse on failed attempts to commune with the Weaver.',
          'One such mark is carried by [[symon|Symon]], a friend from [[beatrix|Beatrix]]’s childhood, on the mesa side of this codex — a small proof that Vrednost’s magic still reaches Valoran, seven centuries after the sea was taken.',
        ],
      },
    ],
    relacionados: ['roubo-de-sindaren', 'valari', 'sindaren', 'casa-deallus', 'mayan-herrys', 'escola-arkanheim', 'symon'],
    eras: ['era-segunda-luz', 'era-moderna'],
  },

  // =====================================================================
  // OS POVOS E AS ORDENS
  // =====================================================================
  {
    chave: 'povos-lunares',
    titulo: 'The Moon Peoples',
    epiteto: 'Elves out of Corvus',
    categoria: 'poder',
    resumo: 'The moon elves who fled the Shadowfell after the Fall and built the two oldest cities on the continent.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Kind', valor: 'People' },
      { rotulo: 'From', valor: 'Corvus, in the Shadowfell' },
      { rotulo: 'Built', valor: 'Valari and Andari, on the isles of Sindaren' },
      { rotulo: 'Era', valor: 'From the Age of a Thousand Kings' },
      { rotulo: 'Line', valor: 'House Deallus' },
    ],
    secoes: [
      {
        titulo: 'Exiles',
        paragrafos: [
          'The Moon Peoples (*Povos Lunares*) are the elves who came to Valoran out of [[corvus]] after [[a-queda|the Fall]]. They did not arrive as conquerors and the chronicle does not record that anyone opposed them; they arrived as survivors, and they rebuilt their society and their culture on the islands of the lake of [[sindaren|Sindaren]].',
          'From that rebuilding came [[valari|Valari]] and [[andari|Andari]] — and, in time, [[casa-deallus|House Deallus]], which is what the Empire calls them.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'How many came. How long the crossing took. Whether any remained. The Annals do not mention the Moon Peoples at all, and what is written here comes from Andari’s own account of itself.',
        ],
      },
    ],
    relacionados: ['corvus', 'a-queda', 'andari', 'valari', 'casa-deallus', 'sindaren'],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['Povos Lunares', 'moon elves'],
  },

  {
    chave: 'corrente-dourada',
    titulo: 'The Golden Chain',
    epiteto: 'Arcane Sect of Firen',
    categoria: 'poder',
    resumo: 'The order formed by the elves who marched north with Sellias and could not go home — arcane research in the crown’s service.',
    brasao: 'sol',
    ficha: [
      { rotulo: 'Kind', valor: 'Arcane research sect' },
      { rotulo: 'Seat', valor: 'The city of Firen' },
      { rotulo: 'Formed by', valor: 'The elves of Andari who marched with Sellias' },
      { rotulo: 'Purpose', valor: 'Arcane study in support of the kingdom' },
    ],
    secoes: [
      {
        titulo: 'The Ones Who Stayed',
        paragrafos: [
          'When [[sellias-delios|Sellias Deios]] led her company out of [[andari|Andari]] to [[caryn]], the intention was a war, not an emigration. But the elves sent north could not return for many years, and people who cannot go home build something where they are.',
          'What they built in the city of [[firen]] was the Golden Chain (*Corrente Dourada*): a sect of arcane research in support of the young kingdom. It is the first institution in this codex where elven learning and Firenian power are the same thing — the seed of the reputation [[casa-deallus|House Deallus]] would carry for centuries as the vanguard of magic in [[imperio-aer-firen|the Empire]].',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Whether the Chain still exists, and what became of it when the House and the throne drew apart after [[roubo-de-sindaren|the Theft]], is not set down here.',
        ],
      },
    ],
    relacionados: ['sellias-delios', 'andari', 'casa-deallus', 'firen', 'imperio-aer-firen'],
    eras: ['era-mil-reis', 'era-primeira-luz'],
    alcunhas: ['Corrente Dourada'],
  },

  {
    chave: 'escola-arkanheim',
    titulo: 'The School of Arkanheim',
    categoria: 'poder',
    resumo: 'The arcane school that holds Valari as a centre of knowledge, upon the severed continent of Vrednost.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Kind', valor: 'Arcane school' },
      { rotulo: 'Holds', valor: 'Valari, the City of Secrets' },
      { rotulo: 'Where', valor: 'Vrednost' },
      { rotulo: 'Since', valor: 'The Theft of Sindaren' },
    ],
    secoes: [
      {
        titulo: 'The Inheritors of Valari',
        paragrafos: [
          'When [[valari|Valari]] was carried off with the lake, the city did not stay empty. The School of Arkanheim took it as a centre of knowledge, and holds it upon [[vrednost]] to this day.',
          'From [[andari|Andari]] the arrangement reads as a theft compounding a theft: the City of Secrets became someone else’s library. The archive records no claim, no embassy and no attempt at recovery — only the fact.',
        ],
      },
    ],
    relacionados: ['valari', 'vrednost', 'roubo-de-sindaren', 'casa-deallus'],
    eras: ['era-segunda-luz', 'era-moderna'],
    alcunhas: ['Arkanheim'],
  },

  {
    chave: 'imaren',
    titulo: 'The Imaren',
    epiteto: 'The Council of Andari',
    categoria: 'poder',
    resumo: 'The council whose caution ruled Andari through the Serpentine Invasions — and whom Elamyr deserted.',
    brasao: 'deallus',
    ficha: [
      { rotulo: 'Kind', valor: 'Ruling council' },
      { rotulo: 'Where', valor: 'Andari' },
      { rotulo: 'Doctrine', valor: 'Hold the walls; spend nothing that can be kept' },
      { rotulo: 'Known for', valor: 'The refusal that Elamyr broke' },
    ],
    secoes: [
      {
        titulo: 'The Doctrine of the Walls',
        paragrafos: [
          'When the [[yuan-ti|Yuan-Ti]] came through [[andari|Andari]] during [[invasoes-serpentinas|the Serpentine Invasions]], the Imaren chose to shut the city and strengthen its defences. Their reasoning was not cowardice and should not be written down as such: Andari had already lost a great deal, and they feared losing more of what force remained.',
          'It is the logic of a house that has been in decline for seven centuries. It is also the logic that [[elamyr|Elamyr]] deserted the council to defy.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Whether the Imaren are one of the sub-families into which [[casa-deallus|House Deallus]] fractured, a body above them, or something older than both, is not stated. Nor is what they did about Elamyr afterwards.',
        ],
      },
    ],
    relacionados: ['elamyr', 'andari', 'invasoes-serpentinas', 'casa-deallus', 'yuan-ti'],
    eras: ['era-segunda-luz', 'era-moderna'],
  },

  // =====================================================================
  // AS PESSOAS
  // =====================================================================
  {
    chave: 'althos-deios',
    titulo: 'Althos Deios',
    epiteto: 'The Twin Who Remained',
    categoria: 'pessoa',
    resumo: 'Twin brother of Sellias, and with her a leader of Andari’s moon elves in the last years of the Thousand Kings.',
    brasao: 'folha',
    ficha: [
      { rotulo: 'Kin', valor: 'Elf — of the Moon Peoples' },
      { rotulo: 'Of', valor: 'Andari' },
      { rotulo: 'Title', valor: 'Joint leader of Andari, with his sister' },
      { rotulo: 'Era', valor: 'The Age of a Thousand Kings' },
      { rotulo: 'Fate', valor: 'Unrecorded' },
    ],
    secoes: [
      {
        titulo: 'The Other Half',
        paragrafos: [
          'In the last years of the [[era-mil-reis|Age of a Thousand Kings]], the moon elves of [[andari|Andari]] were led by twins: [[sellias-delios|Sellias “Moonwhisper” Deios]] and Althos Deios.',
          'Sellias took a great company north to [[caryn]] and into the war against [[dartharion|Dartharion]]; the account that names them both follows her from there, and does not follow him. What the Annals call the founding of [[casa-deallus|House Deallus]] is, on this reading, one twin’s expedition — and the other twin is who was left holding a city.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Everything else. Whether he ruled alone in her absence, whether he lived to see her people return in [[ayren-herrys-ii|the Young King]]’s reign, and whether the sub-families of Andari trace to him as much as to her — none of it is written.',
        ],
      },
    ],
    relacionados: ['sellias-delios', 'andari', 'casa-deallus', 'povos-lunares', 'era-mil-reis'],
    eras: ['era-mil-reis'],
    alcunhas: ['Althos', 'Deios'],
  },

  {
    chave: 'elamyr',
    titulo: 'Elamyr',
    epiteto: 'Who Deserted the Council',
    categoria: 'pessoa',
    resumo: 'The Andari commander who broke with the Imaren, left the walls, and marched north to help end the Yuan-Ti.',
    brasao: 'lamina',
    ficha: [
      { rotulo: 'Of', valor: 'Andari' },
      { rotulo: 'Against', valor: 'The will of the Imaren' },
      { rotulo: 'Era', valor: 'The Serpentine Invasions' },
      { rotulo: 'Known for', valor: 'Desertion, and the march north' },
      { rotulo: 'Fate', valor: 'Unrecorded' },
    ],
    epigrafe: 'The council voted to hold the walls. He left through them.',
    secoes: [
      {
        titulo: 'The Desertion',
        paragrafos: [
          'When the [[yuan-ti|Yuan-Ti]] came through [[andari|Andari]], [[imaren|the Imaren]] resolved to stay closed and fortify — they had lost enough, and would not spend what force they had left on someone else’s frontier.',
          'Elamyr disagreed. He deserted the council, gathered a body of soldiers, and marched north to join the giant-blooded host out of [[montanhas-orientais|the eastern mountains]] — the warriors who for that campaign would be raised to nobility as [[casa-sturm|House Sturm]] — and helped them put an end to the [[invasoes-serpentinas|Serpentine threat]].',
        ],
      },
      {
        titulo: 'Two Ways to Read It',
        paragrafos: [
          'The Empire’s account of the invasion names the giants and the crown’s reward to them, and does not name Elamyr at all. Andari’s account names him, and names what it cost.',
          'He is, so far as this codex can find, the last figure of [[casa-deallus|House Deallus]] to act on the Empire’s behalf without being asked — and he had to abandon his own government to do it.',
        ],
      },
    ],
    relacionados: ['imaren', 'invasoes-serpentinas', 'casa-sturm', 'andari', 'yuan-ti', 'casa-deallus'],
    eras: ['era-segunda-luz'],
  },

  // =====================================================================
  // OS EVENTOS
  // =====================================================================
  {
    chave: 'a-queda',
    titulo: 'The Fall',
    epiteto: 'The Catastrophe of Corvus',
    categoria: 'evento',
    resumo: 'The tragedy that drove the Moon Peoples out of the Shadowfell — its account sealed, its date unknown.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'When', valor: 'Somewhere in the Age of a Thousand Kings' },
      { rotulo: 'Where', valor: 'Corvus, in the Shadowfell' },
      { rotulo: 'Outcome', valor: 'The Moon Peoples come to Valoran' },
      { rotulo: 'Legacy', valor: 'Andari and Valari' },
      { rotulo: 'Record', valor: 'Sealed chamber of the Silver Loom' },
    ],
    secoes: [
      {
        titulo: 'The Account',
        paragrafos: [
          'Something happened in [[corvus]]. The [[povos-lunares|Moon Peoples]] left because of it, crossed into Valoran, and rebuilt on the islands of [[sindaren|Sindaren]]. That is the whole of what can be stated without opening a door this archive cannot open.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Not when. The Fall happened at some point within the [[era-mil-reis|Age of a Thousand Kings]] — an obscure stretch of Valoran’s history whose full extent nobody has established. An age of unknown length is a poor place to date anything, and the Fall is dated only to *inside* it.',
          'Not what, either. The books that detail it are held in the closed chamber of the [[tear-prateado|Silver Loom]] in [[andari|Andari]].',
        ],
      },
    ],
    relacionados: ['corvus', 'povos-lunares', 'tear-prateado', 'andari', 'era-mil-reis'],
    eras: ['era-mil-reis'],
    alcunhas: ['A Queda'],
  },

  {
    chave: 'invasoes-serpentinas',
    titulo: 'The Serpentine Invasions',
    categoria: 'evento',
    resumo:
      'A succession of Yuan-Ti invasions that used the new waterfall as a road into southern Valoran, with Andari first in their path.',
    brasao: 'serpente',
    ficha: [
      { rotulo: 'When', valor: 'After the Theft of Sindaren' },
      { rotulo: 'Where', valor: 'Southern Valoran, and north from there' },
      { rotulo: 'Belligerents', valor: 'The Yuan-Ti against Andari, and the eastern giants' },
      { rotulo: 'Outcome', valor: 'The threat ended; House Sturm ennobled' },
      { rotulo: 'Legacy', valor: 'Elamyr’s desertion' },
    ],
    secoes: [
      {
        titulo: 'A Road Made by Accident',
        paragrafos: [
          'The [[roubo-de-sindaren|Theft]] did not only take a sea. It left [[cascata-eterna|a waterfall]] where the sea had been, and the [[yuan-ti|Yuan-Ti]] used it as a road — coming up out of the wound into southern Valoran, in a succession of invasions rather than a single war.',
          '[[andari|Andari]] stands at the rim of that wound. Everything that came through passed it first.',
        ],
      },
      {
        titulo: 'Consequences',
        paragrafos: [
          'The invasions were ended by the giant-blooded warriors out of [[montanhas-orientais|the eastern mountains]], who were granted the swamplands of [[ershen]] and the name [[casa-sturm|House Sturm]] for it — and by [[elamyr]], who came north from Andari against the express will of [[imaren|the Imaren]] and is in none of the crown’s records.',
          'The Annals compress all of this into a single sentence about serpentfolk repelled by Deallus and the giants. This entry exists because that sentence is doing a great deal of work.',
        ],
      },
    ],
    relacionados: ['yuan-ti', 'cascata-eterna', 'casa-sturm', 'elamyr', 'andari', 'roubo-de-sindaren'],
    eras: ['era-segunda-luz'],
    alcunhas: ['Invasões Serpentinas'],
  },

  // =====================================================================
  // A CASA QUE FALTAVA
  // =====================================================================
  {
    chave: 'casa-alabaster',
    titulo: 'House Alabaster',
    epiteto: 'Builders of the Deep',
    categoria: 'casa',
    resumo: 'The dwarven house of Darron Alabaster’s line — one of the four original houses, and the builders of Nyria.',
    brasao: 'martelo',
    ficha: [
      { rotulo: 'Seat', valor: 'Not set down in this archive' },
      { rotulo: 'Blood', valor: 'Dwarven — the line of Darron Alabaster' },
      { rotulo: 'Ennobled', valor: 'Among the four original houses of Aer Firen' },
      { rotulo: 'Known for', valor: 'Building; the elevator-city of Nyria' },
    ],
    secoes: [
      {
        titulo: 'Origin',
        paragrafos: [
          'The house descends from [[darron-alabaster|Darron Alabaster]], the dwarven chief who brought his people down from the mountains to answer the grand alliance against [[dartharion|Dartharion]]. Like [[casa-deallus|Deallus]], it is one of the four original noble houses of [[imperio-aer-firen|Aer Firen]] — the founding four, made from the heroes who ended the [[era-mil-reis|Age of a Thousand Kings]].',
        ],
      },
      {
        titulo: 'The Builders',
        paragrafos: [
          'What Alabaster is known for is building. The clearest surviving example is [[nyria]], the elevator-city, raised by Alabaster’s builders together with the magic of House Deallus — dwarven work and elven work in the same stone.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The Annals never name House Alabaster. They name Darron and stop. Its seat, its standing today, and what it made of the centuries are absent from this codex, and it is a gap worth minding: a founding house of the Empire with no chapter of its own.',
        ],
      },
    ],
    relacionados: ['darron-alabaster', 'nyria', 'casa-deallus', 'imperio-aer-firen', 'queda-de-dartharion'],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-segunda-luz'],
    alcunhas: ['Alabaster'],
  },
];
