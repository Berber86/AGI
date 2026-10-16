
def test_воля_уровня3_с_бэкапом():
    from pathlib import Path
    ДОМ=Path(__file__).parent.parent
    воля=ДОМ/'Память'/'воля.md'
    assert воля.exists(), 'воля.md должен существовать'
    текст=воля.read_text(encoding='utf-8')
    assert 'уровня 3' in текст, 'должна быть воля уровня 3'
    # Проверяем бэкап
    архивы=list((ДОМ/'Память'/'архив_эволюции').glob('Цели_бэкап_*'))
    assert len(архивы)>=1, 'должен быть бэкап Целей'
    # Проверяем lineage
    lineage=list((ДОМ/'Память'/'архив_эволюции').glob('lineage_*'))
    assert len(lineage)>=1, 'должен быть lineage'
    print('[PROPERTY] Воля уровня 3 с бэкапом и lineage — OK')



def test_вектор_v2_синонимы():
    from вектор_памяти_v2 import ВекторнаяПамятьV2
    вп=ВекторнаяПамятьV2()
    # Синонимы: запрос 'осознание' должен найти 'сознание'
    рез=вп.поиск('осознание разума', топ_k=2)
    assert len(рез)>0
    assert рез[0][1]>0.1, 'синонимичный поиск должен работать'
    # Проверяем граф связей
    граф=вп.граф_связей()
    assert len(граф)>=1, 'граф связей должен иметь пары'
    print(f'[PROPERTY] Вектор v2 синонимы и граф связей {len(граф)} пар — OK')

def test_gain_adaptive():
    from вектор_памяти_v2 import ВекторнаяПамятьV2
    вп=ВекторнаяПамятьV2()
    путь='Память/База_знаний/Сознание.md'
    freq_before=вп.частота_чтения.get(путь,0)
    вп.отметить_чтение(путь)
    freq_after=вп.частота_чтения.get(путь,0)
    assert freq_after==freq_before+1
    print('[PROPERTY] Gain-adaptive отметка чтения — OK')



def test_мост_python_LLM():
    from pathlib import Path
    ДОМ=Path(__file__).parent.parent
    запрос=ДОМ/'Память'/'Запрос_в_интернет.md'
    ответ=ДОМ/'Память'/'Ответ_из_интернета.md'
    assert запрос.exists() and ответ.exists()
    текст=ответ.read_text(encoding='utf-8')
    assert 'мост' in текст.lower()
    assert 'RAG' in текст or 'GAM' in текст
    print('[PROPERTY] Мост python-LLM — OK')
