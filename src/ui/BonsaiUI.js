// BonsaiUI.js - Japanese Zen Aesthetic Interface
import { zenAudio } from '../audio/ZenAudio.js';

export class BonsaiUI {
  constructor(game, potAndSoil, tree, environment) {
    this.game = game;
    this.potAndSoil = potAndSoil;
    this.tree = tree;
    this.environment = environment;

    this.container = document.getElementById('ui-root');
    this.isZenMode = false;

    this.init();
    this.game.onStateChange(state => this.render(state));
  }

  init() {
    this.container.innerHTML = `
      <div id="zen-app" class="zen-theme">
        <!-- Top Header Bar -->
        <header class="zen-header">
          <div class="logo-area">
            <span class="kanji-seal">盆栽</span>
            <div class="title-group">
              <h1 class="main-title">Симулятор Бонсай <span class="sub-kanji">侘寂 • 禅</span></h1>
              <div class="tree-meta">
                <span id="badge-species" class="badge">Японская черная сосна</span>
                <span id="badge-style" class="badge">Стиль: Моёги</span>
                <span id="badge-age" class="badge gold">Возраст: 28 лет</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions & Atmosphere -->
          <div class="header-controls">
            <!-- Atmosphere Selector -->
            <div class="select-group">
              <label><span class="label-kanji">気候</span> Свет:</label>
              <select id="atmo-select" class="zen-select">
                <option value="golden">Золотой закат (Югурэ)</option>
                <option value="morning">Утренний туман (Асамоя)</option>
                <option value="moonlit">Лунная ночь (Цукиё)</option>
                <option value="sakura">Цветущая весна (Хару)</option>
              </select>
            </div>

            <!-- Season Selector -->
            <div class="select-group">
              <label><span class="label-kanji">季節</span> Сезон:</label>
              <select id="season-select" class="zen-select">
                <option value="summer">Лето (Нацу)</option>
                <option value="autumn">Осень (Аки)</option>
                <option value="spring">Весна (Хару)</option>
                <option value="winter">Зима (Фую)</option>
              </select>
            </div>

            <!-- Audio & Zen Buttons -->
            <button id="btn-rin-bell" class="zen-icon-btn" title="Поющая чаша (Рин)">🔔</button>
            <button id="btn-audio-toggle" class="zen-icon-btn" title="Звуки природы и флейты">🎵</button>
            <button id="btn-zen-mode" class="zen-btn zen-btn-gold" title="Режим медитации (скрыть интерфейс)">☯ Дзен</button>
            <button id="btn-photo" class="zen-btn" title="Сделать фото с печатью Ханко">📷 Фото</button>
            <button id="btn-guide" class="zen-icon-btn" title="Руководство мастера">📖</button>
          </div>
        </header>

        <!-- Left Dashboard: Vitals & Zen Quests -->
        <aside class="zen-sidebar left-sidebar">
          <div class="card vitals-card">
            <h3 class="card-title"><span class="kanji-mini">生命</span> Жизненная сила</h3>

            <!-- Moisture Bar -->
            <div class="vital-item">
              <div class="vital-label">
                <span>💧 Влажность Акадама</span>
                <strong id="val-moisture">65%</strong>
              </div>
              <div class="progress-track">
                <div id="bar-moisture" class="progress-fill water" style="width: 65%"></div>
              </div>
            </div>

            <!-- Nutrients Bar -->
            <div class="vital-item">
              <div class="vital-label">
                <span>🌿 Питание (Хилё)</span>
                <strong id="val-nutrients">70%</strong>
              </div>
              <div class="progress-track">
                <div id="bar-nutrients" class="progress-fill fertilizer" style="width: 70%"></div>
              </div>
            </div>

            <!-- Health Bar -->
            <div class="vital-item">
              <div class="vital-label">
                <span>✨ Здоровье дерева</span>
                <strong id="val-health">96%</strong>
              </div>
              <div class="progress-track">
                <div id="bar-health" class="progress-fill health" style="width: 96%"></div>
              </div>
            </div>

            <!-- Harmony Rating -->
            <div class="harmony-box">
              <div class="harmony-header">
                <span>Гармония Ваби-Саби:</span>
                <span id="val-harmony" class="harmony-score">82%</span>
              </div>
              <div class="stars-rating" id="harmony-stars">★★★★☆</div>
              <p class="harmony-desc" id="harmony-rank">Ранг: Опытный мастер бонсай</p>
            </div>
          </div>

          <!-- Zen Tasks Card -->
          <div class="card quests-card">
            <h3 class="card-title"><span class="kanji-mini">修行</span> Путь мастера (Задания)</h3>
            <ul id="quests-list" class="quests-list"></ul>
          </div>

          <!-- Zen Wisdom Card -->
          <div class="card wisdom-card">
            <p class="wisdom-quote" id="wisdom-quote">
              «Бонсай — это не создание карликового дерева, а познание вечности в малом пространстве».
            </p>
          </div>
        </aside>

        <!-- Right Side: Camera Tools & Branch Inspector -->
        <aside class="zen-sidebar right-sidebar">
          <!-- Camera View Switcher -->
          <div class="card camera-card">
            <h3 class="card-title"><span class="kanji-mini">視点</span> Ракурс камеры</h3>
            <div class="camera-grid">
              <button class="cam-btn active" data-view="front">Фас (Сёмэн)</button>
              <button class="cam-btn" data-view="side">Профиль</button>
              <button class="cam-btn" data-view="top">Сверху</button>
              <button class="cam-btn" data-view="macro">Макро</button>
            </div>
            <button id="btn-autorotate" class="zen-btn block-btn mt-2">🔄 Дзен-вращение</button>
          </div>

          <!-- Selected Branch Inspector (Visible when branch selected) -->
          <div id="branch-inspector" class="card inspector-card hidden">
            <div class="inspector-header">
              <h3 id="inspector-name" class="card-title">Саси-эда</h3>
              <button id="btn-close-inspector" class="close-btn">&times;</button>
            </div>
            <div class="inspector-body">
              <div class="inspector-field">
                <span class="field-label">Уровень:</span>
                <span id="inspector-level">Основная скелетная ветвь</span>
              </div>
              <div class="inspector-field">
                <span class="field-label">Статус:</span>
                <span id="inspector-status" class="tag-status">Живая ветвь</span>
              </div>

              <!-- Bend sliders for wiring -->
              <div class="slider-group">
                <label>Изгиб по горизонтали (Хариганэ):</label>
                <div class="slider-row">
                  <input type="range" id="slider-bend-y" min="-1.5" max="1.5" step="0.05" value="0" />
                </div>
              </div>
              <div class="slider-group">
                <label>Наклон подушки вниз/вверх:</label>
                <div class="slider-row">
                  <input type="range" id="slider-bend-x" min="-1.2" max="1.2" step="0.05" value="0" />
                </div>
              </div>

              <!-- Action buttons for branch -->
              <div class="branch-actions">
                <button id="btn-branch-prune" class="action-btn danger">✂ Обрезать ветвь</button>
                <button id="btn-branch-jin" class="action-btn warning">🗡 Выбелить (Дзин)</button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Bottom Tool Dock -->
        <nav class="tool-dock">
          <button class="dock-btn active" data-tool="inspect">
            <span class="dock-icon">👁️</span>
            <span class="dock-text">Осмотр</span>
            <span class="dock-kanji">鑑賞</span>
          </button>
          <button class="dock-btn" data-tool="prune">
            <span class="dock-icon">✂️</span>
            <span class="dock-text">Сэнтэй</span>
            <span class="dock-kanji">剪定</span>
          </button>
          <button class="dock-btn" data-tool="wire">
            <span class="dock-icon">➰</span>
            <span class="dock-text">Хариганэ</span>
            <span class="dock-kanji">針金</span>
          </button>
          <button class="dock-btn" data-tool="jin">
            <span class="dock-icon">🗡️</span>
            <span class="dock-text">Дзин</span>
            <span class="dock-kanji">神</span>
          </button>
          <button class="dock-btn" data-tool="water">
            <span class="dock-icon">💧</span>
            <span class="dock-text">Полив</span>
            <span class="dock-kanji">水遣り</span>
          </button>
          <button class="dock-btn" data-tool="fertilize">
            <span class="dock-icon">🌿</span>
            <span class="dock-text">Удобрение</span>
            <span class="dock-kanji">肥料</span>
          </button>
          <button class="dock-btn" data-tool="moss">
            <span class="dock-icon">🟢</span>
            <span class="dock-text">Мох и сад</span>
            <span class="dock-kanji">苔</span>
          </button>
          <button class="dock-btn" id="btn-open-pot-modal">
            <span class="dock-icon">🏺</span>
            <span class="dock-text">Горшок & Вид</span>
            <span class="dock-kanji">植替</span>
          </button>
          <button class="dock-btn" id="btn-advance-time">
            <span class="dock-icon">⏳</span>
            <span class="dock-text">+6 Мес</span>
            <span class="dock-kanji">成長</span>
          </button>
        </nav>

        <!-- Pot & Tree Customization Modal -->
        <div id="modal-customizer" class="zen-modal hidden">
          <div class="modal-card">
            <div class="modal-header">
              <h2>Мастерская Бонсай • Настройки стиля</h2>
              <button id="modal-close" class="close-btn">&times;</button>
            </div>
            <div class="modal-content">
              <!-- Tree Species -->
              <div class="option-section">
                <h3>Вид дерева (Дзюсю / 樹種):</h3>
                <div class="pill-group" id="species-selector">
                  <button class="pill-btn active" data-species="pine">Японская черная сосна (Куромацу)</button>
                  <button class="pill-btn" data-species="maple">Дланевидный клен (Момидзи)</button>
                  <button class="pill-btn" data-species="sakura">Цветущая сакура (Сакура)</button>
                  <button class="pill-btn" data-species="juniper">Можжевельник Синпаку</button>
                </div>
              </div>

              <!-- Tree Style -->
              <div class="option-section">
                <h3>Традиционный стиль (Дзюкей / 樹形):</h3>
                <div class="pill-group" id="style-selector">
                  <button class="pill-btn active" data-style="moyogi">Моёги (Извилистый ствол)</button>
                  <button class="pill-btn" data-style="chokkan">Тёккан (Прямостоячий ствол)</button>
                  <button class="pill-btn" data-style="shakan">Сякан (Наклонный ствол)</button>
                  <button class="pill-btn" data-style="kengai">Кенгай (Каскадный стиль)</button>
                  <button class="pill-btn" data-style="bunjin">Бундзин (Поэтичный стиль)</button>
                </div>
              </div>

              <!-- Pot Style -->
              <div class="option-section">
                <h3>Форма контейнера (Хати / 鉢):</h3>
                <div class="pill-group" id="pot-style-selector">
                  <button class="pill-btn active" data-potstyle="oval">Овальный (Даэн)</button>
                  <button class="pill-btn" data-potstyle="rectangular">Прямоугольный (Тёхокэй)</button>
                  <button class="pill-btn" data-potstyle="cascade">Высокий каскадный (Роккаку)</button>
                  <button class="pill-btn" data-potstyle="round">Круглый (Мару)</button>
                </div>
              </div>

              <!-- Pot Glaze -->
              <div class="option-section">
                <h3>Глазурь керамики:</h3>
                <div class="pill-group" id="pot-glaze-selector">
                  <button class="pill-btn active" data-glaze="tokoname">Глина Токонамэ (Матовая)</button>
                  <button class="pill-btn" data-glaze="celadon">Селадон с кракелюром</button>
                  <button class="pill-btn" data-glaze="obsidian">Черный обсидиан</button>
                  <button class="pill-btn" data-glaze="cobalt">Императорский кобальт</button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button id="modal-apply" class="zen-btn zen-btn-gold">Применить</button>
            </div>
          </div>
        </div>

        <!-- Guide Modal -->
        <div id="modal-guide" class="zen-modal hidden">
          <div class="modal-card guide-card">
            <div class="modal-header">
              <h2>Философия и секреты Бонсай</h2>
              <button id="guide-close" class="close-btn">&times;</button>
            </div>
            <div class="modal-content guide-text">
              <h3>Основные принципы японской эстетики:</h3>
              <p><strong>Ваби-Саби (侘寂):</strong> Видение красоты в несовершенстве, простоте и следах времени. Старая растрескавшаяся кора, изогнутые ветви и сучья дзин — высшее проявление ваби-саби.</p>
              <p><strong>Ма (間):</strong> Отрицательное пространство между ярусами ветвей. Бонсай не должен быть сплошным шаром листьев — птица должна свободно пролетать сквозь крону дерева.</p>
              <p><strong>Небари (根張り):</strong> Мощные поверхностные корни, расходящиеся от основания ствола и крепко держащие землю.</p>
              <p><strong>Саси-эда (刺枝):</strong> Главная выразительная ветвь дерева, задающая общее движение и ритм всей композиции.</p>
              <p><strong>Дзин (神) и Сяри (舎利):</strong> Искусство создания выбеленных мертвых сучьев и полос на стволе, символизирующих борьбу со стихиями.</p>
              <h3>Инструменты мастера:</h3>
              <ul>
                <li><strong>Сэнтэй (Секатор):</strong> Обрезайте ветви, чтобы открыть ствол и направить соки дерева в сильные подушки. Обрезка стимулирует пробуждение спящих почек!</li>
                <li><strong>Хариганэ (Проволока):</strong> Медная проволока направляет ветви горизонтально, создавая благородные облачные подушки.</li>
                <li><strong>Мидзуяри (Полив):</strong> Поддерживайте влажность гранулированной глины Акадама в диапазоне 50-80%.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Zen Mode Exit Overlay -->
        <div id="zen-exit-hint" class="zen-exit-hint hidden">
          Нажмите в любом месте или клавишу ESC для выхода из Дзен-режима
        </div>
      </div>
    `;

    this.bindEvents();
    this.render(this.game.getState());
  }

