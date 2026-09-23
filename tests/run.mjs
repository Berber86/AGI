// Запуск всех тестов: `npm test` или `node tests/run.mjs`.
import { run } from './harness.mjs';

await import('./test-rng.mjs');
await import('./test-data.mjs');
await import('./test-cardgen.mjs');
await import('./test-battle.mjs');
await import('./test-state.mjs');
await import('./test-balance.mjs');

process.exit(await run());
