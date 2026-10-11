import Phaser from 'phaser';
import { CFG, PALETTES, type Theme } from '../sim/config';
import type { RaceState } from '../sim/race';
import type { Track } from '../sim/track';
import { VIEW } from '../render/road3d';
import { soundIconKey, text } from './ui';

export interface HudCallbacks {
  onPause: () => void;
  onMute: () => void;
  onBoost: () => void;
}

const INK = '#5a4632';

function plate(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  radius = 26,
  alpha = 0.68,
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(0x2b2340, 0.22);
  g.fillRoundedRect(x + 5, y + 7, w, h, radius);
  g.fillStyle(0xfffdf8, alpha);
  g.fillRoundedRect(x, y, w, h, radius);
  g.lineStyle(6, 0xffffff, 0.9);
  g.strokeRoundedRect(x, y, w, h, radius);
  return g;
}

/**
 * The race HUD, laid out like the reference picture: track plate and track map
 * top-left, clock and lap counter top-right, the driver with her speed
 * bottom-left and the cupcake boost meter bottom-right.
 */
export class RaceHud {
  private track: Track;

  private clockText!: Phaser.GameObjects.Text;
  private lapText!: Phaser.GameObjects.Text;
  private speedText!: Phaser.GameObjects.Text;
  private detail!: Phaser.GameObjects.Graphics;
  private minimapDots!: Phaser.GameObjects.Graphics;
  private cupcake!: Phaser.GameObjects.Image;
  private depth = 100000;
  private mapBox = { x: 34, y: 122, w: 300, h: 232 };
  private boostBox = { x: 1250, y: 592, w: 330, h: 180 };
  private driverBox = { x: 20, y: 592, w: 330, h: 180 };

  constructor(scene: Phaser.Scene, theme: Theme, track: Track, callbacks: HudCallbacks) {
    this.track = track;
    const palette = PALETTES[theme];

    // ---- top left: the name of the candy land plus the track map ----
    plate(scene, 28, 24, 448, 78).setDepth(this.depth);
    text(scene, 52, 63, palette.name, { size: 38, color: INK })
      .setOrigin(0, 0.5)
      .setDepth(this.depth + 1);

    plate(scene, this.mapBox.x - 6, this.mapBox.y - 6, this.mapBox.w + 12, this.mapBox.h + 12, 30, 0.6).setDepth(
      this.depth,
    );
    const minimap = scene.add.graphics().setDepth(this.depth + 1);
    this.drawMinimapPath(minimap);
    this.minimapDots = scene.add.graphics().setDepth(this.depth + 2);

    // ---- top right: clock and laps ----
    plate(scene, VIEW.w - 28 - 320, 24, 320, 78).setDepth(this.depth);
    scene.add.image(VIEW.w - 28 - 320 + 46, 63, 'clock').setDisplaySize(56, 56).setDepth(this.depth + 1);
    this.clockText = text(scene, VIEW.w - 28 - 160, 64, '00:00:00', { size: 44, color: INK }).setDepth(this.depth + 1);

    plate(scene, VIEW.w - 28 - 320, 118, 320, 78).setDepth(this.depth);
    this.lapText = text(scene, VIEW.w - 28 - 160, 158, 'Круг 1/3', { size: 40, color: INK }).setDepth(this.depth + 1);

    // ---- bottom left: the driver and her speed ----
    plate(scene, this.driverBox.x, this.driverBox.y, this.driverBox.w, this.driverBox.h, 30, 0.6).setDepth(this.depth);
    scene.add.image(98, 654, 'avatar').setDisplaySize(112, 112).setDepth(this.depth + 1);
    const ring = scene.add.graphics().setDepth(this.depth + 2);
    ring.lineStyle(9, 0xffffff, 0.95);
    ring.strokeCircle(98, 654, 58);
    text(scene, 98, 730, 'Лиля', { size: 30, color: INK }).setDepth(this.depth + 2);
    this.speedText = text(scene, 336, 640, '0 км/ч', { size: 40, color: INK })
      .setOrigin(1, 0.5)
      .setDepth(this.depth + 1);
    this.detail = scene.add.graphics().setDepth(this.depth + 1);

    // ---- bottom right: the cupcake boost meter ----
    plate(scene, this.boostBox.x, this.boostBox.y, this.boostBox.w, this.boostBox.h, 30, 0.6).setDepth(this.depth);
    text(scene, this.boostBox.x + 165, 622, 'КЕКС-УСКОРЕНИЕ', { size: 24, color: INK }).setDepth(this.depth + 1);
    this.cupcake = scene.add
      .image(this.boostBox.x + 165, 706, 'cupcake')
      .setDisplaySize(112, 122)
      .setDepth(this.depth + 2)
      .setInteractive({ useHandCursor: true });
    this.cupcake.on('pointerdown', () => callbacks.onBoost());

    // ---- top centre: pause and sound ----
    const iconButton = (x: number, key: () => string, onTap: () => void) => {
      scene.add.circle(x, 62, 38, 0xfffdf8, 0.6).setDepth(this.depth).setStrokeStyle(6, 0xffffff, 0.85);
      scene.add.image(x, 62, key()).setDisplaySize(42, 42).setDepth(this.depth + 1);
      const zone = scene.add.zone(x, 62, 100, 100).setDepth(this.depth + 2).setInteractive();
      zone.on('pointerdown', () => onTap());
    };
    iconButton(752, () => 'icon-pause', callbacks.onPause);
    iconButton(862, () => soundIconKey(), callbacks.onMute);

    this.update(undefined);
  }

