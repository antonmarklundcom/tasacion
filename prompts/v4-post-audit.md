# v4 — tasacion.com.py: fixes del audit vivo del 2026-09-11

Spec escrita 2026-09-11 (sesión Fable) a partir de `docs/LIVE-SITE-AUDIT-2026-09-11.md`. La ejecuta
**una sesión Sonnet** en dos PRs consecutivos contra `master`, con el protocolo de autonomía de
`plan.md` §6 al pie de la letra (Sonnet solamente, nunca Fable/Mythos ni como subagente; PRs
abiertos y mergeados por la misma sesión cuando CI está verde; nunca deployar; dudas de base →
`docs/decisions-needed.md` y terminar).

**Cómo arrancar (Anton):** ventana nueva, modelo **Sonnet**, permisos en auto-aceptar:
`Read prompts/v4-post-audit.md in this repo and execute it.`

Leer antes de tocar nada: `docs/LIVE-SITE-AUDIT-2026-09-11.md` (§0 y §2), `plan.md` §1–§4 y §6,
`prompts/v3-credenciales-y-finalidades.md` §1 (cadenas canónicas: se copian textual, nunca se
parafrasean). Las cadenas canónicas, los precios (`PRECIOS`), las rutas, títulos y canonicals
**no cambian**.

## 0. Estado del working copy

El repo local puede tener `.html` modificados sin commitear (son generados) y cuatro archivos
untracked en `docs/` y `prompts/`. Primero: `git stash -u` NO — hacer `git checkout -- '*.html'`
para descartar los HTML generados, y **commitear en el PR-1** los untracked:
`docs/LIVE-SITE-AUDIT-2026-09-11.md`, `docs/LIVE-SITE-REVIEW-2026-09-06.md`,
`docs/FER-BRIEF-2026-09-10.md`, `prompts/fable-live-site-review-prompt.md`, `prompts/v4-post-audit.md`,
`assets/img/manifest.json` (si `build-images.mjs` lo genera, commitearlo; si no, dejarlo).
`docs/screenshots/` está en `.gitignore`: no se commitea.

## PR-1 — `v4/1-cache-jsonld-wa` — hardening + datos estructurados + menú

### 1.1 Cache-busting de assets (audit §0, causa raíz del sitio roto en producción)
- En `build-site.mjs`, calcular al inicio del build `const ASSET_V = { css: sha1(assets/css/site.css).slice(0,8), js: sha1(assets/js/site.js).slice(0,8) }` (usar `node:crypto`).
- Emitir `<link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_V.css}">` (línea ~634) y
  `<script src="/assets/js/site.js?v=${ASSET_V.js}">` (línea ~645). Solo esos dos; las imágenes no.
- `verify.mjs`: nueva comprobación — cada `.html` generado referencia `site.css?v=` y `site.js?v=`
  con el hash **actual** de los archivos en disco (recalcular en verify; si no coincide → FAIL con
  mensaje "rebuild required").
- `.htaccess`: agregar, después del bloque de redirects,
  ```
  <IfModule mod_headers.c>
    <FilesMatch "\.(css|js)$">
      Header set Cache-Control "public, max-age=300, must-revalidate"
    </FilesMatch>
  </IfModule>
  ```
  (max-age corto: la query `?v=` ya garantiza frescura; esto solo acorta el daño si algún día
  falta el `?v=`). No tocar nada más del `.htaccess`.
- `docs/DEPLOY.md`: agregar un paso 4 "Después de subir el zip: hPanel → Websites → Performance →
  CDN → Purge cache; verificar en incógnito que el menú WhatsApp apila título y subtítulo."

### 1.2 JSON-LD: Offers por finalidad (audit §2.1 y §2.2)
En `build-site.mjs`, `serviceJsonLd(page)` (línea ~575):
- Reemplazar el único Offer de `PRECIOS.compraventa` por una función `offersFor(page)`:
  - `page.slug === '/tasaciones/hipotecaria/'` → un Offer `credito`: `minPrice: PRECIOS.credito.min`,
    **sin** `maxPrice`.
  - resto de `kind === 'vertical'` → Offer `compraventa` (como hoy). Si el `priceBlock` de la página
    tiene fila judicial (`rows` con 'Sucesiones y juicios'), agregar además el Offer `judicial`
    (`PRECIOS.judicial.min/max`). Corporativa y campos hoy la tienen: verificar en `content.mjs`.
  - Cada Offer lleva `name` = etiqueta de `FINALIDADES` (`'Compra o venta'`, `'Crédito bancario'`,
    `'Sucesiones y juicios'`) y `priceCurrency: 'PYG'`.
- `/informes-periciales/` (`kind: 'primary-report'`) hoy no emite `Service`: emitir un `Service`
  con `serviceType: 'Informe pericial de tasación'`, mismo `provider`/`areaServed`, y los **tres**
  Offers (compraventa, judicial, credito sin max). Este es el leftover "judicial Offer" de v3.
- `verify.mjs`: para cada página con `Service`, parsear el JSON-LD y comprobar que cada Offer
  coincide con `PRECIOS[id]` y que hipotecaria NO tiene Offer con `maxPrice` 1.500.000.
  Comprobar también que ningún JSON-LD contiene cifras fuera de `PRECIOS` (`EJEMPLO` no va al JSON-LD).

### 1.3 Opciones del menú WhatsApp en pestaña nueva (audit §2.3)
- `build-site.mjs:132`: `.wa-menu__option` gana `target="_blank" rel="noopener"`, igual que el
  hero, la pill y el FAB.
