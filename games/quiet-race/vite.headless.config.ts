import { defineConfig } from 'vite';

/**
 * Builds a single classic-script bundle so the game can be booted inside
 * jsdom (see scripts/headless-run.mjs). This is QA tooling, not the shipped build.
 */
export default defineConfig({
  build: {
    outDir: 'dist-headless',
    emptyOutDir: true,
    target: 'es2020',
    minify: false,
    lib: {
      entry: 'src/main.ts',
      name: 'QuietRace',
      formats: ['iife'],
      fileName: () => 'game.js',
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
