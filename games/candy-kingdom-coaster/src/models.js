// Candy Kingdom Coaster — binary glTF 2.0 (.glb) model loader.
//
// Models live in assets/models/*.glb and are built headlessly by real Blender
// (assets/models/build-gummy-bear.py). Like src/textures.js, everything loads
// in parallel before the world is constructed; if a file fails to load or hits
// the timeout, callers fall back cleanly to procedural geometry so the game
// never blocks or crashes offline.
import * as THREE from 'three';

const MODEL_ROOT = new URL('../assets/models/', import.meta.url);

export const MODEL_MANIFEST = {
  gummyBear: { file: 'gummy-bear.glb' },
};

const TYPE_ARITY = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };

// Module-level store populated by loadModels() before createForks / createWorld.
const LOADED_MODELS = Object.fromEntries(Object.keys(MODEL_MANIFEST).map((k) => [k, null]));

function readAccessorArray(gltf, binBuffer, accessorIndex) {
  const acc = gltf.accessors[accessorIndex];
  const bv = gltf.bufferViews[acc.bufferView];
  const arity = TYPE_ARITY[acc.type] || 1;
  const count = acc.count * arity;
  const start = (bv.byteOffset || 0) + (acc.byteOffset || 0);
  const componentBytes = acc.componentType === 5126 || acc.componentType === 5125 ? 4
    : acc.componentType === 5123 ? 2 : 1;
  const slice = binBuffer.slice(start, start + count * componentBytes);
  let raw;
  let normScale = 1;
  if (acc.componentType === 5126) {
    raw = new Float32Array(slice);
  } else if (acc.componentType === 5125) {
    raw = new Uint32Array(slice);
  } else if (acc.componentType === 5123) {
    raw = new Uint16Array(slice);
    if (acc.normalized) normScale = 1 / 65535;
  } else if (acc.componentType === 5121) {
    raw = new Uint8Array(slice);
    if (acc.normalized) normScale = 1 / 255;
  } else {
    throw new Error(`Unsupported glTF componentType: ${acc.componentType}`);
  }
  return { raw, arity, count: acc.count, normalized: !!acc.normalized, normScale };
}

/**
 * Parse a standard Khronos glTF 2.0 binary (.glb) ArrayBuffer into a map of
 * `{ [meshOrNodeName]: THREE.BufferGeometry }`.
 */
