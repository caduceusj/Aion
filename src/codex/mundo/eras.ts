/**
 * Códice de Valoran — as cinco eras.
 *
 * Este arquivo guarda a espinha dorsal da crônica: as cinco idades do
 * continente, do primeiro rei ao tirano de hoje. São os verbetes mais longos
 * do códice, porque é neles que a narrativa corre — os demais (casas, pessoas,
 * lugares) apenas puxam um fio daqui.
 *
 * O material vem de "The Annals of Valoran", documento de autoria do usuário,
 * atribuído em ficção a Maedrin Rimors, Scholar of the Imperial Archives, Anno
 * 1570. A prosa fica em inglês de propósito: é a língua do original e a voz do
 * cronista. Só o código em volta é comentado em português.
 *
 * Nada aqui é inventado. Onde o original silencia, o verbete confessa o
 * silêncio em vez de preenchê-lo — daí as seções "What the Record Does Not
 * Say". Cada `epigrafe` é a citação em destaque do capítulo correspondente.
 *
 * Ordenar por `ordem` dá a linha do tempo; `periodo` é o rótulo exibido nela.
 */

import type { Verbete } from '../tipos';

export const ERAS: Verbete[] = [
  {
    chave: 'era-mil-reis',
    titulo: 'The Age of a Thousand Kings',
    epiteto: 'Beneath the Shadow of the Dragon',
    categoria: 'era',
    resumo:
      'Endless war beneath the shadow of the dragon Dartharion, until four heroes felled the Calamity.',
    brasao: 'dragao',
    periodo: 'Before the Founding of Firen — Year 0',
    ordem: 1,
    ficha: [
      { rotulo: 'Period', valor: 'Before the Founding of Firen — Year 0' },
      { rotulo: 'Order', valor: 'The first age of the chronicle' },
      { rotulo: 'Dominion', valor: 'Dartharion, the Calamity' },
      { rotulo: 'Founding', valor: 'The Kingdom of Firen, under King Arran Herrys' },
      { rotulo: 'Ends With', valor: 'The felling of the dragon by the grand alliance' },
    ],
    epigrafe:
      'As his oath was sworn, he looked down — and the sacred blade Firen was now in his hand.',
    secoes: [
      {
        titulo: 'A Land of Endless War',
        paragrafos: [
          'Long before the unification of the north under the first High King, Valoran was a land of endless war. The first recorded histories tell of countless kingdoms, city-states and wandering clans, each vying for dominion over its own corner of the land.',
          'The wars of that era were fought not only with steel but with faith, for men and women called upon [[os-doze|the Twelve]] for strength, seeking divine favour to carve their names into eternity.',
        ],
      },
      {
        titulo: 'The Vision and the Blade',
        paragrafos: [
          'During this tumultuous time, it is said, a great warlord of the northern lands was blessed with a vision of a great eternal empire, bathed in holy light, and swore to make that vision a reality. As the oath left him he looked down, and the sacred blade [[lamina-firen|Firen]] was in his hand.',
          'Armed with the blade and the guidance of the divine, [[arran-herrys|King Arran Herrys]] bound many of the warring clans of the north into one greater kingdom, [[firen|Firen]], and so became its first High King. The name of the blade became the name of the kingdom, and in time the name of [[imperio-aer-firen|an empire]].',
        ],
      },
      {
        titulo: 'The Calamity and the Grand Alliance',
        paragrafos: [
          'The young kingdom did not stand unchallenged for long. [[dartharion|Dartharion]], the Calamity, the great dragon whose rule had cast its shadow over the continent for centuries, turned his gaze upon the emerging realm and buried it in unholy fire.',
          'It was in this age that four heroes rose from the chaos, whose deeds would shape the destiny of Valoran: [[ayren-herrys-i|Ayren Herrys I]], son of the warlord who first united the northern lands, seeking revenge for the destruction of his kingdom; [[darron-alabaster|Darron Alabaster]], the dwarven chief who led his people down from the mountains to join the great cause; [[sellias-delios|Sellias “Moonwhisper” Deios]], who brought a company of moon elves out of [[andari]] on the isles of [[sindaren|Sindaren]]; and [[rhogar|Rhogar]], the half-dragon barbarian, a warrior of unmatched fury who carried the blood of dragons in his veins.',
          'Together they led a grand alliance against their draconic overlord and [[queda-de-dartharion|felled him]]. Their victory marked the dawn of a new era — [[era-primeira-luz|the First Age of Light]], whose first year is counted from the crowning that followed.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Of what lies behind this age, the archive offers almost nothing. The gods once walked among mortals in a time so distant that even myth dares not name it, and this chronicle can begin only where the first recorded histories begin: with kingdoms already at war, and no account of how they came to be.',
          'How long [[dartharion|the Calamity]] held the continent is given as *centuries* and no more precisely. The kingdoms he burned are not named. Neither is the manner of the vision that came to [[arran-herrys|the warlord of the north]], nor the making of [[lamina-firen|the blade]] — the record says only that the oath was sworn, and that the blade was in his hand.',
        ],
      },
    ],
    relacionados: [
      'dartharion',
      'arran-herrys',
      'lamina-firen',
      'queda-de-dartharion',
      'ayren-herrys-i',
      'firen',
    ],
    eras: ['era-mil-reis'],
    alcunhas: ['The Thousand Kings', 'Before the Founding of Firen'],
  },

  {
    chave: 'era-primeira-luz',
    titulo: 'The First Age of Light',
    epiteto: 'The Rise of the Empire',
    categoria: 'era',
    resumo:
      'The rise of the Empire of Aer Firen — and the Young King’s vanishing in the Citadel of Glass.',
    brasao: 'sol',
    periodo: 'Year 0 — 327',
    ordem: 2,
    ficha: [
      { rotulo: 'Period', valor: 'Year 0 — 327' },
      { rotulo: 'Order', valor: 'The second age of the chronicle' },
      { rotulo: 'Begins With', valor: 'The crowning of Ayren Herrys I, second High King' },
      { rotulo: 'Sovereign Power', valor: 'The Empire of Aer Firen' },
      { rotulo: 'Great War', valor: 'The Verdant War, upon the fey continent of Fentor' },
      { rotulo: 'Ends With', valor: 'The Young King’s disappearance at Luctos' },
    ],
    epigrafe:
      'The Citadel of Glass, the only remnant of that city, stands as a grim monument to that mysterious night.',
    secoes: [
      {
        titulo: 'The Crowning and the Count of Years',
        paragrafos: [
          'With [[dartharion|Dartharion]] dead, [[ayren-herrys-i|Ayren Herrys I]] was crowned second High King of [[firen|Firen]], and from that crowning the official calendar used across Valoran takes its first year. Every date set down in this chronicle, before it and after it, is measured from that day.',
          'Though his kingdom was strong, it was but a foundation for what was to come. Over generations [[firen|Firen]] expanded, bringing stability where once there had been only war — built not by conquest alone, but through diplomacy, trade and alliance.',
        ],
      },
      {
        titulo: 'The Young King',
        paragrafos: [
          'It was in this age that the Young King, [[ayren-herrys-ii|Ayren Herrys II]], brought [[firen|Firen]] to its greatest heights. A visionary and a conqueror, he took the throne at fifteen, subjugated the resistance of the nobility and of [[igreja-dos-doze|the Church]] alike, and pushed his realm beyond the northern plateau, leading his armies through [[ashara|the Ashara Plains]] and further still, consolidating domain over the entire continent. So the Kingdom of Firen became [[imperio-aer-firen|the Empire of Aer Firen]].',
          'Yet his most infamous war was fought not upon Valoran at all.',
        ],
      },
      {
        titulo: 'The Verdant War',
        paragrafos: [
          '[[guerra-verdejante|The Verdant War]], as it was called, was waged through means never before seen: [[naus-oraculo|the Oracle Ships]], mighty vessels capable of traversing [[mar-astral|the Astral Sea]], which carried an invasion upon the fey continent of [[fentor|Fentor]] and the [[corte-seelie|Seelie Court]] that held it.',
          'The push of the empire’s golden host was ended only when [[primeiro-bellias|a warrior of giant’s blood]] — later named, posthumously, the first of [[casa-bellias|House Bellias]] — slew a primordial horror the [[corte-seelie|Seelie]] had unleashed in the war. The death of such a beast brought the Court’s surrender, and with it a pact of non-interference between the two ruling powers.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The Young King’s ambitions did not end with [[fentor|the fey continent]]. He turned his gaze inward, seeking knowledge long buried, and in doing so turned toward the region now known as [[luctos|Luctos]], strewn with the ruins of old civilisations. What happened next remains shrouded, for [[igreja-dos-doze|the Church of the Twelve]] has preserved only fragments of the tale, and fragments are all that have reached this desk.',
          'What is known is this: he built a grand capital in [[luctos|Luctos]], and in [[noite-de-luctos|a single night]] it was reduced to ruin. [[cidadela-de-vidro|The Citadel of Glass]], the sole remnant of that city, still stands above the rubble.',
          'Of the king himself the archive is not even consistent with itself: in one place it speaks of his *death*, in another of his *disappearance*, and it does not reconcile the two. What is agreed is only the consequence — [[imperio-aer-firen|the empire]] fell into disorder, and [[era-sombria|the long dark]] followed.',
        ],
      },
    ],
    relacionados: [
      'ayren-herrys-ii',
      'imperio-aer-firen',
      'guerra-verdejante',
      'noite-de-luctos',
      'cidadela-de-vidro',
      'naus-oraculo',
    ],
    eras: ['era-primeira-luz'],
    alcunhas: ['First Light', 'The Age of the Young King'],
  },

  {
    chave: 'era-sombria',
    titulo: 'The Dark Age',
    epiteto: 'The Shattered Empire',
    categoria: 'era',
    resumo:
      'A shattered empire, from whose corpse the great noble Houses first carved their fiefdoms.',
    brasao: 'eclipse',
    periodo: 'Year 327 — 687',
    ordem: 3,
    ficha: [
      { rotulo: 'Period', valor: 'Year 327 — 687' },
      { rotulo: 'Order', valor: 'The third age of the chronicle' },
      { rotulo: 'Condition', valor: 'The empire fractured; the capital abandoned' },
      { rotulo: 'Houses Risen', valor: 'House Draco, in Endor; House Bellias, in Aranti' },
      { rotulo: 'Ends With', valor: 'The rise of the White Queen' },
    ],
    epigrafe: 'But from the darkness, a new ruler emerged.',
    secoes: [
      {
        titulo: 'The Shattering',
        paragrafos: [
          'The death of the Young King, [[ayren-herrys-ii|Ayren Herrys II]], shattered the unity he had built. [[firen|Firen]] fractured, and across Valoran lords and warlords carved their own fiefdoms from [[imperio-aer-firen|the empire’s]] corpse. The once-great capital at [[luctos|Luctos]] lay abandoned, and the realm’s stability crumbled beneath endless conflict.',
        ],
      },
      {
        titulo: 'Houses Out of the Ruin',
        paragrafos: [
          'It was in this chaos that many noble houses first rose to prominence, seeking to fill the void left by the empire. Among them [[casa-draco|House Draco]], descended from the bloodline of [[rhogar|Rhogar]], which secured its hold over the lands of [[endor|Endor]] and stood as a shield against the invading [[horda-da-mao-vermelha|Horde of the Red Hand]] out of [[khorvari|the Coast of Khorvari]].',
          '[[casa-bellias|House Bellias]], whose founder had been declared a hero of [[guerra-verdejante|the Verdant War]] an age before, became the rulers of [[aranti|Aranti]].',
        ],
      },
      {
        titulo: 'The Waning of the Church',
        paragrafos: [
          'Though [[igreja-dos-doze|the Church of the Twelve]] sought to maintain order, even its influence waned in this time. The empire, it seemed, was truly lost.',
          'That it was not lost — that a ruler would emerge from the darkness and bind the continent again — belongs to [[era-segunda-luz|the age that follows]], and was visible to no one living through this one.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Three hundred and sixty years pass here with almost no names in them. Of the countless lords who carved fiefdoms out of the wreck, the archive preserves two houses — [[casa-draco|Draco]] and [[casa-bellias|Bellias]] — and of the wars fought between all the rest, nothing: no battle, no siege, no treaty, no year.',
          'What [[casa-herrys|House Herrys]] held through those centuries, if it held anything at all, is likewise unrecorded — though the ruler who ended the age, [[mayan-herrys|the White Queen]], bore its name.',
        ],
      },
    ],
    relacionados: [
      'casa-draco',
      'casa-bellias',
      'igreja-dos-doze',
      'horda-da-mao-vermelha',
      'noite-de-luctos',
      'mayan-herrys',
    ],
    eras: ['era-sombria'],
    alcunhas: ['The Dark Ages', 'The Age of Fiefdoms'],
  },

  {
    chave: 'era-segunda-luz',
    titulo: 'The Second Age of Light',
    epiteto: 'The Reign of the White Queen',
    categoria: 'era',
    resumo:
      'The White Queen unites Valoran through wisdom — but Sindaren is torn from the world.',
    brasao: 'aurora',
    periodo: 'Year 687 — 1284',
    ordem: 4,
    ficha: [
      { rotulo: 'Period', valor: 'Year 687 — 1284' },
      { rotulo: 'Order', valor: 'The fourth age of the chronicle' },
      { rotulo: 'Sovereign', valor: 'Mayan Herrys, the White Queen' },
      { rotulo: 'Houses Raised', valor: 'Orhys, Vinco, Sturm — and Keaton, by ascription' },
      { rotulo: 'Great Wound', valor: 'The Theft of Sindaren, and the rift it opened' },
      { rotulo: 'Ends With', valor: 'The passing of the Queen' },
    ],
    epigrafe:
      'The planar rift left in its wake allowed horrors to spill into the land — chief among them the Yuan-Ti, serpentfolk who invaded the broken realm.',
    secoes: [
      {
        titulo: 'The White Queen',
        paragrafos: [
          'Born with celestial radiance, [[mayan-herrys|Mayan Herrys]] — the woman who would become known as the White Queen — united Valoran once more, not through war but through wisdom. She forged alliances where others had sought dominion, bringing peace to the continent for the first time in centuries. Under her rule [[imperio-aer-firen|the empire]] flourished once more.',
        ],
      },
      {
        titulo: 'A Crown’s Harvest of Houses',
        paragrafos: [
          'Many noble houses and branch families rose in this period, through marriages and alliances arranged by the crown. The nobility of [[casa-orhys|House Orhys]], though officially recorded as a grant to a prolific merchant, is followed by whispers that the leaders of [[rhydash|Rhydash]] once led a rebellion before they received their title.',
          '[[casa-vinco|House Vinco]] was born out of [[horda-da-mao-vermelha|the Horde of the Red Hand]] itself, becoming the defenders of [[khorvari|the Khorvari Coast]] it had once raided. The origins of [[casa-keaton|House Keaton]] are also ascribed to this period, but they are entirely unknown.',
        ],
      },
      {
        titulo: 'The Theft of Sindaren',
        paragrafos: [
          'Even her age was not without tragedy, and the greatest of these was [[roubo-de-sindaren|the Theft of Sindaren]]. In an act of magical devastation, a cabal of archmages tore the inland ocean from Valoran, leaving behind [[cascata-eterna|the Eternal Waterfall]], which now spills endlessly into the void of [[mar-astral|the Astral Sea]].',
          'The planar rift left in its wake allowed horrors to spill into the land — chief among them [[yuan-ti|the Yuan-Ti]], serpentfolk who invaded the broken realm. It was only through the combined efforts of [[casa-deallus|House Deallus]] and a host of warriors from [[montanhas-orientais|the eastern mountains]], descendants of giants, that the invaders were repelled.',
          'In recognition of their valour, those warriors were granted the noble title of [[casa-sturm|House Sturm]] and dominion over the swamplands of [[ershen|Ershen]]. [[casa-deallus|House Deallus]], once rulers of a vast and thriving land, remained a shadow of their former selves, left to guard [[cascata-eterna|the waterfall]] where [[sindaren|their realm]] had been.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The cabal is not named. Neither its purpose, nor its number, nor whether any of them survived the working. [[roubo-de-sindaren|The Theft]] is set down as a thing that was done, with no hand attached to it.',
          'Of the elves whose people ruled that inland realm in the age of the founding — the kin of [[sellias-delios|Sellias “Moonwhisper” Deios]] — and of what became of them when their ocean was taken from the world, this chronicle says nothing whatever.',
          'Nor does it explain the length of the reign it praises. [[mayan-herrys|The Queen’s]] rule is given as lasting for centuries, and then, without further comment, as ending: *all things must end*. With her passing, a new age dawned.',
        ],
      },
    ],
    relacionados: [
      'mayan-herrys',
      'roubo-de-sindaren',
      'cascata-eterna',
      'yuan-ti',
      'casa-sturm',
      'casa-deallus',
    ],
    eras: ['era-segunda-luz'],
    alcunhas: ['Second Light', 'The Age of the White Queen'],
  },

  {
    chave: 'era-moderna',
    titulo: 'The Modern Age',
    epiteto: 'The Age of the Golden Tyrant',
    categoria: 'era',
    resumo:
      'Recovering from war and plague, the continent bends beneath the Golden Tyrant, Carsaros.',
    brasao: 'fumaca',
    periodo: 'Year 1284 — 1570',
    ordem: 5,
    ficha: [
      { rotulo: 'Period', valor: 'Year 1284 — 1570' },
      { rotulo: 'Order', valor: 'The fifth age of the chronicle — the present one' },
      { rotulo: 'Sovereign', valor: 'Ayren Herrys IV, called Carsaros, the Golden Tyrant' },
      { rotulo: 'Wars', valor: 'The War of the Winds, and the Hōseki remnants after it' },
      { rotulo: 'Calamity', valor: 'The Red Year, upon the Ashara Plains' },
      { rotulo: 'Set Down', valor: 'Anno 1570, in the Imperial Archives' },
    ],
    epigrafe: 'Yet, as history has shown, no reign lasts forever.',
    secoes: [
      {
        titulo: 'A Quiet Inheritance',
        paragrafos: [
          'The death of [[mayan-herrys|the White Queen]] marked the beginning of the modern age, though for a time stability remained. The rulers who followed in her wake were unremarkable, governing without great triumphs or great calamities. Two events, however, shook the continent before the rise of [[ayren-herrys-iv|the ruler who holds the throne now]].',
        ],
      },
      {
        titulo: 'The War of the Winds',
        paragrafos: [
          'The first was [[guerra-dos-ventos|the War of the Winds]], fought against [[dinastia-hoseki|the Hōseki Dynasty]] of [[yoso|Yōso]]. It ended with the assassination of [[imperatriz-hoseki|the Hōseki Empress]], her corpse discovered with the banner of [[casa-keaton|House Keaton]] — a house unknown to all but the imperial family — pierced through her body.',
          'Who carried that banner, and upon whose word, the record does not say, and this scholar has found no archive in the capital that does. What is certain is that remnants of the [[dinastia-hoseki|Hōseki]] forces still remained upon Valoran, sparking many conflicts over the decades that followed.',
        ],
      },
      {
        titulo: 'The Red Year',
        paragrafos: [
          'The second was a plague, known only as [[ano-vermelho|the Red Year]], that ravaged [[ashara|the Ashara Plains]]. It was contained before it could spread to the remainder of the continent, but its scars remain in the memories of those who suffered through it, driving many to migrate to [[rhydash|Rhydash]] in search of a better life.',
        ],
      },
      {
        titulo: 'The Golden Tyrant',
        paragrafos: [
          'Now, recovering from war and famine, [[imperio-aer-firen|the empire]] is ruled by [[ayren-herrys-iv|Ayren Herrys IV]] — nicknamed *Carsaros*, the Golden Tyrant, by some — a celestial-blooded emperor with a single wing. His rule is one of heavy taxation and military might, and under him the empire has discovered the power of [[lanca-divina|the Divine Lance]], harnessing it as a weapon to crush dissidence.',
          'From [[era-mil-reis|the Age of a Thousand Kings]] to the present, rulers have risen and fallen, and the fate of Valoran remains ever uncertain. Perhaps, in the coming years, we shall bear witness to the dawn of another age — whether of light or of darkness remains to be seen.',
          'Here the record halts, for it can go no further than the year in which it is written. What the archive holds of ages past is set down above; what this age becomes, another hand must add.',
        ],
      },
    ],
    relacionados: [
      'ayren-herrys-iv',
      'guerra-dos-ventos',
      'ano-vermelho',
      'lanca-divina',
      'casa-keaton',
      'dinastia-hoseki',
    ],
    eras: ['era-moderna'],
    alcunhas: ['The Present Age', 'Anno 1570'],
  },
];
