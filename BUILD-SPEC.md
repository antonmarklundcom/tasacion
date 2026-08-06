# BUILD-SPEC — tasacion.com.py · MODO 3.5 CORE 15

**Läge 0-output.** Ingen kod skrivs i det här dokumentet. Nästa session
implementerar detta exakt.

Exekveringsprompt: *"Implementera BUILD-SPEC.md exakt. Avvik inte. Fråga vid
oklarhet istället för att gissa."*

Källor: `paraguay-local-site` §0.5/§3/§9/§10, `web-design-system` steg 1–7,
befintlig `index.html` (TRACK PA · ESTUDIO), `PLACEHOLDERS.md`.

---

## 0. INTAKE (§0, ifyllt)

```
NEGOCIO:        Tasación.com.py            ← domänen ÄR varumärket (§10.1)
OFICIO:         Tasador de inmuebles / valuación inmobiliaria
CIUDAD:         Asunción + Departamento Central
BARRIOS:        Villa Morra · Carmelitas · Las Mercedes · Sajonia · San Vicente · Barrio Jara
ZONAS:          Asunción, Luque, San Lorenzo, Fernando de la Mora, Lambaré,
                Capiatá, Mariano Roque Alonso (+ Interior som specialfall)
WHATSAPP:       +595 995 628862          ⚠️ delat stage-1-nummer, ej dedikerat
TELÉFONO FIJO:  saknas                   ⚠️ finns inget — ingen rad skrivs
SERVICIOS:      1) tasación online sin costo
                2) informe formal de tasación
                3) tasación de casas y departamentos
                4) tasación de terrenos
                5) tasación de locales comerciales
DIFERENCIAL:    rango de valor sin costo por WhatsApp, sin visita a oficina,
                med förklaring av HUR rangen räknats fram — inte bara ett tal
CONFIANZA:      RUC ⚠️ SAKNAS · factura legal ⚠️ EJ BEKRÄFTAD ·
                matrícula/reg. prof. ⚠️ SAKNAS · años ⚠️ SAKNAS ·
                garantía ⚠️ SAKNAS · habilitación BCP: MEDVETET FRÅNVARANDE
RESEÑAS:        INGA — ersättningsstack enligt §5 används på varje sida
FOTOS:          7 genererade illustrativa bilder + 1 OG. Inga egna jobbfoton.
                Ingen `proof-photo`-slot får fyllas.
CONVERSIÓN:     whatsapp-first
DISEÑO:         TRACK PA · ESTUDIO (låst, se §2 nedan — kopieras oförändrat)
PRECIOS:        INGA publicerade belopp. "Presupuesto sin costo" som CTA.
PAGOS:          ⚠️ ej bekräftat vilka metoder som tas emot → ingen betalrad
                skrivs på någon sida
```

### Antaganden som exekveringen INTE får bygga bort

| ⚠️ | Antagande | Konsekvens i bygget |
|---|---|---|
| ⚠️1 | Inget RUC finns ännu | Raden existerar inte på någon sida. Ingen `legalName` i JSON-LD. |
| ⚠️2 | Ingen matrícula/registro profesional | Ingen förtroendesektion om behörighet. Ingen `hasCredential`. |
| ⚠️3 | Inte habilitado av BCP | **Ordet "banco", "hipoteca", "crédito hipotecario" får inte förekomma på någon av de 15 sidorna.** Detta är en hård regel, inte en stilfråga. |
| ⚠️4 | Inga reseñas | Ingen `aggregateRating`, inga citat, ingen "nuestro equipo". |
| ⚠️5 | Inga öppettider bekräftade | Ingen `openingHours`, ingen "respondemos en X minutos". |
| ⚠️6 | Ingen prisgrid | Inga Gs.-belopp någonstans. Se §7 om `/cotizador/`. |
| ⚠️7 | Guide-ämnena är valda på branschlogik, **inte** ur en KWP-export | Ämnena i §8 är byggbara som de står, men bör verifieras mot en riktig KWP-export innan sida 16+ planeras. |
| ⚠️8 | venderCRM saknar domän och nyckel | Alla formulär pekar på `lead-forward.php`, som redan har fallback-loggning. Ingen ny endpoint skapas. |
| ⚠️9 | Delat WhatsApp-nummer | `WA_NUMBER`-konstanten måste finnas överst i **varje** ny HTML-fil, exakt som i `index.html`. |

---

## 1. FILTRÄD (exakta filnamn)

```
/
├── index.html                                  ← FINNS. Ändras endast enligt §11.
├── gracias.html                                ← FINNS. Ändras endast enligt §11.
├── lead-forward.php                            ← FINNS. Ändras INTE.
├── robots.txt                                  ← uppdateras (§11)
├── sitemap.xml                                 ← skrivs om (§11)
├── 404.html                                    ← NY
├── assets/
│   ├── img/                                    ← FINNS, 8 assets. Inga nya krävs.
│   ├── css/site.css                            ← NY (§2.3)
│   └── js/site.js                              ← NY (§2.4)
├── servicios/
│   ├── tasacion-online/index.html              ← NY
│   ├── tasacion-de-casas-y-departamentos/index.html  ← NY
│   ├── tasacion-de-terrenos/index.html         ← NY
│   ├── tasacion-de-locales-comerciales/index.html    ← NY
│   └── informe-de-tasacion/index.html          ← NY
├── zonas/
│   ├── luque/index.html                        ← NY
│   ├── san-lorenzo/index.html                  ← NY
│   ├── fernando-de-la-mora/index.html          ← NY
│   └── interior/index.html                     ← NY
├── cotizador/index.html                        ← NY
├── contacto/index.html                         ← NY
├── preguntas-frecuentes/index.html             ← NY
└── guias/
    ├── que-es-una-tasacion-inmobiliaria/index.html   ← NY
    └── documentos-para-tasar-un-inmueble/index.html  ← NY
```

Mappar med `index.html` ger rena URL:er utan serverkonfiguration på Hostinger
shared. Alla interna länkar skrivs med avslutande slash: `/servicios/tasacion-de-terrenos/`.

**14 nya sidor + befintlig home = CORE 15.**

---

## 2. DESIGN — TRACK PA · ESTUDIO (kopieras ordagrant, tolkas aldrig)

Detta är en **utbyggnad**, inte en omdesign. Varje värde nedan är kopierat ur
`index.html` rad 49–86. Inget nytt token får uppfinnas, ingen hex ändras.

### 2.1 Tokens — klistras in oförändrat i `assets/css/site.css`

```css
:root{
  --font-display:'Libre Baskerville',Georgia,serif;
  --font-text:'Inter',system-ui,-apple-system,sans-serif;

  --base:#FAF9F7;
  --surface:#FFFFFF;
  --ink:#12181F;
  --ink-muted:#5C6773;
  --accent:#0F3D5C;
  --accent-tint:#E6EDF2;
  --gold:#A98B57;
  --hairline:#E2DFD9;

  --on-dark:#FAF9F7;
  --on-dark-muted:rgba(250,249,247,.78);
  --hairline-dark:rgba(250,249,247,.16);

  /* type scale, ratio 1.30, base 17px */
  --t--1:.812rem; --t-0:1.0625rem; --t-1:1.383rem; --t-2:1.797rem;
  --t-3:2.336rem; --t-4:3.037rem;  --t-5:3.948rem; --t-6:5.133rem;
  --measure:65ch;

  --s-1:.25rem; --s-2:.5rem; --s-3:.75rem; --s-4:1rem;
  --s-6:1.5rem; --s-8:2rem; --s-12:3rem; --s-16:4rem;
  --s-24:6rem; --s-32:8rem;

  --r-sm:6px; --r-md:14px; --r-lg:28px;

  --shadow-1:0 1px 2px rgb(18 24 31/.05), 0 4px 12px rgb(18 24 31/.06);
  --shadow-2:0 2px 4px rgb(18 24 31/.07), 0 16px 40px rgb(18 24 31/.11);

  --ease-out:cubic-bezier(.16,1,.3,1);
  --ease-io:cubic-bezier(.4,0,.2,1);
  --dur-fast:180ms; --dur:280ms; --dur-slow:400ms;

  --gutter:24px;
  --bleedw:100vw;
}
```

### 2.2 Typsnitt — exakt samma länkblock som `index.html`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Libre+Baskerville:wght@700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Libre+Baskerville:wght@700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Libre+Baskerville:wght@700&display=swap"></noscript>
```

Två familjer, inga fler. `Libre Baskerville 700` är display, `Inter 400/500`
är text. Ingen tredje vikt laddas.

### 2.3 `assets/css/site.css` — vad som flyttas dit

Klipp **hela** `<style>`-blocket ur `index.html` (rad 48–486) till
`assets/css/site.css`, utan en enda ändring av selektorer eller värden.
`index.html` behåller kvar följande som inline kritisk CSS och laddar resten
med `<link rel="stylesheet" href="/assets/css/site.css">`:

- `:root`-blocket
- `*,*::before,*::after`, `html`, `body`, `h1,h2,h3,.statement`, `p`, `a`, `img`
- `.wrap`, `section`, `.bleed`, `.eyebrow`, `.lede`
- `.hdr`, `.hdr__in`, `.wordmark`, `.hdr__tel`
- `.hero`, `.hero__grid`, `.hero__media`, `.hero__figure`
- `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--wa`

Samma kritiska delmängd inlineas i **varje** ny sida. Allt övrigt kommer från
`site.css`. Detta är enda tillåtna strukturförändringen i `index.html`s CSS —
den får inte samtidigt användas för att "förbättra" något värde.

**Nya klasser som får läggas till i `site.css`** (och bara dessa):

| Klass | Syfte | Definition |
|---|---|---|
| `.crumbs` | breadcrumb-rad | `font-size:.8125rem;letter-spacing:.04em;color:var(--ink-muted);padding-block:var(--s-6) 0;display:flex;flex-wrap:wrap;gap:.5em;align-items:center` |
| `.crumbs a` | | `color:var(--ink-muted);text-decoration:none;border-bottom:1px solid var(--hairline)` |
| `.crumbs a:hover` | | `color:var(--accent);border-bottom-color:var(--gold)` |
| `.crumbs [aria-current]` | | `color:var(--ink)` |
| `.nav` | desktop-nav i headern | `display:none;gap:var(--s-6);margin-right:auto;margin-left:var(--s-8)` · `@media (min-width:1024px){.nav{display:flex}}` |
| `.nav a` | | `font-size:.9375rem;font-weight:500;color:var(--ink);text-decoration:none;min-height:48px;display:inline-flex;align-items:center` |
| `.nav a:hover,.nav a[aria-current]` | | `color:var(--accent);box-shadow:inset 0 -1px 0 var(--gold)` |
| `.prose` | löptextkolumn i guider | `max-width:68ch` |
| `.prose h3` | | `margin-top:var(--s-12)` |
| `.linkgrid` | intern länkning i botten | `display:grid;gap:var(--s-4);margin-top:var(--s-8)` · `@media (min-width:640px){grid-template-columns:1fr 1fr}` · `@media (min-width:1024px){grid-template-columns:repeat(3,1fr)}` |
| `.linkgrid a` | | `display:block;padding:var(--s-6);border:1px solid var(--hairline);border-radius:var(--r-md);background:var(--surface);text-decoration:none;color:var(--ink);font-weight:500;transition:transform var(--dur-fast) var(--ease-io),box-shadow var(--dur-fast) var(--ease-io)` |
| `.linkgrid a:hover` | | `transform:translateY(-4px);box-shadow:var(--shadow-2)` |
| `.linkgrid span` | undertext i kortet | `display:block;margin-top:var(--s-2);font-weight:400;font-size:.875rem;color:var(--ink-muted)` |

Inga andra nya klasser. Behöver en sektion något som inte finns — återanvänd
en befintlig komponent, ändra inte tokens.

### 2.4 `assets/js/site.js`

Innehåller, i denna ordning, **kopierat ordagrant** ur `index.html`:

1. Analytics-shim (`dataLayer`-push på `[data-ev]`)
2. `motion.js` från `web-design-system/references/motion.js` (redan inline i `index.html`, rad ~1120–1178)
3. Sidskriptet: WA_NUMBER-omskrivning, `--bleedw`-mätning, `page_url`, `#yr`, consent

Kvalificeraren (`#q-send`/`#q-preview`-blocket) flyttas **inte** hit — den är
sidspecifik och bor på `/` och `/cotizador/`. Skriptet ska tåla att de
elementen saknas (det gör det redan; guarden `if (send && preview)` finns).

`WA_NUMBER` deklareras fortfarande överst i varje HTML-fil, före `site.js`:

```html
<script>var WA_NUMBER = '595995628862';</script>
```

### 2.5 Gemensam header och footer

Identiska på alla 15 sidor, med två tillägg mot dagens `index.html`:

- `.wordmark` länkar till `/` (inte `#main`) på undersidor.
- En `.nav` läggs till mellan wordmark och telefonlänken:
  `Servicios` → `/servicios/tasacion-online/` ·
  `Zonas` → `/zonas/luque/` ·
  `Cotizador` → `/cotizador/` ·
  `Preguntas` → `/preguntas-frecuentes/` ·
  `Contacto` → `/contacto/`
  Aktuell sida får `aria-current="page"`.
