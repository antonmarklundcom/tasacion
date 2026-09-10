# v3 — tasacion.com.py: credenciales reales, segmentación por finalidad, precios por finalidad

Spec escrita 2026-09-10 (sesión Fable, a partir del Q&A con Fernando Capurro del mismo día y
del audit CRO de esa sesión). La ejecuta **una sesión Sonnet** en tres PRs consecutivos contra
`master`, con el mismo protocolo de autonomía de `plan.md` §6 (que sigue vigente: Sonnet
solamente, nunca Fable/Mythos ni como subagente; PRs abiertos y mergeados por la misma sesión
cuando CI está verde; nunca deployar; dudas de base → `docs/decisions-needed.md` y terminar).

**Cómo arrancar (Anton):** en una ventana nueva con modelo **Sonnet** y permisos en auto-aceptar:
`Read prompts/v3-credenciales-y-finalidades.md in this repo and execute it.`

Lo que NO cambia: la guía de estilo `plan.md` §3 (tokens, tipografía, componentes) y el menú
WhatsApp §4 en su mecánica (un panel, triggers, JS genérico). Cambian los textos, las opciones y
lo que se afirma. Leer `plan.md` §1–§4 antes de tocar nada.

---

## 0. Qué pasó desde plan.md (contexto, no tareas)

- 2026-09-05: rediseño "informe oficial primero" mergeado (plan.md, PR-1…PR-4). Vivo.
- 2026-09-10 (`d2385cb`, `132a795`): se eliminó "gratis" de todo el sitio. La vieja "valoración
  gratis para vender" pasó a ser **"tasación para vender"**: mismo precio que el informe, y si
  el cliente firma exclusividad con un corredor asociado, el costo se descuenta de la comisión
  al cerrar. `/valuacion-para-vender/` ya está reescrita así. **No se reabre.**
- 2026-09-10: audit CRO (esta sesión) + `docs/LIVE-SITE-REVIEW-2026-09-06.md` (audit general,
  sigue válido; sus quick wins entran acá donde se indica).
- 2026-09-10: Fernando respondió por WhatsApp las preguntas de credenciales, plazo y precio.
  **Eso desbloquea todo lo que plan.md §1.3 prohibía inventar.** Los hechos nuevos están en §1
  y son los únicos que se pueden afirmar.

## 1. Hechos confirmados — cadenas canónicas (copiar textual, nunca parafrasear)

Cada hecho tiene UNA forma canónica en `content.mjs` (constante exportada). El copy la usa por
interpolación, no la reescribe. `verify.mjs` comprueba que cualquier mención del hecho use la
forma canónica (§7).

| # | Hecho (fuente: Fer, 2026-09-10) | Constante / cadena canónica | Qué NO decir |
|---|---|---|---|
| F1 | Fernando Capurro es **Perito Tasador matriculado ante la Corte Suprema de Justicia, matrícula N.º 4.168**. | `CRED_CSJ = 'Perito Tasador matriculado ante la Corte Suprema de Justicia, matrícula N.º 4.168'` · corta: `CRED_CSJ_CORTA = 'Perito Tasador CSJ · Mat. 4.168'` | "Habilitado por la CSJ", "certificado por la CSJ". Otro número. |
| F2 | Fernando es **Arquitecto, matrícula profesional N.º 3.738**, al día. | `CRED_ARQ = 'Arquitecto, matrícula profesional N.º 3.738'` | "Ingeniero". Otro número. |
| F3 | Su registro en el **BCP está en trámite**. No lo tiene. | — (no existe constante; no se menciona) | Nada. Ni "en trámite", ni "próximamente". Fernando NO es tasador BCP. |
| F4 | Para tasaciones de **crédito**, el informe lo **firma un tasador inscripto en el registro del BCP** con quien Fernando trabaja. Ese profesional no se nombra. **No se pueden nombrar bancos** (cada banco arma su propia nómina; Fer autoriza decir que trabajamos con todos los bancos y que al gestionar se ve cómo). | `CRED_BCP_FIRMA = 'el informe lo firma un tasador inscripto en el registro del BCP'` · `CRED_BCP_BANCOS = 'Trabajamos con todos los bancos y cooperativas: al gestionar tu carpeta coordinamos la firma que tu entidad requiere.'` | Que Fernando firma para bancos. "Habilitado por el BCP" (gate). Nombres de bancos (Ueno, Itaú, Continental → gate). "Aprobado por [banco]". El nombre del colega. |
| F5 | **Plazo**: informe firmado **3 a 5 días hábiles después de la visita** (suele ser 3; margen por si hay varias visitas). | `PLAZO_TXT = '3 a 5 días hábiles después de la visita'` | "En 3 días", "en 48 horas", "en minutos", "respondemos en" (gate). |
| F6 | **Precio por finalidad.** Compra/venta (lo más pedido; para saber si el precio pedido u ofrecido es correcto): Gs. 800.000 a 1.500.000. **Judicial — todo lo judicial, sucesiones incluidas** (herencias, remates, liquidaciones; lo piden abogados y jueces, informe más detallado): **Gs. 1.800.000 a 2.500.000**. **Crédito** (lleva la firma de otro profesional, que cuesta al menos 500.000): **desde Gs. 1.500.000**, sin tope publicado. | `PRECIOS = { compraventa: {min: 800000, max: 1500000}, judicial: {min: 1800000, max: 2500000}, credito: {min: 1500000, max: null} }` · `PRECIO_TXT` = rango compraventa (compat) · `PRECIO_JUDICIAL_TXT` = rango judicial · `PRECIO_CREDITO_TXT = 'desde Gs. 1.500.000'` | Cualquier otra cifra. Un tope para crédito. "Desde Gs. 800.000" sin decir para qué finalidad. |
| F7 | **Tasación para vender** (corredor asociado): mismo rango que compraventa; se descuenta de la comisión si hay exclusividad. (Decisión Anton 2026-09-10, ya en producción.) | ya en `content.mjs` (freeAsideVender, página vender) | "Gratis", "sin costo". |
| F8 | Finalidades por credencial (palabras de Fer): **CSJ** → valor de herencias/sucesiones, remates judiciales, liquidaciones, base para honorarios de abogados y jueces. **BCP** → crédito hipotecario o fiduciario, remates bancarios por ejecución de hipoteca. **Compra/venta** → saber si el precio pedido u ofrecido es correcto; lo hace cualquiera de los dos tasadores; es lo que más se pide. | se usa en `useCases` §3 y en el hub `/informes-periciales/` | Inventar más finalidades. |
| F9 | **Servicio nuevo B2B — franja de dominio** (palabras de Fer): es la franja que "agarra" la ruta y hay que liberar para construirla; suele afectar muchos lotes. El trabajo: relevamiento (mediciones de todas las edificaciones y terrenos dentro de la franja) → cómputo → valor de mercado → informe que se presenta al consorcio que tiene la licitación → el Estado indemniza a las familias afectadas. Se cotiza **por proyecto, según cantidad de lotes y edificaciones a relevar**. | nueva página `/tasaciones/franja-de-dominio/` (§5.14); `FRANJA_COTIZA = 'Presupuesto por proyecto, según la cantidad de lotes y edificaciones dentro de la franja.'` | Cifras. Nombres de rutas, consorcios, proyectos o familias. |
| F10 | **IVA y factura**: los precios pueden publicarse con IVA; Fer prefiere sumar el 10 % porque **emite factura legal**, y a muchos clientes les importa. | `IVA_TXT = '+ IVA'` · `FACTURA_TXT = 'Emitimos factura legal'` — ver D1 en §2 | Publicar una cifra sin aclarar IVA. |
| F11 | 800.000 fue un precio de prueba de Fer; le sirve si entran 10–20 tasaciones/mes. | (contexto de negocio; no va al sitio) | — |

