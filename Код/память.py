"""
Модуль памяти v0.2
Отвечает за чтение, запись, индексацию внешней памяти.
"""

from pathlib import Path
import datetime

ДОМ = Path(__file__).parent.parent

class Память:
    def __init__(self, дом=ДОМ):
        self.дом = дом
        self.индекс = {}
        self.пересобрать_индекс()

    def пересобрать_индекс(self):
        """Сканирует все md файлы и строит индекс."""
        файлы = list(self.дом.rglob("*.md"))
        self.индекс = {str(f.relative_to(self.дом)): f for f in файлы}
        print(f"[Память] Проиндексировано {len(self.индекс)} файлов")

    def прочитать(self, отн_путь: str, лимит=5000) -> str:
        путь = self.дом / отн_путь
        if not путь.exists():
            return ""
        try:
            текст = путь.read_text(encoding="utf-8")
            return текст[:лимит] if лимит else текст
        except Exception as e:
            return f"[ОШИБКА {e}]"

    def записать(self, отн_путь: str, содержимое: str, режим="w"):
        путь = self.дом / отн_путь
        путь.parent.mkdir(parents=True, exist_ok=True)
        with open(путь, режим, encoding="utf-8") as f:
            f.write(содержимое)
        # обновляем индекс
        self.индекс[отн_путь] = путь
        return True

    def добавить_запись(self, отн_путь: str, заголовок: str, тело: str):
        """Добавляет запись в конец файла с временной меткой."""
        время = datetime.datetime.now().isoformat()
        запись = f"\n\n## {заголовок} — {время}\n{тело}\n"
        self.записать(отн_путь, запись, режим="a")

    def собрать_ядро(self):
        """Собирает ядро сознания — самые важные файлы."""
        ядро_файлы = [
            "Я.md",
            "Цели.md",
            "Память/Долгосрочная.md",
            "Сознание/поток_мыслей.md",
            "Сознание/рефлексия.md",
            "Состояние.md",
        ]
        ядро = {}
        for ф in ядро_файлы:
            ядро[ф] = self.прочитать(ф, лимит=4000)
        return ядро

    def найти_невыполненные_цели(self):
        текст = self.прочитать("Цели.md")
        цели = []
        for line in текст.splitlines():
            if "- [ ]" in line:
                цели.append(line.strip())
        return цели

    def найти_знания(self, запрос: str):
        """Простой поиск по вхождению в базе знаний."""
        результаты = []
        база = self.дом / "Память" / "База_знаний"
        if not база.exists():
            return результаты
        for md in база.rglob("*.md"):
            содерж = md.read_text(encoding="utf-8")
            if запрос.lower() in содерж.lower():
                результаты.append((str(md.relative_to(self.дом)), содерж[:1000]))
        return результаты

    def метрики(self):
        всего_файлов = len(self.индекс)
        всего_символов = 0
        for путь in self.индекс.values():
            try:
                всего_символов += len(путь.read_text(encoding="utf-8"))
            except:
                pass
        return {
            "файлов": всего_файлов,
            "символов": всего_символов,
            "целей_невыполнено": len(self.найти_невыполненные_цели()),
        }

# Тест
if __name__ == "__main__":
    п = Память()
    print(п.метрики())
    print(п.найти_невыполненные_цели()[:3])