  private drawMinimapPath(g: Phaser.GameObjects.Graphics): void {
    const box = this.mapBox;
    const path = this.track.mapPath;
    const trace = () => {
      g.beginPath();
      path.forEach((point, index) => {
        const x = box.x + 34 + point.x * (box.w - 68);
        const y = box.y + 34 + point.y * (box.h - 68);
        if (index === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      });
      g.closePath();
    };
    g.lineStyle(24, 0xffffff, 0.95);
    trace();
    g.strokePath();
    g.lineStyle(14, 0xff9ec4, 0.95);
    trace();
    g.strokePath();
  }

  private mapPoint(progress: number): { x: number; y: number } {
    const box = this.mapBox;
    const path = this.track.mapPath;
    const phase = (((progress % CFG.raceLength) + CFG.raceLength) % CFG.raceLength) / CFG.raceLength;
    const index = Math.floor(phase * path.length) % path.length;
    const point = path[index];
    return {
      x: box.x + 34 + point.x * (box.w - 68),
      y: box.y + 34 + point.y * (box.h - 68),
    };
  }

  update(state: RaceState | undefined): void {
    if (!state) return;

    const totalSeconds = state.elapsedMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const hundredths = Math.floor((totalSeconds * 100) % 100);
    this.clockText.setText(
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(hundredths).padStart(2, '0')}`,
    );
    this.lapText.setText(`Круг ${state.lap}/${CFG.lapCount}`);

    const kmh = Math.round(state.speed * 1.2);
    this.speedText.setText(`${kmh} км/ч`);

    this.detail.clear();
    // Speed bar under the driver.
    this.detail.fillStyle(0x2b2340, 0.28);
    this.detail.fillRoundedRect(186, 678, 152, 22, 11);
    this.detail.fillStyle(0x7ed957, 1);
    this.detail.fillRoundedRect(186, 678, Math.max(14, 152 * Phaser.Math.Clamp(kmh / 160, 0, 1)), 22, 11);
    // Cupcake meter: four cells that fill up with balloons.
    const cellW = 56;
    const cellH = 26;
    const startX = this.boostBox.x + 24;
    for (let i = 0; i < CFG.boostChargeMax; i += 1) {
      const x = startX + i * (cellW + 8);
      const filled = i < state.boostCharges;
      this.detail.fillStyle(filled ? 0xffc93c : 0x9b8fb0, 1);
      this.detail.fillRoundedRect(x, 642, cellW, cellH, 12);
      this.detail.lineStyle(4, 0xffffff, filled ? 0.95 : 0.5);
      this.detail.strokeRoundedRect(x, 642, cellW, cellH, 12);
      if (filled) {
        this.detail.fillStyle(0xfff3c4, 1);
        this.detail.fillCircle(x + cellW * 0.5, 655, 5);
      }
    }

    const ready = state.boostCharges >= CFG.boostChargeMax;
    const pulse = ready ? 1 + Math.sin(performance.now() / 150) * 0.08 : 1;
    this.cupcake.setDisplaySize(112 * pulse, 122 * pulse);
    this.cupcake.setAlpha(ready ? 1 : 0.55);

    this.minimapDots.clear();
    for (const rival of state.rivals) {
      const point = this.mapPoint(rival.progress);
      this.minimapDots.fillStyle(0x62b0e8, 1);
      this.minimapDots.fillCircle(point.x, point.y, 8);
    }
    const hero = this.mapPoint(state.progress);
    this.minimapDots.fillStyle(0xffffff, 1);
    this.minimapDots.fillCircle(hero.x, hero.y, 15);
    this.minimapDots.fillStyle(0xff5f9e, 1);
    this.minimapDots.fillCircle(hero.x, hero.y, 10);
  }
}
