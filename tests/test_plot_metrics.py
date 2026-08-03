#!/usr/bin/env python3
"""Unit-тесты визуализации метрик: src/plot_metrics.py.

Запуск: python -m unittest -v tests/test_plot_metrics.py
"""

import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

import plot_metrics  # noqa: E402


def fake_metrics(counts: dict, date: str = "2026-08-03", commit: str = "abc123") -> dict:
    """Минимальный словарь метрик в формате src/metrics.py build_metrics()."""
    return {
        "snapshot_date": date,
        "repo_root": "/repo",
        "git": {"branch": "arena/x-agi", "commit": commit, "dirty_changes": 0},
        "counts": {
            "principles": 49,
            "skills": 5,
            "research_files": 3,
            "logs": 14,
            "lessons": 25,
            "deadends": 0,
            "todo_open": 9,
            "todo_done": 21,
            "memory_files": 10,
            "docs_files": 2,
            "prompts_files": 3,
            "markdown_files": 40,
            "skill_use_events": 22,
            "skills_used_at_least_once": 5,
            "skills_unused": 0,
            "admission_events": 4,
            "admission_pass": 4,
            "admission_fail": 0,
            **counts,
        },
        "src": {"lines": 3000, "non_empty_lines": 2500, "files": 8, "bytes": 100000},
        "sizes": {"markdown_bytes_total": 500000},
    }


class SnapshotTests(unittest.TestCase):
    def test_append_adds_new_snapshot(self):
        history = [{"date": "2026-08-03", "commit": "aaa", "counts": {"logs": 13}}]
        metrics = fake_metrics({"logs": 14})
        new_history, added = plot_metrics.append_snapshot(history, metrics)
        self.assertTrue(added)
        self.assertEqual(len(new_history), 2)
        self.assertEqual(new_history[-1]["counts"]["logs"], 14)

    def test_append_skips_duplicate(self):
        metrics = fake_metrics({})
        history, added1 = plot_metrics.append_snapshot([], metrics)
        history2, added2 = plot_metrics.append_snapshot(history, metrics)
        self.assertTrue(added1)
        self.assertFalse(added2)
        self.assertEqual(len(history2), 1)

    def test_append_trims_to_limit(self):
        history = []
        for i in range(5):
            history, _ = plot_metrics.append_snapshot(
                history, fake_metrics({"logs": 10 + i}, date=f"2026-08-0{i + 1}"), limit=3
            )
        self.assertEqual(len(history), 3)
        self.assertEqual(history[-1]["counts"]["logs"], 14)

    def test_history_roundtrip(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "history.json"
            history = [{"date": "2026-08-03", "commit": "abc", "counts": {"logs": 1}}]
            plot_metrics.write_history(history, path)
            loaded = plot_metrics.read_history(path)
            self.assertEqual(loaded, history)

    def test_read_history_missing_file_returns_empty(self):
        self.assertEqual(plot_metrics.read_history(Path("/nonexistent/h.json")), [])


class DeltaTests(unittest.TestCase):
    def test_delta_counts_changes(self):
        prev = {"logs": 10, "lessons": 20, "principles": 49}
        cur = {"logs": 14, "lessons": 25, "principles": 49}
        delta = plot_metrics.compute_delta(prev, cur)
        self.assertEqual(delta, {"logs": 4, "lessons": 5})

    def test_delta_ignores_unknown_keys(self):
        delta = plot_metrics.compute_delta({"unknown": 1}, {"unknown": 5})
        self.assertEqual(delta, {})


class RenderTests(unittest.TestCase):
    def test_html_contains_key_sections(self):
        metrics = fake_metrics({})
        history = [plot_metrics.snapshot_payload(metrics)]
        html_out = plot_metrics.render_html(metrics, history, {"logs": 1})
        self.assertIn("Метрики прогресса AGI", html_out)
        self.assertIn("Принципов", html_out)
        self.assertIn("История снимков", html_out)
        self.assertIn("Предостережение", html_out)
        self.assertIn("+1", html_out)

    def test_html_escapes_commit(self):
        metrics = fake_metrics({}, commit="<script>")
        history = [plot_metrics.snapshot_payload(metrics)]
        html_out = plot_metrics.render_html(metrics, history, {})
        self.assertNotIn("<script>", html_out)
        self.assertIn("&lt;script&gt;", html_out)

    def test_render_without_history(self):
        html_out = plot_metrics.render_html(fake_metrics({}), [], {})
        self.assertIn("История снимков", html_out)


if __name__ == "__main__":
    unittest.main()
