# Handoff — 2026-10-31

## Role / phase

- **Role:** Builder → Mobile QA → Release
- **Phase:** done (vertical slice)
- **Current task:** none

## Completed

- Discovery: 3 stages, contract approved in the **lean** version (no upgrade system, two finds, two creatures).
- Deterministic simulation without Phaser: movement, pickup with a carry cap of three, banking at the fire, tap strike with cooldown, two creatures with a 0.42 s wind-up telegraph, i-frames, dropping a carried find on damage, darkening night, lose and restart, best score in `localStorage`.
- Code-driven pixel engine in the pixelfx method: two buffers (`color` + `light`), ramp palettes, 4×4 ordered dither, translucent smoke, seeded randomness, no image assets at all.
- Renderer: baked forest floor, entities with outlines and contact shadows, a large animated campfire, fireflies, falling leaves, night with five dithered bands and warm firelight, HUD drawn above the darkness.
- Tooling: `scripts/sheet.ts` (1:1 authoring contact sheets), `scripts/sprites-sheet.ts`, `scripts/icons.mjs` (PNG icons from code), `scripts/check.mjs`, `scripts/pwa.mjs`, `scripts/e2e.mjs`.
- PWA: manifest, service worker, generated icons, relative paths, 1.21 MB total.

## Changed files

- `games/pixel-vfx-game/**` (new): `src/core/*`, `src/art/sprites.ts`, `src/fx/*`, `src/game/*`, `tests/*`, `scripts/*`, `public/*`, `index.html`, `package.json`, `tsconfig.json`, `vite.config.ts`, `README.md`, `.studio/**`.

## Verification

| Command or inspection | Result | Evidence |
|---|---|---|
| `npm run check` | ok: 12 source files, deterministic, no external URLs | console |
| `npm run typecheck` | ok | console |
| `npm test` | 26/26 unit tests pass | `.studio/evidence/reports/vitest.json`, `core.json` |
| `npm run build` | dist 1.21 MB, PWA shell ok | `.studio/evidence/reports/release.json` |
| `npm run test:e2e` | 13/13 browser checks, no console errors, 17.03 ms average frame | `.studio/evidence/reports/e2e.json`, `qa.json` |
| screenshots | title, play, night, over, portrait prompts, 915×412 | `.studio/evidence/screenshots/*.png` |

## Decisions

- Phaser is the host only (loop, pointer, canvas texture, lifecycle); every pixel is drawn by our own painter into two buffers at 320×180.
- The game is landscape-only; portrait shows an orientation prompt instead of a squeezed layout.
- No upgrade system (user chose the lean contract): progression is score, record, and a shrinking light.
- The end screen treats a new best as the "win" path, because the run itself is endless.

## Blockers and known risks

- No physical Android device: frame timing comes from headless SwiftShader, not a phone.
- Audio lifecycle is verified; the sound itself was not listened to.
- Not yet published to the repo catalog (`play/` build + card in the root `index.html`).
- Visual polish stopped at a coherent night-forest look; the light bands and the hero's silhouette at the fire are the first things to push further.

## Exact next action

Run the game on a physical Android phone in landscape, play one 60 s session with drag and taps, and record feel, frame timing and any console errors in `.studio/evidence/reports/`.

## Run / preview instructions

```bash
cd games/pixel-vfx-game
npm install
npm run dev          # http://0.0.0.0:5173 — live preview
npm run gate         # check + typecheck + test + build + e2e
python3 -m http.server 8899 --bind 0.0.0.0 --directory dist   # static build preview
```