- Footerns `.ftr__nav` byter från ankarlänkar till de riktiga sidorna:
  Tasación online · Casas y departamentos · Terrenos · Locales comerciales ·
  Informe de tasación · Cotizador · Zonas · Preguntas frecuentes · Contacto.
  På `/` behålls dessutom ankarlänkarna till sidans egna sektioner.

FAB, sticky mobilbar och consent-rutan kopieras oförändrade till alla sidor.

### 2.6 Motion-budget

`data-reveal` sätts på **högst 15 %** av elementen per sida — i praktiken:
korten i en grid (max 4, index 0–3) plus ett enstaka panelkort. Aldrig på
hero-text, aldrig på breadcrumbs, aldrig på brödtextstycken.

---

## 3. KEYWORD-MAPPNING — ett primärt sökord per sida

Regeln som avgör hela arkitekturen: **två sidor får aldrig sikta på samma
sökord.** Kolumnen "får INTE användas som H1" är lika bindande som H1-kolumnen.

| # | URL | Primärt sökord (ETT) | H1 (ordagrant) | Får INTE äga |
|---|---|---|---|---|
| 1 | `/` | tasación de inmuebles Asunción | `Tasación de inmuebles en Asunción` | typspecifika termer, ortnamn utanför Asunción |
| 2 | `/servicios/tasacion-online/` | tasación online | `Tasación online de inmuebles, sin costo` | "tasación de inmuebles Asunción" |
| 3 | `/servicios/tasacion-de-casas-y-departamentos/` | tasación de casas y departamentos | `Tasación de casas y departamentos` | "tasación de inmuebles" |
| 4 | `/servicios/tasacion-de-terrenos/` | tasación de terrenos | `Tasación de terrenos en Asunción y Gran Asunción` | "tasación de inmuebles" |
| 5 | `/servicios/tasacion-de-locales-comerciales/` | tasación de locales comerciales | `Tasación de locales comerciales` | "tasación de inmuebles" |
| 6 | `/servicios/informe-de-tasacion/` | informe de tasación | `Informe de tasación de inmuebles` | "tasación online" |
| 7 | `/zonas/luque/` | tasación de inmuebles en Luque | `Tasación de inmuebles en Luque` | Asunción-termer |
| 8 | `/zonas/san-lorenzo/` | tasación de inmuebles en San Lorenzo | `Tasación de inmuebles en San Lorenzo` | Asunción-termer |
| 9 | `/zonas/fernando-de-la-mora/` | tasación de inmuebles en Fernando de la Mora | `Tasación de inmuebles en Fernando de la Mora` | Asunción-termer |
| 10 | `/zonas/interior/` | tasación de inmuebles en el interior del país | `Tasación de inmuebles fuera del Gran Asunción` | enskilda ortnamn i H1 |
| 11 | `/cotizador/` | cuánto vale mi casa | `Cuánto vale tu propiedad: armá tu consulta en un minuto` | "tasación online" |
| 12 | `/contacto/` | contacto tasador Asunción | `Contacto` | allt transaktionellt |
| 13 | `/preguntas-frecuentes/` | preguntas frecuentes sobre tasación | `Preguntas frecuentes sobre tasación de inmuebles` | "tasación de inmuebles Asunción" |
| 14 | `/guias/que-es-una-tasacion-inmobiliaria/` | qué es una tasación inmobiliaria | `Qué es una tasación inmobiliaria` | allt transaktionellt |
| 15 | `/guias/documentos-para-tasar-un-inmueble/` | documentos para tasar un inmueble | `Qué documentos hacen falta para tasar un inmueble` | allt transaktionellt |

### 3.1 Varför det inte finns någon `/zonas/asuncion/`

`index.html` äger redan `tasación de inmuebles en Asunción` som H1. En
`/zonas/asuncion/`-sida hade siktat på exakt samma sökord och konkurrerat med
startsidan — precis det §10.4.1 förbjuder. **Startsidan ÄR Asunción-sidan.**
De tre zonsidorna är därför de tre största orterna i Gran Asunción efter
Asunción: Luque, San Lorenzo och Fernando de la Mora.

Lambaré, Capiatá och Mariano Roque Alonso nämns i löptext på `/zonas/interior/`
och i footern — de får **inga** grå chips och ingen tunn sida (§10.4).

### 3.2 Intern länkning (obligatorisk, inte valfri)

- Varje `/servicios/`-sida länkar till: de fyra andra servicios + `/cotizador/` + minst en `/zonas/`-sida i löptext.
- Varje `/zonas/`-sida länkar till: `/servicios/tasacion-de-casas-y-departamentos/`, `/servicios/tasacion-de-terrenos/`, `/cotizador/` och de två andra zonsidorna.
- Båda guiderna länkar till `/servicios/informe-de-tasacion/` och `/cotizador/` i löptext, aldrig bara i en botten-lista.
- `/` får en ny `.linkgrid`-sektion (§4.2) som länkar ut till alla fem servicios och de tre zonsidorna.
- Ingen sida länkar till sig själv i `.linkgrid`.

---

## 4. SIDMALLAR — sektionsordning + layoutmönster

Hårda krav per sida (kontrolleras i QA, §10): max 2 sektioner i rad med samma
mönster · ≥1 full-bleed · ≥1 overlap · ≥1 oversized statement · ≥3 kortvarianter
och ingen mer än 4×.

Kortvarianterna som finns: `.card--hair`, `.card--raised`, `.card--ink`,
`.card--accent`. Inga nya varianter skapas.

### 4.1 Gemensamt skelett — varje undersida

```
S0  header (sticky) + .crumbs                    ingen pattern
S1  hero                                          P1 asymmetric split 7/5
S2  franja de confianza                           P8 full-bleed ribbon .grain
...  sidspecifika sektioner (se 4.3–4.9)
Sn-2 statement                                    P9 oversized statement
Sn-1 länkgrid (intern länkning)                   .linkgrid
Sn  contacto-block                                P1 mirrored 5/7
    footer + FAB + mbar + consent
```

Franja de confianza bär **exakt** samma fyra verifierbara fakta som `index.html`
och inget mer:

```
Tasación sin costo · Sin visita a oficina · Respuesta por WhatsApp · Cobertura Gran Asunción
```

Kontaktblocket i botten är en **förkortad** variant av `index.html` §12: bara
`.card--ink .wa-block` med numret, sidspecifik WhatsApp-CTA och `tel:`-knapp.
Formuläret bor bara på `/` och `/contacto/` — det ska inte upprepas 15 gånger.

### 4.2 Ny sektion på `/` (enda innehållstillägget på startsidan)

Läggs in **mellan** sektion 10 (`#zonas`) och sektion 11 (`#faq`):

```html
<section id="paginas">  →  .linkgrid
```

- eyebrow: `Todo el sitio`
- H2: `Elegí por dónde seguir`
- 8 kort. Titel + undertext, ordagrant:

| Länk | Titel | `<span>`-undertext |
|---|---|---|
| `/servicios/tasacion-online/` | Tasación online | Cómo funciona el rango sin costo, paso por paso. |
| `/servicios/tasacion-de-casas-y-departamentos/` | Casas y departamentos | Qué se mide y qué pesa en una vivienda. |
| `/servicios/tasacion-de-terrenos/` | Terrenos | Frente, forma del lote y zonificación. |
| `/servicios/tasacion-de-locales-comerciales/` | Locales comerciales | Tránsito, frente y habilitación de uso. |
| `/servicios/informe-de-tasacion/` | Informe de tasación | Para sucesiones, divisiones y trámites judiciales. |
| `/zonas/luque/` | Luque | Loteamientos, zona aeropuerto y ruta a San Bernardino. |
| `/zonas/san-lorenzo/` | San Lorenzo | Zona universitaria, Ruta 2 y alquiler estudiantil. |
| `/zonas/fernando-de-la-mora/` | Fernando de la Mora | Zona Norte y Zona Sur, y por qué no valen igual. |

`/cotizador/`, `/preguntas-frecuentes/`, `/contacto/` och guiderna nås via
headern och footern — de behöver inte kort här.

### 4.3 `/servicios/tasacion-online/`

```
S1  hero                              P2 offset stack   ← INGEN bild (se §6)
S2  franja                            P8
S3  qué te devolvemos                 P3 staggered grid (3 kort: --accent, --hair, --hair)
S4  qué NO es                         P4 editorial two-column
S5  cotizador-inbjudan                P10 data panel (.card--raised på --ink-fält)
S6  proceso                           P5 numbered rail
S7  statement                         P9
S8  linkgrid                          —
S9  contacto                          P1 mirrored
```
Overlap: S5-panelen `translateY(40%)` in i S6. Full-bleed: S2 + S5-fältet.

### 4.4 `/servicios/tasacion-de-casas-y-departamentos/`

```
S1  hero                              P1 (7/5) — bild: tasacion-casas-departamentos-asuncion
S2  franja                            P8
S3  qué miramos en una casa           P7 sticky-side scroll (5 poster)
S4  banda full-bleed                  P6 bleed-image overlap — tasador-midiendo-propiedad-asuncion
S5  departamentos: qué cambia         P4 editorial two-column
S6  errores más comunes               P3 staggered grid (3 kort)
S7  statement                         P9
S8  linkgrid                          —
S9  contacto                          P1 mirrored
```
Overlap: `.card--raised.overlap` från S4 in i S5.

### 4.5 `/servicios/tasacion-de-terrenos/`

```
S1  hero                              P1 (5/7 speglad) — bild: tasacion-terrenos-paraguay
S2  franja                            P8
S3  los cinco factores del lote       P5 numbered rail (4 upp) + en femte i S4
S4  banda full-bleed                  P6 — bild: tasador-de-terrenos-gran-asuncion
S5  zonificación y uso                P4 editorial two-column
S6  loteamientos y cuotas             P3 staggered grid (2 kort, ett `--ink` spans 2)
S7  statement                         P9
S8  linkgrid                          —
S9  contacto                          P1 mirrored
```

### 4.6 `/servicios/tasacion-de-locales-comerciales/`

```
S1  hero                              P1 (7/5) — bild: tasacion-locales-comerciales-asuncion
S2  franja                            P8
S3  qué produce un local              P4 editorial two-column
S4  checklist del local               P3 staggered grid (4 kort: --accent, --hair ×3)
S5  banda de cita                     P8 full-bleed accent band (ingen bild, `--ink` + `.grain`)
S6  depósitos y galpones              P2 offset stack
S7  statement                         P9
S8  linkgrid                          —
S9  contacto                          P1 mirrored
```
Overlap: `.card--raised.overlap` från S5-bandet in i S6.

### 4.7 `/servicios/informe-de-tasacion/`

```
S1  hero                              P1 (7/5) — bild: informe-de-tasacion-linderos-paraguay
S2  franja                            P8
S3  cuándo hace falta un informe      P3 staggered grid (4 kort)
S4  qué contiene el informe           P7 sticky-side scroll (6 poster)
S5  qué necesitamos de vos            P4 editorial two-column + länk till guide 2
S6  cómo se cotiza                    P10 data panel (`.card--raised`, INGA belopp)
S7  statement                         P9
S8  linkgrid                          —
S9  contacto                          P1 mirrored
```
Overlap: S6-panelen in i S7.

### 4.8 Zonsidor — `/zonas/luque/`, `/zonas/san-lorenzo/`, `/zonas/fernando-de-la-mora/`

Samma skelett, men **inte** samma mönsterordning — annars ser de tre likadana ut:

| | Luque | San Lorenzo | Fernando de la Mora |
|---|---|---|---|
| S1 hero | P1 (7/5) | P2 offset stack | P1 (5/7 speglad) |
| S2 franja | P8 | P8 | P8 |
| S3 | barrios: P4 | barrios: P3 grid | barrios: P4 |
| S4 | banda: P6 (bild) | qué se tasa acá: P7 | banda: P6 (bild) |
| S5 | qué se tasa acá: P3 grid | banda: P6 (bild) | Norte vs Sur: P3 grid |
| S6 | logística: P2 | logística: P4 | logística: P2 |
| S7 statement | P9 | P9 | P9 |
| S8 linkgrid | — | — | — |
| S9 contacto | P1 mirrored | P1 mirrored | P1 mirrored |

### 4.9 Övriga

**`/zonas/interior/`** — kortare sida, inget hero-foto:
```
S1 hero P2 · S2 franja P8 · S3 cómo funciona fuera del Gran Asunción P4 ·
S4 banda P6 (bild: tasacion-terrenos-paraguay) · S5 qué sí podemos hacer siempre P3 grid ·
S6 statement P9 · S7 linkgrid · S8 contacto P1
```

**`/cotizador/`** — se §7. `S1 hero P2 · S2 franja P8 · S3 formulär P10 (huvudsektionen) ·
S4 qué hacemos con esto P4 · S5 statement P9 · S6 linkgrid · S7 contacto P1`.
Overlap: P10-panelen in i S4.

**`/contacto/`** — `S1 hero P2 · S2 franja P8 · S3 kontakt-split P1 mirrored 5/7
(WhatsApp-block + formulär, kopieras från `index.html` §12) · S4 cobertura P4 ·
S5 statement P9 · S6 linkgrid`. Full-bleed: S2. Overlap: WhatsApp-blocket
`translateY` in i S4 på ≥1024px.

