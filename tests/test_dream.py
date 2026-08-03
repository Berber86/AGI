#!/usr/bin/env python3
"""Тесты для форматирования строки self-модели в src/dream.py."""

import unittest
import sys
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


if __name__ == "__main__":
    unittest.main()
