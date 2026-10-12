# Decisiones pendientes de Anton

Una línea por ítem del informe `docs/audit/2026-10-12-improvement-report.md`. El mecanismo ya está
construido con un valor vacío o de ejemplo; falta solo el dato o la acción.

- **5 · Cron en hPanel:** crear los dos cron jobs de `docs/DEPLOY.md` §6 (`retry 20` cada 10 min, `heartbeat` cada hora).
- **19/20 · CI:** el modo automático bloqueó cambiar `.github/workflows/` sin tu OK explícito (regla de presupuesto de Actions). El cambio listo está en `docs/proposals/ci-items-19-20.patch` (PHP 8.2 + `npm run test:leads` en `verify`; `npm ci`, caché de Chromium, filtro de rutas y `tests/wa-menu.mjs` en `screenshots`; `timeout-minutes` y `concurrency`). Aplicar con `git apply docs/proposals/ci-items-19-20.patch` si lo aprobás.
