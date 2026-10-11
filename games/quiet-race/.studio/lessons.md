# Lessons

Record only evidence-backed lessons.

## Template

- **Context:**
- **Symptom:**
- **Root cause:**
- **Fix:**
- **Validation:**
- **Workflow change:**

## Интерактивные зоны контейнеров должны учитывать displayOrigin

- **Context:** все кнопки — это `Phaser.GameObjects.Container` с `setSize(size, size)` и круговой интерактивной зоной.
- **Symptom:** нажатия на центр большой кнопки «Едем!» не срабатывали ни в jsdom, ни, скорее всего, в браузере; `hitTestPointer` возвращал 0 объектов.
- **Root cause:** `Phaser.Input.InputManager.pointWithinHitArea` прибавляет к локальной точке `displayOriginX/Y` перед вызовом `hitAreaCallback`. Круг `new Phaser.Geom.Circle(0, 0, r)` при этом смещается в левый верхний угол кнопки.
- **Fix:** центр интерактивного круга равен `displayOrigin`: `new Phaser.Geom.Circle(size * 0.5, size * 0.5, r)`.
- **Validation:** `pointWithinHitArea(item, 0, 0)` → `true`; прогон `scripts/headless-run.mjs` доходит от гаража до финиша через настоящие касания.
- **Workflow change:** для любой кастомной интерактивной зоны проверять хит-тест в центре объекта, а не только факт `setInteractive`.

## jsdom не присылает Phaser pointer-события

- **Context:** безголовый прогон игры в jsdom с Skia-канвасом.
- **Symptom:** синтетический `PointerEvent('pointerdown')` оставлял `activePointer` в (0,0) и `isDown: false`.
- **Root cause:** `Phaser.Input.Mouse.MouseManager` подписывается на `mousedown`/`mouseup`/`mousemove` (строки 470–475), а `TouchManager` — на `touchstart`; события `pointerdown` Phaser сам не слушает, а jsdom не генерирует совместимые mouse-события из синтетических pointer-событий.
- **Fix:** в харнессе рассылать и pointer-, и legacy mouse-события (`scripts/headless-run.mjs`), а в браузере ничего менять не нужно.
- **Validation:** после этого касания попали в кнопку и заезд пошёл в выбранном темпе.
- **Workflow change:** при синтетическом вводе для Phaser всегда дублировать событие в legacy-форме.

## Повторный вход в сцену переиспользовал уничтоженные объекты

- **Context:** игрок возвращается из финиша в гараж кнопкой «В гараж».
- **Symptom:** `TypeError: Cannot read properties of undefined (reading 'setStrokeStyle')` и неработающая кнопка «Едем!» после возврата.
- **Root cause:** Phaser уничтожает игровые объекты при завершении сцены, а `GarageScene` хранил массивы вариантов (`colorOptions` и т. п.) в полях экземпляра и заполнял их повторно, не очищая — при выборе цвета вызывался `getAt(0)` уже уничтоженного контейнера.
- **Fix:** массивы сбрасываются в начале `create()`, а `refreshSelection` проверяет `node.active` и наличие детей.
- **Validation:** прогон `npm run qa` — шаги `back-to-garage` и `restart` проходят без ошибок.
- **Workflow change:** любое поле с игровыми объектами в сцене Phaser должно обнуляться в `create()`, а не в конструкторе.

## Замена строк в собранном коде: только через функцию

- **Context:** сборка одного автономного HTML-файла: движок вставляется внутрь `<script>`.
- **Symptom:** код молча портился (`et.x<=_&&` превращалось в `et.x<=</body>&`), браузер падал с `SyntaxError: Unexpected token '<'`.
- **Root cause:** в минифицированном коде встречается последовательность `$&`, а в строке замены `String.replace` она означает «вставить найденный текст» — вместо кода подставлялся `</body>`.
- **Fix:** вставка через функцию-замену (`.replace('</body>', () => ...)`) и экранирование `</script` внутри кода.
- **Validation:** `dist-offline/index.html` содержит один `<script>`, прогон `--offline` проходит 4/4.
- **Workflow change:** никогда не подставлять сгенерированный код в `replace` строкой — только функцией; проверять число тегов в готовом файле.
