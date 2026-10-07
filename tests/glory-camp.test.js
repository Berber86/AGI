/**
 * Слава, лагерь и эпохи: единственный контур прогресса боевого прототипа.
 * Победа → слава → улучшения лагеря и ковка карт → накопленная слава поднимает эпоху
 * → племена становятся сильнее и открывается выбор наследия.
 */
const assert = require('node:assert/strict');
const test = require('node:test');

const Campaign = require('../campaign.js');

function founded(overrides = {}) {
  return Campaign.foundCampaignState(Campaign.createState(), {
    seedId: 'field', historicalCultureId: 'natufian', ...overrides,
  }).state;
}

/** Набор без бонусов к колоде: лимит 4, здоровье 7 — удобно проверять смену наследия. */
function plainFounded() {
  return founded({ seedId: 'river', historicalCultureId: 'natufian' });
}

function withGlory(state, glory) {
  const next = Campaign.clone(state);
  next.player.glory = glory;
  return next;
}

test('победа даёт славу по эпохе и силе соперника, поражение — только опыт', () => {
  const state = founded();
  assert.equal(Campaign.gloryForWin(state, { opponentId: 'reed', won: false }), Campaign.GLORY_LOSS);
  assert.equal(Campaign.gloryForWin(state, { opponentId: 'reed', won: true, streak: 0 }), Campaign.GLORY_WIN_BASE);
  assert.equal(
    Campaign.gloryForWin(state, { opponentId: 'steppe', won: true, leaderBattle: true, streak: 0 }),
    Campaign.GLORY_WIN_BASE + Campaign.GLORY_LEADER_BONUS,
    'вождь племени дороже обычного дозора'
  );
  // серия побед добавляет славы, но не бесконечно
  assert.equal(Campaign.gloryForWin(state, { opponentId: 'reed', won: true, streak: 2 }), Campaign.GLORY_WIN_BASE + 2 * Campaign.GLORY_STREAK_STEP);
  assert.equal(Campaign.gloryForWin(state, { opponentId: 'reed', won: true, streak: 50 }), Campaign.GLORY_WIN_BASE + Campaign.GLORY_STREAK_MAX);

  const win = Campaign.recordBattleState(state, { opponentId: 'reed', won: true });
  assert.equal(win.error, null);
  assert.equal(win.state.player.glory, state.player.glory + win.glory);
  assert.equal(win.state.player.gloryTotal, win.glory);
  assert.equal(win.state.player.wins, 1);
  assert.equal(win.state.player.streak, 1);
  assert.equal(win.state.player.bestStreak, 1);
  assert.match(win.message, /Победа над «Илмар из Речных Земель»/u);
  assert.match(win.state.player.chronicle.at(-1).text, /Победа над Илмар из Речных Земель/u);

  const loss = Campaign.recordBattleState(win.state, { opponentId: 'north', won: false });
  assert.equal(loss.state.player.losses, 1);
  assert.equal(loss.state.player.streak, 0, 'поражение сбрасывает серию');
  assert.equal(loss.state.player.bestStreak, 1, 'лучшая серия сохраняется');
  assert.equal(loss.glory, Campaign.GLORY_LOSS);

  assert.match(Campaign.recordBattleState(state, { opponentId: 'нет', won: true }).error, /Соперник не найден/u);
});

