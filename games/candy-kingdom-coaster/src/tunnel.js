// Chocolate Swiss-roll tunnel (cocoa → marshmallow border).
// The road dives through a giant bûche de Noël lying across the course:
//   • outside: a glossy ganache shell swept along the curving road, a piped
//     cream rope along the crest, cream rosettes, strawberries and white
//     chocolate curls on top; both cut faces show the sponge-and-cream spiral
//     with a ring of marquee bulbs around the bore
//   • inside: layered sponge walls (cream bands), glowing rock-candy lanterns
//     on the walls and a twinkling bulb garland under the ceiling. Their light
//     is BAKED into the walls (per-vertex aBake → emissive) so the tunnel
//     costs no extra real-time lights; the only dynamic light is the car's
//     headlight spot (car.js), faded in by darkness(s)
// blocks(x, z) tells world.js where NOT to put props (the whole cake body).
import * as THREE from 'three';
import { TUNNEL } from './config.js';
import { mergeGeometries } from '../vendor/three/jsm/utils/BufferGeometryUtils.js';

const UP = new THREE.Vector3(0, 1, 0);
const smooth = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b);

function rng(seed) {
  let t = seed;
  return () => (t = (t * 16807) % 2147483647) / 2147483647;
}

function canvasTex(W, H, draw, { repeat = true, srgb = true } = {}) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  draw(c.getContext('2d'), W, H);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

// glossy ganache with long drips/streaks running along the roll (u = along)
function ganacheTexture() {
  return canvasTex(512, 256, (g, W, H) => {
    g.fillStyle = '#4a2416';
    g.fillRect(0, 0, W, H);
    const r = rng(41);
    // long streaks along u (horizontal)
    for (let i = 0; i < 90; i++) {
      const y = r() * H, h = 1 + r() * 5;
      g.globalAlpha = 0.18 + r() * 0.3;
      g.fillStyle = ['#2f150b', '#5e301c', '#6e3a22', '#3a1a0e'][i % 4];
      g.beginPath();
      g.moveTo(-10, y);
      for (let x = 0; x <= W + 10; x += 32) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 3);
      g.lineTo(W + 10, y + h); g.lineTo(-10, y + h); g.closePath(); g.fill();
      // wrap so the texture tiles vertically
      if (y + h > H) { g.translate(0, -H); g.fill(); g.translate(0, H); }
    }
    // tiny glossy flecks
    g.globalAlpha = 0.25;
    g.fillStyle = '#8a4c2c';
    for (let i = 0; i < 260; i++) g.fillRect(r() * W, r() * H, 2 + r() * 6, 1);
    g.globalAlpha = 1;
  });
}

