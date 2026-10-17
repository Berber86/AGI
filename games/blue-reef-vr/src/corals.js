// Коралловый сад вокруг поляны. Вся геометрия процедурная и инстансированная:
// шесть типов кораллов = шесть draw call-ов, сколько бы их ни стояло.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { valueNoise, fbm2, mulberry32 } from './noise.js';
import { WORLD } from './config.js';
import { patchUnderwater } from './shading.js';
import { makeRockTextures, makeFanTexture, makeCoralDetail } from './textures.js';
import { seabedHeight } from './seabed.js';

const TMP_M = new THREE.Matrix4();
const TMP_Q = new THREE.Quaternion();
const TMP_E = new THREE.Euler();
const TMP_P = new THREE.Vector3();
const TMP_S = new THREE.Vector3();

// mergeGeometries не смешивает индексированные и неиндексированные геометрии
// (IcosahedronGeometry неиндексирован, цилиндры — индексированы), поэтому перед
// склейкой всё приводим к единому виду.
function mergeParts(parts) {
  const flat = parts.map((g) => (g.index ? g.toNonIndexed() : g));
  const merged = mergeGeometries(flat, false);
  for (const g of flat) if (!parts.includes(g)) g.dispose();
  for (const g of parts) g.dispose();
  return merged;
}

function addWaveAttribute(geo, heightAt) {
  const pos = geo.attributes.position;
  const wave = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) wave[i] = heightAt(pos.getX(i), pos.getY(i), pos.getZ(i));
  geo.setAttribute('aWave', new THREE.BufferAttribute(wave, 1));
  return geo;
}

// --- ветвящийся коралл (олений рог) -----------------------------------------
function branchCoral(seed) {
  const rnd = mulberry32(seed);
  const parts = [];
  const grow = (from, dir, len, radius, depth) => {
    const geo = new THREE.CylinderGeometry(radius * 0.62, radius, len, 8, 2, false);
    geo.translate(0, len / 2, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    geo.applyQuaternion(q);
    geo.translate(from.x, from.y, from.z);
    parts.push(geo);
    if (depth <= 0) {
      const tip = new THREE.IcosahedronGeometry(radius * 0.72, 0);
      tip.translate(from.x + dir.x * len, from.y + dir.y * len, from.z + dir.z * len);
      parts.push(tip);
      return;
    }
    const tipPos = from.clone().addScaledVector(dir.clone().normalize(), len);
    const kids = 2 + (rnd() < 0.45 ? 1 : 0);
    for (let i = 0; i < kids; i++) {
      const spread = 0.42 + rnd() * 0.5;
      const az = rnd() * Math.PI * 2;
      const nd = dir.clone()
        .add(new THREE.Vector3(Math.cos(az) * spread, (rnd() - 0.25) * 0.45, Math.sin(az) * spread))
        .normalize();
      grow(tipPos, nd, len * (0.62 + rnd() * 0.2), radius * 0.62, depth - 1);
    }
  };
  grow(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 0.55, 0.11, 3);
  const merged = mergeParts(parts);
  merged.computeVertexNormals();
  return merged;
}

// --- мозговой коралл: шар с извилинами --------------------------------------
function brainCoral(seed, ridged = true) {
  const geo = new THREE.SphereGeometry(1, 32, 20);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = fbm2(v.x * 1.5 + seed, v.z * 1.5 + seed, { octaves: 4, seed: seed + 3 });
    let r = 1 + (n - 0.5) * 0.34;
    if (ridged) {
      const grooves = Math.sin(v.x * 7 + n * 4) * Math.sin(v.z * 6 + n * 3);
      r += grooves * 0.055;
    }
    v.multiplyScalar(r);
    v.y = Math.max(v.y * 0.66, -0.05); // сплющенная подушка, не шар
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// --- трубчатые губки ---------------------------------------------------------
function tubeSponges(seed) {
  const rnd = mulberry32(seed);
  const parts = [];
  const count = 3 + Math.floor(rnd() * 3);
  for (let i = 0; i < count; i++) {
    const h = 0.7 + rnd() * 0.9;
    const r = 0.16 + rnd() * 0.12;
    const g = new THREE.CylinderGeometry(r * 0.92, r * 0.7, h, 12, 2, true);
    g.translate(0, h / 2, 0);
    const tilt = 0.15 + rnd() * 0.5;
    const az = (i / count) * Math.PI * 2 + rnd();
    g.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.cos(az) * tilt, 0, Math.sin(az) * tilt)));
    g.translate(Math.cos(az) * 0.16, 0, Math.sin(az) * 0.16);
    parts.push(g);
  }
  const merged = mergeParts(parts);
  merged.computeVertexNormals();
  return merged;
}

