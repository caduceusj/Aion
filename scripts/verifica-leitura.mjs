/**
 * Prova, no navegador de verdade, que o número não troca.
 *
 *   node scripts/verifica-leitura.mjs [url]
 *
 * Rola vários d20 sozinhos e, para cada um:
 *   1. tira uma foto do canvas assim que os dados param;
 *   2. tira outra 1,5s depois;
 *   3. compara os pixels.
 *
 * No desenho antigo essas duas fotos eram diferentes — o dado assentava com um
 * número e a cena reetiquetava a face para o valor sorteado. Agora a face lida
 * É o valor, então nada pode mudar depois do assentamento.
 *
 * De quebra confere que o total exibido bate com a face do dado, lendo o
 * detalhamento do histórico.
 */
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

/**
 * Fração de pixels que mudou entre duas fotos.
 *
 * Comparar os bytes do PNG não serve: qualquer ruído de antisserrilhado dá
 * "diferente". O que interessa é quanto da imagem mudou — reetiquetar a face
 * de um dado muda uma área bem visível, e o resto do quadro é estático.
 */
async function medirDiferenca(page, a, b) {
  return page.evaluate(
    async ([umB64, doisB64]) => {
      const carregar = (b64) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = `data:image/png;base64,${b64}`;
        });

      const [um, dois] = await Promise.all([carregar(umB64), carregar(doisB64)]);
      const canvas = document.createElement('canvas');
      canvas.width = um.width;
      canvas.height = um.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      ctx.drawImage(um, 0, 0);
      const pa = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(dois, 0, 0);
      const pb = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let diferentes = 0;
      const total = pa.length / 4;
      for (let i = 0; i < pa.length; i += 4) {
        const d =
          Math.abs(pa[i] - pb[i]) + Math.abs(pa[i + 1] - pb[i + 1]) + Math.abs(pa[i + 2] - pb[i + 2]);
        if (d > 24) diferentes += 1;
      }
      return { fracao: diferentes / total, diferentes, total };
    },
    [a.toString('base64'), b.toString('base64')],
  );
}

const url = process.argv[2] ?? 'http://localhost:4173/';
const RODADAS = 8;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
const problemas = [];
page.on('console', (m) => {
  if (m.type() === 'error') problemas.push(`console: ${m.text()}`);
});
page.on('pageerror', (e) => problemas.push(`pageerror: ${e.message}`));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// O overlay do total fica POR CIMA do canvas e some sozinho depois de alguns
// segundos. Sem escondê-lo, a comparação mediria o overlay indo embora, não
// o dado — que é o que interessa aqui.
await page.addStyleTag({ content: '.resultado { display: none !important; }' });

const canvas = page.locator('canvas.palco__canvas');
if ((await canvas.count()) === 0) {
  problemas.push('canvas do palco não encontrado — a física está desligada?');
}

let trocas = 0;
let divergencias = 0;

for (let rodada = 1; rodada <= RODADAS; rodada += 1) {
  await page.getByLabel('Notação da rolagem').fill('1d20');
  await page.getByLabel('Notação da rolagem').press('Enter');

  // Espera o resultado aparecer: é o sinal de que os dados pararam.
  await page.waitForFunction(
    (esperado) => document.querySelectorAll('.entrada').length >= esperado,
    rodada,
    { timeout: 15000 },
  );
  await page.waitForTimeout(300);

  const antes = await canvas.screenshot();
  // O total do histórico, e não o do overlay: o overlay some sozinho depois
  // de alguns segundos, e some é diferente de mudar.
  const alvo = page.locator('.entrada__total').first();
  const totalAntes = (await alvo.evaluate((el) => el.textContent)).trim();

  await page.waitForTimeout(1500);

  const depois = await canvas.screenshot();
  const totalDepois = (await alvo.evaluate((el) => el.textContent)).trim();

  const diferenca = await medirDiferenca(page, antes, depois);
  if (diferenca.fracao > 0.002) {
    trocas += 1;
    console.log(
      `  rodada ${rodada}: a mesa MUDOU depois de assentar ` +
        `(${(diferenca.fracao * 100).toFixed(2)}% dos pixels, total ${totalAntes})`,
    );
    await writeFile(`screenshots/mudou-${rodada}-antes.png`, antes);
    await writeFile(`screenshots/mudou-${rodada}-depois.png`, depois);
  } else if (diferenca.fracao > 0) {
    console.log(
      `  rodada ${rodada}: ${(diferenca.fracao * 100).toFixed(3)}% dos pixels diferentes (ruído)`,
    );
  }
  if (totalAntes !== totalDepois) {
    divergencias += 1;
    console.log(`  rodada ${rodada}: o total mudou de ${totalAntes} para ${totalDepois}`);
  }

  // O detalhamento tem que dizer que o dado foi lido na mesa.
  // O detalhamento vive dentro da entrada do histórico; em telas largas ele
  // abre ao clicar. Sem ele não dá para conferir a procedência do dado.
  const entrada = page.locator('.entrada').first();
  const cabecalho = entrada.locator('.entrada__cabecalho');
  // Escopo na entrada mais nova, e não em qualquer `.detalhe` da página: as
  // anteriores continuam abertas e responderiam pela rolagem errada.
  if ((await cabecalho.count()) && (await entrada.locator('.detalhe').count()) === 0) {
    await cabecalho.click();
    await page.waitForTimeout(250);
  }

  const pastilha = entrada.locator('.detalhe .pastilha').first();
  if ((await pastilha.count()) === 0) {
    problemas.push(`rodada ${rodada}: detalhamento não encontrado`);
  } else {
    const titulo = (await pastilha.getAttribute('title')) ?? '';
    const valor = (
      await pastilha.locator('.pastilha__valor').evaluate((el) => el.textContent)
    ).trim();
    if (!titulo.includes('Lido na mesa')) {
      problemas.push(`rodada ${rodada}: dado não veio da mesa (${titulo})`);
    }
    if (valor !== totalAntes) {
      problemas.push(`rodada ${rodada}: pastilha ${valor} ≠ total ${totalAntes}`);
    }
    console.log(`  rodada ${rodada}: ${valor} — ${titulo}`);
  }
}

await page.screenshot({ path: 'screenshots/leitura-final.png' });
await browser.close();

console.log('');
console.log(`Rodadas: ${RODADAS}`);
console.log(`Mesas que mudaram depois de assentar: ${trocas}`);
console.log(`Totais que mudaram: ${divergencias}`);
for (const p of problemas) console.log(`PROBLEMA: ${p}`);

if (trocas > 0 || divergencias > 0 || problemas.length > 0) process.exit(1);
console.log('OK: o número que apareceu no dado é o número que valeu.');
