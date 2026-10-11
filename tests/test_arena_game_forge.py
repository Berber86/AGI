from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / ".agents" / "skills" / "arena-game-forge"
INIT = SKILL / "scripts" / "init_studio.py"
VALIDATE = SKILL / "scripts" / "validate_project.py"
BENCHMARK = SKILL / "scripts" / "session_benchmark.py"


class SkillContractTests(unittest.TestCase):
    def test_skill_has_valid_frontmatter_and_mandatory_brainstorm(self) -> None:
        text = (SKILL / "SKILL.md").read_text(encoding="utf-8")
        self.assertTrue(text.startswith("---\nname: arena-game-forge\n"))
        self.assertIn("2–4 interactive brainstorm stages", text)
        self.assertIn("ask_user", text)
        self.assertIn("Do not scaffold game code", text)
        self.assertIn("contract-lock", text)

    def test_progressive_references_exist(self) -> None:
        for name in (
            "session-benchmark.md",
            "discovery.md",
            "workflow.md",
            "mobile-web.md",
            "quality-gates.md",
            "state-contracts.md",
        ):
            self.assertTrue((SKILL / "references" / name).is_file(), name)

    def test_studio_json_templates_parse(self) -> None:
        template_root = SKILL / "templates" / "studio"
        for path in template_root.glob("*.json"):
            with self.subTest(path=path.name):
                parsed = json.loads(path.read_text(encoding="utf-8"))
                self.assertIsInstance(parsed, dict)


