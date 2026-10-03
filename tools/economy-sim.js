#!/usr/bin/env node
'use strict';
const Campaign = require('../campaign.js');
const CampaignMap = require('../campaign-map.js');
const ORIGIN = 'river';
const OPENING_FOCUS = 'food';
const SIMULATION_ROLL = 0.5;
const SIMULATION_SEED = 12345;

function newCampaign(seed = SIMULATION_SEED) {
    const r = Campaign.completeOnboarding(Campaign.createState(seed), { name: 'Тест', originId: ORIGIN, openingFocusId: OPENING_FOCUS });
    if (r.error) throw new Error(r.error);
    return r.state;
}
function findTile(state, predicate) { return state.world.tiles.find(predicate) || null; }
function findTileId(state, predicate) { return findTile(state, predicate)?.id || null; }
function getRegion(state, tileId) { return state.regions.find(region => region.id === tileId) || null; }
function getPlayerLandIds(state) {
    return new Set(state.regions.filter(region => region.ownerId === 'player'
        && state.world.tiles.find(tile => tile.id === region.id)?.terrain !== 'water').map(region => region.id));
}
function landPathTo(state, destinationId) {
    const tiles = new Map(state.world.tiles.map(tile => [tile.id, tile]));
    const owned = getPlayerLandIds(state);
    const destination = tiles.get(destinationId);
    if (!destination || destination.terrain === 'water') return null;
    if (owned.has(destinationId)) return [];
    const previous = new Map();
    const queue = [];
    for (const id of owned) { previous.set(id, null); queue.push(id); }
    while (queue.length) {
        const currentId = queue.shift();
        if (currentId === destinationId) break;
        const current = tiles.get(currentId);
        for (const neighborId of current?.neighbors || []) {
            if (previous.has(neighborId)) continue;
            const neighbor = tiles.get(neighborId);
            const region = getRegion(state, neighborId);
            if (!neighbor || neighbor.terrain === 'water' || (region?.ownerId && region.ownerId !== 'player')) continue;
            if (neighbor.kind === 'settlement' && neighborId !== destinationId) continue;
            previous.set(neighborId, currentId);
            queue.push(neighborId);
        }
    }
    if (!previous.has(destinationId)) return null;
    const path = [];
    let cursor = destinationId;
    while (cursor && !owned.has(cursor)) { path.push(cursor); cursor = previous.get(cursor); }
    return path.reverse();
}
function pathToSettlementBorder(state, settlementId) {
    const target = findTile(state, tile => tile.id === settlementId);
    if (!target) return null;
    return target.neighbors
        .filter(id => {
            const tile = findTile(state, other => other.id === id);
            const region = getRegion(state, id);
            return tile && tile.terrain !== 'water' && tile.kind !== 'settlement' && (!region || !region.ownerId || region.ownerId === 'player');
        })
        .map(id => ({ destinationId: id, path: landPathTo(state, id) }))
        .filter(item => item.path)
        .sort((a, b) => a.path.length - b.path.length || a.destinationId.localeCompare(b.destinationId))[0] || null;
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
        faith: state.player.resources.faith,
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
            workerFaith: Number(b.workerProduction.faith.toFixed(2)),
            regional: b.regional,
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
        controlledRegions: state.regions.filter(r => r.ownerId === 'player'
            && state.world.tiles.find(tile => tile.id === r.id)?.terrain !== 'water').length,
        regionsWithBuildings: state.regions.filter(r => r.ownerId === 'player' && r.building).length,
        regionalDailyIncome: Campaign.getRegionalIncome(state),
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

/**
 * Сколько дней симулятор честно живёт на каждую недостающую эпоху, добирая просветление производством,
 * прежде чем добавить очки напрямую. Держим маленьким: сезон всего 30 дней, а сценарии тратят их на
 * земли, постройки и ковку — всё, что не успело вырасти само, добавляется напрямую и помечается в отчёте.
 */
const ERA_PUSH_DAY_LIMIT = 2;

/**
 * Кланы переводятся на книги и молитвы: просветление эпохи считается как 2·📚 + 1·🙏, поэтому
 * книжник вдвое полезнее жреца, но жрец нужен для миссий — делим остаток населения пополам.
 */
function pushEnlightenmentWorkers(input) {
    const state = Campaign.normalizeState(input);
    const pop = state.player.population;
    const food = Math.min(2, pop);
    const materials = Math.min(1, Math.max(0, pop - food));
    const rest = Math.max(0, pop - food - materials);
    const knowledge = Math.ceil(rest / 2);
    return Campaign.normalizeState({
        ...state,
        player: { ...state.player, workers: { food, materials, knowledge, faith: rest - knowledge, idle: 0 } }
    });
}

/**
 * Эпоха больше не открывается числом изученных наук: её открывает просветление народа —
 * 2·📚 + 1·🙏 против порога эпохи (36 + 8·era, и не раньше конца 2-го дня: см. campaign.js
 * getEraProgress / advanceEra / ERA_ENLIGHTENMENT_MIN_DAY).
 * Симулятор играет это честно: переводит кланы на книги и молитвы и прокручивает дни. Жить так весь
 * сценарий нельзя — захват и отстройка места наблюдений съедают дни, нужные ковке, поэтому недостающие
 * очки добавляются напрямую и помечаются в отчёте prerequisiteEnlightenmentTopUps: подарок не выдаётся
 * за реальную экономику.
 */
function ensureEra(input, targetEra, stats = {}) {
    let state = input;
    if (state.player.era >= targetEra) return state;

    state = pushEnlightenmentWorkers(state);

    let attempts = 0;
    const dayBudget = ERA_PUSH_DAY_LIMIT * Math.max(1, targetEra - state.player.era);
    while (state.player.era < targetEra && state.day < Campaign.SEASON_LENGTH - 1 && attempts < dayBudget) {
        attempts++;
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
        stats.enlightenmentDays = (stats.enlightenmentDays || 0) + 1;
    }
    while (state.player.era < targetEra && state.day < Campaign.SEASON_LENGTH - 1 && attempts < dayBudget + 40) {
        attempts++;
        const progress = Campaign.getEraProgress(state);
        if (!progress.ready) {
            const missing = Math.ceil(progress.remaining / Campaign.ENLIGHTENMENT_WEIGHTS.knowledge);
            state = Campaign.normalizeState({
                ...state,
                player: {
                    ...state.player,
                    resources: { ...state.player.resources, knowledge: state.player.resources.knowledge + missing }
                }
            });
            stats.enlightenmentTopUps = (stats.enlightenmentTopUps || 0) + 1;
        }
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
    }
    return state;
}

function claimPathTo(input, destinationId, stats = {}) {
    let state = input;
    let attempts = 0;
    while (state.day < Campaign.SEASON_LENGTH && attempts < 100) {
        attempts++;
        const record = getRegion(state, destinationId);
        if (record?.ownerId === 'player') return { state, reached: true };
        const path = landPathTo(state, destinationId);
        if (!path || !path.length) return { state, reached: false };
        const nextId = path[0];
        const tile = findTile(state, item => item.id === nextId);
        if (!tile || tile.kind === 'settlement') return { state, reached: false };
        if (tile.minEra > state.player.era) {
            const beforeDay = state.day;
            state = ensureEra(state, tile.minEra, stats);
            if (state.day === beforeDay && state.player.era < tile.minEra) return { state, reached: false };
            continue;
        }
        const action = Campaign.getRegionActionState(state, nextId);
        if (action.enabled && action.action === 'settle') {
            const claim = Campaign.settleRegionState(state, nextId);
            if (!claim.error) {
                state = claim.state;
                stats.territoryOrders = (stats.territoryOrders || 0) + 1;
                continue;
            }
        } else if (action.enabled && action.action === 'quest') {
            // The economy simulation treats quest encounters as victories so it can model expansion costs.
            const expedition = Campaign.beginRegionExpeditionState(state, nextId);
            if (!expedition.error) {
                const outcome = Campaign.finishRegionExpeditionState(expedition.state, expedition.match, true);
                if (!outcome.error) {
                    state = outcome.state;
                    stats.territoryOrders = (stats.territoryOrders || 0) + 1;
                    stats.questBattles = (stats.questBattles || 0) + 1;
                    continue;
                }
            }
        }
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
    }
    return { state, reached: getRegion(state, destinationId)?.ownerId === 'player' };
}

function ownAndBuildSite(input, tileId, stats = {}) {
    const claimed = claimPathTo(input, tileId, stats);
    let state = claimed.state;
    if (!claimed.reached) return { state, reached: false };
    let attempts = 0;
    while (state.day < Campaign.SEASON_LENGTH && attempts < 50) {
        attempts++;
        const record = getRegion(state, tileId);
        if (!record || record.ownerId !== 'player') break;
        if (record.building) return { state, reached: true };
        const action = Campaign.getRegionActionState(state, tileId);
        if (action.enabled && action.action === 'build') {
            const built = Campaign.buildRegionBuildingState(state, tileId);
            if (!built.error) {
                state = built.state;
                stats.buildingOrders = (stats.buildingOrders || 0) + 1;
                return { state, reached: true };
            }
        }
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
    }
    return { state, reached: Boolean(getRegion(state, tileId)?.building) };
}

function tryStabilizeFood(input) {
    const center = findTile(input, tile => tile.x === CampaignMap.CENTER.x && tile.y === CampaignMap.CENTER.y);
    const foodTiles = input.world.tiles.filter(tile => tile.kind === 'resource' && tile.siteType === 'food')
        .sort((a, b) => (Math.abs(a.x - center.x) + Math.abs(a.y - center.y)) - (Math.abs(b.x - center.x) + Math.abs(b.y - center.y)));
    const target = foodTiles[0];
    const stats = { territoryOrders: 0, buildingOrders: 0 };
    if (!target) return { state: input, orders: 0, ...stats };
    const result = ownAndBuildSite(input, target.id, stats);
    return { state: result.state, orders: stats.territoryOrders + stats.buildingOrders, ...stats, siteId: target.id };
}

function unlockMaterialSites(input, materialQuality) {
    let state = input;
    const stats = { researchOrders: 0, territoryOrders: 0, buildingOrders: 0, enlightenmentDays: 0, enlightenmentTopUps: 0 };
    if (materialQuality === 'standard') return { state, ...stats, sites: [] };

    const stabilization = tryStabilizeFood(state);
    state = stabilization.state;
    stats.territoryOrders += stabilization.territoryOrders;
    stats.buildingOrders += stabilization.buildingOrders;
    stats.questBattles = stabilization.questBattles || 0;

    // Бронза (медь + олово) — ключевой ресурс эпохи 1 «Античный мир», железо — эпохи 2
    // «Средневековье» (ERA_KEY_RESOURCE / minEra месторождений в campaign-map.js). Редкая ковка
    // хард-заперта без ключевого ресурса ТЕКУЩЕЙ эпохи, поэтому для мастерского сырья сценарий
    // обязан дойти до железа: без железоплавильни «rare» не выпадет.
    state = ensureEra(state, 2, stats);
    const features = materialQuality === 'masterwork' ? ['copper-vein', 'tin-route', 'iron-vein'] : ['copper-vein'];
    const sites = [];
    for (const feature of features) {
        if (state.day >= Campaign.SEASON_LENGTH) break;
        const target = findTile(state, tile => tile.feature === feature);
        if (!target) continue;
        sites.push(target.id);
        const result = ownAndBuildSite(state, target.id, stats);
        state = result.state;
    }
    return { state, ...stats, sites };
}

function simulateCrafting(materialQuality, effort) {
    let state = newCampaign();
    const access = unlockMaterialSites(state, materialQuality);
    state = access.state;
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
        prerequisiteEnlightenmentDays: access.enlightenmentDays || 0,
        prerequisiteEnlightenmentTopUps: access.enlightenmentTopUps || 0,
        territoryOrders: access.territoryOrders,
        questBattles: access.questBattles || 0,
        buildingOrders: access.buildingOrders,
        materialSites: access.sites,
        materialSiteFeatures: access.sites.map(id => findTile(state, tile => tile.id === id)?.feature).filter(Boolean),
        firstCraftDay
    });
}

