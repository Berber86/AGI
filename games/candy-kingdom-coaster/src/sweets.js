// Sweets to collect: candies (10), stars (25), cupcakes (+1 boost). One-time pickup per ride.
import * as THREE from 'three';
import { TUNING } from './config.js';

const CANDY_COLORS = ['#ff5fa2', '#56c8ff', '#ffd45e', '#8ef07e', '#b18aff', '#ff8a5c'];

function candyMesh(color) {
  const g = new THREE.Group();
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 12),
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.2, emissive: new THREE.Color(color), emissiveIntensity: 0.18 })
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.1, 8, 20),
    new THREE.MeshStandardMaterial({ color: '#fff2f7', roughness: 0.35 })
  );
  ring.rotation.x = Math.PI / 2;
  // wrapper twists — reads as a wrapped sweet at speed, like the reference
  const twistMat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, side: THREE.DoubleSide });
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.46, 4), twistMat);
    w.position.set(s * 0.6, 0, 0);
    w.rotation.z = s * Math.PI / 2;
    w.scale.set(1, 1, 0.45);
    g.add(w);
  }
  g.add(ball, ring);
  return g;
}

function starMesh() {
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
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({
    color: '#ffd45e', roughness: 0.22, metalness: 0.55, clearcoat: 1,
    emissive: '#ff9c2e', emissiveIntensity: 0.5,
  }));
  return new THREE.Group().add(m);
}

function cupcakeMesh() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.3, 0.5, 14),
    new THREE.MeshStandardMaterial({ color: '#e8945a', roughness: 0.6 })
  );
  base.position.y = 0.25;
  const cream = new THREE.Mesh(
    new THREE.SphereGeometry(0.48, 14, 12),
    new THREE.MeshPhysicalMaterial({ color: '#ffd6e8', roughness: 0.35, clearcoat: 0.8, emissive: '#ff9ecd', emissiveIntensity: 0.16 })
  );
  cream.position.y = 0.72;
  cream.scale.y = 0.85;
  const cream2 = cream.clone();
  cream2.position.y = 1.02;
  cream2.scale.setScalar(0.62);
  const cherry = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 10, 8),
    new THREE.MeshPhysicalMaterial({ color: '#ff3b5c', roughness: 0.2, clearcoat: 1, emissive: '#a3122e', emissiveIntensity: 0.4 })
  );
  cherry.position.y = 1.34;
  g.add(base, cream, cream2, cherry);
  return g;
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

export class Burst {
  constructor(scene, count = 64) {
    this.items = [];
    for (let i = 0; i < count; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({
        map: GLOW, transparent: true, opacity: 0, depthWrite: false,
        blending: THREE.AdditiveBlending, color: new THREE.Color('#ffd6e8'),
      }));
      s.visible = false;
      scene.add(s);
      this.items.push({ s, life: 0, vel: new THREE.Vector3() });
    }
  }
  spawn(pos, color = '#ffd6e8', n = 12, power = 4.2) {
    let used = 0;
    for (const it of this.items) {
      if (used >= n) break;
      if (it.life > 0) continue;
      used++;
      it.life = 1;
      it.s.visible = true;
      it.s.position.copy(pos);
      it.s.material.color.set(color);
      it.s.material.opacity = 1;
      it.s.scale.setScalar(0.42 + Math.random() * 0.5);
      it.vel.set((Math.random() - 0.5) * power, Math.random() * power * 0.9 + 1, (Math.random() - 0.5) * power);
    }
  }
  update(dt) {
    for (const it of this.items) {
      if (it.life <= 0) continue;
      it.life -= dt * 1.7;
      if (it.life <= 0) { it.s.visible = false; continue; }
      it.s.position.addScaledVector(it.vel, dt);
      it.vel.y -= 8.5 * dt;
      it.s.material.opacity = Math.max(0, it.life);
    }
  }
}

export function createSweets(scene, track) {
  const group = new THREE.Group();
  scene.add(group);
  const burst = new Burst(scene);
  const list = [];
  const L = track.length;

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
    let mesh;
    if (type === 'star') mesh = starMesh();
    else if (type === 'cupcake') mesh = cupcakeMesh();
    else mesh = candyMesh(CANDY_COLORS[seed % CANDY_COLORS.length]);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: GLOW, transparent: true, opacity: type === 'candy' ? 0.42 : 0.68,
      depthWrite: false, blending: THREE.AdditiveBlending,
      color: new THREE.Color(type === 'star' ? '#ffe9a8' : type === 'cupcake' ? '#ffc6e2' : '#ffffff'),
    }));
    glow.scale.setScalar(type === 'candy' ? 2.3 : 3.2);
    mesh.add(glow);
    mesh.position.copy(pose.pos).add(new THREE.Vector3(0, type === 'cupcake' ? 1.35 : 1.55, 0));
    mesh.scale.setScalar(type === 'candy' ? 1.3 : 1.18);
    mesh.traverse((o) => { o.userData.noCollide = true; }); // pickups float over the road on purpose
    group.add(mesh);
    list.push({
      mesh, type, s, lateral,
      baseY: mesh.position.y,
      phase: (seed * 0.63) % (Math.PI * 2),
      collected: false,
    });
  }

  function reset() {
    for (const it of list) {
      it.collected = false;
      it.mesh.visible = true;
      it.mesh.scale.setScalar(1);
    }
  }

  const collectedEvents = [];

  function update(dt, carS, carX, time) {
    collectedEvents.length = 0;
    for (const it of list) {
      if (it.collected) continue;
      const bob = Math.sin(time * 2.1 + it.phase) * 0.26;
      it.mesh.position.y = it.baseY + bob;
      it.mesh.rotation.y += dt * (it.type === 'star' ? 1.6 : 2.4);
      if (it.type === 'star') it.mesh.rotation.z = Math.sin(time * 1.5 + it.phase) * 0.25;

      const ds = Math.abs(it.s - carS);
      if (ds > 6) continue;
      const dx = it.mesh.position.x - (carX === null ? it.mesh.position.x : 0);
      // distance check in world space happens via car position passed as (s, lateral)
      const lateralDiff = Math.abs(it.lateral - carX);
      if (ds < 3.6 && lateralDiff < TUNING.collectRadius) {
        it.collected = true;
        it.mesh.visible = false;
        burst.spawn(it.mesh.position, it.type === 'star' ? '#ffe9a8' : it.type === 'cupcake' ? '#ffc6e2' : '#ff9ed2', it.type === 'candy' ? 8 : 14, it.type === 'candy' ? 3.6 : 5.2);
        collectedEvents.push({ type: it.type, points: it.type === 'star' ? 25 : it.type === 'cupcake' ? 15 : 10, worldPos: it.mesh.position.clone() });
      }
    }
    burst.update(dt);
    return collectedEvents;
  }

  function collectAllDemo() {
    // used only by automated visual tests
    for (const it of list) { it.collected = true; it.mesh.visible = false; }
  }

  return {
    group, list, update, reset, collectAllDemo,
    get collected() { return list.filter((x) => x.collected).length; },
    get total() { return list.length; },
  };
}