// Самозатенение коралла, запечённое в цвета вершин.
//
// Настоящий AO считать нечем (shadowMap выключен, а обсчёт на ЦПУ слишком
// дорог), но именно отсутствие теней внутри кроны делает коралл «пластиковым».
// Здесь берётся простая «пещерность»: внутри куста и у основания света меньше,
// на верхушках и по краям — больше. Считается один раз при сборке и стоит в
// кадре ноль: множится на цвет инстанса обычным vertexColors.
function bakeCavity(geo, { floor = 0.44, height = 0.44, radial = 0.3 } = {}) {
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const spanY = Math.max(1e-3, bb.max.y - bb.min.y);
  const radius = Math.max(1e-3, Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z) * 0.5);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const h = (y - bb.min.y) / spanY;
    const r = Math.min(1, Math.hypot(x, z) / radius);
    const lit = floor + height * h + radial * r;
    const v = Math.max(0.28, Math.min(1, lit));
    colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = v;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

// --- столовый коралл: пластина на ножке -------------------------------------
function tableCoral(seed) {
  const rnd = mulberry32(seed);
  const parts = [];
  const stalk = new THREE.CylinderGeometry(0.17, 0.3, 0.8, 10, 1);
  stalk.translate(0, 0.4, 0);
  parts.push(stalk);
  const plate = new THREE.CylinderGeometry(1.45, 1.2, 0.16, 30, 2);
  plate.translate(0, 0.86, 0);
  const pos = plate.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = Math.hypot(v.x, v.z);
    if (r > 0.05) {
      const a = Math.atan2(v.z, v.x);
      // Волнистый край и неровная поверхность: ровный диск выглядит тарелкой.
      const edge = Math.sin(a * 5 + seed) * 0.10 + Math.sin(a * 11 + seed * 2) * 0.05;
      const bumps = fbm2(v.x * 1.6 + seed, v.z * 1.6 + seed, { octaves: 3, seed: seed + 5 }) - 0.5;
      const k = 1 + edge * Math.min(1, r / 1.45);
      v.x *= k; v.z *= k;
      v.y += bumps * 0.14 * (v.y > 0.86 ? 1 : 0.3);
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  parts.push(plate);
  // Нарост на пластине — чтобы силуэт не был идеально симметричным.
  for (let i = 0; i < 3; i++) {
    const a = rnd() * Math.PI * 2, rr = 0.3 + rnd() * 0.7;
    const knob = new THREE.SphereGeometry(0.12 + rnd() * 0.12, 10, 7);
    knob.scale(1, 0.7, 1);
    knob.translate(Math.cos(a) * rr, 0.95 + rnd() * 0.06, Math.sin(a) * rr);
    parts.push(knob);
  }
  const merged = mergeParts(parts);
  merged.computeVertexNormals();
  return merged;
}

// --- мусор на песке: галька, ракушки, обломки -------------------------------
// Без него дно у ног пустое и «стерильное»: глазу не за что зацепиться, а
// стерео-параллакс вблизи не читается.
function debrisCluster(seed) {
  const rnd = mulberry32(seed);
  const parts = [];
  const bits = 7;
  for (let i = 0; i < bits; i++) {
    const kind = rnd();
    let g;
    if (kind < 0.42) {
      g = new THREE.DodecahedronGeometry(0.09 + rnd() * 0.11, 0);
      g.scale(1, 0.5, 0.82);
    } else if (kind < 0.72) {
      g = new THREE.SphereGeometry(0.06 + rnd() * 0.06, 8, 5);
      g.scale(1, 1, 0.42);                 // плоская ракушка
    } else if (kind < 0.88) {
      g = new THREE.CylinderGeometry(0.025, 0.05, 0.22 + rnd() * 0.3, 6, 1); // обломок ветки
    } else {
      g = new THREE.TorusGeometry(0.09 + rnd() * 0.05, 0.03, 5, 9);          // обломок раковины
    }
    const a = rnd() * Math.PI * 2, r = rnd() * 0.42;
    g.rotateY(rnd() * Math.PI * 2);
    g.rotateX((rnd() - 0.5) * 0.9);
    g.rotateZ((rnd() - 0.5) * 0.9);
    g.translate(Math.cos(a) * r, 0.02 + rnd() * 0.05, Math.sin(a) * r);
    parts.push(g);
  }
  const merged = mergeParts(parts);
  merged.computeVertexNormals();
  return merged;
}

// --- веерная горгонария -----------------------------------------------------
function seaFan() {
  const geo = new THREE.PlaneGeometry(2.6, 2.6, 10, 10);
  geo.translate(0, 1.3, 0);
  addWaveAttribute(geo, (_x, y) => Math.pow(THREE.MathUtils.clamp(y / 2.6, 0, 1), 1.5));
  return geo;
}

// --- актиния: подушка и щупальца -------------------------------------------
function anemone(seed) {
  const rnd = mulberry32(seed);
  const parts = [];
  const base = new THREE.SphereGeometry(0.42, 16, 10);
  base.scale(1, 0.55, 1);
  parts.push(base);
  const tentacles = 18;
  for (let i = 0; i < tentacles; i++) {
    const a = (i / tentacles) * Math.PI * 2 + rnd() * 0.2;
    const rr = 0.16 + rnd() * 0.24;
    const len = 0.5 + rnd() * 0.45;
    const g = new THREE.CylinderGeometry(0.022, 0.055, len, 5, 1);
    g.translate(0, len / 2, 0);
    const tilt = 0.25 + rnd() * 0.6;
    g.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.cos(a) * tilt, 0, Math.sin(a) * tilt)));
    g.translate(Math.cos(a) * rr, 0.25, Math.sin(a) * rr);
    parts.push(g);
  }
  const merged = mergeParts(parts);
  addWaveAttribute(merged, (_x, y) => Math.pow(THREE.MathUtils.clamp((y - 0.2) / 0.8, 0, 1), 1.6));
  merged.computeVertexNormals();
  return merged;
}

