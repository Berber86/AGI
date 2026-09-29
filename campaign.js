(function (root) {
    'use strict';

    const STORAGE_KEY = 'iforge_campaign_v3';
    const SEASON_LENGTH = 30;
    const POP_START = 5;
    const POP_MAX = 20;
    const POP_MIN = 1;
    const FOOD_CONSUMPTION_PER_POP = 0.7;
    const WORKER_BASE_YIELD = { food: 1.4, materials: 1.2, knowledge: 0.7 };
    const STORAGE_BASE = 15;
    const AP_MAX = 2;
    const BUILDING_WORKER_BONUS = { income_food: 0.5, income_materials: 0.4, income_knowledge: 0.5 };
    const UPKEEP_PER_BUILDING = 0.1;

    const CARD_CRAFT_MATERIALS = {
        standard: { label: 'Обычное сырьё', grade: 0, cost: { food: 2, materials: 2, knowledge: 0 } },
        refined: { label: 'Отборное сырьё', grade: 1, cost: { food: 3, materials: 4, knowledge: 1 } },
        masterwork: { label: 'Редкое сырьё', grade: 2, cost: { food: 4, materials: 6, knowledge: 2 } }
    };
    const CARD_CRAFT_EFFORTS = {
        quick: { label: 'Быстро', score: 0, days: 0, cost: { food: 0, materials: 0, knowledge: 0 } },
        focused: { label: 'Тщательно', score: 1, days: 1, cost: { food: 0, materials: 1, knowledge: 0 } },
        painstaking: { label: 'Мастерская работа', score: 2, days: 2, cost: { food: 0, materials: 2, knowledge: 1 } }
    };
    const CARD_RARITY_ODDS = [
        { maxScore: 1, odds: { ordinary: 70, uncommon: 25, rare: 5 } },
        { maxScore: 3, odds: { ordinary: 50, uncommon: 38, rare: 12 } },
        { maxScore: 5, odds: { ordinary: 30, uncommon: 50, rare: 20 } },
        { maxScore: 6, odds: { ordinary: 15, uncommon: 45, rare: 40 } }
    ];
    const SCIENCE_BRANCHES = [
        { id: 'agriculture', label: 'Земледелие и продовольствие', prompt: 'улучшение выращивания, хранения и распределения пищи', minEra: 0, category: 'economy', effect: 'income_food', building: 'амбар или ирригационная система' },
        { id: 'stonecraft', label: 'Камень и ремесло', prompt: 'обработка камня и организация ремесленного производства', minEra: 0, category: 'economy', effect: 'income_materials', building: 'каменная мастерская' },
        { id: 'seasonal', label: 'Наблюдения за сезонами', prompt: 'календарные наблюдения, обучение и передача знаний', minEra: 0, category: 'science', effect: 'income_knowledge', building: 'место наблюдений или календарный круг' },
        { id: 'warfare', label: 'Военная организация', prompt: 'подготовка ополчения и согласованные действия отрядов', minEra: 0, category: 'military', effect: 'deck_slots', building: 'площадка для сбора и обучения' },
        { id: 'fortification', label: 'Укрепления поселения', prompt: 'защита поселения, стен и проходов', minEra: 1, category: 'military', effect: 'max_hp', building: 'частокол или укреплённые ворота' },
        { id: 'metallurgy', label: 'Медь и металлургия', prompt: 'добыча и обработка меди, доступные для текущей эпохи', minEra: 2, category: 'economy', effect: 'income_materials', building: 'рудник или литейная мастерская' },
        { id: 'bronze', label: 'Бронзовые сплавы', prompt: 'бронзовое литьё и снабжение инструментами', minEra: 3, category: 'economy', effect: 'income_materials', building: 'бронзовая литейная' }
    ];
    const ERAS = ['Каменный век', 'Неолит', 'Медный век', 'Бронзовый век', 'Железный век', 'Античность', 'Средневековье'];
    const EFFECTS = {
        deck_slots: { label: '+1 место в боевой колоде', category: 'military', max: 1 },
        max_hp: { label: '+1 стартовое здоровье', category: 'military', max: 1 },
        energy_cap: { label: '+1 к максимуму энергии', category: 'military', max: 1 },
        energy_growth: { label: '+1 к приросту энергии за ход', category: 'military', max: 1 },
        income_food: { label: '+0.5 к еде с рабочего', category: 'economy', max: 2 },
        income_materials: { label: '+0.4 к материалам с рабочего', category: 'economy', max: 2 },
        income_knowledge: { label: '+0.5 к знаниям с рабочего', category: 'science', max: 2 }
    };
    const EFFECT_KEYS = Object.keys(EFFECTS);
    const CATEGORIES = ['military', 'economy', 'science', 'civic'];
    const CATEGORY_NAMES = { military: 'военное', economy: 'экономическое', science: 'научное', civic: 'общественное' };
    const ORIGINS = [
        { id: 'river', name: 'Народ Великой Реки', place: 'Плодородные речные берега', icon: '🌊', description: 'Разливы кормят поселение и облегчают первые запасы.', resource: 'food', bonus: 2 },
        { id: 'highlands', name: 'Народ Каменных Холмов', place: 'Предгорья с кремнёвыми выходами', icon: '⛰️', description: 'Камень и кремень рядом — легче начать ремесло и строительство.', resource: 'materials', bonus: 2 },
        { id: 'woodland', name: 'Народ Лесных Троп', place: 'Лесная опушка и сезонные пастбища', icon: '🌲', description: 'Знания о растениях, животных и временах года помогают учиться.', resource: 'knowledge', bonus: 2 }
    ];
    const OPENING_FOCUSES = [
        { id: 'food', title: 'Надёжные запасы', icon: '🌾', scienceName: 'Рыбные запруды', scienceDescription: 'Наблюдения за течением помогают удерживать рыбу у берега.', buildingName: 'Речная запруда', buildingDescription: 'Плетёные заграждения дают поселению устойчивый источник пищи.', category: 'economy', effect: 'income_food' },
        { id: 'materials', title: 'Каменное ремесло', icon: '🪨', scienceName: 'Обработка кремня', scienceDescription: 'Подбор формы и угла скола делает каменные орудия надёжнее.', buildingName: 'Каменная мастерская', buildingDescription: 'Общая мастерская ускоряет заготовку строительных материалов.', category: 'economy', effect: 'income_materials' },
        { id: 'knowledge', title: 'Сезонные наблюдения', icon: '📚', scienceName: 'Круг времён года', scienceDescription: 'Повторяющиеся знаки природы помогают заранее готовиться к сезонам.', buildingName: 'Календарный круг', buildingDescription: 'Место наблюдений поддерживает передачу знаний между поколениями.', category: 'science', effect: 'income_knowledge' }
    ];
    const REGION_CAPTURE_COST = { food: 2, materials: 2, knowledge: 0 };
    const REGION_EXPEDITION_COST = { food: 4, materials: 2, knowledge: 0 };
    const REGION_DEFINITIONS = [
        { id: 'home', name: 'Речное поселение', icon: '🏛️', kind: 'home', initialOwner: 'player', col: 1, row: 2, minEra: 0, neighbors: ['floodplain', 'hills', 'calendar'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Дом народа и начало всех путей.' },
        { id: 'floodplain', name: 'Заливная пойма', icon: '🌾', kind: 'resource', initialOwner: null, col: 2, row: 1, minEra: 0, neighbors: ['home', 'calendar', 'copper'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Плодородные берега — место для ирригации и амбара. Без постройки дохода нет.' },
        { id: 'hills', name: 'Кремнёвые холмы', icon: '⛰️', kind: 'resource', initialOwner: null, col: 2, row: 3, minEra: 0, neighbors: ['home', 'calendar', 'tin-route'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Каменоломня даёт материалы, но требует людей.' },
        { id: 'calendar', name: 'Круг времён года', icon: '☀️', kind: 'resource', initialOwner: null, col: 3, row: 2, minEra: 0, neighbors: ['home', 'floodplain', 'hills'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Обсерватория открывает знания.' },
        { id: 'copper', name: 'Медный рудник', icon: '🟠', kind: 'resource', initialOwner: null, col: 4, row: 1, minEra: 2, neighbors: ['floodplain', 'rival-settlement'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Плавильня даёт материалы и открывает отборное сырьё.' },
        { id: 'tin-route', name: 'Оловянный путь', icon: '🛤️', kind: 'resource', initialOwner: null, col: 4, row: 3, minEra: 2, neighbors: ['hills', 'rival-settlement'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Караван-сарай вместе с медью открывает мастерское сырьё.' },
        { id: 'rival-settlement', name: 'Поселение Степного Круга', icon: '⚑', kind: 'settlement', initialOwner: 'steppe', col: 5, row: 2, minEra: 2, neighbors: ['copper', 'tin-route'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Укреплённое поселение. Форпост даёт по 1 каждого ресурса.' }
    ];

    const REGION_BUILDINGS = {
        floodplain: { id: 'irrigation', name: 'Ирригация', cost: { materials: 4 }, yields: { food: 2, materials: 0, knowledge: 0 }, workerBonus: { food: 0.3 }, description: 'Пассив +2🌾 и +0.3 к каждому 🌾-рабочему в синергии с амбаром.' },
        hills: { id: 'quarry', name: 'Каменоломня', cost: { materials: 4 }, yields: { food: 0, materials: 2, knowledge: 0 }, workerBonus: {}, description: '+2🪵 в день, требует upkeep.' },
        calendar: { id: 'observatory', name: 'Обсерватория', cost: { materials: 3, knowledge: 1 }, yields: { food: 0, materials: 0, knowledge: 2 }, workerBonus: {}, description: '+2📚 в день.' },
        copper: { id: 'smelter', name: 'Плавильня', cost: { materials: 5, knowledge: 1 }, yields: { food: 0, materials: 1, knowledge: 0 }, workerBonus: {}, unlocks: ['refined'], description: '+1🪵 и открывает отборное сырьё.' },
        'tin-route': { id: 'caravan', name: 'Караван-сарай', cost: { materials: 4, food: 1 }, yields: { food: 0, materials: 1, knowledge: 0 }, workerBonus: {}, unlocks: ['masterwork'], description: '+1🪵, вместе с плавильней открывает мастерское.' },
        'rival-settlement': { id: 'outpost', name: 'Форпост', cost: { materials: 6 }, yields: { food: 1, materials: 1, knowledge: 1 }, workerBonus: {}, description: '+1 каждого ресурса.' },
        home: null
    };

    function createStartingRegions() {
        return REGION_DEFINITIONS.map(region => ({ id: region.id, ownerId: region.initialOwner, capturedDay: region.initialOwner ? 1 : null, building: null }));
    }

    function createDailyOrders() {
        return { craftUsed: false, researchUsed: false, constructionUsed: false, frontierUsed: false, legacyBlocked: false };
    }

    const STARTER_CARDS = [
        { id: 'campaign-starter-spears', name: 'Племенные копейщики', card_type: 'unit', emoji: '🔺', drop_cost: 2, action_cost: 1, atk: 2, hp: 2, description: 'Ополчение с копьями держит строй и прикрывает поселение.', tags: ['копьё', 'пехота'], abilities: [], monkey_paw: '', era: 'ancient', keywords: ['phalanx'], campaignStarter: true },
        { id: 'campaign-starter-slingers', name: 'Пращники из холмов', card_type: 'unit', emoji: '🪨', drop_cost: 1, action_cost: 1, atk: 1, hp: 1, description: 'Лёгкие бойцы бросают камни из-за спин авангарда.', tags: ['пращники', 'дальний бой'], abilities: [], monkey_paw: '', era: 'ancient', keywords: ['ranged', 'skirmish'], campaignStarter: true }
    ];

    function clone(value) { return JSON.parse(JSON.stringify(value)); }
    function clampInt(value, min, max, fallback) {
        const n = Number(value);
        return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.floor(n))) : fallback;
    }
    function makeStarterBuilding() {
        return { id: 'starter-granary', name: 'Общий амбар', description: 'Запас зерна поддерживает поселение. Даёт +0.5 к каждому 🌾-рабочему.', category: 'economy', effects: [{ type: 'income_food', amount: 1 }], active: true, builtDay: 1, blueprintId: null, regionId: null };
    }
    function createState() {
        return {
            version: 3,
            season: 1,
            day: 1,
            medals: [],
            player: {
                name: 'Твоё поселение', clan: 'Медный Ворон', era: 0, research: 0,
                onboardingComplete: false, originId: null, openingFocusId: null,
                resources: { food: 10, materials: 10, knowledge: 6 },
                population: POP_START,
                workers: { food: 2, materials: 1, knowledge: 1, idle: 1 },
                storageCap: STORAGE_BASE,
                ap: AP_MAX,
                apMax: AP_MAX,
                decree: null,
                growthProgress: 0,
                growthDebt: 0,
                starvationDays: 0,
                dailyOrders: createDailyOrders(), actionUsed: false, pendingExpedition: null, campaignNotice: '',
                craftLevel: 0, craftXp: 0, nextCraftOrderId: 1, craftOrders: [],
                buildings: [makeStarterBuilding()],
                activeBuildingSlots: 4,
                blueprints: [],
                deckCardIds: [],
                practice: { wins: 0, losses: 0, leaderWins: 0, leaderLosses: 0 }
            },
            opponents: [
                { id: 'reed', name: 'Илмар из Речных Земель', clan: 'Речной Союз', era: 0, research: 0, pace: 4, offset: 1, rating: 1040, leader: false },
                { id: 'steppe', name: 'Тархан Степной', clan: 'Степной Круг', era: 2, research: 0, pace: 3, offset: 2, rating: 1125, leader: true },
                { id: 'north', name: 'Эйрик Каменный Пояс', clan: 'Северный Пакт', era: 1, research: 1, pace: 2, offset: 1, rating: 980, leader: false }
            ],
            regions: createStartingRegions()
        };
    }

    function normalizeWorkers(raw, population) {
        const base = { food: 2, materials: 1, knowledge: 1, idle: 1 };
        if (!raw || typeof raw !== 'object') {
            const pop = clampInt(population, POP_MIN, POP_MAX, POP_START);
            let food = Math.min(2, pop);
            let materials = Math.min(1, Math.max(0, pop - food));
            let knowledge = Math.min(1, Math.max(0, pop - food - materials));
            let idle = Math.max(0, pop - food - materials - knowledge);
            return { food, materials, knowledge, idle };
        }
        let food = clampInt(raw.food, 0, POP_MAX, base.food);
        let materials = clampInt(raw.materials, 0, POP_MAX, base.materials);
        let knowledge = clampInt(raw.knowledge, 0, POP_MAX, base.knowledge);
        let idle = clampInt(raw.idle, 0, POP_MAX, base.idle);
        let total = food + materials + knowledge + idle;
        const pop = clampInt(population, POP_MIN, POP_MAX, POP_START);
        if (total > pop) {
            let excess = total - pop;
            const order = ['idle', 'knowledge', 'materials', 'food'];
            for (const key of order) {
                if (excess <= 0) break;
                const val = key === 'food' ? food : key === 'materials' ? materials : key === 'knowledge' ? knowledge : idle;
                const reduce = Math.min(val, excess);
                if (key === 'food') food -= reduce;
                else if (key === 'materials') materials -= reduce;
                else if (key === 'knowledge') knowledge -= reduce;
                else idle -= reduce;
                excess -= reduce;
            }
        } else if (total < pop) {
            idle += pop - total;
        }
        return { food, materials, knowledge, idle };
    }

    function normalizeRegions(raw, opponents) {
        const savedRegions = Array.isArray(raw) ? raw : [];
        const validOwners = new Set(['player', ...opponents.map(opponent => opponent.id)]);
        return REGION_DEFINITIONS.map(definition => {
            const saved = savedRegions.find(region => region && region.id === definition.id);
            let ownerId = saved ? saved.ownerId : definition.initialOwner;
            if (ownerId !== null && !validOwners.has(ownerId)) ownerId = definition.initialOwner;
            if (definition.id === 'home') ownerId = 'player';
            let building = null;
            if (saved && saved.building) {
                const rb = REGION_BUILDINGS[definition.id];
                if (rb && saved.building === rb.id) building = rb.id;
            } else if (saved && ownerId === 'player' && definition.id !== 'home') {
                // migration v2 -> v3: if region was owned in v2, give it its building for free to not punish old saves too harshly?
                // For new balance we want 0 without building, so for v2 saves we keep building as null but mark as owned.
                // Actually to preserve progress, give building if owned in old save.
                // Check if saved had yields? Old saves had yields, so we grant building.
                if (definition.yields && (definition.yields.food || definition.yields.materials || definition.yields.knowledge)) {
                    // old v2 region gave income, so grant building for migration
                    const rb = REGION_BUILDINGS[definition.id];
                    if (rb) building = rb.id;
                }
            }
            return {
                id: definition.id,
                ownerId,
                capturedDay: ownerId === null ? null : clampInt(saved?.capturedDay, 1, SEASON_LENGTH, 1),
                building
            };
        });
    }

    function normalizedPendingExpedition(raw, state) {
        if (!raw || typeof raw !== 'object') return null;
        const definition = REGION_DEFINITIONS.find(region => region.id === raw.regionId && region.kind === 'settlement');
        const record = state.regions.find(region => region.id === raw.regionId);
        const opponent = state.opponents.find(item => item.id === raw.opponentId);
        if (!definition || !record || !opponent || record.ownerId !== opponent.id) return null;
        return {
            regionId: definition.id,
            opponentId: opponent.id,
            launchDay: clampInt(raw.launchDay, 1, SEASON_LENGTH, state.day),
            cost: { ...REGION_EXPEDITION_COST },
            battleStarted: Boolean(raw.battleStarted)
        };
    }

    function normalizeDailyOrders(raw, state, legacyActionUsed) {
        const orders = createDailyOrders();
        if (raw && typeof raw === 'object') {
            for (const key of Object.keys(orders)) orders[key] = Boolean(raw[key]);
        } else if (legacyActionUsed) {
            const day = state.day;
            const currentCraft = state.player.craftOrders.some(order => order.createdDay === day && order.status !== 'failed');
            const currentExpedition = Boolean(state.player.pendingExpedition?.launchDay === day);
            const currentSettlement = state.regions.some(region => region.id !== 'home' && region.ownerId === 'player' && region.capturedDay === day);
            const currentConstruction = state.player.buildings.some(building => building.blueprintId && building.builtDay === day);
            const currentResearch = state.player.blueprints.some(blueprint => blueprint.researchedDay === day);
            if (currentCraft) orders.craftUsed = true;
            else if (currentExpedition || currentSettlement) orders.frontierUsed = true;
            else if (currentConstruction) orders.constructionUsed = true;
            else if (currentResearch) orders.researchUsed = true;
            else orders.legacyBlocked = true;
        }
        if (state.player.pendingExpedition) orders.frontierUsed = true;
        return orders;
    }

    function syncLegacyActionUsed(state) {
        const orders = state.player.dailyOrders;
        state.player.actionUsed = Boolean(orders.craftUsed || orders.researchUsed || orders.constructionUsed || orders.frontierUsed || orders.legacyBlocked || state.player.pendingExpedition || state.player.ap < state.player.apMax);
    }

    function markDailyOrderUsed(state, type) {
        const key = { craft: 'craftUsed', research: 'researchUsed', construction: 'constructionUsed', frontier: 'frontierUsed' }[type];
        if (!key) throw new Error('Неизвестный дневной лимит: ' + type);
        state.player.dailyOrders[key] = true;
        if (state.player.ap > 0) state.player.ap -= 1;
        syncLegacyActionUsed(state);
    }

    function clearDailyOrder(state, type) {
        const key = { craft: 'craftUsed', research: 'researchUsed', construction: 'constructionUsed', frontier: 'frontierUsed' }[type];
        if (!key) return;
        state.player.dailyOrders[key] = false;
        state.player.ap = Math.min(state.player.apMax, state.player.ap + 1);
        syncLegacyActionUsed(state);
    }

    function cleanEffects(raw) {
        if (!Array.isArray(raw) || raw.length < 1 || raw.length > 2) return null;
        const effects = [];
        for (const item of raw) {
            if (!item || !EFFECTS[item.type]) return null;
            const amount = Number(item.amount);
            if (!Number.isInteger(amount) || amount < 1 || amount > EFFECTS[item.type].max) return null;
            effects.push({ type: item.type, amount });
        }
        if (new Set(effects.map(item => item.type)).size !== effects.length) return null;
        return effects;
    }

    function normalizeState(value) {
        const base = createState();
        if (!value || typeof value !== 'object') return base;
        // allow v2 migration
        const isV2 = value.version === 2;
        if (value.version !== 3 && value.version !== 2) return base;
        const state = { ...base, ...value };
        state.version = 3;
        state.season = clampInt(value.season, 1, 999999, 1);
        state.day = clampInt(value.day, 1, SEASON_LENGTH, 1);
        state.medals = Array.isArray(value.medals) ? value.medals.filter(m => m && typeof m.id === 'string') : [];
        state.player = { ...base.player, ...(value.player || {}) };
        const legacyActionUsed = Boolean(state.player.actionUsed);
        state.player.era = clampInt(state.player.era, 0, ERAS.length - 1, 0);
        state.player.onboardingComplete = typeof value.player?.onboardingComplete === 'boolean' ? value.player.onboardingComplete : (isV2 ? true : false);
        state.player.originId = ORIGINS.some(item => item.id === state.player.originId) ? state.player.originId : null;
        state.player.openingFocusId = OPENING_FOCUSES.some(item => item.id === state.player.openingFocusId) ? state.player.openingFocusId : null;
        state.player.research = clampInt(state.player.research, 0, 1, 0);
        state.player.campaignNotice = String(state.player.campaignNotice || '').slice(0, 240);
        state.player.resources = { ...base.player.resources, ...(state.player.resources || {}) };
        for (const key of Object.keys(base.player.resources)) state.player.resources[key] = clampInt(state.player.resources[key], 0, 999, base.player.resources[key]);
        state.player.population = clampInt(state.player.population, POP_MIN, POP_MAX, POP_START);
        state.player.workers = normalizeWorkers(state.player.workers, state.player.population);
        state.player.storageCap = clampInt(state.player.storageCap, STORAGE_BASE, 999, STORAGE_BASE);
        state.player.ap = clampInt(state.player.ap, 0, 10, AP_MAX);
        state.player.apMax = clampInt(state.player.apMax, 1, 10, AP_MAX);
        state.player.decree = state.player.decree && ['military', 'agricultural', 'priestly'].includes(state.player.decree) ? state.player.decree : null;
        state.player.growthProgress = clampInt(state.player.growthProgress, 0, 999, 0);
        state.player.growthDebt = clampInt(state.player.growthDebt, 0, 999, 0);
        state.player.starvationDays = clampInt(state.player.starvationDays, 0, 999, 0);
        state.player.activeBuildingSlots = clampInt(state.player.activeBuildingSlots, 4, 5, 4);
        state.player.practice = { ...base.player.practice, ...(state.player.practice || {}) };
        state.player.craftLevel = clampInt(state.player.craftLevel, 0, 2, 0);
        state.player.craftXp = clampInt(state.player.craftXp, 0, 2, 0);
        state.player.nextCraftOrderId = clampInt(state.player.nextCraftOrderId, 1, 999999, 1);
        state.player.craftOrders = Array.isArray(state.player.craftOrders) ? state.player.craftOrders.slice(-20).map(order => {
            if (!order || typeof order !== 'object' || typeof order.id !== 'string' || !['generating', 'working', 'ready', 'claimed', 'failed'].includes(order.status)) return null;
            const cost = order.cost && typeof order.cost === 'object' ? order.cost : {};
            const odds = order.odds && typeof order.odds === 'object' ? order.odds : {};
            return {
                id: order.id.slice(0, 80), status: order.status,
                rarity: ['ordinary', 'uncommon', 'rare'].includes(order.rarity) ? order.rarity : 'ordinary',
                modelId: ['gpt-6-luna', 'glm-5.2'].includes(order.modelId) ? order.modelId : 'gpt-6-luna',
                materialQuality: Object.hasOwn(CARD_CRAFT_MATERIALS, order.materialQuality) ? order.materialQuality : 'standard',
                effort: Object.hasOwn(CARD_CRAFT_EFFORTS, order.effort) ? order.effort : 'quick',
                qualityScore: clampInt(order.qualityScore, 0, 6, 0),
                odds: { ordinary: clampInt(odds.ordinary, 0, 100, 70), uncommon: clampInt(odds.uncommon, 0, 100, 25), rare: clampInt(odds.rare, 0, 100, 5) },
                roll: Number.isFinite(Number(order.roll)) ? Math.max(0, Math.min(0.999999999, Number(order.roll))) : 0,
                effortDays: clampInt(order.effortDays, 0, 2, 0),
                remainingDays: clampInt(order.remainingDays, 0, 2, 0),
                createdDay: clampInt(order.createdDay, 1, SEASON_LENGTH, 1),
                completedDay: order.completedDay ? clampInt(order.completedDay, 1, SEASON_LENGTH, 1) : null,
                claimedDay: order.claimedDay ? clampInt(order.claimedDay, 1, SEASON_LENGTH, 1) : null,
                advisorOrder: String(order.advisorOrder || 'Заказ советнику').slice(0, 120),
                name: String(order.name || '').slice(0, 80),
                failure: String(order.failure || '').slice(0, 240),
                cost: { food: clampInt(cost.food, 0, 999, 0), materials: clampInt(cost.materials, 0, 999, 0), knowledge: clampInt(cost.knowledge, 0, 999, 0) },
                card: order.card && typeof order.card === 'object' && order.status !== 'claimed' && order.status !== 'failed' ? clone(order.card) : null
            };
        }).filter(Boolean) : [];
        for (const key of Object.keys(base.player.practice)) state.player.practice[key] = clampInt(state.player.practice[key], 0, 999, 0);
        state.player.buildings = Array.isArray(state.player.buildings) ? state.player.buildings.slice(0, 30).map(building => ({
            id: String(building.id || 'building-' + Math.random().toString(36).slice(2)),
            name: String(building.name || 'Безымянное здание').slice(0, 80),
            description: String(building.description || '').slice(0, 400),
            category: CATEGORIES.includes(building.category) ? building.category : 'civic',
            effects: cleanEffects(building.effects) || [],
            active: Boolean(building.active),
            builtDay: clampInt(building.builtDay, 1, SEASON_LENGTH, 1),
            blueprintId: building.blueprintId || null,
            regionId: building.regionId || null
        })) : [makeStarterBuilding()];
        if (!state.player.buildings.some(building => building.id === 'starter-granary')) state.player.buildings.unshift(makeStarterBuilding());
        let activeCount = 0;
        state.player.buildings.forEach(building => { if (building.active && activeCount++ >= state.player.activeBuildingSlots) building.active = false; });
        state.player.blueprints = Array.isArray(state.player.blueprints) ? state.player.blueprints.slice(0, 30).map(blueprint => ({
            id: String(blueprint.id || ''),
            scienceName: String(blueprint.scienceName || '').slice(0, 80),
            scienceDescription: String(blueprint.scienceDescription || '').slice(0, 400),
            buildingName: String(blueprint.buildingName || '').slice(0, 80),
            buildingDescription: String(blueprint.buildingDescription || '').slice(0, 400),
            category: CATEGORIES.includes(blueprint.category) ? blueprint.category : 'civic',
            effects: cleanEffects(blueprint.effects) || [],
            researched: Boolean(blueprint.researched),
            researchedDay: blueprint.researchedDay ? clampInt(blueprint.researchedDay, 1, SEASON_LENGTH, 1) : null,
            built: Boolean(blueprint.built),
            builtDay: blueprint.builtDay ? clampInt(blueprint.builtDay, 1, SEASON_LENGTH, 1) : null,
            visibility: ['allies', 'neighbors', 'both'].includes(blueprint.visibility) ? blueprint.visibility : 'both',
            createdDay: clampInt(blueprint.createdDay, 1, SEASON_LENGTH, 1),
            openingProject: Boolean(blueprint.openingProject)
        })).filter(blueprint => blueprint.id && blueprint.scienceName && blueprint.buildingName) : [];
        state.player.deckCardIds = Array.isArray(state.player.deckCardIds) ? [...new Set(state.player.deckCardIds.filter(id => typeof id === 'string'))].slice(0, 8) : [];
        state.opponents = Array.isArray(value.opponents) && value.opponents.length
            ? value.opponents.map((opponent, i) => ({ ...base.opponents[i % base.opponents.length], ...opponent,
                era: clampInt(opponent.era, 0, ERAS.length - 1, 0), research: clampInt(opponent.research, 0, 1, 0),
                pace: clampInt(opponent.pace, 1, 10, 3), offset: clampInt(opponent.offset, 0, 10, 0), rating: clampInt(opponent.rating, 0, 99999, 1000)
            })) : base.opponents;
        state.regions = normalizeRegions(value.regions, state.opponents);
        state.player.pendingExpedition = normalizedPendingExpedition(value.player?.pendingExpedition, state);
        state.player.dailyOrders = normalizeDailyOrders(value.player?.dailyOrders, state, legacyActionUsed);
        if (isV2) {
            state.player.ap = AP_MAX;
            state.player.apMax = AP_MAX;
            if (state.player.dailyOrders.craftUsed) state.player.ap = Math.max(0, state.player.ap - 1);
            if (state.player.dailyOrders.researchUsed) state.player.ap = Math.max(0, state.player.ap - 1);
            if (state.player.dailyOrders.constructionUsed) state.player.ap = Math.max(0, state.player.ap - 1);
            if (state.player.dailyOrders.frontierUsed) state.player.ap = Math.max(0, state.player.ap - 1);
        }
        syncLegacyActionUsed(state);
        return state;
    }

    function completeOnboarding(input, { name, originId, openingFocusId } = {}) {
        const state = normalizeState(input);
        if (state.player.onboardingComplete) return { state, error: 'Начало игры уже пройдено.' };
        const origin = ORIGINS.find(item => item.id === originId);
        const focus = OPENING_FOCUSES.find(item => item.id === openingFocusId);
        if (!origin || !focus) return { state, error: 'Выбери происхождение и первое направление.' };
        const cleanName = String(name || '').trim().slice(0, 24);
        state.player.name = cleanName || origin.name;
        state.player.originId = origin.id;
        state.player.openingFocusId = focus.id;
        state.player.resources[origin.resource] = Math.min(999, state.player.resources[origin.resource] + origin.bonus);
        state.player.deckCardIds = STARTER_CARDS.map(card => card.id);
        state.player.blueprints.unshift({
            id: 'opening-' + focus.id,
            scienceName: focus.scienceName,
            scienceDescription: focus.scienceDescription,
            buildingName: focus.buildingName,
            buildingDescription: focus.buildingDescription,
            category: focus.category,
            effects: [{ type: focus.effect, amount: 1 }],
            researched: false,
            built: false,
            visibility: 'both',
            createdDay: state.day,
            openingProject: true
        });
        state.player.onboardingComplete = true;
        return { state, error: null };
    }

    function effectTotals(state) {
        const totals = { deck_slots: 0, max_hp: 0, energy_cap: 0, energy_growth: 0, income_food: 0, income_materials: 0, income_knowledge: 0 };
        const active = state.player.buildings.filter(building => building.active).slice(0, state.player.activeBuildingSlots);
        for (const building of active) for (const effect of building.effects || []) {
            if (Object.hasOwn(totals, effect.type)) totals[effect.type] += effect.amount;
        }
        return totals;
    }

    function getFoodConsumption(input) {
        const state = normalizeState(input);
        let mult = 1.0;
        if (state.player.decree === 'military') mult = 1.3;
        if (state.player.decree === 'agricultural') mult = 0.9;
        return state.player.population * FOOD_CONSUMPTION_PER_POP * mult;
    }

    function getStorageCap(input) {
        const state = normalizeState(input);
        let cap = STORAGE_BASE;
        const active = state.player.buildings.filter(b => b.active).length;
        cap += active * 2;
        if (state.player.decree === 'agricultural') cap += 10;
        const hasGranary = state.player.buildings.some(b => b.active && b.effects.some(e => e.type === 'income_food'));
        if (hasGranary) cap += 3;
        return cap;
    }

    function getProductionBreakdown(input) {
        const state = normalizeState(input);
        const totals = effectTotals(state);
        const workers = state.player.workers;
        let bonusFood = 0, bonusMat = 0, bonusKnow = 0;
        for (const building of state.player.buildings.filter(b => b.active)) {
            for (const eff of building.effects || []) {
                if (eff.type === 'income_food') bonusFood += BUILDING_WORKER_BONUS.income_food * eff.amount;
                if (eff.type === 'income_materials') bonusMat += BUILDING_WORKER_BONUS.income_materials * eff.amount;
                if (eff.type === 'income_knowledge') bonusKnow += BUILDING_WORKER_BONUS.income_knowledge * eff.amount;
            }
        }
        const floodplainHasIrrigation = state.regions.find(r => r.id === 'floodplain')?.building === 'irrigation';
        if (floodplainHasIrrigation && bonusFood > 0) bonusFood += 0.3;

        const workerProd = {
            food: workers.food * (WORKER_BASE_YIELD.food + bonusFood),
            materials: workers.materials * (WORKER_BASE_YIELD.materials + bonusMat),
            knowledge: workers.knowledge * (WORKER_BASE_YIELD.knowledge + bonusKnow)
        };

        const regional = { food: 0, materials: 0, knowledge: 0 };
        for (const region of state.regions) {
            if (region.ownerId !== 'player') continue;
            if (!region.building) continue;
            const def = REGION_BUILDINGS[region.id];
            if (!def || def.id !== region.building) continue;
            regional.food += def.yields.food || 0;
            regional.materials += def.yields.materials || 0;
            regional.knowledge += def.yields.knowledge || 0;
        }

        const consumption = getFoodConsumption(state);
        const upkeep = state.player.buildings.filter(b => b.active).length * UPKEEP_PER_BUILDING + state.regions.filter(r => r.ownerId === 'player' && r.building).length * UPKEEP_PER_BUILDING;

        return {
            workers,
            workerBase: { ...WORKER_BASE_YIELD },
            workerBonus: { food: bonusFood, materials: bonusMat, knowledge: bonusKnow },
            workerProduction: workerProd,
            regional,
            consumption,
            upkeep,
            totals
        };
    }

    function getBattleConfig(input) {
        const state = normalizeState(input);
        const effects = effectTotals(state);
        return {
            deckLimit: Math.min(6, 2 + effects.deck_slots),
            hp: Math.min(12, 5 + effects.max_hp),
            energyMax: Math.min(8, 2 + effects.energy_cap),
            energyGrowth: Math.min(3, 1 + effects.energy_growth),
            effects
        };
    }
    function getOpponentBattleConfig(input, opponentId) {
        const state = normalizeState(input);
        const opponent = state.opponents.find(item => item.id === opponentId);
        const era = opponent ? opponent.era : 0;
        return {
            era,
            deckLimit: Math.min(6, 2 + Math.floor(era / 2)),
            hp: 5 + Math.floor(era / 2),
            energyMax: Math.min(6, 2 + Math.floor(era / 2)),
            energyGrowth: Math.min(2, 1 + Math.floor(era / 4))
        };
    }

    function spend(state, cost) {
        for (const key of Object.keys(cost)) if ((state.player.resources[key] || 0) < cost[key]) return false;
        for (const key of Object.keys(cost)) state.player.resources[key] -= cost[key];
        return true;
    }
    function canOrder(state, type) {
        if (state.day >= SEASON_LENGTH) return 'Сезон завершён. Подведи итоги.';
        if (type === 'frontier' && state.player.pendingExpedition) return 'Сначала заверши незавершённую экспедицию.';
        if (state.player.dailyOrders.legacyBlocked) return 'Старый приказ из сохранения нельзя определить; продвинь день, чтобы восстановить лимиты.';
        if (state.player.ap <= 0) return 'AP исчерпаны на сегодня. Заверши день.';
        const key = { craft: 'craftUsed', research: 'researchUsed', construction: 'constructionUsed', frontier: 'frontierUsed' }[type];
        if (!key) return 'Тип дневного действия не распознан.';
        if (state.player.dailyOrders[key]) {
            return {
                craft: 'Сегодняшняя ковка уже заказана. Продвинь день.',
                research: 'Сегодняшнее исследование уже проведено. Продвинь день.',
                construction: 'Сегодняшнее строительство уже выполнено. Продвинь день.',
                frontier: 'Сегодняшний поход за землёй уже использован. Продвинь день.'
            }[type];
        }
        return null;
    }

    function getRegionRecord(state, regionId) {
        return state.regions.find(region => region.id === regionId) || null;
    }
    function isRegionConnected(state, definition) {
        return definition.neighbors.some(id => getRegionRecord(state, id)?.ownerId === 'player');
    }
    function getRegionalIncome(input) {
        const state = normalizeState(input);
        const income = { food: 0, materials: 0, knowledge: 0 };
        for (const region of state.regions) {
            if (region.ownerId !== 'player') continue;
            if (!region.building) continue;
            const def = REGION_BUILDINGS[region.id];
            if (!def || def.id !== region.building) continue;
            income.food += def.yields.food || 0;
            income.materials += def.yields.materials || 0;
            income.knowledge += def.yields.knowledge || 0;
        }
        return income;
    }
    function getAvailableMaterialQualities(input) {
        const state = normalizeState(input);
        const ownedBuildings = new Set(state.regions.filter(r => r.ownerId === 'player' && r.building).map(r => r.building));
        const available = ['standard'];
        if (ownedBuildings.has('smelter')) available.push('refined');
        if (ownedBuildings.has('smelter') && ownedBuildings.has('caravan')) available.push('masterwork');
        return available;
    }
    function getRegionActionState(input, regionId) {
        const state = normalizeState(input);
        const definition = REGION_DEFINITIONS.find(region => region.id === regionId);
        if (!definition) return { action: 'blocked', enabled: false, reason: 'Регион не найден.' };
        const record = getRegionRecord(state, regionId);
        if (record?.ownerId === 'player') {
            if (!record.building) {
                const rb = REGION_BUILDINGS[regionId];
                if (!rb) return { action: 'owned', enabled: false, reason: 'Регион под контролем. Здание не требуется.' };
                const orderError = canOrder(state, 'construction');
                if (orderError) return { action: 'build', enabled: false, reason: orderError, cost: { ...rb.cost }, building: rb };
                if (!Object.keys(rb.cost).every(key => state.player.resources[key] >= rb.cost[key])) {
                    return { action: 'build', enabled: false, reason: 'Не хватает ресурсов на ' + rb.name + '.', cost: { ...rb.cost }, building: rb };
                }
                return { action: 'build', enabled: true, reason: 'Построить ' + rb.name + ' за ' + Object.entries(rb.cost).map(function(e){return e[1]+(e[0]==='food'?'🌾':e[0]==='materials'?'🪵':'📚');}).join(' '), cost: { ...rb.cost }, building: rb };
            }
            return { action: 'owned', enabled: false, reason: 'Регион под контролем. Здание: ' + (REGION_BUILDINGS[regionId]?.name || record.building) };
        }
        if (state.player.pendingExpedition) {
            if (state.player.pendingExpedition.regionId === regionId && !state.player.pendingExpedition.battleStarted) return { action: 'resume', enabled: true, reason: 'Экспедиция ждёт начала боя.' };
            if (state.player.pendingExpedition.regionId === regionId) return { action: 'return', enabled: true, reason: 'Экспедиционный бой уже идёт.' };
            return { action: 'blocked', enabled: false, reason: 'Сначала заверши текущую экспедицию.' };
        }
        const isNeutral = record?.ownerId === null;
        const action = isNeutral ? 'settle' : 'attack';
        const cost = isNeutral ? REGION_CAPTURE_COST : REGION_EXPEDITION_COST;
        const orderError = canOrder(state, 'frontier');
        if (orderError) return { action, enabled: false, reason: orderError, cost: { ...cost } };
        if (!isRegionConnected(state, definition)) return { action, enabled: false, reason: 'Сначала займи соседний регион.', cost: { ...cost } };
        if (state.player.era < definition.minEra) return { action, enabled: false, reason: 'Нужна эпоха «' + eraName(definition.minEra) + '».', cost: { ...cost } };
        if (!Object.keys(cost).every(key => state.player.resources[key] >= cost[key])) {
            return { action, enabled: false, reason: isNeutral ? 'Нужно 2 провизии и 2 материала.' : 'Для экспедиции нужны 4 провизии и 2 материала.', cost: { ...cost } };
        }
        return { action, enabled: true, reason: '', cost: { ...cost } };
    }
    function settleRegion(input, regionId) {
        const state = normalizeState(input);
        const action = getRegionActionState(state, regionId);
        if (action.action !== 'settle' || !action.enabled) return { state, error: action.reason || 'Этот регион нельзя заселить.' };
        const definition = REGION_DEFINITIONS.find(region => region.id === regionId);
        spend(state, REGION_CAPTURE_COST);
        const record = getRegionRecord(state, regionId);
        record.ownerId = 'player';
        record.capturedDay = state.day;
        record.building = null;
        markDailyOrderUsed(state, 'frontier');
        return { state, region: { ...definition, ownerId: 'player', capturedDay: state.day, building: null }, error: null };
    }
    function buildRegionBuilding(input, regionId) {
        const state = normalizeState(input);
        const action = getRegionActionState(state, regionId);
        if (action.action !== 'build' || !action.enabled) return { state, error: action.reason || 'Здесь нельзя строить.' };
        const rb = REGION_BUILDINGS[regionId];
        if (!rb) return { state, error: 'Для этого региона нет постройки.' };
        if (!spend(state, rb.cost)) return { state, error: 'Не хватает ресурсов.' };
        const record = getRegionRecord(state, regionId);
        record.building = rb.id;
        markDailyOrderUsed(state, 'construction');
        state.player.campaignNotice = 'Построено: ' + rb.name + ' в ' + REGION_DEFINITIONS.find(r=>r.id===regionId).name + '. Доход начнёт поступать завтра.';
        return { state, error: null };
    }
    function makeExpeditionMatch(state, pending = state.player.pendingExpedition) {
        if (!pending) return null;
        const definition = REGION_DEFINITIONS.find(region => region.id === pending.regionId);
        const opponent = state.opponents.find(item => item.id === pending.opponentId);
        if (!definition || !opponent) return null;
        return {
            kind: 'expedition', regionId: definition.id, regionName: definition.name,
            opponentId: opponent.id, name: opponent.name, clan: opponent.clan,
            era: opponent.era, leaderBattle: true
        };
    }
    function beginRegionExpedition(input, regionId) {
        const state = normalizeState(input);
        const action = getRegionActionState(state, regionId);
        if (action.action !== 'attack' || !action.enabled) return { state, error: action.reason || 'Этот регион нельзя атаковать.' };
        const definition = REGION_DEFINITIONS.find(region => region.id === regionId);
        const record = getRegionRecord(state, regionId);
        const opponent = state.opponents.find(item => item.id === record.ownerId);
        if (!opponent) return { state, error: 'Защитник региона не найден.' };
        spend(state, REGION_EXPEDITION_COST);
        markDailyOrderUsed(state, 'frontier');
        state.player.pendingExpedition = { regionId, opponentId: opponent.id, launchDay: state.day, cost: { ...REGION_EXPEDITION_COST }, battleStarted: false };
        return { state, match: makeExpeditionMatch(state), error: null };
    }
    function finishRegionExpedition(input, match, won) {
        let state = normalizeState(input);
        const pending = state.player.pendingExpedition;
        if (!match || !pending || match.kind !== 'expedition' || match.regionId !== pending.regionId || match.opponentId !== pending.opponentId) {
            return { state, error: 'Эта экспедиция не найдена или уже завершена.' };
        }
        const definition = REGION_DEFINITIONS.find(region => region.id === pending.regionId);
        const opponent = state.opponents.find(item => item.id === pending.opponentId);
        const record = getRegionRecord(state, pending.regionId);
        if (!definition || !opponent || !record || record.ownerId !== opponent.id) return { state, error: 'Состояние региона изменилось; экспедицию нельзя завершить.' };
        const victory = Boolean(won);
        const practice = recordPractice(state, opponent.id, victory, true);
        state = practice.state;
        if (victory) {
            const conquered = getRegionRecord(state, pending.regionId);
            conquered.ownerId = 'player';
            conquered.capturedDay = state.day;
            conquered.building = null;
        }
        state.player.pendingExpedition = null;
        const message = victory
            ? 'Победа! ' + definition.name + ' переходит под твой контроль. Построй там здание, чтобы получать доход.'
            : 'Поражение. ' + definition.name + ' удерживает соперник. Ресурсы и AP за экспедицию уже потрачены.';
        return { state, regionId: definition.id, regionName: definition.name, won: victory, message, error: null };
    }
    function markExpeditionBattleStarted(input, match) {
        const state = normalizeState(input);
        const pending = state.player.pendingExpedition;
        if (!match || match.kind !== 'expedition' || !pending || pending.regionId !== match.regionId || pending.opponentId !== match.opponentId) {
            return { state, error: 'Нельзя отметить неизвестную экспедицию.' };
        }
        pending.battleStarted = true;
        return { state, error: null };
    }
    function recoverInterruptedExpedition(input) {
        const state = normalizeState(input);
        if (!state.player.pendingExpedition?.battleStarted) return { state, recovered: false };
        const match = makeExpeditionMatch(state);
        const outcome = finishRegionExpedition(state, match, false);
        if (outcome.error) return { state, recovered: false, error: outcome.error };
        outcome.state.player.campaignNotice = 'Экспедиционный бой был прерван перезагрузкой и засчитан как поражение; припасы и AP не возвращены.';
        return { state: outcome.state, recovered: true };
    }

    function scienceBranchesForEra(era) {
        const currentEra = clampInt(era, 0, ERAS.length - 1, 0);
        return SCIENCE_BRANCHES.filter(branch => branch.minEra <= currentEra).map(branch => ({ ...branch }));
    }

    function scienceAdvisorSituation(input) {
        const current = normalizeState(input);
        const player = current.player;
        const regions = REGION_DEFINITIONS.filter(region => getRegionRecord(current, region.id)?.ownerId === 'player');
        const regionalIncome = getRegionalIncome(current);
        const breakdown = getProductionBreakdown(current);
        const dailyIncome = {
            food: breakdown.workerProduction.food + regionalIncome.food,
            materials: breakdown.workerProduction.materials + regionalIncome.materials,
            knowledge: breakdown.workerProduction.knowledge + regionalIncome.knowledge
        };
        const resourceLabels = { food: 'провизия', materials: 'материалы', knowledge: 'знания' };
        const reserveDays = Object.keys(dailyIncome).map(key => ({
            key,
            days: (player.resources[key] || 0) / Math.max(1, dailyIncome[key] + (key === 'food' ? 0 : 0))
        })).sort((a, b) => a.days - b.days)[0];
        const reserves = {
            food: player.resources.food || 0,
            materials: player.resources.materials || 0,
            knowledge: player.resources.knowledge || 0
        };
        const regionNames = regions.map(region => region.name);
        const localContexts = regions.map(region => ({
            id: region.id,
            name: region.name,
            description: region.description
        }));
        const summary = 'Земли: ' + (regionNames.join(' · ') || 'поселение') + '. Население: ' + player.population + ' (работников: ' + (player.population - player.workers.idle) + '). Запасы: провизия ' + reserves.food + ', материалы ' + reserves.materials + ', знания ' + reserves.knowledge + '. Короткий запас — ' + resourceLabels[reserveDays.key] + '. Доход рабочих: 🌾' + breakdown.workerProduction.food.toFixed(1) + ' 🪵' + breakdown.workerProduction.materials.toFixed(1) + ' 📚' + breakdown.workerProduction.knowledge.toFixed(1) + ' потребление ' + breakdown.consumption.toFixed(1) + '🌾.';
        return { regionNames, localContexts, reserves, dailyIncome, currentNeed: reserveDays.key, summary, breakdown };
    }

    function getFirstSessionGuide(input) {
        const current = normalizeState(input);
        const player = current.player;
        const openingProject = player.blueprints.find(project => project.openingProject);
        if (!player.onboardingComplete || !openingProject) return null;

        const practiceCount = (player.practice.wins || 0) + (player.practice.losses || 0);
        const steps = [
            { id: 'research', label: 'Исследовать «' + openingProject.scienceName + '»', done: Boolean(openingProject.researched) },
            { id: 'build', label: 'Построить «' + openingProject.buildingName + '»', done: Boolean(openingProject.built) },
            { id: 'territory', label: 'Занять соседний ресурсный регион', done: current.regions.filter(region => region.ownerId === 'player').length > 1 },
            { id: 'battle', label: 'Сыграть тренировочный бой с ИИ', done: practiceCount > 0 }
        ];
        const completedCount = steps.filter(step => step.done).length;
        const complete = completedCount === steps.length;
        let next;
        if (complete) {
            next = 'Первый маршрут пройден. Теперь можно свободно развивать поселение, заказывать карты в кузнице или продолжать тренировочные бои.';
        } else if (current.day >= SEASON_LENGTH) {
            next = 'Сезон дошёл до последнего дня до завершения вступительного маршрута. Подведи итоги сезона, чтобы продолжить кампанию.';
        } else if (!openingProject.researched) {
            next = player.dailyOrders.researchUsed || player.ap <= 0
                ? 'Исследовательский лимит на сегодня исчерпан (' + player.ap + ' AP). Заверши день, затем исследуй «' + openingProject.scienceName + '» за 1 провизию, 1 материал и 2 знания.'
                : 'Исследуй «' + openingProject.scienceName + '» в панели развития: это стоит 1 провизию, 1 материал и 2 знания.';
        } else if (!openingProject.built) {
            next = player.dailyOrders.constructionUsed || player.ap <= 0
                ? 'Строительный лимит на сегодня исчерпан. Заверши день, затем построй «' + openingProject.buildingName + '» за 4 материала.'
                : 'Построй «' + openingProject.buildingName + '» за 4 материала — чертёж уже исследован.';
        } else if (current.regions.filter(region => region.ownerId === 'player').length <= 1) {
            next = player.dailyOrders.frontierUsed || player.ap <= 0
                ? 'Лимит фронтира/AP на сегодня исчерпан. Заверши день, затем займи соседний нейтральный регион за 2 провизии и 2 материала.'
                : 'На карте выбери соседний нейтральный регион и займи его за 2 провизии и 2 материала. Его доход будет 0 пока не построишь здание.';
        } else {
            next = 'Выбери любого ИИ-соседа и сыграй тренировочный бой. Победа не обязательна; тренировочный бой не расходует кампанийные ресурсы.';
        }

        return { steps, completedCount, complete, next };
    }

    function cardCraftQuote(input, investment = {}) {
        const state = normalizeState(input);
        const materialQuality = Object.hasOwn(CARD_CRAFT_MATERIALS, investment.materialQuality) ? investment.materialQuality : 'standard';
        const effort = Object.hasOwn(CARD_CRAFT_EFFORTS, investment.effort) ? investment.effort : 'quick';
        const material = CARD_CRAFT_MATERIALS[materialQuality];
        const time = CARD_CRAFT_EFFORTS[effort];
        const qualityScore = Math.min(6, material.grade + state.player.craftLevel + time.score);
        const odds = CARD_RARITY_ODDS.find(row => qualityScore <= row.maxScore).odds;
        const cost = {
            food: material.cost.food + time.cost.food,
            materials: material.cost.materials + time.cost.materials,
            knowledge: material.cost.knowledge + time.cost.knowledge
        };
        const availableMaterialQualities = getAvailableMaterialQualities(state);
        const materialQualityUnlocked = availableMaterialQualities.includes(materialQuality);
        const qualityUnlockText = materialQuality === 'refined'
            ? 'построить Плавильню в Медном руднике'
            : materialQuality === 'masterwork' ? 'построить Плавильню и Караван-сарай' : '';
        return {
            materialQuality, materialLabel: material.label, effort, effortLabel: time.label,
            effortDays: time.days, craftLevel: state.player.craftLevel, qualityScore,
            odds: { ...odds }, cost: { ...cost }, availableMaterialQualities,
            materialQualityUnlocked, qualityUnlockText,
            affordable: materialQualityUnlocked && Object.keys(cost).every(key => state.player.resources[key] >= cost[key]),
            modelByRarity: { ordinary: 'gpt-6-luna', uncommon: 'glm-5.2', rare: 'glm-5.2' }
        };
    }

    function beginCardCraft(input, investment = {}, roll = Math.random(), advisorOrder = 'Военный советник') {
        const state = normalizeState(input);
        const orderError = canOrder(state, 'craft');
        if (orderError) return { state, error: orderError };
        if (!state.player.onboardingComplete) return { state, error: 'Сначала создай народ в кампании.' };
        if (state.player.craftOrders.some(order => ['generating', 'working'].includes(order.status))) {
            return { state, error: 'Кузница занята. Дождись завершения текущего заказа.' };
        }
        const quote = cardCraftQuote(state, investment);
        if (state.day + quote.effortDays > SEASON_LENGTH) return { state, error: 'До конца сезона не хватит дней на выбранное время ковки.' };
        if (!quote.materialQualityUnlocked) return { state, error: 'Для этого сырья нужно ' + quote.qualityUnlockText + '.' };
        if (!quote.affordable) return { state, error: 'Не хватает ресурсов для выбранного сырья и усилий.' };
        const probability = Number(roll);
        const safeRoll = Number.isFinite(probability) ? Math.max(0, Math.min(0.999999999, probability)) : Math.random();
        const rarity = safeRoll < quote.odds.ordinary / 100 ? 'ordinary'
            : safeRoll < (quote.odds.ordinary + quote.odds.uncommon) / 100 ? 'uncommon' : 'rare';
        const orderId = 'craft-' + state.season + '-' + state.player.nextCraftOrderId++;
        spend(state, quote.cost);
        markDailyOrderUsed(state, 'craft');
        const order = {
            id: orderId, status: 'generating', rarity,
            modelId: quote.modelByRarity[rarity], materialQuality: quote.materialQuality,
            effort: quote.effort, qualityScore: quote.qualityScore, odds: quote.odds,
            roll: safeRoll, effortDays: quote.effortDays, remainingDays: quote.effortDays,
            createdDay: state.day, completedDay: null, claimedDay: null,
            advisorOrder: String(advisorOrder || 'Заказ советнику').slice(0, 120), name: '',
            failure: '', cost: quote.cost, card: null
        };
        state.player.craftOrders.push(order);
        return { state, order: clone(order), quote, error: null };
    }

    function completeCardCraft(input, orderId, rawCard) {
        const state = normalizeState(input);
        const order = state.player.craftOrders.find(item => item.id === orderId);
        if (!order || order.status !== 'generating') return { state, error: 'Заказ кузницы не найден или уже завершён.' };
        if (!rawCard || typeof rawCard !== 'object' || Array.isArray(rawCard)) return { state, error: 'Модель не вернула объект карты.' };
        const card = clone(rawCard);
        card.rarity = order.rarity;
        card.craftOrderId = order.id;
        card.generationModel = order.modelId;
        card.crafting = {
            materialQuality: order.materialQuality, effort: order.effort,
            qualityScore: order.qualityScore, odds: { ...order.odds }, cost: { ...order.cost }
        };
        order.card = card;
        order.name = String(card.name || 'Безымянная карта').slice(0, 80);
        order.status = order.effortDays > 0 ? 'working' : 'ready';
        order.remainingDays = order.effortDays;
        order.completedDay = order.status === 'ready' ? state.day : null;
        return { state, order: clone(order), card: clone(card), error: null };
    }

    function failCardCraft(input, orderId, reason = 'Не удалось получить корректную карту.') {
        const state = normalizeState(input);
        const order = state.player.craftOrders.find(item => item.id === orderId);
        if (!order || order.status !== 'generating') return { state, error: 'Нельзя вернуть оплату: заказ не ожидает ответа модели.' };
        for (const key of Object.keys(order.cost)) state.player.resources[key] = Math.min(999, state.player.resources[key] + order.cost[key]);
        if (state.day === order.createdDay) clearDailyOrder(state, 'craft');
        order.status = 'failed';
        order.failure = String(reason || 'Не удалось получить корректную карту.').slice(0, 240);
        order.card = null;
        return { state, order: clone(order), error: null };
    }

    function claimCardCraft(input, orderId) {
        const state = normalizeState(input);
        const order = state.player.craftOrders.find(item => item.id === orderId);
        if (!order || order.status !== 'ready' || !order.card) return { state, error: 'Карта ещё не готова к получению.' };
        const card = clone(order.card);
        order.status = 'claimed';
        order.claimedDay = state.day;
        order.card = null;
        if (state.player.craftLevel < 2) {
            state.player.craftXp += 1;
            if (state.player.craftXp >= 3) {
                state.player.craftLevel += 1;
                state.player.craftXp -= 3;
            }
        }
        return { state, card, order: clone(order), error: null };
    }

    function normalizeBlueprint(raw, state, visibility) {
        if (!raw || typeof raw !== 'object') return null;
        const effects = cleanEffects(raw.effects);
        if (!effects || !raw.scienceName || !raw.buildingName || !raw.scienceDescription || !raw.buildingDescription) return null;
        return {
            id: 'blueprint-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
            scienceName: String(raw.scienceName).trim().slice(0, 80),
            scienceDescription: String(raw.scienceDescription).trim().slice(0, 400),
            buildingName: String(raw.buildingName).trim().slice(0, 80),
            buildingDescription: String(raw.buildingDescription).trim().slice(0, 400),
            category: CATEGORIES.includes(raw.category) ? raw.category : 'civic',
            effects,
            researched: false,
            researchedDay: null,
            built: false,
            builtDay: null,
            visibility: ['allies', 'neighbors', 'both'].includes(visibility) ? visibility : 'both',
            createdDay: state.day
        };
    }

    function addBlueprint(input, raw, visibility) {
        const state = normalizeState(input);
        if (state.player.blueprints.length >= 30) return { state, error: 'В сезонном кодексе уже 30 проектов.' };
        const blueprint = normalizeBlueprint(raw, state, visibility);
        if (!blueprint) return { state, error: 'Наука, здание или эффект не прошли проверку схемы.' };
        state.player.blueprints.unshift(blueprint);
        return { state, blueprint, error: null };
    }

    function researchBlueprint(input, id) {
        const state = normalizeState(input);
        const orderError = canOrder(state, 'research');
        if (orderError) return { state, error: orderError };
        const blueprint = state.player.blueprints.find(item => item.id === id);
        if (!blueprint) return { state, error: 'Научный проект не найден.' };
        if (blueprint.researched) return { state, error: 'Наука уже исследована.' };
        if (!spend(state, { food: 1, knowledge: 1 })) return { state, error: 'Для исследования нужны 1 провизия и 1 знание.' };
        blueprint.researched = true;
        blueprint.researchedDay = state.day;
        markDailyOrderUsed(state, 'research');
        state.player.research += 1;
        if (state.player.research >= 2 && state.player.era < ERAS.length - 1) {
            state.player.research = 0;
            state.player.era += 1;
        }
        return { state, blueprint, error: null };
    }

    function constructBlueprint(input, id) {
        const state = normalizeState(input);
        const orderError = canOrder(state, 'construction');
        if (orderError) return { state, error: orderError };
        const blueprint = state.player.blueprints.find(item => item.id === id);
        if (!blueprint || !blueprint.researched) return { state, error: 'Сначала исследуй эту науку.' };
        if (blueprint.built) return { state, error: 'Здание по этому чертежу уже построено.' };
        if (state.player.buildings.length >= 30) return { state, error: 'В поселении уже 30 зданий.' };
        if (!spend(state, { materials: 3 })) return { state, error: 'Для строительства нужны 3 материала.' };
        const hasSlot = state.player.buildings.filter(building => building.active).length < state.player.activeBuildingSlots;
        state.player.buildings.push({
            id: 'building-' + blueprint.id, name: blueprint.buildingName, description: blueprint.buildingDescription,
            category: blueprint.category, effects: clone(blueprint.effects), active: hasSlot, builtDay: state.day, blueprintId: blueprint.id, regionId: null
        });
        blueprint.built = true;
        blueprint.builtDay = state.day;
        markDailyOrderUsed(state, 'construction');
        return { state, error: null };
    }

    function toggleBuilding(input, id) {
        const state = normalizeState(input);
        const building = state.player.buildings.find(item => item.id === id);
        if (!building) return { state, error: 'Здание не найдено.' };
        if (building.active) building.active = false;
        else {
            const count = state.player.buildings.filter(item => item.active).length;
            if (count >= state.player.activeBuildingSlots) return { state, error: 'Доступно только ' + state.player.activeBuildingSlots + ' активных слота. Сначала отключи другое здание.' };
            building.active = true;
        }
        const newLimit = getBattleConfig(state).deckLimit;
        state.player.deckCardIds = state.player.deckCardIds.slice(0, newLimit);
        return { state, error: null };
    }

    function toggleDeckCard(input, cardId) {
        const state = normalizeState(input);
        const ids = state.player.deckCardIds;
        if (ids.includes(cardId)) state.player.deckCardIds = ids.filter(id => id !== cardId);
        else {
            const limit = getBattleConfig(state).deckLimit;
            if (ids.length >= limit) return { state, error: 'Текущие здания дают лимит колоды ' + limit + '.' };
            state.player.deckCardIds = [...ids, cardId];
        }
        return { state, error: null };
    }

    function assignWorker(input, from, to) {
        const state = normalizeState(input);
        const valid = ['food', 'materials', 'knowledge', 'idle'];
        if (!valid.includes(from) || !valid.includes(to)) return { state, error: 'Неверный тип рабочих.' };
        if (from === to) return { state, error: null };
        if (state.player.workers[from] <= 0) return { state, error: 'Нет свободных рабочих в ' + from + '.' };
        state.player.workers[from] -= 1;
        state.player.workers[to] += 1;
        return { state, error: null };
    }

    function finishDay(input) {
        const state = normalizeState(input);
        if (state.day >= SEASON_LENGTH) return { state, error: 'Это последний день сезона. Подведи итоги.' };
        if (state.player.pendingExpedition) return { state, error: 'Заверши бой экспедиции до смены дня.' };
        if (state.player.craftOrders.some(order => order.status === 'generating')) return { state, error: 'Дождись ответа кузницы: незавершённый сетевой запрос нельзя проскочить сменой дня.' };

        const breakdown = getProductionBreakdown(state);
        const regionalIncome = getRegionalIncome(state);
        const storageCap = getStorageCap(state);

        let foodGained = breakdown.workerProduction.food + regionalIncome.food;
        let materialsGained = breakdown.workerProduction.materials + regionalIncome.materials;
        let knowledgeGained = breakdown.workerProduction.knowledge + regionalIncome.knowledge;

        const consumption = breakdown.consumption;
        const upkeep = breakdown.upkeep;

        let newFood = state.player.resources.food + foodGained - consumption;
        let newMaterials = state.player.resources.materials + materialsGained - upkeep;
        let newKnowledge = state.player.resources.knowledge + knowledgeGained;

        let starvation = false;
        let popLoss = 0;
        if (newFood < 0) {
            starvation = true;
            const deficit = Math.abs(newFood);
            popLoss = Math.max(1, Math.floor(deficit / 3));
            if (state.player.population - popLoss < POP_MIN) popLoss = state.player.population - POP_MIN;
            newFood = 0;
        }

        if (newMaterials < 0) {
            const activeBuildings = state.player.buildings.filter(b => b.active);
            if (activeBuildings.length > 0) {
                const toDisable = activeBuildings[activeBuildings.length - 1];
                toDisable.active = false;
                state.player.campaignNotice = 'Не хватает 🪵 на upkeep. Здание «' + toDisable.name + '» отключено.';
                newMaterials = Math.max(0, newMaterials);
            } else {
                newMaterials = 0;
            }
        }

        if (newFood > storageCap) {
            const excess = newFood - storageCap;
            newFood = storageCap + excess * 0.5;
        }
        if (newMaterials > storageCap) {
            const excess = newMaterials - storageCap;
            newMaterials = storageCap + excess * 0.5;
        }
        if (newKnowledge > storageCap) {
            const excess = newKnowledge - storageCap;
            newKnowledge = storageCap + excess * 0.5;
        }

        state.player.resources.food = Math.min(999, Math.max(0, Math.floor(newFood)));
        state.player.resources.materials = Math.min(999, Math.max(0, Math.floor(newMaterials)));
        state.player.resources.knowledge = Math.min(999, Math.max(0, Math.floor(newKnowledge)));

        if (starvation) {
            state.player.population -= popLoss;
            state.player.workers = normalizeWorkers(state.player.workers, state.player.population);
            state.player.starvationDays += 1;
            state.player.growthDebt += 10;
            state.player.growthProgress = Math.max(0, state.player.growthProgress - 2);
            state.player.campaignNotice = 'Голод! Потеряно ' + popLoss + ' чел. Еды не хватило на ' + consumption.toFixed(1) + '🌾. Назначь больше людей на еду или построй ирригацию.';
        } else {
            const netFood = foodGained - consumption;
            if (state.player.resources.food > 10 && state.player.population < POP_MAX && netFood > 2) {
                const pseudoRandom = (state.day * 7 + state.player.population * 13 + state.season * 3) % 100;
                const chance = state.player.growthDebt > 0 ? 15 : 35;
                if (pseudoRandom < chance) {
                    state.player.population += 1;
                    state.player.workers.idle += 1;
                    state.player.growthProgress = 0;
                    state.player.growthDebt = Math.max(0, state.player.growthDebt - 5);
                    if (!state.player.campaignNotice) state.player.campaignNotice = 'Население выросло! Теперь ' + state.player.population + ' чел. Назначь нового работника.';
                } else {
                    state.player.growthProgress += 1;
                }
            }
            if (state.player.growthDebt > 0) state.player.growthDebt = Math.max(0, state.player.growthDebt - 1);
        }

        for (const order of state.player.craftOrders) {
            if (order.status !== 'working') continue;
            order.remainingDays = Math.max(0, order.remainingDays - 1);
            if (order.remainingDays === 0) {
                order.status = 'ready';
                order.completedDay = state.day + 1;
            }
        }
        for (const opponent of state.opponents) {
            if ((state.day + opponent.offset) % opponent.pace === 0 && opponent.era < ERAS.length - 1) {
                opponent.research += 1;
                if (opponent.research >= 2) { opponent.research = 0; opponent.era += 1; }
            }
        }
        state.day += 1;
        state.player.ap = state.player.apMax;
        state.player.dailyOrders = createDailyOrders();
        state.player.storageCap = getStorageCap(state);
        syncLegacyActionUsed(state);
        return { state, error: null, breakdown, starvation, popLoss };
    }

    function recordPractice(input, opponentId, win, leaderBattle) {
        const state = normalizeState(input);
        if (!state.opponents.some(item => item.id === opponentId)) return { state, error: 'Соперник не найден.' };
        const key = leaderBattle ? (win ? 'leaderWins' : 'leaderLosses') : (win ? 'wins' : 'losses');
        state.player.practice[key] += 1;
        return { state, error: null };
    }

    function completeSeason(input) {
        const state = normalizeState(input);
        if (state.day < SEASON_LENGTH) return { state, error: 'Сезон ещё не завершён.' };
        if (state.player.pendingExpedition) return { state, error: 'Сначала заверши бой экспедиции.' };
        if (state.player.craftOrders.some(order => ['generating', 'working', 'ready'].includes(order.status))) {
            return { state, error: 'Сначала заверши очередь кузницы и забери готовые карты.' };
        }
        const medal = { id: 'season-' + state.season + '-' + Date.now(), season: state.season, name: 'Сезон ' + state.season + ': ' + ERAS[state.player.era], description: 'Наивысшая эпоха: ' + ERAS[state.player.era] + '. Население: ' + state.player.population + '.' };
        const fresh = createState();
        fresh.season = state.season + 1;
        fresh.player.onboardingComplete = true;
        fresh.player.deckCardIds = STARTER_CARDS.map(card => card.id);
        fresh.player.craftLevel = state.player.craftLevel;
        fresh.player.craftXp = state.player.craftXp;
        fresh.player.population = Math.max(POP_START, Math.min(POP_MAX, state.player.population));
        fresh.player.workers = normalizeWorkers(null, fresh.player.population);
        fresh.medals = [...state.medals, medal];
        return { state: fresh, medal, error: null };
    }

    function recoverInterruptedCardCrafts(input) {
        const state = normalizeState(input);
        let recovered = false;
        for (const order of state.player.craftOrders) {
            if (order.status !== 'generating') continue;
            for (const key of Object.keys(order.cost)) state.player.resources[key] = Math.min(999, state.player.resources[key] + order.cost[key]);
            if (state.day === order.createdDay) clearDailyOrder(state, 'craft');
            order.status = 'failed';
            order.failure = 'Запрос прерван перезагрузкой страницы; оплата возвращена.';
            order.card = null;
            recovered = true;
        }
        return { state, recovered };
    }
    function save(value) { try { root.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(value))); return true; } catch (_) { return false; } }
    function load() {
        try {
            const raw = JSON.parse(root.localStorage.getItem(STORAGE_KEY) || 'null');
            if (raw && raw.version === 2) {
                try {
                    const oldRaw = JSON.parse(root.localStorage.getItem('iforge_campaign_v2') || 'null');
                    if (oldRaw) {
                        const migrated = normalizeState(oldRaw);
                        save(migrated);
                        return migrated;
                    }
                } catch (_) {}
            }
            const craftRecovery = recoverInterruptedCardCrafts(raw);
            const expeditionRecovery = recoverInterruptedExpedition(craftRecovery.state);
            if (craftRecovery.recovered || expeditionRecovery.recovered) save(expeditionRecovery.state);
            return expeditionRecovery.state;
        } catch (_) { return createState(); }
    }
    function escapeHtml(value) {
        return String(value).replace(/[&<>\"']/g, function(ch) {
            if (ch === '&') return '&amp;';
            if (ch === '<') return '&lt;';
            if (ch === '>') return '&gt;';
            if (ch === '"') return '&quot;';
            return '&#39;';
        });
    }
    function htmlAttr(value) { return escapeHtml(String(value)).replace(/`/g, '&#96;'); }

    let state = root.localStorage ? load() : createState();
    let pendingMatch = null;
    let lastMatch = null;
    function commit(next) { state = normalizeState(next); state.player.campaignNotice = ''; save(state); render(); if (typeof root.refreshForgeUi === 'function') root.refreshForgeUi(); }
    function eraName(index) { return ERAS[Math.max(0, Math.min(ERAS.length - 1, index))]; }
    function getCardChoices() { return typeof root.getCampaignCardChoices === 'function' ? root.getCampaignCardChoices() : []; }
    function alertResult(result) { if (result.error) { root.alert(result.error); return false; } commit(result.state); return true; }

    function renderRegionMap() {
        const income = getRegionalIncome(state);
        const ownedCount = state.regions.filter(region => region.ownerId === 'player').length;
        const qualities = getAvailableMaterialQualities(state);
        const breakdown = getProductionBreakdown(state);
        const edgeKeys = new Set();
        const connectors = [];
        for (const region of REGION_DEFINITIONS) for (const neighborId of region.neighbors) {
            const key = [region.id, neighborId].sort().join('|');
            if (edgeKeys.has(key)) continue;
            edgeKeys.add(key);
            const neighbor = REGION_DEFINITIONS.find(item => item.id === neighborId);
            if (!neighbor) continue;
            const ownedA = getRegionRecord(state, region.id)?.ownerId === 'player';
            const ownedB = getRegionRecord(state, neighbor.id)?.ownerId === 'player';
            const color = ownedA && ownedB ? '#74c996' : ownedA || ownedB ? '#d9ae6e' : '#75677f';
            const x1 = 98.4 + (region.col - 1) * 200.8;
            const x2 = 98.4 + (neighbor.col - 1) * 200.8;
            const y1 = 62 + (region.row - 1) * 128;
            const y2 = 62 + (neighbor.row - 1) * 128;
            connectors.push('<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="3" stroke-opacity=".62" stroke-dasharray="' + (ownedA && ownedB ? '0' : '8 7') + '"/>');
        }
        const nodes = REGION_DEFINITIONS.map(definition => {
            const record = getRegionRecord(state, definition.id);
            const action = getRegionActionState(state, definition.id);
            const owner = record.ownerId === 'player' ? 'Ваш регион'
                : record.ownerId === null ? 'Свободно'
                    : state.opponents.find(opponent => opponent.id === record.ownerId)?.clan || 'Соперник';
            let yieldText = '—';
            if (record.ownerId === 'player') {
                if (record.building) {
                    const rb = REGION_BUILDINGS[definition.id];
                    if (rb) yieldText = Object.entries(rb.yields).filter(function(e){return e[1]>0;}).map(function(e){return (e[0]==='food'?'🌾':e[0]==='materials'?'🪵':'📚')+' +'+e[1];}).join(' · ') || 'построено';
                } else {
                    yieldText = REGION_BUILDINGS[definition.id] ? 'Пусто · построй ' + REGION_BUILDINGS[definition.id].name : '—';
                }
            } else {
                yieldText = REGION_BUILDINGS[definition.id] ? 'Даст ' + Object.entries(REGION_BUILDINGS[definition.id].yields).filter(function(e){return e[1]>0;}).map(function(e){return (e[0]==='food'?'🌾':e[0]==='materials'?'🪵':'📚')+' +'+e[1];}).join(' · ') : '—';
            }
            let actionMarkup = '';
            if (action.action === 'owned') actionMarkup = '<span class="campaign-region-owned" aria-label="Регион под контролем">✓ ' + escapeHtml(record.building || '') + '</span>';
            else if (action.action === 'resume' || action.action === 'return') actionMarkup = '<button class="campaign-btn campaign-btn-gold campaign-region-action" title="' + htmlAttr(action.reason) + '" aria-label="' + htmlAttr(action.reason) + '" onclick="CampaignMvp.resumeRegionExpedition()">' + (action.action === 'return' ? 'К бою →' : 'Начать бой →') + '</button>';
            else if (action.action === 'build') {
                const label = action.enabled ? 'Построить · ' + Object.entries(action.cost).map(function(e){return e[1]+(e[0]==='food'?'🌾':e[0]==='materials'?'🪵':'📚');}).join(' ') : 'Построить';
                const accessibleLabel = action.enabled ? label : label + '. ' + action.reason;
                actionMarkup = '<button class="campaign-btn campaign-btn-secondary campaign-region-action" ' + (action.enabled ? '' : 'disabled') + ' title="' + htmlAttr(action.reason) + '" aria-label="' + htmlAttr(accessibleLabel) + '" onclick="CampaignMvp.buildRegionBuilding(\'' + htmlAttr(definition.id) + '\')">' + label + '</button>';
            } else {
                const isSettle = action.action === 'settle';
                const label = action.enabled
                    ? (isSettle ? 'Занять · 2🌾 2🪵' : 'В поход · 4🌾 2🪵')
                    : (isSettle ? 'Занять' : 'В поход');
                const handler = isSettle ? 'claimRegion' : 'attackRegion';
                const accessibleLabel = action.enabled ? label : label + '. ' + action.reason;
                actionMarkup = '<button class="campaign-btn ' + (isSettle ? 'campaign-btn-secondary' : 'campaign-btn-challenge') + ' campaign-region-action" ' + (action.enabled ? '' : 'disabled') + ' title="' + htmlAttr(action.reason) + '" aria-label="' + htmlAttr(accessibleLabel) + '" onclick="CampaignMvp.' + handler + '(\'' + htmlAttr(definition.id) + '\')">' + label + '</button>';
            }
            const ownerClass = record.ownerId === 'player' ? 'is-owned' : record.ownerId === null ? 'is-neutral' : 'is-rival';
            const eraTag = definition.minEra > state.player.era ? '<small class="campaign-region-era">' + escapeHtml(eraName(definition.minEra)) + '+</small>' : '';
            const detail = definition.description + (action.reason ? ' · ' + action.reason : '');
            return '<article class="campaign-region-node ' + ownerClass + ' ' + (definition.kind === 'home' ? 'is-home' : '') + '" style="grid-column:' + definition.col + ';grid-row:' + definition.row + '" title="' + htmlAttr(detail) + '"><div class="campaign-region-top"><span>' + definition.icon + '</span>' + eraTag + '</div><b>' + escapeHtml(definition.name) + '</b><small class="campaign-region-owner">' + escapeHtml(owner) + '</small><small class="campaign-region-yield">' + escapeHtml(yieldText) + '</small>' + actionMarkup + '</article>';
        }).join('');
        const materialAccess = qualities.includes('masterwork') ? 'Мастерское сырьё'
            : qualities.includes('refined') ? 'Отборное сырьё'
                : 'Базовое сырьё · плавильня откроет отборное';
        return '<section id="campaign-world" class="campaign-panel campaign-world"><div class="campaign-panel-heading"><h2>🗺️ Земли</h2><span class="campaign-day-badge">' + ownedCount + '/' + REGION_DEFINITIONS.length + ' земель · AP ' + state.player.ap + '/' + state.player.apMax + '</span></div><div class="campaign-world-summary"><span>🌾 +' + income.food.toFixed(1) + ' · 🪵 +' + income.materials.toFixed(1) + ' · 📚 +' + income.knowledge.toFixed(1) + ' / день от построек · 👥 ' + state.player.population + ' чел · 🍞 -' + breakdown.consumption.toFixed(1) + '/д</span><b>' + materialAccess + '</b></div>' + (state.player.campaignNotice ? '<div class="campaign-region-notice" role="status">' + escapeHtml(state.player.campaignNotice) + '</div>' : '') + '<div class="campaign-world-scroll"><div class="campaign-world-board"><svg class="campaign-world-links" viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true">' + connectors.join('') + '</svg>' + nodes + '</div></div><div class="campaign-world-legend"><span><i class="is-owned"></i> ваше</span><span><i class="is-neutral"></i> свободно</span><span><i class="is-rival"></i> соперник</span><span>· пустой регион = 0 дохода</span></div></section>';
    }

    function renderDailyOrdersPanel(current) {
        const player = current.player;
        const hasResearch = player.blueprints.some(blueprint => !blueprint.researched);
        const hasConstruction = player.blueprints.some(blueprint => blueprint.researched && !blueprint.built);
        const craftQueueBusy = player.craftOrders.some(order => ['generating', 'working'].includes(order.status));
        const blocked = player.dailyOrders.legacyBlocked;
        const ap = player.ap;
        const slot = function(icon, label, href, used, unavailable, detail) {
            const status = blocked ? 'Завтра' : used ? 'Готово' : unavailable ? 'Нет цели' : ap <= 0 ? 'Нет AP' : 'Доступно';
            const style = used || blocked ? 'is-used' : unavailable || ap <= 0 ? 'is-blocked' : 'is-ready';
            const title = blocked ? 'Старый приказ: лимиты восстановятся после смены дня.' : detail;
            return '<a class="campaign-day-action ' + style + '" href="' + href + '" title="' + htmlAttr(title) + '"><span>' + icon + '</span><b>' + label + '</b><small>' + status + '</small></a>';
        };
        const craftStatus = blocked ? 'Завтра' : player.dailyOrders.craftUsed ? 'Готово' : craftQueueBusy ? 'Очередь' : ap <= 0 ? 'Нет AP' : 'Доступно';
        const craftClass = player.dailyOrders.craftUsed || blocked ? 'is-used' : craftQueueBusy || ap <= 0 ? 'is-blocked' : 'is-ready';
        const craft = '<button class="campaign-day-action ' + craftClass + '" type="button" onclick="switchScreen(\'forge\')" title="' + (craftQueueBusy ? 'Дождись завершения текущей ковки.' : 'Перейти в кузницу. Стоит 1 AP.') + '"><span>⚒️</span><b>Ковка</b><small>' + craftStatus + '</small></button>';
        return '<nav class="campaign-daily-strip" aria-label="Дневные возможности"><div class="campaign-ap-display">AP: ' + ap + '/' + player.apMax + '</div>' + craft + slot('🔬', 'Наука', '#campaign-development', player.dailyOrders.researchUsed, !hasResearch, 'Исследование стоит 1 AP.') + slot('🏗️', 'Стройка', '#campaign-development', player.dailyOrders.constructionUsed, !hasConstruction, 'Построить изученный чертёж или здание в регионе. Стоит 1 AP.') + slot('🗺️', 'Фронтир', '#campaign-world', player.dailyOrders.frontierUsed, false, 'Одно заселение или экспедиция за день. Стоит 1 AP.') + '</nav>';
    }

    function renderBlueprintOrder(blueprint, player, readyToClose) {
        const actionType = blueprint.researched ? 'construction' : 'research';
        const used = actionType === 'construction' ? player.dailyOrders.constructionUsed : player.dailyOrders.researchUsed;
        const disabled = player.dailyOrders.legacyBlocked || used || readyToClose || player.ap <= 0;
        const buttonText = blueprint.researched
            ? (used ? 'Готово сегодня' : 'Построить · 4🪵')
            : (used ? 'Готово сегодня' : 'Исследовать');
        const detail = blueprint.scienceDescription + ' ' + blueprint.buildingDescription;
        const effects = blueprint.effects.map(effect => EFFECTS[effect.type]?.label || effect.type).join(' · ');
        return '<article class="campaign-order campaign-blueprint-order"><div class="campaign-order-icon">' + (blueprint.researched ? '📐' : '🔬') + '</div><div class="campaign-order-main"><b title="' + htmlAttr(detail) + '">' + escapeHtml(blueprint.scienceName) + ' → ' + escapeHtml(blueprint.buildingName) + '</b><small>' + escapeHtml(effects) + '</small></div><button class="campaign-btn ' + (blueprint.researched ? 'campaign-btn-secondary' : '') + '" ' + (disabled ? 'disabled' : '') + ' onclick="CampaignMvp.' + (blueprint.researched ? 'construct' : 'research') + '(\'' + htmlAttr(blueprint.id) + '\')">' + buttonText + '</button></article>';
    }

    function renderWorkersPanel(current) {
        const w = current.player.workers;
        const pop = current.player.population;
        const breakdown = getProductionBreakdown(current);
        return '<section class="campaign-panel campaign-workers"><div class="campaign-panel-heading"><h2>👥 Люди: ' + pop + '/' + POP_MAX + '</h2><span class="campaign-muted">Едят ' + breakdown.consumption.toFixed(1) + '🌾/д</span></div><div class="campaign-workers-grid">'
            + '<div class="campaign-worker-row"><span>🌾 Еда: ' + w.food + ' → +' + breakdown.workerProduction.food.toFixed(1) + '</span><span><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'food\',\'idle\')">-</button><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'idle\',\'food\')">+</button></span></div>'
            + '<div class="campaign-worker-row"><span>🪵 Материалы: ' + w.materials + ' → +' + breakdown.workerProduction.materials.toFixed(1) + '</span><span><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'materials\',\'idle\')">-</button><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'idle\',\'materials\')">+</button></span></div>'
            + '<div class="campaign-worker-row"><span>📚 Знания: ' + w.knowledge + ' → +' + breakdown.workerProduction.knowledge.toFixed(1) + '</span><span><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'knowledge\',\'idle\')">-</button><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'idle\',\'knowledge\')">+</button></span></div>'
            + '<div class="campaign-worker-row"><span>💤 Свободны: ' + w.idle + '</span><span>бонусы: 🌾+' + breakdown.workerBonus.food.toFixed(1) + ' 🪵+' + breakdown.workerBonus.materials.toFixed(1) + ' 📚+' + breakdown.workerBonus.knowledge.toFixed(1) + '</span></div>'
            + '</div><small class="campaign-fold-note">Здания дают бонус к каждому рабочему. Без рабочих — нет базового дохода. Голод: -1 чел за каждые 3🌾 дефицита.</small></section>';
    }

    function renderCraftQueue(orders) {
        if (!orders.length) return '';
        return '<section class="campaign-queue-active" aria-label="Очередь кузницы"><b>⚒️ Ковка</b>' + orders.map(order => {
            const status = order.status === 'generating' ? 'Кузнец создаёт карту' : order.status === 'working' ? 'Осталось ' + order.remainingDays + ' дн.' : 'Готова';
            const rarity = order.rarity === 'rare' ? 'Редкая' : order.rarity === 'uncommon' ? 'Необычная' : 'Обычная';
            return '<article class="campaign-queue-item"><span>' + (order.rarity === 'rare' ? '💎' : order.rarity === 'uncommon' ? '✨' : '⚒️') + '</span><b>' + escapeHtml(order.name || order.advisorOrder) + '</b><small>' + rarity + ' · ' + status + '</small>' + (order.status === 'ready' ? '<button class="campaign-btn campaign-btn-gold" onclick="claimCraftedCard(\'' + htmlAttr(order.id) + '\')">Забрать</button>' : '') + '</article>';
        }).join('') + '</section>';
    }

    function render() {
        const host = root.document && root.document.getElementById('campaign-root');
        if (!host) return;
        const openDetails = new Set(Array.from(host.querySelectorAll?.('details[data-campaign-key][open]') || []).map(detail => detail.dataset.campaignKey));
        if (!state.player.onboardingComplete) {
            renderOnboarding(host);
            return;
        }
        const p = state.player;
        const config = getBattleConfig(state);
        const regionalIncome = getRegionalIncome(state);
        const scienceSituation = scienceAdvisorSituation(state);
        const breakdown = getProductionBreakdown(state);
        const activeBuildings = p.buildings.filter(building => building.active);
        const choices = getCardChoices();
        const selectedCards = p.deckCardIds.map(id => choices.find(card => card.id === id)).filter(Boolean);
        const activeBlueprints = p.blueprints.filter(blueprint => !blueprint.built);
        const activeCraftOrders = p.craftOrders.filter(order => ['generating', 'working', 'ready'].includes(order.status));
        const generatingCraft = p.craftOrders.some(order => order.status === 'generating');
        const craftBlocksSeason = activeCraftOrders.length > 0 || Boolean(p.pendingExpedition);
        const readyToClose = state.day >= SEASON_LENGTH;
        const guide = getFirstSessionGuide(state);
        const firstSessionGuide = guide && !guide.complete ? guide : null;
        const eraProgress = p.era === ERAS.length - 1 ? 100 : p.research * 50;
        const dayBlockReason = p.pendingExpedition ? 'Сначала заверши экспедицию.' : generatingCraft ? 'Дождись ответа кузницы.' : readyToClose && activeCraftOrders.length ? 'Заверши ковку и забери готовые карты.' : '';
        const developmentButton = readyToClose
            ? '<button class="campaign-btn campaign-btn-gold" ' + (craftBlocksSeason ? 'disabled' : '') + ' title="' + htmlAttr(dayBlockReason) + '" onclick="CampaignMvp.completeSeason()">Подвести итоги</button>'
            : '<button class="campaign-btn campaign-btn-gold" ' + (generatingCraft || p.pendingExpedition ? 'disabled' : '') + ' title="' + htmlAttr(dayBlockReason) + '" onclick="CampaignMvp.finishDay()">Завершить день →</button>';
        const buildingRows = p.buildings.map(building => {
            const blueprint = p.blueprints.find(item => item.id === building.blueprintId);
            const effects = (building.effects || []).map(effect => EFFECTS[effect.type]?.label || effect.type).join(' · ');
            return '<article class="campaign-order campaign-building-row"><div class="campaign-order-icon">' + (building.category === 'military' ? '⚔️' : building.category === 'economy' ? '🌾' : building.category === 'science' ? '📚' : '🏛️') + '</div><div class="campaign-order-main"><b title="' + htmlAttr(blueprint?.scienceName || building.description || '') + '">' + escapeHtml(building.name) + '</b><small>' + escapeHtml(effects) + (building.regionId ? ' · в регионе' : '') + '</small></div><button class="campaign-btn ' + (building.active ? 'campaign-btn-secondary' : '') + '" onclick="CampaignMvp.toggleBuilding(\'' + htmlAttr(building.id) + '\')">' + (building.active ? 'Выключить' : 'Включить') + '</button></article>';
        }).join('');
        const opponentRows = state.opponents.map(opponent => '<article class="campaign-opponent"><div class="campaign-opponent-top"><span class="campaign-opponent-avatar">' + (opponent.leader ? '👑' : '🧭') + '</span><div><b>' + escapeHtml(opponent.name) + '</b><small>' + escapeHtml(opponent.clan) + '</small></div><span class="campaign-opponent-rating">Э' + (opponent.era + 1) + '</span></div><button class="campaign-btn campaign-btn-challenge" ' + (p.pendingExpedition ? 'disabled' : '') + ' onclick="CampaignMvp.challenge(\'' + htmlAttr(opponent.id) + '\', ' + (opponent.leader ? 'true' : 'false') + ')">' + (p.pendingExpedition ? 'Сначала заверши экспедицию' : 'Тренировка') + '</button></article>').join('');
        const deckCards = choices.length ? choices.map(card => {
            const selected = p.deckCardIds.includes(card.id);
            return '<button type="button" class="campaign-project-card campaign-card-choice ' + (selected ? 'is-selected' : '') + '" onclick="CampaignMvp.toggleDeckCard(\'' + htmlAttr(card.id) + '\')"><span>' + (selected ? '✓ В колоде' : 'Добавить') + ' · ' + escapeHtml(card.card_type || 'карта') + '</span><b>' + escapeHtml(card.name || 'Без названия') + '</b><small>' + (Number(card.drop_cost) || 0) + ' энергии · атака ' + (Number(card.action_cost) || 0) + '</small></button>';
        }).join('') : '<div class="campaign-project-empty">Коллекция пока пуста. Для тренировки доступна стартовая колода.</div>';

        host.innerHTML = '\n          ' + (firstSessionGuide ? '<details class="campaign-first-session" data-campaign-key="first-steps"><summary><span>Первые шаги</span><b>' + firstSessionGuide.completedCount + '/' + firstSessionGuide.steps.length + '</b></summary><div class="campaign-first-session-body"><ol>' + firstSessionGuide.steps.map((step, index) => '<li class="' + (step.done ? 'is-done' : index === firstSessionGuide.completedCount ? 'is-current' : '') + '"><span>' + (step.done ? '✓' : index + 1) + '</span><b>' + escapeHtml(step.label) + '</b></li>').join('') + '</ol><div class="campaign-first-session-next"><small>ДАЛЬШЕ</small><b>' + escapeHtml(firstSessionGuide.next) + '</b></div></div></details>' : '') + '\n          <section class="campaign-seasonbar campaign-seasonbar-compact"><div class="campaign-seasonbar-copy"><span class="campaign-kicker">СЕЗОН ' + state.season + ' · ДЕНЬ ' + state.day + '/' + SEASON_LENGTH + '</span><div class="campaign-seasonbar-name"><b>' + escapeHtml(p.name) + '</b><span>· ' + escapeHtml(eraName(p.era)) + '</span></div><div class="campaign-mini-progress" title="Научный прогресс эпохи" aria-label="Научный прогресс эпохи"><span style="width:' + eraProgress + '%"></span></div>' + (dayBlockReason ? '<small class="campaign-day-blocker" role="status">⏳ ' + escapeHtml(dayBlockReason) + '</small>' : '') + '</div><div class="campaign-season-actions">' + developmentButton + '<details class="campaign-season-more" data-campaign-key="season-menu"><summary aria-label="Дополнительные действия">···</summary><div><span>🏅 Медалей: ' + state.medals.length + '</span><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.resetLocal()">Сбросить кампанию</button></div></details></div></section>\n          ' + renderDailyOrdersPanel(state) + '\n          ' + renderRegionMap() + '\n          ' + renderWorkersPanel(state) + '\n\n          <section id="campaign-development" class="campaign-panel campaign-development-panel"><div class="campaign-panel-heading"><div><span class="campaign-kicker">РАЗВИТИЕ</span><h2>Ресурсы и проекты</h2></div><span class="campaign-muted">' + activeBlueprints.length + ' активных · склад ' + p.storageCap + '</span></div>\n            <div class="campaign-resources"><div><span>🌾 Провизия</span><b>' + p.resources.food + '</b><small>+' + breakdown.workerProduction.food.toFixed(1) + '+' + regionalIncome.food + ' -' + breakdown.consumption.toFixed(1) + '/д</small></div><div><span>🪵 Материалы</span><b>' + p.resources.materials + '</b><small>+' + breakdown.workerProduction.materials.toFixed(1) + '+' + regionalIncome.materials + ' -' + breakdown.upkeep.toFixed(1) + '/д</small></div><div><span>📚 Знания</span><b>' + p.resources.knowledge + '</b><small>+' + breakdown.workerProduction.knowledge.toFixed(1) + '+' + regionalIncome.knowledge + '/д</small></div></div>\n            <div class="campaign-orders">' + (activeBlueprints.length ? activeBlueprints.map(blueprint => renderBlueprintOrder(blueprint, p, readyToClose)).join('') : '<div class="campaign-project-empty">Нет активного проекта. Создай следующий у советника.</div>') + '</div>\n            <form class="campaign-project-form campaign-project-form-compact" onsubmit="CampaignMvp.generateProject(event)"><label><span>Новый проект</span><select id="campaign-project-branch" aria-label="Направление науки">' + scienceBranchesForEra(p.era).map(branch => '<option value="' + branch.id + '">' + escapeHtml(branch.label) + '</option>').join('') + '</select></label><button class="campaign-btn campaign-btn-gold" type="submit" id="campaign-project-submit">+ Советник</button></form>\n            <details class="campaign-advisor-context" data-campaign-key="advisor-context"><summary>Как советует наука</summary><p>Выбирается только широкая ветвь; тему и местный контекст советник подбирает автоматически по эпохе, землям и запасам.</p><div class="campaign-advisor-situation"><b>Контекст</b><span>' + escapeHtml(scienceSituation.summary) + '</span></div></details>\n            <div id="campaign-project-status" class="campaign-project-status" role="status" aria-live="polite"></div>\n            <details class="campaign-fold campaign-buildings-fold" data-campaign-key="buildings"><summary><b>Здания · ' + p.buildings.length + '</b><small>Активно ' + activeBuildings.length + '/' + p.activeBuildingSlots + ' · upkeep ' + breakdown.upkeep.toFixed(1) + '🪵/д</small></summary><div class="campaign-fold-content campaign-orders">' + buildingRows + '</div></details>\n          </section>\n\n          ' + renderCraftQueue(activeCraftOrders) + '\n\n          <div class="campaign-secondary-grid">\n            <details class="campaign-panel campaign-fold campaign-civilization" data-campaign-key="civilization"><summary><b>📜 Эпохи и бой</b><small>' + (p.era + 1) + '/7 · колода ' + p.deckCardIds.length + '/' + config.deckLimit + '</small></summary><div class="campaign-fold-content"><div class="campaign-era-rail">' + ERAS.map((era, i) => '<div class="campaign-era-step ' + (i < p.era ? 'is-done' : '') + ' ' + (i === p.era ? 'is-current' : '') + '"><span>' + (i < p.era ? '✓' : i + 1) + '</span><small>' + escapeHtml(era) + '</small></div>').join('') + '</div><div class="campaign-practice-summary"><b>' + escapeHtml(p.name) + ' · ' + escapeHtml(p.clan) + '</b><span>' + (p.era === ERAS.length - 1 ? 'Последняя эпоха открыта' : 'Открытия эпохи: ' + p.research + '/2') + '</span><span>Здоровье ' + config.hp + ' · энергия ' + config.energyMax + ' (+' + config.energyGrowth + '/ход)</span><span>Активные здания ' + activeBuildings.length + '/' + p.activeBuildingSlots + '</span><span>Население ' + p.population + ' · рост ' + p.growthProgress + ' · голод ' + p.starvationDays + 'д</span></div></div></details>\n            <details class="campaign-panel campaign-fold campaign-opponents" data-campaign-key="opponents"><summary><b>⚔️ Тренировка с ИИ</b><small>' + state.opponents.length + ' соперника · без наград</small></summary><div class="campaign-fold-content"><div class="campaign-opponent-list">' + opponentRows + '</div></div></details>\n            <details class="campaign-panel campaign-fold campaign-codex" data-campaign-key="deck"><summary><b>🎴 Колода кампании</b><small>' + p.deckCardIds.length + '/' + config.deckLimit + '</small></summary><div class="campaign-fold-content"><p class="campaign-fold-note">Активные военные здания увеличивают лимит колоды.</p><div class="campaign-project-list">' + deckCards + '</div><p class="campaign-fold-note">Сейчас выбрано: ' + (selectedCards.map(card => escapeHtml(card.name)).join(' · ') || 'стартовая колода') + '</p></div></details>\n          </div>';
        for (const detail of host.querySelectorAll?.('details[data-campaign-key]') || []) detail.open = openDetails.has(detail.dataset.campaignKey);
    }

    function renderOnboarding(host) {
        const originCards = ORIGINS.map((origin, index) => '\n          <label class="campaign-onboarding-choice"><input type="radio" name="campaign-origin" value="' + origin.id + '" ' + (index === 0 ? 'checked' : '') + '><span class="campaign-choice-icon">' + origin.icon + '</span><span><b>' + escapeHtml(origin.name) + '</b><small>' + escapeHtml(origin.place) + ' · +' + origin.bonus + ' ' + (origin.resource === 'food' ? 'провизии' : origin.resource === 'materials' ? 'материала' : 'знания') + '</small><span class="campaign-choice-description">' + escapeHtml(origin.description) + '</span></span></label>').join('');
        const focusCards = OPENING_FOCUSES.map((focus, index) => '\n          <label class="campaign-onboarding-choice"><input type="radio" name="campaign-focus" value="' + focus.id + '" ' + (index === 0 ? 'checked' : '') + '><span class="campaign-choice-icon">' + focus.icon + '</span><span><b>' + escapeHtml(focus.title) + '</b><small>' + escapeHtml(focus.scienceName) + ' → ' + escapeHtml(focus.buildingName) + '</small><span class="campaign-choice-description">' + escapeHtml(focus.buildingDescription) + ' Эффект здания: ' + escapeHtml(EFFECTS[focus.effect].label) + '.</span></span></label>').join('');
        host.innerHTML = '\n          <section class="campaign-onboarding-hero"><span class="campaign-kicker">INFINITE FORGE · НАЧАЛО СЕЗОНА</span><h2>Рождение народа</h2><p>Выбери место, которое станет домом, и первое дело общины. Это задаст стартовый ресурс и первый научный проект.</p></section>\n          <form class="campaign-onboarding-form" onsubmit="CampaignMvp.beginOnboarding(event)">\n            <section class="campaign-panel campaign-onboarding-section"><h3>1 · Кто вы?</h3><label class="campaign-onboarding-name">Имя народа<input id="campaign-start-name" maxlength="24" placeholder="Например, Дети Великой Реки" autocomplete="off"></label><div class="campaign-onboarding-options">' + originCards + '</div></section>\n            <section class="campaign-panel campaign-onboarding-section"><h3>2 · На что направите силы?</h3><p class="campaign-small">Выбор откроет готовый первый проект. Генерация через ИИ для начала не требуется.</p><div class="campaign-onboarding-options">' + focusCards + '</div></section>\n            <section class="campaign-panel campaign-onboarding-deck"><h3>3 · Уже есть чем защищаться</h3><p class="campaign-small">Стартовая колода из двух карт доступна сразу — без ковки, API-ключа и предварительной сборки.</p><div class="campaign-starter-preview">' + STARTER_CARDS.map(card => '<article><span>' + card.emoji + '</span><div><b>' + escapeHtml(card.name) + '</b><small>' + card.atk + '/' + card.hp + ' · ' + card.drop_cost + ' энергии на вывод</small><p>' + escapeHtml(card.description) + '</p></div></article>').join('') + '</div><p class="campaign-small">Позже колоду можно менять картами из коллекции. Тренировочные бои против ИИ не дают ресурсов, медалей или рейтинга.</p></section>\n            <button class="campaign-btn campaign-btn-gold campaign-onboarding-submit" type="submit">Начать путь цивилизации →</button>\n          </form>';
    }

    function beginOnboarding(event) {
        if (event?.preventDefault) event.preventDefault();
        const doc = root.document;
        const result = completeOnboarding(state, {
            name: doc?.getElementById('campaign-start-name')?.value,
            originId: doc?.querySelector('input[name="campaign-origin"]:checked')?.value,
            openingFocusId: doc?.querySelector('input[name="campaign-focus"]:checked')?.value
        });
        if (result.error) { root.alert(result.error); return; }
        commit(result.state);
    }

    function research(id) { const oldEra = state.player.era; const result = researchBlueprint(state, id); if (alertResult(result) && state.player.era > oldEra) root.alert('Открыта эпоха: ' + eraName(state.player.era) + '.'); }
    function construct(id) { alertResult(constructBlueprint(state, id)); }
    function toggleBuildingAction(id) { alertResult(toggleBuilding(state, id)); }
    function toggleDeckCardAction(id) { alertResult(toggleDeckCard(state, id)); }
    function finishDayAction() { const result = finishDay(state); if (result.error) { root.alert(result.error); return; } commit(result.state); if (result.starvation) root.alert(result.state.player.campaignNotice); else if (result.state.player.campaignNotice) { /* notice in UI */ } }
    function completeSeasonAction() {
        const result = completeSeason(state);
        if (result.error) { root.alert(result.error); return; }
        commit(result.state);
        root.alert('Сезон завершён. Получена медаль «' + result.medal.name + '».');
    }
    function challenge(opponentId, leaderBattle) {
        if (state.player.pendingExpedition) { root.alert('Сначала заверши текущую экспедицию.'); return; }
        const opponent = state.opponents.find(item => item.id === opponentId);
        if (!opponent) return;
        if (typeof root.startBattle !== 'function') { root.alert('Боевой экран пока недоступен.'); return; }
        pendingMatch = { kind: 'practice', opponentId, leaderBattle: Boolean(leaderBattle), name: opponent.name, clan: opponent.clan, era: opponent.era };
        root.startBattle();
    }
    function claimRegionAction(regionId) { alertResult(settleRegion(state, regionId)); }
    function buildRegionBuildingAction(regionId) { alertResult(buildRegionBuilding(state, regionId)); }
    function attackRegionAction(regionId) {
        if (typeof root.startBattle !== 'function') { root.alert('Боевой экран пока недоступен.'); return; }
        const result = beginRegionExpedition(state, regionId);
        if (result.error) { root.alert(result.error); return; }
        pendingMatch = result.match;
        commit(result.state);
        root.startBattle();
    }
    function resumeRegionExpeditionAction() {
        if (state.player.pendingExpedition?.battleStarted) {
            if (typeof root.switchScreen === 'function') root.switchScreen('battle');
            else root.alert('Экспедиционный бой уже идёт в открытом экране.');
            return;
        }
        if (typeof root.startBattle !== 'function') { root.alert('Боевой экран пока недоступен.'); return; }
        const match = makeExpeditionMatch(state);
        if (!match) { root.alert('Незавершённая экспедиция не найдена.'); return; }
        pendingMatch = match;
        root.startBattle();
    }
    function consumePendingMatch() {
        const match = pendingMatch;
        pendingMatch = null;
        lastMatch = match;
        if (match?.kind === 'expedition') {
            const started = markExpeditionBattleStarted(state, match);
            if (!started.error) { state = started.state; save(state); }
        }
        return match;
    }
    function recordBattleResult(match, won) {
        if (!match) return null;
        if (match.kind === 'expedition') {
            const outcome = finishRegionExpedition(state, match, Boolean(won));
            if (outcome.error) return { kind: 'expedition', won: Boolean(won), message: outcome.error, error: outcome.error };
            commit(outcome.state);
            return { kind: 'expedition', won: Boolean(won), message: outcome.message, regionName: outcome.regionName };
        }
        const result = recordPractice(state, match.opponentId, Boolean(won), match.leaderBattle);
        if (!result.error) commit(result.state);
        return { kind: 'practice', won: Boolean(won), message: 'Тренировочный результат: ресурсы, земля и рейтинг клана не изменены.' };
    }
    function rematch() {
        if (!lastMatch) { root.switchScreen('campaign'); return; }
        pendingMatch = lastMatch.kind === 'expedition'
            ? { ...lastMatch, kind: 'practice', regionId: null, regionName: null }
            : { ...lastMatch };
        if (typeof root.startBattle === 'function') root.startBattle();
    }

    async function generateProject(event) {
        event.preventDefault();
        const status = root.document.getElementById('campaign-project-status');
        const button = root.document.getElementById('campaign-project-submit');
        const branchId = root.document.getElementById('campaign-project-branch').value;
        const branch = scienceBranchesForEra(state.player.era).find(item => item.id === branchId);
        if (!branch) { status.textContent = 'Эта научная ветвь ещё не открыта.'; return; }

        const situation = scienceAdvisorSituation(state);
        const context = situation.localContexts[Math.floor(Math.random() * situation.localContexts.length)]
            || { name: 'поселение', description: 'местная община и её повседневные нужды' };
        button.disabled = true;
        status.textContent = 'Советник сопоставляет «' + branch.label + '» с землями и запасами общины…';
        let raw;
        let usedLlm = false;
        try {
            const key = typeof root.getApiKey === 'function' ? root.getApiKey() : '';
            if (!key) throw new Error('no-key');
            const response = await fetch('https://api.hydraai.ru/v1/chat/completions', {
                method: 'POST', headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: typeof root.getSelectedModel === 'function' ? root.getSelectedModel() : 'gpt-6-luna',
                    messages: [
                        { role: 'system', content: 'Ты научный советник исторической стратегии. Игрок выбрал только широкую ветвь; сам выбери понятную местную тему по землям и запасам общины. Если есть несколько правдоподобных вариантов, допускай небольшую ситуативную вариативность: это совет, не инструмент идеальной настройки. Создай оригинальную науку и связанную постройку. Верни только JSON: {\"scienceName\":\"...\",\"scienceDescription\":\"...\",\"buildingName\":\"...\",\"buildingDescription\":\"...\",\"category\":\"military|economy|science|civic\",\"effects\":[{\"type\":\"...\",\"amount\":1}]}. Допустимые эффекты: ' + JSON.stringify(EFFECTS) + '. Выбери 1 или 2 разных эффекта по ветви; значения amount не выше указанного max. Не выдумывай другие ключи, бонусы или правила. Названия и описания без магии.' },
                        { role: 'user', content: 'Эпоха: ' + eraName(state.player.era) + '. Направление общины: «' + branch.label + '» — ' + branch.prompt + '. Ситуация: ' + situation.summary + '. Выбранный советником местный ориентир: «' + context.name + '» — ' + context.description + '. Возможный тип постройки: ' + branch.building + '. Создай узнаваемый, ситуативный проект без дополнительных вопросов игроку.' }
                    ],
                    temperature: 0.9, max_tokens: 650, response_format: { type: 'json_object' }
                })
            });
            if (!response.ok) throw new Error('Hydra API: HTTP ' + response.status);
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';
            raw = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || '{}');
            usedLlm = true;
        } catch (error) {
            const buildingFocus = branch.building.split(' или ')[0];
            raw = {
                scienceName: 'Практика: ' + branch.label,
                scienceDescription: 'Наблюдения по направлению «' + branch.label + '» в эпоху ' + eraName(state.player.era) + ', связанные с местными условиями региона «' + context.name + '».',
                buildingName: context.name + ': ' + buildingFocus,
                buildingDescription: 'Локальный черновик советника: ' + buildingFocus.toLowerCase() + ' подходит текущим землям и запасам общины.',
                category: branch.category,
                effects: [{ type: branch.effect, amount: 1 }]
            };
            status.textContent = error.message === 'no-key'
                ? 'API-ключ не задан: создан местный черновик советника, это не результат LLM.'
                : 'LLM недоступна (' + error.message + '); создан местный черновик, а не результат LLM.';
        } finally { button.disabled = false; }
        const result = addBlueprint(state, raw, 'both');
        if (result.error) { status.textContent = 'Проект отклонён валидатором: ' + result.error; return; }
        state = result.state;
        save(state);
        const message = usedLlm
            ? 'Советник создал проект по выбранному направлению и текущим обстоятельствам. Эффект прошёл проверку схемы.'
            : status.textContent;
        render();
        const refreshedStatus = root.document.getElementById('campaign-project-status');
        if (refreshedStatus) refreshedStatus.textContent = message;
    }

    function resetLocal() {
        if (!root.confirm('Сбросить локальную кампанию, включая медали, здания и науку?')) return;
        state = createState(); pendingMatch = null; lastMatch = null;
        if (typeof root.clearForgeAdvice === 'function') root.clearForgeAdvice();
        save(state); render(); if (typeof root.refreshForgeUi === 'function') root.refreshForgeUi();
    }

    const api = {
        ERAS, EFFECTS, ORIGINS, OPENING_FOCUSES, STARTER_CARDS, SCIENCE_BRANCHES, REGION_DEFINITIONS, REGION_BUILDINGS, REGION_CAPTURE_COST, REGION_EXPEDITION_COST, CARD_CRAFT_MATERIALS, CARD_CRAFT_EFFORTS, STORAGE_KEY, SEASON_LENGTH,
        POP_START, POP_MAX, POP_MIN, FOOD_CONSUMPTION_PER_POP, WORKER_BASE_YIELD, STORAGE_BASE, AP_MAX, BUILDING_WORKER_BONUS,
        createState, normalizeState, completeOnboarding, getFirstSessionGuide, cleanEffects, effectTotals, getBattleConfig, getOpponentBattleConfig,
        getRegionalIncome, getAvailableMaterialQualities, getRegionActionState, settleRegionState: settleRegion, buildRegionBuildingState: buildRegionBuilding, beginRegionExpeditionState: beginRegionExpedition, finishRegionExpeditionState: finishRegionExpedition,
        markExpeditionBattleStartedState: markExpeditionBattleStarted, recoverInterruptedExpeditionState: recoverInterruptedExpedition,
        addBlueprint, researchBlueprint, constructBlueprint, toggleBuildingState: toggleBuilding, toggleDeckCardState: toggleDeckCard, finishDayState: finishDay,
        cardCraftQuote, beginCardCraftState: beginCardCraft, completeCardCraftState: completeCardCraft, failCardCraftState: failCardCraft, claimCardCraftState: claimCardCraft, scienceBranchesForEra, scienceAdvisorSituation, recoverInterruptedCardCrafts,
        getFoodConsumption, getStorageCap, getProductionBreakdown, assignWorkerState: assignWorker,
        quoteCardCraft: investment => cardCraftQuote(state, investment),
        getRegionalMap: () => clone(REGION_DEFINITIONS.map(definition => ({ ...definition, ...getRegionRecord(state, definition.id) }))),
        beginCardCraft: (investment, roll, advisorOrder) => { const result = beginCardCraft(state, investment, roll, advisorOrder); if (!result.error) commit(result.state); return result; },
        completeCardCraft: (orderId, card) => { const result = completeCardCraft(state, orderId, card); if (!result.error) commit(result.state); return result; },
        failCardCraft: (orderId, reason) => { const result = failCardCraft(state, orderId, reason); if (!result.error) commit(result.state); return result; },
        getCardCraftOrders: () => clone(state.player.craftOrders),
        getReadyCraftCard: orderId => { const order = state.player.craftOrders.find(item => item.id === orderId && item.status === 'ready'); return order?.card ? clone(order.card) : null; },
        claimCardCraft: orderId => { const result = claimCardCraft(state, orderId); if (result.error) { root.alert(result.error); return null; } commit(result.state); return clone(result.card); },
        getScienceBranchesForEra: () => scienceBranchesForEra(state.player.era),
        recordPractice, completeSeasonState: completeSeason, load, save, render,
        research, construct, toggleBuilding: toggleBuildingAction, toggleDeckCard: toggleDeckCardAction,
        finishDay: finishDayAction, completeSeason: completeSeasonAction, challenge, claimRegion: claimRegionAction, buildRegionBuilding: buildRegionBuildingAction, attackRegion: attackRegionAction, resumeRegionExpedition: resumeRegionExpeditionAction, hasPendingMatch: () => Boolean(pendingMatch),
        getPendingMatch: () => pendingMatch ? { ...pendingMatch } : null,
        consumePendingMatch, recordBattleResult, rematch, generateProject, resetLocal,
        beginOnboarding, getStarterCards: () => clone(STARTER_CARDS), getBattleDeckIds: () => state.player.deckCardIds.slice(), getBattleConfigForCurrentPlayer: () => getBattleConfig(state),
        assignWorker: (from, to) => { const result = assignWorker(state, from, to); if (!result.error) commit(result.state); return result; },
        getState: () => clone(state)
    };
    root.CampaignMvp = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
