// World building for Asteroid Turret VR: procedural environment, ship and
// asteroid visuals. Everything is generated at runtime (canvas textures +
// displaced geometry) — zero external assets, zero runtime downloads.
// Design rules from the perf guide: no post-processing composer (fake glow
// via additive sprites instead), shared geometries/textures, per-mesh clones
// only where a uniform-like value (emissive heat) must differ.

import * as THREE from 'three';

export function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------- canvas textures
function canvasTex(size, draw, { repeat = false } = {}) {
  const c = document.createElement('canvas');
  c.width = size[0]; c.height = size[1];
  draw(c.getContext('2d'), c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { tex.wrapS = tex.wrapT = THREE.RepeatWrapping; }
  return tex;
}

/** Rocky asteroid albedo: mottled regolith, darker crater blotches, warm rim dust. */
export function makeRockTexture(seed = 7) {
  const r = mulberry(seed);
  return canvasTex([256, 256], (ctx, w, h) => {
    ctx.fillStyle = '#8a6f5a'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) {
      const g = 90 + Math.floor(r() * 90);
      ctx.fillStyle = `rgba(${g + 30},${g},${Math.floor(g * 0.72)},${0.16 + r() * 0.2})`;
      ctx.beginPath(); ctx.arc(r() * w, r() * h, 1 + r() * 5, 0, 7); ctx.fill();
    }
    for (let i = 0; i < 26; i++) { // craters: dark pit + lit lower rim
      const x = r() * w, y = r() * h, rad = 5 + r() * 16;
      ctx.fillStyle = 'rgba(38,26,18,0.55)';
      ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(230,200,160,0.35)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, rad, 0.4, 2.4); ctx.stroke();
    }
    for (let i = 0; i < 40; i++) { // pale mineral veins
      ctx.strokeStyle = `rgba(210,190,160,${0.05 + r() * 0.1})`; ctx.lineWidth = 1;
      ctx.beginPath(); const x = r() * w, y = r() * h;
      ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 60, y + (r() - 0.5) * 60); ctx.stroke();
    }
  }, { repeat: true });
}

/** Bump map companion for the rock albedo (grayscale height noise). */
export function makeRockBump(seed = 7) {
  const r = mulberry(seed + 100);
  const tex = canvasTex([256, 256], (ctx, w, h) => {
    ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 2000; i++) {
      const g = 70 + Math.floor(r() * 120);
      ctx.fillStyle = `rgba(${g},${g},${g},0.25)`;
      ctx.beginPath(); ctx.arc(r() * w, r() * h, 1 + r() * 6, 0, 7); ctx.fill();
    }
    for (let i = 0; i < 26; i++) {
      const x = r() * w, y = r() * h, rad = 5 + r() * 16;
      ctx.fillStyle = 'rgba(20,20,20,0.6)';
      ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
    }
  }, { repeat: true });
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