// --- морская трава ----------------------------------------------------------
function seagrass() {
  const geo = new THREE.PlaneGeometry(0.26, 2.6, 1, 7);
  geo.translate(0, 1.3, 0);
  addWaveAttribute(geo, (_x, y) => Math.pow(THREE.MathUtils.clamp(y / 2.6, 0, 1), 1.7));
  return geo;
}

const TYPE_COUNT = {
  branch: 54,
  brain: 30,
  sponge: 24,
  table: 15,
  fan: 34,
  anemone: 38,
  grass: 110,
  debris: 145,
};

export function buildReef(quality) {
  const group = new THREE.Group();
  group.name = 'reef';
  const meshes = [];
  const materials = [];
  // Положения всех посадок: по ним печётся карта контактных теней на песке.
  const placements = [];
  const textures = [];
  const rnd = mulberry32(9182734);
  const rockTex = makeRockTextures(256, 2);
  const fanTex = makeFanTexture(256);
  textures.push(fanTex);
  const color = new THREE.Color();

  const place = (mesh, count, opts) => {
    const { minR = WORLD.clearing * 0.85, maxR = WORLD.reefRadius, scale = [0.7, 1.4], sink = 0.15, tilt = 0.16,
      // Сектор, который надо оставить пустым: так ближние кораллы не закрывают
      // взгляд прямо вперёд (угол в радианах вокруг направления -Z).
      keepClear = 0 } = opts;
    let placed = 0;
    let guard = 0;
    while (placed < count && guard++ < count * 40) {
      const a = rnd() * Math.PI * 2;
      if (keepClear > 0) {
        // Направление взгляда вперёд — это -Z, то есть угол -PI/2.
        let d = Math.abs(((a + Math.PI / 2 + Math.PI) % (Math.PI * 2)) - Math.PI);
        if (d < keepClear) continue;
      }
      const r = minR + Math.pow(rnd(), 0.65) * (maxR - minR);
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const y = seabedHeight(x, z);
      if (y < WORLD.seabedY - 0.2 || Math.hypot(x, z) < minR) continue;
      const s = scale[0] + rnd() * (scale[1] - scale[0]);
      TMP_P.set(x, y - sink * s, z);
      TMP_E.set((rnd() - 0.5) * tilt, rnd() * Math.PI * 2, (rnd() - 0.5) * tilt);
      TMP_Q.setFromEuler(TMP_E);
      TMP_S.set(s * (0.85 + rnd() * 0.3), s * (0.8 + rnd() * 0.5), s * (0.85 + rnd() * 0.3));
      TMP_M.compose(TMP_P, TMP_Q, TMP_S);
      mesh.setMatrixAt(placed, TMP_M);
      mesh.setColorAt(placed, color.setHSL(opts.hue + (rnd() - 0.5) * opts.hueSpread, opts.sat, opts.light + (rnd() - 0.5) * 0.12));
      placements.push({ x, z, radius: s * 0.85, strength: opts.shadow ?? 0.5 });
      placed++;
    }
    mesh.count = placed;
    mesh.baseCount = placed;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    meshes.push(mesh);
  };

  const addPhase = (mesh, count) => {
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) phases[i] = rnd() * Math.PI * 2;
    mesh.geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));
  };

  // Карта пор и полипов — одна на все кораллы: без неё любые формы читаются
  // как гладкий пластик, сколько ни добавляй полигонов.
  const coralTex = makeCoralDetail(256, 7);
  textures.push(coralTex);

  // Один материал на группу форм: инстансы делят его, поэтому draw call один
  // на форму, а не на каждый коралл.
  const addType = (geoms, total, opts) => {
    if (opts.cavity !== false) for (const g of geoms) bakeCavity(g, opts.cavity || {});
    const material = new THREE.MeshStandardMaterial({
      color: opts.color ?? 0xffffff,
      normalMap: opts.detail === false ? null : coralTex,
      normalScale: new THREE.Vector2(opts.detailScale ?? 0.6, opts.detailScale ?? 0.6),
      roughness: opts.roughness ?? 0.68,
      metalness: 0,
      side: opts.side ?? THREE.FrontSide,
      envMapIntensity: opts.env ?? 0.4,
      vertexColors: opts.cavity !== false,
      ...(opts.map ? { map: opts.map, alphaMap: opts.alphaMap ?? opts.map, alphaTest: opts.alphaTest ?? 0 } : {}),
    });
    patchUnderwater(material, {
      caustics: opts.caustics ?? 0.95,
      wave: opts.wave ?? null,
      waveAmp: opts.waveAmp ?? 0,
      waveSpeed: opts.waveSpeed ?? 0,
      translucency: opts.translucency ?? 0,
      transColor: opts.transColor ?? 0xffd9a8,
    });
    const per = Math.ceil(total / geoms.length);
    for (const geo of geoms) {
      const mesh = new THREE.InstancedMesh(geo, material, per);
      mesh.frustumCulled = false;
      if (opts.wave) addPhase(mesh, per);
      place(mesh, per, opts);
      group.add(mesh);
    }
    materials.push(material);
  };

  // 1. Ветвящиеся кораллы — три разные формы, а не клоны одного куста.
  addType([branchCoral(101), branchCoral(211), branchCoral(307)], TYPE_COUNT.branch, {
    hue: 0.05, hueSpread: 0.1, sat: 0.64, light: 0.58, scale: [0.8, 2.0], shadow: 0.55,
  });

  // 2. Мозговые кораллы (подушки)
  addType([brainCoral(17), brainCoral(41)], TYPE_COUNT.brain, {
    hue: 0.09, hueSpread: 0.14, sat: 0.45, light: 0.55, scale: [0.8, 2.6],
    roughness: 0.56, detailScale: 0.75, env: 0.45, shadow: 0.6,
  });

  // 3. Трубчатые губки
  addType([tubeSponges(55), tubeSponges(83)], TYPE_COUNT.sponge, {
    hue: 0.83, hueSpread: 0.12, sat: 0.4, light: 0.55, scale: [0.7, 1.6],
    side: THREE.DoubleSide, roughness: 0.85, env: 0.3, caustics: 0.8, shadow: 0.45,
    translucency: 0.3, transColor: 0xffd0a0,
  });

  // 4. Столовые кораллы: пластина на ножке — самый узнаваемый силуэт рифа.
  addType([tableCoral(61)], TYPE_COUNT.table, {
    hue: 0.07, hueSpread: 0.08, sat: 0.5, light: 0.52, scale: [0.8, 1.6],
    roughness: 0.62, detailScale: 0.8, shadow: 0.7,
  });

  // 5. Веера-горгонарии: покачиваются на течении
  addType([bakeCavity(seaFan(), { floor: 0.55, height: 0.4, radial: 0.2 })], TYPE_COUNT.fan, {
    hue: 0.93, hueSpread: 0.12, sat: 0.55, light: 0.6, scale: [0.7, 1.7], sink: 0.02,
    map: fanTex, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.65,
    wave: 'sway', waveAmp: 0.14, waveSpeed: 0.9, shadow: 0.3,
    translucency: 0.55, transColor: 0xffb9d2,
  });

  // 6. Актинии
  addType([anemone(77), anemone(133)], TYPE_COUNT.anemone, {
    hue: 0.46, hueSpread: 0.14, sat: 0.6, light: 0.55, scale: [0.6, 1.15], sink: 0.05,
    roughness: 0.5, env: 0.4, wave: 'sway', waveAmp: 0.1, waveSpeed: 1.35, shadow: 0.3,
    translucency: 0.45, transColor: 0xffc48a,
  });

  // 7. Морская трава: густые куртины у края поляны
  addType([bakeCavity(seagrass(), { floor: 0.45, height: 0.5, radial: 0.15 })], TYPE_COUNT.grass, {
    hue: 0.28, hueSpread: 0.08, sat: 0.45, light: 0.42, scale: [0.7, 1.8], sink: 0.02,
    side: THREE.DoubleSide, roughness: 0.75, env: 0.3, detailScale: 0.35,
    wave: 'sway', waveAmp: 0.42, waveSpeed: 1.15, shadow: 0.35,
    translucency: 0.5, transColor: 0xbfe07a,
    minR: WORLD.clearing * 0.7, maxR: WORLD.reefRadius * 0.9, tilt: 0.3,
  });

  // 8. Мусор на песке: галька, ракушки, обломки коралла. Дно у ног перестаёт
  //    быть стерильным, а вблизи появляется за что зацепиться взглядом — это
  //    же и есть главный stereo-параллакс.
  addType([debrisCluster(909), debrisCluster(1313)], TYPE_COUNT.debris, {
    cavity: false,
    hue: 0.09, hueSpread: 0.06, sat: 0.18, light: 0.5, scale: [0.55, 1.5], sink: 0.01,
    minR: 1.6, maxR: 34, tilt: 0.35, roughness: 0.8, detailScale: 0.45,
    caustics: 1.05, shadow: 0.32,
  });

  // 9. Ближний план: крупные кораллы в 3.5…9 м от пловца.
  //    Без них передний край кадра пустой — глазу не за что зацепиться, и
  //    стерео-параллакс не читается. Сектор прямо вперёд оставлен свободным,
  //    чтобы взгляд по умолчанию не упирался в коралл.
  addType([branchCoral(313), branchCoral(419)], 14, {
    hue: 0.06, hueSpread: 0.12, sat: 0.6, light: 0.55, scale: [1.2, 2.1],
    minR: 6.4, maxR: 9.0, sink: 0.2, tilt: 0.12, keepClear: 0.62, shadow: 0.75,
    caustics: 1.05, detailScale: 0.7,
  });
  addType([brainCoral(29)], 9, {
    hue: 0.1, hueSpread: 0.16, sat: 0.42, light: 0.5, scale: [1.1, 1.9],
    minR: 6.8, maxR: 9.4, sink: 0.25, tilt: 0.14, keepClear: 0.62, shadow: 0.8,
    roughness: 0.56, caustics: 1.0, detailScale: 0.75,
  });
  // Самый ближний ярус: высокие горгонарии в 3.5…6 м по бокам. Они попадают в
  // периферию обзора и дают тот самый «масштаб», которого не хватало.
  addType([bakeCavity(seaFan(), { floor: 0.5, height: 0.42, radial: 0.2 })], 7, {
    hue: 0.92, hueSpread: 0.1, sat: 0.5, light: 0.55, scale: [1.5, 2.6], sink: 0.02,
    minR: 3.4, maxR: 6.0, tilt: 0.1, keepClear: 0.95, shadow: 0.4,
    map: fanTex, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.62,
    wave: 'sway', waveAmp: 0.16, waveSpeed: 0.8, caustics: 1.1,
    translucency: 0.6, transColor: 0xffb9d2,
  });
  addType([bakeCavity(seagrass(), { floor: 0.42, height: 0.5, radial: 0.15 })], 40, {
    hue: 0.28, hueSpread: 0.08, sat: 0.45, light: 0.42, scale: [1.0, 1.9], sink: 0.02,
    minR: 3.0, maxR: 8.5, tilt: 0.3, keepClear: 0.8, shadow: 0.3,
    side: THREE.DoubleSide, roughness: 0.75, detailScale: 0.35,
    wave: 'sway', waveAmp: 0.42, waveSpeed: 1.15, caustics: 0.9,
    translucency: 0.5, transColor: 0xbfe07a,
  });

  // Инстансы создаются на полную плотность: пресеты просто двигают mesh.count,
  // поэтому смена качества не перестраивает геометрию и не даёт рывка.
  setReefQuality({ meshes }, quality);

  return { group, meshes, materials, placements, textures: textures.concat([rockTex.map, rockTex.normalMap]) };
}

/** Плотность рифа меняется пресетами: инстансы не пересоздаются, только count. */
export function setReefQuality(reef, quality) {
  for (const mesh of reef.meshes) {
    if (!mesh.baseCount) continue;
    mesh.count = Math.max(1, Math.round(mesh.baseCount * quality));
    mesh.instanceMatrix.needsUpdate = true;
  }
}
