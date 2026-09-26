// config.js — вся числовая балансировка в одном месте.
// Меняя только этот файл, можно перестроить темп игры.

export const CFG = {
  version: '1.0.0',
  saveKey: 'primordial_ocean_v1',

  // ---------------- Мир ----------------
  world: {
    radius: 3400,          // радиус океана в игровых единицах
    boundary: 130,         // толщина «плёнки поверхностного натяжения» на краю
    gridCell: 170,         // размер ячейки пространственного хеша
    featureCount: 190,     // число статических объектов (камни, рифы, гнёзда)
    relicCount: 9,         // реликтовых месторождений
    seed: 20260926,
  },

  // ---------------- Камера и время ----------------
  camera: {
    zoom: 0.92,            // базовый зум
    zoomByTier: -0.018,    // чем крупнее клетка, тем шире обзор
    zoomRange: [0.62, 1.05],
    lookAhead: 58,         // смещение камеры по направлению движения
    shakeDecay: 5.2,
  },
  day: {
    length: 200,           // секунд на полные сутки
    start: 0.28,           // старт — утро
  },

  // ---------------- Управление ----------------
  stick: {
    radius: 60,            // базовый радиус хода пальца в пикселях
    dead: 0.14,            // мёртвая зона (доля хода) — гасит дрожание пальца
    expo: 1.3,             // кривая отклика: 1 — линейно, больше — мягче у центра
    sensitivity: { low: 82, normal: 60, high: 44 },   // радиус хода для трёх режимов
  },

  // ---------------- Клетка игрока ----------------
  player: {
    baseHp: 96,
    hpPerTier: 13,
    baseSpeed: 134,        // единиц в секунду
    speedPerTier: -0.018,  // крупнее — чуть медленнее
    accelLambda: 7.4,      // плавность разгона
    turnLambda: 9.0,
    radius: 17,
    radiusPerTier: 2.6,
    baseEnergy: 105,
    energyRegen: 7.6,
    dashCost: 13,
    dashCooldown: 2.6,
    dashTime: 0.24,
    dashPower: 560,
    dashInvuln: 0.3,       // кадры неуязвимости в рывке
    biteCooldown: 0.42,
    biteDmg: 10,
    biteReach: 1.16,       // множитель к сумме радиусов
    spikelessContact: 0.55,// доля контактного урона без шипов
    vision: 470,
    regenOutOfCombat: 1.6, // ХП/с вне боя
    noCombatTime: 6.5,
    starve: 2.6,           // урон в секунду при нулевой энергии
    eatRadius: 1.08,       // множитель касания пищи
    magnetBase: 62,        // базовый радиус притяжения пищи (растёт от ресничек и люциферина)
    eatHeal: 0.6,          // ХП за съеденную биомассу
    dnaPerBiomass: 0.16,
    growth: [19, 35, 56, 80, 110, 147, 189, 237, 291], // биомасса на переход к следующему уровню
    maxTier: 10,
    genomeSlotBase: 6,
    genomeSlotPerTier: 1.2,
    evolveFarSurcharge: 0.25, // +25% к цене мутации вне гнезда
  },

  // ---------------- Экономика ДНК ----------------
  dna: {
    firstSpeciesBonus: 14,
    kill: [3, 20],         // диапазон за обычную добычу (масштабируется уровнем)
    plantChance: 0.07,
    plantValue: 1,
    relicSite: 26,
    eggLay: 0,             // кладка яйца платная отдельно
    nestCost: 45,
    nestCooldown: 25,
    respawnDnaLoss: 0.25,  // доля потерянной ДНК при гибели
    respawnBiomassLoss: 0.22,
  },

  // ---------------- Награды и рост ----------------
  progression: {
    relicGenesForWin: 3,
    alliesForWin: 3,
    repPerKill: -7,
    repPerFeed: 6,
    repPerShare: 11,
    allyThreshold: 62,
    hostileThreshold: -45,
    allyCallCost: 18,
    allyCallCooldown: 22,
    allyDuration: 26,
  },

  // ---------------- Спавн и экосистема ----------------
  spawn: {
    maxCells: 132,
    maxFood: 240,
    maxParticles: 260,
    spawnMinDist: 520,     // ближе этого расстояния к игроку не спавним
    spawnMaxDist: 1250,
    despawnDist: 1500,
    foodDespawnDist: 1250,
    populationScale: {
      calm: 0.72, normal: 1.0, harsh: 1.22, abyss: 1.5,
    },
    bloomMultiplier: 3.2,
    bloomDuration: 46,
    migrationEvery: [105, 190],
    migrationPack: [4, 9],
    tideEvery: [70, 130],
    tideDuration: 22,
    tideStrength: 118,
  },

  // ---------------- Сложности ----------------
  difficulty: {
    calm:   { name: 'Лужа',   desc: 'Мало хищников, щедрая еда. Для знакомства с океаном.', dmg: 0.7, hp: 0.85, food: 1.45, pop: 0.72, dnai: 1.25, aggressive: 0.65 },
    normal: { name: 'Океан',  desc: 'Сбалансированный мир. Рекомендуемый режим.', dmg: 1.0, hp: 1.0, food: 1.0, pop: 1.0, dnai: 1.0, aggressive: 1.0 },
    harsh:  { name: 'Разлом', desc: 'Голодные хищники, скудная пища. Для опытных клеток.', dmg: 1.32, hp: 1.2, food: 0.74, pop: 1.22, dnai: 0.9, aggressive: 1.35 },
    abyss:  { name: 'Бездна', desc: 'Всё против тебя. ДНК-штраф, но и слава — иная.', dmg: 1.6, hp: 1.4, food: 0.6, pop: 1.5, dnai: 0.8, aggressive: 1.7 },
  },

  // ---------------- Боевые правила ----------------
  combat: {
    edibleRatio: 1.22,     // меньше этого множителя радиуса — можно проглотить
    sameSpeciesRepLoss: 1.6,
    poisonTick: 0.5,
    burnArmor: 0.35,       // доля урона, проходящая сквозь броню у обычных укусов
    corpseChunks: [2, 4],
    corpseValue: [1.4, 2.6],
    spikeDamageScale: 0.85,
    chainRadius: 190,
    bossPhaseTwo: 0.5,
  },

  // ---------------- Качество графики ----------------
  quality: {
    low:    { name: 'Экономно', dpr: 1, particles: 0.35, glow: 0,  lighting: false, foodDetail: 0.6, caustics: false },
    medium: { name: 'Обычно',   dpr: 1.5, particles: 0.7, glow: 1, lighting: true, foodDetail: 0.85, caustics: true },
    high:   { name: 'Богато',   dpr: 2, particles: 1,   glow: 2,  lighting: true, foodDetail: 1, caustics: true },
  },

  // ---------------- Прочее ----------------
  // Отброс от столкновений: теперь зависит от массы (хитин) и плавников.
  knockback: {
    light: 150,            // толчок от равной клетки
    heavy: 240,            // толчок от крупной клетки
    duration: 0.65,        // пауза между толчками по одной цели
    spikeBase: 130,        // масштаб отбрасывания от шипов
  },

  misc: {
    toastDuration: 3.1,
    hintTime: 9,
    autosaveEvery: 20,
    fpsSample: 2.5,
    maxDelta: 0.05,
  },
};

