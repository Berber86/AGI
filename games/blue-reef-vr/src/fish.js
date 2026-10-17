// Рыбы рифа. Тело строится параметрически (профиль «длина/высота/ширина» + плавники),
// окрас — шейдером, движение — инстансами: одна species = один draw call.
import * as THREE from 'three';
import { mulberry32 } from './noise.js';
import { WORLD } from './config.js';
import { patchUnderwater } from './shading.js';
import { seabedHeight } from './seabed.js';

const RADIAL = 12; // сечений по окружности тела

// Профиль тела: список [t, ширина, высота] от хвоста (t=0) к носу (t=1).
const PROFILE_DEFAULT = [
  [0.00, 0.10, 0.12], [0.06, 0.20, 0.26], [0.16, 0.44, 0.58], [0.30, 0.72, 0.86],
  [0.46, 0.94, 1.00], [0.62, 1.00, 0.96], [0.76, 0.88, 0.78], [0.88, 0.56, 0.48],
  [0.96, 0.24, 0.24], [1.00, 0.04, 0.06],
];

function sampleProfile(p, t, index) {
  for (let i = 1; i < p.length; i++) {
    if (t <= p[i][0]) {
      const [t0, w0, h0] = p[i - 1];
      const [t1, w1, h1] = p[i];
      const k = (t - t0) / Math.max(1e-6, t1 - t0);
      return index === 1 ? w0 + (w1 - w0) * k : h0 + (h1 - h0) * k;
    }
  }
  return index === 1 ? p[p.length - 1][1] : p[p.length - 1][2];
}

