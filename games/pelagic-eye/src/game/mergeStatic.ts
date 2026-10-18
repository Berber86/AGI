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

/* ------------------------------------------------------------------ */
/*  Анимированные акторы: склейка + процедурная анимация в shader'е    */
/*                                                                     */
/*  Атрибут aAnim (vec4): x = номер части (0 = статика), yzw = опора.  */
/*  Атрибут aPhase (float): фаза части — per-vertex или per-instance.  */
/*  Каждая часть вращается по двум каналам (sin-формула как в          */
/*  creatures.ts), так что хвосты/плавники остаются живыми без         */
/*  отдельных мешей и покадровых поворотов.                            */
/* ------------------------------------------------------------------ */

export interface ActorPartSpec {
  geometry: THREE.BufferGeometry;
  /** Статическая матрица части в локальных координатах rig-группы. */
  matrix: THREE.Matrix4;
  material: THREE.Material;
  anim?: { part: number; pivot: THREE.Vector3; phase: number };
}

export interface ActorAnimSlot {
  axis1: THREE.Vector3;
  base1: number;
  freq1: number;
  amp1: number;
  axis2?: THREE.Vector3;
  base2?: number;
  freq2?: number;
  amp2?: number;
  phase2?: number;
}

const MAX_ACTOR_PARTS = 6;

function actorUniformsFor(slots: ActorAnimSlot[]) {
  const axis1: THREE.Vector3[] = [];
  const base1: number[] = [];
  const freq1: number[] = [];
  const amp1: number[] = [];
  const axis2: THREE.Vector3[] = [];
  const base2: number[] = [];
  const freq2: number[] = [];
  const amp2: number[] = [];
  const phase2: number[] = [];
  for (let i = 0; i < MAX_ACTOR_PARTS; i++) {
    const slot = slots[i];
    axis1.push(slot ? slot.axis1.clone().normalize() : new THREE.Vector3(0, 1, 0));
    base1.push(slot?.base1 ?? 0);
    freq1.push(slot?.freq1 ?? 0);
    amp1.push(slot?.amp1 ?? 0);
    axis2.push(slot?.axis2 ? slot.axis2.clone().normalize() : new THREE.Vector3(0, 1, 0));
    base2.push(slot?.base2 ?? 0);
    freq2.push(slot?.freq2 ?? 0);
    amp2.push(slot?.amp2 ?? 0);
    phase2.push(slot?.phase2 ?? 0);
  }
  return { axis1, base1, freq1, amp1, axis2, base2, freq2, amp2, phase2 };
}

/** Переворачивает winding треугольников (для зеркал с отрицательным детерминантом). */
function flipWinding(geo: THREE.BufferGeometry): void {
  const flipAttr = (name: string, itemSize: number) => {
    const attr = geo.getAttribute(name) as THREE.BufferAttribute | undefined;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    for (let t = 0; t + 2 < attr.count; t += 3) {
      for (let k = 0; k < itemSize; k++) {
        const a = (t + 1) * itemSize + k;
        const b = (t + 2) * itemSize + k;
        const tmp = arr[a];
        arr[a] = arr[b];
        arr[b] = tmp;
      }
    }
    attr.needsUpdate = true;
  };
  flipAttr("position", 3);
  flipAttr("normal", 3);
  flipAttr("uv", 2);
  flipAttr("color", 3);
  flipAttr("aEmissive", 3);
  flipAttr("aAnim", 4);
  flipAttr("aPhase", 1);
}

