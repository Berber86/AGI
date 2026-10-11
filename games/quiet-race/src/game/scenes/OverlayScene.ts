import Phaser from 'phaser';
import { VIEW } from '../layout';
import { audio } from '../audio';
import { buildTextures } from '../textures';
import { circleButton, text } from '../ui';

/**
 * Sits on top of every scene and owns two guardian overlays:
 * a friendly "turn the phone" hint in portrait and a pause panel that appears
 * when the game is backgrounded or when the pause button is tapped.
 */
export class OverlayScene extends Phaser.Scene {
  private portraitPanel!: Phaser.GameObjects.Container;
  private pausePanel!: Phaser.GameObjects.Container;
  private portrait = false;
  private wasPaused = false;

  constructor() {
    super('overlay');
  }

  create(): void {
    buildTextures(this);

    this.portraitPanel = this.add.container(VIEW.w / 2, VIEW.h / 2).setDepth(100);
    const portraitScrim = this.add.rectangle(0, 0, VIEW.w * 1.2, VIEW.h * 1.2, 0x25421c, 0.86);
    const phone = this.add.image(0, -60, 'rotate-phone').setScale(0.95);
    const portraitText = text(this, 0, 190, 'Поверни телефон', { size: 62, color: '#ffffff' });
    this.portraitPanel.add([portraitScrim, phone, portraitText]);
    this.tweens.add({ targets: phone, angle: { from: -8, to: 8 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.pausePanel = this.add.container(VIEW.w / 2, VIEW.h / 2).setDepth(101);
    const pauseScrim = this.add.rectangle(0, 0, VIEW.w * 1.2, VIEW.h * 1.2, 0x25421c, 0.72);
    const play = circleButton(this, 0, -40, 'btn-go', 'icon-play', {
      size: 300,
      iconScale: 0.4,
      onTap: () => {
        this.registry.set('paused', false);
      },
    });
    const pauseText = text(this, 0, 170, 'Пауза', { size: 56, color: '#ffffff' });
    this.pausePanel.add([pauseScrim, play, pauseText]);

    this.applyLayout();
    this.scale.on('resize', () => this.applyLayout());
    this.events.on(Phaser.Scenes.Events.WAKE, () => this.applyLayout());
  }

  private applyLayout(): void {
    // The logical canvas is always 1600x800, so orientation must be read from the
    // real viewport (the parent element Phaser fits the canvas into).
    const parent = this.scale.parentSize;
    const width = parent?.width || (typeof window !== 'undefined' ? window.innerWidth : this.scale.width);
    const height = parent?.height || (typeof window !== 'undefined' ? window.innerHeight : this.scale.height);
    this.portrait = height > width * 1.02;
    this.registry.set('portrait', this.portrait);
    this.portraitPanel.setVisible(this.portrait);
    this.pausePanel.setVisible(!this.portrait && this.registry.get('paused') === true);
  }

  override update(): void {
    const paused = this.registry.get('paused') === true;
    if (paused !== this.wasPaused) {
      this.wasPaused = paused;
      if (paused) {
        audio.stopEngine();
      }
    }
    this.pausePanel.setVisible(!this.portrait && paused);
    if (this.portrait) {
      this.portraitPanel.setVisible(true);
    }
  }
}
