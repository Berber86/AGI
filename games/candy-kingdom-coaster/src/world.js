// Candy Kingdom world: sky, clouds, mountains, castle, rollercoaster, props, confetti.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/three/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from '../vendor/three/jsm/utils/BufferGeometryUtils.js';
import { ZONES, zoneAt, TUNING } from './config.js';

const UP = new THREE.Vector3(0, 1, 0);

function skyDome() {
  const geo = new THREE.SphereGeometry(760, 32, 18);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color('#1f8ae6') },
      midColor: { value: new THREE.Color('#6fc6f6') },
      bottomColor: { value: new THREE.Color('#ffc6e0') },
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

function gummyBearGeometry() {
  return mergeParts([
    { geo: new THREE.SphereGeometry(0.55, 12, 10), pos: [0, 0.62, 0], scale: [1, 1.15, 0.82] },
    { geo: new THREE.SphereGeometry(0.38, 12, 10), pos: [0, 1.5, 0.05] },
    { geo: new THREE.SphereGeometry(0.15, 8, 6), pos: [-0.3, 1.82, 0] },
    { geo: new THREE.SphereGeometry(0.15, 8, 6), pos: [0.3, 1.82, 0] },
    { geo: new THREE.SphereGeometry(0.17, 8, 6), pos: [-0.62, 0.95, 0.1], scale: [1, 1.5, 1] },
    { geo: new THREE.SphereGeometry(0.17, 8, 6), pos: [0.62, 0.95, 0.1], scale: [1, 1.5, 1] },
    { geo: new THREE.SphereGeometry(0.2, 8, 6), pos: [-0.3, 0.16, 0.12], scale: [1, 1, 1.3] },
    { geo: new THREE.SphereGeometry(0.2, 8, 6), pos: [0.3, 0.16, 0.12], scale: [1, 1, 1.3] },
    { geo: new THREE.SphereGeometry(0.16, 8, 6), pos: [0, 1.45, 0.36], scale: [1.15, 0.9, 0.8] }, // muzzle
  ]);
}

function lollipopGeometry() {
  return mergeParts([
    { geo: new THREE.CylinderGeometry(0.085, 0.1, 2.6, 8), pos: [0, 1.3, 0] },
    { geo: new THREE.CylinderGeometry(1.05, 1.05, 0.3, 26), pos: [0, 3.15, 0], rot: [Math.PI / 2, 0, 0] },
    { geo: new THREE.TorusGeometry(1.05, 0.12, 8, 26), pos: [0, 3.15, 0] },
  ]);
}

function caneGeometry() {
  return mergeParts([
    { geo: new THREE.CylinderGeometry(0.14, 0.16, 3.4, 10), pos: [0, 1.7, 0] },
    { geo: new THREE.TorusGeometry(0.72, 0.15, 10, 20, Math.PI), pos: [0.72, 3.4, 0], rot: [0, 0, Math.PI] },
  ]);
}

function treeGeometry() {
  return mergeParts([
    { geo: new THREE.CylinderGeometry(0.22, 0.3, 1.6, 8), pos: [0, 0.8, 0] },
    { geo: new THREE.SphereGeometry(1.15, 12, 10), pos: [0, 2.15, 0], scale: [1, 0.95, 1] },
    { geo: new THREE.SphereGeometry(0.85, 10, 8), pos: [-0.75, 1.85, 0.25] },
    { geo: new THREE.SphereGeometry(0.85, 10, 8), pos: [0.8, 1.9, -0.15] },
  ]);
}

function marshGeometry() {
  return mergeParts([
    { geo: new RoundedBoxGeometry(1.5, 1.0, 1.5, 3, 0.34), pos: [0, 0.5, 0] },
    { geo: new RoundedBoxGeometry(1.15, 0.8, 1.15, 3, 0.3), pos: [0, 1.4, 0] },
    { geo: new RoundedBoxGeometry(0.8, 0.62, 0.8, 3, 0.24), pos: [0, 2.05, 0] },
  ]);
}

