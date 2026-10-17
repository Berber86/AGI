// Вода как среда: поверхность сверху (окно Снелла и солнечный отсвет),
// столбы света, взвесь и пузырьки. Пловец стоит на месте, поэтому вся анимация
// считается в шейдерах — на CPU уходит только время.
import * as THREE from 'three';
import { WORLD } from './config.js';
import { mulberry32 } from './noise.js';
import { water as shadingTime } from './shading.js';
import { WATER_DECL, WATER_DIST_DECL, GRADE_DECL, waterUniforms, FAR_WATER } from './water.js';
import { makeDotSprite, makeBubbleSprite, makeRaySprite } from './textures.js';

const SUN = new THREE.Vector3(...WORLD.sunDir).normalize();
const uTime = shadingTime.uTime;   // shared-время сцены

// --- поверхность воды, видимая снизу ---------------------------------------
function buildSurface() {
  const geo = new THREE.PlaneGeometry(900, 900, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: uTime,
      uSun: { value: SUN },
      uSky: { value: new THREE.Color(0xd9fbff) },
      uDeep: { value: new THREE.Color(0x175c72) },
      uFog: { value: new THREE.Color(FAR_WATER) },
      ...waterUniforms(),
    },
    vertexShader: /* glsl */`
      varying vec3 vWorld;
      varying vec3 vRbWorld;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vRbWorld = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform vec3 uSun;
      uniform vec3 uSky;
      uniform vec3 uDeep;
      uniform vec3 uFog;
      varying vec3 vWorld;
      ${WATER_DECL}
      ${GRADE_DECL}

      // Рябь: сумма синусов и их аналитические производные — нормаль считается
      // без текстур и без dFdx.
      float waveH(vec2 p, float t, out vec2 grad) {
        float h = 0.0;
        grad = vec2(0.0);
        vec2 dirs[4];
        dirs[0] = vec2(1.0, 0.25); dirs[1] = vec2(-0.35, 1.0);
        dirs[2] = vec2(0.7, -0.7); dirs[3] = vec2(0.15, 0.95);
        float freq[4]; freq[0] = 0.55; freq[1] = 0.9; freq[2] = 1.7; freq[3] = 2.9;
        float amp[4]; amp[0] = 0.32; amp[1] = 0.20; amp[2] = 0.11; amp[3] = 0.055;
        float spd[4]; spd[0] = 0.55; spd[1] = 0.72; spd[2] = 1.05; spd[3] = 1.4;
        for (int i = 0; i < 4; i++) {
          vec2 d = normalize(dirs[i]);
          float ph = dot(p, d) * freq[i] + t * spd[i];
          h += sin(ph) * amp[i];
          grad += d * cos(ph) * amp[i] * freq[i];
        }
        return h;
      }

      // Блики: рябь на поверхности собирает солнце в яркие точки. Без них
      // взгляд вверх упирается в ровную пластиковую плёнку.
      float glitter(vec2 p, float t) {
        float s = 0.0;
        for (int i = 0; i < 3; i++) {
          float fi = float(i);
          vec2 g = p * (0.42 + fi * 0.33) + vec2(t * (0.22 + fi * 0.12), -t * (0.17 + fi * 0.09));
          float v = sin(g.x) * sin(g.y * 1.13 + g.x * 0.7 + fi);
          s += pow(max(v, 0.0), 14.0) * (1.0 - fi * 0.22);
        }
        return s;
      }

      void main() {
        vec3 viewDir = normalize(vWorld - cameraPosition);
        vec2 grad;
        float h = waveH(vWorld.xz, uTime, grad);
        vec3 n = normalize(vec3(-grad.x, 1.0, -grad.y));

        // Окно Снелла: внутри конуса ~48.6° видно небо, снаружи — отражение глубины.
        // up — косинус угла между взглядом и отвесом: 1 = смотрим строго вверх.
        float up = clamp(dot(viewDir, n), 0.0, 1.0);
        float window = smoothstep(0.60, 0.80, up);
        float ripple = 0.55 + 0.45 * sin(h * 3.0 + uTime * 0.8);

        vec3 refracted = uSky * (0.75 + 0.35 * ripple);
        // Мелкая рябь: добивает деталь там, где крупных волн уже не видно.
        float fine = sin(vWorld.x * 5.3 + uTime * 1.7) * sin(vWorld.z * 4.7 - uTime * 1.4);
        refracted *= 1.0 + 0.06 * fine;
        // Внутри окна Снелла блики яркие, снаружи их видно слабее — гребни
        // волн подсвечиваются и при полном внутреннем отражении.
        refracted += vec3(1.0, 0.98, 0.92) * glitter(vWorld.xz, uTime) * mix(0.35, 1.6, window);
        // Солнце: яркое пятно в продолжении луча, плюс мягкое гало.
        vec3 sunFromBelow = normalize(-uSun);
        float sd = clamp(dot(-viewDir, sunFromBelow), 0.0, 1.0);
        float disc = pow(sd, 320.0) * 3.4 + pow(sd, 34.0) * 0.35;
        refracted += vec3(1.0, 0.97, 0.88) * disc;

        // Вне окна Снелла видно отражение глубины — но и оно не ровное: на
        // границе читаются гребни волн, иначе взгляд вверх упирается в пластик.
        float crest = 0.5 + 0.5 * sin(h * 2.7 + uTime * 0.9);
        vec3 mirrored = mix(uDeep, uFog, 0.35) * (0.92 + 0.5 * crest);
        mirrored += vec3(0.12, 0.19, 0.21) * pow(crest, 6.0) * 0.7;
        vec3 col = mix(mirrored, refracted, window);
        // Ближе к горизонту поверхность растворяется в толще воды.
        float horizonFade = smoothstep(0.02, 0.55, up);
        col = mix(uFog, col, horizonFade);
        col = rbWater(col);
        gl_FragColor = vec4(col, 1.0);
        // Сырой ShaderMaterial не проходит эти стадии сам: без них вода и
        // частицы выходят почти чёрными (линейный цвет в sRGB-буфере).
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        gl_FragColor.rgb = rbGrade(gl_FragColor.rgb);
      }
    `,
  });
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.y = WORLD.surfaceY;
  mesh.frustumCulled = false;
  mesh.renderOrder = 2;
  return mesh;
}

