/**
 * O elenco da mesa — importado da wiki do Notion.
 *
 * Fonte: "AION - RPG: The Complete Wiki", do próprio usuário. Isto NÃO é o
 * mundo das Anais: é a campanha acontecendo agora, com gente de verdade
 * jogando. Por isso a prosa daqui é em português, e não no inglês do
 * cronista — o Códice tem duas metades, e esta é a metade da mesa.
 *
 * Três coisas que a importação preservou de propósito:
 *
 * 1. O sistema é D&D 5e (Artificer, CA, CD, proficiência +4), e não
 *    Daggerheart. As fichas ficam como estão; nada foi convertido.
 * 2. Onde a wiki tem "x" no lugar do número, o verbete diz que está em
 *    branco em vez de inventar um valor.
 * 3. Os atributos CON 2 / DEX 1 / WIS 4 / INT 0 / STR 0 / CHA 0 aparecem
 *    IDÊNTICOS em Ferdinand, Alvyriel e Mateo — são o padrão do modelo
 *    "Base - Characters", não valores rolados. Ficam registrados como tal.
 *
 * A wiki existe em duas cópias divergentes no Notion; esta importação é a
 * união das duas, e cada verbete diz em qual delas apareceu quando isso
 * distingue alguém.
 */

import type { Verbete } from '../tipos';

/** Nota que abre todo verbete cuja ficha a wiki ainda não preencheu. */
const EM_BRANCO =
  'A wiki tem a página, mas a ficha ainda está no modelo — sem atributos, sem ' +
  'história, sem destaques. Este verbete registra o que existe hoje e fica ' +
  'esperando o resto.';

/** Ficha curta para quem só tem nome e facção na wiki. */
const fichaDeNpc = (facção: string, fonte = 'Ambas as cópias da wiki'): Verbete['ficha'] => [
  { rotulo: 'Papel', valor: facção },
  { rotulo: 'Sistema', valor: 'D&D 5e' },
  { rotulo: 'Ficha', valor: 'Em branco na wiki' },
  { rotulo: 'Fonte', valor: fonte },
];

// =====================================================================
// JOGADORES ATUAIS
// =====================================================================

