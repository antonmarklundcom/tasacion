# Tasación operations — updated 8 October 2026

Repository: https://github.com/antonmarklundcom/tasacion. Public site: https://tasacion.com.py. Deployed revision checked: `ee22d4584d4a738f53890e6f144aaeb8a1157938`. Follow-up branch: `codex/live-check-fixes-20261008`.

## Current state

Static HTML generated with Node, plus a PHP contact handler. No application database, admin dashboard or migration process exists in this repository. Lead delivery is operated through the CLI tool `tools/lead-delivery.php`, run by hosting cron jobs (see [DEPLOY.md §6](DEPLOY.md)). Production uses Hostinger's PHP/static hosting; this is not a managed Node.js server application.

Contact is **+595 995 628862**, controlled by `content/wa-messages.mjs`. All 130 messages identify Tasación.com.py and retain their page/service/purpose details. The sitemap routes are listed in `docs/routes.json`; `404.html` and `gracias.html` are the two extra pages. Historical specifications and audit snapshots retain the numbers and facts recorded at their original dates; use this document for current operations.

The contact update in PR #27 is merged and verified on all live pages (the `docs/routes.json` routes plus `404.html` and `gracias.html`). See the [live deployment check](audit/2026-10-08-live-deployment-check.md). This follow-up branch fixes mobile contact/header overflow and the header WhatsApp purpose selection; those fixes are locally verified and await merge/redeployment. The [20 review findings](audit/2026-10-08-repository-review.md) remain a separate improvement backlog. Actual hPanel configuration and production CRM delivery were not inspected.

## Edit, build and Git

Local runtime checked: Node 24.19.0. Existing CI selects Node 20; its result must be checked separately. No package installation is needed for generation and structural verification.

1. Edit `content.mjs` for page copy, `content/wa-messages.mjs` for contact/messages, or `assets/` for styles/scripts. Do not hand-edit generated HTML. The HTML references `assets/css/site.min.css` and `assets/js/site.min.js` (hashed `?v=`), which `build-site.mjs` generates from `site.css`/`site.js`; after editing the sources, rebuild and commit the regenerated `.min` files too.
2. Run `node build-site.mjs` and `node tools/check-contact.mjs` / `node tools/link-check.mjs`.
3. Stage generated HTML with its source changes. `node verify.mjs` regenerates and checks `git diff` against the Git index, so it expects generated changes staged or committed.
4. For the normal dependency setup use `npm ci`. Run `npx playwright install chromium`, then `node tests/wa-menu.mjs` for interactive QA. The bundled desktop Playwright runtime may be used for local validation without changing dependencies.
5. Run `git diff --cached --check`, commit to a `codex/` branch, push and open a PR against `master`. Inspect all GitHub checks. The existing screenshot job produces a downloadable review artifact.

Preview: `node serve.mjs`, then http://localhost:4322. This server is for development only; it does not run PHP or emulate Apache redirects/access rules. The script currently binds without a loopback restriction; use a trusted local environment. Stop the process when finished.

## Deployment and recovery

See [DEPLOY.md](DEPLOY.md). That document describes Hostinger Git deployment from `master` into `public_html`, with optional auto-deploy webhook, and an alternate `deploy/make-zip.sh` archive flow. Actual hPanel/webhook state was not inspected; a push/merge alone is not proof of live publication.

Before a release, retain a hosting backup and separately preserve private configuration and the private lead outbox. Confirm PHP and cURL are available. After deployment, purge Hostinger's CDN per the deployment procedure and inspect a fresh browser session: header/footer/FAB/mobile WhatsApp destinations, corporate/hipotecaria/franja/selling messages, privacy contact and thank-you purposes. Check denied access to private configuration and queue URLs without downloading customer data.

For rollback, restore the previous public release while preserving current private configuration and the private lead outbox. Reverting a bad commit on `master` restores code history; verify whether the hosting deployment actually follows that revert. Keep snapshots outside the public web root.

## Contacts, CRM and private data

`lead-forward.php` reads `VENDERCRM_URL` and `VENDERCRM_API_KEY` from environment variables first, otherwise `vendercrm-config.php` one level above `public_html`, with a document-root fallback. Only the non-secret `deploy/vendercrm-config.example.php` belongs in Git. Never put credential values in docs or client-side code.

