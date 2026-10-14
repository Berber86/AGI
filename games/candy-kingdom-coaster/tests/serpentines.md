# Twin cake serpentines

The route now climbs around a strawberry–vanilla cake, crosses an 84 m sky
bridge, and descends clockwise around a chocolate–blueberry cake. Each spiral
makes 1¼ turns. The bridge is at world Y = 36.4 m; the total ride is ~1,863 m.

## Implementation

- `src/course.js`: one distance-parametrised curve shared by driving, the road,
  camera and pickups. Analytic tapered spirals with level end tangents; cubic
  approaches join the original route without refitting its hills.
- `config.js` → `CAKE_COURSE`: layout and dimensions. The detour replaces base
  metres 600–900. Existing ramp/river/tunnel coordinates stay in **base-course
  metres** and are resolved with `track.fromBaseDistance(s)`; do not manually
  add an offset to them. Zone boundaries use the same mapping.
- `src/cakes.js`: tiered sponge, filling, dripping icing and fruit; continuous
  wafer deck and candy rails. Ordinary scenery is excluded from the elevated
  corridor. All materials/textures are local/procedural, with no new downloads.
- `src/track.js`: grass shoulders are omitted only on the elevated section.
- `sw.js`: `ckc-v15` precaches both new modules. Registration also handles a
  window `load` event that fired during asynchronous texture/shader loading.

## Reproduce the checks

Use the repository's [headless browser setup](../../../.agents/skills/arena-game-forge/references/headless-browser-setup.md).
With a static server serving the repository on port 8899:

```sh
cp games/candy-kingdom-coaster/tests/tools/serpentineqa.mjs /home/user/tools/
node /home/user/tools/serpentineqa.mjs --screenshots --offline
```

An alternative base URL can be passed as an argument. `QA_OUT` controls the
output folder (default `test-results/serpentines`, ignored by Git).

Verified on 2026-10-14 in headless Chromium/SwiftShader: **13/13 checks**.

- Opposite winding, monotonic ascent/descent, level bridge.
- Zero gaps and matching tangents at all six joins; metre mapping error below
  0.001 m; minimum bend radius ~28.5 m; maximum grade ~12.8°.
- Road/curb coverage and cake/scenery clearance across the full steering range;
  no low-clearance intersections between non-neighbouring track segments.
- 153 chase-camera samples with visible near road and unobstructed car.
- Normal and boosted traversals, left/right soft-wall behaviour, no unintended
  jumps or drops. Complete no-input ride finishes in ~107 seconds and resets.
- Real held touch input and release on the bridge; portrait layouts at 360×800
  and 412×915 retain the rotate hint without horizontal overflow.
- Original river → ramp A → cakes → tunnel → ramp B ordering/spacing.
- New scenery: 28 static draws, 87,040 triangles across the entire landmark.
- Both modules precached; a real offline reload builds both cakes and loads all
  26 existing textures; no browser errors.

Evidence: `evidence/cake-{pair,ascent,bridge,descent}.webp` and
`evidence/cake-serpentines-qa.json`. Physical Android performance has not been
measured; SwiftShader is used for correctness and screenshots, not device FPS.
