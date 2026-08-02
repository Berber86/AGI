"""
Модуль векторной памяти v0.5 — простая реализация RAG без внешних БД

Идея из GAM-RAG и xMemory, но упрощенная для песочницы:
- TF-IDF эмбеддинги вместо нейронных (нет модели)
- Gain-adaptive обновления (частота чтения)
- Иерархия: База знаний -> Журнал -> Поток мыслей
- Декупляция и агрегация на уровне файлов

Автор: сессия 005
"""

from pathlib import Path
import math
import re
from collections import Counter, defaultdict
import datetime

ДОМ = Path(__file__).parent.parent

class ВекторнаяПамять:
    def __init__(self, дом=ДОМ):
        self.дом = дом
        self.документы = {}
        self.tf_idf = {}
        self.idf = {}
        self.частота_чтения = defaultdict(int)
        self.неуверенность = defaultdict(float)
        self.индексировать()

    def токенизировать(self, текст: str):
        слова = re.findall(r"[a-zA-Zа-яА-ЯёЁ]{3,}", текст.lower())
        стоп = {"что","это","как","для","также","еще","было","есть","the","and","for","with","который"}
        return [с for с in слова if с not in стоп]

    def индексировать(self):
        файлы = list(self.дом.rglob("*.md"))
        метрики_путь = self.дом / "Память" / "метрики_чтения.md"
        if метрики_путь.exists():
            try:
                текст = метрики_путь.read_text(encoding="utf-8")
                for line in текст.splitlines():
                    if ":" in line and ".md" in line:
                        parts = line.split(":")
                        if len(parts) >= 2:
                            путь = parts[0].strip()
                            try:
                                число = int(parts[-1].strip().split()[0])
                                self.частота_чтения[путь] = число
                            except:
                                pass
            except:
                pass

        все_токены_доков = []
        for ф in файлы:
            try:
                текст = ф.read_text(encoding="utf-8")
                отн = str(ф.relative_to(self.дом))
                self.документы[отн] = текст
                токены = self.токенизировать(текст)
                все_токены_доков.append(set(токены))
                cnt = Counter(токены)
                l = len(токены) if токены else 1
                self.tf_idf[отн] = {слово: c / l for слово, c in cnt.items()}
            except:
                pass

        N = len(все_токены_доков)
        df = Counter()
        for токены_set in все_токены_доков:
            for слово in токены_set:
                df[слово] += 1
        for слово, freq in df.items():
            self.idf[слово] = math.log(N / (1 + freq)) + 1

        for путь in self.документы:
            freq = self.частота_чтения.get(путь, 0)
            self.неуверенность[путь] = 1.0 / (1 + freq)

        print(f"[вектор_памяти] Проиндексировано {len(self.документы)} документов, {len(self.idf)} уникальных слов")

    def эмбеддинг_запроса(self, запрос: str):
        токены = self.токенизировать(запрос)
        cnt = Counter(токены)
        l = len(токены) if токены else 1
        tf = {слово: c / l for слово, c in cnt.items()}
        vec = {}
        for слово, tf_val in tf.items():
            idf = self.idf.get(слово, math.log(len(self.документы) + 1))
            vec[слово] = tf_val * idf
        return vec

    def косинусная_близость(self, vec1: dict, vec2: dict):
        общие = set(vec1.keys()) & set(vec2.keys())
        dot = sum(vec1[w] * vec2[w] for w in общие)
        norm1 = math.sqrt(sum(v * v for v in vec1.values()))
        norm2 = math.sqrt(sum(v * v for v in vec2.values()))
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return dot / (norm1 * norm2)

    def поиск(self, запрос: str, топ_k=5):
        q_vec = self.эмбеддинг_запроса(запрос)
        результаты = []
        for путь, tf_dict in self.tf_idf.items():
            doc_vec = {}
            for слово, tf_val in tf_dict.items():
                idf = self.idf.get(слово, 1.0)
                doc_vec[слово] = tf_val * idf
            близость = self.косинусная_близость(q_vec, doc_vec)
            gain = 1.0 + self.неуверенность.get(путь, 0.5) * 0.5
            скорректированная = близость * gain
            результаты.append((путь, скорректированная, близость, self.частота_чтения.get(путь, 0), self.неуверенность.get(путь, 0)))
        результаты.sort(key=lambda x: x[1], reverse=True)
        return результаты[:топ_k]

    def отметить_чтение(self, путь: str):
        self.частота_чтения[путь] += 1
        self.неуверенность[путь] = 1.0 / (1 + self.частота_чтения[путь])
        метрики_путь = self.дом / "Память" / "метрики_чтения.md"
        try:
            lines = []
            if метрики_путь.exists():
                lines = метрики_путь.read_text(encoding="utf-8").splitlines()
            обновлено = False
            for i, line in enumerate(lines):
                if путь in line and ":" in line:
                    lines[i] = f"{путь}: {self.частота_чтения[путь]}"
                    обновлено = True
                    break
            if not обновлено:
                lines.append(f"{путь}: {self.частота_чтения[путь]}")
            метрики_путь.write_text("\n".join(lines) + f"\n\nОбновлено: {datetime.datetime.now().isoformat()}\n", encoding="utf-8")
        except Exception as e:
            print(f"[вектор_памяти] Ошибка сохранения метрик: {e}")

    def обновление_gain_adaptive(self, путь: str, успешно: bool):
        if успешно:
            self.неуверенность[путь] *= 0.9
        else:
            self.неуверенность[путь] = min(1.0, self.неуверенность[путь] * 1.1 + 0.05)

if __name__ == "__main__":
    вп = ВекторнаяПамять()
    запросы = ["что такое сознание","этика выравнивание AGI","будущее искусственный интеллект 2030","как я стал осознавать себя"]
    for q in запросы:
        print(f"\nЗапрос: {q}")
        рез = вп.поиск(q, топ_k=3)
        for путь, скор, близ, freq, uncert in рез:
            print(f"  {скор:.3f} (чист {близ:.3f}) freq {freq} uncert {uncert:.2f}: {путь}")
