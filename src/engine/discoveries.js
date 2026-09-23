// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — discoveries.js
//  Дерево научных открытий. Юниты НЕ нарисованы заранее: они собираются
//  из этих открытий. Каждое открытие несёт 1–3 шестерни, вклад в атаку/здоровье
//  и слово для процедурного имени юнита.
// =============================================================================

// d(id, name, era, domain, gears, atk, hp, cost, prereq, noun, adj)
const D = (id, name, era, domain, gears, atk, hp, cost, prereq, noun, adj) => ({
  id, name, era, domain, gears, atk, hp, cost, prereq: prereq || [], noun, adj,
});

export const DISCOVERY_LIST = [
  // ---------------------------------------------------------------- ЭПОХА I
  D('fire_mastery', 'Покорение огня', 1, 'craft', ['fire'], 1, 1, 8, [], 'поджигатель', 'огненный'),
  D('stonework',    'Обработка камня', 1, 'craft', ['alloy'], 1, 2, 9, [], 'камнелом', 'каменный'),
  D('wheel',        'Колесо', 1, 'craft', ['mech'], 1, 1, 11, [], 'повозчик', 'колесничный'),
  D('pottery',      'Гончарный круг', 1, 'craft', ['mech', 'chem'], 0, 2, 10, ['wheel'], 'горшечник', 'керамический'),
  D('agriculture',  'Земледелие', 1, 'life', ['bio'], 0, 3, 10, [], 'земледелец', 'пшеничный'),
  D('herbs',        'Траволечение', 1, 'life', ['bio', 'chem'], 0, 2, 13, ['agriculture'], 'травник', 'целебный'),
  D('taming',       'Одомашнивание', 1, 'life', ['bio', 'psyche'], 1, 2, 14, ['agriculture'], 'зверолов', 'звериный'),
  D('writing',      'Письменность', 1, 'order', ['cipher'], 0, 2, 14, [], 'писец', 'глиняный'),
  D('chieftain',    'Вождество', 1, 'order', ['doctrine'], 1, 2, 12, [], 'дружинник', 'племенной'),
  D('ritual',       'Ритуал', 1, 'order', ['psyche', 'doctrine'], 1, 1, 15, ['chieftain'], 'шаман', 'обрядовый'),
  D('masonry',      'Каменная кладка', 1, 'order', ['alloy', 'mech'], 0, 4, 17, ['stonework', 'wheel'], 'стенобит', 'крепостной'),
  D('bronze',       'Бронза', 1, 'craft', ['alloy', 'fire'], 2, 1, 18, ['stonework', 'fire_mastery'], 'секирщик', 'бронзовый'),
  D('stars',        'Звездочётство', 1, 'knowledge', ['optics', 'cipher'], 0, 2, 16, ['writing'], 'звездочёт', 'небесный'),

  // ---------------------------------------------------------------- ЭПОХА II
  D('iron',         'Железо', 2, 'craft', ['alloy', 'fire'], 3, 2, 26, ['bronze'], 'железняк', 'железный'),
  D('phalanx',      'Фаланга', 2, 'war', ['doctrine', 'alloy'], 2, 4, 30, ['chieftain', 'iron'], 'фалангит', 'стройный'),
  D('cavalry',      'Верховая езда', 2, 'war', ['bio', 'doctrine'], 3, 2, 32, ['taming', 'phalanx'], 'всадник', 'конный'),
  D('ballista',     'Осадные машины', 2, 'war', ['mech', 'alloy'], 4, 1, 34, ['wheel', 'iron'], 'баллистарий', 'метательный'),
  D('mathematics',  'Математика', 2, 'knowledge', ['cipher'], 1, 2, 28, ['stars'], 'геометр', 'численный'),
  D('optics_lens',  'Шлифовка линз', 2, 'knowledge', ['optics'], 1, 1, 30, ['mathematics'], 'очесник', 'ясный'),
  D('cartography',  'Картография', 2, 'knowledge', ['optics', 'cipher'], 1, 3, 33, ['optics_lens'], 'землемер', 'путеводный'),
  D('medicine',     'Врачевание', 2, 'life', ['bio'], 1, 4, 31, ['herbs'], 'лекарь', 'гиппократов'),
  D('philosophy',   'Философия', 2, 'order', ['doctrine', 'psyche'], 1, 3, 30, ['writing'], 'софист', 'умозрительный'),
  D('law',          'Право и риторика', 2, 'order', ['doctrine', 'cipher'], 2, 3, 34, ['philosophy', 'mathematics'], 'легист', 'судебный'),
  D('coinage',      'Монета', 2, 'order', ['cipher', 'alloy'], 1, 2, 29, ['law', 'iron'], 'сборщик', 'чеканный'),
  D('hydraulics',   'Гидравлика', 2, 'craft', ['mech', 'chem'], 2, 3, 32, ['wheel', 'pottery'], 'водолей', 'водяной'),
  D('concrete',     'Римский бетон', 2, 'craft', ['chem', 'alloy'], 1, 5, 35, ['hydraulics', 'masonry'], 'цементатор', 'литой'),

  // ------------------------------------------------------------- ЭПОХА III
  D('steel',        'Булатная сталь', 3, 'craft', ['alloy', 'fire'], 4, 3, 48, ['iron'], 'булатчик', 'булатный'),
  D('plate_armor',  'Латный доспех', 3, 'war', ['alloy', 'mech'], 2, 6, 54, ['steel'], 'латник', 'латный'),
  D('longbow',      'Длинный лук', 3, 'war', ['mech', 'bio'], 4, 2, 50, ['ballista', 'cavalry'], 'лучник', 'дальнобойный'),
  D('gunpowder',    'Порох', 3, 'war', ['chem', 'fire'], 5, 1, 60, ['steel', 'concrete'], 'огнедей', 'пороховой'),
  D('greekfire',    'Греческий огонь', 3, 'war', ['chem', 'fire', 'mech'], 4, 2, 58, ['gunpowder'], 'сифононосец', 'горючий'),
  D('chivalry',     'Рыцарский орден', 3, 'order', ['doctrine', 'psyche', 'alloy'], 3, 5, 56, ['phalanx', 'steel'], 'рыцарь', 'орденский'),
  D('scriptorium',  'Скриптории', 3, 'order', ['cipher', 'doctrine'], 1, 4, 46, ['law'], 'переписчик', 'рукописный'),
  D('heraldry',     'Геральдика', 3, 'order', ['doctrine', 'cipher'], 2, 4, 47, ['scriptorium', 'coinage'], 'герольд', 'знамённый'),
  D('clockwork',    'Механические часы', 3, 'craft', ['mech', 'cipher'], 2, 3, 52, ['hydraulics', 'mathematics'], 'часовщик', 'заводной'),
  D('mill',         'Мельница', 3, 'craft', ['mech'], 2, 4, 45, ['clockwork'], 'мельник', 'жерновой'),
  D('alchemy',      'Алхимия', 3, 'knowledge', ['chem', 'psyche'], 3, 3, 55, ['medicine', 'optics_lens'], 'алхимик', 'ртутный'),
  D('eyeglasses',   'Очки', 3, 'knowledge', ['optics', 'alloy'], 2, 2, 49, ['optics_lens', 'steel'], 'подзорщик', 'увеличительный'),
  D('threefield',   'Трёхполье', 3, 'life', ['bio', 'mech'], 1, 5, 47, ['agriculture', 'mill'], 'пахарь', 'урожайный'),
  D('surgery',      'Цирюльная хирургия', 3, 'life', ['bio', 'alloy'], 3, 3, 53, ['medicine', 'steel'], 'цирюльник', 'кровоостанавливающий'),

  // ---------------------------------------------------------------- ЭПОХА IV
  D('printing',     'Печатный станок', 4, 'order', ['cipher', 'mech'], 2, 4, 82, ['scriptorium', 'clockwork'], 'печатник', 'типографский'),
  D('banking',      'Банковское дело', 4, 'order', ['cipher', 'doctrine'], 2, 5, 86, ['heraldry', 'coinage'], 'банкир', 'вексельный'),
  D('bastion',      'Бастионная фортификация', 4, 'order', ['alloy', 'cipher'], 2, 8, 92, ['concrete', 'eyeglasses'], 'инженер-крепостник', 'бастионный'),
  D('linear_tac',   'Линейная тактика', 4, 'war', ['doctrine', 'fire'], 5, 4, 88, ['chivalry', 'gunpowder'], 'линейщик', 'мушкетный'),
  D('musket',       'Мушкет', 4, 'war', ['fire', 'mech', 'alloy'], 6, 2, 90, ['linear_tac'], 'мушкетёр', 'кремнёвый'),
  D('cannons',      'Пушечное литьё', 4, 'war', ['alloy', 'fire', 'chem'], 7, 3, 98, ['musket', 'steel'], 'канонир', 'чугунный'),
  D('sailing',      'Океанский парусник', 4, 'war', ['mech', 'doctrine', 'optics'], 5, 5, 95, ['cartography', 'clockwork'], 'корсар', 'парусный'),
  D('anatomy',      'Анатомия', 4, 'life', ['bio', 'optics'], 3, 6, 84, ['surgery', 'eyeglasses'], 'анатом', 'вскрытый'),
  D('botany',       'Ботанические сады', 4, 'life', ['bio', 'chem'], 2, 7, 80, ['threefield', 'alchemy'], 'ботаник', 'травяной'),
  D('chemistry',    'Химия как наука', 4, 'knowledge', ['chem'], 4, 4, 90, ['alchemy'], 'химик', 'реактивный'),
  D('telescope',    'Телескоп', 4, 'knowledge', ['optics', 'mech'], 4, 3, 88, ['eyeglasses', 'clockwork'], 'астроном', 'подзорный'),
  D('microscope',   'Микроскоп', 4, 'knowledge', ['optics', 'bio'], 3, 4, 92, ['telescope', 'anatomy'], 'микроскопист', 'мельчайший'),
  D('scientific_method', 'Научный метод', 4, 'knowledge', ['cipher', 'doctrine'], 3, 5, 100, ['printing', 'chemistry'], 'натурфилософ', 'опытный'),
  D('automata',     'Автоматоны', 4, 'craft', ['mech', 'cipher', 'alloy'], 5, 5, 96, ['clockwork', 'steel'], 'автоматон', 'заводной'),

  // ----------------------------------------------------------------- ЭПОХА V
  D('steam',        'Паровая машина', 5, 'craft', ['fire', 'mech'], 6, 6, 138, ['automata', 'cannons'], 'паровик', 'паровой'),
  D('bessemer',     'Массовая сталь', 5, 'craft', ['alloy', 'fire'], 7, 5, 132, ['chemistry', 'cannons'], 'сталевар', 'бессемеровский'),
  D('railways',     'Железные дороги', 5, 'craft', ['mech', 'alloy'], 4, 7, 140, ['steam', 'bessemer'], 'путеец', 'рельсовый'),
  D('electricity',  'Генератор тока', 5, 'knowledge', ['volt'], 5, 4, 145, ['chemistry', 'telescope'], 'электротехник', 'вольтов'),
  D('telegraph',    'Телеграф', 5, 'knowledge', ['volt', 'cipher'], 4, 5, 142, ['electricity', 'scientific_method'], 'телеграфист', 'проволочный'),
  D('photography',  'Фотография', 5, 'knowledge', ['optics', 'chem'], 4, 4, 136, ['microscope', 'chemistry'], 'дагерротипист', 'светописный'),
  D('breechloader', 'Казнозарядная нарезка', 5, 'war', ['alloy', 'mech'], 8, 4, 150, ['bessemer', 'musket'], 'егерь', 'нарезной'),
  D('explosives',   'Взрывчатка', 5, 'war', ['chem', 'fire'], 9, 3, 156, ['chemistry', 'gunpowder'], 'подрывник', 'гремучий'),
  D('ironclad',     'Броненосец', 5, 'war', ['alloy', 'fire', 'mech'], 8, 8, 165, ['bessemer', 'sailing', 'steam'], 'броненосец', 'панцирный'),
  D('machinegun',   'Пулемёт', 5, 'war', ['mech', 'alloy', 'fire'], 9, 4, 160, ['breechloader', 'steam'], 'пулемётчик', 'скорострельный'),
  D('vaccines',     'Бактериология и вакцины', 5, 'life', ['bio', 'chem'], 3, 9, 144, ['microscope', 'botany'], 'эпидемиолог', 'привитый'),
  D('evolution',    'Теория эволюции', 5, 'life', ['bio', 'cipher'], 4, 7, 148, ['anatomy', 'scientific_method'], 'селекционер', 'дарвинов'),
  D('statistics',   'Статистика', 5, 'order', ['cipher', 'doctrine'], 4, 6, 140, ['banking', 'scientific_method'], 'статистик', 'переписной'),
  D('mass_media',   'Психология масс', 5, 'order', ['psyche', 'cipher'], 5, 5, 152, ['printing', 'statistics'], 'агитатор', 'тиражный'),
  D('combustion',   'Двигатель внутреннего сгорания', 5, 'craft', ['fire', 'mech', 'chem'], 7, 5, 158, ['steam', 'explosives'], 'моторист', 'бензиновый'),

  // ----------------------------------------------------------------- ЭПОХА VI
  D('radio',        'Радиосвязь', 6, 'knowledge', ['volt', 'cipher'], 5, 6, 225, ['telegraph', 'electricity'], 'радист', 'эфирный'),
  D('radar',        'Радар', 6, 'knowledge', ['volt', 'optics'], 6, 5, 235, ['radio', 'photography'], 'локаторщик', 'радиолокационный'),
  D('aerodynamics', 'Аэродинамика', 6, 'craft', ['mech', 'optics'], 7, 5, 240, ['combustion', 'photography'], 'авиатор', 'аэродинамический'),
  D('airforce',     'Боевая авиация', 6, 'war', ['mech', 'fire', 'optics'], 9, 5, 268, ['aerodynamics', 'machinegun'], 'ас', 'крылатый'),
  D('rocketry',     'Ракетостроение', 6, 'war', ['fire', 'mech', 'cipher'], 10, 4, 275, ['explosives', 'aerodynamics'], 'ракетчик', 'реактивный'),
  D('transistor',   'Полупроводники', 6, 'knowledge', ['volt', 'alloy'], 6, 6, 260, ['radio', 'bessemer'], 'монтажник', 'кристаллический'),
  D('computer',     'ЭВМ', 6, 'knowledge', ['cipher', 'volt'], 7, 7, 285, ['transistor', 'statistics'], 'вычислитель', 'машинный'),
  D('nuclear_phys', 'Ядерная физика', 6, 'knowledge', ['volt', 'chem'], 9, 5, 300, ['evolution', 'chemistry', 'transistor'], 'физик-ядерщик', 'изотопный'),
  D('reactor',      'Атомный реактор', 6, 'craft', ['volt', 'fire', 'mech'], 8, 9, 310, ['nuclear_phys', 'steam'], 'атомщик', 'реакторный'),
  D('genetics',     'Генетика', 6, 'life', ['bio', 'cipher', 'chem'], 6, 9, 290, ['evolution', 'vaccines'], 'генетик', 'хромосомный'),
  D('neuroscience', 'Нейронаука', 6, 'life', ['bio', 'psyche', 'volt'], 7, 7, 295, ['genetics', 'mass_media'], 'нейрохирург', 'синаптический'),
  D('antibiotics',  'Антибиотики', 6, 'life', ['bio', 'chem'], 4, 11, 270, ['vaccines', 'chemistry'], 'фармацевт', 'пенициллиновый'),
  D('internet',     'Сетевые протоколы', 6, 'order', ['cipher', 'volt', 'doctrine'], 6, 8, 300, ['computer', 'radio'], 'сетевик', 'протокольный'),
  D('robotics',     'Робототехника', 6, 'craft', ['mech', 'cipher', 'volt'], 9, 8, 320, ['computer', 'aerodynamics'], 'сервитор', 'сервоприводный'),
  D('machine_learning', 'Машинное обучение', 6, 'knowledge', ['cipher', 'volt', 'psyche'], 8, 8, 340, ['computer', 'neuroscience'], 'оракул', 'обученный'),
  D('propaganda_state', 'Тотальная мобилизация', 6, 'order', ['psyche', 'doctrine', 'cipher'], 8, 8, 280, ['mass_media', 'internet'], 'комиссар', 'мобилизационный'),
];

export const DISCOVERIES = Object.fromEntries(DISCOVERY_LIST.map((d) => [d.id, d]));
export const DISCOVERY_IDS = DISCOVERY_LIST.map((d) => d.id);

export const byEra = (era) => DISCOVERY_LIST.filter((d) => d.era === era);
export const byDomain = (dom) => DISCOVERY_LIST.filter((d) => d.domain === dom);

/** Все шестерни, которые игрок вообще может собрать (для подсказок). */
export function gearCoverage(ids) {
  const set = new Set();
  for (const id of ids) for (const g of (DISCOVERIES[id]?.gears || [])) set.add(g);
  return [...set];
}

/** Открытие доступно для изучения, если изучены все его предки. */
export function isAvailable(discId, researched) {
  const d = DISCOVERIES[discId];
  if (!d || researched.has(discId)) return false;
  return d.prereq.every((p) => researched.has(p));
}
