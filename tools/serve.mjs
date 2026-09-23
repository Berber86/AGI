/**
 * Локальный сервер для игры.
 *
 * Без зависимостей: только node:http и node:fs. Отдаёт файлы из корня
 * репозитория, поэтому index.html, styles.css и src/ видны по обычным путям,
 * а модули в браузере импортируются так же, как в Node.
 *
 * Привязка к 0.0.0.0 обязательна: предпросмотр Arena проксирует порт снаружи,
 * и сервер, слушающий только 127.0.0.1, из браузера недостижим.
 */

import http from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

/** Путь из URL в путь на диске с защитой от выхода за корень. */
function toFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const rel = normalize(clean).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
  const full = join(ROOT, rel);
  // resolve и сравнение с корнем: нормализация может оставить «..» в хитрых случаях
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  return full;
}

const server = http.createServer((req, res) => {
  const started = Date.now();
  const send = (code, body, type = 'text/plain; charset=utf-8') => {
    res.writeHead(code, {
      'Content-Type': type,
      'Cache-Control': 'no-store',          // dev-сервер: иначе правки не видны
      'Content-Length': Buffer.byteLength(body),
    });
    res.end(body);
    log(req, code, Date.now() - started);
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(405, 'Только GET');
  }

  let file = toFile(req.url || '/');
  if (!file) return send(403, 'Запрещено');

  try {
    let st = statSync(file);
    if (st.isDirectory()) {
      file = join(file, 'index.html');
      if (!existsSync(file)) return send(404, `Нет index.html в ${req.url}`);
      st = statSync(file);
    }
    const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-store',
      'Content-Length': st.size,
    });
    if (req.method === 'HEAD') { res.end(); log(req, 200, Date.now() - started); return; }
    const stream = createReadStream(file);
    stream.on('error', () => { if (!res.writableEnded) send(500, 'Ошибка чтения'); });
    stream.pipe(res);
    res.on('finish', () => log(req, 200, Date.now() - started));
  } catch {
    send(404, `Не найдено: ${req.url}`);
  }
});

function log(req, code, ms) {
  const mark = code < 400 ? '·' : '!';
  process.stdout.write(`${mark} ${code} ${req.method} ${req.url} ${ms}мс\n`);
}

server.listen(PORT, HOST, () => {
  process.stdout.write(`«Верфь на костях» → http://${HOST}:${PORT}/ (корень ${ROOT})\n`);
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => { server.close(() => process.exit(0)); });
}
