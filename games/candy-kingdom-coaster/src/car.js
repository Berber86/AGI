// The friendly pink "Star Racer 7" convertible with Lily at the wheel.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../vendor/three/jsm/geometries/RoundedBoxGeometry.js';

function decalTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#ff77b8'; g.fillRect(0, 0, 512, 256);
  // white racing stripe
  g.fillStyle = '#fff4fa'; g.fillRect(0, 96, 512, 26);
  // unicorn silhouette
  g.fillStyle = '#fff4fa';
  g.beginPath();
  g.arc(352, 120, 58, 0, Math.PI * 2); g.fill();               // head
  g.beginPath(); g.moveTo(330, 72); g.lineTo(344, 18); g.lineTo(356, 72); g.closePath(); g.fill(); // horn
  g.beginPath(); g.moveTo(382, 74); g.lineTo(414, 46); g.lineTo(398, 92); g.closePath(); g.fill(); // ear
  g.fillStyle = '#ff77b8';
  g.beginPath(); g.arc(336, 112, 8, 0, Math.PI * 2); g.fill();  // eye
  // text
  g.fillStyle = '#fff4fa';
  g.font = 'bold 56px sans-serif';
  g.fillText('STAR RACER', 48, 210);
  g.font = 'bold 72px sans-serif';
  g.fillText('7', 402, 214);
  // sparkles
  g.fillStyle = '#ffe9a8';
  for (let i = 0; i < 14; i++) {
    const x = Math.random() * 512, y = Math.random() * 256, r = 2 + Math.random() * 4;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function glitterTexture() {
  // subtle roughness variation: dark dots read as glossy glitter flakes in the
  // clearcoat under the sun — the "candy glitter paint" of the reference car
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#b8b8c8'; // mid roughness base
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 256, y = Math.random() * 256;
    const r = 0.6 + Math.random() * 1.6;
    g.fillStyle = Math.random() < 0.72 ? 'rgba(30,14,34,0.85)' : 'rgba(255,255,255,0.5)';
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  // a few bigger star flakes
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * 256, y = Math.random() * 256, r = 2.4 + Math.random() * 3.2;
    g.fillStyle = 'rgba(255,246,252,0.9)';
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

function sparkleTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,214,240,0.85)');
  grd.addColorStop(1, 'rgba(255,150,210,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  // 4-point star
  g.fillStyle = 'rgba(255,255,255,0.95)';
  g.beginPath();
  g.moveTo(32, 4); g.lineTo(38, 26); g.lineTo(60, 32); g.lineTo(38, 38); g.lineTo(32, 60); g.lineTo(26, 38); g.lineTo(4, 32); g.lineTo(26, 26);
  g.closePath(); g.fill();
  return new THREE.CanvasTexture(c);
}

function diceTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#fffaf4'; g.fillRect(0, 0, 128, 128);
  g.fillStyle = '#4a2a3a';
  const pip = (x, y) => { g.beginPath(); g.arc(x, y, 14, 0, Math.PI * 2); g.fill(); };
  pip(32, 32); pip(96, 96); pip(96, 32); pip(32, 96); pip(64, 64);
  return new THREE.CanvasTexture(c);
}

