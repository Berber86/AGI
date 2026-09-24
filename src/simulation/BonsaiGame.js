// BonsaiGame.js - Core Simulator Life Cycle, Quests, Tools & Interaction
import * as THREE from 'three';
import { zenAudio } from '../audio/ZenAudio.js';

export class BonsaiGame {
  constructor(tree, potAndSoil, environment, camera, controls, domElement) {
    this.tree = tree;
    this.potAndSoil = potAndSoil;
    this.environment = environment;
    this.camera = camera;
    this.controls = controls;
    this.domElement = domElement;

    this.moisture = 65;
    this.nutrients = 70;
    this.health = 96;
    this.ageYears = tree.age || 28;
    this.ageMonths = 4;
    this.harmonyScore = tree.calculateHarmony();
    this.isAutoRotating = false;

    this.currentTool = 'inspect';

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredBranch = null;
    this.selectedBranch = null;

    this.waterParticles = [];

    this.quests = [
      { id: 'water', title: 'Первый глоток (Мидзуяри)', desc: 'Полейте бонсай из лейки для оптимальной влажности', done: false },
      { id: 'prune', title: 'Искусство Сэнтэй', desc: 'Обрежьте лишнюю ветвь для создания пространства Ма', done: false },
      { id: 'wire', title: 'Линия Ветра (Хариганэ)', desc: 'Изогните ветвь с помощью проволоки', done: false },
      { id: 'jin', title: 'Дух Вечности (Дзин)', desc: 'Превратите ветвь в выбеленный мертвый сук', done: false },
      { id: 'moss', title: 'Зеленый покров', desc: 'Украсьте почву живым бархатным мхом', done: false },
      { id: 'harmony', title: 'Мастер Ваби-Саби', desc: 'Достигните эстетической гармонии 90% и выше', done: false }
    ];

    this.onStateChangeCallbacks = [];

    this.setupPointerEvents();
  }

  onStateChange(cb) {
    this.onStateChangeCallbacks.push(cb);
  }

  notifyStateChange() {
    this.harmonyScore = this.tree.calculateHarmony();
    this.checkQuests();
    const state = this.getState();
    this.onStateChangeCallbacks.forEach(cb => cb(state));
  }

  getState() {
    return {
      moisture: Math.round(this.moisture),
      nutrients: Math.round(this.nutrients),
      health: Math.round(this.health),
      ageYears: this.ageYears,
      ageMonths: this.ageMonths,
      harmonyScore: this.harmonyScore,
      currentTool: this.currentTool,
      selectedBranch: this.selectedBranch,
      species: this.tree.species,
      style: this.tree.style,
      season: this.tree.season,
      atmosphere: this.environment.currentAtmosphere,
      potStyle: this.potAndSoil.currentPotStyle,
      potGlaze: this.potAndSoil.currentGlaze,
      isAutoRotating: this.isAutoRotating,
      quests: this.quests
    };
  }

  setTool(tool) {
    this.currentTool = tool;
    if (this.currentTool !== 'prune') {
      this.tree.hideCutIndicator();
    }
    this.notifyStateChange();
  }

