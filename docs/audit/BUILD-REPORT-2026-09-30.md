# Build report: tasacion.com.py improvement build, 2026-09-30

Executed `docs/NEXT-WINDOW-PROMPT.md` from the "Status on 2026-09-30" block, which covers Phases 3, 4, 5 and 7. Phases 0–2 were already done in PRs #18 and #19.

## PRs

| Phase | PR | State |
|---|---|---|
| 3: QA tooling | https://github.com/antonmarklundcom/tasacion/pull/20 | merged |
| 4: Fer's facts, FAQ, internal links | https://github.com/antonmarklundcom/tasacion/pull/21 | merged |
| 5: sticky bar, CTAs, form, gracias | https://github.com/antonmarklundcom/tasacion/pull/22 | see PR |
| 7: schema and meta polish, this report | the PR carrying this file (`claude/phase7-polish`) | see PR |

Each PR was branched off `origin/master` (or had it merged in), verified locally and on CI (`verify` + `screenshots`), and merged with a merge commit.

## What shipped

### Phase 3: QA tooling
- `tools/seo-audit.mjs` is the plan's Appendix A crawler, with viewport screenshots.
- `tools/seo-diff.mjs` implements the 9 fail rules of §2.3 and takes a whitelist.
- `tools/link-check.mjs` checks internal links, `#anchors` and the 8 legacy 301 lines. It can also check the 301s live (`LIVE=`), and it runs inside `verify.mjs`, so CI runs it too.
- npm scripts: `audit`, `seo:diff`, `check:links`.
- `tools/` is now blocked in `.htaccess`; before this it would have been public.
- link-check found one real bug, which is fixed: the `/informes-periciales/` hero linked to a missing `#incluye` anchor.

### Phase 4: content
- **Row 1:** the pricing contradiction on `/informes-periciales/` is fixed. The purpose sets the band; type, size and location set the amount within it.
- **Row 2:** the page now explains what an "informe oficial" is (individual, one property, signed by a matriculated professional).
- **Rows 4 and 11:** new `PLAZO_JUDICIAL_TXT` ("the court sets the deadline, normally 15 to 20 business days"). The judicial copy says the report goes to the judge and must be more precise because fees are calculated on it.
- **Row 7:** the report includes the value justification with the market analysis. Franja lists its deliverables: notification, acta de relevamiento, plans, and the planilla de cómputo y presupuesto as part of the report, never as a service.
- **Row 8:** the hipotecaria photo item now includes the building's condition and location.
- **Q4 (payment):** 50/50, cash, transfer or QR, no card.
- **Q5 (validity):** 6 months to 1 year. Both are on contacto and in the FAQ.
- **FAQ:** 8 new Q&As on `/preguntas-frecuentes/` (FAQPage 15 → 23 questions), plus one page-specific Q&A on 10 pages. All come from Fer's facts; no amounts.
- **Links:** the hub intro links all 8 verticals. Each vertical links 2–3 siblings plus its purpose page. 8 FAQ answers link to the matching page or anchor.

### Phase 5: conversion
- **Mobile sticky bar (≤768 px):** a WhatsApp menu button plus Llamar. It hides while the hero CTA is visible, and CLS is 0.
- **Extra CTAs:** "¿Otra duda? Preguntanos por WhatsApp" under every FAQ block, and a `sucesion` CTA on `#judicial`.
- **Form:** a `purpose` select with the 8 ids and an optional city field.
- **`lead-forward.php`:**
  - whitelists `purpose` and sanitizes `ciudad`
  - writes a readable `message`
  - sends `fields: {finalidad, ciudad}`, the documented extra-data object of `/api/v1/leads`
  - redirects to `/gracias.html?p=<purpose>`
- **gracias.html:** a per-purpose WhatsApp follow-up.

### Phase 7: items that needed no decision
- **Item 15:** `BreadcrumbList` on every indexable page except home, where a single crumb adds nothing. Crumb names come from the nav instead of raw slugs.
- **Item 16:** `/tasaciones/casas/` description 188 → 157 characters; `/preguntas-frecuentes/` 82 → 143. Titles and H1s are unchanged.

## Skipped, and why

- **Phase 6 (new pages: sucesiones, guides, city pages):** the keyword-library MCP is not connected in this environment (no matching tool), so there is no Paraguay volume data. Rule: no data, no new page. Phase 0's `docs/audit/keyword-map-2026-09-30.md` still holds.
- **Phase 7 items 13, 14 and 17** wait on Anton's answers. The Q1–Q7 answers in the request arrived as unfilled template placeholders.
  - Item 13 (IVA incluido, travel, express, volume, guarantee wording) waits on Q2.
  - Item 14 (analytics id) waits on Q5.
  - Item 17 (hero bank line and "valor de liquidación") waits on Q3 and Q4.
  - `priceSpecification.valueAddedTaxIncluded` also waits on Q2(a).
