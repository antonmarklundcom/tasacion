# Live site review — tasacion.com.py — 2026-09-06

Audit of the production site at https://tasacion.com.py/ against the source in this repo.
Method: Playwright crawl of 18 URLs at 1440×900 and 390×844 (iPhone emulation), raw `curl`
probes with six different user agents, response-header inspection, DOM/perf/contrast sampling,
and cross-reference with `content.mjs`, `build-site.mjs`, `assets/css/site.css`, `.htaccess`.
Live HTML on 2026-09-06 is byte-identical to the local `node build-site.mjs` output, so every
finding below maps directly to source.

Audit only. No site files were modified. Scores are 1 (poor) to 5 (excellent).

---

## 1. Executive summary — top 5 by impact ÷ effort

| # | Finding | Impact | Effort | Where |
|---|---|---|---|---|
| 1 | **Custom 404 is never served.** Any unknown URL (`/informe-oficial/`, `/no-existe/`, old `/servicios/...` typos) shows Hostinger's default English "This Page Does Not Exist" page: 1 MB SVG, Bootstrap CSS, and a Hostinger-owned GA4 tag (`G-9Q6H0QETRF`) firing on our domain. `404.html` exists and is deployed but `.htaccess` has no `ErrorDocument`. | High | 5 min | `.htaccess` |
| 2 | **Trust claims outrun the evidence on the page.** "Peritos matriculados", "profesional matriculado habilitado", "validez para bancos, juzgados y escribanías", "cumplen los requisitos bancarios" appear on every page, but there is no matrícula number, no RUC, no sample report, no photo of the tasador, no bank/escribanía name, no testimonial. `PLACEHOLDERS.md` §1 still lists matrícula and BCP habilitación as unconfirmed. Either substantiate or soften. | High | Content from Fernando + 1 h | `content.mjs` (porQueElegirnos, hipotecaria, FAQ), `build-site.mjs` renderTrustRow |
| 3 | **No LocalBusiness / Service structured data.** Only `FAQPage` JSON-LD is emitted. No `LocalBusiness`/`ProfessionalService` with `areaServed`, `telephone`, `priceRange`, and no `BreadcrumbList` for the `/tasaciones/*` tree. | Medium-High | 1–2 h | `build-site.mjs` `renderPage()` head |
| 4 | **WhatsApp menu option layout is broken.** In the `¿Qué necesitás?` panel the option title and its subtitle render side by side in two narrow columns (each wrapping to 3 lines) instead of stacked. Cause: `.wa-menu__option` is `display:flex` and the two `<span>`s are its direct flex children. Visible on every page, both viewports, at the exact moment of conversion. | Medium-High | 15 min | `assets/css/site.css` `.wa-menu__option`, `build-site.mjs` `renderWaMenu()` |
| 5 | **Weak inter-vertical linking and no hub breadcrumb.** Vertical pages link to only 2 sibling verticals (`otrasTasaciones`) and never back to `/tasaciones/`; `/nosotros/`, `/contacto/`, `/preguntas-frecuentes/` link to no vertical in `<main>`. Only the footer carries the full tree. | Medium | 1 h | `content.mjs` `otrasTasaciones` calls, `build-site.mjs` (breadcrumb block) |

Also worth doing soon, lower effort-to-value: render-blocking Google Fonts request (3.5 s cold from
this location), duplicate H2 "Qué incluye el informe hipotecario" on `/tasaciones/hipotecaria/`,
hero photo on `/` has cropped baked-in caption text, `/tasaciones/campos/` reuses a Gran Asunción
photo for a rural page.

---

## 2. The 403 / "Checking your browser" finding

**Status on 2026-09-06 (01:30–01:45 UTC, from Windows/Sweden IP): NOT reproducible on any URL.**

Evidence:

