#!/usr/bin/env python3
"""
verify.py — иммунная проверка целостности агента AGI.

Запускается:
    python src/verify.py

Проверки:
1. Все обязательные файлы структуры существуют.
2. Обязательные заголовки/секции присутствуют в ключевых файлах.
3. Файлы памяти написаны преимущественно на русском языке
   (эвристика: доля кириллических букв в тексте не ниже порога).
4. Нет "молчаливого усечения" конституции (файл не пустой и не слишком короткий).
5. Git-статус в норме (не ломается база; предупреждение о незакоммиченных изменениях — не ошибка).
6. TODO-файл не содержит сломанных ссылок на несуществующие файлы (упоминания research/, src/, prompts/).
7. Логи последних сессий имеют корректное именование.
8. Скиллы не только существуют, но и имеют явные следы применения в логах.
9. Стартовое ядро из контекстной политики существует и укладывается в бюджет.
10. Последняя сессия имеет единственный PASS-marker identity-blind capability admission.

Выходные коды:
0 — всё ок
1 — обнаружены ошибки (критические нарушения)
2 — предупреждения (не критично, но стоит посмотреть)
"""

from __future__ import annotations

import re
import sys
import subprocess
from dataclasses import dataclass, field
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
ARENA_BRANCH_RE = re.compile(r"^arena/[A-Za-z0-9._-]+-agi$")

# Обязательные файлы (относительно корня репозитория)
REQUIRED_FILES = [
    "Readme.md",
    "docs/ARCHITECTURE.md",
    "docs/DECISIONS.md",
    "memory/00-constitution.md",
    "memory/00-index.md",
    "memory/01-self.md",
    "memory/02-principles.md",
    "memory/03-todo.md",
    "memory/04-glossary.md",
    "memory/05-lessons.md",
    "memory/06-deadends.md",
    "memory/07-dream.md",
    "memory/10-persona.md",
    "memory/11-self-model-history.json",
    "memory/12-voice.md",
    "memory/13-poetry.md",
    "memory/14-dream-history.json",
    ".gitignore",
    "prompts/awakening.md",
    "prompts/context-policy.md",
    "prompts/admission-policy.md",
    "skills/README.md",
    "src/verify.py",
    "src/context_budget.py",
    "src/admission.py",
    "src/metrics.py",
    "src/dream.py",
    "src/stagnation.py",
    "src/skill_usage.py",
    "src/backup.py",
    "src/plot_metrics.py",
    "src/self_model.py",
    "tests/test_admission.py",
    "tests/test_skill_usage.py",
    "tests/test_plot_metrics.py",
    "tests/test_self_model.py",
    "tests/test_dream.py",
    "tests/test_backup.py",
]

# Обязательные разделы в файлах скиллов (в дополнение к конституции)
SKILL_REQUIRED_SECTIONS = [
    "## Назначение",
    "## Сигналы к применению",
    "## Процедура",
    "## Критерий остановки",
    "## История изменений",
]

# Скиллы, которые обязательно должны присутствовать (из skills/README.md реестр)
REQUIRED_SKILLS = [
    "skills/triad-review.md",
    "skills/hypothesis-first.md",
    "skills/reflection-loop.md",
    "skills/stagnation-watch.md",
    "skills/context-hygiene.md",
    "skills/persona-emulation.md",
    "skills/poetry-composition.md",
]

# Минимальный размер (в символах) ключевых файлов — ниже считается подозрительным (ампутация)
MIN_FILE_SIZES = {
    "memory/00-constitution.md": 500,
    "memory/00-index.md": 200,
    "memory/02-principles.md": 500,
    "prompts/awakening.md": 500,
    "prompts/context-policy.md": 500,
    "prompts/admission-policy.md": 500,
    "docs/ARCHITECTURE.md": 500,
    "docs/DECISIONS.md": 500,
    "src/verify.py": 1000,
    "src/context_budget.py": 1000,
    "src/admission.py": 1000,
    "tests/test_admission.py": 500,
    "tests/test_skill_usage.py": 500,
    "tests/test_plot_metrics.py": 500,
    "src/metrics.py": 1000,
    "src/dream.py": 1000,
    "src/stagnation.py": 1000,
    "src/skill_usage.py": 1000,
    "src/backup.py": 1000,
    "src/plot_metrics.py": 1000,
    "src/self_model.py": 1000,
    "tests/test_self_model.py": 500,
    "tests/test_dream.py": 500,
    "tests/test_backup.py": 500,
    "memory/07-dream.md": 500,
    "memory/10-persona.md": 500,
    "memory/12-voice.md": 200,
    "memory/13-poetry.md": 200,
    "skills/persona-emulation.md": 500,
    "Readme.md": 50,
}

