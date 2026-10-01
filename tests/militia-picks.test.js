const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');

/** Загружает src/game/cards.ts с минимальной заглушкой модели: нужны только функции ополчения. */
function loadCards() {
  const file = path.join(root, 'src', 'game', 'cards.ts');
  const javascript = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
  const mod = { exports: {} };
  const sandbox = {
    module: mod,
    exports: mod.exports,
    require(name) {
      if (name === './model') return { M: {} };
      throw new Error(`Unexpected import ${name}`);
    },
    console, Date, Math, JSON, Promise,
  };
  vm.runInNewContext(javascript, sandbox, { filename: file, timeout: 3000 });
  return mod.exports;
}

const cards = loadCards();

test('пул ополчения открывает бронзовых бойцов со второй эпохи', () => {
  const ancient = cards.militiaPool(0).map((c) => c.name);
  const bronze = cards.militiaPool(1).map((c) => c.name);
  assert.ok(ancient.includes('Племенные копейщики'));
  assert.equal(ancient.includes('Бронзовые наёмники'), false);
  assert.equal(bronze.includes('Бронзовые наёмники'), true);
});

test('выбранные ополченцы идут первыми и в порядке выбора', () => {
  const pool = cards.militiaPool(0);
  const picks = [pool[3].id, pool[1].id];
  const fill = cards.militiaFill(picks, 0);
  assert.equal(fill.length, pool.length);
  // массивы приходят из vm-песочницы: сравниваем по значению, а не по прототипу
  assert.equal(JSON.stringify(fill.slice(0, 2).map((c) => c.id)), JSON.stringify(picks));
  // остальные карты пула не теряются и не дублируются
  assert.equal(new Set(fill.map((c) => c.id)).size, fill.length);
});

test('неизвестный или устаревший выбор уходит в конец, а не ломает бой', () => {
  const fill = cards.militiaFill(['militia-Кого-то нет', 'militia-Пращники из холмов'], 0);
  assert.equal(fill[0].name, 'Пращники из холмов');
  assert.equal(fill.length, cards.militiaPool(0).length);
});

test('без выбора ополчение всё равно заполняет свободные слоты', () => {
  const fill = cards.militiaFill([], 0);
  assert.ok(fill.length >= 5);
  assert.ok(fill.every((c) => c.name && c.drop_cost >= 0));
});

test('в учебном бою враг приходит без построек', () => {
  const pool = cards.buildMilitia();
  assert.ok(pool.some((c) => c.card_type === 'structure'), 'в пуле есть постройки');
  const trimmed = cards.withoutStructures(pool);
  assert.equal(trimmed.some((c) => c.card_type === 'structure'), false);
  assert.ok(trimmed.length >= 6, 'бойцы остаются на месте');
});