// --- столбы света -----------------------------------------------------------
function buildRays(maxRays) {
  const geo = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: makeRaySprite(64, 256),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    opacity: 0.13,
    color: 0xfff6d8,
    fog: false,
    toneMapped: false,
  });
  // Каждый луч — два скрещенных полотна: объём виден с любой стороны.
  const mesh = new THREE.InstancedMesh(geo, material, maxRays * 2);
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const rnd = mulberry32(5150);
  const down = SUN.clone().negate().normalize();
  const items = [];
  for (let i = 0; i < maxRays; i++) {
    const a = rnd() * Math.PI * 2;
    const r = WORLD.clearing * (0.2 + rnd() * 2.6);
    items.push({
      x: Math.cos(a) * r,
      z: Math.sin(a) * r,
      width: 2.2 + rnd() * 5.5,
      length: 15 + rnd() * 6,
      opacity: 0.6 + rnd() * 0.7,
      sway: rnd() * Math.PI * 2,
      speed: 0.25 + rnd() * 0.35,
    });
  }
  return { mesh, items, down, maxRays };
}

const _dummy = new THREE.Object3D();
const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _axis = new THREE.Vector3();
const _m = new THREE.Matrix4();

function updateRays(rays, t, visibleRays) {
  const { mesh, items, down } = rays;
  const count = Math.min(items.length, visibleRays);
  let idx = 0;
  for (let i = 0; i < count; i++) {
    const it = items[i];
    // Луч чуть покачивается: свет играет на волнах поверхности.
    _axis.set(down.x + Math.sin(t * it.speed + it.sway) * 0.05, down.y, down.z + Math.cos(t * it.speed * 0.8 + it.sway) * 0.05).normalize();
    _q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _axis);
    const sway = Math.sin(t * it.speed * 0.7 + it.sway) * 0.4;
    const grow = 0.85 + 0.15 * Math.sin(t * 0.35 + it.sway);
    for (const turn of [0, Math.PI / 2]) {
      _q2.setFromAxisAngle(_axis, turn);
      _dummy.quaternion.copy(_q).premultiply(_q2);
      // Полотно ставим так, чтобы оно шло от поверхности вниз по лучу.
      _dummy.position.set(it.x + sway, WORLD.surfaceY - it.length * 0.5 * grow + 1.5, it.z + sway * 0.6);
      _dummy.scale.set(it.width * grow, it.length * grow, 1);
      _dummy.updateMatrix();
      mesh.setMatrixAt(idx++, _dummy.matrix);
    }
  }
  mesh.count = idx;
  mesh.instanceMatrix.needsUpdate = true;
}

