// Candy Kingdom Coaster — offline cache (PWA). Relative paths: safe under any subpath.
//
// Два кэша, потому что обновления и медиа живут по-разному:
//   CACHE       — код и оболочка (html, js, css, manifest). Меняется при каждом
//                 обновлении игры, поэтому версия в имени и полная перезакачка
//                 только этих 1.5 МБ.
//   MEDIA_CACHE — картинки/текстуры/модели (5.8 МБ). Не меняются при обновлении
//                 кода: качаются ОДИН раз (при первом обращении) и живут между
//                 версиями. Раньше каждое обновление тянуло все 7.3 МБ заново —
//                 на телефоне это давало рывки, если начать играть сразу.
const CACHE = 'ckc-v46'; // v46: код в отдельном кэше от медиа
const MEDIA_CACHE = 'ckc-media-v1';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './src/main.js',
  './src/boot.js',
  './src/loading.js',
  './src/config.js',
  './src/storage.js',
  './src/audio.js',
  './src/input.js',
  './src/track.js',
  './src/course.js',
  './src/routes.js',
  './src/forks.js',
  './src/candykit.js',
  './src/landmarks.js',
  './src/ambient.js',
  './src/cakes.js',
  './src/car.js',
  './src/sdf.js',
  './src/lily.js',
  './src/ponytail.js',
  './src/world.js',
  './src/sweets.js',
  './src/hud.js',
  './src/quality.js',
  './src/vr.js',
  './src/remote.js',
  './src/camtrack.js',
  './src/camtrack-worker.js',
  './joystick/index.html',
  './tracking-stand/index.html',
  './src/textures.js',
  './src/ramps.js',
  './src/music.js',
  './src/bridge.js',
  './src/tunnel.js',
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
  './vendor/three/jsm/utils/BufferGeometryUtils.js'
];
const MEDIA = [
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-512-maskable.png',
  './assets/lily.png',
  './assets/ui/welcome.webp',
  './assets/ui/fonts/nunito-latin.woff2',
  './assets/ui/fonts/nunito-cyrillic.woff2',
  './assets/textures/fonts/Fredoka-Bold.woff2',
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

// Общая функция: кладём по одному, не роняя весь install из-за одного 404.
// (cache.addAll атомарен: один отсутствующий файл — и офлайн-кэш не соберётся.)
// Уже лежащее в кэше не перекачиваем: медиа-кэш при обновлении игры
// остаётся нетронутым (0 запросов к /assets/), а недокачанные файлы
// догружаются при следующей установке. Возвращает число файлов в кэше.
const precache = async (cacheName, list) => {
  const c = await caches.open(cacheName);
  let stored = 0;
  await Promise.all(list.map(async (url) => {
    try {
      if (await c.match(url)) { stored++; return; }
      const res = await fetch(url, { cache: 'reload' });
      if (res && res.ok) { await c.put(url, res); stored++; }
    } catch { /* offline or 404: остальные файлы всё равно кэшируем */ }
  }));
  return stored;
};

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const shell = await precache(CACHE, SHELL);
    // Медиа докачиваем только недостающее: при обновлении игры медиа-кэш уже
    // собран и переживает смену версии, поэтому обновление стоит ~1.5 МБ, а не 7.3 МБ.
    await precache(MEDIA_CACHE, MEDIA);
    // Неполный precache (оборвалась сеть) не должен активироваться и стирать
    // рабочий офлайн-кэш прошлой версии: install падает, старый SW остаётся.
    if (shell < SHELL.length * 0.9) throw new Error(`precache incomplete: ${shell}/${SHELL.length}`);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== MEDIA_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// only complete, successful responses are cached — a 404 for a file that is
// added later (e.g. the soundtrack) must not stick in the cache
const cacheable = (res) => res && res.ok && res.status === 200 && res.type !== 'opaque';
const store = (cacheName, req, res) => {
  if (cacheable(res)) { const copy = res.clone(); caches.open(cacheName).then((c) => c.put(req, copy)).catch(() => {}); }
  return res;
};

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // custom soundtrack (assets/music/): network first so a new/replaced mp3 is
  // picked up, cached copy for offline play; no index.html fallback for audio
  if (url.pathname.includes('/assets/music/')) {
    e.respondWith(
      fetch(e.request).then((res) => store(MEDIA_CACHE, e.request, res))
        .catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || new Response('', { status: 404 })))
    );
    return;
  }
  // медиа: cache-first в отдельном кэше, который переживает обновления кода
  if (url.pathname.includes('/assets/')) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then((hit) => hit
        || fetch(e.request).then((res) => store(MEDIA_CACHE, e.request, res))
          .catch(() => new Response('', { status: 404 })))
    );
    return;
  }
  // код/оболочка: свой версионированный кэш
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit
      || fetch(e.request).then((res) => store(CACHE, e.request, res))
        .catch(() => caches.match('./index.html')))
  );
});
