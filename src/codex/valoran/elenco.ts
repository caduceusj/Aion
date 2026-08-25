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
 * 3. Os atributos CON 2 / DEX 1 / WIS 4 / INT 0 / STR 0 / CHA 0 são o padrão
 *    do modelo "Base - Characters", não valores rolados — Alvyriel ainda os
 *    carrega assim. Ferdinand e Mateo tiveram a ficha preenchida de verdade
 *    numa página mais completa, e entram aqui com os valores reais.
 *
 * A wiki existe em duas cópias divergentes no Notion, cada uma com páginas
 * de profundidade diferente para o mesmo personagem — uma às vezes só com a
 * ficha em branco, outra com a backstory inteira escrita. Esta importação
 * junta as duas por personagem, preferindo sempre a versão mais completa, e
 * cada verbete diz de onde veio o que registra.
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
      { rotulo: 'CD · Proficiência · Iniciativa', valor: '18 · +4 · +2' },
      { rotulo: 'Atributos', valor: 'CON 2 · DEX 1 · WIS 4 · INT 0 · STR 0 · CHA 0' },
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
    epiteto: 'Lorde da Noite de Andari',
    categoria: 'jogador',
    resumo:
      'Meio-elfo artífice armorer, criado por Reynkraft em Andari, que se tornou Lorde da Noite ao unificar as famílias fraturadas dos Deallus.',
    brasao: 'martelo',
    ficha: [
      { rotulo: 'Nível', valor: '10' },
      { rotulo: 'Raça', valor: 'Meio-elfo' },
      { rotulo: 'Idade', valor: '27 anos' },
      { rotulo: 'Nome completo', valor: 'Ferdinand Franz Von Oumalis Deallus' },
      { rotulo: 'Classe', valor: 'Artificer / Armorer' },
      { rotulo: 'PV · CA', valor: '73 · 23' },
      { rotulo: 'CD · Proficiência · Iniciativa', valor: '18 · +4 · +2' },
      { rotulo: 'Atributos', valor: 'CON 14 · DEX 16 · WIS 10 · INT 20 · STR 8 · CHA 10' },
    ],
    epigrafe: 'Lembre-se, Ferdinand: existe um herói, e existe aquele que salva seu povo.',
    secoes: [
      {
        titulo: 'A armadura',
        paragrafos: [
          'Artífice da subclasse Armorer: a ficha inteira dele é uma armadura que ele mesmo constrói e melhora. É o único do grupo cujo poder é fabricado em vez de concedido, herdado ou jurado.',
        ],
      },
      {
        titulo: 'Infância em Andari',
        paragrafos: [
          'Nascido e criado em Andari, Ferdinand foi criado principalmente pelo tio, [[reincraft|Reynkraft Von Oumalis]] — a relação com o pai, [[nornan|Nornan Von Oumalis]], sempre foi distante. O vínculo mais forte da infância era com a mãe, [[anneliese-oumalis|Anneliese Von Oumalis]], e com a irmã, [[beatrix|Beatrix Von Oumalis]].',
          'Passava os dias escapando das paredes rígidas da casa Oumalis para visitar bairros vizinhos e brincar com outras crianças nobres — conhecendo partes da cidade em teoria inacessíveis a alguém da posição dele. Foi nessas fugas, e junto da mãe, que nasceram o amor pela harpa e pela escrita: Anneliese ajudava voluntariamente quem não sabia escrever, e ele aprendeu com ela.',
        ],
      },
      {
        titulo: 'O mantra de Reynkraft',
        paragrafos: [
          'Reynkraft via potencial em Ferdinand para carregar o nome da família, e começou o treinamento dele ainda jovem: reuniões políticas quase todo dia, anotações, e depois a cobrança — o tio pedindo a opinião dele sobre cada assunto, corrigindo com firmeza quando discordava. "Lembre-se, Ferdinand: existe um herói, e existe aquele que salva seu povo" virou mantra, e foi o que o forjou como líder. Com o tempo, sobrou cada vez menos tempo para a mãe.',
        ],
      },
      {
        titulo: 'A traição',
        paragrafos: [
          'Anneliese foi enviada a Luctos numa missão diplomática incomum para ela, e Ferdinand não teve chance de se despedir. Ela desapareceu sem deixar sinal. Com o tempo, era como se nunca tivesse existido — Reynkraft raramente dizia o nome da irmã, e sempre com frieza.',
          'Anos depois, quando a morte dela foi "confirmada", Reynkraft — que Ferdinand percebeu enlutado, ou algo perto disso — o enviou com uma brigada maior do que a que acompanhara Anneliese, para investigar. Ferdinand encontrou um território devastado. Nenhuma mensagem dela jamais tinha chegado. Reynkraft insistia que ela fora mandada para outro lugar; Ferdinand entendeu a verdade: ela tinha sido enviada para morrer.',
        ],
      },
      {
        titulo: 'O culto do Sofredor',
        paragrafos: [
          'A confirmação da traição o quebrou — a dor, a raiva, a impotência de saber que a figura que mais admirava era responsável, ainda que indiretamente, pela morte da própria mãe. Vagando pelas áreas mais pobres de Luctos nesse estado, viu um homem sendo chicoteado sem demonstrar dor — só paz, e uma espécie de sabedoria.',
          'O homem o apresentou ao culto do Sofredor, um dos deuses menores de Alhara e Luctos, e lhe deu um chicote: a autoflagelação como conforto nos tempos difíceis, e caminho para clareza e paz. Ferdinand aceita a bênção desde então.',
        ],
      },
      {
        titulo: 'Beatrix',
        paragrafos: [
          '[[beatrix|Beatrix]], mais nova, mais fechada e reservada, sempre teve uma boa relação com Ferdinand — que se sentia responsável por protegê-la do peso da casa Oumalis desde pequeno. Nas fases em que ficavam mais próximos, eram inseparáveis: ele a levava à praia de Andari, de onde viam as cachoeiras infinitas despencando no horizonte, cozinhava para ela e preparava o milkshake favorito dela desde criança.',
          'Quando outros garotos faziam brincadeiras de mau gosto com a irmã, Ferdinand se fantasiava de Ranz — uma figura folclórica — e os assombrava à noite, como vingança silenciosa. Também se posicionou sempre contra envolver Beatrix em qualquer viagem ou reunião política, apesar de Reynkraft insistir que seria inevitável, e fez de tudo para que ela pudesse estudar em Arcanheim, longe do alcance do tio.',
        ],
      },
      {
        titulo: 'O dia em que tudo mudou',
        paragrafos: [
          'Beatrix apareceu de repente em Andari, teleportada até a casa de Ferdinand — exausta, desesperada, coberta de poeira mágica. Tinha roubado um pergaminho arcano de Arcanheim, algo poderoso o bastante para colocar os dois na mira das autoridades da própria academia. Estavam sendo caçados. Ferdinand não hesitou: juntou o que pôde e partiu com ela, sabendo que a decisão o arrancaria de tudo — da casa Oumalis, de Reynkraft, de Andari.',
          'Ainda nos arredores da cidade, foram interceptados por um dos tios de Ferdinand, que veio para levar Beatrix de volta. Ferdinand cravou a rapieira no peito dele sem hesitar. Fugiram pelos pântanos além de Andari, onde o nevoeiro os escondeu — e dali em diante não houve mais volta. É o começo da campanha.',
          'A própria página de [[beatrix]] conta esse dia de outro ângulo — Ferdinand ainda em [[vrednost|Vrednost]] quando ela avisou que ia à academia, a correria até a sala secreta do arkhanmeister, a fuga de Andari atrás de um crocodilo para Myrian. As duas contas divergem em quase todos os detalhes; este Códice guarda as duas, sem escolher uma.',
        ],
      },
      {
        titulo: 'Von Oumalis',
        paragrafos: [
          'Ferdinand e Beatrix dividem o sobrenome por serem irmãos, filhos de Nornan e Anneliese Von Oumalis. O primeiro casamento que [[alvyriel]] oficiou na campanha foi o dele: com [[mia|Mia Eroth Deallus]], um casamento arranjado entre a Casa Oumalis e a Casa Deallus.',
        ],
      },
      {
        titulo: 'O Lorde da Noite de Andari',
        paragrafos: [
          'Depois de unificar as sub-famílias em que a [[casa-deallus|Casa Deallus]] se fraturou — a mesma fratura que as Anais registram como permanente e sem fim à vista —, Ferdinand assumiu o título de Lorde da Noite de Andari. É um posto antigo: o último a portá-lo morreu na Espiral da Família Deallus, o ponto do continente onde a Shadowfell nasceu.',
          'Nada disso está nas Anais, que fecham em 1570. É um título que a cidade deu a um homem vivo, na mesa, depois da última página que Maedrin Rimors escreveu. A wiki registra o resultado sem contar o caminho: entre os destaques da campanha, "a unificação de Andari, discurso de mil quilômetros" e "o casamento fofo conduzido por Alvyriel".',
        ],
      },
      {
        titulo: 'A confissão de Reynkraft',
        paragrafos: [
          'O que Ferdinand descobriu sozinho em Luctos tem um capítulo a mais, revelado só depois da morte de Reynkraft: ele sabia, desde antes de mandá-la, que Anneliese não voltaria. Escolheu o deserto para apagar qualquer vestígio — e o fez porque ela ameaçava revelar que a linhagem dele não vinha da avó de Ferdinand, e sim só do avô, Anton, o que tiraria de Reynkraft qualquer direito ao trono.',
          'Ferdinand deu à filha dele com Mia o nome [[anneliese-deallus|Anneliese Deallus]], em homenagem à avó que a menina nunca vai conhecer. Entre os destaques que a própria wiki guarda está a compra de [[cadeira|A Cadeira]] por 2000 peças de cobre — "meu bem mais precioso depois de minha filha e esposa", escreveu ele. Numa das viagens, também encontrou outra criança, [[rogar-crianca|Rogar]], de escamas douradas — sem parentesco confirmado com ele.',
        ],
      },
      {
        titulo: 'O avô Anton',
        paragrafos: [
          'Anton tentou se purificar através da música: uma homenagem à esposa que nunca terminou de compor em vida. Corrompido pela Shadowfell, o espírito dele ainda ronda o teatro de Andari que carrega o nome dele, cantando. Entre as partituras apodrecendo no chão do camarim, um fragmento sobreviveu:',
          '*Nas linhas que traçava, sua alma vivia, / versos que o vento em cantos trazia. / E ao tocar sua harpa, doce e sutil, / curava os silêncios num som de abril.*',
        ],
      },
      {
        titulo: 'O que a wiki não diz',
        paragrafos: [
          'A própria wiki reserva um espaço para a jornada de Ferdinand a Unkanten e ainda não o preencheu. O diário pessoal registra só fragmentos soltos: uma criatura morta por Eliezer e ligada ao Sofredor, Alvyriel abençoando uma criança, a vista de Andari reconstruída, Beatrix estudando — "é engraçado perceber como ela cresceu tão rápido" — e um cavalo desenhado num momento de ócio na Biblioteca do Tear Prateado.',
        ],
      },
    ],
    relacionados: [
      'a-mesa-de-aion',
      'beatrix',
      'alvyriel',
      'klen',
      'mateo',
      'mia',
      'anneliese-deallus',
      'anneliese-oumalis',
      'nornan',
      'reincraft',
      'casa-deallus',
      'cadeira',
      'vrednost',
    ],
    eras: ['era-moderna'],
    alcunhas: ['von Oumalis', 'Franz', 'Lorde da Noite'],
  },

  {
    chave: 'beatrix',
    titulo: 'Beatrix',
    epiteto: 'Beatrix von Oumalis',
    categoria: 'jogador',
    resumo:
      'Meia-elfa maga da Escola de Syrromancia, irmã mais nova de Ferdinand, que estudou divinação em Arcanheim antes de roubar um pergaminho de lá.',
    brasao: 'vazio',
    ficha: [
      { rotulo: 'Nível', valor: '10' },
      { rotulo: 'Raça', valor: 'Meia-elfa' },
      { rotulo: 'Idade', valor: '20 anos' },
      { rotulo: 'Classe', valor: 'Wizard / School of Syrromancy' },
      { rotulo: 'PV · CA', valor: '71 · 16' },
      { rotulo: 'CD · Proficiência · Iniciativa', valor: '18 · +4 · +1+(1d4)' },
      { rotulo: 'Atributos', valor: 'CON 15 · DEX 13 · WIS 8 · INT 20 · STR 8 · CHA 12' },
      { rotulo: 'Conquista', valor: 'Rats — morrer para ratos' },
    ],
    secoes: [
      {
        titulo: 'Syrromancia',
        paragrafos: [
          'A escola de magia dela não é do livro: *School of Syrromancy* não aparece em nenhum manual publicado. É criação da mesa, e a wiki não explica o que a syrromancia faz.',
        ],
      },
      {
        titulo: 'Filha de dois mundos',
        paragrafos: [
          'A mãe, [[anneliese-oumalis|Anneliese]], vinha do sangue da Casa Oumalis e era o rosto da família em reuniões e negociações. O pai, [[nornan|Nornan]], começou como um funcionário comum — um "contador" responsável por boa parte da papelada da casa — até que a relação com Anneliese virou oficial, e ele foi trazido para dentro da família. O casamento teve o apoio total do irmão dela, [[reincraft|Reynkraft]], líder estratégico da casa.',
          'Beatrix nasceu cerca de seis anos depois do primeiro filho do casal, [[ferdinand|Franz]]. Na infância, entre os 2 e os 8 anos, os pais passavam boa parte do ano separados — a mãe fazendo negócios com os Sturm, o pai cuidando dos negócios locais em Andari — e Beatrix se dividia entre os dois. Foi o período em que mais ficou perto do irmão.',
        ],
      },
      {
        titulo: 'Arcanheim',
        paragrafos: [
          'Dos 9 aos 12 anos, o pai percebeu a inteligência dela e passou a envolvê-la no próprio trabalho, incentivando a leitura — Beatrix tem dificuldade para aprender, mas retém profundamente o que consegue entender. Foi ele quem lhe mostrou a ideia de magia pela primeira vez.',
          'Entre os 13 e os 19 anos, por acordos do tio e do irmão, ela foi aceita em Arcanheim, na academia focada em divinação. Fez amizade com colegas e, principalmente, com professores — porque na maior parte do tempo ficava para trás no ritmo das aulas e precisava de reforço.',
        ],
      },
      {
        titulo: 'O roubo',
        paragrafos: [
          'No dia do roubo, Beatrix conversou com [[ferdinand]], que estava em [[vrednost|Vrednost]] numa missão diplomática, e disse a ele que ia estudar na academia de dunamancia. Algo deu errado lá: ela entrou na sala errada, a do arkhanmeister. Ferdinand correu para checar a irmã assim que soube, e a encontrou na sala secreta logo depois de ela pegar o pergaminho. Dali, ela usou um item anti-divinação e um pergaminho de teleporte para escapar.',
          'Chegando a Andari, os dois decidiram fugir e foram atrás de um crocodilo para Myrian — só no caminho descobriram exatamente o que tinham roubado.',
        ],
      },
      {
        titulo: 'Rouxinol e Katherine',
        paragrafos: [
          'Na mesa, Beatrix é chamada de Rouxinol — codinome que a própria [[mia|Mia]] pediu ao grupo para usar. Fora dele ela tem uma segunda identidade completa: [[katherine|Katherine]], fundadora de uma escola de magia em Rhydash, com a mesma ficha dela número por número. A própria wiki brinca com o disfarce: "Certamente não é a Beatrix".',
        ],
      },
    ],
    relacionados: ['a-mesa-de-aion', 'ferdinand', 'alvyriel', 'mateo', 'klen', 'mia', 'nornan', 'katherine', 'vrednost', 'anneliese-oumalis', 'reincraft'],
    eras: ['era-moderna'],
    alcunhas: ['von Oumalis', 'Rouxinol', 'Katherine', 'Catheryn Von Oumalis'],
  },

  {
    chave: 'mateo',
    titulo: 'Mateo',
    epiteto: 'O Monge da Misericórdia',
    categoria: 'jogador',
    resumo:
      'Elfo da floresta que começou como guerreiro psiônico juramentado à Rebelião e se retreinou como monge do Caminho da Misericórdia.',
    brasao: 'lamina',
    ficha: [
      { rotulo: 'Nível', valor: '10' },
      { rotulo: 'Raça', valor: 'Elfo da floresta' },
      { rotulo: 'Classe', valor: 'Monge / Way of Mercy' },
      { rotulo: 'PV · CA', valor: '82 · 21' },
      { rotulo: 'Deslocamento', valor: '65 (55) pés' },
      { rotulo: 'CD · Proficiência · Iniciativa', valor: '16/15 · +4 · +5' },
      { rotulo: 'Atributos', valor: 'CON 12 · DEX 20 · WIS 18 · INT 11 · STR 10 · CHA 10' },
      { rotulo: 'Tema', valor: 'REMEMBER — Jujutsu Kaisen' },
    ],
    epigrafe: 'Vida e morte, dois lados da mesma moeda.',
    secoes: [
      {
        titulo: 'Guerreiro e depois monge',
        paragrafos: [
          'Mateo começou como [[klen|Klen]] continua até hoje: Psi Warrior com o Juramento da Rebelião, força da mente e um juramento que existe para desobedecer. Num continente governado por [[ayren-herrys-iv|um tirano]], já era uma escolha de ficha que era uma declaração.',
          'Em algum ponto da campanha ele se retreinou como monge do Caminho da Misericórdia — a classe que a wiki registra hoje, com ficha completa: 82 PV, CA 21, deslocamento de 65 pés. O par de espelhos com Klen ficou no passado dele.',
        ],
      },
      {
        titulo: 'Epístola',
        paragrafos: [
          'A página dele tem uma página irmã, [[epistola|Epístola]] — uma pequena fada bárdica que o acompanha e sabe ler mentes. Foi assim que o grupo descobriu o que [[lince|Lince]] realmente é.',
        ],
      },
      {
        titulo: 'O braço',
        paragrafos: [
          'O braço de Mateo é um domínio de terror por conta própria, onde a [[shadowfell|Shadowfell]] se mistura à realidade — e carrega, dentro dele, parte do corpo da própria [[raven-mother|Raven Mother]]. A Tecelã indicou que, para se curar, ele precisa de alguém que controle "o outro lado da moeda".',
          'Uma figura tatuada e musculosa, que se apresentou como Escritos, chamou-o de Helltheon — nome que Mateo diz não usar há muito tempo.',
        ],
      },
      {
        titulo: 'Na mesa',
        paragrafos: [
          'Sabe entalhar madeira — a wiki registra a habilidade de carpintaria e as pequenas figuras que ele faz, um hábito que vem do tempo dele em Yōso. A conquista mais comentada, "Primeiro Pai do RPG", é atribuída ao próprio mestre da campanha, sem mais explicação. [[ferdinand]] deixou um recado direto na página dele: “Eu gostaria de ter mais conversas sobre a vida com você.”',
        ],
      },
      {
        titulo: 'O que a wiki não diz',
        paragrafos: [
          'Backstory em branco. O outro registro pessoal é um pedido de desculpas de [[alvyriel]]: “Desculpa por te empurrar pro [[imykus|Imykus]].”',
        ],
      },
    ],
    relacionados: ['a-mesa-de-aion', 'epistola', 'klen', 'alvyriel', 'imykus', 'ayren-herrys-iv', 'lince', 'raven-mother', 'shadowfell'],
    eras: ['era-moderna'],
    alcunhas: ['Helltheon'],
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
          'Carrega a combinação que [[mateo]] tinha originalmente — Psi Warrior com o juramento da Rebelião —, num corpo de genasi do ar em vez de elfo da floresta. Desde que Mateo se retreinou como monge, Klen é quem sozinho ainda carrega essa ficha.',
        ],
      },
      {
        titulo: 'Na mesa',
        paragrafos: [
          'O recado mais citado sobre ele é de [[alvyriel]], e é uma repreensão: “Pare de lootear templos.” Vindo de alguém criada dentro de um, faz sentido. [[ferdinand]] deixou outro, mais afetuoso: “Mal educado o suficiente pra ser um ótimo cavaleiro, o brilhante Sir Klen.”',
        ],
      },
      {
        titulo: 'O sol negro',
        paragrafos: [
          'Klen já esteve relacionado ao sol negro, e deve algo a alguém — muito. O que exatamente, e a quem, não está escrito em lugar nenhum do material.',
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
    epiteto: 'A fada bárdica de Mateo',
    categoria: 'jogador',
    resumo: 'Fada bárdica da linhagem Wordsmith que acompanha Mateo e consegue ler mentes — a página irmã dele na wiki.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Nível', valor: '6' },
      { rotulo: 'Raça', valor: 'Faery' },
      { rotulo: 'Classe', valor: 'Bard / College of Wordsmiths' },
      { rotulo: 'PV · CA', valor: '6 · 11' },
      { rotulo: 'Proficiência', valor: '+3' },
      { rotulo: 'Tema', valor: 'Red Maiden' },
      { rotulo: 'Papel', valor: 'Companheira de [[mateo]]' },
    ],
    secoes: [
      {
        titulo: 'O que Epístola viu em Lince',
        paragrafos: [
          'Epístola é uma pequena fada da linhagem Wordsmith, ligada a [[mateo]] na wiki — nível 6, 6 pontos de vida, e o poder de aprofundar a mente de alguém. Foi assim que o grupo descobriu o que [[lince|Lince]] realmente é: quando [[klen]] mencionou já tê-lo matado duas vezes, Epístola sentiu a raiva por trás disso e, olhando mais fundo, viu uma figura com a cara do mago à frente do grupo — a mesma de Lince, e a mesma do mestre dele.',
          'A leitura separou corpo de alma: a alma seriam os pensamentos indo e vindo entre os dois, uma parte mais fantasmagórica formaria o corpo de Lince, e a forma física é o que o grupo vê hoje.',
        ],
      },
    ],
    relacionados: ['mateo', 'lince', 'klen'],
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
  {
    chave: 'daigo',
    titulo: 'Daigo',
    epiteto: 'Ex-jogador — nome verdadeiro Yoshimitsu Miyamoto',
    categoria: 'jogador',
    resumo: 'Ex-jogador cujo nome verdadeiro é Yoshimitsu Miyamoto; os pais foram assassinados por um grupo de quatro.',
    brasao: 'lamina',
    ficha: [
      { rotulo: 'Papel', valor: 'Ex-jogador' },
      { rotulo: 'Nome verdadeiro', valor: 'Yoshimitsu Miyamoto' },
      { rotulo: 'Sistema', valor: 'D&D 5e' },
      { rotulo: 'Fonte', valor: 'Notas pessoais do mestre, fora da wiki' },
    ],
    secoes: [
      {
        titulo: 'Yoshimitsu Miyamoto',
        paragrafos: [
          '"Daigo" não é o nome dele: o verdadeiro é Yoshimitsu Miyamoto. Os pais dele foram assassinados por um grupo de quatro — uma mulher guerreira, um homem em vestes de sacerdote, um par de gêmeos e um owlin. Kagurabachi, irmão de [[kagura]], fez mal a ele em algum ponto dessa história, embora o que exatamente não esteja escrito em lugar nenhum.',
        ],
      },
      {
        titulo: 'Quem passou por aqui',
        paragrafos: [
          'A wiki mantém uma lista de *Former Players*, e Daigo está nela — junto de [[ayraas]], [[lews]] e [[nims]].',
        ],
      },
      { titulo: 'O que a wiki não diz', paragrafos: [EM_BRANCO] },
    ],
    relacionados: ['alvyriel', 'ayraas', 'lews', 'nims', 'kagura'],
    eras: ['era-moderna'],
  },
  {
    chave: 'lews',
    titulo: 'Lews',
    epiteto: 'Ex-jogador — o possível messias de Ridash',
    categoria: 'jogador',
    resumo: 'Ex-jogador que uma facção do conselho de Nova Minerva acredita ser o herói destinado a livrar o povo de Ridash de uma escuridão.',
    brasao: 'vazio',
    ficha: [
      { rotulo: 'Papel', valor: 'Ex-jogador' },
      { rotulo: 'Sistema', valor: 'D&D 5e' },
      { rotulo: 'Fonte', valor: 'Notas pessoais do mestre, fora da wiki' },
    ],
    secoes: [
      {
        titulo: 'O messias de Ridash?',
        paragrafos: [
          'Parte do conselho de Nova Minerva acredita que Lews pode ser um herói — quase um messias — para o povo de [[ridash|Ridash]]. Uma facção mais cética do mesmo conselho discorda. O compromisso entre as duas: se ele realmente expelisse uma grande escuridão de sob a terra desse povo, a crença estaria confirmada.',
        ],
      },
      {
        titulo: 'Quem passou por aqui',
        paragrafos: [
          'A wiki mantém uma lista de *Former Players*, e Lews está nela — junto de [[ayraas]], [[daigo]] e [[nims]].',
        ],
      },
    ],
    relacionados: ['alvyriel', 'ayraas', 'daigo', 'nims', 'ridash'],
    eras: ['era-moderna'],
  },
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
  {
    chave: 'sarmon',
    titulo: 'Sarmon Orhys',
    epiteto: 'O irmão preterido, depois Lorde de Ouro',
    categoria: 'npc',
    resumo: 'Filho bastardo de um Lorde de Ouro com uma Rakshasa, preterido na sucessão — até tomar o título de qualquer forma.',
    brasao: 'coroa',
    ficha: [
      { rotulo: 'Papel', valor: 'Fundador e líder da Pata do Gato — hoje Lorde de Ouro' },
      { rotulo: 'Origem', valor: 'Filho bastardo do antepenúltimo Lorde de Ouro com uma Rakshasa, em Al-Hara' },
      { rotulo: 'Título', valor: 'Lorde de Ouro e titular das terras de Ashara' },
      { rotulo: 'Fonte', valor: 'Wiki (backstory) e notas pessoais do mestre' },
    ],
    secoes: [
      {
        titulo: 'Escravo e fundador',
        paragrafos: [
          'Sarmon é filho bastardo do antepenúltimo Lorde de Ouro com uma Rakshasa — um tipo de devil — em Al-Hara. Viveu como escravo no mesmo continente, até se aliar a [[lince]] e outros órfãos para escapar do mago que os mantinha presos.',
        ],
      },
      {
        titulo: 'O irmão preterido',
        paragrafos: [
          'Chegando a Valoran, apesar de ser o irmão mais velho, foi ignorado na sucessão para Lorde de Ouro — título dado ao irmão mais novo. Como troféu de consolo, foi colocado na administração da guilda [[cats-paw|Cat’s Paw]].',
        ],
      },
      {
        titulo: 'A tomada do título',
        paragrafos: [
          'O irmão mais novo foi assassinado por assassinos Yuan-Ti, graças a uma dica do próprio [[ferdinand]]. Sarmon usou a popularidade que já tinha para tomar o título de Lorde de Ouro e titular das terras de Ashara — e, já no poder, adotou [[lince|Lince]] oficialmente como irmão.',
        ],
      },
    ],
    relacionados: ['lince', 'cats-paw', 'andari', 'ferdinand', 'casa-orhys'],
    eras: ['era-moderna'],
  },
  {
    chave: 'lince',
    titulo: 'Lince',
    epiteto: 'Um receptáculo vazio',
    categoria: 'npc',
    resumo: 'Fundador da Cat’s Paw e braço direito de Sarmon, amaldiçoado a usar o rosto e a memória do mago que os escravizava.',
    brasao: 'mao',
    ficha: [
      { rotulo: 'Papel', valor: 'Aliado — fundador da Pata do Gato, braço direito de [[sarmon]]' },
      { rotulo: 'Origem', valor: 'Escravo em Al-Hara, junto de Sarmon e outros órfãos' },
      { rotulo: 'Maldição', valor: 'Um amuleto que o transformou na aparência do mago Ohrash' },
      { rotulo: 'Fonte', valor: 'Wiki (backstory) e notas pessoais do mestre' },
    ],
    secoes: [
      {
        titulo: 'A fuga de Al-Hara',
        paragrafos: [
          'Lince viveu toda a infância como escravo em Al-Hara. Com [[sarmon]] e outros órfãos escravizados, matou o mago Ohrash, que os mantinha presos — e fugiu, com algumas mortes pelo caminho. Ohrash, já morto, o amaldiçoou: um amuleto preso ao pescoço de Lince passou a exibir a aparência do próprio mago, e ainda guarda a consciência e as memórias dele e de quem morreu na presença dele.',
          'Para quebrar a maldição e remover o amuleto, Sarmon trouxe Lince para Valoran, prometendo usar a riqueza do título de Lorde de Ouro para curá-lo. Depois de assumir a liderança da [[casa-orhys|Casa Orhys]], Sarmon o adotou oficialmente como irmão.',
        ],
      },
      {
        titulo: 'O que Epístola viu',
        paragrafos: [
          '[[epistola|Epístola]] aprofundou a mente dele e viu duas coisas de uma vez: quando [[klen]] mencionou já tê-lo matado duas vezes, a sensação era de raiva; e, olhando mais fundo, uma figura com a aparência do mago à frente do grupo — o mesmo rosto de Lince, e o mesmo do mestre dele — surgindo como se corpo e alma fossem coisas separadas. A alma seria os pensamentos indo e vindo; a parte mais fantasmagórica formaria o corpo de Lince; e a forma física é o que se vê agora.',
          'A leitura chegou a uma peça final: o mago que se vê na frente de Lince existiu por muitos e muitos anos, e em algum ponto houve uma separação. Corpo e alma estão intimamente ligados — a ponto de [[mateo]] carregar parte do corpo da Raven Mother —, então mesmo um corpo sem alma pode se estabilizar consumindo outras almas e colocando-as no lugar da própria. É a mesma maldição de Ohrash, vista de outro ângulo: o objetivo da wiki é a mecânica; o que Epístola viu é a textura de como ela realmente funciona por dentro.',
        ],
      },
      {
        titulo: 'Abandonado por Ilvissar',
        paragrafos: [
          'Numa reunião, Lince ficou subitamente possuído por raiva e tentou atacar a si mesmo; a voz que falou por ele se chamou de "receptáculo vazio" desse mesmo mago. “Seu desgraçado, você me abandonou”, foi o que Lince disse a [[ilvissar|Ilvissar]] quando os dois se encontraram de novo — sugerindo que o próprio Avis Lorean já teve alguma parte nessa história, antes de descartá-lo.',
        ],
      },
    ],
    relacionados: ['cats-paw', 'sarmon', 'epistola', 'ilvissar', 'klen', 'mateo', 'casa-orhys'],
    eras: ['era-moderna'],
  },
  aliado({
    chave: 'lena',
    titulo: 'Lena',
    brasao: 'estrela',
    nota: 'Os destaques que a wiki guarda dela são só dois: perguntou "Por que o céu é azul?" e derrubou um barco em cima da própria party.',
    relacionados: ['morda', 'lince'],
  }),
  aliado({ chave: 'morda', titulo: 'Morda', brasao: 'martelo', relacionados: ['lena', 'lince'] }),
  aliado({
    chave: 'cadeira',
    titulo: 'A Cadeira',
    brasao: 'templo',
    nota:
      'Um souvenir lendário comprado por [[ferdinand]] por 2000 peças de cobre — herança de tempos antigos, "o vintage em um novo mundo", e o bem mais precioso dele depois da filha e da esposa.',
    relacionados: ['ferdinand'],
  }),
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
  aliado({
    chave: 'symon',
    titulo: 'Symon',
    brasao: 'martelo',
    epiteto: 'Amigo de infância de Beatrix',
    nota:
      'Amigo de infância de [[beatrix]], mais velho que ela, com uma marca circular no corpo — a mesma que [[vrednost|a lore de Vrednost]] liga ao controle dos ciclos de licantropia.',
    relacionados: ['beatrix', 'vrednost'],
  }),
  aliado({
    chave: 'fake-ferdinand',
    titulo: 'Fake Ferdinand',
    brasao: 'martelo',
    nota:
      'Um segundo [[ferdinand]] — a wiki antiga o lista entre os aliados e não explica o resto.',
    relacionados: ['ferdinand'],
    fonte: 'Só na cópia antiga',
  }),
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
      'Rimors é o sobrenome de Maedrin Rimors, o erudito dos Arquivos Imperiais que escreveu as próprias Anais que este Códice guarda. Antiga Lorde das Florestas, desapareceu — e as notas do mestre sugerem que ela seja, na verdade, [[sariel]], atravessando os séculos sob o mesmo título.',
    relacionados: ['era-moderna', 'igreja-dos-doze', 'sariel', 'crise-de-aer-firen'],
  }),
  neutro({ chave: 'hadrik', titulo: 'Hadrik', brasao: 'martelo' }),
  neutro({ chave: 'lysandra', titulo: 'Lysandra', brasao: 'estrela' }),
  {
    chave: 'katherine',
    titulo: 'Katherine',
    epiteto: '"Certamente não é a Beatrix"',
    categoria: 'npc',
    resumo: 'Figura proeminente de Rhydash que ajudou a reconstruir Andari — e o alter ego de Beatrix, com as mesmas fichas idênticas.',
    brasao: 'folha',
    ficha: [
      { rotulo: 'Nível', valor: '10' },
      { rotulo: 'Raça', valor: 'Humana (declarada)' },
      { rotulo: 'Classe', valor: 'Wizard / ?????' },
      { rotulo: 'PV · CA', valor: '71 · 16' },
      { rotulo: 'CD · Proficiência · Iniciativa', valor: '18 · +4 · +1+(1d4)' },
      { rotulo: 'Atributos', valor: 'Idênticos aos de Beatrix — CON 15 · DEX 13 · WIS 8 · INT 20 · STR 8 · CHA 12' },
      { rotulo: 'Fonte', valor: 'Só na cópia antiga da wiki' },
    ],
    secoes: [
      {
        titulo: 'Fundadora de uma escola sem nome',
        paragrafos: [
          'Katherine é uma figura proeminente da cidade de Rhydash. Pouco se sabe de sua origem, mas ela ganhou notoriedade ajudando quem migrou para Andari a se reconstruir. É creditada como fundadora de uma escola de magia cujo nome a própria wiki censura — "@#$%$#@%", a ser revelado.',
        ],
      },
      {
        titulo: 'Certamente não é a Beatrix',
        paragrafos: [
          'A ficha de Katherine é, número por número, a de [[beatrix]]: mesmo PV, mesma CA, mesma iniciativa, os mesmos seis atributos. A wiki chama isso de curiosidade — "Certamente não é a Beatrix" — e lista a página como o Alter Ego dela. É o disfarce que Beatrix veste fora da mesa, o mesmo que este Códice já registrava sob o nome Catheryn Von Oumalis.',
        ],
      },
    ],
    relacionados: ['beatrix'],
    eras: ['era-moderna'],
    alcunhas: ['Catheryn Von Oumalis'],
  },
  neutro({
    chave: 'zeria',
    titulo: 'Zeria',
    brasao: 'martelo',
    epiteto: 'Chefe do Departamento Médico',
    nota:
      'Chefe do departamento médico de Andari. Deu a [[ferdinand]] vantagem em testes de resistência contra magias por dois dias, depois de tratá-lo.',
    relacionados: ['ferdinand'],
  }),
  neutro({
    chave: 'vovo-iara',
    titulo: 'Vovó Iara',
    brasao: 'folha',
    epiteto: 'Do Clube de Tricô',
    nota:
      'Não é uma vovozinha comum. Viaja entre pontos de Andari consertando roupas, negócio de família — mas também é um nome grande na cidade, mencionada em livros de história como infiltradora e espalhadora de informações desde a luta contra a incursão dos Yuan-Ti.',
    relacionados: ['andari', 'invasoes-serpentinas'],
  }),
  neutro({
    chave: 'aidwin',
    titulo: 'Aidwin',
    brasao: 'folha',
    nota: 'Meio-elfo identificado por Morda em Crocfall (hoje Marshton), com grande interesse por [[beatrix]].',
    relacionados: ['beatrix', 'morda'],
  }),
  neutro({
    chave: 'duncan-bellias',
    titulo: 'Duncan Bellias',
    brasao: 'bellias',
    epiteto: 'A Tempestade Silenciosa',
    nota:
      'General fireniano, não nascido de sangue nobre e elevado a Lorde do povo Bellias — o Lorde da Guerra, a Tempestade Silenciosa, antes de desaparecer misteriosamente.',
    relacionados: ['casa-bellias', 'klen'],
  }),
];

