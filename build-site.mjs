// build-site.mjs — genera las 13 páginas + 404.html + gracias.html desde
// content.mjs. node build-site.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  PAGES, EXTRAS, NAV, WA_NUMBER, SITE, TASADOR, PRECIO_TXT, WA_MENU,
  CRED_CSJ, CRED_ARQ, PLAZO_TXT, IVA_TXT, FACTURA_TXT, PRECIOS,
} from './content.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');
const waHref = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const nl2p = (body) => body.split('\n\n').map((p) => `<p>${esc(p)}</p>`).join('\n');

// optionId 'consulta' + page.waConsultaText (§3.5, corporativa/franja-de-dominio):
// esa página sobreescribe el texto de la 5ª opción del menú, en el panel y en
// cualquier trigger que abra 'consulta' desde esa página.
function waOptionText(optionId, ctx, page) {
  const opt = WA_MENU.options.find((o) => o.id === optionId) || WA_MENU.options[0];
  if (optionId === 'consulta' && page && page.waConsultaText) return page.waConsultaText;
  return opt.text(ctx);
}

function waOptionHref(optionId, ctx, page) {
  return waHref(waOptionText(optionId, ctx, page));
}

// -------------------------------------------------------------- icons (SVG)
const ICON_CHECK = `<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_ARROW = `<svg viewBox="0 0 16 16" fill="none"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_WA = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.94 1.35-.5.05-.95.23-3.2-.67-2.7-1.06-4.4-3.8-4.53-3.98-.13-.18-1.08-1.44-1.08-2.75 0-1.3.68-1.95.93-2.21.24-.27.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.6.46.23.55.77 1.9.84 2.03.07.14.11.3.02.48-.09.18-.13.29-.27.44-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.15.27.67 1.1 1.44 1.79.99.88 1.82 1.16 2.08 1.29.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.18-.27.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.44.2.5.31.07.11.07.63-.17 1.31Z"/></svg>`;
const ICON_SEAL = `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" fill="#A98B57"/><path d="M12 20.5l5.5 5.5L28 15" stroke="#0F3D5C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_BURGER = `<svg viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

// ---------------------------------------------------------------- header/nav
function renderNav(current, ctx) {
  const items = NAV.map((i) => {
    if (i.children) {
      const childActive = i.children.some((c) => c.href === current);
      const active = i.href === current || childActive ? ' aria-current="page"' : '';
      const subItems = i.children.map((c) => `<li><a href="${c.href}"${c.href === current ? ' aria-current="page"' : ''}>${esc(c.label)}</a></li>`).join('\n            ');
      return `<li class="hdr__nav-item hdr__nav-item--has-children">
          <a href="${i.href}"${active}>${esc(i.label)}</a>
          <ul class="hdr__dropdown">
            ${subItems}
          </ul>
        </li>`;
    }
    const active = i.href === current ? ' aria-current="page"' : '';
    return `<li><a href="${i.href}"${active}>${esc(i.label)}</a></li>`;
  }).join('\n        ');
  const panelItems = NAV.map((i) => {
    if (i.children) {
      const subPanelItems = i.children.map((c) => `<li><a href="${c.href}">${esc(c.label)}</a></li>`).join('\n            ');
      return `<li class="hdr__panel-item hdr__panel-item--has-children">
          <a href="${i.href}">${esc(i.label)}</a>
          <ul class="hdr__panel-sub">
            ${subPanelItems}
          </ul>
        </li>`;
    }
    return `<li><a href="${i.href}">${esc(i.label)}</a></li>`;
  }).join('\n        ');
  return `<header class="hdr" data-hdr>
  <div class="container hdr__row">
    <a href="/" class="hdr__brand">Tasación<span>.com.py</span></a>
    <nav class="hdr__nav" aria-label="Principal">
      <ul>
        ${items}
      </ul>
    </nav>
    <a class="wa-pill" href="${waHref(WA_MENU.fallback(ctx))}" target="_blank" rel="noopener" data-wa-trigger data-wa-anchor="header" data-ev="wa_click" data-ev-loc="header" aria-haspopup="dialog" aria-controls="wa-menu" aria-expanded="false">${ICON_WA}WhatsApp</a>
    <a class="wa-round" href="${waHref(WA_MENU.fallback(ctx))}" target="_blank" rel="noopener" data-wa-trigger data-wa-anchor="header" data-ev="wa_click" data-ev-loc="header" aria-haspopup="dialog" aria-controls="wa-menu" aria-expanded="false" aria-label="WhatsApp">${ICON_WA}</a>
    <button type="button" class="hdr__burger" data-hdr-burger aria-expanded="false" aria-controls="hdr-panel" aria-label="Abrir menú">${ICON_BURGER}</button>
  </div>
  <div class="hdr__panel" id="hdr-panel" data-hdr-panel>
    <div class="container">
      <ul>
        ${panelItems}
      </ul>
    </div>
  </div>
</header>`;
}

