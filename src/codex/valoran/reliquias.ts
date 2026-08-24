/**
 * Códice de Valoran — as cinco relíquias.
 *
 * Esta gaveta guarda os objetos e as cicatrizes: uma lâmina dada por visão,
 * uma potência divina desenterrada e apontada para os próprios súditos, as
 * naus que cruzaram o vazio, a ferida por onde um oceano escoa sem fim e o
 * único resto de uma capital desfeita em uma noite.
 *
 * O material vem de "The Annals of Valoran", documento de autoria do usuário,
 * atribuído em ficção a Maedrin Rimors, Scholar of the Imperial Archives, Anno
 * 1570 — do capítulo "Relics & Powers" e do que a crônica das cinco eras diz
 * sobre cada objeto. A prosa fica em inglês de propósito: é a língua do
 * original e a voz do cronista. Só o código em volta é comentado em português.
 *
 * Nada aqui é inventado. As relíquias são, junto de Casa Keaton, a parte mais
 * lacunar do original: o cânone não segue a lâmina depois da fundação, não diz
 * quem construiu as naus, não nomeia um só arquimago e — sobretudo — não
 * explica a Noite de Luctos, porque a Igreja dos Doze guarda o que sabe. Cada
 * verbete confessa o silêncio numa seção "What the Record Does Not Say" em vez
 * de preenchê-lo. O mistério da Cidadela NÃO se resolve aqui.
 *
 * `brasao` é o glifo do objeto em `heraldica.tsx`: lamina, lanca, nau, cascata,
 * cidadela.
 */

import type { Verbete } from '../tipos';

