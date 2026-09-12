# Live-site audit — tasacion.com.py — 2026-09-11

Audit read-only con Playwright (Chromium 153, `node_modules` del repo) contra https://tasacion.com.py,
15 rutas de `docs/routes.json`, desktop 1366×900 y móvil 375×812. Sin cambios de código.
Datos crudos: `docs/screenshots/audit-2026-09-11/report.json` y `wa.json`. Capturas clave en la misma carpeta.

## 0. Hallazgo principal (P0, no es código): el CDN de Hostinger sirve el `site.css` viejo

| Recurso | Lo que recibe **curl** (sin Accept-Encoding) | Lo que recibe **Chrome** (brotli) |
|---|---|---|
| `/` (HTML) | v3, Last-Modified 11-sep 14:24 | v3, Last-Modified 11-sep 14:24 ✅ |
| `/assets/css/site.css` | v3, 27 577 B, etag `6bb9-6aa40f20` | **pre-v3, 20 152 B, Last-Modified 05-sep 13:18, etag `4ebc-6a9c16a1`, `Age: 380340`** ❌ |
| `/assets/js/site.js` | idéntico al repo | variante del 05-sep, pero el JS no cambió en v3 → sin efecto |

`Cache-Control: public, max-age=604800` (7 días) y la variante comprimida del CSS quedó cacheada en
el edge (`Server: hcdn`) desde el deploy del 5-sep. El HTML v3 referencia clases que ese CSS no tiene.
Consecuencia para todo visitante real, en **todas** las páginas:

- Bloque "Quién firma" y filas de confianza: los SVG de check y el círculo dorado se renderizan sin
  tamaño → **íconos de 400–600 px** ocupando media pantalla (ver `informes-periciales-desktop.png`,
  `tasaciones_franja-de-dominio-desktop.png`, `home-mobile-full.png`).
- `pricingTiers`, `useCases`, `valueBlock`, `.hero__seal-mobile`, `.price-panel__iva` sin estilo.
- Menú WhatsApp: título y subtítulo en **dos columnas** (el bug que v3 corrigió con grid) —
  `wa-menu-mobile-casas.png`, `wa-menu-informes-periciales.png`.
- FAB móvil tapa el enlace del hero: falta `@media (max-width:640px){.hero__freelink{padding-right:80px}}`.

Verificado leyendo el body de la respuesta dentro del navegador Playwright (`page.on('response')`) y
diffeando contra `assets/css/site.css`: el diff son exactamente las reglas v3 (grid del menú, padding
del freelink, use-cases, pricing tiers, seal-mobile, iva, radios legend).

**Acción (Anton, hPanel, 2 minutos):** Websites → tasacion.com.py → Performance → CDN → *Purge cache*
(o desactivar/reactivar el CDN). Verificar después en una ventana de incógnito que el menú WhatsApp
muestre subtítulo debajo del título y que las tarjetas "Quién firma" tengan checks chicos.

**Acción (sesión Sonnet, hardening):** en `build-site.mjs` emitir `site.css?v=<hash-del-contenido>`
y `site.js?v=<hash>` (hash sha1 corto del archivo al momento del build), y agregar a `verify.mjs`
que el HTML referencia el hash actual. Así el próximo zip nunca puede quedar detrás del CDN.
Opcional: `.htaccess` con `Cache-Control: max-age=300` para `/assets/css` y `/assets/js`.

Nota: `curl -A "<UA de Chrome>"` devuelve **403** del filtro anti-bot de Hostinger; para reproducir
hay que usar un navegador real o curl sin User-Agent.

## 1. Tabla pass/fail

