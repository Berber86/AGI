// =============================================================================
//  Статическая проверка исходников: висячие ссылки.
//
//  Повод настоящий: правка через str.replace молча не применилась, и в deck.js
//  остался вызов detailModal без импорта. Модуль загружался, экран рисовался,
//  ui-smoke проходил — ReferenceError случался только в момент клика по карте.
//  Ни линковка ESM, ни отрисовка такой баг не ловят, поэтому нужен отдельный
//  статический сторож.
// =============================================================================

import { suite, test, ok, eq, ge } from './harness.mjs';
import { scanDangling, codeOnly, declaredNames, calledNames } from '../tools/lint-ui.mjs';

suite('Линт: висячие ссылки в исходниках');

test('ни один вызов в src не ссылается на необъявленное имя', async () => {
  const { files, findings } = await scanDangling('src');
  ge(files, 20, `просмотрены все исходники (файлов: ${files})`);
  eq(findings.length, 0, 'висячих ссылок нет:\n    ' + findings.join('\n    '));
});

test('сканер гасит строки и комментарии, иначе они выглядят как вызовы', () => {
  const src = [
    "const svg = `<stop offset=\"0%\" stop-color=\"url(#g)\"/>`;",   // url( в строке
    "const sel = 'button, [tabindex]:not([tabindex=\"-1\"])';",       // not( в строке
    '// stats.crafted растёт только от craft() и recruit()',           // вызовы в комментарии
    '/* и от disband() в блочном */',
    'export function real() { return helper(); }',
  ].join('\n');
  const code = codeOnly(src);
  const called = calledNames(code).map((c) => c.name);
  for (const ghost of ['url', 'not', 'craft', 'recruit', 'disband']) {
    ok(!called.includes(ghost), `«${ghost}» из строки/комментария не считается вызовом`);
  }
  // объявление функции — не вызов, иначе каждая function давала бы ложное срабатывание
  ok(!called.includes('real'), 'объявление real() не принято за вызов');
  ok(called.includes('helper'), 'настоящий вызов внутри тела найден');
  ok(declaredNames(code).has('real'), 'имя объявленной функции распознано');
  // номера строк не должны съезжать: длина сохраняется
  eq(code.length, src.length, 'пробелы той же длины, номера строк целы');
});

test('сканер видит выражения внутри ${…} шаблона', () => {
  const src = 'const s = `текст ${broken()} ещё текст`;';
  const called = calledNames(codeOnly(src)).map((c) => c.name);
  ok(called.includes('broken'), 'вызов внутри интерполяции найден');
});

test('объявленные имена распознаются во всех формах', () => {
  const src = [
    "import { a, b as c } from './x.js';",
    "import d from './y.js';",
    "import * as ns from './z.js';",
    'export function fn1() {}',
    'function fn2() {}',
    'const arrow = () => {};',
    'let counter = 0;',
    'class Klass {}',
    'const { p, q: r } = obj;',
    'const [first, second] = arr;',
    'function withDestructured({ onChange } = {}) { onChange(); }',
    'export { fn1 };',
  ].join('\n');
  const declared = declaredNames(codeOnly(src));
  for (const name of ['a', 'c', 'd', 'ns', 'fn1', 'fn2', 'arrow', 'counter', 'Klass', 'p', 'r', 'first', 'second', 'onChange']) {
    ok(declared.has(name), `имя «${name}» распознано как объявленное`);
  }
});
