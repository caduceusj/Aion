/**
 * Códice de Valoran — as sete potências.
 *
 * Esta gaveta não guarda pessoas nem territórios, e sim quem move o tabuleiro:
 * os deuses que velam sobre tudo, a igreja que fala em nome deles, o império
 * que herdou o continente, a corte feérica derrotada e calada por pacto, a
 * horda que virou casa nobre, os horrores que entraram pela ferida de Sindaren
 * e a dinastia estrangeira quebrada com um estandarte cravado no peito.
 *
 * O material vem de "The Annals of Valoran", documento de autoria do usuário,
 * atribuído em ficção a Maedrin Rimors, Scholar of the Imperial Archives, Anno
 * 1570 — da crônica das cinco eras, do capítulo "Relics & Powers" e do
 * gazetteer. A prosa fica em inglês de propósito: é a língua do original e a
 * voz do cronista. Só o código em volta é comentado em português.
 *
 * Nada aqui é inventado. Os Doze são o caso extremo do documento inteiro: a
 * crônica os invoca em toda era e não dá um só nome, atributo, rito ou templo
 * — por isso o verbete é curto e reverente, e confessa a escassez em vez de
 * preenchê-la. As outras seis terminam do mesmo modo, numa seção "What the
 * Record Does Not Say": a Corte Seelie some depois do pacto, a Horda nunca
 * ganha rosto, os Yuan-Ti não têm origem e a dinastia Hōseki não tem desfecho.
 *
 * `brasao` é o glifo em `heraldica.tsx`: estrela, templo, sol, folha, mao,
 * serpente, serpente-imperial.
 */

import type { Verbete } from '../tipos';

