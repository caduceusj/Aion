/**
 * Fragmentos soltos — lugares e nomes pequenos demais para uma gaveta
 * própria, grandes demais para ficar de fora.
 *
 * Português, lado da mesa, das notas pessoais do mestre.
 */

import type { Verbete } from '../tipos';

export const FRAGMENTOS: Verbete[] = [
  {
    chave: 'anton',
    titulo: 'Anton Von Oumalis',
    epiteto: 'O avô corrompido',
    categoria: 'npc',
    resumo: 'Avô de Ferdinand, corrompido pela Shadowfell após a morte da esposa, e pai verdadeiro de Reynkraft com outra mulher.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'Neto', valor: '[[ferdinand]]' },
      { rotulo: 'Filho', valor: '[[reincraft|Reynkraft]] — de outra mulher, não da avó de Ferdinand' },
      { rotulo: 'Assombra', valor: '[[teatro-de-anton|O Teatro de Anton]], em Andari' },
      { rotulo: 'Fonte', valor: 'Notas pessoais do mestre, fora da wiki' },
    ],
    secoes: [
      {
        titulo: 'Uma homenagem inacabada',
        paragrafos: [
          'Anton tentou se purificar através da música: compôs, para a esposa, uma homenagem que nunca terminou em vida. O que restou dela é um fragmento de partitura, encontrado apodrecendo no chão do camarim do teatro que hoje carrega o nome dele.',
        ],
      },
      {
        titulo: 'O segredo por trás da árvore genealógica',
        paragrafos: [
          'A câmara secreta da Torre da Lua Cheia guarda a versão não editada da árvore genealógica da Casa Oumalis: nela, a linha de [[reincraft|Reynkraft]] não se conecta à avó de Ferdinand. Reynkraft era filho só de Anton — com outra mulher, que morava escondida no backstage do teatro com um bebê. Foi esse segredo que deu a Reynkraft um motivo para matar a própria irmã antes que ela o revelasse.',
        ],
      },
      {
        titulo: 'Corrompido',
        paragrafos: [
          'Corrompido pela Shadowfell depois da morte da esposa, o espírito de Anton ainda ronda o teatro, usando uma máscara e cantando *Absolution* — a música que atacou [[ferdinand]] quando ele foi investigar o lugar.',
        ],
      },
    ],
    relacionados: ['ferdinand', 'reincraft', 'anneliese-oumalis', 'teatro-de-anton'],
    eras: ['era-moderna'],
  },

  {
    chave: 'teatro-de-anton',
    titulo: 'O Teatro de Anton',
    epiteto: 'Pequeno, apertado, e assombrado',
    categoria: 'lugar',
    resumo: 'Um teatro pequeno em Andari, mantido em pé por Reynkraft, onde o espírito corrompido de Anton ainda canta.',
    brasao: 'eclipse',
    ficha: [
      { rotulo: 'Onde', valor: 'Andari' },
      { rotulo: 'Mantido por', valor: '[[reincraft|Reynkraft]] — por sentimentalismo, ou por outro motivo' },
      { rotulo: 'Assombrado por', valor: '[[anton|Anton]]' },
      { rotulo: 'Fonte', valor: 'Notas pessoais do mestre, fora da wiki' },
    ],
    secoes: [
      {
        titulo: 'Um segredo escondido em plena vista',
        paragrafos: [
          'Pequeno e apertado, com algumas mesas e um palco principal com um piano visível, o teatro tem sinais de restauração parcial — madeira nova remendando o velho. [[ferdinand]] o visitou seguindo um som de canto que ninguém mais deveria estar ali para cantar.',
          'No backstage, um berço e brinquedos de bebê apodrecendo ao lado de partituras de piano espalhadas pelo chão contam a história que a árvore genealógica oficial da família escondeu: alguém morou escondido ali, com uma criança.',
        ],
      },
      {
        titulo: 'Por que ainda está de pé',
        paragrafos: [
          'Reynkraft manteve o teatro em pé mesmo depois de tudo — talvez sentimentalismo, talvez porque um lugar perfeitamente escondido sempre vale a pena preservar. Sabendo como ele era prático, a segunda explicação não seria surpreendente.',
        ],
      },
    ],
    relacionados: ['anton', 'ferdinand', 'andari'],
    eras: ['era-moderna'],
  },

  {
    chave: 'o-sofredor',
    titulo: 'O Sofredor',
    epiteto: 'Deus menor de Alhara e Luctos',
    categoria: 'poder',
    resumo: 'Deus menor venerado em Alhara e Luctos, fora dos Doze, cujo culto vê na dor autoinfligida um caminho para a clareza.',
    brasao: 'vazio',
    ficha: [
      { rotulo: 'Domínio', valor: 'Sofrimento e clareza através da dor' },
      { rotulo: 'Culto em', valor: '[[alhara|Alhara]] e [[luctos|Luctos]]' },
      { rotulo: 'Relíquia', valor: '[[chicote|O Chicote]]' },
      { rotulo: 'Fora do panteão', valor: 'Não é um d[[os-doze|os Doze]]' },
    ],
    secoes: [
      {
        titulo: 'Um deus fora dos Doze',
        paragrafos: [
          'A fé oficial de Aer Firen conta [[os-doze|os Doze]] e mais nenhum deus — mas Alhara e Luctos, terras que a coroa nunca terminou de digerir, cultuam o Sofredor à parte. É um deus de quem a fé dodecista não fala, e que a wiki da campanha só menciona porque [[ferdinand]] o encontrou.',
        ],
      },
      {
        titulo: 'A bênção da autoflagelação',
        paragrafos: [
          'O credo do Sofredor é simples: a dor que se escolhe sofrer clareia a que a vida impõe sem escolha. Um homem que Ferdinand viu sendo chicoteado, sem demonstrar nada além de paz, o apresentou ao culto — e lhe deu [[chicote|um chicote]] próprio.',
        ],
      },
    ],
    relacionados: ['ferdinand', 'chicote', 'alhara', 'luctos', 'os-doze'],
    eras: ['era-moderna'],
  },

  {
    chave: 'chicote',
    titulo: 'O Chicote do Sofredor',
    epiteto: 'Autoflagelação como conforto',
    categoria: 'reliquia',
    resumo: 'O instrumento que um devoto do Sofredor deu a Ferdinand, para transformar dor escolhida em clareza e paz.',
    brasao: 'lanca',
    ficha: [
      { rotulo: 'Dado a', valor: '[[ferdinand]], nas ruas pobres de Luctos' },
      { rotulo: 'Culto', valor: '[[o-sofredor|O Sofredor]]' },
      { rotulo: 'Uso', valor: 'Autoflagelação — conforto e clareza nos tempos difíceis' },
    ],
    secoes: [
      {
        titulo: 'Um instrumento contra a impotência',
        paragrafos: [
          'Ferdinand recebeu o chicote de um homem que encontrou vagando pelas ruas mais pobres de [[luctos|Luctos]], logo depois de entender que a própria mãe tinha sido enviada para morrer. "Receba este instrumento", disse o homem. "A autoflagelação será conforto nos tempos difíceis. E te ajudará a enxergar novos horizontes." Ferdinand aceita a bênção desde então.',
        ],
      },
    ],
    relacionados: ['ferdinand', 'o-sofredor', 'luctos'],
    eras: ['era-moderna'],
  },

  {
    chave: 'alhara',
    titulo: 'Alhara',
    epiteto: 'Onde o Luminífero é odiado',
    categoria: 'lugar',
    resumo: 'Região onde o povo odeia o Luminífero e cultua o Sofredor — um dos dois lares do culto, ao lado de Luctos.',
    brasao: 'vazio',
    ficha: [
      { rotulo: 'Culto', valor: '[[o-sofredor|O Sofredor]]' },
      { rotulo: 'Postura religiosa', valor: 'Odeia [[os-doze|o Luminífero]]' },
      { rotulo: 'Fonte', valor: 'Notas pessoais do mestre, fora da wiki' },
    ],
    secoes: [
      {
        titulo: 'Um povo que virou as costas para o sol',
        paragrafos: [
          'As pessoas de Alhara odeiam o Luminífero — o deus do sol, líder d[[os-doze|os Doze]] segundo a fé oficial de Aer Firen. É em Alhara, ao lado de [[luctos|Luctos]], que o culto d[[o-sofredor|o Sofredor]] tem raízes, um deus menor que a coroa não reconhece.',
        ],
      },
    ],
    relacionados: ['o-sofredor', 'luctos', 'os-doze'],
    eras: ['era-moderna'],
  },

  {
    chave: 'sangue-de-gigante',
    titulo: 'O sangue de gigante e a ordem das casas',
    epiteto: 'O que as Anais confessam não saber',
    categoria: 'evento',
    resumo: 'Notas da mesa respondem duas perguntas que as próprias Anais deixam em aberto: a ordem das casas, e o parentesco entre Bellias e Sturm.',
    brasao: 'montanha',
    ficha: [
      { rotulo: 'Ordem das casas', valor: '1º Herrys, 2º Draco/Deallus/Alabaster, 3º Rimors, 4º Bellias' },
      { rotulo: 'Resolve', valor: 'A pergunta aberta em [[casa-bellias]] sobre o parentesco com [[casa-sturm]]' },
    ],
    secoes: [
      {
        titulo: 'A ordem',
        paragrafos: [
          'As notas da mesa dão uma ordem de antiguidade às casas nobres que este Códice ainda não tinha: primeiro [[casa-herrys|Herrys]], a mais velha, cuja linhagem remonta à própria Era dos Mil Reis, quando nasceu o reino de Firen que mais tarde viraria [[imperio-aer-firen|o império de Aer Firen]]. Depois, juntas, [[casa-draco|Draco]], [[casa-deallus|Deallus]] e [[casa-alabaster|Alabaster]] — enobrecidas depois do conflito contra [[dartharion|Dartharion]]. Em terceiro, a Casa Rimors, título dado a exploradores da expansão do império pelo continente. Por último, [[casa-bellias|Bellias]], título dado postumamente aos irmãos do guerreiro que terminou a [[guerra-verdejante|Guerra Verdejante]].',
        ],
      },
      {
        titulo: 'A pergunta que as Anais recusam responder',
        paragrafos: [
          'O verbete de [[casa-bellias|House Bellias]] nas próprias Anais confessa não saber se a linhagem do fundador toca a de [[casa-sturm|House Sturm]], a outra casa de sangue de gigante do rol — "o registro põe as duas lado a lado e não traça nenhuma linha entre elas", escreve o cronista, "e eu não vou traçar uma por ele".',
          'As notas da mesa traçam essa linha: os Sturm já foram uma sub-família dos Bellias, do mesmo jeito que os Oumalis já foram uma sub-família dos Deallus. Ambas as casas descendem de gigantes — é a mesma descendência dividida em duas coroas.',
        ],
      },
    ],
    relacionados: ['casa-bellias', 'casa-sturm', 'casa-herrys', 'casa-draco', 'casa-deallus', 'casa-alabaster'],
    eras: ['era-primeira-luz', 'era-segunda-luz', 'era-moderna'],
  },

  {
    chave: 'templo-anciao',
    titulo: 'O Templo Ancião',
    epiteto: 'Perto da lua, arco dos lobisomens',
    categoria: 'lugar',
    resumo: 'Um templo antiquíssimo perto da lua, ligado à Tecelã e ao arco dos lobisomens, hoje quase esquecido.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Ligação', valor: 'A Tecelã, a Senhora da Lua' },
      { rotulo: 'Guardião', valor: 'Pouco — antes, muitos' },
      { rotulo: 'Fonte', valor: 'Notas pessoais do mestre, fora da wiki' },
    ],
    secoes: [
      {
        titulo: 'Um lugar quase esquecido',
        paragrafos: [
          'Perto da lua, o Templo Ancião guarda o arco dos lobisomens e uma ligação antiga com [[os-doze|a Senhora da Lua]], a Tecelã. É mantido por pouca gente hoje — mas por muitos, muitos anos ou dias antes, alguém viu essa lua subir e descer sem parar.',
          'Um homem com muito ódio no coração entrou no local com uma besta. Desde então, não está tão calmo.',
        ],
      },
      {
        titulo: 'Os lobisomens',
        paragrafos: [
          'Uma conta liga os lobisomens a tentativas fracassadas de se conjugar com a Tecelã, aqui no templo. Outra, guardada em [[vrednost|Vrednost]], liga o mesmo fenômeno a um culto de transmutação que tentava controlar os ciclos de licantropia por marcas circulares. O Códice registra as duas sem escolher: pode ser a mesma verdade contada duas vezes, ou duas origens correndo em paralelo.',
        ],
      },
    ],
    relacionados: ['os-doze', 'vrednost', 'symon'],
    eras: ['era-moderna'],
  },

  {
    chave: 'sao-chevalier',
    titulo: 'São Chevalier',
    epiteto: 'O santo popular de Andari',
    categoria: 'pessoa',
    resumo: 'Herói popular que protegeu os migrantes rumo a Sindaren — santo para o povo de Andari, figura pagã para o Império.',
    brasao: 'templo',
    ficha: [
      { rotulo: 'Culto', valor: 'Popular em Andari, fora da fé oficial dos Doze' },
      { rotulo: 'Feito', valor: 'Defendeu quem migrava para Sindaren' },
      { rotulo: 'Status para o Império', valor: 'Figura pagã' },
    ],
    secoes: [
      {
        titulo: 'Um herói fora do credo',
        paragrafos: [
          'São Chevalier não está na crença oficial [[os-doze|dos Doze]], e do ponto de vista do Império seria uma figura pagã. Para o povo de [[andari|Andari]], é um santo popular — o herói que defendeu quem estava migrando para Sindaren, quando ela ainda era um lugar para onde migrar.',
        ],
      },
    ],
    relacionados: ['andari', 'os-doze', 'povos-lunares'],
    eras: ['era-mil-reis', 'era-moderna'],
  },

  {
    chave: 'valridian',
    titulo: 'Valridian',
    epiteto: 'Sigilos achados no deserto',
    categoria: 'reliquia',
    resumo: 'Uma tecnologia ou material de sigilos antigos, encontrada pela primeira vez no deserto de Luctos e ainda usada em armas e máscaras.',
    brasao: 'lanca',
    ficha: [
      { rotulo: 'Primeiro achado', valor: 'Deserto de Luctos' },
      { rotulo: 'Usos conhecidos', valor: 'Braços acoplados de [[valquiel]]; a máscara de um cavaleiro sem nome' },
    ],
    secoes: [
      {
        titulo: 'Do deserto para a armadura',
        paragrafos: [
          'Os sigilos de Valridian foram encontrados pela primeira vez no deserto de Luctos, e continuam sendo encontrados lá até hoje. [[valquiel|Valquiel]], Cavaleiro da Coroa, carrega dois braços de Valridian acoplados ao próprio corpo; outro cavaleiro, sem nome registrado, usa uma máscara feita do mesmo material.',
        ],
      },
    ],
    relacionados: ['valquiel'],
    eras: ['era-moderna'],
  },

  {
    chave: 'valquiel',
    titulo: 'Valquiel',
    epiteto: 'Cavaleiro da Coroa',
    categoria: 'npc',
    resumo: 'Cavaleiro da Coroa com dois braços de Valridian acoplados, que mandou Klen procurar o General.',
    brasao: 'lanca',
    ficha: [
      { rotulo: 'Papel', valor: 'Cavaleiro da Coroa' },
      { rotulo: 'Corpo', valor: 'Dois braços de Valridian acoplados; olhos azulados com roxo' },
      { rotulo: 'Fonte', valor: 'Notas pessoais do mestre, fora da wiki' },
    ],
    secoes: [
      {
        titulo: '"Vejo em você o mesmo que ele viu"',
        paragrafos: [
          'Valquiel disse a [[klen]] para procurar o General — possivelmente [[duncan-bellias|Mestre Duncan]], embora a identidade não seja confirmada. "Digamos que vejo em você o mesmo que ele viu", foi o que disse antes de mandá-lo embora.',
        ],
      },
    ],
    relacionados: ['klen', 'valridian', 'duncan-bellias'],
    eras: ['era-moderna'],
  },

  {
    chave: 'rogar-crianca',
    titulo: 'Rogar',
    epiteto: 'Uma criança de escamas douradas',
    categoria: 'npc',
    resumo: 'Criança de olhos parecidos com os do rei e escamas de ouro pálido nas costas, encontrada por Ferdinand — o nome ecoa o de Rhogar.',
    brasao: 'dragao',
    ficha: [
      { rotulo: 'Encontrada por', valor: '[[ferdinand]]' },
      { rotulo: 'Traços', valor: 'Olhos parecidos com os do rei; escamas de ouro pálido nas costas' },
      { rotulo: 'Nome', valor: 'Rogar — ecoa [[rhogar]], o guerreiro meio-dragão das Anais' },
    ],
    secoes: [
      {
        titulo: 'Um nome que já existia',
        paragrafos: [
          '[[ferdinand]] encontrou uma criança com escamas nas costas — brancas à primeira vista, na verdade um ouro pálido — e olhos parecidos com os do rei. O nome dela é Rogar.',
          'Este Códice registra o eco e não a conclusão: [[rhogar|Rhogar]], o guerreiro meio-dragão dourado que ajudou a matar Dartharion mais de mil anos antes, tem quase o mesmo nome. Se é coincidência, sangue ou algo mais, nenhuma nota do mestre resolve.',
        ],
      },
    ],
    relacionados: ['ferdinand', 'rhogar'],
    eras: ['era-moderna'],
  },
];
