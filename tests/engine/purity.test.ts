import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Страж чистоты движка (Фаза 5): симуляция должна выполняться изолированно
 * на сервере. Тест сканирует исходники src/engine и запрещает:
 *  - Math.random (случайность только через Rng(seed))
 *  - обращение к браузеру/DOM/localStorage
 *  - импорты React/store/components (слоёная архитектура)
 * Нарушение = упавший CI, а не «как-нибудь потом».
 */

const ENGINE_DIR = join(__dirname, '..', '..', 'src', 'engine');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
}

const files = walk(ENGINE_DIR);
expect(files.length).toBeGreaterThan(5);

/** Наивная, но достаточная зачистка комментариев — гвард смотрит только на код. */
function stripComments(src: string): string {
  const noUrls = src.replace(/https?:\/\//g, 'URL');
  return noUrls
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((line) => line.replace(/(^|[^:])\/\/[^']*/, '$1'))
    .join('\n');
}

const FORBIDDEN_PATTERNS: [RegExp, string][] = [
  [/Math\.random/, 'Math.random — случайность только через utils/rng (Rng)'],
  [/localStorage/, 'localStorage — только в store/persistence'],
  [/\bwindow\b/, 'window — движок не знает о браузере'],
  [/\bdocument\b/, 'document — движок не знает о DOM'],
  [/from ['"]react['"]/i, 'React в движке запрещён'],
  [/from ['"]zustand['"]/i, 'Zustand в движке запрещён'],
  [/@\/store\//, 'импорт стора в движок нарушает слои'],
  [/@\/components\//, 'импорт компонентов в движок нарушает слои'],
];

describe('пурити-гвард: движок изолирован и детерминирован', () => {
  it('в движке есть файлы для сканирования', () => {
    expect(files.length).toBeGreaterThan(5);
  });

  for (const file of files) {
    it(`${file.replace(ENGINE_DIR, 'engine')} чист`, () => {
      const src = stripComments(readFileSync(file, 'utf-8'));
      for (const [pattern, why] of FORBIDDEN_PATTERNS) {
        expect(src, why).not.toMatch(pattern);
      }
    });
  }

  it('случайность в src/data тоже только детерминированная', () => {
    const dataDir = join(__dirname, '..', '..', 'src', 'data');
    for (const f of walk(dataDir)) {
      const src = readFileSync(f, 'utf-8');
      expect(src, `${f}: Math.random запрещён в данных`).not.toMatch(/Math\.random/);
    }
  });
});
