// car.js — the hero car: Lily's "Star Racer 7" candy convertible.
//
// Rebuilt as real sheet metal instead of stacked rounded boxes:
//   * the hull is three lofts (left wall, right wall, floor pan) whose shared
//     edge functions cut genuine wheel arches, closed by dark inner wells;
//   * the top deck (hood, cockpit lips, boot) is one surface function split in
//     four panels around the cockpit opening — so panel gaps and the opening
//     lip are real geometry, not painted lines;
//   * wheels are revolved tyres with tread grooves, sidewall lettering, a
//     generated five-petal rim with see-through spokes, brake disc, caliper
//     and chrome hub caps;
//   * every colour comes from `car-textures.js`: glitter lacquer with its own
//     roughness/clearcoat-flake maps, quilted upholstery, satin, helmet art,
//     chroma-keyed unicorn door decal, lamp lenses, gauge faces — with the
//     original procedural canvas textures kept as fallbacks.
//
// The public shape is unchanged: createCar() returns { root, update }.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/three/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from '../vendor/three/jsm/utils/BufferGeometryUtils.js';
import { createCarMaps, createCarEnvironment } from './car-textures.js';

// ------------------------------------------------------------------ math bits
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

/** Piecewise smooth interpolation over [[x, value], …] (keys ascending in x). */
function keyed(keys, x) {
  if (x <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [x0, v0] = keys[i];
    const [x1, v1] = keys[i + 1];
    if (x >= x0 && x <= x1) return lerp(v0, v1, smoothstep(x0, x1, x));
  }
  return last[1];
}

/** Uniform Catmull-Rom through 2D points → `n` samples (endpoints duplicated). */
function curve2D(pts, n) {
  const p = [pts[0], ...pts, pts[pts.length - 1]];
  const segs = pts.length - 1;
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * segs;
    const s = Math.min(segs - 1, Math.floor(t));
    const f = t - s;
    const p0 = p[s], p1 = p[s + 1], p2 = p[s + 2], p3 = p[s + 3];
    const cr = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f);
    out.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]);
  }
  return out;
}

/**
 * Generic loft: `rings` is an array of equal-length Vector3 arrays.
 * UVs are in metres (u along the ring, v across rings) so material tiles keep a
 * physical size; `flip` swaps the winding for roof-like surfaces.
 */
function loft(rings, { closed = false, flip = false, uScale = 1, vScale = 1 } = {}) {
  const N = rings.length;
  const P = rings[0].length;
  const pos = [];
  const uv = [];
  const idx = [];
  const uAt = [];
  for (let i = 0; i < N; i++) {
    let acc = 0;
    const u = [0];
    for (let j = 1; j < P; j++) {
      acc += rings[i][j].distanceTo(rings[i][j - 1]);
      u.push(acc);
    }
    uAt.push(u);
  }
  const vAt = [0];
  for (let i = 1; i < N; i++) {
    vAt.push(vAt[i - 1] + rings[i][0].distanceTo(rings[i - 1][0]));
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < P; j++) {
      const p = rings[i][j];
      pos.push(p.x, p.y, p.z);
      uv.push(uAt[i][j] * uScale, vAt[i] * vScale);
    }
  }
  const cols = closed ? P : P - 1;
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < cols; j++) {
      const j2 = (j + 1) % P;
      const a = i * P + j, b = i * P + j2, c = (i + 1) * P + j, d = (i + 1) * P + j2;
      if (flip) idx.push(a, c, b, b, c, d);
      else idx.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** Rounded box built once per size (shared geometry helper). */
const boxCache = new Map();
function rbox(w, h, d, seg = 2, r = 0.06) {
  const k = `${w}|${h}|${d}|${seg}|${r}`;
  if (!boxCache.has(k)) boxCache.set(k, new RoundedBoxGeometry(w, h, d, seg, Math.min(r, Math.min(w, h, d) / 2 - 0.001)));
  return boxCache.get(k);
}

/** Tube through points (chunky chrome trim, piping, straps). */
function tube(points, radius, seg = 32, closed = false, radial = 6) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => (p.isVector3 ? p : new THREE.Vector3(...p))));
  return new THREE.TubeGeometry(curve, seg, radius, radial, closed);
}

// -------------------------------------------------------------- car dimensions
export const CAR = {
  length: 4.62,
  halfWidth: 0.90,
  wheelbase: 2.86,
  wheel: { R: 0.385, width: 0.27, rim: 0.24, frontZ: 1.41, rearZ: -1.45, x: 0.705 },
  archRadius: 0.5,
  rockerY: 0.32,
  cowlZ: 0.44,
  deckZ: -0.74,
  noseZ: 2.31,
  tailZ: -2.31,
  paintTile: 1 / 1.15,
};

// Body silhouette functions: half width, shoulder height, floor height.
const HW = [[-2.31, 0.60], [-2.20, 0.76], [-2.00, 0.86], [-1.60, 0.90], [-1.45, 0.905], [-1.10, 0.885], [-0.30, 0.865], [0.30, 0.868], [0.90, 0.875], [1.41, 0.878], [1.70, 0.862], [1.95, 0.80], [2.15, 0.70], [2.31, 0.52]];
const YS = [[-2.31, 1.02], [-2.05, 1.065], [-1.60, 1.07], [-0.74, 1.055], [0.44, 1.05], [0.60, 1.045], [1.30, 1.03], [1.80, 1.005], [2.10, 0.945], [2.31, 0.86]];
const DOME = [[-2.31, 0.05], [-2.05, 0.085], [-1.45, 0.088], [-0.74, 0.075], [0.44, 0.10], [0.90, 0.098], [1.60, 0.092], [2.05, 0.07], [2.31, 0.045]];
// fender flare: the flanks swell a little over each axle
const flareAt = (z) => {
  let k = 0;
  for (const axle of [CAR.wheel.frontZ, CAR.wheel.rearZ]) {
    const d = (z - axle) / 0.62;
    k = Math.max(k, Math.exp(-d * d));
  }
  return k;
};
const hwAt = (z) => keyed(HW, z) * (1 + 0.032 * flareAt(z));
// cut-down doors: the beltline dips between the cowl and the boot so the
// driver's shoulders stay visible over the door, like a real convertible
const cutAt = (z) => 0.15 * smoothstep(-0.86, -0.56, z) * (1 - smoothstep(0.10, 0.42, z));
const ysAt = (z) => keyed(YS, z) - cutAt(z);
const domeAt = (z) => keyed(DOME, z);
const swAt = (z) => hwAt(z) * 0.87 - 0.02;     // half width at the shoulder
// floor half width: narrow beside the wheel wells, wider under the cabin
const BW = [[-2.31, 0.62], [-2.02, 0.645], [-1.60, 0.63], [-0.93, 0.66], [-0.58, 0.76], [0.46, 0.76], [0.86, 0.66], [1.55, 0.63], [2.05, 0.66], [2.31, 0.62]];
const bwAt = (z) => keyed(BW, z);

/** Floor height: the rocker line, lifted by a circular wheel arch. */
function ybAt(z) {
  let y = CAR.rockerY;
  y = Math.max(y, keyed([[-2.31, 0.5], [-2.2, 0.36], [-2.05, 0.3]], z));   // rear valance
  y = Math.max(y, keyed([[2.05, 0.3], [2.2, 0.42], [2.31, 0.55]], z));     // front valance
  for (const axle of [CAR.wheel.frontZ, CAR.wheel.rearZ]) {
    const dz = z - axle;
    const r2 = CAR.archRadius * CAR.archRadius - dz * dz;
    if (r2 > 0) y = Math.max(y, CAR.wheel.R + Math.sqrt(r2) * 0.985);
  }
  return y;
}
const archSpans = () => [CAR.wheel.frontZ, CAR.wheel.rearZ].map((z) => [z - CAR.archRadius + 0.002, z + CAR.archRadius - 0.002]);

// ---------------------------------------------------------------- part builders
function sideWallRings(side, z0, z1, stations, samples) {
  const rings = [];
  for (let i = 0; i <= stations; i++) {
    const z = lerp(z0, z1, i / stations);
    rings.push(curve2D(wallCtrl(z, side), samples).map(([x, y]) => new THREE.Vector3(x, y, z)));
  }
  return rings;
}

/** Control points of the flank silhouette at station z (bulging over the tyres). */
function wallCtrl(z, side) {
  const hw = hwAt(z), ys = ysAt(z), yb = ybAt(z), bw = bwAt(z);
  const bulge = Math.max(bw + 0.07, hw * 0.965);
  return [
    [side * (hw * 0.87 - 0.02), ys],
    [side * (hw * 0.975), ys - (ys - yb) * 0.13],
    [side * hw, ys - (ys - yb) * 0.42],
    [side * bulge, yb + (ys - yb) * 0.2],
    [side * (bw * 1.03), yb + (ys - yb) * 0.06],
    [side * bw, yb],
  ];
}

/** Lateral position of the flank surface at a given height (used for decals). */
function wallXAt(z, y, side) {
  const pts = curve2D(wallCtrl(z, side), 18);
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    if ((y <= y0 && y >= y1) || (y >= y0 && y <= y1)) {
      const t = Math.abs(y1 - y0) < 1e-6 ? 0 : (y - y0) / (y1 - y0);
      return lerp(x0, x1, t);
    }
  }
  return pts[pts.length - 1][0];
}

function floorRings(z0, z1, stations, samples) {
  const rings = [];
  for (let i = 0; i <= stations; i++) {
    const z = lerp(z0, z1, i / stations);
    const bw = bwAt(z), y = ybAt(z);
    const pts = [];
    for (let j = 0; j < samples; j++) {
      const t = j / (samples - 1);
      const x = lerp(-bw, bw, t);
      pts.push(new THREE.Vector3(x, y - 0.03 * (1 - (x / Math.max(0.001, bw)) ** 2), z));
    }
    rings.push(pts);
  }
  return rings;
}

/** Deck surface across the car at station z (returns Vector3 row, -x → +x). */
function deckRow(z, samples, insetFrom = 0, insetTo = null) {
  const sw = swAt(z);
  const x0 = -sw + insetFrom;
  const x1 = sw - (insetTo === null ? insetFrom : insetTo);
  const dome = domeAt(z);
  const ridge = smoothstep(CAR.cowlZ, 1.9, z) * 0.014 * (1 - smoothstep(1.95, 2.3, z));
  const row = [];
  for (let j = 0; j < samples; j++) {
    const t = j / (samples - 1);
    const x = lerp(x0, x1, t);
    const k = Math.min(1, Math.abs(x) / Math.max(0.001, sw));
    const y = ysAt(z) + dome * Math.pow(1 - k * k, 0.85) + ridge * Math.exp(-((x / 0.16) ** 2)) - insetFrom * 0.16;
    row.push(new THREE.Vector3(x, y, z));
  }
  return row;
}

