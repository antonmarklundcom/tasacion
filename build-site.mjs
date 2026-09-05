// build-site.mjs — genera las 13 páginas del sitio desde content.mjs.
// node build-site.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PAGES, NAV, WA_NUMBER, SITE } from './content.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const waHref = () => `https://wa.me/${WA_NUMBER}`;
const nl2p = (body) => body.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('\n');

function renderNav(current) {
  const items = NAV.map((i) => {
    const active = i.href === current ? ' aria-current="page"' : '';
    return `<li><a href="${i.href}"${active}>${esc(i.label)}</a></li>`;
  }).join('\n      ');
  return `<header class="hdr">
  <div class="container hdr__row">
    <a href="/" class="hdr__brand">Tasación<span>.com.py</span></a>
    <nav class="hdr__nav" aria-label="Principal">
      <ul>
      ${items}
      </ul>
    </nav>
    <a class="btn btn--wa hdr__cta" href="${waHref()}" target="_blank" rel="noopener" data-ev="wa_click" data-ev-loc="header">WhatsApp</a>
  </div>
</header>`;
}

function renderFooter() {
  return `<footer class="ftr">
  <div class="container ftr__grid">
    <div>
      <p class="ftr__brand">Tasación<span>.com.py</span></p>
      <p class="ftr__muted">Tasación de inmuebles en Asunción y Gran Asunción.</p>
    </div>
    <nav aria-label="Servicios">
      <p class="ftr__label">Tasaciones</p>
      <ul>
        <li><a href="/tasaciones/casas/">Casas</a></li>
        <li><a href="/tasaciones/departamentos/">Departamentos</a></li>
        <li><a href="/tasaciones/terrenos/">Terrenos</a></li>
        <li><a href="/tasaciones/corporativa/">Corporativa</a></li>
        <li><a href="/tasaciones/hipotecaria/">Hipotecaria</a></li>
        <li><a href="/tasaciones/locales-comerciales/">Locales Comerciales</a></li>
        <li><a href="/tasaciones/campos/">Campos y Estancias</a></li>
      </ul>
    </nav>
    <nav aria-label="Sitio">
      <p class="ftr__label">Sitio</p>
      <ul>
        <li><a href="/valuacion-para-vender/">Valoración para Vender</a></li>
        <li><a href="/informes-periciales/">Informes Periciales</a></li>
        <li><a href="/nosotros/">Nosotros</a></li>
        <li><a href="/preguntas-frecuentes/">Preguntas Frecuentes</a></li>
        <li><a href="/contacto/">Contacto</a></li>
      </ul>
    </nav>
    <div>
      <p class="ftr__label">Contacto</p>
      <p><a class="ftr__wa" href="${waHref()}" target="_blank" rel="noopener" data-ev="wa_click" data-ev-loc="footer">WhatsApp: +595 995 628862</a></p>
      <p><a href="tel:+595995628862">Llamar</a></p>
    </div>
  </div>
  <div class="container ftr__base">
    <p>© <span id="yr"></span> Tasación.com.py — Asunción, Paraguay.</p>
  </div>
</footer>`;
}

