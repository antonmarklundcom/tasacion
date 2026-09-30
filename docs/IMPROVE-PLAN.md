# tasacion.com.py: improvement plan

Written 2026-09-30, planning only: no site file was changed. Branch: `claude/compassionate-planck-oyuk36`, cut from `origin/audit-fixes-2026-09-13` @ `edd22d6` (the branch the live site runs).
Companion files:
- `docs/audit/audit-before.json`: the SEO and runtime baseline.
- `docs/NEXT-WINDOW-PROMPT.md`: the prompt for the build window.
- `docs/audit/2026-09-13-report.md`: the older backlog.

Goal: improve the site a lot (content depth, conversion, trust) without losing a single ranking signal it has today, then grow it.

---

## 0. How this investigation was run, and its limits

| Step | Done | Note |
|---|---|---|
| Fresh clone, read README/docs/build/templates | Yes | No README exists. The source of truth is `content.mjs` (copy and pages), `build-site.mjs` (renderer), `verify.mjs` (gate), `docs/routes.json` (frozen URLs, titles and canonicals), `.htaccess` (legacy 301s and blocking), `.github/workflows/verify.yml` (CI). |
| Crawl every sitemap URL | Yes, against a **local build** of the live branch | This sandbox's network policy blocks `tasacion.com.py` (proxy 403, WebFetch "egress blocked"). The build window **must re-crawl the live host** and diff it against this baseline (see §4.3). |
| Playwright at 1366 and 390 | Yes | 18 pages × 2 widths. Full-page screenshots (36, WebP, 6.4 MB) are committed in `docs/audit/audit-shots/`. They are under `docs/` so `.htaccess` keeps them off the live site. Keep new screenshots out of the repo root, which is served publicly. |
| Keyword data (keyword-library MCP) | **Not available** | The MCP is not connected in this environment (`ListConnectors` returns nothing). §3 is therefore a provisional map built from the existing page targets. The build window's Phase 0 has to run `list_projects → project_overview → list_groups → get_group → keyword_lookup` and confirm or kill each row before any new page is built. |
| `C:\Claude 1\site-verify-report.md` | Not reachable | That is on Anton's PC. The rules it verified (number, messages, SEO division) are copied verbatim into this plan and the next-window prompt. |

---

## 1. Findings

### 1.1 Repo, branches, deploy

- **master is 9 commits behind `audit-fixes-2026-09-13` and has 0 commits of its own.** master (`6746d64`) is a strict ancestor, so a PR from the audit branch into master merges with **no conflicts** (fast-forward content).
- **CI would go red on that PR as the repo stands.** `verify.mjs` rebuilds and diffs against the committed HTML. On a clean Linux checkout it fails for two reasons:
  1. The committed HTML references `site.js?v=1a1b61bd`, but the committed `site.js` hashes to `b70060e5`. No commit of `site.js` hashes to `1a1b61bd`, so the HTML was built from a `site.js` that was never committed. That probably means uncommitted work in `C:\Claude 1\tasacion-com-py` (see open question Q6).
  2. `sitemap.xml` `<lastmod>` defaults to the build date (`build-site.mjs:714`), so every rebuild on a new day differs.

  Both have to be fixed in step 1, or the first PR cannot go green.
- The live site is a git deploy of the repo root. `.htaccess` hides `docs/`, `prompts/`, `tests/`, the build scripts and `leads.log`. Anything new at the repo root (for example a stray `audit-before.json`) **would be public**, which is why the baseline lives in `docs/audit/`.
- **`deploy/vendercrm-config.php` is not in `.gitignore`.** On Anton's PC that file is real and private, so one `git add -A` would commit the CRM key. Step 1 adds it, plus `vendercrm-config.php` at any depth, to `.gitignore`. Rule: always stage explicit paths.
- **Analytics is off** (`ANALYTICS_ID = ''`). WhatsApp clicks go into `dataLayer`, and nothing reads them. Today there is no way to measure whether a change helps.

### 1.2 SEO baseline (from `docs/audit/audit-before.json`)

