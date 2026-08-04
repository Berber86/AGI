#!/usr/bin/env python3
"""
backup.py — простой механизм периодических бэкапов памяти через аннотированные git-теги.

Назначение:
    Каждые N сессий (по умолчанию 5) создавать аннотированный git-тег вида
    `agi-snapshot-NNN`, чтобы у агента была стабильная точка возврата к
    прошлому состоянию памяти, если будущая сессия что-то испортит.

Запуск:
    python src/backup.py            # проверить, нужен ли бэкап, и при необходимости создать тег
    python src/backup.py --force    # создать тег в любом случае
    python src/backup.py --status   # показать последний бэкап и номер следующего планового

Свойства:
- Идемпотентность: если тег с таким именем уже существует, повторно не создаётся.
- Тег указывает на текущий HEAD. Рабочее дерево должно быть чистым, иначе
  скрипт откажется ставить тег (чтобы не бэкапить незакоммиченный шум).
- Сообщение тега содержит короткий снимок структурных метрик — полезно при просмотре истории.
- Это НЕ является security boundary и не заменяет ручной review создателя;
  тег — всего лишь удобная точка возврата.
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_RE = re.compile(r"^session-(\d{4})-(\d{2})-(\d{2})-(\d{3})\.md$")
TAG_RE = re.compile(r"^agi-snapshot-(\d{3})$")
EVERY_NTH_SESSION = 5


def run_git(args: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    """Запускает git в корне репозитория."""
    return subprocess.run(
        ["git", *args],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=check,
    )


def latest_session_number() -> int:
    """Возвращает номер последней сессии по именам файлов в logs/."""
    logs_dir = REPO_ROOT / "logs"
    if not logs_dir.exists():
        return 0
    max_n = 0
    for path in logs_dir.iterdir():
        m = LOG_RE.match(path.name)
        if m:
            n = int(m.group(4))
            if n > max_n:
                max_n = n
    return max_n


def list_existing_tags() -> dict[int, str]:
    """Возвращает словарь {номер_сессии: имя_тега} для существующих snapshot-тегов."""
    result: dict[int, str] = {}
    try:
        proc = run_git(["tag", "--list", "agi-snapshot-*"], check=False)
    except FileNotFoundError:
        return result
    if proc.returncode != 0:
        return result
    for line in proc.stdout.splitlines():
        name = line.strip()
        m = TAG_RE.match(name)
        if m:
            result[int(m.group(1))] = name
    return result


def working_tree_clean() -> bool:
    try:
        proc = run_git(["status", "--porcelain"], check=False)
    except FileNotFoundError:
        return False
    return proc.returncode == 0 and proc.stdout.strip() == ""


def current_head() -> str | None:
    try:
        proc = run_git(["rev-parse", "--short", "HEAD"], check=False)
    except FileNotFoundError:
        return None
    if proc.returncode != 0:
        return None
    return proc.stdout.strip()


def collect_metrics_summary() -> str:
    """Собирает короткую сводку метрик для сообщения тега."""
    try:
        sys.path.insert(0, str(REPO_ROOT / "src"))
        import metrics  # type: ignore

        m: dict[str, Any] = metrics.build_metrics()
        c = m.get("counts", {})
        src = m.get("src", {})
        lines = [
            f"session={latest_session_number()}",
            f"principles={c.get('principles')} skills={c.get('skills')} research={c.get('research_files')}",
            f"lessons={c.get('lessons')} deadends={c.get('deadends')} todo_open={c.get('todo_open')} todo_done={c.get('todo_done')}",
            f"logs={c.get('logs')} admission_pass={c.get('admission_pass')} admission_fail={c.get('admission_fail')}",
            f"src_files={src.get('files')} src_lines={src.get('lines')}",
        ]
        return "\n".join(lines)
    except Exception as exc:
        return f"session={latest_session_number()}\nmetrics_unavailable={exc!r}"


def should_create_tag(latest: int, tags: dict[int, str], *, force: bool) -> tuple[bool, str]:
    """Решает, нужно ли создать тег сейчас."""
    if force:
        return True, "создан по --force"
    if latest == 0:
        return False, "сессионные логи не найдены"
    if latest in tags:
        return False, f"тег для сессии {latest} уже существует ({tags[latest]})"
    if latest % EVERY_NTH_SESSION != 0:
        next_n = latest + (EVERY_NTH_SESSION - latest % EVERY_NTH_SESSION)
        return False, f"ближайший плановый бэкап на сессии #{next_n:03d} (каждые {EVERY_NTH_SESSION} сессий)"
    return True, f"плановый бэкап (каждые {EVERY_NTH_SESSION} сессий)"


def create_tag(session_n: int) -> tuple[bool, str]:
    """Создаёт аннотированный тег для указанной сессии."""
    tag_name = f"agi-snapshot-{session_n:03d}"
    if not working_tree_clean():
        return False, f"нельзя создать тег {tag_name}: рабочее дерево не чисто (сначала сделай коммит)"
    head = current_head() or "?"
    message = f"AGI snapshot at session #{session_n}\n\nHEAD: {head}\n\n{collect_metrics_summary()}\n"
    try:
        proc = run_git(["tag", "-a", tag_name, "-m", message], check=False)
    except FileNotFoundError:
        return False, "git не найден в окружении"
    if proc.returncode != 0:
        return False, f"git tag вернул ошибку: {proc.stderr.strip()}"
    return True, f"создан аннотированный тег {tag_name} на {head}"


def status() -> str:
    """Возвращает человекочитаемую строку о текущем состоянии бэкапов."""
    tags = list_existing_tags()
    latest = latest_session_number()
    head = current_head() or "?"
    lines = [
        f"Текущая сессия: #{latest:03d} (HEAD {head})",
        f"Частота плановых бэкапов: каждые {EVERY_NTH_SESSION} сессий.",
    ]
    if tags:
        last_n = max(tags)
        lines.append(f"Последний snapshot-тег: {tags[last_n]} (сессия #{last_n:03d}).")
    else:
        lines.append("Snapshot-тегов пока нет.")
    need, reason = should_create_tag(latest, tags, force=False)
    lines.append(f"Сейчас: {'нужен бэкап' if need else 'бэкап не нужен'} — {reason}.")
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Периодические бэкапы памяти через аннотированные git-теги.")
    p.add_argument("--force", action="store_true", help="создать тег в любом случае (даже вне расписания)")
    p.add_argument("--status", action="store_true", help="показать статус и выйти, ничего не создавая")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    if args.status:
        print(status())
        return 0

    latest = latest_session_number()
    tags = list_existing_tags()
    need, reason = should_create_tag(latest, tags, force=args.force)
    print(status())
    print()
    if not need:
        print(f"Бэкап не создаётся: {reason}.")
        return 0
    ok, msg = create_tag(latest)
    print(msg)
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