function iceCreamGeometry() {
  return mergeParts([
    { geo: new THREE.ConeGeometry(0.95, 1.9, 14), pos: [0, 0.95, 0], rot: [Math.PI, 0, 0] },
    { geo: new THREE.SphereGeometry(1.02, 14, 12), pos: [0, 2.25, 0] },
    { geo: new THREE.SphereGeometry(0.72, 12, 10), pos: [-0.55, 2.95, 0.1] },
    { geo: new THREE.SphereGeometry(0.2, 10, 8), pos: [0, 3.35, 0] }, // cherry
  ]);
}

function cookieGeometry() {
  return mergeParts([
    { geo: new THREE.CylinderGeometry(1.5, 1.35, 0.65, 16), pos: [0, 0.32, 0] },
    { geo: new THREE.CylinderGeometry(1.05, 1.0, 0.5, 14), pos: [0.3, 0.85, 0.1] },
    { geo: new THREE.SphereGeometry(0.3, 8, 6), pos: [-0.7, 0.75, 0.6], scale: [1, 0.6, 1] },
    { geo: new THREE.SphereGeometry(0.25, 8, 6), pos: [0.95, 0.55, -0.5], scale: [1, 0.6, 1] },
  ]);
}

export function createWorld(scene, track, renderer) {
  const world = new THREE.Group();
  scene.add(world);

  // ---------- sky & lights ----------
  const sky = skyDome();
  world.add(sky);
  scene.fog = new THREE.Fog(0x9fd8ff, 90, 460);

  const hemi = new THREE.HemisphereLight(0xbfe4ff, 0xffb8dc, 0.78);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0dd, 1.55);
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
  sunSprite.scale.set(150, 150, 1);
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
  const puffMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true, transparent: true, opacity: 0.92 });
  for (let i = 0; i < 8; i++) {
    const cluster = new THREE.Group();
    const n = 4 + Math.floor(Math.random() * 4);
    for (let j = 0; j < n; j++) {
      const r = 7 + Math.random() * 11;
      const p = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), puffMat);
      p.position.set((Math.random() - 0.5) * 32, (Math.random() - 0.5) * 7, (Math.random() - 0.5) * 15);
      p.scale.y = 0.55;
      cluster.add(p);
    }
    const a = Math.random() * Math.PI * 2;
    const rr = 170 + Math.random() * 260;
    cluster.position.set(track.bounds.center.x + Math.cos(a) * rr, 52 + Math.random() * 75, track.bounds.center.z + Math.sin(a) * rr);
    world.add(cluster);
    clouds.push({ sprite: cluster, drift: 0.8 + Math.random() * 1.6 });
  }

  // ---------- rainbows arching over the road (plus the castle one) ----------
  const rainbowCols = ['#ff6b81', '#ffb14e', '#ffe66d', '#6bd96b', '#56c8ff', '#a06bff'];
  [0.18, 0.55, 0.86].forEach((u, ri) => {
    const p = track.getPose(track.length * u, 0);
    const rainbow = new THREE.Group();
    rainbowCols.forEach((c, i) => {
      const t = new THREE.Mesh(
        new THREE.TorusGeometry(10.5 - i * 1.15, 0.62, 8, 26, Math.PI),
        new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, emissive: new THREE.Color(c), emissiveIntensity: 0.12 })
      );
      rainbow.add(t);
    });
    rainbow.position.copy(p.pos);
    rainbow.position.y += 1.2;
    rainbow.lookAt(
      p.pos.x + Math.sin(p.heading),
      p.pos.y + 1.2,
      p.pos.z + Math.cos(p.heading)
    );
    world.add(rainbow);
  });

  // ---------- distant mountains (ring around the course) ----------
  const mountainMat = new THREE.MeshStandardMaterial({ color: '#e8d6f2', roughness: 0.9, flatShading: true });
  const mountainMatB = new THREE.MeshStandardMaterial({ color: '#f2c9e0', roughness: 0.9, flatShading: true });
  const capMat = new THREE.MeshStandardMaterial({ color: '#fff6fa', roughness: 0.85, flatShading: true });
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.35;
    const r = 560 + (i % 3) * 160;
    const h = 90 + (i * 37) % 90;
    const m = new THREE.Mesh(new THREE.ConeGeometry(90 + (i % 4) * 35, h, 7), i % 2 ? mountainMat : mountainMatB);
    m.position.set(
      track.bounds.center.x + Math.cos(a) * r,
      h / 2 - 20,
      track.bounds.center.z + Math.sin(a) * r
    );
    world.add(m);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(42 + (i % 3) * 14, h * 0.32, 6), capMat);
    cap.position.set(m.position.x, h - 20 - h * 0.14, m.position.z);
    world.add(cap);
  }

  // ---------- the Sugar Castle ----------
  function buildCastle(scale = 1) {
    const castle = new THREE.Group();
    const wall = new THREE.MeshStandardMaterial({ color: '#ffb7d9', roughness: 0.55, metalness: 0.05 });
    const wallB = new THREE.MeshStandardMaterial({ color: '#ff8fc6', roughness: 0.55 });
    const roof = new THREE.MeshStandardMaterial({ color: '#ff4f96', roughness: 0.4, metalness: 0.12, emissive: '#7a1044', emissiveIntensity: 0.22 });
    const roofB = new THREE.MeshStandardMaterial({ color: '#8f6bff', roughness: 0.4, metalness: 0.12, emissive: '#2c1270', emissiveIntensity: 0.22 });
    const gold = new THREE.MeshStandardMaterial({ color: '#ffd45e', roughness: 0.3, metalness: 0.85, emissive: '#7a5c10', emissiveIntensity: 0.35 });

    const base = new THREE.Mesh(new RoundedBoxGeometry(30, 7, 20, 3, 1.2), wall);
    base.position.y = 3.5;
    castle.add(base);

    const tower = (x, z, r, h, mat, rmat, flag = true) => {
      const t = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.12, h, 14), mat);
      body.position.y = h / 2;
      const top = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.22, r * 1.22, 1.1, 14), wallB);
      top.position.y = h + 0.2;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(r * 1.32, r * 2.6, 14), rmat);
      cone.position.y = h + r * 1.3 + 0.8;
      t.add(body, top, cone);
      // windows
      for (let k = 0; k < 3; k++) {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.28, r * 0.28, 0.7, 10), new THREE.MeshStandardMaterial({ color: '#6a2c8c', emissive: '#ffb347', emissiveIntensity: 0.7, roughness: 0.3 }));
        w.rotation.x = Math.PI / 2;
        w.position.set(0, h * (0.35 + k * 0.2), r * 0.98);
        t.add(w);
      }
      if (flag) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.2, 6), gold);
        pole.position.y = h + r * 2.8;
        const f = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), new THREE.MeshStandardMaterial({ color: ['#ff4f96', '#ffd45e', '#56c8ff'][Math.floor(Math.abs(x)) % 3], side: THREE.DoubleSide, roughness: 0.5 }));
        f.position.set(1.35, h + r * 2.8 + 1.1, 0);
        t.add(pole, f);
      }
      t.position.set(x, 0, z);
      return t;
    };

    castle.add(tower(-11, 5, 3.4, 16, wall, roof));
    castle.add(tower(11, 5, 3.4, 16, wall, roof));
    castle.add(tower(-11, -5, 3.0, 13, wallB, roofB));
    castle.add(tower(11, -5, 3.0, 13, wallB, roofB));
    const keep = tower(0, -2, 4.6, 24, wall, roof);
    castle.add(keep);

    // gate
    const gate = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 2.2, 16, 1, false, 0, Math.PI), new THREE.MeshStandardMaterial({ color: '#7a3c66', roughness: 0.6 }));
    gate.rotation.z = Math.PI / 2;
    gate.rotation.y = Math.PI / 2;
    gate.position.set(0, 3.1, 10.2);
    castle.add(gate);

    // rainbow over the gate
    const rainbow = new THREE.Group();
    const cols = ['#ff6b81', '#ffb14e', '#ffe66d', '#6bd96b', '#56c8ff', '#a06bff'];
    cols.forEach((c, i) => {
      const t = new THREE.Mesh(new THREE.TorusGeometry(8.2 - i * 0.95, 0.55, 8, 26, Math.PI), new THREE.MeshStandardMaterial({ color: c, roughness: 0.45 }));
      rainbow.add(t);
    });
    rainbow.position.set(0, 2.5, 11.2);
    castle.add(rainbow);

    castle.scale.setScalar(scale);
    castle.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
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
  const midPose = track.getPose(track.length * 0.42, 0);
  const castleFar = buildCastle(1.2);
  castleFar.position.copy(midPose.pos).add(
    new THREE.Vector3(Math.cos(midPose.heading) * 95, -3.5, -Math.sin(midPose.heading) * 95)
  );
  castleFar.lookAt(midPose.pos.x, castleFar.position.y + 6, midPose.pos.z);
  world.add(castleFar);

  // ---------- rollercoaster rails (background fun, near mid-course) ----------
  const c0 = track.getPose(track.length * 0.62, 0);
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
  const railA = new THREE.Mesh(new THREE.TubeGeometry(coasterCurve, 120, 0.55, 8, true), railMat);
  world.add(railA);
  for (let i = 0; i < 22; i++) {
    const p = coasterCurve.getPointAt(i / 22);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, Math.max(2, p.y), 8), railMat);
    post.position.set(p.x, p.y / 2 - 2, p.z);
    world.add(post);
  }

  // ---------- instanced props along the track ----------
  const propMats = {
    lolli: ['#ff5fa2', '#56c8ff', '#ffd45e'].map((c) => new THREE.MeshStandardMaterial({ map: swirlTexture(c, '#fff2f7'), roughness: 0.42, metalness: 0.05 })),
    cane: new THREE.MeshStandardMaterial({ map: stripeTexture(), roughness: 0.45 }),
    bear: new THREE.MeshPhysicalMaterial({ roughness: 0.22, metalness: 0.05, transparent: true, opacity: 0.92, clearcoat: 0.9, clearcoatRoughness: 0.25, transmission: 0.12, thickness: 1.2, emissive: 0x301018, emissiveIntensity: 0.25 }),
    tree: new THREE.MeshStandardMaterial({ roughness: 0.6 }),
    marsh: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    ice: new THREE.MeshStandardMaterial({ roughness: 0.5 }),
    cookie: new THREE.MeshStandardMaterial({ map: cookieTexture(), roughness: 0.7 }),
    stick: new THREE.MeshStandardMaterial({ color: '#fff6ee', roughness: 0.5 }),
  };

  const placements = { lolli0: [], lolli1: [], lolli2: [], cane: [], bear: [], tree: [], marsh: [], ice: [], cookie: [] };
  const rand = (() => { let s = 1234567; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

  const L = track.length;
  for (let s = 10; s < L - 14; s += 4.2) {
    const u = s / L;
    const z = zoneAt(u);
    const side = Math.floor(s / 4.2) % 2 ? 1 : -1;
    // keep the road corridor clear: props never closer than 8.2 m, big scale only far away
    const far = 8.2 + rand() * 17;
    const lateral = side * far;
    const { pos, heading } = track.getPose(s + (rand() - 0.5) * 4, lateral);
    const scMax = Math.min(2.8, 0.9 + far * 0.11);
    const slot = { x: pos.x, y: pos.y - far * 0.1 - 0.35, z: pos.z, ry: heading + (rand() - 0.5) * 1.2, sc: 1.0 + rand() * (scMax - 1.0) };

    const roll = rand();
    if (z.id === 0) {
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
      if (rand() < 0.85) {
        const wp = track.getPose(s + (rand() - 0.5) * 3, wallSide * (7.0 + rand() * 1.1));
        const slotW = { x: wp.pos.x, y: wp.pos.y - 0.3, z: wp.pos.z, ry: rand() * Math.PI * 2, sc: 0.5 + rand() * 0.35 };
        const roll2 = rand();
        if (roll2 < 0.36) placements[`lolli${Math.floor(rand() * 3)}`].push(slotW);
        else if (roll2 < 0.62) placements.cane.push(slotW);
        else if (roll2 < 0.82) placements.marsh.push(slotW);
        else placements.bear.push({ ...slotW, sc: 0.65 + rand() * 0.35, ry: wp.heading + Math.PI });
      }
      // mid-field filler band (8.6-12 m) — fills the frame edges, clear of the corridor
      if (rand() < 0.55) {
        const mp = track.getPose(s + (rand() - 0.5) * 4, wallSide * (8.6 + rand() * 3.2));
        const slotM = { x: mp.pos.x, y: mp.pos.y - 0.5, z: mp.pos.z, ry: rand() * Math.PI * 2, sc: 0.55 + rand() * 0.6 };
        const roll3 = rand();
        if (roll3 < 0.3) placements[`lolli${Math.floor(rand() * 3)}`].push(slotM);
        else if (roll3 < 0.5) placements.cane.push(slotM);
        else if (roll3 < 0.68) placements.marsh.push(slotM);
        else if (roll3 < 0.84) placements.ice.push(slotM);
        else placements.tree.push(slotM);
      }
    }
    if (rand() < 0.38) {
      const bp = track.getPose(s + 1, side * (7.2 + rand() * 1.4));
      placements.bear.push({ x: bp.pos.x, y: bp.pos.y - 0.3, z: bp.pos.z, ry: bp.heading + Math.PI + (rand() - 0.5) * 0.8, sc: 0.95 + rand() * 0.5 });
    }
  }

  // giant hero lollipops & canes lining the course
  const heroSpots = [0.05, 0.10, 0.16, 0.22, 0.28, 0.35, 0.42, 0.49, 0.56, 0.63, 0.70, 0.77, 0.84, 0.90, 0.95];
  heroSpots.forEach((u, i) => {
    const side = i % 2 ? 1 : -1;
    const p = track.getPose(track.length * u, side * (14.5 + (i % 3) * 3.5));
    if (i % 3 === 0) placements.lolli0.push({ x: p.pos.x, y: p.pos.y - 1, z: p.pos.z, ry: i, sc: 3.6 + (i % 2) * 1.3 });
    else if (i % 3 === 1) placements.lolli1.push({ x: p.pos.x, y: p.pos.y - 1, z: p.pos.z, ry: i, sc: 3.9 + (i % 2) });
    else placements.cane.push({ x: p.pos.x, y: p.pos.y - 1, z: p.pos.z, ry: i * 1.7, sc: 3.7 + (i % 2) * 1.2 });
  });

  // ---------- knockable candy-cane fence (topples when the car hits it) ----------
  const KNOCK = 300;
  const knockMesh = new THREE.InstancedMesh(caneGeometry(), propMats.cane, KNOCK);
  knockMesh.castShadow = true;
  knockMesh.receiveShadow = true;
  const knockItems = [];
  for (let i = 0; i < KNOCK; i++) {
    const s = 8 + (i / KNOCK) * (L - 20);
    const kSide = i % 2 ? 1 : -1;
    const lat = kSide * (6.1 + rand() * 0.9);
    const p = track.getPose(s + (rand() - 0.5) * 2, lat);
    knockItems.push({
      x: p.pos.x, y: p.pos.y - 0.25, z: p.pos.z,
      ry: rand() * Math.PI * 2, sc: 0.5 + rand() * 0.28,
      s, lateral: lat, state: 0, t: 0, dir: kSide,
    });
  }
  world.add(knockMesh);
  const knockDummy = new THREE.Object3D();
  function knockSync(i) {
    const it = knockItems[i];
    const k = Math.min(1, it.t);
    const slide = it.state ? k * 1.5 : 0;
    knockDummy.position.set(it.x + it.dir * slide * 0.6, it.y + (it.state ? Math.sin(k * Math.PI) * 0.22 : 0), it.z + it.dir * slide * 0.35);
    knockDummy.rotation.set(0, it.ry, it.state ? it.dir * k * 1.42 : 0);
    knockDummy.scale.setScalar(it.sc);
    knockDummy.updateMatrix();
    knockMesh.setMatrixAt(i, knockDummy.matrix);
  }
  for (let i = 0; i < KNOCK; i++) knockSync(i);
  knockMesh.instanceMatrix.needsUpdate = true;

  const dummy = new THREE.Object3D();
  function makeInstanced(geo, mat, list, colorFn) {
    if (!list.length) return null;
    const inst = new THREE.InstancedMesh(geo, mat, list.length);
    inst.castShadow = true;
    inst.receiveShadow = true;
    list.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(0, p.ry, 0);
      dummy.scale.setScalar(p.sc ?? 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      if (colorFn) inst.setColorAt(i, colorFn(i, p));
    });
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    world.add(inst);
    return inst;
  }

  const BEAR_COLORS = ['#ff5f7a', '#56c8ff', '#ffd45e', '#8ef07e', '#ff8ad0', '#b18aff'];
  makeInstanced(lollipopGeometry(), propMats.lolli[0], placements.lolli0);
  makeInstanced(lollipopGeometry(), propMats.lolli[1], placements.lolli1);
  makeInstanced(lollipopGeometry(), propMats.lolli[2], placements.lolli2);
  makeInstanced(caneGeometry(), propMats.cane, placements.cane);
  makeInstanced(gummyBearGeometry(), propMats.bear, placements.bear, (i) => new THREE.Color(BEAR_COLORS[i % BEAR_COLORS.length]));
  makeInstanced(treeGeometry(), propMats.tree, placements.tree, (i) => new THREE.Color(['#7ddf9a', '#8fe0c8', '#c6e87d', '#9adcff'][i % 4]));
  makeInstanced(marshGeometry(), propMats.marsh, placements.marsh, (i) => new THREE.Color(['#fff2f7', '#ffd6e8', '#fff0d8', '#e8d6ff'][i % 4]));
  makeInstanced(iceCreamGeometry(), propMats.ice, placements.ice, (i) => new THREE.Color(['#ffd6e8', '#d8f2ff', '#fff2c8', '#e2d2ff'][i % 4]));
  makeInstanced(cookieGeometry(), propMats.cookie, placements.cookie);

  // giant hero lollipops & canes at camera-visible moments
  const heroLolli = new THREE.Mesh(lollipopGeometry(), propMats.lolli[0]);
  heroLolli.scale.setScalar(4.2);
  heroLolli.position.copy(track.getPose(L * 0.08, -18).pos).add(new THREE.Vector3(0, -1, 0));
  world.add(heroLolli);
  const heroCane = new THREE.Mesh(caneGeometry(), propMats.cane);
  heroCane.scale.setScalar(4.4);
  heroCane.position.copy(track.getPose(L * 0.55, 17).pos).add(new THREE.Vector3(0, -1, 0));
  world.add(heroCane);

  // grandstand gummy-bears near the finish (like the reference crowd)
  const crowd = [];
  for (let i = 0; i < 26; i++) {
    const u = 0.94 + (i % 5) * 0.009;
    const side = i % 2 ? 7.2 : -7.2;
    const p = track.getPose(track.length * u, side + (i % 3) * 1.1);
    crowd.push({ x: p.pos.x, y: p.pos.y - 0.35, z: p.pos.z, ry: p.heading + Math.PI, sc: 1.15 + (i % 3) * 0.18 });
  }
  makeInstanced(gummyBearGeometry(), propMats.bear, crowd, (i) => new THREE.Color(BEAR_COLORS[i % BEAR_COLORS.length]));

  // ---------- air confetti ----------
  const CONFETTI = 520;
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
    size: 0.42, map: confTex, vertexColors: true, transparent: true,
    opacity: 0.85, depthWrite: false, sizeAttenuation: true,
  });
  const confetti = new THREE.Points(confGeo, confMat);
  world.add(confetti);

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

  return {
    sky, sun,
    knockedCount: () => knockItems.reduce((n, it) => n + (it.state ? 1 : 0), 0),
    update(dt, cameraPos, u, time, carS = -1, carLateral = 0) {
      // Sky stays candy-blue; only the horizon warms up with the zone tint.
      const z = zoneAt(u);
      const fogC = tmpColor.copy(zoneFog[z.id]).lerp(zoneSky[z.id], 0.45);
      scene.fog.color.copy(fogC);
      sky.material.uniforms.bottomColor.value.copy(zoneFog[z.id]).lerp(WHITE, 0.25);
      sky.position.copy(cameraPos);

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
        if (knockDirty) knockMesh.instanceMatrix.needsUpdate = true;
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