- 16 sitemap URLs plus `404.html` and `gracias.html`. All return 200, each has exactly 1 H1, a self-canonical, `lang="es"`, an OG image and valid JSON-LD with no parse errors. No image is missing `alt`. There are 0 broken internal links. `404` and `gracias` are `noindex,nofollow`.
- Titles run 37–60 characters and descriptions 82–188. `/tasaciones/casas/` (188) is long, and `/preguntas-frecuentes/` (82) is short.
- Main-content word counts: home 895, `informes-periciales` 1086, verticals 570–715, hub 446, vender 452, franja 394, nosotros 405, contacto 390. FAQ shows 224 because the answers are collapsed; the real text is larger.
- **Internal linking is almost all nav and footer.** Every page links out to the same 16 URLs through the header and footer. Contextual links inside `<main>` are thin: `/tasaciones/casas/` has 3, and `/preguntas-frecuentes/` has 1.
- Schema: every page has `ProfessionalService` and `Person`. Verticals add `Service`, `Offer`, `PriceSpecification`, `FAQPage` and `BreadcrumbList`. Hub, home, nosotros and contacto have no `BreadcrumbList`, and franja has no `Offer` (by design: it is quoted per project).
- Legacy URLs from the old site are 301'd in `.htaccess`:
  - `/servicios/*` → the new verticals
  - `/zonas/*` → `/`
  - `/guias/*` → `/preguntas-frecuentes/`
  - `/cotizador/` → `/contacto/`

  The zonas and guias redirects send topical pages to generic ones, which dilutes whatever equity they had. Their old copy is kept in `docs/legacy-copy/`.
- The home H1 ("Tasación con validez legal y bancaria, para tu crédito, tu sucesión o tu venta") does not contain the home page's primary term. The title ("Tasación de inmuebles en Asunción") does. **Keep both as they are**: they are what ranks today.

### 1.3 Runtime (Playwright, 1366 and 390)

- No horizontal scroll and no broken images on any page.
- Only one console error per page: `vc-attribution.js` from `crm.clientes.com.py`. This sandbox blocks that host, so recheck it live.
- Weight at 390: JS 6 KB, CSS 27 KB, fonts 67 KB (self-hosted Inter variable plus Libre Baskerville 700), images 0–27 KB. The LCP element is text (hero paragraph or H1) at about 60–100 ms locally. Performance is not a problem, so do not spend effort there.
- Mobile hero: the H1 wraps to 5 lines, and the primary CTA sits at about 715 px, inside an 844 px viewport. The FAB floats over the hero image.
- The full-page screenshots show the sticky header mid-page. That is a capture artifact, but the build window should confirm it with viewport-only shots.

### 1.4 The WhatsApp number (list every place)

The only number allowed is **+595 992 279599**, written as:
- `wa.me/595992279599`
- `tel:+595992279599`
- display text `+595 992 279 599`

The old number (the current `WA_NUMBER` value, ending in 628862) appears here:

| File | Where |
|---|---|
| `content.mjs:5` | `export const WA_NUMBER` (feeds every `wa.me` href, the inline `var WA_NUMBER`, and the JSON-LD `telephone`) |
| `content.mjs:995` | Contacto "Nuestros canales", display value |
| `content.mjs:1041` | Privacidad, deletion-request paragraph (display) |
| `content.mjs:1042` | Privacidad CTA `https://wa.me/${WA_NUMBER}` (**empty message**) |
| `build-site.mjs:130` | Footer display text "WhatsApp: +595 …" (and its `wa.me` link has **no message**) |
| `build-site.mjs:131` | Footer `tel:` link, hard-coded literal |
| `build-site.mjs:574` | JSON-LD `telephone: +${WA_NUMBER}` |
| `build-site.mjs:647` | `<script>var WA_NUMBER = …</script>` in every page |
| `assets/js/site.js:27-33` | Rewrites every `wa.me` and `tel:` href at runtime from `window.WA_NUMBER` |
| `assets/js/site.js:~43` | Contact-form error link `https://wa.me/`+n (**empty message**) |
| 18 generated HTML files | about 13–18 occurrences each (hrefs, JSON-LD, display) |
| Docs | `plan.md:431,605`, `BUILD-SPEC.md:23,216,484,1241,1424,1465`, `PLACEHOLDERS.md:28,29,153`, `docs/BUILD-SPEC-2026-09-03.md:165,166,542`, `docs/LIVE-SITE-AUDIT-2026-09-11.md:58`, `docs/LIVE-SITE-REVIEW-2026-09-06.md:225`, all 16 files in `docs/legacy-copy/` |
| Off-site (human) | Google Business Profile, directories, social bios, VenderCRM site record, anything printed. **The NAP must match the site.** |

The crawl found **19 WhatsApp links with an empty message**: the footer link on every page, plus the Privacidad CTA. Across the site there are 224 WhatsApp links but only 109 distinct messages, and the messages differ only by the page name inserted into a single template.

### 1.5 Fernando's answers and what they mean for the copy (source: Anton, 2026-09-29)

Rule: keep legal claims as they are, and invent no credentials, prices or times. Only facts Fer stated may go in. Items marked **(Anton)** wait for a yes from Anton (see §8).

