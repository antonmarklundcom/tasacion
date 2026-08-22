# PLACEHOLDERS — tasacion.com.py

Todo lo que **no está confirmado** y hay que resolver antes de vender la página
como sitio real. Nada de esto está inventado en la página: donde no había dato,
la línea no existe. Esta lista es lo que falta, no lo que hay que corregir.

Estado: **EN PRODUCCIÓN** (lanzado 2026-08-06). Las 15 páginas de CORE 15 ya
no llevan `noindex` y `robots.txt` permite el crawl. `gracias.html` y
`404.html` mantienen `noindex,nofollow` a propósito — no son páginas de
contenido y no deben indexarse.

---

## 1. Datos legales y fiscales — NO EXISTEN EN LA PÁGINA

| Dato | Estado | Qué hace falta |
|---|---|---|
| **RUC** | Ausente. No se menciona en ningún lado. | Número de RUC del titular o de la sociedad. Va en el footer. |
| **Factura legal** | Ausente. La página no dice que se factura. | Confirmar si se emite factura legal y con qué timbrado. Recién ahí se puede poner "Emitimos factura legal" en la franja de confianza. |
| **Razón social** | Ausente. La marca es el dominio (`Tasación.com.py`), correcto para MODO 3. | Cuando haya sociedad o titular formal, agregar `legalName` al JSON-LD. |
| **Matrícula / registro profesional del tasador** | Ausente. | Paraguay no exige matrícula única de tasador, pero si el tasador tiene matrícula de arquitecto/ingeniero o registro en alguna entidad, es el activo de confianza más fuerte que tiene el sitio. Confirmar número exacto — **no estimar ni redondear**. |
| **Habilitación BCP** | **Deliberadamente ausente y sin sección.** | No somos tasadores habilitados por el BCP. No agregar nada sobre bancos, hipotecas ni tasaciones para créditos hasta que exista la habilitación. Si algún día existe, es una sección nueva, no una línea suelta. |

## 2. Contacto

| Dato | Estado |
|---|---|
| **Teléfono / WhatsApp** | `+595 995 628862` — número compartido de etapa 1, el mismo de las otras verticales. **No es un número dedicado a tasación.** |
| Cómo cambiarlo | Una sola línea: `var WA_NUMBER = '595995628862';` arriba de `index.html` (y la misma línea en `gracias.html`). El script reescribe todos los `wa.me` y todos los `tel:` al cargar. Los `href` literales quedan como fallback sin JS — si el cambio es definitivo, hacer también un buscar-y-reemplazar de `595995628862`. |
| **Dirección** | Ausente a propósito (MODO 3 §10.2). Footer dice solo `Asunción, Paraguay`. Sin calle, sin código postal, sin mapa. El JSON-LD **no** lleva `streetAddress`. |
| Cuando haya socio operador | Cambiar el footer por la dirección real y agregar `streetAddress` al JSON-LD. Nada más cambia. |
| **Email** | No hay email público en la página. Si se quiere uno, definir la casilla primero. |
| **Redes** | Sin Facebook ni Instagram. El JSON-LD no lleva `sameAs`. Crear ambos perfiles con NAP idéntico y después agregar el array. |

## 3. Precios — NO HAY NINGUNO EN LA PÁGINA

- La tasación online se presenta como **sin costo**, que es la propuesta real.
- El informe formal se presenta como **pago**, con la frase honesta
  "el monto depende del tipo de inmueble, de la superficie y del uso".
- **Falta**: la grilla real de precios del informe (por tipo de inmueble y
  rango de superficie), y si el monto lleva IVA incluido o no.
- Cuando exista, se muestra en guaraníes con punto de miles (`Gs. 1.500.000`)
  y con el IVA declarado explícitamente. Hoy no hay ningún importe publicado.

## 4. Prueba social — NO EXISTE

No hay, y no se inventó nada:

- Sin reseñas, sin testimonios, sin nombres de clientes.
- Sin calificación ni estrellas. El JSON-LD **no** lleva `aggregateRating`.
- Sin años de experiencia, sin cantidad de tasaciones hechas.
- Sin "nuestro equipo", sin fotos de personas identificadas como staff.
- Sin antes/después, sin trabajos presentados como propios.
- Sin garantías de ningún tipo.
- Sin promesa de tiempo de respuesta. El FAQ "¿Cuánto demora?" responde con
  el criterio real ("te confirmamos el plazo antes de empezar") en lugar de
  con un número inventado.
- Sin horarios. El JSON-LD **no** lleva `openingHours`.

Para llenarlo hace falta material real: reseñas de Google textuales con nombre
y barrio, o casos concretos con permiso. Hasta entonces la franja de confianza
carga solamente los cuatro hechos verificables:
*tasación sin costo · sin visita a oficina · respuesta por WhatsApp ·
cobertura Gran Asunción*.

