import Phaser from 'phaser';
import { CAR_COLORS, FLAGS, THEMES, type Theme } from '../../sim/config';
import { COLORS, UI, VIEW } from '../layout';
import { audio } from '../audio';
import { bridge } from '../bridge';
import { buildTextures, buildThemeTextures, heroCarKey } from '../textures';
import { readStore, writeStore } from '../storage';
import { circleButton, iconButton, meadowBackground, skyBackground, soundIconKey, text } from '../ui';

interface Option<T> {
  id: T;
  node: Phaser.GameObjects.Container;
}

const STICKERS = ['star', 'heart', 'flower'] as const;
const FLAG_ICON: Record<string, string> = { star: 'star', heart: 'heart', flower: 'flower' };

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
    buildThemeTextures(this, THEMES[0]);
    // Phaser destroys this scene's game objects on shutdown, so references kept
    // from a previous visit (for example after «В гараж») must be dropped.
    this.colorOptions = [];
    this.flagOptions = [];
    this.stickerOptions = [];
    this.loadTuning();
    bridge.scene = 'garage';
    bridge.tapSteer = () => undefined;

    skyBackground(this, THEMES[0]);
    const sun = this.add.image(200, 150, 'sun').setScale(0.75).setDepth(1);
    this.tweens.add({ targets: sun, angle: 360, duration: 42000, repeat: -1 });
    const cloudA = this.add.image(1180, 130, 'cloud').setScale(0.85).setAlpha(0.95).setDepth(2);
    const cloudB = this.add.image(900, 250, 'cloud').setScale(0.55).setAlpha(0.8).setDepth(2);
    this.tweens.add({ targets: cloudA, x: 1420, duration: 26000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: cloudB, x: 720, duration: 19000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add.image(1385, 356, 'castle-candy').setOrigin(0.5, 1).setScale(0.44).setDepth(2);
    this.add.image(250, 396, 'hill-candy').setOrigin(0.5, 1).setScale(0.62).setDepth(2);
    this.add.image(700, 388, 'hill-candy').setOrigin(0.5, 1).setScale(0.4).setDepth(2).setAlpha(0.9);

    meadowBackground(this, 400, THEMES[0]);

    // The car itself, seen exactly as it will be seen in the race.
    this.add.ellipse(880, 646, 620, 110, 0x3d2b1f, 0.18).setDepth(4);
    this.carPreview = this.add.image(880, 640, heroCarKey(this, this.colorId, this.flagId, this.stickerId));
    this.carPreview.setOrigin(0.5, 1).setDisplaySize(600, 320).setDepth(5);
    this.tweens.add({
      targets: this.carPreview,
      y: 622,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    text(this, 90, 74, 'Тихая гонка', { size: 62, color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setDepth(10)
      .setStroke('#5a2f4a', 12);
    text(this, 90, 138, 'Выбери машинку и нажми «Едем!»', { size: UI.fontSize.tiny, color: '#ffe8f6' })
      .setOrigin(0, 0.5)
      .setDepth(10)
      .setStroke('#5a2f4a', 8);

    // Rows of pictures: colour, flag, sticker. No reading required.
    this.buildOptionRow('color', 'Машинка', 90, CAR_COLORS.map((item) => item.id as string), 470, (id) =>
      this.setTuning({ colorId: id }),
    );
    this.buildOptionRow('flag', 'Флажок', 90, FLAGS.map((item) => item.id as string), 580, (id) =>
      this.setTuning({ flagId: id }),
    );
    this.buildOptionRow('sticker', 'Наклейка', 90, [...STICKERS], 690, (id) =>
      this.setTuning({ stickerId: id }),
    );

    circleButton(this, 1250, 270, 'btn-go', 'icon-play', {
      size: 320,
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
        this.add.circle(0, 0, UI.hudSize * 0.5, 0xffffff, 0.45).setStrokeStyle(6, 0xffffff, 0.85),
        this.add.image(0, 0, soundIconKey()).setDisplaySize(UI.hudSize * 0.5, UI.hudSize * 0.5),
      ]);
    });
    button.setDepth(12);
    return button;
  }

  private buildOptionRow(
    kind: 'color' | 'flag' | 'sticker',
    label: string,
    labelX: number,
    ids: string[],
    rowY: number,
    onPick: (id: string) => void,
  ): void {
    text(this, labelX, rowY, label, { size: UI.fontSize.small, color: '#ffffff' })
      .setOrigin(0, 0.5)
      .setDepth(10)
      .setStroke('#5a2f4a', 10);
    ids.forEach((id, index) => {
      const x = labelX + 300 + index * 112;
      const container = this.add.container(x, rowY).setDepth(10);
      const ring = this.add.circle(0, 0, 46, 0xffffff, 0.72).setStrokeStyle(8, 0xffffff, 0.9);
      container.add(ring);
      if (kind === 'color') {
        container.add(this.add.circle(0, 0, 38, this.swatchColor(id), 1));
      } else {
        container.add(
          this.add
            .image(0, 0, FLAG_ICON[id] ?? 'star')
            .setDisplaySize(62, 62)
            .setAlpha(0.95),
        );
      }
      container.setSize(96, 96);
      container.setInteractive(new Phaser.Geom.Circle(48, 48, 52), Phaser.Geom.Circle.Contains);
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
    this.carPreview.setDisplaySize(560, 300);
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
    this.registry.set('colorId', this.colorId);
    this.registry.set('flagId', this.flagId);
    this.registry.set('stickerId', this.stickerId);
    const themeIndex = (this.registry.get('themeIndex') as number | undefined) ?? 0;
    const theme = THEMES[themeIndex % THEMES.length] as Theme;
    this.cameras.main.fadeOut(320, 255, 255, 255);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('race', {
        seed: bridge.forceSeed ?? Math.floor(Math.random() * 1_000_000),
        theme,
        colorId: this.colorId,
        flagId: this.flagId,
        stickerId: this.stickerId,
      });
    });
    void COLORS;
  }
}
