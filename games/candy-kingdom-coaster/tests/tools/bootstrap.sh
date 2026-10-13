#!/usr/bin/env bash
# bootstrap.sh — recreate the headless QA toolchain after a sandbox reset.
#   bash tests/tools/bootstrap.sh            (run from games/candy-kingdom-coaster)
# Installs puppeteer-core + @sparticuz/chromium into /home/user/tools, unpacks
# the chromium runtime into /tmp, copies the QA scripts next to node_modules
# and starts a static server on 127.0.0.1:8899 serving the repo root.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
GAME="$(cd "$HERE/../.." && pwd)"
REPO="$(cd "$GAME/../.." && pwd)"
TOOLS=/home/user/tools

mkdir -p "$TOOLS" /home/user/shots
cd "$TOOLS"
if [ ! -d node_modules/puppeteer-core ] || [ ! -d node_modules/@sparticuz/chromium ]; then
  npm install --silent --no-audit --no-fund puppeteer-core @sparticuz/chromium
fi
cp "$HERE"/*.mjs "$TOOLS"/
if [ ! -x /tmp/chromium ]; then
  node "$TOOLS/setup-runtime.mjs"
fi
if ! curl -s -o /dev/null http://127.0.0.1:8899/; then
  (cd "$REPO" && setsid nohup python3 -m http.server 8899 --bind 127.0.0.1 >/tmp/http.log 2>&1 </dev/null &)
  sleep 1
fi
python3 -c "import PIL" 2>/dev/null || pip install -q --break-system-packages pillow >/dev/null 2>&1 || true
echo "tools: $TOOLS  chromium: $(ls -la /tmp/chromium | awk '{print $5}') bytes  server: $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8899/games/candy-kingdom-coaster/index.html)"
