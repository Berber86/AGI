# Arena Game Forge repository instructions

This repository contains the portable `arena-game-forge` Agent Skill. It is not a game engine repository,
but it does host one finished game built with the skill (see `games/` below).

Before changing the skill:

1. Read `.agents/skills/arena-game-forge/SKILL.md`.
2. Keep the core skill concise; put detailed procedures in `references/`.
3. Keep scripts dependency-free Python 3 where practical.
4. Never weaken the executable startup benchmark, its one-shot verdict policy, the mandatory 2–4 stage user brainstorm, or the implementation gate.
5. Run `python3 -m unittest discover -s tests -v` after changes.
6. Run `python3 .agents/skills/arena-game-forge/scripts/validate_project.py --self-test` after changes.
7. Run `python3 .agents/skills/arena-game-forge/scripts/session_benchmark.py self-test` after benchmark changes.

## Skill files

Do not add generated games, build output, `node_modules`, or large media evidence to the skill directories
(`.agents/`, `tests/`, root documents).

## `games/`

`games/` is the published home of complete games that were produced with this skill and that the repository
owner asked to keep here. `games/quiet-race/` was added on 2026-10-11 by the owner's explicit decision.

Rules for anything under `games/`:

1. Every game is a self-contained project with its own `package.json`, its own `.gitignore` and its own
   `.studio/` state (contract, backlog, decisions, lessons, evidence).
2. Never commit `node_modules/`, `dist/`, `dist-offline/` or `dist-headless/` build output.
3. Keep evidence lightweight: screenshots and JSON reports yes, videos and traces no.
4. The skill stays generic — never special-case the skill to one game, and never let a game change the
   benchmark, the discovery protocol or the quality gates.
5. `games/quiet-race` is deployed to GitHub Pages from the `gh-pages` branch by
   `games/quiet-race/scripts/deploy-pages.mjs`; do not put other Pages content at that branch root.
