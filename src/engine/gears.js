// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — gears.js
//  Фундамент генерации карт: типы шестерёнок, ключевые свойства (в духе MTG)
//  и матрица совместимости «шестерня + шестерня → свойство».
//
//  Карт в игре нет заранее. Юнит собирается из научных открытий, каждое открытие
//  несёт 1–3 шестерни. Все ПАРЫ шестерён внутри юнита образуют свойства.
//  Чем реже карта (больше слотов) — тем больше свойств она вмещает.
// =============================================================================

// -----------------------------------------------------------------------------
//  Шестерни (аналог «цветов маны» MTG, но это типы знания)
// -----------------------------------------------------------------------------
export const GEARS = {
  mech:     { id: 'mech',     name: 'Механика', short: 'МЕХ', color: '#8fa6bd', letter: 'М' },
  fire:     { id: 'fire',     name: 'Горение',  short: 'ОГН', color: '#e0603a', letter: 'О' },
  alloy:    { id: 'alloy',    name: 'Сплав',    short: 'СПЛ', color: '#c1a067', letter: 'С' },
  doctrine: { id: 'doctrine', name: 'Доктрина', short: 'ДОК', color: '#d9d2c0', letter: 'Д' },
  optics:   { id: 'optics',   name: 'Оптика',   short: 'ОПТ', color: '#6fb3d9', letter: 'П' },
  bio:      { id: 'bio',      name: 'Биология', short: 'БИО', color: '#6fae5f', letter: 'Б' },
  volt:     { id: 'volt',     name: 'Ток',      short: 'ЭЛЕ', color: '#e8c14a', letter: 'Э' },
  chem:     { id: 'chem',     name: 'Химия',    short: 'ХИМ', color: '#a56fd9', letter: 'Х' },
  cipher:   { id: 'cipher',   name: 'Шифр',     short: 'ШИФ', color: '#5fd9c9', letter: 'Ш' },
  psyche:   { id: 'psyche',   name: 'Психея',   short: 'ПСИ', color: '#d96fa8', letter: 'Я' },
};

export const GEAR_IDS = Object.keys(GEARS);

// -----------------------------------------------------------------------------
//  Домены знания — «пирог цветов» MTG. Каждый домен тяготеет к своим шестерням.
// -----------------------------------------------------------------------------
export const DOMAINS = {
  war:       { id: 'war',       name: 'Война',    glyph: '⚔', color: '#c8452f', gears: ['fire', 'alloy', 'mech', 'psyche'],
               atk: 1.18, hp: 0.86, archetype: 'Ударный' },
  order:     { id: 'order',     name: 'Порядок',  glyph: '⚖', color: '#d8cfa8', gears: ['doctrine', 'cipher', 'alloy', 'psyche'],
               atk: 0.90, hp: 1.18, archetype: 'Строй' },
  knowledge: { id: 'knowledge', name: 'Знание',   glyph: '🜁', color: '#4d8fc4', gears: ['optics', 'cipher', 'chem', 'volt'],
               atk: 0.86, hp: 1.00, archetype: 'Осадный' },
  life:      { id: 'life',      name: 'Жизнь',    glyph: '☘', color: '#5c9e4f', gears: ['bio', 'psyche', 'chem', 'doctrine'],
               atk: 0.88, hp: 1.24, archetype: 'Живучий' },
  craft:     { id: 'craft',     name: 'Ремесло',  glyph: '⚙', color: '#9aa7b4', gears: ['mech', 'alloy', 'volt', 'optics'],
               atk: 1.00, hp: 1.12, archetype: 'Машина' },
};

export const DOMAIN_IDS = Object.keys(DOMAINS);

