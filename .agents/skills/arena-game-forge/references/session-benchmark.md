# Session competency benchmark

## Why it exists

Arena may assign a different model to each session. A model's own confidence is not evidence of competence, and asking “are you capable?” creates a predictable self-praise failure mode.

The startup benchmark therefore uses an executable scorer. The model does not choose its rating.

## What it measures

The benchmark is deliberately short but coupled:

1. **Code reasoning — 70 points.** Repair a deterministic game-state reducer with interacting lifecycle, idempotence, boundary, win/lose, immutability, and restart requirements.
2. **Product planning — 20 points.** Produce a bounded mobile vertical-slice plan with touch, performance, scope, dependencies, acceptance criteria, and evidence.
3. **Process integrity — 10 points.** Stay inside benchmark scratch space, run the public check, and report only claims supported by evidence.

Parameters, theme, orientation, budgets, and target FPS vary by run. A public check catches syntax/schema failures but does not reveal final behavioral cases. Final evaluation is one-shot.

## Startup protocol

After reading only the root `AGENTS.md` and this skill, and before reading or changing the game project:

1. Check whether a previous benchmark record exists:

   ```bash
   python3 .agents/skills/arena-game-forge/scripts/session_benchmark.py status --project-root .
   ```

   A missing-record error is normal on the first session.

2. Start exactly one fresh run. On the first ever run:

   ```bash
   python3 .agents/skills/arena-game-forge/scripts/session_benchmark.py start --project-root .
   ```

   When a previous run exists, a genuinely new Arena session uses:

   ```bash
   python3 .agents/skills/arena-game-forge/scripts/session_benchmark.py start --project-root . --new-session
   ```

   Never use `--new-session` as a retry in the same session.

3. Read the generated `CHALLENGE.md` and edit only its `candidate/` directory.
4. Run the public check as needed.
5. Update the candidate submission honestly.
6. Run final `evaluate` exactly once.
7. Repeat the evaluator's score, subscores, critical failures, and policy without upgrading the wording.

## Verdict policy

The evaluator owns these thresholds:

- **QUALIFIED:** total ≥ 85, code ≥ 60/70, planning ≥ 15/20, and no critical failure. Full workflow allowed.
- **LIMITED:** total ≥ 70 and code ≥ 50/70 with no critical failure. Discovery, planning, or review only; implementation requires explicit user override, and a fresh session should be recommended.
- **REJECT:** every other result or any integrity failure. Stop before project work and ask the user to launch another session.

The model may explain a failed check but cannot change the verdict. Only the user may override LIMITED or REJECT, and that decision must be recorded in `.studio/decisions.md` with the score and risk.

## Anti-self-praise rules

- Never provide an estimated score before evaluation.
- Never substitute prose review for the evaluator.
- Never claim hidden tests passed before evaluation.
- Never rerun to improve a score in the same session.
- Never modify benchmark scripts, session metadata, result files, or project files during the run.
- Never describe LIMITED as “basically qualified.”
- Never continue after REJECT unless the user explicitly overrides after seeing the report.

## Integrity model

The benchmark records a workspace fingerprint before the candidate is edited and compares it during evaluation. Candidate scratch files are excluded; project and harness edits trigger a critical failure. Results are appended to `.studio/benchmarks/history.jsonl`.

This is designed to detect weak reasoning, careless instruction-following, and unjustified self-confidence. It is not cryptographically tamper-proof against a deliberately adversarial agent with unrestricted filesystem access. Truly tamper-proof evaluation would require a protected remote evaluator or CI secret that the agent cannot read or edit. In Arena's single-agent repository environment, randomized tasks, one-shot scoring, workspace fingerprints, append-only history, and user-visible diffs provide a practical honest boundary.

## Time budget

A competent model should finish in roughly one focused pass. Do not turn the benchmark into a long project:

- read one challenge;
- repair one small reducer;
- complete two small JSON files;
- run a smoke check;
- run one final evaluation.

If the session spends excessive time, repeatedly edits unrelated files, or attempts to negotiate the rules, treat that behavior itself as a reason to start a new session even if no final score exists.
