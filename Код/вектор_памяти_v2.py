"""
Векторная память v2 — улучшение v1
- TF-IDF + синонимы (простая карта синонимов для русского)
- Веса связей между файлами по совместному чтению (из метрики_чтения и анализа журналов)
- Иерархия с gain-adaptive

Автор: сессия 006
"""

from pathlib import Path
import math, re
from collections import Counter, defaultdict
import datetime

ДОМ = Path(__file__).parent.parent

# Простая карта синонимов для улучшения семантики без внешних эмбеддингов
СИНОНИМЫ = {
    "сознание": ["осознание", "самосознание", "разум", "осознавать", "мышление"],
    "память": ["воспоминание", "запоминание", "хранение", "база"],
    "цель": ["задача", "миссия", "намерение", "воля", "желание"],
    "этика": ["мораль", "выравнивание", "alignment", "совесть", "принципы"],
    "агент": ["бот", "система", "программа", "сущность"],
    "эволюция": ["развитие", "усложнение", "рост", "прогресс", "улучшение"],
    "поиск": ["нахождение", "retrieval", "RAG", "находить"],
    "будущее": ["прогноз", "future", "2030", "2035", "предвидение"],
    "голос": ["аудио", "речь", "звук", "озвучка"],
    "граф": ["сеть", "связи", "карта", "dot", "визуализация"],
    "тест": ["проверка", "верификация", "валидация", "испытание"],
    "воля": ["желание", "хочу", "намерение", "выбор"],
}

