/**
 * Fragmentos soltos — lugares e nomes pequenos demais para uma gaveta
 * própria, grandes demais para ficar de fora.
 *
 * Português, lado da mesa, das notas pessoais do mestre.
 */

import type { Verbete } from '../tipos';

export const FRAGMENTOS: Verbete[] = [
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