**`/preguntas-frecuentes/`** — `S1 hero P2 · S2 franja P8 · S3 FAQ P4 (10 frågor,
`<details>`) · S4 banda P8 accentband · S5 statement P9 · S6 linkgrid · S7 contacto P1`.

**Guider** — `S1 hero P2 · S2 .crumbs+prose P4 (löptext, `.prose`) · S3 inline
`.card--accent` mitt i texten · S4 banda P8 · S5 statement P9 · S6 linkgrid ·
S7 contacto P1`. Ingen bild — guider bär sin vikt med typografi (`.statement`
och oversized `.factor__n`-nummer).

---

## 5. FÄRDIG COPY, ORDAGRANT

Voseo genomgående. Ingen "tú"-form, ingen engelska, inga siffror som inte är
sanna. Där en rubrik står nedan ska exakt den texten användas.

---

### 5.1 `/servicios/tasacion-online/`

**title:** `Tasación online de inmuebles sin costo | Tasación.com.py`
**meta description:** `Tasación online de inmuebles en Asunción y Gran Asunción. Mandanos los datos de tu propiedad por WhatsApp y te devolvemos un rango de valor con la explicación de cómo llegamos a él. Sin costo.`

**S1 hero**
- eyebrow: `Servicio · Sin costo`
- H1: `Tasación online de inmuebles, sin costo`
- lede: `Nos contás lo que ya sabés de tu propiedad y te devolvemos un rango de valor con la explicación de cómo llegamos a él. No hace falta que vengas a una oficina, no pedimos tarjeta y no hay nada que firmar para recibirlo.`
- CTA primär: `Pedí tu rango por WhatsApp` · CTA sekundär: `Armar mi consulta` → `/cotizador/`
- under CTA: `O llamanos: 0995 628 862`

**S3 — Qué te devolvemos**
- eyebrow: `Qué recibís`
- H2: `Un rango, y de dónde sale ese rango`
- Kort 1 `.card--accent` — H3 `Un valor mínimo y uno máximo`
  `No un número único. Toda propiedad se mueve dentro de una franja, y decirte "vale exactamente esto" sería inventarte una precisión que nadie tiene. Te damos los dos extremos y qué te acerca a cada uno.`
- Kort 2 `.card--hair` — H3 `Qué lo sube y qué lo baja`
  `El estado de la construcción, el frente sobre la calle, la antigüedad, la orientación, si hay documentación completa. Te decimos cuáles de esos factores están jugando a favor tuyo y cuáles en contra.`
- Kort 3 `.card--hair` — H3 `Con qué lo comparamos`
  `Propiedades parecidas en la misma zona. Te aclaramos siempre que lo publicado en los portales es lo que se pide, no lo que se paga — y esa diferencia se ajusta.`

**S4 — Qué NO es**
- eyebrow: `Para que quede claro`
- H2: `Qué no es una tasación online`
- brödtext:
  `No es un informe firmado. Si el valor tiene que quedar por escrito para una sucesión, una división de bienes o un trámite judicial, el rango online no te va a servir y te lo vamos a decir apenas nos cuentes el caso — no después de hacerte perder una semana.`
  `Tampoco es un cálculo automático. No hay ningún algoritmo que multiplique metros por un número. Miramos tu caso concreto, y si los datos que nos pasaste no alcanzan para responder con seriedad, te preguntamos antes de darte un número.`
  `Y no es un compromiso. Recibís el rango y ahí puede terminar. No te llamamos todos los días ni te pasamos tu contacto a nadie.`
- länk i löptext: `Si lo que necesitás es el documento escrito, mirá cómo funciona el` → `/servicios/informe-de-tasacion/` (`informe de tasación`).

**S5 — Cotizador-inbjudan (P10)**
- eyebrow: `Antes de escribirnos`
- H2: `Armá tu consulta en un minuto`
- text: `Si preferís no escribir todo a mano, el cotizador te va preguntando lo que necesitamos y arma el mensaje de WhatsApp por vos. No calcula ningún precio: ordena tus datos para que podamos arrancar enseguida.`
- CTA: `Ir al cotizador` → `/cotizador/`

**S6 — Proceso** (4 steg, samma ton som `index.html` men egen text)
1. `Nos escribís` — `Por WhatsApp, con lo que tengas: ubicación, superficie, antigüedad y algunas fotos del frente y del interior.`
2. `Te preguntamos lo que falta` — `Casi siempre falta algo: el frente del lote, si hay construcción sin planos, si está alquilada. Preguntamos antes de calcular, no después.`
3. `Te pasamos el rango` — `Con el mínimo, el máximo y la explicación de qué lo mueve en cada dirección.`
4. `Vos decidís qué hacer con eso` — `Publicar, esperar, negociar o pedir un informe formal. Si con el rango te alcanza, ahí queda y no te cobramos nada.`

**S7 statement**
- `.statement`: `El rango es gratis. El error de publicar mal, no.`
- sub: `Una propiedad publicada un 20% por encima de su valor no se vende un 20% más lento. Se queda quieta hasta que bajás el precio, y para entonces ya arrastra meses de publicación.`

---

### 5.2 `/servicios/tasacion-de-casas-y-departamentos/`

**title:** `Tasación de casas y departamentos en Asunción | Tasación.com.py`
**meta description:** `Tasación de casas y departamentos en Asunción y el Gran Asunción. Terreno y construcción se miden por separado; el estado real define el resto. Rango sin costo por WhatsApp.`

**S1 hero**
- eyebrow: `Servicio · Vivienda`
- H1: `Tasación de casas y departamentos`
- lede: `Una vivienda no se tasa por metros cuadrados. Se tasa por dónde está parada, cuánto tiene de terreno, cuánto de construcción, y en qué estado real está eso que está construido.`
- CTA: `Consultá por tu casa` (WhatsApp) · `Armar mi consulta` → `/cotizador/`

**S3 — Qué miramos en una casa** (P7 sticky-side, 5 poster med `.factor__n`)
- aside eyebrow: `Metodología`
- aside H2: `Los cinco puntos que revisamos`
- aside text: `Son los mismos que va a mirar un comprador serio cuando visite. Adelantarse a ellos es la diferencia entre negociar desde tu número y negociar desde el de él.`

01 `Terreno y construcción, por separado`
`Se valoran distinto y por eso se miden distinto. El terreno responde a la zona y al frente que tiene sobre la calle; la construcción, a cuántos metros cubiertos hay y de qué calidad son. Sumarlos como si fueran lo mismo es el error más frecuente de los cálculos caseros.`

02 `Estado de las instalaciones`
`Instalación eléctrica, cañerías, techo, humedad y aberturas. Nada de esto se ve en una foto, y todo esto se descuenta del precio en la primera visita del comprador. Una casa con la eléctrica original de hace treinta años arrastra un descuento que no depende de lo linda que esté la cocina.`

03 `Antigüedad frente a mantenimiento`
`La antigüedad sola dice poco. Una casa de treinta años bien mantenida se posiciona mejor que una de diez descuidada. Lo que pesa es cuándo fue la última refacción de fondo y qué alcanzó.`

04 `Distribución y metros útiles`
`Cuántos dormitorios, cuántos baños y cómo están repartidos. Dos casas de 140 m² no valen lo mismo si una tiene tres dormitorios cómodos y la otra cuatro apretados con un solo baño.`

05 `Qué se está pagando en la cuadra`
`No en el barrio: en la cuadra. Si la calle está asfaltada, si es zona inundable, si tenés avenida o colectivo cerca y qué se está construyendo alrededor. Villa Morra y Mariano Roque Alonso no se comparan, pero tampoco se comparan dos cuadras del mismo barrio.`

**S4 banda full-bleed** — bild `tasador-midiendo-propiedad-asuncion`
- caption: `Medir la casa lleva una tarde. Saber qué está pagando la zona lleva más.`

**S4 overlap-kort** (`.card--raised.overlap`)
- `<strong>El estado real pesa más que la antigüedad.</strong> Una refacción de fondo bien hecha se recupera casi entera en el precio; una capa de pintura sobre una humedad, no.`

**S5 — Departamentos: qué cambia** (P4)
- eyebrow: `Departamentos`
- H2: `En un departamento cambian las reglas`
- text:
  `No hay terreno propio que valorar, así que el peso se corre entero a la construcción y al edificio. El piso importa, la orientación importa y la vista importa, en ese orden y con diferencias que se notan.`
  `Después está lo que no es tuyo pero se paga igual: la expensa mensual, el estado del ascensor, si hay generador, cochera propia o compartida, y qué amenities tiene el edificio y cuáles están efectivamente funcionando. Un edificio con pileta cerrada hace dos años no suma, resta.`
  `Y hay un factor que en Asunción pesa cada vez más: cuántas unidades iguales a la tuya hay en venta en el mismo edificio. Si hay seis, no competís contra el mercado — competís contra tus vecinos, y el que baja primero fija el precio de todos.`

**S6 — Errores más comunes** (P3, 3 kort)
- `.card--accent` H3 `Partir del precio de los portales`
  `Lo publicado es lo que se pide. Entre eso y lo que se firma en la escribanía suele haber una diferencia que hay que ajustar, y es la parte donde más se equivocan los cálculos hechos en casa.`
- `.card--hair` H3 `Sumar la refacción al precio anterior`
  `Lo que gastaste en refaccionar no se suma peso por peso al valor. Una parte se recupera, otra no, y depende mucho de qué refaccionaste.`
- `.card--hair` H3 `Tasar por el metro cuadrado del vecino`
  `No existe un precio por metro que sirva para toda Asunción, ni siquiera para todo un barrio. El frente, el nivel respecto a la calle y el uso permitido cambian el número.`

**S7 statement**
- `.statement`: `Tu casa no vale lo que te costó. Vale lo que alguien está pagando hoy a tres cuadras.`
- sub: `Por eso preguntamos por la calle y no solo por el barrio.`

---

### 5.3 `/servicios/tasacion-de-terrenos/`

**title:** `Tasación de terrenos en Asunción y Gran Asunción | Tasación.com.py`
**meta description:** `Tasación de terrenos en Asunción y el Gran Asunción. Frente, forma del lote, nivel respecto a la calle y zonificación: lo que realmente define el valor de un lote. Rango sin costo por WhatsApp.`

**S1 hero** (P1 speglad 5/7)
- eyebrow: `Servicio · Terrenos`
- H1: `Tasación de terrenos en Asunción y Gran Asunción`
- lede: `Dos lotes de la misma superficie pueden valer muy distinto. Lo que los separa es el frente, la forma, el nivel respecto a la calle y qué se puede construir ahí legalmente.`
- CTA: `Consultá por tu terreno` · `Armar mi consulta` → `/cotizador/`

**S3 — Los factores del lote** (P5 numbered rail, 4 upp)
1. `Frente sobre la calle` — `Es el factor más subestimado. Un lote de 12 metros de frente y 30 de fondo vale más que uno de 8 por 45 con la misma superficie, porque lo que se puede construir al frente es lo que se ve y lo que se aprovecha.`
2. `Forma del lote` — `Un rectángulo regular se aprovecha entero. Un lote irregular, en punta o con un fondo que se angosta, pierde metros construibles que igual pagás.`
3. `Nivel respecto a la calle` — `Un terreno bajo respecto a la calle arrastra costo de relleno y riesgo de agua, y el comprador lo descuenta antes de sentarse a negociar. Uno alto se vende solo.`
4. `Servicios y acceso` — `Agua, luz, si la calle está asfaltada o es de tierra, y a cuánto está el colectivo más cercano. En el Gran Asunción esto pesa más que en Asunción, porque define si el lote es habitable ya o dentro de tres años.`

**S4 banda full-bleed** — bild `tasador-de-terrenos-gran-asuncion`
- caption: `El lote no vale por lo que mide. Vale por lo que se puede levantar encima.`

**S5 — Zonificación y uso** (P4)
- eyebrow: `Uso permitido`
- H2: `Qué se puede hacer legalmente ahí`
- text:
  `Un terreno sobre una avenida habilitada para uso comercial no vale lo mismo que el mismo terreno a media cuadra en zona estrictamente residencial. La diferencia no es un porcentaje: son dos mercados distintos, con dos tipos de comprador distintos.`
  `Donde se puede construir en altura, el lote vale por lo que se puede levantar, no por la casita que hay hoy. Ahí el comprador ya no es una familia: es alguien que hace números de metros vendibles, y paga en función de eso.`
  `Por eso, cuando nos escribís por un terreno, lo primero que preguntamos no es cuánto mide sino dónde está exactamente y qué hay alrededor.`
- länk: `Si en ese lote ya hay una construcción, mirá también` → `/servicios/tasacion-de-casas-y-departamentos/`

**S6 — Loteamientos y cuotas** (P3, 2 kort, `--ink` spans 2)
- `.card--ink` (spans 2) H2 `Lotes en cuotas: el valor no es la suma de las cuotas`
  `Un lote comprado en cuotas a diez años tiene un precio de lista que incluye el financiamiento. Ese número no es el valor del lote — es el valor del lote más el costo de pagarlo de a poco. Cuando querés venderlo, competís contra lotes que se pagan al contado, y ahí el número que importa es otro.`
  `También pesa cuánto falta pagar, si el loteamiento ya tiene los servicios prometidos efectivamente instalados y si la transferencia del contrato está permitida. Contanos en qué situación estás y lo miramos con eso adentro.`