// -----------------------------------------------------------------------------
//  Ключевые свойства. `fx` — обработчик в боевом движке, `value` — вес для цены.
//  `priority` решает, какие свойства попадут на карту, если их больше, чем слотов.
// -----------------------------------------------------------------------------
export const KEYWORDS = {
  // --- постоянные / боевые модификаторы ---
  haste:         { name: 'Рывок',            fx: 'haste',         value: 2.0, priority: 7,
                   text: 'Может атаковать в тот же ход, когда выставлен.' },
  vigilance:     { name: 'Бдительность',     fx: 'vigilance',     value: 1.8, priority: 5,
                   text: 'Не истощается после атаки: может и бить, и держать строй.' },
  armor:         { name: 'Броня',            fx: 'armor',         value: 2.2, priority: 6, param: 1,
                   text: 'Получаемый урон снижается на N за каждое событие урона.' },
  pierce:        { name: 'Пробитие',         fx: 'pierce',        value: 2.0, priority: 6,
                   text: 'Урон игнорирует Броню цели.' },
  firstStrike:   { name: 'Первый удар',      fx: 'firstStrike',   value: 2.4, priority: 8,
                   text: 'Наносит урон до юнитов без Первого удара.' },
  doubleStrike:  { name: 'Двойной удар',     fx: 'doubleStrike',  value: 4.2, priority: 9,
                   text: 'Бьёт и в фазу Первого удара, и в обычную фазу.' },
  trample:       { name: 'Топот',            fx: 'trample',       value: 2.2, priority: 6,
                   text: 'Избыточный урон проходит сквозь блокеров в лидера.' },
  lifelink:      { name: 'Жизнеотдача',      fx: 'lifelink',      value: 2.0, priority: 5,
                   text: 'Нанесённый урон лечит вашего лидера.' },
  deathtouch:    { name: 'Смертельный удар', fx: 'deathtouch',    value: 3.6, priority: 8,
                   text: 'Любое количество урона уничтожает цель.' },
  siege:         { name: 'Осадный',          fx: 'siege',         value: 2.8, priority: 7,
                   text: 'Может быть заблокирован только юнитами с Захватом.' },
  reach:         { name: 'Захват',           fx: 'reach',         value: 1.6, priority: 4,
                   text: 'Может блокировать Осадных юнитов.' },
  thorns:        { name: 'Шипы',             fx: 'thorns',        value: 2.0, priority: 5, param: 1,
                   text: 'Получив боевой урон, возвращает N урона обидчику.' },
  indestructible:{ name: 'Несокрушимость',   fx: 'indestructible',value: 4.5, priority: 9,
                   text: 'Не уничтожается уроном.' },
  shroud:        { name: 'Помехи',           fx: 'shroud',        value: 1.6, priority: 4,
                   text: 'Не может быть целью эффектов.' },
  tactician:     { name: 'Стратег',          fx: 'tactician',     value: 2.4, priority: 6,
                   text: 'Может блокировать двух атакующих одновременно.' },
  carapace:      { name: 'Хитин',            fx: 'statBoost',     value: 1.8, priority: 3, atk: 0, hp: 2,
                   text: '+0/+2 — панцирь нарастает слоями.' },
  temper:        { name: 'Закалка',          fx: 'statBoost',     value: 2.2, priority: 3, atk: 1, hp: 1,
                   text: '+1/+1 — металл отпущен в масле.' },
  resolve:       { name: 'Стойкость',        fx: 'resolve',       value: 2.4, priority: 6,
                   text: 'Пережив боевое столкновение, получает +1/+1 до конца боя.' },
  frenzy:        { name: 'Неистовство',      fx: 'frenzy',        value: 2.2, priority: 6,
                   text: '+1/+0 за каждого другого атакующего союзника.' },
  zeal:          { name: 'Фанатизм',         fx: 'zeal',          value: 2.0, priority: 5,
                   text: '+2/+0, пока здоровье вашего лидера ниже половины.' },
  overload:      { name: 'Перегрузка',       fx: 'overload',      value: 2.6, priority: 6, atk: 2, hp: 0,
                   text: '+2/+0, но после каждой своей атаки получает 1 урон.' },
  bulwark:       { name: 'Бастион',          fx: 'bulwark',       value: 2.2, priority: 5,
                   text: 'Соседние союзники получают +0/+1.' },
  bond:          { name: 'Связь',            fx: 'bond',          value: 2.4, priority: 6,
                   text: 'Все ваши прочие юниты получают +1/+0.' },
  terror:        { name: 'Ужас',             fx: 'terror',        value: 2.6, priority: 6,
                   text: 'Пока жив, вражеские юниты с атакой ≤ 1 не могут атаковать.' },
  growth:        { name: 'Рост',             fx: 'growth',        value: 2.6, priority: 6,
                   text: 'В начале вашего хода получает +1/+1.' },

  // --- при выходе на поле (ETB) ---
  fabricate:     { name: 'Сборка',           fx: 'etbDraw',       value: 1.8, priority: 4, param: 1,
                   text: 'При выходе: возьмите карту.' },
  scry:          { name: 'Провидение',       fx: 'etbScry',       value: 1.6, priority: 4, param: 1,
                   text: 'При выходе: посмотрите N верхних карт колоды, одну возьмите.' },
  calibrate:     { name: 'Калибровка',       fx: 'etbScry',       value: 2.0, priority: 5, param: 2,
                   text: 'При выходе: посмотрите 2 верхние карты, одну возьмите.' },
  compute:       { name: 'Вычисление',       fx: 'etbCompute',    value: 3.0, priority: 7,
                   text: 'При выходе: возьмите 2 карты, сбросьте одну.' },
  logistics:     { name: 'Логистика',        fx: 'etbEnergy',     value: 1.8, priority: 4, param: 1,
                   text: 'При выходе: +N энергии в этот ход.' },
  engineer:      { name: 'Инженер',          fx: 'etbDiscount',   value: 1.8, priority: 4, param: 1,
                   text: 'При выходе: следующий ваш юнит стоит на N меньше.' },
  tribute:       { name: 'Дань',             fx: 'etbDrain',      value: 1.8, priority: 4, param: 1,
                   text: 'При выходе: противник теряет N энергии.' },
  propaganda:    { name: 'Пропаганда',       fx: 'etbDiscard',    value: 2.0, priority: 5, param: 1,
                   text: 'При выходе: противник сбрасывает N случайную карту.' },
  blast:         { name: 'Взрыв',            fx: 'etbBlast',      value: 2.6, priority: 6, param: 2,
                   text: 'При выходе: N урона случайному вражескому юниту.' },
  awe:           { name: 'Трепет',           fx: 'etbExhaust',    value: 2.0, priority: 5,
                   text: 'При выходе: сильнейший вражеский юнит истощается.' },
  stun:          { name: 'Паралич',          fx: 'etbStun',       value: 3.0, priority: 7,
                   text: 'При выходе: все вражеские юниты с атакой ≤ 2 истощаются.' },
  broadcast:     { name: 'Вещание',          fx: 'etbBroadcast',  value: 3.0, priority: 7,
                   text: 'При выходе: все ваши юниты получают Рывок до конца хода.' },
  inspire:       { name: 'Вдохновение',      fx: 'etbInspire',    value: 3.4, priority: 8, param: 1,
                   text: 'При выходе: прочие союзники получают +N/+N до конца боя.' },
  adapt:         { name: 'Адаптация',        fx: 'etbAdapt',      value: 2.6, priority: 6,
                   text: 'При выходе: +1/+1 за каждый вражеский юнит на поле.' },
  divine:        { name: 'Божественность',   fx: 'etbDivine',     value: 3.2, priority: 7, param: 3,
                   text: 'При выходе: лидер лечится на N и получает Помехи до конца хода.' },
  fortify:       { name: 'Укрепление',       fx: 'etbFortify',    value: 2.0, priority: 5, param: 2,
                   text: 'При выходе: лидер получает N временной брони.' },
  refine:        { name: 'Очистка',          fx: 'etbRefine',     value: 2.2, priority: 5,
                   text: 'При выходе: все карты в вашей руке стоят на 1 меньше в этот ход.' },
  summon:        { name: 'Рой',              fx: 'etbSwarm',      value: 2.4, priority: 6,
                   text: 'При выходе: создаёт токен-ополченца 1/1.' },

  // --- при смерти ---
  chain:         { name: 'Разряд',           fx: 'deathZap',      value: 2.4, priority: 6, param: 2,
                   text: 'При гибели: N урона случайному вражескому юниту.' },
  wildfire:      { name: 'Пожар',            fx: 'deathWildfire', value: 3.2, priority: 7, param: 1,
                   text: 'При гибели: N урона всем вражеским юнитам.' },
  volatile:      { name: 'Нестабильность',   fx: 'deathVolatile', value: 3.0, priority: 7, param: 3,
                   text: 'При гибели: N урона лидеру противника и 1 урон вашему.' },
  emp:           { name: 'Импульс',          fx: 'deathEmp',      value: 3.0, priority: 7,
                   text: 'При гибели: все вражеские юниты истощаются.' },
  martyr:        { name: 'Мученик',          fx: 'deathMartyr',   value: 2.4, priority: 6,
                   text: 'При гибели: возьмите карту и +1 энергия в следующем ходу.' },
  recall:        { name: 'Отзыв',            fx: 'deathRecall',   value: 2.8, priority: 7,
                   text: 'При гибели: возвращается в руку вместо кладбища (один раз за бой).' },

  // --- боевые триггеры (при нанесении урона) ---
  ignite:        { name: 'Зажигание',        fx: 'ignite',        value: 2.2, priority: 5, param: 1,
                   text: 'Повреждённая цель горит: N урона в конце каждого хода.' },
  corrode:       { name: 'Коррозия',         fx: 'corrode',       value: 2.2, priority: 5, param: 1,
                   text: 'Повреждённая цель теряет N атаки до конца боя.' },
  poison:        { name: 'Отрава',           fx: 'poison',        value: 2.6, priority: 6, param: 1,
                   text: 'Повреждённая цель отравлена: N урона в конце каждого хода.' },

  // --- в конце хода ---
  uplink:        { name: 'Канал',            fx: 'endUplink',     value: 2.2, priority: 5,
                   text: 'В конце вашего хода: возьмите карту, если у вас ≥ 3 юнитов.' },
  farseer:       { name: 'Дальнозоркость',   fx: 'endDraw',       value: 2.4, priority: 6,
                   text: 'В конце вашего хода: возьмите карту.' },
  plague:        { name: 'Мор',              fx: 'endPlague',     value: 3.4, priority: 8, param: 1,
                   text: 'В конце вашего хода: все вражеские юниты получают N урона.' },

  // --- командование: очки, которыми оплачиваются атакующие и блокирующие ---
  // Эти свойства делают бюджет раунда осью борьбы: юнит со «Знаменем» становится
  // приоритетной целью, а не ещё одним телом на линии.
  banner:        { name: 'Знамя',    fx: 'banner', value: 3.0, priority: 7,
                   text: 'Пока этот юнит жив, ваш бюджет очков командования в этом раунде больше на 1.' },
  panic:         { name: 'Паника',   fx: 'panic',  value: 3.0, priority: 7,
                   text: 'Пока этот юнит жив, бюджет очков командования противника в этом раунде меньше на 1.' },
  staff:         { name: 'Штаб',     fx: 'staff',  value: 2.8, priority: 6,
                   text: 'Ваши юниты стоят на 1 очко командования дешевле (но не меньше 1).' },
  drill:         { name: 'Муштра',   fx: 'drill',  value: 3.2, priority: 7,
                   text: 'Блокирует двоих и не тратит на блок очки командования: выученный строй держит линию сам.' },

  // --- свойства от состава: врождённое свойство шестерни -------------------
  // Работают, даже когда шестерня на карте одна. Слабее парных (priority 2),
  // поэтому в авто-подборе уступают настоящим комбинациям, но гарантируют, что
  // карта из одного открытия не остаётся вовсе без свойств.
  soloMech:      { name: 'Отладка',   fx: 'statBoost', value: 1.0, priority: 2, atk: 0, hp: 1,
                   text: '+0/+1 — механизм выверен до последнего зуба.' },
  soloFire:      { name: 'Жар',       fx: 'statBoost', value: 1.0, priority: 2, atk: 1, hp: 0,
                   text: '+1/+0 — горение не гаснет, пока есть топливо.' },
  soloAlloy:     { name: 'Закал',     fx: 'armor',     value: 1.1, priority: 2, param: 1,
                   text: 'Получаемый урон снижается на 1: сам сплав держит удар.' },
  soloDoctrine:  { name: 'Догмат',    fx: 'statBoost', value: 1.0, priority: 2, atk: 0, hp: 1,
                   text: '+0/+1 — уверенность держит строй крепче брони.' },
  soloOptics:    { name: 'Дальнозор', fx: 'reach',     value: 1.1, priority: 2,
                   text: 'Может блокировать юнитов с Осадным: оптика видит дальше.' },
  soloBio:       { name: 'Живучесть', fx: 'lifelink',  value: 1.2, priority: 2,
                   text: 'Нанесённый урон лечит вашего лидера: живое тянется к жизни.' },
  soloVolt:      { name: 'Искра',     fx: 'haste',     value: 1.2, priority: 3,
                   text: 'Может атаковать в тот же ход, когда выставлен.' },
  soloChem:      { name: 'Едкость',   fx: 'statBoost', value: 1.0, priority: 2, atk: 1, hp: 0,
                   text: '+1/+0 — реактив разъедает всё, чего касается.' },
  soloCipher:    { name: 'Пробой',    fx: 'pierce',    value: 1.1, priority: 2,
                   text: 'Урон игнорирует Броню цели: шифр находит щель.' },
  soloPsyche:    { name: 'Воля',      fx: 'statBoost', value: 1.0, priority: 2, atk: 0, hp: 1,
                   text: '+0/+1 — психея не даёт корпусу сломаться.' },

  // --- свойства от состава: резонанс (шестерня встретилась 3+ раза) --------
  // Награда за связную сборку: чем больше одной шестерни, тем громче она звучит.
  resMech:       { name: 'Синхронизм', fx: 'vigilance', value: 2.4, priority: 5,
                   text: 'Не истощается после атаки: шестерни идут в такт.' },
  resFire:       { name: 'Пожар',      fx: 'statBoost', value: 2.8, priority: 5, atk: 3, hp: 0,
                   text: '+3/+0 — огонь разошёлся не на шутку.' },
  resAlloy:      { name: 'Монолит',    fx: 'statBoost', value: 2.8, priority: 5, atk: 0, hp: 3,
                   text: '+0/+3 — сплав лёг единым массивом.' },
  resDoctrine:   { name: 'Собор',      fx: 'statBoost', value: 2.8, priority: 5, atk: 1, hp: 2,
                   text: '+1/+2 — доктрина собрала вокруг себя остальных.' },
  resOptics:     { name: 'Фокус',      fx: 'statBoost', value: 2.8, priority: 5, atk: 2, hp: 1,
                   text: '+2/+1 — все линзы сведены в одну точку.' },
  resBio:        { name: 'Плодородие', fx: 'growth',    value: 2.6, priority: 5,
                   text: 'В начале вашего хода получает +1/+1: жизнь берёт своё.' },
  resVolt:       { name: 'Сверхток',   fx: 'statBoost', value: 2.8, priority: 5, atk: 2, hp: 1,
                   text: '+2/+1 — контур перегружен, но держит.' },
  resChem:       { name: 'Катализ',    fx: 'statBoost', value: 2.8, priority: 5, atk: 2, hp: 1,
                   text: '+2/+1 — реакция пошла быстрее, чем рассчитывали.' },
  resCipher:     { name: 'Алгоритм',   fx: 'statBoost', value: 2.8, priority: 5, atk: 1, hp: 2,
                   text: '+1/+2 — шифр сам достраивает недостающие звенья.' },
  resPsyche:     { name: 'Экстаз',     fx: 'zeal',      value: 2.6, priority: 5,
                   text: 'Рвётся в бой: психея перегорает и вспыхивает ярче.' },

  // --- свойства от состава: разлад (две шестерни не работают вместе) --------
  // Заменяют гармоничное парное свойство на двустороннее: химера получает
  // больше слотов, но худшие варианты — это настоящая цена смешения линий.
  riftCipherDoctrine: { name: 'Раскол',      fx: 'statBoost', value: 1.6, priority: 4, atk: 2, hp: -1,
                        text: '+2/−1 — расчёт не терпит веры, а вера не терпит расчёта.' },
  riftBioVolt:        { name: 'Отторжение',  fx: 'statBoost', value: 1.8, priority: 4, atk: 2, hp: -2,
                        text: '+2/−2 — живое не уживается с током.' },
  riftMechPsyche:     { name: 'Опустошение', fx: 'statBoost', value: 2.0, priority: 4, atk: 3, hp: -2,
                        text: '+3/−2 — механизм вытесняет душу.' },
  riftBioCipher:      { name: 'Подмена',     fx: 'statBoost', value: 1.6, priority: 4, atk: 2, hp: -1,
                        text: '+2/−1 — плоть переписана кодом.' },
};

