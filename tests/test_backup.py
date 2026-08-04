#!/usr/bin/env python3
"""Тесты для src/backup.py (правила именования и решение «нужен ли тег»)."""

import sys
import unittest
from pathlib import Path
from unittest import mock

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT / "src") not in sys.path:
    sys.path.insert(0, str(REPO_ROOT / "src"))

import backup  # noqa: E402


class BackupTagNamingTests(unittest.TestCase):
    def test_tag_re_matches_expected_format(self):
        self.assertIsNotNone(backup.TAG_RE.match("agi-snapshot-005"))
        self.assertIsNotNone(backup.TAG_RE.match("agi-snapshot-123"))
        self.assertIsNone(backup.TAG_RE.match("agi-snapshot-5"))
        self.assertIsNone(backup.TAG_RE.match("snapshot-005"))
        self.assertIsNone(backup.TAG_RE.match("agi-snapshot-abc"))

    def test_should_create_tag_on_every_nth(self):
        tags = {}
        ok, reason = backup.should_create_tag(25, tags, force=False)
        self.assertTrue(ok)
        self.assertIn("плановый бэкап", reason)

    def test_should_not_create_when_already_exists(self):
        tags = {25: "agi-snapshot-025"}
        ok, reason = backup.should_create_tag(25, tags, force=False)
        self.assertFalse(ok)
        self.assertIn("уже существует", reason)

    def test_should_not_create_off_schedule(self):
        tags = {}
        ok, reason = backup.should_create_tag(24, tags, force=False)
        self.assertFalse(ok)
        self.assertIn("025", reason)

    def test_force_overrides_schedule(self):
        tags = {24: "agi-snapshot-024"}
        ok, reason = backup.should_create_tag(24, tags, force=True)
        self.assertTrue(ok)
        self.assertIn("--force", reason)

    def test_latest_session_number_reads_logs(self):
        # Используем реальную папку logs/ в репозитории — она должна содержать сессии 001..024.
        n = backup.latest_session_number()
        self.assertGreaterEqual(n, 24)


class BackupGitInteractionTests(unittest.TestCase):
    def test_working_tree_clean_reads_porcelain(self):
        with mock.patch("backup.run_git") as rg:
            rg.return_value = mock.Mock(returncode=0, stdout="")
            self.assertTrue(backup.working_tree_clean())
            rg.assert_called_once_with(["status", "--porcelain"], check=False)

    def test_create_tag_refuses_when_dirty(self):
        with mock.patch("backup.working_tree_clean", return_value=False):
            ok, msg = backup.create_tag(25)
            self.assertFalse(ok)
            self.assertIn("не чисто", msg)


if __name__ == "__main__":
    unittest.main()
