// verify.mjs — gate de build. node verify.mjs
// Sin dependencias: node build-site.mjs + regex sobre los .html generados.
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { PRECIO_TXT } from './content.mjs';

let failures = 0;
const fail = (msg) => { console.error('  FAIL  ' + msg); failures++; };
const ok = (msg) => console.log('  ok    ' + msg);
const step = (msg) => console.log('\n== ' + msg + ' ==');

const routesDoc = JSON.parse(readFileSync('docs/routes.json', 'utf8'));
const { routes, copyDone } = routesDoc;

// ---------------------------------------------------------- 1. build limpio
step('build limpio');
execSync('node build-site.mjs', { stdio: 'inherit' });
try {
  execSync('git diff --exit-code -- "*.html"', { stdio: 'pipe' });
  ok('node build-site.mjs no deja cambios en *.html');
} catch {
  fail('build-site.mjs generó HTML distinto al commiteado — correr `node build-site.mjs` y commitear');
}

// ------------------------------------------------------------ 2. 13 rutas
step('rutas congeladas');
if (routes.length !== 13) fail(`docs/routes.json tiene ${routes.length} rutas, se esperaban 13`);
else ok('13 rutas en docs/routes.json');

function pathForSlug(slug) {
  return slug === '/' ? 'index.html' : slug.replace(/^\//, '') + 'index.html';
}

const htmlCache = new Map();
function readHtml(slug) {
  const p = pathForSlug(slug);
  if (!htmlCache.has(p)) {
    if (!existsSync(p)) { htmlCache.set(p, null); }
    else htmlCache.set(p, readFileSync(p, 'utf8'));
  }
  return htmlCache.get(p);
}

for (const r of routes) {
  const html = readHtml(r.slug);
  if (!html) { fail(`falta ${pathForSlug(r.slug)}`); continue; }
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)">/) || [])[1];
  if (title !== r.title) fail(`${r.slug}: title cambió — "${title}" != "${r.title}"`);
  if (canonical !== r.canonical) fail(`${r.slug}: canonical cambió — "${canonical}" != "${r.canonical}"`);
}
if (failures === 0) ok('title + canonical de las 13 rutas sin cambios');

// ---------------------------------------------------------------- 3. sitemap
step('sitemap.xml');
const sitemap = readFileSync('sitemap.xml', 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== 13) fail(`sitemap.xml tiene ${locs.length} <loc>, se esperaban 13`);
const expected = new Set(routes.map((r) => r.canonical));
for (const loc of locs) if (!expected.has(loc)) fail(`sitemap.xml tiene una URL fuera de docs/routes.json: ${loc}`);
if (locs.length === 13 && locs.every((l) => expected.has(l))) ok('sitemap.xml == 13 rutas de docs/routes.json');

// ------------------------------------------------------ 4. checks por página
step('checks por página (las 13 + 404 + gracias)');
const FORBIDDEN = [
  'RUC', 'matrícula N', 'Mat. ', 'años de experiencia', 'años en el mercado',
  'respondemos en', 'en minutos', 'testimonio', '★', 'habilitado por el BCP',
];
const allPagePaths = [...routes.map((r) => pathForSlug(r.slug)), '404.html', 'gracias.html'];

