// tests/balance.mjs — балансный прогон: простой бот-эвристика играет шесть минут
// за каждую сложность и печатает темп прогрессии. Помогает ловить регрессии баланса.
// Запуск: node tests/balance.mjs [минут]
//
// Бот: идёт к ближайшей еде или мелкой добыче, убегает от крупных, кусает всё впереди,
// тратит ДНК по «списку желаний» родословной, лечится у гнезда при тяжёлых ранах.

import { Game } from '../js/core.js';
import { PARTS } from '../js/parts.js';
import { CFG } from '../js/config.js';
import { tryEvolve, canCallAlly, callAlly } from '../js/player.js';
import { dist } from '../js/util.js';

const MINUTES = Number(process.argv[2] ?? 6);
const WISHLIST = {
  herb: ['filter', 'cilia', 'mito', 'cytoplasm', 'spikes', 'eyespot', 'symbionts', 'gills', 'membrane'],
  carn: ['vacuole', 'flagellum', 'spikes', 'mito', 'lytik', 'jaws', 'toxin', 'fins', 'armor'],
  omni: ['disc', 'vacuole', 'cilia', 'filter', 'mito', 'spikes', 'eyespot', 'lytik', 'symbionts'],
  symb: ['symbionts', 'eyespot', 'cilia', 'mito', 'vacuole', 'filter', 'spikes', 'luciferin', 'membrane'],
};
// 'jaws'/'disc'/'beak' — это рот игрока, в PARTS их нет: отфильтруем
const partsOf = (id) => PARTS[id];

function stubMeta() {
  return {
    ach: new Set(), codex: new Set(),
    settings: { quality: 'low', particles: 0.4 },
    runs: [], onRunEnd() {},
  };
}

function bot(game, dt) {
  const p = game.player;
  const out = { ax: 0, ay: 0, bite: true, dash: false, ability: false };
  if (!p.alive) return out;

  // 1) угроза рядом?
  let threat = null, td = 1e9;
  for (const c of game.creaturesNear(p.x, p.y, 420)) {
    if (c.dead || c.ally) continue;
    const r = c.r / p.r;
    if (r > 1.25 && (c.hunt || r > 1.55)) {
      const d = dist(p.x, p.y, c.x, c.y);
      if (d < td) { td = d; threat = c; }
    }
  }
  // 2) цель для еды
  let target = null, best = 1e9;
  for (const f of game.foodsNear(p.x, p.y, 700)) {
    if (f.dead) continue;
    const d = dist(p.x, p.y, f.x, f.y);
    const w = f.kind === 'relic' ? 0.25 : f.kind === 'chunk' ? 0.8 : 1;
    if (d * w < best) { best = d * w; target = f; }
  }
  for (const c of game.creaturesNear(p.x, p.y, 460)) {
    if (c.dead || c.ally || c.sp.family === 'plant') continue;
    if (c.r * 1.2 > p.r) continue;
    const d = dist(p.x, p.y, c.x, c.y);
    if (d < best * 0.8 && d < 380) { best = d; target = c; }
  }

  if (threat && td < 320) {
    const a = Math.atan2(p.y - threat.y, p.x - threat.x);
    out.ax = Math.cos(a); out.ay = Math.sin(a);
    out.dash = td < 150;
    out.ability = true;
  } else if (p.hp < p.maxHp * 0.35 && dist(p.x, p.y, p.nestPos.x, p.nestPos.y) > 600) {
    const a = Math.atan2(p.nestPos.y - p.y, p.nestPos.x - p.x);
    out.ax = Math.cos(a); out.ay = Math.sin(a);
    out.ability = true;
  } else if (target) {
    const a = Math.atan2(target.y - p.y, target.x - p.x);
    out.ax = Math.cos(a); out.ay = Math.sin(a);
  } else {
    // патруль по кругу
    const a = game.time * 0.2;
    out.ax = Math.cos(a); out.ay = Math.sin(a);
  }
  return out;
}

function playLife(difficulty, lineage, minutes) {
  const meta = stubMeta();
  const game = new Game({ settings: meta.settings, meta, difficulty, lineage, seed: 4242 + difficulty.length * 17 });
  const wish = WISHLIST[lineage] ?? WISHLIST.omni;
  const marks = {};
  const total = Math.round(minutes * 60 * 60);
  let dead = false;
  game.on('death', () => { dead = true; });
  game.on('win', () => { dead = true; });

  for (let i = 0; i < total && !dead; i++) {
    const dt = 1 / 60;
    game.update(dt, bot(game, dt));
    // тратим ДНК раз в секунду
    if (i % 60 === 0) {
      const p = game.player;
      for (const id of wish) {
        if (!partsOf(id)) continue;
        const lvl = p.parts[id] ?? 0;
        if (lvl >= (PARTS[id].maxLevel ?? 1)) continue;
        const r = tryEvolve(game, id);
        if (r.ok) break;
      }
      const call = canCallAlly(game);
      if (call.ok && game.countAllies() < 2) callAlly(game);
    }
    if (!marks.t5 && game.player.tier >= 5) marks.t5 = game.time;
    if (!marks.t10 && game.player.tier >= 10) marks.t10 = game.time;
    if (!marks.relic1 && game.player.relicGenes >= 1) marks.relic1 = game.time;
  }
  const p = game.player;
  return {
    difficulty, lineage,
    tier: p.tier, dna: Math.round(p.dna), kills: p.counters.kills, plants: p.counters.plants,
    chunks: p.counters.chunks ?? 0, dances: p.counters.dances, relics: p.relicGenes,
    t5: marks.t5, t10: marks.t10, relic1: marks.relic1, dead,
    minutes: game.time / 60,
  };
}

const fmt = (t) => (t ? `${(t / 60).toFixed(1)} мин` : '—');
console.log(`Балансный прогон: ${MINUTES} минут на жизнь, бот-эвристика\n`);
console.log('сложность  родословная  размер  ДНК   убийств  падаль  танцев  ген  размер5  размер10  умер');
console.log('─'.repeat(96));
for (const difficulty of ['calm', 'normal', 'harsh', 'abyss']) {
  for (const lineage of ['herb', 'carn', 'omni', 'symb']) {
    const r = playLife(difficulty, lineage, MINUTES);
    console.log([
      r.difficulty.padEnd(10), r.lineage.padEnd(11), String(r.tier).padStart(5), String(r.dna).padStart(6),
      String(r.kills).padStart(8), String(r.chunks).padStart(7), String(r.dances).padStart(7),
      String(r.relics).padStart(4), fmt(r.t5).padStart(8), fmt(r.t10).padStart(9),
      (r.dead ? 'да' : 'нет').padStart(6),
    ].join(' '));
  }
}
console.log('\nОриентиры: до 5-го размера — примерно 1.5–2.5 мин, до 10-го — 5–8 мин.');