function deckPanel(z0, z1, stations, samples, insetFrom = 0, insetTo = null) {
  const rings = [];
  for (let i = 0; i <= stations; i++) rings.push(deckRow(lerp(z0, z1, i / stations), samples, insetFrom, insetTo));
  return rings;
}

/** Side deck strips around the cockpit opening (between the cowl and the boot). */
function deckStripRings(side, z0, z1, stations, samples, innerInset) {
  const rings = [];
  for (let i = 0; i <= stations; i++) {
    const z = lerp(z0, z1, i / stations);
    const sw = swAt(z);
    const xOuter = side * sw;
    const xInner = side * (sw - innerInset);
    const row = [];
    for (let j = 0; j < samples; j++) {
      const t = j / (samples - 1);
      const x = lerp(xOuter, xInner, t);
      const k = Math.min(1, Math.abs(x) / Math.max(0.001, sw));
      const y = ysAt(z) + domeAt(z) * Math.pow(1 - k * k, 0.85) - 0.02 * t;
      row.push(new THREE.Vector3(x, y, z));
    }
    rings.push(row);
  }
  return rings;
}

/** Wheel well: an inward-facing half cylinder over each arch. */
function wellGeometry(radius, width, segments = 22, lengthSeg = 1) {
  const rings = [];
  for (let i = 0; i <= lengthSeg; i++) {
    const x = lerp(-width / 2, width / 2, i / lengthSeg);
    const row = [];
    for (let j = 0; j <= segments; j++) {
      const a = (j / segments) * Math.PI;
      row.push(new THREE.Vector3(x, Math.sin(a) * radius, Math.cos(a) * radius));
    }
    rings.push(row);
  }
  return loft(rings, { flip: true, uScale: 1, vScale: 1 });
}

/** Revolve a 2D profile ([axial, radial]) around the wheel axle (+x axis). */
function revolveX(profile, segments, twist = 0) {
  const rings = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const row = [];
    for (const [axial, radial] of profile) {
      row.push(new THREE.Vector3(axial, Math.cos(a) * radial, Math.sin(a) * radial));
    }
    rings.push(row);
  }
  return loft(rings, { flip: false, uScale: 1, vScale: 1 });
}

/** Parametric sphere shell with a phi-dependent lower edge (hair, helmet). */
function shellGeometry(r, { phiSeg = 40, thetaSeg = 18, thetaEnd = (phi) => Math.PI / 2, thickness = 0 } = {}) {
  const rings = [];
  for (let i = 0; i <= thetaSeg; i++) {
    const row = [];
    const t = i / thetaSeg;
    for (let j = 0; j <= phiSeg; j++) {
      const phi = (j / phiSeg) * Math.PI * 2;
      const te = thetaEnd(phi);
      const theta = t * te;
      const rr = r + thickness * t;
      row.push(new THREE.Vector3(
        Math.sin(theta) * Math.cos(phi) * rr,
        Math.cos(theta) * rr,
        Math.sin(theta) * Math.sin(phi) * rr,
      ));
    }
    rings.push(row);
  }
  return loft(rings, { uScale: 1, vScale: 1 });
}