function simulateResearchAndConstruction() {
    let state = newCampaign();
    let generatedBlueprints = 0, researchOrders = 0, constructionOrders = 0;
    const incomeEffects = ['income_materials', 'income_knowledge', 'income_food'];
    let stab = tryStabilizeFood(state);
    state = stab.state;
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
        strategy: 'исследовать и строить каждый доступный день (после стабилизации еды)',
        generatedBlueprints, researchOrders, constructionOrders,
        territoryOrders: stab.territoryOrders, questBattles: stab.questBattles || 0,
        unfinishedProjects: state.player.blueprints.filter(p => !p.built).length
    });
}

function simulateFrontierToForge() {
    const access = unlockMaterialSites(newCampaign(), 'masterwork');
    let state = access.state;
    const stats = {
        researchOrders: access.researchOrders,
        territoryOrders: access.territoryOrders,
        questBattles: access.questBattles || 0,
        buildingOrders: access.buildingOrders,
        enlightenmentDays: access.enlightenmentDays || 0,
        enlightenmentTopUps: access.enlightenmentTopUps || 0
    };
    const settlement = findTile(state, tile => tile.kind === 'settlement' && tile.initialOwner === 'steppe');
    if (!settlement || state.day >= Campaign.SEASON_LENGTH) {
        return summarize(state, { strategy: 'frontier fail - season ended early', ...access, rivalSettlementCaptured: false });
    }

    const border = pathToSettlementBorder(state, settlement.id);
    if (!border) return summarize(state, {
        strategy: 'frontier path blocked', error: 'No land route to a neighboring tile.', ...access, rivalSettlementCaptured: false
    });
    const approach = claimPathTo(state, border.destinationId, stats);
    state = approach.state;
    if (!approach.reached) return summarize(state, {
        strategy: 'frontier approach blocked', error: 'Could not claim a path to the generated settlement.',
        ...access, ...stats, rivalSettlementCaptured: false
    });

    let wait = 0;
    while (state.day < Campaign.SEASON_LENGTH && wait < 20) {
        wait++;
        const action = Campaign.getRegionActionState(state, settlement.id);
        if (action.enabled) break;
        if (state.player.ap <= 0 || state.player.dailyOrders.frontierUsed || /Не хватает|нужны/.test(action.reason || '')) {
            const next = advanceDay(state);
            if (next === state) break;
            state = next;
            continue;
        }
        if (state.player.era < settlement.minEra) {
            state = ensureEra(state, settlement.minEra, stats);
            continue;
        }
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
    }
    const expedition = Campaign.beginRegionExpeditionState(state, settlement.id);
    if (expedition.error) return summarize(state, {
        strategy: 'frontier expedition blocked after wait', error: expedition.error, waitDays: wait,
        ...access, ...stats, rivalSettlementCaptured: false
    });
    const outcome = Campaign.finishRegionExpeditionState(expedition.state, expedition.match, true);
    if (outcome.error) throw new Error(outcome.error);
    state = advanceDay(outcome.state);

    if (getRegion(state, settlement.id)?.ownerId === 'player') {
        let buildWait = 0;
        while (buildWait < 10 && state.day < Campaign.SEASON_LENGTH) {
            buildWait++;
            const build = Campaign.buildRegionBuildingState(state, settlement.id);
            if (!build.error) { state = build.state; stats.buildingOrders++; break; }
            const next = advanceDay(state);
            if (next === state) break;
            state = next;
        }
    }

    let forgeWait = 0;
    while (state.day < Campaign.SEASON_LENGTH && forgeWait < 20) {
        forgeWait++;
        const quote = Campaign.cardCraftQuote(state, { materialQuality: 'masterwork', effort: 'painstaking' });
        if (quote.affordable && quote.materialQualityUnlocked) break;
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
    }
    if (state.player.ap <= 0 || state.player.dailyOrders.craftUsed) state = advanceDay(state);
    const started = Campaign.beginCardCraftState(state, { materialQuality: 'masterwork', effort: 'painstaking' }, 0.999, 'Сценарий фронтира');
    if (started.error) return summarize(state, {
        strategy: 'frontier forge blocked after accumulation', error: started.error,
        ...access, ...stats, rivalSettlementCaptured: getRegion(state, settlement.id)?.ownerId === 'player'
    });
    const generated = Campaign.completeCardCraftState(started.state, started.order.id, {
        id: 'frontier-forge-card', name: 'Проверочная мастерская карта', card_type: 'unit', atk: 4, hp: 4
    });
    if (generated.error) throw new Error(generated.error);
    state = generated.state;
    let loop = 0;
    while (state.player.craftOrders.find(order => order.id === started.order.id)?.status === 'working'
        && state.day < Campaign.SEASON_LENGTH && loop < 30) {
        loop++;
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
    }
    const claimed = Campaign.claimCardCraftState(state, started.order.id);
    if (claimed.error) throw new Error(claimed.error);
    state = claimed.state;
    while (state.day < Campaign.SEASON_LENGTH) {
        const next = advanceDay(state);
        if (next === state) break;
        state = next;
    }
    return summarize(state, {
        strategy: 'освоить медь и олово → победить в экспедиции → выковать редкую карту',
        assumedBattleVictory: true,
        prerequisiteEnlightenmentDays: access.enlightenmentDays || 0,
        prerequisiteEnlightenmentTopUps: access.enlightenmentTopUps || 0,
        territoryOrders: stats.territoryOrders,
        questBattles: stats.questBattles,
        buildingOrders: stats.buildingOrders,
        rivalSettlementId: settlement.id,
        rivalSettlementCaptured: getRegion(state, settlement.id)?.ownerId === 'player',
        availableMaterialQualities: Campaign.getAvailableMaterialQualities(state),
        forgedCardRarity: claimed.card.rarity,
        forgedCardModel: claimed.card.generationModel,
        forgeOrderStartedDay: started.order.createdDay
    });
}

