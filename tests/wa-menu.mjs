// tests/wa-menu.mjs — Playwright, Chromium en /opt/pw-browsers.
// node tests/wa-menu.mjs   (arranca serve.mjs internamente)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

// En este sandbox Playwright viene preinstalado en /opt/pw-browsers con una
// versión fija; en CI, `npx playwright install --with-deps chromium` deja el
// binario en la ruta que Playwright espera. Usar la ruta fija solo si existe.
const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);

const BASE = 'http://localhost:4322';
let failures = 0;
const fail = (msg) => { console.error('  FAIL  ' + msg); failures++; };
const ok = (msg) => console.log('  ok    ' + msg);

function waitForServer() {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 8000;
    (function poll() {
      fetch(BASE + '/tasaciones/terrenos/').then(() => resolve()).catch(() => {
        if (Date.now() > deadline) reject(new Error('serve.mjs no respondió'));
        else setTimeout(poll, 200);
      });
    })();
  });
}

const server = spawn(process.execPath, ['serve.mjs'], { stdio: 'ignore' });
await waitForServer();

try {
  const browser = await chromium.launch({ executablePath });

  // ------------------------------------------------------------- con JS
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(BASE + '/tasaciones/terrenos/');

    const fab = page.locator('.wa-fab');
    await fab.click();
    const panel = page.locator('[data-wa-panel]');
    await panel.waitFor({ state: 'visible' });
    ok('FAB abre el panel');

    const current = page.locator('.wa-menu__option--current');
    await current.waitFor({ state: 'attached' });
    const isFocused = await current.evaluate((el) => el === document.activeElement);
    if (!isFocused) fail('la opción 1 no recibe el foco al abrir');
    else ok('la opción 1 recibe el foco al abrir');

    const href = await current.getAttribute('href');
    const decoded = decodeURIComponent(href.split('?text=')[1] || '');
    if (!decoded.includes('Tasación de Terrenos') || !decoded.includes('informe oficial')) {
      fail('el texto de la opción 1 no menciona el contexto/oferta esperados: ' + decoded);
    } else ok('href de la opción 1 correcto: ' + decoded);

    await page.keyboard.press('Escape');
    await panel.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
    const stillOpen = await page.locator('.wa-menu.is-open').count();
    if (stillOpen) fail('Escape no cierra el panel');
    else ok('Escape cierra el panel');

    await page.locator('.wa-pill').click();
    await panel.waitFor({ state: 'visible' });
    ok('la pill del header abre el panel');
    await page.close();
  }

  // ------------------------------------------------------------- 390px
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(BASE + '/tasaciones/terrenos/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    if (!overflow) fail('scroll horizontal a 390px');
    else ok('sin scroll horizontal a 390px');
    await page.locator('.wa-round').click();
    const panel = page.locator('[data-wa-panel]');
    await panel.waitFor({ state: 'visible' });
    const box = await panel.boundingBox();
    if (box.width > 390) fail('el panel WA no cabe a 390px');
    else ok('el panel WA cabe a 390px');
    await page.close();
  }

  // ------------------------------------------------------------- sin JS
  {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(BASE + '/tasaciones/terrenos/');
    const fabHref = await page.locator('.wa-fab').getAttribute('href');
    if (!fabHref || !fabHref.startsWith('https://wa.me/') || !fabHref.includes('text=')) {
      fail('sin JS, el FAB no es un <a> a wa.me con ?text=');
    } else {
      const decoded = decodeURIComponent(fabHref.split('?text=')[1]);
      if (!decoded.includes('Tasación de Terrenos')) fail('sin JS, el FAB no lleva el contexto de la página');
      else ok('sin JS, el FAB es un enlace directo con el contexto correcto');
    }
    const panelVisible = await page.locator('[data-wa-panel]').isVisible();
    if (panelVisible) fail('sin JS, el panel no debería verse');
    else ok('sin JS, el panel permanece oculto');
    await context.close();
  }

  await browser.close();
} finally {
  server.kill();
}

console.log('');
if (failures > 0) {
  console.error(`FAIL — ${failures} problema(s)`);
  process.exit(1);
} else {
  console.log('PASS');
}
