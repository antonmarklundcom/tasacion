# BUILD-SPEC — tasacion.com.py v2 (PHP router, replaces GHL funnel)

Written 2026-09-03. Executed by a builder agent. Everything below is decided;
do not re-litigate. Where a value is missing, the spec says "PLACEHOLDER" and
tells you what to render meanwhile. Ask nothing; deviate only when a rule here
is impossible, and list every deviation in your final report.

## 0. Business facts (the spine of every page)

Two products, never confused:

| | **Informe pericial oficial** | **Valoración comercial para vender** |
|---|---|---|
| Who | Tasador habilitado (perito), firma el informe | Equipo inmobiliario (asesor), NO es el perito |
| Price | **Gs. 800.000 – 1.500.000** según tipo de inmueble y superficie | **Sin costo** |
| Validity | Legal: bancos, juicios, sucesiones, divisiones, empresas | Ninguna validez legal. Referencia de precio de venta + plan de comercialización |
| Includes | Visita, medición, comparables, metodología, fotos, firma | Rango de precio de venta, comparables publicados, plan para vender |
| Condition | Presupuesto confirmado antes de empezar | Solo para propiedades que se van a poner en venta en Gran Asunción |
| Channel | **WhatsApp** (every WhatsApp button on the site is for THIS product) | **Form only**. No WhatsApp CTA anywhere on that path |

Why: the appraiser has been flooded with free-valuation requests over WhatsApp.
Every WhatsApp prefill text must say "informe pericial" so the intent is
unambiguous. The free path collects a lead (form → VenderCRM + email) for the
realtor, who uses it to try to win an exclusive listing.

Voice: Spanish, Paraguayan voseo (escribinos, contanos, tenés), like the legacy
copy in `docs/legacy-copy/*.txt`. Precise, unhurried, no hype, no exclamation
marks. Reuse legacy paragraphs wherever they fit (FAQ answers, factor
explanations, document guidance); rewrite anything that references "tasación
online gratis por WhatsApp" — that offer no longer exists.

Hard rules:
- Never invent a name, license number, RUC, address, review, years of
  experience, or count of appraisals. Placeholders come from `config/site.php`
  and render as neutral copy when empty (see §4).
- Never claim a bank "accepts" our reports. Wording for hipotecaria: "informe
  pericial con el formato que exigen bancos, cooperativas y financieras;
  confirmá con tu entidad si acepta tasadores externos".
- Never show the price without the qualifier "según tipo de inmueble y
  superficie". Never show a price for the free path.
- Format guaraníes as `Gs. 800.000` (dot thousands). Helper in `lib/helpers.php`.

## 1. Stack and hosting

Hostinger shared hosting, Apache + PHP 8.x, docroot = `public_html`. No Node at
runtime. No database. Plain PHP router with templates.

Local dev: `php -S 127.0.0.1:8080 index.php` from the repo root. `index.php`
must start with the cli-server static-file passthrough so this works:

```php
if (PHP_SAPI === 'cli-server') {
    $f = __DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (is_file($f)) return false;
}
```

## 2. File tree (final; delete everything else from the old build)

```
/.htaccess
/index.php                     router
/config/site.php               all site settings (returns array)
/config/secrets.example.php    template for keys; copied to secrets.php on the server (gitignored)
/lib/helpers.php               h(), url(), wa_url(), gs(), render(), page registry
/lib/log.php                   append_log($file, array $row)
/templates/layout/head.php     <head>: meta, canonical, OG, JSON-LD, fonts, css
/templates/layout/header.php   nav
/templates/layout/footer.php   footer + consent dialog + scripts
/templates/partials/*.php      reusable blocks (dual-path, factor-grid, faq, cross-links, wa-cta, selector, price-block, lead-form)
/templates/pages/*.php         one per route (see §3)
/go/whatsapp.php               tracked redirect
/go/stats.php                  click report, HTTP Basic auth
/api/lead.php                  form handler (VenderCRM + Resend + log)
/storage/.htaccess             Deny from all
/storage/.gitkeep
/assets/css/site.css
/assets/js/site.js
/assets/img/                   KEEP the existing files untouched
/robots.txt
/sitemap.xml
/404 handled by router (no 404.html)
/tools/build-zip.sh            makes dist/tasacion-com-py.zip
/tools/check.sh                smoke test against php -S
/tools/build-images.mjs        moved from root (dev only)
/package.json, package-lock.json   moved into /tools/ (dev only)
/docs/                         specs, legacy copy, PLACEHOLDERS.md (not deployed)
/.gitignore                    add: config/secrets.php, storage/*.log, dist/, node_modules/
/.claude/launch.json           update command to `php -S 127.0.0.1:8080 index.php`
```

