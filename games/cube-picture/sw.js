/* Офлайн-кэш «Кубик-картинка»: после первой загрузки игра работает без сети. */
var CACHE = 'cube-picture-v3'; // менять при каждом обновлении игры — иначе телефон покажет старую версию из кэша
var ASSETS = [
  './',
  './index.html',
  './styles.css',
  './src/app.js',
  './src/pictures.js',
  './src/vision.js',
  './src/draw.js',
  './src/anim.js',
  './src/sound.js',
  './src/icons.js',
  './icon.svg',
  './cover.svg',
  './manifest.webmanifest',
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf('cube-picture-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      });
    })
  );
});