## 5. Imágenes

Las seis imágenes son ilustrativas (generadas), no fotos de trabajos propios, y
ninguna se presenta como tal. Ninguna es un `proof-photo`.

| Slot | Archivo base | Nota |
|---|---|---|
| hero-bleed 16:9 | `tasacion-inmuebles-asuncion` | OK |
| section-break 21:9 | `tasador-midiendo-propiedad-asuncion` | Persona ilustrativa, sin nombre y sin atribución. |
| card-motif 4:3 | `tasacion-casas-departamentos-asuncion` | OK |
| card-motif 4:3 | `tasacion-terrenos-paraguay` | OK |
| card-motif 4:3 | `tasacion-locales-comerciales-asuncion` | OK |
| card-motif 4:3 | `informe-de-tasacion-inmueble` | **Revisar el alt.** El texto alt especificado dice "Informe de tasación sobre un escritorio…", pero la imagen muestra un **cuaderno en blanco** junto a la cinta métrica y los planos, no un informe. Se dejó el alt tal como fue especificado. Si importa la exactitud del alt, cambiarlo por: "Cuaderno abierto sobre un escritorio de madera junto a una cinta métrica y planos enrollados". |

PNG originales borrados de la carpeta de deploy, como estaba pedido.

## 6. venderCRM

| Punto | Estado |
|---|---|
| `VENDERCRM_URL` | **Vacío.** Todavía no hay dominio del CRM. Definido con `define()` desde `getenv('VENDERCRM_URL')`. |
| `VENDERCRM_API_KEY` | **No generada.** Falta crear el registro del sitio en venderCRM → *Sitios*, con el slug `tasacion`, y generar la clave. |
| Mientras tanto | El handler **no se rompe**: guarda cada envío en `leads.log` y siempre manda al visitante a `/gracias.html`. No se pierde ningún lead. |
| `source` | Fijo en `site:tasacion`. |
| `vc-attribution.js` | **No incluido**, porque depende del dominio del CRM. El handler ya lee la cookie `vc_attr` si algún día aparece. Agregar `<script src="{CRM_URL}/vc-attribution.js" defer>` cuando exista el dominio. |
| Verificación de ida y vuelta | **Pendiente**: no se puede probar contacto + deal en el CRM hasta que haya URL y clave. Lo que sí está probado localmente: honeypot, teléfono obligatorio, redirección 303, log de fallback y clave de idempotencia estable. |

## 7. Analítica

- **Falta un solo dato: el ID de medición.** El cableado ya está hecho
  (2026-08-22). Cada una de las 17 páginas declara `var ANALYTICS_ID = '';`
  en el `<head>`, en el hueco marcado, con el mismo patrón que `WA_NUMBER`.
  Poner ahí el ID de GA4 (`G-XXXXXXXXXX`) o el de GTM (`GTM-XXXXXXX`) y la
  analítica queda activa en todo el sitio, sin tocar markup.
- Mientras `ANALYTICS_ID` esté vacío: cero requests a terceros aparte de
  Google Fonts, exactamente como hasta ahora.
- El cargador vive en `assets/js/site.js`, junto al shim. Detecta solo si el
  ID es de GA4 o de GTM. En GA4 manda `anonymize_ip`.
- **El tag se inyecta únicamente con consentimiento de estadísticas**
  (`tsc_consent === 'stats'`, Ley 6534/2020): al aceptar en el diálogo carga
  en el acto, sin recargar. Si el visitante retira el consentimiento con el
  tag ya cargado, la página se recarga — un script inyectado no se puede
  desinyectar.
- Todos los CTA ya llevan `data-ev` + `data-ev-loc` y el shim los empuja a
  `dataLayer` haya o no tag: los clics previos al consentimiento quedan
  encolados y el tag los consume al cargar.
- Verificación de Search Console: hacerla por **registro TXT de DNS**, no por
  archivo HTML ni meta tag.

## 8. Checklist de lanzamiento

1. ✅ Sacar `<meta name="robots" content="noindex,nofollow">` de `index.html` y de las 14 páginas nuevas (2026-08-06). `gracias.html` y `404.html` mantienen `noindex` a propósito.
2. ✅ Cambiar `robots.txt` por el bloque PRODUCCIÓN (2026-08-06).
3. ✅ `<lastmod>` en `sitemap.xml` ya está en la fecha de lanzamiento.
4. **Pendiente**: crear el sitio en venderCRM (slug `tasacion`), generar la clave y cargar `VENDERCRM_API_KEY` y `VENDERCRM_URL` en hPanel.
5. **Pendiente**: probar el formulario de verdad y confirmar el contacto en venderCRM. Enviarlo dos veces seguidas: no debe crear dos contactos.
6. **Pendiente**: cambiar `WA_NUMBER` si ya hay número dedicado.
7. **Pendiente (falta solo el ID)**: el cableado de analítica está hecho (2026-08-22). Cargar el ID de medición en `var ANALYTICS_ID = '';` — una línea por archivo, 17 archivos. Buscar y reemplazar, igual que `WA_NUMBER`.
8. **Pendiente**: agregar el TXT de verificación en DNS y mandar el sitemap en Search Console.
9. **Pendiente**: confirmar que `leads.log` no es accesible por web (ya bloqueado en `robots.txt`, pero conviene además una regla en `.htaccess`).

