/**
 * Rebaixa os dados do Daggerheart SRD e relata o que mudou.
 *
 * Os arquivos ficam versionados no repositório para o Aion funcionar
 * offline. Este script existe para atualizar essa cópia sem que ninguém
 * precise lembrar das URLs — e, principalmente, para dizer o que mudou,
 * já que uma mudança de formato lá em cima quebra o normalizador aqui.
 *
 *   node scripts/atualiza-srd.mjs            # aplica
 *   node scripts/atualiza-srd.mjs --conferir # só compara, não escreve
 *
 * Depois de aplicar, rode `npm test` — os testes em src/daggerheart/srd
 * conferem contagens e formatos contra os arquivos reais.
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE =
  'https://raw.githubusercontent.com/daggersearch/daggerheart-data/main/core';
const DESTINO = 'src/daggerheart/srd/dados';
const ARQUIVOS = [
  'ancestries.json',
  'classes.json',
  'subclasses.json',
  'communities.json',
  'domain-cards.json',
];

const apenasConferir = process.argv.includes('--conferir');
const resumo = (texto) => createHash('sha256').update(texto).digest('hex').slice(0, 16);

function contaItens(texto) {
  try {
    const dados = JSON.parse(texto);
    return Array.isArray(dados) ? dados.length : null;
  } catch {
    return null;
  }
}

let mudou = 0;
let falhou = 0;

for (const arquivo of ARQUIVOS) {
  const caminho = join(DESTINO, arquivo);

  let antigo = '';
  try {
    antigo = await readFile(caminho, 'utf8');
  } catch {
    antigo = '';
  }

  let novo;
  try {
    const resposta = await fetch(`${BASE}/${arquivo}`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    novo = await resposta.text();
  } catch (erro) {
    console.error(`  ERRO   ${arquivo}: ${erro.message}`);
    falhou += 1;
    continue;
  }

  // Um JSON inválido não pode substituir uma cópia boa.
  const itens = contaItens(novo);
  if (itens === null) {
    console.error(`  ERRO   ${arquivo}: resposta não é um array JSON válido`);
    falhou += 1;
    continue;
  }

  if (antigo === novo) {
    console.log(`  igual  ${arquivo} (${itens} itens, ${resumo(novo)})`);
    continue;
  }

  const antes = contaItens(antigo);
  const delta = antes === null ? 'novo arquivo' : `${antes} → ${itens} itens`;
  console.log(`  MUDOU  ${arquivo}: ${delta}, ${resumo(antigo)} → ${resumo(novo)}`);
  mudou += 1;

  if (!apenasConferir) await writeFile(caminho, novo);
}

console.log('');
if (falhou > 0) {
  console.error(`${falhou} arquivo(s) falharam — a cópia local ficou intacta.`);
  process.exit(1);
}

if (mudou === 0) {
  console.log('Nada mudou: a cópia local está em dia.');
} else if (apenasConferir) {
  console.log(`${mudou} arquivo(s) mudaram. Rode sem --conferir para aplicar.`);
} else {
  console.log(`${mudou} arquivo(s) atualizados.`);
  console.log('Agora rode: npm test');
  console.log('E atualize as somas em src/daggerheart/srd/PROCEDENCIA.md.');
}
