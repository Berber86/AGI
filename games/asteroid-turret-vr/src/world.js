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
let maxAnisotropy = 1;
export function setTextureAnisotropy(n) { maxAnisotropy = Math.max(1, n | 0); }
function canvasTex(size, draw, { repeat = false } = {}) {
  const c = document.createElement('canvas');
  c.width = size[0]; c.height = size[1];
  draw(c.getContext('2d'), c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  if (repeat) { tex.wrapS = tex.wrapT = THREE.RepeatWrapping; }
  return tex;
}

/** Rocky asteroid albedo: layered regolith, crater blotches, mineral veins, warm rim dust. Higher res. */
export function makeRockTexture(seed = 7) {
  const r = mulberry(seed);
  return canvasTex([1024, 1024], (ctx, w, h) => {
    // Base regolith tone with noise
    const base = '#c2a37c'; ctx.fillStyle = base; ctx.fillRect(0, 0, w, h);
    // Fine grain noise
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = 194 + (r() - 0.5) * 40;
      img.data[i + 1] = 163 + (r() - 0.5) * 40;
      img.data[i + 2] = 124 + (r() - 0.5) * 30;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    // Mottled patches
    for (let i = 0; i < 7000; i++) {
      const g = 120 + Math.floor(r() * 100);
      ctx.fillStyle = `rgba(${g + 25},${g + 8},${Math.floor(g * 0.75)},${0.12 + r() * 0.25})`;
      ctx.beginPath(); ctx.arc(r() * w, r() * h, 2 + r() * 8, 0, 7); ctx.fill();
    }
    // Craters: dark pit + lit lower rim + ejecta ring
    for (let i = 0; i < 60; i++) {
      const x = r() * w, y = r() * h, rad = 10 + r() * 40;
      ctx.fillStyle = 'rgba(30,20,14,0.5)';
      ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(240,210,170,0.45)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y, rad, 0.3, 2.6); ctx.stroke();
      // ejecta speckles
      for (let j = 0; j < 6; j++) {
        ctx.fillStyle = `rgba(${180 + r() * 60},${150 + r() * 60},${110 + r() * 60},${0.3 + r() * 0.3})`;
        ctx.beginPath(); ctx.arc(x + (r() - 0.5) * rad * 1.8, y + (r() - 0.5) * rad * 1.8, 1 + r() * 3, 0, 7); ctx.fill();
      }
    }
    // Pale mineral veins
    for (let i = 0; i < 70; i++) {
      ctx.strokeStyle = `rgba(215,200,170,${0.06 + r() * 0.12})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); const x = r() * w, y = r() * h;
      ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 90, y + (r() - 0.5) * 90); ctx.stroke();
    }
    // Dark oxidation streaks
    for (let i = 0; i < 30; i++) {
      ctx.strokeStyle = `rgba(60,45,30,${0.15 + r() * 0.2})`; ctx.lineWidth = 3 + r() * 5;
      ctx.beginPath(); const x = r() * w, y = r() * h;
      ctx.moveTo(x, y); ctx.lineTo(x + (r() - 0.5) * 120, y + (r() - 0.5) * 30); ctx.stroke();
    }
  }, { repeat: true });
}

/** Bump map: grayscale height noise with crater depth. */
export function makeRockBump(seed = 7) {
  const r = mulberry(seed + 100);
  const tex = canvasTex([512, 512], (ctx, w, h) => {
    ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, w, h);
    // Height noise
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 128 + (r() - 0.5) * 60;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    // Craters: deep dark holes
    for (let i = 0; i < 40; i++) {
      const x = r() * w, y = r() * h, rad = 8 + r() * 24;
      const g = ctx.createRadialGradient(x, y, rad * 0.6, x, y, rad);
      g.addColorStop(0, 'rgba(10,10,10,1)'); g.addColorStop(0.7, 'rgba(60,60,60,0.6)'); g.addColorStop(1, 'rgba(128,128,128,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
    }
    // Raised ridges around craters
    for (let i = 0; i < 20; i++) {
      const x = r() * w, y = r() * h, rad = 12 + r() * 28;
      const g = ctx.createRadialGradient(x, y, rad * 0.85, x, y, rad * 1.3);
      g.addColorStop(0, 'rgba(200,200,200,0.5)'); g.addColorStop(1, 'rgba(128,128,128,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
    }
  }, { repeat: true });
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

/** Normal map: fake surface detail for per-asteroid variety. */
export function makeRockNormal(seed = 7) {
  const r = mulberry(seed + 200);
  const tex = canvasTex([512, 512], (ctx, w, h) => {
    ctx.fillStyle = '#7f7fff'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 3000; i++) {
      const x = r() * w, y = r() * h;
      const g = 128 + Math.floor((r() - 0.5) * 60);
      const b = 128 + Math.floor((r() - 0.5) * 80);
      ctx.fillStyle = `rgba(128,${g},${b},0.3)`;
      ctx.beginPath(); ctx.arc(x, y, 2 + r() * 6, 0, 7); ctx.fill();
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

/** Earth-like planet: oceans, continents, polar cap, cloud swirls. */
export function makeEarthTexture(seed = 17) {
  const r = mulberry(seed);
  return canvasTex([1024, 512], (ctx, w, h) => {
    const ocean = ctx.createLinearGradient(0, 0, 0, h);
    ocean.addColorStop(0, '#1b4f8a'); ocean.addColorStop(0.5, '#2568ad'); ocean.addColorStop(1, '#173f6e');
    ctx.fillStyle = ocean; ctx.fillRect(0, 0, w, h);
    for (let c = 0; c < 7; c++) { // continents: clustered blobs
      const cx = r() * w, cy = h * 0.18 + r() * h * 0.64;
      for (let i = 0; i < 42; i++) {
        const x = cx + (r() - 0.5) * 150, y = cy + (r() - 0.5) * 75, rad = 6 + r() * 20;
        ctx.fillStyle = r() > 0.35 ? `rgba(74,138,74,${0.5 + r() * 0.4})` : `rgba(168,140,92,${0.5 + r() * 0.4})`;
        ctx.beginPath(); ctx.arc((x + w) % w, y, rad, 0, 7); ctx.fill();
      }
    }
    ctx.fillStyle = 'rgba(240,248,255,0.9)'; ctx.fillRect(0, 0, w, 14); ctx.fillRect(0, h - 18, w, 18); // polar caps
    for (let i = 0; i < 380; i++) { // clouds
      ctx.fillStyle = `rgba(255,255,255,${0.08 + r() * 0.22})`;
      ctx.beginPath(); ctx.ellipse(r() * w, r() * h, 14 + r() * 46, 3 + r() * 7, (r() - 0.5) * 0.4, 0, 7); ctx.fill();
    }
  });
}

/** Painted nebula backdrop (equirect-ish): deep space, colour clouds, stars. */
export function makeNebulaTexture(seed = 11) {
  const r = mulberry(seed);
  return canvasTex([2048, 1024], (ctx, w, h) => {
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
        g.addColorStop(0, `rgba(${rgb},${0.06 + r() * 0.09})`); g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.fill();
      }
    }
    for (let i = 0; i < 1800; i++) { // backdrop stars baked in
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
  const opacity = new Float32Array(count);
  const twinkleSpeed = new Float32Array(count);
  const twinkleOffset = new Float32Array(count);
  const r = mulberry(seed);
  for (let i = 0; i < count; i++) {
    const t = r() * Math.PI * 2, p = Math.acos(r() * 2 - 1);
    pos[i * 3] = radius * Math.sin(p) * Math.cos(t);
    pos[i * 3 + 1] = radius * Math.cos(p);
    pos[i * 3 + 2] = radius * Math.sin(p) * Math.sin(t);
    // Per-star twinkle: random base opacity and speed
    opacity[i] = 0.3 + r() * 0.7;
    twinkleSpeed[i] = 0.8 + r() * 2.4; // cycles per second
    twinkleOffset[i] = r() * Math.PI * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('opacity', new THREE.BufferAttribute(opacity, 1));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({
    color, size, sizeAttenuation: true, depthWrite: false, transparent: true,
    vertexColors: false,
    map: makeGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), alphaTest: 0.01,
  }));
  pts.frustumCulled = false;
  pts.userData = { opacityAttr: opacity, twinkleSpeed, twinkleOffset, geoOpacity: g.attributes.opacity };
  return pts;
}

/**
 * Builds sky backdrop, layered stars, ringed planet + moon, and a drifting
 * dust field that sells forward motion. Returns { update(dt, speedScale) }.
 * `q` is a quality preset from QUALITY_PRESETS (main.js).
 */
export function createEnvironment(scene, q) {
  const group = new THREE.Group(); scene.add(group);

  const skySegments = q.asteroidDetail >= 3 ? 64 : 32;
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(260, skySegments, 20),
    new THREE.MeshBasicMaterial({ map: makeNebulaTexture(), color: 0xc2cfe8, side: THREE.BackSide, depthWrite: false }),
  );
  sky.frustumCulled = false; group.add(sky);

  const stars1 = starLayer(q.starCount1, 190, 0.75, 0xaecdf5, 7);
  const stars2 = starLayer(q.starCount2, 170, 1.5, 0xeaf6ff, 21); // brighter near layer
  group.add(stars1, stars2);

  // ringed gas giant + crater moon, low-left of the play sector
  const planetTex = makePlanetTexture();
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(13, 64, 48),
    new THREE.MeshStandardMaterial({ map: planetTex, roughness: 0.85, metalness: 0, emissive: 0x8fb8dd, emissiveMap: planetTex, emissiveIntensity: 0.42 }),
  );
  planet.position.set(-125, -68, -195); group.add(planet);
  const atmo = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(110,190,255,0.5)', 'rgba(110,190,255,0)'), transparent: true, depthWrite: false }));
  atmo.position.copy(planet.position); atmo.scale.setScalar(56); group.add(atmo);
  const atmo2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(60,100,160,0.3)', 'rgba(60,100,160,0)'), transparent: true, depthWrite: false }));
  atmo2.position.copy(planet.position); atmo2.scale.setScalar(72); group.add(atmo2);
  const ringTex = canvasTex([256, 16], (ctx, w, h) => {
    const r = mulberry(5);
    for (let x = 0; x < w; x += 2) { ctx.fillStyle = `rgba(160,215,255,${0.12 + r() * 0.55})`; ctx.fillRect(x, 0, 2, h); }
  });
  const rings = new THREE.Mesh(
    new THREE.RingGeometry(22, 36, 80),
    new THREE.MeshBasicMaterial({ map: ringTex, transparent: true, opacity: 0.78, side: THREE.DoubleSide, depthWrite: false }),
  );
  rings.position.copy(planet.position); rings.scale.setScalar(0.62); rings.rotation.x = Math.PI / 2.6; rings.rotation.y = 0.35; group.add(rings);
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3.4, 32, 24),
    new THREE.MeshStandardMaterial({ map: makeRockTexture(31), bumpMap: makeRockBump(31), bumpScale: 0.7, roughness: 1 }),
  );
  moon.position.set(58, 34, -150); group.add(moon);

  // --- Earth horizon below the play sector (like the reference art) ---
  const earthTex = makeEarthTexture();
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(150, 56, 36),
    new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.75, metalness: 0, emissive: 0x7fa8d8, emissiveMap: earthTex, emissiveIntensity: 0.26 }),
  );
  earth.position.set(10, -172, -55); earth.rotation.set(0.48, 0.6, 0.22); group.add(earth);
  const earthGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(110,190,255,0.55)', 'rgba(110,190,255,0)'), transparent: true, depthWrite: false }));
  earthGlow.position.set(10, -58, -70); earthGlow.scale.set(190, 60, 1); group.add(earthGlow);

  // --- warm sun, low-left (reference: golden key light) ---
  const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(255,214,140,1)', 'rgba(255,140,40,0)'), color: 0xffbe78, transparent: true, depthWrite: false, opacity: 0.9 }));
  sunSprite.position.set(-205, 74, -155); sunSprite.scale.setScalar(95); group.add(sunSprite);
  const sunCore = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(255,246,220,1)', 'rgba(255,214,140,0)'), transparent: true, depthWrite: false }));
  sunCore.position.copy(sunSprite.position); sunCore.scale.setScalar(12); group.add(sunCore);

  // --- sun lens flare: horizontal streak + radial spikes ---
  const flareTex = makeGlowTexture('rgba(255,220,160,1)', 'rgba(255,140,40,0)');
  const flareH = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTex, color: 0xffd48a, transparent: true, depthWrite: false, opacity: 0.55 }));
  flareH.position.copy(sunSprite.position); flareH.scale.set(150, 12, 1); group.add(flareH);
  const flareV = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTex, color: 0xffd48a, transparent: true, depthWrite: false, opacity: 0.45 }));
  flareV.position.copy(sunSprite.position); flareV.scale.set(12, 150, 1); group.add(flareV);
  const flareDiag1 = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTex, color: 0xffd48a, transparent: true, depthWrite: false, opacity: 0.35 }));
  flareDiag1.position.copy(sunSprite.position); flareDiag1.scale.setScalar(110); flareDiag1.rotation.z = 0.7; group.add(flareDiag1);
  const flareDiag2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: flareTex, color: 0xffd48a, transparent: true, depthWrite: false, opacity: 0.35 }));
  flareDiag2.position.copy(sunSprite.position); flareDiag2.scale.setScalar(110); flareDiag2.rotation.z = -0.7; group.add(flareDiag2);

  // --- background asteroid belt: one InstancedMesh, ~140 far rocks ---
  const beltGeo = displacedRock(1.6, 2, 23);
  const beltMat = new THREE.MeshStandardMaterial({ map: makeRockTexture(41), bumpMap: makeRockBump(41), bumpScale: 0.7, color: 0xf7ecdc, roughness: 1, flatShading: true, emissive: 0x241610, emissiveIntensity: 0.8 });
  const BELT = 150;
  const belt = new THREE.InstancedMesh(beltGeo, beltMat, BELT);
  {
    const m = new THREE.Matrix4(); const q = new THREE.Quaternion(); const e = new THREE.Euler(); const s = new THREE.Vector3(); const pv = new THREE.Vector3();
    const br = mulberry(123);
    for (let i = 0; i < BELT; i++) {
      const yaw = (br() * 2 - 1) * 1.25, pitch = (br() - 0.42) * 0.85, dist = 85 + br() * 95;
      pv.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(dist);
      e.set(br() * 3, br() * 3, br() * 3); q.setFromEuler(e);
      const sc = 0.8 + br() * br() * 4.2; s.set(sc, sc * (0.75 + br() * 0.4), sc);
      belt.setMatrixAt(i, m.compose(pv, q, s));
    }
  }
  {
    const col = new THREE.Color(); const cr2 = mulberry(77);
    for (let i = 0; i < BELT; i++) { col.setHSL(0.08 + cr2() * 0.03, 0.12 + cr2() * 0.18, 0.84 + cr2() * 0.16); belt.setColorAt(i, col); }
    if (belt.instanceColor) belt.instanceColor.needsUpdate = true;
  }
  belt.frustumCulled = false; group.add(belt);

  // --- orbital station, right side (procedural silhouette with lit windows) ---
  const station = new THREE.Group();
  {
    const hullM = new THREE.MeshStandardMaterial({ color: 0x9fb4cc, metalness: 0.75, roughness: 0.35, emissive: 0x223a55, emissiveIntensity: 0.7 });
    const panelM = new THREE.MeshStandardMaterial({ color: 0x2456a8, metalness: 0.4, roughness: 0.5, emissive: 0x0a2c66, emissiveIntensity: 0.9 });
    const winM = new THREE.MeshBasicMaterial({ color: 0xbfe8ff });
    const truss = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 26, 10), hullM); truss.rotation.z = Math.PI / 2; station.add(truss);
    const hub = new THREE.Mesh(new THREE.SphereGeometry(2.6, 18, 14), hullM); station.add(hub);
    const dockRing = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.55, 10, 32), hullM); dockRing.rotation.y = Math.PI / 2; dockRing.position.x = -9; station.add(dockRing);
    for (const dx of [-4.5, 4.5]) for (const sgn of [-1, 1]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(7.5, 3.1, 0.18), panelM);
      panel.position.set(dx, sgn * 3.4, 0); station.add(panel);
    }
    for (let i = 0; i < 22; i++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.1), winM);
      const a = (i / 22) * Math.PI * 2;
      win.position.set(Math.cos(a) * 2.62, Math.sin(a) * 2.62, 0.6); station.add(win);
    }
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.3, 6.5, 8), hullM); spire.position.y = 5; station.add(spire);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 10), new THREE.MeshBasicMaterial({ color: 0xff3df0 })); tip.position.y = 8.4; station.add(tip);
    station.position.set(108, 30, -155); station.rotation.set(0.15, -0.5, 0.22); station.scale.setScalar(1.55);
  }
  group.add(station);

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

  // --- comets: slow icy wanderers with glowing tails ---
  const COMETS = q.cometCount;
  const comets = [];
  const cometGeo = new THREE.SphereGeometry(0.5, q.asteroidDetail >= 3 ? 12 : 8, 10);
  const cometMat = new THREE.MeshBasicMaterial({ color: 0xbee3ff, transparent: true, opacity: 0.9 });
  const cometTailGeo = new THREE.ConeGeometry(0.05, 8, q.asteroidDetail >= 3 ? 8 : 6, 1, true);
  const cometTailMat = new THREE.MeshBasicMaterial({ color: 0x6fb3ff, transparent: true, opacity: 0.5, depthWrite: false });
  const cr3 = mulberry(131);
  for (let i = 0; i < COMETS; i++) {
    const c = new THREE.Group();
    const head = new THREE.Mesh(cometGeo, cometMat.clone());
    const tail = new THREE.Mesh(cometTailGeo, cometTailMat.clone());
    tail.rotation.x = Math.PI / 2;
    tail.position.z = -4;
    c.add(head, tail);
    c.position.set((cr3() - 0.5) * 300, (cr3() - 0.5) * 200, -400 - cr3() * 300);
    c.userData = {
      vel: new THREE.Vector3((cr3() - 0.5) * 0.6, (cr3() - 0.5) * 0.4, 1.5 + cr3() * 2),
      life: cr3() * 30,
      maxLife: 20 + cr3() * 40,
    };
    group.add(c); comets.push(c);
  }

  // --- shooting stars: fast meteors with streaks ---
  const SHOOTING = q.shootingStarCount;
  const shootingStars = [];
  const starGeo = new THREE.SphereGeometry(0.15, q.asteroidDetail >= 3 ? 8 : 6, 6);
  const starMat = new THREE.MeshBasicMaterial({ color: 0xffffd0 });
  const streakGeo = new THREE.CylinderGeometry(0.02, 0.06, 3, q.asteroidDetail >= 3 ? 6 : 4, 1, true);
  const streakMat = new THREE.MeshBasicMaterial({ color: 0xaaeeff, transparent: true, opacity: 0.7, depthWrite: false });
  const cr4 = mulberry(173);
  for (let i = 0; i < SHOOTING; i++) {
    const s = new THREE.Group();
    const head = new THREE.Mesh(starGeo, starMat.clone());
    const streak = new THREE.Mesh(streakGeo, streakMat.clone());
    streak.rotation.z = Math.PI / 2;
    streak.position.z = -1.5;
    s.add(head, streak);
    s.position.set((cr4() - 0.5) * 400, (cr4() - 0.5) * 300, -300 - cr4() * 200);
    s.userData = {
      vel: new THREE.Vector3((cr4() - 0.5) * 8, (cr4() - 0.5) * 6, 12 + cr4() * 15),
      rotSpeed: 0.4 + cr4() * 0.6,
      active: cr4() > 0.5,
      timer: cr4() * 20,
    };
    group.add(s); shootingStars.push(s);
  }

  return {
    group,
    comets,
    shootingStars,
    update(dt, nowSec) {
      planet.rotation.y += dt * 0.004;
      earth.rotation.y += dt * 0.0016;
      belt.rotation.y += dt * 0.0022;
      station.rotation.y += dt * 0.01;
      moon.rotation.y += dt * 0.01;
      sky.rotation.y += dt * 0.0012; // near-imperceptible parallax drift
      sky.rotation.z += dt * 0.0006; // slow nebula drift
      rings.rotation.y += dt * 0.0015; // ring precession

      // Star twinkling: sine-modulated opacity per layer
      for (const layer of [stars1, stars2]) {
        const ud = layer.userData;
        const opacityAttr = ud.geoOpacity;
        const count = ud.opacityAttr.length;
        for (let i = 0; i < count; i++) {
          const t = nowSec * ud.twinkleSpeed[i] + ud.twinkleOffset[i];
          const twinkle = 0.5 + 0.5 * Math.sin(t);
          opacityAttr.setX(i, ud.opacityAttr[i] * (0.5 + twinkle * 0.5));
        }
        opacityAttr.needsUpdate = true;
      }

      // Sun flare subtle pulse
      const flarePulse = 0.85 + 0.15 * Math.sin(nowSec * 2.2);
      flareH.material.opacity = 0.55 * flarePulse;
      flareV.material.opacity = 0.45 * flarePulse;
      flareDiag1.material.opacity = 0.35 * flarePulse;
      flareDiag2.material.opacity = 0.35 * flarePulse;

      beacons.forEach((b, i) => { b.material.opacity = 0.35 + 0.65 * Math.max(0, Math.sin(nowSec * 1.4 + i * 2.4)); });
      const pos = dustGeo.attributes.position;
      for (let i = 0; i < DUST; i++) {
        let z = pos.getZ(i) + dt * 6; // drifting toward/past the camera
        if (z > 2) { z = -70; pos.setX(i, (Math.random() - 0.5) * 60); pos.setY(i, (Math.random() - 0.5) * 36); }
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;

      // Comets: slow icy wanderers with glowing tails
      comets.forEach((c) => {
        const ud = c.userData;
        c.position.addScaledVector(ud.vel, dt);
        ud.life += dt;
        if (ud.life >= ud.maxLife) {
          // respawn far away
          c.position.set((cr3() - 0.5) * 300, (cr3() - 0.5) * 200, -450);
          ud.life = 0;
          ud.vel.set((cr3() - 0.5) * 0.6, (cr3() - 0.5) * 0.4, 1.5 + cr3() * 2);
        }
        c.rotation.y += dt * 0.3;
        c.children[1].scale.setScalar(0.8 + Math.sin(nowSec * 8) * 0.2); // tail pulse
      });

      // Shooting stars: fast meteors
      shootingStars.forEach((s) => {
        const ud = s.userData;
        ud.timer -= dt;
        if (ud.timer <= 0) {
          ud.active = !ud.active;
          ud.timer = 3 + Math.random() * 12;
        }
        if (ud.active) {
          s.position.addScaledVector(ud.vel, dt);
          s.rotation.z += dt * ud.rotSpeed;
          s.rotation.x += dt * ud.rotSpeed * 0.5;
          // respawn if too close
          if (s.position.z > 5) {
            s.position.set((cr4() - 0.5) * 400, (cr4() - 0.5) * 300, -350);
          }
        }
        s.visible = ud.active;
      });
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
export function createShip(q) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x44587a, metalness: 0.82, roughness: 0.28, emissive: 0x0a2436, emissiveIntensity: 1 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x162236, metalness: 0.7, roughness: 0.45, emissive: 0x040812 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x2b3d5f, metalness: 0.75, roughness: 0.35, emissive: 0xff8c1a, emissiveIntensity: 0.1 });
  const neon = new THREE.MeshBasicMaterial({ color: 0x38f5ff });
  const pink = new THREE.MeshBasicMaterial({ color: 0xff3df0 });
  const detail = q.asteroidDetail;

  // deck: wedge hull nose + panel-line texture
  const deckTex = canvasTex([512, 512], (ctx, w, h) => {
    ctx.fillStyle = '#1e2a44'; ctx.fillRect(0, 0, w, h);
    const r = mulberry(4);
    for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(${150 + r() * 70},${170 + r() * 70},220,${0.05 + r() * 0.08})`; ctx.fillRect(r() * w, r() * h, 16 + r() * 50, 10 + r() * 26); }
    ctx.strokeStyle = 'rgba(6,10,22,0.9)'; ctx.lineWidth = 3;
    for (let i = 0; i <= 5; i++) { ctx.beginPath(); ctx.moveTo((w / 5) * i, 0); ctx.lineTo((w / 5) * i, h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, (h / 5) * i); ctx.lineTo(w, (h / 5) * i); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,180,50,0.85)';
    for (let i = 0; i < 12; i++) ctx.fillRect(14 + i * 30, h - 26, 14, 6); // hazard ticks
    // rim highlight
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.05)'); g.addColorStop(0.5, 'rgba(255,255,255,0.15)'); g.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 7.4), new THREE.MeshStandardMaterial({ map: deckTex, metalness: 0.65, roughness: 0.45 }));
  deck.position.set(0, -1.4, 0.9); group.add(deck);
  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 1, 3.6, 6, 1), metal);
  nose.rotation.x = Math.PI / 2; nose.rotation.y = Math.PI / 4; nose.position.set(0, -1.6, -4.2); group.add(nose);
  // lower hull plate
  const plate = new THREE.Mesh(new THREE.BoxGeometry(9, 0.5, 4), dark);
  plate.position.set(0, -1.7, 2.6); group.add(plate);

  // cockpit frame: angled white struts with neon inlays (reference framing)
  const white = new THREE.MeshStandardMaterial({ color: 0xe9eff7, metalness: 0.4, roughness: 0.25, emissive: 0x2a3648, emissiveIntensity: 0.4 });
  for (const dx of [-1.45, 1.45]) {
    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.3, 0.4), white);
    strut.position.set(dx, -0.7, -1.2); strut.rotation.z = dx < 0 ? 0.4 : -0.4; strut.rotation.x = 0.18; group.add(strut);
    const inlay = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.42), dx < 0 ? neon : pink);
    inlay.position.copy(strut.position); inlay.rotation.copy(strut.rotation); group.add(inlay);
    const dash = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 0.8), white);
    dash.position.set(dx * 0.85, -1.22, -1.0); dash.rotation.x = -0.45; group.add(dash);
  }
  // dashboard console with a little radar screen (canvas texture)
  const dashTex = canvasTex([512, 256], (ctx, w, h) => {
    ctx.fillStyle = '#020a16'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(56,245,255,0.9)'; ctx.lineWidth = 3;
    for (const rr of [32, 60, 88]) { ctx.beginPath(); ctx.arc(104, 128, rr, 0, 7); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(104, 128); ctx.lineTo(176, 68); ctx.stroke();
    ctx.fillStyle = '#ffd65e'; ctx.beginPath(); ctx.moveTo(104, 108); ctx.lineTo(116, 140); ctx.lineTo(92, 140); ctx.fill();
    ctx.fillStyle = '#cff8ff';
    for (const [x, y] of [[140, 88], [76, 164], [168, 152], [60, 80]]) { ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill(); }
    ctx.fillStyle = 'rgba(56,245,255,0.8)';
    for (let i = 0; i < 6; i++) ctx.fillRect(240 + i * 40, 176 - (i % 3) * 24, 26, 10);
    ctx.font = '700 24px system-ui'; ctx.fillStyle = '#9fefff'; ctx.fillText('ТУРЕЛЬ', 238, 68);
    ctx.font = '700 18px system-ui'; ctx.fillStyle = '#8fd6f0'; ctx.fillText('READY', 238, 108);
  });
  const console_ = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.4, 0.75), dark);
  console_.position.set(-1.1, -1.25, -1.1); console_.rotation.x = -0.45; group.add(console_);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.15), new THREE.MeshBasicMaterial({ map: dashTex }));
  screen.position.set(-1.1, -0.96, -1.18); screen.rotation.x = -1.05; screen.rotation.z = 0.08; group.add(screen);

  // turret pedestal, rotating head, twin barrels
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.95, 0.5, detail >= 3 ? 32 : 16), metal); base.position.y = -0.75; group.add(base);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.07, detail >= 3 ? 12 : 8, detail >= 3 ? 36 : 18), neon); collar.rotation.x = Math.PI / 2; collar.position.y = -0.52; group.add(collar);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.65), white); head.position.y = -0.5; group.add(head);
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.28, detail >= 3 ? 28 : 12, detail >= 3 ? 20 : 10), new THREE.MeshStandardMaterial({ color: 0x0e3055, metalness: 0.9, roughness: 0.1, emissive: 0x0b3a66, emissiveIntensity: 1 }));
  canopy.scale.set(1, 0.7, 1.5); canopy.position.set(0, -0.38, -0.04); group.add(canopy);
  const headStrip = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.35), neon); headStrip.position.set(0, -0.36, -0.14); group.add(headStrip);
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.3), neon); sight.position.set(0, -0.08, -0.28); group.add(sight);

  // muzzle + twin barrels with tip glow
  const muzzle = new THREE.Object3D();
  const barrels = [];
  const tipGlows = [];
  for (const dx of [-0.22, 0.22]) {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 1.7, detail >= 3 ? 14 : 8), white);
    barrel.rotation.x = Math.PI / 2; barrel.position.set(dx, -0.34, -1.1); group.add(barrel);
    barrels.push(barrel);
    const tipGlow = new THREE.Mesh(new THREE.SphereGeometry(0.09, detail >= 3 ? 14 : 8, detail >= 3 ? 14 : 8), neon);
    tipGlow.position.set(dx, -0.34, -2.0); group.add(tipGlow);
    tipGlows.push(tipGlow);
  }
  muzzle.position.set(0, -0.34, -2.0); group.add(muzzle);
  // recoil-ready side pods
  for (const dx of [-0.65, 0.65]) {
    const pod = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.7), dark); pod.position.set(dx, -0.38, -0.15); group.add(pod);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), dx < 0 ? neon : pink); lamp.position.set(dx, -0.28, -0.5); group.add(lamp);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.45), neon); panel.position.set(dx * 0.75, -0.36, -0.1); group.add(panel);
  }

  // side rails with running lights + antenna mast with beacon
  const navLights = [];
  for (const dx of [-3.2, 3.2]) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 6.2), metal); rail.position.set(dx, -1.15, 0.4); group.add(rail);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 5.8), dx < 0 ? neon : pink); strip.position.set(dx, -1.02, 0.4); group.add(strip);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.1, detail >= 3 ? 14 : 8, detail >= 3 ? 14 : 8), dx < 0 ? neon : pink);
    lamp.position.set(dx, -1.0, -2.6); group.add(lamp); navLights.push(lamp);
    // side cannon stubs
    const cannon = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.2, 12), dark);
    cannon.rotation.x = Math.PI / 2; cannon.position.set(dx * 1.15, -1.2, -2.1); group.add(cannon);
  }
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.2, 10), metal); mast.position.set(2.4, -0.7, 2); group.add(mast);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.1, detail >= 3 ? 14 : 8, detail >= 3 ? 14 : 8), pink.clone()); beacon.position.set(2.4, -0.1, 2); group.add(beacon);

  // engine glow behind the deck (fake bloom sprite)
  const engine = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('rgba(80,200,255,0.9)', 'rgba(80,200,255,0)'), transparent: true, depthWrite: false }));
  engine.position.set(0, -1.45, 4.6); engine.scale.set(4.2, 1.6, 1); group.add(engine);

  // --- engine trail: streaming exhaust particles behind the ship ---
  const TRAIL = q.engineTrailCount;
  const trailPos = new Float32Array(TRAIL * 3);
  const trailLife = new Float32Array(TRAIL);
  const tr = mulberry(55);
  for (let i = 0; i < TRAIL; i++) {
    trailPos[i * 3] = (tr() - 0.5) * 2.2;
    trailPos[i * 3 + 1] = (tr() - 0.5) * 1.4;
    trailPos[i * 3 + 2] = 4.6 + tr() * 12;
    trailLife[i] = tr();
  }
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute('life', new THREE.BufferAttribute(trailLife, 1));
  const trailMat = new THREE.PointsMaterial({
    color: 0x38f5ff, size: 0.14, transparent: true, opacity: 0.55, depthWrite: false,
    map: makeGlowTexture('rgba(80,220,255,1)', 'rgba(80,220,255,0)'), alphaTest: 0.01, vertexColors: false,
  });
  const trail = new THREE.Points(trailGeo, trailMat);
  trail.frustumCulled = false;
  trail.userData = { pos: trailPos, life: trailLife, geoPos: trailGeo.attributes.position, geoLife: trailGeo.attributes.life };
  group.add(trail);

  // muzzle flash pool (2 sprites, one per barrel)
  const muzzleFlashTex = makeGlowTexture('rgba(255,240,200,1)', 'rgba(255,120,30,0)');
  const muzzleFlashes = [];
  for (let i = 0; i < 2; i++) {
    const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: muzzleFlashTex, color: 0xfff0c8, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    flash.position.set(0, 0, 0); flash.scale.setScalar(0); flash.visible = false;
    group.add(flash);
    muzzleFlashes.push({ sprite: flash, life: 0, max: 0.12 });
  }

  group.scale.setScalar(0.55);
  group.position.set(0, -0.9, -1.9);
  return {
    group, muzzle, beacon, barrels, tipGlows, muzzleFlashes, trail,
    update(nowSec, dt) {
      beacon.material.color.setHex(Math.sin(nowSec * 4.4) > 0 ? 0xff3df0 : 0x4d0b43);
      navLights.forEach((l, i) => { l.visible = Math.sin(nowSec * 2 + i * Math.PI) > -0.75; });
      engine.material.opacity = 0.6 + Math.sin(nowSec * 8) * 0.15 + Math.sin(nowSec * 26) * 0.06;
      collar.rotation.z = nowSec * 0.5;
      // subtle turret hover
      const hover = Math.sin(nowSec * 1.7) * 0.02;
      head.position.y = -0.5 + hover;
      headStrip.position.y = -0.36 + hover;
      sight.position.y = -0.08 + hover;
      barrels.forEach((b, i) => { b.position.y = -0.34 + hover; });
      tipGlows.forEach((g, i) => { g.position.y = -0.34 + hover; g.material.opacity = 0.7 + Math.sin(nowSec * 10 + i) * 0.3; });

      // engine trail: animate particles streaming backward
      const tp = trail.userData.pos; const tl = trail.userData.life;
      const gp = trail.userData.geoPos; const gl = trail.userData.geoLife;
      for (let i = 0; i < TRAIL; i++) {
        tl[i] -= dt * 1.2;
        if (tl[i] <= 0) { tl[i] = 1 + Math.random() * 0.5; tp[i * 3] = (Math.random() - 0.5) * 2.2; tp[i * 3 + 1] = (Math.random() - 0.5) * 1.4; tp[i * 3 + 2] = 4.6 + Math.random() * 14; }
        tp[i * 3 + 2] -= dt * 10; // stream backward
        gp.setXYZ(i, tp[i * 3], tp[i * 3 + 1], tp[i * 3 + 2]);
        gl.setX(i, tl[i]);
      }
      gp.needsUpdate = true; gl.needsUpdate = true;

      // muzzle flashes: fade after shot
      for (const fl of muzzleFlashes) {
        if (fl.life > 0) {
          fl.life -= dt;
          fl.sprite.material.opacity = Math.max(0, fl.life / fl.max);
          fl.sprite.scale.setScalar(0.5 + (fl.life / fl.max) * 0.6);
          if (fl.life <= 0) { fl.sprite.visible = false; }
        }
      }
    },
    fire() {
      // trigger muzzle flash on both barrels
      for (const fl of muzzleFlashes) { fl.life = fl.max; fl.sprite.visible = true; fl.sprite.material.opacity = 1; fl.sprite.scale.setScalar(0.5); }
      // barrel recoil
      barrels.forEach((b) => { b.position.z += 0.15; });
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
  // crater dents: fixed directions per variant, pressed into the surface
  const cr = mulberry(seed * 31 + 7);
  const craters = [];
  for (let i = 0; i < 8; i++) {
    const cv = new THREE.Vector3(cr() * 2 - 1, cr() * 2 - 1, cr() * 2 - 1).normalize();
    craters.push({ dir: cv, cosR: 0.82 + cr() * 0.1, depth: 0.1 + cr() * 0.16 });
  }
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const d = v.clone().normalize();
    const n = hashNoise(d.x, d.y, d.z, seed) * 0.6
      + hashNoise(d.x * 2.7, d.y * 2.7, d.z * 2.7, seed + 9) * 0.3
      + hashNoise(d.x * 6.1, d.y * 6.1, d.z * 6.1, seed + 27) * 0.16;
    let s = 0.78 + n * 0.5;
    for (const c of craters) {
      const dot = d.dot(c.dir);
      if (dot > c.cosR) { const f = (dot - c.cosR) / (1 - c.cosR); s -= c.depth * f * f; }
    }
    // slight elongation so rocks are not spheres
    pos.setXYZ(i, v.x * s * 1.12, v.y * s * 0.88, v.z * s);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createAsteroidAssets() {
  const texture = makeRockTexture(7);
  const bump = makeRockBump(7);
  const normal = makeRockNormal(7);
  // Five visual variants: different detail levels, crater depth and elongation
  const geometries = [
    displacedRock(1.4, 3, 3),   // small, smooth-ish
    displacedRock(1.6, 4, 14),  // medium, high detail
    displacedRock(1.8, 3, 29),  // large, cratered
    displacedRock(1.5, 4, 44),  // medium, spiky
    displacedRock(1.7, 3, 61),  // large, elongated
  ];
  const baseMaterial = new THREE.MeshStandardMaterial({
    map: texture, bumpMap: bump, normalMap: normal, normalScale: new THREE.Vector2(0.85, 0.85), bumpScale: 1.1,
    color: 0xf5e9d8, roughness: 0.94, metalness: 0.05, flatShading: false,
    emissive: 0x1a0d06, emissiveIntensity: 1.2,
  });
  return {
    geometries,
    /** Per-mesh material clone (emissive heat differs per asteroid), shared maps. */
    makeMaterial() { return baseMaterial.clone(); },
    geometryFor(id) { return geometries[Math.abs(id) % geometries.length]; },
  };
}
