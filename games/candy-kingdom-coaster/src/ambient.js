// Zone-aware air. A carnival sprinkles rainbow confetti over the meadows, the
// cocoa canyon breathes fine dark dust, the marshmallow valley floats cotton
// floss and the castle run sparkles with sugar glitter; inside the tunnel and
// the crystal grotto the daylight dust fades out and only the sparkles stay.
// One Points layer per kind (4 draws total), all wrapped in a box around the
// chase camera, so the density never depends on the track length.
import * as THREE from 'three';
import { ZONES } from './config.js';

const R = 115;          // half-size of the wrap box around the camera
const TOP = 27, DROP = 9;

const KINDS = [
  { id: 'sprinkle', count: 420, size: .62, fall: .6, swing: .55, windK: .16, lift: 0, near: 1.4, far: 8,
    weights: [1.0, .7, .18, .3, .55],
    colors: ['#ff6b81', '#ffd166', '#6bd96b', '#56c8ff', '#c86bff', '#ff8ad0', '#fff2f7'] },
  { id: 'cocoa', count: 300, size: .44, fall: .24, swing: .4, windK: .1, lift: .02, near: 1.4, far: 8,
    weights: [.12, .4, 1.0, .3, .18],
    colors: ['#8a5a30', '#c08a54', '#5e3a1e', '#e0b183'] },
  { id: 'floss', count: 260, size: .95, fall: .3, swing: .85, windK: .13, lift: .05, near: 2.6, far: 12,
    weights: [.14, .5, .35, 1.0, .55],
    colors: ['#fff2f7', '#ffd9ec', '#f4e7ff', '#ffeaf4'] },
  { id: 'sugar', count: 340, size: .4, fall: .11, swing: 1.15, windK: .2, lift: .06, near: 1.2, far: 7,
    weights: [.4, .3, .22, .75, 1.0],
    colors: ['#ffffff', '#d8f2ff', '#ffe9a8', '#ffd9f2'] },
];

