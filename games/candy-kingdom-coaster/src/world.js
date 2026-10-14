// Candy Kingdom world: sky, clouds, mountains, castle, rollercoaster, props, confetti.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/three/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from '../vendor/three/jsm/utils/BufferGeometryUtils.js';
import { ZONES, TUNING } from './config.js';
import { mergeByMaterial, instanceGroups } from './merge.js';

const UP = new THREE.Vector3(0, 1, 0);

function skyDome() {
  const geo = new THREE.SphereGeometry(760, 32, 18);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color('#0f7fd4') },
      midColor: { value: new THREE.Color('#5cb8f5') },
      bottomColor: { value: new THREE.Color('#ffd0e8') },
    },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 topColor; uniform vec3 midColor; uniform vec3 bottomColor;
      varying vec3 vWorld;
      void main() {
        float h = normalize(vWorld).y;
        vec3 col = mix(bottomColor, midColor, smoothstep(-0.05, 0.22, h));
        col = mix(col, topColor, smoothstep(0.2, 0.75, h));
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  return new THREE.Mesh(geo, mat);
}

function sunTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 4, 128, 128, 128);
  grd.addColorStop(0, 'rgba(255,252,238,1)');
  grd.addColorStop(0.16, 'rgba(255,242,196,0.92)');
  grd.addColorStop(0.42, 'rgba(255,212,150,0.34)');
  grd.addColorStop(1, 'rgba(255,192,140,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function cloudTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 256, 256);
  const blob = (x, y, r, a) => {
    const grd = g.createRadialGradient(x, y, r * 0.15, x, y, r);
    grd.addColorStop(0, `rgba(255,255,255,${a})`);
    grd.addColorStop(0.75, `rgba(255,255,255,${a * 0.55})`);
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  };
  blob(128, 150, 78, 1);
  blob(80, 140, 55, 0.95);
  blob(176, 138, 58, 0.95);
  blob(110, 108, 48, 0.9);
  blob(158, 112, 44, 0.9);
  return new THREE.CanvasTexture(c);
}

