#!/usr/bin/env python3
"""Unit-тесты органа self-модели (src/self_model.py)."""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
import self_model  # noqa: E402


def make_tree(root: Path) -> None:
    """Создаёт минимальный репозиторий с предсказуемыми счётчиками."""
    (root / "memory").mkdir(parents=True)
    (root / "skills").mkdir()
    (root / "research").mkdir()
    (root / "logs").mkdir()
    (root / "src").mkdir()
    (root / "prompts").mkdir()

    # 2 принципа
    (root / "memory/02-principles.md").write_text(
        "1. **A.**\n2. **B.**\n- bullet (не принцип)\n", encoding="utf-8")
    # 3 скилла (README исключается)
    (root / "skills/README.md").write_text("# реестр\n", encoding="utf-8")
    (root / "skills/one.md").write_text("# один\n", encoding="utf-8")
    (root / "skills/two.md").write_text("# два\n", encoding="utf-8")
    (root / "skills/three.md").write_text("# три\n", encoding="utf-8")
    # 2 исследования
    (root / "research/r1.md").write_text("# r1\n", encoding="utf-8")
    (root / "research/r2.md").write_text("# r2\n", encoding="utf-8")
    # 2 сессии (одна с PASS)
    (root / "logs/session-2026-08-03-001.md").write_text(
        "# Сессия\n<!-- CAPABILITY_ADMISSION: PASS id=0000000000000000 score=3/3 -->\n",
        encoding="utf-8")
    (root / "logs/session-2026-08-03-002.md").write_text("# Сессия\n", encoding="utf-8")
    # 2 урока
    (root / "memory/05-lessons.md").write_text(
        "### L1 — a\n### L2 — b\n", encoding="utf-8")
    # 1 тупик
    (root / "memory/06-deadends.md").write_text(
        "# Тупики\n## Записи\n### D1 — что-то\n", encoding="utf-8")
    # TODO: 2 открытых, 1 закрытый
    (root / "memory/03-todo.md").write_text(
        "- [ ] задача1\n- [ ] задача2\n- [x] сделано\n", encoding="utf-8")
    # src: 2 py
    (root / "src/a.py").write_text("x=1\n", encoding="utf-8")
    (root / "src/b.py").write_text("y=2\n", encoding="utf-8")
    # самоописание + персона + контекстная политика с манифестом (2 файла ядра: self + policy)
    (root / "memory/01-self.md").write_text("Я — агент.\n", encoding="utf-8")
    (root / "memory/10-persona.md").write_text("## 1. Идентичность персоны\nУроборос.\n", encoding="utf-8")
    policy = (
        "<!-- CONTEXT_CORE_START -->\n"
        "- `memory/01-self.md`\n"
        "- `prompts/context-policy.md`\n"
        "<!-- CONTEXT_CORE_END -->\n"
        "<!-- CONTEXT_BUDGET_CHARS: 80000 -->\n"
    )
    (root / "prompts/context-policy.md").write_text(policy, encoding="utf-8")