// -----------------------------------------------------------------------------
//  Матрица совместимости шестерёнок: 55 пар → 55 свойств.
//  Ключ — отсортированные id через «+». lvl>1 означает усиленную версию.
// -----------------------------------------------------------------------------
export const GEAR_PAIRS = {
  'alloy+alloy':       { kw: 'indestructible' },
  'alloy+bio':         { kw: 'carapace' },
  'alloy+chem':        { kw: 'temper' },
  'alloy+cipher':      { kw: 'shroud' },
  'alloy+doctrine':    { kw: 'bulwark' },
  'alloy+fire':        { kw: 'ignite' },
  'alloy+mech':        { kw: 'armor', lvl: 1 },
  'alloy+optics':      { kw: 'pierce' },
  'alloy+psyche':      { kw: 'vigilance' },
  'alloy+volt':        { kw: 'thorns', lvl: 1 },

  'bio+bio':           { kw: 'growth' },
  'bio+chem':          { kw: 'poison', lvl: 1 },
  'bio+cipher':        { kw: 'adapt' },
  'bio+doctrine':      { kw: 'lifelink' },
  'bio+fire':          { kw: 'wildfire', lvl: 1 },
  'bio+mech':          { kw: 'recall' },
  'bio+optics':        { kw: 'deathtouch' },
  'bio+psyche':        { kw: 'summon' },
  'bio+volt':          { kw: 'regenerate' },

  'chem+chem':         { kw: 'volatile', lvl: 3 },
  'chem+cipher':       { kw: 'refine' },
  'chem+doctrine':     { kw: 'plague', lvl: 1 },
  'chem+fire':         { kw: 'blast', lvl: 2 },
  'chem+mech':         { kw: 'corrode', lvl: 1 },
  'chem+optics':       { kw: 'corrode', lvl: 1, alias: 'Кислота' },
  'chem+psyche':       { kw: 'frenzy' },
  'chem+volt':         { kw: 'emp' },

  'cipher+cipher':     { kw: 'compute' },
  'cipher+doctrine':   { kw: 'tribute', lvl: 1 },
  'cipher+fire':       { kw: 'calibrate' },
  'cipher+mech':       { kw: 'engineer', lvl: 1 },
  'cipher+optics':     { kw: 'scry', lvl: 2 },
  'cipher+psyche':     { kw: 'propaganda', lvl: 1 },
  'cipher+volt':       { kw: 'uplink' },

  'doctrine+doctrine': { kw: 'inspire', lvl: 1 },
  'doctrine+fire':     { kw: 'zeal' },
  'doctrine+mech':     { kw: 'logistics', lvl: 1 },
  'doctrine+optics':   { kw: 'tactician' },
  'doctrine+psyche':   { kw: 'martyr' },
  'doctrine+volt':     { kw: 'broadcast' },

  'fire+fire':         { kw: 'doubleStrike' },
  'fire+mech':         { kw: 'haste' },
  'fire+optics':       { kw: 'siege' },
  'fire+psyche':       { kw: 'trample' },
  'fire+volt':         { kw: 'overload' },

  'mech+mech':         { kw: 'fabricate' },
  'mech+optics':       { kw: 'firstStrike' },
  'mech+psyche':       { kw: 'fortify', lvl: 2 },
  'mech+volt':         { kw: 'chain', lvl: 2 },

  'optics+optics':     { kw: 'farseer' },
  'optics+psyche':     { kw: 'awe' },
  'optics+volt':       { kw: 'reach' },

  'psyche+psyche':     { kw: 'divine', lvl: 3 },
  'psyche+volt':       { kw: 'terror' },

  'volt+volt':         { kw: 'stun' },
};