// ------------------------------------------------------------------- materials
function buildMaterials(M, env) {
  const enamel = (opts) => new THREE.MeshPhysicalMaterial({
    clearcoat: 1, clearcoatRoughness: 0.06, envMap: env || null, envMapIntensity: 1, ...opts,
  });

  const paint = enamel({
    map: M.paintMap, roughnessMap: M.paintRough, roughness: 0.42, metalness: 0.3,
    normalMap: M.paintNormal, normalScale: new THREE.Vector2(0.14, 0.14),
    clearcoatNormalMap: M.paintFlakeNormal, clearcoatNormalScale: new THREE.Vector2(0.17, 0.17),
    sheen: 0.6, sheenColor: new THREE.Color('#ff9ed2'), sheenRoughness: 0.5,
    emissive: new THREE.Color('#ffd9ef'), emissiveMap: M.paintSparkle, emissiveIntensity: 0.06,
    color: new THREE.Color('#ffffff'), side: THREE.DoubleSide, envMapIntensity: 0.5,
    clearcoat: 0.85, clearcoatRoughness: 0.09,
  });
  const paintDeep = enamel({
    map: M.paintMap, roughnessMap: M.paintRough, roughness: 0.5, metalness: 0.24,
    clearcoatNormalMap: M.paintFlakeNormal, clearcoatNormalScale: new THREE.Vector2(0.26, 0.26),
    color: new THREE.Color('#c62b78'), side: THREE.DoubleSide, envMapIntensity: 0.42, clearcoat: 0.7,
  });
  const chrome = new THREE.MeshPhysicalMaterial({ color: '#f2e6ef', metalness: 1, roughness: 0.1, envMap: env || null, envMapIntensity: 0.85, clearcoat: 1 });
  const chromeSoft = new THREE.MeshPhysicalMaterial({ color: '#d9ccd6', metalness: 1, roughness: 0.3, envMap: env || null, envMapIntensity: 0.7 });
  const cream = enamel({ map: M.satinMap, roughnessMap: M.satinRough, roughness: 0.42, sheen: 1, sheenColor: new THREE.Color('#fff1f7'), color: '#fffaf6' });
  const satinPink = enamel({ map: M.satinMap, roughnessMap: M.satinRough, roughness: 0.4, sheen: 1, sheenColor: new THREE.Color('#ff9ed2'), color: '#ff77b8' });
  const rubber = new THREE.MeshStandardMaterial({
    map: M.tireMap, roughnessMap: M.tireRough, normalMap: M.tireNormal, normalScale: new THREE.Vector2(0.45, 0.45),
    roughness: 0.95, metalness: 0.0, color: '#ffffff', envMapIntensity: 0.35,
  });
  const leather = new THREE.MeshStandardMaterial({ map: M.interiorMap, roughnessMap: M.interiorRough, roughness: 0.62, metalness: 0.02, color: '#ffffff' });
  const leatherDark = new THREE.MeshStandardMaterial({ map: M.interiorMap, roughnessMap: M.interiorRough, roughness: 0.7, color: '#c76d9c' });
  const matteDark = new THREE.MeshStandardMaterial({ color: '#2a1c26', roughness: 0.95 });
  const wellDark = new THREE.MeshStandardMaterial({ color: '#3b2430', roughness: 0.96, side: THREE.DoubleSide });
  const rimArt = new THREE.MeshPhysicalMaterial({
    map: M.rimMap, alphaMap: M.rimAlpha, alphaTest: 0.45, transparent: false,
    roughness: 0.3, metalness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.12,
    envMap: env || null, envMapIntensity: 0.7, side: THREE.DoubleSide,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#dff2ff', roughness: 0.03, metalness: 0.0, transparent: true, opacity: 0.15,
    clearcoat: 0.6, clearcoatRoughness: 0.03, envMap: env || null, envMapIntensity: 0.55,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const lampGlass = new THREE.MeshPhysicalMaterial({
    map: M.headlightMap, roughness: 0.12, metalness: 0.2, clearcoat: 1, envMap: env || null, envMapIntensity: 1,
    emissive: new THREE.Color('#fff3cf'), emissiveIntensity: 0.5, emissiveMap: M.headlightMap,
  });
  const tailLens = new THREE.MeshPhysicalMaterial({
    map: M.taillightMap, roughness: 0.16, metalness: 0.15, clearcoat: 1, envMap: env || null,
    emissive: new THREE.Color('#ff5a7d'), emissiveMap: M.taillightMap, emissiveIntensity: 1.5,
  });
  const brakeDisc = new THREE.MeshStandardMaterial({ color: '#b9bec8', metalness: 0.95, roughness: 0.42, envMap: env || null, envMapIntensity: 0.8 });
  const caliper = new THREE.MeshStandardMaterial({ color: '#ff3d8b', roughness: 0.35, metalness: 0.25, envMap: env || null });
  const flame = new THREE.MeshBasicMaterial({
    map: M.flameMap, color: '#ffd27a', transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  const underglow = new THREE.MeshBasicMaterial({
    map: M.underglowMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const decal = new THREE.MeshStandardMaterial({ map: M.decalMap, transparent: true, roughness: 0.34, metalness: 0.12, alphaTest: 0.35, side: THREE.DoubleSide });
  const plate = new THREE.MeshStandardMaterial({ map: M.plateMap, roughness: 0.35, metalness: 0.2 });
  const helmetMat = enamel({ map: M.helmetMap, roughnessMap: M.helmetRough, roughness: 0.22, metalness: 0.3, clearcoatRoughness: 0.04, color: '#ffffff' });
  const suit = enamel({
    map: M.satinMap, roughnessMap: M.satinRough, roughness: 0.55, sheen: 1, sheenColor: new THREE.Color('#ffd7ea'), color: '#ff5fa8',
  });
  const suitCream = enamel({ map: M.satinMap, roughnessMap: M.satinRough, roughness: 0.5, sheen: 1, color: '#fff5f9' });
  const skinWarm = new THREE.MeshStandardMaterial({ color: '#ffc9a6', roughness: 0.66 });
  const hair = new THREE.MeshPhysicalMaterial({ color: '#7a4a30', roughness: 0.42, metalness: 0.05, sheen: 0.8, sheenColor: new THREE.Color('#c98a5a'), clearcoat: 0.35 });
  const eyeWhite = new THREE.MeshStandardMaterial({ color: '#fffdfb', roughness: 0.22, metalness: 0.02 });
  const eyeIris = new THREE.MeshStandardMaterial({ color: '#6c3d1f', roughness: 0.18, metalness: 0.05 });
  const eyeDark = new THREE.MeshStandardMaterial({ color: '#2a1712', roughness: 0.16 });
  const glint = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const gold = new THREE.MeshStandardMaterial({ color: '#ffcf4d', roughness: 0.22, metalness: 0.85, envMap: env || null, envMapIntensity: 1 });
  const gaugeSpeedMat = new THREE.MeshStandardMaterial({ map: M.gaugeSpeed, roughness: 0.4, metalness: 0.1, transparent: true });
  const gaugeStarMat = new THREE.MeshStandardMaterial({ map: M.gaugeStar, roughness: 0.4, metalness: 0.1, transparent: true });
  const faceMat = new THREE.MeshStandardMaterial({ map: M.faceMap, roughness: 0.6, metalness: 0 });
  const plush = new THREE.MeshStandardMaterial({ color: '#fffaf4', roughness: 0.85 });
  const plushPink = new THREE.MeshStandardMaterial({ color: '#ff9ecb', roughness: 0.8 });

  return {
    paint, paintDeep, chrome, chromeSoft, cream, satinPink, rubber, leather, leatherDark, matteDark, wellDark,
    rimArt, glass, lampGlass, tailLens, brakeDisc, caliper, flame, underglow, decal, plate, helmetMat,
    suit, suitCream, skinWarm, hair, eyeWhite, eyeIris, eyeDark, glint, gold,
    gaugeSpeedMat, gaugeStarMat, faceMat, plush, plushPink,
  };
}

// ------------------------------------------------------------------ the driver
function faceTexture() {
  // Equirectangular face paint for the head sphere: lashes, brows, nose,
  // smile and cheeks. The eyeballs themselves are 3D so they catch light.
  const W = 1024, H = 512;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, '#ffd0b0');
  grd.addColorStop(0.45, '#ffdcc4');
  grd.addColorStop(1, '#f6bfa0');
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);
  const cx = W * 0.5;
  const eyeY = H * 0.535;
  const dx = W * 0.049;
  // soft eye sockets + blush + nose + smile
  for (const sx of [-1, 1]) {
    const x = cx + sx * dx;
    const socket = g.createRadialGradient(x, eyeY, 2, x, eyeY, 62);
    socket.addColorStop(0, 'rgba(180,110,80,0.28)');
    socket.addColorStop(1, 'rgba(180,110,80,0)');
    g.fillStyle = socket;
    g.beginPath(); g.arc(x, eyeY, 62, 0, Math.PI * 2); g.fill();
    // upper lash line
    g.strokeStyle = '#40241c';
    g.lineWidth = 13;
    g.lineCap = 'round';
    g.beginPath();
    g.ellipse(x, eyeY - 4, 54, 46, 0, Math.PI * 1.06, Math.PI * 1.94);
    g.stroke();
    // lash tips
    g.lineWidth = 8;
    g.beginPath(); g.moveTo(x - 52, eyeY - 24); g.lineTo(x - 66, eyeY - 38); g.stroke();
    g.beginPath(); g.moveTo(x + 52, eyeY - 24); g.lineTo(x + 66, eyeY - 38); g.stroke();
    // brow
    g.strokeStyle = '#5b3524';
    g.lineWidth = 15;
    g.beginPath();
    g.ellipse(x, eyeY - 84, 52, 22, 0, Math.PI * 1.08, Math.PI * 1.92);
    g.stroke();
    // cheek blush
    const blush = g.createRadialGradient(x + sx * 26, eyeY + 84, 2, x + sx * 26, eyeY + 84, 66);
    blush.addColorStop(0, 'rgba(255,120,140,0.42)');
    blush.addColorStop(1, 'rgba(255,120,140,0)');
    g.fillStyle = blush;
    g.beginPath(); g.arc(x + sx * 26, eyeY + 84, 66, 0, Math.PI * 2); g.fill();
  }
  // nose: a soft highlight + shadow
  const nose = g.createRadialGradient(cx, eyeY + 62, 1, cx, eyeY + 62, 44);
  nose.addColorStop(0, 'rgba(255,220,196,0.95)');
  nose.addColorStop(0.6, 'rgba(232,160,128,0.25)');
  nose.addColorStop(1, 'rgba(232,160,128,0)');
  g.fillStyle = nose;
  g.beginPath(); g.ellipse(cx, eyeY + 66, 30, 24, 0, 0, Math.PI * 2); g.fill();
  // smile
  g.strokeStyle = '#b04c56';
  g.lineWidth = 11;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(cx - 60, eyeY + 118);
  g.quadraticCurveTo(cx, eyeY + 172, cx + 60, eyeY + 118);
  g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.85)';
  g.beginPath();
  g.moveTo(cx - 46, eyeY + 134);
  g.quadraticCurveTo(cx, eyeY + 168, cx + 46, eyeY + 134);
  g.quadraticCurveTo(cx, eyeY + 146, cx - 46, eyeY + 134);
  g.fill();
  // freckle-ish sugar sparkles
  g.fillStyle = 'rgba(255,255,255,0.35)';
  for (let i = 0; i < 40; i++) {
    g.beginPath();
    g.arc(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

function buildDriver(M, mats, TEX) {
  const g = new THREE.Group();
  const add = (parent, mesh, staticMerge = false) => {
    parent.add(mesh);
    mesh.userData.noCollide = true;
    if (staticMerge) mesh.userData.merge = true;
    return mesh;
  };
  const suitM = mats.suit;

  // ---- legs: thighs forward, knees, shins to the pedals
  for (const sx of [-1, 1]) {
    const leg = new THREE.Group();
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.24, 4, 12), suitM);
    thigh.rotation.x = Math.PI / 2 - 0.22;
    thigh.position.set(sx * 0.11, -0.07, 0.15);
    const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.082, 0.24, 4, 12), suitM);
    shin.rotation.x = Math.PI / 2 - 1.05;
    shin.position.set(sx * 0.11, -0.14, 0.33);
    const shoe = new THREE.Mesh(rbox(0.15, 0.09, 0.24, 3, 0.042), mats.suitCream);
    shoe.position.set(sx * 0.11, -0.17, 0.45);
    shoe.rotation.x = 0.12;
    add(leg, thigh); add(leg, shin); add(leg, shoe);
    g.add(leg);
  }

  // ---- torso: tapered loft, quilting-free satin suit with a chest stripe
  const torsoRings = [];
  const torsoKeys = [
    [-0.30, 0.155, 0.115], [-0.16, 0.185, 0.135], [0.0, 0.175, 0.13],
    [0.14, 0.2, 0.14], [0.3, 0.225, 0.15], [0.42, 0.21, 0.14], [0.5, 0.16, 0.12],
  ];
  for (const [y, rw, rd] of torsoKeys) {
    const row = [];
    const P = 26;
    for (let i = 0; i < P; i++) {
      const a = (i / P) * Math.PI * 2;
      row.push(new THREE.Vector3(Math.cos(a) * rw * (1 + 0.06 * Math.cos(a * 2)), y, Math.sin(a) * rd * (0.86 + 0.2 * Math.cos(a))));
    }
    torsoRings.push(row);
  }
  const torso = new THREE.Mesh(loft(torsoRings, { closed: true, flip: true, uScale: 4, vScale: 4 }), suitM);
  add(g, torso);
  const bib = new THREE.Mesh(rbox(0.24, 0.3, 0.02, 2, 0.01), mats.suitCream);
  bib.position.set(0, 0.3, 0.15);
  add(g, bib);
  const starEmblem = new THREE.Mesh(new THREE.CircleGeometry(0.045, 5), mats.gold);
  starEmblem.position.set(0, 0.3, 0.165);
  add(g, starEmblem);
  // collar
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.026, 8, 20), mats.suitCream);
  collar.rotation.x = Math.PI / 2 - 0.25;
  collar.position.set(0, 0.5, 0.01);
  add(g, collar);
  // belt
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.022, 8, 24), mats.suitCream);
  belt.rotation.x = Math.PI / 2;
  belt.position.set(0, -0.12, 0);
  add(g, belt);

  // ---- arms: shoulder → elbow → forearm on the wheel; hands are parented to
  // the steering wheel so they stay glued to the rim while it turns.
  const shoulders = [];
  for (const sx of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(sx * 0.2, 0.36, 0.02);
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.078, 14, 12), suitM);
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.062, 0.2, 4, 12), suitM);
    upper.position.set(sx * 0.04, -0.11, 0.06);
    upper.rotation.z = sx * 0.18;
    upper.rotation.x = -0.25;
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 10), suitM);
    elbow.position.set(sx * 0.07, -0.22, 0.11);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.056, 0.014, 6, 16), mats.suitCream);
    cuff.position.set(sx * 0.08, -0.25, 0.15);
    cuff.rotation.x = 1.2;
    add(arm, shoulder); add(arm, upper); add(arm, elbow); add(arm, cuff);
    g.add(arm);
    shoulders.push({ arm, sx });
  }

  // ---- head: sphere with painted face + 3D eyes
  const head = new THREE.Group();
  head.position.set(0, 0.62, 0.02);
  // the seam of the equirect face texture is put at the back of the head, so
  // phiStart = -PI/2 makes uv 0.5 land dead centre on the face
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.27, 44, 30, -Math.PI / 2, Math.PI * 2), mats.faceMat);
  skull.scale.set(1, 1.03, 0.98);
  add(head, skull);
  // ears
  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), mats.skinWarm);
    ear.position.set(sx * 0.265, -0.01, 0.0);
    ear.scale.set(0.5, 1, 0.75);
    add(head, ear);
  }
  // 3D eyes: flattened sclera, iris disc, glints
  const eyes = [];
  for (const sx of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(sx * 0.083, 0.0, 0.225);
    eye.rotation.y = sx * 0.22;
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.045, 18, 14), mats.eyeWhite);
    white.scale.set(1, 1.1, 0.6);
    add(eye, white);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), mats.eyeIris);
    iris.position.z = 0.019;
    iris.scale.set(1, 1.08, 0.5);
    add(eye, iris);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.017, 12, 10), mats.eyeDark);
    pupil.position.z = 0.033;
    pupil.scale.set(1, 1, 0.45);
    add(eye, pupil);
    const cap1 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 8), mats.glint);
    cap1.position.set(sx * -0.01, 0.014, 0.038);
    const cap2 = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 6), mats.glint);
    cap2.position.set(sx * 0.012, -0.01, 0.04);
    add(eye, cap1); add(eye, cap2);
    head.add(eye);
    eyes.push(eye);
  }
  // nose tip
  const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.032, 14, 12), mats.skinWarm);
  noseTip.position.set(0, -0.055, 0.245);
  noseTip.scale.set(1, 0.86, 0.7);
  add(head, noseTip);

  // ---- hair: fringe shell (wavy lower edge), side locks, ponytail
  const fringe = new THREE.Mesh(shellGeometry(0.283, {
    phiSeg: 44, thetaSeg: 12,
    thetaEnd: (phi) => {
      // long at the sides and back, stopping at the brow in front
      const facing = Math.sin(phi);               // +1 at the face, -1 at the nape
      const wave = 0.045 * Math.sin(phi * 9) * Math.max(0, facing);
      return 1.95 - 0.72 * Math.max(0, facing) + wave;
    },
  }), mats.hair);
  fringe.position.set(0, 0.02, 0);
  add(head, fringe);
  for (const sx of [-1, 1]) {
    const lock = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.2, 4, 12), mats.hair);
    lock.position.set(sx * 0.245, -0.08, 0.11);
    lock.rotation.z = sx * 0.12;
    lock.rotation.x = -0.25;
    add(head, lock);
  }
  const ponytail = new THREE.Group();
  ponytail.position.set(0, 0.02, -0.25);
  const tie = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.016, 8, 16), mats.satinPink);
  tie.rotation.x = Math.PI / 2;
  add(ponytail, tie);
  const tailSegs = [];
  let px = 0;
  for (let i = 0; i < 3; i++) {
    const seg = new THREE.Mesh(new THREE.CapsuleGeometry(0.062 - i * 0.012, 0.12, 4, 12), mats.hair);
    seg.position.set(0, -0.03 - i * 0.09, -0.05 - i * 0.05);
    seg.rotation.x = -0.5 - i * 0.25;
    add(ponytail, seg);
    tailSegs.push(seg);
  }
  head.add(ponytail);

  // ---- helmet: open-face shell, horn, ears, goggle band, chin strap
  const helmet = new THREE.Group();
  const helmetShell = new THREE.Mesh(shellGeometry(0.305, {
    phiSeg: 40, thetaSeg: 16,
    thetaEnd: (phi) => {
      const facing = Math.sin(phi);               // +1 at the face
      return 1.34 - 0.46 * Math.max(0, facing) + 0.28 * Math.max(0, -facing);
    },
  }), mats.helmetMat);
  add(helmet, helmetShell);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.293, 0.019, 8, 36), mats.helmetMat);
  rim.rotation.x = Math.PI / 2 - 0.16;
  rim.position.set(0, 0.055, 0.01);
  rim.scale.set(1, 1, 0.93);
  add(helmet, rim);
  // unicorn horn: a twisted spiral cone
  const hornRings = [];
  const hornSeg = 9;
  for (let i = 0; i <= hornSeg; i++) {
    const t = i / hornSeg;
    const r = 0.052 * (1 - t) + 0.004;
    const twist = t * 3.4;
    const row = [];
    for (let j = 0; j <= 14; j++) {
      const a = (j / 14) * Math.PI * 2;
      const rr = r * (1 + 0.12 * Math.sin(a * 5 + twist * 6));
      row.push(new THREE.Vector3(Math.cos(a) * rr, t * 0.22, Math.sin(a) * rr));
    }
    hornRings.push(row);
  }
  const horn = new THREE.Mesh(loft(hornRings, { closed: true, uScale: 3, vScale: 3 }), mats.gold);
  horn.position.set(0, 0.245, 0.05);
  horn.rotation.x = -0.22;
  add(helmet, horn);
  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.062, 0.15, 12), mats.helmetMat);
    ear.position.set(sx * 0.155, 0.245, 0.02);
    ear.rotation.z = sx * 0.55;
    ear.rotation.x = -0.12;
    add(helmet, ear);
  }
  // goggles resting on the shell
  const goggleBand = new THREE.Mesh(new THREE.TorusGeometry(0.292, 0.024, 8, 30, Math.PI * 0.8), mats.chrome);
  goggleBand.rotation.x = Math.PI / 2 + 0.34;
  goggleBand.rotation.z = Math.PI * 0.6;
  goggleBand.position.set(0, 0.155, -0.04);
  add(helmet, goggleBand);
  for (const sx of [-1, 1]) {
    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.013, 8, 18), mats.chrome);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.037, 18), mats.glass);
    const holder = new THREE.Group();
    holder.position.set(sx * 0.155, 0.235, 0.115);
    holder.rotation.x = -0.75;
    holder.rotation.y = sx * 0.3;
    add(holder, lensRing); add(holder, lens);
    lens.position.z = 0.002;
    helmet.add(holder);
  }
  // star badge + chin strap
  const badge = new THREE.Mesh(new THREE.CircleGeometry(0.05, 5), mats.gold);
  badge.position.set(0, 0.16, -0.28);
  badge.rotation.x = 0.4;
  add(helmet, badge);
  const strap = new THREE.Mesh(tube([[0.235, 0.0, 0.08], [0.2, -0.16, 0.13], [0, -0.26, 0.15], [-0.2, -0.16, 0.13], [-0.235, 0.0, 0.08]], 0.013, 24, false, 6), mats.eyeDark);
  add(helmet, strap);
  helmet.position.set(0, 0.02, 0);
  head.add(helmet);

  head.position.set(0, 0.96, -0.05);
  g.add(head);

  return { group: g, head, ponytail, tailSegs, eyes, shoulders, torso };
}

