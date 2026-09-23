// =============================================================================
//  tools/lint-ui.mjs — статический поиск висячих ссылок в интерфейсе
//
//  Повод: правка через str.replace молча не применилась, и в deck.js остался
//  вызов detailModal без импорта. Модуль при этом загружается и отрисовывается
//  нормально — ReferenceError случается только в момент клика, поэтому ни
//  линковка, ни смоук, ни отрисовка экрана такой баг не ловят.
//
//  Сканер разбирает исходник на токены (код / строки / текст шаблона /
//  комментарии), собирает объявленные имена и сопоставляет с вызовами в коде.
//  Разбор на токены обязателен: без него `url(#…)` в SVG-строке, `:not(…)`
//  в CSS-селекторе и «craft()» в комментарии выглядят как вызовы функций.
//
//  Запуск: node tools/lint-ui.mjs   (код 1, если найдены висячие ссылки)
// =============================================================================

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const GLOBALS = new Set([
  // ключевые слова (они не вызовы, но попадают под шаблон `name(`)
  'if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'typeof',
  'await', 'async', 'do', 'else', 'try', 'throw', 'import', 'export',
  'case', 'default', 'finally', 'delete', 'void', 'yield', 'instanceof', 'in', 'of',
  // окружение браузера и Node
  'console', 'document', 'window', 'localStorage', 'sessionStorage', 'setTimeout',
  'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame',
  'cancelAnimationFrame', 'fetch', 'Blob', 'URL', 'FileReader', 'FormData',
  'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent', 'ErrorEvent',
  'structuredClone', 'JSON', 'Math', 'Object', 'Array', 'String', 'Number',
  'Boolean', 'Set', 'Map', 'WeakMap', 'WeakSet', 'Promise', 'Date', 'RegExp',
  'Error', 'TypeError', 'RangeError', 'isNaN', 'isFinite', 'parseInt', 'parseFloat',
  'navigator', 'HTMLElement', 'Element', 'Node', 'getComputedStyle', 'alert',
  'confirm', 'prompt', 'performance', 'crypto', 'TextEncoder', 'TextDecoder',
  'AbortController', 'matchMedia', 'DOMParser', 'XMLSerializer', 'Image',
  'IntersectionObserver', 'ResizeObserver', 'MutationObserver', 'Audio',
  'Symbol', 'Proxy', 'Reflect', 'BigInt', 'globalThis', 'queueMicrotask',
]);

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.js')) yield p;
  }
}

/**
 * Выделяет из исходника только КОД: комментарии и строковые литералы
 * заменяются пробелами той же длины (чтобы номера строк не съехали), а
 * содержимое ${…} внутри шаблонов, наоборот, сохраняется — это выражения.
 */
function codeOnly(src) {
  const out = src.split('');
  const blank = (from, to) => { for (let i = from; i < to && i < out.length; i++) if (out[i] !== '\n') out[i] = ' '; };
  let i = 0;
  const n = src.length;
  // стек для вложенных шаблонов: на каждом уровне помним, сколько ${ ещё не закрыто
  const tplBraces = [];
  while (i < n) {
    const c = src[i];
    const two = src.slice(i, i + 2);

    if (two === '//') { const end = src.indexOf('\n', i); blank(i, end < 0 ? n : end); i = end < 0 ? n : end; continue; }
    if (two === '/*') { const end = src.indexOf('*/', i + 2); blank(i, end < 0 ? n : end + 2); i = end < 0 ? n : end + 2; continue; }

    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n) { if (src[j] === '\\') { j += 2; continue; } if (src[j] === c) { j++; break; } if (src[j] === '\n') break; j++; }
      blank(i, j); i = j; continue;
    }

    if (c === '`') {
      // текст шаблона гасим, но ${…} оставляем как код
      let j = i + 1;
      out[i] = ' ';
      while (j < n) {
        if (src[j] === '\\') { out[j] = ' '; if (out[j + 1] !== '\n') out[j + 1] = ' '; j += 2; continue; }
        if (src[j] === '`') { out[j] = ' '; j++; break; }
        if (src.slice(j, j + 2) === '${') {
          out[j] = ' '; out[j + 1] = ' ';
          let depth = 1, k = j + 2;
          while (k < n && depth > 0) {
            if (src[k] === '{') depth++;
            else if (src[k] === '}') { depth--; if (depth === 0) { out[k] = ' '; break; } }
            else if (src[k] === '`') { // вложенный шаблон — обрабатываем рекурсивно тем же проходом
              let t = k + 1;
              while (t < n && src[t] !== '`') { if (src[t] === '\\') t++; t++; }
              k = t;
            }
            k++;
          }
          j = k + 1; continue;
        }
        if (src[j] !== '\n') out[j] = ' ';
        j++;
      }
      i = j; continue;
    }

    i++;
  }
  return out.join('');
}

