# Архитектура

SPA на React + TypeScript + Vite. Без бэкенда: данные в localStorage,
опциональная синхронизация с Firebase Firestore, ИИ-запросы — из браузера
напрямую к OpenAI-совместимому провайдеру.

## Слои

```
views/ (экраны)  →  store.ts (действия + правила)  →  persistence.ts (localStorage/Firestore)
                          ↓
                   types.ts (модель + чистые функции правил)
                          ↓
                   llm.ts / ai.ts (единственный ИИ-хук)
```

- **types.ts** — модель данных и чистые функции `budgetFor` / `quotaFor`
  (покрыты тестами, без DOM).
- **store.ts** — модульный стор на `useSyncExternalStore`: действия (дела,
  план дня, протокол), правила плана (квота/бюджет/слот радости), агрегаты
  (`fearStats`, `dayHistory`), миграция схем. Автосохранение с дебаунсом 400 мс.
- **persistence.ts** — localStorage (ключ `self-conveyor-state-v2`, чтение legacy
  `v1` для миграции), Firestore (`selfConveyor/state`), индикатор сохранения.
- **llm.ts** — клиент `POST {baseUrl}/chat/completions` + устойчивый парсер JSON.
- **ai.ts** — одна функция `aiProtocolHelp` (страх + микро-шаг) и `aiPing`.

## Модель данных (v2)

```ts
Item {
  id, title, notes
  cost: 1 | 2 | 3            // стоимость в «мыслетопливе»
  affect: AffectKind         // ожидаемая эмоция (аффект-фильтр)
  resistance: 0..3           // сопротивление / избегание
  microStep                  // «сделать плохо, на 2 минуты»
  joy: boolean               // кандидат в бесплатный слот «на радость»
  status: 'pool' | 'done' | 'dropped'
  runs: ProtocolRun[]        // история протокола
}

ProtocolRun { at, fear, microStep, predicted: 0..3, actual: 0..3 | null }

DayLog {
  date: 'YYYY-MM-DD'
  energy: 1..5 | null        // чекин сил
  plan: { itemId, joy, done }[]
  closed: boolean            // шторка
  evening: 1..5 | null       // вечерний тап
}

State { items, days: Record<date, DayLog>, settings, updatedAt }
```

## Ключевые правила (store.ts, протестированы)

| Правило | Функция | Гарантия |
|---|---|---|
| Бюджет = силы | `budgetFor` | сумма cost плана (без «радости») ≤ энергии |
| Квота = мин(силы, лимит) | `quotaFor` | максимум дел в дне |
| Слот «на радость» | `planAdd(id, true)` | бесплатно, один в день |
| Шторка | `closeDay` / `planAdd` | закрытый день не принимает дела |
| Сверка страха | `addProtocolRun` | `actual` уточняет `resistance` дела |
| Миграция | `migrate` | v1-списки → склад v2 без потери названий |

## Экраны

| Файл | Роль |
|---|---|
| `views/Today.tsx` | чекин сил, план, шторка, вечерний тап, кандидаты |
| `views/Protocol.tsx` | модалка протокола избегания (4 шага + таймер) |
| `views/Pool.tsx` | склад: захват, аффект-фильтр, зоны, редактор дела |
| `views/Data.tsx` | «страх против факта», силы по дням, история |
| `views/SettingsView.tsx` | квота, ИИ-ключ, Firebase, экспорт/импорт |

## Решения и trade-off

- **Всё состояние — один объект** в localStorage/Firestore: простота и атомарный
  бэкап; предел — ~1 МБ документа Firestore (тысяч хватит с запасом).
- **Модульный стор вместо Redux/Zustand** — ноль лишних зависимостей,
  `useSyncExternalStore` даёт и React-подписку, и тесты без DOM.
- **ИИ из браузера**: персональный инструмент, ключ в localStorage. Для
  публичного продукта потребовался бы серверный прокси.
- **Правила вынесены в чистые функции** — UI не считает квоты сам, это
  предотвращает расхождения и тестируется без рендера.

## Тесты (`npm test`, vitest)

`src/store.test.ts` — 14 тестов ядра: бюджет/квота, лимиты плана, слот радости,
шторка, сверки протокола и `fearStats`, завершение дел, миграция v1→v2,
дефолты `makeItem`. Граница: «правила поведения» тестируются, «вид» — нет
(тесты рендера намеренно отсутствуют как накладные расходы).

## Сборка

`npm run build` → статика в `play/` (публикация по конвенции репо: `games/<проект>/play/`;
можно на любой хостинг, включая GitHub Pages). `npm run check` — типы. Dev-сервер слушает `0.0.0.0` (превью-среда).
