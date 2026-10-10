export const SECTORS = [
  "Верхний участок",
  "Центральный участок",
  "Нижний участок",
];
const bounded = (v) =>
  typeof v === "number" && Number.isFinite(v)
    ? Math.max(0, Math.min(100, v))
    : 0;

// Old saves contain one percentage. Migrate it without losing progress.
// If a sector array exists it is authoritative, never trust a stale total.
export function readSectors(relic) {
  if (Array.isArray(relic?.sectors))
    return Array.from({ length: 3 }, (_, i) => bounded(relic.sectors[i]));
  return Array(3).fill(bounded(relic?.clean));
}
export function sectorProgress(sectors) {
  return sectors.reduce((sum, n) => sum + n, 0) / 3;
}
export function sectorAtHeight(y, min, max) {
  if (![y, min, max].every(Number.isFinite) || max <= min) return -1;
  return Math.max(
    0,
    Math.min(2, Math.floor((1 - (y - min) / (max - min)) * 3)),
  );
}
export function applyCleaning(relic, amount, sector = -1) {
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !Number.isInteger(sector) ||
    sector < -1 ||
    sector > 2
  )
    return false;
  relic.sectors = readSectors(relic).map((value, i) =>
    sector === -1 || sector === i ? Math.min(100, value + amount) : value,
  );
  relic.clean = sectorProgress(relic.sectors);
  return relic.sectors.every((v) => v === 100);
}
