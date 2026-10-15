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
  round picture emblem (bear / star / cookie / cloud) above the road. No
  painted arrows, no HUD panel — the choice is read from the world.
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

## Final visual evidence

All images below were captured from the actual final v22 game, after the sign
and gummy-bear polish; no mockup or generated game screenshot:

- `evidence/fork-choice-1.webp` / `fork-choice-2.webp` — decision approaches.
- `evidence/fork-gummy-hills.webp` — visible bears on their raised plinths.
- `evidence/fork-star-tunnel.webp` — the optional lit tunnel.
- `evidence/fork-cookie-jump.webp` — the wide, route-specific jump ramp.
- `evidence/fork-cloud-bridge.webp` — the elevated alternative.

Browser checks use Chromium/SwiftShader with mobile touch emulation, not a
physical Android phone or a device-FPS benchmark. The older broad acceptance suite was not rerun; the focused UI and
serpentine suites above were run on the final fork build.

```sh
cp games/candy-kingdom-coaster/tests/tools/forkqa.mjs /home/user/tools/
node /home/user/tools/forkqa.mjs http://127.0.0.1:8900/index.html --screenshots --offline

# Close UI/offline + capture final fork views in the same already-booted page:
cp games/candy-kingdom-coaster/tests/tools/uiqa.mjs /home/user/tools/
node /home/user/tools/uiqa.mjs http://127.0.0.1:8900/index.html --offline --fork-views

cp games/candy-kingdom-coaster/tests/tools/serpentineqa.mjs /home/user/tools/
node /home/user/tools/serpentineqa.mjs http://127.0.0.1:8900/index.html
```

Install the shared browser runtime with the repository's headless-browser setup.
Large/transient outputs stay in ignored `test-results/`, not Git.
