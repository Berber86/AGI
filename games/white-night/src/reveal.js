export const REVEAL_SECONDS = .85;
const smooth = t => t * t * (3 - 2 * t);
export function revealFrame(progress, reduced = false) {
  const p = reduced ? 1 : Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  const detail = smooth(Math.max(0, Math.min(1, (p - .46) / .54)));
  return {
    progress: p,
    phase: p < .18 ? 'anticipation' : p < .46 ? 'silhouette' : p < 1 ? 'detail' : 'ready',
    visible: p >= .18,
    // The silhouette opens sooner and fades with a steeper curve: measured on the
    // saved frames the old timeline kept the find a flat dark shape until 0.75 and
    // reached its first highlight at 0.70.
    silhouette: Math.pow(1 - detail, 1.25),
    scale: .94 + .06 * smooth(p),
    // The veil still dims the courtyard, but no longer deepens to 96 %: the backdrop
    // keeps a little structure behind the find instead of turning into a black plate.
    veil: .80 + .10 * smooth(Math.min(1, p / .55)),
    ready: p === 1,
  };
}