// Pink magic-dust trail behind the car (reference look). Lives in the SCENE,
// not on the car group, so the sparks stay where they were born.
export function createTrail(scene, count = 72) {
  const tex = sparkleTexture();
  const items = [];
  for (let i = 0; i < count; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, color: new THREE.Color('#ff8fc6'),
    }));
    s.visible = false;
    scene.add(s);
    items.push({ s, life: 0, maxLife: 1, vel: new THREE.Vector3() });
  }
  let cursor = 0, acc = 0;
  const fwd = new THREE.Vector3();
  const COLORS = ['#ff8fc6', '#ff5fa2', '#c86bff', '#ffe9a8', '#ffffff'];
  return {
    update(dt, carRoot, speed, boost) {
      acc += dt * (boost ? 120 : 58);
      carRoot.getWorldDirection(fwd);
      while (acc >= 1) {
        acc -= 1;
        const it = items[cursor];
        cursor = (cursor + 1) % items.length;
        it.maxLife = it.life = 0.65 + Math.random() * 0.75;
        it.s.visible = true;
        it.s.material.color.set(COLORS[(Math.random() * COLORS.length) | 0]);
        it.s.position.copy(carRoot.position)
          .addScaledVector(fwd, -2.2 - Math.random() * 0.6)
          .add(new THREE.Vector3((Math.random() - 0.5) * 1.5, 0.25 + Math.random() * 0.85, (Math.random() - 0.5) * 0.6));
        const back = 0.8 + Math.min(4, speed) * 0.22;
        it.vel.set(
          (Math.random() - 0.5) * 1.2 - fwd.x * back,
          0.5 + Math.random() * 0.9,
          (Math.random() - 0.5) * 1.2 - fwd.z * back
        );
      }
      for (const it of items) {
        if (it.life <= 0) continue;
        it.life -= dt;
        if (it.life <= 0) { it.s.visible = false; continue; }
        it.s.position.addScaledVector(it.vel, dt);
        it.vel.y += dt * 0.6;
        it.vel.multiplyScalar(1 - dt * 1.4);
        const k = it.life / it.maxLife;
        it.s.material.opacity = k * (boost ? 0.95 : 0.75);
        const sc = (0.16 + (1 - k) * 0.42) * (boost ? 1.5 : 1);
        it.s.scale.set(sc, sc, sc);
      }
    },
    reset() {
      for (const it of items) { it.life = 0; it.s.visible = false; }
    },
  };
}

