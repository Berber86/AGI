// Коралловый сад вокруг поляны. Вся геометрия процедурная и инстансированная:
// шесть типов кораллов = шесть draw call-ов, сколько бы их ни стояло.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { valueNoise, fbm2, mulberry32 } from './noise.js';
import { WORLD } from './config.js';
import { patchUnderwater } from './shading.js';
import { makeRockTextures, makeFanTexture } from './textures.js';
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
    const geo = new THREE.CylinderGeometry(radius * 0.62, radius, len, 6, 1, false);
    geo.translate(0, len / 2, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    geo.applyQuaternion(q);
    geo.translate(from.x, from.y, from.z);
    parts.push(geo);
    if (depth <= 0) {
      const tip = new THREE.IcosahedronGeometry(radius * 0.75, 0);
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
  const geo = new THREE.SphereGeometry(1, 30, 20);
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
    const g = new THREE.CylinderGeometry(r * 0.92, r * 0.7, h, 10, 1, true);
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
  const tentacles = 26;
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
  branch: 52,
  brain: 30,
  sponge: 24,
  fan: 34,
  anemone: 38,
  grass: 120,
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

  // 1. Ветвящиеся кораллы
  {
    const variant = branchCoral(101);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0, envMapIntensity: 0.35 });
    patchUnderwater(material, { caustics: 0.95 });
    const mesh = new THREE.InstancedMesh(variant, material, TYPE_COUNT.branch);
    mesh.frustumCulled = false;
    place(mesh, TYPE_COUNT.branch, { hue: 0.05, hueSpread: 0.1, sat: 0.65, light: 0.62, scale: [0.8, 2.0] });
    materials.push(material);
    group.add(mesh);
  }

  // 2. Мозговые кораллы (подушки)
  {
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0, envMapIntensity: 0.4 });
    patchUnderwater(material, { caustics: 1.0 });
    const mesh = new THREE.InstancedMesh(brainCoral(17), material, TYPE_COUNT.brain);
    mesh.frustumCulled = false;
    place(mesh, TYPE_COUNT.brain, { hue: 0.09, hueSpread: 0.14, sat: 0.45, light: 0.58, scale: [0.8, 2.6] });
    materials.push(material);
    group.add(mesh);
  }

  // 3. Трубчатые губки
  {
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.85, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.3,
    });
    patchUnderwater(material, { caustics: 0.8 });
    const mesh = new THREE.InstancedMesh(tubeSponges(55), material, TYPE_COUNT.sponge);
    mesh.frustumCulled = false;
    place(mesh, TYPE_COUNT.sponge, { hue: 0.83, hueSpread: 0.12, sat: 0.4, light: 0.55, scale: [0.7, 1.6] });
    materials.push(material);
    group.add(mesh);
  }

  // 4. Веера-горгонарии: покачиваются на течении
  {
    const material = new THREE.MeshStandardMaterial({
      map: fanTex, alphaMap: fanTex, alphaTest: 0.42, transparent: false,
      color: 0xff9ec4, roughness: 0.65, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.35,
    });
    patchUnderwater(material, { caustics: 0.9, wave: 'sway', waveAmp: 0.14, waveSpeed: 0.9 });
    const count = TYPE_COUNT.fan;
    const mesh = new THREE.InstancedMesh(seaFan(), material, count);
    mesh.frustumCulled = false;
    addPhase(mesh, count);
    place(mesh, count, { hue: 0.93, hueSpread: 0.12, sat: 0.55, light: 0.6, scale: [0.7, 1.7], sink: 0.02 });
    materials.push(material);
    group.add(mesh);
  }

  // 5. Актинии
  {
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0, envMapIntensity: 0.4 });
    patchUnderwater(material, { caustics: 0.95, wave: 'sway', waveAmp: 0.1, waveSpeed: 1.35 });
    const count = TYPE_COUNT.anemone;
    const mesh = new THREE.InstancedMesh(anemone(77), material, count);
    mesh.frustumCulled = false;
    addPhase(mesh, count);
    place(mesh, count, { hue: 0.46, hueSpread: 0.14, sat: 0.6, light: 0.55, scale: [0.6, 1.15], sink: 0.05 });
    materials.push(material);
    group.add(mesh);
  }

  // 6. Морская трава: густые куртины у края поляны
  {
    const material = new THREE.MeshStandardMaterial({
      color: 0x6fbf62, roughness: 0.75, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.3,
    });
    patchUnderwater(material, { caustics: 0.85, wave: 'sway', waveAmp: 0.42, waveSpeed: 1.15 });
    const count = TYPE_COUNT.grass;
    const mesh = new THREE.InstancedMesh(seagrass(), material, count);
    mesh.frustumCulled = false;
    addPhase(mesh, count);
    place(mesh, count, {
      hue: 0.28, hueSpread: 0.08, sat: 0.45, light: 0.42, scale: [0.7, 1.8], sink: 0.02,
      minR: WORLD.clearing * 0.7, maxR: WORLD.reefRadius * 0.9, tilt: 0.3, shadow: 0.35,
    });
    materials.push(material);
    group.add(mesh);
  }

  // 7. Ближний план: несколько крупных кораллов в 6…9 м от пловца.
  //    Без них передний край кадра был пустым песком — не за что зацепиться
  //    глазу, и стерео-параллакс не читается. Сектор прямо вперёд оставлен
  //    свободным, чтобы взгляд по умолчанию не упирался в коралл.
  {
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.68, metalness: 0, envMapIntensity: 0.4 });
    patchUnderwater(material, { caustics: 1.05 });
    const mesh = new THREE.InstancedMesh(branchCoral(313), material, 12);
    mesh.frustumCulled = false;
    place(mesh, 12, {
      hue: 0.06, hueSpread: 0.12, sat: 0.6, light: 0.55, scale: [1.2, 2.1],
      minR: 6.4, maxR: 9.0, sink: 0.2, tilt: 0.12, keepClear: 0.62, shadow: 0.75,
    });
    materials.push(material);
    group.add(mesh);
  }
  {
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.58, metalness: 0, envMapIntensity: 0.45 });
    patchUnderwater(material, { caustics: 1.0 });
    const mesh = new THREE.InstancedMesh(brainCoral(29), material, 9);
    mesh.frustumCulled = false;
    place(mesh, 9, {
      hue: 0.1, hueSpread: 0.16, sat: 0.42, light: 0.5, scale: [1.1, 1.9],
      minR: 6.8, maxR: 9.4, sink: 0.25, tilt: 0.14, keepClear: 0.62, shadow: 0.8,
    });
    materials.push(material);
    group.add(mesh);
  }

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
