import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const offlineShellPlugin: Plugin = {
  name: 'microgenesis-offline-shell',
  apply: 'build',
  generateBundle(_options, bundle) {
    const builtFiles = Object.keys(bundle).filter((file) => /\.(?:js|css|html|webmanifest|svg|png|woff2?)$/i.test(file));
    const urls = [...new Set([
      './',
      './index.html',
      './manifest.webmanifest',
      './icons/microgenesis.svg',
      './icons/microgenesis-192.png',
      './icons/microgenesis-512.png',
      ...builtFiles.map((file) => `./${file}`),
    ])];
    const revision = urls.reduce((hash, url) => {
      for (const character of url) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
      return hash >>> 0;
    }, 5381).toString(36);
    const cacheName = `microgenesis-${revision}`;
    const worker = [
      `const CACHE_NAME = ${JSON.stringify(cacheName)};`,
      `const PRECACHE_URLS = ${JSON.stringify(urls)};`,
      "self.addEventListener('install', event => {",
      '  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));',
      '});',
      "self.addEventListener('activate', event => {",
      '  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(\'microgenesis-\') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));',
      '});',
      "self.addEventListener('fetch', event => {",
      '  const request = event.request;',
      "  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;",
      '  event.respondWith(caches.open(CACHE_NAME).then(async cache => {',
      '    const cached = await cache.match(request);',
      '    if (cached) return cached;',
      '    try {',
      '      const response = await fetch(request);',
      '      if (response.ok) event.waitUntil(cache.put(request, response.clone()));',
      '      return response;',
      '    } catch {',
      "      if (request.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();",
      '      return Response.error();',
      '    }',
      '  }));',
      '});',
    ].join('\n');
    this.emitFile({ type: 'asset', fileName: 'sw.js', source: worker });
  },
};

export default defineConfig({
  base: './',
  plugins: [offlineShellPlugin],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: ['.e2b.app', 'localhost'],
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['.e2b.app', 'localhost'],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    clearMocks: true,
  },
});
