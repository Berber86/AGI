// landspecies.js — суша: биомы, виды зверей, еда и правила общения.
//
// Каждый вид — шаблон, из которого рождаются особи разного размера:
//   радиус   = (13 + 4.6·tier) · sizeMul
//   здоровье = (16 + 11·tier) · hpMul
//   урон     = (5 + 2.8·tier) · dmgMul
//   скорость = (86 + 5.4·tier) · speedMul
//
// Главное отличие стадии суши: у каждого вида есть характер общения (social).
// Он говорит, какие из четырёх действий ему нравятся, а какое раздражает,
// и как быстро вид дорожит знакомством (tame). Никакой «кнопки дружбы»:
// чтобы вид стал союзником, нужно спеть, сплясать, показать позу или приласкать
// именно так, как принято у него.

export const LAND_AI = {
  GRAZE: 'graze',       // пасётся, убегает от крупных
  FLOCK: 'flock',       // стайное, держится своих
  HUNT: 'hunt',         // активно охотится
  AMBUSH: 'ambush',     // ждёт в зарослях, бьёт из засады
  SCAVENGE: 'scavenge', // ищет падаль, не брезгует кладками
  GUARD: 'guard',       // охраняет территорию
  APEX: 'apex',         // многофазный владыка
};

export const LAND_FAMILY = {
  HERD: 'herd', GRAZER: 'grazer', PREDATOR: 'predator',
  SCAVENGER: 'scavenger', SPECIAL: 'special', APEX: 'apex',
};

export const LAND_FAMILY_NAME = {
  herd: 'Стадные', grazer: 'Травоядные', predator: 'Хищники',
  scavenger: 'Падальщики', special: 'Особые формы', apex: 'Владыка суши',
};

// Биомы: id, название, растительность, освещённость, описание.
export const LAND_BIOMES = [
  { id: 'shore', name: 'Прибрежье', ground: 'Тёплый песок и мелкая вода', light: 1.0, veg: 0.35 },
  { id: 'plain', name: 'Луга', ground: 'Высокая трава и кусты', light: 0.92, veg: 0.9 },
  { id: 'forest', name: 'Лес', ground: 'Папоротники и старые стволы', light: 0.55, veg: 1.35 },
  { id: 'rock', name: 'Скалы', ground: 'Голый камень и гейзеры', light: 0.78, veg: 0.2 },
];

export const SOCIAL_ACTIONS = [
  { id: 'sing', name: 'Пение', icon: '♪', hint: 'горловой мешок' },
  { id: 'dance', name: 'Танец', icon: '♫', hint: 'перья' },
  { id: 'pose', name: 'Поза', icon: '✋', hint: 'грива и воротник' },
  { id: 'groom', name: 'Ласка', icon: '♥', hint: 'мозг вожака' },
];

export const LAND_FOOD_KINDS = {
  fruit: { color: '#ffa45c', color2: '#ffe0a8', r: 5.0, value: 2.2, xp: 0.85, plant: true, name: 'сочный плод' },
  berry: { color: '#ff6f9e', color2: '#ffd3e4', r: 3.6, value: 1.5, xp: 0.55, plant: true, name: 'ягоды' },
  nut: { color: '#d8a95a', color2: '#ffeaba', r: 3.8, value: 1.1, xp: 0.5, plant: true, name: 'орех' },
  meat: { color: '#ff8b7a', color2: '#ffd0c6', r: 5.2, value: 2.8, xp: 1.3, name: 'кусок мяса' },
  egg: { color: '#fff0c2', color2: '#ffffff', r: 5.6, value: 3.6, xp: 1.9, name: 'яйцо кладки' },
  bone: { color: '#e6eef2', color2: '#ffffff', r: 5.4, value: 0.8, xp: 3.2, dna: 22, name: 'древняя кость' },
};

