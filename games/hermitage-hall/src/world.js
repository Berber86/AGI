// Парадный зал: архитектура, свет, люстры, мебель. Всё статичное склеивается
// по материалам, чтобы в стерео-режиме было немного draw calls.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { HALL, WALL, LIGHT } from './config.js';
import {
  parquetTexture, silkTexture, marbleTexture, malachiteTexture, plafondTexture,
  rugTexture, windowViewTexture, doorTexture, grainTexture, mirrorTexture, setTextureScale,
} from './textures.js';

const GOLD = 0xc8a45c;

export function createMaterials(quality = 'high') {
  setTextureScale(quality === 'high' ? 1 : 0.55);
  const parquet = parquetTexture();
  parquet.repeat.set(1, 1);
  const silk = silkTexture();
  const marble = marbleTexture();
  const malachite = malachiteTexture();
  const plafond = plafondTexture();
  const rug = rugTexture();
  const view = windowViewTexture();
  const door = doorTexture();
  const grain = grainTexture();
  const mirror = mirrorTexture();
  const high = quality === 'high';
  return {
    parquet: new THREE.MeshStandardMaterial({ map: parquet, roughness: 0.38, metalness: 0.06, color: 0xffffff }),
    silk: new THREE.MeshStandardMaterial({ map: silk, roughness: 0.74, metalness: 0.03, color: 0xdfe8df }),
    marble: new THREE.MeshStandardMaterial({ map: marble, roughness: 0.32, metalness: 0.05, color: 0xf2f0e8 }),
    malachite: new THREE.MeshStandardMaterial({ map: malachite, roughness: 0.24, metalness: 0.32, color: 0xffffff }),
    gold: new THREE.MeshStandardMaterial({ color: 0xe6c47c, roughness: high ? 0.3 : 0.42, metalness: 0.85, roughnessMap: high ? grain : null, emissive: 0x2a1f0c, emissiveIntensity: 0.35 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xa88a4a, roughness: 0.44, metalness: 0.92 }),
    cream: new THREE.MeshStandardMaterial({ color: 0xe9e1cf, roughness: 0.8, metalness: 0.02 }),
    plaster: new THREE.MeshStandardMaterial({ color: 0xf0e9da, roughness: 0.9, metalness: 0 }),
    wood: new THREE.MeshStandardMaterial({ map: door, roughness: 0.42, metalness: 0.08, color: 0xffffff }),
    velvet: new THREE.MeshStandardMaterial({ color: 0x6d1a26, roughness: 0.92, metalness: 0 }),
    rug: new THREE.MeshStandardMaterial({ map: rug, roughness: 0.95, metalness: 0 }),
    plafond: new THREE.MeshStandardMaterial({ map: plafond, roughness: 0.86, metalness: 0.02, color: 0xdfe6f0, emissive: 0x3b4a63, emissiveIntensity: 0.42, emissiveMap: plafond }),
    ceiling: new THREE.MeshStandardMaterial({ color: 0xe6dcc6, roughness: 0.9, metalness: 0.02, emissive: 0x3a2f22, emissiveIntensity: 0.55 }),
    windowView: new THREE.MeshBasicMaterial({ map: view, toneMapped: false, color: 0xf3e6d2 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xbcd4e0, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
    crystal: new THREE.MeshStandardMaterial({ color: 0xfff4dd, roughness: 0.06, metalness: 0.2, transparent: true, opacity: 0.82, emissive: 0xffe2ae, emissiveIntensity: 0.28, depthWrite: false }),
    flame: new THREE.MeshStandardMaterial({ color: 0xffdda0, emissive: 0xffbe6a, emissiveIntensity: 2.4, roughness: 0.5 }),
    iron: new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.62, metalness: 0.65 }),
    mirror: new THREE.MeshStandardMaterial({ map: mirror, color: 0x8b9994, roughness: 0.3, metalness: 0.45, envMapIntensity: 0.7, emissive: 0x0a100f, emissiveIntensity: 0.6 }),
    malachitePanel: new THREE.MeshStandardMaterial({ map: malachite, color: 0x9fdcb8, roughness: 0.3, metalness: 0.25, emissive: 0x0c2a1c, emissiveIntensity: 0.5 }),
    ember: new THREE.MeshStandardMaterial({ color: 0x3a1408, emissive: 0xff6a1e, emissiveIntensity: 1.3, roughness: 0.9 }),
  };
}

