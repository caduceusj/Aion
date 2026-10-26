/**
 * Auditoria de uso, no navegador de verdade.
 *
 *   npm run build && npm run preview      # em outro terminal
 *   node scripts/auditoria-de-uso.mjs [url]
 *
 * Percorre o menu, a Mesa com os cinco painéis e os diálogos, e o Códice
 * (capa, verbete, atlas, almanaque e a gaveta do índice) em três aparelhos —
 * um celular e um tablet simulados com toque, e um desktop com mouse — e
 * reprova se achar:
 *
 *   - alvo de toque abaixo de 44px (toque) ou 24px (mouse): WCAG 2.5.5 e 2.5.8;
 *   - controle sem nome acessível;
 *   - rolagem horizontal da página;
 *   - tela sem <main> ou sem <h1>, ou duas telas com o mesmo título de aba;
 *   - erro no console.
 *
 * É a prova de que `src/ui/styles/toque.css` está completo: se um controle
 * novo nascer pequeno, a auditoria o aponta pelo nome.
 *
 * Sai com código 1 se houver qualquer reprovação, para poder ir para a CI.
 */
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4173/';

/** Aparelhos. `toque` liga o ponteiro grosso, que é o que ativa `toque.css`. */
const APARELHOS = [
  { nome: 'celular 390×844', width: 390, height: 844, toque: true, minimo: 44 },
  { nome: 'celular pequeno 320×640', width: 320, height: 640, toque: true, minimo: 44 },
  { nome: 'tablet 820×1180', width: 820, height: 1180, toque: true, minimo: 44 },
  { nome: 'desktop 1440×900', width: 1440, height: 900, toque: false, minimo: 24 },
];

/**
 * O que fica fora da regra, e por quê. Cada exceção tem de caber numa frase.
 */
const EXCECOES_DE_TAMANHO = [
  // WCAG 2.5.8: um link no meio de uma frase não tem o tamanho que a frase não lhe dá.
  { seletor: '.codice-elo, .verbete__prosa a, .verbete__ficha dd a, p a, li a', motivo: 'link no meio do texto' },
  // WCAG 2.5.8, exceção "equivalente": as marcas do mapa (quarenta, de 9 a 13px) fazem o que
  // a lista de lugares ao lado também faz, com alvos grandes. No toque ganham 32px de área.
  { seletor: '.atlas__ponto', motivo: 'marca do mapa; a lista de lugares é o equivalente', minimo: 0, minimoNoToque: 32 },
  // O céu desenhado (SVG) escolhe o ponto de vista; os botões de "Olhando de" fazem o mesmo, grandes.
  { seletor: 'svg [role="button"], svg g[tabindex]', motivo: 'elemento do desenho do céu; os botões "Olhando de" são o equivalente', minimo: 0 },
];

const navegador = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

const reprovacoes = [];
const titulosPorTela = new Map();
let verificadas = 0;

/** Roda no navegador: mede o que está à vista e devolve só o que reprova. */
function medir({ minimo, excecoes, exigeMain }) {
  const visivel = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width === 0 || r.height === 0) return false;
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return false;
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      if (getComputedStyle(p).visibility === 'hidden') return false;
    }
    return true;
  };

  const rotulos = (el) => (el.labels ? [...el.labels].map((l) => l.textContent) : []);
  const nome = (el) =>
    (
      el.getAttribute('aria-label') ||
      (el.getAttribute('aria-labelledby') &&
        el
          .getAttribute('aria-labelledby')
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent ?? '')
          .join(' ')) ||
      rotulos(el).join(' ') ||
      el.textContent ||
      el.getAttribute('title') ||
      el.getAttribute('placeholder') ||
      ''
    )
      .replace(/\s+/g, ' ')
      .trim();

  const quem = (el) => {
    const classe = typeof el.className === 'string' && el.className ? `.${el.className.split(' ')[0]}` : '';
    return `${el.tagName.toLowerCase()}${classe} "${nome(el).slice(0, 28)}"`;
  };

  // Um campo dentro de um comprimido (label) é tocado pelo comprimido inteiro, e
  // um <label> repassa o clique ao controle que rotula — caixa de seleção,
  // interruptor, campo. O que se mede é o maior entre o controle e o seu rótulo.
  const areaDeToque = (el) => {
    const r = el.getBoundingClientRect();
    let w = r.width;
    let h = r.height;
    const rotulos = new Set([...(el.labels ?? []), el.closest('label')].filter(Boolean));
    for (const rotulo of rotulos) {
      const rr = rotulo.getBoundingClientRect();
      w = Math.max(w, rr.width);
      h = Math.max(h, rr.height);
    }
    return { w, h };
  };

  const interativos = [
    ...document.querySelectorAll(
      'button, a[href], input:not([type=hidden]), select, textarea, summary, [role="button"], [role="tab"], [role="switch"], [role="slider"]',
    ),
  ].filter(visivel);

  const pequenos = [];
  for (const el of interativos) {
    const excecao = excecoes.find((e) => el.matches(e.seletor));
    const alvo = excecao ? (minimo >= 44 ? excecao.minimoNoToque ?? excecao.minimo : excecao.minimo) : minimo;
    if (alvo === 0) continue;
    const { w, h } = areaDeToque(el);
    // Meio pixel de folga: bordas fracionárias não são defeito de projeto.
    if (w < alvo - 0.5 || h < alvo - 0.5) pequenos.push(`${quem(el)} ${Math.round(w)}×${Math.round(h)}`);
  }

  const semNome = interativos.filter((el) => !nome(el)).map(quem);

  const rolaDeLado = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;

  return {
    pequenos: [...new Set(pequenos)],
    semNome: [...new Set(semNome)],
    rolaDeLado,
    mains: document.querySelectorAll('main').length,
    h1: [...document.querySelectorAll('h1')].filter(visivel).length,
    titulo: document.title,
    exigeMain,
  };
}

