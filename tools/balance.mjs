import fs from 'node:fs';
/**
 * Прогон забегов ботом, играющим «разумно»: ставит трофеи автоподбором,
 * чинится при повреждениях, точит модули на верфи, берёт элиту только здоровым.
 *
 * Без этого баланс настраивается на глаз, а глаз врет: первый же тест нового
 * движка дал 1 победу на 4 боя, но бот в нём не устанавливал трофеи вовсе —
 * то есть измерялась не игра, а забывчивость скрипта.
 *
 *   node tools/balance.mjs [забегов]
 */

import { newRun, choices, enterNode, finishBattle, cargo, cargoSpace, takeLoot, salvageModule, enchantModuleRun, repairFleet, drydockRepair, repairCost, resolveAnomaly, anomalyChoices, nextSector, flagship, startAmbush, captureWreck, buyHull, hullPrice, MAX_LIVES, MAX_FLEET, CARGO_LIMIT, runSummary } from '../src/engine/run.js';
import { HULL_KEYS } from '../src/engine/ship.js';
import { autoBattle, chooseTarget } from '../src/engine/ai.js';
import { battleReport, advance, performAction, retreat, aliveUnits, unitsOf, enemySideOf } from '../src/engine/combat.js';
import { shipPower, autoEquip, computeStats, slotList } from '../src/engine/ship.js';
import { moduleScore, rarityOf } from '../src/engine/modules.js';

/** Разумный игрок: разобрать мусор, поставить лучшее. */
function tidy(run) {
  const ship = flagship(run);
  // мусор — на запчасти, если трюм забит браком
  for (const m of cargo(run).slice()) {
    if (rarityOf(m).key === 'defective' && moduleScore(m) < 0.8 && run.parts < 200) salvageModule(run, m.uid);
  }
  // автоподбор по каждому кораблю: общий трюм распределяется по флоту.
  // Общий трюм УЖЕ включает трюм этого корабля, поэтому собираем множество,
  // а не склейку: иначе один модуль попадал в пул дважды.
  for (const s of run.fleet) {
    const seen = new Set();
    const pool = [];
    for (const m of s.cargo.concat(cargo(run))) {
      if (seen.has(m.uid)) continue;
      seen.add(m.uid);
      pool.push(m);
    }
    autoEquip(s, pool);
  }
}

/** Бот берёт трофеи как разумный игрок: лучшее по счёту, что влезает в трюм. */
function claimLoot(run) {
  const pending = run.pendingLoot;
  if (!pending) return;
  const ranked = pending.candidates.slice().sort((a, b) => moduleScore(b.module) - moduleScore(a.module));
  takeLoot(run, ranked.slice(0, cargoSpace(run)).map((c) => c.module.uid));
  // трюм полон — мусор в запчасти, чтобы место под следующий трофей было всегда
  let guard = 0;
  while (cargo(run).length > CARGO_LIMIT && guard++ < 50) {
    const worst = cargo(run).slice().sort((a, b) => moduleScore(a) - moduleScore(b))[0];
    if (!worst) break;
    salvageModule(run, worst.uid);
  }
}

/** Разумный игрок растит флот: bigger корпус важнее запчастей в кубышке. */
function growFleet(run) {
  const cap = run.pendingCapture;
  if (cap && run.fleet.length < MAX_FLEET && run.parts >= cap.price) captureWreck(run, cap.ship);
}

function buyBetterHull(run) {
  if (run.fleet.length >= MAX_FLEET) return;
  const mySlots = Math.max(...run.fleet.map((s) => slotList(s).length));
  const cand = HULL_KEYS.filter((k) => slotList({ hullKey: k }).length > mySlots)
    .sort((a, b) => hullPrice(a) - hullPrice(b))[0];
  if (cand && run.parts >= hullPrice(cand) + 40) buyHull(run, cand);
}

/** Стойка флота: доля прочности со щитами. */
function standing(battle, sideId) {
  const us = aliveUnits(battle, sideId);
  if (!us.length) return 0;
  return us.reduce((a, u) => a + (u.hull + u.shield) / Math.max(1, u.maxHull + u.maxShield), 0) / us.length;
}

/**
 * Отходить, если побиты и проигрываем по живой силе.
 * Порог высокий (0,55) потому, что отход стоит четверти ПОЛНОЙ прочности:
 * тянуть до 0,3 — значит уйти из боя на останках корпуса.
 */