/** Gas-giant banding for the background planet. */
export function makePlanetTexture(seed = 3) {
  const r = mulberry(seed);
  return canvasTex([512, 256], (ctx, w, h) => {
    const bands = ['#274b73', '#3d6f9e', '#2c5f8a', '#5d8fb8', '#24466b', '#477ca8', '#2c5f8a', '#6fa3c8'];
    let y = 0;
    for (let i = 0; y < h; i++) {
      const bh = 12 + r() * 30;
      ctx.fillStyle = bands[i % bands.length]; ctx.fillRect(0, y, w, bh + 1);
      y += bh;
    }
    for (let i = 0; i < 500; i++) { // turbulence streaks
      ctx.fillStyle = `rgba(255,255,255,${0.02 + r() * 0.05})`;
      ctx.fillRect(r() * w, r() * h, 20 + r() * 60, 1 + r() * 2);
    }
    const sx = w * 0.68, sy = h * 0.6; // storm spot
    const g = ctx.createRadialGradient(sx, sy, 2, sx, sy, 26);
    g.addColorStop(0, 'rgba(255,170,120,0.85)'); g.addColorStop(1, 'rgba(255,170,120,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, 26, 0, 7); ctx.fill();
  });
}

/** Painted nebula backdrop (equirect-ish): deep space, colour clouds, stars. */
export function makeNebulaTexture(seed = 11) {
  const r = mulberry(seed);
  return canvasTex([1024, 512], (ctx, w, h) => {
    ctx.fillStyle = '#04060f'; ctx.fillRect(0, 0, w, h);
    const clouds = [
      [0.22, 0.38, 300, '124,58,237'], [0.55, 0.3, 340, '8,145,178'],
      [0.8, 0.55, 280, '190,40,160'], [0.38, 0.72, 260, '30,80,200'],
      [0.68, 0.78, 220, '14,116,144'], [0.08, 0.8, 200, '88,28,135'],
    ];
    for (const [fx, fy, rad, rgb] of clouds) {
      for (let i = 0; i < 46; i++) {
        const x = fx * w + (r() - 0.5) * rad * 1.4, y = fy * h + (r() - 0.5) * rad * 0.7;
        const rr = 20 + r() * rad * 0.4;
        const g = ctx.createRadialGradient(x, y, 1, x, y, rr);
        g.addColorStop(0, `rgba(${rgb},${0.03 + r() * 0.05})`); g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill();
      }
    }
    for (let i = 0; i < 900; i++) { // backdrop stars baked in
      const b = r();
      ctx.fillStyle = `rgba(${200 + b * 55},${210 + b * 45},255,${0.25 + b * 0.75})`;
      ctx.fillRect(r() * w, r() * h, b > 0.97 ? 2 : 1, b > 0.97 ? 2 : 1);
    }
  });
}

/** Soft radial glow sprite texture (nebula puffs, flashes, engine glow). */
export function makeGlowTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// ------------------------------------------------------------- environment
function starLayer(count, radius, size, color, seed) {
  const pos = new Float32Array(count * 3);
  const r = mulberry(seed);
  for (let i = 0; i < count; i++) {
    const t = r() * Math.PI * 2, p = Math.acos(r() * 2 - 1);
    pos[i * 3] = radius * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = radius * Math.cos(p);
    pos[i * 3 + 2] = radius * Math.sin(p) * Math.sin(t);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({
    color, size, sizeAttenuation: true, depthWrite: false, transparent: true,
    map: makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), alphaTest: 0.01,
  }));
  pts.frustumCulled = false;
  return pts;
}

/**
 * Builds sky backdrop, layered stars, ringed planet + moon, and a drifting
 * dust field that sells forward motion. Returns { update(dt, speedScale) }.
 */
export function createEnvironment(scene) {
  const group = new THREE.Group(); scene.add(group);

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(260, 32, 20),
    new THREE.MeshBasicMaterial({ map: makeNebulaTexture(), color: 0x8d99bd, side: THREE.BackSide, depthWrite: false }),
  );
  sky.frustumCulled = false; group.add(sky);

  group.add(starLayer(1100, 190, 0.75, 0xaecdf5, 7));
  group.add(starLayer(350, 170, 1.5, 0xeaf6ff, 21)); // brighter near layer

  // ringed gas giant + crater moon, low-left of the play sector
  const planetTex = makePlanetTexture();
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(13, 48, 32),
    new THREE.MeshStandardMaterial({ map: planetTex, roughness: 0.85, metalness: 0, emissive: 0x8fb8dd, emissiveMap: planetTex, emissiveIntensity: 0.38 }),
  );
  planet.position.set(-125, -68, -195); group.add(planet);
  const atmo = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(110,190,255,0.5)', 'rgba(110,190,255,0)'), transparent: true, depthWrite: false }));
  atmo.position.copy(planet.position); atmo.scale.setScalar(52); group.add(atmo);
  const ringTex = canvasTex([256, 16], (ctx, w, h) => {
    const r = mulberry(5);
    for (let x = 0; x < w; x += 2) { ctx.fillStyle = `rgba(160,215,255,${0.12 + r() * 0.55})`; ctx.fillRect(x, 0, 2, h); }
  });
  const rings = new THREE.Mesh(
    new THREE.RingGeometry(22, 34, 64),
    new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false }),
  );
  rings.position.copy(planet.position); rings.scale.setScalar(0.62); rings.rotation.x = Math.PI / 2.6; rings.rotation.y = 0.35; group.add(rings);
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3.4, 24, 18),
    new THREE.MeshStandardMaterial({ map: makeRockTexture(31), bumpMap: makeRockBump(31), bumpScale: 0.6, roughness: 1 }),
  );
  moon.position.set(58, 34, -150); group.add(moon);

  // distant traffic: two slow blinking beacons far off-axis
  const beacons = [];
  for (const [x, y, z, col] of [[-120, 60, -140, 0xff3df0], [130, -40, -120, 0x38f5ff]]) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(255,255,255,0.9)', 'rgba(255,255,255,0)'), color: col, transparent: true, depthWrite: false }));
    s.position.set(x, y, z); s.scale.setScalar(5); group.add(s); beacons.push(s);
  }

  // --- dust motes streaming past the ship (motion feel, cheap points) ---
  const DUST = 240;
  const dustPos = new Float32Array(DUST * 3);
  const dr = mulberry(99);
  for (let i = 0; i < DUST; i++) {
    dustPos[i * 3] = (dr() - 0.5) * 60;
    dustPos[i * 3 + 1] = (dr() - 0.5) * 36;
    dustPos[i * 3 + 2] = -dr() * 70;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0x9fd8ff, size: 0.11, transparent: true, opacity: 0.5, depthWrite: false,
    map: makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), alphaTest: 0.01,
  }));
  dust.frustumCulled = false; group.add(dust);

  return {
    group,
    update(dt, nowSec) {
      planet.rotation.y += dt * 0.004;
      moon.rotation.y += dt * 0.01;
      sky.rotation.y += dt * 0.0012; // near-imperceptible parallax drift
      beacons.forEach((b, i) => { b.material.opacity = 0.35 + 0.65 * Math.max(0, Math.sin(nowSec * 1.4 + i * 2.4)); });
      const pos = dustGeo.attributes.position;
      for (let i = 0; i < DUST; i++) {
        let z = pos.getZ(i) + dt * 6; // drifting toward/past the camera
        if (z > 2) { z = -70; pos.setX(i, (Math.random() - 0.5) * 60); pos.setY(i, (Math.random() - 0.5) * 36); }
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    },
  };
}

