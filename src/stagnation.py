#!/usr/bin/env python3
"""
stagnation.py — эвристический детектор тупиков и осцилляций в логе сессии.

Запуск:
    python src/stagnation.py
    python src/stagnation.py logs/session-2026-08-03-006.md
    python src/stagnation.py --json
    python src/stagnation.py --strict

Скрипт не понимает смысл сессии глубоко. Он ищет механические признаки:
повтор команд, кластеры ошибок/предупреждений, явные слова «тупик», «застрял»,
«нет прогресса», маркеры отката и повторов. Это внешний сигнал для размышления,
а не автоматический судья качества работы.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_RE = re.compile(r"^session-\d{4}-\d{2}-\d{2}-\d{3}\.md$")
COMMAND_RE = re.compile(r"`((?:python|git|gh|grep|sed|cat|pytest|ruff|mypy|bash|sh)\s+[^`\n]+)`")

EXPLICIT_STUCK_RE = re.compile(
    r"я\s+застрял|я\s+застряла|уп[её]рся|уп[её]рлась|нет прогресса|"
    r"зациклил|зациклился|бесконечн|это\s+тупик|попал\s+в\s+тупик|"
    r"осцилляция\s+обнаружена|тупиковая\s+линия",
    re.IGNORECASE,
)
FAILURE_RE = re.compile(
    r"ошибк|ERROR|WARN|провал|не сработ|не удалось|MISS|предупреждени|сломал|сломалось",
    re.IGNORECASE,
)
REVERSAL_RE = re.compile(
    r"откат|вернул|вернула|снова|опять|повторно|перегенер|туда-обратно|исправил снова",
    re.IGNORECASE,
)
PROGRESS_RE = re.compile(
    r"✅|успешно|готово|создал|создан|добавил|обновил|прош[её]л|зел[её]н|исправил",
    re.IGNORECASE,
)
EXECUTION_CONTEXT_RE = re.compile(
    r"запустил|запускаю|выполнил|проверил|повторно\s+запустил|ERROR|WARN|не удалось",
    re.IGNORECASE,
)
META_CONTEXT_RE = re.compile(
    r"гипотез|предположени|метрика|риск|сигнал|маркер|фраз|детекц|распознать|скрипт|"
    r"повторно использу",
    re.IGNORECASE,
)


@dataclass
class Finding:
    """Одна находка детектора."""

    kind: str
    score: int
    message: str
    lines: list[int] = field(default_factory=list)
    evidence: list[str] = field(default_factory=list)


@dataclass
class Analysis:
    """Итог анализа одного лога."""

    path: Path
    score: int
    risk: str
    findings: list[Finding]
    stats: dict[str, Any]


def latest_log() -> Path | None:
    """Возвращает последний лог сессии по имени."""
    logs_dir = REPO_ROOT / "logs"
    if not logs_dir.exists():
        return None
    logs = sorted(path for path in logs_dir.iterdir() if path.is_file() and LOG_RE.match(path.name))
    if not logs:
        return None
    return logs[-1]


def resolve_log(path_arg: str | None) -> Path:
    """Определяет путь к анализируемому логу."""
    if path_arg is None:
        found = latest_log()
        if found is None:
            raise FileNotFoundError("Не найдено логов в logs/.")
        return found
    path = Path(path_arg)
    if not path.is_absolute():
        path = REPO_ROOT / path
    if not path.exists():
        raise FileNotFoundError(f"Лог не найден: {path}")
    if not path.is_file():
        raise FileNotFoundError(f"Путь не является файлом: {path}")
    return path


def read_lines(path: Path) -> list[str]:
    """Читает файл построчно."""
    return path.read_text(encoding="utf-8", errors="replace").splitlines()


def line_numbers(matches: list[tuple[int, str]]) -> list[int]:
    """Возвращает 1-based номера строк из списка совпадений."""
    return [index + 1 for index, _ in matches]


def sample_evidence(matches: list[tuple[int, str]], limit: int = 3) -> list[str]:
    """Берёт короткие примеры строк для отчёта."""
    evidence: list[str] = []
    for index, line in matches[:limit]:
        stripped = line.strip()
        if len(stripped) > 160:
            stripped = stripped[:157] + "..."
        evidence.append(f"строка {index + 1}: {stripped}")
    return evidence


def is_meta_context(line: str) -> bool:
    """Отсекает строки, где маркер обсуждается как тема, а не как факт зацикливания."""
    return bool(META_CONTEXT_RE.search(line)) or "не зациклился" in line.lower()


def find_explicit_stuck(lines: list[str]) -> Finding | None:
    """Ищет прямые признания тупика/зацикливания."""
    matches = [
        (index, line)
        for index, line in enumerate(lines)
        if EXPLICIT_STUCK_RE.search(line) and not is_meta_context(line)
    ]
    if not matches:
        return None
    score = min(8, 3 + len(matches))
    return Finding(
        kind="explicit_stuck",
        score=score,
        message=f"Найдены явные маркеры тупика/осцилляции: {len(matches)}.",
        lines=line_numbers(matches),
        evidence=sample_evidence(matches),
    )


def find_failure_cluster(lines: list[str], window: int) -> Finding | None:
    """Ищет плотный кластер ошибок/предупреждений в окне строк."""
    markers = [1 if FAILURE_RE.search(line) else 0 for line in lines]
    if not markers:
        return None

    best_count = 0
    best_start = 0
    current = 0
    left = 0
    for right, marker in enumerate(markers):
        current += marker
        while right - left + 1 > window:
            current -= markers[left]
            left += 1
        if current > best_count:
            best_count = current
            best_start = left

    if best_count < 4:
        return None
    score = 3 if best_count < 7 else 5
    evidence_matches = [
        (index, lines[index])
        for index in range(best_start, min(len(lines), best_start + window))
        if FAILURE_RE.search(lines[index])
    ]
    return Finding(
        kind="failure_cluster",
        score=score,
        message=f"В окне {window} строк найден плотный кластер ошибок/предупреждений: {best_count}.",
        lines=line_numbers(evidence_matches),
        evidence=sample_evidence(evidence_matches),
    )


def normalize_command(command: str) -> str:
    """Нормализует команду для подсчёта повторов."""
    command = re.sub(r"\s+", " ", command.strip())
    # Пути к текущему логу считаем одним типом команды, чтобы не плодить варианты.
    command = re.sub(r"logs/session-\d{4}-\d{2}-\d{2}-\d{3}\.md", "logs/session-YYYY-MM-DD-NNN.md", command)
    return command


def find_repeated_commands(lines: list[str]) -> Finding | None:
    """Ищет повтор одной и той же команды."""
    occurrences: dict[str, list[tuple[int, str]]] = defaultdict(list)
    for index, line in enumerate(lines):
        if not EXECUTION_CONTEXT_RE.search(line):
            continue
        for match in COMMAND_RE.finditer(line):
            command = normalize_command(match.group(1))
            occurrences[command].append((index, line))

    repeated = {
        command: matches
        for command, matches in occurrences.items()
        if len(matches) >= 4
    }
    if not repeated:
        return None

    worst_command, worst_matches = max(repeated.items(), key=lambda item: len(item[1]))
    score = 2 if len(worst_matches) < 6 else 4
    return Finding(
        kind="repeated_command",
        score=score,
        message=f"Команда повторяется {len(worst_matches)} раз: `{worst_command}`.",
        lines=line_numbers(worst_matches),
        evidence=sample_evidence(worst_matches),
    )


def has_action_reversal(line: str) -> bool:
    """Проверяет, похож ли маркер повтора/отката на действие, а не на обсуждение темы."""
    if is_meta_context(line):
        return False
    lowered = line.lower()
    if "откат" in lowered or "вернул" in lowered or "вернула" in lowered or "перегенер" in lowered:
        return True
    if REVERSAL_RE.search(line) and re.search(r"запуст|правк|сделал|удалил|добавил|ошиб|ERROR|WARN", line, re.IGNORECASE):
        return True
    return False


def find_reversal_markers(lines: list[str]) -> Finding | None:
    """Ищет маркеры отката/повторного движения."""
    matches = [(index, line) for index, line in enumerate(lines) if has_action_reversal(line)]
    if len(matches) < 3:
        return None
    score = 2 if len(matches) < 6 else 4
    return Finding(
        kind="reversal_markers",
        score=score,
        message=f"Найдены маркеры повторного движения/отката: {len(matches)}.",
        lines=line_numbers(matches),
        evidence=sample_evidence(matches),
    )


def find_unfinished_finished_session(lines: list[str]) -> Finding | None:
    """Проверяет, не закрыта ли сессия с незавершёнными задачами."""
    text = "\n".join(lines)
    if "Сессия завершена" not in text:
        return None
    unchecked = [(index, line) for index, line in enumerate(lines) if "- [ ]" in line]
    if not unchecked:
        return None
    return Finding(
        kind="unfinished_tasks",
        score=3,
        message=f"В закрытой сессии остались незавершённые чекбоксы: {len(unchecked)}.",
        lines=line_numbers(unchecked),
        evidence=sample_evidence(unchecked),
    )


def count_matches(lines: list[str], regex: re.Pattern[str]) -> int:
    """Считает строки, где найден regex."""
    return sum(1 for line in lines if regex.search(line))


def risk_from_score(score: int) -> str:
    """Переводит численный балл в уровень риска."""
    if score >= 8:
        return "высокий"
    if score >= 4:
        return "средний"
    return "низкий"


def analyze(path: Path, *, window: int) -> Analysis:
    """Анализирует лог и возвращает структуру результата."""
    lines = read_lines(path)
    findings: list[Finding] = []
    for detector in (
        find_explicit_stuck,
        lambda current_lines: find_failure_cluster(current_lines, window),
        find_repeated_commands,
        find_reversal_markers,
        find_unfinished_finished_session,
    ):
        finding = detector(lines)
        if finding is not None:
            findings.append(finding)

    score = sum(finding.score for finding in findings)
    stats = {
        "lines": len(lines),
        "failure_lines": count_matches(lines, FAILURE_RE),
        "progress_lines": count_matches(lines, PROGRESS_RE),
        "reversal_lines": sum(1 for line in lines if has_action_reversal(line)),
        "explicit_stuck_lines": sum(
            1 for line in lines if EXPLICIT_STUCK_RE.search(line) and not is_meta_context(line)
        ),
        "commands": sum(len(COMMAND_RE.findall(line)) for line in lines),
    }
    return Analysis(
        path=path,
        score=score,
        risk=risk_from_score(score),
        findings=findings,
        stats=stats,
    )


def relative(path: Path) -> str:
    """Печатает путь относительно корня, если возможно."""
    try:
        return str(path.relative_to(REPO_ROOT))
    except ValueError:
        return str(path)


def recommendation(risk: str) -> str:
    """Даёт рекомендацию по уровню риска."""
    if risk == "высокий":
        return (
            "Остановить текущую линию работы: вызвать триадную проверку, сменить стратегию "
            "или записать тупик в memory/06-deadends.md."
        )
    if risk == "средний":
        return (
            "Сделать паузу перед следующим повтором: применить skills/stagnation-watch.md "
            "и явно выбрать развилку."
        )
    return "Продолжать работу; признаков опасного зацикливания мало."


def print_text_report(analysis: Analysis) -> None:
    """Печатает русскоязычный отчёт."""
    print("# Отчёт детектора тупиков/осцилляций")
    print()
    print(f"Файл: `{relative(analysis.path)}`")
    print(f"Риск: **{analysis.risk}** (балл {analysis.score})")
    print()
    print("## Статистика")
    print(f"- Строк: {analysis.stats['lines']}")
    print(f"- Строк с ошибками/предупреждениями: {analysis.stats['failure_lines']}")
    print(f"- Строк с маркерами прогресса: {analysis.stats['progress_lines']}")
    print(f"- Строк с маркерами повтора/отката: {analysis.stats['reversal_lines']}")
    print(f"- Явных маркеров тупика: {analysis.stats['explicit_stuck_lines']}")
    print(f"- Команд в обратных кавычках: {analysis.stats['commands']}")
    print()
    print("## Находки")
    if not analysis.findings:
        print("- Существенных признаков тупика/осцилляции не найдено.")
    else:
        for finding in analysis.findings:
            print(f"- **{finding.kind}** (+{finding.score}): {finding.message}")
            if finding.evidence:
                for evidence in finding.evidence:
                    print(f"  - {evidence}")
    print()
    print("## Рекомендация")
    print(recommendation(analysis.risk))


def analysis_to_json(analysis: Analysis) -> dict[str, Any]:
    """Готовит JSON-сериализуемый результат."""
    return {
        "path": relative(analysis.path),
        "score": analysis.score,
        "risk": analysis.risk,
        "stats": analysis.stats,
        "findings": [
            {
                "kind": finding.kind,
                "score": finding.score,
                "message": finding.message,
                "lines": finding.lines,
                "evidence": finding.evidence,
            }
            for finding in analysis.findings
        ],
        "recommendation": recommendation(analysis.risk),
    }


def parse_args() -> argparse.Namespace:
    """Разбирает аргументы командной строки."""
    parser = argparse.ArgumentParser(
        description="Эвристически анализирует лог сессии на тупики и осцилляции."
    )
    parser.add_argument(
        "log",
        nargs="?",
        help="путь к логу; если не указан, берётся последний лог из logs/",
    )
    parser.add_argument(
        "--window",
        type=int,
        default=25,
        help="размер окна строк для поиска кластера ошибок (по умолчанию: 25)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="вывести результат как JSON",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="возвращать код 2 при среднем риске и 1 при высоком",
    )
    return parser.parse_args()


def main() -> int:
    """Точка входа."""
    args = parse_args()
    if args.window < 5:
        print("ОШИБКА: --window должен быть не меньше 5.", file=sys.stderr)
        return 1
    try:
        path = resolve_log(args.log)
    except FileNotFoundError as error:
        print(f"ОШИБКА: {error}", file=sys.stderr)
        return 1

    result = analyze(path, window=args.window)
    if args.json:
        print(json.dumps(analysis_to_json(result), ensure_ascii=False, indent=2))
    else:
        print_text_report(result)

    if args.strict:
        if result.risk == "высокий":
            return 1
        if result.risk == "средний":
            return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
