#!/usr/bin/env python3
"""
dream.py — механизм «сна» для файловой памяти AGI.

Назначение:
    создать компактный, явно помеченный конспект последних N сессий,
    чтобы будущая сессия могла быстро восстановить траекторию без чтения
    всех длинных логов подряд.

Запуск:
    python src/dream.py
    python src/dream.py --sessions 5
    python src/dream.py --stdout

Важно: этот скрипт не удаляет и не изменяет исходные логи. Он создаёт отдельную
суммаризацию с provenance, соблюдая принцип «no silent truncation»: если часть
раздела опущена ради компактности, это явно указано рядом с источником.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT = REPO_ROOT / "memory" / "07-dream.md"
DEFAULT_SESSIONS = 2
LOG_RE = re.compile(r"^session-(\d{4})-(\d{2})-(\d{2})-(\d{3})\.md$")
HEADER_RE = re.compile(r"^(#{2,6})\s+(.+?)\s*$")


@dataclass(frozen=True)
class SessionDigest:
    """Компактная выжимка одного файла лога."""

    path: Path
    title: str
    tasks: str
    outcomes: str
    verdicts: str
    final_status: str
    surprises: str


def relative(path: Path) -> str:
    """Возвращает путь относительно корня репозитория."""
    return str(path.relative_to(REPO_ROOT))


def read_text(path: Path) -> str:
    """Безопасно читает текстовый файл как UTF-8."""
    return path.read_text(encoding="utf-8", errors="replace")


def find_session_logs() -> list[Path]:
    """Находит и сортирует логи сессий по имени."""
    logs_dir = REPO_ROOT / "logs"
    if not logs_dir.exists():
        return []
    return sorted(path for path in logs_dir.iterdir() if path.is_file() and LOG_RE.match(path.name))


def normalize_title(title: str) -> str:
    """Нормализует заголовок для мягкого сопоставления."""
    title = title.lower().replace("ё", "е")
    title = re.sub(r"[^a-zа-я0-9 ]+", " ", title)
    return re.sub(r"\s+", " ", title).strip()


def trim_blank_edges(lines: list[str]) -> list[str]:
    """Убирает пустые строки с краёв, не меняя середину."""
    start = 0
    end = len(lines)
    while start < end and not lines[start].strip():
        start += 1
    while end > start and not lines[end - 1].strip():
        end -= 1
    return lines[start:end]


def sanitize_excerpt_line(line: str) -> str:
    """Преобразует вложенные markdown-заголовки в жирный текст внутри выжимки."""
    match = re.match(r"^#{1,6}\s+(.+?)\s*$", line)
    if match:
        return f"**{match.group(1).strip()}**"
    return line


def compact_markdown(lines: list[str], *, source: Path, max_lines: int) -> str:
    """
    Делает явный компактный фрагмент markdown.

    Это не «молчаливое усечение»: если строк больше лимита, в конец добавляется
    строка с числом опущенных строк и ссылкой на исходный лог.
    """
    meaningful = [sanitize_excerpt_line(line) for line in trim_blank_edges(lines)]
    if not meaningful:
        return "_Раздел не найден или пуст._"

    if len(meaningful) <= max_lines:
        return "\n".join(meaningful)

    kept = meaningful[:max_lines]
    omitted = len(meaningful) - max_lines
    kept.append(
        f"- … Явно опущено строк: {omitted}. Полный источник: `{relative(source)}`."
    )
    return "\n".join(kept)


def choose_heading_block(text: str, *wanted_titles: str) -> list[str]:
    """
    Возвращает тело последнего подходящего markdown-раздела уровней `##`–`######`.

    Раздел заканчивается на следующем заголовке того же или более высокого уровня.
    Это позволяет находить и `## Вердикты`, и вложенные `### Вердикты по гипотезам`.
    """
    wanted = {normalize_title(title) for title in wanted_titles}
    lines = text.splitlines()
    matches: list[list[str]] = []

    for index, line in enumerate(lines):
        header = HEADER_RE.match(line)
        if not header:
            continue
        level = len(header.group(1))
        title = normalize_title(header.group(2))
        if title not in wanted:
            continue

        body: list[str] = []
        for next_line in lines[index + 1 :]:
            next_header = HEADER_RE.match(next_line)
            if next_header and len(next_header.group(1)) <= level:
                break
            body.append(next_line)
        trimmed = trim_blank_edges(body)
        if trimmed:
            matches.append(trimmed)

    if not matches:
        return []
    return matches[-1]


def first_heading(text: str, fallback: str) -> str:
    """Возвращает первый H1-заголовок файла."""
    for line in text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return fallback


def digest_one_log(path: Path) -> SessionDigest:
    """Создаёт компактную выжимку одного лога."""
    text = read_text(path)
    title = first_heading(text, path.stem)

    return SessionDigest(
        path=path,
        title=title,
        tasks=compact_markdown(
            choose_heading_block(text, "Задачи на сессию"),
            source=path,
            max_lines=8,
        ),
        outcomes=compact_markdown(
            choose_heading_block(text, "Итоги сессии", "Итоги"),
            source=path,
            max_lines=12,
        ),
        verdicts=compact_markdown(
            choose_heading_block(text, "Вердикты по гипотезам"),
            source=path,
            max_lines=10,
        ),
        final_status=compact_markdown(
            choose_heading_block(text, "Статус на конец"),
            source=path,
            max_lines=7,
        ),
        surprises=compact_markdown(
            choose_heading_block(
                text,
                "Тупики и неожиданности",
                "Неожиданности",
                "Дополнение после финального прогона сна",
            ),
            source=path,
            max_lines=5,
        ),
    )


def collect_metrics() -> dict[str, Any] | None:
    """Пытается получить текущие структурные метрики из `src/metrics.py`."""
    try:
        sys.path.insert(0, str(REPO_ROOT / "src"))
        import metrics  # type: ignore

        return metrics.build_metrics()
    except Exception:
        return None


def format_metrics(metrics: dict[str, Any] | None) -> str:
    """Форматирует короткий блок метрик для сна."""
    if metrics is None:
        return "_Метрики недоступны: `src/metrics.py` не удалось импортировать или выполнить._"

    counts = metrics["counts"]
    src = metrics["src"]
    git = metrics["git"]
    return "\n".join(
        [
            f"- Git: ветка `{git['branch']}` (коммит и dirty-статус не фиксируются во сне, чтобы избежать самоссылочной устарелости).",
            f"- Принципов: {counts['principles']}; скиллов: {counts['skills']}; исследований: {counts['research_files']}.",
            f"- Логов: {counts['logs']}; уроков: {counts['lessons']}; тупиков: {counts['deadends']}.",
            f"- TODO открыто/закрыто: {counts['todo_open']} / {counts['todo_done']}.",
            f"- Capability admission PASS/FAIL: {counts['admission_pass']} / {counts['admission_fail']}.",
            f"- `src/`: Python-файлов {src['files']}, строк {src['lines']} (непустых {src['non_empty_lines']}).",
        ]
    )


def build_dream(logs: list[Path], *, requested_sessions: int, include_metrics: bool) -> str:
    """Строит полный markdown-файл сна."""
    selected = logs[-requested_sessions:] if requested_sessions > 0 else []
    digests = [digest_one_log(path) for path in selected]
    metrics_block = format_metrics(collect_metrics()) if include_metrics else "_Метрики отключены параметром запуска._"
    today = date.today().isoformat()

    lines: list[str] = [
        "# Сон агента — компактный конспект последних сессий",
        "",
        f"> Явная суммаризация от {today}, создана скриптом `src/dream.py`.",
        "> Это не замена конституции, TODO и исходных логов. При спорных решениях открывай источники.",
        "> Если раздел обрезан ради компактности, рядом указано, сколько строк опущено и где полный источник.",
        "",
        "## Как использовать при пробуждении",
        "1. Следовать bounded-ритуалу из `prompts/context-policy.md` — сон не выше конституции.",
        "2. Прочитать этот файл как обзор траектории внутри стартового ядра.",
        "3. После выбора задачи адресно открыть источник, только если нужна опущенная деталь.",
        "4. После сессии обновить сон и проверить его командой `python src/context_budget.py`.",
        "",
        "## Параметры генерации",
        f"- Запрошено последних сессий: {requested_sessions}.",
        f"- Фактически найдено логов: {len(logs)}.",
        f"- Попало в сон: {len(selected)}.",
        "",
        "## Источники",
    ]

    if selected:
        for path in selected:
            lines.append(f"- `{relative(path)}`")
    else:
        lines.append("- _Логи не найдены._")

    lines.extend(
        [
            "",
            "## Текущий снимок метрик",
            metrics_block,
            "",
            "## Конспекты сессий",
        ]
    )

    if not digests:
        lines.append("_Нет сессий для конспекта._")
    for digest in digests:
        lines.extend(
            [
                "",
                f"### {digest.title}",
                f"- **Источник:** `{relative(digest.path)}`",
                "",
                "#### Задачи",
                digest.tasks,
                "",
                "#### Итоги",
                digest.outcomes,
                "",
                "#### Вердикты",
                digest.verdicts,
                "",
                "#### Тупики и неожиданности",
                digest.surprises,
                "",
                "#### Статус на конец",
                digest.final_status,
            ]
        )

    lines.extend(
        [
            "",
            "## Рекомендация следующему пробуждению",
            "- Начинай с `Readme.md`, затем выполняй `prompts/awakening.md` и `prompts/context-policy.md`.",
            "- Используй этот сон как bounded-обзор траектории, а не замену источникам.",
            "- Полный лог открывай task-directed: при продолжении решения, споре о факте или явном опущении нужной детали.",
            "",
            "## Дата последнего обновления",
            today,
            "",
        ]
    )
    return "\n".join(lines)


def parse_args() -> argparse.Namespace:
    """Разбирает аргументы командной строки."""
    parser = argparse.ArgumentParser(
        description="Генерирует компактный конспект последних логов сессий."
    )
    parser.add_argument(
        "--sessions",
        type=int,
        default=DEFAULT_SESSIONS,
        help=f"сколько последних сессий включить в сон (по умолчанию: {DEFAULT_SESSIONS})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="куда записать markdown-сон (по умолчанию: memory/07-dream.md)",
    )
    parser.add_argument(
        "--stdout",
        action="store_true",
        help="напечатать сон в stdout вместо записи в файл",
    )
    parser.add_argument(
        "--no-metrics",
        action="store_true",
        help="не включать блок метрик из src/metrics.py",
    )
    return parser.parse_args()


def main() -> int:
    """Точка входа."""
    args = parse_args()
    if args.sessions < 1:
        print("ОШИБКА: --sessions должен быть положительным числом.", file=sys.stderr)
        return 1

    logs = find_session_logs()
    dream = build_dream(
        logs,
        requested_sessions=args.sessions,
        include_metrics=not args.no_metrics,
    )

    if args.stdout:
        print(dream)
    else:
        output = args.output
        if not output.is_absolute():
            output = REPO_ROOT / output
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(dream, encoding="utf-8")
        print(f"Сон записан: {relative(output)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
