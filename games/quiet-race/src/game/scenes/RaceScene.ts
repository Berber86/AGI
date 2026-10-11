import Phaser from 'phaser';
import { CFG, THEMES, type Theme } from '../../sim/config';
import { createRace, stepRace, type Obstacle, type RaceEvent, type RaceState, type Rival } from '../../sim/race';
import { COLORS, PLAYER_SCREEN_Y, ROAD, UI, VIEW, laneX, screenY } from '../layout';
import { audio } from '../audio';
import { bridge, recordFrame } from '../bridge';
import { buildTextures, decorationKeysFor, heroCarKey, rivalCarKey } from '../textures';
import { confettiBurst, iconButton, soundIconKey, sparkleBurst, text } from '../ui';

const ROAD_TILE_H = 560;
const GRASS_TILE = 512;

export interface RaceSceneData {
  seed?: number;
  theme?: Theme;
  colorId?: string;
  flagId?: string;
  stickerId?: string;
}

export class RaceScene extends Phaser.Scene {
  private sim!: RaceState;
  private theme: Theme = 'meadow';
  private seed = 1;
  private tuning = { colorId: 'rose', flagId: 'star', stickerId: 'star' };

  private holding: -1 | 0 | 1 = 0;
  private grassHintAt = 0;
  private finishing = false;
  private finishAt = 0;
  private balloonVoiceCounter = 0;

  private grassTile!: Phaser.GameObjects.TileSprite;
  private roadTile!: Phaser.GameObjects.TileSprite;
  private world!: Phaser.GameObjects.Container;
  private hero!: Phaser.GameObjects.Image;
  private heroShadow!: Phaser.GameObjects.Ellipse;
  private rivalNodes: Array<{
    rival: Rival;
    container: Phaser.GameObjects.Container;
    image: Phaser.GameObjects.Image;
    badge: Phaser.GameObjects.Image;
  }> = [];
  private balloonNodes = new Map<number, Phaser.GameObjects.Image>();
  private obstacleNodes = new Map<number, Phaser.GameObjects.Image>();
  private decorations: Array<{ image: Phaser.GameObjects.Image; progress: number }> = [];
  private banner!: Phaser.GameObjects.Image;
  private ribbon!: Phaser.GameObjects.Image;
  private hintArrow!: Phaser.GameObjects.Image;
  private lightBody!: Phaser.GameObjects.Container;
  private lamps: Phaser.GameObjects.Image[] = [];
  private countText!: Phaser.GameObjects.Text;
  private balloonHud!: Phaser.GameObjects.Text;
  private starHud!: Phaser.GameObjects.Text;
  private padLeft!: Phaser.GameObjects.Image;
  private padRight!: Phaser.GameObjects.Image;
  private muteButton!: Phaser.GameObjects.Container;

  constructor() {
    super('race');
  }

