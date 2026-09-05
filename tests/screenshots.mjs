// tests/screenshots.mjs — capturas de PR, no bloqueantes.
// node tests/screenshots.mjs   (asume serve.mjs corriendo en :4322)
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const BASE = process.env.SCREENSHOTS_BASE || 'http://127.0.0.1:4322';
const OUT = 'docs/screenshots';
const PAGES = ['/', '/tasaciones/terrenos/', '/informes-periciales/', '/valuacion-para-vender/', '/contacto/'];
const WIDTHS = [{ label: '1440', width: 1440, height: 1400 }, { label: '390', width: 390, height: 1400 }];

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath });

for (const path of PAGES) {
  const name = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  for (const { label, width, height } of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${OUT}/${name}-${label}.png`, fullPage: true });
    await context.close();
    console.log('captured', `${name}-${label}.png`);
  }
}

await browser.close();
