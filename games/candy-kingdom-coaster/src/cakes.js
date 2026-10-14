// Two edible mountains and their sky bridge. The playable surface belongs to
// track.js; this module only dresses that same route (never a second road).
import * as THREE from 'three';
import { CAKE_COURSE } from './config.js';
import { mergeByMaterial } from './merge.js';

const UP = new THREE.Vector3(0, 1, 0);
const FLOOR = -3.3;

function spongeTexture(chocolate) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = chocolate ? '#875239' : '#ffe4b3'; g.fillRect(0, 0, 256, 256);
  let seed = chocolate ? 173 : 59;
  const rand = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = i % 3 ? (chocolate ? '#563420' : '#cc9a60') : (chocolate ? '#bd8361' : '#fff9e4');
    g.globalAlpha = 0.15 + rand() * 0.25;
    g.beginPath(); g.ellipse(rand() * 256, rand() * 256, 0.6 + rand() * 2, 0.4 + rand() * 1.2, rand() * 3, 0, Math.PI * 2); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(12, 1);
  return t;
}

// The drip hem hangs down the OUTSIDE of the sponge, rather than intersecting
// a flat disk. UVs also let this merge with the other indexed icing geometry.
function dripGeometry(radius, y, phase) {
  const pos = [], uv = [], idx = [], n = 160;
  for (let i = 0; i <= n; i++) {
    const a = i / n * Math.PI * 2;
    const drip = 0.7 + 1.45 * Math.max(0, Math.cos(a * 14 + phase)) ** 6
      + 0.65 * Math.max(0, Math.cos(a * 9 - phase)) ** 10;
    for (const h of [y, y - drip]) {
      pos.push(Math.cos(a) * radius, h, Math.sin(a) * radius);
      uv.push(i / n, h === y ? 1 : 0);
    }
    if (i < n) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}

function mesh(parent, geometry, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, material); m.position.set(x, y, z); parent.add(m); return m;
}
function bar(parent, a, b, radius, material) {
  const delta = b.clone().sub(a);
  const m = mesh(parent, new THREE.CylinderGeometry(radius, radius, delta.length(), 6), material);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(UP, delta.normalize());
  return m;
}