function shouldRetreat(battle) {
  const mine = standing(battle, 'mine');
  const foes = standing(battle, 'foes');
  return mine < 0.45 && mine < foes * 0.8;
}

function playBattle(run, battle) {
  battle.__t0 = Date.now();
  // Играем по шагам, а не автобоем до конца: иначе бот не умеет отходить,
  // и замер показывает игру того, кто не пользуется главной механикой выживания.
  let guard = 0;
  while (!battle.over && guard++ < 200) {
    const actor = advance(battle);
    if (!actor) break;
    if (actor.sideId === 'mine' && !battle.noRetreat && shouldRetreat(battle)) { retreat(battle, 'mine'); break; }
    const target = chooseTarget(battle, actor);
    if (!target) break;
    performAction(battle, actor, target);
  }
  if (process.env.SLOWLOG) {
    const bt = Date.now();
    if (bt - battle.__t0 > 2000) {
      const dump = aliveUnits(battle, 'mine').concat(aliveUnits(battle, 'foes')).map((u) =>
        `${u.sideId}/${u.name} hull=${Math.round(u.hull)}/${Math.round(u.maxHull)} shield=${Math.round(u.shield)} ст=${(u.statuses||[]).map(x=>x.id+'x'+x.stacks).join(',')}`).join('\n');
      fs.appendFileSync(process.env.SLOWLOG,
        `\n=== МЕДЛЕННЫЙ БОЙ ${bt - battle.__t0}мс: действий ${battle.action}, записей ${battle.log.length}, over=${JSON.stringify(battle.over)}\n${dump}\n`);
    }
  }
  const tAuto = Date.now();
  if (!battle.over) autoBattle(battle, { maxActions: 120 });
  const tFin = Date.now();
  const report = battleReport(battle, 'mine');
  report.retreated = Boolean(battle.over?.retreated);
  const out = finishBattle(run, battle, report);
  const tLoot = Date.now();
  claimLoot(run);
  const tFleet = Date.now();
  growFleet(run);
  const tEnd = Date.now();
  if (process.env.PHASELOG) {
    fs.appendFileSync(process.env.PHASELOG,
      `узел ${battle.nodeId} цикл=${tAuto - battle.__t0}мс автобой=${tFin - tAuto}мс итог=${tLoot - tFin}мс трофеи=${tFleet - tLoot}мс флот=${tEnd - tFleet}мс действий=${battle.action} записей=${battle.log.length} трюм=${cargo(run).length} флотов=${run.fleet.length}\n`);
  }
  return out;
}

