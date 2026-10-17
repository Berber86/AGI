export type SpeciesId =
  | "clownfish"
  | "blue-tang"
  | "angelfish"
  | "butterflyfish"
  | "turtle"
  | "manta"
  | "eel"
  | "whale";

export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export interface Species {
  id: SpeciesId;
  name: string;
  latin: string;
  depth: string;
  habitat: string;
  size: string;
  accent: string;
  rarity: Rarity;
  description: string;
  note: string;
}

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Обычный вид",
  uncommon: "Нечастый вид",
  rare: "Редкая встреча",
  legendary: "Легенда рифа",
};

export const SPECIES: Species[] = [
  {
    id: "clownfish",
    name: "Рыба-клоун",
    latin: "Amphiprion ocellaris",
    depth: "2–15 м",
    habitat: "Актинии",
    size: "до 11 см",
    accent: "#ff9a6c",
    rarity: "common",
    description:
      "Живёт в симбиозе с актинией: ядовитые щупальца защищают её, а рыба приносит добычу и очищает хозяина.",
    note: "Держится в паре и почти не отплывает от своего дома.",
  },
  {
    id: "blue-tang",
    name: "Голубой хирург",
    latin: "Paracanthurus hepatus",
    depth: "2–40 м",
    habitat: "Внешний склон рифа",
    size: "до 31 см",
    accent: "#74b9f0",
    rarity: "uncommon",
    description:
      "Электрический синий цвет и «палитра» на боку — не для красоты: рисунок помогает узнать соседа в стае.",
    note: "Стая движется против течения, почти не меняя дистанцию.",
  },
  {
    id: "angelfish",
    name: "Императорский ангел",
    latin: "Pomacanthus imperator",
    depth: "3–40 м",
    habitat: "Коралловые башни",
    size: "до 40 см",
    accent: "#e8c98f",
    rarity: "uncommon",
    description:
      "Взрослый ангел носит жёлто-синие полосы и маску на глазах. Молодые особи выглядят совсем иначе.",
    note: "Один из немногих видов, который меняет окраску на протяжении жизни.",
  },
  {
    id: "butterflyfish",
    name: "Жёлтая бабочка",
    latin: "Chaetodon auriga",
    depth: "4–30 м",
    habitat: "Кусты кораллов",
    size: "до 23 см",
    accent: "#f7dc7c",
    rarity: "common",
    description:
      "Узкое тело позволяет ей заглядывать в самые узкие щели между ветвями кораллов. Питается полипами и мелкими рачками.",
    note: "Чёрная точка у хвоста — ложный глаз, который путает хищника.",
  },
  {
    id: "turtle",
    name: "Зелёная черепаха",
    latin: "Chelonia mydas",
    depth: "0–40 м",
    habitat: "Пастбища морских трав",
    size: "до 1,2 м",
    accent: "#b7dba7",
    rarity: "rare",
    description:
      "Спокойно идёт сквозь риф навстречу течению. Взрослые особи становятся вегетарианцами и пасутся на морских травах.",
    note: "Над головой — узор из щитков, как отпечаток пальца. Неповторимый.",
  },
  {
    id: "manta",
    name: "Манта",
    latin: "Mobula birostris",
    depth: "10–120 м",
    habitat: "Открытая вода",
    size: "размах до 7 м",
    accent: "#b7dae0",
    rarity: "rare",
    description:
      "Самая крупная из скатов. Проплывает беззвучно, фильтруя воду через рот, и, кажется, наблюдает за вами в ответ.",
    note: "Манты узнают себя в зеркале — редкая способность среди рыб.",
  },
  {
    id: "eel",
    name: "Садовый угорь",
    latin: "Heteroconger hassi",
    depth: "8–35 м",
    habitat: "Песчаные поляны",
    size: "до 40 см",
    accent: "#d8cdb0",
    rarity: "common",
    description:
      "Колония тонких тел раскачивается в толще воды, ловя планктон. При приближении вся колония мгновенно прячется в норы.",
    note: "Смотрите вниз — иногда их принимают за водоросли.",
  },
  {
    id: "whale",
    name: "Синий кит",
    latin: "Balaenoptera musculus",
    depth: "0–200 м",
    habitat: "Пелагиаль",
    size: "до 30 м",
    accent: "#a9cfd3",
    rarity: "legendary",
    description:
      "Крупнейшее животное, когда-либо жившее на Земле. Его сердце размером с небольшой автомобиль, а голос слышен за сотни километров.",
    note: "В этих водах проходит миграционный маршрут. Оставайтесь неподвижны.",
  },
];

export const findSpecies = (id: SpeciesId) => SPECIES.find((s) => s.id === id)!;

export const formatDiveTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
};
