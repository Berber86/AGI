import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { erodedRock } from "./landscape.js";
import {
  createWorkshopTexture,
  applyWorkshopFinish,
} from "./workshop-materials.js";
import { createConsoleDisplay } from "./console-display.js";
import { createRelicModel } from "./relic-model.js";

export const BASE_POSITION = [-30, 1, 35];
export const STATIONS = [
  {
    id: "lab",
    name: "Лаборатория",
    subtitle: "ДОСТАВКА И АНАЛИЗ",
    position: [-3.7, 1.5, -1.4],
  },
  {
    id: "collection",
    name: "Коллекция",
    subtitle: "ХРАНИЛИЩЕ НАХОДОК",
    position: [0, 1.5, -4.6],
  },
  {
    id: "terminal",
    name: "Терминал",
    subtitle: "ОБОРУДОВАНИЕ И СВЯЗЬ",
    position: [3.7, 1.5, -1.4],
  },
];
function label(text, sub, width = 768, height = 192) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#10282c";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#43696b";
  ctx.strokeRect(8, 8, width - 16, height - 16);
  ctx.fillStyle = "#c2e5d6";
  ctx.font = "32px sans-serif";
  ctx.fillText(text, 34, 70);
  ctx.fillStyle = "#91afaa";
  ctx.font = "19px sans-serif";
  ctx.fillText(sub, 34, 116);
  ctx.fillStyle = "#d0b284";
  ctx.fillRect(34, height - 34, width * 0.55, 3);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
}
function box(root, size, position, material, radius = 0.05) {
  const mesh = new THREE.Mesh(
    new RoundedBoxGeometry(...size, 1, Math.min(radius, Math.min(...size) / 3)),
    material,
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}
export function createLander() {
  const group = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({
    color: 0xb3b8ac,
    roughness: 0.68,
    metalness: 0.45,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x253c42,
    roughness: 0.65,
    metalness: 0.7,
  });
  const trim = new THREE.MeshStandardMaterial({
    color: 0xc29860,
    roughness: 0.5,
    metalness: 0.5,
  });
  const light = new THREE.MeshStandardMaterial({
    color: 0xc2e3d2,
    emissive: 0x8bd3bf,
    emissiveIntensity: 1.3,
  });
  box(group, [8, 4.4, 10], [0, 2.4, 0], shell, 0.3);
  box(group, [8.4, 0.5, 10.4], [0, 0.5, 0], dark);
  box(group, [8.2, 0.6, 10.2], [0, 4.8, 0], dark);
  for (const x of [-3.4, 3.4])
    for (const z of [-4, 4]) {
      box(group, [0.8, 2.5, 0.8], [x, -0.3, z], dark);
      box(group, [2, 0.25, 2], [x, -1.5, z], trim);
    }
  box(group, [2.4, 3.5, 0.1], [0, 2.2, 5.08], dark);
  box(group, [2.6, 0.1, 0.13], [0, 4, 5.15], light);
  for (let i = 0; i < 5; i++)
    box(group, [3, 0.25, 1], [0, -0.55 - i * 0.21, 5.5 + i * 0.8], shell);
  for (const x of [-2.8, 2.8])
    box(group, [1.7, 1.25, 0.12], [x, 3, 5.09], dark);
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 0.75),
    label("STRANNIK / 01", "FIELD RESEARCH MODULE"),
  );
  plaque.position.set(0, 4.4, 5.13);
  group.add(plaque);
  box(group, [0.18, 3, 0.18], [2.3, 6.2, -2], dark);
  const dish = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.4, 0.2, 24),
    shell,
  );
  dish.position.set(2.3, 7.5, -2);
  dish.rotation.z = 0.6;
  group.add(dish);
  return group;
}
export function createBaseInterior(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x13252d);
  const root = new THREE.Group();
  scene.add(root);
  const hull = new THREE.MeshStandardMaterial({
    color: 0xa4a99f,
    roughness: 0.57,
    metalness: 0.3,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x1c3038,
    roughness: 0.6,
    metalness: 0.6,
  });
  const floor = new THREE.MeshStandardMaterial({
    color: 0x3b4c54,
    roughness: 0.74,
    metalness: 0.4,
  });
  const black = new THREE.MeshStandardMaterial({
    color: 0x0f2027,
    roughness: 0.35,
    metalness: 0.5,
  });
  const bronze = new THREE.MeshStandardMaterial({
    color: 0xab8c5c,
    roughness: 0.46,
    metalness: 0.6,
  });
  const cyan = new THREE.MeshStandardMaterial({
    color: 0xb6efe0,
    emissive: 0x6fb8aa,
    emissiveIntensity: 1.35,
  });
  const amber = new THREE.MeshStandardMaterial({
    color: 0xf5d29c,
    emissive: 0xd09a52,
    emissiveIntensity: 1.2,
  });
  const finishTexture = createWorkshopTexture();
  for (const material of [hull, dark, black, bronze])
    applyWorkshopFinish(material, finishTexture);
  applyWorkshopFinish(floor, finishTexture, true);
  box(root, [12, 0.3, 14], [0, -0.15, 0], dark);
  for (let z = -6; z < 7; z += 1.5)
    for (const x of [-3, 0, 3])
      box(root, [2.9, 0.04, 1.4], [x, 0.025, z], floor, 0.015);
  box(root, [0.25, 5.2, 14], [-6, 2.5, 0], hull);
  box(root, [0.25, 5.2, 14], [6, 2.5, 0], hull);
  box(root, [12, 0.25, 14], [0, 5.1, 0], dark);
  box(root, [12, 5.2, 0.3], [0, 2.5, 7], dark);
  box(root, [12, 2.3, 0.3], [0, 1.05, -7], dark);
  box(root, [12, 0.8, 0.3], [0, 4.7, -7], hull);
  for (const x of [-5, 5]) box(root, [2, 2.5, 0.3], [x, 3, -7], hull);
  // Viewport: a softly lit alien horizon and actual 3D rock silhouettes beyond the hull.
  const horizon = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 10),
    new THREE.ShaderMaterial({
      uniforms: {
        zenith: { value: new THREE.Color(0x254857) },
        horizon: { value: new THREE.Color(0xc1b69b) },
      },
      vertexShader: `varying vec2 skyUv; void main(){skyUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 skyUv; uniform vec3 zenith; uniform vec3 horizon;
        void main(){vec3 c=mix(horizon,zenith,smoothstep(.15,1.,skyUv.y));
        float sun=exp(-length((skyUv-vec2(.25,.55))*vec2(2.2,1.))*16.);
        c+=vec3(.55,.32,.12)*sun;gl_FragColor=vec4(c,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`,
    }),
  );
  horizon.position.set(0, 4, -19);
  scene.add(horizon);
  for (let i = 0; i < 8; i++) {
    const rock = new THREE.Mesh(
      erodedRock(3, i * 0.63),
      new THREE.MeshStandardMaterial({ color: 0x445f67, roughness: 1 }),
    );
    rock.position.set(-10 + i * 3, 1, -17);
    rock.scale.set(2, 1.8 + (i % 3) * 1.1, 2);
    scene.add(rock);
  }
  for (const x of [-3.8, 3.8])
    box(root, [0.1, 2.25, 0.15], [x, 3.2, -6.8], cyan);
  for (const z of [-5, -1, 3, 6]) {
    box(root, [0.25, 5, 0.3], [-5.7, 2.5, z], dark);
    box(root, [0.25, 5, 0.3], [5.7, 2.5, z], dark);
    box(root, [11.4, 0.25, 0.3], [0, 4.8, z], hull);
    box(root, [5.2, 0.04, 0.1], [0, 4.64, z], cyan);
  }
  for (const x of [-1.4, 1.4])
    box(root, [0.045, 0.035, 11], [x, 0.06, 0.3], cyan, 0.01);
  const medallion = new THREE.Mesh(
    new THREE.RingGeometry(0.65, 0.72, 64),
    bronze,
  );
  medallion.rotation.x = -Math.PI / 2;
  medallion.position.set(0, 0.065, 1);
  root.add(medallion);
  // Laboratory bench and instrument gantry.
  box(root, [2.1, 1.05, 4], [-4.3, 0.525, -1.5], dark);
  box(root, [2.5, 0.18, 4.3], [-4.2, 1.15, -1.5], hull);
  box(root, [1.3, 0.05, 1.4], [-4.05, 1.28, -0.4], black);
  box(root, [0.04, 0.02, 1.4], [-3.4, 1.32, -0.4], cyan);
  box(root, [0.16, 1.1, 0.16], [-4.95, 1.8, -0.4], bronze);
  box(root, [1.2, 0.15, 0.16], [-4.42, 2.3, -0.4], bronze);
  box(root, [0.28, 0.4, 0.28], [-3.9, 2.05, -0.4], dark);
  box(root, [0.14, 0.15, 0.14], [-3.9, 1.8, -0.4], cyan);
  for (let i = 0; i < 4; i++)
    box(
      root,
      [0.42, 0.32, 0.5],
      [-4.3, 1.42, -2.9 + i * 0.43],
      i % 2 ? bronze : dark,
    );
  // Display plinths and open protective frames.
  const displayPositions = [-2.2, 0, 2.2];
  displayPositions.forEach((x) => {
    box(root, [1.7, 1.15, 1.35], [x, 0.575, -4.6], dark);
    box(root, [1.75, 0.12, 1.4], [x, 1.2, -4.6], hull);
    box(root, [1.45, 0.03, 1.15], [x, 1.28, -4.6], black);
    for (const dx of [-0.8, 0.8])
      box(root, [0.04, 1.6, 0.04], [x + dx, 2, -5.22], bronze);
    box(root, [1.64, 0.05, 0.05], [x, 2.8, -5.22], cyan);
    box(root, [1.3, 0.055, 0.03], [x, 0.93, -3.9], cyan);
  });
  // Communications console and equipment locker.
  box(root, [2.1, 1.2, 3.8], [4.3, 0.6, -1.5], dark);
  box(root, [2.4, 0.16, 4], [4.2, 1.24, -1.5], hull);
  const consoleDisplay = createConsoleDisplay();
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.3, 1.3),
    consoleDisplay.material,
  );
  const monitorFrame = box(root, [2.4, 1.42, 0.15], [4.1, 2.15, -2.4], black);
  monitorFrame.rotation.y = -0.35;
  screen.position.set(0, 0, 0.085);
  monitorFrame.add(screen);
  for (let i = 0; i < 4; i++) {
    box(root, [0.38, 0.08, 0.45], [3.5 + i * 0.39, 1.36, -0.55], black);
    box(
      root,
      [0.2, 0.012, 0.07],
      [3.5 + i * 0.39, 1.41, -0.6],
      i === 0 ? amber : cyan,
    );
  }
  for (const x of [-5.25, 5.25]) {
    box(root, [1, 2.9, 1.6], [x, 1.45, 3.9], dark);
    for (let y = 0.5; y < 3; y += 0.65) {
      box(root, [0.9, 0.5, 0.08], [x, y, 4.75], hull);
      box(root, [0.3, 0.035, 0.05], [x, y, 4.8], bronze);
    }
  }
  box(root, [3.1, 4, 0.12], [0, 2, 6.78], hull);
  box(root, [0.06, 3.7, 0.08], [0, 2, 6.68], black);
  for (const x of [-1.65, 1.65])
    box(root, [0.07, 3.8, 0.08], [x, 2, 6.65], amber);
  const plaques = [
    [
      "01 / LABORATORY",
      "SAMPLE INTAKE & MATERIAL ANALYSIS",
      [-4.05, 3, -3.2],
      2.4,
    ],
    ["02 / COLLECTION", "PALIMPSEST  •  FIELD ARCHIVE", [0, 3.1, -6.7], 3.5],
    ["03 / SYSTEMS", "EXPEDITION CONTROL", [4.05, 3, -3.2], 2.4],
  ];
  for (const [title, sub, pos, w] of plaques) {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(w, w / 4),
      label(title, sub),
    );
    panel.position.set(...pos);
    root.add(panel);
  }
  for (const x of [-5.76, 5.76]) {
    for (const z of [-3.5, 0.8]) {
      box(root, [0.08, 1.25, 2.9], [x, 3.35, z], dark);
      for (let y = 2.93; y < 3.9; y += 0.18)
        box(
          root,
          [0.09, 0.035, 2.5],
          [x > 0 ? x - 0.05 : x + 0.05, y, z],
          hull,
        );
    }
  }
  for (const x of [-4.3, 4.3]) {
    box(root, [1.75, 0.65, 0.05], [x, 0.65, 0.54], floor);
    box(root, [0.5, 0.06, 0.06], [x, 0.9, 0.58], bronze);
  }
  for (const side of [-1, 1])
    for (let i = 0; i < 5; i++) {
      const stripe = box(
        root,
        [0.12, 0.012, 0.42],
        [side * 1.75, 0.063, 2.5 + i * 0.35],
        bronze,
        0.005,
      );
      stripe.rotation.y = side * 0.65;
    }
  // Service conduits, bolted plates and task lights remain in static material batches.
  for (const side of [-1, 1]) {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 5.45, 1.2, 5.4),
      new THREE.Vector3(side * 5.45, 4.35, 4.6),
      new THREE.Vector3(side * 5.45, 4.35, -4.6),
      new THREE.Vector3(side * 4.8, 2.4, -5.8),
    ]);
    root.add(
      new THREE.Mesh(new THREE.TubeGeometry(path, 28, 0.075, 6, false), bronze),
    );
    box(root, [1.6, 0.035, 0.12], [side * 4.2, 1.04, 0.65], amber);
    for (const z of [-3.1, 0.2])
      for (const dx of [-0.83, 0.83]) {
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, 0.022, 6),
          bronze,
        );
        bolt.position.set(side * 4.2 + dx, 1.255, z);
        root.add(bolt);
      }
  }
  const glazing = new THREE.Group();
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xa6c9cf,
    metalness: 0.15,
    roughness: 0.12,
    transparent: true,
    opacity: 0.085,
    forceSinglePass: true,
    depthWrite: false,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    side: THREE.DoubleSide,
  });
  const paneGeometry = new THREE.PlaneGeometry(1.6, 1.45);
  displayPositions.forEach((x) => {
    const pane = new THREE.Mesh(paneGeometry, glass);
    pane.position.set(x, 2.04, -3.88);
    glazing.add(pane);
    for (const dx of [-0.65, 0.65])
      box(root, [0.085, 0.18, 0.06], [x + dx, 1.36, -3.86], bronze);
  });
  scene.add(glazing);
  // Keep the screen's world transform when its static backing is batched.
  root.updateMatrixWorld(true);
  root.attach(screen);
  // Batch opaque static cabin geometry. Dynamic specimens remain independent.
  root.updateMatrixWorld(true);
  const batches = new Map();
  for (const child of [...root.children]) {
    if (!child.isMesh || !child.material.isMeshStandardMaterial) continue;
    const geometry = child.geometry.index
      ? child.geometry.toNonIndexed()
      : child.geometry.clone();
    geometry.applyMatrix4(child.matrixWorld);
    if (!batches.has(child.material)) batches.set(child.material, []);
    batches.get(child.material).push(geometry);
    child.geometry.dispose();
    root.remove(child);
  }
  for (const [material, geometries] of batches) {
    const mesh = new THREE.Mesh(mergeGeometries(geometries), material);
    mesh.receiveShadow = true;
    mesh.castShadow = ![cyan, amber].includes(material);
    root.add(mesh);
    geometries.forEach((g) => g.dispose());
  }
  scene.add(new THREE.HemisphereLight(0xc2ddeb, 0x26343c, 0.75));
  const key = new THREE.SpotLight(0xffd6a0, 210, 20, Math.PI * 0.39, 0.7, 2);
  key.position.set(-2.4, 4.45, 2.7);
  key.target.position.set(-1.3, 0.3, -2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.2;
  key.shadow.camera.far = 20;
  key.shadow.bias = -0.00015;
  key.shadow.normalBias = 0.025;
  key.shadow.radius = 2;
  scene.add(key, key.target);
  const rim = new THREE.PointLight(0x9acddf, 42, 12, 2);
  rim.position.set(0, 3.4, -4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xb4cddd, 0.45);
  fill.position.set(0, 3, 6);
  scene.add(fill);
  // One local reflection probe, captured before exhibits are added. Not SSR or ray tracing.
  const pmrem = new THREE.PMREMGenerator(renderer);
  let reflection;
  const wasShadowEnabled = renderer.shadowMap.enabled;
  const previousTarget = renderer.getRenderTarget();
  const previousFace = renderer.getActiveCubeFace();
  const previousMip = renderer.getActiveMipmapLevel();
  const previousToneMapping = renderer.toneMapping;
  const previousAutoClear = renderer.autoClear;
  const previousXr = renderer.xr.enabled;
  try {
    glazing.visible = false;
    renderer.shadowMap.enabled = false;
    reflection = pmrem.fromScene(scene, 0.055, 0.1, 45, {
      size: 128,
      position: new THREE.Vector3(0, 2.4, 1),
    });
    scene.environment = reflection.texture;
    scene.environmentIntensity = 0.55;
  } catch (error) {
    // Reflection is optional: keep the cabin usable if a device cannot build the probe.
    reflection?.dispose();
    reflection = null;
    scene.environment = null;
    console.warn("Cabin reflection unavailable; using direct lighting.", error);
  } finally {
    renderer.setRenderTarget(previousTarget, previousFace, previousMip);
    renderer.toneMapping = previousToneMapping;
    renderer.autoClear = previousAutoClear;
    renderer.xr.enabled = previousXr;
    renderer.shadowMap.enabled = wasShadowEnabled;
    renderer.shadowMap.needsUpdate = true;
    glazing.visible = true;
    pmrem.dispose();
  }
  const specimens = displayPositions.map((x, i) => {
    const model = createRelicModel(i);
    model.scale.setScalar(0.6);
    model.position.set(x, 1.95, -4.6);
    model.visible = false;
    scene.add(model);
    return model;
  });
  return {
    scene,
    specimens,
    reflection,
    setQuality(quality) {
      glazing.visible = quality === "high";
    },
    sync(base) {
      consoleDisplay.update(base);
      specimens.forEach((model, i) => {
        model.visible = base.deposited[i];
      });
    },
  };
}
