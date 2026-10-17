// Песчаное дно поляны: чаша светлого песка, за её краем дно поднимается к
// рифовому валу, а далеко за валом уходит в синеву (где его и гасит туман).
import * as THREE from 'three';
import { fbm2, smoothstep, mix, valueNoise } from './noise.js';
import { WORLD } from './config.js';
import { patchUnderwater } from './shading.js';
import { makeSandTextures, makeRockTextures } from './textures.js';

const SIZE = 420;

/** Высота дна в точке (x, z). Одна функция и для геометрии, и для расстановки. */
export function seabedHeight(x, z) {
  const r = Math.hypot(x, z);
  const dunes = (fbm2(x * 0.021, z * 0.021, { octaves: 4, seed: 11 }) - 0.5) * 1.5;
  const grain = (valueNoise(x * 0.35, z * 0.35, 31) - 0.5) * 0.12;
  // Чаша поляны: углубление ~0.9 м в центре, выход на ноль к её краю.
  const bowl = -0.9 * (1 - smoothstep(0, WORLD.clearing * 1.25, r));
  // Рифовой вал: поднимается за поляной, пик около 30 м, дальше плавно спадает.
  const crest = smoothstep(WORLD.clearing * 0.9, 30, r) * 7.4;
  const ridge = (fbm2(x * 0.045, z * 0.045, { octaves: 3, seed: 71 }) - 0.45) * 2.6 * smoothstep(WORLD.clearing, 34, r);
  // Дальний барьер: поднимает горизонт, чтобы за валом не было пустоты.
  const far = smoothstep(WORLD.reefRadius + 26, WORLD.reefRadius + 120, r) * 16;
  return WORLD.seabedY + dunes + grain + bowl + crest + ridge + far;
}

export function buildSeabed(segments, quality) {
  const group = new THREE.Group();
  group.name = 'seabed';

  const geo = new THREE.PlaneGeometry(SIZE, SIZE, segments, segments);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    pos.setY(i, seabedHeight(x, z));
  }
  geo.computeVertexNormals();

  const sand = makeSandTextures(512, 58);
  const rock = makeRockTextures(256, 4);

  const material = new THREE.MeshStandardMaterial({
    color: 0xf3e6c8,
    map: sand.map,
    normalMap: sand.normalMap,
    normalScale: new THREE.Vector2(0.7, 0.7),
    roughness: 0.94,
    metalness: 0,
    envMapIntensity: 0.25,
  });
  patchUnderwater(material, { caustics: 1.15 });
  const mesh = new THREE.Mesh(geo, material);
  mesh.name = 'sand';
  mesh.frustumCulled = false;
  group.add(mesh);

  const rocks = buildRocks(rock, quality);
  group.add(rocks);

  return { group, materials: [material], textures: [sand.map, sand.normalMap, rock.map, rock.normalMap], rocks };
}

// Камни: обкатанные валуны плюс обломки коралла на песке. Инстансы — один
// draw call на всё, вес вершины невелик.
function buildRocks(tex, quality) {
  const total = Math.round(64 * quality);
  const geo = new THREE.IcosahedronGeometry(1, 2);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = fbm2(v.x * 1.4 + 5, v.z * 1.4 + 5, { octaves: 3, seed: 91 });
    v.multiplyScalar(0.7 + n * 0.55);
    v.y *= 0.72;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0x9aa39a,
    map: tex.map,
    normalMap: tex.normalMap,
    roughness: 0.92,
    metalness: 0,
    envMapIntensity: 0.3,
  });
  patchUnderwater(material, { caustics: 0.9 });

  const mesh = new THREE.InstancedMesh(geo, material, total);
  mesh.name = 'rocks';
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  let placed = 0;
  for (let i = 0; i < total; i++) {
    const a = (i / total) * Math.PI * 2 + valueNoise(i * 3.1, 0.5, 5) * 2;
    const r = WORLD.clearing * (0.75 + valueNoise(i * 1.7, 2.3, 9) * 4.2);
    p.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    p.y = seabedHeight(p.x, p.z) - 0.25;
    const scale = 0.35 + valueNoise(i * 5.5, 7.7, 13) * 1.5;
    e.set(valueNoise(i, 1, 3) * 0.7, valueNoise(i, 2, 4) * Math.PI * 2, valueNoise(i, 3, 6) * 0.7);
    q.setFromEuler(e);
    s.set(scale, scale * (0.6 + valueNoise(i, 4, 8) * 0.5), scale);
    m.compose(p, q, s);
    mesh.setMatrixAt(placed++, m);
  }
  mesh.count = placed;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  return mesh;
}
