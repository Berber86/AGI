import Phaser from 'phaser';
import { CFG, LANE_WORLD_WIDTH, PALETTES, PLAYER_Z, type Theme } from '../sim/config';
import type { RaceState } from '../sim/race';
import type { Track } from '../sim/track';
import { buildTextures, buildThemeTextures, VERGE_PROPS, WALL_PROPS } from '../game/textures';
import { recordPhase } from '../game/bridge';

export const VIEW = { w: 1600, h: 800 } as const;

const HORIZON = CFG.horizonY;
const FOCAL = CFG.focalPx;
const SEG = CFG.segmentLength;
const ROAD_HALF = CFG.roadHalfWidth;
const KERB = CFG.kerbWidth;
const WALL_X = ROAD_HALF + KERB + 300;
const WALL_TOP = CFG.wallHeight;
const DRAW = CFG.drawSegments;
/** Colour swap of the kerb stripe, in world units. */
const KERB_STRIPE = 300;
/** Candy wall blocks are short, so the wall reads as a striped fence. */
const WALL_GROUP = 3;
/** The candy fence is only drawn from this distance on: up close it would sweep
 * across the whole screen and hide the road. */
const WALL_MIN_Z = 620;
const CAR_BASE_Y: number = CFG.carBaseY;
const HOP_MS = CFG.hopMs;
const KERB_COLORS = [0xff5f9e, 0xfffdf5, 0xffc93c, 0xfffdf5, 0x4fb0e8, 0xfffdf5, 0x5fd39a, 0xfffdf5];
/** Sprinkles scattered on the tarmac, only a couple of pixels each. */
const SPRINKLE_COLORS = [0xffffff, 0xffd166, 0xff9ec4, 0x8fd0f5, 0xb388ff];

interface Sample {
  z: number;
  x: number;
}

interface SpriteOptions {
  worldWidth: number;
  lift?: number;
  originY?: number;
  rotation?: number;
  alpha?: number;
}

/**
 * Chase-camera pseudo-3D view of the candy road: the same deterministic race
 * state, drawn from behind the hero car with a classic arcade road projection.
 */
export class Road3D {
  private scene: Phaser.Scene;
  private theme: Theme = 'candy';
  private track!: Track;

  private sky!: Phaser.GameObjects.Image;
  private sun!: Phaser.GameObjects.Image;
  private clouds: Phaser.GameObjects.Image[] = [];
  private hillsBand!: Phaser.GameObjects.Image;
  private mountains!: Phaser.GameObjects.Image;
  private ferris!: Phaser.GameObjects.Image;
  private coaster!: Phaser.GameObjects.Image;
  private castle!: Phaser.GameObjects.Image;

  private fog!: Phaser.GameObjects.Image;
  private sheen!: Phaser.GameObjects.Image;
  private ground: Phaser.GameObjects.Graphics;
  private road: Phaser.GameObjects.Graphics;
  private walls: Phaser.GameObjects.Graphics;
  private heroShadow: Phaser.GameObjects.Ellipse;
  private hero: Phaser.GameObjects.Image;
  private gantry: Phaser.GameObjects.Image | null = null;

  private pools = new Map<string, Phaser.GameObjects.Image[]>();
  private used = new Map<string, number>();

  private samples: Sample[] = [];
  private camX = 0;
  private pWorld = 0;
  private parallaxX = 0;
  private shakeY = 0;
  private frameCount = 0;

  private gantryLit = -1;
  private heroKey = 'hero-rear-rose';

