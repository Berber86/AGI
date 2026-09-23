// Запуск всех тестов: `npm test` или `node tests/run.mjs`.
import { run } from './harness.mjs';

await import('./test-rng.mjs');
await import('./test-data.mjs');
await import('./test-cardgen.mjs');
await import('./test-draft.mjs');
await import('./test-battle.mjs');
await import('./test-state.mjs');
await import('./test-balance.mjs');
// статический сторож: висячая ссылка в обработчике не видна ни линковке ESM,
// ни отрисовке — она падает только в момент клика
await import('./test-lint.mjs');
// сторож оформления: класс без правила не роняет nothing — он просто
// выглядит как браузерный дефолт, и это единственный тест, который такое ловит
await import('./test-css.mjs');

// UI-набор требует jsdom — единственную dev-зависимость. Если её нет,
// набор честно пропускается, а не роняет весь прогон.
try {
  await import('jsdom');
  await import('./test-ui.mjs');
} catch (e) {
  if (e?.code === 'ERR_MODULE_NOT_FOUND' || /jsdom/.test(String(e?.message))) {
    console.log('\x1b[2m  UI-тесты пропущены: не установлен jsdom (npm install)\x1b[0m');
  } else {
    throw e;
  }
}

process.exit(await run());
