#!/usr/bin/env node
'use strict';
const Campaign = require('../campaign.js');
const WorldMap = require('../world-map.js');
const ORIGIN = 'river';
const OPENING_FOCUS = 'food';
const SIMULATION_ROLL = 0.5;

function newCampaign() {
    const r = Campaign.completeOnboarding(Campaign.createState(), { name: 'Тест', originId: ORIGIN, openingFocusId: OPENING_FOCUS });
    if (r.error) throw new Error(r.error);
    return r.state;
}
function advanceDay(state) {
    if (state.day >= Campaign.SEASON_LENGTH) return state;
    const res = Campaign.finishDayState(state);
    if (res.error) {
        if (/последний день/.test(res.error)) return state;
        throw new Error(res.error);
    }
    return res.state;
}
function snapRes(state) {
    return {
        food: state.player.resources.food,
        materials: state.player.resources.materials,
        knowledge: state.player.resources.knowledge,
        population: state.player.population,
        workers: { ...state.player.workers },
        ap: state.player.ap + '/' + state.player.apMax,
        storageCap: state.player.storageCap
    };
}
function prodSnap(state) {
    try {
        const b = Campaign.getProductionBreakdown(state);
        return {
            workerFood: Number(b.workerProduction.food.toFixed(2)),
            workerMat: Number(b.workerProduction.materials.toFixed(2)),
            workerKnow: Number(b.workerProduction.knowledge.toFixed(2)),
            consumption: Number(b.consumption.toFixed(2)),
            upkeep: Number(b.upkeep.toFixed(2)),
            bonus: b.workerBonus
        };
    } catch { return null; }
}
function summarize(state, extra = {}) {
    return {
        ...extra,
        day: state.day,
        resourcesAtSeasonEnd: snapRes(state),
        production: prodSnap(state),
        eraReached: Campaign.ERAS[state.player.era],
        buildings: state.player.buildings.length,
        activeBuildings: state.player.buildings.filter(b => b.active).length,
        exploration: { revealed: state.worldMap.revealed.length, visited: state.worldMap.visited.length },
        availableQualities: Campaign.getAvailableMaterialQualities(state)
    };
}
function simulateNoOrders() {
    let state = newCampaign();
    let starvationEvents = 0;
    while (state.day < Campaign.SEASON_LENGTH) {
        const before = state.player.population;
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
        if (state.player.population < before) starvationEvents++;
    }
    return summarize(state, { strategy: 'пропускать дни, не отдавая приказы (проверка голода)', starvationEvents });
}

function simulateCrafting(materialQuality, effort) {
    let state = newCampaign();
    const materialQualityUnlockedAtStart = Campaign.getAvailableMaterialQualities(state).includes(materialQuality);
    if (!materialQualityUnlockedAtStart) throw new Error('Material quality is unexpectedly locked: ' + materialQuality);
    const firstCraftDay = state.day;
    let ordersStarted = 0, cardsClaimed = 0, resourceBlockedDays = 0;
    let loop = 0;
    while (state.day < Campaign.SEASON_LENGTH && loop < 200) {
        loop++;
        const ready = state.player.craftOrders.find(o => o.status === 'ready');
        if (ready) {
            const claim = Campaign.claimCardCraftState(state, ready.id);
            if (!claim.error) { state = claim.state; cardsClaimed++; continue; }
        }
        const hasWorking = state.player.craftOrders.some(o => o.status === 'working');
        if (!hasWorking) {
            if (state.player.ap > 0 && !state.player.dailyOrders.craftUsed) {
                const started = Campaign.beginCardCraftState(state, { materialQuality, effort }, SIMULATION_ROLL, 'Экономический симулятор');
                if (!started.error) {
                    state = started.state;
                    const gen = Campaign.completeCardCraftState(state, started.order.id, { id: `sim-card-${ordersStarted+1}`, name: `Тестовая карта ${ordersStarted+1}` });
                    if (gen.error) throw new Error(gen.error);
                    state = gen.state;
                    ordersStarted++;
                    if (started.quote.effortDays === 0) {
                        const claim = Campaign.claimCardCraftState(state, started.order.id);
                        if (!claim.error) { state = claim.state; cardsClaimed++; }
                    }
                } else if (/Не хватает ресурсов|нужно/.test(started.error)) {
                    resourceBlockedDays++;
                }
            }
        }
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
    }
    for (const order of state.player.craftOrders.filter(o => o.status === 'ready')) {
        const claim = Campaign.claimCardCraftState(state, order.id);
        if (!claim.error) { state = claim.state; cardsClaimed++; }
    }
    return summarize(state, {
        strategy: `${Campaign.CARD_CRAFT_MATERIALS[materialQuality].label} / ${Campaign.CARD_CRAFT_EFFORTS[effort].label}`,
        ordersStarted, cardsClaimed, resourceBlockedDays,
        craftLevelAtSeasonEnd: state.player.craftLevel + 1,
        craftXpTowardNextLevel: state.player.craftXp,
        materialQualityUnlockedAtStart,
        firstCraftDay
    });
}