- `.card--accent` H3 `Lo que necesitamos saber`
  `Ubicación exacta del lote dentro del loteamiento, superficie y frente, cuántas cuotas pagaste y cuántas faltan, y si el loteamiento tiene agua, luz y calle. Con eso ya podemos armarte un rango.`

**S7 statement**
- `.statement`: `Un terreno mal parado sobre la calle se vende, pero no al precio que pensabas.`
- sub: `El frente y el nivel se descuentan en la primera visita. Mejor saberlo antes de publicar que después de tres meses.`

---

### 5.4 `/servicios/tasacion-de-locales-comerciales/`

**title:** `Tasación de locales comerciales en Asunción | Tasación.com.py`
**meta description:** `Tasación de locales comerciales, depósitos y galpones en Asunción y Gran Asunción. Un local se valora por lo que puede producir: tránsito, frente, estacionamiento y habilitación de uso.`

**S1 hero**
- eyebrow: `Servicio · Comercial`
- H1: `Tasación de locales comerciales`
- lede: `Un local no se valora como una casa. Se valora por lo que puede producir: cuánta gente pasa por esa cuadra, cuánto frente y vidriera tiene, dónde estaciona el cliente y qué rubro está habilitado a funcionar ahí.`
- CTA: `Consultá por tu local` · `Armar mi consulta` → `/cotizador/`

**S3 — Qué produce un local** (P4)
- eyebrow: `Criterio`
- H2: `La construcción importa menos que la ubicación`
- text:
  `En una vivienda, el estado de la construcción es medio valor. En un local, es bastante menos. Un local impecable en una cuadra sin tránsito rinde peor que uno básico sobre una avenida con paso constante, y el mercado lo paga en consecuencia.`
  `Lo que sí se paga es el frente. Cuántos metros de vidriera dan a la calle, si el ingreso es a nivel o hay escalones, si el cartel se ve desde el auto. Un local de 80 m² con 10 metros de frente vale distinto que uno de 80 m² con 4 metros de frente y fondo largo.`
  `Y se paga el estacionamiento. En Asunción, un local sin dónde parar pierde clientes reales todos los días, y eso ya está descontado en lo que un inquilino está dispuesto a pagar de alquiler.`

**S4 — Checklist del local** (P3, 4 kort)
- `.card--accent` H3 `Tránsito de la cuadra` — `No del barrio: de la cuadra y de la vereda. Cambia entre una esquina y media cuadra más adelante.`
- `.card--hair` H3 `Frente y vidriera` — `Metros lineales sobre la calle, altura del ingreso y visibilidad del cartel desde un auto en movimiento.`
- `.card--hair` H3 `Estacionamiento` — `Propio, sobre la calle o inexistente. Es la primera pregunta que hace un inquilino serio.`
- `.card--hair` H3 `Habilitación de uso` — `Qué rubros pueden funcionar ahí según la zonificación municipal. Define quién te lo puede alquilar y por cuánto.`

**S5 — banda de cita** (P8 full-bleed `--ink` + `.grain`, ingen bild)
- text i bandet (`.statement` mindre variant): `Un local vacío no vale lo que costó construirlo. Vale lo que el próximo inquilino puede pagar por él.`

**S5 overlap-kort** (`.card--raised.overlap`)
- `<strong>Si el local está alquilado hoy, decínoslo.</strong> Un contrato vigente con buen inquilino y renta al día sube el valor para un comprador inversor. Uno con renta atrasada o vencimiento cercano lo baja. Es el dato que más mueve la aguja y el que menos gente menciona.`

**S6 — Depósitos y galpones** (P2 offset stack)
- eyebrow: `También tasamos`
- H2: `Depósitos y galpones`
- text: `Acá manda otra cosa: altura libre, ancho de portón, si entra un camión y puede maniobrar, piso, y qué tan lejos está de la ruta o del acceso. La superficie cubierta importa, pero un galpón con 3 metros de altura libre no compite con uno de 7, aunque midan lo mismo. Contanos qué tenés y lo miramos con esos criterios.`

**S7 statement**
- `.statement`: `Un local se compra con una calculadora, no con el corazón.`
- sub: `El comprador de una casa se enamora. El de un local hace números de renta antes de bajarse del auto — y la tasación tiene que estar del lado de esos números.`

---

### 5.5 `/servicios/informe-de-tasacion/`

**title:** `Informe de tasación de inmuebles | Tasación.com.py`
**meta description:** `Informe de tasación de inmuebles para sucesiones, divisiones de bienes, trámites judiciales y negociaciones entre partes. Incluye visita al inmueble, metodología, comparables y fotos. Presupuesto sin costo.`

**S1 hero**
- eyebrow: `Servicio · Documento escrito`
- H1: `Informe de tasación de inmuebles`
- lede: `Cuando el valor tiene que quedar por escrito, el rango por WhatsApp no alcanza. El informe documenta la metodología, los comparables usados y el estado del inmueble, con las fotos del relevamiento.`
- CTA: `Consultá por el informe` · CTA sekundär: `Ver qué documentos hacen falta` → `/guias/documentos-para-tasar-un-inmueble/`
- hero__note: `Servicio pago. Te pasamos el presupuesto antes de empezar y no hay nada que pagar hasta que lo aceptes.`

**S3 — Cuándo hace falta** (P3, 4 kort)
- `.card--accent` H3 `Sucesiones` — `Cuando hay que repartir bienes entre herederos y el inmueble tiene que entrar a la cuenta con un valor que todos puedan mirar.`
- `.card--hair` H3 `División de bienes` — `Separaciones y disoluciones donde una parte se queda con el inmueble y compensa a la otra. El número tiene que resistir la discusión.`
- `.card--hair` H3 `Trámites judiciales` — `Cuando el expediente pide un valor documentado del inmueble y no una estimación conversada.`
- `.card--hair` H3 `Negociaciones entre partes` — `Socios que se separan, familias que compran entre sí, ventas donde las dos partes quieren un tercero que ponga el número.`

**S4 — Qué contiene** (P7 sticky-side, 6 poster)
- aside eyebrow: `Contenido`
- aside H2: `Qué vas a recibir`
- aside text: `El informe es un documento escrito. Estos son los bloques que lleva siempre, independientemente del tipo de inmueble.`

01 `Identificación del inmueble` — `Ubicación, superficie de terreno y de construcción, y los datos de la documentación que nos hayas pasado.`
02 `Descripción del relevamiento` — `Qué se midió, qué se observó en la visita y en qué estado estaba cada parte del inmueble el día del relevamiento.`
03 `Metodología aplicada` — `Qué criterio se usó para llegar al valor y por qué ese criterio es el que corresponde a este inmueble en particular.`
04 `Comparables considerados` — `Las propiedades parecidas de la zona que se tomaron como referencia, y los ajustes que se les aplicaron.`
05 `Registro fotográfico` — `Fotos del frente, del interior, de las instalaciones y de cualquier detalle que afecte el valor.`
06 `Conclusión de valor` — `El valor al que llega el informe, expresado con la fundamentación que lo sostiene.`

**S5 — Qué necesitamos de vos** (P4)
- eyebrow: `Antes de empezar`
- H2: `Qué te vamos a pedir`
- text:
  `Documentación de la propiedad y acceso al inmueble para la visita. Sin esas dos cosas no hay informe posible — y si algo falta, te lo decimos al principio y no a mitad del trabajo.`
  `Qué documentos exactamente depende del caso y de para qué vas a usar el informe. Armamos una guía aparte con la lista y con qué hacer cuando algo no aparece.`
- länk: `Leé la guía completa:` → `/guias/documentos-para-tasar-un-inmueble/` (`qué documentos hacen falta para tasar un inmueble`)

**S6 — Cómo se cotiza** (P10 `.card--raised`, INGA belopp)
- eyebrow: `Presupuesto`
- H2: `Cómo se calcula el presupuesto del informe`
- text: `No hay una lista de precios porque no hay dos casos iguales. El monto depende de tres cosas:`
- lista `.formas__list`:
  - `El tipo de inmueble. No es lo mismo un departamento que un galpón o un terreno rural.`
  - `La superficie. Más metros es más relevamiento y más tiempo de visita.`
  - `El uso que le vas a dar al informe, porque define el nivel de detalle y de documentación que tiene que llevar.`
- avslutning: `Contanos tu caso y te pasamos el presupuesto antes de empezar. Ese presupuesto no tiene costo y no te compromete a nada.`
- CTA: `Presupuesto sin costo` (WhatsApp, prefill enligt §9)

**S7 statement**
- `.statement`: `Un número conversado se discute. Un número documentado se usa.`
- sub: `Es la única diferencia real entre el rango que te damos gratis y el informe que se paga.`

---

### 5.6 `/zonas/luque/`

**title:** `Tasación de inmuebles en Luque | Tasación.com.py`
**meta description:** `Tasación de inmuebles en Luque: casas, terrenos y lotes en cuotas. Zona aeropuerto, ruta a San Bernardino y los loteamientos del norte. Rango de valor sin costo por WhatsApp.`

**S1 hero** (P1 7/5, ingen egen bild i heron — se §6; heron är typografisk med `.hero__note`)
- eyebrow: `Zona · Departamento Central`
- H1: `Tasación de inmuebles en Luque`
- lede: `Luque es la ciudad del Gran Asunción donde más cambia el valor de una cuadra a la otra. Entre la zona consolidada cerca del centro y los loteamientos que todavía se están abriendo hay dos mercados distintos, y se tasan distinto.`
- CTA: `Consultá por tu propiedad en Luque` · `Armar mi consulta` → `/cotizador/`

**S3 — Barrios** (P4)
- eyebrow: `Dónde`
- H2: `Las zonas de Luque que más tasamos`
- text:
  `El área céntrica y los barrios consolidados alrededor —San Isidro, Laurelty, Loma Merlo— se comportan como una ciudad hecha: calles abiertas, servicios instalados y valores que se mueven poco de un año al otro. Ahí lo que define el precio es el estado de la construcción y el frente del lote.`
  `Hacia el norte y el este el escenario es otro: loteamientos en distintas etapas, muchos con lotes todavía en cuotas y con los servicios prometidos a medio instalar. Ahí el valor depende menos de la construcción y más de en qué etapa está la zona y de qué tan lejos quedó tu lote del acceso asfaltado.`
  `Y está la franja alrededor del aeropuerto y de la avenida Aviadores del Chaco, donde el uso comercial empuja los valores hacia arriba y una casa sobre avenida ya no se compara con la misma casa dos cuadras adentro.`

**S4 banda full-bleed** — bild `tasador-de-terrenos-gran-asuncion`
- caption: `En Luque, la distancia al asfalto explica buena parte del precio.`

**S5 — Qué se tasa acá** (P3, 3 kort)
- `.card--accent` H3 `Lotes en loteamientos` — `Es lo que más nos llega de Luque. Lo primero que preguntamos es cuántas cuotas faltan, si hay agua y luz, y a cuántas cuadras está la calle asfaltada más cercana.` → länk `/servicios/tasacion-de-terrenos/`
- `.card--hair` H3 `Casas familiares` — `Terreno amplio y construcción de una planta es lo típico de la zona consolidada. Pesa mucho el estado de las instalaciones y si hubo ampliaciones sin planos.` → länk `/servicios/tasacion-de-casas-y-departamentos/`
- `.card--hair` H3 `Locales sobre avenida` — `Sobre Aviadores del Chaco y las vías de acceso, el criterio pasa a ser comercial: tránsito, frente y estacionamiento.` → länk `/servicios/tasacion-de-locales-comerciales/`

**S6 — Logística** (P2 offset stack)
- eyebrow: `Cómo trabajamos en Luque`
- H2: `Cuándo hace falta que vayamos`
- text: `Para el rango online no hace falta que vayamos a ningún lado: nos mandás los datos y las fotos por WhatsApp y trabajamos desde ahí, estés en la zona céntrica o en un loteamiento del fondo. La visita al inmueble solo se coordina cuando pedís el informe formal. En ese caso te confirmamos día y horario antes, y si el lote está en una zona de difícil acceso te lo decimos al presupuestar, no después.`

**S7 statement**
- `.statement`: `En Luque, dos lotes iguales a seis cuadras de distancia no son dos lotes iguales.`
- sub: `Uno tiene el asfalto en la puerta. El otro lo espera para el año que viene, y eso está en el precio.`

**S8 linkgrid** — `/zonas/san-lorenzo/`, `/zonas/fernando-de-la-mora/`, `/zonas/interior/`, `/servicios/tasacion-de-terrenos/`, `/servicios/tasacion-de-casas-y-departamentos/`, `/cotizador/`

---

### 5.7 `/zonas/san-lorenzo/`

**title:** `Tasación de inmuebles en San Lorenzo | Tasación.com.py`
**meta description:** `Tasación de inmuebles en San Lorenzo: casas, departamentos y locales. Zona universitaria, Ruta Mariscal Estigarribia y mercado de alquiler estudiantil. Rango sin costo por WhatsApp.`