export function playRun(seed, opts = {}) {
  const t0 = Date.now();
  const run = newRun({ seed, hullKey: opts.hull || 'corvette' });
  tidy(run);
  let steps = 0;
  // Запас шагов: забег обязан заканчиваться жизнями или победой, а не
  // терпением скрипта. 200 шагов хватает на три сектора с проходами; лимит
  // держим как страховку от петли, а не как границу забега.
  const MAX_STEPS = 200;

  let exitWhy = 'шаги';
  // Память бота: узлы, откуда он уже ушёл побитым. Соваться туда снова, пока
  // корпус не восстановлен, — это и есть пинг-понг, в котором забег не кончается.
  const avoid = new Map();
  const attempts = new Map();
  while (!run.over && steps++ < MAX_STEPS) {
    const all = choices(run);
    if (!all.length) { exitWhy = 'тупик карты'; break; }

    const hullShare = run.fleet.reduce((a, s) => a + s.hull / Math.max(1, computeStats(s, { plain: true }).stats.hull), 0) / run.fleet.length;
    // Починились до полного корпуса — старые обиды сняты, можно пробовать снова.
    if (hullShare > 0.97) avoid.clear();
    // Отсеиваем памятные узлы, но только если есть куда пойти вместо них:
    // единственный путь вперёд (например, босс) бот обязан принять.
    const fresh = all.filter((n) => !avoid.has(n.id) || hullShare > avoid.get(n.id) + 0.25);
    const opts2 = fresh.length ? fresh : all;
    const pick =
      // чиниться — если побиты и есть чем платить
      // Доки чинят бесплатно и полностью, поэтому запчастей не требуют:
      // прежнее условие осталось с тех пор, когда ремонт был платным, и бот
      // проходил мимо бесплатного дока побитым — это и прятало спираль износа.
      (hullShare < 0.99 && opts2.find((n) => n.type === 'repair'))
      // элиту и босса — только здоровым
      || (hullShare > 0.85 && opts2.find((n) => n.type === 'boss'))
      || (hullShare > 0.8 && opts2.find((n) => n.type === 'elite'))
      || opts2.find((n) => n.type === 'forge' && run.parts >= 60)
      || opts2.find((n) => n.type === 'anomaly')
      || opts2.find((n) => n.type === 'battle')
      || opts2.find((n) => n.type === 'fleet2' || n.type === 'fleet3')
      || (hullShare > 0.6 && opts2.find((n) => n.type === 'elite'))
      || opts2.find((n) => n.type === 'boss')
      || opts2[0];
    if (!pick) break;

    if (process.env.TRACE) {
      fs.appendFileSync(process.env.TRACE, `${new Date().toISOString().slice(11,23)} шаг ${steps} узел ${pick.id}/${pick.type} hull=${hullShare.toFixed(2)} жизней=${run.lives}\n`);
    }
    const tEnter = Date.now();
    const res = enterNode(run, pick.id);
    if (process.env.PHASELOG) {
      const d = Date.now() - tEnter;
      if (d > 50) fs.appendFileSync(process.env.PHASELOG, `!!! enterNode ${pick.id}/${pick.type} = ${d}мс\n`);
    }
    if (!res.ok) { run.currentNode = null; continue; }
    // отметки мощности каждые 2 пройденных узла
    if (run.clearedTotal % 2 === 0) {
      run.__track = run.__track || [];
      run.__track.push([Math.min(12, Math.ceil(run.clearedTotal / 2) || 1), shipPower(flagship(run))]);
    }

    if (res.kind === 'travel') continue;

    if (res.kind === 'battle') {
      // Две попытки — и бот идёт до конца. Иначе он крутится «заход → отход →
      // заход» на единственном доступном узле (у босса нет обхода), и забег
      // не кончается никогда, сжигая время замера на пустые бои.
      const tries = (attempts.get(pick.id) || 0) + 1;
      attempts.set(pick.id, tries);
      if (tries > 2) res.battle.noRetreat = true;
      const out = playBattle(run, res.battle);
      const bt = run.__byType = run.__byType || {};
      const row = bt[pick.type] = bt[pick.type] || { battles: 0, wins: 0, losses: 0, retreats: 0, hullSum: 0 };
      row.battles++;
      row.hullSum += hullShare;   // с каким корпусом вошли: отсекаем ли мы слабых
      if (out.win) row.wins++; else if (out.retreated) row.retreats++; else row.losses++;
      tidy(run);
      // Счётчики живущего в забеге, а не в замере: playRun импортируют
      // harness'ы, где tally из guard-блока не существует.
      if (out.stalled) run.__stalled = (run.__stalled || 0) + 1;
      if (out.retreated || out.stalled) avoid.set(pick.id, hullShare);
      if (out.win && out.boss) {
        const nxt = nextSector(run);
        if (!nxt.ok) break;
        tidy(run);
      }
    } else if (res.kind === 'anomaly') {
      const list = anomalyChoices(run, res.anomaly);
      // бот берёт последний безопасный вариант, кроме «ограбить» — оно ведёт в бой
      const idx = list.findIndex((c) => !/Ограбить/.test(c.label));
      const out = resolveAnomaly(run, idx >= 0 ? idx : 0);
      tidy(run);
      if (out.battle) { playBattle(run, startAmbush(run, out.battle.tier)); tidy(run); }
    } else if (res.kind === 'forge') {
      buyBetterHull(run);
      // точить лучший модуль, пока хватает запчастей и есть шанс
      let guard = 0;
      while (guard++ < 3) {
        const best = cargo(run).concat(flatInstalled(run)).sort((a, b) => moduleScore(b) - moduleScore(a))[0];
        if (!best) break;
        const r = enchantModuleRun(run, best.uid);
        if (!r.ok) break;
      }
      tidy(run);
    } else if (res.kind === 'repair') {
      drydockRepair(run);
      tidy(run);
    }
  }
  run.__ms = Date.now() - t0;
  run.__exit = run.over ? (run.over.win ? 'победа' : 'жизни кончились') : exitWhy;
  return run;
}

const stepsOf = (run) => run.log.length;

function flatInstalled(run) {
  const out = [];
  for (const s of run.fleet) for (const sl of slotList(s)) if (s.installed[sl.id]) out.push(s.installed[sl.id]);
  return out;
}

