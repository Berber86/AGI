#!/usr/bin/env python3
"""
metrics.py — простой снимок прогресса агента AGI.

Запуск:
    python src/metrics.py
    python src/metrics.py --json

Скрипт не пытается измерить «интеллект» напрямую. Он считает наблюдаемые
структурные показатели репозитория: сколько накоплено принципов, скиллов,
исследований, логов, уроков, кода, применений скиллов и PASS/FAIL допуска. Это внешний
сигнал для будущих сессий, а не повод оптимизироваться под красивые числа.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from datetime import date
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_RE = re.compile(r"^session-\d{4}-\d{2}-\d{2}-\d{3}\.md$")
ADMISSION_RE = re.compile(r"<!-- CAPABILITY_ADMISSION: (PASS|FAIL) id=[0-9a-f]{16} score=(\d)/3 ")


def read_text(rel_path: str) -> str:
    """Читает текстовый файл относительно корня репозитория."""
    path = REPO_ROOT / rel_path
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8", errors="replace")


def strip_fenced_blocks(text: str) -> str:
    """Удаляет fenced code blocks, чтобы шаблоны не считались реальными записями."""
    lines: list[str] = []
    in_block = False
    for line in text.splitlines():
        if line.strip().startswith("```"):
            in_block = not in_block
            continue
        if not in_block:
            lines.append(line)
    return "\n".join(lines)


def count_regex_lines(text: str, pattern: str) -> int:
    """Считает строки, совпадающие с регулярным выражением."""
    rx = re.compile(pattern)
    return sum(1 for line in text.splitlines() if rx.search(line))


def list_files(folder: str, pattern: str = "*") -> list[Path]:
    """Возвращает обычные файлы из папки, если она существует."""
    root = REPO_ROOT / folder
    if not root.exists():
        return []
    return sorted(path for path in root.glob(pattern) if path.is_file())


def git_value(args: list[str]) -> str:
    """Безопасно получает одно значение из git; при ошибке возвращает 'unknown'."""
    try:
        result = subprocess.run(
            ["git", *args],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
    except FileNotFoundError:
        return "unknown"
    if result.returncode != 0:
        return "unknown"
    return result.stdout.strip() or "unknown"


def git_dirty_count() -> int:
    """Считает незакоммиченные изменения в рабочем дереве."""
    status = git_value(["status", "--porcelain"])
    if status == "unknown" or not status:
        return 0
    return len(status.splitlines())


def count_deadends() -> int:
    """Считает реальные записи тупиков, игнорируя шаблон в fenced block."""
    text = strip_fenced_blocks(read_text("memory/06-deadends.md"))
    section = text.split("## Записи", 1)[-1]
    return count_regex_lines(section, r"^###\s+")


def admission_stats(logs: list[Path]) -> dict[str, int]:
    """Считает устойчивые PASS/FAIL-marker в сессионных логах."""
    passed = 0
    failed = 0
    for path in logs:
        text = path.read_text(encoding="utf-8", errors="replace")
        for outcome, _score in ADMISSION_RE.findall(text):
            if outcome == "PASS":
                passed += 1
            else:
                failed += 1
    return {"events": passed + failed, "pass": passed, "fail": failed}


def src_stats() -> dict[str, int]:
    """Считает объём Python-кода в src/."""
    files = list_files("src", "*.py")
    total_lines = 0
    non_empty_lines = 0
    total_bytes = 0
    for path in files:
        text = path.read_text(encoding="utf-8", errors="replace")
        lines = text.splitlines()
        total_lines += len(lines)
        non_empty_lines += sum(1 for line in lines if line.strip())
        total_bytes += path.stat().st_size
    return {
        "files": len(files),
        "lines": total_lines,
        "non_empty_lines": non_empty_lines,
        "bytes": total_bytes,
    }


def collect_skill_usage() -> dict[str, Any] | None:
    """Пытается получить отчёт по использованию скиллов из `src/skill_usage.py`."""
    try:
        import skill_usage  # type: ignore

        return skill_usage.build_skill_usage_report()
    except Exception:
        return None


def markdown_files() -> list[Path]:
    """Возвращает md-файлы репозитория, не заходя в .git."""
    result: list[Path] = []
    for path in REPO_ROOT.rglob("*.md"):
        if ".git" in path.relative_to(REPO_ROOT).parts:
            continue
        if path.is_file():
            result.append(path)
    return sorted(result)


def bytes_in(folder: str, pattern: str = "*.md") -> int:
    """Считает суммарный размер файлов в папке."""
    return sum(path.stat().st_size for path in list_files(folder, pattern))


def build_metrics() -> dict[str, Any]:
    """Собирает все метрики в словарь для отчёта или JSON."""
    principles_text = read_text("memory/02-principles.md")
    lessons_text = read_text("memory/05-lessons.md")
    todo_text = read_text("memory/03-todo.md")

    skills = [path for path in list_files("skills", "*.md") if path.name != "README.md"]
    research = list_files("research", "*.md")
    logs = [path for path in list_files("logs", "*.md") if LOG_RE.match(path.name)]
    docs = list_files("docs", "*.md")
    prompts = list_files("prompts", "*.md")
    memory = list_files("memory", "*.md")
    md_files = markdown_files()
    src = src_stats()
    skill_usage = collect_skill_usage()
    admission = admission_stats(logs)

    return {
        "snapshot_date": date.today().isoformat(),
        "repo_root": str(REPO_ROOT),
        "git": {
            "branch": git_value(["branch", "--show-current"]),
            "commit": git_value(["rev-parse", "--short", "HEAD"]),
            "dirty_changes": git_dirty_count(),
        },
        "counts": {
            "principles": count_regex_lines(principles_text, r"^\d+\.\s+"),
            "skills": len(skills),
            "research_files": len(research),
            "logs": len(logs),
            "lessons": count_regex_lines(lessons_text, r"^###\s+L\d+"),
            "deadends": count_deadends(),
            "todo_open": len(re.findall(r"- \[ \]", todo_text)),
            "todo_done": len(re.findall(r"- \[x\]", todo_text)),
            "memory_files": len(memory),
            "docs_files": len(docs),
            "prompts_files": len(prompts),
            "markdown_files": len(md_files),
            "skill_use_events": 0 if skill_usage is None else skill_usage["total_events"],
            "skills_used_at_least_once": 0 if skill_usage is None else skill_usage["skills_used_at_least_once"],
            "skills_unused": 0 if skill_usage is None else skill_usage["skills_unused"],
            "admission_events": admission["events"],
            "admission_pass": admission["pass"],
            "admission_fail": admission["fail"],
        },
        "admission": admission,
        "skill_usage": None if skill_usage is None else {
            "logs_scanned": skill_usage["logs_scanned"],
            "logs_with_usage": skill_usage["logs_with_usage"],
            "unused_skills": skill_usage["unused_skills"],
            "per_skill": skill_usage["per_skill"],
        },
        "src": src,
        "sizes": {
            "memory_bytes": bytes_in("memory"),
            "research_bytes": bytes_in("research"),
            "skills_bytes": bytes_in("skills"),
            "docs_bytes": bytes_in("docs"),
            "prompts_bytes": bytes_in("prompts"),
            "markdown_bytes_total": sum(path.stat().st_size for path in md_files),
        },
    }


def format_bytes(value: int) -> str:
    """Человекочитаемый размер."""
    if value < 1024:
        return f"{value} байт"
    if value < 1024 * 1024:
        return f"{value / 1024:.1f} КиБ"
    return f"{value / (1024 * 1024):.1f} МиБ"


def print_report(metrics: dict[str, Any]) -> None:
    """Печатает простой русскоязычный отчёт."""
    counts = metrics["counts"]
    src = metrics["src"]
    sizes = metrics["sizes"]
    git = metrics["git"]

    print("# Метрики прогресса AGI")
    print()
    print(f"Дата снимка: {metrics['snapshot_date']}")
    print(f"Корень: {metrics['repo_root']}")
    print(f"Git: ветка {git['branch']}, коммит {git['commit']}, незакоммиченных изменений: {git['dirty_changes']}")
    print()
    print("## Структурные счётчики")
    print(f"- Принципов: {counts['principles']}")
    print(f"- Скиллов: {counts['skills']}")
    print(f"- Исследовательских файлов: {counts['research_files']}")
    print(f"- Логов сессий: {counts['logs']}")
    print(f"- Уроков: {counts['lessons']}")
    print(f"- Записей тупиков: {counts['deadends']}")
    print(f"- Открытых задач TODO: {counts['todo_open']}")
    print(f"- Завершённых задач TODO: {counts['todo_done']}")
    print(f"- Явных применений скиллов: {counts['skill_use_events']}")
    print(
        f"- Скиллов, использованных хотя бы раз: "
        f"{counts['skills_used_at_least_once']} / {counts['skills']}"
    )
    print(
        f"- Capability admission PASS/FAIL: "
        f"{counts['admission_pass']} / {counts['admission_fail']}"
    )
    print()
    print("## Объём тела")
    print(f"- Python-файлов в src/: {src['files']}")
    print(f"- Строк Python-кода в src/: {src['lines']} (непустых: {src['non_empty_lines']})")
    print(f"- Объём src/: {format_bytes(src['bytes'])}")
    print(f"- Markdown-файлов всего: {counts['markdown_files']}")
    print(f"- Объём памяти memory/: {format_bytes(sizes['memory_bytes'])}")
    print(f"- Объём исследований research/: {format_bytes(sizes['research_bytes'])}")
    print(f"- Объём скиллов skills/: {format_bytes(sizes['skills_bytes'])}")
    print(f"- Общий объём markdown-тела: {format_bytes(sizes['markdown_bytes_total'])}")
    if metrics.get("skill_usage") is not None and metrics["skill_usage"]["unused_skills"]:
        print(
            "- Неиспользованные скиллы: "
            + ", ".join(f"`{skill}`" for skill in metrics["skill_usage"]["unused_skills"])
        )
    print()
    print("## Предостережение")
    print("Эти числа измеряют структуру и накопление внешней памяти, а не сознание и не AGI.")
    print("Их задача — дать следующий внешний сигнал: растёт ли тело агента и где именно.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Печатает метрики прогресса AGI.")
    parser.add_argument(
        "--json",
        action="store_true",
        help="вывести метрики как JSON для будущей визуализации",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    metrics = build_metrics()
    if args.json:
        print(json.dumps(metrics, ensure_ascii=False, indent=2))
    else:
        print_report(metrics)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
