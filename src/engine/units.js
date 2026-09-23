// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — units.js
//  Юнит ростера = экземпляр проекта (blueprint). Юниты переживают бой: павшие
//  возвращаются к следующему колодостроению, а ветераны растут в уровнях и
//  отпирают «спящие» комбинации шестерёнок, не влезшие на карту при создании.
// =============================================================================

import { KEYWORDS } from './gears.js';

let SEQ = 1;
export const resetUnitSeq = (n = 1) => { SEQ = n; };

export function makeUnit(blueprint, opts = {}) {
  return {
    id: opts.id || `u${SEQ++}`,
    bpKey: blueprint.key,
    blueprint,
    xp: opts.xp || 0,
    battles: opts.battles || 0,
    kills: opts.kills || 0,
    deaths: opts.deaths || 0,
    tag: opts.tag || '',
  };
}

/** Уровень ветеранства: 0..3. Каждый уровень — +1/+1 навсегда. */
export const vetTier = (u) => Math.min(3, Math.floor((u.xp || 0) / 3));

export const VET_NAMES = ['Новобранец', 'Бывалый', 'Закалённый', 'Легенда'];

/**
 * Проект с учётом ветеранства. На 3-м уровне юнит отпирает одно из «спящих»
 * свойств — ту комбинацию шестерёнок, которой не хватило слота при создании.
 */
export function effectiveBlueprint(u, opts = {}) {
  const bp = u.blueprint || u;
  const tier = opts.noVeterancy ? 0 : vetTier(u);
  if (tier === 0) return bp;
  const out = { ...bp, keywords: bp.keywords.map((k) => ({ ...k })), vetTier: tier };
  out.atk = bp.atk + tier;
  out.hp = bp.hp + tier;
  if (tier >= 3 && bp.unusedKeywords && bp.unusedKeywords.length) {
    const extra = bp.unusedKeywords[0];
    if (!out.keywords.some((k) => k.kw === extra.kw)) {
      out.keywords = [...out.keywords, { ...extra, lvl: extra.lvl || 1, value: (KEYWORDS[extra.kw]?.value ?? 1) }];
      out.awakened = extra.name;
    }
  }
  out.vetName = VET_NAMES[tier];
  return out;
}

/** Опыт после боя: выжил или пал — одинаково учится. */
export function grantExperience(u, result) {
  u.battles = (u.battles || 0) + 1;
  if (result.died) u.deaths = (u.deaths || 0) + 1; else u.kills = (u.kills || 0) + 1;
  const before = vetTier(u);
  u.xp = (u.xp || 0) + (result.won ? 2 : 1) + (result.died ? 0 : 1);
  return vetTier(u) > before;
}
