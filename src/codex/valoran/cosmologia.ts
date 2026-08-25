/**
 * Cosmologia de Valoran — o Grande Pilar, a Shadowfell, e os ritos dos Doze.
 *
 * Três textos trazidos pelo usuário, cada um atribuído a um autor diferente
 * de dentro do mundo:
 *
 * 1. "As Origens da Shadowfell", de Lianor Aralyn — mestre arcano do
 *    conselho Imaren, que ficou em Andari enquanto Sellias Moonwhisper foi
 *    ao norte matar Dartharion, e escreveu isto pouco depois d[[a-queda|a
 *    fuga de Corvus]].
 * 2. "O Grande Pilar, Vol. 3: Espíritos e o Plano Etéreo", de S. Jahar —
 *    tratado cosmológico sem data marcada no material.
 * 3. "Os Doze e seus Ritos", de Athran Judd, conato do atual imperador
 *    [[ayren-herrys-iv|Ayren Herrys IV]] — e o texto que nomeia, rito por
 *    rito, tudo que [[os-doze|as Anais]] confessam não saber.
 *
 * A prosa fica em inglês pela mesma razão que o resto das Anais: é a língua
 * do documento inteiro. Só os nomes próprios em português (os ritos, os
 * epítetos dos deuses) ficam como o autor escreveu, em itálico.
 */

import type { Verbete } from '../tipos';

