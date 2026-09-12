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

    const options = page.locator('.wa-menu__option');
    const count = await options.count();
    if (count !== 5) fail(`el panel tiene ${count} opciones (debe tener 5)`);
    else ok('el panel tiene 5 opciones');

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

    // stacking: el subtítulo debe quedar debajo del título, no al lado (§4 fix).
    // El título puede envolver a 2 líneas (labels largos): se compara el INICIO
    // del subtítulo contra el INICIO del título (no el bottom, que se solapa
    // por line-height cuando el título envuelve) para detectar el bug real —
    // título y subtítulo como dos columnas lado a lado (misma `y`).
    const first = options.first();
    const titleBox = await first.locator('.wa-menu__opt-title').boundingBox();
    const subBox = await first.locator('.wa-menu__opt-sub').boundingBox();
    if (!titleBox || !subBox || subBox.y <= titleBox.y + 4 || subBox.x !== titleBox.x) {
      fail('título y subtítulo del menú WA no están apilados verticalmente');
    } else ok('título y subtítulo apilados correctamente');

    await page.keyboard.press('Escape');
    await panel.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
    const stillOpen = await page.locator('.wa-menu.is-open').count();
    if (stillOpen) fail('Escape no cierra el panel');
    else ok('Escape cierra el panel');

    // audit 2026-09-11 §2.3: en desktop, click en una opción del menú abría
    // WhatsApp Web en la misma pestaña y sacaba al visitante del sitio.
    await fab.click();
    await panel.waitFor({ state: 'visible' });
    const [popup] = await Promise.all([
      page.context().waitForEvent('page', { timeout: 3000 }).catch(() => null),
      options.first().click(),
    ]);
    if (!popup) fail('un click en la opción 1 del menú WA no abre pestaña nueva (falta target="_blank")');
    else {
      const popupUrl = popup.url();
      if (!popupUrl.startsWith('https://wa.me/') && !popupUrl.startsWith('https://api.whatsapp.com/')) {
        fail('la pestaña nueva del menú WA no apunta a WhatsApp: ' + popupUrl);
      } else ok('la opción del menú WA abre en pestaña nueva: ' + popupUrl);
      await popup.close();
    }

    await page.locator('.wa-pill').click();
    await panel.waitFor({ state: 'visible' });
    ok('la pill del header abre el panel');
    await page.close();
  }

  // ------------------------------------------------------------- foco por página
  {
    const cases = [
      { path: '/tasaciones/hipotecaria/', expected: 'credito' },
      { path: '/tasaciones/franja-de-dominio/', expected: 'consulta' },
      { path: '/', expected: 'informe' },
    ];
    for (const c of cases) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      await page.goto(BASE + c.path);
      await page.locator('.wa-fab').click();
      const current = page.locator('.wa-menu__option--current');
      await current.waitFor({ state: 'attached' });
      const dataOption = await current.getAttribute('data-wa-option');
      if (dataOption !== c.expected) fail(`${c.path}: opción con foco es "${dataOption}", se esperaba "${c.expected}"`);
      else ok(`${c.path}: opción con foco correcta (${c.expected})`);
      await page.close();
    }
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
    const panelHeight = await panel.evaluate((el) => el.scrollHeight);
    if (panelHeight > 844) fail(`el panel WA (${panelHeight}px) no cabe sin scroll interno en 390×844`);
    else ok('el panel WA cabe sin scroll interno en 390×844');
    await page.close();
  }

  // ------------------------------------------------------------- FAB vs. hero__freelink en móvil
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(BASE + '/');
    const fabBox = await page.locator('.wa-fab').boundingBox();
    const freelink = page.locator('.hero__freelink a');
    if (await freelink.count()) {
      const linkBox = await freelink.boundingBox();
      const intersects = fabBox && linkBox && !(fabBox.x > linkBox.x + linkBox.width || fabBox.x + fabBox.width < linkBox.x || fabBox.y > linkBox.y + linkBox.height || fabBox.y + fabBox.height < linkBox.y);
      if (intersects) fail('el FAB se superpone con la línea chica del hero en móvil');
      else ok('el FAB no se superpone con la línea chica del hero en móvil');
    }
    await page.close();
  }

  // ------------------------------------------------------------- hipotecaria: hero móvil sobre el fold
  {
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    await page.goto(BASE + '/tasaciones/hipotecaria/');
    const primary = page.locator('.hero [data-ev-loc="hero"]').first();
    const primaryBox = await primary.boundingBox();
    const fabBox = await page.locator('.wa-fab').boundingBox();
    if (!primaryBox) fail('/tasaciones/hipotecaria/: no se encontró el botón primario del hero');
    else {
      if (primaryBox.y + primaryBox.height > 812 - 72) {
        fail(`/tasaciones/hipotecaria/: el botón primario del hero termina en y=${Math.round(primaryBox.y + primaryBox.height)}, debería quedar sobre el fold (<= 740) a 375×812`);
      } else ok('/tasaciones/hipotecaria/: el botón primario del hero queda sobre el fold a 375×812');
      const intersects = fabBox && !(fabBox.x > primaryBox.x + primaryBox.width || fabBox.x + fabBox.width < primaryBox.x || fabBox.y > primaryBox.y + primaryBox.height || fabBox.y + fabBox.height < primaryBox.y);
      if (intersects) fail('/tasaciones/hipotecaria/: el FAB se superpone con el botón primario del hero a 375×812');
      else ok('/tasaciones/hipotecaria/: el FAB no se superpone con el botón primario del hero');
    }
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
