export const REVEAL_SECONDS = .85;
const smooth = t => t * t * (3 - 2 * t);
export function revealFrame(progress, reduced = false) {
  const p = reduced ? 1 : Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  const detail = smooth(Math.max(0, Math.min(1, (p - .50) / .50)));
  return {
    progress: p,
    phase: p < .22 ? 'anticipation' : p < .50 ? 'silhouette' : p < 1 ? 'detail' : 'ready',
    visible: p >= .22,
    silhouette: 1 - detail,
    scale: .94 + .06 * smooth(p),
    // The veil starts dense and deepens: the courtyard dims away instead of
    // flashing bright through a thin veil for the first fifth of a second.
    veil: .92 + .065 * smooth(Math.min(1, p / .50)),
    ready: p === 1,
  };
}