// --------------------------------------------------------------------- ship
/**
 * The player's ship: turret (rotating head + twin barrels), armoured deck with
 * panel texture, side cannons, engine glow and navigation lights. Built as a
 * child of the camera, so it rides the look exactly like a cockpit.
 * Returns { group, muzzle (Object3D at the barrel tip), update(nowSec) }.
 */
export function createShip() {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x44587a, metalness: 0.78, roughness: 0.34, emissive: 0x0a2436, emissiveIntensity: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b2740, metalness: 0.65, roughness: 0.48, emissive: 0x050b16 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x2b3d5f, metalness: 0.7, roughness: 0.4, emissive: 0xff8c1a, emissiveIntensity: 0.06 });
  const neon = new THREE.MeshBasicMaterial({ color: 0x38f5ff });
  const pink = new THREE.MeshBasicMaterial({ color: 0xff3df0 });

  // deck: wedge hull nose + panel-line texture
  const deckTex = canvasTex([256, 256], (ctx, w, h) => {
    ctx.fillStyle = '#232f49'; ctx.fillRect(0, 0, w, h);
    const r = mulberry(4);
    for (let i = 0; i < 60; i++) { ctx.fillStyle = `rgba(${140 + r() * 60},${160 + r() * 60},200,${0.04 + r() * 0.05})`; ctx.fillRect(r() * w, r() * h, 14 + r() * 40, 8 + r() * 22); }
    ctx.strokeStyle = 'rgba(8,12,24,0.8)'; ctx.lineWidth = 2;
    for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo((w / 4) * i, 0); ctx.lineTo((w / 4) * i, h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, (h / 4) * i); ctx.lineTo(w, (h / 4) * i); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,176,46,0.75)';
    for (let i = 0; i < 10; i++) ctx.fillRect(12 + i * 24, h - 20, 12, 5); // hazard ticks
  });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.3, 6.2), new THREE.MeshStandardMaterial({ map: deckTex, metalness: 0.6, roughness: 0.5 }));
  deck.position.set(0, -1.3, 0.7); group.add(deck);
  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 1.9, 3.2, 4, 1), dark);
  nose.rotation.x = Math.PI / 2; nose.rotation.y = Math.PI / 4; nose.scale.y = 1; nose.position.set(0, -1.28, -3.4); group.add(nose);

  // turret pedestal, rotating head, twin barrels
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.78, 0.38, 24), metal); base.position.y = -0.58; group.add(base);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.05, 10, 28), neon); collar.rotation.x = Math.PI / 2; collar.position.y = -0.4; group.add(collar);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.15, 0.46), dark); head.position.y = -0.39; group.add(head);
  const headStrip = new THREE.Mesh(new THREE.BoxGeometry(0.41, 0.04, 0.26), neon); headStrip.position.set(0, -0.29, -0.1); group.add(headStrip);
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.22), neon); sight.position.set(0, -0.06, -0.2); group.add(sight);
  const muzzle = new THREE.Object3D();
  for (const dx of [-0.16, 0.16]) {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, 1.25, 12), accent);
    barrel.rotation.x = Math.PI / 2; barrel.position.set(dx, -0.26, -0.8); group.add(barrel);
    const tipGlow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), neon);
    tipGlow.position.set(dx, -0.26, -1.42); group.add(tipGlow);
  }
  muzzle.position.set(0, -0.26, -1.45); group.add(muzzle);
  // recoil-ready side pods
  for (const dx of [-0.48, 0.48]) {
    const pod = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.5), dark); pod.position.set(dx, -0.28, -0.1); group.add(pod);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), dx < 0 ? neon : pink); lamp.position.set(dx, -0.2, -0.36); group.add(lamp);
  }

  // side rails with running lights + antenna mast with beacon
  const navLights = [];
  for (const dx of [-2.6, 2.6]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 5), metal); rail.position.set(dx, -1.0, 0.3); group.add(rail);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 4.6), dx < 0 ? neon : pink); strip.position.set(dx, -0.88, 0.3); group.add(strip);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), dx < 0 ? neon : pink);
    lamp.position.set(dx, -0.86, -2.1); group.add(lamp); navLights.push(lamp);
    // side cannon stubs
    const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.9, 10), dark);
    cannon.rotation.x = Math.PI / 2; cannon.position.set(dx * 0.92, -1.05, -1.6); group.add(cannon);
  }
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.95, 8), metal); mast.position.set(1.8, -0.55, 1.5); group.add(mast);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), pink.clone()); beacon.position.set(1.8, -0.05, 1.5); group.add(beacon);

  // engine glow behind the deck (fake bloom sprite)
  const engine = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(80,200,255,0.85)', 'rgba(80,200,255,0)'), transparent: true, depthWrite: false }));
  engine.position.set(0, -1.25, 3.9); engine.scale.set(3.4, 1.2, 1); group.add(engine);

  group.scale.setScalar(0.55);
  group.position.set(0, -0.82, -1.75);
  return {
    group, muzzle, beacon,
    update(nowSec) {
      beacon.material.color.setHex(Math.sin(nowSec * 4.4) > 0 ? 0xff3df0 : 0x4d0b43);
      navLights.forEach((l, i) => { l.material = l.material; l.visible = Math.sin(nowSec * 2 + i * Math.PI) > -0.75; });
      engine.material.opacity = 0.55 + Math.sin(nowSec * 7.3) * 0.12 + Math.sin(nowSec * 23) * 0.05;
      collar.rotation.z = nowSec * 0.4;
    },
  };
}

