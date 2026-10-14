# Welcome screen assets

- `welcome.webp`: original AI-generated menu key art, using the existing
  `assets/lily.png` as the character reference. A single 960×720 WebP (~60 KB),
  loaded before the 3D engine so the loading screen is never an empty scene.
  The large source image is not shipped or tracked.
- `fonts/nunito-{latin,cyrillic}.woff2`: Nunito variable font subsets from the
  npm package `@fontsource-variable/nunito`, under the SIL Open Font License
  in `fonts/OFL.txt`. Both Russian and Latin UI text work fully offline.
- The title reuses the already-vendored Fredoka Bold font and its license in
  `../textures/fonts/`.
- All HUD icons are small inline SVG symbols in `index.html`, not emoji-font
  glyphs or external icon requests. Their silhouettes remain consistent on
  Android, desktop and headless browsers.

No runtime CDN, extra framework, or image-generation service is required.