// Регенерация объявлена отдельно (пара bio+volt) — добавляем в реестр.
KEYWORDS.regenerate = { name: 'Регенерация', fx: 'regenerate', value: 3.0, priority: 7,
  text: 'Один раз за бой: предотвращает гибель, снимает весь урон и истощает юнита.' };

export const pairKey = (a, b) => [a, b].sort().join('+');

/** Свойство, порождаемое парой шестерёнок. */
export function pairToKeyword(g1, g2) {
  const rec = GEAR_PAIRS[pairKey(g1, g2)];
  if (!rec) return null;
  const base = KEYWORDS[rec.kw];
  if (!base) return null;
  return {
    kw: rec.kw,
    name: rec.alias || base.name,
    fx: base.fx,
    text: base.text,
    lvl: rec.lvl ?? base.param ?? 1,
    priority: base.priority,
    value: base.value * (rec.lvl && rec.lvl > 1 ? 1 + 0.45 * (rec.lvl - 1) : 1),
    atk: base.atk || 0,
    hp: base.hp || 0,
    from: pairKey(g1, g2),
  };
}

// -----------------------------------------------------------------------------
//  Тройные комбинации шестерёнок.
//
//  Матрица из 55 пар занята полностью, поэтому два свойства — Стойкость и
//  Связь — были определены в KEYWORDS и честно реализованы в бою, но не
//  выдавались ни одной картой: недостижимая механика и мёртвый код.
//  Тройки закрывают этот пробел и заодно дают усиленные версии числовых
//  свойств — награду за карту с тремя разными шестернями, то есть за
//  редкость выше обычной.
//
//  Требование — три РАЗНЫЕ шестерни на карте. Усиление имеет смысл только для
//  свойств, где уровень числовой (armor, thorns, poison, scry): у bulwark,
//  resolve и bond движок проверяет наличие эффекта, а не его уровень.
// -----------------------------------------------------------------------------
export const GEAR_TRIPLES = {
  // недостижимые прежде свойства
  'alloy+bio+doctrine':     { kw: 'resolve', alias: 'Стойкость' },
  'cipher+doctrine+psyche': { kw: 'bond',    alias: 'Связь' },
  // усиленные версии пар (пара даёт lvl 1–2, тройка — lvl 3)
  'alloy+mech+volt':        { kw: 'armor',  lvl: 3 },
  'alloy+fire+volt':        { kw: 'thorns', lvl: 3 },
  'bio+chem+psyche':        { kw: 'poison', lvl: 3 },
  'cipher+optics+volt':     { kw: 'scry',   lvl: 3 },
  // командование — редкие и особые свойства, поэтому живут на тройках:
  // матрица из 55 пар занята полностью, и замена осиротила бы чужое свойство
  'alloy+doctrine+mech':    { kw: 'banner', alias: 'Знамя' },
  'doctrine+fire+psyche':   { kw: 'panic',  alias: 'Паника' },
  'cipher+doctrine+optics': { kw: 'staff',  alias: 'Штаб' },
  'mech+optics+volt':       { kw: 'drill',  alias: 'Муштра' },
};

