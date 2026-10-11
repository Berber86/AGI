# Game project instructions

This project uses the `arena-game-forge` sequential studio workflow.

At the start of every session:

1. Load `.agents/skills/arena-game-forge/SKILL.md` and its session-benchmark reference before reading game source or project state.
2. Run exactly one fresh session benchmark. Obey its executable verdict: continue normally only on `QUALIFIED`; `LIMITED` requires user choice and `REJECT` stops project work.
3. Do not rerun a failed benchmark in the same session and do not replace its score with a subjective self-assessment.
4. After qualification, read `.studio/BOOTSTRAP.md`, `.studio/state.json`, `.studio/discovery.json`, `.studio/game.json`, `.studio/backlog.json`, and the newest handoff.
5. Run the skill's project validator.
6. If discovery is not approved, continue the mandatory 2–4 stage option-based brainstorm. Do not implement the game.
7. If discovery is approved, execute only the next unblocked task for the active phase.

At the end of every session, run applicable gates, update durable state, and write a handoff with evidence and the exact next action.

The product is browser-first and touch-first. Never require keyboard input for gameplay. Never claim Android device testing unless it actually occurred.
