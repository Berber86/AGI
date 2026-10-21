// Генерирует sw.js: код с версией, медиа (полотна, скульптуры, иконки) — в отдельном
// безверсионном кэше, чтобы обновление не перекачивало 4 МБ живописи.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const dir = path.resolve('dist');
const walk = (root) => fs.readdirSync(root, { withFileTypes: true })
  .flatMap((f) => (f.isDirectory() ? walk(path.join(root, f.name)) : [path.join(root, f.name)]));

const files = walk(dir).filter((f) => !f.endsWith('sw.js'));
const isMedia = (f) => /\.(webp|jpg|jpeg|png|svg)$/i.test(f);
const rel = (f) => `./${path.relative(dir, f).split(path.sep).join('/')}`;
const code = files.filter((f) => !isMedia(f)).map(rel);
const media = files.filter(isMedia).map(rel);

const hash = crypto.createHash('sha256');
for (const file of files.filter((f) => !isMedia(f))) hash.update(fs.readFileSync(file));
const version = hash.digest('hex').slice(0, 12);

const source = `// Сгенерировано scripts/service-worker.mjs
const CACHE = 'hermitage-code-${version}';
const MEDIA_CACHE = 'hermitage-media-v1';
const CODE = ${JSON.stringify(['./', ...code])};
const MEDIA = ${JSON.stringify(media)};

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    let ok = 0;
    for (const file of CODE) {
      try { await cache.add(file); ok += 1; } catch (err) { /* одиночный 404 не должен ломать установку */ }
    }
    if (ok < Math.ceil(CODE.length * 0.9)) throw new Error('precache code incomplete');
    const media = await caches.open(MEDIA_CACHE);
    for (const file of MEDIA) {
      const hit = await media.match(file);
      if (!hit) { try { await media.add(file); } catch (err) { /* сеть — не повод падать */ } }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((k) => k.startsWith('hermitage-') && k !== CACHE && k !== MEDIA_CACHE).map((k) => caches.delete(k)),
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (!url.href.startsWith(self.registration.scope)) return;
  const media = /\\.(webp|jpg|jpeg|png|svg)$/i.test(url.pathname);
  event.respondWith((async () => {
    if (media) {
      const cached = await caches.match(event.request, { cacheName: MEDIA_CACHE });
      if (cached) return cached;
      const hit = await caches.match(event.request);
      if (hit) return hit;
      const response = await fetch(event.request);
      if (response.ok) (await caches.open(MEDIA_CACHE)).put(event.request, response.clone());
      return response;
    }
    const cached = await caches.match(event.request, { cacheName: CACHE });
    if (cached) return cached;
    try {
      return await fetch(event.request);
    } catch (err) {
      if (event.request.mode === 'navigate') return caches.match(new URL('./index.html', self.registration.scope));
      throw err;
    }
  })());
});
`;
fs.writeFileSync(path.join(dir, 'sw.js'), source);
console.log(`Service worker hermitage-code-${version}: ${code.length} файлов кода, ${media.length} медиа`);
