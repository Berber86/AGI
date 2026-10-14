# Microgenesis game instructions

This is the user-approved new-game exception in the Arena Game Forge repository. Keep all game implementation under `games/primordial-soup/`; do not alter the portable skill or Candy Kingdom Coaster.

At the beginning of a genuinely new Arena session:

1. Read `../../.agents/skills/arena-game-forge/SKILL.md` and its session-benchmark reference; run one fresh benchmark and obey its executable verdict.
2. After qualification, read `../../.studio/BOOTSTRAP.md`, `state.json`, `discovery.json`, `game.json`, `backlog.json`, and the newest handoff; run the validator from the repository root.
3. Follow the approved contract and take only the next unblocked task. Do not silently expand scope.

Project requirements:

- TypeScript + Babylon.js + Vite, static PWA, relative deployment paths, no runtime CDN.
- Landscape mobile gameplay must work by touch; keyboard is optional for QA only.
- Record the numbered iteration in `.studio/state.json` and backlog. One distinct batch of changes is one iteration.
- Work only on `arena/0934f2ca-agi`. Push after iterations 3, 6, and 9; stop when the approved comparison rubric passes or after the final ninth iteration, whichever happens first. After iteration 9, hand off and wait.
- Run `npm test`, `npm run check`, `npm run build`, and applicable browser/mobile checks before marking work done. Never claim physical Android testing unless it happened.
