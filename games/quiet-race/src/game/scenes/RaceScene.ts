import Phaser from 'phaser';
import { CFG, PALETTES, type Theme } from '../../sim/config';
import { createRace, stepRace, type RaceEvent, type RaceState } from '../../sim/race';
import { createTrack, type Track } from '../../sim/track';
import { Road3D, VIEW } from '../../render/road3d';
import { audio } from '../audio';
import { bridge, recordFrame, recordPhase } from '../bridge';
import { RaceHud } from '../hud';
import { confettiBurst, sparkleBurst, text } from '../ui';
import { buildTextures, heroCarKey } from '../textures';

export interface RaceSceneData {
  seed?: number;
  theme?: Theme;
  colorId?: string;
  flagId?: string;
  stickerId?: string;
}

const PAD_LEFT = { x: 470, y: 700 };
const PAD_RIGHT = { x: 1130, y: 700 };

export class RaceScene extends Phaser.Scene {
  private sim!: RaceState;
  private theme: Theme = 'candy';
  private seed = 1;
  private track!: Track;
  private colorId = 'rose';
  private flagId = 'star';
  private stickerId = 'star';

  private holding: -1 | 0 | 1 = 0;
  private boostRequested = false;
  private finishing = false;
  private finishAt = 0;
  private balloonVoiceCounter = 0;

  private road3d!: Road3D;
  private hud!: RaceHud;
  private padLeft!: Phaser.GameObjects.Image;
  private padRight!: Phaser.GameObjects.Image;
  private countText!: Phaser.GameObjects.Text;
  private countDisc!: Phaser.GameObjects.Arc;
  private gantryHiddenAt = 0;

  constructor() {
    super('race');
  }

