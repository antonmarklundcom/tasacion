# Keyword map, 2026-09-30

**The keyword-library MCP is not connected in this build session.** `list_projects`, `project_overview`, `list_groups`, `get_group` and `keyword_lookup` were not available: ToolSearch found no such server, and the connector registry has no keyword-library entry. So no Paraguay volumes were recorded.

Consequence, per the build rules ("no data means no new page"):
- Plan items 10–12 (new `/tasaciones/sucesiones-y-juicios/`, the restored `/guias/…` pages, `/guias/vigencia-de-una-tasacion/`, `/zonas/<city>/`) are **skipped** until a session with the MCP connected confirms volume. The 8 legacy 301s in `.htaccess` stay as they are.
- Everything that enriches the existing 16 URLs continues, because those pages already rank.

Provisional map (from `docs/IMPROVE-PLAN.md` §3; unchanged, not data-backed):

| Meaning group | Page | Paraguay volume | Decision |
|---|---|---|---|
| tasación de inmuebles / tasador inmobiliario | `/` | n/a | existing page, enrich only |
| tipos de tasación | `/tasaciones/` | n/a | existing |
| tasación de casas | `/tasaciones/casas/` | n/a | existing |
| tasación de departamentos | `/tasaciones/departamentos/` | n/a | existing |
| tasación de terrenos | `/tasaciones/terrenos/` | n/a | existing |
| tasación de locales comerciales | `/tasaciones/locales-comerciales/` | n/a | existing |
| tasación de campos | `/tasaciones/campos/` | n/a | existing |
| tasación corporativa | `/tasaciones/corporativa/` | n/a | existing |
| tasación hipotecaria | `/tasaciones/hipotecaria/` | n/a | existing |
| franja de dominio | `/tasaciones/franja-de-dominio/` | n/a | existing |
| tasación para vender / cuánto vale mi casa | `/valuacion-para-vender/` | n/a | existing |
| informe de tasación / perito tasador | `/informes-periciales/` | n/a | existing |
| tasación para sucesión / judicial | new page | **unknown** | skipped (no data) |
| qué es una tasación inmobiliaria | legacy guide | **unknown** | skipped, 301 stays |
| documentos para tasar un inmueble | legacy guide | **unknown** | skipped, 301 stays |
| vigencia de una tasación | FAQ entry (Phase 4) | **unknown** | FAQ only |
| city pages (Luque, San Lorenzo, …) | legacy `/zonas/*` | **unknown** | skipped, 301 stays |

To do in a later session: connect the keyword-library MCP, run the five calls for the tasacion project, fill in the volume column, and only then build the rows that have Paraguay volume.
