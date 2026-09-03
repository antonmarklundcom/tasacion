#!/usr/bin/env bash
# tools/build-zip.sh — builds dist/tasacion-com-py.zip ready for upload to
# public_html on Hostinger shared hosting.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir dist

zip -r dist/tasacion-com-py.zip . \
  -x "docs/*" \
  -x ".git/*" \
  -x ".claude/*" \
  -x "tools/*" \
  -x "dist/*" \
  -x "storage/*.log" \
  -x "config/secrets.php" \
  -x "node_modules/*" \
  -x "package.json" \
  -x "package-lock.json" \
  -x ".gitignore"

echo ""
echo "== File list in dist/tasacion-com-py.zip =="
unzip -l dist/tasacion-com-py.zip

echo ""
echo "== Size =="
du -h dist/tasacion-com-py.zip
