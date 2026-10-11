import Phaser from 'phaser'
import { RacerChoice } from './SelectionScene'

type StickerType = { id: string, emoji: string, color: number }

const STICKERS: StickerType[] = [
  { id: 'star', emoji: '⭐', color: 0xFFD166 },
  { id: 'heart', emoji: '💖', color: 0xF4978E },
  { id: 'flower', emoji: '🌸', color: 0xFFB5E8 },
  { id: 'leaf', emoji: '🍀', color: 0xA8E6CF },
  { id: 'carrot', emoji: '🥕', color: 0xFF9F1C },
  { id: 'rainbow', emoji: '🌈', color: 0x8ECAE6 }
]

export class RaceScene extends Phaser.Scene {
  private racer!: RacerChoice
  private car!: Phaser.GameObjects.Container
  private carTargetX = 0
  private roadLeft = 0
  private roadRight = 0
  private laneCenters: number[] = []
  private roadGraphics!: Phaser.GameObjects.Graphics
  private scrollOffset = 0
  private roadSpeed = 2.5 // gentle
  private collectibles: Phaser.GameObjects.Container[] = []
  private spawnTimer = 0
  private collected: StickerType[] = []
  private stickerTexts: Map<string, number> = new Map()
  private uiText!: Phaser.GameObjects.Text
  private albumText!: Phaser.GameObjects.Text
  private houseObj: Phaser.GameObjects.Container | null = null
  private houseSpawned = false
  private isPausedByGame = false
  private confettiGroup: Phaser.GameObjects.Graphics[] = []
  private homeButton!: Phaser.GameObjects.Container
  private audioCtx: AudioContext | null = null

  constructor() {
    super('RaceScene')
  }