async function auditar(page, aparelho, cena, { exigeMain = true } = {}) {
  // Espera as animações de entrada (260ms) terminarem: medir no meio delas
  // dá caixas escaladas e falsos "fora da tela".
  await page.waitForTimeout(450);
  const r = await page.evaluate(medir, { minimo: aparelho.minimo, excecoes: EXCECOES_DE_TAMANHO, exigeMain });
  const onde = `${aparelho.nome} · ${cena}`;
  verificadas += 1;

  for (const item of r.pequenos) reprovacoes.push(`${onde}: alvo pequeno — ${item}`);
  for (const item of r.semNome) reprovacoes.push(`${onde}: sem nome acessível — ${item}`);
  if (r.rolaDeLado) reprovacoes.push(`${onde}: a página rola de lado`);
  if (exigeMain) {
    if (r.mains !== 1) reprovacoes.push(`${onde}: esperava 1 <main>, achou ${r.mains}`);
    if (r.h1 < 1) reprovacoes.push(`${onde}: sem <h1> à vista`);
  }

  const chave = cena.split(' · ')[0];
  if (['menu', 'mesa', 'códice (capa)', 'códice (verbete)'].includes(chave)) {
    const lista = titulosPorTela.get(aparelho.nome) ?? new Map();
    lista.set(chave, r.titulo);
    titulosPorTela.set(aparelho.nome, lista);
  }
}

