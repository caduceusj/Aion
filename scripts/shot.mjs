/**
 * Captura telas do Aion para verificação visual.
 *
 *   node scripts/shot.mjs [url] [saida]
 *
 * Sobe nada por conta própria — aponte para um `npm run preview` já rodando.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://localhost:4173/';
const outDir = process.argv[3] ?? 'screenshots';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 900, height: 1200 },
  { name: 'mobile', width: 390, height: 844 },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

const problems = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`[${vp.name}] console: ${m.text()}`);
  });
  page.on('pageerror', (e) => problems.push(`[${vp.name}] pageerror: ${e.message}`));

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outDir}/${vp.name}-inicial.png` });

  // Rola um d20 e espera os dados assentarem.
  const d20 = page.getByRole('button', { name: /d20/i }).first();
  if (await d20.count()) {
    await d20.click();
    await page.waitForTimeout(4500);
    await page.screenshot({ path: `${outDir}/${vp.name}-rolagem.png` });
  } else {
    problems.push(`[${vp.name}] botão d20 não encontrado`);
  }

  // Uma expressão com vários dados e descarte, que é onde a mesa fica cheia.
  const campo = page.getByLabel('Notação da rolagem');
  await campo.fill('4d6kh3+2[Atributos]');
  await campo.press('Enter');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${outDir}/${vp.name}-varios-dados.png` });

  // Histórico com o detalhamento aberto. Em telas largas o trilho já está
  // visível, e clicar no botão o fecharia — por isso a checagem antes.
  const cartao = page.locator('.entrada__cabecalho').first();
  if ((await cartao.count()) === 0) {
    await page.locator('.cabecalho__nav button[aria-label="Histórico"]').click();
    await page.waitForTimeout(400);
  }
  if (await cartao.count()) {
    await cartao.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${outDir}/${vp.name}-detalhamento.png` });
  } else {
    problems.push(`[${vp.name}] nenhuma entrada de histórico encontrada`);
  }

  await page.close();
}

await browser.close();

if (problems.length) {
  console.error('PROBLEMAS:\n' + problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Capturas geradas em', outDir);
}
