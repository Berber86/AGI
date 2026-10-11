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

const DECOR_EMOJIS = ['🧸','🧱','🎲','🪀','🧩','🌳']

interface SegmentPoint {
  world: { x: number, y: number, z: number }
  camera: { x: number, y: number, z: number }
  screen: { x: number, y: number, w: number, scale: number }
}

interface RoadSegment {
  index: number
  p1: SegmentPoint
  p2: SegmentPoint
  curve: number
  color: number
  sprites: { type: 'sticker' | 'decor' | 'house', x: number, sticker?: StickerType, emoji?: string, collected?: boolean }[]
  _screen?: { p1: any, p2: any, x: number, maxY: number }
}

export class RaceScene extends Phaser.Scene {
  private racer!: RacerChoice
  private roadWidth = 2000
  private segmentLength = 200
  private rumbleLength = 3
  private trackLength = 0
  private segments: RoadSegment[] = []
  private cameraDepth = 0
  private cameraHeight = 1000
  private drawDistance = 300
  private baseSegment = 0
  private position = 0 // camera Z
  private speed = 0
  private maxSpeed = 200 // world units per frame
  private carX = 0 // -1 to 1
  private carTargetX = 0
  private carVelocity = 0
  private collected: StickerType[] = []
  private stickerMap: Map<string, number> = new Map()
  private uiText!: Phaser.GameObjects.Text
  private albumText!: Phaser.GameObjects.Text
  private graphics!: Phaser.GameObjects.Graphics
  private carContainer!: Phaser.GameObjects.Container
  private homeButton!: Phaser.GameObjects.Container
  private confettiGroup: Phaser.GameObjects.Graphics[] = []
  private isPausedByGame = false
  private audioCtx: AudioContext | null = null
  private totalCollected = 0
  private houseSpawned = false

  constructor() {
    super('RaceScene')
  }

  init(data: { racer: RacerChoice }) {
    this.racer = data.racer || { id: 'cat', name: 'Котёнок', emoji: '🐱', carColor: 0xFFD166, carAccent: 0xFF9F1C, description: '' }
    this.collected = []
    this.stickerMap.clear()
    this.position = 0
    this.carX = 0
    this.carTargetX = 0
    this.carVelocity = 0
    this.totalCollected = 0
    this.houseSpawned = false
  }

