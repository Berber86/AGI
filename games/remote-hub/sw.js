const CACHE = 'agi-remote-hub-v1';
const SHELL = [
  './',
  './index.html',
  './hub.js',
  './local-pair.js',
  './qr/index.js',
  './qr/decode.js',
  './cover.svg',
  './manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const net = fetch(event.request)
        .then((res) => {
          if (res && res.ok && new URL(event.request.url).origin === self.location.origin) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, clone)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || net;
    }),
  );
});
