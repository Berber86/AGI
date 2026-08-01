/*************************************************************************
 * LEVEL 4/10 DATA MODULE
 * Contains Ages, Units, Commanders, Formations, Counter Table, and Waves
 *************************************************************************/

const AGES = [
    { id: 1, name: "I. Каменный век", cost: 10, limit: 4, desc: "Охотничьи племена и первые инструменты войны." },
    { id: 2, name: "II. Бронзовый век", cost: 18, limit: 5, desc: "Металлургия, щиты и боевые колесницы." },
    { id: 3, name: "III. Средневековье", cost: 28, limit: 6, desc: "Тяжёлые рыцарские доспехи и пробивные арбалеты." },
    { id: 4, name: "IV. Эпоха пороха", cost: 40, limit: 7, desc: "Огнестрельное оружие, линейный строй и полевые пушки." },
    { id: 5, name: "V. Современность", cost: 55, limit: 8, desc: "Снайперы, штурмовая пехота и бронетехника." },
    { id: 6, name: "VI. Будущее", cost: null, limit: 9, desc: "Рельсотроны, экзоскелеты и автономные дроны." }
];

const COMMANDERS_DATA = {
    tribal_chief: { id: "tribal_chief", name: "Вождь племени", age: 1, icon: "🪶", desc: "Аура Боевого Клича: +10% скорость атаки всей армии." },
    centurion:    { id: "centurion",    name: "Центурион",     age: 2, icon: "🛡️", desc: "Аура Фаланги: +15% броня и HP бойцам ближнего боя." },
    general_musk: { id: "general_musk", name: "Генерал",       age: 4, icon: "🎩", desc: "Аура Залпа: +15% к урону стрелков и артиллерии." },
    cyber_marshal:{ id: "cyber_marshal",name: "Кибер-Маршал",  age: 6, icon: "🤖", desc: "Глобальная Нейросеть: +15% к урону, HP и скорости атаки." }
};

const FORMATIONS_DATA = {
    standard:  { id: "standard",  name: "Стандартный строй", icon: "⚔️", desc: "Сбалансированное построение без штрафов и бонусов." },
    shield_wall:{ id: "shield_wall",name: "Стена щитов",     icon: "🛡️", desc: "+15% HP всей армии, но скорость движения снижена на 10%." },
    flanking:  { id: "flanking",  name: "Фланговый охват",   icon: "🐎", desc: "+15% к скорости атаки войскам на крайних линиях (ряды 0 и 5)." },
    artillery: { id: "artillery", name: "Огневой вал",       icon: "💣", desc: "+15% к дальности и урону войскам в тыловой колонке (колонка 0)." }
};

