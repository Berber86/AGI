#!/usr/bin/env bash
# bootstrap.sh — recreate the headless QA toolchain for «Первичный бульон».
# Run from anywhere:  bash games/primordial-broth/tests/tools/bootstrap.sh
# Installs puppeteer-core + @sparticuz/chromium into /home/user/tools, unpacks the
# chromium runtime into /tmp, copies this game's QA scripts next to node_modules and
# starts a static server on 127.0.0.1:8899 serving the repository root.
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
mkdir -p "$TOOLS/src"
cp "$HERE"/*.mjs "$TOOLS"/
if [ -d "$HERE/src" ]; then cp "$HERE"/src/*.mjs "$TOOLS"/src/ 2>/dev/null || true; fi
if [ ! -x /tmp/chromium ]; then
  node "$TOOLS/setup-runtime.mjs"
fi
if ! curl -s -o /dev/null http://127.0.0.1:8899/; then
  python3 - "$REPO" <<'PY'
import subprocess, sys
log = open('/tmp/http.log', 'ab')
subprocess.Popen([sys.executable, '-m', 'http.server', '8899', '--bind', '127.0.0.1'], cwd=sys.argv[1],
                 stdin=subprocess.DEVNULL, stdout=log, stderr=log, start_new_session=True, close_fds=True)
PY
  sleep 1
fi
python3 -c "import PIL" 2>/dev/null || pip install -q --break-system-packages pillow >/dev/null 2>&1 || true
echo "tools: $TOOLS  chromium: $(stat -c%s /tmp/chromium 2>/dev/null || echo missing) bytes  server: $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8899/games/primordial-broth/index.html)"
