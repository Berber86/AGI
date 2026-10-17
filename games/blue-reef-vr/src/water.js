// Свет в воде.
//
// Раньше глубина имитировалась обычным туманом one-color: из-за этого кадр
// выглядел молочным и плоским (замеры с устройства: 70 % пикселей лежали в
// одном узком интервале яркости 176…208, контраст падал на четверть).
//
// Здесь работает модель, которой пользуются в реальной подводной
// графике:
//   1. Спектральное поглощение (Бугер–Ламберт). Вода гасит каналы с разной
//      скоростью: красный уходит первым, синий — последним. Отсюда сине-зелёная
//      даль и тёплые, «свои» цвета у близких кораллов.
//   2. Рассеяние толщи (in-scattering): то, что видно вместо поглощённого, —
//      не серая дымка, а подсвеченная солнцем вода, причём ярче в сторону
//      солнца и вверх, к поверхности.
//   3. Цветокоррекция: мягкая S-кривая контраста, насыщенность, сине-зелёные
//      тени и виньетка.
//
// Всё считается внутри материалов, а не в постобработке: в VR-режиме
// постпроцессора нет (сцена рисуется дважды, по разу на глаз), а вода должна
// выглядеть одинаково в обоих режимах.
import * as THREE from 'three';
import { WORLD } from './config.js';

/** Поглощение на метр по каналам: красный гаснет в ~5 раз быстрее синего. */
export const ABSORB = new THREE.Vector3(0.052, 0.0155, 0.0098);

/** Цвет толщи воды (то, чем «подсвечивается» даль). Линейный, не sRGB. */
export const INSCATTER = new THREE.Color(0x2e93b0);

/** Цвет бесконечности: то, что видно у самого горизонта. */
export const FAR_WATER = new THREE.Color(0x0d465e);

export const water = {
  uSigma: { value: ABSORB.clone() },
  uInscatter: { value: new THREE.Color(INSCATTER) },
  uInscatterGain: { value: 0.6 },
  uCamPos: { value: new THREE.Vector3(0, WORLD.eyeY, 0) },
  uSunDir: { value: new THREE.Vector3(...WORLD.sunDir).normalize() },
  // x — контраст, y — насыщенность, z — виньетка, w — подъём теней
  uGrade: { value: new THREE.Vector4(0.72, 1.26, 0.26, 0.5) },
  uShadowTint: { value: new THREE.Vector3(0.006, 0.017, 0.032) },
  // область кадра в пикселях устройства: по ней считается виньетка
  uViewport: { value: new THREE.Vector4(0, 0, 1, 1) },
};

/** Виньетка считается по каждому глазу отдельно: в VR у каждого свой вьюпорт. */
export function setGradeViewport(x, y, w, h, pixelRatio = 1) {
  water.uViewport.value.set(x * pixelRatio, y * pixelRatio, w * pixelRatio, h * pixelRatio);
}

// --- общие куски GLSL -------------------------------------------------------

/** Ядро модели: поглощение и рассеяние на отрезке «глаз → точка». */
export const WATER_CORE_DECL = /* glsl */`
uniform vec3 uSigma;
uniform vec3 uInscatter;
uniform float uInscatterGain;
uniform vec3 uCamPos;
uniform vec3 uSunDir;

vec3 rbWaterAt(vec3 col, vec3 wp) {
  vec3 toP = wp - uCamPos;
  float d = length(toP);
  vec3 vd = toP / max(d, 1e-4);
  vec3 trans = exp(-uSigma * d);                 // пропускание по каналам
  float phase = 0.55 + 0.85 * pow(max(dot(vd, uSunDir), 0.0), 3.0); // рассеяние вперёд
  // Сверху светлее: столб воды над головой подсвечен солнцем, под ногами — нет.
  float up = 0.42 + 0.95 * clamp(vd.y * 0.5 + 0.5, 0.0, 1.0);
  // И глубина самой точки: чем ближе ко дну, тем темнее её собственная дымка.
  float yf = mix(0.62, 1.12, clamp((wp.y - ${WORLD.seabedY.toFixed(1)}) / ${(WORLD.surfaceY - WORLD.seabedY).toFixed(1)}, 0.0, 1.0));
  vec3 ins = uInscatter * (phase * up * yf * uInscatterGain);
  return col * trans + ins * (1.0 - trans);
}
`;

/** Для материалов three.js: мировая координата приходит varying-ом. */
export const WATER_DECL = WATER_CORE_DECL + /* glsl */`
varying vec3 vRbWorld;
vec3 rbWater(vec3 col) { return rbWaterAt(col, vRbWorld); }
`;

/** То же самое, когда мировых координат нет (частицы): расстояние передаётся. */
export const WATER_DIST_DECL = /* glsl */`
uniform vec3 uSigma;
uniform vec3 uInscatter;
uniform float uInscatterGain;
uniform vec3 uSunDir;

vec3 rbWaterDist(vec3 col, float d, float upness) {
  vec3 trans = exp(-uSigma * d);
  float up = 0.68 + 0.55 * clamp(upness * 0.5 + 0.5, 0.0, 1.0);
  vec3 ins = uInscatter * (0.85 * up * uInscatterGain);
  return col * trans + ins * (1.0 - trans);
}
`;

/** Объявления цветокоррекции: вызывать rbGrade() после colorspace_fragment. */
export const GRADE_DECL = /* glsl */`
uniform vec4 uGrade;
uniform vec3 uShadowTint;
uniform vec4 uViewport;

vec3 rbGrade(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  vec3 s = c * c * (3.0 - 2.0 * c);          // мягкая S-кривая
  c = mix(c, s, uGrade.x);
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = mix(vec3(l), c, uGrade.y);
  c += uShadowTint * (1.0 - l) * uGrade.w * 2.0;   // тени уходят в сине-зелёное
  vec2 q = (gl_FragCoord.xy - uViewport.xy) / max(vec2(1.0, 1.0), uViewport.zw) - 0.5;
  float r2 = dot(q, q);
  c *= 1.0 - uGrade.z * smoothstep(0.02, 0.46, r2);
  return clamp(c, 0.0, 1.0);
}
`;

/** Uniform-ы воды и коррекции, которые нужно добавить в shader.uniforms. */
export function waterUniforms(extra = {}) {
  return {
    uSigma: water.uSigma,
    uInscatter: water.uInscatter,
    uInscatterGain: water.uInscatterGain,
    uCamPos: water.uCamPos,
    uSunDir: water.uSunDir,
    uGrade: water.uGrade,
    uShadowTint: water.uShadowTint,
    uViewport: water.uViewport,
    ...extra,
  };
}