export function createCakes(scene, track, TEX = {}) {
  const C = CAKE_COURSE, section = track.cakeSection;
  const group = new THREE.Group(); group.name = 'cakeSerpentines'; scene.add(group);
  const material = (color, roughness = 0.48) => new THREE.MeshStandardMaterial({ color, roughness });
  const cream = material('#fff4df'), pink = material('#ffa3c8'), lavender = material('#b59bef');
  const jam = material('#eb6897'), ganache = material('#4a271e', 0.32);
  const berry = material('#ef4169', 0.33), blueberry = material('#6554b2', 0.34);
  const leaf = material('#78b864'), gold = material('#ffd06c');
  const wafer = new THREE.MeshStandardMaterial({ color: TEX.wall ? '#fff0d4' : '#d9a86c', map: TEX.wall || null, roughness: 0.78 });
  const cane = new THREE.MeshStandardMaterial({ color: TEX.cane ? '#ffffff' : '#ff719e', map: TEX.cane || null, roughness: 0.48 });
  const sphere = new THREE.SphereGeometry(1, 10, 7);
  const pipingGeo = new THREE.SphereGeometry(1, 8, 5); // tiny cream/leaf details
  const seedGeo = new THREE.SphereGeometry(1, 5, 4);
  const strawberryGeo = new THREE.LatheGeometry([
    [0, -2.2], [0.5, -1.9], [1.1, -1.3], [1.65, -0.45], [1.85, 0.4], [1.6, 1.2], [0.8, 1.5], [0, 1.4],
  ].map(([x, y]) => new THREE.Vector2(x, y)), 18);

  const strawberry = (parent, x, y, z, sc) => {
    const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(sc); parent.add(g);
    mesh(g, strawberryGeo, berry);
    for (let row = 0; row < 3; row++) {
      const yy = -1.2 + row * 0.82, rr = [1.24, 1.72, 1.87][row];
      for (let k = 0; k < 12; k++) {
        const a = k / 12 * Math.PI * 2 + row * 0.24;
        mesh(g, seedGeo, gold, Math.cos(a) * rr, yy, Math.sin(a) * rr).scale.set(0.1, 0.17, 0.1);
      }
    }
    for (let k = 0; k < 5; k++) {
      const a = k / 5 * Math.PI * 2;
      const m = mesh(g, pipingGeo, leaf, Math.cos(a) * 0.6, 1.5, Math.sin(a) * 0.6);
      m.scale.set(1.15, 0.13, 0.38); m.rotation.y = -a;
    }
  };

  const cakes = [];
  for (const info of [section.ascent, section.descent]) {
    const chocolate = info.id === 'descent';
    const cake = new THREE.Group(); cake.name = `cake:${info.flavor}`;
    cake.position.set(info.center.x, 0, info.center.z); group.add(cake);
    const sponge = new THREE.MeshStandardMaterial({ map: spongeTexture(chocolate), roughness: 0.86 });
    const frosting = chocolate ? ganache : pink, filling = chocolate ? lavender : jam;
    const tiers = [];
    let bottom = FLOOR;
    for (let tier = 0; tier < 3; tier++) {
      const top = info.lowY + (info.topY - info.lowY) * (tier + 1) / 3 + (tier === 2 ? 2.0 : 0);
      // At the highest road point beside this tier, even a car at the soft
      // steering wall clears the icing. The road radius varies linearly in Y.
      const q = THREE.MathUtils.clamp((top - info.lowY) / (info.topY - info.lowY), 0, 1);
      const radius = THREE.MathUtils.lerp(info.outerRadius, info.innerRadius, q) - 9.8;
      const height = top - bottom;
      mesh(cake, new THREE.CylinderGeometry(radius, radius, height, 64), sponge, 0, bottom + height / 2, 0);
      for (const f of [0.32, 0.66]) {
        mesh(cake, new THREE.CylinderGeometry(radius + 0.035, radius + 0.035, 0.65, 64), filling, 0, bottom + height * f, 0);
        mesh(cake, new THREE.CylinderGeometry(radius + 0.055, radius + 0.055, 0.18, 64), cream, 0, bottom + height * f + 0.39, 0);
      }
      mesh(cake, new THREE.CylinderGeometry(radius + 0.32, radius + 0.32, 0.5, 64), frosting, 0, top, 0);
      mesh(cake, dripGeometry(radius + 0.34, top, tier * 1.4), frosting);
      // Piped cream rosettes follow the rim; modest tessellation, merged below.
      const count = Math.round(radius * 1.7);
      for (let k = 0; k < count; k++) {
        const a = k / count * Math.PI * 2;
        const x = Math.cos(a) * (radius - 0.6), z = Math.sin(a) * (radius - 0.6);
        mesh(cake, pipingGeo, cream, x, top + 0.4, z).scale.set(0.74, 0.56, 0.74);
      }
      tiers.push({ bottom, top, radius });
      bottom = top - 0.12;
    }
    const top = tiers[2].top, r = tiers[2].radius;
    // Fruit and a whipped-cream crown make the flavours legible from afar.
    for (let k = 0; k < 10; k++) {
      const a = k / 10 * Math.PI * 2, x = Math.cos(a) * (r - 3), z = Math.sin(a) * (r - 3);
      if (!chocolate) strawberry(cake, x, top + 1.6, z, 0.58);
      else {
        mesh(cake, sphere, lavender, x, top + 0.55, z).scale.set(1.5, 0.65, 1.5);
        mesh(cake, sphere, blueberry, x, top + 1.6, z).scale.setScalar(1.12);
        // The small calyx on each berry reads as blueberry, not a purple ball.
        for (let j = 0; j < 5; j++) {
          const b = j / 5 * Math.PI * 2;
          mesh(cake, seedGeo, ganache, x + Math.cos(b) * 0.23, top + 2.62, z + Math.sin(b) * 0.23).scale.set(0.17, 0.07, 0.17);
        }
      }
    }
    for (let k = 0; k < 4; k++) {
      const m = mesh(cake, sphere, chocolate ? lavender : cream, Math.sin(k * 1.1) * 0.5, top + 1 + k * 1.15, 0);
      m.scale.set(4.2 - k * 0.9, 1.3, 4.2 - k * 0.9);
    }
    if (!chocolate) strawberry(cake, 0, top + 7.8, 0, 1.6);
    else for (let k = 0; k < 3; k++) {
      mesh(cake, sphere, blueberry, (k - 1) * 2.3, top + 6.6 + (k === 1 ? 1.1 : 0), 0).scale.setScalar(2);
    }
    const sprinkleGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 5);
    for (let k = 0; k < 42; k++) {
      const a = k * 2.399963, d = 6 + (k % 7) * 1.03;
      const m = mesh(cake, sprinkleGeo, [gold, pink, chocolate ? lavender : leaf][k % 3], Math.cos(a) * d, top + 0.38, Math.sin(a) * d);
      m.rotation.set(Math.PI / 2, k * 1.4, 0);
    }
    mesh(cake, new THREE.CylinderGeometry(tiers[0].radius + 2.1, tiers[0].radius + 2.4, 0.55, 64), cream, 0, FLOOR + 0.12, 0);
    mergeByMaterial(cake);
    cakes.push({ ...info, tiers, group: cake });
  }

  // Wafer deck, underside and cream shoulders. The road/curb ribbon above it
  // is continuous with the rest of the course, including both bridge joints.
  const deck = (parent, s0, s1) => {
    const pos = [], uv = [], idx = [], n = Math.ceil((s1 - s0) / 1.25);
    const profile = [[-C.deckHalfWidth, -0.11], [C.deckHalfWidth, -0.11],
      [C.deckHalfWidth, -0.85], [-C.deckHalfWidth, -0.85]];
    for (let i = 0; i <= n; i++) {
      const s = THREE.MathUtils.lerp(s0, s1, i / n);
      for (const [lat, dy] of profile) {
        const p = track.getPose(s, lat).pos;
        pos.push(p.x, p.y + dy, p.z); uv.push(s / 5, (lat + C.deckHalfWidth) / 5 + dy);
      }
      if (i < n) for (let j = 0; j < 4; j++) {
        const a = i * 4 + j, b = i * 4 + (j + 1) % 4;
        idx.push(a, b, a + 4, b, b + 4, a + 4);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx); geo.computeVertexNormals();
    const m = mesh(parent, geo, wafer); m.name = 'cakeDeck'; m.castShadow = m.receiveShadow = true;
  };
  const postGeo = new THREE.CylinderGeometry(0.14, 0.18, 1.45, 6);
  const capGeo = new THREE.SphereGeometry(0.26, 7, 4);
  for (const [name, s0, s1, accent] of [
    ['ascentDeck', section.deckStart, section.bridge.s0, pink],
    ['cakeSkyBridge', section.bridge.s0, section.bridge.s1, gold],
    ['descentDeck', section.bridge.s1, section.deckEnd, lavender],
  ]) {
    const chunk = new THREE.Group(); chunk.name = name; group.add(chunk);
    deck(chunk, s0, s1);
    const rails = new THREE.Group(); rails.name = 'cakeGuardrails'; chunk.add(rails);
    for (const side of [-1, 1]) {
      const pts = [], n = Math.ceil((s1 - s0) / 2);
      for (let i = 0; i <= n; i++) {
        const p = track.getPose(THREE.MathUtils.lerp(s0, s1, i / n), side * C.railLateral).pos;
        pts.push(p.clone().addScaledVector(UP, 1.45));
      }
      for (const dy of [0, -0.7]) {
        const path = new THREE.CatmullRomCurve3(pts.map((p) => p.clone().addScaledVector(UP, dy)));
        mesh(rails, new THREE.TubeGeometry(path, n, 0.12, 5, false), cream);
      }
      const posts = Math.ceil((s1 - s0) / 4.5);
      for (let i = 0; i <= posts; i++) {
        const p = track.getPose(THREE.MathUtils.lerp(s0, s1, i / posts), side * C.railLateral).pos;
        mesh(rails, postGeo, cane, p.x, p.y + 0.65, p.z);
        mesh(rails, capGeo, accent, p.x, p.y + 1.5, p.z);
      }
    }
    mergeByMaterial(rails);
  }

  // Cantilever brackets tie each spiral to its cake instead of floating over
  // the meadow. They stop below the deck and cannot enter a lower turn.
  const supports = new THREE.Group(); supports.name = 'cakeSupports'; group.add(supports);
  for (const info of cakes) for (let s = info.s0 + 14; s < info.s1 - 8; s += 22) {
    const p = track.getPose(s).pos;
    if (p.y < FLOOR + 5) continue;
    const radial = p.clone().sub(info.center).setY(0).normalize();
    const a = p.clone().addScaledVector(radial, -10.2).addScaledVector(UP, -4.0);
    const b = p.clone().addScaledVector(radial, 6.6).addScaledVector(UP, -0.88);
    bar(supports, a, b, 0.36, cream);
  }
  // A real hanging bridge: both its deck and its candy cables dip. Every
  // hanger/under-deck rib uses the LOCAL road height, never the old summit
  // plane (which would send support rods straight through the dipped road).
  const bridge = section.bridge, cableLat = C.deckHalfWidth + 0.9;
  for (const side of [-1, 1]) {
    const cables = [], underside = [], n = 48;
    for (let i = 0; i <= n; i++) {
      const q = i / n, s = THREE.MathUtils.lerp(bridge.s0, bridge.s1, q);
      const p = track.getPose(s, side * cableLat).pos;
      const top = p.clone().addScaledVector(UP, 2.1 + 4.4 * (2 * q - 1) ** 2);
      cables.push(top);
      underside.push(track.getPose(s, side * 7.7).pos.addScaledVector(UP, -1.3));
      if (i % 3 === 0) bar(supports, p.clone().addScaledVector(UP, -0.95), top, 0.11, cream);
      if (i === 0 || i === n) {
        bar(supports, p.clone().addScaledVector(UP, -1.25), top.clone().addScaledVector(UP, 0.45), 0.4, cane);
        mesh(supports, capGeo, pink, top.x, top.y + 0.65, top.z).scale.setScalar(2.2);
      }
    }
    mesh(supports, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cables), n, 0.23, 6, false), gold);
    mesh(supports, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(underside), n, 0.38, 6, false), gold);
  }
  // Cross-bearers attach the wafer deck to the hanging side rods. They remain
  // underneath even at the lowest point, leaving the full driving lane free.
  for (let i = 0; i <= 16; i++) {
    const s = THREE.MathUtils.lerp(bridge.s0, bridge.s1, i / 16);
    const a = track.getPose(s, -cableLat).pos.addScaledVector(UP, -0.95);
    const b = track.getPose(s, cableLat).pos.addScaledVector(UP, -0.95);
    bar(supports, a, b, 0.22, cream);
  }
  mergeByMaterial(supports);

  // Reserve the cake footprints AND the whole elevated corridor. Otherwise
  // ordinary roadside props get planted in the sponge or hover by the bridge.
  const bridgeA = track.getPose(section.bridge.s0).pos, bridgeB = track.getPose(section.bridge.s1).pos;
  const vx = bridgeB.x - bridgeA.x, vz = bridgeB.z - bridgeA.z, vv = vx * vx + vz * vz;
  function blocks(x, z) {
    for (const cake of cakes) if (Math.hypot(x - cake.center.x, z - cake.center.z) < cake.outerRadius + 48) return true;
    const t = THREE.MathUtils.clamp(((x - bridgeA.x) * vx + (z - bridgeA.z) * vz) / vv, 0, 1);
    return Math.hypot(x - bridgeA.x - t * vx, z - bridgeA.z - t * vz) < 30;
  }
  return { group, cakes, section, blocks };
}
