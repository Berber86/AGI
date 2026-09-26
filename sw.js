// sw.js — офлайн-кэш: игра работает без сети после первого запуска.
const CACHE = 'primordial-ocean-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg', './css/style.css',
  './js/main.js', './js/core.js', './js/config.js', './js/parts.js', './js/species.js',
  './js/cellrender.js', './js/render.js', './js/ui.js', './js/player.js', './js/ai.js',
  './js/events.js', './js/quests.js', './js/meta.js', './js/audio.js', './js/input.js',
  './js/util.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit ?? fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html'))),
  );
});