  setupPointerEvents() {
    this.domElement.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));
  }

  onPointerMove(e) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.tree.raycastMeshes, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const bId = hitMesh.userData.branchId;
      if (this.tree.branches.has(bId)) {
        this.hoveredBranch = this.tree.branches.get(bId);
        this.domElement.style.cursor = 'pointer';

        // In prune mode, show 3D cut ring indicator
        if (this.currentTool === 'prune') {
          this.tree.showCutIndicator(this.hoveredBranch);
        }
        return;
      }
    }

    this.hoveredBranch = null;
    this.domElement.style.cursor = 'default';
    this.tree.hideCutIndicator();
  }

  onPointerDown(e) {
    if (e.button !== 0) return;

    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Raycast on Branches
    const branchHits = this.raycaster.intersectObjects(this.tree.raycastMeshes, false);
    if (branchHits.length > 0) {
      const hitMesh = branchHits[0].object;
      const bId = hitMesh.userData.branchId;
      const branch = this.tree.branches.get(bId);

      if (branch) {
        this.handleBranchClick(branch);
        return;
      }
    }

    // 2. Raycast on Soil
    if (this.potAndSoil.soilMesh) {
      const soilHits = this.raycaster.intersectObject(this.potAndSoil.soilMesh, false);
      if (soilHits.length > 0) {
        const pt = soilHits[0].point;
        this.handleSoilClick(pt);
      }
    }
  }

  handleBranchClick(branch) {
    if (this.currentTool === 'prune') {
      if (branch.level === 0) return;
      const success = this.tree.pruneBranch(branch.id);
      if (success) {
        zenAudio.playShearsCut();
        this.completeQuest('prune');
        this.selectedBranch = null;
        this.notifyStateChange();
      }
    } else if (this.currentTool === 'wire') {
      zenAudio.playWireBend();
      this.tree.wireBranch(branch.id, 0.35, -0.2);
      this.completeQuest('wire');
      this.selectedBranch = branch;
      this.notifyStateChange();
    } else if (this.currentTool === 'jin') {
      zenAudio.playCarveJin();
      const isJin = this.tree.carveJin(branch.id);
      if (isJin) this.completeQuest('jin');
      this.selectedBranch = branch;
      this.notifyStateChange();
    } else {
      // Inspect tool
      zenAudio.playRinGong(520);
      this.selectedBranch = branch;
      this.notifyStateChange();
    }
  }

  handleSoilClick(point) {
    const relX = point.x - this.potAndSoil.group.position.x;
    const relZ = point.z - this.potAndSoil.group.position.z;

    if (this.currentTool === 'water') {
      this.waterTree(point);
    } else if (this.currentTool === 'fertilize') {
      zenAudio.playRinGong(440);
      this.potAndSoil.addFertilizerCake(relX, relZ);
      this.nutrients = Math.min(100, this.nutrients + 25);
      this.notifyStateChange();
    } else if (this.currentTool === 'moss') {
      zenAudio.playRinGong(580);
      this.potAndSoil.addMossPatch(relX, relZ);
      this.completeQuest('moss');
      this.notifyStateChange();
    }
  }

  waterTree(targetPoint = null) {
    zenAudio.playWatering();
    this.completeQuest('water');

    const origin = targetPoint ? targetPoint.clone().add(new THREE.Vector3(0, 1.9, 0)) : new THREE.Vector3(0, 3.2, 0);

    const dropCount = 55;
    const dropGeo = new THREE.BufferGeometry();
    const dropPositions = new Float32Array(dropCount * 3);
    const dropVelocities = [];

    for (let i = 0; i < dropCount; i++) {
      dropPositions[i * 3] = origin.x + (Math.random() - 0.5) * 1.4;
      dropPositions[i * 3 + 1] = origin.y + Math.random() * 0.6;
      dropPositions[i * 3 + 2] = origin.z + (Math.random() - 0.5) * 1.4;

      dropVelocities.push({
        x: (Math.random() - 0.5) * 0.025,
        y: -0.07 - Math.random() * 0.05,
        z: (Math.random() - 0.5) * 0.025
      });
    }

    dropGeo.setAttribute('position', new THREE.BufferAttribute(dropPositions, 3));
    const dropMat = new THREE.PointsMaterial({
      color: 0xa4d4f8,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const dropMesh = new THREE.Points(dropGeo, dropMat);
    this.tree.scene.add(dropMesh);

    this.waterParticles.push({
      mesh: dropMesh,
      positions: dropPositions,
      velocities: dropVelocities,
      life: 1.3
    });

    this.moisture = Math.min(100, this.moisture + 20);
    this.potAndSoil.setMoisture(this.moisture / 100);
    this.notifyStateChange();
  }

  completeQuest(questId) {
    const q = this.quests.find(item => item.id === questId);
    if (q && !q.done) {
      q.done = true;
      zenAudio.playRinGong(660);
      this.notifyStateChange();
    }
  }

  checkQuests() {
    if (this.harmonyScore >= 90) {
      this.completeQuest('harmony');
    }
  }

  setCameraView(view) {
    if (!this.controls) return;
    const target = new THREE.Vector3(0, 2.2, 0);
    this.controls.target.copy(target);

    switch (view) {
      case 'front':
        this.camera.position.set(0, 2.6, 7.5);
        break;
      case 'side':
        this.camera.position.set(7.5, 2.6, 0);
        break;
      case 'top':
        this.camera.position.set(0.1, 8.2, 0.1);
        break;
      case 'macro':
        if (this.selectedBranch) {
          const pt = this.selectedBranch.points[0];
          this.controls.target.copy(pt);
          this.camera.position.set(pt.x + 1.2, pt.y + 0.5, pt.z + 1.6);
        } else {
          this.camera.position.set(1.5, 3.0, 3.2);
        }
        break;
    }
    this.controls.update();
  }

  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    this.controls.autoRotate = this.isAutoRotating;
    this.controls.autoRotateSpeed = 0.8;
    this.notifyStateChange();
  }

  advanceTime(months = 6) {
    this.ageMonths += months;
    if (this.ageMonths >= 12) {
      this.ageYears += Math.floor(this.ageMonths / 12);
      this.ageMonths = this.ageMonths % 12;
    }

    this.moisture = Math.max(15, this.moisture - months * 3.5);
    this.potAndSoil.setMoisture(this.moisture / 100);

    this.nutrients = Math.max(10, this.nutrients - months * 2.5);

    if (this.moisture >= 40 && this.moisture <= 85 && this.nutrients >= 30) {
      this.health = Math.min(100, this.health + 4);
    } else if (this.moisture < 25 || this.moisture > 92) {
      this.health = Math.max(20, this.health - 8);
    }

    this.tree.branches.forEach(b => {
      b.radiusStart = Math.min(0.58, b.radiusStart * 1.018);
      b.radiusEnd = Math.min(0.22, b.radiusEnd * 1.018);
    });
    this.tree.renderAllBranches();

    zenAudio.playRinGong(440);
    this.notifyStateChange();
  }

  update(delta) {
    for (let i = this.waterParticles.length - 1; i >= 0; i--) {
      const p = this.waterParticles[i];
      const pos = p.positions;
      const vels = p.velocities;
      const count = pos.length / 3;

      for (let j = 0; j < count; j++) {
        pos[j * 3] += vels[j].x;
        pos[j * 3 + 1] += vels[j].y;
        pos[j * 3 + 2] += vels[j].z;
        vels[j].y -= 0.0035;
      }

      p.mesh.geometry.attributes.position.needsUpdate = true;
      p.life -= delta;

      if (p.life <= 0) {
        this.tree.scene.remove(p.mesh);
        if (p.mesh.geometry) p.mesh.geometry.dispose();
        this.waterParticles.splice(i, 1);
      }
    }
  }
}
