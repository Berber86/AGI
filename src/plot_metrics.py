#!/usr/bin/env python3
"""
plot_metrics.py — визуализация метрик прогресса AGI.

Запуск:
    python src/plot_metrics.py
    python src/plot_metrics.py --json
    python src/plot_metrics.py --history-limit 50

Что делает:
1. Берёт свежий снимок из `src/metrics.py` (build_metrics).
2. Накапливает историю снимков в `memory/09-metrics-history.json`
   (только counts, без конспектов; история не входит в bounded core).
3. Печатает дельту к предыдущему снимку.
4. Генерирует автономный HTML-отчёт `docs/metrics.html` с барами и таблицей
   истории (без внешних зависимостей).

Предостережение (L010): эти числа измеряют структуру и накопление внешней памяти,
а не сознание и не AGI. Оптимизация под красивые числа — регресс, а не рост.
"""

from __future__ import annotations

import argparse
import html
import json
import sys
from datetime import date
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
HISTORY_PATH = REPO_ROOT / "memory" / "09-metrics-history.json"
HTML_PATH = REPO_ROOT / "docs" / "metrics.html"
DEFAULT_HISTORY_LIMIT = 50

# Метрики для баров: (ключ в counts, русская подпись)
BAR_METRICS: list[tuple[str, str]] = [
    ("principles", "Принципов"),
    ("skills", "Скиллов"),
    ("research_files", "Исследований"),
    ("logs", "Логов сессий"),
    ("lessons", "Уроков"),
    ("todo_open", "TODO открыто"),
    ("todo_done", "TODO завершено"),
    ("skill_use_events", "Применений скиллов"),
    ("admission_pass", "Admission PASS"),
]

METRIC_LABELS: dict[str, str] = dict(BAR_METRICS)


def read_history(path: Path | None = None) -> list[dict[str, Any]]:
    """Читает историю снимков; при отсутствии/повреждении возвращает []."""
    path = path or HISTORY_PATH
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (ValueError, OSError):
        return []
    if not isinstance(data, list):
        return []
    return [item for item in data if isinstance(item, dict)]


