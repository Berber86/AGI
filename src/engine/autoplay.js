// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — engine/autoplay.js
//  Полностью автоматический бой: обе стороны играет ИИ. Используется для
//  «Автобоя» в интерфейсе, для симуляций баланса и для тестов.
// =============================================================================

import { startTurn, resolveCombat, endTurn, beginCombat } from './battle.js';
import { aiPlayOne, aiDeclareAttack } from './ai.js';

export function autoplay(b, { maxSteps = 1200, log = null } = {}) {
  if (b.phase === 'idle') startTurn(b);
  let steps = 0;
  while (!b.over && steps++ < maxSteps) {
    const cur = b.active;
    let played = 0;
    while (aiPlayOne(b, cur) && played++ < 16) { /* главная фаза */ }
    if (b.phase.startsWith('main')) {
      beginCombat(b);
      aiDeclareAttack(b, cur);
      resolveCombat(b);
      let more = 0;
      while (aiPlayOne(b, cur) && more++ < 16) { /* вторая главная */ }
    }
    if (log) log(b);
    endTurn(b);
  }
  return b;
}

export const winnerOf = (b) => (b.over ? b.over.winner : null);
