// Картины, рамы, таблички, подсветка полотен и скульптуры на плинтах.

import * as THREE from 'three';
import { ARTWORKS, SCULPTURES, wallFacing } from './config.js';
import { plaqueTexture, marbleTexture, malachiteTexture } from './textures.js';
import { shadowBlob } from './world.js';

const loader = new THREE.TextureLoader();

function placeholderTexture(color = '#3a2a1a') {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 64, 64);
  g.addColorStop(0, color);
  g.addColorStop(1, '#16110c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function loadArtworkTexture(file) {
  return new Promise((resolve) => {
    loader.load(
      file,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.needsUpdate = true;
        resolve(texture);
      },
      undefined,
      () => resolve(null),
    );
  });
}

/**
 * Рама и полотно. Возвращает группу, плоскость полотна (для замены карты)
 * и данные для наведения взгляда.
 */
export function buildPainting(art, materials, quality) {
  const group = new THREE.Group();
  group.name = `painting:${art.id}`;
  const [x, y, z] = art.position;
  group.position.set(x, y, z);
  group.rotation.y = art.rotationY;

  const w = art.width;
  const h = art.height;
  const depth = 0.1;
  const frameW = Math.min(0.24, Math.max(0.13, w * 0.052));

  // Полотно
  const canvasMat = new THREE.MeshStandardMaterial({
    map: placeholderTexture('#2b2117'),
    roughness: 0.78,
    metalness: 0.02,
    emissive: 0xffffff,
    emissiveIntensity: quality === 'high' ? 0.16 : 0.22,
    emissiveMap: null,
  });
  const canvas = new THREE.Mesh(new THREE.PlaneGeometry(w, h), canvasMat);
  canvas.position.z = 0.062;
  canvas.receiveShadow = true;
  canvas.name = `canvas:${art.id}`;
  group.add(canvas);

  // Подрамник — заметно позади полотна, иначе z-fighting съедает живопись
  const backing = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, h + 0.02, 0.06), materials.wood);
  backing.position.z = 0.012;
  group.add(backing);

  // Рама: ступенчатый профиль из трёх вложенных брусов
  const bar = (bw, bh, bd, ox, oy, oz, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), material);
    mesh.position.set(ox, oy, oz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };
  const outerW = w + frameW * 2;
  const outerH = h + frameW * 2;
  const yTop = h / 2 + frameW / 2;
  const xSide = w / 2 + frameW / 2;
  bar(outerW, frameW, depth, 0, yTop, 0.02, materials.gold);
  bar(outerW, frameW, depth, 0, -yTop, 0.02, materials.gold);
  bar(frameW, h, depth, -xSide, 0, 0.02, materials.gold);
  bar(frameW, h, depth, xSide, 0, 0.02, materials.gold);
  // внутренний золочёный фриз
  const lip = frameW * 0.42;
  bar(w + lip * 2, lip, 0.045, 0, h / 2 + lip / 2, 0.078, materials.brass);
  bar(w + lip * 2, lip, 0.045, 0, -h / 2 - lip / 2, 0.078, materials.brass);
  bar(lip, h, 0.045, -w / 2 - lip / 2, 0, 0.078, materials.brass);
  bar(lip, h, 0.045, w / 2 + lip / 2, 0, 0.078, materials.brass);

  // Бра над полотном
  const lightBar = new THREE.Mesh(new THREE.BoxGeometry(Math.min(w * 0.8, 1.7), 0.06, 0.16), materials.brass);
  lightBar.position.set(0, yTop + frameW + 0.16, 0.16);
  group.add(lightBar);
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, Math.min(w * 0.74, 1.56), 10),
    new THREE.MeshStandardMaterial({ color: 0xfff0cf, emissive: 0xffd79b, emissiveIntensity: 1.5, roughness: 0.4 }),
  );
  tube.rotation.z = Math.PI / 2;
  tube.position.set(0, yTop + frameW + 0.12, 0.24);
  group.add(tube);

  // Мягкая подсветка полотна: маленький прожектор без теней и без вклада в draw calls
  const pictureLight = new THREE.SpotLight(0xffe7c2, 9, 4.6, 0.85, 0.9, 1.2);
  pictureLight.position.set(0, yTop + frameW + 0.3, 0.75);
  pictureLight.target.position.set(0, 0, 0);
  pictureLight.castShadow = false;
  group.add(pictureLight, pictureLight.target);

  // Табличка
  const plaqueLines = [art.title, art.author, `${art.year} · ${art.technique.split('.')[0]}`];
  const plaqueTex = plaqueTexture(plaqueLines, { width: 1024, height: 512 });
  const plaqueMat = new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.42, metalness: 0.55 });
  const plaqueW = Math.min(0.78, Math.max(0.5, w * 0.42));
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(plaqueW, plaqueW * 0.42), plaqueMat);
  plaque.position.set(-w / 2 + plaqueW / 2, -h / 2 - frameW - 0.28, 0.055);
  plaque.name = `plaque:${art.id}`;
  group.add(plaque);

  // Крепление к стене
  const facing = wallFacing(art.rotationY);
  const anchor = new THREE.Object3D();
  anchor.position.set(x + facing[0] * 0.4, y, z + facing[2] * 0.4);
  group.add(anchor);

  return { group, canvas, canvasMat, anchor, plaque };
}

