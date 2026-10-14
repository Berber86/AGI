# Decision log

Append decisions in this format. Preserve prior decisions; record revisions as new entries.

## 2026-10-14 — Approved cell-evolution MVP

- **Decision:** Build «Первичный бульон: Микрогенез» as a new, original 3D mobile-browser game in `games/primordial-soup/`: one landscape micro-biome, touch virtual joystick, food web, two growth/editor checkpoints, two active organ slots, four organs with real mechanical effects, and explicit win/lose/restart paths. Use TypeScript + Babylon.js + Vite as a static PWA with local resources.
- **Alternatives:** Survival-only arena; freeform organ placement; multiple biomes/campaign; Phaser 2D; reuse/copy Spore assets.
- **Reason:** User chose an editor-led loop, evolution as the main superiority axis, slot-based organs, a food web, landscape/two-thumb controls, and a scientific microscope visual direction. The user explicitly approved the synthesized MVP.
- **Affected artifacts:** `game.json`, `backlog.json`, `acceptance.md`, future `games/primordial-soup/` source.
- **Evidence or user answer:** Discovery answers `editor_loop`, `evolution`, `landscape`, `virtual_stick`, `long_expedition`, `organ_slots`, `food_web`, `microscope`; final answer `approve_mvp`.

## 2026-10-14 — Original art and honest comparison boundary

- **Decision:** Use the provided Spore frame as a mood/composition reference only; create original cells, UI, and assets. Compare same-seed landscape screenshots and test evolution effects. Do not claim gameplay superiority over the original without an original executable; only a still image was supplied.
- **Alternatives:** Copy Spore/EA characters or logos; claim global superiority based on a single screenshot.
- **Reason:** The MVP needs its own visual identity, and a still image cannot provide gameplay measurements.
- **Affected artifacts:** `game.json`, `acceptance.md`, visual QA evidence.
- **Evidence or user answer:** User selected the microscope visual direction and explicitly approved the comparison limitation in the contract.

## 2026-10-14 — Iteration and push cadence

- **Decision:** Number each distinct change batch starting after contract approval. Stop at the first iteration that satisfies the approved comparison rubric; otherwise iteration 9 is final. Push at iterations 3, 6, and 9, and after iteration 9 write a handoff and wait for the user. Use only `arena/0934f2ca-agi`.
- **Alternatives:** Count a validation run as an iteration; count only large milestones; continue indefinitely after iteration 9.
- **Reason:** User selected `change_batch`, requested a push every third iteration, and set iteration 9 as the hard stop. The early-stop rule preserves the user's “iterate until surpassed” goal.
- **Affected artifacts:** `game.json`, `backlog.json`, `state.json`, future commit/push sequence.
- **Evidence or user answer:** Discovery stage 1 and final `approve_mvp`.

## 2026-10-14 — User-authorized repository exception

- **Decision:** Add the requested game under `games/primordial-soup/` despite the root `AGENTS.md` instruction not to add generated games to this skill repository. Leave the portable skill and existing Candy Kingdom Coaster untouched.
- **Alternatives:** Stop because of the root instruction; move or rewrite the skill repository; replace the existing game.
- **Reason:** The user explicitly approved this bounded exception in the final contract choice.
- **Affected artifacts:** New game directory, root gallery card only after the new game is ready for inclusion; no changes to the skill itself.
- **Evidence or user answer:** Final discovery choice `approve_mvp` explicitly included the repository exception.
