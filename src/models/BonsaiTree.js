// BonsaiTree.js - AAA Procedural Bonsai with Organic Gnarls, PBR Materials & Wind Sway
import * as THREE from 'three';
import { textureGen } from '../textures/TextureGenerator.js';

let branchIdCounter = 1;

export class BonsaiTree {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.species = options.species || 'pine';
    this.style = options.style || 'moyogi';
    this.season = options.season || 'summer';
    this.age = options.age || 28;
    this.soilY = options.soilY || 0.75;

    this.branches = new Map();
    this.rootBranchIds = [];
    this.selectedBranchId = null;
    this.hoveredBranchId = null;

    this.raycastMeshes = [];
    this.meshToBranchMap = new Map();
    this.foliageMeshes = []; // for wind sway animation

    this.fallingParticles = [];

    // Cut indicator ring for pruning preview
    this.cutRing = this.createCutIndicator();
    this.group.add(this.cutRing);

    this.generateTree();
  }

  createCutIndicator() {
    const ringGeo = new THREE.TorusGeometry(0.2, 0.02, 12, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.9
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.visible = false;
    return ring;
  }

  setSoilY(y) {
    this.soilY = y;
    this.group.position.y = this.soilY;
  }

  getBarkMaterial(isJin = false) {
    if (isJin) {
      const pbr = textureGen.getDeadwoodPBR();
      return new THREE.MeshStandardMaterial({
        map: pbr.map,
        normalMap: pbr.normalMap,
        normalScale: new THREE.Vector2(1.5, 1.5),
        roughness: 0.82,
        metalness: 0.04,
        color: 0xeee7dc
      });
    }

    const pbr = textureGen.getPineBarkPBR();

    if (this.species === 'maple') {
      return new THREE.MeshStandardMaterial({
        map: pbr.map,
        normalMap: pbr.normalMap,
        normalScale: new THREE.Vector2(0.8, 0.8),
        roughness: 0.72,
        metalness: 0.04,
        color: 0x5e544c
      });
    }
    if (this.species === 'juniper') {
      return new THREE.MeshStandardMaterial({
        map: pbr.map,
        normalMap: pbr.normalMap,
        normalScale: new THREE.Vector2(1.8, 1.8),
        roughness: 0.85,
        metalness: 0.05,
        color: 0x503020
      });
    }
    if (this.species === 'sakura') {
      return new THREE.MeshStandardMaterial({
        map: pbr.map,
        normalMap: pbr.normalMap,
        normalScale: new THREE.Vector2(1.2, 1.2),
        roughness: 0.68,
        metalness: 0.06,
        color: 0x3d251d
      });
    }

    // Japanese Black Pine (Куромацу)
    return new THREE.MeshStandardMaterial({
      map: pbr.map,
      normalMap: pbr.normalMap,
      normalScale: new THREE.Vector2(2.2, 2.2),
      roughnessMap: pbr.roughnessMap,
      roughness: 0.88,
      metalness: 0.04,
      color: 0x362c24
    });
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
      if (this.season === 'autumn') return 0xd63031;
      if (this.season === 'spring') return 0x9be04e;
      return 0x27ae60;
    }
    if (this.species === 'sakura') {
      if (this.season === 'spring') return 0xffd1dc;
      if (this.season === 'summer') return 0x2ecc71;
      if (this.season === 'autumn') return 0xe67e22;
      return 0xdfe6e9;
    }
    if (this.species === 'juniper') {
      return 0x2d6a4f;
    }
    return 0x1f4e24; // Deep Japanese Pine Green
  }

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
    this.foliageMeshes = [];
    this.selectedBranchId = null;

    this.cutRing = this.createCutIndicator();
    this.group.add(this.cutRing);
  }

  generateTree() {
    this.clear();
    branchIdCounter = 1;
    this.group.position.y = this.soilY;

    // 1. Organic Root Flare (Небари)
    this.buildNebari();

    // 2. Trunk & Branch Architecture
    if (this.style === 'chokkan') {
      this.buildFormalUpright();
    } else if (this.style === 'shakan') {
      this.buildSlanting();
    } else if (this.style === 'kengai') {
      this.buildCascade();
    } else if (this.style === 'bunjin') {
      this.buildLiterati();
    } else {
      this.buildInformalUpright();
    }

    // 3. Render all geometry
    this.renderAllBranches();
  }

  // Nebari: Buttress surface roots gripping soil
  buildNebari() {
    const rootCount = 7;
    const nebariGroup = new THREE.Group();
    const barkMat = this.getBarkMaterial(false);

    for (let i = 0; i < rootCount; i++) {
      const angle = (i / rootCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
      const length = 0.9 + Math.random() * 0.55;

      const p0 = new THREE.Vector3(Math.cos(angle) * 0.28, 0.2, Math.sin(angle) * 0.28);
      const p1 = new THREE.Vector3(Math.cos(angle) * 0.6, 0.08, Math.sin(angle) * 0.6);
      const p2 = new THREE.Vector3(Math.cos(angle) * length, -0.04, Math.sin(angle) * length);

      const curve = new THREE.CatmullRomCurve3([p0, p1, p2]);
      const rootGeo = new THREE.TubeGeometry(curve, 16, 0.16, 10, false);

      // Deform root geometry for rugged gnarls
      const pos = rootGeo.attributes.position;
      for (let v = 0; v < pos.count; v++) {
        const vx = pos.getX(v);
        const vy = pos.getY(v);
        const vz = pos.getZ(v);
        const gnarl = 1.0 + Math.sin(vx * 15 + vy * 12) * 0.08;
        pos.setXYZ(v, vx * gnarl, vy * gnarl, vz * gnarl);
      }
      rootGeo.computeVertexNormals();

      const rootMesh = new THREE.Mesh(rootGeo, barkMat);
      rootMesh.castShadow = true;
      rootMesh.receiveShadow = true;
      nebariGroup.add(rootMesh);
    }

    this.group.add(nebariGroup);
  }

  // Moyogi (Informal Upright)
  buildInformalUpright() {
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0.38, 1.15, 0.12);
    const p2 = new THREE.Vector3(-0.32, 2.25, -0.16);
    const p3 = new THREE.Vector3(0.22, 3.25, 0.1);
    const p4 = new THREE.Vector3(-0.06, 4.3, 0.0);

    const trunkId = this.addBranch({
      name: 'Основной ствол (Мики / 幹)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.42,
      radiusEnd: 0.13,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    // 1. Sashi-eda (Main lowest branch)
    const b1_start = p1.clone().add(new THREE.Vector3(0.06, -0.05, 0));
    const b1_mid = b1_start.clone().add(new THREE.Vector3(1.15, -0.16, 0.22));
    const b1_end = b1_mid.clone().add(new THREE.Vector3(0.95, -0.12, -0.12));
    const b1 = this.addBranch({
      name: 'Основная нижняя ветвь (Саси-эда / 刺枝)',
      level: 1,
      points: [b1_start, b1_mid, b1_end],
      radiusStart: 0.18,
      radiusEnd: 0.065,
      parentId: trunkId,
      hasFoliage: true
    });

    this.addBranch({
      name: 'Вторичная веточка Саси-эда',
      level: 2,
      points: [b1_mid.clone(), b1_mid.clone().add(new THREE.Vector3(0.55, 0.06, 0.42))],
      radiusStart: 0.055,
      radiusEnd: 0.026,
      parentId: b1,
      hasFoliage: true
    });

    // 2. Uke-eda (Balancing branch)
    const b2_start = p2.clone().add(new THREE.Vector3(-0.06, -0.05, 0));
    const b2_mid = b2_start.clone().add(new THREE.Vector3(-1.05, -0.12, 0.12));
    const b2_end = b2_mid.clone().add(new THREE.Vector3(-0.75, -0.06, -0.22));
    const b2 = this.addBranch({
      name: 'Балансирующая ветвь (Укэ-эда / 受枝)',
      level: 1,
      points: [b2_start, b2_mid, b2_end],
      radiusStart: 0.14,
      radiusEnd: 0.055,
      parentId: trunkId,
      hasFoliage: true
    });

    this.addBranch({
      name: 'Вторичная веточка Укэ-эда',
      level: 2,
      points: [b2_mid.clone(), b2_mid.clone().add(new THREE.Vector3(-0.5, 0.08, -0.38))],
      radiusStart: 0.048,
      radiusEnd: 0.022,
      parentId: b2,
      hasFoliage: true
    });

    // 3. Ushiro-eda (Back depth branch)
    const b3_start = p2.clone().add(new THREE.Vector3(0, 0.42, 0));
    const b3_mid = b3_start.clone().add(new THREE.Vector3(0.12, 0.16, -1.05));
    const b3_end = b3_mid.clone().add(new THREE.Vector3(0.32, 0.12, -0.65));
    this.addBranch({
      name: 'Задняя глубинная ветвь (Усиро-эда / 後枝)',
      level: 1,
      points: [b3_start, b3_mid, b3_end],
      radiusStart: 0.12,
      radiusEnd: 0.048,
      parentId: trunkId,
      hasFoliage: true
    });

    // 4. Mae-eda (Front branch)
    const b4_start = p3.clone().add(new THREE.Vector3(0, -0.1, 0));
    const b4_mid = b4_start.clone().add(new THREE.Vector3(0.75, 0.14, 0.35));
    const b4_end = b4_mid.clone().add(new THREE.Vector3(0.55, 0.08, 0.12));
    this.addBranch({
      name: 'Верхняя фронтальная ветвь (Маэ-эда / 前枝)',
      level: 1,
      points: [b4_start, b4_mid, b4_end],
      radiusStart: 0.1,
      radiusEnd: 0.042,
      parentId: trunkId,
      hasFoliage: true
    });

    // 5. Apex Crown (Син)
    const apex_start = p4.clone();
    const apex_mid = apex_start.clone().add(new THREE.Vector3(-0.12, 0.48, 0.12));
    const apex_end = apex_mid.clone().add(new THREE.Vector3(0.06, 0.38, -0.06));
    const apex = this.addBranch({
      name: 'Верхушечная крона (Апекс / 芯)',
      level: 1,
      points: [apex_start, apex_mid, apex_end],
      radiusStart: 0.085,
      radiusEnd: 0.032,
      parentId: trunkId,
      hasFoliage: true
    });

    this.addBranch({
      name: 'Боковая подушка кроны (Левая)',
      level: 2,
      points: [apex_mid.clone(), apex_mid.clone().add(new THREE.Vector3(-0.48, 0.12, 0.16))],
      radiusStart: 0.042,
      radiusEnd: 0.02,
      parentId: apex,
      hasFoliage: true
    });
    this.addBranch({
      name: 'Боковая подушка кроны (Правая)',
      level: 2,
      points: [apex_mid.clone(), apex_mid.clone().add(new THREE.Vector3(0.48, 0.14, -0.12))],
      radiusStart: 0.042,
      radiusEnd: 0.02,
      parentId: apex,
      hasFoliage: true
    });
  }

  // Chokkan (Formal Upright)
  buildFormalUpright() {
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0, 1.45, 0);
    const p2 = new THREE.Vector3(0, 2.7, 0);
    const p3 = new THREE.Vector3(0, 3.8, 0);
    const p4 = new THREE.Vector3(0, 4.7, 0);

    const trunkId = this.addBranch({
      name: 'Прямой ствол Тёккан (直幹)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.44,
      radiusEnd: 0.09,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    const tiers = [
      { y: 1.35, xDir: 1.45, zDir: 0.32, name: 'Нижний правый ярус' },
      { y: 1.95, xDir: -1.25, zDir: -0.22, name: 'Средний левый ярус' },
      { y: 2.55, xDir: 0.22, zDir: -1.25, name: 'Задний глубинный ярус' },
      { y: 3.15, xDir: 0.95, zDir: 0.22, name: 'Верхний правый ярус' },
      { y: 3.65, xDir: -0.85, zDir: 0.22, name: 'Верхний левый ярус' },
      { y: 4.2, xDir: 0.0, zDir: 0.0, name: 'Верхушечная шапка' }
    ];

    tiers.forEach((tier, i) => {
      const start = new THREE.Vector3(0, tier.y, 0);
      const mid = new THREE.Vector3(tier.xDir * 0.6, tier.y - 0.09, tier.zDir * 0.6);
      const end = new THREE.Vector3(tier.xDir, tier.y - 0.16, tier.zDir);
      this.addBranch({
        name: tier.name,
        level: 1,
        points: [start, mid, end],
        radiusStart: 0.13 - i * 0.016,
        radiusEnd: 0.038,
        parentId: trunkId,
        hasFoliage: true
      });
    });
  }

  // Shakan (Slanting)
  buildSlanting() {
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0.65, 1.05, 0.12);
    const p2 = new THREE.Vector3(1.35, 2.05, 0.16);
    const p3 = new THREE.Vector3(1.95, 2.95, 0.12);
    const p4 = new THREE.Vector3(2.4, 3.7, 0.0);

    const trunkId = this.addBranch({
      name: 'Наклонный ствол Сякан (斜幹)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.4,
      radiusEnd: 0.11,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    // Counter balance
    this.addBranch({
      name: 'Противовесная ветвь (Укэ-эда)',
      level: 1,
      points: [
        p1.clone(),
        p1.clone().add(new THREE.Vector3(-0.95, 0.12, -0.22)),
        p1.clone().add(new THREE.Vector3(-1.65, -0.12, -0.32))
      ],
      radiusStart: 0.16,
      radiusEnd: 0.055,
      parentId: trunkId,
      hasFoliage: true
    });

    // Windward branch
    this.addBranch({
      name: 'Основная наветренная ветвь',
      level: 1,
      points: [
        p2.clone(),
        p2.clone().add(new THREE.Vector3(0.95, -0.16, 0.32)),
        p2.clone().add(new THREE.Vector3(1.75, -0.28, 0.42))
      ],
      radiusStart: 0.13,
      radiusEnd: 0.048,
      parentId: trunkId,
      hasFoliage: true
    });

    // Crown
    this.addBranch({
      name: 'Крона по ветру',
      level: 1,
      points: [
        p4.clone(),
        p4.clone().add(new THREE.Vector3(0.35, 0.38, 0)),
        p4.clone().add(new THREE.Vector3(0.65, 0.52, 0))
      ],
      radiusStart: 0.085,
      radiusEnd: 0.032,
      parentId: trunkId,
      hasFoliage: true
    });
  }

  // Kengai (Cascade)
  buildCascade() {
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0.32, 0.55, 0.12);
    const p2 = new THREE.Vector3(0.85, 0.32, 0.22);
    const p3 = new THREE.Vector3(1.25, -0.65, 0.32);
    const p4 = new THREE.Vector3(1.45, -1.65, 0.22);

    const trunkId = this.addBranch({
      name: 'Каскадный ствол Кенгай (懸崖)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.38,
      radiusEnd: 0.095,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    // Crown on pot
    this.addBranch({
      name: 'Верхняя шапка над горшком',
      level: 1,
      points: [
        p1.clone(),
        p1.clone().add(new THREE.Vector3(-0.35, 0.42, -0.22)),
        p1.clone().add(new THREE.Vector3(-0.55, 0.7, -0.12))
      ],
      radiusStart: 0.12,
      radiusEnd: 0.042,
      parentId: trunkId,
      hasFoliage: true
    });

    // Mid cascade
    this.addBranch({
      name: 'Средний ярус каскада',
      level: 1,
      points: [
        p3.clone(),
        p3.clone().add(new THREE.Vector3(0.55, 0.06, 0.32)),
        p3.clone().add(new THREE.Vector3(0.95, -0.12, 0.42))
      ],
      radiusStart: 0.085,
      radiusEnd: 0.032,
      parentId: trunkId,
      hasFoliage: true
    });

    // Lowest cascade tail
    this.addBranch({
      name: 'Нижний шлейф каскада',
      level: 1,
      points: [
        p4.clone(),
        p4.clone().add(new THREE.Vector3(0.32, -0.22, 0.12)),
        p4.clone().add(new THREE.Vector3(0.65, -0.42, 0.0))
      ],
      radiusStart: 0.065,
      radiusEnd: 0.028,
      parentId: trunkId,
      hasFoliage: true
    });
  }

  // Bunjin (Literati)
  buildLiterati() {
    const p0 = new THREE.Vector3(0, 0, 0);
    const p1 = new THREE.Vector3(0.22, 1.25, 0.12);
    const p2 = new THREE.Vector3(-0.28, 2.55, -0.16);
    const p3 = new THREE.Vector3(0.18, 3.7, 0.22);
    const p4 = new THREE.Vector3(-0.12, 4.7, 0.06);

    const trunkId = this.addBranch({
      name: 'Поэтичный ствол Бундзин (文人木)',
      level: 0,
      points: [p0, p1, p2, p3, p4],
      radiusStart: 0.25,
      radiusEnd: 0.065,
      parentId: null
    });
    this.rootBranchIds.push(trunkId);

    this.addBranch({
      name: 'Свисающая верхняя ветвь',
      level: 1,
      points: [
        p3.clone(),
        p3.clone().add(new THREE.Vector3(0.75, -0.22, 0.22)),
        p3.clone().add(new THREE.Vector3(1.25, -0.55, 0.12))
      ],
      radiusStart: 0.065,
      radiusEnd: 0.028,
      parentId: trunkId,
      hasFoliage: true
    });

    this.addBranch({
      name: 'Лаконичный апекс Бундзин',
      level: 1,
      points: [
        p4.clone(),
        p4.clone().add(new THREE.Vector3(-0.42, 0.32, -0.12)),
        p4.clone().add(new THREE.Vector3(-0.75, 0.22, -0.12))
      ],
      radiusStart: 0.055,
      radiusEnd: 0.022,
      parentId: trunkId,
      hasFoliage: true
    });
  }

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

  renderAllBranches() {
    this.foliageMeshes = [];
    this.branches.forEach(branch => {
      this.renderBranch(branch);
    });
  }

  // Render TubeGeometry with organic gnarls & vertex perturbation
  renderBranch(branch) {
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

    const curve = new THREE.CatmullRomCurve3(branch.points);
    const tubularSegments = Math.max(12, branch.points.length * 10);
    const radialSegs = 12;

    const tubeGeo = new THREE.TubeGeometry(
      curve,
      tubularSegments,
      branch.radiusStart,
      radialSegs,
      false
    );

    // Apply organic gnarls & natural taper along the tube
    const pos = tubeGeo.attributes.position;
    const numRings = tubularSegments + 1;

    for (let ring = 0; ring < numRings; ring++) {
      const t = ring / tubularSegments;
      const centerPt = curve.getPoint(t);
      // Organic power-curve taper (wider base, elegant slender top)
      const targetRadius = branch.radiusStart * Math.pow(1 - t, 0.85) + branch.radiusEnd * Math.pow(t, 0.85);
      const factor = targetRadius / branch.radiusStart;

      for (let s = 0; s < radialSegs; s++) {
        const idx = ring * radialSegs + s;
        if (idx < pos.count) {
          const vx = pos.getX(idx);
          const vy = pos.getY(idx);
          const vz = pos.getZ(idx);

          // Organic knotty bark displacement
          const angle = (s / radialSegs) * Math.PI * 2;
          const noise = 1.0 + Math.sin(angle * 3.0 + t * 8.0) * 0.07 + Math.cos(angle * 5.0 + t * 14.0) * 0.04;

          pos.setXYZ(
            idx,
            centerPt.x + (vx - centerPt.x) * factor * noise,
            centerPt.y + (vy - centerPt.y) * factor * noise,
            centerPt.z + (vz - centerPt.z) * factor * noise
          );
        }
      }
    }
    tubeGeo.computeVertexNormals();

    const barkMat = this.getBarkMaterial(branch.isJin);
    const branchMesh = new THREE.Mesh(tubeGeo, barkMat);
    branchMesh.castShadow = true;
    branchMesh.receiveShadow = true;

    branchMesh.userData = { branchId: branch.id };
    this.group.add(branchMesh);
    branch.mesh = branchMesh;

    this.raycastMeshes.push(branchMesh);
    this.meshToBranchMap.set(branchMesh, branch.id);

    // Render Copper Wire
    if (branch.isWired) {
      this.renderBranchWire(branch, curve);
    }

    // Render Foliage Pad
    if (branch.hasFoliage && !branch.isJin) {
      this.renderFoliagePad(branch);
    }
  }

  // Realistic spiral coiled copper wire
  renderBranchWire(branch, curve) {
    const turns = 12;
    const wirePoints = [];

    for (let i = 0; i < turns * 16; i++) {
      const t = i / (turns * 16);
      const pt = curve.getPoint(t);
      const tangent = curve.getTangent(t);
      const radius = (branch.radiusStart * (1 - t) + branch.radiusEnd * t) * 1.14;

      const norm = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
      const binorm = new THREE.Vector3().crossVectors(tangent, norm).normalize();

      const angle = t * turns * Math.PI * 2;
      const ox = (norm.x * Math.cos(angle) + binorm.x * Math.sin(angle)) * radius;
      const oy = (norm.y * Math.cos(angle) + binorm.y * Math.sin(angle)) * radius;
      const oz = (norm.z * Math.cos(angle) + binorm.z * Math.sin(angle)) * radius;

      wirePoints.push(new THREE.Vector3(pt.x + ox, pt.y + oy, pt.z + oz));
    }

    const wireCurve = new THREE.CatmullRomCurve3(wirePoints);
    const wireGeo = new THREE.TubeGeometry(wireCurve, turns * 14, 0.018, 6, false);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xcd7f32,
      metalness: 0.9,
      roughness: 0.22
    });

    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.castShadow = true;
    this.group.add(wireMesh);
    branch.wireMesh = wireMesh;
  }

  // Volumetric cloud foliage pad with subsurface scattering feel
  renderFoliagePad(branch) {
    const foliageGroup = new THREE.Group();
    const tip = branch.points[branch.points.length - 1];
    const tex = this.getFoliageTexture();
    const folColor = this.getFoliageColor();

    const folMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: folColor,
      transparent: true,
      alphaTest: 0.16,
      roughness: 0.55,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    const padPlanesCount = 22;
    const padRadius = 0.6 + (branch.level === 1 ? 0.22 : 0.06);

    for (let i = 0; i < padPlanesCount; i++) {
      const planeGeo = new THREE.PlaneGeometry(0.6, 0.6);
      const mesh = new THREE.Mesh(planeGeo, folMat);

      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.55) * padRadius;
      const px = tip.x + Math.cos(angle) * r;
      const py = tip.y + (Math.random() - 0.28) * 0.26;
      const pz = tip.z + Math.sin(angle) * (r * 0.88);

      mesh.position.set(px, py, pz);
      mesh.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.45;
      mesh.rotation.y = (Math.random() - 0.5) * 0.45;
      mesh.rotation.z = Math.random() * Math.PI * 2;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Track initial position for wind sway
      mesh.userData = {
        basePos: mesh.position.clone(),
        baseRot: mesh.rotation.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 1.5
      };

      foliageGroup.add(mesh);
      this.foliageMeshes.push(mesh);
    }

    this.group.add(foliageGroup);
    branch.foliageGroup = foliageGroup;
  }

  // PRUNE TOOL
  pruneBranch(branchId) {
    const branch = this.branches.get(branchId);
    if (!branch || branch.level === 0) return false;

    this.spawnFallingParticles(branch);

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

    if (branch.parentId && this.branches.has(branch.parentId)) {
      const parent = this.branches.get(branch.parentId);
      parent.childrenIds = parent.childrenIds.filter(id => id !== branchId);
      this.stimulateBackBudding(parent);
    }

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
    this.hideCutIndicator();
    return true;
  }

  stimulateBackBudding(parentBranch) {
    if (parentBranch.childrenIds.length < 3 && parentBranch.level < 2) {
      const midIdx = Math.floor(parentBranch.points.length / 2);
      const startPt = parentBranch.points[midIdx].clone();
      const endPt = startPt.clone().add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.65,
        0.22 + Math.random() * 0.22,
        (Math.random() - 0.5) * 0.65
      ));

      this.addBranch({
        name: `Свежий побег (Пробудившаяся почка)`,
        level: parentBranch.level + 1,
        points: [startPt, endPt],
        radiusStart: 0.045,
        radiusEnd: 0.02,
        parentId: parentBranch.id,
        hasFoliage: true
      });
      this.renderAllBranches();
    }
  }

  wireBranch(branchId, bendDeltaY = 0, bendDeltaPitch = 0) {
    const branch = this.branches.get(branchId);
    if (!branch) return false;

    branch.isWired = true;
    branch.wireAngle.y += bendDeltaY;
    branch.wireAngle.x += bendDeltaPitch;

    const origin = branch.originalPoints[0];
    for (let i = 1; i < branch.points.length; i++) {
      const orig = branch.originalPoints[i];
      const rel = orig.clone().sub(origin);
      const progress = i / (branch.points.length - 1);

      rel.applyAxisAngle(new THREE.Vector3(0, 1, 0), branch.wireAngle.y * progress);
      rel.applyAxisAngle(new THREE.Vector3(1, 0, 0), branch.wireAngle.x * progress);
      rel.y -= progress * 0.16;

      branch.points[i].copy(origin.clone().add(rel));
    }

    this.renderBranch(branch);
    branch.childrenIds.forEach(cid => {
      const child = this.branches.get(cid);
      if (child) this.renderBranch(child);
    });

    return true;
  }

  carveJin(branchId) {
    const branch = this.branches.get(branchId);
    if (!branch) return false;

    branch.isJin = !branch.isJin;
    if (branch.isJin && branch.foliageGroup) {
      this.group.remove(branch.foliageGroup);
      branch.foliageGroup = null;
    }

    this.renderBranch(branch);
    return branch.isJin;
  }

  // Show 3D cut ring preview when hovering branch in prune mode
  showCutIndicator(branch) {
    if (!branch || branch.level === 0) {
      this.hideCutIndicator();
      return;
    }
    const p0 = branch.points[0];
    const p1 = branch.points[1] || branch.points[0];
    const dir = new THREE.Vector3().subVectors(p1, p0).normalize();

    this.cutRing.position.copy(p0).addScaledVector(dir, 0.15);
    this.cutRing.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    this.cutRing.scale.setScalar(branch.radiusStart * 1.5);
    this.cutRing.visible = true;
  }

  hideCutIndicator() {
    if (this.cutRing) this.cutRing.visible = false;
  }

  spawnFallingParticles(branch) {
    const tip = branch.points[branch.points.length - 1];
    const folTex = this.getFoliageTexture();
    const folColor = this.getFoliageColor();

    for (let i = 0; i < 16; i++) {
      const pGeo = new THREE.PlaneGeometry(0.2, 0.2);
      const pMat = new THREE.MeshBasicMaterial({
        map: folTex,
        color: folColor,
        transparent: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.position.set(
        tip.x + (Math.random() - 0.5) * 0.35,
        tip.y + (Math.random() - 0.5) * 0.25,
        tip.z + (Math.random() - 0.5) * 0.35
      );
      this.group.add(mesh);

      this.fallingParticles.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          -0.02 - Math.random() * 0.04,
          (Math.random() - 0.5) * 0.05
        ),
        rotVel: new THREE.Vector3(Math.random() * 0.12, Math.random() * 0.12, Math.random() * 0.12),
        life: 1.2
      });
    }
  }

  // Wind sway & physics update
  update(delta, elapsed = 0) {
    // 1. Wind Sway Animation on Foliage Pads
    for (let i = 0; i < this.foliageMeshes.length; i++) {
      const fMesh = this.foliageMeshes[i];
      if (fMesh && fMesh.userData.basePos) {
        const u = fMesh.userData;
        const sway = Math.sin(elapsed * u.speed + u.phase) * 0.025;
        fMesh.position.x = u.basePos.x + sway;
        fMesh.position.z = u.basePos.z + Math.cos(elapsed * (u.speed * 0.8) + u.phase) * 0.02;
        fMesh.rotation.z = u.baseRot.z + sway * 0.5;
      }
    }

    // 2. Pruned falling particle physics
    for (let i = this.fallingParticles.length - 1; i >= 0; i--) {
      const p = this.fallingParticles[i];
      p.mesh.position.add(p.vel);
      p.mesh.rotation.x += p.rotVel.x;
      p.mesh.rotation.y += p.rotVel.y;
      p.vel.y -= 0.0022;
      p.life -= delta * 0.8;

      if (p.life <= 0 || p.mesh.position.y < -0.25) {
        this.group.remove(p.mesh);
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        this.fallingParticles.splice(i, 1);
      }
    }
  }

  calculateHarmony() {
    let score = 70;
    const branchCount = this.branches.size;
    if (branchCount >= 8 && branchCount <= 16) score += 12;
    else if (branchCount < 5) score -= 15;
    else if (branchCount > 22) score -= 12;

    const wiredCount = Array.from(this.branches.values()).filter(b => b.isWired).length;
    score += Math.min(10, wiredCount * 3);

    const jinCount = Array.from(this.branches.values()).filter(b => b.isJin).length;
    if (jinCount >= 1 && jinCount <= 2) score += 8;

    return Math.max(20, Math.min(99, score));
  }

  setSpecies(species) {
    if (this.species === species) return;
    this.species = species;
    this.generateTree();
  }

  setStyle(style) {
    if (this.style === style) return;
    this.style = style;
    this.generateTree();
  }

  setSeason(season) {
    if (this.season === season) return;
    this.season = season;
    this.renderAllBranches();
  }
}