const JOGADORES: Verbete[] = [
  {
    chave: 'alvyriel',
    titulo: 'Alvyriel',
    epiteto: 'A que quer ser a única deusa',
    categoria: 'jogador',
    resumo:
      'Eladrin druida-clériga criada por doze monges num templo secreto, decidida a substituir os deuses ausentes.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Nível', valor: '10' },
      { rotulo: 'Raça', valor: 'Eladrin' },
      { rotulo: 'Classe', valor: 'Druida / Clérigo — Stars Druid / Life Cleric' },
      { rotulo: 'PV · CA', valor: '78 · 16' },
      { rotulo: 'CD · Proficiência', valor: '18 · +4' },
      { rotulo: 'Tema', valor: 'Whispers in the Dark — Skillet' },
    ],
    epigrafe: 'Os deuses se mostram alheios aos seus seguidores. Ela discorda disso com a vida inteira.',
    secoes: [
      {
        titulo: 'O templo e os doze',
        paragrafos: [
          'Alvyriel foi criada em um templo secreto, sob a tutela de doze monges — [[monges-de-virion|os Monges de Virion]]. Entre os ensinamentos deles estavam a arte da linguagem, a cura celestial, a história, a natureza, o equilíbrio cósmico e a sabedoria estelar.',
          'A vida dela foi premeditada e guiada durante mais de duzentos anos, período em que raramente saiu do templo ou interagiu com outras pessoas. É a única do elenco cuja história a wiki conta por inteiro.',
        ],
      },
      {
        titulo: 'A ambição',
        paragrafos: [
          'O objetivo de tornar-se a única deusa não vem só da arrogância dos Eladrins do verão. Vem também do senso de justiça dela e da inconformidade com o sistema divino atual, no qual os deuses se mostram alheios aos seus seguidores.',
          'Vale ler isso ao lado do que as Anais dizem de [[os-doze|os Doze]]: um panteão que velava sobre tudo e a quem os homens pediam força. Alvyriel quer o cargo.',
        ],
      },
      {
        titulo: 'Na mesa',
        paragrafos: [
          'Oficiou o primeiro casamento do RPG, o de [[ferdinand]] e [[beatrix]] — e é a única jogadora que deixou comentário na página de todos os outros.',
          'Tem uma abelha de estimação chamada Bee-a.',
        ],
      },
    ],
    relacionados: ['a-mesa-de-aion', 'monges-de-virion', 'ferdinand', 'beatrix', 'os-doze', 'mateo', 'klen'],
    eras: ['era-moderna'],
    alcunhas: ['Alv'],
  },

  {
    chave: 'ferdinand',
    titulo: 'Ferdinand',
    epiteto: 'Ferdinand Franz von Oumalis',
    categoria: 'jogador',
    resumo:
      'Meio-elfo artífice armorer, e metade do primeiro casamento que a campanha registrou.',
    brasao: 'martelo',
    ficha: [
      { rotulo: 'Nível', valor: '10' },
      { rotulo: 'Raça', valor: 'Meio-elfo' },
      { rotulo: 'Classe', valor: 'Artificer / Armorer' },
      { rotulo: 'PV · CA', valor: '73 · 16' },
      { rotulo: 'CD · Proficiência', valor: '18 · +4' },
      { rotulo: 'Tema', valor: 'Stricken — Disturbed; Lost — Linkin Park' },
    ],
    epigrafe: 'Você pode ser um herói, ou você pode ser aquele que salvará seu povo.',
    secoes: [
      {
        titulo: 'A armadura',
        paragrafos: [
          'Artífice da subclasse Armorer: a ficha inteira dele é uma armadura que ele mesmo constrói e melhora. É o único do grupo cujo poder é fabricado em vez de concedido, herdado ou jurado.',
        ],
      },
      {
        titulo: 'Von Oumalis',
        paragrafos: [
          'Ferdinand e [[beatrix|Beatrix von Oumalis]] carregam o mesmo nome de família, e a wiki registra o porquê no lugar mais seco possível — na linha de conquistas: *primeiro casamento do RPG*. [[alvyriel]] oficiou, e deixou o recado na página dele: “Honrada em oficializar seu casamento, me chame mais vezes.”',
        ],
      },
      {
        titulo: 'O que a wiki não diz',
        paragrafos: [
          'A backstory dele está em branco. A página tem arte, tema musical, ficha completa e um casamento — e nenhuma linha sobre de onde ele veio.',
        ],
      },
    ],
    relacionados: ['a-mesa-de-aion', 'beatrix', 'alvyriel', 'klen', 'mateo'],
    eras: ['era-moderna'],
    alcunhas: ['von Oumalis', 'Franz'],
  },

  {
    chave: 'beatrix',
    titulo: 'Beatrix',
    epiteto: 'Beatrix von Oumalis',
    categoria: 'jogador',
    resumo:
      'Meia-elfa maga da Escola de Syrromancia — uma escola de magia que só existe nesta campanha.',
    brasao: 'vazio',
    ficha: [
      { rotulo: 'Nível', valor: '10' },
      { rotulo: 'Raça', valor: 'Meia-elfa' },
      { rotulo: 'Classe', valor: 'Wizard / School of Syrromancy' },
      { rotulo: 'PV · CA', valor: 'Em branco na wiki' },
      { rotulo: 'Conquista', valor: 'Rats — morrer para ratos' },
      { rotulo: 'Tema', valor: 'Nenhum ainda' },
    ],
    secoes: [
      {
        titulo: 'Syrromancia',
        paragrafos: [
          'A escola de magia dela não é do livro: *School of Syrromancy* não aparece em nenhum manual publicado. É criação da mesa, e a wiki não explica o que a syrromancia faz.',
        ],
      },
      {
        titulo: 'Von Oumalis',
        paragrafos: [
          'Divide o sobrenome com [[ferdinand]], pelo casamento que [[alvyriel]] oficiou — o primeiro da campanha.',
        ],
      },
      {
        titulo: 'O que a wiki não diz',
        paragrafos: [
          'Ficha em branco: PV, CA, deslocamento, CD, proficiência e todos os seis atributos ainda estão com o “x” do modelo. A única linha preenchida na página inteira é a conquista, e ela é uma piada: *morrer para ratos*.',
        ],
      },
    ],
    relacionados: ['a-mesa-de-aion', 'ferdinand', 'alvyriel', 'mateo', 'klen'],
    eras: ['era-moderna'],
    alcunhas: ['von Oumalis'],
  },

  {
    chave: 'mateo',
    titulo: 'Mateo',
    epiteto: 'Juramento da Rebelião',
    categoria: 'jogador',
    resumo:
      'Elfo da floresta, guerreiro psiônico e paladino do Juramento da Rebelião — o oposto exato de um paladino obediente.',
    brasao: 'lamina',
    ficha: [
      { rotulo: 'Nível', valor: '10' },
      { rotulo: 'Raça', valor: 'Elfo da floresta' },
      { rotulo: 'Classe', valor: 'Fighter / Paladin — Psi Warrior / Oath of Rebellion' },
      { rotulo: 'PV · CA', valor: '73 · 16' },
      { rotulo: 'CD · Proficiência', valor: '18 · +4' },
      { rotulo: 'Tema', valor: 'REMEMBER — Jujutsu Kaisen' },
    ],
    epigrafe: 'Vida e morte, dois lados da mesma moeda.',
    secoes: [
      {
        titulo: 'Guerreiro e juramentado',
        paragrafos: [
          'Combina Psi Warrior com o Juramento da Rebelião — força da mente e um juramento que existe para desobedecer. Num continente governado por [[ayren-herrys-iv|um tirano]], é uma escolha de ficha que já é uma declaração.',
          '[[klen]] leva exatamente a mesma combinação de classes, o que faz dos dois um par de espelhos na party.',
        ],
      },
      {
        titulo: 'Epístola',
        paragrafos: [
          'A página dele tem uma página irmã chamada [[epistola|Epístola]], ligada logo abaixo do nome na wiki nova. O que ela é — carta, entidade, segunda ficha — não está escrito.',
        ],
      },
      {
        titulo: 'O que a wiki não diz',
        paragrafos: [
          'Backstory em branco. O único registro pessoal é um pedido de desculpas de [[alvyriel]]: “Desculpa por te empurrar pro [[imykus|Imykus]].”',
        ],
      },
    ],
    relacionados: ['a-mesa-de-aion', 'epistola', 'klen', 'alvyriel', 'imykus', 'ayren-herrys-iv'],
    eras: ['era-moderna'],
  },

  {
    chave: 'klen',
    titulo: 'Klen',
    epiteto: 'Klen-Dah-Gon',
    categoria: 'jogador',
    resumo:
      'Genasi do ar, guerreiro psiônico e paladino da Rebelião — e, pelos comentários, o saqueador de templos do grupo.',
    brasao: 'asa',
    ficha: [
      { rotulo: 'Nível', valor: '10' },
      { rotulo: 'Raça', valor: 'Genasi do ar' },
      { rotulo: 'Classe', valor: 'Fighter / Paladino — Psi Warrior / Rebellion' },
      { rotulo: 'PV · CA', valor: 'Em branco na wiki' },
      { rotulo: 'Tema', valor: 'This Fffire — Franz Ferdinand' },
      { rotulo: 'Nome completo', valor: 'Klen-Dah-Gon' },
    ],
    secoes: [
      {
        titulo: 'O par de Mateo',
        paragrafos: [
          'Mesma combinação de [[mateo]] — Psi Warrior com o juramento da Rebelião —, em um corpo de genasi do ar em vez de elfo da floresta.',
        ],
      },
      {
        titulo: 'Na mesa',
        paragrafos: [
          'O único recado que a wiki guarda sobre ele é de [[alvyriel]], e é uma repreensão: “Pare de lootear templos.” Vindo de alguém criada dentro de um, faz sentido.',
        ],
      },
      {
        titulo: 'O que a wiki não diz',
        paragrafos: [EM_BRANCO],
      },
    ],
    relacionados: ['a-mesa-de-aion', 'mateo', 'alvyriel', 'monges-de-virion'],
    eras: ['era-moderna'],
    alcunhas: ['Klen-Dah-Gon', 'Dah-Gon'],
  },

  {
    chave: 'eliezer',
    titulo: 'Eliezer',
    categoria: 'jogador',
    resumo: 'Jogador listado na cópia antiga da wiki, ao lado de Beatrix, e ausente da cópia nova.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Papel', valor: 'Jogador' },
      { rotulo: 'Sistema', valor: 'D&D 5e' },
      { rotulo: 'Ficha', valor: 'Em branco na wiki' },
      { rotulo: 'Fonte', valor: 'Só na cópia antiga' },
    ],
    secoes: [
      {
        titulo: 'Entre duas cópias',
        paragrafos: [
          'A wiki existe duas vezes no Notion, e as duas divergiram. Eliezer aparece na cópia antiga, na mesma coluna de [[beatrix]], e não aparece na nova.',
          'Isso pode significar entrada recente, saída recente, ou só uma cópia que ficou para trás. O Códice registra os dois estados em vez de escolher um.',
        ],
      },
    ],
    relacionados: ['beatrix', 'alvyriel'],
    eras: ['era-moderna'],
  },

  {
    chave: 'epistola',
    titulo: 'Epístola',
    categoria: 'jogador',
    resumo: 'Página irmã de Mateo na wiki nova, ligada ao nome dele e sem nada escrito.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Papel', valor: 'Ligada a Mateo' },
      { rotulo: 'Ficha', valor: 'Em branco na wiki' },
      { rotulo: 'Fonte', valor: 'Só na cópia nova' },
    ],
    secoes: [
      {
        titulo: 'O que se sabe',
        paragrafos: [
          'Na cópia nova da wiki, logo abaixo de [[mateo]], há uma segunda página chamada Epístola. Nenhuma outra menção a ela existe em lugar nenhum do material.',
          'Uma carta, uma entidade, uma segunda ficha, um pacto — o Códice não vai adivinhar.',
        ],
      },
    ],
    relacionados: ['mateo'],
    eras: ['era-moderna'],
  },
];

