import Phaser from 'phaser';
import { RIVAL_NAMES, THEMES, type Theme } from '../../sim/config';
import { UI, VIEW } from '../layout';
import { audio } from '../audio';
import { bridge } from '../bridge';
import { buildTextures, buildThemeTextures, heroCarKey, rivalCarKey } from '../textures';
import { circleButton, confettiBurst, iconButton, meadowBackground, skyBackground, soundIconKey, text } from '../ui';

export interface FinishSceneData {
  seed: number;
  theme: Theme;
  balloons: number;
  overtakes: number;
  boosts: number;
  ms: number | null;
  colorId: string;
  flagId: string;
  stickerId: string;
}

export class FinishScene extends Phaser.Scene {
  private info!: FinishSceneData;
  private confettiTimer?: Phaser.Time.TimerEvent;
  private muteButton!: Phaser.GameObjects.Container;

  constructor() {
    super('finish');
  }

  create(data: FinishSceneData): void {
    buildTextures(this);
    buildThemeTextures(this, data.theme);
    this.info = data;
    bridge.scene = 'finish';
    this.registry.set('themeIndex', (((this.registry.get('themeIndex') as number) ?? 0) + 1) % THEMES.length);

    skyBackground(this, data.theme);
    const sun = this.add.image(VIEW.w - 210, 150, 'sun').setScale(0.85).setDepth(1);
    this.tweens.add({ targets: sun, scale: 0.92, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add.image(330, 170, 'cloud').setScale(0.8).setDepth(1);
    this.add.image(760, 120, 'cloud').setScale(0.55).setAlpha(0.9).setDepth(1);
    meadowBackground(this, 330, data.theme);

    // Party decorations along the finish meadow.
    this.add.image(VIEW.w / 2, 330, 'bunting').setDisplaySize(1500, 216).setDepth(2);
    const trees: Array<[number, number, string, number]> = [
      [140, 420, 'candytree-pink', 0.5],
      [1480, 430, 'candytree-mint', 0.55],
      [720, 402, 'candytree-lilac', 0.42],
      [1120, 412, 'candytree-pink', 0.45],
    ];
    for (const [x, y, key, scale] of trees) {
      this.add.image(x, y, key).setOrigin(0.5, 1).setScale(scale).setDepth(3);
    }
    for (const [x, y, key] of [
      [280, 470, 'gumdrop-pink'],
      [980, 466, 'gumdrop-sun'],
      [1620, 470, 'gumdrop-mint'],
      [42, 500, 'gumdrop-sky'],
    ] as Array<[number, number, string]>) {
      this.add.image(x, y, key).setOrigin(0.5, 1).setDisplaySize(110, 94).setDepth(3).setAlpha(0.95);
    }
    // Heart balloons drift up over the party.
    for (let i = 0; i < 4; i += 1) {
      const balloon = this.add
        .image(220 + i * 380, 520 + (i % 2) * 40, 'balloon-heart')
        .setDisplaySize(96, 130)
        .setDepth(4)
        .setAlpha(0.95);
      this.tweens.add({
        targets: balloon,
        y: balloon.y - 42,
        angle: i % 2 === 0 ? 6 : -6,
        duration: 1500 + i * 220,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Everyone parks at the finish line: the hero and all three friends.
    const hero = this.add
      .image(400, 764, heroCarKey(this, data.colorId, data.flagId, data.stickerId))
      .setOrigin(0.5, 1)
      .setDisplaySize(440, 235)
      .setDepth(6);
    this.tweens.add({ targets: hero, y: 748, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    RIVAL_NAMES.forEach((_name, index) => {
      const rival = this.add
        .image(700 + index * 250, 770, rivalCarKey(this, index))
        .setOrigin(0.5, 1)
        .setDisplaySize(330, 176)
        .setDepth(5);
      this.tweens.add({
        targets: rival,
        y: 754,
        duration: 1000 + index * 180,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // The cup and the medals are for everyone who reached the flag.
    const cup = this.add.image(168, 646, 'cup').setDisplaySize(150, 172).setDepth(8);
    this.tweens.add({ targets: cup, y: 628, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add.image(74, 754, 'medal').setDisplaySize(98, 116).setAngle(-14).setDepth(8);
    this.add.image(300, 760, 'medal').setDisplaySize(98, 116).setAngle(12).setDepth(8);

    this.add.image(VIEW.w / 2, 96, 'banner').setDisplaySize(900, 180).setDepth(9);
    text(this, VIEW.w / 2, 100, 'Ты приехала! Молодец!', { size: 62 }).setDepth(10);
    text(this, VIEW.w / 2, 214, 'Кубок и медаль — всем, кто добрался до финиша', {
      size: UI.fontSize.tiny,
      color: '#ffe8f6',
    })
      .setDepth(10)
      .setStroke('#5a2f4a', 10);

    // Counters use pictures plus numbers, so nothing needs reading.
    this.add.image(148, 280, 'icon-balloon').setDisplaySize(78, 98).setDepth(10);
    text(this, 236, 280, `× ${data.balloons}`, { size: 54, color: '#ffffff' }).setDepth(10).setStroke('#5a2f4a', 10);
    this.add.image(VIEW.w - 330, 280, 'star').setDisplaySize(80, 80).setDepth(10);
    text(this, VIEW.w - 234, 280, `× ${data.overtakes}`, { size: 54, color: '#ffffff' })
      .setDepth(10)
      .setStroke('#5a2f4a', 10);

    // Both big buttons carry their own label, so the party stays tappable.
    const again = circleButton(this, 300, 470, 'btn-again', 'icon-again', {
      size: 280,
      iconScale: 0.36,
      label: 'Ещё раз',
      labelColor: '#7a5a12',
      onTap: () => this.playAgain(),
    });
    again.setDepth(12);
    const garage = circleButton(this, VIEW.w - 300, 470, 'btn-car', 'icon-car', {
      size: 280,
      iconScale: 0.36,
      label: 'В гараж',
      labelColor: '#23527a',
      onTap: () => this.toGarage(),
    });
    garage.setDepth(12);

    this.muteButton = iconButton(this, VIEW.w - 90, 80, soundIconKey(), () => {
      audio.setMuted(!audio.muted);
      this.muteButton.removeAll(true);
      this.muteButton.add([
        this.add.circle(0, 0, UI.hudSize * 0.5, 0xffffff, 0.45).setStrokeStyle(6, 0xffffff, 0.85),
        this.add.image(0, 0, soundIconKey()).setDisplaySize(UI.hudSize * 0.5, UI.hudSize * 0.5),
      ]);
    });
    this.muteButton.setDepth(12);

    audio.finish();
    audio.speak('Ура! Ты приехала! Молодец!', { rate: 0.92, pitch: 1.25, minGapMs: 0 });
    audio.startMusic();

    confettiBurst(this, VIEW.w * 0.5, 250, 40, 900);
    this.confettiTimer = this.time.addEvent({
      delay: 1400,
      repeat: 4,
      callback: () => confettiBurst(this, Phaser.Math.Between(200, VIEW.w - 200), 200, 22, 700),
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.confettiTimer?.remove();
    });
  }

  private playAgain(): void {
    audio.touch();
    audio.speak('Ещё разок!', { rate: 1, pitch: 1.25, minGapMs: 0 });
    const themeIndex = (this.registry.get('themeIndex') as number | undefined) ?? 0;
    this.cameras.main.fadeOut(280, 255, 255, 255);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('race', {
        seed: bridge.forceSeed ?? Math.floor(Math.random() * 1_000_000),
        theme: THEMES[themeIndex % THEMES.length] as Theme,
        colorId: this.info.colorId,
        flagId: this.info.flagId,
        stickerId: this.info.stickerId,
      });
    });
  }

  private toGarage(): void {
    audio.touch();
    this.cameras.main.fadeOut(280, 255, 255, 255);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start('garage');
    });
  }
}
