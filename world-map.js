(function (root) {
    'use strict';

    const SIZE = 7;
    const CENTER = Math.floor(SIZE / 2);
    const MAP_VERSION = 2;
    const DIRECTIONS = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
    ];

    const BIOMES = [
        {
            id: 'riverlands', name: 'Речная долина', shortName: 'Долина', icon: '🌊',
            scenes: [
                'Река медленно огибает высокую террасу, оставляя на берегу тонкие полосы ила.',
                'После сезонного разлива вода отступает, обнажая глиняные отмели и корни тростника.',
                'Здесь русло распадается на мелкие протоки, между которыми лежат ровные участки земли.',
                'С берега видны широкие луга; весной вода подходит почти к линии старых деревьев.'
            ],
            traces: [
                'У кромки воды заметны следы древнего брода и камни, укреплявшие переход.',
                'В сухом грунте попадаются обломки простых глиняных сосудов.',
                'Тростниковая тропа ведёт к месту, где путники могли переждать паводок.',
                'На отмели сохранились неглубокие канавы, похожие на остатки старого водоотвода.'
            ],
            interests: ['Старый брод', 'Глиняная отмель', 'Тростниковая тропа', 'Следы водоотвода', 'Высокий берег', 'Затон']
        },
        {
            id: 'woodlands', name: 'Лесные земли', shortName: 'Лес', icon: '🌲',
            scenes: [
                'Сомкнутые кроны пропускают узкие полосы света, а под ногами лежит мягкая подстилка из листьев.',
                'Лес редеет у каменистой гряды; между стволами видна старая тропа.',
                'В низине растут густые ольхи, выше по склону стоят прямые сосны.',
                'На поляне трава вытоптана звериными тропами, сходящимися к ручью.'
            ],
            traces: [
                'Под корнями заметны следы небольшого сезонного лагеря.',
                'На стволах сохранились зарубки, отмечавшие путь через чащу.',
                'В земле попадаются ровные камни от давно разобранного очага.',
                'Старые ветви срезаны на одной высоте — здесь когда-то проходила дорога.'
            ],
            interests: ['Лесной ручей', 'Старый очаг', 'Звериная тропа', 'Зарубки на деревьях', 'Светлая поляна', 'Лесной склон']
        },
        {
            id: 'steppe', name: 'Степные просторы', shortName: 'Степь', icon: '🌾',
            scenes: [
                'Низкая трава колышется до самого горизонта, а ветер свободно проходит над пологими холмами.',
                'Сухая ложбина пересекает равнину; после дождя по ней течёт неглубокий ручей.',
                'На открытом гребне видны дальние ориентиры, заметные задолго до подхода к ним.',
                'Ковыль скрывает мелкие звериные тропы и неглубокие следы старых стоянок.'
            ],
            traces: [
                'У горизонта различим невысокий курган, сложенный из земли и камня.',
                'На мягком грунте сохранились колеи повозок, уходящие к южной дороге.',
                'Несколько камней образуют круг — вероятно, здесь ставили временные укрытия.',
                'Пологий склон ведёт к месту, где стада могли найти воду после дождей.'
            ],
            interests: ['Невысокий курган', 'Старая колея', 'Каменный круг', 'Пастбище', 'Ветровой гребень', 'Сухой ручей']
        },
        {
            id: 'highlands', name: 'Каменистые высоты', shortName: 'Высоты', icon: '⛰️',
            scenes: [
                'Склоны покрыты осыпями, а узкая седловина открывает путь на соседнее плато.',
                'Тёмные выходы камня прерываются полосами сухой травы и редкими кустарниками.',
                'Ущелье сужается между высокими стенами; на его дне слышно течение подземной воды.',
                'С плато открывается вид на долины, а по краям лежат обломки выветрившейся породы.'
            ],
            traces: [
                'В расщелине видны сколы, оставленные людьми, добывавшими камень.',
                'На перевале сохранилась невысокая стенка из сухой кладки.',
                'У подножия осыпи темнеет вход в неглубокую пещеру.',
                'Каменные метки вдоль тропы указывают на безопасный проход через склон.'
            ],
            interests: ['Кремнёвая осыпь', 'Сухая кладка', 'Горная пещера', 'Каменные метки', 'Высокий перевал', 'Тенистое ущелье']
        },
        {
            id: 'wetlands', name: 'Заболоченные низины', shortName: 'Топи', icon: '🪷',
            scenes: [
                'Мелкая вода скрыта под ковром травы, а над заводями поднимается утренний туман.',
                'Между зарослями камыша тянутся сухие островки, соединённые узкими земляными перемычками.',
                'Ивы наклонены к воде; на мягком берегу отпечатались следы птиц и мелких животных.',
                'Старое русло заросло осокой, но после дождя по нему вновь проходит вода.'
            ],
            traces: [
                'На сухом островке найдены угли и остатки лёгкого укрытия.',
                'Из воды выступают колья — возможно, здесь когда-то укрепляли настил.',
                'У берега лежат обломки плетёной корзины, занесённые илом.',
                'К островку ведёт узкая тропа из жердей, частично ушедшая под воду.'
            ],
            interests: ['Ивовый островок', 'Старый настил', 'Птичья заводь', 'Тропа из жердей', 'Заросшее русло', 'Сухой берег']
        },
        {
            id: 'coast', name: 'Морское побережье', shortName: 'Берег', icon: '⚓',
            scenes: [
                'Прилив оставляет на песке полосы ракушек, а невысокие волны разбиваются о каменную кромку.',
                'Береговая тропа огибает бухту и выходит к открытому мысу.',
                'За полосой солоноватой травы начинается мелководная лагуна.',
                'С вершины обрыва видны островки и светлая полоса прибоя вдоль побережья.'
            ],
            traces: [
                'У воды лежат раковины и обломки кремня, принесённые с дальнего берега.',
                'На плоских камнях видны следы кострищ и временных стоянок.',
                'В песке сохранились остатки древнего причала из коротких брёвен.',
                'Мелкая бухта подходит для лодок, но во время шторма здесь небезопасно.'
            ],
            interests: ['Тихая бухта', 'Ракушечная коса', 'Старый причал', 'Морской мыс', 'Приливная терраса', 'Солёная лагуна']
        },
        {
            id: 'drylands', name: 'Сухие земли', shortName: 'Сухие земли', icon: '🏜️',
            scenes: [
                'Сухое русло пересекает каменистую равнину и наполняется водой лишь после редких ливней.',
                'На открытом плато почти нет тени; низкие кустарники держатся у трещин в камне.',
                'Песок постепенно закрывает старую тропу, ведущую к скалистому выступу.',
                'У подножия холма сохранилась узкая полоса земли, где задерживается влага.'
            ],
            traces: [
                'По краям русла заметны следы колодца, давно засыпанного песком.',
                'Каменная кладка указывает на место, где путники могли укрыться от ветра.',
                'На уступе видны неглубокие знаки, оставленные проходившими караванами.',
                'Среди гальки встречаются кусочки обсидиана и красной охры.'
            ],
            interests: ['Засыпанный колодец', 'Сухое русло', 'Караванные метки', 'Скалистое укрытие', 'Красная охра', 'Каменистое плато']
        }
    ];

    function hashString(value) {
        const text = String(value);
        let hash = 2166136261;
        for (let i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function seededRandom(seed) {
        let value = hashString(seed);
        return function () {
            value += 0x6D2B79F5;
            let t = value;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function pick(rng, values) {
        return values[Math.floor(rng() * values.length)];
    }

    function tileId(x, y) {
        return `cell-${x}-${y}`;
    }

    function getNeighbors(x, y) {
        return DIRECTIONS
            .map(direction => ({ x: x + direction.x, y: y + direction.y }))
            .filter(point => point.x >= 0 && point.x < SIZE && point.y >= 0 && point.y < SIZE);
    }

    function createBiomeAnchors(rng) {
        const anchors = [{ x: CENTER, y: CENTER, biomeId: 'riverlands' }];
        const occupied = new Set([`${CENTER},${CENTER}`]);
        const remainingBiomes = BIOMES.filter(biome => biome.id !== 'riverlands');
        for (const biome of remainingBiomes) {
            let x, y, key;
            do {
                x = Math.floor(rng() * SIZE);
                y = Math.floor(rng() * SIZE);
                key = `${x},${y}`;
            } while (occupied.has(key));
            occupied.add(key);
            anchors.push({ x, y, biomeId: biome.id });
        }
        return anchors;
    }

    function generateWorldMap(seed) {
        const safeSeed = String(seed ?? 'infinite-forge-world').slice(0, 120);
        const rng = seededRandom(safeSeed);
        const anchors = createBiomeAnchors(rng);
        const biomeById = new Map(BIOMES.map(biome => [biome.id, biome]));
        const usedNames = new Set();
        const tiles = [];

        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                const anchor = anchors
                    .map(item => ({
                        ...item,
                        score: Math.hypot(x - item.x, y - item.y) + rng() * 0.8
                    }))
                    .sort((a, b) => a.score - b.score)[0];
                const isHome = x === CENTER && y === CENTER;
                const biome = biomeById.get(isHome ? 'riverlands' : anchor.biomeId);
                const interest = pick(rng, biome.interests);
                let name = interest;
                let ordinal = 2;
                while (usedNames.has(name)) name = `${interest} №${ordinal++}`;
                usedNames.add(name);
                const scene = pick(rng, biome.scenes);
                const trace = pick(rng, biome.traces);
                tiles.push({
                    id: tileId(x, y), x, y,
                    biome: biome.id,
                    biomeName: biome.name,
                    shortBiomeName: biome.shortName,
                    icon: biome.icon,
                    name,
                    interest,
                    summary: `${biome.name}. ${interest}.`,
                    description: `${scene} ${trace}`,
                    isHome
                });
            }
        }
        return tiles;
    }

    function initialRevealed() {
        const ids = [tileId(CENTER, CENTER)];
        for (const point of getNeighbors(CENTER, CENTER)) ids.push(tileId(point.x, point.y));
        return ids;
    }

    function createExplorationState(seed) {
        const safeSeed = String(seed ?? `${Date.now()}-${Math.random()}`).slice(0, 120);
        const homeId = tileId(CENTER, CENTER);
        return {
            version: MAP_VERSION,
            seed: safeSeed,
            width: SIZE,
            height: SIZE,
            tiles: generateWorldMap(safeSeed),
            current: { x: CENTER, y: CENTER },
            selectedId: homeId,
            revealed: initialRevealed(),
            visited: [homeId],
            moveCount: 0
        };
    }

    function normalizeExplorationState(raw, fallbackSeed = 'restored-world') {
        const seed = String(raw?.seed ?? fallbackSeed).slice(0, 120);
        const generated = generateWorldMap(seed);
        const rawTiles = raw?.version === MAP_VERSION && Array.isArray(raw.tiles) ? raw.tiles : [];
        const rawById = new Map(rawTiles.filter(tile => tile && typeof tile.id === 'string').map(tile => [tile.id, tile]));
        const validBiomeIds = new Set(BIOMES.map(biome => biome.id));
        const tiles = generated.map(generatedTile => {
            const saved = rawById.get(generatedTile.id);
            if (!saved) return generatedTile;
            return {
                ...generatedTile,
                biome: validBiomeIds.has(saved.biome) ? saved.biome : generatedTile.biome,
                biomeName: String(saved.biomeName || generatedTile.biomeName).slice(0, 60),
                shortBiomeName: String(saved.shortBiomeName || generatedTile.shortBiomeName).slice(0, 32),
                icon: String(saved.icon || generatedTile.icon).slice(0, 8),
                name: String(saved.name || generatedTile.name).slice(0, 64),
                interest: String(saved.interest || generatedTile.interest).slice(0, 64),
                summary: String(saved.summary || generatedTile.summary).slice(0, 160),
                description: String(saved.description || generatedTile.description).slice(0, 600),
                isHome: generatedTile.isHome
            };
        });
        const validIds = new Set(tiles.map(tile => tile.id));
        const cleanList = value => Array.isArray(value)
            ? [...new Set(value.filter(item => typeof item === 'string' && validIds.has(item)))]
            : [];
        const currentX = Number.isInteger(raw?.current?.x) && raw.current.x >= 0 && raw.current.x < SIZE ? raw.current.x : CENTER;
        const currentY = Number.isInteger(raw?.current?.y) && raw.current.y >= 0 && raw.current.y < SIZE ? raw.current.y : CENTER;
        const currentId = tileId(currentX, currentY);
        const visited = cleanList(raw?.visited);
        if (!visited.includes(tileId(CENTER, CENTER))) visited.unshift(tileId(CENTER, CENTER));
        if (!visited.includes(currentId)) visited.push(currentId);
        const revealed = cleanList(raw?.revealed);
        for (const id of initialRevealed()) if (!revealed.includes(id)) revealed.push(id);
        for (const id of visited) if (!revealed.includes(id)) revealed.push(id);
        for (const point of getNeighbors(currentX, currentY)) {
            const id = tileId(point.x, point.y);
            if (!revealed.includes(id)) revealed.push(id);
        }
        const selectedId = typeof raw?.selectedId === 'string' && revealed.includes(raw.selectedId) ? raw.selectedId : currentId;
        return {
            version: MAP_VERSION,
            seed,
            width: SIZE,
            height: SIZE,
            tiles,
            current: { x: currentX, y: currentY },
            selectedId,
            revealed,
            visited,
            moveCount: Number.isFinite(Number(raw?.moveCount)) ? Math.max(0, Math.min(9999, Math.floor(Number(raw.moveCount)))) : 0
        };
    }

    function selectTile(input, x, y) {
        const state = normalizeExplorationState(input);
        const id = tileId(Number(x), Number(y));
        if (!state.revealed.includes(id)) return { state, error: 'Эта местность ещё не открыта.' };
        state.selectedId = id;
        return { state, tile: state.tiles.find(tile => tile.id === id), error: null };
    }

    function moveToTile(input, x, y) {
        const state = normalizeExplorationState(input);
        const targetX = Number(x), targetY = Number(y);
        if (!Number.isInteger(targetX) || !Number.isInteger(targetY) || targetX < 0 || targetX >= SIZE || targetY < 0 || targetY >= SIZE) {
            return { state, error: 'Координаты вне пределов карты.' };
        }
        const targetId = tileId(targetX, targetY);
        if (!state.revealed.includes(targetId)) return { state, error: 'Сначала открой эту местность.' };
        const distance = Math.abs(state.current.x - targetX) + Math.abs(state.current.y - targetY);
        if (distance !== 1) return { state, error: 'Можно перейти только в соседнюю клетку.' };
        state.current = { x: targetX, y: targetY };
        state.selectedId = targetId;
        state.moveCount += 1;
        if (!state.visited.includes(targetId)) state.visited.push(targetId);
        for (const point of getNeighbors(targetX, targetY)) {
            const id = tileId(point.x, point.y);
            if (!state.revealed.includes(id)) state.revealed.push(id);
        }
        return { state, tile: state.tiles.find(tile => tile.id === targetId), error: null };
    }

    function getProgress(input) {
        const state = normalizeExplorationState(input);
        return {
            total: SIZE * SIZE,
            revealed: state.revealed.length,
            visited: state.visited.length,
            percent: Math.round(state.visited.length / (SIZE * SIZE) * 100)
        };
    }

    const api = {
        SIZE, CENTER, MAP_VERSION, BIOMES, tileId, getNeighbors,
        generateWorldMap, createExplorationState, normalizeExplorationState,
        selectTile, moveToTile, getProgress
    };
    root.WorldMapGenerator = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
