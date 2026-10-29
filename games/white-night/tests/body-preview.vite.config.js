import { defineConfig } from 'vite';
// Отдельная сборка «лупы» для 3D-тела: не входит в игровой бандл и в play/.
export default defineConfig({
  base: './',
  build: { outDir: '.body-preview', emptyOutDir: true, minify: false, rollupOptions: { input: 'tests/body-preview.html' } },
});
