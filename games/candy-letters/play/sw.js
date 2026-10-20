/* «Сладкие буквы»: весь пакет крошечный, поэтому кэшируем его целиком на install. */
const CACHE = 'candy-letters-v1';
const FILES = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './assets/main.js',
  './assets/state.js',
  './assets/letters.js',
  './assets/paths.js',
  './assets/tracing.js',
  './assets/render.js',
  './assets/audio.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('candy-letters-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (!event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).catch(() =>
          event.request.mode === 'navigate' ? caches.match(new URL('./index.html', self.registration.scope)) : Response.error(),
        ),
    ),
  );
});