/** Small plush unicorn riding shotgun (a friend for the passenger seat). */
function buildPlush(mats) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), mats.plush);
  body.scale.set(1, 0.92, 1.12);
  body.position.y = 0.12;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 18, 14), mats.plush);
  head.position.set(0, 0.29, 0.03);
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), mats.plushPink);
  snout.position.set(0, 0.26, 0.115);
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.08, 10), mats.gold);
  horn.position.set(0, 0.38, 0.05);
  horn.rotation.x = -0.3;
  g.add(body, head, snout, horn);
  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.06, 8), mats.plush);
    ear.position.set(sx * 0.06, 0.38, 0.0);
    ear.rotation.z = sx * 0.4;
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 6), mats.eyeDark);
    eye.position.set(sx * 0.045, 0.3, 0.1);
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.08, 3, 8), mats.plushPink);
    leg.position.set(sx * 0.07, 0.04, 0.06);
    leg.rotation.x = 0.5;
    g.add(ear, eye, leg);
  }
  // mane + tail
  const mane = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.022, 8, 16, Math.PI * 1.2), mats.plushPink);
  mane.position.set(0, 0.33, -0.02);
  mane.rotation.y = Math.PI / 2;
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), mats.plushPink);
  tail.position.set(0, 0.14, -0.15);
  g.add(mane, tail);
  g.traverse((o) => { if (o.isMesh) o.userData.noCollide = true; });
  return g;
}

