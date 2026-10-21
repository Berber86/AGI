// Эрмитаж · Парадный зал — данные зала, произведений и точек осмотра.
// Все размеры в метрах, углы в радианах. Y — вверх, камера смотрит в −Z при yaw = 0.

export const HALL = Object.freeze({
  width: 18,
  depth: 13,
  height: 7,
  eye: 1.65,
  ipd: 0.064,
  wallThickness: 0.5,
});

export const WALL = Object.freeze({
  zNorth: -HALL.depth / 2 + 0.02,
  zSouth: HALL.depth / 2 - 0.02,
  xWest: -HALL.width / 2 + 0.02,
  xEast: HALL.width / 2 - 0.02,
});

// Свет — тёплый вечер: окна на востоке, люстры, подсветка картин.
export const LIGHT = Object.freeze({
  sun: { color: 0xffe2bd, intensity: 4.4, position: [13.5, 11.5, 5.4] },
  sky: { color: 0xc6d6e6, ground: 0x4a392a, intensity: 1.55 },
  chandeliers: [
    { position: [0, 5.15, -2.2], color: 0xffd8a0, intensity: 42 },
    { position: [0, 5.15, 3.0], color: 0xffd3a0, intensity: 36 },
  ],
});

// Картины: подлинники из собрания Эрмитажа, изображения — общественное достояние.
// w/h — размер полотна в зале; frame — профиль рамы; wall задаёт ориентацию.
export const ARTWORKS = Object.freeze([
  {
    id: 'matisse',
    title: 'Танец',
    author: 'Анри Матисс',
    year: '1910',
    technique: 'Холст, масло. 260 × 391 см',
    room: 'Зал 1 · Северная стена',
    file: 'art/matisse-dance.webp',
    thumb: 'art/matisse-dance-thumb.jpg',
    width: 3.3,
    height: 2.1,
    position: [-3.6, 2.55, WALL.zNorth],
    rotationY: 0,
    light: 'spot',
    note: '«Танец» писался для московского особняка Щукина; в Эрмитаж полотно поступило из Государственного музея нового западного искусства.',
  },
  {
    id: 'aivazovsky',
    title: 'Девятый вал',
    author: 'Иван Айвазовский',
    year: '1850',
    technique: 'Холст, масло. 221 × 332 см',
    room: 'Зал 1 · Северная стена',
    file: 'art/aivazovsky-ninth-wave.webp',
    thumb: 'art/aivazovsky-ninth-wave-thumb.jpg',
    width: 2.9,
    height: 1.86,
    position: [3.6, 2.55, WALL.zNorth],
    rotationY: 0,
    light: 'spot',
    note: 'Самая известная марина Айвазовского: шестеро спасшихся держатся за обломок мачты, а над ними встаёт девятый вал.',
  },
  {
    id: 'rembrandt',
    title: 'Возвращение блудного сына',
    author: 'Рембрандт Харменс ван Рейн',
    year: 'ок. 1668',
    technique: 'Холст, масло. 262 × 205 см',
    room: 'Зал 1 · Западная стена',
    file: 'art/rembrandt-prodigal.webp',
    thumb: 'art/rembrandt-prodigal-thumb.jpg',
    width: 1.95,
    height: 2.5,
    position: [WALL.xWest, 2.45, -3.4],
    rotationY: Math.PI / 2,
    light: 'spot',
    note: 'Одна из последних работ Рембрандта. Свет выхватывает руки отца и рубище сына; справа стоит старший сын.',
  },
  {
    id: 'leonardo',
    title: 'Мадонна с Младенцем (Мадонна Литта)',
    author: 'Леонардо да Винчи',
    year: '1491–1495',
    technique: 'Дерево, масло, темпера. 42 × 33 см',
    room: 'Зал 1 · Западная стена',
    file: 'art/leonardo-litta.webp',
    thumb: 'art/leonardo-litta-thumb.jpg',
    width: 1.24,
    height: 1.54,
    position: [WALL.xWest, 2.4, 3.4],
    rotationY: Math.PI / 2,
    light: 'spot',
    note: 'Мадонна кормит Младенца грудью — редкий для Леонардо мотив. Полотно поступило в Эрмитаж в 1865 году.',
  },
  {
    id: 'monet',
    title: 'Женщина в саду. Сент-Адресс',
    author: 'Клод Моне',
    year: '1867',
    technique: 'Холст, масло. 82 × 100 см',
    room: 'Зал 1 · Южная стена',
    file: 'art/monet-garden.webp',
    thumb: 'art/monet-garden-thumb.jpg',
    width: 1.82,
    height: 1.5,
    position: [-4.4, 2.42, WALL.zSouth],
    rotationY: Math.PI,
    light: 'spot',
    note: 'Моне писал сад в Сент-Адрессе, где прошло его детство. Белое платье кузины — единственное светлое пятно в тени.',
  },
  {
    id: 'vangogh',
    title: 'Куст сирени',
    author: 'Винсент ван Гог',
    year: '1889',
    technique: 'Холст, масло. 73 × 92 см',
    room: 'Зал 1 · Южная стена',
    file: 'art/van-gogh-lilac.webp',
    thumb: 'art/van-gogh-lilac-thumb.jpg',
    width: 1.64,
    height: 1.3,
    position: [4.4, 2.42, WALL.zSouth],
    rotationY: Math.PI,
    light: 'spot',
    note: 'Написано в Сен-Реми, куда ван Гог приехал летом 1889 года. Сирень он писал как плотное облако цвета.',
  },
]);