const UNITS_DATA = {
    // Age 1
    spearman: { id: "spearman", name: "Копьеносец", age: 1, cost: 3, armor: "mobile", attack: "anti_mobile", hp: 220, dmg: 28, range: 1, speed: 1.0, icon: "🗡️", desc: "Универсальный боец с копьём. Силен против конницы." },
    clubman:  { id: "clubman",  name: "Дубинщик",   age: 1, cost: 3, armor: "heavy",  attack: "melee",       hp: 320, dmg: 24, range: 1, speed: 0.9, icon: "🔨", desc: "Выносливый боец ближнего боя. Крушит легкую пехоту." },
    slinger:  { id: "slinger",  name: "Пращник",    age: 1, cost: 3, armor: "light",  attack: "piercing",    hp: 150, dmg: 32, range: 3, speed: 1.1, icon: "🪨", desc: "Стрелок из пращи. Пробивает тяжелую броню камнями." },
    // Age 2
    hoplite:  { id: "hoplite",  name: "Гоплит",     age: 2, cost: 5, armor: "heavy",  attack: "piercing",    hp: 480, dmg: 38, range: 1, speed: 0.95,icon: "🛡️", desc: "Тяжелобронированный щитоносец фаланги." },
    archer:   { id: "archer",   name: "Лучник",     age: 2, cost: 5, armor: "light",  attack: "piercing",    hp: 210, dmg: 45, range: 4, speed: 1.2, icon: "🏹", desc: "Дальнобойный стрелок с высокой точностью." },
    chariot:  { id: "chariot",  name: "Колесница",  age: 2, cost: 5, armor: "mobile", attack: "anti_mobile", hp: 360, dmg: 42, range: 1, speed: 1.3, icon: "🐎", desc: "Быстрая колесница с копьями для фланговых атак." },
    // Age 3
    knight:   { id: "knight",   name: "Рыцарь",     age: 3, cost: 8, armor: "heavy",  attack: "melee",       hp: 750, dmg: 60, range: 1, speed: 0.9, icon: "👑", desc: "Элитный воин в стальных латах." },
    crossbow: { id: "crossbow", name: "Арбалетчик", age: 3, cost: 8, armor: "light",  attack: "piercing",    hp: 320, dmg: 72, range: 4, speed: 1.0, icon: "🎯", desc: "Мощные арбалетные болты пробивают любую броню." },
    cavalry:  { id: "cavalry",  name: "Кавалерия",  age: 3, cost: 8, armor: "mobile", attack: "anti_mobile", hp: 580, dmg: 65, range: 1, speed: 1.4, icon: "🏇", desc: "Тяжёлая конница для прорыва рядов противника." },
    // Age 4
    line_inf: { id: "line_inf", name: "Пехотинец",  age: 4, cost: 12, armor: "mobile", attack: "piercing",   hp: 680, dmg: 85, range: 3, speed: 1.1, icon: "💂", desc: "Линейная пехота с кремневыми ружьями." },
    musket:   { id: "musket",   name: "Мушкетёр",   age: 4, cost: 12, armor: "light",  attack: "anti_mobile",hp: 480, dmg: 110,range: 4, speed: 0.95,icon: "🔫", desc: "Тяжелый мушкет с огромной останавливающей силой." },
    cannon:   { id: "cannon",   name: "Пушка",      age: 4, cost: 12, armor: "heavy",  attack: "siege",      hp: 620, dmg: 140,range: 5, speed: 0.7, icon: "💣", desc: "Полевая артиллерия. Наносит Splash-урон по площади!" },
    // Age 5
    assault:  { id: "assault",  name: "Штурмовик",  age: 5, cost: 18, armor: "light",  attack: "melee",       hp: 950, dmg: 130,range: 3, speed: 1.4, icon: "🪖", desc: "Штурмовая пехота с автоматическим оружием." },
    sniper:   { id: "sniper",   name: "Снайпер",    age: 5, cost: 18, armor: "light",  attack: "piercing",    hp: 650, dmg: 220,range: 6, speed: 0.8, icon: "🔭", desc: "Снайпер дальнего действия с пробивными пулями." },
    tank:     { id: "tank",     name: "Танк",       age: 5, cost: 18, armor: "heavy",  attack: "siege",      hp: 1600,dmg: 180,range: 4, speed: 1.0, icon: "🚜", desc: "Основной боевой танк. Мощная броня и пушка." },
    // Age 6
    exo:      { id: "exo",      name: "Экзоскелет", age: 6, cost: 25, armor: "heavy",  attack: "piercing",    hp: 2200,dmg: 260,range: 3, speed: 1.5, icon: "🤖", desc: "Пехотинец будущего в бронированном экзоскелете." },
    railgun:  { id: "railgun",  name: "Рельсотрон", age: 6, cost: 25, armor: "heavy",  attack: "siege",      hp: 3100,dmg: 380,range: 6, speed: 0.9, icon: "⚡", desc: "Электромагнитная пушка с катастрофическим Splash-уроном." },
    drone:    { id: "drone",    name: "Дрон",       age: 6, cost: 25, armor: "mobile", attack: "anti_mobile",hp: 1700,dmg: 290,range: 4, speed: 1.8, icon: "🛸", desc: "Автономный летающий ударный дрон с лазерами." },
    // Special Boss
    boss_mech:{ id: "boss_mech",name: "Титан-Босс", age: 6, cost: 50, armor: "heavy",  attack: "siege",      hp: 6500,dmg: 450,range: 5, speed: 1.0, icon: "🐲", desc: "Верховный Командующий — босс кампании 4/10!" }
};

