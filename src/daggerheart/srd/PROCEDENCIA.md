# Procedência dos dados do SRD

Os arquivos em `dados/` são cópias **verbatim** do repositório
[daggersearch/daggerheart-data](https://github.com/daggersearch/daggerheart-data),
que publica o Daggerheart SRD em JSON sob a Darrington Press Community
Gaming License (DPCGL).

Ficam versionados aqui de propósito: o Aion funciona offline e não deve
depender do GitHub em tempo de execução. Manter os arquivos sem nenhuma
edição também permite comparar com a fonte a qualquer momento.

| Arquivo | Itens | sha256 (16 primeiros) |
|---|---|---|
| `ancestries.json` | 18 ancestralidades | `46b158528553e46b` |
| `classes.json` | 9 classes | `28118cc2b0e94edc` |
| `subclasses.json` | 18 subclasses | `8415d1f2629b7453` |
| `communities.json` | 9 comunidades | `03ce4ec494581545` |
| `domain-cards.json` | 189 cartas de domínio | `b5b3dba9733c0383` |

Baixados em **2026-08-12** de
`https://raw.githubusercontent.com/daggersearch/daggerheart-data/main/core/`.

Para atualizar, rode `node scripts/atualiza-srd.mjs`, que rebaixa os
arquivos, confere que continuam íntegros e reporta o que mudou.

## Aviso obrigatório

A DPCGL exige que este aviso apareça onde o conteúdo for exibido. Ele está
em `src/daggerheart/srd/licenca.ts` e é renderizado no painel de ficha, além
de constar no README.

> This product includes materials from the Daggerheart System Reference
> Document, © Critical Role, LLC. Used with permission under the Darrington
> Press Community Gaming License (DPCGL). Daggerheart and all associated
> marks are trademarks of Critical Role, LLC.

Aion não é afiliado a Critical Role, LLC nem à Darrington Press.

## Cuidados ao mexer

- O texto do SRD **não é traduzido**. As descrições aparecem no original em
  inglês; a moldura da interface é que fica em português. Traduzir na mão
  produziria uma versão não oficial e provavelmente imprecisa das regras.
- O dataset tem uma inconsistência conhecida: `classes[].name` é uma string
  em caixa alta (`"BARD"`), enquanto `ancestries[].name` e
  `subclasses[].name` são objetos localizados (`{ "en-US": "Bard" }`). O
  normalizador em `index.ts` cuida dos dois casos.
