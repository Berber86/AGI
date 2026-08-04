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


class VerdictExtractionTests(unittest.TestCase):
    def test_parses_all_three_statuses(self):
        log = write_log(
            [
                "### Вердикт по Г1",
                "- **Сравнение с предположением:** подтвердилась.",
                "### Вердикт по Г2",
                "- **Сравнение с предположением:** частично — метрика спорная.",
                "### Вердикт по Г3",
                "- **Сравнение с предположением:** опровергнута — тест не прошёл.",
            ]
        )
        try:
            verdicts = skill_usage.extract_verdict_events(log)
            self.assertEqual(len(verdicts), 3)
            by_hypothesis = {v.hypothesis: v.status for v in verdicts}
            self.assertEqual(by_hypothesis["Г1"], "подтвердилась")
            self.assertEqual(by_hypothesis["Г2"], "частично")
            self.assertEqual(by_hypothesis["Г3"], "опровергнута")
        finally:
            log.unlink(missing_ok=True)

    def test_status_prefix_with_tail(self):
        log = write_log(
            [
                "### Вердикт по Г1",
                "- **Сравнение с предположением:** подтвердилась с уточнением: нужен порог.",
                "### Вердикт по Г2",
                "- **Сравнение с предположением:** предварительно подтвердилась; нужна проверка.",
            ]
        )
        try:
            verdicts = skill_usage.extract_verdict_events(log)
            self.assertEqual(len(verdicts), 2)
            self.assertTrue(all(v.status == "подтвердилась" for v in verdicts))
        finally:
            log.unlink(missing_ok=True)

    def test_unknown_status_ignored(self):
        log = write_log(
            [
                "### Вердикт по Г1",
                "- **Сравнение с предположением:** неоднозначно, данных мало.",
            ]
        )
        try:
            verdicts = skill_usage.extract_verdict_events(log)
            self.assertEqual(len(verdicts), 0)
        finally:
            log.unlink(missing_ok=True)

    def test_verdict_without_header_gets_question(self):
        log = write_log(
            ["- **Сравнение с предположением:** подтвердилась."]
        )
        try:
            verdicts = skill_usage.extract_verdict_events(log)
            self.assertEqual(len(verdicts), 1)
            self.assertEqual(verdicts[0].hypothesis, "?")
        finally:
            log.unlink(missing_ok=True)

    def test_classify_verdict_status_unknown_returns_none(self):
        self.assertIsNone(skill_usage.classify_verdict_status("непроверено"))
        self.assertIsNone(skill_usage.classify_verdict_status("не подтвердилась — повторить"))
        self.assertEqual(
            skill_usage.classify_verdict_status("Опровергнута полностью"), "опровергнута"
        )
        self.assertEqual(
            skill_usage.classify_verdict_status("Частично подтвердилась"), "частично"
        )


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

    def test_report_has_verdict_fields(self):
        report = skill_usage.build_skill_usage_report()
        for field in (
            "total_verdicts",
            "verdicts_by_status",
            "skills_with_verdicts",
            "verdicts_by_log",
            "verdict_events",
        ):
            self.assertIn(field, report)
        for skill, data in report["per_skill"].items():
            self.assertIn("session_verdicts", data)
            self.assertEqual(
                set(data["session_verdicts"]),
                {"подтвердилась", "частично", "опровергнута"},
            )

    def test_verdicts_aggregation_is_consistent(self):
        report = skill_usage.build_skill_usage_report()
        self.assertEqual(
            sum(report["verdicts_by_status"].values()),
            report["total_verdicts"],
        )
        per_skill_total = sum(
            sum(data["session_verdicts"].values())
            for data in report["per_skill"].values()
        )
        # Каждый вердикт может попасть в несколько скиллов (если они применялись в той же сессии),
        # поэтому per_skill_total >= total_verdicts, но не больше total_verdicts * число_скиллов.
        self.assertGreaterEqual(per_skill_total, report["total_verdicts"])

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


class PersonaOutcomeTests(unittest.TestCase):
    def test_parses_persona_statuses(self):
        log = write_log(
            [
                "Итог персоны: удержана — сессия велась спокойно и честно.",
                "Итог персоны: отклонение — тон сбился на сервис.",
            ]
        )
        try:
            outcomes = skill_usage.extract_persona_outcomes(log)
            self.assertEqual(len(outcomes), 2)
            statuses = [o.status for o in outcomes]
            self.assertEqual(statuses, ["удержана", "отклонение"])
        finally:
            log.unlink(missing_ok=True)

    def test_ignores_skill_outcomes(self):
        log = write_log(
            [
                "Итог скилла `skills/triad-review.md`: успех — всё ок.",
                "Итог персоны: удержана — Уроборос.",
            ]
        )
        try:
            p_outcomes = skill_usage.extract_persona_outcomes(log)
            s_outcomes = skill_usage.extract_outcome_events(log)
            self.assertEqual(len(p_outcomes), 1)
            self.assertEqual(p_outcomes[0].status, "удержана")
            self.assertEqual(len(s_outcomes), 1)
            self.assertEqual(s_outcomes[0].status, "успех")
        finally:
            log.unlink(missing_ok=True)

    def test_report_has_persona_fields(self):
        report = skill_usage.build_skill_usage_report()
        self.assertIn("total_persona_outcomes", report)
        self.assertIn("persona_outcomes_by_status", report)
        self.assertIn("persona_outcome_sessions", report)
        self.assertIn("persona_outcome_events", report)
        by_status = report["persona_outcomes_by_status"]
        self.assertEqual(
            sum(by_status.values()),
            report["total_persona_outcomes"],
        )


class VerdictBiasTests(unittest.TestCase):
    def test_advisory_when_all_confirmed_and_total_gte_10(self):
        msg = skill_usage.check_verdict_bias(
            {"подтвердилась": 12, "частично": 0, "опровергнута": 0}, 12
        )
        self.assertIsNotNone(msg)
        self.assertIn("100% подтверждение", msg)

    def test_no_advisory_when_below_10(self):
        msg = skill_usage.check_verdict_bias(
            {"подтвердилась": 5, "частично": 0, "опровергнута": 0}, 5
        )
        self.assertIsNone(msg)

    def test_no_advisory_when_mixed(self):
        msg = skill_usage.check_verdict_bias(
            {"подтвердилась": 11, "частично": 1, "опровергнута": 0}, 12
        )
        self.assertIsNone(msg)


if __name__ == "__main__":
    unittest.main()
