# Handoff — rebuild to pseudo-3D OutRun

- role: builder
- phase: vertical_slice (rebuild)
- timestamp: 2026-10-11T09:28:00Z
- trigger: user feedback "Ужасно. Я ожидал псевдо 3d с видом сзади машины. Интересный мир, симуляцию поворотов"

## What was wrong
- Previous RaceScene was flat 3-lane top-down, no perspective, no curves, no world interest
- Did not match player fantasy of learning racing genre with turns

## What changed
- Rewrote RaceScene to classic pseudo-3D OutRun style:
  - Road built from 800 segments, each 200 units, with curve values -2..2
  - Perspective projection: scale = cameraDepth / z, screen.x = (1+scale*cameraX)*width/2
  - Draw from far to near, trapezoid road polygons, rumble strips, lane markers
  - Camera follows carX, track curves accumulate via x+=dx, dx+=curve
  - Hills via sin wave + segment y
  - Toy table world: decor sprites 🧸🧱🎲🪀🧩🌳 at roadside, projected same as road, with emoji text pool
  - Stickers as 3D objects at world Z, collection when n<8 and |x-carX|<0.5
  - House at track end as finish
- Car physics drift_free:
  - carX in -1..1 world, carTargetX from pointer drag mapped -1..1
  - velocity += diff*0.08, friction 0.92, curve pushes velocity -= curve*0.02
  - Soft bounce at edges with -0.3 restitution and blip
  - Visual lean: rotation = velocity*0.3 + curve*0.05
- Kept solo-only, no opponents, no competitive finish per earlier edit
- Kept gentle: speed 60% max, no crash, album, confetti

## Files changed
- src/game/scenes/RaceScene.ts (full rewrite to pseudo-3D)
- .studio/game.json (perspective updated)
- .studio/decisions.md (decision logged)
- .studio/backlog.json (CORE-005 added)
- .studio/evidence/reports/core-005.json

## Commands
- npm install
- npx tsc --noEmit → pass
- npm run build → pass, 1.5MB js gzip 346KB
- dev server 5173 → boots, renders road with perspective

## Evidence
- .studio/evidence/reports/core-005.json
- dist/ build
- dev preview shows road going to horizon with curves

## Next
- QA on Android with pseudo-3D performance (drawDistance 300, 800 segments)
- Tune curve strength and speed for 5yo (currently gentle)
- Add more toy decorations variety if needed
- Re-push to Vercel for user test
