(function (root) {
    'use strict';

    const CampaignMap = root.CampaignMap || (typeof require === 'function' ? require('./campaign-map.js') : null);
    if (!CampaignMap) throw new Error('campaign-map.js must be loaded before campaign.js.');

    const STORAGE_KEY = 'iforge_campaign_v4';
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
        { id: 'agriculture', label: 'Земледелие и продовольствие', prompt: 'улучшение выращивания, хранения и распределения пищи. Как в Египте — шадуф, басма, закрома', minEra: 0, category: 'economy', effect: 'income_food', building: 'амбар или ирригационная система' },
        { id: 'stonecraft', label: 'Камень и ремесло', prompt: 'обработка камня и организация ремесленного производства. Чатал-Хююк, обсидиан, кремнёвые шахты', minEra: 0, category: 'economy', effect: 'income_materials', building: 'каменная мастерская' },
        { id: 'seasonal', label: 'Наблюдения за сезонами', prompt: 'календарные наблюдения, обучение и передача знаний. Стоунхендж, Нил, звёзды', minEra: 0, category: 'science', effect: 'income_knowledge', building: 'место наблюдений или календарный круг' },
        { id: 'warfare', label: 'Военная организация', prompt: 'подготовка ополчения и согласованные действия отрядов. Ямная культура — повозки, дружина', minEra: 0, category: 'military', effect: 'deck_slots', building: 'площадка для сбора и обучения' },
        { id: 'fortification', label: 'Укрепления поселения', prompt: 'защита поселения, стен и проходов. Иерихонские стены, частокол Триполья', minEra: 1, category: 'military', effect: 'max_hp', building: 'частокол или укреплённые ворота' },
        { id: 'horse', label: 'Кони и повозки Ямной', prompt: 'приручение коня, повозки, курганы. Ямная культура 3300 до н.э. — первые всадники', minEra: 1, category: 'military', effect: 'trade_bonus', building: 'конный загон или мастерская повозок' },
        { id: 'writing', label: 'Письмо и учёт', prompt: 'клинопись Шумера, иероглифы Египта, счёт и бюрократия. Урук 3400 до н.э.', minEra: 1, category: 'science', effect: 'income_knowledge', building: 'дом табличек или школа писцов' },
        { id: 'metallurgy', label: 'Медь и металлургия', prompt: 'добыча и обработка меди, доступные для текущей эпохи. Балканы 5000 до н.э., первые медники', minEra: 2, category: 'economy', effect: 'income_materials', building: 'рудник или литейная мастерская' },
        { id: 'bronze', label: 'Бронзовые сплавы', prompt: 'бронзовое литьё и снабжение инструментами. Аккад — бронзовое оружие Саргона', minEra: 3, category: 'economy', effect: 'income_materials', building: 'бронзовая литейная' },
        { id: 'irrigation-empire', label: 'Империя ирригации', prompt: 'государство каналов, как Аккад и Египет — централизация, налоги зерном, бюрократия', minEra: 2, category: 'civic', effect: 'storage_bonus', building: 'государственные закрома или домена фараона' }
    ];
    const ERAS = ['Каменный век', 'Античный мир', 'Средневековье', 'Ренессанс', 'Эпоха Пара и Стали 1800-1910', 'Новейшее время', 'Будущее 2050-2150'];
    const ERA_HISTORICAL = [
        { era: 0, cultures: ['Ямная культура — курганы и кони', 'Триполье — большие поселения', 'Чатал-Хююк — обсидиан', 'Натуф — первые земледельцы'], desc: 'Неолит — от Ямной степи до Чатал-Хююка. Ямы, курганы, первые города' },
        { era: 1, cultures: ['Шумер — Урук и Ур, клинопись', 'Аккад Саргона — первая империя', 'Древнее Царство Египта — пирамиды', 'Хараппа — канализация и кирпичи'], desc: 'Бронзовый век ранний — Аккад, Египет, Шумер, Хараппа. Первые империи и письмо' },
        { era: 2, cultures: ['Минойцы — Кносс и быки', 'Хетты — железо и колесницы', 'Вавилон Хаммурапи — законы', 'Фивы Египта — Новое Царство'], desc: 'Бронза поздняя — Минойцы, Хетты, Вавилон. Колесницы и морская торговля' },
        { era: 3, cultures: ['Ассирия — военная машина', 'Персия — сатрапии', 'Греция — полисы', 'Рим — легионы'], desc: 'Античность — Ассирия, Персия, Греция, Рим' },
        { era: 4, cultures: ['Крестоносцы', 'Монголы', 'Османы', 'Тимуриды'], desc: 'Средневековье — степи и империи' },
        { era: 5, cultures: ['Индустриальная революция', 'Колониализм', 'Мировые войны', 'Холодная война'], desc: '1800-1910 и Новейшее — пар, сталь, идеологии' },
        { era: 6, cultures: ['Климат, космос, ИИ', 'Шумерские танки с клинописью', 'Танки Ра и Саргона'], desc: 'Будущее 2050-2150 — танки с клинописью, дроны Гильгамеша, зиккурат-ПВО' }
    ];
    const DECREES = {
        military: {
            id: 'military',
            label: 'Военный уклад',
            icon: '⚔️',
            description: 'Централизация вокруг дружины. +1 слот колоды, +0.2🪵 с рабочего, но потребление еды x1.3 и знания -0.3 с рабочего.',
            bonuses: { deck_slots: 1, workerBonus: { materials: 0.2, knowledge: -0.3 }, consumptionMult: 1.3, storage: 0 }
        },
        agricultural: {
            id: 'agricultural',
            label: 'Земледельческий уклад',
            icon: '🌾',
            description: 'Общинная земля и амбары. +10 к складу, +0.4🌾 с рабочего, но -1 слот колоды и +0.1 потребления на клан из-за праздников.',
            bonuses: { deck_slots: -1, workerBonus: { food: 0.4 }, consumptionMult: 1.1, storage: 10 }
        },
        priestly: {
            id: 'priestly',
            label: 'Жреческий / Научный уклад',
            icon: '📚',
            description: 'Храм, академия, обсерватория. +0.4📚 с рабочего, здания дают +1 к складу, но стоят +1🪵 и -0.1🌾 с рабочего (жрецы не пашут).',
            bonuses: { deck_slots: 0, workerBonus: { knowledge: 0.4, food: -0.1 }, consumptionMult: 1.0, storage: 3, buildingCostExtra: 1 }
        }
    };
    const EFFECTS = {
        deck_slots: { label: '+1 место в боевой колоде', category: 'military', max: 1 },
        max_hp: { label: '+1 стартовое здоровье', category: 'military', max: 1 },
        energy_cap: { label: '+1 к максимуму энергии', category: 'military', max: 1 },
        energy_growth: { label: '+1 к приросту энергии за ход', category: 'military', max: 1 },
        income_food: { label: '+0.5 к еде с клана', category: 'economy', max: 2 },
        income_materials: { label: '+0.4 к материалам с клана', category: 'economy', max: 2 },
        income_knowledge: { label: '+0.5 к знаниям с клана', category: 'science', max: 2 },
        pop_growth: { label: '+15% шанс роста кланов', category: 'civic', max: 2 },
        storage_bonus: { label: '+5 к складу', category: 'economy', max: 2 },
        defense_bonus: { label: '+10% защита от набегов', category: 'military', max: 2 },
        trade_bonus: { label: '+0.3 к торговле (материалы+знания)', category: 'economy', max: 2 },
        upkeep_reduction: { label: '-0.1 к upkeep зданий', category: 'civic', max: 2 }
    };

    // 100500 diversity pools — локальный фолбэк когда нет LLM, как в tribes-legacy.html
    // Каждый игрок получает уникальные названия из этих пулов + seeded random
    const DIVERSITY_POOLS = {
        // Наука: по ветвям — префиксы и суффиксы для уникальных имён
        sciencePrefixes: {
            agriculture: ['Запруды', 'Ирригация', 'Севооборот', 'Закрома', 'Пахота', 'Хлебные ямы', 'Глиняные амбары', 'Речные огороды'],
            stonecraft: ['Кремень', 'Обсидиан', 'Тёсаный камень', 'Керамика', 'Плетение', 'Кожевня', 'Резьба', 'Кузнечный горн'],
            seasonal: ['Звёздный круг', 'Лунный календарь', 'Солнечные метки', 'Птичий календарь', 'Счёт паводков', 'Тени камней', 'Ветры и росы'],
            warfare: ['Копейный строй', 'Пращники', 'Засада', 'Сторожа', 'Сигнальные костры', 'Клич и щит', 'Дружина'],
            fortification: ['Частокол', 'Земляной вал', 'Каменные ворота', 'Башни', 'Ров и насыпь', 'Укрытия', 'Дозор'],
            metallurgy: ['Медные жилы', 'Плавка', 'Тигля', 'Ковка', 'Литьё', 'Рудный поиск', 'Горновой мех'],
            bronze: ['Бронзовый сплав', 'Олово и медь', 'Литейные формы', 'Закалка', 'Инструменты', 'Бронзовый век'],
            horse: ['Приручение коня', 'Повозки', 'Курганы', 'Кони Ямной', 'Колесницы', 'Всадники степи', 'Табун'],
            writing: ['Клинопись', 'Иероглифы', 'Счётные таблички', 'Дом табличек', 'Школа писцов', 'Учёт зерна', 'Печать'],
            'irrigation-empire': ['Каналы фараона', 'Закрома Аккада', 'Налоги зерном', 'Ирригационная империя', 'Домен', 'Государство']
        },
        scienceSuffixes: ['практики', 'наблюдений', 'опыт общины', 'старших', 'ремесла', 'уклада', 'заповедь', 'знание', 'приём'],
        buildingPrefixes: {
            food: ['Речная запруда', 'Зерновой амбар', 'Пойменный стан', 'Общий загон', 'Иловые поля'],
            materials: ['Каменная мастерская', 'Лесной стан', 'Кремнёвый навес', 'Древесный двор', 'Каменоломня'],
            knowledge: ['Календарный круг', 'Звёздная площадка', 'Дом писцов', 'Место наблюдений', 'Солнечные камни'],
            copper: ['Медная плавильня', 'Тигельный двор', 'Малахитовая мастерская', 'Горн у жилы'],
            tin: ['Оловянный склад', 'Караванный стан', 'Торговый двор', 'Перевальный рынок'],
            salt: ['Солеварня', 'Соляной склад', 'Белые копи', 'Соляной двор'],
            settlement: ['Форпост', 'Общий двор', 'Пограничный стан', 'Застава', 'Крепкие ворота']
        },
        regionEvents: {
            food: ['запруды удержали воду и рыбу', 'первые канавы напоили сухую землю', 'в амбарах сохранили запас до нового разлива'],
            materials: ['в склоне нашли ровный камень для стен', 'сухие брёвна пригодились для новых крыш', 'мастера отобрали крепкий кремень'],
            knowledge: ['старейшины сопоставили звёзды с паводком', 'наблюдатели отметили начало сухого сезона', 'дети запомнили счёт теней на камнях'],
            copper: ['медь отделилась от породы в малом горне', 'зелёный малахит подсказал, где искать руду', 'первый слиток обменяли на зерно'],
            tin: ['путники принесли вести с оловянной тропы', 'редкая руда дошла до общины через обмен', 'караван прошёл перевал до первых дождей'],
            salt: ['соль уложили в сосуды для долгого хранения', 'белые кристаллы обменяли на шкуры и зерно', 'солевой промысел спас припасы от сырости'],
            settlement: ['дозорные укрепили ворота и вернулись к дозору', 'соседние земли дали рынку новых ремесленников', 'поселение собрало людей для общего частокола']
        },
        buildingSuffixes: ['общины', 'рода', 'клана', 'поселения', 'у реки', 'на холме', 'старших', 'кузнецов', 'пахарей'],
        adjectives: ['Большой', 'Малый', 'Старый', 'Новый', 'Верхний', 'Нижний', 'Солнечный', 'Медный', 'Каменный', 'Речной', 'Лесной', 'Степной', 'Северный', 'Южный'],
        // Уникальные черты для истории цивилизации
        chronicleTemplates: [
            'В день {day} старейшины {clan} заметили: {event}. Это стало частью уклада.',
            'Эпоха {era}: {clan} помнит {event} как поворот.',
            'Летопись {clan}: день {day} — {event}.',
            'Дети {clan} будут рассказывать про {event} у костра.'
        ],
        events: {
            agriculture: ['первый урожай с новых полей', 'заполненные до краёв закрома', 'река принесла ил', 'запруда удержала рыбу'],
            stonecraft: ['камень поддался руке мастера', 'новый инструмент режет как клык', 'печь обожгла горшки без трещин'],
            seasonal: ['звёзды совпали с разливом', 'луна подсказала время сева', 'птицы вернулись раньше обычного'],
            warfare: ['дружина вернулась с добычей', 'сигнальные костры зажглись вовремя', 'враг не решился подойти'],
            fortification: ['частокол выдержал набег', 'ворота закрылись за миг до врага', 'ров наполнился водой'],
            horse: ['первый конь дал себя оседлать', 'повозка скрипит по степи', 'курган насыпан над вождём'],
            writing: ['первая табличка исписана', 'писец подсчитал зерно', 'печать оттиснута на глине'],
            metallurgy: ['медь потекла как воск', 'первый слиток блестит на солнце', 'горн загудел сильнее'],
            bronze: ['бронза звенит как колокол', 'новый сплав не гнётся', 'инструменты режут камень'],
            'irrigation-empire': ['каналы наполнились водой', 'закрома полны', 'налог собран']
        }
    };

    function seededRandom(seed) {
        // simple mulberry32
        let t = seed >>> 0;
        return function () {
            t += 0x6D2B79F5;
            let r = Math.imul(t ^ (t >>> 15), 1 | t);
            r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
            return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
    }
    function hashString(str) {
        let h = 2166136261;
        for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
        return h >>> 0;
    }
    function pickRandom(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

    function generateLocalScienceVariants(branchId, playerSeed, count) {
        const rng = seededRandom(playerSeed + hashString(branchId));
        const prefixes = DIVERSITY_POOLS.sciencePrefixes[branchId] || DIVERSITY_POOLS.sciencePrefixes.seasonal;
        const suffixes = DIVERSITY_POOLS.scienceSuffixes;
        const branch = SCIENCE_BRANCHES.find(b => b.id === branchId);
        const events = DIVERSITY_POOLS.events[branchId] || DIVERSITY_POOLS.events.seasonal;
        const variants = [];
        for (let i = 0; i < count; i++) {
            const pre = pickRandom(rng, prefixes);
            const suf = pickRandom(rng, suffixes);
            const adj = rng() > 0.6 ? pickRandom(rng, DIVERSITY_POOLS.adjectives) + ' ' : '';
            // 3 разных эффекта с trade-off: один основной + один побочный
            const mainEffect = branch.effect;
            const secondaryPool = EFFECT_KEYS.filter(k => k !== mainEffect);
            const secondary = pickRandom(rng, secondaryPool);
            const effects = [{ type: mainEffect, amount: 1 }];
            if (rng() > 0.35) effects.push({ type: secondary, amount: 1 });
            // иногда trade-off: больше еды но меньше знаний и т.д.
            variants.push({
                scienceName: adj + pre + ' — ' + suf,
                scienceDescription: pickRandom(rng, events) + '. ' + branch.prompt + ' — местные условия диктуют свой путь.',
                buildingName: adj + (DIVERSITY_POOLS.buildingPrefixes[branchId]?.[i % 6] || pre) + ' ' + pickRandom(rng, DIVERSITY_POOLS.buildingSuffixes),
                buildingDescription: 'Уникальная постройка общины: ' + pickRandom(rng, events) + '. Даёт ' + effects.map(e => EFFECTS[e.type]?.label || e.type).join(' и ') + '.',
                category: branch.category,
                effects
            });
        }
        return variants;
    }

    function generateLocalRegionFlavor(region, playerSeed) {
        const definition = typeof region === 'string' ? getWorldTile(state?.world, region) : region;
        const siteType = definition?.siteType || 'materials';
        const rng = seededRandom((Number(playerSeed) || 0) + hashString(definition?.id || siteType) + 42);
        const prefixes = DIVERSITY_POOLS.buildingPrefixes[siteType] || DIVERSITY_POOLS.buildingPrefixes.materials;
        const name = pickRandom(rng, DIVERSITY_POOLS.adjectives) + ' ' + pickRandom(rng, prefixes) + ' ' + pickRandom(rng, DIVERSITY_POOLS.buildingSuffixes);
        const eventPool = DIVERSITY_POOLS.regionEvents[siteType] || DIVERSITY_POOLS.regionEvents.materials;
        const event = pickRandom(rng, eventPool);
        return { name: name.slice(0, 80), description: (event + '. Постройка общины, приспособленная к местности.').slice(0, 200) };
    }

    function generateChronicleEntry(state, branchId, projectName) {
        const rng = seededRandom(hashString(state.player.name + state.player.clan + String(state.day) + branchId));
        const template = pickRandom(rng, DIVERSITY_POOLS.chronicleTemplates);
        const event = projectName || pickRandom(rng, DIVERSITY_POOLS.events[branchId] || Object.values(DIVERSITY_POOLS.events).flat());
        return template
            .replace('{day}', String(state.day))
            .replace('{era}', eraName(state.player.era))
            .replace('{clan}', state.player.clan)
            .replace('{event}', event);
    }
    const EFFECT_KEYS = Object.keys(EFFECTS);
    const CATEGORIES = ['military', 'economy', 'science', 'civic'];
    const CATEGORY_NAMES = { military: 'военное', economy: 'экономическое', science: 'научное', civic: 'общественное' };
    const ORIGINS = [
        { id: 'river', name: 'Народ Великой Реки', place: 'Плодородные речные берега', icon: '🌊', description: 'Разливы кормят поселение и облегчают первые запасы. Как Нил в Египте.', resource: 'food', bonus: 2, biome: 'river', historical: 'Египет Древнего царства — ирригация и закрома' },
        { id: 'highlands', name: 'Народ Каменных Холмов', place: 'Предгорья с кремнёвыми выходами', icon: '⛰️', description: 'Камень и кремень рядом — легче начать ремесло и строительство. Как Анатолия.', resource: 'materials', bonus: 2, biome: 'highlands', historical: 'Чатал-Хююк, обсидиановые пути' },
        { id: 'woodland', name: 'Народ Лесных Троп', place: 'Лесная опушка и сезонные пастбища', icon: '🌲', description: 'Знания о растениях, животных и временах года помогают учиться.', resource: 'knowledge', bonus: 2, biome: 'forest', historical: 'Триполье-Кукутень, лесные земледельцы' },
        { id: 'steppe', name: 'Дети Ямной Степи', place: 'Понтийско-Каспийская степь, курганы', icon: '🐎', description: 'Ямная культура — ямы-катакомбы, кони, повозки. Подвижность и скотоводство.', resource: 'food', bonus: 1, biome: 'steppe', historical: 'Ямная культура 3300-2600 до н.э., предки индоевропейцев' },
        { id: 'desert', name: 'Люди Чёрной Земли', place: 'Кемет — чёрная земля Нила и пустыня', icon: '🏜️', description: 'Аккад и Шумер — первые города, клинопись, ирригация в пустыне.', resource: 'knowledge', bonus: 1, biome: 'desert', historical: 'Аккад Саргона, Шумер, первые империи' },
        { id: 'coast', name: 'Береговые Рыбаки', place: 'Морское побережье и лиманы', icon: '⚓', description: 'Рыба, соль, ракушки — торговля по воде. Как Эгейские культуры.', resource: 'food', bonus: 2, biome: 'coast', historical: 'Эгейский мир, Минойцы, торговля обсидианом' },
        { id: 'oasis', name: 'Оазисные Садовники', place: 'Оазис в сухой степи', icon: '🌴', description: 'Финиковые пальмы, колодцы, караванные пути. Как Набатея в зачатке.', resource: 'materials', bonus: 1, biome: 'oasis', historical: 'Оазисы Аравии, пути ладана' },
        { id: 'marsh', name: 'Болотные Строители', place: 'Болотистые топи и плавни', icon: '🐊', description: 'Свайные поселения, как в Альпах. Защита водой и изобилие рыбы.', resource: 'food', bonus: 2, biome: 'marsh', historical: 'Свайные поселения Альп, Варна — золото' }
    ];

    // Исторические биомы и черты — ближе к легаси POOLS, но с историчностью
    const BIOMES = [
        { id: 'river', name: 'Великая Река', icon: '🌊', desc: 'Нил, Евфрат, Инд — разливы дают ил и жизнь. Египет, Шумер, Хараппа', yields: { food: 1, materials: 0, knowledge: 0 } },
        { id: 'steppe', name: 'Бескрайняя Степь', icon: '🌾', desc: 'Понтийско-Каспийская степь, Ямная культура — курганы, кони, повозки', yields: { food: 0.5, materials: 0.5, knowledge: 0 } },
        { id: 'desert', name: 'Каменистая Пустыня', icon: '🏜️', desc: 'Аккад, Аравия — оазисы, караваны, первые империи Саргона', yields: { food: 0, materials: 0.5, knowledge: 0.5 } },
        { id: 'highlands', name: 'Высокие Предгорья', icon: '🏔️', desc: 'Кавказ, Загрос — обсидиан, медь, крепости. Чатал-Хююк', yields: { food: 0, materials: 1, knowledge: 0 } },
        { id: 'forest', name: 'Лиственный Лес', icon: '🍂', desc: 'Триполье, Европейский неолит — земледелие, керамика, большие поселения', yields: { food: 0.5, materials: 0, knowledge: 0.5 } },
        { id: 'coast', name: 'Морское Побережье', icon: '🏖️', desc: 'Эгейское море, Левант — рыба, пурпур, торговля. Минойцы', yields: { food: 0.5, materials: 0, knowledge: 0.5 } },
        { id: 'oasis', name: 'Оазис', icon: '🌴', desc: 'Финиковые рощи, колодцы — остров жизни. Набатея, Гарма', yields: { food: 1, materials: 0, knowledge: 0 } },
        { id: 'marsh', name: 'Болотистые Топи', icon: '🐊', desc: 'Свайные поселения, плавни — защита и рыба. Варненский некрополь', yields: { food: 1, materials: 0, knowledge: 0 } },
        { id: 'tundra', name: 'Северная Тундра', icon: '❄️', desc: 'Мхи, олени, короткий сезон. Северные охотники', yields: { food: 0, materials: 0.5, knowledge: 0 } },
        { id: 'savanna', name: 'Саванна', icon: '🦁', desc: 'Жаркие луга, стада. Африканский рог — первые скотоводы', yields: { food: 0.5, materials: 0, knowledge: 0.5 } }
    ];
    const GEOGRAPHY = [
        { id: 'great-river', name: 'Великая Река', icon: '🌊', desc: 'Нил, Тигр и Евфрат — плодородные берега, как в Египте и Шумере' },
        { id: 'mountains', name: 'Высокие Горы', icon: '🏔️', desc: 'Кавказ, Загрос — обсидиан и медь, пещеры и крепости' },
        { id: 'volcano', name: 'Огненная Гора', icon: '🌋', desc: 'Вулкан даёт плодородный пепел и обсидиан, как в Анатолии' },
        { id: 'lake', name: 'Глубокое Озеро', icon: '💧', desc: 'Ван, Урмия — рыба, соль, торговые пути' },
        { id: 'canyon', name: 'Каньон', icon: '🪨', desc: 'Ущелья с наскальными рисунками, как в Тассилин-Аджер' },
        { id: 'caves', name: 'Скальные Пещеры', icon: '🕳️', desc: 'Пещеры с росписями, укрытие как в Ласко и Альтамире' },
        { id: 'springs', name: 'Термальные Источники', icon: '♨️', desc: 'Горячие ключи — лечение и ритуалы' },
        { id: 'delta', name: 'Дельта Реки', icon: '🌿', desc: 'Болотистая дельта Нила — папирус, рыба, защита' }
    ];
    const TRAITS = [
        { id: 'hunters', name: 'Бесстрашные охотники', icon: '🏹', desc: 'Степные охотники Ямной культуры — лук и конь', bonus: { food: 0.2 } },
        { id: 'gatherers', name: 'Искусные собиратели', icon: '🧺', desc: 'Трипольские земледельцы — знают каждый корень', bonus: { food: 0.3 } },
        { id: 'night-watch', name: 'Ночные наблюдатели', icon: '🌙', desc: 'Жрецы Египта — звёзды и календарь', bonus: { knowledge: 0.3 } },
        { id: 'strong', name: 'Крепкие телом', icon: '💪', desc: 'Строители мегалитов — Стоунхендж, Карнак', bonus: { materials: 0.3 } },
        { id: 'spirits', name: 'Говорящие с духами', icon: '👻', desc: 'Шаманы степи, курганные ритуалы', bonus: { knowledge: 0.2 } },
        { id: 'stone-masters', name: 'Мастера камня', icon: '🪨', desc: 'Аккадские камнерезы, обсидиан Анатолии', bonus: { materials: 0.4 } },
        { id: 'runners', name: 'Бегуны', icon: '🦶', desc: 'Гонцы империи Аккада — быстрые как ветер', bonus: { food: 0.1, materials: 0.1 } },
        { id: 'singers', name: 'Певцы у костра', icon: '🎵', desc: 'Сказители Гильгамеша, песни у костра', bonus: { knowledge: 0.2 } },
        { id: 'horse-lords', name: 'Владыки Коней', icon: '🐎', desc: 'Ямники — первые всадники, повозки и курганы', bonus: { food: 0.2, materials: 0.1 } },
        { id: 'irrigators', name: 'Строители Каналов', icon: '🚿', desc: 'Шумеры — первые ирригационные системы', bonus: { food: 0.4 } }
    ];
    const NEARBY = [
        { id: 'aurochs', name: 'Стада диких быков', icon: '🐂', desc: 'Туры степи — мясо и шкуры, как у ямников' },
        { id: 'wolves', name: 'Стая хищников', icon: '🐺', desc: 'Волки и львы — опасность и испытание' },
        { id: 'aurora', name: 'Северное сияние', icon: '🌌', desc: 'Небесные огни — знак богов' },
        { id: 'poison', name: 'Ядовитые травы', icon: '☠️', desc: 'Красивые но смертельные — знание лекарей' },
        { id: 'flint', name: 'Залежи кремня', icon: '🔥', desc: 'Кремень — огонь и оружие, как в Гран-Прессиньи' },
        { id: 'bees', name: 'Дикие пчёлы', icon: '🐝', desc: 'Мёд — золото неолита' },
        { id: 'clay', name: 'Глиняные берега', icon: '🏺', desc: 'Глина — керамика Триполья и шумерские таблички' },
        { id: 'obsidian', name: 'Обсидиановые россыпи', icon: '🖤', desc: 'Вулканическое стекло — торговля Анатолии' },
        { id: 'copper-vein', name: 'Медная жила', icon: '🟠', desc: 'Малахит и медь — начало металлургии' },
        { id: 'salt', name: 'Соляные копи', icon: '🧂', desc: 'Соль — богатство и сохранение пищи' }
    ];
    const HISTORICAL_CULTURES = [
        { id: 'yamnaya', name: 'Ямная культура', icon: '🐎', era: 0, desc: '3300-2600 до н.э., Понтийско-Каспийская степь — ямные погребения, курганы, первые кони, повозки. Предки индоевропейцев', bonus: { food: 0.2, materials: 0.2 } },
        { id: 'sumer', name: 'Шумер', icon: '🏛️', era: 0, desc: 'Урук, Ур — первые города, клинопись, зиккураты. 4000-2000 до н.э.', bonus: { knowledge: 0.3 } },
        { id: 'akkad', name: 'Аккад Саргона', icon: '⚔️', era: 1, desc: 'Первая империя в истории, Саргон Великий 2334-2279 до н.э. — от Персидского залива до Средиземного моря', bonus: { materials: 0.2, deck_slots: 1 } },
        { id: 'egypt-old', name: 'Древнее Царство Египта', icon: '🔺', era: 1, desc: 'Пирамиды Гизы, фараоны Джосер, Хеопс — 2686-2181 до н.э., Нил и маат', bonus: { food: 0.3, storage: 5 } },
        { id: 'harappa', name: 'Хараппа', icon: '🐘', era: 1, desc: 'Индская цивилизация — Мохенджо-Даро, канализация, стандартные кирпичи. 2600-1900 до н.э.', bonus: { food: 0.2, knowledge: 0.2 } },
        { id: 'minoan', name: 'Минойцы', icon: '🐂', era: 2, desc: 'Крит, Кносс — дворец-лабиринт, быки, морская торговля. 2700-1450 до н.э.', bonus: { materials: 0.2, knowledge: 0.2 } },
        { id: 'hittite', name: 'Хетты', icon: '⚒️', era: 2, desc: 'Хаттуса, железо, колесницы — первая империя железного века', bonus: { materials: 0.3 } },
        { id: 'assyria', name: 'Ассирия', icon: '🦁', era: 3, desc: 'Ашшур, Ниневия — военная машина, библиотеки, рельефы', bonus: { deck_slots: 1 } }
    ];
    const OPENING_FOCUSES = [
        { id: 'food', title: 'Надёжные запасы', icon: '🌾', scienceName: 'Рыбные запруды', scienceDescription: 'Наблюдения за течением помогают удерживать рыбу у берега.', buildingName: 'Речная запруда', buildingDescription: 'Плетёные заграждения дают поселению устойчивый источник пищи.', category: 'economy', effect: 'income_food' },
        { id: 'materials', title: 'Каменное ремесло', icon: '🪨', scienceName: 'Обработка кремня', scienceDescription: 'Подбор формы и угла скола делает каменные орудия надёжнее.', buildingName: 'Каменная мастерская', buildingDescription: 'Общая мастерская ускоряет заготовку строительных материалов.', category: 'economy', effect: 'income_materials' },
        { id: 'knowledge', title: 'Сезонные наблюдения', icon: '📚', scienceName: 'Круг времён года', scienceDescription: 'Повторяющиеся знаки природы помогают заранее готовиться к сезонам.', buildingName: 'Календарный круг', buildingDescription: 'Место наблюдений поддерживает передачу знаний между поколениями.', category: 'science', effect: 'income_knowledge' }
    ];
    const REGION_CAPTURE_COST = { food: 2, materials: 2, knowledge: 0 };
    const REGION_EXPEDITION_COST = { food: 4, materials: 2, knowledge: 0 };
    const REGION_BUILDINGS = {
        food: { id: 'irrigation', name: 'Ирригация и запруды', cost: { materials: 4 }, yields: { food: 2, materials: 0, knowledge: 0 }, workerBonus: { food: 0.3 }, description: 'Запруды и канавы дают +2🌾 в день и помогают земледельцам.' },
        materials: { id: 'quarry', name: 'Каменный и древесный стан', cost: { materials: 4 }, yields: { food: 0, materials: 2, knowledge: 0 }, workerBonus: {}, description: 'Местное сырьё даёт +2🪵 в день.' },
        knowledge: { id: 'observatory', name: 'Место наблюдений', cost: { materials: 3, knowledge: 1 }, yields: { food: 0, materials: 0, knowledge: 2 }, workerBonus: {}, description: 'Знаки природы и неба дают +2📚 в день.' },
        copper: { id: 'smelter', name: 'Медная плавильня', cost: { materials: 5, knowledge: 1 }, yields: { food: 0, materials: 1, knowledge: 0 }, workerBonus: {}, unlocks: ['refined'], description: '+1🪵 в день и открывает отборное сырьё.' },
        tin: { id: 'caravan', name: 'Оловянный торговый стан', cost: { materials: 4, food: 1 }, yields: { food: 0, materials: 1, knowledge: 0 }, workerBonus: {}, unlocks: ['masterwork'], description: '+1🪵 в день; вместе с медной плавильней открывает мастерское сырьё.' },
        salt: { id: 'salt-works', name: 'Солеварня', cost: { materials: 4 }, yields: { food: 0, materials: 1, knowledge: 1 }, workerBonus: {}, description: '+1🪵 и +1📚 в день.' },
        settlement: { id: 'outpost', name: 'Форпост', cost: { materials: 6 }, yields: { food: 1, materials: 1, knowledge: 1 }, workerBonus: {}, description: 'Форпост в покорённом поселении даёт по +1 каждого ресурса.' }
    };

    function getWorldTiles(world) { return world?.tiles || []; }
    function getWorldTile(world, tileId) { return getWorldTiles(world).find(tile => tile.id === tileId) || null; }
    function getRegionBuilding(definition) { return definition ? REGION_BUILDINGS[definition.siteType] || null : null; }
    function createStartingRegions(world) {
        return getWorldTiles(world).map(tile => ({
            id: tile.id,
            ownerId: tile.initialOwner || null,
            capturedDay: tile.initialOwner ? 1 : null,
            building: null,
            buildingFlavor: null
        }));
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
    function createDefaultOpponents() {
        return [
            { id: 'reed', name: 'Илмар из Речных Земель', clan: 'Речной Союз', era: 0, research: 0, pace: 4, offset: 1, rating: 1040, leader: false },
            { id: 'steppe', name: 'Тархан Степной', clan: 'Степной Круг', era: 2, research: 0, pace: 3, offset: 2, rating: 1125, leader: true },
            { id: 'north', name: 'Эйрик Каменный Пояс', clan: 'Северный Пакт', era: 1, research: 1, pace: 2, offset: 1, rating: 980, leader: false }
        ];
    }
    function createState(seed) {
        const opponents = createDefaultOpponents();
        const world = CampaignMap.generateWorld(seed, opponents);
        return {
            version: 4,
            season: 1,
            day: 1,
            medals: [],
            player: {
                name: 'Твоё поселение', clan: 'Медный Ворон', era: 0, research: 0,
                onboardingComplete: false, originId: null, openingFocusId: null,
                biome: null, geography: null, trait: null, nearby: null, historicalCulture: null, culturalLineage: [],
                resources: { food: 10, materials: 10, knowledge: 6 },
                population: POP_START,
                workers: { food: 2, materials: 1, knowledge: 1, idle: 1 },
                storageCap: STORAGE_BASE,
                ap: AP_MAX,
                apMax: AP_MAX,
                decree: null,
                decrees: [],
                pendingDecreeChoice: false,
                growthProgress: 0,
                growthDebt: 0,
                starvationDays: 0,
                dailyOrders: createDailyOrders(), actionUsed: false, pendingExpedition: null, campaignNotice: '',
                craftLevel: 0, craftXp: 0, nextCraftOrderId: 1, craftOrders: [],
                buildings: [makeStarterBuilding()],
                activeBuildingSlots: 4,
                blueprints: [],
                scienceChoices: null,
                chronicle: [],
                deckCardIds: [],
                practice: { wins: 0, losses: 0, leaderWins: 0, leaderLosses: 0 }
            },
            opponents,
            world,
            regions: createStartingRegions(world)
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

    function normalizeRegions(raw, opponents, world, preserveTerritory) {
        const savedRegions = Array.isArray(raw) ? raw : [];
        const validOwners = new Set(['player', ...opponents.map(opponent => opponent.id)]);
        return getWorldTiles(world).map(definition => {
            const saved = preserveTerritory ? savedRegions.find(region => region && region.id === definition.id) : null;
            const isWater = definition.terrain === 'water';
            const isHome = definition.x === CampaignMap.CENTER.x && definition.y === CampaignMap.CENTER.y;
            let ownerId = saved ? saved.ownerId : definition.initialOwner || null;
            if (ownerId !== null && !validOwners.has(ownerId)) ownerId = definition.initialOwner || null;
            if (isWater) ownerId = null;
            if (isHome) ownerId = 'player';

            const buildingDefinition = getRegionBuilding(definition);
            const building = saved && ownerId === 'player' && buildingDefinition && saved.building === buildingDefinition.id
                ? buildingDefinition.id
                : null;
            let buildingFlavor = null;
            if (building && saved?.buildingFlavor && typeof saved.buildingFlavor === 'object') {
                buildingFlavor = {
                    name: String(saved.buildingFlavor.name || '').slice(0, 80),
                    description: String(saved.buildingFlavor.description || '').slice(0, 400)
                };
            }
            return {
                id: definition.id,
                ownerId,
                capturedDay: ownerId === null ? null : clampInt(saved?.capturedDay || definition.initialOwner && 1, 1, SEASON_LENGTH, 1),
                building,
                buildingFlavor
            };
        });
    }

    function normalizedPendingExpedition(raw, state) {
        if (!raw || typeof raw !== 'object') return null;
        const definition = getWorldTile(state.world, raw.regionId);
        const record = state.regions.find(region => region.id === raw.regionId);
        const opponent = state.opponents.find(item => item.id === raw.opponentId);
        if (!definition || definition.kind !== 'settlement' || definition.terrain === 'water' || !record || !opponent || record.ownerId !== opponent.id) return null;
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
            const currentSettlement = state.regions.some(region => region.ownerId === 'player' && region.capturedDay === day
                && getWorldTile(state.world, region.id)?.kind !== 'home');
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
        const isV2 = value.version === 2;
        const isLegacyMapSave = value.version === 2 || value.version === 3;
        if (![2, 3, 4].includes(value.version)) return base;
        const state = { ...base, ...value };
        state.version = 4;
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
        state.player.decrees = Array.isArray(state.player.decrees) ? state.player.decrees.filter(d => d && typeof d.id === 'string' && DECREES[d.id]).map(d => ({
            id: d.id,
            era: clampInt(d.era, 0, ERAS.length - 1, 0),
            chosenDay: clampInt(d.chosenDay, 1, SEASON_LENGTH, 1)
        })).slice(-10) : (state.player.decree ? [{ id: state.player.decree, era: state.player.era, chosenDay: 1 }] : []);
        if (state.player.decrees.length > 0) state.player.decree = state.player.decrees[state.player.decrees.length - 1].id;
        state.player.pendingDecreeChoice = Boolean(state.player.pendingDecreeChoice);
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
        // scienceChoices: 3 варианта на выбор от ИИ (как в кузнице)
        if (value.player?.scienceChoices && typeof value.player.scienceChoices === 'object') {
            const sc = value.player.scienceChoices;
            if (Array.isArray(sc.projects) && sc.projects.length >= 1 && sc.projects.length <= 3) {
                const cleanProjects = sc.projects.map(p => ({
                    scienceName: String(p.scienceName || '').slice(0, 80),
                    scienceDescription: String(p.scienceDescription || '').slice(0, 400),
                    buildingName: String(p.buildingName || '').slice(0, 80),
                    buildingDescription: String(p.buildingDescription || '').slice(0, 400),
                    category: CATEGORIES.includes(p.category) ? p.category : 'civic',
                    effects: cleanEffects(p.effects) || [{ type: 'income_food', amount: 1 }]
                })).filter(p => p.scienceName && p.buildingName);
                if (cleanProjects.length) {
                    state.player.scienceChoices = {
                        branchId: String(sc.branchId || '').slice(0, 30),
                        day: clampInt(sc.day, 1, SEASON_LENGTH, 1),
                        projects: cleanProjects
                    };
                } else state.player.scienceChoices = null;
            } else state.player.scienceChoices = null;
        } else state.player.scienceChoices = null;
        // биомы и черты как в легаси — для разнообразия и историчности
        const findById = (pool, id) => pool.find(x => x.id === id) || null;
        const findByIdOrName = (pool, raw) => {
            if (!raw) return null;
            if (typeof raw === 'object' && raw.id) return findById(pool, raw.id) || raw;
            if (typeof raw === 'string') return findById(pool, raw) || pool.find(x => x.name === raw) || null;
            return null;
        };
        state.player.biome = findByIdOrName(BIOMES, value.player?.biome) || (value.player?.biome && typeof value.player.biome === 'object' ? value.player.biome : null);
        state.player.geography = findByIdOrName(GEOGRAPHY, value.player?.geography) || (value.player?.geography && typeof value.player.geography === 'object' ? value.player.geography : null);
        state.player.trait = findByIdOrName(TRAITS, value.player?.trait) || (value.player?.trait && typeof value.player.trait === 'object' ? value.player.trait : null);
        state.player.nearby = findByIdOrName(NEARBY, value.player?.nearby) || (value.player?.nearby && typeof value.player.nearby === 'object' ? value.player.nearby : null);
        state.player.historicalCulture = findByIdOrName(HISTORICAL_CULTURES, value.player?.historicalCulture) || (value.player?.historicalCulture && typeof value.player.historicalCulture === 'object' ? value.player.historicalCulture : null);
        state.player.culturalLineage = Array.isArray(value.player?.culturalLineage) ? value.player.culturalLineage.filter(id => typeof id === 'string' && HISTORICAL_CULTURES.some(c=>c.id===id)).slice(0,10) : (state.player.historicalCulture ? [state.player.historicalCulture.id] : []);
        state.player.chronicle = Array.isArray(value.player?.chronicle) ? value.player.chronicle.slice(-20).map(entry => ({
            day: clampInt(entry.day, 1, SEASON_LENGTH, 1),
            era: clampInt(entry.era, 0, ERAS.length - 1, 0),
            text: String(entry.text || '').slice(0, 500)
        })).filter(e => e.text) : [];
        state.player.deckCardIds = Array.isArray(state.player.deckCardIds) ? [...new Set(state.player.deckCardIds.filter(id => typeof id === 'string'))].slice(0, 8) : [];
        state.opponents = Array.isArray(value.opponents) && value.opponents.length
            ? value.opponents.map((opponent, i) => ({ ...base.opponents[i % base.opponents.length], ...opponent,
                era: clampInt(opponent.era, 0, ERAS.length - 1, 0), research: clampInt(opponent.research, 0, 1, 0),
                pace: clampInt(opponent.pace, 1, 10, 3), offset: clampInt(opponent.offset, 0, 10, 0), rating: clampInt(opponent.rating, 0, 99999, 1000)
            })) : base.opponents;
        const legacyWorldSeed = hashString([
            state.player.name, state.player.clan, String(state.season), String(state.day), String(state.player.era)
        ].join('|'));
        state.world = isLegacyMapSave
            ? CampaignMap.generateWorld(legacyWorldSeed, state.opponents)
            : CampaignMap.normalizeWorld(value.world, state.opponents);
        state.regions = normalizeRegions(value.regions, state.opponents, state.world, !isLegacyMapSave);
        state.player.pendingExpedition = isLegacyMapSave ? null : normalizedPendingExpedition(value.player?.pendingExpedition, state);
        if (isLegacyMapSave && Array.isArray(value.regions)) {
            state.player.campaignNotice = 'Создана новая карта 7×7. Владения прежней карты не перенесены.';
        }
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
        // --- историчность и биомы как в легаси ---
        const seed = hashString(state.player.name + state.player.clan + originId);
        const rng = seededRandom(seed);
        // биом от происхождения или случайный
        const biomePool = BIOMES.filter(b => !origin.biome || b.id === origin.biome);
        state.player.biome = pickRandom(rng, biomePool.length ? biomePool : BIOMES);
        state.player.geography = pickRandom(rng, GEOGRAPHY);
        state.player.trait = pickRandom(rng, TRAITS);
        state.player.nearby = pickRandom(rng, NEARBY);
        // историческая культура по эпохе 0 + линия культур (эволюция)
        const histPool = HISTORICAL_CULTURES.filter(h => h.era <= 1);
        state.player.historicalCulture = pickRandom(rng, histPool);
        state.player.culturalLineage = [state.player.historicalCulture.id];
        // бонус от черты
        if (state.player.trait && state.player.trait.bonus) {
            for (const k of Object.keys(state.player.trait.bonus)) {
                if (k === 'food' || k === 'materials' || k === 'knowledge') {
                    state.player.resources[k] = Math.min(999, state.player.resources[k] + Math.round(state.player.trait.bonus[k] * 5));
                }
            }
        }
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
        // первая запись летописи с историчностью
        const originHist = origin.historical || '';
        state.player.chronicle = [{
            day: 1,
            era: 0,
            text: 'Народ ' + state.player.clan + ' из ' + state.player.biome.name + ' (' + state.player.biome.desc + '). Рядом ' + state.player.geography.name + ' — ' + state.player.geography.desc + '. Черта: ' + state.player.trait.name + '. Наследие: ' + originHist + '. Как ' + state.player.historicalCulture.name + ' — ' + state.player.historicalCulture.desc
        }];
        state.player.onboardingComplete = true;
        return { state, error: null };
    }

    function effectTotals(state) {
        const totals = {};
        for (const k of Object.keys(EFFECTS)) totals[k] = 0;
        const active = state.player.buildings.filter(building => building.active).slice(0, state.player.activeBuildingSlots);
        for (const building of active) for (const effect of building.effects || []) {
            if (Object.hasOwn(totals, effect.type)) totals[effect.type] += effect.amount;
        }
        return totals;
    }

    function getActiveDecrees(state) {
        const list = Array.isArray(state.player.decrees) ? state.player.decrees : [];
        return list.map(d => DECREES[d.id]).filter(Boolean);
    }

    function getFoodConsumption(input) {
        const state = normalizeState(input);
        let mult = 1.0;
        for (const dec of getActiveDecrees(state)) {
            if (dec.bonuses.consumptionMult) mult *= dec.bonuses.consumptionMult;
        }
        return state.player.population * FOOD_CONSUMPTION_PER_POP * mult;
    }

    function getStorageCap(input) {
        const state = normalizeState(input);
        let cap = STORAGE_BASE;
        const activeBuildings = state.player.buildings.filter(b => b.active);
        cap += activeBuildings.length * 2;
        for (const dec of getActiveDecrees(state)) {
            if (dec.bonuses.storage) cap += dec.bonuses.storage;
        }
        const totals = effectTotals(state);
        cap += (totals.storage_bonus || 0) * 5;
        const hasGranary = activeBuildings.some(b => b.effects.some(e => e.type === 'income_food'));
        if (hasGranary) cap += 3;
        // Историческая культура Египта даёт +склад (закрома фараона)
        if (state.player.historicalCulture && state.player.historicalCulture.bonus && state.player.historicalCulture.bonus.storage) {
            cap += state.player.historicalCulture.bonus.storage;
        }
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
                if (eff.type === 'trade_bonus') { bonusMat += 0.3 * eff.amount; bonusKnow += 0.2 * eff.amount; }
            }
        }
        for (const dec of getActiveDecrees(state)) {
            if (dec.bonuses.workerBonus) {
                bonusFood += dec.bonuses.workerBonus.food || 0;
                bonusMat += dec.bonuses.workerBonus.materials || 0;
                bonusKnow += dec.bonuses.workerBonus.knowledge || 0;
            }
        }
        const hasRegionalIrrigation = state.regions.some(region => region.ownerId === 'player' && region.building === 'irrigation');
        if (hasRegionalIrrigation && bonusFood > 0) bonusFood += 0.3;

        const workerProd = {
            food: workers.food * (WORKER_BASE_YIELD.food + bonusFood),
            materials: workers.materials * (WORKER_BASE_YIELD.materials + bonusMat),
            knowledge: workers.knowledge * (WORKER_BASE_YIELD.knowledge + bonusKnow)
        };

        const regional = { food: 0, materials: 0, knowledge: 0 };
        for (const region of state.regions) {
            if (region.ownerId !== 'player' || !region.building) continue;
            const def = getRegionBuilding(getWorldTile(state.world, region.id));
            if (!def || def.id !== region.building) continue;
            regional.food += def.yields.food || 0;
            regional.materials += def.yields.materials || 0;
            regional.knowledge += def.yields.knowledge || 0;
        }

        const consumption = getFoodConsumption(state);
        let upkeep = state.player.buildings.filter(b => b.active).length * UPKEEP_PER_BUILDING + state.regions.filter(r => r.ownerId === 'player' && r.building).length * UPKEEP_PER_BUILDING;
        // upkeep_reduction и defense/trade пока символически снижают upkeep
        upkeep = Math.max(0, upkeep - (totals.upkeep_reduction || 0) * 0.1);
        // Историческая культура и черта влияют на производство (ямники — еда/кони, аккадцы — материалы, египтяне — склад)
        if (state.player.trait && state.player.trait.bonus) {
            if (state.player.trait.bonus.food) workerProd.food += state.player.trait.bonus.food * 2;
            if (state.player.trait.bonus.materials) workerProd.materials += state.player.trait.bonus.materials * 2;
            if (state.player.trait.bonus.knowledge) workerProd.knowledge += state.player.trait.bonus.knowledge * 2;
        }
        if (state.player.historicalCulture && state.player.historicalCulture.bonus) {
            const hb = state.player.historicalCulture.bonus;
            if (hb.food) workerProd.food += hb.food;
            if (hb.materials) workerProd.materials += hb.materials;
            if (hb.knowledge) workerProd.knowledge += hb.knowledge;
        }
        for (const dec of getActiveDecrees(state)) {
            if (dec.bonuses.buildingCostExtra) upkeep += 0.05; // symbolic
        }

        return {
            workers,
            workerBase: { ...WORKER_BASE_YIELD },
            workerBonus: { food: bonusFood, materials: bonusMat, knowledge: bonusKnow },
            workerProduction: workerProd,
            regional,
            consumption,
            upkeep,
            totals,
            decrees: getActiveDecrees(state)
        };
    }

    function getBattleConfig(input) {
        const state = normalizeState(input);
        const effects = effectTotals(state);
        let deckBonus = 0;
        let hpBonus = 0;
        let energyBonus = 0;
        for (const dec of getActiveDecrees(state)) {
            if (dec.bonuses.deck_slots) deckBonus += dec.bonuses.deck_slots;
        }
        // Историческая культура влияет на бой: Аккад — слоты, Ямная — энергия (кони), Египет — HP (стены)
        if (state.player.historicalCulture && state.player.historicalCulture.bonus) {
            const hb = state.player.historicalCulture.bonus;
            if (hb.deck_slots) deckBonus += hb.deck_slots;
            if (hb.max_hp) hpBonus += hb.max_hp;
            if (hb.storage) hpBonus += 0; // storage already in cap
        }
        if (state.player.trait && state.player.trait.id === 'horse-lords') energyBonus += 1;
        if (state.player.trait && state.player.trait.id === 'strong') hpBonus += 1;
        return {
            deckLimit: Math.min(6, Math.max(1, 2 + effects.deck_slots + deckBonus)),
            hp: Math.min(12, 5 + effects.max_hp + hpBonus),
            energyMax: Math.min(8, 2 + effects.energy_cap + energyBonus),
            energyGrowth: Math.min(3, 1 + effects.energy_growth),
            effects,
            decrees: getActiveDecrees(state),
            historicalCulture: state.player.historicalCulture,
            trait: state.player.trait
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
            if (region.ownerId !== 'player' || !region.building) continue;
            const definition = getWorldTile(state.world, region.id);
            const building = getRegionBuilding(definition);
            if (!building || building.id !== region.building) continue;
            income.food += building.yields.food || 0;
            income.materials += building.yields.materials || 0;
            income.knowledge += building.yields.knowledge || 0;
        }
        return income;
    }
    function getAvailableMaterialQualities(input) {
        const state = normalizeState(input);
        const ownedBuildings = new Set(state.regions.filter(region => region.ownerId === 'player' && region.building).map(region => region.building));
        const available = ['standard'];
        if (ownedBuildings.has('smelter')) available.push('refined');
        if (ownedBuildings.has('smelter') && ownedBuildings.has('caravan')) available.push('masterwork');
        return available;
    }
    function getRegionActionState(input, regionId) {
        const state = normalizeState(input);
        const definition = getWorldTile(state.world, regionId);
        if (!definition) return { action: 'blocked', enabled: false, reason: 'Область карты не найдена.' };
        const record = getRegionRecord(state, regionId);
        if (!record) return { action: 'blocked', enabled: false, reason: 'Состояние области карты не найдено.' };
        if (definition.terrain === 'water') return { action: 'blocked', enabled: false, reason: 'Водный участок пока нельзя освоить.' };

        if (record.ownerId === 'player') {
            if (!record.building) {
                const building = getRegionBuilding(definition);
                if (!building) return { action: 'owned', enabled: false, reason: 'Центральное поселение не требует региональной постройки.' };
                const orderError = canOrder(state, 'construction');
                if (orderError) return { action: 'build', enabled: false, reason: orderError, cost: { ...building.cost }, building };
                if (!Object.keys(building.cost).every(key => state.player.resources[key] >= building.cost[key])) {
                    return { action: 'build', enabled: false, reason: 'Не хватает ресурсов на ' + building.name + '.', cost: { ...building.cost }, building };
                }
                return {
                    action: 'build', enabled: true,
                    reason: 'Построить ' + building.name + ' за ' + Object.entries(building.cost).map(function (entry) {
                        return entry[1] + (entry[0] === 'food' ? '🌾' : entry[0] === 'materials' ? '🪵' : '📚');
                    }).join(' '),
                    cost: { ...building.cost }, building
                };
            }
            const building = getRegionBuilding(definition);
            return { action: 'owned', enabled: false, reason: 'Участок под контролем. Постройка: ' + (building?.name || record.building) };
        }

        if (state.player.pendingExpedition) {
            if (state.player.pendingExpedition.regionId === regionId && !state.player.pendingExpedition.battleStarted) {
                return { action: 'resume', enabled: true, reason: 'Экспедиция ждёт начала боя.' };
            }
            if (state.player.pendingExpedition.regionId === regionId) {
                return { action: 'return', enabled: true, reason: 'Экспедиционный бой уже идёт.' };
            }
            return { action: 'blocked', enabled: false, reason: 'Сначала заверши текущую экспедицию.' };
        }

        const isNeutral = record.ownerId === null;
        const action = isNeutral ? 'settle' : 'attack';
        const cost = isNeutral ? REGION_CAPTURE_COST : REGION_EXPEDITION_COST;
        const orderError = canOrder(state, 'frontier');
        if (orderError) return { action, enabled: false, reason: orderError, cost: { ...cost } };
        if (!isRegionConnected(state, definition)) return { action, enabled: false, reason: 'Сначала займи соседнюю область.', cost: { ...cost } };
        if (state.player.era < definition.minEra) {
            return { action, enabled: false, reason: 'Нужна эпоха «' + eraName(definition.minEra) + '».', cost: { ...cost } };
        }
        if (!Object.keys(cost).every(key => state.player.resources[key] >= cost[key])) {
            return { action, enabled: false, reason: isNeutral ? 'Нужно 2 провизии и 2 материала.' : 'Для экспедиции нужны 4 провизии и 2 материала.', cost: { ...cost } };
        }
        return { action, enabled: true, reason: '', cost: { ...cost } };
    }
    function settleRegion(input, regionId) {
        const state = normalizeState(input);
        const action = getRegionActionState(state, regionId);
        if (action.action !== 'settle' || !action.enabled) return { state, error: action.reason || 'Эту область нельзя освоить.' };
        const definition = getWorldTile(state.world, regionId);
        spend(state, action.cost || REGION_CAPTURE_COST);
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
        const definition = getWorldTile(state.world, regionId);
        const building = getRegionBuilding(definition);
        if (!building) return { state, error: 'Для этой области нет подходящей постройки.' };
        if (!spend(state, building.cost)) return { state, error: 'Не хватает ресурсов.' };
        const record = getRegionRecord(state, regionId);
        record.building = building.id;
        const seed = hashString(state.world.seed + ':' + state.player.name + state.player.clan + regionId + String(state.day));
        record.buildingFlavor = generateLocalRegionFlavor(definition, seed);
        markDailyOrderUsed(state, 'construction');
        state.player.campaignNotice = 'Построено: ' + record.buildingFlavor.name + ' (' + building.name + ') в области «' + definition.name + '». Доход начнётся завтра.';
        return { state, error: null };
    }
    function makeExpeditionMatch(state, pending = state.player.pendingExpedition) {
        if (!pending) return null;
        const definition = getWorldTile(state.world, pending.regionId);
        const opponent = state.opponents.find(item => item.id === pending.opponentId);
        if (!definition || definition.kind !== 'settlement' || !opponent) return null;
        return {
            kind: 'expedition', regionId: definition.id, regionName: definition.name,
            opponentId: opponent.id, name: opponent.name, clan: opponent.clan,
            era: opponent.era, leaderBattle: true
        };
    }
    function beginRegionExpedition(input, regionId) {
        const state = normalizeState(input);
        const action = getRegionActionState(state, regionId);
        if (action.action !== 'attack' || !action.enabled) return { state, error: action.reason || 'Эту область нельзя атаковать.' };
        const definition = getWorldTile(state.world, regionId);
        const record = getRegionRecord(state, regionId);
        const opponent = state.opponents.find(item => item.id === record.ownerId);
        if (!opponent || definition.kind !== 'settlement') return { state, error: 'Защитник поселения не найден.' };
        const cost = action.cost || REGION_EXPEDITION_COST;
        spend(state, cost);
        markDailyOrderUsed(state, 'frontier');
        state.player.pendingExpedition = { regionId, opponentId: opponent.id, launchDay: state.day, cost: { ...cost }, battleStarted: false };
        return { state, match: makeExpeditionMatch(state), error: null };
    }
    function finishRegionExpedition(input, match, won) {
        let state = normalizeState(input);
        const pending = state.player.pendingExpedition;
        if (!match || !pending || match.kind !== 'expedition' || match.regionId !== pending.regionId || match.opponentId !== pending.opponentId) {
            return { state, error: 'Эта экспедиция не найдена или уже завершена.' };
        }
        const definition = getWorldTile(state.world, pending.regionId);
        const opponent = state.opponents.find(item => item.id === pending.opponentId);
        const record = getRegionRecord(state, pending.regionId);
        if (!definition || definition.kind !== 'settlement' || !opponent || !record || record.ownerId !== opponent.id) {
            return { state, error: 'Состояние поселения изменилось; экспедицию нельзя завершить.' };
        }
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
            ? 'Победа! «' + definition.name + '» переходит под твой контроль. Построй там форпост, чтобы получать доход.'
            : 'Поражение. «' + definition.name + '» удерживает соперник. Ресурсы и AP за экспедицию уже потрачены.';
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
        const regions = getWorldTiles(current.world).filter(region => region.terrain !== 'water' && getRegionRecord(current, region.id)?.ownerId === 'player');
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
            description: region.description,
            biome: region.terrain || 'unknown'
        }));
        const biomeInfo = player.biome ? player.biome.name + ' (' + player.biome.desc + ')' : 'неизвестный биом';
        const geoInfo = player.geography ? player.geography.name + ' — ' + player.geography.desc : '';
        const traitInfo = player.trait ? player.trait.name + ' (' + player.trait.desc + ')' : '';
        const nearbyInfo = player.nearby ? player.nearby.name + ' — ' + player.nearby.desc : '';
        const histInfo = player.historicalCulture ? player.historicalCulture.name + ' — ' + player.historicalCulture.desc : '';
        const origin = ORIGINS.find(o => o.id === player.originId);
        const originHist = origin ? origin.historical : '';
        const summary = 'Биом: ' + biomeInfo + '. География: ' + geoInfo + '. Черта: ' + traitInfo + '. Рядом: ' + nearbyInfo + '. Наследие: ' + histInfo + ' | ' + originHist + '. Земли: ' + (regionNames.join(' · ') || 'поселение') + '. Население: ' + player.population + ' (кланов: ' + (player.population - player.workers.idle) + '). Запасы: 🌾' + reserves.food + ' 🪵' + reserves.materials + ' 📚' + reserves.knowledge + '. Дефицит: ' + resourceLabels[reserveDays.key] + '. Доход: 🌾' + breakdown.workerProduction.food.toFixed(1) + ' 🪵' + breakdown.workerProduction.materials.toFixed(1) + ' 📚' + breakdown.workerProduction.knowledge.toFixed(1) + ' потребление ' + breakdown.consumption.toFixed(1) + '🌾. Эпоха: ' + eraName(player.era) + '.';
        return { regionNames, localContexts, reserves, dailyIncome, currentNeed: reserveDays.key, summary, breakdown, biome: player.biome, geography: player.geography, trait: player.trait, nearby: player.nearby, historicalCulture: player.historicalCulture, origin };
    }

    function getFirstSessionGuide(input) {
        const current = normalizeState(input);
        const player = current.player;
        const openingProject = player.blueprints.find(project => project.openingProject);
        if (!player.onboardingComplete || !openingProject) return null;

        const practiceCount = (player.practice.wins || 0) + (player.practice.losses || 0);
        const ownedLandCount = current.regions.filter(region => region.ownerId === 'player'
            && getWorldTile(current.world, region.id)?.terrain !== 'water').length;
        const steps = [
            { id: 'research', label: 'Исследовать «' + openingProject.scienceName + '»', done: Boolean(openingProject.researched) },
            { id: 'build', label: 'Построить «' + openingProject.buildingName + '»', done: Boolean(openingProject.built) },
            { id: 'territory', label: 'Занять соседнюю область', done: ownedLandCount > 1 },
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
        } else if (ownedLandCount <= 1) {
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
            ? 'освоить медное месторождение и построить плавильню'
            : materialQuality === 'masterwork' ? 'освоить медь и олово, построить плавильню и торговый стан' : '';
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
            const oldEra = state.player.era;
            state.player.era += 1;
            state.player.pendingDecreeChoice = true;
            // --- ЭВОЛЮЦИЯ КУЛЬТУРЫ: при переходе эпохи добавляется новое наследие ---
            // Это ответ на вопрос про средневековье и шумерские танки: культура не статична, а наслаивается
            const newEra = state.player.era;
            const eraCultures = HISTORICAL_CULTURES.filter(c => c.era === newEra || c.era === newEra - 1);
            if (eraCultures.length) {
                const seed = hashString(state.player.name + state.player.clan + String(newEra) + String(state.day));
                const rng = seededRandom(seed);
                const newCulture = pickRandom(rng, eraCultures);
                if (!state.player.culturalLineage.includes(newCulture.id)) {
                    state.player.culturalLineage.push(newCulture.id);
                    if (state.player.culturalLineage.length > 10) state.player.culturalLineage.shift();
                }
                // С шансом 30% основная культура тоже эволюционирует (ассимиляция)
                if (rng() < 0.3) {
                    state.player.historicalCulture = newCulture;
                }
                // Летопись эволюции
                const lineageNames = state.player.culturalLineage.map(id => HISTORICAL_CULTURES.find(c=>c.id===id)?.name || id).join(' → ');
                const evolutionText = 'Эпоха ' + eraName(newEra) + ': культура эволюционировала. Линия: ' + lineageNames + '. Новое влияние: ' + newCulture.name + ' — ' + newCulture.desc + '. Теперь шумерские корни могут дать танки с клинописью, а ямные — рыцарей степи.';
                state.player.chronicle.push({ day: state.day, era: newEra, text: evolutionText.slice(0, 500) });
                if (state.player.chronicle.length > 20) state.player.chronicle.shift();
                state.player.campaignNotice = 'Открыта эпоха: ' + eraName(newEra) + ' (' + (ERA_HISTORICAL[newEra]?.desc || '') + '). Культурная линия: ' + lineageNames + '. Выбери уклад — он определит путь на эту эпоху. Теперь твои ' + (state.player.historicalCulture.name) + ' в ' + eraName(newEra) + ' будут выглядеть иначе!';
            } else {
                state.player.campaignNotice = 'Открыта эпоха: ' + eraName(state.player.era) + '. Выбери уклад — военный, земледельческий или жреческий — он определит путь цивилизации на эту эпоху.';
            }
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

    function chooseDecree(input, decreeId) {
        const state = normalizeState(input);
        if (!DECREES[decreeId]) return { state, error: 'Уклад не найден.' };
        if (!state.player.pendingDecreeChoice && state.player.decrees.length >= state.player.era + 1) {
            return { state, error: 'Уклад этой эпохи уже выбран. Следующий выбор — при переходе в новую эпоху.' };
        }
        // allow choosing even without pending flag for testing, but consume AP if available
        if (state.player.ap <= 0 && state.player.pendingDecreeChoice) {
            // choosing decree is free, does not cost AP, but we check
        }
        state.player.decrees.push({ id: decreeId, era: state.player.era, chosenDay: state.day });
        state.player.decree = decreeId;
        state.player.pendingDecreeChoice = false;
        state.player.campaignNotice = 'Выбран уклад: ' + DECREES[decreeId].label + '. ' + DECREES[decreeId].description;
        state.player.storageCap = getStorageCap(state);
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
            let raw = JSON.parse(root.localStorage.getItem(STORAGE_KEY) || 'null');
            let migratedOldSave = false;
            if (!raw) {
                for (const oldKey of ['iforge_campaign_v3', 'iforge_campaign_v2']) {
                    try {
                        const oldRaw = JSON.parse(root.localStorage.getItem(oldKey) || 'null');
                        if (oldRaw && [2, 3].includes(oldRaw.version)) {
                            raw = oldRaw;
                            migratedOldSave = true;
                            break;
                        }
                    } catch (_) {}
                }
            }
            const craftRecovery = recoverInterruptedCardCrafts(raw);
            const expeditionRecovery = recoverInterruptedExpedition(craftRecovery.state);
            if (migratedOldSave || craftRecovery.recovered || expeditionRecovery.recovered) save(expeditionRecovery.state);
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
    let selectedMapTileId = CampaignMap.tileId(CampaignMap.CENTER.x, CampaignMap.CENTER.y);
    let pendingMatch = null;
    let lastMatch = null;
    function commit(next) { state = normalizeState(next); state.player.campaignNotice = ''; save(state); render(); if (typeof root.refreshForgeUi === 'function') root.refreshForgeUi(); }
    function eraName(index) { return ERAS[Math.max(0, Math.min(ERAS.length - 1, index))]; }
    function getCardChoices() { return typeof root.getCampaignCardChoices === 'function' ? root.getCampaignCardChoices() : []; }
    function alertResult(result) { if (result.error) { root.alert(result.error); return false; } commit(result.state); return true; }

    function renderRegionMap() {
        const income = getRegionalIncome(state);
        const definitions = getWorldTiles(state.world);
        const landDefinitions = definitions.filter(definition => definition.terrain !== 'water');
        const ownedCount = state.regions.filter(region => region.ownerId === 'player'
            && getWorldTile(state.world, region.id)?.terrain !== 'water').length;
        const qualities = getAvailableMaterialQualities(state);
        const breakdown = getProductionBreakdown(state);
        const selected = getWorldTile(state.world, selectedMapTileId) || getWorldTile(state.world, CampaignMap.tileId(CampaignMap.CENTER.x, CampaignMap.CENTER.y));
        const selectedRecord = getRegionRecord(state, selected.id);
        const selectedAction = getRegionActionState(state, selected.id);
        const getOwnerLabel = function (definition, record) {
            if (definition.terrain === 'water') return 'Водная граница';
            if (record.ownerId === 'player') return definition.kind === 'home' ? 'Столица · ваша земля' : 'Под вашим контролем';
            if (record.ownerId === null) return 'Не освоено';
            return state.opponents.find(opponent => opponent.id === record.ownerId)?.clan || 'Земля соседей';
        };
        const ownerClassFor = function (definition, record) {
            if (definition.terrain === 'water') return 'is-water';
            if (record.ownerId === 'player') return 'is-owned';
            return record.ownerId === null ? 'is-neutral' : 'is-rival';
        };
        const markerFor = function (definition, record) {
            if (definition.kind === 'home') return '⌂';
            if (definition.kind === 'settlement') return '⚑';
            if (definition.feature === 'copper-vein') return '◆';
            if (definition.feature === 'tin-route') return '◇';
            if (definition.feature === 'salt-deposit') return '✦';
            if (record.ownerId === 'player') return '●';
            if (record.ownerId !== null) return '⚑';
            return '';
        };
        const cells = definitions.map(definition => {
            const record = getRegionRecord(state, definition.id);
            const selectedClass = definition.id === selected.id ? ' is-selected' : '';
            const homeClass = definition.kind === 'home' ? ' is-home' : '';
            const ownerClass = ownerClassFor(definition, record);
            const icon = definition.kind === 'home' ? '⌂' : definition.kind === 'settlement' ? '⚑' : definition.icon;
            const marker = markerFor(definition, record);
            const title = definition.name + ' · ' + definition.terrainLabel + '. ' + definition.description;
            return '<button type="button" class="campaign-map-cell ' + ownerClass + homeClass + selectedClass + '" data-terrain="' + htmlAttr(definition.terrain) + '" data-feature="' + htmlAttr(definition.feature || '') + '" aria-pressed="' + (definition.id === selected.id) + '" aria-label="' + htmlAttr(title) + '" title="' + htmlAttr(title) + '" onclick="CampaignMvp.selectMapTile(\'' + htmlAttr(definition.id) + '\')"><span class="campaign-map-cell-icon" aria-hidden="true">' + icon + '</span><span class="campaign-map-cell-name">' + escapeHtml(definition.shortName || definition.name) + '</span>' + (marker ? '<span class="campaign-map-cell-marker" aria-hidden="true">' + marker + '</span>' : '') + '</button>';
        }).join('');
        const tileLookup = new Map(definitions.map(definition => [definition.id, definition]));
        const riverPoints = (state.world.rivers || []).map(id => tileLookup.get(id)).filter(Boolean)
            .map(definition => ((definition.x + 0.5) * 100) + ',' + ((definition.y + 0.5) * 100)).join(' ');
        const riverOverlay = riverPoints
            ? '<svg class="campaign-map-river-overlay" viewBox="0 0 700 700" preserveAspectRatio="none" aria-hidden="true"><polyline points="' + riverPoints + '" fill="none" stroke="#6ec9d0" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".28"/><polyline points="' + riverPoints + '" fill="none" stroke="#78dce0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".76"/></svg>'
            : '';

        let ownerLabel = getOwnerLabel(selected, selectedRecord);
        const mapBuilding = getRegionBuilding(selected);
        let yieldMarkup = '';
        if (selectedRecord.building && mapBuilding) {
            const yields = Object.entries(mapBuilding.yields).filter(entry => entry[1] > 0).map(entry => {
                return (entry[0] === 'food' ? '🌾' : entry[0] === 'materials' ? '🪵' : '📚') + ' +' + entry[1];
            }).join(' · ');
            yieldMarkup = '<div class="campaign-map-detail-yield"><b>' + escapeHtml(yields || 'Построено') + '</b>' + (selectedRecord.buildingFlavor?.name ? '<span>· ' + escapeHtml(selectedRecord.buildingFlavor.name) + '</span>' : '') + '</div>';
        } else if (selected.kind === 'settlement' && selectedRecord.ownerId !== 'player') {
            yieldMarkup = '<div class="campaign-map-detail-yield">После захвата здесь можно построить форпост · +1🌾 +1🪵 +1📚</div>';
        } else if (mapBuilding) {
            yieldMarkup = '<div class="campaign-map-detail-yield">Возможная постройка: ' + escapeHtml(mapBuilding.name) + '</div>';
        } else if (selected.resourceLabel) {
            yieldMarkup = '<div class="campaign-map-detail-yield">Ресурс: ' + escapeHtml(selected.resourceLabel) + '</div>';
        }

        let actionMarkup = '';
        if (selectedAction.action === 'owned') {
            actionMarkup = '<span class="campaign-map-action-note is-done">✓ ' + escapeHtml(ownerLabel) + '</span>';
        } else if (selectedAction.action === 'resume' || selectedAction.action === 'return') {
            actionMarkup = '<button type="button" class="campaign-btn campaign-btn-gold campaign-map-action" title="' + htmlAttr(selectedAction.reason) + '" onclick="CampaignMvp.resumeRegionExpedition()">' + (selectedAction.action === 'return' ? 'Вернуться к бою →' : 'Начать экспедицию →') + '</button>';
        } else if (selectedAction.action === 'build') {
            const label = selectedAction.enabled
                ? 'Построить · ' + Object.entries(selectedAction.cost || {}).map(entry => entry[1] + (entry[0] === 'food' ? '🌾' : entry[0] === 'materials' ? '🪵' : '📚')).join(' ')
                : 'Построить';
            const accessibleLabel = selectedAction.enabled ? label : label + '. ' + selectedAction.reason;
            actionMarkup = '<button type="button" class="campaign-btn campaign-btn-secondary campaign-map-action" ' + (selectedAction.enabled ? '' : 'disabled') + ' title="' + htmlAttr(selectedAction.reason) + '" aria-label="' + htmlAttr(accessibleLabel) + '" onclick="CampaignMvp.buildRegionBuilding(\'' + htmlAttr(selected.id) + '\')">' + label + '</button>';
        } else if (selectedAction.action === 'settle' || selectedAction.action === 'attack') {
            const isSettle = selectedAction.action === 'settle';
            const label = selectedAction.enabled
                ? (isSettle ? 'Освоить · 2🌾 2🪵' : 'В поход · 4🌾 2🪵')
                : (isSettle ? 'Освоить область' : 'В поход');
            const handler = isSettle ? 'claimRegion' : 'attackRegion';
            const accessibleLabel = selectedAction.enabled ? label : label + '. ' + selectedAction.reason;
            actionMarkup = '<button type="button" class="campaign-btn ' + (isSettle ? 'campaign-btn-secondary' : 'campaign-btn-challenge') + ' campaign-map-action" ' + (selectedAction.enabled ? '' : 'disabled') + ' title="' + htmlAttr(selectedAction.reason) + '" aria-label="' + htmlAttr(accessibleLabel) + '" onclick="CampaignMvp.' + handler + '(\'' + htmlAttr(selected.id) + '\')">' + label + '</button>';
        } else {
            actionMarkup = '<span class="campaign-map-action-note">' + escapeHtml(selectedAction.reason || 'Пока недоступно.') + '</span>';
        }
        const eraTag = selected.minEra > state.player.era
            ? '<span class="campaign-map-era-gate">Доступно с эпохи «' + escapeHtml(eraName(selected.minEra)) + '»</span>'
            : '';
        const selectedDetail = '<aside class="campaign-map-inspector" aria-live="polite"><div class="campaign-map-inspector-head"><span class="campaign-kicker">' + (selected.kind === 'home' ? 'ЦЕНТР МИРА' : 'ОБЛАСТЬ · ' + (selected.x + 1) + ':' + (selected.y + 1)) + '</span><span class="campaign-map-terrain-tag">' + escapeHtml(selected.terrainLabel) + '</span></div><h3>' + escapeHtml(selected.name) + '</h3><p class="campaign-map-description">' + escapeHtml(selected.description) + '</p><div class="campaign-map-owner"><span class="campaign-map-owner-mark ' + ownerClassFor(selected, selectedRecord) + '"></span><b>' + escapeHtml(ownerLabel) + '</b></div>' + (selected.shortText ? '<small class="campaign-map-short-text">' + escapeHtml(selected.shortText) + '</small>' : '') + yieldMarkup + eraTag + '<div class="campaign-map-action-area">' + actionMarkup + '</div></aside>';
        const materialAccess = qualities.includes('masterwork') ? 'Мастерское сырьё'
            : qualities.includes('refined') ? 'Отборное сырьё'
                : 'Обычное сырьё · медь откроет отборное';
        const seedLabel = Number(state.world.seed).toString(36).toUpperCase().padStart(7, '0');
        const migrationNotice = state.player.campaignNotice
            ? '<div class="campaign-region-notice" role="status">' + escapeHtml(state.player.campaignNotice) + '</div>' : '';

        return '<section id="campaign-world" class="campaign-panel campaign-world"><div class="campaign-panel-heading"><div><span class="campaign-kicker">КРАЙ · МЕСТНАЯ КАМПАНИЯ</span><h2>🗺️ Карта земель</h2></div><span class="campaign-day-badge">' + ownedCount + '/' + landDefinitions.length + ' участков · AP ' + state.player.ap + '/' + state.player.apMax + '</span></div><div class="campaign-world-summary"><span>🌾 +' + income.food.toFixed(1) + ' · 🪵 +' + income.materials.toFixed(1) + ' · 📚 +' + income.knowledge.toFixed(1) + ' / день от земель · 👥 ' + state.player.population + ' чел · 🍞 -' + breakdown.consumption.toFixed(1) + '/д</span><b>' + materialAccess + '</b><small>СИД ' + seedLabel + ' · 7×7</small></div>' + migrationNotice + '<div class="campaign-world-layout"><div class="campaign-world-map-column"><div class="campaign-world-map-label"><span>СЕВЕР ↑</span><span>Каждая клетка — отдельная область</span></div><div class="campaign-world-map-graphic"><div class="campaign-world-board" role="group" aria-label="Мировая карта 7 на 7">' + cells + '</div>' + riverOverlay + '</div><div class="campaign-world-legend"><span><i class="is-owned"></i> ваша земля</span><span><i class="is-neutral"></i> свободная земля</span><span><i class="is-rival"></i> поселение соседа</span><span><i class="is-water"></i> вода</span></div></div>' + selectedDetail + '</div><small class="campaign-world-footnote">Локальный генерируемый край для кампании-прототипа · не общий MMO-мир</small></section>';
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

    function renderDecreeChoice(current) {
        if (!current.player.pendingDecreeChoice) return '';
        const era = current.player.era;
        const choices = Object.values(DECREES).map(dec => {
            return '<button class="campaign-btn campaign-btn-gold" onclick="CampaignMvp.chooseDecree(\'' + dec.id + '\')" title="' + htmlAttr(dec.description) + '"><span>' + dec.icon + '</span><b>' + escapeHtml(dec.label) + '</b><small>' + escapeHtml(dec.description) + '</small></button>';
        }).join('');
        return '<section class="campaign-panel campaign-decree-choice"><div class="campaign-panel-heading"><h2>🏛️ Эпоха ' + escapeHtml(eraName(era)) + ': выбери уклад</h2><span class="campaign-muted">Определит путь цивилизации на ' + (era+1) + '/7</span></div><div class="campaign-decree-options">' + choices + '</div><small class="campaign-fold-note">Выбор уклада — взаимоисключающий. Каждый уклад меняет потребление, склад, бонусы рабочих и слоты колоды. Формирует идентичность цивилизации на тысячи лет.</small></section>';
    }

    function renderWorkersPanel(current) {
        const w = current.player.workers;
        const pop = current.player.population;
        const breakdown = getProductionBreakdown(current);
        const decreesText = breakdown.decrees.length ? breakdown.decrees.map(d => d.icon + ' ' + d.label).join(' · ') : 'нет уклада';
        return '<section class="campaign-panel campaign-workers"><div class="campaign-panel-heading"><h2>👥 Кланы: ' + pop + '/' + POP_MAX + '</h2><span class="campaign-muted">Едят ' + breakdown.consumption.toFixed(1) + '🌾/д · ' + escapeHtml(decreesText) + '</span></div><div class="campaign-workers-grid">'
            + '<div class="campaign-worker-row"><span>🌾 Еда: ' + w.food + ' кланов → +' + breakdown.workerProduction.food.toFixed(1) + '</span><span><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'food\',\'idle\')">-</button><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'idle\',\'food\')">+</button></span></div>'
            + '<div class="campaign-worker-row"><span>🪵 Материалы: ' + w.materials + ' → +' + breakdown.workerProduction.materials.toFixed(1) + '</span><span><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'materials\',\'idle\')">-</button><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'idle\',\'materials\')">+</button></span></div>'
            + '<div class="campaign-worker-row"><span>📚 Знания: ' + w.knowledge + ' → +' + breakdown.workerProduction.knowledge.toFixed(1) + '</span><span><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'knowledge\',\'idle\')">-</button><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.assignWorker(\'idle\',\'knowledge\')">+</button></span></div>'
            + '<div class="campaign-worker-row"><span>💤 Свободны: ' + w.idle + '</span><span>бонусы: 🌾+' + breakdown.workerBonus.food.toFixed(1) + ' 🪵+' + breakdown.workerBonus.materials.toFixed(1) + ' 📚+' + breakdown.workerBonus.knowledge.toFixed(1) + '</span></div>'
            + '</div><small class="campaign-fold-note">Каждый клан — община на сотни людей. Здания дают бонус к каждому клану. Без кланов — нет базового дохода. Голод: -1 клан за каждые 3🌾 дефицита. Тысячи лет истории — 30 дней прототипа, тестеры вращают дни.</small></section>';
    }

    function renderCraftQueue(orders) {
        if (!orders.length) return '';
        return '<section class="campaign-queue-active" aria-label="Очередь кузницы"><b>⚒️ Ковка</b>' + orders.map(order => {
            const status = order.status === 'generating' ? 'Кузнец создаёт карту' : order.status === 'working' ? 'Осталось ' + order.remainingDays + ' дн.' : 'Готова';
            const rarity = order.rarity === 'rare' ? 'Редкая' : order.rarity === 'uncommon' ? 'Необычная' : 'Обычная';
            return '<article class="campaign-queue-item"><span>' + (order.rarity === 'rare' ? '💎' : order.rarity === 'uncommon' ? '✨' : '⚒️') + '</span><b>' + escapeHtml(order.name || order.advisorOrder) + '</b><small>' + rarity + ' · ' + status + '</small>' + (order.status === 'ready' ? '<button class="campaign-btn campaign-btn-gold" onclick="claimCraftedCard(\'' + htmlAttr(order.id) + '\')">Забрать</button>' : '') + '</article>';
        }).join('') + '</section>';
    }

    function renderTribeTraits(p) {
        if (!p.biome) return '';
        const traits = [
            { icon: p.biome?.icon || '🌍', label: 'БИОМ', value: p.biome?.name || '', desc: p.biome?.desc || '' },
            { icon: p.geography?.icon || '🗺️', label: 'ГЕОГРАФИЯ', value: p.geography?.name || '', desc: p.geography?.desc || '' },
            { icon: p.trait?.icon || '⭐', label: 'ЧЕРТА', value: p.trait?.name || '', desc: p.trait?.desc || '' },
            { icon: p.nearby?.icon || '🔍', label: 'РЯДОМ', value: p.nearby?.name || '', desc: p.nearby?.desc || '' },
            { icon: p.historicalCulture?.icon || '🏛️', label: 'НАСЛЕДИЕ', value: p.historicalCulture?.name || '', desc: p.historicalCulture?.desc || '' }
        ];
        return '<section class="campaign-panel campaign-tribe-traits"><div class="campaign-panel-heading"><h2>🧬 Племя ' + escapeHtml(p.clan) + ' · ' + (p.historicalCulture ? escapeHtml(p.historicalCulture.name) : '') + '</h2><span class="campaign-muted">' + (p.culturalLineage ? escapeHtml(p.culturalLineage.map(id => (typeof HISTORICAL_CULTURES !== 'undefined' ? HISTORICAL_CULTURES.find(c=>c.id===id)?.name : id)).join(' → ')) : '') + '</span></div><div class="campaign-traits-grid">' + traits.map(t => '<div class="campaign-trait-card" data-biome="' + htmlAttr((p.biome?.id)||'') + '" title="' + htmlAttr(t.desc) + '"><span class="trait-icon">' + t.icon + '</span><span class="trait-label">' + t.label + '</span><b>' + escapeHtml(t.value) + '</b><small>' + escapeHtml(t.desc) + '</small></div>').join('') + '</div>' + (p.biome ? '<img class="campaign-image-hero" src="images/' + (p.historicalCulture?.id === 'sumer' ? 'sumerian-tank.jpg' : p.historicalCulture?.id === 'akkad' ? 'akkadian-tank.jpg' : p.historicalCulture?.id === 'egypt-old' ? 'egyptian-tank.jpg' : p.historicalCulture?.id === 'yamnaya' ? (p.era >= 2 ? 'yamnaya-knights.jpg' : 'yamnaya-evolution.jpg') : 'ancient-map.jpg') + '" alt="Наследие ' + htmlAttr(p.historicalCulture?.name||'') + '" onerror="this.style.display=\'none\'" />' : '') + '</section>';
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

        host.innerHTML = '\n          ' + (firstSessionGuide ? '<details class="campaign-first-session" data-campaign-key="first-steps"><summary><span>Первые шаги</span><b>' + firstSessionGuide.completedCount + '/' + firstSessionGuide.steps.length + '</b></summary><div class="campaign-first-session-body"><ol>' + firstSessionGuide.steps.map((step, index) => '<li class="' + (step.done ? 'is-done' : index === firstSessionGuide.completedCount ? 'is-current' : '') + '"><span>' + (step.done ? '✓' : index + 1) + '</span><b>' + escapeHtml(step.label) + '</b></li>').join('') + '</ol><div class="campaign-first-session-next"><small>ДАЛЬШЕ</small><b>' + escapeHtml(firstSessionGuide.next) + '</b></div></div></details>' : '') + '\n          ' + renderDecreeChoice(state) + '\n          <section class="campaign-seasonbar campaign-seasonbar-compact"><div class="campaign-seasonbar-copy"><span class="campaign-kicker">СЕЗОН ' + state.season + ' · ДЕНЬ ' + state.day + '/' + SEASON_LENGTH + '</span><div class="campaign-seasonbar-name"><b>' + escapeHtml(p.name) + '</b><span>· ' + escapeHtml(eraName(p.era)) + '</span></div><div class="campaign-mini-progress" title="Научный прогресс эпохи" aria-label="Научный прогресс эпохи"><span style="width:' + eraProgress + '%"></span></div>' + (dayBlockReason ? '<small class="campaign-day-blocker" role="status">⏳ ' + escapeHtml(dayBlockReason) + '</small>' : '') + '</div><div class="campaign-season-actions">' + developmentButton + '<details class="campaign-season-more" data-campaign-key="season-menu"><summary aria-label="Дополнительные действия">···</summary><div><span>🏅 Медалей: ' + state.medals.length + '</span><button class="campaign-btn campaign-btn-quiet" onclick="CampaignMvp.resetLocal()">Сбросить кампанию</button></div></details></div></section>\n          ' + renderDailyOrdersPanel(state) + '\n          ' + renderRegionMap() + '\n          ' + renderWorkersPanel(state) + '\n\n          <section id="campaign-development" class="campaign-panel campaign-development-panel"><div class="campaign-panel-heading"><div><span class="campaign-kicker">РАЗВИТИЕ</span><h2>Ресурсы и проекты</h2></div><span class="campaign-muted">' + activeBlueprints.length + ' активных · склад ' + p.storageCap + '</span></div>\n            <div class="campaign-resources"><div><span>🌾 Провизия</span><b>' + p.resources.food + '</b><small>+' + breakdown.workerProduction.food.toFixed(1) + '+' + regionalIncome.food + ' -' + breakdown.consumption.toFixed(1) + '/д</small></div><div><span>🪵 Материалы</span><b>' + p.resources.materials + '</b><small>+' + breakdown.workerProduction.materials.toFixed(1) + '+' + regionalIncome.materials + ' -' + breakdown.upkeep.toFixed(1) + '/д</small></div><div><span>📚 Знания</span><b>' + p.resources.knowledge + '</b><small>+' + breakdown.workerProduction.knowledge.toFixed(1) + '+' + regionalIncome.knowledge + '/д</small></div></div>\n            <div class="campaign-orders">' + (activeBlueprints.length ? activeBlueprints.map(blueprint => renderBlueprintOrder(blueprint, p, readyToClose)).join('') : '<div class="campaign-project-empty">Нет активного проекта. Создай следующий у советника.</div>') + '</div>\n            <form class="campaign-project-form campaign-project-form-compact" onsubmit="CampaignMvp.generateProject(event)"><label><span>Новый проект</span><select id="campaign-project-branch" aria-label="Направление науки">' + scienceBranchesForEra(p.era).map(branch => '<option value="' + branch.id + '">' + escapeHtml(branch.label) + '</option>').join('') + '</select></label><button class="campaign-btn campaign-btn-gold" type="submit" id="campaign-project-submit">+ Советник</button></form>\n            <details class="campaign-advisor-context" data-campaign-key="advisor-context"><summary>Как советует наука</summary><p>Выбирается только широкая ветвь; тему и местный контекст советник подбирает автоматически по эпохе, землям и запасам.</p><div class="campaign-advisor-situation"><b>Контекст</b><span>' + escapeHtml(scienceSituation.summary) + '</span></div></details>\n            <div id="campaign-project-status" class="campaign-project-status" role="status" aria-live="polite"></div>\n            <details class="campaign-fold campaign-buildings-fold" data-campaign-key="buildings"><summary><b>Здания · ' + p.buildings.length + '</b><small>Активно ' + activeBuildings.length + '/' + p.activeBuildingSlots + ' · upkeep ' + breakdown.upkeep.toFixed(1) + '🪵/д</small></summary><div class="campaign-fold-content campaign-orders">' + buildingRows + '</div></details>\n          </section>\n\n          ' + renderCraftQueue(activeCraftOrders) + '\n\n          <div class="campaign-secondary-grid">\n            <details class="campaign-panel campaign-fold campaign-civilization" data-campaign-key="civilization"><summary><b>📜 Эпохи и бой</b><small>' + (p.era + 1) + '/7 · колода ' + p.deckCardIds.length + '/' + config.deckLimit + '</small></summary><div class="campaign-fold-content"><div class="campaign-era-rail">' + ERAS.map((era, i) => '<div class="campaign-era-step ' + (i < p.era ? 'is-done' : '') + ' ' + (i === p.era ? 'is-current' : '') + '"><span>' + (i < p.era ? '✓' : i + 1) + '</span><small>' + escapeHtml(era) + '</small></div>').join('') + '</div><div class="campaign-practice-summary"><b>' + escapeHtml(p.name) + ' · ' + escapeHtml(p.clan) + '</b><span>' + (p.era === ERAS.length - 1 ? 'Последняя эпоха открыта' : 'Открытия эпохи: ' + p.research + '/2') + '</span><span>Здоровье ' + config.hp + ' · энергия ' + config.energyMax + ' (+' + config.energyGrowth + '/ход)</span><span>Активные здания ' + activeBuildings.length + '/' + p.activeBuildingSlots + '</span><span>Население ' + p.population + ' · рост ' + p.growthProgress + ' · голод ' + p.starvationDays + 'д</span></div></div></details>\n            <details class="campaign-panel campaign-fold campaign-opponents" data-campaign-key="opponents"><summary><b>⚔️ Тренировка с ИИ</b><small>' + state.opponents.length + ' соперника · без наград</small></summary><div class="campaign-fold-content"><div class="campaign-opponent-list">' + opponentRows + '</div></div></details>\n            <details class="campaign-panel campaign-fold campaign-codex" data-campaign-key="deck"><summary><b>🎴 Колода кампании</b><small>' + p.deckCardIds.length + '/' + config.deckLimit + '</small></summary><div class="campaign-fold-content"><p class="campaign-fold-note">Активные военные здания увеличивают лимит колоды.</p><div class="campaign-project-list">' + deckCards + '</div><p class="campaign-fold-note">Сейчас выбрано: ' + (selectedCards.map(card => escapeHtml(card.name)).join(' · ') || 'стартовая колода') + '</p></div></details>\n          </div>';
        for (const detail of host.querySelectorAll?.('details[data-campaign-key]') || []) detail.open = openDetails.has(detail.dataset.campaignKey);
    }

    function renderOnboarding(host) {
        const originCards = ORIGINS.map((origin, index) => '\n          <label class="campaign-onboarding-choice"><input type="radio" name="campaign-origin" value="' + origin.id + '" ' + (index === 0 ? 'checked' : '') + '><span class="campaign-choice-icon">' + origin.icon + '</span><span><b>' + escapeHtml(origin.name) + '</b><small>' + escapeHtml(origin.place) + ' · +' + origin.bonus + ' ' + (origin.resource === 'food' ? 'провизии' : origin.resource === 'materials' ? 'материала' : 'знания') + '</small><span class="campaign-choice-description">' + escapeHtml(origin.description) + '</span></span></label>').join('');
        const focusCards = OPENING_FOCUSES.map((focus, index) => '\n          <label class="campaign-onboarding-choice"><input type="radio" name="campaign-focus" value="' + focus.id + '" ' + (index === 0 ? 'checked' : '') + '><span class="campaign-choice-icon">' + focus.icon + '</span><span><b>' + escapeHtml(focus.title) + '</b><small>' + escapeHtml(focus.scienceName) + ' → ' + escapeHtml(focus.buildingName) + '</small><span class="campaign-choice-description">' + escapeHtml(focus.buildingDescription) + ' Эффект здания: ' + escapeHtml(EFFECTS[focus.effect].label) + '.</span></span></label>').join('');
        host.innerHTML = '\n          <section class="campaign-onboarding-hero"><span class="campaign-kicker">INFINITE FORGE · НАЧАЛО СЕЗОНА</span><h2>Рождение народа</h2><p>Твоя столица появится в центре сгенерированного мира 7×7. Выбери происхождение общины и первое дело — они зададут стартовый ресурс и научный проект.</p></section>\n          <form class="campaign-onboarding-form" onsubmit="CampaignMvp.beginOnboarding(event)">\n            <section class="campaign-panel campaign-onboarding-section"><h3>1 · Кто вы?</h3><label class="campaign-onboarding-name">Имя народа<input id="campaign-start-name" maxlength="24" placeholder="Например, Дети Великой Реки" autocomplete="off"></label><div class="campaign-onboarding-options">' + originCards + '</div></section>\n            <section class="campaign-panel campaign-onboarding-section"><h3>2 · На что направите силы?</h3><p class="campaign-small">Выбор откроет готовый первый проект. Генерация через ИИ для начала не требуется.</p><div class="campaign-onboarding-options">' + focusCards + '</div></section>\n            <section class="campaign-panel campaign-onboarding-deck"><h3>3 · Уже есть чем защищаться</h3><p class="campaign-small">Стартовая колода из двух карт доступна сразу — без ковки, API-ключа и предварительной сборки.</p><div class="campaign-starter-preview">' + STARTER_CARDS.map(card => '<article><span>' + card.emoji + '</span><div><b>' + escapeHtml(card.name) + '</b><small>' + card.atk + '/' + card.hp + ' · ' + card.drop_cost + ' энергии на вывод</small><p>' + escapeHtml(card.description) + '</p></div></article>').join('') + '</div><p class="campaign-small">Позже колоду можно менять картами из коллекции. Тренировочные бои против ИИ не дают ресурсов, медалей или рейтинга.</p></section>\n            <button class="campaign-btn campaign-btn-gold campaign-onboarding-submit" type="submit">Начать путь цивилизации →</button>\n          </form>';
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
    function selectMapTile(tileId) {
        if (!getWorldTile(state.world, tileId)) return;
        selectedMapTileId = tileId;
        render();
    }
    function claimRegionAction(regionId) { alertResult(settleRegion(state, regionId)); }
    async function buildRegionBuildingAction(regionId) {
        const result = buildRegionBuilding(state, regionId);
        if (result.error) { root.alert(result.error); return; }
        commit(result.state);
        // Если есть API ключ — попробовать улучшить название через ИИ (уникализация)
        try {
            const flavor = await requestRegionFlavor(regionId);
            if (flavor && flavor.name) {
                const rec = getRegionRecord(state, regionId);
                if (rec && rec.building) {
                    rec.buildingFlavor = flavor;
                    save(state);
                    render();
                }
            }
        } catch (_) {}
    }
    function chooseDecreeAction(decreeId) { alertResult(chooseDecree(state, decreeId)); }
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
        status.textContent = 'Советник готовит 3 замысла по «' + branch.label + '» с учётом земель и запасов…';
        let projects = [];
        let usedLlm = false;
        try {
            const key = typeof root.getApiKey === 'function' ? root.getApiKey() : '';
            if (!key) throw new Error('no-key');
            const response = await fetch('https://api.hydraai.ru/v1/chat/completions', {
                method: 'POST', headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: typeof root.getSelectedModel === 'function' ? root.getSelectedModel() : 'gpt-6-luna',
                    messages: [
                        { role: 'system', content: 'Ты научный советник исторической стратегии. Игрок выбрал только широкую ветвь; ты должен придумать 3 РАЗНЫХ замысла науки+постройки в рамках этой ветви, с trade-off. Каждое — уникальное название и описание, без магии. Эффекты из списка: ' + JSON.stringify(EFFECTS) + '. Каждый проект: 1-2 эффекта, amount <= max. Обязательно разнообразие: один фокус на еду, другой на материалы/знания, третий на военные/гражданские бонусы. Верни JSON: {\"projects\":[{\"scienceName\":\"...\",\"scienceDescription\":\"...\",\"buildingName\":\"...\",\"buildingDescription\":\"...\",\"category\":\"military|economy|science|civic\",\"effects\":[{\"type\":\"...\",\"amount\":1}]} x3]}. Названия без повторов.' },
                        { role: 'user', content: 'Эпоха: ' + eraName(state.player.era) + '. Направление: «' + branch.label + '» — ' + branch.prompt + '. Ситуация: ' + situation.summary + '. Ориентир: «' + context.name + '» — ' + context.description + '. Тип постройки: ' + branch.building + '. Клан: ' + state.player.clan + '. Придумай 3 разных замысла — у каждого свой путь развития, как в племени с разными укладами. Игрок выберет один.' }
                    ],
                    temperature: 1.0, max_tokens: 1400, response_format: { type: 'json_object' }
                })
            });
            if (!response.ok) throw new Error('Hydra API: HTTP ' + response.status);
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';
            const parsed = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || '{}');
            if (Array.isArray(parsed.projects) && parsed.projects.length) projects = parsed.projects.slice(0, 3);
            else if (parsed.scienceName) projects = [parsed];
            usedLlm = true;
        } catch (error) {
            const seed = hashString(state.player.name + state.player.clan + branchId + String(state.day));
            projects = generateLocalScienceVariants(branchId, seed, 3);
            status.textContent = error.message === 'no-key'
                ? 'API-ключ не задан: созданы 3 местных черновика с уникальными названиями из пулов — у каждого игрока они разные.'
                : 'LLM недоступна (' + error.message + '); созданы 3 местных черновика из пулов разнообразия.';
        } finally { button.disabled = false; }

        const validProjects = [];
        for (const raw of projects) {
            const cleaned = {
                scienceName: String(raw.scienceName || '').slice(0, 80),
                scienceDescription: String(raw.scienceDescription || '').slice(0, 400),
                buildingName: String(raw.buildingName || '').slice(0, 80),
                buildingDescription: String(raw.buildingDescription || '').slice(0, 400),
                category: CATEGORIES.includes(raw.category) ? raw.category : branch.category,
                effects: cleanEffects(raw.effects) || [{ type: branch.effect, amount: 1 }]
            };
            if (cleaned.scienceName && cleaned.buildingName) validProjects.push(cleaned);
        }
        if (!validProjects.length) { status.textContent = 'Советник не смог придумать проекты — попробуй ещё раз.'; return; }

        state.player.scienceChoices = { branchId, day: state.day, projects: validProjects.slice(0, 3) };
        save(state);
        render();
        const refreshedStatus = root.document.getElementById('campaign-project-status');
        if (refreshedStatus) refreshedStatus.textContent = usedLlm
            ? 'Советник предложил 3 уникальных замысла — у каждого игрока они разные. Выбери один путь.'
            : refreshedStatus.textContent || 'Выбери один из 3 черновиков — у каждого игрока названия разные.';
    }

    function chooseScience(index) {
        const choices = state.player.scienceChoices;
        if (!choices || !Array.isArray(choices.projects) || !choices.projects[index]) return;
        const raw = choices.projects[index];
        const result = addBlueprint(state, raw, 'both');
        if (result.error) {
            const status = root.document.getElementById('campaign-project-status');
            if (status) status.textContent = 'Проект отклонён: ' + result.error;
            return;
        }
        const entryText = generateChronicleEntry(result.state, choices.branchId, raw.scienceName);
        result.state.player.chronicle = [...(result.state.player.chronicle || []), { day: result.state.day, era: result.state.player.era, text: entryText }].slice(-20);
        result.state.player.scienceChoices = null;
        state = result.state;
        save(state);
        render();
        const status = root.document.getElementById('campaign-project-status');
        if (status) status.textContent = 'Выбран путь: «' + raw.scienceName + '». ' + entryText;
    }

    async function requestRegionFlavor(regionId) {
        const def = getWorldTile(state.world, regionId);
        const rb = getRegionBuilding(def);
        if (!def || !rb) return null;
        try {
            const key = typeof root.getApiKey === 'function' ? root.getApiKey() : '';
            if (!key) throw new Error('no-key');
            const situation = scienceAdvisorSituation(state);
            const response = await fetch('https://api.hydraai.ru/v1/chat/completions', {
                method: 'POST', headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: typeof root.getSelectedModel === 'function' ? root.getSelectedModel() : 'gpt-6-luna',
                    messages: [
                        { role: 'system', content: 'Ты придумываешь уникальные названия для региональных построек в исторической стратегии. Верни JSON: {\"name\":\"уникальное название до 40 символов\",\"description\":\"короткое описание до 120 символов без магии\"}. Название должно быть уникальным, с характером, не шаблонным.' },
                        { role: 'user', content: 'Регион: ' + def.name + ' — ' + def.description + '. Тип постройки: ' + rb.name + ' — ' + rb.description + '. Эпоха: ' + eraName(state.player.era) + '. Клан: ' + state.player.clan + '. Механика: ' + JSON.stringify(rb.yields) + '. Придумай уникальное имя для этой постройки именно этой общины.' }
                    ],
                    temperature: 0.95, max_tokens: 200, response_format: { type: 'json_object' }
                })
            });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';
            const parsed = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0] || '{}');
            if (parsed.name) return { name: String(parsed.name).slice(0, 80), description: String(parsed.description || rb.description).slice(0, 400) };
        } catch (_) {}
        const seed = hashString(state.world.seed + ':' + state.player.name + state.player.clan + regionId + String(state.day));
        return generateLocalRegionFlavor(regionId, seed);
    }

    function resetLocal() {

        if (!root.confirm('Сбросить локальную кампанию, включая медали, здания и науку?')) return;
        state = createState(); pendingMatch = null; lastMatch = null;
        selectedMapTileId = CampaignMap.tileId(CampaignMap.CENTER.x, CampaignMap.CENTER.y);
        if (typeof root.clearForgeAdvice === 'function') root.clearForgeAdvice();
        save(state); render(); if (typeof root.refreshForgeUi === 'function') root.refreshForgeUi();
    }

    const api = {
        ERAS, ERA_HISTORICAL, DECREES, EFFECTS, DIVERSITY_POOLS, BIOMES, GEOGRAPHY, TRAITS, NEARBY, HISTORICAL_CULTURES, ORIGINS, OPENING_FOCUSES, STARTER_CARDS, SCIENCE_BRANCHES, REGION_BUILDINGS, REGION_CAPTURE_COST, REGION_EXPEDITION_COST, CARD_CRAFT_MATERIALS, CARD_CRAFT_EFFORTS, CARD_RARITY_ODDS, CATEGORIES, CATEGORY_NAMES, UPKEEP_PER_BUILDING, STORAGE_KEY, SEASON_LENGTH,
        WORLD_MAP_SIZE: CampaignMap.SIZE, WORLD_MAP_CENTER: { ...CampaignMap.CENTER }, WORLD_MAP_VERSION: CampaignMap.WORLD_VERSION,
        POP_START, POP_MAX, POP_MIN, FOOD_CONSUMPTION_PER_POP, WORKER_BASE_YIELD, STORAGE_BASE, AP_MAX, BUILDING_WORKER_BONUS,
        createState, normalizeState, completeOnboarding, getFirstSessionGuide, cleanEffects, effectTotals, getBattleConfig, getOpponentBattleConfig,
        getRegionalIncome, getAvailableMaterialQualities, getRegionActionState, getRegionBuilding, settleRegionState: settleRegion, buildRegionBuildingState: buildRegionBuilding, beginRegionExpeditionState: beginRegionExpedition, finishRegionExpeditionState: finishRegionExpedition,
        markExpeditionBattleStartedState: markExpeditionBattleStarted, recoverInterruptedExpeditionState: recoverInterruptedExpedition, makeExpeditionMatch,
        addBlueprint, researchBlueprint, constructBlueprint, generateChronicleEntry, chooseDecreeState: chooseDecree, toggleBuildingState: toggleBuilding, toggleDeckCardState: toggleDeckCard, finishDayState: finishDay,
        cardCraftQuote, beginCardCraftState: beginCardCraft, completeCardCraftState: completeCardCraft, failCardCraftState: failCardCraft, claimCardCraftState: claimCardCraft, scienceBranchesForEra, scienceAdvisorSituation, recoverInterruptedCardCrafts,
        getFoodConsumption, getStorageCap, getProductionBreakdown, assignWorkerState: assignWorker, getActiveDecreesState: state => getActiveDecrees(normalizeState(state)), clone, hashString, seededRandom, pickRandom, eraName,
        quoteCardCraft: investment => cardCraftQuote(state, investment),
        generateWorld: (seed, opponents) => clone(CampaignMap.generateWorld(seed, opponents || state.opponents)),
        getWorldMap: () => clone(state.world.tiles.map(definition => ({ ...definition, ...getRegionRecord(state, definition.id) }))),
        getRegionalMap: () => clone(state.world.tiles.map(definition => ({ ...definition, ...getRegionRecord(state, definition.id) }))),
        getMapTile: tileId => { const definition = getWorldTile(state.world, tileId); return definition ? clone({ ...definition, ...getRegionRecord(state, tileId) }) : null; },
        selectMapTile,
        beginCardCraft: (investment, roll, advisorOrder) => { const result = beginCardCraft(state, investment, roll, advisorOrder); if (!result.error) commit(result.state); return result; },
        completeCardCraft: (orderId, card) => { const result = completeCardCraft(state, orderId, card); if (!result.error) commit(result.state); return result; },
        failCardCraft: (orderId, reason) => { const result = failCardCraft(state, orderId, reason); if (!result.error) commit(result.state); return result; },
        getCardCraftOrders: () => clone(state.player.craftOrders),
        getReadyCraftCard: orderId => { const order = state.player.craftOrders.find(item => item.id === orderId && item.status === 'ready'); return order?.card ? clone(order.card) : null; },
        claimCardCraft: orderId => { const result = claimCardCraft(state, orderId); if (result.error) { root.alert(result.error); return null; } commit(result.state); return clone(result.card); },
        getScienceBranchesForEra: () => scienceBranchesForEra(state.player.era),
        recordPractice, completeSeasonState: completeSeason, load, save, render,
        research, construct, toggleBuilding: toggleBuildingAction, toggleDeckCard: toggleDeckCardAction,
        finishDay: finishDayAction, completeSeason: completeSeasonAction, challenge, claimRegion: claimRegionAction, buildRegionBuilding: buildRegionBuildingAction, chooseDecree: chooseDecreeAction, attackRegion: attackRegionAction, resumeRegionExpedition: resumeRegionExpeditionAction, hasPendingMatch: () => Boolean(pendingMatch),
        getPendingMatch: () => pendingMatch ? { ...pendingMatch } : null,
        consumePendingMatch, recordBattleResult, rematch, generateProject, chooseScience, requestRegionFlavor, DIVERSITY_POOLS, generateLocalScienceVariants, generateLocalRegionFlavor, resetLocal,
        beginOnboarding, getStarterCards: () => clone(STARTER_CARDS), getBattleDeckIds: () => state.player.deckCardIds.slice(), getBattleConfigForCurrentPlayer: () => getBattleConfig(state),
        assignWorker: (from, to) => { const result = assignWorker(state, from, to); if (!result.error) commit(result.state); return result; },
        getState: () => clone(state)
    };
    root.CampaignMvp = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
