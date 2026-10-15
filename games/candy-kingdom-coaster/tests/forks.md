# Two playable forks

## Routes and controls

- First fork (base stations 115–335): gummy hills with animated bears, or a
  crystal candy grotto (a real closed, dark geode tunnel).
- Second fork (base stations 1110–1360): a cookie canyon with drop-off rocks,
  or an 8.5 m-high cloud skyway with rainbow arches.
- Steer toward a side with the existing touch pads/arrow keys. The selection
  latches silently at the common landing; neutral input safely takes the left
  route. Both alternatives rejoin the same course. No advance direction panel,
  confirmation announcement, named signboards or painted fork arrows.
- The finish panel records the two chosen destinations. Restart resets both.

## Architecture

`routes.js` owns four independent arc-length curves. The existing `s` coordinate
remains a stable **reference station** within forks so later landmarks never
move. Use `track.advance(s, metres)` and `track.routes.distance(a, b)` for physical
travel, cameras, ramp lengths and pickup distances; do not add metres directly
inside a fork. Both the road renderer and gameplay query these same curves.

`track.js` renders both branches with shared, clipped junction seams and wider
paved shoulders. `forks.js` builds the destinations without directional spoilers.
Random scenery is excluded from all alternatives and their decision approaches;
coaster clearance uses every route, not just the default branch.

Pickups carry a branch identity. Unchosen pickups never score, and medal totals
count only the 151 reachable sweets, not all 176 rendered sweets. Ramps inside
the second fork belong to the cookie path; no invisible jumps on the cloud path.
The existing river, cakes, sagging bridge and chocolate tunnel remain common.

## Fork destinations rebuilt — v24

The four destinations were rebuilt after the first playable version: the thin
arch "tunnel" with floating lighter-than-air crystals was replaced by a real
crystal candy grotto, and both second-fork branches gained scale and character.

- **Gates.** Every branch now opens with a colossal candy arch right after the
  split: candy-cane columns 2.2 m thick standing 12.2 m out, a 12 m arch and a
  self-lit badge with a big picture emblem (bear / star / cookie / cloud) above
  the road. The badge is lit by an unlit candy ring, so it stays readable in
  any sun direction; the emblem sits on the face the driver actually sees (the
  first version had it on the far side of the plate — found in a screenshot and
  fixed). No painted arrows, no HUD panel — the choice is read from the world.
- **Beacons.** A gummy-bear stack, a cookie tower and a 25 m cloud tower rise
  beside the shared approach, so each branch is announced while the road is
  still single.
- **Gummy hills** — gumdrop mounds, striped bear plinths, cane arches.
- **Crystal candy grotto** (was "star tunnel") — a closed geode: an inner
  crystal shell 12 m wide with flared mouths, a crystal skirt growing out of
  the meadow, crystal crust breaking through the outside, glowing ribs, vault
  gems and wall lanterns that throw soft pools of light on the road, plus a
  bright star above each mouth. Daylight fades to 0.8 inside, exactly like the
  chocolate tunnel, so the branch has a real identity.
- **Cookie canyon** — a canyon of dark cookie rocks and chocolate chips beside
  a 1.4 m jump ramp on a cookie road.
- **Cloud skyway** — a fluffy cloud bank hugging the deck, under-deck cloud
  shores (only where the deck actually rises), five fat rainbow arches, floating
  candy islands on the horizon and a cloud tower at the gate.
- **Keep-out rule.** Nothing may sit closer than 8.3 m + its own radius to
  either branch of the same fork; near the split and the merge the two roads
  are only a few metres apart. The QA suite verifies the whole car envelope
  (rays every metre, |lateral| ≤ 8 m, 3.4 m up) and the chase camera on all
  four routes: 0 intrusions, 0 blocked frames.
- Cost: **20 draw calls / 74k triangles** for all four destinations (the cake
  landmark set uses 30 / 89k). Everything is merged by material; clouds,
  crystals, chips and gems are instanced.

## Exploration mode — v23

Directional guidance was removed from both the HUD and the decision approaches.
The route-update/steering logic is unchanged; selection no longer produces a
click or haptic confirmation. The finish screen retains the recap of paths
already explored. Steering buttons, collectibles and their feedback remain.

**10/10 focused checks passed**: no overlay/live announcement/direction textures,
real left/right touch selection at both forks, absence of hints through 20 route
positions, finish recap, v23 cache and an actual offline reload. No browser errors.
Evidence: `evidence/exploration-qa.json`, `evidence/fork-without-hints.webp`.
Root tests: 11/11; validator self-test, syntax and diff checks passed. Earlier
v22 reports/images below are historical; the full suites were not repeated for
this presentation-only removal.

