/**
 * Códice de Valoran — as pessoas.
 *
 * Reis, heróis e monstros que a crônica nomeia. É a gaveta que o usuário
 * pediu primeiro ("uma aba de wiki para cada personagem"), e por isso a mais
 * detalhada: cada verbete traz ficha, seções nomeadas e o máximo de ligações
 * que o cânone sustenta.
 *
 * Material extraído de "The Annals of Valoran", documento de autoria do
 * usuário, atribuído em ficção a Maedrin Rimors, Scholar of the Imperial
 * Archives, Anno 1570. A prosa fica em inglês porque é a língua do original
 * e a voz do cronista; só o código em volta é comentado em português.
 *
 * Duas pessoas aqui não têm nome, e isso é do cânone, não descuido: o
 * fundador de Bellias é "a warrior of giant's blood — later posthumously
 * named the first of House Bellias", e a imperatriz Hōseki aparece apenas
 * como um cadáver com um estandarte atravessado. Os verbetes dizem isso em
 * vez de batizá-los.
 */

import type { Verbete } from '../tipos';

export const PERSONAGENS: Verbete[] = [
  // ------------------------------------------------------------ a dinastia
  {
    chave: 'arran-herrys',
    titulo: 'Arran Herrys',
    epiteto: 'The First High King',
    categoria: 'pessoa',
    resumo: 'The northern warlord who swore an oath, found a sacred blade in his hand, and forged a kingdom from a thousand clans.',
    brasao: 'coroa',
    ficha: [
      { rotulo: 'Kin', valor: 'Human' },
      { rotulo: 'Title', valor: 'First High King of Firen' },
      { rotulo: 'House', valor: 'Herrys — its founder' },
      { rotulo: 'Era', valor: 'The Age of a Thousand Kings' },
      { rotulo: 'Fate', valor: 'Unrecorded' },
    ],
    epigrafe: 'As his oath was sworn, he looked down — and the sacred blade Firen was now in his hand.',
    secoes: [
      {
        titulo: 'The Oath',
        paragrafos: [
          'Before there was an empire there was a vision. In the last years of the [[era-mil-reis|Age of a Thousand Kings]], when Valoran was a land of endless war and every clan called upon [[os-doze|the Twelve]] for strength, a great warlord of the northern lands was blessed with the sight of a great eternal empire bathed in holy light — and swore to make that vision real.',
          'The archive is precise about what followed the oath and vague about everything before it. He looked down, and the blade [[lamina-firen|Firen]] was in his hand.',
        ],
      },
      {
        titulo: 'The Kingdom',
        paragrafos: [
          'Armed with the blade and the guidance of the divine, Arran Herrys united many of the warring clans of the north into one greater kingdom — [[firen|Firen]], which took its name from the sword — and was made its first High King. It is the first act in this codex that anyone would call a founding.',
          'What he built did not stand long in his lifetime. [[dartharion|Dartharion]], the Calamity, whose shadow had lain over the continent for centuries, turned his gaze toward the emerging kingdom and buried it in unholy fire. The vengeance for that burning fell to his son, [[ayren-herrys-i|Ayren Herrys I]].',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'His death is nowhere written. The chronicle names him warlord, then king, then turns to the dragon and to his son, and never returns. Whether he fell in the burning of his own kingdom or lived to see it avenged, this account does not tell.',
          'Nor does it say which of [[os-doze|the Twelve]] granted the vision, nor why a blade should answer an oath. The house he founded still carries the wing and the crown, and [[casa-herrys|House Herrys]] has held the throne through every age of light since.',
        ],
      },
    ],
    relacionados: ['lamina-firen', 'firen', 'casa-herrys', 'ayren-herrys-i', 'dartharion', 'era-mil-reis'],
    eras: ['era-mil-reis'],
    alcunhas: ['Arran', 'the first warlord', 'first High King'],
  },
  {
    chave: 'ayren-herrys-i',
    titulo: 'Ayren Herrys I',
    epiteto: 'The Avenger King',
    categoria: 'pessoa',
    resumo: 'The warlord’s son who avenged a burned kingdom, felled the Calamity, and began the calendar Valoran still counts by.',
    brasao: 'coroa',
    ficha: [
      { rotulo: 'Kin', valor: 'Human' },
      { rotulo: 'Title', valor: 'Second High King of Firen' },
      { rotulo: 'House', valor: 'Herrys' },
      { rotulo: 'Era', valor: 'From the Thousand Kings into the First Light' },
      { rotulo: 'Known for', valor: 'The felling of Dartharion; Year 0' },
    ],
    secoes: [
      {
        titulo: 'The Grievance',
        paragrafos: [
          'Son of [[arran-herrys|Arran Herrys]], the warlord who first united the northern lands, he enters the chronicle already carrying a grievance: [[dartharion|Dartharion]] had buried his father’s kingdom in unholy fire, and he sought revenge for its destruction.',
          'He did not seek it alone. Three others rose from the same chaos — [[darron-alabaster|Darron Alabaster]] of the dwarves, [[sellias-delios|Sellias Moonwhisper Delios]] of [[sindaren|Sindaren]], and [[rhogar|Rhogar]] of the dragon’s blood — and together the four led a grand alliance against the Calamity and [[queda-de-dartharion|felled their draconic overlord]].',
        ],
      },
      {
        titulo: 'Year Zero',
        paragrafos: [
          'With the dragon’s death he was crowned second High King of [[firen|Firen]], and that crowning is where the official calendar used across Valoran begins. Every date in this codex — the [[noite-de-luctos|night at Luctos]], the [[roubo-de-sindaren|Theft of Sindaren]], the year 1570 in which these Annals close — is counted forward from the moment a son avenged his father.',
          'His kingdom was strong but was only a foundation. Over the generations that followed, [[firen|Firen]] expanded and brought stability where there had been only war — built, the record insists, not by conquest alone but through diplomacy, trade and alliance. The conquering would come later, with [[ayren-herrys-ii|the Young King]].',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'How long he reigned, how he died, and by what line the crown passed from him to [[ayren-herrys-ii|Ayren Herrys II]] — the chronicle gives none of it. It skips from his coronation to "over generations" and then to a king of fifteen.',
        ],
      },
    ],
    relacionados: ['arran-herrys', 'queda-de-dartharion', 'dartharion', 'rhogar', 'darron-alabaster', 'era-primeira-luz'],
    eras: ['era-mil-reis', 'era-primeira-luz'],
    alcunhas: ['Ayren the First', 'second High King'],
  },
  {
    chave: 'ayren-herrys-ii',
    titulo: 'Ayren Herrys II',
    epiteto: 'The Young King',
    categoria: 'pessoa',
    resumo: 'Crowned at fifteen, he made a kingdom into an empire, warred upon the fey — and was undone in a single night at Luctos.',
    brasao: 'lamina',
    ficha: [
      { rotulo: 'Kin', valor: 'Human' },
      { rotulo: 'Title', valor: 'Emperor of Aer Firen' },
      { rotulo: 'House', valor: 'Herrys' },
      { rotulo: 'Crowned', valor: 'At fifteen years of age' },
      { rotulo: 'Era', valor: 'The First Age of Light' },
      { rotulo: 'Fate', valor: 'Vanished at Luctos — the record also calls it death' },
    ],
    epigrafe: 'The Citadel of Glass, the only remnant of that city, stands as a grim monument to that mysterious night.',
    secoes: [
      {
        titulo: 'The Conqueror',
        paragrafos: [
          'A visionary and a conqueror, he took the throne at fifteen and began by subjugating the two powers that might have checked him: the resistance of the nobility, and of [[igreja-dos-doze|the Church]]. Then he pushed beyond the northern plateau, leading his armies through the [[ashara|Ashara Plains]] and beyond, until domain over the entire continent was consolidated in one hand.',
          'That is the moment the Kingdom of Firen became the [[imperio-aer-firen|Empire of Aer Firen]]. It is the high-water mark of the [[era-primeira-luz|First Age of Light]], and the only time in this chronicle that a single ruler holds all of Valoran by conquest rather than by consent.',
        ],
      },
      {
        titulo: 'The War Beyond the Sea',
        paragrafos: [
          'His most infamous war was not fought upon Valoran at all. Aboard the [[naus-oraculo|Oracle Ships]] — vessels able to traverse [[mar-astral|the Astral Sea]] itself — the empire’s golden host crossed the void to invade [[fentor|Fentor]] and make war upon the [[corte-seelie|Seelie Court]].',
          'The [[guerra-verdejante|Verdant War]] ended not by his hand but by another’s: a warrior of giant’s blood, [[primeiro-bellias|later named the first of House Bellias]], slew a primordial horror the Seelie had unleashed, and the death of such a beast brought the Court to surrender and to a pact of non-interference between the two ruling powers.',
        ],
      },
      {
        titulo: 'The Night at Luctos',
        paragrafos: [
          'His ambitions did not end at conquest. He turned his gaze inward, seeking knowledge long buried, and toward the region now called [[luctos|Luctos]] — strewn with the ruins of older civilizations. There he built a grand capital, and in a single night it was reduced to ruin.',
          'What happened there is the largest hole in this codex. The [[igreja-dos-doze|Church of the Twelve]] has preserved only fragments of the tale. The [[cidadela-de-vidro|Citadel of Glass]] is all that still stands of the city, and with his disappearance the empire fell into disorder — into the [[era-sombria|Dark Age]].',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The chronicle cannot agree with itself on what became of him. In one place it is a *vanishing*; in the next chapter it is plainly "the death of the Young King". This codex reproduces both and resolves neither, because resolving it would mean inventing the answer.',
          'What he sought at Luctos, what he found there, and what the Church chose to keep rather than record — none of it is written.',
        ],
      },
    ],
    relacionados: ['noite-de-luctos', 'cidadela-de-vidro', 'guerra-verdejante', 'imperio-aer-firen', 'luctos', 'naus-oraculo'],
    eras: ['era-primeira-luz'],
    alcunhas: ['the Young King', 'Ayren the Second'],
  },
  {
    chave: 'mayan-herrys',
    titulo: 'Mayan Herrys',
    epiteto: 'The White Queen',
    categoria: 'pessoa',
    resumo: 'Born with celestial radiance, she reunited a shattered continent through wisdom rather than war, and reigned for centuries.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Kin', valor: 'Human — born with celestial radiance' },
      { rotulo: 'Title', valor: 'Empress of Aer Firen' },
      { rotulo: 'House', valor: 'Herrys' },
      { rotulo: 'Reign', valor: 'Centuries — the Second Age of Light' },
      { rotulo: 'Fate', valor: 'Died; her passing began the Modern Age' },
    ],
    secoes: [
      {
        titulo: 'Peace Without Conquest',
        paragrafos: [
          'She emerges from the [[era-sombria|Dark Age]] as its answer. Where [[ayren-herrys-ii|the Young King]] had taken the continent by force and lost it in a night, Mayan Herrys united Valoran once more not through war but through wisdom — forging alliances where others had sought dominion, and bringing peace to the continent for the first time in centuries.',
          'Under her the empire flourished again, and the [[era-segunda-luz|Second Age of Light]] takes its name from her reign. It is the longest age in this chronicle, and the only one whose defining ruler is remembered for what she did not have to conquer.',
        ],
      },
      {
        titulo: 'The Queen’s Arrangements',
        paragrafos: [
          'Half the nobility of Valoran dates from her table. Many noble houses and branch families rose in this period through marriages and alliances arranged by the crown: [[casa-orhys|House Orhys]] at [[rhydash|Rhydash]], recorded as a grant to a prolific merchant; [[casa-vinco|House Vinco]], raised out of the [[horda-da-mao-vermelha|Horde of the Red Hand]] itself to defend the coast it once raided; and [[casa-keaton|House Keaton]], whose origins are ascribed to this period and are otherwise entirely unknown.',
          'Her age was not spared tragedy. The [[roubo-de-sindaren|Theft of Sindaren]] tore an inland ocean from the world and let the [[yuan-ti|Yuan-Ti]] through the wound; it was the combined effort of [[casa-deallus|House Deallus]] and the giant-descended warriors of the [[montanhas-orientais|eastern mountains]] that repelled them, and those warriors she raised as [[casa-sturm|House Sturm]].',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Her reign lasted for centuries — the chronicle says so plainly and does not explain how. Whether the celestial radiance she was born with accounts for the length of it, this account never asks.',
          'Her parentage, her ascent, and the manner of her death are all absent. "All things must end," writes the chronicler, "and with her passing, a new age dawned." That is the whole of it.',
        ],
      },
    ],
    relacionados: ['era-segunda-luz', 'roubo-de-sindaren', 'casa-sturm', 'casa-keaton', 'casa-herrys', 'casa-vinco'],
    eras: ['era-segunda-luz'],
    alcunhas: ['the White Queen', 'Mayan'],
  },
  {
    chave: 'ayren-herrys-iv',
    titulo: 'Ayren Herrys IV',
    epiteto: 'The Golden Tyrant',
    categoria: 'pessoa',
    resumo: 'The one-winged emperor of the present year, whose rule is taxation, soldiery, and the Divine Lance turned upon dissent.',
    brasao: 'asa',
    ficha: [
      { rotulo: 'Kin', valor: 'Celestial-blooded — a single wing' },
      { rotulo: 'Title', valor: 'Emperor of Aer Firen' },
      { rotulo: 'House', valor: 'Herrys' },
      { rotulo: 'Called', valor: '“Carsaros”, the Golden Tyrant — by some' },
      { rotulo: 'Era', valor: 'The Modern Age — reigning' },
      { rotulo: 'Instrument', valor: 'The Divine Lance' },
    ],
    epigrafe: 'Yet, as history has shown, no reign lasts forever.',
    secoes: [
      {
        titulo: 'The Present Reign',
        paragrafos: [
          'The empire that recovers from war and famine at the close of these Annals is ruled by Ayren Herrys IV — nicknamed *Carsaros*, the Golden Tyrant, by some. He is celestial-blooded, as [[mayan-herrys|the White Queen]] was, and he has a single wing.',
          'His rule is one of heavy taxation and military might. Under him the empire discovered the power of the [[lanca-divina|Divine Lance]] and harnessed it as a weapon to crush dissidence — the first time in this chronicle that a divine instrument is turned inward, upon the empire’s own.',
        ],
      },
      {
        titulo: 'The Ground He Stands On',
        paragrafos: [
          'He inherits a continent still marked by two wounds of the [[era-moderna|Modern Age]]. The [[guerra-dos-ventos|War of the Winds]] against the [[dinastia-hoseki|Hōseki Dynasty]] of [[yoso|Yōso]] ended with an assassinated empress and remnants of her forces still on Valoran, sparking conflicts for decades. The [[ano-vermelho|Red Year]] ravaged the [[ashara|Ashara Plains]] and drove its survivors toward [[rhydash|Rhydash]].',
          'That the chronicler names him tyrant only "by some", and then closes the book on the observation that no reign lasts forever, is as close as an imperial archivist writing in the present tense can safely come to an opinion.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Where the [[lanca-divina|Divine Lance]] was found, what it is, and what it costs to use are all absent. So is the reason for the single wing — whether it is inheritance, injury, or something the archive declines to name.',
          'Nor is his descent from [[mayan-herrys|the White Queen]] ever stated. The chronicle records only that the rulers between them were unremarkable, governing without great triumphs or great calamities.',
        ],
      },
    ],
    relacionados: ['lanca-divina', 'casa-herrys', 'era-moderna', 'imperio-aer-firen', 'ano-vermelho', 'guerra-dos-ventos'],
    eras: ['era-moderna'],
    alcunhas: ['Carsaros', 'the Golden Tyrant', 'the one-winged emperor'],
  },

  // -------------------------------------------------- os heróis da fundação
  {
    chave: 'darron-alabaster',
    titulo: 'Darron Alabaster',
    epiteto: 'Chief of the Deep',
    categoria: 'pessoa',
    resumo: 'The dwarven chieftain who led his people down from the mountains to answer the call of the grand alliance.',
    brasao: 'martelo',
    ficha: [
      { rotulo: 'Kin', valor: 'Dwarf' },
      { rotulo: 'Title', valor: 'Chieftain' },
      { rotulo: 'Era', valor: 'The Age of a Thousand Kings' },
      { rotulo: 'Known for', valor: 'The grand alliance against Dartharion' },
      { rotulo: 'Fate', valor: 'Unrecorded' },
    ],
    secoes: [
      {
        titulo: 'The Call Answered',
        paragrafos: [
          'One of the four who rose from the chaos of the [[era-mil-reis|Age of a Thousand Kings]]. Where [[ayren-herrys-i|Ayren Herrys I]] came carrying a grievance and [[rhogar|Rhogar]] came carrying dragon’s blood, Darron Alabaster came carrying a people: he led them down from the mountains to join the great cause, and stood in the alliance that [[queda-de-dartharion|felled the Calamity]].',
          'It is worth marking what that decision was. A mountain hold had no need to answer a burning on the northern plain. He answered anyway, and the [[era-primeira-luz|age of light]] that followed was built on that answer as much as on the sword.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Alone among the four, Darron Alabaster leaves no line behind him in this chronicle. [[rhogar|Rhogar]]’s blood became [[casa-draco|House Draco]]; [[sellias-delios|Sellias]]’ people ruled [[sindaren|Sindaren]] until it was torn away; [[ayren-herrys-i|Ayren]] took a crown. Of the dwarves after the founding, and of which mountains they came down from, the Annals say nothing at all.',
        ],
      },
    ],
    relacionados: ['queda-de-dartharion', 'ayren-herrys-i', 'rhogar', 'sellias-delios', 'era-mil-reis', 'dartharion'],
    eras: ['era-mil-reis'],
    alcunhas: ['Darron', 'the dwarven chief'],
  },
  {
    chave: 'sellias-delios',
    titulo: 'Sellias Moonwhisper Delios',
    epiteto: 'The Elven Prodigy',
    categoria: 'pessoa',
    resumo: 'The elven prodigy of Sindaren, whose people ruled the inland realm in the age before it was stolen from the world.',
    brasao: 'folha',
    ficha: [
      { rotulo: 'Kin', valor: 'Elf' },
      { rotulo: 'Of', valor: 'Sindaren — the now-lost lands' },
      { rotulo: 'Era', valor: 'The Age of a Thousand Kings' },
      { rotulo: 'Known for', valor: 'The grand alliance against Dartharion' },
      { rotulo: 'Fate', valor: 'Unrecorded' },
    ],
    secoes: [
      {
        titulo: 'The Prodigy',
        paragrafos: [
          'A prodigy of [[sindaren|Sindaren]], whose people still ruled that realm when the four heroes rose to face [[dartharion|Dartharion]]. He stood in the grand alliance beside [[ayren-herrys-i|Ayren Herrys I]], [[darron-alabaster|Darron Alabaster]] and [[rhogar|Rhogar]], and the [[queda-de-dartharion|Calamity fell]].',
        ],
      },
      {
        titulo: 'The Realm That Was Taken',
        paragrafos: [
          'His verbete cannot be read apart from what happened to his homeland long after him. Sindaren was a vast inland ocean; in [[mayan-herrys|the White Queen]]’s age a cabal of archmages [[roubo-de-sindaren|tore it from Valoran]], leaving the [[cascata-eterna|Eternal Waterfall]] pouring into [[mar-astral|the Astral Sea]] and a planar rift through which the [[yuan-ti|Yuan-Ti]] came.',
          'The chronicle calls Sindaren "the now-lost lands" in the very sentence that introduces him — writing of a man in one age with the loss of a later one already in its mouth.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'What became of him, whether his line survived into [[casa-deallus|House Deallus]] who later ruled that realm, and where the elves of Sindaren went when the ocean was taken — the Annals answer none of it.',
        ],
      },
    ],
    relacionados: ['sindaren', 'roubo-de-sindaren', 'queda-de-dartharion', 'casa-deallus', 'ayren-herrys-i', 'era-mil-reis'],
    eras: ['era-mil-reis'],
    alcunhas: ['Sellias', 'Moonwhisper', 'Delios'],
  },
  {
    chave: 'rhogar',
    titulo: 'Rhogar',
    epiteto: 'Fury of the Blood',
    categoria: 'pessoa',
    resumo: 'The half-dragon barbarian of unmatched fury who helped fell a dragon — and whose blood became House Draco.',
    brasao: 'dragao',
    ficha: [
      { rotulo: 'Kin', valor: 'Half-Dragon' },
      { rotulo: 'Title', valor: 'Barbarian' },
      { rotulo: 'Era', valor: 'The Age of a Thousand Kings' },
      { rotulo: 'Line', valor: 'House Draco descends from him' },
      { rotulo: 'Fate', valor: 'Unrecorded' },
    ],
    secoes: [
      {
        titulo: 'Dragon Against Dragon',
        paragrafos: [
          'A warrior of unmatched fury who carried the blood of dragons in his veins, and who turned that blood against a dragon: he stood in the grand alliance with [[ayren-herrys-i|Ayren Herrys I]], [[darron-alabaster|Darron Alabaster]] and [[sellias-delios|Sellias Moonwhisper Delios]], and together they [[queda-de-dartharion|felled Dartharion]], the Calamity whose rule had shadowed the continent for centuries.',
        ],
      },
      {
        titulo: 'The Line',
        paragrafos: [
          'Of the four, his inheritance is the most visible on the map. [[casa-draco|House Draco]] descends from Rhogar’s bloodline; in the [[era-sombria|Dark Age]] it secured [[endor|Endor]] and has stood ever since as the shield of the realm against the [[horda-da-mao-vermelha|Horde of the Red Hand]] coming off [[khorvari|the Khorvari Coast]].',
          'A house of dragon-blood keeping the western gate, founded by the man who helped kill the last great dragon in this chronicle, is the sort of symmetry an imperial archivist is glad to be able to record without embellishment.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Whose blood it was. The Annals never say which dragon Rhogar descends from, nor whether it was [[dartharion|Dartharion]]’s own — a silence that has to be deliberate, given how much of this chronicle turns on that dragon.',
        ],
      },
    ],
    relacionados: ['casa-draco', 'queda-de-dartharion', 'dartharion', 'endor', 'ayren-herrys-i', 'era-mil-reis'],
    eras: ['era-mil-reis'],
    alcunhas: ['the half-dragon barbarian'],
  },

  // ------------------------------------------------------------- os inimigos
  {
    chave: 'dartharion',
    titulo: 'Dartharion',
    epiteto: 'The Calamity',
    categoria: 'pessoa',
    resumo: 'The great dragon whose rule shadowed Valoran for centuries, until four heroes ended the Age of a Thousand Kings by felling him.',
    brasao: 'dragao',
    ficha: [
      { rotulo: 'Kin', valor: 'Dragon' },
      { rotulo: 'Style', valor: 'The Calamity; draconic overlord' },
      { rotulo: 'Reign', valor: 'Centuries, ending at Year 0' },
      { rotulo: 'Era', valor: 'The Age of a Thousand Kings' },
      { rotulo: 'Fate', valor: 'Felled by the grand alliance' },
    ],
    epigrafe: 'Endless war beneath the shadow of the dragon Dartharion, until four heroes felled the Calamity.',
    secoes: [
      {
        titulo: 'The Shadow',
        paragrafos: [
          'For centuries before the founding, the rule of the great dragon Dartharion cast its shadow over the continent. The [[era-mil-reis|Age of a Thousand Kings]] — countless kingdoms, city-states and wandering clans, each warring for its own corner — is the age lived beneath him.',
          'When [[arran-herrys|Arran Herrys]] forged one kingdom from those clans, the Calamity turned his gaze toward it and buried [[firen|Firen]] in unholy fire. That burning is what put a sword in his son’s hand.',
        ],
      },
      {
        titulo: 'The Felling',
        paragrafos: [
          'Four heroes rose from the chaos: [[ayren-herrys-i|Ayren Herrys I]], seeking revenge for a burned kingdom; [[darron-alabaster|Darron Alabaster]], who brought his people down from the mountains; [[sellias-delios|Sellias Moonwhisper Delios]] of [[sindaren|Sindaren]]; and [[rhogar|Rhogar]], who carried dragon’s blood against a dragon. Together they led a grand alliance and [[queda-de-dartharion|felled their draconic overlord]].',
          'His death is Year 0. Every date in Valoran is measured from the end of him.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Nothing of what he was beyond great, draconic and long-ruling. No lair, no origin, no motive is recorded, and the chronicle never says whether the blood in [[rhogar|Rhogar]]’s veins was his.',
        ],
      },
    ],
    relacionados: ['queda-de-dartharion', 'era-mil-reis', 'ayren-herrys-i', 'rhogar', 'arran-herrys', 'firen'],
    eras: ['era-mil-reis'],
    alcunhas: ['the Calamity', 'the draconic overlord'],
  },

  // ------------------------------------------------------- os sem nome
  {
    chave: 'primeiro-bellias',
    titulo: 'The First Bellias',
    epiteto: 'Slayer of the Primordial',
    categoria: 'pessoa',
    resumo: 'A warrior of giant’s blood who slew a primordial horror of the Seelie and won the Verdant War — and was named only after his death.',
    brasao: 'bellias',
    ficha: [
      { rotulo: 'Kin', valor: 'Giant’s blood' },
      { rotulo: 'Name', valor: 'Never recorded' },
      { rotulo: 'House', valor: 'Bellias — named for him, posthumously' },
      { rotulo: 'Era', valor: 'The First Age of Light' },
      { rotulo: 'Fate', valor: 'Died in the Verdant War' },
    ],
    secoes: [
      {
        titulo: 'The Beast and the Surrender',
        paragrafos: [
          'The [[guerra-verdejante|Verdant War]] was going badly. The empire’s golden host had crossed [[mar-astral|the Astral Sea]] aboard the [[naus-oraculo|Oracle Ships]] to invade [[fentor|Fentor]], and its push was ended only when a warrior of giant’s blood slew a primordial horror that the [[corte-seelie|Seelie]] had unleashed in the war.',
          'The death of such a beast brought the Court to surrender, and to a pact of non-interference between the two ruling powers that has held ever since. One killing ended a war between worlds.',
        ],
      },
      {
        titulo: 'Named After Death',
        paragrafos: [
          'He was *later posthumously named* the first of [[casa-bellias|House Bellias]]. The phrasing is the whole verbete: whoever he was, the empire gave him a house only once he could no longer answer to it, and the realm of [[aranti|Aranti]] went to the line that took his name.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'His name. That is the plainest gap in this codex — the chronicle preserves the deed, the consequence and the house, and loses the man. It does not say what the primordial horror was, either, nor how a mortal of giant’s blood came to be in the host at all.',
        ],
      },
    ],
    relacionados: ['casa-bellias', 'guerra-verdejante', 'corte-seelie', 'fentor', 'aranti', 'ayren-herrys-ii'],
    eras: ['era-primeira-luz'],
    alcunhas: ['the giant-blooded hero', 'first of House Bellias'],
  },
  {
    chave: 'imperatriz-hoseki',
    titulo: 'The Hōseki Empress',
    epiteto: 'The Slain Sovereign',
    categoria: 'pessoa',
    resumo: 'The sovereign of Yōso, assassinated to end the War of the Winds — her corpse found pierced by the banner of a house nobody knows.',
    brasao: 'serpente-imperial',
    ficha: [
      { rotulo: 'Kin', valor: 'Unrecorded' },
      { rotulo: 'Name', valor: 'Never recorded' },
      { rotulo: 'Realm', valor: 'The Hōseki Dynasty of Yōso' },
      { rotulo: 'Era', valor: 'The Modern Age' },
      { rotulo: 'Fate', valor: 'Assassinated — banner of House Keaton through her body' },
    ],
    epigrafe: 'Her corpse discovered with the banner of House Keaton — a house unknown to all but the imperial family — pierced through her body.',
    secoes: [
      {
        titulo: 'The End of a War',
        paragrafos: [
          'The [[guerra-dos-ventos|War of the Winds]] was fought against the [[dinastia-hoseki|Hōseki Dynasty]] of [[yoso|Yōso]], and it ended with her assassination. That is not a battle won; it is a war closed by a killing.',
          'Her corpse was discovered with a banner pierced through the body — the banner of [[casa-keaton|House Keaton]], which the chronicle describes in the same breath as *a house unknown to all but the imperial family*.',
        ],
      },
      {
        titulo: 'What It Left Behind',
        paragrafos: [
          'The dynasty did not simply end with her. Remnants of the Hōseki forces remained on Valoran, sparking many conflicts over the decades after — one of the two wounds, with the [[ano-vermelho|Red Year]], that the empire of [[ayren-herrys-iv|Ayren Herrys IV]] is still recovering from as these Annals close.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Her name, her kin, and the manner of the killing are all absent. So is any explanation of why an assassin would leave behind the banner of a house that officially nobody knows — whether as signature, as warning, or as something planted.',
          'The archive states the fact and moves on to a plague. A reader may draw his own conclusion about who benefits from a secret house having a banner at all.',
        ],
      },
    ],
    relacionados: ['guerra-dos-ventos', 'casa-keaton', 'dinastia-hoseki', 'yoso', 'era-moderna', 'ayren-herrys-iv'],
    eras: ['era-moderna'],
    alcunhas: ['Hoseki Empress', 'the slain empress'],
  },
];