Leads are stored in a private outbox, not in a log file. `lead-forward.php` first writes each enquiry to `.tasacion-lead-outbox/`, which by default sits next to `public_html` (outside the web root); the path can be overridden with the `TASACION_OUTBOX_DIR` environment variable and must stay outside the public root. Only after that does it send the enquiry to `/api/v1/leads` on VenderCRM, and it marks the entry delivered only on a verified CRM receipt. Entries without a receipt stay pending and are retried with backoff (one minute, doubling up to six hours). The thank-you redirect needs either durable retention or a verified receipt; otherwise the visitor sees the error with the WhatsApp fallback. The outbox contains customer records: keep it out of Git, public backups, reports and this manual. Full detail is in [LEAD_DELIVERY.md](LEAD_DELIVERY.md).

Form protections in `lead-forward.php`: a hidden honeypot field (bots see success and nothing is forwarded); a fill time under 3 s is silently ignored the same way; at most 5 submissions per 10 minutes per client (beyond that the visitor sees the WhatsApp fallback); phone required, 6–15 digits; an invalid optional email is dropped and the enquiry continues.

Operate the outbox with `php tools/lead-delivery.php <command>` (CLI only; over HTTP it answers 404), from the deployed site directory:

- `status` — counts of pending, delivered and unreadable entries (unreadable entries are retained).
- `check` — CRM configuration check (read-only; creates no contact).
- `retry [N]` — re-send up to N due pending entries (maximum 50), respecting backoff.
- `heartbeat` — send VenderCRM an aggregate health report (counts and oldest pending age, no personal data).
- `export-review <private-path> [N]` — write pending entries to a private review file outside the web root (contains customer data).
- `retry-reviewed <manifest>` — re-send only entries a human reviewed; the manifest is valid for 10 minutes. A deliberate one-time action, never a cron job.
- `legacy-preview` — only counts payload rows in an old `leads.log` if one still exists; nothing is imported or replayed from it.

The recurring `retry` and `heartbeat` cron jobs are set up manually in hPanel; see [DEPLOY.md §6](DEPLOY.md). The owner should watch the cron email and the oldest pending age. Recovery steps for rejected or historical enquiries are in [LEAD_DELIVERY.md](LEAD_DELIVERY.md).

Attribution comes from `https://crm.clientes.com.py/vc-attribution.js` and the `vc_attr` cookie. Its remote implementation, cookie configuration and availability were not reviewed. The generated analytics ID is blank. Do not assume `dataLayer` events are collected. Use synthetic contacts for any authorized handler validation; do not send test submissions into the live CRM during a source-only review.

## Owner actions and validation limits

- Merge the follow-up mobile/header fixes when ready, then redeploy `master` and recheck the contact page and specialist header menus.
- Update Google Business Profile, directory listings, social profiles and the CRM site's contact record to the new number if those still use the prior contact. These external records were not changed.
- Decide the next improvement batch from the audit.
- Confirm retention/deletion procedures and who monitors the lead outbox (`status`, cron output and heartbeat).
- Local `node verify.mjs` passes: deterministic build, all pages, 130 messages, 394 internal links/assets/anchors and legacy redirects. `git diff --cached --check` passes.
- The existing WhatsApp browser suite completed with `PASS` and exit code 0 (desktop, mobile, page defaults, popup URL, Escape and no-JavaScript fallback). The local harness used bundled Playwright/cached Chromium and stubbed external attribution. Browser cleanup was slow but completed successfully.
- The follow-up passes structural verification and local browser checks at 320–1280px. Header purposes/messages were checked at both 1280px and 390px; regression cases are in `tests/wa-menu.mjs`.
- PHP is unavailable on this PC. GitHub reported no check runs for the deployed merge at verification time. PHP behavior and production CRM delivery require separate verification; publication of PR #27's public pages is confirmed.

Local manuals reuse `C:/operation manuals/tasacion/README.md` across checkouts. New checkouts should use `C:/Projects`; this audit checkout was created in the then-active workspace before that preference was supplied and was retained in place.