| # | Fer said | Change |
|---|---|---|
| 1 | Price depends on purpose, location, value and size | Fix the contradiction in `/informes-periciales/` lede ("no del tamaño de tu casa", `content.mjs:808`): the purpose sets the band, and type, size and location set the amount within it. |
| 2 | An individual report for one property, "official" because a professional signs it | Add one sentence where "informe oficial" is first explained. |
| 3 | The discount applies only with exclusivity | Already fixed on this branch. Keep "con exclusividad" beside every seller CTA. |
| 4 | Average 3–4 business days; courts set 15–20 business days for judicial work | Keep "3 a 5 días hábiles" (safe). Add: "En tasaciones judiciales el plazo lo fija el juzgado, normalmente 15 a 20 días hábiles." |
| 5 | Show prices "IVA incluido" | **(Anton)** Change `IVA_TXT` from "+ IVA" to "IVA incluido" with the **same figures**. One constant; also check the JSON-LD `valueAddedTaxIncluded`. |
| 6 | Legal invoice in every case | Already on the site. Keep it. |
| 7 | The report includes the market-analysis justification. Franja de dominio additionally includes notification to those affected, plans of the affected buildings, a quantity survey and budget sheet, and the on-site survey record | Add the justification to `INCLUYE_INFORME`, and the deliverables list to franja. Do not target quantity-survey or construction-budget keywords: those belong to obra. |
| 8 | Mortgage report = the normal report plus a signature from a professional on the BCP list, with photos and a description of the building's condition and location | Align the hipotecaria "incluye" list. It currently also lists "Valor de liquidación", which Fer did not mention (Q4). |
| 9 | Fer is **not** on the BCP register yet | The site already says a BCP-registered appraiser signs credit reports, not Fer. Keep that. But the home hero says "Informe técnico firmado por el Tasador Fernando Capurro, listo para presentar en tu banco, cooperativa…". Legal claims stay untouched, so this is flagged as **Q3** and not changed. |
| 10 | The credit report costs more only because of the BCP signature | Consistent with the site. No change. |
| 11 | Judicial reports go to the judge and must be more precise, because fees are calculated on them | Consistent. Can be added to the judicial copy. |
| 12 | Franja: price depends on the damage and the distance; about Gs. 1.200.000 per home as a reference | **(Anton)** Keep it "a presupuesto" on the site; the number is for WhatsApp only unless Anton says otherwise. |
| Q1 | Travel to the interior: Cordillera or Paraguarí about +Gs. 200.000; Encarnación or CDE more (overnight stay, fuel) | **(Anton)** Either publish "+ Gs. 200.000 Cordillera/Paraguarí; más lejos, a presupuesto", or only "viáticos según distancia". |
| Q2 | Express delivery: at least +Gs. 300.000 | **(Anton)** Publish "entrega urgente: consultá recargo", or the figure. |
| Q3 | Volume: 10 units within the month at Gs. 500.000 each, under contract | **(Anton)** Recommended: publish "precio por volumen bajo contrato" with **no figure**. |
| Q4 | Payment: 50% transfer to book the visit, 50% on delivery; cash, transfer and QR accepted; no card | Add to the FAQ and contacto. These are facts, not prices. |
| Q5 | Validity: 6 months to 1 year depending on the area's market | Add to the FAQ, plus the missing guide page (§3). |
| Q6 | Bank rejects the report: "nos hacemos responsables sin costo" | **(Anton)** It is a guarantee claim, so confirm the exact public wording (for example "si el banco observa el informe, lo corregimos sin costo"). |

### 1.6 SEO division (keep tasacion out of the sister sites' topics)

tasacion.com.py covers **appraisal and valuation only**. The sister sites own these topics:
- **obra**: build and execution, construction costs, per-m² construction budgets, quantity surveys as a service.
- **arq**: design, plans, permits (no repo yet).
- **carpinteria**: wood and aluminium only.

Franja's quantity-survey deliverable is described as part of the report and never as a service or keyword target. No page targets construction cost, "planos" or "aberturas".

---

## 2. SEO protection

### 2.1 URLs that must stay (200, same title, same canonical, same H1 unless listed in §5)

```
/                                   /tasaciones/                     /tasaciones/casas/
/tasaciones/departamentos/          /tasaciones/terrenos/            /tasaciones/corporativa/
/tasaciones/hipotecaria/            /tasaciones/locales-comerciales/ /tasaciones/campos/
/tasaciones/franja-de-dominio/      /valuacion-para-vender/          /informes-periciales/
/nosotros/                          /preguntas-frecuentes/           /contacto/
/privacidad/
```

