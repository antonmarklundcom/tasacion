# tasacion.com.py — improvement report (12 October 2026)

Baseline: `master` at `e3a9541` (PR #33). Source review only: no live form was submitted, no hosting
configuration inspected. The 8 October review listed 20 findings; PRs #29–#33 resolved the delivery
ones (durable outbox outside the web root, retries, receipts, queue status, heartbeat). This report
lists what is still open plus new findings, grouped and prioritised. Each item has a number that the
companion prompt (`prompts/opus-5.5-improvements.md`) reuses, so you can strike items by number.

Priority: **P1** fix before pushing more traffic · **P2** next batch · **P3** hygiene.
Effort: **S** < 1 h · **M** half a day · **L** a day or more.

## A. Lead capture (`lead-forward.php`, `contacto/`)

| # | Pri | Eff | Finding | Fix |
|---|-----|-----|---------|-----|
| 1 | P1 | S | Phone validation is only `strlen 6–30`; `abcdef` passes and later gets rejected by the CRM, so the visitor sees "gracias" but no lead arrives. (`lead-forward.php:31-35`) | Normalise (strip spaces, dashes, dots, parentheses; accept leading `+`), require 6–15 digits, keep the raw value for the CRM message. Mirror it in the browser with `pattern` on the `tel` input. |
| 2 | P1 | S | Email is never validated server-side; the CRM rejects a malformed address and the whole lead with it. (`lead-forward.php:38`) | `filter_var(FILTER_VALIDATE_EMAIL)`; if invalid, drop the email from the payload (it is optional) rather than failing the lead. |
| 3 | P1 | M | Abuse control is one honeypot. Anyone can POST in a loop, filling the outbox and hammering the CRM. (`lead-forward.php:24`) | File-based per-IP rate limit inside the private outbox dir (e.g. 5 submissions / 10 min, hashed IP), plus a minimum fill time via a timestamp hidden field. Over the limit → `/contacto/?error=envio` so the WhatsApp fallback still shows. |
| 4 | P2 | M | On `?error=telefono` / `?error=envio` the form reloads empty; name, purpose, city and message are lost. (`assets/js/site.js:28-45`) | Save non-sensitive fields to `sessionStorage` on submit, restore them on the error page, focus the invalid field, keep the WhatsApp fallback link. |
| 5 | P1 | S | The retry runner exists (`tools/lead-delivery.php retry|status|heartbeat`) but nothing schedules it and the docs still say "no replay job exists". A lead that fails once is only re-sent when someone runs the command. | Document the Hostinger cron line (every 10 min: `php tools/lead-delivery.php retry 20`, hourly `heartbeat`) in `docs/DEPLOY.md`, and make `tools/lead-delivery.php` refuse to run over HTTP (CLI only). |

## B. Front-end behaviour and accessibility (`assets/js/site.js`, `build-site.mjs`)

| # | Pri | Eff | Finding | Fix |
|---|-----|-----|---------|-----|
| 6 | P2 | S | `close()` schedules `menu.hidden = true` after 200 ms and never cancels it; reopening within that window gets the fresh menu hidden. (`site.js` close) | Keep the timer id, `clearTimeout` in `open()`, and guard the callback with `if (!isOpen())`. |
| 7 | P2 | M | Mobile nav has no Escape, outside-click or focus return; WhatsApp menu claims `aria-modal` but the background is not `inert` and body scroll is not locked. | Share one dismiss helper: Escape + outside click close both, focus returns to the trigger, `document.body` gets `overflow:hidden` and siblings `inert` while the WA dialog is open. Keep no-JS fallback. |
| 8 | P2 | S | Both the menu trigger and the chosen option push `wa_click`, so one WhatsApp journey counts twice. (`site.js:6`, `build-site.mjs` trigger markup) | Trigger → `wa_menu_open`, option → `wa_outbound_click`; add `form_submit` on the contact form. Update `verify.mjs`/tests that grep `data-ev`. |
| 9 | P2 | S | No skip link; keyboard users tab through the full header and dropdown on every page. | Add a visually-hidden "Saltar al contenido" link as first child of `<body>`, target `<main id="contenido">`. |
| 10 | P2 | S | Hero `<img>` has no `width`/`height`, so the first paint shifts (CLS). (`build-site.mjs` hero) | Emit `width`/`height` from `assets/img/manifest.json` and a `sizes` attribute; verify `srcset` covers 640/1280/1920 and the AVIF `<source>` is present on every page. |
| 11 | P2 | S | `ANALYTICS_ID` is an empty string hard-coded in `build-site.mjs:745`; nothing collects the `dataLayer` events. | Read it from `process.env.ANALYTICS_ID` or a git-ignored `site.config.json`, so no code edit is needed when the GA4/GTM id arrives. Document it. (Owner must still supply the id.) |

## C. SEO and content

| # | Pri | Eff | Finding | Fix |
|---|-----|-----|---------|-----|
| 12 | P2 | S | Every `<lastmod>` in `sitemap.xml` is the hard-coded `2026-09-30`. | Generate the sitemap in `build-site.mjs` from `docs/routes.json`, with `lastmod` taken from the last git commit touching each page's content (fallback: today). Add it to `verify.mjs`. |
| 13 | P2 | S | `ProfessionalService` JSON-LD has no `@id`, `address`, `image`, `sameAs` or `openingHoursSpecification`; the `Person` block is repeated on every page. | Add `@id`, `image` (OG image), `address` (locality Asunción, country PY; street only if the owner gives it), `sameAs` (GBP/Instagram/LinkedIn when known), and reference the Person by `@id`. |
| 14 | P2 | S | `/privacidad/` does not mention the `vc_attr` first-touch cookie or the external attribution script that every page loads. | Add a short section: what the cookie stores (landing page, referrer, UTM, gclid/fbclid), lifetime, that it is sent with the form, and retention in the CRM. Owner confirms wording. |

## D. Security headers and performance (`.htaccess`, `build-site.mjs`)

| # | Pri | Eff | Finding | Fix |
|---|-----|-----|---------|-----|
| 15 | P1 | S | No security headers at all: no HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, no CSP. | Add them in `<IfModule mod_headers.c>`. Start CSP in `Content-Security-Policy-Report-Only` allowing self, `crm.clientes.com.py`, `googletagmanager.com`, `wa.me`, inline JSON-LD (`script-src` with the small inline analytics var moved to `site.js` or hashed). |
| 16 | P2 | S | Only CSS/JS get a `Cache-Control`; fonts and images (never renamed, already in immutable sizes) are served with Hostinger's default. | `max-age=31536000, immutable` for `woff2|avif|webp|jpg|svg`; keep the 300 s rule for CSS/JS. |
| 17 | P3 | S | The WhatsApp SVG path is inlined 7 times per page (≈7 KB of 35 KB); `site.css` ships unminified (32 KB). | One `<svg><symbol id="i-wa">` in the body, `<use href="#i-wa">` elsewhere. Minify CSS/JS in `build-site.mjs` (simple whitespace/comment strip, no new dependency) and hash the minified output. |
| 18 | P3 | S | `vc-attribution.js` is the first element in `<head>`, before the viewport meta, without `crossorigin`/`referrerpolicy`. | Move it after the meta tags and the stylesheet link, keep `defer`, add `crossorigin="anonymous" referrerpolicy="strict-origin-when-cross-origin"`. |

## E. CI, tests and repository hygiene

| # | Pri | Eff | Finding | Fix |
|---|-----|-----|---------|-----|
| 19 | P1 | S | CI runs only `verify.mjs` and `php -l`. The real tests (`tests/lead-delivery.php`, `tests/lead-form.cjs`, `tests/wa-menu.mjs`) never run, so the PHP queue can regress silently. | `shivammathur/setup-php@v2` (8.2, curl) + `npm run test:leads` in the `verify` job; run `node tests/wa-menu.mjs` in the screenshot job, which already has Chromium. |
| 20 | P1 | S | The screenshot job installs Playwright + Chromium with system deps on every PR (several minutes each), which burns the Actions budget. `npm install` is used instead of `npm ci`. | `npm ci`, cache `~/.cache/ms-playwright` keyed on the lockfile, and add `paths:` filters so screenshots run only when `assets/**`, `content*.mjs` or `build-site.mjs` change. |
| 21 | P3 | S | `package.json`: `"test"` exits 1 on purpose, `"main": "index.js"` does not exist, no `private`, no `engines`, no `.nvmrc` (local Node 24 vs CI Node 20). | `"private": true`, remove `main`, `"test": "npm run verify && npm run test:leads"`, `"engines": {"node": ">=20.11"}`, add `.nvmrc` = `20`. |
| 22 | P3 | S | No `README.md`. Four large planning files live at the repo root (`BUILD-SPEC.md` 96 KB, `plan.md` 56 KB, `PLACEHOLDERS.md`, `NEXT-STEPS.md`), each needing its own `.htaccess` 404 rule. | Add a one-screen `README.md` (what it is, 5 commands, where the phone/number lives, link to `docs/OPERATIONS.md`). Move the four files to `docs/history/` with a "historical" banner; keep the old `.htaccess` rules. |
| 23 | P3 | S | `docs/audit/audit-shots/` (36 WebP, 6.4 MB) is tracked although `.gitignore` lists `audit-shots/`; the repo pack is 12.6 MB for a 5 MB site. | `git rm -r --cached docs/audit/audit-shots`, keep them locally/in the PR artifact. |
| 24 | P2 | S | `docs/OPERATIONS.md` and `docs/DEPLOY.md` still describe `leads.log` and "15 páginas"; `NEXT-STEPS.md` says 13 routes; sitemap has 16. | Rewrite the lead section around the private outbox + `tools/lead-delivery.php`; make every count say "see `docs/routes.json`". |
| 25 | P3 | S | No `.editorconfig` / `.gitattributes`; the CRLF hash bug fixed in `verify.mjs` on 8 October came from exactly this. | `.gitattributes`: `* text=auto eol=lf`, binaries marked. `.editorconfig` with LF, 2 spaces, UTF-8. |
| 26 | P3 | S | `serve.mjs` listens on all interfaces. | `listen(PORT, '127.0.0.1')`. |

## Suggested order

1. **Batch 1 (P1, one PR):** 1, 2, 3, 5, 15, 19, 20.
2. **Batch 2 (front-end, one PR):** 6, 7, 8, 9, 10, 11, 16, 17, 18.
3. **Batch 3 (SEO + docs, one PR):** 12, 13, 14, 24, 22.
4. **Batch 4 (hygiene, one PR):** 21, 23, 25, 26.

Items that need something from the owner before they are complete: 11 (GA4/GTM id), 13 (street
address, social profiles), 14 (privacy wording sign-off), 5 (creating the cron in hPanel).

## Invariants the fixes must respect

- URLs, titles and canonicals are frozen in `docs/routes.json`; `verify.mjs` fails on any change.
- The phone number lives only in `content/wa-messages.mjs`; `tools/check-contact.mjs` enforces it.
- Generated HTML is committed; every change to `content.mjs`, `build-site.mjs` or `assets/` needs
  `node build-site.mjs` and the regenerated pages staged, or `verify.mjs` fails.
- `site.css`/`site.js` are content-hashed into the HTML (`?v=`); rebuild after touching them.
- Nothing under `docs/`, `tools/`, `tests/`, `prompts/` is public, but it is deployed; `.htaccess` 404s it.