function renderFooter() {
  return `<footer class="ftr">
  <div class="container ftr__grid">
    <div>
      <p class="ftr__brand">Tasación<span>.com.py</span></p>
      <p class="ftr__muted">Tasador responsable: Fernando Capurro · ${esc(CRED_CSJ)}</p>
      <p class="ftr__muted">Informe oficial de tasación pago · Tasación para vender, costo cubierto por tu corredor</p>
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
        <li><a href="/tasaciones/franja-de-dominio/">Franja de Dominio</a></li>
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
      <p><a class="ftr__wa" href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener" data-ev="wa_click" data-ev-loc="footer">WhatsApp: +595 995 628862</a></p>
      <p><a href="tel:+595995628862">Llamar</a></p>
    </div>
  </div>
  <div class="container ftr__base">
    <p>© <span id="yr"></span> Tasación.com.py — Asunción, Paraguay.</p>
  </div>
</footer>`;
}

// ------------------------------------------------------------------ wa menu
function renderWaMenu(ctx, page) {
  const defaultOption = (page && page.hero && page.hero.primary && page.hero.primary.waOption) || 'informe';
  const options = WA_MENU.options.map((o) => `<li><a class="wa-menu__option${o.id === defaultOption ? ' wa-menu__option--current' : ''}" href="${waHref(waOptionText(o.id, ctx, page))}" data-wa-option="${o.id}" data-ev="wa_click" data-ev-loc="menu">
          <span class="wa-menu__opt-title">${esc(o.label)}</span>
          <span class="wa-menu__opt-sub">${esc(o.sub)}</span>
        </a></li>`).join('\n        ');
  return `<div class="wa-menu" id="wa-menu" data-wa-menu hidden>
  <div class="wa-menu__backdrop" data-wa-close aria-hidden="true"></div>
  <div class="wa-menu__panel" data-wa-panel role="dialog" aria-labelledby="wa-menu-title" aria-modal="true">
    <div class="wa-menu__head">
      <p id="wa-menu-title">¿Qué necesitás?<small>Estás en: ${esc(ctx)}</small></p>
      <button type="button" class="wa-menu__close" data-wa-close aria-label="Cerrar">&times;</button>
    </div>
    <ul class="wa-menu__list">
        ${options}
    </ul>
    <p class="wa-menu__foot">${ICON_WA}Se abre WhatsApp con el mensaje ya escrito.</p>
  </div>
</div>
<a class="wa-fab" href="${waOptionHref(defaultOption, ctx, page)}" target="_blank" rel="noopener" data-wa-trigger data-wa-open="${defaultOption}" data-wa-anchor="fab" aria-haspopup="dialog" aria-controls="wa-menu" aria-expanded="false" aria-label="Abrir WhatsApp" data-ev="wa_click" data-ev-loc="fab">${ICON_WA}</a>`;
}