Also keep: `/404.html` and `/gracias.html` (noindex), `/robots.txt`, `/sitemap.xml`, and `/lead-forward.php` (the form action). `docs/routes.json` stays the frozen contract, and `verify.mjs` already enforces it.

### 2.2 Redirects

- **No existing URL changes in this plan**, so no new 301 is needed for existing pages.
- All 8 legacy `RedirectMatch 301` rules in `.htaccess` stay exactly as they are, **except** where §3 restores a legacy URL as a real page. In that case, remove only that one line. The URL then returns 200 with topical content, which is better than a 301 to a generic page.
- Any page added later goes at a **new** URL and is added to `PAGES` and `docs/routes.json`. The sitemap is generated.
- If the build window ever finds a reason to rename a URL: add a 301 from old to new in `.htaccess`, keep the old URL in a `routes.json` `redirects` list, and check it live. The expectation is that this never happens.

### 2.3 Before/after check (runs at the end of every PR and after every deploy)

Tool: `tools/seo-audit.mjs` (created in Phase 1; its script is in the appendix). It writes the same JSON shape as `docs/audit/audit-before.json`. Then `tools/seo-diff.mjs before after` fails on any of these:

1. A URL from §2.1 that is not 200, or a legacy URL whose 301 target changed without being listed in the PR.
2. A title, canonical or `robots` change on an existing URL, unless whitelisted in the PR body.
3. An H1 change on an existing URL (same whitelist rule).
4. A meta description change that was not intended (warn only), or one outside 110–160 characters (warn).
5. A lost schema `@type` on any page.
6. Main-content word count down by more than 10% on any page.
7. Any page losing an inbound internal link (`internalLinksIn`).
8. A sitemap URL set that is not a superset of before.
9. Any `wa.me` or `tel:` link not using the new number, any WhatsApp link with an empty `text`, or any old-number match anywhere.

Run it three times: against the local build (PR gate), against the live host after deploy, and against the live host with `?nocache=<ts>` after purging the Hostinger CDN.

---

## 3. Keyword groups → pages (provisional, pending the keyword-library MCP)

Rules:
- One meaning group = one page or section.
- Paraguay volumes only.
- Never plan pages for brand or competitor phrases.

"Status" is the expected outcome; Phase 0 replaces it with data. A group with no Paraguay volume in the library does **not** get a new page.