## 9. Archivos que NO van al deploy

Son de desarrollo. No subir a `public_html`:

```
build-images.mjs   serve.mjs   package.json   package-lock.json
node_modules/      .claude/    PLACEHOLDERS.md
```

Al servidor van solo: `index.html`, `gracias.html`, `lead-forward.php`,
`robots.txt`, `sitemap.xml` y `assets/`.

## 10. CORE 15 — pendientes tras el build de expansión (BUILD-SPEC.md §14)

Nada de lo siguiente se inventó para completar una sección. Es lo que falta
después de construir las 14 páginas nuevas + home:

1. **RUC, factura legal, razón social** — ninguna línea existe en ninguna de las 15 páginas.
2. **Matrícula / registro profesional** — no se construyó ninguna sección de confianza sobre habilitación.
3. **Habilitación BCP** — deliberadamente ausente. Si alguna vez existe, es una sección nueva, no una línea suelta.
4. **Número de WhatsApp dedicado** — sigue siendo el compartido de etapa 1 (`WA_NUMBER` en una línea por archivo). Buscar y reemplazar `595995628862` el día que cambie.
5. **Grilla de precios para el informe** — no bloquea nada del CORE 15, pero hace falta para una futura `/precios/`.
6. **Tabla de comparables (Gs./m² por zona y tipo, con fecha y fuente)** — bloquea la Opción B del `/cotizador/` (§7.1 del BUILD-SPEC). El cotizador construido es un medidor de completitud, no una calculadora de precio, y así debe quedar hasta que exista esa tabla real.
7. **Reseñas reales** — siguen sin existir. No se agregó `aggregateRating` en ningún JSON-LD.
8. **URL + API key de venderCRM** — los dos formularios (`/` y `/contacto/`) siguen posteando a `/lead-forward.php`, que sigue logueando a `leads.log` sin tocar código.
9. **Exportación real de KWP** — los dos temas de `/guias/` se eligieron por lógica de rubro, no de datos de búsqueda. Antes de planificar la página 16+ hace falta una exportación real de Keyword Planner.
10. **Tres imágenes específicas de zona** (Luque, San Lorenzo, Fernando de la Mora) — **generadas el 2026-08-22**, pendiente de bajarlas. Se generaron con Higgsfield (`seedream_v5_pro`, 21:9, 2K, 3 créditos c/u) en el mismo estilo documental que el resto: luz difusa, paleta cálida apagada, sin personas y sin carteles legibles. Ninguna se presenta como trabajo propio. La sesión que las generó no pudo bajar los PNG — la política de red de ese entorno bloquea el CDN de Higgsfield —, así que los archivos siguen en la cuenta de Higgsfield. Para terminar:
    1. Bajar las tres de Higgsfield y guardarlas como `zone-img/luque.png`, `zone-img/san-lorenzo.png` y `zone-img/fernando-de-la-mora.png` (`zone-img/` está en `.gitignore`, igual que `src-img/` y `new-img/`).
    2. `npm install && node build-images.mjs`.
    3. Commit de `assets/img/` y de las tres páginas de zona.

    El script hace todo lo demás: genera `tasacion-de-inmuebles-luque`, `-san-lorenzo` y `-fernando-de-la-mora` en 640/1280/1920 × AVIF + WebP, reapunta el `<picture>` de cada página de zona y corrige el `alt` para que describa lo que realmente se ve. Es idempotente y saltea cualquier job sin PNG fuente, así que corre sin romperse aunque falten los originales de las otras ocho imágenes. Hasta que se corra, las tres páginas siguen mostrando las imágenes genéricas de siempre — nada quedó apuntando a un archivo inexistente.
11. **Snippet de analítica** — **cableado el 2026-08-22**, falta solo el ID. Las 17 páginas (15 + `gracias.html` + `404.html`) declaran `var ANALYTICS_ID = '';` en el `<head>` y el cargador con puerta de consentimiento está en `assets/js/site.js`. Cargar el ID de GA4 o de GTM y la analítica arranca sin tocar markup. Ver §7.
12. **Checklist de lanzamiento** — pasos 1–3 (noindex, robots.txt, sitemap) hechos el 2026-08-06. Pasos 4–9 (venderCRM, WA_NUMBER dedicado, ID de analítica, Search Console, `.htaccess` de `leads.log`) siguen pendientes — ver §8 arriba.
