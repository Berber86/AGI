import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

// Position-based erosion keeps shared vertices watertight and normals continuous.
export function erodedRock(detail = 3, seed = 0) {
  let geometry = new THREE.IcosahedronGeometry(1, detail);
  geometry.deleteAttribute("normal");
  geometry.deleteAttribute("uv");
  const merged = mergeVertices(geometry);
  geometry.dispose();
  geometry = merged;
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i),
      z = p.getZ(i);
    const broad = Math.sin(x * 4.7 + seed) * Math.cos(z * 3.8 - y * 2.4);
    const ridges = Math.sin(y * 12 + x * 3 + seed) * Math.sin(z * 7 - x * 4);
    const chips = Math.sin(x * 27 + z * 19) * Math.cos(y * 21 - z * 13);
    const scale = 1 + broad * 0.18 + ridges * 0.065 + chips * 0.018;
    p.setXYZ(i, x * scale, y * scale, z * scale);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function sandTexture() {
  const size = 512,
    data = new Uint8Array(size * size * 4);
  let seed = 71;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const u = (x / size) * Math.PI * 2,
        v = (y / size) * Math.PI * 2;
      const warp = Math.sin(u * 2) * 1.5 + Math.sin(v * 2 + u) * 0.8;
      const ripple = Math.pow(0.5 + 0.5 * Math.sin(v * 18 + warp * 3), 3);
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const grain = seed / 4294967296;
      const value = Math.round(
        175 + ripple * 19 + grain * 18 + Math.sin(u + v) * 8,
      );
      data.set([value, value, value, 255], (y * size + x) * 4);
    }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(38, 38);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