**S1 hero** (P2 offset stack, ingen bild)
- eyebrow: `Zona · Departamento Central`
- H1: `Tasación de inmuebles en San Lorenzo`
- lede: `San Lorenzo tiene algo que ninguna otra ciudad del Gran Asunción tiene con esta intensidad: un mercado de alquiler estudiantil que sostiene el valor de propiedades que, por construcción, valdrían menos en otro lado.`
- CTA: `Consultá por tu propiedad en San Lorenzo` · `Armar mi consulta` → `/cotizador/`

**S3 — Barrios** (P3 staggered grid, 3 kort)
- `.card--ink` (spans 2) H3 `La zona universitaria`
  `Todo lo que rodea al campus de la Universidad Nacional funciona con su propia lógica. Una casa vieja dividida en habitaciones puede rendir más de alquiler que una casa mejor en un barrio residencial tranquilo, y eso se refleja en lo que un comprador inversor está dispuesto a pagar. Cuando tasamos acá preguntamos siempre si está alquilada, a cuántos inquilinos y con qué renta mensual.`
- `.card--accent` H3 `Sobre la Ruta Mariscal Estigarribia`
  `El corredor comercial de la ciudad. Frente, tránsito y habilitación de uso mandan; la construcción pasa a segundo plano.`
- `.card--hair` H3 `Barrios residenciales`
  `Villa Universitaria, San Miguel, Reducto y la zona del Mercado de Abasto. Acá vuelve a pesar lo de siempre: terreno, construcción, estado y frente.`

**S4 — Qué se tasa acá** (P7 sticky-side, 3 poster)
- aside eyebrow: `Criterio local`
- aside H2: `Lo que cambia al tasar en San Lorenzo`
01 `La renta pesa más que en otras ciudades` — `Buena parte de los compradores acá son inversores, no familias. Compran por lo que la propiedad produce por mes, y ese número entra directo en la tasación.`
02 `Las divisiones internas cuentan` — `Una casa dividida en unidades independientes con baño propio vale distinto que la misma casa sin dividir. Si tenés esa división hecha, es un dato que hay que poner sobre la mesa.`
03 `El calendario académico se nota` — `La demanda de alquiler no es pareja todo el año, y eso afecta el tiempo que tarda en venderse una propiedad orientada a estudiantes. No cambia el valor, pero sí el plazo.`

**S5 banda full-bleed** — bild `tasacion-casas-departamentos-asuncion`
- caption: `Acá se compra por lo que la propiedad produce por mes, no por lo linda que está.`

**S6 — Logística** (P4)
- eyebrow: `Cómo trabajamos en San Lorenzo`
- H2: `Coordinación de la visita`
- text: `El rango online se hace sin movernos: mandás los datos por WhatsApp y listo. Para el informe formal coordinamos la visita al inmueble. Si la propiedad está alquilada, necesitamos que el inquilino esté avisado y que podamos entrar a las habitaciones — un relevamiento a medias da un informe a medias, y preferimos reprogramar antes que entregar eso.`

**S7 statement**
- `.statement`: `Una casa que rinde no se tasa igual que una casa que se habita.`
- sub: `En San Lorenzo esa diferencia es la mitad del trabajo.`

---

### 5.8 `/zonas/fernando-de-la-mora/`

**title:** `Tasación de inmuebles en Fernando de la Mora | Tasación.com.py`
**meta description:** `Tasación de inmuebles en Fernando de la Mora, Zona Norte y Zona Sur. Casas, departamentos y locales sobre las avenidas. Rango de valor sin costo por WhatsApp.`

**S1 hero** (P1 speglad 5/7, ingen bild)
- eyebrow: `Zona · Departamento Central`
- H1: `Tasación de inmuebles en Fernando de la Mora`
- lede: `Fernando de la Mora se divide en Zona Norte y Zona Sur, y no es una división administrativa nada más: son dos mercados con valores, tipos de propiedad y tiempos de venta distintos. Tasarlas con el mismo criterio es el error clásico.`
- CTA: `Consultá por tu propiedad en Fernando de la Mora` · `Armar mi consulta` → `/cotizador/`

**S3 — Barrios** (P4)
- eyebrow: `Dónde`
- H2: `El pegado a Asunción y el resto`
- text:
  `Es la ciudad que más pega contra Asunción, y eso define casi todo. Las zonas que dan directo al límite con la capital se comportan casi como un barrio más de Asunción: valores más altos, tiempos de venta más cortos y compradores que trabajan del otro lado del límite.`
  `A medida que te alejás hacia el este, el perfil cambia a residencial más tranquilo y con lotes algo más grandes. Villa Alegría, Bernardino Caballero, San Miguel y Santo Domingo se mueven en esa franja.`
  `Y después están las avenidas —Mariscal López, Von Polesky y la Ruta Mariscal Estigarribia— que cortan la ciudad y donde el uso pasa a ser comercial. Una propiedad sobre avenida se tasa con criterio de local, aunque hoy sea una casa.`

**S4 banda full-bleed** — bild `tasacion-locales-comerciales-asuncion`
- caption: `Sobre la avenida se tasa por lo que puede producir. Dos cuadras adentro, por lo que es.`

**S5 — Norte y Sur** (P3, 2 kort)
- `.card--accent` H3 `Zona Norte`
  `Más densa, más consolidada y con mayor peso del uso mixto. Los lotes suelen ser más chicos y buena parte del valor está en la ubicación respecto a las avenidas y al límite con Asunción.`
- `.card--hair` H3 `Zona Sur`
  `Perfil más residencial, lotes en general más amplios y menos presión comercial. Acá la construcción y el estado real vuelven a ser la mitad del valor.`

**S6 — Logística** (P2 offset stack)
- eyebrow: `Cómo trabajamos en Fernando de la Mora`
- H2: `Es la zona más fácil de coordinar`
- text: `Por cercanía con Asunción, la visita al inmueble para un informe formal es de las más simples de agendar de todo el Gran Asunción. Igual, el rango online no requiere visita: mandás los datos por WhatsApp y trabajamos desde ahí. Un pedido concreto para esta ciudad: decinos siempre si estás en Zona Norte o Zona Sur, porque el número cambia y no siempre se deduce de la dirección.`

**S7 statement**
- `.statement`: `Zona Norte y Zona Sur no son la misma ciudad para el que compra.`
- sub: `Y como el que compra decide el precio, tampoco son la misma ciudad para el que tasa.`

---

### 5.9 `/zonas/interior/`

**title:** `Tasación de inmuebles fuera del Gran Asunción | Tasación.com.py`
**meta description:** `Tasación de inmuebles en el interior del país. El rango online funciona en cualquier punto de Paraguay. La visita al inmueble se coordina según el caso: escribinos y te confirmamos.`

**S1 hero** (P2 offset stack, ingen bild)
- eyebrow: `Cobertura`
- H1: `Tasación de inmuebles fuera del Gran Asunción`
- lede: `Fuera del Gran Asunción coordinamos según el caso: escribinos y te confirmamos si podemos llegar. Lo que sí funciona siempre, estés donde estés en Paraguay, es el rango de valor online por WhatsApp.`
- CTA: `Contanos dónde está tu propiedad` · `Armar mi consulta` → `/cotizador/`

> Formuleringen i lede är låst av §10.2. Den får inte skrivas om till ett
> löfte om täckning. Ingen ort utanför Gran Asunción får nämnas som "vi
> arbetar i X".

**S3 — Cómo funciona** (P4)
- eyebrow: `Cómo funciona`
- H2: `Dos servicios, dos alcances distintos`
- text:
  `El rango de valor online no depende de la distancia. Trabajamos con los datos que nos mandás: ubicación exacta, superficie, estado, antigüedad y fotos. Si tu propiedad está en el interior, el rango sale igual, con una salvedad honesta: en zonas con poco movimiento de mercado hay menos comparables disponibles, y eso hace que la franja entre el mínimo y el máximo salga más ancha. Te lo decimos cuando pasa.`
  `El informe formal es otra cosa, porque incluye visita al inmueble. Ahí sí depende de dónde esté la propiedad, de cuánto lleva llegar y de si podemos coordinar el viaje en una fecha razonable. No prometemos cobertura nacional: te decimos caso por caso si podemos, antes de que inviertas tiempo.`
  `Nuestra base de trabajo es Asunción y el Gran Asunción — Luque, San Lorenzo, Fernando de la Mora, Lambaré, Capiatá y Mariano Roque Alonso.`

**S4 banda full-bleed** — bild `tasacion-terrenos-paraguay`
- caption: `El rango online llega a cualquier punto del país. La visita, según el caso.`

**S5 — Qué sí podemos hacer siempre** (P3, 3 kort)
- `.card--accent` H3 `Rango de valor online` — `Sin costo y sin importar dónde esté la propiedad. Con los datos y las fotos que nos mandes.`
- `.card--hair` H3 `Decirte qué te falta` — `Si los datos no alcanzan para responder con seriedad, te decimos exactamente qué conseguir antes de volver a escribirnos.`
- `.card--hair` H3 `Responderte por sí o por no` — `Sobre el informe formal en tu zona te contestamos claro. Un "no llegamos" a tiempo vale más que un "vemos" que se estira.`

**S6 statement**
- `.statement`: `Prometer cobertura nacional es fácil. Cumplirla, no.`
- sub: `Preferimos decirte hoy si podemos llegar, y no dentro de dos semanas.`

---

### 5.10 `/cotizador/`

**title:** `Cuánto vale tu propiedad: armá tu consulta | Tasación.com.py`
**meta description:** `Armá tu consulta de tasación en un minuto. Cargá los datos de tu propiedad y el cotizador prepara el mensaje de WhatsApp con todo ordenado. No calcula precios: te conecta con la tasación sin costo.`

**S1 hero** (P2)
- eyebrow: `Cotizador`
- H1: `Cuánto vale tu propiedad: armá tu consulta en un minuto`
- lede: `Cargá lo que sepas de tu inmueble y el cotizador arma el mensaje de WhatsApp con todos los datos ordenados. No te muestra un precio ni estima nada — sirve para que no tengas que escribirlo todo a mano y para que podamos darte un rango serio en la primera respuesta.`

**S3 — Formuläret (P10, huvudsektionen)** — se §7 för fältlista och logik.
- eyebrow: `Tu propiedad`
- H2: `Contanos de tu propiedad`
- CTA-knapp: `Presupuesto sin costo por WhatsApp`
- not under knappen: `Se abre WhatsApp con el mensaje ya escrito. Podés revisarlo y editarlo antes de enviarlo — nada se envía desde esta página.`

**S4 — Qué hacemos con esto** (P4)
- eyebrow: `Qué pasa después`
- H2: `Qué hacemos con estos datos`
- text:
  `Los leemos y te contestamos por WhatsApp. Si con lo que cargaste alcanza, te devolvemos un rango de valor con la explicación de cómo llegamos a él. Si falta algo importante —el frente del lote, el estado de las instalaciones, si hay construcción sin planos— te lo preguntamos antes de darte cualquier número.`
  `Si tu caso necesita un informe escrito, te lo decimos ahí mismo y te pasamos el presupuesto antes de empezar. Ese presupuesto no tiene costo y no te compromete a nada.`
  `Los datos que cargues acá se usan solo para responder tu consulta. No los vendemos ni los compartimos con terceros.`

**S5 statement**
- `.statement`: `El mejor rango sale del mejor dato, no del mejor formulario.`
- sub: `Por eso el cotizador pregunta lo que pregunta — y por eso todo lo que no sepas podés dejarlo en blanco.`

---

### 5.11 `/contacto/`

**title:** `Contacto | Tasación.com.py`
**meta description:** `Contactá a Tasación.com.py por WhatsApp o dejanos tus datos. Tasación de inmuebles en Asunción y el Gran Asunción. Respondemos por WhatsApp al número que dejes.`

**S1 hero** (P2)
- eyebrow: `Contacto`
- H1: `Contacto`
- lede: `La vía más rápida es WhatsApp. Mandanos el tipo de propiedad, la ubicación y la superficie, y arrancamos desde ahí. Si preferís que te escribamos nosotros, dejanos tus datos y te respondemos al número que pongas.`

**S3 — kontakt-split** — kopiera `index.html` §12 (WhatsApp-block + formulär) med
dessa textändringar:
- WhatsApp-blockets H3: `Escribinos por WhatsApp` (oförändrad)
- formulärets H3: `O dejanos tus datos` (oförändrad)
- formuläret postar till `/lead-forward.php` (absolut sökväg, eftersom sidan
  ligger i en undermapp). `page_url` fylls som vanligt av `site.js`.

**S4 — Cobertura** (P4)
- eyebrow: `Dónde trabajamos`
- H2: `Cobertura`
- text: `Trabajamos en todo Asunción y el Gran Asunción — Luque, San Lorenzo, Fernando de la Mora, Lambaré, Capiatá y Mariano Roque Alonso. Fuera del Gran Asunción coordinamos según el caso: escribinos y te confirmamos si podemos llegar.`
- länkar i löptext till `/zonas/luque/`, `/zonas/san-lorenzo/`, `/zonas/fernando-de-la-mora/`, `/zonas/interior/`

**S5 statement**
- `.statement`: `No hace falta que vengas a una oficina.`
- sub: `Todo el primer tramo se resuelve por WhatsApp. La visita al inmueble solo entra si pedís el informe formal.`

> Ingen gatuadress, ingen karta, ingen nål (§10.2). Footern säger
> `Asunción, Paraguay` och inget mer.

---