| # | Check | Resultado | Detalle |
|---|---|---|---|
| 1 | v3 vivo: `GET /tasaciones/franja-de-dominio/` = 200 | ✅ PASS | 200; sitemap incluye las 15 rutas; títulos y canonicals = `routes.json` en las 15. |
| 2a | Capturas desktop + móvil 375 px, 15 páginas | ✅ hecho | 45 PNG en scratchpad; 7 clave copiadas a `docs/screenshots/audit-2026-09-11/`. |
| 2b | Sin "gratis" / "gratuit" / "sin costo" (texto + HTML) | ✅ PASS | 0 apariciones en las 15 páginas. |
| 2c | 4.168 y 3.738 solo dentro de las cadenas canónicas | ✅ PASS | 0 apariciones fuera de `CRED_CSJ`/`CRED_CSJ_CORTA`/`CRED_ARQ` (incluye JSON-LD `hasCredential`). |
| 2d | Nada de "aprobado/habilitado/registrado por el BCP" | ✅ PASS | Únicas menciones BCP: `CRED_BCP_FIRMA` y "la firma que exige el BCP" (FINALIDADES.credito). **Ver §2.4:** hipotecaria usa una paráfrasis corta. |
| 2e | Sin nombres de bancos; solo `CRED_BCP_BANCOS` | ✅ PASS | 0 hits de Ueno/Itaú/Continental/Sudameris/GNB/Familiar/Visión/Atlas/Interfisa/Basa/BNF/AFD. Cadena canónica presente en home, hipotecaria, franja, informes, nosotros. |
| 2f | Todo precio Gs. lleva "+ IVA" | ✅ PASS | Único nodo sin IVA es `EJEMPLO` (Gs. 400.000.000 / 20.000.000), excepción prevista en §3 del prompt. |
| 2g | Gate FERBRIEF §3: tasas, LTV, AFD, "48 h", "en minutos" | ✅ PASS | 0 hits. |
| 3a | Menú WA en ≥3 páginas, 5 opciones, contexto de página | ✅ PASS | Probado en 6 páginas (home, hipotecaria, franja, vender, informes, casas). Las 5 opciones × 6 páginas: el mensaje lleva "vengo de la página de <ctx>". Preselección correcta (informe / credito / consulta / valoracion). |
| 3b | Header sin "()" vacío | ✅ PASS | `Hola, vengo de tasacion.com.py (Inicio) y quiero información…` en pill y round, todas las páginas. |
| 3c | Hueco de barrio `______` | ✅ PASS | Presente en opciones 1–4; franja usa "Cantidad aproximada de lotes: ______"; "consulta" sin hueco (por diseño). |
| 3d | Click real abre WhatsApp con el texto correcto | ✅ PASS (29/30) | 29 clicks aterrizaron en `api.whatsapp.com/send/?phone=595995628862&text=…` con el texto exacto del href; 1 timeout de red (franja/judicial) no reproducible — el href es correcto. |
| 3e | Título/subtítulo apilados (fix v3 §4) | ❌ FAIL (CDN) | Computed `display:flex`, dos columnas. Causa: §0. El CSS del repo es correcto. |
| 4 | FAB móvil no tapa el CTA del hero (375×812) | ❌ FAIL (CDN) | Tapa el `.hero__freelink` en `/tasaciones/`, casas, terrenos, locales; en hipotecaria tapa la esquina del **botón primario** (y 778–830 vs FAB 740–796). Causa: §0. **Además ver §2.5**: en hipotecaria el primario queda al borde del fold aun con CSS correcto. |
| 5 | JSON-LD Offer judicial en `/informes-periciales/` y verticales | ❌ FAIL (código) | `/informes-periciales/` **no emite ningún `Service`/`Offer`** (solo FAQPage + ProfessionalService). Sigue siendo el leftover conocido. Ver §2.1 y §2.2. |
| 6 | Franja no reutiliza la foto de terrenos | ❌ FAIL (contenido) | Usa `tasacion-terrenos-paraguay-640.avif`, la misma que `/tasaciones/terrenos/`. Leftover conocido, confirmado. |
| 7a | 404 propio | ✅ PASS | `/no-existe-xyz/` → 404 con "Página no encontrada \| Tasación.com.py". |
| 7b | www → apex | ✅ PASS | `https://www…/` y `https://www…/tasaciones/casas/` → 301 a apex; `http://` → 301 https. `http://www` da un 301 intermedio a `https://www` y luego a apex (dos saltos, aceptable). |
| — | Scroll horizontal móvil | ✅ PASS | 0 px en las 15. |
| — | Imágenes rotas | ✅ PASS | 0. og:image 200. |
| — | robots / sitemap | ✅ PASS | robots permite todo salvo lead-forward/leads.log/gracias; sitemap = 15 rutas. |