// a tiny round/soft sprite; sugar uses a 4-point star
function airTexture(kind) {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  if (kind === 'sugar') {
    const grd = g.createRadialGradient(16, 16, 0, 16, 16, 15);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(.35, 'rgba(255,255,255,.55)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(16, 16, 15, 0, Math.PI * 2); g.fill();
  } else if (kind === 'floss') {
    const grd = g.createRadialGradient(16, 16, 1, 16, 16, 16);
    grd.addColorStop(0, 'rgba(255,255,255,.95)');
    grd.addColorStop(.6, 'rgba(255,255,255,.45)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 32, 32);
  } else {
    // confetti / cocoa: a small rectangle, the classic sprinkle silhouette
    g.fillStyle = '#fff';
    g.beginPath();
    g.roundRect(11, 6, 10, 20, 5);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createAmbient(scene, track) {
  const group = new THREE.Group();
  group.name = 'ambientAir';
  scene.add(group);
  const zoneIndex = (u) => {
    for (let i = 0; i < ZONES.length; i++) if (u >= ZONES[i].u0 && u < ZONES[i].u1) return i;
    return ZONES.length - 1;
  };
  const layers = KINDS.map((k) => {
    const pos = new Float32Array(k.count * 3);
    const col = new Float32Array(k.count * 3);
    const vel = new Float32Array(k.count * 3);
    const palette = k.colors.map((h) => new THREE.Color(h));
    for (let i = 0; i < k.count; i++) {
      pos[i * 3] = (Math.random() - .5) * R * 2;
      pos[i * 3 + 1] = Math.random() * TOP;
      pos[i * 3 + 2] = (Math.random() - .5) * R * 2;
      const c = palette[i % palette.length];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      vel[i * 3] = (Math.random() - .5) * .6;
      vel[i * 3 + 1] = -(k.fall * (.6 + Math.random() * .8));
      vel[i * 3 + 2] = (Math.random() - .5) * .6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), R * 2.2); // never culled
    const mat = new THREE.PointsMaterial({
      size: k.size, map: airTexture(k.id), vertexColors: true, transparent: true,
      opacity: 0, depthWrite: false, sizeAttenuation: true,
    });
    // Sprites fade out inside `near` metres: that is what lets the flakes be
    // big enough to read at 30 m without ever becoming a wall of colour when
    // the chase camera drives straight through them.
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = `varying float vAirFade;\n${shader.vertexShader}`.replace(
        '#include <fog_vertex>',
        `#include <fog_vertex>\n\tvAirFade = smoothstep(${(k.near ?? 1.4).toFixed(2)}, ${(k.far ?? 8).toFixed(2)}, - mvPosition.z);`);
      shader.fragmentShader = `varying float vAirFade;\n${shader.fragmentShader}`.replace(
        '#include <opaque_fragment>',
        'diffuseColor.a *= vAirFade;\n\t#include <opaque_fragment>');
    };
    mat.customProgramCacheKey = () => `air-${k.id}`;
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    points.userData.noCollide = true;
    group.add(points);
    const shift = new THREE.Vector3(
      (Math.random() - .5) * 40, 0, (Math.random() - .5) * 40);
    void shift;
    return { kind: k, mat, points, pos, vel, count: k.count };
  });
  // the whole field is parked relative to the camera; the first frame seeds it
  const prev = new THREE.Vector3();
  let seeded = false, prevU = -1;
  const wind = new THREE.Vector3();

  function update(dt, cameraPos, u, speed = 0, dark = 0) {
    if (!seeded) {
      for (const l of layers) for (let i = 0; i < l.count; i++) {
        l.pos[i * 3] += cameraPos.x; l.pos[i * 3 + 2] += cameraPos.z;
        l.pos[i * 3 + 1] += Math.max(0, cameraPos.y - DROP);
      }
      prev.copy(cameraPos); seeded = true;
    }
    const zi = zoneIndex(THREE.MathUtils.clamp(u, 0, .999));
    // how strongly the car's own speed stirs each layer
    const rush = THREE.MathUtils.clamp(speed / 21.5, 0, 2);
    if (dt > 1e-4) wind.copy(cameraPos).sub(prev).divideScalar(dt);
    if (wind.lengthSq() > 900) wind.setLength(30);
    wind.multiplyScalar(dt);
    prev.copy(cameraPos);
    const time = performance.now() * .001;
    for (const l of layers) {
      const k = l.kind;
      // zone weight, dimmed by tunnel/grotto darkness; the sparkles survive it
      const base = k.weights[zi] ?? 0;
      const target = k.id === 'sugar'
        ? Math.max(base * (1 - dark * .45), dark * .8)
        : base * (1 - dark * .82);
      l.mat.opacity += (target - l.mat.opacity) * Math.min(1, dt * 1.6);
      l.points.visible = l.mat.opacity > .015;
      if (!l.points.visible) continue;
      const arr = l.pos;
      const stirX = wind.x * k.windK * (1 + rush * .5);
      const stirZ = wind.z * k.windK * (1 + rush * .5);
      for (let i = 0; i < l.count; i++) {
        const ix = i * 3;
        arr[ix] += (l.vel[ix] + Math.sin(time * 1.2 + i * .7) * k.swing) * dt + stirX;
        arr[ix + 1] += (l.vel[ix + 1] + k.lift) * dt;
        arr[ix + 2] += (l.vel[ix + 2] + Math.cos(time * 1.05 + i * .9) * k.swing) * dt + stirZ;
        const dx = arr[ix] - cameraPos.x, dz = arr[ix + 2] - cameraPos.z;
        if (dx > R) arr[ix] -= R * 2; else if (dx < -R) arr[ix] += R * 2;
        if (dz > R) arr[ix + 2] -= R * 2; else if (dz < -R) arr[ix + 2] += R * 2;
        const floor = cameraPos.y - DROP, ceil = cameraPos.y + TOP;
        if (arr[ix + 1] < floor) { arr[ix + 1] = ceil - Math.random() * 6; }
        else if (arr[ix + 1] > ceil) { arr[ix + 1] = floor + Math.random() * 4; }
      }
      l.points.geometry.attributes.position.needsUpdate = true;
    }
    prevU = u;
  }
  function info() {
    return { zone: prevU < 0 ? -1 : zoneIndex(THREE.MathUtils.clamp(prevU, 0, .999)),
      layers: layers.map((l) => ({ id: l.kind.id, opacity: +l.mat.opacity.toFixed(3), visible: l.points.visible, count: l.count })) };
  }
  return { group, update, info };
}
