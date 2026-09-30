// tools/seo-diff.mjs — compara dos auditorías (docs/IMPROVE-PLAN.md §2.3).
// node tools/seo-diff.mjs <before.json> <after.json> [--whitelist file.json]
// Whitelist: { "/ruta/": ["title","h1","canonical","robots","description"] } (o env SEO_WHITELIST).
// Sale con 1 si hay algún FAIL.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
let wlFile = process.env.SEO_WHITELIST || '';
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--whitelist') wlFile = args[++i];
  else files.push(args[i]);
}
if (files.length !== 2) { console.error('uso: node tools/seo-diff.mjs <before.json> <after.json> [--whitelist file]'); process.exit(2); }
const [before, after] = files.map((f) => JSON.parse(readFileSync(f, 'utf8')));
const whitelist = wlFile ? JSON.parse(readFileSync(wlFile, 'utf8')) : {};

const counts = { FAIL: 0, WARN: 0, INFO: 0 };
const say = (lvl, msg) => { counts[lvl]++; console.log(`  ${lvl.padEnd(4)}  ${msg}`); };
const allowed = (path, field) => (whitelist[path] || []).includes(field);

const NUMBER = '595992279599';
const TEL = 'tel:+' + NUMBER;
// Canonical: absoluto a tasacion.com.py en ambos lados; se normaliza host local por si acaso.
const canon = (c) => (c || '').replace(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/, 'https://tasacion.com.py');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const byPath = (d) => new Map(d.pages.map((p) => [p.path, p]));
const B = byPath(before), A = byPath(after);

// 1. URLs de §2.1 (sitemap del before) deben seguir en 200
for (const p of before.pages.filter((p) => p.inSitemap)) {
  const a = A.get(p.path);
  if (!a) say('FAIL', `${p.path}: falta en after`);
  else if (a.status !== 200) say('FAIL', `${p.path}: status ${a.status} (debe ser 200)`);
}

for (const [path, b] of B) {
  const a = A.get(path);
  if (!a) continue;
  // 2. title / canonical / robots
  if (b.title !== a.title && !allowed(path, 'title')) say('FAIL', `${path}: title cambió: "${b.title}" -> "${a.title}"`);
  if (canon(b.canonical) !== canon(a.canonical) && !allowed(path, 'canonical')) say('FAIL', `${path}: canonical cambió: ${b.canonical} -> ${a.canonical}`);
  if ((b.robots ?? null) !== (a.robots ?? null) && !allowed(path, 'robots')) say('FAIL', `${path}: robots cambió: ${b.robots} -> ${a.robots}`);
  // 3. H1
  if (!same(b.h1, a.h1) && !allowed(path, 'h1')) say('FAIL', `${path}: H1 cambió: ${JSON.stringify(b.h1)} -> ${JSON.stringify(a.h1)}`);
  // 4. meta description
  if (b.metaDescription !== a.metaDescription) say(allowed(path, 'description') ? 'INFO' : 'WARN', `${path}: meta description cambió (${b.metaDescriptionLen} -> ${a.metaDescriptionLen} car.)`);
  // 5. schema
  const lost = (b.schemaTypes || []).filter((t) => !(a.schemaTypes || []).includes(t));
  if (lost.length) say('FAIL', `${path}: schema @type perdido: ${lost.join(', ')}`);
  // 6. word count
  if (b.wordCountMain > 0 && a.wordCountMain < b.wordCountMain * 0.9) say('FAIL', `${path}: wordCountMain ${b.wordCountMain} -> ${a.wordCountMain} (-${Math.round((1 - a.wordCountMain / b.wordCountMain) * 100)}%)`);
  // 7. links entrantes
  const gone = (b.internalLinksIn || []).filter((x) => !(a.internalLinksIn || []).includes(x));
  if (gone.length) say('FAIL', `${path}: pierde links entrantes desde ${gone.join(', ')}`);
}

// 4b. largo de description en after (110-160)
for (const a of after.pages) {
  if (a.metaDescription == null) continue;
  const n = a.metaDescriptionLen ?? a.metaDescription.length;
  if (n < 110 || n > 160) say('WARN', `${a.path}: meta description de ${n} car. (fuera de 110-160)`);
}

// 8. sitemap superset
const sm = (d) => new Set(d.pages.filter((p) => p.inSitemap).map((p) => p.path));
const smA = sm(after);
for (const p of sm(before)) if (!smA.has(p)) say('FAIL', `sitemap: falta ${p}`);

// 9. contacto (solo AFTER); en before OLD_NUMBER = número viejo, solo informativo
const bWa = before.pages.flatMap((p) => p.waLinks || []);
const oldUse = bWa.filter((w) => w.number !== NUMBER).length;
const oldEmpty = bWa.filter((w) => !w.text).length;
say('INFO', `before usaba número viejo en ${oldUse} links wa.me y ${oldEmpty} sin texto`);
for (const p of after.pages) {
  for (const w of p.waLinks || []) {
    if (w.number !== NUMBER) say('FAIL', `${p.path}: wa.me con número ${w.number}`);
    if (!w.text) say('FAIL', `${p.path}: wa.me sin texto (loc ${w.loc})`);
  }
  for (const t of p.telLinks || []) if (t !== TEL) say('FAIL', `${p.path}: tel ${t} (esperado ${TEL})`);
}

const nPages = after.pages.length;
console.log(`\nseo-diff: ${nPages} páginas after vs ${before.pages.length} before — ${counts.FAIL} FAIL, ${counts.WARN} WARN, ${counts.INFO} info`);
process.exit(counts.FAIL ? 1 : 0);
