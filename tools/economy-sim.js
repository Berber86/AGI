#!/usr/bin/env node
'use strict';

// Deterministic, local balance probe for the current CampaignMvp rules.
// Run from the repository root: node tools/economy-sim.js
const Campaign = require('../campaign.js');

const ORIGIN = 'river';
const OPENING_FOCUS = 'food';
const SIMULATION_ROLL = 0.5;

function newCampaign() {
    const result = Campaign.completeOnboarding(Campaign.createState(), {
        name: 'Тестовый народ', originId: ORIGIN, openingFocusId: OPENING_FOCUS
    });
    if (result.error) throw new Error(result.error);
    return result.state;
}

function advanceDay(state) {
    const result = Campaign.finishDayState(state);
    if (result.error) throw new Error(result.error);
    return result.state;
}

function resourceSnapshot(state) {
    return {
        food: state.player.resources.food,
        materials: state.player.resources.materials,
        knowledge: state.player.resources.knowledge
    };
}

function summarize(state, extra = {}) {
    return {
        ...extra,
        day: state.day,
        resourcesAtSeasonEnd: resourceSnapshot(state),
        eraReached: Campaign.ERAS[state.player.era],
        buildings: state.player.buildings.length,
        activeBuildings: state.player.buildings.filter(building => building.active).length,
        controlledRegions: state.regions.filter(region => region.ownerId === 'player').length,
        regionalDailyIncome: Campaign.getRegionalIncome(state)
    };
}

function simulateNoOrders() {
    let state = newCampaign();
    while (state.day < Campaign.SEASON_LENGTH) state = advanceDay(state);
    return summarize(state, { strategy: 'пропускать дни, не отдавая приказы' });
}

function unlockMaterialSites(input, materialQuality) {
    let state = input;
    let researchOrders = 0;
    let territoryOrders = 0;
    if (materialQuality === 'standard') return { state, researchOrders, territoryOrders, sites: [] };

    let researchDraft = 0;
    while (state.player.era < 2) {
        if (state.player.dailyOrders.researchUsed) state = advanceDay(state);
        let project = state.player.blueprints.find(item => !item.researched);
        if (!project) {
            const index = ++researchDraft;
            const added = Campaign.addBlueprint(state, {
                scienceName: `Добычная наука ${index}`,
                scienceDescription: 'Знания, необходимые для освоения приграничных рудных месторождений.',
                buildingName: `Добычный чертёж ${index}`,
                buildingDescription: 'Локальный проект для симуляции развития приграничья.',
                category: 'science', effects: [{ type: 'income_knowledge', amount: 1 }]
            }, 'both');
            if (added.error) throw new Error(added.error);
            state = added.state;
            project = added.blueprint;
        }
        const researched = Campaign.researchBlueprint(state, project.id);
        if (researched.error) throw new Error(researched.error);
        state = researched.state;
        researchOrders += 1;
        state = advanceDay(state);
    }

    const sites = materialQuality === 'masterwork'
        ? ['floodplain', 'copper', 'hills', 'tin-route']
        : ['floodplain', 'copper'];
    for (const regionId of sites) {
        if (state.player.dailyOrders.frontierUsed) state = advanceDay(state);
        const claim = Campaign.settleRegionState(state, regionId);
        if (claim.error) throw new Error(`Не удалось занять ${regionId}: ${claim.error}`);
        state = claim.state;
        territoryOrders += 1;
        state = advanceDay(state);
    }
    return { state, researchOrders, territoryOrders, sites };
}

function simulateCrafting(materialQuality, effort) {
    let state = newCampaign();
    const access = unlockMaterialSites(state, materialQuality);
    state = access.state;
    const firstCraftDay = state.day;
    let ordersStarted = 0;
    let cardsClaimed = 0;
    let resourceBlockedDays = 0;

    while (state.day < Campaign.SEASON_LENGTH) {
        const ready = state.player.craftOrders.find(order => order.status === 'ready');
        if (ready) {
            const claim = Campaign.claimCardCraftState(state, ready.id);
            if (claim.error) throw new Error(claim.error);
            state = claim.state;
            cardsClaimed += 1;
        }

        const hasWorkingOrder = state.player.craftOrders.some(order => order.status === 'working');
        if (!hasWorkingOrder && !state.player.dailyOrders.craftUsed) {
            const started = Campaign.beginCardCraftState(
                state,
                { materialQuality, effort },
                SIMULATION_ROLL,
                'Экономический симулятор'
            );
            if (!started.error) {
                state = started.state;
                const generated = Campaign.completeCardCraftState(state, started.order.id, {
                    id: `sim-card-${ordersStarted + 1}`,
                    name: `Тестовая карта ${ordersStarted + 1}`
                });
                if (generated.error) throw new Error(generated.error);
                state = generated.state;
                ordersStarted += 1;
                if (started.quote.effortDays === 0) {
                    const claim = Campaign.claimCardCraftState(state, started.order.id);
                    if (claim.error) throw new Error(claim.error);
                    state = claim.state;
                    cardsClaimed += 1;
                }
            } else if (/Не хватает ресурсов/.test(started.error)) {
                resourceBlockedDays += 1;
            }
        }

        state = advanceDay(state);
    }

    for (const order of state.player.craftOrders.filter(item => item.status === 'ready')) {
        const claim = Campaign.claimCardCraftState(state, order.id);
        if (claim.error) throw new Error(claim.error);
        state = claim.state;
        cardsClaimed += 1;
    }

    return summarize(state, {
        strategy: `${Campaign.CARD_CRAFT_MATERIALS[materialQuality].label} / ${Campaign.CARD_CRAFT_EFFORTS[effort].label}`,
        ordersStarted,
        cardsClaimed,
        resourceBlockedDays,
        craftLevelAtSeasonEnd: state.player.craftLevel + 1,
        craftXpTowardNextLevel: state.player.craftXp,
        prerequisiteResearchOrders: access.researchOrders,
        territoryOrders: access.territoryOrders,
        materialSites: access.sites,
        firstCraftDay
    });
}

