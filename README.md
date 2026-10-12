# tasacion.com.py

Sitio de Tasación.com.py: HTML estático generado con Node a partir de `content.mjs`
(más `content/wa-messages.mjs` para los mensajes de WhatsApp) mediante `build-site.mjs`.
El formulario de contacto envía a `lead-forward.php` (usa `lib/lead-delivery.php`), que guarda
el lead en un outbox privado y lo reenvía a VenderCRM. El deploy es por Git desde `master`
hacia Hostinger; el servidor no necesita Node.

## Comandos

```
node build-site.mjs          # regenera todo el HTML y los assets minificados
node verify.mjs              # compuerta de build: regenera y verifica páginas, mensajes, enlaces y redirects
node tools/check-contact.mjs # QA del contacto: número, mensajes y que no haya teléfonos sueltos en archivos versionados
npm run test:leads           # pruebas de la entrega de leads (PHP y Node)
node tests/wa-menu.mjs       # prueba en navegador (Playwright) del menú de WhatsApp
```

Otros scripts útiles están en `package.json` (por ejemplo `npm run check:links` y `npm run audit`).
Vista previa local: `node serve.mjs` (solo desarrollo; no ejecuta PHP ni las reglas de Apache).

## Reglas

- **El HTML generado y `assets/css/site.min.css` / `assets/js/site.min.js` están commiteados.**
  No se editan a mano: tras cualquier cambio en `content.mjs`, `content/`, `assets/` o
  `build-site.mjs`, ejecutar `node build-site.mjs` y commitear junto con las fuentes.
- URLs, títulos y canonicals están congelados en `docs/routes.json`; no cambiarlos sin decisión explícita.
- El número de WhatsApp y de teléfono vive **solo** en `content/wa-messages.mjs`. No escribirlo en
  otros archivos ni en la documentación; `tools/check-contact.mjs` lo controla.
- Credenciales de VenderCRM y datos de leads nunca van al repositorio.
  Solo `deploy/vendercrm-config.example.php` (sin secretos) se versiona.

## Documentación

- [`docs/OPERATIONS.md`](docs/OPERATIONS.md): estado actual y cómo operar (editar, construir, desplegar, leads).
- [`docs/DEPLOY.md`](docs/DEPLOY.md): deploy por Git en Hostinger y alternativa con zip.
- [`docs/audit/2026-10-12-improvement-report.md`](docs/audit/2026-10-12-improvement-report.md): informe de mejoras vigente.
- [`docs/decisions-needed.md`](docs/decisions-needed.md): decisiones pendientes del dueño.
- [`docs/history/`](docs/history/): especificaciones y planes históricos (`BUILD-SPEC.md`, `plan.md`, `PLACEHOLDERS.md`, `NEXT-STEPS.md`).
