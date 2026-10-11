#!/usr/bin/env python3
"""Initialize durable Arena Game Forge state in a game repository."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def read_request(args: argparse.Namespace) -> str:
    if args.request is not None:
        value = args.request
    elif args.request_file is not None:
        value = Path(args.request_file).read_text(encoding="utf-8")
    else:  # argparse enforces the group; this protects programmatic use.
        raise ValueError("An initial request is required")

    value = value.strip()
    if not value:
        raise ValueError("The initial request must not be empty")
    return value


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def initialize(args: argparse.Namespace) -> list[Path]:
    project_root = Path(args.project_root).expanduser().resolve()
    project_root.mkdir(parents=True, exist_ok=True)

    skill_root = Path(__file__).resolve().parents[1]
    template_root = skill_root / "templates"
    studio_template = template_root / "studio"
    studio_target = project_root / ".studio"

    if not studio_template.is_dir():
        raise FileNotFoundError(f"Missing studio templates: {studio_template}")

    existing_entries = set()
    if studio_target.exists():
        existing_entries = {path.name for path in studio_target.iterdir()}
    only_benchmark_exists = bool(existing_entries) and existing_entries <= {"benchmarks"}
    if studio_target.exists() and not args.force and not only_benchmark_exists:
        raise FileExistsError(
            f"{studio_target} already contains durable studio state; refusing to overwrite it. "
            "Use --force only when replacement is intentional."
        )

    request = read_request(args)
    if args.force and studio_target.exists():
        # A session benchmark is an audit record, not disposable project state.
        # Preserve it even when the user intentionally resets the studio files.
        with tempfile.TemporaryDirectory() as temp_dir:
            preserved = Path(temp_dir) / "benchmarks"
            existing_benchmarks = studio_target / "benchmarks"
            if existing_benchmarks.is_dir():
                shutil.copytree(existing_benchmarks, preserved)
            shutil.rmtree(studio_target)
            shutil.copytree(studio_template, studio_target)
            if preserved.is_dir():
                shutil.copytree(preserved, studio_target / "benchmarks", dirs_exist_ok=True)
    elif studio_target.exists():
        # The benchmark runs before project initialization, so merge templates
        # beside the already-created benchmark audit directory.
        shutil.copytree(studio_template, studio_target, dirs_exist_ok=True)
    else:
        shutil.copytree(studio_template, studio_target)

    created_at = utc_now()
    discovery_path = studio_target / "discovery.json"
    discovery = json.loads(discovery_path.read_text(encoding="utf-8"))
    discovery["plannedStages"] = args.planned_stages
    discovery["createdAt"] = created_at
    discovery["updatedAt"] = created_at
    write_json(discovery_path, discovery)

    game_path = studio_target / "game.json"
    game = json.loads(game_path.read_text(encoding="utf-8"))
    game["title"] = args.name or project_root.name
    game["updatedAt"] = created_at
    write_json(game_path, game)

    state_path = studio_target / "state.json"
    state = json.loads(state_path.read_text(encoding="utf-8"))
    state["createdAt"] = created_at
    state["updatedAt"] = created_at
    latest_benchmark = studio_target / "benchmarks" / "latest-result.json"
    if latest_benchmark.is_file():
        result = json.loads(latest_benchmark.read_text(encoding="utf-8"))
        state["sessionBenchmark"] = {
            "runId": result.get("runId"),
            "status": result.get("verdict"),
            "score": result.get("score"),
            "evaluatedAt": result.get("evaluatedAt"),
            "resultPath": ".studio/benchmarks/latest-result.json",
        }
    write_json(state_path, state)

    backlog_path = studio_target / "backlog.json"
    backlog = json.loads(backlog_path.read_text(encoding="utf-8"))
    backlog["updatedAt"] = created_at
    write_json(backlog_path, backlog)

    request_path = studio_target / "request.md"
    request_path.write_text(
        "# Initial user request\n\n"
        f"Captured verbatim at `{created_at}`. Treat this as the raw brief; "
        "discovery decisions live in `discovery.json` and the approved contract in `game.json`.\n\n"
        "---\n\n"
        f"{request}\n",
        encoding="utf-8",
    )

    created = [studio_target]
    agents_target = project_root / "AGENTS.md"
    if not agents_target.exists() or args.force_agents:
        shutil.copyfile(template_root / "project-AGENTS.md", agents_target)
        created.append(agents_target)

    return created


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Initialize .studio state for the Arena Game Forge workflow."
    )
    parser.add_argument("--project-root", default=".", help="Target game repository root")
    parser.add_argument("--name", help="Working game title; defaults to the directory name")
    request_group = parser.add_mutually_exclusive_group(required=True)
    request_group.add_argument("--request", help="Verbatim initial user request")
    request_group.add_argument("--request-file", help="UTF-8 file containing the request")
    parser.add_argument(
        "--planned-stages",
        type=int,
        choices=range(2, 5),
        default=3,
        metavar="{2,3,4}",
        help="Initial discovery stage plan (default: 3; the agent may revise it before stage 1)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Replace an existing .studio directory (destructive; does not overwrite AGENTS.md)",
    )
    parser.add_argument(
        "--force-agents",
        action="store_true",
        help="Also replace the target AGENTS.md with the project template",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        created = initialize(args)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    print("Arena Game Forge state initialized:")
    for path in created:
        print(f"- {path}")
    print("Next action: run brainstorm stage 1; do not scaffold the game yet.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