// -----------------------------------------------------------------------------
//  Свойства от состава: врождённое свойство шестерни, резонанс и разлад.
//  Все три слоя переиспользуют существующие fx, поэтому боевой движок и таблица
//  предпочтений личностей покрывают их без правок.
// -----------------------------------------------------------------------------

/** Врождённое свойство шестерни: работает, даже когда шестерня на карте одна. */
export const GEAR_SOLO = {
  mech: 'soloMech', fire: 'soloFire', alloy: 'soloAlloy', doctrine: 'soloDoctrine',
  optics: 'soloOptics', bio: 'soloBio', volt: 'soloVolt', chem: 'soloChem',
  cipher: 'soloCipher', psyche: 'soloPsyche',
};

/** Сколько раз шестерня должна встретиться на карте, чтобы зазвучал резонанс. */
export const RESONANCE_MIN = 3;

/** Резонанс: награда за связную сборку из одной шестерни. */
export const GEAR_RESONANCE = {
  mech: 'resMech', fire: 'resFire', alloy: 'resAlloy', doctrine: 'resDoctrine',
  optics: 'resOptics', bio: 'resBio', volt: 'resVolt', chem: 'resChem',
  cipher: 'resCipher', psyche: 'resPsyche',
};

/**
 * Разлад: пары шестерёнок, которые не дают гармоничного свойства.
 * Парное свойство заменяется двусторонним — игрок сам решает в драфте,
 * брать ли размен «атака вместо корпуса».
 */
