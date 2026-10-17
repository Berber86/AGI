# Lessons

## Сырой ShaderMaterial в three.js r169 не проходит тон-маппинг

- **Context:** поверхность воды, взвесь и пузырьки написаны на `ShaderMaterial`.
- **Symptom:** верх кадра почти чёрный: замер дал RGB (4, 62, 90) вместо
  ожидаемого цвета тумана RGB (31, 134, 160).
- **Root cause:** `new THREE.Color(hex)` при включённом ColorManagement хранит
  **линейное** значение, а сырой шейдер пишет его в sRGB-буфер напрямую: three
  не добавляет в такие материалы ни `tonemapping_fragment`, ни
  `colorspace_fragment`.
- **Fix:** в конец `main()` добавлены `#include <tonemapping_fragment>` и
  `#include <colorspace_fragment>` (для `ShaderMaterial` они работают, потому что
  `toneMapped` по умолчанию `true`).
- **Validation:** после правки яркость верхних полос кадра выросла с 48 до 89–97,
  средняя по кадру — со 119 до 138, «солнечное окно» при взгляде вверх даёт 187.
- **Workflow change:** любой собственный `ShaderMaterial`, который пишет цвет,
  обязан заканчиваться этими двумя инклюдами; проверять числом, а не на глаз.

## mergeGeometries не смешивает индексированные и неиндексированные геометрии

- **Context:** сборка кита и ветвящихся кораллов из частей.
- **Symptom:** `BufferGeometryUtils: .mergeGeometries() failed with geometry at
  index 4`, затем `Cannot read properties of null`.
- **Root cause:** цилиндр и сфера индексированы, а `IcosahedronGeometry` — нет.
- **Fix:** общий хелпер `mergeParts()`, приводящий всё к неиндексированному виду
  (`toNonIndexed()`), и `body.toNonIndexed()` для кита.
- **Validation:** игра собирается, кит и кораллы видны; `sceneqa` считает виды.
- **Workflow change:** перед любой склейкой частей из разных конструкторов
  геометрий — сначала приводить к единому виду.

## Знак pitch в трекере меток

- **Context:** первая версия теста `camqa` ожидала `pitch > 0` при метке вверху
  кадра.
- **Symptom:** тест упал: `pitch = -17.7`.
- **Root cause:** физика обратная ожиданию теста — голова вверх уводит
  неподвижную метку **вниз** кадра, поэтому «смотрим вверх» = метка внизу = v
  растёт = `pitch > 0`. Код был прав, тест — нет.
- **Fix:** тест feeding'а исправлен (метка внизу кадра → `pitch > 0`, метка
  вверху → `pitch < 0`); формула `anglesFromCentroid` не тронута.
- **Validation:** CAMQA 24/24, оба знака проверяются отдельными проверками.
- **Workflow change:** знаки углов метки покрывать двумя симметричными тестами,
  иначе ошибка в тесте маскируется под ошибку в коде.

## Результат дуального трекера должен повторять контракт одиночного

- **Context:** `injectEmpty()` в режиме двух меток.
- **Symptom:** тест читал `res.found` — `undefined`, проверка «меток нет»
  падала при правильном внутреннем состоянии трекера.
- **Root cause:** `_applyDualResult()` возвращал сырой результат анализа
  (`{dual, markers}`), а не состояние трекера.
- **Fix:** перед возвратом проставляем `res.found = this.found` и
  `res.state = this.pairState` — так же, как у одиночной метки.
- **Validation:** CAMQA 24/24.
- **Workflow change:** у всех входов трекера одинаковый контракт возврата.

## devicePixelRatio прячет разницу пресетов в headless

- **Context:** проверка «пресет меняет разрешение».
- **Symptom:** `dpr` был равен 1 и на «Красиво», и на «Плавно`.
- **Root cause:** в headless `devicePixelRatio = 1`, а код берёт
  `min(devicePixelRatio, preset.dpr)`.
- **Fix:** в `sceneqa` включён `deviceScaleFactor: 3` — как у телефона.
- **Validation:** `dpr` 1.75 → 1.25 → 1.0, SCENEQA 15/15.
- **Workflow change:** тесты качества картинки запускать с эмуляцией dpr
  устройства, иначе часть логики не покрыта.