/** Сборщик статики: копит геометрию по материалам и склеивает её. */
export class Kit {
  constructor() {
    this.buckets = new Map();
    this.matrix = new THREE.Matrix4();
    this.quat = new THREE.Quaternion();
    this.scale = new THREE.Vector3(1, 1, 1);
    this.pos = new THREE.Vector3();
  }

  add(geometry, material, { position = [0, 0, 0], rotationY = 0, rotation = null, uvScale = null } = {}) {
    const g = geometry.index ? geometry : geometry;
    if (uvScale) {
      const uv = g.getAttribute('uv');
      if (uv) {
        const [su, sv] = Array.isArray(uvScale) ? uvScale : [uvScale, uvScale];
        for (let i = 0; i < uv.count; i += 1) {
          uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
        }
        uv.needsUpdate = true;
      }
    }
    this.pos.set(position[0], position[1], position[2]);
    if (rotation) {
      this.quat.setFromEuler(new THREE.Euler(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0));
    } else {
      this.quat.setFromEuler(new THREE.Euler(0, rotationY, 0));
    }
    this.matrix.compose(this.pos, this.quat, this.scale);
    g.applyMatrix4(this.matrix);
    if (!this.buckets.has(material)) this.buckets.set(material, []);
    this.buckets.get(material).push(g);
    return g;
  }

  box(w, h, d, material, position, opts = {}) {
    return this.add(new THREE.BoxGeometry(w, h, d), material, { position, ...opts });
  }

  plane(w, h, material, position, opts = {}) {
    const g = new THREE.PlaneGeometry(w, h, opts.segX || 1, opts.segY || 1);
    return this.add(g, material, { position, ...opts });
  }

  cylinder(rTop, rBottom, h, material, position, opts = {}) {
    return this.add(new THREE.CylinderGeometry(rTop, rBottom, h, opts.segments || 16), material, { position, ...opts });
  }

  build(group, { castShadow = false, receiveShadow = true } = {}) {
    let meshes = 0;
    for (const [material, list] of this.buckets) {
      if (!list.length) continue;
      const merged = mergeGeometries(list, false);
      if (!merged) continue;
      merged.computeBoundingSphere();
      const mesh = new THREE.Mesh(merged, material);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      group.add(mesh);
      meshes += 1;
      list.forEach((g) => g.dispose());
    }
    this.buckets.clear();
    return meshes;
  }
}

function wallPanel(kit, materials, { width, height, position, rotationY, uv }) {
  const g = new THREE.PlaneGeometry(width, height);
  kit.add(g, materials.silk, { position, rotationY, uvScale: uv || [width / 3.6, height / 3.6] });
}

