// species.js — бестиарий: шаблоны видов, их экология, ИИ-роли и лор.
//
// Каждый вид — шаблон. Конкретная особь рождается под уровень угрозы (tier):
//   радиус     = (9 + 3.4·tier) · sizeMul
//   здоровье   = (10 + 8.5·tier) · hpMul
//   урон       = (4 + 2.4·tier) · dmgMul
//   скорость   = (62 + 4.2·tier) · speedMul
// Роль (ai) определяет поведение в js/ai.js.

export const ROLE = {
  GRAZE: 'graze',     // пасётся, убегает
  FLOCK: 'flock',     // стайное, держится группы
  HUNT: 'hunt',       // активно охотится
  AMBUSH: 'ambush',   // ждёт в засаде, бьёт рывком
  SCAVENGE: 'scavenge', // ищет падаль и слабых
  DRIFT: 'drift',     // пассивный дрейф (фильтраторы)
  GUARD: 'guard',     // охраняет территорию/реликт
  BOSS: 'boss',       // многофазный хищник
};

export const FAMILY = {
  PLANT: 'plant', GRAZER: 'grazer', OMNIVORE: 'omnivore',
  PREDATOR: 'predator', SCAVENGER: 'scavenger', SPECIAL: 'special',
};

export const FAMILY_NAME = {
  plant: 'Растительные', grazer: 'Травоядные', omnivore: 'Всеядные',
  predator: 'Хищники', scavenger: 'Падальщики', special: 'Особые формы',
};

// Биомы: id, название, глубина, палитра.
export const BIOMES = [
  { id: 'shallows', name: 'Мелководье', depth: [0, 60], biome: 'Тёплые верхние воды', light: 1.0 },
  { id: 'reef', name: 'Коралловый риф', depth: [60, 220], biome: 'Рифовые заросли', light: 0.72 },
  { id: 'trench', name: 'Разлом', depth: [220, 500], biome: 'Холодные расщелины', light: 0.42 },
  { id: 'abyss', name: 'Бездна', depth: [500, 999], biome: 'Чёрная бездна', light: 0.16 },
];

