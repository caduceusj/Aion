/**
 * Códice de Valoran — os seis eventos que viraram as eras.
 *
 * Uma queda de dragão, duas guerras, um roubo, uma noite e uma peste. Cada
 * verbete responde às mesmas perguntas de ficha — quando, onde, entre quem,
 * com que resultado, com que herança — porque é assim que um arquivo compara
 * catástrofes que estão a mil anos de distância uma da outra.
 *
 * O material vem de "The Annals of Valoran", documento de autoria do usuário,
 * atribuído em ficção a Maedrin Rimors, Scholar of the Imperial Archives, Anno
 * 1570. A prosa fica em inglês de propósito: é a língua do original e a voz do
 * cronista. Só o código em volta é comentado em português.
 *
 * Dois destes verbetes são buracos, não relatos. Da Noite de Luctos a crônica
 * guarda uma frase e um monumento; do Roubo de Sindaren, um efeito sem autores.
 * Nenhum dos dois é preenchido aqui. A seção "What the Record Does Not Say"
 * existe justamente para nomear com precisão o que falta — um mistério bem
 * delimitado vale mais, para a mesa, que um mistério resolvido às pressas.
 *
 * `brasao` empresta o glifo da era ou da relíquia que melhor marca o evento.
 */

import type { Verbete } from '../tipos';

