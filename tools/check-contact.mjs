// tools/check-contact.mjs — QA del contacto (docs/IMPROVE-PLAN.md §4.3).
// node tools/check-contact.mjs   (sale con 1 si algo falla; corre dentro de verify.mjs)
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { MESSAGES, PURPOSES, WA_NUMBER, WA_DISPLAY, TEL_HREF, menuRows } from '../content/wa-messages.mjs';

let failures = 0;
const fail = (msg) => { console.error('  FAIL  ' + msg); failures++; };
const ok = (msg) => console.log('  ok    ' + msg);
const step = (msg) => console.log('\n== ' + msg + ' ==');

const EXPECTED_NUMBER = '595992279599';
const EXPECTED_TEL = 'tel:+595992279599';
const EXPECTED_DISPLAY = '+595 992 279 599';
// Cifras de 4+ dígitos permitidas dentro de mensajes (vacío: ninguna).
const ALLOWED_DIGIT_RUNS = [];

const { routes } = JSON.parse(readFileSync('docs/routes.json', 'utf8'));
const slugs = [...routes.map((r) => r.slug), '404.html', 'gracias.html'];
const fileForSlug = (slug) => (slug === '/' ? 'index.html' : slug.endsWith('.html') ? slug : slug.replace(/^\//, '') + 'index.html');

// ------------------------------------------------ a/b/c. HTML generado
step('links y teléfonos en el HTML generado');
const before = failures;
for (const slug of slugs) {
  const file = fileForSlug(slug);
  if (!existsSync(file)) { fail(`falta ${file}`); continue; }
  const html = readFileSync(file, 'utf8');
  const allowed = new Set(Object.values(MESSAGES[slug] || {}));

  for (const m of html.matchAll(/href="(https:\/\/wa\.me\/[^"]*)"/g)) {
    const u = new URL(m[1].replace(/&amp;/g, '&'));
    const num = u.pathname.replace(/^\//, '');
    if (num !== EXPECTED_NUMBER) fail(`${file}: wa.me con número ${num}`);
    const text = u.searchParams.get('text');
    if (!text || !text.trim()) fail(`${file}: wa.me sin text: ${m[1]}`);
    else if (!allowed.has(text)) fail(`${file}: el text no está en MESSAGES['${slug}']: ${text}`);
  }
  for (const m of html.matchAll(/href="(tel:[^"]*)"/g)) {
    if (m[1] !== EXPECTED_TEL) fail(`${file}: tel: distinto de ${EXPECTED_TEL}: ${m[1]}`);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const walk = (o) => {
      if (Array.isArray(o)) return o.forEach(walk);
      if (o && typeof o === 'object') {
        for (const [k, v] of Object.entries(o)) {
          if (k === 'telephone' && v !== '+' + EXPECTED_NUMBER) fail(`${file}: JSON-LD telephone ${v}`);
          walk(v);
        }
      }
    };
    try { walk(JSON.parse(m[1])); } catch { fail(`${file}: JSON-LD inválido`); }
  }

  const visible = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  for (const m of visible.matchAll(/\+?595[\s\d-]{8,}|09\d{2}[\s-]?\d{3}[\s-]?\d{3}/g)) {
    const found = m[0].trim();
    if (found !== EXPECTED_DISPLAY) fail(`${file}: teléfono visible distinto de ${EXPECTED_DISPLAY}: "${found}"`);
  }
}
if (failures === before) ok(`${slugs.length} páginas: wa.me, tel:, JSON-LD y teléfono visible correctos`);

// ------------------------------------- el mapa exporta lo mismo que se espera
if (WA_NUMBER !== EXPECTED_NUMBER || TEL_HREF !== EXPECTED_TEL || WA_DISPLAY !== EXPECTED_DISPLAY) fail('WA_NUMBER / TEL_HREF / WA_DISPLAY de wa-messages.mjs no coinciden con los valores esperados');

// ------------------------------------------------ d. número viejo en archivos
step('número viejo en archivos versionados');
const b4 = failures;
const g = ['595', '995', '628', '862'];
const gap = '[^\\d\\n]{0,3}';
const OLD = new RegExp(g.join(gap));
const OLD_LOCAL = new RegExp('0' + g.slice(1).join(gap));
const OTHER_595 = /(?<!\d)595\d{9}(?!\d)/g;
const BINARY = /\.(webp|png|jpe?g|gif|ico|woff2?|ttf|otf|pdf|zip|avif)$/i;
for (const f of execSync('git ls-files -z', { encoding: 'utf8' }).split('\0').filter(Boolean)) {
  if (BINARY.test(f) || !existsSync(f)) continue;
  const buf = readFileSync(f);
  if (buf.includes(0)) continue;
  const txt = buf.toString('utf8');
  if (OLD.test(txt) || OLD_LOCAL.test(txt)) fail(`${f}: contiene el número viejo`);
  for (const m of txt.matchAll(OTHER_595)) {
    if (m[0] !== EXPECTED_NUMBER) fail(`${f}: número 595… distinto de ${EXPECTED_NUMBER}: ${m[0]}`);
  }
}
if (failures === b4) ok('sin el número viejo ni otros 595XXXXXXXXX');

// ------------------------------------------------ e. reglas de los mensajes
step('reglas de los mensajes');
const b5 = failures;
const seen = new Map();
for (const [slug, msgs] of Object.entries(MESSAGES)) {
  for (const [key, t] of Object.entries(msgs)) {
    const id = `MESSAGES['${slug}'].${key}`;
    if (/Gs|₲|USD|\$/.test(t)) fail(`${id}: monto o moneda`);
    for (const m of t.match(/\d{4,}/g) || []) if (!ALLOWED_DIGIT_RUNS.includes(m)) fail(`${id}: cifra de 4+ dígitos (${m})`);
    if (/\b(tienes|puedes|quieres|necesitas|eres|sabes)\b/i.test(t)) fail(`${id}: forma de tú`);
    if (!t.includes('___')) fail(`${id}: falta el espacio "___"`);
    if (seen.has(t)) fail(`${id}: idéntico a ${seen.get(t)}`); else seen.set(t, id);
  }
}
for (const slug of slugs) {
  const msgs = MESSAGES[slug];
  if (!msgs) { fail(`MESSAGES sin entrada para ${slug}`); continue; }
  const need = slug === 'gracias.html' ? [...Object.keys(PURPOSES), 'footer'] : [...menuRows(slug), 'footer'];
  for (const id of need) if (!msgs[id]) fail(`MESSAGES['${slug}'] no tiene "${id}"`);
}
if (!(MESSAGES['/contacto/'] || {}).error) fail("falta MESSAGES['/contacto/'].error");
if (!(MESSAGES['/privacidad/'] || {}).datos) fail("falta MESSAGES['/privacidad/'].datos");
if (failures === b5) ok(`${seen.size} mensajes únicos, sin montos, sin tú, completos por página`);

// ------------------------------------------------ f. site.js
step('assets/js/site.js');
const b6 = failures;
const js = readFileSync('assets/js/site.js', 'utf8');
for (const m of js.matchAll(/wa\.me\/[^\n]*/g)) {
  if (!/\?text=/.test(m[0])) fail(`site.js arma un wa.me sin ?text=: ${m[0].slice(0, 80)}`);
}
if (/WA_NUMBER/.test(js)) fail('site.js todavía usa WA_NUMBER');
if (failures === b6) ok('site.js no arma URLs de WhatsApp');

console.log('');
if (failures > 0) { console.error(`FAIL — ${failures} problema(s)`); process.exit(1); }
console.log('PASS');
