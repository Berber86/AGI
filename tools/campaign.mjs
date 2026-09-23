// Прогон целой кампании «бот играет за человека»: проверяет мета-цикл и экономику.
import * as S from '../src/engine/state.js';
import { startTurn, resolveCombat, endTurn } from '../src/engine/battle.js';
import { aiPlayOne, aiDeclareAttack } from '../src/engine/ai.js';
import { DISCOVERIES, DISCOVERY_LIST } from '../src/engine/discoveries.js';
import { generateCard, compatible, checkCombination } from '../src/engine/cardgen.js';
import { makeRng } from '../src/engine/rng.js';
import { canAttackRegion, rivalPower, buildRival } from '../src/engine/civ.js';

export function runCampaign(seed = 'campaign-demo', opts = {}) {
  const rng = makeRng(seed);
  const st = S.newGame({ civName: opts.civName || 'Бот-Град', seed, legacy: opts.legacy || 'craft', difficulty: opts.difficulty || 1 });
  const lines = [];
  const say = (t) => lines.push(t);

  let guard = 0;
  while (!st.victory && guard++ < (opts.maxTurns || 120)) {
    // 1) эпоха прежде всего (иначе бот упирается в потолок доступных регионов)
    if (S.canAdvanceEra(st).ok) S.advanceEra(st);
    // 2) наука — но держим резерв на следующую смену эпохи
    const reserve = S.ECONOMY.eraAdvance[Math.min(6, st.era + 1)] * 0.55;
    for (let i = 0; i < 6; i++) {
      const avail = S.availableResearch(st).sort((a, b) => a.cost - b.cost);
      const pick = avail.filter((d) => st.science - d.cost >= reserve).pop();
      if (!pick) break;
      S.research(st, pick.id);
    }
    if (S.canAdvanceEra(st).ok) S.advanceEra(st);

    // 3) проектирование: перебираем случайные совместимые наборы
    let crafts = 0;
    while (st.materials > 90 && crafts++ < 8) {
      const slots = 1 + rng.int(Math.min(4, Math.max(1, Math.ceil(st.era * 0.8))));
      const comps = [];
      let tries = 0;
      while (comps.length < slots && tries++ < 80) {
        const cand = st.researched.filter((id) => DISCOVERIES[id].era <= st.era
          && comps.filter((c) => c === id).length < 2
          && comps.every((c) => compatible(c, id)));
        if (!cand.length) break;
        comps.push(rng.weighted(cand, (id) => 1 + DISCOVERIES[id].era * 0.5 + (rng.chance(0.5) ? 1 : 0)));
      }
      if (comps.length !== slots) continue;
      if (!checkCombination(comps).ok) continue;
      const bp = generateCard(comps);
      if (!bp || st.blueprints[bp.key]) continue;
      const r = S.craft(st, comps);
      if (r.ok) S.recruit(st, bp.key, rng.chance(0.5) ? 2 : 1);
    }
    // 4) найм
    const keys = Object.keys(st.blueprints);
    let t = 0;
    while (st.roster.length < S.deckLimits(st).max + 5 && keys.length && t++ < 80) {
      const k = rng.weighted(keys, (kk) => {
        const bp = st.blueprints[kk];
        const have = st.roster.filter((u) => u.bpKey === kk).length;
        return Math.max(0.2, (bp.atk + bp.hp + bp.keywords.length * 3) / (1 + have));
      });
      if (!S.recruit(st, k, 1).ok) break;
    }
    S.autoDeck(st);

    // 5) война
    const targets = st.world.regions.filter((r) => canAttackRegion(st, r));
    if (!targets.length) { S.develop(st); continue; }
    targets.sort((a, b) => a.era - b.era || a.index - b.index);
    const target = targets[0];
    const sb = S.startBattle(st, target.id);
    if (!sb.ok) { S.develop(st); say(`  ! ${sb.reason}`); continue; }
    const b = sb.battle;
    b.sides.me.isHuman = false;
    startTurn(b);
    let n = 0;
    while (!b.over && n++ < 900) {
      const cur = b.active;
      let p = 0;
      while (aiPlayOne(b, cur) && p++ < 14) { /* */ }
      if (b.phase.startsWith('main')) { aiDeclareAttack(b, cur); resolveCombat(b); while (aiPlayOne(b, cur) && p++ < 16) { /* */ } }
      endTurn(b);
    }
    const won = b.over?.winner === 'me';
    S.finishBattle(st, b, won ? 'win' : 'lose');
    const d = S.deckInfo(st);
    say(`ход ${String(st.stats.turns).padStart(2)}: эпоха ${st.era} | «${target.name}»(${target.era}) → ${won ? 'ПОБЕДА' : 'пораж.'} за ${b.round} р. | наука ${String(st.science).padStart(4)} мат ${String(st.materials).padStart(4)} | проектов ${Object.keys(st.blueprints).length} юнитов ${st.roster.length} колода ${d.count} | регионов ${st.conquered}/10`);
    if (st.conquered >= 10) break;
  }
  return { st, lines };
}

const isMain = process.argv[1] && /campaign\.mjs$/.test(process.argv[1]);
if (isMain) {
  for (const legacy of ['craft', 'war', 'life']) {
    const { st, lines } = runCampaign(`demo-${legacy}`, { legacy, maxTurns: 60 });
    console.log(`\n=== Наследие: ${legacy} ===`);
    console.log(lines.join('\n'));
    console.log(`ИТОГ: ${st.victory ? '👑 ПОБЕДА' : 'не завершено'} | эпоха ${st.era}, боёв ${st.stats.battles} (побед ${st.stats.wins}), открытий ${st.researched.length}, проектов ${Object.keys(st.blueprints).length}, юнитов ${st.roster.length}, регионов ${st.conquered}/10`);
  }
}
