export const UPGRADES = [
  {
    id: "scanner",
    name: "Спектральный процессор",
    category: "СКАНЕР / МК II",
    cost: 1,
    description:
      "Анализ плато за 2,4 с вместо 4,2 с. Повторное сканирование быстрее локализует сигналы.",
  },
  {
    id: "brush",
    name: "Ультразвуковая насадка",
    category: "ОЧИСТКА / МК II",
    cost: 1,
    description:
      "Кисть и кнопочная очистка работают на 50% быстрее. Результаты исследования не меняются.",
  },
];
export function initialBase() {
  return {
    deposited: [false, false, false],
    researched: [false, false, false],
    upgrades: [],
    transmitted: false,
  };
}
export function validateBase(raw, relics) {
  const base = initialBase();
  const deposited = Array.isArray(raw?.deposited) ? raw.deposited : [];
  const researched = Array.isArray(raw?.researched) ? raw.researched : [];
  base.deposited = base.deposited.map(
    (_, i) => relics[i]?.decoded === true && deposited[i] === true,
  );
  base.researched = base.researched.map(
    (_, i) => base.deposited[i] && researched[i] === true,
  );
  let budget = base.researched.filter(Boolean).length;
  for (const upgrade of UPGRADES) {
    if (
      Array.isArray(raw?.upgrades) &&
      raw.upgrades.includes(upgrade.id) &&
      budget >= upgrade.cost
    ) {
      base.upgrades.push(upgrade.id);
      budget -= upgrade.cost;
    }
  }
  base.transmitted =
    base.researched.every(Boolean) && raw?.transmitted === true;
  return base;
}
export function researchCredits(state) {
  return (
    state.base.researched.filter(Boolean).length -
    UPGRADES.filter((u) => state.base.upgrades.includes(u.id)).reduce(
      (sum, u) => sum + u.cost,
      0,
    )
  );
}
export function cargoCount(state) {
  return state.relics.filter((r, i) => r.decoded && !state.base.deposited[i])
    .length;
}
export function deliverCargo(state) {
  let delivered = 0;
  state.relics.forEach((r, i) => {
    if (r.decoded && !state.base.deposited[i]) {
      state.base.deposited[i] = true;
      delivered++;
    }
  });
  return delivered;
}
export function researchSpecimen(state, index) {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index > 2 ||
    !state.base.deposited[index] ||
    state.base.researched[index]
  )
    return false;
  state.base.researched[index] = true;
  return true;
}
export function buyUpgrade(state, id) {
  const upgrade = UPGRADES.find((u) => u.id === id);
  if (
    !upgrade ||
    state.base.upgrades.includes(id) ||
    researchCredits(state) < upgrade.cost
  )
    return false;
  state.base.upgrades.push(id);
  return true;
}
export function transmitArchive(state) {
  if (state.base.transmitted || !state.base.researched.every(Boolean))
    return false;
  state.base.transmitted = true;
  return true;
}
export function equipment(state) {
  return {
    scanDuration: state.base.upgrades.includes("scanner") ? 2.4 : 4.2,
    cleaningMultiplier: state.base.upgrades.includes("brush") ? 1.5 : 1,
  };
}
