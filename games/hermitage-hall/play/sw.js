// Сгенерировано scripts/service-worker.mjs
const CACHE = 'hermitage-code-bb74b2613ce2';
const MEDIA_CACHE = 'hermitage-media-v1';
const CODE = ["./","./assets/index-CKi2ypia.js","./assets/index-CLNiHJIm.css","./index.html","./manifest.webmanifest","./sculpture/homer.json","./sculpture/venus-de-milo.json"];
const MEDIA = ["./art/aivazovsky-ninth-wave-thumb.jpg","./art/aivazovsky-ninth-wave.webp","./art/leonardo-litta-thumb.jpg","./art/leonardo-litta.webp","./art/matisse-dance-thumb.jpg","./art/matisse-dance.webp","./art/monet-garden-thumb.jpg","./art/monet-garden.webp","./art/rembrandt-prodigal-thumb.jpg","./art/rembrandt-prodigal.webp","./art/van-gogh-lilac-thumb.jpg","./art/van-gogh-lilac.webp","./icon-192.png","./icon-512.png","./icon.svg","./start-hall.jpg"];

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
  const media = /\.(webp|jpg|jpeg|png|svg)$/i.test(url.pathname);
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