  heroScreen = { x: VIEW.w / 2, y: CAR_BASE_Y, scale: 1 };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    buildTextures(scene);
    this.createBackground();
    this.ground = scene.add.graphics().setDepth(6);
    this.road = scene.add.graphics().setDepth(7);
    this.walls = scene.add.graphics().setDepth(8);
    this.heroShadow = scene.add
      .ellipse(VIEW.w / 2, CAR_BASE_Y + 16, 420, 90, 0x3d2b1f, 0.2)
      .setDepth(9000);
    this.hero = scene.add.image(VIEW.w / 2, CAR_BASE_Y, 'hero-rear-rose-star-star').setOrigin(0.5, 1).setDepth(9001);
    // Atmosphere: a haze band on the horizon, a sheen sliding over the tarmac and
    // a vignette on top of the whole picture.
    this.fog = scene.add
      .image(VIEW.w / 2, HORIZON + 34, 'fog')
      .setOrigin(0.5, 1)
      .setDisplaySize(VIEW.w * 1.1, 130)
      .setDepth(2000)
      .setAlpha(0.3);
    this.sheen = scene.add
      .image(VIEW.w / 2, 640, 'road-sheen')
      .setOrigin(0.5, 0.5)
      .setDisplaySize(1500, 520)
      .setDepth(3)
      .setAlpha(0.3);
    scene.add
      .image(0, 0, 'vignette')
      .setOrigin(0, 0)
      .setDisplaySize(VIEW.w, VIEW.h)
      .setDepth(99989);
  }

  setTheme(theme: Theme, track: Track): void {
    buildThemeTextures(this.scene, theme);
    this.theme = theme;
    this.sky.setTexture(`sky-${theme}`).setDisplaySize(VIEW.w, VIEW.h);
    this.mountains.setTexture(`mountains-${theme}`);
    this.hillsBand.setTexture(`hills-band-${theme}`);
    this.ferris.setTexture(`ferris-${theme}`);
    this.coaster.setTexture(`coaster-${theme}`);
    this.castle.setTexture(`castle-${theme}`);
    this.track = track;
  }

  setHeroCar(key: string): void {
    this.heroKey = key;
    this.hero.setTexture(key);
  }

  setGantry(lit: number): void {
    this.gantryLit = lit;
  }

  // ---------------------------------------------------------------- helpers

  private createBackground(): void {
    const scene = this.scene;
    this.sky = scene.add.image(0, 0, 'sky-candy').setOrigin(0, 0).setDepth(0).setDisplaySize(VIEW.w, VIEW.h);
    this.sun = scene.add.image(1330, 150, 'sun').setDepth(1).setScale(0.9);
    this.clouds = [
      scene.add.image(260, 120, 'cloud').setDepth(1).setScale(0.8).setAlpha(0.95),
      scene.add.image(760, 70, 'cloud').setDepth(1).setScale(0.55).setAlpha(0.9),
      scene.add.image(1180, 210, 'cloud').setDepth(1).setScale(0.45).setAlpha(0.8),
      scene.add.image(1500, 90, 'cloud').setDepth(1).setScale(0.6).setAlpha(0.85),
    ];
    this.mountains = scene.add.image(800, HORIZON + 10, 'mountains-candy').setOrigin(0.5, 1).setDepth(2).setScale(0.6);
    this.hillsBand = scene.add
      .image(800, HORIZON + 36, 'hills-band-candy')
      .setOrigin(0.5, 1)
      .setDepth(3)
      .setScale(0.6);
    this.ferris = scene.add.image(470, HORIZON + 30, 'ferris-candy').setOrigin(0.5, 1).setDepth(4).setScale(0.6);
    this.coaster = scene.add.image(1230, HORIZON + 20, 'coaster-candy').setOrigin(0.5, 1).setDepth(4).setScale(0.62);
    this.castle = scene.add.image(830, HORIZON + 30, 'castle-candy').setOrigin(0.5, 1).setDepth(4).setScale(0.34);
  }

  private scaleAt(z: number): number {
    return FOCAL / Math.max(z, 60);
  }

  private screenX(relX: number, z: number): number {
    return VIEW.w / 2 + relX * this.scaleAt(z);
  }

  private groundY(z: number): number {
    return HORIZON + CFG.cameraHeight * this.scaleAt(z) + this.shakeY;
  }

  /** Road centre offset at an arbitrary distance ahead of the camera. */
  private roadXAt(z: number): number {
    const samples = this.samples;
    if (!samples.length) return 0;
    if (z <= samples[0].z) return samples[0].x;
    for (let i = 1; i < samples.length; i += 1) {
      if (samples[i].z >= z) {
        const a = samples[i - 1];
        const b = samples[i];
        const t = b.z === a.z ? 0 : (z - a.z) / (b.z - a.z);
        return Phaser.Math.Linear(a.x, b.x, t);
      }
    }
    return samples[samples.length - 1].x;
  }

  private acquire(key: string): Phaser.GameObjects.Image {
    let pool = this.pools.get(key);
    if (!pool) {
      pool = [];
      this.pools.set(key, pool);
    }
    const index = this.used.get(key) ?? 0;
    this.used.set(key, index + 1);
    let image = pool[index];
    if (!image) {
      image = this.scene.add.image(0, 0, key).setOrigin(0.5, 1);
      pool.push(image);
    }
    image.setVisible(true);
    image.setAlpha(1);
    image.setRotation(0);
    image.clearTint();
    return image;
  }

  private place(key: string, worldX: number, worldZ: number, options: SpriteOptions): Phaser.GameObjects.Image {
    const image = this.acquire(key);
    const scale = this.scaleAt(worldZ);
    const width = options.worldWidth * scale;
    const frame = image.frame;
    const aspect = frame && frame.width > 0 ? frame.height / frame.width : 1;
    image.setOrigin(0.5, options.originY ?? 1);
    image.setDisplaySize(width, width * aspect);
    image.setPosition(
      this.screenX(worldX - this.camX, worldZ),
      this.groundY(worldZ) - (options.lift ?? 0) * scale,
    );
    image.setDepth(10000 - worldZ * 0.1);
    if (options.rotation) image.setRotation(options.rotation);
    if (options.alpha !== undefined) image.setAlpha(options.alpha);
    return image;
  }

  private releaseUnused(): void {
    for (const [key, pool] of this.pools) {
      const usedCount = this.used.get(key) ?? 0;
      for (let i = usedCount; i < pool.length; i += 1) {
        pool[i].setVisible(false);
      }
      this.used.set(key, 0);
    }
  }

  // ------------------------------------------------------------------ render

  render(state: RaceState, dtMs: number, extra: { boosting: boolean; curve: number }): void {
    const startedAt = typeof performance !== 'undefined' ? performance.now() : 0;
    const playerWorldX = (state.lateral - 1) * LANE_WORLD_WIDTH;
    this.camX = playerWorldX * CFG.cameraFollow;
    this.pWorld = state.progress * CFG.worldPerSim;
    this.frameCount += 1;

    // Background parallax follows the curvature of the road ahead.
    this.parallaxX += -extra.curve * state.speed * (dtMs / 1000) * 0.85;
    this.parallaxX = Phaser.Math.Wrap(this.parallaxX, -900, 900);

    const bob = state.hopMs > 0 ? Math.sin((1 - state.hopMs / HOP_MS) * Math.PI) : 0;
    const targetShake = bob * -16 + (extra.boosting ? (this.frameCount % 2 === 0 ? -4 : 2) : 0);
    this.shakeY = Phaser.Math.Linear(this.shakeY, targetShake, 0.3);

    this.sky.setX(this.parallaxX * 0.04);
    this.sun.setX(1330 + this.parallaxX * 0.1);
    const cloudBase = [260, 760, 1180, 1500];
    this.clouds.forEach((cloud, index) => {
      cloud.setX(cloudBase[index] + this.parallaxX * (0.12 + index * 0.02));
    });
    // The sheen glides down the tarmac with the road, fading with speed.
    const sheenPhase = ((this.pWorld * 0.06) % 320) / 320;
    this.sheen.setY(420 + sheenPhase * 900);
    this.sheen.setAlpha(0.1 + sheenPhase * 0.16);
    this.fog.setAlpha(0.26 + Math.sin(this.frameCount / 90) * 0.04);
    this.mountains.setX(800 + this.parallaxX * 0.22);
    this.hillsBand.setX(800 + this.parallaxX * 0.55);
    this.ferris.setX(230 + this.parallaxX * 0.45);
    this.coaster.setX(1290 + this.parallaxX * 0.45);
    this.castle.setX(840 + this.parallaxX * 0.4);

    this.used.clear();
    this.drawGroundAndRoad(state);
    this.drawWorldSprites(state);
    this.drawHero(state, bob, extra.boosting);
    this.releaseUnused();
    this.drawGantry();
    if (startedAt) recordPhase('renderMs', (typeof performance !== 'undefined' ? performance.now() : 0) - startedAt);
  }

  private drawGroundAndRoad(state: RaceState): void {
    const palette = PALETTES[this.theme];
    const curve = this.track.curve;
    const total = this.track.segmentsPerLap;
    const pWorld = this.pWorld;

    // Verge: one flat wash below the horizon, with a lighter haze line.
    this.ground.clear();
    this.ground.fillStyle(palette.ground, 1);
    this.ground.fillRect(0, HORIZON - 4, VIEW.w, VIEW.h - HORIZON + 8);
    this.ground.fillStyle(palette.groundAlt, 0.5);
    this.ground.fillRect(0, HORIZON - 4, VIEW.w, 22);

    // Centreline samples: one pair of points per segment boundary. Keeping them
    // around lets props and the mini-map agree with the drawn road.
    const samples: Sample[] = [];
    const baseSegF = pWorld / SEG;
    const baseSeg = Math.floor(baseSegF);
    const baseOffset = (baseSegF - baseSeg) * SEG;
    let x = 0;
    let dx = -(curve[(((baseSeg % total) + total) % total)] * (baseOffset / SEG));
    for (let i = 0; i < DRAW; i += 1) {
      const ci = curve[(((baseSeg + i) % total) + total) % total];
      const zNear = i * SEG - baseOffset;
      const zFar = zNear + SEG;
      const xNear = x;
      x += dx;
      dx += ci;
      if (zFar < 80) continue;
      const clamped = Math.max(zNear, 80);
      const t = zFar === zNear ? 1 : (clamped - zNear) / (zFar - zNear);
      samples.push({ z: clamped, x: Phaser.Math.Linear(xNear, x, t) });
      samples.push({ z: zFar, x });
    }
    this.samples = samples;
    if (!samples.length) return;

    const px = (worldX: number, z: number) => this.screenX(worldX - this.camX, z);
    const py = (z: number) => this.groundY(z);
    /** Fills the band between two lateral offsets of the road at two depths. */
    const quad = (
      g: Phaser.GameObjects.Graphics,
      zNear: number,
      xNear: number,
      zFar: number,
      xFar: number,
      edgeA: number,
      edgeB: number,
    ) => {
      g.fillPoints(
        [
          { x: px(xNear + edgeA, zNear), y: py(zNear) },
          { x: px(xFar + edgeA, zFar), y: py(zFar) },
          { x: px(xFar + edgeB, zFar), y: py(zFar) },
          { x: px(xNear + edgeB, zNear), y: py(zNear) },
        ],
        true,
        true,
      );
    };

    this.road.clear();

    // The tarmac and its kerbs are drawn as depth slices: the slice length grows
    // with distance, and slices are cut at every kerb stripe so the rainbow
    // stripes stay crisp right next to the camera.
    let z = 80;
    const maxZ = DRAW * SEG;
    while (z < maxZ) {
      let zNext = Math.min(maxZ, z + Math.max(70, z * 0.24));
      const boundary = (Math.floor(z / KERB_STRIPE) + 1) * KERB_STRIPE;
      if (boundary < zNext) zNext = boundary;
      const xNear = this.roadXAt(z);
      // Overlap the neighbour by a hair so no seam shows between slices.
      const zOverlap = Math.min(maxZ, zNext * 1.02);
      const xFar = this.roadXAt(zOverlap);

      this.road.fillStyle(palette.road, 1);
      quad(this.road, z, xNear, zOverlap, xFar, -ROAD_HALF, ROAD_HALF);

      const stripe = Math.floor((pWorld + z) / KERB_STRIPE) % KERB_COLORS.length;
      this.road.fillStyle(KERB_COLORS[(stripe + KERB_COLORS.length) % KERB_COLORS.length], 1);
      for (const side of [-1, 1] as const) {
        quad(this.road, z, xNear, zOverlap, xFar, side * ROAD_HALF, side * (ROAD_HALF + KERB));
      }

      // Candy sprinkles on the tarmac.
      if (z > 520 && z < 6000) {
        const cell = Math.floor((pWorld + z) / 300);
        const hash = ((cell * 2654435761) >>> 0) % 1000;
        if (hash > 520) {
          const lateral = ((hash % 200) / 100 - 1) * (ROAD_HALF - 200);
          const scale = this.scaleAt(z);
          const size = Math.max(2.5, 30 * scale);
          this.road.fillStyle(SPRINKLE_COLORS[hash % SPRINKLE_COLORS.length], 0.8);
          this.road.fillRect(
            this.screenX(xNear + lateral - this.camX, z) - size * 0.5,
            py(z) - size * 0.5,
            size * 1.8,
            size * 0.7,
          );
        }
      }
      z = zNext;
    }

    // Dashed centre line.
    for (let i = 0; i + 1 < samples.length; i += 2) {
      const a = samples[i];
      const b = samples[i + 1];
      if (a.z < 620) continue;
      const segIndex = Math.floor((a.z + pWorld) / SEG);
      if (segIndex % 3 > 0) continue;
      this.road.fillStyle(0xfffdf5, 0.9);
      quad(this.road, a.z, a.x, b.z, b.x, -42, 42);
    }

    // Start / finish checker band, once per lap.
    const lapWorld = this.track.lapWorldLength;
    for (let i = 0; i + 1 < samples.length; i += 2) {
      const a = samples[i];
      const b = samples[i + 1];
      const zAbs = a.z + pWorld;
      if (Math.floor(zAbs / lapWorld) === Math.floor((zAbs - SEG) / lapWorld)) continue;
      const cells = 8;
      for (let c = 0; c < cells; c += 1) {
        const x0 = -ROAD_HALF + (2 * ROAD_HALF * c) / cells;
        const x1 = -ROAD_HALF + (2 * ROAD_HALF * (c + 1)) / cells;
        this.road.fillStyle(c % 2 === 0 ? 0xffffff : 0x4a4658, 0.95);
        quad(this.road, a.z, a.x, b.z, b.x, x0, x1);
      }
    }

    // Candy walls: white base shape, short coloured blocks, white cap on top.
    this.walls.clear();
    const wallMargin = VIEW.w * 1.25;
    for (const side of [-1, 1] as const) {
      const base: { x: number; y: number }[] = [];
      const top: { x: number; y: number }[] = [];
      samples.forEach((sample) => {
        if (sample.z < WALL_MIN_Z) return;
        const wx = sample.x + side * WALL_X;
        const screenX = px(wx, sample.z);
        if (screenX < -wallMargin || screenX > VIEW.w + wallMargin) return;
        base.push({ x: screenX, y: py(sample.z) });
        top.push({ x: screenX, y: py(sample.z) - WALL_TOP * this.scaleAt(sample.z) });
      });
      if (base.length < 2) continue;
      this.walls.fillStyle(0xfff6fb, 1);
      this.walls.fillPoints([...base, ...top.slice().reverse()], true, true);

      for (let i = 0; i + 1 < samples.length; i += 2) {
        const a = samples[i];
        const b = samples[i + 1];
        if (a.z < WALL_MIN_Z) continue;
        const screenA = px(a.x + side * WALL_X, a.z);
        const screenB = px(b.x + side * WALL_X, b.z);
        if (screenA < -wallMargin || screenA > VIEW.w + wallMargin) continue;
        if (screenB < -wallMargin || screenB > VIEW.w + wallMargin) continue;
        const groupIndex = Math.floor((a.z + pWorld) / (WALL_GROUP * SEG));
        const color = palette.wall[((groupIndex % palette.wall.length) + palette.wall.length) % palette.wall.length];
        const topA = py(a.z) - WALL_TOP * this.scaleAt(a.z);
        const topB = py(b.z) - WALL_TOP * this.scaleAt(b.z);
        this.walls.fillStyle(color, 1);
        this.walls.fillPoints(
          [
            { x: screenA, y: py(a.z) },
            { x: screenB, y: py(b.z) },
            { x: screenB, y: topB },
            { x: screenA, y: topA },
          ],
          true,
          true,
        );
        // A darker lip at the foot of each block gives the fence depth.
        this.walls.fillStyle(0x8f7f9a, 0.18);
        this.walls.fillPoints(
          [
            { x: screenA, y: py(a.z) },
            { x: screenB, y: py(b.z) },
            { x: screenB, y: py(b.z) - WALL_TOP * this.scaleAt(b.z) * 0.28 },
            { x: screenA, y: py(a.z) - WALL_TOP * this.scaleAt(a.z) * 0.28 },
          ],
          true,
          true,
        );
        // Candy post every few blocks, with a gumdrop on the top.
        if (groupIndex % 3 === 0 && a.z > WALL_MIN_Z) {
          const postWidth = 18 * this.scaleAt(a.z);
          const postTop = topA - 26 * this.scaleAt(a.z);
          this.walls.fillStyle(0xfffdf8, 0.95);
          this.walls.fillRect(screenA - postWidth * 0.5, postTop, postWidth, py(a.z) - postTop);
          this.walls.fillStyle(0xfffdf8, 1);
          circlePath(this.walls, screenA, postTop, postWidth * 1.5);
          this.walls.fillPath();
        }
      }

      // White cap along the wall top.
      this.walls.lineStyle(6, 0xffffff, 0.9);
      this.walls.beginPath();
      this.walls.moveTo(top[0].x, top[0].y);
      for (const point of top) this.walls.lineTo(point.x, point.y);
      this.walls.strokePath();
    }
    void state;
  }

  private drawWorldSprites(state: RaceState): void {
    const toWorldX = (lateral: number) => (lateral - 1) * LANE_WORLD_WIDTH;
    const zOf = (progress: number) => (progress - state.progress) * CFG.worldPerSim + PLAYER_Z;

    for (const rival of state.rivals) {
      const z = zOf(rival.progress);
      if (z < 300 || z > DRAW * SEG) continue;
      const wave = rival.waveTimerMs > 0 ? Math.sin(this.frameCount / 5) * 0.07 : 0;
      this.place(`rival-rear-${rival.id % 3}`, toWorldX(rival.lateral), z, {
        worldWidth: CFG.rivalWorldWidth,
        rotation: wave,
      });
    }

    for (const balloon of state.balloons) {
      if (balloon.taken) continue;
      const z = zOf(balloon.progress);
      if (z < 240 || z > DRAW * SEG) continue;
      this.place('balloon-heart', toWorldX(balloon.lateral), z, {
        worldWidth: 430,
        lift: 250 * balloon.hover + Math.sin(this.frameCount / 18 + balloon.id) * 26,
      });
    }

    for (const obstacle of state.obstacles) {
      if (obstacle.used) continue;
      const z = zOf(obstacle.progress);
      if (z < 220 || z > DRAW * SEG) continue;
      this.place(obstacle.kind === 'puddle' ? 'puddle' : 'mound', toWorldX(obstacle.lateral), z, {
        worldWidth: obstacle.kind === 'puddle' ? 900 : 780,
        alpha: 0.95,
      });
    }

    // Verge candy and wall-top gumdrops.
    const total = this.track.segmentsPerLap;
    const baseSegF = this.pWorld / SEG;
    const baseSeg = Math.floor(baseSegF);
    const baseOffset = (baseSegF - baseSeg) * SEG;
    // Tidy rows of the candy kingdom. Their regular rhythm is what makes the
    // verge read as a park rather than an empty field.
    for (let i = 1; i < DRAW; i += 2) {
      const segIndex = (((baseSeg + i) % total) + total) % total;
      const z = i * SEG - baseOffset + SEG * 0.5;
      if (z < 700 || z > 7000) continue;
      const x = this.roadXAt(z);
      const side: -1 | 1 = segIndex % 2 === 0 ? -1 : 1;
      // Bright topiary row, close to the fence.
      if (i % 4 === 1) {
        const key = ['candytree-pink', 'candytree-mint', 'candytree-lilac'][(segIndex / 2) % 3 | 0];
        const size = 420 + ((segIndex * 41) % 160);
        this.place(key, x + side * (WALL_X + 420 + ((segIndex * 17) % 200)), z, { worldWidth: size });
        this.place(['gumdrop-pink', 'gumdrop-mint', 'gumdrop-sun', 'gumdrop-sky'][segIndex % 4], x - side * (WALL_X + 260), z + SEG * 0.5, {
          worldWidth: 220,
        });
      }
      // Second row, further out, a touch smaller so the depth reads.
      if (i % 6 === 3) {
        const key = ['candytree-mint', 'candytree-lilac', 'candytree-pink'][(segIndex / 3) % 3 | 0];
        this.place(key, x - side * (WALL_X + 1500 + ((segIndex * 23) % 500)), z, { worldWidth: 520, alpha: 0.95 });
        this.place(['lollipop', 'candycane'][segIndex % 2], x + side * (WALL_X + 1200 + ((segIndex * 31) % 400)), z + SEG, {
          worldWidth: 320,
        });
      }
    }

    for (let i = 2; i < DRAW; i += 2) {
      const segIndex = (((baseSeg + i) % total) + total) % total;
      const z = i * SEG - baseOffset + SEG * 0.5;
      if (z < 240) continue;
      // Beyond this the props would pile up into one colourful smear at the
      // vanishing point, so the kingdom is built only in the middle distance.
      if (z > 5200) continue;
      const x = this.roadXAt(z);

      // Lumps of grass right beside the fence: this is what the child sees when
      // she leans out to the shoulder, so it must never be flat green.
      if (i % 2 === 0) {
        const side = segIndex % 2 === 0 ? -1 : 1;
        const tuftZ = z + SEG * 0.3;
        if (tuftZ < 4200) {
          this.place('grass-tuft', x + side * (WALL_X + 180 + ((segIndex * 29) % 380)), tuftZ, {
            worldWidth: 260,
            alpha: 0.95,
          });
        }
      }

      // Candy kingdom along the road: houses, lollipop trees and canes on both
      // sides. Big props are kept away from the camera, so nothing explodes into
      // a giant close-up at the bottom of the screen.
      if (i % 3 === 0) {
        const side = segIndex % 2 === 0 ? -1 : 1;
        const prop = VERGE_PROPS[(segIndex * 7) % VERGE_PROPS.length];
        const width = propWidth(prop);
        const minZ = width > 700 ? 2200 : 300;
        if (z > minZ) {
          const near = 200 + ((segIndex * 37) % 520);
          this.place(prop, x + side * (WALL_X + near), z, { worldWidth: width });
        }
        if (segIndex % 6 === 0) {
          const other = VERGE_PROPS[(segIndex * 11 + 5) % VERGE_PROPS.length];
          const otherWidth = propWidth(other);
          const otherZ = z + SEG * 0.6;
          if (otherZ > (otherWidth > 700 ? 2400 : 320)) {
            this.place(other, x - side * (WALL_X + 380 + ((segIndex * 53) % 760)), otherZ, {
              worldWidth: otherWidth,
            });
          }
        }
      }

      if (i % 6 === 0) {
        const drop = WALL_PROPS[(segIndex * 3) % WALL_PROPS.length];
        this.place(drop, x - WALL_X - 4, z, { worldWidth: 190, lift: WALL_TOP });
        this.place(WALL_PROPS[(segIndex * 5 + 2) % WALL_PROPS.length], x + WALL_X + 4, z + SEG, {
          worldWidth: 190,
          lift: WALL_TOP,
        });
      }

      if (i % 4 === 0) {
        this.place(`confetti-${segIndex % 5}`, x + ((segIndex * 53) % 1800) - 900, z, {
          worldWidth: 120,
          originY: 0.5,
          alpha: 0.95,
        });
      }

      // Bunting strung across the road, but only in the distance: up close the
      // rope would cut straight across the picture.
      if (i % 16 === 8 && z > 2600) {
        const lift = 420 + (z - 2600) * 0.06;
        this.place('bunting', x, z, { worldWidth: 2400, lift, alpha: 0.9 });
      }


    }
  }

  private drawHero(state: RaceState, bob: number, boosting: boolean): void {
    const playerWorldX = (state.lateral - 1) * LANE_WORLD_WIDTH;
    const heroScale = this.scaleAt(PLAYER_Z);
    const heroWidth = CFG.carWorldWidth * heroScale;
    const frame = this.hero.frame;
    const aspect = frame && frame.width > 0 ? frame.height / frame.width : 0.55;
    const hopLift = bob * 48;

    if (this.hero.texture.key !== this.heroKey) this.hero.setTexture(this.heroKey);
    this.hero.setDisplaySize(heroWidth, heroWidth * aspect);
    this.hero.setPosition(this.screenX(playerWorldX - this.camX, PLAYER_Z), CAR_BASE_Y + this.shakeY - hopLift);
    this.hero.setRotation(Phaser.Math.Clamp(-state.steerVel * 0.09, -0.2, 0.2));
    this.hero.setDepth(9001);
    this.heroScreen = { x: this.hero.x, y: this.hero.y, scale: heroScale };

    this.heroShadow.setPosition(this.hero.x, CAR_BASE_Y + 14 + this.shakeY);
    this.heroShadow.setDisplaySize(heroWidth * 0.92, heroWidth * 0.19);
    this.heroShadow.setAlpha(state.onGrass ? 0.3 : 0.2);

    if (boosting) {
      for (let i = 0; i < 7; i += 1) {
        const spark = this.acquire(`sparkle-${i % 5}`);
        const progress = ((this.frameCount * (6 + i * 2)) % 260) / 260;
        spark.setOrigin(0.5, 0.5);
        spark.setPosition(
          this.hero.x + (i % 2 === 0 ? -1 : 1) * (70 + i * 16 + progress * 120),
          CAR_BASE_Y + 6 + progress * 150,
        );
        const size = 70 * (1 - progress) + 12;
        spark.setDisplaySize(size, size);
        spark.setAlpha(0.8 * (1 - progress));
        spark.setDepth(9002);
      }
    }
  }

  private drawGantry(): void {
    if (this.gantryLit < 0) {
      this.gantry?.setVisible(false);
      return;
    }
    const key = `gantry-${Math.min(3, this.gantryLit)}`;
    if (!this.gantry) {
      this.gantry = this.scene.add.image(0, 0, key).setOrigin(0.5, 1).setDepth(9999);
    }
    const image = this.gantry;
    if (image.texture.key !== key) image.setTexture(key);
    const z = PLAYER_Z + 2700;
    const width = 2400 * this.scaleAt(z);
    const frame = image.frame;
    const aspect = frame && frame.width > 0 ? frame.height / frame.width : 1;
    image.setVisible(true);
    image.setDisplaySize(width, width * aspect);
    image.setPosition(this.screenX(-this.camX, z), this.groundY(z) + 8);
  }
}

/** World-space width of a verge prop, so nothing looks glued to the road. */
function propWidth(key: string): number {
  if (key === 'lollipop') return 340;
  if (key === 'candycane') return 280;
  if (key.startsWith('candyhouse')) return 900;
  if (key.startsWith('candytree')) return 460;
  return 320;
}

/** Adds a circle to a Graphics path (Phaser has no path-mode circle fill). */
function circlePath(g: Phaser.GameObjects.Graphics, x: number, y: number, r: number): void {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2, false);
  g.closePath();
}