- `assets/js/site.js`: verificar que el handler de click de las opciones no hace
  `preventDefault` + `location.href` (si lo hace, pasar a `window.open` con `noopener` o dejar
  que el `<a>` navegue solo). Cerrar el panel después del click.
- `tests/wa-menu.mjs`: aserción de que las 5 opciones tienen `target="_blank"` y que un click
  abre `popup` (usar `page.waitForEvent('popup')`) cuya URL decodificada termina en `______`
  para las opciones 1–4.

### 1.4 Cadena canónica F4 en hipotecaria (audit §2.4)
- `content.mjs:521`: `note: 'incluye la firma del tasador inscripto en el BCP; …'` →
  `` note: `incluye la firma: ${CRED_BCP_FIRMA}; te confirmamos el monto exacto por WhatsApp antes de la visita` ``
  (queda "incluye la firma: el informe lo firma un tasador inscripto en el registro del BCP; …").
  Si suena mal en el panel, alternativa aceptada: `` `${CRED_BCP_FIRMA}; te confirmamos…` `` con
  mayúscula inicial via `cap()` si ya existe un helper; si no, dejar minúscula.
- `verify.mjs`: agregar a las cadenas prohibidas la regex `/inscript[oa] en el BCP/` (sin
  "registro del") y `/tasador(?: inscripto)? (?:del|ante el) BCP/`.

### Listo cuando (PR-1)
`node build-site.mjs && node verify.mjs && node tests/wa-menu.mjs` verdes; CI verde; log en
`docs/log/v4.md` (≤ 12 "Built", ≤ 8 "Decisions", ≤ 8 "Known issues", "Verification: verify green
on <commit>"). Mergear (squash) y seguir.

## PR-2 — `v4/2-hipotecaria-hero-franja-foto` — CRO móvil + foto

### 2.1 Hero de hipotecaria en móvil (audit §2.5)
El párrafo intro tiene 10 líneas a 375 px y el botón primario cae en el fold. En `content.mjs`,
página hipotecaria, `hero.intro` (o el campo equivalente): recortar a **máximo 2 oraciones / ~200
caracteres**, sin credenciales ni bancos (esas cadenas ya están en el bloque "Quién firma" y en el
`priceBlock`). Propuesta (usar tal cual salvo que rompa el gate):
`Tu banco o cooperativa te pide una tasación para aprobar la carpeta. Nosotros hacemos la visita y el relevamiento, y el informe sale con la firma que tu entidad exige.`
- Comprobar que `CRED_CSJ`, `CRED_BCP_FIRMA` y `CRED_BCP_BANCOS` **siguen apareciendo** en la
  página (bloque credentials); `verify.mjs` ya lo exige — si no, agregar la aserción.
- `tests/wa-menu.mjs`: nueva aserción a 375×812 en `/tasaciones/hipotecaria/`: el botón
  `[data-ev-loc="hero"]` tiene `boundingBox().y + height <= 812 - 72` (queda entero sobre el fold y
  no cruza la franja del FAB) y no interseca `.wa-fab`. Repetir la aserción de intersección
  FAB/hero para las 15 rutas (loop sobre `docs/routes.json`), contra **todos** los `a` del hero,
  no solo `.hero__freelink a`.

### 2.2 Foto propia para franja de dominio (audit §2.6)
- Si el MCP de Higgsfield está disponible en la sesión: seguir el skill `webimg-pipeline` /
  `higgsfield-image-pipeline` para generar **una** imagen (ruta en construcción en Paraguay, franja
  despejada con lotes y una edificación al borde, luz de tarde, sin personas ni carteles ni texto),
  convertirla con `build-images.mjs` a `assets/img/franja-de-dominio-relevamiento-vial-{640,960,1280}.avif|webp`,
  alt: `Franja de dominio de un proyecto vial en Paraguay, con lotes y edificaciones a relevar`.
  Referenciarla en la entrada franja de `content.mjs`.
- Si NO está disponible: no inventar; dejar la foto de terrenos, escribir en `docs/log/v4.md`
  Known issues "franja: foto pendiente (sin Higgsfield en la sesión)" y seguir.

### Listo cuando (PR-2)
Mismos gates que PR-1; además una pasada de screenshots ≤ 5 páginas × 2 anchos (hipotecaria,
informes, franja, casas, home) como artifact de CI. Mergear.

## Al terminar
- `./deploy/make-zip.sh` (o el método .NET ZipArchive del skill `hostinger-html-php-deploy` en
  Windows) → `dist/tasacion-2026-09-<dd>.zip`. Escribir la ruta del zip en `docs/log/v4.md`.
- No deployar. Anton sube el zip y **purga el CDN** (DEPLOY.md paso 4).

## Fuera de esta sesión (Anton, no código) — en orden
1. **Hoy, antes de cualquier build:** hPanel → tasacion.com.py → Performance → CDN → Purge cache.
   Verificar en incógnito. Esto arregla el 80 % del audit sin tocar código.
2. Search Console: DNS TXT → verificar → Inspección de URL → Solicitar indexación de `/`,
   `/valuacion-para-vender/`, `/informes-periciales/`, `/tasaciones/hipotecaria/` (el snippet de
   Google todavía dice "valuación gratuita").
3. GA4: crear propiedad → pegar el ID en `build-site.mjs:615` (`ANALYTICS_ID`) — o pedirlo a la
   sesión Sonnet como un commit de una línea — y rebuild.
4. Google Ads: URLs finales por finalidad (crédito → hipotecaria; sucesión → informes-periciales;
   compra/venta → home).
5. Google Business Profile (skill `gbp-optimizer`) + las 8 preguntas pendientes a Fer del brief
   (foto, informe de muestra, reseñas).