const INIMIGOS: Verbete[] = [
  inimigo({
    chave: 'ilvissar',
    titulo: 'Ilvissar Deallus',
    epiteto: 'Avis Lorean, para os que o conheceram antes',
    brasao: 'eclipse',
    nota:
      'Braço direito do atual rei de Valoran há gerações, formado em Clarividência e Previsão em Arcanheim. É um Deallus, e o mais próximo parente vivo do duque de Lavel dentro da própria [[casa-deallus|Casa Deallus]] — e o único nome que a wiki lista ao mesmo tempo entre os NPCs em destaque e entre os inimigos, o antagonista corrente da campanha. A própria wiki registra o nome de nascimento dele: Avis Lorean, meio elfo, meio humano.',
    relacionados: ['carmilla', 'raven-mother', 'casa-deallus', 'kagura', 'lince'],
    alcunhas: ['Avis Lorean', 'Avis'],
  }),
  inimigo({
    chave: 'a-balanca',
    titulo: 'A Balança',
    brasao: 'estrela',
    epiteto: 'Inimigo',
    nota: 'Um dia foi uma das que mais viu potencial nos mortais — os habitantes de [[ridash|Ridash]] ainda se dizem seus filhos, os Aegeon.',
    relacionados: ['ridash'],
  }),
  inimigo({
    chave: 'carmilla',
    titulo: 'Carmilla',
    brasao: 'serpente',
    epiteto: 'A Cavaleira do Coral Vermelho',
    nota:
      'Filha, ou campeã, da Rainha dos Marid, enviada para salvar os [[vernatto|Vernatto]] — surgiu nas águas do porto com armadura vermelha abençoada por corais e ajudou a derrotar os monstros de lá.',
    relacionados: ['vernatto', 'raven-mother'],
  }),
  inimigo({ chave: 'pet-demonio', titulo: 'Pet Demônio', brasao: 'mao' }),
  inimigo({
    chave: 'raven-mother',
    titulo: 'Raven Mother',
    brasao: 'eclipse',
    nota:
      'Nome de nascimento Leas: tomou à força o poder das sombras dos sábios de [[corvus]], vendeu a alma pela escuridão, e agora se intitula Raven Mother, emulando e profanando [[alvyriel|a Tecelã]].',
    relacionados: ['corvus', 'ilvissar', 'shadowfell'],
  }),
];