// -------------------------------------------------------------------- blocks
function block(section, page) {
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
        const accent = it.accent ? ' card--accent' : it.muted ? ' card--muted' : '';
        const inner = `<h3>${esc(it.title)}</h3><p>${esc(it.body)}</p>${it.href ? `<a class="link" href="${it.href}">${esc(it.label || 'Saber más')} ${ICON_ARROW}</a>` : ''}`;
        return `<div class="card${accent}">${inner}</div>`;
      }).join('\n      ')}
    </div>
    ${section.cta ? `<p class="section__cta"><a class="btn btn--primary" href="${section.cta.href}">${esc(section.cta.label)}</a></p>` : ''}
  </div>
</section>`;
    }

    case 'lead':
      return `<section class="section section--narrow"${section.id ? ` id="${section.id}"` : ''}>
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    ${nl2p(section.body)}
    ${section.cta ? `<p><a class="btn btn--primary" href="${section.cta.wa ? waOptionHref('informe', page.waContext, page) : section.cta.href}"${section.cta.wa ? ' target="_blank" rel="noopener"' : ''}>${esc(section.cta.label)}</a></p>` : ''}
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

    case 'priceBlock': {
      const eyebrow = section.eyebrow || 'El informe oficial';
      const ctaLabel = section.ctaLabel || 'Pedir mi informe por WhatsApp';
      const waOption = section.waOption || 'informe';
      const figureTxt = section.figure || PRECIO_TXT;
      const note = section.note || 'según tipo y tamaño del inmueble; te confirmamos el monto exacto por WhatsApp antes de agendar la visita';
      return `<section class="price-panel" id="incluye">
  <div class="container">
    <div>
      <span class="eyebrow">${esc(eyebrow)}</span>
      <h2>${esc(section.heading)}</h2>
      <ul class="price-panel__includes">
        ${section.includes.map((i) => `<li>${ICON_CHECK}${esc(i)}</li>`).join('\n        ')}
      </ul>
    </div>
    <div class="price-panel__card">
      <span class="eyebrow eyebrow--dark">Precio</span>
      <p class="price-panel__figure">${figureTxt.split(' a ').map(esc).join(' a<br>')}</p>
      <p class="price-panel__note">${esc(note)}</p>
      <ul class="price-panel__rows">
        ${section.rows.map((r) => `<li><span>${esc(r[0])}</span><span>${esc(r[1])}</span></li>`).join('\n        ')}
      </ul>
      ${section.pie ? `<p class="price-panel__pie">${esc(section.pie)}</p>` : ''}
      <a class="btn btn--onlight" href="${waOptionHref(waOption, page.waContext, page)}" target="_blank" rel="noopener" data-wa-trigger data-wa-open="${waOption}" data-ev="wa_click" data-ev-loc="price">${ICON_WA}${esc(ctaLabel)}</a>
    </div>
  </div>
</section>`;
    }

    case 'useCases':
      return `<section class="section use-cases"${section.id ? ` id="${section.id}"` : ''}>
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <div class="grid grid--3">
      ${section.items.map((it) => `<a class="card${it.accent ? ' card--accent' : it.muted ? ' card--muted' : ''}" href="${it.href}">
        <span class="eyebrow">${esc(it.eyebrow || it.title)}</span>
        <p>${esc(it.body)}</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>`;

    case 'credentials':
      return `<section class="section credentials">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <div class="grid grid--2">
      <div class="card">
        <h3>El Tasador Fernando Capurro</h3>
        <ul class="list">
          ${section.tasador.map((c) => `<li>${ICON_CHECK}${esc(c)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="card">
        <h3>Para crédito</h3>
        <p>${esc(section.credito)}</p>
      </div>
    </div>
    <p class="credentials__pie">${ICON_CHECK}Informe firmado en ${esc(section.plazo)} · ${esc(FACTURA_TXT)}</p>
  </div>
</section>`;

    case 'pricingTiers':
      return `<section class="section pricing-tiers" id="precios">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <div class="grid grid--3">
      ${section.tiers.map((t) => `<div class="card pricing-tiers__card${t.highlight ? ' card--accent' : ''}">
        <span class="eyebrow">${esc(t.eyebrow)}</span>
        <h3>${esc(t.title)}</h3>
        <p class="pricing-tiers__figure">${esc(t.price)} <span>${esc(IVA_TXT)}</span></p>
        <p class="pricing-tiers__meta"><strong>Firma:</strong> ${esc(t.firma)}</p>
        <p class="pricing-tiers__meta"><strong>Plazo:</strong> ${esc(t.plazo)}</p>
        <ul class="list">
          ${t.incluye.map((i) => `<li>${ICON_CHECK}${esc(i)}</li>`).join('\n          ')}
        </ul>
        ${t.nota ? `<p class="pricing-tiers__nota">${esc(t.nota)}</p>` : ''}
        <a class="btn ${t.highlight ? 'btn--primary' : 'btn--ghost'}" href="${waOptionHref(t.waOption, page.waContext, page)}" target="_blank" rel="noopener" data-wa-trigger data-wa-open="${t.waOption}" data-ev="wa_click" data-ev-loc="pricing_tier">${esc(t.cta)}</a>
      </div>`).join('\n      ')}
    </div>
    ${section.pie ? `<p class="pricing-tiers__foot">${esc(section.pie)}</p>` : ''}
  </div>
</section>`;

    case 'valueBlock':
      return `<section class="section value-block">
  <div class="container value-block__grid">
    <div class="value-block__lede">
      <h2>${esc(section.heading)}</h2>
      ${section.lede && !section.short ? `<p class="lede">${esc(section.lede)}</p>` : ''}
    </div>
    <ol class="steps value-block__items">
      ${(section.short ? section.items.slice(0, 3) : section.items).map((it) => `<li><span class="steps__n">${ICON_CHECK}</span><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>`;

    case 'freeAside':
      return `<section class="section section--narrow">
  <div class="container">
    <div class="free-aside">
      <div class="free-aside__text">
        <span class="free-aside__label">También disponible</span>
        <h3>${esc(section.heading)}</h3>
        <p>${esc(section.body)}</p>
      </div>
      <div class="free-aside__cta">
        <a class="btn btn--ghost" href="${section.cta.href}">${esc(section.cta.label)}</a>
      </div>
    </div>
  </div>
</section>`;

    case 'ctaBand':
      return `<section class="cta-band">
  <div class="container">
    <div>
      <span class="eyebrow eyebrow--dark">${esc(section.eyebrow)}</span>
      <h2>${esc(section.heading)}</h2>
      <p>${esc(section.body)}</p>
    </div>
    <div class="cta-band__actions">
      <a class="btn btn--wa" href="${waOptionHref(section.primary.waOption, page.waContext, page)}" target="_blank" rel="noopener" data-wa-trigger data-wa-open="${section.primary.waOption}" data-ev="wa_click" data-ev-loc="band">${ICON_WA}${esc(section.primary.label)}</a>
      <a class="link" href="${waOptionHref(section.secondaryLink.waOption, page.waContext, page)}" target="_blank" rel="noopener" data-wa-trigger data-wa-open="${section.secondaryLink.waOption}" data-ev="wa_click" data-ev-loc="band_secondary">${esc(section.secondaryLink.label)}</a>
    </div>
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
    ${section.heading ? `<h2>${esc(section.heading)}</h2>` : '<h2>Preguntas frecuentes</h2>'}
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
    <p><a class="link" href="${section.href}">Ver todas las preguntas ${ICON_ARROW}</a></p>
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

    case 'contactForm': {
      const radios = (section.mensajeOptions || []).map((o, idx) => `<label><input type="radio" name="mensaje" value="${attr(o.value)}"${o.default ? ' checked' : ''}> ${esc(o.label)}</label>`).join('\n          ');
      return `<section class="section section--narrow">
  <div class="container">
    <h2>${esc(section.heading)}</h2>
    <p>${esc(section.body)}</p>
    <form class="form" action="/lead-forward.php" method="post">
      <input type="hidden" name="page_url" id="page_url">
      <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
      <label class="field">Nombre completo<input type="text" name="nombre" required></label>
      <label class="field">Número de WhatsApp<input type="tel" name="telefono" required></label>
      <label class="field">Email (opcional)<input type="email" name="email"></label>
      ${radios ? `<div class="radios">\n          ${radios}\n        </div>` : ''}
      <button class="btn btn--primary" type="submit">Enviar mis datos</button>
    </form>
  </div>
</section>`;
    }

    default:
      return '';
  }
}