export function createCar() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const pink = new THREE.MeshPhysicalMaterial({
    color: '#f5489b', roughness: 0.34, metalness: 0.22,
    clearcoat: 1, clearcoatRoughness: 0.1, sheen: 1, sheenColor: '#ff9ed2',
    roughnessMap: glitterTexture(),
  });
  const pinkDark = new THREE.MeshStandardMaterial({ color: '#c22b72', roughness: 0.45, metalness: 0.25 });
  const cream = new THREE.MeshStandardMaterial({ color: '#fff2f7', roughness: 0.4, metalness: 0.12 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: '#bfe9ff', roughness: 0.06, metalness: 0.35, transparent: true, opacity: 0.32,
  });
  const chrome = new THREE.MeshStandardMaterial({ color: '#f6eaf2', roughness: 0.16, metalness: 1 });
  const rubber = new THREE.MeshStandardMaterial({ color: '#3b2c3f', roughness: 0.85 });
  const glow = new THREE.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffd977', emissiveIntensity: 1.4, roughness: 0.3 });
  const tailGlow = new THREE.MeshStandardMaterial({ color: '#ff4f7e', emissive: '#ff2a64', emissiveIntensity: 1.2, roughness: 0.35 });

  const chassis = new THREE.Mesh(new RoundedBoxGeometry(2.05, 0.72, 4.15, 4, 0.34), pink);
  chassis.position.y = 0.62;
  body.add(chassis);

  const skirt = new THREE.Mesh(new RoundedBoxGeometry(2.14, 0.34, 3.9, 3, 0.14), pinkDark);
  skirt.position.y = 0.36;
  body.add(skirt);

  // hood & trunk humps
  const hood = new THREE.Mesh(new RoundedBoxGeometry(1.72, 0.3, 1.15, 3, 0.16), pink);
  hood.position.set(0, 1.02, 1.42);
  body.add(hood);
  const trunk = new THREE.Mesh(new RoundedBoxGeometry(1.8, 0.34, 1.05, 3, 0.16), pink);
  trunk.position.set(0, 1.05, -1.5);
  body.add(trunk);

  // windshield frame + glass
  const wFrame = new THREE.Mesh(new RoundedBoxGeometry(1.62, 0.1, 0.12, 2, 0.05), chrome);
  wFrame.position.set(0, 1.55, 0.62);
  wFrame.rotation.x = -0.42;
  body.add(wFrame);
  const wGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 0.62), glass);
  wGlass.position.set(0, 1.32, 0.68);
  wGlass.rotation.x = -0.42 + Math.PI / 2;
  body.add(wGlass);

  // cockpit opening (darker inset)
  const cockpit = new THREE.Mesh(new RoundedBoxGeometry(1.55, 0.2, 1.9, 2, 0.1), new THREE.MeshStandardMaterial({ color: '#7c1c4c', roughness: 0.7 }));
  cockpit.position.set(0, 0.99, -0.18);
  body.add(cockpit);

  // seats
  const seatMat = new THREE.MeshStandardMaterial({ color: '#ffe2ee', roughness: 0.55 });
  [-0.42, 0.42].forEach((x) => {
    const base = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.16, 0.55, 2, 0.07), seatMat);
    base.position.set(x, 1.06, -0.35);
    const back = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.62, 0.16, 2, 0.07), seatMat);
    back.position.set(x, 1.32, -0.62);
    back.rotation.x = -0.22;
    body.add(base, back);
  });

  // steering wheel
  const wheelHub = new THREE.Group();
  const sw = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.045, 10, 24), pinkDark);
  sw.rotation.x = 0.5;
  wheelHub.add(sw);
  wheelHub.position.set(-0.42, 1.28, 0.28);
  body.add(wheelHub);

  // headlights + taillights
  [-0.66, 0.66].forEach((x) => {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.1, 18), chrome);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, 0.86, 2.08);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 12), glow);
    lamp.position.set(x, 0.86, 2.12);
    body.add(ring, lamp);
    const tail = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.16, 0.08, 2, 0.05), tailGlow);
    tail.position.set(x, 0.95, -2.12);
    body.add(tail);
  });

  // hood bow (like the reference)
  const bow = new THREE.Group();
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), pinkDark);
  const loopL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), pinkDark);
  loopL.scale.set(1.25, 0.75, 0.8); loopL.position.x = -0.2; loopL.rotation.z = 0.5;
  const loopR = loopL.clone(); loopR.position.x = 0.2; loopR.rotation.z = -0.5;
  bow.add(knot, loopL, loopR);
  bow.position.set(0, 1.24, 1.62);
  body.add(bow);

  // dice hanging from windshield
  const diceMat = new THREE.MeshStandardMaterial({ map: diceTexture(), roughness: 0.5 });
  const diceGeo = new RoundedBoxGeometry(0.16, 0.16, 0.16, 2, 0.03);
  const d1 = new THREE.Mesh(diceGeo, diceMat); d1.position.set(0.38, 1.32, 0.52); d1.rotation.set(0.4, 0.6, 0.2);
  const d2 = new THREE.Mesh(diceGeo, diceMat); d2.position.set(0.5, 1.14, 0.5); d2.rotation.set(0.9, 0.2, 0.5);
  body.add(d1, d2);

  // door decals
  const decalMat = new THREE.MeshStandardMaterial({ map: decalTexture(), roughness: 0.42, metalness: 0.12 });
  [-1, 1].forEach((side) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(1.62, 0.81), decalMat);
    p.position.set(side * 1.035, 0.86, -0.15);
    p.rotation.y = side * Math.PI / 2;
    body.add(p);
  });

  // bumpers
  [-2.18, 2.18].forEach((z, i) => {
    const b = new THREE.Mesh(new RoundedBoxGeometry(1.95, 0.18, 0.18, 2, 0.08), chrome);
    b.position.set(0, 0.52, z);
    body.add(b);
  });

  // rear wing (spoiler) — candy style
  const wing = new THREE.Mesh(new RoundedBoxGeometry(1.78, 0.11, 0.46, 2, 0.05), cream);
  wing.position.set(0, 1.26, -2.0);
  const wingStripe = new THREE.Mesh(new RoundedBoxGeometry(1.78, 0.045, 0.2, 2, 0.02), pinkDark);
  wingStripe.position.set(0, 1.315, -2.0);
  const wSupL = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.3, 0.12, 2, 0.03), pinkDark);
  wSupL.position.set(-0.6, 1.1, -1.96);
  const wSupR = wSupL.clone(); wSupR.position.x = 0.6;
  body.add(wing, wingStripe, wSupL, wSupR);

  // full-width tail light bar across the trunk
  const bar = new THREE.Mesh(new RoundedBoxGeometry(1.55, 0.09, 0.06, 2, 0.03), tailGlow);
  bar.position.set(0, 1.02, -2.17);
  body.add(bar);

  // license plate "★7" (the Star Racer number)
  const plateTex = (() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 128;
    const g = c.getContext('2d');
    g.fillStyle = '#fff6fa'; g.fillRect(0, 0, 256, 128);
    g.strokeStyle = '#ff4f96'; g.lineWidth = 10; g.strokeRect(8, 8, 240, 112);
    g.fillStyle = '#e8358c'; g.font = '900 78px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('★ 7', 128, 70);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.26), new THREE.MeshStandardMaterial({ map: plateTex, roughness: 0.4 }));
  plate.position.set(0, 0.72, -2.185);
  plate.rotation.y = Math.PI;
  body.add(plate);

  // exhaust pipes + boost flames
  const flames = [];
  [-0.55, 0.55].forEach((x) => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.115, 0.3, 12), chrome);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(x, 0.42, -2.12);
    body.add(pipe);
    const f = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.6, 10),
      new THREE.MeshBasicMaterial({ color: '#ffd45e', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    f.rotation.x = -Math.PI / 2;
    f.position.set(x, 0.42, -2.55);
    f.visible = false;
    body.add(f);
    flames.push(f);
  });

  // wheels
  const wheels = [];
  const hubTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#fff2f7'; g.fillRect(0, 0, 64, 64);
    g.strokeStyle = '#ff6b9e'; g.lineWidth = 7; g.lineCap = 'round';
    g.beginPath();
    for (let a = 0; a < Math.PI * 4.4; a += 0.12) {
      const r = 2 + a * 2.1;
      const x = 32 + Math.cos(a) * r, y = 32 + Math.sin(a) * r;
      if (a === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
    return new THREE.CanvasTexture(c);
  })();
  const wheelPos = [
    [-1.02, 0.46, 1.32], [1.02, 0.46, 1.32],
    [-1.02, 0.46, -1.38], [1.02, 0.46, -1.38],
  ];
  for (const [x, y, z] of wheelPos) {
    const w = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.34, 22), rubber);
    tire.rotation.z = Math.PI / 2;
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.36, 18), pink);
    rim.rotation.z = Math.PI / 2;
    // candy-swirl hubcap on the outer face
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.265, 0.265, 0.02, 18),
      new THREE.MeshStandardMaterial({ map: hubTex, roughness: 0.35 })
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.x = Math.sign(x) * 0.195;
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), cream);
    hub.position.x = Math.sign(x) * 0.22;
    w.add(tire, rim, cap, hub);
    w.position.set(x, y, z);
    root.add(w);
    wheels.push({ group: w, front: z > 0, hub: rim });
  }

  // lollipop antenna on the rear deck
  const antenna = new THREE.Group();
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.85, 8), cream);
  stick.position.y = 0.42;
  const lolli = new THREE.Mesh(
    new THREE.CylinderGeometry(0.21, 0.21, 0.06, 18),
    new THREE.MeshStandardMaterial({ map: hubTex, roughness: 0.38 })
  );
  lolli.rotation.x = Math.PI / 2;
  lolli.position.y = 0.92;
  antenna.add(stick, lolli);
  antenna.position.set(0.68, 1.18, -1.55);
  antenna.rotation.z = -0.18;
  body.add(antenna);

  // gummy star gem on the hood
  const starShape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.1 : 0.21;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(a) * r, py = Math.sin(a) * r;
    if (i === 0) starShape.moveTo(px, py); else starShape.lineTo(px, py);
  }
  starShape.closePath();
  const star = new THREE.Mesh(
    new THREE.ExtrudeGeometry(starShape, { depth: 0.07, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }),
    new THREE.MeshPhysicalMaterial({ color: '#ffd45e', roughness: 0.25, clearcoat: 1, emissive: '#7a5c10', emissiveIntensity: 0.3 })
  );
  star.rotation.x = -Math.PI / 2;
  star.position.set(0, 1.16, 1.72);
  body.add(star);

  // Lily — chibi driver
  const lily = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: '#ffd2b8', roughness: 0.55 });
  const suit = new THREE.MeshStandardMaterial({ color: '#ff7fb8', roughness: 0.5 });
  const suitWhite = new THREE.MeshStandardMaterial({ color: '#fff2f7', roughness: 0.5 });
  const hairM = new THREE.MeshStandardMaterial({ color: '#7a4a33', roughness: 0.7 });
  const helmetM = new THREE.MeshPhysicalMaterial({ color: '#ff4f9e', roughness: 0.25, metalness: 0.3, clearcoat: 1 });

  const torso = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.55, 0.32, 3, 0.14), suit);
  torso.position.y = 0.32;
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.1, 0.33), suitWhite);
  stripe.position.y = 0.36;
  lily.add(torso, stripe);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 16), skin);
  head.position.y = 0.86;
  head.scale.set(1, 1.06, 0.98);
  lily.add(head);

  // hair fringe + ponytail
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.285, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), hairM);
  hair.position.y = 0.9;
  hair.rotation.x = -0.25;
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), hairM);
  tail.scale.set(1, 1.7, 1);
  tail.position.set(0, 0.78, -0.3);
  tail.rotation.x = 0.7;
  lily.add(hair, tail);

  // face: big eyes + smile
  const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.35 }));
  const eyeB = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 10), new THREE.MeshStandardMaterial({ color: '#43221c', roughness: 0.3 }));
  const glint = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
  [-0.105, 0.105].forEach((x) => {
    const w = eyeW.clone(); w.position.set(x, 0.87, 0.225);
    const b = eyeB.clone(); b.position.set(x * 0.95, 0.865, 0.272);
    const g2 = glint.clone(); g2.position.set(x * 0.85, 0.895, 0.31);
    lily.add(w, b, g2);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.016, 0.016), hairM);
    brow.position.set(x, 0.975, 0.245);
    brow.rotation.z = x > 0 ? -0.18 : 0.18;
    lily.add(brow);
  });
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.014, 8, 14, Math.PI), new THREE.MeshStandardMaterial({ color: '#b0455e', roughness: 0.4 }));
  mouth.position.set(0, 0.78, 0.255);
  mouth.rotation.x = 0.15;
  mouth.rotation.z = Math.PI;
  lily.add(mouth);

  // cheeks
  [-0.16, 0.16].forEach((x) => {
    const ch = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshStandardMaterial({ color: '#ff9d9d', roughness: 0.6, transparent: true, opacity: 0.8 }));
    ch.position.set(x, 0.82, 0.22);
    lily.add(ch);
  });

  // helmet with unicorn horn + ears + goggles band
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.315, 20, 16), helmetM);
  helmet.position.y = 0.93;
  helmet.scale.set(1, 0.92, 1.02);
  const brim = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.035, 10, 24), helmetM);
  brim.position.set(0, 0.83, 0.02);
  brim.rotation.x = Math.PI / 2 - 0.12;
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.22, 10), new THREE.MeshStandardMaterial({ color: '#ffe066', roughness: 0.3, metalness: 0.4 }));
  horn.position.set(0, 1.28, 0.1);
  horn.rotation.x = -0.25;
  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 8), helmetM);
  earL.position.set(-0.16, 1.18, 0.05); earL.rotation.z = 0.5;
  const earR = earL.clone(); earR.position.x = 0.16; earR.rotation.z = -0.5;
  const goggle = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.028, 8, 24, Math.PI), chrome);
  goggle.position.set(0, 1.02, 0.12);
  goggle.rotation.x = Math.PI / 2 + 0.25;
  goggle.rotation.z = Math.PI;
  // star badge on the back of the helmet (visible in chase view)
  const badge = new THREE.Mesh(new THREE.CircleGeometry(0.1, 5), new THREE.MeshStandardMaterial({ color: '#fff6c8', emissive: '#ffd45e', emissiveIntensity: 0.55, roughness: 0.35, side: THREE.DoubleSide }));
  badge.position.set(0, 1.02, -0.29);
  badge.rotation.x = 0.35;
  lily.add(helmet, brim, horn, earL, earR, goggle, badge);

  // arms to the wheel
  [-0.42, 0.3].forEach((x, i) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.42, 10), suit);
    arm.position.set(x * 1.18 - 0.04, 0.42, 0.3);
    arm.rotation.x = 1.15;
    arm.rotation.z = x > 0 ? -0.35 : 0.35;
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), suitWhite);
    glove.position.set(x * 1.05 - 0.04, 0.31, 0.55);
    lily.add(arm, glove);
  });

  lily.position.set(0, 1.02, -0.32);
  body.add(lily);

  // sparkle glitter around the body
  const sparkTex = sparkleTexture();
  const sparks = [];
  for (let i = 0; i < 26; i++) {
    const m = new THREE.Sprite(new THREE.SpriteMaterial({
      map: sparkTex, transparent: true, opacity: 0.0, depthWrite: false,
      blending: THREE.AdditiveBlending, color: new THREE.Color().setHSL(0.92 + Math.random() * 0.1, 0.7, 0.75),
    }));
    const s = 0.1 + Math.random() * 0.2;
    m.scale.set(s, s, s);
    body.add(m);
    sparks.push({ sprite: m, phase: Math.random() * Math.PI * 2, speed: 0.6 + Math.random() * 1.4, r: 0.85 + Math.random() * 0.85, y: 0.3 + Math.random() * 1.2 });
  }

  root.traverse((o) => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });

  const shadowBlob = new THREE.Mesh(
    new THREE.CircleGeometry(1.9, 24),
    new THREE.MeshBasicMaterial({ color: 0x2a1030, transparent: true, opacity: 0.22, depthWrite: false })
  );
  shadowBlob.rotation.x = -Math.PI / 2;
  shadowBlob.position.y = 0.03;
  root.add(shadowBlob);

  // boost underglow — arcade-racer pool of pink light under the car
  const underglowTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    grd.addColorStop(0, 'rgba(255,150,215,0.9)');
    grd.addColorStop(0.45, 'rgba(255,90,180,0.35)');
    grd.addColorStop(1, 'rgba(255,60,160,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const underglow = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 24),
    new THREE.MeshBasicMaterial({ map: underglowTex, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.y = 0.05;
  root.add(underglow);
  root.traverse((o) => { o.userData.noCollide = true; }); // the car belongs on the road

  let wheelSpin = 0;
  return {
    root,
    update(dt, { speed = 0, steer = 0, boost = false, offRoad = false } = {}) {
      const t = performance.now() * 0.001;
      wheelSpin += speed * dt * 2.1;
      for (const w of wheels) {
        w.hub.rotation.x = wheelSpin;
        if (w.front) w.group.rotation.y = THREE.MathUtils.lerp(w.group.rotation.y, steer * 0.42, 0.16);
      }
      // body sway & bob
      const sway = THREE.MathUtils.clamp(steer, -1, 1) * 0.075;
      body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, -sway, 0.1);
      body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, offRoad ? Math.sin(wheelSpin * 0.7) * 0.02 : 0, 0.08);
      body.position.y = Math.sin(wheelSpin * 0.35) * 0.012 * Math.min(1, speed / 12);
      // boost flames flicker at the exhausts
      flames.forEach((f, i) => {
        f.visible = !!boost;
        if (boost) {
          const k = 0.75 + Math.abs(Math.sin(wheelSpin * 1.7 + i * 1.3)) * 0.5;
          f.scale.set(k, k * 1.2, k);
        }
      });
      // (root pitch/roll are owned by main.js: slope, ramps, jumps)

      // Lily feels the drive: ponytail & head sway, steering wheel turns
      tail.rotation.x = 0.7 + Math.sin(wheelSpin * 0.35) * 0.12 * Math.min(1, speed / 14) - steer * 0.18;
      tail.rotation.z = -steer * 0.22;
      lily.rotation.z = THREE.MathUtils.lerp(lily.rotation.z, -sway * 0.55, 0.08);
      lily.rotation.y = THREE.MathUtils.lerp(lily.rotation.y, steer * 0.16, 0.08);
      wheelHub.rotation.z = THREE.MathUtils.lerp(wheelHub.rotation.z, -steer * 0.85, 0.12);
      // taillights flare on boost
      tailGlow.emissiveIntensity = boost ? 1.9 + Math.sin(wheelSpin * 3.1) * 0.4 : 1.2;
      // underglow swells on boost
      const ugTarget = boost ? 0.75 + Math.sin(t * 14) * 0.15 : 0;
      underglow.material.opacity = THREE.MathUtils.lerp(underglow.material.opacity, ugTarget, boost ? 0.25 : 0.12);
      underglow.scale.setScalar(boost ? 1.15 + Math.sin(t * 9) * 0.1 : 1);

      // sparkles
      for (const sp of sparks) {
        const a = t * sp.speed + sp.phase;
        sp.sprite.position.set(Math.cos(a) * sp.r, sp.y + Math.sin(a * 1.7) * 0.25, Math.sin(a * 1.3) * sp.r * 1.6);
        const tw = 0.5 + 0.5 * Math.sin(a * 3.1 + t * 2);
        sp.sprite.material.opacity = (boost ? 0.95 : 0.5) * tw;
        const sc = (boost ? 0.3 : 0.16) * (0.7 + 0.6 * tw);
        sp.sprite.scale.set(sc, sc, sc);
      }
      pink.emissive = pink.emissive || new THREE.Color();
      pink.emissive.setHex(boost ? 0x66103a : 0x1c0410);
      pink.emissiveIntensity = boost ? 0.55 + Math.sin(t * 18) * 0.15 : 0.22;
    },
  };
}