- All 15 real routes + `sitemap.xml` + `robots.txt` returned `200` via `curl` with a Chrome UA,
  with no UA, with `python-requests/2.31`, `Go-http-client/1.1`, Googlebot UA, and two
  HeadlessChrome UAs. `HEAD` and `HTTP/1.0` also returned `200`. Body was the real page
  (20 508 bytes, `<title>Tasaciones de inmuebles…`), never a challenge page.
- Playwright headless Chromium (desktop and iPhone emulation) loaded every route with `200`,
  zero console errors, zero failed requests on the 15 real routes.
- **No Cloudflare in the path.** Response headers carry `Server: hcdn`, `platform: hostinger`,
  `panel: hpanel`, `x-hcdn-request-id`, `x-hcdn-cache-status`. There are no `cf-ray`, `cf-cache-status`
  or `__cf_bm` headers, so the 2026-09-06 challenge cannot have been Cloudflare.
- `/tasaciones` (no slash) → `301` → `/tasaciones/`. `http://` → `301` → `https://`.
  `www.tasacion.com.py` serves `200` **without redirecting** to the apex (see §5 SEO).

Interpretation: what was seen earlier was Hostinger's hCDN edge bot-mitigation (their
"Checking your browser" interstitial), which is IP-reputation / rate based and transient. It is
not a rule in this repo's `.htaccess` and not a per-path rule. It is most likely triggered by
repeated automated hits from one IP (e.g. a verify script or an AI crawler session), and hPanel
→ Security → "Bot protection / CDN" is where it is toggled. It cannot be fixed from the codebase.

Recommended follow-up (5 min): in hPanel → Website → CDN / Security, check whether
"Bot protection" or "Under attack mode" is enabled, and whitelist the IP used by CI/verify
runs if it is. If the challenge reappears, capture the response headers (`x-hcdn-*`) and the
HTML title at that moment; that is the only way to attribute it definitively.

---

## 3. Scored categories

### 3.1 Conversion clarity — 4/5

Evidence:

- A WhatsApp trigger is above the fold on **every** page at both viewports: header pill
  (desktop, 129×40) / header round button (mobile, 44×44), hero primary button (52 px tall,
  full-width on mobile, top = 477–623 px), and the fixed FAB (56×56, bottom-right, z-index 70).
- Two paths are differentiated on 13/15 pages: chip "Informe oficial de tasación · pago ·
  firmado por…" + primary CTA "Pedir mi informe oficial" + underlined free link "¿Solo querés
  vender? Pedí tu valoración gratis →". `/valuacion-para-vender/` inverts it correctly
  (primary = "Quiero mi valoración gratis", free link points to the informe).
- The WA menu pre-selects the right option per trigger (`data-wa-open`) and the pre-filled
  message carries the page context ("vengo de la página de Tasación de Casas…"). Verified hrefs.
- Price range (Gs. 800.000 – 1.500.000) is stated on the vertical pages' price panel and the
  hero chip of `/informes-periciales/`. Good anchor.

Deductions:

