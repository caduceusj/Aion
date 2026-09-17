/**
 * O céu de Aion — o sistema, o calendário e a Corvisseia.
 *
 * Este é o material do almanaque: o documento que os viajantes do vazio usam
 * e quase mais ninguém. Ele sabe exatamente a coisa que as Anais confessam
 * não saber — onde ficam Fentor e Yōso, e por que caminho se chega — porque
 * responde a uma pergunta diferente: não *o que aconteceu ali*, e sim *onde
 * aquilo está passando agora*.
 *
 * Os números todos vêm de `codex/calendario.ts`, que é onde a tabela mora. A
 * prosa segue em inglês como o resto do lado do mundo; os nomes próprios
 * ficam em português, como o usuário os escreveu — Corvisseia, Aquiário,
 * Ascensão, Luz de Corvus.
 */

import type { Verbete } from '../tipos';
import {
  CICLOS,
  CONSTELACOES,
  CORVISSEIA,
  DIAS_DA_CORVISSEIA,
  DIAS_DE_ESTADIA,
  DIAS_DE_VIAGEM,
  continente,
  perielioUA,
  afelioUA,
  velocidade,
} from '../calendario';

/** O trecho mais longo da tabela — é ele que vira o aviso aos pilotos. */
const MAIOR = CORVISSEIA.reduce((a, b) => (b.distanciaUA > a.distanciaUA ? b : a));
const VELOCIDADE_MAXIMA = Math.round(velocidade(MAIOR.distanciaUA));

/** Números em português mesmo dentro da prosa inglesa: 1,05 e não 1.05. */
const num = (valor: number, casas = 2): string =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/** Um morador de cada anel, para perguntar a ele o periélio do anel inteiro. */
const CONTINENTES_DO_CICLO = {
  curto: continente('al-hara'),
  medio: continente('valoran'),
  longo: continente('vrednost'),
} as const;

const faixa = (ciclo: keyof typeof CONTINENTES_DO_CICLO): string => {
  const alvo = CONTINENTES_DO_CICLO[ciclo];
  return `${num(perielioUA(alvo))}–${num(afelioUA(alvo))} UA`;
};

