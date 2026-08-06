# NEXT-STEPS — tasacion.com.py

Estado actual: **one-pager MODO 1 terminado** (`index.html`, `gracias.html`,
`lead-forward.php`), en DEMO/noindex. Falta la expansión a MODO 3.5 CORE 15.

## Track A — código (ejecutable por Sonnet con un BUILD-SPEC)

CORE 15 según `paraguay-local-site` §10.4.1:

```
/                                startsidan (ya existe)
/servicios/casas-y-departamentos
/servicios/terrenos
/servicios/locales-comerciales
/servicios/informe-de-tasacion
/servicios/tasacion-online
/zonas/asuncion
/zonas/luque
/zonas/san-lorenzo
/zonas/interior
/cotizador          (rango, sin precios publicados — §10.6)
/contacto
/preguntas-frecuentes
/guias/<tema-1>
/guias/<tema-2>
```

Además: header/footer compartidos, breadcrumbs + `BreadcrumbList`, canonical/OG
por página, `sitemap.xml` ampliado, texto prellenado de WhatsApp por página
(§10.5), `WA_NUMBER` en una sola línea por archivo.

## Track B — bloqueado por el cliente

Ver `PLACEHOLDERS.md`: RUC, factura, matrícula, número dedicado, grilla de
precios, reseñas reales, `VENDERCRM_URL` + API key, snippet de analítica,
y el checklist de lanzamiento (quitar noindex, robots.txt de producción).

## Imágenes

8 assets en `assets/img/` (640/1280/1920 × avif+webp). Sin usar:
`tasador-de-terrenos-gran-asuncion` — candidato para el hub `/zonas/`.
`build-images.mjs` regenera en el mismo estilo si hacen falta más.

## Modelo recomendado

1. **Opus, una sesión corta** → escribe `BUILD-SPEC.md` (LÄGE 0 de
   `paraguay-local-site`): mapa keyword→página, un sólo keyword primario por
   página, ángulo real y distinto por zona, lógica del cotizador.
2. **Sonnet 5** → ejecuta las 15 páginas contra ese spec.
