import Phaser from 'phaser'

export interface RacerChoice {
  id: string
  name: string
  emoji: string
  carColor: number
  carAccent: number
  description: string
}

export const RACERS: RacerChoice[] = [
  { id: 'cat', name: 'Котёнок Пух', emoji: '🐱', carColor: 0xFFD166, carAccent: 0xFF9F1C, description: 'Любит мурчать и собирать звёздочки' },
  { id: 'bunny', name: 'Зайка Прыг', emoji: '🐰', carColor: 0xA8DADC, carAccent: 0x457B9D, description: 'Обожает морковные наклейки' },
  { id: 'fox', name: 'Лисёнок Рыжик', emoji: '🦊', carColor: 0xF4978E, carAccent: 0xF08080, description: 'Собирает листики и сердечки' }
]

export class SelectionScene extends Phaser.Scene {
  constructor() {
    super('SelectionScene')
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#FFF6F9')

    // Title
    this.add.text(width/2, height*0.12, 'ДРУЖНЫЕ ГОНКИ', {
      fontFamily: 'system-ui',
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#6B4A5A',
      align: 'center'
    }).setOrigin(0.5)

    this.add.text(width/2, height*0.20, 'Выбери своего друга для прогулки', {
      fontFamily: 'system-ui',
      fontSize: '22px',
      color: '#8A6A7A',
      align: 'center'
    }).setOrigin(0.5)

    // Racer cards
    const cardWidth = 300
    const cardHeight = 380
    const gap = 40
    const totalW = RACERS.length * cardWidth + (RACERS.length-1)*gap
    const startX = (width - totalW)/2

    RACERS.forEach((racer, i) => {
      const x = startX + i*(cardWidth+gap) + cardWidth/2
      const y = height*0.55

      const container = this.add.container(x, y)

      const bg = this.add.graphics()
      bg.fillStyle(0xFFFFFF, 1)
      bg.lineStyle(4, racer.carAccent, 1)
      bg.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 24)
      bg.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 24)
      container.add(bg)

      // Car preview
      const carG = this.add.graphics()
      carG.fillStyle(racer.carColor, 1)
      carG.fillRoundedRect(-80, -20, 160, 60, 16)
      carG.fillStyle(0x5A3A4A, 1)
      carG.fillCircle(-40, 45, 18)
      carG.fillCircle(40, 45, 18)
      carG.fillStyle(racer.carAccent, 1)
      carG.fillCircle(-40, 45, 8)
      carG.fillCircle(40, 45, 8)
      container.add(carG)

      const emoji = this.add.text(0, -90, racer.emoji, {
        fontSize: '72px'
      }).setOrigin(0.5)
      container.add(emoji)

      const name = this.add.text(0, 90, racer.name, {
        fontFamily: 'system-ui',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#6B4A5A'
      }).setOrigin(0.5)
      container.add(name)

      const desc = this.add.text(0, 125, racer.description, {
        fontFamily: 'system-ui',
        fontSize: '14px',
        color: '#8A6A7A',
        align: 'center',
        wordWrap: { width: 260 }
      }).setOrigin(0.5)
      container.add(desc)

      // Make interactive
      const hitArea = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x000000, 0).setInteractive({ useHandCursor: true })
      container.add(hitArea)

      // Hover/touch feedback
      hitArea.on('pointerover', () => {
        this.tweens.add({ targets: container, scale: 1.05, duration: 150, ease: 'Back.easeOut' })
        bg.clear()
        bg.fillStyle(0xFFF0F5, 1)
        bg.lineStyle(6, racer.carAccent, 1)
        bg.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 24)
        bg.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 24)
      })
      hitArea.on('pointerout', () => {
        this.tweens.add({ targets: container, scale: 1, duration: 150 })
        bg.clear()
        bg.fillStyle(0xFFFFFF, 1)
        bg.lineStyle(4, racer.carAccent, 1)
        bg.fillRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 24)
        bg.strokeRoundedRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 24)
      })
      hitArea.on('pointerdown', () => {
        this.cameras.main.flash(300, 255, 214, 231)
        this.soundUnlock()
        this.time.delayedCall(200, () => {
          this.scene.start('RaceScene', { racer })
        })
      })

      // Subtle idle bob
      this.tweens.add({
        targets: container,
        y: y - 6,
        duration: 1200 + i*200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })

    // Bottom hint
    this.add.text(width/2, height*0.88, 'Тапни на карточку — поедем! 🌸', {
      fontFamily: 'system-ui',
      fontSize: '18px',
      color: '#B0899A'
    }).setOrigin(0.5)

    // Test bridge
    // @ts-ignore
    window.__GAME_TEST__ = {
      isReady: () => true,
      reset: () => this.scene.restart(),
      getState: () => ({ scene: 'SelectionScene', racers: RACERS.length }),
      simulateInput: (action: string, payload: any) => {
        if (action === 'select') {
          const idx = payload?.index ?? 0
          this.scene.start('RaceScene', { racer: RACERS[idx] })
        }
      }
    }
  }

  private soundUnlock() {
    try {
      // @ts-ignore - unlock WebAudio after gesture
      if (this.sound.context && this.sound.context.state === 'suspended') {
        // @ts-ignore
        this.sound.context.resume()
      }
    } catch {}
  }
}
