#!/usr/bin/env python3
"""Validate Arena Game Forge durable project state."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Any

REQUIRED_FILES = (
    "BOOTSTRAP.md",
    "request.md",
    "discovery.json",
    "game.json",
    "state.json",
    "backlog.json",
    "acceptance.md",
    "decisions.md",
    "lessons.md",
)

PHASES = {
    "discovery",
    "planning",
    "vertical_slice",
    "production",
    "qa",
    "release",
    "done",
}
TASK_STATUSES = {"blocked", "ready", "in_progress", "review", "done"}
DISCOVERY_STATUSES = {"collecting", "changes_requested", "approved"}

APPROVED_GAME_FIELDS = (
    "title",
    "elevatorPitch",
    "playerFantasy",
    "genre",
    "audience",
    "coreLoop",
    "orientation",
    "sessionLength",
    "controls",
    "visualDirection",
    "winCondition",
    "loseCondition",
    "mustHave",
    "outOfScope",
    "acceptanceCriteria",
    "platform",
    "technical",
    "approvedAt",
)


def load_json(path: Path, errors: list[str]) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        errors.append(f"missing file: {path}")
        return {}
    except json.JSONDecodeError as exc:
        errors.append(f"invalid JSON in {path}: {exc}")
        return {}
    if not isinstance(data, dict):
        errors.append(f"expected JSON object in {path}")
        return {}
    return data


def nonempty(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return bool(value)
    return True


def validate(project_root: Path) -> list[str]:
    errors: list[str] = []
    studio = project_root / ".studio"
    if not studio.is_dir():
        return [f"missing studio directory: {studio}"]

    for relative in REQUIRED_FILES:
        if not (studio / relative).is_file():
            errors.append(f"missing required .studio file: {relative}")

    discovery = load_json(studio / "discovery.json", errors)
    game = load_json(studio / "game.json", errors)
    state = load_json(studio / "state.json", errors)
    backlog = load_json(studio / "backlog.json", errors)

    planned = discovery.get("plannedStages")
    if not isinstance(planned, int) or isinstance(planned, bool) or not 2 <= planned <= 4:
        errors.append("discovery.plannedStages must be an integer from 2 through 4")

    discovery_status = discovery.get("status")
    if discovery_status not in DISCOVERY_STATUSES:
        errors.append(f"invalid discovery.status: {discovery_status!r}")

    completed = discovery.get("completedStages")
    if not isinstance(completed, list):
        errors.append("discovery.completedStages must be an array")
        completed = []
    if isinstance(planned, int) and len(completed) > planned:
        errors.append("completed discovery stages exceed plannedStages")

    stage_numbers: list[int] = []
    for index, stage in enumerate(completed):
        if not isinstance(stage, dict):
            errors.append(f"completedStages[{index}] must be an object")
            continue
        number = stage.get("stage")
        if not isinstance(number, int) or isinstance(number, bool):
            errors.append(f"completedStages[{index}].stage must be an integer")
        else:
            stage_numbers.append(number)
        if not nonempty(stage.get("name")):
            errors.append(f"completedStages[{index}].name is required")
        options_used = stage.get("optionsUsed")
        if options_used is not True:
            errors.append(f"completedStages[{index}].optionsUsed must be true")

    if stage_numbers and stage_numbers != list(range(1, len(stage_numbers) + 1)):
        errors.append("completed discovery stage numbers must be sequential starting at 1")

    phase = state.get("phase")
    if phase not in PHASES:
        errors.append(f"invalid state.phase: {phase!r}")

    benchmark = state.get("sessionBenchmark")
    if benchmark is not None and not isinstance(benchmark, dict):
        errors.append("state.sessionBenchmark must be null or an object")
    elif isinstance(benchmark, dict):
        benchmark_status = benchmark.get("status")
        if benchmark_status not in {"active", "qualified", "limited", "reject"}:
            errors.append(f"invalid session benchmark status: {benchmark_status!r}")
        override = benchmark.get("userOverride") is True
        decision_path = benchmark.get("overrideDecisionPath")
        valid_override = False
        if override and isinstance(decision_path, str):
            candidate = project_root / decision_path
            try:
                candidate.resolve().relative_to(project_root.resolve())
            except ValueError:
                pass
            else:
                valid_override = candidate.is_file()
        if benchmark_status == "active":
            errors.append("session benchmark is still active; final evaluation is required")
        elif benchmark_status in {"limited", "reject"} and not valid_override:
            errors.append(
                f"session benchmark verdict {benchmark_status} blocks project work without a recorded user override"
            )
    elif phase in PHASES - {"discovery"}:
        errors.append("implementation phases require a qualified session benchmark")

    game_status = game.get("status")
    if game_status not in {"draft", "approved"}:
        errors.append(f"invalid game.status: {game_status!r}")

    if phase in PHASES - {"discovery"}:
        if discovery_status != "approved" or game_status != "approved":
            errors.append("implementation phases require approved discovery and game contract")

    if discovery_status == "approved":
        if len(completed) < 2:
            errors.append("approved discovery requires at least two completed stages")
        if isinstance(planned, int) and len(completed) != planned:
            errors.append("approved discovery must complete exactly plannedStages")
        if completed and completed[-1].get("name") != "contract-lock":
            errors.append("the final approved discovery stage must be named contract-lock")
        if game_status != "approved":
            errors.append("approved discovery requires game.status = approved")

    if game_status == "approved":
        for field in APPROVED_GAME_FIELDS:
            if not nonempty(game.get(field)):
                errors.append(f"approved game contract requires non-empty {field}")
        platform = game.get("platform")
        if isinstance(platform, dict):
            if platform.get("primary") != "mobile-browser":
                errors.append("approved default platform.primary must be mobile-browser")
            if platform.get("device") != "Android":
                errors.append("approved default platform.device must be Android")
        else:
            errors.append("approved game platform must be an object")

    tasks = backlog.get("tasks")
    if not isinstance(tasks, list):
        errors.append("backlog.tasks must be an array")
        tasks = []

    task_ids: set[str] = set()
    for index, task in enumerate(tasks):
        if not isinstance(task, dict):
            errors.append(f"backlog.tasks[{index}] must be an object")
            continue
        task_id = task.get("id")
        if not isinstance(task_id, str) or not task_id.strip():
            errors.append(f"backlog.tasks[{index}].id is required")
        elif task_id in task_ids:
            errors.append(f"duplicate backlog task id: {task_id}")
        else:
            task_ids.add(task_id)
        if task.get("status") not in TASK_STATUSES:
            errors.append(f"invalid task status for {task_id or index}")
        if not isinstance(task.get("dependencies", []), list):
            errors.append(f"dependencies must be an array for {task_id or index}")
        if task.get("status") == "done":
            if not nonempty(task.get("acceptanceCriteria")):
                errors.append(f"done task {task_id or index} has no acceptance criteria")
            if not nonempty(task.get("evidence")):
                errors.append(f"done task {task_id or index} has no evidence")

    for task in tasks:
        if not isinstance(task, dict):
            continue
        for dependency in task.get("dependencies", []):
            if dependency not in task_ids:
                errors.append(
                    f"task {task.get('id', '<unknown>')} references missing dependency {dependency}"
                )

    latest_handoff = state.get("latestHandoff")
    if latest_handoff:
        handoff_path = project_root / latest_handoff
        try:
            handoff_path.resolve().relative_to(project_root.resolve())
        except ValueError:
            errors.append("state.latestHandoff must stay inside the project root")
        else:
            if not handoff_path.is_file():
                errors.append(f"state.latestHandoff does not exist: {latest_handoff}")

    return errors


def run_self_test() -> int:
    skill_root = Path(__file__).resolve().parents[1]
    template = skill_root / "templates" / "studio"
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        shutil.copytree(template, root / ".studio")
        (root / ".studio" / "request.md").write_text("# Request\n\nTest game\n", encoding="utf-8")

        baseline = validate(root)
        if baseline:
            print("self-test baseline unexpectedly failed:", file=sys.stderr)
            for error in baseline:
                print(f"- {error}", file=sys.stderr)
            return 1

        state_path = root / ".studio" / "state.json"
        state = json.loads(state_path.read_text(encoding="utf-8"))
        state["phase"] = "planning"
        state_path.write_text(json.dumps(state), encoding="utf-8")
        invalid = validate(root)
        if not any("require approved discovery" in error for error in invalid):
            print("self-test failed to reject planning before discovery approval", file=sys.stderr)
            return 1

    print("self-test passed")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Validate Arena Game Forge project state")
    parser.add_argument("--project-root", default=".", help="Game repository root")
    parser.add_argument("--self-test", action="store_true", help="Validate the validator itself")
    return parser


def main() -> int:
    args = build_parser().parse_args()
    if args.self_test:
        return run_self_test()

    root = Path(args.project_root).expanduser().resolve()
    errors = validate(root)
    if errors:
        print(f"Arena Game Forge validation failed ({len(errors)} issue(s)):", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print(f"Arena Game Forge state is valid: {root / '.studio'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
