# v3 — addendum de diseño (canvas 2026-09-10)

Complementa `prompts/v3-credenciales-y-finalidades.md` §3.x/§5/§6. Cuando este archivo y la
spec difieren en un número, manda este archivo. Canvas de referencia (7 artboards):
https://claude.ai/code/artifact/657cfccb-dab7-4385-8a6c-7580ade42a22 — no hace falta abrirlo:
todo lo visual está acá en valores exactos. Tokens: los de `assets/css/site.css` (`--navy`
#0F3D5C, `--gold` #A98B57, `--base` #FAF9F7, `--surface` #FFFFFF, `--hairline` #E2DFD9,
`--navy-tint` #E6EDF2, `--gold-tint` #F3EDE1, `--gold-line` #E6D9BF, `--ink-muted` #5C6773).
Se aplica en PR-2 (o en PR-1 si todavía no se abrió).

## 1. `.pricing-tiers` — tres tarjetas por finalidad (`/informes-periciales/`, `id="precios"`)

- Banda: `background:var(--surface); border-top/bottom:1px solid var(--hairline); padding:72px 0 64px`.
  Cabecera (eyebrow "Precio por finalidad" + H2 + lede 19px, `max-width:720px`) y `gap:40px` hasta
  la grilla. H2 del canvas: "Tres informes, un precio claro para cada uno"; lede: "El costo depende
  de para qué lo necesitás, no del tamaño de tu casa. Elegí tu caso y hablamos por WhatsApp."
- Grilla: `display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; align-items:stretch`;
  ≤900px: `grid-template-columns:1fr; gap:16px`.
- Tarjeta `.tier`: `display:flex; flex-direction:column; gap:20px; padding:28px 28px 24px;
  background:var(--surface); border:1px solid var(--hairline); border-radius:var(--r-md)`.
  Resaltada `.tier--featured` (Compra o venta): `border-top:3px solid var(--navy); box-shadow:var(--shadow-1)`.
  ≤640px: `padding:22px 20px 20px; gap:16px`.
- Cabecera de tarjeta (`gap:10px`): chip "Lo más pedido" solo en la resaltada —
  `display:inline-flex; align-items:center; gap:8px; padding:5px 12px 5px 10px; border-radius:999px;
  background:var(--gold-tint); border:1px solid var(--gold-line); font:600 12px/1 var(--font-text);
  text-transform:uppercase; letter-spacing:.1em; color:var(--ink)` con punto oro 6px. En las otras
  dos, eyebrow de texto plano: `font:500 12px; uppercase; letter-spacing:.1em; color:var(--ink-muted)`
  ("Hipotecario o fiduciario" / "Informe pericial"). H3 22px `line-height:1.2; letter-spacing:-.012em`
  (21px en móvil). Descripción 15px/1.55 muted = `FINALIDADES[].corto`.
- Bloque de precio: `padding:16px 0; border-top/bottom:1px solid var(--hairline); gap:4px`.
  Cifra `font-family:var(--font-display); font-weight:700; font-size:26px; line-height:1.15;
  letter-spacing:-.01em` (24px móvil), texto "Gs. 800.000 a 1.500.000" (sin repetir "Gs." en el
  segundo término dentro de la tarjeta; el gate acepta ambas formas si se ajusta la regex — si no,
  usar `PRECIO_TXT` textual). Debajo 15px muted: `${IVA_TXT} · ${nota corta}` — notas: "según tipo y
  tamaño del inmueble" / "incluye la firma que tu banco o cooperativa exige" / "informe más detallado,
  para presentar en el juzgado".
- Filas Firma/Plazo: 14px/1.5, etiqueta en `--ink-muted`, valor en `--ink`, `gap:8px`.
- Lista "Incluye": 4 ítems, 15px/1.45, `gap:10px`, check en círculo navy 18px (`ICON_CHECK` dentro de
  un círculo `stroke:var(--navy) 1.6`) con `margin-top:2px`.
- Botón: `margin-top:auto`. Resaltada: `.btn--primary` con glyph WA. Otras dos: `.btn--ghost` con
  flecha → a la derecha. En móvil los tres `width:100%`.
- Pie de banda: `display:flex; flex-wrap:wrap; gap:12px 32px; padding-top:8px; font-size:14px;
  color:var(--ink-muted)`, tres frases con check 16px: `FACTURA_TXT` · `PRECIO_NOTA` (en mayúscula
  inicial) · "Si vendés con un corredor asociado, el costo se descuenta de la comisión al cerrar la
  venta". En móvil, una sola `<p>` 13px separada por " · ".

## 2. `.use-cases` — finalidades (home después de la fila de confianza; hub; informes)

- Sección sobre `--base`, `padding:72px 0`, cabecera eyebrow "Finalidades" + H2 "¿Para qué necesitás
  la tasación?", `gap:36px` hasta la grilla.
- Grilla: `repeat(4,minmax(0,1fr)); gap:20px` en ≥1100px; `repeat(2,minmax(0,1fr))` entre 700 y 1100;
  `1fr` en ≤700.
- Tarjeta = `<a class="card">` entera: `gap:12px; padding:24px`. Orden: icono en tile
  (`width/height:40px; border-radius:10px; background:var(--navy-tint)`; SVG 22px stroke navy 1.6 —
  casa / edificio-banco / balanza / ruta) → eyebrow 12px 500 uppercase `.1em` muted ("Lo más pedido"
  / "Hipotecario o fiduciario" / "Informe pericial" / "Para empresas") → H3 19px → párrafo 15px/1.55
  muted con `flex-grow:1` → `.link` 14px 600 navy con flecha. La 4ª (franja de dominio) es
  `.card--muted` con tile `--gold-tint` e icono oro.
- Copy exacto de las cuatro tarjetas: ver canvas / spec §5.1 (los títulos son "Vas a comprar o
  vender", "Vas a pedir un crédito", "Estás en una sucesión o un juicio", "¿Sos empresa o consorcio
  vial?").

## 3. `.credentials` — quién firma

- Banda `--surface` con hairlines arriba/abajo, `padding:64px 0`. Grid 12, `gap:32px`,
  `align-items:start`: izquierda `span 7`, derecha `span 5`; ≤900px una columna.
- Izquierda: eyebrow "Quién firma tu informe" + H2 "Tasador Fernando Capurro" + párrafo 17px/1.6
  muted ("El mismo profesional que visita el inmueble firma el informe. Dos matrículas vigentes,
  publicadas para que las verifiques."), luego dos filas de credencial con `gap:16px`:
  `display:flex; align-items:flex-start; gap:16px; padding:18px 20px; background:var(--base);
  border:1px solid var(--hairline); border-radius:var(--r-md)`; icono sello 40px (círculo oro
  `stroke 2` + círculo interior punteado + check navy 2.2 — NO el `ICON_SEAL` relleno), título
  17px 600 = `CRED_CSJ` / `CRED_ARQ` (la línea de matrícula puede ir como segunda línea 14px muted
  si el título queda largo: "Matrícula N.º 4.168 · sucesiones, remates judiciales, liquidaciones" y
  "Relevamiento, medición y análisis técnico del inmueble").
- Derecha: tarjeta navy `padding:28px; border-radius:var(--r-lg)` (20px en móvil) con eyebrow
  `--on-dark` "Para crédito", párrafo 17px `--on-dark` = `Para crédito, ${CRED_BCP_FIRMA}.` y
  párrafo 15px `--on-dark-muted` = `CRED_BCP_BANCOS`. Debajo, lista de 3 líneas 15px con check navy
  18px, `gap:10px`: `Informe firmado en ${PLAZO_TXT}` · `FACTURA_TXT` · "Precio anclado por
  finalidad, antes de la visita".

## 4. `.value-block` — por qué conviene

- Sección `--base`, `padding:72px 0`. Grid 12 `gap:32px`: izquierda `span 4` `position:sticky;
  top:96px` (eyebrow "Por qué conviene" + H2 34px + lede 17px/1.6); derecha `span 8` lista `<ol>`
  sin marcadores. ≤900px: una columna, sin sticky.
- Ítem: `display:grid; grid-template-columns:56px minmax(0,1fr); gap:20px; padding:24px 0;
  border-top:1px solid var(--hairline)`; el último además `border-bottom`. Número: círculo 32px navy,
  `font-weight:700; font-size:15px; color:var(--on-dark)`. H3 20px/1.25; párrafo 16px/1.6 muted
  `max-width:64ch`.
- Versión corta (`short:true`, verticales): mismos estilos, ítems 1–3, sin lede (solo eyebrow + H2).

## 5. Menú WhatsApp — opción en grid (arregla el bug de columnas)

```css
.wa-menu__option{display:grid;grid-template-columns:8px minmax(0,1fr);column-gap:12px;align-items:start;min-height:52px;padding:9px 12px;border-radius:10px}
.wa-menu__option::before{margin-top:7px}
.wa-menu__opt-title{font-size:15px;line-height:1.35}
.wa-menu__opt-sub{font-size:13px;line-height:1.35}
.wa-menu__list{display:flex;flex-direction:column;gap:2px;padding:0 8px}
.wa-menu__head{padding:16px 18px 10px}
.wa-menu__foot{margin-top:6px}
```
Con cinco opciones el panel mide ≈ 470px en 390×844 con `bottom:88px`: entra sin scroll.
La opción resaltada mantiene `--navy-tint` + punto oro + título navy 600; las demás título 500.

## 6. Hero móvil — FAB y sello

- `@media (max-width:640px){ .hero__freelink{padding-right:80px} }` — el FAB (56px a 16px del
  borde) ya no tapa el enlace. Playwright: sin intersección de bounding boxes a 390×844.
- Chip de oferta móvil (variante estándar): línea 1 "Informe oficial de tasación" con punto oro,
  línea 2 13px muted "firmado en 3 a 5 días hábiles después de la visita" (`PLAZO_TXT`).
- Sello compacto bajo la línea chica, solo ≤900px (reemplaza al `.hero__seal` oculto):
  `display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--surface);
  border:1px solid var(--hairline); border-radius:var(--r-md)`; icono sello 36px (mismo dibujo que
  §3); línea 1 14px 600 "Firmado por perito matriculado"; línea 2 13px muted
  "Fernando Capurro · CSJ Mat. 4.168 · Arq. Mat. 3.738". Los números solo pueden aparecer si el gate
  los acepta dentro de esta cadena — agregarla a la lista de cadenas canónicas permitidas
  (`CRED_SELLO_CORTA`).
- Botón fantasma del hero en móvil: `align-self:flex-start` (no `width:100%`); el primario sí
  `width:100%`.
- Fila de confianza móvil: tres líneas 14px muted con check 16px, `gap:10px`, `padding:24px 20px`,
  textos = §5(e) de la spec (`CRED_CSJ` completa en la primera).

## 7. Precios en las verticales (`priceBlock`)

Sin cambio de componente: panel navy como hoy, pero las tres filas son las finalidades (§5.3 de la
spec) y la cifra grande lleva `IVA_TXT` en 15px `--on-dark-muted` debajo, no en la misma línea.
