// Headless Chromium check: console errors + mobile horizontal scroll.
// Run against a live php -S server on 127.0.0.1:8080.
import { chromium } from 'playwright';

const pages = ['/', '/tasaciones/casas/', '/valuacion-para-vender/', '/contacto/'];
const base = 'http://127.0.0.1:8080';

const browser = await chromium.launch();
let failed = false;

for (const path of pages) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto(base + path, { waitUntil: 'networkidle' });
  const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);

  if (errors.length) {
    failed = true;
    console.log(`FAIL ${path}: console errors:`, errors);
  } else {
    console.log(`OK   ${path}: no console errors`);
  }
  if (hasHScroll) {
    failed = true;
    console.log(`FAIL ${path}: horizontal scroll at 390px`);
  } else {
    console.log(`OK   ${path}: no horizontal scroll at 390px`);
  }
  await context.close();
}

await browser.close();
process.exit(failed ? 1 : 0);