function simulateResearchAndConstruction() {
    let state = newCampaign();
    let generatedBlueprints = 0;
    let researchOrders = 0;
    let constructionOrders = 0;
    const incomeEffects = ['income_materials', 'income_knowledge', 'income_food'];

    while (state.day < Campaign.SEASON_LENGTH) {
        let readyToResearch = state.player.blueprints.find(project => !project.researched);
        if (!readyToResearch && state.player.blueprints.every(project => project.built)) {
            const index = generatedBlueprints;
            const effect = incomeEffects[index % incomeEffects.length];
            const added = Campaign.addBlueprint(state, {
                scienceName: `Симуляция науки ${index + 1}`,
                scienceDescription: 'Проект для проверки темпа кампанийной экономики.',
                buildingName: `Симуляция здания ${index + 1}`,
                buildingDescription: 'Здание с простым доходным эффектом.',
                category: 'economy',
                effects: [{ type: effect, amount: 1 }]
            }, 'both');
            if (!added.error) {
                state = added.state;
                generatedBlueprints += 1;
                readyToResearch = added.blueprint;
            }
        }

        if (!state.player.dailyOrders.researchUsed && readyToResearch) {
            const result = Campaign.researchBlueprint(state, readyToResearch.id);
            if (!result.error) {
                state = result.state;
                researchOrders += 1;
            }
        }

        const readyToBuild = state.player.blueprints.find(project => project.researched && !project.built);
        if (!state.player.dailyOrders.constructionUsed && readyToBuild) {
            const result = Campaign.constructBlueprint(state, readyToBuild.id);
            if (!result.error) {
                state = result.state;
                constructionOrders += 1;
            }
        }
        state = advanceDay(state);
    }

    return summarize(state, {
        strategy: 'исследовать и строить каждый доступный день',
        generatedBlueprints,
        researchOrders,
        constructionOrders,
        unfinishedProjects: state.player.blueprints.filter(project => !project.built).length
    });
}

function simulateFrontierToForge() {
    const access = unlockMaterialSites(newCampaign(), 'masterwork');
    let state = access.state;
    const expedition = Campaign.beginRegionExpeditionState(state, 'rival-settlement');
    if (expedition.error) throw new Error(expedition.error);
    const outcome = Campaign.finishRegionExpeditionState(expedition.state, expedition.match, true);
    if (outcome.error) throw new Error(outcome.error);
    state = advanceDay(outcome.state);

    const started = Campaign.beginCardCraftState(state, { materialQuality: 'masterwork', effort: 'painstaking' }, 0.999, 'Сценарий фронтира');
    if (started.error) throw new Error(started.error);
    const generated = Campaign.completeCardCraftState(started.state, started.order.id, {
        id: 'frontier-forge-card', name: 'Проверочная мастерская карта', card_type: 'unit', atk: 4, hp: 4
    });
    if (generated.error) throw new Error(generated.error);
    state = generated.state;
    while (state.player.craftOrders.find(order => order.id === started.order.id).status === 'working') state = advanceDay(state);
    const claimed = Campaign.claimCardCraftState(state, started.order.id);
    if (claimed.error) throw new Error(claimed.error);
    state = claimed.state;
    while (state.day < Campaign.SEASON_LENGTH) state = advanceDay(state);
    return summarize(state, {
        strategy: 'освоить медь и олово → победить в экспедиции → выковать редкую карту',
        assumedBattleVictory: true,
        prerequisiteResearchOrders: access.researchOrders,
        territoryOrders: access.territoryOrders,
        rivalSettlementCaptured: state.regions.find(region => region.id === 'rival-settlement')?.ownerId === 'player',
        availableMaterialQualities: Campaign.getAvailableMaterialQualities(state),
        forgedCardRarity: claimed.card.rarity,
        forgedCardModel: claimed.card.generationModel,
        forgeOrderStartedDay: started.order.createdDay
    });
}

function runReport() {
    return {
        assumptions: {
            seasonLengthDays: Campaign.SEASON_LENGTH,
            origin: ORIGIN,
            openingFocus: OPENING_FOCUS,
            baseDailyIncome: { food: 2, materials: 2, knowledge: 1 },
            notes: [
                'Учитываются текущие правила campaign.js, включая активный стартовый амбар и здания.',
                'В день доступны одна ковка, одно исследование и одно строительство; фронтир использует отдельный лимит. Бесплатная тренировка не даёт ресурсов.',
                'Премиальные сценарии сначала честно оплачивают исследования и захват нужных месторождений.',
                'В сценарии фронтира победа в бою задана вручную; итог не является симуляцией боевого ИИ.',
                'Результаты — сценарии-пределы, а не прогноз поведения каждого игрока.'
            ]
        },
        scenarios: [
            simulateNoOrders(),
            simulateCrafting('standard', 'quick'),
            simulateCrafting('refined', 'focused'),
            simulateCrafting('masterwork', 'painstaking'),
            simulateResearchAndConstruction(),
            simulateFrontierToForge()
        ]
    };
}

if (require.main === module) console.log(JSON.stringify(runReport(), null, 2));
module.exports = { runReport };
