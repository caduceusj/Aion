# Aion — Arquitetura

Mesa de dados imersiva para RPG de mesa. Aplicação web offline-first, sem
servidor, sem chamadas de rede em tempo de execução.

## Pilha

- **Vite 8** + **React 19** + **TypeScript** (strict)
- **three.js** (render) + **cannon-es** (física) para os dados 3D
- **zustand** para estado, persistido em `localStorage`
- **vitest** para testes
- Zero assets externos: texturas geradas em `<canvas>`, som sintetizado
  em WebAudio, ícones em SVG inline.

## Camadas

```
src/
├── engine/       Motor de rolagem. TypeScript puro, sem dependências,
│                 sem DOM. Determinístico dada uma semente.
├── daggerheart/  Regras do sistema e a ficha que monta as rolagens.
│                 Só produz strings de notação — não calcula resultado.
├── three/        Cena 3D: geometrias poliédricas, texturas de face,
│                 física e câmera. Não conhece React.
├── audio/        Síntese WebAudio. Não conhece React.
├── net/          Cliente da mesa compartilhada. Só entrega e recebe
│                 mensagens; quem decide o que fazer é o store.
├── state/        Store zustand + persistência. Cola entre camadas.
└── ui/           Componentes React. Só consome as camadas acima.

server/
└── relay.mjs     Relay WebSocket. Repassa mensagens de uma sala e nada
                  mais: não guarda histórico nem sabe resultado de dado.
```

Regra de dependência: as setas apontam sempre para baixo.
`ui → state → engine`, `ui → three`, `ui → audio`, `state → net`,
`state → daggerheart`. `engine` não importa nada. `three`, `audio` e `net`
importam apenas tipos.

## Daggerheart

`daggerheart/regras.ts` guarda todo número e texto do sistema em um lugar só,
para corrigir uma regra ser mexer em uma linha. `daggerheart/ficha.ts` monta as
expressões a partir do personagem.

A divisão de trabalho é deliberada: o Aion automatiza a **montagem** das
rolagens, que é mecânica e sem ambiguidade, mas os números da ficha (limiares
de dano, Evasão, dados de arma) são digitados pelo jogador, porque dependem de
classe, ancestral, comunidade e equipamento.

Nada aqui calcula resultado: tudo vira uma string de notação que passa pelo
motor como qualquer outra rolagem, e por isso continua auditável pela semente.

## Mesa compartilhada

Uma rolagem **não** trafega como resultado pronto. Vão só a expressão e a
semente, e cada aparelho reexecuta o motor. Como o motor é determinístico,
todos chegam ao mesmo número — e a física roda nativamente em cada tela, em vez
de alguém receber um resultado já rolado por outro.

Isso também significa que o relay não precisa ser confiável: ele não pode
inventar um resultado, só repassar uma expressão e uma semente que qualquer um
pode reproduzir.

`scripts/verifica-mesa.mjs` sobe o relay de verdade, conecta dois clientes e
confere exatamente essa propriedade.

## Contratos

Dois arquivos são a fonte da verdade compartilhada e **não devem ser
alterados sem atualizar todos os consumidores**:

- `src/engine/types.ts` — `RollResult`, `DieRoll`, `DiceGroup`, `RollError`
- `src/state/types.ts` — `Macro`, `Character`, `HistoryEntry`, `Settings`,
  `DiceStage`, `RollRequest`

O sistema de design vive em `src/ui/styles/tokens.css`. Nenhum componente
deve escrever cor, espaçamento ou duração fora dos tokens.

## Determinismo e auditoria

Toda rolagem carrega a semente que a gerou. `engine.replay(expr, seed)`
reproduz exatamente o mesmo resultado — é assim que a mesa resolve
discussões sobre "o dado rolou mesmo isso?".

A semente vem de `crypto.getRandomValues`; o gerador em si é um
xoshiro128** semeado por ela, para que a sequência seja reproduzível.

## Física com resultado predeterminado

O valor de cada dado é decidido pelo motor **antes** da simulação. A física
existe para dar peso e drama, não para sortear. Quando um dado assenta, a
cena identifica qual face ficou para cima e aplica uma permutação de rótulos
válida (faces opostas somam `n+1`) para que a face de cima exiba o valor
já sorteado. O jogador vê um dado real rolando; a matemática permanece
uniforme e auditável.

## Acessibilidade

- `prefers-reduced-motion` desliga física e flashes; o resultado aparece direto.
- Todo controle é alcançável por teclado; foco sempre visível.
- Resultados nunca dependem só de cor: crítico traz rótulo textual.
- Alvo de toque mínimo de 44px na doca inferior.
