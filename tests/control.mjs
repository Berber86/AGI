// tests/control.mjs — проверки управляемости и «магнитов»: что именно двигает клетку.
// Запуск: node tests/control.mjs
//
// Фиксируем инварианты, из-за нарушения которых игрок чувствует «странную управляемость»:
//   1) без ввода клетка не дрейфует и никто её не притягивает;
//   2) притяжение есть только у еды и только от органелл (радиус ограничен);
//   3) толчки зависят от массы и гасятся плавниками, а не бьют наугад;
//   4) замедление уважает сопротивление мембраны;
//   5) танец не запускается от замедления — только от отпущенного стика;
//   6) границы мира не «залипают», столкновения совпадают с картинкой.

import { Game } from '../js/core.js';
import { CFG } from '../js/config.js';
import { SPECIES_BY_ID } from '../js/species.js';
import { recomputeStats, applySlow, pushPlayer, updatePlayer } from '../js/player.js';
import { dist, hypot } from '../js/util.js';

let failures = 0;
const check = (cond, msg) => { if (!cond) { console.error('  ✗ ' + msg); failures++; } else console.log('  ✓ ' + msg); };

const ZERO = { ax: 0, ay: 0, bite: false, dash: false, ability: false, abilityHeld: false };
const stubMeta = () => ({ ach: new Set(), codex: new Set(), settings: { quality: 'low', particles: 0.3 }, onRunEnd() {} });
const mk = (lineage = 'omni', seed = 4242) => {
  const g = new Game({ settings: stubMeta().settings, meta: stubMeta(), difficulty: 'normal', lineage, seed });
  g.creatures.length = 0; g.foods.length = 0; g.events.cooldown = 99999;
  g.player.x = 1600; g.player.y = 0; g.player.vx = 0; g.player.vy = 0;
  return g;
};

console.log('— 1. Свободный дрейф: без ввода клетку никто не тянет —');
{
  const g = mk();
  const x0 = g.player.x, y0 = g.player.y;
  for (let i = 0; i < 300; i++) g.update(1 / 60, ZERO);
  const moved = dist(x0, y0, g.player.x, g.player.y);
  check(moved < 0.5, `смещение за 5 с: ${moved.toFixed(3)} ед.`);
  check(!g.currentPush, 'вне событий течения нет');
}

console.log('— 2. Существа не притягивают и не толкают без контакта —');
{
  const g = mk();
  const c = g.spawnCreature(SPECIES_BY_ID.giganteus, g.player.x + 260, g.player.y, 8, true);
  c.hunt = { t: 999 };
  const x0 = g.player.x;
  for (let i = 0; i < 90; i++) {
    g.update(1 / 60, ZERO);
    c.vx = c.vy = 0; c.x = g.player.x + 260; c.y = g.player.y;   // держим существо на дистанции 260
  }
  check(Math.abs(g.player.x - x0) < 1, `игрок не сдвинулся (${Math.abs(g.player.x - x0).toFixed(2)} ед.) при существе в 260 ед.`);
}

console.log('— 3. Притяжение еды: только у еды, радиус ограничен, органеллы его расширяют —');
{
  const g = mk();
  const radiusOf = () => Math.min(210, CFG.player.magnetBase + g.player.stats.magnet + 2.5 * g.player.tier);
  const base = radiusOf();
  check(base < 90, `базовый радиус притяжения ${base.toFixed(0)} ед. (${(base / 412 * 100).toFixed(0)}% ширины экрана)`);
  g.player.parts.filter = 3;
  g.player.parts.cilia = 3;
  recomputeStats(g.player);
  const upgraded = radiusOf();
  check(upgraded > base, `с органеллами радиус вырос: ${upgraded.toFixed(0)} ед.`);
  check(upgraded <= 210, `радиус не превышает предел: ${upgraded.toFixed(0)} ед.`);

  // частица за пределами радиуса не двигается к игроку
  const far = g.spawnFood('plant', g.player.x + upgraded + 120, g.player.y);
  far.vx = far.vy = 0;
  for (let i = 0; i < 60; i++) {
    g.foodGrid.build(g.foods);
    g.magnetFood(g.player.x, g.player.y, upgraded, 1 / 60);
    g.update(1 / 60, ZERO);
  }
  const farMoved = far.dead ? 999 : Math.abs(far.x - (g.player.x + upgraded + 120));
  check(!far.dead && farMoved < 40, `далёкая частица не втягивается (смещение ${farMoved.toFixed(1)} ед.)`);

  // частица внутри радиуса притягивается и помечается струйкой
  const near = g.spawnFood('plant', g.player.x + upgraded * 0.7, g.player.y);
  near.vx = near.vy = 0;
  g.foodGrid.build(g.foods);                       // в игре сетку строит update()
  g.magnetFood(g.player.x, g.player.y, upgraded, 1 / 60);
  check(!!near.pulledAt, 'близкая частица помечена как притягиваемая (рисуется струйка)');
  check(near.vx < 0, `близкая частица получает скорость к клетке (vx=${near.vx.toFixed(1)})`);
  const d0 = Math.abs(near.x - g.player.x);
  for (let i = 0; i < 90; i++) g.update(1 / 60, ZERO);
  const d1 = Math.abs(near.x - g.player.x);
  check(near.dead || d1 < d0, `частица подлетела и была съедена (${d0.toFixed(0)} → ${near.dead ? 'съедена' : d1.toFixed(0)} ед.)`);
}

