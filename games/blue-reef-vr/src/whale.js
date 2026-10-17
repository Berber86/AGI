// Горбатый кит. Тело строится лофтингом по профилю позвоночника, двухцветная
// окраска и панцирные бляшки — в вершинных цветах, гребень хвоста — тот же
// волновой шейдер, что и у рыб. Кит ходит по большому эллипсу вдали и время от
// времени подплывает ближе: контракт «кит почти всё время вдалеке, к финалу
// подплывает ближе».
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { valueNoise } from './noise.js';
import { WORLD } from './config.js';
import { patchUnderwater } from './shading.js';

const LENGTH = 11.5; // метров
const RADIAL = 22;

// Профиль от носа (0) к хвостовому стеблю (1): доля длины.
const PROFILE = [
  [0.00, 0.030], [0.035, 0.085], [0.08, 0.132], [0.14, 0.168], [0.22, 0.196],
  [0.31, 0.212], [0.41, 0.216], [0.52, 0.206], [0.62, 0.182], [0.71, 0.152],
  [0.79, 0.120], [0.86, 0.092], [0.92, 0.066], [0.96, 0.048], [1.00, 0.028],
];

function radiusAt(t) {
  for (let i = 1; i < PROFILE.length; i++) {
    if (t <= PROFILE[i][0]) {
      const [t0, r0] = PROFILE[i - 1];
      const [t1, r1] = PROFILE[i];
      return r0 + (r1 - r0) * ((t - t0) / (t1 - t0));
    }
  }
  return PROFILE[PROFILE.length - 1][1];
}