// Шаблон вида:
//   tierMin/tierMax — в каком диапазоне размеров встречается
//   weight[biome]    — насколько часто спавнится в биоме (0 — не водится)
//   ai, shape, mouth  — поведение и внешность
//   parts            — визуальная анатомия (переиспользует рисовальщики органелл)
export const SPECIES = [
  // ---------------- Растительные ----------------
  {
    id: 'diatoma', name: 'Диатомея цепочковая', icon: '⌗', family: FAMILY.PLANT, ai: ROLE.DRIFT,
    shape: 'chain', mouth: 'none', color: '#8ef0a8', color2: '#d4ffb0',
    tierMin: 1, tierMax: 4, sizeMul: 0.85, hpMul: 0.6, dmgMul: 0.2, speedMul: 0.5,
    weight: { shallows: 9, reef: 6, trench: 3, abyss: 0 }, flock: 5, foodValue: 2.2, plant: true,
    parts: { cilia: 1 },
    lore: 'Кремниевый панцирь из двух створок. Растёт цепочками — как древние строматолиты, только микроскопические.',
    habitat: 'Светлая вода, где ещё пробивается солнце.',
  },
  {
    id: 'volvox', name: 'Вольвокс-шар', icon: '❋', family: FAMILY.PLANT, ai: ROLE.DRIFT,
    shape: 'coccus', mouth: 'none', color: '#9be8ff', color2: '#e8fbff',
    tierMin: 2, tierMax: 6, sizeMul: 1.1, hpMul: 0.5, dmgMul: 0.15, speedMul: 0.42,
    weight: { shallows: 6, reef: 5, trench: 2, abyss: 0 }, flock: 8, foodValue: 3.4, plant: true,
    parts: { symbionts: 2, cilia: 1 },
    lore: 'Колония, в которой отдельные клетки договорились быть одним существом. Первый коллектив на планете.',
    habitat: 'Там, где много света: поверхностные слои, верх рифов.',
  },
  {
    id: 'bryozoon', name: 'Мшанка-ковёр', icon: '⋔', family: FAMILY.PLANT, ai: ROLE.DRIFT,
    shape: 'amoeba', mouth: 'none', color: '#c9e57a', color2: '#f0ffc2',
    tierMin: 3, tierMax: 7, sizeMul: 1.5, hpMul: 1.1, dmgMul: 0.2, speedMul: 0.3,
    weight: { shallows: 2, reef: 7, trench: 4, abyss: 1 }, flock: 2, foodValue: 5.5, plant: true,
    parts: { filter: 2, membrane: 1 },
    lore: 'Живой ковёр, расползающийся по камням. Сквозь него цедят воду миллионы крошечных ртов.',
    habitat: 'Камни рифа и стенки разломов.',
  },
  {
    id: 'mycota', name: 'Микота споровая', icon: '☁', family: FAMILY.SPECIAL, ai: ROLE.DRIFT,
    shape: 'star', mouth: 'none', color: '#c9a6ff', color2: '#f0d9ff',
    tierMin: 4, tierMax: 9, sizeMul: 1.3, hpMul: 0.9, dmgMul: 0.5, speedMul: 0.36,
    weight: { shallows: 0, reef: 3, trench: 6, abyss: 4 }, flock: 1, foodValue: 4.2,
    parts: { toxin: 2, spikes: 1 },
    hazard: { type: 'spores', radius: 150, dps: 4.5, slow: 0.55 },
    lore: 'Грибоподобная колония, выпускающая облака спор. Есть её можно, но вдохнуть её дыхание — опасно.',
    habitat: 'Тенистые склоны разлома.',
  },

  // ---------------- Травоядные ----------------
  {
    id: 'ciliata', name: 'Цилия-бродяжка', icon: '≈', family: FAMILY.GRAZER, ai: ROLE.FLOCK,
    shape: 'oval', mouth: 'filter', color: '#7fe7ff', color2: '#d6f8ff',
    tierMin: 1, tierMax: 4, sizeMul: 0.92, hpMul: 0.85, dmgMul: 0.5, speedMul: 1.06,
    weight: { shallows: 10, reef: 7, trench: 3, abyss: 0 }, flock: 6, foodValue: 1.5,
    parts: { cilia: 2, eyespot: 1 },
    lore: 'Первое существо, научившееся убегать. Сотня ресничек гребёт в такт — зрелище успокаивающее.',
    habitat: 'Повсюду в тёплых водах.',
  },
  {
    id: 'rota', name: 'Ротатор вихревой', icon: '✺', family: FAMILY.GRAZER, ai: ROLE.FLOCK,
    shape: 'spiral', mouth: 'filter', color: '#a5ffd6', color2: '#f0fff8',
    tierMin: 2, tierMax: 5, sizeMul: 1.0, hpMul: 0.9, dmgMul: 0.6, speedMul: 1.0,
    weight: { shallows: 7, reef: 8, trench: 3, abyss: 0 }, flock: 4, foodValue: 2.0,
    parts: { cilia: 3, filter: 1 },
    lore: 'Вращающийся венчик ресничек затягивает планктон, как воронка — воду в сточную решётку.',
    habitat: 'Плавающие маты у поверхности.',
  },
  {
    id: 'spicula', name: 'Спикула игольчатая', icon: '✳', family: FAMILY.GRAZER, ai: ROLE.GRAZE,
    shape: 'coccus', mouth: 'beak', color: '#ffd9a0', color2: '#fff4dd',
    tierMin: 2, tierMax: 6, sizeMul: 1.0, hpMul: 1.15, dmgMul: 0.8, speedMul: 0.92,
    weight: { shallows: 5, reef: 8, trench: 5, abyss: 1 }, flock: 3, foodValue: 2.4,
    parts: { spikes: 2, fins: 1 },
    lore: 'Мирная на вид, но усыпана микроскопическими иглами. Хищники, рискнувшие её проглотить, плевались неделю.',
    habitat: 'Рифовые плато.',
  },
  {
    id: 'crustula', name: 'Крустула рачковая', icon: '⊂', family: FAMILY.GRAZER, ai: ROLE.FLOCK,
    shape: 'shield', mouth: 'beak', color: '#ffbf8f', color2: '#ffe9d0',
    tierMin: 3, tierMax: 7, sizeMul: 1.15, hpMul: 1.3, dmgMul: 0.9, speedMul: 0.98,
    weight: { shallows: 3, reef: 7, trench: 6, abyss: 2 }, flock: 3, foodValue: 3.2,
    parts: { armor: 1, jet: 1, eyespot: 1 },
    lore: 'Панцирный скакун: бьёт хвостом-сифоном и улетает прочь, оставляя преследователя с пустой пастью.',
    habitat: 'Расщелины и каменные осыпи.',
  },
  {
    id: 'echino', name: 'Эхино-шипастик', icon: '✼', family: FAMILY.GRAZER, ai: ROLE.GRAZE,
    shape: 'star', mouth: 'disk', color: '#d8c3a5', color2: '#fff0d6',
    tierMin: 4, tierMax: 8, sizeMul: 1.35, hpMul: 1.5, dmgMul: 1.1, speedMul: 0.78,
    weight: { shallows: 1, reef: 6, trench: 7, abyss: 3 }, flock: 1, foodValue: 5.0,
    parts: { spikes: 3, armor: 2 },
    lore: 'Медленный танк рифа. Радиальный панцирь с шипами означает, что трогать его нужно с умом.',
    habitat: 'Плотное дно разлома.',
  },

  // ---------------- Всеядные ----------------
  {
    id: 'euplotes', name: 'Эуплот-бегун', icon: '⊳', family: FAMILY.OMNIVORE, ai: ROLE.FLOCK,
    shape: 'oval', mouth: 'disk', color: '#8fd0ff', color2: '#e2f4ff',
    tierMin: 1, tierMax: 5, sizeMul: 0.95, hpMul: 0.8, dmgMul: 0.7, speedMul: 1.25,
    weight: { shallows: 8, reef: 6, trench: 2, abyss: 0 }, flock: 3, foodValue: 1.4,
    parts: { cilia: 3, eyespot: 2 },
    lore: 'Ходит на «ножках» из ресничек и бежит от тени быстрее всех в мелководье.',
    habitat: 'Мелководье, песчаные отмели.',
  },
  {
    id: 'mimik', name: 'Мимик обманчивый', icon: '◑', family: FAMILY.OMNIVORE, ai: ROLE.AMBUSH,
    shape: 'amoeba', mouth: 'jaws', color: '#b8a9ff', color2: '#e6deff',
    tierMin: 3, tierMax: 8, sizeMul: 1.05, hpMul: 1.0, dmgMul: 1.35, speedMul: 1.05,
    weight: { shallows: 2, reef: 5, trench: 5, abyss: 2 }, flock: 1, foodValue: 2.6,
    ability: 'mimic', stealth: 0.75,
    parts: { chromatophore: 2, eyespot: 2, fins: 1 },
    lore: 'Копирует окраску и движения чужих. Пока вы думаете, что рядом друг — он думает, что вы обед.',
    habitat: 'Смешанные стаи, притворяется одним из них.',
  },
  {
    id: 'ostraco', name: 'Остракод-раковина', icon: '◒', family: FAMILY.OMNIVORE, ai: ROLE.SCAVENGE,
    shape: 'shield', mouth: 'beak', color: '#a9c9d6', color2: '#eaf6ff',
    tierMin: 3, tierMax: 8, sizeMul: 1.2, hpMul: 1.45, dmgMul: 1.0, speedMul: 0.9,
    weight: { shallows: 3, reef: 5, trench: 7, abyss: 5 }, flock: 2, foodValue: 3.0,
    parts: { armor: 3, eyespot: 1 },
    lore: 'Двустворчатая крепость, закованная в слабое место геологии. Ест то, что осталось от чужих трапез.',
    habitat: 'Донные архивы костей и панцирей.',
  },

  // ---------------- Хищники ----------------
  {
    id: 'hydra', name: 'Гидра щупальцевая', icon: '⋔', family: FAMILY.PREDATOR, ai: ROLE.AMBUSH,
    shape: 'bell', mouth: 'tentacles', color: '#ff9fd0', color2: '#ffe0f0',
    tierMin: 2, tierMax: 7, sizeMul: 1.2, hpMul: 1.0, dmgMul: 1.1, speedMul: 0.7,
    weight: { shallows: 5, reef: 8, trench: 4, abyss: 1 }, flock: 1, foodValue: 3.0,
    venom: 3.5,
    parts: { toxin: 1, cilia: 1 },
    lore: 'Волна щупалец с крапивными капсулами. Проплывать мимо стоит быстро и не по прямой.',
    habitat: 'Колышется на течении, притворяясь водорослью.',
  },
  {
    id: 'sepiola', name: 'Сепиола чернильная', icon: '⌁', family: FAMILY.PREDATOR, ai: ROLE.HUNT,
    shape: 'bacillus', mouth: 'beak', color: '#c4b4ff', color2: '#f2eaff',
    tierMin: 3, tierMax: 8, sizeMul: 1.15, hpMul: 0.95, dmgMul: 1.3, speedMul: 1.3,
    weight: { shallows: 3, reef: 6, trench: 6, abyss: 2 }, flock: 1, foodValue: 2.8,
    ability: 'ink',
    parts: { jet: 2, chromatophore: 1, eyespot: 2 },
    lore: 'Стремительный охотник, оставляющий за собой чернильное облако. Универсальный ответ на любую погоню.',
    habitat: 'Открытая вода над разломом.',
  },
  {
    id: 'virosa', name: 'Вироза ядовитая', icon: '☣', family: FAMILY.PREDATOR, ai: ROLE.HUNT,
    shape: 'spiral', mouth: 'jaws', color: '#b9ff70', color2: '#e8ffc4',
    tierMin: 4, tierMax: 9, sizeMul: 1.1, hpMul: 1.05, dmgMul: 1.4, speedMul: 1.1,
    weight: { shallows: 0, reef: 4, trench: 7, abyss: 5 }, flock: 1, foodValue: 2.6,
    venom: 6.5, trail: 'poison',
    parts: { toxin: 3, flagellum: 2 },
    lore: 'Плавает, оставляя в воде едва заметный токсин. Даже просто находясь рядом, вы теряете силы.',
    habitat: 'Густые придонные слои разлома.',
  },
  {
    id: 'laternula', name: 'Лятернула свечная', icon: '☀', family: FAMILY.PREDATOR, ai: ROLE.HUNT,
    shape: 'lantern', mouth: 'jaws', color: '#ffd98c', color2: '#fff6d8',
    tierMin: 4, tierMax: 9, sizeMul: 1.2, hpMul: 1.1, dmgMul: 1.5, speedMul: 1.15,
    weight: { shallows: 0, reef: 3, trench: 7, abyss: 7 }, flock: 1, foodValue: 3.4,
    lured: true, nocturne: 2.4,
    parts: { luciferin: 2, eyespot: 3, fins: 2 },
    lore: 'Фонарик на конце отростка горит в темноте. К нему плывёт всё живое — и не возвращается.',
    habitat: 'Нижние слои, где солнце уже не достаёт.',
  },
  {
    id: 'lucifuga', name: 'Люцифуга-тень', icon: '☾', family: FAMILY.PREDATOR, ai: ROLE.HUNT,
    shape: 'amoeba', mouth: 'jaws', color: '#7f8cff', color2: '#dfe3ff',
    tierMin: 5, tierMax: 10, sizeMul: 1.25, hpMul: 1.25, dmgMul: 1.6, speedMul: 1.2,
    weight: { shallows: 0, reef: 1, trench: 5, abyss: 8 }, flock: 1, foodValue: 3.6,
    nocturne: 3.0, stealth: 0.5, ability: 'stun',
    parts: { chromatophore: 2, flagellum: 3, eyespot: 3 },
    lore: 'Охотится в темноте, ориентируясь на биение мембран. Свет люциферина для неё — как звон колокола.',
    habitat: 'Постоянная тьма бездны.',
  },
  {
    id: 'stolb', name: 'Стрекач-столбняк', icon: '⇶', family: FAMILY.PREDATOR, ai: ROLE.GUARD,
    shape: 'crystal', mouth: 'none', color: '#a8ffe0', color2: '#e8fff8',
    tierMin: 4, tierMax: 9, sizeMul: 1.1, hpMul: 1.2, dmgMul: 1.2, speedMul: 0.55,
    weight: { shallows: 0, reef: 3, trench: 7, abyss: 6 }, flock: 1, foodValue: 4.0,
    ranged: { type: 'sting', cd: 3.4, speed: 230, dmgMul: 0.85, range: 420, aim: 1 },
    parts: { spikes: 2, toxin: 1, eyespot: 2 },
    lore: 'Выстреливает крапивные капсулы на дистанцию. Неподвижен — и оттого особенно опасен.',
    habitat: 'Неподвижный страж реликтовых полей.',
  },
  {
    id: 'abyssus', name: 'Абиссус-фильтратор', icon: '☁', family: FAMILY.SPECIAL, ai: ROLE.DRIFT,
    shape: 'bell', mouth: 'filter', color: '#9fb8c9', color2: '#e6f2ff',
    tierMin: 6, tierMax: 10, sizeMul: 2.1, hpMul: 2.6, dmgMul: 0.6, speedMul: 0.62,
    weight: { shallows: 0, reef: 1, trench: 5, abyss: 7 }, flock: 2, foodValue: 16,
    parts: { filter: 3, gills: 2, membrane: 3 },
    lore: 'Живой сито-кокон размером с дом. Цедит воду, не замечая мелочи. Зато кто-то большой замечает его.',
    habitat: 'Медленные слои глубины.',
  },
  {
    id: 'tubifex', name: 'Тубифекс-трубач', icon: '⫶', family: FAMILY.SCAVENGER, ai: ROLE.SCAVENGE,
    shape: 'bacillus', mouth: 'tentacles', color: '#e0a0a0', color2: '#ffd6d6',
    tierMin: 2, tierMax: 7, sizeMul: 0.9, hpMul: 0.7, dmgMul: 1.0, speedMul: 1.35,
    weight: { shallows: 4, reef: 5, trench: 5, abyss: 3 }, flock: 3, foodValue: 1.8,
    parts: { cilia: 2 },
    lore: 'Стайка санитаров океана: чует падаль за сотни длин тела и приходит первой.',
    habitat: 'Всюду, где кто-то недавно умер.',
  },
  {
    id: 'vermius', name: 'Вермиус-могильщик', icon: '∿', family: FAMILY.SCAVENGER, ai: ROLE.SCAVENGE,
    shape: 'chain', mouth: 'disk', color: '#c9b9ff', color2: '#efeaff',
    tierMin: 4, tierMax: 9, sizeMul: 1.3, hpMul: 1.35, dmgMul: 1.3, speedMul: 1.05,
    weight: { shallows: 0, reef: 3, trench: 6, abyss: 7 }, flock: 2, foodValue: 4.2,
    parts: { armor: 1, lytik: 2, flagellum: 2 },
    lore: 'Суставчатый червь, разбирающий чужие скелеты по частям. Съедает всё, включая древние гены.',
    habitat: 'Кладбища крупных форм.',
  },
  {
    id: 'giganteus', name: 'Гигантеус первородный', icon: '❂', family: FAMILY.PREDATOR, ai: ROLE.HUNT,
    shape: 'shield', mouth: 'jaws', color: '#ff8a5c', color2: '#ffd9b8',
    tierMin: 7, tierMax: 10, sizeMul: 1.7, hpMul: 3.2, dmgMul: 1.9, speedMul: 1.05,
    weight: { shallows: 0, reef: 0, trench: 3, abyss: 6 }, flock: 1, foodValue: 22,
    alpha: true, ability: 'slam',
    parts: { armor: 3, spikes: 3, flagellum: 3, eyespot: 3 },
    lore: 'Зверь, который помнит времена, когда океан был горячим. Его панцирь врос в породу.',
    habitat: 'Царствует на дне бездны.',
  },
  {
    id: 'leviathan', name: 'Левиафан реликтовый', icon: '⌘', family: FAMILY.PREDATOR, ai: ROLE.BOSS,
    shape: 'tripod', mouth: 'horror', color: '#ff6b6b', color2: '#ffd0d0',
    tierMin: 8, tierMax: 10, sizeMul: 2.6, hpMul: 6.5, dmgMul: 2.4, speedMul: 0.95,
    weight: { shallows: 0, reef: 0, trench: 0, abyss: 0 }, flock: 1, foodValue: 60,
    boss: true,
    parts: { spikes: 3, toxin: 3, armor: 3, jet: 2, sonic: 2 },
    lore: 'Тот, кто первым научился ждать. Три фазы голода. Награда — его реликтовые гены.',
    habitat: 'Приходит, когда реликтовые поля потревожены трижды.',
  },
];