const COUNTER_TABLE = {
    melee:       { light: 1.5, heavy: 0.75, mobile: 1.0 },
    piercing:    { light: 1.0, heavy: 1.5,  mobile: 0.75 },
    anti_mobile: { light: 0.75, heavy: 1.0,  mobile: 1.5 },
    siege:       { light: 1.25, heavy: 1.25, mobile: 1.25 }
};

const WAVES = [
    { num: 1,  reward: 6,  enemies: [ {type: "spearman", x: 5, y: 1}, {type: "clubman", x: 6, y: 2}, {type: "clubman", x: 5, y: 4} ] },
    { num: 2,  reward: 7,  enemies: [ {type: "clubman", x: 5, y: 1}, {type: "clubman", x: 5, y: 4}, {type: "slinger", x: 6, y: 2}, {type: "slinger", x: 6, y: 3} ] },
    { num: 3,  reward: 8,  enemies: [ {type: "hoplite", x: 5, y: 2}, {type: "hoplite", x: 5, y: 3}, {type: "archer", x: 7, y: 1}, {type: "archer", x: 7, y: 4} ] },
    { num: 4,  reward: 9,  enemies: [ {type: "chariot", x: 4, y: 1}, {type: "chariot", x: 4, y: 4}, {type: "hoplite", x: 5, y: 2}, {type: "archer", x: 6, y: 3} ] },
    { num: 5,  reward: 10, enemies: [ {type: "knight", x: 5, y: 2}, {type: "knight", x: 5, y: 3}, {type: "crossbow", x: 7, y: 1}, {type: "crossbow", x: 7, y: 4} ] },
    { num: 6,  reward: 11, enemies: [ {type: "cavalry", x: 4, y: 0}, {type: "cavalry", x: 4, y: 5}, {type: "knight", x: 5, y: 2}, {type: "crossbow", x: 6, y: 3} ] },
    { num: 7,  reward: 12, enemies: [ {type: "line_inf", x: 5, y: 1}, {type: "line_inf", x: 5, y: 4}, {type: "musket", x: 6, y: 2}, {type: "cannon", x: 7, y: 3} ] },
    { num: 8,  reward: 14, enemies: [ {type: "cannon", x: 7, y: 1}, {type: "cannon", x: 7, y: 4}, {type: "musket", x: 6, y: 2}, {type: "musket", x: 6, y: 3}, {type: "line_inf", x: 5, y: 2} ] },
    { num: 9,  reward: 16, enemies: [ {type: "assault", x: 5, y: 1}, {type: "assault", x: 5, y: 3}, {type: "assault", x: 5, y: 4}, {type: "sniper", x: 7, y: 2}, {type: "tank", x: 6, y: 2} ] },
    { num: 10, reward: 18, enemies: [ {type: "tank", x: 5, y: 1}, {type: "tank", x: 5, y: 4}, {type: "sniper", x: 7, y: 1}, {type: "sniper", x: 7, y: 4}, {type: "assault", x: 6, y: 2} ] },
    { num: 11, reward: 20, enemies: [ {type: "exo", x: 5, y: 1}, {type: "exo", x: 5, y: 4}, {type: "drone", x: 4, y: 0}, {type: "drone", x: 4, y: 5}, {type: "railgun", x: 7, y: 2} ] },
    { num: 12, reward: 30, enemies: [ {type: "boss_mech", x: 6, y: 2, star: 2}, {type: "railgun", x: 7, y: 1}, {type: "railgun", x: 7, y: 4}, {type: "exo", x: 5, y: 2}, {type: "exo", x: 5, y: 3} ] }
];
