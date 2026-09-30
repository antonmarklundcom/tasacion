// tools/seo-audit.mjs — auditoría SEO/rendimiento con Playwright (docs/IMPROVE-PLAN.md, Apéndice A).
// node serve.mjs &  →  BASE=http://127.0.0.1:4322 OUT=… SHOTS=audit-shots node tools/seo-audit.mjs
// SHOTS= (vacío) omite capturas. Sale con 0 tras escribir el JSON.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:4322';
const SITE = 'https://tasacion.com.py';
const OUT = process.env.OUT || 'docs/audit/audit-after.json';
const SHOTS = process.env.SHOTS ?? 'audit-shots';
const sitemapXml = await (await fetch(BASE + '/sitemap.xml')).text();
const sitemap = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const urls = [...sitemap, SITE + '/404.html', SITE + '/gracias.html'];
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
// executablePath solo si es un archivo; si es un directorio, Playwright lo encuentra vía PLAYWRIGHT_BROWSERS_PATH.
const isFile = (p) => { try { return statSync(p).isFile(); } catch { return false; } };
const browser = await chromium.launch({ executablePath: isFile('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
const pages = [];
for (const url of urls) {
  const path = url.replace(SITE, '');
  const rec = { url, path, inSitemap: sitemap.includes(url) };
  for (const vp of [{ w: 1366, h: 900 }, { w: 390, h: 844 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    const consoleErrors = [], failed = [], resources = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
    page.on('requestfailed', (r) => failed.push({ url: r.url(), error: r.failure()?.errorText }));
    page.on('response', async (r) => {
      if (r.status() >= 400) failed.push({ url: r.url(), status: r.status() });
      let size = 0; try { size = (await r.body()).length; } catch {}
      resources.push({ type: r.request().resourceType(), size });
    });
    await page.addInitScript(() => { new PerformanceObserver((l) => { const e = l.getEntries().at(-1); window.__lcp = { t: Math.round(e.startTime), tag: e.element?.tagName, src: e.url || null, text: e.element && !e.url ? (e.element.textContent || '').trim().slice(0, 60) : null }; }).observe({ type: 'largest-contentful-paint', buffered: true }); });
    const resp = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    rec.status = resp.status();
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
    await page.waitForTimeout(400);
    const rt = await page.evaluate(() => ({
      hScroll: document.documentElement.scrollWidth > innerWidth,
      brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
      lcp: window.__lcp || null,
      fontsLoaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight),
    }));
    const sum = (t) => resources.filter((r) => r.type === t).reduce((a, r) => a + r.size, 0);
    rec['vp' + vp.w] = { ...rt, consoleErrors, failed, jsBytes: sum('script'), cssBytes: sum('stylesheet'), imgBytes: sum('image'), fontBytes: sum('font'), requests: resources.length };
    if (vp.w === 1366) Object.assign(rec, await page.evaluate((SITE) => {
      const q = (s) => document.querySelector(s);
      const types = new Set(); let schemaParseErrors = 0;
      const walk = (o) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (o['@type']) [].concat(o['@type']).forEach((t) => types.add(t)); Object.values(o).forEach(walk); } };
      document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => { try { walk(JSON.parse(s.textContent)); } catch { schemaParseErrors++; } });
      const text = (q('main') || document.body).innerText.replace(/\s+/g, ' ').trim();
      const hrefs = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
      const internal = [...new Set(hrefs.map((h) => { try { const u = new URL(h, location.href); if (u.origin === location.origin || u.origin === SITE) return u.pathname; } catch {} return null; }).filter(Boolean))];
      return {
        title: document.title, titleLen: document.title.length,
        metaDescription: q('meta[name="description"]')?.content ?? null,
        metaDescriptionLen: (q('meta[name="description"]')?.content ?? '').length,
        robots: q('meta[name="robots"]')?.content ?? null,
        canonical: q('link[rel="canonical"]')?.href ?? null,
        h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()),
        h2: [...document.querySelectorAll('h2')].map((h) => h.innerText.trim()),
        wordCountMain: text ? text.split(' ').length : 0,
        internalLinksOut: internal,
        externalLinks: [...new Set(hrefs.filter((h) => /^https?:/.test(h) && !h.startsWith(SITE)).map((h) => new URL(h).origin))],
        imagesWithoutAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src')),
        imagesEmptyAlt: [...document.images].filter((i) => i.getAttribute('alt') === '').map((i) => i.getAttribute('src')),
        schemaTypes: [...types].sort(), schemaParseErrors,
        ogImage: q('meta[property="og:image"]')?.content ?? null, lang: document.documentElement.lang,
        waLinks: [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => { const u = new URL(a.href); return { number: u.pathname.replace(/\D/g, ''), text: u.searchParams.get('text') || '', loc: a.dataset.evLoc || null }; }),
        telLinks: [...new Set([...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href')))],
        forms: [...document.forms].map((f) => ({ action: f.getAttribute('action'), fields: [...f.elements].map((e) => e.name).filter(Boolean) })),
      };
    }, SITE));
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${(path.replace(/^\/|\/$/g, '').replace(/[\/.]/g, '-') || 'home')}-${vp.w}.png`, fullPage: false });
    await ctx.close();
  }
  pages.push(rec);
}
await browser.close();
for (const p of pages) p.internalLinksIn = pages.filter((o) => o !== p && o.internalLinksOut?.includes(p.path)).map((o) => o.path);
const targets = [...new Set(pages.flatMap((p) => p.internalLinksOut || []))];
const brokenInternal = [];
for (const t of targets) { const r = await fetch(BASE + t, { redirect: 'manual' }); if (r.status >= 400) brokenInternal.push({ target: t, status: r.status }); }
const texts = pages.flatMap((p) => (p.waLinks || []).map((w) => w.text));
writeFileSync(OUT, JSON.stringify({ generated: new Date().toISOString(), source: BASE, summary: {
  pages: pages.length, sitemapUrls: sitemap.length, brokenInternal,
  waNumbers: [...new Set(pages.flatMap((p) => (p.waLinks || []).map((w) => w.number)))],
  telLinks: [...new Set(pages.flatMap((p) => p.telLinks || []))],
  waLinksTotal: texts.length, waLinksEmptyText: texts.filter((t) => !t).length, waDistinctTexts: new Set(texts).size,
}, pages }, null, 2));

console.log(`seo-audit: ${pages.length} páginas, ${brokenInternal.length} links rotos, wa=${[...new Set(pages.flatMap((p) => (p.waLinks || []).map((w) => w.number)))].join(',')} → ${OUT}`);
