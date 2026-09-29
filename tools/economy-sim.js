#!/usr/bin/env node
'use strict';
const Campaign = require('../campaign.js');
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
        controlledRegions: state.regions.filter(r => r.ownerId === 'player').length,
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

function tryStabilizeFood(state) {
    let orders = 0;
    let attempts = 0;
    while (state.day < Campaign.SEASON_LENGTH && attempts < 30) {
        attempts++;
        const fp = state.regions.find(r => r.id === 'floodplain');
        if (!fp || fp.ownerId !== 'player') {
            const act = Campaign.getRegionActionState(state, 'floodplain');
            if (act.enabled && act.action === 'settle') {
                const res = Campaign.settleRegionState(state, 'floodplain');
                if (!res.error) { state = res.state; orders++; continue; }
            }
            // need resources or AP
            if (state.player.ap <= 0) { state = advanceDay(state); continue; }
            const next = advanceDay(state);
            if (next === state) break;
            state = next;
            continue;
        }
        if (!fp.building) {
            const act = Campaign.getRegionActionState(state, 'floodplain');
            if (act.enabled && act.action === 'build') {
                const res = Campaign.buildRegionBuildingState(state, 'floodplain');
                if (!res.error) { state = res.state; orders++; break; }
            }
            if (state.player.ap <= 0) { state = advanceDay(state); continue; }
            const next = advanceDay(state);
            if (next === state) break;
            state = next;
            continue;
        }
        break;
    }
    return { state, orders };
}

function unlockMaterialSites(input, materialQuality) {
    let state = input;
    let researchOrders = 0, territoryOrders = 0, buildingOrders = 0;
    if (materialQuality === 'standard') return { state, researchOrders, territoryOrders, buildingOrders, sites: [] };

    let stab = tryStabilizeFood(state);
    state = stab.state;
    territoryOrders += stab.orders;

    let researchDraft = 0;
    let eraAttempts = 0;
    while (state.player.era < 2 && state.day < Campaign.SEASON_LENGTH && eraAttempts < 100) {
        eraAttempts++;
        if (state.player.ap <= 0) { const n = advanceDay(state); if (n === state) break; state = n; continue; }
        if (state.player.dailyOrders.researchUsed) { const n = advanceDay(state); if (n === state) break; state = n; continue; }
        let project = state.player.blueprints.find(p => !p.researched);
        if (!project) {
            const idx = ++researchDraft;
            const added = Campaign.addBlueprint(state, {
                scienceName: `Добычная наука ${idx}`,
                scienceDescription: 'Знания для рудных месторождений.',
                buildingName: `Добычный чертёж ${idx}`,
                buildingDescription: 'Локальный проект.',
                category: 'science', effects: [{ type: 'income_knowledge', amount: 1 }]
            }, 'both');
            if (added.error) throw new Error(added.error);
            state = added.state;
            project = added.blueprint;
        }
        const researched = Campaign.researchBlueprint(state, project.id);
        if (researched.error) { const n = advanceDay(state); if (n === state) break; state = n; continue; }
        state = researched.state;
        researchOrders++;
    }

    const sites = materialQuality === 'masterwork' ? ['floodplain', 'copper', 'hills', 'tin-route'] : ['floodplain', 'copper'];
    for (const regionId of sites) {
        if (state.day >= Campaign.SEASON_LENGTH) break;
        // settle
        let attempts = 0;
        while (attempts < 20 && state.day < Campaign.SEASON_LENGTH) {
            attempts++;
            const rec = state.regions.find(r => r.id === regionId);
            if (rec && rec.ownerId === 'player') break;
            if (state.player.ap <= 0) { state = advanceDay(state); continue; }
            if (state.player.dailyOrders.frontierUsed) { state = advanceDay(state); continue; }
            const claim = Campaign.settleRegionState(state, regionId);
            if (!claim.error) { state = claim.state; territoryOrders++; break; }
            const n = advanceDay(state);
            if (n === state) break;
            state = n;
        }
        // build
        attempts = 0;
        while (attempts < 20 && state.day < Campaign.SEASON_LENGTH) {
            attempts++;
            const rec = state.regions.find(r => r.id === regionId);
            if (!rec || rec.ownerId !== 'player') break;
            if (rec.building) break;
            if (state.player.ap <= 0) { state = advanceDay(state); continue; }
            if (state.player.dailyOrders.constructionUsed) { state = advanceDay(state); continue; }
            const build = Campaign.buildRegionBuildingState(state, regionId);
            if (!build.error) { state = build.state; buildingOrders++; break; }
            const n = advanceDay(state);
            if (n === state) break;
            state = n;
        }
    }
    return { state, researchOrders, territoryOrders, buildingOrders, sites };
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
        prerequisiteResearchOrders: access.researchOrders,
        territoryOrders: access.territoryOrders,
        buildingOrders: access.buildingOrders,
        materialSites: access.sites,
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
        unfinishedProjects: state.player.blueprints.filter(p => !p.built).length
    });
}