### 5.12 `/preguntas-frecuentes/`

**title:** `Preguntas frecuentes sobre tasación de inmuebles | Tasación.com.py`
**meta description:** `Preguntas frecuentes sobre tasación de inmuebles en Paraguay: qué cuesta, cuánto demora, qué diferencia hay con el precio de venta, qué documentos hacen falta y cuándo se necesita un informe escrito.`

**S1 hero** (P2)
- eyebrow: `Antes de escribirnos`
- H1: `Preguntas frecuentes sobre tasación de inmuebles`
- lede: `Las cinco primeras son las mismas que están en la página principal. Las otras cinco son las que aparecen apenas la conversación avanza.`

**S3 — FAQ (P4, `<details>`, 10 stycken)**

De fem första kopieras **ordagrant** från `index.html` (samma frågor, samma svar):
1. ¿Cuánto cuesta una tasación?
2. ¿La tasación online es gratis de verdad?
3. ¿Cuánto demora?
4. ¿Trabajan fuera de Asunción?
5. ¿Qué diferencia hay entre una tasación y el precio de venta?

Fem nya:

6. **¿Necesito tener los papeles al día para pedir una tasación?**
`Para el rango online, no. Nos alcanza con la ubicación, la superficie, el estado y algunas fotos. Para el informe formal sí hace falta documentación, y qué documentos exactamente depende del caso. Si algo no aparece o está desactualizado, decínoslo al principio: casi siempre hay una forma de resolverlo, pero es mejor saberlo antes de arrancar.`

7. **¿Tasan propiedades que están alquiladas?**
`Sí, y el hecho de que esté alquilada es un dato que entra en la tasación, no un obstáculo. Un contrato vigente con renta al día puede subir el valor para un comprador inversor; uno con renta atrasada o vencimiento cercano lo baja. Para el informe formal necesitamos poder entrar al inmueble, así que hay que coordinar con el inquilino.`

8. **¿Qué pasa si mi propiedad tiene construcción sin planos?**
`No es raro y no impide tasar. Lo que sí hacemos es señalarlo, porque el comprador lo va a descubrir y lo va a usar para negociar. Una ampliación sin planos no vale lo mismo que una regularizada, y preferimos que ese descuento lo tengas vos antes que él.`

9. **¿Puedo pedir una tasación si estoy por comprar, no por vender?**
`Sí, y es de los usos más útiles que tiene. Nos pasás los datos de la propiedad que estás mirando y te decimos si el precio que te están pidiendo se sostiene con lo que se está pagando en esa zona. Funciona exactamente igual y tiene el mismo costo: ninguno.`

10. **¿Guardan o comparten mis datos?**
`Usamos tus datos solo para responder tu consulta de tasación. No los vendemos ni los compartimos con terceros. La página no usa cookies de publicidad ni de seguimiento de terceros.`

**S4 — accentband** (P8 full-bleed `--ink` `.grain`)
- text: `¿Tu pregunta no está acá? Escribinos y te respondemos, aunque no termines pidiendo nada.`
- CTA: `Escribinos por WhatsApp`

**S5 statement**
- `.statement`: `Si la respuesta honesta es "depende", decimos "depende" y explicamos de qué.`
- sub: `Inventar un plazo o un precio para sonar más seguro es la forma más rápida de quedar mal después.`

**FAQPage-schema:** endast **en** sida får bära `FAQPage` för samma frågor.
`/preguntas-frecuentes/` bär hela `FAQPage` med alla 10. `index.html`
**behåller** sitt `FAQPage` med sina 5 — de fem frågorna finns på båda
sidorna som text, men för att undvika dubblettmarkering tas `FAQPage`-blocket
bort ur `index.html` och lever bara på `/preguntas-frecuentes/`. Detta är
den enda tillåtna ändringen i `index.html`s JSON-LD.

---

### 5.13 `/guias/que-es-una-tasacion-inmobiliaria/`

⚠️ Ämnet är valt på branschlogik, inte ur en KWP-export (⚠️7). Sidan är
byggbar som den står.

**title:** `Qué es una tasación inmobiliaria | Tasación.com.py`
**meta description:** `Qué es una tasación inmobiliaria, para qué sirve, en qué se diferencia del precio de venta y del avalúo fiscal, y cuándo hace falta un informe escrito. Guía para propietarios en Paraguay.`

**S1 hero** (P2)
- eyebrow: `Guía`
- H1: `Qué es una tasación inmobiliaria`
- lede: `Una explicación corta y sin vueltas de qué es, para qué sirve, y por qué el número que sale de una tasación casi nunca coincide con el que tenías en la cabeza.`

**S2 — `.prose`, löptext**

H2 `Una tasación es una estimación fundamentada, no una opinión`
`Tasar un inmueble es estimar cuánto vale según sus características y según lo que se está pagando por propiedades parecidas en la misma zona. La palabra que hace todo el trabajo ahí es "fundamentada": cualquiera puede decir un número, pero una tasación tiene que poder explicar de dónde salió ese número y qué pasa si cambiás uno de los datos de entrada.`
`Por eso una tasación seria siempre te va a dar un rango, no un valor único. Toda propiedad se mueve dentro de una franja según quién sea el comprador, cuánto apuro haya y en qué momento del año se publique. Decirte "vale exactamente esto" es prometerte una precisión que no existe.`

H3 `Tasación no es lo mismo que precio de venta`
`El precio de venta es el número que vos elegís publicar. Podés ponerlo por encima o por debajo de la tasación, y es una decisión legítima. Lo que no se puede es esperar que el mercado no lo note.`
`La diferencia entre los dos casi siempre se paga en tiempo. Una propiedad publicada muy por encima de su valor no se vende más caro: se queda quieta, acumula meses de publicación y, cuando finalmente bajás, ya arrastra la sospecha de "algo tiene que tener, hace ocho meses que está".`

H3 `Tasación no es lo mismo que avalúo fiscal`
`El avalúo fiscal es el valor que la municipalidad asigna al inmueble para calcular el impuesto inmobiliario. Tiene una función administrativa y no busca reflejar el precio de mercado. Es habitual que quede muy por debajo de lo que la propiedad realmente vale, así que no sirve para decidir a cuánto publicar ni para negociar.`

H3 `Cuándo alcanza con un rango y cuándo hace falta un informe`
`Si lo que querés es saber en qué números te estás moviendo —antes de publicar, antes de aceptar una oferta o antes de decidir si te conviene vender ahora— un rango de valor alcanza y sobra.`
`Si el valor tiene que quedar por escrito para que lo lea otra persona —una sucesión, una división de bienes, un trámite judicial, una negociación entre socios— el rango no sirve. Ahí hace falta un documento con metodología, comparables y registro fotográfico.`
- inline `.card--accent` mitt i texten:
  H3 `En resumen` — `Rango de valor: para decidir. Informe escrito: para que otro decida con eso. Si no estás seguro de cuál necesitás, contanos el caso y te lo decimos antes de que gastes nada.`
  CTA: `Consultá cuál necesitás` (WhatsApp)

H3 `Qué mueve el valor de una propiedad`
`Los mismos cinco factores en todos los casos, con distinto peso según el tipo de inmueble: ubicación y cuadra, superficie de terreno y de construcción medidas por separado, antigüedad y estado real, qué se está pagando por comparables cercanos, y qué se puede hacer legalmente en ese lote según la zonificación.`
- länk i löptext: `Cada tipo de inmueble los ordena distinto — mirá cómo funciona en` → `/servicios/tasacion-de-casas-y-departamentos/` och `/servicios/tasacion-de-terrenos/`.

**S4 accentband** (P8) — `Un rango de valor sin costo, por WhatsApp, sin visita a oficina.` + CTA `Pedí el tuyo`

**S5 statement**
- `.statement`: `Tasar no es adivinar el número. Es poder explicarlo.`
- sub: `Si nadie te explica de dónde salió, no te dieron una tasación: te dieron una opinión.`

---

### 5.14 `/guias/documentos-para-tasar-un-inmueble/`

⚠️ Samma reservation som 5.13 (⚠️7).

**title:** `Qué documentos hacen falta para tasar un inmueble | Tasación.com.py`
**meta description:** `Qué documentos hacen falta para tasar un inmueble en Paraguay: para el rango online y para el informe formal, qué pasa si falta alguno y qué hacer cuando la construcción no está declarada.`

**S1 hero** (P2)
- eyebrow: `Guía`
- H1: `Qué documentos hacen falta para tasar un inmueble`
- lede: `Depende de qué tasación necesites. Para un rango de valor online, muy poco. Para un informe escrito, bastante más — y conviene saberlo antes de empezar y no a mitad del trámite.`

**S2 — `.prose`**

H2 `Para el rango online: ningún documento`
`Para darte un rango de valor por WhatsApp no necesitamos papeles. Necesitamos datos, que es otra cosa: dónde está exactamente la propiedad, cuánto mide de terreno y cuánto de construcción, qué antigüedad tiene, en qué estado están las instalaciones y algunas fotos del frente y del interior.`
`Si no sabés alguno de esos datos, no es un problema: decinos cuáles no sabés y trabajamos con lo que hay. El rango va a salir más ancho, pero va a salir, y te vamos a decir qué dato conseguir para achicarlo.`

H2 `Para el informe formal: documentación de la propiedad`
`Acá sí hace falta documentación, porque el informe tiene que identificar el inmueble sin ambigüedad y describir de qué superficie se está hablando. Qué documentos exactamente depende del tipo de inmueble y del uso que le vayas a dar al informe, así que la lista definitiva te la pasamos cuando nos cuentes el caso.`
`En términos generales, lo que se pide gira alrededor de tres cosas: algo que acredite la titularidad, algo que acredite la superficie y los linderos, y algo que muestre qué está construido sobre el terreno. A eso se suma el acceso al inmueble para la visita.`
- inline `.card--accent`:
  H3 `La lista exacta te la pasamos antes de empezar` — `No publicamos una lista cerrada porque cambia según el caso y porque una lista genérica sirve para asustar, no para ayudar. Contanos qué tipo de inmueble es y para qué necesitás el informe, y te decimos exactamente qué conseguir. Sin costo y sin compromiso.`
  CTA: `Pedí tu lista de documentos` (WhatsApp)

H3 `Qué pasa si falta algo`
`Casi siempre falta algo, y casi siempre hay una forma de resolverlo. Lo importante es detectarlo al principio: si arrancamos el trabajo y el faltante aparece a mitad de camino, perdés tiempo vos y lo perdemos nosotros. Por eso la primera conversación es sobre documentación y no sobre precio.`

H3 `El caso más frecuente: construcción sin declarar`
`Ampliaciones, quinchos, un piso más, un departamento en el fondo. Es muy común y no impide tasar, pero sí cambia dos cosas. Primero, esos metros no valen lo mismo que los regularizados. Segundo, el comprador lo va a descubrir y lo va a usar para negociar el precio hacia abajo.`
`Lo que hacemos es dejarlo explícito en el informe en lugar de disimularlo. Un informe que oculta eso no te protege: se cae en la primera revisión seria y te deja peor parado que si lo hubieras dicho vos.`
- länk i löptext: `Mirá cómo se arma el documento completo en` → `/servicios/informe-de-tasacion/`

H3 `Y si la propiedad está en sucesión`
`Es uno de los motivos más habituales por los que nos escriben. Contanos en qué etapa está el trámite y quién lo está llevando: eso define qué documentación hay disponible hoy y qué se puede pedir. No hace falta que esté todo resuelto para empezar a hablar.`

**S4 accentband** (P8) — `Contanos tu caso y te decimos exactamente qué documentos conseguir.` + CTA `Consultá sin compromiso`

**S5 statement**
- `.statement`: `El faltante que aparece a mitad del trámite cuesta más que el que se detecta el primer día.`
- sub: `Por eso la primera conversación es sobre papeles y no sobre precio.`

---

### 5.15 `404.html`

- H1: `Esta página no existe`
- lede: `Puede que el enlace esté viejo o que hayamos movido la página. Desde acá podés seguir a cualquier parte del sitio.`
- `.linkgrid` med samma 8 kort som §4.2
- CTA: `Escribinos por WhatsApp`
- `<meta name="robots" content="noindex,nofollow">` permanent på denna sida.

---

## 6. BILDPLAN

8 assets finns. Alla i `640/1280/1920` × `avif` + `webp`, plus `og-tasacion-com-py.jpg`.
**Inga nya bilder genereras i det här bygget.**