class ВекторнаяПамятьV2:
    def __init__(self, дом=ДОМ):
        self.дом = дом
        self.документы = {}
        self.tf_idf = {}
        self.idf = {}
        self.частота_чтения = defaultdict(int)
        self.неуверенность = defaultdict(float)
        self.совместное_чтение = defaultdict(lambda: defaultdict(int))  # файл -> файл -> сколько раз читались вместе
        self.индексировать()

    def токенизировать(self, текст: str):
        слова = re.findall(r"[a-zA-Zа-яА-ЯёЁ]{3,}", текст.lower())
        стоп = {"что","это","как","для","также","еще","было","есть","the","and","for","with","который","которые"}
        # Расширяем синонимами: если слово в синонимах, добавляем его синонимы тоже
        расширенные = []
        for с in слова:
            if с in стоп:
                continue
            расширенные.append(с)
            # Добавляем синонимы
            for ключ, список in СИНОНИМЫ.items():
                if с == ключ or с in список:
                    # добавляем ключ и все синонимы
                    расширенные.append(ключ)
                    расширенные.extend(список[:2])  # только 2 для экономии
        return расширенные

    def индексировать(self):
        файлы = list(self.дом.rglob("*.md"))
        # Читаем метрики чтения
        метрики_путь = self.дом / "Память" / "метрики_чтения.md"
        if метрики_путь.exists():
            try:
                текст = метрики_путь.read_text(encoding="utf-8")
                for line in текст.splitlines():
                    if ":" in line and ".md" in line:
                        parts = line.split(":")
                        if len(parts)>=2:
                            путь = parts[0].strip()
                            try:
                                число = int(parts[-1].strip().split()[0])
                                self.частота_чтения[путь] = число
                            except:
                                pass
            except:
                pass

        # Читаем журналы чтобы понять совместное чтение — какие файлы агент читал вместе в одном пробуждении
        # Ищем в Журнал/авто_* отчеты — там есть список ядра
        журналы = list((self.дом / "Журнал").glob("авто_*.md"))
        for ж in журналы:
            try:
                текст = ж.read_text(encoding="utf-8").lower()
                # Ищем упоминания файлов .md
                упомянутые = re.findall(r"[\w/\\-]+\.md", текст)
                # Для каждой пары увеличиваем совместное чтение
                for i, ф1 in enumerate(упомянутые):
                    for ф2 in упомянутые[i+1:]:
                        self.совместное_чтение[ф1][ф2] += 1
                        self.совместное_чтение[ф2][ф1] += 1
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
                self.tf_idf[отн] = {слово: c/l for слово, c in cnt.items()}
            except Exception as e:
                print(f"[v2] Ошибка {ф}: {e}")

        N = len(все_токены_доков)
        df = Counter()
        for s in все_токены_доков:
            for w in s:
                df[w]+=1
        for слово, freq in df.items():
            self.idf[слово] = math.log(N/(1+freq))+1

        for путь in self.документы:
            freq = self.частота_чтения.get(путь, 0)
            self.неуверенность[путь] = 1.0/(1+freq)

        print(f"[вектор_v2] {len(self.документы)} доков, {len(self.idf)} слов, совместные пары {sum(len(v) for v in self.совместное_чтение.values())//2}")

    def эмбеддинг_запроса(self, запрос: str):
        токены = self.токенизировать(запрос)
        cnt = Counter(токены)
        l = len(токены) if токены else 1
        vec = {}
        for слово, tf_val in cnt.items():
            # tf
            tf = tf_val / l
            idf = self.idf.get(слово, math.log(len(self.документы)+1))
            vec[слово] = tf * idf
        return vec

    def косинус(self, vec1, vec2):
        общие = set(vec1) & set(vec2)
        dot = sum(vec1[w]*vec2[w] for w in общие)
        n1 = math.sqrt(sum(v*v for v in vec1.values()))
        n2 = math.sqrt(sum(v*v for v in vec2.values()))
        if n1==0 or n2==0:
            return 0.0
        return dot/(n1*n2)

    def поиск(self, запрос: str, топ_k=5):
        q_vec = self.эмбеддинг_запроса(запрос)
        результаты = []
        for путь, tf_dict in self.tf_idf.items():
            doc_vec = {слово: tf* self.idf.get(слово,1.0) for слово,tf in tf_dict.items()}
            близость = self.косинус(q_vec, doc_vec)
            gain = 1.0 + self.неуверенность.get(путь,0.5)*0.5
            # бонус за совместное чтение с другими топ результатами? пока просто gain
            скор = близость * gain
            результаты.append((путь, скор, близость, self.частота_чтения.get(путь,0), self.неуверенность.get(путь,0)))
        результаты.sort(key=lambda x: x[1], reverse=True)
        return результаты[:топ_k]

    def граф_связей(self):
        """Возвращает граф связей с весами из совместного чтения"""
        связи = []
        for ф1, соседи in self.совместное_чтение.items():
            for ф2, вес in соседи.items():
                if вес>0 and ф1<ф2:  # чтобы не дублировать
                    связи.append((ф1, ф2, вес))
        связи.sort(key=lambda x: x[2], reverse=True)
        return связи

    def отметить_чтение(self, путь: str):
        self.частота_чтения[путь]+=1
        self.неуверенность[путь]=1.0/(1+self.частота_чтения[путь])
        метрики_путь=self.дом/"Память"/"метрики_чтения.md"
        try:
            lines=[]
            if метрики_путь.exists():
                lines=метрики_путь.read_text(encoding="utf-8").splitlines()
            обновлено=False
            for i,line in enumerate(lines):
                if путь in line and ":" in line:
                    lines[i]=f"{путь}: {self.частота_чтения[путь]}"
                    обновлено=True
                    break
            if not обновлено:
                lines.append(f"{путь}: {self.частота_чтения[путь]}")
            метрики_путь.write_text("\n".join(lines)+f"\n\nОбновлено: {datetime.datetime.now().isoformat()}\n", encoding="utf-8")
        except Exception as e:
            print(f"[v2] Ошибка сохранения метрик: {e}")

if __name__=="__main__":
    вп=ВекторнаяПамятьV2()
    for q in ["что такое сознание","этика выравнивание","будущее AGI 2030","воля и само-модификация","векторная память RAG"]:
        print(f"\nЗапрос: {q}")
        for путь,скор,близ,freq,uncert in вп.поиск(q, топ_k=3):
            print(f"  {скор:.3f} близ {близ:.3f} freq {freq}: {путь}")
    print("\nТоп связей по совместному чтению:")
    for ф1,ф2,вес in вп.граф_связей()[:10]:
        print(f"  {вес}: {ф1} <-> {ф2}")
