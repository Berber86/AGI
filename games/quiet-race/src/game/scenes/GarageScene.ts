import Phaser from 'phaser';
import { CAR_COLORS, FLAGS, THEMES, type Theme } from '../../sim/config';
import { COLORS, ROAD, UI, VIEW } from '../layout';
import { audio } from '../audio';
import { bridge } from '../bridge';
import { buildTextures, heroCarKey } from '../textures';
import { readStore, writeStore } from '../storage';
import { circleButton, iconButton, paintMeadow, paintSky, soundIconKey, text } from '../ui';

interface Option<T> {
  id: T;
  node: Phaser.GameObjects.Container;
}

const STICKERS = ['star', 'heart', 'flower'] as const;

export class GarageScene extends Phaser.Scene {
  private colorId = 'rose';
  private flagId = 'star';
  private stickerId = 'star';
  private carPreview!: Phaser.GameObjects.Image;
  private colorOptions: Option<string>[] = [];
  private flagOptions: Option<string>[] = [];
  private stickerOptions: Option<string>[] = [];
  private unlocked = false;

  constructor() {
    super('garage');
  }

  create(): void {
    buildTextures(this);
    // Phaser destroys this scene's game objects on shutdown, so references kept
    // from a previous visit (for example after «В гараж») must be dropped.
    this.colorOptions = [];
    this.flagOptions = [];
    this.stickerOptions = [];
    this.loadTuning();
    bridge.scene = 'garage';
    bridge.tapSteer = () => undefined;

    paintSky(this);
    const sun = this.add.image(140, 130, 'sun').setScale(0.72);
    this.tweens.add({ targets: sun, angle: 360, duration: 42000, repeat: -1 });
    const cloudA = this.add.image(1320, 140, 'cloud').setScale(0.8).setAlpha(0.95);
    const cloudB = this.add.image(1080, 250, 'cloud').setScale(0.55).setAlpha(0.8);
    this.tweens.add({ targets: cloudA, x: 1500, duration: 26000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: cloudB, x: 900, duration: 19000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    paintMeadow(this, 560, COLORS.grassLight);
    const roadStrip = this.add
      .tileSprite(VIEW.w / 2, 720, ROAD.laneWidth * 3 + ROAD.shoulder * 2, 200, `road-${THEMES[0]}`)
      .setAlpha(0.95);
    void roadStrip;
    this.add.image(VIEW.w / 2, 560, 'banner').setScale(1.1).setAlpha(0.9);

    text(this, VIEW.w / 2, 66, 'Тихая гонка', { size: 64 }).setDepth(10);
    text(this, VIEW.w / 2, 124, 'Выбери машинку и нажми зелёную кнопку', {
      size: UI.fontSize.tiny,
      color: '#6b8f5a',
    }).setDepth(10);

    this.carPreview = this.add.image(880, 430, heroCarKey(this, this.colorId, this.flagId, this.stickerId));
    this.carPreview.setScale(1.5).setDepth(5);
    this.tweens.add({
      targets: this.carPreview,
      y: 452,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.buildOptionRows('color', 'Машинка', 230, CAR_COLORS.map((item) => item.id as string), 320, (id) =>
      this.setTuning({ colorId: id }),
    );
    this.buildOptionRows('flag', 'Флажок', 400, FLAGS.map((item) => item.id as string), 490, (id) =>
      this.setTuning({ flagId: id }),
    );
    this.buildOptionRows('sticker', 'Наклейка', 570, [...STICKERS], 660, (id) =>
      this.setTuning({ stickerId: id }),
    );

    circleButton(this, 1330, 520, 'btn-go', 'icon-play', {
      size: 330,
      iconScale: 0.38,
      label: 'Едем!',
      labelColor: '#2f5c1f',
      onTap: () => this.startRace(),
    }).setDepth(12);

    this.buildMuteButton();
    if (!this.scene.isActive('overlay')) this.scene.launch('overlay');

    this.input.on('pointerdown', () => this.unlockAudio());
    this.refreshSelection();
  }

  private buildMuteButton(): Phaser.GameObjects.Container {
    const button = iconButton(this, VIEW.w - 90, 80, soundIconKey(), () => {
      audio.setMuted(!audio.muted);
      button.removeAll(true);
      button.add([
        this.add.circle(0, 0, UI.hudSize * 0.5, 0xffffff, 0.5).setStrokeStyle(6, 0xffffff, 0.85),
        this.add.image(0, 0, soundIconKey()).setDisplaySize(UI.hudSize * 0.5, UI.hudSize * 0.5),
      ]);
    });
    button.setDepth(12);
    return button;
  }

  private buildOptionRows(
    kind: 'color' | 'flag' | 'sticker',
    label: string,
    labelY: number,
    ids: string[],
    rowY: number,
    onPick: (id: string) => void,
  ): void {
    text(this, 300, labelY, label, { size: UI.fontSize.small, color: '#6b8f5a' }).setDepth(10);
    ids.forEach((id, index) => {
      const x = 200 + index * 110;
      const container = this.add.container(x, rowY).setDepth(10);
      const ring = this.add.circle(0, 0, 52, 0xffffff, 0.75).setStrokeStyle(8, 0xffffff, 0.9);
      const swatch = this.add.circle(0, 0, 44, this.swatchColor(id), 1).setStrokeStyle(6, 0x000000, 0.06);
      container.add([ring, swatch]);
      if (kind === 'flag') {
        container.add(this.add.image(0, 0, 'star').setDisplaySize(46, 46).setAlpha(0.95));
      } else if (kind === 'sticker') {
        const iconKey = id === 'heart' ? 'heart' : id === 'flower' ? 'flower-pink' : 'star';
        container.add(this.add.image(0, 0, iconKey).setDisplaySize(50, 50).setAlpha(0.95));
      } else {
        container.add(this.add.circle(0, 0, 22, 0xffffff, 0.35));
      }
      container.setSize(112, 112);
      container.setInteractive(new Phaser.Geom.Circle(56, 56, 58), Phaser.Geom.Circle.Contains);
      container.on('pointerdown', () => {
        this.unlockAudio();
        audio.touch();
        this.tweens.add({ targets: container, scale: 0.9, duration: 80, yoyo: true });
        onPick(id);
      });
      const option: Option<string> = { id, node: container };
      if (kind === 'color') this.colorOptions.push(option);
      else if (kind === 'flag') this.flagOptions.push(option);
      else this.stickerOptions.push(option);
    });
  }

  private swatchColor(id: string): number {
    const color = CAR_COLORS.find((item) => item.id === id);
    if (color) return color.body;
    const flag = FLAGS.find((item) => item.id === id);
    if (flag) return flag.color;
    if (id === 'heart') return 0xff7fa8;
    if (id === 'flower') return 0xb388ff;
    return 0xffd166;
  }

  private refreshSelection(): void {
    const mark = (options: Option<string>[], selected: string) => {
      for (const option of options) {
        if (option.node.active === false || !option.node.list?.length) continue;
        const ring = option.node.getAt(0) as Phaser.GameObjects.Arc | undefined;
        if (!ring) continue;
        const chosen = option.id === selected;
        ring.setStrokeStyle(chosen ? 12 : 8, chosen ? 0x4fae33 : 0xffffff, chosen ? 1 : 0.9);
        option.node.setScale(chosen ? 1.08 : 1);
      }
    };
    mark(this.colorOptions, this.colorId);
    mark(this.flagOptions, this.flagId);
    mark(this.stickerOptions, this.stickerId);
  }

  private setTuning(patch: Partial<{ colorId: string; flagId: string; stickerId: string }>): void {
    Object.assign(this, patch);
    this.carPreview.setTexture(heroCarKey(this, this.colorId, this.flagId, this.stickerId));
    this.refreshSelection();
    this.persistTuning();
  }

  private loadTuning(): void {
    const raw = readStore('quiet-race-tuning');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<{ colorId: string; flagId: string; stickerId: string }>;
      this.colorId = parsed.colorId ?? this.colorId;
      this.flagId = parsed.flagId ?? this.flagId;
      this.stickerId = parsed.stickerId ?? this.stickerId;
    } catch {
      /* defaults are fine */
    }
  }

  private persistTuning(): void {
    writeStore(
      'quiet-race-tuning',
      JSON.stringify({ colorId: this.colorId, flagId: this.flagId, stickerId: this.stickerId }),
    );
  }

  private unlockAudio(): void {
    if (this.unlocked) return;
    this.unlocked = true;
    audio.unlock();
    audio.startMusic();
    audio.speak('Выбери машинку и поехали!', { rate: 0.95 });
  }

  private startRace(): void {
    this.unlockAudio();
    audio.speak('Едем!', { rate: 1, pitch: 1.2, minGapMs: 0 });
    audio.go();
    const themeIndex = (this.registry.get('themeIndex') as number | undefined) ?? 0;
    const theme = THEMES[themeIndex % THEMES.length] as Theme;
    this.cameras.main.fadeOut(320, 255, 255, 255);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('race', {
        seed: Math.floor(Math.random() * 1_000_000),
        theme,
        colorId: this.colorId,
        flagId: this.flagId,
        stickerId: this.stickerId,
      });
    });
  }
}
