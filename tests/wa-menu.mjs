// tests/wa-menu.mjs — Playwright, Chromium en /opt/pw-browsers.
// node tests/wa-menu.mjs   (arranca serve.mjs internamente)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { MESSAGES, menuRows } from '../content/wa-messages.mjs';

// En este sandbox Playwright viene preinstalado en /opt/pw-browsers con una
// versión fija; en CI, `npx playwright install --with-deps chromium` deja el
// binario en la ruta que Playwright espera. Usar la ruta fija solo si existe.
const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined);

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4322';
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
    // wa.me responde con un stub: el test verifica a dónde apunta la pestaña
    // nueva, no la disponibilidad de WhatsApp (CI y sandboxes pueden bloquearlo).
    await page.context().route(/^https:\/\/(wa\.me|api\.whatsapp\.com)\//, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: 'wa stub' }));
    await page.goto(BASE + '/tasaciones/terrenos/');

    const fab = page.locator('.wa-fab');
    await fab.click();
    const panel = page.locator('[data-wa-panel]');
    await panel.waitFor({ state: 'visible' });
    ok('FAB abre el panel');

    const options = page.locator('.wa-menu__option');
    const count = await options.count();
    const wantRows = menuRows('/tasaciones/terrenos/').length;
    if (count !== wantRows) fail(`el panel tiene ${count} opciones (debe tener ${wantRows})`);
    else ok(`el panel tiene ${wantRows} opciones`);

    const current = page.locator('.wa-menu__option--current');
    await current.waitFor({ state: 'attached' });
    const isFocused = await current.evaluate((el) => el === document.activeElement);
    if (!isFocused) fail('la opción 1 no recibe el foco al abrir');
    else ok('la opción 1 recibe el foco al abrir');

    const href = await current.getAttribute('href');
    const decoded = decodeURIComponent(href.split('?text=')[1] || '');
    if (decoded !== MESSAGES['/tasaciones/terrenos/'].compraventa) {
      fail('el texto de la opción 1 no es MESSAGES[terrenos].compraventa: ' + decoded);
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
      { path: '/tasaciones/hipotecaria/', expected: 'hipotecaria' },
      { path: '/tasaciones/franja-de-dominio/', expected: 'franja' },
      { path: '/', expected: 'compraventa' },
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

  // Header: la finalidad debe coincidir en desktop y móvil, no solo en FAB.
  for (const c of [
    { path: '/', expected: 'compraventa' },
    { path: '/tasaciones/hipotecaria/', expected: 'hipotecaria' },
    { path: '/tasaciones/corporativa/', expected: 'empresa' },
    { path: '/tasaciones/franja-de-dominio/', expected: 'franja' },
    { path: '/valuacion-para-vender/', expected: 'venta' },
  ]) {
    for (const width of [1280, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(BASE + c.path);
      await page.locator(width === 1280 ? '.wa-pill' : '.wa-round').click();
      const current = page.locator('.wa-menu__option--current');
      const selected = await current.getAttribute('data-wa-option');
      const href = await current.getAttribute('href');
      if (selected !== c.expected || new URL(href).searchParams.get('text') !== MESSAGES[c.path][c.expected]) {
        fail(`${c.path} ${width}px: el header seleccionó ${selected}, se esperaba ${c.expected}`);
      } else ok(`${c.path} ${width}px: header conserva finalidad y mensaje (${c.expected})`);
      await page.close();
    }
  }

  // Contacto: el select largo no debe ensanchar el grid en móviles.
  for (const width of [320, 375, 390, 768, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(BASE + '/contacto/');
    const fits = await page.evaluate(() => {
      const controls = [...document.querySelectorAll('form input:not([type="hidden"]):not([name="website"]), form select, form textarea')];
      return document.documentElement.scrollWidth <= innerWidth + 1 && controls.every((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.left >= 0 && r.right <= innerWidth + 1;
      });
    });
    if (!fits) fail(`/contacto/ ${width}px: scroll horizontal o campos fuera del viewport`);
    else ok(`/contacto/ ${width}px: todos los campos caben sin scroll horizontal`);
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

  // ------------------------------------------- informe 2026-10-12 §6/§7/§8/§9
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(BASE + '/tasaciones/terrenos/');
    const fab = page.locator('.wa-fab');
    // §6: cerrar y reabrir dentro de los 200 ms no debe dejar el panel oculto.
    await fab.click();
    await page.locator('[data-wa-panel]').waitFor({ state: 'visible' });
    await fab.click();
    await page.waitForTimeout(50);
    await fab.click();
    await page.waitForTimeout(400);
    const reopened = await page.evaluate(() => { const m = document.querySelector('[data-wa-menu]'); return !m.hidden && m.classList.contains('is-open'); });
    if (!reopened) fail('cerrar y reabrir rápido deja el panel WA oculto');
    else ok('cerrar y reabrir rápido deja el panel WA visible');
    // §8: un viaje = un wa_menu_open + un wa_outbound_click, nunca wa_click.
    const events = await page.evaluate(() => window.dataLayer.map((e) => e && e.event).filter(Boolean));
    if (events.includes('wa_click')) fail('dataLayer todavía recibe wa_click');
    const opens = events.filter((e) => e === 'wa_menu_open').length;
    if (opens !== 2) fail(`se esperaban 2 wa_menu_open (abrir, reabrir), hubo ${opens}`);
    else ok('el trigger emite wa_menu_open solo al abrir');
    await Promise.all([page.context().waitForEvent('page', { timeout: 3000 }).then((p) => p.close()).catch(() => null), page.locator('.wa-menu__option').first().click()]);
    const outbound = await page.evaluate(() => window.dataLayer.filter((e) => e && e.event === 'wa_outbound_click').length);
    if (outbound !== 1) fail(`una opción del menú emitió ${outbound} wa_outbound_click`);
    else ok('la opción del menú emite wa_outbound_click');
    // §9: el skip link es lo primero al tabular y lleva el foco a <main>.
    await page.goto(BASE + '/');
    await page.keyboard.press('Tab');
    const skip = await page.evaluate(() => document.activeElement && document.activeElement.className);
    if (skip !== 'skip-link') fail('el primer Tab no llega al skip link');
    else {
      await page.keyboard.press('Enter');
      const mainFocused = await page.evaluate(() => document.activeElement && document.activeElement.id);
      if (mainFocused !== 'contenido') fail('el skip link no lleva el foco a <main id="contenido">');
      else ok('skip link: primer Tab y foco en <main>');
    }
    // §8: form_submit en el formulario de contacto.
    await page.goto(BASE + '/contacto/');
    await page.evaluate(() => { const f = document.querySelector('form[action="/lead-forward.php"]'); f.addEventListener('submit', (e) => e.preventDefault()); f.dispatchEvent(new Event('submit', { cancelable: true })); });
    const submits = await page.evaluate(() => window.dataLayer.filter((e) => e && e.event === 'form_submit').length);
    if (submits !== 1) fail('el formulario no emite form_submit');
    else ok('el formulario emite form_submit');
    await page.close();
  }

  // §7 a 390px: Escape / click fuera cierran el menú móvil; diálogo WA con inert y scroll bloqueado.
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(BASE + '/tasaciones/terrenos/');
    const burger = page.locator('[data-hdr-burger]');
    const navOpen = () => page.evaluate(() => document.querySelector('[data-hdr-panel]').classList.contains('is-open'));
    await burger.click();
    if (!(await navOpen())) fail('la hamburguesa no abre el menú móvil');
    await page.keyboard.press('Escape');
    const focusBack = await page.evaluate(() => document.activeElement && document.activeElement.hasAttribute('data-hdr-burger'));
    if ((await navOpen()) || !focusBack) fail('Escape no cierra el menú móvil o no devuelve el foco a la hamburguesa');
    else ok('Escape cierra el menú móvil y devuelve el foco a la hamburguesa');
    await burger.click();
    await page.mouse.click(200, 800);
    if (await navOpen()) fail('click fuera no cierra el menú móvil');
    else ok('click fuera cierra el menú móvil');
    await page.locator('.wa-round').click();
    await page.locator('[data-wa-panel]').waitFor({ state: 'visible' });
    const locked = await page.evaluate(() => ({
      body: document.body.classList.contains('is-locked') && getComputedStyle(document.body).overflow === 'hidden',
      inert: ['header', 'main', 'footer'].every((t) => document.querySelector('body > ' + t).inert),
    }));
    if (!locked.body || !locked.inert) fail(`diálogo WA abierto: scroll bloqueado=${locked.body}, inert=${locked.inert}`);
    else ok('diálogo WA abierto: fondo inert y scroll bloqueado');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const released = await page.evaluate(() => !document.body.classList.contains('is-locked') && !document.querySelector('body > main').inert && document.activeElement && document.activeElement.classList.contains('wa-round'));
    if (!released) fail('al cerrar el diálogo WA el fondo sigue bloqueado o el foco no vuelve al trigger');
    else ok('al cerrar el diálogo WA se libera el fondo y el foco vuelve al trigger');
    // §10: la foto del hero conserva su proporción con width/height.
    const ratio = await page.evaluate(() => { const r = document.querySelector('.hero__pic img').getBoundingClientRect(); return r.width / r.height; });
    if (Math.abs(ratio - 4 / 3) > 0.02) fail(`la foto del hero se deformó (proporción ${ratio.toFixed(2)})`);
    else ok('la foto del hero mantiene 4:3 con width/height');
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
      if (decoded !== MESSAGES['/tasaciones/terrenos/'].compraventa) fail('sin JS, el FAB no lleva el mensaje de la página');
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
