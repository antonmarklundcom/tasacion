// tools/link-check.mjs — links internos, anchors y 301 legacy (docs/IMPROVE-PLAN.md §2.3).
// node tools/link-check.mjs                                  (estático, sin servidor)
// LIVE=https://tasacion.com.py node tools/link-check.mjs     (además verifica los 301 en vivo)
import { readFileSync, existsSync, statSync } from 'node:fs';

let failures = 0, warns = 0, checked = 0;
const fail = (msg) => { console.error('  FAIL  ' + msg); failures++; };
const warn = (msg) => { console.warn('  WARN  ' + msg); warns++; };
const ok = (msg) => console.log('  ok    ' + msg);
const step = (msg) => console.log('\n== ' + msg + ' ==');

const SITE_HOSTS = new Set(['tasacion.com.py', 'www.tasacion.com.py']);
const isFile = (p) => { try { return statSync(p).isFile(); } catch { return false; } };
const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };

const { routes } = JSON.parse(readFileSync('docs/routes.json', 'utf8'));
const fileForSlug = (slug) => (slug === '/' ? 'index.html' : slug.endsWith('.html') ? slug.replace(/^\//, '') : slug.replace(/^\//, '') + 'index.html');
const pages = [...routes.map((r) => fileForSlug(r.slug)), '404.html', 'gracias.html'];

// pathname -> archivo en disco (o null)
function resolveFile(pathname) {
  const p = decodeURIComponent(pathname).replace(/^\//, '');
  if (p === '' || p.endsWith('/')) return isFile(p + 'index.html') ? p + 'index.html' : null;
  if (isFile(p)) return p;
  if (isDir(p) && isFile(p + '/index.html')) return p + '/index.html';
  return null;
}

const idCache = new Map();
function hasAnchor(file, frag) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    const ids = new Set([...html.matchAll(/\s(?:id|name)="([^"]*)"/g)].map((m) => m[1]));
    idCache.set(file, ids);
  }
  return idCache.get(file).has(decodeURIComponent(frag));
}

// ------------------------------------------------ links / src / anchors
step('links, assets y anchors en el HTML generado');
const before = failures;
const seen = new Set();
for (const file of pages) {
  if (!existsSync(file)) { fail(`falta ${file}`); continue; }
  const pagePath = file === 'index.html' ? '/' : '/' + file.replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  for (const m of html.matchAll(/\s(href|src)="([^"]*)"/gi)) {
    const raw = m[2].trim();
    if (!raw || raw === '#' || /^(mailto:|tel:|javascript:|data:|sms:|whatsapp:)/i.test(raw)) continue;
    let u;
    try { u = new URL(raw, 'https://tasacion.com.py' + pagePath); } catch { fail(`${file}: URL inválida ${raw}`); continue; }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') continue;
    if (!SITE_HOSTS.has(u.hostname)) continue; // externos (wa.me, fuentes, CRM...)
    const key = `${file}|${u.pathname}|${u.hash}`;
    if (seen.has(key)) continue;
    seen.add(key); checked++;
    const target = resolveFile(u.pathname);
    if (!target) { fail(`${file}: ${raw} -> no existe ${u.pathname}`); continue; }
    if (u.hash.length > 1 && target.endsWith('.html') && !hasAnchor(target, u.hash.slice(1))) fail(`${file}: ${raw} -> falta id="${u.hash.slice(1)}" en ${target}`);
  }
}
if (failures === before) ok(`${checked} links internos/assets/anchors resueltos en ${pages.length} páginas`);
if (isFile('lead-forward.php')) ok('lead-forward.php existe'); else fail('falta lead-forward.php');

// ------------------------------------------------ 301 legacy
step('redirects legacy (.htaccess)');
const htaccess = readFileSync('.htaccess', 'utf8');
const RULES = [
  { line: 'RedirectMatch 301 ^/servicios/tasacion-de-casas-y-departamentos/?$ /tasaciones/casas/', re: /^\/servicios\/tasacion-de-casas-y-departamentos\/?$/, target: '/tasaciones/casas/' },
  { line: 'RedirectMatch 301 ^/servicios/tasacion-de-terrenos/?$ /tasaciones/terrenos/', re: /^\/servicios\/tasacion-de-terrenos\/?$/, target: '/tasaciones/terrenos/' },
  { line: 'RedirectMatch 301 ^/servicios/tasacion-de-locales-comerciales/?$ /tasaciones/locales-comerciales/', re: /^\/servicios\/tasacion-de-locales-comerciales\/?$/, target: '/tasaciones/locales-comerciales/' },
  { line: 'RedirectMatch 301 ^/servicios/informe-de-tasacion/?$ /informes-periciales/', re: /^\/servicios\/informe-de-tasacion\/?$/, target: '/informes-periciales/' },
  { line: 'RedirectMatch 301 ^/servicios/tasacion-online/?$ /valuacion-para-vender/', re: /^\/servicios\/tasacion-online\/?$/, target: '/valuacion-para-vender/' },
  { line: 'RedirectMatch 301 ^/zonas/.*$ /', re: /^\/zonas\/.*$/, target: '/' },
  { line: 'RedirectMatch 301 ^/cotizador/?$ /contacto/', re: /^\/cotizador\/?$/, target: '/contacto/' },
  { line: 'RedirectMatch 301 ^/guias/.*$ /preguntas-frecuentes/', re: /^\/guias\/.*$/, target: '/preguntas-frecuentes/' },
];
const SAMPLES = [
  '/servicios/tasacion-de-casas-y-departamentos/', '/servicios/tasacion-de-terrenos/', '/servicios/tasacion-de-locales-comerciales/',
  '/servicios/informe-de-tasacion/', '/servicios/tasacion-online/', '/zonas/luque/', '/cotizador/', '/guias/que-es-una-tasacion-inmobiliaria/',
];
const htLines = new Set(htaccess.split(/\r?\n/).map((l) => l.trim()));
const activeRules = new Set();
for (const r of RULES) {
  if (htLines.has(r.line)) {
    activeRules.add(r);
    if (resolveFile(r.target)) ok(`${r.re.source} -> ${r.target}`); else fail(`destino inexistente: ${r.target}`);
  } else {
    // regla retirada: ok solo si la URL legacy ahora es una página real
    const legacy = SAMPLES.find((s) => r.re.test(s));
    if (legacy && resolveFile(legacy)) ok(`regla retirada, ${legacy} ahora es una página real`);
    else fail(`falta en .htaccess (y la URL legacy no existe como página): ${r.line}`);
  }
}

if (process.env.LIVE) {
  step(`301 en vivo (${process.env.LIVE})`);
  const base = process.env.LIVE.replace(/\/$/, '');
  for (const s of SAMPLES) {
    const rule = RULES.find((r) => r.re.test(s));
    if (!activeRules.has(rule)) { ok(`${s} (sin regla, se omite)`); continue; }
    let res;
    try { res = await fetch(base + s, { redirect: 'manual' }); } catch { warn('live host unreachable'); break; }
    if (res.status === 403 && !res.headers.get('location')) { warn('live host unreachable (403 del proxy/egress)'); break; }
    const loc = res.headers.get('location') || '';
    const path = loc.replace(/^https?:\/\/[^/]+/, '');
    if (res.status === 301 && path === rule.target) ok(`${s} -> 301 ${path}`);
    else fail(`${s}: esperado 301 ${rule.target}, recibido ${res.status} ${loc}`);
  }
}

console.log(`\nlink-check: ${checked} links, ${failures} FAIL, ${warns} WARN`);
console.log(failures ? 'FAIL' : 'PASS');
process.exit(failures ? 1 : 0);