// -------------------------------------------------------------------- hero
function heroPicture(img, eager, seal) {
  const b = img.base;
  const srcset = (ext) => [640, 1280, 1920].map((w) => `/assets/img/${b}-${w}.${ext} ${w}w`).join(', ');
  return `<div class="hero__pic-wrap">
      <picture class="hero__pic">
        <source type="image/avif" srcset="${srcset('avif')}" sizes="(min-width:900px) 45vw, 100vw">
        <source type="image/webp" srcset="${srcset('webp')}" sizes="(min-width:900px) 45vw, 100vw">
        <img src="/assets/img/${b}-1280.webp" alt="${esc(img.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>
      </picture>
      ${seal || ''}
    </div>`;
}

function renderChip(page) {
  if (page.kind === 'secondary-free') return '';
  if (page.showPriceChip) {
    if (page.priceChip) return `<p class="offer-chip offer-chip--price"><strong>${esc(page.priceChip.strong)}</strong><span>${esc(page.priceChip.note)}</span></p>`;
    return `<p class="offer-chip offer-chip--price"><strong>Informe oficial: ${esc(PRECIO_TXT)}</strong><span>según tipo y tamaño del inmueble</span></p>`;
  }
  return `<p class="offer-chip"><strong>Informe oficial de tasación</strong><span>pago · firmado por el Tasador ${esc(TASADOR)}</span></p>`;
}

