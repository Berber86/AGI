// mutations.js — the part editor between generations and how parts change the cell.

import { PARTS, PART_ORDER } from './config.js';

export function rollChoices(ownedParts, rng, count = 3) {
  const pool = PART_ORDER.filter((id) => !ownedParts[id]);
  if (!pool.length) return [];
  const shuffled = rng.shuffle(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function applyPart(player, partId) {
  if (!PARTS[partId]) return false;
  const current = player.parts[partId];
  if (partId === 'flagellum') {
    player.parts[partId] = Math.min(3, (typeof current === 'number' ? current : 0) + 1);
  } else {
    player.parts[partId] = true;
  }
  recomputeStats(player);
  return true;
}

export function recomputeStats(player) {
  const s = {
    speedMul: 1,
    turnMul: 1,
    melee: 0,
    retaliate: 0,
    venom: 0,
    shock: 0,
    eatBonus: 0,
    debris: 0,
    partsCount: 0,
  };
  for (const id of PART_ORDER) {
    const owned = player.parts[id];
    if (!owned) continue;
    const def = PARTS[id];
    const stacks = typeof owned === 'number' ? owned : 1;
    s.partsCount += stacks;
    if (def.speed) s.speedMul += def.speed * stacks;
    if (def.turn) s.turnMul += def.turn * stacks;
    if (def.melee) s.melee += def.melee * stacks;
    if (def.retaliate) s.retaliate += def.retaliate * stacks;
    if (def.venom) s.venom += def.venom * stacks;
    if (def.shock) s.shock += stacks;
    if (def.eatBonus) s.eatBonus += def.eatBonus * stacks;
    if (def.debris) s.debris += def.debris * stacks;
  }
  player.stats = s;
  return s;
}

/** A part shows up on the body only when the creature is big enough to carry it. */
export function visibleParts(player) {
  const minRadius = { flagellum: 0, cilia: 14, spike: 18, stinger: 20, venom: 22, electric: 24, jaw: 18 };
  const out = {};
  for (const id of PART_ORDER) {
    if (!player.parts[id]) continue;
    if (player.radius >= (minRadius[id] || 0)) out[id] = player.parts[id];
  }
  return out;
}
