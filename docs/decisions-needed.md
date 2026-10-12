# Decisiones pendientes de Anton

Una línea por ítem del informe `docs/audit/2026-10-12-improvement-report.md`. El mecanismo ya está
construido con un valor vacío o de ejemplo; falta solo el dato o la acción.

- **5 · Cron en hPanel:** crear los dos cron jobs de `docs/DEPLOY.md` §6 (`retry 20` cada 10 min, `heartbeat` cada hora).
- **19/20 · CI:** el modo automático bloqueó cambiar `.github/workflows/` sin tu OK explícito (regla de presupuesto de Actions). El cambio listo está en `docs/proposals/ci-items-19-20.patch` (PHP 8.2 + `npm run test:leads` en `verify`; `npm ci`, caché de Chromium, filtro de rutas y `tests/wa-menu.mjs` en `screenshots`; `timeout-minutes` y `concurrency`). Aplicar con `git apply docs/proposals/ci-items-19-20.patch` si lo aprobás.
- **11 · ID de GA4/GTM:** pasarlo para cargarlo (`docs/DEPLOY.md` §3). Como `site.config.json` está git-ignorado, `verify.mjs` en otra máquina regeneraría sin ID; con el ID definitivo conviene commitearlo (quitar `site.config.json` de `.gitignore`).
- **18 · `crossorigin` en `vc-attribution.js`:** se movió el tag y se agregó `referrerpolicy`, pero `crossorigin="anonymous"` quedó afuera. Si `crm.clientes.com.py` no responde con `Access-Control-Allow-Origin`, el navegador bloquearía el script y se perdería la atribución, y desde acá no se pudo comprobar. Confirmar el encabezado y recién ahí agregarlo en `build-site.mjs`.