// Шаблон вида:
//   ai           — роль в landai.js
//   weight       — вероятность встречи в биоме (0 — не встречается)
//   social.likes — какие действия поднимают симпатию (остальные — слабее)
//   social.hates — действие, которое вид не выносит
//   nature       — характер: shy (пугливый), bold (дерзкий), proud (гордый), playful (игривый)
//   tame         — сколько симпатии нужно для союза
export const LAND_SPECIES = [
  // ------------------------------ Прибрежье
  {
    id: 'krab', name: 'Панцирный краб', icon: '🦀', family: LAND_FAMILY.SPECIAL, ai: LAND_AI.SCAVENGE,
    tierMin: 1, tierMax: 4, hpMul: 1.25, dmgMul: 0.9, speedMul: 0.72, sizeMul: 0.9,
    weight: { shore: 3.2, plain: 0.5, forest: 0.2, rock: 0.6 },
    plan: 'crab', features: ['armor', 'claws', 'eyes'], colors: ['#ff8f6b', '#ffd2a8'],
    diet: 'omni', social: { likes: ['groom', 'pose'], hates: 'dance' }, nature: 'proud', tame: 55,
    lore: 'Первый сосед, который научил берег не бояться суши. Панцирь крепкий, но под ним — трус.',
    habitat: 'Копается в песке у самой кромки воды, тащит в нору всё блестящее.',
  },
  {
    id: 'gull', name: 'Трясогузка', icon: '🐦', family: LAND_FAMILY.SPECIAL, ai: LAND_AI.FLOCK,
    tierMin: 2, tierMax: 6, hpMul: 0.7, dmgMul: 0.7, speedMul: 1.35, sizeMul: 0.7,
    weight: { shore: 3.6, plain: 1.2, forest: 0.8, rock: 0.4 },
    plan: 'bird', features: ['plumes', 'beak', 'wings'], colors: ['#e8f4ff', '#8fd0ff'],
    diet: 'omni', social: { likes: ['dance', 'sing'], hates: 'pose' }, nature: 'playful', tame: 45,
    lore: 'Стая дерзких плясунов. Трясогузки первыми поднимают крик, когда в траве идёт хищник.',
    habitat: 'Кружит над берегом и лугами, садится на спины крупных травоядных.',
  },
  {
    id: 'ilomer', name: 'Иломер', icon: '🐊', family: LAND_FAMILY.GRAZER, ai: LAND_AI.GRAZE,
    tierMin: 3, tierMax: 9, hpMul: 1.4, dmgMul: 1.0, speedMul: 0.78, sizeMul: 1.15,
    weight: { shore: 3.0, plain: 1.4, forest: 0.6, rock: 0 },
    plan: 'serpent', features: ['gullet', 'legs', 'hide'], colors: ['#7fd6a8', '#d6ffe4'],
    diet: 'herb', social: { likes: ['sing', 'groom'], hates: 'dance' }, nature: 'shy', tame: 60,
    lore: 'Медленный чистильщик воды: фильтрует ил и почти не обращает внимания на суету.',
    habitat: 'Лежит в тёплой воде, выставив спину под солнце.',
  },
  {
    id: 'runner', name: 'Соляной бегун', icon: '🦌', family: LAND_FAMILY.HERD, ai: LAND_AI.GRAZE,
    tierMin: 2, tierMax: 8, hpMul: 1.0, dmgMul: 0.85, speedMul: 1.28, sizeMul: 0.95,
    weight: { shore: 2.6, plain: 2.4, forest: 0.4, rock: 0.4 },
    plan: 'quadruped', features: ['legs', 'tail'], colors: ['#e7c98f', '#fff3d6'],
    diet: 'herb', social: { likes: ['dance', 'pose'], hates: 'sing' }, nature: 'shy', tame: 50, packSize: 4,
    lore: 'Стадо бежит раньше, чем ты успеешь дохнуть. Но любопытство сильнее страха.',
    habitat: 'Ходит вдоль линии прибоя, копает песок в поисках соли.',
  },

  // ------------------------------ Луга
  {
    id: 'hoof', name: 'Копытень', icon: '🐃', family: LAND_FAMILY.HERD, ai: LAND_AI.GRAZE,
    tierMin: 3, tierMax: 10, hpMul: 1.6, dmgMul: 1.05, speedMul: 0.95, sizeMul: 1.35,
    weight: { shore: 0.6, plain: 3.6, forest: 1.0, rock: 0.2 },
    plan: 'quadruped', features: ['horns', 'gullet', 'legs', 'hide'], colors: ['#c79a63', '#ffe6c0'],
    diet: 'herb', social: { likes: ['sing', 'groom'], hates: 'pose' }, nature: 'shy', tame: 70, packSize: 5,
    lore: 'Основа всей суши: пока ходят копытни, хищникам есть кого есть, а тебе — с кем дружить.',
    habitat: 'Топчет тропы в высокой траве целыми стадами.',
  },
  {
    id: 'rogar', name: 'Рогач', icon: '🐏', family: LAND_FAMILY.HERD, ai: LAND_AI.GUARD,
    tierMin: 4, tierMax: 10, hpMul: 1.75, dmgMul: 1.5, speedMul: 0.9, sizeMul: 1.4,
    weight: { shore: 0.3, plain: 2.8, forest: 0.8, rock: 1.2 },
    plan: 'quadruped', features: ['horns', 'armor', 'legs'], colors: ['#9f8cff', '#e4ddff'],
    diet: 'herb', social: { likes: ['pose', 'sing'], hates: 'groom' }, nature: 'proud', tame: 85, packSize: 3,
    lore: 'Самец-стражник: пока стадо пасётся, он стоит на камне и смотрит. Бодает всё, что выше травы.',
    habitat: 'Стоит на возвышенности, при виде хищника бьёт копытом.',
  },
  {
    id: 'skakun', name: 'Скакун', icon: '🦗', family: LAND_FAMILY.SPECIAL, ai: LAND_AI.FLOCK,
    tierMin: 1, tierMax: 6, hpMul: 0.75, dmgMul: 0.8, speedMul: 1.45, sizeMul: 0.65,
    weight: { shore: 1.4, plain: 3.0, forest: 1.6, rock: 0.6 },
    plan: 'insect', features: ['legs', 'eyes', 'plumes'], colors: ['#b6ff8f', '#e8ffd0'],
    diet: 'herb', social: { likes: ['dance', 'groom'], hates: 'sing' }, nature: 'playful', tame: 40,
    lore: 'Прыгучий народец лугов. Скакуны любопытны и первые лезут знакомиться — если ты не гонишься за ними.',
    habitat: 'Скачет по траве, откладывает яйца в кустах.',
  },
  {
    id: 'meadow_hunter', name: 'Луговой хитрец', icon: '🐆', family: LAND_FAMILY.PREDATOR, ai: LAND_AI.AMBUSH,
    tierMin: 3, tierMax: 9, hpMul: 1.1, dmgMul: 1.35, speedMul: 1.18, sizeMul: 1.0,
    weight: { shore: 0.4, plain: 2.4, forest: 2.2, rock: 0.6 },
    plan: 'quadruped', features: ['fangs', 'claws', 'tail'], colors: ['#ffb36b', '#ffe6c2'],
    diet: 'carn', social: { likes: ['groom', 'pose'], hates: 'dance' }, nature: 'bold', tame: 95,
    lore: 'Терпеливый охотник: часами лежит в траве, а потом делает один точный бросок.',
    habitat: 'Засады у троп копытней и у водопоев.',
  },
  {
    id: 'mirror', name: 'Зеркальце', icon: '✦', family: LAND_FAMILY.SPECIAL, ai: LAND_AI.GRAZE,
    tierMin: 2, tierMax: 7, hpMul: 0.9, dmgMul: 0.6, speedMul: 1.05, sizeMul: 0.8,
    weight: { shore: 1.6, plain: 2.0, forest: 1.4, rock: 0.8 },
    plan: 'insect', features: ['wings', 'eyes', 'plumes'], colors: ['#a8e8ff', '#ffffff'],
    diet: 'omni', social: { likes: ['dance', 'sing'], hates: 'groom' }, nature: 'playful', tame: 38,
    lore: 'Крылья ловят солнце и разбрасывают блики. Стая зеркалец — знак, что рядом нет хищников.',
    habitat: 'Порхает над цветами, ночует в кустах.',
  },
  {
    id: 'hyena', name: 'Степная гиена', icon: '🐕', family: LAND_FAMILY.SCAVENGER, ai: LAND_AI.SCAVENGE,
    tierMin: 3, tierMax: 9, hpMul: 1.2, dmgMul: 1.2, speedMul: 1.12, sizeMul: 1.05,
    weight: { shore: 0.8, plain: 2.2, forest: 1.0, rock: 1.4 },
    plan: 'quadruped', features: ['fangs', 'mane', 'legs'], colors: ['#c9a86b', '#ffeccb'],
    diet: 'carn', social: { likes: ['groom', 'pose'], hates: 'dance' }, nature: 'bold', tame: 90, packSize: 3,
    lore: 'Идёт за чужой охотой: где падаль — там гиены. Дерзкие, но уважают силу.',
    habitat: 'Кружит у мест, где кто-то погиб.',
  },

  // ------------------------------ Лес
  {
    id: 'las', name: 'Лесной лаз', icon: '🐍', family: LAND_FAMILY.PREDATOR, ai: LAND_AI.AMBUSH,
    tierMin: 3, tierMax: 10, hpMul: 1.15, dmgMul: 1.6, speedMul: 1.0, sizeMul: 1.1,
    weight: { shore: 0.2, plain: 0.8, forest: 3.2, rock: 0.4 },
    plan: 'serpent', features: ['fangs', 'venom', 'eyes'], colors: ['#8fe08f', '#dfffd0'],
    diet: 'carn', social: { likes: ['groom'], hates: 'sing' }, nature: 'proud', tame: 100, venom: 3.2,
    lore: 'В зарослях не видно ни головы, ни хвоста — только две щели глаз. Ядовит с рождения.',
    habitat: 'Спит в папоротниках, бьёт на расстоянии броска.',
  },
  {
    id: 'beetle', name: 'Древокуз', icon: '🪲', family: LAND_FAMILY.SPECIAL, ai: LAND_AI.GUARD,
    tierMin: 2, tierMax: 8, hpMul: 1.9, dmgMul: 1.1, speedMul: 0.6, sizeMul: 0.95,
    weight: { shore: 0.4, plain: 1.0, forest: 3.0, rock: 0.6 },
    plan: 'crab', features: ['armor', 'horns', 'claws'], colors: ['#b08a5a', '#f0d8b0'],
    diet: 'herb', social: { likes: ['pose'], hates: 'groom' }, nature: 'proud', tame: 80,
    lore: 'Ходячий панцирь. Древокуз не убегает — он просто ждёт, пока ты устанешь его грызть.',
    habitat: 'Точит кору и умирающие стволы, охраняет свою корягу.',
  },
  {
    id: 'puffpaw', name: 'Пухолап', icon: '🐨', family: LAND_FAMILY.GRAZER, ai: LAND_AI.FLOCK,
    tierMin: 1, tierMax: 6, hpMul: 0.95, dmgMul: 0.7, speedMul: 0.95, sizeMul: 0.85,
    weight: { shore: 0.6, plain: 1.4, forest: 3.0, rock: 0.2 },
    plan: 'biped', features: ['gullet', 'plumes', 'legs'], colors: ['#c8b6ff', '#f0eaff'],
    diet: 'herb', social: { likes: ['dance', 'sing'], hates: 'pose' }, nature: 'playful', tame: 42, packSize: 3,
    lore: 'Плюшевая ветка эволюции: ест листья, спит на ветках, обожает музыку.',
    habitat: 'Живёт в кронах и кустах, спускается за плодами.',
  },
  {
    id: 'bonegnaw', name: 'Костогрыз', icon: '🦡', family: LAND_FAMILY.SCAVENGE || LAND_FAMILY.SCAVENGER, ai: LAND_AI.SCAVENGE,
    tierMin: 3, tierMax: 9, hpMul: 1.3, dmgMul: 1.35, speedMul: 1.05, sizeMul: 1.0,
    weight: { shore: 1.0, plain: 1.4, forest: 2.2, rock: 1.6 },
    plan: 'quadruped', features: ['jaws', 'claws', 'tail'], colors: ['#a8a08f', '#e8e2d4'],
    diet: 'omni', social: { likes: ['groom', 'pose'], hates: 'sing' }, nature: 'bold', tame: 88, packSize: 2,
    lore: 'Грызёт то, что осталось: кости, панцири, старые кладки. Злобен, но верен тому, кто его кормит.',
    habitat: 'Норы среди корней, чует падаль по запаху.',
  },
  {
    id: 'bloodtracker', name: 'Кровослед', icon: '🐺', family: LAND_FAMILY.PREDATOR, ai: LAND_AI.HUNT,
    tierMin: 4, tierMax: 10, hpMul: 1.35, dmgMul: 1.7, speedMul: 1.2, sizeMul: 1.15,
    weight: { shore: 0.2, plain: 1.6, forest: 2.4, rock: 1.0 },
    plan: 'quadruped', features: ['fangs', 'mane', 'claws'], colors: ['#ff8f8f', '#ffe0e0'],
    diet: 'carn', social: { likes: ['pose'], hates: 'groom' }, nature: 'bold', tame: 110, packSize: 2,
    lore: 'Идёт по следу крови, пока жертва не упадёт. Уважает только тех, кто больше его.',
    habitat: 'Патрулирует границы леса, выходит на охоту в сумерках.',
  },
  {
    id: 'singer', name: 'Зелёный певец', icon: '🦜', family: LAND_FAMILY.SPECIAL, ai: LAND_AI.FLOCK,
    tierMin: 2, tierMax: 8, hpMul: 0.85, dmgMul: 0.75, speedMul: 1.15, sizeMul: 0.9,
    weight: { shore: 0.8, plain: 1.6, forest: 2.6, rock: 0.4 },
    plan: 'bird', features: ['throat', 'plumes', 'beak'], colors: ['#8fffc4', '#e8fff4'],
    diet: 'omni', social: { likes: ['sing', 'dance'], hates: 'pose' }, nature: 'playful', tame: 32,
    lore: 'Лучший друг всякого, кто умеет слушать. Пению певцов учатся целые поколения.',
    habitat: 'Поёт на верхних ветках, слетается на любой громкий звук.',
  },

  // ------------------------------ Скалы
  {
    id: 'cliffram', name: 'Скальный таращ', icon: '🐐', family: LAND_FAMILY.HERD, ai: LAND_AI.GUARD,
    tierMin: 4, tierMax: 10, hpMul: 1.85, dmgMul: 1.6, speedMul: 1.0, sizeMul: 1.3,
    weight: { shore: 0.2, plain: 0.6, forest: 0.4, rock: 3.4 },
    plan: 'quadruped', features: ['horns', 'armor', 'legs'], colors: ['#c8d8e8', '#f4fbff'],
    diet: 'herb', social: { likes: ['pose', 'groom'], hates: 'dance' }, nature: 'proud', tame: 95, packSize: 3,
    lore: 'Стоит на самом краю обрыва, будто проверяет, кто осмелится подойти.',
    habitat: 'Каменные карнизы и гейзерные поля.',
  },
  {
    id: 'stonemaw', name: 'Каменный жор', icon: '🦖', family: LAND_FAMILY.SCAVENGER, ai: LAND_AI.SCAVENGE,
    tierMin: 5, tierMax: 10, hpMul: 1.7, dmgMul: 1.5, speedMul: 0.92, sizeMul: 1.25,
    weight: { shore: 0.4, plain: 1.0, forest: 0.8, rock: 2.8 },
    plan: 'serpent', features: ['jaws', 'armor', 'spikes'], colors: ['#a0a8b8', '#e0e6f0'],
    diet: 'omni', social: { likes: ['groom'], hates: 'sing' }, nature: 'bold', tame: 105,
    lore: 'Ест кости, камни и старые панцири. Кажется глупым, пока не откусит тебе хвост.',
    habitat: 'Греется у гейзеров, переваривая каменную крошку.',
  },
  {
    id: 'watcher', name: 'Вышка', icon: '🦅', family: LAND_FAMILY.SPECIAL, ai: LAND_AI.SCAVENGE,
    tierMin: 3, tierMax: 9, hpMul: 0.8, dmgMul: 1.1, speedMul: 1.4, sizeMul: 0.85,
    weight: { shore: 1.0, plain: 1.2, forest: 0.8, rock: 2.6 },
    plan: 'bird', features: ['wings', 'beak', 'eyes'], colors: ['#ffd9a0', '#fff4e0'],
    diet: 'carn', social: { likes: ['sing', 'pose'], hates: 'groom' }, nature: 'proud', tame: 70,
    lore: 'Кружит над скалами и первая видит, кто ослаб. С ней стоит дружить хотя бы ради сплетен.',
    habitat: 'Скалы, обрывы, верхние ветки — откуда видно всех.',
  },
  {
    id: 'nightshade', name: 'Ночная тень', icon: '🌑', family: LAND_FAMILY.PREDATOR, ai: LAND_AI.HUNT,
    tierMin: 4, tierMax: 10, hpMul: 1.2, dmgMul: 1.5, speedMul: 1.14, sizeMul: 1.05,
    weight: { shore: 0.6, plain: 1.0, forest: 2.0, rock: 2.0 },
    plan: 'quadruped', features: ['fangs', 'claws', 'eyes'], colors: ['#5b5f8a', '#cfd4ff'],
    diet: 'carn', social: { likes: [], hates: 'groom' }, nature: 'bold', tame: 999,
    nocturnal: true, hostile: true,
    lore: 'Днём её не существует: только следы. Ночью тень приходит за тем, кто забыл про костёр.',
    habitat: 'Охотится в темноте, днём спит в норах.',
  },
  {
    id: 'tyrant', name: 'Ящер-владыка', icon: '☠', family: LAND_FAMILY.APEX, ai: LAND_AI.APEX,
    tierMin: 8, tierMax: 10, hpMul: 6.5, dmgMul: 2.4, speedMul: 1.05, sizeMul: 1.9,
    weight: { shore: 0, plain: 0, forest: 0, rock: 0 },
    plan: 'serpent', features: ['horns', 'armor', 'fangs', 'spikes', 'frill'], colors: ['#ff7f5c', '#ffe0c0'],
    diet: 'carn', social: { likes: [], hates: 'groom' }, nature: 'proud', tame: 999, hostile: true,
    boss: true, arena: 'rock',
    lore: 'Хозяин костяного трона. Он ест своих сородичей, потому и вырос таким. Договориться с ним нельзя.',
    habitat: 'Костяной трон в скалах: место, где сходятся все тропы.',
  },
];

