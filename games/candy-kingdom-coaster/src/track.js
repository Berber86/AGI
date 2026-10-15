// Spline track: road mesh, curbs, terrain shoulders, start/finish, pose queries.
import * as THREE from 'three';
import { TUNING, ZONES, BRIDGE } from './config.js';
import { buildCourse } from './course.js';
import { createRoutes } from './routes.js';

const UP = new THREE.Vector3(0, 1, 0);

// Across-the-ribbon layout of the road map (fraction of texture height).
// The road mesh covers curb → road → curb; the curbs are tinted by vertex
// colours and sample the plain white margins, the road band samples
// [ROAD_BAND[0], ROAD_BAND[1]]. One texture tile = ROAD_TILE_M metres.
export const ROAD_BAND = [0.12, 0.88];
export const ROAD_TILE_M = 12;

// One road surface per zone (index = ZONES[i].id): the texture key in
// TEXTURE_MANIFEST plus the colours of the cream edge lines, the centre dash
// and the edge shading drawn over it, and a procedural fallback pattern for
// when the image is missing.
export const ROAD_SURFACES = [
  { key: 'road',       name: 'strawberry glaze', edge: '#fffafd', dash: '#ffd23e', shade: 'rgba(150,50,95,0.22)',  fill: '#ffc9dd', pattern: 'sprinkles' },
  { key: 'roadCookie', name: 'cookie',           edge: '#fff3dc', dash: '#ff5f9e', shade: 'rgba(110,55,15,0.26)',  fill: '#e8b96c', pattern: 'chips' },
  { key: 'roadChoco',  name: 'chocolate bar',    edge: '#ffe6c8', dash: '#ffd23e', shade: 'rgba(35,12,4,0.30)',    fill: '#7a4526', pattern: 'bar' },
  { key: 'roadCream',  name: 'vanilla frosting', edge: '#ff9fc9', dash: '#ff5f9e', shade: 'rgba(200,120,170,0.18)', fill: '#fff6f0', pattern: 'dots' },
  { key: 'roadWaffle', name: 'waffle',           edge: '#fff3dc', dash: '#ff4f96', shade: 'rgba(120,70,20,0.26)',  fill: '#f0b85c', pattern: 'waffle' },
  // The crystal candy grotto's own surface: frosted sugar with facets.
  { key: 'roadCrystal', name: 'sugar crystal',   edge: '#efe6ff', dash: '#a98bf0', shade: 'rgba(58,32,120,0.30)',  fill: '#cfe0ff', pattern: 'crystal' },
];