export const SCULPTURES = Object.freeze([
  {
    id: 'venus',
    title: 'Афродита Милосская (Венера Милосская)',
    author: 'Александр Антиохийский (предположительно)',
    year: 'ок. 130–100 до н. э.',
    technique: 'Мрамор · в экспозиции зала — гипсовый слепок',
    room: 'Зал 1 · Северо-восточный угол',
    file: 'sculpture/venus-de-milo.json',
    modelHeight: 2.0,
    standHeight: 0.52,
    position: [7.45, 0, -4.75],
    rotationY: -0.86,
    stand: 'marble',
    scale: 1,
  },
  {
    id: 'homer',
    title: 'Гомер. Портрет',
    author: 'Неизвестный скульптор',
    year: 'ок. 460 до н. э. (римская копия)',
    technique: 'Мрамор · гипсовый слепок',
    room: 'Зал 1 · Западная стена',
    file: 'sculpture/homer.json',
    modelHeight: 0.7,
    standHeight: 1.0,
    position: [-8.2, 0, 0],
    rotationY: Math.PI / 2,
    stand: 'malachite',
    scale: 1,
  },
]);

// Девять стационарных точек. Каждая смотрит на свой «якорь».
// anchor — точка взгляда, вокруг которой камера выстраивает кадр при прибытии.
export const POINTS = Object.freeze([
  {
    id: 'p1', name: 'У входа', hint: 'Отсюда виден весь зал',
    position: [0, 5.0], anchor: [-1.0, 2.5, WALL.zNorth],
  },
  {
    id: 'p2', name: 'Сирень', hint: 'Ван Гог близко',
    position: [4.4, 3.95], anchor: [4.4, 2.42, WALL.zSouth],
  },
  {
    id: 'p3', name: 'Середина зала', hint: 'Между Матиссом и Айвазовским',
    position: [0.4, 1.1], anchor: [1.6, 2.4, WALL.zNorth],
  },
  {
    id: 'p4', name: 'Сад Моне', hint: 'Сент-Адресс',
    position: [-4.4, 3.95], anchor: [-4.4, 2.42, WALL.zSouth],
  },
  {
    id: 'p5', name: 'Гомер', hint: 'Бюст у западной стены',
    position: [-6.95, -0.45], anchor: [-8.2, 1.34, 0],
  },
  {
    id: 'p6', name: 'Рембрандт', hint: 'Западная стена',
    position: [-6.2, -3.55], anchor: [WALL.xWest, 2.45, -3.4],
  },
  {
    id: 'p7', name: 'Венера', hint: 'Северо-восточный угол',
    position: [5.15, -3.35], anchor: [7.45, 1.15, -4.75],
  },
  {
    id: 'p8', name: 'Танец', hint: 'Матисс во всю стену',
    position: [-2.5, -3.6], anchor: [-3.6, 2.45, WALL.zNorth],
  },
  {
    id: 'p9', name: 'Леонардо', hint: 'Мадонна Литта',
    position: [-6.2, 3.4], anchor: [WALL.xWest, 2.4, 3.4],
  },
]);

// Проекции для рамы и полотна: у стены рама чуть выступает внутрь зала.
export function wallFacing(rotationY) {
  return [Math.sin(rotationY), 0, Math.cos(rotationY)];
}

export function artworkTarget(art) {
  const [x, y, z] = art.position;
  return [x, y, z];
}

// Направление взгляда (yaw, pitch) из точки a в точку b.
export function lookAngles(from, to) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const horizontal = Math.hypot(dx, dz) || 1e-6;
  return {
    yaw: Math.atan2(dx, -dz),
    pitch: Math.atan2(dy, horizontal),
  };
}

export function pointPose(point, eye = HALL.eye) {
  const from = [point.position[0], eye, point.position[1]];
  return lookAngles(from, point.anchor);
}

export const START_POINT = 'p1';
export const DWELL_SECONDS = 10;
export const DWELL_ANGLE_DEG = 6.0;
export const DWELL_GRACE = 0.45;

// Взгляд на само полотно: через десять секунд камера подходит вплотную.
export const STUDY_SECONDS = 10;
export const STUDY_LEAVE_ANGLE_DEG = 26;
export const STUDY_LEAVE_SECONDS = 1.1;

export function pointById(id) {
  return POINTS.find((p) => p.id === id) || null;
}

export function artworkById(id) {
  return ARTWORKS.find((a) => a.id === id) || null;
}

export function sculptureById(id) {
  return SCULPTURES.find((s) => s.id === id) || null;
}

export const EXHIBITS = Object.freeze([
  ...ARTWORKS.map((a) => ({ id: a.id, kind: 'painting', title: a.title, author: a.author, year: a.year, position: a.position, width: a.width, height: a.height })),
  ...SCULPTURES.map((s) => ({ id: s.id, kind: 'sculpture', title: s.title, author: s.author, year: s.year, position: [s.position[0], s.standHeight + s.modelHeight * 0.55, s.position[2]], width: 0.8, height: s.modelHeight })),
]);
