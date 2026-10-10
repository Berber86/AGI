import { readSectors, sectorProgress, applyCleaning } from "./excavation.js";
export const SAVE_KEY = "palimpsest-expedition-v1";
export const GLYPHS = ["⌁", "⋈", "◇", "⟁"];
export function initialState() {
  return {
    scanned: false,
    relics: [
      { clean: 0, sectors: [0, 0, 0], decoded: false },
      { clean: 0, sectors: [0, 0, 0], decoded: false },
      { clean: 0, sectors: [0, 0, 0], decoded: false },
    ],
    completed: false,
  };
}
export function validateState(raw) {
  const state = initialState();
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.relics))
    return state;
  state.scanned = raw.scanned === true;
  state.relics = state.relics.map((r, i) => {
    const item = raw.relics[i];
    if (!item || typeof item !== "object") return r;
    const sectors = readSectors(item);
    const clean = sectorProgress(sectors);
    const decoded = item.decoded === true && clean === 100 && state.scanned;
    return { clean, sectors, decoded };
  });
  state.completed = state.relics.every((r) => r.decoded);
  return state;
}
export function cleanRelic(state, index, amount, sector = -1) {
  const relic = state.relics[index];
  if (
    !state.scanned ||
    !relic ||
    relic.decoded ||
    !Number.isFinite(amount) ||
    amount <= 0
  )
    return false;
  return applyCleaning(relic, amount, sector);
}
export function decodeRelic(state, index, answer, solution) {
  const relic = state.relics[index];
  if (
    !state.scanned ||
    !relic ||
    relic.clean < 100 ||
    relic.decoded ||
    !Array.isArray(answer) ||
    answer.length !== solution.length ||
    !answer.every((v, i) => v === solution[i])
  )
    return false;
  relic.decoded = true;
  state.completed = state.relics.every((r) => r.decoded);
  return true;
}
export function countRelics(state) {
  return state.relics.filter((r) => r.decoded).length;
}
export function readSave(storage) {
  try {
    return validateState(JSON.parse(storage.getItem(SAVE_KEY)));
  } catch {
    return initialState();
  }
}
export function saveState(storage, state) {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
