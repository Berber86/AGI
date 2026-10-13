#!/usr/bin/env node
/**
 * Sanity check of the shipped build, run after `npm run build`.
 *
 * It catches the failure that once left the game stuck on «Заводим машинку…»:
 * HTML that points at a bundle that is not in the build any more (an old cached
 * page plus a fresh deploy), and a service worker that would serve that stale
 * page forever.
 *
 * Usage: node scripts/check-build.mjs [distDir]
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.resolve(ROOT, process.argv[2] ?? 'dist');

const problems = [];
const html = readFileSync(path.join(DIST, 'index.html'), 'utf8');

// 1. Every local asset referenced by the page must exist in the build.
const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
for (const reference of references) {
  if (/^(https?:|data:|#|mailto:)/.test(reference)) continue;
  const clean = reference.split('?')[0].split('#')[0];
  const file = path.join(DIST, clean.replace(/^\.\//, ''));
  if (!existsSync(file)) problems.push(`index.html ссылается на отсутствующий файл: ${clean}`);
}

// 2. The page must load exactly one bundle, and the boot guard must be inside.
const scripts = [...html.matchAll(/<script([^>]*)>/g)].map((match) => match[1]);
const bundleTags = scripts.filter((tag) => /\ssrc=/.test(tag));
if (bundleTags.length !== 1) problems.push(`в index.html ожидается один подключаемый скрипт, найдено ${bundleTags.length}`);
if (!html.includes('Заводим машинку')) problems.push('в index.html нет надписи загрузки');
if (!html.includes('boot-retry')) problems.push('в index.html нет кнопки «Загрузить заново» на случай ошибки');
if (!html.includes('__quietRaceBootClear')) problems.push('в index.html нет функции, скрывающей надпись загрузки');

// 3. The service worker must never serve HTML in place of code, and must be network-first.
const sw = readFileSync(path.join(DIST, 'sw.js'), 'utf8');
if (/caches\s*\.\s*match\s*\(\s*'\.\/index\.html'\s*\)/.test(sw) && !/request\.mode === 'navigate'/.test(sw)) {
  problems.push('sw.js отдаёт index.html для запросов кода — это и приводит к вечной надписи загрузки');
}
if (!/network-first/i.test(sw)) problems.push('sw.js не помечает сетевой приоритет (network-first)');
if (!/caches\s*\.\s*keys\s*\(\s*\)/.test(sw)) problems.push('sw.js не удаляет старые версии кэша');

// 4. Report the bundle size, so the offline budget stays visible.
const assets = existsSync(path.join(DIST, 'assets')) ? readdirSync(path.join(DIST, 'assets')) : [];
const totalBytes = assets.reduce((sum, name) => sum + readFileSync(path.join(DIST, 'assets', name)).length, 0);

if (problems.length) {
  console.error('Проверка сборки не пройдена:');
  for (const problem of problems) console.error(` - ${problem}`);
  process.exit(1);
}
console.log(`Проверка сборки пройдена: ${references.length} ссылок, 1 бандл, sw.js в порядке, assets ${Math.round(totalBytes / 1024)} КБ`);
