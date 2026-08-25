/**
 * A Guilda da Lua Vermelha, os Vernatto, e a política moderna de Aer Firen.
 *
 * Português, categoria da mesa — como `elenco.ts`, isto é a campanha
 * acontecendo agora, não as Anais fechadas em 1570. Vem das notas pessoais
 * do mestre, fora da wiki do Notion.
 */

import type { Verbete } from '../tipos';

export const LUA_VERMELHA: Verbete[] = [
  {
    chave: 'guilda-lua-vermelha',
    titulo: 'A Guilda da Lua Vermelha',
    epiteto: 'Conhecida por inimigos como Lua Sangrenta',
    categoria: 'poder',
    resumo: 'Companhia de mercenários com uma única condição de contrato: nunca se enfrentar em campo de batalha.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'Tipo', valor: 'Companhia mercenária' },
      { rotulo: 'Condição', valor: 'Não lutar entre si, não importa quem pague mais' },
      { rotulo: 'Liderança', valor: '[[kagura]], também chamado de General ou Lorde por diferentes subordinados' },
      { rotulo: 'Apelido dado por inimigos', valor: 'Lua Sangrenta' },
    ],
    secoes: [
      {
        titulo: 'A condição',
        paragrafos: [
          'A Guilda da Lua Vermelha oferece serviço de mercenário para quem pagar melhor, com uma única regra fixa: nunca se enfrentar em campo de batalha, não importa quem contrate cada lado. Um esquadrão de trinta soldados chegou a Andari sob esse acordo, esperando a abertura de um portão.',
          'Entre eles, uma inconsistência que ninguém explica: os subordinados mais próximos chamam [[kagura]] de Lorde Kagura; os soldados comuns o chamam de General Kagura. Alguns duvidam abertamente da estratégia dele, e questionam se uma certa Lady Minamoto aceitaria as acusações que giram em torno disso.',
        ],
      },
      {
        titulo: 'O plano de infiltração',
        paragrafos: [
          'A estratégia de Kagura girava em torno da troca do Braço de Rokohero por uma quantia obscena de dinheiro — e o grupo se infiltrou como soldados da própria Guilda para chegar perto dele.',
        ],
      },
    ],
    relacionados: ['kagura', 'raven-mother', 'ravens-feathers'],
    eras: ['era-moderna'],
    alcunhas: ['Lua Sangrenta', 'Guilda Lua Vermelha'],
  },

  {
    chave: 'kagura',
    titulo: 'Rokohero Kagura',
    epiteto: 'Um dos Dois, irmão de Kagurabachi',
    categoria: 'npc',
    resumo: 'Owlin gigantesco que lidera a Guilda da Lua Vermelha e tenta vender uma arma envolta em bandagens Hosekianas.',
    brasao: 'asa',
    ficha: [
      { rotulo: 'Espécie', valor: 'Owlin — mais de dois metros, penas cinza e brancas' },
      { rotulo: 'Papel', valor: 'Líder da Guilda da Lua Vermelha' },
      { rotulo: 'Irmão', valor: 'Kagurabachi — fez mal a Daigo' },
      { rotulo: 'Arma', valor: 'O Braço de Rokohero, uma arma de concussão coberta de bandagens Hosekianas' },
    ],
    secoes: [
      {
        titulo: 'O Braço de Rokohero',
        paragrafos: [
          'Kagura carrega nas costas algo do tamanho e formato de um braço, completamente coberto de bandagens com escrita Hosekiana — não uma espada, e sim uma arma de concussão. O plano dele é trocá-la por uma quantia obscena de dinheiro, e [[reincraft|Reynkraft]] parecia interessado em estudá-la.',
          '[[ilvissar]] comentou, encarando os soldados de Kagura: a estratégia dele estava tornando tudo mais difícil — o crédito que um velho coruja não costuma receber.',
        ],
      },
      {
        titulo: 'O Vissar quer o que ele tem',
        paragrafos: [
          'Ilvissar chegou a Andari, segundo o próprio Kagura, assim que soube que "seu projetinho" tinha sido apropriado pela Lua Vermelha — o Vissar está atrás de algo que Kagura tem em posse.',
        ],
      },
    ],
    relacionados: ['guilda-lua-vermelha', 'ilvissar', 'reincraft'],
    eras: ['era-moderna'],
    alcunhas: ['Lorde Kagura', 'General Kagura'],
  },

  {
    chave: 'vernatto',
    titulo: 'Os Vernatto',
    epiteto: 'Ligados aos Marrixz pelas cachoeiras',
    categoria: 'poder',
    resumo: 'Povo ligado ao plano elemental da Água, atingido primeiro pela invasão da Shadowfell e hoje liderado pela Cavaleira do Coral Vermelho.',
    brasao: 'porto',
    ficha: [
      { rotulo: 'Ligação', valor: 'Família Marrixz, pelas cachoeiras' },
      { rotulo: 'Buscam', valor: 'Laços mais próximos com os territórios do Marid' },
      { rotulo: 'Comparação', valor: 'Não são tão terríveis quanto os Schraden' },
      { rotulo: 'Liderança atual', valor: '[[carmilla|a Cavaleira do Coral Vermelho]]' },
    ],
    secoes: [
      {
        titulo: 'O primeiro golpe',
        paragrafos: [
          'O ataque inicial da invasão da Shadowfell começou no corpo do antigo Lorde da Noite, mas foi no litoral dos territórios ligados aos Schraden e aos Vernatto que os monstros e abominações golpearam com mais força. Os Vernatto tiravam boa parte da própria organização do contato com cidades na borda entre o plano material e o plano elemental da Água, perto de uma cachoeira infinita — a maioria deles são genasi de água.',
          'O ataque inicial tirou boa parte da esperança dos Vernatto, o que explica por que eles pouco fizeram durante a guerra que se seguiu.',
        ],
      },
      {
        titulo: 'Dois exércitos',
        paragrafos: [
          'Os Vernatto mantêm dois exércitos distintos hoje; um deles é liderado por [[carmilla|a Cavaleira do Coral Vermelho]] — uma criatura de armadura vermelha abençoada por corais, bênção do plano elemental da Água, que surgiu em meio às águas do porto e ajudou a derrotar os monstros de lá.',
        ],
      },
      {
        titulo: 'O que ainda não se sabe',
        paragrafos: [
          'Para onde a Cavaleira do Coral Vermelho está guiando a cidade, ninguém no grupo sabe dizer ainda.',
        ],
      },
    ],
    relacionados: ['carmilla', 'raven-mother'],
    eras: ['era-moderna'],
  },

  {
    chave: 'ravens-feathers',
    titulo: 'Ravens Feathers',
    epiteto: 'Guarda de sangue',
    categoria: 'poder',
    resumo: 'Facção de guardas que manifesta armas de sangue e possivelmente se aliou aos Vernatto.',
    brasao: 'serpente',
    ficha: [
      { rotulo: 'Tipo', valor: 'Facção de guarda' },
      { rotulo: 'Marca', valor: 'Manifesta armas usando o próprio sangue' },
      { rotulo: 'Traços', valor: 'Berrante, olhos vermelhos, pele muito pálida' },
    ],
    secoes: [
      {
        titulo: 'Um guarda derrotado',
        paragrafos: [
          'A party derrotou um guarda subindo uma torre — um guarda dos Ravens Feathers, que manifestava armas usando o próprio sangue, carregava um berrante e tinha olhos vermelhos e pele muito pálida, o suficiente para levantar uma suspeita incômoda: o parecido era grande demais para ser coincidência. A pergunta que ficou: os Ravens Feathers se aliaram com os [[vernatto]]?',
        ],
      },
    ],
    relacionados: ['vernatto', 'raven-mother'],
    eras: ['era-moderna'],
  },

  // =====================================================================
  // A CRISE POLÍTICA DE AER FIREN
  // =====================================================================

  {
    chave: 'crise-de-aer-firen',
    titulo: 'A Crise das Casas de Aer Firen',
    epiteto: 'Nove casas, nove reações a uma guerra',
    categoria: 'evento',
    resumo: 'O retrato de como cada casa de Aer Firen reagiu à mobilização imperial durante a crise da Shadowfell.',
    brasao: 'herrys',
    ficha: [
      { rotulo: 'Contexto', valor: 'Mobilização imperial durante a invasão da Shadowfell' },
      { rotulo: 'Convocação', valor: 'O Imperador Ferdinand reuniu os lordes de Aer Firen e as lideranças de Unkanten na capital' },
    ],
    secoes: [
      {
        titulo: 'Casa por casa',
        paragrafos: [
          'Thandorr, uma casa que este Códice ainda não tem verbete próprio para nomear, enxerga a crise como um complô para justificar impostos e alistamento obrigatório, e está descontente com o Império. [[casa-alabaster|Alabaster]] não demonstra incômodo — aumentou a produção de armas e armaduras, mas suas ruas estão quase vazias, entre as forjas e o alistamento.',
          'As sub-famílias de [[casa-orhys|Orhys]] veem a crise como oportunidade de ganho financeiro. [[casa-vinco|Vinco]] está apreensiva com futuros ataques e intensifica as patrulhas marítimas no [[tres-portas-de-valoran|Litoral de Khorvari]].',
          'A Casa Rimors — outra que este Códice só conhece pelo nome, ainda sem verbete próprio — está no centro do conflito diplomático: a antiga Lorde das Florestas, [[sariel|Elias Rimors]], desapareceu, e o irmão mais novo dela, Lyone Rimors, assumiu o posto, tornando-se um dos maiores instigadores do conflito atual.',
          '[[casa-bellias|Bellias]] intensificou treinamentos e patrulhas, expandindo a presença do exército fireniano até [[andari|Andari]], onde já afixa cartazes de alistamento. [[casa-draco|Draco]], como casa adjunta à coroa, segue a posição de [[casa-herrys|Herrys]], que permaneceu em silêncio até a convocação. [[casa-keaton|Keaton]] permanece totalmente sumida.',
        ],
      },
      {
        titulo: 'Onde tudo se decide',
        paragrafos: [
          'O Imperador [[ferdinand|Ferdinand]], antes da reunião, sondou a situação das regiões com alguns lordes durante um coquetel — o tipo de detalhe que a política de salão sempre entrega antes da política de sala fechada.',
        ],
      },
    ],
    relacionados: ['sariel', 'lorde-thoren-bellias', 'lady-cyraxes-draco', 'ferdinand'],
    eras: ['era-moderna'],
  },

  {
    chave: 'sariel',
    titulo: 'Sariel',
    epiteto: 'A antiga Lady Rimors',
    categoria: 'npc',
    resumo: 'Líder dos elfos lunares de Sindaren antes da fundação de Aer Firen, e provável identidade por trás da atual Lady Elias Rimors desaparecida.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Era', valor: 'Antes da fundação de Aer Firen, na Era dos Mil Reis' },
      { rotulo: 'Aliados', valor: 'O líder do clã anão Rockfury, o meio-dragão dourado Rhogar, e o príncipe Ayren II' },
      { rotulo: 'Objetivo', valor: 'Vingança contra Dartharion, o dragão que queimou o reino Firen' },
      { rotulo: 'Status', valor: 'Desaparecida' },
    ],
    secoes: [
      {
        titulo: 'Antes da coroa',
        paragrafos: [
          'Sariel liderava, com o irmão, os elfos lunares na região de Sindaren, antes mesmo da fundação de [[imperio-aer-firen|Aer Firen]] — na Era dos Mil Reis, quando Valoran ainda era fragmentado. Ela fez parte da aliança original que se formou para matar [[dartharion|Dartharion]]: o líder do clã anão Rockfury, o guerreiro meio-dragão dourado Rhogar, e o príncipe Ayren II do reino Firen.',
          'Pelo êxito da aliança, ela foi elevada a nobre e recebeu poder político como uma das quatro casas originais do reino — hoje, a Casa Rimors, que controla a barreira natural entre o planalto da coroa e o resto do mundo. Este Códice ainda não tem verbete próprio para a casa em si.',
        ],
      },
      {
        titulo: 'A mesma pessoa?',
        paragrafos: [
          'Existe uma relação forte demais para ser ignorada: [[sariel|Sariel]], outrora "A Lady Rimors", e a atual [[lady-elias-rimors|Lady Elias Rimors]] — ambas ladies que usavam arco e flecha, e ambas desaparecidas. Este Códice registra a suspeita sem afirmá-la como fato: pode ser a mesma imortal atravessando os séculos sob o mesmo título, ou pode ser coincidência de armas e sumiços.',
        ],
      },
    ],
    relacionados: ['lady-elias-rimors', 'dartharion', 'crise-de-aer-firen'],
    eras: ['era-mil-reis', 'era-moderna'],
    alcunhas: ['A Lady Rimors'],
  },
];