function renderHero(page) {
  const h1Class = page.kind === 'vertical' || page.kind === 'vertical-b2b' ? ' class="h1--vertical"' : '';
  const primary = page.hero.primary;
  const primaryHref = waOptionHref(primary.waOption, page.waContext, page);
  const secondary = page.hero.secondary
    ? `<a class="btn btn--ghost" href="${page.hero.secondary.href}">${esc(page.hero.secondary.label)} ${ICON_ARROW}</a>`
    : '';
  const freeLink = page.hero.freeLink
    ? `<p class="hero__freelink"><a href="${page.hero.freeLink.href}">${esc(page.hero.freeLink.label)}</a></p>`
    : '';
  const seal = page.kind === 'home' ? `<div class="hero__seal">${ICON_SEAL}<span><strong>Informe firmado por tasador</strong><span>${esc(TASADOR)} · tasador responsable</span></span></div>` : '';
  const text = `<div class="hero__text">
    ${page.eyebrow ? `<span class="eyebrow">${esc(page.eyebrow)}</span>` : ''}
    <h1${h1Class}>${esc(page.h1)}</h1>
    <p class="hero__sub">${esc(page.subcopy)}</p>
    ${renderChip(page)}
    <div class="hero__actions">
      <a class="btn btn--primary" href="${primaryHref}" target="_blank" rel="noopener" data-wa-trigger data-wa-open="${primary.waOption}" data-ev="wa_click" data-ev-loc="hero">${ICON_WA}${esc(primary.label)}</a>
      ${secondary}
    </div>
    ${freeLink}
  </div>`;
  const pic = page.heroImage ? heroPicture(page.heroImage, true, seal) : '';
  return `<section class="hero${page.heroImage ? ' hero--split' : ''}">
  <div class="container hero__row">
    ${text}
    ${pic}
  </div>
</section>`;
}

function renderTrustRow() {
  const items = [
    CRED_CSJ,
    `Informe firmado en ${PLAZO_TXT}`,
    'Precio anclado por finalidad, antes de la visita',
  ];
  return `<div class="trustrow">
  <div class="container">
    ${items.map((t) => `<p class="trustrow__item">${ICON_CHECK}${esc(t)}</p>`).join('\n    ')}
  </div>
</div>`;
}