Delete: all old `*.html` at root and in `servicios/ zonas/ guias/ cotizador/
contacto/ preguntas-frecuentes/`, `lead-forward.php`, `serve.mjs`,
`BUILD-SPEC.md`, `NEXT-STEPS.md`. Move `PLACEHOLDERS.md` to `docs/` and rewrite
it per §11.

`.htaccess`:
```
Options -Indexes
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [L]
<FilesMatch "\.(log|md|example\.php)$">
  Require all denied
</FilesMatch>
```
Plus `config/.htaccess`, `lib/.htaccess`, `templates/.htaccess`, `storage/.htaccess`,
`docs/.htaccess` each containing `Require all denied`.

## 3. Routes

Page routes (all end with `/`; router 301s a missing trailing slash to the
slashed form; `/index.php` and `?`-less duplicates are not a concern):

| Path | Template | Title (≤60 chars) |
|---|---|---|
| `/` | home | Tasación de inmuebles en Asunción · Informe pericial |
| `/tasaciones/casas/` | tasacion-casas | Tasación de casas en Asunción |
| `/tasaciones/departamentos/` | tasacion-departamentos | Tasación de departamentos en Asunción |
| `/tasaciones/terrenos/` | tasacion-terrenos | Tasación de terrenos en Asunción y Gran Asunción |
| `/tasaciones/corporativa/` | tasacion-corporativa | Tasación corporativa de inmuebles |
| `/tasaciones/hipotecaria/` | tasacion-hipotecaria | Tasación hipotecaria · Informe para garantía |
| `/tasaciones/locales-comerciales/` | tasacion-locales | Tasación de locales comerciales |
| `/tasaciones/campos/` | tasacion-campos | Tasación de campos y estancias |
| `/valuacion-para-vender/` | valuacion | Valoración para vender · Sin costo |
| `/informes-periciales/` | informes | Informe pericial de tasación · Validez legal |
| `/nosotros/` | nosotros | Quiénes somos |
| `/preguntas-frecuentes/` | faq | Preguntas frecuentes sobre tasación |
| `/contacto/` | contacto | Contacto |
| `/gracias/` | gracias (noindex) | Recibimos tu solicitud |
| `/politica-de-privacidad/` | privacidad | Política de privacidad |
| `/politica-de-cookies/` | cookies | Política de cookies |
| `/terminos-y-condiciones/` | terminos | Términos y condiciones |

301 redirects from the old build (exact paths, with or without trailing slash):
```
/servicios/tasacion-de-casas-y-departamentos/ → /tasaciones/casas/
/servicios/tasacion-de-terrenos/              → /tasaciones/terrenos/
/servicios/tasacion-de-locales-comerciales/   → /tasaciones/locales-comerciales/
/servicios/informe-de-tasacion/               → /informes-periciales/
/servicios/tasacion-online/                   → /valuacion-para-vender/
/zonas/*                                      → /
/cotizador/                                   → /contacto/
/guias/*                                      → /preguntas-frecuentes/
/gracias.html                                 → /gracias/
```
Anything else → 404 page (status 404, uses layout, links to home and contacto).

Page registry lives in `lib/helpers.php` as one array: path, template, title,
description, `nav` label (or null), `type` key for WhatsApp prefill, `sitemap`
bool. Templates read their own entry. Sitemap lists the 16 indexable pages
(everything except gracias) with `<lastmod>2026-09-03</lastmod>`.

## 4. `config/site.php`

