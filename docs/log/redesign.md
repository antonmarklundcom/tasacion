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

Verification: `node verify.mjs` → PASS, `node tests/wa-menu.mjs` → PASS on local commit before opening the PR-1 diff (CI confirms on push).

## PR-2 — copy hub

Built:
- Home: hero + grid2 informe/vender (`.card--accent` / `.card--muted`) reemplaza las dos secciones
  viejas de venta; `freeAside` fusiona "Vendemos tu propiedad" + "Para Vendedores"; `faqPreview`
  con la pregunta de costo primero. Sin `priceBlock` en home (vive en el hub y las verticales).
- `/informes-periciales/`: `priceBlock` completo (6 inclusiones, filas ancladas al rango), casos de
  uso en `.card--accent`, FAQ de costo con la cifra, `links` a las 7 verticales.
- `/valuacion-para-vender/`: tabla `compare` con la fila de costo actualizada al rango.
- `/contacto/`, `/nosotros/`, `/preguntas-frecuentes/`: H1/hero alineados; `/nosotros/` suma el
  bloque "Quién firma tus informes"; FAQ reordena Informe Oficial primero.
- `Te cotizamos por WhatsApp` reemplazado en las 6 páginas que lo tenían.

Decisions:
- `docs/routes.json` sigue en `copyDone: false` — los checks de copy se activan recién en PR-3
  cuando las 7 verticales también tienen `priceBlock`.

Known issues:
- Ninguno bloqueante. Bug encontrado y arreglado en el mismo PR: el `<br>` del panel de precio
  pasaba por `esc()` y se veía como texto literal; el ícono de flecha de `.link` no tenía tamaño
  explícito y el SVG se renderizaba a tamaño intrínseco (gigante) en los cards — ambos fijados
  antes de mergear, verificados con captura de pantalla.

Verification: `node verify.mjs` → PASS, `node tests/wa-menu.mjs` → PASS, CI verde (`verify` check).

## PR-3 — copy verticales

Built:
- Las 7 verticales (casas, departamentos, terrenos, corporativa, hipotecaria, locales comerciales,
  campos) reciben `priceBlock` (filas ancladas solo a "desde Gs. 800.000" / "hasta Gs. 1.500.000",
  nunca una cifra inventada), `freeAside` (excepto hipotecaria, que no aplica venta — en su lugar
  queda el `links` a informes periciales que ya tenía), y una pregunta de costo nueva en la FAQ.
- `docs/routes.json` → `copyDone: true`, activa los checks de copy de `verify.mjs`.

Decisions:
- Helpers compartidos en `content.mjs` (`priceBlockVertical`, `freeAsideVender`,
  `INCLUYE_INFORME`) para no repetir la misma estructura 7 veces.
- Fan-out por subagentes (plan.md §6.9) no se usó: las 7 páginas comparten un solo archivo
  (`content.mjs`) y son ediciones cortas y mecánicas una vez que el patrón de la primera está
  claro — hacerlas en la sesión principal fue más rápido y sin riesgo de conflictos de escritura
  concurrente sobre el mismo archivo.

Known issues:
- Ninguno bloqueante. Bug encontrado al activar `copyDone: true`: el check de `freeAside` en
  `verify.mjs` comparaba en minúsculas contra un texto que empieza con "No es..." — arreglado
  (`.toLowerCase()`) en el mismo PR.

Verification: `node verify.mjs` → PASS con checks de copy activos, `node tests/wa-menu.mjs` →
PASS, CI verde.

## PR-4 — cierre

Built:
- `deploy/make-zip.sh`: regenera el HTML y arma `dist/tasacion-<fecha>.zip` plano con exactamente
  lo que necesita producción (13 páginas + extras, `assets/`, `lead-forward.php`, `.htaccess`,
  `robots.txt`, `sitemap.xml`); rechaza el build si aparece algo de la lista prohibida.
- `docs/DEPLOY.md`: cómo generar el zip, subirlo a Hostinger, variables de entorno opcionales,
  checklist de verificación post-deploy.
- `NEXT-STEPS.md` reescrito: apunta a `plan.md` y a este log en vez de la roadmap CORE-15 vieja
  (obsoleta desde el relanzamiento MVP en `16ba103`).

Decisions:
- El zip no se commitea (`dist/` en `.gitignore`); se genera a pedido.

Known issues:
- Ninguno. El zip generado localmente contiene las 13 páginas + extras, `assets/`,
  `lead-forward.php`, `.htaccess`, `robots.txt`, `sitemap.xml` — nada más — y ninguna de las
  rutas/archivos internos (`content.mjs`, `docs/`, `tests/`, etc.).

Verification: `node verify.mjs` → PASS, `node tests/wa-menu.mjs` → PASS, `./deploy/make-zip.sh`
produce un zip limpio, CI verde.

## Cierre — checklist §8

Los 4 PRs (§7) están mergeados a `master`, cada uno con CI verde. Ver `plan.md` §8 para el
checklist completo; los puntos verificables por `verify.mjs`/`tests/wa-menu.mjs` pasan en el
commit final de cada PR. Pendiente solo lo que plan.md §9 marca como input humano (fotografía
nueva, VenderCRM, analítica, foto del tasador) — ninguno bloquea el sitio.