// Builds the road strip map for one surface. With `image` the band is the
// generated surface art; without it a procedural pattern is drawn so the look
// degrades gracefully offline. x = ALONG the track (1 tile = ROAD_TILE_M m,
// mirrored repeat), y = ACROSS (white margins → curbs keep vertex colours).
function roadTexture(image, surface = ROAD_SURFACES[0]) {
  const W = 1024, H = 1024;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, W, H); // neutral outside the band -> curbs keep vertex colours
  const y0 = Math.round(ROAD_BAND[0] * H), y1 = Math.round(ROAD_BAND[1] * H);
  const bandH = y1 - y0;

  if (image && image.width && image.height) {
    // 1:1 texels: the source width spans one tile along the track, the band
    // takes the vertical centre of the square tile (no stretching).
    const sh = Math.min(image.height, Math.round(image.height * (bandH / W)));
    const sy = Math.round((image.height - sh) / 2);
    g.drawImage(image, 0, sy, image.width, sh, 0, y0, W, bandH);
  } else {
    g.fillStyle = surface.fill;
    g.fillRect(0, y0, W, bandH);
    const rnd = (() => { let t = 97; return () => (t = (t * 16807) % 2147483647) / 2147483647; })();
    if (surface.pattern === 'sprinkles') {
      // strawberry road band — candy sprinkles + sugar glitter (tile every 12 m)
      const conf = ['#ff6b81', '#ffd166', '#6bd96b', '#56c8ff', '#c86bff', '#ff8ad0', '#fff3b0'];
      for (let i = 0; i < 560; i++) {
        const x = rnd() * W, y = y0 + 30 + rnd() * (bandH - 60);
        g.save(); g.translate(x, y); g.rotate((rnd() - 0.5) * 0.7);
        g.fillStyle = conf[i % conf.length]; g.globalAlpha = 0.92;
        g.beginPath(); g.roundRect(-11, -4, 22, 8, 4); g.fill();
        g.restore();
      }
      g.globalAlpha = 1;
      for (let i = 0; i < 420; i++) {
        g.fillStyle = 'rgba(255,255,255,0.85)';
        g.beginPath(); g.arc(rnd() * W, y0 + rnd() * bandH, 2 + rnd() * 3, 0, Math.PI * 2); g.fill();
      }
    } else if (surface.pattern === 'chips') {
      for (let i = 0; i < 160; i++) {
        g.fillStyle = i % 5 ? '#4a2a16' : '#d9a559';
        g.beginPath(); g.ellipse(rnd() * W, y0 + 20 + rnd() * (bandH - 40), 14 + rnd() * 10, 10 + rnd() * 8, rnd() * 3, 0, Math.PI * 2); g.fill();
      }
    } else if (surface.pattern === 'bar' || surface.pattern === 'waffle') {
      // segment grid: dark grooves (chocolate) or lighter ridges (waffle)
      const cell = surface.pattern === 'bar' ? 170 : 110;
      g.strokeStyle = surface.pattern === 'bar' ? 'rgba(40,15,5,0.55)' : 'rgba(255,235,190,0.55)';
      g.lineWidth = surface.pattern === 'bar' ? 16 : 10;
      g.lineCap = 'round';
      for (let x = cell / 2; x < W; x += cell) { g.beginPath(); g.moveTo(x, y0 + 8); g.lineTo(x, y1 - 8); g.stroke(); }
      for (let y = y0 + cell / 2; y < y1; y += cell) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    } else if (surface.pattern === 'crystal') {
      // frost: angular facets of pale blue and lilac plus a few sparkles
      for (let i = 0; i < 240; i++) {
        const x = rnd() * W, y = y0 + rnd() * bandH, s2 = 26 + rnd() * 44;
        g.fillStyle = ['rgba(255,255,255,0.55)', 'rgba(196,220,255,0.5)', 'rgba(216,196,255,0.5)', 'rgba(176,204,255,0.45)'][i % 4];
        g.beginPath();
        g.moveTo(x, y - s2); g.lineTo(x + s2 * .8, y); g.lineTo(x, y + s2); g.lineTo(x - s2 * .8, y);
        g.closePath(); g.fill();
      }
      for (let i = 0; i < 150; i++) {
        g.fillStyle = 'rgba(255,255,255,0.9)';
        g.beginPath(); g.arc(rnd() * W, y0 + rnd() * bandH, 1.5 + rnd() * 2.5, 0, Math.PI * 2); g.fill();
      }
    } else if (surface.pattern === 'dots') {
      const pastel = ['#ffd6e8', '#d8f2ff', '#fff2c8', '#e2d2ff', '#d6f5e3'];
      for (let i = 0; i < 260; i++) {
        g.fillStyle = pastel[i % pastel.length];
        g.beginPath(); g.arc(rnd() * W, y0 + 16 + rnd() * (bandH - 32), 7 + rnd() * 9, 0, Math.PI * 2); g.fill();
      }
    }
  }

  // soft depth shading just inside both road edges (runs ALONG the road)
  const shadeY = (a, b) => {
    const gr = g.createLinearGradient(0, a, 0, b);
    gr.addColorStop(0, surface.shade);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, Math.min(a, b), W, Math.abs(b - a));
  };
  shadeY(y0, y0 + 250);
  shadeY(y1, y1 - 250);
  // thick cream border lines along both road edges (~0.35 m)
  g.fillStyle = surface.edge;
  g.fillRect(0, y0 - 10, W, 36);
  g.fillRect(0, y1 - 26, W, 36);
  // candy dash down the middle — centred in the tile so the mirrored
  // repeat keeps the dashes evenly spaced (one per tile)
  g.fillStyle = surface.dash;
  g.beginPath();
  g.roundRect(W / 2 - 145, (y0 + y1) / 2 - 48, 290, 96, 40);
  g.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.MirroredRepeatWrapping; // seamless along the track
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function checkerTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const n = 8, s = 128 / n;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    g.fillStyle = (x + y) % 2 ? '#6b3f2a' : '#fff6ec'; // chocolate & cream
    g.fillRect(x * s, y * s, s, s);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createTrack(scene, TEX = {}) {
  const { curve: reference, baseLength, fromBaseDistance, cakeSection } = buildCourse();
  const routes = createRoutes(reference, fromBaseDistance), curve = routes.curve;
  const length = curve.getLength();
  const zones = ZONES.map((z) => ({ ...z,
    u0: fromBaseDistance(z.u0 * baseLength) / length,
    u1: fromBaseDistance(z.u1 * baseLength) / length,
  }));
  const zoneAt = (u) => zones.find((z) => u >= z.u0 && u < z.u1) || zones[zones.length - 1];
  const isCakeSection = (s) => s >= cakeSection.deckStart && s <= cakeSection.deckEnd;
  const halfW = TUNING.roadHalfWidth;

  // Include graph and zone boundaries exactly; a fork must not start midway
  // through an old road quad (that leaves a crack or a hidden third road).
  const steps = Math.max(240, Math.ceil(length / 1.4));
  const stations = [...new Set([...Array.from({ length: steps + 1 }, (_, i) => i / steps * length),
    ...routes.forks.flatMap((f) => [f.s0, f.s1]), ...zones.flatMap((z) => [z.u0, z.u1]).filter((u) => u >= 0 && u <= 1).map((u) => u * length)])].sort((a, b) => a - b);
  const SAMPLES = stations.length - 1;
  const centers = [], tangents = [], rights = [];
  for (const s of stations) {
    const p = routes.point(s), t = routes.tangent(s).normalize();
    centers.push(p); tangents.push(t); rights.push(new THREE.Vector3().crossVectors(t, UP).normalize());
  }
  const allSamples = [...centers], samplePaths = [centers];
  for (const f of routes.forks) for (const b of f.branches) {
    const n = Math.ceil(b.length / 1.4), path = Array.from({ length: n + 1 }, (_, i) => b.curve.getPointAt(i / n));
    allSamples.push(...path); samplePaths.push(path);
  }

  // ---- Road ribbon (road band + rainbow curbs) and grass shoulders ----
  // Across-profile offsets (meters) and heights relative to road plane.
  // The curb is a 6-band RAINBOW ribbon hugging both road edges (reference
  // look): vivid longitudinal stripes from the road edge outward —
  // red → orange → yellow → green → blue → violet.
  const RAINBOW = ['#ff4d6d', '#ff9f43', '#ffd93d', '#6bd96b', '#56c8ff', '#a06bff'].map((h) => new THREE.Color(h));
  const profile = [
    { off: -22.0, dy: -3.1, kind: 'grass' },
    { off: -13.0, dy: -1.35, kind: 'grass' },
    { off: -7.6, dy: -0.32, kind: 'grass' },
    { off: -6.62, dy: -0.075, kind: 'curb', band: 5 },
    { off: -6.29, dy: -0.06, kind: 'curb', band: 4 },
    { off: -5.96, dy: -0.045, kind: 'curb', band: 3 },
    { off: -5.63, dy: -0.03, kind: 'curb', band: 2 },
    { off: -5.30, dy: -0.015, kind: 'curb', band: 1 },
    { off: -4.42, dy: 0.0, kind: 'road' },
    { off: 4.42, dy: 0.0, kind: 'road' },
    { off: 5.30, dy: -0.015, kind: 'curb', band: 1 },
    { off: 5.63, dy: -0.03, kind: 'curb', band: 2 },
    { off: 5.96, dy: -0.045, kind: 'curb', band: 3 },
    { off: 6.29, dy: -0.06, kind: 'curb', band: 4 },
    { off: 6.62, dy: -0.075, kind: 'curb', band: 5 },
    { off: 7.6, dy: -0.32, kind: 'grass' },
    { off: 13.0, dy: -1.35, kind: 'grass' },
    { off: 22.0, dy: -3.1, kind: 'grass' },
  ];
  // profile indices: road mesh = outer curb .. road .. outer curb,
  // shoulders = the grass points on each side (sharing the outer curb edge)
  const K_CURB_L = 3, K_ROAD_L = 8, K_ROAD_R = 9, K_CURB_R = 14, K_LAST = profile.length - 1;
  const grassEdge = new THREE.Color('#b8e6a0');
  const hasMeadow = !!TEX.meadow;
  const white = new THREE.Color('#ffffff');

  const vertexColor = (u, k) => {
    const pr = profile[k];
    if (pr.kind === 'curb') return RAINBOW[pr.band].clone();
    if (pr.kind === 'road') return white.clone();
    // candy grass with zone tint, fading to a soft universal green-pink at distance
    const zc = zoneAt(THREE.MathUtils.clamp(u, 0, 1));
    const col = new THREE.Color(zc.fog).lerp(new THREE.Color('#9fe3a8'), 0.62); // soft mint field — the pink road pops against it
    const away = (Math.abs(pr.off) - 7.6) / 14.4;
    col.lerp(grassEdge, away * 0.35);
    // the meadow map carries the mint detail now: keep the tint light so the
    // multiplied result stays as bright as the old flat shoulder
    if (hasMeadow) col.lerp(white, 0.3);
    return col;
  };

  // across-texture coordinate for the road mesh: curbs squeezed into the
  // white margins, the road band spread over ROAD_BAND of the map
  const roadV = (k) => {
    if (k <= 7) return (ROAD_BAND[0] - 0.04) * ((k - K_CURB_L) / (7 - K_CURB_L));
    if (k === K_ROAD_L) return ROAD_BAND[0];
    if (k === K_ROAD_R) return ROAD_BAND[1];
    return (ROAD_BAND[1] + 0.04) + (1 - ROAD_BAND[1] - 0.04) * ((k - 10) / (K_CURB_R - 10));
  };

  // ---- Pseudo road beyond both ends (run-offs) ----
  // The course is open, so without these the ribbon stopped dead under the
  // START banner and right after FINISH — a cliff edge in the first intro
  // frames and on the whole final straight. Two gently bending run-offs
  // continue the same profile far into the fog; getPose() extrapolates along
  // them so the chase camera behind the start and props placed past the
  // lines sit on real road.
  const EXT_PRE = 260, EXT_POST = 520, EXT_STEP = 2.8;
  const buildRunoff = (p0, t0, outward, lengthM, bendRad) => {
    // walk outward from the end point; heading drifts quadratically so the
    // tangent is continuous at the join and the road curls away later
    const n = Math.round(lengthM / EXT_STEP);
    const h0 = Math.atan2(t0.x * outward, t0.z * outward);
    const pts = [p0.clone()];
    let slope = t0.y * outward;
    for (let i = 1; i <= n; i++) {
      const d = i * EXT_STEP;
      const h = h0 + bendRad * (d / lengthM) * (d / lengthM);
      slope *= Math.exp(-EXT_STEP / 70); // level out over ~70 m
      const prev = pts[i - 1];
      pts.push(new THREE.Vector3(prev.x + Math.sin(h) * EXT_STEP, prev.y + slope * EXT_STEP, prev.z + Math.cos(h) * EXT_STEP));
    }
    // store in increasing-s order (tangent = direction of travel)
    if (outward < 0) pts.reverse();
    const cs = [], ts = [], rs = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const t = b.clone().sub(a).normalize();
      cs.push(pts[i]); ts.push(t); rs.push(new THREE.Vector3().crossVectors(t, UP).normalize());
    }
    return { centers: cs, tangents: ts, rights: rs, n: pts.length - 1 };
  };
  const preRun = buildRunoff(centers[0], tangents[0], -1, EXT_PRE, -0.55);     // behind the start, curls left
  const postRun = buildRunoff(centers[SAMPLES], tangents[SAMPLES], 1, EXT_POST, 0.5); // past the finish, curls right

  // sample sources for the strip builder: the course itself and the two run-offs
  const mainSrc = { centers, rights, n: SAMPLES, uAt: (i) => stations[i] / length, sAt: (i) => stations[i] };
  const preSrc = { centers: preRun.centers, rights: preRun.rights, n: preRun.n, uAt: () => 0, sAt: (i) => (i - preRun.n) * EXT_STEP };
  const postSrc = { centers: postRun.centers, rights: postRun.rights, n: postRun.n, uAt: () => 1, sAt: (i) => length + i * EXT_STEP };

  // Build one quad strip over profile indices [kFrom, kTo] into shared arrays.
  // river valley under the bridge: 0 = normal embankment, 1 = dipped to the
  // river floor (flat around the river, smooth slopes up to ±valleyHalf)
  const valleyDip = (sM) => {
    const d = Math.abs(sM - fromBaseDistance(BRIDGE.s));
    const a = BRIDGE.riverHalf + 2, b = BRIDGE.valleyHalf;
    if (d <= a) return 1;
    if (d >= b) return 0;
    const x = (d - a) / (b - a);
    return 1 - x * x * (3 - 2 * x);
  };
  const buildStrip = (arrays, kFrom, kTo, uvFn, iFrom = 0, iTo = SAMPLES, src = mainSrc) => {
    const { pos, col, uv, idx } = arrays;
    const base = pos.length / 3;
    const n = kTo - kFrom + 1;
    const inValley = [];
    for (let i = iFrom; i <= iTo; i++) {
      const u = src.uAt(i), sM = src.sAt(i);
      const c = src.centers[i], right = src.rights[i];
      const dip = valleyDip(sM);
      inValley.push(dip > 0);
      for (let k = kFrom; k <= kTo; k++) {
        const pr = profile[k];
        let y = c.y + pr.dy + (pr.kind === 'road' ? 0.02 : 0);
        if (pr.kind === 'grass' && dip > 0) y = THREE.MathUtils.lerp(y, BRIDGE.floorY, dip);
        pos.push(c.x + right.x * pr.off, y, c.z + right.z * pr.off);
        const vc = vertexColor(u, k);
        col.push(vc.r, vc.g, vc.b);
        const t = uvFn(u, k, pr, sM);
        uv.push(t[0], t[1]);
      }
    }
    for (let i = 0; i < iTo - iFrom; i++) {
      if (src === mainSrc && routes.at((src.sAt(iFrom + i) + src.sAt(iFrom + i + 1)) / 2)) continue;
      for (let k = 0; k < n - 1; k++) {
        // the curb→grass quad is left out inside the valley: the bridge's
        // spandrel walls stand there and the arch must stay open underneath
        const touchesCurb = profile[kFrom + k].kind === 'curb' || profile[kFrom + k + 1].kind === 'curb';
        const hasGrass = profile[kFrom + k].kind === 'grass' || profile[kFrom + k + 1].kind === 'grass';
        if (touchesCurb && hasGrass && inValley[i] && inValley[i + 1]) continue;
        // The cake roads have a wafer deck, not airborne grass embankments.
        if (hasGrass && isCakeSection((src.sAt(iFrom + i) + src.sAt(iFrom + i + 1)) / 2)) continue;
        const a = base + i * n + k, b = a + n;
        idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  };
  const toGeometry = ({ pos, col, uv, idx }) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  };

  // road + curbs: x = along the track in tiles, y = across (see roadV).
  // One mesh per zone so the surface changes with the scenery: strawberry
  // glaze → cookie → chocolate bar → vanilla frosting → waffle. Neighbouring
  // meshes share their boundary sample row, so there is no gap.
  const roadUv = (u, k, pr, sM) => [sM / ROAD_TILE_M, roadV(k)];
  const roadMeshes = [];
  const sampleIndex = (s) => { const i = stations.findIndex((v) => v >= s - 1e-7); return i < 0 ? SAMPLES : i; };
  const zoneRanges = zones.map((z) => [sampleIndex(Math.max(0, z.u0) * length), sampleIndex(Math.min(1, z.u1) * length)]);
  zoneRanges.forEach(([i0, i1], zi) => {
    if (i1 <= i0) return;
    const surface = ROAD_SURFACES[zi % ROAD_SURFACES.length];
    const arrays = { pos: [], col: [], uv: [], idx: [] };
    buildStrip(arrays, K_CURB_L, K_CURB_R, roadUv, i0, i1);
    const img = TEX[surface.key] ? TEX[surface.key].image : null;
    const mat = new THREE.MeshStandardMaterial({
      map: roadTexture(img, surface), vertexColors: true, roughness: 0.58, metalness: 0.08,
    });
    const mesh = new THREE.Mesh(toGeometry(arrays), mat);
    mesh.receiveShadow = true;
    mesh.name = 'road';
    mesh.userData.surface = surface.key;
    scene.add(mesh);
    roadMeshes.push(mesh);
  });
  // A branch may use a surface no zone uses (the grotto's sugar-crystal road):
  // build that material lazily, once, from the same recipe as a zone road.
  const extraSurfaces = new Map();
  const surfaceMaterial = (key) => {
    const own = roadMeshes.find((m) => m.userData.surface === key);
    if (own) return own.material;
    if (!extraSurfaces.has(key)) {
      const surface = ROAD_SURFACES.find((s) => s.key === key) || ROAD_SURFACES[0];
      const img = TEX[surface.key] ? TEX[surface.key].image : null;
      extraSurfaces.set(key, new THREE.MeshStandardMaterial({ map: roadTexture(img, surface), vertexColors: true, roughness: 0.58, metalness: 0.08 }));
    }
    return extraSurfaces.get(key);
  };
  // Each fork is two visible roads. At the common landings their inner edges
  // are clipped to the SAME seam; as the paths separate the seam opens into
  // an island. No overlapping coplanar ribbons, fake centre road or teleport.
  const forkDecks = new THREE.Group(); forkDecks.name = 'forkDecks'; scene.add(forkDecks);
  const wafer = new THREE.MeshStandardMaterial({ color: '#e7c596', roughness: .86 });
  for (const f of routes.forks) {
    const n = Math.ceil(Math.max(...f.branches.map((b) => b.length)) / 1.15), rows = [];
    for (let i = 0; i <= n; i++) {
      const q = i / n, p = f.branches.map((b) => b.curve.getPointAt(q));
      const r = f.branches.map((b) => new THREE.Vector3().crossVectors(b.curve.getTangentAt(q), UP).normalize());
      // A generous paved shoulder at the fan-in/fan-out keeps the complete
      // soft-wall steering range covered even on the skewed shared seam.
      const width = 6.62 + 1.38 * THREE.MathUtils.smoothstep(q, 0, .08) * (1 - THREE.MathUtils.smoothstep(q, .92, 1));
      const inner = [p[0].clone().addScaledVector(r[0], width), p[1].clone().addScaledVector(r[1], -width)];
      const across = r[0].clone().add(r[1]).normalize();
      const gap = inner[1].clone().sub(inner[0]).dot(across);
      const opening = THREE.MathUtils.smoothstep(gap, 0, 3);
      const seam = inner[0].clone().add(inner[1]).multiplyScalar(.5);
      rows.push({ opening, sides: [
        [p[0].clone().addScaledVector(r[0], -width), seam.clone().lerp(inner[0], opening)],
        [seam.clone().lerp(inner[1], opening), p[1].clone().addScaledVector(r[1], width)],
      ] });
    }
    for (const branch of f.branches) {
      const a = { pos: [], col: [], uv: [], idx: [] }, d = { pos: [], col: [], uv: [], idx: [] };
      const count = K_CURB_R - K_CURB_L + 1;
      for (let i = 0; i <= n; i++) {
        const row = rows[i], [left, right] = row.sides[branch.index];
        for (let k = K_CURB_L; k <= K_CURB_R; k++) {
          const pr = profile[k], innerCurb = branch.index === 0 ? k >= 10 : k <= 7;
          const p = left.clone().lerp(right, (pr.off + 6.62) / 13.24);
          const color = vertexColor((f.s0 + f.span * i / n) / length, k);
          let dy = pr.kind === 'road' ? .02 : pr.dy, v = roadV(k);
          if (innerCurb) { color.lerp(white, 1 - row.opening); dy = THREE.MathUtils.lerp(.02, dy, row.opening); v = THREE.MathUtils.lerp(.5, v, row.opening); }
          a.pos.push(p.x, p.y + dy, p.z); a.col.push(color.r, color.g, color.b); a.uv.push(branch.length * i / n / ROAD_TILE_M, v);
        }
        const across = right.clone().sub(left).normalize();
        const deckLeft = left.clone().addScaledVector(across, -.9 * (branch.index === 1 ? row.opening : 1));
        const deckRight = right.clone().addScaledVector(across, .9 * (branch.index === 0 ? row.opening : 1));
        for (const [p, dy] of [[deckLeft, -.12], [deckRight, -.12], [deckRight, -.85], [deckLeft, -.85]]) {
          d.pos.push(p.x, p.y + dy, p.z); d.col.push(1, 1, 1); d.uv.push(i / 4, dy);
        }
        if (i < n) {
          for (let k = 0; k < count - 1; k++) { const j = i * count + k; a.idx.push(j, j + 1, j + count, j + count, j + 1, j + count + 1); }
          for (let k = 0; k < 4; k++) { const j = i * 4 + k, v = i * 4 + (k + 1) % 4; d.idx.push(j, v, j + 4, v, v + 4, j + 4); }
        }
      }
      const material = surfaceMaterial(branch.surface);
      const road = new THREE.Mesh(toGeometry(a), material); road.name = `fork-road:${f.id}:${branch.id}`;
      road.receiveShadow = true; road.userData.fork = f.id; road.userData.branch = branch.index; road.userData.surface = branch.surface;
      scene.add(road); roadMeshes.push(road); branch.road = road;
      const deck = new THREE.Mesh(toGeometry(d), wafer); deck.name = `fork-deck:${branch.id}`;
      deck.receiveShadow = true; forkDecks.add(deck);
    }
  }

  // Small coplanar landing stitches cover float32 edge-rounding cracks at
  // the exact graph joins. They use the original profile, with only 4 mm of
  // elevation: never a bump or a third drivable route through the island.
  for (const f of routes.forks) for (const s of [f.s0, f.s1]) {
    const ss = [s - .18, s + .18], ps = ss.map((v) => reference.getPointAt(v / length).addScaledVector(UP, .004));
    const rs = ss.map((v) => new THREE.Vector3().crossVectors(reference.getTangentAt(v / length), UP).normalize());
    const source = { centers: ps, rights: rs, n: 1, uAt: (i) => ss[i] / length, sAt: (i) => ss[i] };
    const a = { pos: [], col: [], uv: [], idx: [] }; buildStrip(a, K_CURB_L, K_CURB_R, roadUv, 0, 1, source);
    const m = new THREE.Mesh(toGeometry(a), roadMeshes[zoneAt(s / length).id].material);
    m.name = 'fork-landing'; m.userData.surface = roadMeshes[zoneAt(s / length).id].userData.surface; m.receiveShadow = true; scene.add(m); roadMeshes.push(m);
  }

  // run-off road: same profile, shares the material of the adjoining zone
  const runoffMeshes = [];
  [[preSrc, roadMeshes[0], 'roadRunoffStart'], [postSrc, roadMeshes[ZONES.length - 1], 'roadRunoffFinish']].forEach(([src, twin, name]) => {
    if (!twin) return;
    const arrays = { pos: [], col: [], uv: [], idx: [] };
    buildStrip(arrays, K_CURB_L, K_CURB_R, roadUv, 0, src.n, src);
    const mesh = new THREE.Mesh(toGeometry(arrays), twin.material);
    mesh.receiveShadow = true;
    mesh.name = name;
    mesh.userData.surface = twin.userData.surface;
    scene.add(mesh);
    runoffMeshes.push(mesh);
  });
  // shoulders: world-scale UVs (one meadow tile = MEADOW_TILE_M m both ways)
  // so the sugar-grass detail keeps square texels on the sloping verges
  const MEADOW_TILE_M = 9;
  const grassArrays = { pos: [], col: [], uv: [], idx: [] };
  const grassUv = (u, k, pr, sM) => [pr.off / MEADOW_TILE_M, sM / MEADOW_TILE_M];
  buildStrip(grassArrays, 0, K_CURB_L, grassUv);
  buildStrip(grassArrays, K_CURB_R, K_LAST, grassUv);
  for (const src of [preSrc, postSrc]) {
    buildStrip(grassArrays, 0, K_CURB_L, grassUv, 0, src.n, src);
    buildStrip(grassArrays, K_CURB_R, K_LAST, grassUv, 0, src.n, src);
  }
  const grassGeo = toGeometry(grassArrays);
  const grassMat = hasMeadow
    ? new THREE.MeshStandardMaterial({ map: TEX.meadow, vertexColors: true, roughness: 0.92, metalness: 0.0 })
    : new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.58, metalness: 0.08 });
  const shoulders = new THREE.Mesh(grassGeo, grassMat);
  shoulders.receiveShadow = true;
  shoulders.name = 'shoulders';
  scene.add(shoulders);

  // ---- Start & finish checker strips ----
  // Explicit basis instead of lookAt+rotate chains: plane X = across the road,
  // plane Y = along the tangent (follows the slope), plane Z = road normal (up).
  // (The old lookAt(+UP) then rotateX(-90°) stacked two X-rotations and left the
  // strip standing as a vertical wall along the road.)
  const stripGeo = new THREE.PlaneGeometry(halfW * 2.15, 3.4);
  const stripMat = new THREE.MeshStandardMaterial({ map: checkerTexture(), roughness: 0.6 });
  const roadFrame = (u) => {
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u).normalize();
    const right = new THREE.Vector3().crossVectors(t, UP).normalize();
    const normal = new THREE.Vector3().crossVectors(right, t).normalize();
    return { p, t, right, normal, heading: Math.atan2(t.x, t.z) };
  };
  const mkStrip = (u) => {
    const f = roadFrame(u);
    const m = new THREE.Mesh(stripGeo, stripMat);
    m.position.copy(f.p).addScaledVector(f.normal, 0.045);
    m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(f.right, f.t, f.normal));
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };
  mkStrip(0.0025).name = 'startStrip';
  mkStrip(0.9975).name = 'finishStrip';

  // cream "icing seam" across the road where one surface hands over to the
  // next (zone boundaries) — hides the hard texture cut and reads as a candy
  // bar laid over the join
  const seamGeo = new THREE.PlaneGeometry(halfW * 2.1, 1.1);
  const seamMat = new THREE.MeshStandardMaterial({ color: '#fff6f0', roughness: 0.45 });
  for (const z of zones.slice(1)) {
    const f = roadFrame(z.u0);
    const m = new THREE.Mesh(seamGeo, seamMat);
    m.position.copy(f.p).addScaledVector(f.normal, 0.04);
    m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(f.right, f.t, f.normal));
    m.receiveShadow = true;
    m.name = 'zoneSeam';
    scene.add(m);
  }

  // ---- Start / finish gates (pole pair + banner, facing the oncoming car) ----
  // Each gate is built fresh: cloning a rotated Group re-derives its Euler from
  // the quaternion ([-π, y, -π] for |yaw| > 90°), so a later `rotation.y = …`
  // silently yields yaw (π - y) — that was the "poles not perpendicular" bug.
  const poleGeo = new THREE.CylinderGeometry(0.35, 0.42, 6.4, 12);
  const poleMat = new THREE.MeshStandardMaterial({ color: '#ff5f9e', roughness: 0.35, metalness: 0.15, emissive: '#7a1640', emissiveIntensity: 0.25 });
  const bannerTexture = (text, color) => {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#fff0f6'; g.fillRect(0, 0, 512, 128);
    g.fillStyle = color; g.font = 'bold 84px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, 256, 68);
    for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#ff4f96' : '#ffd166'; g.fillRect(i * 43, 0, 43, 14); g.fillRect(i * 43, 114, 43, 14); }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };
  const makeGate = (u, text, color, name) => {
    const gate = new THREE.Group();
    const poleL = new THREE.Mesh(poleGeo, poleMat); poleL.position.set(-halfW - 1.1, 3.2, 0);
    const poleR = new THREE.Mesh(poleGeo, poleMat); poleR.position.set(halfW + 1.1, 3.2, 0);
    const banner = new THREE.Mesh(new THREE.PlaneGeometry((halfW + 1.1) * 2, 1.8), new THREE.MeshStandardMaterial({ map: bannerTexture(text, color), side: THREE.DoubleSide, roughness: 0.5 }));
    banner.position.set(0, 6.1, 0);
    gate.add(poleL, poleR, banner);
    const f = roadFrame(u);
    gate.position.copy(f.p);
    gate.rotation.set(0, f.heading + Math.PI, 0); // banner front (+Z) looks back down the road at the driver
    gate.traverse((o) => { if (o.isMesh) o.userData.noCollide = true; }); // overhead: car passes under
    gate.name = name;
    scene.add(gate);
    return gate;
  };
  makeGate(0.9975, 'FINISH', '#ff4f96', 'finishArch');
  makeGate(0.0025, 'START', '#7a3cff', 'startArch');

  // ---- Pose helpers ----
  const tmpRight = new THREE.Vector3();
  // pose on a run-off polyline at distance d (m) from its join with the course
  const runoffPose = (run, d, fromStart) => {
    const f = THREE.MathUtils.clamp(d / EXT_STEP, 0, run.n - 1e-6);
    const i = Math.floor(f), k = f - i;
    const idx = fromStart ? [run.n - i, run.n - i - 1] : [i, i + 1]; // pre-run is stored far→start
    const p = run.centers[idx[0]].clone().lerp(run.centers[idx[1]], k);
    const t = run.tangents[idx[0]].clone().lerp(run.tangents[idx[1]], k).normalize();
    return { p, t };
  };

  function getPose(s, lateral = 0, branch) {
    const u = THREE.MathUtils.clamp(s / length, 0, 1);
    let p, t;
    if (s < 0) ({ p, t } = runoffPose(preRun, -s, true));
    else if (s > length) ({ p, t } = runoffPose(postRun, s - length, false));
    else { p = routes.point(s, new THREE.Vector3(), branch); t = routes.tangent(s, new THREE.Vector3(), branch).normalize(); }
    tmpRight.crossVectors(t, UP).normalize();
    const pos = p.clone().addScaledVector(tmpRight, lateral);
    const heading = Math.atan2(t.x, t.z);
    // slope pitch from tangent.y
    const pitch = Math.asin(THREE.MathUtils.clamp(t.y, -1, 1));
    return { pos, tangent: t, right: tmpRight.clone(), heading, pitch, u };
  }

  // bounds for scenery placement
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of allSamples) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  }
  const bounds = {
    minX, maxX, minZ, maxZ,
    center: new THREE.Vector3((minX + maxX) / 2, 0, (minZ + maxZ) / 2),
  };

  // Far ground disc: the generated candy-farm patchwork (assets/textures/
  // fields.webp) or, without it, the old soft radial patchwork gradient.
  const groundTex = TEX.fields || (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(256, 256, 40, 256, 256, 256);
    grd.addColorStop(0, '#c8ecb4');
    grd.addColorStop(0.55, '#b7e4c6');
    grd.addColorStop(1, '#f7cfe3');
    g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
    // big candy-farm fields (soft patches like patchwork countryside)
    const fieldCols = ['#ff9ec9', '#ffd977', '#8fe3b0', '#9fd8ff', '#c9a3ff', '#ffb28a', '#ff8f9e'];
    for (let i = 0; i < 15; i++) {
      g.globalAlpha = 0.42;
      g.fillStyle = fieldCols[i % fieldCols.length];
      const r = 36 + Math.random() * 85;
      g.beginPath(); g.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
    for (let i = 0; i < 260; i++) {
      g.fillStyle = ['#a8dd8f', '#f2b8d4', '#ffe08a', '#9fd8ff'][i % 4];
      g.globalAlpha = 0.35;
      const r = 3 + Math.random() * 10;
      g.beginPath(); g.arc(Math.random() * 512, Math.random() * 512, r, 0, Math.PI * 2); g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(1100, 64),
    new THREE.MeshStandardMaterial({ map: groundTex, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(bounds.center.x, -3.35, bounds.center.z);
  ground.receiveShadow = true;
  scene.add(ground);

  return {
    curve, length, halfW, getPose, bounds, routes,
    advance: routes.advance,
    getBasePose: (s, lateral = 0) => {
      const p = reference.getPointAt(THREE.MathUtils.clamp(s / length, 0, 1)), t = reference.getTangentAt(THREE.MathUtils.clamp(s / length, 0, 1));
      const r = new THREE.Vector3().crossVectors(t, UP).normalize();
      return { pos: p.addScaledVector(r, lateral), tangent: t, right: r, heading: Math.atan2(t.x, t.z) };
    },
    baseLength, fromBaseDistance, cakeSection, isCakeSection, zones, zoneAt,
    roadMeshes, // one per zone (all named 'road')
    runoffMeshes, // pseudo road before the start / after the finish
    runoff: { pre: EXT_PRE, post: EXT_POST },
    samples: centers, allSamples, samplePaths, forkDecks,
    sampleAt: (s) => getPose(s).pos,
  };
}
