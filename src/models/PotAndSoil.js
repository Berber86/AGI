// PotAndSoil.js - Traditional Japanese Bonsai Containers, Akadama Soil & Moss Dressing
import * as THREE from 'three';
import { textureGen } from '../textures/TextureGenerator.js';

export class PotAndSoil {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.potMesh = null;
    this.soilMesh = null;
    this.decorationsGroup = new THREE.Group();
    this.group.add(this.decorationsGroup);

    this.currentPotStyle = 'oval'; // oval, rectangular, cascade, round
    this.currentGlaze = 'tokoname'; // tokoname, celadon, obsidian, cobalt
    this.moisture = 0.65;
    this.mossPatches = [];
    this.suisekiStones = [];
    this.fertilizerCakes = [];

    this.buildPotAndSoil();
  }

  getGlazeMaterial(glazeType) {
    switch (glazeType) {
      case 'celadon': {
        const tex = textureGen.getCeladonGlazeTexture();
        return new THREE.MeshPhysicalMaterial({
          map: tex,
          roughness: 0.15,
          metalness: 0.05,
          clearcoat: 0.8,
          clearcoatRoughness: 0.1,
          color: 0xa4c2b0
        });
      }
      case 'obsidian': {
        return new THREE.MeshStandardMaterial({
          color: 0x1c1b1a,
          roughness: 0.55,
          metalness: 0.15
        });
      }
      case 'cobalt': {
        return new THREE.MeshPhysicalMaterial({
          color: 0x1b3b6f,
          roughness: 0.2,
          metalness: 0.1,
          clearcoat: 0.9
        });
      }
      case 'tokoname':
      default: {
        const tex = textureGen.getTokonamePotTexture();
        return new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.72,
          metalness: 0.05,
          color: 0x7c4735
        });
      }
    }
  }

  buildPotAndSoil() {
    // Remove existing
    if (this.potMesh) this.group.remove(this.potMesh);
    if (this.soilMesh) this.group.remove(this.soilMesh);

    const potMat = this.getGlazeMaterial(this.currentGlaze);

    // 1. Build Pot based on style
    const potGroup = new THREE.Group();

    if (this.currentPotStyle === 'oval') {
      // Oval shallow pot (Даэн)
      const potGeo = new THREE.CylinderGeometry(2.3, 1.9, 0.75, 48, 1);
      potGeo.scale(1.25, 1, 0.9); // Elliptical stretch
      const outerPot = new THREE.Mesh(potGeo, potMat);
      outerPot.castShadow = true;
      outerPot.receiveShadow = true;
      outerPot.position.y = 0.375;
      potGroup.add(outerPot);

      // Rim ring
      const rimGeo = new THREE.TorusGeometry(2.32, 0.07, 16, 48);
      rimGeo.scale(1.25, 0.9, 1);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, potMat);
      rim.position.y = 0.75;
      potGroup.add(rim);

      // Cloud feet (4 feet)
      const footGeo = new THREE.BoxGeometry(0.35, 0.18, 0.3);
      const footPositions = [
        [1.8, 0.09, 1.0],
        [-1.8, 0.09, 1.0],
        [1.8, 0.09, -1.0],
        [-1.8, 0.09, -1.0]
      ];
      footPositions.forEach(([x, y, z]) => {
        const foot = new THREE.Mesh(footGeo, potMat);
        foot.position.set(x, y, z);
        foot.castShadow = true;
        potGroup.add(foot);
      });

      // Soil geometry: slightly convex ellipse dome
      const soilGeo = new THREE.CylinderGeometry(2.18, 2.18, 0.15, 48);
      soilGeo.scale(1.22, 1, 0.88);
      const soilMat = new THREE.MeshStandardMaterial({
        map: textureGen.getAkadamaSoilTexture(this.moisture),
        roughness: 0.85 - this.moisture * 0.25,
        metalness: 0.02
      });
      this.soilMesh = new THREE.Mesh(soilGeo, soilMat);
      this.soilMesh.position.y = 0.72;
      this.soilMesh.receiveShadow = true;
      this.group.add(this.soilMesh);

    } else if (this.currentPotStyle === 'rectangular') {
      // Rectangular pot with corner bevels (Тёхокэй)
      const potGeo = new THREE.BoxGeometry(4.8, 0.8, 3.4);
      const outerPot = new THREE.Mesh(potGeo, potMat);
      outerPot.castShadow = true;
      outerPot.receiveShadow = true;
      outerPot.position.y = 0.4;
      potGroup.add(outerPot);

      // Upper rim band
      const rimGeo = new THREE.BoxGeometry(5.0, 0.1, 3.6);
      const rim = new THREE.Mesh(rimGeo, potMat);
      rim.position.y = 0.75;
      potGroup.add(rim);

      // 4 feet
      const footGeo = new THREE.BoxGeometry(0.5, 0.15, 0.4);
      const footPositions = [
        [2.0, 0.075, 1.3],
        [-2.0, 0.075, 1.3],
        [2.0, 0.075, -1.3],
        [-2.0, 0.075, -1.3]
      ];
      footPositions.forEach(([x, y, z]) => {
        const foot = new THREE.Mesh(footGeo, potMat);
        foot.position.set(x, y, z);
        foot.castShadow = true;
        potGroup.add(foot);
      });

      // Soil plane
      const soilGeo = new THREE.BoxGeometry(4.6, 0.15, 3.2);
      const soilMat = new THREE.MeshStandardMaterial({
        map: textureGen.getAkadamaSoilTexture(this.moisture),
        roughness: 0.85 - this.moisture * 0.25,
        metalness: 0.02
      });
      this.soilMesh = new THREE.Mesh(soilGeo, soilMat);
      this.soilMesh.position.y = 0.72;
      this.soilMesh.receiveShadow = true;
      this.group.add(this.soilMesh);

    } else if (this.currentPotStyle === 'cascade') {
      // Deep tall hexagonal pot for Kengai (Роккаку)
      const potGeo = new THREE.CylinderGeometry(1.6, 1.1, 2.2, 6);
      const outerPot = new THREE.Mesh(potGeo, potMat);
      outerPot.castShadow = true;
      outerPot.receiveShadow = true;
      outerPot.position.y = 1.1;
      potGroup.add(outerPot);

      const rimGeo = new THREE.CylinderGeometry(1.72, 1.6, 0.15, 6);
      const rim = new THREE.Mesh(rimGeo, potMat);
      rim.position.y = 2.15;
      potGroup.add(rim);

      // 3 feet
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        const footGeo = new THREE.BoxGeometry(0.35, 0.2, 0.35);
        const foot = new THREE.Mesh(footGeo, potMat);
        foot.position.set(Math.cos(a) * 0.95, 0.1, Math.sin(a) * 0.95);
        foot.castShadow = true;
        potGroup.add(foot);
      }

      // Soil top
      const soilGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.15, 6);
      const soilMat = new THREE.MeshStandardMaterial({
        map: textureGen.getAkadamaSoilTexture(this.moisture),
        roughness: 0.85 - this.moisture * 0.25,
        metalness: 0.02
      });
      this.soilMesh = new THREE.Mesh(soilGeo, soilMat);
      this.soilMesh.position.y = 2.12;
      this.soilMesh.receiveShadow = true;
      this.group.add(this.soilMesh);

    } else {
      // Round shallow lotus pot (Мару)
      const potGeo = new THREE.CylinderGeometry(2.1, 1.7, 0.7, 36);
      const outerPot = new THREE.Mesh(potGeo, potMat);
      outerPot.castShadow = true;
      outerPot.receiveShadow = true;
      outerPot.position.y = 0.35;
      potGroup.add(outerPot);

      const rimGeo = new THREE.TorusGeometry(2.12, 0.06, 16, 36);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, potMat);
      rim.position.y = 0.7;
      potGroup.add(rim);

      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const footGeo = new THREE.BoxGeometry(0.35, 0.16, 0.3);
        const foot = new THREE.Mesh(footGeo, potMat);
        foot.position.set(Math.cos(a) * 1.5, 0.08, Math.sin(a) * 1.5);
        potGroup.add(foot);
      }

      const soilGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.15, 36);
      const soilMat = new THREE.MeshStandardMaterial({
        map: textureGen.getAkadamaSoilTexture(this.moisture),
        roughness: 0.85 - this.moisture * 0.25,
        metalness: 0.02
      });
      this.soilMesh = new THREE.Mesh(soilGeo, soilMat);
      this.soilMesh.position.y = 0.68;
      this.soilMesh.receiveShadow = true;
      this.group.add(this.soilMesh);
    }

    this.potMesh = potGroup;
    this.group.add(this.potMesh);

    // Refresh moss and stones on the new pot
    this.refreshDecorations();
  }

  setPotStyle(style) {
    if (this.currentPotStyle === style) return;
    this.currentPotStyle = style;
    this.buildPotAndSoil();
  }

  setGlaze(glaze) {
    if (this.currentGlaze === glaze) return;
    this.currentGlaze = glaze;
    this.buildPotAndSoil();
  }

  setMoisture(val) {
    this.moisture = Math.max(0, Math.min(1, val));
    if (this.soilMesh && this.soilMesh.material) {
      this.soilMesh.material.map = textureGen.getAkadamaSoilTexture(this.moisture);
      this.soilMesh.material.roughness = 0.85 - this.moisture * 0.25;
      this.soilMesh.material.needsUpdate = true;
    }
  }

  // Get the base soil surface Y level for planting tree
  getSoilSurfaceY() {
    if (this.currentPotStyle === 'cascade') {
      return 2.15;
    }
    return 0.75;
  }

  // Place moss cushion (Кокэ)
  addMossPatch(x = null, z = null) {
    const soilY = this.getSoilSurfaceY();
    const px = x !== null ? x : (Math.random() - 0.5) * 2.2;
    const pz = z !== null ? z : (Math.random() - 0.5) * 1.6;

    const r = 0.28 + Math.random() * 0.22;
    const mossGeo = new THREE.SphereGeometry(r, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
    mossGeo.scale(1, 0.45, 1);

    const mossMat = new THREE.MeshStandardMaterial({
      map: textureGen.getMossTexture(),
      roughness: 0.95,
      metalness: 0.0,
      color: 0x5fa44a
    });

    const mossMesh = new THREE.Mesh(mossGeo, mossMat);
    mossMesh.position.set(px, soilY, pz);
    mossMesh.rotation.y = Math.random() * Math.PI * 2;
    mossMesh.castShadow = true;
    mossMesh.receiveShadow = true;

    this.decorationsGroup.add(mossMesh);
    this.mossPatches.push(mossMesh);
    return mossMesh;
  }

  // Place natural decorative stone (Суйсэки)
  addSuisekiStone(x = null, z = null) {
    const soilY = this.getSoilSurfaceY();
    const px = x !== null ? x : 1.2 + (Math.random() - 0.5) * 0.4;
    const pz = z !== null ? z : 0.4 + (Math.random() - 0.5) * 0.4;

    const stoneGeo = new THREE.DodecahedronGeometry(0.28 + Math.random() * 0.15, 1);
    // Deform vertices for natural rugged mountain stone
    const pos = stoneGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      pos.setXYZ(
        i,
        vx * (0.8 + Math.sin(vy * 8) * 0.2),
        vy * (0.7 + Math.cos(vx * 6) * 0.15),
        vz * (0.8 + Math.sin(vz * 7) * 0.2)
      );
    }
    stoneGeo.computeVertexNormals();

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x3d4144,
      roughness: 0.8,
      metalness: 0.1
    });

    const stoneMesh = new THREE.Mesh(stoneGeo, stoneMat);
    stoneMesh.position.set(px, soilY + 0.12, pz);
    stoneMesh.rotation.set(Math.random(), Math.random(), Math.random());
    stoneMesh.castShadow = true;
    stoneMesh.receiveShadow = true;

    this.decorationsGroup.add(stoneMesh);
    this.suisekiStones.push(stoneMesh);
    return stoneMesh;
  }

  // Add organic fertilizer cake (Абиси / Хилё)
  addFertilizerCake(x = null, z = null) {
    const soilY = this.getSoilSurfaceY();
    const px = x !== null ? x : -1.2 + (Math.random() - 0.5) * 0.3;
    const pz = z !== null ? z : -0.5 + (Math.random() - 0.5) * 0.3;

    const cakeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const cakeMat = new THREE.MeshStandardMaterial({
      color: 0x2e2015,
      roughness: 0.95
    });

    const cakeMesh = new THREE.Mesh(cakeGeo, cakeMat);
    cakeMesh.position.set(px, soilY + 0.04, pz);
    cakeMesh.castShadow = true;

    // Small protective basket cage
    const cageGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.12, 8, 1, true);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x274e13,
      wireframe: true
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    cage.position.set(px, soilY + 0.06, pz);

    const fGroup = new THREE.Group();
    fGroup.add(cakeMesh);
    fGroup.add(cage);

    this.decorationsGroup.add(fGroup);
    this.fertilizerCakes.push(fGroup);
    return fGroup;
  }

  clearDecorations() {
    while (this.decorationsGroup.children.length > 0) {
      this.decorationsGroup.remove(this.decorationsGroup.children[0]);
    }
    this.mossPatches = [];
    this.suisekiStones = [];
    this.fertilizerCakes = [];
  }

  refreshDecorations() {
    const soilY = this.getSoilSurfaceY();
    this.decorationsGroup.children.forEach(child => {
      child.position.y = soilY;
    });
  }

  // Populate default tasteful Japanese dressing
  setupDefaultZenDressing() {
    this.clearDecorations();
    // 5-6 moss cushions
    this.addMossPatch(-0.8, -0.4);
    this.addMossPatch(0.7, 0.5);
    this.addMossPatch(-0.5, 0.6);
    this.addMossPatch(0.9, -0.3);
    this.addMossPatch(0.1, -0.8);

    // 1 classical suiseki stone
    this.addSuisekiStone(1.3, 0.2);

    // 1 fertilizer cage
    this.addFertilizerCake(-1.2, 0.4);
  }
}
