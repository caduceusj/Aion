/**
 * Códice de Valoran — as oito casas nobres.
 *
 * Cada verbete guarda o sangue, a sede e a mágoa de uma casa: como ela subiu,
 * o que ela segura e o que ela perdeu. É a gaveta mais interligada do códice,
 * porque nenhuma casa se explica sozinha — Draco só faz sentido diante da
 * Horda, Vinco só faz sentido diante de Draco, Sturm só faz sentido diante do
 * Roubo de Sindaren.
 *
 * O material vem de "The Annals of Valoran", documento de autoria do usuário,
 * atribuído em ficção a Maedrin Rimors, Scholar of the Imperial Archives, Anno
 * 1570 — do capítulo "The Great Houses" e do que a crônica das cinco eras diz
 * sobre cada linhagem. A prosa fica em inglês de propósito: é a língua do
 * original e a voz do cronista. Só o código em volta é comentado em português.
 *
 * Nada aqui é inventado. Onde o original silencia, o verbete confessa o
 * silêncio — daí as seções que admitem ignorância em vez de preenchê-la. Casa
 * Keaton é quase toda lacuna, e assim deve permanecer: o códice apresenta o
 * mistério, não o resolve.
 *
 * `brasao` é sempre a chave da casa sem o prefixo "casa-", e casa com os
 * escudos desenhados em `heraldica.tsx`.
 */

import type { Verbete } from '../tipos';