export const COSMOS: Verbete[] = [
  {
    chave: 'sistema-de-aion',
    titulo: 'The System of Aion',
    epiteto: 'A Star, Six Continents, and a Moon That Walks',
    categoria: 'ceu',
    resumo:
      'The star Aion, six continents in three orbits, and a moon that circles none of them but walks between them.',
    brasao: 'sol',
    ficha: [
      { rotulo: 'Star', valor: 'Aion' },
      { rotulo: 'Continents', valor: 'Six, across three orbits' },
      {
        rotulo: 'Short Cycle',
        valor: `[[alhara|Al-Hara]] — ${CICLOS.curto.periodo} days, a true circle at ${num(CICLOS.curto.raioUA)} UA`,
      },
      {
        rotulo: 'Middle Cycle',
        valor: `[[fentor|Fentor]], [[valoran|Valoran]], [[yoso|Yōso]] — ${CICLOS.medio.periodo} days, ${faixa('medio')}`,
      },
      {
        rotulo: 'Long Cycle',
        valor: `[[unkanten|Ukanten]] and [[vrednost|Vrednost]] — ${CICLOS.longo.periodo} days, ${faixa('longo')}`,
      },
      { rotulo: 'Sky', valor: '[[as-constelacoes|Twelve constellations]], thirty degrees each' },
      { rotulo: 'Moon', valor: '[[corvus|Corvus]], which belongs to no single continent' },
    ],
    epigrafe: 'Nothing here holds still, and the calendar is what the motion writes down.',
    secoes: [
      {
        titulo: 'Three Orbits',
        paragrafos: [
          'Six continents ride three orbits around the star. [[alhara|Al-Hara]] rides alone on the innermost, and its orbit is the only perfectly circular one in the system: 180 days, no perihelion, no aphelion, the same distance from the fire all year.',
          '[[fentor|Fentor]], [[valoran|Valoran]] and [[yoso|Yōso]] share the middle orbit at 360 days, arranged as a pyramid — evenly spaced, a third of the ring apart, each one always keeping the same two neighbours at the same remove. [[unkanten|Ukanten]] and [[vrednost|Vrednost]] share the outermost at 540 days, and they ride it at opposite poles: when one is in high summer light, the other is at the far side of the fire.',
        ],
      },
      {
        titulo: 'The Ellipses, Measured',
        paragrafos: [
          `Only [[alhara|Al-Hara]] keeps a fixed distance. The other five run ellipses, and an ellipse has a near side and a far one: the middle ring swings between ${faixa('medio')} of the star, the outer between ${faixa('longo')}. That is a fifth of the outer ring's own width — enough that the same crossing can be a short hop one year and a murderous sprint the next.`,
          `The three rings sit at ${num(CICLOS.curto.raioUA)}, ${num(CICLOS.medio.raioUA)} and ${num(CICLOS.longo.raioUA)} UA, and those are not three chosen numbers. Take the middle ring as one and the other two are what a falling body would have to be for those years: a period half as long buys an orbit at ${num(0.63)}, half again as long an orbit at ${num(1.31)}. The system was not arranged to be tidy. It was arranged to be *possible*, and it comes out to within one part in a hundred.`,
          'The two outermost keep the same near side of the sky, a hundred and thirty-four degrees off north, and ride half a ring apart — which means that whenever [[vrednost|Vrednost]] is at its closest to the fire, [[unkanten|Ukanten]] is at its furthest, exactly. They are never warm together.',
        ],
      },
      {
        titulo: 'Where the Two Sources Disagree',
        paragrafos: [
          'This codex holds two documents about the same sky, and they do not fully agree. The route table — the working almanac, the one the pilots carry — records the crossing from Valoran to Yōso as 1,82 UA on every one of its six passes, without exception. On a ring of perfect circles a third apart, that is exactly what you would see, and it is the strongest evidence that the middle three are evenly spaced.',
          'The orbital model gives the same ring an eccentricity of a tenth, and an eccentric ring cannot hold three bodies at a constant remove: the same crossing comes out between 1,59 and 1,67 UA, alternating. Both cannot be right. The table is kept as it stands, because it is the document that people actually navigate by and because its own internal arithmetic closes; the model is kept as it stands, because it is the one that explains why any distance varies at all. What neither of them explains is why the one crossing that should vary is the one that never does.',
        ],
      },
      {
        titulo: 'What the Sky Explains',
        paragrafos: [
          'The month is not an invention. [[corvus|Corvus]] rests over a continent for 19 days and a half and then takes 10 and a half to reach the next; the magic that drives her keeps burning in the sky she left for the whole crossing. Thirty days from one arrival to the next, on every continent at once, whatever its own year is doing — which is why six worlds on three incompatible orbits keep the same month.',
          'Six continents at thirty days each means Corvus comes back around in 180. Valoran takes 360 days to round the star, so it sees her twice a year — and that is where its twelve months, four seasons and [[calendario-valoriano|whole calendar]] come from.',
        ],
      },
      {
        titulo: 'What the Annals Could Not Say',
        paragrafos: [
          'This chronicle says of [[yoso|Yōso]] that it lies "beyond Valoran; the chronicle gives no bearing", and of [[fentor|Fentor]] only that it is across [[mar-astral|the Astral Sea]]. Both are true and neither is a location. The almanac answers the question the archive could not: they are not distant lands but neighbouring worlds, sharing one ring with Valoran, and the void between them is measured in tenths of a UA and crossed on a schedule.',
          'It is worth saying plainly what that does to the rest of this codex. [[naus-oraculo|The Oracle Ships]] that carried an invasion to Fentor in [[guerra-verdejante|the Verdant War]] did not sail to another country. They crossed between worlds, in a system where the distance to that world changes month by month — which makes the timing of that crossing, nowhere recorded, the most interesting missing page in the archive.',
        ],
      },
    ],
    relacionados: [
      'calendario-valoriano',
      'as-constelacoes',
      'a-corvisseia',
      'corvus',
      'valoran',
      'alhara',
      'fentor',
      'yoso',
      'unkanten',
      'vrednost',
      'mar-astral',
    ],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['Aion', 'o sistema de Aion', 'as três órbitas'],
  },

  {
    chave: 'calendario-valoriano',
    titulo: 'The Valorian Calendar',
    epiteto: 'Twelve Months Written by a Moon',
    categoria: 'ceu',
    resumo:
      'Twelve months of thirty days, a six-day week and four seasons — a calendar built entirely out of where Corvus is.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'Year', valor: '360 days — one turn of Valoran around Aion' },
      { rotulo: 'Month', valor: '30 days — one arrival of [[corvus|Corvus]] to the next' },
      { rotulo: 'Week', valor: 'Six days: Aionia, Aridia, Lucidia, Fluendia, Elendia, Frígia' },
      { rotulo: 'Seasons', valor: 'Four, of three months each' },
      { rotulo: 'Months named for', valor: '[[as-constelacoes|The twelve constellations]] Valoran crosses' },
      { rotulo: 'Day one', valor: 'Valoran at perihelion — the nearest it comes to Aion all year' },
      { rotulo: 'Moon over Valoran', valor: 'Twice a year: Equiral and Corvinário' },
    ],
    epigrafe: 'Ascensão, Domínio, Virada — the constellation rises, reigns, and gives way.',
    secoes: [
      {
        titulo: 'The Shape of a Month',
        paragrafos: [
          'Every month runs thirty days in five weeks of six, and the week is the moon\'s route in miniature — one day for each continent she visits. Each month also belongs to a constellation, and the sheet colours the days by what that constellation is doing: *Ascensão* for the first ten, while it climbs; *Domínio* for the ten it holds the sky; *Virada* for the last ten, as it yields to the next.',
          'Under the days runs a second band, and that one is the moon. On the twenty days [[corvus|Corvus]] stands over you it reads *Luz de Corvus*; on the ten after she leaves, *Ecos de Corvus*, because the magic of the jump goes on burning overhead after she is gone. Every other month of the year it reads *Noite Escura* — she is over somebody else.',
        ],
      },
      {
        titulo: 'The Twelve',
        paragrafos: [
          'Summer opens the year: *Aquiário* of the Eagle, *Lureor* of the Wolf, *Helior* of the Sunflower. Autumn follows with *Lereal* of the Hare, *Lithral* of the Lítope and *Equiral* of the Horse. Winter brings *Caessar* of the Whale, *Brassar* of the Tree and *Felissar* of the Cat; spring closes with *Rodênio* of the Rodent, *Dracônio* of the Serpent and *Corvinário* of the Crow.',
          'The two months that matter most to anyone standing on Valoran are *Equiral* and *Corvinário* — the sixth and the twelfth, the two the moon spends here. The year is built so that they fall exactly half a year apart, and the last month of the year is named for her.',
        ],
      },
      {
        titulo: 'Why It Is Valoran\'s Calendar and Nobody Else\'s',
        paragrafos: [
          'Valoran rounds the star in 360 days, which means it crosses exactly one degree of sky a day. [[as-constelacoes|The sky is cut into twelve]] of thirty degrees each. Thirty days, thirty degrees, one constellation: the Valorian month is not a convention laid over the sky, it is the arc Valoran travels while one figure of stars stands over it. Every month on this sheet is named for what Valoran itself was looking at.',
          'The anchoring goes further than the names. On the first day of *Aquiário*, the first day of the year, Valoran is at perihelion — the closest it comes to the fire in the whole circuit. Half a year later, on the first of *Caessar*, it is at its furthest. Its two neighbours on the ring reach their own nearest points on the first of *Lithral* and the first of *Felissar*, four months apart each time, because a third of a ring is a third of a year is four months exactly. The months do not merely count days. They mark where the world is.',
          'Nobody else on the ring gets this. [[alhara|Al-Hara]] runs through all twelve constellations twice in a Valorian year and would want months of fifteen days; [[unkanten|Ukanten]] and [[vrednost|Vrednost]] spend forty-five days under each and would want months half again as long. They all use this calendar anyway — because the thing it really counts is the moon, and the moon is the same for everyone.',
        ],
      },
      {
        titulo: 'Where the Sheet Contradicts Itself',
        paragrafos: [
          'The printed sheet carries two errors, and this codex keeps both rather than quietly fixing them. *Equiral* is labelled a summer month while being printed in the autumn block between two autumn months — the seasons only divide evenly if it is autumn. And *Dracônio* is drawn with the moon over [[alhara|Al-Hara]], which would put Corvus above the same continent twice in three months; [[a-corvisseia|the route table]] gives Ukanten for that month, and the route table is the one that has to add up.',
        ],
      },
      {
        titulo: 'Who Actually Uses It',
        paragrafos: [
          'On the ground, almost nobody needs the whole apparatus: a farmer wants the season and a priest wants the constellation. The full calendar — with the route, the distances and the speeds — is a sailing document. It belongs to the people who cross [[mar-astral|the void]], and it exists to tell them when and where a moon will be coming through at a few hundred kilometres a second.',
        ],
      },
    ],
    relacionados: ['sistema-de-aion', 'as-constelacoes', 'a-corvisseia', 'corvus', 'valoran', 'os-doze'],
    eras: ['era-moderna'],
    alcunhas: ['calendário valoriano', 'os doze meses', 'Aquiário', 'Corvinário'],
  },

  {
    chave: 'a-corvisseia',
    titulo: 'A Corvisseia',
    epiteto: 'The Long Journey',
    categoria: 'ceu',
    resumo:
      'Six circuits of Corvus — 1080 days — after which every distance she jumps begins repeating exactly.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Length', valor: `${DIAS_DA_CORVISSEIA} days — 36 months, three Valorian years` },
      { rotulo: 'Circuits', valor: 'Six turns of the moon around the six continents' },
      { rotulo: 'Route', valor: 'C4 → C1 → C5 → C2 → C6 → C3, and back to C4' },
      { rotulo: 'Fixed', valor: `${DIAS_DE_ESTADIA} days resting, ${DIAS_DE_VIAGEM} days crossing — always` },
      { rotulo: 'Longest crossing', valor: `${MAIOR.distanciaUA.toFixed(2)} UA, at about ${VELOCIDADE_MAXIMA} km/s` },
    ],
    epigrafe: 'She never takes longer. She simply goes faster.',
    secoes: [
      {
        titulo: 'A Pattern That Closes',
        paragrafos: [
          'The route never varies: [[yoso|Yōso]], [[alhara|Al-Hara]], [[vrednost|Vrednost]], [[fentor|Fentor]], [[unkanten|Ukanten]], [[valoran|Valoran]], and round again — a zigzag that crosses all three orbits twice each circuit. What varies is the distance, because the continents have moved on since the last pass.',
          'After six circuits every continent has returned to where it started relative to the others, and the distances begin again, jump for jump. That is 1080 days, and the almanac calls it A Corvisseia — the Long Journey. Three Valorian years fit inside it exactly.',
        ],
      },
      {
        titulo: 'No Jump, Normal, Intense',
        paragrafos: [
          'Crossings are graded by how far she has to go. Under half a UA she barely seems to move and the almanac writes *Sem pulo*; around a UA is a *Normal* jump; a UA and a half or more is *Intenso*. In a single Corvisseia the same stretch can be all three: the crossing from Vrednost to Fentor runs 0,49 UA in one circuit and 2,49 UA in another — five times the distance, in the same ten and a half days.',
          'The one crossing that never changes is Valoran to Yōso: 1,82 UA, about 300 km/s, every circuit without exception. Two continents on the same ring, a third of it apart, cannot drift.',
        ],
      },
      {
        titulo: 'The Argument for a Mind',
        paragrafos: [
          'This is the part of the almanac that stops being arithmetic. Corvus holds the same 19 days and a half of rest and the same 10 and a half of travel no matter how far the next continent happens to be — which means she is not falling, she is *pacing herself*: accelerating for the long stretch, slowing for the short one, arriving on the same schedule either way.',
          'A stone does not do that. This archivist has no theory to offer about what does, and notes only that everything else in this codex that behaves with intent has eventually turned out to have a name.',
        ],
      },
      {
        titulo: 'The Warning',
        paragrafos: [
          `For the pilots who cross [[mar-astral|the void]], the table is not lore — it is a survival document. On the heaviest stretch the moon covers ${MAIOR.distanciaUA.toFixed(2)} UA in ten days and a half, which is roughly ${VELOCIDADE_MAXIMA} kilometres every second. Nothing under way out there is going to see her coming, and nothing she meets is going to survive the meeting.`,
        ],
      },
    ],
    relacionados: ['corvus', 'sistema-de-aion', 'calendario-valoriano', 'mar-astral', 'naus-oraculo'],
    eras: ['era-moderna'],
    alcunhas: ['A Longa Jornada', 'Corvisseia'],
  },

  {
    chave: 'as-constelacoes',
    titulo: 'The Twelve Constellations',
    epiteto: 'The Wheel the Months Are Named For',
    categoria: 'ceu',
    resumo:
      'Twelve figures of stars, thirty degrees of sky apiece, fixed behind everything that moves — and the reason a month is a month.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Count', valor: 'Twelve, each holding thirty degrees of sky' },
      { rotulo: 'In order', valor: CONSTELACOES.slice(0, 6).map((c) => c.nome).join(', ') },
      { rotulo: 'And then', valor: CONSTELACOES.slice(6).map((c) => c.nome).join(', ') },
      { rotulo: 'Seen from Valoran', valor: 'One a month — thirty days, thirty degrees' },
      {
        rotulo: 'Seen from the short ring',
        valor: 'One every fifteen days — [[alhara|Al-Hara]] sees all twelve twice a year',
      },
      {
        rotulo: 'Seen from the long ring',
        valor: 'One every forty-five days — [[unkanten|Ukanten]] and [[vrednost|Vrednost]] take their time',
      },
    ],
    epigrafe: 'Everything in this sky moves except the things we tell time by.',
    secoes: [
      {
        titulo: 'A Wheel of Twelve',
        paragrafos: [
          'Beyond the outermost orbit, far enough that nothing in the system can be said to approach it, the sky of Aion is divided into twelve equal slices of thirty degrees, and each slice holds a figure of stars. *Águia* the Eagle stands due north and the wheel runs east from there: *Lobo* the Wolf, *Girassol* the Sunflower, *Lebre* the Hare, *Lítope*, *Cavalo* the Horse, *Baleia* the Whale, *Árvore* the Tree, *Felino* the Cat, *Roedor* the Rodent, *Serpente* the Serpent, and *Corvo* the Crow, which closes the round.',
          'They are the only fixed thing in the whole account. Six continents wheel, a moon jumps between them, and every distance in [[a-corvisseia|the table]] changes from one circuit to the next — but the twelve do not move, and that is precisely what makes them useful. To say where something is in this system, you say which constellation it is standing under.',
        ],
      },
      {
        titulo: 'Which Is Why the Months Have Those Names',
        paragrafos: [
          'Each continent faces whichever slice it happens to be crossing, and so each one reads a different figure on the same night. [[valoran|Valoran]] takes a full year of 360 days to go round, which is one degree a day, which is thirty days to a slice — and thirty days is a month. [[calendario-valoriano|Every Valorian month]] is named for the constellation Valoran was under while it lasted, in the order the sky puts them.',
          'The wheel closes on the Crow, and so does the year. The twelfth month is *Corvinário*, the twelfth constellation is *Corvo*, and *Corvinário* is one of the two months [[corvus|Corvus]] spends over Valoran. For thirty days at the end of every year, a Valorian looks up at the Crow in the stars with the Crow overhead — and the chronicle never once remarks on it.',
        ],
      },
      {
        titulo: 'Twelve and Twelve',
        paragrafos: [
          'The archive holds one other twelve. [[os-doze|The Twelve]] have been called upon for strength since before the Age of a Thousand Kings, and of them the record fixes exactly one thing — their number — while insisting that no page here knows their names. The almanac, which has never claimed to be a religious document, divides the sky into twelve and gives each part a name.',
          'This scholar will not close that circle. The correspondence is set down because it is there, and because a codex that noticed it and said nothing would be hiding something; what it means, if it means anything, belongs to [[igreja-dos-doze|the church]] and not to an archivist. It is worth saying only that the almanac is a sailing document, drawn up by people who needed to know where a moon would be, and that nothing in it suggests its makers thought they were naming gods.',
        ],
      },
      {
        titulo: 'What the Record Does Not Say',
        paragrafos: [
          'Who drew them, or when, or from where. A constellation is a line drawn between stars by somebody standing somewhere, and the six continents do not stand in the same place — yet all six use this same wheel, with these same figures, in this same order. Somebody\'s sky won, and no page in this archive says whose.',
          'Nor what a *Lítope* is. Eleven of the twelve name a creature or a thing that appears elsewhere in this codex; the fifth names nothing the archive has ever heard of, and the figure drawn for it — a stalk, two arms, two crowns — resolves the question no further.',
        ],
      },
    ],
    relacionados: ['calendario-valoriano', 'sistema-de-aion', 'valoran', 'corvus', 'os-doze', 'alhara'],
    eras: ['era-moderna'],
    alcunhas: ['as doze constelações', 'a roda do céu', 'Corvo', 'Lítope'],
  },

  // =====================================================================
  // OS CONTINENTES QUE FALTAVAM
  // =====================================================================

  {
    chave: 'valoran',
    titulo: 'Valoran',
    epiteto: 'The Ground Under This Codex',
    categoria: 'lugar',
    resumo:
      'The continent the Annals are written from: third of the middle orbit, and one of the two the moon visits twice a year.',
    brasao: 'herrys',
    ficha: [
      { rotulo: 'Orbit', valor: `[[sistema-de-aion|Middle Cycle]] — ${CICLOS.medio.periodo} days, ${faixa('medio')}` },
      { rotulo: 'Nearest the fire', valor: 'The first of *Aquiário* — the first day of its own year' },
      { rotulo: 'Neighbours on the ring', valor: '[[fentor|Fentor]] and [[yoso|Yōso]], a third of the ring away each' },
      { rotulo: 'Year', valor: '360 days — twelve months, four seasons' },
      { rotulo: 'Moon', valor: 'Twice a year, in Equiral and Corvinário' },
      { rotulo: 'Held by', valor: '[[imperio-aer-firen|The Empire of Aer Firen]], and eight noble houses' },
    ],
    epigrafe: 'Every other page of this archive happens here.',
    secoes: [
      {
        titulo: 'A World, Not a Country',
        paragrafos: [
          'Nearly everything this codex records — the five ages, the eight houses, [[imperio-aer-firen|the empire]], [[andari|Andari]], [[luctos|Luctos]], the wars and the relics — happens on Valoran. The chronicle never needed to say so, the way a man writing at his own table rarely writes down which table. [[sistema-de-aion|The almanac]] does say so, and adds the part the chronicle never had: Valoran is one of six, third body of the middle orbit, and it takes 360 days to round the star.',
        ],
      },
      {
        titulo: 'Why the Year Looks Like This',
        paragrafos: [
          'A 360-day orbit is why the Valorian year has four seasons of three months. It is also why this is one of only two continents that see [[corvus|Corvus]] twice in a year: she completes her circuit of all six in 180 days, exactly half of Valoran\'s year. The other continents on slower or faster rings watch her arrive on a rhythm that does not line up with their own seasons at all.',
          'Whether the calendar is Valoran\'s because the continent is central to the world, or merely because the people who wrote it down live here, is not a question the almanac asks. [[andari|Andari]], which is older than the empire and keeps its own reckoning, might answer it differently.',
        ],
      },
      {
        titulo: 'The Edge',
        paragrafos: [
          'What the Annals call the edge of the world — [[mar-astral|the Astral Sea]], crossed by [[naus-oraculo|the Oracle Ships]], fed forever by [[cascata-eterna|the Eternal Waterfall]] — is in the almanac\'s reading simply the space between Valoran and its neighbours. The same void that a chronicler describes as an ending, a pilot describes as a distance with a number on it.',
        ],
      },
    ],
    relacionados: [
      'sistema-de-aion',
      'calendario-valoriano',
      'imperio-aer-firen',
      'mar-astral',
      'andari',
      'corvus',
      'fentor',
      'yoso',
    ],
    eras: ['era-mil-reis', 'era-primeira-luz', 'era-sombria', 'era-segunda-luz', 'era-moderna'],
    alcunhas: ['o continente', 'C3'],
  },

  {
    chave: 'alhara',
    titulo: 'Al-Hara',
    epiteto: 'The Inner Continent',
    categoria: 'lugar',
    resumo:
      'The innermost continent, alone on the only circular orbit — and the land where the Luminífero is hated.',
    brasao: 'sol',
    ficha: [
      { rotulo: 'Orbit', valor: `[[sistema-de-aion|Short Cycle]] — ${CICLOS.curto.periodo} days, a true circle at ${num(CICLOS.curto.raioUA)} UA` },
      { rotulo: 'Distance from Aion', valor: 'The same every day of the year — it has no near side' },
      { rotulo: 'Alone', valor: 'The only continent on its ring' },
      { rotulo: 'Faith', valor: 'Hates [[os-doze|the Luminífero]]; keeps [[o-sofredor|the Sufferer]]' },
      { rotulo: 'Moon', valor: 'Twice a year — Lureor and Brassar' },
    ],
    secoes: [
      {
        titulo: 'Closest to the Fire',
        paragrafos: [
          'Al-Hara rides nearest the star and rides alone, on the one orbit in the system that is a true circle: no perihelion, no aphelion, the same 0,66 UA from Aion every day of its 180-day year. Of the six continents it is the only one whose distance from the fire never changes at all.',
        ],
      },
      {
        titulo: 'A People Who Turned Their Backs on the Sun',
        paragrafos: [
          'The people of Al-Hara hate the Luminífero — god of the sun and head of [[os-doze|the Twelve]] by the official faith of [[imperio-aer-firen|Aer Firen]] — which is a striking thing for the continent that stands closest to it. It is here, alongside [[luctos|Luctos]], that the cult of [[o-sofredor|the Sufferer]] has its roots: a minor god the crown does not recognise, whose creed holds that chosen pain clarifies the pain one does not choose.',
          'It is also where [[sarmon|Sarmon]] and [[lince|Lince]] were enslaved as children, and where they killed the mage who held them. The campaign\'s road out of Al-Hara ends up in Valoran; the notes of the table never describe the continent itself, only what people carried away from it.',
        ],
      },
    ],
    relacionados: ['sistema-de-aion', 'o-sofredor', 'luctos', 'os-doze', 'sarmon', 'lince', 'corvus'],
    eras: ['era-moderna'],
    alcunhas: ['Alhara', 'Al Hara', 'C1'],
  },
];