function simulateResearchAndConstruction() {
    let state = newCampaign();
    let generatedBlueprints = 0, researchOrders = 0, constructionOrders = 0;
    const incomeEffects = ['income_materials', 'income_knowledge', 'income_food'];
    let loop = 0;
    while (state.day < Campaign.SEASON_LENGTH && loop < 200) {
        loop++;
        if (state.player.ap <= 0) { const n = advanceDay(state); if (n===state) break; state=n; continue; }
        let readyToResearch = state.player.blueprints.find(p => !p.researched);
        if (!readyToResearch && state.player.blueprints.every(p => p.built)) {
            const idx = generatedBlueprints;
            const effect = incomeEffects[idx % incomeEffects.length];
            const added = Campaign.addBlueprint(state, {
                scienceName: `Симуляция науки ${idx+1}`,
                scienceDescription: 'Проект для проверки темпа.',
                buildingName: `Симуляция здания ${idx+1}`,
                buildingDescription: 'Здание с эффектом.',
                category: 'economy', effects: [{ type: effect, amount: 1 }]
            }, 'both');
            if (!added.error) { state = added.state; generatedBlueprints++; readyToResearch = added.blueprint; }
        }
        if (!state.player.dailyOrders.researchUsed && readyToResearch) {
            const res = Campaign.researchBlueprint(state, readyToResearch.id);
            if (!res.error) { state = res.state; researchOrders++; }
        }
        const readyToBuild = state.player.blueprints.find(p => p.researched && !p.built);
        if (!state.player.dailyOrders.constructionUsed && readyToBuild && state.player.ap > 0) {
            const res = Campaign.constructBlueprint(state, readyToBuild.id);
            if (!res.error) { state = res.state; constructionOrders++; }
        }
        const n = advanceDay(state);
        if (n===state) break;
        state=n;
    }
    return summarize(state, {
        strategy: 'исследовать и строить каждый доступный день',
        generatedBlueprints, researchOrders, constructionOrders,
        unfinishedProjects: state.player.blueprints.filter(p => !p.built).length
    });
}

function simulateWorldMapProgress() {
    let campaign = newCampaign();
    const before = {
        day: campaign.day,
        ap: campaign.player.ap,
        resources: { ...campaign.player.resources }
    };
    let exploration = campaign.worldMap;
    const initialProgress = WorldMap.getProgress(exploration);
    let moves = 0;
    while (moves < 3) {
        const candidates = WorldMap.getNeighbors(exploration.current.x, exploration.current.y)
            .filter(point => !exploration.visited.includes(WorldMap.tileId(point.x, point.y)));
        if (!candidates.length) break;
        const target = candidates[0];
        const result = WorldMap.moveToTile(exploration, target.x, target.y);
        if (result.error) throw new Error(result.error);
        exploration = result.state;
        moves++;
    }
    campaign.worldMap = exploration;
    const after = {
        day: campaign.day,
        ap: campaign.player.ap,
        resources: { ...campaign.player.resources }
    };
    return summarize(campaign, {
        strategy: 'три локальных перехода по мировой карте',
        mapInitial: initialProgress,
        mapFinal: WorldMap.getProgress(exploration),
        mapMoves: moves,
        economyBefore: before,
        economyAfter: after,
        explorationEconomyNeutral: JSON.stringify(before) === JSON.stringify(after)
    });
}

function simulateHistoricalForging() {
    const cultures = ['yamnaya','akkad','egypt-old','sumer'];
    const results = [];
    for (const cid of cultures) {
        const state = Campaign.createState();
        state.player.name = 'Test ' + cid;
        state.player.clan = 'Clan ' + cid;
        state.player.historicalCulture = Campaign.HISTORICAL_CULTURES.find(c=>c.id===cid);
        state.player.biome = Campaign.BIOMES.find(b=>b.id==='steppe');
        state.player.trait = Campaign.TRAITS.find(t=>t.id==='horse-lords');
        const cfg = Campaign.getBattleConfig(state);
        const prod = Campaign.getProductionBreakdown(state);
        results.push({
            culture: cid + ' (' + state.player.historicalCulture.name + ')',
            battle: 'deck ' + cfg.deckLimit + ' hp ' + cfg.hp + ' energy ' + cfg.energyMax,
            production: 'food ' + prod.workerProduction.food.toFixed(1) + ' mat ' + prod.workerProduction.materials.toFixed(1),
            forgingFlavor: cid==='yamnaya' ? 'конница, повозки, charge/skirmish' : cid==='akkad' ? 'дисциплина, осада, shieldwall/wedge' : cid==='egypt-old' ? 'колесницы, оборона, holdground' : 'ополчение, зиккурат, rally'
        });
    }
    return { strategy: 'Историческая культурность влияет на ковку: биом+черта+наследие дают бонусы к бою/производству и влияют на промпт LLM для генерации юнитов', cultures: results };
}

