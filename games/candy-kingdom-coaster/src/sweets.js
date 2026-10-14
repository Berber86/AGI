// Sweets to collect: candies (10), stars (25), cupcakes (+1 boost). One-time pickup per ride.
import * as THREE from 'three';
import { TUNING } from './config.js';
import { BillboardBatch } from './billboards.js';

const CANDY_COLORS = ['#ff5fa2', '#56c8ff', '#ffd45e', '#8ef07e', '#b18aff', '#ff8a5c'];

// ---------------------------------------------------------------------------
// Rendering: every pickup used to be its own little scene graph (a candy was 4
// meshes + a glow sprite with 3 fresh materials) — ~650 objects and up to 500
// draw calls for the sweets alone. Now each PART is one InstancedMesh shared
// by all pickups of that kind; a pickup is an empty proxy Object3D (same API:
// position/rotation/scale/visible) and sync() copies proxy * part-local into
// the instance matrices. Same geometry, same materials, same look.
// ---------------------------------------------------------------------------

// emissive follows the per-instance tint (the candy glowed in its own colour)
function tintEmissive(mat) {
  mat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace(
      'vec3 totalEmissiveRadiance = emissive;',
      'vec3 totalEmissiveRadiance = emissive * vColor.rgb;');
  };
  mat.customProgramCacheKey = () => 'tintEmissive';
  return mat;
}

const M4 = (pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1]) => new THREE.Matrix4().compose(
  new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(...scale));

function starGeometry() {
  const shape = new THREE.Shape();
  const R = 0.85, r = 0.38;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 ? r : R;
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.07, bevelSegments: 2 });
  geo.center();
  return geo;
}

// part = { geo, mat, local: [Matrix4...] (one instance per entry), tint: bool }
function partsFor() {
  const white = new THREE.Color('#ffffff');
  const candyBall = tintEmissive(new THREE.MeshPhysicalMaterial({ color: white, roughness: 0.25, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.2, emissive: white, emissiveIntensity: 0.18 }));
  const creamMat = new THREE.MeshPhysicalMaterial({ color: '#ffd6e8', roughness: 0.35, clearcoat: 0.8, emissive: '#ff9ecd', emissiveIntensity: 0.16 });
  return {
    candy: [
      { geo: new THREE.SphereGeometry(0.55, 16, 12), mat: candyBall, local: [M4()], tint: true },
      { geo: new THREE.TorusGeometry(0.56, 0.1, 8, 20), mat: new THREE.MeshStandardMaterial({ color: '#fff2f7', roughness: 0.35 }), local: [M4([0, 0, 0], [Math.PI / 2, 0, 0])] },
      // wrapper twists — reads as a wrapped sweet at speed, like the reference
      { geo: new THREE.ConeGeometry(0.36, 0.46, 4), mat: new THREE.MeshStandardMaterial({ color: white, roughness: 0.3, side: THREE.DoubleSide }),
        local: [-1, 1].map((sd) => M4([sd * 0.6, 0, 0], [0, 0, sd * Math.PI / 2], [1, 1, 0.45])), tint: true },
    ],
    star: [
      { geo: starGeometry(), mat: new THREE.MeshPhysicalMaterial({ color: '#ffd45e', roughness: 0.22, metalness: 0.55, clearcoat: 1, emissive: '#ff9c2e', emissiveIntensity: 0.5 }), local: [M4()] },
    ],
    cupcake: [
      { geo: new THREE.CylinderGeometry(0.42, 0.3, 0.5, 14), mat: new THREE.MeshStandardMaterial({ color: '#e8945a', roughness: 0.6 }), local: [M4([0, 0.25, 0])] },
      { geo: new THREE.SphereGeometry(0.48, 14, 12), mat: creamMat, local: [M4([0, 0.72, 0], [0, 0, 0], [1, 0.85, 1]), M4([0, 1.02, 0], [0, 0, 0], [0.62, 0.62, 0.62])] },
      { geo: new THREE.SphereGeometry(0.16, 10, 8), mat: new THREE.MeshPhysicalMaterial({ color: '#ff3b5c', roughness: 0.2, clearcoat: 1, emissive: '#a3122e', emissiveIntensity: 0.4 }), local: [M4([0, 1.34, 0])] },
    ],
  };
}

function glowSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grd.addColorStop(0, 'rgba(255,255,255,0.9)');
  grd.addColorStop(0.4, 'rgba(255,220,240,0.45)');
  grd.addColorStop(1, 'rgba(255,180,220,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const GLOW = glowSprite();
// Pickup bursts / finish fireworks: brightness > 1 gives each mote a hot,
// hue-preserving core through the billboard roll-off (see billboards.js).
const BURST_HOT = 1.35;

export class Burst {
  constructor(scene, count = 64) {
    this.batch = new BillboardBatch(scene, GLOW, count, 'burst');
    this.items = [];
    for (let i = 0; i < count; i++) {
      this.items.push({ pos: new THREE.Vector3(), size: 1, color: new THREE.Color('#ffd6e8'), life: 0, vel: new THREE.Vector3() });
    }
    this.dirty = false;
  }
  spawn(pos, color = '#ffd6e8', n = 12, power = 4.2) {
    let used = 0;
    for (const it of this.items) {
      if (used >= n) break;
      if (it.life > 0) continue;
      used++;
      it.life = 1;
      it.pos.copy(pos);
      it.color.set(color);
      it.size = 0.42 + Math.random() * 0.5;
      it.vel.set((Math.random() - 0.5) * power, Math.random() * power * 0.9 + 1, (Math.random() - 0.5) * power);
    }
  }
  update(dt) {
    let any = false;
    this.items.forEach((it, i) => {
      if (it.life <= 0) return;
      any = true;
      it.life -= dt * 1.7;
      if (it.life <= 0) { this.batch.hide(i); return; }
      it.pos.addScaledVector(it.vel, dt);
      it.vel.y -= 8.5 * dt;
      this.batch.set(i, it.pos, it.size, it.color, BURST_HOT * Math.max(0, it.life));
    });
    if (any || this.dirty) this.batch.commit();
    this.dirty = any;
  }
}

export function createSweets(scene, track, ramps = null) {
  const group = new THREE.Group();
  group.name = 'sweets';
  scene.add(group);
  const burst = new Burst(scene);
  const list = [];
  const L = track.length;
  const PARTS = partsFor();

  let idx = 0;
  for (let s = 14; s < L - 22; s += 13.5) {
    const pattern = idx % 5;
    let lateral = Math.sin(idx * 0.9) * 3.15;
    let type = 'candy';
    if (pattern === 2) type = 'star';
    if (pattern === 4 && idx % 10 === 4) type = 'cupcake';
    if (idx % 3 === 0 && pattern === 0) {
      // a little arc of 4 candies across the road
      for (let k = 0; k < 4; k++) {
        const lat = -3 + k * 2;
        addSweet(s + k * 2.6, lat, 'candy', idx * 4 + k);
      }
    } else {
      addSweet(s, lateral, type, idx);
    }
    idx++;
  }

  function addSweet(s, lateral, type, seed) {
    const pose = track.getPose(s, lateral);
    const mesh = new THREE.Object3D(); // proxy: transform + visibility of the pickup
    mesh.name = 'sweet-' + type;
    mesh.position.copy(pose.pos).add(new THREE.Vector3(0, type === 'cupcake' ? 1.35 : 1.55, 0));
    // pickups over a jump ramp ride on its surface instead of hiding inside it
    if (ramps) {
      const rs = ramps.sample(s, lateral);
      if (rs.ramp && rs.inside) mesh.position.y += rs.h;
    }
    const baseScale = type === 'candy' ? 1.3 : 1.18;
    mesh.scale.setScalar(baseScale);
    mesh.userData.noCollide = true; // pickups float over the road on purpose
    group.add(mesh);
    const tint = type === 'candy' ? new THREE.Color(CANDY_COLORS[seed % CANDY_COLORS.length]) : null;
    const glowColor = new THREE.Color(type === 'star' ? '#ffe9a8' : type === 'cupcake' ? '#ffc6e2' : '#ffffff')
      .multiplyScalar(type === 'candy' ? 0.42 : 0.68);
    list.push({
      mesh, type, s, lateral, tint, glowColor, baseScale,
      glowSize: type === 'candy' ? 2.3 : 3.2,
      baseY: mesh.position.y,
      hover: mesh.position.y - pose.pos.y, // height above the road (ramp included)
      phase: (seed * 0.63) % (Math.PI * 2),
      collected: false,
    });
  }

  // ---- instanced renderers -------------------------------------------------
  const ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
  const tmpM = new THREE.Matrix4();
  const renderers = []; // { im, items, local }
  for (const [type, parts] of Object.entries(PARTS)) {
    const items = list.filter((it) => it.type === type);
    if (!items.length) continue;
    for (const part of parts) {
      const im = new THREE.InstancedMesh(part.geo, part.mat, items.length * part.local.length);
      im.name = 'sweets-' + type;
      im.frustumCulled = false; // spread along the whole course; vertex cost is tiny
      im.userData.noCollide = true;
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      if (part.tint) {
        let k = 0;
        for (const it of items) for (let j = 0; j < part.local.length; j++) im.setColorAt(k++, it.tint);
        im.instanceColor.needsUpdate = true;
      }
      group.add(im);
      renderers.push({ im, items, local: part.local });
    }
  }
  const glow = new BillboardBatch(group, GLOW, list.length, 'sweets-glow');

  function sync() {
    for (const it of list) it.mesh.updateMatrix(); // group sits at the origin
    for (const r of renderers) {
      let k = 0;
      for (const it of r.items) {
        for (const lm of r.local) {
          r.im.setMatrixAt(k++, it.mesh.visible ? tmpM.multiplyMatrices(it.mesh.matrix, lm) : ZERO);
        }
      }
      r.im.instanceMatrix.needsUpdate = true;
    }
    list.forEach((it, i) => {
      if (!it.mesh.visible) glow.hide(i);
      else glow.set(i, it.mesh.position, it.glowSize * it.mesh.scale.x, it.glowColor);
    });
    glow.commit();
  }
  sync();

  function reset() {
    for (const it of list) {
      it.collected = false;
      it.mesh.visible = true;
      it.mesh.scale.setScalar(it.baseScale);
    }
    sync();
  }

  const collectedEvents = [];

  function update(dt, carS, carX, time, carAir = 0) {
    collectedEvents.length = 0;
    for (const it of list) {
      if (it.collected) continue;
      const bob = Math.sin(time * 2.1 + it.phase) * 0.26;
      it.mesh.position.y = it.baseY + bob;
      it.mesh.rotation.y += dt * (it.type === 'star' ? 1.6 : 2.4);
      if (it.type === 'star') it.mesh.rotation.z = Math.sin(time * 1.5 + it.phase) * 0.25;

      const ds = Math.abs(it.s - carS);
      if (ds > 6) continue;
      // distance check in world space happens via car position passed as (s, lateral)
      const lateralDiff = Math.abs(it.lateral - carX);
      // a car flying well above the pickups does not scoop them up
      const dy = Math.abs(carAir - it.hover);
      if (ds < 3.6 && lateralDiff < TUNING.collectRadius && dy < 2.4) {
        it.collected = true;
        it.mesh.visible = false;
        burst.spawn(it.mesh.position, it.type === 'star' ? '#ffe9a8' : it.type === 'cupcake' ? '#ffc6e2' : '#ff9ed2', it.type === 'candy' ? 8 : 14, it.type === 'candy' ? 3.6 : 5.2);
        collectedEvents.push({ type: it.type, points: it.type === 'star' ? 25 : it.type === 'cupcake' ? 15 : 10, worldPos: it.mesh.position.clone() });
      }
    }
    sync();
    burst.update(dt);
    return collectedEvents;
  }

  function collectAllDemo() {
    // used only by automated visual tests
    for (const it of list) { it.collected = true; it.mesh.visible = false; }
    sync();
  }

  return {
    group, list, update, reset, collectAllDemo,
    get collected() { return list.filter((x) => x.collected).length; },
    get total() { return list.length; },
  };
}
