import { CFG } from './config';

/**
 * The track is a closed candy loop. It is built from a parametric loop shape so
 * the 3D road bend and the HUD minimap always describe the same circuit.
 */
export interface Track {
  seed: number;
  /** One curve value per segment of a single lap (renderer units). */
  curve: number[];
  segmentsPerLap: number;
  /** Normalised closed path (0..1) for the minimap. */
  mapPath: { x: number; y: number }[];
  /** Total world length of one lap in world units. */
  lapWorldLength: number;
}

export function createTrack(seed: number): Track {
  const n = CFG.segmentsPerLap;
  const phase = ((seed % 997) / 997) * Math.PI * 2;

  // A wobbly circle: closed by construction, with three long sweepers and two
  // gentle kinks, which is what a child-friendly circuit needs.
  const radius = (phi: number): number => 1 + 0.26 * Math.sin(3 * phi + phase) + 0.11 * Math.sin(5 * phi + phase * 0.5);

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= n; i += 1) {
    const phi = (i / n) * Math.PI * 2;
    const r = radius(phi);
    points.push({ x: r * Math.cos(phi), y: r * Math.sin(phi) });
  }

  const curve: number[] = [];
  let total = 0;
  for (let i = 0; i < n; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % n];
    const c = points[(i + 2) % n];
    const h1 = Math.atan2(b.y - a.y, b.x - a.x);
    const h2 = Math.atan2(c.y - b.y, c.x - b.x);
    let d = h2 - h1;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    const value = d * CFG.curveScale;
    curve.push(value);
    total += value;
  }

  // Keep the loop balanced: the road should come back to its own lane, so any
  // drift in the accumulated curvature is spread evenly over the lap.
  const drift = total / n;
  for (let i = 0; i < n; i += 1) {
    curve[i] -= drift;
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const mapPath = points.map((p) => ({
    x: (p.x - minX) / span,
    // Screen y grows downwards, so the loop is drawn the same way it is driven.
    y: 1 - (p.y - minY) / span,
  }));

  return {
    seed,
    curve,
    segmentsPerLap: n,
    mapPath,
    lapWorldLength: CFG.lapLength * CFG.worldPerSim,
  };
}

/** Curvature at an arbitrary point of the race, in simulation units. */
export function curveAt(track: Track, progress: number): number {
  const segment = Math.floor((progress * CFG.worldPerSim) / CFG.segmentLength) % track.segmentsPerLap;
  return track.curve[(segment + track.segmentsPerLap) % track.segmentsPerLap];
}