// Плоский плавник из 2D-полигона в плоскости (z, y) — трёхмерные точки x=0.
function finGeometry(points, x = 0) {
  const geo = new THREE.BufferGeometry();
  const verts = [];
  for (let i = 1; i < points.length - 1; i++) {
    verts.push(...points[0], ...points[i], ...points[i + 1]);
  }
  const arr = new Float32Array(verts.length);
  for (let i = 0; i < verts.length; i += 3) {
    arr[i] = x; arr[i + 1] = verts[i + 1]; arr[i + 2] = verts[i];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  geo.computeVertexNormals();
  return geo;
}

function buildBody(spec) {
  const profile = spec.profile || PROFILE_DEFAULT;
  const segs = spec.segments || 16;
  const positions = [];
  const indices = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const w = sampleProfile(profile, t, 1) * spec.width;
    const h = sampleProfile(profile, t, 2) * spec.depth;
    const z = (t - 0.5); // нос +0.5, хвост -0.5
    // Смещение «позвоночника»: живот ниже оси, спина выше — тело не симметрично.
    const belly = -0.02 - 0.05 * Math.sin(Math.PI * t);
    for (let j = 0; j <= RADIAL; j++) {
      const a = (j / RADIAL) * Math.PI * 2;
      const cx = Math.sin(a);
      const cy = Math.cos(a);
      // Немного сплющенные бока: настоящая рыба — не труба.
      const flat = 1 - 0.12 * Math.pow(Math.abs(cx), 3);
      positions.push(cx * w * flat, cy * h * 0.5 + belly * h, z);
    }
  }
  const ring = RADIAL + 1;
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = i * ring + j, b = a + ring, c = a + 1, d = b + 1;
      indices.push(a, b, d, a, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildFishGeometry(spec) {
  const parts = [buildBody(spec)];
  const noseT = 0.5, tailT = -0.5;

  // Хвост: раздвоенный (вильчатый), серповидный или округлый — по виду.
  const tail = spec.tail || 'forked';
  const fl = spec.tailLen || 0.28;
  const fh = spec.tailHeight || 0.32;
  let tailPts;
  if (tail === 'lunate') {
    tailPts = [[tailT, 0], [tailT - fl * 0.55, -fh * 0.35], [tailT - fl, -fh],
      [tailT - fl * 0.72, 0], [tailT - fl, fh], [tailT - fl * 0.55, fh * 0.35]];
  } else if (tail === 'round') {
    tailPts = [[tailT, 0], [tailT - fl * 0.35, -fh * 0.8], [tailT - fl * 0.75, -fh * 0.5],
      [tailT - fl, 0], [tailT - fl * 0.75, fh * 0.5], [tailT - fl * 0.35, fh * 0.8]];
  } else {
    tailPts = [[tailT, 0], [tailT - fl * 0.5, -fh * 0.5], [tailT - fl, -fh],
      [tailT - fl * 0.42, 0], [tailT - fl, fh], [tailT - fl * 0.5, fh * 0.5]];
  }
  parts.push(finGeometry(tailPts));

  // Спинной плавник
  if (spec.dorsal !== 0) {
    const d = spec.dorsal || 0.3;
    const dLen = spec.dorsalLen || 0.34;
    parts.push(finGeometry([
      [0.20, 0.22 * spec.depth], [-0.02, (0.22 + d) * spec.depth], [-0.16, (0.20 + d * 0.7) * spec.depth],
      [-0.28, 0.20 * spec.depth], [-dLen + 0.14, 0.18 * spec.depth],
    ]));
  }
  // Анальный плавник (снизу сзади)
  if (spec.anal !== 0) {
    const a = spec.anal || 0.2;
    parts.push(finGeometry([
      [-0.10, -0.20 * spec.depth], [-0.20, (-0.20 - a) * spec.depth], [-0.32, -0.18 * spec.depth],
    ]));
  }
  // Грудные плавники: по бокам, чуть назад
  const pec = spec.pectoral === undefined ? 0.22 : spec.pectoral;
  if (pec > 0) {
    for (const side of [1, -1]) {
      const g = finGeometry([[0.12, 0.0], [-0.02, pec * 0.5], [-0.10, -pec * 0.25]]);
      g.rotateY(side * Math.PI * 0.5);
      g.rotateZ(side * 0.5);
      g.translate(side * spec.width * 0.55, -0.02 * spec.depth, 0.12);
      parts.push(g);
    }
  }

  // Склеиваем и вешаем вес волны: 0 у носа, 1 у хвоста.
  const merged = mergeFishParts(parts);
  for (const g of parts) g.dispose();
  return merged;
}

function mergeFishParts(parts) {
  let total = 0;
  for (const g of parts) total += g.attributes.position.count;
  const pos = new Float32Array(total * 3);
  const nrm = new Float32Array(total * 3);
  const wave = new Float32Array(total);
  let offset = 0;
  for (const g of parts) {
    const gp = g.attributes.position.array;
    const gn = g.attributes.normal ? g.attributes.normal.array : null;
    const count = g.attributes.position.count;
    pos.set(gp, offset * 3);
    if (gn) nrm.set(gn, offset * 3);
    for (let i = 0; i < count; i++) {
      const z = gp[i * 3 + 2];
      const t = THREE.MathUtils.clamp(0.5 - z, 0, 1);
      wave[offset + i] = Math.pow(t, 1.7);
    }
    offset += count;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  geo.setAttribute('aWave', new THREE.BufferAttribute(wave, 1));
  return geo;
}

// Виды рифа. Размер — длина тела в метрах.
export const SPECIES = [
  {
    id: 'clownfish', name: 'Рыба-клоун', size: 0.13, count: 16, pattern: 1,
    color: 0xf4761f, color2: 0x2a1a12, spec: { width: 0.30, depth: 0.46, tail: 'round', dorsal: 0.22, tailLen: 0.24, tailHeight: 0.30, pectoral: 0.16 },
    school: { radius: 13, count: 16, spread: 1.5, speed: 0.16, y: 3.2, wobble: 0.5 },
    wave: { amp: 0.055, freq: 9, speed: 7.5 },
  },
  {
    id: 'bluetang', name: 'Синий хирург', size: 0.26, count: 24, pattern: 2,
    color: 0xffd83d, color2: 0x101c4a, spec: { width: 0.24, depth: 0.72, tail: 'lunate', dorsal: 0.26, dorsalLen: 0.45, tailLen: 0.26, tailHeight: 0.34 },
    school: { radius: 18, count: 24, spread: 2.6, speed: 0.13, y: 4.6, wobble: 0.6 },
    wave: { amp: 0.06, freq: 7.5, speed: 6.2 },
  },
  {
    id: 'yellowtang', name: 'Жёлтая зебрасома', size: 0.20, count: 20, pattern: 3,
    color: 0xfff0b8, color2: 0x3b2a10, spec: { width: 0.20, depth: 0.78, tail: 'lunate', dorsal: 0.24, dorsalLen: 0.42, tailLen: 0.24, tailHeight: 0.30 },
    school: { radius: 15, count: 20, spread: 2.2, speed: 0.15, y: 3.8, wobble: 0.55 },
    wave: { amp: 0.055, freq: 8, speed: 6.8 },
  },
  {
    id: 'butterflyfish', name: 'Рыба-бабочка', size: 0.16, count: 18, pattern: 4,
    color: 0x1b1b1b, color2: 0x2a1c08, spec: { width: 0.20, depth: 0.92, tail: 'round', dorsal: 0.30, dorsalLen: 0.40, tailLen: 0.22, tailHeight: 0.26 },
    school: { radius: 12, count: 18, spread: 1.8, speed: 0.17, y: 3.0, wobble: 0.7 },
    wave: { amp: 0.05, freq: 9.5, speed: 8.0 },
  },
  {
    id: 'parrotfish', name: 'Рыба-попугай', size: 0.55, count: 9, pattern: 5,
    color: 0x1fb9a8, color2: 0xd98bb0, spec: { width: 0.30, depth: 0.52, tail: 'round', dorsal: 0.18, dorsalLen: 0.5, tailLen: 0.30, tailHeight: 0.36, segments: 18 },
    school: { radius: 24, count: 9, spread: 3.4, speed: 0.09, y: 4.0, wobble: 0.35 },
    wave: { amp: 0.075, freq: 5.5, speed: 4.2 },
  },
  {
    id: 'sardine', name: 'Сардины (косяк)', size: 0.11, count: 170, pattern: 6,
    color: 0xdfeef5, color2: 0x1d3f66, spec: { width: 0.20, depth: 0.30, tail: 'forked', dorsal: 0.16, dorsalLen: 0.22, tailLen: 0.22, tailHeight: 0.24, segments: 12 },
    school: { radius: 20, count: 170, spread: 2.0, speed: 0.20, y: 5.4, wobble: 0.25, swirl: 0.55 },
    wave: { amp: 0.05, freq: 12, speed: 11 },
  },
  {
    id: 'angelfish', name: 'Морской ангел', size: 0.34, count: 10, pattern: 7,
    color: 0x2b3a8f, color2: 0x0d1440, spec: { width: 0.22, depth: 0.86, tail: 'round', dorsal: 0.24, dorsalLen: 0.44, tailLen: 0.24, tailHeight: 0.32 },
    school: { radius: 21, count: 10, spread: 2.4, speed: 0.11, y: 4.2, wobble: 0.4 },
    wave: { amp: 0.06, freq: 6.5, speed: 5.4 },
  },
  {
    id: 'wrasse', name: 'Губан-чистильщик', size: 0.10, count: 28, pattern: 8,
    color: 0xbfeee0, color2: 0x1b6fd0, spec: { width: 0.22, depth: 0.34, tail: 'round', dorsal: 0.14, dorsalLen: 0.34, tailLen: 0.20, tailHeight: 0.22, segments: 12 },
    school: { radius: 11, count: 28, spread: 1.3, speed: 0.24, y: 2.6, wobble: 0.9 },
    wave: { amp: 0.045, freq: 13, speed: 12 },
  },
  {
    id: 'grouper', name: 'Групер', size: 1.7, count: 2, pattern: 9,
    color: 0x6b7a5a, color2: 0x2f3a26, spec: { width: 0.34, depth: 0.46, tail: 'round', dorsal: 0.16, dorsalLen: 0.52, tailLen: 0.26, tailHeight: 0.34, segments: 18, pectoral: 0.2 },
    school: { radius: 28, count: 2, spread: 3.0, speed: 0.05, y: 3.4, wobble: 0.2 },
    wave: { amp: 0.05, freq: 4.2, speed: 2.6 },
  },
];

// Координаты косяка: центр ходит по эллипсу вокруг поляны, рыбы держат строй
// относительно него. Никакого «сталкивания» — тихий риф не нуждается в физике.
class School {
  constructor(spec, rnd) {
    this.spec = spec;
    const s = spec.school;
    this.radius = s.radius * (0.92 + rnd() * 0.16);
    this.speed = s.speed * (0.9 + rnd() * 0.2);
    this.dir = rnd() < 0.5 ? -1 : 1;
    this.phase = rnd() * Math.PI * 2;
    this.y = s.y + (rnd() - 0.5) * 1.6;
    this.wobble = s.wobble;
    this.swirl = s.swirl || 0;
    this.tilt = (rnd() - 0.5) * 0.7;
    this.members = [];
    for (let i = 0; i < s.count; i++) {
      this.members.push({
        ox: (rnd() - 0.5) * 2 * s.spread,
        oy: (rnd() - 0.5) * s.spread * 0.7,
        oz: (rnd() - 0.5) * 2 * s.spread,
        phase: rnd() * Math.PI * 2,
        bob: 0.25 + rnd() * 0.5,
        scale: 0.82 + rnd() * 0.4,
        yaw: (rnd() - 0.5) * 0.25,
        pitch: (rnd() - 0.5) * 0.2,
      });
    }
    this.center = new THREE.Vector3();
    this.forward = new THREE.Vector3(0, 0, 1);
  }

  update(t) {
    const s = this.spec.school;
    const a = this.phase + t * this.speed * this.dir;
    const r = this.radius + Math.sin(t * 0.11 + this.phase) * 2.2;
    this.center.set(Math.cos(a) * r, this.y + Math.sin(t * 0.19 + this.phase) * 0.9 * this.wobble, Math.sin(a) * r);
    // Касательная к эллипсу — направление движения косяка.
    this.forward.set(-Math.sin(a) * this.dir, Math.sin(t * 0.23 + this.phase) * 0.05 * this.wobble, Math.cos(a) * this.dir).normalize();
    return s;
  }
}

const _m = new THREE.Matrix4();
const _basis = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _roll = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);
const _right = new THREE.Vector3();
const _upAxis = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();
const _qFish = new THREE.Quaternion();
const _jit = new THREE.Quaternion();
const _euler = new THREE.Euler();

export function buildFish(quality) {
  const group = new THREE.Group();
  group.name = 'fish';
  const rnd = mulberry32(20261017);
  const species = [];

  for (const spec of SPECIES) {
    const geo = buildFishGeometry(spec.spec);
    const material = new THREE.MeshStandardMaterial({
      color: spec.color,
      roughness: 0.34,
      metalness: 0.22,
      side: THREE.DoubleSide,
      envMapIntensity: 0.9,
    });
    patchUnderwater(material, {
      caustics: 0.75,
      wave: 'body',
      waveAmp: spec.wave.amp,
      waveFreq: spec.wave.freq,
      waveSpeed: spec.wave.speed,
      pattern: { id: spec.pattern, color: spec.color, color2: spec.color2, scale: spec.spec.depth },
    });

    const count = spec.count;
    const mesh = new THREE.InstancedMesh(geo, material, count);
    mesh.name = `fish-${spec.id}`;
    mesh.frustumCulled = false;
    const phases = new Float32Array(count);
    const school = new School(spec, rnd);
    for (let i = 0; i < count; i++) phases[i] = rnd() * Math.PI * 2;
    geo.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));

    species.push({ spec, mesh, school, material, baseCount: count });
    group.add(mesh);
  }

  setFishQuality({ species }, quality);
  return { group, species };
}

