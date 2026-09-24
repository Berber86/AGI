// PotAndSoil.js - AAA Traditional Japanese Containers, PBR Soil & Velvet Moss
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

    this.currentPotStyle = 'oval';
    this.currentGlaze = 'tokoname';
    this.moisture = 0.65;
    this.mossPatches = [];
    this.suisekiStones = [];
    this.fertilizerCakes = [];

    this.buildPotAndSoil();
  }

  getGlazeMaterial(glazeType) {
    switch (glazeType) {
      case 'celadon': {
        const pbr = textureGen.getCeladonPBR();
        return new THREE.MeshPhysicalMaterial({
          map: pbr.map,
          normalMap: pbr.normalMap,
          normalScale: new THREE.Vector2(1.8, 1.8),
          roughness: 0.12,
          metalness: 0.05,
          clearcoat: 0.95,
          clearcoatRoughness: 0.08,
          color: 0xa4c2b0
        });
      }
      case 'obsidian': {
        const pbr = textureGen.getPineBarkPBR();
        return new THREE.MeshPhysicalMaterial({
          color: 0x181716,
          normalMap: pbr.normalMap,
          normalScale: new THREE.Vector2(0.6, 0.6),
          roughness: 0.42,
          metalness: 0.15,
          clearcoat: 0.5
        });
      }
      case 'cobalt': {
        return new THREE.MeshPhysicalMaterial({
          color: 0x163462,
          roughness: 0.18,
          metalness: 0.08,
          clearcoat: 0.95,
          clearcoatRoughness: 0.06
        });
      }
      case 'tokoname':
      default: {
        const pbr = textureGen.getPineBarkPBR();
        return new THREE.MeshStandardMaterial({
          color: 0x7a4332,
          normalMap: pbr.normalMap,
          normalScale: new THREE.Vector2(0.7, 0.7),
          roughness: 0.72,
          metalness: 0.04
        });
      }
    }
  }

  buildPotAndSoil() {
    if (this.potMesh) this.group.remove(this.potMesh);
    if (this.soilMesh) this.group.remove(this.soilMesh);

    const potMat = this.getGlazeMaterial(this.currentGlaze);
    const potGroup = new THREE.Group();

    if (this.currentPotStyle === 'oval') {
      const potGeo = new THREE.CylinderGeometry(2.35, 1.95, 0.78, 56, 1);
      potGeo.scale(1.26, 1, 0.9);
      const outerPot = new THREE.Mesh(potGeo, potMat);
      outerPot.castShadow = true;
      outerPot.receiveShadow = true;
      outerPot.position.y = 0.39;
      potGroup.add(outerPot);

      const rimGeo = new THREE.TorusGeometry(2.36, 0.075, 16, 56);
      rimGeo.scale(1.26, 0.9, 1);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, potMat);
      rim.position.y = 0.78;
      potGroup.add(rim);

      const footGeo = new THREE.BoxGeometry(0.38, 0.18, 0.32);
      const footPositions = [
        [1.85, 0.09, 1.05],
        [-1.85, 0.09, 1.05],
        [1.85, 0.09, -1.05],
        [-1.85, 0.09, -1.05]
      ];
      footPositions.forEach(([x, y, z]) => {
        const foot = new THREE.Mesh(footGeo, potMat);
        foot.position.set(x, y, z);
        foot.castShadow = true;
        potGroup.add(foot);
      });

      const soilGeo = new THREE.CylinderGeometry(2.22, 2.22, 0.16, 56);
      soilGeo.scale(1.24, 1, 0.88);
      const soilPBR = textureGen.getAkadamaSoilPBR(this.moisture);
      const soilMat = new THREE.MeshStandardMaterial({
        map: soilPBR.map,
        normalMap: soilPBR.normalMap,
        normalScale: new THREE.Vector2(2.0, 2.0),
        roughnessMap: soilPBR.roughnessMap,
        roughness: 0.82 - this.moisture * 0.35,
        metalness: 0.02
      });
      this.soilMesh = new THREE.Mesh(soilGeo, soilMat);
      this.soilMesh.position.y = 0.74;
      this.soilMesh.receiveShadow = true;
      this.group.add(this.soilMesh);

    } else if (this.currentPotStyle === 'rectangular') {
      const potGeo = new THREE.BoxGeometry(4.85, 0.82, 3.45);
      const outerPot = new THREE.Mesh(potGeo, potMat);
      outerPot.castShadow = true;
      outerPot.receiveShadow = true;
      outerPot.position.y = 0.41;
      potGroup.add(outerPot);

      const rimGeo = new THREE.BoxGeometry(5.05, 0.1, 3.65);
      const rim = new THREE.Mesh(rimGeo, potMat);
      rim.position.y = 0.78;
      potGroup.add(rim);

      const footGeo = new THREE.BoxGeometry(0.52, 0.16, 0.42);
      const footPositions = [
        [2.05, 0.08, 1.35],
        [-2.05, 0.08, 1.35],
        [2.05, 0.08, -1.35],
        [-2.05, 0.08, -1.35]
      ];
      footPositions.forEach(([x, y, z]) => {
        const foot = new THREE.Mesh(footGeo, potMat);
        foot.position.set(x, y, z);
        foot.castShadow = true;
        potGroup.add(foot);
      });

      const soilGeo = new THREE.BoxGeometry(4.65, 0.16, 3.25);
      const soilPBR = textureGen.getAkadamaSoilPBR(this.moisture);
      const soilMat = new THREE.MeshStandardMaterial({
        map: soilPBR.map,
        normalMap: soilPBR.normalMap,
        normalScale: new THREE.Vector2(2.0, 2.0),
        roughnessMap: soilPBR.roughnessMap,
        roughness: 0.82 - this.moisture * 0.35,
        metalness: 0.02
      });
      this.soilMesh = new THREE.Mesh(soilGeo, soilMat);
      this.soilMesh.position.y = 0.74;
      this.soilMesh.receiveShadow = true;
      this.group.add(this.soilMesh);

    } else if (this.currentPotStyle === 'cascade') {
      const potGeo = new THREE.CylinderGeometry(1.65, 1.15, 2.3, 6);
      const outerPot = new THREE.Mesh(potGeo, potMat);
      outerPot.castShadow = true;
      outerPot.receiveShadow = true;
      outerPot.position.y = 1.15;
      potGroup.add(outerPot);

      const rimGeo = new THREE.CylinderGeometry(1.78, 1.65, 0.16, 6);
      const rim = new THREE.Mesh(rimGeo, potMat);
      rim.position.y = 2.22;
      potGroup.add(rim);

      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        const footGeo = new THREE.BoxGeometry(0.38, 0.22, 0.38);
        const foot = new THREE.Mesh(footGeo, potMat);
        foot.position.set(Math.cos(a) * 0.98, 0.11, Math.sin(a) * 0.98);
        foot.castShadow = true;
        potGroup.add(foot);
      }

      const soilGeo = new THREE.CylinderGeometry(1.55, 1.55, 0.16, 6);
      const soilPBR = textureGen.getAkadamaSoilPBR(this.moisture);
      const soilMat = new THREE.MeshStandardMaterial({
        map: soilPBR.map,
        normalMap: soilPBR.normalMap,
        normalScale: new THREE.Vector2(2.0, 2.0),
        roughnessMap: soilPBR.roughnessMap,
        roughness: 0.82 - this.moisture * 0.35,
        metalness: 0.02
      });
      this.soilMesh = new THREE.Mesh(soilGeo, soilMat);
      this.soilMesh.position.y = 2.2;
      this.soilMesh.receiveShadow = true;
      this.group.add(this.soilMesh);

    } else {
      // Round lotus pot
      const potGeo = new THREE.CylinderGeometry(2.15, 1.75, 0.72, 48);
      const outerPot = new THREE.Mesh(potGeo, potMat);
      outerPot.castShadow = true;
      outerPot.receiveShadow = true;
      outerPot.position.y = 0.36;
      potGroup.add(outerPot);

      const rimGeo = new THREE.TorusGeometry(2.16, 0.065, 16, 48);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, potMat);
      rim.position.y = 0.72;
      potGroup.add(rim);

      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const footGeo = new THREE.BoxGeometry(0.36, 0.18, 0.32);
        const foot = new THREE.Mesh(footGeo, potMat);
        foot.position.set(Math.cos(a) * 1.55, 0.09, Math.sin(a) * 1.55);
        potGroup.add(foot);
      }

      const soilGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.16, 48);
      const soilPBR = textureGen.getAkadamaSoilPBR(this.moisture);
      const soilMat = new THREE.MeshStandardMaterial({
        map: soilPBR.map,
        normalMap: soilPBR.normalMap,
        normalScale: new THREE.Vector2(2.0, 2.0),
        roughnessMap: soilPBR.roughnessMap,
        roughness: 0.82 - this.moisture * 0.35,
        metalness: 0.02
      });
      this.soilMesh = new THREE.Mesh(soilGeo, soilMat);
      this.soilMesh.position.y = 0.7;
      this.soilMesh.receiveShadow = true;
      this.group.add(this.soilMesh);
    }

    this.potMesh = potGroup;
    this.group.add(this.potMesh);
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
      const pbr = textureGen.getAkadamaSoilPBR(this.moisture);
      this.soilMesh.material.map = pbr.map;
      this.soilMesh.material.normalMap = pbr.normalMap;
      this.soilMesh.material.roughnessMap = pbr.roughnessMap;
      this.soilMesh.material.roughness = 0.82 - this.moisture * 0.35;
      this.soilMesh.material.needsUpdate = true;
    }
  }

  getSoilSurfaceY() {
    return this.currentPotStyle === 'cascade' ? 2.22 : 0.76;
  }

  // Velvet 3D Moss Cushion
  addMossPatch(x = null, z = null) {
    const soilY = this.getSoilSurfaceY();
    const px = x !== null ? x : (Math.random() - 0.5) * 2.3;
    const pz = z !== null ? z : (Math.random() - 0.5) * 1.7;

    const r = 0.3 + Math.random() * 0.24;
    const mossGeo = new THREE.SphereGeometry(r, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    mossGeo.scale(1, 0.42, 1);

    const pbr = textureGen.getMossPBR();
    const mossMat = new THREE.MeshStandardMaterial({
      map: pbr.map,
      normalMap: pbr.normalMap,
      normalScale: new THREE.Vector2(2.5, 2.5),
      roughness: 0.94,
      metalness: 0.0,
      color: 0x589e44
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

  // Natural Suiseki Stone with Quartz Relief
  addSuisekiStone(x = null, z = null) {
    const soilY = this.getSoilSurfaceY();
    const px = x !== null ? x : 1.25 + (Math.random() - 0.5) * 0.4;
    const pz = z !== null ? z : 0.45 + (Math.random() - 0.5) * 0.4;

    const stoneGeo = new THREE.DodecahedronGeometry(0.32 + Math.random() * 0.16, 2);
    const pos = stoneGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      pos.setXYZ(
        i,
        vx * (0.8 + Math.sin(vy * 9) * 0.22),
        vy * (0.65 + Math.cos(vx * 7) * 0.16),
        vz * (0.8 + Math.sin(vz * 8) * 0.22)
      );
    }
    stoneGeo.computeVertexNormals();

    const pbr = textureGen.getPineBarkPBR();
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x363a3d,
      normalMap: pbr.normalMap,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughness: 0.78,
      metalness: 0.08
    });

    const stoneMesh = new THREE.Mesh(stoneGeo, stoneMat);
    stoneMesh.position.set(px, soilY + 0.14, pz);
    stoneMesh.rotation.set(Math.random(), Math.random(), Math.random());
    stoneMesh.castShadow = true;
    stoneMesh.receiveShadow = true;

    this.decorationsGroup.add(stoneMesh);
    this.suisekiStones.push(stoneMesh);
    return stoneMesh;
  }

  addFertilizerCake(x = null, z = null) {
    const soilY = this.getSoilSurfaceY();
    const px = x !== null ? x : -1.25 + (Math.random() - 0.5) * 0.3;
    const pz = z !== null ? z : -0.55 + (Math.random() - 0.5) * 0.3;

    const cakeGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.09, 16);
    const cakeMat = new THREE.MeshStandardMaterial({
      color: 0x2d1f14,
      roughness: 0.95
    });

    const cakeMesh = new THREE.Mesh(cakeGeo, cakeMat);
    cakeMesh.position.set(px, soilY + 0.045, pz);
    cakeMesh.castShadow = true;

    const cageGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.13, 8, 1, true);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x224911,
      wireframe: true
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    cage.position.set(px, soilY + 0.065, pz);

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

  setupDefaultZenDressing() {
    this.clearDecorations();
    this.addMossPatch(-0.85, -0.42);
    this.addMossPatch(0.75, 0.52);
    this.addMossPatch(-0.52, 0.62);
    this.addMossPatch(0.92, -0.32);
    this.addMossPatch(0.12, -0.82);
    this.addSuisekiStone(1.35, 0.22);
    this.addFertilizerCake(-1.25, 0.42);
  }
}
