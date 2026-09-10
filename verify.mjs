// verify.mjs — gate de build. node verify.mjs
// Sin dependencias: node build-site.mjs + regex sobre los .html generados.
// v3 (prompts/v3-credenciales-y-finalidades.md §7): 15 rutas, menú WA de 5
// opciones, cadenas canónicas de credenciales/plazo/IVA, sin datos inventados.
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { PRECIO_TXT, CRED_CSJ, CRED_ARQ, PLAZO_TXT, IVA_TXT, FACTURA_TXT } from './content.mjs';

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

// ------------------------------------------------------------ 2. 15 rutas
step('rutas congeladas');
if (routes.length !== 15) fail(`docs/routes.json tiene ${routes.length} rutas, se esperaban 15`);
else ok('15 rutas en docs/routes.json');

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
  if (title && title.length > 60) fail(`${r.slug}: title tiene ${title.length} caracteres (máx 60)`);
}
if (failures === 0) ok('title + canonical de las 15 rutas sin cambios, títulos ≤ 60');

// ---------------------------------------------------------------- 3. sitemap
step('sitemap.xml');
const sitemap = readFileSync('sitemap.xml', 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
if (locs.length !== 15) fail(`sitemap.xml tiene ${locs.length} <loc>, se esperaban 15`);
const expected = new Set(routes.map((r) => r.canonical));
for (const loc of locs) if (!expected.has(loc)) fail(`sitemap.xml tiene una URL fuera de docs/routes.json: ${loc}`);
if (locs.length === 15 && locs.every((l) => expected.has(l))) ok('sitemap.xml == 15 rutas de docs/routes.json');

// ------------------------------------------------------ 4. checks por página
step('checks por página (las 15 + 404 + gracias)');
// Siempre prohibidas (no dependen de la campaña v3 de copy).
const FORBIDDEN_ALWAYS = [
  'RUC', 'años de experiencia', 'años en el mercado',
  'respondemos en', 'en minutos', 'testimonio', '★', 'habilitado por el BCP',
];
// Nuevas en v3 (§7): solo se exigen una vez que la copia de cada página se
// reescribió con el contrato v3 (docs/routes.json copyDone=true) — antes de
// eso, páginas todavía con copy vieja las contienen legítimamente.
const FORBIDDEN_V3 = [
  'en trámite', 'peritos matriculados', 'perito matriculado habilitado',
  'estándares bancarios', 'Te confirmamos el plazo', 'te confirmamos el plazo',
  'Aprobado por', 'Ueno', 'Itaú', 'Itau', 'Continental', 'AFD', 'sin IVA',
];
const ALLOWED_GS = new Set(['800000', '1500000', '1800000', '2500000']);
const VERTICAL_B2B_SLUGS = new Set(['/tasaciones/franja-de-dominio/']);

for (const r of [...routes, { slug: '404.html', extra: true }, { slug: 'gracias.html', extra: true }]) {
  const p = r.extra ? r.slug : pathForSlug(r.slug);
  if (!existsSync(p)) { fail(`falta ${p}`); continue; }
  const rawHtml = readFileSync(p, 'utf8');
  // El escaneo de copy/cifras ignora JSON-LD (metadata, no contenido visible).
  const html = rawHtml.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const isB2B = VERTICAL_B2B_SLUGS.has(r.slug);
  const isFranja = r.slug === '/tasaciones/franja-de-dominio/';
  const FORBIDDEN = copyDone ? [...FORBIDDEN_ALWAYS, ...FORBIDDEN_V3] : FORBIDDEN_ALWAYS;

  const h1s = [...html.matchAll(/<h1[^>]*>/g)];
  if (h1s.length !== 1) fail(`${p}: ${h1s.length} <h1> (debe haber exactamente 1)`);

  const waMenus = [...html.matchAll(/id="wa-menu"/g)];
  if (waMenus.length !== 1) fail(`${p}: ${waMenus.length} #wa-menu (debe haber exactamente 1)`);

  const menuOptionLinks = [...html.matchAll(/<a class="wa-menu__option[^"]*" href="([^"]*)"/g)].map((m) => m[1]);
  if (menuOptionLinks.length !== 5) fail(`${p}: el panel WA tiene ${menuOptionLinks.length} opciones (debe tener 5)`);
  const ctx = (html.match(/data-page-context="([^"]*)"/) || [])[1] || '';
  for (const href of menuOptionLinks) {
    const text = decodeURIComponent(href.split('?text=')[1] || '');
    if (!text.includes(ctx)) fail(`${p}: una opción del menú WA no menciona el contexto "${ctx}": ${text}`);
  }

  const triggers = [...html.matchAll(/data-wa-trigger/g)];
  if (triggers.length < 2) fail(`${p}: solo ${triggers.length} [data-wa-trigger] (debe haber ≥ 2)`);

  // bug fix: los dos triggers del header deben llevar ?text= con el waContext
  const headerWaLinks = [...html.matchAll(/class="wa-(pill|round)" href="([^"]*)"/g)].map((m) => m[2]);
  for (const href of headerWaLinks) {
    const text = decodeURIComponent((href.split('?text=')[1] || ''));
    if (!text.includes(ctx)) fail(`${p}: el trigger del header no lleva el contexto en ?text= (bug "()"): ${href}`);
  }

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

  // credenciales: 4.168 / 3.738 solo dentro de CRED_CSJ / CRED_CSJ_CORTA / CRED_ARQ
  for (const num of ['4.168', '3.738']) {
    const idxs = [];
    let idx = html.indexOf(num);
    while (idx !== -1) { idxs.push(idx); idx = html.indexOf(num, idx + 1); }
    for (const i of idxs) {
      const around = html.slice(Math.max(0, i - 60), i + 10);
      const okCred = around.includes('matrícula N.º') || around.includes('Mat.');
      if (!okCred) fail(`${p}: "${num}" aparece fuera de una cadena de credencial canónica`);
    }
  }

  // BCP: toda mención debe venir de CRED_BCP_FIRMA o la frase de FAQ §5.4
  const bcpIdxs = [];
  { let i = html.indexOf('BCP'); while (i !== -1) { bcpIdxs.push(i); i = html.indexOf('BCP', i + 1); } }
  for (const i of bcpIdxs) {
    const before = html.slice(Math.max(0, i - 40), i);
    if (!before.includes('inscripto en el registro del')) fail(`${p}: "BCP" aparece fuera de la frase canónica "inscripto en el registro del BCP"`);
  }

  // cifras Gs.: whitelist + sufijo IVA (fuera de .value-block, donde van las
  // cifras del ejemplo aritmético, sin IVA_TXT, precedidas de "Ejemplo:")
  const valueBlockMatches = [...html.matchAll(/<section class="section value-block[\s\S]*?<\/section>/g)].map((m) => m[0]);
  let htmlOutsideValueBlock = html;
  for (const vb of valueBlockMatches) htmlOutsideValueBlock = htmlOutsideValueBlock.replace(vb, '');

  const gsOutside = [...htmlOutsideValueBlock.matchAll(/Gs\.\s?([\d.,]+)/g)];
  for (const m of gsOutside) {
    const amt = m[1].replace(/[.,]/g, '');
    if (!ALLOWED_GS.has(amt)) fail(`${p}: cifra en guaraníes no permitida fuera de .value-block: Gs. ${amt}`);
  }
  if (copyDone && !isB2B) {
    // cada cifra Gs. debe estar seguida de IVA_TXT en el mismo nodo de texto
    // (§7: "el primer Gs. de un rango no lleva sufijo, el segundo sí" — se
    // comprueba de forma conservadora buscando el sufijo dentro de los 40
    // caracteres siguientes a cada cifra).
    for (const m of gsOutside) {
      const after = htmlOutsideValueBlock.slice(m.index, m.index + 40);
      if (!after.includes(IVA_TXT)) fail(`${p}: "Gs. ${m[1]}" sin "${IVA_TXT}" en el mismo nodo de texto`);
    }
  }

  if (isB2B) {
    const anyGs = [...html.matchAll(/Gs\.\s?[\d.,]+/g)];
    if (anyGs.length) fail(`${p}: kind vertical-b2b no debe mostrar ninguna cifra Gs.`);
  }

  // FACTURA_TXT presente en toda página que muestre una cifra Gs. (solo una
  // vez que la copia v3 está lista; antes, el panel viejo no la menciona).
  if (copyDone && gsOutside.length && !html.includes(FACTURA_TXT)) fail(`${p}: muestra una cifra Gs. pero no incluye "${FACTURA_TXT}"`);

  // PLAZO_TXT en la fila de confianza de todas las páginas indexables
  if (r.slug !== undefined && p !== '404.html' && p !== 'gracias.html') {
    const trustRow = (html.match(/<div class="trustrow">[\s\S]*?<\/div>\s*<\/div>/) || [''])[0];
    if (!trustRow.includes(PLAZO_TXT)) fail(`${p}: la fila de confianza no incluye "${PLAZO_TXT}"`);
  }

  // ------------------------------------------------------- checks de copy
  if (copyDone) {
    const heroSection = (html.match(/<section class="hero[\s\S]*?<\/section>/) || [''])[0];
    const ctaBandSection = (html.match(/<section class="cta-band[\s\S]*?<\/section>/) || [''])[0];
    const footerSection = (html.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
    const isInformes = p === 'informes-periciales/index.html';

    if (/Gs\.\s?[\d.,]+/.test(heroSection) && !isInformes) fail(`${p}: el hero muestra el precio y no es /informes-periciales/`);
    if (/Gs\.\s?[\d.,]+/.test(ctaBandSection)) fail(`${p}: la ctaBand muestra el precio`);
    if (/Gs\.\s?[\d.,]+/.test(footerSection)) fail(`${p}: el footer muestra el precio`);
    if (html.includes('Te cotizamos por WhatsApp')) fail(`${p}: sigue "Te cotizamos por WhatsApp"`);

    const freeAsides = [...html.matchAll(/<div class="free-aside">[\s\S]*?<\/div>\s*<\/div>/g)].map((m) => m[0]);
    for (const fa of freeAsides) {
      if (!fa.toLowerCase().includes('no es un informe oficial')) fail(`${p}: un free-aside no aclara "no es un informe oficial"`);
    }

    const expectedFirstMap = { 'valuacion-para-vender/index.html': 'valoracion', 'tasaciones/hipotecaria/index.html': 'credito', 'tasaciones/franja-de-dominio/index.html': 'consulta', 'tasaciones/corporativa/index.html': 'consulta' };
    const firstPrimary = (html.match(/<main>[\s\S]*?class="btn btn--primary"[^>]*data-wa-open="([^"]*)"/) || [])[1];
    const expectedFirst = expectedFirstMap[p] || 'informe';
    if (firstPrimary && firstPrimary !== expectedFirst) fail(`${p}: el primer .btn--primary abre "${firstPrimary}", se esperaba "${expectedFirst}"`);
  }
}
if (failures === 0) ok('todas las páginas pasan los checks estructurales');
if (copyDone) ok('checks de copy activos (docs/routes.json copyDone=true)');
else console.log('  (checks de copy dependientes de IVA/finalidades desactivados — docs/routes.json copyDone=false)');

// --------------------------------------------------------------- resultado
console.log('');
if (failures > 0) {
  console.error(`FAIL — ${failures} problema(s)`);
  process.exit(1);
} else {
  console.log('PASS');
}