| Fil (bas) | Används på | Slot | Alt-text (ordagrant) |
|---|---|---|---|
| `tasacion-de-inmuebles-asuncion` | `/` (finns) | `hero-bleed` | *(oförändrad)* |
| `tasacion-casas-departamentos-asuncion` | `/servicios/tasacion-de-casas-y-departamentos/` S1 | `card-motif` → hero | `Casa familiar de una planta en el Gran Asunción, con muro de piedra y cochera al frente` |
| | `/zonas/san-lorenzo/` S5 | `section-break` | `Vivienda familiar en una calle residencial de San Lorenzo` |
| `tasacion-terrenos-paraguay` | `/servicios/tasacion-de-terrenos/` S1 | hero | `Terreno baldío con alambrado perimetral en las afueras del Gran Asunción` |
| | `/zonas/interior/` S4 | `section-break` | `Terreno sin construir en una zona de baja densidad del interior del país` |
| `tasacion-locales-comerciales-asuncion` | `/servicios/tasacion-de-locales-comerciales/` S1 | hero | `Local comercial en planta baja sobre una calle céntrica de Asunción` |
| | `/zonas/fernando-de-la-mora/` S4 | `section-break` | `Local comercial sobre una avenida de Fernando de la Mora` |
| `informe-de-tasacion-linderos-paraguay` | `/servicios/informe-de-tasacion/` S1 | hero | `Tasador revisando el plano de mensura de un inmueble junto a un mojón de amojonamiento` |
| `tasador-midiendo-propiedad-asuncion` | `/servicios/tasacion-de-casas-y-departamentos/` S4 | `section-break` | `Tasador midiendo la fachada de una vivienda en el Gran Asunción` |
| `tasador-de-terrenos-gran-asuncion` | `/servicios/tasacion-de-terrenos/` S4 | `section-break` | `Tasador recorriendo un terreno sin construir en el Gran Asunción` |
| | `/zonas/luque/` S4 | `section-break` | `Terreno en un loteamiento del Gran Asunción, con la calle sin asfaltar al frente` |
| `og-tasacion-com-py.jpg` | alla sidor, `og:image` | — | `Tasador de Tasación.com.py señalando un terreno en el Gran Asunción` |

**Sidor helt utan bild** (medvetet — typografin bär dem):
`/servicios/tasacion-online/`, `/zonas/luque/` S1, `/zonas/san-lorenzo/` S1,
`/zonas/fernando-de-la-mora/` S1, `/cotizador/`, `/contacto/`,
`/preguntas-frecuentes/`, båda guiderna, `404.html`.

Regler som gäller varje bildinsättning:

- Alltid `<picture>` med `avif` först, `webp` som `<source>`, `webp` som `<img src>`.
- Hero-bilden på en sida: `fetchpriority="high"`, **ingen** `loading="lazy"`, plus `<link rel="preload" as="image">` i `<head>` med samma `imagesrcset`/`imagesizes` som `index.html` använder.
- Alla andra bilder: `loading="lazy" decoding="async"` och explicit `width`/`height`.
- `sizes` kopieras från motsvarande slot i `index.html`.
- **Ingen bild får presenteras som ett eget utfört jobb.** Ingen `proof-photo`. Inga namn, inga ansikten som testimonials, inget "nuestro equipo".
- **Ingen dekorativ SVG-diagram.** Om en sektion känns tom: korta ner den eller ta bort den.

⚠️ Två bilder återanvänds på två sidor var. Det är acceptabelt i denna omgång.
Innan CORE 15 utökas bör `build-images.mjs` köras för tre zonspecifika motiv
(Luque, San Lorenzo, Fernando de la Mora) — noteras i `PLACEHOLDERS.md`.

---

## 7. `/cotizador/` — fält och logik

### 7.1 En avvikelse som är avsiktlig, och varför

`web-design-system` P10 och §10.6 pekar mot en kalkylator som ger ett
**intervall**. För tasación går det inte att göra ärligt: ett värdeintervall
kräver en comparables-tabell som inte finns, och `index.html` säger redan
ordagrant *"No calcula nada ni te muestra un precio"*. En kalkylator som
spottar ut Gs.-belopp skulle (a) motsäga startsidan på samma domän och
(b) publicera påhittade siffror, vilket §5 förbjuder.

**Därför byggs `/cotizador/` som en kvalificerare, inte som en priskalkylator.**
Den räknar fram en sak som är sann: hur komplett underlaget är, och därmed hur
snävt rangen kommer att kunna bli. CTA:t är `Presupuesto sin costo`, precis
som §10.6 föreskriver. Inga belopp publiceras.

**Option B — gated.** Om användaren senare levererar en verklig comparables-
tabell (Gs./m² per ort och inmuebletyp, med datum och källa), kan sektion S3
kompletteras med ett verkligt intervallutfall. **Den varianten byggs inte nu
och får inte byggas på uppskattade siffror.** Den ligger i `PLACEHOLDERS.md`
som ett blockerat objekt.

### 7.2 Fält

Överbygger `index.html` §06-kvalificeraren. Samma åtta fält, tre nya, samma
`id`-konvention så `site.js`-logiken kan återanvändas.

| id | Typ | Etikett | Alternativ / placeholder | Obl. |
|---|---|---|---|---|
| `q-tipo` | select | `Tipo de propiedad` | Casa · Departamento · Terreno · Local comercial · Duplex · Depósito o galpón | ja |
| `q-ciudad` | select | `Ciudad` | Asunción · Luque · San Lorenzo · Fernando de la Mora · Lambaré · Capiatá · Mariano Roque Alonso · Ñemby · Villa Elisa · Otra ciudad | ja |
| `q-barrio` | text | `Barrio o referencia` *(opcional)* | `Ej: Villa Morra, sobre Molas López` | nej |
| `q-terreno` | text, `inputmode="numeric"` | `Superficie de terreno` *(m², opcional)* | `Ej: 360` | nej |
| `q-construido` | text, `inputmode="numeric"` | `Superficie construida` *(m², opcional)* | `Ej: 145` | nej |
| `q-frente` | text, `inputmode="numeric"` | `Frente sobre la calle` *(metros, opcional)* | `Ej: 12` | nej |
| `q-antiguedad` | select | `Antigüedad` | A estrenar · Menos de 5 años · Entre 5 y 15 años · Entre 15 y 30 años · Más de 30 años · No lo sé | nej |
| `q-estado` | select | `Estado` | A estrenar · En buen estado · Necesita refacciones · Necesita refacción completa · Todavía no lo sé | nej |
| `q-motivo` | select | `¿Para qué necesitás la tasación?` | Quiero vender · Quiero alquilar · Sucesión o división de bienes · Trámite judicial · Estoy por comprar y quiero saber si el precio es razonable · Solo quiero saber cuánto vale | ja |
| `q-ocupacion` | select | `¿Está ocupada?` | La habito yo · Está alquilada · Está vacía · No lo sé | nej |
| `q-extra` | textarea | `Algo más que debamos saber` *(opcional)* | `Ej: tiene título, está alquilada, hay una construcción sin planos…` | nej |

Ingen `required`-attribut som blockerar — "obl." ovan betyder att fältet
markeras i UI och att mätaren i 7.3 räknar det. Sidan får aldrig hindra någon
från att skicka en ofullständig konsult.

### 7.3 Logiken (det enda som beräknas)

En **completitud-mätare**, inget annat. Ren vanilla JS i sidans egen
`<script>`, samma stil som `index.html`s kvalificerare.

```
Vikter (summa = 100):
  q-tipo         20
  q-ciudad       20
  q-motivo       15
  q-terreno      10   (endast om ifyllt och > 0)
  q-construido   10   (endast om ifyllt och > 0)
  q-estado       10
  q-barrio        5
  q-frente        5
  q-antiguedad    5
  q-ocupacion     0   (påverkar inte poängen, men går med i meddelandet)
  q-extra         0   (samma)

score = summan av vikterna för ifyllda fält, clamp 0–100
```

Tre utfall, ordagrant text (`aria-live="polite"`, uppdateras vid varje `input`/`change`):

| score | Etikett | Text under mätaren |
|---|---|---|
| 0–39 | `Nos falta bastante` | `Con esto podemos empezar la conversación, pero el rango va a salir muy ancho. Si podés, agregá la superficie y el estado.` |
| 40–74 | `Ya podemos trabajar` | `Con estos datos te devolvemos un rango razonable. Cualquier dato más que agregues lo achica.` |
| 75–100 | `Datos completos` | `Con esto el rango sale bien ajustado. Sumá algunas fotos cuando nos escribas y mejor todavía.` |

Visuellt: en 6px hög bar (`background:var(--hairline)`, fyllning
`background:var(--accent)`, `border-radius:var(--r-sm)`,
`transition:width var(--dur) var(--ease-out)`) plus etiketten i `.eyebrow`-stil.
Ingen procentsiffra visas — siffran skulle läsas som ett betyg.

Meddelandebyggaren är **identisk** med `index.html`s (samma `labels`-map,
utökad med de tre nya fälten), med denna huvudrad:

```
Hola, vengo de tasacion.com.py (cotizador) - quiero un presupuesto sin costo.
```

Nya etiketter i `labels`: `q-frente` → `Frente (m)`, `q-antiguedad` →
`Antigüedad`, `q-ocupacion` → `Ocupación`.

**Förbjudet på denna sida:** varje Gs.-belopp, varje "estimación", varje
tal som kan läsas som ett värde på fastigheten, varje procentsats om värde.

---

## 8. GUIDE-ÄMNENA

| URL | Primärt sökord | Vald för att |
|---|---|---|
| `/guias/que-es-una-tasacion-inmobiliaria/` | qué es una tasación inmobiliaria | Definitionsfrågan är toppen av den informationella svansen och den enda som naturligt länkar vidare till både `/servicios/tasacion-online/` och `/servicios/informe-de-tasacion/`. |
| `/guias/documentos-para-tasar-un-inmueble/` | documentos para tasar un inmueble | Frågan som blockerar köp av informe. Den fångar trafik som redan bestämt sig och tar bort den vanligaste invändningen innan första kontakten. |

⚠️ Båda är valda på branschlogik. **Innan CORE 15 utökas till sida 16+ måste en
riktig KWP-export köras** och guide-svansen tas därifrån (§10.4.1). Ämnena
ovan är byggbara utan den, men listan över *fler* guider får inte hittas på.

---

## 9. WHATSAPP-PREFILL PER SIDA (§10.5)

Alla länkar: `https://wa.me/595995628862?text=` + URL-kodad text.
Alla bär `data-ev="whatsapp_click"` + `data-ev-loc`.
`WA_NUMBER`-konstanten skriver om numret vid load; de literala `href`-värdena
är fallback utan JS.

Mönstret är låst: `Hola, vengo de tasacion.com.py ({loc}) - {intención}`

| Sida | `data-ev-loc` | Meddelandetext (avkodad) |
|---|---|---|
| alla | `header` | `Hola, vengo de tasacion.com.py (header) - ` |
| alla | `fab` | `Hola, vengo de tasacion.com.py (fab) - ` |
| alla | `mobilebar` | `Hola, vengo de tasacion.com.py (movil) - ` |
| alla | `footer` | `Hola, vengo de tasacion.com.py (footer) - ` |
| `/servicios/tasacion-online/` | `online-hero` | `Hola, vengo de tasacion.com.py (tasación online) - quiero un rango de valor sin costo. Mi propiedad es: ` |
| `/servicios/tasacion-online/` | `online-contacto` | `Hola, vengo de tasacion.com.py (tasación online) - quiero empezar. Mi propiedad es: ` |
| `/servicios/tasacion-de-casas-y-departamentos/` | `casas-hero` | `Hola, vengo de tasacion.com.py (casas y departamentos) - quiero tasar una casa o departamento en: ` |
| `/servicios/tasacion-de-casas-y-departamentos/` | `casas-contacto` | `Hola, vengo de tasacion.com.py (casas y departamentos) - mi propiedad está en: ` |
| `/servicios/tasacion-de-terrenos/` | `terrenos-hero` | `Hola, vengo de tasacion.com.py (terrenos) - quiero tasar un terreno en: ` |
| `/servicios/tasacion-de-terrenos/` | `terrenos-contacto` | `Hola, vengo de tasacion.com.py (terrenos) - mi terreno está en: ` |
| `/servicios/tasacion-de-locales-comerciales/` | `locales-hero` | `Hola, vengo de tasacion.com.py (locales comerciales) - quiero tasar un local en: ` |
| `/servicios/tasacion-de-locales-comerciales/` | `locales-contacto` | `Hola, vengo de tasacion.com.py (locales comerciales) - mi local está en: ` |
| `/servicios/informe-de-tasacion/` | `informe-hero` | `Hola, vengo de tasacion.com.py (informe) - necesito un informe formal de tasación para: ` |
| `/servicios/informe-de-tasacion/` | `informe-presupuesto` | `Hola, vengo de tasacion.com.py (informe) - quiero el presupuesto sin costo del informe. Mi caso es: ` |
| `/zonas/luque/` | `luque-hero` | `Hola, vengo de tasacion.com.py (Luque) - quiero tasar una propiedad en Luque. Es un/a: ` |
| `/zonas/luque/` | `luque-contacto` | `Hola, vengo de tasacion.com.py (Luque) - mi propiedad está en: ` |
| `/zonas/san-lorenzo/` | `sanlorenzo-hero` | `Hola, vengo de tasacion.com.py (San Lorenzo) - quiero tasar una propiedad en San Lorenzo. Es un/a: ` |
| `/zonas/san-lorenzo/` | `sanlorenzo-contacto` | `Hola, vengo de tasacion.com.py (San Lorenzo) - mi propiedad está en: ` |
| `/zonas/fernando-de-la-mora/` | `fdlm-hero` | `Hola, vengo de tasacion.com.py (Fernando de la Mora) - quiero tasar una propiedad en Fernando de la Mora, zona: ` |
| `/zonas/fernando-de-la-mora/` | `fdlm-contacto` | `Hola, vengo de tasacion.com.py (Fernando de la Mora) - mi propiedad está en: ` |
| `/zonas/interior/` | `interior-hero` | `Hola, vengo de tasacion.com.py (interior) - mi propiedad está en: ` |
| `/zonas/interior/` | `interior-contacto` | `Hola, vengo de tasacion.com.py (interior) - quiero saber si pueden llegar hasta: ` |
| `/cotizador/` | `cotizador` | *(byggs dynamiskt, huvudrad:)* `Hola, vengo de tasacion.com.py (cotizador) - quiero un presupuesto sin costo.` |
| `/contacto/` | `contacto` | `Hola, vengo de tasacion.com.py (contacto) - quiero pedir una tasación. Mi propiedad es: ` |
| `/preguntas-frecuentes/` | `faq` | `Hola, vengo de tasacion.com.py (preguntas) - tengo una consulta sobre: ` |
| `/guias/que-es-una-tasacion-inmobiliaria/` | `guia-que-es` | `Hola, vengo de tasacion.com.py (guía: qué es una tasación) - quiero saber cuál necesito para: ` |
| `/guias/documentos-para-tasar-un-inmueble/` | `guia-documentos` | `Hola, vengo de tasacion.com.py (guía: documentos) - quiero la lista de documentos para: ` |
| `404.html` | `404` | `Hola, vengo de tasacion.com.py (404) - ` |

