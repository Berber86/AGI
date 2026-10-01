(function (root) {
    'use strict';

    const SIZE = 7;
    const CENTER = Object.freeze({ x: 3, y: 3 });
    const WORLD_VERSION = 2;
    const DIRECTIONS = Object.freeze([
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: 0 }
    ]);

    const TERRAIN = Object.freeze({
        water: { label: 'Вода', icon: '≈', names: ['воды', 'протоки', 'заводи', 'озёра', 'плёсы', 'заливы'] },
        plains: { label: 'Равнина', icon: '🌾', names: ['луга', 'поля', 'степи', 'низины', 'долины', 'пастбища'] },
        forest: { label: 'Лес', icon: '🌲', names: ['рощи', 'чащи', 'дубравы', 'леса', 'просеки', 'опушки'] },
        hills: { label: 'Холмы', icon: '⛰️', names: ['холмы', 'склоны', 'увалы', 'гребни', 'предгорья', 'кряжи'] },
        mountain: { label: 'Горы', icon: '🏔️', names: ['вершины', 'горы', 'скалы', 'хребты', 'ущелья', 'перевалы'] },
        wetlands: { label: 'Плавни', icon: '🌿', names: ['плавни', 'топи', 'болота', 'камыши', 'заводи', 'сырые луга'] },
        desert: { label: 'Сухие земли', icon: '🏜️', names: ['барханы', 'пустоши', 'солончаки', 'сухие земли', 'пески', 'сухие низины'] },
        coast: { label: 'Побережье', icon: '⚓', names: ['берега', 'заливы', 'отмели', 'протоки', 'приливы', 'морские луга'] }
    });

    const GUARD_RANKS = ['Дозор', 'Караул', 'Стражи', 'Хранители'];
    const GUARD_CLANS = ['Старые рубежи', 'Дозор дальних троп', 'Хранители окраин', 'Каменные стражи'];

    const ADJECTIVES = [
        'Тихие', 'Дальние', 'Серые', 'Каменные', 'Речные', 'Верхние', 'Нижние',
        'Широкие', 'Зелёные', 'Золотые', 'Сухие', 'Солнечные', 'Северные', 'Южные',
        'Древние', 'Ветреные', 'Туманные', 'Красные', 'Бледные', 'Синие', 'Дикие',
        'Заречные', 'Утренние', 'Зимние', 'Медные', 'Ольховые', 'Дикие', 'Светлые'
    ];

    const TERRAIN_TEXT = Object.freeze({
        water: [
            'Тёмная вода скрывает глубину; над ней кружат птицы и тянутся рыбьи тропы.',
            'Течение несёт ил и обломки ветвей к далёкому берегу.',
            'Ветер дробит гладь на короткие волны, а у отмелей видны косяки рыбы.'
        ],
        plains: [
            'Низкие травы колышутся на ветру; почва здесь местами глубока и плодородна.',
            'По равнине проходят стада, а весной в ложбинах задерживается вода.',
            'Открытая земля даёт простор для пастбищ, полей и дальнего обзора.'
        ],
        forest: [
            'Под кронами деревьев тянутся звериные тропы и заросли съедобных растений.',
            'В лесной тени можно найти древесину, ягоды и укрытие от непогоды.',
            'Сосны и лиственные деревья чередуются с небольшими солнечными полянами.'
        ],
        hills: [
            'Каменные склоны открывают выходы кремня и места для дозорных стоянок.',
            'Между невысокими грядами проходят сухие тропы и весенние ручьи.',
            'С верхних склонов видны речные долины и дальние дымки поселений.'
        ],
        mountain: [
            'На крутых склонах лежат обломки камня; перевалы доступны лишь узкими тропами.',
            'Гребень защищает долину от ветров и открывает выходы твёрдой породы.',
            'Скалы собирают снег и дождевую воду, питающую ручьи внизу.'
        ],
        wetlands: [
            'Камышовые заводи кормят птиц и рыбу, но почва под ногами остаётся сырой.',
            'Вода разливается по низким лугам и оставляет после себя тёмный плодородный ил.',
            'Плавни дают рыбу, тростник и естественное укрытие от путников.'
        ],
        desert: [
            'Сухие ветра несут песок, а редкие колодцы становятся важными остановками в пути.',
            'Каменистая почва хранит следы древних стоянок и караванных троп.',
            'Днём земля раскаляется; жизнь держится возле редких источников и тенистых уступов.'
        ],
        coast: [
            'Мелководье оставляет раковины и рыбу, а берег меняется с каждым приливом.',
            'С моря приходят солёные ветра; вдоль берега удобно вести лодки и обмен.',
            'Между каменистыми мысами лежат защищённые бухты и песчаные отмели.'
        ]
    });

    const SITE_TEXT = Object.freeze({
        food: [
            'Здесь можно устроить поля, запруды или сезонные пастбища.',
            'Это место подходит для запасов пищи и простых ирригационных работ.'
        ],
        materials: [
            'Лес и камень дают общине сырьё для жилья и орудий.',
            'Местные породы и древесина пригодятся для первых мастерских.'
        ],
        knowledge: [
            'Открытый горизонт удобен для наблюдений за сезонами и небом.',
            'Здесь можно отмечать разливы, тени и ход звёзд, сравнивая их год от года.'
        ],
        copper: [
            'В обнажениях скал встречается медная руда; освоение места откроет плавильню.',
            'Зелёные прожилки малахита отмечают залежи меди, ценного для будущего ремесла.'
        ],
        tin: [
            'Каменистая тропа ведёт к редкой оловянной руде и путям обмена.',
            'Местные жилы олова неприметны, но важны для будущих сплавов.'
        ],
        salt: [
            'Соль можно добывать для хранения пищи и обмена с соседями.',
            'Белые отложения указывают на соляное место, ценное в долгих переходах.'
        ],
        obsidian: [
            'Чёрное вулканическое стекло колется острыми сколами — находка для мастерской.',
            'Застывшая лава даёт обсидиан, ценимый за твёрдость и острый край.'
        ],
        settlement: [
            'Здесь стоит поселение соседнего народа; его земли охраняет местная дружина.',
            'Дым над крышами выдаёт укреплённую стоянку соперников.'
        ],
        home: [
            'Это центральный очаг общины — отсюда начнутся разведка и освоение окрестностей.',
            'На этом месте будет расти поселение игрока; вокруг него лежит ещё не освоенный край.'
        ]
    });

    function seededRandom(seed) {
        let t = seed >>> 0;
        return function () {
            t += 0x6D2B79F5;
            let r = Math.imul(t ^ (t >>> 15), 1 | t);
            r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
            return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
        };
    }

    function createSeed() {
        return (Math.floor(Math.random() * 0x100000000) ^ Date.now()) >>> 0;
    }

    function pick(rng, values) {
        return values[Math.floor(rng() * values.length)];
    }

    function tileId(x, y) {
        return 'tile-' + x + '-' + y;
    }

    function isInside(x, y) {
        return x >= 0 && y >= 0 && x < SIZE && y < SIZE;
    }

    function neighborsOf(x, y) {
        return DIRECTIONS
            .map(direction => ({ x: x + direction.dx, y: y + direction.dy }))
            .filter(point => isInside(point.x, point.y))
            .map(point => tileId(point.x, point.y));
    }

    // Vision uses the same four-way distance as territorial adjacency.
    function getVisibleTileIds(world, sourceIds, radius = 2) {
        const tiles = Array.isArray(world?.tiles) ? world.tiles : [];
        const tileById = new Map(tiles.map(tile => [tile.id, tile]));
        const maxDistance = clamp(radius, 0, SIZE * 2, 2);
        const distances = new Map();
        const queue = [];
        const sources = sourceIds instanceof Set ? Array.from(sourceIds) : Array.isArray(sourceIds) ? sourceIds : [];
        for (const id of sources) {
            if (!tileById.has(id) || distances.has(id)) continue;
            distances.set(id, 0);
            queue.push(id);
        }
        while (queue.length) {
            const currentId = queue.shift();
            const current = tileById.get(currentId);
            const distance = distances.get(currentId);
            if (!current || distance >= maxDistance) continue;
            for (const nextId of neighborsOf(current.x, current.y)) {
                if (distances.has(nextId)) continue;
                distances.set(nextId, distance + 1);
                queue.push(nextId);
            }
        }
        return tiles.filter(tile => distances.has(tile.id)).map(tile => tile.id);
    }

    function makeSmoothField(rng) {
        let field = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => rng()));
        for (let pass = 0; pass < 3; pass++) {
            const next = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
            for (let y = 0; y < SIZE; y++) {
                for (let x = 0; x < SIZE; x++) {
                    const nearby = [{ x, y }];
                    for (const point of DIRECTIONS.map(direction => ({ x: x + direction.dx, y: y + direction.dy }))) {
                        if (isInside(point.x, point.y)) nearby.push(point);
                    }
                    const average = nearby.reduce((sum, point) => sum + field[point.y][point.x], 0) / nearby.length;
                    next[y][x] = field[y][x] * 0.38 + average * 0.62;
                }
            }
            field = next;
        }
        const values = field.flat();
        const minimum = Math.min(...values);
        const maximum = Math.max(...values);
        const span = Math.max(0.0001, maximum - minimum);
        return field.map(row => row.map(value => (value - minimum) / span));
    }

    function getTile(tiles, x, y) {
        return tiles[y * SIZE + x];
    }

    function floodReachable(water) {
        const startId = tileId(CENTER.x, CENTER.y);
        const reached = new Set([startId]);
        const queue = [startId];
        while (queue.length) {
            const currentId = queue.shift();
            const match = /^tile-(\d+)-(\d+)$/.exec(currentId);
            const x = Number(match[1]);
            const y = Number(match[2]);
            for (const neighborId of neighborsOf(x, y)) {
                if (water.has(neighborId) || reached.has(neighborId)) continue;
                reached.add(neighborId);
                queue.push(neighborId);
            }
        }
        return reached;
    }

    function findRiverPath(rng, water, height) {
        const boundary = [];
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                if (x !== 0 && y !== 0 && x !== SIZE - 1 && y !== SIZE - 1) continue;
                const id = tileId(x, y);
                if (!water.has(id) && !(x === CENTER.x && y === CENTER.y)) boundary.push({ x, y, id, height: height[y][x] });
            }
        }
        const mouths = Array.from(water).map(id => {
            const match = /^tile-(\d+)-(\d+)$/.exec(id);
            return { id, x: Number(match[1]), y: Number(match[2]) };
        });
        if (!boundary.length || !mouths.length) return [];

        const source = boundary
            .map(point => ({ ...point, tie: rng() }))
            .sort((a, b) => (b.height + b.tie * 0.08) - (a.height + a.tie * 0.08))[0];
        const mouth = mouths
            .map(point => ({ ...point, distance: Math.abs(point.x - source.x) + Math.abs(point.y - source.y), tie: rng() }))
            .sort((a, b) => (b.distance + b.tie * 0.2) - (a.distance + a.tie * 0.2))[0];

        const queue = [source];
        const previous = new Map([[source.id, null]]);
        while (queue.length) {
            const current = queue.shift();
            if (current.id === mouth.id) break;
            const directions = DIRECTIONS.slice();
            for (let index = directions.length - 1; index > 0; index--) {
                const swapIndex = Math.floor(rng() * (index + 1));
                [directions[index], directions[swapIndex]] = [directions[swapIndex], directions[index]];
            }
            for (const direction of directions) {
                const x = current.x + direction.dx;
                const y = current.y + direction.dy;
                if (!isInside(x, y) || (x === CENTER.x && y === CENTER.y)) continue;
                const id = tileId(x, y);
                if (previous.has(id)) continue;
                previous.set(id, current.id);
                queue.push({ x, y, id });
            }
        }
        if (!previous.has(mouth.id)) return [];
        const path = [];
        let cursor = mouth.id;
        while (cursor) {
            path.push(cursor);
            cursor = previous.get(cursor);
        }
        return path.reverse();
    }

    function makeUniqueName(terrain, rng, usedNames, index) {
        const nouns = TERRAIN[terrain].names;
        for (let attempt = 0; attempt < 64; attempt++) {
            const name = pick(rng, ADJECTIVES) + ' ' + pick(rng, nouns);
            if (!usedNames.has(name)) {
                usedNames.add(name);
                return name;
            }
        }
        const fallback = pick(rng, nouns) + ' №' + (index + 1);
        usedNames.add(fallback);
        return fallback;
    }

    function chooseCandidate(rng, candidates, used, predicate) {
        const available = candidates.filter(tile => !used.has(tile.id) && (!predicate || predicate(tile)));
        if (!available.length) return null;
        return available[Math.floor(rng() * available.length)];
    }

    function terrainFor(height, moisture, nearWater) {
        if (nearWater) return 'coast';
        if (height > 0.78) return 'mountain';
        if (height > 0.60) return 'hills';
        if (moisture > 0.82) return 'wetlands';
        if (moisture < 0.20) return 'desert';
        if (moisture > 0.57) return 'forest';
        return 'plains';
    }

    function siteForTerrain(terrain, rng) {
        if (terrain === 'forest' || terrain === 'hills' || terrain === 'mountain') return rng() < 0.72 ? 'materials' : 'knowledge';
        if (terrain === 'desert') return rng() < 0.7 ? 'salt' : 'materials';
        if (terrain === 'wetlands' || terrain === 'coast') return rng() < 0.8 ? 'food' : 'knowledge';
        return rng() < 0.72 ? 'food' : 'knowledge';
    }

    function makeDescription(tile, rng) {
        if (tile.terrain === 'water') return pick(rng, TERRAIN_TEXT.water) + ' Этот участок отмечает водную границу; переправы пока нет.';
        if (tile.kind === 'home') return pick(rng, SITE_TEXT.home);
        if (tile.kind === 'settlement') {
            const setting = pick(rng, TERRAIN_TEXT[tile.terrain]);
            return setting + ' ' + tile.factionName + ' держит здесь поселение и окрестные тропы.';
        }
        if (tile.feature === 'copper-vein') return pick(rng, TERRAIN_TEXT[tile.terrain]) + ' ' + pick(rng, SITE_TEXT.copper);
        if (tile.feature === 'tin-route') return pick(rng, TERRAIN_TEXT[tile.terrain]) + ' ' + pick(rng, SITE_TEXT.tin);
        if (tile.feature === 'salt-deposit') return pick(rng, TERRAIN_TEXT[tile.terrain]) + ' ' + pick(rng, SITE_TEXT.salt);
        if (tile.feature === 'obsidian-vein') return pick(rng, TERRAIN_TEXT[tile.terrain]) + ' ' + pick(rng, SITE_TEXT.obsidian);
        const base = pick(rng, TERRAIN_TEXT[tile.terrain]);
        const site = pick(rng, SITE_TEXT[tile.siteType] || SITE_TEXT.food);
        return tile.hasRiver ? base + ' Рядом проходит река. ' + site : base + ' ' + site;
    }

    function generateWorld(seed, opponents) {
        const worldSeed = Number.isFinite(Number(seed)) ? Number(seed) >>> 0 : createSeed();
        const opponentList = Array.isArray(opponents) ? opponents.filter(item => item && typeof item.id === 'string') : [];
        const rng = seededRandom(worldSeed);
        const height = makeSmoothField(rng);
        const moisture = makeSmoothField(rng);
        const water = new Set([
            tileId(0, 0), tileId(SIZE - 1, 0), tileId(0, SIZE - 1), tileId(SIZE - 1, SIZE - 1)
        ]);
        const protectedStart = (x, y) => Math.abs(x - CENTER.x) <= 1 && Math.abs(y - CENTER.y) <= 1;
        const waterCount = 7 + Math.floor(rng() * 4);
        const possibleWater = [];
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                const id = tileId(x, y);
                if (water.has(id) || protectedStart(x, y)) continue;
                const isEdge = x === 0 || y === 0 || x === SIZE - 1 || y === SIZE - 1;
                possibleWater.push({ id, x, y, score: height[y][x] + (isEdge ? -0.28 : 0.16) + rng() * 0.06 });
            }
        }
        possibleWater.sort((a, b) => a.score - b.score);
        for (const cell of possibleWater.slice(0, Math.max(0, waterCount - water.size))) water.add(cell.id);

        // Each land tile must be reachable from the central starting area in this local prototype.
        let reachable = floodReachable(water);
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                const id = tileId(x, y);
                if (!water.has(id) && !reachable.has(id)) water.add(id);
            }
        }
        reachable = floodReachable(water);
        if (!reachable.has(tileId(CENTER.x, CENTER.y))) throw new Error('Generated map lost its central land tile.');

        const rivers = findRiverPath(rng, water, height);
        const riverSet = new Set(rivers.filter(id => !water.has(id)));
        const tiles = [];
        for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
                const id = tileId(x, y);
                const isWater = water.has(id);
                const nextToWater = !isWater && neighborsOf(x, y).some(neighborId => water.has(neighborId));
                const terrain = isWater ? 'water' : (x === CENTER.x && y === CENTER.y ? 'plains' : terrainFor(height[y][x], moisture[y][x], nextToWater));
                tiles.push({
                    id, x, y, terrain, kind: isWater ? 'water' : 'resource',
                    siteType: isWater ? 'water' : siteForTerrain(terrain, rng),
                    feature: riverSet.has(id) ? 'river' : null,
                    hasRiver: riverSet.has(id),
                    icon: TERRAIN[terrain].icon,
                    terrainLabel: TERRAIN[terrain].label,
                    elevation: Math.round(height[y][x] * 100),
                    moisture: Math.round(moisture[y][x] * 100),
                    name: '', shortName: '', description: '', shortText: '',
                    initialOwner: null, minEra: 0, resource: null, resourceLabel: '', factionName: '', guard: null,
                    neighbors: neighborsOf(x, y)
                });
            }
        }

        const centerTile = getTile(tiles, CENTER.x, CENTER.y);
        centerTile.kind = 'home';
        centerTile.siteType = 'home';
        centerTile.initialOwner = 'player';

        const used = new Set([centerTile.id]);
        const opponentsWithTiles = [];
        const occupiedForSpecialSites = new Set([centerTile.id]);
        const landTiles = tiles.filter(tile => tile.terrain !== 'water');
        const distantTiles = landTiles
            .filter(tile => !protectedStart(tile.x, tile.y))
            .map(tile => ({ tile, distance: Math.abs(tile.x - CENTER.x) + Math.abs(tile.y - CENTER.y), angle: Math.atan2(tile.y - CENTER.y, tile.x - CENTER.x) }));
        for (const opponent of opponentList) {
            const candidate = chooseCandidate(rng, distantTiles.map(entry => entry.tile), occupiedForSpecialSites,
                tile => Math.abs(tile.x - CENTER.x) + Math.abs(tile.y - CENTER.y) >= 3);
            if (!candidate) break;
            const existing = opponentsWithTiles.map(item => item.tile);
            let selected = candidate;
            if (existing.length) {
                const spreadCandidates = distantTiles.map(entry => entry.tile).filter(tile => !occupiedForSpecialSites.has(tile.id));
                spreadCandidates.sort((a, b) => {
                    const aMin = Math.min(...existing.map(other => Math.abs(a.x - other.x) + Math.abs(a.y - other.y)));
                    const bMin = Math.min(...existing.map(other => Math.abs(b.x - other.x) + Math.abs(b.y - other.y)));
                    return bMin - aMin;
                });
                selected = spreadCandidates[0] || candidate;
            }
            selected.kind = 'settlement';
            selected.siteType = 'settlement';
            selected.feature = 'settlement';
            selected.initialOwner = opponent.id;
            selected.factionName = String(opponent.clan || opponent.name || 'Соседний народ').slice(0, 60);
            selected.minEra = 2;
            selected.resource = null;
            selected.resourceLabel = '';
            occupiedForSpecialSites.add(selected.id);
            opponentsWithTiles.push({ opponent, tile: selected });
        }

        const metalCandidate = (terrainIds, avoidStart) => {
            const candidates = landTiles.filter(tile => !occupiedForSpecialSites.has(tile.id)
                && (!avoidStart || !protectedStart(tile.x, tile.y))
                && terrainIds.includes(tile.terrain));
            const fallback = landTiles.filter(tile => !occupiedForSpecialSites.has(tile.id) && (!avoidStart || !protectedStart(tile.x, tile.y)));
            return chooseCandidate(rng, candidates.length ? candidates : fallback, occupiedForSpecialSites);
        };
        const copper = metalCandidate(['hills', 'mountain'], true);
        if (copper) {
            copper.siteType = 'copper';
            copper.feature = 'copper-vein';
            copper.resource = 'copper';
            copper.resourceLabel = 'Медная руда';
            copper.minEra = 2;
            occupiedForSpecialSites.add(copper.id);
        }
        const tin = metalCandidate(['plains', 'hills', 'coast'], true);
        if (tin) {
            tin.siteType = 'tin';
            tin.feature = 'tin-route';
            tin.resource = 'tin';
            tin.resourceLabel = 'Оловянная жила';
            tin.minEra = 2;
            occupiedForSpecialSites.add(tin.id);
        }
        const salt = metalCandidate(['desert', 'coast', 'wetlands'], true);
        if (salt) {
            salt.siteType = 'salt';
            salt.feature = 'salt-deposit';
            salt.resource = 'salt';
            salt.resourceLabel = 'Соляное место';
        }
        // Обсидиан: ключевой ресурс Каменного века (эра 0), доступен с самого начала игры
        // (нет minEra) — месторождения лавового стекла ищут среди гор и холмов, как и медь.
        const obsidian = metalCandidate(['mountain', 'hills'], true);
        if (obsidian) {
            obsidian.siteType = 'obsidian';
            obsidian.feature = 'obsidian-vein';
            obsidian.resource = 'obsidian';
            obsidian.resourceLabel = 'Обсидиановая жила';
        }

        const usedNames = new Set();
        for (let index = 0; index < tiles.length; index++) {
            const tile = tiles[index];
            if (tile.kind === 'home') {
                tile.name = 'Центральное поселение';
                usedNames.add(tile.name);
            } else {
                tile.name = makeUniqueName(tile.terrain, rng, usedNames, index);
            }
            tile.shortName = tile.name.length > 15 ? tile.name.slice(0, 14) + '…' : tile.name;
            tile.description = makeDescription(tile, rng).slice(0, 360);
            if (tile.feature === 'copper-vein') tile.shortText = 'Медь · плавильня';
            else if (tile.feature === 'tin-route') tile.shortText = 'Олово · торговый путь';
            else if (tile.feature === 'salt-deposit') tile.shortText = 'Соль · солеварня';
            else if (tile.feature === 'obsidian-vein') tile.shortText = 'Обсидиан · мастерская';
            else if (tile.kind === 'settlement') tile.shortText = tile.factionName;
            else if (tile.kind === 'home') tile.shortText = 'Столица игрока';
            else if (tile.hasRiver) tile.shortText = 'Река · ' + tile.terrainLabel.toLowerCase();
            else tile.shortText = tile.terrainLabel;
            tile.neighbors = neighborsOf(tile.x, tile.y);
        }

        // Exactly half of the neutral, traversable land cells receive a local quest guard.
        const guardCandidates = tiles.filter(tile => tile.kind === 'resource' && tile.terrain !== 'water');
        const guardPlacementRng = seededRandom((worldSeed ^ 0x9e3779b9) >>> 0);
        const guardCount = Math.floor(guardCandidates.length / 2);
        const guardPlacements = guardCandidates
            .map(tile => ({ tile, score: guardPlacementRng() }))
            .sort((a, b) => a.score - b.score || a.tile.id.localeCompare(b.tile.id));
        const placeGuard = (tile) => {
            const tileSeed = (worldSeed + (tile.y * SIZE + tile.x + 1) * 0x6d2b79f5) >>> 0;
            const guardRng = seededRandom(tileSeed);
            const distance = Math.abs(tile.x - CENTER.x) + Math.abs(tile.y - CENTER.y);
            const era = Math.min(4, Math.max(tile.minEra, Math.floor(distance / 3)));
            tile.guard = {
                id: 'guard-' + tile.id,
                name: pick(guardRng, GUARD_RANKS) + ' «' + tile.name + '»',
                clan: pick(guardRng, GUARD_CLANS),
                era
            };
        };
        for (const { tile } of guardPlacements.slice(0, guardCount)) placeGuard(tile);
        // Инвариант обучающего шага «освой свободную клетку»: рядом со стартом всегда есть земля без охраны.
        const homeAdjacent = neighborsOf(CENTER.x, CENTER.y)
            .map(neighborId => tiles.find(tile => tile.id === neighborId))
            .filter(tile => tile && tile.kind === 'resource' && tile.terrain !== 'water');
        if (homeAdjacent.length > 0 && homeAdjacent.every(tile => tile.guard)) {
            const freed = homeAdjacent[0];
            delete freed.guard;
            const replacement = guardPlacements.find(({ tile }) => tile !== freed && !tile.guard);
            if (replacement) placeGuard(replacement.tile);
        }

        return {
            version: WORLD_VERSION,
            generatorVersion: WORLD_VERSION,
            seed: worldSeed,
            size: SIZE,
            start: { ...CENTER },
            rivers: rivers.slice(),
            tiles
        };
    }

    function normalizeWorld(raw, opponentList) {
        const opponents = Array.isArray(opponentList) ? opponentList : [];
        if (!raw || Number(raw.version) !== WORLD_VERSION || Number(raw.size) !== SIZE || !Array.isArray(raw.tiles) || raw.tiles.length !== SIZE * SIZE) {
            return generateWorld(raw && raw.seed, opponents);
        }
        const seed = Number.isFinite(Number(raw.seed)) ? Number(raw.seed) >>> 0 : createSeed();
        const generated = generateWorld(seed, opponents);
        const rawById = new Map(raw.tiles.filter(tile => tile && typeof tile.id === 'string').map(tile => [tile.id, tile]));
        const opponentIds = new Set(opponents.map(opponent => opponent.id));
        generated.tiles = generated.tiles.map(fallback => {
            const saved = rawById.get(fallback.id);
            if (!saved || Number(saved.x) !== fallback.x || Number(saved.y) !== fallback.y) return fallback;
            const terrain = Object.hasOwn(TERRAIN, saved.terrain) ? saved.terrain : fallback.terrain;
            const allowedSiteTypes = ['water', 'home', 'food', 'materials', 'knowledge', 'copper', 'tin', 'salt', 'obsidian', 'settlement'];
            const kind = ['water', 'home', 'resource', 'settlement'].includes(saved.kind) ? saved.kind : fallback.kind;
            const initialOwner = saved.initialOwner === 'player' || opponentIds.has(saved.initialOwner) ? saved.initialOwner : fallback.initialOwner;
            return {
                ...fallback,
                terrain,
                terrainLabel: TERRAIN[terrain].label,
                icon: TERRAIN[terrain].icon,
                kind: fallback.x === CENTER.x && fallback.y === CENTER.y ? 'home' : kind,
                siteType: allowedSiteTypes.includes(saved.siteType) ? saved.siteType : fallback.siteType,
                feature: typeof saved.feature === 'string' && ['river', 'settlement', 'copper-vein', 'tin-route', 'salt-deposit', 'obsidian-vein'].includes(saved.feature) ? saved.feature : fallback.feature,
                hasRiver: Boolean(saved.hasRiver),
                elevation: clamp(saved.elevation, 0, 100, fallback.elevation),
                moisture: clamp(saved.moisture, 0, 100, fallback.moisture),
                name: cleanText(saved.name, 64, fallback.name),
                shortName: cleanText(saved.shortName, 20, fallback.shortName),
                description: cleanText(saved.description, 360, fallback.description),
                shortText: cleanText(saved.shortText, 80, fallback.shortText),
                initialOwner: fallback.x === CENTER.x && fallback.y === CENTER.y ? 'player' : initialOwner,
                minEra: clamp(saved.minEra, 0, 6, fallback.minEra),
                resource: ['copper', 'tin', 'salt', 'obsidian'].includes(saved.resource) ? saved.resource : fallback.resource,
                resourceLabel: cleanText(saved.resourceLabel, 60, fallback.resourceLabel),
                factionName: cleanText(saved.factionName, 60, fallback.factionName),
                guard: fallback.guard ? { ...fallback.guard } : null,
                neighbors: neighborsOf(fallback.x, fallback.y)
            };
        });
        generated.rivers = Array.isArray(raw.rivers)
            ? raw.rivers.filter(id => typeof id === 'string' && generated.tiles.some(tile => tile.id === id)).slice(0, SIZE * SIZE)
            : generated.rivers;
        return generated;
    }

    function clamp(value, minimum, maximum, fallback) {
        const number = Number(value);
        return Number.isFinite(number) ? Math.max(minimum, Math.min(maximum, Math.floor(number))) : fallback;
    }

    function cleanText(value, maxLength, fallback) {
        return typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : fallback;
    }

    const api = {
        SIZE,
        CENTER: { ...CENTER },
        WORLD_VERSION,
        TERRAIN,
        createSeed,
        tileId,
        generateWorld,
        normalizeWorld,
        neighborsOf,
        getVisibleTileIds
    };

    root.CampaignMap = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