/** Задняя стена с окнами на востоке. */
function buildEastWall(kit, materials) {
  const x = WALL.xEast;
  const t = HALL.wallThickness;
  const halfDepth = HALL.depth / 2;
  const sill = 0.95;
  const top = 5.15;
  const openings = [-4.0, 0, 4.0];
  const width = 2.2;

  // Простенки между окнами
  const edges = [];
  let z = -halfDepth;
  for (const center of openings) {
    edges.push([z, center - width / 2]);
    z = center + width / 2;
  }
  edges.push([z, halfDepth]);
  for (const [z0, z1] of edges) {
    const w = z1 - z0;
    if (w <= 0.01) continue;
    const cz = (z0 + z1) / 2;
    wallPanel(kit, materials, { width: w, height: HALL.height, position: [x, HALL.height / 2, cz], rotationY: -Math.PI / 2, uv: [w / 3.6, HALL.height / 3.6] });
  }
  // Подоконная часть и фриз над окнами
  for (const center of openings) {
    wallPanel(kit, materials, { width, height: sill, position: [x, sill / 2, center], rotationY: -Math.PI / 2, uv: [width / 3.6, sill / 3.6] });
    wallPanel(kit, materials, { width, height: HALL.height - top, position: [x, (top + HALL.height) / 2, center], rotationY: -Math.PI / 2, uv: [width / 3.6, (HALL.height - top) / 3.6] });
  }

  // Тонкая внешняя обшивка только по простенкам: сплошная коробка заблокировала бы солнце.
  for (const [z0, z1] of edges) {
    const w = z1 - z0;
    if (w <= 0.01) continue;
    kit.box(t, HALL.height, w, materials.plaster, [x + t / 2 + 0.02, HALL.height / 2, (z0 + z1) / 2]);
  }

  // Окна: рамы, переплёт, стекло, вид на Неву
  for (const center of openings) {
    const frameW = width + 0.22;
    // наличник
    kit.box(0.14, top - sill + 0.3, 0.16, materials.gold, [x - 0.06, (sill + top) / 2, center - frameW / 2]);
    kit.box(0.14, top - sill + 0.3, 0.16, materials.gold, [x - 0.06, (sill + top) / 2, center + frameW / 2]);
    kit.box(0.14, 0.16, frameW, materials.gold, [x - 0.06, top + 0.07, center]);
    kit.box(0.26, 0.2, frameW + 0.2, materials.marble, [x - 0.16, sill - 0.02, center]);
    // переплёт
    kit.box(0.09, top - sill, 0.09, materials.cream, [x - 0.03, (sill + top) / 2, center]);
    for (const dz of [-width / 4, width / 4]) {
      kit.box(0.08, top - sill, 0.07, materials.cream, [x - 0.03, (sill + top) / 2, center + dz]);
    }
    for (const y of [sill + 1.35, sill + 2.7]) {
      kit.box(0.08, 0.07, width, materials.cream, [x - 0.03, y, center]);
    }
    // стекло
    const glass = new THREE.PlaneGeometry(width, top - sill);
    kit.add(glass, materials.glass, { position: [x - 0.02, (sill + top) / 2, center], rotationY: -Math.PI / 2 });
    // вид снаружи
    const view = new THREE.PlaneGeometry(width * 2.4, (top - sill) * 1.9);
    kit.add(view, materials.windowView, { position: [x + 1.4, (sill + top) / 2 + 0.15, center], rotationY: -Math.PI / 2 });
  }
}

function buildWalls(kit, materials) {
  const halfW = HALL.width / 2;
  const halfD = HALL.depth / 2;
  // северная и южная
  wallPanel(kit, materials, { width: HALL.width, height: HALL.height, position: [0, HALL.height / 2, WALL.zNorth], rotationY: 0 });
  wallPanel(kit, materials, { width: HALL.width, height: HALL.height, position: [0, HALL.height / 2, WALL.zSouth], rotationY: Math.PI });
  // западная
  wallPanel(kit, materials, { width: HALL.depth, height: HALL.height, position: [WALL.xWest, HALL.height / 2, 0], rotationY: Math.PI / 2 });
  buildEastWall(kit, materials);

  // Плинт, карниз и золочёные тяги по периметру
  const runGold = (w, d, x, z, rotY, y, height = 0.09) => {
    kit.box(w, height, d, materials.gold, [x, y, z], { rotationY: rotY });
  };
  const sides = [
    { w: HALL.width, x: 0, z: WALL.zNorth + 0.03, rotY: 0 },
    { w: HALL.width, x: 0, z: WALL.zSouth - 0.03, rotY: 0 },
    { w: HALL.depth, x: WALL.xWest + 0.03, z: 0, rotY: Math.PI / 2 },
    { w: HALL.depth, x: WALL.xEast - 0.03, z: 0, rotY: Math.PI / 2 },
  ];
  for (const s of sides) {
    kit.box(s.w, 0.34, 0.12, materials.marble, [s.x, 0.17, s.z], { rotationY: s.rotY });
    kit.box(s.w, 0.06, 0.16, materials.gold, [s.x, 0.36, s.z], { rotationY: s.rotY });
    runGold(s.w, 0.14, s.x, s.z, s.rotY, 1.02);
    runGold(s.w, 0.1, s.x, s.z, s.rotY, 1.16);
    // карниз
    kit.box(s.w, 0.3, 0.34, materials.gold, [s.x * 0.999, HALL.height - 0.32, s.z], { rotationY: s.rotY });
    kit.box(s.w, 0.08, 0.5, materials.cream, [s.x * 0.997, HALL.height - 0.12, s.z], { rotationY: s.rotY });
  }

  // Пилястры по стенам
  const pilaster = (x, z, rotY) => {
    kit.box(0.46, HALL.height - 0.7, 0.16, materials.marble, [x, (HALL.height - 0.7) / 2, z], { rotationY: rotY, uvScale: [0.6, 2] });
    kit.box(0.6, 0.2, 0.24, materials.gold, [x, HALL.height - 0.82, z], { rotationY: rotY });
    kit.box(0.58, 0.14, 0.22, materials.gold, [x, 0.42, z], { rotationY: rotY });
  };
  // Только свободные простенки: пилястры не должны резать полотна.
  for (const x of [-7.4, 1.85, -1.85, 7.4]) {
    pilaster(x, WALL.zNorth + 0.1, 0);
    pilaster(x, WALL.zSouth - 0.1, 0);
  }
  for (const z of [-5.55, 5.55]) {
    pilaster(WALL.xWest + 0.1, z, Math.PI / 2);
  }
  for (const z of [-2.0, 2.0, 5.15, -5.15]) {
    pilaster(WALL.xEast - 0.1, z, Math.PI / 2);
  }
}

