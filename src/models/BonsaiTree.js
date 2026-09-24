// BonsaiTree.js - Procedural Organic 3D Bonsai Engine with Interactive Pruning, Wiring & Jin
import * as THREE from 'three';
import { textureGen } from '../textures/TextureGenerator.js';

let branchIdCounter = 1;

export class BonsaiTree {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.species = options.species || 'pine'; // pine, maple, sakura, juniper
    this.style = options.style || 'moyogi'; // moyogi, chokkan, shakan, kengai, bunjin
    this.season = options.season || 'summer'; // spring, summer, autumn, winter
    this.age = options.age || 28; // years
    this.soilY = options.soilY || 0.75;

    this.branches = new Map(); // id -> branchData
    this.rootBranchIds = [];
    this.selectedBranchId = null;
    this.hoveredBranchId = null;

    this.raycastMeshes = []; // for raycasting click/hover
    this.meshToBranchMap = new Map();

    this.fallingParticles = []; // falling leaves/twigs when pruned

    this.generateTree();
  }

  setSoilY(y) {
    this.soilY = y;
    this.group.position.y = this.soilY;
  }

  getBarkMaterial(isJin = false) {
    if (isJin) {
      return new THREE.MeshStandardMaterial({
        map: textureGen.getDeadwoodTexture(),
        roughness: 0.85,
        metalness: 0.05,
        color: 0xeee7dc
      });
    }

    switch (this.species) {
      case 'maple':
        return new THREE.MeshStandardMaterial({
          map: textureGen.getMapleBarkTexture(),
          roughness: 0.75,
          metalness: 0.05,
          color: 0x5a524a
        });
      case 'juniper':
        return new THREE.MeshStandardMaterial({
          map: textureGen.getJuniperBarkTexture(),
          roughness: 0.82,
          metalness: 0.05,
          color: 0x543222
        });
      case 'sakura':
        return new THREE.MeshStandardMaterial({
          map: textureGen.getPineBarkTexture(),
          roughness: 0.7,
          metalness: 0.08,
          color: 0x3d2720
        });
      case 'pine':
      default:
        return new THREE.MeshStandardMaterial({
          map: textureGen.getPineBarkTexture(),
          roughness: 0.88,
          metalness: 0.05,
          color: 0x342922
        });
    }
  }

  getFoliageTexture() {
    switch (this.species) {
      case 'maple':
        return textureGen.getMapleLeafTexture(this.season === 'autumn' ? 'autumn' : 'summer');
      case 'sakura':
        return textureGen.getSakuraFlowerTexture();
      case 'juniper':
        return textureGen.getJuniperFoliageTexture();
      case 'pine':
      default:
        return textureGen.getPineFoliageTexture();
    }
  }

  getFoliageColor() {
    if (this.species === 'maple') {
      if (this.season === 'autumn') return 0xd63031; // Scarlet
      if (this.season === 'spring') return 0x88d442; // Tender yellow-green
      return 0x27ae60; // Summer lush green
    }
    if (this.species === 'sakura') {
      if (this.season === 'spring') return 0xffd1dc; // Cherry blossom pink
      if (this.season === 'summer') return 0x2ecc71; // Summer leaves
      if (this.season === 'autumn') return 0xe67e22; // Autumn bronze
      return 0xdfe6e9; // Winter dormant
    }
    if (this.species === 'juniper') {
      return 0x2d6a4f;
    }
    // Pine
    return 0x1e4620;
  }

  // Clear 3D objects
  clear() {
    while (this.group.children.length > 0) {
      const obj = this.group.children[0];
      this.group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    this.branches.clear();
    this.rootBranchIds = [];
    this.raycastMeshes = [];
    this.meshToBranchMap.clear();
    this.selectedBranchId = null;
  }

  // Generate Tree based on species & style
  generateTree() {
    this.clear();
    branchIdCounter = 1;
    this.group.position.y = this.soilY;

    // 1. Build Nebari (Root flare flaring into soil)
    this.buildNebari();

    // 2. Build Trunk & Branches according to classical style
    if (this.style === 'chokkan') {
      this.buildFormalUpright();
    } else if (this.style === 'shakan') {
      this.buildSlanting();
    } else if (this.style === 'kengai') {
      this.buildCascade();
    } else if (this.style === 'bunjin') {
      this.buildLiterati();
    } else {
      this.buildInformalUpright(); // Moyogi (default)
    }

    // 3. Render all branch meshes & foliage
    this.renderAllBranches();
  }

  // Nebari: powerful surface roots radiating outward into soil
  buildNebari() {
    const rootCount = 6;
    const nebariGroup = new THREE.Group();
    const barkMat = this.getBarkMaterial(false);

    for (let i = 0; i < rootCount; i++) {
      const angle = (i / rootCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const length = 0.8 + Math.random() * 0.5;
      const start = new THREE.Vector3(Math.cos(angle) * 0.25, 0.15, Math.sin(angle) * 0.25);
      const mid = new THREE.Vector3(Math.cos(angle) * 0.55, 0.05, Math.sin(angle) * 0.55);
      const end = new THREE.Vector3(Math.cos(angle) * length, -0.05, Math.sin(angle) * length);

      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const rootGeo = new THREE.TubeGeometry(curve, 12, 0.14, 8, false);
      const rootMesh = new THREE.Mesh(rootGeo, barkMat);
      rootMesh.castShadow = true;
      rootMesh.receiveShadow = true;
      nebariGroup.add(rootMesh);
    }
    this.group.add(nebariGroup);
  }

  // Moyogi (Informal Upright) - classic graceful S-curve trunk with cloud pads
  buildInformalUpright() {
    // Trunk curve points
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0.35, 1.1, 0.1);
    const p2 = new THREE.Vector3(-0.3, 2.2, -0.15);
    const p3 = new THREE.Vector3(0.2, 3.2, 0.1);
    const p4 = new THREE.Vector3(-0.05, 4.2, 0.0); // Apex crown

    const trunkId = this.addBranch({
      name: 'Основной ствол (Мики / 幹)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.36,
      radiusEnd: 0.12,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    // 1. First Main Branch: Sashi-eda (Саси-эда / 刺枝) - sweeping low branch to the right
    const b1_start = p1.clone().add(new THREE.Vector3(0.05, -0.05, 0));
    const b1_mid = b1_start.clone().add(new THREE.Vector3(1.1, -0.15, 0.2));
    const b1_end = b1_mid.clone().add(new THREE.Vector3(0.9, -0.1, -0.1));
    const b1 = this.addBranch({
      name: 'Основная нижняя ветвь (Саси-эда / 刺枝)',
      level: 1,
      points: [b1_start, b1_mid, b1_end],
      radiusStart: 0.16,
      radiusEnd: 0.06,
      parentId: trunkId,
      hasFoliage: true
    });

    // Sub-twigs on b1
    this.addBranch({
      name: 'Вторичная веточка Саси-эда',
      level: 2,
      points: [b1_mid.clone(), b1_mid.clone().add(new THREE.Vector3(0.5, 0.05, 0.4))],
      radiusStart: 0.05,
      radiusEnd: 0.025,
      parentId: b1,
      hasFoliage: true
    });

    // 2. Second Balancing Branch: Uke-eda (Укэ-эда / 受枝) - counter-balancing left branch
    const b2_start = p2.clone().add(new THREE.Vector3(-0.05, -0.05, 0));
    const b2_mid = b2_start.clone().add(new THREE.Vector3(-1.0, -0.1, 0.1));
    const b2_end = b2_mid.clone().add(new THREE.Vector3(-0.7, -0.05, -0.2));
    const b2 = this.addBranch({
      name: 'Балансирующая ветвь (Укэ-эда / 受枝)',
      level: 1,
      points: [b2_start, b2_mid, b2_end],
      radiusStart: 0.13,
      radiusEnd: 0.05,
      parentId: trunkId,
      hasFoliage: true
    });

    this.addBranch({
      name: 'Вторичная веточка Укэ-эда',
      level: 2,
      points: [b2_mid.clone(), b2_mid.clone().add(new THREE.Vector3(-0.45, 0.08, -0.35))],
      radiusStart: 0.045,
      radiusEnd: 0.02,
      parentId: b2,
      hasFoliage: true
    });

    // 3. Third Depth Branch: Ushiro-eda (Усиро-эда / 後枝) - back branch providing 3D depth
    const b3_start = p2.clone().add(new THREE.Vector3(0, 0.4, 0));
    const b3_mid = b3_start.clone().add(new THREE.Vector3(0.1, 0.15, -1.0));
    const b3_end = b3_mid.clone().add(new THREE.Vector3(0.3, 0.1, -0.6));
    this.addBranch({
      name: 'Задняя глубинная ветвь (Усиро-эда / 後枝)',
      level: 1,
      points: [b3_start, b3_mid, b3_end],
      radiusStart: 0.11,
      radiusEnd: 0.045,
      parentId: trunkId,
      hasFoliage: true
    });

    // 4. Fourth Upper Branch: Mae-eda (Маэ-эда / 前枝) - angled forward to give dimension
    const b4_start = p3.clone().add(new THREE.Vector3(0, -0.1, 0));
    const b4_mid = b4_start.clone().add(new THREE.Vector3(0.7, 0.12, 0.3));
    const b4_end = b4_mid.clone().add(new THREE.Vector3(0.5, 0.08, 0.1));
    this.addBranch({
      name: 'Верхняя фронтальная ветвь (Маэ-эда / 前枝)',
      level: 1,
      points: [b4_start, b4_mid, b4_end],
      radiusStart: 0.09,
      radiusEnd: 0.04,
      parentId: trunkId,
      hasFoliage: true
    });

    // 5. Apex Crown: Shin (Син / 芯) - top dome
    const apex_start = p4.clone();
    const apex_mid = apex_start.clone().add(new THREE.Vector3(-0.1, 0.45, 0.1));
    const apex_end = apex_mid.clone().add(new THREE.Vector3(0.05, 0.35, -0.05));
    const apex = this.addBranch({
      name: 'Верхушечная крона (Апекс / 芯)',
      level: 1,
      points: [apex_start, apex_mid, apex_end],
      radiusStart: 0.08,
      radiusEnd: 0.03,
      parentId: trunkId,
      hasFoliage: true
    });

    // Apex side pads
    this.addBranch({
      name: 'Боковая подушка кроны (Левая)',
      level: 2,
      points: [apex_mid.clone(), apex_mid.clone().add(new THREE.Vector3(-0.45, 0.1, 0.15))],
      radiusStart: 0.04,
      radiusEnd: 0.02,
      parentId: apex,
      hasFoliage: true
    });
    this.addBranch({
      name: 'Боковая подушка кроны (Правая)',
      level: 2,
      points: [apex_mid.clone(), apex_mid.clone().add(new THREE.Vector3(0.45, 0.12, -0.1))],
      radiusStart: 0.04,
      radiusEnd: 0.02,
      parentId: apex,
      hasFoliage: true
    });
  }

  // Chokkan (Formal Upright) - stately, straight tapered trunk
  buildFormalUpright() {
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0, 1.4, 0);
    const p2 = new THREE.Vector3(0, 2.6, 0);
    const p3 = new THREE.Vector3(0, 3.7, 0);
    const p4 = new THREE.Vector3(0, 4.6, 0);

    const trunkId = this.addBranch({
      name: 'Прямой ствол Тёккан (直幹)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.38,
      radiusEnd: 0.08,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    // Symmetric tiered horizontal branches
    const tiers = [
      { y: 1.3, xDir: 1.4, zDir: 0.3, name: 'Нижний правый ярус' },
      { y: 1.9, xDir: -1.2, zDir: -0.2, name: 'Средний левый ярус' },
      { y: 2.5, xDir: 0.2, zDir: -1.2, name: 'Задний глубинный ярус' },
      { y: 3.1, xDir: 0.9, zDir: 0.2, name: 'Верхний правый ярус' },
      { y: 3.6, xDir: -0.8, zDir: 0.2, name: 'Верхний левый ярус' },
      { y: 4.1, xDir: 0.0, zDir: 0.0, name: 'Верхушечная шапка' }
    ];

    tiers.forEach((tier, i) => {
      const start = new THREE.Vector3(0, tier.y, 0);
      const mid = new THREE.Vector3(tier.xDir * 0.6, tier.y - 0.08, tier.zDir * 0.6);
      const end = new THREE.Vector3(tier.xDir, tier.y - 0.15, tier.zDir);
      this.addBranch({
        name: tier.name,
        level: 1,
        points: [start, mid, end],
        radiusStart: 0.12 - i * 0.015,
        radiusEnd: 0.035,
        parentId: trunkId,
        hasFoliage: true
      });
    });
  }

  // Shakan (Slanting) - windswept trunk tilted dynamically
  buildSlanting() {
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0.6, 1.0, 0.1);
    const p2 = new THREE.Vector3(1.3, 2.0, 0.15);
    const p3 = new THREE.Vector3(1.9, 2.9, 0.1);
    const p4 = new THREE.Vector3(2.3, 3.6, 0.0);

    const trunkId = this.addBranch({
      name: 'Наклонный ствол Сякан (斜幹)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.35,
      radiusEnd: 0.1,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    // Counter balance branch stretching backwards against the lean
    const bCounter = this.addBranch({
      name: 'Противовесная ветвь (Укэ-эда)',
      level: 1,
      points: [
        p1.clone(),
        p1.clone().add(new THREE.Vector3(-0.9, 0.1, -0.2)),
        p1.clone().add(new THREE.Vector3(-1.6, -0.1, -0.3))
      ],
      radiusStart: 0.15,
      radiusEnd: 0.05,
      parentId: trunkId,
      hasFoliage: true
    });

    // Forward wind branches
    this.addBranch({
      name: 'Основная наветренная ветвь',
      level: 1,
      points: [
        p2.clone(),
        p2.clone().add(new THREE.Vector3(0.9, -0.15, 0.3)),
        p2.clone().add(new THREE.Vector3(1.7, -0.25, 0.4))
      ],
      radiusStart: 0.12,
      radiusEnd: 0.045,
      parentId: trunkId,
      hasFoliage: true
    });

    // Crown
    this.addBranch({
      name: 'Крона по ветру',
      level: 1,
      points: [
        p4.clone(),
        p4.clone().add(new THREE.Vector3(0.3, 0.35, 0)),
        p4.clone().add(new THREE.Vector3(0.6, 0.5, 0))
      ],
      radiusStart: 0.08,
      radiusEnd: 0.03,
      parentId: trunkId,
      hasFoliage: true
    });
  }

  // Kengai (Cascade) - trunk dramatically sweeps over pot lip downwards
  buildCascade() {
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0.3, 0.5, 0.1);
    const p2 = new THREE.Vector3(0.8, 0.3, 0.2); // Bend over edge
    const p3 = new THREE.Vector3(1.2, -0.6, 0.3); // Plunge down
    const p4 = new THREE.Vector3(1.4, -1.6, 0.2); // Cascade bottom

    const trunkId = this.addBranch({
      name: 'Каскадный ствол Кенгай (懸崖)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.34,
      radiusEnd: 0.09,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    // Top crown on pot surface
    this.addBranch({
      name: 'Верхняя шапка над горшком',
      level: 1,
      points: [
        p1.clone(),
        p1.clone().add(new THREE.Vector3(-0.3, 0.4, -0.2)),
        p1.clone().add(new THREE.Vector3(-0.5, 0.65, -0.1))
      ],
      radiusStart: 0.11,
      radiusEnd: 0.04,
      parentId: trunkId,
      hasFoliage: true
    });

    // Mid cascade tier
    this.addBranch({
      name: 'Средний ярус каскада',
      level: 1,
      points: [
        p3.clone(),
        p3.clone().add(new THREE.Vector3(0.5, 0.05, 0.3)),
        p3.clone().add(new THREE.Vector3(0.9, -0.1, 0.4))
      ],
      radiusStart: 0.08,
      radiusEnd: 0.03,
      parentId: trunkId,
      hasFoliage: true
    });

    // Lowest cascade tail
    this.addBranch({
      name: 'Нижний шлейф каскада',
      level: 1,
      points: [
        p4.clone(),
        p4.clone().add(new THREE.Vector3(0.3, -0.2, 0.1)),
        p4.clone().add(new THREE.Vector3(0.6, -0.4, 0.0))
      ],
      radiusStart: 0.06,
      radiusEnd: 0.025,
      parentId: trunkId,
      hasFoliage: true
    });
  }

  // Bunjin-gi (Literati / Scholar) - slender, minimalist, poetic
  buildLiterati() {
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0.2, 1.2, 0.1);
    const p2 = new THREE.Vector3(-0.25, 2.5, -0.15);
    const p3 = new THREE.Vector3(0.15, 3.6, 0.2);
    const p4 = new THREE.Vector3(-0.1, 4.6, 0.05);

    const trunkId = this.addBranch({
      name: 'Поэтичный ствол Бундзин (文人木)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.22,
      radiusEnd: 0.06,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    // Only high branches, bare lower trunk
    this.addBranch({
      name: 'Свисающая верхняя ветвь',
      level: 1,
      points: [
        p3.clone(),
        p3.clone().add(new THREE.Vector3(0.7, -0.2, 0.2)),
        p3.clone().add(new THREE.Vector3(1.2, -0.5, 0.1))
      ],
      radiusStart: 0.06,
      radiusEnd: 0.025,
      parentId: trunkId,
      hasFoliage: true
    });

    this.addBranch({
      name: 'Лаконичный апекс Бундзин',
      level: 1,
      points: [
        p4.clone(),
        p4.clone().add(new THREE.Vector3(-0.4, 0.3, -0.1)),
        p4.clone().add(new THREE.Vector3(-0.7, 0.2, -0.1))
      ],
      radiusStart: 0.05,
      radiusEnd: 0.02,
      parentId: trunkId,
      hasFoliage: true
    });
  }

  // Branch data constructor
  addBranch(config) {
    const id = branchIdCounter++;
    const branch = {
      id,
      name: config.name || `Ветвь #${id}`,
      level: config.level || 1,
      points: config.points.map(p => p.clone()),
      originalPoints: config.points.map(p => p.clone()),
      radiusStart: config.radiusStart || 0.1,
      radiusEnd: config.radiusEnd || 0.03,
      parentId: config.parentId || null,
      childrenIds: [],
      hasFoliage: !!config.hasFoliage,
      isJin: !!config.isJin,
      isWired: false,
      wireAngle: { x: 0, y: 0, z: 0 },
      // Rendered Three.js objects
      mesh: null,
      wireMesh: null,
      foliageGroup: null
    };

    if (branch.parentId && this.branches.has(branch.parentId)) {
      this.branches.get(branch.parentId).childrenIds.push(id);
    }

    this.branches.set(id, branch);
    return id;
  }

  // Render 3D geometry for all branches
  renderAllBranches() {
    this.branches.forEach(branch => {
      this.renderBranch(branch);
    });
  }

  // Render a single branch tube and foliage
  renderBranch(branch) {
    // Remove existing
    if (branch.mesh) {
      this.group.remove(branch.mesh);
      this.raycastMeshes = this.raycastMeshes.filter(m => m !== branch.mesh);
      this.meshToBranchMap.delete(branch.mesh);
      if (branch.mesh.geometry) branch.mesh.geometry.dispose();
    }
    if (branch.wireMesh) {
      this.group.remove(branch.wireMesh);
      if (branch.wireMesh.geometry) branch.wireMesh.geometry.dispose();
    }
    if (branch.foliageGroup) {
      this.group.remove(branch.foliageGroup);
    }

    // Create spline curve through points
    const curve = new THREE.CatmullRomCurve3(branch.points);
    const tubularSegments = Math.max(8, branch.points.length * 8);

    // Tapered tube geometry
    const tubeGeo = new THREE.TubeGeometry(
      curve,
      tubularSegments,
      branch.radiusStart,
      10,
      false
    );

    // Apply manual taper to radius along the tube
    const pos = tubeGeo.attributes.position;
    const radialSegs = 10;
    const numRings = tubularSegments + 1;

    for (let ring = 0; ring < numRings; ring++) {
      const t = ring / tubularSegments;
      const centerPt = curve.getPoint(t);
      const targetRadius = branch.radiusStart * (1 - t) + branch.radiusEnd * t;
      const factor = targetRadius / branch.radiusStart;

      for (let s = 0; s < radialSegs; s++) {
        const idx = ring * radialSegs + s;
        if (idx < pos.count) {
          const vx = pos.getX(idx);
          const vy = pos.getY(idx);
          const vz = pos.getZ(idx);

          pos.setXYZ(
            idx,
            centerPt.x + (vx - centerPt.x) * factor,
            centerPt.y + (vy - centerPt.y) * factor,
            centerPt.z + (vz - centerPt.z) * factor
          );
        }
      }
    }
    tubeGeo.computeVertexNormals();

    const barkMat = this.getBarkMaterial(branch.isJin);
    const branchMesh = new THREE.Mesh(tubeGeo, barkMat);
    branchMesh.castShadow = true;
    branchMesh.receiveShadow = true;

    // Attach data for interaction
    branchMesh.userData = { branchId: branch.id };
    this.group.add(branchMesh);
    branch.mesh = branchMesh;

    this.raycastMeshes.push(branchMesh);
    this.meshToBranchMap.set(branchMesh, branch.id);

    // Render Copper Wire if wired
    if (branch.isWired) {
      this.renderBranchWire(branch, curve);
    }

    // Render Foliage Pad if applicable and not deadwood Jin
    if (branch.hasFoliage && !branch.isJin) {
      this.renderFoliagePad(branch);
    }
  }

  // Render realistic coiled copper wire wrapped around branch
  renderBranchWire(branch, curve) {
    const turns = 10;
    const wirePoints = [];
    const len = curve.getLength();

    for (let i = 0; i < turns * 16; i++) {
      const t = i / (turns * 16);
      const pt = curve.getPoint(t);
      const tangent = curve.getTangent(t);
      const radius = (branch.radiusStart * (1 - t) + branch.radiusEnd * t) * 1.12;

      // Normal and binormal for radial spiral offset
      const norm = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
      const binorm = new THREE.Vector3().crossVectors(tangent, norm).normalize();

      const angle = t * turns * Math.PI * 2;
      const ox = (norm.x * Math.cos(angle) + binorm.x * Math.sin(angle)) * radius;
      const oy = (norm.y * Math.cos(angle) + binorm.y * Math.sin(angle)) * radius;
      const oz = (norm.z * Math.cos(angle) + binorm.z * Math.sin(angle)) * radius;

      wirePoints.push(new THREE.Vector3(pt.x + ox, pt.y + oy, pt.z + oz));
    }

    const wireCurve = new THREE.CatmullRomCurve3(wirePoints);
    const wireGeo = new THREE.TubeGeometry(wireCurve, turns * 12, 0.016, 6, false);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xb87333, // Rich burnished copper
      metalness: 0.85,
      roughness: 0.3
    });

    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.castShadow = true;
    this.group.add(wireMesh);
    branch.wireMesh = wireMesh;
  }

  // Render cloud foliage pad (Тана)
  renderFoliagePad(branch) {
    const foliageGroup = new THREE.Group();
    const tip = branch.points[branch.points.length - 1];
    const tex = this.getFoliageTexture();
    const folColor = this.getFoliageColor();

    const folMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: folColor,
      transparent: true,
      alphaTest: 0.18,
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Cloud-like cluster of foliage sprites/planes
    const padPlanesCount = 18;
    const padRadius = 0.55 + (branch.level === 1 ? 0.2 : 0.05);

    for (let i = 0; i < padPlanesCount; i++) {
      const planeGeo = new THREE.PlaneGeometry(0.55, 0.55);
      const mesh = new THREE.Mesh(planeGeo, folMat);

      // Distribute in a slightly flattened elliptical dome
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * padRadius;
      const px = tip.x + Math.cos(angle) * r;
      const py = tip.y + (Math.random() - 0.3) * 0.25;
      const pz = tip.z + Math.sin(angle) * (r * 0.85);

      mesh.position.set(px, py, pz);
      // Horizontal fan with slight random tilt
      mesh.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.45;
      mesh.rotation.y = (Math.random() - 0.5) * 0.4;
      mesh.rotation.z = Math.random() * Math.PI * 2;

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      foliageGroup.add(mesh);
    }

    this.group.add(foliageGroup);
    branch.foliageGroup = foliageGroup;
  }

  // PRUNE TOOL: Snip a branch and its sub-branches
  pruneBranch(branchId) {
    const branch = this.branches.get(branchId);
    if (!branch) return false;
    if (branch.level === 0) {
      // Do not allow pruning main trunk root
      return false;
    }

    // Spawn falling leaf/twig physics particles
    this.spawnFallingParticles(branch);

    // Recursively collect and delete children
    const toDelete = [branchId];
    const collectChildren = (id) => {
      const b = this.branches.get(id);
      if (b && b.childrenIds) {
        b.childrenIds.forEach(cid => {
          toDelete.push(cid);
          collectChildren(cid);
        });
      }
    };
    collectChildren(branchId);

    // Remove from parent
    if (branch.parentId && this.branches.has(branch.parentId)) {
      const parent = this.branches.get(branch.parentId);
      parent.childrenIds = parent.childrenIds.filter(id => id !== branchId);

      // Stimulate back-budding on parent (bonus ramification)
      this.stimulateBackBudding(parent);
    }

    // Clean up meshes
    toDelete.forEach(id => {
      const b = this.branches.get(id);
      if (b) {
        if (b.mesh) {
          this.group.remove(b.mesh);
          this.raycastMeshes = this.raycastMeshes.filter(m => m !== b.mesh);
          this.meshToBranchMap.delete(b.mesh);
        }
        if (b.wireMesh) this.group.remove(b.wireMesh);
        if (b.foliageGroup) this.group.remove(b.foliageGroup);
        this.branches.delete(id);
      }
    });

    if (this.selectedBranchId === branchId) {
      this.selectedBranchId = null;
    }

    return true;
  }

  // Back-budding: Pruning stimulates new fresh shoots on parent
  stimulateBackBudding(parentBranch) {
    if (parentBranch.childrenIds.length < 3 && parentBranch.level < 2) {
      const midIdx = Math.floor(parentBranch.points.length / 2);
      const startPt = parentBranch.points[midIdx].clone();
      const endPt = startPt.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        0.2 + Math.random() * 0.2,
        (Math.random() - 0.5) * 0.6
      ));

      this.addBranch({
        name: `Свежий побег (Пробудившаяся почка)`,
        level: parentBranch.level + 1,
        points: [startPt, endPt],
        radiusStart: 0.04,
        radiusEnd: 0.018,
        parentId: parentBranch.id,
        hasFoliage: true
      });
      this.renderAllBranches();
    }
  }

  // WIRING TOOL: Toggle or bend a branch
  wireBranch(branchId, bendDeltaY = 0, bendDeltaPitch = 0) {
    const branch = this.branches.get(branchId);
    if (!branch) return false;

    branch.isWired = true;
    branch.wireAngle.y += bendDeltaY;
    branch.wireAngle.x += bendDeltaPitch;

    // Apply curve deformation based on original points
    const origin = branch.originalPoints[0];
    for (let i = 1; i < branch.points.length; i++) {
      const orig = branch.originalPoints[i];
      const rel = orig.clone().sub(origin);
      const progress = i / (branch.points.length - 1);

      // Rotate around origin
      rel.applyAxisAngle(new THREE.Vector3(0, 1, 0), branch.wireAngle.y * progress);
      rel.applyAxisAngle(new THREE.Vector3(1, 0, 0), branch.wireAngle.x * progress);

      // Add gentle downward droop to simulate classical bonsai pad styling
      rel.y -= progress * 0.15;

      branch.points[i].copy(origin.clone().add(rel));
    }

    // Re-render this branch and its descendants
    this.renderBranch(branch);
    branch.childrenIds.forEach(cid => {
      const child = this.branches.get(cid);
      if (child) {
        // Child base connects to parent tip/mid
        this.renderBranch(child);
      }
    });

    return true;
  }

  removeWire(branchId) {
    const branch = this.branches.get(branchId);
    if (!branch || !branch.isWired) return false;
    branch.isWired = false;
    if (branch.wireMesh) {
      this.group.remove(branch.wireMesh);
      branch.wireMesh = null;
    }
    return true;
  }

  // CARVE JIN / SHARI TOOL: Create deadwood
  carveJin(branchId) {
    const branch = this.branches.get(branchId);
    if (!branch) return false;

    branch.isJin = !branch.isJin;
    // If Jin, remove foliage pads
    if (branch.isJin && branch.foliageGroup) {
      this.group.remove(branch.foliageGroup);
      branch.foliageGroup = null;
    }

    this.renderBranch(branch);
    return branch.isJin;
  }

  // Physics animation for snipped falling particles
  spawnFallingParticles(branch) {
    const tip = branch.points[branch.points.length - 1];
    const folTex = this.getFoliageTexture();
    const folColor = this.getFoliageColor();

    for (let i = 0; i < 12; i++) {
      const pGeo = new THREE.PlaneGeometry(0.18, 0.18);
      const pMat = new THREE.MeshBasicMaterial({
        map: folTex,
        color: folColor,
        transparent: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.position.set(
        tip.x + (Math.random() - 0.5) * 0.3,
        tip.y + (Math.random() - 0.5) * 0.2,
        tip.z + (Math.random() - 0.5) * 0.3
      );
      this.group.add(mesh);

      this.fallingParticles.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.04,
          -0.02 - Math.random() * 0.04,
          (Math.random() - 0.5) * 0.04
        ),
        rotVel: new THREE.Vector3(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1),
        life: 1.0
      });
    }
  }

  update(delta) {
    // Update falling pruned particles
    for (let i = this.fallingParticles.length - 1; i >= 0; i--) {
      const p = this.fallingParticles[i];
      p.mesh.position.add(p.vel);
      p.mesh.rotation.x += p.rotVel.x;
      p.mesh.rotation.y += p.rotVel.y;
      p.vel.y -= 0.002; // Gravity
      p.life -= delta * 0.8;

      if (p.life <= 0 || p.mesh.position.y < -0.2) {
        this.group.remove(p.mesh);
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        this.fallingParticles.splice(i, 1);
      }
    }
  }

  // Calculate Wabi-Sabi Harmony Score (Оценка эстетической гармонии)
  calculateHarmony() {
    let score = 70; // Base score

    const branchCount = this.branches.size;
    // Ideal branch count: 8 to 16
    if (branchCount >= 8 && branchCount <= 16) {
      score += 12;
    } else if (branchCount < 5) {
      score -= 15; // Too bare
    } else if (branchCount > 22) {
      score -= 12; // Overcrowded
    }

    // Check for Ma (Negative space between pads)
    const wiredCount = Array.from(this.branches.values()).filter(b => b.isWired).length;
    score += Math.min(10, wiredCount * 3);

    // Jin accent points
    const jinCount = Array.from(this.branches.values()).filter(b => b.isJin).length;
    if (jinCount >= 1 && jinCount <= 2) {
      score += 8; // Classical accent
    }

    return Math.max(20, Math.min(99, score));
  }

  // Change Species
  setSpecies(species) {
    if (this.species === species) return;
    this.species = species;
    this.generateTree();
  }

  // Change Style
  setStyle(style) {
    if (this.style === style) return;
    this.style = style;
    this.generateTree();
  }

  // Change Season
  setSeason(season) {
    if (this.season === season) return;
    this.season = season;
    this.renderAllBranches();
  }
}
