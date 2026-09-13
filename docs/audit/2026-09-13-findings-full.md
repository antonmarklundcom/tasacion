# Website audit — 2026-09-13

Requested target: https://tasacion.com/. Source directory: `C:/Claude 1/tasacion`.

No website code was changed, rebuilt, deployed, or submitted through a form. Findings below distinguish source evidence from live observations. Severity describes the issue or priority of an unresolved verification gap, not proof of a live outage.

## Scope and live cross-check

- **high — Domain discrepancy:** `content.mjs:6`, `.htaccess`, `robots.txt`, `sitemap.xml` and all generated canonical/OG URLs identify `https://tasacion.com.py`, not the requested `https://tasacion.com`. The source only redirects `www.tasacion.com.py`. **Suggested fix:** Establish the intended production domain and align deployment, redirects, canonicals and sitemap with it.
- **NOT CHECKED — https://tasacion.com/:** Web retrieval returned “not safe to open”; PowerShell could not connect; curl returned error 7 connecting to port 443. No HTTP response status was obtained, so these are not verified 404s or proof the site is down. Browser access subsequently was rejected by browser security policy because permission was reported declined; browser attempts stopped.
- Supplemental live check: the source-configured [home page](https://tasacion.com.py/) returned readable HTML text through the web tool, marked crawled today. Its title, hero, navigation, services, credentials and conflicting seller-service disclaimer match the local home page. This does not establish a redirect from `.com` or byte-for-byte deployment parity.
- All 14 distinct internal page destinations linked from that `.com.py` home were requested, plus its home: 15 pages total, below the 40-page cap. Thirteen returned tool “Cache miss” errors; the seller page returned an old cached title with zero content lines. **NOT CHECKED:** fresh HTTP statuses and full live metadata for those pages. An old cached title is not treated as a deployment defect.
- **NOT CHECKED:** discovery of the actual `.com` home-page links, because its HTML could not be retrieved. The supplemental `.com.py` crawl is explicitly not a replacement claim that `.com` was crawled successfully.
- Local inspection covered 15 core pages plus `404.html` and `gracias.html`. `docs/design-canvas-export.html` is a non-production design artifact excluded by the deployment allowlist and blocked by `.htaccess`; its four H1s and missing metadata are not public-site findings.
- Read `build-site.mjs`, `content.mjs`, generated HTML, `assets/js/site.js`, relevant CSS, `lead-forward.php`, `serve.mjs`, `build-images.mjs`, package manifests, deployment script and CI/test references. Static checks used PowerShell/.NET extraction, filesystem resolution and JSON parsing. No AGENTS.md was found in the project.

## Broken links and 404s

- **medium — `informes-periciales/index.html`, `/informes-periciales/#incluye`:** Hero link “Ver qué incluye” points to an absent `id="incluye"`; the page instead has sections such as `compraventa`, `credito` and `judicial`. **Suggested fix:** Point the CTA to the relevant existing section or give the intended section that ID in the generator.
- PASS (source): all root-relative `href`/`src` file destinations and referenced responsive image variants resolve to local files; other same-page fragment links resolve. Cross-page fragment targets and external link responses were not exhaustively tested.
- **NOT CHECKED — live URLs in the inventory:** HTTP 404s, redirect chains, soft 404 behavior, external WhatsApp destinations and actual telephone reachability; no usable live HTTP response evidence was available. A local file existing does not prove its deployment.
- `404.html` and Apache `ErrorDocument 404 /404.html` are present. **NOT CHECKED:** actual production unknown-path status and Apache configuration activation.

## Titles and meta descriptions

- PASS (source): all 17 public HTML files have exactly one nonempty title and one nonempty description; no duplicate values across those files.
- **low — `tasaciones/hipotecaria/index.html`, `valuacion-para-vender/index.html`:** Descriptions contain several sentences and lengthy credential or exclusivity detail, making the main message vulnerable to search-snippet truncation; this is not a missing/duplicate-tag failure. **Suggested fix:** Front-load the service and differentiator and shorten supporting detail.
- **NOT CHECKED — live internal pages:** head markup and duplicate metadata across the deployed site; the web tool’s cached seller-page title is insufficient evidence.

## H1 headings

- PASS (source): exactly one H1 per public HTML file, including both utility pages. The supplemental live `.com.py` home extraction also shows one H1.
- **NOT CHECKED:** rendered H1 counts on remaining live pages.

## Image alt text

- PASS (source): all public `<img>` elements have nonempty alt attributes. SVG decorative icons were not treated as images missing an HTML `alt` attribute.
- **NOT CHECKED:** visual accuracy of every description against its bitmap and runtime-inserted images; no rendered image review was completed. The live home extraction exposes its hero image description.

## Schema.org JSON-LD

- PASS (source syntax/presence): every public file contains JSON-LD and every extracted block parses. Types include `ProfessionalService`, `Service`, `FAQPage`, and `BreadcrumbList` where generated. FAQ data is generated from the same content objects as visible answers.
- **medium — `build-site.mjs` → `serviceJsonLd()`, `tasaciones/hipotecaria/index.html`:** Mortgage-service Offer uses purchase/sale minPrice 800000 and maxPrice 1500000 PYG, while its visible mortgage pricing starts at 1500000 with no stated maximum. **Suggested fix:** Generate service-specific offers from `PRECIOS.credito` for mortgage services and match visible pricing.
- **low — `build-site.mjs` → `serviceJsonLd()`:** `areaServed` is hardcoded to Asunción/Gran Asunción even for countrywide services such as `tasaciones/campos/index.html`, whose copy describes Paraguay coverage. **Suggested fix:** Generate coverage from each service’s actual scope.
- **NOT CHECKED:** full Schema.org property/range validation and Google rich-result eligibility using external validators; parseable JSON and recognizable types alone do not prove semantic validity or eligibility. No unsupported rich-result guarantee is made.

## sitemap.xml and robots.txt

- PASS (source): both files exist. Sitemap is parseable XML with the 15 core routes, omitting noindex utility pages; robots permits the site and declares a sitemap URL.
- Domain discrepancy applies: all sitemap URLs and robots' sitemap declaration use `.com.py`.
- **low — `build-site.mjs`, `sitemap.xml`:** HTML generation does not generate/update the sitemap; additions or date changes can drift from manually maintained XML. No current missing core route was found. **Suggested fix:** Generate the sitemap from `PAGES` and meaningful modification dates or validate the manual file in CI.
- **NOT CHECKED — https://tasacion.com/robots.txt and https://tasacion.com/sitemap.xml:** both retrieval attempts failed without HTTP status evidence. Supplemental `.com.py` live robots/sitemap availability was not fetched; local presence is not a live pass.

## Hreflang and multilingual support

- NOT APPLICABLE (source): the public site is Spanish-only, declares `lang="es-PY"` and `og:locale="es_PY"`, and has no translated routes or language switcher. No hreflang is required merely because the language has a regional variant.
- **NOT CHECKED:** whether other language versions exist outside the available source/live home.

## Mobile viewport

- PASS (source): all public pages contain `width=device-width, initial-scale=1`; CSS has mobile breakpoints.
- **NOT CHECKED:** actual mobile layout, overflow, device rendering or tap-target usability; no mobile browser run completed.

## Page weight and images over 300 KB

- **low — `assets/img/tasacion-de-inmuebles-asuncion-1920.webp`:** 359,926 bytes (359.9 decimal KB / 351.5 KiB), exceeding 300 KB; referenced as a responsive candidate by the home and `/tasaciones/`. It is already compressed WebP, not an uncompressed bitmap. **Suggested fix:** Re-encode or resize the large WebP fallback while checking visual quality.
- All other local image files are below 300,000 bytes. AVIF alternatives exist. No raw PNG/BMP image is shipped in `assets/img`; JPEG social image is 89,777 bytes.
- Local core HTML sizes range from 21,724 to 40,348 bytes; shared CSS is 27,577 bytes and JS is 5,817 bytes. The inventory below includes deterministic subtotals of HTML + CSS + JS + the single `<img src>` fallback where present. These are decoded local asset sizes, not actual browser transfer weights; a browser commonly chooses an AVIF source instead.
- **NOT CHECKED:** production Content-Encoding, Brotli/gzip, cache headers, font downloads, measured cold/warm total page weight, LCP and waterfall. Images being over 300 KB does not establish that HTTP compression is missing; applying gzip to already-compressed images is not the suggested remedy.

## Render-blocking scripts

- **low — `build-site.mjs` → `renderPage()`, all public HTML:** `assets/js/site.js` is a classic script without `defer` or `async`. It is at the end of body, so its parser-blocking effect is limited; the two inline head configuration assignments are tiny. **Suggested fix:** Add `defer` to the external site script and verify menu/form initialization.
- The site stylesheet is a normal render-blocking CSS dependency; Google Fonts CSS is preloaded and switched on load, with a noscript fallback. Optional analytics scripts are created with `async`.
- **NOT CHECKED:** actual blocking duration or performance impact in a browser waterfall.

## Mixed content

- PASS (source): no active `http://` links in public HTML `src`, `href` or form `action` attributes; first-party assets use relative paths and external fonts/WhatsApp/analytics use HTTPS. XML/SVG namespace identifiers are not mixed-content fetches.
- **NOT CHECKED:** runtime requests, production redirect targets, server-configured CRM URL and browser mixed-content warnings.

## Canonical tags

- PASS (source presence): exactly one canonical per public page, pointing at the corresponding `.com.py` route, including utility pages.
- **high — `content.mjs:6`, all generated pages:** canonical host differs from the requested audit host; whether this is correct alias canonicalization or wrong-domain configuration is unresolved. **Suggested fix:** Resolve the domain discrepancy before changing tags; then use a consistent preferred host and redirects. This is the same domain issue recorded in scope, not a second independent defect.
- **NOT CHECKED:** deployed canonical values and whether `.com` redirects to `.com.py`.

## Forms: visible success and error handling

- PASS (source success path): `contacto/index.html` posts to `/lead-forward.php`, whose normal completion redirects to `/gracias.html`; that page visibly acknowledges receipt. HTML `required` and email-type validation are present.
- **high — `lead-forward.php`, `contacto/index.html`, `assets/js/site.js`:** A telephone shorter than six bytes redirects to `/?error=telefono#contacto`, but the home has no `contacto` ID and there is no query-error renderer; the contact form only checks that telephone is nonempty. **Suggested fix:** Return to the contact form with a visible, accessible telephone error and preserve entered fields.
- **high — `lead-forward.php` → `append_log()` and final redirect:** `@file_put_contents` suppresses failure and its result is ignored; the handler always shows success even if local persistence fails and CRM delivery is unavailable/fails. This is a source failure mode, not an observed lost production lead. **Suggested fix:** Confirm durable acceptance before success, retain/retry accepted leads, and show a recoverable error when no destination accepts them.
- **NOT CHECKED:** live form submission, CRM environment configuration, write permissions, lead delivery and PHP execution. No test lead was sent. The available Node server is static and would not execute PHP even if started.

## WhatsApp or phone CTA above the fold

- PASS (source intent): every public page includes desktop header WhatsApp, a mobile round WhatsApp link, a hero CTA and a fixed WhatsApp button; CSS switches header variants at 1024px. Phone links exist in the footer. Live `.com.py` home text exposes the header WhatsApp link.
- **NOT CHECKED:** actual above-the-fold visibility at desktop/mobile dimensions, overlays or clipping; source ordering alone does not prove rendered visibility.

## Hero value proposition and offer clarity

- PASS (source and supplemental live home text): home identifies the appraisal service, intended uses, named professional and delivery timing. No basis was found to label the whole hero unclear.
- **high — `content.mjs` → `FINALIDADES[3]`, `freeAsideVender()`, `informes-periciales/index.html`, `valuacion-para-vender/index.html`:** Seller service is described as the same report in the report-page card, while the shared aside expressly says it is not official and lacks legal/banking validity; the seller page also contrasts the two services. The disclaimer itself is confirmed in the [live home text](https://tasacion.com.py/). **Suggested fix:** Define whether the seller appraisal is the official report or a separate product and make all cards, disclaimers and comparisons agree.
- **medium — `content.mjs:810`, `informes-periciales/index.html`:** Pricing introduction says price does not depend on house size, while the same section says the quoted range depends on property type and size. **Suggested fix:** Explain that purpose determines the pricing category and type/size determines the quote within it.
- **medium — `build-site.mjs` → `renderHero()`, `renderFooter()`, seller-related hero links:** Short claims that the cost is covered omit the exclusivity condition and commission-at-closing mechanism; the detailed seller page provides those conditions. **Suggested fix:** Add a concise qualification near the seller CTA to set expectations before the click.

## Thin pages under 300 words

- **low — `contacto/index.html`:** 222 main-content word tokens, below the requested 300-word screening threshold. It is a functional contact page, so this is not automatically an SEO defect. **Suggested fix:** Add useful service-area, response-time and privacy information if it helps visitors; avoid filler.
- `404.html` has 135 main-content tokens and `gracias.html` 40; both are intentionally noindex utility pages, so these are exemptions, not thin-content defects.
- The other 14 core pages exceed 300 tokens (412–1,165). Counts strip tags from `<main>`, decode HTML entities, include collapsed FAQ text, exclude header/footer/hidden WhatsApp menu, and count runs of letters/numbers; numerals split by punctuation can count as multiple tokens. This is a repeatable heuristic, not a search-engine ranking test.
- **NOT CHECKED:** current rendered live word counts and unique-content quality beyond static copy review.

## Spanish spelling and copy editing

- **low — `content.mjs:954`, `preguntas-frecuentes/index.html`:** Succession answer expands to “el informe lo firma Perito Tasador matriculado…” without an article or named subject, producing an awkward sentence. **Suggested fix:** Use “el informe lo firma el perito…” or name Fernando Capurro before the credential.
- **low — `content.mjs` report pricing copy, `informes-periciales/index.html`:** A standalone paragraph starts with lowercase “desde Gs. 1.500.000”. **Suggested fix:** Capitalize the sentence-start label when rendering this standalone paragraph.
- No additional definite spelling mistakes established in the manually reviewed copy. Voseo forms such as “pedí”, “querés”, “escribinos”, and regional “inscripto” are not flagged as errors. Pricing/product contradictions are tracked separately above.
- **NOT CHECKED:** exhaustive dictionary-based proofreading and proofreading every deployed page; source/output review is not a certified linguistic review.

## Outdated years or dates

- PASS (source): footer JS computes the current year dynamically; sitemap lastmod values are 2026-09-05 or 2026-09-10, neither future nor inherently outdated as of 2026-09-13.
- **low — `build-site.mjs` → `renderFooter()`:** Copyright year span is empty until JS runs; the extracted live home text also has no year, although text extraction may not execute JS. **Suggested fix:** Emit a build-time year and optionally refresh it in the browser.
- **NOT CHECKED:** truth of sitemap modification dates, current validity of professional credentials, or rendered live year. Recent dates do not prove content freshness.

## Privacy or legal page

- **high — `content.mjs` PAGES/NAV, `build-site.mjs` footer/contactForm, `contacto/index.html`, `deploy/make-zip.sh`:** No privacy or legal page exists among generated/deployed pages or navigation, despite collection of name, telephone and optional email and potential CRM forwarding. **Suggested fix:** Add an accurate privacy notice and business/legal information, linked from the footer and form.
- This is a missing-information finding, not a jurisdiction-specific legal-compliance determination. **NOT CHECKED:** an unlinked policy hosted outside this source tree.

## Favicon and OG image

- PASS (source): all public files include an inline SVG data-URI favicon and an `og:image` URL. `assets/img/og-tasacion-com-py.jpg` exists at 89,777 bytes; no missing favicon finding merely because `/favicon.ico` is absent.
- Domain discrepancy affects the absolute OG host too.
- **NOT CHECKED:** production OG-image response, dimensions/visual appearance, crawler compatibility of the data-URI favicon, and real social share previews.

## Console errors and local execution

- **NOT CHECKED — `serve.mjs`, all routes:** Node is unavailable on PATH and searches in standard Program Files/AppData/.local locations did not find node.exe; no local server or Playwright console run could be started. Python/PHP were also unavailable on PATH. Browser access did not complete and was later denied. No claim of a clean console is made.
- **NOT CHECKED:** `verify.mjs`, existing browser tests, runtime JS interactions, PHP lint and end-to-end form behavior. Source was inspected without running the generator because the task forbids fixes and rebuilding would rewrite files.

## Dead code and unused dependencies

- **low — `content.mjs:9`, `content.mjs:19`, `build-site.mjs` → `renderPage(page, opts = {})`:** `PRECIO`, `CRED_SELLO_CORTA` and the render function's `opts` parameter have no consuming code references in the inspected JS/MJS sources. **Suggested fix:** Remove obsolete exports/parameters or connect them to their intended use.
- **low — `assets/css/site.css`:** `.hero__seal-mobile`, `.faq-layout` and `.wa-menu[data-open]` styles lack matching current generated markup/runtime setters; the active menu uses `.is-open`. **Suggested fix:** Remove confirmed obsolete rules after checking responsive screenshots.
- **medium — `build-images.mjs` → `WIRING`:** Legacy wiring still reads three nonexistent `zonas/.../index.html` pages if corresponding image outputs are ready; current source has no zone pages and Apache redirects old zone routes. With absent image inputs the wiring is currently skipped. **Suggested fix:** Remove the retired wiring or guard page existence and move any needed image mapping into current content generation.
- **low — `assets/img/tasador-midiendo-propiedad-asuncion-{640,1280,1920}.{avif,webp}`:** Six image variants are unreferenced by current public HTML and shipped by the whole-assets deployment copy, totaling 310,027 bytes. They do not add browser page weight unless requested. **Suggested fix:** Remove them from the deployment set if no current consumer needs them.
- **medium — `build-site.mjs` → `ANALYTICS_ID`, `assets/js/site.js`:** Generated `ANALYTICS_ID` is empty, so the analytics-loader branch never executes in these pages; CTA events only accumulate in `dataLayer` unless another deployment component consumes them. **Suggested fix:** Configure the intended analytics destination or remove the inactive integration and document that conversions are unmeasured.
- PASS (direct dependencies): `sharp` is imported by `build-images.mjs`; `playwright` is imported by browser tests. Neither declared dependency is demonstrably unused. **NOT CHECKED:** dynamic coverage, unused transitive dependencies or complete CSS coverage.

## Page inventory and measurements

The following paths are relative to `https://tasacion.com.py`; source files map to `<path>/index.html` (home to `index.html`). For the requested `.com` domain, all page-level live checks remain NOT CHECKED. Supplemental live results below are retrieval outcomes, not HTTP status codes. Core pages all pass local title/description/H1/alt-presence/canonical/viewport/JSON-parse checks; semantic findings above still apply.

| Page path | Supplemental live result | Main word tokens | HTML bytes | Local fallback subtotal, bytes |
| --- | --- | ---: | ---: | ---: |
| `/` | Readable extraction, crawled today | 892 | 32,465 | 252,843 |
| `/tasaciones/` | NOT CHECKED: Cache miss | 442 | 27,563 | 247,941 |
| `/tasaciones/casas/` | NOT CHECKED: Cache miss | 819 | 32,313 | 173,537 |
| `/tasaciones/departamentos/` | NOT CHECKED: Cache miss | 803 | 32,382 | 165,612 |
| `/tasaciones/terrenos/` | NOT CHECKED: Cache miss | 780 | 32,095 | 165,249 |
| `/tasaciones/corporativa/` | NOT CHECKED: Cache miss | 792 | 33,201 | 163,651 |
| `/tasaciones/hipotecaria/` | NOT CHECKED: Cache miss | 690 | 30,953 | 89,485 |
| `/tasaciones/locales-comerciales/` | NOT CHECKED: Cache miss | 745 | 32,060 | 155,402 |
| `/tasaciones/campos/` | NOT CHECKED: Cache miss | 840 | 33,184 | 111,068 |
| `/tasaciones/franja-de-dominio/` | NOT CHECKED: Cache miss | 460 | 26,959 | 160,113 |
| `/informes-periciales/` | NOT CHECKED: Cache miss | 1,165 | 40,348 | 174,690 |
| `/valuacion-para-vender/` | NOT CHECKED: old cached title, no body | 548 | 26,251 | 176,561 |
| `/nosotros/` | NOT CHECKED: Cache miss | 412 | 24,411 | 98,457 |
| `/preguntas-frecuentes/` | NOT CHECKED: Cache miss | 566 | 27,437 | 60,831 |
| `/contacto/` | NOT CHECKED: Cache miss | 222 | 21,724 | 55,118 |
| `/404.html` | Local-only utility check | 135 | 18,478 | 51,872 |
| `/gracias.html` | Local-only utility check | 40 | 16,590 | 49,984 |

## Ten highest-impact items

1. **high:** Resolve `.com` versus `.com.py` identity and complete the blocked live verification; do not assume a live outage or alter canonicals without resolving it.
2. **high:** Fix invalid-phone handling so users receive an error on the contact form.
3. **high:** Prevent false form success when neither logging nor CRM delivery accepts a lead.
4. **high:** Add privacy and legal/business information linked beside data collection.
5. **high:** Reconcile the seller appraisal being described as both the same official report and a nonofficial product.
6. **medium:** Correct the mortgage Offer JSON-LD price range.
7. **medium:** Repair the report page’s broken `#incluye` hero link.
8. **medium:** Resolve contradictory statements about whether property size affects price.
9. **medium:** Qualify seller cost-coverage CTAs with exclusivity and closing conditions.
10. **medium:** Configure conversion analytics or explicitly document the inactive integration.