// --- взвесь (морской снег) --------------------------------------------------
function buildSnow(max) {
  const rnd = mulberry32(31337);
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(max * 3);
  const size = new Float32Array(max);
  const phase = new Float32Array(max);
  const span = 64, height = 20;
  for (let i = 0; i < max; i++) {
    pos[i * 3] = (rnd() - 0.5) * span;
    pos[i * 3 + 1] = WORLD.seabedY + rnd() * height;
    pos[i * 3 + 2] = (rnd() - 0.5) * span;
    size[i] = 0.6 + rnd() * 2.6;
    phase[i] = rnd() * Math.PI * 2;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 8, 0), 60);

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uTime: uTime,
      uMap: { value: makeDotSprite(64) },
      uColor: { value: new THREE.Color(0xcfe9f2) },
      uPixelRatio: { value: 1 },
      uHeight: { value: height },
      uBase: { value: WORLD.seabedY },
      ...waterUniforms(),
    },
    vertexShader: /* glsl */`
      attribute float aSize;
      attribute float aPhase;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uHeight;
      uniform float uBase;
      varying float vFade;
      varying float vDist;
      varying float vUp;
      void main() {
        vec3 p = position;
        // Частицы медленно оседают и заворачиваются по высоте.
        p.y = uBase + mod(p.y - uBase - uTime * 0.20 + sin(aPhase) * 0.3, uHeight);
        p.x += sin(uTime * 0.22 + aPhase) * 0.7;
        p.z += cos(uTime * 0.17 + aPhase * 1.3) * 0.7;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float dist = -mv.z;
        gl_PointSize = aSize * uPixelRatio * (30.0 / max(1.0, dist));
        // Мелкие частицы у самого глаза не должны «забивать» кадр.
        vFade = smoothstep(0.9, 4.0, dist) * (1.0 - smoothstep(22.0, 44.0, dist));
        vDist = dist;
        vUp = normalize((modelMatrix * vec4(p, 1.0)).xyz - cameraPosition).y;
      }
    `,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap;
      uniform vec3 uColor;
      varying float vFade;
      varying float vDist;
      varying float vUp;
      ${WATER_DIST_DECL}
      ${GRADE_DECL}
      void main() {
        vec4 tex = texture2D(uMap, gl_PointCoord);
        float a = tex.a * vFade * 0.36;
        if (a < 0.01) discard;
        vec3 c = rbWaterDist(uColor, vDist, vUp);
        gl_FragColor = vec4(c, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        gl_FragColor.rgb = rbGrade(gl_FragColor.rgb);
      }
    `,
  });
  const points = new THREE.Points(geo, material);
  points.frustumCulled = false;
  points.renderOrder = 4;
  return points;
}

// --- пузырьки ---------------------------------------------------------------
function buildBubbles(max) {
  const rnd = mulberry32(2024);
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(max * 3);
  const data = new Float32Array(max * 3); // скорость, радиус, фаза
  const vents = [
    new THREE.Vector3(-6.5, WORLD.seabedY, -5.0),
    new THREE.Vector3(7.8, WORLD.seabedY, -3.2),
    new THREE.Vector3(2.2, WORLD.seabedY, 8.4),
  ];
  for (let i = 0; i < max; i++) {
    const v = vents[i % vents.length];
    pos[i * 3] = v.x + (rnd() - 0.5) * 0.7;
    pos[i * 3 + 1] = WORLD.seabedY + rnd() * 15;
    pos[i * 3 + 2] = v.z + (rnd() - 0.5) * 0.7;
    data[i * 3] = 0.5 + rnd() * 0.7;      // скорость всплытия
    data[i * 3 + 1] = 0.6 + rnd() * 1.8;  // размер
    data[i * 3 + 2] = rnd() * Math.PI * 2;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aData', new THREE.BufferAttribute(data, 3));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 8, 0), 40);

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: uTime,
      uMap: { value: makeBubbleSprite(64) },
      uPixelRatio: { value: 1 },
      uTop: { value: WORLD.surfaceY },
      uBase: { value: WORLD.seabedY },
      ...waterUniforms(),
    },
    vertexShader: /* glsl */`
      attribute vec3 aData;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uTop;
      uniform float uBase;
      varying float vFade;
      varying float vDist;
      varying float vUp;
      void main() {
        vec3 p = position;
        float speed = aData.x;
        float radius = aData.y;
        float phase = aData.z;
        float span = uTop - uBase;
        // Пузырь всплывает, чуть покачиваясь, и начинает путь заново у дна.
        p.y = uBase + mod(p.y - uBase + uTime * speed, span);
        p.x += sin(uTime * 2.1 + phase) * 0.10;
        p.z += cos(uTime * 1.7 + phase) * 0.10;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float dist = -mv.z;
        gl_PointSize = radius * uPixelRatio * (46.0 / max(1.0, dist));
        vFade = smoothstep(0.4, 2.0, dist) * (1.0 - smoothstep(18.0, 40.0, dist));
        vDist = dist;
        vUp = normalize((modelMatrix * vec4(p, 1.0)).xyz - cameraPosition).y;
      }
    `,
    fragmentShader: /* glsl */`
      uniform sampler2D uMap;
      varying float vFade;
      varying float vDist;
      varying float vUp;
      ${WATER_DIST_DECL}
      ${GRADE_DECL}
      void main() {
        vec4 tex = texture2D(uMap, gl_PointCoord);
        float a = tex.a * vFade * 0.85;
        if (a < 0.01) discard;
        gl_FragColor = vec4(rbWaterDist(tex.rgb, vDist, vUp), a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        gl_FragColor.rgb = rbGrade(gl_FragColor.rgb);
      }
    `,
  });
  const points = new THREE.Points(geo, material);
  points.frustumCulled = false;
  points.renderOrder = 5;
  return points;
}

export function buildOcean(preset) {
  const group = new THREE.Group();
  group.name = 'ocean';
  const maxRays = 14;
  const maxSnow = 4200;
  const maxBubbles = 260;

  const surface = buildSurface();
  const rays = buildRays(maxRays);
  const snow = buildSnow(maxSnow);
  const bubbles = buildBubbles(maxBubbles);
  group.add(surface, rays.mesh, snow, bubbles);

  const ocean = { group, surface, rays, snow, bubbles, maxRays, maxSnow, maxBubbles };
  setOceanQuality(ocean, preset);
  return ocean;
}

export function setOceanQuality(ocean, preset) {
  ocean.snow.geometry.setDrawRange(0, Math.min(ocean.maxSnow, preset.particles));
  ocean.bubbles.geometry.setDrawRange(0, Math.min(ocean.maxBubbles, preset.bubbles));
  ocean.rays.visibleCount = Math.min(ocean.maxRays, preset.rays);
  ocean.snow.material.uniforms.uPixelRatio.value = window.devicePixelRatio || 1;
  ocean.bubbles.material.uniforms.uPixelRatio.value = window.devicePixelRatio || 1;
}

export function updateOcean(ocean, t) {
  updateRays(ocean.rays, t, ocean.rays.visibleCount ?? ocean.maxRays);
}

export function disposeOcean(ocean) {
  for (const obj of [ocean.surface, ocean.rays.mesh, ocean.snow, ocean.bubbles]) {
    obj.geometry?.dispose();
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const m of mats) { m.map?.dispose(); m.dispose(); }
  }
}
