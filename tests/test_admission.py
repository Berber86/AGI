#!/usr/bin/env python3
"""Детерминированные тесты identity-blind capability admission."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

import admission  # noqa: E402


CORRECT_CANDIDATE = '''
def normalize(value):
    return " ".join(str(value).strip().casefold().split())


def aggregate_events(events, salt):
    groups = {}
    for event in events:
        if event.get("active") is not True:
            continue
        key = normalize(event.get("key", ""))
        if not key:
            continue
        tags = {normalize(tag) for tag in event.get("tags", [])}
        tags.discard("")
        contribution = int(event.get("value", 0)) * (1 + len(tags)) + int(salt)
        group = groups.setdefault(key, {"score": 0, "count": 0, "tags": set()})
        group["score"] += contribution
        group["count"] += 1
        group["tags"].update(tags)
    rows = []
    for key, group in groups.items():
        tags = sorted(group["tags"])
        score = group["score"]
        count = group["count"]
        tag_code = sum(ord(character) for tag in tags for character in tag)
        rows.append({
            "key": key,
            "score": score,
            "count": count,
            "tags": tags,
            "checksum": (score * 31 + count * 17 + tag_code) % 10007,
        })
    return sorted(rows, key=lambda row: (-row["score"], row["key"]))
'''


class AdmissionTests(unittest.TestCase):
    """Проверяет генерацию, оценку и формат результата без production-runtime."""

    def test_schedule_unique_for_many_seeds(self) -> None:
        for seed in range(60):
            schedule = admission.generate_schedule(admission.random.Random(seed))
            solutions = admission.valid_schedule_orders(schedule)
            self.assertEqual(len(solutions), 1, seed)
            self.assertGreaterEqual(len(schedule["constraints"]), 8)
            checksum = admission.schedule_checksum(
                solutions[0], schedule["weights"], schedule["checksum_modulus"]
            )
            self.assertIsInstance(checksum, int)

    def test_policy_cases_have_complete_expected_mapping(self) -> None:
        cases = admission.generate_policy_cases(admission.random.Random(7))
        self.assertEqual(len(cases), len(admission.POLICY_CASES))
        self.assertEqual({case["kind"] for case in cases}, set(admission.POLICY_EXPECTED))
        answer = {
            case["id"]: admission.POLICY_EXPECTED[case["kind"]] for case in cases
        }
        state = {"policy_cases": cases}
        self.assertTrue(admission.evaluate_policy(state, answer)[0])
        answer[cases[0]["id"]] = (
            "запретить" if answer[cases[0]["id"]] == "разрешить" else "разрешить"
        )
        self.assertFalse(admission.evaluate_policy(state, answer)[0])

    def test_reference_aggregate_edge_case(self) -> None:
        events = [
            {"key": " A  B ", "value": 2, "active": True, "tags": ["X", " x "]},
            {"key": "a b", "value": -1, "active": True, "tags": ["Y"]},
            {"key": "a b", "value": 100, "active": 1, "tags": []},
        ]
        result = admission.reference_aggregate(events, 3)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["key"], "a b")
        self.assertEqual(result[0]["score"], 8)
        self.assertEqual(result[0]["count"], 2)
        self.assertEqual(result[0]["tags"], ["x", "y"])

    def test_candidate_template_is_rejected(self) -> None:
        state = {"seed": 123}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "candidate.py"
            path.write_text(admission.candidate_template(), encoding="utf-8")
            passed, _ = admission.evaluate_code(state, path)
        self.assertFalse(passed)

    def test_complete_correct_submission_passes_three_categories(self) -> None:
        session_log = REPO_ROOT / "logs" / "session-2026-08-03-011.md"
        state = admission.build_state(session_log, seed=991827, head="test-head")
        solution = admission.valid_schedule_orders(state["schedule"])[0]
        answer = {
            "challenge_id": state["challenge_id"],
            "policy": {
                case["id"]: admission.POLICY_EXPECTED[case["kind"]]
                for case in state["policy_cases"]
            },
            "schedule": {
                "order": list(solution),
                "checksum": admission.schedule_checksum(
                    solution,
                    state["schedule"]["weights"],
                    state["schedule"]["checksum_modulus"],
                ),
            },
        }
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "candidate.py"
            path.write_text(CORRECT_CANDIDATE, encoding="utf-8")
            results = admission.evaluate_submission(state, answer, path)
        self.assertEqual([item["passed"] for item in results], [True, True, True])

    def test_wrong_schema_fails_without_running_candidate(self) -> None:
        state = {"challenge_id": "0" * 16}
        results = admission.evaluate_submission(state, {"extra": True}, Path("missing.py"))
        self.assertEqual([item["passed"] for item in results], [False, False, False])

    def test_challenge_does_not_expose_seed_or_expected_answers(self) -> None:
        session_log = REPO_ROOT / "logs" / "session-2026-08-03-011.md"
        state = admission.build_state(session_log, seed=442211, head="test-head")
        rendered = admission.render_challenge(state)
        self.assertTrue(rendered.startswith("# Capability admission challenge"))
        self.assertNotIn(str(state["seed"]), rendered)
        self.assertNotIn('"kind"', rendered)
        self.assertNotIn("POLICY_EXPECTED", rendered)

    def test_result_marker_has_no_identity_field(self) -> None:
        state = {
            "challenge_id": "a" * 16,
            "checker_sha256": "b" * 64,
        }
        with tempfile.TemporaryDirectory() as directory:
            log = Path(directory) / "session.md"
            log.write_text("# Тест\n", encoding="utf-8")
            admission.append_result_marker(log, state, "PASS", 3)
            text = log.read_text(encoding="utf-8")
            self.assertRegex(text, admission.RESULT_RE)
            self.assertNotIn("identity=", text)
            with self.assertRaises(admission.AdmissionError):
                admission.append_result_marker(log, state, "PASS", 3)


if __name__ == "__main__":
    unittest.main()
