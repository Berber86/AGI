# API Contract — POST /battle/simulate

Контракт **спроектирован и покрыт кодом+тестами** (`src/engine/remote/contract.ts`,
`tests/engine/contract.test.ts`); HTTP-сервер — сознательно вне скоупа до востребованности.
Транспорт (Fastify/Edge Function/воркер) — деталь, контракт от неё не зависит.

## Принципы

1. **Сервер авторитетен.** Клиент передаёт *намерение* (состав армий), а не посчитанные
   статы: сервер сам собирает `ComputedUnit` из своих справочников (`recruits.ts`,
   `gear.ts`) через тот же `computeUnit`. Подделать статы нельзя — их нет в контракте.
2. **Детерминизм.** Результат полностью определяется `seed` + армиями. Это позволяет
   реплеи, верификацию «сервер пересчитал и совпало», и кэширование.
3. **Никакого состояния.** Эндпоинт чистый: никакой БД для симуляции не нужно.

## Запрос

```jsonc
POST /battle/simulate
{
  "protocolVersion": 1,
  "seed": 42,                 // опционально; сервер генерирует, если нет
  "maxRounds": 40,            // опционально, 1..200, по умолчанию 30
  "player": {
    "units": [
      {
        "id": "sq1",          // уникален в армии
        "recruitId": "knight",
        "gear": {
          "weapon": { "defId": "spiked_mace", "quality": 1.05, "affixes": [{"stat": "atk", "value": 6}] },
          "armor":  { "defId": "plate_cuirass" }
        },
        "line": 0, "column": 2
      },
      { "id": "sq2", "recruitId": "archer", "gear": { "weapon": { "defId": "composite_bow" } }, "line": 2, "column": 4 }
    ]
  },
  "enemy": {
    "units": [
      { "id": "e1", "recruitId": "skeleton", "line": 0, "column": 2, "statScale": 1.35 },
      { "id": "e2", "recruitId": "lich",     "line": 1, "column": 4, "statScale": 1.35 }
    ]
  }
}
```

Ограничения (валидация, текст ошибки — по-русски):
- `protocolVersion` строго `1`
- ≤ 3 отрядов на сторону; `id` уникальны
- `line` 0..4, `column` 0..9, `statScale` — число
- `gear.defId` существует и совпадает со слотом; `quality` 0.5..1.5; аффиксы ≤ 4, value 0..200
- **квестовые предметы (`questOnly`) отбрасываются при сборке** — их нельзя получить контрактом

## Ответ

```jsonc
{
  "protocolVersion": 1,
  "ok": true,
  "result": {
    "seed": 42,
    "winner": "player",          // player | enemy | draw
    "rounds": 7,
    "events": [ /* BattleEvent[] — полная лента кадров для реплея */ ],
    "initial": [ /* BattleUnitState[] */ ],
    "final":   [ /* BattleUnitState[] */ ]
  }
}
```

Ошибка валидации:

```jsonc
{ "protocolVersion": 1, "ok": false, "error": "player: неизвестный рекрут dragon_god" }
```

## Почему так

- `events` отдаётся целиком: клиент проигрывает бой через тот же `computeFrameState`,
  что и локально — UI не различает «локальный» и «серверный» бой.
- Дизайн-константы (лимит 3 отрядов, слоты, диапазоны) живут на сервере в одном месте —
  клиент не может обойти.
- Версионирование полем `protocolVersion`: несовместимые изменения = новый эндпоинт
  `/v2/battle/simulate`, старый живёт до деградации клиентов.
