<div align="center">

# ⬢ AION

**Mesa de dados imersiva para RPG de mesa.**

Dados poliédricos de verdade, com física, caindo em uma mesa de feltro à luz de lampião.
Notação completa, histórico auditável, zero servidor.

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

**Mesa**
- Histórico com detalhamento dado a dado: o que foi mantido, descartado, rerrolado, explodido
- Rolagem oculta do mestre, revelada quando ele quiser
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

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| `Enter` | Foca o campo de notação |
| `1`–`7` | Rola d4, d6, d8, d10, d12, d20, d100 |
| `r` | Repete a última rolagem |
| `v` / `d` | Vantagem / desvantagem |
| `h` / `a` / `,` | Histórico / atalhos / ajustes |
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

## Arquitetura

Veja [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

Resumo: `engine` é TypeScript puro e determinístico, sem DOM e sem dependências.
`three` e `audio` não conhecem React. `state` é a cola. `ui` só consome.
As setas de dependência apontam sempre para baixo.

## Licença

MIT — veja [LICENSE](LICENSE).