export function parseGlbGeometries(arrayBuffer) {
  const header = new DataView(arrayBuffer, 0, 12);
  const magic = header.getUint32(0, true);
  const version = header.getUint32(4, true);
  if (magic !== 0x46546c67 || version !== 2) {
    throw new Error('Invalid GLB header');
  }
  let offset = 12;
  let gltf = null;
  let binBuffer = null;
  while (offset + 8 <= arrayBuffer.byteLength) {
    const chunkView = new DataView(arrayBuffer, offset, 8);
    const chunkLength = chunkView.getUint32(0, true);
    const chunkType = chunkView.getUint32(4, true);
    const chunkStart = offset + 8;
    if (chunkType === 0x4e4f534a) {
      gltf = JSON.parse(new TextDecoder().decode(new Uint8Array(arrayBuffer, chunkStart, chunkLength)));
    } else if (chunkType === 0x004e4942) {
      binBuffer = arrayBuffer.slice(chunkStart, chunkStart + chunkLength);
    }
    offset = chunkStart + chunkLength;
  }
  if (!gltf || !binBuffer) throw new Error('Incomplete GLB chunks');

  const buildPrimitive = (prim) => {
    const geo = new THREE.BufferGeometry();
    const attrs = prim.attributes || {};
    if (attrs.POSITION !== undefined) {
      const a = readAccessorArray(gltf, binBuffer, attrs.POSITION);
      geo.setAttribute('position', new THREE.Float32BufferAttribute(a.raw, 3));
    }
    if (attrs.NORMAL !== undefined) {
      const a = readAccessorArray(gltf, binBuffer, attrs.NORMAL);
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(a.raw, 3));
    }
    if (attrs.TEXCOORD_0 !== undefined) {
      const a = readAccessorArray(gltf, binBuffer, attrs.TEXCOORD_0);
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(a.raw, 2));
    } else if (geo.attributes.position) {
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(geo.attributes.position.count * 2), 2));
    }
    if (attrs.COLOR_0 !== undefined) {
      // Normalise COLOR_0 (VEC3 or VEC4, float or uint16/uint8) into a standard
      // 3-component Float32 `color` attribute so InstancedMesh, candykit.bake()
      // and BufferGeometryUtils.mergeGeometries() share one uniform attribute layout.
      const a = readAccessorArray(gltf, binBuffer, attrs.COLOR_0);
      const rgb = new Float32Array(a.count * 3);
      const s = a.normScale;
      for (let i = 0; i < a.count; i++) {
        const base = i * a.arity;
        rgb[i * 3] = a.raw[base] * s;
        rgb[i * 3 + 1] = a.raw[base + 1] * s;
        rgb[i * 3 + 2] = a.raw[base + 2] * s;
      }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(rgb, 3));
    }
    if (prim.indices !== undefined) {
      const idx = readAccessorArray(gltf, binBuffer, prim.indices);
      geo.setIndex(new THREE.BufferAttribute(idx.raw, 1));
    }
    if (!geo.attributes.normal) geo.computeVertexNormals();
    return geo;
  };

  const out = {};
  const nodes = gltf.nodes || [];
  for (const node of nodes) {
    if (node.mesh === undefined) continue;
    const meshDef = gltf.meshes[node.mesh];
    if (!meshDef || !meshDef.primitives || !meshDef.primitives.length) continue;
    const geo = buildPrimitive(meshDef.primitives[0]);
    if (node.matrix) {
      geo.applyMatrix4(new THREE.Matrix4().fromArray(node.matrix));
    } else if (node.translation || node.rotation || node.scale) {
      const pos = node.translation ? new THREE.Vector3(...node.translation) : new THREE.Vector3();
      const quat = node.rotation ? new THREE.Quaternion(...node.rotation) : new THREE.Quaternion();
      const scl = node.scale ? new THREE.Vector3(...node.scale) : new THREE.Vector3(1, 1, 1);
      geo.applyMatrix4(new THREE.Matrix4().compose(pos, quat, scl));
    }
    geo.computeBoundingBox();
    geo.computeBoundingSphere();
    if (meshDef.name) out[meshDef.name] = geo;
    if (node.name) out[node.name] = geo;
  }
  // Also expose any standalone meshes not referenced by nodes
  (gltf.meshes || []).forEach((meshDef) => {
    if (meshDef.name && !out[meshDef.name] && meshDef.primitives?.length) {
      const geo = buildPrimitive(meshDef.primitives[0]);
      geo.computeBoundingBox();
      geo.computeBoundingSphere();
      out[meshDef.name] = geo;
    }
  });
  return out;
}

/**
 * Fetch and decode all binary models in MODEL_MANIFEST with a soft timeout.
 */
export function loadModels({ timeoutMs = 12000 } = {}) {
  const keys = Object.keys(MODEL_MANIFEST);
  const jobs = keys.map(async (key) => {
    try {
      const url = new URL(MODEL_MANIFEST[key].file, MODEL_ROOT).href;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      LOADED_MODELS[key] = parseGlbGeometries(buf);
    } catch {
      console.warn(`[CKC] model "${key}" failed to load — using procedural fallback`);
      LOADED_MODELS[key] = null;
    }
  });
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
  return Promise.race([Promise.all(jobs), timeout]).then(() => ({ ...LOADED_MODELS }));
}

export function getModelMesh(modelKey, meshName) {
  const pack = LOADED_MODELS[modelKey];
  return pack && pack[meshName] ? pack[meshName] : null;
}