// =====================================================================
// EX-JOGADORES
// =====================================================================

const antigo = (chave: string, titulo: string, brasao: Verbete['brasao']): Verbete => ({
  chave,
  titulo,
  epiteto: 'Ex-jogador',
  categoria: 'jogador',
  resumo: `${titulo} esteve na party e saiu; a wiki guarda o nome na lista de ex-jogadores.`,
  ...(brasao ? { brasao } : {}),
  ficha: [
    { rotulo: 'Papel', valor: 'Ex-jogador' },
    { rotulo: 'Sistema', valor: 'D&D 5e' },
    { rotulo: 'Ficha', valor: 'Em branco na wiki' },
    { rotulo: 'Fonte', valor: 'Ambas as cópias da wiki' },
  ],
  secoes: [
    {
      titulo: 'Quem passou por aqui',
      paragrafos: [
        `A wiki mantém uma lista de *Former Players*, e ${titulo} está nela — junto de [[ayraas]], [[daigo]], [[lews]] e [[nims]].`,
        'Manter os que saíram é uma decisão de arquivo que este códice respeita: a party de hoje não é a única que existiu.',
      ],
    },
    { titulo: 'O que a wiki não diz', paragrafos: [EM_BRANCO] },
  ],
  relacionados: ['alvyriel', 'ayraas', 'daigo', 'lews', 'nims'].filter((c) => c !== chave).slice(0, 4),
  eras: ['era-moderna'],
});