```php
<?php
$secrets = is_file(__DIR__ . '/secrets.php') ? require __DIR__ . '/secrets.php' : [];
$env = fn(string $k, string $d = '') => (string)(getenv($k) ?: ($secrets[$k] ?? $d));
return [
  'site_name'   => 'Tasación.com.py',
  'base_url'    => 'https://tasacion.com.py',
  'locale'      => 'es_PY',
  'wa_number'   => '595995628862',     // digits only, one place for the whole site
  'wa_display'  => '0995 628 862',
  'price_min'   => 800000,
  'price_max'   => 1500000,
  'price_note'  => 'según tipo de inmueble y superficie',   // IVA: PLACEHOLDER, see docs/PLACEHOLDERS.md
  'coverage'    => ['Asunción','Luque','San Lorenzo','Fernando de la Mora','Lambaré','Capiatá','Mariano Roque Alonso','Ñemby','Villa Elisa','San Antonio','Limpio','Areguá','Itauguá','Capiatá'],
  // PLACEHOLDERS — empty means "render neutral copy", never render the brackets
  'perito_name'    => '',   // e.g. 'Arq. Nombre Apellido'
  'perito_license' => '',   // e.g. 'Matrícula N° 1234'
  'contact_email'  => '',   // shown in footer/contacto only when set
  'contact_phone'  => '',   // landline; shown only when set
  'ruc'            => '',
  'address'        => 'Asunción, Paraguay',
  // integrations (from secrets.php or env)
  'analytics_id'      => $env('ANALYTICS_ID'),        // G-XXXX or GTM-XXXX
  'vendercrm_url'     => $env('VENDERCRM_URL'),
  'vendercrm_api_key' => $env('VENDERCRM_API_KEY'),
  'resend_api_key'    => $env('RESEND_API_KEY'),
  'resend_from'       => $env('RESEND_FROM', 'Tasación.com.py <leads@tasacion.com.py>'),
  'lead_to_email'     => $env('LEAD_TO_EMAIL'),
  'stats_user'        => $env('STATS_USER', 'admin'),
  'stats_password'    => $env('STATS_PASSWORD'),      // empty = stats page disabled (403)
  'log_dir'           => __DIR__ . '/../storage',
];
```
Remove the duplicate 'Capiatá'. `secrets.example.php` returns the same keys
with empty strings and a comment per key saying where it comes from.