function block(section) {
  switch (section.type) {
    case 'services':
      return `<section class="section"${section.id ? ` id="${section.id}"` : ''}>
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <div class="grid grid--3">
      ${section.items.map((it) => `<a class="card" href="${it.href}">
        <h3>${esc(it.title)}</h3>
        <p>${esc(it.body)}</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'grid3':
    case 'grid2': {
      const cols = section.type === 'grid3' ? '3' : '2';
      return `<section class="section">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    ${section.body ? nl2p(section.body) : ''}
    <div class="grid grid--${cols}">
      ${section.items.map((it) => {
        const inner = `<h3>${esc(it.title)}</h3><p>${esc(it.body)}</p>${it.href ? `<a class="link" href="${it.href}">${esc(it.label || 'Saber más')} →</a>` : ''}`;
        return `<div class="card">${inner}</div>`;
      }).join('\n      ')}
    </div>
    ${section.cta ? `<p class="section__cta"><a class="btn btn--primary" href="${section.cta.href}">${esc(section.cta.label)}</a></p>` : ''}
  </div>
</section>`;
    }

    case 'lead':
      return `<section class="section section--narrow">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    ${nl2p(section.body)}
    ${section.cta ? `<p><a class="btn btn--primary" href="${section.cta.wa ? waHref() : section.cta.href}"${section.cta.wa ? ' target="_blank" rel="noopener"' : ''}>${esc(section.cta.label)}</a></p>` : ''}
  </div>
</section>`;

    case 'leadList':
      return `<section class="section section--narrow">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    ${nl2p(section.body)}
    <ul class="list">
      ${section.items.map((i) => `<li>${esc(i)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

    case 'steps':
      return `<section class="section">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <ol class="steps">
      ${section.items.map((it, idx) => `<li><span class="steps__n">${idx + 1}</span><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>`;

    case 'zonas':
      return `<section class="section section--narrow">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <p class="tags">${section.items.map((z) => `<span>${esc(z)}</span>`).join(' ')}</p>
  </div>
</section>`;

    case 'compare':
      return `<section class="section section--narrow">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <table class="compare">
      <thead><tr><th>${esc(section.colA)}</th><th>${esc(section.colB)}</th></tr></thead>
      <tbody>
        ${section.rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>
</section>`;

    case 'faq':
      return `<section class="section section--narrow">
  <div class="container">
    <h2>Preguntas frecuentes</h2>
    <div class="faq">
      ${section.items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'faqGroups':
      return `<section class="section section--narrow">
  <div class="container">
    ${section.groups.map((g) => `<h2>${esc(g.title)}</h2>
    <div class="faq">
      ${g.items.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n      ')}
    </div>`).join('\n    ')}
  </div>
</section>`;

    case 'faqPreview':
      return `<section class="section section--narrow">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <ul class="list">
      ${section.items.map((q) => `<li>${esc(q)}</li>`).join('\n      ')}
    </ul>
    <p><a class="link" href="${section.href}">Ver todas las preguntas →</a></p>
  </div>
</section>`;

    case 'links':
      return `<section class="section section--narrow">
  <div class="container">
    ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ''}
    <ul class="list list--links">
      ${section.items.map((i) => `<li><a href="${i.href}">${esc(i.title)}</a>${i.body ? ` — ${esc(i.body)}` : ''}</li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

    case 'channels':
      return `<section class="section section--narrow">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <ul class="list">
      ${section.items.map((i) => `<li><strong>${esc(i.label)}:</strong> ${esc(i.value)}${i.note ? ` — ${esc(i.note)}` : ''}</li>`).join('\n      ')}
    </ul>
  </div>
</section>`;

    case 'contactForm':
      return `<section class="section section--narrow">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <p>${esc(section.body)}</p>
    <form class="form" action="/lead-forward.php" method="post">
      <input type="hidden" name="page_url" id="page_url">
      <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
      <label class="field">Nombre completo<input type="text" name="nombre" required></label>
      <label class="field">Número de WhatsApp<input type="tel" name="telefono" required></label>
      <button class="btn btn--primary" type="submit">Enviar mis datos</button>
    </form>
  </div>
</section>`;

    case 'ctaFinal':
      return `<section class="section section--cta">
  <div class="container">
    <p>${esc(section.text)}</p>
    <a class="btn btn--wa btn--lg" href="${waHref()}" target="_blank" rel="noopener" data-ev="wa_click" data-ev-loc="footer_cta">${esc(section.label)}</a>
  </div>
</section>`;

    default:
      return '';
  }
}

function renderHero(page) {
  return `<section class="hero">
  <div class="container">
    <h1>${esc(page.h1)}</h1>
    <p class="hero__sub">${esc(page.subcopy)}</p>
    ${page.trustBar ? `<p class="hero__trust">${page.trustBar.map((t) => esc(t)).join(' · ')}</p>` : ''}
    <a class="btn btn--wa btn--lg" href="${waHref()}" target="_blank" rel="noopener" data-ev="wa_click" data-ev-loc="hero">${esc(page.heroCta || 'Solicitá tu Valuación por WhatsApp')}</a>
  </div>
</section>`;
}

function renderPage(page) {
  const canonical = `${SITE}${page.slug}`;
  const body = page.sections.map(block).join('\n');
  return `<!doctype html>
<html lang="es-PY">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>var WA_NUMBER = '${WA_NUMBER}';</script>
<script>var ANALYTICS_ID = '';</script>
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_PY">
<meta property="og:site_name" content="Tasación.com.py">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${SITE}/assets/img/og-tasacion-com-py.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230F3D5C'/%3E%3Cpath d='M8 20.5h16M8 20.5 16 8l8 12.5' stroke='%23FAF9F7' stroke-width='2.1' fill='none' stroke-linejoin='round'/%3E%3Cpath d='M6 25h20' stroke='%23A98B57' stroke-width='2'/%3E%3C/svg%3E">
<meta name="theme-color" content="#0F3D5C">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Libre+Baskerville:wght@700&display=swap">
<link rel="stylesheet" href="/assets/css/site.css">
</head>
<body>
${renderNav(page.slug)}
<main>
${renderHero(page)}
${body}
</main>
${renderFooter()}
<script src="/assets/js/site.js"></script>
</body>
</html>
`;
}

for (const page of PAGES) {
  const outPath = page.slug === '/' ? 'index.html' : join(page.slug.replace(/^\//, ''), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, renderPage(page));
  console.log('wrote', outPath);
}