export const RELIQUIAS: Verbete[] = [
  {
    chave: 'lamina-firen',
    titulo: 'Firen',
    epiteto: 'The Sacred Blade',
    categoria: 'reliquia',
    resumo:
      'The blade that appeared in a warlord’s hand as he swore his oath, and named first a kingdom and then an empire.',
    brasao: 'lamina',
    ficha: [
      { rotulo: 'Kind', valor: 'The Sacred Blade' },
      { rotulo: 'Origin', valor: 'Appeared in the hand of Arran Herrys as his holy oath was sworn' },
      { rotulo: 'Era', valor: 'The Age of a Thousand Kings' },
      { rotulo: 'Wielder', valor: 'King Arran Herrys, first High King of Firen' },
      { rotulo: 'Status', valor: 'Unfollowed by the chronicle after the founding' },
    ],
    epigrafe:
      'As his oath was sworn, he looked down — and the sacred blade Firen was now in his hand.',
    secoes: [
      {
        titulo: 'The Oath and the Blade',
        paragrafos: [
          'The blade enters the chronicle in the same breath as the oath. In the tumult of [[era-mil-reis|the Age of a Thousand Kings]], a great warlord of the northern lands was blessed with a vision of a great eternal empire bathed in holy light, and swore to make that vision a reality. As the oath left him he looked down, and the sacred blade was in his hand. No giver is named. No maker is named either.',
          'Armed with the blade and the guidance of the divine, [[arran-herrys|Arran Herrys]] bound many of the warring clans of the north into one greater kingdom and became its first High King. Whether the gift came from [[os-doze|the Twelve]] — upon whom the men and women of that age called for strength as readily as they drew steel — the record leaves to inference. It says *the guidance of the divine*, and it says it once.',
        ],
      },
      {
        titulo: 'A Name for a Kingdom, and for an Empire',
        paragrafos: [
          'What the sword did after the founding matters less to the chronicle than what it was called. The kingdom took the blade’s name: [[firen|Firen]], the northern seat upon the plateau, where the sacred blade first fell into mortal hands. When [[ayren-herrys-ii|the Young King]] drove that kingdom across the whole of the continent, the name went with it, and became [[imperio-aer-firen|the Empire of Aer Firen]].',
          'So the empire pronounces a relic of its own founding every time it names itself — a realm named for a sword, and then a continent named for the realm. [[casa-herrys|House Herrys]] has held that throne in every age of light since, from Arran to the present emperor, and the word has never had to be replaced.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The blade is not followed. The chronicle does not say whether it was raised against [[dartharion|Dartharion]] when the Calamity buried that first kingdom in unholy fire, nor whether it passed to [[ayren-herrys-i|Ayren Herrys I]], who sought vengeance for the burning and stood in the alliance that [[queda-de-dartharion|felled the dragon]] before being crowned the second High King.',
          'Neither is its keeping recorded. Whether Firen rests in a vault of [[igreja-dos-doze|the Church]], in the hands of the dynasty, or nowhere an archivist may reach, I cannot tell you — and I have found no page that pretends to.',
        ],
      },
    ],
    relacionados: ['arran-herrys', 'firen', 'imperio-aer-firen', 'casa-herrys', 'era-mil-reis', 'os-doze'],
    eras: ['era-mil-reis'],
    alcunhas: ['Firen', 'The Sacred Blade'],
  },
  {
    chave: 'lanca-divina',
    titulo: 'The Divine Lance',
    epiteto: 'Weapon of the Tyrant',
    categoria: 'reliquia',
    resumo:
      'A divine power unearthed beneath Carsaros, harnessed by the crown as an instrument to crush all dissidence.',
    brasao: 'lanca',
    ficha: [
      { rotulo: 'Kind', valor: 'Weapon of the Tyrant — a divine power, harnessed' },
      { rotulo: 'Origin', valor: 'Unearthed beneath the reign of Ayren Herrys IV' },
      { rotulo: 'Era', valor: 'The Modern Age' },
      { rotulo: 'Wielder', valor: 'The imperial crown' },
      { rotulo: 'Status', valor: 'In use — raised against dissidence' },
    ],
    epigrafe:
      'Under him the empire has discovered the power of the Divine Lance, harnessing it as a weapon to crush dissidence.',
    secoes: [
      {
        titulo: 'Unearthed Beneath the Tyrant',
        paragrafos: [
          'The Lance is the youngest thing in this catalogue. Under [[ayren-herrys-iv|Ayren Herrys IV]] — the celestial-blooded emperor with a single wing, nicknamed *Carsaros*, the Golden Tyrant, by some — [[imperio-aer-firen|the empire]] discovered the power of the Divine Lance and harnessed it as a weapon. The chronicle grants it no maker, no earlier age and no resting place before that discovery. It grants the discovery, and what was made of it.',
          'What was made of it is the whole of its history. It is an instrument to crush dissidence, and the third leg of a rule that stands otherwise upon heavy taxation and military might — imposed on a continent still recovering from [[guerra-dos-ventos|war]] and from famine, its plains scarred within living memory by [[ano-vermelho|the Red Year]].',
        ],
      },
      {
        titulo: 'A Divine Power, Made an Instrument',
        paragrafos: [
          'The word the record chooses is *power*, not *weapon*: a divine power unearthed, and afterwards harnessed. The distinction belongs to the crown, not to the object — something was found, and something else was made of it. Whether the finding required [[igreja-dos-doze|the Church of the Twelve]], or was made against its counsel, the record does not say.',
          'Nor is the symmetry lost on this archivist. The dynasty’s first age opens with [[lamina-firen|a blade]] set into a king’s hand by holy vision; its present age opens with a divine thing dug out of the ground and pointed at the king’s own subjects. I set the two side by side. I do not claim the chronicle intends the comparison.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Very nearly everything. Not what the Lance is, nor where beneath the empire it lay, nor by whose hand or in which year of the present reign it was brought up. Not which of [[os-doze|the Twelve]] it answered to, if any. Not whether it has been turned upon the remnants of [[dinastia-hoseki|the Hōseki]] that still linger on Valoran and spark conflict decade after decade, or only upon Valoran’s own.',
          'The account of this reign ends in a single sentence and offers no elaboration: no reign lasts forever. Whether the Lance was harnessed to test that sentence, [[casa-herrys|the house that harnessed it]] has not written down.',
        ],
      },
    ],
    relacionados: ['ayren-herrys-iv', 'casa-herrys', 'imperio-aer-firen', 'era-moderna', 'os-doze'],
    eras: ['era-moderna'],
    alcunhas: ['The Divine Lance', 'Divine Lance'],
  },
  {
    chave: 'naus-oraculo',
    titulo: 'The Oracle Ships',
    epiteto: 'Vessels of the Astral Sea',
    categoria: 'reliquia',
    resumo:
      'Vessels able to sail the Astral Sea itself, which bore the empire’s golden host across the void against the Seelie.',
    brasao: 'nau',
    ficha: [
      { rotulo: 'Kind', valor: 'Vessels of the Astral Sea' },
      { rotulo: 'Origin', valor: 'Means never before seen, raised for the invasion of the fey continent' },
      { rotulo: 'Era', valor: 'The First Age of Light' },
      { rotulo: 'Keeper', valor: 'The Empire of Aer Firen, under the Young King' },
      { rotulo: 'Status', valor: 'Unrecorded since the Seelie surrender' },
    ],
    epigrafe: 'The Verdant War was waged through means never before seen.',
    secoes: [
      {
        titulo: 'Means Never Before Seen',
        paragrafos: [
          'The Young King’s most infamous war was fought not upon Valoran at all, and so before it could be fought it had to be reached. [[guerra-verdejante|The Verdant War]] was waged through means never before seen: the Oracle Ships, mighty vessels capable of traversing [[mar-astral|the Astral Sea]] itself, which carried the golden host of [[imperio-aer-firen|the Empire of Aer Firen]] across the void and set an invasion upon the fey continent of [[fentor|Fentor]].',
          'Nothing else in this account does anything comparable, before or since. [[ayren-herrys-ii|Ayren Herrys II]] had already consolidated dominion over the entire continent; the ships are the reason his ambition did not stop at the shoreline, and the reason [[corte-seelie|the Seelie Court]] found an empire at its gates.',
        ],
      },
      {
        titulo: 'What They Carried, and What Ended It',
        paragrafos: [
          'The push of the golden host was ended not by the fleet but by a single warrior. A man of giant’s blood — later named, posthumously, the first of [[casa-bellias|House Bellias]] — slew a primordial horror the Seelie had unleashed in the war, and the death of such a beast brought [[corte-seelie|the Court]] to surrender.',
          'What followed was a pact of non-interference between the two ruling powers. The house that took his name would come to rule [[aranti|Aranti]]; the ships pass out of the chronicle in the same breath as the surrender, and are never mentioned again.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Who built them, and how they sail. The chronicle calls them mighty and capable of traversing [[mar-astral|the Astral Sea]], and there it stops — no shipwright, no port, no account of the crossing itself, no word on whether the passage was a work of craft, of the favour of [[os-doze|the Twelve]], or of something [[igreja-dos-doze|the Church]] would rather not have set down.',
          'Nor does it say where they are. Whether an Oracle Ship still floats, whether they were unmade when the pact was struck, or whether they wait somewhere in imperial keeping against a day the crown should want the void again — on this the record is silent, and I decline to fill the silence for it.',
        ],
      },
    ],
    relacionados: ['guerra-verdejante', 'mar-astral', 'fentor', 'corte-seelie', 'ayren-herrys-ii', 'imperio-aer-firen'],
    eras: ['era-primeira-luz'],
    alcunhas: ['The Oracle Ships', 'Oracle Ships'],
  },
  {
    chave: 'cascata-eterna',
    titulo: 'The Eternal Waterfall',
    epiteto: 'The Wound of Sindaren',
    categoria: 'reliquia',
    resumo:
      'Where an ocean was torn from the world: waters spilling without end into the Astral Sea, through a rift that let horrors in.',
    brasao: 'cascata',
    ficha: [
      { rotulo: 'Kind', valor: 'The Wound of Sindaren — a planar scar' },
      { rotulo: 'Origin', valor: 'Left where a cabal of archmages tore an inland ocean from Valoran' },
      { rotulo: 'Era', valor: 'The Second Age of Light' },
      { rotulo: 'Keeper', valor: 'House Deallus, left to guard what remains' },
      { rotulo: 'Status', valor: 'Spilling endlessly into the void' },
    ],
    epigrafe:
      'The planar rift left in its wake allowed horrors to spill into the land — chief among them the Yuan-Ti, serpentfolk who invaded the broken realm.',
    secoes: [
      {
        titulo: 'The Wound',
        paragrafos: [
          'This is not a monument raised but a wound left open. In an act of magical devastation, a cabal of archmages tore the inland ocean of [[sindaren|Sindaren]] from Valoran. What remained where an ocean had been is the Eternal Waterfall, whose waters spill without end into the void of [[mar-astral|the Astral Sea]].',
          'The chronicle names [[roubo-de-sindaren|the Theft of Sindaren]] the greatest tragedy of [[mayan-herrys|the White Queen]]’s reign — an age otherwise remembered for a continent united through wisdom rather than war. The falls have not stopped since. Nothing in this account suggests that they will.',
        ],
      },
      {
        titulo: 'The Rift and What Came Through',
        paragrafos: [
          'An ocean torn out of the world leaves more than a cliff. The planar rift left in the theft’s wake allowed horrors to spill into the land, chief among them [[yuan-ti|the Yuan-Ti]], serpentfolk who invaded the broken realm.',
          'They were repelled only by the combined efforts of [[casa-deallus|House Deallus]] and a host of warriors from [[montanhas-orientais|the eastern mountains]], descendants of giants; in recognition of that valour those warriors were granted the noble title of [[casa-sturm|House Sturm]] and dominion over the swamplands of [[ershen|Ershen]]. Deallus, once rulers of a vast and thriving land, remained a shadow of their former selves — with the falls left to them to guard.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Not one archmage is named. Not their number, not their purpose, not whether the removal of the ocean was the aim of the working or merely its price. The chronicle gives me *a cabal*, and gives me the result, and gives me nothing whatever between the two.',
          'Nor does it say where [[sindaren|Sindaren]] went, whether the rift was ever closed after [[yuan-ti|the serpentfolk]] were driven back, or what becomes of an ocean’s worth of water poured for centuries into [[mar-astral|the Astral Sea]]. For all my travels in the further regions I have stood at no edge of it, and I set down only what the archive holds.',
        ],
      },
    ],
    relacionados: ['roubo-de-sindaren', 'sindaren', 'casa-deallus', 'yuan-ti', 'casa-sturm', 'mar-astral'],
    eras: ['era-segunda-luz', 'era-moderna'],
    alcunhas: ['The Eternal Waterfall', 'The Wound of Sindaren'],
  },
  {
    chave: 'cidadela-de-vidro',
    titulo: 'The Citadel of Glass',
    epiteto: 'Monument of Luctos',
    categoria: 'reliquia',
    resumo:
      'The sole remnant of the Young King’s grand capital, undone in a single night the Church has never explained.',
    brasao: 'cidadela',
    ficha: [
      { rotulo: 'Kind', valor: 'Monument of Luctos' },
      { rotulo: 'Origin', valor: 'Sole remnant of the grand capital raised by the Young King' },
      { rotulo: 'Era', valor: 'The First Age of Light' },
      { rotulo: 'Keeper', valor: 'No house holds Luctos; the Church of the Twelve keeps the account' },
      { rotulo: 'Status', valor: 'Standing, amid an abandoned capital' },
    ],
    epigrafe:
      'The Citadel of Glass, the only remnant of that city, stands as a grim monument to that mysterious night.',
    secoes: [
      {
        titulo: 'The Capital That Lasted One Night',
        paragrafos: [
          'Having consolidated dominion over the entire continent, [[ayren-herrys-ii|the Young King]] turned his gaze inward and sought knowledge long buried. It carried him to the region now known as [[luctos|Luctos]], strewn with the ruins of old civilizations, and there he built a grand capital. In [[noite-de-luctos|a single night]] it was reduced to ruin.',
          'The Citadel of Glass is the only remnant of that city, and stands as a grim monument to that night. The chronicle’s own summary of the age places the king inside it: the rise of [[imperio-aer-firen|the Empire of Aer Firen]], and the Young King’s vanishing *in the Citadel of Glass*.',
        ],
      },
      {
        titulo: 'What the Church Keeps',
        paragrafos: [
          'What happened next remains shrouded in mystery, for [[igreja-dos-doze|the Church of the Twelve]] has preserved only fragments of the tale. That is the sentence the record gives, and it repays a second reading: not that the tale was lost, but that fragments were *preserved* — and preserved by the institution whose resistance [[ayren-herrys-ii|the king]] had subjugated at fifteen, along with that of the nobility.',
          'I have not seen those fragments. I do not know their number, their language, or whether a scholar of the Imperial Archives is among the people they were preserved from. I record the claim in the form the Church makes it, and I make no claim of my own.',
        ],
      },
      {
        titulo: 'The Ruin That Made an Age',
        paragrafos: [
          'With the king’s disappearance the empire fell into disorder. The unity he had built shattered, lords and warlords carved their own fiefdoms from the empire’s corpse, and [[era-sombria|the Dark Age]] began — the once-great capital lying abandoned through the whole of it, with the Citadel standing over the abandonment.',
          'The cartography appended to this account marks [[luctos|Luctos]] as held by no house, and that is the plainest line upon the map. [[casa-draco|Endor]] has its shield, [[casa-orhys|Rhydash]] its merchants, [[casa-bellias|Aranti]] its hero. Luctos has a ruin, and whatever the ruin is a monument to.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'What destroyed the city. Whether the knowledge long buried beneath [[luctos|Luctos]] was ever found, and whether the finding was the cause. Whether [[ayren-herrys-ii|the Young King]] died there, or departed, or is in some sense still within: the chronicle calls it *disappearance* in one chapter and *the death of the Young King* in the next, and never reconciles the two.',
          'Why the Citadel alone should have survived, and survived as glass, when a grand capital did not, the record does not venture — and neither, having no evidence, shall I. I have arranged what is known around the gap. The gap is the shape of the thing.',
        ],
      },
    ],
    relacionados: ['noite-de-luctos', 'luctos', 'ayren-herrys-ii', 'igreja-dos-doze', 'era-sombria', 'imperio-aer-firen'],
    eras: ['era-primeira-luz', 'era-sombria', 'era-moderna'],
    alcunhas: ['The Citadel of Glass', 'Citadel of Glass'],
  },
];
