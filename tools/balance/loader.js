/**
 * Загрузчик боевого движка для стендов баланса.
 *
 * `src/game/battle.ts` — модуль TypeScript с импортом `./cards`; чтобы не тащить сборку Vite,
 * транспилируем его тем же `typescript`, что лежит в devDependencies, и выполняем в vm-песочнице
 * с подставным `./cards` (стенду нужны боевые правила, а не кузница). Приём тот же, что в
 * tests/stone-age-content.test.js, — стенд обязан считать тем же кодом, что и игра.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..', '..');
const ts = require(path.join(ROOT, 'node_modules', 'typescript'));

/** Транспилирует файл игры и возвращает его CommonJS-экспорт. */
function loadTranspiled(relativePath, { append = '', require: requireShim } = {}) {
  const file = path.join(ROOT, relativePath);
  let javascript = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: file,
  }).outputText;
  if (append) javascript += `\n${append}\n`;
  const sandbox = {
    module: { exports: {} }, exports: {}, require: requireShim,
    console, setTimeout, clearTimeout, Date, Math, JSON, Object, Array, String, Number,
    Map, Set, Symbol, Boolean, Error, RegExp, isNaN, isFinite, parseInt, parseFloat,
  };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(javascript, sandbox, { filename: relativePath, timeout: 5000 });
  return sandbox.module.exports;
}

/** Боевой движок вместе с внутренними оценками ИИ, которые использует стенд. */
function loadBattle() {
  let ids = 0;
  const battle = loadTranspiled('src/game/battle.ts', {
    append: 'exports.__internals = { enemyAttackScore, aiUnitValue, aiUnitLoss, calculateHitDamage, areaDamage, has, isRanged, standsDeep };',
    require: (name) => {
      if (name === './cards') return { buildMilitia: () => [], uid: () => `u${++ids}` };
      throw new Error(`Неожиданный импорт ${name}`);
    },
  });
  return { ...battle, __internals: battle.__internals };
}

module.exports = { loadBattle, loadTranspiled, ROOT };