function finGeometry(points) {
  const geo = new THREE.BufferGeometry();
  const verts = [];
  for (let i = 1; i < points.length - 1; i++) verts.push(...points[0], ...points[i], ...points[i + 1]);
  const arr = new Float32Array(verts.length);
  for (let i = 0; i < verts.length; i += 3) {
    arr[i] = 0; arr[i + 1] = verts[i + 1]; arr[i + 2] = verts[i];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  geo.computeVertexNormals();
  return geo;
}

function buildWhaleGeometry() {
  const segs = 46;
  const positions = [];
  const colors = [];
  const waves = [];
  const indices = [];
  const dark = new THREE.Color(0x2b3746);
  const light = new THREE.Color(0xd7e0e4);
  const patch = new THREE.Color(0x8fa3ad);
  const c = new THREE.Color();

  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const z = 0.5 - t * 0.95;              // нос +0.5, хвостовой стебель -0.45
    const r = radiusAt(t);
    for (let j = 0; j <= RADIAL; j++) {
      const a = (j / RADIAL) * Math.PI * 2;
      const sa = Math.sin(a), ca = Math.cos(a);
      // Горбатый кит шире, чем выше; брюхо плоское с характерными складками.
      let rx = r * 1.28;
      let ry = r;
      if (ca < -0.15) {
        const pleat = Math.sin(a * 9) * 0.035 * (t > 0.25 && t < 0.8 ? 1 : 0.3);
        ry += pleat;
        rx += pleat * 0.6;
      }
      const y = ca * ry;
      const x = sa * rx;
      positions.push(x, y, z);
      // Окраска: тёмная спина, светлое брюхо, белые пятна-бляшки.
      const up = THREE.MathUtils.clamp((y / Math.max(0.02, r)) * 0.5 + 0.5, 0, 1);
      const belly = 1 - THREE.MathUtils.smoothstep(up, 0.22, 0.62);
      c.copy(dark).lerp(light, belly * 0.92);
      const speck = valueNoise(Math.floor(t * 60), Math.floor(a * 12), 17);
      if (speck > 0.86) c.lerp(patch, 0.75);
      if (t > 0.55 && belly > 0.6 && valueNoise(Math.floor(t * 20), Math.floor(a * 5), 41) > 0.7) c.lerp(light, 0.6);
      colors.push(c.r, c.g, c.b);
      // Волна идёт от носа к хвосту: чем ближе к хвосту, тем больше амплитуда.
      waves.push(Math.pow(t, 2.1) * 0.85);
    }
  }
  const ring = RADIAL + 1;
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = i * ring + j, b = a + ring;
      indices.push(a, b, b + 1, a, b + 1, a + 1);
    }
  }

  const body = new THREE.BufferGeometry();
  body.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  body.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  body.setAttribute('aWave', new THREE.Float32BufferAttribute(waves, 1));
  body.setIndex(indices);
  body.computeVertexNormals();

  // Хвостовые лопасти: горизонтальный раздвоенный плавник за стеблем.
  const flukePts = [
    [-0.45, 0.0], [0.52, -0.66], [0.20, -0.56], [0.0, -0.54], [-0.20, -0.56], [-0.52, -0.66],
  ];
  const flukeVerts = [];
  for (let i = 1; i < flukePts.length - 1; i++) {
    flukeVerts.push(...[0, 0, flukePts[0][0]]);
    flukeVerts.push(...[flukePts[i][0], 0, flukePts[i][1]]);
    flukeVerts.push(...[flukePts[i + 1][0], 0, flukePts[i + 1][1]]);
  }
  const flukeGeo = new THREE.BufferGeometry();
  const farr = new Float32Array(flukeVerts.length);
  for (let i = 0; i < flukeVerts.length; i += 3) {
    farr[i] = flukeVerts[i]; farr[i + 1] = flukeVerts[i + 1]; farr[i + 2] = flukeVerts[i + 2];
  }
  flukeGeo.setAttribute('position', new THREE.BufferAttribute(farr, 3));
  flukeGeo.computeVertexNormals();
  const fc = [];
  const fw = [];
  for (let i = 0; i < farr.length / 3; i++) { fc.push(0.17, 0.22, 0.27); fw.push(1.0); }
  flukeGeo.setAttribute('color', new THREE.Float32BufferAttribute(fc, 3));
  flukeGeo.setAttribute('aWave', new THREE.Float32BufferAttribute(fw, 1));

  // Грудные ласты: длинные, чуть назад и вниз.
  const pecPts = [[0.10, -0.03], [-0.06, -0.10], [-0.24, -0.15], [-0.33, -0.12], [-0.26, -0.05], [-0.12, 0.0]];
  const pecs = [];
  for (const side of [1, -1]) {
    const g = finGeometry(pecPts);
    g.rotateZ(side * 1.25);
    g.rotateY(side * 0.28);
    g.translate(side * 0.17, -0.05, 0.03);
    const count = g.attributes.position.count;
    const col = [];
    const wv = [];
    for (let i = 0; i < count; i++) { col.push(0.16, 0.21, 0.26); wv.push(0.35); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setAttribute('aWave', new THREE.Float32BufferAttribute(wv, 1));
    pecs.push(g);
  }

  // Небольшой спинной плавник.
  const dorsal = finGeometry([[0.04, 0.13], [-0.10, 0.20], [-0.24, 0.13]]);
  dorsal.translate(0, 0.02, -0.02);
  const dcount = dorsal.attributes.position.count;
  dorsal.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(dcount * 3).map(() => 0.18), 3));
  dorsal.setAttribute('aWave', new THREE.Float32BufferAttribute(new Float32Array(dcount).fill(0.25), 1));

  // Тело индексировано, плавники — нет: перед склейкой приводим к одному виду.
  const bodyFlat = body.toNonIndexed();
  body.dispose();
  const merged = mergeGeometries([bodyFlat, flukeGeo, ...pecs, dorsal], false);
  for (const g of [bodyFlat, flukeGeo, dorsal, ...pecs]) g.dispose();
  return merged;
}

