# Tasación operations — updated 8 October 2026

Repository: https://github.com/antonmarklundcom/tasacion. Public site: https://tasacion.com.py. Baseline reviewed: `ba2e898`. Delivery branch: `codex/whatsapp-number-20261008`.

## Current state

Static HTML generated with Node, plus a PHP contact handler. No application database, admin dashboard, migration process or scheduled worker exists in this repository. Production uses Hostinger's PHP/static hosting; this is not a managed Node.js server application.

Contact is **+595 995 628862**, controlled by `content/wa-messages.mjs`. All 130 messages identify Tasación.com.py and retain their page/service/purpose details. There are 16 sitemap routes and two extra pages. Historical specifications and audit snapshots retain the numbers and facts recorded at their original dates; use this document for current operations.

This branch contains the contact update, generated output, matching verification assertions, a Windows hash-verification correction and [20 review findings](audit/2026-10-08-repository-review.md). Implemented does not mean merged or deployed. The pull request records delivery status and checks. Live hosting and CRM delivery have not been verified by this work.

## Edit, build and Git

Local runtime checked: Node 24.19.0. Existing CI selects Node 20; its result must be checked separately. No package installation is needed for generation and structural verification.

1. Edit `content.mjs` for page copy, `content/wa-messages.mjs` for contact/messages, or `assets/` for styles/scripts. Do not hand-edit generated HTML.
2. Run `node build-site.mjs` and `node tools/check-contact.mjs` / `node tools/link-check.mjs`.
3. Stage generated HTML with its source changes. `node verify.mjs` regenerates and checks `git diff` against the Git index, so it expects generated changes staged or committed.
4. For the normal dependency setup use `npm ci`. Run `npx playwright install chromium`, then `node tests/wa-menu.mjs` for interactive QA. The bundled desktop Playwright runtime may be used for local validation without changing dependencies.
5. Run `git diff --cached --check`, commit to a `codex/` branch, push and open a PR against `master`. Inspect all GitHub checks. The existing screenshot job produces a downloadable review artifact.

Preview: `node serve.mjs`, then http://localhost:4322. This server is for development only; it does not run PHP or emulate Apache redirects/access rules. The script currently binds without a loopback restriction; use a trusted local environment. Stop the process when finished.

## Deployment and recovery

See [DEPLOY.md](DEPLOY.md). That document describes Hostinger Git deployment from `master` into `public_html`, with optional auto-deploy webhook, and an alternate `deploy/make-zip.sh` archive flow. Actual hPanel/webhook state was not inspected; a push/merge alone is not proof of live publication.

Before a release, retain a hosting backup and separately preserve private configuration and lead data. Confirm PHP and cURL are available. After deployment, purge Hostinger's CDN per the deployment procedure and inspect a fresh browser session: header/footer/FAB/mobile WhatsApp destinations, corporate/hipotecaria/franja/selling messages, privacy contact and thank-you purposes. Check denied access to private log/configuration URLs without downloading customer data.

For rollback, restore the previous public release while preserving current private configuration and lead data. Reverting a bad commit on `master` restores code history; verify whether the hosting deployment actually follows that revert. Keep snapshots outside the public web root.

## Contacts, CRM and private data

`lead-forward.php` reads `VENDERCRM_URL` and `VENDERCRM_API_KEY` from environment variables first, otherwise `vendercrm-config.php` one level above `public_html`, with a document-root fallback. Only the non-secret `deploy/vendercrm-config.example.php` belongs in Git. Never put credential values in docs or client-side code.

The handler appends lead payloads to `public_html/leads.log` before making a CRM request to `/api/v1/leads`. The file is ignored by Git and denied by `.htaccess`. It contains customer records; do not copy it into this manual or repository. A CRM failure with successful local logging still redirects to the thank-you page. No replay job exists: the owner must currently monitor local fallback failures and arrange recovery through the CRM. The audit recommends delivery-state tracking and replay.

Attribution comes from `https://crm.clientes.com.py/vc-attribution.js` and the `vc_attr` cookie. Its remote implementation, cookie configuration and availability were not reviewed. The generated analytics ID is blank. Do not assume `dataLayer` events are collected. Use synthetic contacts for any authorized handler validation; do not send test submissions into the live CRM during a source-only review.

## Owner actions and validation limits

- Review/merge the contact PR when ready, then verify the live site and CDN state.
- Update Google Business Profile, directory listings, social profiles and the CRM site's contact record to the new number if those still use the prior contact. These external records were not changed.
- Decide the next improvement batch from the audit, starting with form validation and CRM recovery.
- Confirm retention/deletion procedures and who monitors locally retained leads.
- Local `node verify.mjs` passes: deterministic build, 18 pages, 130 messages, 394 internal links/assets/anchors and legacy redirects. `git diff --cached --check` passes.
- The existing WhatsApp browser suite completed with `PASS` and exit code 0 (desktop, mobile, page defaults, popup URL, Escape and no-JavaScript fallback). The local harness used bundled Playwright/cached Chromium and stubbed external attribution. Browser cleanup was slow but completed successfully.
- PHP is unavailable on this PC. PHP lint is left to CI; PHP behavior, production CRM delivery and hosting publication require separate verification.

Local manuals reuse `C:/operation manuals/tasacion/README.md` across checkouts. New checkouts should use `C:/Projects`; this audit checkout was created in the then-active workspace before that preference was supplied and was retained in place.
