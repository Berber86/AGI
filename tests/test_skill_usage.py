#!/usr/bin/env python3
"""Unit-тесты метрики полезности скиллов: маркеры исхода в src/skill_usage.py.

Запуск: python -m unittest -v tests/test_skill_usage.py
"""

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

import skill_usage  # noqa: E402


def write_log(lines: list[str]) -> Path:
    """Создаёт временный файл-лог с заданными строками."""
    tmp = tempfile.NamedTemporaryFile(
        mode="w", suffix=".md", encoding="utf-8", delete=False
    )
    with tmp as handle:
        handle.write("\n".join(lines) + "\n")
    return Path(tmp.name)


class OutcomeExtractionTests(unittest.TestCase):
    def test_parses_all_three_statuses(self):
        log = write_log(
            [
                "Применяю скилл `skills/triad-review.md`, потому что важно решение.",
                "Итог скилла `skills/triad-review.md`: успех — триада согласована.",
                "Итог скилла `skills/hypothesis-first.md`: частично — метрика спорная.",
                "Итог скилла `skills/stagnation-watch.md`: неудача — риск занижен.",
            ]
        )
        try:
            outcomes = skill_usage.extract_outcome_events(log)
            self.assertEqual(len(outcomes), 3)
            statuses = {(o.skill_path, o.status) for o in outcomes}
            self.assertIn(("skills/triad-review.md", "успех"), statuses)
            self.assertIn(("skills/hypothesis-first.md", "частично"), statuses)
            self.assertIn(("skills/stagnation-watch.md", "неудача"), statuses)
        finally:
            log.unlink(missing_ok=True)

    def test_outcome_line_is_not_counted_as_use(self):
        log = write_log(
            [
                "Итог скилла `skills/triad-review.md`: успех — решение принято.",
                "Применяю скилл `skills/triad-review.md`, потому что нужна проверка.",
            ]
        )
        try:
            uses = skill_usage.extract_skill_uses(log)
            self.assertEqual(len(uses), 1)
            self.assertEqual(uses[0].skill_path, "skills/triad-review.md")
        finally:
            log.unlink(missing_ok=True)

    def test_use_line_is_not_counted_as_outcome(self):
        log = write_log(
            ["Применяю скилл `skills/triad-review.md`, потому что нужна проверка."]
        )
        try:
            outcomes = skill_usage.extract_outcome_events(log)
            self.assertEqual(len(outcomes), 0)
        finally:
            log.unlink(missing_ok=True)

    def test_unknown_status_not_matched(self):
        log = write_log(
            [
                "Итог скилла `skills/triad-review.md`: отлично — всё сработало.",
                "Итог скилла `skills/triad-review.md`: успешно — всё сработало.",
            ]
        )
        try:
            outcomes = skill_usage.extract_outcome_events(log)
            self.assertEqual(len(outcomes), 0)
        finally:
            log.unlink(missing_ok=True)

    def test_short_and_long_forms(self):
        log = write_log(
            [
                "Итог скилла `skills/reflection-loop.md`: успех — два прохода хватило.",
                "- Итог скилла `skills/reflection-loop.md`: частично — третий проход не нужен.",
            ]
        )
        try:
            outcomes = skill_usage.extract_outcome_events(log)
            self.assertEqual(len(outcomes), 2)
        finally:
            log.unlink(missing_ok=True)

    def test_case_and_whitespace_tolerance(self):
        log = write_log(
            ["ИТОГ СКИЛЛА `skills/triad-review.md` :  Успех — найдено замечание."]
        )
        try:
            outcomes = skill_usage.extract_outcome_events(log)
            self.assertEqual(len(outcomes), 1)
            self.assertEqual(outcomes[0].status, "успех")
        finally:
            log.unlink(missing_ok=True)


class ReportFieldsTests(unittest.TestCase):
    def test_report_has_outcome_fields(self):
        report = skill_usage.build_skill_usage_report()
        for field in (
            "total_outcomes",
            "outcomes_by_status",
            "skills_with_outcomes",
            "unknown_outcome_references",
            "outcome_events",
        ):
            self.assertIn(field, report)
        # Поля старого отчёта, которые используют verify.py и metrics.py, не должны исчезнуть.
        for field in (
            "total_events",
            "unused_skills",
            "unknown_references",
            "per_skill",
            "logs_scanned",
            "logs_with_usage",
        ):
            self.assertIn(field, report)
        for skill, data in report["per_skill"].items():
            self.assertIn("outcomes", data)
            self.assertEqual(
                set(data["outcomes"]), {"успех", "частично", "неудача"}
            )

    def test_outcomes_aggregation_is_consistent(self):
        report = skill_usage.build_skill_usage_report()
        by_status = report["outcomes_by_status"]
        self.assertEqual(
            sum(by_status.values()),
            report["total_outcomes"],
        )
        per_skill_total = sum(
            sum(data["outcomes"].values()) for data in report["per_skill"].values()
        )
        self.assertEqual(per_skill_total, report["total_outcomes"])


if __name__ == "__main__":
    unittest.main()