console.log('— 4. Толчки: масса и плавники гасят отброс —');
{
  const measure = (parts) => {
    const g = mk(lineageOf(parts));
    g.player.parts = { ...parts };
    recomputeStats(g.player);
    g.player.vx = g.player.vy = 0;
    const f = pushPlayer(g, 1, 0, CFG.knockback.heavy);
    return f;
  };
  const light = measure({});
  const armored = measure({ armor: 3 });
  const finned = measure({ fins: 3 });
  const both = measure({ armor: 3, fins: 3 });
  check(light > armored, `масса снижает толчок: ${light.toFixed(0)} → ${armored.toFixed(0)} ед/с`);
  check(light > finned, `плавники снижают толчок: ${light.toFixed(0)} → ${finned.toFixed(0)} ед/с`);
  check(both <= light * 0.35, `броня и плавники вместе гасят большую часть: ${both.toFixed(0)} ед/с`);
  check(both >= 0, 'отброс не может стать отрицательным');
  function lineageOf(parts) { return parts.armor ? 'omni' : 'omni'; }
}

console.log('— 5. Замедление уважает сопротивление мембраны —');
{
  const g = mk();
  g.player.parts = {};
  recomputeStats(g.player);
  applySlow(g, 0.4, 2);
  const plain = g.player.slow.factor;
  const g2 = mk();
  g2.player.parts = { membrane: 3 };   // 3-й уровень даёт стойкость к замедлению
  recomputeStats(g2.player);
  applySlow(g2, 0.4, 2);
  const resistant = g2.player.slow.factor;
  check(plain < 0.45, `обычная клетка замедляется до ${(plain * 100).toFixed(0)}%`);
  check(resistant > plain, `мембрана со стойкостью держит скорость лучше: ${(resistant * 100).toFixed(0)}%`);
  check(resistant <= 1, 'замедление не превышает норму');
}

console.log('— 6. Приманка (люциферин 2) притягивает только мелкую живность —');
{
  const g = mk();
  g.player.parts = { luciferin: 2 };
  recomputeStats(g.player);
  const small = g.spawnCreature(SPECIES_BY_ID.ciliata, g.player.x + 180, g.player.y, 1, true);
  const big = g.spawnCreature(SPECIES_BY_ID.giganteus, g.player.x + 180, g.player.y + 10, 9, true);
  big.hunt = null;
  const d0 = dist(g.player.x, g.player.y, small.x, small.y);
  const bigD0 = dist(g.player.x, g.player.y, big.x, big.y);
  for (let i = 0; i < 180; i++) {
    g.update(1 / 60, ZERO);
    big.vx = big.vy = 0; big.x = g.player.x + 180; big.y = g.player.y + 10;
  }
  const d1 = dist(g.player.x, g.player.y, small.x, small.y);
  check(d1 < d0, `мелкая живность подплыла: ${d0.toFixed(0)} → ${d1.toFixed(0)} ед.`);
  check(Math.abs(dist(g.player.x, g.player.y, big.x, big.y) - bigD0) < 2, 'крупную приманка не трогает');
}

console.log('— 7. Танец не запускается от замедления —');
{
  const g = mk();
  const c = g.spawnCreature(SPECIES_BY_ID.ciliata, g.player.x + 90, g.player.y, 2, true);
  c.flee = null;
  applySlow(g, 0.4, 10);
  // стик удерживается (клетка еле ползёт из-за замедления) — танца быть не должно
  for (let i = 0; i < 120; i++) g.update(1 / 60, { ax: 1, ay: 0, bite: false });
  check(g.player.dance.progress <= 0.01, `прогресс танца при удержании стика: ${g.player.dance.progress.toFixed(3)}`);
  // стик отпущен — танец пошёл
  for (let i = 0; i < 120; i++) {
    c.x = g.player.x + 90; c.y = g.player.y;
    g.update(1 / 60, ZERO);
  }
  check(g.player.dance.progress > 0.05 || g.player.counters.dances > 0, `отпустив стик, танец начинается (прогресс ${g.player.dance.progress.toFixed(2)})`);
}

console.log('— 8. Столкновения совпадают с картинкой —');
{
  const g = mk();
  const rock = g.features.find((f) => f.type === 'rock');
  g.features = [rock, { id: -1, type: 'nest', x: 0, y: 0, r: 120 }];
  g.featGrid.build(g.features);
  g.player.x = rock.x - 600; g.player.y = rock.y; g.player.vx = g.player.vy = 0;
  let closest = 1e9;
  for (let i = 0; i < 300; i++) {
    g.update(1 / 60, { ax: 1, ay: 0, bite: false });
    closest = Math.min(closest, dist(g.player.x, g.player.y, rock.x, rock.y));
  }
  const gap = closest - rock.r - g.player.r;
  check(Math.abs(gap) < 2, `клетка упирается ровно в границу камня (зазор ${gap.toFixed(2)} ед.)`);
}

console.log('— 9. Граница океана держит, но не залипает —');
{
  const g = mk();
  g.player.x = CFG.world.radius - 40; g.player.y = 0; g.player.vx = g.player.vy = 0;
  for (let i = 0; i < 240; i++) g.update(1 / 60, { ax: 1, ay: 0, bite: false });
  const d = hypot(g.player.x, g.player.y);
  check(d <= CFG.world.radius + 0.5, `за границу не выпускает (${d.toFixed(0)} ≤ ${CFG.world.radius})`);
  for (let i = 0; i < 120; i++) g.update(1 / 60, { ax: -1, ay: 0, bite: false });
  check(hypot(g.player.x, g.player.y) < CFG.world.radius - 200, 'от границы уходит свободно');
}

console.log(failures === 0 ? '\nВСЕ ПРОВЕРКИ УПРАВЛЯЕМОСТИ ПРОЙДЕНЫ' : `\nПРОВАЛЕНО: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
