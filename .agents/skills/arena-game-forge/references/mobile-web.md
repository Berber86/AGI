# Mobile browser and Android requirements

## Platform contract

Default platform is a static HTTPS browser game that works in Android Chrome and can be installed as a PWA. Development preview is not permanent hosting; use a static release target such as GitHub Pages.

Default stack:

- TypeScript;
- Vite;
- Phaser for 2D games;
- Babylon.js only for approved 3D requirements;
- local bundled assets;
- no backend and no runtime secrets by default.

## Touch input

- The entire game must be playable without keyboard or hover.
- Prefer Pointer Events so mouse testing still works.
- Interactive controls should be at least about 44×44 CSS pixels.
- Use `touch-action` narrowly on the game surface; do not disable browser gestures globally without need.
- Handle pointer cancellation and fingers leaving the control.
- Avoid critical controls under system/navigation gesture zones.
- Provide visible pressed/active feedback.
- Prevent stuck movement when the page loses focus.

## Layout

Test at minimum:

- 360×800;
- 412×915.

Also check the approved orientation and one adverse aspect ratio.

- Respect `env(safe-area-inset-*)`.
- Cap device-pixel-ratio used by the renderer when needed; a high-DPR phone should not multiply GPU cost without limit.
- Keep gameplay visible when browser chrome changes viewport height.
- Use dynamic viewport units carefully and verify actual screenshots.
- If only one orientation is supported, show an accessible orientation prompt rather than a broken layout.
- Avoid tiny text baked into images.

## Lifecycle and persistence

- Pause simulation and timers on `visibilitychange`.
- Resume without time jumps, stuck pointers, or overlapping audio.
- Save small progress/settings in `localStorage`; use IndexedDB for larger structured state.
- Version save data and recover safely from incompatible/corrupt state.
- Do not require an account for the default MVP.

## Audio

- Create or resume WebAudio only after a user gesture.
- Respect mute and volume settings.
- Stop or suspend audio when hidden.
- Procedural WebAudio SFX are preferred for the first playable slice.
- Do not make generated music or voice a blocker for the core loop.

## Performance budgets

Record project-specific budgets in `game.json`. Reasonable defaults:

- JavaScript payload excluding assets: target 1–2 MB compressed or less;
- initial asset download: target 10 MB or less;
- no unbounded particle, entity, timer, or listener growth;
- 60 FPS target with graceful 30 FPS fallback on weaker phones;
- textures sized for actual display use;
- renderer DPR cap, usually no more than 2 unless evidence justifies more;
- no blocking runtime CDN requests.

Measure rather than claiming compliance.

## PWA and deployment

- Provide manifest name, icons, theme/background colors, orientation, and standalone display mode.
- Register the service worker only in production.
- Make service-worker updates recoverable; never strand users on a broken stale cache.
- Use a deployment-safe Vite base path suitable for a GitHub Pages subpath.
- Verify a hard reload and an offline reload after first successful load when offline support is part of acceptance.
- Do not place secrets in client code.

## Accessibility baseline

- Keep sufficient contrast and readable body text.
- Do not communicate essential state through color alone.
- Provide reduced-motion behavior for intense screen shake/flashes.
- Avoid rapid flashing.
- Make menus operable by touch and keyboard even though gameplay is touch-first.
- Provide mute and pause controls.
