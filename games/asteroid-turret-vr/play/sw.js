// Split caches (guide §9): versioned CODE cache, stable MEDIA cache.
const CACHE = 'asteroid-turret-code-v1';
const MEDIA_CACHE = 'asteroid-turret-media-v1';
const CODE = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    let ok = 0;
    for (const url of CODE) { try { const r = await fetch(url); if (r.ok) { await cache.put(url, r.clone()); ok++; } } catch {} }
    if (ok < CODE.length * 0.9) throw new Error('incomplete precache');
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k !== MEDIA_CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const media = /\.(?:png|jpe?g|webp|svg|mp3|woff2?)$/.test(url.pathname);
  e.respondWith((async () => {
    const cache = await caches.open(media ? MEDIA_CACHE : CACHE);
    const hit = await cache.match(e.request);
    if (hit && media) return hit;
    try { const r = await fetch(e.request); if (r.ok) cache.put(e.request, r.clone()); return r; }
    catch { return hit || Response.error(); }
  })());
});