test('накопленная слава поднимает эпоху, тянет за собой племена и открывает выбор наследия', () => {
  const state = founded();
  const before = Campaign.nextEraProgress(state);
  assert.equal(before.era, 0);
  assert.equal(before.need, Campaign.ERA_GLORY_THRESHOLDS[1]);
  assert.equal(before.left, Campaign.ERA_GLORY_THRESHOLDS[1]);
  assert.equal(before.progress, 0);

  // добиваем славу до порога эпохи 1
  let current = state;
  let advanced = null;
  for (let i = 0; i < 30 && !advanced; i++) {
    const out = Campaign.recordBattleState(current, { opponentId: 'reed', won: true });
    current = out.state;
    advanced = out.eraAdvanced;
  }
  assert.ok(advanced, 'эпоха должна была смениться');
  assert.equal(advanced.to, 1);
  assert.equal(current.player.era, 1);
  assert.ok(current.player.gloryTotal >= Campaign.ERA_GLORY_THRESHOLDS[1]);

  // племена, которые догоняют игрока на первой эпохе, поднялись; степняки ждут вторую
  assert.equal(current.opponents.find(o => o.id === 'reed').era, 1);
  assert.equal(current.opponents.find(o => o.id === 'north').era, 1);
  assert.equal(current.opponents.find(o => o.id === 'steppe').era, 0);

  // выбор наследия открыт и предлагает три культуры новой эпохи
  const choice = Campaign.getCultureChoice(current);
  assert.equal(choice.era, 1);
  assert.equal(choice.eraLabel, Campaign.ERAS[1]);
  assert.equal(choice.candidates.length, Campaign.CULTURE_CHOICE_SIZE);
  assert.ok(choice.candidates.every(c => c.era === 1), 'кандидаты — культуры новой эпохи');
  assert.ok(choice.candidates.every(c => Array.isArray(c.combat) && c.combat.length > 0), 'у каждого кандидата виден боевой бонус');
  assert.match(choice.keep.label, /Сохранить прежнее наследие/u);
  assert.match(current.player.chronicle.at(-1).text, /Наступила эпоха «Античный мир»/u);

  const after = Campaign.nextEraProgress(current);
  assert.equal(after.era, 1);
  assert.equal(after.nextLabel, Campaign.ERAS[2]);
  assert.ok(after.left > 0);
});

test('последняя эпоха не требует славы и не предлагает новых наследий бесконечно', () => {
  const state = founded();
  const last = Campaign.clone(state);
  last.player.era = Campaign.ERAS.length - 1;
  last.player.gloryTotal = Campaign.ERA_GLORY_THRESHOLDS.at(-1);
  const progress = Campaign.nextEraProgress(last);
  assert.equal(progress.finalEra, true);
  assert.equal(progress.left, 0);
  assert.equal(progress.progress, 100);
  assert.equal(Campaign.eraForGlory(Number.MAX_SAFE_INTEGER), Campaign.ERAS.length - 1);
  assert.equal(Campaign.eraForGlory(0), 0);
});

test('принятое наследие меняет боевые параметры, а «оставить прежнее» — нет', () => {
  const state = plainFounded();
  const withChoice = Campaign.clone(state);
  withChoice.player.era = 1;
  withChoice.player.pendingCultureChoice = { era: 1, candidates: ['akkad', 'sumer', 'minoan'] };
  withChoice.player.culturalLineage = ['natufian'];

  const before = Campaign.getBattleConfig(withChoice);
  const keep = Campaign.chooseCultureState(withChoice, 'keep');
  assert.equal(keep.error, null);
  assert.equal(keep.kept, true);
  assert.equal(keep.state.player.historicalCulture.id, 'natufian');
  assert.equal(keep.state.player.pendingCultureChoice, null);
  assert.deepEqual(Campaign.getBattleConfig(keep.state).perks, before.perks);

  const again = Campaign.clone(state);
  again.player.era = 1;
  again.player.pendingCultureChoice = { era: 1, candidates: ['akkad', 'sumer', 'minoan'] };
  again.player.culturalLineage = ['natufian'];
  const accept = Campaign.chooseCultureState(again, 'akkad');
  assert.equal(accept.error, null);
  assert.equal(accept.state.player.historicalCulture.id, 'akkad');
  assert.deepEqual(accept.state.player.culturalLineage, ['natufian', 'akkad'], 'линия наследия растёт');
  const after = Campaign.getBattleConfig(accept.state);
  assert.ok(after.deckLimit > before.deckLimit, 'Аккад даёт слот колоды');
  assert.match(accept.state.player.campaignNotice, /Наследие принято: Аккад/u);

  // без открытого выбора наследие не меняется
  assert.match(Campaign.chooseCultureState(accept.state, 'sumer').error, /Выбор наследия не открыт/u);
  // чужой для эпохи вариант не принимается
  const wrong = Campaign.clone(again);
  assert.match(Campaign.chooseCultureState(wrong, 'trypillia').error, /Такого наследия нет/u);
});

