#!/usr/bin/env python3
"""
skill_usage.py — учёт и отчёт по явному применению скиллов в логах AGI.

Зачем нужен этот скрипт:
- проверить, что скиллы из `skills/` реально используются, а не лежат мёртвым грузом;
- собрать простой внешний сигнал: какие скиллы применяются чаще, какие ни разу не были вызваны;
- стандартизировать машинно-читаемый, но всё ещё человекочитаемый маркер в логах.

Ожидаемый маркер в логе:
    Применяю скилл `skills/<имя>.md`, потому что ...

Скрипт также понимает более короткий исторический вариант:
    Применяю `skills/<имя>.md`: ...

Запуск:
    python src/skill_usage.py
    python src/skill_usage.py --json
    python src/skill_usage.py --strict

Коды выхода:
0 — всё хорошо: есть применения, нет неизвестных ссылок, нет неиспользованных скиллов
2 — есть предупреждения (например, скилл ни разу явно не применялся)
1 — внутренняя ошибка выполнения скрипта
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_RE = re.compile(r"^session-\d{4}-\d{2}-\d{2}-\d{3}\.md$")
SESSION_LABEL_RE = re.compile(r"^session-\d{4}-\d{2}-\d{2}-(\d{3})\.md$")
SKILL_USE_RE = re.compile(
    r"^\s*(?:[-*]\s+)?Применяю(?:\s+скилл)?\s+`?(skills/[A-Za-z0-9._/-]+\.md)`?",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class SkillUseEvent:
    """Одно найденное явное применение скилла в конкретном логе."""

    skill_path: str
    log_path: Path
    line_no: int
    line_text: str

    @property
    def log_rel(self) -> str:
        return str(self.log_path.relative_to(REPO_ROOT))

    @property
    def session_label(self) -> str:
        match = SESSION_LABEL_RE.match(self.log_path.name)
        if not match:
            return self.log_path.stem
        return f"#{match.group(1)}"


def relative(path: Path) -> str:
    """Возвращает путь относительно корня репозитория."""
    return str(path.relative_to(REPO_ROOT))


def list_logs() -> list[Path]:
    """Возвращает все корректно именованные логи сессий."""
    root = REPO_ROOT / "logs"
    if not root.exists():
        return []
    return sorted(path for path in root.iterdir() if path.is_file() and LOG_RE.match(path.name))


def list_skills() -> list[Path]:
    """Возвращает реальные файлы скиллов, исключая README."""
    root = REPO_ROOT / "skills"
    if not root.exists():
        return []
    return sorted(path for path in root.glob("*.md") if path.is_file() and path.name != "README.md")


def extract_skill_uses(log_path: Path) -> list[SkillUseEvent]:
    """Извлекает все явные применения скиллов из одного лога."""
    text = log_path.read_text(encoding="utf-8", errors="replace")
    events: list[SkillUseEvent] = []
    for line_no, line in enumerate(text.splitlines(), start=1):
        match = SKILL_USE_RE.search(line)
        if not match:
            continue
        events.append(
            SkillUseEvent(
                skill_path=match.group(1),
                log_path=log_path,
                line_no=line_no,
                line_text=line.strip(),
            )
        )
    return events


def ru_plural(value: int, one: str, few: str, many: str) -> str:
    """Возвращает русскую форму существительного после числа."""
    n = abs(value) % 100
    if 11 <= n <= 14:
        return many
    n = n % 10
    if n == 1:
        return one
    if 2 <= n <= 4:
        return few
    return many


def build_skill_usage_report() -> dict[str, Any]:
    """Строит словарь-отчёт, пригодный и для CLI, и для импорта из других скриптов."""
    skill_paths = [relative(path) for path in list_skills()]
    known_skills = set(skill_paths)
    logs = list_logs()

    per_skill: dict[str, dict[str, Any]] = {
        skill: {
            "count": 0,
            "sessions": [],
            "logs": [],
            "last_log": None,
            "last_line": None,
            "examples": [],
        }
        for skill in skill_paths
    }

    events: list[SkillUseEvent] = []
    unknown_references: list[dict[str, Any]] = []
    logs_with_usage: set[str] = set()

    for log_path in logs:
        for event in extract_skill_uses(log_path):
            events.append(event)
            logs_with_usage.add(event.log_rel)
            if event.skill_path not in known_skills:
                unknown_references.append(
                    {
                        "skill_path": event.skill_path,
                        "log": event.log_rel,
                        "session": event.session_label,
                        "line_no": event.line_no,
                        "line_text": event.line_text,
                    }
                )
                continue

            bucket = per_skill[event.skill_path]
            bucket["count"] += 1
            if event.session_label not in bucket["sessions"]:
                bucket["sessions"].append(event.session_label)
            if event.log_rel not in bucket["logs"]:
                bucket["logs"].append(event.log_rel)
            bucket["last_log"] = event.log_rel
            bucket["last_line"] = event.line_no
            if len(bucket["examples"]) < 3:
                bucket["examples"].append(event.line_text)

    unused_skills = [skill for skill, data in per_skill.items() if data["count"] == 0]
    used_skills = [skill for skill, data in per_skill.items() if data["count"] > 0]

    return {
        "repo_root": str(REPO_ROOT),
        "logs_scanned": len(logs),
        "skills_in_registry": len(skill_paths),
        "skill_paths": skill_paths,
        "total_events": len(events),
        "logs_with_usage": len(logs_with_usage),
        "skills_used_at_least_once": len(used_skills),
        "skills_unused": len(unused_skills),
        "unused_skills": unused_skills,
        "unknown_references": unknown_references,
        "per_skill": per_skill,
        "events": [
            {
                "skill_path": event.skill_path,
                "log": event.log_rel,
                "session": event.session_label,
                "line_no": event.line_no,
                "line_text": event.line_text,
            }
            for event in events
        ],
    }


def collect_warnings(report: dict[str, Any]) -> list[str]:
    """Возвращает предупреждения для человекочитаемого отчёта."""
    warnings: list[str] = []
    if report["total_events"] == 0:
        warnings.append("В логах не найдено ни одного явного применения скиллов.")
    if report["unused_skills"]:
        warnings.append(
            "Ни разу явно не применялись: "
            + ", ".join(f"`{skill}`" for skill in report["unused_skills"])
            + "."
        )
    if report["unknown_references"]:
        warnings.append(
            f"Найдено ссылок на неизвестные скиллы: {len(report['unknown_references'])}."
        )
    return warnings


def exit_code(report: dict[str, Any]) -> int:
    """Код выхода в стиле verify.py: 0 чисто, 2 предупреждения."""
    return 2 if collect_warnings(report) else 0


def print_report(report: dict[str, Any]) -> None:
    """Печатает простой русскоязычный отчёт."""
    print("# Учёт применения скиллов")
    print()
    print(f"Корень: {report['repo_root']}")
    print(f"Логов просканировано: {report['logs_scanned']}")
    print(f"Скиллов в реестре: {report['skills_in_registry']}")
    print(f"Явных применений найдено: {report['total_events']}")
    print(f"Логов с маркерами применения: {report['logs_with_usage']}")
    print(
        f"Скиллов, использованных хотя бы раз: "
        f"{report['skills_used_at_least_once']} / {report['skills_in_registry']}"
    )
    print()
    print("## По скиллам")
    for skill, data in report["per_skill"].items():
        if data["count"] == 0:
            print(f"- `{skill}` — 0 применений")
            continue
        sessions = ", ".join(data["sessions"])
        uses_word = ru_plural(data['count'], 'применение', 'применения', 'применений')
        print(
            f"- `{skill}` — {data['count']} {uses_word}; "
            f"сессии: {sessions}; последний лог: `{data['last_log']}`:{data['last_line']}"
        )

    if report["unknown_references"]:
        print()
        print("## Неизвестные ссылки")
        for item in report["unknown_references"]:
            print(
                f"- `{item['skill_path']}` в `{item['log']}`:{item['line_no']} "
                f"({item['session']})"
            )

    warnings = collect_warnings(report)
    if warnings:
        print()
        print("## Предупреждения")
        for warning in warnings:
            print(f"- {warning}")
    else:
        print()
        print("✅ Все скиллы из реестра были явно применены хотя бы один раз; неизвестных ссылок нет.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Считает явные применения скиллов по логам сессий."
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="вывести отчёт как JSON",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="вернуть ненулевой код при предупреждениях",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    report = build_skill_usage_report()
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print_report(report)

    code = exit_code(report)
    if args.strict:
        return code
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except BrokenPipeError:
        raise SystemExit(1)
