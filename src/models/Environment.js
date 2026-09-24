// Environment.js - Authentic Japanese Tokonoma & Garden Environment with Dynamic Lighting
import * as THREE from 'three';
import { textureGen } from '../textures/TextureGenerator.js';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.currentAtmosphere = 'golden'; // morning, golden, moonlit, sakura
    this.lights = {};
    this.particles = {};

    this.buildArchitecture();
    this.setupLighting();
    this.setupParticleSystems();
    this.setAtmosphere('golden');
  }

  buildArchitecture() {
    // 1. Tatami Mat Flooring (Татами)
    const tatamiTex = textureGen.getTatamiTexture();
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      map: tatamiTex,
      roughness: 0.85,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.group.add(floor);

    // 2. Bonsai Display Table / Stand (Сёку / Shoku)
    // Traditional dark polished cedar stand with curved legs
    const tableMat = new THREE.MeshStandardMaterial({
      map: textureGen.getLacqueredWoodTexture(),
      roughness: 0.28,
      metalness: 0.12,
      color: 0x2a1a12
    });

    const tableTopGeo = new THREE.BoxGeometry(6.6, 0.18, 4.4);
    const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
    tableTop.position.set(0, 0.15, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    this.group.add(tableTop);

    // 4 legs for display stand
    const legGeo = new THREE.BoxGeometry(0.35, 0.15, 0.35);
    const legCoords = [
      [2.8, 0.075, 1.8],
      [-2.8, 0.075, 1.8],
      [2.8, 0.075, -1.8],
      [-2.8, 0.075, -1.8]
    ];
    legCoords.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, tableMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      this.group.add(leg);
    });

    // 3. Shoji Sliding Screen Partition (Сёдзи)
    const shojiGroup = new THREE.Group();
    shojiGroup.position.set(0, 0, -4.5);

    // Translucent paper back panels
    const paperMat = new THREE.MeshStandardMaterial({
      map: textureGen.getShojiPaperTexture(),
      roughness: 0.9,
      color: 0xfffcf5,
      side: THREE.DoubleSide
    });
    const paperGeo = new THREE.PlaneGeometry(16, 9);
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    paperMesh.position.set(0, 4.5, 0);
    paperMesh.receiveShadow = true;
    shojiGroup.add(paperMesh);

    // Wooden Kumiko Lattice Frame
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x3d2719,
      roughness: 0.7
    });

    // Outer frame
    const frameGeoH = new THREE.BoxGeometry(16.2, 0.25, 0.12);
    const topFrame = new THREE.Mesh(frameGeoH, woodMat);
    topFrame.position.set(0, 9, 0.02);
    const btmFrame = new THREE.Mesh(frameGeoH, woodMat);
    btmFrame.position.set(0, 0, 0.02);
    shojiGroup.add(topFrame, btmFrame);

    // Vertical lattice bars
    for (let x = -8; x <= 8; x += 1.6) {
      const barGeo = new THREE.BoxGeometry(0.12, 9, 0.08);
      const bar = new THREE.Mesh(barGeo, woodMat);
      bar.position.set(x, 4.5, 0.02);
      bar.castShadow = true;
      shojiGroup.add(bar);
    }
    // Horizontal lattice bars
    for (let y = 0.9; y < 9; y += 0.9) {
      const barGeo = new THREE.BoxGeometry(16, 0.08, 0.08);
      const bar = new THREE.Mesh(barGeo, woodMat);
      bar.position.set(0, y, 0.02);
      bar.castShadow = true;
      shojiGroup.add(bar);
    }

    this.group.add(shojiGroup);

    // 4. Hanging Calligraphy Scroll (Какэмоно / Kakemono)
    this.buildKakemono();

    // 5. Traditional Japanese Incense Burner (Коро / Kōro)
    this.buildIncenseBurner();

    // 6. Japanese Stone Lantern (Торо / Tōrō) in background
    this.buildStoneLantern();

    // 7. Bamboo Water Spout (Сиси-одоси / Shishi-odoshi)
    this.buildShishiOdoshi();
  }

  // Hanging Calligraphy Scroll (Какэмоно)
  buildKakemono() {
    const scrollGroup = new THREE.Group();
    scrollGroup.position.set(-4.5, 4.2, -4.35);

    // Silk mounting borders (Хёгу)
    const silkMat = new THREE.MeshStandardMaterial({
      color: 0x826d5c,
      roughness: 0.8
    });
    const silkGeo = new THREE.PlaneGeometry(1.8, 5.2);
    const silk = new THREE.Mesh(silkGeo, silkMat);
    scrollGroup.add(silk);

    // Inner washi paper with Calligraphy "侘寂" (Wabi-Sabi)
    const { canvas, ctx } = textureGen.createCanvas(256, 512);
    ctx.fillStyle = '#faf6ed';
    ctx.fillRect(0, 0, 256, 512);

    // Draw ink wash calligraphy strokes
    ctx.fillStyle = '#1c1b18';
    ctx.textAlign = 'center';

    // Character 1: 侘 (Wabi)
    ctx.font = 'bold 85px serif';
    ctx.fillText('侘', 128, 160);

    // Character 2: 寂 (Sabi)
    ctx.fillText('寂', 128, 280);

    // Red artist seal stamp (Ханко / Hanko)
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
      roughness: 0.9
    });
    const calligGeo = new THREE.PlaneGeometry(1.4, 3.8);
    const callig = new THREE.Mesh(calligGeo, calligMat);
    callig.position.z = 0.01;
    scrollGroup.add(callig);

    // Wooden hanging roller bar at bottom
    const rollerMat = new THREE.MeshStandardMaterial({ color: 0x241810 });
    const rollerGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.1, 16);
    rollerGeo.rotateZ(Math.PI / 2);
    const roller = new THREE.Mesh(rollerGeo, rollerMat);
    roller.position.set(0, -2.6, 0.05);
    scrollGroup.add(roller);

    this.group.add(scrollGroup);
  }

  // Incense burner with rising smoke
  buildIncenseBurner() {
    const koroGroup = new THREE.Group();
    koroGroup.position.set(2.6, 0.25, 1.4);

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x5a4a35,
      roughness: 0.45,
      metalness: 0.7
    });

    // Bowl
    const bowlGeo = new THREE.SphereGeometry(0.2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const bowl = new THREE.Mesh(bowlGeo, bronzeMat);
    bowl.castShadow = true;
    koroGroup.add(bowl);

    // 3 small feet
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const footGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.08, 8);
      const foot = new THREE.Mesh(footGeo, bronzeMat);
      foot.position.set(Math.cos(a) * 0.12, -0.04, Math.sin(a) * 0.12);
      koroGroup.add(foot);
    }

    // Incense stick
    const stickMat = new THREE.MeshBasicMaterial({ color: 0x3d271d });
    const stickGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.28, 6);
    const stick = new THREE.Mesh(stickGeo, stickMat);
    stick.position.set(0, 0.12, 0);
    stick.rotation.z = 0.15;
    koroGroup.add(stick);

    // Glowing red ember tip
    const emberMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const emberGeo = new THREE.SphereGeometry(0.01, 8, 8);
    const ember = new THREE.Mesh(emberGeo, emberMat);
    ember.position.set(-0.02, 0.26, 0);
    koroGroup.add(ember);

    this.group.add(koroGroup);
    this.incenseTipPos = new THREE.Vector3(2.58, 0.51, 1.4);
  }

  // Traditional Japanese Stone Lantern (Торо)
  buildStoneLantern() {
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(4.8, 0, -3.2);

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x55585a,
      roughness: 0.9,
      metalness: 0.05
    });

    // Base pedestal
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.35, 6), stoneMat);
    base.position.y = 0.175;
    lanternGroup.add(base);

    // Column
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 1.4, 6), stoneMat);
    col.position.y = 0.95;
    lanternGroup.add(col);

    // Middle platform (Chudai)
    const chudai = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.45, 0.25, 6), stoneMat);
    chudai.position.y = 1.75;
    lanternGroup.add(chudai);

    // Light chamber (Hibukuro) with openings
    const hibukuro = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.55, 6, 1, true), stoneMat);
    hibukuro.position.y = 2.15;
    lanternGroup.add(hibukuro);

    // Roof (Kasa) with curved flared corners
    const kasa = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.55, 6), stoneMat);
    kasa.position.y = 2.65;
    lanternGroup.add(kasa);

    // Top jewel finial (Hoju)
    const hoju = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), stoneMat);
    hoju.position.y = 3.05;
    lanternGroup.add(hoju);

    // Inner warm light bulb inside the stone lantern
    const lanternLight = new THREE.PointLight(0xffaa44, 0.9, 5);
    lanternLight.position.set(0, 2.15, 0);
    lanternGroup.add(lanternLight);
    this.lights.lanternPoint = lanternLight;

    this.group.add(lanternGroup);
  }

  // Bamboo water spout (Сиси-одоси)
  buildShishiOdoshi() {
    const bambooGroup = new THREE.Group();
    bambooGroup.position.set(-4.8, 0, -2.5);

    const bambooMat = new THREE.MeshStandardMaterial({
      color: 0x5a7841,
      roughness: 0.6,
      metalness: 0.05
    });

    // Vertical support bamboo posts
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12);
    const postL = new THREE.Mesh(postGeo, bambooMat);
    postL.position.set(-0.25, 0.6, 0);
    const postR = new THREE.Mesh(postGeo, bambooMat);
    postR.position.set(0.25, 0.6, 0);
    bambooGroup.add(postL, postR);

    // Rock basin beneath (Цукубаи / Tsukubai)
    const basinMat = new THREE.MeshStandardMaterial({
      color: 0x3d4144,
      roughness: 0.8
    });
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.4, 16), basinMat);
    basin.position.set(0, 0.2, 0.4);
    bambooGroup.add(basin);

    // Water inside basin
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x2980b9,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.33
    });
    const water = new THREE.Mesh(new THREE.CircleGeometry(0.48, 16), waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 0.38, 0.4);
    bambooGroup.add(water);

    this.group.add(bambooGroup);
  }

  setupLighting() {
    // 1. Ambient Light (Soft diffused foundation)
    this.lights.ambient = new THREE.AmbientLight(0xfff5ea, 0.8);
    this.scene.add(this.lights.ambient);

    // 2. Main Directional Sun / Window Light (Casting crisp soft shadows)
    this.lights.sun = new THREE.DirectionalLight(0xffeedd, 2.2);
    this.lights.sun.position.set(5.5, 9.5, 6.0);
    this.lights.sun.castShadow = true;
    this.lights.sun.shadow.mapSize.width = 2048;
    this.lights.sun.shadow.mapSize.height = 2048;
    this.lights.sun.shadow.camera.near = 0.5;
    this.lights.sun.shadow.camera.far = 25;
    this.lights.sun.shadow.camera.left = -5.5;
    this.lights.sun.shadow.camera.right = 5.5;
    this.lights.sun.shadow.camera.top = 7.0;
    this.lights.sun.shadow.camera.bottom = -1.5;
    this.lights.sun.shadow.bias = -0.0006;
    this.scene.add(this.lights.sun);

    // 3. Shoji Backfill Light (Simulating light pouring through the sliding screen)
    this.lights.shoji = new THREE.DirectionalLight(0xffecd2, 1.2);
    this.lights.shoji.position.set(0, 5, -6);
    this.lights.shoji.target.position.set(0, 2, 0);
    this.scene.add(this.lights.shoji);
    this.scene.add(this.lights.shoji.target);

    // 4. Subtle Fill Light (Warm under-bounce from tatami)
    this.lights.fill = new THREE.DirectionalLight(0xd4af37, 0.4);
    this.lights.fill.position.set(-4, 2, 4);
    this.scene.add(this.lights.fill);
  }

  // Particle systems: Incense smoke, dust motes, falling sakura/autumn leaves
  setupParticleSystems() {
    // A. Incense Smoke Particles
    const smokeCount = 45;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    const smokeOpacities = new Float32Array(smokeCount);

    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = this.incenseTipPos.x;
      smokePositions[i * 3 + 1] = this.incenseTipPos.y + (i / smokeCount) * 1.8;
      smokePositions[i * 3 + 2] = this.incenseTipPos.z;
      smokeOpacities[i] = (1 - i / smokeCount) * 0.4;
    }

    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));

    const smokeMat = new THREE.PointsMaterial({
      color: 0xdddddd,
      size: 0.12,
      transparent: true,
      opacity: 0.35,
      blending: THREE.NormalBlending
    });

    this.particles.smoke = new THREE.Points(smokeGeo, smokeMat);
    this.particles.smokeData = {
      positions: smokePositions,
      tip: this.incenseTipPos
    };
    this.scene.add(this.particles.smoke);

    // B. Floating Dust Motes (Золотистые пылинки в лучах солнца)
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 1] = 0.5 + Math.random() * 4.5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffe6a3,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    this.particles.dust = new THREE.Points(dustGeo, dustMat);
    this.particles.dustPos = dustPos;
    this.scene.add(this.particles.dust);

    // C. Drifting Sakura / Autumn Petals
    const petalCount = 50;
    const petalGeo = new THREE.BufferGeometry();
    const petalPos = new Float32Array(petalCount * 3);
    const petalVel = [];

    for (let i = 0; i < petalCount; i++) {
      petalPos[i * 3] = (Math.random() - 0.5) * 10;
      petalPos[i * 3 + 1] = 2.0 + Math.random() * 5.0;
      petalPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      petalVel.push({
        x: (Math.random() - 0.5) * 0.015 - 0.01,
        y: -0.012 - Math.random() * 0.012,
        z: (Math.random() - 0.5) * 0.015,
        rot: Math.random() * 0.05
      });
    }

    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));

    const petalMat = new THREE.PointsMaterial({
      color: 0xffb7c5, // Sakura blush pink
      size: 0.16,
      transparent: true,
      opacity: 0.85
    });

    this.particles.petals = new THREE.Points(petalGeo, petalMat);
    this.particles.petalData = {
      positions: petalPos,
      vel: petalVel,
      material: petalMat
    };
    this.scene.add(this.particles.petals);
  }

  // Update particles per frame
  update(delta, elapsed) {
    // 1. Incense smoke curling upwards
    if (this.particles.smoke) {
      const pos = this.particles.smokeData.positions;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        // Rise
        pos[i * 3 + 1] += 0.012;
        // Natural S-curl sway
        const yRel = pos[i * 3 + 1] - this.incenseTipPos.y;
        pos[i * 3] = this.incenseTipPos.x + Math.sin(elapsed * 2.2 + yRel * 3.5) * (yRel * 0.08);
        pos[i * 3 + 2] = this.incenseTipPos.z + Math.cos(elapsed * 1.8 + yRel * 3.0) * (yRel * 0.06);

        // Reset if too high
        if (pos[i * 3 + 1] > this.incenseTipPos.y + 2.2) {
          pos[i * 3 + 1] = this.incenseTipPos.y;
          pos[i * 3] = this.incenseTipPos.x;
          pos[i * 3 + 2] = this.incenseTipPos.z;
        }
      }
      this.particles.smoke.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Golden dust motes dancing
    if (this.particles.dust) {
      const dPos = this.particles.dustPos;
      for (let i = 0; i < dPos.length / 3; i++) {
        dPos[i * 3] += Math.sin(elapsed * 0.8 + i) * 0.002;
        dPos[i * 3 + 1] += Math.cos(elapsed * 0.6 + i * 2) * 0.0015;
        dPos[i * 3 + 2] += Math.sin(elapsed * 0.5 + i * 3) * 0.002;
      }
      this.particles.dust.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Petals gently falling
    if (this.particles.petals && this.particles.petals.visible) {
      const pPos = this.particles.petalData.positions;
      const vels = this.particles.petalData.vel;
      for (let i = 0; i < pPos.length / 3; i++) {
        pPos[i * 3] += vels[i].x + Math.sin(elapsed * 2.0 + i) * 0.008;
        pPos[i * 3 + 1] += vels[i].y;
        pPos[i * 3 + 2] += vels[i].z + Math.cos(elapsed * 1.5 + i) * 0.008;

        // Ground collision reset
        if (pPos[i * 3 + 1] < 0.05) {
          pPos[i * 3 + 1] = 6.0 + Math.random() * 2.0;
          pPos[i * 3] = (Math.random() - 0.5) * 10;
          pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
      }
      this.particles.petals.geometry.attributes.position.needsUpdate = true;
    }
  }

  // Switch dynamic Japanese lighting & atmosphere presets
  setAtmosphere(preset) {
    this.currentAtmosphere = preset;

    switch (preset) {
      case 'morning': {
        // Asamoya (Утренний туман): Soft diffused cool morning daylight
        this.scene.background = new THREE.Color(0xdce7e8);
        this.scene.fog = new THREE.FogExp2(0xdce7e8, 0.025);
        this.lights.ambient.color.setHex(0xe3eff0);
        this.lights.ambient.intensity = 1.1;
        this.lights.sun.color.setHex(0xfbfcfe);
        this.lights.sun.intensity = 1.6;
        this.lights.sun.position.set(4, 8, 4);
        this.lights.shoji.color.setHex(0xd8e6ea);
        this.lights.shoji.intensity = 1.2;
        this.lights.fill.color.setHex(0xaec9d4);
        this.lights.lanternPoint.intensity = 0.2;
        if (this.particles.petals) this.particles.petals.visible = false;
        break;
      }

      case 'golden': {
        // Yūgure (Золотой закат): Warm amber sunlight streaming through shoji
        this.scene.background = new THREE.Color(0x2d1f17);
        this.scene.fog = new THREE.FogExp2(0x2d1f17, 0.018);
        this.lights.ambient.color.setHex(0xffebd2);
        this.lights.ambient.intensity = 0.75;
        this.lights.sun.color.setHex(0xffaa55);
        this.lights.sun.intensity = 2.8;
        this.lights.sun.position.set(6, 7.5, 4.5);
        this.lights.shoji.color.setHex(0xff9944);
        this.lights.shoji.intensity = 1.8;
        this.lights.fill.color.setHex(0xd48837);
        this.lights.lanternPoint.intensity = 1.0;
        if (this.particles.petals) {
          this.particles.petals.visible = true;
          this.particles.petalData.material.color.setHex(0xe67e22); // Autumn gold/orange
        }
        break;
      }

      case 'moonlit': {
        // Tsukiyo (Лунная ночь): Deep indigo moonlit night with warm lantern glow
        this.scene.background = new THREE.Color(0x0a0c16);
        this.scene.fog = new THREE.FogExp2(0x0a0c16, 0.022);
        this.lights.ambient.color.setHex(0x1a243a);
        this.lights.ambient.intensity = 0.5;
        this.lights.sun.color.setHex(0x6080b0); // Cool moonlight
        this.lights.sun.intensity = 0.8;
        this.lights.sun.position.set(-4, 9, 3);
        this.lights.shoji.color.setHex(0x182038);
        this.lights.shoji.intensity = 0.3;
        this.lights.fill.color.setHex(0xff9933);
        this.lights.lanternPoint.intensity = 2.4; // Bright warm lantern
        if (this.particles.petals) this.particles.petals.visible = false;
        break;
      }

      case 'sakura':
      default: {
        // Haru (Цветущая весна): Crisp bright spring day with falling pink petals
        this.scene.background = new THREE.Color(0xf6e8eb);
        this.scene.fog = new THREE.FogExp2(0xf6e8eb, 0.015);
        this.lights.ambient.color.setHex(0xfff2f5);
        this.lights.ambient.intensity = 1.0;
        this.lights.sun.color.setHex(0xfff5ee);
        this.lights.sun.intensity = 2.1;
        this.lights.sun.position.set(5, 9, 5);
        this.lights.shoji.color.setHex(0xffe4e8);
        this.lights.shoji.intensity = 1.4;
        this.lights.fill.color.setHex(0xffccd5);
        this.lights.lanternPoint.intensity = 0.3;
        if (this.particles.petals) {
          this.particles.petals.visible = true;
          this.particles.petalData.material.color.setHex(0xffb7c5); // Blush pink
        }
        break;
      }
    }
  }
}