def write_history(history: list[dict[str, Any]], path: Path | None = None) -> None:
    """Записывает историю снимков (JSON, utf-8)."""
    path = path or HISTORY_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(history, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def snapshot_payload(metrics: dict[str, Any]) -> dict[str, Any]:
    """Компактный снимок: дата, коммит, counts и ключевые объёмы."""
    src = metrics["src"]
    return {
        "date": metrics["snapshot_date"],
        "commit": metrics["git"]["commit"],
        "counts": dict(metrics["counts"]),
        "src_lines": src["lines"],
        "markdown_bytes": metrics["sizes"]["markdown_bytes_total"],
    }


def append_snapshot(
    history: list[dict[str, Any]],
    metrics: dict[str, Any],
    limit: int = DEFAULT_HISTORY_LIMIT,
) -> tuple[list[dict[str, Any]], bool]:
    """Добавляет снимок, если он отличается от последнего; обрезает историю до лимита."""
    payload = snapshot_payload(metrics)
    if history and history[-1] == payload:
        return history, False
    history = history + [payload]
    if len(history) > limit:
        history = history[-limit:]
    return history, True


def compute_delta(
    prev_counts: dict[str, Any], cur_counts: dict[str, Any]
) -> dict[str, int]:
    """Разница counts между двумя снимками (только по известным метрикам)."""
    delta: dict[str, int] = {}
    for key in METRIC_LABELS:
        before = prev_counts.get(key, 0)
        after = cur_counts.get(key, 0)
        if isinstance(before, int) and isinstance(after, int) and after != before:
            delta[key] = after - before
    return delta


def render_html(
    metrics: dict[str, Any],
    history: list[dict[str, Any]],
    delta: dict[str, int],
) -> str:
    """Строит автономный HTML-отчёт (inline CSS, без внешних зависимостей)."""
    counts = metrics["counts"]
    git = metrics["git"]
    src = metrics["src"]

    # Ширина баров нормируется на максимум значений.
    max_value = max((counts.get(key, 0) for key, _ in BAR_METRICS), default=1) or 1
    bars = []
    for key, label in BAR_METRICS:
        value = counts.get(key, 0)
        width = max(2.0, value * 100.0 / max_value)
        bars.append(
            f'<div class="row"><span class="label">{html.escape(label)}</span>'
            f'<div class="track"><div class="bar" style="width:{width:.1f}%"></div></div>'
            f'<span class="value">{value}</span></div>'
        )

    delta_lines = []
    for key, diff in sorted(delta.items(), key=lambda kv: -abs(kv[1])):
        sign = "+" if diff > 0 else ""
        delta_lines.append(f"<li>{html.escape(METRIC_LABELS.get(key, key))}: {sign}{diff}</li>")
    delta_html = (
        "<ul>" + "".join(delta_lines) + "</ul>" if delta_lines else "<p>Изменений нет.</p>"
    )

    history_rows = []
    for snap in history[-10:][::-1]:
        c = snap["counts"]
        history_rows.append(
            "<tr>"
            f"<td>{html.escape(snap['date'])}</td>"
            f"<td>{html.escape(snap['commit'])}</td>"
            f"<td>{c.get('principles', 0)}</td>"
            f"<td>{c.get('logs', 0)}</td>"
            f"<td>{c.get('lessons', 0)}</td>"
            f"<td>{c.get('todo_open', 0)}/{c.get('todo_done', 0)}</td>"
            f"<td>{c.get('skill_use_events', 0)}</td>"
            f"<td>{c.get('admission_pass', 0)}</td>"
            "</tr>"
        )
    history_html = "".join(history_rows) if history_rows else "<tr><td colspan='8'>—</td></tr>"

    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Метрики прогресса AGI</title>
<style>
  body {{ font-family: system-ui, sans-serif; margin: 2rem auto; max-width: 900px;
         color: #222; background: #fafafa; }}
  h1 {{ font-size: 1.5rem; }} h2 {{ font-size: 1.15rem; margin-top: 2rem; }}
  .row {{ display: flex; align-items: center; gap: .75rem; margin: .35rem 0; }}
  .label {{ width: 12rem; text-align: right; font-size: .9rem; }}
  .track {{ flex: 1; background: #e8e8e8; border-radius: 4px; height: 18px; }}
  .bar {{ background: #3a7bd5; height: 18px; border-radius: 4px; min-width: 2px; }}
  .value {{ width: 3.5rem; font-weight: 600; }}
  table {{ border-collapse: collapse; width: 100%; font-size: .85rem; }}
  td, th {{ border: 1px solid #ccc; padding: .3rem .5rem; text-align: left; }}
  th {{ background: #eee; }}
  .warn {{ background: #fff3cd; border: 1px solid #e0c060; padding: .75rem; border-radius: 6px; }}
</style>
</head>
<body>
<h1>Метрики прогресса AGI</h1>
<p>Снимок: {html.escape(metrics['snapshot_date'])} · ветка {html.escape(git['branch'])} ·
   коммит {html.escape(git['commit'])} · src: {src['lines']} строк</p>

<h2>Структурные счётчики</h2>
{"".join(bars)}

<h2>Дельта к предыдущему снимку</h2>
{delta_html}

<h2>История снимков (последние 10)</h2>
<table>
<tr><th>Дата</th><th>Коммит</th><th>Принципы</th><th>Логи</th><th>Уроки</th>
    <th>TODO откр/закр</th><th>Применения</th><th>PASS</th></tr>
{history_html}
</table>

<div class="warn"><b>Предостережение:</b> эти числа измеряют структуру и накопление внешней
памяти, а не сознание и не AGI. Оптимизация под красивые числа — регресс, а не рост (L010).</div>
</body>
</html>
"""


def print_delta(delta: dict[str, int]) -> None:
    """Печатает дельту к предыдущему снимку."""
    if not delta:
        print("Дельта к предыдущему снимку: изменений нет.")
        return
    parts = []
    for key, diff in sorted(delta.items(), key=lambda kv: -abs(kv[1])):
        sign = "+" if diff > 0 else ""
        parts.append(f"{METRIC_LABELS.get(key, key)} {sign}{diff}")
    print("Дельта к предыдущему снимку: " + ", ".join(parts) + ".")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Визуализация метрик прогресса AGI.")
    parser.add_argument("--json", action="store_true", help="вывести свежий снимок как JSON")
    parser.add_argument(
        "--history-limit",
        type=int,
        default=DEFAULT_HISTORY_LIMIT,
        help="максимум хранимых снимков истории",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    sys.path.insert(0, str(REPO_ROOT / "src"))
    import metrics  # type: ignore

    snapshot = metrics.build_metrics()

    history = read_history()
    history, added = append_snapshot(history, snapshot, args.history_limit)
    if added:
        write_history(history)

    prev_counts = history[-2]["counts"] if len(history) >= 2 else {}
    delta = compute_delta(prev_counts, snapshot["counts"])

    if args.json:
        print(json.dumps(snapshot, ensure_ascii=False, indent=2))
    else:
        print(f"Снимок: {snapshot['snapshot_date']}, коммит {snapshot['git']['commit']}")
        print(f"История снимков: {len(history)} (файл: {HISTORY_PATH.relative_to(REPO_ROOT)})")
        print_delta(delta)
        print(f"HTML-отчёт: {HTML_PATH.relative_to(REPO_ROOT)}")

    HTML_PATH.parent.mkdir(parents=True, exist_ok=True)
    HTML_PATH.write_text(render_html(snapshot, history, delta), encoding="utf-8")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except BrokenPipeError:
        raise SystemExit(1)