export const COSMOLOGIA: Verbete[] = [
  {
    chave: 'shadowfell',
    titulo: 'The Shadowfell',
    epiteto: 'A Weapon Turned Curse',
    categoria: 'poder',
    resumo: 'The mirror-plane of the Feywild, forged as a weapon against the gods, and never fully stilled since.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'Kind', valor: 'Plane of existence — mirror to the Feywild' },
      { rotulo: 'Made by', valor: 'The Queen of Eternal Frost, from impure mortal hands' },
      { rotulo: 'Suppressed by', valor: 'The Autumn Eladrin, at the March of the Eclipse' },
      { rotulo: 'Source', valor: 'Lianor Aralyn of the Imaren council, writing shortly after the Fall' },
    ],
    epigrafe: 'A curse, not a creation — the crystallization of the sins of our fathers and old masters.',
    secoes: [
      {
        titulo: 'A Curse, Not a Creation',
        paragrafos: [
          'Lianor Aralyn, who stayed behind in Andari while [[sellias-delios|Sellias Moonwhisper]] marched north to help fell [[dartharion|the Calamity]], set down this account not long after [[a-queda|the flight from Corvus]]. Before that flight, he writes, the Moon Peoples’ ancestors lived on the continent now called Fentor — as descendants or servants of the Winter Eladrin, he cannot say which.',
          'What his archive states without qualification is this: the Feywild was raised by the worthy hands of the Heart, glorious father of all elves, incorporating the rhythms and emotions of living things. The Shadowfell is its black mirror — a plane born of impure, mortal hands, from an excess of negative energy, given shape as destruction, corruption, and endless melancholy. Its maker, the Queen of Eternal Frost, appears to have built it for one purpose: to wage a war against the gods themselves.',
        ],
      },
      {
        titulo: 'The March of the Eclipse',
        paragrafos: [
          'That war, meant to be led by the Queen against her own people — the Winter Eladrin — and ours, was put down almost as soon as it began. The Autumn Eladrin and their king struck first, in an event the Fey call the March of the Eclipse: the king carried the immortal queen, impaled on his own blade, down into Sios, the old homeland of the Winter Eladrin.',
          'Sealed does not mean ended. She remains immortal, and her darkness — which sank the heart of Sios into an abyss of shadow — still spreads like a disease across the world. Aralyn is careful on one point: the Queen herself no longer commands the shadows directly, but others, with similarly foul intentions, can still call on her power.',
        ],
      },
      {
        titulo: 'Traces in Corvus',
        paragrafos: [
          'During the years the Moon Peoples still dwelt in [[corvus]], after the moon returned to its orbit, traces of that shadow were already seen — on the icy, storm-wracked continent to the north, in the half-drowned lands to the east, even in a ravine of the land they now call refuge. A force older than the hag who drove them out of Corvus. What it was, Aralyn’s book does not say.',
        ],
      },
      {
        titulo: 'A New Heir',
        paragrafos: [
          'More recently, the shadows chose a new heir. [[raven-mother|Leas]], a monster shaped like a person, obsessed with death and fate, took the power of our wise ones by force, selling her soul to the dark for it. She now styles herself Raven Mother — a form and a bearing built to emulate and profane [[os-doze|the Weaver]], protector of the Moon Peoples.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'The Queen’s true name never appears in Aralyn’s pages — later voices in Andari know her only as Gelauda, and this archivist cannot confirm whether that is truth or superstition growing around a silence. Whether Sios and the land the campaign calls Fentor are the same place under two names, this codex will not assert; it notes only that both are said to hold something sealed and older than living memory.',
        ],
      },
    ],
    relacionados: ['corvus', 'a-queda', 'povos-lunares', 'raven-mother', 'os-doze', 'grande-pilar'],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-moderna'],
    alcunhas: ['the Shadowfell', 'Corvus', 'the Queen of Eternal Frost'],
  },

  {
    chave: 'grande-pilar',
    titulo: 'The Great Pillar',
    epiteto: 'Spirits and the Ethereal Plane',
    categoria: 'poder',
    resumo: 'The accepted cosmology of the planes: the Material and Astral at the center, ascending to the Twelve, descending into the Shadowfell.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Kind', valor: 'Cosmological structure' },
      { rotulo: 'Center', valor: 'The Material and Astral Planes, as one immediate existence' },
      { rotulo: 'Ascends through', valor: 'The Feywild, then Fire or Air, to the Upper Spheres of the Twelve' },
      { rotulo: 'Descends through', valor: 'The Shadowfell, then Water or Earth, to an unrecorded base' },
      { rotulo: 'Source', valor: 'S. Jahar, "The Great Pillar", Vol. 3: Spirits and the Ethereal Plane' },
    ],
    secoes: [
      {
        titulo: 'Center and Balance',
        paragrafos: [
          'As established in the first volume of this series, the recently accepted shape of the cosmos is called the Great Pillar. At its center sit the Material Plane and the Astral Plane — once held distinct, now understood as parts of one immediate existence.',
          'A little beyond that center, both above and below, lies the Ethereal Plane, itself balanced between the primordial and terminal forces flowing from the Pillar’s base and its apex. Souls detached from physical existence reside there, free to find any of a myriad of fates — some interacting still, in limited ways, with the Material, others drifting on to another plane entirely.',
        ],
      },
      {
        titulo: 'Ascending',
        paragrafos: [
          'Climbing the Pillar, a soul may first find itself in the Feywild, a plane of narrower influence, where it would be reborn as a Fey. Higher still, it may come to rest in the Elemental Plane of Fire or Air, taking on elemental energy to become an elemental or a genasi. At the very summit, a soul may reach the Upper Spheres — to dwell among [[os-doze|the Twelve]], or to suffer whatever punishment they set. This last path, judging by recorded communications with departed souls, appears the most accessible — Jahar theorizes it is by the gods’ own intercession.',
        ],
      },
      {
        titulo: 'Descending',
        paragrafos: [
          'Descending the Pillar, [[shadowfell|the Shadowfell]] seeks to swallow the souls that reach it, twisting them into its abominations. Further down still lies the Elemental Plane of Water or Earth, holding a fate matching its counterparts above. But unlike the Upper Spheres, no record exists of any communication with a soul that reached the base of the Pillar. "Yet they exist," the book insists — a sentence left undeveloped, with no footnote naming a source or study.',
        ],
      },
      {
        titulo: 'The Ritual of the Threshold',
        paragrafos: [
          'The book goes on to detail the ritual used to communicate with souls beyond the physical. The gestures, hand-signs, and chants belong to arcane magic in its reduced, practical, demystified form. The chants in particular draw notice for what they mix: Elvish vocalization with an older variant of two dialects of the Common Tongue — Valorian and Al-Harian.',
        ],
      },
    ],
    relacionados: ['shadowfell', 'os-doze', 'corvus'],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['the Great Pillar', 'O Grande Pilar'],
  },

  {
    chave: 'os-ritos-dos-doze',
    titulo: 'The Rites of the Twelve',
    epiteto: 'What Maedrin Rimors Would Not Write',
    categoria: 'poder',
    resumo: 'A later scholar names the Twelve one by one and records the rite each demands — everything the Annals confess they do not know.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Kind', valor: 'Treatise on divine ritual' },
      { rotulo: 'Author', valor: 'Athran Judd, retainer to Ayren Herrys IV' },
      { rotulo: 'Structure', valor: 'Twelve gods, twelve rites' },
      { rotulo: 'Standing next to the Annals', valor: 'Names what Maedrin Rimors left blank' },
    ],
    epigrafe: 'No portfolios, no rites, no temples — this account said, and meant it. Athran Judd did not stop there.',
    secoes: [
      {
        titulo: 'The Sun, the Moon, and the Dragon',
        paragrafos: [
          'The Luminífero — Aion’s sun, god of husbandry and retribution — is a stern but just lord, honored by the *Sacrifício ao Sol*: a body of value to the worshipper, left exposed at dawn on high ground for twelve days and prayed over at sunrise and sunset, its bones emerging bright as gold and worn afterward as a mark of the god’s protection.',
          'The Tecelã — Corvus, the moon, goddess of secrets and isolation — prizes knowledge above all, through the *Permuta de Segredos*: a devotee tells her a secret rarely or never shared, and receives another in return, related to what is sought, along with the certainty that their own secret will one day reach someone else’s ears.',
          'The Dragão, god of victory, honor, and the blind, stands as bridge between mortals and the rest of the pantheon; a *Juramento de Honra* sworn before him and under the light of the Twelve carries real weight, strengthening the acts that fulfill it and punishing, often by burns or constriction, any that would break it.',
        ],
      },
      {
        titulo: 'The Mother, the Flower, and the Lady',
        paragrafos: [
          'A Mãe, goddess of fertility, nature, and beasts, asks her devotees to raise a *Rebanho Sagrado* — sheep, cattle, or wolves marked on the brow with her three-clawed sigil in the worshipper’s own blood — and release the animals to the wild once grown; her fury falls on anyone who harms them afterward.',
          'A Flor, goddess of redemption, healing, and the innocent, offers the *Banho de Purificação* in temples ringed with sunflower gardens: the penitent bathes in a pool of sunflower oil, their body burning in proportion to their sin, and emerges cleansed of what weighed on them.',
          'A Dama, goddess of luck, change, and deception, is honored through the *Aposta Cega*: a coin is tossed, called, and covered before it is seen, then hidden away while the wagerer faces whatever challenge lies ahead — the result checked only after, and never shown to another soul, on pain of her fury. Aer Firen’s coinage bears her likeness for exactly this reason.',
        ],
      },
      {
        titulo: 'The Guardian, the Stranger, and the Valkyrie',
        paragrafos: [
          'O Guardião, god of protection, mountains, and vigilance, is honored through the *12 Noites de Vigília*: something ephemeral, usually a flame, is carried to an inhospitable place and watched over, sleepless, for twelve days and nights.',
          'O Estranho, god of sailors, thresholds, and the unknown, is known chiefly through *A Última Viagem* — most often a funerary rite, in which a traveler takes any vessel out to sea, physical or astral, with no guidance and no plan of return, and surrenders entirely to what comes. Every recorded rite of this kind ends the same way: the traveler is never seen again.',
          'A Valquíria, goddess of storms, strength, and war, holds to a single eternal dogma — that when every other approach fails, only force remains. Her *Torneios da Tempestade* gather worshippers monthly in circular, arena-shaped temples for combat until one alone still stands; the rites kept by the Church of the Twelve in Valoran bar death and mutilation, while cultures closer to the giants allow both, seeing death in her name as one of the surest paths to her afterlife.',
        ],
      },
      {
        titulo: 'The Forger, the Heart, and the Scale',
        paragrafos: [
          'O Forjador, god of craft, mastery, and grudges, holds that the finest fruit of an artisan’s labor can never stay with its maker: a self-judged masterpiece is walked, on foot, to the nearest *Casa das Artes* and left there — under the god’s blessing, and the artisan’s own creative block, until they produce something they judge undeniably greater.',
          'O Coração, god of emotion, seasons, and obsession, is honored through the *Ode às Temporadas*: a devotee sings the peak of one emotion, joy or grief, to a tree of feywild origin, letting the god drink from it — the emotion leaving the singer’s body to take shape in the tree, and the god returning, in trade, a stretch of extended life.',
          'A Balança, goddess of law, judgment, and conquest, is invoked, rarely, through the *Julgamento de Almas* — the last resort of Firenian criminal justice. A blindfolded priest of the Balança briefly hosts the goddess, who removes the accused’s heart without harm and weighs it against the charge; a guilty verdict ends in the accused’s death by the goddess’s own blade, a false accusation in the accuser’s.',
        ],
      },
      {
        titulo: 'What This Adds to the Silence',
        paragrafos: [
          '[[os-doze|The Annals]] name none of this: no names for the Twelve, no rites, no temples, and the chronicler confesses the gap rather than fill it. Athran Judd, writing generations later as a retainer to the reigning emperor, answers every question Maedrin Rimors declined to ask. This codex keeps both pages side by side — the confession, and the answer that came after it.',
        ],
      },
    ],
    relacionados: ['os-doze', 'igreja-dos-doze', 'ayren-herrys-iv'],
    eras: ['era-segunda-luz', 'era-moderna'],
    alcunhas: ['Os Doze e seus Ritos', 'the rites of the Twelve'],
  },
];