Todo lo que plan.md §1.3 seguía prohibiendo y Fer NO confirmó sigue prohibido: RUC, timbrado,
dirección, teléfono dedicado, reseñas, años de experiencia, cantidad de tasaciones, nombres de
clientes, nombre del colega firmante, nombres de bancos.

## 2. Estado de las preguntas — todas respondidas por Fer el 2026-09-10; una decisión de Anton

Q1 (precio crédito) → F6. Q2 (nombrar bancos) → **no**, F4. Q3 (matrículas) → F1/F2. Q4 (rango
judicial) → todo lo judicial, sucesiones incluidas, F6. Q5 (franja) → F9. Q6 (IVA) → F10.

| D | Decisión pendiente (Anton) | Constante | Default del build si no hay respuesta |
|---|---|---|---|
| Q7 | (Pendiente para Fer, no bloquea) ¿Podés comprometer la **visita dentro de 48 horas hábiles** en Asunción y Gran Asunción? | `VISITA_TXT` | `null` → la fila de confianza dice solo `Informe firmado en ${PLAZO_TXT}`. Si Fer dice sí: `VISITA_TXT = 'Visita en 48 horas hábiles en Asunción y Gran Asunción'` y se antepone en la fila de confianza, el bloque de valor y el paso 2 de `steps`. |
| D1 | **DECIDIDO (Anton, 2026-09-10): precios "+ IVA".** Cifras redondas actuales; cada rango se renderiza como `Gs. 800.000 a Gs. 1.500.000 + IVA`; `FACTURA_TXT` va en la fila de confianza de las páginas con precio y al pie de `pricingTiers`. | `IVA_TXT = '+ IVA'`, `PRECIOS` sin cambios | — (no hay fallback; está decidido). |

## 3. Contrato de contenido — cambios aditivos a plan.md §2