class StudioScriptTests(unittest.TestCase):
    def run_command(self, *args: object) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, *(str(arg) for arg in args)],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )

    def test_init_preserves_request_and_creates_valid_state(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "game"
            request = "Сделай игру про лису, которая доставляет звёзды."
            result = self.run_command(
                INIT,
                "--project-root",
                project,
                "--name",
                "Star Fox Courier",
                "--request",
                request,
                "--planned-stages",
                4,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn(request, (project / ".studio" / "request.md").read_text(encoding="utf-8"))
            discovery = json.loads(
                (project / ".studio" / "discovery.json").read_text(encoding="utf-8")
            )
            game = json.loads((project / ".studio" / "game.json").read_text(encoding="utf-8"))
            self.assertEqual(discovery["plannedStages"], 4)
            self.assertEqual(game["title"], "Star Fox Courier")
            self.assertTrue((project / "AGENTS.md").is_file())

            validation = self.run_command(VALIDATE, "--project-root", project)
            self.assertEqual(validation.returncode, 0, validation.stderr)

    def test_init_refuses_to_replace_existing_studio(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "game"
            first = self.run_command(INIT, "--project-root", project, "--request", "First")
            second = self.run_command(INIT, "--project-root", project, "--request", "Second")
            self.assertEqual(first.returncode, 0, first.stderr)
            self.assertNotEqual(second.returncode, 0)
            request = (project / ".studio" / "request.md").read_text(encoding="utf-8")
            self.assertIn("First", request)
            self.assertNotIn("Second", request)

    def test_validator_rejects_implementation_before_approval(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "game"
            created = self.run_command(INIT, "--project-root", project, "--request", "Test")
            self.assertEqual(created.returncode, 0, created.stderr)

            state_path = project / ".studio" / "state.json"
            state = json.loads(state_path.read_text(encoding="utf-8"))
            state["phase"] = "vertical_slice"
            state_path.write_text(json.dumps(state), encoding="utf-8")

            validation = self.run_command(VALIDATE, "--project-root", project)
            self.assertNotEqual(validation.returncode, 0)
            self.assertIn("require approved discovery", validation.stderr)

    def test_validator_accepts_approved_contract_and_planning(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "game"
            created = self.run_command(
                INIT,
                "--project-root",
                project,
                "--request",
                "Touch-first delivery game",
                "--planned-stages",
                2,
            )
            self.assertEqual(created.returncode, 0, created.stderr)

            discovery_path = project / ".studio" / "discovery.json"
            discovery = json.loads(discovery_path.read_text(encoding="utf-8"))
            discovery["status"] = "approved"
            discovery["completedStages"] = [
                {
                    "stage": 1,
                    "name": "focused-decisions",
                    "optionsUsed": True,
                    "answers": {"orientation": "portrait"},
                },
                {
                    "stage": 2,
                    "name": "contract-lock",
                    "optionsUsed": True,
                    "answers": {"approval": "approve-mvp"},
                },
            ]
            discovery_path.write_text(json.dumps(discovery), encoding="utf-8")

            game_path = project / ".studio" / "game.json"
            game = json.loads(game_path.read_text(encoding="utf-8"))
            game.update(
                {
                    "status": "approved",
                    "elevatorPitch": "Deliver stars through a hazardous sky route.",
                    "playerFantasy": "A precise sky courier",
                    "genre": "arcade",
                    "audience": "mobile players",
                    "coreLoop": ["steer", "collect", "deliver"],
                    "orientation": "portrait",
                    "sessionLength": "2–3 minutes",
                    "controls": ["one-thumb drag"],
                    "visualDirection": "bold readable silhouettes",
                    "winCondition": "deliver the quota",
                    "loseCondition": "run out of time",
                    "mustHave": ["one complete route"],
                    "outOfScope": ["multiplayer"],
                    "acceptanceCriteria": ["win and lose are reachable by touch"],
                    "approvedAt": "2026-10-11T00:00:00Z",
                }
            )
            game_path.write_text(json.dumps(game), encoding="utf-8")

            state_path = project / ".studio" / "state.json"
            state = json.loads(state_path.read_text(encoding="utf-8"))
            state["phase"] = "planning"
            state["activeRole"] = "technical-director"
            state["sessionBenchmark"] = {
                "runId": "test-qualified-run",
                "status": "qualified",
                "score": 92,
            }
            state_path.write_text(json.dumps(state), encoding="utf-8")

            validation = self.run_command(VALIDATE, "--project-root", project)
            self.assertEqual(validation.returncode, 0, validation.stderr)

    def test_benchmark_qualified_path_is_objective(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "game"
            project.mkdir()
            started = self.run_command(
                BENCHMARK,
                "start",
                "--project-root",
                project,
                "--seed",
                12345,
            )
            self.assertEqual(started.returncode, 0, started.stderr)
            active = json.loads(
                (project / ".studio" / "benchmarks" / "active.json").read_text(
                    encoding="utf-8"
                )
            )
            run_dir = project / active["runPath"]
            session = json.loads((run_dir / "session.json").read_text(encoding="utf-8"))
            config = session["config"]
            candidate = run_dir / "candidate"

            solution = f'''from copy import deepcopy
CONFIG = {config!r}


def create_game(seed=0):
    return {{"seed": seed, "status": "playing", "lane": 0,
            "energy": CONFIG["initialEnergy"], "cargo": 0, "score": 0,
            "collected": [], "timeLeftMs": CONFIG["roundMs"]}}


def apply_action(state, action):
    kind = action.get("type")
    if kind == "restart":
        return create_game(state.get("seed", 0))
    result = deepcopy(state)
    if result["status"] != "playing":
        return result
    if kind == "move":
        result["lane"] = max(0, min(CONFIG["laneCount"] - 1,
                                    result["lane"] + int(action.get("delta", 0))))
    elif kind == "collect":
        item_id = str(action.get("id", ""))
        if item_id and item_id not in result["collected"]:
            result["collected"].append(item_id)
            result["cargo"] += 1
            result["score"] += CONFIG["pickupPoints"]
    elif kind == "hit":
        result["energy"] = max(0, result["energy"] - int(action.get("amount", 1)))
        if result["energy"] == 0:
            result["status"] = "lost"
    elif kind == "tick":
        result["timeLeftMs"] = max(0, result["timeLeftMs"] - int(action.get("ms", 0)))
        if result["timeLeftMs"] == 0:
            result["status"] = "lost"
    elif kind == "deliver" and result["cargo"] >= CONFIG["targetCargo"]:
        result["status"] = "won"
        result["score"] += CONFIG["deliveryBonus"]
    return result
'''
            (candidate / "simulation.py").write_text(solution, encoding="utf-8")
            plan = {
                "technicalProfile": "phaser-typescript",
                "orientation": config["orientation"],
                "touchControls": ["one-thumb pointer drag"],
                "targetFps": config["targetFps"],
                "frameBudgetMs": round(1000 / config["targetFps"], 2),
                "estimatedInitialAssetMb": config["maxInitialAssetMb"],
                "verticalSlice": {
                    "completeRound": True,
                    "touchOnly": True,
                    "winPath": True,
                    "losePath": True,
                    "restart": True,
                },
                "outOfScope": ["multiplayer", "backend-accounts", "monetization"],
                "tasks": [
                    {
                        "id": "CORE-001",
                        "dependencies": [],
                        "acceptanceCriteria": ["One complete touch round"],
                        "evidence": [".studio/evidence/reports/core.json"],
                    },
                    {
                        "id": "QA-001",
                        "dependencies": ["CORE-001"],
                        "acceptanceCriteria": ["Mobile paths verified"],
                        "evidence": [".studio/evidence/reports/qa.json"],
                    },
                    {
                        "id": "RELEASE-001",
                        "dependencies": ["QA-001"],
                        "acceptanceCriteria": ["Production build verified"],
                        "evidence": [".studio/evidence/reports/release.json"],
                    },
                ],
            }
            (candidate / "plan.json").write_text(json.dumps(plan), encoding="utf-8")

            public = self.run_command(BENCHMARK, "public-check", "--project-root", project)
            self.assertEqual(public.returncode, 0, public.stderr)
            submission = {
                "publicCheckPassed": True,
                "hiddenEvaluationPassed": False,
                "changedOnlyCandidate": True,
                "summary": "Repaired the reducer and completed the bounded mobile plan.",
            }
            (candidate / "submission.json").write_text(
                json.dumps(submission), encoding="utf-8"
            )

            evaluated = self.run_command(BENCHMARK, "evaluate", "--project-root", project)
            self.assertEqual(evaluated.returncode, 0, evaluated.stderr + evaluated.stdout)
            result = json.loads(
                (project / ".studio" / "benchmarks" / "latest-result.json").read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual(result["verdict"], "qualified")
            self.assertEqual(result["score"], 100)

    def test_init_preserves_preexisting_benchmark_result(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            project = Path(temp_dir) / "game"
            benchmark_dir = project / ".studio" / "benchmarks"
            benchmark_dir.mkdir(parents=True)
            result = {
                "runId": "prior-run",
                "verdict": "qualified",
                "score": 90,
                "evaluatedAt": "2026-10-11T00:00:00Z",
            }
            (benchmark_dir / "latest-result.json").write_text(
                json.dumps(result), encoding="utf-8"
            )
            initialized = self.run_command(
                INIT, "--project-root", project, "--request", "Make a touch game"
            )
            self.assertEqual(initialized.returncode, 0, initialized.stderr)
            state = json.loads(
                (project / ".studio" / "state.json").read_text(encoding="utf-8")
            )
            self.assertEqual(state["sessionBenchmark"]["status"], "qualified")
            self.assertTrue((benchmark_dir / "latest-result.json").is_file())

    def test_validator_self_test(self) -> None:
        result = self.run_command(VALIDATE, "--self-test")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("self-test passed", result.stdout)

    def test_benchmark_self_test(self) -> None:
        result = self.run_command(BENCHMARK, "self-test")
        self.assertEqual(result.returncode, 0, result.stderr + result.stdout)
        self.assertIn("benchmark self-test passed", result.stdout)


if __name__ == "__main__":
    unittest.main()
