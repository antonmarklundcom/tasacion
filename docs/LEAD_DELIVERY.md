# Tasación enquiry delivery and recovery

The form durably queues a request **before** sending it to CRM. New entries are outside `public_html`, defaulting to `../.tasacion-lead-outbox`. Each request has an atomic JSON entry and a lock, private directory/file modes (0700/0600 on Unix), stable CRM idempotency identity, pending/delivered state, attempt count, next retry time and generic result code. API keys are never stored in queue entries. Pending entries contain customer data; protect them, exclude them from public backups/reports/Git, and define retention separately.

The thank-you redirect requires durable retention or a valid CRM receipt. An HTTP 200 with blank/non-JSON/malformed content is not acceptance. A failed network request remains pending; retrying after acceptance followed by a crash uses the original identity, so CRM returns the existing submission instead of duplicating it. Changed enquiry content from the same phone is distinct; the old phone/hour hash could discard it. The browser supplies a stable hidden request ID for double-clicks; cached/no-JavaScript forms use full content plus an hourly fallback.

## Private configuration

Use existing server environment `VENDERCRM_URL`, `VENDERCRM_API_KEY`, or `vendercrm-config.php` one level above the public root. The ignored document-root config fallback remains compatible and is denied by Apache. The committed `deploy/vendercrm-config.example.php` contains no credentials. Keep HTTPS enabled; URLs containing userinfo/query/fragment, invalid keys, redirects, oversized responses and malformed receipts fail closed for delivery confirmation.

Optional `TASACION_OUTBOX_DIR` or private config `outbox_dir` must be an absolute writable path outside the public root. Relative/public locations are rejected, including resolved symlinks. Do not create a public queue or weaken Apache access rules. Confirm PHP 8+ and cURL are available. New queue, tools, libraries and old log are denied through `.htaccess`; this requires Apache-compatible hosting, not the development Node server.

## Operator checks and retries

Run these through the hosting's PHP CLI, from this project's deployed directory. Output contains aggregate state only:

```sh
php tools/lead-delivery.php status
php tools/lead-delivery.php check
php tools/lead-delivery.php retry 10
php tools/lead-delivery.php legacy-preview
```

`status` reports pending/delivered/unreadable counts and oldest pending timestamp. `check` calls the CRM's new read-only `/api/v1/sites/connection` endpoint without creating a contact or changing traffic health. It validates configuration/access/routing, not actual form delivery/storage. It requires the companion CRM dashboard release; an older CRM will reject this check while the existing lead POST remains compatible.

`retry` attempts at most 1–50 due entries, skips delivered entries and respects exponential backoff (one minute initially, up to six hours). Locks serialize overlapping delivery of the same entry. Rejections stay pending for review; nothing is discarded at a retry threshold. Entries that cannot be read are counted and retained. Use a small batch (for example five) with a five-minute hosting cron, selecting the actual installed PHP binary and private paths in hPanel. This repository does not provision that cron. A ten-request run can take up to roughly 100 seconds with network timeouts. Check exit status and backlog; a zero exit does not imply zero pending entries.

Monitor oldest pending age and configuration/HTTP errors. Before intentionally replaying a rejected request, repair the key, access or routing and verify CRM receipt. Never put keys in a command URL or cron output. Confirm incoming business ownership and default responsible person in CRM, then follow up through CRM; this form does not send WhatsApp/email to prospects.

## Historical recovery

For hPanel cron, choose the installed PHP CLI and the deployed site's absolute path, then schedule the following command every five minutes (replace both example paths with verified hosting paths):

```sh
/absolute/path/to/php /absolute/path/to/public_html/tools/lead-delivery.php heartbeat
```

The heartbeat command reads the existing private configuration. Keep credentials out of the command and preserve its aggregate output/exit status for operator monitoring. `retry-reviewed` is a deliberate one-time recovery action, never a recurring cron command:

```sh
/absolute/path/to/php /absolute/path/to/public_html/tools/lead-delivery.php export-review /absolute/private/review.json 10
# Privately review in CRM and save its approved manifest, then within ten minutes:
/absolute/path/to/php /absolute/path/to/public_html/tools/lead-delivery.php retry-reviewed /absolute/private/manifest.json
```

### Signed reports and private reviewed recovery

