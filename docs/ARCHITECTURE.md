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

Uma rolagem **não** trafega como resultado pronto. Vão a expressão, a semente e
as **faces que a mesa de quem rolou leu**; cada aparelho refaz a conta em cima
dessas mesmas faces e chega ao mesmo número.

Mandar as faces, e não deixar cada tela rolar as suas, é o que faz a mesa ser
uma só: o dado de um jogador não pode cair 17 na tela dele e 4 na do vizinho.
Quem recebe mostra os dados **já deitados** nessas faces (`DiceStage.exibir`),
em vez de encenar uma física que teria de terminar num resultado combinado.

O relay continua não precisando ser confiável: ele não pode inventar um total,
só repassar faces e uma expressão que qualquer um confere somando na mão.

`scripts/verifica-mesa.mjs` sobe o relay de verdade, conecta dois clientes e
confere exatamente essa propriedade.

## Contratos

Dois arquivos são a fonte da verdade compartilhada e **não devem ser
alterados sem atualizar todos os consumidores**:

- `src/engine/types.ts` — `RollResult`, `DieRoll`, `DiceGroup`, `RollError`
- `src/state/types.ts` — `Macro`, `Character`, `HistoryEntry`, `Settings`,
  `DiceStage`, `RollRequest`, `PedidoDeExibicao`

O sistema de design vive em `src/ui/styles/tokens.css`. Nenhum componente
deve escrever cor, espaçamento ou duração fora dos tokens.

## Quem decide o resultado é o dado

Esta é a decisão central do projeto, e ela já foi ao contrário.

O valor de cada dado é a face que ele mostrou quando parou. A cena arremessa
os poliedros, espera, **lê** a face de cima e devolve esses números; só então
o motor faz a conta. Nenhuma face é reetiquetada, nenhum número muda depois de
aparecer na tela.

O caminho é este, e a ordem importa:

```
rollExpression → planejarDados → pendingRequest → stage.arremessar
    → faces lidas → concluirArremesso → rollComValores → histórico
```

`planejarDados` lista os dados que a expressão precisa **na ordem exata** em
que o avaliador vai consumi-los; `fonteDaFila` entrega a enésima face lida ao
enésimo pedido do motor. É essa correspondência que sustenta tudo.

Três coisas ficam de fora da mesa e são sorteadas pelo gerador semeado:
explosões, rerolagens e o caso de não haver mesa (física desligada, movimento
reduzido, ausência de WebGL). Elas não podem ser arremessadas de antemão
porque dependem do que sair. Esses dados vêm marcados com `fisico: false` e a
interface diz isso — pastilha tracejada e "Sorteado (não rolou na mesa)".

Um percentil são **dois** dados de verdade na mesa: dezenas (00..90) e
unidades (1..10), somados por `combinarLeituras` com 00 + 10 valendo 100.

### Por que isso é honesto

Deixar a física decidir só vale se a física for justa. `three/justica.test.ts`
roda a mesma simulação da mesa sem renderizar nada, conta em que face o dado
assenta e aplica qui-quadrado: nenhuma face some e a distribuição passa. Um
viés na simulação seria, agora, um viés na rolagem — então ele é testado.

O tetraedro é o único caso especial: apoiado numa face, as outras três ficam
inclinadas no mesmo ângulo, e desempatar por ruído de ponto flutuante
escolheria uma face que o jogador não teria como identificar. Nele o critério
passa a ser a face voltada para a câmera — a que está de frente para quem
olha. Continua uniforme (1/4 por face) e, ao contrário do desempate numérico,
é visível.

## Determinismo e auditoria

Toda rolagem carrega a semente que a gerou, e ela ainda vale para o caminho
sem mesa: `engine.replay(expr, seed)` reproduz o resultado idêntico. A semente
vem de `crypto.getRandomValues`; o gerador é um xoshiro128** semeado por ela.

Para uma rolagem que passou pela mesa, porém, a auditoria mudou de natureza —
e ficou mais forte, não mais fraca. O que se confere não é "reexecute a
semente e veja se dá o mesmo": é a lista de faces que apareceram nos dados,
que qualquer um na mesa viu e pode somar na mão. `rollComValores(expr, faces,
seed)` refaz a conta a partir delas. A semente só cobre o que não rolou na
mesa: explosões e rerolagens.

## Acessibilidade

- `prefers-reduced-motion` desliga física e flashes; o resultado aparece direto.
- Todo controle é alcançável por teclado; foco sempre visível.
- Resultados nunca dependem só de cor: crítico traz rótulo textual.
- Alvo de toque mínimo de 44px na doca inferior.
