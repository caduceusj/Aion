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
├── engine/    Motor de rolagem. TypeScript puro, sem dependências,
│              sem DOM. Determinístico dada uma semente.
├── three/     Cena 3D: geometrias poliédricas, texturas de face,
│              física e câmera. Não conhece React.
├── audio/     Síntese WebAudio. Não conhece React.
├── state/     Store zustand + persistência. Cola entre camadas.
└── ui/        Componentes React. Só consome as camadas acima.
```

Regra de dependência: as setas apontam sempre para baixo.
`ui → state → engine`, `ui → three`, `ui → audio`.
`engine` não importa nada. `three` e `audio` importam apenas tipos.

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
