// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — deck.js
//  Сборка колоды: одна и та же логика и для игрока («автосбор»), и для
//  соперников. Смысл в том, чтобы колода имела рабочую кривую стоимости,
//  а не просто состояла из самых жирных юнитов.
// =============================================================================

import { vetTier } from './units.js';
import { eraOf } from './gears.js';

export const worth = (bp, tier = 0) =>
  bp.atk * 1.1 + bp.hp * 0.8 + bp.keywords.reduce((s, k) => s + (k.value || 1), 0) + tier * 2;

/**
 * Выбирает из юнитов колоду нужного размера с рабочей кривой.
 * @param {Array} units — юниты (у каждого .blueprint)
 * @param {number} size — размер колоды
 * @param {number} era — эпоха (определяет, что считать «дешёвым»)
 * @param {object} rng — ГПСЧ (для лёгкой вариативности у соперников)
 * @param {string} style — 'balanced' | 'aggro' | 'control'
 */
export function buildDeck(units, size, era = 1, rng = null, style = 'balanced') {
  if (!units.length) return [];
  const cap = eraOf(era).energyCap;
  const lowMax = Math.max(2, Math.round(cap * 0.34));
  const midMax = Math.max(lowMax + 1, Math.round(cap * 0.62));

  const profile = {
    balanced: { low: 0.35, mid: 0.40, high: 0.25 },
    aggro:    { low: 0.55, mid: 0.35, high: 0.10 },
    control:  { low: 0.15, mid: 0.35, high: 0.50 },
    swarm:    { low: 0.50, mid: 0.40, high: 0.10 },
    midrange: { low: 0.30, mid: 0.45, high: 0.25 },
  }[style] || { low: 0.35, mid: 0.40, high: 0.25 };

  const band = (u) => {
    const c = u.blueprint.cost;
    return c <= lowMax ? 'low' : c <= midMax ? 'mid' : 'high';
  };
  const score = (u) => {
    const t = vetTier(u);
    let w = worth(u.blueprint, t) / Math.max(1, u.blueprint.cost) * 2 + worth(u.blueprint, t) * 0.15;
    if (style === 'aggro' && u.blueprint.keywords.some((k) => ['haste', 'trample', 'firstStrike', 'siege'].includes(k.fx))) w += 3;
    if (style === 'control' && u.blueprint.keywords.some((k) => ['endPlague', 'etbStun', 'etbScry', 'etbDraw', 'indestructible'].includes(k.fx))) w += 3;
    if (style === 'swarm' && u.blueprint.keywords.some((k) => ['etbInspire', 'etbSwarm', 'bond', 'bulwark'].includes(k.fx))) w += 3;
    if (rng) w += rng.next() * 1.2;
    return w;
  };

  const buckets = { low: [], mid: [], high: [] };
  for (const u of units) buckets[band(u)].push(u);
  for (const k of Object.keys(buckets)) buckets[k].sort((a, b) => score(b) - score(a));

  const chosen = [];
  for (const k of ['low', 'mid', 'high']) {
    const need = Math.round(size * profile[k]);
    let taken = 0;
    for (const u of buckets[k]) {
      if (taken >= need || chosen.length >= size) break;
      chosen.push(u); taken++;
    }
  }
  // добор из лучшего доступного
  const rest = units.filter((u) => !chosen.includes(u)).sort((a, b) => score(b) - score(a));
  for (const u of rest) { if (chosen.length >= size) break; chosen.push(u); }

  return chosen.slice(0, size).sort((a, b) => a.blueprint.cost - b.blueprint.cost);
}

/** Кривая стоимости для интерфейса. */
export function manaCurve(units) {
  const curve = {};
  for (const u of units) curve[u.blueprint.cost] = (curve[u.blueprint.cost] || 0) + 1;
  return curve;
}
