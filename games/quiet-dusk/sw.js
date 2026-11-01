/* Офлайн-кэш «Тихого заката»: после первой загрузки игра работает без сети. */
var CACHE = 'quiet-dusk-v1';
var ASSETS = [
  './',
  './index.html',
  './styles.css',
  './src/game.js',
  './src/art.js',
  './src/vendor/pixelfx/core/index.js',
  './src/vendor/pixelfx/core/act.js',
  './src/vendor/pixelfx/core/actor.js',
  './src/vendor/pixelfx/core/chain.js',
  './src/vendor/pixelfx/core/color.js',
  './src/vendor/pixelfx/core/font.js',
  './src/vendor/pixelfx/core/fx.js',
  './src/vendor/pixelfx/core/math.js',
  './src/vendor/pixelfx/core/painter.js',
  './src/vendor/pixelfx/core/particles.js',
  './src/vendor/pixelfx/core/poses.js',
  './src/vendor/pixelfx/core/rig.js',
  './src/vendor/pixelfx/core/scene.js',
  './src/vendor/pixelfx/core/shapes.js',
  './src/vendor/pixelfx/core/sim.js',
  './src/vendor/pixelfx/fx/melee/sword-slash.js',
  './src/vendor/pixelfx/fx/impacts/_lib.js',
  './src/vendor/pixelfx/fx/impacts/crit-hit.js',
  './src/vendor/pixelfx/fx/ice/frost-nova.js',
  './src/vendor/pixelfx/fx/holy/_lib.js',
  './src/vendor/pixelfx/fx/holy/heal.js',
  './src/vendor/pixelfx/fx/ui/_lib.js',
  './src/vendor/pixelfx/fx/ui/damage-number.js',
  './src/vendor/pixelfx/fx/ui/crit-number.js',
  './src/vendor/pixelfx/fx/ui/level-up.js',
  './src/vendor/pixelfx/fx/critters/_lib.js',
  './src/vendor/pixelfx/fx/critters/slime.js',
  './src/vendor/pixelfx/fx/critters/frog.js',
  './src/vendor/pixelfx/fx/weather/_lib.js',
  './src/vendor/pixelfx/fx/weather/fireflies.js',
  './src/vendor/pixelfx/fx/transitions/_lib.js',
  './src/vendor/pixelfx/fx/transitions/star-iris.js',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});
