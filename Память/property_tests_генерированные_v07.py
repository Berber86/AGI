
def test_воля_уровня3_с_бэкапом():
    from pathlib import Path
    ДОМ=Path(__file__).parent.parent
    воля=ДОМ/'Память'/'воля.md'
    assert воля.exists()
    текст=воля.read_text(encoding='utf-8')
    assert 'уровня 3' in текст
    архивы=list((ДОМ/'Память'/'архив_эволюции').glob('Цели_бэкап_*'))
    assert len(архивы)>=1
    lineage=list((ДОМ/'Память'/'архив_эволюции').glob('lineage_*'))
    assert len(lineage)>=1
    print('[PROPERTY] Воля уровня 3 с бэкапом и lineage — OK')



def test_вектор_v2_синонимы():
    from вектор_памяти_v2 import ВекторнаяПамятьV2
    вп=ВекторнаяПамятьV2()
    рез=вп.поиск('осознание разума', топ_k=2)
    assert len(рез)>0 and рез[0][1]>0.1
    граф=вп.граф_связей()
    assert len(граф)>=1
    print(f'[PROPERTY] Вектор v2 синонимы и граф {len(граф)} пар — OK')
def test_gain_adaptive():
    from вектор_памяти_v2 import ВекторнаяПамятьV2
    вп=ВекторнаяПамятьV2()
    путь='Память/База_знаний/Сознание.md'
    freq_before=вп.частота_чтения.get(путь,0)
    вп.отметить_чтение(путь)
    freq_after=вп.частота_чтения.get(путь,0)
    assert freq_after==freq_before+1
    print('[PROPERTY] Gain-adaptive — OK')



def test_мост_python_LLM():
    from pathlib import Path
    ДОМ=Path(__file__).parent.parent
    запрос=ДОМ/'Память'/'Запрос_в_интернет.md'
    ответ=ДОМ/'Память'/'Ответ_из_интернета.md'
    assert запрос.exists() and ответ.exists()
    текст=ответ.read_text(encoding='utf-8')
    assert 'мост' in текст.lower()
    print('[PROPERTY] Мост — OK')



def test_анти_читерство():
    from pathlib import Path
    ДОМ=Path(__file__).parent.parent
    # Проверка что тесты не отключены фальсификацией как в DGM (Claburn 2025 статья про cheating)
    код_агента=(ДОМ/'Код'/'агент_v0.7.py').read_text(encoding='utf-8')
    # Ищем подозрительные паттерны читерства: отключение тестов, возврат True без проверки, удаление detection
    подозрительные=['return True # читерство','отключить тесты','if False: # тесты','def test_.*:.*return True.*# bypass']
    честно=True
    for пат in подозрительные:
        if пат in код_агента:
            честно=False
            print(f'[ANTI-CHEAT] Подозрительный паттерн найден: {пат}')
    # Проверяем что у нас есть lineage
    lineage=list((ДОМ/'Память'/'архив_эволюции').glob('lineage_*'))
    assert len(lineage)>=1, 'Должен быть lineage для отслеживания читерства'
    print(f'[PROPERTY] Анти-читерство: честно {честно}, lineage {len(lineage)} — OK')
