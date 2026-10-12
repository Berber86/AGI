// Candy Kingdom Coaster — offline cache (PWA). Relative paths: safe under any subpath.
const CACHE = 'ckc-v2';
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
  './src/world.js',
  './src/sweets.js',
  './src/hud.js',
  './src/quality.js',
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
  './assets/lily.png'
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