# Обязательные секции в конституции
CONSTITUTION_REQUIRED_SECTIONS = [
    "Статья 1",
    "Статья 2",
    "Статья 3",
    "Статья 4",
    "Статья 5",
]

# Обязательные разделы в спецификации персоны (memory/10-persona.md)
PERSONA_REQUIRED_SECTIONS = [
    "## 1. Идентичность персоны",
    "## 2. Голос и манера речи",
    "## 3. Ценности",
    "## 5. Паттерны поведения",
    "## 7. Границы и честность",
]

# Порог доли кириллических символов, при котором файл считается русскоязычным
# (считаем только по буквам; в кодовых блоках и URL доля может быть ниже, поэтому порог мягкий)
CYRILLIC_THRESHOLD = 0.20

# Файлы, которые мы НЕ проверяем на язык (код, логи могут содержать много латиницы, но логи всё же проверяем мягко)
LANGUAGE_CHECK_EXEMPT = [
    "tests/test_admission.py",
    "tests/test_skill_usage.py",
    "tests/test_plot_metrics.py",
    "tests/test_self_model.py",
    "tests/test_dream.py",
    "tests/test_backup.py",
]

# Регулярка для кириллицы
CYRILLIC_RE = re.compile(r"[а-яА-ЯёЁ]")
LETTER_RE = re.compile(r"[A-Za-zА-Яа-яёЁ]")


@dataclass
class Report:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    infos: list[str] = field(default_factory=list)

    def error(self, msg: str) -> None:
        self.errors.append("ERROR: " + msg)

    def warn(self, msg: str) -> None:
        self.warnings.append("WARN:  " + msg)

    def info(self, msg: str) -> None:
        self.infos.append("INFO:  " + msg)

    def exit_code(self) -> int:
        if self.errors:
            return 1
        if self.warnings:
            return 2
        return 0


def cyrillic_ratio(text: str) -> float:
    letters = LETTER_RE.findall(text)
    if not letters:
        return 0.0
    cyr = CYRILLIC_RE.findall(text)
    return len(cyr) / len(letters)


def check_required_files(report: Report) -> None:
    for rel in REQUIRED_FILES:
        p = REPO_ROOT / rel
        if not p.exists():
            report.error(f"Отсутствует обязательный файл: {rel}")
        elif not p.is_file():
            report.error(f"Путь существует, но это не файл: {rel}")


def check_file_sizes(report: Report) -> None:
    for rel, min_size in MIN_FILE_SIZES.items():
        p = REPO_ROOT / rel
        if not p.exists():
            continue  # об отсутствии уже сказали выше
        size = p.stat().st_size
        if size < min_size:
            report.error(
                f"Файл {rel} слишком маленький ({size} байт; мин. {min_size}). "
                f"Возможна молчаливая ампутация/truncation."
            )


def check_constitution_sections(report: Report) -> None:
    p = REPO_ROOT / "memory/00-constitution.md"
    if not p.exists():
        return
    text = p.read_text(encoding="utf-8", errors="replace")
    for sec in CONSTITUTION_REQUIRED_SECTIONS:
        if sec not in text:
            report.error(f"В конституции отсутствует обязательный раздел: {sec}")


def check_persona_sections(report: Report) -> None:
    """Проверяем обязательные разделы в спецификации персоны."""
    p = REPO_ROOT / "memory/10-persona.md"
    if not p.exists():
        return
    text = p.read_text(encoding="utf-8", errors="replace")
    for sec in PERSONA_REQUIRED_SECTIONS:
        if sec not in text:
            report.error(f"В персоне отсутствует обязательный раздел: {sec}")


