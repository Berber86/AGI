// Голубой риф VR — офлайн-кэш. Пути относительные: игра работает из подпапки.
//
// Два кэша, потому что код и тяжёлые библиотеки живут по-разному:
//   CACHE   — оболочка и код (html, css, js, manifest). Версия в имени: при
//             обновлении перекачивается только он (~1.5 МБ).
//   MEDIA   — three.js и иконки. Почти не меняются между релизами, поэтому имя
//             без версии: после обновления кода они не тянутся заново.
const CACHE = 'brvr-v1';
const MEDIA_CACHE = 'brvr-media-v1';

const CODE = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './src/main.js',
  './src/config.js',
  './src/storage.js',
  './src/scene.js',
  './src/vr.js',
  './src/camtrack.js',
  './src/camtrack-worker.js',
  './src/shading.js',
  './src/textures.js',
  './src/noise.js',
  './src/seabed.js',
  './src/corals.js',
  './src/fish.js',
  './src/whale.js',
  './src/ocean.js',
];

const MEDIA = [
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-512-maskable.png',
  './vendor/three/three.module.js',
  './vendor/three/jsm/utils/BufferGeometryUtils.js',
  './vendor/three/jsm/geometries/RoundedBoxGeometry.js',
  './vendor/three/jsm/postprocessing/EffectComposer.js',
  './vendor/three/jsm/postprocessing/MaskPass.js',
  './vendor/three/jsm/postprocessing/OutputPass.js',
  './vendor/three/jsm/postprocessing/Pass.js',
  './vendor/three/jsm/postprocessing/RenderPass.js',
  './vendor/three/jsm/postprocessing/ShaderPass.js',
  './vendor/three/jsm/postprocessing/UnrealBloomPass.js',
  './vendor/three/jsm/shaders/CopyShader.js',
  './vendor/three/jsm/shaders/LuminosityHighPassShader.js',
  './vendor/three/jsm/shaders/OutputShader.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Кладём по одному: addAll атомарен, и один 404 оставил бы офлайн-кэш дырявым.
    let ok = 0;
    for (const url of CODE) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res && res.ok) { await cache.put(url, res.clone()); ok++; }
      } catch { /* сеть может быть оборвана — считаем ниже */ }
    }
    // Неполный кэш кода роняет установку: старый рабочий service worker остаётся.
    if (ok < Math.ceil(CODE.length * 0.9)) {
      throw new Error(`precache incomplete: ${ok}/${CODE.length}`);
    }
    const media = await caches.open(MEDIA_CACHE);
    for (const url of MEDIA) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res && res.ok) await media.put(url, res.clone());
      } catch { /* медиа докачается по первому обращению */ }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE && n !== MEDIA_CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Навигация: сначала сеть (чтобы подхватить новую версию), офлайн — из кэша.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('./', fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(CACHE);
        return (await cache.match('./')) || (await cache.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  const isMedia = url.pathname.includes('/assets/') || url.pathname.includes('/vendor/');
  event.respondWith((async () => {
    const name = isMedia ? MEDIA_CACHE : CACHE;
    const cache = await caches.open(name);
    const hit = await cache.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return hit || Response.error();
    }
  })());
});
