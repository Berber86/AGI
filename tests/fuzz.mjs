// tests/fuzz.mjs — охотник за багами стадии суши: долгие прогоны вместо проверок-примеров.
// Сценарии: долгий роуминг по всем сложностям и дорожкам, голод и жажда, все пять
// событий, знакомство с каждым видом, прокачка всех частей, бой с владыкой, наследие
// океана, мусорный ввод, жизнь мира без игрока и строгая проверка отрисовки (цвета, NaN).
// Запуск: node tests/fuzz.mjs [минуты-на-прогон] [раздел|all]
// Разделы: roam starve events social parts tyrant render legacy garbage eco all
import { LandGame } from '../js/landcore.js';
import { LandRenderer } from '../js/landrender.js';
import { LAND_PATHS, CFG } from '../js/config.js';
import {
  tryLandEvolve, landRefund, landActiveAbility, checkSworn, landSummary,
} from '../js/landplayer.js';
import { LAND_PART_LIST, LAND_ABILITIES } from '../js/landparts.js';
import { LAND_SPECIES, SOCIAL_ACTIONS } from '../js/landspecies.js';
import { readFileSync } from 'node:fs';

// Рендереру нужен window (devicePixelRatio и размеры) — подставляем заглушку,
// чтобы проверять отрисовку без браузера.
globalThis.window ??= {
  devicePixelRatio: 2, innerWidth: 412, innerHeight: 892,
  addEventListener() {}, removeEventListener() {},
};

const MINUTES = Number(process.argv[2] ?? 5);
const SECTION = process.argv[3] ?? 'all';
const DT = 1 / 60;
let fails = 0;
const seen = new Map();
function bad(what, ctx) {
  fails++;
  const n = seen.get(what) ?? 0;
  seen.set(what, n + 1);
  if (n < 3) console.error(`  ✗ ${what}${ctx ? ` :: ${ctx}` : ''}`);
  else if (n === 3) console.error(`  … ${what} — повторяется, дальше молчим`);
}
const ok = (what) => console.log(`  ✓ ${what}`);
const FINITE = (v) => typeof v === 'number' && Number.isFinite(v);
const near = (a, b, eps = 0.001) => Math.abs(a - b) <= eps;

function stubMeta() {
  return {
    ach: new Set(), codex: new Set(), runs: 0, data: { stats: {} },
    onRunEnd() { this.runs++; }, addDna() {}, save() {},
  };
}
function makeGame(opts = {}) {
  return new LandGame({
    settings: { quality: { particles: 0.4, foodDetail: 0.5 } },
    meta: opts.meta ?? stubMeta(),
    difficulty: opts.difficulty ?? 'normal',
    path: opts.path ?? 'predator',
    seed: opts.seed ?? 1234,
    ...(opts.extra ?? {}),
  });
}

const deadSocial = new WeakMap();

function checkPlayer(g, tag, where) {
  const p = g.player;
  if (!FINITE(p.x) || !FINITE(p.y)) return bad(`${tag}: NaN в координатах`, where);
  if (!FINITE(p.hp) || !FINITE(p.satiety) || !FINITE(p.water) || !FINITE(p.stamina) || !FINITE(p.dna)) {
    return bad(`${tag}: NaN в ресурсах (hp=${p.hp} sat=${p.satiety} wat=${p.water} st=${p.stamina} dna=${p.dna})`, where);
  }
  if (p.hp > p.maxHp + 1e-6) return bad(`${tag}: здоровье выше максимума (${p.hp}/${p.maxHp})`, where);
  if (p.satiety > p.maxSatiety + 1e-6) return bad(`${tag}: сытость выше максимума (${p.satiety}/${p.maxSatiety})`, where);
  if (p.water > p.maxWater + 1e-6) return bad(`${tag}: вода выше максимума (${p.water}/${p.maxWater})`, where);
  if (p.stamina > p.maxStamina + 1e-6) return bad(`${tag}: силы выше максимума (${p.stamina}/${p.maxStamina})`, where);
  if (p.satiety < -1e-6 || p.water < -1e-6 || p.stamina < -1e-6) return bad(`${tag}: ресурс ниже нуля`, where);
  const d = Math.hypot(p.x, p.y);
  if (d > g.radius + 80) return bad(`${tag}: зверь за границей мира (${d.toFixed(0)})`, where);
  if (!FINITE(p.heading) || !FINITE(p.tier) || p.tier < 1 || p.tier > 12) return bad(`${tag}: битый размер/направление (${p.tier})`, where);
  // Партнёр погибает внутри того же кадра, а сцена общения закрывается в следующем:
  // даём игре 0.2 с на реакцию и ругаемся только на застрявшее состояние.
  if (p.social?.target?.dead) {
    const n = (deadSocial.get(g) ?? 0) + 1;
    deadSocial.set(g, n);
    if (n > 12) return bad(`${tag}: знакомство идёт с мёртвым зверем дольше 0.2 с`, where);
  } else deadSocial.set(g, 0);
}
function checkWorld(g, tag, where) {
  if (g.creatures.length > 300) return bad(`${tag}: зверей слишком много (${g.creatures.length})`, where);
  if (g.foods.length > 1200) return bad(`${tag}: еды слишком много (${g.foods.length})`, where);
  if (g.particles.length > 4000) return bad(`${tag}: частиц слишком много (${g.particles.length})`, where);
  if (g.floaters.length > 500) return bad(`${tag}: всплывающих чисел слишком много (${g.floaters.length})`, where);
  for (const f of g.features) {
    if (!FINITE(f.x) || !FINITE(f.y)) return bad(`${tag}: NaN у объекта ${f.type}`, where);
    if (f.water !== undefined && (!FINITE(f.water) || f.water < -1e-6 || f.water > f.maxWater + 1e-6)) {
      return bad(`${tag}: вода в водоёме вне диапазона (${f.water}/${f.maxWater})`, where);
    }
    if (f.fruit !== undefined && f.fruit < 0) return bad(`${tag}: отрицательные плоды на кусте (${f.fruit})`, where);
  }
  for (const c of g.creatures) {
    if (c.dead) continue;
    if (!FINITE(c.x) || !FINITE(c.y) || !FINITE(c.hp)) return bad(`${tag}: NaN у зверя ${c.sp?.id}`, where);
    if (c.hp <= 0 || c.hp > c.maxHp + 1e-6) return bad(`${tag}: странное здоровье зверя ${c.sp?.id} (${c.hp}/${c.maxHp})`, where);
  }
  for (const f of g.foods) if (!FINITE(f.x) || !FINITE(f.y)) return bad(`${tag}: NaN у еды ${f.kind}`, where);
}