// ------------------------------------------------------------------- assembly
export function createCar(TEX = {}, { renderer = null, anisotropy = 8 } = {}) {
  const M = createCarMaps(TEX, { anisotropy });
  M.faceMap = faceTexture();
  const env = createCarEnvironment(renderer);
  const mats = buildMaterials(M, env);

  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  const P = CAR.paintTile;

  // ---------------- hull: two side walls + floor pans, real wheel arches
  for (const side of [-1, 1]) {
    const rings = sideWallRings(side, CAR.noseZ, CAR.tailZ, 58, 18);
    if (side === 1) rings.forEach((r) => r.reverse());     // keep winding outward
    const wall = new THREE.Mesh(loft(rings, { uScale: P, vScale: P }), mats.paint);
    wall.userData.merge = true;
    wall.castShadow = true;
    body.add(wall);
  }
  const spans = archSpans();
  const floorRanges = [[CAR.tailZ + 0.06, spans[1][0] - 0.02], [spans[1][1] + 0.02, spans[0][0] - 0.02], [spans[0][1] + 0.02, CAR.noseZ - 0.06]];
  // inboard boards behind each arch: the floor cut is closed where the wheel
  // well does not already cover it, so no hole shows through the car
  for (const [z0, z1] of spans) {
    const board = new THREE.Mesh(rbox(1.1, 0.05, z1 - z0, 1, 0.02), mats.paintDeep);
    board.position.set(0, CAR.rockerY - 0.02, (z0 + z1) / 2);
    board.userData.merge = true;
    body.add(board);
  }
  for (const [z0, z1] of floorRanges) {
    const pan = new THREE.Mesh(loft(floorRings(z0, z1, Math.max(4, Math.round((z1 - z0) * 10)), 12), { flip: true, uScale: P, vScale: P }), mats.paintDeep);
    pan.userData.merge = true;
    body.add(pan);
  }
  // inner wells behind the arches
  for (const axle of [CAR.wheel.frontZ, CAR.wheel.rearZ]) {
    const well = new THREE.Mesh(wellGeometry(CAR.archRadius - 0.012, hwAt(axle) * 1.72, 24, 3), mats.wellDark);
    well.position.set(0, CAR.wheel.R, axle);
    well.rotation.y = Math.PI / 2;
    well.userData.merge = true;
    body.add(well);
  }

  // ---------------- deck: hood, boot, cockpit side strips
  const SW_IN = 0.085;
  const hood = new THREE.Mesh(loft(deckPanel(CAR.cowlZ, CAR.noseZ - 0.06, 26, 26), { flip: true, uScale: P, vScale: P }), mats.paint);
  hood.userData.merge = true;
  hood.castShadow = true;
  body.add(hood);
  const boot = new THREE.Mesh(loft(deckPanel(CAR.deckZ, CAR.tailZ + 0.05, 20, 24), { flip: true, uScale: P, vScale: P }), mats.paint);
  boot.userData.merge = true;
  boot.castShadow = true;
  body.add(boot);
  for (const side of [-1, 1]) {
    const rings = deckStripRings(side, CAR.cowlZ, CAR.deckZ, 22, 8, SW_IN);
    const strip = new THREE.Mesh(loft(rings, { flip: side < 0, uScale: P, vScale: P }), mats.paint);
    strip.userData.merge = true;
    body.add(strip);
  }

  // ---------------- cockpit interior: tub, floor, dash, seats, console
  const tubZ0 = CAR.deckZ + 0.03;
  const tubZ1 = CAR.cowlZ - 0.02;
  const innerHalf = (z) => swAt(z) - SW_IN;
  const floorY = 0.30;
  {
    const rings = [];
    for (let i = 0; i <= 16; i++) {
      const z = lerp(tubZ0, tubZ1, i / 16);
      const w = innerHalf(z);
      const row = [];
      for (let j = 0; j < 12; j++) {
        const t = j / 11;
        const x = lerp(-w, w, t);
        row.push(new THREE.Vector3(x, floorY - 0.03 * (1 - (x / w) ** 2), z));
      }
      rings.push(row);
    }
    const tubFloor = new THREE.Mesh(loft(rings, { flip: true, uScale: 2.2, vScale: 2.2 }), mats.leatherDark);
    tubFloor.userData.merge = true;
    body.add(tubFloor);
  }
  // door cards (inside of the walls)
  for (const side of [-1, 1]) {
    const rings = [];
    for (let i = 0; i <= 16; i++) {
      const z = lerp(tubZ1, tubZ0, i / 16);
      const x = side * innerHalf(z);
      const row = [];
      for (let j = 0; j < 8; j++) {
        const t = j / 7;
        row.push(new THREE.Vector3(x + side * 0.02 * (1 - t), lerp(ysAt(z) - 0.02, floorY, t), z));
      }
      rings.push(row);
    }
    const card = new THREE.Mesh(loft(rings, { flip: side > 0, uScale: 2.4, vScale: 2.4 }), mats.leather);
    card.userData.merge = true;
    body.add(card);
  }
  // rear panel behind the seats + parcel shelf
  {
    const rings = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const y = lerp(floorY, ysAt(tubZ0) + 0.02, t);
      const w = innerHalf(tubZ0);
      const row = [];
      for (let j = 0; j < 10; j++) {
        const s = j / 9;
        row.push(new THREE.Vector3(lerp(-w, w, s), y, tubZ0 + 0.01 * Math.sin(s * Math.PI)));
      }
      rings.push(row);
    }
    const back = new THREE.Mesh(loft(rings, { flip: true, uScale: 2.4, vScale: 2.4 }), mats.leather);
    back.userData.merge = true;
    body.add(back);
  }
  // dashboard
  let gaugeNeedle = null;
  const dash = new THREE.Group();
  dash.position.set(0, 0, CAR.cowlZ - 0.12);
  {
    const panel = new THREE.Mesh(rbox(1.66, 0.3, 0.2, 3, 0.07), mats.leather);
    panel.position.set(0, 0.85, 0);
    panel.rotation.x = -0.12;
    const top = new THREE.Mesh(rbox(1.68, 0.07, 0.28, 2, 0.03), mats.leatherDark);
    top.position.set(0, 1.0, 0.03);
    top.rotation.x = -0.12;
    const trim = new THREE.Mesh(rbox(1.7, 0.03, 0.03, 2, 0.012), mats.chrome);
    trim.position.set(0, 0.9, 0.1);
    dash.add(panel, top, trim);
    for (const [x, mat] of [[-0.42, mats.gaugeSpeedMat], [-0.18, mats.gaugeStarMat]]) {
      const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.077, 0.012, 8, 24), mats.chrome);
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.072, 28), mat);
      const holder = new THREE.Group();
      holder.position.set(x, 1.0, 0.07);
      holder.rotation.x = -1.35;
      bezel.position.z = 0.006;
      holder.add(face, bezel);
      dash.add(holder);
    }
    // the speedometer needle lives outside the merged geometry so it can move
    const needle = new THREE.Group();
    needle.position.set(-0.42, 1.0, 0.082);
    needle.rotation.x = -1.35;
    const blade = new THREE.Mesh(rbox(0.008, 0.062, 0.006, 1, 0.003), mats.gold);
    blade.position.y = 0.03;
    needle.add(blade);
    needle.traverse((o) => { if (o.isMesh) o.userData.noCollide = true; });
    dash.add(needle);
    gaugeNeedle = needle;
    // candy-stripe knobs + a tiny glove box line
    for (let i = 0; i < 3; i++) {
      const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.03, 12), mats.chrome);
      knob.position.set(0.28 + i * 0.1, 0.82, 0.09);
      knob.rotation.x = 1.35;
      dash.add(knob);
    }
    const box = new THREE.Mesh(rbox(0.42, 0.02, 0.02, 2, 0.008), mats.chromeSoft);
    box.position.set(0.42, 0.98, 0.06);
    dash.add(box);
  }
  dash.traverse((o) => { if (o.isMesh) { o.userData.noCollide = true; o.userData.merge = true; } });
  body.add(dash);

  // floor console between the seats + gear lever
  {
    const console3d = new THREE.Mesh(rbox(0.26, 0.2, 0.8, 3, 0.055), mats.leather);
    console3d.position.set(0, floorY + 0.1, -0.35);
    const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.28, 10), mats.chrome);
    lever.position.set(0.05, floorY + 0.36, -0.28);
    lever.rotation.x = 0.2;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), mats.satinPink);
    knob.position.set(0.05, floorY + 0.5, -0.31);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.08, 14, 1, true), mats.chromeSoft);
    cup.position.set(-0.05, floorY + 0.22, -0.5);
    body.add(console3d, lever, knob, cup);
    [console3d, lever, knob, cup].forEach((o) => { o.userData.noCollide = true; o.userData.merge = true; });
  }
  // pedals + floor mats
  {
    const gas = new THREE.Mesh(rbox(0.09, 0.13, 0.03, 2, 0.012), mats.chromeSoft);
    gas.position.set(-0.3, floorY + 0.08, 0.34);
    gas.rotation.x = -0.5;
    const brake = gas.clone();
    brake.position.set(-0.46, floorY + 0.08, 0.34);
    const mat1 = new THREE.Mesh(rbox(0.5, 0.02, 0.34, 2, 0.02), mats.leatherDark);
    mat1.position.set(-0.4, floorY + 0.02, 0.05);
    body.add(gas, brake, mat1);
    [gas, brake, mat1].forEach((o) => { o.userData.noCollide = true; o.userData.merge = true; });
  }

  // seats (creamy buckets with pink piping) + chrome rails
  const seatPiping = [];
  for (const sx of [-1, 1]) {
    const seat = new THREE.Group();
    seat.position.set(sx * 0.38, floorY + 0.02, -0.42);
    const base = new THREE.Mesh(rbox(0.56, 0.16, 0.52, 3, 0.07), mats.leather);
    base.position.set(0, 0.14, 0.04);
    const back = new THREE.Mesh(rbox(0.56, 0.66, 0.16, 3, 0.07), mats.leather);
    back.position.set(0, 0.44, -0.2);
    back.rotation.x = -0.16;
    const bolsterL = new THREE.Mesh(rbox(0.1, 0.2, 0.5, 2, 0.05), mats.leather);
    bolsterL.position.set(-0.25, 0.22, 0.04);
    const bolsterR = bolsterL.clone();
    bolsterR.position.x = 0.25;
    const headRest = new THREE.Mesh(rbox(0.3, 0.16, 0.14, 3, 0.06), mats.leather);
    headRest.position.set(0, 0.82, -0.26);
    headRest.rotation.x = -0.2;
    seat.add(base, back, bolsterL, bolsterR, headRest);
    // piping: cream tube around the seat squab and up the back
    const pip = new THREE.Mesh(tube([
      [-0.27, 0.07, -0.22], [-0.28, 0.08, 0.3], [0, 0.08, 0.34], [0.28, 0.08, 0.3], [0.27, 0.07, -0.22],
    ], 0.012, 26, false, 6), mats.suitCream);
    const pip2 = new THREE.Mesh(tube([
      [-0.27, 0.12, -0.24], [-0.28, 0.5, -0.36], [-0.2, 0.78, -0.33],
    ], 0.011, 18, false, 6), mats.suitCream);
    const pip3 = new THREE.Mesh(tube([
      [0.27, 0.12, -0.24], [0.28, 0.5, -0.36], [0.2, 0.78, -0.33],
    ], 0.011, 18, false, 6), mats.suitCream);
    seat.add(pip, pip2, pip3);
    // chrome rails
    for (const rz of [-0.16, 0.24]) {
      const rail = new THREE.Mesh(rbox(0.05, 0.03, 0.42, 2, 0.014), mats.chromeSoft);
      rail.position.set(sx * 0.04, 0.02, rz);
      seat.add(rail);
    }
    seat.traverse((o) => { if (o.isMesh) { o.userData.noCollide = true; o.userData.merge = true; } });
    body.add(seat);
    seatPiping.push(seat);
  }

  // ---------------- windshield + mirrors
  {
    const g = new THREE.Group();
    const baseY = ysAt(CAR.cowlZ) + 0.05;
    const topY = baseY + 0.5;
    const zB = CAR.cowlZ + 0.02, zT = CAR.cowlZ - 0.2;
    const hwB = 0.79, hwT = 0.75;
    const glassRows = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const x = lerp(-hwB, hwB, t);
      const bend = -0.05 * (x / hwB) ** 2;
      glassRows.push([new THREE.Vector3(x, baseY, zB + bend), new THREE.Vector3(x * (hwT / hwB), topY, zT + bend)]);
    }
    // the screen is a two-station quad grid (a loft would add nothing here)
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= 1; i++) {
      for (let j = 0; j <= 10; j++) {
        const p = glassRows[j][i];
        pos.push(p.x, p.y, p.z);
        uv.push(j / 10, i);
      }
    }
    for (let j = 0; j < 10; j++) {
      const a = j, b = j + 1, c = 11 + j, d = 12 + j;
      idx.push(a, c, b, b, c, d);
    }
    const gGlass = new THREE.BufferGeometry();
    gGlass.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    gGlass.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    gGlass.setIndex(idx);
    gGlass.computeVertexNormals();
    const glass = new THREE.Mesh(gGlass, mats.glass);
    g.add(glass);
    // chrome frame: bottom rail, top rail, two raked side posts
    const frame = [];
    const railB = new THREE.Mesh(tube([
      [-hwB, baseY, zB], [-hwB * 0.5, baseY + 0.012, zB - 0.02], [0, baseY + 0.016, zB - 0.03],
      [hwB * 0.5, baseY + 0.012, zB - 0.02], [hwB, baseY, zB],
    ], 0.016, 32, false, 8), mats.chrome);
    const railT = new THREE.Mesh(tube([
      [-hwT, topY, zT], [0, topY + 0.01, zT - 0.01], [hwT, topY, zT],
    ], 0.014, 24, false, 8), mats.chrome);
    frame.push(railB, railT);
    for (const sx of [-1, 1]) {
      const post = new THREE.Mesh(tube([
        [sx * hwB, baseY, zB], [sx * (hwB + hwT) * 0.5, (baseY + topY) / 2, (zB + zT) / 2], [sx * hwT, topY, zT],
      ], 0.013, 16, false, 7), mats.chrome);
      frame.push(post);
    }
    // rear-view mirror hanging from the top rail
    const mir = new THREE.Mesh(rbox(0.16, 0.05, 0.03, 2, 0.014), mats.plate);
    mir.position.set(0, topY - 0.05, zT + 0.03);
    mir.rotation.x = 0.2;
    frame.push(mir);
    frame.forEach((m) => { m.userData.merge = true; });
    g.add(...frame);
    body.add(g);
  }
  // door mirrors
  for (const sx of [-1, 1]) {
    const mirror = new THREE.Group();
    mirror.position.set(sx * (hwAt(CAR.cowlZ) - 0.02), ysAt(CAR.cowlZ) + 0.12, CAR.cowlZ + 0.1);
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.16, 8), mats.chrome);
    stalk.rotation.z = sx * 0.9;
    stalk.position.set(sx * 0.05, 0.03, 0);
    const head = new THREE.Mesh(rbox(0.13, 0.1, 0.05, 3, 0.025), mats.paint);
    head.position.set(sx * 0.13, 0.06, 0.01);
    head.rotation.y = sx * 0.35;
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.045, 20), mats.chrome);
    face.position.set(sx * 0.13, 0.06, 0.04);
    face.rotation.y = sx * 0.35;
    mirror.add(stalk, head, face);
    mirror.traverse((o) => { if (o.isMesh) o.userData.merge = true; });
    body.add(mirror);
  }

  // ---------------- grille, lamps, bumpers, tail
  {
    const noseZ = CAR.noseZ - 0.12;
    const grille = new THREE.Group();
    grille.position.set(0, 0, 0);
    const shell = new THREE.Mesh(rbox(0.98, 0.42, 0.12, 3, 0.06), mats.chrome);
    shell.position.set(0, 0.74, noseZ);
    shell.rotation.x = 0.06;
    const back = new THREE.Mesh(rbox(0.9, 0.34, 0.06, 2, 0.04), mats.paintDeep);
    back.position.set(0, 0.74, noseZ + 0.045);
    grille.add(shell, back);
    const barGeo = rbox(0.035, 0.32, 0.05, 2, 0.015);
    const bars = new THREE.InstancedMesh(barGeo, mats.chrome, 11);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 11; i++) {
      const x = -0.42 + i * 0.084;
      m4.makeTranslation(x, 0.74, noseZ + 0.06);
      bars.setMatrixAt(i, m4);
    }
    bars.instanceMatrix.needsUpdate = true;
    grille.add(bars);
    const badgePlate = new THREE.Mesh(new THREE.CircleGeometry(0.072, 5), mats.gold);
    badgePlate.position.set(0, 0.74, noseZ + 0.088);
    const badgeRing = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 8, 24), mats.chrome);
    badgeRing.position.set(0, 0.74, noseZ + 0.08);
    grille.add(badgePlate, badgeRing);
    grille.traverse((o) => { if (o.isMesh || o.isInstancedMesh) o.userData.merge = true; });
    body.add(grille);

    // headlamps: chrome bezel + lens + emissive core
    for (const sx of [-1, 1]) {
      const lamp = new THREE.Group();
      lamp.position.set(sx * 0.63, ysAt(2.1) - 0.12, 2.19);
      const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.152, 0.03, 10, 28), mats.chrome);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), mats.lampGlass);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.42), mats.lampGlass);
      dome.rotation.x = Math.PI / 2;
      dome.position.z = -0.02;
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 12), new THREE.MeshBasicMaterial({ color: '#fff6d8' }));
      core.position.z = 0.03;
      lamp.add(bezel, lens, dome, core);
      lamp.rotation.y = sx * 0.06;
      lamp.traverse((o) => { if (o.isMesh) o.userData.merge = true; });
      body.add(lamp);
    }
    // taillights with heart lenses
    for (const sx of [-1, 1]) {
      const lamp = new THREE.Group();
      lamp.position.set(sx * 0.6, ysAt(-2.1) - 0.16, CAR.tailZ + 0.1);
      const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.026, 10, 26), mats.chrome);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.135, 28), mats.tailLens);
      const core = new THREE.Mesh(new THREE.CircleGeometry(0.045, 22), new THREE.MeshBasicMaterial({ color: '#f2607c' }));
      core.position.z = 0.006;
      lamp.add(bezel, lens, core);
      lamp.rotation.y = Math.PI;
      lamp.traverse((o) => { if (o.isMesh) o.userData.merge = true; });
      body.add(lamp);
    }
    // bumpers with over-riders
    for (const [z, sx] of [[CAR.noseZ - 0.03, 1], [CAR.tailZ + 0.03, -1]]) {
      const bumper = new THREE.Mesh(tube([
        [-0.82, 0.5, z], [-0.5, 0.47, z + sx * 0.05], [0, 0.46, z + sx * 0.07], [0.5, 0.47, z + sx * 0.05], [0.82, 0.5, z],
      ], 0.045, 30, false, 10), mats.chrome);
      bumper.userData.merge = true;
      body.add(bumper);
      for (const bx of [-0.5, 0.5]) {
        const over = new THREE.Mesh(rbox(0.08, 0.16, 0.08, 3, 0.03), mats.chrome);
        over.position.set(bx, 0.56, z + sx * 0.06);
        over.userData.merge = true;
        body.add(over);
      }
    }
    // number plate + exhaust tips
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.22), mats.plate);
    plate.position.set(0, 0.62, CAR.tailZ + 0.045);
    plate.rotation.y = Math.PI;
    body.add(plate);
    for (const sx of [-1, 1]) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.2, 16, 1, true), mats.chrome);
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(sx * 0.42, 0.34, CAR.tailZ + 0.06);
      body.add(pipe);
    }
    // lollipop antenna on the rear deck: chrome stick + a glossy swirl disc
    {
      const ant = new THREE.Group();
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.62, 10), mats.chrome);
      stick.position.y = 0.31;
      const lolliMat = new THREE.MeshPhysicalMaterial({
        map: TEX.lolliPink || null, color: TEX.lolliPink ? '#ffffff' : '#ff6fb0',
        roughness: 0.22, metalness: 0.1, clearcoat: 1, envMap: mats.chrome.envMap || null, envMapIntensity: 0.6,
      });
      const lolli = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 28), lolliMat);
      lolli.rotation.x = Math.PI / 2;
      lolli.position.y = 0.66;
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 10), mats.chrome);
      tip.position.y = 0.72;
      ant.add(stick, lolli, tip);
      ant.position.set(0.56, ysAt(-1.85) + domeAt(-1.85) - 0.02, -1.85);
      ant.rotation.z = -0.16;
      ant.traverse((o) => { if (o.isMesh) { o.userData.merge = true; o.castShadow = true; } });
      body.add(ant);
    }
    // ducktail lip: a low wing along the boot's trailing edge
    {
      const lip = new THREE.Mesh(tube([
        [-0.8, ysAt(-2.2) + domeAt(-2.2) + 0.012, -2.2], [-0.4, ysAt(-2.28) + domeAt(-2.28) + 0.03, -2.28],
        [0, ysAt(-2.3) + domeAt(-2.3) + 0.038, -2.3], [0.4, ysAt(-2.28) + domeAt(-2.28) + 0.03, -2.28],
        [0.8, ysAt(-2.2) + domeAt(-2.2) + 0.012, -2.2],
      ], 0.022, 26, false, 8), mats.paint);
      lip.userData.merge = true;
      lip.castShadow = true;
      body.add(lip);
    }
    // fuel filler cap on the boot
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 18), mats.chrome);
    cap.position.set(0.62, ysAt(-1.9) + domeAt(-1.9) + 0.012, -1.9);
    cap.rotation.x = Math.PI / 2;
    cap.userData.merge = true;
    body.add(cap);
  }

  // ---------------- chrome trim: beltline spear, door cuts, handles
  {
    const spearPts = [];
    for (let i = 0; i <= 26; i++) {
      const z = lerp(1.95, -2.1, i / 26);
      const y = ysAt(z) - 0.14 - 0.03 * smoothstep(0.4, -0.7, z);
      spearPts.push(new THREE.Vector3(hwAt(z) * 1.005, y, z));
    }
    for (const side of [-1, 1]) {
      const spear = new THREE.Mesh(tube(spearPts.map((p) => new THREE.Vector3(side * p.x, p.y, p.z)), 0.009, 60, false, 7), mats.chrome);
      spear.userData.merge = true;
      body.add(spear);
      // another, thinner spear lower down
      const pts2 = [];
      for (let i = 0; i <= 20; i++) {
        const z = lerp(1.75, -1.95, i / 20);
        const y = Math.max(ybAt(z) + 0.18, 0.42);
        pts2.push(new THREE.Vector3(side * hwAt(z) * 0.995, y, z));
      }
      const spear2 = new THREE.Mesh(tube(pts2, 0.0055, 40, false, 6), mats.chrome);
      spear2.userData.merge = true;
      body.add(spear2);
      // door cut line + handle
      const cut = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        const y = lerp(ysAt(0.34) - 0.02, Math.max(ybAt(0.34) + 0.1, 0.44), t);
        cut.push(new THREE.Vector3(side * (hwAt(0.34) * (0.995 + 0.015 * Math.sin(t * Math.PI))), y, 0.34));
      }
      const cutRear = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        const y = lerp(ysAt(-0.78) - 0.02, Math.max(ybAt(-0.78) + 0.1, 0.44), t);
        cutRear.push(new THREE.Vector3(side * (hwAt(-0.78) * (0.995 + 0.015 * Math.sin(t * Math.PI))), y, -0.78));
      }
      const doorL = new THREE.Mesh(tube(cut, 0.006, 20, false, 5), mats.matteDark);
      const doorR = new THREE.Mesh(tube(cutRear, 0.006, 20, false, 5), mats.matteDark);
      doorL.userData.merge = true;
      doorR.userData.merge = true;
      body.add(doorL, doorR);
      const handle = new THREE.Mesh(rbox(0.02, 0.035, 0.16, 2, 0.012), mats.chrome);
      handle.position.set(side * (hwAt(-0.45) * 1.0 + 0.008), ysAt(-0.45) - 0.17, -0.45);
      handle.userData.merge = true;
      body.add(handle);
    }
    // arch chrome edging
    for (const axle of [CAR.wheel.frontZ, CAR.wheel.rearZ]) {
      for (const side of [-1, 1]) {
        const pts = [];
        for (let i = 0; i <= 16; i++) {
          const a = Math.PI * (i / 16);
          const dz = Math.cos(a) * (CAR.archRadius - 0.01);
          const dy = CAR.wheel.R + Math.sin(a) * (CAR.archRadius - 0.01);
          pts.push(new THREE.Vector3(side * (hwAt(axle + dz) * 1.0), dy, axle + dz));
        }
        const edge = new THREE.Mesh(tube(pts, 0.0075, 26, false, 6), mats.chrome);
        edge.userData.merge = true;
        body.add(edge);
      }
    }
    // cockpit opening piping
    for (const side of [-1, 1]) {
      const pts = [];
      for (let i = 0; i <= 14; i++) {
        const z = lerp(CAR.cowlZ - 0.02, CAR.deckZ + 0.02, i / 14);
        pts.push(new THREE.Vector3(side * innerHalf(z), ysAt(z) + domeAt(z) * 0.2 + 0.005, z));
      }
      const pip = new THREE.Mesh(tube(pts, 0.012, 26, false, 7), mats.satinPink);
      pip.userData.merge = true;
      body.add(pip);
    }
  }

  // ---------------- decals: unicorn badge + race lettering on both doors
  for (const side of [-1, 1]) {
    // rows run UP the door (v), each row across z (u) — so the sticker art's
    // x axis lands along the car's length
    const ring = [];
    const yTop = (z) => ysAt(z) - 0.14;
    const yBot = (z) => Math.max(ybAt(z) + 0.06, ysAt(z) - 0.6);
    for (let i = 0; i <= 8; i++) {
      const s = i / 8;
      const row = [];
      for (let j = 0; j <= 12; j++) {
        const t = j / 12;
        const z = lerp(0.34, -0.78, t);
        const y = lerp(yBot(z), yTop(z), s);
        const x = wallXAt(z, y, side) + side * 0.009;
        row.push(new THREE.Vector3(x, y, z));
      }
      ring.push(row);
    }
    // UV extents: u spans the door length, v the band height — normalise both
    // so the art canvas covers the panel exactly
    let maxU = 0;
    for (let i = 1; i < ring[0].length; i++) maxU += Math.hypot(ring[0][i].x - ring[0][i - 1].x, ring[0][i].z - ring[0][i - 1].z);
    const maxV = Math.hypot(ring[ring.length - 1][0].x - ring[0][0].x, ring[ring.length - 1][0].y - ring[0][0].y);
    const decal = new THREE.Mesh(loft(side < 0 ? ring.map((r) => [...r].reverse()) : ring, { uScale: 1 / maxU, vScale: 1 / Math.max(0.001, maxV) }), mats.decal);
    decal.userData.merge = true;
    body.add(decal);
  }

  // ---------------- hood bow (satin) + candy star gem
  {
    const bow = new THREE.Group();
    bow.position.set(0, ysAt(1.62) + domeAt(1.62) + 0.03, 1.62);
    const knots = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), mats.satinPink);
    bow.add(knots);
    for (const sx of [-1, 1]) {
      const loop = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.048, 10, 22, Math.PI * 1.35), mats.cream);
      loop.rotation.set(Math.PI / 2, 0, sx * 0.5);
      loop.position.set(sx * 0.115, 0.02, 0);
      loop.scale.set(1, 1, 0.72);
      const tail = new THREE.Mesh(loft([
        [new THREE.Vector3(-0.04, 0, 0), new THREE.Vector3(0.04, 0, 0)],
        [new THREE.Vector3(-0.045, -0.1, sx * 0.02), new THREE.Vector3(0.045, -0.1, sx * 0.02)],
        [new THREE.Vector3(-0.03, -0.2, sx * 0.06), new THREE.Vector3(0.03, -0.2, sx * 0.06)],
      ].map((row) => row.map((v) => v.clone().add(new THREE.Vector3(sx * 0.06, 0, 0)))), { uScale: 6, vScale: 6 }), mats.cream);
      tail.rotation.z = sx * 0.35;
      bow.add(loop, tail);
    }
    const gem = new THREE.Mesh(new THREE.CircleGeometry(0.038, 5), mats.gold);
    gem.position.set(0, 0.035, 0.045);
    bow.add(gem);
    bow.traverse((o) => { if (o.isMesh) o.userData.merge = true; });
    body.add(bow);
  }

  // ---------------- wheels
  const wheels = [];
  const tireProfile = (() => {
    const w = CAR.wheel.width / 2;
    const R = CAR.wheel.R;
    const bead = CAR.wheel.rim + 0.004;
    // low-profile shoulder: nearly vertical sidewall, rounded tread corners
    return [
      [-w, bead], [-w, R * 0.9], [-w * 0.995, R * 0.975], [-w * 0.94, R * 0.998], [-w * 0.62, R + 0.003],
      [0, R + 0.005], [w * 0.62, R + 0.003], [w * 0.94, R * 0.998], [w * 0.995, R * 0.975], [w, R * 0.9], [w, bead],
    ];
  })();
  const tireGeo = revolveX(tireProfile, 56);
  const rimDiscGeo = new THREE.CircleGeometry(CAR.wheel.rim + 0.005, 40);
  const rimLipGeo = new THREE.TorusGeometry(CAR.wheel.rim, 0.016, 8, 40);
  const barrelGeo = new THREE.CylinderGeometry(CAR.wheel.rim - 0.03, CAR.wheel.rim - 0.03, CAR.wheel.width * 0.78, 24, 1, true);
  const discGeo = new THREE.CircleGeometry(CAR.wheel.rim - 0.055, 30);
  const hubCapGeo = new THREE.SphereGeometry(0.048, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const starCapGeo = new THREE.CircleGeometry(0.042, 5);
  const caliperGeo = rbox(0.05, 0.16, 0.1, 2, 0.025);
  const lugGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.02, 6);

  for (const [x, z, front] of [
    [-CAR.wheel.x, CAR.wheel.frontZ, true], [CAR.wheel.x, CAR.wheel.frontZ, true],
    [-CAR.wheel.x, CAR.wheel.rearZ, false], [CAR.wheel.x, CAR.wheel.rearZ, false],
  ]) {
    const s = Math.sign(x);
    const wheel = new THREE.Group();
    wheel.position.set(x, CAR.wheel.R, z);
    const spin = new THREE.Group();                     // everything that rotates
    const tire = new THREE.Mesh(tireGeo, mats.rubber);
    tire.castShadow = true;
    spin.add(tire);
    const lip = new THREE.Mesh(rimLipGeo, mats.rimArt);
    lip.rotation.y = Math.PI / 2;
    lip.position.x = s * CAR.wheel.width * 0.4;
    const disc = new THREE.Mesh(rimDiscGeo, mats.rimArt);
    disc.rotation.y = s * Math.PI / 2;
    disc.position.x = s * CAR.wheel.width * 0.415;
    const barrel = new THREE.Mesh(barrelGeo, mats.matteDark);
    barrel.rotation.z = Math.PI / 2;
    spin.add(lip, disc, barrel);
    const hubCap = new THREE.Mesh(hubCapGeo, mats.chrome);
    hubCap.rotation.z = -s * Math.PI / 2;
    hubCap.position.x = s * (CAR.wheel.width * 0.415 + 0.008);
    const spinner = new THREE.Mesh(starCapGeo, mats.gold);
    spinner.rotation.y = s * Math.PI / 2;
    spinner.position.x = s * (CAR.wheel.width * 0.415 + 0.045);
    spin.add(hubCap, spinner);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.3;
      const lug = new THREE.Mesh(lugGeo, mats.chrome);
      lug.rotation.z = Math.PI / 2;
      lug.position.set(s * (CAR.wheel.width * 0.415 + 0.012), Math.cos(a) * 0.036, Math.sin(a) * 0.036);
      spin.add(lug);
    }
    // brake disc + caliper stay still while the wheel spins
    const brake = new THREE.Mesh(discGeo, mats.brakeDisc);
    brake.rotation.y = Math.PI / 2;
    brake.position.x = s * 0.02;
    const caliper = new THREE.Mesh(caliperGeo, mats.caliper);
    caliper.position.set(s * 0.02, 0.1, front ? -0.09 : 0.09);
    wheel.add(spin, brake, caliper);
    wheel.traverse((o) => { if (o.isMesh) { o.userData.noCollide = true; o.castShadow = o === tire; } });
    root.add(wheel);
    wheels.push({ group: wheel, spin, front });
  }

  // ---------------- driver + plush passenger
  const driver = buildDriver(M, mats, TEX);
  driver.group.position.set(-0.38, floorY + 0.32, -0.34);
  driver.group.scale.setScalar(0.85);
  driver.group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.userData.noCollide = true; } });
  body.add(driver.group);
  const plush = buildPlush(mats);
  plush.position.set(0.38, floorY + 0.06, -0.42);
  plush.scale.setScalar(0.92);
  plush.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  body.add(plush);

  // steering wheel (hands are glued to it)
  const steering = new THREE.Group();
  steering.position.set(-0.38, floorY + 0.48, 0.32);
  steering.scale.setScalar(0.92);
  steering.rotation.x = 1.0;
  {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.021, 10, 32), mats.satinPink);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.035, 16), mats.chrome);
    hub.rotation.x = Math.PI / 2;
    const star = new THREE.Mesh(new THREE.CircleGeometry(0.028, 5), mats.gold);
    star.position.z = 0.02;
    steering.add(rim, hub, star);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + Math.PI / 2;
      const spoke = new THREE.Mesh(rbox(0.028, 0.15, 0.014, 2, 0.008), mats.chrome);
      spoke.position.set(Math.cos(a) * 0.08, Math.sin(a) * 0.08, 0);
      spoke.rotation.z = a - Math.PI / 2;
      steering.add(spoke);
    }
    // gloved hands: palms + fingers wrapped around the rim
    for (const sx of [-1, 1]) {
      const hand = new THREE.Group();
      hand.position.set(sx * 0.165, 0, 0);
      const palm = new THREE.Mesh(rbox(0.075, 0.05, 0.1, 3, 0.022), mats.suitCream);
      palm.rotation.z = sx * 0.25;
      hand.add(palm);
      for (let f = 0; f < 3; f++) {
        const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.05, 3, 8), mats.suitCream);
        finger.rotation.x = Math.PI / 2;
        finger.rotation.z = sx * 0.5;
        finger.position.set(sx * 0.012, -0.028 + f * 0.001, -0.005 + f * 0.03);
        hand.add(finger);
      }
      const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.017, 0.04, 3, 8), mats.suitCream);
      thumb.rotation.set(Math.PI / 2.4, 0, sx * 0.9);
      thumb.position.set(sx * 0.03, 0.03, 0.01);
      hand.add(thumb);
      steering.add(hand);
    }
  }
  steering.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.userData.noCollide = true; } });
  body.add(steering);

  // ---------------- effects: glitter sparks, underglow, flames, trail anchor
  const sparks = [];
  for (let i = 0; i < 16; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({
      map: M.sparkleMap, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, color: new THREE.Color().setHSL(0.92 + Math.random() * 0.1, 0.7, 0.78),
    }));
    const s = 0.09 + Math.random() * 0.18;
    m.scale.set(s, s, s);
    body.add(m);
    sparks.push({ sprite: m, phase: Math.random() * Math.PI * 2, speed: 0.6 + Math.random() * 1.4, r: 0.85 + Math.random() * 0.9, y: 0.35 + Math.random() * 1.25 });
  }
  const flames = [];
  for (const sx of [-1, 1]) {
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.7, 12, 1, true), mats.flame);
    flame.rotation.x = -Math.PI / 2;
    flame.position.set(sx * 0.42, 0.34, CAR.tailZ - 0.34);
    flame.visible = false;
    body.add(flame);
    flames.push(flame);
  }
  const shadowBlob = new THREE.Mesh(
    new THREE.CircleGeometry(2.05, 28),
    new THREE.MeshBasicMaterial({ color: 0x2a1030, transparent: true, opacity: 0.2, depthWrite: false }),
  );
  shadowBlob.rotation.x = -Math.PI / 2;
  shadowBlob.position.y = 0.028;
  root.add(shadowBlob);
  const underglow = new THREE.Mesh(new THREE.CircleGeometry(2.7, 28), mats.underglow);
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.y = 0.05;
  root.add(underglow);

  // -------- static merge pass: fewer draw calls for the same silhouette
  const mergeReport = mergeStatic(body);

  root.traverse((o) => {
    o.userData.noCollide = true;
    if (o.isMesh && o.castShadow === undefined) o.castShadow = false;
  });

  // ------------------------------------------------------------------ motion
  let wheelSpin = 0;
  let t = 0;
  const paint = mats.paint;
  const paintEmissive = new THREE.Color('#ffd9ef');
  const boostEmissive = new THREE.Color('#7a1246');

  return {
    root,
    maps: M,
    materials: mats,
    stats: () => ({ ...mergeReport, env: !!env }),
    update(dt, { speed = 0, steer = 0, boost = false, offRoad = false } = {}) {
      t += dt;
      wheelSpin += speed * dt * 2.1;
      for (const w of wheels) {
        w.spin.rotation.x = wheelSpin;
        if (w.front) w.group.rotation.y = THREE.MathUtils.lerp(w.group.rotation.y, steer * 0.4, 0.18);
      }
      // body sway & bob
      const sway = THREE.MathUtils.clamp(steer, -1, 1) * 0.075;
      body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, -sway, 0.1);
      body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, offRoad ? Math.sin(wheelSpin * 0.7) * 0.018 : 0, 0.08);
      body.position.y = Math.sin(wheelSpin * 0.35) * 0.011 * Math.min(1, speed / 12);

      // driver: head bob / look into the turn, ponytail sway, arms follow the wheel
      const headTurn = THREE.MathUtils.clamp(steer, -1, 1);
      driver.head.rotation.y = THREE.MathUtils.lerp(driver.head.rotation.y, headTurn * 0.22, 0.08);
      driver.head.rotation.z = THREE.MathUtils.lerp(driver.head.rotation.z, -sway * 0.5, 0.08);
      driver.head.position.y = 0.96 + Math.sin(wheelSpin * 0.5) * 0.012 * Math.min(1, speed / 12);
      const reach = 1.5 + Math.min(2.5, speed * 0.12);
      driver.ponytail.rotation.x = -0.15 - Math.min(0.5, speed * 0.02) + Math.sin(t * (2 + reach)) * 0.06;
      driver.tailSegs.forEach((seg, i) => {
        seg.rotation.z = Math.sin(t * (2.2 + i * 0.7) + i) * (0.1 + speed * 0.012);
        seg.rotation.x = -0.5 - i * 0.25 - Math.min(0.5, speed * 0.02) + Math.sin(t * (1.8 + i)) * 0.05;
      });
      steering.rotation.z = THREE.MathUtils.lerp(steering.rotation.z, -steer * 0.95, 0.14);
      for (const { arm, sx } of driver.shoulders) {
        arm.rotation.x = THREE.MathUtils.lerp(arm.rotation.x, -0.1 - steer * sx * 0.25, 0.12);
        arm.rotation.y = THREE.MathUtils.lerp(arm.rotation.y, -steer * 0.25, 0.12);
      }

      // paint: sparkle twinkle + boost glow
      paint.emissiveIntensity = (boost ? 0.42 : 0.14) + Math.sin(t * 3.4) * 0.03;
      paint.emissive.copy(boost ? boostEmissive : paintEmissive);
      mats.tailLens.emissiveIntensity = boost ? 2.1 + Math.sin(wheelSpin * 3.4) * 0.4 : 0.9;
      // speedometer needle: sweeps the dial with the real reading (140 km/h full)
      if (gaugeNeedle) {
        const kmh = Math.abs(speed) * 3.6;
        const target = -2.35 + Math.min(1, kmh / 140) * 4.7;
        gaugeNeedle.rotation.z = THREE.MathUtils.lerp(gaugeNeedle.rotation.z, target, 0.12);
      }

      // exhaust flames
      flames.forEach((f, i) => {
        f.visible = !!boost;
        if (boost) {
          const k = 0.8 + Math.abs(Math.sin(wheelSpin * 1.9 + i * 1.5)) * 0.55;
          f.scale.set(k, k * 1.3, k);
        }
      });
      // underglow
      const ugTarget = boost ? 0.8 + Math.sin(t * 15) * 0.14 : 0;
      underglow.material.opacity = THREE.MathUtils.lerp(underglow.material.opacity, ugTarget, boost ? 0.25 : 0.12);
      underglow.scale.setScalar(boost ? 1.16 + Math.sin(t * 9) * 0.1 : 1);
      // sparkles
      for (const sp of sparks) {
        const a = t * sp.speed + sp.phase;
        sp.sprite.position.set(Math.cos(a) * sp.r, sp.y + Math.sin(a * 1.7) * 0.26, Math.sin(a * 1.3) * sp.r * 1.6);
        const tw = 0.5 + 0.5 * Math.sin(a * 3.1 + t * 2);
        sp.sprite.material.opacity = (boost ? 0.85 : 0.2) * tw;
        const sc = (boost ? 0.3 : 0.15) * (0.7 + 0.6 * tw);
        sp.sprite.scale.set(sc, sc, sc);
      }
    },
  };
}