function buildCeilingAndFloor(kit, materials) {
  const halfW = HALL.width / 2;
  const halfD = HALL.depth / 2;
  // Пол
  const floor = new THREE.PlaneGeometry(HALL.width, HALL.depth);
  kit.add(floor, materials.parquet, { position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0], uvScale: [HALL.width / 3, HALL.depth / 3] });
  // Ковёр
  const rug = new THREE.PlaneGeometry(8.4, 5.6);
  kit.add(rug, materials.rug, { position: [0, 0.014, 0.4], rotation: [-Math.PI / 2, 0, 0], uvScale: [1, 1] });
  // Потолок
  const ceil = new THREE.PlaneGeometry(HALL.width, HALL.depth);
  kit.add(ceil, materials.ceiling, { position: [0, HALL.height, 0], rotation: [Math.PI / 2, 0, 0] });
  // Плафон
  const plafond = new THREE.PlaneGeometry(11.6, 7.2);
  kit.add(plafond, materials.plafond, { position: [0, HALL.height - 0.03, 0], rotation: [Math.PI / 2, 0, 0] });
  // Золочёные рёбра потолка
  for (const x of [-4.4, 0, 4.4]) {
    kit.box(0.16, 0.14, HALL.depth - 0.6, materials.gold, [x, HALL.height - 0.12, 0]);
  }
  for (const z of [-3.2, 0, 3.2]) {
    kit.box(HALL.width - 0.6, 0.14, 0.16, materials.gold, [0, HALL.height - 0.12, z]);
  }
  // Розетки под люстры
  for (const c of LIGHT.chandeliers) {
    kit.cylinder(0.42, 0.52, 0.1, materials.gold, [c.position[0], HALL.height - 0.16, c.position[2]], { segments: 24 });
    kit.cylinder(0.3, 0.3, 0.06, materials.cream, [c.position[0], HALL.height - 0.22, c.position[2]], { segments: 20 });
  }
  void halfW;
  void halfD;
}

