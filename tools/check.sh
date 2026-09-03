#!/usr/bin/env bash
# tools/check.sh — smoke test against `php -S 127.0.0.1:8080 index.php`.
# Exits non-zero on any failure and prints a summary.
set -u
cd "$(dirname "$0")/.."

HOST="127.0.0.1"
PORT="8080"
BASE="http://$HOST:$PORT"

PASS=0
FAIL=0
FAILURES=()

ok()   { PASS=$((PASS+1)); }
bad()  { FAIL=$((FAIL+1)); FAILURES+=("$1"); echo "FAIL: $1"; }

# ---------- start server ----------
rm -f storage/wa-clicks.log storage/leads.log
php -S "$HOST:$PORT" index.php > /tmp/tasacion-check-server.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT

for i in $(seq 1 20); do
  curl -s -o /dev/null "$BASE/" && break
  sleep 0.2
done

echo "== 1. All 17 routes -> 200 =="
ROUTES=(
  "/" "/tasaciones/casas/" "/tasaciones/departamentos/" "/tasaciones/terrenos/"
  "/tasaciones/corporativa/" "/tasaciones/hipotecaria/" "/tasaciones/locales-comerciales/"
  "/tasaciones/campos/" "/valuacion-para-vender/" "/informes-periciales/" "/nosotros/"
  "/preguntas-frecuentes/" "/contacto/" "/gracias/" "/politica-de-privacidad/"
  "/politica-de-cookies/" "/terminos-y-condiciones/"
)
for r in "${ROUTES[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$r")
  if [ "$code" = "200" ]; then ok; else bad "route $r -> $code (expected 200)"; fi
done

echo "== 2. Legacy 301 redirects =="
declare -A REDIRECTS=(
  ["/servicios/tasacion-de-casas-y-departamentos/"]="/tasaciones/casas/"
  ["/servicios/tasacion-de-terrenos/"]="/tasaciones/terrenos/"
  ["/servicios/tasacion-de-locales-comerciales/"]="/tasaciones/locales-comerciales/"
  ["/servicios/informe-de-tasacion/"]="/informes-periciales/"
  ["/servicios/tasacion-online/"]="/valuacion-para-vender/"
)
for from in "${!REDIRECTS[@]}"; do
  expect="${REDIRECTS[$from]}"
  loc=$(curl -s -o /dev/null -D - "$BASE$from" | grep -i '^location:' | tr -d '\r' | awk '{print $2}')
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$from")
  if [ "$code" = "301" ] && [ "$loc" = "$expect" ]; then ok; else bad "redirect $from -> [$code] $loc (expected 301 $expect)"; fi
done

echo "== 3. Missing trailing slash -> 301 to slashed =="
loc=$(curl -s -o /dev/null -D - "$BASE/tasaciones/casas" | grep -i '^location:' | tr -d '\r' | awk '{print $2}')
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/tasaciones/casas")
if [ "$code" = "301" ] && [ "$loc" = "/tasaciones/casas/" ]; then ok; else bad "trailing-slash redirect -> [$code] $loc"; fi

echo "== 4. Unknown route -> 404 =="
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/nada/")
if [ "$code" = "404" ]; then ok; else bad "/nada/ -> $code (expected 404)"; fi

echo "== 5. go/whatsapp.php redirect + logging =="
rm -f storage/wa-clicks.log
loc=$(curl -s -o /dev/null -D - "$BASE/go/whatsapp.php?src=check-test&t=casa&z=Luque" | grep -i '^location:' | tr -d '\r' | awk '{print $2}')
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/go/whatsapp.php?src=check-test&t=casa&z=Luque")
if [ "$code" = "302" ] && [[ "$loc" == https://wa.me/595995628862?text=* ]]; then ok; else bad "go/whatsapp.php -> [$code] $loc"; fi
if [ -f storage/wa-clicks.log ] && grep -q "check-test" storage/wa-clicks.log; then ok; else bad "wa-clicks.log missing check-test line"; fi

echo "== 6. go/stats.php -> 403 without password =="
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/go/stats.php")
if [ "$code" = "403" ]; then ok; else bad "go/stats.php -> $code (expected 403, no STATS_PASSWORD configured)"; fi

echo "== 7. api/lead.php: valid POST -> 303 + leads.log line =="
rm -f storage/leads.log
loc=$(curl -s -o /dev/null -D - -X POST "$BASE/api/lead.php" -d "telefono=0981123456&form=valuacion&tipo=Casa" | grep -i '^location:' | tr -d '\r' | awk '{print $2}')
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/lead.php" -d "telefono=0981123456&form=valuacion&tipo=Casa")
if [ "$code" = "303" ] && [ "$loc" = "/gracias/?f=valuacion" ]; then ok; else bad "api/lead.php valid POST -> [$code] $loc"; fi
if [ -f storage/leads.log ] && [ "$(wc -l < storage/leads.log)" -ge 1 ]; then ok; else bad "leads.log has no new line after valid POST"; fi

echo "== 8. api/lead.php: honeypot -> 303, no new log line =="
before=$(wc -l < storage/leads.log 2>/dev/null || echo 0)
code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE/api/lead.php" -d "telefono=0981123456&form=valuacion&website=bot-fill")
after=$(wc -l < storage/leads.log 2>/dev/null || echo 0)
if [ "$code" = "303" ] && [ "$before" = "$after" ]; then ok; else bad "honeypot POST -> [$code] log lines before=$before after=$after (expected 303, no new line)"; fi

echo "== 9. grep templates/ for wa.me =="
if grep -rq "wa\.me" templates/; then bad "wa.me literal found inside templates/"; else ok; fi

echo "== 10. crawl 17 pages: every internal href resolves to 200 =="
declare -A CHECKED
for r in "${ROUTES[@]}"; do
  html=$(curl -s "$BASE$r")
  links=$(echo "$html" | grep -oE 'href="/[^"#]*/"' | sed -E 's/href="//; s/"$//' | sort -u)
  for l in $links; do
    [ -n "${CHECKED[$l]:-}" ] && continue
    CHECKED[$l]=1
    code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$l")
    if [ "$code" = "200" ]; then ok; else bad "internal link $l (found on $r) -> $code"; fi
  done
done

echo "== 11. every <img>/<source> path exists on disk =="
for r in "${ROUTES[@]}"; do
  html=$(curl -s "$BASE$r")
  paths=$(echo "$html" | grep -oE '(src|srcset)="[^"]*"' | grep -oE '/assets/img/[^" ]+' | sort -u)
  for p in $paths; do
    if [ -f ".$p" ]; then ok; else bad "missing image file $p (referenced on $r)"; fi
  done
done

echo "== 12. php -l on every PHP file =="
while IFS= read -r f; do
  out=$(php -l "$f" 2>&1)
  if [[ "$out" == *"No syntax errors"* ]]; then ok; else bad "php -l failed on $f: $out"; fi
done < <(find . -name "*.php" -not -path "./tools/*")

# ---------- summary ----------
echo ""
echo "======================================"
echo "check.sh summary: $PASS passed, $FAIL failed"
echo "======================================"
if [ "$FAIL" -gt 0 ]; then
  printf ' - %s\n' "${FAILURES[@]}"
  exit 1
fi
exit 0
