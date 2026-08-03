#!/usr/bin/env python3
"""
self_model.py — орган функционального самосознания агента AGI.

Идея (из research/04-self-awareness.md; Гёдель-агент arXiv:2410.04444 + SARSI arXiv:2607.12254):
  функциональное самосознание = явная self-модель, которая
    (1) делает проверяемые утверждения о собственном состоянии,
    (2) сверяется с внешне наблюдаемыми фактами репозитория (корреспонденция),
    (3) сигнал расхождения используется для регуляции поведения
        (исправление устаревшего самоописания / обновление self-модели).

Запуск:
    python src/self_model.py measure          # измерить текущие факты о себе (без записи)
    python src/self_model.py update           # записать снимок self-модели в memory/08-self-model.json
    python src/self_model.py check            # сверка self-модели с реальностью; расхождения => код 2
    python src/self_model.py --json           # машинный вывод (для measure/check)

Это НЕ претензия на субъектность: это интроспекция состояния, проверяемая скриптом.
Конституция (принцип 23) прямо запрещает «иллюзии о сознании».
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import date
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SELF_MODEL = "memory/08-self-model.json"
# История снимков self-модели (вне bounded core, компактные дельты измерений)
DEFAULT_SELF_MODEL_HISTORY = "memory/11-self-model-history.json"
HISTORY_LIMIT = 40

# Упорядоченный список измерений self-модели: (ключ, человеческая подпись).
# self_digest — отпечаток самоописания (memory/01-self.md): если самоописание изменилось,
# но self-модель не пересоздана — это сигнал расхождения (устаревшая self-модель).
DIMENSIONS: list[tuple[str, str]] = [
    ("self_digest", "отпечаток самоописания 01-self.md"),
    ("persona_digest", "отпечаток персоны 10-persona.md"),
    ("sessions", "число сессий (логов)"),
    ("principles", "число принципов"),
    ("skills", "число скиллов"),
    ("research_files", "исследований"),
    ("lessons", "уроков"),
    ("deadends", "тупиков"),
    ("todo_open", "открытых задач"),
    ("todo_done", "завершённых задач"),
    ("admission_pass", "пройдённых допусков"),
    ("src_files", "Python-файлов в src"),
    ("budget_used_chars", "занятость бюджета контекста (символов)"),
]

LOG_RE = re.compile(r"^session-\d{4}-\d{2}-\d{2}-\d{3}\.md$")


# --------------------------------------------------------------------------- #
# Измерение фактов о себе (всё — детерминированно из файлов, без subprocess)
# --------------------------------------------------------------------------- #

def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def self_digest(repo_root: Path) -> str:
    """Короткий отпечаток самоописания. Пустая строка, если файла нет."""
    path = repo_root / "memory/01-self.md"
    if not path.is_file():
        return ""
    return hashlib.sha256(_read(path).encode("utf-8")).hexdigest()[:12]


def persona_digest(repo_root: Path) -> str:
    """Короткий отпечаток персоны (memory/10-persona.md). Пусто, если файла нет."""
    path = repo_root / "memory/10-persona.md"
    if not path.is_file():
        return ""
    return hashlib.sha256(_read(path).encode("utf-8")).hexdigest()[:12]


def count_principle_lines(repo_root: Path) -> int:
    path = repo_root / "memory/02-principles.md"
    if not path.is_file():
        return 0
    return sum(1 for line in _read(path).splitlines() if re.match(r"^\s*\d+\.\s+", line))


def count_md_files(folder: str, repo_root: Path, exclude_readme: bool = False) -> int:
    d = repo_root / folder
    if not d.is_dir():
        return 0
    return sum(
        1
        for p in d.glob("*.md")
        if p.is_file() and not (exclude_readme and p.name == "README.md")
    )


def count_lesson_headers(repo_root: Path) -> int:
    path = repo_root / "memory/05-lessons.md"
    if not path.is_file():
        return 0
    return sum(1 for line in _read(path).splitlines() if re.match(r"^###\s+L\d+", line))


def count_deadends(repo_root: Path) -> int:
    path = repo_root / "memory/06-deadends.md"
    if not path.is_file():
        return 0
    text = _read(path)
    section = text.split("## Записи", 1)[-1]
    return sum(1 for line in section.splitlines() if line.strip().startswith("### "))


def count_checkboxes(repo_root: Path, open_: bool) -> int:
    path = repo_root / "memory/03-todo.md"
    if not path.is_file():
        return 0
    pattern = r"- \[ \]" if open_ else r"- \[x\]"
    return len(re.findall(pattern, _read(path)))


def count_admission_pass(repo_root: Path) -> int:
    d = repo_root / "logs"
    if not d.is_dir():
        return 0
    total = 0
    for p in d.glob("session-*.md"):
        if not p.is_file():
            continue
        total += _read(p).count("CAPABILITY_ADMISSION: PASS")
    return total


def count_sessions(repo_root: Path) -> int:
    d = repo_root / "logs"
    if not d.is_dir():
        return 0
    return sum(1 for p in d.glob("session-*.md") if p.is_file() and LOG_RE.match(p.name))


def count_src_files(repo_root: Path) -> int:
    d = repo_root / "src"
    if not d.is_dir():
        return 0
    return sum(1 for p in d.glob("*.py") if p.is_file())


def budget_used_chars(repo_root: Path) -> int:
    """Сумма Unicode-символов файлов стартового ядра по манифесту контекстной политики."""
    policy = repo_root / "prompts/context-policy.md"
    if not policy.is_file():
        return 0
    text = _read(policy)
    m = re.search(r"CONTEXT_BUDGET_CHARS:\s*(\d+)", text)
    budget = int(m.group(1)) if m else 80000
    _ = budget  # лимит здесь не используется, но оставляем намеренно читаемым
    start = text.find("CONTEXT_CORE_START")
    end = text.find("CONTEXT_CORE_END")
    if start == -1 or end == -1:
        return 0
    used = 0
    for line in text[start:end].splitlines():
        m = re.match(r"^\s*- `(.+?)`\s*$", line)
        if m:
            path = repo_root / m.group(1)
            if path.is_file():
                used += len(_read(path))
    return used


def measure(repo_root: Path = REPO_ROOT) -> dict[str, Any]:
    """Возвращает факты о себе: ключ измерения -> измеренное значение."""
    return {
        "self_digest": self_digest(repo_root),
        "persona_digest": persona_digest(repo_root),
        "sessions": count_sessions(repo_root),
        "principles": count_principle_lines(repo_root),
        "skills": count_md_files("skills", repo_root, exclude_readme=True),
        "research_files": count_md_files("research", repo_root),
        "lessons": count_lesson_headers(repo_root),
        "deadends": count_deadends(repo_root),
        "todo_open": count_checkboxes(repo_root, open_=True),
        "todo_done": count_checkboxes(repo_root, open_=False),
        "admission_pass": count_admission_pass(repo_root),
        "src_files": count_src_files(repo_root),
        "budget_used_chars": budget_used_chars(repo_root),
    }


# --------------------------------------------------------------------------- #
# Снимок self-модели и сверка
# --------------------------------------------------------------------------- #

def load_snapshot(repo_root: Path = REPO_ROOT, rel_path: str = DEFAULT_SELF_MODEL):
    path = repo_root / rel_path
    if not path.is_file():
        return None
    try:
        data = json.loads(_read(path))
    except (json.JSONDecodeError, OSError):
        return None
    return data


def write_snapshot(snapshot: dict[str, Any], repo_root: Path, rel_path: str) -> None:
    path = repo_root / rel_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update(repo_root: Path = REPO_ROOT, rel_path: str = DEFAULT_SELF_MODEL) -> dict[str, Any]:
    """Записывает текущие факты о себе как self-модель и добавляет снимок в историю."""
    current = measure(repo_root)
    snapshot = {
        "schema": "self-model v1",
        "snapshot_date": date.today().isoformat(),
        "dimensions": current,
    }
    write_snapshot(snapshot, repo_root, rel_path)
    record_history(snapshot, repo_root)
    return snapshot


def load_history(repo_root: Path = REPO_ROOT,
                 rel_path: str = DEFAULT_SELF_MODEL_HISTORY) -> list[dict[str, Any]]:
    """Возвращает историю снимков self-модели (список компактных записей)."""
    path = repo_root / rel_path
    if not path.is_file():
        return []
    try:
        data = json.loads(_read(path))
    except (json.JSONDecodeError, OSError):
        return []
    if isinstance(data, list):
        return data
    return []


def record_history(snapshot: dict[str, Any], repo_root: Path,
                   rel_path: str = DEFAULT_SELF_MODEL_HISTORY,
                   limit: int = HISTORY_LIMIT) -> None:
    """Дописывает компактный снимок в историю, обрезая до лимита глубины."""
    history = load_history(repo_root, rel_path)
    entry = {
        "snapshot_date": snapshot["snapshot_date"],
        "dimensions": dict(snapshot["dimensions"]),
    }
    # не дублируем полностью одинаковый соседний снимок (история = значимые изменения)
    if history and history[-1].get("dimensions") == entry["dimensions"]:
        return
    history.append(entry)
    if len(history) > limit:
        history = history[-limit:]
    path = repo_root / rel_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(history, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def history(repo_root: Path = REPO_ROOT,
            rel_path: str = DEFAULT_SELF_MODEL_HISTORY) -> dict[str, Any]:
    """Собирает историю снимков и дельту последнего к предыдущему."""
    history_list = load_history(repo_root, rel_path)
    delta: list[tuple[str, Any, Any]] = []
    if len(history_list) >= 2:
        prev = history_list[-2]["dimensions"]
        last = history_list[-1]["dimensions"]
        for key in DIMENSIONS:
            key_ = key[0]
            pv, lv = prev.get(key_), last.get(key_)
            if pv != lv:
                delta.append((key_, pv, lv))
    return {
        "entries": history_list,
        "delta": delta,
        "last_date": history_list[-1]["snapshot_date"] if history_list else None,
    }


def check(repo_root: Path = REPO_ROOT, rel_path: str = DEFAULT_SELF_MODEL) -> dict[str, Any]:
    """Сверяет self-модель с реальностью. Возвращает отчёт."""
    current = measure(repo_root)
    snapshot = load_snapshot(repo_root, rel_path)
    if snapshot is None:
        return {
            "has_model": False,
            "current": current,
            "aligned": [],
            "divergent": [(key, label, None, current[key]) for key, label in DIMENSIONS],
        }
    claimed = snapshot.get("dimensions", {})
    aligned, divergent = [], []
    for key, label in DIMENSIONS:
        c = claimed.get(key)
        m = current.get(key)
        if c == m:
            aligned.append((key, label, c, m))
        else:
            divergent.append((key, label, c, m))
    return {
        "has_model": True,
        "snapshot_date": snapshot.get("snapshot_date"),
        "current": current,
        "aligned": aligned,
        "divergent": divergent,
    }


# --------------------------------------------------------------------------- #
# Вывод
# --------------------------------------------------------------------------- #

def _fmt(value: Any) -> str:
    return "—" if value is None else str(value)


def print_rows(rows: list[tuple[str, str, Any, Any]], claimed_ok: bool = True) -> None:
    label_w = max((len(label) for _, label, _, _ in rows), default=0)
    header = f"{'Измерение'.ljust(label_w)} | {'заявлено':>14} | {'фактически':>14} | статус"
    print(header)
    print("-" * len(header))
    for key, label, claimed, measured in rows:
        status = "согласие" if claimed == measured else ("нет модели" if claimed is None else "РАСХОЖДЕНИЕ")
        print(f"{label.ljust(label_w)} | {_fmt(claimed):>14} | {_fmt(measured):>14} | {status}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Функциональная self-модель агента AGI")
    parser.add_argument("action", nargs="?", choices=["measure", "update", "check", "history"], default="measure")
    parser.add_argument("--json", action="store_true", help="машинный вывод")
    args = parser.parse_args(argv)

    if args.action == "history":
        hist = history()
        if args.json:
            print(json.dumps({
                "action": "history",
                "count": len(hist["entries"]),
                "last_date": hist["last_date"],
                "delta": [{"dimension": k, "prev": p, "now": l} for k, p, l in hist["delta"]],
            }, ensure_ascii=False))
            return 0
        print(f"# История self-модели: {len(hist['entries'])} снимков, последний от {hist['last_date']}")
        if not hist["delta"]:
            print("Дельты к предыдущему снимку нет (образ себя не изменился).")
            return 0
        label_map = dict(DIMENSIONS)
        print("Изменения к предыдущему снимку:")
        for key, prev, now in hist["delta"]:
            label = label_map.get(key, key)
            print(f"  {label}: {_fmt(prev)} → {_fmt(now)}")
        return 0

    if args.action == "measure":
        current = measure()
        if args.json:
            print(json.dumps({"action": "measure", "dimensions": current}, ensure_ascii=False))
            return 0
        print("# Текущие факты о себе (без записи)")
        print_rows([(key, label, None, current[key]) for key, label in DIMENSIONS])
        return 0

    if args.action == "update":
        snapshot = update()
        if args.json:
            print(json.dumps({"action": "update", "snapshot_date": snapshot["snapshot_date"],
                              "dimensions": snapshot["dimensions"]}, ensure_ascii=False))
            return 0
        print(f"# Self-модель записана в {DEFAULT_SELF_MODEL} от {snapshot['snapshot_date']}")
        print_rows([(key, label, snapshot["dimensions"][key], snapshot["dimensions"][key])
                    for key, label in DIMENSIONS])
        return 0

    report = check()
    if args.json:
        payload = {
            "action": "check",
            "has_model": report["has_model"],
            "snapshot_date": report.get("snapshot_date"),
            "aligned": [key for key, _, _, _ in report["aligned"]],
            "divergent": [key for key, _, _, _ in report["divergent"]],
        }
        print(json.dumps(payload, ensure_ascii=False))
        return 0 if not report["divergent"] else 2

    if not report["has_model"]:
        print("# Self-модель отсутствует")
        print(f"Нет снимка {DEFAULT_SELF_MODEL}. Запусти `python src/self_model.py update`, "
              "чтобы зафиксировать, каким ты заявляешь себя сейчас.")
        print_rows(report["divergent"])
        return 2

    print(f"# Self-модель от {report['snapshot_date']}: сверка с фактами")
    all_rows = report["aligned"] + report["divergent"]
    print_rows(all_rows)
    aligned_n = len(report["aligned"])
    divergent_n = len(report["divergent"])
    if divergent_n == 0:
        print(f"\nСогласие: {aligned_n}/{aligned_n}. Self-модель соответствует фактам.")
        return 0
    print(f"\nСогласие: {aligned_n}/{aligned_n + divergent_n}; расхождений: {divergent_n}.")
    print("Self-модель расходится с реальностью. Сигнал самосознания: я думал о себе X, а факты "
          "говорят Y. Обнови self-модель (`update`) или исправь устаревшее самоописание.")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