function buildFireplace(kit, materials) {
  const z = WALL.zNorth + 0.02;
  // мраморный портал
  kit.box(3.0, 0.18, 0.62, materials.marble, [0, 0.09, z + 0.31]);
  kit.box(0.42, 1.5, 0.5, materials.marble, [-1.2, 0.75, z + 0.25]);
  kit.box(0.42, 1.5, 0.5, materials.marble, [1.2, 0.75, z + 0.25]);
  kit.box(3.0, 0.34, 0.56, materials.marble, [0, 1.6, z + 0.28]);
  kit.box(3.2, 0.12, 0.66, materials.gold, [0, 1.82, z + 0.33]);
  // топка: тёмная камера, дрова и слабые угли
  // камера топки: закопчённая кирпичная коробка глубиной 0,45 м
  const soot = new THREE.MeshStandardMaterial({ color: 0x191310, roughness: 1 });
  kit.box(1.98, 1.44, 0.04, soot, [0, 0.72, z + 0.06]);
  kit.box(0.04, 1.44, 0.42, soot, [-0.97, 0.72, z + 0.27]);
  kit.box(0.04, 1.44, 0.42, soot, [0.97, 0.72, z + 0.27]);
  kit.box(1.98, 0.04, 0.42, soot, [0, 1.43, z + 0.27]);
  kit.box(1.98, 0.04, 0.42, soot, [0, 0.02, z + 0.27]);
  // тёплое зарево в топке: аддитивная плоскость вместо ещё одного источника света
  if (!materials.fireGlow) {
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128;
    glowCanvas.height = 64;
    const gctx = glowCanvas.getContext('2d');
    const grad = gctx.createRadialGradient(64, 52, 2, 64, 52, 62);
    grad.addColorStop(0, 'rgba(255, 176, 96, 0.85)');
    grad.addColorStop(0.45, 'rgba(255, 120, 42, 0.32)');
    grad.addColorStop(1, 'rgba(255, 90, 20, 0)');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 128, 64);
    const tex = new THREE.CanvasTexture(glowCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    materials.fireGlow = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    });
  }
  kit.add(new THREE.PlaneGeometry(1.2, 0.5), materials.fireGlow, { position: [0, 0.34, z + 0.42], uvScale: [1, 1] });
  // под зола и угли
  kit.box(1.5, 0.06, 0.16, new THREE.MeshStandardMaterial({ color: 0x241812, roughness: 1 }), [0, 0.16, z + 0.32]);
  kit.box(1.24, 0.03, 0.13, materials.ember, [0, 0.2, z + 0.33]);
  // дрова в топке
  for (let i = 0; i < 3; i += 1) {
    kit.cylinder(0.07, 0.07, 0.8, materials.wood, [-0.14 + i * 0.14, 0.27 + (i % 2) * 0.09, z + 0.31], { segments: 8, rotation: [0, 0, Math.PI / 2] });
  }
  // каминная решётка — тонкая, перед дровами
  for (let i = -3; i <= 3; i += 1) {
    kit.box(0.018, 0.42, 0.018, materials.iron, [i * 0.28, 0.28, z + 0.44]);
  }
  kit.box(1.72, 0.018, 0.018, materials.iron, [0, 0.49, z + 0.44]);
  // Над камином — золочёный картуш с малахитовым полем: так делали в парадных залах.
  kit.box(2.56, 2.96, 0.12, materials.gold, [0, 3.58, z + 0.28]);
  kit.box(2.28, 2.68, 0.06, materials.malachitePanel, [0, 3.58, z + 0.36]);
  kit.box(2.06, 2.46, 0.03, materials.ceiling, [0, 3.58, z + 0.375]);
  // золочёный медальон-розетка
  kit.add(new THREE.TorusGeometry(0.52, 0.05, 10, 40), materials.gold, { position: [0, 3.66, z + 0.44] });
  kit.add(new THREE.TorusGeometry(0.3, 0.035, 8, 32), materials.brass, { position: [0, 3.66, z + 0.45] });
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    kit.box(0.05, 0.24, 0.03, materials.gold, [Math.cos(a) * 0.41, 3.66 + Math.sin(a) * 0.41, z + 0.46], { rotation: [0, 0, a - Math.PI / 2] });
  }
  kit.cylinder(0.1, 0.1, 0.04, materials.gold, [0, 3.66, z + 0.47], { segments: 16, rotation: [Math.PI / 2, 0, 0] });
  // угловые розетки поля
  for (const [dx, dy] of [[-0.88, 1.02], [0.88, 1.02], [-0.88, -1.02], [0.88, -1.02]]) {
    kit.add(new THREE.TorusGeometry(0.13, 0.025, 8, 20), materials.gold, { position: [dx, 3.58 + dy, z + 0.4] });
  }

}

function buildDoors(kit, materials) {
  const z = WALL.zSouth - 0.02;
  // портал
  kit.box(3.9, 0.26, 0.5, materials.marble, [0, 4.85, z - 0.25]);
  kit.box(0.55, 4.9, 0.5, materials.marble, [-1.95, 2.45, z - 0.25]);
  kit.box(0.55, 4.9, 0.5, materials.marble, [1.95, 2.45, z - 0.25]);
  kit.box(4.4, 0.12, 0.6, materials.gold, [0, 4.98, z - 0.3]);
  // створки
  for (const side of [-1, 1]) {
    const panel = new THREE.PlaneGeometry(1.34, 4.3);
    kit.add(panel, materials.wood, { position: [side * 0.68, 2.15, z - 0.16], rotationY: Math.PI, uvScale: [1, 1] });
    kit.box(1.44, 0.1, 0.12, materials.gold, [side * 0.68, 4.34, z - 0.16]);
    kit.box(1.44, 0.1, 0.12, materials.gold, [side * 0.68, 0.06, z - 0.16]);
    kit.cylinder(0.045, 0.045, 0.34, materials.gold, [side * 0.16, 2.05, z - 0.26], { segments: 10 });
  }
}