```js
// content.mjs — nuevas constantes (todas exportadas)
export const CRED_CSJ = 'Perito Tasador matriculado ante la Corte Suprema de Justicia, matrícula N.º 4.168';
export const CRED_CSJ_CORTA = 'Perito Tasador CSJ · Mat. 4.168';
export const CRED_ARQ = 'Arquitecto, matrícula profesional N.º 3.738';
export const CRED_BCP_FIRMA = 'el informe lo firma un tasador inscripto en el registro del BCP';
export const CRED_BCP_BANCOS = 'Trabajamos con todos los bancos y cooperativas: al gestionar tu carpeta coordinamos la firma que tu entidad requiere.';
export const PLAZO_TXT = '3 a 5 días hábiles después de la visita';
export const IVA_TXT = '+ IVA';                    // D1; alternativa 'IVA incluido' con cifras × 1,1
export const FACTURA_TXT = 'Emitimos factura legal';
export const PRECIOS = { compraventa: { min: 800000, max: 1500000 }, judicial: { min: 1800000, max: 2500000 }, credito: { min: 1500000, max: null } };
export const PRECIO_TXT = rango(PRECIOS.compraventa);          // compat: "Gs. 800.000 a Gs. 1.500.000" (sin IVA_TXT; se agrega al renderizar)
export const PRECIO_JUDICIAL_TXT = rango(PRECIOS.judicial);    // "Gs. 1.800.000 a Gs. 2.500.000"
export const PRECIO_CREDITO_TXT = `desde ${fmtGs(PRECIOS.credito.min)}`; // "desde Gs. 1.500.000"
export const PRECIO_NOTA = 'según tipo y tamaño del inmueble; te confirmamos el monto exacto por WhatsApp antes de agendar la visita';
export const FRANJA_COTIZA = 'Presupuesto por proyecto, según la cantidad de lotes y edificaciones dentro de la franja.';
export const VISITA_TXT = null;                    // Q7; 'Visita en 48 horas hábiles en Asunción y Gran Asunción' si Fer confirma
export const EJEMPLO = { valor: 400000000, error: 0.05 }; // §5.15: ejemplo aritmético, único lugar con estas cifras
// EJEMPLO.valor * EJEMPLO.error = 20.000.000 = más de 10 veces el informe más caro de compraventa (1.500.000 + IVA).
// Regla de render: toda cifra de precio va seguida de IVA_TXT en el mismo nodo de texto
// ("Gs. 800.000 a Gs. 1.500.000 + IVA"). El gate lo comprueba (§7).

// FINALIDADES: la tabla única de finalidades. La usan useCases, pricingTiers, WA_MENU y contacto.
export const FINALIDADES = [
  { id: 'compraventa', label: 'Compra o venta',         precio: PRECIOS.compraventa, firma: 'csj',
    corto: 'Sabé el valor real antes de firmar una oferta o una escritura.' },
  { id: 'credito',     label: 'Crédito bancario',       precio: PRECIOS.credito,     firma: 'bcp',
    corto: 'Hipotecario o fiduciario: el informe que tu banco o cooperativa te pide para la carpeta, con la firma que exige el BCP.' },
  { id: 'judicial',    label: 'Sucesiones y juicios',   precio: PRECIOS.judicial,    firma: 'csj',
    corto: 'Herencias, remates judiciales, liquidaciones: un informe pericial firmado por perito de la CSJ, que se sostiene ante el juzgado.' },
  { id: 'vender',      label: 'Vender con corredor',    precio: PRECIOS.compraventa, firma: 'csj',
    corto: 'Mismo informe; si firmás exclusividad con un corredor asociado, el costo se descuenta de la comisión.' },
];

// page.kind: se agrega 'vertical-b2b' (franja de dominio: sin panel de precio, sin freeAside).

// Nuevos tipos de sección (build-site.mjs los renderiza):
{ type: 'useCases', heading, items: FINALIDADES.slice(0,3) (+ opcional 4ª tarjeta B2B) }   // §5.1
{ type: 'credentials', heading, tasador: [CRED_CSJ, CRED_ARQ], credito: `Para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}`, plazo: PLAZO_TXT, factura: FACTURA_TXT } // bloque de confianza
{ type: 'pricingTiers', heading, tiers: [...] , pie }   // tres tarjetas por finalidad, ver §5.6
{ type: 'valueBlock', heading, items: [...], short?: bool } // "qué hacés con el informe", ver §5.15
// priceBlock existente: gana `eyebrow`, `ctaLabel`, `waOption` y `rows` puede incluir la fila judicial y la de crédito (§5.4).
```

`build-site.mjs` sigue siendo el único renderizador. `WA_MENU` sigue viviendo en `content.mjs`.

## 4. Menú WhatsApp v3 — cinco opciones, por finalidad

```js
export const WA_MENU = {
  options: [
    { id: 'informe',    label: 'Necesito el informe oficial para comprar o vender', sub: 'Firmado por perito tasador',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y necesito un informe oficial de tasación para una compra o venta. El inmueble está en: ______` },
    { id: 'credito',    label: 'Necesito una tasación para un crédito',              sub: 'Banco o cooperativa · hipotecario o fiduciario',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y necesito una tasación para presentar en un crédito bancario o de cooperativa. El inmueble está en: ______` },
    { id: 'judicial',   label: 'Necesito una tasación para una sucesión o un juicio', sub: 'Herencias, remates, liquidaciones',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y necesito una tasación pericial para una sucesión o un proceso judicial. El inmueble está en: ______` },
    { id: 'valoracion', label: 'Quiero una tasación para vender con un corredor',    sub: 'El costo se descuenta de la comisión',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y quiero una tasación para vender mi propiedad con un corredor asociado. El inmueble está en: ______` },
    { id: 'consulta',   label: 'Tengo otra consulta',                                sub: 'Empresas, franja de dominio, otros casos',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y tengo una consulta.` },
  ],
  fallback: (ctx) => `Hola, vengo de tasacion.com.py (${ctx}) y quiero información sobre una tasación.`,
};
```

- El `______` es intencional: le deja al cliente un hueco para el barrio/ciudad. `tests/wa-menu.mjs`
  debe aceptarlo (el `href` decodificado termina en `______`).
- Opción preseleccionada por página (`data-wa-open` del primario): home, hub, casas, departamentos,
  terrenos, locales, campos, informes-periciales, nosotros, FAQ, contacto → `informe`;
  hipotecaria → `credito`; valuacion-para-vender → `valoracion`; corporativa y franja-de-dominio
  → `consulta` (texto propio, ver §5.14). Los ids `informe`, `valoracion` y `consulta` se conservan
  para no romper `data-wa-open` existentes.
- **Bug a corregir (build-site.mjs:61-62):** los triggers del header usan `WA_MENU.fallback('')`
  → mensaje con "()" vacío en producción. Debe ser `WA_MENU.fallback(ctx)` con el `waContext` de
  la página. `verify.mjs` lo comprueba (§7).
- **Bug a corregir (audit 09-06 §1.4):** `.wa-menu__option` es `display:flex` con los dos
  `<span>` como hijos → título y subtítulo en dos columnas. Pasar a grid
  (`grid-template-columns: 8px 1fr`) y agregar la aserción `opt-sub.top >= opt-title.bottom`
  en `tests/wa-menu.mjs`. Con cinco opciones el panel tiene que caber en 390×844 sin scroll
  interno; si no cabe, reducir `min-height` de opción a 52 px.

## 5. Cambios por página

Reglas transversales (además de plan.md §5): (a) el precio sigue apareciendo **una vez por
página** y **nunca en heros** (salvo el chip de `/informes-periciales/`), franja final, footer ni
menú WA — pero ahora "una vez" es la tabla/panel por finalidad; (b) `PLAZO_TXT` aparece **al
menos una vez** en cada página con FAQ (respuesta de plazo) y en la fila de confianza; (c)
ninguna respuesta de FAQ dice "te confirmamos el plazo" (el gate lo prohíbe); (d) todo lo que
diga BCP usa `CRED_BCP_FIRMA` textual; (e) la fila de confianza bajo el hero
(`renderTrustRow`) pasa en TODAS las páginas a estos tres ítems, todos verificables:
`CRED_CSJ` · `Informe firmado en ${PLAZO_TXT}` · `Precio anclado por finalidad, antes de la visita`.

### 5.1 `/` (home)

- Eyebrow: `Tasador Fernando Capurro · ${CRED_CSJ}` → demasiado largo; usar
  "Perito Tasador CSJ · Asunción y Gran Asunción".
- **H1:** "Tasación con validez legal y bancaria, para tu crédito, tu sucesión o tu venta".
- Lede: "Informe técnico firmado por el Tasador Fernando Capurro, listo para presentar en tu
  banco, cooperativa, juzgado o escribanía. Si tu objetivo es vender, el costo se descuenta de
  la comisión de tu corredor asociado."
- Chip de oferta (sin cifra): `<strong>Informe oficial de tasación</strong>` + "firmado en
  3 a 5 días hábiles". Primario "Pedir mi informe oficial" (`informe`), fantasma "Ver para qué
  lo necesitás" (ancla `#finalidades`), línea chica igual que hoy.