// =====================================================================
// FAMÍLIA VON OUMALIS
// =====================================================================

const FAMILIA: Verbete[] = [
  {
    chave: 'nornan',
    titulo: 'Nornan Von Oumalis',
    epiteto: 'O contador que casou para dentro da família',
    categoria: 'npc',
    resumo: 'Pai de Ferdinand e Beatrix — um plebeu que trabalhava como contador da Casa Oumalis antes de se casar com Anneliese.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Filhos', valor: 'Ferdinand e Beatrix' },
      { rotulo: 'Esposa', valor: '[[anneliese-oumalis|Anneliese Von Oumalis]]' },
      { rotulo: 'Origem', valor: 'Plebeu — contador da Casa Oumalis' },
      { rotulo: 'Fonte', valor: 'Wiki (backstory de Beatrix) e notas pessoais do mestre' },
    ],
    secoes: [
      {
        titulo: 'De fora para dentro da casa',
        paragrafos: [
          'Nornan não nasceu Von Oumalis. Começou como um funcionário comum da casa — um contador responsável por boa parte da papelada dela — até a relação com [[anneliese-oumalis|Anneliese]] virar oficial, e ele foi trazido para dentro da família. O casamento teve apoio total do irmão dela, [[reincraft|Reynkraft]], que decidia as questões estratégicas da casa.',
          'Mesmo assim, a figura paterna que [[ferdinand]] e [[beatrix]] realmente reconheciam era o tio, não ele — a relação de Nornan com os dois filhos sempre foi distante.',
        ],
      },
    ],
    relacionados: ['ferdinand', 'beatrix', 'anneliese-oumalis', 'reincraft'],
    eras: ['era-moderna'],
  },
  {
    chave: 'mia',
    titulo: 'Millora Eroth Deallus',
    epiteto: 'Lady de Andari',
    categoria: 'npc',
    resumo: 'Da Casa Deallus, esposa de casamento arranjado de Ferdinand, e a primeira a chamar Beatrix de Rouxinol.',
    brasao: 'deallus',
    ficha: [
      { rotulo: 'Casa', valor: 'Deallus' },
      { rotulo: 'Papel', valor: 'Esposa de Ferdinand — casamento arranjado' },
      { rotulo: 'Marca', valor: 'Um anel que guarda informação' },
      { rotulo: 'Fonte', valor: 'Wiki (ficha em branco) e notas pessoais do mestre' },
    ],
    secoes: [
      {
        titulo: 'Casamento arranjado',
        paragrafos: [
          'Chamada de Mia pelo grupo, Millora Eroth Deallus é esposa de [[ferdinand]] por um casamento arranjado entre a Casa Oumalis e a sua fração da fraturada [[casa-deallus|Casa Deallus]] — a mesma aliança por trás do título de [[ferdinand|Lorde da Noite de Andari]].',
          'Guarda informação num anel, e foi ela quem primeiro pediu ao grupo para chamar [[beatrix]] de Rouxinol.',
        ],
      },
      {
        titulo: 'O que ainda não se sabe',
        paragrafos: [
          'A página dela na wiki do Notion existe, mas a ficha inteira está em branco — só o nome, Millora Eroth Deallus, está preenchido. O resto vem das notas pessoais do mestre da campanha, fora da wiki.',
        ],
      },
    ],
    relacionados: ['ferdinand', 'beatrix', 'casa-deallus', 'anneliese-deallus'],
    eras: ['era-moderna'],
    alcunhas: ['Mia'],
  },
  {
    chave: 'anneliese-deallus',
    titulo: 'Anneliese Deallus',
    epiteto: 'Filha de Ferdinand e Mia',
    categoria: 'npc',
    resumo: 'Filha de Ferdinand e Mia Eroth Deallus, batizada em homenagem à avó paterna que nunca conheceu.',
    brasao: 'estrela',
    ficha: [
      { rotulo: 'Pais', valor: 'Ferdinand e Mia Eroth Deallus' },
      { rotulo: 'Homenageia', valor: 'Anneliese von Oumalis, avó paterna' },
      { rotulo: 'Fonte', valor: 'Notas pessoais do mestre, fora da wiki' },
    ],
    secoes: [
      {
        titulo: 'Um nome contra o esquecimento',
        paragrafos: [
          '[[ferdinand]] e [[mia|Mia Eroth Deallus]] deram à filha o nome da avó dele, [[anneliese-oumalis|Anneliese von Oumalis]] — morta antes que Ferdinand tivesse idade de se lembrar dela direito. É o tipo de homenagem que também é uma recusa: a família não deixa Reynkraft apagar aquele nome.',
        ],
      },
    ],
    relacionados: ['ferdinand', 'mia', 'anneliese-oumalis'],
    eras: ['era-moderna'],
  },
  {
    chave: 'anneliese-oumalis',
    titulo: 'Anneliese von Oumalis',
    epiteto: 'Assassinada em Luctos',
    categoria: 'npc',
    resumo: 'Mãe de Ferdinand, morta num assassinato premeditado por Reynkraft antes que revelasse a origem ilegítima dele.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'Filho', valor: 'Ferdinand' },
      { rotulo: 'Morte', valor: 'Assassinada no deserto de Luctos' },
      { rotulo: 'Responsável', valor: 'Reynkraft — ver Reincraft' },
      { rotulo: 'Fonte', valor: 'Notas pessoais do mestre, fora da wiki' },
    ],
    secoes: [
      {
        titulo: 'Uma missão que não era o que parecia',
        paragrafos: [
          'Anneliese foi enviada às Terras Desoladas de Luctos sob o pretexto de uma missão diplomática com a [[casa-orhys|Casa Orhys]]. [[reincraft|Reynkraft]] sabia, desde antes de ela partir, que não voltaria: mandou matá-la lá para que o deserto apagasse qualquer vestígio.',
          'O motivo foi um impasse sobre o futuro de Andari e da família — e uma ameaça: Anneliese ia revelar que a linhagem de Reynkraft não vinha da avó de Ferdinand, só de Anton, o que o deixaria sem direito algum ao trono.',
        ],
      },
      {
        titulo: 'O que ficou',
        paragrafos: [
          'O nome dela virou o de [[anneliese-deallus|uma neta que ela não chegou a conhecer]]. Uma carta do próprio Reynkraft, escrita para ser lida só depois de sua morte, confirma cada detalhe do crime, sem arrependimento.',
        ],
      },
    ],
    relacionados: ['ferdinand', 'reincraft', 'anneliese-deallus', 'casa-orhys'],
    eras: ['era-moderna'],
  },
  {
    chave: 'reincraft',
    titulo: 'Reynkraft',
    epiteto: 'O usurpador da Casa Oumalis',
    categoria: 'npc',
    resumo: 'Usurpador da Casa Oumalis, pactuado com Mephisto, que mandou assassinar a própria sobrinha para esconder que não tinha direito ao trono.',
    brasao: 'lanca',
    ficha: [
      { rotulo: 'Casa', valor: 'Oumalis (usurpador)' },
      { rotulo: 'Pacto', valor: 'Mephisto, Arquiduque dos Nove Infernos' },
      { rotulo: 'Trono', valor: 'Tecnologia Serafim/Oráculo sustentando um corpo em decomposição' },
      { rotulo: 'Fonte', valor: 'Wiki nova grafa *Reincraft*; wiki antiga e notas do mestre grafam *Reynkraft*' },
    ],
    secoes: [
      {
        titulo: 'O segredo da árvore genealógica',
        paragrafos: [
          'A árvore genealógica oficial da Casa Oumalis, guardada na Torre da Lua Cheia, foi retificada pela avó de [[ferdinand]] — mas uma versão mais antiga, escondida numa câmara secreta, não tinha esse conserto: nela, a linha de Reynkraft não se conecta a ela. Reynkraft era filho só de Anton, o avô. Sem aquele parentesco, ele nunca teve direito nenhum ao trono que ocupou.',
        ],
      },
      {
        titulo: 'O assassinato de Anneliese',
        paragrafos: [
          'Quando [[anneliese-oumalis|Anneliese]] ameaçou revelar o segredo, Reynkraft a mandou para o deserto de Luctos sob pretexto de uma missão diplomática com a [[casa-orhys|Casa Orhys]] — sabendo, desde antes de ela partir, que não voltaria. Ele mesmo escreveu, numa carta selada para ser lida só depois de sua morte, que escolheu as areias do deserto para apagar qualquer vestígio.',
        ],
      },
      {
        titulo: 'O pacto e o trono',
        paragrafos: [
          'Um corpo em decomposição sustentado por fios de tecnologia Serafim/Oráculo cravados na armadura, ligados a um trono de pedra polida — e, por baixo disso, um pacto com Mephisto, Arquiduque dos Nove Infernos. É a explicação de como um usurpador sem direito legítimo nenhum se manteve firme no poder por 21 anos.',
        ],
      },
      {
        titulo: 'A morte',
        paragrafos: [
          'Morreu diante de [[beatrix]], acusado por ela de ter roubado 21 anos de infância dela e de Ferdinand. As últimas palavras dele foram só um nome cortado ao meio: “Anne... eu não...”',
        ],
      },
    ],
    relacionados: ['ferdinand', 'beatrix', 'anneliese-oumalis', 'casa-orhys'],
    eras: ['era-moderna'],
    alcunhas: ['Reincraft'],
  },
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
        'Do lado dos aliados: [[sarmon]], [[lince]], [[lena]], [[morda]], [[cadeira]], [[carian]], [[iblis]], [[ikki]], [[imykus]], [[symon]] e o improvável [[fake-ferdinand]] — além de [[elamyr]], que já tinha verbete nestas Anais antes de a wiki chegar. E do lado de dentro da própria família Von Oumalis: o pai [[nornan]], a mãe assassinada [[anneliese-oumalis]], a esposa [[mia|Mia Eroth Deallus]] e a filha [[anneliese-deallus]].',
        'Neutros, quase todos de casas que a crônica conhece: [[lady-cyraxes-draco]], [[lorde-thoren-bellias]], [[lady-elias-rimors]], [[hadrik]], [[lysandra]], [[katherine]], [[zeria]], [[vovo-iara]], [[aidwin]] e [[duncan-bellias]]. O imperador [[ayren-herrys-iv|Ayren IV]] também está na lista — do lado neutro, o que é uma leitura e tanto sobre o Tirano Dourado.',
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
  ...FAMILIA,
  ...GRUPOS,
  ...ARCOS,
];
