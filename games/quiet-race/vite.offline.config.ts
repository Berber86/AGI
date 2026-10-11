import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/**
 * Builds ONE self-contained HTML file: the whole game (Phaser included) is
 * inlined as a classic script. Useful when there is no internet and no server:
 * copy the file to a phone and open it, or keep it as a rainy-day backup.
 *
 * The normal build (`vite.config.ts`, `dist/`) stays the main delivery: it has
 * relative paths, a service worker and PWA installation.
 */
/**
 * Runs after the build: every emitted script tag is replaced by one inline
 * classic script so the single HTML file works from a file:// URL, where module
 * scripts and the service worker are not allowed.
 */
function inlineEverything(): Plugin {
  return {
    name: 'quiet-race-inline',
    enforce: 'post',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist-offline');
      const htmlPath = resolve(outDir, 'index.html');
      const html = readFileSync(htmlPath, 'utf8');
      // `$&`, `$'` and friends inside minified code must never be treated as
      // replacement patterns, so every insertion goes through a function.
      const engine = readFileSync(resolve(outDir, 'assets/game.js'), 'utf8')
        .split('</script')
        .join('<\\/script');
      const withoutTags = html.replace(/\s*<script[^>]*src="\.\/assets\/game\.js"[^>]*><\/script>/g, '');
      const inlined = withoutTags
        .replace(/<link rel="manifest"[^>]*>\s*/g, '')
        .replace(/<link rel="icon"[^>]*>\s*/g, '')
        .replace(/<link rel="apple-touch-icon"[^>]*>\s*/g, '')
        .replace('</body>', () => `<script>\n${engine}\n</script>\n</body>`);
      if (!inlined.includes('__quietRaceBootClear')) {
        throw new Error('boot guard script was lost while inlining the offline build');
      }
      writeFileSync(htmlPath, inlined, 'utf8');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [inlineEverything()],
  build: {
    outDir: 'dist-offline',
    emptyOutDir: true,
    target: 'es2020',
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/game.js',
        assetFileNames: 'assets/[name][extname]',
        manualChunks: undefined,
      },
    },
  },
});