/** Имена, объявленные в файле: импорты, функции, переменные, классы, параметры. */
function declaredNames(src) {
  const names = new Set();
  const add = (x) => { if (/^[A-Za-z_$][\w$]*$/.test(x)) names.add(x); };
  const addList = (body) => {
    for (const part of body.split(',')) {
      const t = part.trim();
      if (!t) continue;
      const as = t.split(/\s+as\s+/);
      add((as[1] || as[0]).trim());
    }
  };

  for (const m of src.matchAll(/import\s+([^;]*?)\s+from\s*['"]?[^'"\n]*['"]?/gs)) {
    const clause = m[1];
    const braces = clause.match(/\{([\s\S]*)\}/);
    if (braces) addList(braces[1]);
    const star = clause.match(/\*\s+as\s+(\w+)/);
    if (star) add(star[1]);
    const dflt = clause.replace(/\{[\s\S]*\}/, '').replace(/\*\s+as\s+\w+/, '').split(',')[0].trim();
    add(dflt);
  }

  for (const m of src.matchAll(/(?:export\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/g)) add(m[1]);
  for (const m of src.matchAll(/(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)) add(m[1]);
  for (const m of src.matchAll(/(?:export\s+)?class\s+([A-Za-z_$][\w$]*)/g)) add(m[1]);

  // деструктуризация переменных и ПАРАМЕТРОВ: const { a, b: c } = … / ({ onChange } = {})
  for (const m of src.matchAll(/(?:const|let|var)?\s*\{([^{}]*)\}\s*=/g)) {
    for (const part of m[1].split(',')) {
      const t = part.trim();
      if (!t) continue;
      const colon = t.split(/\s*:\s*/);
      const withDefault = (colon[1] || colon[0]).split(/\s*=/)[0].trim();
      add(withDefault);
    }
  }
  for (const m of src.matchAll(/(?:const|let|var)\s*\[([^\]]*)\]\s*=/g)) {
    for (const part of m[1].split(',')) add(part.trim());
  }
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) addList(m[1]);

  // параметры обычных функций и стрелок
  for (const m of src.matchAll(/\(([^()]*)\)\s*(?:=>|\{)/g)) {
    for (const part of m[1].split(',')) add(part.trim().replace(/^\.\.\./, '').split(/\s*=/)[0].trim());
  }
  for (const m of src.matchAll(/([A-Za-z_$][\w$]*)\s*=>/g)) add(m[1]);
  // локальные let/const внутри блоков (уже покрыто), метки и прочее не вызовы
  return names;
}

/** Вызовы `name(` в коде, исключая методы (`obj.name(`) и объявления. */
function calledNames(code) {
  const out = [];
  for (const m of code.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/g)) {
    const name = m[1];
    if (GLOBALS.has(name)) continue;
    // это объявление функции, а не вызов
    if (/(?:function\s*\*?\s*)$/.test(code.slice(Math.max(0, m.index - 20), m.index))) continue;
    out.push({ name, index: m.index });
  }
  return out;
}

const lineOf = (src, index) => src.slice(0, index).split('\n').length;

/**
 * Обходит каталог и возвращает найденные висячие ссылки.
 * Экспортируется: тем же кодом пользуется тестовый набор tests/test-lint.mjs,
 * чтобы проверка была частью `npm test`, а не отдельным ритуалом.
 * @param {string} dir каталог с исходниками
 * @returns {Promise<{files:number, findings:string[]}>}
 */
export async function scanDangling(dir = 'src') {
  let files = 0;
  const findings = [];
  for await (const file of walk(dir)) {
    const src = await readFile(file, 'utf8');
    files++;
    const code = codeOnly(src);
    const declared = declaredNames(code);
    const seen = new Set();
    for (const call of calledNames(code)) {
      if (declared.has(call.name) || seen.has(call.name)) continue;
      seen.add(call.name);
      findings.push(`${file}:${lineOf(src, call.index)}  ${call.name}() — не объявлено и не импортировано`);
    }
  }
  return { files, findings };
}

export { codeOnly, declaredNames, calledNames };

const isMain = process.argv[1] && /lint-ui\.mjs$/.test(process.argv[1]);
if (isMain) {
  const { files, findings } = await scanDangling('src');
  console.log(`просмотрено файлов: ${files}`);
  console.log(`висячих ссылок: ${findings.length}`);
  if (findings.length) { console.log(''); for (const r of findings) console.log('  ' + r); }
  else console.log('\n✅ Все вызываемые имена объявлены или импортированы');
  process.exit(findings.length ? 1 : 0);
}
