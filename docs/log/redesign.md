# Log de build — rediseño informe-oficial-primero

## PR-1 — fundación

**T1 — comparación con `php-site-template`** (clonado depth 1, público, confirmado accesible desde el
sandbox esta sesión):

- Portado: lógica de apertura/cierre/foco/trap de Tab de `assets/js/whatsapp-menu.js` — adaptada a
  selectores `[data-wa-trigger]`/`[data-wa-menu]` + `data-wa-open` (múltiples triggers con opción
  preseleccionada, que la plantilla no necesita porque tiene un único trigger). Estructura
  ARIA de `partials/whatsapp-menu.php` (`role="dialog"`, `aria-labelledby`, botón cerrar) portada
  como string template en `build-site.mjs`.
- No portado: `verify.sh` (bash+PHP; el sitio es estático, así que `verify.mjs` en Node cumple el
  mismo rol: rutas, títulos únicos, integridad, sin PHP que lintear salvo `lead-forward.php` que ya
  existía). `.github/workflows/verify.yml` y `tests/screenshots.mjs` reescritos para Node/estático
  en vez de PHP+router. `deploy/make-zip.sh` reescrito con la lista `SHIP` de este sitio (13 rutas +
  extras + `lead-forward.php`, sin `content/`, `lib/`, `router.php`, `templates/` que no existen
  acá). `enviar.php`, `content/lead-values.php`, `router.php`, `templates/` — no aplican, ver
  plan.md §10.

Built:
- Contrato ampliado en `content.mjs` (TASADOR, PRECIO*, WA_MENU, campos de página, tipos de sección
  nuevos) — copy sin tocar, eso es PR-2/PR-3.
- `docs/routes.json` con las 13 rutas congeladas (title/canonical actuales, `copyDone: false`).
- CSS reescrito completo (`assets/css/site.css`) según plan.md §3.
- `build-site.mjs` reescrito: header sticky, hero con chip/sello/fila de confianza, `priceBlock`,
  `freeAside`, `ctaBand`, FAQ acordeón + JSON-LD, footer, menú WA + FAB, `404.html`/`gracias.html`
  como extras.
- `assets/js/site.js`: header `.is-stuck`, hamburguesa, menú WA (multi-trigger, foco, trap, Escape).
- Formulario de contacto con radios `mensaje` (3 valores).
- `.htaccess`: bloqueo de `plan.md`, `prompts/`, `tests/`, `deploy/`, `.github/`, `content.mjs`,
  `build-site.mjs`, `verify.mjs`.
- Gate `verify.mjs` + `tests/wa-menu.mjs` (Playwright) + CI `.github/workflows/verify.yml`.

Decisions:
- No se migró a `php-site-template`: el sitio sigue estático (plan.md §6, decisión ya tomada).
- Menú WA con selección de opción vía `data-wa-open` en cada trigger (home-grown, la plantilla no
  lo necesitaba por tener un solo trigger apuntando siempre a la página actual).
- `PRECIO_TXT`/`priceBlock` no se agregan todavía a las páginas de contenido — eso es T6a/T6b
  (PR-2/PR-3); PR-1 solo deja el contrato y el renderizador listos.

Known issues:
- Ninguno bloqueante para PR-1. Copy sigue siendo el del MVP (con `ctaBand` en vez de `ctaFinal`);
  la jerarquía de oferta se corrige en PR-2/PR-3.

Verification: verify green on <pendiente, se completa en el commit final del PR>.
