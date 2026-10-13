import { defineConfig } from 'vite';

// Relative base keeps the static build deployable from any subdirectory
// (GitHub Pages, file servers, or a plain folder copy on a phone).
export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    // The Arena preview proxies the dev server through a generated host name,
    // so host checking must stay permissive for the preview to work.
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2048,
  },
});