/** Merge static same-material meshes into single draw calls (best effort). */
function mergeStatic(root) {
  const buckets = new Map();
  const doomed = [];
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || o.isSprite || !o.userData.merge) return;
    if (o.parent && o.parent.userData.dynamic) return;
    const key = o.material.uuid;
    if (!buckets.has(key)) buckets.set(key, { material: o.material, geos: [], cast: o.castShadow, receive: o.receiveShadow });
    const b = buckets.get(key);
    const geo = (o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone());
    geo.applyMatrix4(o.matrixWorld);
    b.geos.push(geo);
    b.cast = b.cast || o.castShadow;
    b.receive = b.receive || o.receiveShadow;
    doomed.push(o);
  });
  let merged = 0;
  for (const b of buckets.values()) {
    if (b.geos.length < 2) continue;
    let combined = null;
    try {
      combined = mergeGeometries(b.geos, false);
    } catch (err) {
      combined = null;
    }
    if (!combined) continue;
    const mesh = new THREE.Mesh(combined, b.material);
    mesh.castShadow = b.cast;
    mesh.receiveShadow = b.receive;
    mesh.userData.noCollide = true;
    mesh.name = 'car-merged';
    root.add(mesh);
    merged++;
    for (const g of b.geos) g.dispose();
  }
  let removed = 0;
  if (merged) {
    for (const o of doomed) {
      const b = buckets.get(o.material.uuid);
      if (b && b.geos.length >= 2 && o.parent) {
        o.parent.remove(o);
        removed++;
      }
    }
  }
  let meshes = 0;
  let tri = 0;
  root.traverse((o) => {
    if (!o.isMesh) return;
    meshes++;
    const g = o.geometry;
    const n = g.index ? g.index.count : (g.attributes.position ? g.attributes.position.count : 0);
    tri += Math.floor(n / 3) * (o.isInstancedMesh ? o.count : 1);
  });
  return { mergedGroups: merged, removedMeshes: removed, meshes, triangles: tri };
}

