<div align="center">

# ⬢ AION

**Mesa de dados imersiva para RPG de mesa, com suporte dedicado a Daggerheart.**

Dados poliédricos de verdade, com física, caindo em uma mesa de feltro à luz de lampião.
Notação completa, histórico auditável, ficha que rola sozinha e mesa compartilhada
entre aparelhos.

</div>

---

## O que é

Aion é uma mesa de dados para jogar RPG. Não é um gerador de números com uma
animação por cima: os dados são poliedros reais simulados com física, a
matemática é auditável e cada rolagem guarda a semente que a produziu — se
alguém na mesa duvidar do resultado, dá para reproduzi-lo.

Funciona offline, sem conta, sem servidor, sem nenhuma requisição de rede.
Tudo — texturas dos dados, sons, ícones — é gerado em tempo de execução.

## Recursos

**Rolagem**
- Notação completa: `4d6kh3`, `2d20kl1`, `6d6!`, `4d6r1`, `10d10>=7f1`, `4dF`, `d%`
- Aritmética com precedência, parênteses e menos unário
- Rótulos: `1d20+7[Ataque com espada]`
- Vantagem e desvantagem em um toque
- Atalhos salvos por personagem ("Ataque", "Dano", "Iniciativa")

**Imersão**
- Dados 3D com física real (three.js + cannon-es): d4, d6, d8, d10, d12, d20, d100, Fudge
- Som sintetizado em WebAudio — impactos, fanfarra de crítico, baque de falha
- Efeitos de crítico e falha crítica com partículas
- Vibração no celular

**Daggerheart**
- Dados de dualidade (`dd`): 2d12 de Esperança e Medo, com cores próprias na mesa
- Empate é sucesso crítico e entra no mesmo drama do 20 natural
- Ficha que monta as rolagens: toque no atributo e ele rola com o modificador certo
- Ataque usa o atributo da arma; dano multiplica os dados pela proficiência do nível
- Dano crítico soma o máximo dos dados automaticamente
- Vantagem e desvantagem (±1d6) que se cancelam, e Experiências como bônus
- Leitura do desfecho: escolha a Dificuldade e ele diz qual dos quatro resultados saiu
- Trilhas de Vida, Estresse, Armadura e Esperança, e leitura de dano pelos limiares

**Mesa compartilhada**
- Todos os aparelhos na mesma sala veem as rolagens uns dos outros
- Só a expressão e a semente trafegam: cada aparelho reexecuta o motor e chega ao
  mesmo resultado, com a física rodando em cada tela
- Presença de quem está na mesa, contador de Medo do Mestre compartilhado
- Rolagem oculta do Mestre, revelada para todos quando ele quiser

**Mesa**
- Histórico com detalhamento dado a dado: o que foi mantido, descartado, rerrolado, explodido
- Semente por rolagem para auditoria e replay
- Vários personagens, cada um com sua cor de dado

**Acessibilidade**
- `prefers-reduced-motion` desliga física, flashes e partículas
- Navegação completa por teclado, com atalhos
- Críticos sempre trazem rótulo textual, nunca só cor

## Rodando

```bash
npm install
npm run dev        # desenvolvimento
npm test           # testes
npm run build      # typecheck + build de produção
npm run preview    # serve o build
```

Requer Node 20+.

### Mesa compartilhada

O Aion não tem servidor próprio — o relay é um processo de ~150 linhas que só
repassa mensagens entre os aparelhos de uma sala. Rode em qualquer máquina da rede:

```bash
npm run relay                 # porta 8787
PORT=9000 npm run relay
npm run verifica:mesa         # confere a mesa de ponta a ponta
```

No app, abra **Mesa**, aponte o endereço para o IP dessa máquina
(`ws://192.168.0.10:8787`), escolha um código de sala e mande o link de convite.
O relay não guarda histórico nem sabe o resultado de dado nenhum: as rolagens
viajam como expressão + semente e são recalculadas em cada aparelho.

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Enter` | Foca o campo de notação |
| `1`–`8` | Rola d4, d6, d8, d10, d12, d20, d100, dF |
| `r` | Repete a última rolagem |
| `v` / `d` | Vantagem / desvantagem |
| `h` / `a` / `,` | Histórico / atalhos / ajustes |
| `f` / `m` | Ficha de Daggerheart / mesa compartilhada |
| `Esc` | Fecha o painel aberto |

## Notação

| Sintaxe | O que faz |
|---|---|
| `3d6` | Três dados de seis lados |
| `4d6kh3` | Rola 4d6, mantém os 3 maiores |
| `2d20kl1` | Desvantagem: mantém o menor |
| `4d6dl1` | Descarta o menor |
| `6d6!` | Explode no valor máximo |
| `6d6!!` | Explosão composta |
| `4d6r1` | Rerrola todo 1 |
| `4d6ro1` | Rerrola 1 uma única vez |
| `4d6min2` | Piso 2 por dado |
| `10d10>=7` | Pool: conta sucessos |
| `10d10>=7f1` | Pool com falhas críticas |
| `4dF` | Dados Fudge/Fate |
| `d%` | Percentil |
| `1d20+7[Ataque]` | Com rótulo |
| `dd` | Dualidade: 2d12 de Esperança e Medo (Daggerheart) |
| `dd+2` | Dualidade com o modificador do atributo |
| `dd+2+1d6` | Com vantagem (`-1d6` para desvantagem) |

## Arquitetura

Veja [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

Resumo: `engine` é TypeScript puro e determinístico, sem DOM e sem dependências.
`three` e `audio` não conhecem React. `state` é a cola. `ui` só consome.
As setas de dependência apontam sempre para baixo.

## Licença

MIT — veja [LICENSE](LICENSE).