function buildChandelier(kit, materials, group, position) {
  const [x, y, z] = position;
  kit.cylinder(0.018, 0.018, HALL.height - y - 0.55, materials.brass, [x, (HALL.height + y) / 2 - 0.1, z], { segments: 8 });
  kit.cylinder(0.06, 0.06, 0.65, materials.brass, [x, y + 0.65, z], { segments: 10 });
  kit.add(new THREE.TorusGeometry(0.62, 0.035, 8, 32), materials.brass, { position: [x, y + 0.12, z], rotation: [Math.PI / 2, 0, 0] });
  kit.add(new THREE.TorusGeometry(0.44, 0.03, 8, 28), materials.brass, { position: [x, y + 0.62, z], rotation: [Math.PI / 2, 0, 0] });
  kit.add(new THREE.TorusGeometry(0.8, 0.028, 8, 36), materials.brass, { position: [x, y - 0.18, z], rotation: [Math.PI / 2, 0, 0] });

  const count = 8;
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2;
    const cx = x + Math.cos(a) * 0.8;
    const cz = z + Math.sin(a) * 0.8;
    kit.cylinder(0.026, 0.026, 0.26, materials.silk, [cx, y + 0.1, cz], { segments: 6 });
    kit.cylinder(0.022, 0.022, 0.16, materials.cream, [cx, y + 0.29, cz], { segments: 6 });
    const flame = new THREE.SphereGeometry(0.04, 8, 6);
    kit.add(flame, materials.flame, { position: [cx, y + 0.42, cz] });
    // плечо к центральному стеблю
    const armLen = 0.8;
    const arm = new THREE.CylinderGeometry(0.014, 0.014, Math.hypot(armLen, 0.3), 6);
    kit.add(arm, materials.brass, {
      position: [x + Math.cos(a) * 0.4, y + 0.24, z + Math.sin(a) * 0.4],
      rotation: [0, -a, Math.PI / 2 - Math.atan2(0.3, 0.8)],
    });
  }

  // хрустальные подвески
  const geo = new THREE.IcosahedronGeometry(0.05, 0);
  const inst = new THREE.InstancedMesh(geo, materials.crystal, 96);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3(1, 1.6, 1);
  let n = 0;
  for (let i = 0; i < 30; i += 1) {
    const a = (i / 30) * Math.PI * 2;
    for (const r of [0.62, 0.8]) {
      q.setFromEuler(new THREE.Euler(0, -a, 0));
      m.compose(new THREE.Vector3(x + Math.cos(a) * r, y - 0.06 - (r > 0.7 ? 0.12 : 0), z + Math.sin(a) * r), q, s);
      inst.setMatrixAt(n, m);
      n += 1;
    }
  }
  for (let i = 0; i < 36; i += 1) {
    const a = (i / 36) * Math.PI * 2;
    q.setFromEuler(new THREE.Euler(0, -a, 0));
    m.compose(new THREE.Vector3(x + Math.cos(a) * 0.46, y + 0.44, z + Math.sin(a) * 0.46), q, s);
    inst.setMatrixAt(n, m);
    n += 1;
  }
  inst.count = n;
  inst.instanceMatrix.needsUpdate = true;
  inst.castShadow = false;
  inst.frustumCulled = false;
  group.add(inst);
}

function buildBenches(kit, materials) {
  const bench = (x, z) => {
    kit.box(1.7, 0.16, 0.58, materials.velvet, [x, 0.46, z]);
    kit.box(1.74, 0.06, 0.62, materials.gold, [x, 0.37, z]);
    for (const dx of [-0.72, 0.72]) {
      for (const dz of [-0.22, 0.22]) {
        kit.box(0.07, 0.36, 0.07, materials.gold, [x + dx, 0.18, z + dz]);
      }
    }
    kit.box(1.6, 0.04, 0.5, materials.velvet, [x, 0.55, z]);
  };
  bench(-3.0, 5.35);
  bench(3.0, 5.35);
  bench(-6.3, 4.2);
}