  init(data: { racer: RacerChoice }) {
    this.racer = data.racer || { id: 'cat', name: 'Котёнок', emoji: '🐱', carColor: 0xFFD166, carAccent: 0xFF9F1C, description: '' }
    this.collected = []
    this.collectibles = []
    this.houseObj = null
    this.houseSpawned = false
    this.scrollOffset = 0
    this.spawnTimer = 0
    this.stickerTexts.clear()
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#CDEFFD')

    // Road bounds - 70% width centered
    const roadWidth = width * 0.7
    this.roadLeft = (width - roadWidth)/2
    this.roadRight = (width + roadWidth)/2
    this.laneCenters = [
      this.roadLeft + roadWidth*0.166,
      this.roadLeft + roadWidth*0.5,
      this.roadLeft + roadWidth*0.833
    ]
    this.carTargetX = this.laneCenters[1]

    // Sky and hills
    this.add.rectangle(width/2, height*0.18, width, height*0.36, 0xCDEFFD)
    // hills
    const hills = this.add.graphics()
    hills.fillStyle(0xA8E6CF, 1)
    hills.fillEllipse(width*0.2, height*0.35, width*0.6, height*0.25)
    hills.fillStyle(0xB5EAD7, 1)
    hills.fillEllipse(width*0.75, height*0.32, width*0.5, height*0.22)

    // Road background
    this.roadGraphics = this.add.graphics()
    this.drawRoad()

    // Create car
    this.createCar()

    // Input - one thumb drag anywhere
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.unlockAudio()
      this.setCarTargetFromPointer(pointer.x)
      this.playBlip(220, 0.08, 'sine')
    })
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.setCarTargetFromPointer(pointer.x)
      }
    })

    // UI - top bar
    const uiBg = this.add.graphics()
    uiBg.fillStyle(0xFFFFFF, 0.85)
    uiBg.fillRoundedRect(16, 16, width-32, 64, 16)
    uiBg.lineStyle(2, 0xFFD6E7, 1)
    uiBg.strokeRoundedRect(16, 16, width-32, 64, 16)

    this.uiText = this.add.text(32, 28, '🌟 Наклейки: 0', {
      fontFamily: 'system-ui',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#6B4A5A'
    })

    this.albumText = this.add.text(32, 52, '', {
      fontFamily: 'system-ui',
      fontSize: '14px',
      color: '#8A6A7A'
    })

    // Home button - gentle end
    this.homeButton = this.add.container(width - 90, 48)
    const homeBg = this.add.graphics()
    homeBg.fillStyle(0xFFD6E7, 1)
    homeBg.lineStyle(2, 0xFF9F9F, 1)
    homeBg.fillRoundedRect(-70, -24, 140, 48, 24)
    homeBg.strokeRoundedRect(-70, -24, 140, 48, 24)
    this.homeButton.add(homeBg)
    const homeLabel = this.add.text(0, 0, '🏡 Домой', {
      fontFamily: 'system-ui',
      fontSize: '18px',
      color: '#6B4A5A'
    }).setOrigin(0.5)
    this.homeButton.add(homeLabel)
    this.homeButton.setSize(140, 48)
    this.homeButton.setInteractive(new Phaser.Geom.Rectangle(-70, -24, 140, 48), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        this.showAlbum(true)
      })

    // Hint
    this.add.text(width/2, height - 30, 'Тяни пальцем влево-вправо чтобы рулить 💖', {
      fontFamily: 'system-ui',
      fontSize: '16px',
      color: '#FFFFFF',
      backgroundColor: '#6B4A5A',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setAlpha(0.8)

    // Initial spawn
    this.time.delayedCall(1000, () => this.spawnSticker())

    // Test bridge
    // @ts-ignore
    window.__GAME_TEST__ = {
      isReady: () => true,
      reset: (seed?: number) => {
        if (seed !== undefined) Phaser.Math.RND.sow([seed.toString()])
        this.resetGame()
      },
      getState: () => ({
        scene: 'RaceScene',
        racer: this.racer.id,
        carX: this.car?.x,
        targetX: this.carTargetX,
        collected: this.collected.length,
        collectedIds: this.collected.map(s => s.id),
        houseSpawned: this.houseSpawned,
        scrollOffset: this.scrollOffset
      }),
      simulateInput: (action: string, payload: any) => {
        if (action === 'move') {
          const lane = payload?.lane ?? 1
          this.carTargetX = this.laneCenters[Math.max(0, Math.min(2, lane))]
        } else if (action === 'collect') {
          const st = STICKERS[payload?.index ?? 0]
          this.collectSticker(st)
        } else if (action === 'finish') {
          this.showAlbum(true)
        } else if (action === 'pointer') {
          this.setCarTargetFromPointer(payload?.x ?? this.laneCenters[1])
        }
      },
      getMetrics: () => ({
        fps: this.game.loop.actualFps,
        collectibles: this.collectibles.length
      }),
      advance: (ms: number) => {
        // for testing
        this.scrollOffset += (ms/16)*this.roadSpeed
      }
    }

    this.updateAlbumUI()
  }

  private createCar() {
    const { height } = this.scale
    const y = height * 0.75
    this.car = this.add.container(this.laneCenters[1], y)

    // shadow
    const shadow = this.add.ellipse(0, 30, 80, 20, 0x000000, 0.15)
    this.car.add(shadow)

    // car body
    const body = this.add.graphics()
    body.fillStyle(this.racer.carColor, 1)
    body.fillRoundedRect(-50, -20, 100, 44, 12)
    body.fillStyle(this.racer.carAccent, 1)
    body.fillRoundedRect(-45, -18, 90, 12, 6)
    // wheels
    body.fillStyle(0x4A3A4A, 1)
    body.fillCircle(-28, 26, 14)
    body.fillCircle(28, 26, 14)
    body.fillStyle(0xFFFFFF, 0.8)
    body.fillCircle(-28, 26, 5)
    body.fillCircle(28, 26, 5)
    this.car.add(body)

    // racer emoji
    const racerText = this.add.text(0, -32, this.racer.emoji, {
      fontSize: '40px'
    }).setOrigin(0.5)
    this.car.add(racerText)

    // gentle bob
    this.tweens.add({
      targets: this.car,
      y: y - 3,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  private setCarTargetFromPointer(x: number) {
    // clamp to road
    const clamped = Phaser.Math.Clamp(x, this.roadLeft + 40, this.roadRight - 40)
    this.carTargetX = clamped
  }

  private drawRoad() {
    const { width, height } = this.scale
    const g = this.roadGraphics
    g.clear()
    // road base
    g.fillStyle(0x6C7A89, 1)
    g.fillRect(this.roadLeft, 0, this.roadRight - this.roadLeft, height)
    // side grass
    g.fillStyle(0xB5EAD7, 1)
    g.fillRect(0, 0, this.roadLeft, height)
    g.fillRect(this.roadRight, 0, width - this.roadRight, height)
    // lane lines - scrolling dashed
    g.lineStyle(4, 0xFFFFFF, 0.8)
    const dashLen = 30
    const gap = 30
    const offset = this.scrollOffset % (dashLen + gap)
    for (let lane = 1; lane < 3; lane++) {
      const x = this.roadLeft + (this.roadRight - this.roadLeft) * (lane/3)
      for (let y = -offset; y < height; y += dashLen + gap) {
        g.beginPath()
        g.moveTo(x, y)
        g.lineTo(x, y + dashLen)
        g.strokePath()
      }
    }
    // road edges
    g.lineStyle(6, 0xFFFFFF, 1)
    g.beginPath()
    g.moveTo(this.roadLeft, 0)
    g.lineTo(this.roadLeft, height)
    g.strokePath()
    g.beginPath()
    g.moveTo(this.roadRight, 0)
    g.lineTo(this.roadRight, height)
    g.strokePath()
  }

  private spawnSticker() {
    const laneIdx = Phaser.Math.Between(0, 2)
    const x = this.laneCenters[laneIdx] + Phaser.Math.Between(-20, 20)
    const y = -60
    const sticker = STICKERS[Phaser.Math.Between(0, STICKERS.length-1)]

    const cont = this.add.container(x, y)
    const bg = this.add.graphics()
    bg.fillStyle(0xFFFFFF, 1)
    bg.lineStyle(3, sticker.color, 1)
    bg.fillCircle(0, 0, 28)
    bg.strokeCircle(0, 0, 28)
    cont.add(bg)
    const emoji = this.add.text(0, 0, sticker.emoji, { fontSize: '28px' }).setOrigin(0.5)
    cont.add(emoji)

    // @ts-ignore custom data
    cont.setData('sticker', sticker)
    // @ts-ignore
    cont.setData('lane', laneIdx)

    this.collectibles.push(cont)

    // float animation
    this.tweens.add({
      targets: cont,
      y: cont.y + 4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  private spawnHouse() {
    if (this.houseSpawned) return
    this.houseSpawned = true
    const x = this.laneCenters[1]
    const y = -120
    const cont = this.add.container(x, y)
    const bg = this.add.graphics()
    bg.fillStyle(0xFFF8E1, 1)
    bg.lineStyle(4, 0xFFD166, 1)
    bg.fillRoundedRect(-60, -50, 120, 90, 16)
    bg.strokeRoundedRect(-60, -50, 120, 90, 16)
    // roof
    bg.fillStyle(0xF4978E, 1)
    bg.fillTriangle(-70, -50, 70, -50, 0, -90)
    cont.add(bg)
    const emoji = this.add.text(0, -10, '🏡', { fontSize: '48px' }).setOrigin(0.5)
    cont.add(emoji)
    const label = this.add.text(0, 50, 'Домик!', { fontFamily: 'system-ui', fontSize: '16px', fontStyle: 'bold', color: '#6B4A5A' }).setOrigin(0.5)
    cont.add(label)

    this.houseObj = cont

    this.tweens.add({
      targets: cont,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  update(_time: number, delta: number) {
    if (this.isPausedByGame) return

    const dt = delta / 16.6 // normalize to 60fps
    this.scrollOffset += this.roadSpeed * dt
    this.drawRoad()

    // car lerp
    if (this.car) {
      const lerp = 0.12
      this.car.x = Phaser.Math.Linear(this.car.x, this.carTargetX, lerp)
      // soft return if outside road (shouldn't happen due to clamp, but extra)
      if (this.car.x < this.roadLeft + 40) {
        this.car.x = this.roadLeft + 40
        this.carTargetX = this.car.x
      }
      if (this.car.x > this.roadRight - 40) {
        this.car.x = this.roadRight - 40
        this.carTargetX = this.car.x
      }
    }

    // move collectibles
    for (let i = this.collectibles.length-1; i >=0; i--) {
      const c = this.collectibles[i]
      c.y += this.roadSpeed * dt + 0.5*dt // slightly faster than road
      // collection check
      if (this.car && Phaser.Math.Distance.Between(c.x, c.y, this.car.x, this.car.y) < 60) {
        // @ts-ignore
        const sticker: StickerType = c.getData('sticker')
        this.collectSticker(sticker)
        this.tweens.add({
          targets: c,
          scale: 1.6,
          alpha: 0,
          duration: 300,
          onComplete: () => c.destroy()
        })
        this.collectibles.splice(i,1)
        continue
      }
      if (c.y > this.scale.height + 100) {
        c.destroy()
        this.collectibles.splice(i,1)
      }
    }

    // house movement
    if (this.houseObj) {
      this.houseObj.y += this.roadSpeed * dt
      if (this.car && Phaser.Math.Distance.Between(this.houseObj.x, this.houseObj.y, this.car.x, this.car.y) < 80) {
        this.houseObj.destroy()
        this.houseObj = null
        this.showAlbum(true)
      }
      if (this.houseObj && this.houseObj.y > this.scale.height + 150) {
        this.houseObj.destroy()
        this.houseObj = null
      }
    }

    // spawn logic - every 1.2-2 sec
    this.spawnTimer += delta
    if (this.spawnTimer > Phaser.Math.Between(900, 1600)) {
      this.spawnTimer = 0
      if (this.collectibles.length < 6) this.spawnSticker()
    }

    // spawn house after 5 stickers
    if (!this.houseSpawned && this.collected.length >= 5) {
      this.spawnHouse()
    }
  }

  private collectSticker(sticker: StickerType) {
    this.collected.push(sticker)
    const count = this.stickerTexts.get(sticker.id) || 0
    this.stickerTexts.set(sticker.id, count+1)
    this.updateAlbumUI()
    this.playBlip(440 + this.collected.length*30, 0.15, 'sine')
    // small pop on car
    if (this.car) {
      this.tweens.add({
        targets: this.car,
        scale: 1.15,
        duration: 100,
        yoyo: true,
        ease: 'Back.easeOut'
      })
    }
    // floating emoji
    const float = this.add.text(this.car.x, this.car.y - 60, sticker.emoji, { fontSize: '32px' }).setOrigin(0.5)
    this.tweens.add({
      targets: float,
      y: float.y - 80,
      alpha: 0,
      scale: 1.5,
      duration: 800,
      ease: 'Quad.easeOut',
      onComplete: () => float.destroy()
    })
  }

  private updateAlbumUI() {
    const total = this.collected.length
    this.uiText.setText(`🌟 Наклейки: ${total}`)
    // build small strip
    let strip = ''
    const entries = Array.from(this.stickerTexts.entries())
    if (entries.length === 0) {
      this.albumText.setText('Собирай звёздочки на дороге!')
    } else {
      entries.forEach(([id, cnt]) => {
        const st = STICKERS.find(s => s.id === id)
        if (st) strip += `${st.emoji}×${cnt} `
      })
      this.albumText.setText(strip)
    }
  }

  private showAlbum(fromHouse = false) {
    this.isPausedByGame = true
    const { width, height } = this.scale

    const overlay = this.add.graphics()
    overlay.fillStyle(0xFFF6F9, 0.95)
    overlay.fillRect(0,0,width,height)
    overlay.setDepth(100)

    const panel = this.add.graphics()
    panel.fillStyle(0xFFFFFF, 1)
    panel.lineStyle(4, 0xFFD6E7, 1)
    const pw = Math.min(600, width*0.85)
    const ph = Math.min(500, height*0.8)
    const px = (width-pw)/2
    const py = (height-ph)/2
    panel.fillRoundedRect(px, py, pw, ph, 24)
    panel.strokeRoundedRect(px, py, pw, ph, 24)
    panel.setDepth(101)

    const title = this.add.text(width/2, py+40, fromHouse ? 'Ура! Ты доехала до домика! 🏡' : 'Твой альбом наклеек 🌸', {
      fontFamily: 'system-ui',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#6B4A5A',
      align: 'center',
      wordWrap: { width: pw-40 }
    }).setOrigin(0.5).setDepth(102)

    let y = py+90
    if (this.collected.length === 0) {
      this.add.text(width/2, y, 'Пока пусто — поедем ещё? \nТяни машинку пальцем!', {
        fontFamily: 'system-ui',
        fontSize: '18px',
        color: '#8A6A7A',
        align: 'center'
      }).setOrigin(0.5).setDepth(102)
    } else {
      // grid of stickers
      const cols = 4
      const cellW = 100
      const startX = width/2 - ((cols-1)*cellW)/2
      this.collected.forEach((st, idx) => {
        const col = idx % cols
        const row = Math.floor(idx / cols)
        const cx = startX + col*cellW
        const cy = y + row*90
        if (cy > py+ph-80) return
        const c = this.add.container(cx, cy).setDepth(102)
        const bg = this.add.graphics()
        bg.fillStyle(0xFFF0F5, 1)
        bg.lineStyle(2, st.color, 1)
        bg.fillCircle(0,0,32)
        bg.strokeCircle(0,0,32)
        c.add(bg)
        c.add(this.add.text(0,0,st.emoji,{fontSize:'28px'}).setOrigin(0.5))
      })
    }

    // buttons
    const btnContinue = this.createButton(width/2 - 110, py+ph-50, '🚗 Ещё круг', 0xA8E6CF, () => {
      overlay.destroy(); panel.destroy(); title.destroy()
      // @ts-ignore
      this.children.list.filter((o: any) => (o.depth ?? 0) >= 102).forEach((o: any) => o.destroy())
      this.isPausedByGame = false
      this.confettiGroup.forEach(g => g.destroy())
      this.confettiGroup = []
      // reset house
      this.houseSpawned = false
      this.houseObj = null
    })

    const btnRestart = this.createButton(width/2 + 110, py+ph-50, '🔄 Заново', 0xFFD6E7, () => {
      this.scene.start('SelectionScene')
    })

    // confetti
    this.spawnConfetti()

    this.playBlip(600, 0.3, 'triangle')
    this.time.delayedCall(150, () => this.playBlip(800, 0.3, 'sine'))
  }

  private createButton(x: number, y: number, label: string, color: number, onClick: () => void) {
    const cont = this.add.container(x, y).setDepth(102)
    const bg = this.add.graphics()
    bg.fillStyle(color, 1)
    bg.lineStyle(2, 0x6B4A5A, 0.2)
    bg.fillRoundedRect(-90, -22, 180, 44, 22)
    cont.add(bg)
    cont.add(this.add.text(0,0,label,{fontFamily:'system-ui', fontSize:'16px', fontStyle:'bold', color:'#6B4A5A'}).setOrigin(0.5))
    cont.setSize(180,44)
    cont.setInteractive(new Phaser.Geom.Rectangle(-90,-22,180,44), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => {
        this.tweens.add({ targets: cont, scale: 0.95, duration: 80, yoyo:true, onComplete: onClick })
      })
    return cont
  }

  private spawnConfetti() {
    const { width, height } = this.scale
    for (let i=0;i<30;i++) {
      const g = this.add.graphics().setDepth(103)
      const x = Phaser.Math.Between(0, width)
      const y = Phaser.Math.Between(-100, -10)
      const col = Phaser.Utils.Array.GetRandom([0xFFD166, 0xF4978E, 0xA8E6CF, 0xFFB5E8, 0x8ECAE6])
      g.fillStyle(col, 1)
      g.fillCircle(0,0, Phaser.Math.Between(4,8))
      g.x = x; g.y = y
      this.confettiGroup.push(g)
      this.tweens.add({
        targets: g,
        y: height + 100,
        x: x + Phaser.Math.Between(-100,100),
        rotation: Phaser.Math.Between(0, 6),
        duration: Phaser.Math.Between(1500, 3000),
        delay: i*40,
        ease: 'Quad.easeIn'
      })
    }
  }

  private unlockAudio() {
    if (!this.audioCtx) {
      try {
        // @ts-ignore
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch {}
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  private playBlip(freq: number, dur: number, type: OscillatorType) {
    if (!this.audioCtx) return
    try {
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()
      osc.type = type
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + dur)
      osc.connect(gain).connect(this.audioCtx.destination)
      osc.start()
      osc.stop(this.audioCtx.currentTime + dur)
    } catch {}
  }

  private resetGame() {
    this.collected = []
    this.stickerTexts.clear()
    this.collectibles.forEach(c => c.destroy())
    this.collectibles = []
    if (this.houseObj) { this.houseObj.destroy(); this.houseObj=null }
    this.houseSpawned = false
    this.scrollOffset = 0
    this.spawnTimer = 0
    this.updateAlbumUI()
    this.isPausedByGame = false
  }
}
