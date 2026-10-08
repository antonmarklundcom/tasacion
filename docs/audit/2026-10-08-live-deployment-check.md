# Live deployment check — 8 October 2026

Site: https://tasacion.com.py. [PR #27](https://github.com/antonmarklundcom/tasacion/pull/27) merged to `master` at 05:07:27 Paraguay time. Deployed source revision: `ee22d4584d4a738f53890e6f144aaeb8a1157938`.

## Confirmed on the live site

- All 18 public pages were inspected in a real browser, on desktop and at 390px mobile width.
- All 274 WhatsApp anchors use `595995628862`. Displayed contact and telephone links use **+595 995 628862** / `tel:+595995628862`.
- Across ordinary links, eight thank-you purposes and the contact error fallback, all 130 unique preset messages were observed live. Every message identifies Tasación.com.py and retains fill-in details. No prior contact was found in page text or WhatsApp anchors.
- JSON-LD on all 18 pages parses successfully and uses `+595995628862` for telephone fields.
- Asset URLs are consistent: fonts `68dca5d4`, CSS `d84f8bd2`, JavaScript `749d3422`. Loaded images reported no broken sources during the inspection. This is not an exhaustive transfer/status check of every lazy image or unused asset.
- Corporate, mortgage, road-project and selling FAB menus focus the correct purpose; Escape closes each. The 375px mortgage menu fits within the viewport.
- All eight `gracias.html?p=...` combinations show the correct purpose label and corresponding message.
- `/contacto/?error=envio` shows the WhatsApp recovery link with the correct number/message. No live form submission or WhatsApp message was sent. CRM delivery and phone/account ownership were not tested.
- GitHub reported no check runs for the merge revision at verification time; CI is not claimed as passed.

## Existing issues found and fixed in a follow-up branch

1. **Mobile contact overflow.** At 375px, the live contact page measures 400px wide because the form's intrinsic control widths expand the grid. At 320px, header gaps also cause overflow. The follow-up constrains grid tracks and form controls and reduces mobile header gaps. It does not hide overflow or clip fields.
2. **Header purpose mismatch.** On mortgage/corporate/road-project/selling pages, the live header WhatsApp button opens the first menu row (`compraventa`) even though its fallback link and FAB use the specialist purpose. Both header variants now carry the same purpose as the page's primary CTA.

Follow-up branch: `codex/live-check-fixes-20261008`, based on the deployed merge. These fixes are **locally verified, pending merge/redeployment**. This report does not claim they are already live.

## Follow-up validation

- `node verify.mjs`: PASS (deterministic build, 18 pages, 130 messages, 394 internal links/assets/anchors, legacy redirects).
- `git diff --cached --check`: PASS. `node --check tests/wa-menu.mjs`: PASS.
- Local browser contact checks: all controls inside the viewport with no horizontal overflow at 320, 375, 390, 768 and 1280px.
- Local browser header checks: homepage, mortgage, corporate, road-project and selling pages select the expected purpose and message on desktop (1280px) and mobile (390px), with focus on the selected row and Escape dismissal.
- Regression cases added to `tests/wa-menu.mjs` for header purpose/message at both widths and contact/control bounds at all five widths. Equivalent checks were run through the connected browser; the expanded standalone Playwright suite was not separately executed during this follow-up.
- PHP and production CRM behavior remain outside this verification. Existing form fields and submission handling were preserved.