Placeholder rendering rule: on `/nosotros/` the perito card shows name +
license when set; when empty it shows "Tasador habilitado con matrícula
profesional vigente" and an HTML comment `<!-- PLACEHOLDER: perito_name /
perito_license in config/site.php -->`. Footer shows email/phone lines only
when set. Never print square-bracket placeholders to visitors.

## 5. WhatsApp tracking

`lib/helpers.php`:
```php
function wa_url(string $src, string $type = 'general', string $zone = ''): string
// returns '/go/whatsapp.php?src=' . rawurlencode($src) . '&t=' . $type [. '&z=' . zone]
```
Every WhatsApp link on the site is built with `wa_url()`. `src` naming:
`<page>-<position>`, e.g. `home-hero`, `home-dual`, `home-final`, `casas-hero`,
`casas-final`, `nav-cta`, `footer`, `sticky-mobile`. Grep for `wa.me` in
templates must return nothing.

`go/whatsapp.php`:
1. Read `src` (a-z0-9-_ only, max 40, else `unknown`), `t` (key of the map
   below, else `general`), `z` (letters/spaces, max 40).
2. Prefill text map (all start with "Hola, quiero cotizar un informe pericial"):
   - general: `Hola, quiero cotizar un informe pericial de tasación.`
   - casa: `... de tasación de una casa{ en Z}.`
   - departamento: `... de un departamento{ en Z}.`
   - terreno: `... de un terreno{ en Z}.`
   - corporativa: `... de tasación corporativa (inmueble de empresa){ en Z}.`
   - hipotecaria: `... de tasación hipotecaria para presentar como garantía{ en Z}.`
   - local: `... de un local comercial{ en Z}.`
   - campo: `... de un campo / estancia{ en Z}.`
   - informe: `... . Necesito el informe para: (sucesión / juicio / banco / empresa / otro).`
   - contacto: `Hola, tengo una consulta sobre tasación de inmuebles.`
3. Append one JSON line to `storage/wa-clicks.log`: `ts` (ISO 8601 UTC), `src`,
   `t`, `z`, `ref` (HTTP_REFERER path only), `ua` (first 120 chars),
   `ip_hash` (sha256 of IP + date, first 12 chars — no raw IPs stored).
   Use `LOCK_EX`, ignore failures.
4. `header('Location: https://wa.me/<number>?text=<rawurlencode(text)>', true, 302)`.
   Also send `Cache-Control: no-store`. Method GET only; HEAD returns 302 too
   without logging.

`go/stats.php`:
- HTTP Basic auth against `stats_user`/`stats_password`; if password empty →
  403 with plain text "stats disabled". Use `hash_equals`.
- Parses `storage/wa-clicks.log` and `storage/leads.log`.
- Plain HTML (site CSS ok): totals (today, 7d, 30d, all) for clicks and leads;
  table of clicks by `src` (30d and all); table by day (last 30); table by `t`;
  last 50 raw click rows; last 20 leads (form, tipo, zona, ts — no phone).
- `noindex`, `robots.txt` disallows `/go/` and `/api/`.

Client side: keep `data-ev="wa_click" data-ev-loc="<src>"` on WhatsApp links
and push to `dataLayer` on click as the old site.js did (analytics stays
consent-gated, §9). Server log is the source of truth.

## 6. Lead form → `api/lead.php`

Two forms post here (method POST, `action="/api/lead.php"`):

**Form A — `/valuacion-para-vender/`** (`form=valuacion`): nombre, telefono*,
email, tipo (select: Casa, Departamento, Terreno, Local comercial, Dúplex,
Depósito/galpón, Otro), zona (select from `coverage` + "Otra"), superficie
(text, m² aprox.), vende (radio: "Sí, quiero vender" / "Estoy evaluando" /
"Solo quiero saber el valor"), plazo (select: "Este mes", "En 1–3 meses",
"En 3–6 meses", "Sin fecha"), mensaje, honeypot `website`, hidden page_url.

**Form B — `/contacto/`** (`form=contacto`): nombre, telefono*, email, motivo
(select: "Informe pericial (pago)", "Valoración para vender (sin costo)",
"Otra consulta"), mensaje, honeypot, page_url.

Handler (port the logic from the old `lead-forward.php` visible in git history
`git show c9ab616:lead-forward.php`, then extend):
1. Non-POST → 302 `/`. Honeypot filled → 303 `/gracias/` silently.
2. `telefono` required (strlen ≥ 6) else 303 back to the form with `?error=telefono#form`.
3. Log every submission to `storage/leads.log` (JSON line, LOCK_EX) BEFORE any network.
4. VenderCRM: if `vendercrm_url` set, POST `{url}/api/v1/leads` with
   `X-Api-Key`, JSON: phone, name, email (omit if empty), message (build:
   "[valuacion] Casa en Luque · 120 m² · Vende: Sí · Plazo: 1–3 meses\n<mensaje>"),
   source `site:tasacion`, page_url, referrer, utm_*/gclid/fbclid from the
   `vc_attr` cookie if present, `fields` = {form, tipo, zona, superficie,
   vende, plazo, motivo} (non-empty only), `idempotency_key` =
   sha256(phone|Y-m-d-H). 10 s timeout. Log non-2xx to `storage/leads.log`.
5. Resend: if `resend_api_key` and `lead_to_email` set, POST
   `https://api.resend.com/emails` with `Authorization: Bearer`, JSON
   {from, to:[lead_to_email], reply_to: email if set, subject, html, text}.
   Subject: `[tasacion.com.py] Valoración gratis: Casa en Luque` or
   `[tasacion.com.py] Contacto: Informe pericial (pago)`. Body: all fields as a
   simple table, plus page_url and ts. 10 s timeout. Log non-2xx.
6. Always 303 → `/gracias/?f=valuacion` or `?f=contacto`. `/gracias/` shows a
   different sentence per `f` (valuacion: "Un asesor te escribe por WhatsApp
   al número que dejaste para coordinar la valoración. No es el informe
   pericial: si necesitás uno con validez legal, pedilo por WhatsApp." with a
   WhatsApp button `src=gracias-informe t=informe`).

Never block the visitor on a network failure. No CORS, no JS fetch: plain
form POST.

Form UX: HTML5 required + `type="tel"` + `inputmode="tel"`, placeholder
`0981 123 456`. Error state reads `?error=telefono` and shows one line above
the form. Honeypot per the CRM skill: `position:absolute;left:-9999px`,
`tabindex=-1`, `autocomplete=off`, `aria-hidden`.

## 7. Design system (new; do not reuse the old tokens)

Read as: a registry office, a well-set appraisal report. Cool, exact, calm.

Fonts (Google Fonts, `display=swap`, preconnect):
- Display + headings: **Schibsted Grotesk** 500/700
- Body/UI: **IBM Plex Sans** 400/500/600
- Figures, labels, eyebrows, prices: **IBM Plex Mono** 400/500