const EX_JOGADORES: Verbete[] = [
  antigo('ayraas', 'Ayraas', 'estrela'),
  antigo('daigo', 'Daigo', 'lamina'),
  antigo('lews', 'Lews', 'vazio'),
  antigo('nims', 'Nims', 'folha'),
];

// =====================================================================
// NPCs
// =====================================================================

interface Ficha {
  chave: string;
  titulo: string;
  brasao: Verbete['brasao'];
  /** Uma linha de contexto, quando a wiki dá alguma. */
  nota?: string;
  relacionados?: string[];
  fonte?: string;
  alcunhas?: string[];
  epiteto?: string;
}

/**
 * O resumo aparece cru no índice: sem marcação e de uma frase só.
 *
 * A nota de cada NPC serve às duas coisas — vira o parágrafo de abertura do
 * verbete inteira, e vira o resumo cortada na primeira frase.
 */
const semElos = (texto: string): string =>
  texto.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[([^\]]+)\]\]/g, '$1');

function primeiraFrase(texto: string): string {
  const limpo = semElos(texto).replace(/\*/g, '');
  const fim = limpo.search(/\.\s/);
  return fim < 0 ? limpo : limpo.slice(0, fim + 1);
}

const npc = (facção: string, padrão: Verbete['brasao']) => (f: Ficha): Verbete => ({
  chave: f.chave,
  titulo: f.titulo,
  ...(f.epiteto ? { epiteto: f.epiteto } : {}),
  categoria: 'npc',
  resumo: f.nota
    ? primeiraFrase(f.nota)
    : `${f.titulo} — ${facção.toLowerCase()} da campanha, sem ficha preenchida na wiki.`,
  ...(f.brasao ?? padrão ? { brasao: f.brasao ?? padrão } : {}),
  ficha: fichaDeNpc(facção, f.fonte),
  secoes: [
    {
      titulo: 'Na campanha',
      paragrafos: [
        f.nota
          ? f.nota
          : `A wiki lista ${f.titulo} entre os NPCs na categoria *${facção}*, e é só o que se sabe por escrito.`,
        'Este verbete existe para o nome ter endereço: quando a mesa preencher a página, o texto entra aqui.',
      ],
    },
    { titulo: 'O que a wiki não diz', paragrafos: [EM_BRANCO] },
  ],
  relacionados: f.relacionados ?? ['alvyriel', 'mateo'],
  eras: ['era-moderna'],
  ...(f.alcunhas ? { alcunhas: f.alcunhas } : {}),
});

const aliado = npc('Aliado', 'estrela');
const neutro = npc('Neutro', 'coroa');
const inimigo = npc('Inimigo', 'serpente');

const ALIADOS: Verbete[] = [
  aliado({
    chave: 'sarmon',
    titulo: 'Sarmon',
    brasao: 'coroa',
    epiteto: 'O irmão preterido',
    nota:
      'Irmão mais velho ignorado na sucessão para Lorde de Ouro: o título foi para o mais novo, e a ele coube um troféu de consolação.',
    relacionados: ['lince', 'cats-paw', 'andari'],
  }),
  aliado({
    chave: 'lince',
    titulo: 'Lince',
    brasao: 'mao',
    nota:
      'Um dos NPCs em destaque na wiki, e um dos dois nomes da Pata do Gato ao lado de [[sarmon]].',
    relacionados: ['cats-paw', 'sarmon'],
  }),
  aliado({ chave: 'lena', titulo: 'Lena', brasao: 'estrela', relacionados: ['morda', 'lince'] }),
  aliado({ chave: 'morda', titulo: 'Morda', brasao: 'martelo', relacionados: ['lena', 'lince'] }),
  aliado({ chave: 'cadeira', titulo: 'Cadeira', brasao: 'templo' }),
  aliado({ chave: 'carian', titulo: 'Carian', brasao: 'folha' }),
  aliado({ chave: 'iblis', titulo: 'Iblis', brasao: 'eclipse' }),
  aliado({ chave: 'ikki', titulo: 'Ikki', brasao: 'lamina' }),
  aliado({
    chave: 'imykus',
    titulo: 'Imykus',
    brasao: 'templo',
    nota:
      'Um dos doze [[monges-de-virion|Monges de Virion]] que criaram [[alvyriel]] — e o nome que aparece no pedido de desculpas dela a [[mateo]]: “Desculpa por te empurrar pro Imykus.”',
    relacionados: ['monges-de-virion', 'alvyriel', 'mateo'],
    alcunhas: ['Imykos'],
  }),
  aliado({ chave: 'mia', titulo: 'Mia', brasao: 'folha' }),
  aliado({ chave: 'symon', titulo: 'Symon', brasao: 'martelo' }),
  aliado({
    chave: 'fake-ferdinand',
    titulo: 'Fake Ferdinand',
    brasao: 'martelo',
    nota:
      'Um segundo [[ferdinand]] — a wiki antiga o lista entre os aliados e não explica o resto.',
    relacionados: ['ferdinand'],
    fonte: 'Só na cópia antiga',
  }),
  aliado({ chave: 'nornan', titulo: 'Nornan', brasao: 'estrela', fonte: 'Só na cópia antiga' }),
];

