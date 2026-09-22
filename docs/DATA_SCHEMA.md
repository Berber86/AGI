# Схема данных Cog Empires

Все типы живут в `src/engine/unit/unit.types.ts`, `src/engine/combat/combat.types.ts`,
`src/data/techs.ts`, `src/store/gameState.types.ts`. Ниже — сводка.

## Экипировка

| Тип | Назначение |
|---|---|
| `Rarity` | `common → uncommon → rare → epic → legendary` |
| `GearSlot` | `weapon / armor / trinket / core` — ровно 4 слота |
| `Stats` | 12 статов: hp, atk, def, spd, acc, eva, crit, critDmg, range, morale, lifesteal, armorPen |
| `GearDef` | Определение предмета в пуле: id, слот, редкость, setId?, статы, способности |
| `GearInstance` | Экземпляр у игрока: uid, defId, quality (0.85–1.15), affixes[], cycle |
| `Affix` | `{ stat, value }` — случайный бонус экземпляра |
| `GearSetDef` | Сет: бонусы за 2/3/4 предмета (статы, %статы, способности) |

## Юнит

| Тип | Назначение |
|---|---|
| `RecruitDef` | Шаблон рекрута: базовые статы, теги, таргетинг, стоимость, unlockTech |
| `SquadSetup` | Отряд до расчёта: recruitId + gear (по слотам) + line (0–4) + column (0–9) + statScale |
| `ComputedUnit` | Полный расчёт: статы, теги, слитые способности, редкость, setCounts — вход боя |
| `UnitTag` | melee/ranged/infantry/cavalry/magic/beast/undead/human/boss/fearless |
| `Ability` | Дискриминированное объединение из 10 ключей с параметрами |
| `Modifier` | stat / production / lootRarity / lootCount / craftDiscount / ability — от техов, догм, зданий |

## Бой

| Тип | Назначение |
|---|---|
| `BattleUnitState` | Юнит внутри симуляции: hp/shield/morale/poison, hpFlags, kills… |
| `BattleEvent` | Кадр симуляции: phase, roundStart, attack, dot, heal, status, morale, death, rout, advance, skip, end |
| `BattleResult` | seed, winner, rounds, events[], initial[], final[] |
| `FIELD` | `{ columns: 10, rows: 20, linesPerSide: 5, rowsPerLine: 2 }` |

`BattleEvent` — единственный источник истины для UI: по нему восстанавливается
любой момент боя (`displayState(result, frame)`), пишется лог и вешаются анимации.

## Экономика и кампания

| Тип | Назначение |
|---|---|
| `BuildingDef` | maxLevel, baseCost × costGrowth^(lvl−1), production/perLevel, unlockTech |
| `TechDef` | era 1–3, cost (наука), requires[], icons[], effects[] |
| `DogmaDef` | requires: Partial<Record<TechIcon, number>>, effects[] |
| `CampaignNodeDef` | id, layer (0–7), kind (battle/elite/rest/treasure/boss), next[] |
| `Encounter` | Детерминированный отряд врагов для узла: enemies[], statScale |

## Сохранение (localStorage: `cog-empires-save-v1`)

`GameData` = { version, cycle, day, campaignSeed, resources, buildings, techs,
collection: GearInstance[], squads: Squad[], campaign: {currentNodeId, completed[],
skirmishCount, battleAttempts}, stats: PlayerStats, battle: ActiveBattle | null, notices[] }.

`Squad` хранит **uid предметов**, а не сами предметы. Версия схемы (`version`) —
на будущее миграций: несовпадение = сброс сохранения.