  create(data: RaceSceneData): void {
    buildTextures(this);
    this.theme = data.theme ?? 'candy';
    this.seed = data.seed ?? bridge.forceSeed ?? Math.floor(Math.random() * 100000);
    this.colorId = data.colorId ?? this.colorId;
    this.flagId = data.flagId ?? this.flagId;
    this.stickerId = data.stickerId ?? this.stickerId;
    this.track = createTrack(this.seed);
    this.sim = createRace(this.seed, this.theme);
    this.holding = 0;
    this.boostRequested = false;
    this.finishing = false;
    this.balloonVoiceCounter = 0;

    bridge.scene = 'race';
    bridge.seed = this.seed;
    bridge.theme = this.theme;
    bridge.events = [];
    bridge.forceSteer = null;
    bridge.freeze = false;
    bridge.tapSteer = (direction) => {
      this.holding = direction;
    };

    this.cameras.main.setBackgroundColor('#8fd8ff');

    this.road3d = new Road3D(this);
    this.road3d.setTheme(this.theme, this.track);
    this.road3d.setHeroCar(heroCarKey(this, this.colorId, this.flagId, this.stickerId));
    this.road3d.setGantry(0);

    this.hud = new RaceHud(this, this.theme, this.track, {
      onPause: () => this.registry.set('paused', true),
      onMute: () => audio.setMuted(!audio.muted),
      onBoost: () => {
        this.boostRequested = true;
      },
    });

    this.buildControls();
    this.buildCountdown();

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
      keyboard.on('keydown-SPACE', () => {
        this.boostRequested = true;
      });
    }
  }

  private buildControls(): void {
    this.padLeft = this.add
      .image(PAD_LEFT.x, PAD_LEFT.y, 'steer-pad')
      .setDisplaySize(232, 232)
      .setDepth(50000);
    this.padRight = this.add
      .image(PAD_RIGHT.x, PAD_RIGHT.y, 'steer-pad')
      .setDisplaySize(232, 232)
      .setDepth(50000);
    this.add.image(PAD_LEFT.x, PAD_LEFT.y, 'arrow').setDisplaySize(124, 124).setDepth(50001).setFlipX(true);
    this.add.image(PAD_RIGHT.x, PAD_RIGHT.y, 'arrow').setDisplaySize(124, 124).setDepth(50001);
  }

  private buildCountdown(): void {
    this.countDisc = this.add.circle(VIEW.w / 2, 470, 150, 0xfffdf8, 0.78).setDepth(99989).setAlpha(0);
    this.countText = text(this, VIEW.w / 2, 470, '', { size: 230, color: '#ff5f5f' })
      .setDepth(99990)
      .setAlpha(0)
      .setStroke('#5a2f4a', 22);
  }

  private pressSteer(direction: -1 | 1): void {
    this.holding = direction;
    const pad = direction < 0 ? this.padLeft : this.padRight;
    this.tweens.add({ targets: pad, scale: pad.scale * 1.06, duration: 90 });
  }

  private releaseHold(): void {
    this.holding = 0;
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    audio.unlock();
    // The HUD owns the top strip and the boost cupcake.
    if (pointer.y < 210) return;
    if (pointer.x > 1380 && pointer.y > 540) return;
    this.pressSteer(pointer.x < VIEW.w / 2 ? -1 : 1);
  }

  private currentSteer(): number {
    if (bridge.forceSteer !== null) return bridge.forceSteer;
    return this.holding;
  }

  override update(_time: number, delta: number): void {
    recordFrame(delta);
    const blocked =
      this.registry.get('portrait') === true || this.registry.get('paused') === true || bridge.freeze === true;

    const simStart = typeof performance !== 'undefined' ? performance.now() : 0;
    if (!blocked && !this.finishing) {
      const subSteps = Math.max(1, Math.min(24, Math.round(bridge.timeScale)));
      const stepMs = Math.min(delta, 60);
      const collected: RaceEvent[] = [];
      for (let i = 0; i < subSteps; i += 1) {
        const boost = this.boostRequested;
        this.boostRequested = false;
        const { state, events } = stepRace(this.sim, stepMs, { steer: this.currentSteer(), boost });
        this.sim = state;
        collected.push(...events);
      }
      bridge.state = this.sim;
      bridge.seed = this.sim.seed;
      collected.forEach((event) => this.handleEvent(event));
      if (collected.length) bridge.events = collected.slice();
    }
    if (simStart) recordPhase('simMs', (typeof performance !== 'undefined' ? performance.now() : 0) - simStart);

    this.road3d.render(this.sim, delta, {
      boosting: this.sim.boostMs > 0,
      curve: this.track.curve[Math.floor((this.sim.progress * CFG.worldPerSim) / CFG.segmentLength) % this.track.segmentsPerLap] ?? 0,
    });
    this.hud.update(this.sim);

    if (this.gantryHiddenAt > 0 && this.time.now > this.gantryHiddenAt) {
      this.gantryHiddenAt = 0;
      this.road3d.setGantry(-1);
    }

    if (this.finishing && this.time.now - this.finishAt > 2600) {
      this.finishing = false;
      this.scene.start('finish', {
        seed: this.seed,
        theme: this.theme,
        balloons: this.sim.balloonsTaken,
        overtakes: this.sim.overtakes,
        boosts: this.sim.boostsUsed,
        ms: this.sim.finishMs,
        colorId: this.colorId,
        flagId: this.flagId,
        stickerId: this.stickerId,
      });
    }
  }

  private handleEvent(event: RaceEvent): void {
    const hero = this.road3d.heroScreen;
    switch (event.type) {
      case 'count': {
        const names: Record<number, string> = { 3: 'Три', 2: 'Два', 1: 'Один' };
        const colors: Record<number, string> = { 3: '#ff5f5f', 2: '#ffa93c', 1: '#ffa93c' };
        audio.countdown(event.n);
        audio.speak(names[event.n] ?? '', { rate: 0.95, minGapMs: 0 });
        this.road3d.setGantry(4 - event.n);
        this.countText.setText(String(event.n));
        this.countText.setColor(colors[event.n] ?? '#ffffff');
        this.countText.setAlpha(1).setScale(1.35);
        this.countDisc.setAlpha(0.85).setScale(1.1);
        this.tweens.add({ targets: this.countText, scale: 1, alpha: 0.98, duration: 320, ease: 'Back.easeOut' });
        this.tweens.add({ targets: this.countDisc, scale: 1, duration: 320, ease: 'Back.easeOut' });
        break;
      }
      case 'go': {
        audio.go();
        audio.speak('Едем!', { rate: 1, minGapMs: 0 });
        this.road3d.setGantry(3);
        this.gantryHiddenAt = this.time.now + 800;
        this.countText.setText('Едем!');
        this.countText.setFontSize(150);
        this.countText.setColor('#2f9e44');
        this.countText.setAlpha(1).setScale(1.25);
        this.tweens.add({ targets: this.countText, scale: 1, alpha: 0, duration: 900, ease: 'Quad.easeOut' });
        this.tweens.add({ targets: this.countDisc, alpha: 0, duration: 900, ease: 'Quad.easeOut' });
        audio.startEngine();
        confettiBurst(this, VIEW.w / 2, 220, 22, 900);
        break;
      }
      case 'lap': {
        const words: Record<number, string> = { 2: 'Круг два!', 3: 'Круг три!' };
        audio.overtake();
        audio.speak(words[event.lap] ?? 'Новый круг!', { rate: 1, pitch: 1.2, minGapMs: 0 });
        confettiBurst(this, VIEW.w * 0.5, 200, 26, 1000);
        this.countText.setText(`Круг ${event.lap}`);
        this.countText.setFontSize(96);
        this.countText.setColor('#ffffff');
        this.countText.setAlpha(1).setScale(1.1);
        this.countDisc.setAlpha(0.7).setScale(1);
        this.tweens.add({ targets: this.countText, scale: 1, alpha: 0, duration: 1100, ease: 'Quad.easeOut' });
        this.tweens.add({ targets: this.countDisc, alpha: 0, duration: 1100, ease: 'Quad.easeOut' });
        break;
      }
      case 'balloon': {
        audio.balloon();
        this.balloonVoiceCounter += 1;
        sparkleBurst(this, hero.x, hero.y - 160, 8);
        break;
      }
      case 'charge': {
        if (event.charges >= CFG.boostChargeMax) {
          audio.speak('Кекс готов!', { rate: 1, pitch: 1.3, minGapMs: 800 });
        }
        break;
      }
      case 'boost': {
        audio.go();
        audio.speak('Ух ты!', { rate: 1, pitch: 1.35, minGapMs: 0 });
        sparkleBurst(this, hero.x, hero.y - 120, 14);
        break;
      }
      case 'overtake': {
        audio.overtake();
        audio.honk();
        audio.speak('Обгон!', { rate: 1, pitch: 1.2, minGapMs: 500 });
        sparkleBurst(this, hero.x, hero.y - 320, 10);
        break;
      }
      case 'splash': {
        audio.splash();
        sparkleBurst(this, hero.x, hero.y - 10, 7);
        break;
      }
      case 'hop': {
        audio.hop();
        break;
      }
      case 'grass': {
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
        confettiBurst(this, VIEW.w * 0.3, 260, 30, 800);
        confettiBurst(this, VIEW.w * 0.7, 300, 30, 800);
        this.tweens.add({ targets: this.countText, alpha: 0, duration: 400 });
        break;
      }
      default:
        break;
    }
  }

  getSimState(): RaceState {
    return this.sim;
  }

  static paletteFor(theme: Theme): string {
    return PALETTES[theme].name;
  }
}