// --------------------------------------------------------------------- trail
/** Pink magic-dust trail behind the car (lives in the scene, not on the car). */
export function createTrail(scene, count = 72) {
  const tex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 2, 32, 32, 30);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.25, 'rgba(255,214,240,0.85)');
    grd.addColorStop(1, 'rgba(255,150,210,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    g.fillStyle = 'rgba(255,255,255,0.95)';
    g.beginPath();
    g.moveTo(32, 4); g.lineTo(38, 26); g.lineTo(60, 32); g.lineTo(38, 38);
    g.lineTo(32, 60); g.lineTo(26, 38); g.lineTo(4, 32); g.lineTo(26, 26);
    g.closePath(); g.fill();
    const tt = new THREE.CanvasTexture(c);
    tt.colorSpace = THREE.SRGBColorSpace;
    return tt;
  })();
  const items = [];
  for (let i = 0; i < count; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, color: new THREE.Color('#ff8fc6'),
    }));
    s.visible = false;
    scene.add(s);
    items.push({ s, life: 0, maxLife: 1, vel: new THREE.Vector3() });
  }
  let cursor = 0, acc = 0;
  const fwd = new THREE.Vector3();
  const COLORS = ['#ff8fc6', '#ff5fa2', '#c86bff', '#ffe9a8', '#ffffff'];
  return {
    update(dt, carRoot, speed, boost) {
      acc += dt * (boost ? 120 : 58);
      carRoot.getWorldDirection(fwd);
      while (acc >= 1) {
        acc -= 1;
        const it = items[cursor];
        cursor = (cursor + 1) % items.length;
        it.maxLife = it.life = 0.65 + Math.random() * 0.75;
        it.s.visible = true;
        it.s.material.color.set(COLORS[(Math.random() * COLORS.length) | 0]);
        it.s.position.copy(carRoot.position)
          .addScaledVector(fwd, -2.4 - Math.random() * 0.6)
          .add(new THREE.Vector3((Math.random() - 0.5) * 1.6, 0.25 + Math.random() * 0.85, (Math.random() - 0.5) * 0.7));
        const back = 0.8 + Math.min(4, speed) * 0.22;
        it.vel.set(
          (Math.random() - 0.5) * 1.2 - fwd.x * back,
          0.5 + Math.random() * 0.9,
          (Math.random() - 0.5) * 1.2 - fwd.z * back,
        );
      }
      for (const it of items) {
        if (it.life <= 0) continue;
        it.life -= dt;
        if (it.life <= 0) { it.s.visible = false; continue; }
        it.s.position.addScaledVector(it.vel, dt);
        it.vel.y += dt * 0.6;
        it.vel.multiplyScalar(1 - dt * 1.4);
        const k = it.life / it.maxLife;
        it.s.material.opacity = k * (boost ? 0.95 : 0.75);
        const sc = (0.16 + (1 - k) * 0.42) * (boost ? 1.5 : 1);
        it.s.scale.set(sc, sc, sc);
      }
    },
    reset() {
      for (const it of items) { it.life = 0; it.s.visible = false; }
    },
  };
}
