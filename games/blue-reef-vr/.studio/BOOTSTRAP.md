# Arena Game Forge bootstrap

This directory is the durable source of truth for the game project.

## Session start

1. Before reading project state or source, complete exactly one fresh Arena Game Forge session benchmark.
2. Continue normally only on its executable `QUALIFIED` verdict. `LIMITED` requires user choice; `REJECT` stops project work.
3. Never retry a poor benchmark score in the same session or replace it with a subjective self-rating.
4. After qualification, read `request.md`, `discovery.json`, `game.json`, `state.json`, and `backlog.json`.
5. Read the newest file in `handoffs/`, if any.
6. Run the Arena Game Forge project validator.
7. Obey the discovery gate: no game implementation before explicit contract approval.
8. Work as only the active role and keep scope bounded.

## Session end

1. Run applicable checks.
2. Store lightweight evidence under `evidence/`.
3. Update JSON state atomically and keep it valid.
4. Append decisions and lessons rather than erasing history.
5. Write a timestamped handoff with exact commands, results, blockers, and next task.

If chat history conflicts with approved repository state, stop and ask the user which source should win. Never silently rewrite the approved contract.