```sh
cp games/candy-kingdom-coaster/tests/tools/explorationqa.mjs /home/user/tools/
node /home/user/tools/explorationqa.mjs http://127.0.0.1:8900/index.html
```

## Previous v22 verification — closure on 2026-10-15

The existing implementation was resumed, not rebuilt. No gameplay/source
changes were needed in this closure; only the remaining regression checks,
final screenshots and documentation were completed.

- Final v22 fork gameplay: **20/20 passed**, `evidence/forks-qa.json` (saved
  from the previous run; not needlessly repeated).
- Final v22 UI/controls/offline: **25/25 passed**, `evidence/forks-ui-qa.json`.
  Includes actual offline reload with **2 forks / 4 routes**, all local art/fonts,
  pause/resume, fullscreen, finish/restart and the active chooser at 851×326
  and 640×280 without covering controls.
- Cakes/sagging-bridge regression: **12/12 passed** after the fork changes,
  `evidence/forks-serpentines-qa.json`. Road/curb coverage, 153 camera poses,
  normal/boosted traversal, touch, full ride/restart and landmark order pass;
  the existing cakes still use 30 draws / 89,052 triangles.
- All four combinations reach the finish (~107.6–109.0 s in the scripted ride).
  Actual touch selection/release, latching, pause/resume and reset pass.
- Full-width contact and obstacle rays pass on both alternatives. No teleport
  at selection; 204 fork-camera samples retain the car and near road.
- Root unit tests: **11/11**; validator self-test and syntax/diff checks pass.

The earlier v21 offline run remains in `evidence/forks-offline-qa.json` as
historical evidence. Its final-v22 offline gap is now closed by the UI run above.

## Final visual evidence — v24

Captured from the actual v24 build (no mockups), with `tests/tools/forkview.mjs`
(a new tool that parks the car and camera at exact fork stations and branch
options, with the HUD off unless `HUD=1`):

- `evidence/fork-v24-before-after.webp` — one panel: the old arch "star tunnel"
  and the old raised cloud bridge next to the new grotto and skyway.
- `evidence/fork-approach.webp` — the shared approach: both gates with their
  bear and star emblems, plus the bear beacon of the left branch.
- `evidence/fork-2-approach.webp` — the same for the second fork: cookie rocks
  on the left, cloud bank and rainbow arches on the right.
- `evidence/fork-split.webp` — the split with both gates at 12 m.
- `evidence/fork-gate-hills.webp` / `fork-gate-grotto.webp` — the two emblems
  (bear / star) on their colossal arches.
- `evidence/fork-gummy-hills.webp` — gumdrop mounds, striped plinths, bears.
- `evidence/fork-grotto-inside.webp` / `fork-grotto-exit.webp` — the dark geode
  from inside: crystal walls, glowing ribs, wall lanterns, light pools, and the
  star marking the exit.
- `evidence/fork-cookie-canyon.webp` — dark cookie rocks with chocolate chips.
- `evidence/fork-cloud-skyway.webp` — cloud curb, rainbow arches and the deck
  riding on its cloud bank.

Historical v22 images (`fork-choice-*.webp`, `fork-star-tunnel.webp`,
`fork-cookie-jump.webp`, `fork-cloud-bridge.webp`) are kept for comparison.

## Verified numbers — v24

- Fork gameplay suite (`forkqa.mjs`): **20/20**.
  - 0 scenery intrusions across the full car envelope (rays every 1 m,
    |lateral| ≤ 8 m, 3.4 m up, both branch options).
  - 0 blocked chase-camera frames out of 204 fork poses on all four routes.
  - 20 draw calls / 73.8k triangles for all four destinations.
  - All four route combinations finish (107.6–109.0 s) with their own rewards.
- Serpentines/cakes regression (`serpentineqa.mjs`): **12/12** after v24.
- UI/controls/offline (`uiqa.mjs --offline`): **25/25**, including a real
  offline reload from the `ckc-v24` cache.
- Root unit tests: **11/11**; validator self-test passes.

### One-tap review of what a child sees at each fork

| station | left branch | right branch |
|---|---|---|
| 1 (s 115–335) | bear emblem gate → gumdrop hills, bouncing bears, cane arches | star emblem gate → dark crystal candy grotto with lit walls |
| 2 (s 1503–1753) | cookie emblem gate → cookie canyon, chocolate chips, 1.4 m jump ramp | cloud emblem gate → cloud skyway, 5 rainbow arches, floating islands |

### Known limitations

- The suite runs Chromium/SwiftShader with touch emulation, not a physical
  Android device; frame-rate measurements on real hardware are still pending.
- The grotto interior is deliberately dark (0.8 of the tunnel darkness): on a
  very dim phone screen the wall crystals are the brightest object inside.
- Evidence images are 915×412 PNG→WebP captures; the game's own PWA/offline
  behaviour is covered by the UI suite above.
