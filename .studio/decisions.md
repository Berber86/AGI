# Decision log

Append decisions in this format:

## YYYY-MM-DD — Decision title

- **Decision:**
- **Alternatives:**
- **Reason:**
- **Affected artifacts:**
- **Evidence or user answer:**

## 2026-10-11 — Переход к псевдо-3D OutRun по фидбеку

- **Decision:** Переписать RaceScene на псевдо-3D с перспективой, поворотами и миром игрушечного стола. Сохранить solo-only и no-fail.
- **Alternatives:** Оставить плоскую 3-полоску (отвергнуто пользователем), делать full 3D Babylon.js (избыточно для 5 лет).
- **Reason:** Пользователь ожидал вид сзади машины, интересный мир, симуляцию поворотов. Текущая реализация не соответствовала fantasy гонок.
- **Affected artifacts:** src/game/scenes/RaceScene.ts, game.json, backlog.json
- **Evidence or user answer:** Пользователь: 'Ужасно. Я ожидал псевдо 3d с видом сзади машины. Интересный мир, симуляцию поворотов...' + выбор OutRun + toy_table + drift_free