function swirlTexture(c1 = '#ff5fa2', c2 = '#fff2f7') {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = c2; g.fillRect(0, 0, 256, 256);
  g.translate(128, 128);
  g.fillStyle = c1;
  for (let i = 0; i < 8; i++) {
    g.beginPath();
    g.moveTo(0, 0);
    const a0 = (i / 8) * Math.PI * 2;
    const a1 = ((i + 0.52) / 8) * Math.PI * 2;
    g.arc(0, 0, 128, a0, a1);
    g.closePath();
    g.fill();
  }
  g.fillStyle = c2;
  g.beginPath(); g.arc(0, 0, 26, 0, Math.PI * 2); g.fill();
  g.fillStyle = c1;
  g.beginPath(); g.arc(0, 0, 14, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function stripeTexture(c1 = '#ff4b6e', c2 = '#fff6f0') {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = c2; g.fillRect(0, 0, 128, 128);
  g.fillStyle = c1;
  for (let i = -4; i < 10; i++) {
    g.save();
    g.translate(0, 0);
    g.rotate(-0.5);
    g.fillRect(i * 24, -80, 12, 260);
    g.restore();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function cookieTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#d9995a'; g.fillRect(0, 0, 128, 128);
  g.fillStyle = '#8a5122';
  for (let i = 0; i < 14; i++) {
    g.beginPath();
    g.arc(Math.random() * 128, Math.random() * 128, 5 + Math.random() * 8, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function mergeParts(parts) {
  const geos = parts.map(({ geo, pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1] }) => {
    const g = geo.clone();
    const m = new THREE.Matrix4()
      .compose(
        new THREE.Vector3(...pos),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)),
        new THREE.Vector3(...scale)
      );
    g.applyMatrix4(m);
    return g;
  });
  return mergeGeometries(geos, false);
}

// Every prop geometry comes in two detail levels: `lo` is used by instanced
// chunks far from the camera (fog + distance hide the facets) — see LOD in
// buildChunks. The full-detail geometry carries its low twin in userData.lod.
const withLod = (fn) => (lo = false) => {
  const g = fn(lo);
  if (!lo) g.userData.lod = fn(true);
  return g;
};

const gummyBearGeometry = withLod((lo) => {
  const [a, b] = lo ? [8, 6] : [12, 9];
  const [c, d] = lo ? [5, 4] : [7, 5];
  return mergeParts([
    { geo: new THREE.SphereGeometry(0.55, a, b), pos: [0, 0.62, 0], scale: [1, 1.15, 0.82] },
    { geo: new THREE.SphereGeometry(0.38, a, b), pos: [0, 1.5, 0.05] },
    { geo: new THREE.SphereGeometry(0.15, c, d), pos: [-0.3, 1.82, 0] },
    { geo: new THREE.SphereGeometry(0.15, c, d), pos: [0.3, 1.82, 0] },
    { geo: new THREE.SphereGeometry(0.17, c, d), pos: [-0.62, 0.95, 0.1], scale: [1, 1.5, 1] },
    { geo: new THREE.SphereGeometry(0.17, c, d), pos: [0.62, 0.95, 0.1], scale: [1, 1.5, 1] },
    { geo: new THREE.SphereGeometry(0.2, c, d), pos: [-0.3, 0.16, 0.12], scale: [1, 1, 1.3] },
    { geo: new THREE.SphereGeometry(0.2, c, d), pos: [0.3, 0.16, 0.12], scale: [1, 1, 1.3] },
    { geo: new THREE.SphereGeometry(0.16, c, d), pos: [0, 1.45, 0.36], scale: [1.15, 0.9, 0.8] }, // muzzle
  ]);
});

const lollipopGeometry = withLod((lo) => mergeParts([
  { geo: new THREE.CylinderGeometry(0.085, 0.1, 2.6, lo ? 5 : 8), pos: [0, 1.3, 0] },
  { geo: new THREE.CylinderGeometry(1.05, 1.05, 0.3, lo ? 14 : 24), pos: [0, 3.15, 0], rot: [Math.PI / 2, 0, 0] },
  { geo: new THREE.TorusGeometry(1.05, 0.12, lo ? 4 : 6, lo ? 14 : 24), pos: [0, 3.15, 0] },
]));

const caneGeometry = withLod((lo) => mergeParts([
  { geo: new THREE.CylinderGeometry(0.14, 0.16, 3.4, lo ? 6 : 10), pos: [0, 1.7, 0] },
  { geo: new THREE.TorusGeometry(0.72, 0.15, lo ? 5 : 10, lo ? 10 : 20, Math.PI), pos: [0.72, 3.4, 0], rot: [0, 0, Math.PI] },
]));

const treeGeometry = withLod((lo) => mergeParts([
  { geo: new THREE.CylinderGeometry(0.22, 0.3, 1.6, lo ? 5 : 8), pos: [0, 0.8, 0] },
  { geo: new THREE.SphereGeometry(1.15, lo ? 8 : 12, lo ? 6 : 10), pos: [0, 2.15, 0], scale: [1, 0.95, 1] },
  { geo: new THREE.SphereGeometry(0.85, lo ? 7 : 10, lo ? 5 : 8), pos: [-0.75, 1.85, 0.25] },
  { geo: new THREE.SphereGeometry(0.85, lo ? 7 : 10, lo ? 5 : 8), pos: [0.8, 1.9, -0.15] },
]));

const marshGeometry = withLod((lo) => {
  const sg = lo ? 1 : 2;
  return mergeParts([
    { geo: new RoundedBoxGeometry(1.5, 1.0, 1.5, sg, 0.34), pos: [0, 0.5, 0] },
    { geo: new RoundedBoxGeometry(1.15, 0.8, 1.15, sg, 0.3), pos: [0, 1.4, 0] },
    { geo: new RoundedBoxGeometry(0.8, 0.62, 0.8, sg, 0.24), pos: [0, 2.05, 0] },
  ]);
});

// Ice cream = two instanced meshes sharing one placement list: the waffle
// cone keeps its golden map, the scoops take the per-instance pastel tint.
const iceConeGeometry = withLod((lo) => mergeParts([
  { geo: new THREE.ConeGeometry(0.95, 1.9, lo ? 8 : 14), pos: [0, 0.95, 0], rot: [Math.PI, 0, 0] },
]));
const iceScoopsGeometry = withLod((lo) => mergeParts([
  { geo: new THREE.SphereGeometry(1.02, lo ? 9 : 14, lo ? 7 : 12), pos: [0, 2.25, 0] },
  { geo: new THREE.SphereGeometry(0.72, lo ? 8 : 12, lo ? 6 : 10), pos: [-0.55, 2.95, 0.1] },
  { geo: new THREE.SphereGeometry(0.2, lo ? 5 : 10, lo ? 4 : 8), pos: [0, 3.35, 0] }, // cherry
]));

const cookieGeometry = withLod((lo) => mergeParts([
  { geo: new THREE.CylinderGeometry(1.5, 1.35, 0.65, lo ? 10 : 16), pos: [0, 0.32, 0] },
  { geo: new THREE.CylinderGeometry(1.05, 1.0, 0.5, lo ? 9 : 14), pos: [0.3, 0.85, 0.1] },
  { geo: new THREE.SphereGeometry(0.3, lo ? 5 : 8, lo ? 4 : 6), pos: [-0.7, 0.75, 0.6], scale: [1, 0.6, 1] },
  { geo: new THREE.SphereGeometry(0.25, lo ? 5 : 8, lo ? 4 : 6), pos: [0.95, 0.55, -0.5], scale: [1, 0.6, 1] },
]));

export function createWorld(scene, track, renderer, TEX = {}, river = null) {
  const world = new THREE.Group();
  world.name = 'candyWorld';
  // Landmark footprints (river, tunnel, cakes): nothing is planted there
  const blocked = (x, z) => !!(river && river.blocks(x, z));
  // real image textures (assets/textures) with the procedural canvases as fallback
  const mapOr = (tex, fallback) => tex || fallback();
  scene.add(world);

  // ---------- sky & lights ----------
  const sky = skyDome();
  sky.traverse((o) => { o.userData.noCollide = true; }); // the dome wraps the world
  // warm sun glow high in the sky — fixed direction, rides with the dome
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: sunTexture(), transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, opacity: 0.95,
  }));
  sunGlow.scale.setScalar(430);
  sunGlow.position.set(60, 95, -50).normalize().multiplyScalar(640);
  sky.add(sunGlow);
  world.add(sky);
  scene.fog = new THREE.Fog(0x9fd8ff, 150, 620);

  const hemi = new THREE.HemisphereLight(0xbfe4ff, 0xffb8dc, 0.92);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffedc9, 1.78);
  sun.position.set(60, 95, -50);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 320;
  const sc = sun.shadow.camera;
  sc.left = -70; sc.right = 70; sc.top = 70; sc.bottom = -70;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  scene.add(sun.target);

  // sun glow sprite
  const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: (() => {
      const c = document.createElement('canvas'); c.width = c.height = 128;
      const g = c.getContext('2d');
      const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
      grd.addColorStop(0, 'rgba(255,244,214,1)');
      grd.addColorStop(0.35, 'rgba(255,222,170,0.55)');
      grd.addColorStop(1, 'rgba(255,210,150,0)');
      g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })(),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  sunSprite.scale.set(190, 190, 1);
  sunSprite.position.set(track.bounds.center.x + 320, 380, track.bounds.center.z - 420);
  world.add(sunSprite);

  // ---------- clouds (soft, puffy — candy-cotton sky) ----------
  const cloudTex = cloudTexture();
  const clouds = [];
  for (let i = 0; i < 22; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({
      map: cloudTex, transparent: true, opacity: 0.62 + Math.random() * 0.28, depthWrite: false,
    }));
    const s = 80 + Math.random() * 110;
    m.scale.set(s * 1.8, s, 1);
    const a = Math.random() * Math.PI * 2;
    const r = 300 + Math.random() * 380;
    m.position.set(track.bounds.center.x + Math.cos(a) * r, 110 + Math.random() * 140, track.bounds.center.z + Math.sin(a) * r);
    world.add(m);
    clouds.push({ sprite: m, drift: 1.2 + Math.random() * 2.2 });
  }

  // ---------- 3D puff-cloud clusters (cotton-candy volumes near the horizon) ----------
  const puffMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, transparent: true, opacity: 0.94 });
  for (let i = 0; i < 8; i++) {
    const cluster = new THREE.Group();
    const n = 5 + Math.floor(Math.random() * 4);
    for (let j = 0; j < n; j++) {
      const r = 7 + Math.random() * 11;
      const p = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), puffMat);
      p.position.set((Math.random() - 0.5) * 32, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 15);
      p.scale.y = 0.68;
      cluster.add(p);
    }
    const a = Math.random() * Math.PI * 2;
    const rr = 170 + Math.random() * 260;
    cluster.position.set(track.bounds.center.x + Math.cos(a) * rr, 52 + Math.random() * 75, track.bounds.center.z + Math.sin(a) * rr);
    mergeByMaterial(cluster); // 5-9 puffs -> 1 draw call, still drifts as a unit
    world.add(cluster);
    clouds.push({ sprite: cluster, drift: 0.8 + Math.random() * 1.6 });
  }

  // ---------- hero clouds: big soft volumes near the course (frame the sky) --
  for (let i = 0; i < 7; i++) {
    const cluster = new THREE.Group();
    const n = 8 + Math.floor(Math.random() * 4);
    for (let j = 0; j < n; j++) {
      const r = 10 + Math.random() * 14;
      const p = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), puffMat);
      p.position.set((Math.random() - 0.5) * 44, (Math.random() - 0.5) * 11, (Math.random() - 0.5) * 20);
      p.scale.y = 0.66;
      cluster.add(p);
    }
    const a = (i / 7) * Math.PI * 2 + 0.7;
    const rr = 150 + Math.random() * 150;
    cluster.position.set(track.bounds.center.x + Math.cos(a) * rr, 52 + Math.random() * 42, track.bounds.center.z + Math.sin(a) * rr);
    mergeByMaterial(cluster); // 8-11 transparent puffs -> 1 draw call
    world.add(cluster);
    clouds.push({ sprite: cluster, drift: 0.5 + Math.random() * 0.9 });
  }

  // ---------- rainbows arching over the road (plus the castle one) ----------
  const rainbowCols = ['#ff6b81', '#ffb14e', '#ffe66d', '#6bd96b', '#56c8ff', '#a06bff'];
  // one material per band, shared by all three arches so they merge to 6 calls
  const rainbowMats = rainbowCols.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, emissive: new THREE.Color(c), emissiveIntensity: 0.12 }));
  const rainbowGroup = new THREE.Group();
  [0.18, 0.55, 0.86].forEach((u, ri) => {
    if (track.isCakeSection(track.length * u)) return;
    const p = track.getPose(track.length * u, 0);
    const rainbow = new THREE.Group();
    rainbowCols.forEach((c, i) => {
      rainbow.add(new THREE.Mesh(new THREE.TorusGeometry(10.5 - i * 1.15, 0.62, 8, 26, Math.PI), rainbowMats[i]));
    });
    rainbow.position.copy(p.pos);
    rainbow.position.y += 1.2;
    rainbow.lookAt(
      p.pos.x + Math.sin(p.heading),
      p.pos.y + 1.2,
      p.pos.z + Math.cos(p.heading)
    );
    rainbowGroup.add(rainbow);
  });
  rainbowGroup.traverse((o) => { if (o.isMesh) o.userData.noCollide = true; }); // overhead: car passes under
  mergeByMaterial(rainbowGroup);
  world.add(rainbowGroup);

  // ---------- distant mountains (ring around the course) ----------
  // cool lavender-blue mountains: aerial perspective, distant like the reference
  const mountainMat = new THREE.MeshStandardMaterial({ color: '#c3b3e6', roughness: 0.9, flatShading: true });
  const mountainMatB = new THREE.MeshStandardMaterial({ color: '#d8c4ea', roughness: 0.9, flatShading: true });
  const capMat = new THREE.MeshStandardMaterial({ color: '#f2f6ff', roughness: 0.85, flatShading: true });
  // helper: nearest track sample distance (XZ) so a mountain can NEVER overlap the road
  const tSamples = track.samples;
  const mountainDebug = [];
  const minDistToTrack = (x, z) => {
    let m = Infinity;
    for (const p of tSamples) {
      const dx = p.x - x, dz = p.z - z;
      const d2 = dx * dx + dz * dz;
      if (d2 < m) m = d2;
    }
    return Math.sqrt(m);
  };
  const mountainGroup = new THREE.Group();
  world.add(mountainGroup);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.35;
    const r = 560 + (i % 3) * 160;
    const h = 52 + (i * 29) % 48; // soft candy hills, not giant pyramids
    const mx = track.bounds.center.x + Math.cos(a) * r;
    const mz = track.bounds.center.z + Math.sin(a) * r;
    // clamp base radius so the cone keeps clear of the track (bug: slopes on the road)
    const mdist = minDistToTrack(mx, mz);
    const rMax = Math.max(45, mdist - 90);
    const baseR = Math.min(90 + (i % 4) * 35, rMax);
    mountainDebug.push({ mx: Math.round(mx), mz: Math.round(mz), mdist: Math.round(mdist), baseR: Math.round(baseR), h });
    const m = new THREE.Mesh(new THREE.ConeGeometry(baseR, h, 10), i % 2 ? mountainMat : mountainMatB);
    m.position.set(
      mx,
      h / 2 - 20,
      mz
    );
    mountainGroup.add(m);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(baseR * 0.42, h * 0.32, 10), capMat);
    cap.position.set(0, h * 0.36, 0); // local to the mountain — moves with it
    m.add(cap);
  }
  mergeByMaterial(mountainGroup); // 32 cones -> 3 draw calls

  // ---------- the Sugar Castle ----------
  function buildCastle(scale = 1) {
    const castle = new THREE.Group();
    // wafer-brick map (assets/textures/wall.webp) tinted by the pink wall colours;
    // the cream trim (wallC: crenellations, teeth, stairs) stays smooth icing
    const wall = new THREE.MeshStandardMaterial({ color: '#ffb7d9', map: TEX.wall || null, roughness: 0.55, metalness: 0.05 });
    const wallB = new THREE.MeshStandardMaterial({ color: '#ff8fc6', map: TEX.wall || null, roughness: 0.55 });
    const wallC = new THREE.MeshStandardMaterial({ color: '#ffd7ea', roughness: 0.5 });
    const roof = new THREE.MeshStandardMaterial({ color: '#ff4f96', roughness: 0.4, metalness: 0.12, emissive: '#7a1044', emissiveIntensity: 0.22 });
    const roofB = new THREE.MeshStandardMaterial({ color: '#8f6bff', roughness: 0.4, metalness: 0.12, emissive: '#2c1270', emissiveIntensity: 0.22 });
    const roofC = new THREE.MeshStandardMaterial({ color: '#56c8ff', roughness: 0.4, metalness: 0.12, emissive: '#0d3a66', emissiveIntensity: 0.22 });
    const gold = new THREE.MeshStandardMaterial({ color: '#ffd45e', roughness: 0.3, metalness: 0.85, emissive: '#7a5c10', emissiveIntensity: 0.35 });
    const winMat = new THREE.MeshStandardMaterial({ color: '#6a2c8c', emissive: '#ffb347', emissiveIntensity: 0.85, roughness: 0.3 });
    const doorMat = new THREE.MeshStandardMaterial({ color: '#a3562e', roughness: 0.55, metalness: 0.15 });

    // ---- candy-rock platform + terraces ----
    const plat = new THREE.Mesh(new RoundedBoxGeometry(54, 5, 38, 3, 1.6), wallC);
    plat.position.y = 2.5;
    castle.add(plat);
    const terrace = new THREE.Mesh(new RoundedBoxGeometry(46, 3.4, 30, 3, 1.3), wall);
    terrace.position.y = 6.4;
    castle.add(terrace);
    // front stairs (3 wide steps down from the gate terrace)
    for (let i = 0; i < 3; i++) {
      const st = new THREE.Mesh(new RoundedBoxGeometry(14 - i * 1.2, 1.15, 2.4, 2, 0.35), wallC);
      st.position.set(0, 6.9 - i * 1.15, 16.2 + i * 1.35);
      castle.add(st);
    }

    // ---- curtain wall ring (10 segments) with crenellations ----
    const WRX = 19.5, WRZ = 11.5;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const a2 = ((i + 1) / 10) * Math.PI * 2;
      const x1 = Math.cos(a) * WRX, z1 = Math.sin(a) * WRZ;
      const x2 = Math.cos(a2) * WRX, z2 = Math.sin(a2) * WRZ;
      const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
      const len = Math.hypot(x2 - x1, z2 - z1) + 1.2;
      const w = new THREE.Mesh(new RoundedBoxGeometry(len, 8.2, 2.3, 2, 0.5), i % 2 ? wall : wallB);
      w.position.set(mx, 12.2, mz);
      w.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
      castle.add(w);
      // crenellations (sugar cubes)
      for (let k = 0; k < 4; k++) {
        const t = (k + 0.5) / 4;
        const cx = x1 + (x2 - x1) * t, cz = z1 + (z2 - z1) * t;
        const cube = new THREE.Mesh(new RoundedBoxGeometry(len / 7.2, 1.5, 2.9, 2, 0.3), wallC);
        cube.position.set(cx, 17.05, cz);
        cube.rotation.y = w.rotation.y;
        castle.add(cube);
      }
      // banner poles on the wall between towers
      if (i % 2 === 1) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.4, 6), gold);
        pole.position.set(mx, 20.2, mz);
        const pen = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.4, 4), i % 4 === 1 ? roof : roofC);
        pen.rotation.z = Math.PI / 2;
        pen.position.set(mx + 1.15, 21.6, mz);
        castle.add(pole, pen);
      }
    }

    // ---- towers ----
    const tower = (x, z, r, h, mat, rmat, flag = true, tiers = 1) => {
      const t = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.12, h, 14), mat);
      body.position.y = h / 2;
      t.add(body);
      // gold trim ring + crown parapet
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 1.12, 0.32, 8, 20), gold);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = h - 0.4;
      t.add(ring);
      const top = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.24, r * 1.24, 1.3, 14), wallB);
      top.position.y = h + 0.35;
      t.add(top);
      // little parapet teeth
      for (let k = 0; k < 7; k++) {
        const aa = (k / 7) * Math.PI * 2;
        const tooth = new THREE.Mesh(new RoundedBoxGeometry(r * 0.42, 1.15, r * 0.42, 2, 0.18), wallC);
        tooth.position.set(Math.cos(aa) * r * 1.1, h + 1.45, Math.sin(aa) * r * 1.1);
        t.add(tooth);
      }
      let yTop = h + 1.2;
      for (let tt = 0; tt < tiers; tt++) {
        const rr = r * (1.32 - tt * 0.26);
        const cone = new THREE.Mesh(new THREE.ConeGeometry(rr, r * (2.5 - tt * 0.35), 14), tt === 0 ? rmat : (tt % 2 ? roofB : roofC));
        cone.position.y = yTop + r * (1.25 - tt * 0.17);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(rr * 0.22, 10, 8), gold);
        ball.position.y = yTop + r * (2.5 - tt * 0.35) + r * (1.25 - tt * 0.17) - r * 0.15;
        t.add(cone, ball);
        yTop += r * (1.55 - tt * 0.1);
      }
      // window rows (3 rows x 2 sides)
      for (let k = 0; k < 3; k++) {
        for (const side of [0, Math.PI / 2]) {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.24, r * 0.24, 0.7, 10), winMat);
          w.rotation.x = Math.PI / 2;
          w.position.set(Math.sin(side) * r * 0.98, h * (0.32 + k * 0.2), Math.cos(side) * r * 0.98);
          t.add(w);
        }
      }
      if (flag) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.6, 6), gold);
        pole.position.y = yTop + r * 2.2;
        const f = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.4), new THREE.MeshStandardMaterial({ color: ['#ff4f96', '#ffd45e', '#56c8ff'][Math.floor(Math.abs(x)) % 3], side: THREE.DoubleSide, roughness: 0.5 }));
        f.position.set(1.45, yTop + r * 2.2 + 1.2, 0);
        t.add(pole, f);
      }
      t.position.set(x, 0, z);
      return t;
    };

    // wall-joint towers
    for (let i = 0; i < 10; i += 2) {
      const a = (i / 10) * Math.PI * 2 + 0.314;
      castle.add(tower(Math.cos(a) * WRX, Math.sin(a) * WRZ, 2.7, 13.5 + (i % 4) * 1.3, i % 4 ? wall : wallB, i % 4 ? roof : roofB, true, 1));
    }
    // gate towers (front, taller)
    castle.add(tower(-7.6, 10.2, 3.2, 16.5, wall, roof, true, 1));
    castle.add(tower(7.6, 10.2, 3.2, 16.5, wall, roof, true, 1));

    // ---- grand keep (3 tiers + crown spire) ----
    const keep = tower(0, -2.2, 5.2, 25, wall, roof, true, 2);
    castle.add(keep);
    const keepTop = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.9, 6.4, 14), wallB);
    keepTop.position.set(0, 30.2, -2.2);
    castle.add(keepTop);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(3.7, 9.5, 14), roofB);
    crown.position.set(0, 38.1, -2.2);
    castle.add(crown);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(1.15, 12, 10), gold);
    orb.position.set(0, 43.6, -2.2);
    castle.add(orb);
    // keep window columns (4 sides x 4 rows)
    for (let row = 0; row < 4; row++) {
      for (let s2 = 0; s2 < 4; s2++) {
        const aa = (s2 / 4) * Math.PI * 2 + Math.PI / 4;
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.75, 10), winMat);
        w.rotation.x = Math.PI / 2;
        w.position.set(Math.sin(aa) * 5.15, 9.5 + row * 4.1, -2.2 + Math.cos(aa) * 5.15);
        castle.add(w);
      }
    }
    // keep side turrets
    castle.add(tower(-6.8, -6.2, 2.2, 19, wallB, roofC, true, 1));
    castle.add(tower(6.8, -6.2, 2.2, 19, wallB, roofC, true, 1));

    // ---- gatehouse: arch + gold doors + portcullis ----
    const gateBox = new THREE.Mesh(new RoundedBoxGeometry(15, 10.5, 3.4, 3, 0.9), wallB);
    gateBox.position.set(0, 13.3, 11.6);
    castle.add(gateBox);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(3.6, 1.15, 10, 22, Math.PI), gold);
    arch.position.set(0, 10.6, 13.35);
    castle.add(arch);
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(3.35, 6.6, 0.55), doorMat);
    doorL.position.set(-1.72, 8.4, 13.15);
    const doorR = doorL.clone();
    doorR.position.x = 1.72;
    castle.add(doorL, doorR);
    for (let k = 0; k < 3; k++) {
      for (const sx of [-1.72, 1.72]) {
        const stud = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), gold);
        stud.position.set(sx, 6.4 + k * 2.1, 13.5);
        castle.add(stud);
      }
    }
    // portcullis bars (gold)
    for (let k = 0; k < 5; k++) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 6.2, 6), gold);
      bar.position.set(-2.55 + k * 1.28, 8.6, 13.48);
      castle.add(bar);
    }

    // rainbow over the gate
    const rainbow = new THREE.Group();
    const cols = ['#ff6b81', '#ffb14e', '#ffe66d', '#6bd96b', '#56c8ff', '#a06bff'];
    cols.forEach((c, i) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(8.2 - i * 0.95, 0.55, 8, 26, Math.PI), new THREE.MeshStandardMaterial({ color: c, roughness: 0.45 }));
      rainbow.add(t);
    });
    rainbow.position.set(0, 2.5, 11.2);
    rainbow.traverse((o) => { if (o.isMesh) o.userData.noCollide = true; });
    castle.add(rainbow);

    // balloon bunches at the gate corners
    for (const sx of [-11.5, 11.5]) {
      const bunch = new THREE.Group();
      for (let k = 0; k < 5; k++) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(1.15 - k * 0.09, 12, 10), new THREE.MeshStandardMaterial({ color: ['#ff5f7a', '#56c8ff', '#ffd45e', '#8ef07e', '#b18aff'][k], roughness: 0.3 }));
        b.position.set(Math.sin(k * 2.1) * 1.5, 20.2 + k * 1.35, Math.cos(k * 2.1) * 1.5);
        bunch.add(b);
      }
      bunch.position.set(sx, 0, 12.4);
      castle.add(bunch);
    }

    castle.scale.setScalar(scale);
    // big masses cast shadows; tiny trim (windows, studs, teeth, flags) does not —
    // keeps the shadow pass affordable on mobile GPUs
    castle.traverse((o) => {
      if (!o.isMesh) return;
      o.receiveShadow = true;
      o.geometry.computeBoundingSphere();
      const r = o.geometry.boundingSphere.radius * Math.max(o.scale.x, o.scale.y, o.scale.z, 1);
      o.castShadow = r > 1.2;
    });
    // one mesh per material: 317 meshes -> ~12 draw calls, identical picture
    mergeByMaterial(castle);
    return castle;
  }

  // Place the big castle beside the finish line; a second one looms mid-ride.
  const finPose = track.getPose(track.length * 0.985, 0);
  const castleMain = buildCastle(1.5);
  castleMain.position.copy(finPose.pos).add(
    new THREE.Vector3(Math.cos(finPose.heading) * 42, -3.2, -Math.sin(finPose.heading) * 42)
  );
  castleMain.lookAt(finPose.pos.x, castleMain.position.y + 6, finPose.pos.z);
  world.add(castleMain);
  const midPose = track.getPose(track.cakeSection.s0 - 70, 0);
  const castleFar = buildCastle(1.2);
  castleFar.position.copy(midPose.pos).add(
    new THREE.Vector3(Math.cos(midPose.heading) * 95, -3.5, -Math.sin(midPose.heading) * 95)
  );
  castleFar.lookAt(midPose.pos.x, castleFar.position.y + 6, midPose.pos.z);
  world.add(castleFar);

  // ---------- drive-under candy gates (car passes beneath) ------------------
  {
    const gateMat = new THREE.MeshStandardMaterial({ map: mapOr(TEX.cane, () => stripeTexture('#ff4b6e', '#fff6f0')), roughness: 0.42 });
    const gumdropMat = new THREE.MeshStandardMaterial({ color: '#8f6bff', roughness: 0.35, emissive: '#2c1270', emissiveIntensity: 0.25 });
    const dropMats = ['#ff6b81', '#ffd45e', '#6bd96b', '#56c8ff', '#ff8ad0'].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.32 }));
    const gates = new THREE.Group();
    world.add(gates);
    for (const u of [0.18, 0.50, 0.78]) {
      if (track.isCakeSection(track.length * u)) continue; // cake deck has its own rails
      const gp = track.getPose(track.length * u, 0);
      const gate = new THREE.Group();
      const R = 8.9;
      for (const s of [-1, 1]) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, 8.6, 14), gateMat);
        pillar.position.set(s * R, 4.3, 0);
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.9, 1.1, 14), gumdropMat);
        foot.position.set(s * R, 0.55, 0);
        const cap = new THREE.Mesh(new THREE.SphereGeometry(1.5, 12, 10), gumdropMat);
        cap.position.set(s * R, 9.2, 0);
        gate.add(pillar, foot, cap);
      }
      const arc = new THREE.Mesh(new THREE.TorusGeometry(R, 1.2, 10, 30, Math.PI), gateMat);
      arc.position.y = 8.6;
      gate.add(arc);
      // hanging gummy drops along the beam
      for (let k = 0; k < 5; k++) {
        const a = Math.PI * (0.18 + k * 0.16);
        const hx = Math.cos(a) * R, hy = 8.6 + Math.sin(a) * R;
        const drop = new THREE.Mesh(new THREE.SphereGeometry(0.85, 10, 8), dropMats[k]);
        drop.position.set(hx, hy - 1.35, 0);
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 5), gateMat);
        cord.position.set(hx, hy - 0.55, 0);
        gate.add(drop, cord);
      }
      gate.position.copy(gp.pos);
      gate.rotation.y = gp.heading;
      gate.traverse((o) => { if (o.isMesh) o.userData.noCollide = true; });
      gates.add(gate);
    }
    mergeByMaterial(gates); // 3 gates x 17 meshes -> 7 draws
  }

  // ---------- castle grounds: chocolate apron, candy bridge, royal garden ----
  // All pieces are groups sized to stay >= 12 m off the track centerline.
  {
    const chocMat = new THREE.MeshStandardMaterial({ color: '#5a2f1a', roughness: 0.35, metalness: 0.12 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: '#ffd7ea', roughness: 0.55 });
    const knobMats = ['#fff2f7', '#ff6b9e'].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 }));
    const crownMats = ['#8f6bff', '#ff5fa2'].map((c) => new THREE.MeshStandardMaterial({ map: swirlTexture(c, '#fff2f7'), roughness: 0.42 }));
    const grounds = (pos, toward, sc) => {
      const dir = toward.clone().sub(pos).setY(0).normalize(); // toward the track
      const side = new THREE.Vector3(-dir.z, 0, dir.x);
      const grp = new THREE.Group();
      // chocolate apron under the terrace (stays inside the platform footprint)
      const apron = new THREE.Mesh(new RoundedBoxGeometry(57 * sc, 1.4, 39 * sc, 3, 0.7), chocMat);
      apron.position.y = -0.9;
      grp.add(apron);
      // candy bridge from the gate out over the apron (never reaches the road)
      const bridge = new THREE.Group();
      const deck = new THREE.Mesh(new RoundedBoxGeometry(8 * sc, 1.0 * sc, 14 * sc, 3, 0.4), stoneMat);
      deck.position.y = 0.25;
      bridge.add(deck);
      for (const s of [-1, 1]) {
        for (let k = 0; k < 4; k++) {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.45 * sc, 0.45 * sc, 2.1 * sc, 8), stoneMat);
          post.position.set(s * 3.7 * sc, 1.15 * sc, (-4.5 + k * 3) * sc);
          const ball = new THREE.Mesh(new THREE.SphereGeometry(0.58 * sc, 10, 8), knobMats[k % 2]);
          ball.position.set(s * 3.7 * sc, 2.5 * sc, (-4.5 + k * 3) * sc);
          bridge.add(post, ball);
        }
      }
      bridge.position.copy(dir).multiplyScalar(15.5 * sc);
      bridge.position.y = -1.2;
      bridge.rotation.y = Math.atan2(dir.x, dir.z);
      grp.add(bridge);
      // royal garden: swirl lollipop topiary flanking the approach
      for (let k = 0; k < 8; k++) {
        const s = k % 2 ? 1 : -1;
        const along = -24 + Math.floor(k / 2) * 7.5;
        const base = dir.clone().multiplyScalar(along * sc).addScaledVector(side, s * 15.5 * sc);
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.62, 5.2, 8), stoneMat);
        trunk.position.set(base.x, 1.2, base.z);
        const crown = new THREE.Mesh(new THREE.SphereGeometry(2.5, 12, 10), crownMats[k % 2]);
        crown.position.set(base.x, 5.4, base.z);
        grp.add(trunk, crown);
      }
      grp.position.copy(pos);
      grp.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      mergeByMaterial(grp, { noCollide: false }); // ~34 meshes (16 own textures) -> 5 draws
      world.add(grp);
    };
    grounds(castleMain.position, finPose.pos, 1.5);
    grounds(castleFar.position, midPose.pos, 1.2);
  }

  // ---------- rollercoaster rails (background fun, near mid-course) ----------
  const c0 = track.getPose(track.fromBaseDistance(track.baseLength * 0.76), 0);
  const sideDir = new THREE.Vector3(Math.cos(c0.heading), 0, -Math.sin(c0.heading));
  const base = c0.pos.clone().addScaledVector(sideDir, 70);
  const coasterCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(base.x - 60, 6, base.z - 25), new THREE.Vector3(base.x - 20, 26, base.z),
    new THREE.Vector3(base.x + 20, 34, base.z - 7),
    new THREE.Vector3(base.x + 48, 18, base.z - 35), new THREE.Vector3(base.x + 30, 8, base.z - 60),
    new THREE.Vector3(base.x - 8, 16, base.z - 70), new THREE.Vector3(base.x - 46, 30, base.z - 60),
    new THREE.Vector3(base.x - 72, 18, base.z - 40), new THREE.Vector3(base.x - 60, 6, base.z - 25),
  ], true, 'catmullrom', 0.6);
  const railMat = new THREE.MeshStandardMaterial({ color: '#fff2f7', roughness: 0.35, metalness: 0.35 });
  const coasterRig = new THREE.Group();
  world.add(coasterRig);
  const railA = new THREE.Mesh(new THREE.TubeGeometry(coasterCurve, 120, 0.55, 8, true), railMat);
  coasterRig.add(railA);
  for (let i = 0; i < 22; i++) {
    const p = coasterCurve.getPointAt(i / 22);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, Math.max(2, p.y), 8), railMat);
    post.position.set(p.x, p.y / 2 - 2, p.z);
    coasterRig.add(post);
  }
  mergeByMaterial(coasterRig, { castShadow: false, receiveShadow: false, noCollide: false }); // 23 -> 1 draw

  // ---------- a candy coaster train riding the loop (living background) -----
  const coasterCars = [];
  {
    const CAR_COLORS = ['#ff4f96', '#ffd45e', '#56c8ff', '#8ef07e', '#b18aff', '#ff8a5c'];
    for (let i = 0; i < 6; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new RoundedBoxGeometry(1.5, 0.85, 2.3, 3, 0.3),
        new THREE.MeshStandardMaterial({ color: CAR_COLORS[i % CAR_COLORS.length], roughness: 0.32, metalness: 0.18, clearcoat: 0.6 })
      );
      body.position.y = 0.5;
      const roof = new THREE.Mesh(
        new RoundedBoxGeometry(1.25, 0.42, 1.95, 3, 0.2),
        new THREE.MeshStandardMaterial({ color: '#fff2f7', roughness: 0.4 })
      );
      roof.position.y = 1.12;
      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 10, 8),
        new THREE.MeshPhysicalMaterial({ color: '#bfe9ff', roughness: 0.06, metalness: 0.35, transparent: true, opacity: 0.42 })
      );
      canopy.position.y = 1.24;
      canopy.scale.set(1, 0.72, 1.15);
      // little waving rider bunny ears poking out
      for (const sx of [-0.35, 0.35]) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.34, 6), new THREE.MeshStandardMaterial({ color: '#fff2f7', roughness: 0.6 }));
        ear.position.set(sx, 1.55, -0.2);
        ear.rotation.z = sx > 0 ? -0.18 : 0.18;
        g.add(ear);
      }
      g.add(body, roof, canopy);
      g.scale.setScalar(2.3); // readable from the track: a real train, not dots
      g.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.userData.noCollide = true; } });
      world.add(g);
      coasterCars.push(g);
    }
  }
  const coasterPt = new THREE.Vector3(), coasterTan = new THREE.Vector3();

  // ---------- instanced props along the track ----------
  const propMats = {
    lolli: [['#ff5fa2', TEX.lolliPink], ['#56c8ff', TEX.lolliBlue], ['#ffd45e', TEX.lolliYellow]].map(([c, tex]) =>
      new THREE.MeshStandardMaterial({ map: mapOr(tex, () => swirlTexture(c, '#fff2f7')), roughness: 0.36, metalness: 0.05 })),
    cane: new THREE.MeshStandardMaterial({ map: mapOr(TEX.cane, () => stripeTexture()), roughness: 0.42 }),
    bear: new THREE.MeshPhysicalMaterial({ roughness: 0.22, metalness: 0.05, transparent: true, opacity: 0.9, clearcoat: 0.9, clearcoatRoughness: 0.25, emissive: 0x301018, emissiveIntensity: 0.25 }),
    // tint bases: the near-white sugar maps are multiplied by the instance colours
    tree: new THREE.MeshStandardMaterial({ map: TEX.gumdrop || null, roughness: 0.6 }),
    marsh: new THREE.MeshStandardMaterial({ map: TEX.marshmallow || null, roughness: 0.7 }),
    ice: new THREE.MeshStandardMaterial({ map: TEX.marshmallow || null, roughness: 0.5 }),
    cone: new THREE.MeshStandardMaterial({ map: TEX.roadWaffle || null, color: TEX.roadWaffle ? '#ffffff' : '#e8b060', roughness: 0.7 }),
    cookie: new THREE.MeshStandardMaterial({ map: mapOr(TEX.cookie, cookieTexture), roughness: 0.75 }),
    ginger: new THREE.MeshStandardMaterial({ map: TEX.gingerbread || mapOr(TEX.cookie, cookieTexture), roughness: 0.7 }),
    stick: new THREE.MeshStandardMaterial({ color: '#fff6ee', roughness: 0.5 }),
  };

  // Roadside density. The course used to stack 8 bands of props (knock fence,
  // shoulder bears, main props, crowd, pebbles, candy strip, two wall bands) at
  // ~2.5 props per metre — the eye had nowhere to rest and every frame drew
  // thousands of instances. These keep each band's identity but thin it out.
  const DECOR = {
    main: 0.65,       // main zone props 8-25 m: share of slots used (was every slot)
    wall: 0.28,       // small candy wall, 13.6-17 m (was 0.85 per slot/side)
    filler: 0.15,     // mid-field filler band (was 0.55)
    shoulderBear: 0.12, // mini bears just past the curb (was 0.38)
    knockCanes: 210, knockLollis: 110, // knockable shoulder fence (was 430 + 230)
    stripSkip: 0.7,   // candy strip behind the fence: share of slots left empty (was 0.22)
    pebbles: 300,     // gumdrop pebbles on the grass (was 520)
    flowerKeep: 0.6,  // meadow flowers (was 0.8)
    chocKeep: 0.4,    // cocoa canyon crystals (was 0.55)
    buntingKeep: 0.6, // finish-run bunting poles (was 0.9)
  };
  const placements = { lolli0: [], lolli1: [], lolli2: [], cane: [], bear: [], tree: [], marsh: [], ice: [], cookie: [] };
  // finish grandstand: gummy-bear fans in two staggered rows ALONG the road
  const GRAND = { s0: track.length * 0.935, s1: track.length * 0.985, step: 6.5, lat: [10.1, 11.3] };
  const rand = (() => { let s = 1234567; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

  const L = track.length;
  for (let s = 10; s < L - 14; s += 4.2) {
    const u = s / L;
    const z = track.zoneAt(u);
    const side = Math.floor(s / 4.2) % 2 ? 1 : -1;
    // keep the road corridor clear: props never closer than 8.2 m, big scale only far away
    const far = 8.2 + rand() * 17;
    const lateral = side * far;
    const ps = s + (rand() - 0.5) * 4;
    const { pos, heading } = track.getPose(ps, lateral);
    const scMax = Math.min(2.8, 0.9 + far * 0.11);
    const slot = { s: ps, x: pos.x, y: pos.y - far * 0.1 - 0.35, z: pos.z, ry: heading + (rand() - 0.5) * 1.2, sc: 1.0 + rand() * (scMax - 1.0) };

    const roll = rand();
    if (rand() > DECOR.main) { /* breathing room: no main prop on this slot */ } else if (z.id === 0) {
      if (roll < 0.42) placements[`lolli${Math.floor(rand() * 3)}`].push(slot);
      else if (roll < 0.62) placements.tree.push(slot);
      else if (roll < 0.82) placements.cane.push(slot);
      else placements.marsh.push(slot);
    } else if (z.id === 1) {
      if (roll < 0.42) placements.bear.push({ ...slot, sc: 1.1 + rand() * 1.2 });
      else if (roll < 0.62) placements.cane.push(slot);
      else if (roll < 0.8) placements.tree.push(slot);
      else placements[`lolli${Math.floor(rand() * 3)}`].push(slot);
    } else if (z.id === 2) {
      if (roll < 0.4) placements.cookie.push({ ...slot, sc: 1.1 + rand() * 1.6 });
      else if (roll < 0.62) placements.cane.push(slot);
      else if (roll < 0.82) placements.bear.push({ ...slot, sc: 1 + rand() });
      else placements.ice.push(slot);
    } else if (z.id === 3) {
      if (roll < 0.38) placements.marsh.push({ ...slot, sc: 1 + rand() * 1.3 });
      else if (roll < 0.62) placements.ice.push({ ...slot, sc: 0.9 + rand() * 1.1 });
      else if (roll < 0.82) placements.tree.push(slot);
      else placements[`lolli${Math.floor(rand() * 3)}`].push(slot);
    } else {
      if (roll < 0.3) placements.bear.push({ ...slot, sc: 1.1 + rand() });
      else if (roll < 0.52) placements[`lolli${Math.floor(rand() * 3)}`].push(slot);
      else if (roll < 0.72) placements.cane.push(slot);
      else if (roll < 0.88) placements.marsh.push(slot);
      else placements.ice.push(slot);
    }
    // roadside candy walls both sides (small, just off the shoulder — knockable zone)
    for (const wallSide of [-1, 1]) {
      if (rand() < DECOR.wall) {
        const ws = s + (rand() - 0.5) * 3;
        const wp = track.getPose(ws, wallSide * (13.6 + rand() * 3.4));
        const slotW = { s: ws, x: wp.pos.x, y: wp.pos.y - 0.3, z: wp.pos.z, ry: rand() * Math.PI * 2, sc: 0.5 + rand() * 0.35 };
        const roll2 = rand();
        if (roll2 < 0.36) placements[`lolli${Math.floor(rand() * 3)}`].push(slotW);
        else if (roll2 < 0.62) placements.cane.push(slotW);
        else if (roll2 < 0.82) placements.marsh.push(slotW);
        else placements.bear.push({ ...slotW, sc: 0.65 + rand() * 0.35, ry: wp.heading + Math.PI });
      }
      // mid-field filler band (8.6-12 m) — fills the frame edges, clear of the corridor
      if (rand() < DECOR.filler) {
        const ms = s + (rand() - 0.5) * 4;
        const mp = track.getPose(ms, wallSide * (13.8 + rand() * 3.2));
        const slotM = { s: ms, x: mp.pos.x, y: mp.pos.y - 0.5, z: mp.pos.z, ry: rand() * Math.PI * 2, sc: 0.55 + rand() * 0.6 };
        const roll3 = rand();
        if (roll3 < 0.3) placements[`lolli${Math.floor(rand() * 3)}`].push(slotM);
        else if (roll3 < 0.5) placements.cane.push(slotM);
        else if (roll3 < 0.68) placements.marsh.push(slotM);
        else if (roll3 < 0.84) placements.ice.push(slotM);
        else placements.tree.push(slotM);
      }
    }
    if (rand() < DECOR.shoulderBear) {
      const bp = track.getPose(s + 1, side * (7.2 + rand() * 1.4));
      placements.bear.push({ s: s + 1, x: bp.pos.x, y: bp.pos.y - 0.3, z: bp.pos.z, ry: bp.heading + Math.PI + (rand() - 0.5) * 0.8, sc: 0.95 + rand() * 0.5 });
    }
  }

  // giant hero lollipops & canes lining the course
  const heroSpots = [0.05, 0.10, 0.16, 0.22, 0.28, 0.35, 0.42, 0.49, 0.56, 0.63, 0.70, 0.77, 0.84, 0.90, 0.95];
  heroSpots.forEach((u, i) => {
    const side = i % 2 ? 1 : -1;
    const hs = track.length * u;
    const p = track.getPose(hs, side * (14.5 + (i % 3) * 3.5));
    if (i % 3 === 0) placements.lolli0.push({ s: hs, x: p.pos.x, y: p.pos.y - 1, z: p.pos.z, ry: i, sc: 3.6 + (i % 2) * 1.3 });
    else if (i % 3 === 1) placements.lolli1.push({ s: hs, x: p.pos.x, y: p.pos.y - 1, z: p.pos.z, ry: i, sc: 3.9 + (i % 2) });
    else placements.cane.push({ s: hs, x: p.pos.x, y: p.pos.y - 1, z: p.pos.z, ry: i * 1.7, sc: 3.7 + (i % 2) * 1.2 });
  });

  // ---- spatial chunking of instanced props ---------------------------------
  // One InstancedMesh spanning the whole 1.3 km course can never be culled:
  // every instance is submitted (and shadow-cast) on every frame. Splitting
  // each prop type into ~150 m chunks lets three.js frustum-cull the ~90% of
  // props behind the camera, which is the single biggest mobile GPU saving.
  const CHUNK = 150;
  // Distance LOD for instanced prop chunks: a chunk whose nearest point is
  // farther than LOD_NEAR from the camera draws the low-poly twin.
  const lodChunks = [];
  let lodForce = null; // 'hi' | 'lo' | null (prewarm uploads both twins)
  const LOD_NEAR = 45;
  function buildChunks(geo, mat, list, fill, opts = {}) {
    if (river) list = list.filter((p) => !(typeof p.x === 'number' && typeof p.z === 'number' && blocked(p.x, p.z)));
    if (!list.length) return [];
    const shadow = opts.shadow !== false;
    const groups = new Map();
    list.forEach((p, i) => {
      const s = (typeof p.s === 'number' && isFinite(p.s)) ? p.s : (i / list.length) * L;
      const c = Math.max(0, Math.floor(s / CHUNK));
      if (!groups.has(c)) groups.set(c, []);
      groups.get(c).push([p, i]);
    });
    const out = [];
    for (const [c, items] of groups) {
      const inst = new THREE.InstancedMesh(geo, mat, items.length);
      inst.castShadow = shadow;
      inst.receiveShadow = true;
      inst.userData.noCollide = true;
      inst.userData.chunk = c;
      items.forEach(([p, gi], li) => {
        if (opts.bindItem) { p.mesh = inst; p.idx = li; }
        fill(inst, li, p, gi);
      });
      inst.instanceMatrix.needsUpdate = true;
      if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
      world.add(inst);
      out.push(inst);
      const lo = opts.lod !== undefined ? opts.lod : geo.userData.lod;
      if (lo) lodChunks.push({ inst, hi: geo, lo, sphere: null });
    }
    return out;
  }
  // ---------- knockable candy fence: canes + lollipops on the shoulder ----------
  // Sits on the grass strip just off the curb (5.8-8.2 m from the centerline):
  // outside the road, inside the fun. Topples & flies when the car clips it.
  // Marked noCollide so the corridor sweep leaves the fringe alone.
  const KNOCK_C = DECOR.knockCanes, KNOCK_L = DECOR.knockLollis;
  const knockItems = [];
  for (let i = 0; i < KNOCK_C + KNOCK_L; i++) {
    const isCane = i < KNOCK_C;
    const n = isCane ? i : i - KNOCK_C;
    const tot = isCane ? KNOCK_C : KNOCK_L;
    const s = 7 + ((n + (isCane ? 0 : 0.5)) / tot) * (L - 16);
    const kSide = (n + (isCane ? 0 : 1)) % 2 ? 1 : -1;
    // fence sits just OUTSIDE the new 6-band rainbow curb (curb ends at 6.62 m)
    const lat = kSide * (6.8 + rand() * 1.6);
    const p = track.getPose(s + (rand() - 0.5) * 1.6, lat);
    knockItems.push({
      type: isCane ? 'cane' : 'lolli',
      x: p.pos.x, y: p.pos.y - 0.3, z: p.pos.z,
      ry: rand() * Math.PI * 2, sc: isCane ? 0.55 + rand() * 0.32 : 0.6 + rand() * 0.38,
      s, lateral: lat, state: 0, t: 0, dir: kSide,
    });
  }
  if (river) for (let i = knockItems.length - 1; i >= 0; i--) if (blocked(knockItems[i].x, knockItems[i].z)) knockItems.splice(i, 1);
  const knockDummy = new THREE.Object3D();
  function knockSyncItem(it) {
    const k = Math.min(1, it.t);
    const slide = it.state ? k * 1.5 : 0;
    knockDummy.position.set(it.x + it.dir * slide * 0.6, it.y + (it.state ? Math.sin(k * Math.PI) * 0.22 : 0), it.z + it.dir * slide * 0.35);
    knockDummy.rotation.set(0, it.ry, it.state ? it.dir * k * 1.42 : 0);
    knockDummy.scale.setScalar(it.sc);
    knockDummy.updateMatrix();
    if (it.mesh) it.mesh.setMatrixAt(it.idx, knockDummy.matrix);
  }
  function knockSync(i) { knockSyncItem(knockItems[i]); }
  // chunked so only the fence near the car is submitted (it is the densest
  // shoulder prop: 660 pieces along the whole course)
  const knockMeshes = [];
  for (const [type, geo, mat] of [['cane', caneGeometry(), propMats.cane], ['lolli', lollipopGeometry(), propMats.lolli[1]]]) {
    const list = knockItems.filter((it) => it.type === type);
    knockMeshes.push(...buildChunks(geo, mat, list, (inst, i, p) => knockSyncItem(p), { bindItem: true }));
  }
  for (const m of knockMeshes) m.instanceMatrix.needsUpdate = true;

  const dummy = new THREE.Object3D();
  function makeInstanced(geo, mat, list, colorFn, opts) {
    if (!list.length) return null;
    return buildChunks(geo, mat, list, (inst, i, p, gi) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(0, p.ry, 0);
      dummy.scale.setScalar(p.sc ?? 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      if (colorFn) inst.setColorAt(i, colorFn(gi, p));
    }, opts);
  }

  const BEAR_COLORS = ['#ff5f7a', '#56c8ff', '#ffd45e', '#8ef07e', '#ff8ad0', '#b18aff'];
  makeInstanced(lollipopGeometry(), propMats.lolli[0], placements.lolli0);
  makeInstanced(lollipopGeometry(), propMats.lolli[1], placements.lolli1);
  makeInstanced(lollipopGeometry(), propMats.lolli[2], placements.lolli2);
  makeInstanced(caneGeometry(), propMats.cane, placements.cane);
  makeInstanced(gummyBearGeometry(), propMats.bear, placements.bear, (i) => new THREE.Color(BEAR_COLORS[i % BEAR_COLORS.length]));
  makeInstanced(treeGeometry(), propMats.tree, placements.tree, (i) => new THREE.Color(['#7ddf9a', '#8fe0c8', '#c6e87d', '#9adcff'][i % 4]));
  makeInstanced(marshGeometry(), propMats.marsh, placements.marsh, (i) => new THREE.Color(['#fff2f7', '#ffd6e8', '#fff0d8', '#e8d6ff'][i % 4]));
  makeInstanced(iceConeGeometry(), propMats.cone, placements.ice);
  makeInstanced(iceScoopsGeometry(), propMats.ice, placements.ice, (i) => new THREE.Color(['#ffd6e8', '#d8f2ff', '#fff2c8', '#e2d2ff'][i % 4]));
  makeInstanced(cookieGeometry(), propMats.cookie, placements.cookie);

  // giant hero lollipops & canes at camera-visible moments
  const heroLolli = new THREE.Mesh(lollipopGeometry(), propMats.lolli[0]);
  heroLolli.scale.setScalar(4.2);
  heroLolli.position.copy(track.getPose(L * 0.08, -18).pos).add(new THREE.Vector3(0, -1, 0));
  world.add(heroLolli);
  const heroCane = new THREE.Mesh(caneGeometry(), propMats.cane);
  heroCane.scale.setScalar(4.4);
  heroCane.position.copy(track.getPose(track.fromBaseDistance(track.baseLength * 0.82), 17).pos).add(new THREE.Vector3(0, -1, 0));
  world.add(heroCane);

  // pseudo road beyond the start/finish lines (track.js run-offs): a few of
  // the roadside props keep going along it
  const RUN_PRE = track.runoff ? track.runoff.pre : 0, RUN_POST = track.runoff ? track.runoff.post : 0;

  // ---------- cheering spectator crowds behind candy fences (reference look) --
  // A low striped fence runs along both shoulders; chibi animals bob and
  // "cheer" behind it. Everything is instanced: 3 draw calls for ~300 animals.
  const crowdItems = [];
  const crowdDummy = new THREE.Object3D();
  function crowdSync(c, hop) {
    const sq = 1 + (1 - hop) * 0.14;
    crowdDummy.position.set(c.x, c.y + hop * c.amp, c.z);
    crowdDummy.rotation.set(0, c.ry, Math.sin(hop * Math.PI) * 0.12);
    crowdDummy.scale.set(c.sc * sq, c.sc * (2 - sq), c.sc * sq);
    crowdDummy.updateMatrix();
    if (c.mesh) c.mesh.setMatrixAt(c.idx, crowdDummy.matrix);
  }
  {
    const crowdGeo = {
      bear: gummyBearGeometry(),
      kitty: mergeParts([
        { geo: new THREE.SphereGeometry(0.46, 12, 10), pos: [0, 0.6, 0], scale: [1, 0.92, 0.88] }, // body
        { geo: new THREE.SphereGeometry(0.4, 14, 12), pos: [0, 1.28, 0.02] },                     // head
        { geo: new THREE.ConeGeometry(0.15, 0.32, 6), pos: [-0.19, 1.63, 0], rot: [0, 0, -0.16] }, // ear L
        { geo: new THREE.ConeGeometry(0.15, 0.32, 6), pos: [0.19, 1.63, 0], rot: [0, 0, 0.16] },   // ear R
        { geo: new THREE.SphereGeometry(0.06, 8, 6), pos: [-0.14, 1.32, 0.33] },                   // eye L
        { geo: new THREE.SphereGeometry(0.06, 8, 6), pos: [0.14, 1.32, 0.33] },                    // eye R
        { geo: new THREE.SphereGeometry(0.045, 6, 6), pos: [0, 1.2, 0.36] },                       // nose
        { geo: new THREE.CylinderGeometry(0.07, 0.05, 0.5, 6), pos: [0, 0.62, -0.42], rot: [-0.9, 0, 0] }, // tail
      ]),
      bunny: mergeParts([
        { geo: new THREE.SphereGeometry(0.44, 12, 10), pos: [0, 0.58, 0], scale: [1, 0.95, 0.9] },
        { geo: new THREE.SphereGeometry(0.38, 14, 12), pos: [0, 1.22, 0.02] },
        { geo: new THREE.SphereGeometry(0.1, 8, 8), pos: [-0.13, 1.78, 0], scale: [0.85, 1.9, 0.85] }, // ear L
        { geo: new THREE.SphereGeometry(0.1, 8, 8), pos: [0.13, 1.78, 0], scale: [0.85, 1.9, 0.85] },  // ear R
        { geo: new THREE.SphereGeometry(0.06, 8, 6), pos: [-0.13, 1.26, 0.32] },
        { geo: new THREE.SphereGeometry(0.06, 8, 6), pos: [0.13, 1.26, 0.32] },
        { geo: new THREE.SphereGeometry(0.045, 6, 6), pos: [0, 1.14, 0.34] },
        { geo: new THREE.SphereGeometry(0.13, 8, 8), pos: [0, 0.42, -0.36], scale: [1, 0.8, 1] },   // puff tail
      ]),
    };
    const crowdMats = {
      bear: new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.05 }),
      kitty: new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.02 }),
      bunny: new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0.0 }),
    };
    const CROWD_COLORS = {
      bear: ['#ff5f7a', '#56c8ff', '#ffd45e', '#8ef07e', '#ff8ad0', '#b18aff'],
      kitty: ['#ff9f43', '#fff2f7', '#c9c3d9', '#ff8fc6', '#8fd6ff'],
      bunny: ['#fff2f7', '#ffd6e8', '#c8b6ff', '#ffe08a'],
    };

    // ---- the fence itself: merged striped units (2 posts + 2 rails), 5.6 m long
    const fenceUnit = mergeParts([
      { geo: new THREE.CylinderGeometry(0.09, 0.11, 1.15, 8), pos: [-2.7, 0.575, 0] },
      { geo: new THREE.CylinderGeometry(0.09, 0.11, 1.15, 8), pos: [2.7, 0.575, 0] },
      { geo: new THREE.SphereGeometry(0.15, 8, 6), pos: [-2.7, 1.2, 0] },
      { geo: new THREE.SphereGeometry(0.15, 8, 6), pos: [2.7, 1.2, 0] },
      { geo: new THREE.BoxGeometry(5.6, 0.11, 0.11), pos: [0, 1.04, 0] },
      { geo: new THREE.BoxGeometry(5.6, 0.09, 0.09), pos: [0, 0.6, 0] },
    ]);
    const FENCE_STEP = 5.6, FENCE_LAT = 9.1;
    GRAND.lat = [FENCE_LAT + 1.0, FENCE_LAT + 2.2]; // two rows just behind the fence
    {
      const slots = [];
      // the fence keeps running along the pseudo road beyond both lines, so
      // the start/finish do not look like the edge of the world
      for (let s = 15 - RUN_PRE; s < L + RUN_POST - 15; s += FENCE_STEP) {
        for (const side of [-1, 1]) {
          const fp = track.getPose(s, side * FENCE_LAT).pos;
          if (blocked(fp.x, fp.z)) continue; // the bridge has its own balustrade
          slots.push({ s, side });
        }
      }
      // chunked: the fence line is ~460 units along 1.3 km; one mesh would be
      // drawn in full every frame even though only ~30 units are on screen
      buildChunks(fenceUnit, propMats.cane, slots, (inst, i, slot) => {
        const fd = new THREE.Object3D();
        const p = track.getPose(slot.s, slot.side * FENCE_LAT);
        fd.position.set(p.pos.x, p.pos.y - 0.12, p.pos.z);
        // the unit is modelled along local X (posts at +-2.7); heading maps local Z
        // onto the road tangent, so turn a further 90 deg to run ALONG the road
        fd.rotation.set(0, p.heading + Math.PI / 2, 0);
        fd.scale.setScalar(1);
        fd.updateMatrix();
        inst.setMatrixAt(i, fd.matrix);
      }, { shadow: false });
    }

    // ---- the crowd: clusters of 3-5 animals behind the fence, facing the road
    const crowdItems = [];
    for (let s = 24; s < L - 34; s += 22 + rand() * 12) {
      const side = (Math.round(s / 22) % 2) ? 1 : -1;
      const n = 3 + Math.floor(rand() * 4);
      for (let k = 0; k < n; k++) {
        const far = 9.6 + rand() * 2.2;
        const ss = s + (rand() - 0.5) * 14;
        const p = track.getPose(ss, side * far);
        const type = ['bear', 'kitty', 'bunny'][Math.floor(rand() * 3)];
        crowdItems.push({
          type, s: ss,
          x: p.pos.x, y: p.pos.y - 0.12, z: p.pos.z,
          ry: p.heading + Math.PI + (rand() - 0.5) * 0.8,
          phase: rand() * Math.PI * 2,
          amp: 0.2 + rand() * 0.38,
          sc: 1.15 + rand() * 0.6,
        });
      }
    }
    // the finish grandstand owns its stretch: no regular clusters inside it
    for (let i = crowdItems.length - 1; i >= 0; i--) if (crowdItems[i].s > GRAND.s0 - 6 && crowdItems[i].s < GRAND.s1 + 6) crowdItems.splice(i, 1);
    const crowdMeshes = [];
    for (const type of ['bear', 'kitty', 'bunny']) {
      const list = crowdItems.filter((c) => c.type === type);
      if (!list.length) continue;
      crowdMeshes.push(...buildChunks(crowdGeo[type], crowdMats[type], list, (inst, i, c) => {
        inst.setColorAt(i, new THREE.Color(CROWD_COLORS[type][i % CROWD_COLORS[type].length]));
      }, { bindItem: true, shadow: false }));
    }
    if (river) for (let i = crowdItems.length - 1; i >= 0; i--) if (!crowdItems[i].mesh) crowdItems.splice(i, 1);
    for (const c of crowdItems) crowdSync(c, 0);
    for (const im of crowdMeshes) im.instanceMatrix.needsUpdate = true;
  }

  // ---------- dense candy strip just behind the spectator fence -------------
  // The reference frames the fence line with solid candy: mini lollipops,
  // gumdrops and canes packed shoulder-to-shoulder. Fills the grass strip
  // between the animals and the mid-field dressing band.
  {
    const strip = { lolli: [], gum: [], cane: [] };
    for (let s = 18 - RUN_PRE; s < L + RUN_POST - 20; s += 4.6) {
      const onRunoff = s < 0 || s > L;
      if (onRunoff && rand() < 0.5) continue; // thinner beyond the lines
      for (const side of [-1, 1]) {
        if (rand() < DECOR.stripSkip) continue; // breathing gaps
        const far = 11.6 + rand() * 2.1;
        const ss = s + (rand() - 0.5) * 3;
        const p = track.getPose(ss, side * far);
        const slot = { s: ss, x: p.pos.x, y: p.pos.y - 0.12, z: p.pos.z, ry: rand() * Math.PI * 2, sc: 0.42 + rand() * 0.34 };
        const roll = rand();
        if (roll < 0.4) strip.lolli.push(slot);
        else if (roll < 0.72) strip.gum.push(slot);
        else strip.cane.push(slot);
      }
    }
    for (const k of Object.keys(strip)) strip[k] = strip[k].filter((q) => q.s < GRAND.s0 - 3 || q.s > GRAND.s1 + 3);
    makeInstanced(lollipopGeometry(), propMats.lolli[2], strip.lolli);
    makeInstanced(marshGeometry(), propMats.marsh, strip.gum,
      (i) => new THREE.Color(['#fff2f7', '#ffd6e8', '#fff0d8', '#e8d6ff', '#ffc9dd'][i % 5]));
    makeInstanced(caneGeometry(), propMats.cane, strip.cane);
  }

  // ---------- close framing candy: big pieces that sweep past the camera edges
  // (the reference frames every shot with a foreground lollipop/cane)
  {
    const spots = [];
    for (let s = 34; s < L - 40; s += 44 + rand() * 26) {
      spots.push({ s, side: (Math.round(s / 44) % 2) ? 1 : -1 });
    }
    const kinds = [
      { geo: lollipopGeometry(), mat: propMats.lolli[0] },
      { geo: caneGeometry(), mat: propMats.cane },
      { geo: lollipopGeometry(), mat: propMats.lolli[2] },
    ];
    for (let k = 0; k < kinds.length; k++) {
      const list = spots.filter((_, i) => i % kinds.length === k);
      if (!list.length) continue;
      buildChunks(kinds[k].geo, kinds[k].mat, list, (inst, i, spot) => {
        const d = new THREE.Object3D();
        const p = track.getPose(spot.s, spot.side * (12.2 + rand() * 1.6));
        d.position.set(p.pos.x, p.pos.y - 0.4, p.pos.z);
        d.rotation.set(0, p.heading + rand() * 0.6, 0);
        d.scale.setScalar(2.6 + rand() * 0.9);
        d.updateMatrix();
        inst.setMatrixAt(i, d.matrix);
      });
    }
  }

  // grandstand gummy-bears near the finish (like the reference crowd)
  // Used to be rows of 3 bears stacked straight OUTWARD from the road (and on
  // the left side INWARD, onto the curb), with every 43rd+ bear duplicated in
  // place. Now: two staggered rows running along the road behind the fence,
  // every bear facing the cars.
  const crowd = [];
  for (const side of [-1, 1]) {
    GRAND.lat.forEach((lat, row) => {
      for (let cs = GRAND.s0 + row * GRAND.step * 0.5; cs <= GRAND.s1; cs += GRAND.step) {
        const p = track.getPose(cs, side * lat);
        crowd.push({ s: cs, x: p.pos.x, y: p.pos.y - 0.2, z: p.pos.z, ry: p.heading + side * (Math.PI / 2 + 0.4), sc: row ? 1.45 : 1.2 }); // face the road, a bit toward the oncoming car
      }
    });
  }
  makeInstanced(gummyBearGeometry(), propMats.bear, crowd, (i) => new THREE.Color(BEAR_COLORS[i % BEAR_COLORS.length]));

  // ---------- finish festival: flag border + confetti curtain -------------
  let curtainData = null;
  {
    const fin = track.getPose(track.length * 0.9975, 0);
    const FLAG_COLS = ['#ff4f96', '#ffd45e', '#56c8ff', '#8ef07e', '#b18aff', '#ff8a5c'];
    const poleMat = new THREE.MeshStandardMaterial({ color: '#fff2f7', roughness: 0.4 });
    const flagMats = FLAG_COLS.map((c) => new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: 0.55 }));
    const flagGroup = new THREE.Group();
    world.add(flagGroup);
    for (let k = 0; k < 12; k++) {
      const side = k % 2 ? 1 : -1;
      const p = track.getPose(track.length - 30 + Math.floor(k / 2) * 5.2, side * 12.8);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 4.8, 8), poleMat);
      pole.position.set(p.pos.x, p.pos.y + 2.3, p.pos.z);
      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 1.05),
        flagMats[k % FLAG_COLS.length]
      );
      flag.position.set(
        p.pos.x + Math.cos(p.heading) * 1.0,
        p.pos.y + 4.15,
        p.pos.z - Math.sin(p.heading) * 1.0
      );
      flag.rotation.y = p.heading;
      pole.castShadow = false;
      flagGroup.add(pole, flag);
    }
    mergeByMaterial(flagGroup, { castShadow: false, receiveShadow: false, noCollide: false }); // 24 -> 7 draws
  }

  // ---------- air confetti ----------
  const CONFETTI = 680;
  const confGeo = new THREE.BufferGeometry();
  const confPos = new Float32Array(CONFETTI * 3);
  const confCol = new Float32Array(CONFETTI * 3);
  const confVel = new Float32Array(CONFETTI * 3);
  const palette = ['#ff6b81', '#ffd166', '#6bd96b', '#56c8ff', '#c86bff', '#ff8ad0', '#fff2f7'].map((h) => new THREE.Color(h));
  for (let i = 0; i < CONFETTI; i++) {
    confPos[i * 3] = (Math.random() - 0.5) * 260 + track.bounds.center.x;
    confPos[i * 3 + 1] = 2 + Math.random() * 26;
    confPos[i * 3 + 2] = (Math.random() - 0.5) * 260 + track.bounds.center.z;
    const c = palette[i % palette.length];
    confCol[i * 3] = c.r; confCol[i * 3 + 1] = c.g; confCol[i * 3 + 2] = c.b;
    confVel[i * 3] = (Math.random() - 0.5) * 0.7;
    confVel[i * 3 + 1] = -0.35 - Math.random() * 0.5;
    confVel[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
  }
  confGeo.setAttribute('position', new THREE.BufferAttribute(confPos, 3));
  confGeo.setAttribute('color', new THREE.BufferAttribute(confCol, 3));
  const confTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(8, 4, 16, 24);
    return new THREE.CanvasTexture(c);
  })();
  const confMat = new THREE.PointsMaterial({
    size: 0.95, map: confTex, vertexColors: true, transparent: true,
    opacity: 0.95, depthWrite: false, sizeAttenuation: true,
  });
  const confetti = new THREE.Points(confGeo, confMat);
  world.add(confetti);

  // confetti curtain over the finish line: the car drives through a party cloud
  {
    const fin = track.getPose(track.length * 0.9975, 0);
    const CURTAIN = 180;
    const curGeo = new THREE.BufferGeometry();
    const curPos = new Float32Array(CURTAIN * 3);
    const curVel = new Float32Array(CURTAIN * 3);
    const curCol = new Float32Array(CURTAIN * 3);
    const cpal = ['#ff6b81', '#ffd166', '#6bd96b', '#56c8ff', '#c86bff', '#ff8ad0', '#fff2f7'].map((h) => new THREE.Color(h));
    for (let i = 0; i < CURTAIN; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 10.5;
      curPos[i * 3] = fin.pos.x + Math.cos(a) * r;
      curPos[i * 3 + 1] = 1.5 + Math.random() * 7.5;
      curPos[i * 3 + 2] = fin.pos.z + Math.sin(a) * r;
      curVel[i * 3] = (Math.random() - 0.5) * 1.5;
      curVel[i * 3 + 1] = -0.5 - Math.random() * 0.9;
      curVel[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      const c = cpal[i % cpal.length];
      curCol[i * 3] = c.r; curCol[i * 3 + 1] = c.g; curCol[i * 3 + 2] = c.b;
    }
    curGeo.setAttribute('position', new THREE.BufferAttribute(curPos, 3));
    curGeo.setAttribute('color', new THREE.BufferAttribute(curCol, 3));
    const curtain = new THREE.Points(curGeo, new THREE.PointsMaterial({
      size: 0.6, map: confTex, vertexColors: true, transparent: true,
      opacity: 0.95, depthWrite: false, sizeAttenuation: true,
    }));
    world.add(curtain);
    curtainData = { geo: curGeo, vel: curVel, count: CURTAIN, center: fin.pos.clone() };
  }

  // ---------- floating balloons ----------
  const balloonMat = new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.12 });
  const balloons = [];
  for (let i = 0; i < 14; i++) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.SphereGeometry(1.6, 14, 12), balloonMat.clone());
    b.material.color.set(BEAR_COLORS[i % BEAR_COLORS.length]);
    b.scale.set(1, 1.18, 1);
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 7, 4), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
    string.position.y = -4.2;
    g.add(b, string);
    const u = (i + 0.5) / 14;
    const p = track.getPose(track.length * u, (i % 2 ? 1 : -1) * (18 + (i % 4) * 8));
    g.position.copy(p.pos).add(new THREE.Vector3(0, 16 + (i % 5) * 4, 0));
    world.add(g);
    balloons.push({ g, phase: i * 0.7, baseY: g.position.y });
  }

  const zoneFog = ZONES.map((z) => new THREE.Color(z.fog));
  const zoneSky = ZONES.map((z) => new THREE.Color(z.sky));
  const tmpColor = new THREE.Color();
  const WHITE = new THREE.Color('#fff2f7');

  // ---------- candy field dressing: gumdrop pebbles scattered on the grass ----
  {
    const pebbleGeo = new THREE.SphereGeometry(0.42, 8, 6);
    pebbleGeo.scale(1, 0.72, 1);
    const pebbleMat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0, flatShading: true });
    const N = DECOR.pebbles;
    const d2 = new THREE.Object3D();
    const cTmp = new THREE.Color();
    const COLS = ['#ff8fc6', '#ffd45e', '#8ef07e', '#56c8ff', '#b18aff', '#fff2f7', '#ff6b81'];
    const slots = [];
    let fs = 12;
    while (slots.length < N && fs < L - 12) {
      for (const side of [-1, 1]) {
        if (slots.length >= N) break;
        const far = 9.8 + rand() * 14;
        const ss = fs + (rand() - 0.5) * 3;
        const p = track.getPose(ss, side * far);
        slots.push({ s: ss, x: p.pos.x, y: p.pos.y - far * 0.13 - 0.3, z: p.pos.z, far });
      }
      fs += (L - 24) / (N / 2); // spread over the whole course (used to stop at ~830 m)
    }
    buildChunks(pebbleGeo, pebbleMat, slots, (inst, i, slot, gi) => {
      d2.position.set(slot.x, slot.y, slot.z);
      d2.rotation.set(0, rand() * Math.PI * 2, 0);
      d2.scale.setScalar(1.1 + rand() * 2.1);
      d2.updateMatrix();
      inst.setMatrixAt(i, d2.matrix);
      inst.setColorAt(i, cTmp.set(COLS[gi % COLS.length]));
    });
  }

  // ---------- living candy world: villages, donut gardens, ponds, groves ------
  const bounceList = []; // gummy bears that hop forever
  // a cluster base that would land in the milk river/sea/valley slides forward
  // along the track until it is on dry candy ground
  const freePose = (u, lateral) => {
    let uu = u;
    for (let k = 0; k < 40 && uu < 1; k++) {
      const p = track.getPose(track.length * uu, lateral);
      // A wide-lateral pond/grove can clear the footprint but would still
      // inherit a summit height. Move it to a ground-level part of the route.
      if (!track.isCakeSection(track.length * uu) && !blocked(p.pos.x, p.pos.z)) return p;
      uu += 0.025;
    }
    return track.getPose(track.length * Math.min(1, uu), lateral);
  };
  {
    const icing = new THREE.MeshStandardMaterial({ color: '#fff6ee', roughness: 0.5 });
    const choc = new THREE.MeshStandardMaterial({ color: '#7a4526', roughness: 0.6 });
    const dark = new THREE.MeshStandardMaterial({ color: '#5a2f1a', roughness: 0.45 });
    const gumMat = new THREE.MeshPhysicalMaterial({ roughness: 0.22, metalness: 0.05, transparent: true, opacity: 0.9, clearcoat: 0.9, clearcoatRoughness: 0.25, emissive: 0x301018, emissiveIntensity: 0.25 });
    const gumShared = BEAR_COLORS.map((c) => {
      const m = gumMat.clone();
      m.color.set(c);
      return m;
    });

    // --- gingerbread house factory ---
    // shared roof/window materials so the whole village merges into a handful
    // of draw calls instead of 84
    const roofMats = ['#ff4f96', '#8f6bff', '#56c8ff', '#ff8a5c'].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.42 }));
    const winMat = new THREE.MeshStandardMaterial({ color: '#6a2c8c', emissive: '#ffb347', emissiveIntensity: 0.8, roughness: 0.3 });
    const house = (hue) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new RoundedBoxGeometry(6.2, 4.6, 5.4, 3, 0.5), propMats.ginger);
      body.position.y = 2.3;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(4.9, 3.6, 4), roofMats[['#ff4f96', '#8f6bff', '#56c8ff', '#ff8a5c'].indexOf(hue)] ?? roofMats[0]);
      roof.position.y = 6.4;
      roof.rotation.y = Math.PI / 4;
      const trim = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.34, 8, 4), icing);
      trim.rotation.x = Math.PI / 2;
      trim.rotation.z = Math.PI / 4;
      trim.position.y = 4.75;
      const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.3, 0.35), dark);
      door.position.set(0, 1.15, 2.75);
      const win = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.3, 10), winMat);
      win.rotation.x = Math.PI / 2;
      win.position.set(1.85, 2.7, 2.72);
      const win2 = win.clone();
      win2.position.x = -1.85;
      const choc1 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 6), choc);
      choc1.position.set(1.5, 4.2, 2.78);
      const choc2 = choc1.clone();
      choc2.position.x = -1.5;
      g.add(body, roof, trim, door, win, win2, choc1, choc2);
      return g;
    };

    // 3 gingerbread villages beside the track
    const villageGroup = new THREE.Group();
    world.add(villageGroup);
    [[0.14, -1], [0.52, 1], [0.79, -1]].forEach(([u, side], vi) => {
      const base = freePose(u, side * 30);
      for (let k = 0; k < 4; k++) {
        const h = house(['#ff4f96', '#8f6bff', '#56c8ff', '#ff8a5c'][(vi + k) % 4]);
        const ang = (k / 4) * Math.PI * 2 + vi;
        h.position.copy(base.pos).add(new THREE.Vector3(Math.cos(ang) * (7 + k * 2.4), -1.2, Math.sin(ang) * (7 + k * 2.2)));
        h.rotation.y = ang * 1.3;
        h.scale.setScalar(0.9 + (k % 3) * 0.22);
        villageGroup.add(h);
      }
    });
    mergeByMaterial(villageGroup); // 84 house meshes -> ~9 draw calls

    // --- donut gardens (big leaning rings) ---
    const donutGeo = new THREE.TorusGeometry(3.2, 1.35, 12, 22);
    const donutMats = [[TEX.donutLilac, '#b18aff'], [TEX.donutPink, '#ff8ad0']].map(([tex, c]) =>
      new THREE.MeshStandardMaterial({ map: mapOr(tex, () => stripeTexture(c, '#fff2f7')), roughness: 0.4 }));
    const donutGroup = new THREE.Group();
    world.add(donutGroup);
    for (let i = 0; i < 5; i++) {
      const u = 0.08 + i * 0.19;
      const side = i % 2 ? 1 : -1;
      const base = freePose(u, side * (24 + (i % 3) * 6));
      for (let k = 0; k < 3; k++) {
        const d = new THREE.Mesh(donutGeo, donutMats[i % 2]);
        d.position.copy(base.pos).add(new THREE.Vector3((k - 1) * 8.5 + i, 2.6 + k * 0.4, (k % 2) * 5 - 2.5));
        d.rotation.set((rand() - 0.5) * 0.5, rand() * Math.PI, (rand() - 0.5) * 0.55);
        d.scale.setScalar(0.85 + k * 0.3);
        donutGroup.add(d);
      }
    }
    mergeByMaterial(donutGroup); // 15 donuts -> 2 draw calls

    // --- macaron stacks ---
    const macaronMats = ['#ff8fc6', '#c8b6ff', '#8fd6ff', '#ffe08a'].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 }));
    const macaronGroup = new THREE.Group();
    world.add(macaronGroup);
    for (let i = 0; i < 8; i++) {
      const u = 0.05 + i * 0.12;
      const side = i % 2 ? -1 : 1;
      const base = freePose(u, side * (17 + (i % 4) * 5));
      const stack = new THREE.Group();
      const cols = ['#ff8fc6', '#c8b6ff', '#8fd6ff', '#ffe08a'];
      for (let k = 0; k < 3; k++) {
        const shell = new THREE.Mesh(new THREE.CylinderGeometry(2.6 - k * 0.35, 2.6 - k * 0.35, 1.15, 14), macaronMats[(i + k) % 4]);
        shell.position.y = 0.6 + k * 1.85;
        const cream = new THREE.Mesh(new THREE.CylinderGeometry(2.45 - k * 0.35, 2.45 - k * 0.35, 0.75, 14), icing);
        cream.position.y = 1.55 + k * 1.85;
        stack.add(shell, cream);
      }
      stack.position.copy(base.pos).add(new THREE.Vector3(0, -0.6, 0));
      stack.scale.setScalar(0.8 + (i % 3) * 0.28);
      macaronGroup.add(stack);
    }
    mergeByMaterial(macaronGroup); // 48 stack meshes -> 5 draw calls

    // --- chocolate ponds with cookie-crumb rim ---
    const pondGroup = new THREE.Group();
    world.add(pondGroup);
    for (let i = 0; i < 4; i++) {
      const u = 0.18 + i * 0.22;
      const side = i % 2 ? 1 : -1;
      const base = freePose(u, side * (36 + (i % 2) * 10));
      const pond = new THREE.Mesh(new THREE.CylinderGeometry(9 + i * 1.6, 9 + i * 1.6, 0.45, 22), dark);
      pond.position.copy(base.pos).add(new THREE.Vector3(0, -1.4, 0));
      const rim = new THREE.Mesh(new THREE.TorusGeometry(9 + i * 1.6, 1.15, 8, 26), choc);
      rim.rotation.x = Math.PI / 2;
      rim.position.copy(pond.position).add(new THREE.Vector3(0, 0.35, 0));
      pondGroup.add(pond, rim);
    }
    mergeByMaterial(pondGroup); // 8 pond meshes -> 2 draw calls

    // --- extra tree groves mid-field ---
    const groveList = [];
    for (let i = 0; i < 34; i++) {
      const u = 0.04 + (i / 34) * 0.92;
      const side = i % 2 ? 1 : -1;
      const far = 20 + rand() * 26;
      const p = track.getPose(track.length * u + (rand() - 0.5) * 20, side * far);
      groveList.push({ x: p.pos.x, y: p.pos.y - far * 0.1 - 0.4, z: p.pos.z, ry: rand() * Math.PI * 2, sc: 1.5 + rand() * 1.6 });
    }
    makeInstanced(treeGeometry(), propMats.tree, groveList, (i) => new THREE.Color(['#7ddf9a', '#8fe0c8', '#c6e87d', '#9adcff', '#ffb7d9'][i % 5]));
    // cherry toppers on every other grove tree
    const cherryGeo = mergeParts([
      { geo: new THREE.SphereGeometry(0.42, 10, 8), pos: [0, 0, 0] },
      { geo: new THREE.CylinderGeometry(0.055, 0.055, 0.55, 6), pos: [0.14, 0.42, 0], rot: [0, 0, -0.35] },
    ]);
    const cherryList = groveList.filter((_, i) => i % 2 === 0).map((p) => ({
      x: p.x, y: p.y + 3.35 * p.sc, z: p.z, ry: p.ry, sc: p.sc * 0.95,
    }));
    makeInstanced(cherryGeo, new THREE.MeshStandardMaterial({ color: '#ff3b5c', roughness: 0.32, emissive: '#7a0e22', emissiveIntensity: 0.22 }), cherryList);

    // --- ground balloon bunches (tied with strings, sway in update) ---
    for (let i = 0; i < 7; i++) {
      const u = 0.06 + i * 0.14;
      const side = i % 2 ? 1 : -1;
      const base = freePose(u, side * (14 + (i % 3) * 6));
      const bunch = new THREE.Group();
      for (let k = 0; k < 4; k++) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(1.25 - k * 0.1, 12, 10), new THREE.MeshStandardMaterial({ color: ['#ff5f7a', '#56c8ff', '#ffd45e', '#8ef07e'][k], roughness: 0.3 }));
        b.position.set(Math.sin(k * 1.9) * 1.2, 6.4 + k * 1.5, Math.cos(k * 1.9) * 1.2);
        bunch.add(b);
      }
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 6.2, 5), icing);
      stick.position.y = 3.1;
      bunch.add(stick);
      bunch.position.copy(base.pos).add(new THREE.Vector3(0, -0.5, 0));
      world.add(bunch);
      balloons.push({ g: bunch, phase: i * 1.1, baseY: bunch.position.y, sway: 0.55 });
    }

    // --- bouncing gummy-bear groups (the marzipan cheer squad) ---
    // start-festival squad: flanks the grid, on screen during the intro sweep
    for (let k = 0; k < 8; k++) {
      const side = k % 2 ? 1 : -1;
      const far = 11.5 + (k % 4) * 2.9 + rand() * 1.6;
      const p = track.getPose(2.5 + k * 1.55 + rand() * 1.2, side * far);
      const bear = new THREE.Mesh(gummyBearGeometry(), gumShared[k % gumShared.length]);
      bear.position.set(p.pos.x, p.pos.y - far * 0.1 + 1.7, p.pos.z);
      bear.rotation.y = p.heading + Math.PI + (rand() - 0.5) * 1.4;
      bear.scale.setScalar(1.3 + rand() * 0.8);
      world.add(bear);
      bounceList.push({ m: bear, sc: bear.scale.x, baseY: bear.position.y, phase: k * 1.13, amp: 0.7 + rand() * 0.7, spin: (rand() - 0.5) * 0.7 });
    }
    for (let gi = 0; gi < 7; gi++) {
      const u = 0.015 + gi * 0.145;
      const side = gi % 2 ? 1 : -1;
      for (let k = 0; k < 3; k++) {
        const far = 10.5 + k * 3.4 + rand() * 2.2;
        const p = track.getPose(track.length * u + (k - 1) * 3.2 + (rand() - 0.5) * 2.5, side * far);
        if (blocked(p.pos.x, p.pos.z)) continue;
        const bear = new THREE.Mesh(gummyBearGeometry(), gumShared[(gi * 3 + k) % gumShared.length]);
        bear.position.set(p.pos.x, p.pos.y - far * 0.1 + 1.7, p.pos.z);
        bear.rotation.y = p.heading + Math.PI + (rand() - 0.5) * 1.2;
        bear.scale.setScalar(1.25 + rand() * 0.75);
        world.add(bear);
        bounceList.push({ m: bear, sc: bear.scale.x, baseY: bear.position.y, phase: gi * 1.7 + k * 0.9, amp: 0.55 + rand() * 0.55, spin: (rand() - 0.5) * 0.6 });
      }
    }
  }

  // ---------- living details: butterflies in the meadows, birds in the sky ---
  const butterflies = [];
  {
    const wingGeo = new THREE.PlaneGeometry(0.24, 0.17);
    for (let i = 0; i < 16; i++) {
      const g = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: ['#ff8fc6', '#ffd45e', '#8fd6ff', '#c8a0ff', '#fff2f7', '#ff9f43'][i % 6],
        roughness: 0.5, side: THREE.DoubleSide,
      });
      const wl = new THREE.Mesh(wingGeo, mat); wl.position.x = -0.12;
      const wr = new THREE.Mesh(wingGeo, mat); wr.position.x = 0.12;
      g.add(wl, wr);
      g.scale.setScalar(2.6); // visible as colorful flutters over the grass
      const u = 0.005 + (i / 16) * 0.21;
      const side = i % 2 ? 1 : -1;
      const p = track.getPose(L * u, side * (8.5 + rand() * 10));
      g.position.set(p.pos.x, p.pos.y + 1.1 + rand() * 1.8, p.pos.z);
      g.traverse((o) => { o.userData.noCollide = true; });
      world.add(g);
      butterflies.push({ g, wl, wr, base: g.position.clone(), phase: rand() * 6.28, r: 1.6 + rand() * 2.6, speed: 0.45 + rand() * 0.65, flap: 9 + rand() * 7 });
    }
  }
  const birds = [];
  {
    const wingGeo = new THREE.PlaneGeometry(1.5, 0.42);
    const birdMat = new THREE.MeshStandardMaterial({ color: '#8f7fb8', roughness: 0.9, side: THREE.DoubleSide });
    for (let i = 0; i < 9; i++) {
      const g = new THREE.Group();
      const wl = new THREE.Mesh(wingGeo, birdMat); wl.position.x = -0.75;
      const wr = new THREE.Mesh(wingGeo, birdMat); wr.position.x = 0.75;
      g.add(wl, wr);
      const a = (i / 9) * Math.PI * 2;
      const rr = 130 + rand() * 180;
      g.position.set(track.bounds.center.x + Math.cos(a) * rr, 46 + rand() * 30, track.bounds.center.z + Math.sin(a) * rr);
      g.scale.setScalar(1.6 + rand() * 1.0);
      g.traverse((o) => { o.userData.noCollide = true; });
      world.add(g);
      birds.push({ g, wl, wr, cx: g.position.x, cz: g.position.z, y: g.position.y, r: 40 + rand() * 70, phase: rand() * 6.28, speed: 0.1 + rand() * 0.12, flap: 3.5 + rand() * 2.5 });
    }
  }

  // ---------- zone identity: each stretch gets its own hero dressing -------
  {
    // 0. Lollipop Meadows — candy flower fields on the grass
    const flowerGeo = mergeParts([
      { geo: new THREE.CylinderGeometry(0.035, 0.045, 0.55, 5), pos: [0, 0.27, 0] },
      { geo: new THREE.SphereGeometry(0.17, 8, 6), pos: [0, 0.62, 0], scale: [1, 0.85, 1] },
      { geo: new THREE.SphereGeometry(0.07, 6, 5), pos: [0, 0.78, 0] },
    ]);
    const flowerMat = new THREE.MeshStandardMaterial({ roughness: 0.5 });
    {
      const list = [];
      let fs = 8;
      while (fs < L * track.zones[0].u1) {
        for (const side of [-1, 1]) {
          if (rand() < DECOR.flowerKeep) {
            const far = 12 + rand() * 14;
            const p = track.getPose(fs + (rand() - 0.5) * 4, side * far);
            if (blocked(p.pos.x, p.pos.z)) continue;
            list.push({ x: p.pos.x, y: p.pos.y - 0.12, z: p.pos.z, ry: rand() * Math.PI * 2, sc: 0.8 + rand() * 0.9, c: ['#ff6b9e', '#ffd45e', '#8fd6ff', '#c8a0ff', '#fff2f7'][Math.floor(rand() * 5)] });
          }
        }
        fs += 2.6;
      }
      const im = new THREE.InstancedMesh(flowerGeo, flowerMat, list.length);
      im.receiveShadow = true;
      im.castShadow = false;
      const d = new THREE.Object3D();
      list.forEach((f, i) => {
        d.position.set(f.x, f.y, f.z); d.rotation.set(0, f.ry, 0); d.scale.setScalar(f.sc);
        d.updateMatrix(); im.setMatrixAt(i, d.matrix);
        im.setColorAt(i, new THREE.Color(f.c));
      });
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      world.add(im);
    }

    // 1. Gummy Bear Grove — big gumdrop bushes
    const gumGeo = new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const gumMat2 = new THREE.MeshPhysicalMaterial({ roughness: 0.22, metalness: 0.05, transparent: true, opacity: 0.9, clearcoat: 0.9, clearcoatRoughness: 0.25, emissive: 0x301018, emissiveIntensity: 0.25 });
    {
      const list = [];
      let gs = L * track.zones[1].u0;
      while (gs < L * track.zones[1].u1) {
        for (const side of [-1, 1]) {
          if (rand() < 0.5) {
            const far = 13 + rand() * 15;
            const p = track.getPose(gs + (rand() - 0.5) * 6, side * far);
            if (blocked(p.pos.x, p.pos.z)) continue;
            list.push({ x: p.pos.x, y: p.pos.y - 0.25, z: p.pos.z, ry: rand() * Math.PI * 2, sc: 1.4 + rand() * 1.6, c: ['#ff5f7a', '#56c8ff', '#ffd45e', '#8ef07e', '#b18aff', '#ff8ad0'][Math.floor(rand() * 6)] });
          }
        }
        gs += 7;
      }
      const im = new THREE.InstancedMesh(gumGeo, gumMat2, list.length);
      im.castShadow = true; im.receiveShadow = true;
      const d = new THREE.Object3D();
      list.forEach((g, i) => {
        d.position.set(g.x, g.y, g.z); d.rotation.set(0, g.ry, 0); d.scale.set(g.sc, g.sc * (0.8 + rand() * 0.5), g.sc);
        d.updateMatrix(); im.setMatrixAt(i, d.matrix);
        im.setColorAt(i, new THREE.Color(g.c));
      });
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      world.add(im);
    }

    // 2. Cocoa Canyon — dark chocolate crystals & boulders
    const chocGeo = new THREE.OctahedronGeometry(1, 0);
    const chocMat2 = new THREE.MeshStandardMaterial({ color: '#6b3a1e', roughness: 0.42, metalness: 0.1, flatShading: true });
    {
      const list = [];
      let cs = L * track.zones[2].u0;
      while (cs < L * track.zones[2].u1) {
        for (const side of [-1, 1]) {
          if (rand() < DECOR.chocKeep) {
            const far = 13 + rand() * 16;
            const p = track.getPose(cs + (rand() - 0.5) * 7, side * far);
            if (blocked(p.pos.x, p.pos.z)) continue;
            list.push({ x: p.pos.x, y: p.pos.y - 0.4, z: p.pos.z, ry: rand() * Math.PI * 2, sc: 1.6 + rand() * 2.6 });
          }
        }
        cs += 6.5;
      }
      const im = new THREE.InstancedMesh(chocGeo, chocMat2, list.length);
      im.castShadow = true; im.receiveShadow = true;
      const d = new THREE.Object3D();
      list.forEach((c2, i) => {
        d.position.set(c2.x, c2.y, c2.z);
        d.rotation.set((rand() - 0.5) * 0.5, c2.ry, (rand() - 0.5) * 0.5);
        d.scale.set(c2.sc, c2.sc * (0.7 + rand() * 0.9), c2.sc);
        d.updateMatrix(); im.setMatrixAt(i, d.matrix);
      });
      im.instanceMatrix.needsUpdate = true;
      world.add(im);
    }

    // 3. Marshmallow Valley — big soft mounds on the horizon
    const marshGeo = new THREE.SphereGeometry(1, 14, 10);
    const marshMat2 = new THREE.MeshStandardMaterial({ roughness: 0.85 });
    {
      const list = [];
      for (let i = 0; i < 16; i++) {
        const u = track.zones[3].u0 + (i / 16) * (track.zones[3].u1 - track.zones[3].u0) + (rand() - 0.5) * 0.01;
        const side = i % 2 ? 1 : -1;
        const far = 22 + rand() * 26;
        const p = track.getPose(L * u, side * far);
        if (blocked(p.pos.x, p.pos.z)) continue;
        list.push({ x: p.pos.x, y: p.pos.y - far * 0.12 - 1.2, z: p.pos.z, sc: 5 + rand() * 6, c: ['#fff2f7', '#ffd6e8', '#f2e8ff', '#fff0d8'][i % 4] });
      }
      const im = new THREE.InstancedMesh(marshGeo, marshMat2, list.length);
      im.receiveShadow = true; im.castShadow = false;
      const d = new THREE.Object3D();
      list.forEach((m2, i) => {
        d.position.set(m2.x, m2.y, m2.z);
        d.rotation.set(0, rand() * Math.PI, 0);
        d.scale.set(m2.sc, m2.sc * 0.52, m2.sc * 0.9);
        d.updateMatrix(); im.setMatrixAt(i, d.matrix);
        im.setColorAt(i, new THREE.Color(m2.c));
      });
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      world.add(im);
    }

    // 4. Sugar Castle Run — bunting flag rows leading to the finish
    const flagGeo = new THREE.PlaneGeometry(0.9, 1.15);
    const flagMat = new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide });
    const poleGeo = new THREE.CylinderGeometry(0.07, 0.09, 3.4, 6);
    const poleMat = new THREE.MeshStandardMaterial({ color: '#fff2f7', roughness: 0.5 });
    {
      const poles = [], flags = [];
      let bs = L * track.zones[4].u0;
      while (bs < L - 26) {
        for (const side of [-1, 1]) {
          if (rand() < DECOR.buntingKeep) {
            const far = 13 + rand() * 4;
            const p = track.getPose(bs + (rand() - 0.5) * 3, side * far);
            if (blocked(p.pos.x, p.pos.z)) continue;
            poles.push({ x: p.pos.x, y: p.pos.y - 0.1, z: p.pos.z, ry: p.heading });
            flags.push({ x: p.pos.x, y: p.pos.y + 3.0, z: p.pos.z, ry: p.heading, c: ['#ff4f96', '#ffd45e', '#56c8ff', '#8ef07e', '#b18aff'][Math.floor(rand() * 5)] });
          }
        }
        bs += 5.2;
      }
      const pim = new THREE.InstancedMesh(poleGeo, poleMat, poles.length);
      const fim = new THREE.InstancedMesh(flagGeo, flagMat, flags.length);
      const d = new THREE.Object3D();
      poles.forEach((p2, i) => {
        d.position.set(p2.x, p2.y + 1.7, p2.z); d.rotation.set(0, p2.ry, 0); d.scale.setScalar(1);
        d.updateMatrix(); pim.setMatrixAt(i, d.matrix);
      });
      flags.forEach((f2, i) => {
        d.position.set(f2.x, f2.y, f2.z); d.rotation.set(0, f2.ry, 0); d.scale.setScalar(1);
        d.updateMatrix(); fim.setMatrixAt(i, d.matrix);
        fim.setColorAt(i, new THREE.Color(f2.c));
      });
      pim.instanceMatrix.needsUpdate = true;
      fim.instanceMatrix.needsUpdate = true;
      if (fim.instanceColor) fim.instanceColor.needsUpdate = true;
      pim.userData.noCollide = true; // shoulder dressing, clear of the corridor
      fim.userData.noCollide = true;
      world.add(pim, fim);
    }
  }

  // ---------- final corridor safety sweep ------------------------------------
  // No scenery may reach into the drivable corridor: anything whose world
  // bounding sphere comes closer than 12 m to the track centerline is shrunk
  // and/or pushed away. Covers wide props at big scale (ice cream, bears,
  // cookies) on bends — the "drove into the hill texture" bug.
  world.updateMatrixWorld(true);
  const fixReach = (geometry, mw, sc, apply) => {
    if (!geometry.boundingSphere) geometry.computeBoundingSphere();
    const bs = geometry.boundingSphere;
    const c = bs.center.clone().applyMatrix4(mw);
    const reach = bs.radius * sc;
    const dist = minDistToTrack(c.x, c.z);
    // breathing room scales with the prop: mountains keep 90 m so the road
    // never visually "drives into" their silhouette on bends; big props (ice
    // cream, bears, cookies) 15 m; roadside lollipops/canes 9.5 m surface
    // (car outer edge reaches 8.1 m from the centerline).
    const need = reach > 20 ? 90 : reach > 6 ? 15 : 9.5;
    if (dist - reach >= need) return;
    let newSc = sc;
    if (reach > 20) {
      newSc = sc; // push-only: keep mountains big, move them away
    } else if (reach > 0) {
      newSc = Math.min(sc, Math.max(0.3, sc * (dist - need) / reach));
    }
    let nx = c.x, nz = c.z;
    const rr = bs.radius * newSc;
    if (dist - rr < need) {
      let best = null, bestD = Infinity;
      for (const p of tSamples) {
        const dx = c.x - p.x, dz = c.z - p.z, d2 = dx * dx + dz * dz;
        if (d2 < bestD) { bestD = d2; best = p; }
      }
      if (best && bestD > 1e-6) {
        const inv = 1 / Math.sqrt(bestD);
        const want = rr + need;
        nx = best.x + (c.x - best.x) * inv * want;
        nz = best.z + (c.z - best.z) * inv * want;
      }
    }
    apply(newSc, nx - c.x, nz - c.z);
  };
  const dmPos = new THREE.Vector3(), dmQuat = new THREE.Quaternion(), dmSc = new THREE.Vector3();
  for (const ch of world.children) {
    if (!ch.isMesh && !ch.isInstancedMesh) continue;
    if (ch.userData.noCollide) continue;
    if (ch.isInstancedMesh) {
      const m = new THREE.Matrix4();
      for (let i = 0; i < ch.count; i++) {
        ch.getMatrixAt(i, m);
        m.decompose(dmPos, dmQuat, dmSc);
        const sc = Math.max(dmSc.x, dmSc.y, dmSc.z) || 1;
        fixReach(ch.geometry, m, sc, (newSc, dx, dz) => {
          dmPos.x += dx; dmPos.z += dz;
          dmSc.multiplyScalar(newSc / sc);
          m.compose(dmPos, dmQuat, dmSc);
          ch.setMatrixAt(i, m);
        });
      }
      ch.instanceMatrix.needsUpdate = true;
    } else {
      const sc = Math.max(ch.scale.x, ch.scale.y, ch.scale.z) || 1;
      fixReach(ch.geometry, ch.matrixWorld, sc, (newSc, dx, dz) => {
        ch.position.x += dx; ch.position.z += dz;
        ch.scale.multiplyScalar(newSc / sc);
      });
    }
  }
  world.updateMatrixWorld(true);

  // Hopping gummy bears are built as plain meshes so the sweep above can place
  // them, then collapse into ONE instanced draw (29 transparent physical draws
  // before). Each keeps a light proxy that update() animates.
  let bearIM = null;
  if (bounceList.length) {
    const first = bounceList[0].m;
    const mat = first.material.clone();
    mat.color.set(0xffffff);
    bearIM = new THREE.InstancedMesh(first.geometry, mat, bounceList.length);
    bearIM.frustumCulled = false; // spread along the whole course
    bearIM.userData.noCollide = true;
    bearIM.name = 'hoppingBears';
    bounceList.forEach((bn, i) => {
      const proxy = new THREE.Object3D();
      proxy.position.copy(bn.m.position);
      proxy.rotation.copy(bn.m.rotation);
      proxy.scale.copy(bn.m.scale);
      proxy.updateMatrix();
      bearIM.setMatrixAt(i, proxy.matrix);
      bearIM.setColorAt(i, bn.m.material.color);
      world.remove(bn.m);
      bn.m = proxy;
    });
    bearIM.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    world.add(bearIM);
  }
  // moving decorations: ~150 tiny draws (a fresh material per balloon/car) -> ~12
  const animSets = [
    instanceGroups(world, balloons.map((b) => b.g), 'balloons'),
    instanceGroups(world, butterflies.map((b) => b.g), 'butterflies'),
    instanceGroups(world, birds.map((b) => b.g), 'birds'),
    instanceGroups(world, coasterCars, 'coasterTrain'),
  ];

  // tunnel darkness (0 = open sky, 1 = deep inside the Swiss roll)
  const HEMI0 = hemi.intensity, SUN0 = sun.intensity;
  let darkK = -1;
  function setDarkness(k) {
    if (k === darkK) return;
    darkK = k;
    hemi.intensity = HEMI0 * (1 - 0.86 * k);
    sun.intensity = SUN0 * (1 - 0.93 * k);
  }
  return {
    hemi, setDarkness,
    sky, sun,
    mountainDebug: () => mountainDebug,
    knockedCount: () => knockItems.reduce((n, it) => n + (it.state ? 1 : 0), 0),
    // prewarm / QA: pin every chunk to one detail level (null = by distance)
    forceLod(level) {
      lodForce = level;
      for (const c of lodChunks) c.inst.geometry = level === 'lo' ? c.lo : c.hi;
    },
    lodStats: () => ({ chunks: lodChunks.length, lo: lodChunks.filter((c) => c.inst.geometry === c.lo).length }),
    update(dt, cameraPos, u, time, carS = -1, carLateral = 0) {
      // Sky stays candy-blue; only the horizon warms up with the zone tint.
      const z = track.zoneAt(u);
      const fogC = tmpColor.copy(zoneFog[z.id]).lerp(zoneSky[z.id], 0.45);
      scene.fog.color.copy(fogC);
      sky.material.uniforms.bottomColor.value.copy(zoneFog[z.id]).lerp(WHITE, 0.25);
      sky.position.copy(cameraPos);

      // prop chunks: full detail near the camera, low-poly twin farther out
      for (const c of lodChunks) {
        if (!c.inst.boundingSphere) c.inst.computeBoundingSphere();
        const bs = c.inst.boundingSphere;
        const g = (lodForce || (bs.center.distanceTo(cameraPos) - bs.radius > LOD_NEAR ? 'lo' : 'hi')) === 'lo' ? c.lo : c.hi;
        if (c.inst.geometry !== g) c.inst.geometry = g;
      }

      // sun follows the car for tight shadows
      sun.position.set(cameraPos.x + 60, cameraPos.y + 95, cameraPos.z - 50);
      sun.target.position.copy(cameraPos);

      // knockable candy canes: hit → topple & slide away
      let knocked = 0;
      let knockDirty = false;
      if (carS >= 0) {
        for (let i = 0; i < knockItems.length; i++) {
          const it = knockItems[i];
          if (it.state === 0) {
            if (Math.abs(it.s - carS) < 2.6 && Math.abs(it.lateral - carLateral) < 2.5) {
              it.state = 1;
              it.t = 0;
              it.dir = (it.lateral - carLateral) >= 0 ? 1 : -1;
              knocked++;
              knockDirty = true;
            }
          } else if (it.t < 1) {
            it.t = Math.min(1, it.t + dt * 1.7);
            knockSync(i);
            knockDirty = true;
          }
        }
        if (knockDirty) { for (const m of knockMeshes) m.instanceMatrix.needsUpdate = true; }
      }

      // clouds drift
      for (const c of clouds) {
        c.sprite.position.x += c.drift * dt * 0.55;
        if (c.sprite.position.x > cameraPos.x + 620) c.sprite.position.x = cameraPos.x - 520;
      }

      // confetti flutter (wrap around the camera region)
      const arr = confGeo.attributes.position.array;
      const wrap = 130;
      for (let i = 0; i < CONFETTI; i++) {
        const ix = i * 3;
        arr[ix] += (confVel[ix] + Math.sin(time * 1.3 + i) * 0.25) * dt;
        arr[ix + 1] += confVel[ix + 1] * dt;
        arr[ix + 2] += (confVel[ix + 2] + Math.cos(time * 1.1 + i * 0.7) * 0.25) * dt;
        // relative wrap around camera
        const dx = arr[ix] - cameraPos.x, dz = arr[ix + 2] - cameraPos.z;
        if (dx > wrap) arr[ix] -= wrap * 2; else if (dx < -wrap) arr[ix] += wrap * 2;
        if (dz > wrap) arr[ix + 2] -= wrap * 2; else if (dz < -wrap) arr[ix + 2] += wrap * 2;
        if (arr[ix + 1] < 1) arr[ix + 1] = 22 + Math.random() * 10;
      }
      confGeo.attributes.position.needsUpdate = true;

      for (const b of balloons) {
        b.g.position.y = b.baseY + Math.sin(time * 0.8 + b.phase) * 1.6;
        b.g.rotation.y = time * 0.25 + b.phase;
      }
      // coaster train circles the loop, cars spaced along the curve
      for (let i = 0; i < coasterCars.length; i++) {
        const ct = (time * 0.042 + i * 0.042) % 1;
        coasterCurve.getPointAt(ct, coasterPt);
        coasterCurve.getTangentAt(ct, coasterTan);
        coasterCars[i].position.set(coasterPt.x, coasterPt.y - 0.55, coasterPt.z);
        coasterCars[i].lookAt(coasterPt.x + coasterTan.x, coasterPt.y - 0.55 + coasterTan.y, coasterPt.z + coasterTan.z);
      }
      // butterflies drift and flap over the meadows
      for (const bf of butterflies) {
        const t2 = time * bf.speed + bf.phase;
        bf.g.position.set(bf.base.x + Math.cos(t2) * bf.r, bf.base.y + Math.sin(t2 * 1.7) * 0.55, bf.base.z + Math.sin(t2) * bf.r);
        bf.g.rotation.y = -t2;
        const flap = Math.sin(time * bf.flap + bf.phase) * 0.95;
        bf.wl.rotation.y = flap;
        bf.wr.rotation.y = -flap;
      }
      // birds wheel in slow circles high above the kingdom
      for (const bd of birds) {
        const a = time * bd.speed + bd.phase;
        bd.g.position.set(bd.cx + Math.cos(a) * bd.r, bd.y + Math.sin(a * 0.7) * 4, bd.cz + Math.sin(a) * bd.r);
        bd.g.rotation.y = -a + Math.PI / 2;
        const flap = Math.sin(time * bd.flap) * 0.5;
        bd.wl.rotation.y = flap;
        bd.wr.rotation.y = -flap;
      }
      // marzipan bears hop with a squash-and-stretch
      for (const bn of bounceList) {
        const hop = Math.abs(Math.sin(time * 2.1 + bn.phase));
        bn.m.position.y = bn.baseY + hop * bn.amp;
        const sq = 1 + (1 - hop) * 0.16;
        bn.m.scale.set(bn.sc * sq, bn.sc * (2 - sq), bn.sc * sq);
        bn.m.rotation.y += bn.spin * dt;
      }
      if (bearIM) {
        for (let i = 0; i < bounceList.length; i++) {
          bounceList[i].m.updateMatrix();
          bearIM.setMatrixAt(i, bounceList[i].m.matrix);
        }
        bearIM.instanceMatrix.needsUpdate = true;
      }
      for (const a of animSets) a.sync();
      // finish confetti curtain swirls and falls, wrapping around the line
      if (curtainData) {
        const arr = curtainData.geo.attributes.position.array;
        const vel = curtainData.vel;
        for (let i = 0; i < curtainData.count; i++) {
          const ix = i * 3;
          arr[ix] += (vel[ix] + Math.sin(time * 1.6 + i) * 0.4) * dt;
          arr[ix + 1] += vel[ix + 1] * dt;
          arr[ix + 2] += (vel[ix + 2] + Math.cos(time * 1.2 + i * 0.8) * 0.4) * dt;
          if (arr[ix + 1] < 1.2) {
            const a = Math.random() * Math.PI * 2;
            const r = Math.random() * 10.5;
            arr[ix] = curtainData.center.x + Math.cos(a) * r;
            arr[ix + 1] = 8.5 + Math.random() * 1.5;
            arr[ix + 2] = curtainData.center.z + Math.sin(a) * r;
          }
        }
        curtainData.geo.attributes.position.needsUpdate = true;
      }
      // spectator crowd cheers near the camera (only nearby clusters animate)
      const cheerS = carS >= 0 ? carS : 14; // menu attract mode: cheer at the grid
      for (const c of crowdItems) {
        if (Math.abs(c.s - cheerS) > 110) continue;
        crowdSync(c, Math.abs(Math.sin(time * 2.6 + c.phase)));
        c.mesh.instanceMatrix.needsUpdate = true;
      }
      return knocked;
    },
    setQuality(tier) {
      const shadows = tier > 0;
      sun.castShadow = shadows;
      confMat.opacity = tier === 2 ? 0.85 : tier === 1 ? 0.6 : 0.35;
      if (tier === 2) sun.shadow.mapSize.set(2048, 2048);
      else if (tier === 1) sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.map && (sun.shadow.map.dispose(), sun.shadow.map = null);
    },
  };
}