test('наследие не урезает молча собранную колоду', () => {
  const state = plainFounded();
  const akkad = Campaign.clone(state);
  akkad.player.era = 1;
  akkad.player.historicalCulture = Campaign.HISTORICAL_CULTURES.find(c => c.id === 'akkad');
  akkad.player.culturalLineage = ['natufian', 'akkad'];
  const limit = Campaign.getBattleConfig(akkad).deckLimit;
  akkad.player.deckCardIds = Campaign.STARTER_CARDS.slice(0, limit).map(c => c.id);
  akkad.player.pendingCultureChoice = { era: 2, candidates: ['byzantium', 'caliphate', 'song-china'] };

  const out = Campaign.chooseCultureState(akkad, 'byzantium');
  assert.match(out.error, /уменьшит лимит колоды/u);
  assert.equal(out.state.player.historicalCulture.id, 'akkad', 'наследие не сменилось');
  assert.ok(out.state.player.pendingCultureChoice, 'выбор всё ещё открыт');

  // если колоду сократить, тот же выбор проходит
  const trimmed = Campaign.clone(akkad);
  trimmed.player.deckCardIds = trimmed.player.deckCardIds.slice(0, limit - 1);
  const ok = Campaign.chooseCultureState(trimmed, 'byzantium');
  assert.equal(ok.error, null);
  assert.equal(ok.state.player.historicalCulture.id, 'byzantium');
});

test('лагерь: цена растёт с уровнем, а потолок уровня и боевой предел останавливают покупку', () => {
  const state = withGlory(founded(), 500);
  const costs = Campaign.CAMP_UPGRADES.max_hp.cost;
  let current = state;
  for (let level = 0; level < costs.length; level++) {
    const summary = Campaign.campSummary(current).find(u => u.id === 'max_hp');
    assert.equal(summary.level, level);
    assert.equal(summary.cost, costs[level], `цена уровня ${level}`);
    const out = Campaign.buyUpgradeState(current, 'max_hp');
    assert.equal(out.error, null);
    assert.equal(out.level, level + 1);
    current = out.state;
  }
  assert.equal(current.player.upgrades.max_hp, 3);
  assert.equal(Campaign.getBattleConfig(current).hp, Campaign.COMBAT_BASE.hp + Campaign.combatPerks(current).max_hp);
  assert.match(Campaign.buyUpgradeState(current, 'max_hp').error, /на пределе/u);

  // боевой потолок: атака уже +2 от наследия и замысла, поэтому доктрина ничего не даст
  const capped = withGlory(founded({ seedId: 'forge', historicalCultureId: 'yamnaya' }), 500);
  assert.equal(Campaign.getBattleConfig(capped).atkBonus, Campaign.COMBAT_CAPS.atkBonus);
  assert.match(Campaign.buyUpgradeState(capped, 'unit_power').error, /на боевом пределе/u);
  assert.equal(Campaign.buyUpgradeState(capped, 'unit_power').state.player.glory, 500, 'слава не списана');

  // не хватает славы
  const poor = withGlory(founded(), 5);
  assert.match(Campaign.buyUpgradeState(poor, 'deck_slots').error, /Нужно 20 славы/u);
  assert.equal(Campaign.buyUpgradeState(poor, 'deck_slots').state.player.glory, 5);
  assert.match(Campaign.buyUpgradeState(poor, 'несуществующее').error, /Такого улучшения лагеря нет/u);
});

test('сводка лагеря показывает уровень, цену, эффект и доступность для каждого улучшения', () => {
  const state = withGlory(plainFounded(), 25);
  const summary = Campaign.campSummary(state);
  assert.deepEqual(summary.map(u => u.id), Campaign.COMBAT_KEYS);
  for (const item of summary) {
    assert.equal(item.level, 0);
    assert.equal(item.max, Campaign.CAMP_UPGRADES[item.id].max);
    assert.equal(item.cost, Campaign.CAMP_UPGRADES[item.id].cost[0]);
    assert.equal(item.label, Campaign.COMBAT_LABELS[item.id]);
    assert.ok(item.note.length > 10, 'у улучшения есть пояснение');
    assert.equal(item.affordable, item.cost <= 25, `${item.id}: ${item.cost} славы при 25`);
    assert.equal(item.next, item.current + 1, `${item.id} обещает +1`);
  }
  // «Знамя дружины» стоит 20 — affordable, «Воинская доктрина» 40 — нет
  assert.equal(summary.find(u => u.id === 'deck_slots').affordable, true);
  assert.equal(summary.find(u => u.id === 'unit_power').affordable, false);

  const maxed = Campaign.clone(state);
  maxed.player.upgrades.deck_slots = Campaign.CAMP_UPGRADES.deck_slots.max;
  const row = Campaign.campSummary(maxed).find(u => u.id === 'deck_slots');
  assert.equal(row.maxed, true);
  assert.equal(row.cost, null);
});