function simulateDiversity() {
    // 100500 diversity: every player gets unique building names from pools + seeded random
    const s1 = Campaign.createState();
    s1.player.name = 'Дети Реки';
    s1.player.clan = 'Медный Ворон';
    const s2 = Campaign.createState();
    s2.player.name = 'Горные Волки';
    s2.player.clan = 'Каменный Коготь';
    const seed1 = 12345;
    const seed2 = 67890;
    const variants1 = Campaign.DIVERSITY_POOLS ? Campaign.generateLocalScienceVariants('agriculture', seed1, 3) : [];
    const variants2 = Campaign.DIVERSITY_POOLS ? Campaign.generateLocalScienceVariants('agriculture', seed2, 3) : [];
    return {
        strategy: '100500 разнообразия: уникальные названия зданий/наук у каждого игрока (пулы + seed + LLM)',
        scienceVariantsPlayer1: variants1.map(v => `${v.scienceName} → ${v.buildingName} [${v.effects.map(e=>e.type).join(',')}]`),
        scienceVariantsPlayer2: variants2.map(v => `${v.scienceName} → ${v.buildingName} [${v.effects.map(e=>e.type).join(',')}]`),
        unique: variants1[0]?.buildingName !== variants2[0]?.buildingName,
        note: 'Без API ключа — из локальных пулов DIVERSITY_POOLS (как в tribes-legacy). С ключом — LLM придумывает ещё более уникальные названия, но механика из EFFECTS allowlist.'
    };
}

function simulateDecrees() {
    let state = newCampaign();
    // advance to era 1 and choose decree
    let attempts = 0;
    while (state.player.era < 1 && attempts < 30) {
        attempts++;
        if (state.player.ap <= 0) { state = advanceDay(state); continue; }
        if (state.player.dailyOrders.researchUsed) { state = advanceDay(state); continue; }
        let proj = state.player.blueprints.find(p => !p.researched);
        if (!proj) {
            const added = Campaign.addBlueprint(state, { scienceName: `Наука ${attempts}`, scienceDescription: 'd', buildingName: `Здание ${attempts}`, buildingDescription: 'd', category: 'economy', effects: [{type:'income_food', amount:1}]}, 'both');
            if (!added.error) { state = added.state; proj = added.blueprint; }
        }
        if (proj) {
            const res = Campaign.researchBlueprint(state, proj.id);
            if (!res.error) state = res.state;
            else state = advanceDay(state);
        } else state = advanceDay(state);
    }
    // choose decree
    if (state.player.pendingDecreeChoice) {
        const dec = Campaign.chooseDecreeState(state, 'military');
        if (!dec.error) state = dec.state;
    }
    while (state.day < Campaign.SEASON_LENGTH) {
        const n = advanceDay(state);
        if (n === state) break;
        state = n;
    }
    return summarize(state, { strategy: 'военный уклад в Античности: +1 слот колоды, x1.3 еда, +0.2🪵', decrees: state.player.decrees });
}

function runReport() {
    return {
        assumptions: {
            seasonLengthDays: Campaign.SEASON_LENGTH,
            origin: ORIGIN,
            openingFocus: OPENING_FOCUS,
            eras: Campaign.ERAS,
            decrees: Object.values(Campaign.DECREES).map(d => `${d.icon} ${d.label}: ${d.description}`),
            baseDailyIncome: 'Доход формируется назначением работников и эффектами активных зданий в поселении.',
            ap: Campaign.AP_MAX + ' AP в день',
            population: `${Campaign.POP_START} кланов старт, max ${Campaign.POP_MAX} (абстракция сотен людей)`,
            workerYield: Campaign.WORKER_BASE_YIELD,
            storageBase: Campaign.STORAGE_BASE,
            notes: [
                'Наука и здания развиваются внутри поселения; процедурная карта не влияет на доходы и ресурсы.',
                '100500 разнообразия: DIVERSITY_POOLS как в tribes-legacy, seeded random по имени клана → у каждого игрока все здания/науки/юниты разные. С LLM ещё уникальнее.',
                'v3.3: эпохи до 2150 (7 эпох), кланы вместо людей, уклады при смене эпохи.',
                'Качество сырья для ковки не связано с территориями или зданиями; уровни задаются вложением ресурсов и времени.',
                'AP 2/день — выбор Выживание vs Развитие vs Мощь.',
                'Уклад: военный/земледельческий/жреческий — взаимоисключающий, формирует идентичность на тысячи лет. Летопись уникальной истории.',
                'Эффекты расширены до 12 (storage_bonus, defense_bonus, trade_bonus, pop_growth и т.д.) для разнообразия зданий.',
                'Мировая карта 7×7 генерируется локально по seed; исследование не расходует AP/ресурсы и не меняет кампанию.',
                'Склад лимит ' + Campaign.STORAGE_BASE + ' + бонусы, излишки гниют 50% (микро для прототипа, потом заменим на бюрократию).'
            ]
        },
        scenarios: [
            simulateNoOrders(),
            simulateCrafting('standard', 'quick'),
            simulateCrafting('refined', 'focused'),
            simulateCrafting('masterwork', 'painstaking'),
            simulateResearchAndConstruction(),
            simulateWorldMapProgress(),
            simulateDecrees(),
            simulateDiversity(),
            simulateHistoricalForging()
        ]
    };
}
if (require.main === module) console.log(JSON.stringify(runReport(), null, 2));
module.exports = { runReport };