export const GEAR_CONFLICTS = {
  'cipher+doctrine': 'riftCipherDoctrine',
  'bio+volt':        'riftBioVolt',
  'mech+psyche':     'riftMechPsyche',
  'bio+cipher':      'riftBioCipher',
};

/** Общая форма записи свойства — та же, что возвращает pairToKeyword. */
function composeKeyword(id, from, extra = {}) {
  const base = KEYWORDS[id];
  if (!base) return null;
  return {
    kw: id,
    name: base.name,
    fx: base.fx,
    text: base.text,
    lvl: base.param ?? 1,
    priority: base.priority,
    value: base.value,
    atk: base.atk || 0,
    hp: base.hp || 0,
    from,
    ...extra,
  };
}

export function soloToKeyword(gear) {
  const id = GEAR_SOLO[gear];
  return id ? composeKeyword(id, gear, { solo: true }) : null;
}

export function resonanceToKeyword(gear) {
  const id = GEAR_RESONANCE[gear];
  return id ? composeKeyword(id, gear, { resonance: true }) : null;
}

export function conflictToKeyword(g1, g2) {
  const key = pairKey(g1, g2);
  const id = GEAR_CONFLICTS[key];
  return id ? composeKeyword(id, key, { conflict: true }) : null;
}

export const tripleKey = (a, b, c) => [a, b, c].sort().join('+');