// chocolate sponge with cream layers (v = around the bore → horizontal bands)
function spongeTexture() {
  return canvasTex(512, 512, (g, W, H) => {
    g.fillStyle = '#6a3824';
    g.fillRect(0, 0, W, H);
    const r = rng(7);
    // crumb pores
    for (let i = 0; i < 2600; i++) {
      g.globalAlpha = 0.25 + r() * 0.35;
      g.fillStyle = r() < 0.55 ? '#5a2c19' : '#94573a';
      const x = r() * W, y = r() * H, s = 1 + r() * 3.5;
      g.beginPath(); g.ellipse(x, y, s, s * (0.6 + r() * 0.5), r() * 3, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
    // two wavy cream layers (with soft edges), tiled vertically
    const band = (y0, th) => {
      for (const dy of [0, H, -H]) {
        g.fillStyle = 'rgba(255,244,230,0.45)';
        g.beginPath();
        g.moveTo(0, y0 + dy - th * 0.7);
        for (let x = 0; x <= W; x += 16) g.lineTo(x, y0 + dy - th * 0.7 + Math.sin(x * 0.037) * 3);
        for (let x = W; x >= 0; x -= 16) g.lineTo(x, y0 + dy + th * 0.7 + Math.sin(x * 0.029 + 1) * 3);
        g.closePath(); g.fill();
        g.fillStyle = '#e9d6c2';
        g.beginPath();
        g.moveTo(0, y0 + dy - th * 0.5);
        for (let x = 0; x <= W; x += 16) g.lineTo(x, y0 + dy - th * 0.5 + Math.sin(x * 0.037) * 3);
        for (let x = W; x >= 0; x -= 16) g.lineTo(x, y0 + dy + th * 0.5 + Math.sin(x * 0.029 + 1) * 3);
        g.closePath(); g.fill();
      }
    };
    band(H * 0.22, 26);
    band(H * 0.68, 18);
    // a few strawberry jam dots in the cream
    for (let i = 0; i < 28; i++) {
      g.fillStyle = r() < 0.5 ? '#e0405f' : '#c92d4c';
      const y = (r() < 0.5 ? 0.22 : 0.68) * H + (r() - 0.5) * 12;
      g.beginPath(); g.arc(r() * W, y, 3 + r() * 4, 0, Math.PI * 2); g.fill();
    }
  });
}

// cut face of the roll: sponge spiral with a cream swirl, ganache rim.
// The texture is centred on the roll axis; uv = (lat, y) / (2R) + 0.5.
function spiralTexture(holeFrac) {
  return canvasTex(1024, 1024, (g, W) => {
    const c = W / 2, R = W / 2;
    // ganache rim
    g.fillStyle = '#3b1b0f';
    g.beginPath(); g.arc(c, c, R, 0, Math.PI * 2); g.fill();
    // sponge
    g.fillStyle = '#8a4a2c';
    g.beginPath(); g.arc(c, c, R * 0.955, 0, Math.PI * 2); g.fill();
    const r = rng(19);
    for (let i = 0; i < 5200; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * R * 0.95;
      g.globalAlpha = 0.22 + r() * 0.3;
      g.fillStyle = r() < 0.55 ? '#62301b' : '#a5643f';
      g.beginPath(); g.arc(c + Math.cos(a) * d, c + Math.sin(a) * d, 1 + r() * 3.5, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
    // cream spiral from the bore edge to the rim (Archimedean)
    const r0 = holeFrac * R + 6, r1 = R * 0.93, turns = 4.2;
    const path = (w, col) => {
      g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round';
      g.beginPath();
      for (let k = 0; k <= 900; k++) {
        const f = k / 900, a = f * turns * Math.PI * 2 + 0.6;
        const rr = r0 + (r1 - r0) * f;
        const x = c + Math.cos(a) * rr, y = c + Math.sin(a) * rr;
        if (k === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
    };
    path(30, 'rgba(255,240,224,0.5)');
    path(22, '#fff6ea');
    path(5, 'rgba(255,255,255,0.9)');
    // jam dots along the cream
    for (let k = 0; k < 70; k++) {
      const f = r(), a = f * turns * Math.PI * 2 + 0.6, rr = r0 + (r1 - r0) * f;
      g.fillStyle = '#d93a5a';
      g.beginPath(); g.arc(c + Math.cos(a) * rr, c + Math.sin(a) * rr, 3 + r() * 3, 0, Math.PI * 2); g.fill();
    }
  }, { repeat: false });
}

// Lambert material whose emissive is a per-vertex baked light (aBake) times
// the albedo map — the tunnel's lanterns "light" the sponge for free.
function bakedMaterial(map, base) {
  const m = new THREE.MeshLambertMaterial({ map, color: base, emissive: 0xffffff });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 aBake;\nvarying vec3 vBake;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBake = aBake;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBake;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance *= vBake * sampledDiffuseColor.rgb;');
  };
  m.customProgramCacheKey = () => 'tunnelBake';
  return m;
}

export function createTunnel(scene, track, TEX = {}) {
  const T = TUNNEL;
  const group = new THREE.Group();
  group.name = 'tunnel';
  group.userData.noCollide = true; // the road corridor stays clear by design
  scene.add(group);

  // ---- frames along the bore (vertical rings, horizontal right vector) ----
  const STEP = 1;
  const frames = [];
  for (let s = T.s0; s <= T.s1 + 1e-6; s += STEP) {
    const p = track.getPose(s, 0);
    const t = p.tangent.clone(); t.y = 0; t.normalize();
    const right = new THREE.Vector3().crossVectors(t, UP).normalize();
    frames.push({ s, o: p.pos.clone(), t, right });
  }
  const at = (f, lat, dy) => f.o.clone().addScaledVector(f.right, lat).addScaledVector(UP, dy);

  // ---- lamp list (world positions + colours) for the bake and the meshes ----
  const LAMP_COLS = ['#ff7ab8', '#ffd45e', '#7ff0c8', '#a98bff', '#7fd4ff'].map((h) => new THREE.Color(h));
  const lanterns = []; // wall crystals
  {
    let side = 1, k = 0;
    for (let s = T.s0 + 7; s <= T.s1 - 5; s += T.lampStep, side = -side, k++) {
      const f = frames[Math.round((s - T.s0) / STEP)];
      const th = side > 0 ? 0.42 : Math.PI - 0.42;
      const lat = Math.cos(th) * (T.hole - 0.35), dy = T.cy + Math.sin(th) * (T.hole - 0.35);
      lanterns.push({ s, side, f, pos: at(f, lat, dy), col: LAMP_COLS[k % LAMP_COLS.length], th });
    }
  }
  // ceiling garland: catenary between anchors every 11.5 m, bulbs every 2.3 m
  const garland = [];
  const wirePts = [];
  {
    const top = T.cy + T.hole - 0.25;
    const span = 11.5;
    for (let s = T.s0 + 1.5; s <= T.s1 - 1.5; s += 0.5) {
      const f = frames[Math.min(frames.length - 1, Math.round((s - T.s0) / STEP))];
      const ph = ((s - T.s0 - 1.5) % span) / span;
      const sag = 1.35 * 4 * ph * (1 - ph);
      const p = at(f, Math.sin(s * 0.07) * 0.6, top - sag);
      wirePts.push(p);
      if (Math.abs(((s - T.s0 - 1.5) / 2.3) - Math.round((s - T.s0 - 1.5) / 2.3)) < 0.11) {
        garland.push({ pos: p.clone().addScaledVector(UP, -0.18), col: LAMP_COLS[garland.length % LAMP_COLS.length] });
      }
    }
  }

  // ---- bake: lanterns + garland + daylight spilling in at the portals ----
  const DAY = new THREE.Color('#ffe9f2');
  const AMB = new THREE.Color('#3a2a2e');
  const bakeAt = (p, n, s) => {
    const out = AMB.clone().multiplyScalar(0.55);
    const L = new THREE.Vector3();
    for (const l of lanterns) {
      if (Math.abs(l.s - s) > 30) continue;
      L.subVectors(l.pos, p);
      const d2 = L.lengthSq(), d = Math.sqrt(d2);
      const facing = 0.35 + 0.65 * Math.max(0, n.dot(L) / (d || 1));
      const w = 2.1 / (1 + d2 / 9) * facing;
      out.r += l.col.r * w; out.g += l.col.g * w; out.b += l.col.b * w;
    }
    for (const b of garland) {
      if (Math.abs(b.pos.distanceToSquared(p)) > 400) continue;
      L.subVectors(b.pos, p);
      const d2 = L.lengthSq(), d = Math.sqrt(d2);
      const facing = 0.3 + 0.7 * Math.max(0, n.dot(L) / (d || 1));
      const w = 0.38 / (1 + d2 / 3) * facing;
      out.r += b.col.r * w; out.g += b.col.g * w; out.b += b.col.b * w;
    }
    const edge = Math.min(s - T.s0, T.s1 - s);
    const day = Math.exp(-Math.max(0, edge) / 7) * 1.25;
    out.r += DAY.r * day; out.g += DAY.g * day; out.b += DAY.b * day;
    return out;
  };

  // ---- inner bore: floor strips + sponge arch (one swept cross-section) ----
  const thF = Math.asin((T.floorDy - T.cy) / T.hole); // ≈ -0.36 rad
  const latF = Math.cos(thF) * T.hole;
  const sect = []; // { lat, dy, nl, ny, v }
  const pushPt = (lat, dy, nl, ny) => sect.push({ lat, dy, nl, ny });
  pushPt(6.5, T.floorDy, 0, 1);
  pushPt(latF, T.floorDy, 0, 1);
  const ARC = 44;
  for (let i = 0; i <= ARC; i++) {
    const th = thF + (Math.PI - 2 * thF) * (i / ARC);
    pushPt(Math.cos(th) * T.hole, T.cy + Math.sin(th) * T.hole, -Math.cos(th), -Math.sin(th));
  }
  pushPt(-latF, T.floorDy, 0, 1);
  pushPt(-6.5, T.floorDy, 0, 1);
  // v = running length along the cross-section (m)
  let acc = 0;
  sect.forEach((q, i) => {
    if (i) acc += Math.hypot(q.lat - sect[i - 1].lat, q.dy - sect[i - 1].dy);
    q.v = acc;
  });
  {
    const nS = frames.length, nC = sect.length;
    const pos = new Float32Array(nS * nC * 3), nor = new Float32Array(nS * nC * 3);
    const uv = new Float32Array(nS * nC * 2), bake = new Float32Array(nS * nC * 3);
    const n = new THREE.Vector3();
    for (let i = 0; i < nS; i++) {
      const f = frames[i];
      for (let j = 0; j < nC; j++) {
        const q = sect[j], k = i * nC + j;
        const p = at(f, q.lat, q.dy);
        n.copy(f.right).multiplyScalar(q.nl).addScaledVector(UP, q.ny).normalize();
        pos.set([p.x, p.y, p.z], k * 3);
        nor.set([n.x, n.y, n.z], k * 3);
        const isFloor = q.ny === 1 && q.nl === 0;
        uv.set([(f.s - T.s0) / 6, q.v / 9.5], k * 2);
        const b = bakeAt(p, n, f.s);
        if (isFloor) b.multiplyScalar(0.8);
        bake.set([b.r, b.g, b.b], k * 3);
      }
    }
    const idx = [];
    for (let i = 0; i < nS - 1; i++) {
      for (let j = 0; j < nC - 1; j++) {
        const a = i * nC + j, b = a + 1, c = a + nC, d = c + 1;
        idx.push(a, b, c, b, d, c);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setAttribute('aBake', new THREE.BufferAttribute(bake, 3));
    geo.setIndex(idx);
    // winding: make faces point into the bore (towards the normals)
    {
      const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), N = new THREE.Vector3();
      const i0 = idx[3 * 8], i1 = idx[3 * 8 + 1], i2 = idx[3 * 8 + 2]; // an arc quad of ring 0
      A.fromBufferAttribute(geo.attributes.position, i0);
      B.fromBufferAttribute(geo.attributes.position, i1);
      C.fromBufferAttribute(geo.attributes.position, i2);
      N.subVectors(B, A).cross(C.clone().sub(A));
      const vn = new THREE.Vector3().fromBufferAttribute(geo.attributes.normal, i0);
      if (N.dot(vn) < 0) {
        const ix = geo.index.array;
        for (let k = 0; k < ix.length; k += 3) { const tmp = ix[k + 1]; ix[k + 1] = ix[k + 2]; ix[k + 2] = tmp; }
      }
    }
    const spongeTex = spongeTexture();
    const bore = new THREE.Mesh(geo, bakedMaterial(spongeTex, new THREE.Color('#8a6a60')));
    bore.name = 'tunnelBore';
    bore.receiveShadow = true;
    group.add(bore);
  }

  // ---- outer ganache shell (sculpted ridges, buried below the shoulders) ----
  {
    const thG = Math.asin((-3.0 - T.cy) / T.R);
    const NA = 72;
    const nS = frames.length;
    const pos = new Float32Array(nS * (NA + 1) * 3), uv = new Float32Array(nS * (NA + 1) * 2);
    for (let i = 0; i < nS; i++) {
      const f = frames[i];
      for (let j = 0; j <= NA; j++) {
        const th = thG + (Math.PI - 2 * thG) * (j / NA);
        const ridge = 0.22 * Math.sin(th * 9 + f.s * 0.11) + 0.12 * Math.sin(th * 23 - f.s * 0.31);
        const r = T.R + ridge;
        const p = at(f, Math.cos(th) * r, T.cy + Math.sin(th) * r);
        const k = i * (NA + 1) + j;
        pos.set([p.x, p.y, p.z], k * 3);
        uv.set([(f.s - T.s0) / 14, (j / NA) * 3], k * 2);
      }
    }
    const idx = [];
    for (let i = 0; i < nS - 1; i++) {
      for (let j = 0; j < NA; j++) {
        const a = i * (NA + 1) + j, b = a + 1, c = a + NA + 1, d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    // ensure outward normals (centre of the first ring is inside)
    {
      const p = new THREE.Vector3().fromBufferAttribute(geo.attributes.position, Math.round(NA / 2));
      const n = new THREE.Vector3().fromBufferAttribute(geo.attributes.normal, Math.round(NA / 2));
      const c = at(frames[0], 0, T.cy);
      if (n.dot(p.clone().sub(c)) < 0) {
        const ix = geo.index.array;
        for (let k = 0; k < ix.length; k += 3) { const tmp = ix[k + 1]; ix[k + 1] = ix[k + 2]; ix[k + 2] = tmp; }
        geo.computeVertexNormals();
      }
    }
    const shell = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      map: ganacheTexture(), color: '#ffffff', roughness: 0.3, metalness: 0.08,
    }));
    shell.name = 'tunnelShell';
    shell.castShadow = true;
    shell.receiveShadow = true;
    group.add(shell);
  }

  // ---- portal faces: spiral slices with the bore cut out ----
  const portalBulbs = [];
  {
    const thG = Math.asin((-3.0 - T.cy) / T.R);
    const spiral = spiralTexture(T.hole / T.R);
    const faceMat = new THREE.MeshStandardMaterial({ map: spiral, roughness: 0.75 });
    const mkShape = () => {
      const sh = new THREE.Shape();
      const N = 96;
      for (let i = 0; i <= N; i++) {
        const th = thG + (Math.PI - 2 * thG) * (i / N);
        const x = Math.cos(th) * (T.R + 0.05), y = T.cy + Math.sin(th) * (T.R + 0.05);
        if (i === 0) sh.moveTo(x, y); else sh.lineTo(x, y);
      }
      sh.closePath();
      const hole = new THREE.Path();
      hole.moveTo(latF, T.floorDy);
      for (let i = 1; i < ARC; i++) {
        const th = thF + (Math.PI - 2 * thF) * (i / ARC);
        hole.lineTo(Math.cos(th) * T.hole, T.cy + Math.sin(th) * T.hole);
      }
      hole.closePath();
      sh.holes.push(hole);
      return sh;
    };
    const base = new THREE.ShapeGeometry(mkShape(), 1);
    {
      const p = base.attributes.position, uv = base.attributes.uv;
      for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / (2 * T.R) + 0.5, (p.getY(i) - T.cy) / (2 * T.R) + 0.5);
    }
    for (const end of [0, 1]) {
      const f = end ? frames[frames.length - 1] : frames[0];
      const g = base.clone();
      // local x → ±right, y → up, z → ∓tangent (outward)
      const xr = end ? f.right.clone().negate() : f.right.clone();
      const zo = end ? f.t.clone() : f.t.clone().negate();
      const m = new THREE.Matrix4().makeBasis(xr, UP, zo).setPosition(f.o.clone().addScaledVector(zo, 0.02));
      g.applyMatrix4(m);
      const face = new THREE.Mesh(g, faceMat);
      face.name = end ? 'tunnelExit' : 'tunnelEntrance';
      face.receiveShadow = true;
      group.add(face);
      // marquee bulbs around the bore and a chocolate lip
      const N = 30;
      for (let i = 0; i <= N; i++) {
        const th = thF + 0.05 + (Math.PI - 2 * thF - 0.1) * (i / N);
        const lx = Math.cos(th) * (T.hole + 0.75), ly = T.cy + Math.sin(th) * (T.hole + 0.75);
        portalBulbs.push(new THREE.Vector3(lx, ly, 0.22).applyMatrix4(m));
      }
      const lipPts = [];
      for (let i = 0; i <= ARC; i++) {
        const th = thF + (Math.PI - 2 * thF) * (i / ARC);
        lipPts.push(new THREE.Vector3(Math.cos(th) * (T.hole + 0.12), T.cy + Math.sin(th) * (T.hole + 0.12), 0.12).applyMatrix4(m));
      }
      const lip = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lipPts), 90, 0.3, 8, false),
        new THREE.MeshStandardMaterial({ color: '#3a1a0d', roughness: 0.28, metalness: 0.1 })
      );
      lip.castShadow = true;
      group.add(lip);
    }
  }

  // ---- crest dressing: piped cream rope, rosettes, strawberries, curls ----
  const rnd = rng(1234);
  const dressing = new THREE.Group();
  group.add(dressing);
  {
    const crestTop = (f, th, rOff = 0) => at(f, Math.cos(th) * (T.R + rOff), T.cy + Math.sin(th) * (T.R + rOff));
    // piped cream rope (twisted tube) along the crest
    const rope = [];
    for (const f of frames) rope.push(crestTop(f, Math.PI / 2 + 0.03 * Math.sin(f.s * 0.2), 0.1));
    const ropeGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rope), frames.length * 3, 0.55, 10, false);
    {
      // fake piping ridges: push vertices along the normal with a twisted sine
      const p = ropeGeo.attributes.position, n = ropeGeo.attributes.normal;
      const segs = frames.length * 3, radial = 10;
      for (let i = 0; i <= segs; i++) {
        for (let j = 0; j <= radial; j++) {
          const k = i * (radial + 1) + j;
          const w = 0.12 * Math.sin(j / radial * Math.PI * 2 * 5 + i * 0.9);
          p.setXYZ(k, p.getX(k) + n.getX(k) * w, p.getY(k) + n.getY(k) * w, p.getZ(k) + n.getZ(k) * w);
        }
      }
      ropeGeo.computeVertexNormals();
    }
    const cream = new THREE.MeshStandardMaterial({ color: '#fff7ee', roughness: 0.55 });
    const ropeMesh = new THREE.Mesh(ropeGeo, cream);
    ropeMesh.castShadow = true;
    dressing.add(ropeMesh);

    // rosette: swirled lathe dollop
    const rosetteGeo = (() => {
      const pts = [];
      for (let i = 0; i <= 14; i++) {
        const t = i / 14;
        pts.push(new THREE.Vector2(Math.max(0.001, 0.95 * Math.sin((1 - t) * Math.PI * 0.5) * (1 - 0.1 * Math.sin(t * 18))), t * 1.4));
      }
      const g = new THREE.LatheGeometry(pts, 24);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
        const a = Math.atan2(z, x), r = Math.hypot(x, z);
        const rr = r * (1 + 0.16 * Math.sin(a * 8 + y * 5));
        const aa = a + y * 1.2;
        p.setXYZ(i, Math.cos(aa) * rr, y, Math.sin(aa) * rr);
      }
      g.computeVertexNormals();
      return g;
    })();
    const berryGeo = (() => {
      const g = new THREE.SphereGeometry(0.62, 16, 12);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i);
        const k = y < 0 ? 1 - 0.45 * (-y / 0.62) : 1;
        p.setXYZ(i, p.getX(i) * k, y * 1.25, p.getZ(i) * k);
      }
      g.computeVertexNormals();
      return g;
    })();
    const leafGeo = (() => {
      const g = new THREE.ConeGeometry(0.62, 0.22, 5, 1);
      g.translate(0, 0.86, 0);
      return g;
    })();
    const curlGeo = new THREE.TorusGeometry(0.42, 0.13, 6, 18, Math.PI * 1.6);
    const items = { rosette: [], berry: [], curl: [] };
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
    for (let s = T.s0 + 3; s <= T.s1 - 3; s += 3.2) {
      const f = frames[Math.round((s - T.s0) / STEP)];
      for (const side of [-1, 1]) {
        const th = Math.PI / 2 + side * (0.17 + rnd() * 0.05);
        const p = at(f, Math.cos(th) * (T.R - 0.15), T.cy + Math.sin(th) * (T.R - 0.15));
        const nrm = p.clone().sub(at(f, 0, T.cy)).normalize();
        q.setFromUnitVectors(UP, nrm);
        const kind = ((Math.round(s / 3.2) + (side > 0 ? 1 : 0)) % 3 === 0) ? 'berry' : 'rosette';
        const k = kind === 'berry' ? 0.9 + rnd() * 0.3 : 0.85 + rnd() * 0.35;
        sc.set(k, k, k);
        items[kind].push(m4.clone().compose(p, q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(UP, rnd() * 6.28)), sc.clone()));
      }
      if (rnd() < 0.6) {
        const th = Math.PI / 2 + (rnd() - 0.5) * 0.9;
        const p = at(f, Math.cos(th) * (T.R + 0.1), T.cy + Math.sin(th) * (T.R + 0.1));
        q.setFromEuler(new THREE.Euler(rnd() * 6, rnd() * 6, rnd() * 6));
        items.curl.push(m4.clone().compose(p, q.clone(), sc.set(1, 1, 1).clone()));
      }
    }
    const inst = (geo, mat, list, name) => {
      const im = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((m, i) => im.setMatrixAt(i, m));
      im.castShadow = true;
      im.name = name;
      im.computeBoundingSphere();
      dressing.add(im);
      return im;
    };
    inst(rosetteGeo, cream, items.rosette, 'tunnelRosettes');
    inst(berryGeo, new THREE.MeshStandardMaterial({ color: '#ff2d55', roughness: 0.32 }), items.berry, 'tunnelBerries');
    inst(leafGeo, new THREE.MeshStandardMaterial({ color: '#3fbf5a', roughness: 0.6 }), items.berry, 'tunnelLeaves');
    inst(curlGeo, new THREE.MeshStandardMaterial({ color: '#fff1d6', roughness: 0.4 }), items.curl, 'tunnelCurls');
  }

  // ---- glowing things: lanterns, garland bulbs, portal marquee ----
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const hdr = (c, k) => c.clone().multiplyScalar(k);
  {
    // rock-candy crystal cluster (3 stretched octahedra) on a chocolate bracket
    const crystal = mergeGeometries([
      new THREE.OctahedronGeometry(0.42, 0).scale(0.8, 1.9, 0.8),
      new THREE.OctahedronGeometry(0.3, 0).scale(0.8, 1.6, 0.8).rotateZ(0.5).translate(0.28, -0.12, 0.05),
      new THREE.OctahedronGeometry(0.28, 0).scale(0.8, 1.5, 0.8).rotateZ(-0.55).rotateX(0.3).translate(-0.25, -0.16, -0.06),
    ]);
    const im = new THREE.InstancedMesh(crystal, glowMat, lanterns.length);
    const halo = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1.1, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
      lanterns.length
    );
    const bracket = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.55, 0.35, 0.3, 10),
      new THREE.MeshStandardMaterial({ color: '#3a1a0d', roughness: 0.35 }),
      lanterns.length
    );
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
    lanterns.forEach((l, i) => {
      const inward = l.f.right.clone().multiplyScalar(-Math.cos(l.th)).addScaledVector(UP, -Math.sin(l.th)).normalize();
      q.setFromUnitVectors(UP, inward.clone().lerp(UP, 0.5).normalize());
      im.setMatrixAt(i, m4.compose(l.pos.clone().addScaledVector(inward, 0.55), q, new THREE.Vector3(1, 1, 1)));
      im.setColorAt(i, hdr(l.col, 2.6));
      halo.setMatrixAt(i, m4.compose(l.pos.clone().addScaledVector(inward, 0.6), q, new THREE.Vector3(1, 1, 1)));
      halo.setColorAt(i, l.col);
      bracket.setMatrixAt(i, m4.compose(l.pos.clone().addScaledVector(inward, 0.05), new THREE.Quaternion().setFromUnitVectors(UP, inward), new THREE.Vector3(1, 1, 1)));
    });
    im.name = 'tunnelLanterns'; halo.name = 'tunnelHalos';
    [im, halo, bracket].forEach((o) => { o.computeBoundingSphere(); group.add(o); });
  }
  const bulbGeo = new THREE.SphereGeometry(0.16, 10, 8);
  const garlandIM = new THREE.InstancedMesh(bulbGeo, glowMat, garland.length);
  {
    const m4 = new THREE.Matrix4();
    garland.forEach((b, i) => { garlandIM.setMatrixAt(i, m4.makeTranslation(b.pos.x, b.pos.y, b.pos.z)); garlandIM.setColorAt(i, hdr(b.col, 2.2)); });
    garlandIM.name = 'tunnelGarland';
    garlandIM.computeBoundingSphere();
    group.add(garlandIM);
    const wire = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wirePts), wirePts.length, 0.035, 4, false),
      new THREE.MeshBasicMaterial({ color: '#2a1610' })
    );
    group.add(wire);
  }
  const marqueeIM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 10, 8), glowMat, portalBulbs.length);
  {
    const m4 = new THREE.Matrix4();
    const warm = new THREE.Color('#ffd27a');
    portalBulbs.forEach((p, i) => { marqueeIM.setMatrixAt(i, m4.makeTranslation(p.x, p.y, p.z)); marqueeIM.setColorAt(i, hdr(warm, 2.4)); });
    marqueeIM.name = 'tunnelMarquee';
    marqueeIM.computeBoundingSphere();
    group.add(marqueeIM);
  }

  // ---- queries ----
  const box = new THREE.Box3();
  frames.forEach((f) => box.expandByPoint(f.o));
  box.expandByScalar(T.R + 3);
  const BLOCK_R = T.R + 2.5;
  function blocks(x, z) {
    if (x < box.min.x || x > box.max.x || z < box.min.z || z > box.max.z) return false;
    let best = Infinity, bi = 0;
    for (let i = 0; i < frames.length; i += 2) {
      const f = frames[i];
      const d = (x - f.o.x) ** 2 + (z - f.o.z) ** 2;
      if (d < best) { best = d; bi = i; }
    }
    const f = frames[bi];
    const along = (x - f.o.x) * f.t.x + (z - f.o.z) * f.t.z;
    if ((bi === 0 && along < -4) || (bi >= frames.length - 2 && along > 4)) return false;
    const lat = Math.abs((x - f.o.x) * f.right.x + (z - f.o.z) * f.right.z);
    return lat < BLOCK_R;
  }
  // 0 outside → 1 deep inside. The chase camera trails ~6 m behind the car,
  // so the fade starts just before the car reaches the portal.
  function darkness(s) {
    return smooth(T.s0 - 3, T.s0 + 11, s) * (1 - smooth(T.s1 - 15, T.s1 + 2, s));
  }

  // twinkle: a slow chase along the garland + gentle marquee shimmer
  const tmpC = new THREE.Color();
  function update(dt, t, carS = 0) {
    if (Math.abs(carS - (T.s0 + T.s1) / 2) > 260) return;
    for (let i = 0; i < garland.length; i++) {
      const w = 0.55 + 0.45 * Math.max(0, Math.sin(t * 3.2 - i * 0.55));
      garlandIM.setColorAt(i, tmpC.copy(garland[i].col).multiplyScalar(2.4 * w));
    }
    garlandIM.instanceColor.needsUpdate = true;
    const warm = 2.0;
    for (let i = 0; i < portalBulbs.length; i++) {
      const on = ((i + Math.floor(t * 5)) % 3) !== 0;
      marqueeIM.setColorAt(i, tmpC.setRGB(1, 0.82, 0.48).multiplyScalar(on ? warm * 1.3 : warm * 0.35));
    }
    marqueeIM.instanceColor.needsUpdate = true;
  }

  return { group, blocks, darkness, update, range: [T.s0, T.s1], info: () => ({ lanterns: lanterns.length, bulbs: garland.length, marquee: portalBulbs.length }) };
}