  create(data: RaceSceneData): void {
    buildTextures(this);
    this.theme = data.theme ?? 'meadow';
    this.seed = data.seed ?? Math.floor(Math.random() * 100000);
    this.tuning = {
      colorId: data.colorId ?? this.tuning.colorId,
      flagId: data.flagId ?? this.tuning.flagId,
      stickerId: data.stickerId ?? this.tuning.stickerId,
    };
    this.sim = createRace(this.seed, this.theme);
    this.holding = 0;
    this.finishing = false;
    this.balloonVoiceCounter = 0;
    this.balloonNodes.clear();
    this.obstacleNodes.clear();
    this.decorations = [];
    this.rivalNodes = [];
    this.lamps = [];

    bridge.scene = 'race';
    bridge.seed = this.seed;
    bridge.theme = this.theme;
    bridge.events = [];
    bridge.forceSteer = null;
    bridge.tapSteer = (direction) => {
      this.holding = direction;
    };

    const palette = this.themePalette();
    this.cameras.main.setBackgroundColor(palette.grass);

    this.grassTile = this.add
      .tileSprite(VIEW.w / 2, VIEW.h / 2, VIEW.w, VIEW.h, `grass-${this.theme}`)
      .setDepth(-20);

    this.roadTile = this.add
      .tileSprite(VIEW.w / 2, VIEW.h / 2, ROAD.laneWidth * 3 + ROAD.shoulder * 2, VIEW.h + 8, `road-${this.theme}`)
      .setDepth(-19);

    this.world = this.add.container(0, PLAYER_SCREEN_Y).setDepth(0);
    this.buildDecorations();
    this.buildBanner();
    this.buildBalloons();
    this.buildObstacles();
    this.buildRivals();
    this.buildHero();
    this.buildHud();
    this.buildTrafficLight();
    this.buildControls();

    audio.startMusic();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      audio.stopEngine();
      bridge.tapSteer = () => undefined;
    });

    this.input.addPointer(2);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.onPointerDown(pointer));
    this.input.on('pointerup', () => this.releaseHold());
    this.input.on('pointerupoutside', () => this.releaseHold());
    this.input.on('gameout', () => this.releaseHold());

    const keyboard = this.input.keyboard;
    if (keyboard) {
      keyboard.on('keydown-LEFT', () => this.pressSteer(-1));
      keyboard.on('keydown-RIGHT', () => this.pressSteer(1));
      keyboard.on('keyup-LEFT', () => this.releaseHold());
      keyboard.on('keyup-RIGHT', () => this.releaseHold());
    }
  }

  private themePalette(): { grass: number } {
    if (this.theme === 'river') return { grass: 0xa9dfa0 };
    if (this.theme === 'city') return { grass: 0xb6d6a2 };
    return { grass: COLORS.grassLight };
  }

  private buildDecorations(): void {
    const keys = decorationKeysFor(this.theme);
    const rng = new Phaser.Math.RandomDataGenerator([`decor-${this.seed}-${this.theme}`]);
    let index = 0;
    for (let progress = 60; progress < CFG.raceLength + 400; progress += 150 + rng.between(0, 120)) {
      for (const side of [-1, 1] as const) {
        const key = keys[index % keys.length];
        index += 1;
        const offset = ROAD.halfWidth + ROAD.shoulder + rng.between(60, 260);
        const image = this.add.image(side * offset, -progress, key).setDepth(0);
        const base = key === 'tree' || key === 'house' ? 0.62 : key === 'lamp' ? 0.5 : 0.5;
        image.setScale(base * rng.realInRange(0.85, 1.15));
        if (rng.frac() < 0.5) image.setFlipX(true);
        this.world.add(image);
        this.decorations.push({ image, progress });
      }
    }
  }

  private buildBanner(): void {
    this.banner = this.add.image(0, -CFG.raceLength, 'banner').setDepth(2);
    this.banner.setOrigin(0.5, 0.9);
    this.world.add(this.banner);
    this.ribbon = this.add.image(0, -(CFG.raceLength - 20), 'ribbon').setDepth(2);
    this.world.add(this.ribbon);
  }

  private buildBalloons(): void {
    for (const balloon of this.sim.balloons) {
      const image = this.add.image(laneX(balloon.lateral), -balloon.progress, 'balloon').setDepth(3);
      image.setScale(0.72);
      this.world.add(image);
      this.balloonNodes.set(balloon.id, image);
      this.tweens.add({
        targets: image,
        y: image.y - 14,
        duration: 900 + (balloon.id % 4) * 120,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private buildObstacles(): void {
    for (const obstacle of this.sim.obstacles) {
      const image = this.add
        .image(laneX(obstacle.lateral), -obstacle.progress, obstacle.kind === 'puddle' ? 'puddle' : 'mound')
        .setDepth(1);
      image.setScale(obstacle.kind === 'puddle' ? 0.8 : 0.7);
      this.world.add(image);
      this.obstacleNodes.set(obstacle.id, image);
    }
  }

  private buildRivals(): void {
    this.sim.rivals.forEach((rival, index) => {
      const image = this.add.image(0, 0, rivalCarKey(this, rival.id)).setDepth(5);
      image.setScale(0.86);
      const badge = this.add.image(0, -150, 'star').setScale(0.55).setAlpha(0).setDepth(6);
      const container = this.add.container(laneX(rival.lateral), -rival.progress);
      container.add([image, badge]);
      this.world.add(container);
      this.rivalNodes.push({ rival, container, image, badge });
      void index;
    });
  }

  private buildHero(): void {
    const key = heroCarKey(this, this.tuning.colorId, this.tuning.flagId, this.tuning.stickerId);
    this.heroShadow = this.add.ellipse(0, PLAYER_SCREEN_Y + 96, 160, 54, COLORS.shadow, 0.18).setDepth(4);
    this.hero = this.add.image(laneX(1), PLAYER_SCREEN_Y, key).setDepth(6);
    this.hero.setScale(1);
    this.hintArrow = this.add
      .image(laneX(1), PLAYER_SCREEN_Y - 190, 'arrow')
      .setDepth(7)
      .setScale(0.7)
      .setAlpha(0)
      .setTint(0xffffff);
  }

  private buildHud(): void {
    const hudY = 84;
    const balloonIcon = this.add.image(76, hudY, 'icon-hud-balloon').setDisplaySize(74, 74).setDepth(20);
    this.balloonHud = text(this, 136, hudY, '0', { size: UI.fontSize.mid, color: '#ffffff' }).setDepth(20);
    this.starHud = text(this, VIEW.w / 2, hudY, '', { size: UI.fontSize.mid, color: '#ffffff' }).setDepth(20);
    void balloonIcon;

    this.muteButton = iconButton(this, VIEW.w - 86, hudY, soundIconKey(), () => {
      audio.setMuted(!audio.muted);
      this.muteButton.removeAll(true);
      const back = this.add.circle(0, 0, UI.hudSize * 0.5, 0xffffff, 0.34).setStrokeStyle(6, 0xffffff, 0.7);
      const icon = this.add.image(0, 0, soundIconKey()).setDisplaySize(UI.hudSize * 0.5, UI.hudSize * 0.5);
      this.muteButton.add([back, icon]);
    });
    this.muteButton.setDepth(20);

    iconButton(this, VIEW.w - 208, hudY, 'icon-pause', () => {
      this.registry.set('paused', true);
    }).setDepth(20);
  }

  private buildTrafficLight(): void {
    this.lightBody = this.add.container(VIEW.w / 2, 208).setDepth(30);
    const pole = this.add.rectangle(0, 180, 22, 210, 0xb9b3c8);
    const body = this.add.rectangle(0, -10, 124, 300, 0x5c5468).setStrokeStyle(8, 0x4a4456);
    this.lightBody.add([pole, body]);
    for (let i = 0; i < 3; i += 1) {
      const lamp = this.add.image(0, -100 + i * 92, 'lamp-off').setDisplaySize(84, 84);
      this.lamps.push(lamp);
      this.lightBody.add(lamp);
    }
    this.lightBody.setScale(0);
    this.tweens.add({ targets: this.lightBody, scale: 1, duration: 420, ease: 'Back.easeOut' });

    // The digit sits well below the light so the road ahead stays readable.
    this.countText = text(this, VIEW.w / 2, 468, '', { size: 280, color: '#ffffff' })
      .setDepth(40)
      .setAlpha(0)
      .setStroke('#5a4632', 22);
  }

  private buildControls(): void {
    this.padLeft = this.add.image(230, VIEW.h - 200, 'btn-steer').setDepth(15).setAlpha(0.95);
    this.padRight = this.add.image(VIEW.w - 230, VIEW.h - 200, 'btn-steer').setDepth(15).setAlpha(0.95);
    const arrowLeft = this.add.image(230, VIEW.h - 200, 'arrow').setDepth(16).setScale(0.9);
    arrowLeft.setFlipX(true);
    const arrowRight = this.add.image(VIEW.w - 230, VIEW.h - 200, 'arrow').setDepth(16).setScale(0.9);
    void arrowLeft;
    void arrowRight;
  }

  private pressSteer(direction: -1 | 1): void {
    this.holding = direction;
    const pad = direction < 0 ? this.padLeft : this.padRight;
    this.tweens.add({ targets: pad, scale: 1.08, duration: 90 });
  }

  private releaseHold(): void {
    this.holding = 0;
    this.tweens.add({ targets: [this.padLeft, this.padRight], scale: 1, duration: 120 });
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    audio.unlock();
    if (pointer.y < 170) return; // the HUD strip owns these taps
    this.pressSteer(pointer.x < VIEW.w / 2 ? -1 : 1);
  }

  private currentSteer(): number {
    if (bridge.forceSteer !== null) return bridge.forceSteer;
    return this.holding;
  }

  override update(_time: number, delta: number): void {
    recordFrame(delta);
    const blocked = this.registry.get('portrait') === true || this.registry.get('paused') === true;
    if (!blocked && !this.finishing) {
      const subSteps = Math.max(1, Math.min(20, Math.round(bridge.timeScale)));
      const stepMs = Math.min(delta, 60);
      const collected: RaceEvent[] = [];
      for (let i = 0; i < subSteps; i += 1) {
        const { state, events } = stepRace(this.sim, stepMs, { steer: this.currentSteer() });
        this.sim = state;
        collected.push(...events);
      }
      bridge.state = this.sim;
      bridge.seed = this.sim.seed;
      collected.forEach((event) => this.handleEvent(event));
      if (collected.length) bridge.events = collected.slice();
    }

    this.renderScene(delta);

    if (this.finishing && this.time.now - this.finishAt > 2600) {
      this.finishing = false;
      this.scene.start('finish', {
        seed: this.seed,
        theme: this.theme,
        balloons: this.sim.balloonsTaken,
        overtakes: this.sim.overtakes,
        ms: this.sim.finishMs,
        colorId: this.tuning.colorId,
        flagId: this.tuning.flagId,
        stickerId: this.tuning.stickerId,
      });
    }
  }

  private renderScene(delta: number): void {
    const progress = this.sim.progress;
    const playerProgress = progress;

    this.grassTile.tilePositionY = -((progress % GRASS_TILE) + GRASS_TILE) % GRASS_TILE;
    this.roadTile.tilePositionY = -((progress % ROAD_TILE_H) + ROAD_TILE_H) % ROAD_TILE_H;
    this.world.y = PLAYER_SCREEN_Y + progress;

    const hop = this.sim.hopMs > 0 ? Math.sin((1 - this.sim.hopMs / CFG.hopMs) * Math.PI) : 0;
    const heroY = PLAYER_SCREEN_Y - hop * 46;
    this.hero.x = laneX(this.sim.lateral);
    this.hero.y = heroY;
    this.hero.setRotation(Phaser.Math.Clamp(-this.sim.steerVel * 0.11, -0.22, 0.22));
    this.hero.setScale(1 + hop * 0.06, 1 - hop * 0.05);
    this.heroShadow.x = this.hero.x;
    this.heroShadow.y = heroY + 112 - hop * 20;
    this.heroShadow.setScale(1 - hop * 0.12, 1 - hop * 0.12);

    const onGrass = this.sim.onGrass && !this.finishing;
    this.hintArrow.setAlpha(onGrass ? 0.85 : 0);
    if (onGrass) {
      const towardRoad = this.sim.lateral > 1 ? -1 : 1;
      this.hintArrow.x = this.hero.x + towardRoad * 120;
      this.hintArrow.y = heroY - 210 + Math.sin(this.time.now / 220) * 14;
      this.hintArrow.setFlipX(towardRoad > 0);
      if (this.time.now - this.grassHintAt > 6500) {
        this.grassHintAt = this.time.now;
        audio.speak('Давай на дорожку!', { pitch: 1.25 });
      }
    }

    for (const node of this.rivalNodes) {
      const y = screenY(node.rival.progress, playerProgress);
      node.container.setPosition(laneX(node.rival.lateral), y);
      const visible = y > -260 && y < VIEW.h + 260;
      node.container.setVisible(visible);
      if (node.rival.waveTimerMs > 0) {
        const wave = Math.sin(this.time.now / 90) * 0.12;
        node.image.setRotation(wave);
        node.badge.setAlpha(Math.min(1, node.rival.waveTimerMs / 900));
        node.badge.setScale(0.55 + Math.sin(this.time.now / 120) * 0.05);
      } else {
        node.image.setRotation(0);
        node.badge.setAlpha(0);
      }
      if (visible) {
        node.container.setDepth(node.rival.progress > progress ? 5 : 3);
      }
    }

    for (const balloon of this.sim.balloons) {
      const node = this.balloonNodes.get(balloon.id);
      if (!node) continue;
      const y = screenY(balloon.progress, playerProgress);
      node.setVisible(!balloon.taken && y > -200 && y < VIEW.h + 200);
    }

    for (const obstacle of this.sim.obstacles) {
      const node = this.obstacleNodes.get(obstacle.id);
      if (!node) continue;
      const y = screenY(obstacle.progress, playerProgress);
      node.setVisible(y > -220 && y < VIEW.h + 220);
    }

    for (const decoration of this.decorations) {
      const y = screenY(decoration.progress, playerProgress);
      decoration.image.setVisible(y > -VEHICLE_MARGIN && y < VIEW.h + VEHICLE_MARGIN);
    }

    this.balloonHud.setText(String(this.sim.balloonsTaken));
    this.starHud.setText(this.sim.overtakes > 0 ? '★'.repeat(Math.min(3, this.sim.overtakes)) : '');
    bridge.metrics.fps = Math.round(1000 / Math.max(1, delta));
  }

  private handleEvent(event: RaceEvent): void {
    switch (event.type) {
      case 'count': {
        const names: Record<number, string> = { 3: 'Три', 2: 'Два', 1: 'Один' };
        audio.countdown(event.n);
        audio.speak(`${names[event.n] ?? ''}`, { rate: 0.95, minGapMs: 0 });
        const index = 3 - event.n;
        this.lamps.forEach((lamp, i) => {
          lamp.setTexture(i <= index ? ['lamp-red', 'lamp-yellow', 'lamp-green'][i] : 'lamp-off');
        });
        this.countText.setText(String(event.n));
        this.countText.setAlpha(1).setScale(1.6);
        this.tweens.add({ targets: this.countText, scale: 1, alpha: 0.95, duration: 340, ease: 'Back.easeOut' });
        break;
      }
      case 'go': {
        audio.go();
        audio.speak('Едем!', { rate: 1, minGapMs: 0 });
        this.lamps.forEach((lamp, i) => lamp.setTexture(['lamp-red', 'lamp-yellow', 'lamp-green'][i]));
        this.countText.setText('Едем!');
        this.countText.setFontSize(150);
        this.countText.setAlpha(1).setScale(1.25);
        this.tweens.add({ targets: this.countText, scale: 1, alpha: 0, duration: 900, ease: 'Quad.easeOut' });
        this.tweens.add({
          targets: this.lightBody,
          scale: 0,
          alpha: 0,
          delay: 700,
          duration: 400,
          onComplete: () => this.lightBody.setVisible(false),
        });
        audio.startEngine();
        confettiBurst(this, VIEW.w / 2, VIEW.h * 0.4, 18, 700);
        break;
      }
      case 'balloon': {
        const node = this.balloonNodes.get(event.id);
        audio.balloon();
        this.balloonVoiceCounter += 1;
        if (this.balloonVoiceCounter % 3 === 0) {
          audio.speak('Шарик!', { pitch: 1.3 });
        }
        if (node) {
          sparkleBurst(this, node.x, this.world.y + node.y, 8);
          this.tweens.add({
            targets: node,
            scale: 1.2,
            alpha: 0,
            duration: 260,
            onComplete: () => node.setVisible(false),
          });
        }
        this.tweens.add({ targets: this.balloonHud, scale: 1.35, duration: 130, yoyo: true });
        break;
      }
      case 'overtake': {
        const node = this.rivalNodes.find((item) => item.rival.id === event.rival);
        audio.overtake();
        audio.honk();
        audio.speak('Обгон!', { rate: 1, pitch: 1.2, minGapMs: 500 });
        if (node) {
          const screen = screenY(node.rival.progress, this.sim.progress);
          sparkleBurst(this, laneX(node.rival.lateral), Math.max(120, Math.min(VIEW.h - 80, screen)), 12);
        }
        break;
      }
      case 'splash': {
        const node = this.obstacleNodes.get(event.id);
        audio.splash();
        if (node) {
          sparkleBurst(this, node.x, PLAYER_SCREEN_Y - 20, 6);
        }
        break;
      }
      case 'hop': {
        audio.hop();
        break;
      }
      case 'grass': {
        this.grassHintAt = this.time.now;
        audio.grassHint();
        audio.speak('Давай на дорожку!', { pitch: 1.25 });
        break;
      }
      case 'road': {
        audio.touch();
        break;
      }
      case 'finish': {
        this.finishing = true;
        this.finishAt = this.time.now;
        audio.finish();
        audio.stopEngine();
        audio.speak('Ура! Финиш! Молодец!', { rate: 0.95, pitch: 1.2, minGapMs: 0 });
        confettiBurst(this, VIEW.w * 0.3, VIEW.h * 0.3, 26, 600);
        confettiBurst(this, VIEW.w * 0.7, VIEW.h * 0.35, 26, 600);
        this.tweens.add({ targets: this.ribbon, angle: 22, y: this.ribbon.y + 120, alpha: 0.6, duration: 420 });
        this.tweens.add({ targets: this.countText, alpha: 0, duration: 400 });
        break;
      }
      default:
        break;
    }
  }

  /** Hidden helpers keep the exported test bridge able to inspect the world. */
  getSimState(): RaceState {
    return this.sim;
  }

  static readonly themes = THEMES;

  static obstacleAt(obstacles: Obstacle[], id: number): Obstacle | undefined {
    return obstacles.find((item) => item.id === id);
  }
}

const VEHICLE_MARGIN = 260;