function buildSconces(kit, materials) {
  const spots = [
    [WALL.xWest + 0.1, 4.5, -5.4, Math.PI / 2],
    [WALL.xWest + 0.1, 4.5, 5.4, Math.PI / 2],
    [-6.6, 4.5, WALL.zNorth + 0.1, 0],
    [6.6, 4.5, WALL.zNorth + 0.1, 0],
    [-6.6, 4.5, WALL.zSouth - 0.1, 0],
    [6.6, 4.5, WALL.zSouth - 0.1, 0],
  ];
  for (const [x, y, z, rotY] of spots) {
    kit.box(0.16, 0.5, 0.1, materials.gold, [x, y, z], { rotationY: rotY });
    for (const dz of [-0.18, 0, 0.18]) {
      const ox = rotY === 0 ? x + dz : x + 0.16;
      const oz = rotY === 0 ? z + 0.16 : z + dz;
      kit.cylinder(0.018, 0.018, 0.2, materials.brass, [ox, y + 0.24, oz], { segments: 6 });
      const flame = new THREE.SphereGeometry(0.035, 8, 6);
      kit.add(flame, materials.flame, { position: [ox, y + 0.4, oz] });
    }
  }
}

function blobTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.24)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let blobMap = null;
export function shadowBlob(width, depth, x, z, opacity = 0.55) {
  if (!blobMap) blobMap = blobTexture();
  const mat = new THREE.MeshBasicMaterial({ map: blobMap, transparent: true, depthWrite: false, opacity, color: 0x000000 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.02, z);
  mesh.renderOrder = 1;
  return mesh;
}

export function buildWorld(scene, materials, { quality = 'high' } = {}) {
  const group = new THREE.Group();
  group.name = 'hall';
  const kit = new Kit();

  buildCeilingAndFloor(kit, materials);
  buildWalls(kit, materials);
  buildFireplace(kit, materials);
  buildDoors(kit, materials);
  buildBenches(kit, materials);
  buildSconces(kit, materials);
  for (const c of LIGHT.chandeliers) buildChandelier(kit, materials, group, c.position);

  const meshes = kit.build(group, { castShadow: quality === 'high', receiveShadow: true });

  // Мягкие контактные тени — дешевле, чем второй проход теней.
  group.add(shadowBlob(2.6, 2.6, 0, WALL.zNorth + 0.7, 0.5));
  group.add(shadowBlob(1.9, 2.6, -3.0, 5.35, 0.34));
  group.add(shadowBlob(1.9, 2.6, 3.0, 5.35, 0.34));
  group.add(shadowBlob(1.9, 2.6, -6.3, 4.2, 0.3));

  scene.add(group);
  return { group, meshes };
}

export function createLights(scene) {
  const lights = new THREE.Group();
  lights.name = 'lights';
  const hemi = new THREE.HemisphereLight(LIGHT.sky.color, LIGHT.sky.ground, LIGHT.sky.intensity);
  lights.add(hemi);
  // Мягкий верхний заполняющий свет: потолок и карнизы перестают быть чёрными.
  const fill = new THREE.DirectionalLight(0xdfe8f2, 0.95);
  fill.position.set(-4, 12, 8);
  fill.target.position.set(0, 1, 0);
  lights.add(fill, fill.target);

  const sun = new THREE.DirectionalLight(LIGHT.sun.color, LIGHT.sun.intensity);
  sun.position.set(...LIGHT.sun.position);
  sun.target.position.set(0, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -11;
  sun.shadow.camera.right = 11;
  sun.shadow.camera.top = 9;
  sun.shadow.camera.bottom = -9;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 40;
  sun.shadow.bias = -0.0009;
  sun.shadow.normalBias = 0.02;
  lights.add(sun);
  lights.add(sun.target);

  for (const c of LIGHT.chandeliers) {
    const p = new THREE.PointLight(c.color, c.intensity, 15, 2);
    p.position.set(...c.position);
    lights.add(p);
  }

  // Отсвет камина больше не отдельный источник: угли светятся сами, а каждый
  // лишний PointLight — это ещё один цикл освещения в шейдере каждого фрагмента.

  // Мягкая подсветка стен с живописью (без теней).
  const spots = [
    { position: [0, 6.2, -3.4], target: [0, 3.0, -6.4], angle: 1.0, intensity: 12 },
    { position: [-4.9, 6.2, 0], target: [-8.9, 3.2, 0], angle: 1.05, intensity: 17 },
    { position: [0, 6.2, 3.4], target: [0, 3.0, 6.4], angle: 0.95, intensity: 13 },
  ];
  for (const s of spots) {
    const light = new THREE.SpotLight(0xffe9c8, s.intensity, 14, s.angle, 0.85, 1.6);
    light.position.set(...s.position);
    light.target.position.set(...s.target);
    lights.add(light);
    lights.add(light.target);
  }

  scene.add(lights);
  return { lights, sun, hemi };
}
