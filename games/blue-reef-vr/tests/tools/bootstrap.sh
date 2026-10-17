#!/usr/bin/env bash
# bootstrap.sh — восстановить headless-стенд после сброса песочницы.
#   bash tests/tools/bootstrap.sh   (из каталога games/blue-reef-vr)
# Ставит puppeteer-core и @sparticuz/chromium в /home/user/tools, распаковывает
# рантайм, копирует QA-скрипты рядом с node_modules и поднимает статический
# сервер на 127.0.0.1:8899 (корень репозитория).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../.." && pwd)"
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
  python3 - "$REPO" <<'PY'
import subprocess, sys
log = open('/tmp/http.log', 'ab')
subprocess.Popen([sys.executable, '-m', 'http.server', '8899', '--bind', '127.0.0.1'], cwd=sys.argv[1],
                 stdin=subprocess.DEVNULL, stdout=log, stderr=log, start_new_session=True, close_fds=True)
PY
  sleep 1
fi
echo "tools: $TOOLS  chromium: $(stat -c %s /tmp/chromium) bytes  server: $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8899/games/blue-reef-vr/index.html)"