Run `php tools/lead-delivery.php heartbeat` every five minutes after deploying the companion CRM migration/endpoint. It posts only pending/unreadable counts, oldest queue age and an allowlisted error to `/api/v1/sites/heartbeat`; no enquiries are created. Existing `X-Api-Key` authentication is used with `X-Delivery-Timestamp` (Unix seconds) and `X-Delivery-Signature` (lowercase hex HMAC-SHA256 of timestamp, newline, exact UTF-8 body). CRM accepts ±300 seconds of skew and strictly increasing timestamps; a same-second repeat is rejected. The existing lead POST payload and headers remain unchanged. A failed heartbeat exits nonzero; stdout contains aggregates only. No report means unknown monitoring, not proof of a broken form.

Run `php tools/lead-delivery.php export-review /absolute/private/review.json 10` (1–50 pending entries) for an operator review. The output contains customer payloads and stable SHA256 identities, never credentials. It refuses overwrite, public-root output and symlink paths, and creates mode 0600. Keep the file outside Git, public backups and shared reports. Transfer it privately to CRM recovery review. Save the returned version-1 `tasacion.com.py` manifest outside the public root, then run `php tools/lead-delivery.php retry-reviewed /absolute/private/manifest.json` within ten minutes.

Only manifest entries marked `retry` can be sent. Each must still exist pending with the same SHA256 idempotency identity and SHA256 canonical payload fingerprint (UTF-8 JSON, byte-sorted object keys, preserved list order, unescaped Unicode/slashes/line separators). Changed/missing entries, stale manifests and duplicate IDs are rejected. Existing backoff and locking remain; the payload is rechecked inside the delivery lock. `received`, `conflict` and `invalid` entries are skipped and never automatically marked delivered. This workflow exports the durable outbox only and cannot replay historical `leads.log`. Run `php tests/lead-monitoring.php` alongside the existing durable-delivery suite before release. No hosting command or enquiry replay was performed during this source work.

Existing `leads.log` is preserved and no historical data is automatically imported. `legacy-preview` is read-only: it counts payload rows, unique identities, conflicting identities and unreadable rows without printing any payload. Older logs lack delivery receipts and may include enquiries already accepted by CRM. The old phone/hour key may also cover different enquiry content. Compare retained identities with CRM in a private operator recovery process before replaying; conflicts require deliberate review, not blind new keys or automatic re-import. Keep a private recoverable backup. No hosting log was downloaded or historical lead replay performed during source work.

## Build, validation and release

```sh
php -l lead-forward.php
php -l lib/lead-delivery.php
php tests/lead-delivery.php
node tests/lead-form.cjs
node build-site.mjs
node tools/check-contact.mjs
node tools/link-check.mjs
```

Set `PHP_BINARY` to a portable absolute binary for the Node local form harness if `php` is not on PATH. Tests use fictional data, temporary private directories and loopback PHP; no live CRM submission. The durable suite exercises restart, interrupted acceptance, backoff, duplicate enqueue, identity collisions, invalid receipts, UTF-8, private path checks and preservation of corrupt entries. The form harness exercises honeypot, phone validation, acknowledgement only after retention, identical retries, changed enquiries and unavailable queue/CRM. Generated HTML must be staged with source before `node verify.mjs` (it compares regeneration against the index).

Deploy only the reviewed release while retaining private config, existing log and outbox. Verify actual PHP/cURL, private path permissions, denied public access and cron execution. Then verify an authorized operator-owned form enquiry reaches CRM and is assigned correctly; no real enquiry/message was sent in these local checks. Source merge is not proof of hosting deployment. Roll back public code if needed while preserving pending entries and the compatible delivery library/tool for recovery. Do not delete the private queue or local log during rollback.

This is a static/PHP website; no Tasación application database or migration is added. CRM migrations are separate: check the exact approved journal and actual schema first, then apply only verified pending migrations. Main includes 0054_mailbox_failure_audit; the companion CRM reliability PR200 adds 0055_crm_reliability (56 total journal entries after approval/merge). The signed heartbeat and recovery-review endpoints require that compatible CRM release. Do not apply unmerged 0055 or repeat migrations already present. Read-only production aggregates on 9 October showed two Tasación enquiries, latest 1 October, no recorded CRM rejection, and no default owner. That does not prove a missing enquiry: failures before CRM remain invisible until private hosting logs are reviewed.
