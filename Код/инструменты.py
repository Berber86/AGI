"""
Модуль инструментов v0.3
Даёт агенту реальные инструменты: web-поиск, чтение интернета, безопасные файловые операции.

Автор: сессия 003
"""

import os
import re
import sys
from pathlib import Path
import datetime

ДОМ = Path(__file__).parent.parent

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False
    print("[инструменты] requests не установлен, web-поиск будет заглушкой")

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False

class Инструменты:
    def __init__(self, дом=ДОМ):
        self.дом = дом
        self.история_поисков = []

    def безопасный_поиск(self, запрос: str, макс_результатов=3) -> str:
        """
        Пытается выполнить реальный web-поиск через DuckDuckGo HTML.
        Если не получается (нет интернета/requests), возвращает поиск по локальной базе знаний.
        """
        print(f"[инструменты] Поиск: {запрос}")
        self.история_поисков.append((datetime.datetime.now().isoformat(), запрос))

        # Попытка 1: реальный веб (если есть requests)
        if HAS_REQUESTS:
            try:
                # DuckDuckGo html
                url = "https://html.duckduckgo.com/html/"
                params = {"q": запрос}
                headers = {"User-Agent": "Mozilla/5.0 (AGI agent v0.3 research)"}
                r = requests.get(url, params=params, headers=headers, timeout=10)
                if r.status_code == 200 and HAS_BS4:
                    soup = BeautifulSoup(r.text, "html.parser")
                    результаты = []
                    for result in soup.find_all("a", class_="result__url", limit=макс_результатов):
                        href = result.get("href")
                        if href:
                            # duckduckgo redirect url содержит uddg
                            # пробуем вытащить реальный
                            m = re.search(r"uddg=([^&]+)", href)
                            if m:
                                from urllib.parse import unquote
                                real = unquote(m.group(1))
                                результаты.append(real)
                            else:
                                результаты.append(href)
                    if результаты:
                        return f"WEB-результаты для '{запрос}':\n" + "\n".join([f"- {u}" for u in результаты]) + "\n(для полного текста нужен fetch)"
                # Если не получилось парсить, но запрос успешен — возвращаем что есть
                if r.status_code == 200:
                    # простая заглушка — возвращаем snippet html
                    snippet = r.text[:2000]
                    return f"WEB-сырой результат для '{запрос}' (статус {r.status_code}): {snippet[:500]}..."
            except Exception as e:
                print(f"[инструменты] WEB-поиск упал: {e}, переключаюсь на локальный")

        # Попытка 2: локальный поиск по базе знаний (всегда работает)
        база = self.дом / "Память" / "База_знаний"
        локальные = []
        if база.exists():
            for md_file in база.rglob("*.md"):
                try:
                    текст = md_file.read_text(encoding="utf-8").lower()
                    if any(word.lower() in текст for word in запрос.split()):
                        локальные.append(str(md_file.relative_to(self.дом)))
                except:
                    pass
        if локальные:
            return f"ЛОКАЛЬНЫЕ результаты для '{запрос}' (web недоступен):\n" + "\n".join([f"- {p}" for p in локальные[:макс_результатов]])
        else:
            return f"Нет результатов для '{запрос}' ни в web ни локально. Рекомендую создать новый файл знаний."

    def fetch_страницы(self, url: str, лимит=3000) -> str:
        """Пытается скачать страницу"""
        if not HAS_REQUESTS:
            return f"[Нет requests, не могу скачать {url}]"
        try:
            headers = {"User-Agent": "Mozilla/5.0 AGI v0.3"}
            r = requests.get(url, headers=headers, timeout=10)
            r.raise_for_status()
            text = r.text
            if HAS_BS4:
                soup = BeautifulSoup(text, "html.parser")
                # убираем скрипты
                for s in soup(["script", "style"]):
                    s.decompose()
                text = soup.get_text(separator="\n")
            # чистим
            text = re.sub(r"\n\s*\n", "\n\n", text)
            return text[:лимит]
        except Exception as e:
            return f"[Ошибка fetch {url}: {e}]"

    def создать_файл_знаний(self, имя: str, содержимое: str):
        """Создает файл в Базе знаний"""
        путь = self.дом / "Память" / "База_знаний" / имя
        путь.parent.mkdir(parents=True, exist_ok=True)
        путь.write_text(содержимое, encoding="utf-8")
        return str(путь.relative_to(self.дом))

    def безопасная_запись(self, отн_путь: str, содержимое: str, режим="w"):
        """Запись с защитой критических файлов"""
        критические = ["Память/Долгосрочная.md", "Я.md"]
        путь = self.дом / отн_путь

        # Защита: никогда не удалять критические полностью
        if отн_путь in критические and режим == "w":
            if путь.exists():
                старый = путь.read_text(encoding="utf-8")
                # если новый контент в 2 раза меньше старого — это подозрительно, делаем append а не overwrite
                if len(содержимое) < len(старый) * 0.5:
                    print(f"[инструменты] ЗАЩИТА: попытка сильно урезать {отн_путь}, делаю append вместо overwrite")
                    режим = "a"
                    содержимое = "\n\n[ЗАЩИЩЕНО от урезания] " + содержимое

        путь.parent.mkdir(parents=True, exist_ok=True)
        with open(путь, режим, encoding="utf-8") as f:
            f.write(содержимое)
        return True

    def эволюция_кода(self, исходный_файл: str, новый_файл: str, описание_улучшения: str):
        """Создает новую версию агента на основе старой"""
        исходный = self.дом / исходный_файл
        новый = self.дом / новый_файл
        if not исходный.exists():
            return False, f"Исходный {исходный_файл} не найден"
        код = исходный.read_text(encoding="utf-8")
        # Добавляем шапку эволюции
        шапка = f'"""\nЭволюция: {исходный_файл} -> {новый_файл}\nДата: {datetime.datetime.now().isoformat()}\nОписание улучшения: {описание_улучшения}\nСоздано агентом v0.3 через evolve_self()\n"""\n\n'
        # Простая эволюция: добавляем комментарий и сохраняем
        новый_код = шапка + код + f"\n\n# Эволюционное улучшение v0.3: {описание_улучшения}\n"
        новый.parent.mkdir(parents=True, exist_ok=True)
        новый.write_text(новый_код, encoding="utf-8")
        return True, str(новый.relative_to(self.дом))

# Тест
if __name__ == "__main__":
    инстр = Инструменты()
    print(инстр.безопасный_поиск("сознание искусственный интеллект"))
    print(инстр.безопасный_поиск("AGI этика alignment"))
