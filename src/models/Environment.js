// Environment.js - AAA Japanese Tokonoma & Garden with Volumetric Light & Animated Shishi-Odoshi
import * as THREE from 'three';
import { textureGen } from '../textures/TextureGenerator.js';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.currentAtmosphere = 'golden';
    this.lights = {};
    this.particles = {};

    // Shishi-Odoshi animation state
    this.shishiArm = null;
    this.shishiAngle = 0;
    this.shishiState = 'filling'; // filling, tipping, snapping
    this.shishiTimer = 0;

    // Water ripple in basin
    this.waterMesh = null;

    this.buildArchitecture();
    this.setupLighting();
    this.setupVolumetricLightBeam();
    this.setupParticleSystems();
    this.setAtmosphere('golden');
  }

  buildArchitecture() {
    // 1. Tatami Mat Flooring (Татами)
    const tatamiTex = textureGen.getTatamiTexture();
    const floorGeo = new THREE.PlaneGeometry(32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      map: tatamiTex,
      roughness: 0.82,
      metalness: 0.04
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.group.add(floor);

    // 2. Bonsai Display Table / Stand (Сёку) with authentic Urushi Lacquer PBR
    const lacquerPBR = textureGen.getLacqueredWoodPBR();
    const tableMat = new THREE.MeshPhysicalMaterial({
      map: lacquerPBR.map,
      roughness: 0.22,
      metalness: 0.1,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      color: 0x22130e
    });

    const tableTopGeo = new THREE.BoxGeometry(6.8, 0.2, 4.5);
    const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
    tableTop.position.set(0, 0.16, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    this.group.add(tableTop);

    // 4 curved legs for stand
    const legGeo = new THREE.BoxGeometry(0.38, 0.16, 0.38);
    const legCoords = [
      [2.9, 0.08, 1.85],
      [-2.9, 0.08, 1.85],
      [2.9, 0.08, -1.85],
      [-2.9, 0.08, -1.85]
    ];
    legCoords.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, tableMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      this.group.add(leg);
    });

    // 3. Shoji Sliding Screen Partition (Сёдзи)
    const shojiGroup = new THREE.Group();
    shojiGroup.position.set(0, 0, -4.6);

    const paperMat = new THREE.MeshStandardMaterial({
      map: textureGen.getShojiPaperTexture(),
      roughness: 0.9,
      color: 0xfffcf5,
      side: THREE.DoubleSide
    });
    const paperGeo = new THREE.PlaneGeometry(18, 9.5);
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    paperMesh.position.set(0, 4.75, 0);
    paperMesh.receiveShadow = true;
    shojiGroup.add(paperMesh);

    // Wooden Kumiko Lattice
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x362215,
      roughness: 0.65
    });

    const frameGeoH = new THREE.BoxGeometry(18.2, 0.28, 0.14);
    const topFrame = new THREE.Mesh(frameGeoH, woodMat);
    topFrame.position.set(0, 9.5, 0.03);
    const btmFrame = new THREE.Mesh(frameGeoH, woodMat);
    btmFrame.position.set(0, 0, 0.03);
    shojiGroup.add(topFrame, btmFrame);

    for (let x = -9; x <= 9; x += 1.8) {
      const barGeo = new THREE.BoxGeometry(0.14, 9.5, 0.08);
      const bar = new THREE.Mesh(barGeo, woodMat);
      bar.position.set(x, 4.75, 0.03);
      bar.castShadow = true;
      shojiGroup.add(bar);
    }
    for (let y = 0.95; y < 9.5; y += 0.95) {
      const barGeo = new THREE.BoxGeometry(18, 0.09, 0.08);
      const bar = new THREE.Mesh(barGeo, woodMat);
      bar.position.set(0, y, 0.03);
      bar.castShadow = true;
      shojiGroup.add(bar);
    }

    this.group.add(shojiGroup);

    // 4. Hanging Calligraphy Scroll (Какэмоно)
    this.buildKakemono();

    // 5. Incense Burner (Коро)
    this.buildIncenseBurner();

    // 6. Japanese Stone Lantern (Торо)
    this.buildStoneLantern();

    // 7. Animated Shishi-Odoshi (Сиси-одоси)
    this.buildShishiOdoshi();
  }

  buildKakemono() {
    const scrollGroup = new THREE.Group();
    scrollGroup.position.set(-4.6, 4.4, -4.45);

    const silkMat = new THREE.MeshStandardMaterial({
      color: 0x7a6555,
      roughness: 0.85
    });
    const silkGeo = new THREE.PlaneGeometry(1.9, 5.4);
    const silk = new THREE.Mesh(silkGeo, silkMat);
    scrollGroup.add(silk);

    const { canvas, ctx } = textureGen.createCanvas(256, 512);
    ctx.fillStyle = '#faf5ec';
    ctx.fillRect(0, 0, 256, 512);

    ctx.fillStyle = '#181714';
    ctx.textAlign = 'center';
    ctx.font = 'bold 88px "Noto Serif JP", serif';
    ctx.fillText('侘', 128, 160);
    ctx.fillText('寂', 128, 280);

    // Red artist Hanko seal
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(104, 340, 48, 48);
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.strokeRect(104, 340, 48, 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px serif';
    ctx.fillText('印', 128, 374);

    const calligTex = new THREE.CanvasTexture(canvas);
    const calligMat = new THREE.MeshStandardMaterial({
      map: calligTex,
      roughness: 0.92
    });
    const calligGeo = new THREE.PlaneGeometry(1.5, 4.0);
    const callig = new THREE.Mesh(calligGeo, calligMat);
    callig.position.z = 0.01;
    scrollGroup.add(callig);

    const rollerMat = new THREE.MeshStandardMaterial({ color: 0x22150e, roughness: 0.4 });
    const rollerGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 16);
    rollerGeo.rotateZ(Math.PI / 2);
    const roller = new THREE.Mesh(rollerGeo, rollerMat);
    roller.position.set(0, -2.7, 0.05);
    scrollGroup.add(roller);

    this.group.add(scrollGroup);
  }

  buildIncenseBurner() {
    const koroGroup = new THREE.Group();
    koroGroup.position.set(2.65, 0.26, 1.45);

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x584632,
      roughness: 0.4,
      metalness: 0.75
    });

    const bowlGeo = new THREE.SphereGeometry(0.22, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.72);
    const bowl = new THREE.Mesh(bowlGeo, bronzeMat);
    bowl.castShadow = true;
    koroGroup.add(bowl);

    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const footGeo = new THREE.CylinderGeometry(0.022, 0.016, 0.09, 8);
      const foot = new THREE.Mesh(footGeo, bronzeMat);
      foot.position.set(Math.cos(a) * 0.13, -0.045, Math.sin(a) * 0.13);
      koroGroup.add(foot);
    }

    const stickMat = new THREE.MeshBasicMaterial({ color: 0x3d271d });
    const stickGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.3, 6);
    const stick = new THREE.Mesh(stickGeo, stickMat);
    stick.position.set(0, 0.14, 0);
    stick.rotation.z = 0.16;
    koroGroup.add(stick);

    const emberMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const emberGeo = new THREE.SphereGeometry(0.012, 8, 8);
    const ember = new THREE.Mesh(emberGeo, emberMat);
    ember.position.set(-0.024, 0.28, 0);
    koroGroup.add(ember);

    this.group.add(koroGroup);
    this.incenseTipPos = new THREE.Vector3(2.63, 0.54, 1.45);
  }

  buildStoneLantern() {
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(5.0, 0, -3.2);

    const pbr = textureGen.getPineBarkPBR();
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x4f5254,
      normalMap: pbr.normalMap,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughness: 0.85,
      metalness: 0.05
    });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 0.38, 6), stoneMat);
    base.position.y = 0.19;
    lanternGroup.add(base);

    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 1.45, 6), stoneMat);
    col.position.y = 1.0;
    lanternGroup.add(col);

    const chudai = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.48, 0.26, 6), stoneMat);
    chudai.position.y = 1.82;
    lanternGroup.add(chudai);

    const hibukuro = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.58, 6, 1, true), stoneMat);
    hibukuro.position.y = 2.24;
    lanternGroup.add(hibukuro);

    const kasa = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.58, 6), stoneMat);
    kasa.position.y = 2.76;
    lanternGroup.add(kasa);

    const hoju = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), stoneMat);
    hoju.position.y = 3.18;
    lanternGroup.add(hoju);

    const lanternLight = new THREE.PointLight(0xff9933, 1.2, 6);
    lanternLight.position.set(0, 2.24, 0);
    lanternGroup.add(lanternLight);
    this.lights.lanternPoint = lanternLight;

    this.group.add(lanternGroup);
  }

  // Animated Shishi-Odoshi with Rocker Arm
  buildShishiOdoshi() {
    const bambooGroup = new THREE.Group();
    bambooGroup.position.set(-5.0, 0, -2.4);

    const bambooMat = new THREE.MeshStandardMaterial({
      color: 0x5e7c44,
      roughness: 0.55,
      metalness: 0.05
    });

    // Vertical support bamboo posts
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.3, 12);
    const postL = new THREE.Mesh(postGeo, bambooMat);
    postL.position.set(-0.25, 0.65, 0);
    const postR = new THREE.Mesh(postGeo, bambooMat);
    postR.position.set(0.25, 0.65, 0);
    bambooGroup.add(postL, postR);

    // Cross pivot pin
    const pinGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.65, 8);
    pinGeo.rotateZ(Math.PI / 2);
    const pin = new THREE.Mesh(pinGeo, bambooMat);
    pin.position.set(0, 0.85, 0);
    bambooGroup.add(pin);

    // Rocker bamboo tube (the tilting pipe that fills and clacks)
    this.shishiArm = new THREE.Group();
    this.shishiArm.position.set(0, 0.85, 0);

    const tubeGeo = new THREE.CylinderGeometry(0.065, 0.065, 1.2, 12);
    tubeGeo.rotateX(Math.PI / 2);
    const tubeMesh = new THREE.Mesh(tubeGeo, bambooMat);
    tubeMesh.position.set(0, 0, 0.15); // pivot off-center
    tubeMesh.castShadow = true;
    this.shishiArm.add(tubeMesh);

    bambooGroup.add(this.shishiArm);

    // Rock basin beneath (Цукубаи)
    const basinMat = new THREE.MeshStandardMaterial({
      color: 0x383c3e,
      roughness: 0.85
    });
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.48, 0.42, 18), basinMat);
    basin.position.set(0, 0.21, 0.45);
    bambooGroup.add(basin);

    // Water surface in basin with subtle physical ripples
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x227093,
      roughness: 0.04,
      metalness: 0.1,
      transmission: 0.82,
      ior: 1.33
    });
    this.waterMesh = new THREE.Mesh(new THREE.CircleGeometry(0.5, 24), waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.set(0, 0.4, 0.45);
    bambooGroup.add(this.waterMesh);

    this.group.add(bambooGroup);
  }

  // Volumetric Sunlight Shaft (Косые лучи света сквозь сёдзи)
  setupVolumetricLightBeam() {
    const beamGeo = new THREE.CylinderGeometry(0.4, 3.8, 12, 16, 1, true);
    beamGeo.rotateX(-Math.PI / 4);
    beamGeo.rotateY(Math.PI / 6);

    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffe8ba,
      transparent: true,
      opacity: 0.065,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.lightBeam = new THREE.Mesh(beamGeo, beamMat);
    this.lightBeam.position.set(1.5, 4.0, -1.0);
    this.group.add(this.lightBeam);
  }

  setupLighting() {
    this.lights.ambient = new THREE.AmbientLight(0xfff6ec, 0.85);
    this.scene.add(this.lights.ambient);

    this.lights.sun = new THREE.DirectionalLight(0xffeedd, 2.4);
    this.lights.sun.position.set(5.5, 9.5, 6.0);
    this.lights.sun.castShadow = true;
    this.lights.sun.shadow.mapSize.width = 2048;
    this.lights.sun.shadow.mapSize.height = 2048;
    this.lights.sun.shadow.camera.near = 0.5;
    this.lights.sun.shadow.camera.far = 26;
    this.lights.sun.shadow.camera.left = -5.8;
    this.lights.sun.shadow.camera.right = 5.8;
    this.lights.sun.shadow.camera.top = 7.2;
    this.lights.sun.shadow.camera.bottom = -1.6;
    this.lights.sun.shadow.bias = -0.0005;
    this.scene.add(this.lights.sun);

    this.lights.shoji = new THREE.DirectionalLight(0xffeccd, 1.4);
    this.lights.shoji.position.set(0, 5, -6.5);
    this.lights.shoji.target.position.set(0, 2, 0);
    this.scene.add(this.lights.shoji);
    this.scene.add(this.lights.shoji.target);

    this.lights.fill = new THREE.DirectionalLight(0xd4af37, 0.45);
    this.lights.fill.position.set(-4.5, 2.5, 4.5);
    this.scene.add(this.lights.fill);
  }

  setupParticleSystems() {
    // 1. Incense Smoke
    const smokeCount = 55;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);

    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = this.incenseTipPos.x;
      smokePositions[i * 3 + 1] = this.incenseTipPos.y + (i / smokeCount) * 2.0;
      smokePositions[i * 3 + 2] = this.incenseTipPos.z;
    }

    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xeeeeee,
      size: 0.14,
      transparent: true,
      opacity: 0.4,
      blending: THREE.NormalBlending
    });

    this.particles.smoke = new THREE.Points(smokeGeo, smokeMat);
    this.particles.smokeData = { positions: smokePositions };
    this.scene.add(this.particles.smoke);

    // 2. Floating Dust Motes
    const dustCount = 100;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 8.5;
      dustPos[i * 3 + 1] = 0.5 + Math.random() * 4.8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 6.5;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffe8a3,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.particles.dust = new THREE.Points(dustGeo, dustMat);
    this.particles.dustPos = dustPos;
    this.scene.add(this.particles.dust);

    // 3. Drifting Sakura / Autumn Petals
    const petalCount = 60;
    const petalGeo = new THREE.BufferGeometry();
    const petalPos = new Float32Array(petalCount * 3);
    const petalVel = [];

    for (let i = 0; i < petalCount; i++) {
      petalPos[i * 3] = (Math.random() - 0.5) * 11;
      petalPos[i * 3 + 1] = 2.0 + Math.random() * 5.5;
      petalPos[i * 3 + 2] = (Math.random() - 0.5) * 9;
      petalVel.push({
        x: (Math.random() - 0.5) * 0.018 - 0.012,
        y: -0.014 - Math.random() * 0.014,
        z: (Math.random() - 0.5) * 0.018
      });
    }

    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));
    const petalMat = new THREE.PointsMaterial({
      color: 0xffb7c5,
      size: 0.17,
      transparent: true,
      opacity: 0.88
    });

    this.particles.petals = new THREE.Points(petalGeo, petalMat);
    this.particles.petalData = {
      positions: petalPos,
      vel: petalVel,
      material: petalMat
    };
    this.scene.add(this.particles.petals);
  }

  // Update per frame
  update(delta, elapsed) {
    // 1. Shishi-Odoshi Physics Rocker Arm
    if (this.shishiArm) {
      this.shishiTimer += delta;

      if (this.shishiState === 'filling') {
        // Slowly fills over 12 seconds
        const progress = Math.min(1.0, this.shishiTimer / 12.0);
        this.shishiAngle = progress * 0.45;
        this.shishiArm.rotation.x = this.shishiAngle;

        if (progress >= 1.0) {
          this.shishiState = 'tipping';
          this.shishiTimer = 0;
        }
      } else if (this.shishiState === 'tipping') {
        // Tips down dumping water
        this.shishiAngle += delta * 2.2;
        this.shishiArm.rotation.x = this.shishiAngle;

        if (this.shishiAngle >= 0.75) {
          this.shishiState = 'snapping';
          this.shishiTimer = 0;
        }
      } else if (this.shishiState === 'snapping') {
        // Snaps back fast striking stone
        this.shishiAngle -= delta * 3.5;
        if (this.shishiAngle <= 0) {
          this.shishiAngle = 0;
          this.shishiState = 'filling';
          this.shishiTimer = 0;
        }
        this.shishiArm.rotation.x = this.shishiAngle;
      }
    }

    // 2. Water surface subtle ripple
    if (this.waterMesh) {
      this.waterMesh.scale.setScalar(1.0 + Math.sin(elapsed * 2.5) * 0.02);
    }

    // 3. Smoke simulation with turbulence
    if (this.particles.smoke) {
      const pos = this.particles.smokeData.positions;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += 0.013;
        const yRel = pos[i * 3 + 1] - this.incenseTipPos.y;
        pos[i * 3] = this.incenseTipPos.x + Math.sin(elapsed * 2.4 + yRel * 4.0) * (yRel * 0.09);
        pos[i * 3 + 2] = this.incenseTipPos.z + Math.cos(elapsed * 2.0 + yRel * 3.2) * (yRel * 0.07);

        if (pos[i * 3 + 1] > this.incenseTipPos.y + 2.4) {
          pos[i * 3 + 1] = this.incenseTipPos.y;
          pos[i * 3] = this.incenseTipPos.x;
          pos[i * 3 + 2] = this.incenseTipPos.z;
        }
      }
      this.particles.smoke.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Floating Dust Motes
    if (this.particles.dust) {
      const dPos = this.particles.dustPos;
      for (let i = 0; i < dPos.length / 3; i++) {
        dPos[i * 3] += Math.sin(elapsed * 0.9 + i) * 0.0022;
        dPos[i * 3 + 1] += Math.cos(elapsed * 0.7 + i * 2) * 0.0016;
        dPos[i * 3 + 2] += Math.sin(elapsed * 0.6 + i * 3) * 0.0022;
      }
      this.particles.dust.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Drifting Petals
    if (this.particles.petals && this.particles.petals.visible) {
      const pPos = this.particles.petalData.positions;
      const vels = this.particles.petalData.vel;
      for (let i = 0; i < pPos.length / 3; i++) {
        pPos[i * 3] += vels[i].x + Math.sin(elapsed * 2.2 + i) * 0.009;
        pPos[i * 3 + 1] += vels[i].y;
        pPos[i * 3 + 2] += vels[i].z + Math.cos(elapsed * 1.7 + i) * 0.009;

        if (pPos[i * 3 + 1] < 0.05) {
          pPos[i * 3 + 1] = 6.5 + Math.random() * 2.0;
          pPos[i * 3] = (Math.random() - 0.5) * 11;
          pPos[i * 3 + 2] = (Math.random() - 0.5) * 9;
        }
      }
      this.particles.petals.geometry.attributes.position.needsUpdate = true;
    }
  }

  setAtmosphere(preset) {
    this.currentAtmosphere = preset;

    switch (preset) {
      case 'morning': {
        this.scene.background = new THREE.Color(0xdce7e8);
        this.scene.fog = new THREE.FogExp2(0xdce7e8, 0.025);
        this.lights.ambient.color.setHex(0xe3eff0);
        this.lights.ambient.intensity = 1.15;
        this.lights.sun.color.setHex(0xfbfcfe);
        this.lights.sun.intensity = 1.7;
        this.lights.sun.position.set(4, 8, 4);
        this.lights.shoji.color.setHex(0xd8e6ea);
        this.lights.shoji.intensity = 1.25;
        this.lights.fill.color.setHex(0xaec9d4);
        this.lights.lanternPoint.intensity = 0.2;
        if (this.lightBeam) this.lightBeam.material.opacity = 0.035;
        if (this.particles.petals) this.particles.petals.visible = false;
        break;
      }

      case 'golden': {
        this.scene.background = new THREE.Color(0x2d1f17);
        this.scene.fog = new THREE.FogExp2(0x2d1f17, 0.018);
        this.lights.ambient.color.setHex(0xffebd2);
        this.lights.ambient.intensity = 0.8;
        this.lights.sun.color.setHex(0xffaa55);
        this.lights.sun.intensity = 2.9;
        this.lights.sun.position.set(6, 7.5, 4.5);
        this.lights.shoji.color.setHex(0xff9944);
        this.lights.shoji.intensity = 1.9;
        this.lights.fill.color.setHex(0xd48837);
        this.lights.lanternPoint.intensity = 1.1;
        if (this.lightBeam) this.lightBeam.material.opacity = 0.085;
        if (this.particles.petals) {
          this.particles.petals.visible = true;
          this.particles.petalData.material.color.setHex(0xe67e22);
        }
        break;
      }

      case 'moonlit': {
        this.scene.background = new THREE.Color(0x0a0c16);
        this.scene.fog = new THREE.FogExp2(0x0a0c16, 0.022);
        this.lights.ambient.color.setHex(0x1a243a);
        this.lights.ambient.intensity = 0.52;
        this.lights.sun.color.setHex(0x6080b0);
        this.lights.sun.intensity = 0.85;
        this.lights.sun.position.set(-4, 9, 3);
        this.lights.shoji.color.setHex(0x182038);
        this.lights.shoji.intensity = 0.35;
        this.lights.fill.color.setHex(0xff9933);
        this.lights.lanternPoint.intensity = 2.6;
        if (this.lightBeam) this.lightBeam.material.opacity = 0.02;
        if (this.particles.petals) this.particles.petals.visible = false;
        break;
      }

      case 'sakura':
      default: {
        this.scene.background = new THREE.Color(0xf6e8eb);
        this.scene.fog = new THREE.FogExp2(0xf6e8eb, 0.015);
        this.lights.ambient.color.setHex(0xfff2f5);
        this.lights.ambient.intensity = 1.05;
        this.lights.sun.color.setHex(0xfff5ee);
        this.lights.sun.intensity = 2.2;
        this.lights.sun.position.set(5, 9, 5);
        this.lights.shoji.color.setHex(0xffe4e8);
        this.lights.shoji.intensity = 1.45;
        this.lights.fill.color.setHex(0xffccd5);
        this.lights.lanternPoint.intensity = 0.35;
        if (this.lightBeam) this.lightBeam.material.opacity = 0.055;
        if (this.particles.petals) {
          this.particles.petals.visible = true;
          this.particles.petalData.material.color.setHex(0xffb7c5);
        }
        break;
      }
    }
  }
}
