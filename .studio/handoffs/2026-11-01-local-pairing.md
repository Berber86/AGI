# Handoff: Гибридное сопряжение двух смартфонов по Wi-Fi 60 Гц без Firebase API

- **Дата:** 2026-11-01
- **Охват:** `games/candy-kingdom-coaster/` (`ckc-v59`), `games/white-night/` (`play/`), `games/remote-hub/`, корневой каталог `index.html`.
- **Ключевые решения:**
  - Внедрено единое ядро `local-pair.js` + локально встроенный `@paulmillr/qr@0.3.0` (0 вызовов `vibrate`).
  - Авто-спаривание без API-ключей (MQTT v3.1.1 over WSS -> прямой локальный `RTCDataChannel` `iceServers: []`, 60 Гц).
  - 100% офлайн-спаривание `QR ↔ QR` при полном отсутствии интернета на точке доступа (бинарный кодек `AG1.<base64url>` ~130 символов).
  - Общая постоянная пара `localStorage['agi_pair_v1']` между «Сладкой Гонкой», «Белой ночью» и универсальным PWA-хабом «Мой пульт» (`games/remote-hub/`).
  - Старый `firebaseConfig` перенесён в свёрнутый резервный блок `<details>`.
- **Проверки:** `26/26` Python unittest, `11/11` CKC unit, `67/67` White Night unit, `19/19` White Night VR E2E, `7/7` изолированный двухтелефонный Chromium E2E (`tests/e2e-local-pairing.mjs`), визуальная ревизия скриншотов 390×844 и 360×640.