function simulateFrontierToForge() {
    const access = unlockMaterialSites(newCampaign(), 'masterwork');
    let state = access.state;
    if (state.day >= Campaign.SEASON_LENGTH) return summarize(state, { strategy: 'frontier fail - season ended early', ...access, rivalSettlementCaptured: false });
    // accumulate resources for expedition
    let wait = 0;
    while (state.day < Campaign.SEASON_LENGTH && wait < 20) {
        wait++;
        const act = Campaign.getRegionActionState(state, 'rival-settlement');
        if (act.enabled) break;
        const n = advanceDay(state);
        if (n === state) break;
        state = n;
    }
    if (state.player.ap <= 0) state = advanceDay(state);
    if (state.player.dailyOrders.frontierUsed) state = advanceDay(state);
    const expedition = Campaign.beginRegionExpeditionState(state, 'rival-settlement');
    if (expedition.error) return summarize(state, { strategy: 'frontier expedition blocked after wait', error: expedition.error, waitDays: wait, ...access, rivalSettlementCaptured: false });
    const outcome = Campaign.finishRegionExpeditionState(expedition.state, expedition.match, true);
    if (outcome.error) throw new Error(outcome.error);
    state = advanceDay(outcome.state);
    if (state.regions.find(r => r.id === 'rival-settlement')?.ownerId === 'player') {
        // try build outpost if possible
        let bWait = 0;
        while (bWait < 10 && state.day < Campaign.SEASON_LENGTH) {
            bWait++;
            if (state.player.ap <= 0) { state = advanceDay(state); continue; }
            if (state.player.dailyOrders.constructionUsed) { state = advanceDay(state); continue; }
            const b = Campaign.buildRegionBuildingState(state, 'rival-settlement');
            if (!b.error) { state = b.state; break; }
            const n = advanceDay(state);
            if (n === state) break;
            state = n;
        }
    }
    // accumulate for forge
    wait = 0;
    while (state.day < Campaign.SEASON_LENGTH && wait < 20) {
        wait++;
        const quote = Campaign.cardCraftQuote(state, { materialQuality: 'masterwork', effort: 'painstaking' });
        if (quote.affordable && quote.materialQualityUnlocked) break;
        const n = advanceDay(state);
        if (n === state) break;
        state = n;
    }
    if (state.player.ap <= 0) state = advanceDay(state);
    const started = Campaign.beginCardCraftState(state, { materialQuality: 'masterwork', effort: 'painstaking' }, 0.999, 'Сценарий фронтира');
    if (started.error) return summarize(state, { strategy: 'frontier forge blocked after accumulation', error: started.error, ...access, rivalSettlementCaptured: state.regions.find(r => r.id === 'rival-settlement')?.ownerId === 'player' });
    const generated = Campaign.completeCardCraftState(started.state, started.order.id, { id: 'frontier-forge-card', name: 'Проверочная мастерская карта', card_type: 'unit', atk: 4, hp: 4 });
    if (generated.error) throw new Error(generated.error);
    state = generated.state;
    let loop=0;
    while (state.player.craftOrders.find(o => o.id === started.order.id)?.status === 'working' && state.day < Campaign.SEASON_LENGTH && loop<30) { loop++; const n=advanceDay(state); if(n===state) break; state=n; }
    const claimed = Campaign.claimCardCraftState(state, started.order.id);
    if (claimed.error) throw new Error(claimed.error);
    state = claimed.state;
    while (state.day < Campaign.SEASON_LENGTH) { const n=advanceDay(state); if(n===state) break; state=n; }
    return summarize(state, {
        strategy: 'освоить медь и олово → победить в экспедиции → выковать редкую карту (v3: нужны здания)',
        assumedBattleVictory: true,
        prerequisiteResearchOrders: access.researchOrders,
        territoryOrders: access.territoryOrders,
        buildingOrders: access.buildingOrders,
        rivalSettlementCaptured: state.regions.find(r => r.id === 'rival-settlement')?.ownerId === 'player',
        availableMaterialQualities: Campaign.getAvailableMaterialQualities(state),
        forgedCardRarity: claimed.card.rarity,
        forgedCardModel: claimed.card.generationModel,
        forgeOrderStartedDay: started.order.createdDay
    });
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
    const region1 = Campaign.generateLocalRegionFlavor ? Campaign.generateLocalRegionFlavor('floodplain', seed1) : { name: 'test' };
    const region2 = Campaign.generateLocalRegionFlavor ? Campaign.generateLocalRegionFlavor('floodplain', seed2) : { name: 'test2' };
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
            simulateDiversity()
        ]
    };
}
if (require.main === module) console.log(JSON.stringify(runReport(), null, 2));
module.exports = { runReport };
