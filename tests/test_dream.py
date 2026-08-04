#!/usr/bin/env python3
"""Тесты для форматирования и истории снов в src/dream.py."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT / "src") not in sys.path:
    sys.path.insert(0, str(REPO_ROOT / "src"))

import dream


class DreamSelfModelTests(unittest.TestCase):
    """Проверяет корректное форматирование строки self-модели для сна."""

    def test_empty_or_none_history(self):
        self.assertEqual(
            dream.format_self_model_line(None),
            "- Self-модель: _история снимков пуста или недоступна._",
        )
        self.assertEqual(
            dream.format_self_model_line({"entries": []}),
            "- Self-модель: _история снимков пуста или недоступна._",
        )

    def test_single_entry_history(self):
        line = dream.format_self_model_line(
            {"entries": [{"snapshot_date": "2026-08-03"}], "last_date": "2026-08-03"}
        )
        self.assertIn("начальная запись", line)
        self.assertIn("2026-08-03", line)

    def test_delta_formatting(self):
        history_info = {
            "entries": [{}, {}, {}],
            "last_date": "2026-08-03",
            "delta": [
                ("lessons", 28, 29),
                ("todo_open", 12, 11),
            ],
        }
        line = dream.format_self_model_line(history_info)
        self.assertIn("Self-модель (3 снимков, от 2026-08-03):", line)
        self.assertIn("уроков: 28 → 29", line)
        self.assertIn("открытых задач: 12 → 11", line)


class DreamHistoryTests(unittest.TestCase):
    """Проверяет накопление истории digest-снимков и блок динамики."""

    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        self.history_path = Path(self.tmpdir.name) / "dream-history.json"

    def tearDown(self):
        self.tmpdir.cleanup()

    def test_first_snapshot_written_to_history(self):
        snapshot = {
            "date": "2026-08-04",
            "requested_sessions": 2,
            "counts": {"logs": 21, "lessons": 33},
            "task_labels": ["Допуск"],
            "sources": ["logs/a.md"],
        }
        prev, history = dream.update_dream_history(self.history_path, snapshot)
        self.assertIsNone(prev)
        self.assertEqual(len(history), 1)
        self.assertTrue(self.history_path.exists())
        payload = json.loads(self.history_path.read_text(encoding="utf-8"))
        self.assertEqual(payload[0]["date"], "2026-08-04")

    def test_identical_snapshot_not_duplicated(self):
        snapshot = {
            "date": "2026-08-04",
            "requested_sessions": 2,
            "counts": {"logs": 21, "lessons": 33},
            "task_labels": ["Допуск"],
            "sources": ["logs/a.md"],
        }
        dream.update_dream_history(self.history_path, snapshot)
        prev, history = dream.update_dream_history(self.history_path, snapshot)
        self.assertIsNotNone(prev)
        self.assertEqual(len(history), 1)

    def test_changed_counts_add_new_entry(self):
        first = {
            "date": "2026-08-04",
            "requested_sessions": 2,
            "counts": {"logs": 21, "lessons": 33},
            "task_labels": ["Допуск"],
            "sources": ["logs/a.md"],
        }
        second = {
            "date": "2026-08-04",
            "requested_sessions": 2,
            "counts": {"logs": 22, "lessons": 34},
            "task_labels": ["Допуск", "Сон"],
            "sources": ["logs/a.md", "logs/b.md"],
        }
        dream.update_dream_history(self.history_path, first)
        prev, history = dream.update_dream_history(self.history_path, second)
        self.assertEqual(len(history), 2)
        self.assertEqual(prev["counts"]["logs"], 21)

    def test_dynamics_block_shows_delta_and_themes(self):
        prev = {
            "date": "2026-08-04",
            "requested_sessions": 2,
            "counts": {"logs": 21, "lessons": 33, "principles": 51},
            "task_labels": ["Допуск"],
        }
        now = {
            "date": "2026-08-04",
            "requested_sessions": 2,
            "counts": {"logs": 22, "lessons": 34, "principles": 51},
            "task_labels": ["Допуск", "История снов"],
        }
        block = dream.format_dynamics_block(prev, now, [prev, now])
        self.assertIn("логи: 21 → 22 (+1)", block)
        self.assertIn("уроки: 33 → 34 (+1)", block)
        self.assertNotIn("принципы", block)
        self.assertIn("Темы текущего сна", block)
        self.assertIn("История снов", block)


if __name__ == "__main__":
    unittest.main()