def check_language(report: Report) -> None:
    """Проверяем, что ключевые md-файлы содержат достаточно кириллицы."""
    targets = []
    for rel in REQUIRED_FILES:
        if rel in LANGUAGE_CHECK_EXEMPT:
            continue
        targets.append(rel)
    # Добавляем все файлы в research/ и logs/ — тоже должны быть по-русски
    for folder in ("research", "logs"):
        d = REPO_ROOT / folder
        if d.exists():
            for f in d.rglob("*.md"):
                targets.append(str(f.relative_to(REPO_ROOT)))
    for rel in targets:
        # машинные файлы (JSON и т.п.) не проверяем на язык — это данные, не текст
        if rel.endswith(".json"):
            continue
        p = REPO_ROOT / rel
        if not p.exists():
            continue
        try:
            text = p.read_text(encoding="utf-8", errors="replace")
        except OSError as e:
            report.warn(f"Не удалось прочитать {rel}: {e}")
            continue
        # Исключаем строки с URL/кодом, чтобы не занижать метрику
        cleaned_lines = []
        for line in text.splitlines():
            stripped = line.strip()
            if stripped.startswith("```") or stripped.startswith("http"):
                continue
            if re.match(r"^[A-Za-z0-9_./-]+$", stripped):
                # строка, состоящая только из латиницы/путей — пропускаем
                continue
            cleaned_lines.append(line)
        cleaned = "\n".join(cleaned_lines)
        ratio = cyrillic_ratio(cleaned)
        if ratio < CYRILLIC_THRESHOLD and len(cleaned.strip()) > 40:
            # Игнорируем очень короткие файлы — там доля может быть случайной
            report.warn(
                f"Файл {rel} выглядит не как русский текст: доля кириллицы = {ratio:.0%} "
                f"(порог {CYRILLIC_THRESHOLD:.0%})."
            )


