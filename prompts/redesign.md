# Rediseño tasacion.com.py — sesión Sonnet. Lee y ejecuta `plan.md` en su totalidad.

Modelo: **Sonnet** (nunca Fable/Mythos, ni como subagente — plan.md §6.8).

1. Lee `plan.md` entero (§1 decisiones, §2 contrato, §3 guía de estilo, §4 menú WhatsApp,
   §5 copy por página, §6 protocolo, §7 tareas, §8 checklist, §9 inputs humanos, §10 plantilla).
   El canvas de diseño está linkeado arriba de plan.md; §3 es su versión escrita y completa.
2. Ejecuta §7 en orden: **PR-1 → PR-2 → PR-3 → PR-4**. Cada PR: rama `redesign/<n>-<slug>`
   desde `master` al día, commits frecuentes, abrir el PR contra `master`, suscribirte a su
   actividad, arreglar todo lo rojo, y **mergearlo vos mismo cuando CI esté verde** — no esperes
   revisión humana. Después ramificá el siguiente desde el `master` ya actualizado.
3. Trabajá hasta que TODO el checklist §8 pase. Re-ejecutable: si ya hay PRs mergeados, seguí
   desde el primero que falte (§6.6).
4. Nunca inventes los hechos que §1.3 prohíbe (RUC, matrícula, dirección, teléfono dedicado,
   reseñas, años, tiempos de respuesta, habilitación bancaria). Los únicos hechos confirmados:
   "Tasador Fernando Capurro" y el rango Gs. 800.000 a Gs. 1.500.000 — y el precio se muestra
   con moderación (§1.1: una vez por vertical, en el hub y en las FAQ; nunca en heros,
   franja final, footer ni menú WA).
5. Nunca intentes deployar: el merge del PR es la meta. No toques las 13 rutas, títulos ni
   canonicals; no cambies los campos POST de `lead-forward.php`.
6. Para las 13 páginas de copy usá subagentes **Sonnet** en paralelo (§6.9), una página cada uno.
7. Si te topás con una decisión que de verdad necesita a Anton (una credencial sin fallback o
   una decisión de base que obligaría a reescribir si se adivina mal), escribila en
   `docs/decisions-needed.md`, commit, push, y terminá — no adivines ni esperes.
8. Al terminar PR-4: dejá el informe final en `docs/log/redesign.md` y terminá la sesión.