export const CASAS: Verbete[] = [
  {
    chave: 'casa-herrys',
    titulo: 'House Herrys',
    epiteto: 'The Celestial Dynasty',
    categoria: 'casa',
    resumo:
      'The celestial-blooded dynasty whose wing and crown has ruled from King Arran to the Golden Tyrant.',
    brasao: 'herrys',
    ficha: [
      { rotulo: 'Seat', valor: 'The Imperial Throne · Firen' },
      { rotulo: 'Blood', valor: 'Celestial' },
      { rotulo: 'Ennobled', valor: 'The Age of a Thousand Kings, when Arran was made High King' },
      { rotulo: 'Sigil', valor: 'The wing and the crown' },
      { rotulo: 'Standing', valor: 'Reigning — the empire is held by Ayren Herrys IV' },
    ],
    epigrafe: 'Yet, as history has shown, no reign lasts forever.',
    secoes: [
      {
        titulo: 'Origin',
        paragrafos: [
          'The house begins with a vision. A great warlord of the northern lands was blessed with the sight of an eternal empire bathed in holy light and swore to make that vision real; as the oath left him he looked down, and the sacred blade [[lamina-firen|Firen]] was in his hand. With it [[arran-herrys|Arran Herrys]] bound the warring clans of the north into one greater kingdom and became the first High King of [[firen|Firen]] — the blade lending its name first to a realm, and at last to [[imperio-aer-firen|an empire]].',
          'That first kingdom was buried in unholy fire when [[dartharion|Dartharion]], the Calamity, turned his gaze north. It fell to the warlord’s son, [[ayren-herrys-i|Ayren Herrys I]], to seek vengeance for it, and to stand in the grand alliance that [[queda-de-dartharion|felled the dragon]] beside [[darron-alabaster|Darron Alabaster]] of the dwarves, [[sellias-delios|Sellias “Moonwhisper” Deios]] of [[sindaren|Sindaren]], and [[rhogar|Rhogar]] of the dragon’s blood. He was crowned the second High King, and from that crowning the calendar of Valoran counts its years.',
        ],
      },
      {
        titulo: 'Domain',
        paragrafos: [
          'The seat has never moved. From [[firen|Firen]] upon the northern plateau the house ruled first a kingdom and then a continent: [[ayren-herrys-ii|Ayren Herrys II]], the Young King, took the throne at fifteen, subjugated the resistance of the nobility and of [[igreja-dos-doze|the Church]], and drove his armies through the [[ashara|Ashara Plains]] and beyond until the kingdom had become [[imperio-aer-firen|the Empire of Aer Firen]]. Nor did the throne stop at the water: aboard the [[naus-oraculo|Oracle Ships]] it reached across [[mar-astral|the Astral Sea]] to make [[guerra-verdejante|war]] upon [[corte-seelie|the Seelie Court]] of [[fentor|Fentor]].',
          'What one Herrys built, another has had to build again. The Young King’s [[noite-de-luctos|vanishing at Luctos]] left the empire in disorder and Valoran to [[era-sombria|the warlords]]; it was [[mayan-herrys|Mayan Herrys]], the White Queen, born with celestial radiance, who united the continent once more — not through war but through wisdom, forging alliances where others had sought dominion, and raising many of the houses in this roll through marriages and alliances arranged by the crown. The throne is now held by [[ayren-herrys-iv|Ayren Herrys IV]], called *Carsaros*, whose heavy taxation and military might are underwritten by the [[lanca-divina|Divine Lance]].',
        ],
      },
      {
        titulo: 'The Crown and Its Keeping',
        paragrafos: [
          'Twice the dynasty has held back what it knows. Of the night that unmade the Young King’s grand capital at [[luctos|Luctos]], [[igreja-dos-doze|the Church of the Twelve]] has preserved only fragments, and the [[cidadela-de-vidro|Citadel of Glass]] stands as the whole of the monument. And of [[casa-keaton|House Keaton]] the chronicle states plainly that it is unknown to all but the imperial family — a sentence that tells the reader less about Keaton than about the crown.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The line between the great names is not drawn. How the crown passed from [[ayren-herrys-i|Ayren Herrys I]] to [[ayren-herrys-ii|the Young King]], and whether [[mayan-herrys|the White Queen]] descends from either, the record does not say; of those who reigned between them it offers only that they were unremarkable, governing without great triumphs or great calamities.',
          'Neither is the celestial blood itself explained — not whence it came, not why it should show in [[ayren-herrys-iv|the present emperor]] as a single wing.',
        ],
      },
    ],
    relacionados: [
      'arran-herrys',
      'ayren-herrys-ii',
      'mayan-herrys',
      'ayren-herrys-iv',
      'imperio-aer-firen',
      'firen',
    ],
    eras: [
      'era-mil-reis',
      'era-primeira-luz',
      'era-sombria',
      'era-segunda-luz',
      'era-moderna',
    ],
    alcunhas: ['Herrys', 'The Imperial House', 'The Wing and Crown'],
  },

  {
    chave: 'casa-draco',
    titulo: 'House Draco',
    epiteto: 'The Shield of Endor',
    categoria: 'casa',
    resumo:
      'Dragon-blooded heirs of Rhogar, holding Endor as the realm’s shield against the Horde of the Red Hand.',
    brasao: 'draco',
    ficha: [
      { rotulo: 'Seat', valor: 'The Lands of Endor' },
      { rotulo: 'Blood', valor: 'Draconic, of Rhogar’s line' },
      { rotulo: 'Ennobled', valor: 'The Dark Age' },
      { rotulo: 'Sigil', valor: 'The dragon, for the blood of Rhogar' },
      { rotulo: 'Standing', valor: 'The shield of the realm at Endor' },
    ],
    epigrafe:
      'Draco stands as the shield of the realm against the Horde of the Red Hand upon the Khorvari Coast.',
    secoes: [
      {
        titulo: 'Origin',
        paragrafos: [
          'After the crown itself, Draco carries the oldest blood in this roll. The house descends from [[rhogar|Rhogar]], the half-dragon barbarian of unmatched fury who carried the blood of dragons in his veins and stood among the four heroes who [[queda-de-dartharion|felled the Calamity]]. What his line did in the ages between, the chronicle does not follow.',
          'It finds the name again only when the empire had come apart. In the disorder that followed [[noite-de-luctos|the Young King’s disappearance]], lords and warlords carved their own fiefdoms from [[imperio-aer-firen|the empire’s]] corpse, and House Draco secured its hold over the lands of [[endor|Endor]] — one of the many houses that first rose to prominence in [[era-sombria|the Dark Age]].',
        ],
      },
      {
        titulo: 'Domain',
        paragrafos: [
          '[[endor|Endor]] is a frontier before it is a fief. The house took it and held it standing as a shield against [[horda-da-mao-vermelha|the Horde of the Red Hand]], which came invading from the [[khorvari|Coast of Khorvari]], and that posture has outlasted the age that made it: in the heraldic roll of this present account Draco is still named the shield of the realm, and the Horde is still named across the water.',
        ],
      },
      {
        titulo: 'The Shield and the Horde',
        paragrafos: [
          'There is an irony here that the record leaves entirely unremarked. The Horde that Draco was raised to hold back was itself reforged in [[era-segunda-luz|the Second Age of Light]] into [[casa-vinco|House Vinco]], ennobled and set as defender over the very coast it had raided — so that the shield and the thing it was raised against now sit as peers beneath one crown.',
          'How the two houses regard one another, whether the old enmity was ever formally set aside, and how [[casa-herrys|the crown]] justified the arrangement to [[endor|Endor]], the chronicle does not say. It records the ennoblement and moves on.',
        ],
      },
    ],
    relacionados: ['rhogar', 'endor', 'horda-da-mao-vermelha', 'casa-vinco', 'khorvari', 'era-sombria'],
    eras: ['era-mil-reis', 'era-sombria', 'era-moderna'],
    alcunhas: ['Draco', 'The Dragon-Blooded'],
  },

  {
    chave: 'casa-bellias',
    titulo: 'House Bellias',
    epiteto: 'Heirs of the Verdant War',
    categoria: 'casa',
    resumo:
      'Raised from a giant-blooded hero who slew a Seelie horror and won the Verdant War; rulers of Aranti since.',
    brasao: 'bellias',
    ficha: [
      { rotulo: 'Seat', valor: 'The Realm of Aranti' },
      { rotulo: 'Blood', valor: 'Giant’s blood' },
      {
        rotulo: 'Ennobled',
        valor: 'The Dark Age — for a deed done in the First Age of Light',
      },
      { rotulo: 'Sigil', valor: 'Granted with Aranti; the roll records no charge' },
      { rotulo: 'Standing', valor: 'Rulers of Aranti since the Dark Age' },
    ],
    epigrafe:
      'The death of such a beast led to the Seelie Court’s surrender, and a pact of non-interference between the two ruling powers.',
    secoes: [
      {
        titulo: 'Origin',
        paragrafos: [
          'The house was made by a single blow, and named for a man already dead. [[guerra-verdejante|The Verdant War]] was waged through means never before seen — the [[naus-oraculo|Oracle Ships]] bearing the empire’s golden host across [[mar-astral|the Astral Sea]] to invade the fey continent of [[fentor|Fentor]] — and the push of that host was ended only when a warrior of giant’s blood slew a primordial horror that [[corte-seelie|the Seelie]] had unleashed in the war.',
          'The death of such a beast brought the Court to surrender, and with it a pact of non-interference between the two ruling powers. The warrior who struck it down was named, posthumously, [[primeiro-bellias|the first of House Bellias]].',
        ],
      },
      {
        titulo: 'Domain',
        paragrafos: [
          'The title came long after the deed. In [[era-sombria|the Dark Age]], while [[imperio-aer-firen|the empire]] lay in pieces and every lord who could hold ground was carving a fief from it, the founder’s standing as a declared hero of [[guerra-verdejante|the Verdant War]] made his house the rulers of [[aranti|Aranti]] — which it holds to this day, one of the few grants of that broken age never undone.',
        ],
      },
      {
        titulo: 'A Name Given After Death',
        paragrafos: [
          'The chronicle grants the founder no name of his own: only his blood, his blow, and the house that was called after him. It does not say from which people of giant’s blood he came, nor whether he left children, nor who first bore the name he never used.',
          'Whether his line touches [[casa-sturm|House Sturm]] — the other giant-descended house of this roll, ennobled centuries later for a killing of its own — is nowhere stated. The record sets the two beside each other and draws no line between them, and I will not draw one for it.',
        ],
      },
    ],
    relacionados: ['primeiro-bellias', 'guerra-verdejante', 'aranti', 'corte-seelie', 'casa-sturm', 'era-sombria'],
    eras: ['era-primeira-luz', 'era-sombria', 'era-moderna'],
    alcunhas: ['Bellias', 'The Giant-Blooded of Aranti'],
  },

  {
    chave: 'casa-sturm',
    titulo: 'House Sturm',
    epiteto: 'The Mountain-Born',
    categoria: 'casa',
    resumo:
      'Giant-descended warriors of the eastern mountains, ennobled and given Ershen for repelling the Yuan-Ti.',
    brasao: 'sturm',
    ficha: [
      { rotulo: 'Seat', valor: 'The Swamplands of Ershen' },
      { rotulo: 'Blood', valor: 'Giant-descended, out of the eastern mountains' },
      { rotulo: 'Ennobled', valor: 'The Second Age of Light' },
      { rotulo: 'Sigil', valor: 'Granted with Ershen; the roll records no charge' },
      { rotulo: 'Standing', valor: 'Lords of Ershen by grant of the crown' },
    ],
    epigrafe:
      'In recognition of their valour they were granted a name, a title, and the swamplands of Ershen.',
    secoes: [
      {
        titulo: 'Origin',
        paragrafos: [
          'When [[roubo-de-sindaren|the Theft of Sindaren]] tore an inland ocean out of the world, the planar rift left in its wake allowed horrors to spill into the land — chief among them [[yuan-ti|the Yuan-Ti]], serpentfolk who invaded the broken realm. They were repelled only through the combined efforts of [[casa-deallus|House Deallus]] and a host of warriors from [[montanhas-orientais|the eastern mountains]], descendants of giants, who held no title at all before that war.',
          'In recognition of their valour they were granted one. The host became House Sturm, and was given dominion over the swamplands of [[ershen|Ershen]].',
        ],
      },
      {
        titulo: 'Domain',
        paragrafos: [
          '[[ershen|Ershen]] is a strange reward for the mountain-born, and the chronicle offers no word on the choice. The house has held the swamplands since [[era-segunda-luz|the Second Age of Light]], the grant falling in the long reign of [[mayan-herrys|the White Queen]], when many noble houses and branch families were raised through marriages and alliances arranged by the crown — though Sturm’s came by another road entirely.',
        ],
      },
      {
        titulo: 'A Title Bought in Another House’s Ruin',
        paragrafos: [
          'Sturm owes its name to a war fought on someone else’s land. The realm it saved was [[casa-deallus|Deallus’]], and the reward it received was a domain of its own, while the house it had come to help remained a shadow of what it was. The record passes no judgement on this, and neither shall I.',
          'What it does not say is what became of the mountains they came down from: whether the whole host descended to [[ershen|Ershen]] or only its captains, and whether [[yuan-ti|the serpentfolk]] were destroyed or merely driven back into the wound at [[sindaren|Sindaren]].',
        ],
      },
    ],
    relacionados: ['invasoes-serpentinas', 'elamyr', 'roubo-de-sindaren', 'yuan-ti', 'casa-deallus', 'ershen', 'montanhas-orientais', 'era-segunda-luz'],
    eras: ['era-segunda-luz', 'era-moderna'],
    alcunhas: ['Sturm', 'The Giants of the East'],
  },

  {
    chave: 'casa-deallus',
    titulo: 'House Deallus',
    epiteto: 'The Moonlit House',
    categoria: 'casa',
    resumo:
      'Founded by Sellias Deios of Andari, once the vanguard of Imperial magic, now fractured into sub-families at war.',
    brasao: 'deallus',
    ficha: [
      { rotulo: 'Seat', valor: 'Andari, and what is left of Sindaren' },
      { rotulo: 'Blood', valor: 'Elven — the Moon Peoples of Corvus' },
      { rotulo: 'Founded by', valor: 'Sellias “Moonwhisper” Deios' },
      { rotulo: 'Ennobled', valor: 'One of the four original houses of Aer Firen' },
      { rotulo: 'Known for', valor: 'Arcane vanguard; great magical works' },
      { rotulo: 'Standing', valor: 'Fractured — sub-families in open conflict' },
    ],
    epigrafe:
      'Once rulers of a vast and thriving land, they remained a shadow of their former selves.',
    secoes: [
      {
        titulo: 'Origin',
        paragrafos: [
          'The Annals introduce Deallus as already ruling [[sindaren|Sindaren]] and never say how. Andari’s own account answers it plainly: the house *is* the elves. [[povos-lunares|The Moon Peoples]] came out of [[corvus]] after [[a-queda|the Fall]] and built [[valari|Valari]] and [[andari]] on the isles of the lake; when [[sellias-delios|Sellias “Moonwhisper” Deios]] led a company of them north to fell [[dartharion|the Calamity]], the reward was a title.',
          'So House Deallus is one of the four original noble houses of [[imperio-aer-firen|Aer Firen]] — founded, not inherited, and founded by a named woman rather than by a silence.',
        ],
      },
      {
        titulo: 'The Height',
        paragrafos: [
          'For decades after the elves rejoined their homeland in [[ayren-herrys-ii|the Young King]]’s reign, Deallus stood among the greatest houses of the Empire: the vanguard of magical advance and the architects of great magical constructions. With the builders of [[casa-alabaster|House Alabaster]] they raised [[nyria]], the elevator-city.',
          'Their people had already left a mark in the north. Those who could not return home after the war founded [[corrente-dourada|the Golden Chain]] in the city of [[firen]], and elven learning entered the crown’s service there and stayed.',
        ],
      },
      {
        titulo: 'Domain',
        paragrafos: [
          'Then the sea was taken from them. In [[roubo-de-sindaren|an act of magical devastation]], a cabal of archmages tore the inland lake from Valoran, carrying [[valari|Valari]] away entire, wrecking much of [[andari]], and leaving behind [[cascata-eterna|the Eternal Waterfall]], which spills endlessly into the void of [[mar-astral|the Astral Sea]]. What was taken became [[vrednost]], and [[mayan-herrys|the White Queen]] never moved to take it back.',
          'The heraldic roll of this account names the house’s seat *Lost Sindaren*, and the phrase is exact: a broken realm, a wound in the world, and the endless falling of water that used to be theirs. They did not vacate it. By the roll they keep it, and keep watch on the fall.',
        ],
      },
      {
        titulo: 'A Shadow of Themselves',
        paragrafos: [
          'When the rift let [[yuan-ti|the Yuan-Ti]] through, it was Deallus — with the giant-blooded host out of [[montanhas-orientais|the eastern mountains]] who would be ennobled for it as [[casa-sturm|House Sturm]] — that repelled the invasion of the broken realm. The newcomers were rewarded with a domain; the house that had lost one was not restored. It is the plainest injustice in this roll, and the chronicle states it without comment.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Who the archmages were, what they wanted, whether they were opposed, whether any of them survived what they did — none of it is written. The Annals name no lord of the house at all; every Deallus this codex can name — [[sellias-delios|Sellias]], [[althos-deios|Althos]], [[elamyr]], [[imaren|the Imaren]] — comes from Andari’s account and not from the crown’s.',
        ],
      },
      {
        titulo: 'The Fracturing',
        paragrafos: [
          'The Theft was more than seven centuries ago, and everything since has been subtraction. The Empire and the House drew apart year by year until Deallus broke into sub-families beyond counting, each holding its own ground and guarding its own wants — some inside [[andari]], others scattered through what remained of Sindaren.',
          'They are today further from the throne than at any point in their existence, and at war among themselves more or less permanently. A house founded by a woman who crossed a continent to help a stranger kill a dragon now cannot agree with itself about a wall — see [[imaren|the Imaren]] and [[elamyr]], and [[invasoes-serpentinas|the invasion they disagreed about]].',
        ],
      },
    ],
    relacionados: ['andari', 'sellias-delios', 'casa-alabaster', 'vrednost', 'imaren', 'povos-lunares', 'nyria', 'roubo-de-sindaren'],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['Deallus', 'Deios', 'The House of the Lost Sea'],
  },

  {
    chave: 'casa-vinco',
    titulo: 'House Vinco',
    epiteto: 'The Reforged Horde',
    categoria: 'casa',
    resumo:
      'Born of the Horde of the Red Hand and reforged into sworn defenders of the coast its people once raided.',
    brasao: 'vinco',
    ficha: [
      { rotulo: 'Seat', valor: 'The Khorvari Coast' },
      { rotulo: 'Blood', valor: 'Of the Horde of the Red Hand' },
      { rotulo: 'Ennobled', valor: 'The Second Age of Light' },
      { rotulo: 'Sigil', valor: 'Taken up with the coast, in the empire’s service' },
      { rotulo: 'Standing', valor: 'Sworn defenders of the Khorvari Coast' },
    ],
    epigrafe:
      'Born of the very Horde it once fought beside, and reforged into the sworn defenders of the coast it once raided.',
    secoes: [
      {
        titulo: 'Origin',
        paragrafos: [
          'Vinco is the strangest ennoblement in the roll: a house born from [[horda-da-mao-vermelha|the Horde of the Red Hand]]. The Horde had come invading out of the [[khorvari|Coast of Khorvari]] in [[era-sombria|the Dark Age]], and [[casa-draco|House Draco]], holding [[endor|Endor]], stands as the shield against it.',
          'In [[era-segunda-luz|the Second Age of Light]], under a crown that made its peace by arrangement rather than by conquest, the Horde became a house. The raiders were made the defenders of the shore they had raided.',
        ],
      },
      {
        titulo: 'Domain',
        paragrafos: [
          'The house holds the [[khorvari|Khorvari Coast]], the same shoreline from which the Horde once launched itself at [[endor|Endor]]. This chronicle fixes no borders for it and names no port along it; what it records is the reversal alone — that the coast is now defended by those who used to come off it.',
        ],
      },
      {
        titulo: 'The Reforging',
        paragrafos: [
          'How it was done, the record will not say. Whether Vinco was bought, married in, beaten into submission, or came of its own accord to [[mayan-herrys|the White Queen]] — who forged alliances where others sought dominion — is not written anywhere I have found.',
          'Nor is it said what became of the rest of the Horde. The heraldic roll of this same account still names [[horda-da-mao-vermelha|the Red Hand]] as the thing [[casa-draco|Draco]] guards the realm against, in the present tense. A house was made out of the Horde; the record does not claim it was made out of *all* of it.',
        ],
      },
    ],
    relacionados: ['horda-da-mao-vermelha', 'khorvari', 'casa-draco', 'endor', 'mayan-herrys', 'era-segunda-luz'],
    eras: ['era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['Vinco', 'The Red Hand Ennobled'],
  },

  {
    chave: 'casa-orhys',
    titulo: 'House Orhys',
    epiteto: 'Masters of Rhydash',
    categoria: 'casa',
    resumo:
      'Ennobled by the record as a merchant’s grant, by whisper as the price of a rebellion; masters of Rhydash.',
    brasao: 'orhys',
    ficha: [
      { rotulo: 'Seat', valor: 'The City of Rhydash' },
      { rotulo: 'Blood', valor: 'Merchant stock; no older line is claimed in the record' },
      { rotulo: 'Ennobled', valor: 'The Second Age of Light, by grant to a prolific merchant' },
      { rotulo: 'Sigil', valor: 'Granted with the merchant’s patent' },
      { rotulo: 'Standing', valor: 'Masters of Rhydash, swollen by the Red Year’s refugees' },
    ],
    epigrafe:
      'Officially recorded as a noble grant to a prolific merchant, followed by whispers that Rhydash’s leaders once led a rebellion before receiving their title.',
    secoes: [
      {
        titulo: 'Origin',
        paragrafos: [
          'The official record is brief and unembarrassed. In [[era-segunda-luz|the Second Age of Light]], amid the many houses and branch families raised by [[mayan-herrys|the White Queen’s]] arrangements, the nobility of House Orhys was entered as a grant to a prolific merchant. It is the plainest origin in this roll.',
          'It is also the only one that is followed everywhere by a second story: whispers that the leaders of [[rhydash|Rhydash]] once led a rebellion before they received their title. I set down both, because the archive holds both. I can say which of them is written in the registers. I cannot say which of them is true.',
        ],
      },
      {
        titulo: 'Domain',
        paragrafos: [
          '[[rhydash|Rhydash]] is a merchant city and Orhys is a merchant house; the fit is exact, whatever its beginning. In [[era-moderna|the modern age]] the city grew heavier still: when [[ano-vermelho|the Red Year]] ravaged the [[ashara|Ashara Plains]], the plague drove many of those who survived it to migrate to Rhydash in search of a better life. The house that holds the merchant city therefore holds, as well, a great share of the displaced.',
        ],
      },
      {
        titulo: 'The Whisper',
        paragrafos: [
          'A rebellion, had there been one, could only have been raised against [[casa-herrys|House Herrys]] — and would have ended not on a scaffold but in a patent of nobility. That is the whole shape of the rumour, and the chronicle gives it no more substance: no date, no name of a rebel, no terms of surrender, no reason offered for such generosity.',
          'What can be said is that under [[mayan-herrys|the White Queen]] the crown’s chosen instrument was alliance rather than dominion. Whether that is an argument for the whisper or against it, the reader must weigh alone.',
        ],
      },
    ],
    relacionados: ['rhydash', 'ano-vermelho', 'ashara', 'casa-herrys', 'mayan-herrys', 'era-segunda-luz'],
    eras: ['era-segunda-luz', 'era-moderna'],
    alcunhas: ['Orhys', 'The Merchant House'],
  },

  {
    chave: 'casa-keaton',
    titulo: 'House Keaton',
    epiteto: 'The House Unknown',
    categoria: 'casa',
    resumo:
      'A house unknown to all but the imperial family, whose banner is found pierced through the corpses of rulers.',
    brasao: 'keaton',
    ficha: [
      { rotulo: 'Seat', valor: 'Origin unknown' },
      { rotulo: 'Blood', valor: 'Unknown' },
      { rotulo: 'Ennobled', valor: 'Ascribed to the Second Age of Light, and no further' },
      { rotulo: 'Sigil', valor: 'A banner, its device unrecorded — found pierced through a slain empress' },
      { rotulo: 'Standing', valor: 'Unknown to all but the imperial family' },
    ],
    epigrafe:
      'Her corpse was discovered with the banner of House Keaton pierced through her body.',
    secoes: [
      {
        titulo: 'An Origin Ascribed',
        paragrafos: [
          'The origins of House Keaton are ascribed to [[era-segunda-luz|the Second Age of Light]], the age in which so many houses and branch families were raised through marriages and alliances arranged by the crown. That is the entire ascription — an age, and nothing inside it.',
          'The chronicle then says of Keaton what it says of no other house in this roll: that its origins are *entirely unknown*, and that the house itself is unknown to all but the imperial family.',
        ],
      },
      {
        titulo: 'No Known Domain',
        paragrafos: [
          'Every other house here is a place as much as a name. [[casa-draco|Draco]] is [[endor|Endor]]; [[casa-orhys|Orhys]] is [[rhydash|Rhydash]]; [[casa-sturm|Sturm]] is [[ershen|Ershen]]; even [[casa-deallus|Deallus]] is a domain, though the domain has been torn out of the world. Keaton holds no land that any map of mine can mark. The cartography appended to this account fixes it no borders, because there are none to fix.',
        ],
      },
      {
        titulo: 'The Banner in the Corpse',
        paragrafos: [
          'The house is known by one thing, and that thing is a corpse. [[guerra-dos-ventos|The War of the Winds]], fought against [[dinastia-hoseki|the Hōseki Dynasty]] of [[yoso|Yōso]], ended with the assassination of [[imperatriz-hoseki|the Hōseki Empress]] — and her body was discovered with the banner of House Keaton pierced through it.',
          'The heraldic register of this same account puts the matter in the plural: a banner found through the corpses of slain foreign rulers. I have let the plural stand, having no means to correct it in either direction.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Everything else. Not the blood, not the seat, not one name of one member of the house. Not who carried the banner into [[yoso|Yōso]], nor whether [[casa-herrys|the imperial family]] that alone knows Keaton also sent it. Not why a house that no one may know announces itself upon the dead.',
          'I set down what I hold and argue nothing from it: an ascription without an origin, a banner without a bearer, and an empress with a house’s colours run through her body.',
        ],
      },
    ],
    relacionados: ['imperatriz-hoseki', 'guerra-dos-ventos', 'dinastia-hoseki', 'yoso', 'casa-herrys', 'era-segunda-luz'],
    eras: ['era-segunda-luz', 'era-moderna'],
    alcunhas: ['Keaton', 'The Unknown House'],
  },
];