/** Геометрия одного материального бакета актора: color/emissive/aAnim/aPhase. */
function buildActorGeometry(
  parts: { part: ActorPartSpec; bake: { color?: THREE.Color; emissive?: THREE.Color } }[],
  opts: { withAnim: boolean; instancedPhase: boolean }
): THREE.BufferGeometry {
  const mirrored: boolean[] = [];
  const prepared = parts.map(({ part, bake }, idx) => {
    const geo = part.geometry.clone();
    geo.applyMatrix4(part.matrix);
    mirrored[idx] = part.matrix.determinant() < 0;
    const count = geo.attributes.position.count;
    const src = geo.getAttribute("color") as THREE.BufferAttribute | undefined;
    if (bake.color) {
      const colors = new Float32Array(count * 3);
      const c = bake.color;
      for (let i = 0; i < count; i++) {
        const r = src ? src.getX(i) : 1;
        const g = src ? src.getY(i) : 1;
        const b = src ? src.getZ(i) : 1;
        colors[i * 3] = r * c.r;
        colors[i * 3 + 1] = g * c.g;
        colors[i * 3 + 2] = b * c.b;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }
    if (bake.emissive) {
      const emis = new Float32Array(count * 3);
      const e = bake.emissive;
      for (let i = 0; i < count; i++) {
        emis[i * 3] = e.r;
        emis[i * 3 + 1] = e.g;
        emis[i * 3 + 2] = e.b;
      }
      geo.setAttribute("aEmissive", new THREE.BufferAttribute(emis, 3));
    }
    if (opts.withAnim) {
      const anims = new Float32Array(count * 4);
      const phases = new Float32Array(count);
      const a = part.anim;
      const pivot = a?.pivot ?? ZERO_ORIGIN;
      for (let i = 0; i < count; i++) {
        anims[i * 4] = a ? a.part : 0;
        anims[i * 4 + 1] = pivot.x;
        anims[i * 4 + 2] = pivot.y;
        anims[i * 4 + 3] = pivot.z;
        phases[i] = a?.phase ?? 0;
      }
      geo.setAttribute("aAnim", new THREE.BufferAttribute(anims, 4));
      if (!opts.instancedPhase) geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    }
    return geo;
  });
  // Нормализация: одинаковая индексность + полный набор атрибутов у всех.
  for (let i = 0; i < prepared.length; i++) {
    if (prepared[i].index) prepared[i] = prepared[i].toNonIndexed();
    // Зеркала: renderer сам переворачивает winding для matrixWorld с
    // отрицательным детерминантом, а в слитой геометрии это нужно сделать руками.
    if (mirrored[i]) flipWinding(prepared[i]);
  }
  const want = new Set<string>();
  prepared.forEach((g) => Object.keys(g.attributes).forEach((n) => want.add(n)));
  for (const g of prepared) {
    const count = g.attributes.position.count;
    for (const name of want) {
      if (g.getAttribute(name)) continue;
      if (name === "color") {
        g.setAttribute(name, new THREE.BufferAttribute(new Float32Array(count * 3).fill(1), 3));
      } else if (name === "aEmissive") {
        g.setAttribute(name, new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      } else if (name === "uv") {
        g.setAttribute(name, new THREE.BufferAttribute(new Float32Array(count * 2), 2));
      } else if (name === "aAnim") {
        g.setAttribute(name, new THREE.BufferAttribute(new Float32Array(count * 4), 4));
      } else if (name === "aPhase") {
        g.setAttribute(name, new THREE.BufferAttribute(new Float32Array(count), 1));
      } else if (name === "normal") {
        g.setAttribute(name, new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      }
    }
  }
  const merged = mergeGeometries(prepared, false);
  prepared.forEach((g) => g.dispose());
  if (!merged) throw new Error("buildActorGeometry: не удалось склеить геометрию");
  return merged;
}

/**
 * Склеивает части актора по бакетам материалов:
 *  - одинаковый экземпляр материала — точная склейка (как есть);
 *  - простые MeshBasic/без карт — склейка с запеканием цвета;
 *  - простые MeshStandard/без карт/без прозрачности — склейка в общий
 *    плоский стандарт-материал с запеканием color+emissive.
 * Возвращает готовые меши (в порядке бакетов) с декором анимации.
 */
export function mergeActorParts(
  parts: ActorPartSpec[],
  slots: ActorAnimSlot[],
  opts: { cacheKey: string; instancedPhase?: boolean }
): THREE.Mesh[] {
  interface Bucket {
    mode: "exact" | "basic-flat" | "std-flat";
    material: THREE.Material;
    parts: ActorPartSpec[];
  }
  const buckets = new Map<string, Bucket>();
  for (const part of parts) {
    const m = part.material as THREE.MeshStandardMaterial;
    let mode: Bucket["mode"] = "exact";
    if (!m.map && !m.bumpMap && (part.material as { isMeshBasicMaterial?: boolean }).isMeshBasicMaterial) mode = "basic-flat";
    else if (!m.map && !m.bumpMap && !m.transparent && m.isMeshStandardMaterial) mode = "std-flat";
    const key = mode === "exact" ? `id:${part.material.uuid}` : mode;
    if (!buckets.has(key)) buckets.set(key, { mode, material: part.material, parts: [] });
    buckets.get(key)!.parts.push(part);
  }
  const meshes: THREE.Mesh[] = [];
  buckets.forEach((bucket) => {
    const hasAnim = bucket.parts.some((p) => p.anim);
    const hasEmissiveBake = bucket.mode === "std-flat";
    const hasColorBake = bucket.mode !== "exact" || false;
    const prepared = bucket.parts.map((part) => ({
      part,
      bake: {
        color:
          bucket.mode === "std-flat"
            ? (part.material as THREE.MeshStandardMaterial).color
            : bucket.mode === "basic-flat"
              ? (part.material as THREE.MeshBasicMaterial).color
              : undefined,
        emissive: hasEmissiveBake
          ? (part.material as THREE.MeshStandardMaterial).emissive
              .clone()
              .multiplyScalar((part.material as THREE.MeshStandardMaterial).emissiveIntensity ?? 1)
          : undefined,
      },
    }));
    // exact-бакет с разными вершинными цветами не трогаем; basic-flat/std-flat
    // требуют vertexColors.
    void hasColorBake;
    const geometry = buildActorGeometry(prepared, {
      withAnim: hasAnim,
      instancedPhase: !!opts.instancedPhase && hasAnim,
    });
    let material: THREE.Material;
    if (bucket.mode === "std-flat") {
      material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        vertexColors: true,
        roughness: 0.62,
        metalness: 0.02,
        side: THREE.DoubleSide,
      });
      (material as THREE.MeshStandardMaterial).emissive.setRGB(0, 0, 0);
    } else if (bucket.mode === "basic-flat") {
      material = bucket.material;
      (material as THREE.MeshBasicMaterial).color.setRGB(1, 1, 1);
      (material as THREE.MeshBasicMaterial).vertexColors = true;
    } else {
      material = bucket.material;
    }
    if (hasAnim) {
      decorateActorMaterial(material as THREE.MeshStandardMaterial, slots, {
        cacheKey: `${opts.cacheKey}:${bucket.mode}`,
        withEmissiveAttr: hasEmissiveBake,
      });
    } else if (hasEmissiveBake) {
      decorateStaticMaterial(material as THREE.MeshStandardMaterial, {
        emissive: true,
        cacheKey: `${opts.cacheKey}:emis`,
      });
    }
    meshes.push(new THREE.Mesh(geometry, material));
  });
  return meshes;
}

/** Декор материала актора: процедурное вращение частей по двум каналам. */
export function decorateActorMaterial(
  material: THREE.MeshStandardMaterial,
  slots: ActorAnimSlot[],
  opts: { cacheKey: string; withEmissiveAttr?: boolean }
): void {
  const u = actorUniformsFor(slots);
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uStaticTime = staticSwayTime;
    shader.uniforms.uActAxis1 = { value: u.axis1 };
    shader.uniforms.uActBase1 = { value: u.base1 };
    shader.uniforms.uActFreq1 = { value: u.freq1 };
    shader.uniforms.uActAmp1 = { value: u.amp1 };
    shader.uniforms.uActAxis2 = { value: u.axis2 };
    shader.uniforms.uActBase2 = { value: u.base2 };
    shader.uniforms.uActFreq2 = { value: u.freq2 };
    shader.uniforms.uActAmp2 = { value: u.amp2 };
    shader.uniforms.uActPhase2 = { value: u.phase2 };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uStaticTime;
        attribute vec4 aAnim;
        attribute float aPhase;
        uniform vec3 uActAxis1[${MAX_ACTOR_PARTS}];
        uniform float uActBase1[${MAX_ACTOR_PARTS}];
        uniform float uActFreq1[${MAX_ACTOR_PARTS}];
        uniform float uActAmp1[${MAX_ACTOR_PARTS}];
        uniform vec3 uActAxis2[${MAX_ACTOR_PARTS}];
        uniform float uActBase2[${MAX_ACTOR_PARTS}];
        uniform float uActFreq2[${MAX_ACTOR_PARTS}];
        uniform float uActAmp2[${MAX_ACTOR_PARTS}];
        uniform float uActPhase2[${MAX_ACTOR_PARTS}];
        vec3 actRotate(vec3 v, vec3 axis, float ang) {
          float c = cos(ang);
          float s = sin(ang);
          return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
        }`
      )
      .replace(
        "#include <beginnormal_vertex>",
        `#include <beginnormal_vertex>
        int nActPart = int(aAnim.x + 0.5);
        if (nActPart > 0) {
          if (uActAmp1[nActPart - 1] != 0.0) {
            float nA1 = uActBase1[nActPart - 1] + sin(uStaticTime * uActFreq1[nActPart - 1] + aPhase) * uActAmp1[nActPart - 1];
            objectNormal = actRotate(objectNormal, uActAxis1[nActPart - 1], nA1);
          }
          if (uActAmp2[nActPart - 1] != 0.0) {
            float nA2 = uActBase2[nActPart - 1] + sin(uStaticTime * uActFreq2[nActPart - 1] + uActPhase2[nActPart - 1]) * uActAmp2[nActPart - 1];
            objectNormal = actRotate(objectNormal, uActAxis2[nActPart - 1], nA2);
          }
        }`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        int actPart = int(aAnim.x + 0.5);
        if (actPart > 0) {
          vec3 actRel = transformed - aAnim.yzw;
          if (uActAmp1[actPart - 1] != 0.0) {
            float a1 = uActBase1[actPart - 1] + sin(uStaticTime * uActFreq1[actPart - 1] + aPhase) * uActAmp1[actPart - 1];
            actRel = actRotate(actRel, uActAxis1[actPart - 1], a1);
          }
          if (uActAmp2[actPart - 1] != 0.0) {
            float a2 = uActBase2[actPart - 1] + sin(uStaticTime * uActFreq2[actPart - 1] + uActPhase2[actPart - 1]) * uActAmp2[actPart - 1];
            actRel = actRotate(actRel, uActAxis2[actPart - 1], a2);
          }
          transformed = aAnim.yzw + actRel;
        }`
      );
    if (opts.withEmissiveAttr) {
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

/** Декор материала угрей: покачивание + «дыхание» по высоте вокруг опоры. */
export function decorateEelMaterial(material: THREE.MeshStandardMaterial): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uStaticTime = staticSwayTime;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uStaticTime;
        attribute vec4 aAnim;
        attribute float aPhase;`
      )
      .replace(
        "#include <beginnormal_vertex>",
        `#include <beginnormal_vertex>
        float nEelAng = 0.08 + sin(uStaticTime * 0.9 + aPhase * 0.7) * 0.14;
        {
          float nc = cos(nEelAng);
          float ns = sin(nEelAng);
          objectNormal = vec3(nc * objectNormal.x - ns * objectNormal.y, ns * objectNormal.x + nc * objectNormal.y, objectNormal.z);
        }`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vec3 eelRel = transformed - aAnim.yzw;
        float eelAng = 0.08 + sin(uStaticTime * 0.9 + aPhase * 0.7) * 0.14;
        float eelC = cos(eelAng);
        float eelS = sin(eelAng);
        eelRel = vec3(eelC * eelRel.x - eelS * eelRel.y, eelS * eelRel.x + eelC * eelRel.y, eelRel.z);
        eelRel.y *= 0.85 + sin(uStaticTime * 1.4 + aPhase) * 0.1;
        transformed = aAnim.yzw + eelRel;`
      );
  };
  material.customProgramCacheKey = () => "pelagic-eel";
}
