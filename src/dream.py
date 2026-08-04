#!/usr/bin/env python3
"""
dream.py — механизм «сна» для файловой памяти AGI.

Назначение:
    создать компактный, явно помеченный конспект последних N сессий,
    чтобы будущая сессия могла быстро восстановить траекторию без чтения
    всех длинных логов подряд.

Дополнительно ведётся компактная история digest-снимков в on-demand файле
`memory/14-dream-history.json` (вне bounded core), чтобы можно было наблюдать
динамику траектории между прогонами сна и показывать короткую дельту прямо
в markdown-сне — без молчаливого усечения и без раздувания ядра.

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
import json
import re
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT = REPO_ROOT / "memory" / "07-dream.md"
DEFAULT_HISTORY = REPO_ROOT / "memory" / "14-dream-history.json"
DEFAULT_SESSIONS = 2
MAX_DYNAMIC_LINES = 6
MAX_TASK_LABELS_HISTORY = 12
LOG_RE = re.compile(r"^session-(\d{4})-(\d{2})-(\d{2})-(\d{3})\.md$")
HEADER_RE = re.compile(r"^(#{2,6})\s+(.+?)\s*$")
CHECKBOX_RE = re.compile(r"^- \[[ xX]\]\s+(.*)$")


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


def write_json(path: Path, payload: Any) -> None:
    """Записывает JSON в файл с детерминированным форматированием."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def load_json_list(path: Path) -> list[Any]:
    """Читает JSON-массив; при отсутствии/повреждении возвращает пустой список."""
    if not path.exists():
        return []
    try:
        data = json.loads(read_text(path))
    except (OSError, json.JSONDecodeError):
        return []
    return data if isinstance(data, list) else []


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
    строка с числом опущенных строк и ссылкой на исходный лог. Пустые строки
    между пунктами не сохраняются, чтобы не раздувать ядро пробелами.
    """
    meaningful = [
        sanitize_excerpt_line(line)
        for line in trim_blank_edges(lines)
        if line.strip()
    ]
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


def extract_task_labels(digests: list[SessionDigest]) -> list[str]:
    """Извлекает короткие заголовки задач/гипотез из конспектов текущего сна.

    Берутся только маркированные checkbox-строки из раздела «Задачи», чтобы не
    подхватывать промежуточные пояснения, служебные строки и цитаты. Из каждой
    строки извлекается короткий заголовок вида «Г1: Автоматическое сравнение...»,
    обрезанный до первого разделителя длинного описания или до лимита длины.
    """
    labels: list[str] = []
    seen: set[str] = set()
    for digest in digests:
        for raw in digest.tasks.splitlines():
            line = raw.strip()
            checkbox = CHECKBOX_RE.match(line)
            if not checkbox:
                continue
            content = checkbox.group(1).strip()
            # В логах код задачи обычно выделен жирным: «- [ ] **Г1:** Суть ...».
            # Снимаем выделение кода и берём полный текст для дальнейшего сжатия.
            label = re.sub(r"^\*{1,2}(Г\d+)\s*[:：—–-]?\*{1,2}\s*[:：—–-]?\s*", r"\1: ", content)
            label = label.strip("*_").strip()

            # Если после кода «Г1:» идёт длинное описание, обрезаем до первого разделителя.
            code_match = re.match(r"^(Г\d+)\s*[:：—–-]\s*(.+)$", label)
            if code_match:
                code = code_match.group(1)
                after = code_match.group(2).strip()
                short = re.split(r"\s[;；:：—–(]| \(| — ", after, maxsplit=1)[0].strip()
                label = f"{code}: {short}" if short else code
            label = label.strip("*` «»\"'—:–- ").strip()
            if not label or label.startswith("…") or "_Раздел не найден" in label:
                continue
            label = re.sub(r"\s+", " ", label)
            if len(label) > 56:
                label = label[:53].rstrip() + "..."
            key = normalize_title(label)
            if not key or key in seen:
                continue
            seen.add(key)
            labels.append(label)
    return labels[:MAX_TASK_LABELS_HISTORY]


def snapshot_signature(snapshot: dict[str, Any] | None) -> tuple[Any, ...]:
    """Ключевые поля, по которым определяем материальное изменение снимка."""
    if not snapshot:
        return ()
    counts = snapshot.get("counts") or {}
    return (
        snapshot.get("date"),
        snapshot.get("requested_sessions"),
        tuple(sorted((counts or {}).items())),
        tuple(snapshot.get("task_labels") or []),
        tuple(snapshot.get("sources") or []),
    )


def build_snapshot(
    logs: list[Path],
    selected: list[Path],
    digests: list[SessionDigest],
    metrics: dict[str, Any] | None,
    *,
    requested_sessions: int,
    today: str,
) -> dict[str, Any]:
    """Строит компактный digest-снимок для истории снов."""
    counts: dict[str, Any] = {}
    src: dict[str, Any] = {}
    if metrics:
        counts = dict(metrics.get("counts") or {})
        src = dict(metrics.get("src") or {})
    return {
        "date": today,
        "requested_sessions": requested_sessions,
        "logs_total": len(logs),
        "logs_selected": len(selected),
        "sources": [relative(p) for p in selected],
        "counts": {
            "principles": counts.get("principles"),
            "skills": counts.get("skills"),
            "research_files": counts.get("research_files"),
            "logs": counts.get("logs"),
            "lessons": counts.get("lessons"),
            "deadends": counts.get("deadends"),
            "todo_open": counts.get("todo_open"),
            "todo_done": counts.get("todo_done"),
            "admission_pass": counts.get("admission_pass"),
            "admission_fail": counts.get("admission_fail"),
        },
        "src": {
            "files": src.get("files"),
            "lines": src.get("lines"),
            "non_empty_lines": src.get("non_empty_lines"),
        },
        "task_labels": extract_task_labels(digests),
    }


def update_dream_history(history_path: Path, snapshot: dict[str, Any]) -> tuple[dict[str, Any] | None, list[dict[str, Any]]]:
    """Добавляет снимок в историю, если он материально отличается от последнего."""
    history = load_json_list(history_path)
    previous = history[-1] if history else None
    if snapshot_signature(previous) != snapshot_signature(snapshot):
        history.append(snapshot)
        write_json(history_path, history)
    elif not history:
        history.append(snapshot)
        write_json(history_path, history)
    return previous, history


def format_count_delta(key: str, prev: int | None, now: int | None) -> str | None:
    """Форматирует одну строку дельты счётчика."""
    if now is None:
        return None
    if prev is None or prev == now:
        return None
    diff = now - prev
    sign = "+" if diff > 0 else ""
    return f"{key}: {prev} → {now} ({sign}{diff})"


def format_dynamics_block(
    previous: dict[str, Any] | None,
    snapshot: dict[str, Any],
    history: list[dict[str, Any]],
) -> str:
    """Форматирует короткий блок динамики траектории для markdown-сна."""
    lines: list[str] = []
    if not history:
        return "- _История снимков пуста._"

    if previous is None:
        lines.append(f"- История снов: начата, снимков {len(history)} (первый прогон).")
    else:
        prev_counts = previous.get("counts") or {}
        now_counts = snapshot.get("counts") or {}
        metric_labels = {
            "principles": "принципы",
            "skills": "скиллы",
            "research_files": "исследования",
            "logs": "логи",
            "lessons": "уроки",
            "deadends": "тупики",
            "todo_open": "TODO открыто",
            "todo_done": "TODO закрыто",
            "admission_pass": "допуск PASS",
            "admission_fail": "допуск FAIL",
        }
        delta_lines: list[str] = []
        for key, label in metric_labels.items():
            line = format_count_delta(label, prev_counts.get(key), now_counts.get(key))
            if line:
                delta_lines.append(line)
        if delta_lines:
            for line in delta_lines[:MAX_DYNAMIC_LINES]:
                lines.append(f"- {line}.")
        else:
            lines.append("- Счётчики не изменились относительно предыдущего снимка.")

    prev_tasks = set(normalize_title(x) for x in (previous or {}).get("task_labels") or [])
    now_tasks = snapshot.get("task_labels") or []
    new_tasks = [label for label in now_tasks if normalize_title(label) not in prev_tasks]
    if new_tasks:
        preview = "; ".join(new_tasks[:2])
        more = len(new_tasks) - 2
        if more > 0:
            preview += f"; и ещё {more}"
        lines.append(f"- Темы текущего сна: {preview}.")
    return "\n".join(lines) if lines else "- _Динамика без видимых изменений._"


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
            max_lines=4,
        ),
        outcomes=compact_markdown(
            choose_heading_block(text, "Итоги сессии", "Итоги"),
            source=path,
            max_lines=4,
        ),
        verdicts=compact_markdown(
            choose_heading_block(text, "Вердикты по гипотезам"),
            source=path,
            max_lines=4,
        ),
        final_status=compact_markdown(
            choose_heading_block(text, "Статус на конец"),
            source=path,
            max_lines=3,
        ),
        surprises=compact_markdown(
            choose_heading_block(
                text,
                "Тупики и неожиданности",
                "Неожиданности",
                "Дополнение после финального прогона сна",
            ),
            source=path,
            max_lines=2,
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


def collect_self_model_history() -> dict[str, Any] | None:
    """Пытается получить историю снимков self-модели из src/self_model.py."""
    try:
        sys.path.insert(0, str(REPO_ROOT / "src"))
        import self_model  # type: ignore

        return self_model.history()
    except Exception:
        return None


def format_self_model_line(history_info: dict[str, Any] | None) -> str:
    """Форматирует строку состояния/динамики self-модели для сна."""
    if history_info is None or not history_info.get("entries"):
        return "- Self-модель: _история снимков пуста или недоступна._"

    entries = history_info["entries"]
    last_date = history_info.get("last_date") or "неизвестно"
    if len(entries) == 1:
        return f"- Self-модель: снимок от {last_date}, начальная запись (история изменений накапливается)."

    delta = history_info.get("delta") or []
    if not delta:
        return f"- Self-модель: {len(entries)} снимков, последний от {last_date} (без изменений к предыдущему)."

    labels_map: dict[str, str] = {}
    try:
        sys.path.insert(0, str(REPO_ROOT / "src"))
        import self_model  # type: ignore

        labels_map = dict(self_model.DIMENSIONS)
    except Exception:
        pass

    parts = []
    for key, prev, now in delta[:4]:
        label = labels_map.get(key, key)
        parts.append(f"{label}: {prev} → {now}")
    if len(delta) > 4:
        parts.append(f"и ещё {len(delta) - 4} изм.")

    changes_str = "; ".join(parts)
    return f"- Self-модель ({len(entries)} снимков, от {last_date}): {changes_str}."


def format_metrics(metrics: dict[str, Any] | None, history_info: dict[str, Any] | None = None) -> str:
    """Форматирует короткий блок метрик для сна."""
    if metrics is None:
        return "_Метрики недоступны: `src/metrics.py` не удалось импортировать или выполнить._"

    counts = metrics["counts"]
    src = metrics["src"]
    git = metrics["git"]
    self_line = format_self_model_line(history_info)
    return "\n".join(
        [
            f"- Git: ветка `{git['branch']}` (коммит и dirty-статус не фиксируются во сне, чтобы избежать самоссылочной устарелости).",
            f"- Принципов: {counts['principles']}; скиллов: {counts['skills']}; исследований: {counts['research_files']}.",
            f"- Логов: {counts['logs']}; уроков: {counts['lessons']}; тупиков: {counts['deadends']}.",
            f"- TODO открыто/закрыто: {counts['todo_open']} / {counts['todo_done']}.",
            f"- Capability admission PASS/FAIL: {counts['admission_pass']} / {counts['admission_fail']}.",
            f"- `src/`: Python-файлов {src['files']}, строк {src['lines']} (непустых {src['non_empty_lines']}).",
            self_line,
        ]
    )


def build_dream(
    logs: list[Path],
    *,
    requested_sessions: int,
    include_metrics: bool,
    history_path: Path = DEFAULT_HISTORY,
) -> str:
    """Строит полный markdown-файл сна и побочно обновляет историю снимков."""
    selected = logs[-requested_sessions:] if requested_sessions > 0 else []
    digests = [digest_one_log(path) for path in selected]
    metrics = collect_metrics() if include_metrics else None
    history_info = collect_self_model_history() if include_metrics else None
    metrics_block = format_metrics(metrics, history_info)
    today = date.today().isoformat()

    snapshot = build_snapshot(
        logs,
        selected,
        digests,
        metrics,
        requested_sessions=requested_sessions,
        today=today,
    )
    previous, history = update_dream_history(history_path, snapshot)
    dynamics_block = format_dynamics_block(previous, snapshot, history)

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
        f"- История digest-снимков: `{relative(history_path)}` (снимков: {len(history)}; вне bounded core).",
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
            "## Динамика траектории",
            dynamics_block,
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
            "- Динамика снов накапливается в `memory/14-dream-history.json`; поднимай её только при анализе долгой траектории.",
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
        "--history",
        type=Path,
        default=DEFAULT_HISTORY,
        help="куда сохранять историю digest-снимков (по умолчанию: memory/14-dream-history.json)",
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

    history_path = args.history
    if not history_path.is_absolute():
        history_path = REPO_ROOT / history_path

    logs = find_session_logs()
    dream = build_dream(
        logs,
        requested_sessions=args.sessions,
        include_metrics=not args.no_metrics,
        history_path=history_path,
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
        print(f"История снимков: {relative(history_path)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
