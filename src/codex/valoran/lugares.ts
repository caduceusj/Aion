/**
 * Códice de Valoran — os treze lugares.
 *
 * A geografia da crônica: os nove domínios do continente que o gazetteer do
 * original enumera, mais quatro lugares que existem só como nome e
 * consequência — [[fentor]], o continente feérico do outro lado do mar;
 * [[mar-astral]], o vazio que faz fronteira com o mundo; [[yoso]], de onde
 * veio a dinastia inimiga; e as [[montanhas-orientais]], de onde desceram os
 * descendentes de gigantes.
 *
 * O material vem de "The Annals of Valoran", documento de autoria do usuário,
 * atribuído em ficção a Maedrin Rimors, Scholar of the Imperial Archives, Anno
 * 1570. Cada `resumo` e o primeiro parágrafo de cada verbete nascem da linha
 * do gazetteer correspondente; o resto é costurado dos capítulos das eras.
 *
 * A prosa fica em inglês de propósito: é a língua do original e a voz do
 * cronista. Só o código em volta é comentado em português.
 *
 * Lugar é a categoria mais lacunar do códice — o original nomeia domínios sem
 * descrevê-los, e a própria legenda do mapa avisa que a cartografia é
 * ilustrativa e que a crônica não fixa fronteira nenhuma. Por isso quase todo
 * verbete aqui termina em "What the Record Does Not Say": onde o original
 * cala, o verbete confessa o silêncio em vez de preenchê-lo.
 */

import type { Verbete } from '../tipos';