function rngMaker(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// Бот: идёт к ближайшей еде, иногда уклоняется от хищников, пьёт, знакомится.
function botInput(g, rng, t) {
  const p = g.player;
  const wolf = g.nearestCreature(p.x, p.y, 240, (c) => !c.dead && !c.ally && (c.sp.family === 'predator' || c.sp.family === 'apex') && c.tier >= p.tier - 1);
  let tx = p.x, ty = p.y;
  if (wolf && rng() < 0.9) {
    tx = p.x - (wolf.x - p.x); ty = p.y - (wolf.y - p.y);
  } else if (p.water < p.maxWater * 0.4) {
    const pool = g.nearestFeature(p.x, p.y, 1500, 'pool');
    if (pool) { tx = pool.x; ty = pool.y; }
  } else {
    const food = g.foodsNear(p.x, p.y, 900).filter((f) => !f.dead && (f.kind !== 'bone' || p.wantsBite));
    const f = food[0];
    if (f) { tx = f.x; ty = f.y; } else if (rng() < 0.02) { tx = (rng() - 0.5) * 3000; ty = (rng() - 0.5) * 3000; }
  }
  const dx = tx - p.x, dy = ty - p.y, m = Math.hypot(dx, dy) || 1;
  return { ax: dx / m, ay: dy / m, bite: rng() < 0.5, dash: rng() < 0.005, dashHeld: rng() < 0.2 };
}

function roam(seed, minutes, difficulty, path, opts = {}) {
  const tag = `суша ${difficulty}/${path}/seed${seed}`;
  const rng = rngMaker(seed);
  const meta = stubMeta();
  const g = makeGame({ difficulty, path, seed, meta });
  if (opts.dna) g.player.dna = opts.dna;
  const frames = Math.round(minutes * 60 * 60);
  const events = new Set();
  g.on('eventStart', ({ name }) => events.add(name));
  let evolved = 0, abilityFails = 0, socialWins = 0, deaths = 0;
  g.on('playerDeath', () => deaths++);
  let loadAt = Math.floor(frames * 0.42), loadAt2 = Math.floor(frames * 0.78);
  for (let i = 0; i < frames; i++) {
    if (g.player.alive) {
      if (i % 150 === 0) { const r = g.useAbility(); if (r && r.ok === false && r.why) abilityFails++; }
      if (i % 240 === 0) {
        const near = g.nearestCreature(g.player.x, g.player.y, 260, (c) => !c.ally && !c.boss && !c.dead);
        if (near) {
          g.trySocial(near);
          const seq = g.player.social?.seq ?? [];
          // играем «правильно» с шансом 60%, иначе тыкаем случайно: проверяем и провалы
          const good = rng() < 0.6;
          if (seq.length) {
            const act = good ? seq[g.player.social.step] : seq[Math.floor(rng() * seq.length)];
            g.socialAction(act);
            if (good && g.player.social.active === false && g.player.counters.socialWins > socialWins) socialWins++;
          }
        }
      }
      if (i % 1800 === 0) g.restAtTotem();
      if (i % 900 === 0 && g.player.dna > 60) {
        const part = LAND_PART_LIST[Math.floor(rng() * LAND_PART_LIST.length)];
        const r = tryLandEvolve(g, part.id);
        if (r.ok) evolved++;
        else if (!/ячеек|ДНК|максимальный|Закрыто/.test(r.msg ?? '')) bad(`${tag}: непонятный отказ роста части: ${r.msg}`);
      }
    }
    try {
      g.update(DT, botInput(g, rng, i));
    } catch (e) {
      return bad(`${tag}: исключение на ${(i / 60).toFixed(1)} с: ${e.message}\n${e.stack?.split('\n').slice(0, 5).join('\n')}`);
    }
    checkPlayer(g, tag, `${(i / 60).toFixed(1)} с`);
    if (i % 31 === 0) checkWorld(g, tag, `${(i / 60).toFixed(1)} с`);
    if (i === loadAt || i === loadAt2) {
      const raw = typeof g.serialize() === 'string' ? JSON.parse(g.serialize()) : g.serialize();
      try {
        const g2 = LandGame.deserialize(raw, { settings: g.settings, meta, difficulty });
        checkPlayer(g2, `${tag} (загрузка)`, `${(i / 60).toFixed(1)} с`);
        if (Math.abs(g2.player.tier - g.player.tier) > 0) bad(`${tag}: после загрузки другой размер (${g2.player.tier} vs ${g.player.tier})`);
        if ((g2.creatures.length === 0) !== (g.creatures.length === 0)) bad(`${tag}: после загрузки пропали звери`);
        g2.update(DT, { ax: 1 });
      } catch (e) {
        bad(`${tag}: мир не пережил сохранение/загрузку: ${e.message}`);
      }
    }
  }
  const p = g.player;
  console.log(`  · ${tag}: ${minutes} мин, размер ${g.stats.maxTier}, сытость ${p.satiety.toFixed(0)}, `
    + `вода ${p.water.toFixed(0)}, съедено ${p.counters.fruits + p.counters.meat}, частей ${evolved}, `
    + `знакомств ${p.counters.socialWins}, событий ${events.size}, зверей ${g.creatures.length}, еды ${g.foods.length}, `
    + `победа ${g.won ? g.winReason ?? 'да' : 'нет'}${deaths ? `, смертей ${deaths}` : ''}`);
  if (p.counters.fruits + p.counters.meat === 0) bad(`${tag}: зверь ничего не съел за ${minutes} мин`);
  return { g, events };
}

// ------------------------------------------------------------------ сценарии

// Голод и жажда должны убивать, а не «висеть на нуле» — регрессия на бессмертие.
function starvation(seed, difficulty, path) {
  const tag = `голод ${difficulty}/${path}`;
  const rng = rngMaker(seed);
  const g = makeGame({ difficulty, path, seed });
  const t0 = g.time;
  let starveAt = -1, thirstAt = -1, deadAt = -1, minS = 99, minW = 99;
  for (let i = 0; i < 60 * 60 * 8 && g.player.alive; i++) {
    // зверь стоит на месте в чистом поле: не ест (стоит у края мира) и не пьёт
    g.update(DT, { ax: 0, ay: 0, bite: false });
    minS = Math.min(minS, g.player.satiety);
    minW = Math.min(minW, g.player.water);
    if (starveAt < 0 && g.player.satiety <= 0) starveAt = g.time - t0;
    if (thirstAt < 0 && g.player.water <= 0) thirstAt = g.time - t0;
    if (!g.player.alive && deadAt < 0) deadAt = g.time - t0;
    if (i % 300 === 0) {
      // не даём боту умереть от зверей раньше времени: убираем хищников рядом
      for (const c of g.creatures) if (!c.dead && Math.hypot(c.x - g.player.x, c.y - g.player.y) < 400) c.dead = true;
    }
  }
  const p = g.player;
  if (p.hp > 0 && !p.alive) bad(`${tag}: зверь мёртв с положительным здоровьем`);
  if (deadAt < 0) bad(`${tag}: с нулевой сытостью и водой зверь жив 8 минут (hp ${p.hp.toFixed(1)}, реген ${p.stats.regen.toFixed(2)})`);
  else ok(`${tag}: смерть от голода и жажды на ${deadAt.toFixed(0)} с (сытость кончилась на ${starveAt.toFixed(0)} с, вода на ${thirstAt.toFixed(0)} с)`);
  if (minS < -1e-6 || minW < -1e-6) bad(`${tag}: ресурс ушёл в минус (${minS.toFixed(3)}/${minW.toFixed(3)})`);
}

// Все пять событий: играем каждое, проверяем инварианты и завершение.
function allEvents(seed) {
  const g = makeGame({ seed });
  const sys = g.events ?? g.eventSystem;
  if (!sys) return bad('события: системы событий нет на движке');
  const ids = ['rain', 'drought', 'migration', 'nighthunt', 'harvest'];
  const rng = rngMaker(seed + 5);
  const p0 = g.player;
  let deaths = 0;
  for (const id of ids) {
    if (typeof sys.force !== 'function') { bad('события: у системы нет force()'); return; }
    sys.force(id);
    const started = g.event?.id === id;
    if (!started) { bad(`события: ${id} не запустилось`); continue; }
    const dur = g.event.dur ?? g.event.def?.dur ?? 0;
    let frames = 0;
    while (g.event?.id === id && frames < 60 * 120) {
      g.player.water = Math.min(g.player.water, 30);   // держим жажду, чтобы сработали механики
      g.update(DT, botInput(g, rng, frames));
      checkPlayer(g, `событие ${id}`, `${(frames / 60).toFixed(1)} с`);
      if (frames % 60 === 0) checkWorld(g, `событие ${id}`, `${(frames / 60).toFixed(1)} с`);
      frames++;
      if (!g.player.alive) {
        // смерть посреди события: поднимаем зверя у тотема, как это делает игра
        p0.hp = p0.maxHp; p0.alive = true; p0.invuln = 3; p0.bleed.t = 0; p0.poison.t = 0;
        p0.satiety = p0.maxSatiety * 0.6; p0.water = p0.maxWater * 0.6; p0.stamina = p0.maxStamina;
        p0.x = p0.totemPos.x; p0.y = p0.totemPos.y;
        deaths++;
      }
    }
    if (g.event?.id === id) bad(`событие ${id}: не закончилось за ${(frames / 60).toFixed(1)} с (длительность ${dur})`);
    else ok(`событие ${id}: отработало ${(frames / 60).toFixed(0)} с, цель ${g.eventGoal?.done ? 'выполнена' : 'нет'}${deaths ? `, смертей ${deaths}` : ''}`);
    if (id !== 'rain' && g.raining) bad(`событие ${id}: после конца остался флаг дождя`);
  }
}

// Знакомство: у каждого вида должна быть достижима присяга (иначе вид «неприручаемый»
// без единого слова в интерфейсе), ошибочные действия — наказываться.
function socialAll(seed) {
  const g = makeGame({ seed });
  const rng = rngMaker(seed + 9);
  const rows = [];
  let badCases = 0;
  for (const sp of LAND_SPECIES) {
    if (sp.tame >= 999) {
      const c = g.spawnCreature(sp, g.player.x + 60, g.player.y, Math.max(1, sp.tierMin ?? 1), true);
      const r = g.trySocial(c);
      if (r.ok) bad(`знакомство ${sp.id}: «неразумный» вид согласился знакомиться`);
      continue;
    }
    g.creatures = g.creatures.filter((c) => c.dead || c.sp.id !== sp.id);
    const c = g.spawnCreature(sp, g.player.x + 60, g.player.y + 20, Math.max(1, Math.min(6, sp.tierMin ?? 1)), true);
    g.grid.build(g.creatures);
    g.player.sympathy[sp.id] = { value: 0, allied: false, cd: 0 };
    let chains = 0, fails2 = 0;
    const values = [];
    while (!g.player.sympathy[sp.id].allied && chains < 14) {
      g.player.sympathy[sp.id].cd = 0;
      c.dead = false; c.hp = c.maxHp;
      g.player.x = c.x - 50; g.player.y = c.y;
      const r = g.trySocial(c);
      if (!r.ok) { bad(`знакомство ${sp.id}: цепочка не началась (${r.why})`); break; }
      let guard = 0;
      while (g.player.social.active && guard < 60 * 60) {
        const need = g.player.social.seq[g.player.social.step];
        g.socialAction(need);
        g.update(DT, { ax: 0, ay: 0 });
        guard++;
      }
      if (g.player.social.active) { bad(`знакомство ${sp.id}: цепочка не завершилась за 60 с`); break; }
      chains++;
      if (!g.player.sympathy[sp.id].allied && g.player.sympathy[sp.id].value < 1) fails2++;
      values.push(Math.round(g.player.sympathy[sp.id].value));
      // партнёр не должен умереть сам по себе: обновляем его и держим живым
      c.hp = c.maxHp;
      if (g.player.sympathy[sp.id].value > 99.5 && !g.player.sympathy[sp.id].allied) {
        bad(`знакомство ${sp.id}: симпатия упёрлась в 100, а присяга требует ${sp.tame}`);
        break;
      }
    }
    const st = g.player.sympathy[sp.id];
    if (!st.allied) {
      bad(`знакомство ${sp.id} (${sp.name}): за ${chains} цепочек присяга не наступила (симпатия ${st.value.toFixed(0)}, нужно ${sp.tame}, рост ${values.join('→')})`);
      badCases++;
    }
    rows.push(`${sp.name} ${chains}ц/${st.value.toFixed(0)}`);
  }
  if (!badCases) ok(`знакомство: все ${LAND_SPECIES.filter((s) => s.tame < 999).length} разумных видов доводятся до присяги (${rows.slice(0, 4).join(', ')}…)`);
  // ошибки наказываются
  const sp2 = LAND_SPECIES.find((s) => s.tame < 60 && s.social.hates);
  g.player.sympathy[sp2.id] = { value: 60, allied: false, cd: 0 };
  const c2 = g.spawnCreature(sp2, g.player.x + 60, g.player.y, 2, true);
  g.grid.build(g.creatures);
  g.player.x = c2.x - 50; g.player.y = c2.y;
  const r2 = g.trySocial(c2);
  if (r2.ok) {
    const wrong = sp2.social.hates;
    const before = g.player.sympathy[sp2.id].value;
    let n = 0;
    while (g.player.social.active && n < 60 * 30) { g.socialAction(wrong); g.update(DT, { ax: 0, ay: 0 }); n++; }
    const after = g.player.sympathy[sp2.id].value;
    if (after >= before) bad(`знакомство: нелюбимое действие «${wrong}» не снижает симпатию (${before} → ${after})`);
    else ok(`знакомство: нелюбимое действие снижает симпатию (${before} → ${after})`);
  } else bad(`знакомство: не удалось начать проверку ошибок (${r2.why})`);

  // три союзных вида у тотема = мирная победа
  const allies = Object.keys(g.player.sympathy).filter((id) => g.player.sympathy[id].allied);
  const totem = g.player.totemPos;
  g.player.x = totem.x; g.player.y = totem.y;
  for (const id of allies) {
    const sp = LAND_SPECIES.find((s) => s.id === id);
    for (let i = 0; i < 3; i++) {
      const cc = g.spawnCreature(sp, totem.x + 40 + i * 20, totem.y, 2, true);
      cc.ally = true;
    }
  }
  g.grid.build(g.creatures);
  g.update(DT, { ax: 0, ay: 0 });
  const sworn = checkSworn(g);
  if (sworn < 3) bad(`присяга: союзных видов ${allies.length}, у тотема присягнуло ${sworn} (нужно 3)`);
  else ok(`присяга: ${allies.length} союзных видов, у тотема присягнули ${sworn} — мирная победа достижима`);
  if (sworn >= 3 && !g.won) bad('присяга: победа не засчитана, хотя три вида присягнули');
}

// Прокачка всех частей до максимума: статы, ячейки, снятие, сохранение.
function partsMax(seed) {
  const g = makeGame({ seed });
  g.player.dna = 100000;
  g.player.tier = CFG.land.player.maxTier;
  let bought = 0;
  for (let pass = 0; pass < 8; pass++) {
    for (const part of LAND_PART_LIST) {
      while ((g.player.parts[part.id] ?? 0) < part.maxLevel) {
        const r = tryLandEvolve(g, part.id);
        if (!r.ok) break;
        bought++;
      }
    }
  }
  const stats = { ...g.player.stats };
  for (const [k, v] of Object.entries(stats)) {
    if (typeof v !== 'number') continue;
    if (!FINITE(v)) bad(`части: стат ${k} = ${v} после максимума`);
    if (v < 0 && !/Cooldown|slow|poison|bleed/i.test(k)) bad(`части: отрицательный стат ${k} = ${v}`);
  }
  const used = LAND_PART_LIST.reduce((n, p) => n + (g.player.parts[p.id] ? p.slots : 0), 0);
  if (used > g.player.stats.slots + 1e-6) bad(`части: занято ячеек больше максимума (${used}/${g.player.stats.slots})`);
  const ab = landActiveAbility(g.player);
  if (!ab) bad('части: на максимуме нет активной способности');
  // сохраняем/загружаем собранного зверя
  const raw = typeof g.serialize() === 'string' ? JSON.parse(g.serialize()) : g.serialize();
  const g2 = LandGame.deserialize(raw, { settings: g.settings, meta: g.meta, difficulty: g.difficulty });
  for (const [k, v] of Object.entries(stats)) {
    if (typeof v !== 'number') continue;
    if (!near(g2.player.stats[k], v, 1e-6)) bad(`части: после загрузки стат ${k} изменился (${g2.player.stats[k]} vs ${v})`);
  }
  // снимаем всё возможное: стартовые части остаются, ячейки освобождаются
  let refunded = 0;
  for (const part of LAND_PART_LIST) {
    const r = landRefund(g, part.id);
    if (r.ok) refunded++;
    else if (!/Стартовая|максимальный/.test(r.msg ?? '')) bad(`части: странный отказ снятия ${part.id}: ${r.msg}`);
  }
  checkPlayer(g, 'части (после снятия)', 'итог');
  const usedAfter = LAND_PART_LIST.reduce((n, p) => n + (g.player.parts[p.id] ? p.slots : 0), 0);
  if (usedAfter > g.player.stats.slots + 1e-6) bad(`части: после снятия занято больше ячеек, чем есть (${usedAfter}/${g.player.stats.slots})`);
  ok(`части: куплено ${bought} уровней, снято ${refunded}, способность «${ab?.name ?? '—'}», ячейки на максимуме ${used}/${g.player.stats.slots}, после снятия ${usedAfter}`);
  return { g, bought };
}

// Владыка: бой должен быть боем на всех размерах, а не формальностью.
function tyrant(seed) {
  const report = [];
  // ДНК-бюджеты взяты из реального темпа: к 4-му размеру зверь накапливает ~700,
  // к 6-му — около 2600 (см. прогоны роуминга), и тратит их на части тела.
  for (const setup of [{ tier: 4, dna: 700 }, { tier: 6, dna: 2600 }, { tier: 8, dna: 100000 }]) {
    const g = makeGame({ seed: seed + setup.tier, path: 'predator' });
    g.player.tier = setup.tier;
    g.player.dna = setup.dna;
    // раскупаем доступное по ДНК и размеру, как это сделал бы игрок
    for (let pass = 0; pass < 6; pass++) {
      for (const part of LAND_PART_LIST) {
        while (tryLandEvolve(g, part.id).ok) { /* пока хватает ДНК и ячеек */ }
      }
    }
    const partsOwned = Object.keys(g.player.parts).length;
    g.player.x = g.throne.x; g.player.y = g.throne.y - 200;
    g.spawnTyrant();
    if (!g.tyrant) { bad(`владыка (размер ${setup.tier}): не появился`); continue; }
    const rng = rngMaker(seed + setup.tier);
    let frames = 0, minHp = g.player.hp, deaths = 0, phases = new Set();
    g.on('bossPhase', ({ phase }) => phases.add(phase));
    // дуэльный бот: бьёт в окне после удара владыки, отходит, когда владыка готов ударить
    let hits = 0, minBossFrac = 1;
    g.on('playerHit', () => hits++);
    while (!g.won && frames < 60 * 60 * 8) {
      const boss = g.tyrant;
      if (boss) minBossFrac = Math.min(minBossFrac, boss.hp / boss.maxHp);
      let input;
      if (boss) {
        const dx = boss.x - g.player.x, dy = boss.y - g.player.y;
        const m = Math.hypot(dx, dy) || 1;
        const biteBand = g.player.r + 34 + boss.r * 0.9;
        const hitBand = boss.r + g.player.r + 10;
        const ready = boss.contactCd <= 0.3;            // владыка может ударить
        const inBite = m < biteBand - 2;
        if (ready && m < hitBand * 1.3) {
          input = { ax: -dx / m, ay: -dy / m };          // отходим от готового удара
        } else if (inBite) {
          input = { ax: dx / m * 0.25, ay: dy / m * 0.25, bite: true };
        } else {
          input = { ax: dx / m, ay: dy / m };
        }
      } else {
        input = botInput(g, rng, frames);
      }
      if (frames % 120 === 0) g.useAbility();
      // чистим арену от посторонних и держим ресурсы: проверяем именно бой с владыкой
      if (frames % 30 === 0) for (const c of g.creatures) if (!c.boss && !c.dead && !c.ally) c.dead = true;
      // Сытость держим на 60%: на полной сытости зверь не кусает (wantsBite гаснет),
      // и бой превращался в бессмысленное кружение — на этом уже спотыкался фаззер.
      g.player.satiety = Math.min(g.player.satiety, g.player.maxSatiety * 0.6);
      g.player.water = g.player.maxWater;
      g.update(DT, input);
      minHp = Math.min(minHp, g.player.hp);
      checkPlayer(g, `владыка/${setup.tier}`, `${(frames / 60).toFixed(1)} с`);
      if (!g.player.alive) {
        deaths++;
        // возрождение у тотема, как в игре: бой продолжается
        const p = g.player;
        p.hp = p.maxHp; p.alive = true; p.invuln = 3; p.x = p.totemPos.x; p.y = p.totemPos.y;
        p.satiety = p.maxSatiety * 0.6; p.water = p.maxWater * 0.6; p.stamina = p.maxStamina;
        if (deaths > 4) break;
      }
      frames++;
    }
    const secs = frames / 60;
    report.push(`${setup.tier}→${g.won ? `${secs.toFixed(0)} с` : `не добит (мин. ${(minBossFrac * 100).toFixed(0)}%)`}${deaths ? `/смертей ${deaths}` : ''}/получено ударов ${hits}`);
    // Критерии: на 6-8 размерах бой обязан выигрываться, на 4-м — быть тяжёлым,
    // но осмысленным (владыка должен терять здоровье, а не стоять нетронутым).
    if (deaths > 5) bad(`владыка (размер ${setup.tier}): ${deaths} смертей — бой превратился в мясорубку`);
    if (setup.tier >= 6 && !g.won) bad(`владыка (размер ${setup.tier}, частей ${partsOwned}): победы нет за 8 минут (минимум здоровья босса ${(minBossFrac * 100).toFixed(0)}%)`);
    if (setup.tier === 4 && minBossFrac > 0.55) bad(`владыка (размер 4): владыка ни разу не потерял и половины здоровья — бой безнадёжен (минимум ${(minBossFrac * 100).toFixed(0)}%)`);
    if (g.won && secs > 300) bad(`владыка (размер ${setup.tier}): бой длится ${secs.toFixed(0)} с — слишком долго`);
    if (g.won && setup.tier <= 4 && secs < 8) bad(`владыка (размер ${setup.tier}): босс убит за ${secs.toFixed(0)} с — формальность`);
    if (g.won) {
      const before = g.meta.runs;
      g.win('tyrant');
      if (g.meta.runs !== before) bad('владыка: повторная победа засчитана дважды');
      g.freePlay = true;
      g.player.hp = 1;
      g.damagePlayer(999, { name: 'тест' }, { armorPierce: true });
      g.update(DT, {});
      if (g.player.alive) bad('владыка: зверь выжил после смертельного урона');
      const sum = landSummary(g.player);
      if (!FINITE(sum.tier) || !FINITE(sum.time)) bad('владыка: итог жизни содержит NaN');
    }
  }
  ok(`владыка: бой по размерам — ${report.join(', ')}`);
}

// Строгий контекст отрисовки: ловит и невалидные цвета, и NaN в геометрии.
function makeStrictCtx(problems, where) {
  const colorRe = /^(#[0-9a-f]{3}|#[0-9a-f]{6}|#[0-9a-f]{8}|rgba?\([\d.,\s%]+\)|hsla?\([\d.,\s%deg]+\)|transparent|none|[a-z]+)$/i;
  const checkColor = (v, what) => {
    // градиент или узор — законное значение fillStyle
    if (v && typeof v === 'object' && typeof v.addColorStop === 'function') return;
    if (typeof v !== 'string') { problems.push(`${where}: ${what} не строка (${typeof v})`); return; }
    if (!colorRe.test(v.trim())) problems.push(`${where}: битый цвет ${JSON.stringify(v)}`);
    if (/^rgba?\(/.test(v) && /(nan|undefined|null)/i.test(v)) problems.push(`${where}: NaN в цвете ${v}`);
  };
  const checkNum = (v, what) => {
    if (typeof v === 'number' && !Number.isFinite(v)) problems.push(`${where}: NaN в ${what}`);
  };
  const gradient = (what) => ({
    addColorStop(pos, color) { checkNum(pos, `${what}.addColorStop позиция`); checkColor(color, `${what}.addColorStop`); },
  });
  const numMethods = new Set(['arc', 'arcTo', 'ellipse', 'rect', 'roundRect', 'fillRect', 'strokeRect',
    'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'translate', 'scale', 'rotate', 'setTransform',
    'transform', 'clearRect', 'fillText', 'strokeText', 'createLinearGradient', 'createRadialGradient',
    'createPattern', 'drawImage', 'setLineDash']);
  const handler = {
    get(_t, prop) {
      if (prop === 'canvas') return { width: 412 * 2, height: 892 * 2 };
      if (prop === 'createLinearGradient' || prop === 'createRadialGradient') {
        return (...args) => {
          args.forEach((a, i) => checkNum(a, `createGradient[${i}]`));
          return gradient(prop);
        };
      }
      if (prop === 'createPattern') return () => null;
      if (prop === 'measureText') return () => ({ width: 10 });
      if (prop === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) });
      return (...args) => {
        if (numMethods.has(prop)) args.forEach((a, i) => checkNum(a, `${String(prop)}[${i}]`));
        // у fillText/strokeText цвета в аргументах нет — он берётся из fillStyle;
        // проверяем текущий стиль, чтобы поймать NaN, просочившийся в контекст
        if (prop === 'fillText' || prop === 'strokeText') checkColor(_t.fillStyle, `${String(prop)} fillStyle`);
        return undefined;
      };
    },
    set(_t, prop, value) {
      if (prop === 'fillStyle' || prop === 'strokeStyle' || prop === 'shadowColor') checkColor(value, String(prop));
      else if (typeof value === 'number') checkNum(value, String(prop));
      return true;
    },
  };
  return new Proxy({ fillStyle: '#000', strokeStyle: '#000', globalAlpha: 1, lineWidth: 1 }, handler);
}

// Отрисовка берега на длинном прогоне: все биомы, все фазы суток, все события.
// Признак species.features должен что-то значить в силуэте: раньше «когти» носили
// шесть видов, а в landcreature.js ветки для них не было вовсе.
function featureCheck() {
  const src = readFileSync(new URL('../js/landcreature.js', import.meta.url), 'utf8');
  const declared = new Set();
  for (const sp of LAND_SPECIES) for (const f of sp.features ?? []) declared.add(f);
  // «хвост» — не отдельная ветка, а параметр плана тела (PLANS[...].tail): это законно
  const PLAN_DRIVEN = new Set(['tail']);
  const silent = [...declared].filter((f) => !PLAN_DRIVEN.has(f)
    && !src.includes(`'${f}'`) && !src.includes(`"${f}"`));
  if (silent.length) bad(`признаки без отрисовки: ${silent.join(', ')}`);
  else ok(`все ${declared.size} признаков видов рисуются`);
}

function renderCheck(seed, minutes) {
  const g = makeGame({ seed });
  const problems = [];
  const ctx = makeStrictCtx(problems, 'отрисовка');
  const canvas = { width: 412 * 2, height: 892 * 2, getContext: () => ctx, style: {} };
  const r = new LandRenderer(canvas, { quality: { particles: 0.6, foodDetail: 0.6 } });
  const rng = rngMaker(seed + 77);
  const frames = Math.round(minutes * 60 * 60);
  for (let i = 0; i < frames; i++) {
    g.update(DT, botInput(g, rng, i));
    if (i % 17 === 0) {
      try {
        r.cam.x = g.player.x; r.cam.y = g.player.y;
        r.draw(g, DT, ctx);
      } catch (e) {
        problems.push(`draw() бросил исключение на ${(i / 60).toFixed(1)} с: ${e.message}`);
        break;
      }
      if (problems.length > 8) break;
    }
    if (i % 3000 === 0) {
      // радар и превью тела рисуются другими путями — проверяем и их
      try { r.drawRadar(canvas, g); } catch (e) { problems.push(`drawRadar бросил: ${e.message}`); }
    }
  }
  if (problems.length) problems.slice(0, 8).forEach((p) => bad(`отрисовка: ${p}`));
  else ok(`отрисовка: ${(frames / 60).toFixed(1)} с игры, кадры каждые 17 кадров — без битых цветов и NaN`);
  return r;
}

// Наследие океана: перенос из клетки не должен ломать зверя.
function legacyFromCell(seed) {
  const meta = stubMeta();
  const creates = [
    { lineage: 'carn', tier: 4, relics: 2, parts: { jaws: 3, spikes: 2 } },
    { lineage: 'herb', tier: 7, relics: 3, parts: { filter: 4 } },
    { lineage: 'symb', tier: 2, relics: 0, parts: {} },
    { lineage: 'omni', tier: 10, relics: 1, parts: { cilia: 2, shell: 2, jet: 1 } },
  ];
  for (const c of creates) {
    const g = makeGame({ seed: seed + c.tier, path: c.lineage === 'carn' ? 'predator' : c.lineage === 'herb' ? 'grazer' : c.lineage === 'symb' ? 'social' : 'titan', meta });
    // то, что делает App.landingFromCell: ДНК за переход, наследие частей
    g.player.dna += 40 + c.tier * 12;
    if (c.parts.hide) { g.player.parts.hide = Math.max(g.player.parts.hide ?? 0, c.parts.hide); }
    for (let i = 0; i < 60 * 30; i++) {
      g.update(DT, botInput(g, rngMaker(seed + i), i));
      if (i % 60 === 0) checkPlayer(g, `наследие ${c.lineage}/размер ${c.tier}`, `${(i / 60).toFixed(0)} с`);
    }
    ok(`наследие ${c.lineage} (клетка размера ${c.tier}, генов ${c.relics}): зверь играет ${(60 * 30 / 3600).toFixed(1)} мин, ДНК ${g.player.dna.toFixed(0)}`);
  }
}

// Мусорный ввод: любой кадр не должен ломать мир.
function garbageInput(seed) {
  const g = makeGame({ seed });
  const rng = rngMaker(seed + 31);
  let nan = 0;
  for (let i = 0; i < 60 * 60 * 6; i++) {
    const junk = [
      {}, { ax: NaN, ay: NaN }, { ax: Infinity, ay: -Infinity }, { ax: 1e9, ay: -1e9 },
      { ax: 'влево', ay: null }, { bite: 'да', dash: 1, dashHeld: 'нет' },
      { ax: rng() * 4 - 2, ay: rng() * 4 - 2, throttle: 5 },
    ][i % 7];
    try {
      g.update(DT, junk);
    } catch (e) {
      bad(`мусорный ввод: исключение на ${(i / 60).toFixed(1)} с (${JSON.stringify(junk)}): ${e.message}`);
      break;
    }
    if (!FINITE(g.player.x) || !FINITE(g.player.y)) { nan++; bad(`мусорный ввод: NaN в координатах после ${JSON.stringify(junk)}`); break; }
    if (!FINITE(g.player.hp) || !FINITE(g.player.stamina)) { nan++; bad(`мусорный ввод: NaN в ресурсах после ${JSON.stringify(junk)}`); break; }
  }
  if (!nan) ok('мусорный ввод: NaN, Infinity, строки и единицы вместо осей — мир держится');
}

// Мир живёт сам: еда не должна исчезать или плодиться бесконечно.
function ecosystem(seed) {
  const g = makeGame({ seed });
  const rng = rngMaker(seed + 13);
  const samples = [];
  for (let i = 0; i < 60 * 60 * 20; i++) {
    g.player.hp = g.player.maxHp;         // наблюдатель не должен умирать
    g.player.satiety = g.player.maxSatiety;
    g.player.water = g.player.maxWater;
    g.player.x = 0; g.player.y = 0;
    g.update(DT, { ax: 0, ay: 0 });
    if (i % (60 * 120) === 0) samples.push({ t: (i / 3600).toFixed(0), cr: g.creatures.length, fd: g.foods.length, pt: g.particles.length, fl: g.floaters.length });
  }
  console.log(`  · экосистема 20 мин: ${samples.map((s) => `${s.t}мин cr${s.cr}/fd${s.fd}/pt${s.pt}/fl${s.fl}`).join('  ')}`);
  const last = samples[samples.length - 1];
  if (last.fd < 40) bad(`экосистема: еды почти не осталось (${last.fd})`);
  if (g.creatures.length === 0) bad('экосистема: все звери вымерли за 20 минут');
  if (last.pt > 3000 || last.fl > 400) bad('экосистема: мусорные массивы растут');
  else ok(`экосистема: за 20 минут зверей ${g.creatures.length}, еды ${g.foods.length}, частиц ${last.pt}, чисел ${last.fl}`);
}

// ---------------------------------------------------------------- запуск
const sections = {
  roam: () => {
    console.log('— Долгий роуминг по всем сложностям и дорожкам —');
    for (const diff of ['calm', 'normal', 'harsh', 'abyss']) {
      for (const path of LAND_PATHS.map((p) => p.id)) roam(1000 + diff.length * 7 + path.length, MINUTES, diff, path);
    }
  },
  starve: () => { console.log('— Голод и жажда —'); for (const d of ['calm', 'normal', 'abyss']) starvation(100 + d.length, d, 'grazer'); },
  events: () => { console.log('— Все события берега —'); allEvents(4242); },
  social: () => { console.log('— Знакомство со всеми видами —'); socialAll(777); },
  parts: () => { console.log('— Максимальная прокачка частей —'); partsMax(31337); },
  tyrant: () => { console.log('— Владыка и обе победы —'); tyrant(909); },
  render: () => { console.log('— Признаки видов и строгая отрисовка —'); featureCheck(); renderCheck(555, MINUTES); },
  legacy: () => { console.log('— Наследие океана —'); legacyFromCell(66); },
  garbage: () => { console.log('— Мусорный ввод —'); garbageInput(12); },
  eco: () => { console.log('— Жизнь мира без игрока —'); ecosystem(2024); },
};
console.log(`Охотник за багами: ${MINUTES} мин на прогон, раздел "${SECTION}"\n`);
for (const [name, fn] of Object.entries(sections)) {
  if (SECTION === 'all' || SECTION === name) {
    const t = Date.now();
    await fn();
    console.log(`    (${name}: ${((Date.now() - t) / 1000).toFixed(1)} с)\n`);
  }
}
console.log(fails ? `ПАДЕНИЙ: ${fails}` : 'ОХОТНИК ЧИСТ');
process.exit(fails ? 1 : 0);