export const PODERES: Verbete[] = [
  {
    chave: 'os-doze',
    titulo: 'The Twelve',
    epiteto: 'Ever Watchful',
    categoria: 'poder',
    resumo:
      'The twelve gods called upon for strength since the first wars, and watchful over every age that followed.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Kind', valor: 'Gods — twelve, and unnamed by the chronicle' },
      { rotulo: 'Seat', valor: 'Nowhere the record fixes' },
      { rotulo: 'Era', valor: 'Every age, from a Thousand Kings to the present' },
      { rotulo: 'Standing', valor: 'Invoked; ever watchful' },
      { rotulo: 'Rival', valor: 'None the chronicle names' },
    ],
    epigrafe:
      'Though mortals shaped their own histories, it was ever under the watchful eyes of the Twelve.',
    secoes: [
      {
        titulo: 'Called Upon for Strength',
        paragrafos: [
          'They are older than the account that mentions them. To chronicle Valoran is to piece together fragments left by time and calamity, for *the gods once walked among mortals in an age so distant that even myth dares not name it* — and having said so, the record does not return to it. What it does preserve is the calling: in [[era-mil-reis|the Age of a Thousand Kings]], the wars were fought not only with steel but with faith, as men and women called upon the Twelve for strength and sought divine favor to carve their names into eternity.',
          'One such calling is followed to its end. A great warlord of the northern lands was blessed by a vision of a great eternal empire bathed in holy light and swore to make that vision real; as the oath was sworn, [[lamina-firen|the sacred blade Firen]] was in his hand. With that blade and *the guidance of the divine*, [[arran-herrys|Arran Herrys]] made one kingdom out of many warring clans. The chronicle does not say the Twelve gave the sword. It says the divine guided him, and leaves the inference where it fell.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Their names. Their number is the whole of what is fixed: twelve. No portfolios, no rites, no temples, no quarrel among them, and no appearance in any age this account covers — not at [[queda-de-dartharion|the felling of the Calamity]], not at [[noite-de-luctos|the ruin of Luctos]], not at [[roubo-de-sindaren|the tearing of Sindaren]] from the world. [[igreja-dos-doze|A church]] bears their name and speaks in it; whether they answer it, no page here will tell you.',
          'What remains is a posture rather than a doctrine, and the archive states it once and plainly: mortals shaped their own histories, and they did so *seen*. Whether that watching ever became intervention after the founding, this scholar cannot say — and would rather confess the gap than furnish it.',
        ],
      },
    ],
    relacionados: ['igreja-dos-doze', 'arran-herrys', 'lamina-firen', 'era-mil-reis', 'imperio-aer-firen'],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['The Twelve', 'Ever Watchful', 'the gods'],
  },
  {
    chave: 'igreja-dos-doze',
    titulo: 'The Church of the Twelve',
    epiteto: 'Keeper of the Fragments',
    categoria: 'poder',
    resumo:
      'The faith of the Twelve made an institution: bent by the Young King, waning in the Dark Age, keeper of what Luctos left.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Kind', valor: 'The faith of the Twelve, made an institution' },
      { rotulo: 'Seat', valor: 'Unnamed by the chronicle' },
      { rotulo: 'Era', valor: 'Named from the First Age of Light onward' },
      { rotulo: 'Standing', valor: 'Diminished since the Dark Age; keeper of the Luctos fragments' },
      { rotulo: 'Rival', valor: 'The crown — subjugated by the Young King at fifteen' },
    ],
    epigrafe:
      'What happened next remains shrouded in mystery, for the Church has preserved only fragments of the tale.',
    secoes: [
      {
        titulo: 'Subjugated at Fifteen',
        paragrafos: [
          'The Church enters this account as an obstacle. [[ayren-herrys-ii|Ayren Herrys II]], the Young King, took the throne of [[firen|Firen]] at fifteen and subjugated the resistance of the nobility *and* of the church before he ever marched across [[ashara|the Ashara Plains]] — which tells us two things the record never states outright: that by the First Age of Light the faith was organized enough to resist a king, and that it lost.',
          'It did not vanish for losing. The same king’s armies carried [[imperio-aer-firen|the empire]] over the whole continent and then across [[mar-astral|the Astral Sea]] in [[naus-oraculo|the Oracle Ships]], and the Church was still there afterwards to hold the one night it has never fully told.',
        ],
      },
      {
        titulo: 'The Fragments of Luctos',
        paragrafos: [
          'When the Young King turned inward, seeking knowledge long buried among the ruins of [[luctos|Luctos]], what followed was a grand capital raised and, in a single night, reduced to ruin. That any of the tale survives is owed to the Church, which has preserved only fragments of it. [[cidadela-de-vidro|The Citadel of Glass]], sole remnant of that city, still stands — a grim monument to a mystery the Church keeps.',
          'The verbs matter. *Preserved* and *keeps* are not the same admission: one is a rescue from the fire, the other a decision taken since. This scholar declines to say which the archive means, having found no page that settles it.',
        ],
      },
      {
        titulo: 'An Influence That Waned',
        paragrafos: [
          'With [[ayren-herrys-ii|the Young King]] gone, [[era-sombria|the Dark Age]] opened. Lords and warlords carved fiefdoms from the empire’s corpse, and though the Church of the Twelve sought to maintain order, even their influence waned. It is the only measure of the institution the chronicle ever offers: not doctrine, not wealth, not numbers — reach, and the loss of it.',
          'Order returned by another hand entirely. [[mayan-herrys|The White Queen]] united Valoran through wisdom and alliance rather than war, and the houses that rose in her age rose by marriages the crown arranged. The Church is not named among the makers of that peace.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Where it sits. Who leads it. What it teaches of [[os-doze|the Twelve]], whose names the chronicle never gives. Whether it blessed or opposed [[ayren-herrys-iv|the present emperor]] when [[lanca-divina|the Divine Lance]] was unearthed beneath his reign and turned upon dissidents. Whether [[lamina-firen|the sacred blade]] of the founding rests in a vault of its own.',
          'And above all, what else it holds of [[noite-de-luctos|that night]]. *Fragments*, the record says. It does not say how many, nor who is permitted to read them.',
        ],
      },
    ],
    relacionados: ['os-doze', 'ayren-herrys-ii', 'noite-de-luctos', 'cidadela-de-vidro', 'era-sombria', 'imperio-aer-firen'],
    eras: ['era-primeira-luz', 'era-sombria', 'era-moderna'],
    alcunhas: ['The Church of the Twelve', 'the Church'],
  },
  {
    chave: 'imperio-aer-firen',
    titulo: 'The Empire of Aer Firen',
    categoria: 'poder',
    resumo:
      'The continental realm grown out of the kingdom of Firen — shattered once, restored twice, and now under the Golden Tyrant.',
    brasao: 'sol',
    ficha: [
      { rotulo: 'Kind', valor: 'Continental empire' },
      { rotulo: 'Seat', valor: 'The Imperial Throne, at Firen' },
      { rotulo: 'Era', valor: 'Proclaimed in the First Age of Light, out of the Kingdom of Firen' },
      { rotulo: 'Standing', valor: 'Ruling — by heavy taxation and military might' },
      { rotulo: 'Rival', valor: 'The Hōseki Dynasty of Yōso; the Seelie Court, bound by pact' },
    ],
    epigrafe: 'Yet, as history has shown, no reign lasts forever.',
    secoes: [
      {
        titulo: 'From a Kingdom to an Empire',
        paragrafos: [
          'It begins as a kingdom and a sword. [[arran-herrys|King Arran Herrys]] bound the warring clans of the north into [[firen|Firen]] and gave it the name of [[lamina-firen|the blade]] set into his hand; [[ayren-herrys-i|his son]], crowned second High King once [[queda-de-dartharion|the Calamity was felled]], began the calendar every realm on the continent still counts by. Over generations Firen grew — *not by conquest alone*, the chronicle insists, but through diplomacy, trade and alliance.',
          'The empire proper is the work of a single reign. [[ayren-herrys-ii|Ayren Herrys II]] took the throne at fifteen, broke the resistance of nobility and [[igreja-dos-doze|church]] alike, pushed his armies past the northern plateau through [[ashara|the Ashara Plains]] and consolidated dominion over the entire continent. So the Kingdom of Firen became the Empire of Aer Firen.',
        ],
      },
      {
        titulo: 'Across the Astral Sea',
        paragrafos: [
          'Its most infamous war was not fought upon Valoran at all. [[naus-oraculo|The Oracle Ships]] bore the empire’s golden host across [[mar-astral|the Astral Sea]] to invade [[fentor|Fentor]], and [[guerra-verdejante|the Verdant War]] against [[corte-seelie|the Seelie Court]] ended only when a warrior of giant’s blood — afterwards named the first of [[casa-bellias|House Bellias]] — slew a primordial horror the fey had unleashed. The surrender that followed set a pact of non-interference between the two ruling powers, and it is the only treaty this account records.',
        ],
      },
      {
        titulo: 'Fracture, and a Queen’s Restoration',
        paragrafos: [
          'The same king undid it. When [[ayren-herrys-ii|the Young King]] vanished in [[noite-de-luctos|the ruin of his new capital]], the unity he had built shattered: [[era-sombria|the Dark Age]] opened, the old capital lay abandoned, and lords carved their own fiefdoms from the empire’s corpse — [[casa-draco|House Draco]] holding [[endor|Endor]] against invasion from [[khorvari|the Khorvari Coast]], [[casa-bellias|Bellias]] taking [[aranti|Aranti]]. The empire, it seemed, was truly lost.',
          'It was not. [[mayan-herrys|Mayan Herrys]], born with celestial radiance and remembered as the White Queen, united Valoran once more through wisdom rather than war, and under her the empire flourished for centuries — long enough to see [[roubo-de-sindaren|an ocean torn out of the world]] and the [[yuan-ti|serpentfolk]] that came through the wound driven back.',
        ],
      },
      {
        titulo: 'The Empire of the Present Year',
        paragrafos: [
          'The rulers who followed her were unremarkable, and stability held until two blows: [[guerra-dos-ventos|the War of the Winds]] against [[dinastia-hoseki|the Hōseki Dynasty]] of [[yoso|Yōso]], whose remnants still spark conflicts on Valoran decades after, and [[ano-vermelho|the Red Year]], the plague that scarred [[ashara|the Ashara Plains]] and drove its survivors to [[rhydash|Rhydash]].',
          'Now the throne is held by [[ayren-herrys-iv|Ayren Herrys IV]] — *Carsaros*, the Golden Tyrant, to some — a celestial-blooded emperor with a single wing, whose rule rests upon heavy taxation, military might and [[lanca-divina|the Divine Lance]], unearthed beneath him and raised against any who would dissent. What the empire becomes in the next age, whether of light or darkness, the account declines to guess. So does this scholar.',
        ],
      },
    ],
    relacionados: ['casa-herrys', 'ayren-herrys-ii', 'ayren-herrys-iv', 'firen', 'guerra-verdejante', 'igreja-dos-doze'],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['Aer Firen', 'The Empire', 'Kingdom of Firen'],
  },
  {
    chave: 'corte-seelie',
    titulo: 'The Seelie Court',
    epiteto: 'The Court of Fentor',
    categoria: 'poder',
    resumo:
      'The fey power of Fentor, invaded across the Astral Sea and bound since its surrender by a pact of non-interference.',
    brasao: 'folha',
    ficha: [
      { rotulo: 'Kind', valor: 'Fey court — a ruling power' },
      { rotulo: 'Seat', valor: 'Fentor, beyond the Astral Sea' },
      { rotulo: 'Era', valor: 'The First Age of Light' },
      { rotulo: 'Standing', valor: 'Surrendered; bound by a pact of non-interference' },
      { rotulo: 'Rival', valor: 'The Empire of Aer Firen' },
    ],
    epigrafe:
      'The death of such a beast led to the Seelie Court’s surrender, and a pact of non-interference between the two ruling powers.',
    secoes: [
      {
        titulo: 'The Fey Continent',
        paragrafos: [
          'The Seelie Court appears in this chronicle only because an empire went looking for it. It ruled [[fentor|Fentor]], which is not Valoran and is reached by no sea a sailor knows; between the two lies [[mar-astral|the Astral Sea]]. Of its founding, its lords, its laws and its long ages before the invasion, nothing whatever is set down. It is called a ruling power, and treated as one.',
        ],
      },
      {
        titulo: 'The Verdant War',
        paragrafos: [
          'The war came to it. [[ayren-herrys-ii|The Young King]], having already made [[imperio-aer-firen|the Empire of Aer Firen]] out of an entire continent, waged [[guerra-verdejante|the Verdant War]] by means never before seen: [[naus-oraculo|the Oracle Ships]], vessels able to traverse the void itself, carrying the golden host to invade the fey realm.',
          'The Court did not break under that invasion — it answered it. A primordial horror of the Seelie was unleashed in the war, and the imperial push ended only when a warrior of giant’s blood, [[primeiro-bellias|later named the first of House Bellias]], slew the beast. With that death the Court surrendered.',
        ],
      },
      {
        titulo: 'The Pact, and What It Bought',
        paragrafos: [
          'What followed is the sole diplomacy this account preserves: a pact of non-interference between the two ruling powers. Not tribute, not occupation, not a fey province of [[imperio-aer-firen|the empire]] — a mutual agreement to leave one another alone. What the Court kept and what it gave up beyond that pact, the chronicle does not itemize; it records the surrender, the pact, and nothing further of [[fentor|Fentor]].',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Everything after the pact. Whether it still holds in the present year, whether any Seelie has crossed [[mar-astral|the Astral Sea]] since, whether the Court took any notice when archmages later tore [[roubo-de-sindaren|an ocean out of Valoran]] and opened a planar wound of the mortals’ own making.',
          'Nor is the horror explained. The chronicle calls it primordial and unleashed and leaves it there: no name, no shape, no word on what the Court had kept it for before [[guerra-verdejante|the war]] made it useful. [[primeiro-bellias|The man who killed it]] is given no name either — only a house, and that granted after his death.',
        ],
      },
    ],
    relacionados: ['guerra-verdejante', 'fentor', 'primeiro-bellias', 'naus-oraculo', 'mar-astral', 'imperio-aer-firen'],
    eras: ['era-primeira-luz'],
    alcunhas: ['The Seelie Court', 'the Seelie', 'the fey'],
  },
  {
    chave: 'horda-da-mao-vermelha',
    titulo: 'The Horde of the Red Hand',
    epiteto: 'Raiders of Khorvari',
    categoria: 'poder',
    resumo:
      'Invaders of the Khorvari Coast, out of whom House Vinco was born — and against whom Endor still stands braced.',
    brasao: 'mao',
    ficha: [
      { rotulo: 'Kind', valor: 'Invading horde' },
      { rotulo: 'Seat', valor: 'The Khorvari Coast' },
      { rotulo: 'Era', valor: 'Risen in the Dark Age' },
      { rotulo: 'Standing', valor: 'House Vinco was born from it; Draco still shields against it' },
      { rotulo: 'Rival', valor: 'House Draco, from the shield-lands of Endor' },
    ],
    epigrafe:
      'A coast once raided by the Horde of the Red Hand — now defended by House Vinco, born of that very Horde.',
    secoes: [
      {
        titulo: 'Out of the Khorvari Coast',
        paragrafos: [
          'The Horde arrives in the chronicle with [[era-sombria|the Dark Age]], when [[imperio-aer-firen|the empire]] had fractured and every lord kept only what he could hold. It came invading from [[khorvari|the Coast of Khorvari]], and it met a shield: [[casa-draco|House Draco]], descended from [[rhogar|Rhogar]]’s dragon blood, secured the lands of [[endor|Endor]] and stood against it. The gazetteer still describes Endor as *ever braced* against the Horde, in the present tense.',
        ],
      },
      {
        titulo: 'A Horde Made a House',
        paragrafos: [
          'The stranger half of the story belongs to [[era-segunda-luz|the Second Age of Light]]. Under [[mayan-herrys|the White Queen]], who forged alliances where others had sought dominion, [[casa-vinco|House Vinco]] was born from the Horde of the Red Hand itself and made defender of the very coast it had raided.',
          'The chronicle offers no negotiation, no conversion and no name for whoever crossed over — only the fact, filed among the marriages and alliances the crown arranged in that age. A raiding power was not destroyed. It was enrolled.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Who they are. The account grants them no blood, no tongue, no leader and no cause beyond the raiding — not even the meaning of the red hand they are named for. Whether they are one people or many, and whether the part that became [[casa-vinco|Vinco]] was most of them or a fragment, is nowhere stated.',
          'Nor how the two halves stand now. If the Horde still presses [[khorvari|the coast]] in the present year, it presses against its own kin: [[casa-draco|Draco]] braces on one flank and Vinco guards the other. The chronicle sets both facts down and never once remarks upon the arrangement.',
        ],
      },
    ],
    relacionados: ['casa-vinco', 'casa-draco', 'khorvari', 'endor', 'era-sombria', 'era-segunda-luz'],
    eras: ['era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['The Horde of the Red Hand', 'the Red Hand', 'the Horde'],
  },
  {
    chave: 'yuan-ti',
    titulo: 'The Yuan-Ti',
    epiteto: 'Horror of the Rift',
    categoria: 'poder',
    resumo:
      'Serpentfolk that poured through the planar wound of Sindaren, repelled by House Deallus and the giants of the east.',
    brasao: 'serpente',
    ficha: [
      { rotulo: 'Kind', valor: 'Serpentfolk — horror of the rift' },
      { rotulo: 'Seat', valor: 'None on Valoran; they came through the wound at Sindaren' },
      { rotulo: 'Era', valor: 'The Second Age of Light' },
      { rotulo: 'Standing', valor: 'Repelled — though the wound was never closed' },
      { rotulo: 'Rival', valor: 'House Deallus and the giant-descended warriors who became House Sturm' },
    ],
    epigrafe:
      'The planar rift left in its wake allowed horrors to spill into the land — chief among them the Yuan-Ti.',
    secoes: [
      {
        titulo: 'Through the Wound',
        paragrafos: [
          'They did not so much invade Valoran as fall into it. In [[era-segunda-luz|the Second Age of Light]], a cabal of archmages tore [[sindaren|the inland ocean]] from the world in an act of magical devastation, leaving [[cascata-eterna|the Eternal Waterfall]] to spill endlessly into [[mar-astral|the Astral Sea]]. The planar rift left in its wake allowed horrors to spill into the land, and chief among them were the Yuan-Ti — serpentfolk, who invaded the broken realm.',
          'The realm was broken before they came, and that is the cruelty of the sequence. [[casa-deallus|House Deallus]], once rulers of a vast and thriving water, had just lost it; the serpentfolk arrived upon the ruin. [[roubo-de-sindaren|The Theft]] cost that house a country, and then handed it a war.',
        ],
      },
      {
        titulo: 'Repelled',
        paragrafos: [
          'They were driven out by an alliance the chronicle names precisely: [[casa-deallus|House Deallus]] and a host of warriors out of [[montanhas-orientais|the eastern mountains]], descendants of giants. In recognition of that valor the mountain warriors were granted noble title as [[casa-sturm|House Sturm]] and given dominion over the swamplands of [[ershen|Ershen]].',
          'The two victors did not leave the field alike. Sturm rose out of it into the peerage; Deallus, having won, remained a shadow of its former self and keeps [[cascata-eterna|the waterfall]] that marks what it lost. The Yuan-Ti gave one house its title and left the other its grief.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Where they came from. The rift is described as a wound in the world, not as a door onto any named place, and the serpentfolk are given no realm of origin, no ruler, no numbers and no purpose beyond the invasion itself. *Chief among them* implies that other horrors came through as well; not one of those others is named.',
          'Nor whether it is finished. [[cascata-eterna|The Eternal Waterfall]] still pours into the void in the present year, which is to say the wound has not closed. The account records a repulse, not a sealing — and says nothing whatever of what has come through since.',
        ],
      },
    ],
    relacionados: ['invasoes-serpentinas', 'elamyr', 'andari', 'roubo-de-sindaren', 'casa-deallus', 'casa-sturm', 'sindaren', 'cascata-eterna', 'montanhas-orientais'],
    eras: ['era-segunda-luz'],
    alcunhas: ['Yuan-Ti', 'serpentfolk'],
  },
  {
    chave: 'dinastia-hoseki',
    titulo: 'The Hōseki Dynasty',
    epiteto: 'The Dynasty of Yōso',
    categoria: 'poder',
    resumo:
      'The dynasty of Yōso, whose Empress was assassinated to end the War of the Winds — pierced by a banner nobody could name.',
    brasao: 'serpente-imperial',
    ficha: [
      { rotulo: 'Kind', valor: 'Foreign imperial dynasty' },
      { rotulo: 'Seat', valor: 'Yōso' },
      { rotulo: 'Era', valor: 'The Modern Age' },
      { rotulo: 'Standing', valor: 'Unrecorded after the assassination; remnants still upon Valoran' },
      { rotulo: 'Rival', valor: 'The Empire of Aer Firen — and, by the banner, House Keaton' },
    ],
    epigrafe:
      'The war ended with the assassination of the Hōseki Empress, her corpse discovered with the banner of House Keaton pierced through her body.',
    secoes: [
      {
        titulo: 'The War of the Winds',
        paragrafos: [
          'The Hōseki Dynasty ruled [[yoso|Yōso]], and it is the only foreign power this chronicle records [[imperio-aer-firen|the Empire of Aer Firen]] going to war against upon another continent’s account. [[guerra-dos-ventos|The War of the Winds]] was the first of the two blows that shook the continent in [[era-moderna|the Modern Age]], after the unremarkable reigns that followed [[mayan-herrys|the White Queen]] — the second being a plague, and not a rival.',
          'Of the fighting itself the chronicle keeps almost nothing: no battle, no year, no ground, no cause given for the quarrel. It records how the war ended, which is the part it wishes remembered.',
        ],
      },
      {
        titulo: 'The Banner in the Corpse',
        paragrafos: [
          'It ended with a murder. [[imperatriz-hoseki|The Hōseki Empress]] was assassinated, and her corpse was discovered with the banner of [[casa-keaton|House Keaton]] pierced through her body — a house unknown to all but the imperial family. A war between two crowns was closed by a killing signed with a name almost nobody on the continent could read.',
          'What became of the dynasty after that signature, the chronicle does not say. Its soldiers it does account for: remnants of the Hōseki forces still remained on Valoran, sparking many conflicts over the decades after — a war ended and not ended.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Nearly all of it. Not [[imperatriz-hoseki|the Empress]]’ name, nor whose hand struck her, nor whether [[casa-keaton|Keaton]] left the banner behind or was meant to be found holding it. Not what [[yoso|Yōso]] is — realm, island, another continent altogether — nor where it lies, nor whether a Hōseki rules there still.',
          'Nor what became of the remnants. They are said to spark conflicts *over the decades after*, and the account closes in Anno 1570 without saying whether [[ayren-herrys-iv|the present emperor]] has finished them, or whether [[lanca-divina|the Divine Lance]] has ever been turned their way. This archive leaves the war unresolved because, so far as I can tell, it is.',
        ],
      },
    ],
    relacionados: ['guerra-dos-ventos', 'imperatriz-hoseki', 'yoso', 'casa-keaton', 'imperio-aer-firen', 'era-moderna'],
    eras: ['era-moderna'],
    alcunhas: ['Hoseki', 'Hōseki Dynasty', 'Yoso'],
  },
];