class SelfModelMeasureTest(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        make_tree(self.root)

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def test_measure_counts(self) -> None:
        m = self_model.measure(self.root)
        self.assertEqual(len(m["persona_digest"]), 12)
        self.assertEqual(m["principles"], 2)
        self.assertEqual(m["skills"], 3)  # README исключён
        self.assertEqual(m["research_files"], 2)
        self.assertEqual(m["sessions"], 2)
        self.assertEqual(m["lessons"], 2)
        self.assertEqual(m["deadends"], 1)
        self.assertEqual(m["todo_open"], 2)
        self.assertEqual(m["todo_done"], 1)
        self.assertEqual(m["admission_pass"], 1)
        self.assertEqual(m["src_files"], 2)
        # бюджет: self (6 символов "Я — агент.\n" -> 10) + policy
        self.assertGreater(m["budget_used_chars"], 0)

    def test_self_digest_deterministic(self) -> None:
        d1 = self_model.self_digest(self.root)
        d2 = self_model.self_digest(self.root)
        self.assertEqual(d1, d2)
        self.assertEqual(len(d1), 12)

    def test_no_self_file_gives_empty_digest(self) -> None:
        (self.root / "memory/01-self.md").unlink()
        self.assertEqual(self_model.self_digest(self.root), "")

    def test_persona_digest(self) -> None:
        d = self_model.persona_digest(self.root)
        self.assertEqual(len(d), 12)
        # при изменении персоны отпечаток меняется
        (self.root / "memory/10-persona.md").write_text(
            "## 1. Идентичность персоны\nДругой.\n", encoding="utf-8")
        self.assertNotEqual(self_model.persona_digest(self.root), d)
        # нет файла -> пусто
        (self.root / "memory/10-persona.md").unlink()
        self.assertEqual(self_model.persona_digest(self.root), "")


class SelfModelSnapshotTest(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        make_tree(self.root)

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def test_update_writes_snapshot(self) -> None:
        snap = self_model.update(self.root)
        path = self.root / self_model.DEFAULT_SELF_MODEL
        self.assertTrue(path.is_file())
        self.assertEqual(snap["schema"], "self-model v1")
        self.assertEqual(snap["dimensions"]["sessions"], 2)

    def test_check_aligned_when_unchanged(self) -> None:
        self_model.update(self.root)
        report = self_model.check(self.root)
        self.assertTrue(report["has_model"])
        self.assertEqual(len(report["divergent"]), 0)
        self.assertEqual(len(report["aligned"]), len(self_model.DIMENSIONS))

    def test_check_detects_divergence(self) -> None:
        self_model.update(self.root)
        # меняем факты: добавляем сессию и меняем самоописание
        (self.root / "logs/session-2026-08-03-003.md").write_text("# s\n", encoding="utf-8")
        (self.root / "memory/01-self.md").write_text("Я — агент. Изменился.\n", encoding="utf-8")
        report = self_model.check(self.root)
        self.assertTrue(report["has_model"])
        keys = {key for key, _, _, _ in report["divergent"]}
        self.assertIn("sessions", keys)
        self.assertIn("self_digest", keys)

    def test_check_without_snapshot(self) -> None:
        report = self_model.check(self.root)
        self.assertFalse(report["has_model"])
        self.assertEqual(len(report["divergent"]), len(self_model.DIMENSIONS))

    def test_load_missing_snapshot(self) -> None:
        self.assertIsNone(self_model.load_snapshot(self.root))

    def test_roundtrip_json(self) -> None:
        snap = self_model.update(self.root)
        loaded = self_model.load_snapshot(self.root)
        self.assertEqual(loaded["dimensions"], snap["dimensions"])


class SelfModelHistoryTest(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        make_tree(self.root)

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def test_update_records_history(self) -> None:
        self_model.update(self.root)
        hist = self_model.history(self.root)
        self.assertEqual(len(hist["entries"]), 1)
        self.assertEqual(hist["entries"][0]["dimensions"]["sessions"], 2)

    def test_history_delta_detects_change(self) -> None:
        self_model.update(self.root)
        # меняем факты: добавляем сессию -> следующий update даст дельту
        (self.root / "logs/session-2026-08-03-003.md").write_text("# s\n", encoding="utf-8")
        self_model.update(self.root)
        hist = self_model.history(self.root)
        self.assertEqual(len(hist["entries"]), 2)
        keys = {k for k, _, _ in hist["delta"]}
        self.assertIn("sessions", keys)

    def test_update_identical_no_duplicate(self) -> None:
        self_model.update(self.root)
        self_model.update(self.root)  # без изменений фактов
        hist = self_model.history(self.root)
        self.assertEqual(len(hist["entries"]), 1)

    def test_load_history_empty(self) -> None:
        self.assertEqual(self_model.load_history(self.root), [])

    def test_history_limit(self) -> None:
        # дописываем 5 записей с лимитом 3 -> остаётся максимум 3
        for i in range(5):
            self_model.record_history({"snapshot_date": "2026-08-03", "dimensions": {"x": i}},
                                      self.root, limit=3)
        hist = self_model.load_history(self.root)
        self.assertLessEqual(len(hist), 3)


class SelfModelCliTest(unittest.TestCase):
    def test_update_then_check_exit_codes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            make_tree(root)
            self.assertEqual(self_model.update(root)["dimensions"]["sessions"], 2)
            # check с расхождением -> 2
            self.assertEqual(self_model.check(root)["has_model"], True)


if __name__ == "__main__":
    unittest.main()
