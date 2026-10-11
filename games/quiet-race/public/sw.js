/* Тихая гонка — offline shell.
 *
 * Rules that keep the game from ever getting stuck on a stale build:
 *   1. Navigations and code are NETWORK-FIRST: a fresh deploy is picked up on
 *      the next reload, and the cache is only a fallback for offline play.
 *   2. Only pictures, icons and the manifest are cache-first (they almost never
 *      change and offline they must be instant).
 *   3. A versioned cache name, so every deploy throws the previous cache away.
 *   4. An HTML fallback is never returned for a script or style request: that
 *      used to serve index.html in place of a missing bundle, which left the
 *      game stuck on «Заводим машинку…» with no error at all.
 */
const VERSION = 'v2';
const CACHE = `quiet-race-${VERSION}`;
const SHELL = ['./', './index.html', './manifest.webmanifest'];
const MEDIA = /\.(png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|mp3|ogg|wav)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

/** Caches a successful same-origin response. */
function stash(request, response) {
  if (!response || !response.ok || response.type === 'opaque') return response;
  const copy = response.clone();
  caches
    .open(CACHE)
    .then((cache) => cache.put(request, copy))
    .catch(() => undefined);
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Pictures and icons: cache-first, refreshed in the background.
  if (MEDIA.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((hit) => {
        const network = fetch(request)
          .then((response) => stash(request, response))
          .catch(() => hit);
        return hit || network;
      }),
    );
    return;
  }

  // Everything else — the page, the bundle, the manifest: network-first.
  event.respondWith(
    fetch(request)
      .then((response) => stash(request, response))
      .catch(() =>
        caches.match(request).then((hit) => {
          if (hit) return hit;
          // Offline fallback is allowed for the page itself, never for code.
          if (request.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        }),
      ),
  );
});