/** Os doze do templo. Todos saem da backstory de Alvyriel. */
const monge = (chave: string, titulo: string): Verbete =>
  aliado({
    chave,
    titulo,
    brasao: 'templo',
    epiteto: 'Monge de Virion',
    nota: `Um dos doze [[monges-de-virion|Monges de Virion]] que criaram [[alvyriel]] dentro do templo secreto.`,
    relacionados: ['monges-de-virion', 'alvyriel'],
    fonte: 'Só na cópia antiga',
  });

const MONGES: Verbete[] = [
  monge('althaea', 'Althaea'),
  monge('anfaera', 'Anfaera'),
  monge('eilwena', 'Eilwena'),
  monge('elrodan', 'Elrodan'),
  monge('erellis', 'Erellis'),
  monge('imuvir', 'Imuvir'),
  monge('irarisak', 'Irarisak'),
  monge('oladan', 'Oladan'),
  monge('olviryn', 'Olviryn'),
  monge('oridiel', 'Oridiel'),
  monge('ullyn', 'Ullyn'),
];

const NEUTROS: Verbete[] = [
  neutro({
    chave: 'lady-cyraxes-draco',
    titulo: 'Lady Cyraxes Draco',
    brasao: 'draco',
    nota:
      'Da [[casa-draco|Casa Draco]], o sangue de dragão que guarda [[endor]] contra a [[horda-da-mao-vermelha|Horda da Mão Vermelha]]. É a casa de [[rhogar]].',
    relacionados: ['casa-draco', 'endor', 'rhogar'],
  }),
  neutro({
    chave: 'lorde-thoren-bellias',
    titulo: 'Lorde Thoren Bellias',
    brasao: 'bellias',
    nota:
      'Da [[casa-bellias|Casa Bellias]], fundada pelo guerreiro de sangue de gigante que matou o horror primordial na [[guerra-verdejante|Guerra Verdejante]]. Governam [[aranti]].',
    relacionados: ['casa-bellias', 'aranti', 'primeiro-bellias'],
  }),
  neutro({
    chave: 'lady-elias-rimors',
    titulo: 'Lady Elias Rimors',
    brasao: 'templo',
    nota:
      'Rimors é o sobrenome de Maedrin Rimors, o erudito dos Arquivos Imperiais que escreveu as próprias Anais que este Códice guarda. A wiki não diz se há parentesco — mas o nome é o mesmo.',
    relacionados: ['era-moderna', 'igreja-dos-doze'],
  }),
  neutro({ chave: 'hadrik', titulo: 'Hadrik', brasao: 'martelo' }),
  neutro({ chave: 'lysandra', titulo: 'Lysandra', brasao: 'estrela' }),
  neutro({ chave: 'katherine', titulo: 'Katherine', brasao: 'folha', fonte: 'Só na cópia antiga' }),
];

const INIMIGOS: Verbete[] = [
  inimigo({
    chave: 'ilvissar',
    titulo: 'Ilvissar',
    brasao: 'eclipse',
    nota:
      'O único nome que a wiki lista ao mesmo tempo entre os NPCs em destaque e entre os inimigos — o antagonista corrente da campanha, portanto.',
    relacionados: ['carmilla', 'raven-mother'],
  }),
  inimigo({ chave: 'a-balanca', titulo: 'A Balança', brasao: 'estrela', epiteto: 'Inimigo' }),
  inimigo({ chave: 'carmilla', titulo: 'Carmilla', brasao: 'serpente' }),
  inimigo({ chave: 'pet-demonio', titulo: 'Pet Demônio', brasao: 'mao' }),
  inimigo({ chave: 'raven-mother', titulo: 'Raven Mother', brasao: 'eclipse', relacionados: ['corvus', 'ilvissar'] }),
  inimigo({
    chave: 'reincraft',
    titulo: 'Reincraft',
    brasao: 'lanca',
    nota: 'Grafado *Reincraft* na cópia nova da wiki e *Reynkraft* na antiga.',
    alcunhas: ['Reynkraft'],
  }),
];

