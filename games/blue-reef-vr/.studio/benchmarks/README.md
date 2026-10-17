# Session benchmark records

- `runs/` contains temporary generated challenges and is ignored by Git.
- `active.json` points to the current run and is ignored by Git.
- `latest-result.json` contains the latest executable verdict.
- `history.jsonl` is the append-only audit history.

Do not edit scores or result files manually. Only the benchmark evaluator writes verdicts. A user override belongs in `../decisions.md`, not in benchmark history.