function simulateHistoricalForging() {
    const cultures = ['yamnaya','akkad','egypt-old','sumer'];
    const results = [];
    for (const cid of cultures) {
        const state = Campaign.createState(SIMULATION_SEED);
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
    const s1 = Campaign.createState(12345);
    s1.player.name = 'Дети Реки';
    s1.player.clan = 'Медный Ворон';
    const s2 = Campaign.createState(67890);
    s2.player.name = 'Горные Волки';
    s2.player.clan = 'Каменный Коготь';
    const seed1 = 12345;
    const seed2 = 67890;
    const variants1 = Campaign.DIVERSITY_POOLS ? Campaign.generateLocalScienceVariants('agriculture', seed1, 3) : [];
    const variants2 = Campaign.DIVERSITY_POOLS ? Campaign.generateLocalScienceVariants('agriculture', seed2, 3) : [];
    const foodSite = s1.world.tiles.find(tile => tile.kind === 'resource' && tile.siteType === 'food');
    const region1 = Campaign.generateLocalRegionFlavor ? Campaign.generateLocalRegionFlavor(foodSite, seed1) : { name: 'test' };
    const region2 = Campaign.generateLocalRegionFlavor ? Campaign.generateLocalRegionFlavor(foodSite, seed2) : { name: 'test2' };
    return {
        strategy: '100500 разнообразия: уникальные названия зданий/наук у каждого игрока (пулы + seed + LLM)',
        scienceVariantsPlayer1: variants1.map(v => `${v.scienceName} → ${v.buildingName} [${v.effects.map(e=>e.type).join(',')}]`),
        scienceVariantsPlayer2: variants2.map(v => `${v.scienceName} → ${v.buildingName} [${v.effects.map(e=>e.type).join(',')}]`),
        regionBuildingPlayer1: region1.name,
        regionBuildingPlayer2: region2.name,
        unique: variants1[0]?.buildingName !== variants2[0]?.buildingName || region1.name !== region2.name,
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
            map: '49 procedural tiles on a 7×7 grid; center tile is the player start; four-way adjacency only.',
            mapSeed: SIMULATION_SEED,
            eras: Campaign.ERAS,
            decrees: Object.values(Campaign.DECREES).map(d => `${d.icon} ${d.label}: ${d.description}`),
            baseDailyIncome: 'НЕТ - доход только от кланов и зданий в регионах (v3)',
            ap: Campaign.AP_MAX + ' AP в день',
            population: `${Campaign.POP_START} кланов старт, max ${Campaign.POP_MAX} (абстракция сотен людей)`,
            workerYield: Campaign.WORKER_BASE_YIELD,
            storageBase: Campaign.STORAGE_BASE,
            notes: [
                'v3.4: здания и науки придумывает ИИ — 3 варианта на выбор (как в кузнице), региональные здания с уникальными именами от ИИ.',
                '100500 разнообразия: DIVERSITY_POOLS как в tribes-legacy, seeded random по имени клана → у каждого игрока все здания/науки/юниты разные. С LLM ещё уникальнее.',
                'v3.3: эпохи до 2150 (7 эпох), кланы вместо людей, уклады при смене эпохи.',
                'Регион без здания =0, потеря региона=потеря здания. Региональное здание теперь имеет уникальное имя (flavor) от пулов или LLM.',
                'AP 2/день — выбор Выживание vs Развитие vs Мощь.',
                'Уклад: военный/земледельческий/жреческий — взаимоисключающий, формирует идентичность на тысячи лет. Летопись уникальной истории.',
                'Эффекты расширены до 12 (storage_bonus, defense_bonus, trade_bonus, pop_growth и т.д.) для разнообразия зданий.',
                'Склад лимит ' + Campaign.STORAGE_BASE + ' + бонусы, излишки гниют 50% (микро для прототипа, потом заменим на бюрократию).'
            ]
        },
        scenarios: [
            simulateNoOrders(),
            simulateCrafting('standard', 'quick'),
            simulateCrafting('refined', 'focused'),
            simulateCrafting('masterwork', 'painstaking'),
            simulateResearchAndConstruction(),
            simulateFrontierToForge(),
            simulateDecrees(),
            simulateDiversity(),
            simulateHistoricalForging()
        ]
    };
}
if (require.main === module) console.log(JSON.stringify(runReport(), null, 2));
module.exports = { runReport };