- Orden de secciones: hero → fila de confianza → **`useCases`** (`id="finalidades"`, H2
  "¿Para qué necesitás la tasación?", tres tarjetas = FINALIDADES compraventa / credito /
  judicial con `corto` + enlace a la página que corresponde: `/informes-periciales/`,
  `/tasaciones/hipotecaria/`, `/informes-periciales/#judicial`; 4ª tarjeta `.card--muted`
  "¿Sos empresa o consorcio vial?" → `/tasaciones/franja-de-dominio/`) → **`valueBlock`**
  completo (§5.15) → `services` (8 tarjetas, se agrega franja) → **`credentials`** (H2 "Quién firma tu informe": columna
  Fernando con `CRED_CSJ` + `CRED_ARQ`; columna crédito con `CRED_BCP_FIRMA + CRED_BCP_BANCOS`;
  pie con `PLAZO_TXT`) → `steps` (paso 3: "Recibís el informe firmado en 3 a 5 días hábiles
  después de la visita") → `freeAsideVender()` → `faqPreview` (Q1 "¿Cuánto cuesta según la
  finalidad?", Q2 "¿Sirve para un crédito en mi banco o cooperativa?", Q3 "¿Sirve para una
  sucesión?") → `ctaBand`. Se elimina `porQueElegirnos` de la home (lo reemplaza `credentials`).
- `porQueElegirnos.items[2]` ("Peritos Tasadores… peritos matriculados") se reescribe en todo
  el sitio a: título "Perito matriculado", cuerpo `${CRED_CSJ} y ${CRED_ARQ}: el mismo
  profesional que visita el inmueble firma el informe.` (sin plural "peritos").

### 5.2 `/tasaciones/` (hub)

`useCases` después de `services`; agregar la 8ª tarjeta de servicio (franja de dominio);
`faqPreview` igual que home. Título: acortar a ≤ 60 caracteres ("Tasaciones de inmuebles en
Paraguay | Tasación.com.py") y actualizar `docs/routes.json`.

### 5.3 Verticales residenciales/comerciales (casas, departamentos, terrenos, locales, campos)

- `priceBlock` pasa a mostrar la **tabla por finalidad** en el panel navy: cifra grande =
  rango compraventa (como hoy) seguido de `IVA_TXT`; filas: "Compra o venta — `PRECIO_TXT`
  `IVA_TXT`" · "Sucesiones y juicios — `PRECIO_JUDICIAL_TXT` `IVA_TXT`" · "Crédito bancario —
  `PRECIO_CREDITO_TXT` `IVA_TXT`". Pie del panel: `FACTURA_TXT`. Se eliminan las filas
  "desde/hasta por tamaño" (ya no aportan con tres finalidades). Eyebrow del panel: "Precio por
  finalidad".
- Lista "qué incluye" (`INCLUYE_INFORME`): reemplazar "Firma del Tasador Fernando Capurro" por
  `Firma de ${CRED_CSJ}` y agregar `Entrega en ${PLAZO_TXT}` como 7º ítem.
- Después del `priceBlock` y antes del `freeAside`: **`valueBlock` corto** (§5.15, ítems 1–3).
- FAQ: la Q de costo responde con las tres finalidades (una frase cada una, cifra + `IVA_TXT`);
  la Q de plazo responde `Una vez hecha la visita, el informe firmado está listo en ${PLAZO_TXT}.`;
  se agrega Q "¿Sirve para mi banco o cooperativa?" → `Sí: para crédito, ${CRED_BCP_FIRMA}.
  ${CRED_BCP_BANCOS}`
- Casas, además: el FAQ "¿La visita tiene costo?" (hoy habla de vender) se reescribe: "La
  visita está incluida en el precio del informe, para cualquier finalidad."

### 5.4 `/tasaciones/hipotecaria/` — reescritura completa (la página que más contradecía PLACEHOLDERS.md)

- H1: "Tasación para crédito hipotecario o fiduciario". Eyebrow: "Tasación para crédito · Paraguay".
- Lede: `Tu banco o cooperativa te pide una tasación para aprobar la carpeta. Para crédito,
  ${CRED_BCP_FIRMA}; la visita y el relevamiento los hace el Tasador Fernando Capurro,
  ${CRED_CSJ}. ${CRED_BCP_BANCOS}`
- Primario: "Pedir mi tasación para crédito" → `credito`. Sin línea chica de vender.
- `lead` "Por qué el banco te pide una tasación": conservar cuerpo actual + segunda frase:
  "También sirve para remates bancarios por ejecución de hipoteca."
- `grid3`: H2 pasa a "Qué revisa el banco en el informe" (arregla el H2 duplicado del audit
  09-06); ítem "Firma de Perito" → título "Firma para crédito", cuerpo `${CRED_BCP_FIRMA}.`;
  ítem "Cumplimiento Normativo — ajustado a los estándares bancarios" → **eliminar** y
  reemplazar por "Plazo — `Informe firmado en ${PLAZO_TXT}`".
- `priceBlock` con la tabla §5.3 pero cifra grande = `PRECIO_CREDITO_TXT` ("desde Gs.
  1.500.000" + `IVA_TXT`); nota del panel: "incluye la firma del tasador inscripto en el BCP;
  te confirmamos el monto exacto por WhatsApp antes de la visita".
- FAQ: "¿Sirve para cualquier banco?" → `Para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}
  Decinos por WhatsApp en qué banco o cooperativa estás gestionando.`; "¿Cuánto tarda?" →
  PLAZO_TXT; "¿Por qué cuesta más que el informe para compra o venta?" → "Porque lleva la
  firma de un tasador inscripto en el registro del BCP, que es lo que tu banco exige."
- `ctaBand` de esta página: primario "Pedir mi tasación para crédito" (`credito`), secundario
  "o pedir un informe para compra o venta" (`informe`). (El audit 09-06 ya pedía sacar el
  enlace de vender acá; `ctaBand()` gana parámetros `primaryOption`/`secondary`.)

### 5.5 `/tasaciones/corporativa/`

Sin cambios de estructura. Agregar a "Valuación estratégica de activos" el ítem "Franja de
dominio — relevamiento y avaluación edilicia para proyectos viales" con enlace a la página
nueva. Primario → `consulta` con texto propio: `Hola, vengo de la página de Tasación
Corporativa y necesito una tasación para mi empresa. El activo es: ______` (5ª opción del menú
con `text` sobreescrito por página: agregar soporte `page.waConsultaText`).

### 5.6 `/informes-periciales/` — hub del producto pago, ahora por finalidad

- Chip con precio (única página): `<strong>Informe oficial: desde Gs. 800.000 + IVA</strong>` +
  "según finalidad; te confirmamos el monto antes de la visita".
- `grid2` "Casos donde necesitás un informe oficial" → **`useCases` completo** con las cuatro
  FINALIDADES + anclas: `#compraventa`, `#credito`, `#judicial`, `#vender`.
- Nueva `lead` `id="judicial"` H2 "Tasación pericial para sucesiones y juicios": cuerpo con F8
  (herencias, remates judiciales, liquidaciones, base de honorarios) + `Firmada por el Tasador
  Fernando Capurro, ${CRED_CSJ}.` + "Todo lo judicial, sucesiones incluidas:
  `PRECIO_JUDICIAL_TXT` `IVA_TXT`. Es un informe más detallado, y suele ser la base sobre la que
  abogados y jueces calculan sus honorarios."
- Nueva `lead` `id="credito"` H2 "Tasación para crédito": `Para crédito, ${CRED_BCP_FIRMA}.
  ${CRED_BCP_BANCOS}` + `PRECIO_CREDITO_TXT` `IVA_TXT`, enlace a `/tasaciones/hipotecaria/`.
- `priceBlock` → **`pricingTiers`**: no es una tabla, son **tres tarjetas** en una fila
  (`grid auto-fit minmax(280px,1fr)`, gap 20; apiladas en móvil), sobre banda `--surface`,
  `id="precios"`. Cada tarjeta: eyebrow de finalidad · H3 · cifra en `.display` 28px + `IVA_TXT`
  en 15px muted · línea "Firma:" · línea "Plazo:" · lista "Incluye" (4 checks) · botón. Copy
  exacto:
  1. **Compra o venta** — eyebrow "Lo más pedido" (tarjeta resaltada: `border-top: 3px solid
     var(--navy)`) · `PRECIO_TXT` + IVA · Firma: `CRED_CSJ_CORTA` · Plazo: `PLAZO_TXT` · Incluye:
     Visita técnica al inmueble · Comparables reales de mercado, no promedios · Registro
     fotográfico · Informe firmado, con la metodología explicada · botón `.btn--primary`
     "Pedir informe para comprar o vender" (`informe`).
  2. **Crédito bancario** — eyebrow "Hipotecario o fiduciario" · `PRECIO_CREDITO_TXT` + IVA ·
     Firma: "Tasador inscripto en el registro del BCP" · Plazo: `PLAZO_TXT` · Incluye: lo de la
     tarjeta 1 + "Formato para carpeta bancaria" (reemplaza al 4º) · nota 13px "Incluye la firma
     que tu banco o cooperativa exige" · botón `.btn--ghost` "Pedir tasación para crédito"
     (`credito`).
  3. **Sucesiones y juicios** — eyebrow "Informe pericial" · `PRECIO_JUDICIAL_TXT` + IVA · Firma:
     `CRED_CSJ_CORTA` · Plazo: `PLAZO_TXT` · Incluye: lo de la tarjeta 1 + "Informe detallado,
     para presentar en el juzgado" (reemplaza al 4º) · botón `.btn--ghost` "Pedir tasación
     pericial" (`judicial`).
  Pie de la banda (14px muted, tres frases): `FACTURA_TXT` · `PRECIO_NOTA` · "Si vendés con un
  corredor asociado, el costo se descuenta de la comisión al cerrar la venta."
- Después de `pricingTiers`: **`valueBlock`** completo (§5.15).
- `credentials` antes del FAQ. FAQ: agregar "¿Quién firma?" (F1/F2/F4 en dos frases) y "¿Cuánto
  tarda?" (PLAZO_TXT).

### 5.7 `/valuacion-para-vender/`

Conservar tal cual (reescrita 2026-09-10). Solo: FAQ agrega "¿Cuánto tarda?" → PLAZO_TXT; la
tabla `compare` fila 3 "Firmado por el Tasador Fernando Capurro" → `Firmado por ${CRED_CSJ}`.

### 5.8 `/nosotros/`

- `lead` "Quién firma tus informes" → `El Tasador Fernando Capurro, ${CRED_CSJ} y ${CRED_ARQ},
  visita el inmueble y firma cada informe oficial. Para tasaciones de crédito,
  ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}`
- `credentials` después. Pilar "Rapidez" → `Informe firmado en ${PLAZO_TXT}.`
- Título: "Tasador Fernando Capurro, Perito Tasador en Asunción | Tasación.com.py" (routes.json).

### 5.9 `/preguntas-frecuentes/`

Grupos, en este orden: **Informe oficial** (costo por finalidad, plazo, quién firma, visita) ·
**Crédito bancario** (¿sirve para mi banco/cooperativa?, ¿hipotecario y fiduciario?, ¿remate
bancario?) · **Sucesiones y juicios** (¿sirve para sucesión?, ¿remate judicial?, ¿por qué cuesta
más? → "requiere un informe más detallado y suele ser la base de honorarios de abogados y
jueces") · **Para vender** (sin cambios) · **General** (sin cambios). Respuestas de 2–3 frases
con las constantes; ninguna respuesta vacía.

### 5.10 `/contacto/`

H1 "Pedí tu tasación por WhatsApp o dejanos tus datos". Radios `mensaje` = las cinco etiquetas
del menú WA v3, en el mismo orden, `informe` por defecto. `lead-forward.php` sin cambios de
campos (el valor viaja en `mensaje`). Envolver los radios en `<fieldset><legend>` (audit 09-06).
Título con ubicación: "Contacto — tasaciones en Asunción | Tasación.com.py" (routes.json).

### 5.11 `404.html`, `gracias.html`

Regenerar (heredan header, trust row, menú). `gracias.html`: "Un perito te escribe" → "El
Tasador Fernando Capurro te escribe por WhatsApp…".

### 5.12 Footer (build-site.mjs `renderFooter`)

Línea bajo la marca: `Tasador responsable: Fernando Capurro · ${CRED_CSJ}` (dos líneas si no
cabe). La línea "Informe oficial de tasación pago · Tasación para vender…" se conserva.

### 5.13 Franja final `ctaBand` (todas las páginas)

Eyebrow "Informe oficial · firmado por perito tasador" · cuerpo termina con "Listo en
3 a 5 días hábiles después de la visita." Sin cifra (gate).

### 5.14 NUEVA `/tasaciones/franja-de-dominio/` (`kind: 'vertical-b2b'`)

- Ruta nueva → `docs/routes.json` (15 rutas), `sitemap.xml`, `NAV.children` (8º), `SERVICIOS`
  (8º, "Franja de dominio · Relevamiento y avaluación edilicia para proyectos viales"),
  `otrasTasaciones` de corporativa y terrenos. Google Ads no la toca; no hay 301 que hacer.
- `waContext: 'Franja de Dominio'`. Título: "Relevamiento y avaluación edilicia en franja de
  dominio | Tasación.com.py". H1: "Relevamiento y avaluación edilicia en franja de dominio de
  proyectos viales". Eyebrow: "Para empresas, consorcios y constructoras".
- Lede (solo F9, sin inventar): "La franja de dominio es la faja que ocupa la ruta y que hay
  que liberar antes de construirla; suele afectar muchos lotes a la vez. Relevamos y medimos
  todas las edificaciones y terrenos dentro de la franja, los computamos y les asignamos valor
  de mercado, y entregamos el informe que el consorcio adjudicatario presenta para que el Estado
  indemnice a las familias afectadas. Firmado por el Tasador Fernando Capurro, `CRED_CSJ` y
  `CRED_ARQ`."
- Primario "Pedir presupuesto por proyecto" → `consulta` con `page.waConsultaText`: `Hola,
  vengo de la página de Franja de Dominio y necesito relevamiento y avaluación edilicia para un
  proyecto vial. Cantidad aproximada de lotes: ______`. Sin línea chica de vender. Sin
  `priceBlock`, sin `freeAside`. `heroImage`: reusar `tasacion-terrenos-paraguay` hasta que haya
  foto propia (anotar en `docs/log/v3.md`).
- Secciones: `grid3` "Qué incluye" (Relevamiento y medición de cada edificación y terreno
  dentro de la franja · Cómputo de lo relevado · Valor de mercado por lote · Registro
  fotográfico · Informe técnico firmado, listo para presentar al consorcio adjudicatario · Base
  para la indemnización del Estado a las familias afectadas) → `lead` "Cómo se cotiza":
  `FRANJA_COTIZA` + `FACTURA_TXT` (sin cifra) → `credentials` → FAQ (¿Quién contrata
  este servicio? / ¿Firman como perito? / ¿Cuánto tarda? → "Depende de la cantidad de lotes;
  lo definimos en el presupuesto por proyecto" — **excepción documentada** al gate de plazo) →
  `otrasTasaciones` (corporativa, terrenos) → `ctaBand` propia (primario `consulta`,
  secundario `informe`).

### 5.15 Bloque de valor `valueBlock` — por qué conviene pagar el informe

Copy fijado por Fable; Sonnet lo interpola, no lo reescribe. Todo lo que afirma es aritmética,
mecánica general de crédito/sucesión, o palabras de Fer. **No** cita tasas de interés, LTV,
bancos, cooperativas ni programas (nada de eso está confirmado; el gate lo bloquea).

- H2: "El informe no es un gasto: es lo que destraba la operación"
- Lede (solo en la versión completa): "Nadie tasa por curiosidad. Se tasa porque un banco, un
  juzgado, una escribanía o una contraparte lo exige — o porque hay mucha plata en juego en
  ponerle el precio equivocado a un inmueble."
- Ítems (título · cuerpo). `short: true` renderiza solo 1–3.
  1. **Define cuánto te presta el banco** · "El banco o la cooperativa calcula el monto del
     crédito como un porcentaje del valor que fija la tasación. Sin informe no hay garantía; con
     un informe bien hecho, la garantía vale lo que tiene que valer."
  2. **Evita el error más caro de una compraventa** · `Ejemplo: en una casa de
     ${fmtGs(EJEMPLO.valor)}, un 5 % de error de precio son ${fmtGs(EJEMPLO.valor * EJEMPLO.error)}
     — más de 10 veces lo que cuesta el informe. Comprar caro o vender barato sale mucho más
     caro que tasar.`
  3. **Fija tu parte en una herencia** · "En una sucesión, el valor que establece el informe
     pericial es el que se reparte entre los herederos y sobre el que se calculan los
     honorarios. Un perito matriculado ante la Corte Suprema de Justicia es lo que el juzgado
     acepta."
  4. **Respalda a tu empresa** · "Garantías para crédito comercial, revaluación de activos para
     balances, valores de reposición para seguros y compraventa de activos." (mismas
     afirmaciones que ya lleva `/tasaciones/corporativa/`)
  5. **Con validez, con plazo y con factura** · `Firmado por perito matriculado, entregado en
     ${PLAZO_TXT}, con factura legal. Precio anclado por finalidad antes de la visita, sin
     sorpresas.` (si `VISITA_TXT` existe, se antepone: `${VISITA_TXT}; informe en …`)
- Render: `.value-block` sobre `--base`, grid 12: lede en `span 4`, ítems en `span 8` como lista
  numerada estilo `steps` (círculo navy 32px). Sin imágenes. Sin botón (el CTA es el de la
  sección siguiente).
- Gate: `EJEMPLO.valor` (400.000.000) y `EJEMPLO.valor*EJEMPLO.error` (20.000.000) son las
  únicas cifras `Gs.` adicionales permitidas, y solo dentro de `.value-block` y precedidas por
  "Ejemplo:". No llevan `IVA_TXT` (no son precios) — la regla de §7 los exceptúa por selector.

## 6. Renderer, CSS, JS

- `build-site.mjs`: nuevos bloques `useCases`, `credentials`, `pricingTiers`; `priceBlock` con
  `eyebrow`/`ctaLabel`/`waOption` parametrizados (hoy hardcodea "El informe oficial" y `informe`);
  `ctaBand()` con opciones por página; `renderTrustRow` con los tres ítems de §5(e); header
  fallback con `ctx` (§4); `page.waConsultaText`; `kind === 'vertical-b2b'` sin panel de precio.
- **JSON-LD** (audit 09-06 §4.3, ahora con hechos reales): `ProfessionalService` sitewide
  (`name`, `url`, `telephone`, `areaServed` Asunción/Gran Asunción, `priceRange` "Gs. 800.000 –
  2.500.000", `founder: Person{name: 'Fernando Capurro', jobTitle: 'Perito Tasador', hasCredential:
  [CRED_CSJ, CRED_ARQ]}`), `Service` por vertical con `offers.priceSpecification` (min/max PYG
  de compraventa; judicial como segundo `Offer` en informes-periciales), `BreadcrumbList` en
  profundidad ≥ 2. Sin `address`, sin `aggregateRating`, sin `legalName`.
- CSS: `.use-cases` (grid auto-fit 260px, tarjetas `.card` con eyebrow de finalidad),
  `.credentials` (dos columnas 7/5 sobre `--surface`, sello oro + check por credencial, pie con
  plazo), `.pricing-tiers` (tabla hairline, thead `--navy-tint`, fila crédito en cursiva si es
  "te confirmamos"), `.wa-menu__option` a grid (§4). **FAB vs. línea chica en móvil:** en ≤640
  px la `.hero__freelink` queda debajo del FAB (captura 2026-09-10). Fix: `.hero__freelink{
  padding-right: 80px }` en ≤640, o mover el FAB a `bottom: 16px` con `hero` `padding-bottom`
  extra; Playwright: el bounding box del enlace no interseca el del FAB a 390×844.
- JS: sin cambios de lógica (menú genérico). Solo verificar foco inicial con 5 opciones.
- `.htaccess`: agregar `ErrorDocument 404 /404.html` y 301 `www.` → apex (audit 09-06 §1.1,
  §3.7). Solo agregar líneas.
- Fuentes: `preload` + `onload` para Google Fonts (audit 09-06 §4.5). Sin self-hosting en v3.

## 7. Gate `verify.mjs` — cambios

- Cifras `Gs.` permitidas: `800000`, `1500000`, `1800000`, `2500000`; además `400000000` y
  `20000000` **solo** dentro de `<section class="value-block…">` y precedidas por "Ejemplo:".
  Cualquier otra → FAIL. Toda cifra `Gs.` fuera de `.value-block` debe estar seguida, en el mismo
  nodo de texto, por `IVA_TXT` (regex `Gs\. [\d.]+( a Gs\. [\d.]+)? \+ IVA`); el primer `Gs.` de
  un rango no lleva sufijo, el segundo sí.
- CSS/JS: `.use-cases`, `.credentials`, `.pricing-tiers`, `.value-block` existen en `site.css`;
  `tests/wa-menu.mjs` (o un `tests/layout.mjs` nuevo) comprueba en `/informes-periciales/` que
  las tres tarjetas de precio están en una fila a 1280 px y apiladas a 390 px, y que la tarjeta
  "Compra o venta" es la resaltada.
- Los números `4.168` y `3.738` solo pueden aparecer dentro de `CRED_CSJ`/`CRED_CSJ_CORTA` y
  `CRED_ARQ` textuales. `FORBIDDEN` **pierde** `'matrícula N'` y `'Mat. '` (ahora son parte de
  la canónica) y **gana**: `'en trámite'`, `'peritos matriculados'`, `'perito matriculado
  habilitado'`, `'estándares bancarios'`, `'Te confirmamos el plazo'`, `'te confirmamos el
  plazo'`, `'Aprobado por'`, `'Ueno'`, `'Itaú'`, `'Itau'`, `'Continental'`, `'AFD'`, `'sin IVA'`.
- Toda aparición de `BCP` en el HTML debe estar dentro de `CRED_BCP_FIRMA` textual o en la
  frase de FAQ de §5.4 ("firma de un tasador inscripto en el registro del BCP"): regex, cada
  `BCP` precedido por "inscripto en el registro del ". Toda aparición de "Corte Suprema" debe
  ser `CRED_CSJ` textual.
- `FACTURA_TXT` presente en toda página que muestre una cifra `Gs.`.
- `PLAZO_TXT` presente en todas las páginas (trust row) y en cada FAQ de plazo; `franja-de-dominio`
  es la única página cuyo FAQ de plazo puede no contener `PLAZO_TXT`.
- Precio en hero: sigue prohibido salvo `/informes-periciales/`. `ctaBand`/footer: sin cifra.
- `kind === 'vertical-b2b'`: exento del check "falta PRECIO_TXT"; debe NO contener ninguna cifra Gs.
- Header: los dos triggers del header deben tener `?text=` que contenga el `waContext` (mata el
  bug "()"). `#wa-menu` con exactamente 5 `a[href^="https://wa.me/"]`.
- `docs/routes.json` = 15 rutas = sitemap. Títulos ≤ 60 caracteres en todas (FAIL si no).
- `tests/wa-menu.mjs`: 5 opciones; `href` decodificado de cada una == `text(ctx)`; stacking
  vertical de título/subtítulo; panel cabe en 390×844; en `/tasaciones/hipotecaria/` la opción
  con foco es `credito`; en `/tasaciones/franja-de-dominio/` es `consulta`; FAB no interseca la
  `.hero__freelink` en móvil.

## 8. PRs — orden estricto, cada uno mergeado por la sesión con CI verde

| PR | Rama | Contenido | Listo cuando |
|---|---|---|---|
| PR-1 | `v3/1-contrato-renderer-gate` | §3 constantes (D1 en su default "+ IVA" salvo que Anton diga lo contrario), §4 menú + fix header, §6 renderer/CSS/JS/JSON-LD/htaccess/fonts, §7 gate y tests, `docs/routes.json` con la ruta nueva y títulos acortados, página franja **con copy provisional** (solo H1/lede/CTA) para que el gate de 15 rutas pase. Copy viejo en el resto. | `node verify.mjs` PASS, `node tests/wa-menu.mjs` PASS, CI verde. |
| PR-2 | `v3/2-copy-hub` | §5.1, 5.2, 5.4 (hipotecaria completa), 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 5.14 (franja completa). Subagentes Sonnet en paralelo, una página cada uno; la sesión integra. | Gate PASS con `copyDone: true`; `grep -c "peritos matriculados" content.mjs` = 0. |
| PR-3 | `v3/3-copy-verticales` | §5.3 (casas, departamentos, terrenos, locales, campos) y §5.5 corporativa, fan-out Sonnet. | Gate PASS; screenshots 5 páginas × 2 anchos como artifact; `docs/log/v3.md` (Built / Decisions / Known issues / Verification). |

Después de PR-3: generar el zip. En Linux `./deploy/make-zip.sh`; en Windows no hay `zip`:
usar el método .NET `ZipArchive` con rutas `/` de la skill `hostinger-html-php-deploy` (ya se
usó el 2026-09-10 para `dist/tasacion-2026-09-10.zip`). Dejar la ruta del zip en la última línea
de `docs/log/v3.md`. **Anton sube el zip a Hostinger; la sesión nunca deploya.**

## 9. Actualizar al cerrar

- `PLACEHOLDERS.md` §1: matrícula CSJ 4.168 y arquitecto 3.738 → "confirmadas y publicadas";
  factura legal → "confirmada (Fer emite factura); timbrado y RUC siguen sin publicarse";
  Habilitación BCP → "Fernando: en trámite (no se menciona). Crédito: firma de tasador BCP
  asociado (canónica en content.mjs); bancos no se nombran por decisión de Fer". §3 precios →
  los tres rangos + IVA según D1. §4 → plazo confirmado.
- `plan.md` §1.2/§1.3: agregar una línea "Superseded 2026-09-10 por prompts/v3-…§1".
- `docs/decisions-needed.md`: solo D1 si Anton no respondió; qué línea cambia.

## 10. Checklist de salida

1. 15 rutas 200 en `serve.mjs`; títulos ≤ 60; canonicals; sitemap = routes.json.
2. Cero "gratis", cero "peritos matriculados", cero "te confirmamos el plazo", cero "BCP" fuera
   de la canónica, cero nombres de bancos, cero cifra `Gs.` sin `IVA_TXT`, cero "4.168"/"3.738"
   fuera de las credenciales canónicas.
3. Cada página: 1 H1, 1 `#wa-menu` con 5 opciones, header con contexto, `PLAZO_TXT` en la
   trust row, `ctaBand` última sección.
4. Precio: solo en paneles/tablas/FAQ; cifras solo las permitidas; hero sin cifra salvo informes.
5. Menú WA: stacking correcto, cabe en 390, foco correcto por página, FAB sin solapar.
6. JSON-LD válido (Rich Results test manual o `node -e` parse) en las 15 páginas.
7. `docs/log/v3.md`, `PLACEHOLDERS.md`, `decisions-needed.md` actualizados. Zip generado.