## 2. Defectos para una sesión Sonnet (no tocar content.mjs desde acá)

### 2.1 JSON-LD: `/informes-periciales/` sin `Service`/`Offer` (leftover v3)
La página hub de precios no emite `Service` ni `Offer`. Debe emitir un `Service` con tres `Offer`
(compraventa 800.000–1.500.000, judicial 1.800.000–2.500.000, crédito minPrice 1.500.000 sin max),
`priceCurrency: PYG`, tomando los valores de `PRECIOS` (única fuente). Lo mismo para
`/tasaciones/corporativa/` y `/tasaciones/campos/` si el `priceBlock` de esas páginas muestra las filas judicial/crédito.

### 2.2 JSON-LD contradice el precio visible en `/tasaciones/hipotecaria/` (nuevo)
El `Service.offers` dice `minPrice 800000, maxPrice 1500000` mientras la página publica
"desde Gs. 1.500.000 + IVA" para crédito. El renderer usa `PRECIOS.compraventa` para todas las
verticales; hipotecaria debe usar `PRECIOS.credito` (`minPrice: 1500000`, sin `maxPrice`). Riesgo de
rich result engañoso. `verify.mjs` debería comparar el Offer de cada página con su `priceBlock`.

### 2.3 Opciones del menú WA abren en la misma pestaña
`.wa-menu__option` no tiene `target="_blank" rel="noopener"`; el hero, el FAB y la pill sí lo tienen.
En desktop el visitante sale del sitio a WhatsApp Web y pierde la página. Agregar el atributo en
`build-site.mjs:132` y una aserción en `tests/wa-menu.mjs`. (En móvil no cambia nada.)

### 2.4 Paráfrasis de la cadena canónica F4 en hipotecaria
Texto vivo: "incluye la firma del **tasador inscripto en el BCP**; te confirmamos el monto exacto…"
(fila de crédito del `priceBlock`). La canónica es "tasador inscripto en el **registro del** BCP".
No viola el gate (no dice habilitado/aprobado), pero el prompt §1 exige copiar textual y el gate
de `verify.mjs` no lo detectó porque solo busca las frases prohibidas. Corregir el string en
`content.mjs` y hacer que `verify.mjs` rechace `inscripto en el BCP` sin "registro del".

### 2.5 Hero de hipotecaria demasiado largo en móvil (CRO)
A 375×812 el párrafo intro tiene 10 líneas y el botón primario "Pedir mi tasación para crédito"
arranca en y=778 (fold = 812): queda casi fuera de pantalla y bajo el FAB. Es la landing con
mejor intención de compra (crédito). Sugerencia: recortar la intro a 3–4 líneas y mover la frase de
`CRED_CSJ` + `CRED_BCP_BANCOS` al bloque "Quién firma" (ya está ahí). Comparar: casas tiene el
primario en y=620.

### 2.6 Franja de dominio reutiliza la foto de terrenos
Confirmado (§1 fila 6). Necesita una foto propia (obra vial / franja / relevamiento) vía
`build-images.mjs` + webimg. Mientras tanto no rompe nada.

### 2.7 Cache-busting de assets (hardening del §0)
Ver §0. Es la única forma de que el problema de hoy no se repita en cada zip.

## 3. Contradicciones con las cadenas canónicas (prompt v3 §1) y el gate FERBRIEF §3

