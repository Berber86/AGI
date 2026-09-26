// tests/smoke.mjs — безголовый прогон симуляции: движок в Node, без DOM и canvas.
// Запуск: node tests/smoke.mjs
// Проверяет: отсутствие исключений, работоспособность всех событий, сохранение/загрузку.

import { Game } from '../js/core.js';
import { CFG } from '../js/config.js';
import { SPECIES_BY_ID, FOOD_KINDS } from '../js/species.js';
import { RNG } from '../js/util.js';
import { PARTS } from '../js/parts.js';

function stubMeta() {
  const ach = new Set();
  const codex = new Set();
  return {
    ach, codex,
    settings: { quality: 'medium', audio: false, showHints: false, particles: 1 },
    runs: [],
    onRunEnd(g, info) { this.runs.push({ won: info.won, tier: g.player.tier, time: g.time }); },
  };
}

function randomInput(rng, t) {
  // имитация палец-на-экране: ось меняется рывками, кусаем постоянно
  const a = t * 0.7 + Math.sin(t * 0.13) * 3;
  return {
    ax: Math.cos(a), ay: Math.sin(a),
    bite: true,
    dash: rng.chance(0.02),
    ability: rng.chance(0.01),
    abilityHeld: false,
  };
}

let failures = 0;
const check = (cond, msg) => { if (!cond) { console.error('  ✗ ' + msg); failures++; } else console.log('  ✓ ' + msg); };

console.log('— Создание мира —');
const meta = stubMeta();
const game = new Game({
  settings: meta.settings, meta, difficulty: 'normal', lineage: 'omni', seed: 12345,
});
check(game.creatures.length > 0, `существа созданы (${game.creatures.length})`);
check(game.foods.length > 0, `еда создана (${game.foods.length})`);
check(game.features.length > 50, `объекты мира созданы (${game.features.length})`);
check(game.relicSpots.length === CFG.world.relicCount, `реликтовых полей: ${game.relicSpots.length}`);

console.log('— Длительный прогон (6 минут игрового времени) —');
const rng = new RNG(999);
let frames = 0, errors = 0;
const t0 = Date.now();
try {
  for (let i = 0; i < 60 * 60 * 6; i++) {
    game.update(1 / 60, randomInput(rng, i / 60));
    frames++;
    if (i % 600 === 300) game.player.hp = game.player.maxHp;   // тестируем рост, а не смерть
    if (game.boss) game.hitCreature(game.boss, 30, { fromPlayer: true });   // ускоряем финальный бой
  }
} catch (e) { errors++; console.error('  ✗ исключение на кадре', frames, e); }
const ms = Date.now() - t0;
check(errors === 0, `симуляция без исключений (${frames} кадров за ${ms} мс, ${(ms / frames).toFixed(3)} мс/кадр)`);
check(game.player.tier >= 5, `клетка выросла до размера ${game.player.tier}`);
check(game.player.counters.kills >= 0, `убийств: ${game.player.counters.kills}`);
check(game.codex.size > 2, `изучено видов: ${game.codex.size}`);
check(game.creatures.length < CFG.spawn.maxCells * 2, `популяция под контролем: ${game.creatures.length}`);
check(game.particles.length <= CFG.spawn.maxParticles + 200, `частиц не больше лимита: ${game.particles.length}`);
check(Number.isFinite(game.player.x) && Number.isFinite(game.player.y), 'координаты игрока конечны');
check(game.player.dna >= 0 && Number.isFinite(game.player.dna), `ДНК корректно: ${Math.round(game.player.dna)}`);

console.log('— Все события океана —');
for (const id of ['bloom', 'tide', 'migration', 'predator', 'carcass', 'spores']) {
  try {
    game.events.force(id);
    for (let i = 0; i < 60 * 12; i++) game.update(1 / 60, randomInput(rng, i / 60));
    check(true, `событие «${id}» отработало`);
  } catch (e) { failures++; console.error('  ✗ событие', id, e); }
  game.events.end();
}

console.log('— Финальная схватка —');
try {
  game.player.relicGenes = 3;
  game.startFinale();
  check(!!game.boss, 'Левиафан появился');
  for (let i = 0; i < 60 * 40; i++) {
    game.update(1 / 60, randomInput(rng, i / 60));
    if (game.boss) { game.hitCreature(game.boss, 25, { fromPlayer: true }); game.player.hp = game.player.maxHp; }
    else break;
  }
  check(!game.boss, 'босс побеждён или исчез');
  check(game.player.flags.bossKilled || game.won, 'финал засчитан');
} catch (e) { failures++; console.error('  ✗ финал:', e); }