- **Meta descriptions of `/` (180 characters) and `/tasaciones/` (162):** these are WARN only in seo-diff. The plan named only casas and FAQ, and the home snippet is what ranks today, so I left them.

## Keyword map outcome

Unchanged from Phase 0: the MCP is unavailable, so the map stays provisional. Every existing page keeps its target, and no new page was built.

## SEO diff, baseline → final (local build; live host blocked)

`node tools/seo-diff.mjs docs/audit/audit-before.json docs/audit/audit-after-phase7.json`:

- **0 FAIL.** All 16 sitemap URLs return 200. Titles, canonicals, robots and H1s are unchanged. No schema type was lost; BreadcrumbList was added to 7 more pages. The sitemap set is identical, and no page lost an inbound internal link.
- **Word count** went up on 12 pages, for example franja 394 → 452, the hub 446 → 499 and informes-periciales 1086 → 1129. It went down on none.
- **WARN (intended):** the casas and FAQ descriptions changed, and both now sit inside 110–160.
- **WARN (existing):** the description lengths of `/`, `/tasaciones/`, 404 and gracias.
- **WhatsApp links:** 224 → 273, distinct texts 109 → 127, empty texts 19 → 0.

Per-phase audits: `docs/audit/audit-after-phase3.json`, `-phase4.json`, `-phase5.json`, `-phase7.json`.

## Number check

- `tools/check-contact.mjs` (inside verify, on every PR) passes.
- Every `wa.me` link uses `595992279599`, the only `tel:` is `tel:+595992279599`, no WhatsApp text is empty, and there is no old-number match in any tracked file.

## Playwright (1366 and 390, 18 pages, every phase)

- No horizontal scroll, no broken images.
- The only console error or failed request is `https://crm.clientes.com.py/vc-attribution.js`, which the sandbox blocks (`ERR_TUNNEL_CONNECTION_FAILED`). Recheck it live.
- **At 390:** the sticky bar is hidden while the hero CTA is visible and appears after scrolling. Tapping WhatsApp opens the menu on the default row, the menu fits above the bar, the footer ends above the bar, and CLS is 0.0000.
- **At 1366:** no bar, and the FAB is visible.
- `tests/wa-menu.mjs` PASS.

## Open items for Anton

1. **Q1–Q7 (plan §8):** still unanswered, because the answers came through as template placeholders.
   - Q1 (deploy branch) is the most important. Until Hostinger deploys `master`, none of PRs #18–#22 or this one is live.
   - Q2–Q5 unblock Phase 7 items 13, 14 and 17.
   - Q6: is there uncommitted work on the PC?
   - Q7: city-page policy.
2. **Live verification after deploy:** the sandbox cannot reach `tasacion.com.py` (proxy 403). After switching the deploy branch, run:
   - `BASE=https://tasacion.com.py node tools/seo-audit.mjs`, then `node tools/seo-diff.mjs docs/audit/audit-after-phase7.json <live.json>`
   - `LIVE=https://tasacion.com.py node tools/link-check.mjs` (the 8 legacy 301s)
   - open one WhatsApp link at 390
3. **CDN:** if `site.css` or `site.js` look stale after deploy, purge the Hostinger CDN (hPanel → Performance → CDN → Purge).
4. **Off-site NAP:** update the number on Google Business Profile, directories, social bios and the VenderCRM site record to +595 992 279 599.
5. **One real test lead:** use the name "PRUEBA – borrar" and confirm in VenderCRM that the contact arrives with `finalidad` and `ciudad` on its timeline. The request payload now carries `fields`; if the API ever answers 422 for it, `leads.log` still keeps the lead.
6. **keyword-library MCP:** connect it to a later session to unlock Phase 6.

## Models and effort

| Phase | Director | Subagents |
|---|---|---|
| 3 | Opus 5.5 medium (review, anchor fix, verify, PR) | Sonnet 5.5 medium: built the three tools |
| 4 | Opus 5.5 medium (Fer's-facts copy, Spanish review, dedupe) | Sonnet 5.5 medium: FAQ expansion (A); Sonnet 5.5 low: internal links (B) |
| 5 | Opus 5.5 medium (review; moved CRM extras into `fields`; merge) | Sonnet 5.5 medium: sticky bar and CTAs (C); Sonnet 5.5 medium: form, PHP, gracias (D) |
| 7 | Opus 5.5 medium (breadcrumbs, descriptions, this report) | none |

Fable was not used anywhere.