// ---------------------------------------------------------------------------
// Замер — только при прямом запуске: playRun импортируют отладочные harness'ы.
if (!/harness/.test(process.argv[1] || '')) {
  const N = Number(process.argv[2]) || 40;
  const t0 = Date.now();
  const wins = [];
  const exits = {};
  const byDepth = {};
const byType = {};
  const tally = { win: 0, loss: 0, battles: 0, victories: 0, defeats: 0, modules: 0, enchants: 0, fails: 0, sectors: 0, lives: 0, nodes: 0, retreats: 0, stalled: 0};

  for (let i = 0; i < N; i++) {
    const run = playRun(`баланс-${i}`, { hull: ['interceptor', 'corvette', 'frigate'][i % 3] });
    const s = runSummary(run);
    if (s.win) tally.win++; else tally.loss++;
    tally.battles += s.trophies.battles;
    tally.victories += s.trophies.wins;
    tally.defeats += s.trophies.losses;
    tally.modules += s.trophies.modules;
    tally.enchants += s.trophies.enchants;
    tally.fails += s.trophies.enchantFails;
    tally.retreats += s.trophies.retreats || 0;
  tally.stalled += run.__stalled || 0;
  for (const [type, r] of Object.entries(run.__byType || {})) {
    const t = byType[type] = byType[type] || { battles: 0, wins: 0, losses: 0, retreats: 0, hullSum: 0 };
    t.battles += r.battles; t.wins += r.wins; t.losses += r.losses; t.retreats += r.retreats; t.hullSum += r.hullSum;
  }
    tally.sectors += s.sector;
    tally.lives += s.lives;
    tally.nodes += s.cleared;
    wins.push(s.win ? 1 : 0);
    exits[run.__exit || 'неизвестно'] = (exits[run.__exit || 'неизвестно'] || 0) + 1;
    if (run.__ms > 4000) console.log(`  ⚠ забег ${i} шёл ${run.__ms} мс, шагов ${stepsOf(run)}, узлов ${s.cleared}`);
    for (const [milestone, power] of run.__track || []) {
      byDepth[milestone] = byDepth[milestone] || [];
      byDepth[milestone].push(power);
    }
  }

  const pct = (x) => `${(100 * x).toFixed(0)}%`;
  console.log(`забегов: ${N}`);
  console.log(`побед: ${tally.win} (${pct(tally.win / N)}) · поражений: ${tally.loss}`);
  console.log(`боёв: ${tally.battles} · выиграно ${tally.victories} (${pct(tally.victories / Math.max(1, tally.battles))})`);
  console.log(`отходов из боя: ${(tally.retreats / N).toFixed(2)} на забег · захлебнувшихся боёв: ${tally.stalled}`);
  console.log(`узлов пройдено в среднем: ${(tally.nodes / N).toFixed(1)} · сектор в среднем: ${(tally.sectors / N).toFixed(2)}`);
  console.log(`жизней осталось в среднем: ${(tally.lives / N).toFixed(2)} из ${MAX_LIVES}`);
  console.log(`модулей добыто: ${(tally.modules / N).toFixed(1)} на забег · заточек ${(tally.enchants / N).toFixed(1)} (провалов ${(tally.fails / N).toFixed(1)})`);
  console.log('');
  if (typeof byType !== 'undefined') {
  const rows = Object.entries(byType).sort((a, b) => b[1].battles - a[1].battles);
  console.log('исход боёв по типу узла:');
  for (const [type, r] of rows) {
    console.log(`  ${type.padEnd(8)} боёв ${String(r.battles).padStart(4)} · побед ${pct(r.wins / r.battles).padStart(4)} · поражений ${String(r.losses).padStart(3)} · отходов ${String(r.retreats).padStart(3)} · корпус на входе ${(r.hullSum / r.battles).toFixed(2)}`);
  }
}
console.log('чем кончились забеги: ' + Object.entries(exits).map(([k, v]) => `${k} — ${v}`).join(', '));
  console.log(`время: ${((Date.now() - t0) / 1000).toFixed(1)} с`);
  console.log('мощность флагмана по пройденным узлам (каждые 2 узла):');
  for (const d of Object.keys(byDepth).sort()) {
    const arr = byDepth[d];
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    console.log(`  этап ${d}: ${avg.toFixed(1)}  (n=${arr.length})`);
  }
}