// ---------------------------------------------------------------- asteroids
// One mechanical type (contract); three *visual* rock variants so the stream
// does not look cloned. Displacement uses a direction hash, so vertices that
// share a direction (duplicated by polyhedron geometry) move identically and
// the surface stays watertight.
function hashNoise(x, y, z, seed) {
  let h = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed * 17.17) * 43758.5453;
  return h - Math.floor(h);
}
function displacedRock(radius, detail, seed) {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const d = v.clone().normalize();
    const n = hashNoise(d.x, d.y, d.z, seed) * 0.6
      + hashNoise(d.x * 2.7, d.y * 2.7, d.z * 2.7, seed + 9) * 0.3
      + hashNoise(d.x * 6.1, d.y * 6.1, d.z * 6.1, seed + 27) * 0.16;
    const s = 0.78 + n * 0.5;
    // slight elongation so rocks are not spheres
    pos.setXYZ(i, v.x * s * 1.12, v.y * s * 0.88, v.z * s);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createAsteroidAssets() {
  const texture = makeRockTexture(7);
  const bump = makeRockBump(7);
  const geometries = [displacedRock(1.6, 2, 3), displacedRock(1.6, 2, 14), displacedRock(1.6, 2, 29)];
  const baseMaterial = new THREE.MeshStandardMaterial({
    map: texture, bumpMap: bump, bumpScale: 0.9,
    color: 0xb59a80, roughness: 0.96, metalness: 0.04, flatShading: true,
    emissive: 0x1a0d06, emissiveIntensity: 1,
  });
  return {
    geometries,
    /** Per-mesh material clone (emissive heat differs), shared maps. */
    makeMaterial() { return baseMaterial.clone(); },
    geometryFor(id) { return geometries[Math.abs(id) % geometries.length]; },
  };
}