// =====================================================================
// GRUPOS E ARCOS
// =====================================================================

const GRUPOS: Verbete[] = [
  {
    chave: 'monges-de-virion',
    titulo: 'Os Monges de Virion',
    epiteto: 'Os doze do templo',
    categoria: 'poder',
    resumo:
      'Os doze monges que criaram Alvyriel num templo secreto e planejaram duzentos anos da vida dela.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Tipo', valor: 'Ordem monástica' },
      { rotulo: 'Onde', valor: 'Um templo secreto' },
      { rotulo: 'Membros', valor: 'Doze' },
      { rotulo: 'Conhecidos por', valor: 'A criação de Alvyriel' },
    ],
    secoes: [
      {
        titulo: 'Os doze',
        paragrafos: [
          '[[irarisak]], [[imuvir]], [[eilwena]], [[erellis]], [[althaea]], [[oladan]], [[elrodan]], [[ullyn]], [[oridiel]], [[imykus]], [[anfaera]] e [[olviryn]] — a wiki os lista como grupo e a backstory de [[alvyriel]] os nomeia um a um.',
          'Ensinaram a ela a arte da linguagem, a cura celestial, a história, a natureza, o equilíbrio cósmico e a sabedoria estelar. Também mantiveram uma Eladrin dentro de um templo por mais de duzentos anos, com a vida *premeditada e guiada*. As duas coisas estão no mesmo parágrafo da wiki.',
        ],
      },
      {
        titulo: 'O que a wiki não diz',
        paragrafos: [
          'Quem é Virion. Onde fica o templo. Por que a vida dela foi planejada, e por quem acima deles. E se os doze sabiam que estavam criando alguém que pretende substituir os deuses.',
        ],
      },
    ],
    relacionados: ['alvyriel', 'imykus', 'os-doze', 'irarisak'],
    eras: ['era-moderna'],
  },
  {
    chave: 'cats-paw',
    titulo: "Cat's Paw",
    epiteto: 'A Pata do Gato',
    categoria: 'poder',
    resumo: 'Grupo da campanha com dois nomes conhecidos: Lince e Sarmon.',
    brasao: 'mao',
    ficha: [
      { rotulo: 'Tipo', valor: 'Grupo' },
      { rotulo: 'Membros', valor: 'Lince, Sarmon' },
      { rotulo: 'Fonte', valor: 'Só na cópia nova' },
      { rotulo: 'Ficha', valor: 'Em branco na wiki' },
    ],
    secoes: [
      {
        titulo: 'Os dois nomes',
        paragrafos: [
          'A cópia nova da wiki abre a gaveta de grupos com uma só entrada preenchida, e dentro dela há dois nomes: [[lince]] e [[sarmon]].',
          '*Pata de gato* é a expressão para quem tira a castanha do fogo por outro. Se o nome do grupo é irônico, a wiki não diz de quem.',
        ],
      },
      { titulo: 'O que a wiki não diz', paragrafos: [EM_BRANCO] },
    ],
    relacionados: ['lince', 'sarmon', 'divisao-fantasma', 'lua-sangrenta'],
    eras: ['era-moderna'],
  },
  {
    chave: 'divisao-fantasma',
    titulo: 'Divisão Fantasma',
    categoria: 'poder',
    resumo: 'Grupo listado na cópia antiga da wiki, sem um único membro nomeado.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'Tipo', valor: 'Grupo' },
      { rotulo: 'Membros', valor: 'Nenhum listado' },
      { rotulo: 'Fonte', valor: 'Só na cópia antiga' },
      { rotulo: 'Ficha', valor: 'Em branco na wiki' },
    ],
    secoes: [
      {
        titulo: 'Um nome e mais nada',
        paragrafos: [
          'Entre [[cats-paw|Cat’s Paw]] e a [[lua-sangrenta|Lua Sangrenta]], a wiki antiga abre uma gaveta chamada Divisão Fantasma e não põe ninguém dentro. Para um grupo com esse nome, é quase apropriado.',
        ],
      },
    ],
    relacionados: ['cats-paw', 'lua-sangrenta', 'escola-arkanheim'],
    eras: ['era-moderna'],
  },
  {
    chave: 'lua-sangrenta',
    titulo: 'Lua Sangrenta',
    categoria: 'poder',
    resumo: 'Grupo da campanha com um único nome registrado: Kagura.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'Tipo', valor: 'Grupo' },
      { rotulo: 'Membros', valor: 'Kagura' },
      { rotulo: 'Fonte', valor: 'Só na cópia antiga' },
      { rotulo: 'Ficha', valor: 'Em branco na wiki' },
    ],
    secoes: [
      {
        titulo: 'Kagura',
        paragrafos: [
          'A wiki antiga lista a Lua Sangrenta com um membro só, e Kagura não tem página própria em lugar nenhum — é o único nome do material inteiro que aparece exclusivamente dentro de um grupo.',
          'O nome é japonês, o que o põe perto de [[yoso|Yōso]] e da [[dinastia-hoseki|dinastia Hōseki]] — mas isso é leitura deste arquivista, não da wiki.',
        ],
      },
    ],
    relacionados: ['yoso', 'dinastia-hoseki', 'cats-paw'],
    eras: ['era-moderna'],
    alcunhas: ['Kagura'],
  },
];

