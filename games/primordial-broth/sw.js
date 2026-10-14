// sw.js — offline cache for «Первичный бульон».
// Cache-first for the game's own files, network-first for everything else.
// Bump CACHE when shipping new build files.

const CACHE = 'pb-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-512-maskable.png',
  './src/main.js',
  './src/config.js',
  './src/rng.js',
  './src/sprites.js',
  './src/water.js',
  './src/cell.js',
  './src/fauna.js',
  './src/fx.js',
  './src/audio.js',
  './src/camera.js',
  './src/input.js',
  './src/hud.js',
  './src/mutations.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const own = url.pathname.includes('/primordial-broth/');

  if (!own) {
    // never cache the rest of the site: always try the network first
    event.respondWith(
      fetch(req).catch(() => caches.match(req).then((hit) => hit || Response.error())),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) {
        // refresh in the background, but never block the game on the network
        fetch(req).then((res) => {
          if (res && res.ok) caches.open(CACHE).then((cache) => cache.put(req, res.clone()));
        }).catch(() => undefined);
        return hit;
      }
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html').then((fallback) => fallback || Response.error()));
    }),
  );
});