/** Свойство, порождаемое тройкой шестерёнок. Форма совпадает с pairToKeyword. */
export function tripleToKeyword(g1, g2, g3) {
  const rec = GEAR_TRIPLES[tripleKey(g1, g2, g3)];
  if (!rec) return null;
  const base = KEYWORDS[rec.kw];
  if (!base) return null;
  const lvl = rec.lvl ?? base.param ?? 1;
  return {
    kw: rec.kw,
    name: rec.alias || base.name,
    fx: base.fx,
    text: base.text,
    lvl,
    // тройка встречается реже пары и требует больше шестерёнок — она ценнее
    priority: base.priority + 1,
    value: base.value * (lvl > 1 ? 1 + 0.45 * (lvl - 1) : 1) * 1.15,
    atk: base.atk || 0,
    hp: base.hp || 0,
    from: tripleKey(g1, g2, g3),
    triple: true,
  };
}

// -----------------------------------------------------------------------------
//  Редкость = число слотов под шестерни.
// -----------------------------------------------------------------------------
export const RARITIES = [
  null,
  { slots: 1, id: 'common',    name: 'Обычная',     kwCap: 1, color: '#b9b9b9', mult: 1.00 },
  { slots: 2, id: 'uncommon',  name: 'Необычная',   kwCap: 2, color: '#5fa8d3', mult: 1.12 },
  { slots: 3, id: 'rare',      name: 'Редкая',      kwCap: 3, color: '#c9a227', mult: 1.28 },
  { slots: 4, id: 'mythic',    name: 'Мифическая',  kwCap: 4, color: '#d1549b', mult: 1.50 },
];