const ARCOS: Verbete[] = [
  {
    chave: 'pretty-visitors',
    titulo: 'Pretty Visitors',
    epiteto: 'Arco I',
    categoria: 'evento',
    resumo: 'O primeiro arco da campanha, em dois atos: Crophall e Thandorr.',
    brasao: 'lamina',
    ficha: [
      { rotulo: 'Tipo', valor: 'Arco de campanha' },
      { rotulo: 'Ato 1', valor: 'Crophall' },
      { rotulo: 'Ato 2', valor: 'Thandorr' },
      { rotulo: 'Resumo', valor: 'Em branco na wiki' },
    ],
    secoes: [
      {
        titulo: 'Dois atos',
        paragrafos: [
          'A linha do tempo da wiki abre com *Pretty Visitors*, dividido em Ato 1 — Crophall — e Ato 2 — Thandorr. Nenhum dos dois lugares aparece no mapa de 1575 nem nas Anais.',
          'Os resumos estão marcados na wiki e não escritos.',
        ],
      },
    ],
    relacionados: ['trip-to-rhydash', 'poisonous-shadows', 'alvyriel'],
    eras: ['era-moderna'],
  },
  {
    chave: 'trip-to-rhydash',
    titulo: 'Trip to Rhydash',
    epiteto: 'Arco II',
    categoria: 'evento',
    resumo: 'O arco que levou a party à cidade mercante de Rhydash.',
    brasao: 'orhys',
    ficha: [
      { rotulo: 'Tipo', valor: 'Arco de campanha' },
      { rotulo: 'Onde', valor: 'Rhydash' },
      { rotulo: 'Resumo', valor: 'Em branco na wiki' },
    ],
    secoes: [
      {
        titulo: 'A cidade',
        paragrafos: [
          '[[rhydash|Rhydash]] é a cidade de [[casa-orhys|Casa Orhys]] — enobrecida, diz o registro, como concessão a um mercador próspero, embora os boatos digam que seus líderes já levantaram uma rebelião. Foi também o refúgio de quem fugiu do [[ano-vermelho|Ano Vermelho]].',
          'O que a party foi fazer lá, a wiki ainda não conta.',
        ],
      },
    ],
    relacionados: ['rhydash', 'casa-orhys', 'pretty-visitors', 'poisonous-shadows'],
    eras: ['era-moderna'],
  },
  {
    chave: 'poisonous-shadows',
    titulo: 'Poisonous Shadows',
    epiteto: 'Arco III',
    categoria: 'evento',
    resumo: 'O arco de Andari — a cidade élfica em declínio, fraturada em facções em guerra.',
    brasao: 'deallus',
    ficha: [
      { rotulo: 'Tipo', valor: 'Arco de campanha' },
      { rotulo: 'Onde', valor: 'Andari' },
      { rotulo: 'Resumo', valor: 'Em branco na wiki' },
    ],
    secoes: [
      {
        titulo: 'Andari',
        paragrafos: [
          'A wiki marca este arco com um lugar só: [[andari|Andari]]. É a cidade mais antiga do continente, erguida pelos [[povos-lunares|Povos Lunares]] depois da [[a-queda|Queda]] de [[corvus]], meio destruída pelo [[roubo-de-sindaren|Roubo de Sindaren]] e hoje partida em sub-famílias da [[casa-deallus|casa Deallus]] em guerra permanente.',
          'A wiki também registra, na gaveta de lugares em destaque, a biblioteca da cidade: [[tear-prateado|o Tear Prateado]] — cuja câmara selada guarda o único relato da Queda.',
        ],
      },
      {
        titulo: 'O que a wiki não diz',
        paragrafos: [
          'Os resumos do arco estão em branco. Dado o que o Códice já sabe de Andari, é o arco com mais material de mundo esperando por trás dele.',
        ],
      },
    ],
    relacionados: ['andari', 'tear-prateado', 'casa-deallus', 'imaren', 'elamyr'],
    eras: ['era-moderna'],
  },
  {
    chave: 'time-skip',
    titulo: 'Mini Arcos do Time Skip',
    epiteto: 'Entre os atos',
    categoria: 'evento',
    resumo: 'Três mini arcos que a wiki reserva no lugar do salto temporal, ainda sem título.',
    brasao: 'fumaca',
    ficha: [
      { rotulo: 'Tipo', valor: 'Arcos de campanha' },
      { rotulo: 'Quantos', valor: 'Três' },
      { rotulo: 'Títulos', valor: 'Em branco na wiki' },
    ],
    secoes: [
      {
        titulo: 'Espaço reservado',
        paragrafos: [
          'A linha do tempo fecha com “Mini Arcos durante o Time Skip” e três marcadores numerados sem nome. É a única entrada da wiki que registra tempo passando fora de cena.',
        ],
      },
    ],
    relacionados: ['poisonous-shadows', 'trip-to-rhydash', 'pretty-visitors'],
    eras: ['era-moderna'],
  },
];

