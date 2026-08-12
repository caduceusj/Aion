/**
 * Amplia o dado assentado para conferir, a olho, se a face de cima é o total.
 *
 *   node scripts/verifica-face.mjs [url]
 *
 * Salva um recorte apertado em volta do dado, em alta resolução, junto com o
 * total que o app calculou. Se a face de cima não for esse número, é porque a
 * leitura discorda do que o jogador enxerga.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://localhost:4173/';
const NOTACAO = process.argv[3] ?? '1d20';
const RODADAS = Number(process.argv[4] ?? 4);

await mkdir('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

const page = await browser.newPage({
  // Largura suficiente para o trilho do histórico já estar aberto.
  viewport: { width: 1280, height: 860 },
  deviceScaleFactor: 3,
});

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// O overlay do total fica por cima do canvas e some sozinho — atrapalha tanto
// a foto quanto a comparação. Fora.
await page.addStyleTag({ content: '.resultado { display: none !important; }' });

for (let rodada = 1; rodada <= RODADAS; rodada += 1) {
  await page.getByLabel('Notação da rolagem').fill(NOTACAO);
  await page.getByLabel('Notação da rolagem').press('Enter');

  await page.waitForFunction(
    (esperado) => document.querySelectorAll('.entrada').length >= esperado,
    rodada,
    { timeout: 15000 },
  );
  await page.waitForTimeout(600);

  const total = (
    await page.locator('.entrada__total').first().evaluate((el) => el.textContent)
  ).trim();

  await page.locator('canvas.palco__canvas').screenshot({
    path: `screenshots/face-${NOTACAO.replace(/\W/g, '')}-${rodada}-total-${total}.png`,
  });
  console.log(`rodada ${rodada}: total ${total}`);
}

await browser.close();