async function percorrer(aparelho) {
  const contexto = await navegador.newContext({
    viewport: { width: aparelho.width, height: aparelho.height },
    deviceScaleFactor: aparelho.toque ? 2 : 1,
    isMobile: aparelho.toque && aparelho.width < 700,
    hasTouch: aparelho.toque,
  });
  const page = await contexto.newPage();
  // As animações de entrada escalam as caixas por alguns centésimos — com os
  // aparelhos rodando juntos, a medição pegava o 43,4px de um botão de 44px
  // ainda entrando. Congela o movimento: o que se mede é o desenho final.
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const estilo = document.createElement('style');
      estilo.textContent =
        '*, *::before, *::after { animation: none !important; transition: none !important; }';
      document.head.appendChild(estilo);
    });
  });
  page.on('console', (m) => {
    // O aviso de depreciação do three.js (sombra suave) não é do app.
    if (m.type() === 'error') reprovacoes.push(`${aparelho.nome}: console — ${m.text().slice(0, 160)}`);
  });
  page.on('pageerror', (e) => reprovacoes.push(`${aparelho.nome}: erro de página — ${e.message}`));

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
  } catch {
    console.error(`Não consegui abrir ${url}. Suba o app antes: npm run build && npm run preview`);
    process.exit(2);
  }


  // ---- menu
  await auditar(page, aparelho, 'menu');

  // ---- mesa
  await page.getByRole('button', { name: /A Mesa/ }).first().click();
  await page.waitForTimeout(900);
  await auditar(page, aparelho, 'mesa');

  // ---- diálogos da mesa
  await page.getByRole('button', { name: 'Como escrever uma rolagem' }).click();
  await auditar(page, aparelho, 'mesa · ajuda de notação', { exigeMain: false });
  await page.keyboard.press('Escape');
  await page.keyboard.press('?');
  await auditar(page, aparelho, 'mesa · atalhos de teclado', { exigeMain: false });
  await page.keyboard.press('Escape');

  // ---- painéis
  const abrirPaineis = page.locator('.cabecalho__paineis');
  for (const rotulo of ['Ficha', 'Histórico', 'Atalhos', 'Mesa', 'Ajustes']) {
    if ((await abrirPaineis.count()) && (await abrirPaineis.isVisible()) && !(await page.locator('.trilho').count())) {
      await abrirPaineis.click();
      await page.waitForTimeout(300);
    }
    const aba = page.locator(`.trilho__aba[aria-label="${rotulo}"]`);
    const topo = page.locator('.cabecalho__nav').getByRole('button', { name: rotulo, exact: true });
    if ((await aba.count()) && (await aba.isVisible())) await aba.click();
    else if ((await topo.count()) && (await topo.isVisible())) await topo.click();
    else continue;
    await page.waitForTimeout(350);
    await auditar(page, aparelho, `painel ${rotulo}`);
  }

  // Ficha em modo de edição: é onde ficam os campos pequenos.
  const aba = page.locator('.trilho__aba[aria-label="Ficha"]');
  const topoFicha = page.locator('.cabecalho__nav').getByRole('button', { name: 'Ficha', exact: true });
  if ((await aba.count()) && (await aba.isVisible())) await aba.click();
  else if ((await topoFicha.count()) && (await topoFicha.isVisible())) await topoFicha.click();
  const editar = page.getByRole('button', { name: 'Editar', exact: true });
  if (await editar.count()) {
    await editar.first().click();
    await auditar(page, aparelho, 'painel Ficha (edição)');
  }

  // Editor de atalho.
  const atalhos = page.locator('.trilho__aba[aria-label="Atalhos"]');
  const topoAtalhos = page.locator('.cabecalho__nav').getByRole('button', { name: 'Atalhos', exact: true });
  if ((await atalhos.count()) && (await atalhos.isVisible())) await atalhos.click();
  else if ((await topoAtalhos.count()) && (await topoAtalhos.isVisible())) await topoAtalhos.click();
  await page.waitForTimeout(300);
  const novo = page.getByRole('button', { name: /Novo|Criar o primeiro/ });
  if (await novo.count()) {
    await novo.first().click();
    await auditar(page, aparelho, 'editor de atalho', { exigeMain: false });
    await page.keyboard.press('Escape');
  }

  // ---- códice
  await page.goto(`${url}#codice/`, { waitUntil: 'networkidle' });
  await auditar(page, aparelho, 'códice (capa)');

  await page.goto(`${url}#codice/arran-herrys`, { waitUntil: 'networkidle' });
  await auditar(page, aparelho, 'códice (verbete)');

  // A gaveta do índice só existe como controle onde o índice não cabe ao lado.
  const alternar = page.getByRole('button', { name: 'Índice' });
  if (await alternar.isVisible()) {
    await alternar.click();
    await auditar(page, aparelho, 'códice (índice aberto)');
    await page.keyboard.press('Escape');
  }

  await page.goto(`${url}#codice/@atlas`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await auditar(page, aparelho, 'códice (atlas)');

  await page.goto(`${url}#codice/@calendario`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await auditar(page, aparelho, 'códice (almanaque)');

  await contexto.close();
}

// Cada aparelho é independente: em paralelo a auditoria leva um quarto do tempo.
await Promise.all(APARELHOS.map(percorrer));

await navegador.close();

// ---- títulos de aba: cada tela diz onde está
for (const [aparelho, mapa] of titulosPorTela) {
  const valores = [...mapa.values()];
  if (new Set(valores).size !== valores.length) {
    reprovacoes.push(`${aparelho}: duas telas com o mesmo título de aba — ${JSON.stringify([...mapa])}`);
  }
}

if (reprovacoes.length > 0) {
  const unicas = [...new Set(reprovacoes)];
  console.error(`\n${unicas.length} reprovação(ões) em ${verificadas} telas:\n`);
  for (const r of unicas) console.error(` ✗ ${r}`);
  process.exit(1);
}

console.log(`✓ ${verificadas} telas, nenhuma reprovação.`);