export const DIFFICULTY_ORDER = ['calm', 'normal', 'harsh', 'abyss'];
export const LINEAGES = [
  {
    id: 'herb', name: 'Собиратель', icon: '❦',
    desc: 'Потомок фотосинтезирующих предков. Быстро растёт на растительной пище, но слаб в прямой схватке.',
    perks: ['Нет штрафа за протухшую биомассу', '+40% к пищевой ценности водорослей', 'Старт: фильтрующий аппарат и реснички'],
    mods: { plantBonus: 1.4, meatPenalty: 0.55, hpMul: 0.94, speedMul: 1.05 },
    startParts: { filter: 1, cilia: 1 },
    startDna: 20,
  },
  {
    id: 'carn', name: 'Охотник', icon: '⚔',
    desc: 'Хищник с самого начала. Живёт за счёт чужой плоти, крепче и злее, но растёт медленнее.',
    perks: ['+45% к ценности мяса', 'Обмен веществ дешевле на −15%', 'Старт: челюсти и жгутик'],
    mods: { plantPenalty: 0.6, meatBonus: 1.45, hpMul: 1.08, speedMul: 1.0, upkeepMul: 0.85 },
    startParts: { jaws: 1, flagellum: 1 },
    startDna: 20,
  },
  {
    id: 'omni', name: 'Всеядный', icon: '◍',
    desc: 'Универсал-оппортунист. Ест всё подряд, легче находит общий язык с любым видом.',
    perks: ['Без штрафов за тип пищи', '+25% к накоплению репутации', 'Старт: ротовой диск и вакуоль'],
    mods: { plantBonus: 1.05, meatBonus: 1.05, repMul: 1.25, hpMul: 1.0, speedMul: 1.0 },
    startParts: { disc: 1, vacuole: 1 },
    startDna: 30,
  },
  {
    id: 'symb', name: 'Симбионт', icon: '∞',
    desc: 'Живёт в союзе с другими. Получает энергию от симбионтов, зовёт стаю с самого начала.',
    perks: ['Всегда +1 энергия/с у симбионтов', 'Скидка на призыв стаи', 'Старт: симбионты и глазки'],
    mods: { symbiosis: 1, callDiscount: 0.5, hpMul: 0.98 },
    startParts: { symbionts: 1, eyespot: 1 },
    startDna: 24,
    unlock: 'ms_symbiosis',   // открывается достижением
  },
];