// -------------------------------------------------------------------- faq/ld
function collectFaqItems(page) {
  const items = [];
  for (const s of page.sections) {
    if (s.type === 'faq') items.push(...s.items);
    if (s.type === 'faqGroups') for (const g of s.groups) items.push(...g.items);
  }
  return items;
}

function faqJsonLd(page) {
  const items = collectFaqItems(page);
  if (items.length === 0) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>\n`;
}

function professionalServiceJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Tasación.com.py',
    url: SITE,
    telephone: `+${WA_NUMBER}`,
    areaServed: ['Asunción', 'Gran Asunción'],
    priceRange: 'Gs. 800.000 – 2.500.000',
    founder: {
      '@type': 'Person',
      name: 'Fernando Capurro',
      jobTitle: 'Perito Tasador',
      hasCredential: [CRED_CSJ, CRED_ARQ],
    },
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>\n`;
}

function serviceJsonLd(page) {
  if (page.kind !== 'vertical' && page.kind !== 'vertical-b2b') return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: page.h1,
    provider: { '@type': 'ProfessionalService', name: 'Tasación.com.py' },
    areaServed: ['Asunción', 'Gran Asunción'],
  };
  // vertical-b2b (franja de dominio): precio por proyecto, sin rango publicado.
  if (page.kind === 'vertical') {
    data.offers = [{ '@type': 'Offer', priceCurrency: 'PYG', priceSpecification: { '@type': 'PriceSpecification', minPrice: PRECIOS.compraventa.min, maxPrice: PRECIOS.compraventa.max, priceCurrency: 'PYG' } }];
  }
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>\n`;
}

function breadcrumbJsonLd(page) {
  const parts = page.slug.split('/').filter(Boolean);
  if (parts.length < 2) return '';
  const itemListElement = [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE + '/' }];
  let acc = '';
  parts.forEach((p, idx) => {
    acc += '/' + p;
    itemListElement.push({ '@type': 'ListItem', position: idx + 2, name: p, item: SITE + acc + '/' });
  });
  const data = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>\n`;
}

// -------------------------------------------------------------------- page
function renderPage(page, opts = {}) {
  const canonicalUrl = page.noindex ? `${SITE}/${page.slug}` : `${SITE}${page.slug}`;
  const body = page.sections.map((s) => block(s, page)).join('\n');
  const trust = !page.noindex ? renderTrustRow() : '';
  return `<!doctype html>
<html lang="es-PY">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>var WA_NUMBER = '${WA_NUMBER}';</script>
<script>var ANALYTICS_ID = '';</script>
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex,nofollow">' : ''}
<link rel="canonical" href="${canonicalUrl}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_PY">
<meta property="og:site_name" content="Tasación.com.py">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:image" content="${SITE}/assets/img/og-tasacion-com-py.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230F3D5C'/%3E%3Cpath d='M8 20.5h16M8 20.5 16 8l8 12.5' stroke='%23FAF9F7' stroke-width='2.1' fill='none' stroke-linejoin='round'/%3E%3Cpath d='M6 25h20' stroke='%23A98B57' stroke-width='2'/%3E%3C/svg%3E">
<meta name="theme-color" content="#0F3D5C">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Libre+Baskerville:wght@700&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Libre+Baskerville:wght@700&display=swap"></noscript>
<link rel="stylesheet" href="/assets/css/site.css">
${faqJsonLd(page)}${professionalServiceJsonLd()}${serviceJsonLd(page)}${breadcrumbJsonLd(page)}</head>
<body data-page-context="${attr(page.waContext)}">
${renderNav(page.slug, page.waContext)}
<main>
${renderHero(page)}
${trust}
${body}
</main>
${renderFooter()}
${renderWaMenu(page.waContext, page)}
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

for (const page of EXTRAS) {
  writeFileSync(page.slug, renderPage(page));
  console.log('wrote', page.slug);
}
