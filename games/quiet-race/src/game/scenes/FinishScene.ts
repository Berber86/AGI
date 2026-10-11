import Phaser from 'phaser';
import { RIVAL_NAMES, THEMES, type Theme } from '../../sim/config';
import { COLORS, UI, VIEW } from '../layout';
import { audio } from '../audio';
import { bridge } from '../bridge';
import { buildTextures, heroCarKey, rivalCarKey } from '../textures';
import { circleButton, confettiBurst, iconButton, paintMeadow, paintSky, soundIconKey, text } from '../ui';

export interface FinishSceneData {
  seed: number;
  theme: Theme;
  balloons: number;
  overtakes: number;
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
    this.info = data;
    bridge.scene = 'finish';
    this.registry.set('themeIndex', (((this.registry.get('themeIndex') as number) ?? 0) + 1) % THEMES.length);

    paintSky(this);
    const sun = this.add.image(VIEW.w - 170, 140, 'sun').setScale(0.85);
    this.tweens.add({ targets: sun, scale: 0.92, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add.image(300, 150, 'cloud').setScale(0.8);
    this.add.image(620, 100, 'cloud').setScale(0.55).setAlpha(0.9);
    paintMeadow(this, 470, COLORS.grassLight);

    this.add.image(VIEW.w / 2, 470, 'banner').setScale(1.0);

    // Everyone parks at the finish line: the hero and all three friends.
    const heroX = 640;
    const hero = this.add.image(heroX, 620, heroCarKey(this, data.colorId, data.flagId, data.stickerId)).setScale(1.15);
    this.tweens.add({ targets: hero, y: 604, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    RIVAL_NAMES.forEach((_name, index) => {
      const rival = this.add.image(heroX + 230 + index * 200, 640, rivalCarKey(this, index)).setScale(1.0);
      this.tweens.add({
        targets: rival,
        y: 624,
        duration: 1000 + index * 180,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // Cup and medals go to everyone.
    const podium = this.add.rectangle(heroX - 330, 700, 320, 30, 0xf0e4cc).setOrigin(0.5);
    void podium;
    const cup = this.add.image(heroX - 330, 610, 'cup').setScale(1.05);
    this.tweens.add({ targets: cup, y: 594, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add.image(heroX - 470, 660, 'medal').setScale(0.7).setAngle(-14);
    this.add.image(heroX - 190, 665, 'medal').setScale(0.7).setAngle(12);

    text(this, VIEW.w / 2, 120, 'Ты приехала! Молодец!', { size: 62 }).setDepth(10);
    text(this, VIEW.w / 2, 182, 'Кубок и медаль — всем, кто добрался до финиша', {
      size: UI.fontSize.tiny,
      color: '#6b8f5a',
    }).setDepth(10);

    // Counters use pictures plus numbers, so nothing needs reading.
    this.add.image(180, 300, 'icon-hud-balloon').setDisplaySize(96, 96).setDepth(10);
    text(this, 250, 300, `× ${data.balloons}`, { size: 56, color: '#ffffff' }).setDepth(10);
    this.add.image(VIEW.w - 250, 300, 'star').setDisplaySize(96, 96).setDepth(10);
    text(this, VIEW.w - 175, 300, `× ${data.overtakes}`, { size: 56, color: '#ffffff' }).setDepth(10);

    circleButton(this, 560, 300, 'btn-again', 'icon-again', {
      size: 260,
      iconScale: 0.42,
      onTap: () => this.playAgain(),
    }).setDepth(12);
    circleButton(this, VIEW.w - 560, 300, 'btn-car', 'icon-car', {
      size: 260,
      iconScale: 0.42,
      onTap: () => this.toGarage(),
    }).setDepth(12);
    text(this, 560, 460, 'Ещё раз', { size: UI.fontSize.small, color: '#5a4632' }).setDepth(12);
    text(this, VIEW.w - 560, 460, 'В гараж', { size: UI.fontSize.small, color: '#5a4632' }).setDepth(12);

    this.muteButton = iconButton(this, VIEW.w - 90, 80, soundIconKey(), () => {
      audio.setMuted(!audio.muted);
      this.muteButton.removeAll(true);
      this.muteButton.add([
        this.add.circle(0, 0, UI.hudSize * 0.5, 0xffffff, 0.5).setStrokeStyle(6, 0xffffff, 0.85),
        this.add.image(0, 0, soundIconKey()).setDisplaySize(UI.hudSize * 0.5, UI.hudSize * 0.5),
      ]);
    });
    this.muteButton.setDepth(12);

    audio.finish();
    audio.speak('Ура! Ты приехала! Молодец!', { rate: 0.92, pitch: 1.25, minGapMs: 0 });
    audio.startMusic();

    confettiBurst(this, VIEW.w * 0.5, 220, 40, 900);
    this.confettiTimer = this.time.addEvent({
      delay: 1400,
      repeat: 4,
      callback: () => confettiBurst(this, Phaser.Math.Between(200, VIEW.w - 200), 160, 22, 700),
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
        seed: Math.floor(Math.random() * 1_000_000),
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
