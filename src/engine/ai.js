/**
 * Выбор цели и автобой.
 *
 * Автобой нужен не только боту: на нём держатся тесты баланса и проверка, что
 * любой бой завершается. Игрок при этом всегда может выбрать цель сам — ИИ
 * лишь предлагает вариант по умолчанию тем же расчётом.
 *
 * Логика простая и объяснимая: добить того, кого можно убить этим залпом;
 * иначе — того, у кого меньше всего прочности со щитом; «Маяк» притягивает
 * огонь сильнее. Никакого чтения будущего и никаких скрытых преимуществ.
 */

import { advance, performAction, enemiesOf, upcoming, isAlive, volleySize } from './combat.js';
import { computeStats } from './ship.js';

/** Грубая оценка урона залпа: без бросков, только среднее. */
export function estimateVolley(actor, target) {
  const stats = actor.stats;
  const armor = Math.max(0.05, target.stats.armor || 1);
  return stats.damage * volleySize(null, actor) / armor;
}

export function chooseTarget(b, actor) {
  const foes = enemiesOf(b, actor);
  if (!foes.length) return null;
  const scored = foes.map((f) => {
    const effective = f.shield + f.hull;
    let score = -effective;
    // добить возможно — приоритет; оценка считается против конкретной цели,
    // потому что её броня входит в делитель
    if (estimateVolley(actor, f) >= f.hull) score += 1000;
    if (f.fx.beacon) score += 120;
    // элита и босс сосредотачивают огонь на самой опасной цели
    const threat = f.stats.damage * (f.stats.salvo || 1) * (f.stats.rate || 1);
    score += threat * 0.6;
    return { f, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].f;
}

/**
 * Сыграть бой до конца, обе стороны — ИИ.
 * @returns {{winner:string|null, battle:object}}
 */
export function autoBattle(b, { maxActions = 220 } = {}) {
  let guard = 0;
  while (!b.over && guard++ < maxActions) {
    const actor = advance(b);
    if (!actor || !isAlive(actor)) continue;
    const target = chooseTarget(b, actor);
    if (!target) break;
    performAction(b, actor, target);
  }
  return { winner: b.over?.winner || null, battle: b };
}

/** Предложить цель для корабля игрока (подсветка по умолчанию). */
export function suggestTarget(b, actor) {
  const t = chooseTarget(b, actor);
  return t ? t.uid : null;
}

/** Порядок следующих действий для подписи очереди. */
export function nextTurns(b, n = 5) { return upcoming(b, n); }

export { computeStats };
