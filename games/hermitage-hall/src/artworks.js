// Картины, рамы, таблички, подсветка полотен и скульптуры на плинтах.

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { ARTWORKS, SCULPTURES, wallFacing } from './config.js';
import { plaqueTexture, marbleTexture, malachiteTexture, lightPoolTexture } from './textures.js';
import { shadowBlob } from './world.js';

const loader = new THREE.TextureLoader();
let poolTexture = null;
let tubeMaterial = null;
let poolMaterial = null;

/** Картина, к которой ведёт точка: ближайшее полотно к её якорю. */
export function featuredArtwork(point) {
  if (!point || !Array.isArray(point.anchor)) return null;
  let best = null;
  let bestDistance = Infinity;
  for (const art of ARTWORKS) {
    const distance = Math.hypot(
      art.position[0] - point.anchor[0],
      art.position[1] - point.anchor[1],
      art.position[2] - point.anchor[2],
    );
    if (distance < bestDistance) {
      best = art;
      bestDistance = distance;
    }
  }
  return bestDistance <= 3.0 ? best : null;
}

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

export function loadArtworkTexture(file, { anisotropy = 4 } = {}) {
  return new Promise((resolve) => {
    loader.load(
      file,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = anisotropy;
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
 * Полотно в высоком разрешении по требованию.
 *
 * В зале постоянно живут только миниатюры 720 px (около 1,4 МБ на полотно). Файл
 * 2560 px скачивается и декодируется, лишь когда зритель подошёл к этой картине,
 * причём сразу уменьшается до экранного размера: видеопамять не растёт от «полного
 * разрешения с любой дистанции».
 */
function textureFromSource(source, anisotropy = 4) {
  const texture = new THREE.Texture(source);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

async function decodeResized(url, maxLongSide, aspect = 1) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const blob = await response.blob();
  // Ограничиваем ДЛИННУЮ сторону: иначе вертикальное полотно 1689×2200
  // при maxWidth 2048 раздувается до 2048×2668 и съедает 22 МБ видеопамяти.
  const resize = aspect >= 1
    ? { resizeWidth: maxLongSide, resizeQuality: 'high' }
    : { resizeHeight: maxLongSide, resizeQuality: 'high' };

  if (typeof window.createImageBitmap === 'function') {
    try {
      const bitmap = await window.createImageBitmap(blob, resize);
      // Chrome игнорирует UNPACK_FLIP_Y_WEBGL для ImageBitmap, поэтому текстура из
      // битмапа выходит перевёрнутой. Переносим его на canvas — CanvasTexture
      // подчиняется flipY как обычно.
      const scaled = downscaleToCanvas(bitmap, maxLongSide);
      bitmap.close && bitmap.close();
      return scaled;
    } catch {
      /* переходим к запасному пути через Image */
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    return downscaleToCanvas(image, maxWidth);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function downscaleToCanvas(source, maxLongSide) {
  const naturalWidth = source.width || source.naturalWidth;
  const naturalHeight = source.height || source.naturalHeight;
  const scale = Math.min(1, maxLongSide / Math.max(naturalWidth, naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(naturalHeight * scale));
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function createArtworkDetails(paintings, { maxWidth = 1536, maxResident = 2 } = {}) {
  const items = new Map(paintings.map((p) => [p.art.id, p]));
  const cache = new Map(); // id -> { texture, promise, used }
  let current = null;
  let limit = maxWidth;

  function residentTextures() {
    return [...cache.values()].filter((entry) => entry.texture).length;
  }

  function disposeEntry(id) {
    const entry = cache.get(id);
    if (!entry) return;
    cache.delete(id);
    if (entry.texture) entry.texture.dispose();
    const item = items.get(id);
    if (item && item.detailTexture === entry.texture) apply(id, null);
  }

  function apply(id, texture) {
    const item = items.get(id);
    if (!item) return;
    item.detailTexture = texture || null;
    item.canvasMat.map = texture || item.baseTexture;
    item.canvasMat.needsUpdate = true;
  }

  function trim(keepId) {
    if (cache.size <= maxResident) return;
    const ids = [...cache.entries()]
      .filter(([id, entry]) => id !== keepId && entry.texture)
      .sort((a, b) => a[1].used - b[1].used)
      .map(([id]) => id);
    while (cache.size > maxResident && ids.length) disposeEntry(ids.shift());
  }

  async function load(id) {
    const item = items.get(id);
    if (!item) return null;
    const entry = cache.get(id) || {};
    if (entry.promise) return entry.promise;
    entry.used = Date.now();
    const aspect = item.baseTexture ? item.baseTexture.image.width / item.baseTexture.image.height : 1;
    entry.promise = decodeResized(item.art.file, limit, aspect)
      .then((source) => {
        const texture = textureFromSource(source);
        entry.texture = texture;
        entry.promise = null;
        trim(current || id);
        if (current === id) apply(id, texture);
        return { id, width: texture.image.width, height: texture.image.height, quality: 'detail' };
      })
      .catch(() => {
        entry.promise = null;
        cache.delete(id);
        return null;
      });
    cache.set(id, entry);
    return entry.promise;
  }

  return {
    /** Показать полотно в деталях (или вернуть миниатюру, если id = null). */
    async show(id) {
      current = id;
      for (const [other] of [...cache.entries()]) {
        if (other !== id) disposeEntry(other);
      }
      if (!id) return null;
      const entry = cache.get(id);
      if (entry && entry.texture) {
        entry.used = Date.now();
        apply(id, entry.texture);
        return { id, width: entry.texture.image.width, height: entry.texture.image.height, quality: 'detail' };
      }
      return load(id);
    },
    /** Заранее скачать деталь, пока зритель ещё смотрит на медальон. */
    preload(id) {
      if (!id || cache.has(id)) return null;
      return load(id);
    },
    setMaxWidth(width) {
      if (!width || width === limit) return;
      limit = width;
      for (const [id] of [...cache.entries()]) disposeEntry(id);
      if (current) load(current);
    },
    info() {
      return {
        maxWidth: limit,
        maxResident,
        current,
        resident: [...cache.entries()]
          .filter(([, entry]) => entry.texture)
          .map(([id, entry]) => ({ id, width: entry.texture.image.width, height: entry.texture.image.height })),
      };
    },
  };
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

  // Полотно: базовый (unlit) материал. Картина не должна зависеть от источников
  // света — масляная живопись читается сама, а самый дорогой шейдер сцены
  // (шесть больших плоскостей, считающих все лампы) исчезает из кадра.
  const canvasMat = new THREE.MeshBasicMaterial({
    map: placeholderTexture('#2b2117'),
    color: new THREE.Color(1.16, 1.14, 1.1),
    toneMapped: true,
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

  // Рама: ступенчатый профиль. Брусья сливаются в одну сетку на материал —
  // иначе каждая картина добавляла восемь лишних draw call.
  const barGeometry = (bw, bh, bd, ox, oy, oz) => {
    const geo = new THREE.BoxGeometry(bw, bh, bd);
    geo.translate(ox, oy, oz);
    return geo;
  };
  const outerW = w + frameW * 2;
  const yTop = h / 2 + frameW / 2;
  const xSide = w / 2 + frameW / 2;
  const goldParts = [
    barGeometry(outerW, frameW, depth, 0, yTop, 0.02),
    barGeometry(outerW, frameW, depth, 0, -yTop, 0.02),
    barGeometry(frameW, h, depth, -xSide, 0, 0.02),
    barGeometry(frameW, h, depth, xSide, 0, 0.02),
  ];
  // внутренний золочёный фриз
  const lip = frameW * 0.42;
  const brassParts = [
    barGeometry(w + lip * 2, lip, 0.045, 0, h / 2 + lip / 2, 0.078),
    barGeometry(w + lip * 2, lip, 0.045, 0, -h / 2 - lip / 2, 0.078),
    barGeometry(lip, h, 0.045, -w / 2 - lip / 2, 0, 0.078),
    barGeometry(lip, h, 0.045, w / 2 + lip / 2, 0, 0.078),
  ];
  for (const [parts, material] of [[goldParts, materials.gold], [brassParts, materials.brass]]) {
    const mesh = new THREE.Mesh(mergeGeometries(parts), material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    parts.forEach((g) => g.dispose());
  }

  // Бра над полотном
  const lightBar = new THREE.Mesh(new THREE.BoxGeometry(Math.min(w * 0.8, 1.7), 0.06, 0.16), materials.brass);
  lightBar.position.set(0, yTop + frameW + 0.16, 0.16);
  group.add(lightBar);
  if (!tubeMaterial) {
    tubeMaterial = new THREE.MeshStandardMaterial({ color: 0xfff0cf, emissive: 0xffd79b, emissiveIntensity: 1.5, roughness: 0.4 });
  }
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, Math.min(w * 0.74, 1.56), 10),
    tubeMaterial,
  );
  tube.rotation.z = Math.PI / 2;
  tube.position.set(0, yTop + frameW + 0.12, 0.24);
  group.add(tube);

  // Подсветка полотна больше не прожектором: шесть прожекторов удваивали число
  // источников в шейдере. Роль лампы играет светящаяся трубка и emissiveMap холста.

  // Мягкое пятно света на стене вокруг рамы — дешевле прожектора и без нового источника.
  if (!poolTexture) poolTexture = lightPoolTexture();
  if (!poolMaterial) {
    poolMaterial = new THREE.MeshBasicMaterial({
      map: poolTexture,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
  }
  poolMaterial.opacity = quality === 'high' ? 0.42 : 0.48;
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.62, h * 1.5), poolMaterial);
  pool.position.set(0, 0.12, 0.004);
  pool.renderOrder = 1;
  group.add(pool);

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

/**
 * Рамы, карманы, трубки и пятна света у всех шести полотен сливаются в одну сетку
 * на материал: 36 лишних draw call превращаются в четыре. Полотна и таблички
 * остаются отдельными — у них свои текстуры.
 */
export let poolMesh = null;

export function setPaintingEffects(enabled) {
  if (poolMesh) poolMesh.visible = enabled;
}

export function mergePaintingStatics(scene, paintings) {
  scene.updateMatrixWorld(true);
  if (!paintings.length) return 0;
  const buckets = new Map();
  let moved = 0;

  for (const painting of paintings) {
    const removable = [];
    for (const child of painting.group.children) {
      if (!child.isMesh) continue;
      if (child === painting.canvas || child === painting.plaque) continue;
      const material = child.material;
      if (!material) continue;
      const geo = child.geometry.clone();
      geo.applyMatrix4(child.matrixWorld);
      if (!buckets.has(material)) buckets.set(material, []);
      buckets.get(material).push(geo);
      removable.push(child);
      moved += 1;
    }
    for (const child of removable) painting.group.remove(child);
  }

  const group = new THREE.Group();
  group.name = 'painting-statics';
  for (const [material, list] of buckets) {
    const merged = mergeGeometries(list, false);
    list.forEach((g) => g.dispose());
    if (!merged) continue;
    merged.computeBoundingSphere();
    const mesh = new THREE.Mesh(merged, material);
    mesh.castShadow = material !== poolMaterial;
    mesh.receiveShadow = material !== poolMaterial && material !== tubeMaterial;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    if (material === poolMaterial) {
      mesh.renderOrder = 1;
      poolMesh = mesh;
    }
    group.add(mesh);
  }
  scene.add(group);
  return moved;
}

export async function loadPaintings(scene, materials, quality, onProgress = () => {}) {
  const built = [];
  let done = 0;
  const anisotropy = quality === 'high' ? 4 : 1;
  for (const art of ARTWORKS) {
    const item = buildPainting(art, materials, quality);
    scene.add(item.group);
    // Миниатюра 720 px: её хватает и на общий план, и на близкий взгляд с экрана.
    const base = await loadArtworkTexture(art.thumb, { anisotropy });
    if (base) {
      item.baseTexture = base;
      item.detailTexture = null;
      item.canvasMat.map = base;
      item.canvasMat.needsUpdate = true;
    }
    built.push({ art, ...item });
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
