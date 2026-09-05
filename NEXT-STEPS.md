# NEXT-STEPS — tasacion.com.py

Estado actual: rediseño "informe oficial primero" completo y en `master` (los 4 PRs de
`plan.md` §7 mergeados). Las 13 rutas de producción se mantienen sin cambios de URL, título ni
canonical — ver `docs/routes.json`.

Para el detalle de qué se construyó, qué decisiones se tomaron y qué queda pendiente, ver:

- `plan.md` — el plan completo (decisiones §1, contrato §2, guía de estilo §3, menú WhatsApp §4,
  copy por página §5, checklist de salida §8, inputs humanos §9, backlog §11).
- `docs/log/redesign.md` — log de build de los 4 PRs.
- `docs/DEPLOY.md` — cómo generar el zip y subirlo a Hostinger.

## Pendiente (nunca bloquea el sitio — ver plan.md §9)

- Fotografía nueva cuando Anton la genere (Higgsfield + `webimg`, fuera del sandbox).
- `VENDERCRM_URL` / `VENDERCRM_API_KEY` como variables de entorno en Hostinger.
- ID de analítica (GA4/GTM) en la línea `ANALYTICS_ID` de `build-site.mjs`.
- Foto de Fernando Capurro, si la autoriza (para `/nosotros/` y el sello del hero).
- Backlog de negocio/técnico: ver `plan.md` §11 (grilla de precios más fina, minify CSS en el
  zip, self-host de fuentes, página `/precios/`, JSON-LD `Organization` con `legalName` cuando
  haya RUC).