Tokens (`:root`):
```
--paper:#F4F6F3  --surface:#FFFFFF  --ink:#12161A  --ink-2:#4A5560
--line:#D6DBD5   --line-strong:#AEB7AF
--brand:#154A3B  --brand-deep:#0C3128  --brand-tint:#E2ECE6  --brand-ink-on:#F4F6F3
--seal:#B8860B   (used ONLY for the "Oficial · pago" chip border/text and the section
                  numerals; never as a background larger than a chip)
--free:#2F5D8A   --free-tint:#E4ECF5   (the "Sin costo" chip and the free-path card accent)
--wa:#128C5E     (WhatsApp icon color only; buttons stay --brand)
--radius:6px  --radius-lg:10px  --shadow:0 1px 2px rgba(18,22,26,.06),0 8px 24px rgba(18,22,26,.06)
--container:1160px  --gutter:clamp(16px,4vw,32px)
```
Type scale: h1 clamp(2.1rem,4.4vw,3.4rem) lh 1.05 letter-spacing -0.02em;
h2 clamp(1.6rem,2.8vw,2.25rem); h3 1.2rem; body 1.0625rem lh 1.6; eyebrow
mono 0.75rem uppercase tracking .12em; price mono clamp(1.6rem,3vw,2.4rem).

Components (name them as CSS classes):
- `.nav`: paper background, 1px bottom line, logo wordmark "Tasación.com.py"
  in Schibsted 700 (the ".com.py" in --ink-2 weight 500), links: Tasaciones
  (dropdown with the 7 types on desktop; plain list on mobile), Informe
  pericial, Valoración gratis, Nosotros, Preguntas, Contacto. Right: WhatsApp
  button (`src=nav-cta`). Mobile: hamburger → full-height panel.
