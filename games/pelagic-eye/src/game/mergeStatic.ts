// mergeStatic.ts — склейка статичной геометрии в один draw call.
//
// Идея из VR-аудита гонок (F5): статика не должна жить отдельными мешами,
// каждый из которых стереопара рисует дважды. Здесь запекаем в вершины:
//  * цвет материала (material.color) — в атрибут `color` (vertexColors);
//  * свечение (material.emissive)   — в атрибут `aEmissive`;
//  * качание течением (rotation.z вокруг опоры объекта) — в `aOrigin/aPhase/aAmp`.
// Внешний вид и анимация остаются прежними, draw calls падают на порядок.
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export interface StaticPart {
  geometry: THREE.BufferGeometry;
  /** Мировая матрица объекта — запекается в вершины. */
  matrix: THREE.Matrix4;
  /** material.color (линейный); отсутствие цвета в геометрии трактуется как белый. */
  color?: THREE.Color;
  /** material.emissive — запекается в aEmissive (нужен decorateStaticMaterial). */
  emissive?: THREE.Color;
  /** Качание течением: опора в мире + фаза/амплитуда (как rotation.z объекта). */
  sway?: { origin: THREE.Vector3; phase: number; amp: number };
}

const WHITE = new THREE.Color(1, 1, 1);
const BLACK = new THREE.Color(0, 0, 0);
const ZERO_ORIGIN = new THREE.Vector3(0, 0, 0);

/** Общее время для shader-качания всех склеенных материалов. */
export const staticSwayTime = { value: 0 };

/**
 * Склеивает части в одну геометрию. У всех частей должен быть одинаковый
 * набор атрибутов (один и тот же генератор геометрии).
 */
export function buildMergedGeometry(
  parts: StaticPart[],
  opts: { emissive?: boolean; sway?: boolean } = {}
): THREE.BufferGeometry {
  const prepared = parts.map((part) => {
    const geo = part.geometry.clone();
    geo.applyMatrix4(part.matrix);
    const count = geo.attributes.position.count;
    const src = geo.getAttribute("color") as THREE.BufferAttribute | undefined;
    const colors = new Float32Array(count * 3);
    const c = part.color ?? WHITE;
    for (let i = 0; i < count; i++) {
      const r = src ? src.getX(i) : 1;
      const g = src ? src.getY(i) : 1;
      const b = src ? src.getZ(i) : 1;
      colors[i * 3] = r * c.r;
      colors[i * 3 + 1] = g * c.g;
      colors[i * 3 + 2] = b * c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    if (opts.emissive) {
      const emis = new Float32Array(count * 3);
      const e = part.emissive ?? BLACK;
      for (let i = 0; i < count; i++) {
        emis[i * 3] = e.r;
        emis[i * 3 + 1] = e.g;
        emis[i * 3 + 2] = e.b;
      }
      geo.setAttribute("aEmissive", new THREE.BufferAttribute(emis, 3));
    }
    if (opts.sway) {
      const origins = new Float32Array(count * 3);
      const phases = new Float32Array(count);
      const amps = new Float32Array(count);
      const o = part.sway?.origin ?? ZERO_ORIGIN;
      const ph = part.sway?.phase ?? 0;
      const am = part.sway?.amp ?? 0;
      for (let i = 0; i < count; i++) {
        origins[i * 3] = o.x;
        origins[i * 3 + 1] = o.y;
        origins[i * 3 + 2] = o.z;
        phases[i] = ph;
        amps[i] = am;
      }
      geo.setAttribute("aOrigin", new THREE.BufferAttribute(origins, 3));
      geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
      geo.setAttribute("aAmp", new THREE.BufferAttribute(amps, 1));
    }
    return geo;
  });
  const merged = mergeGeometries(prepared, false);
  prepared.forEach((g) => g.dispose());
  if (!merged) throw new Error("buildMergedGeometry: не удалось склеить геометрию");
  return merged;
}

/**
 * Готовит материал склеенного статичного меша: per-vertex emissive и/или
 * shader-качание. Вызывается один раз на материал бакета.
 */
export function decorateStaticMaterial(
  material: THREE.MeshStandardMaterial,
  opts: { emissive?: boolean; sway?: boolean; cacheKey: string }
): void {
  material.onBeforeCompile = (shader) => {
    if (opts.sway) {
      shader.uniforms.uStaticTime = staticSwayTime;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nuniform float uStaticTime;\nattribute vec3 aOrigin;\nattribute float aPhase;\nattribute float aAmp;"
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          float swayAng = sin(uStaticTime * 0.36 + aPhase) * aAmp;
          vec3 swayRel = transformed - aOrigin;
          float swayC = cos(swayAng);
          float swayS = sin(swayAng);
          transformed = aOrigin + vec3(swayC * swayRel.x - swayS * swayRel.y, swayS * swayRel.x + swayC * swayRel.y, swayRel.z);`
        );
    }
    if (opts.emissive) {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec3 aEmissive;\nvarying vec3 vStaticEmissive;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\n  vStaticEmissive = aEmissive;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vStaticEmissive;")
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n  totalEmissiveRadiance += vStaticEmissive;");
    }
  };
  material.customProgramCacheKey = () => opts.cacheKey;
}