export function setFishQuality(fish, quality) {
  for (const s of fish.species) {
    s.mesh.count = Math.max(1, Math.round(s.baseCount * quality));
    s.mesh.instanceMatrix.needsUpdate = true;
  }
}

export function updateFish(fish, t) {
  for (const s of fish.species) {
    const { mesh, school, spec } = s;
    school.update(t);
    _fwd.copy(school.forward);
    _right.crossVectors(_up, _fwd).normalize();
    _upAxis.crossVectors(_fwd, _right).normalize();
    _basis.makeBasis(_right, _upAxis, _fwd);
    _q.setFromRotationMatrix(_basis);
    // Крен на повороте: косяк слегка заваливается внутрь виража.
    _roll.setFromAxisAngle(_fwd, Math.sin(t * 0.11 + school.phase) * 0.12 * school.dir + school.tilt * 0.05);
    _q.multiply(_roll);

    const swirl = school.swirl ? t * school.swirl : 0;
    const members = school.members;
    const n = Math.min(members.length, mesh.count);
    for (let i = 0; i < n; i++) {
      const m = members[i];
      let ox = m.ox, oy = m.oy, oz = m.oz;
      if (swirl) {
        const c = Math.cos(swirl), sn = Math.sin(swirl);
        const rx = ox * c - oz * sn;
        const rz = ox * sn + oz * c;
        ox = rx; oz = rz;
      }
      // Небольшое «дыхание» строя и покачивание каждой рыбы.
      oy += Math.sin(t * m.bob * 1.7 + m.phase) * 0.22 * school.wobble;
      ox += Math.sin(t * m.bob * 1.1 + m.phase * 1.7) * 0.12;
      _euler.set(m.pitch, m.yaw, Math.sin(t * 0.9 + m.phase) * 0.09);
      _jit.setFromEuler(_euler);
      _qFish.copy(_q).multiply(_jit);
      _pos.set(ox, oy, oz).applyQuaternion(_qFish).add(school.center);
      const floor = seabedHeight(_pos.x, _pos.z) + 0.45;
      if (_pos.y < floor) _pos.y = floor;
      const top = WORLD.surfaceY - 1.2;
      if (_pos.y > top) _pos.y = top;

      _m.compose(_pos, _qFish, _scale.setScalar(spec.size * m.scale));
      mesh.setMatrixAt(i, _m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
}

export function fishCounts(fish) {
  return fish.species.map((s) => ({ id: s.spec.id, name: s.spec.name, count: s.mesh.count, max: s.baseCount }));
}
