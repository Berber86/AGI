// Сборка мира: свет, вода, дно, риф, рыбы, кит и постобработка.
// Сцена рисуется дважды в VR (по разу на глаз), поэтому дорогие эффекты
// включаются только в обычном режиме — об этом прямо сказано в контракте.
import * as THREE from 'three';
import { WORLD, presetOf } from './config.js';
import { water, makeWaterEnvironment, patchUnderwater, setCausticOctaves } from './shading.js';
import { buildSeabed, seabedHeight } from './seabed.js';
import { buildReef, setReefQuality } from './corals.js';
import { buildFish, setFishQuality, updateFish, fishCounts } from './fish.js';
import { buildWhale, updateWhale, whaleInfo } from './whale.js';
import { buildOcean, setOceanQuality, updateOcean } from './ocean.js';

export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
    alpha: false,
    stencil: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = false; // под водой тени мягкие: их заменяет рассеянный свет
  return renderer;
}

export function createWorld(renderer, presetId) {
  const preset = presetOf(presetId);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(WORLD.fogColor);
  scene.fog = new THREE.FogExp2(WORLD.fogColor, WORLD.fogDensity);

  const camera = new THREE.PerspectiveCamera(62, 1, 0.08, 700);
  camera.position.set(0, WORLD.eyeY, 0);
  camera.lookAt(0, WORLD.eyeY, -1);

  // Солнце сверху и рассеянный свет толщи воды.
  const sun = new THREE.DirectionalLight(0xfff3dc, 2.3);
  sun.position.set(...WORLD.sunDir).multiplyScalar(60).add(new THREE.Vector3(0, WORLD.surfaceY, 0));
  scene.add(sun);
  const sky = new THREE.HemisphereLight(0x9ff0ff, 0x14555e, 1.15);
  scene.add(sky);
  const fill = new THREE.DirectionalLight(0x6fd8e8, 0.35);
  fill.position.set(0.4, -0.6, -0.5).multiplyScalar(40);
  scene.add(fill);

  scene.environment = makeWaterEnvironment(renderer);
  if ('environmentIntensity' in scene) scene.environmentIntensity = 0.5;

  const seabed = buildSeabed(preset.seabedSegments, preset.corals);
  scene.add(seabed.group);

  const reef = buildReef(preset.corals);
  scene.add(reef.group);

  const fish = buildFish(preset.fish);
  scene.add(fish.group);

  const whale = buildWhale();
  scene.add(whale.group);

  const ocean = buildOcean(preset);
  scene.add(ocean.group);

  const world = {
    scene, camera, renderer, seabed, reef, fish, whale, ocean,
    lights: { sun, sky, fill },
    preset: preset.id,
    segments: preset.seabedSegments,
    time: 0,
  };

  applyPreset(world, preset.id);
  return world;
}

/** Пресет качества: разрешение, плотность рифа/рыб, частицы и лучи. */
export function applyPreset(world, presetId) {
  const preset = presetOf(presetId);
  world.preset = preset.id;
  world.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, preset.dpr));
  world.ocean.snow.material.uniforms.uPixelRatio.value = world.renderer.getPixelRatio();
  world.ocean.bubbles.material.uniforms.uPixelRatio.value = world.renderer.getPixelRatio();

  // Геометрия дна перестраивается только если реально меняется число сегментов:
  // перестройка заметна, но это явное действие пользователя.
  if (preset.seabedSegments !== world.segments) {
    const parent = world.seabed.group.parent;
    parent.remove(world.seabed.group);
    disposeObject(world.seabed.group);
    world.seabed = buildSeabed(preset.seabedSegments, preset.corals);
    parent.add(world.seabed.group);
    world.segments = preset.seabedSegments;
  }

  setReefQuality(world.reef, preset.corals);
  setFishQuality(world.fish, preset.fish);
  setOceanQuality(world.ocean, preset);
  for (const m of allUnderwaterMaterials(world)) setCausticOctaves(m, preset.causticOctaves);
  return preset;
}

function allUnderwaterMaterials(world) {
  const list = [...world.seabed.materials, ...world.reef.materials, ...world.fish.species.map((s) => s.material)];
  list.push(world.whale.material);
  return list.filter((m) => m && m.defines && 'CAUSTIC_OCTAVES' in m.defines);
}

export function updateWorld(world, dt, elapsed) {
  world.time = elapsed;
  water.uTime.value = elapsed;
  updateFish(world.fish, elapsed);
  updateWhale(world.whale, elapsed);
  updateOcean(world.ocean, elapsed);

  // Тихий «вдох»: пловец чуть покачивается на месте. Амплитуда сантиметры —
  // этого хватает для ощущения живого тела и не укачивает.
  const breath = Math.sin(elapsed * 0.55) * 0.055;
  const sway = Math.sin(elapsed * 0.31 + 1.2) * 0.035;
  world.camera.position.set(sway, WORLD.eyeY + breath, 0);
}

export function worldInfo(world) {
  const info = world.renderer.info;
  return {
    preset: world.preset,
    segments: world.segments,
    fish: fishCounts(world.fish),
    fishTotal: fishCounts(world.fish).reduce((sum, f) => sum + f.count, 0),
    corals: world.reef.meshes.map((m) => m.count),
    whale: whaleInfo(world.whale),
    particles: {
      snow: world.ocean.snow.geometry.drawRange.count,
      bubbles: world.ocean.bubbles.geometry.drawRange.count,
      rays: world.ocean.rays.mesh.count / 2,
    },
    render: {
      calls: info.render.calls,
      triangles: info.render.triangles,
      programs: info.programs ? info.programs.length : null,
      pixelRatio: world.renderer.getPixelRatio(),
    },
    time: +world.time.toFixed(2),
  };
}

export function disposeObject(root) {
  root.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
    for (const m of mats) {
      for (const key of ['map', 'normalMap', 'alphaMap', 'envMap']) if (m[key]) m[key].dispose();
      m.dispose();
    }
  });
}

export function seabedAt(x, z) { return seabedHeight(x, z); }
export { patchUnderwater };
