# Deploy — tasacion.com.py

Sitio estático generado con Node (`build-site.mjs` + `content.mjs`) más un PHP para el
formulario de contacto (`lead-forward.php`). Sin base de datos. Sin CI/CD al servidor: el deploy
es manual, vía el File Manager de Hostinger.

## 1. Generar el zip

```
./deploy/make-zip.sh
```

Regenera las 15 páginas (`node build-site.mjs`) y arma `dist/tasacion-<fecha>.zip`, plano, con
solo lo que el sitio necesita en producción:

- `index.html`, `404.html`, `gracias.html`
- `lead-forward.php`
- `.htaccess`, `robots.txt`, `sitemap.xml`
- `assets/` (CSS, JS, imágenes)
- los 12 directorios de ruta (`tasaciones/*`, `valuacion-para-vender/`, `informes-periciales/`,
  `nosotros/`, `preguntas-frecuentes/`, `contacto/`)

Nunca incluye: `docs/`, `prompts/`, `tests/`, `deploy/`, `.git*`, `content.mjs`,
`build-site.mjs`, `verify.mjs`, `package*.json`, `plan.md`, ni `leads.log`.

## 2. Subir a Hostinger

1. hPanel → File Manager → `public_html/`.
2. Subir `dist/tasacion-<fecha>.zip`.
3. Extraer ahí mismo (el zip es plano: `index.html` y `.htaccess` quedan directamente en
   `public_html/`, no en una subcarpeta).
4. Verificar que `leads.log` sea escribible por PHP (se crea solo en el primer POST si no existe).

## 3. Variables de entorno (opcionales, nunca bloquean el sitio)

En hPanel → Node/PHP → Environment (o un include fuera de `public_html/`):

- `VENDERCRM_URL` / `VENDERCRM_API_KEY` — sin esto, los leads quedan solo en `leads.log`
  (ver `lead-forward.php`).
- El ID de analítica (`ANALYTICS_ID`) no es una env var: es la línea
  `var ANALYTICS_ID = '';` en `build-site.mjs` — ponerla ahí y regenerar (§9.3 de `plan.md`).

## 4. Verificar después de subir

- `https://tasacion.com.py/tasaciones/terrenos/` muestra el chip "Informe oficial de tasación" y
  el panel de precio a mitad de página.
- El FAB (esquina inferior derecha) abre el menú de WhatsApp con la opción 1 preseleccionada.
- El formulario de `/contacto/` hace POST a `/lead-forward.php` y redirige a `/gracias.html`.
- `https://tasacion.com.py/sitemap.xml` responde con las 13 URLs.

## 5. Rollback

Hostinger no versiona `public_html/` automáticamente. Antes de extraer un zip nuevo sobre una
versión en producción, descargar un backup de `public_html/` desde el File Manager (o usar el
backup automático de Hostinger si el plan lo incluye).
