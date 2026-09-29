// @ts-nocheck
/* Игровая модель кампании. Перенесена без изменений логики из Berber86/AGI (campaign.js): чистые функции состояния. */
const root = globalThis;
function eraName(index) { return ERAS[Math.max(0, Math.min(ERAS.length - 1, index))]; }

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
            floodplain: ['Запруда', 'Канава', 'Плотина', 'Арык', 'Пойменный амбар', 'Речные ворота', 'Иловые поля', 'Шадуф', 'Бассейн Нила'],
            hills: ['Каменоломня', 'Щебёночная яма', 'Тёска', 'Каменный навес', 'Кремнёвый склад', 'Горная тропа', 'Обсидиановая мастерская', 'Кремнёвый прииск'],
            calendar: ['Круг камней', 'Обсерватория', 'Солнечные часы', 'Звёздная площадка', 'Календарный столб', 'Тени', 'Стоунхендж', 'Карнак'],
            copper: ['Медная яма', 'Плавильня', 'Горн', 'Тигельная', 'Медный двор', 'Дымная печь', 'Малахитовая шахта', 'Медный горн Балкан'],
            'tin-route': ['Караван-сарай', 'Оловянный склад', 'Торговый стан', 'Меняльный двор', 'Путь олова', 'Перевал', 'Караван Аккада', 'Путь Саргона'],
            'rival-settlement': ['Форпост', 'Сторожка', 'Острог', 'Застава', 'Пограничный двор', 'Крепостица', 'Курган Ямников', 'Стан Степного Круга'],
            oasis: ['Финиковая роща', 'Оазис', 'Колодец', 'Пальмовый сад', 'Сад Набатеи', 'Финиковый рай'],
            'salt-flats': ['Солеварня', 'Соляная яма', 'Соляной склад', 'Соляные копи Галича', 'Солёное озеро']
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

    function generateLocalRegionFlavor(regionId, playerSeed) {
        const rng = seededRandom(playerSeed + hashString(regionId) + 42);
        const prefixes = DIVERSITY_POOLS.buildingPrefixes[regionId] || ['Постройка', 'Лагерь', 'Стан'];
        const name = pickRandom(rng, DIVERSITY_POOLS.adjectives) + ' ' + pickRandom(rng, prefixes) + ' ' + pickRandom(rng, DIVERSITY_POOLS.buildingSuffixes);
        const descPool = DIVERSITY_POOLS.events[regionId] || DIVERSITY_POOLS.events.seasonal;
        // fallback to any
        const anyEvents = Object.values(DIVERSITY_POOLS.events).flat();
        const event = pickRandom(rng, descPool || anyEvents);
        return { name: name.slice(0, 80), description: (event + '. Уникальная постройка, какой нет у других общин.').slice(0, 200) };
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
    const REGION_DEFINITIONS = [
        { id: 'home', name: 'Речное поселение', icon: '🏛️', kind: 'home', biome: 'river', initialOwner: 'player', col: 1, row: 2, minEra: 0, neighbors: ['floodplain', 'hills', 'calendar'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Дом народа и начало всех путей. Как Урук или Иерихон — первое поселение.' },
        { id: 'floodplain', name: 'Заливная пойма', icon: '🌾', kind: 'resource', biome: 'river', initialOwner: null, col: 2, row: 1, minEra: 0, neighbors: ['home', 'calendar', 'copper'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Плодородные берега — место для ирригации и амбара. Нильская пойма, шумерские каналы.' },
        { id: 'hills', name: 'Кремнёвые холмы', icon: '⛰️', kind: 'resource', biome: 'highlands', initialOwner: null, col: 2, row: 3, minEra: 0, neighbors: ['home', 'calendar', 'tin-route'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Каменоломня даёт материалы. Гран-Прессиньи, обсидиан Анатолии.' },
        { id: 'calendar', name: 'Круг времён года', icon: '☀️', kind: 'resource', biome: 'forest', initialOwner: null, col: 3, row: 2, minEra: 0, neighbors: ['home', 'floodplain', 'hills'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Обсерватория открывает знания. Стоунхендж, Карнак — мегалиты и календарь.' },
        { id: 'copper', name: 'Медный рудник', icon: '🟠', kind: 'resource', biome: 'highlands', initialOwner: null, col: 4, row: 1, minEra: 2, neighbors: ['floodplain', 'rival-settlement'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Плавильня даёт материалы и открывает отборное сырьё. Балканы, первые медники.' },
        { id: 'tin-route', name: 'Оловянный путь', icon: '🛤️', kind: 'resource', biome: 'steppe', initialOwner: null, col: 4, row: 3, minEra: 2, neighbors: ['hills', 'rival-settlement'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Караван-сарай вместе с медью открывает мастерское. Путь олова — как у аккадцев.' },
        { id: 'rival-settlement', name: 'Поселение Степного Круга', icon: '⚑', kind: 'settlement', biome: 'steppe', initialOwner: 'steppe', col: 5, row: 2, minEra: 2, neighbors: ['copper', 'tin-route'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Укреплённое поселение ямников — курганы, кони. Форпост даёт по 1 каждого ресурса.' },
        { id: 'oasis', name: 'Оазис Фиников', icon: '🌴', kind: 'resource', biome: 'oasis', initialOwner: null, col: 2, row: 2, minEra: 1, neighbors: ['home', 'hills'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Финиковый оазис — как в Аравии. Даёт еду и укрытие караванам.' },
        { id: 'salt-flats', name: 'Соляные копи', icon: '🧂', kind: 'resource', biome: 'desert', initialOwner: null, col: 3, row: 1, minEra: 1, neighbors: ['floodplain', 'copper'], yields: { food: 0, materials: 0, knowledge: 0 }, description: 'Соль — богатство древности. Галит, сохранение пищи.' }
    ];

    const REGION_BUILDINGS = {
        floodplain: { id: 'irrigation', name: 'Ирригация', cost: { materials: 4 }, yields: { food: 2, materials: 0, knowledge: 0 }, workerBonus: { food: 0.3 }, description: 'Пассив +2🌾 и +0.3 к каждому 🌾-рабочему в синергии с амбаром. Как шадуф Египта.' },
        hills: { id: 'quarry', name: 'Каменоломня', cost: { materials: 4 }, yields: { food: 0, materials: 2, knowledge: 0 }, workerBonus: {}, description: '+2🪵 в день. Обсидиан Анатолии, кремень Гран-Прессиньи.' },
        calendar: { id: 'observatory', name: 'Обсерватория', cost: { materials: 3, knowledge: 1 }, yields: { food: 0, materials: 0, knowledge: 2 }, workerBonus: {}, description: '+2📚 в день. Мегалиты Стоунхенджа, календарь майя.' },
        copper: { id: 'smelter', name: 'Плавильня', cost: { materials: 5, knowledge: 1 }, yields: { food: 0, materials: 1, knowledge: 0 }, workerBonus: {}, unlocks: ['refined'], description: '+1🪵 и открывает отборное сырьё. Балканские медники 5000 до н.э.' },
        'tin-route': { id: 'caravan', name: 'Караван-сарай', cost: { materials: 4, food: 1 }, yields: { food: 0, materials: 1, knowledge: 0 }, workerBonus: {}, unlocks: ['masterwork'], description: '+1🪵, вместе с плавильней открывает мастерское. Путь олова Аккада.' },
        'rival-settlement': { id: 'outpost', name: 'Форпост', cost: { materials: 6 }, yields: { food: 1, materials: 1, knowledge: 1 }, workerBonus: {}, description: '+1 каждого ресурса. Курган ямников.' },
        oasis: { id: 'palm-grove', name: 'Финиковая роща', cost: { materials: 3, food: 1 }, yields: { food: 2, materials: 0, knowledge: 0 }, workerBonus: {}, description: '+2🌾 в день. Оазис как в Аравии и Сахаре.' },
        'salt-flats': { id: 'salt-works', name: 'Солеварня', cost: { materials: 4 }, yields: { food: 0, materials: 1, knowledge: 1 }, workerBonus: {}, description: '+1🪵+1📚. Соль — деньги древности.' },
        home: null
    };

    function createStartingRegions() {
        return REGION_DEFINITIONS.map(region => ({ id: region.id, ownerId: region.initialOwner, capturedDay: region.initialOwner ? 1 : null, building: null, buildingFlavor: null }));
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
            let buildingFlavor = null;
            if (saved && saved.building) {
                const rb = REGION_BUILDINGS[definition.id];
                if (rb && saved.building === rb.id) building = rb.id;
            } else if (saved && ownerId === 'player' && definition.id !== 'home') {
                if (definition.yields && (definition.yields.food || definition.yields.materials || definition.yields.knowledge)) {
                    const rb = REGION_BUILDINGS[definition.id];
                    if (rb) building = rb.id;
                }
            }
            if (building && saved && saved.buildingFlavor && typeof saved.buildingFlavor === 'object') {
                buildingFlavor = {
                    name: String(saved.buildingFlavor.name || '').slice(0, 80),
                    description: String(saved.buildingFlavor.description || '').slice(0, 400)
                };
            }
            return {
                id: definition.id,
                ownerId,
                capturedDay: ownerId === null ? null : clampInt(saved?.capturedDay, 1, SEASON_LENGTH, 1),
                building,
                buildingFlavor
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
        // 100500 diversity: уникальное имя для каждого игрока даже без LLM
        const seed = hashString(state.player.name + state.player.clan + regionId + String(state.day));
        record.buildingFlavor = generateLocalRegionFlavor(regionId, seed);
        markDailyOrderUsed(state, 'construction');
        state.player.campaignNotice = 'Построено: ' + record.buildingFlavor.name + ' (' + rb.name + ') в ' + REGION_DEFINITIONS.find(r=>r.id===regionId).name + '. Уникальная постройка — такой нет у других. Доход завтра.';
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
            description: region.description,
            biome: region.biome || 'unknown'
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

export const M = {
  SEASON_LENGTH, STORAGE_KEY, CARD_CRAFT_MATERIALS, CARD_CRAFT_EFFORTS, CARD_RARITY_ODDS, SCIENCE_BRANCHES, ERAS, ERA_HISTORICAL, DECREES, EFFECTS, DIVERSITY_POOLS,
  CATEGORIES, CATEGORY_NAMES, ORIGINS, BIOMES, GEOGRAPHY, TRAITS, NEARBY, HISTORICAL_CULTURES, OPENING_FOCUSES, REGION_DEFINITIONS, REGION_BUILDINGS,
  REGION_CAPTURE_COST, REGION_EXPEDITION_COST, STARTER_CARDS, POP_MAX, POP_START, FOOD_CONSUMPTION_PER_POP, WORKER_BASE_YIELD, AP_MAX, UPKEEP_PER_BUILDING,
  createState, normalizeState, completeOnboarding, getFirstSessionGuide, effectTotals, getBattleConfig, getOpponentBattleConfig, getRegionalIncome,
  getAvailableMaterialQualities, getRegionActionState, settleRegion, buildRegionBuilding, beginRegionExpedition, finishRegionExpedition, markExpeditionBattleStarted,
  makeExpeditionMatch, addBlueprint, cleanEffects, researchBlueprint, constructBlueprint, chooseDecree, toggleBuilding, toggleDeckCard, finishDay, cardCraftQuote,
  beginCardCraft, completeCardCraft, failCardCraft, claimCardCraft, scienceBranchesForEra, scienceAdvisorSituation, getFoodConsumption, getStorageCap,
  getProductionBreakdown, assignWorker, recordPractice, completeSeason, load, save, generateLocalScienceVariants, generateLocalRegionFlavor, generateChronicleEntry,
  hashString, seededRandom, pickRandom, eraName, clone
};