`tel:`-länkar bär `data-ev="call_click"` med `data-ev-loc` `header`, `hero`,
`contacto`, `mobilebar` eller `footer`.

---

## 10. TEKNISK SEO PER SIDA

Varje ny sida bär, utan undantag:

```html
<meta name="robots" content="noindex,nofollow">   ← tas bort vid lansering (§11)
<link rel="canonical" href="https://tasacion.com.py{URL}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_PY">
<meta property="og:site_name" content="Tasación.com.py">
<meta property="og:url" content="https://tasacion.com.py{URL}">
<meta property="og:title" content="{title utan  | Tasación.com.py}">
<meta property="og:description" content="{meta description}">
<meta property="og:image" content="https://tasacion.com.py/assets/img/og-tasacion-com-py.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```

Plus samma `favicon` (data-URI), samma `theme-color`, samma `viewport`.

### 10.1 Breadcrumbs

Synlig `.crumbs`-rad direkt under headern på varje sida utom `/`:

```
Inicio  ›  Servicios  ›  Tasación de terrenos
Inicio  ›  Zonas  ›  Luque
Inicio  ›  Guías  ›  Qué es una tasación inmobiliaria
Inicio  ›  Cotizador
```

`Servicios`, `Zonas` och `Guías` är mellannivåer **utan egen sida**. De renderas
därför som text, inte som länk, i den synliga raden — och utelämnas ur
`BreadcrumbList` (bara noder med URL tas med), så markeringen aldrig pekar på
en 404.

`BreadcrumbList` JSON-LD per undersida:

```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"Inicio","item":"https://tasacion.com.py/"},
 {"@type":"ListItem","position":2,"name":"{H1 kort}","item":"https://tasacion.com.py{URL}"}
]}
```

### 10.2 Schema per sidtyp

- **Alla sidor:** `LocalBusiness`-blocket kopieras **oförändrat** från `index.html` (utan `streetAddress`, utan `aggregateRating`, utan `openingHours`).
- **`/servicios/*`:** dessutom ett `Service`-block:
```json
{"@context":"https://schema.org","@type":"Service",
 "serviceType":"{primärt sökord}",
 "provider":{"@type":"LocalBusiness","name":"Tasación.com.py","url":"https://tasacion.com.py/"},
 "areaServed":[{"@type":"City","name":"Asunción"},{"@type":"City","name":"Luque"},
   {"@type":"City","name":"San Lorenzo"},{"@type":"City","name":"Fernando de la Mora"},
   {"@type":"City","name":"Lambaré"},{"@type":"City","name":"Capiatá"},
   {"@type":"City","name":"Mariano Roque Alonso"}],
 "description":"{meta description}"}
```
  **Ingen `offers`, inget `priceRange`, inget `aggregateRating`.**
- **`/zonas/*`:** `Service` med `areaServed` = enbart den orten (`interior` = `{"@type":"Country","name":"Paraguay"}`).
- **`/preguntas-frecuentes/`:** hela `FAQPage` med de 10 frågorna. Enda sidan med `FAQPage` (se 5.12).
- **Guider:** `Article` med `headline`, `description`, `inLanguage:"es-PY"`, `author`/`publisher` = `{"@type":"Organization","name":"Tasación.com.py","url":"https://tasacion.com.py/"}`. **Inget `datePublished` som inte är sant** — sätt det till byggdatumet eller utelämna fältet.

### 10.3 `sitemap.xml`

Skrivs om med alla 15 URL:er. `<lastmod>` = byggdatum för alla.
`priority`: `/` = 1.0 · `/servicios/*` = 0.9 · `/zonas/*` = 0.8 ·
`/cotizador/` = 0.8 · `/guias/*` = 0.7 · `/contacto/` och
`/preguntas-frecuentes/` = 0.6. `changefreq` = `monthly` överallt.
`404.html` tas **inte** med.

### 10.4 Prestanda

- Sidvikt ≤ 500 KB per sida.
- Ett Google Font-par, laddat exakt som i `index.html`.
- `site.css` + `site.js` är externa och delas mellan sidorna (cachas efter första sidan).
- Kritisk CSS inline per sida enligt §2.3.
- Hero-bild preloadad; allt annat `lazy`.
- Träffytor ≥ 48×48 px. FAB ≥ 56 px.
- Brytpunkter: **endast** 640 / 1024 / 1280. Inga andra.
- Noll horisontell scroll på 360 / 390 / 768 / 1024 / 1440.

---

## 11. ÄNDRINGAR I BEFINTLIGA FILER

Dessa är de **enda** tillåtna ändringarna i redan levererade filer:

| Fil | Ändring | Får INTE |
|---|---|---|
| `index.html` | CSS flyttas till `site.css`, kritisk delmängd kvar inline (§2.3) | ändra ett enda tokenvärde |
| `index.html` | JS flyttas till `site.js`, kvalificeraren stannar kvar (§2.4) | ändra kvalificerarens beteende |
| `index.html` | `.nav` läggs till i headern; `.ftr__nav` får riktiga sidlänkar (§2.5) | ta bort ankarlänkarna till sidans egna sektioner |
| `index.html` | ny `#paginas` `.linkgrid`-sektion mellan `#zonas` och `#faq` (§4.2) | flytta eller skriva om någon befintlig sektion |
| `index.html` | `FAQPage` JSON-LD tas bort (flyttas till `/preguntas-frecuentes/`) | röra `LocalBusiness`-blocket |
| `gracias.html` | samma header/footer/nav som övriga sidor; `WA_NUMBER` kvar | tappa `noindex` |
| `lead-forward.php` | **inga ändringar** | — |
| `robots.txt` | `Disallow: /` behålls (DEMO). Produktionsblocket ligger kvar utkommenterat. | avblockera |
| `sitemap.xml` | skrivs om enligt 10.3 | — |
| `PLACEHOLDERS.md` | uppdateras: nya blockerade poster (comparables-tabell för cotizador Option B, tre zonbilder, KWP-export för guider) | ta bort befintliga poster |

**`noindex` stannar på alla 15 sidor.** Lanseringschecklistan i
`PLACEHOLDERS.md` §8 körs som ett eget, separat steg — inte i det här bygget.

---

## 12. LEAD-KOPPLING

- Endpoint: `/lead-forward.php` (absolut sökväg från undermappar).
- Slug: `tasacion`. `source` är hårdkodad till `site:tasacion` i handlern.
- Fältnamn (oförändrade): `nombre`, `telefono` (obligatoriskt), `email`,
  `mensaje`, `website` (honeypot), `page_url` (fylls av `site.js`).
- Formulär finns på **exakt två** sidor: `/` och `/contacto/`. Ingen annan sida
  får ett formulär — övriga konverterar via WhatsApp.
- ⚠️ `VENDERCRM_URL` och `VENDERCRM_API_KEY` saknas fortfarande. Handlern
  loggar till `leads.log` och redirectar 303 till `/gracias.html`. **Ingen
  ny endpoint, ingen `mailto:`, ingen tredjepartstjänst får läggas till.**

---

## 13. QA — kryssrutor (§9 kopierad in + web-design-system steg 7)

Körs **per sida**, alla 15. Rapportera pass/fail ärligt, sida för sida.

**Innehåll och sanning**
- [ ] Noll uppfunna reseñas, år, antal, garantier, matrículas, priser
- [ ] Inga synliga `[COMPLETAR]`, inga tomma rader, inga dinglande streck
- [ ] Inga ord om banker, hypotek eller BCP-habilitación (⚠️3)
- [ ] Inga Gs.-belopp någonstans på någon sida
- [ ] Ingen gatuadress, ingen karta, ingen nål; footern säger `Asunción, Paraguay`
- [ ] Ingen bild presenterad som eget utfört jobb; ingen `proof-photo` fylld

**Språk**
- [ ] Voseo genomgående i alla CTA (`Escribinos`, `Consultá`, `Pedí`, `Contanos`, `Mandanos`)
- [ ] Noll engelska i UI-text, noll "tú"-former (`escríbenos`, `llámanos`, `agenda`)
- [ ] `<html lang="es-PY">` på varje sida

**WhatsApp**
- [ ] Varje `wa.me`-länk har rätt nummerformat (`595995628862`, inga mellanslag, inget `+`)
- [ ] Varje `wa.me`-länk har sidspecifik förifylld text enligt §9
- [ ] `WA_NUMBER`-konstanten finns överst i varje HTML-fil
- [ ] Grön `#25D366` används ENDAST på WhatsApp-element
- [ ] Telefonnumret är klickbart och syns som text

**Layout (web-design-system steg 7)**
- [ ] Inga två sektioner i rad delar mönster
- [ ] ≥1 full-bleed per sida
- [ ] ≥1 overlap (element som korsar en sektionsgräns) per sida
- [ ] ≥1 oversized statement (`.statement`) per sida — och aldrig två
- [ ] ≥3 kortvarianter används, ingen mer än 4×
- [ ] Hero är aldrig ett centrerat textblock
- [ ] Motion: `data-reveal` på ≤15 % av elementen; ingen på hero-text
- [ ] `prefers-reduced-motion` respekteras

**Teknik**
- [ ] JSON-LD validerar på varje sida (`LocalBusiness` + sidtypens block)
- [ ] Exakt en `<h1>` per sida, och den matchar §3-tabellen ordagrant
- [ ] `BreadcrumbList` pekar aldrig på en URL som inte finns
- [ ] `FAQPage` finns på exakt en sida
- [ ] Canonical, og-taggar, viewport, favicon på varje sida
- [ ] Spanska alt-texter, ordagrant enligt §6
- [ ] Alla interna länkar slutar med `/` och returnerar 200 lokalt (`serve.mjs`)
- [ ] `sitemap.xml` innehåller exakt 15 URL:er, ingen 404
- [ ] Sidvikt ≤ 500 KB, träffytor ≥ 48 px
- [ ] Noll horisontell scroll på 360 / 390 / 768 / 1024 / 1440 (`document.documentElement.scrollWidth === document.documentElement.clientWidth`)
- [ ] Consent-banner finns på varje sida, inget förikryssat
- [ ] `noindex` kvar på alla 15 sidor + `gracias.html` + `404.html`
- [ ] `robots.txt` blockerar fortfarande allt

---

## 14. PLATSHÅLLARE — vad som fortfarande saknas efter detta bygge

Läggs till i `PLACEHOLDERS.md` när bygget är klart. Ingen av dessa får
uppfinnas för att fylla en sektion.

1. **RUC, factura legal, razón social** — ingen rad finns på någon av de 15 sidorna.
2. **Matrícula / registro profesional** — ingen förtroendesektion byggd.
3. **Habilitación BCP** — medvetet frånvarande. Om den någon gång finns är det en ny sektion, inte en rad.
4. **Dedikerat WhatsApp-nummer** — en rad per fil (`WA_NUMBER`), plus sök-och-ersätt av `595995628862` när bytet är definitivt.
5. **Prisgrid för informe** — blockerar inget i CORE 15, men krävs för en `/precios/`-sida.
6. **Comparables-tabell (Gs./m² per ort och typ, med datum och källa)** — blockerar `/cotizador/` Option B (§7.1).
7. **Reseñas** — inga. `aggregateRating` får inte läggas till förrän de finns, ordagrant och med förnamn + barrio.
8. **venderCRM URL + API-nyckel** — formulären loggar till `leads.log` tills vidare.
9. **KWP-export** — krävs innan guide-listan utökas bortom de två i §8.
10. **Tre zonspecifika bilder** (Luque, San Lorenzo, Fernando de la Mora) — `build-images.mjs`, samma stil som befintliga assets.
11. **Analytics-snippet** — `data-ev` är redan på plats överallt; aktivering är ett klipp i `<head>`.
12. **Lanseringschecklistan** (`PLACEHOLDERS.md` §8) — körs som eget steg efter detta bygge.

---

## 15. SPEC-TESTET

Varje rad ovan är ett värde, ett filnamn, ett mönsternamn eller färdig text.
Om exekveringen träffar en punkt som kräver ett beslut: **fråga, gissa inte.**
