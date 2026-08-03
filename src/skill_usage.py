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

Опциональный маркер исхода (метрика полезности v1, D005):
    Итог скилла `skills/<имя>.md`: успех — <обоснование>
    Итог скилла `skills/<имя>.md`: частично — <обоснование>
    Итог скилла `skills/<имя>.md`: неудача — <обоснование>
Маркер не входит в счёт применений; он агрегируется отдельно как распределение
исходов. Отсутствие исхода у применения — не ошибка, а незаполненное измерение.

Вердикты гипотез (связывание с сессиями применения, сессия #013):
    ### Вердикт по Г1
    - **Сравнение с предположением:** подтвердилась ...
Статус классифицируется по префиксу (подтвердилась/частично/опровергнута).
Для каждого скилла отчёт показывает распределение вердиктов в сессиях, где он
применялся, — корреляционный контекст, а не доказательство причинности.

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
OUTCOME_RE = re.compile(
    r"^\s*(?:[-*]\s+)?Итог\s+скилла\s+`?(skills/[A-Za-z0-9._/-]+\.md)`?\s*[:—-]\s*(успех|частично|неудача)",
    re.IGNORECASE,
)
OUTCOME_STATUSES = ("успех", "частично", "неудача")
PERSONA_OUTCOME_RE = re.compile(
    r"^\s*(?:[-*]\s+)?Итог\s+персоны\s*[:—-]\s*(удержана|отклонение)",
    re.IGNORECASE,
)
PERSONA_OUTCOME_STATUSES = ("удержана", "отклонение")
VERDICT_HEADER_RE = re.compile(
    r"^#{2,6}\s+Вердикт\s+по\s+(Г\d+)", re.IGNORECASE
)
VERDICT_STATUS_RE = re.compile(
    r"^\s*[-*]?\s*\*\*Сравнение\s+с\s+предположением:\*\*\s*(.+?)\s*$",
    re.IGNORECASE,
)
VERDICT_STATUSES = ("подтвердилась", "частично", "опровергнута")


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


@dataclass(frozen=True)
class SkillOutcomeEvent:
    """Один задокументированный исход применения скилла (метрика полезности v1)."""

    skill_path: str
    status: str
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


@dataclass(frozen=True)
class PersonaOutcomeEvent:
    """Один задокументированный исход удержания персоны в сессии (принцип 51, L010)."""

    status: str
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


@dataclass(frozen=True)
class VerdictEvent:
    """Вердикт гипотезы сессии («Вердикт по ГN» + «Сравнение с предположением»)."""

    hypothesis: str
    status: str
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


def classify_verdict_status(text: str) -> str | None:
    """Классифицирует статус вердикта по вхождению ключевого слова.

    Устойчиво к хвостам и оборотам («подтвердилась с уточнением»,
    «предварительно подтвердилась»). Негация («не подтвердилась») и неизвестные
    формулировки возвращают None, а не догадку.
    """
    lowered = text.strip().casefold()
    if "не подтвердилась" in lowered or "не подтвердил" in lowered:
        return None
    if "частично" in lowered:
        return "частично"
    if "опровергнут" in lowered:
        return "опровергнута"
    if "подтвердилась" in lowered or "подтвердил" in lowered:
        return "подтвердилась"
    return None


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


def extract_outcome_events(log_path: Path) -> list[SkillOutcomeEvent]:
    """Извлекает задокументированные исходы скиллов из одного лога (опциональный маркер)."""
    text = log_path.read_text(encoding="utf-8", errors="replace")
    events: list[SkillOutcomeEvent] = []
    for line_no, line in enumerate(text.splitlines(), start=1):
        match = OUTCOME_RE.search(line)
        if not match:
            continue
        status = match.group(2).casefold()
        if status not in OUTCOME_STATUSES:
            continue
        events.append(
            SkillOutcomeEvent(
                skill_path=match.group(1),
                status=status,
                log_path=log_path,
                line_no=line_no,
                line_text=line.strip(),
            )
        )
    return events


def extract_persona_outcomes(log_path: Path) -> list[PersonaOutcomeEvent]:
    """Извлекает задокументированные исходы удержания персоны из одного лога."""
    text = log_path.read_text(encoding="utf-8", errors="replace")
    events: list[PersonaOutcomeEvent] = []
    for line_no, line in enumerate(text.splitlines(), start=1):
        match = PERSONA_OUTCOME_RE.search(line)
        if not match:
            continue
        status = match.group(1).casefold()
        if status not in PERSONA_OUTCOME_STATUSES:
            continue
        events.append(
            PersonaOutcomeEvent(
                status=status,
                log_path=log_path,
                line_no=line_no,
                line_text=line.strip(),
            )
        )
    return events


def extract_verdict_events(log_path: Path) -> list[VerdictEvent]:
    """Извлекает вердикты гипотез из одного лога.

    Вердикт = заголовок «### Вердикт по ГN» + строка «**Сравнение с предположением:** ...».
    Статус классифицируется по префиксу; гипотеза берётся из ближайшего предшествующего
    заголовка. Строки без предшествующего заголовка получают hypothesis «?».
    """
    text = log_path.read_text(encoding="utf-8", errors="replace")
    events: list[VerdictEvent] = []
    current_hypothesis: str | None = None
    for line_no, line in enumerate(text.splitlines(), start=1):
        header = VERDICT_HEADER_RE.match(line)
        if header:
            current_hypothesis = header.group(1)
            continue
        status_match = VERDICT_STATUS_RE.search(line)
        if not status_match:
            continue
        status = classify_verdict_status(status_match.group(1))
        if status is None:
            continue
        events.append(
            VerdictEvent(
                hypothesis=current_hypothesis or "?",
                status=status,
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
            "outcomes": {"успех": 0, "частично": 0, "неудача": 0},
            "outcome_sessions": [],
            "outcome_logs": [],
            "session_verdicts": {"подтвердилась": 0, "частично": 0, "опровергнута": 0},
            "session_verdict_keys": set(),
        }
        for skill in skill_paths
    }

    events: list[SkillUseEvent] = []
    unknown_references: list[dict[str, Any]] = []
    logs_with_usage: set[str] = set()
    outcome_events: list[SkillOutcomeEvent] = []
    unknown_outcome_references: list[dict[str, Any]] = []
    verdict_events: list[VerdictEvent] = []
    verdicts_by_log: dict[str, list[dict[str, Any]]] = {}
    persona_outcome_events: list[PersonaOutcomeEvent] = []
    persona_outcome_sessions: list[str] = []

    for log_path in logs:
        for po in extract_persona_outcomes(log_path):
            persona_outcome_events.append(po)
            if po.session_label not in persona_outcome_sessions:
                persona_outcome_sessions.append(po.session_label)
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

        for outcome in extract_outcome_events(log_path):
            outcome_events.append(outcome)
            if outcome.skill_path not in known_skills:
                unknown_outcome_references.append(
                    {
                        "skill_path": outcome.skill_path,
                        "log": outcome.log_rel,
                        "session": outcome.session_label,
                        "line_no": outcome.line_no,
                        "line_text": outcome.line_text,
                    }
                )
                continue
            bucket = per_skill[outcome.skill_path]
            bucket["outcomes"][outcome.status] += 1
            if outcome.session_label not in bucket["outcome_sessions"]:
                bucket["outcome_sessions"].append(outcome.session_label)
            if outcome.log_rel not in bucket["outcome_logs"]:
                bucket["outcome_logs"].append(outcome.log_rel)

        for verdict in extract_verdict_events(log_path):
            verdict_events.append(verdict)
            verdicts_by_log.setdefault(verdict.log_rel, []).append(
                {
                    "hypothesis": verdict.hypothesis,
                    "status": verdict.status,
                    "line_no": verdict.line_no,
                }
            )
            # Корреляционный контекст: скилл применялся в сессии с вердиктом ГN.
            for skill, bucket in per_skill.items():
                if verdict.log_rel in bucket["logs"]:
                    key = (verdict.log_rel, verdict.hypothesis)
                    if key not in bucket["session_verdict_keys"]:
                        bucket["session_verdict_keys"].add(key)
                        bucket["session_verdicts"][verdict.status] += 1

    for bucket in per_skill.values():
        bucket["session_verdict_keys"] = sorted(bucket["session_verdict_keys"])

    unused_skills = [skill for skill, data in per_skill.items() if data["count"] == 0]
    used_skills = [skill for skill, data in per_skill.items() if data["count"] > 0]

    outcomes_by_status: dict[str, int] = {"успех": 0, "частично": 0, "неудача": 0}
    for outcome in outcome_events:
        if outcome.status in outcomes_by_status:
            outcomes_by_status[outcome.status] += 1
    skills_with_outcomes = [
        skill for skill, data in per_skill.items() if sum(data["outcomes"].values()) > 0
    ]

    verdicts_by_status: dict[str, int] = {
        "подтвердилась": 0, "частично": 0, "опровергнута": 0
    }
    for verdict in verdict_events:
        if verdict.status in verdicts_by_status:
            verdicts_by_status[verdict.status] += 1
    skills_with_verdicts = [
        skill
        for skill, data in per_skill.items()
        if sum(data["session_verdicts"].values()) > 0
    ]

    persona_outcomes_by_status: dict[str, int] = {"удержана": 0, "отклонение": 0}
    for po in persona_outcome_events:
        if po.status in persona_outcomes_by_status:
            persona_outcomes_by_status[po.status] += 1

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
        "total_outcomes": len(outcome_events),
        "outcomes_by_status": outcomes_by_status,
        "skills_with_outcomes": skills_with_outcomes,
        "unknown_outcome_references": unknown_outcome_references,
        "total_verdicts": len(verdict_events),
        "verdicts_by_status": verdicts_by_status,
        "skills_with_verdicts": skills_with_verdicts,
        "verdicts_by_log": verdicts_by_log,
        "total_persona_outcomes": len(persona_outcome_events),
        "persona_outcomes_by_status": persona_outcomes_by_status,
        "persona_outcome_sessions": persona_outcome_sessions,
        "persona_outcome_events": [
            {
                "status": event.status,
                "log": event.log_rel,
                "session": event.session_label,
                "line_no": event.line_no,
                "line_text": event.line_text,
            }
            for event in persona_outcome_events
        ],
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
        "outcome_events": [
            {
                "skill_path": event.skill_path,
                "status": event.status,
                "log": event.log_rel,
                "session": event.session_label,
                "line_no": event.line_no,
                "line_text": event.line_text,
            }
            for event in outcome_events
        ],
        "verdict_events": [
            {
                "hypothesis": event.hypothesis,
                "status": event.status,
                "log": event.log_rel,
                "session": event.session_label,
                "line_no": event.line_no,
            }
            for event in verdict_events
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

    print()
    print("## Исходы скиллов (полезность v1)")
    if report["total_outcomes"] == 0:
        print(
            "Исходы пока не задокументированы. Маркер (опциональный): "
            "«Итог скилла `skills/<имя>.md`: успех|частично|неудача — ...»."
        )
    else:
        statuses = report["outcomes_by_status"]
        print(
            f"Задокументировано исходов: {report['total_outcomes']} "
            f"(применений всего: {report['total_events']}); "
            f"успех: {statuses['успех']}, частично: {statuses['частично']}, "
            f"неудача: {statuses['неудача']}."
        )
        for skill, data in report["per_skill"].items():
            if sum(data["outcomes"].values()) == 0:
                continue
            out = data["outcomes"]
            sessions = ", ".join(data["outcome_sessions"])
            print(
                f"- `{skill}` — успех: {out['успех']}, частично: {out['частично']}, "
                f"неудача: {out['неудача']}; сессии: {sessions}"
            )
        uncovered = max(report["total_events"] - report["total_outcomes"], 0)
        if uncovered > 0:
            print(
                f"Применений без задокументированного исхода: {uncovered} "
                f"(это не провал, а незаполненное измерение)."
            )

    print()
    print("## Удержание персоны (принцип 51, L010)")
    if report.get("total_persona_outcomes", 0) == 0:
        print(
            "Исходы удержания персоны пока не задокументированы. Маркер: "
            "«Итог персоны: удержана|отклонение — ...»."
        )
    else:
        pst = report["persona_outcomes_by_status"]
        print(
            f"Задокументировано маркеров персоны: {report['total_persona_outcomes']} "
            f"(удержана: {pst['удержана']}, отклонение: {pst['отклонение']}); "
            f"сессии: {', '.join(report['persona_outcome_sessions'])}."
        )

    print()
    print("## Вердикты гипотез в сессиях применения")
    verdicts = report["verdicts_by_status"]
    print(
        f"Вердиктов в логах: {report['total_verdicts']} "
        f"(подтвердилась: {verdicts['подтвердилась']}, "
        f"частично: {verdicts['частично']}, опровергнута: {verdicts['опровергнута']})."
    )
    if report["skills_with_verdicts"]:
        print(
            "По скиллам — корреляционный контекст, НЕ доказательство причинности: "
            "сколько вердиктов (уникальных по сессии и гипотезе) встретилось в сессиях, "
            "где скилл применялся."
        )
        for skill, data in report["per_skill"].items():
            sv = data["session_verdicts"]
            if sum(sv.values()) == 0:
                continue
            sessions = ", ".join(data["sessions"])
            print(
                f"- `{skill}` — подтвердилась: {sv['подтвердилась']}, "
                f"частично: {sv['частично']}, опровергнута: {sv['опровергнута']}; "
                f"сессии применения: {sessions}"
            )
    else:
        print("Совпадений применений скиллов с вердиктами гипотез пока нет.")

    if report["unknown_outcome_references"]:
        print()
        print("## Неизвестные ссылки в маркерах исхода")
        for item in report["unknown_outcome_references"]:
            print(
                f"- `{item['skill_path']}` в `{item['log']}`:{item['line_no']} "
                f"({item['session']})"
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