export const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((s) => [s.id, s]));

// Пассивные «живые» частицы-пища (не существа, а биомасса).
export const FOOD_KINDS = {
  plant: { color: '#8ef0a8', color2: '#e2ffcf', r: 3.6, value: 1.25, xp: 0.55, name: 'фитопланктон' },
  algae: { color: '#ffd166', color2: '#fff0c2', r: 4.4, value: 2.0, xp: 0.95, name: 'водорослевый комок' },
  spore: { color: '#c9a6ff', color2: '#f2e6ff', r: 3.8, value: 1.2, xp: 0.75, name: 'спора', poison: 2.5 },
  crystal: { color: '#7fe7ff', color2: '#ffffff', r: 3.2, value: 0.9, xp: 0.5, name: 'минеральная крупинка' },
  relic: { color: '#ff9de0', color2: '#fff0ff', r: 7.0, value: 6.0, xp: 3.0, name: 'реликтовый ген', relic: true },
  chunk: { color: '#ff9a8b', color2: '#ffd8d0', r: 4.8, value: 2.6, xp: 1.25, name: 'кусок плоти' },
};

export function biomeOf(x, y, worldRadius) {
  const d = Math.sqrt(x * x + y * y) / worldRadius;
  if (d < 0.28) return 'shallows';
  if (d < 0.56) return 'reef';
  if (d < 0.8) return 'trench';
  return 'abyss';
}
export const BIOME_BY_ID = Object.fromEntries(BIOMES.map((b) => [b.id, b]));

