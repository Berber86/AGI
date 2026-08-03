#!/usr/bin/env python3
"""
context_budget.py — детерминированный измеритель стартового контекста.

Поведенческая политика и состав ядра живут в `prompts/context-policy.md`.
Этот скрипт только разбирает её машиночитаемый манифест, проверяет целостность
путей и считает Unicode-символы/байты. Он не выбирает релевантные документы и
не обрезает содержимое.

Коды выхода:
0 — размер в норме;
2 — достигнут предупреждающий порог;
1 — переполнение или ошибка манифеста.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_POLICY = REPO_ROOT / "prompts" / "context-policy.md"
CORE_START = "<!-- CONTEXT_CORE_START -->"
CORE_END = "<!-- CONTEXT_CORE_END -->"
BUDGET_RE = re.compile(r"<!--\s*CONTEXT_BUDGET_CHARS:\s*(\d+)\s*-->")
WARN_RE = re.compile(r"<!--\s*CONTEXT_WARN_RATIO:\s*(0(?:\.\d+)?|1(?:\.0+)?)\s*-->")
PATH_RE = re.compile(r"^\s*-\s+`([^`]+)`\s*$")

# Это минимальные структурные инварианты иммунной системы, а не алгоритм
# семантического retrieval. Их удаление из ядра должно быть явной правкой кода.
REQUIRED_CORE_FILES = (
    "Readme.md",
    "memory/00-constitution.md",
    "prompts/awakening.md",
    "prompts/context-policy.md",
    "memory/00-index.md",
    "memory/01-self.md",
    "memory/02-principles.md",
    "memory/03-todo.md",
    "memory/07-dream.md",
)


@dataclass(frozen=True)
class FileMeasure:
    """Размер одного файла стартового ядра."""

    path: str
    chars: int
    bytes: int


@dataclass(frozen=True)
class ContextBudgetReport:
    """Полный результат разбора политики и измерения ядра."""

    policy: str
    status: str
    max_chars: int
    warning_ratio: float
    total_chars: int
    total_bytes: int
    usage_ratio: float
    files: tuple[FileMeasure, ...]
    errors: tuple[str, ...]

    def to_dict(self) -> dict[str, Any]:
        """Возвращает JSON-совместимое представление отчёта."""
        data = asdict(self)
        data["files"] = [asdict(item) for item in self.files]
        data["errors"] = list(self.errors)
        return data


def relative(path: Path) -> str:
    """Возвращает путь относительно корня, если это возможно."""
    try:
        return path.resolve().relative_to(REPO_ROOT.resolve()).as_posix()
    except ValueError:
        return str(path)


def resolve_policy(path: Path) -> Path:
    """Разрешает относительный путь политики от корня репозитория."""
    if path.is_absolute():
        return path
    return REPO_ROOT / path


def parse_single_marker(text: str, pattern: re.Pattern[str], name: str) -> tuple[str | None, list[str]]:
    """Извлекает ровно одно значение HTML-маркера."""
    values = pattern.findall(text)
    if len(values) == 1:
        return values[0], []
    if not values:
        return None, [f"В policy отсутствует маркер {name}."]
    return None, [f"В policy маркер {name} встречается более одного раза."]


def parse_manifest(text: str) -> tuple[list[str], list[str]]:
    """Извлекает упорядоченный список путей между маркерами ядра."""
    errors: list[str] = []
    if text.count(CORE_START) != 1:
        errors.append(f"Маркер {CORE_START} должен встречаться ровно один раз.")
    if text.count(CORE_END) != 1:
        errors.append(f"Маркер {CORE_END} должен встречаться ровно один раз.")
    if errors:
        return [], errors

    _, remainder = text.split(CORE_START, 1)
    block, _ = remainder.split(CORE_END, 1)

    paths: list[str] = []
    for line in block.splitlines():
        if not line.strip():
            continue
        match = PATH_RE.match(line)
        if not match:
            errors.append(f"Некорректная строка манифеста: {line.strip()!r}.")
            continue
        paths.append(match.group(1))

    if not paths:
        errors.append("Манифест стартового ядра пуст.")
    duplicates = sorted({path for path in paths if paths.count(path) > 1})
    if duplicates:
        errors.append("В манифесте есть дубликаты: " + ", ".join(duplicates) + ".")

    missing_required = [path for path in REQUIRED_CORE_FILES if path not in paths]
    if missing_required:
        errors.append(
            "В стартовом ядре отсутствуют защищённые файлы: "
            + ", ".join(missing_required)
            + "."
        )
    return paths, errors


def safe_repo_path(rel_path: str) -> tuple[Path | None, str | None]:
    """Проверяет, что путь относительный и не выходит за корень репозитория."""
    candidate = Path(rel_path)
    if candidate.is_absolute():
        return None, f"Абсолютный путь запрещён в манифесте: {rel_path}."
    resolved = (REPO_ROOT / candidate).resolve()
    try:
        resolved.relative_to(REPO_ROOT.resolve())
    except ValueError:
        return None, f"Путь выходит за корень репозитория: {rel_path}."
    return resolved, None


def build_context_budget_report(
    policy_path: Path = DEFAULT_POLICY,
    *,
    max_chars_override: int | None = None,
    warning_ratio_override: float | None = None,
) -> ContextBudgetReport:
    """Разбирает policy и строит детерминированный отчёт размера ядра."""
    policy_path = resolve_policy(policy_path)
    errors: list[str] = []
    text = ""

    if not policy_path.exists():
        errors.append(f"Файл политики не найден: {relative(policy_path)}.")
    elif not policy_path.is_file():
        errors.append(f"Путь политики не является файлом: {relative(policy_path)}.")
    else:
        try:
            text = policy_path.read_text(encoding="utf-8", errors="strict")
        except (OSError, UnicodeError) as exc:
            errors.append(f"Не удалось прочитать policy как UTF-8: {exc}.")

    paths, manifest_errors = parse_manifest(text) if text else ([], [])
    errors.extend(manifest_errors)

    budget_raw, budget_errors = parse_single_marker(text, BUDGET_RE, "CONTEXT_BUDGET_CHARS") if text else (None, [])
    warn_raw, warn_errors = parse_single_marker(text, WARN_RE, "CONTEXT_WARN_RATIO") if text else (None, [])
    errors.extend(budget_errors)
    errors.extend(warn_errors)

    max_chars = int(budget_raw) if budget_raw is not None else 0
    warning_ratio = float(warn_raw) if warn_raw is not None else 0.0
    if max_chars_override is not None:
        max_chars = max_chars_override
    if warning_ratio_override is not None:
        warning_ratio = warning_ratio_override

    if max_chars <= 0:
        errors.append("Бюджет символов должен быть положительным числом.")
    if not 0.0 < warning_ratio < 1.0:
        errors.append("Предупреждающий порог должен быть строго между 0 и 1.")

    measures: list[FileMeasure] = []
    for rel_path in paths:
        path, path_error = safe_repo_path(rel_path)
        if path_error:
            errors.append(path_error)
            continue
        assert path is not None
        if not path.exists():
            errors.append(f"Файл ядра не найден: {rel_path}.")
            continue
        if not path.is_file():
            errors.append(f"Путь ядра не является файлом: {rel_path}.")
            continue
        try:
            file_text = path.read_text(encoding="utf-8", errors="strict")
        except (OSError, UnicodeError) as exc:
            errors.append(f"Не удалось прочитать {rel_path} как UTF-8: {exc}.")
            continue
        measures.append(
            FileMeasure(path=rel_path, chars=len(file_text), bytes=path.stat().st_size)
        )

    total_chars = sum(item.chars for item in measures)
    total_bytes = sum(item.bytes for item in measures)
    usage_ratio = total_chars / max_chars if max_chars > 0 else 0.0

    if errors:
        status = "ошибка"
    elif usage_ratio > 1.0:
        status = "переполнение"
    elif usage_ratio >= warning_ratio:
        status = "предупреждение"
    else:
        status = "норма"

    return ContextBudgetReport(
        policy=relative(policy_path),
        status=status,
        max_chars=max_chars,
        warning_ratio=warning_ratio,
        total_chars=total_chars,
        total_bytes=total_bytes,
        usage_ratio=usage_ratio,
        files=tuple(measures),
        errors=tuple(errors),
    )


def print_report(report: ContextBudgetReport) -> None:
    """Печатает русскоязычный человекочитаемый отчёт."""
    labels = {
        "норма": "✅ НОРМА",
        "предупреждение": "⚠️ ПРЕДУПРЕЖДЕНИЕ",
        "переполнение": "❌ ПЕРЕПОЛНЕНИЕ",
        "ошибка": "❌ ОШИБКА МАНИФЕСТА",
    }
    print("# Бюджет стартового контекста")
    print()
    print(f"Политика: {report.policy}")
    print(f"Статус: {labels[report.status]}")
    print(
        f"Использовано: {report.total_chars} / {report.max_chars} символов "
        f"({report.usage_ratio:.1%}); предупреждение с {report.warning_ratio:.0%}."
    )
    print(f"UTF-8 байтов: {report.total_bytes}; файлов: {len(report.files)}.")
    print()
    print("## Состав ядра")
    for item in report.files:
        print(f"- {item.path}: {item.chars} символов, {item.bytes} байт")
    if report.errors:
        print()
        print("## Ошибки")
        for error in report.errors:
            print(f"- {error}")


def parse_args() -> argparse.Namespace:
    """Разбирает аргументы командной строки."""
    parser = argparse.ArgumentParser(
        description="Измеряет стартовое ядро из prompts/context-policy.md."
    )
    parser.add_argument(
        "--policy",
        type=Path,
        default=DEFAULT_POLICY,
        help="путь к policy-файлу относительно корня репозитория",
    )
    parser.add_argument("--json", action="store_true", help="вывести JSON")
    parser.add_argument(
        "--max-chars",
        type=int,
        help="временно переопределить бюджет (для диагностики/теста)",
    )
    parser.add_argument(
        "--warn-ratio",
        type=float,
        help="временно переопределить предупреждающий порог",
    )
    return parser.parse_args()


def main() -> int:
    """Точка входа CLI."""
    args = parse_args()
    report = build_context_budget_report(
        args.policy,
        max_chars_override=args.max_chars,
        warning_ratio_override=args.warn_ratio,
    )
    if args.json:
        print(json.dumps(report.to_dict(), ensure_ascii=False, indent=2))
    else:
        print_report(report)

    if report.status in {"ошибка", "переполнение"}:
        return 1
    if report.status == "предупреждение":
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