  create() {
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#87CEEB')
    this.cameraDepth = 1 / Math.tan((90/2) * Math.PI/180)

    this.buildTrack()
    this.graphics = this.add.graphics()

    // car at bottom
    this.createCar()

    // UI
    const uiBg = this.add.graphics()
    uiBg.fillStyle(0xFFFFFF, 0.9)
    uiBg.fillRoundedRect(12, 12, width-24, 64, 16)
    uiBg.lineStyle(2, 0xFFD6E7, 1)
    uiBg.strokeRoundedRect(12, 12, width-24, 64, 16)

    this.uiText = this.add.text(24, 22, '🌟 0', {
      fontFamily: 'system-ui',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#6B4A5A'
    })
    this.albumText = this.add.text(24, 46, 'Тяни влево-вправо — дрифт без наказания! 💖', {
      fontFamily: 'system-ui',
      fontSize: '13px',
      color: '#8A6A7A'
    })

    this.homeButton = this.add.container(width - 80, 44)
    const hb = this.add.graphics()
    hb.fillStyle(0xFFD6E7, 1)
    hb.lineStyle(2, 0xFF9F9F, 1)
    hb.fillRoundedRect(-60, -20, 120, 40, 20)
    hb.strokeRoundedRect(-60, -20, 120, 40, 20)
    this.homeButton.add(hb)
    this.homeButton.add(this.add.text(0,0,'🏡 Домой',{fontFamily:'system-ui',fontSize:'16px',color:'#6B4A5A'}).setOrigin(0.5))
    this.homeButton.setSize(120,40)
    this.homeButton.setInteractive(new Phaser.Geom.Rectangle(-60,-20,120,40), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => this.showAlbum(true))

    // Input - drag anywhere
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.unlockAudio()
      this.setTargetFromPointer(p.x)
      this.playBlip(220, 0.08, 'sine')
    })
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.isDown) this.setTargetFromPointer(p.x)
    })

    // hint
    this.add.text(width/2, height-24, 'Дорога сама поворачивает — подруливай! Игрушечный мир вокруг 🎲', {
      fontFamily: 'system-ui',
      fontSize: '14px',
      color: '#FFFFFF',
      backgroundColor: '#6B4A5A',
      padding: {x:8, y:4}
    }).setOrigin(0.5).setAlpha(0.85)

    // test bridge
    // @ts-ignore
    window.__GAME_TEST__ = {
      isReady: () => true,
      reset: (seed?: number) => {
        if (seed !== undefined) Phaser.Math.RND.sow([seed.toString()])
        this.resetGame()
      },
      getState: () => ({
        scene: 'RaceScene_pseudo3D',
        racer: this.racer.id,
        position: this.position,
        carX: this.carX,
        collected: this.collected.length,
        speed: this.speed,
        baseSegment: this.baseSegment
      }),
      simulateInput: (action: string, payload: any) => {
        if (action === 'move') {
          const nx = payload?.x ?? 0
          this.carTargetX = Phaser.Math.Clamp(nx, -1, 1)
        } else if (action === 'collect') {
          const st = STICKERS[payload?.index ?? 0]
          this.collectSticker(st)
        } else if (action === 'finish') {
          this.showAlbum(true)
        } else if (action === 'pointer') {
          this.setTargetFromPointer(payload?.x ?? this.scale.width/2)
        }
      }
    }

    this.updateAlbumUI()
    this.speed = this.maxSpeed * 0.6 // gentle auto-drive
  }

  private buildTrack() {
    this.segments = []
    const totalSegments = 800

    // helper to add segment
    const addSegment = (curve: number, y: number) => {
      const n = this.segments.length
      const seg: RoadSegment = {
        index: n,
        p1: {
          world: { x: 0, y: y, z: n * this.segmentLength },
          camera: { x: 0, y: 0, z: 0 },
          screen: { x: 0, y: 0, w: 0, scale: 0 }
        },
        p2: {
          world: { x: 0, y: y, z: (n+1) * this.segmentLength },
          camera: { x: 0, y: 0, z: 0 },
          screen: { x: 0, y: 0, w: 0, scale: 0 }
        },
        curve: curve,
        color: Math.floor(n/this.rumbleLength) % 2 === 0 ? 0x6C7A89 : 0x7A8A99,
        sprites: []
      }
      this.segments.push(seg)
    }

    // Build interesting track: straight, left curve, straight, right, s-curves, etc.
    const trackDef: { count: number, curve: number, y: number }[] = [
      { count: 100, curve: 0, y: 0 },
      { count: 80, curve: -1.2, y: 0 }, // gentle left
      { count: 60, curve: 0, y: 0 },
      { count: 80, curve: 1.5, y: 0 }, // right
      { count: 80, curve: 0, y: 0 },
      { count: 100, curve: -2.0, y: 0 }, // sharper left
      { count: 60, curve: 2.0, y: 0 }, // s-curve
      { count: 100, curve: 0, y: 0 },
      { count: 70, curve: 1.0, y: 200 }, // small hill + curve
      { count: 70, curve: -1.0, y: -100 },
    ]

    let built = 0
    while (built < totalSegments) {
      for (const part of trackDef) {
        for (let i=0;i<part.count && built < totalSegments;i++) {
          // add slight hill variation
          const hill = Math.sin(built*0.05)*150
          addSegment(part.curve, part.y + hill)
          built++
        }
      }
    }

    this.trackLength = totalSegments * this.segmentLength

    // Add sprites: stickers and decor along track
    for (let i=20; i<totalSegments; i+= 12) {
      const seg = this.segments[i]
      if (Phaser.Math.Between(0,100) < 65) {
        // sticker
        const sticker = Phaser.Utils.Array.GetRandom(STICKERS)
        seg.sprites.push({
          type: 'sticker',
          x: Phaser.Math.FloatBetween(-0.8, 0.8), // -1 to 1 road width
          sticker: sticker
        })
      }
      // decor on sides - toy table theme
      if (i % 8 === 0) {
        const side = Phaser.Math.Between(0,1) === 0 ? -1 : 1
        seg.sprites.push({
          type: 'decor',
          x: side * Phaser.Math.FloatBetween(1.2, 2.2),
          emoji: Phaser.Utils.Array.GetRandom(DECOR_EMOJIS)
        })
      }
      if (i % 20 === 0) {
        // extra decor both sides
        seg.sprites.push({ type: 'decor', x: -1.8, emoji: '🧸' })
        seg.sprites.push({ type: 'decor', x: 1.8, emoji: '🧱' })
      }
    }

    // House near end
    const houseIdx = totalSegments - 30
    this.segments[houseIdx].sprites.push({ type: 'house', x: 0 })
  }

  private createCar() {
    const { width, height } = this.scale
    const y = height - 90
    this.carContainer = this.add.container(width/2, y)

    const shadow = this.add.ellipse(0, 28, 90, 18, 0x000000, 0.18)
    this.carContainer.add(shadow)

    const body = this.add.graphics()
    body.fillStyle(this.racer.carColor, 1)
    body.fillRoundedRect(-55, -22, 110, 48, 14)
    body.fillStyle(this.racer.carAccent, 1)
    body.fillRoundedRect(-50, -18, 100, 14, 7)
    // windshield
    body.fillStyle(0xCDEFFD, 0.9)
    body.fillRoundedRect(-30, -8, 60, 18, 6)
    // wheels
    body.fillStyle(0x4A3A4A, 1)
    body.fillCircle(-32, 28, 14)
    body.fillCircle(32, 28, 14)
    body.fillStyle(0xFFFFFF, 0.9)
    body.fillCircle(-32, 28, 5)
    body.fillCircle(32, 28, 5)
    this.carContainer.add(body)

    const racer = this.add.text(0, -34, this.racer.emoji, { fontSize: '42px' }).setOrigin(0.5)
    this.carContainer.add(racer)

    // drift smoke placeholder
    this.tweens.add({
      targets: this.carContainer,
      y: y-2,
      duration: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  private setTargetFromPointer(x: number) {
    const { width } = this.scale
    // map screen X to -1..1
    const normalized = (x - width/2) / (width/2) // -1 to 1
    this.carTargetX = Phaser.Math.Clamp(normalized * 1.2, -1, 1)
  }

  private project(p: SegmentPoint, cameraX: number, cameraY: number, cameraZ: number) {
    p.camera.x = p.world.x - cameraX
    p.camera.y = p.world.y - cameraY
    p.camera.z = p.world.z - cameraZ
    if (p.camera.z <= 0.1) p.camera.z = 0.1
    p.screen.scale = this.cameraDepth / p.camera.z
    p.screen.x = (1 + p.screen.scale * p.camera.x) * this.scale.width / 2
    p.screen.y = (1 - p.screen.scale * p.camera.y) * this.scale.height / 2
    p.screen.w = p.screen.scale * this.roadWidth * this.scale.width / 2
  }

  update(_time: number, delta: number) {
    if (this.isPausedByGame) return
    const dt = delta / 16.6

    // update position
    this.position += this.speed * dt
    if (this.position >= this.trackLength) this.position -= this.trackLength
    if (this.position < 0) this.position += this.trackLength

    this.baseSegment = Math.floor(this.position / this.segmentLength) % this.segments.length

    // car physics - drift free
    const diff = this.carTargetX - this.carX
    this.carVelocity += diff * 0.08 * dt // accelerate to target
    this.carVelocity *= 0.92 // friction - soft return
    // add curve influence - road pushes car a bit
    const currentCurve = this.segments[this.baseSegment]?.curve || 0
    this.carVelocity -= currentCurve * 0.02 * dt * (this.speed / this.maxSpeed)

    this.carX += this.carVelocity * dt
    // clamp to road + soft bounce
    if (this.carX < -1.1) {
      this.carX = -1.1
      this.carVelocity *= -0.3 // bounce back gently
      this.playBlip(180, 0.1, 'sine')
    }
    if (this.carX > 1.1) {
      this.carX = 1.1
      this.carVelocity *= -0.3
      this.playBlip(180, 0.1, 'sine')
    }

    // update car sprite position - car stays centered but leans with curve and drift
    const { width } = this.scale
    const carScreenX = width/2 + this.carX * width * 0.22
    if (this.carContainer) {
      this.carContainer.x = Phaser.Math.Linear(this.carContainer.x, carScreenX, 0.25)
      // lean with drift
      this.carContainer.rotation = Phaser.Math.Clamp(this.carVelocity * 0.3 + currentCurve*0.05, -0.25, 0.25)
    }

    // render pseudo-3D road
    this.renderRoad()

    // check collisions with sprites in nearby segments
    this.checkSprites()
  }

  private renderRoad() {
    const { width, height } = this.scale
    this.graphics.clear()

    // sky - gradient via rect
    this.graphics.fillStyle(0x87CEEB, 1)
    this.graphics.fillRect(0, 0, width, height*0.45)
    // sun
    this.graphics.fillStyle(0xFFE4A3, 1)
    this.graphics.fillCircle(width*0.8, height*0.15, 50)

    // table surface behind - toy table theme
    this.graphics.fillStyle(0xF5E6CC, 1) // wooden table color
    this.graphics.fillRect(0, height*0.45, width, height*0.55)

    let maxY = height
    let basePercent = this.position % this.segmentLength / this.segmentLength
    let x = 0
    let dx = 0

    // draw from far to near
    for (let n=0; n<this.drawDistance; n++) {
      const currIndex = (this.baseSegment + n) % this.segments.length
      const curr = this.segments[currIndex]

      // offset for curve
      const nextIndex = (currIndex + 1) % this.segments.length
      const next = this.segments[nextIndex]

      // accumulate curve
      x += dx
      dx += curr.curve

      curr.p1.world.x = x
      curr.p2.world.x = x + dx
      // y already set

      // camera
      const cameraX = this.carX * this.roadWidth * 0.3 + x
      const cameraY = curr.p1.world.y + this.cameraHeight
      const cameraZ = this.position

      this.project(curr.p1, cameraX, cameraY, cameraZ)
      this.project(curr.p2, cameraX, cameraY, cameraZ)

      // skip if behind or clipped
      if (curr.p1.camera.z <= this.cameraDepth || curr.p2.screen.y >= maxY) continue
      if (curr.p2.screen.y >= curr.p1.screen.y) continue

      // clip
      if (curr.p1.screen.y > maxY) continue
      maxY = curr.p1.screen.y

      // draw segment - grass, rumble, road
      const p1 = curr.p1.screen
      const p2 = curr.p2.screen

      // grass
      this.graphics.fillStyle(n % 2 === 0 ? 0xA8E6CF : 0xB5EAD7, 1)
      this.graphics.fillRect(0, p2.y, width, p1.y - p2.y)

      // rumble
      this.drawPolygon(p1.x - p1.w*1.15, p1.y, p1.x - p1.w, p1.y, p2.x - p2.w, p2.y, p2.x - p2.w*1.15, p2.y, curr.color === 0x6C7A89 ? 0xFFFFFF : 0xFF6B6B)
      this.drawPolygon(p1.x + p1.w, p1.y, p1.x + p1.w*1.15, p1.y, p2.x + p2.w*1.15, p2.y, p2.x + p2.w, p2.y, curr.color === 0x6C7A89 ? 0xFFFFFF : 0xFF6B6B)

      // road
      this.drawPolygon(p1.x - p1.w, p1.y, p1.x + p1.w, p1.y, p2.x + p2.w, p2.y, p2.x - p2.w, p2.y, curr.color)

      // lane markers - dashed center
      if (n % 4 === 0) {
        this.drawPolygon(p1.x - 4, p1.y, p1.x + 4, p1.y, p2.x + 4, p2.y, p2.x -4, p2.y, 0xFFFFFF)
      }

      // store for sprite rendering later
      // @ts-ignore
      curr._screen = { p1, p2, x, maxY }
    }

    // render sprites (stickers, decor, house) from far to near
    for (let n=this.drawDistance-1; n>=0; n--) {
      const currIndex = (this.baseSegment + n) % this.segments.length
      const seg = this.segments[currIndex]
      // @ts-ignore
      if (!seg._screen) continue
      const p1 = seg._screen.p1 as any
      const p2 = seg._screen.p2 as any
      if (p1.y > this.scale.height) continue

      for (const spr of seg.sprites) {
        if (spr.collected) continue
        // project sprite
        const spriteScale = p1.scale
        if (spriteScale < 0.01) continue
        const spriteX = p1.x + spriteScale * spr.x * this.roadWidth * this.scale.width / 2 * 0.5
        const spriteY = p1.y

        // cull behind
        if (spriteY > this.scale.height || spriteY < 0) continue

        // draw
        if (spr.type === 'sticker' && spr.sticker) {
          // draw as circle with emoji
          const size = Math.max(12, 28 * spriteScale * 3)
          this.graphics.fillStyle(0xFFFFFF, 1)
          this.graphics.lineStyle(2, spr.sticker.color, 1)
          this.graphics.fillCircle(spriteX, spriteY, size)
          this.graphics.strokeCircle(spriteX, spriteY, size)
          // we can't draw emoji with graphics, use text object pool? For simplicity draw via graphics and handle collection via distance check, emoji will be drawn via separate text? We'll use a trick: add temporary text for visible stickers near camera
          if (n < 40) {
            // create floating text if not exists
            const key = `sticker-${currIndex}-${spr.x}`
            // @ts-ignore
            if (!this.children.getByName(key)) {
              const t = this.add.text(spriteX, spriteY, spr.sticker.emoji, { fontSize: `${Math.round(size*1.2)}px` }).setOrigin(0.5).setName(key).setDepth(10)
              // auto destroy when far
              this.time.delayedCall(100, () => {
                const obj = this.children.getByName(key)
                if (obj) obj.destroy()
              })
            }
          }
        } else if (spr.type === 'decor' && spr.emoji) {
          if (n < 80) {
            const size = Math.max(10, 24 * spriteScale * 4)
            const key = `decor-${currIndex}-${spr.x}-${spr.emoji}`
            // @ts-ignore
            if (!this.children.getByName(key)) {
              const t = this.add.text(spriteX, spriteY, spr.emoji!, { fontSize: `${Math.round(size)}px` }).setOrigin(0.5, 1).setName(key).setDepth(5)
              this.time.delayedCall(150, () => {
                const obj = this.children.getByName(key)
                if (obj) obj.destroy()
              })
            }
          }
        } else if (spr.type === 'house') {
          const size = 48 * spriteScale * 5
          const key = `house-${currIndex}`
          // @ts-ignore
          if (!this.children.getByName(key)) {
            const t = this.add.text(spriteX, spriteY, '🏡', { fontSize: `${Math.round(size)}px` }).setOrigin(0.5,1).setName(key).setDepth(15)
            this.time.delayedCall(150, () => {
              const obj = this.children.getByName(key)
              if (obj) obj.destroy()
            })
          }
        }
      }
    }
  }

  private drawPolygon(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, x4:number, y4:number, color:number) {
    this.graphics.fillStyle(color, 1)
    this.graphics.beginPath()
    this.graphics.moveTo(x1, y1)
    this.graphics.lineTo(x2, y2)
    this.graphics.lineTo(x3, y3)
    this.graphics.lineTo(x4, y4)
    this.graphics.closePath()
    this.graphics.fillPath()
  }

  private checkSprites() {
    // check nearby segments for collection
    for (let n=0; n<15; n++) {
      const idx = (this.baseSegment + n) % this.segments.length
      const seg = this.segments[idx]
      for (const spr of seg.sprites) {
        if (spr.collected) continue
        if (spr.type === 'sticker' && spr.sticker) {
          // if car X close to sprite X and segment close
          if (n < 8 && Math.abs(spr.x - this.carX) < 0.5) {
            spr.collected = true
            this.collectSticker(spr.sticker)
            // remove text
            const key = `sticker-${idx}-${spr.x}`
            // @ts-ignore
            const obj = this.children.getByName(key)
            if (obj) obj.destroy()
          }
        } else if (spr.type === 'house') {
          if (n < 10 && Math.abs(spr.x - this.carX) < 0.6) {
            spr.collected = true
            this.showAlbum(true)
            const key = `house-${idx}`
            // @ts-ignore
            const obj = this.children.getByName(key)
            if (obj) obj.destroy()
          }
        }
      }
    }
  }

  private collectSticker(sticker: StickerType) {
    this.collected.push(sticker)
    this.totalCollected++
    const cnt = this.stickerMap.get(sticker.id) || 0
    this.stickerMap.set(sticker.id, cnt+1)
    this.updateAlbumUI()
    this.playBlip(440 + this.collected.length*25, 0.18, 'sine')
    if (this.carContainer) {
      this.tweens.add({ targets: this.carContainer, scale: 1.18, duration: 90, yoyo:true, ease:'Back.easeOut' })
    }
    const float = this.add.text(this.carContainer.x, this.carContainer.y - 70, sticker.emoji, { fontSize:'36px' }).setOrigin(0.5).setDepth(20)
    this.tweens.add({ targets: float, y: float.y-90, alpha:0, scale:1.6, duration:900, ease:'Quad.easeOut', onComplete: () => float.destroy() })

    if (this.totalCollected >=5 && !this.houseSpawned) {
      // house already in track near end, but we can also trigger early spawn logic - already placed
      this.houseSpawned = true
    }
  }

  private updateAlbumUI() {
    this.uiText.setText(`🌟 ${this.collected.length}`)
    if (this.collected.length === 0) {
      this.albumText.setText('Дрифтуй в поворотах — без наказания! 🎲')
    } else {
      let strip = ''
      this.stickerMap.forEach((cnt, id) => {
        const st = STICKERS.find(s=>s.id===id)
        if (st) strip += `${st.emoji}×${cnt} `
      })
      this.albumText.setText(strip)
    }
  }

  private showAlbum(fromHouse=false) {
    this.isPausedByGame = true
    const { width, height } = this.scale
    const overlay = this.add.graphics().setDepth(100)
    overlay.fillStyle(0xFFF6F9, 0.96)
    overlay.fillRect(0,0,width,height)

    const panel = this.add.graphics().setDepth(101)
    panel.fillStyle(0xFFFFFF,1)
    panel.lineStyle(4,0xFFD6E7,1)
    const pw = Math.min(620, width*0.88)
    const ph = Math.min(520, height*0.85)
    const px = (width-pw)/2
    const py = (height-ph)/2
    panel.fillRoundedRect(px,py,pw,ph,24)
    panel.strokeRoundedRect(px,py,pw,ph,24)

    const title = this.add.text(width/2, py+44, fromHouse ? 'Ура! Домик! Ты проехала игрушечный мир! 🏡' : 'Альбом наклеек 🌸', {
      fontFamily:'system-ui', fontSize:'22px', fontStyle:'bold', color:'#6B4A5A', align:'center', wordWrap:{width:pw-40}
    }).setOrigin(0.5).setDepth(102)

    if (this.collected.length===0) {
      this.add.text(width/2, py+120, 'Пока пусто — поехали искать наклейки!\nТяни машинку в поворотах, она мягко скользит', {
        fontFamily:'system-ui', fontSize:'16px', color:'#8A6A7A', align:'center'
      }).setOrigin(0.5).setDepth(102)
    } else {
      const cols=5
      const cell=90
      const startX = width/2 - ((cols-1)*cell)/2
      let y0 = py+100
      this.collected.forEach((st, idx) => {
        const col = idx % cols
        const row = Math.floor(idx/cols)
        const cx = startX + col*cell
        const cy = y0 + row*80
        if (cy > py+ph-80) return
        const c = this.add.container(cx,cy).setDepth(102)
        const bg = this.add.graphics()
        bg.fillStyle(0xFFF0F5,1)
        bg.lineStyle(2, st.color,1)
        bg.fillCircle(0,0,30)
        bg.strokeCircle(0,0,30)
        c.add(bg)
        c.add(this.add.text(0,0,st.emoji,{fontSize:'26px'}).setOrigin(0.5))
      })
    }

    const btnContinue = this.createButton(width/2 - 110, py+ph-50, '🚗 Ещё круг', 0xA8E6CF, () => {
      overlay.destroy(); panel.destroy(); title.destroy()
      // @ts-ignore
      this.children.list.filter((o:any)=>(o.depth??0)>=102).forEach((o:any)=>o.destroy())
      this.isPausedByGame=false
      this.confettiGroup.forEach(g=>g.destroy())
      this.confettiGroup=[]
    })
    const btnRestart = this.createButton(width/2+110, py+ph-50, '🔄 Заново', 0xFFD6E7, () => {
      this.scene.start('SelectionScene')
    })

    this.spawnConfetti()
    this.playBlip(600,0.3,'triangle')
    this.time.delayedCall(140,()=>this.playBlip(800,0.3,'sine'))
  }

  private createButton(x:number,y:number,label:string,color:number,onClick:()=>void) {
    const cont = this.add.container(x,y).setDepth(102)
    const bg = this.add.graphics()
    bg.fillStyle(color,1)
    bg.lineStyle(2,0x6B4A5A,0.15)
    bg.fillRoundedRect(-90,-22,180,44,22)
    cont.add(bg)
    cont.add(this.add.text(0,0,label,{fontFamily:'system-ui',fontSize:'16px',fontStyle:'bold',color:'#6B4A5A'}).setOrigin(0.5))
    cont.setSize(180,44)
    cont.setInteractive(new Phaser.Geom.Rectangle(-90,-22,180,44), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown',()=>{ this.tweens.add({targets:cont,scale:0.95,duration:80,yoyo:true,onComplete:onClick}) })
    return cont
  }

  private spawnConfetti() {
    const {width,height}=this.scale
    for(let i=0;i<28;i++){
      const g=this.add.graphics().setDepth(103)
      const x=Phaser.Math.Between(0,width)
      const y=Phaser.Math.Between(-120,-10)
      const col=Phaser.Utils.Array.GetRandom([0xFFD166,0xF4978E,0xA8E6CF,0xFFB5E8,0x8ECAE6])
      g.fillStyle(col,1)
      g.fillCircle(0,0,Phaser.Math.Between(4,8))
      g.x=x; g.y=y
      this.confettiGroup.push(g)
      this.tweens.add({targets:g,y:height+120,x:x+Phaser.Math.Between(-120,120),rotation:Phaser.Math.Between(0,6),duration:Phaser.Math.Between(1600,3200),delay:i*35,ease:'Quad.easeIn'})
    }
  }

  private unlockAudio() {
    if (!this.audioCtx) {
      try {
        // @ts-ignore
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch {}
    }
    if (this.audioCtx && this.audioCtx.state==='suspended') this.audioCtx.resume()
  }

  private playBlip(freq:number,dur:number,type:OscillatorType) {
    if (!this.audioCtx) return
    try {
      const osc=this.audioCtx.createOscillator()
      const gain=this.audioCtx.createGain()
      osc.type=type
      osc.frequency.value=freq
      gain.gain.setValueAtTime(0.14,this.audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001,this.audioCtx.currentTime+dur)
      osc.connect(gain).connect(this.audioCtx.destination)
      osc.start()
      osc.stop(this.audioCtx.currentTime+dur)
    } catch {}
  }

  private resetGame() {
    this.position=0
    this.carX=0
    this.carTargetX=0
    this.carVelocity=0
    this.collected=[]
    this.stickerMap.clear()
    this.totalCollected=0
    this.houseSpawned=false
    // reset collected flags
    this.segments.forEach(seg=>seg.sprites.forEach(s=>s.collected=false))
    this.updateAlbumUI()
    this.isPausedByGame=false
  }
}
