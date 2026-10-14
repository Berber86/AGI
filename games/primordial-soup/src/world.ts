import {
  ArcRotateCamera,
  Color3,
  DynamicTexture,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3,
} from '@babylonjs/core';
import { EXIT_X, EXIT_Z, type GameState, type OrganId, type WorldEntity } from './simulation';

export interface MicroWorld {
  cellRoot: TransformNode;
  organVisible(organ: OrganId): boolean;
  exitVisible(): boolean;
  update(state: GameState, seconds: number): void;
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function makeWaterTexture(scene: Scene): DynamicTexture {
  const texture = new DynamicTexture(
    'primordial-water-texture',
    { width: 1024, height: 1024 },
    scene,
    false,
    Texture.BILINEAR_SAMPLINGMODE,
  );
  const ctx = texture.getContext() as CanvasRenderingContext2D;
  const gradient = ctx.createRadialGradient(520, 480, 55, 520, 480, 710);
  gradient.addColorStop(0, '#267e85');
  gradient.addColorStop(0.42, '#176273');
  gradient.addColorStop(0.78, '#0b405b');
  gradient.addColorStop(1, '#082c49');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  const random = seededRandom(0x51ea);
  for (let i = 0; i < 170; i += 1) {
    const x = random() * 1024;
    const y = random() * 1024;
    const radius = 2 + random() * 13;
    const alpha = 0.025 + random() * 0.105;
    const shine = ctx.createRadialGradient(x - radius * 0.25, y - radius * 0.3, 0, x, y, radius);
    shine.addColorStop(0, `rgba(198,255,240,${alpha * 2.2})`);
    shine.addColorStop(0.55, `rgba(108,224,216,${alpha})`);
    shine.addColorStop(1, 'rgba(81,201,208,0)');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 11; i += 1) {
    const y = 95 + i * 86;
    ctx.strokeStyle = `rgba(161,255,235,${0.012 + i * 0.001})`;
    ctx.lineWidth = 1 + (i % 3);
    ctx.beginPath();
    ctx.ellipse(500, y, 530, 35 + (i % 4) * 12, -0.08, 0.07, Math.PI * 0.95);
    ctx.stroke();
  }
  texture.update(false);
  texture.wrapU = Texture.WRAP_ADDRESSMODE;
  texture.wrapV = Texture.WRAP_ADDRESSMODE;
  texture.uScale = 2.2;
  texture.vScale = 2.2;
  return texture;
}

function makeOrganGroups(scene: Scene, root: TransformNode): Map<OrganId, TransformNode> {
  const groups = new Map<OrganId, TransformNode>();
  const material = (name: string, diffuse: Color3, emissive: Color3): StandardMaterial => {
    const result = new StandardMaterial(name, scene);
    result.diffuseColor = diffuse;
    result.emissiveColor = emissive;
    result.specularColor = new Color3(0.9, 1, 0.96);
    result.specularPower = 68;
    result.alpha = 0.9;
    return result;
  };
  const flagellumMaterial = material('flagellum-material', new Color3(0.35, 0.96, 0.82), new Color3(0.1, 0.44, 0.4));
  const ciliaMaterial = material('evolved-cilia-material', new Color3(0.7, 1, 0.83), new Color3(0.1, 0.37, 0.2));
  const spineMaterial = material('cell-spines-material', new Color3(1, 0.74, 0.42), new Color3(0.35, 0.13, 0.035));
  const proboscisMaterial = material('proboscis-material', new Color3(0.36, 0.95, 0.87), new Color3(0.1, 0.39, 0.42));

  const flagellum = new TransformNode('organ-flagellum', scene);
  flagellum.parent = root;
  const tail = MeshBuilder.CreateTube('flagellum-tail', {
    path: [new Vector3(0, 1, -1.12), new Vector3(-0.12, 0.96, -1.78), new Vector3(-0.32, 1.04, -2.45), new Vector3(-0.16, 1.1, -3.12)],
    radius: 0.12,
    tessellation: 10,
  }, scene);
  tail.parent = flagellum;
  tail.material = flagellumMaterial;
  const tailTip = MeshBuilder.CreateSphere('flagellum-tip', { diameter: 0.24, segments: 10 }, scene);
  tailTip.parent = flagellum;
  tailTip.position.set(-0.16, 1.1, -3.12);
  tailTip.material = flagellumMaterial;
  groups.set('flagellum', flagellum);

  const cilia = new TransformNode('organ-cilia', scene);
  cilia.parent = root;
  for (let index = 0; index < 14; index += 1) {
    const angle = (Math.PI * 2 * index) / 14;
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const path = [
      new Vector3(dx * 1.18, 0.92, dz * 1.18),
      new Vector3(dx * 1.7, 1.05 + Math.sin(index * 1.9) * 0.09, dz * 1.7),
      new Vector3(dx * 2.28, 1.11 + Math.cos(index * 1.3) * 0.12, dz * 2.28),
    ];
    const cilium = MeshBuilder.CreateTube(`evolved-cilium-${index}`, { path, radius: 0.04, tessellation: 7 }, scene);
    cilium.parent = cilia;
    cilium.material = ciliaMaterial;
  }
  groups.set('cilia', cilia);

  const spines = new TransformNode('organ-spines', scene);
  spines.parent = root;
  for (let index = 0; index < 9; index += 1) {
    const angle = (Math.PI * 2 * index) / 9;
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const bend = Math.sin(index * 2.2) * 0.1;
    const path = [
      new Vector3(dx * 1.08, 1.05, dz * 1.08),
      new Vector3(dx * 1.4 + bend, 1.08 + bend, dz * 1.4),
      new Vector3(dx * 1.92 + bend, 1.11 + bend, dz * 1.92),
    ];
    const spine = MeshBuilder.CreateTube(`cell-spine-${index}`, { path, radius: 0.115, tessellation: 6 }, scene);
    spine.parent = spines;
    spine.material = spineMaterial;
  }
  groups.set('spines', spines);

  const proboscis = new TransformNode('organ-proboscis', scene);
  proboscis.parent = root;
  const feedingTube = MeshBuilder.CreateTube('proboscis-tube', {
    path: [new Vector3(0, 1.02, 1.12), new Vector3(0.04, 0.98, 1.75), new Vector3(0.08, 1.02, 2.42)],
    radius: 0.145,
    tessellation: 9,
  }, scene);
  feedingTube.parent = proboscis;
  feedingTube.material = proboscisMaterial;
  const mouthRing = MeshBuilder.CreateTorus('proboscis-mouth', { diameter: 0.46, thickness: 0.075, tessellation: 18 }, scene);
  mouthRing.parent = proboscis;
  mouthRing.position.set(0.08, 1.02, 2.4);
  mouthRing.material = proboscisMaterial;
  groups.set('proboscis', proboscis);

  for (const group of groups.values()) group.setEnabled(false);
  return groups;
}

function makeCell(scene: Scene): { root: TransformNode; parts: Mesh[]; organGroups: Map<OrganId, TransformNode> } {
  const root = new TransformNode('player-cell', scene);
  const parts: Mesh[] = [];

  const membrane = new StandardMaterial('cell-membrane', scene);
  membrane.diffuseColor = new Color3(0.29, 0.91, 0.78);
  membrane.emissiveColor = new Color3(0.04, 0.22, 0.19);
  membrane.specularColor = new Color3(0.9, 1, 0.96);
  membrane.specularPower = 72;
  membrane.alpha = 0.89;
  membrane.backFaceCulling = false;

  const body = MeshBuilder.CreateSphere('cell-body', { diameter: 2.65, segments: 32 }, scene);
  body.parent = root;
  body.position.y = 1.05;
  body.material = membrane;
  parts.push(body);

  const nucleusMaterial = new StandardMaterial('cell-nucleus-material', scene);
  nucleusMaterial.diffuseColor = new Color3(0.15, 0.49, 0.56);
  nucleusMaterial.emissiveColor = new Color3(0.12, 0.52, 0.55);
  nucleusMaterial.specularColor = new Color3(0.89, 1, 0.97);
  nucleusMaterial.alpha = 0.88;
  const nucleus = MeshBuilder.CreateSphere('cell-nucleus', { diameter: 1.16, segments: 24 }, scene);
  nucleus.parent = root;
  nucleus.position.set(0.16, 1.12, -0.08);
  nucleus.scaling.set(1, 0.78, 1);
  nucleus.material = nucleusMaterial;
  parts.push(nucleus);

  const coreMaterial = new StandardMaterial('cell-core-light', scene);
  coreMaterial.diffuseColor = new Color3(0.64, 1, 0.8);
  coreMaterial.emissiveColor = new Color3(0.25, 0.92, 0.63);
  coreMaterial.specularColor = Color3.White();
  coreMaterial.alpha = 0.8;
  const core = MeshBuilder.CreateSphere('cell-core-highlight', { diameter: 0.34, segments: 16 }, scene);
  core.parent = root;
  core.position.set(-0.32, 1.78, 0.52);
  core.material = coreMaterial;
  parts.push(core);

  const ciliaMaterial = new StandardMaterial('starter-cilia-material', scene);
  ciliaMaterial.diffuseColor = new Color3(0.58, 0.98, 0.78);
  ciliaMaterial.emissiveColor = new Color3(0.08, 0.24, 0.16);
  ciliaMaterial.specularColor = new Color3(0.84, 1, 0.93);
  for (let i = 0; i < 10; i += 1) {
    const angle = (Math.PI * 2 * i) / 10;
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const path = [
      new Vector3(dx * 1.08, 0.92, dz * 1.08),
      new Vector3(dx * 1.42, 1.12 + Math.sin(i * 2.4) * 0.08, dz * 1.42),
      new Vector3(dx * 1.78, 1.15 + Math.cos(i * 1.7) * 0.12, dz * 1.78),
    ];
    const cilium = MeshBuilder.CreateTube(`starter-cilium-${i}`, { path, radius: 0.055, tessellation: 8 }, scene);
    cilium.parent = root;
    cilium.material = ciliaMaterial;
    parts.push(cilium);
  }

  const haloMaterial = new StandardMaterial('cell-halo-material', scene);
  haloMaterial.diffuseColor = new Color3(0.21, 0.78, 0.72);
  haloMaterial.emissiveColor = new Color3(0.1, 0.53, 0.53);
  haloMaterial.alpha = 0.3;
  const halo = MeshBuilder.CreateTorus('cell-membrane-ring', { diameter: 3.16, thickness: 0.025, tessellation: 56 }, scene);
  halo.parent = root;
  halo.position.y = 0.81;
  halo.rotation.x = Math.PI / 2;
  halo.material = haloMaterial;
  parts.push(halo);

  const organGroups = makeOrganGroups(scene, root);
  return { root, parts, organGroups };
}

interface EntityMaterials {
  nutrient: StandardMaterial;
  prey: StandardMaterial;
  predator: StandardMaterial;
  organelle: StandardMaterial;
  spike: StandardMaterial;
  membrane: StandardMaterial;
}

function makeEntityMaterials(scene: Scene): EntityMaterials {
  const material = (name: string, diffuse: Color3, emissive: Color3, alpha = 1): StandardMaterial => {
    const result = new StandardMaterial(name, scene);
    result.diffuseColor = diffuse;
    result.emissiveColor = emissive;
    result.specularColor = new Color3(0.9, 1, 0.96);
    result.specularPower = 74;
    result.alpha = alpha;
    return result;
  };
  return {
    nutrient: material('nutrient-glow-material', new Color3(0.42, 1, 0.19), new Color3(0.18, 0.86, 0.06)),
    prey: material('prey-membrane-material', new Color3(0.97, 0.38, 0.44), new Color3(0.28, 0.055, 0.1), 0.92),
    predator: material('predator-membrane-material', new Color3(0.39, 0.065, 0.14), new Color3(0.16, 0.012, 0.045), 0.97),
    organelle: material('organelles-material', new Color3(0.68, 1, 0.8), new Color3(0.12, 0.45, 0.28)),
    spike: material('predator-spines-material', new Color3(0.83, 0.7, 0.56), new Color3(0.18, 0.09, 0.035)),
    membrane: material('prey-cilia-material', new Color3(1, 0.76, 0.69), new Color3(0.23, 0.09, 0.05)),
  };
}

function makeEntityView(scene: Scene, entity: WorldEntity, materials: EntityMaterials): { root: TransformNode; baseY: number } {
  const root = new TransformNode(`entity-${entity.id}`, scene);
  const baseY = entity.kind === 'nutrient' ? 0.3 : 0;
  root.position.set(entity.x, baseY, entity.z);
  root.metadata = { entityId: entity.id, kind: entity.kind };

  if (entity.kind === 'nutrient') {
    const glow = MeshBuilder.CreateSphere(`${entity.id}-glow`, { diameter: entity.radius * 1.9, segments: 12 }, scene);
    glow.parent = root;
    glow.position.y = 0.77;
    glow.material = materials.nutrient;
    glow.isPickable = false;
    const core = MeshBuilder.CreateSphere(`${entity.id}-core`, { diameter: entity.radius * 0.62, segments: 8 }, scene);
    core.parent = root;
    core.position.set(-entity.radius * 0.14, 0.86, -entity.radius * 0.22);
    core.material = materials.organelle;
    core.isPickable = false;
    const ring = MeshBuilder.CreateTorus(`${entity.id}-halo`, { diameter: entity.radius * 2.4, thickness: 0.025, tessellation: 20 }, scene);
    ring.parent = root;
    ring.position.y = 0.63;
    ring.rotation.x = Math.PI / 2;
    ring.material = materials.nutrient;
    ring.isPickable = false;
  } else if (entity.kind === 'prey') {
    const body = MeshBuilder.CreateSphere(`${entity.id}-body`, { diameter: entity.radius * 2, segments: 16 }, scene);
    body.parent = root;
    body.position.y = 0.92;
    body.material = materials.prey;
    body.isPickable = false;
    const nucleus = MeshBuilder.CreateSphere(`${entity.id}-nucleus`, { diameter: entity.radius * 0.75, segments: 12 }, scene);
    nucleus.parent = root;
    nucleus.position.set(0.12, 1, 0.16);
    nucleus.material = materials.organelle;
    nucleus.isPickable = false;
    for (let index = 0; index < 7; index += 1) {
      const angle = (Math.PI * 2 * index) / 7;
      const dx = Math.cos(angle);
      const dz = Math.sin(angle);
      const path = [
        new Vector3(dx * entity.radius * 0.75, 0.82, dz * entity.radius * 0.75),
        new Vector3(dx * entity.radius * 1.05, 1 + Math.sin(angle) * 0.08, dz * entity.radius * 1.05),
        new Vector3(dx * entity.radius * 1.36, 1.03 + Math.cos(angle) * 0.1, dz * entity.radius * 1.36),
      ];
      const cilium = MeshBuilder.CreateTube(`${entity.id}-cilia-${index}`, { path, radius: 0.035, tessellation: 6 }, scene);
      cilium.parent = root;
      cilium.material = materials.membrane;
      cilium.isPickable = false;
    }
  } else {
    const body = MeshBuilder.CreateSphere(`${entity.id}-body`, { diameter: entity.radius * 2, segments: 24 }, scene);
    body.parent = root;
    body.position.y = 1.28;
    body.scaling.set(1.05, 0.82, 1.08);
    body.material = materials.predator;
    body.isPickable = false;
    const mouth = MeshBuilder.CreateSphere(`${entity.id}-mouth`, { diameter: entity.radius * 0.66, segments: 12 }, scene);
    mouth.parent = root;
    mouth.position.set(0, 1.21, entity.radius * 0.78);
    mouth.scaling.set(1.1, 0.6, 0.42);
    mouth.material = materials.spike;
    mouth.isPickable = false;
    const eyeMaterial = materials.organelle;
    for (const side of [-1, 1]) {
      const eye = MeshBuilder.CreateSphere(`${entity.id}-sensor-${side}`, { diameter: 0.38, segments: 12 }, scene);
      eye.parent = root;
      eye.position.set(side * 0.49, 1.61, entity.radius * 0.48);
      eye.material = eyeMaterial;
      eye.isPickable = false;
    }
    for (let index = 0; index < 10; index += 1) {
      const angle = (Math.PI * 2 * index) / 10;
      const spine = MeshBuilder.CreateSphere(`${entity.id}-spine-${index}`, { diameter: 1, segments: 8 }, scene);
      spine.parent = root;
      spine.position.set(Math.cos(angle) * entity.radius * 0.79, 1.28 + Math.sin(index * 2) * 0.13, Math.sin(angle) * entity.radius * 0.79);
      spine.scaling.set(0.12, 0.12, entity.radius * 0.56);
      spine.rotation.y = -angle;
      spine.rotation.x = Math.PI / 2 + Math.cos(angle) * 0.22;
      spine.material = materials.spike;
      spine.isPickable = false;
    }
  }
  return { root, baseY };
}

export function createMicroWorld(scene: Scene, camera: ArcRotateCamera, initialState: GameState): MicroWorld {
  scene.clearColor = new Color3(0.025, 0.105, 0.145).toColor4(1);
  scene.fogMode = Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.0038;
  scene.fogColor = new Color3(0.035, 0.19, 0.24);

  const hemisphere = new HemisphericLight('water-column-light', new Vector3(0.1, 1, -0.2), scene);
  hemisphere.intensity = 1.05;
  hemisphere.diffuse = new Color3(0.68, 0.98, 0.94);
  hemisphere.groundColor = new Color3(0.025, 0.11, 0.19);

  const floor = MeshBuilder.CreateGround('water-floor', { width: 512, height: 512, subdivisions: 2 }, scene);
  floor.position.y = -0.12;
  const floorMaterial = new StandardMaterial('water-floor-material', scene);
  floorMaterial.diffuseTexture = makeWaterTexture(scene);
  floorMaterial.diffuseColor = new Color3(0.82, 0.98, 0.93);
  floorMaterial.emissiveColor = new Color3(0.02, 0.15, 0.18);
  floorMaterial.specularColor = new Color3(0.28, 0.76, 0.78);
  floorMaterial.specularPower = 52;
  floor.material = floorMaterial;

  const boundary = MeshBuilder.CreateTorus('soup-boundary', { diameter: 68, thickness: 0.045, tessellation: 144 }, scene);
  boundary.rotation.x = Math.PI / 2;
  boundary.position.y = 0.02;
  const boundaryMaterial = new StandardMaterial('boundary-material', scene);
  boundaryMaterial.emissiveColor = new Color3(0.12, 0.66, 0.67);
  boundaryMaterial.diffuseColor = new Color3(0.12, 0.66, 0.67);
  boundaryMaterial.alpha = 0.33;
  boundary.material = boundaryMaterial;

  const exitRoot = new TransformNode('vent-exit', scene);
  exitRoot.position.set(EXIT_X, 0, EXIT_Z);
  const exitMaterial = new StandardMaterial('vent-exit-material', scene);
  exitMaterial.diffuseColor = new Color3(0.31, 1, 0.83);
  exitMaterial.emissiveColor = new Color3(0.18, 0.93, 0.75);
  exitMaterial.specularColor = Color3.White();
  exitMaterial.specularPower = 96;
  exitMaterial.alpha = 0.78;
  const exitBase = MeshBuilder.CreateTorus('vent-exit-base', { diameter: 7, thickness: 0.09, tessellation: 48 }, scene);
  exitBase.parent = exitRoot;
  exitBase.position.y = 0.08;
  exitBase.rotation.x = Math.PI / 2;
  exitBase.material = exitMaterial;
  const exitFrame = MeshBuilder.CreateTorus('vent-exit-frame', { diameter: 5.6, thickness: 0.16, tessellation: 48 }, scene);
  exitFrame.parent = exitRoot;
  exitFrame.position.y = 2.55;
  exitFrame.material = exitMaterial;
  const exitCrossFrame = MeshBuilder.CreateTorus('vent-exit-cross-frame', { diameter: 4.8, thickness: 0.045, tessellation: 40 }, scene);
  exitCrossFrame.parent = exitRoot;
  exitCrossFrame.position.y = 2.55;
  exitCrossFrame.rotation.y = Math.PI / 2;
  exitCrossFrame.material = exitMaterial;
  const exitCoreMaterial = new StandardMaterial('vent-exit-core-material', scene);
  exitCoreMaterial.diffuseColor = new Color3(0.16, 0.72, 0.69);
  exitCoreMaterial.emissiveColor = new Color3(0.08, 0.54, 0.55);
  exitCoreMaterial.alpha = 0.32;
  const exitCore = MeshBuilder.CreateSphere('vent-exit-core', { diameter: 3.9, segments: 18 }, scene);
  exitCore.parent = exitRoot;
  exitCore.position.y = 2.45;
  exitCore.scaling.y = 1.12;
  exitCore.material = exitCoreMaterial;
  const exitBeacon = MeshBuilder.CreateCylinder('vent-exit-beacon', { height: 7, diameter: 0.08, tessellation: 8 }, scene);
  exitBeacon.parent = exitRoot;
  exitBeacon.position.y = 3.45;
  exitBeacon.material = exitMaterial;
  const exitPillars = [
    MeshBuilder.CreateSphere('vent-exit-node-a', { diameter: 0.42, segments: 10 }, scene),
    MeshBuilder.CreateSphere('vent-exit-node-b', { diameter: 0.32, segments: 10 }, scene),
    MeshBuilder.CreateSphere('vent-exit-node-c', { diameter: 0.36, segments: 10 }, scene),
  ];
  exitPillars.forEach((node, index) => {
    node.parent = exitRoot;
    node.position.set(Math.cos(index * 2.1) * 2.3, 2.55 + Math.sin(index * 2.1) * 2.3, 0);
    node.material = exitMaterial;
  });
  exitRoot.setEnabled(false);

  const bubbleMaterial = new StandardMaterial('distant-bubble-material', scene);
  bubbleMaterial.diffuseColor = new Color3(0.39, 0.83, 0.84);
  bubbleMaterial.emissiveColor = new Color3(0.05, 0.18, 0.22);
  bubbleMaterial.specularColor = Color3.White();
  bubbleMaterial.specularPower = 96;
  bubbleMaterial.alpha = 0.27;

  const random = seededRandom(initialState.seed);
  const bubbles: Mesh[] = [];
  for (let i = 0; i < 36; i += 1) {
    const diameter = 0.09 + random() * 0.34;
    const bubble = MeshBuilder.CreateSphere(`water-bubble-${i}`, { diameter, segments: 8 }, scene);
    bubble.position.set((random() - 0.5) * 78, 0.15 + random() * 4.6, (random() - 0.5) * 78);
    bubble.material = bubbleMaterial;
    bubble.isPickable = false;
    bubbles.push(bubble);
  }

  const plantMaterial = new StandardMaterial('microflora-material', scene);
  plantMaterial.diffuseColor = new Color3(0.23, 0.85, 0.34);
  plantMaterial.emissiveColor = new Color3(0.05, 0.26, 0.075);
  plantMaterial.specularColor = new Color3(0.68, 0.94, 0.67);
  plantMaterial.specularPower = 38;
  const flora = new TransformNode('distant-microflora', scene);
  const plantPositions: Array<[number, number]> = [[-22, -14], [-27, 18], [24, 22], [28, -18], [-10, 29], [12, -30]];
  for (let index = 0; index < plantPositions.length; index += 1) {
    const [x, z] = plantPositions[index];
    const cluster = new TransformNode(`flora-cluster-${index}`, scene);
    cluster.parent = flora;
    cluster.position.set(x, 0, z);
    const size = 0.7 + random() * 0.8;
    for (let branch = 0; branch < 8; branch += 1) {
      const angle = (Math.PI * 2 * branch) / 8;
      const leaf = MeshBuilder.CreateSphere(`flora-leaf-${index}-${branch}`, { diameter: 0.42 + random() * 0.22, segments: 8 }, scene);
      leaf.parent = cluster;
      leaf.position.set(Math.cos(angle) * size * 0.55, 0.22 + random() * 0.4, Math.sin(angle) * size * 0.55);
      leaf.scaling.set(0.74, 0.56, 1.5);
      leaf.rotation.y = -angle;
      leaf.material = plantMaterial;
      leaf.isPickable = false;
    }
    const bulb = MeshBuilder.CreateSphere(`flora-heart-${index}`, { diameter: 0.62, segments: 12 }, scene);
    bulb.parent = cluster;
    bulb.position.y = 0.28;
    bulb.material = plantMaterial;
    bulb.isPickable = false;
  }

  const { root: cellRoot, parts: cellParts, organGroups } = makeCell(scene);
  cellRoot.position.y = 0;
  const entityMaterials = makeEntityMaterials(scene);
  const entityViews = new Map(initialState.entities.map((entity) => [entity.id, makeEntityView(scene, entity, entityMaterials)]));
  camera.setTarget(new Vector3(0, 0.7, 0));
  let previousCameraSeconds = 0;

  return {
    cellRoot,
    organVisible(organ: OrganId) {
      return organGroups.get(organ)?.isEnabled() ?? false;
    },
    exitVisible() {
      return exitRoot.isEnabled();
    },
    update(state: GameState, seconds: number) {
      const exitEnabled = state.finalEncounterActive;
      if (exitRoot.isEnabled() !== exitEnabled) exitRoot.setEnabled(exitEnabled);
      exitFrame.rotation.z = seconds * 0.18;
      exitCrossFrame.rotation.z = -seconds * 0.12;
      exitCore.scaling.x = 1 + Math.sin(seconds * 2.4) * 0.035;
      const activeOrgans = new Set(state.cell.organs.filter((organ): organ is OrganId => organ !== null));
      for (const [organ, group] of organGroups) {
        const enabled = activeOrgans.has(organ);
        if (group.isEnabled() !== enabled) group.setEnabled(enabled);
      }
      cellRoot.position.x = state.cell.x;
      cellRoot.position.z = state.cell.z;
      cellRoot.position.y = Math.sin(seconds * 1.7) * 0.08;
      cellRoot.rotation.y = state.cell.heading;
      // Leave breathing room for the title card while the player is in the menu.
      const menuOffset = state.phase === 'menu' ? 4.5 : 0;
      const target = new Vector3(state.cell.x - menuOffset, 0.65, state.cell.z);
      const cameraDeltaSeconds = Math.max(0, seconds - previousCameraSeconds);
      previousCameraSeconds = seconds;
      const followAmount = 1 - Math.exp(-8 * cameraDeltaSeconds);
      camera.setTarget(Vector3.Lerp(camera.target, target, followAmount));
      for (let i = 0; i < bubbles.length; i += 1) {
        bubbles[i].position.y = 0.15 + ((seconds * (0.08 + (i % 5) * 0.012) + i * 0.73) % 5.2);
      }
      for (const entity of state.entities) {
        const view = entityViews.get(entity.id);
        if (!view) continue;
        const enabled = !entity.consumed;
        if (view.root.isEnabled() !== enabled) view.root.setEnabled(enabled);
        if (!enabled) continue;
        view.root.position.x = entity.x;
        view.root.position.z = entity.z;
        view.root.position.y = view.baseY + Math.sin(seconds * 1.5 + entity.phase) * (entity.kind === 'predator' ? 0.04 : 0.11);
        view.root.rotation.y = entity.kind === 'predator' ? entity.phase : Math.sin(seconds * 0.55 + entity.phase) * 0.12;
      }
      const pulse = 1 + Math.sin(seconds * 2.4) * 0.012;
      cellParts[0].scaling.set(pulse, 1 / pulse, pulse);
    },
  };
}