- The WA menu option layout bug (§1 #4) degrades the moment of choice.
- On `/informes-periciales/` the price chip wraps into two mis-aligned columns at 1440 px
  (`offer-chip--price`: strong + span in one inline-flex row). Minor.
- The free link sits at 14 px muted grey under the buttons; on mobile it is the last thing
  before the image and easy to miss. Acceptable given the "informe first" strategy.
- `/tasaciones/hipotecaria/` has `freeLink: null` (intentional), but the CTA band at the bottom
  still says "o pedir una valoración gratis para vender". Inconsistent.

### 3.2 Trust / credibility — 2/5

Evidence, all asserted and none substantiated on the page:

- "Peritos matriculados con trayectoria" (porQueElegirnos, on /, corporativa, campos, informes).
- "Firma de Perito — Aval de un profesional matriculado habilitado" and "Cumplimiento
  Normativo — ajustado a los estándares bancarios del Paraguay" (hipotecaria grid).
- Trust row on every vertical: "Validez para bancos, juzgados y escribanías".
- FAQ: "están firmados por perito matriculado y cumplen los requisitos estándar".

What is missing: matrícula/registro number, RUC, razón social, a photo of Fernando Capurro,
a redacted sample page of a real informe, names of banks/escribanías that have accepted the
reports, a single testimonial or case, physical address, email. `/nosotros/` is 273 words of
generic "equipo multidisciplinario" copy with a stock desk photo; the hero seal on `/` reads
"Fernando Capurro · tasador responsable" and nothing more.

`PLACEHOLDERS.md` §1 explicitly says BCP habilitación is absent and "no agregar nada sobre
bancos, hipotecas ni tasaciones para créditos hasta que exista la habilitación". The current
`/tasaciones/hipotecaria/` page and the trust row contradict that guardrail. This is a
business decision for Fernando, not a copy fix.

### 3.3 Copy quality — 3.5/5

Evidence per vertical (word counts of `<main>`):

| Page | Words | Differentiation |
|---|---|---|
| casas | 518 | Good: pricing-mistake angle, 6 house-specific factors, zone tags, price rows |
| departamentos | 473 | Good: building/expensas/orientación, names Villa Morra/Santa Teresa/Eje Corporativo |
| terrenos | 449 | Good: Plan Regulador, F.O.S./F.O.T., topografía |
| corporativa | 437 | OK: 4 use cases + 4 asset types; but reuses generic `porQueElegirnos` |
| hipotecaria | 357 | Weak: 1-paragraph lead, **duplicate H2 "Qué incluye el informe hipotecario"** (grid3 + priceBlock share the heading), no bank-process steps |
| locales-comerciales | 427 | OK: rentabilidad/flujo angle, but lead is 1 paragraph |
| campos | 500 | OK: suelo/infraestructura/logística; reuses `porQueElegirnos` |

Cross-cutting issues:

- Every vertical ends with the same `freeAsideVender()` + `ctaBand()` + `priceBlock`
  (`INCLUYE_INFORME` identical 6 bullets). Legitimate templating, but it makes the bottom
  60 % of each page interchangeable.
- FAQ answers are 1–2 sentences and several are non-answers ("te confirmamos el plazo por
  WhatsApp"). Real turnaround times (e.g. "3 a 5 días hábiles") would convert better and feed
  the FAQPage schema.
- Mixed register: "Valoración" (site vocabulary) vs. "Valuación" (used in H1 of casas,
  departamentos, campos) vs. "Peritaje" (compare table). Pick one.
- `/valuacion-para-vender/` promises "maquinaria de marketing", "recorridos cinematográficos",
  "inversores de Argentina, Uruguay y Brasil", "Home Staging". Nothing elsewhere on the site
  supports that a brokerage operation exists. Risky claim set for a tasación brand.

### 3.4 Visual design — 4/5

Evidence:

- Coherent system: Libre Baskerville display + Inter, navy/gold/off-white tokens, 4:3 hero
  photo with radius, trust row, price panel with navy card. Hierarchy reads clearly at both
  viewports. Whitespace is generous (section padding 48–72 px).
- Photography is per-page and mostly relevant (12 distinct AVIF/WebP sets, 640/1280/1920).

Deductions:

- `/` hero photo has baked-in caption text cut off by the 4:3 `object-fit:cover` crop
  ("LEVAMIENTO DE CAMPO - TASACION.COM.PY" — the "RE" is cropped). Reads as an AI artifact.
- `/tasaciones/campos/` uses `tasador-de-terrenos-gran-asuncion` (a suburban lot, person
  pointing, selfie framing) for a rural estancias page. Wrong subject.
- `/informes-periciales/` photo shows a fence post labelled "OFFICIAL" in English.
- `/nosotros/` uses a generic desk/blueprint stock-style image where a real portrait belongs.
- `/preguntas-frecuentes/` and `/contacto/` have no hero image; the hero becomes a tall
  text-only block (H1 at 202 px, CTA at 536–565 px) — fine, but flat.
- `.hero__seal` is hidden below 900 px, so mobile never sees the "Informe firmado por tasador"
  seal, the one visual trust element.

### 3.5 Mobile UX — 4/5

Evidence (390×844, iPhone emulation):

- No horizontal overflow on any page (`scrollWidth` = 390 everywhere).
- Burger opens a full-width panel; top-level rows are 48 px, sub-rows 40 px (slightly under
  the 44 px guideline). Panel is 637 px tall, so "Contacto" needs a scroll on short phones.
- Header round WA button 44×44, FAB 56×56 at 16 px inset, hero CTA 52 px full width.
- WA menu opens anchored above the FAB (panel 16–336 × 389–752 px), first option focused,
  Escape/backdrop close work. Option rows are 68–92 px tall because of the layout bug (§1 #4).
- Body text 17–19 px, line-height 1.6. Readable.
- Hero image sits below the CTA on mobile (top ≈ 700–800 px), so LCP is the text and the
  image is not competing with the CTA. Good.

Deductions:

- Sub-nav rows at 40 px; footer links at 20 px height with 0.5 em gap (dense tap targets).
- Inline links such as "¿Solo querés vender?…" are 17 px tall.
- The FAB overlaps the right edge of `.cta-band__actions` secondary link and the footer
  WhatsApp number on short scroll positions (observed on `/contacto/` mobile capture).

### 3.6 Performance — 4/5

Evidence (warm CDN, from Europe):

| Metric | Value |
|---|---|
| HTML transfer | 4–5 KB (Brotli) |
| CSS | 20 KB raw, ~5 KB compressed, `Cache-Control: max-age=604800` |
| JS | 5.7 KB, single file, end of body |
| Hero image (1280 AVIF) | 13–94 KB depending on page (home is the heaviest at 94 KB) |
| Total transfer per page | 13–102 KB |
| TTFB (warm) | 60–77 ms |
| LCP (warm) | 92–276 ms desktop, 108–216 ms mobile |
| CLS | 0.00–0.015 |

Formats: every hero is `<picture>` with AVIF → WebP → WebP fallback and 3 widths;
`fetchpriority="high"` on the hero. Assets are Brotli-compressed and cached 7 days.

Deductions:

- **Google Fonts stylesheet is render-blocking** (`<link rel="stylesheet" href="fonts.googleapis.com/css2…">`
  in `<head>`, no `media="print" onload` trick, no self-hosting). Cold fetch measured at 3.5 s
  from this location; the page paints nothing styled until it resolves. Two woff2 files follow.
- `sizes="(min-width:900px) 45vw, 100vw"` but the rendered image is 547 px on desktop and 310 px
  on mobile, so the 1280 candidate is chosen where 640 would do on mobile (390 × 3 dpr = 1170
  → picks 1280; acceptable) and on desktop (547 × 1 = 547 → still picks 1280 because 45 vw of
  1440 = 648). Minor over-download.
- Hostinger 404 page (see §1 #1) transfers 1 MB and loads third-party analytics.
- No `Content-Security-Policy` beyond `upgrade-insecure-requests`; no `X-Content-Type-Options`.

### 3.7 SEO basics — 3/5

Evidence:

- Titles and descriptions are unique on all 15 pages; canonical is self-referencing and
  correct; `og:*` and `twitter:card` present; `lang="es-PY"`. Exactly one H1 per page.
- `sitemap.xml` lists the 14 indexable URLs with lastmod; `robots.txt` allows all, blocks
  `lead-forward.php`, `leads.log`, `gracias.html`. `gracias.html` and `404.html` are `noindex`.
- `.htaccess` carries 301s from the old `/servicios/*`, `/zonas/*`, `/guias/*` structure.

Deductions:

- **Structured data**: only `FAQPage` on 11 pages. No `LocalBusiness`/`ProfessionalService`
  (name, telephone `+595995628862`, `areaServed` Asunción/Gran Asunción, `priceRange`
  "Gs. 800.000–1.500.000", `founder`/`employee` Fernando Capurro), no `Service` per vertical,
  no `BreadcrumbList`. `PLACEHOLDERS.md` mentions a JSON-LD that the current renderer never emits.
- **Internal linking**: vertical pages link to 2 siblings and to `/valuacion-para-vender/` only.
  None links up to `/tasaciones/` or to `/informes-periciales/` (except corporativa/hipotecaria).
  `/nosotros/`, `/preguntas-frecuentes/`, `/contacto/` have 0–1 in-content links.
  No breadcrumb (visual or schema) although the URL tree is 2 levels deep.
- **`www.` not redirected**: `https://www.tasacion.com.py/tasaciones/` serves `200` with the
  same content and a canonical to the apex. Add a 301 in `.htaccess` (or hPanel) to avoid a
  duplicate host.
- Title on `/tasaciones/` is 91 characters (truncates at ~60 in SERPs).
- `/nosotros/` and `/contacto/` titles are just "Nosotros | Tasación.com.py" — no keyword
  or location.
- Duplicate H2 on `/tasaciones/hipotecaria/`.
- Custom 404 not served → soft "This Page Does Not Exist" pages with a real 404 status are
  fine for crawlers, but the page carries no nav back into the site.

### 3.8 Accessibility — 4/5

Evidence:

- Contrast sampled on `/`: body/muted text 5.48:1, trust row 5.76:1, eyebrow 10.8:1, primary
  button 10.8:1, WA buttons 8.5:1, chip subtitle 4.94:1, menu subtitle 4.88:1 — all pass AA.
  Footer copyright line (`.ftr__base p`, `#5C6773` on `#12181F`) = **3.1:1, fails AA** at 13 px.
- Every `<img>` has descriptive alt; `noAlt = 0` on all pages. Decorative SVGs are `aria-hidden`.
- `:focus-visible` outline defined globally (3 px navy). WA menu is a `role="dialog"`,
  `aria-modal`, `aria-labelledby`, with focus trap and Escape handling. Triggers carry
  `aria-haspopup`/`aria-expanded`/`aria-controls`. Burger has `aria-label` and `aria-expanded`.
- Contact form: all visible inputs are wrapped in `<label class="field">`, honeypot is
  `aria-hidden` + `tabindex=-1`, radios have labels.

Deductions:

- Radio group has no `<fieldset>/<legend>` ("¿Qué necesitás?"), so screen readers announce
  three unrelated radios.
- No `required` indicator text; browser-native validation only.
- `<a class="wa-fab" aria-label="Abrir WhatsApp">` also carries `href` to WhatsApp — fine —
  but the header `wa-round` and `wa-pill` both exist in the DOM at all widths (one hidden by
  CSS), so screen readers on desktop may still hit the hidden duplicate depending on
  `display:none` handling (it is `display:none`, so OK; noted only for future refactors).
- Sub-nav tap targets 40 px, footer links 20 px (see §3.5).
- Skip-to-content link absent.

---

## 4. Source cross-reference for the top issues

### 4.1 Custom 404 (`.htaccess`)

`.htaccess` has only `RedirectMatch` rules. Hostinger's Apache/LiteSpeed serves its own
`htdocs_error/page_not_found.html` when no `ErrorDocument` is defined. Add near the top:

```apache
ErrorDocument 404 /404.html
```

`404.html` already renders with the full header/nav/services grid and `noindex,nofollow`.
Optionally also add `ErrorDocument 403 /404.html` and `ErrorDocument 500 /404.html`.
Verify with `curl -I https://tasacion.com.py/no-existe/` → `404` + `<title>Página no encontrada`.

### 4.2 WA menu option layout (`assets/css/site.css`, `build-site.mjs`)

`renderWaMenu()` in `build-site.mjs` emits:

```html
<a class="wa-menu__option …">
  <span class="wa-menu__opt-title">…</span>
  <span class="wa-menu__opt-sub">…</span>
</a>
```

and `site.css` has `.wa-menu__option{display:flex;align-items:flex-start;gap:12px;…}` plus a
`::before` bullet. The two spans become sibling flex items → side-by-side columns. Fix in CSS
only, with either of:

```css
.wa-menu__option{display:grid;grid-template-columns:8px 1fr;column-gap:12px;align-items:start}
.wa-menu__option::before{grid-row:1/3;margin-top:6px}
.wa-menu__opt-title,.wa-menu__opt-sub{grid-column:2}
```

or wrap the two spans in a `<span class="wa-menu__opt-text">` in `renderWaMenu()` and keep
flex. Add a Playwright assertion in `tests/wa-menu.mjs` that `opt-sub.top >= opt-title.bottom`.

### 4.3 Structured data + breadcrumbs (`build-site.mjs`)

`renderPage()` currently injects only `faqJsonLd(page)`. Add:

- A site-wide `ProfessionalService` (or `LocalBusiness`) block using `SITE`, `WA_NUMBER`,
  `TASADOR`, `PRECIO` from `content.mjs`: `name`, `url`, `telephone`, `areaServed`
  (`Asunción`, `Gran Asunción`), `priceRange`, `image` (the OG image), `founder` →
  `Person{name: TASADOR, jobTitle: 'Tasador'}`, `sameAs` left empty until profiles exist.
  Do **not** add `address.streetAddress` (PLACEHOLDERS.md §2) or `legalName` until RUC exists.
- Per vertical page (`page.kind === 'vertical'`): `Service{name: page.h1, provider: @id of the
  business, areaServed, offers{priceSpecification minPrice/maxPrice PYG}}`.
- `BreadcrumbList` for any slug with depth ≥ 2, and a visible breadcrumb above the eyebrow
  (`Inicio › Tasaciones › Casas`). One new `block()` case or a line in `renderHero()`.

### 4.4 Trust content (`content.mjs`)

Once Fernando confirms the facts, the touch points are:

- `porQueElegirnos.items[2]` ("Peritos Tasadores … peritos matriculados") — add matrícula
  number or rewrite to "Tasador responsable Fernando Capurro, N años tasando en Asunción".
- `renderTrustRow()` items in `build-site.mjs` — "Validez para bancos, juzgados y escribanías"
  should become specific ("Aceptado por escribanías y juzgados de Asunción"; add banks only
  with habilitación).
- `/tasaciones/hipotecaria/` grid items "Firma de Perito" and "Cumplimiento Normativo".
- `/nosotros/` — add a `type:'lead'` block with a real bio (years, formation, matrícula) and
  swap `heroImage` for a portrait once the photo is authorised (NEXT-STEPS.md).
- New optional block type `sample` (redacted informe page as an image) placed after
  `priceBlock` on `/informes-periciales/`.

### 4.5 Fonts (`build-site.mjs` head)

Replace the blocking `<link rel="stylesheet" href="https://fonts.googleapis.com/…">` with
self-hosted woff2 in `assets/fonts/` + `@font-face{font-display:swap}` in `site.css`
(plan.md §11 already lists this), or at minimum:

```html
<link rel="preload" as="style" href="…css2…" onload="this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="…css2…"></noscript>
```

---

## 5. Prioritized backlog

### Quick wins (≤ 1 h each)

| Item | Effort | Files |
|---|---|---|
| `ErrorDocument 404 /404.html` | 5 min | `.htaccess` |
| 301 `www.` → apex | 5 min | `.htaccess` or hPanel |
| Fix WA menu option stacking | 15 min + test | `site.css`, `tests/wa-menu.mjs` |
| Rename second H2 on hipotecaria (grid3 → "Qué revisa el banco en el informe") | 5 min | `content.mjs` |
| Footer copyright contrast (`.ftr__base p` → `--on-dark-muted`) | 2 min | `site.css` |
| Shorten `/tasaciones/` title to ≤ 60 chars; add location to Nosotros/Contacto titles | 10 min | `content.mjs` |
| Remove "o pedir una valoración gratis" from hipotecaria CTA band (`ctaBand` param) | 10 min | `content.mjs`, `build-site.mjs` |
| Wrap contact radios in `<fieldset><legend>` | 10 min | `build-site.mjs` `contactForm` |
| Non-blocking Google Fonts (preload/onload) | 15 min | `build-site.mjs` |
| Unify "Valoración/Valuación/Peritaje" wording | 20 min | `content.mjs` |
| Check hPanel bot-protection setting; note result here | 10 min | hPanel |

### Medium (1–4 h)

| Item | Effort | Files |
|---|---|---|
| `ProfessionalService` + per-vertical `Service` + `BreadcrumbList` JSON-LD | 2 h | `build-site.mjs` |
| Visible breadcrumb on depth-2 pages | 1 h | `build-site.mjs`, `site.css` |
| `otrasTasaciones` → link all 6 siblings + hub + informes on every vertical | 1 h | `content.mjs` |
| Self-host Inter + Libre Baskerville | 1 h | `assets/fonts/`, `site.css`, `build-site.mjs` |
| Real FAQ answers (plazos, qué documentos traer, cómo se paga) + expand hipotecaria lead to a 4-step bank process | 2 h + input from Fernando | `content.mjs` |
| Re-shoot/re-generate `/` hero without baked text; campos hero with a real estancia; informes hero without English "OFFICIAL" | 1–2 h via webimg pipeline | `src-img/`, `build-images.mjs` |
| Mobile: show a compact `.hero__seal` under the CTA instead of hiding it | 30 min | `site.css`, `build-site.mjs` |

### Bigger bets (needs business input)

| Item | Effort | Notes |
|---|---|---|
| Trust package: matrícula, RUC, portrait, redacted sample informe, 2–3 named references or testimonials | 1 day after inputs | Highest lever on conversion; blocked on Fernando (PLACEHOLDERS.md §1) |
| Resolve the hipotecaria/BCP contradiction: either obtain habilitación or reposition the page as "tasación para carpeta bancaria (informe pericial)" without "cumplimiento normativo" claims | Decision | `content.mjs` hipotecaria, trust row |
| Decide whether `/valuacion-para-vender/` brokerage promises (video, foreign investors, home staging) are real; if not, cut to "rango de valor + recomendación de precio" | Decision + 1 h | `content.mjs` |
| `/precios/` page with a finer grid (plan.md §11) once real per-type prices exist | 3 h | new route, sitemap, nav |
| Analytics: set `ANALYTICS_ID` and add GA4 events for `wa_click` (already pushed to `dataLayer`) | 30 min + GA setup | `build-site.mjs` |
| Wire `VENDERCRM_URL`/`VENDERCRM_API_KEY` env vars on Hostinger so form leads reach the CRM | 15 min | hPanel |

---

## 6. Raw crawl facts (for future diffing)

- 15 real routes → `200`; `/informe-oficial/` → `404` (Hostinger default page; the real slug is
  `/informes-periciales/`); `/no-existe-xyz/` → `404` (same default page).
- Console: 0 errors on real routes. On 404 pages: 2 resource errors + 1 warning, all from
  Hostinger's page, plus a request to `td.doubleclick.net` (GA4 `G-9Q6H0QETRF`, not ours).
- Headers: `Server: hcdn`, `platform: hostinger`, `Content-Encoding: br`, `alt-svc: h3`,
  `Content-Security-Policy: upgrade-insecure-requests`, assets `Cache-Control: public, max-age=604800`.
- Images: 12 hero sets × 3 widths × AVIF+WebP; `og-tasacion-com-py.jpg` 108 KB.
- JSON-LD: `FAQPage` on casas, departamentos, terrenos, corporativa, hipotecaria,
  locales-comerciales, campos, valuacion-para-vender, informes-periciales, preguntas-frecuentes.
  None on `/`, `/tasaciones/`, `/nosotros/`, `/contacto/`.
- WA links per page: 10–11 (header ×2, hero, price panel, CTA band ×2, menu ×3, FAB, footer).
- Screenshots from this audit are not committed; regenerate with `tests/screenshots.mjs`.