export function buildWhale() {
  const group = new THREE.Group();
  group.name = 'whale';

  const geo = buildWhaleGeometry();
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.52,
    metalness: 0.06,
    side: THREE.DoubleSide,
    envMapIntensity: 0.7,
  });
  patchUnderwater(material, { caustics: 0.55, wave: 'body', waveAmp: 0.075, waveFreq: 3.1, waveSpeed: 1.15 });

  const mesh = new THREE.Mesh(geo, material);
  mesh.scale.setScalar(LENGTH);
  mesh.frustumCulled = false;
  group.add(mesh);

  // Глаз: маленький тёмный шарик у края челюсти.
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0b0f14, roughness: 0.25, metalness: 0.1 });
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), eyeMat);
  eye.position.set(0.115 * LENGTH, 0.03 * LENGTH, 0.30 * LENGTH);
  group.add(eye);

  const state = {
    group, mesh, material, eye,
    distance: 60,
    closeness: 0,
    position: new THREE.Vector3(0, 8, -60),
    ahead: false,
  };
  updateWhale(state, 0);
  return state;
}

const _q = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _m = new THREE.Matrix4();
const _basis = new THREE.Matrix4();
const _up = new THREE.Vector3(0, 1, 0);
const _right = new THREE.Vector3();
const _upAxis = new THREE.Vector3();
const _fwd = new THREE.Vector3();

/**
 * Маршрут кита: медленный эллипс вдали с периодическим сближением.
 * Цикл 120 с: кит подходит с 62 м до ~24 м, разворачивается боком к зрителю и
 * уходит обратно. Резких рывков нет — скорость нарастает плавно.
 */
export function updateWhale(whale, t) {
  const cycle = 120;
  const u = (t % cycle) / cycle;
  // Колокол вокруг середины цикла: 0 вдали, 1 в момент максимального сближения.
  const closeness = Math.exp(-Math.pow((u - 0.5) / 0.13, 2));
  const radius = 62 - 38 * closeness;
  const angle = -Math.PI / 2 + t * 0.021;
  const y = 9.5 + Math.sin(t * 0.037) * 2.6 - closeness * 2.2;

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  whale.position.set(x, y, z);
  whale.closeness = +closeness.toFixed(3);
  whale.distance = +Math.hypot(x, z).toFixed(1);

  // Касательная: кит плывёт по кругу, а не «едет задом».
  _fwd.set(-Math.sin(angle), Math.cos(t * 0.037) * 0.04 - closeness * 0.02, Math.cos(angle)).normalize();
  _right.crossVectors(_up, _fwd).normalize();
  _upAxis.crossVectors(_fwd, _right).normalize();
  _basis.makeBasis(_right, _upAxis, _fwd);
  _q.setFromRotationMatrix(_basis);
  // Медленная «морская прогулка»: крен и дифферент дышат по синусу.
  const roll = Math.sin(t * 0.11) * 0.06 + closeness * 0.05;
  const pitch = Math.sin(t * 0.07 + 1.2) * 0.05;
  _euler.set(pitch, 0, roll);
  _q.multiply(new THREE.Quaternion().setFromEuler(_euler));

  whale.group.position.copy(whale.position);
  whale.group.quaternion.copy(_q);
  whale.group.updateMatrixWorld();

  // Виден ли кит, если смотреть вперёд (для диагностики и QA).
  const toWhale = Math.atan2(x, z);
  whale.ahead = Math.abs(toWhale) < Math.PI / 3;
  const floor = WORLD.seabedY + 4.5;
  if (whale.position.y < floor) whale.position.y = floor;
  if (whale.position.y > WORLD.surfaceY - 2.5) whale.position.y = WORLD.surfaceY - 2.5;
  whale.group.position.copy(whale.position);
  return whale;
}

export function whaleInfo(whale) {
  return {
    distanceM: whale.distance,
    closeness: whale.closeness,
    ahead: whale.ahead,
    lengthM: LENGTH,
    position: [+whale.position.x.toFixed(1), +whale.position.y.toFixed(1), +whale.position.z.toFixed(1)],
  };
}