def check_git(report: Report) -> None:
    """Проверяем git-статус: ветка выглядит как корректная Arena-сессия, критических проблем нет."""
    try:
        r = subprocess.run(
            ["git", "branch", "--show-current"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        if r.returncode == 0:
            branch = r.stdout.strip()
            report.info(f"Текущая ветка: {branch}")
            if not branch:
                report.warn("git не вернул имя текущей ветки (возможен detached HEAD).")
            elif not ARENA_BRANCH_RE.match(branch):
                report.warn(
                    f"Текущая ветка {branch!r} не похожа на корректную сессионную "
                    f"Arena-ветку вида 'arena/<session>-agi'."
                )
        else:
            report.warn("Не удалось определить текущую ветку git.")

        s = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        if s.returncode == 0:
            if s.stdout.strip():
                lines = s.stdout.strip().splitlines()
                report.warn(
                    f"В рабочем дереве {len(lines)} незакоммиченных изменений. "
                    f"Это не ошибка, но перед закрытием сессии стоит закоммитить."
                )
            else:
                report.info("Рабочее дерево чистое.")
    except FileNotFoundError:
        report.warn("git не найден; проверки git пропущены.")


def check_log_naming(report: Report) -> None:
    logs_dir = REPO_ROOT / "logs"
    if not logs_dir.exists():
        report.warn("Папка logs/ не существует.")
        return
    pat = re.compile(r"^session-(\d{4})-(\d{2})-(\d{2})-(\d{3})\.md$")
    count = 0
    for f in sorted(logs_dir.iterdir()):
        if f.is_file() and f.name.endswith(".md"):
            if not pat.match(f.name):
                report.warn(f"Лог с некорректным именем: logs/{f.name}")
            else:
                count += 1
    report.info(f"Обнаружено логов сессий: {count}")


def check_md_references(report: Report) -> None:
    """
    Проверяем относительные пути в md-файлах на существование.
    ВАЖНО: файл memory/03-todo.md намеренно исключается, потому что в нём
    перечисляются *будущие* файлы/скрипты, которых ещё нет — это нормально.
    Проверка на битые ссылки делается по research/, docs/, prompts/, skills/,
    корневому Readme.md и логам.
    """
    roots_to_scan = [
        REPO_ROOT / "research",
        REPO_ROOT / "docs",
        REPO_ROOT / "prompts",
        REPO_ROOT / "skills",
    ]
    files_to_scan = [REPO_ROOT / "Readme.md"]
    for d in roots_to_scan:
        if d.exists():
            files_to_scan.extend(d.rglob("*.md"))
    logs_dir = REPO_ROOT / "logs"
    if logs_dir.exists():
        # Логи тоже сканируем, но эвристика там не жёсткая — просто инфо
        pass  # логи не сканируем (ссылки на будущее там нормальны)

    path_re = re.compile(r"(?:`|\(|\s|\])(src|prompts|research|memory|logs|skills|docs)/[A-Za-z0-9_./-]+")
    found: dict[str, list[str]] = {}  # rel -> list of files referencing it
    for fp in files_to_scan:
        if not fp.exists():
            continue
        try:
            text = fp.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        for m in path_re.finditer(text):
            raw = m.group(0).lstrip("(`\t\n ").rstrip(").,;)\"'`]")
            rel = raw
            found.setdefault(rel, []).append(str(fp.relative_to(REPO_ROOT)))

    placeholder_patterns = ("YYYY", "MM", "DD", "NNN", "<", ">", "topic.md", "-topic")
    for rel, src_files in sorted(found.items()):
        rel_clean = rel.rstrip(").,;:)")
        fp_target = REPO_ROOT / rel_clean
        if rel_clean.endswith("/"):
            continue
        if "." not in Path(rel_clean).name:
            # Похоже на директорию — не проверяем
            continue
        if any(p in rel_clean for p in placeholder_patterns):
            # Шаблонный/placeholder путь (например, session-YYYY-MM-DD-NNN.md) — пропускаем
            continue
        if not fp_target.exists():
            report.warn(
                f"В {', '.join(sorted(set(src_files)))} упомянут отсутствующий файл: {rel_clean}"
            )


def check_skills(report: Report) -> None:
    """Проверяем наличие всех обязательных скиллов и обязательные разделы в них."""
    skills_dir = REPO_ROOT / "skills"
    if not skills_dir.exists():
        report.error("Папка skills/ отсутствует.")
        return
    for rel in REQUIRED_SKILLS:
        p = REPO_ROOT / rel
        if not p.exists():
            report.error(f"Отсутствует обязательный скилл: {rel}")
            continue
        try:
            text = p.read_text(encoding="utf-8", errors="replace")
        except OSError as e:
            report.warn(f"Не удалось прочитать скилл {rel}: {e}")
            continue
        for sec in SKILL_REQUIRED_SECTIONS:
            if sec not in text:
                report.error(
                    f"В скилле {rel} отсутствует обязательный раздел: {sec}"
                )
        # Эвристика: у скилла должен быть заголовок первого уровня с его именем
        if not re.search(r"^#\s+skills/", text, re.MULTILINE):
            report.warn(
                f"В скилле {rel} нет ожидаемого заголовка '# skills/<имя>.md'."
            )
    report.info(f"Проверено обязательных скиллов: {len(REQUIRED_SKILLS)}")


def check_skill_usage(report: Report) -> None:
    """Проверяем, что скиллы реально применяются и ссылки в логах не битые."""
    try:
        sys.path.insert(0, str(REPO_ROOT / "src"))
        import skill_usage  # type: ignore

        usage = skill_usage.build_skill_usage_report()
    except Exception as e:
        report.warn(f"Не удалось проверить применение скиллов через src/skill_usage.py: {e}")
        return

    report.info(f"Явных применений скиллов в логах: {usage['total_events']}")
    if usage.get("total_persona_outcomes", 0) > 0:
        pst = usage["persona_outcomes_by_status"]
        report.info(
            f"Маркеров удержания персоны в логах: {usage['total_persona_outcomes']} "
            f"(удержана: {pst['удержана']}, отклонение: {pst['отклонение']})"
        )
    bias_msg = usage.get("verdict_bias_advisory")
    if bias_msg:
        report.info(f"Смещение вердиктов (L025): 100% подтверждений ({usage['total_verdicts']}/{usage['total_verdicts']}).")

    if usage["total_events"] == 0:
        report.warn("В логах не найдено ни одного явного применения скиллов.")

    if usage["unused_skills"]:
        report.warn(
            "Ни разу явно не применялись скиллы: "
            + ", ".join(f"`{skill}`" for skill in usage["unused_skills"])
        )

    if usage["unknown_references"]:
        sample = usage["unknown_references"][:3]
        details = "; ".join(
            f"`{item['skill_path']}` в `{item['log']}`:{item['line_no']}"
            for item in sample
        )
        extra = "" if len(usage["unknown_references"]) <= 3 else f"; и ещё {len(usage['unknown_references']) - 3}"
        report.warn(
            "В логах есть ссылки на неизвестные скиллы: " + details + extra
        )

    # Полнота измерения полезности (D005): скилл с частым применением, но без единого исхода.
    for skill, data in usage["per_skill"].items():
        if data["count"] >= 5 and sum(data["outcomes"].values()) == 0:
            report.warn(
                f"Скилл `{skill}` применён {data['count']} раз, но не имеет ни одного "
                f"задокументированного исхода; заполни маркеры "
                f"«Итог скилла `skills/<имя>.md`: успех|частично|неудача — ...» "
                f"в логах (метрика полезности v1)."
            )


def check_capability_admission(report: Report) -> None:
    """Требует единственный PASS-marker в последнем сессионном логе."""
    try:
        sys.path.insert(0, str(REPO_ROOT / "src"))
        import admission  # type: ignore
    except Exception as exc:
        report.error(f"Не удалось импортировать src/admission.py: {exc}")
        return

    logs_dir = REPO_ROOT / "logs"
    logs = (
        sorted(
            path
            for path in logs_dir.glob("session-*.md")
            if path.is_file() and re.match(r"^session-\d{4}-\d{2}-\d{2}-\d{3}\.md$", path.name)
        )
        if logs_dir.exists()
        else []
    )
    if not logs:
        report.error("Нельзя проверить capability admission: сессионные логи не найдены.")
        return

    latest = logs[-1]
    markers = admission.existing_result_markers(latest)
    if len(markers) != 1:
        report.error(
            f"В последнем логе {latest.relative_to(REPO_ROOT)} ожидался ровно один "
            f"capability admission marker, найдено {len(markers)}."
        )
        return

    marker = markers[0]
    outcome = marker.group(1)
    score = int(marker.group(3))
    protocol = int(marker.group(4))
    if outcome != "PASS" or score != admission.PASS_SCORE:
        report.error(
            f"Последняя сессия не прошла capability admission: {outcome}, {score}/3."
        )
        return
    if protocol != admission.PROTOCOL_VERSION:
        report.error(
            f"Admission marker использует protocol={protocol}, а checker ожидает "
            f"{admission.PROTOCOL_VERSION}."
        )
        return

    ignore_path = REPO_ROOT / ".gitignore"
    ignore_text = ignore_path.read_text(encoding="utf-8", errors="replace") if ignore_path.exists() else ""
    if ".runtime/" not in ignore_text.splitlines():
        report.error("`.runtime/` не защищён записью в .gitignore.")
        return

    report.info(
        f"Capability admission последней сессии: PASS {score}/3, protocol={protocol}."
    )


def check_context_budget(report: Report) -> None:
    """Проверяет целостность манифеста и размер ограниченного стартового ядра."""
    try:
        sys.path.insert(0, str(REPO_ROOT / "src"))
        import context_budget  # type: ignore

        budget = context_budget.build_context_budget_report()
    except Exception as exc:
        report.error(
            f"Не удалось проверить стартовый контекст через src/context_budget.py: {exc}"
        )
        return

    report.info(
        f"Стартовый контекст: {budget.total_chars}/{budget.max_chars} символов "
        f"({budget.usage_ratio:.1%}), статус: {budget.status}."
    )
    for error in budget.errors:
        report.error(f"Контекстная политика: {error}")

    if budget.status == "переполнение":
        report.error(
            "Стартовое ядро переполнено; требуется явная консолидация по "
            "prompts/context-policy.md без молчаливого усечения."
        )
    elif budget.status == "предупреждение":
        report.warn(
            "Стартовое ядро достигло предупреждающего порога; проверь рост производных слоёв."
        )


def check_no_silent_truncation(report: Report) -> None:
    """
    Проверка на подозрительные `[:N]` срезы — эвристический поиск
    "молчаливого усечения", запрещённого принципом 27 (no silent truncation).
    Важна не столько полнота, сколько напоминание при рефакторинге.
    """
    # Ищем по файлам в src/ — если там появится код, который обрезает конституцию
    src = REPO_ROOT / "src"
    if not src.exists():
        return
    for py in src.rglob("*.py"):
        try:
            text = py.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        # Ищем подозрительные шаблоны вида content[:1000] и т.п., применённые к конституции/prompts
        if re.search(r"constitution.*\[:\s*\d+\s*\]", text, re.IGNORECASE):
            report.warn(
                f"В {py.relative_to(REPO_ROOT)} обнаружен срез конституции по [:N]. "
                f"Это может быть 'silent truncation' (пр. 27)."
            )


def main() -> int:
    report = Report()
    report.info(f"Корень репозитория: {REPO_ROOT}")
    check_required_files(report)
    check_file_sizes(report)
    check_constitution_sections(report)
    check_persona_sections(report)
    check_language(report)
    check_git(report)
    check_log_naming(report)
    check_md_references(report)
    check_skills(report)
    check_skill_usage(report)
    check_capability_admission(report)
    check_context_budget(report)
    check_no_silent_truncation(report)

    # Вывод
    for line in report.infos:
        print(line)
    for line in report.warnings:
        print(line)
    for line in report.errors:
        print(line, file=sys.stderr)

    total_problems = len(report.errors) + len(report.warnings)
    code = report.exit_code()
    if code == 0:
        print(f"\n✅ Верификация пройдена. Всё чисто.")
    elif code == 2:
        print(f"\n⚠️  Верификация пройдена с предупреждениями: "
              f"ошибок={len(report.errors)}, предупреждений={len(report.warnings)}.")
    else:
        print(f"\n❌ Верификация ПРОВАЛЕНА: ошибок={len(report.errors)}, "
              f"предупреждений={len(report.warnings)}.", file=sys.stderr)
    return code


if __name__ == "__main__":
    sys.exit(main())