for (const p of allPagePaths) {
  if (!existsSync(p)) { fail(`falta ${p}`); continue; }
  const html = readFileSync(p, 'utf8');

  const h1s = [...html.matchAll(/<h1[^>]*>/g)];
  if (h1s.length !== 1) fail(`${p}: ${h1s.length} <h1> (debe haber exactamente 1)`);

  const waMenus = [...html.matchAll(/id="wa-menu"/g)];
  if (waMenus.length !== 1) fail(`${p}: ${waMenus.length} #wa-menu (debe haber exactamente 1)`);

  const waLinks = [...html.matchAll(/href="(https:\/\/wa\.me\/\d+\?text=[^"]*)"/g)].map((m) => m[1]);
  const menuLinks = [...html.matchAll(/data-wa-option="[^"]*"[^>]*href="([^"]*)"/g)];
  // los <a class="wa-menu__option" href="..." data-wa-option="..."> — orden de atributos: href antes que data-wa-option.
  const menuOptionLinks = [...html.matchAll(/<a class="wa-menu__option[^"]*" href="([^"]*)"/g)].map((m) => m[1]);
  if (menuOptionLinks.length !== 3) fail(`${p}: el panel WA tiene ${menuOptionLinks.length} opciones (debe tener 3)`);
  const ctx = (html.match(/data-page-context="([^"]*)"/) || [])[1] || '';
  for (const href of menuOptionLinks) {
    const text = decodeURIComponent(href.split('?text=')[1] || '');
    if (!text.includes(ctx)) fail(`${p}: una opción del menú WA no menciona el contexto "${ctx}": ${text}`);
  }

  const triggers = [...html.matchAll(/data-wa-trigger/g)];
  if (triggers.length < 2) fail(`${p}: solo ${triggers.length} [data-wa-trigger] (debe haber ≥ 2)`);

  const sectionTags = [...html.matchAll(/<section class="([^"]*)"/g)].map((m) => m[1]);
  const lastSection = sectionTags[sectionTags.length - 1] || '';
  if (p !== '404.html' && p !== 'gracias.html' && !lastSection.includes('cta-band')) {
    fail(`${p}: la última sección antes del footer es "${lastSection}", debería ser cta-band`);
  }

  const waNumberLines = [...html.matchAll(/var WA_NUMBER = /g)];
  if (waNumberLines.length !== 1) fail(`${p}: ${waNumberLines.length} líneas "var WA_NUMBER" (debe haber 1)`);

  if (/\bTODO\b/.test(html) || /lorem ipsum/i.test(html)) fail(`${p}: contiene TODO/lorem`);

  for (const bad of FORBIDDEN) {
    if (html.includes(bad)) fail(`${p}: contiene la cadena prohibida "${bad}"`);
  }

  const gsAmounts = [...html.matchAll(/Gs\.\s?([\d.,]+)/g)].map((m) => m[1].replace(/[.,]/g, ''));
  for (const amt of gsAmounts) {
    if (amt !== '800000' && amt !== '1500000') fail(`${p}: cifra en guaraníes no permitida: Gs. ${amt}`);
  }

  // ------------------------------------------------------- checks de copy
  if (copyDone) {
    const isVertical = /tasaciones\/(casas|departamentos|terrenos|corporativa|hipotecaria|locales-comerciales|campos)\//.test(p);
    const isInformes = p === 'informes-periciales/index.html';
    const heroSection = (html.match(/<section class="hero[\s\S]*?<\/section>/) || [''])[0];
    const ctaBandSection = (html.match(/<section class="cta-band[\s\S]*?<\/section>/) || [''])[0];
    const footerSection = (html.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];

    if (heroSection.includes(PRECIO_TXT) && !isInformes) fail(`${p}: el hero muestra el precio y no es /informes-periciales/`);
    if (ctaBandSection.includes(PRECIO_TXT)) fail(`${p}: la ctaBand muestra el precio`);
    if (footerSection.includes(PRECIO_TXT)) fail(`${p}: el footer muestra el precio`);
    if ((isVertical || isInformes) && !html.includes(PRECIO_TXT)) fail(`${p}: falta ${PRECIO_TXT} (priceBlock/FAQ de costo)`);
    if (html.includes('Te cotizamos por WhatsApp')) fail(`${p}: sigue "Te cotizamos por WhatsApp"`);

    const freeAsides = [...html.matchAll(/<div class="free-aside">[\s\S]*?<\/div>\s*<\/div>/g)].map((m) => m[0]);
    for (const fa of freeAsides) {
      if (!fa.includes('no es un informe oficial')) fail(`${p}: un free-aside no aclara "no es un informe oficial"`);
    }

    const firstPrimary = (html.match(/<main>[\s\S]*?class="btn btn--primary"[^>]*data-wa-open="([^"]*)"/) || [])[1];
    const expectedFirst = p === 'valuacion-para-vender/index.html' ? 'valoracion' : 'informe';
    if (firstPrimary && firstPrimary !== expectedFirst) fail(`${p}: el primer .btn--primary abre "${firstPrimary}", se esperaba "${expectedFirst}"`);

    if (/class="btn btn--primary"[^>]*href="\/valuacion-para-vender\/"/.test(html)) fail(`${p}: un .btn--primary enlaza a /valuacion-para-vender/`);
  }
}
if (failures === 0) ok('todas las páginas pasan los checks estructurales');
if (copyDone) ok('checks de copy activos (docs/routes.json copyDone=true)');
else console.log('  (checks de copy desactivados — docs/routes.json copyDone=false)');

// --------------------------------------------------------------- resultado
console.log('');
if (failures > 0) {
  console.error(`FAIL — ${failures} problema(s)`);
  process.exit(1);
} else {
  console.log('PASS');
}
