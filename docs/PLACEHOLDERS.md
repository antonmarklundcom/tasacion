# PLACEHOLDERS — tasacion.com.py v2

Todo lo que **no está confirmado** y hay que resolver antes o después de subir
esta build. Nada de esto está inventado en la página: donde no había dato, la
línea no se imprime — `config/site.php` deja el valor vacío y las plantillas
muestran una versión neutra en su lugar (ver la regla en `docs/BUILD-SPEC-2026-09-03.md`
§4). Esta lista es lo que falta, no lo que hay que corregir.

Build: v2 (router PHP, reemplaza el funnel de GHL). Rutas legales incluidas:
política de privacidad, política de cookies, términos y condiciones.

---

## 1. Datos legales y de contacto — vacíos en `config/site.php`

| Clave | Qué desbloquea | Dónde se ve |
|---|---|---|
| `perito_name` | Nombre del tasador habilitado que firma el informe pericial. | `/nosotros/`, tarjeta del perito. Vacío: se muestra "Tasador habilitado con matrícula profesional vigente" y un comentario HTML `<!-- PLACEHOLDER -->`. |
| `perito_license` | Número de matrícula profesional del tasador. | `/nosotros/`, junto al nombre. Mismo comportamiento neutro si está vacío. |
| `contact_email` | Email de contacto público. | Footer (todas las páginas) y `/contacto/`. Vacío: la línea de email no se imprime, no aparece un email inventado. |
| `contact_phone` | Teléfono fijo, si existe uno distinto al WhatsApp. | Footer. Vacío: la línea no se imprime. |
| `ruc` | RUC del titular o de la sociedad. | `/politica-de-privacidad/`, sección "Responsable". Vacío: la frase de responsable omite el RUC. |
| **Habilitación BCP / bancaria** | Si en algún momento el tasador está habilitado por el BCP para tasaciones hipotecarias formales, es una sección nueva en `/tasaciones/hipotecaria/`, no una línea suelta. Hoy la página solo dice que el informe se prepara "con el formato que exigen bancos, cooperativas y financieras" y pide confirmar con la entidad — nunca afirma que el banco lo acepta. |

## 2. Precio — el IVA no está declarado

- El rango publicado es `Gs. 800.000 – 1.500.000`, siempre con el calificador
  "según tipo de inmueble y superficie" (`config/site.php` → `price_note`).
- **Falta confirmar si el rango incluye IVA o no.** Hoy la página no lo dice
  en ningún lado porque no está confirmado — no se inventó ninguna mención de
  IVA incluido ni excluido. Cuando se confirme, se agrega la aclaración en
  `price_note` y se propaga sola a todas las páginas que usan `partial_price_block()`.
- La valoración para vender sigue sin costo; eso no cambia.

## 3. Integraciones — vacías, la página funciona igual sin ellas

| Clave (`config/secrets.php` o variable de entorno) | Qué desbloquea | Comportamiento vacío |
|---|---|---|
| `VENDERCRM_URL` | Envío de cada lead a VenderCRM (`POST {url}/api/v1/leads`). | El lead se guarda igual en `storage/leads.log`; no se intenta la llamada de red. |
| `VENDERCRM_API_KEY` | Header `X-Api-Key` de esa llamada. | Sin efecto si `VENDERCRM_URL` está vacío. |
| `RESEND_API_KEY` | Email de notificación por cada lead vía Resend. | No se envía ningún email; el lead sigue en el log y (si está configurado) en VenderCRM. |
| `LEAD_TO_EMAIL` | Casilla que recibe la notificación. | Sin este valor tampoco se envía el email aunque haya `RESEND_API_KEY`. |
| **Dominio verificado en Resend** | El `From` (`RESEND_FROM`, hoy `Tasación.com.py <leads@tasacion.com.py>`) tiene que estar en un dominio verificado en el dashboard de Resend o los envíos van a rebotar. | — |
| `ANALYTICS_ID` | Carga de Google Analytics/Tag Manager (`G-XXXX` o `GTM-XXXX`), solo después del consentimiento de estadísticas. | Sin este valor no se pide nada a Google en ningún caso. |
| `STATS_PASSWORD` | Habilita `/go/stats.php` (reporte de clics de WhatsApp y leads). | Vacío: la página responde 403 "stats disabled" siempre, sin importar `STATS_USER`. |
| **Google Search Console** | Verificación de propiedad y envío de `sitemap.xml`. | Pendiente: no hay meta tag de verificación en `templates/layout/head.php`. Agregar cuando se tenga el código de verificación, o verificar por DNS. |

## 4. Prueba social — no existe, y no se inventó nada

Sin reseñas, sin testimonios, sin nombres de clientes, sin calificación ni
estrellas. El JSON-LD `ProfessionalService` en `/` no lleva `aggregateRating`.
Si en algún momento hay reseñas reales y verificables, se agregan ahí — nunca
antes.

## 5. Cobertura de zonas

La lista de `coverage` en `config/site.php` (Asunción, Luque, San Lorenzo,
Fernando de la Mora, Lambaré, Capiatá, Mariano Roque Alonso, Ñemby, Villa
Elisa, San Antonio, Limpio, Areguá, Itauguá) es la que se usa en el selector
de zona, el formulario de valoración y el footer. Revisarla si el equipo
inmobiliario deja de cubrir alguna de estas ciudades o suma otras.

## 6. Pasos de deploy (Hostinger, `public_html`, sin base de datos)

1. `bash tools/check.sh` tiene que pasar en local antes de subir nada.
2. `bash tools/build-zip.sh` genera `dist/tasacion-com-py.zip`.
3. Subir el contenido del zip a `public_html` (o subir el zip y extraerlo ahí
   desde el administrador de archivos de hPanel).
4. Copiar `config/secrets.example.php` a `config/secrets.php` en el servidor
   y completar las claves que se tengan. `config/secrets.php` nunca se sube
   al repo (está en `.gitignore`) ni al zip.
5. Dar permisos de escritura a `storage/` (755 o 775 según el hosting) para
   que `storage/wa-clicks.log` y `storage/leads.log` se puedan crear.
6. Probar `https://tasacion.com.py/go/whatsapp.php?src=test` — tiene que
   redirigir a `wa.me` y dejar una línea en `storage/wa-clicks.log`.
7. Probar `https://tasacion.com.py/go/stats.php` — 403 si `STATS_PASSWORD`
   sigue vacío, o pide usuario/clave si ya se configuró.
8. Enviar el formulario de `/valuacion-para-vender/` y el de `/contacto/` una
   vez cada uno y confirmar que ambos terminan en `/gracias/` con el mensaje
   correcto y que aparece la línea en `storage/leads.log`.
9. Si se configuró Search Console, enviar `https://tasacion.com.py/sitemap.xml`.