export const EVENTOS: Verbete[] = [
  {
    chave: 'queda-de-dartharion',
    titulo: 'The Felling of Dartharion',
    epiteto: 'The Fall of the Calamity',
    categoria: 'evento',
    resumo:
      'Four heroes led a grand alliance against the dragon who had shadowed the continent for centuries, and felled him.',
    brasao: 'dragao',
    ficha: [
      { rotulo: 'When', valor: 'The close of the Age of a Thousand Kings' },
      { rotulo: 'Where', valor: 'Unrecorded — the burnt kingdom of Firen is the only ground named' },
      { rotulo: 'Belligerents', valor: 'A grand alliance of four heroes against Dartharion, the Calamity' },
      { rotulo: 'Outcome', valor: 'The draconic overlord slain; Ayren Herrys I crowned second High King' },
      { rotulo: 'Legacy', valor: 'Valoran counts its years from the crowning that followed — Year 0' },
    ],
    epigrafe: 'Their victory marked the dawn of a new era.',
    secoes: [
      {
        titulo: 'The Account',
        paragrafos: [
          'Before the count of years, Valoran was a land of endless war: countless kingdoms, city-states and wandering clans, each contending for its corner of the land, fighting with steel and with faith alike, calling upon [[os-doze|the Twelve]] for the strength to carve their names into eternity. Over all of it, for centuries, lay the shadow of [[dartharion|Dartharion]], the Calamity. When [[arran-herrys|Arran Herrys]] bound the warring clans of the north into the kingdom of [[firen|Firen]] with the sacred blade [[lamina-firen|Firen]] in his hand, the dragon turned his gaze upon the emerging kingdom and buried it in unholy fire.',
          'From that chaos rose four whose deeds would shape the destiny of the continent. [[ayren-herrys-i|Ayren Herrys I]], son of the warlord who had first united the north, sought revenge for the destruction of his kingdom; [[darron-alabaster|Darron Alabaster]], chief of the dwarves, led his people down from the mountains to join the great cause; [[sellias-delios|Sellias “Moonwhisper” Deios]], came out of [[sindaren|Sindaren]], which his people still ruled; and [[rhogar|Rhogar]], the half-dragon barbarian, carried the blood of dragons into a war against a dragon. Together they led a grand alliance against their draconic overlord, and felled him.',
        ],
      },
      {
        titulo: 'Consequences',
        paragrafos: [
          'With the Calamity dead, [[ayren-herrys-i|Ayren Herrys I]] was crowned second High King of [[firen|Firen]], and from that crowning the continent counts its years. The victory is the hinge between [[era-mil-reis|the age of a thousand kings]] and [[era-primeira-luz|the light that followed]]: what the father had founded upon a vision, the son rebuilt upon a grave, and in later generations that kingdom would become [[imperio-aer-firen|an empire]].',
          'The alliance outlived the alliance. [[rhogar|Rhogar]]’s blood became [[casa-draco|House Draco]], which holds [[endor|Endor]] as the shield of the realm to this day, and the line of Herrys has never yet left the throne. The other two heroes left no such inheritance in the record — and [[sindaren|Sindaren]] itself, the realm [[sellias-delios|Sellias Delios]] came from, would in a later age be [[roubo-de-sindaren|torn out of the world]] altogether.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Of the war itself, almost nothing. Where [[dartharion|the Calamity]] was met, how long the alliance campaigned against him, and by whose hand the killing blow was struck are all absent. Nor does the chronicle describe the centuries of his rule: whether he held a court, commanded servants, or exacted tribute, or whether he simply burned what displeased him. He is named an overlord, and that word is the whole of his dominion as this account has it.',
          'Neither is the alliance explained. How a human claimant, a dwarven chief, an elven leader and a half-dragon barbarian were brought into a single host — who sought whom, and what was promised — the record omits, and it does not follow [[darron-alabaster|Darron Alabaster]] or [[sellias-delios|Sellias Delios]] past the day of the victory.',
        ],
      },
    ],
    relacionados: ['dartharion', 'ayren-herrys-i', 'rhogar', 'darron-alabaster', 'sellias-delios', 'era-mil-reis'],
    eras: ['era-mil-reis'],
    alcunhas: ['The Fall of Dartharion', 'The Felling of the Calamity'],
  },

  {
    chave: 'guerra-verdejante',
    titulo: 'The Verdant War',
    epiteto: 'The Invasion of Fentor',
    categoria: 'evento',
    resumo:
      'The Young King’s war upon the fey continent, carried across the Astral Sea and ended by a single warrior’s last kill.',
    brasao: 'folha',
    ficha: [
      { rotulo: 'When', valor: 'The First Age of Light, in the reign of Ayren Herrys II' },
      { rotulo: 'Where', valor: 'Fentor, the fey continent, beyond the Astral Sea' },
      { rotulo: 'Belligerents', valor: 'The Empire of Aer Firen against the Seelie Court' },
      { rotulo: 'Outcome', valor: 'The Seelie Court surrendered; a pact of non-interference was struck' },
      { rotulo: 'Legacy', valor: 'House Bellias, raised upon a posthumous name, and the realm of Aranti' },
    ],
    epigrafe: 'His most infamous war was fought not upon Valoran, but against the Seelie Court of Fentor.',
    secoes: [
      {
        titulo: 'The Account',
        paragrafos: [
          '[[ayren-herrys-ii|The Young King]] had already made a kingdom into [[imperio-aer-firen|the Empire of Aer Firen]], subjugating the resistance of the nobility and of [[igreja-dos-doze|the Church]] and driving his armies past the northern plateau and through the [[ashara|Ashara Plains]] until the continent was his. His most infamous war, however, was not fought upon Valoran at all. It was carried against [[corte-seelie|the Seelie Court]] of [[fentor|Fentor]], and waged by means never before seen: the [[naus-oraculo|Oracle Ships]], vessels able to traverse [[mar-astral|the Astral Sea]], bore an invasion onto the fey continent itself.',
          'The push of the empire’s golden host was ended only when a warrior of giant’s blood — [[primeiro-bellias|named afterward, and posthumously, the first of House Bellias]] — slew a primordial horror of the Seelie unleashed in the war. The death of such a beast brought [[corte-seelie|the Court]] to surrender, and the two ruling powers struck a pact of non-interference between them. The man who won the war did not live to hear its terms.',
        ],
      },
      {
        titulo: 'Consequences',
        paragrafos: [
          'The pact set the two powers apart, and the war left Valoran a house. [[primeiro-bellias|The slayer]] was declared a hero of the fighting, and [[casa-bellias|House Bellias]] — a lineage raised upon a dead man’s name — came in time to rule [[aranti|Aranti]], though the chronicle places that grant amid [[era-sombria|the disorder]] that followed the empire’s fracture rather than in the reign that won the victory. The [[naus-oraculo|Oracle Ships]], for their part, had proved a thing few would have credited: that [[mar-astral|the Astral Sea]] can be crossed with an army aboard.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'No cause is given. The chronicle offers no grievance, no disputed border, no broken oath between [[imperio-aer-firen|the empire]] and [[corte-seelie|the Seelie Court]] — only that [[ayren-herrys-ii|the Young King]] made the war, as though ambition were explanation enough. Its years, its length, and the shape of its campaigns upon [[fentor|Fentor]] are equally absent.',
          'The victor is a blank where a name should stand: [[primeiro-bellias|the giant-blooded warrior]] survives only through the house that carries his honour. What the primordial horror was, and who unleashed it, the account does not say; nor what the pact bound each side to beyond non-interference, whether it is still kept, and whether a single [[naus-oraculo|Oracle Ship]] still sails.',
        ],
      },
    ],
    relacionados: ['ayren-herrys-ii', 'primeiro-bellias', 'corte-seelie', 'naus-oraculo', 'fentor', 'casa-bellias'],
    eras: ['era-primeira-luz'],
  },

  {
    chave: 'noite-de-luctos',
    titulo: 'The Night of Luctos',
    epiteto: 'The Vanishing of the Young King',
    categoria: 'evento',
    resumo:
      'In a single night a grand capital was reduced to ruin and the Young King was gone; the Church kept only fragments.',
    brasao: 'cidadela',
    ficha: [
      { rotulo: 'When', valor: 'The First Age of Light, at the end of the reign of Ayren Herrys II' },
      { rotulo: 'Where', valor: 'Luctos, a region strewn with the ruins of old civilizations' },
      { rotulo: 'Outcome', valor: 'The capital reduced to ruin in one night; the Young King never seen again' },
      { rotulo: 'What Survives', valor: 'The Citadel of Glass, and fragments preserved by the Church of the Twelve' },
      { rotulo: 'Legacy', valor: 'The empire fell into disorder, and the Dark Age began' },
    ],
    epigrafe:
      'The Citadel of Glass, the only remnant of that city, stands as a grim monument to that mysterious night.',
    secoes: [
      {
        titulo: 'The Account',
        paragrafos: [
          'Having taken the continent, [[ayren-herrys-ii|the Young King]] turned his gaze inward, seeking knowledge long buried, and so turned toward the region now known as [[luctos|Luctos]] — a land strewn with the ruins of old civilizations. There he built a grand capital. In a single night, it was reduced to ruin.',
          'Those three sentences are very nearly the whole of what is known. What happened next remains shrouded in mystery, for [[igreja-dos-doze|the Church of the Twelve]] has preserved only fragments of the tale. The [[cidadela-de-vidro|Citadel of Glass]] is the sole remnant of that city, and it stands as a grim monument to the night that took the rest.',
        ],
      },
      {
        titulo: 'Consequences',
        paragrafos: [
          'With his disappearance [[imperio-aer-firen|the empire]] fell into disorder, and the unity he had built shattered with him. [[firen|Firen]] fractured; the once-great capital lay abandoned; across Valoran lords and warlords carved their own fiefdoms out of the empire’s corpse, and [[era-sombria|the Dark Age]] began. It was in that void that [[casa-draco|House Draco]] secured [[endor|Endor]] against [[horda-da-mao-vermelha|the Horde of the Red Hand]] and [[casa-bellias|House Bellias]] rose to rule [[aranti|Aranti]] — the great houses of the present are, in no small part, the inheritance of one night’s ruin.',
          'Even [[igreja-dos-doze|the Church]], which sought to keep order in the wreckage, watched its own influence wane. Three hundred and sixty years passed before [[mayan-herrys|the White Queen]] gathered the continent again.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'This is the largest hole in the chronicle, and it deserves to be named precisely rather than filled. What destroyed the city is unknown — whether an enemy, an accident, a working of [[ayren-herrys-ii|the Young King]]’s own, or something already sleeping beneath [[luctos|Luctos]] before he built above it. What knowledge he sought among the ruins of the old civilizations, and whether he found it, is unknown. Whether anyone at all survived the night is unknown.',
          'The king’s fate is not merely unrecorded but unresolved. The account speaks in one breath of his *disappearance* and in the next of *the death of the Young King*, and never reconciles the two: no body is named, no grave, no successor raised by his hand. And the deepest silence is a kept one — [[igreja-dos-doze|the Church]] holds fragments, and the record does not say what those fragments contain, nor whether more is held than has ever been shown to a scholar of the archives.',
        ],
      },
    ],
    relacionados: ['ayren-herrys-ii', 'luctos', 'cidadela-de-vidro', 'igreja-dos-doze', 'imperio-aer-firen', 'era-sombria'],
    eras: ['era-primeira-luz'],
    alcunhas: ['The Ruin of Luctos'],
  },

  {
    chave: 'roubo-de-sindaren',
    titulo: 'The Theft of Sindaren',
    epiteto: 'The Wound in the World',
    categoria: 'evento',
    resumo:
      'A cabal of archmages tore the inland ocean from Valoran, leaving an endless waterfall and a rift that let horrors in.',
    brasao: 'cascata',
    ficha: [
      { rotulo: 'When', valor: 'The Second Age of Light, in the reign of Mayan Herrys' },
      { rotulo: 'Where', valor: 'Sindaren, the inland ocean of Valoran' },
      { rotulo: 'Belligerents', valor: 'An unnamed cabal of archmages; then the Yuan-Ti against Deallus and the giants of the east' },
      { rotulo: 'Outcome', valor: 'The ocean torn from the world; the invaders repelled; the rift left open' },
      { rotulo: 'Legacy', valor: 'House Sturm ennobled in Ershen; House Deallus left a shadow of itself' },
    ],
    epigrafe: 'The planar rift left in its wake allowed horrors to spill into the land.',
    secoes: [
      {
        titulo: 'The Account',
        paragrafos: [
          'The reign of [[mayan-herrys|the White Queen]] was an age of alliances and of peace, and it was not without tragedy; the greatest of these was this one. In an act of magical devastation, a cabal of archmages tore the inland ocean of [[sindaren|Sindaren]] out of Valoran. What they left behind is the [[cascata-eterna|Eternal Waterfall]], which spills without end into the void of [[mar-astral|the Astral Sea]].',
          'The wound did not close. The planar rift left in its wake allowed horrors to spill into the land, chief among them the [[yuan-ti|Yuan-Ti]], serpentfolk who invaded the broken realm. They were driven out only through the combined efforts of [[casa-deallus|House Deallus]], whose ocean it had been, and a host of warriors out of the [[montanhas-orientais|eastern mountains]] — descendants of giants.',
        ],
      },
      {
        titulo: 'Consequences',
        paragrafos: [
          'Two houses came out of that defence changed. The mountain warriors were granted a noble title in recognition of their valour, and dominion over the swamplands of [[ershen|Ershen]], becoming [[casa-sturm|House Sturm]]. [[casa-deallus|House Deallus]], once rulers of a vast and thriving land, remained a shadow of their former selves, left to keep the [[cascata-eterna|waterfall]] that pours where their realm used to be.',
          'The loss reaches back further than the age that suffered it. [[sindaren|Sindaren]] was the realm [[sellias-delios|Sellias “Moonwhisper” Deios]] came from — she who led the company that helped [[queda-de-dartharion|fell the Calamity]] — and [[povos-lunares|her people]] had held its isles since before the calendar began. Every map drawn since carries a hole where their ocean was.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The archmages are a cabal and nothing further: their number, their names, their origin and their purpose are all absent, as is any account of what became of them afterward. Whether they meant to steal the ocean or merely to break it, the record does not say — and so it cannot say whether the theft succeeded, nor where the water goes, nor whether [[sindaren|Sindaren]] persists somewhere on the far side of the fall.',
          'Nor is the crown’s answer written down. [[mayan-herrys|The White Queen]] reigned through the calamity, yet no hunt, no judgement and no reprisal is set beside it. What became of the people who lived upon that ocean is likewise unwritten. And whether the rift has been closed or is merely watched by [[casa-deallus|House Deallus]] is the question this scholar would most like answered.',
        ],
      },
    ],
    relacionados: ['vrednost', 'valari', 'andari', 'escola-arkanheim', 'sindaren', 'cascata-eterna', 'yuan-ti', 'casa-deallus', 'casa-sturm', 'mayan-herrys'],
    eras: ['era-segunda-luz'],
    alcunhas: ['The Theft of the Inland Ocean'],
  },

  {
    chave: 'guerra-dos-ventos',
    titulo: 'The War of the Winds',
    epiteto: 'The War Against Yōso',
    categoria: 'evento',
    resumo:
      'The empire’s war upon the Hōseki Dynasty, ended by an assassination and a banner only the crown could name.',
    brasao: 'serpente-imperial',
    ficha: [
      { rotulo: 'When', valor: 'The Modern Age, after the White Queen and before the Golden Tyrant' },
      { rotulo: 'Where', valor: 'Against Yōso; its remnants fought on within Valoran' },
      { rotulo: 'Belligerents', valor: 'The Empire of Aer Firen against the Hōseki Dynasty' },
      { rotulo: 'Outcome', valor: 'Ended with the assassination of the Hōseki Empress' },
      { rotulo: 'Legacy', valor: 'Hōseki remnants upon Valoran, and decades of conflict after the war' },
    ],
    epigrafe:
      'Her corpse discovered with the banner of House Keaton — a house unknown to all but the imperial family — pierced through her body.',
    secoes: [
      {
        titulo: 'The Account',
        paragrafos: [
          'After the passing of [[mayan-herrys|the White Queen]] the continent held its stability for a time, governed by rulers the chronicle calls unremarkable, without great triumphs or great calamities. Two events broke that quiet before the present reign, and the first was a war fought against the [[dinastia-hoseki|Hōseki Dynasty]] of [[yoso|Yōso]].',
          'It ended in a murder rather than a treaty. The [[imperatriz-hoseki|Hōseki Empress]] was assassinated, and her corpse was discovered with the banner of [[casa-keaton|House Keaton]] pierced through her body — a house unknown to all but the imperial family.',
        ],
      },
      {
        titulo: 'Consequences',
        paragrafos: [
          'The ending settled nothing. Remnants of the [[dinastia-hoseki|Hōseki]] forces remained upon Valoran and sparked many conflicts over the decades that followed, so that the empire [[ayren-herrys-iv|Ayren Herrys IV]] inherited was one still recovering from that war. The banner has been read ever since as a signature: the record notes that [[casa-keaton|Keaton]] colours have been found pierced through the corpses of slain foreign rulers, in the plural, though this is the only such killing it names.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Why the war began is unrecorded, as are its years, its battles, and whether an imperial soldier ever set foot upon [[yoso|Yōso]] at all. How [[imperatriz-hoseki|the Empress]] was killed, by whose hand, and who found her, the account does not say — nor whether the crown ordered it, and if it did, whether the banner was left as a message, a claim, or a slander against a name that cannot answer.',
          '[[casa-keaton|House Keaton]] is the deeper blank. No seat, no blood and no founding are written down, only that it is known to none but the imperial family and that its banner turns up in dead rulers. Of [[dinastia-hoseki|the Hōseki]] after the assassination — whether the dynasty fell, endured, or still holds [[yoso|Yōso]] — the chronicle says nothing beyond the remnants that remained on this continent.',
        ],
      },
    ],
    relacionados: ['dinastia-hoseki', 'imperatriz-hoseki', 'casa-keaton', 'yoso', 'era-moderna'],
    eras: ['era-moderna'],
    alcunhas: ['The War Against the Hōseki Dynasty'],
  },

  {
    chave: 'ano-vermelho',
    titulo: 'The Red Year',
    epiteto: 'The Plague of Ashara',
    categoria: 'evento',
    resumo:
      'The plague that ravaged the Ashara Plains, contained before it could cross the continent but never forgotten.',
    brasao: 'fumaca',
    ficha: [
      { rotulo: 'When', valor: 'The Modern Age, before the rise of Ayren Herrys IV' },
      { rotulo: 'Where', valor: 'The Ashara Plains' },
      { rotulo: 'Outcome', valor: 'Contained before it could spread to the remainder of the continent' },
      { rotulo: 'Legacy', valor: 'Migration to Rhydash, and the memory of those who lived through it' },
      { rotulo: 'Name', valor: 'None is recorded for the sickness itself — only for the year' },
    ],
    epigrafe: 'Its scars remain in the memories of those who suffered through it.',
    secoes: [
      {
        titulo: 'The Account',
        paragrafos: [
          'The second calamity of the modern age was not a war. A plague — remembered only as the Red Year, for the chronicle preserves no other name for it — ravaged the [[ashara|Ashara Plains]], the same open country [[ayren-herrys-ii|the Young King]] had crossed generations before on his march of conquest. It was contained before it could spread to the remainder of the continent, but its scars remain in the memory of everyone who suffered through it.',
        ],
      },
      {
        titulo: 'Consequences',
        paragrafos: [
          'What the sickness did not take, it drove out. Many left the plains for [[rhydash|Rhydash]] in search of a better life, and the merchant city of [[casa-orhys|House Orhys]] has carried that influx ever since. The empire [[ayren-herrys-iv|Ayren Herrys IV]] came to rule was thus recovering from war and pestilence at once — and it is against that exhaustion that the chronicle sets his reign of heavy taxation and military might, and the [[lanca-divina|Divine Lance]] raised over it.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Nearly everything a physician would wish to know. The years of the outbreak, the count of its dead, the nature of the sickness and the reason it is called red are all unwritten. Who contained it, and by what means — cordon, medicine, prayer to [[os-doze|the Twelve]], or simple distance — the account does not say, and it does not say whether [[ashara|the plains]] have recovered or merely emptied.',
          'There is also a discrepancy this scholar will not paper over. The chronicle summarises the age in one place as recovering from war and *plague*, and in another as recovering from war and *famine*. Whether hunger followed the sickness across [[ashara|Ashara]], or whether one of the two words is a slip of the pen, cannot be settled from the record as it stands.',
        ],
      },
    ],
    relacionados: ['ashara', 'rhydash', 'casa-orhys', 'ayren-herrys-iv', 'era-moderna'],
    eras: ['era-moderna'],
    alcunhas: ['The Plague of the Ashara Plains'],
  },
];
