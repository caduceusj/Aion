/**
 * Confere o Códice no navegador de verdade.
 *
 *   node scripts/verifica-codice.mjs [url]
 *
 * Abre a capa, um verbete, o atlas e a busca; tira foto de cada um e reprova
 * se aparecer erro de console, link morto na prosa ou verbete sem conteúdo.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://localhost:4173/';
await mkdir('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

const problemas = [];

for (const vp of [
  { nome: 'desktop', width: 1440, height: 900 },
  { nome: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  page.on('console', (m) => {
    if (m.type() === 'error') problemas.push(`[${vp.nome}] console: ${m.text()}`);
  });
  page.on('pageerror', (e) => problemas.push(`[${vp.nome}] pageerror: ${e.message}`));

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Abre o códice pela aba do cabeçalho.
  await page.getByRole('button', { name: 'Códice' }).first().click();
  await page.waitForSelector('.codice', { timeout: 8000 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `screenshots/codice-${vp.nome}-capa.png` });

  // Estouro horizontal é o defeito de layout que passa despercebido em
  // desktop e arruína o celular. Medido, não olhado.
  const estouro = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const fora = [];
    document.querySelectorAll('.codice, .codice *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > vw + 1) fora.push(`${el.className.toString().split(' ')[0]} (${Math.round(r.width)}px)`);
    });
    return { vw, fora: [...new Set(fora)].slice(0, 6), scrollW: document.documentElement.scrollWidth };
  });
  if (estouro.fora.length > 0) {
    problemas.push(`[${vp.nome}] estoura a viewport (${estouro.vw}px): ${estouro.fora.join(', ')}`);
  }

  const verbetes = await page.locator('.indice__contagem').innerText();
  console.log(`[${vp.nome}] ${verbetes.trim()}`);

  // Em tela estreita o índice é gaveta.
  const abrirIndice = page.getByRole('button', { name: 'Índice' });
  if (await abrirIndice.isVisible().catch(() => false)) await abrirIndice.click();

  // Um verbete de personagem — o pedido central do usuário.
  await page.getByRole('button', { name: 'Ayren Herrys IV', exact: true }).first().click();
  await page.waitForSelector('.verbete', { timeout: 8000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `screenshots/codice-${vp.nome}-verbete.png` });

  const titulo = (await page.locator('.verbete__titulo').innerText()).trim();
  const paragrafos = await page.locator('.verbete__prosa p').count();
  const elos = await page.locator('.verbete__prosa .codice-elo').count();
  console.log(`[${vp.nome}] verbete "${titulo}": ${paragrafos} parágrafos, ${elos} elos`);
  if (paragrafos === 0) problemas.push(`[${vp.nome}] verbete sem prosa`);
  if (elos === 0) problemas.push(`[${vp.nome}] verbete sem nenhum elo — o wiki não liga nada`);

  // Marcação vazando na tela é o defeito mais feio possível aqui.
  const corpo = await page.locator('.codice__leitura').innerText();
  if (corpo.includes('[[') || corpo.includes(']]')) {
    problemas.push(`[${vp.nome}] marcação [[..]] vazou para a tela`);
  }

  // Seguir um elo tem que trocar o verbete.
  const antes = titulo;
  await page.locator('.verbete__prosa .codice-elo').first().click();
  await page.waitForTimeout(600);
  const depois = (await page.locator('.verbete__titulo').innerText()).trim();
  if (antes === depois) problemas.push(`[${vp.nome}] clicar num elo não navegou`);
  else console.log(`[${vp.nome}] elo: ${antes} → ${depois}`);

  // O atlas.
  if (await abrirIndice.isVisible().catch(() => false)) await abrirIndice.click();
  await page.getByRole('button', { name: /O Atlas/ }).first().click();
  await page.waitForSelector('.atlas', { timeout: 8000 });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `screenshots/codice-${vp.nome}-atlas.png` });

  const pontos = await page.locator('.atlas__ponto').count();
  console.log(`[${vp.nome}] atlas: ${pontos} pontos`);
  if (pontos === 0) problemas.push(`[${vp.nome}] atlas sem pontos`);

  // Busca.
  const busca = page.getByLabel('Buscar no códice');
  if (await busca.isVisible().catch(() => false)) {
    await busca.fill('keaton');
    await page.waitForTimeout(400);
    const achados = await page.locator('.indice__item').count();
    console.log(`[${vp.nome}] busca "keaton": ${achados} achados`);
    if (achados === 0) problemas.push(`[${vp.nome}] busca por "keaton" não achou nada`);
    await page.screenshot({ path: `screenshots/codice-${vp.nome}-busca.png` });
  }

  await page.close();
}

await browser.close();

console.log('');
for (const p of problemas) console.log(`PROBLEMA: ${p}`);
if (problemas.length > 0) process.exit(1);
console.log('OK: o códice abre, liga e navega.');
