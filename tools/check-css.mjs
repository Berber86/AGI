// =============================================================================
//  tools/check-css.mjs — страховка редизайна.
//  Собирает все классы, которые реально создаёт разметка (src/ui/**), и
//  проверяет, что для каждого в стилях есть хотя бы одно правило. После
//  переписывания styles.css это защищает от «класс есть, а оформления нет» —
//  именно так дизайн тихонько разваливается на отдельные элементы.
// =============================================================================
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.js')) out.push(p);
  }
  return out;
}

/** Классы, которые создаёт разметка. */
export function markupClasses() {
  const set = new Set();
  for (const file of walk(join(ROOT, 'src'))) {
    const src = readFileSync(file, 'utf8');
    // class: 'a b', class: `a ${x} b`, class: ['a','b'].join(' ')
    for (const m of src.matchAll(/class:\s*(['"`])([^'"`]*)\1/g)) {
      for (const c of m[2].split(/[\s${}]+/)) if (/^[a-z][a-zA-Z0-9_-]*$/.test(c)) set.add(c);
    }
    for (const m of src.matchAll(/class:\s*\[([^\]]*)\]/g)) {
      for (const q of m[1].matchAll(/(['"`])([^'"`]*)\1/g)) {
        for (const c of q[2].split(/\s+/)) if (/^[a-z][a-zA-Z0-9_-]*$/.test(c)) set.add(c);
      }
    }
    for (const m of src.matchAll(/class="([^"]+)"/g)) {
      for (const c of m[1].split(/\s+/)) if (/^[a-z][a-zA-Z0-9_-]*$/.test(c)) set.add(c);
    }
    // динамические суффиксы: `card--${size}` → регистрируем базовое имя
    for (const m of src.matchAll(/class:\s*`([^`]*)`/g)) {
      for (const c of m[1].split(/\s+/)) {
        const base = c.split('$')[0].replace(/-+$/, '');
        if (/^[a-z][a-zA-Z0-9_-]*$/.test(base) && base.length > 2) set.add(base);
      }
    }
  }
  return set;
}

/** Классы, упомянутые в тестах (их нельзя терять — на них завязаны проверки). */
export function testClasses() {
  const set = new Set();
  for (const file of walk(join(ROOT, 'tests'))) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/\.([a-z][a-zA-Z0-9_-]{2,})/g)) set.add(m[1]);
  }
  return set;
}

/** Классы, для которых в CSS есть правило. */
export function styledClasses(cssText = readFileSync(join(ROOT, 'styles.css'), 'utf8')) {
  const set = new Set();
  const noComments = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of noComments.matchAll(/\.(-?[a-zA-Z_][a-zA-Z0-9_-]*)/g)) set.add(m[1]);
  return set;
}

// Отчёт печатаем только при запуске из командной строки: файл импортируется
// тестами, а process.exit на импорте убил бы весь прогон.
const isCli = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isCli) {
  const markup = markupClasses();
  const styled = styledClasses();
  const missing = [...markup].filter((c) => !styled.has(c)).sort();
  // «мусорные» имена из шаблонных строк, которые классами не являются
  const IGNORE = new Set(['class', 'div', 'span', 'svg', 'text', 'true', 'false', 'null', 'undefined']);
  const real = missing.filter((c) => !IGNORE.has(c) && !/^(v-|d\.|t\.|a$|l$|n$|g$|m$|id$|ok$|dim$)/.test(c));
  console.log(`классов в разметке: ${markup.size}`);
  console.log(`классов со стилями: ${styled.size}`);
  console.log(`без правил: ${real.length}`);
  if (real.length) console.log('  ' + real.join(' '));
}