export const LUGARES: Verbete[] = [
  {
    chave: 'firen',
    titulo: 'Firen',
    epiteto: 'Seat of the Celestial Dynasty',
    categoria: 'lugar',
    resumo:
      'The northern seat of the celestial dynasty, where King Arran forged one kingdom from a thousand warring clans.',
    brasao: 'herrys',
    ficha: [
      { rotulo: 'Region', valor: 'The northern plateau, and the lands the first High Kings bound to it' },
      { rotulo: 'Held by', valor: 'House Herrys' },
      { rotulo: 'Founded', valor: 'By King Arran Herrys, before Year 0' },
      { rotulo: 'Notable', valor: 'The imperial throne; the sacred blade that gave the realm its name' },
      { rotulo: 'Condition', valor: 'Sovereign seat of the Empire of Aer Firen' },
    ],
    epigrafe:
      'As his oath was sworn, he looked down — and the sacred blade Firen was now in his hand.',
    secoes: [
      {
        titulo: 'One Kingdom from a Thousand Clans',
        paragrafos: [
          'Firen is the northern seat of the celestial dynasty, and the oldest name in this chronicle that still belongs to a living place. Before it there was no north to speak of, only countless kingdoms, city-states and wandering clans at war — until a warlord of the northern lands was blessed with a vision of a great eternal empire bathed in holy light, and swore to make that vision real. As the oath left him he looked down, and [[lamina-firen|the sacred blade]] was in his hand.',
          'Armed with the blade and the guidance of the divine, [[arran-herrys|King Arran Herrys]] bound many of the warring clans of the north into one greater kingdom and became its first High King. The blade gave its name to the kingdom, and the kingdom in time gave its name to [[imperio-aer-firen|an empire]].',
        ],
      },
      {
        titulo: 'Fire, and What Followed It',
        paragrafos: [
          'The young realm did not stand unchallenged. [[dartharion|Dartharion]], the Calamity, turned his gaze toward the emerging kingdom and buried it in unholy fire — and it was out of that ruin that [[ayren-herrys-i|Ayren Herrys I]] rose seeking vengeance, to be crowned second High King when [[queda-de-dartharion|the dragon was felled]]. From that crowning the calendar of the continent counts its first year.',
          'Over generations the kingdom expanded, bringing stability where once there had been only war — built not by conquest alone, but through diplomacy, trade and alliance. Under [[ayren-herrys-ii|the Young King]] its armies pushed beyond the northern plateau, through [[ashara|the Ashara Plains]] and further still, until domain over the entire continent was consolidated and the kingdom became an empire.',
        ],
      },
      {
        titulo: 'The Throne That Outlasted the Ages',
        paragrafos: [
          'When [[noite-de-luctos|the Young King was lost]], [[era-sombria|the realm fractured]] with him, and lords and warlords carved their own fiefdoms from the empire’s corpse. Yet the seat endured: from King Arran to [[ayren-herrys-iv|the Golden Tyrant]], the wing-and-crown of [[casa-herrys|House Herrys]] has ruled from Firen across every age of light, through [[mayan-herrys|the White Queen’s]] centuries of peace and into the taxed and armoured present.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The name is asked to carry three things at once — a blade, a kingdom, an empire — and the chronicle never separates them. Whether Firen is a city, a citadel or the whole of the northern realm is nowhere stated; the cartography of this account is illustrative, and fixes no exact borders anywhere.',
          'Nor is it recorded how the north was rebuilt after [[dartharion|the Calamity’s]] fire, nor what [[casa-herrys|House Herrys]] held here through the three centuries and more of [[era-sombria|the Dark Age]], if it held anything at all. The archive resumes only with a queen already crowned.',
        ],
      },
    ],
    relacionados: ['casa-herrys', 'arran-herrys', 'lamina-firen', 'imperio-aer-firen', 'ayren-herrys-ii', 'era-primeira-luz'],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['The Kingdom of Firen', 'The Imperial Throne'],
  },

  {
    chave: 'luctos',
    titulo: 'Luctos',
    epiteto: 'The Lost Capital',
    categoria: 'lugar',
    resumo:
      'Ruins of the Young King’s lost capital, undone in a single night; only the Citadel of Glass still stands.',
    brasao: 'cidadela',
    ficha: [
      { rotulo: 'Region', valor: 'A land strewn with the ruins of old civilisations' },
      { rotulo: 'Held by', valor: 'No ruling House' },
      { rotulo: 'Notable', valor: 'The Citadel of Glass, sole remnant of the grand capital' },
      { rotulo: 'Condition', valor: 'Ruin — abandoned since the night that undid the city' },
      { rotulo: 'Kept By', valor: 'The Church of the Twelve, which preserved only fragments' },
    ],
    epigrafe:
      'The Citadel of Glass, the only remnant of that city, stands as a grim monument to that mysterious night.',
    secoes: [
      {
        titulo: 'Knowledge Long Buried',
        paragrafos: [
          'Luctos was already old when the empire found it. Having consolidated the continent, [[ayren-herrys-ii|the Young King]] turned his gaze inward, seeking knowledge long buried, and in doing so turned toward the region now known by this name — a land strewn with the ruins of civilisations that had ended before the count of years began.',
          'There he built a grand capital, and for a time the heart of [[imperio-aer-firen|the Empire of Aer Firen]] lay not in [[firen|the north]] but here, among the older ruins.',
        ],
      },
      {
        titulo: 'A Single Night',
        paragrafos: [
          'In [[noite-de-luctos|a single night]] the capital was reduced to ruin. [[cidadela-de-vidro|The Citadel of Glass]], the sole remnant of that city, still stands above the rubble as a grim monument to it, and the king who raised the city was never seen again.',
          'Through the long fracture that followed, the once-great capital lay abandoned. No lord of [[era-sombria|the Dark Age]] carved a fiefdom from it and no House claims it now — of the domains this chronicle maps, Luctos is among the few that answer to no banner at all.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'What happened here remains shrouded, for [[igreja-dos-doze|the Church of the Twelve]] has preserved only fragments of the tale, and fragments are all that have reached this desk. What the king sought beneath Luctos, whether he found it, and what undid a capital between one evening and one morning — none of it is set down.',
          'The archive is not even consistent with itself as to the man: in one place it speaks of [[ayren-herrys-ii|his death]], in another of his disappearance, and it does not reconcile the two. Nor does it name the older peoples whose ruins drew him, nor say whether anything of theirs still lies under the glass.',
        ],
      },
    ],
    relacionados: ['cidadela-de-vidro', 'noite-de-luctos', 'ayren-herrys-ii', 'igreja-dos-doze', 'era-primeira-luz', 'era-sombria'],
    eras: ['era-primeira-luz', 'era-sombria'],
    alcunhas: ['The Ruins of Luctos', 'The Young King’s Capital'],
  },

  {
    chave: 'rhydash',
    titulo: 'Rhydash',
    epiteto: 'The Merchant City',
    categoria: 'lugar',
    resumo:
      'The merchant city of House Orhys, cradle of a whispered rebellion and refuge for those who fled the Red Year.',
    brasao: 'orhys',
    ficha: [
      { rotulo: 'Region', valor: 'The city of Rhydash and its trade' },
      { rotulo: 'Held by', valor: 'House Orhys' },
      { rotulo: 'Ennobled', valor: 'In the Second Age of Light, by grant of the crown' },
      { rotulo: 'Notable', valor: 'Commerce; a rebellion the record will not confirm' },
      { rotulo: 'Condition', valor: 'Prosperous, and swollen with those who fled the plains' },
    ],
    epigrafe:
      'Ennobled — so the record says — as a grant to a prolific merchant. Yet whispers hold that Rhydash’s leaders once raised a rebellion.',
    secoes: [
      {
        titulo: 'A City Bought, or a City Pardoned',
        paragrafos: [
          'Rhydash is the merchant city of [[casa-orhys|House Orhys]], raised to nobility in the age of [[mayan-herrys|the White Queen]], when many houses and branch families rose through marriages and alliances arranged by the crown. The official record is plain enough: a noble grant, made to a prolific merchant.',
          'The whispers are less plain. They hold that the leaders of Rhydash once led a rebellion, and received their title afterward — which would make this city’s coronet not a reward for service but the price of a peace. This scholar sets down both accounts, and prefers neither.',
        ],
      },
      {
        titulo: 'Refuge of the Red Year',
        paragrafos: [
          'In [[era-moderna|the present age]] the city took in the survivors of a second calamity. When [[ano-vermelho|the Red Year]] ravaged [[ashara|the Ashara Plains]], the plague was contained before it could spread to the remainder of the continent — but its scars remained in the memories of those who had suffered it, and drove many to migrate here in search of a better life.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The rebellion, if it happened, has no date, no leader and no enemy in the archive — only the whisper that it happened at all. Against whom a merchant city rose, and how a crown that answered rebellion with a title judged the matter, is nowhere explained.',
          'Neither is the scale of the migration. The chronicle says *many* came from the plains and stops there: it does not count them, does not say where in the city they settled, and does not say what the older families of Rhydash made of their arrival.',
        ],
      },
    ],
    relacionados: ['casa-orhys', 'ano-vermelho', 'ashara', 'mayan-herrys', 'era-segunda-luz', 'era-moderna'],
    eras: ['era-segunda-luz', 'era-moderna'],
    alcunhas: ['The City of Rhydash'],
  },

  {
    chave: 'sindaren',
    titulo: 'Sindaren',
    epiteto: 'The Stolen Ocean',
    categoria: 'lugar',
    resumo:
      'Once a vast inland ocean ruled by House Deallus, torn from the world and left pouring endlessly into the void.',
    brasao: 'cascata',
    ficha: [
      { rotulo: 'Region', valor: 'An inland ocean within Valoran — where one used to be' },
      { rotulo: 'Held by', valor: 'House Deallus' },
      { rotulo: 'Lost In', valor: 'The Theft of Sindaren, in the Second Age of Light' },
      { rotulo: 'Notable', valor: 'The Eternal Waterfall; the planar rift left behind it' },
      { rotulo: 'Condition', valor: 'A broken realm, open at one edge onto the void' },
    ],
    epigrafe:
      'The planar rift left in its wake allowed horrors to spill into the land — chief among them the Yuan-Ti, serpentfolk who invaded the broken realm.',
    secoes: [
      {
        titulo: 'The Inland Ocean',
        paragrafos: [
          'Sindaren was a vast inland ocean, and the land about it was vast and thriving in turn. [[casa-deallus|House Deallus]] ruled it — and in the far older days of [[era-mil-reis|the founding age]], the chronicle records that the people of [[sellias-delios|Sellias Moonwhisper Delios]], the elven prodigy of the grand alliance, still ruled these same now-lost lands.',
        ],
      },
      {
        titulo: 'The Theft',
        paragrafos: [
          'In an act of magical devastation, a cabal of archmages tore the ocean from Valoran. What they left is [[cascata-eterna|the Eternal Waterfall]], which spills without end into the void of [[mar-astral|the Astral Sea]] — a realm with its bottom removed, pouring away at the edge of the world.',
          '[[roubo-de-sindaren|The Theft]] cost more than water. The planar rift left in its wake allowed horrors to spill into the land, chief among them [[yuan-ti|the Yuan-Ti]], serpentfolk who invaded the broken realm. It was only through the combined efforts of [[casa-deallus|House Deallus]] and a host of warriors from [[montanhas-orientais|the eastern mountains]], descendants of giants, that the invaders were repelled — and for that valour those warriors were raised as [[casa-sturm|House Sturm]] and given [[ershen|the swamplands of Ershen]].',
          'Deallus kept the name and lost the realm. Once rulers of a vast and thriving land, they remain a shadow of their former selves, left to guard the waterfall where their ocean used to be.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The cabal is not named. Not its number, not its purpose, not whether any of them survived the working, not whether the empire knew beforehand. [[roubo-de-sindaren|The Theft]] is set down as a thing that was done, with no hand attached to it.',
          'Where the ocean went is likewise unwritten — the chronicle follows the water only as far as the lip of [[cascata-eterna|the fall]]. And of the elves who ruled here in [[era-mil-reis|the age of the founding]], and of what became of them when their sea was taken out of the world, this account says nothing whatever.',
        ],
      },
    ],
    relacionados: ['casa-deallus', 'roubo-de-sindaren', 'cascata-eterna', 'yuan-ti', 'sellias-delios', 'mar-astral'],
    eras: ['era-mil-reis', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['Lost Sindaren', 'The Inland Ocean'],
  },

  {
    chave: 'ashara',
    titulo: 'The Ashara Plains',
    epiteto: 'The Scarred Grasslands',
    categoria: 'lugar',
    resumo:
      'The great plains the Young King crossed on his march of conquest, later scarred by the plague called the Red Year.',
    brasao: 'fumaca',
    ficha: [
      { rotulo: 'Region', valor: 'Open plains, beyond the northern plateau' },
      { rotulo: 'Held by', valor: 'No ruling House' },
      { rotulo: 'Notable', valor: 'The march of the Young King; the Red Year' },
      { rotulo: 'Condition', valor: 'Scarred by the Red Year; many migrated to Rhydash' },
    ],
    epigrafe: 'Its scars remain in the memories of those who suffered through it.',
    secoes: [
      {
        titulo: 'The Road of Conquest',
        paragrafos: [
          'The Ashara Plains are the ground the empire crossed to become an empire. Pushing beyond the northern plateau, [[ayren-herrys-ii|the Young King]] led his armies through these plains and further still, consolidating domain over the entire continent — and so turning the kingdom of [[firen|Firen]] into [[imperio-aer-firen|the Empire of Aer Firen]]. The plains are named in that march, and then the chronicle leaves them for the better part of a thousand years.',
        ],
      },
      {
        titulo: 'The Red Year',
        paragrafos: [
          'It returns to them for a plague. In [[era-moderna|the modern age]], a sickness known only as [[ano-vermelho|the Red Year]] ravaged Ashara. It was contained before it could spread to the remainder of the continent — a mercy for Valoran, and no mercy at all for the plains, whose survivors carried its scars in memory and, in great number, carried themselves to [[rhydash|Rhydash]] in search of a better life.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The plague is *known only as the Red Year* — the phrase is the chronicle’s own, and it is an admission. What the sickness was, how it began, who contained it and at what cost, how many it took: none of this survives. Even the name is unexplained; the archive does not say what was red.',
          'Nor does any House answer for this ground. The plains lie among the domains of the empire without a banner over them, and the record does not say who governs the emptied land, or whether anyone does.',
        ],
      },
    ],
    relacionados: ['ano-vermelho', 'rhydash', 'ayren-herrys-ii', 'imperio-aer-firen', 'era-moderna'],
    eras: ['era-primeira-luz', 'era-moderna'],
    alcunhas: ['Ashara', 'The Plains of Ashara'],
  },

  {
    chave: 'ershen',
    titulo: 'Ershen',
    epiteto: 'The Swamplands',
    categoria: 'lugar',
    resumo:
      'Swamplands granted to the giant-descended House Sturm for the valour with which they repelled the Yuan-Ti.',
    brasao: 'sturm',
    ficha: [
      { rotulo: 'Region', valor: 'The swamplands of Ershen' },
      { rotulo: 'Held by', valor: 'House Sturm' },
      { rotulo: 'Granted', valor: 'In recognition of valour against the Yuan-Ti' },
      { rotulo: 'Notable', valor: 'The dominion that made a war-host into a noble House' },
      { rotulo: 'Condition', valor: 'Held since the Second Age of Light' },
    ],
    epigrafe:
      'In recognition of their valour, these warriors were granted the noble title of House Sturm, and dominion over the swamplands of Ershen.',
    secoes: [
      {
        titulo: 'A Dominion Given for a Rescue',
        paragrafos: [
          'Ershen is a grant before it is a place. When [[roubo-de-sindaren|the Theft of Sindaren]] opened a planar rift and [[yuan-ti|the Yuan-Ti]] poured through it into the broken realm, the invaders were repelled only through the combined efforts of [[casa-deallus|House Deallus]] and a host of warriors out of [[montanhas-orientais|the eastern mountains]], descendants of giants. In recognition of that valour those warriors were granted a noble title as [[casa-sturm|House Sturm]], and with it dominion over these swamplands.',
          'So the swamp passed to a people who had come down from a mountain range, in payment for a battle fought at a waterfall. The chronicle records the grant; it does not record anyone objecting to it.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Who held Ershen before the grant, and whether anyone did, is unwritten. The archive produces the swamplands at the moment they are given away, with no earlier mention and no account of what the giving displaced.',
          'Of the land itself there is nothing at all — no extent, no border, no settlement, no name of any place within it. Why *these* lands were chosen for the mountain-born, when the crown of [[mayan-herrys|the White Queen]] had a reunited continent to draw from, the record does not venture to explain.',
        ],
      },
    ],
    relacionados: ['casa-sturm', 'montanhas-orientais', 'yuan-ti', 'roubo-de-sindaren', 'casa-deallus', 'era-segunda-luz'],
    eras: ['era-segunda-luz', 'era-moderna'],
    alcunhas: ['The Swamplands of Ershen'],
  },

  {
    chave: 'endor',
    titulo: 'Endor',
    epiteto: 'The Shield-Lands',
    categoria: 'lugar',
    resumo:
      'The shield-lands of dragon-blooded House Draco, ever braced against the Horde of the Red Hand.',
    brasao: 'draco',
    ficha: [
      { rotulo: 'Region', valor: 'The lands of Endor, upon the path of the Red Hand’s invasions' },
      { rotulo: 'Held by', valor: 'House Draco' },
      { rotulo: 'Secured', valor: 'In the Dark Age, amid the fracture of the empire' },
      { rotulo: 'Notable', valor: 'The shield of the realm against the Horde of the Red Hand' },
      { rotulo: 'Condition', valor: 'Held in arms, and braced ever since' },
    ],
    epigrafe:
      'Draco stands as the shield of the realm against the Horde of the Red Hand upon the Khorvari Coast.',
    secoes: [
      {
        titulo: 'A Hold Carved from the Fracture',
        paragrafos: [
          'Endor enters the record in the worst of the ages. When the death of [[ayren-herrys-ii|the Young King]] shattered the unity he had built and lords across Valoran carved fiefdoms from [[imperio-aer-firen|the empire’s]] corpse, [[casa-draco|House Draco]] — descended from the bloodline of [[rhogar|Rhogar]], the half-dragon of the grand alliance — secured its hold over these lands.',
          'It did not hold them quietly. Endor stood as a shield against [[horda-da-mao-vermelha|the Horde of the Red Hand]], invading out of [[khorvari|the Coast of Khorvari]], and in an age when [[igreja-dos-doze|the Church]] itself was waning that shield was among the few things on the continent still doing the work of an empire.',
        ],
      },
      {
        titulo: 'The Long Watch',
        paragrafos: [
          'The watch outlasted the age that began it. Generations later, in [[era-segunda-luz|the reign of the White Queen]], the Horde itself was reforged into [[casa-vinco|House Vinco]] and set to defend [[khorvari|the very coast]] it had raided — yet the chronicle still speaks of dragon-blooded Endor as the shield of the realm, braced against the Red Hand, in the present tense.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Not one battle of that long defence is named — no siege, no field, no year, no captain. The archive gives Endor a purpose and no history: it says what the land was for, and never what happened there.',
          'What Endor was before [[casa-draco|Draco]] took it, and from whom it was secured, is likewise absent. So is any reckoning of how the invasions ended, if they ended — the chronicle leaves the shield raised and does not tell us whether anything still strikes it.',
        ],
      },
    ],
    relacionados: ['casa-draco', 'rhogar', 'horda-da-mao-vermelha', 'khorvari', 'casa-vinco', 'era-sombria'],
    eras: ['era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['The Lands of Endor'],
  },

  {
    chave: 'aranti',
    titulo: 'Aranti',
    epiteto: 'The Hero’s Reward',
    categoria: 'lugar',
    resumo:
      'The realm granted to House Bellias, whose founder slew a primordial horror and won the empire the Verdant War.',
    brasao: 'bellias',
    ficha: [
      { rotulo: 'Region', valor: 'The realm of Aranti' },
      { rotulo: 'Held by', valor: 'House Bellias' },
      { rotulo: 'Won By', valor: 'A deed done on another continent, an age earlier' },
      { rotulo: 'Notable', valor: 'Seat of the line of the Verdant War’s hero' },
      { rotulo: 'Condition', valor: 'Held since the Dark Age' },
    ],
    epigrafe:
      'Founded by the giant-blooded hero who slew a primordial horror of the Seelie in the Verdant War — and won the empire its victory.',
    secoes: [
      {
        titulo: 'Won on Another Continent',
        paragrafos: [
          'Aranti is the ground on which a debt was finally paid. In [[guerra-verdejante|the Verdant War]], the golden host of [[imperio-aer-firen|the empire]] was halted upon [[fentor|the fey continent]] until [[primeiro-bellias|a warrior of giant’s blood]] slew a primordial horror that [[corte-seelie|the Seelie Court]] had unleashed — a death that brought the Court’s surrender and a pact of non-interference between the two ruling powers.',
          'The warrior was named, posthumously, the first of [[casa-bellias|House Bellias]]. The realm came later: it was in the chaos of [[era-sombria|the Dark Age]], with the empire he had served in pieces, that his house — its founder declared a hero of that war — became the rulers of Aranti.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'By whose authority is the difficulty. The chronicle says [[casa-bellias|House Bellias]] *became* the rulers here, in an age when there was no emperor to make anyone a ruler of anything, and it does not say whether Aranti was granted, claimed, or simply held until the claim stopped being questioned.',
          'Of the land itself the archive offers not a single detail — no border, no city, no people, no produce. Aranti appears in this account solely as an answer to the question of where the Bellias sit, and the chronicle never asks it a second question.',
        ],
      },
    ],
    relacionados: ['casa-bellias', 'primeiro-bellias', 'guerra-verdejante', 'corte-seelie', 'fentor', 'era-sombria'],
    eras: ['era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['The Realm of Aranti'],
  },

  {
    chave: 'khorvari',
    titulo: 'The Khorvari Coast',
    epiteto: 'The Turned Shore',
    categoria: 'lugar',
    resumo:
      'A coast once raided by the Horde of the Red Hand, now defended by House Vinco, born of that very Horde.',
    brasao: 'porto',
    ficha: [
      { rotulo: 'Region', valor: 'The coast of Khorvari, at the continent’s edge' },
      { rotulo: 'Held by', valor: 'House Vinco' },
      { rotulo: 'Notable', valor: 'The road by which the Horde of the Red Hand came inland' },
      { rotulo: 'Condition', valor: 'Defended by the descendants of its own raiders' },
    ],
    epigrafe:
      'Born of the very Horde of the Red Hand it once fought beside — reforged into the sworn defenders of the coast they once raided.',
    secoes: [
      {
        titulo: 'The Raided Shore',
        paragrafos: [
          'For the whole of [[era-sombria|the Dark Age]] this coast is named in the chronicle as a direction of attack. It was out of Khorvari that [[horda-da-mao-vermelha|the Horde of the Red Hand]] came invading, and against that invasion [[casa-draco|House Draco]] set itself in [[endor|Endor]], as the shield of a realm that no longer had an emperor to shield it.',
        ],
      },
      {
        titulo: 'The Horde Reforged',
        paragrafos: [
          'In the reign of [[mayan-herrys|the White Queen]], when many houses rose through marriages and alliances arranged by the crown, the coast was settled by the strangest of those arrangements. [[casa-vinco|House Vinco]] was born out of [[horda-da-mao-vermelha|the Horde]] itself, and became the sworn defenders of the shore it had once raided — a peace made by turning the raiders into the garrison.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Where the Red Hand came from is never stated. The chronicle has it arriving *from the Coast of Khorvari* and no further back than that: whether the Horde crossed water to reach the coast, or was of it, the archive does not say.',
          'Neither does it explain the turning. That a horde of invaders became a noble house of the empire is recorded as a fact and never as a process — no terms, no negotiator, no year, and no word on how [[endor|those who had held the line against them]] received the news.',
        ],
      },
    ],
    relacionados: ['casa-vinco', 'horda-da-mao-vermelha', 'casa-draco', 'endor', 'mayan-herrys', 'era-segunda-luz'],
    eras: ['era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['Khorvari', 'The Coast of Khorvari'],
  },

  {
    chave: 'fentor',
    titulo: 'Fentor',
    epiteto: 'The Fey Continent',
    categoria: 'lugar',
    resumo:
      'The fey continent beyond the Astral Sea, held by the Seelie Court and invaded once, in the Verdant War.',
    brasao: 'folha',
    ficha: [
      { rotulo: 'Region', valor: 'A continent beyond the Astral Sea, apart from Valoran' },
      { rotulo: 'Held by', valor: 'The Seelie Court — no House of Valoran' },
      { rotulo: 'Notable', valor: 'Invaded once, by the golden host of the Young King' },
      { rotulo: 'Condition', valor: 'Closed by a pact of non-interference' },
    ],
    epigrafe:
      'The death of such a beast led to the Seelie Court’s surrender, and a pact of non-interference between the two ruling powers.',
    secoes: [
      {
        titulo: 'The Continent Across the Void',
        paragrafos: [
          'Fentor is not part of Valoran and never was. It is the fey continent, held by [[corte-seelie|the Seelie Court]], and it lies on the far side of [[mar-astral|the Astral Sea]] — which is why the most infamous war of [[ayren-herrys-ii|the Young King]] was fought upon no ground this chronicle otherwise describes.',
        ],
      },
      {
        titulo: 'The Verdant War',
        paragrafos: [
          '[[guerra-verdejante|The Verdant War]] was waged through means never before seen: [[naus-oraculo|the Oracle Ships]], mighty vessels capable of traversing the void, which carried an invasion out of [[imperio-aer-firen|the empire]] and onto the fey continent. The golden host was stopped only when [[primeiro-bellias|a warrior of giant’s blood]] — later named the first of [[casa-bellias|House Bellias]] — slew a primordial horror the [[corte-seelie|Court]] had unleashed in the fighting.',
          'That death brought the surrender, and the surrender brought the pact: non-interference, sworn between the two ruling powers. Fentor closed behind it, and the chronicle of Valoran has had no occasion to open it since.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Of the continent itself, nothing survives in this archive — not a border, not a city, not a river, not the name of a single fey lord, not even the name of the ruler who surrendered. An empire crossed the void to invade Fentor and brought back no geography.',
          'What a *primordial horror* is, and what [[corte-seelie|the Seelie]] had to do to unleash one, is equally unwritten. So is the state of the pact: whether it still binds, whether either power has tested it, and whether any mortal has set foot on Fentor since the host sailed home.',
        ],
      },
    ],
    relacionados: ['corte-seelie', 'guerra-verdejante', 'naus-oraculo', 'mar-astral', 'primeiro-bellias', 'ayren-herrys-ii'],
    eras: ['era-primeira-luz'],
    alcunhas: ['The Seelie Continent'],
  },

  {
    chave: 'mar-astral',
    titulo: 'The Astral Sea',
    epiteto: 'The Void at the Edge',
    categoria: 'lugar',
    resumo:
      'The void that borders Valoran, crossed by the Oracle Ships and fed without end by the Eternal Waterfall.',
    brasao: 'vazio',
    ficha: [
      { rotulo: 'Region', valor: 'The void beyond the continent’s edge' },
      { rotulo: 'Held by', valor: 'No ruling House' },
      { rotulo: 'Notable', valor: 'The Oracle Ships; the Eternal Waterfall that pours into it' },
      { rotulo: 'Condition', valor: 'Crossed but once in the record — and pouring still' },
    ],
    epigrafe: 'Its waters spill without end into the Astral Sea.',
    secoes: [
      {
        titulo: 'The Border of the World',
        paragrafos: [
          'Every map of Valoran in this archive is a map of the continent and of the Astral Sea that borders it. It is the edge past which the land does not continue: a void, in the chronicle’s own word, and the only route between Valoran and [[fentor|the fey continent]] beyond.',
        ],
      },
      {
        titulo: 'Two Crossings',
        paragrafos: [
          'It has been sailed. [[naus-oraculo|The Oracle Ships]] were mighty vessels capable of traversing the Astral Sea itself, and they bore the golden host of [[imperio-aer-firen|the empire]] across it to invade [[corte-seelie|the Seelie Court]] in [[guerra-verdejante|the Verdant War]] — the one voyage this account records.',
          'And it has been fed. Since [[roubo-de-sindaren|the Theft of Sindaren]], when a cabal of archmages tore an inland ocean out of the world, [[cascata-eterna|the Eternal Waterfall]] has spilled endlessly off the broken lip of [[sindaren|that realm]] into the void. The same wound opened a planar rift, and through it [[yuan-ti|horrors]] came the other way.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'What the Astral Sea *is*, the chronicle never settles. It is called a sea and it is called a void, in the same account and sometimes in the same sentence, and no page explains how a vessel sails it, how [[naus-oraculo|the Oracle Ships]] were built, or whether any remain.',
          'Nor is there any accounting of the water. An ocean has been falling into this emptiness for centuries and the archive does not say where it goes, whether the fall diminishes, or whether the rift that let [[yuan-ti|the serpentfolk]] through was ever closed behind them.',
        ],
      },
    ],
    relacionados: ['naus-oraculo', 'cascata-eterna', 'fentor', 'sindaren', 'guerra-verdejante', 'roubo-de-sindaren'],
    eras: ['era-primeira-luz', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['Astral Sea', 'The Void'],
  },

  {
    chave: 'yoso',
    titulo: 'Yōso',
    epiteto: 'Realm of the Hōseki',
    categoria: 'lugar',
    resumo:
      'The distant realm of the Hōseki Dynasty, adversary of the empire in the War of the Winds.',
    brasao: 'serpente-imperial',
    ficha: [
      { rotulo: 'Region', valor: 'Beyond Valoran; the chronicle gives no bearing' },
      { rotulo: 'Held by', valor: 'The Hōseki Dynasty — no House of Valoran' },
      { rotulo: 'Notable', valor: 'Adversary of the empire in the War of the Winds' },
      { rotulo: 'Condition', valor: 'Unrecorded — its remnants scattered upon Valoran' },
    ],
    epigrafe:
      'Her corpse was discovered with the banner of House Keaton — a house unknown to all but the imperial family — pierced through her body.',
    secoes: [
      {
        titulo: 'A Name and a War',
        paragrafos: [
          'Yōso is the realm of [[dinastia-hoseki|the Hōseki Dynasty]], and in this chronicle it is little more than that: the answer to the question of whom [[imperio-aer-firen|the empire]] fought in [[guerra-dos-ventos|the War of the Winds]], the first of the two calamities that shook the continent in [[era-moderna|the modern age]] before the rise of the present ruler.',
        ],
      },
      {
        titulo: 'How the War Ended',
        paragrafos: [
          'It ended with an assassination. [[imperatriz-hoseki|The Hōseki Empress]] was found dead, the banner of [[casa-keaton|House Keaton]] — a house unknown to all but the imperial family — pierced through her body. Who carried that banner, and upon whose word, the record does not say, and this scholar has found no archive in the capital that does.',
          'What is certain is that the ending was not clean: remnants of the [[dinastia-hoseki|Hōseki]] forces still remained upon Valoran, sparking many conflicts over the decades that followed. Of Yōso itself, after the death of its empress, the chronicle says nothing at all.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Almost everything. This account gives Yōso a name, a dynasty and a defeat, and withholds the rest entirely: where it lies, how far, across what water or void, and by what road an army of [[firen|the north]] ever reached it. That its forces were *remnants upon Valoran* is the only hint that it is not of Valoran, and a hint is not a location.',
          'Nothing of its lands, its people, its faith or its laws was set down. Neither is the cause of [[guerra-dos-ventos|the war]] — who struck first, and over what. Whether the dynasty still rules there, and what it made of an empress killed under a banner no one outside [[casa-herrys|one family]] could name, is beyond anything this desk can honestly report.',
        ],
      },
    ],
    relacionados: ['dinastia-hoseki', 'imperatriz-hoseki', 'guerra-dos-ventos', 'casa-keaton', 'era-moderna'],
    eras: ['era-moderna'],
    alcunhas: ['Yoso', 'The Hōseki Realm'],
  },

  {
    chave: 'montanhas-orientais',
    titulo: 'The Eastern Mountains',
    epiteto: 'Where the Giants’ Blood Came Down',
    categoria: 'lugar',
    resumo:
      'The eastern range that sent a host of giants’ descendants to repel the Yuan-Ti, and so gave rise to House Sturm.',
    brasao: 'montanha',
    ficha: [
      { rotulo: 'Region', valor: 'The eastern range of Valoran' },
      { rotulo: 'Held by', valor: 'No ruling House' },
      { rotulo: 'Notable', valor: 'Home of the giants’ descendants who became House Sturm' },
      { rotulo: 'Condition', valor: 'The record follows those who came down, not those who stayed' },
    ],
    epigrafe: 'A host of warriors from the eastern mountains — descendants of giants.',
    secoes: [
      {
        titulo: 'The Host That Came Down',
        paragrafos: [
          'The eastern mountains enter the chronicle once, and decisively. When [[roubo-de-sindaren|the Theft of Sindaren]] tore an ocean from the world and [[yuan-ti|the Yuan-Ti]] came through the rift it left, the serpentfolk were repelled only through the combined efforts of [[casa-deallus|House Deallus]] and a host of warriors out of this range — descendants of giants, who marched down from the high country to a war that was not theirs.',
          'They did not go home. In recognition of their valour they were granted a noble title as [[casa-sturm|House Sturm]] and dominion over [[ershen|the swamplands of Ershen]], and the chronicle thereafter speaks of them as lords of a marsh rather than as a people of the mountains.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Of the range itself: nothing. No peak is named, no pass, no hold, no border. Whether any of the giants’ descendants remained in the east when the rest went to fight, and what became of them if they did, the archive does not report — it follows the ones who left and loses the rest.',
          'There is also a coincidence this scholar will flag and not resolve. The chronicle twice tells of a people coming down out of mountains: [[darron-alabaster|Darron Alabaster]], the dwarven chief who led his folk down to join the grand alliance in [[era-mil-reis|the age of the founding]], and these giant-blooded warriors, many centuries afterward. It never says whether the mountains were the same, and it would be invention to say so here.',
        ],
      },
    ],
    relacionados: ['casa-sturm', 'ershen', 'yuan-ti', 'casa-deallus', 'roubo-de-sindaren', 'darron-alabaster'],
    eras: ['era-segunda-luz'],
    alcunhas: ['Eastern Mountains', 'The Mountains of the East'],
  },
];