export async function loadPaintings(scene, materials, quality, onProgress = () => {}) {
  const built = [];
  let done = 0;
  for (const art of ARTWORKS) {
    const item = buildPainting(art, materials, quality);
    scene.add(item.group);
    built.push({ art, ...item });
    onProgress(done / ARTWORKS.length);
    const texture = await loadArtworkTexture(art.file);
    if (texture) {
      item.canvasMat.map = texture;
      item.canvasMat.emissiveMap = texture;
      item.canvasMat.needsUpdate = true;
    }
    done += 1;
    onProgress(done / ARTWORKS.length);
  }
  return built;
}

function pedestalMaterial(kind) {
  if (kind === 'malachite') {
    const map = malachiteTexture();
    return new THREE.MeshStandardMaterial({ map, roughness: 0.22, metalness: 0.4, color: 0xd6f2df, emissive: 0x0d2a1c, emissiveIntensity: 0.6 });
  }
  const map = marbleTexture();
  return new THREE.MeshStandardMaterial({ map, roughness: 0.34, metalness: 0.04, color: 0xf4f1e8 });
}

export async function loadSculptures(scene, materials, onProgress = () => {}) {
  const items = [];
  let done = 0;
  for (const spec of SCULPTURES) {
    const group = new THREE.Group();
    group.name = `sculpture:${spec.id}`;
    group.position.set(...spec.position);
    group.rotation.y = spec.rotationY;

    const pedestal = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, spec.standHeight, 0.86),
      pedestalMaterial(spec.stand),
    );
    pedestal.position.y = spec.standHeight / 2;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    group.add(pedestal);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.08, 0.98), materials.gold);
    cap.position.y = spec.standHeight + 0.02;
    cap.castShadow = true;
    group.add(cap);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.09, 0.98), materials.gold);
    base.position.y = 0.045;
    group.add(base);

    let mesh = null;
    try {
      const res = await fetch(spec.file);
      if (res.ok) {
        const data = await res.json();
        const positions = new Float32Array(data.vertices.length * 3);
        data.vertices.forEach((v, i) => {
          positions[i * 3] = v[0];
          positions[i * 3 + 1] = v[1];
          positions[i * 3 + 2] = v[2];
        });
        const index = [];
        data.faces.forEach((f) => index.push(f[0], f[1], f[2]));
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setIndex(index);
        geo.computeVertexNormals();
        geo.computeBoundingSphere();
        const scale = (spec.modelHeight * spec.scale) / Math.max(0.001, data.height || spec.modelHeight);
        const statueMat = new THREE.MeshStandardMaterial({
          color: 0xf1ead9,
          roughness: 0.42,
          metalness: 0.03,
          flatShading: true,
          emissive: 0x120f0a,
          emissiveIntensity: 0.6,
        });
        mesh = new THREE.Mesh(geo, statueMat);
        mesh.scale.setScalar(scale);
        mesh.position.y = spec.standHeight + 0.06;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `statue:${spec.id}`;
        group.add(mesh);
        group.userData.meta = data;
      }
    } catch (err) {
      console.warn('sculpture failed', spec.id, err);
    }

    group.add(shadowBlob(2.2, 2.2, 0, 0, 0.42).translateY(0.005));
    scene.add(group);
    items.push({ spec, group, mesh });
    done += 1;
    onProgress(done / SCULPTURES.length);
  }
  return items;
}

export function applyShadowBake(renderer, scene) {
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  scene.traverse((obj) => {
    if (obj.isMesh && obj.material && obj.material.isMeshStandardMaterial) {
      obj.frustumCulled = true;
    }
  });
}