console.log('— Мирная концовка: гены, донесённые в гнездо —');
try {
  const g3 = new Game({ settings: meta.settings, meta: stubMeta(), difficulty: 'normal', lineage: 'herb', seed: 31337 });
  let won = null;
  g3.on('win', ({ reason }) => { won = reason; });
  for (const f of g3.relicSpots.slice(0, 3)) {
    f.hasRelic = false; f.relicTimer = 0;
  }
  // телепортируем гены к игроку, собираем их
  for (let i = 0; i < 3; i++) {
    const f = g3.relicSpots[i];
    g3.spawnFood('relic', g3.player.x + 6 + i * 4, g3.player.y, { life: 9999 });
    f.hasRelic = true;
  }
  for (let i = 0; i < 240 && g3.player.relicGenes < 3; i++) g3.update(1 / 60, { ax: 0, ay: 0, bite: false });
  check(g3.player.relicGenes === 3, `собрано древних генов: ${g3.player.relicGenes}`);
  check(!!g3.boss, 'Левиафан разбужен сбором генов');
  for (let i = 0; i < 60 * 30 && !won; i++) {
    // держим курс домой
    const dx = g3.player.nestPos.x - g3.player.x, dy = g3.player.nestPos.y - g3.player.y;
    const d = Math.hypot(dx, dy) || 1;
    g3.update(1 / 60, { ax: dx / d, ay: dy / d, bite: false, dash: false, ability: false });
    g3.player.hp = g3.player.maxHp;
    if (g3.boss) g3.boss.x = 9000;   // проверяем именно мирный путь
  }
  check(won === 'nest', `победа через гнездо: ${won}`);
  check(g3.won, 'стадия засчитана пройденной');
} catch (e) { failures++; console.error('  ✗ мирная концовка:', e); }

console.log('— Геном: все органеллы устанавливаются и работают —');
try {
  const ids = Object.keys(PARTS);
  for (const id of ids) {
    game.player.dna = 99999;
    game.ach.add(PARTS[id].reqAch ?? 'x');
    game.player.tier = 10;
    const r = (await import('../js/player.js')).tryEvolve(game, id);
    if (!r.ok && r.msg !== 'Уже максимальный уровень' && !/Нет свободных ячеек/.test(r.msg)) {
      failures++; console.error('  ✗ не удалось поставить', id, r.msg);
    }
  }
  const { recomputeStats } = await import('../js/player.js');
  recomputeStats(game.player);
  const st = game.player.stats;
  check(Number.isFinite(st.baseSpeed) && st.baseSpeed > 0, `скорость корректна: ${st.baseSpeed.toFixed(1)}`);
  check(Number.isFinite(st.maxHp) && st.maxHp > 0, `здоровье корректно: ${st.maxHp}`);
  check(Number.isFinite(st.upkeep), `обмен веществ: ${st.upkeep.toFixed(2)}/с`);
  for (let i = 0; i < 60 * 20; i++) game.update(1 / 60, randomInput(rng, i / 60));
  check(true, 'мир пережил игру с полным геномом');
} catch (e) { failures++; console.error('  ✗ геном:', e); }

console.log('— Сохранение и загрузка —');
try {
  const data = JSON.parse(JSON.stringify(game.serialize()));
  const loaded = Game.deserialize(data, { settings: meta.settings, meta, difficulty: 'normal' });
  check(loaded.player.tier === game.player.tier, `размер сохранён: ${loaded.player.tier}`);
  check(Math.abs(loaded.player.dna - game.player.dna) < 1, 'ДНК сохранена');
  check(loaded.creatures.length > 0, `существа восстановлены: ${loaded.creatures.length}`);
  check(Object.keys(loaded.player.parts).length === Object.keys(game.player.parts).length, 'геном восстановлен');
  for (let i = 0; i < 600; i++) loaded.update(1 / 60, randomInput(rng, i / 60));
  check(true, 'загруженный мир работает');
} catch (e) { failures++; console.error('  ✗ сохранение:', e); }

console.log('— Смерть и возрождение —');
try {
  const g2 = new Game({ settings: meta.settings, meta, difficulty: 'abyss', lineage: 'carn', seed: 777 });
  let died = false;
  g2.on('death', () => { died = true; });
  // хищник прямо по курсу: клетка должна погибнуть, если не убегает
  const hunter = g2.spawnCreature(SPECIES_BY_ID.giganteus, g2.player.x + 60, g2.player.y, 9, true);
  hunter.hunt = { t: 999 };
  for (let i = 0; i < 60 * 90 && !died; i++) {
    g2.update(1 / 60, { ax: 0, ay: 0, bite: false, dash: false, ability: false });
    hunter.hunt = { t: 999 };
  }
  check(died, 'смерть от хищника наступает');
  check(meta.runs.length > 0, 'профиль получил итог жизни');
  check(!g2.player.alive, 'после смерти клетка неактивна');
} catch (e) { failures++; console.error('  ✗ смерть:', e); }

console.log('— Целостность данных —');
check(Object.keys(FOOD_KINDS).length >= 6, `видов биомассы: ${Object.keys(FOOD_KINDS).length}`);
for (const id in SPECIES_BY_ID) {
  const sp = SPECIES_BY_ID[id];
  for (const pid in (sp.parts ?? {})) check(!!PARTS[pid], `вид ${id} ссылается на существующую органеллу ${pid}`);
}

console.log(failures === 0 ? '\nВСЕ ПРОВЕРКИ ПРОЙДЕНЫ' : `\nПРОВАЛЕНО ПРОВЕРОК: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