| Meaning group (to look up) | Page | Status |
|---|---|---|
| tasación de inmuebles / tasador de inmuebles / tasador inmobiliario (Asunción) | `/` | Matches. Keep title and H1. Enrich body only. |
| tasaciones / tipos de tasación | `/tasaciones/` | Matches (hub). Add intro depth and contextual links. |
| tasación de casas / avalúo de casa | `/tasaciones/casas/` | Matches. Shorten the meta description (188 characters). |
| tasación de departamentos | `/tasaciones/departamentos/` | Matches. |
| tasación de terrenos / lotes / avalúo de terreno | `/tasaciones/terrenos/` | Matches. |
| tasación de locales comerciales | `/tasaciones/locales-comerciales/` | Matches. |
| tasación de campos / estancias / inmuebles rurales | `/tasaciones/campos/` | Matches. |
| tasación corporativa / de activos / para balance | `/tasaciones/corporativa/` | Matches. |
| tasación hipotecaria / tasación para crédito / para banco | `/tasaciones/hipotecaria/` | Matches. Rewrite the "incluye" list per Fer (#8). |
| franja de dominio / expropiación vial / avaluación edilicia | `/tasaciones/franja-de-dominio/` | Matches. Add Fer's deliverables (#7). |
| tasación para vender / cuánto vale mi casa / valor de mi propiedad / tasación gratis | `/valuacion-para-vender/` | Probably a rewrite: strengthen "cuánto vale mi casa" copy, keep the H1. |
| informe de tasación / perito tasador / informe pericial | `/informes-periciales/` | Matches. Fix the pricing contradiction (#1). |
| **tasación para sucesión / herencia / tasación judicial / perito tasador judicial** | **new** `/tasaciones/sucesiones-y-juicios/` | **Missing.** It is the highest-margin service and today exists only as the `#judicial` section. Build it if the MCP shows volume, and turn the `#judicial` section into a summary that links to it. |
| qué es una tasación inmobiliaria | legacy `/guias/que-es-una-tasacion-inmobiliaria/` (now 301 → FAQ) | **Restore if there is volume.** Legacy copy is in `docs/legacy-copy/`; rewrite it with Fer's facts. |
| documentos para tasar un inmueble | legacy `/guias/documentos-para-tasar-un-inmueble/` | **Restore if there is volume.** |
| vigencia de una tasación / cuánto dura una tasación | new `/guias/vigencia-de-una-tasacion/`, or an FAQ entry | Missing. Page only with volume; otherwise an FAQ item (Fer Q5). |
| tasación en Luque / San Lorenzo / Fernando de la Mora / interior / Encarnación / CDE | legacy `/zonas/*` (now 301 → `/`) | **Restore one page per city only where the library shows Paraguay volume.** Otherwise leave the 301. Never thin city pages. |
| precio del m² en Asunción | none | **Do not build.** It needs real data we do not have, and construction per-m² belongs to obra. |
| costo de construcción, presupuesto de obra, cómputo métrico | none | **Belongs to obra.** |
| diseño, planos, permisos municipales | none | **Belongs to arq.** |
| aberturas, carpintería de aluminio/madera | none | **Belongs to carpintería.** |
| alquiler, venta de casas, inmobiliaria | none | Not tasacion (other sites). |
| tasación de vehículos / maquinaria / joyas | none | Service not offered. Skip. |
| brand or competitor phrases | none | Never. |

---

## 4. Conversion layer

### 4.1 Purposes

One purpose list, used by the menu, the CTAs and the form:

| id | Menu label (voseo) | Pages where it is the default |
|---|---|---|
| `compraventa` | Informe oficial para comprar o vender | home, hub, casas, departamentos, terrenos, locales, campos, informes-periciales, nosotros, FAQ, contacto, 404 |
| `hipotecaria` | Tasación para crédito hipotecario | hipotecaria |
| `credito` | Tasación para otro crédito (fiduciario, cooperativa, prendario de inmueble) | none (menu only) |
| `sucesion` | Tasación para sucesión o juicio | the new sucesiones page, `informes-periciales#judicial` CTA |
| `venta` | Tasación para vender con un corredor (con exclusividad) | valuacion-para-vender |
| `empresa` | Tasación para mi empresa | corporativa (replaces today's `waConsultaText`) |
| `franja` | Relevamiento en franja de dominio | franja-de-dominio (replaces `waConsultaText`) |
| `consulta` | Otra consulta | none (menu only) |

The menu shows 6 rows on every page: `compraventa, hipotecaria, credito, sucesion, venta, consulta`. On corporativa and franja, the page-specific purpose replaces `consulta`.

### 4.2 The message map: one file, `content/wa-messages.mjs`

- Explicit strings, written by hand: `MESSAGES[slug][purpose] = '…'`. There are no templates with only the page name swapped. Every page × purpose pair is its own sentence, and it names the property type or page topic.
- Style:
  - Paraguayan voseo (tenés, podés, necesito, querés).
  - First person, as the client.
  - PYG only, and **no amounts** unless the exact figure is already published on the site. Recommendation: no amounts at all.
  - Ends with one blank the client fills in, for example "Queda en: ___".
- The footer link, the Privacidad CTA and the form-error link also get a message (`MESSAGES[slug].footer`, `MESSAGES['/privacidad/'].datos`, `MESSAGES['/contacto/'].error`).
- `WA_NUMBER`, `WA_DISPLAY` and `TEL_HREF` are exported from this same file, so the number exists in exactly one place.

Examples (tone reference; the build writes all of them):

```
'/tasaciones/casas/': {
  compraventa: 'Hola, estoy en la página de tasación de casas. Necesito el informe oficial de una casa para una compra o venta. Queda en (barrio y ciudad): ___',
  hipotecaria: 'Hola, vi la página de tasación de casas. El banco me pide la tasación de una casa para un crédito hipotecario. Queda en: ___ y el banco es: ___',
  sucesion:    'Hola, vengo de la página de casas. Necesito tasar una casa que forma parte de una sucesión. Queda en: ___',
  venta:       'Hola, quiero vender mi casa con un corredor y me interesa la tasación con exclusividad. Queda en: ___',
},
'/tasaciones/terrenos/': {
  compraventa: 'Hola, estoy viendo la página de terrenos. Necesito el informe oficial de un terreno para comprar o vender. Está en: ___ y mide aprox.: ___',
  hipotecaria: 'Hola, necesito la tasación de un terreno para presentar en un crédito hipotecario. Está en: ___',
},
'/tasaciones/franja-de-dominio/': {
  franja: 'Hola, vengo de la página de franja de dominio. Necesitamos relevamiento y avaluación para un proyecto vial. Cantidad aproximada de lotes afectados: ___ y zona: ___',
},
'/contacto/': { error: 'Hola, intenté enviar el formulario de contacto y no funcionó. Quiero pedir una tasación para: ___' },
```

### 4.3 QA check: `tools/check-contact.mjs`

It runs inside `verify.mjs` and CI. It fails on any of these:

- A `wa.me` link in any built HTML that uses a number other than `595992279599`, or has an empty or missing `text`.
- A `text` that is not in the map for that page.
- A `tel:` href other than `tel:+595992279599`, or a JSON-LD `telephone` other than `+595992279599`.
- Visible phone text in any format other than `+595 992 279 599`.
- Any match of the old number in any tracked file. Pattern: the digits `595`, `995`, `628`, `862` with up to 3 non-digits between groups, plus the local `0995…` variant. Build the pattern in code from pieces so the check file itself does not match.
- Any other `595\d{9}` number.
- A message containing `Gs`, `₲`, `USD`, `$` or a digit group of 4+ digits (amounts), unless the PR lists it on an allow-list tied to `PRECIOS`.
- Two page × purpose pairs with identical text.
- A page missing one of its required purposes.
- A message using tú-forms (`tienes|puedes|quieres|necesitas`).
- A runtime check (`site.js`) that builds a `wa.me` URL without text.

### 4.4 CTA placement

Keep the current primary CTAs (header pill, hero, price panel, CTA band, FAB). Add:
- A purpose-specific WhatsApp link under each FAQ block ("¿Otra duda? Preguntanos por WhatsApp", `consulta`, with a page-specific text).
- On `/informes-periciales/`, one CTA per purpose card: `compraventa`, `hipotecaria`, `sucesion`. Today the judicial card uses the generic judicial text.
- On the new sucesiones page: `sucesion` as primary and `compraventa` as secondary.

### 4.5 Mobile sticky bar (≤ 768 px)

- Replaces the floating FAB on mobile. It is a bar fixed to the bottom with two buttons: **WhatsApp** (opens the menu with the page's default purpose preselected; without JS it links straight to the default message) and **Llamar** (`tel:+595992279599`).
- Height 56 px plus `env(safe-area-inset-bottom)`. `body` gets matching `padding-bottom` so the footer is never hidden.
- It stays hidden while the hero's primary CTA is in view (IntersectionObserver), so the first screen is not duplicated. It must add no CLS.
- `data-ev="wa_click" data-ev-loc="mbar"` and `data-ev="tel_click"`.
- Desktop keeps the header pill and the FAB.

### 4.6 Form (`/contacto/`)

- The "mensaje" radio group becomes a **purpose** select with the §4.1 ids (the value is the id, the label is the text).
- Add an optional **Ciudad o barrio del inmueble** field.
- `lead-forward.php` passes `purpose` and `ciudad` to VenderCRM (`/api/v1/leads`) and `leads.log`. Everything else stays: the private config above `public_html`, the honeypot, the error redirects.
- `gracias.html?p=<purpose>` shows a "¿Querés adelantarlo? Escribinos por WhatsApp" button using `MESSAGES['/gracias.html'][purpose]`. It stays noindex.
- The error path (`?error=envio`) gets a pre-written message (see §4.2).
- One real test lead after deploy (human-confirmed in VenderCRM), using the name "PRUEBA – borrar".

---

## 5. Ranked work items

Models:
- **Opus 5.5 medium** is the director in the build window: it writes the specs, the copy that carries legal or price wording, reviews every diff, and runs the git flow.
- **Sonnet 5.5** subagents do the mechanical and fan-out work at the effort shown.
- Never Fable.

| # | Item | Effort | Ranking risk | Model | Human decision |
|---|---|---|---|---|---|
| 1 | **Bring master up to the live branch**: PR `audit-fixes-2026-09-13` → master. Before it: deterministic build (hash assets with `\r` stripped; `lastmod` per page from a constant or git date, never today), rebuild, add `deploy/vendercrm-config.php` and `**/vendercrm-config.php` to `.gitignore`. Merge when CI is green. | S | None (identical content; only `?v=` and `lastmod` change) | Opus | Q1 (which branch Hostinger deploys) |
| 2 | **Number switch everywhere** (§1.4 table): generated HTML, source, JSON-LD, docs and legacy-copy | S | Low (NAP change: update GBP the same day) | Sonnet low | none (decided) |
| 3 | **WhatsApp message map + QA check** (§4.2–4.3): new `content/wa-messages.mjs`, renderer reads it, `tools/check-contact.mjs` added to `verify.mjs` | M | None (hrefs only) | Opus writes all messages; Sonnet medium wires and writes the check | none |
| 4 | **QA tooling**: `tools/seo-audit.mjs`, `tools/seo-diff.mjs`, `tools/link-check.mjs` (internal links, anchors, the 8 legacy 301s), in `verify.mjs` or CI | S–M | None | Sonnet medium | none |
| 5 | **Fer's facts into copy** (§1.5 rows 1, 2, 4, 7, 8, 11, Q4, Q5): pricing contradiction, judicial deadline, report contents, franja deliverables, payment, validity | M | Low (body copy on ranking pages; titles and H1s untouched) | Opus | none for these rows |
| 6 | **FAQ expansion** (+6–8 Q&As from Fer) with `FAQPage` schema, plus one FAQ per vertical where it fits | S | Positive | Sonnet medium, Opus review | none |
| 7 | **Mobile sticky bar** (§4.5) and the extra CTAs (§4.4) | M | None if CLS = 0 | Sonnet medium | none |
| 8 | **Form purpose, city and gracias follow-up** (§4.6), PHP lint | S–M | None | Sonnet medium | none |
| 9 | **Contextual internal links**: each vertical links to 2–3 siblings plus the matching purpose page; FAQ answers link to verticals; hub intro links all | S | Positive | Sonnet low | none |
| 10 | **New `/tasaciones/sucesiones-y-juicios/`**, if Phase 0 data backs it | M | Low (new URL; `#judicial` becomes a summary linking to it, so no cannibalization) | Opus copy, Sonnet medium wiring | none if the data backs it |
| 11 | **Restore the legacy guides** (`/guias/que-es-…`, `/guias/documentos-…`) as real pages, and remove their two 301 lines. Add `/guias/vigencia-de-una-tasacion/` only if it has volume | M | Low–positive | Sonnet medium drafts from legacy copy plus Fer's facts; Opus edits | none if the data backs it |
| 12 | **City pages** (`/zonas/<city>/`) only for cities with Paraguay volume, each with unique local content (no city-name swaps) | L | Medium (thin-page risk). Skip if the data is weak | Opus | Q7 if volumes are marginal |
| 13 | **IVA incluido and the new published conditions** (§1.5 rows 5, 12, Q1–Q3, Q6) | S | None | Opus | **Q2** |
| 14 | **Analytics**: set `ANALYTICS_ID`; WhatsApp, tel and form events as conversions | S | None | Sonnet low | **Q5** (the id) |
| 15 | **Schema polish**: `BreadcrumbList` on hub, home, nosotros and contacto; `telephone` updated; `priceSpecification.valueAddedTaxIncluded` to match Q2 | S | Positive | Sonnet low | none |
| 16 | **Meta description polish**: casas (188 → ≤160), FAQ (82 → 120–155). Titles unchanged | S | Low | Sonnet low, Opus approves the wording | none |
| 17 | Home hero bank wording (§1.5 #9) and hipotecaria "valor de liquidación" | S | None | Opus | **Q3, Q4** |

Order in the build window: 1 → 2 → 3+4 → 5+6 → 7+8+9 → 10+11 (data-gated) → 13–17 as decisions allow → 12 last (optional).

---

## 6. Git flow and verification (the build window does all of it itself)

Claude runs the whole flow and stops only for Anton's decisions (§8):
- branch
- commit (explicit paths only; never `git add -A`)
- push
- open a PR (following the repo's template if one exists)
- wait for checks
- fix review comments and CI failures
- resolve merge conflicts by merging the base branch in (never rebase or force-push shared branches)
- merge only when verified
- after the merge, check that the live site matches

It **fixes** anything it finds along the way (broken links, lint, build and verify failures, CI errors) instead of just reporting it.

Hostinger may auto-deploy on a merge to the deploy branch, so **treat every merge as a deploy**:
1. Before merging: local build, `node verify.mjs`, `tools/check-contact.mjs`, `tools/link-check.mjs`, `tools/seo-audit.mjs` plus `seo-diff` against the baseline, `tests/wa-menu.mjs`, the Playwright pass at 1366 and 390 (console, failed requests, broken images, horizontal scroll, viewport screenshots to `audit-shots/`), and `php -l lead-forward.php`.
2. Merge (merge commit).
3. After merging: wait for the deploy. Re-crawl the live host with `seo-audit` and diff it. Grep the live HTML for the new number and the absence of the old one. Click-test WhatsApp on one page at 390. Ask Anton to purge the Hostinger CDN if a stale `site.css` or `site.js` shows up.
4. If live does not change within about 10 minutes, the merge did not deploy (probably the wrong branch in hPanel). Report that as a blocker for Anton; do not keep pushing.

**PR granularity:** one PR per numbered block in §5's order, each small enough to review. PR 1 is step 1 alone.

**Step 1 PR already open:** https://github.com/antonmarklundcom/tasacion/pull/18 (draft; head `claude/compassionate-planck-oyuk36` → `master`). It carries the live branch's 9 commits plus these planning docs. CI is expected red until Phase 1 pushes the deterministic-build fix to that branch.

**Parallel Sonnet session (optional):** item 4 (QA tooling: `tools/seo-audit.mjs`, `seo-diff.mjs`, `link-check.mjs`) touches only new files under `tools/`. It can run as a separate Sonnet 5.5 medium chat that opens its own PR and does not merge. The Opus window reviews and merges it after PR #18.

---

## 7. Setup needed before the build window (environment, not decisions)

- **Network**: allow `tasacion.com.py` (and `crm.clientes.com.py`) in the cloud environment's allowed domains, or run the build window on the PC. Without it, the post-deploy live check cannot run.
- **keyword-library MCP**: connect it to the session that runs the build window. Without it, items 10–12 are skipped.

---

## 8. Open questions for Anton (real decisions only)

- **Q1. Deploy branch.** After master catches up (item 1), should Hostinger deploy **master** from then on? Recommended: yes, so PRs merge to master and the audit branch retires. Does a merge auto-deploy today, or is it a manual pull in hPanel?
- **Q2. Prices and conditions to publish.** Fer agreed to all of these; which go on the site?
  - (a) "IVA incluido" with the same figures
  - (b) interior travel: "+ Gs. 200.000 Cordillera/Paraguarí, más lejos a presupuesto"
  - (c) express: "+ desde Gs. 300.000"
  - (d) volume: "precio por volumen bajo contrato" without a figure
  - (e) franja stays "a presupuesto"
  - (f) the bank-rejection guarantee, and its exact wording

  Recommended: a, b, d, e and f published; c as "consultá recargo".
- **Q3. Home hero bank claim.** It says the report "firmado por el Tasador Fernando Capurro" is ready for "tu banco". Fer is not on the BCP register yet. Keep it as it is (the current rule), or add "para crédito, firma un tasador inscripto en el BCP" to the hero?
- **Q4. "Valor de liquidación"** is in the hipotecaria "incluye" list. Fer's description of the mortgage report does not mention it. Keep or remove?
- **Q5. Analytics.** Which GA4 or GTM id? Or should the site stay without analytics?
- **Q6. Uncommitted work on the PC.** The committed HTML was built from a `site.js` that is not in git. Run `git status` in `C:\Claude 1\tasacion-com-py`: is there anything to push, or can it be discarded?
- **Q7. City pages.** Build city pages only where the keyword library shows volume. Is that acceptable, or should none be built?

---

## Appendix A: `tools/seo-audit.mjs` (the script that produced `audit-before.json`)

Run:

```
node serve.mjs &
BASE=http://127.0.0.1:4322 OUT=… SHOTS=audit-shots node tools/seo-audit.mjs
```

For live, run with `BASE=https://tasacion.com.py`.

Fields per page:
- `status`, `title`, `titleLen`, `metaDescription(Len)`, `robots`, `canonical`, `h1`, `h2`
- `wordCountMain`, `internalLinksOut`, `internalLinksIn`, `externalLinks`
- `imagesWithoutAlt`, `imagesEmptyAlt`, `schemaTypes`, `schemaParseErrors`
- `ogImage`, `lang`, `waLinks` (number, text, loc), `telLinks`, `forms`

Per viewport (`vp1366`, `vp390`):
- `hScroll`, `brokenImages`, `lcp` (tag, src, text), `fontsLoaded`
- `consoleErrors`, `failed`, `js/css/img/fontBytes`, `requests`

Summary:
- `brokenInternal`, `waNumbers`, `telLinks`
- `waLinksTotal`, `waLinksEmptyText`, `waDistinctTexts`

```js
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:4322';
const SITE = 'https://tasacion.com.py';
const OUT = process.env.OUT || 'docs/audit/audit-after.json';
const SHOTS = process.env.SHOTS || 'audit-shots';
const sitemapXml = await (await fetch(BASE + '/sitemap.xml')).text();
const sitemap = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const urls = [...sitemap, SITE + '/404.html', SITE + '/gracias.html'];
mkdirSync(SHOTS, { recursive: true });
const browser = await chromium.launch({ executablePath: existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
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
    await page.screenshot({ path: `${SHOTS}/${(path.replace(/^\/|\/$/g, '').replace(/[\/.]/g, '-') || 'home')}-${vp.w}.png`, fullPage: true });
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
```

Note: in `audit-before.json` the previous number is masked as `OLD_NUMBER` so that the repo-wide old-number check can stay strict. `seo-diff` should treat `OLD_NUMBER` in the baseline as "the old number".