export const rarityBySlots = (slots) => RARITIES[Math.max(1, Math.min(4, slots))];

// -----------------------------------------------------------------------------
//  Эпохи — растут и HP лидеров, и размер поля/колоды, и потолок энергии.
//  «Бои становятся длиннее и хитрее».
// -----------------------------------------------------------------------------
export const ERAS = [
  null,
  { id: 1, name: 'Древность',      leaderHp: 22, slots: 4, deckSize: 10, energyCap: 5,  draw: 1, handLimit: 5, startHand: 3, sciAdvance: 0,    mat: 1.0, cp: 3 },
  { id: 2, name: 'Античность',     leaderHp: 42, slots: 5, deckSize: 12, energyCap: 6,  draw: 1, handLimit: 6, startHand: 4, sciAdvance: 130,  mat: 1.2, cp: 4 },
  { id: 3, name: 'Средневековье',  leaderHp: 66, slots: 5, deckSize: 14, energyCap: 7,  draw: 1, handLimit: 6, startHand: 4, sciAdvance: 300,  mat: 1.45, cp: 4 },
  { id: 4, name: 'Порох',          leaderHp: 100, slots: 6, deckSize: 16, energyCap: 8,  draw: 1, handLimit: 7, startHand: 4, sciAdvance: 560,  mat: 1.75, cp: 5 },
  { id: 5, name: 'Индустрия',      leaderHp: 150, slots: 7, deckSize: 18, energyCap: 9,  draw: 2, handLimit: 7, startHand: 5, sciAdvance: 950,  mat: 2.1, cp: 6 },
  { id: 6, name: 'Атом',           leaderHp: 220, slots: 8, deckSize: 20, energyCap: 10, draw: 2, handLimit: 8, startHand: 5, sciAdvance: null, mat: 2.5, cp: 7 },
];

export const eraOf = (n) => ERAS[Math.max(1, Math.min(6, n))];
export const MAX_ERA = 6;

/** Базовые характеристики юнита по эпохе (до вклада открытий). */
export function eraBase(era) {
  return { atk: 0.6 + era * 0.55, hp: 1.2 + era * 0.75 };
}