/**
 * O índice da campanha.
 *
 * Existe pelo mesmo motivo que a wiki do Notion tem uma capa: alguém precisa
 * apontar para todo mundo. Sem esta página, metade do elenco ficaria sem
 * nenhum caminho de entrada — e o teste de integridade reprova exatamente
 * isso, com razão.
 */
const A_MESA: Verbete = {
  chave: 'a-mesa-de-aion',
  titulo: 'A Mesa de Aion',
  epiteto: 'A campanha, e quem a joga',
  categoria: 'poder',
  resumo:
    'O índice da campanha: a party atual, quem já jogou, os NPCs, os grupos e os arcos até aqui.',
  brasao: 'estrela',
  ficha: [
    { rotulo: 'Sistema', valor: 'D&D 5e' },
    { rotulo: 'Nível atual', valor: '10' },
    { rotulo: 'Party', valor: 'Cinco jogadores' },
    { rotulo: 'Fonte', valor: 'AION — RPG: The Complete Wiki (Notion)' },
    { rotulo: 'Cenário', valor: 'Valoran' },
  ],
  epigrafe: 'As Anais fecham em 1570. Isto aqui é o que veio depois — e está acontecendo.',
  secoes: [
    {
      titulo: 'A party',
      paragrafos: [
        '[[alvyriel]], a Eladrin que pretende ser a única deusa. [[ferdinand]] e [[beatrix]], os von Oumalis, casados no primeiro casamento do RPG. [[mateo]] e [[klen]], os dois juramentados da Rebelião. E [[epistola]], a página que a wiki pendura no nome de Mateo sem explicar.',
        '[[eliezer]] aparece só na cópia antiga da wiki. Antes deles passaram [[ayraas]], [[daigo]], [[lews]] e [[nims]].',
      ],
    },
    {
      titulo: 'Quem a campanha cruzou',
      paragrafos: [
        'Do lado dos aliados: [[sarmon]], [[lince]], [[lena]], [[morda]], [[cadeira]], [[carian]], [[iblis]], [[ikki]], [[imykus]], [[mia]], [[symon]], [[nornan]] e o improvável [[fake-ferdinand]] — além de [[elamyr]], que já tinha verbete nestas Anais antes de a wiki chegar.',
        'Neutros, quase todos de casas que a crônica conhece: [[lady-cyraxes-draco]], [[lorde-thoren-bellias]], [[lady-elias-rimors]], [[hadrik]], [[lysandra]] e [[katherine]]. O imperador [[ayren-herrys-iv|Ayren IV]] também está na lista — do lado neutro, o que é uma leitura e tanto sobre o Tirano Dourado.',
        'Inimigos: [[ilvissar]], [[carmilla]], [[a-balanca]], [[raven-mother]], [[pet-demonio]] e [[reincraft]].',
      ],
    },
    {
      titulo: 'Grupos e arcos',
      paragrafos: [
        'Os grupos: [[monges-de-virion|os Monges de Virion]], [[cats-paw|Cat’s Paw]], a [[divisao-fantasma|Divisão Fantasma]], a [[lua-sangrenta|Lua Sangrenta]] e Arkanheim — que nas Anais é [[escola-arkanheim|a Escola de Arkanheim]], dona da [[valari|Valari]] roubada.',
        'A linha do tempo: [[pretty-visitors|Pretty Visitors]], [[trip-to-rhydash|Trip to Rhydash]], [[poisonous-shadows|Poisonous Shadows]] e os [[time-skip|mini arcos do time skip]].',
      ],
    },
    {
      titulo: 'Onde o mundo e a mesa se encontram',
      paragrafos: [
        'Metade dos nomes acima já estava nestas Anais antes de a wiki ser importada. [[elamyr]] é o mesmo Elamyr que desertou dos [[imaren]] para marchar contra os [[yuan-ti]]. [[imykus]] é um dos doze que criaram [[alvyriel]]. [[poisonous-shadows]] se passa em [[andari]].',
        'É por isso que o elenco entrou no Códice em vez de virar uma lista à parte: a campanha está sendo jogada dentro deste mundo, e agora dá para ir de um ao outro em um clique.',
      ],
    },
  ],
  relacionados: ['alvyriel', 'andari', 'poisonous-shadows', 'monges-de-virion', 'elamyr', 'ayren-herrys-iv'],
  eras: ['era-moderna'],
  alcunhas: ['party', 'campanha', 'wiki'],
};

export const ELENCO: Verbete[] = [
  A_MESA,
  ...JOGADORES,
  ...EX_JOGADORES,
  ...ALIADOS,
  ...MONGES,
  ...NEUTROS,
  ...INIMIGOS,
  ...GRUPOS,
  ...ARCOS,
];