- **Ninguna** violación del gate: no hay "gratis", bancos, "aprobado/habilitado por el BCP", tasas,
  LTV, AFD ni "48 h".
- Una **paráfrasis** (2.4): "tasador inscripto en el BCP" en lugar de "…en el registro del BCP".
- Un **dato estructurado inconsistente** (2.2): Offer de hipotecaria con rango compraventa.
- Google todavía muestra el snippet viejo del home: "…valuación **gratuita** para vender e informes
  periciales certificados" (visto en SERP el 11-sep). No es el sitio: es el índice. Ver §4.1.

## 4. Fuera del prompt: lo que más va a traer tasaciones (por orden de impacto)

1. **Purgar el CDN hoy** (§0). Hasta que se purgue, cada visitante ve una página rota con íconos
   gigantes: es el mayor freno a la conversión que existe ahora mismo, y es gratis de arreglar.
2. **Search Console + reindexación.** El snippet de Google del home todavía dice "valuación
   gratuita". Mientras Google muestre eso, seguirán entrando leads "gratis" aunque el sitio ya no lo
   diga. Falta la verificación DNS TXT (pendiente desde el 10-sep); con eso: *Inspección de URL →
   Solicitar indexación* para `/`, `/valuacion-para-vender/`, `/informes-periciales/`, `/tasaciones/hipotecaria/`.
3. **GA4 sigue vacío** (`ANALYTICS_ID = ''` en el HTML vivo). Los eventos `wa_click` con
   `data-ev-loc` (hero / fab / menu / pricing_tier / band) ya están instrumentados pero no se
   registran en ningún lado. Sin esto no se puede saber qué finalidad convierte ni optimizar Google
   Ads por conversión. Es pegar un ID y rebuild.
4. **Google Ads: URLs finales.** Sigue pendiente retargetear las campañas fuera de
   `/valuacion-para-vender/` (causa raíz de los leads gratis). Con el menú por finalidad ya vivo,
   una campaña por finalidad → landing por finalidad (crédito → hipotecaria; sucesión →
   informes-periciales; compra/venta → home o vertical) y mensaje WA preseleccionado.
5. **Google Business Profile.** "Tasador" y "tasación de inmuebles asunción" son búsquedas con
   local pack. El sitio tiene `ProfessionalService` sin `address` ni `geo` (a propósito: no hay
   dirección confirmada). Un perfil GBP con categoría "Tasador de bienes raíces", el número de
   WhatsApp y 2–3 reseñas (pregunta 8 del brief a Fer) es el canal orgánico más barato que falta.
   Skill disponible: `gbp-optimizer`.
6. **Prueba social = cero** (ya en FERBRIEF §3). Una foto de trabajo + una página de informe
   tachada + 2 reseñas con nombre desbloquean un bloque "Así se ve el informe" en
   `/informes-periciales/`. Es lo único que un competidor de Clasipar no muestra.
7. **Corregir 2.2 antes de que Google lo lea:** el rich result de hipotecaria con "desde 800.000"
   atrae al cliente equivocado a la página de crédito.
8. **Menor:** el `<link rel=preload as=style>` y el `<link rel=stylesheet>` de Google Fonts están
   duplicados (dos descargas del mismo CSS); fuentes locales o un solo link ahorran ~1 request
   render-blocking en móvil.

## 5. Método (reproducible)

- `scratchpad/audit.mjs` (crawl 15 rutas, capturas, greps, FAB, JSON-LD) y un segundo script para
  el menú WA (5 clicks reales por página, captura de la URL de `api.whatsapp.com`).
- Verificación del CDN: `page.on('response')` → `response.text()` de `site.css` → diff con repo.
- Playwright falla con `networkidle` en este sitio (beacon permanente) → usar `load` + 800 ms.
- La red del sandbox de Claude Code está bloqueada; los scripts corrieron con sandbox desactivado.
