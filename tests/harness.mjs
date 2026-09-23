// Минимальная обвязка для тестов без внешних зависимостей.
const tests = [];
let currentSuite = '';

export function suite(name) { currentSuite = name; }

export function test(name, fn) { tests.push({ name: `${currentSuite} · ${name}`, fn }); }

export class AssertError extends Error {}

export function ok(cond, msg = 'ожидалось истина') { if (!cond) throw new AssertError(msg); }
export function eq(a, b, msg = '') { if (a !== b) throw new AssertError(`${msg} ожидалось ${JSON.stringify(b)}, получено ${JSON.stringify(a)}`); }
export function ne(a, b, msg = '') { if (a === b) throw new AssertError(`${msg} не ожидалось ${JSON.stringify(b)}`); }
export function ge(a, b, msg = '') { if (!(a >= b)) throw new AssertError(`${msg} ожидалось ≥ ${b}, получено ${a}`); }
export function le(a, b, msg = '') { if (!(a <= b)) throw new AssertError(`${msg} ожидалось ≤ ${b}, получено ${a}`); }
export function deepEq(a, b, msg = '') {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new AssertError(`${msg}\n  ожидалось: ${B}\n  получено:  ${A}`);
}
export function throws(fn, msg = 'ожидалось исключение') {
  let threw = false;
  try { fn(); } catch { threw = true; }
  if (!threw) throw new AssertError(msg);
}

export async function run() {
  let pass = 0;
  const failed = [];
  for (const t of tests) {
    try { await t.fn(); pass++; }
    catch (e) { failed.push({ name: t.name, err: e }); }
  }
  const green = (s) => `\x1b[32m${s}\x1b[0m`;
  const red = (s) => `\x1b[31m${s}\x1b[0m`;
  const dim = (s) => `\x1b[2m${s}\x1b[0m`;
  for (const f of failed) {
    console.log(red('  ✗ ' + f.name));
    console.log(dim('      ' + String(f.err.message || f.err).split('\n').join('\n      ')));
  }
  console.log(`\n${green(pass + ' пройдено')}${failed.length ? ', ' + red(failed.length + ' провалено') : ''} · всего ${tests.length}`);
  return failed.length ? 1 : 0;
}
