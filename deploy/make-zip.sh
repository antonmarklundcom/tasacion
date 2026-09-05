#!/usr/bin/env bash
#
# Builds the archive that goes to Hostinger's public_html/.
#
#     ./deploy/make-zip.sh
#     → dist/tasacion-YYYY-MM-DD.zip
#
# The zip contains exactly what the static site needs to run and nothing
# else: no docs, no prompts, no tests, no deploy scripts, no git metadata,
# no source .mjs files and no logs. Upload it in hPanel → File Manager and
# extract inside public_html/ — the archive is flat, so files land directly
# there. See docs/DEPLOY.md.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAMP="$(date +%Y-%m-%d)"
NAME="tasacion-${STAMP}"
DIST="$ROOT/dist"
STAGE="$DIST/$NAME"

command -v zip >/dev/null || { echo "zip is not installed" >&2; exit 2; }

# Regenerate the HTML from content.mjs so the zip never ships stale pages.
(cd "$ROOT" && node build-site.mjs)

rm -rf "$STAGE" "$DIST/$NAME.zip"
mkdir -p "$STAGE"

# Everything that ships. Add a new top-level directory here when a phase
# creates one, or it will silently be missing from the deploy.
SHIP=(
  index.html
  404.html
  gracias.html
  lead-forward.php
  .htaccess
  robots.txt
  sitemap.xml
  assets
  tasaciones
  valuacion-para-vender
  informes-periciales
  nosotros
  preguntas-frecuentes
  contacto
)

for item in "${SHIP[@]}"; do
  [ -e "$ROOT/$item" ] || { echo "missing: $item" >&2; exit 1; }
  cp -R "$ROOT/$item" "$STAGE/"
done

# Belt and braces: nothing that should have been excluded may be in the stage.
for forbidden in docs prompts tests deploy .git .github content.mjs build-site.mjs build-images.mjs serve.mjs verify.mjs package.json package-lock.json node_modules plan.md README.md NEXT-STEPS.md PLACEHOLDERS.md BUILD-SPEC.md dist leads.log; do
  if [ -e "$STAGE/$forbidden" ]; then
    echo "refusing to ship: $forbidden" >&2
    exit 1
  fi
done

# Flat archive: extracting it inside public_html/ puts index.html, .htaccess
# and every page directory directly in place — no wrapper folder to move out of.
( cd "$STAGE" && zip -qr "$DIST/$NAME.zip" . )

echo "dist/$NAME.zip  ($(du -h "$DIST/$NAME.zip" | cut -f1), $(find "$STAGE" -type f | wc -l) files)"
echo "staged at dist/$NAME/"
