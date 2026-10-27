import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: '0.0.0.0', allowedHosts: true, port: 5173 },
  preview: { host: '0.0.0.0', allowedHosts: true, port: 4173 },
  build: { chunkSizeWarningLimit: 900, target: 'es2020' },
});