  bindEvents() {
    // Tool buttons
    const dockButtons = this.container.querySelectorAll('.dock-btn[data-tool]');
    dockButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dockButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tool = btn.getAttribute('data-tool');
        this.game.setTool(tool);
        zenAudio.playRinGong(500);
      });
    });

    // Advance time
    const btnAdvTime = this.container.querySelector('#btn-advance-time');
    btnAdvTime.addEventListener('click', () => {
      this.game.advanceTime(6);
    });

    // Atmosphere
    const atmoSelect = this.container.querySelector('#atmo-select');
    atmoSelect.addEventListener('change', (e) => {
      this.environment.setAtmosphere(e.target.value);
      zenAudio.playRinGong(480);
      this.game.notifyStateChange();
    });

    // Season
    const seasonSelect = this.container.querySelector('#season-select');
    seasonSelect.addEventListener('change', (e) => {
      this.tree.setSeason(e.target.value);
      zenAudio.playRinGong(540);
      this.game.notifyStateChange();
    });

    // Audio & Rin Gong
    const btnRin = this.container.querySelector('#btn-rin-bell');
    btnRin.addEventListener('click', () => {
      zenAudio.playRinGong(440);
    });

    const btnAudio = this.container.querySelector('#btn-audio-toggle');
    btnAudio.addEventListener('click', () => {
      if (!zenAudio.ambientRunning) {
        zenAudio.startAmbient();
        btnAudio.classList.add('active');
      } else {
        const isMuted = zenAudio.toggleMute();
        btnAudio.classList.toggle('muted', isMuted);
      }
    });

    // Camera Views
    const camButtons = this.container.querySelectorAll('.cam-btn');
    camButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        camButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.getAttribute('data-view');
        this.game.setCameraView(view);
        zenAudio.playRinGong(560);
      });
    });

    const btnAutoRotate = this.container.querySelector('#btn-autorotate');
    btnAutoRotate.addEventListener('click', () => {
      this.game.toggleAutoRotate();
    });

    // Zen Mode (hide UI)
    const btnZen = this.container.querySelector('#btn-zen-mode');
    const exitHint = this.container.querySelector('#zen-exit-hint');
    btnZen.addEventListener('click', () => {
      this.isZenMode = true;
      document.body.classList.add('zen-fullscreen-mode');
      exitHint.classList.remove('hidden');
      if (!zenAudio.ambientRunning) {
        zenAudio.startAmbient();
      }
      zenAudio.playRinGong(432);
    });

    exitHint.addEventListener('click', () => {
      this.exitZenMode();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isZenMode) {
        this.exitZenMode();
      }
    });

    // Branch Inspector buttons
    const btnCloseInsp = this.container.querySelector('#btn-close-inspector');
    btnCloseInsp.addEventListener('click', () => {
      this.game.selectedBranch = null;
      this.game.notifyStateChange();
    });

    const btnBranchPrune = this.container.querySelector('#btn-branch-prune');
    btnBranchPrune.addEventListener('click', () => {
      if (this.game.selectedBranch) {
        this.game.handleBranchClick(this.game.selectedBranch);
      }
    });

    const btnBranchJin = this.container.querySelector('#btn-branch-jin');
    btnBranchJin.addEventListener('click', () => {
      if (this.game.selectedBranch) {
        zenAudio.playCarveJin();
        const isJin = this.tree.carveJin(this.game.selectedBranch.id);
        if (isJin) this.game.completeQuest('jin');
        this.game.notifyStateChange();
      }
    });

    const sliderBendY = this.container.querySelector('#slider-bend-y');
    sliderBendY.addEventListener('input', (e) => {
      if (this.game.selectedBranch) {
        const val = parseFloat(e.target.value);
        this.tree.wireBranch(this.game.selectedBranch.id, val * 0.05, 0);
        this.game.completeQuest('wire');
        this.game.notifyStateChange();
      }
    });

    const sliderBendX = this.container.querySelector('#slider-bend-x');
    sliderBendX.addEventListener('input', (e) => {
      if (this.game.selectedBranch) {
        const val = parseFloat(e.target.value);
        this.tree.wireBranch(this.game.selectedBranch.id, 0, val * 0.05);
        this.game.completeQuest('wire');
        this.game.notifyStateChange();
      }
    });

    // Pot & Species Modal
    const btnOpenPot = this.container.querySelector('#btn-open-pot-modal');
    const modalCustomizer = this.container.querySelector('#modal-customizer');
    const modalClose = this.container.querySelector('#modal-close');
    const modalApply = this.container.querySelector('#modal-apply');

    btnOpenPot.addEventListener('click', () => {
      modalCustomizer.classList.remove('hidden');
      zenAudio.playRinGong(460);
    });
    modalClose.addEventListener('click', () => {
      modalCustomizer.classList.add('hidden');
    });
    modalApply.addEventListener('click', () => {
      modalCustomizer.classList.add('hidden');
      zenAudio.playRinGong(520);
    });

    // Modal Pill Selectors
    this.setupPillGroup('#species-selector', (species) => {
      this.tree.setSpecies(species);
      this.game.notifyStateChange();
    });
    this.setupPillGroup('#style-selector', (style) => {
      this.tree.setStyle(style);
      this.game.notifyStateChange();
    });
    this.setupPillGroup('#pot-style-selector', (potStyle) => {
      this.potAndSoil.setPotStyle(potStyle);
      this.tree.setSoilY(this.potAndSoil.getSoilSurfaceY());
      this.game.notifyStateChange();
    });
    this.setupPillGroup('#pot-glaze-selector', (glaze) => {
      this.potAndSoil.setGlaze(glaze);
      this.game.notifyStateChange();
    });

    // Guide Modal
    const btnGuide = this.container.querySelector('#btn-guide');
    const modalGuide = this.container.querySelector('#modal-guide');
    const guideClose = this.container.querySelector('#guide-close');

    btnGuide.addEventListener('click', () => {
      modalGuide.classList.remove('hidden');
      zenAudio.playRinGong(440);
    });
    guideClose.addEventListener('click', () => {
      modalGuide.classList.add('hidden');
    });

    // Photo Button
    const btnPhoto = this.container.querySelector('#btn-photo');
    btnPhoto.addEventListener('click', () => {
      this.takeMasterpiecePhoto();
    });
  }

  exitZenMode() {
    this.isZenMode = false;
    document.body.classList.remove('zen-fullscreen-mode');
    this.container.querySelector('#zen-exit-hint').classList.add('hidden');
  }

  setupPillGroup(containerSelector, onSelect) {
    const container = this.container.querySelector(containerSelector);
    if (!container) return;
    const buttons = container.querySelectorAll('.pill-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.dataset.species || btn.dataset.style || btn.dataset.potstyle || btn.dataset.glaze;
        onSelect(val);
      });
    });
  }

  // Render UI updates from game state
  render(state) {
    // Vitals
    const elMoistureVal = this.container.querySelector('#val-moisture');
    const elMoistureBar = this.container.querySelector('#bar-moisture');
    if (elMoistureVal) elMoistureVal.textContent = `${state.moisture}%`;
    if (elMoistureBar) elMoistureBar.style.width = `${state.moisture}%`;

    const elNutrientsVal = this.container.querySelector('#val-nutrients');
    const elNutrientsBar = this.container.querySelector('#bar-nutrients');
    if (elNutrientsVal) elNutrientsVal.textContent = `${state.nutrients}%`;
    if (elNutrientsBar) elNutrientsBar.style.width = `${state.nutrients}%`;

    const elHealthVal = this.container.querySelector('#val-health');
    const elHealthBar = this.container.querySelector('#bar-health');
    if (elHealthVal) elHealthVal.textContent = `${state.health}%`;
    if (elHealthBar) elHealthBar.style.width = `${state.health}%`;

    // Badges
    const badgeSpecies = this.container.querySelector('#badge-species');
    const speciesNames = {
      pine: 'Японская черная сосна (Куромацу)',
      maple: 'Дланевидный клен (Момидзи)',
      sakura: 'Цветущая сакура',
      juniper: 'Можжевельник Синпаку'
    };
    if (badgeSpecies) badgeSpecies.textContent = speciesNames[state.species] || state.species;

    const badgeStyle = this.container.querySelector('#badge-style');
    const styleNames = {
      moyogi: 'Стиль: Моёги (Извилистый)',
      chokkan: 'Стиль: Тёккан (Прямой)',
      shakan: 'Стиль: Сякан (Наклонный)',
      kengai: 'Стиль: Кенгай (Каскад)',
      bunjin: 'Стиль: Бундзин (Поэтичный)'
    };
    if (badgeStyle) badgeStyle.textContent = styleNames[state.style] || state.style;

    const badgeAge = this.container.querySelector('#badge-age');
    if (badgeAge) badgeAge.textContent = `Возраст: ${state.ageYears} лет ${state.ageMonths} мес`;

    // Harmony Score & Rank
    const elHarmony = this.container.querySelector('#val-harmony');
    if (elHarmony) elHarmony.textContent = `${state.harmonyScore}%`;

    const elStars = this.container.querySelector('#harmony-stars');
    const elRank = this.container.querySelector('#harmony-rank');
    if (state.harmonyScore >= 90) {
      if (elStars) elStars.textContent = '★★★★★';
      if (elRank) elRank.textContent = 'Ранг: Великий Мэйдзин (名人)';
    } else if (state.harmonyScore >= 80) {
      if (elStars) elStars.textContent = '★★★★☆';
      if (elRank) elRank.textContent = 'Ранг: Мастер бонсай (Сэнсэй)';
    } else if (state.harmonyScore >= 65) {
      if (elStars) elStars.textContent = '★★★☆☆';
      if (elRank) elRank.textContent = 'Ранг: Опытный садовник';
    } else {
      if (elStars) elStars.textContent = '★★☆☆☆';
      if (elRank) elRank.textContent = 'Ранг: Прилежный ученик';
    }

    // Quests list
    const questsList = this.container.querySelector('#quests-list');
    if (questsList) {
      questsList.innerHTML = state.quests.map(q => `
        <li class="quest-item ${q.done ? 'completed' : ''}">
          <span class="quest-check">${q.done ? '✓' : '○'}</span>
          <div class="quest-text">
            <strong>${q.title}</strong>
            <small>${q.desc}</small>
          </div>
        </li>
      `).join('');
    }

    // Branch Inspector
    const inspector = this.container.querySelector('#branch-inspector');
    if (state.selectedBranch) {
      inspector.classList.remove('hidden');
      const branch = state.selectedBranch;
      this.container.querySelector('#inspector-name').textContent = branch.name;
      this.container.querySelector('#inspector-level').textContent =
        branch.level === 0 ? 'Главный ствол дерева' : (branch.level === 1 ? 'Скелетная ветвь первого порядка' : 'Вторичная веточка');

      const elStatus = this.container.querySelector('#inspector-status');
      if (branch.isJin) {
        elStatus.textContent = 'Сук Дзин (Мертвая древесина)';
        elStatus.className = 'tag-status jin';
      } else if (branch.isWired) {
        elStatus.textContent = 'В проволоке (Хариганэ)';
        elStatus.className = 'tag-status wired';
      } else {
        elStatus.textContent = 'Естественный рост';
        elStatus.className = 'tag-status natural';
      }
    } else {
      inspector.classList.add('hidden');
    }
  }

  // Masterpiece Photo with Japanese Hanko Seal
  takeMasterpiecePhoto() {
    zenAudio.playRinGong(520);
    const canvas = this.game.domElement;
    if (!canvas) return;

    // Create an offscreen canvas to composite red seal and calligraphy
    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = canvas.width;
    photoCanvas.height = canvas.height;
    const ctx = photoCanvas.getContext('2d');

    // Draw 3D scene
    ctx.drawImage(canvas, 0, 0);

    // Traditional red vermilion Hanko seal (印)
    const sealSize = 64;
    const sealX = photoCanvas.width - sealSize - 40;
    const sealY = photoCanvas.height - sealSize - 40;

    ctx.fillStyle = 'rgba(192, 57, 43, 0.9)';
    ctx.fillRect(sealX, sealY, sealSize, sealSize);
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.strokeRect(sealX, sealY, sealSize, sealSize);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('盆', sealX + sealSize / 2, sealY + sealSize / 2);

    // Title overlay in Japanese & Russian
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '18px "Noto Serif", serif';
    ctx.textAlign = 'right';
    const state = this.game.getState();
    ctx.fillText(`Бонсай • ${state.ageYears} лет • Гармония: ${state.harmonyScore}%`, sealX - 20, sealY + 25);
    ctx.fillText(`Стиль: ${state.style.toUpperCase()} • Ваби-Саби`, sealX - 20, sealY + 50);

    // Download image
    const link = document.createElement('a');
    link.download = `Bonsai-Masterpiece-${Date.now()}.png`;
    link.href = photoCanvas.toDataURL('image/png');
    link.click();
  }
}
