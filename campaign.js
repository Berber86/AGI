(function (root) {
    'use strict';

    const STORAGE_KEY = 'iforge_campaign_v2';
    const SEASON_LENGTH = 30;
    const ERAS = ['Каменный век', 'Неолит', 'Медный век', 'Бронзовый век', 'Железный век', 'Античность', 'Средневековье'];
    const EFFECTS = {
        deck_slots: { label: '+1 место в боевой колоде', category: 'military', max: 1 },
        max_hp: { label: '+1 стартовое здоровье', category: 'military', max: 1 },
        energy_cap: { label: '+1 к максимуму энергии', category: 'military', max: 1 },
        energy_growth: { label: '+1 к приросту энергии за ход', category: 'military', max: 1 },
        income_food: { label: '+1 провизия в конце дня', category: 'economy', max: 2 },
        income_materials: { label: '+1 материал в конце дня', category: 'economy', max: 2 },
        income_knowledge: { label: '+1 знание в конце дня', category: 'science', max: 2 }
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
        return { id: 'starter-granary', name: 'Общий амбар', description: 'Запас зерна поддерживает поселение.', category: 'economy', effects: [{ type: 'income_food', amount: 1 }], active: true, builtDay: 1, blueprintId: null };
    }
    function createState() {
        return {
            version: 2,
            season: 1,
            day: 1,
            medals: [],
            player: {
                name: 'Твоё поселение', clan: 'Медный Ворон', era: 0, research: 0,
                onboardingComplete: false, originId: null, openingFocusId: null,
                resources: { food: 8, materials: 8, knowledge: 5 },
                actionUsed: false,
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
            ]
        };
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
        if (!value || typeof value !== 'object' || value.version !== 2) return base;
        const state = { ...base, ...value };
        state.season = clampInt(value.season, 1, 999999, 1);
        state.day = clampInt(value.day, 1, SEASON_LENGTH, 1);
        state.medals = Array.isArray(value.medals) ? value.medals.filter(m => m && typeof m.id === 'string') : [];
        state.player = { ...base.player, ...(value.player || {}) };
        state.player.era = clampInt(state.player.era, 0, ERAS.length - 1, 0);
        // Existing v2 saves belong to returning players; only fresh state enters onboarding.
        state.player.onboardingComplete = typeof value.player?.onboardingComplete === 'boolean' ? value.player.onboardingComplete : true;
        state.player.originId = ORIGINS.some(item => item.id === state.player.originId) ? state.player.originId : null;
        state.player.openingFocusId = OPENING_FOCUSES.some(item => item.id === state.player.openingFocusId) ? state.player.openingFocusId : null;
        state.player.research = clampInt(state.player.research, 0, 1, 0);
        state.player.actionUsed = Boolean(state.player.actionUsed);
        state.player.resources = { ...base.player.resources, ...(state.player.resources || {}) };
        for (const key of Object.keys(base.player.resources)) state.player.resources[key] = clampInt(state.player.resources[key], 0, 999, base.player.resources[key]);
        state.player.activeBuildingSlots = clampInt(state.player.activeBuildingSlots, 4, 5, 4);
        state.player.practice = { ...base.player.practice, ...(state.player.practice || {}) };
        for (const key of Object.keys(base.player.practice)) state.player.practice[key] = clampInt(state.player.practice[key], 0, 999, 0);
        state.player.buildings = Array.isArray(state.player.buildings) ? state.player.buildings.slice(0, 30).map(building => ({
            id: String(building.id || `building-${Math.random().toString(36).slice(2)}`),
            name: String(building.name || 'Безымянное здание').slice(0, 80),
            description: String(building.description || '').slice(0, 400),
            category: CATEGORIES.includes(building.category) ? building.category : 'civic',
            effects: cleanEffects(building.effects) || [],
            active: Boolean(building.active),
            builtDay: clampInt(building.builtDay, 1, SEASON_LENGTH, 1),
            blueprintId: building.blueprintId || null
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
            built: Boolean(blueprint.built),
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
            id: `opening-${focus.id}`,
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
    function canOrder(state) {
        if (state.day >= SEASON_LENGTH) return 'Сезон завершён. Подведи итоги.';
        if (state.player.actionUsed) return 'На сегодня уже есть крупный приказ. Продвинь день.';
        return null;
    }

    function normalizeBlueprint(raw, state, visibility) {
        if (!raw || typeof raw !== 'object') return null;
        const effects = cleanEffects(raw.effects);
        if (!effects || !raw.scienceName || !raw.buildingName || !raw.scienceDescription || !raw.buildingDescription) return null;
        return {
            id: `blueprint-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            scienceName: String(raw.scienceName).trim().slice(0, 80),
            scienceDescription: String(raw.scienceDescription).trim().slice(0, 400),
            buildingName: String(raw.buildingName).trim().slice(0, 80),
            buildingDescription: String(raw.buildingDescription).trim().slice(0, 400),
            category: CATEGORIES.includes(raw.category) ? raw.category : 'civic',
            effects,
            researched: false,
            built: false,
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
        const orderError = canOrder(state);
        if (orderError) return { state, error: orderError };
        const blueprint = state.player.blueprints.find(item => item.id === id);
        if (!blueprint) return { state, error: 'Научный проект не найден.' };
        if (blueprint.researched) return { state, error: 'Наука уже исследована.' };
        if (!spend(state, { food: 1, materials: 1, knowledge: 2 })) return { state, error: 'Для исследования нужны 1 провизия, 1 материал и 2 знания.' };
        blueprint.researched = true;
        state.player.actionUsed = true;
        state.player.research += 1;
        if (state.player.research >= 2 && state.player.era < ERAS.length - 1) {
            state.player.research = 0;
            state.player.era += 1;
        }
        return { state, blueprint, error: null };
    }

    function constructBlueprint(input, id) {
        const state = normalizeState(input);
        const orderError = canOrder(state);
        if (orderError) return { state, error: orderError };
        const blueprint = state.player.blueprints.find(item => item.id === id);
        if (!blueprint || !blueprint.researched) return { state, error: 'Сначала исследуй эту науку.' };
        if (blueprint.built) return { state, error: 'Здание по этому чертежу уже построено.' };
        if (state.player.buildings.length >= 30) return { state, error: 'В поселении уже 30 зданий.' };
        if (!spend(state, { materials: 4 })) return { state, error: 'Для строительства нужны 4 материала.' };
        const hasSlot = state.player.buildings.filter(building => building.active).length < state.player.activeBuildingSlots;
        state.player.buildings.push({
            id: `building-${blueprint.id}`, name: blueprint.buildingName, description: blueprint.buildingDescription,
            category: blueprint.category, effects: clone(blueprint.effects), active: hasSlot, builtDay: state.day, blueprintId: blueprint.id
        });
        blueprint.built = true;
        state.player.actionUsed = true;
        return { state, error: null };
    }

    function toggleBuilding(input, id) {
        const state = normalizeState(input);
        const building = state.player.buildings.find(item => item.id === id);
        if (!building) return { state, error: 'Здание не найдено.' };
        if (building.active) building.active = false;
        else {
            const count = state.player.buildings.filter(item => item.active).length;
            if (count >= state.player.activeBuildingSlots) return { state, error: `Доступно только ${state.player.activeBuildingSlots} активных слота. Сначала отключи другое здание.` };
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
            if (ids.length >= limit) return { state, error: `Текущие здания дают лимит колоды ${limit}.` };
            state.player.deckCardIds = [...ids, cardId];
        }
        return { state, error: null };
    }

    function finishDay(input) {
        const state = normalizeState(input);
        if (state.day >= SEASON_LENGTH) return { state, error: 'Это последний день сезона. Подведи итоги.' };
        const totals = effectTotals(state);
        state.player.resources.food = Math.min(999, state.player.resources.food + 2 + totals.income_food);
        state.player.resources.materials = Math.min(999, state.player.resources.materials + 2 + totals.income_materials);
        state.player.resources.knowledge = Math.min(999, state.player.resources.knowledge + 1 + totals.income_knowledge);
        for (const opponent of state.opponents) {
            if ((state.day + opponent.offset) % opponent.pace === 0 && opponent.era < ERAS.length - 1) {
                opponent.research += 1;
                if (opponent.research >= 2) { opponent.research = 0; opponent.era += 1; }
            }
        }
        state.day += 1;
        state.player.actionUsed = false;
        return { state, error: null };
    }

    function recordPractice(input, opponentId, win, leaderBattle) {
        const state = normalizeState(input);
        if (!state.opponents.some(item => item.id === opponentId)) return { state, error: 'Соперник не найден.' };
        // Локальная статистика для проверки боя: никаких ресурсов, медалей или кланового рейтинга.
        const key = leaderBattle ? (win ? 'leaderWins' : 'leaderLosses') : (win ? 'wins' : 'losses');
        state.player.practice[key] += 1;
        return { state, error: null };
    }

    function completeSeason(input) {
        const state = normalizeState(input);
        if (state.day < SEASON_LENGTH) return { state, error: 'Сезон ещё не завершён.' };
        const medal = { id: `season-${state.season}-${Date.now()}`, season: state.season, name: `Сезон ${state.season}: ${ERAS[state.player.era]}`, description: `Наивысшая эпоха: ${ERAS[state.player.era]}.` };
        const fresh = createState();
        fresh.season = state.season + 1;
        fresh.player.onboardingComplete = true;
        fresh.player.deckCardIds = STARTER_CARDS.map(card => card.id);
        fresh.medals = [...state.medals, medal];
        return { state: fresh, medal, error: null };
    }

    function save(value) { try { root.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(value))); return true; } catch (_) { return false; } }
    function load() { try { return normalizeState(JSON.parse(root.localStorage.getItem(STORAGE_KEY) || 'null')); } catch (_) { return createState(); } }
    function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
    function htmlAttr(value) { return escapeHtml(String(value)).replace(/`/g, '&#96;'); }

    let state = root.localStorage ? load() : createState();
    let pendingMatch = null;
    let lastMatch = null;
    function commit(next) { state = normalizeState(next); save(state); render(); }
    function eraName(index) { return ERAS[Math.max(0, Math.min(ERAS.length - 1, index))]; }
    function getCardChoices() { return typeof root.getCampaignCardChoices === 'function' ? root.getCampaignCardChoices() : []; }
    function alertResult(result) { if (result.error) { root.alert(result.error); return false; } commit(result.state); return true; }

    function render() {
        const host = root.document && root.document.getElementById('campaign-root');
        if (!host) return;
        if (!state.player.onboardingComplete) {
            renderOnboarding(host);
            return;
        }
        const p = state.player;
        const config = getBattleConfig(state);
        const activeBuildings = p.buildings.filter(building => building.active);
        const choices = getCardChoices();
        const selectedCards = p.deckCardIds.map(id => choices.find(card => card.id === id)).filter(Boolean);
        const readyToClose = state.day >= SEASON_LENGTH;
        host.innerHTML = `
          ${state.day === 1 && state.player.openingFocusId ? `<section class="campaign-onboarding-welcome"><span class="campaign-kicker">ТВОЙ ПЕРВЫЙ ШАГ</span><b>Начни с открытия «${escapeHtml(OPENING_FOCUSES.find(item => item.id === state.player.openingFocusId)?.scienceName || '')}»</b><p>Оно уже в списке проектов. Исследование стоит 1 провизию, 1 материал и 2 знания; API-ключ не нужен.</p></section>` : ''}
          <section class="campaign-seasonbar"><div><span class="campaign-kicker">ЛОКАЛЬНЫЙ ПРОТОТИП · ИИ-СОПЕРНИКИ</span><h2>Сезон ${state.season} <span class="campaign-muted">· день ${state.day}/${SEASON_LENGTH}</span></h2></div><div class="campaign-season-actions"><span class="campaign-medal">🏅 Медалей: ${state.medals.length}</span><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.resetLocal()">Сбросить кампанию</button></div></section>
          <div class="campaign-warning">День переключается вручную. ИИ нужен только для тестовых боёв: они не дают ресурсов, медалей или рейтинга клану. Названия эпох пока рабочие; сейчас проверяем сам цикл мета-игры.</div>
          <div class="campaign-layout">
            <section class="campaign-panel campaign-civilization"><div class="campaign-panel-heading"><div><span class="campaign-kicker">ТВОЯ ЦИВИЛИЗАЦИЯ</span><h2>🏛️ ${escapeHtml(p.name)}</h2></div><span class="campaign-era-pill">Эпоха ${p.era + 1}</span></div><div class="campaign-era-name">${escapeHtml(eraName(p.era))}</div><div class="campaign-progress-track"><span style="width:${p.era === ERAS.length - 1 ? 100 : p.research * 50}%"></span></div><p class="campaign-small">${p.era === ERAS.length - 1 ? 'Последняя эпоха открыта.' : `Научные открытия эпохи: ${p.research}/2`}</p><div class="campaign-era-rail">${ERAS.map((era, i) => `<div class="campaign-era-step ${i < p.era ? 'is-done' : ''} ${i === p.era ? 'is-current' : ''}"><span>${i < p.era ? '✓' : i + 1}</span><small>${escapeHtml(era)}</small></div>`).join('')}</div><div class="campaign-clan-chip">🛡️ Клан: <b>${escapeHtml(p.clan)}</b> <span>· локальная заглушка</span></div><div class="campaign-practice-summary"><b>Боевая конфигурация</b><span>Колода: ${p.deckCardIds.length}/${config.deckLimit} карт</span><span>Здоровье: ${config.hp} HP</span><span>Энергия: старт 1 · максимум ${config.energyMax} · +${config.energyGrowth} за ход</span><span>Активных зданий: ${activeBuildings.length}/${p.activeBuildingSlots}</span></div><div class="campaign-small">Эффекты включённых зданий суммируются. Военные, экономические, научные и общественные постройки конкурируют за слоты.</div></section>

            <section class="campaign-panel"><div class="campaign-panel-heading"><div><span class="campaign-kicker">ЭКОНОМИКА · НАУКА · СТРОИТЕЛЬСТВО</span><h2>Развитие поселения</h2></div><span class="campaign-day-badge">День ${state.day}</span></div><div class="campaign-resources"><div><span>🌾 Провизия</span><b>${p.resources.food}</b><small>+${2 + config.effects.income_food}/день</small></div><div><span>🪵 Материалы</span><b>${p.resources.materials}</b><small>+${2 + config.effects.income_materials}/день</small></div><div><span>📚 Знания</span><b>${p.resources.knowledge}</b><small>+${1 + config.effects.income_knowledge}/день</small></div></div><div class="campaign-small">Наука открывает чертёж. Постройка занимает отдельный приказ; затем её можно включить в ограниченные активные слоты.</div>
              <div class="campaign-orders">${p.blueprints.length ? p.blueprints.map(bp => `<article class="campaign-order"><div class="campaign-order-icon">${bp.researched ? (bp.built ? '🏛️' : '📐') : '🔬'}</div><div>${bp.openingProject ? '<span class="campaign-opening-tag">ПЕРВЫЙ ПРОЕКТ</span>' : ''}<b>${escapeHtml(bp.scienceName)} → ${escapeHtml(bp.buildingName)}</b><p>${escapeHtml(bp.scienceDescription)} · ${escapeHtml(bp.buildingDescription)}<br><i>${bp.effects.map(effect => escapeHtml(EFFECTS[effect.type].label)).join(' · ')}</i></p></div><button class="campaign-btn ${bp.researched ? 'campaign-btn-secondary' : ''}" ${p.actionUsed || readyToClose || (bp.researched && bp.built) ? 'disabled' : ''} onclick="CampaignMvp.${bp.researched ? 'construct' : 'research'}('${htmlAttr(bp.id)}')">${bp.researched ? (bp.built ? 'Построено' : 'Построить · 4🪵') : 'Исследовать'}</button></article>`).join('') : '<div class="campaign-project-empty">Пока нет наук. Создай проект ниже: он даст научное открытие и связанный с ним чертёж здания.</div>'}${p.buildings.map(building => `<article class="campaign-order campaign-building-row"><div class="campaign-order-icon">${building.category === 'military' ? '⚔️' : building.category === 'economy' ? '🌾' : building.category === 'science' ? '📚' : '🏛️'}</div><div><b>${escapeHtml(building.name)} · ${escapeHtml(CATEGORY_NAMES[building.category])}</b><p>${(building.effects || []).map(effect => escapeHtml(EFFECTS[effect.type]?.label || effect.type)).join(' · ')}</p></div><button class="campaign-btn ${building.active ? 'campaign-btn-secondary' : ''}" onclick="CampaignMvp.toggleBuilding('${htmlAttr(building.id)}')">${building.active ? 'Включено' : 'Включить'}</button></article>`).join('')}</div>
              <div class="campaign-day-footer"><span>${p.actionUsed ? 'Приказ на сегодня отдан. Можно продвинуть день.' : 'Исследование или строительство займут приказ; настройка активных зданий — нет.'}</span>${readyToClose ? '<button class="campaign-btn campaign-btn-gold" onclick="CampaignMvp.completeSeason()">Завершить сезон · получить медаль</button>' : '<button class="campaign-btn campaign-btn-gold" onclick="CampaignMvp.finishDay()">⏭ Завершить день</button>'}</div>
            </section>

            <section class="campaign-panel campaign-opponents"><div class="campaign-panel-heading"><div><span class="campaign-kicker">БОЕВОЙ ПОЛИГОН</span><h2>ИИ-соседи</h2></div><span class="campaign-muted">Не рейтинг</span></div><p class="campaign-small">Вызов запускает текущий бой против примитивного ИИ. Матч не меняет экономику, эпоху или клановый счёт. Лидерский формат пока использует ту же тестовую колоду.</p><div class="campaign-opponent-list">${state.opponents.map(opponent => `<article class="campaign-opponent"><div class="campaign-opponent-top"><span class="campaign-opponent-avatar">${opponent.leader ? '👑' : '🧭'}</span><div><b>${escapeHtml(opponent.name)}</b><small>${escapeHtml(opponent.clan)}${opponent.leader ? ' · лидер-заглушка' : ''}</small></div><span class="campaign-opponent-rating">Э${opponent.era + 1}</span></div><div class="campaign-opponent-era">${escapeHtml(eraName(opponent.era))}</div><button class="campaign-btn campaign-btn-challenge" onclick="CampaignMvp.challenge('${htmlAttr(opponent.id)}', ${opponent.leader ? 'true' : 'false'})">${opponent.leader ? '⚔️ Тест кланового лидера' : '⚔️ Тренировочный бой'}</button></article>`).join('')}</div></section>
          </div>

          <section class="campaign-panel campaign-codex"><div class="campaign-panel-heading"><div><span class="campaign-kicker">LLM · НАУКА ОТКРЫВАЕТ ЗДАНИЕ</span><h2>🧠 Сформулировать открытие</h2></div><span class="campaign-muted">Шаблоны → наука → постройка</span></div><p class="campaign-small">Модель предлагает науку, чертёж и механику. Для безопасного MVP эффект описывается декларативной схемой, а не исполняемым кодом: разрешённые параметры ограничены и валидируются. Без API-ключа создаётся локальный черновик по выбранному эффекту.</p><form class="campaign-project-form" onsubmit="CampaignMvp.generateProject(event)"><label>Слово / замысел<input id="campaign-project-word" maxlength="60" placeholder="например, каменные террасы"></label><label>Материал / область<select id="campaign-project-material"><option>глина</option><option>камень</option><option>бронза</option><option>вода</option><option>земледелие</option><option>наблюдение за звёздами</option></select></label><label>Доступ<select id="campaign-project-visibility"><option value="both">Союзники и соседи</option><option value="allies">Только союзники</option><option value="neighbors">Только соседи</option></select></label><label>Эффект для локального черновика<select id="campaign-project-effect">${EFFECT_KEYS.map(key => `<option value="${key}">${escapeHtml(EFFECTS[key].label)}</option>`).join('')}</select></label><button class="campaign-btn campaign-btn-gold" type="submit" id="campaign-project-submit">✨ Сгенерировать науку</button></form><div id="campaign-project-status" class="campaign-project-status" role="status" aria-live="polite"></div></section>

          <section class="campaign-panel campaign-codex"><div class="campaign-panel-heading"><div><span class="campaign-kicker">ЛИЧНЫЙ DECKBUILDING</span><h2>🎴 Колода кампании</h2></div><span class="campaign-muted">${p.deckCardIds.length}/${config.deckLimit}</span></div><p class="campaign-small">Активные военные здания могут увеличить лимит. Неактивные здания не дают боевого эффекта.</p><div class="campaign-project-list">${choices.length ? choices.map(card => { const selected = p.deckCardIds.includes(card.id); return `<button type="button" class="campaign-project-card campaign-card-choice ${selected ? 'is-selected' : ''}" onclick="CampaignMvp.toggleDeckCard('${htmlAttr(card.id)}')"><span>${selected ? '✓ В колоде' : 'Добавить в колоду'} · ${escapeHtml(card.card_type || 'карта')}</span><b>${escapeHtml(card.name || 'Без названия')}</b><small>Выход: ${Number(card.drop_cost) || 0} энергии · атака: ${Number(card.action_cost) || 0}</small></button>`; }).join('') : '<div class="campaign-project-empty">Коллекция пока пуста. Для тренировочного боя доступна тестовая стартовая колода из двух карт.</div>'}</div><div class="campaign-day-footer"><span>Текущий выбор: ${selectedCards.map(card => escapeHtml(card.name)).join(' · ') || 'тестовая колода'}</span></div></section>
        `;
    }

    function renderOnboarding(host) {
        const originCards = ORIGINS.map((origin, index) => `
          <label class="campaign-onboarding-choice"><input type="radio" name="campaign-origin" value="${origin.id}" ${index === 0 ? 'checked' : ''}><span class="campaign-choice-icon">${origin.icon}</span><span><b>${escapeHtml(origin.name)}</b><small>${escapeHtml(origin.place)} · +${origin.bonus} ${origin.resource === 'food' ? 'провизии' : origin.resource === 'materials' ? 'материала' : 'знания'}</small><span class="campaign-choice-description">${escapeHtml(origin.description)}</span></span></label>`).join('');
        const focusCards = OPENING_FOCUSES.map((focus, index) => `
          <label class="campaign-onboarding-choice"><input type="radio" name="campaign-focus" value="${focus.id}" ${index === 0 ? 'checked' : ''}><span class="campaign-choice-icon">${focus.icon}</span><span><b>${escapeHtml(focus.title)}</b><small>${escapeHtml(focus.scienceName)} → ${escapeHtml(focus.buildingName)}</small><span class="campaign-choice-description">${escapeHtml(focus.buildingDescription)} Эффект здания: ${escapeHtml(EFFECTS[focus.effect].label)}.</span></span></label>`).join('');
        host.innerHTML = `
          <section class="campaign-onboarding-hero"><span class="campaign-kicker">INFINITE FORGE · НАЧАЛО СЕЗОНА</span><h2>Рождение народа</h2><p>Выбери место, которое станет домом, и первое дело общины. Это задаст стартовый ресурс и первый научный проект.</p></section>
          <form class="campaign-onboarding-form" onsubmit="CampaignMvp.beginOnboarding(event)">
            <section class="campaign-panel campaign-onboarding-section"><h3>1 · Кто вы?</h3><label class="campaign-onboarding-name">Имя народа<input id="campaign-start-name" maxlength="24" placeholder="Например, Дети Великой Реки" autocomplete="off"></label><div class="campaign-onboarding-options">${originCards}</div></section>
            <section class="campaign-panel campaign-onboarding-section"><h3>2 · На что направите силы?</h3><p class="campaign-small">Выбор откроет готовый первый проект. Генерация через ИИ для начала не требуется.</p><div class="campaign-onboarding-options">${focusCards}</div></section>
            <section class="campaign-panel campaign-onboarding-deck"><h3>3 · Уже есть чем защищаться</h3><p class="campaign-small">Стартовая колода из двух карт доступна сразу — без ковки, API-ключа и предварительной сборки.</p><div class="campaign-starter-preview">${STARTER_CARDS.map(card => `<article><span>${card.emoji}</span><div><b>${escapeHtml(card.name)}</b><small>${card.atk}/${card.hp} · ${card.drop_cost} энергии на вывод</small><p>${escapeHtml(card.description)}</p></div></article>`).join('')}</div><p class="campaign-small">Позже колоду можно менять картами из коллекции. Тренировочные бои против ИИ не дают ресурсов, медалей или рейтинга.</p></section>
            <button class="campaign-btn campaign-btn-gold campaign-onboarding-submit" type="submit">Начать путь цивилизации →</button>
          </form>`;
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

    function research(id) { const oldEra = state.player.era; const result = researchBlueprint(state, id); if (alertResult(result) && state.player.era > oldEra) root.alert(`Открыта эпоха: ${eraName(state.player.era)}.`); }
    function construct(id) { alertResult(constructBlueprint(state, id)); }
    function toggleBuildingAction(id) { alertResult(toggleBuilding(state, id)); }
    function toggleDeckCardAction(id) { alertResult(toggleDeckCard(state, id)); }
    function finishDayAction() { alertResult(finishDay(state)); }
    function completeSeasonAction() {
        const result = completeSeason(state);
        if (result.error) { root.alert(result.error); return; }
        commit(result.state);
        root.alert(`Сезон завершён. Получена медаль «${result.medal.name}».`);
    }
    function challenge(opponentId, leaderBattle) {
        const opponent = state.opponents.find(item => item.id === opponentId);
        if (!opponent) return;
        pendingMatch = { opponentId, leaderBattle: Boolean(leaderBattle), name: opponent.name, clan: opponent.clan, era: opponent.era };
        if (typeof root.startBattle !== 'function') { root.alert('Боевой экран пока недоступен.'); return; }
        root.startBattle();
    }
    function consumePendingMatch() { const match = pendingMatch; pendingMatch = null; lastMatch = match; return match; }
    function recordBattleResult(match, won) {
        if (!match) return;
        const result = recordPractice(state, match.opponentId, Boolean(won), match.leaderBattle);
        if (!result.error) commit(result.state);
    }
    function rematch() { if (!lastMatch) { root.switchScreen('campaign'); return; } pendingMatch = { ...lastMatch }; if (typeof root.startBattle === 'function') root.startBattle(); }

    async function generateProject(event) {
        event.preventDefault();
        const status = root.document.getElementById('campaign-project-status');
        const button = root.document.getElementById('campaign-project-submit');
        const word = root.document.getElementById('campaign-project-word').value.trim();
        const material = root.document.getElementById('campaign-project-material').value;
        const visibility = root.document.getElementById('campaign-project-visibility').value;
        const fallbackEffect = root.document.getElementById('campaign-project-effect').value;
        if (!word) { status.textContent = 'Добавь слово или замысел.'; return; }
        button.disabled = true;
        status.textContent = 'LLM проектирует науку и связанное здание…';
        let raw;
        let usedLlm = false;
        try {
            const key = typeof root.getApiKey === 'function' ? root.getApiKey() : '';
            if (!key) throw new Error('no-key');
            const response = await fetch('https://api.hydraai.ru/v1/chat/completions', {
                method: 'POST', headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: typeof root.getSelectedModel === 'function' ? root.getSelectedModel() : 'gpt-6-luna',
                    messages: [
                        { role: 'system', content: `Ты проектируешь науку и здание для исторической PvP-стратегии. Верни только JSON: {"scienceName":"...","scienceDescription":"...","buildingName":"...","buildingDescription":"...","category":"military|economy|science|civic","effects":[{"type":"...","amount":1}]}. Допустимые эффекты: ${JSON.stringify(EFFECTS)}. Выбери 1 или 2 разных эффекта, соответствующих категории; значения amount не выше указанного max. Не выдумывай другие ключи, бонусы или правила. Названия и описания исторически правдоподобны, без магии.` },
                        { role: 'user', content: `Эпоха: ${eraName(state.player.era)}. Шаблонные слова: «${word}», «${material}». Создай оригинальную науку, которая открывает здание. Не делай здание обязательно военным: экономика, наука и общественная жизнь также важны.` }
                    ],
                    temperature: 0.8, max_tokens: 650, response_format: { type: 'json_object' }
                })
            });
            if (!response.ok) throw new Error(`Hydra API: HTTP ${response.status}`);
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';
            raw = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || '{}');
            usedLlm = true;
        } catch (error) {
            raw = {
                scienceName: `Практика ${word}`,
                scienceDescription: `Наблюдения о теме «${word}» в эпоху ${eraName(state.player.era)}.`,
                buildingName: `${material.charAt(0).toUpperCase() + material.slice(1)} ${word}`,
                buildingDescription: `Черновой проект, составленный из шаблонов «${word}» и «${material}».`,
                category: EFFECTS[fallbackEffect]?.category || 'civic',
                effects: [{ type: fallbackEffect, amount: 1 }]
            };
            status.textContent = error.message === 'no-key'
                ? 'API-ключ не задан: создан локальный черновик по выбранному эффекту, это не результат LLM.'
                : `LLM недоступна (${error.message}); создан локальный черновик, а не результат LLM.`;
        } finally { button.disabled = false; }
        const result = addBlueprint(state, raw, visibility);
        if (result.error) { status.textContent = `Проект отклонён валидатором: ${result.error}`; return; }
        state = result.state;
        save(state);
        const message = usedLlm
            ? 'Наука и чертёж сгенерированы. Механика прошла проверку схемы; видимость соседям/союзникам пока локальная.'
            : status.textContent;
        render();
        const refreshedStatus = root.document.getElementById('campaign-project-status');
        if (refreshedStatus) refreshedStatus.textContent = message;
    }

    function resetLocal() {
        if (!root.confirm('Сбросить локальную кампанию, включая медали, здания и науку?')) return;
        state = createState(); pendingMatch = null; lastMatch = null; save(state); render();
    }

    const api = {
        ERAS, EFFECTS, ORIGINS, OPENING_FOCUSES, STARTER_CARDS, STORAGE_KEY, SEASON_LENGTH, createState, normalizeState, completeOnboarding, cleanEffects, effectTotals, getBattleConfig, getOpponentBattleConfig,
        addBlueprint, researchBlueprint, constructBlueprint, toggleBuildingState: toggleBuilding, toggleDeckCardState: toggleDeckCard, finishDayState: finishDay,
        recordPractice, completeSeasonState: completeSeason, load, save, render,
        research, construct, toggleBuilding: toggleBuildingAction, toggleDeckCard: toggleDeckCardAction,
        finishDay: finishDayAction, completeSeason: completeSeasonAction, challenge, hasPendingMatch: () => Boolean(pendingMatch),
        getPendingMatch: () => pendingMatch ? { ...pendingMatch } : null,
        consumePendingMatch, recordBattleResult, rematch, generateProject, resetLocal,
        beginOnboarding, getStarterCards: () => clone(STARTER_CARDS), getBattleDeckIds: () => state.player.deckCardIds.slice(), getBattleConfigForCurrentPlayer: () => getBattleConfig(state),
        getState: () => clone(state)
    };
    root.CampaignMvp = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
