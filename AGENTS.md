# Arena Game Forge repository instructions

This repository contains the portable `arena-game-forge` Agent Skill. It is not a generated game project.

Before changing the skill:

1. Read `.agents/skills/arena-game-forge/SKILL.md`.
2. Keep the core skill concise; put detailed procedures in `references/`.
3. Keep scripts dependency-free Python 3 where practical.
4. Never weaken the executable startup benchmark, its one-shot verdict policy, the mandatory 2–4 stage user brainstorm, or the implementation gate.
5. Run `python3 -m unittest discover -s tests -v` after changes.
6. Run `python3 .agents/skills/arena-game-forge/scripts/validate_project.py --self-test` after changes.
7. Run `python3 .agents/skills/arena-game-forge/scripts/session_benchmark.py self-test` after benchmark changes.

Do not add generated games, build output, `node_modules`, or large media evidence to this skill repository.
