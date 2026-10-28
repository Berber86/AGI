import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { outDir: 'dist', assetsInlineLimit: 4096 },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