export const LAND_SPECIES_BY_ID = Object.fromEntries(LAND_SPECIES.map((s) => [s.id, s]));

export function landBiomeOf(x, y, worldRadius) {
  const d = Math.sqrt(x * x + y * y) / worldRadius;
  if (d < 0.26) return 'shore';
  if (d < 0.56) return 'plain';
  if (d < 0.8) return 'forest';
  return 'rock';
}

export const LAND_BIOME_BY_ID = Object.fromEntries(LAND_BIOMES.map((b) => [b.id, b]));

// Подбор вида для спавна: биом, уровень угрозы, ночь и агрессивность сложности.
export function pickLandSpecies(rng, biome, tier, aggressiveBias = 1, night = false) {
  const entries = [];
  for (const s of LAND_SPECIES) {
    if (s.boss || s.hostile) continue;
    if (s.nocturnal) continue;                      // ночных спавним отдельным правилом
    if (tier < s.tierMin - 1 || tier > s.tierMax + 2) continue;
    let w = s.weight[biome] ?? 0;
    if (w <= 0) continue;
    if (s.family === LAND_FAMILY.PREDATOR) w *= aggressiveBias;
    if (s.family === LAND_FAMILY.GRAZER || s.family === LAND_FAMILY.HERD) w *= 1 / aggressiveBias;
    entries.push([s, w]);
  }
  if (!entries.length) return LAND_SPECIES_BY_ID.skakun;
  return rng.weighted(entries);
}

export function rollLandTier(rng, threat, variance = 2, surgeChance = 0.06) {
  let t = threat + Math.round(rng.range(-variance, variance));
  if (rng.chance(surgeChance)) t += Math.round(rng.range(2, 4));
  return Math.max(1, Math.min(10, t));
}

// Сколько симпатии даёт одно удачное действие: любимое — вдвое.
export function socialScore(sp, action, stats) {
  const liked = sp.social.likes.includes(action);
  const hated = sp.social.hates === action;
  const skill = 1 + 0.35 * ({ sing: stats.singSkill, dance: stats.danceSkill, pose: stats.poseSkill, groom: stats.charmSkill }[action] ?? 0);
  let mul = liked ? 1.6 : 0.7;
  if (hated) mul = -0.6;
  return (7 * mul * skill) * (1 + (stats.socialGain ?? 0));
}

export function socialLiked(sp, action) { return sp.social.likes.includes(action); }