- `.hero`: two columns on desktop (text 7/12, image 5/12), image from
  `assets/img/` in `<picture>` with avif/webp 640/1280/1920 and width/height
  attrs. Under the H1: eyebrow with the page's product chip(s) (`Oficial ·
  pago` in --seal, `Sin costo` in --free) so every page states which path
  it serves. Two buttons: primary WhatsApp, secondary link. Below: one line
  mono "Gs. 800.000 – 1.500.000 · según tipo de inmueble y superficie" on
  paid pages.
- `.selector`: two rows of chips. Row 1 "Tipo": links to the 7 tasaciones
  pages, current one filled. Row 2 "Zona": buttons (Asunción, Luque, San
  Lorenzo, Fernando de la Mora, Lambaré, Capiatá, M. R. Alonso, Otra zona);
  clicking sets `z=` on every WhatsApp link on the page (JS, progressive: links
  work without it) and marks the chip active.
- `.dual`: the two-product comparison, two cards side by side (stack on
  mobile). Left: Informe pericial (seal chip, price line, 4 bullets, WhatsApp
  button). Right: Valoración para vender (free chip, 4 bullets, button →
  `/valuacion-para-vender/`). Used on home and every service page. On the
  valuacion page the cards swap emphasis and the left card's button says
  "Pedir presupuesto por WhatsApp".
- `.ledger`: numbered list with mono numerals in --seal (01, 02, …) and a
  hairline between rows. Used for "Qué incluye el informe" and factor grids
  on narrow screens.
- `.factors`: grid 2×3 (3 columns ≥ 900px) of cards with mono numeral, h3, p.
- `.faq`: `<details>` accordions, plus `FAQPage` JSON-LD on pages with FAQ.
- `.crosslinks`: 2 cards "Otras tasaciones" with eyebrow + title + one line.
- `.cta-final`: full-bleed --brand-deep band, white text, WhatsApp button
  (paper background, ink text) + the display number as `tel:` link.
- `.sticky-wa`: mobile-only bottom bar with one WhatsApp button
  (`src=<page>-sticky`), hidden on `/valuacion-para-vender/` and `/gracias/`.
- `.form`: labels above fields, 44px min height, mono helper text, error line.
- Footer: 4 columns (brand + coverage, Tasaciones, Sitio, Contacto), legal
  row with the three legal links + "Preferencias de cookies" + © year.
- Consent dialog: port from old site.js/CSS, restyle.

Motion: none beyond hover states and the `details` open. No scroll-reveal
library. `prefers-reduced-motion` respected for the one chip transition.

Accessibility: skip link, focus-visible rings in --brand, aria-expanded on
nav toggle and dropdown, alt on every image, color contrast ≥ 4.5:1 for text.

Images: use the existing `assets/img/*` only. Mapping: home hero
`tasacion-de-inmuebles-asuncion`; casas + departamentos
`tasacion-casas-departamentos-asuncion`; terrenos `tasacion-terrenos-paraguay`;
campos `tasador-de-terrenos-gran-asuncion`; locales + corporativa
`tasacion-locales-comerciales-asuncion`; hipotecaria + informes
`informe-de-tasacion-linderos-paraguay`; nosotros + valuacion
`tasador-midiendo-propiedad-asuncion`. OG image `og-tasacion-com-py.jpg` on
every page. Alt text describes what is visibly in the image (a notebook with
tape measure and plans; a person measuring a wall; etc.), never "informe
firmado".

## 8. Page contents

Every service page follows this order:
1. Hero (H1, subcopy, product chips, buttons, price line)
2. `.selector`
3. Context: two paragraphs (why this property type is appraised the way it is,
   in Asunción specifically)
4. `.factors`: 4–6 factors
5. `.dual`
6. `.faq`: 2–4 questions
7. `.crosslinks`: 2 related
8. `.cta-final`

Draw prose from `docs/legacy-copy/` (home factors §"Qué define el valor",
FAQ answers, documents guide, informe blocks) and rewrite to the new business
facts. Below, per page: H1, angle, factors, FAQ questions, cross-links, `t`.

**Home** (`t=general`, src prefix `home`): H1 "Tasación de inmuebles en
Asunción con validez legal". Sub: informe pericial firmado por tasador
habilitado, para bancos, sucesiones, juicios y empresas; y valoración sin
costo si vas a vender. Sections: hero → `.dual` (first, this is the message)
→ services grid of **7** cards (casas, departamentos, terrenos, locales,
corporativa, hipotecaria, campos — campos must be there) each with one line
and link → "Qué incluye el informe pericial" `.ledger` (6 rows from legacy
informe page: identificación, relevamiento, metodología, comparables,
registro fotográfico, conclusión de valor + "firma del tasador habilitado") →
"Cómo se calcula el presupuesto" 3 bullets (tipo, superficie, uso) + price
line → factors 5 (legacy) → FAQ 5 (¿Cuánto cuesta? — answer with the range;
¿Cuánto demora?; ¿Sirve para el banco?; ¿La valoración gratis es una
tasación?; ¿Trabajan fuera de Asunción?) → cta-final. JSON-LD:
`ProfessionalService` (name, url, areaServed list, telephone from config,
no address street, no rating) + `FAQPage`.

**Casas** (`t=casa`): H1 "Tasación de casas en Asunción". Factors: ubicación
y cuadra; terreno vs construcción; antigüedad y estado; ampliaciones sin
planos; comparables reales vs publicados; zonificación. FAQ: ¿Qué documentos
necesito?; ¿Tasan casas alquiladas?; ¿Qué pasa con construcción sin declarar?
Cross: departamentos, terrenos.

**Departamentos** (`t=departamento`): H1 "Tasación de departamentos en
Asunción". Factors: piso y orientación; expensas y estado del edificio;
cochera y baulera; superficie propia vs común; antigüedad del edificio;
comparables en el mismo edificio/zona. FAQ: ¿Vale más un piso alto?;
¿Influyen las expensas?; ¿Necesito el reglamento de copropiedad? Cross: casas,
hipotecaria.

**Terrenos** (`t=terreno`): H1 "Tasación de terrenos en Asunción y Gran
Asunción". Factors: frente y forma; zonificación y altura permitida;
servicios (asfalto, cloaca, agua); topografía y zona inundable; linderos y
mensura; uso potencial. FAQ: ¿Se tasa por m²?; ¿Qué pasa si no hay mensura?;
¿Terreno con mejoras precarias? Cross: campos, casas.

**Corporativa** (`t=corporativa`): H1 "Tasación corporativa de inmuebles".
Angle: balances, aportes de capital, fusiones, revalúo de activos, auditoría,
sociedades que se separan. Factors: uso del informe (contable/legal);
inmuebles múltiples; valor de uso vs valor de mercado; instalaciones
especiales (galpones, plantas); contratos de alquiler vigentes; plazos.
FAQ: ¿Sirve para revalúo contable?; ¿Tasan varios inmuebles juntos?; ¿Emiten
factura? (answer: "Sí; el presupuesto incluye el detalle" — PLACEHOLDER
confirm; write "consultá las condiciones de facturación al pedir presupuesto"
instead of asserting). Cross: locales, hipotecaria. Free path card NOT
shown; replace `.dual` with a single informe card.

**Hipotecaria** (`t=hipotecaria`): H1 "Tasación hipotecaria". Angle: informe
pericial para presentar un inmueble como garantía ante bancos, cooperativas y
financieras; el formato y contenido que esas entidades exigen; confirmá con tu
entidad si acepta tasadores externos. Factors: valor de mercado vs valor de
garantía; documentación registral; estado y habitabilidad; ubicación y
liquidez; construcción regularizada; plazo del trámite. FAQ: ¿El banco acepta
este informe?; ¿Cuánto demora?; ¿Qué documentos pide el banco? Cross:
informes-periciales, casas. No free path.

**Locales comerciales** (`t=local`): H1 "Tasación de locales comerciales".
Factors: tránsito y frente; habilitación de uso; superficie y layout; contrato
de alquiler vigente; zona comercial vs residencial; estacionamiento. FAQ: ¿Se
tasa por renta?; ¿Local alquilado? Cross: corporativa, terrenos.

**Campos y estancias** (`t=campo`): H1 "Tasación de campos y estancias".
Angle: interior del país, hectáreas, aptitud del suelo, mejoras (alambrados,
aguadas, casco), acceso, título y mensura; el perito viaja, el costo se
presupuesta con la distancia. Factors: aptitud y uso del suelo; mejoras;
acceso y distancia; agua; título y mensura; superficie por hectárea. FAQ:
¿Trabajan en el interior?; ¿Cómo se cotiza el viaje?; ¿Tasan por hectárea?
Cross: terrenos, corporativa.

**Valoración para vender** (`/valuacion-para-vender/`, the free path): H1
"Valoración para vender, sin costo". Sub: un asesor inmobiliario te dice a qué
precio publicar y cómo venderla; no es un informe pericial ni tiene validez
legal. Sections: hero (NO WhatsApp button; primary button scrolls to `#form`)
→ "Qué recibís" 3 items (rango de precio de venta, comparables publicados en
tu zona, plan de comercialización) → "Para quién es" (propietarios que van a
poner en venta en Gran Asunción; no para sucesiones, bancos ni juicios → link
informes) → **Form A** → `.dual` with swapped emphasis → FAQ 3 (¿Es gratis de
verdad?; ¿Tiene validez legal?; ¿Estoy obligado a vender con ustedes? —
answer no, honestly, "trabajamos con exclusividad cuando las dos partes lo
eligen") → no sticky WhatsApp, no cta-final WhatsApp; final band instead
points to informes-periciales.

**Informes periciales** (`t=informe`): H1 "Informe pericial de tasación con
validez legal". Sections: hero → "Cuándo hace falta" 6 cards (sucesiones,
división de bienes, juicios, garantía bancaria, empresas/balances,
negociaciones entre partes) → "Qué contiene" `.ledger` 7 rows → "Presupuesto"
price block (range, qualifier, 3 drivers, "sin nada que pagar hasta aceptar")
→ "Qué te vamos a pedir" (documents, from legacy guide) → FAQ 4 → cross:
hipotecaria, corporativa → cta-final.

**Nosotros**: H1 "Quiénes somos". Two blocks: "El tasador" (perito card with
placeholder rule §4; what habilitado means; firma y responsabilidad) and "El
equipo inmobiliario" (who does the free valuation and why it's free). Then
coverage list, "Cómo trabajamos" 4 steps, cta-final.

**Preguntas frecuentes**: 12 questions grouped: Precio y plazos (4), Informe
pericial (4), Valoración para vender (2), Datos y privacidad (2). Reuse legacy
answers, updated. `FAQPage` JSON-LD.

**Contacto**: H1 "Contacto". Left: WhatsApp card (paid informe, `src=contacto-wa
t=contacto`), phone `tel:`, email line only if set, coverage. Right: **Form B**.

**Gracias**: per §6. noindex.

**Legal pages**: real content, Spanish, 400–700 words each, h2 sections.
Privacidad: responsable (site name; RUC/legal name line only when set), qué
datos (formulario: nombre, teléfono, email, datos del inmueble; clics de
WhatsApp: fecha, botón, página de origen, hash del IP no reversible), para qué
(responder la consulta, gestionar la valoración o el informe), con quién se
comparte (proveedor de CRM y de envío de email, ambos como encargados; nunca
venta a terceros), conservación, derechos (acceso, rectificación, supresión;
cómo pedirlos: por WhatsApp o al email si está configurado), cookies (link).
Cookies: solo una cookie funcional de preferencia de consentimiento y, si el
visitante activa estadísticas, las de la herramienta de analítica; cómo
cambiar la preferencia (botón en el footer). Términos: alcance del informe
pericial (documento firmado, presupuesto previo, requiere visita y
documentación), alcance de la valoración gratuita (orientativa, sin validez
legal, no es una tasación), precios como referencia con qualifier, propiedad
intelectual, ley aplicable Paraguay, jurisdicción Asunción.

## 9. Analytics and consent

Port the old loader: `analytics_id` from config printed as `var ANALYTICS_ID`
in head; tag injected only when `localStorage.tsc_consent === 'stats'`;
`data-ev`/`data-ev-loc` pushed to `dataLayer` regardless. Consent dialog
appears on first visit, two buttons "Solo lo necesario" / "Activar
estadísticas", reopen link in footer. No third-party requests without consent
except Google Fonts.

## 10. Head, SEO

Per page: `<title>`, meta description (140–160 chars, unique), canonical
(`base_url` + path), OG title/description/image/url, `lang="es-PY"`,
`robots` default index (gracias/404 noindex). `BreadcrumbList` JSON-LD on all
non-home pages. `robots.txt`: allow all, disallow `/go/`, `/api/`, `/storage/`,
sitemap line. Internal links always with trailing slash.

## 11. `docs/PLACEHOLDERS.md` (rewrite)

List every empty config key, what it unlocks, and where it renders; the IVA
question on the price; VenderCRM URL + key; Resend key + verified sending
domain + `LEAD_TO_EMAIL`; `STATS_PASSWORD`; `ANALYTICS_ID`; Search Console;
and the deploy steps (upload zip to `public_html`, create
`config/secrets.php` from the example, make `storage/` writable 755/775, test
`/go/whatsapp.php?src=test`, test `/go/stats.php`, submit both forms).

## 12. Tooling and definition of done

`tools/check.sh`: starts `php -S 127.0.0.1:8080 index.php` in background,
then with curl asserts: all 17 routes → 200 (gracias included); 5 old routes →
301 with the right Location; `/tasaciones/casas` (no slash) → 301 to slashed;
`/nada/` → 404; `/go/whatsapp.php?src=check-test&t=casa&z=Luque` → 302 with
Location starting `https://wa.me/595995628862?text=` and one new line in
`storage/wa-clicks.log` containing `check-test`; `/go/stats.php` → 403 when no
password configured; a POST to `/api/lead.php` with `telefono=0981123456&form=valuacion&tipo=Casa`
→ 303 to `/gracias/?f=valuacion` and a new line in `storage/leads.log`; a POST
with honeypot filled → 303 and NO new line. Then: grep of `templates/` for
`wa.me` returns nothing; every `href="/…/"` internal link found in rendered
HTML of all pages resolves to 200 (crawl the 17 pages with curl and check);
every `<img>`/`<source>` path exists on disk; `php -l` on every PHP file
passes. Script exits non-zero on any failure and prints a summary.

`tools/build-zip.sh`: `rm -rf dist && mkdir dist && zip -r dist/tasacion-com-py.zip . -x` docs, .git, .claude, tools, dist, storage/*.log, config/secrets.php, node_modules, package*.json, .gitignore. Print the file list. Paths must be forward-slash (zip on Linux does this).

Done means: `bash tools/check.sh` passes, `bash tools/build-zip.sh` produces
the zip, no console errors on any page in a headless Chromium load of `/`,
`/tasaciones/casas/`, `/valuacion-para-vender/`, `/contacto/` (Playwright is
preinstalled; a 30-line script under `tools/` is fine), mobile viewport (390px)
has no horizontal scroll on those four pages. Report: file list, deviations,
anything in the spec that was impossible.
