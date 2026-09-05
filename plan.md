# plan.md — tasacion.com.py: rediseño completo (informe oficial primero)

Plan escrito 2026-09-05 en una sesión de planificación. Lo ejecuta **una sesión Sonnet**
(nunca Fable/Mythos; ver §6.8) en **cuatro PRs consecutivos** contra `master` (§7), cada uno
abierto, vigilado y **mergeado por la misma sesión Sonnet** cuando CI está verde, sin esperar a
Anton. No hay lanes ni watcher: la sesión encadena PR-1 → PR-2 → PR-3 → PR-4 hasta que todo el
checklist de salida (§8) pasa, y termina. Si la sesión muere, una nueva lee este plan y sigue
desde el primer PR no mergeado (§6.6).

**Cómo arrancar (Anton):** mergear primero el PR de este plan. Después, en una ventana nueva con
modelo **Sonnet** y permisos en auto-aceptar, pegar una sola línea:
`Read prompts/redesign.md in this repo and execute it.`

Rama base: este plan vive en `plan/full-redesign`, creada desde `master` en `255ca46`, que ya
contiene el MVP (`16ba103`) y las fotos de hero (`1886b35`) — el merge de
`claude/hostinger-build-status-hjc63l` (PR #6) ya ocurrió. La sesión de build ramifica desde
`master` una vez mergeado el PR de este plan.

Canvas de diseño (Claude Design): https://claude.ai/code/artifact/36843276-9351-48ea-a532-4b4dcc55dbb3
— siete artboards: Hero inicio (1440), Hero móvil (390), Página de vertical (Terrenos), Header
sticky (3 estados), Menú flotante WhatsApp, Tarjeta (3 variantes), FAQ acordeón. La guía de
estilo de §3 es la versión escrita y completa: una sesión que nunca abra el canvas puede
implementar todo desde §3 + §4.

---

## 1. Decisiones ya tomadas — no se reabren

1. **Cambio de modelo de negocio (la razón del rediseño).** El sitio anterior generaba demasiados
   leads gratis y pocos pagos. Jerarquía nueva, en TODAS las 13 páginas:
   - **PRIMARIO:** el informe oficial de tasación pago ("Informe de Tasación" / "Informe
     Pericial"), realizado por el **Tasador Fernando Capurro**. Precio confirmado:
     **Gs. 800.000 a Gs. 1.500.000**, según tipo y tamaño del inmueble. **El precio se muestra
     con moderación, no en primer plano:** una sola vez por página de servicio (el panel de
     precio §3.9, a mitad de página), en el hub `/informes-periciales/` (chip del hero + panel)
     y en las respuestas de FAQ sobre costo. NO va en el hero de la home ni de las verticales,
     NO va en la franja CTA final, NO va en el footer, NO va en el menú de WhatsApp. Lo que sí
     va en primer plano en todas partes es que el informe es **pago, oficial y firmado por el
     Tasador Fernando Capurro**. Donde el precio aparece, reemplaza el viejo "el monto depende
     del tipo de inmueble… te cotizamos" por el rango anclado, con la nota honesta de que la
     cifra exacta depende del inmueble y se confirma por WhatsApp antes de agendar.
   - **SECUNDARIO:** la valoración gratis para vender ("valoración para vender" / tasación online
     sin costo). Sigue existiendo, sigue siendo honesta, pero siempre más chica en jerarquía
     visual y más abajo en el orden de página. Lee como "también disponible", nunca como titular.
     Botón fantasma o enlace, nunca el botón primario navy.
2. **Hechos confirmados — los únicos dos:** el nombre "Tasador Fernando Capurro" (commit
   `faaabf9`, ya en producción) y el rango de precio de arriba. Nada más.
3. **Nunca inventar** (sin cambio respecto del MVP): RUC, factura legal, número de matrícula o
   registro profesional, dirección, teléfono dedicado, reseñas/testimonios, años en el rubro,
   promesas de tiempo de respuesta, habilitación bancaria/BCP, credenciales adicionales del
   tasador. Donde el copy actual ya afirma algo (p. ej. "peritos matriculados", "cumplen los
   requisitos bancarios") se conserva tal cual — viene del sitio anterior — pero **no se agrega
   ninguna afirmación nueva**. Al reescribir, preferir "firmado por el Tasador Fernando Capurro"
   antes que "perito matriculado".
4. **Las 13 rutas, sus `<title>` y sus `<link rel="canonical">` no cambian.** Google Ads apunta
   a estas URLs exactas. Lista congelada en §8.1. `sitemap.xml` sigue con exactamente estas 13.
5. **Infra que se REUSA, no se reemplaza:** `lead-forward.php` (campos POST `nombre`,
   `telefono`, `email`, `mensaje`, `page_url`, honeypot `website` — solo cambios aditivos),
   la convención de un único `WA_NUMBER` (una línea en el `<head>`, el JS reescribe todos los
   `wa.me`/`tel:`), `.htaccess` (bloqueos + 301 de CORE-15; solo se agregan líneas),
   `robots.txt`, `sitemap.xml`, el generador `build-site.mjs` + `content.mjs`
   (los `.html` nunca se editan a mano).
6. **Stack:** HTML estático generado por Node (`node build-site.mjs`) + un PHP para el
   formulario, en Hostinger shared hosting, sin base de datos. No se migra a
   `php-site-template` (ver §10): el sitio ya está en producción y funcionando; se toman piezas.
7. **Restricción 1 — imágenes:** el CDN de Higgsfield es inalcanzable desde el sandbox (egreso
   bloqueado; ya pasó en conthtml). Ninguna tarea de build genera ni descarga fotos nuevas.
   Se reusa/recombina lo que ya está en `assets/img/` (8 sets × 640/1280/1920 × avif+webp +
   `og-tasacion-com-py.jpg`). Fotografía nueva = paso manual de Anton (§9.1).
8. **Restricción 2 — deploy manual:** no hay CI/CD al servidor. Anton sube un zip a Hostinger
   por el file manager. Ninguna tarea "deploya". La fase termina cuando el PR está mergeado en
   `master`. El script `deploy/make-zip.sh` (§7, T11) solo produce el zip a pedido.
9. **Modelo:** la sesión de build corre en **Sonnet**. Subagentes para fan-out (13 páginas de
   copy) también Sonnet (o Haiku para lo mecánico). Fable/Mythos jamás (§6.8).
10. **Tipografía y paleta:** se conservan Libre Baskerville 700 (display) + Inter 400/500/600
    (texto), ya cargadas desde Google Fonts en las 13 páginas, y la paleta navy/oro/marfil que
    el sitio ya usa. El rediseño cambia jerarquía, composición y componentes, no la identidad.
11. **Idioma:** español rioplatense-paraguayo (voseo), como el copy actual. Identificadores en
    código en inglés.

---

## 2. Modelo de contenido — el contrato

`content.mjs` exporta `WA_NUMBER`, `SITE`, `NAV`, `SERVICIOS`, `PAGES`. Cada entrada de `PAGES`
tiene hoy: `slug`, `title`, `description`, `h1`, `subcopy`, `heroCta?`, `trustBar?`,
`heroImage? {base, alt}`, `sections[]` con `type` ∈ {services, grid3, grid2, lead, leadList,
steps, zonas, compare, faq, faqGroups, faqPreview, links, channels, contactForm, ctaFinal}.

**Cambios aditivos al contrato (T2):**

```js
export const TASADOR = 'Fernando Capurro';                 // único nombre; nunca otro dato
export const PRECIO = { min: 800000, max: 1500000 };       // Gs.; se formatea "Gs. 800.000"
export const PRECIO_TXT = 'Gs. 800.000 a Gs. 1.500.000';   // string canónico, usado en todos lados
export const PRECIO_NOTA = 'según tipo y tamaño del inmueble; te confirmamos el monto exacto por WhatsApp antes de agendar la visita';

// por página (obligatorio en las 13 + 404 + gracias):
page.waContext   // string: "Tasación de Terrenos" → "Hola, vengo de la página de Tasación de Terrenos y …"
page.kind        // 'home' | 'vertical' | 'secondary-free' | 'primary-report' | 'info' | 'contact'
page.eyebrow     // string corto sobre el H1 (ej. "Tasación de terrenos · Paraguay")
page.hero.primary   // { label } — siempre abre el menú WA con la opción 1 preseleccionada
page.hero.secondary // { label, href } — botón fantasma (ancla o ruta)
page.hero.freeLink  // { label, href } | null — la línea chica "¿Solo querés vender? …"
page.showPriceChip  // bool — true SOLO en /informes-periciales/ (§1.1); el resto lleva el chip 'pago · firmado' sin cifra

// nuevos tipos de sección (renderizados por build-site.mjs):
{ type: 'priceBlock', heading, includes: [..], rows: [[label, value],..], cta }   // panel navy §3.9
{ type: 'freeAside', heading, body, cta }                                          // §3.10
{ type: 'ctaBand', eyebrow, heading, body, primary, secondaryLink }               // reemplaza ctaFinal
{ type: 'faq', heading?, items }                                                  // ahora con heading
```

`build-site.mjs` sigue siendo el único renderizador. Los strings del menú WhatsApp (§4) viven en
`content.mjs` (`WA_MENU`), no en el JS, para que el JS sea genérico.

---

## 3. Guía de estilo (distilada del canvas)

### 3.1 Tokens de color (hex exactos)

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#12181F` | texto principal, footer y franja CTA final (fondo) |
| `--ink-muted` | `#5C6773` | párrafos, subtítulos, notas |
| `--base` | `#FAF9F7` | fondo de página (marfil cálido) |
| `--surface` | `#FFFFFF` | tarjetas, paneles, bandas "qué incluye" |
| `--navy` | `#0F3D5C` | acento primario: botón primario, eyebrows, enlaces, panel de precio |
| `--navy-deep` | `#0A2C44` | hover del primario y de enlaces |
| `--navy-tint` | `#E6EDF2` | fondo de la opción resaltada del menú WA, chips de zonas, thead |
| `--gold` | `#A98B57` | detalle de marca: `.com.py`, regla del eyebrow, punto del chip de oferta, sello |
| `--gold-tint` | `#F3EDE1` | fondo del chip de oferta |
| `--gold-line` | `#E6D9BF` | borde del chip de oferta |
| `--hairline` | `#E2DFD9` | bordes de tarjeta, divisores FAQ, borde inferior del header stuck |
| `--hairline-strong` | `#C9CFD6` | borde de tarjeta en hover |
| `--on-dark` | `#FAF9F7` | texto sobre navy/ink |
| `--on-dark-muted` | `rgba(250,249,247,.78)` | texto secundario sobre navy/ink |
| `--hairline-dark` | `rgba(250,249,247,.16)` | divisores sobre navy/ink |
| `--wa` | `#25D366` | WhatsApp: FAB, pill del header, botón de la franja final |
| `--wa-deep` | `#1EBE5B` | hover WhatsApp |
| `--wa-ink` | `#04220F` | texto/ícono sobre verde WhatsApp |
| `--backdrop` | `rgba(18,24,31,.45)` | fondo detrás del panel WA en móvil |

Contraste: navy sobre base = 9.1:1; ink-muted sobre base = 5.6:1; wa-ink sobre wa = 8.9:1;
on-dark-muted sobre navy ≈ 7:1. Nunca texto gris sobre navy-tint más claro que `--ink-muted`.

### 3.2 Tipografía

- `--font-display: 'Libre Baskerville', Georgia, 'Times New Roman', serif` — solo 700. H1, H2,
  H3, marca, cifra del panel de precio (`.display`).
- `--font-text: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif` — 400, 500, 600.
  Google Fonts link ya presente: `Inter:wght@400;500;600` + `Libre+Baskerville:wght@700`
  (agregar el peso 600 de Inter al link actual, que solo trae 400/500/700; quitar 700).
- Body: 17px / 1.6, `-webkit-font-smoothing: antialiased`.
- Escala (ratio 1.30, base 17px), como tokens:
  `--t--1: .8125rem` (13) · `--t-0: 1.0625rem` (17) · `--t-1: 1.383rem` (22) ·
  `--t-2: 1.797rem` (28.6) · `--t-3: 2.336rem` (37) · `--t-4: 3.037rem` (48.6) ·
  `--t-5: 3.948rem` (63).
- H1: `clamp(2.125rem, 4.6vw, 3.5rem)` (34→56px), line-height 1.04, letter-spacing −.026em,
  `text-wrap: balance`, máx 16–18ch. H1 de vertical: `clamp(2rem, 4vw, 3rem)`.
- H2: `clamp(1.75rem, 3.2vw, 2.25rem)` (28→36), lh 1.1, ls −.022em.
- H3: 19px, lh 1.25, ls −.012em (21px en el aside secundario).
- Lede (bajo el H1): 19–20px, lh 1.5, `--ink-muted`, máx 52–54ch.
- Párrafo: 16–17px, lh 1.55–1.6, `--ink-muted`, máx 64ch.
- Eyebrow: 13px, 500, uppercase, letter-spacing .12em, color navy (o `--on-dark` sobre
  oscuro); seguido de una regla horizontal oro de 56×1px (flex, gap 12px).
- Etiquetas de sección de componente (solo canvas/docs): 12px uppercase .12em muted.
- Botones: 16px/600 (primario), 15px/500 (fantasma), 14–15px/600 (pill WA).
- Notas: 13–14px `--ink-muted`.

### 3.3 Espaciado, contenedores, radios, sombras, movimiento

- Escala: `--s-1: 4px · --s-2: 8 · --s-3: 12 · --s-4: 16 · --s-5: 20 · --s-6: 24 · --s-8: 32 ·
  --s-12: 48 · --s-16: 64 · --s-18: 72 · --s-24: 96`.
- Contenedor: `width: min(1344px, 100% - 96px)` en desktop (padding lateral 48px en 1440);
  40px en ≤1024; 20px en ≤640. Bloques narrow (FAQ, prosa, formulario): máx 760px.
- Grid de 12 columnas, gap 32px, para hero (7/5), bandas dos columnas (7/5) y FAQ (4/8).
- Padding vertical de sección: `clamp(48px, 6vw, 72px)`; hero `72px 0 80px` (desktop),
  `32px 0 24px` (móvil).
- Radios: `--r-sm: 6px` (botones, inputs, ícono menú), `--r-md: 14px` (tarjetas, imágenes,
  panel WA, chip de oferta móvil = 10px), `--r-lg: 28px` (panel de precio navy), `--r-pill: 999px`
  (chip de oferta, pill WA del header, chips de zonas), 50% (FAB, sello).
- Sombras: `--shadow-1: 0 1px 2px rgba(18,24,31,.05), 0 4px 12px rgba(18,24,31,.06)`
  (botón primario, tarjeta reposo opcional); `--shadow-2: 0 2px 4px rgba(18,24,31,.07),
  0 16px 40px rgba(18,24,31,.11)` (panel WA, FAB, sello del hero, tarjeta hover).
- Movimiento: `--ease-out: cubic-bezier(.16,1,.3,1)`, `--dur-fast: 180ms`, `--dur: 280ms`.
  Hover de botón/tarjeta: `translateY(-2px)` + `--shadow-2`. Panel WA: fade+translateY(8px)
  180ms. `prefers-reduced-motion: reduce` → sin transforms. No hay scroll-reveal ni count-ups
  (no cargar el motion.js de CORE-15; es peso sin beneficio en un sitio de conversión).
- Focus: `outline: 3px solid var(--navy); outline-offset: 3px`.
- Iconos: SVG inline stroke 1.6px, grilla 16/20/24; nunca emoji. Los tres SVG del canvas
  (WhatsApp glyph, flecha →, check en círculo navy, sello oro) se copian de
  `assets/js`/`build-site.mjs` como strings.

### 3.4 Header sticky (`.hdr`)

- `position: sticky; top: 0; z-index: 60`; alto 68px desktop, 60px móvil.
- Estado arriba: `background: rgba(250,249,247,.88); backdrop-filter: blur(10px)
  saturate(150%); border-bottom: 1px solid transparent`.
- Estado `.is-stuck` (JS: `IntersectionObserver` sobre un sentinel de 1px arriba del header, o
  `scrollY > 8`): `background: var(--base); border-bottom-color: var(--hairline)`, transición
  280ms.
- Contenido, en flex gap 32px: marca (Libre Baskerville 700, 20px, ls −.02em, `.com.py` en
  oro) · nav (`margin-left: auto`, gap 24px, 15px/500 `--ink-muted`; activa: navy 600 +
  `border-bottom: 2px solid var(--gold)`; padding 6px 0) · pill WhatsApp (§3.11 trigger A).
- Nav de 7 ítems: Inicio · Tasaciones (`/#tasaciones`) · Informe oficial
  (`/informes-periciales/`) · Vender (`/valuacion-para-vender/`) · Nosotros · FAQ · Contacto.
  "Informe oficial" va antes que "Vender" (jerarquía §1.1).
- ≤1024px: nav se esconde tras un botón hamburguesa 44×44 (borde hairline, radio 6) que abre un
  panel vertical bajo el header (mismo fondo base, hairline, links de 48px de alto). Móvil
  muestra: marca · botón WA redondo 44px verde (trigger A, ícono `--wa-ink`) · hamburguesa.

### 3.5 Hero (home y verticales)

- Grid 12 col, gap 32, `align-items: center`, padding 72/48/80. Texto en `span 7`, foto en
  `span 5`. ≤900px: una columna, texto primero, foto después con `width: calc(100% - 40px)`.
- Orden dentro del texto (flex column, gap 24 desktop / 18 móvil): eyebrow → H1 → lede →
  **chip de oferta** (§3.6: sin cifra salvo en `/informes-periciales/`) → fila de botones
  (gap 12, wrap): **primario navy** + **fantasma** → línea chica (14px muted) con el enlace
  subrayado a la valoración gratis.
- Foto: `aspect-ratio: 4/3; object-fit: cover; border-radius: 14px`, `<picture>` avif/webp
  con srcset 640/1280/1920 (ya implementado), `fetchpriority="high"` en el hero.
- Sello sobre la foto (solo home): tarjeta `--surface`, hairline, radio 14, `--shadow-2`,
  padding 14px 18px, posicionada `left: -24px; bottom: 24px`; contiene el SVG sello (40px,
  círculo oro + check navy) y dos líneas: "Informe firmado por tasador" (14px/600) +
  "Fernando Capurro · tasador responsable" (13px muted). En móvil se omite (la fila de
  checks debajo lo cubre).
- Fila de confianza bajo el hero (home y verticales): fondo `--surface`, `border-top: 1px
  solid var(--hairline)`, padding 22px 48px, tres ítems 14px muted con check navy:
  "Validez para bancos, juzgados y escribanías" · "Comparables reales de mercado, no
  promedios" · "Precio anclado antes de la visita". En móvil: columna, gap 10, padding 24/20.
  Estos tres textos son afirmaciones ya presentes en el copy actual reformuladas; no agregar
  una cuarta.
- Hero de páginas `info` (nosotros, FAQ) y `contact`: mismo hero con el chip sin cifra, sin
  sello.

### 3.6 Chip de oferta (`.offer-chip`)

- Desktop: `display: inline-flex; gap: 12px; padding: 10px 16px 10px 12px; border-radius:
  999px; background: var(--gold-tint); border: 1px solid var(--gold-line); font-size: 15px`.
  Punto oro 8px al inicio.
- **Variante estándar (12 páginas + extras):** `<strong>` 600 "Informe oficial de tasación" +
  `<span>` muted "pago · firmado por el Tasador Fernando Capurro". Sin cifra.
- **Variante con precio (`.offer-chip--price`, solo `/informes-periciales/`):** `<strong>`
  "Informe oficial: Gs. 800.000 a 1.500.000" + `<span>` "según tipo y tamaño del inmueble".
  Renderizada desde `PRECIO_TXT`, nunca tipeada a mano.
- Móvil (≤640): bloque `flex-column; padding: 12px 14px; border-radius: 10px`; línea 1
  15px/600, línea 2 13px muted.
- El canvas muestra la variante con precio en los heros para ilustrar el componente; la
  decisión de §1.1 (precio con moderación) manda: implementar la variante estándar en los heros.

### 3.7 Botones

- `.btn` base: `inline-flex; align-items:center; justify-content:center; gap:10px;
  min-height:52px; padding:0 24px; border-radius:6px; font-weight:600; font-size:16px;
  text-decoration:none; border:1px solid transparent; transition: transform/box-shadow/
  background 180ms`. Hover: `translateY(-2px)` + `--shadow-2`.
- `.btn--primary`: navy fondo, `--on-dark` texto, `--shadow-1`; hover `--navy-deep`. Lleva el
  glyph WhatsApp 20px blanco a la izquierda cuando abre el menú WA (siempre en heros).
- `.btn--ghost`: transparente, texto `--ink`, borde `--hairline`, 15px/500, padding 0 20px,
  flecha → 16px a la derecha. Hover: fondo `--surface`, borde `--hairline-strong`.
- `.btn--onlight` (dentro del panel navy): fondo `--on-dark`, texto `--ink`, glyph WA verde.
- `.btn--wa` (franja final oscura): fondo `--wa`, texto e ícono `--wa-ink`, 17px, min-height 56.
- `.btn--block` en móvil para el primario del hero (ancho 100%).
- Pill WA (`.wa-pill`, trigger A del header): `border-radius: 999px; min-height: 40px;
  padding: 0 16px; background: var(--wa); color: var(--wa-ink); font: 600 14px`, glyph 18px.

### 3.8 Tarjeta (`.card`) — tres variantes, ninguna con borde izquierdo de color

- Base: `flex-column; gap: 8px; padding: 24px; border-radius: 14px; background: var(--surface);
  border: 1px solid var(--hairline)`. H3 19px; párrafo 15px/1.55 muted; enlace opcional 14px/600
  navy con flecha, `margin-top: 6px`.
- `.card--accent` (solo la oferta principal: informe oficial): `border-top: 3px solid
  var(--navy)`.
- `.card--muted` (lo secundario: valoración gratis): `background: var(--base)`.
- Hover (cuando la tarjeta entera es enlace): `border-color: var(--hairline-strong)`,
  `--shadow-2`, `translateY(-2px)`; el enlace pasa a `--navy-deep`.
- Grillas: `.grid--3` = `repeat(auto-fit, minmax(260px, 1fr))`, gap 20; `.grid--2` =
  `minmax(300px, 1fr)`.

### 3.9 Panel de precio (`.price-panel`, sección `priceBlock`)

- Banda `--surface` con `border-top/bottom: 1px solid var(--hairline)`, padding 64/48.
  Grid 12: izquierda `span 7` = eyebrow "El informe oficial" + H2 "Qué incluye el informe de
  tasación de …" + lista de 6 ítems en grid 2 col (gap 12×24) con check navy, 16px `--ink`.
  Derecha `span 5` = panel navy: `padding: 28px; border-radius: 28px; background: var(--navy);
  color: var(--on-dark)`; eyebrow "Precio" (on-dark); cifra en `.display` 34px lh 1.1
  ("Gs. 800.000 a" / "Gs. 1.500.000" en dos líneas); nota 15px on-dark-muted (= `PRECIO_NOTA`);
  dos filas `space-between` 14px con `border-top: 1px solid var(--hairline-dark)` y padding
  10px 0 (ej. "Lote urbano estándar — desde Gs. 800.000" / "Fracciones grandes o loteamientos
  — hasta Gs. 1.500.000"; por vertical, §5); botón `.btn--onlight` "Pedir mi informe por
  WhatsApp" (abre menú WA, opción 1).
- Las filas del panel solo pueden usar los dos extremos del rango confirmado ("desde 800.000"
  / "hasta 1.500.000"). Nunca cifras intermedias inventadas.
- **Este panel es el único lugar de una página de servicio donde aparece la cifra** (§1.1).
  Va a mitad de página, después del bloque de contexto, nunca en el primer viewport.
- ≤900px: una columna, panel navy debajo, radio 20px.

### 3.10 Aside secundario (`.free-aside`, sección `freeAside`)

- `display:flex; align-items:center; justify-content:space-between; gap:32px; padding:28px
  32px; border-radius:14px; background: var(--base); border:1px solid var(--hairline)`.
  Izquierda: etiqueta 13px uppercase muted "También disponible" + H3 21px + párrafo 15px muted
  que dice explícitamente que NO es un informe oficial ni tiene validez legal ni bancaria.
  Derecha: `.btn--ghost` "Valoración gratis para vender" (`flex: none`).
- ≤700px: columna, botón `width:100%`.
- Va SIEMPRE después del bloque de precio y de las tarjetas de criterios, nunca antes.

### 3.11 FAQ acordeón (`.faq`)

- `<details>`/`<summary>` nativo. Contenedor con `border-top: 1px solid var(--hairline)`; cada
  ítem `border-bottom: 1px solid var(--hairline)`; sin fondo de tarjeta.
- Summary: flex space-between, gap 16, min-height 60, padding 14px 0, 17px/600 `--ink`,
  `list-style:none` + `::-webkit-details-marker{display:none}`. A la derecha un círculo 28px
  con borde hairline y un "+" SVG 12px navy; `[open]` → rota 45° (280ms).
- Respuesta: `padding: 0 44px 20px 0; font-size: 16px; line-height: 1.6; color: var(--ink-muted);
  max-width: 64ch`.
- Layout de página: grid 12 → título en `span 4` (eyebrow + H2 32px), lista en `span 8`.
  Narrow (`/preguntas-frecuentes/`): una columna 760px, un H2 por grupo.
- Se mantiene el FAQ JSON-LD (`FAQPage`) generado desde `content.mjs` en las páginas con FAQ.

### 3.12 Franja CTA final (`.cta-band`, sección `ctaBand`)

- `background: var(--ink); color: var(--on-dark); padding: 72px 48px`. Grid 12: izquierda
  `span 8` = eyebrow on-dark "Informe oficial · firmado por tasador" (sin cifra) + H2 40px on-dark
  (máx 20ch) + párrafo 17px on-dark-muted; derecha `span 4`, alineada al final: `.btn--wa`
  "Solicitar informe oficial" (abre menú WA, opción 1) + debajo enlace 14px on-dark-muted
  subrayado "o pedir una valoración gratis para vender" (abre menú WA, opción 2).
- ≤900px: columna, botón `width:100%`, enlace centrado.
- Reemplaza `ctaFinal` en las 13 páginas (en `/valuacion-para-vender/` el orden de primario y
  secundario se mantiene igual: el informe sigue siendo el botón; el enlace chico es la
  valoración — es la única página donde el H1 habla de lo gratis, la franja no).

### 3.13 Footer (`.ftr`)

- Igual estructura que hoy (marca, Tasaciones, Sitio, Contacto, base) sobre `--ink`, con:
  etiquetas 13px uppercase .12em `--on-dark`; enlaces 15px `--on-dark` (hover: borde inferior
  oro); "Tasador responsable: Fernando Capurro" como línea de texto plano bajo la marca
  (sin foto); debajo "Informe oficial de tasación pago · Valoración gratis para vender" (sin
  cifra); en Contacto el número y "Llamar", ambos reescritos por `WA_NUMBER`.
- Padding 64px 0 48px; base con `border-top: 1px solid var(--hairline-dark)`, 13px.

### 3.14 Otros bloques existentes

- `steps` (home): rail numerado, círculos 32px navy con número 700 on-dark, H3 19, p 15 muted;
  grid auto-fit 220px. El paso 3 debe nombrar primero el informe oficial y después la valoración.
- `zonas`: chips `--navy-tint` navy 14px pill; sin cambio.
- `compare` (valuacion-para-vender): tabla hairline, thead `--navy-tint`; columna "Informe
  Pericial Oficial" pasa a decir "Gs. 800.000 a 1.500.000" en la fila de costo.
- `channels` (contacto): lista con `<strong>` 600.
- Formulario: `.form` grid gap 14 máx 420px; inputs `padding: 12px 14px; border: 1px solid
  var(--hairline); border-radius: 6px; font: 16px`; focus outline navy. Agrega un grupo de
  radios `name="mensaje"` (§7 T7).

---

## 4. Menú flotante de WhatsApp — especificación

### 4.1 Elementos

- **Trigger A (arriba a la derecha):** la pill verde "WhatsApp" del header sticky (móvil: botón
  redondo 44px). Abre el panel anclado bajo el header, `right: 24px; top: 80px`
  (`position: fixed`).
- **Trigger B (abajo a la derecha):** FAB `position: fixed; right: 24px; bottom: 24px; 56px;
  border-radius: 50%; background: var(--wa); z-index: 70; --shadow-2`, glyph WA 28px blanco.
  Móvil: `right: 16px; bottom: 16px`. Abre el panel hacia arriba: `right: 24px; bottom: 92px`.
- **Panel único** (`#wa-menu`, `[data-wa-menu]`, `hidden` por defecto): `width: min(320px,
  calc(100vw - 32px)); background: var(--surface); border: 1px solid var(--hairline);
  border-radius: 14px; box-shadow: var(--shadow-2); z-index: 95`. En ≤640px el panel ocupa
  `left:16px; right:16px; bottom: 88px` y hay backdrop `--backdrop` (`z-index: 90`).
  - Cabecera (padding 16px 18px 12px): "¿Qué necesitás?" 15px/600 + "Estás en: {waContext}"
    13px muted; botón cerrar 32px (×, `aria-label="Cerrar"`).
  - Tres opciones (`<a>` con `href` propio, `role="menuitem"` no — son enlaces; lista `<ul>`
    con `role="dialog"` en el panel y `aria-labelledby`), cada una `flex; gap 12; min-height
    56px; padding 10px 12px; border-radius 10px`; punto 8px a la izquierda; título 15px + subtítulo
    13px muted:
    1. **"Quiero un informe oficial de tasación"** — sub "Pago · con firma del tasador" — fondo
       `--navy-tint`, título navy 600, punto oro. Siempre la primera y
       preresaltada. Recibe el foco al abrir.
    2. "Quiero una valoración gratis para vender" — sub "Rango de mercado, sin costo" — punto
       hairline, título 500.
    3. "Tengo otra consulta" — sub "Escribinos lo que necesites".
    Hover de 2 y 3: fondo `--base`.
  - Pie (padding 10px 18px 14px, `border-top` hairline): glyph WA 14px verde + "Se abre
    WhatsApp con el mensaje ya escrito." 12px muted.
- Animación de apertura: opacity 0→1 + translateY(8px→0) 180ms `--ease-out`.

### 4.2 Mensajes

`WA_MENU` en `content.mjs`:

```js
export const WA_MENU = {
  options: [
    { id: 'informe',    label: 'Quiero un informe oficial de tasación',   sub: 'Pago · con firma del tasador',                    text: (ctx) => `Hola, vengo de la página de ${ctx} y quiero un informe oficial de tasación.` },
    { id: 'valoracion', label: 'Quiero una valoración gratis para vender', sub: 'Rango de mercado, sin costo',                     text: (ctx) => `Hola, vengo de la página de ${ctx} y quiero una valoración gratis para vender.` },
    { id: 'consulta',   label: 'Tengo otra consulta',                      sub: 'Escribinos lo que necesites',                     text: (ctx) => `Hola, vengo de la página de ${ctx} y tengo una consulta.` },
  ],
  fallback: (ctx) => `Hola, vengo de tasacion.com.py (${ctx}) y quiero información sobre una tasación.`,
};
```

`waContext` por página (los 13 + 2 extras), congelado:

| Ruta | `waContext` |
|---|---|
| `/` | `Inicio` |
| `/tasaciones/casas/` | `Tasación de Casas` |
| `/tasaciones/departamentos/` | `Tasación de Departamentos` |
| `/tasaciones/terrenos/` | `Tasación de Terrenos` |
| `/tasaciones/corporativa/` | `Tasación Corporativa` |
| `/tasaciones/hipotecaria/` | `Tasación Hipotecaria` |
| `/tasaciones/locales-comerciales/` | `Tasación de Locales Comerciales` |
| `/tasaciones/campos/` | `Tasación de Campos y Estancias` |
| `/valuacion-para-vender/` | `Valoración para Vender` |
| `/informes-periciales/` | `Informes Periciales` |
| `/nosotros/` | `Nosotros` |
| `/preguntas-frecuentes/` | `Preguntas Frecuentes` |
| `/contacto/` | `Contacto` |
| `404.html` | `Página no encontrada` |
| `gracias.html` | `Gracias` |

Ejemplo (opción 1 en terrenos): `Hola, vengo de la página de Tasación de Terrenos y quiero un
informe oficial de tasación.` URL: `https://wa.me/595995628862?text=` + `encodeURIComponent(msg)`.

### 4.3 Comportamiento y degradación

- **Sin JS:** cada trigger es `<a href="https://wa.me/{WA_NUMBER}?text={fallback(ctx) urlencoded}"
  target="_blank" rel="noopener">`. El panel se renderiza en el HTML (`hidden`) con sus tres
  `<a>` ya construidos con `text` codificado; sin JS nadie lo ve, pero los enlaces son válidos.
  Todo botón primario de hero/precio/franja que "abre el menú" es también un `<a>` al mensaje
  de la opción 1 (`data-wa-open="informe"`), así sin JS va directo al chat con el mensaje
  correcto.
- **Con JS** (`assets/js/site.js`, un solo archivo, sin dependencias, ≤ 6 KB): todo
  `[data-wa-trigger]` (pill header, FAB, primarios con `data-wa-open`) hace `preventDefault`,
  abre el panel (`hidden=false`), marca `aria-expanded`, enfoca la opción indicada por
  `data-wa-open` (por defecto la 1). Cierra con ×, backdrop, click fuera, Escape (devuelve el
  foco al trigger). Tab queda atrapado dentro del panel mientras está abierto. Elegir una
  opción cierra el panel y deja navegar al `href`. Portar la lógica de
  `php-site-template/assets/js/whatsapp-menu.js` (ya probada) adaptando selectores.
- El JS **no construye URLs**: los `href` vienen del HTML generado; `WA_NUMBER` los reescribe
  al cargar como hoy (`a[href^="https://wa.me/"]` → reemplaza el número, conserva `?text=`).
- Analítica: cada opción lleva `data-ev="wa_click" data-ev-loc="menu" data-wa-option="{id}"`;
  triggers `data-ev-loc="header|fab|hero|price|band"`. `dataLayer.push` incluye `wa_option`.
- Un solo panel por página, renderizado justo antes de `</main>`/antes del footer, junto al FAB.
- Solo se muestra un trigger inferior (FAB); no hay barra sticky móvil aparte (evita que se
  tapen).

---

## 5. Rebalance de copy y jerarquía — las 13 páginas

Regla general para cada página: (1) H1/eyebrow/lede nombran el informe oficial y al tasador;
(2) chip de oferta sin cifra (§3.6); (3) primario = informe (abre menú WA opción 1); (4) fantasma = ancla a
"qué incluye" o ruta a `/informes-periciales/`; (5) línea chica a la valoración gratis; (6) el
orden de secciones pone precio/incluye/criterios antes que el aside gratis; (7) `ctaBand`
cierra. El copy existente se conserva donde no contradiga la jerarquía; se reescribe donde el
"gratis" era el titular. Nada nuevo sobre credenciales.

| Ruta | `kind` | H1 (dirección) | Cambios de contenido concretos |
|---|---|---|---|
| `/` | home | "Informe oficial de tasación, firmado por un tasador" | Eyebrow "Tasador Fernando Capurro · Asunción y Gran Asunción". Orden: hero+sello → fila confianza → `services` (7 tarjetas, la de informe en `.card--accent` primero como 8ª "Informe oficial" o como intro) → bloque "Informe oficial" (`grid2` con dos tarjetas: `.card--accent` "Informe oficial de tasación" → `/informes-periciales/` y `.card--muted` "Valoración gratis para vender" → `/valuacion-para-vender/`; **sin `priceBlock` en la home**, el precio vive en las verticales y el hub) → `steps` (paso 3 informe primero) → `porQueElegirnos` → `freeAside` (fusiona las viejas secciones "Vendemos tu propiedad" + "Para Vendedores" en un solo aside; la grilla de marketing se mueve a `/valuacion-para-vender/`) → `faqPreview` (primera pregunta "¿Cuánto cuesta el informe oficial?") → `ctaBand`. Quitar `trustBar` "Respuesta rápida"→ usar la fila de confianza. |
| `/tasaciones/casas/` | vertical | "Informe oficial de tasación de casas en Asunción" | Lead existente se mantiene (precio mal puesto), `priceBlock` (filas: "Casa estándar en barrio urbano — desde 800.000" / "Casas grandes o en barrio cerrado — hasta 1.500.000"), criterios grid3 existente, `freeAside`, `zonas`, FAQ (nueva Q1 "¿Cuánto cuesta el informe de una casa?" con el rango; la vieja "¿La visita tiene costo?" se reescribe: el informe tiene costo anclado; la valoración para vender es sin costo), `links`, `ctaBand`. |
| `/tasaciones/departamentos/` | vertical | "Informe oficial de tasación de departamentos" | Mismo patrón; filas: "Unidad estándar — desde" / "Unidades grandes, dúplex o pozo — hasta". |
| `/tasaciones/terrenos/` | vertical | "Informe oficial de tasación de terrenos" | Exactamente el artboard "Página de vertical" del canvas. Filas: "Lote urbano estándar — desde" / "Fracciones grandes o loteamientos — hasta". |
| `/tasaciones/corporativa/` | vertical | "Tasación corporativa: informe oficial para tu empresa" | `heroCta` "Solicitar informe corporativo"; filas: "Oficinas y locales administrativos — desde" / "Plantas, depósitos y complejos — hasta". Mantener las dos grids B2B. |
| `/tasaciones/hipotecaria/` | vertical | "Tasación hipotecaria: el informe oficial para tu carpeta" | Mantener copy; filas: "Vivienda — desde" / "Inmuebles comerciales o grandes — hasta". **No agregar** nombres de bancos ni "aprobado por"; la FAQ "¿Sirve para cualquier banco?" queda como está. Sin `freeAside` (no aplica vender) — en su lugar un `links` a informes-periciales. |
| `/tasaciones/locales-comerciales/` | vertical | "Informe oficial de tasación de locales comerciales" | Filas: "Local a pie de calle — desde" / "Locales grandes, galerías o shopping — hasta". |
| `/tasaciones/campos/` | vertical | "Informe oficial de tasación de campos y estancias" | Filas: "Campos chicos — desde" / "Estancias y establecimientos grandes — hasta". FAQ "¿Cuánto demora?" se mantiene hedged. |
| `/valuacion-para-vender/` | secondary-free | "Valoración gratis para vender tu propiedad" (se mantiene: es la página de lo gratis) | Hero SIN chip pero con `freeLink` invertido: línea chica "¿Necesitás validez legal o bancaria? Pedí el informe oficial →" (a `/informes-periciales/`). Primario del hero aquí es la única excepción: `.btn--primary` "Quiero mi valoración gratis" (menú WA opción 2 preseleccionada). Recibe la grilla de marketing de la home. `compare` con la fila de costo actualizada al rango. `ctaBand` estándar (informe primario, valoración enlace) — sí, también acá. |
| `/informes-periciales/` | primary-report | "Informes periciales con validez jurídica y bancaria" (se mantiene) | Página hub del producto pago y **la única con el precio en el hero** (`.offer-chip--price`) y sello; `priceBlock` completo con las 6 inclusiones del `leadList` actual; grid2 "Casos donde necesitás un informe" en `.card--accent`; FAQ "¿Cuánto cuesta?" → rango; `ctaBand`. Sin `freeAside`; un `links` a las 7 verticales. |
| `/nosotros/` | info | "Tasador Fernando Capurro y el equipo de Tasación.com.py" | Bloque "Quién firma tus informes": nombre, rol "tasador responsable", nada más (sin foto salvo §9.4). Pilares se mantienen. `ctaBand`. |
| `/preguntas-frecuentes/` | info | se mantiene | Grupo "Informe Oficial" pasa **primero**, "Para Vender (Gratis)" segundo; la pregunta de costo responde con el rango + nota. Añadir "¿Quién firma el informe?" → "El Tasador Fernando Capurro, tasador responsable de Tasación.com.py." `ctaBand`. |
| `/contacto/` | contact | "Pedí tu informe oficial de tasación" | Chip sin cifra en hero; `channels` se mantiene; formulario con radios `mensaje` (§7 T7): "Informe oficial de tasación" (default) / "Valoración gratis para vender" / "Otra consulta"; `ctaBand`. |

Extras (no en sitemap, `noindex`): `404.html` y `gracias.html` se regeneran desde el mismo
`build-site.mjs` (entradas con `extra: true`) para heredar header/footer/menú WA. `gracias.html`
lleva un `.btn--primary` que abre WA con el texto actual de "acabo de dejar mis datos…".

---

## 6. Protocolo de autonomía (la sesión de build lo sigue al pie de la letra)

1. Trabajar hasta que TODO §8 pase. Nunca pedir permiso para trabajo dentro del plan.
2. Cuatro PRs consecutivos (§7), cada uno en su rama `redesign/<n>-<slug>` creada desde
   `master` al día (después de mergear el anterior). Commit al menos cada 30 minutos (WIP está
   bien; el PR se squash-mergea). Al cumplir el "listo cuando" del PR: abrirlo ese mismo turno
   (cuerpo ≤ 25 líneas, link al canvas y a §7), suscribirse a su actividad
   (`subscribe_pr_activity`), arreglar todo lo rojo, y **mergearlo uno mismo**
   (`merge_pull_request`, squash) cuando CI esté verde — no esperar revisión humana. Luego
   `git fetch origin master && git checkout -b redesign/<n+1>-… origin/master` y seguir.
3. Problemas menores no bloqueantes → `docs/log/redesign.md` sección "Known issues"; seguir.
4. Parar y preguntar SOLO por: una credencial faltante sin fallback, o una decisión de base
   (contrato de contenido, campos del PHP, rutas) donde adivinar mal obliga a reescribir.
   "Preguntar" = escribir la pregunta en `docs/decisions-needed.md`, commit, push, terminar la
   sesión. Nunca esperar en la sesión.
5. Valores de config faltantes (VenderCRM, analytics) nunca bloquean: quedan vacíos y el sitio
   degrada como hoy (`leads.log`, sin tag).
6. Re-ejecutable: primero mirar `git log origin/master` y los PRs mergeados; seguir desde el
   primer PR de §7 no mergeado (si su rama existe, continuar en ella; si su PR está abierto y
   verde, mergearlo y pasar al siguiente).
7. Nunca "deployar". Nunca tocar `master` directo. Nunca cambiar rutas, títulos, canonicals ni
   los nombres de campo POST.
8. **Guardarraíl de costo:** Fable/Mythos (`claude-fable-*`) jamás — ni como subagente, ni
   sesión, ni Workflow, ni Routine. Si algo pareciera necesitarlo, escribirlo en
   `docs/decisions-needed.md` y terminar.
9. Fan-out permitido: para las 13 páginas de copy (T6) usar subagentes **Sonnet** en paralelo,
   una página por subagente, según `fable-directs-sonnet-builds` §Fan-out — cada subagente
   edita solo su entrada de `PAGES`; la sesión principal integra, corre `verify`, y corrige.
10. Tope de pulido: una pasada de screenshots (≤ 5 páginas × 2 anchos, al final), un solo run
    de Lighthouse solo si §8.7 lo pide, el cuerpo del PR se escribe una vez (≤ 25 líneas).
    Ideas posteriores → §11 Backlog, no commits.
11. Log de fase: antes de mergear, `docs/log/redesign.md` con ≤ 12 líneas "Built", ≤ 8
    "Decisions", ≤ 8 "Known issues", una línea "Verification: verify green on <commit>".
12. Screenshots no se commitean (`docs/screenshots/` en `.gitignore`); van como artifact de CI.

---

## 7. Lista de tareas, en orden de build — cuatro PRs

Cada PR es una rama desde `master` al día, abierta y mergeada por la sesión Sonnet cuando CI está
verde (§6.2). Orden estricto. Dentro de un PR, un commit por tarea como mínimo.

### PR-1 — `redesign/1-fundacion` · contrato, CSS, renderizador, JS, gate, CI

| # | Tarea | Archivos | Listo cuando |
|---|---|---|---|
| T0 | Orientación: leer §1–§6 y §8. Leer `content.mjs`, `build-site.mjs`, `assets/css/site.css`, `assets/js/site.js`, `.htaccess`, `lead-forward.php`. Leer `git show 1da41b3:assets/css/site.css` (CORE-15: tokens, header stuck, FAQ, FAB, footer — minar, no copiar entero) y `git show 1da41b3:assets/js/site.js` (solo header/WA; NO el motion.js). | — | Sesión sabe qué existe. |
| T1 | Comparación con `php-site-template` (§10): clonar `https://github.com/antonmarklundcom/php-site-template` (público, depth 1) fuera del repo; leer `partials/whatsapp-menu.php`, `partials/whatsapp-fab.php`, `assets/js/whatsapp-menu.js`, el bloque `.wa-menu*`/`.wa-fab` de su CSS, `verify.sh`, `deploy/make-zip.sh`, `.github/workflows/verify.yml`, `tests/screenshots.mjs`. Anotar en `docs/log/redesign.md` qué se porta. | `docs/log/redesign.md` | Lista "portado / no portado, por qué" ≤ 10 líneas. |
| T2 | Contrato §2: `TASADOR`, `PRECIO*`, `WA_MENU`, campos nuevos de página, tipos `priceBlock`/`freeAside`/`ctaBand`; helper `fmtGs(n)` → "Gs. 800.000". Congelar `docs/routes.json` con las 13 rutas + title + canonical actuales + `"copyDone": false`. Dar a las 13 páginas `waContext`, `kind`, `eyebrow`, hero.* y `showPriceChip` con el copy ACTUAL (la reescritura es PR-2/PR-3); reemplazar `ctaFinal` por `ctaBand` ya en este PR. | `content.mjs`, `docs/routes.json` | `node build-site.mjs` genera 13 páginas + 2 extras. |
| T3 | CSS nuevo desde §3: reescribir `assets/css/site.css` completo con `:root` (§3.1–3.3) y todos los componentes (§3.4–3.14). Sin frameworks. Inter 600 en el link de Google Fonts. | `assets/css/site.css`, `build-site.mjs` | Todos los selectores de §3 existen; `prefers-reduced-motion` respetado. |
| T4 | Renderizador `build-site.mjs`: header §3.4, hero §3.5 (chip §3.6, dos botones, freeLink, sello, fila de confianza), `priceBlock`, `freeAside`, `ctaBand`, FAQ con "+" y JSON-LD `FAQPage`, footer §3.13, panel WA §4 + FAB, `404.html`/`gracias.html` como extras, `data-page-context`. `WA_NUMBER` y `ANALYTICS_ID` siguen siendo una línea cada uno. | `build-site.mjs` | 15 salidas regeneradas; HTML válido; un solo `#wa-menu` por página. |
| T5 | JS `assets/js/site.js`: conserva dataLayer/analytics/WA_NUMBER rewrite/page_url/año; agrega header `.is-stuck`, hamburguesa, menú WA §4.3 (portado de la plantilla). Sin dependencias. | `assets/js/site.js` | `tests/wa-menu.mjs` pasa. |
| T7 | Formulario de contacto: radios `name="mensaje"` (3 valores §5), `email` opcional, `page_url` hidden. `lead-forward.php` sin cambios de campos. | `build-site.mjs`, `content.mjs` | POST con `nombre`,`telefono`,`mensaje`,`page_url`,`website` vacío → 303 a `/gracias.html` (probar con `php -S` si hay PHP; si no, revisar estáticamente y anotar). |
| T8 | `.htaccess`: agregar `RedirectMatch 404` para `^/plan\.md$`, `^/prompts(/|$)`, `^/tests(/|$)`, `^/deploy(/|$)`, `^/verify\.mjs$`, `^/content\.mjs$`, `^/build-site\.mjs$`, `^/\.github(/|$)`. Solo agregar líneas. `sitemap.xml`: solo `lastmod`. | `.htaccess`, `sitemap.xml` | 13 URLs del sitemap == `docs/routes.json`. |
| T9 | Gate `verify.mjs` (Node, sin deps): corre `build-site.mjs` y falla si `git diff --exit-code -- '*.html'`; 13 rutas + title + canonical vs `docs/routes.json`; sitemap == 13; por página: un `#wa-menu` con 3 `a[href^="https://wa.me/"]` cuyos `?text=` decodificados contienen el `waContext`; `[data-wa-trigger]` ≥ 2; `ctaBand` última sección antes del footer; una sola línea `var WA_NUMBER`; `<h1>` único; sin `TODO`/`lorem`; strings prohibidos ausentes (`RUC`, `matrícula N`, `Mat. `, `años de experiencia`, `años en el mercado`, `respondemos en`, `en minutos`, `testimonio`, `★`, `habilitado por el BCP`, y cualquier `Gs. <cifra>` que no sea `800.000` o `1.500.000`). **Checks de copy (solo cuando `docs/routes.json` tiene `"copyDone": true`, PR-3):** `PRECIO_TXT` presente exactamente en: `priceBlock` de las 7 verticales, hero + `priceBlock` de informes-periciales, FAQ de costo; `PRECIO_TXT` AUSENTE en el hero de las otras 12 páginas, en toda `ctaBand` y en el footer; "Te cotizamos por WhatsApp" ausente; cada `freeAside` contiene "no es un informe oficial"; cada `freeAside` va después de todo `priceBlock`; el primer `.btn--primary` del `<main>` lleva `data-wa-open="informe"` (excepción `/valuacion-para-vender/` → `valoracion`); ningún `.btn--primary` enlaza a `/valuacion-para-vender/`. Además `tests/wa-menu.mjs` (Playwright, Chromium en `/opt/pw-browsers`): abre `/tasaciones/terrenos/` vía `serve.mjs`, click FAB → panel visible, opción 1 con foco, `href` decodificado == texto esperado; Escape cierra; pill header abre; a 390px cabe; con `javaScriptEnabled:false` los triggers son `<a>` a `wa.me` con `?text=` que contiene el contexto. `package.json` scripts: `build`, `verify`, `test:wa`. | `verify.mjs`, `tests/wa-menu.mjs`, `package.json` | `node verify.mjs` → `PASS`; `node tests/wa-menu.mjs` → `PASS`. |
| T10 | CI `.github/workflows/verify.yml` en PR y push a `master`: `node verify.mjs`; `npx playwright install --with-deps chromium` + `node tests/wa-menu.mjs`; job `screenshots` (no bloqueante) con `tests/screenshots.mjs` portado: `/`, `/tasaciones/terrenos/`, `/informes-periciales/`, `/valuacion-para-vender/`, `/contacto/` a 1440 y 390 + menú WA abierto, como artifact. Si `sharp` en `package.json` hace lento `npm ci`, moverlo a `optionalDependencies` o no instalar deps en CI. | `.github/workflows/verify.yml`, `tests/screenshots.mjs`, `.gitignore` (`docs/screenshots/`) | CI verde en el PR. |

**PR-1 listo cuando:** CI verde; §8.1–8.4, 8.8–8.12 pasan; el sitio ya muestra header, hero
nuevo, menú WA y `ctaBand` en las 15 páginas con el copy viejo. Mergear y pasar a PR-2.

### PR-2 — `redesign/2-copy-hub` · home, informes-periciales, valuacion-para-vender, contacto, nosotros, FAQ

| # | Tarea | Archivos | Listo cuando |
|---|---|---|---|
| T6a | Copy §5 de las 6 páginas no-vertical + `404.html`/`gracias.html`: eyebrow, H1, lede, hero.*, secciones reordenadas, `freeAside` donde corresponde, FAQ de costo con el rango, `ctaBand`. `/informes-periciales/` recibe `.offer-chip--price` + `priceBlock`. En la home, sin `priceBlock`. Puede hacerse con 2–3 subagentes Sonnet en paralelo (§6.9). | `content.mjs` | `node verify.mjs` PASS; las 6 páginas cumplen la fila de §5. |

**PR-2 listo cuando:** CI verde; en esas 6 páginas ya no existe "Te cotizamos por WhatsApp" ni
ningún `.btn--primary` hacia lo gratis. Mergear y pasar a PR-3.

### PR-3 — `redesign/3-copy-verticales` · las 7 verticales (fan-out)

| # | Tarea | Archivos | Listo cuando |
|---|---|---|---|
| T6b | Copy §5 de las 7 verticales, **una por subagente Sonnet en paralelo** (§6.9): cada una con `priceBlock` (filas solo "desde 800.000 / hasta 1.500.000"), `freeAside` (excepto hipotecaria), FAQ de costo con el rango, `ctaBand`. Reemplazar TODAS las apariciones de "El monto depende del tipo de inmueble, la superficie y el uso del informe. Te cotizamos por WhatsApp." | `content.mjs` | `grep -c "Te cotizamos por WhatsApp" content.mjs` = 0. |
| T6c | Poner `"copyDone": true` en `docs/routes.json` → se activan los checks de copy de T9. Corregir lo que falle. | `docs/routes.json` | `node verify.mjs` PASS con checks de copy. |

**PR-3 listo cuando:** CI verde con `copyDone: true`; §8.5–8.7 pasan. Mergear y pasar a PR-4.

### PR-4 — `redesign/4-cierre` · zip, docs, screenshots finales

| # | Tarea | Archivos | Listo cuando |
|---|---|---|---|
| T11 | `deploy/make-zip.sh` (portado y simplificado): `dist/tasacion-YYYY-MM-DD.zip` plano con `index.html`, `404.html`, `gracias.html`, `lead-forward.php`, `.htaccess`, `robots.txt`, `sitemap.xml`, `assets/`, y los 12 directorios de ruta. Nada más. `dist/` en `.gitignore`. No corre en CI; no "deploya". | `deploy/make-zip.sh`, `.gitignore` | `./deploy/make-zip.sh && unzip -l dist/*.zip` sin archivos prohibidos (§8.14). |
| T12 | Docs: `docs/log/redesign.md` final (§6.11), `NEXT-STEPS.md` → "ver plan.md §9/§11", `docs/DEPLOY.md` (cómo generar el zip y qué subir). Screenshots finales (§6.10) como artifact del PR. | `docs/**`, `NEXT-STEPS.md` | Existen; §8.13 verificado. |
| T13 | Cierre: PR con link al artifact de screenshots y al canvas; mergear cuando verde; informe final en `docs/log/redesign.md`. Terminar la sesión. | — | §8.15. |

## 8. Checklist de salida (verificable, no "se ve bien")

1. **Rutas congeladas.** `docs/routes.json` lista exactamente estas 13 y `verify.mjs` confirma
   que cada `index.html` existe con el `<title>` y `<link rel="canonical">` idénticos al MVP:
   `/`, `/tasaciones/casas/`, `/tasaciones/departamentos/`, `/tasaciones/terrenos/`,
   `/tasaciones/corporativa/`, `/tasaciones/hipotecaria/`, `/tasaciones/locales-comerciales/`,
   `/tasaciones/campos/`, `/valuacion-para-vender/`, `/informes-periciales/`, `/nosotros/`,
   `/preguntas-frecuentes/`, `/contacto/`. `sitemap.xml` tiene 13 `<loc>` y coinciden.
2. **Generación limpia.** `node build-site.mjs` deja `git status` sin cambios en `*.html`.
3. **`node verify.mjs` → PASS** con todos los checks de T9, en local y en CI.
4. **`node tests/wa-menu.mjs` → PASS** (menú abre desde FAB y header, foco en opción 1,
   hrefs con el contexto correcto, Escape cierra, cabe a 390px).
5. **Jerarquía:** en las 13 páginas el primer `.btn--primary` del `<main>` abre el menú WA con
   `data-wa-open="informe"` (excepción documentada: `/valuacion-para-vender/` → `valoracion`);
   ningún `.btn--primary` enlaza a `/valuacion-para-vender/`; toda `freeAside` aparece en el
   DOM después de todo `priceBlock` de la misma página; la `ctaBand` es la última sección
   antes del footer en las 13.
6. **Precio, con moderación (§1.1):** `Gs. 800.000 a Gs. 1.500.000` aparece en el `priceBlock`
   de las 7 verticales, en el hero (`.offer-chip--price`) y `priceBlock` de
   `/informes-periciales/`, y en las FAQ de costo — y en ningún otro lugar: NO en el hero de las
   otras 12 páginas, NO en `ctaBand`, NO en el footer, NO en el menú WA. La frase vieja "Te
   cotizamos por WhatsApp" no aparece en ningún `.html`. Ninguna otra cifra en guaraníes existe.
7. **Honestidad y jerarquía de oferta:** los strings prohibidos de T9 no aparecen en ningún
   `.html`; "Fernando Capurro" aparece en las 15 páginas (footer + chip de oferta) y en el
   eyebrow de `/`, `/nosotros/`, `/informes-periciales/`; la palabra "gratis"/"gratuita" no
   aparece en ningún H1 salvo `/valuacion-para-vender/`, ni en ningún `<title>` salvo ese
   mismo; ningún `<img>` nuevo (solo los 8 sets existentes + og).
8. **Sin JS:** con JS deshabilitado (Playwright `javaScriptEnabled: false` en
   `tests/wa-menu.mjs`), la pill del header y el FAB son `<a>` a `wa.me` con `?text=` que
   contiene el `waContext`; el panel no se ve; los enlaces `tel:` y `wa.me` llevan
   `595995628862`.
9. **Formulario:** `/contacto/` envía por POST a `/lead-forward.php` los campos `nombre`,
   `telefono`, `mensaje` (radio), `email` (opcional), `page_url`, `website` (honeypot); no
   hay ningún otro `name=`.
10. **Infra intacta:** `lead-forward.php` sin cambios de campos (diff solo comentarios o
    ninguno); `.htaccess` conserva todas las líneas del MVP y suma las de T8; `robots.txt`
    idéntico; `WA_NUMBER` una sola vez por archivo HTML.
11. **Accesibilidad mínima:** un `<h1>` por página; panel WA con `role="dialog"`,
    `aria-labelledby`, botón cerrar con `aria-label`; triggers con `aria-expanded`;
    `:focus-visible` visible; `details/summary` nativos en FAQ; contraste de §3.1 respetado
    (no introducir colores fuera de la tabla).
12. **Peso:** `assets/css/site.css` ≤ 40 KB sin minificar; `assets/js/site.js` ≤ 8 KB; no se
    agregan fuentes ni librerías; el hero sigue con `<picture>` avif/webp y
    `fetchpriority="high"`.
13. **Responsive:** screenshots de CI a 1440 y 390 de `/`, `/tasaciones/terrenos/`,
    `/informes-periciales/`, `/valuacion-para-vender/`, `/contacto/`: sin scroll horizontal
    (verificado por `document.documentElement.scrollWidth <= innerWidth` en el script), header
    a 60px con pill WA y hamburguesa, FAB no tapa el botón de la `ctaBand`.
14. **Zip:** `./deploy/make-zip.sh` produce `dist/tasacion-<fecha>.zip` con solo lo listado en
    T11.
15. **Los cuatro PRs de §7 mergeados a `master`** por la sesión Sonnet, cada uno con CI verde,
    y `docs/log/redesign.md` commiteado.

---

## 9. Inputs humanos (ninguno bloquea el build)

1. **Fotografía nueva (manual, Anton).** El sandbox no llega al CDN de Higgsfield. Cuando
   quieras más fotos: generarlas en Higgsfield (skill `higgsfield-web-imagery` para la
   dirección de arte: tasador con carpeta/plano, firma de informe, fachadas de Asunción,
   estancia), pasarlas por `webimg` (skill `webimg-pipeline`) con `--name <slug-seo> --alt "…"`
   para obtener `<slug>-{640,1280,1920}.{avif,webp}`, y soltarlas en `assets/img/`. Después,
   cambiar `heroImage.base` en `content.mjs` y regenerar. Candidatas útiles: una foto para
   `/preguntas-frecuentes/` y `/contacto/` (hoy sin hero), y una específica de "informe
   firmado" para `/informes-periciales/`.
2. **VenderCRM:** `VENDERCRM_URL` + `VENDERCRM_API_KEY` como variables de entorno en hPanel
   (o include fuera de `public_html`). Hasta entonces los leads quedan en `leads.log`.
3. **Analytics:** ID GA4/GTM → la línea `var ANALYTICS_ID = '';` en `build-site.mjs` (una sola
   línea, se propaga al regenerar).
4. **Foto de Fernando Capurro (opcional).** Solo si él lo autoriza; si llega, va en `/nosotros/`
   y en el sello del hero home. El build no la espera.
5. **Deploy:** cuando quieras subir, pedir "generá el zip" → `./deploy/make-zip.sh` → subir y
   extraer en `public_html/` desde el file manager de Hostinger. Verificar después:
   `https://tasacion.com.py/tasaciones/terrenos/` muestra el chip de precio y el FAB abre el
   menú.
6. **Número dedicado de WhatsApp (opcional):** cambiar `WA_NUMBER` en `content.mjs` y
   regenerar; hacer también buscar-y-reemplazar del número literal en `404.html`/`gracias.html`
   si se dejaran fuera del generador (T4 los mete, así que no).

---

## 10. Qué tomar de `php-site-template` (y qué no)

Decisión: **no migrar** a la plantilla (PHP routing, `content/*.php`, `enviar.php`). El sitio
está en producción con URLs que Ads ya compra, con un generador que funciona y un PHP de leads
probado. Migrar sería reescribir para ganar poco. Se portan piezas puntuales, adaptadas a
estático:

| Pieza de la plantilla | Portar | Nota |
|---|---|---|
| `assets/js/whatsapp-menu.js` | **Sí** | Lógica de apertura/cierre/foco/trap de Tab; cambiar selectores a `[data-wa-trigger]`/`[data-wa-menu]` y sumar `data-wa-open`. |
| `partials/whatsapp-menu.php` (estructura HTML/ARIA) | **Sí** | Como string template en `build-site.mjs`. |
| `.wa-menu*`, `.wa-fab` CSS | Parcial | Solo la estructura; colores/radios/sombras vienen de §3. |
| `verify.sh` (idea de gate: rutas, títulos únicos, no warnings, integridad) | Sí, como `verify.mjs` | Node en vez de bash+PHP porque el sitio es estático. |
| `.github/workflows/verify.yml` + `tests/screenshots.mjs` | **Sí** | Sin el paso de PHP/zip-verify; `screenshots` no bloquea. |
| `deploy/make-zip.sh` | Sí, simplificado | Lista `SHIP` estática; sin minify/subset. |
| `enviar.php`, `content/lead-values.php`, `lib/`, `router.php`, `templates/` | **No** | `lead-forward.php` y `build-site.mjs` ya cumplen ese rol. |
| `deploy/minify-css.mjs`, `subset-fonts.sh`, `optimize-images.mjs` | No (backlog) | CSS ≤ 40 KB no lo necesita; fuentes siguen en Google Fonts. |

La sesión de build confirma o corrige esta tabla en T1 y lo deja en `docs/log/redesign.md`.

---

## 11. Preguntas de negocio aparcadas (no son trabajo de build)

- **Hipotecaria vs. habilitación BCP.** `PLACEHOLDERS.md` (CORE-15) decía "no somos tasadores
  habilitados por el BCP; no hablar de bancos". El copy actual (scan del sitio anterior, en
  producción) sí habla de bancos en `/tasaciones/hipotecaria/` e `/informes-periciales/`. El
  plan conserva el copy existente sin sumar afirmaciones. Anton decide si suavizar.
- **"Peritos matriculados" (plural) vs. un tasador nombrado.** Se conserva donde ya estaba;
  las reescrituras usan "Tasador Fernando Capurro". Anton decide si unificar.
- Grilla de precios más fina (por tipo × m²): solo si Anton la confirma; hoy solo el rango.
- Backlog técnico: minify CSS en el zip; self-host de fuentes; página `/precios/`; foto del
  tasador; `Organization`/`LocalBusiness` JSON-LD con `legalName` cuando exista RUC.

---

## 12. Índice de log de build

| Fase | PR | Log |
|---|---|---|
| PR-1 fundación | — | `docs/log/redesign.md` |
| PR-2 copy hub | — | `docs/log/redesign.md` |
| PR-3 copy verticales | — | `docs/log/redesign.md` |
| PR-4 cierre | — | `docs/log/redesign.md` |