// Подбор вида для спавна: биом + уровень угрозы + вес.
export function pickSpecies(rng, biome, tier, aggressiveBias = 1) {
  const entries = [];
  for (const s of SPECIES) {
    if (s.boss) continue;
    if (tier < s.tierMin || tier > s.tierMax + 2) continue;
    let w = s.weight[biome] ?? 0;
    if (w <= 0) continue;
    if (s.family === FAMILY.PREDATOR || s.family === FAMILY.OMNIVORE) w *= aggressiveBias;
    if (s.family === FAMILY.PLANT || s.family === FAMILY.GRAZER) w *= 1 / aggressiveBias;
    // чем ближе уровень вида к уровню угрозы, тем вероятнее
    const fit = 1 - Math.min(1, Math.abs((s.tierMin + s.tierMax) / 2 - tier) / 6);
    entries.push([s, w * (0.5 + fit)]);
  }
  if (!entries.length) return SPECIES_BY_ID.ciliata;
  return rng.weighted(entries);
}

// Уровень особи: вокруг уровня угрозы с разбросом и редкими «выскочками».
export function rollTier(rng, threat, variance = 2, surgeChance = 0.06) {
  let t = threat + Math.round(rng.range(-variance, variance));
  if (rng.chance(surgeChance)) t += Math.round(rng.range(2, 4));
  return Math.max(1, Math.min(10, t));
}
