// Off-road sugar dust — the visual half of the off-road speed penalty.
//
// The physics side already exists: past the curb the car slows to 0.55× and the
// body starts to rumble (main.js passes `offRoad` into car.update). Nothing was
// actually kicked up, so the penalty felt like an invisible hand. Two wheels on
// the meadow now throw short-lived sugar puffs from behind the rear axle.
//
// Cost: one instanced draw (BillboardBatch) and a fixed pool — no allocation
// per frame, nothing new to compile after the first puff.
import * as THREE from 'three';
import { TUNING } from './config.js';
import { BillboardBatch } from './billboards.js';

// soft round puff: white core, pink falloff, fully transparent rim
function puffTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grd.addColorStop(0, 'rgba(255,252,248,0.95)');
  grd.addColorStop(0.45, 'rgba(255,225,240,0.5)');
  grd.addColorStop(1, 'rgba(255,205,235,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const COLORS = ['#fff4ef', '#ffe3d2', '#ffe0ee', '#fff7e6'];

export function createDust(scene, track, count = 64) {
  // normal (alpha) blending: dust blocks light, it does not emit it — on the
  // bright pastel world an additive puff is invisible
  const batch = new BillboardBatch(scene, puffTexture(), count, 'carDust', { blending: 'normal' });
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      pos: new THREE.Vector3(), vel: new THREE.Vector3(),
      color: new THREE.Color(COLORS[0]), life: 0, maxLife: 1, size: 0.5, spin: 0,
    });
  }
  let cursor = 0, acc = 0, live = false;
  const fwd = new THREE.Vector3();
  const spawnAt = new THREE.Vector3();

  return {
    /**
     * @param {number} dt
     * @param {THREE.Object3D} carRoot  the car's world transform
     * @param {number} speed            m/s
     * @param {boolean} offRoad         is the car past the curb?
     * @param {number} lateral          signed offset from the centre line
     * @param {number} s                distance along the track
     */
    update(dt, carRoot, speed, offRoad, lateral = 0, s = 0) {
      const fast = Math.min(1, speed / TUNING.maxSpeed);
      // how many puffs to spend this frame: nothing on the tarmac, a thin scuff
      // at walking pace, a proper rooster tail at full speed
      acc += dt * (offRoad ? 20 + 64 * fast : 0);
      while (acc >= 1) {
        acc -= 1;
        const it = items[cursor];
        cursor = (cursor + 1) % items.length;
        // behind the rear axle, thrown slightly to the side it left the road on
        const side = lateral >= 0 ? 1 : -1;
        const pose = track.getPose(s - 1.35, lateral + side * 0.4);
        carRoot.getWorldDirection(fwd);
        spawnAt.copy(pose.pos);
        spawnAt.x += (Math.random() - 0.5) * 0.5;
        spawnAt.z += (Math.random() - 0.5) * 0.5;
        spawnAt.y += 0.14 + Math.random() * 0.18;
        it.pos.copy(spawnAt);
        it.maxLife = it.life = 0.6 + Math.random() * 0.5;
        it.size = 0.62 + Math.random() * 0.42;
        it.spin = (Math.random() - 0.5) * 1.6;
        it.color.set(COLORS[(Math.random() * COLORS.length) | 0]);
        it.vel.set(
          -fwd.x * speed * (0.16 + Math.random() * 0.1) + side * (0.5 + Math.random() * 0.9),
          1.0 + Math.random() * 1.0,
          -fwd.z * speed * (0.16 + Math.random() * 0.1) + (Math.random() - 0.5) * 0.7
        );
      }

      let any = false;
      items.forEach((it, i) => {
        if (it.life <= 0) return;
        any = true;
        it.life -= dt;
        if (it.life <= 0) { batch.hide(i); return; }
        it.pos.addScaledVector(it.vel, dt);
        it.vel.multiplyScalar(1 - dt * 1.5); // sugar dust has no inertia
        it.vel.y += dt * 0.5;                // …and keeps drifting up a little
        const k = it.life / it.maxLife;      // 1 → 0
        const grow = 1 + (1 - k) * 0.85;     // puffs swell as they fade
        batch.set(i, it.pos, it.size * grow, it.color, 0.62 * k * (0.5 + 0.5 * fast));
      });
      if (any || live) batch.commit();
      live = any;
    },
    reset() {
      items.forEach((it, i) => { it.life = 0; batch.hide(i); });
      acc = 0;
      batch.commit();
    },
    // QA: how many puffs are alive right now
    count() { return items.reduce((n, it) => n + (it.life > 0 ? 1 : 0), 0); },
  };
}
