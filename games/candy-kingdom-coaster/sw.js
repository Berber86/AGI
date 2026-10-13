// Candy Kingdom Coaster — offline cache (PWA). Relative paths: safe under any subpath.
const CACHE = 'ckc-v10';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './src/main.js',
  './src/config.js',
  './src/storage.js',
  './src/audio.js',
  './src/input.js',
  './src/track.js',
  './src/car.js',
  './src/sdf.js',
  './src/lily.js',
  './src/ponytail.js',
  './src/world.js',
  './src/sweets.js',
  './src/hud.js',
  './src/quality.js',
  './src/textures.js',
  './src/ramps.js',
  './src/music.js',
  './src/bridge.js',
  './src/merge.js',
  './src/billboards.js',
  './vendor/three/three.module.js',
  './vendor/three/jsm/postprocessing/EffectComposer.js',
  './vendor/three/jsm/postprocessing/RenderPass.js',
  './vendor/three/jsm/postprocessing/ShaderPass.js',
  './vendor/three/jsm/postprocessing/MaskPass.js',
  './vendor/three/jsm/postprocessing/Pass.js',
  './vendor/three/jsm/postprocessing/UnrealBloomPass.js',
  './vendor/three/jsm/postprocessing/OutputPass.js',
  './vendor/three/jsm/shaders/CopyShader.js',
  './vendor/three/jsm/shaders/LuminosityHighPassShader.js',
  './vendor/three/jsm/shaders/OutputShader.js',
  './vendor/three/jsm/geometries/RoundedBoxGeometry.js',
  './vendor/three/jsm/utils/BufferGeometryUtils.js',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-512-maskable.png',
  './assets/lily.png',
  './assets/textures/road.webp',
  './assets/textures/road-cookie.webp',
  './assets/textures/road-choco.webp',
  './assets/textures/road-cream.webp',
  './assets/textures/road-waffle.webp',
  './assets/textures/meadow.webp',
  './assets/textures/fields.webp',
  './assets/textures/lollipop-pink.webp',
  './assets/textures/lollipop-blue.webp',
  './assets/textures/lollipop-yellow.webp',
  './assets/textures/cane.webp',
  './assets/textures/cookie.webp',
  './assets/textures/wall.webp',
  './assets/textures/donut-pink.webp',
  './assets/textures/donut-lilac.webp',
  './assets/textures/gumdrop.webp',
  './assets/textures/marshmallow.webp',
  './assets/textures/gingerbread.webp',
  './assets/textures/car-unicorn.webp',
  './assets/textures/car-lettering.webp',
  './assets/textures/car-roundel.webp',
  './assets/textures/car-emblem.webp',
  './assets/textures/car-plate.webp',
  './assets/textures/car-quilt.webp',
  './assets/textures/car-polka.webp',
  './assets/textures/car-plush.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
