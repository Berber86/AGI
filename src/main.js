import "./style.css";
import {
  createIcons,
  VolumeX,
  Volume2,
  CircleHelp,
  SlidersHorizontal,
  Orbit,
  ScanLine,
  Sun,
  ArrowUpRight,
  ShieldCheck,
  Scan,
  BookOpen,
  Map,
  Aperture,
  Mouse,
  Radar,
  Radio,
  ArrowLeft,
  X,
  Check,
  Brush,
  ArrowRight,
  RotateCcw,
  Navigation,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide";
import { World, SITES } from "./world.js";
import {
  GLYPHS,
  initialState,
  readSave,
  saveState,
  cleanRelic,
  decodeRelic,
  countRelics,
} from "./state.js";
import { ExpeditionAudio } from "./audio.js";

const icons = {
  VolumeX,
  Volume2,
  CircleHelp,
  SlidersHorizontal,
  Orbit,
  ScanLine,
  Sun,
  ArrowUpRight,
  ShieldCheck,
  Scan,
  BookOpen,
  Map,
  Aperture,
  Mouse,
  Radar,
  Radio,
  ArrowLeft,
  X,
  Check,
  Brush,
  ArrowRight,
  RotateCcw,
  Navigation,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
};
const $ = (id) => document.getElementById(id);
const refreshIcons = () =>
  createIcons({ icons, attrs: { "stroke-width": 1.5 } });
refreshIcons();
let storage;
try {
  storage = window.localStorage;
} catch {
  storage = {
    getItem: () => null,
    setItem: () => {
      throw new Error("Storage unavailable");
    },
    removeItem: () => {},
  };
}
let state = readSave(storage);
let world;
let photoMode = false;
let modalOpen = false;
let modalType = "";
let lastFocus;
let activeRelic = -1;
let cleaningTimer;
let cleanHeld = false;
let scanStart = 0;
let scanRunning = false;
let pendingInspection = -1;
let notificationTimer;
let markers = [];
let lastUiUpdate = 0;
const audio = new ExpeditionAudio();
function notify(title, text, duration = 5000) {
  $("notification-title").textContent = title;
  $("notification-text").textContent = text;
  $("notification").classList.add("show");
  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(
    () => $("notification").classList.remove("show"),
    duration,
  );
}
function save() {
  const ok = saveState(storage, state);
  $("save-status").textContent = ok
    ? "ПРОГРЕСС СОХРАНЁН"
    : "ЛОКАЛЬНОЕ СОХРАНЕНИЕ НЕДОСТУПНО";
}
function syncUI() {
  const n = countRelics(state);
  $("relic-count").innerHTML = `${n} <span>/ 3</span>`;
  $("mission-progress").style.width = `${(n / 3) * 100}%`;
  $("task-number").textContent = state.completed
    ? "03 / 03"
    : state.scanned
      ? "02 / 03"
      : "01 / 03";
  $("objective-title").textContent = state.completed
    ? "Память восстановлена"
    : state.scanned
      ? "Собрать осколки прошлого"
      : "Голоса под песком";
  $("objective-copy").innerHTML = state.completed
    ? "Их история снова стала частью вселенной.<br>Прочитайте итог в полевом журнале."
    : state.scanned
      ? "Исследуйте отмеченные реликвии.<br>Очистите поверхность и прочтите символы."
      : "Просканируйте руины.<br>Найдите следы исчезнувшей цивилизации.";
  $("journal-badge").hidden = n === 0;
  $("journal-badge").textContent = n;
  $("scanner-subtitle").textContent = state.scanned
    ? "3 СПЕКТРАЛЬНЫХ СИГНАЛА"
    : "СПЕКТРАЛЬНЫЙ СКАНЕР";
  markers.forEach((m, i) => {
    const collected = state.relics[i].decoded;
    m.classList.toggle("collected", collected);
    m.classList.toggle("unscanned", !state.scanned);
    m.querySelector(".marker-name").textContent = collected
      ? "АРХИВИРОВАНО"
      : state.scanned
        ? SITES[i].name.toUpperCase()
        : "НЕИЗВЕСТНЫЙ СИГНАЛ";
    if (collected) world?.collect(i);
  });
}
function createMarkers() {
  SITES.forEach((site, i) => {
    const b = document.createElement("button");
    b.className = "world-marker";
    b.setAttribute("aria-label", `Исследовать: ${site.name}`);
    b.innerHTML = `<span class="marker-diamond"></span><span class="marker-label"><span class="marker-name"></span><small><span class="marker-distance"></span> М <span class="marker-action">/ ИССЛЕДОВАТЬ <kbd>E</kbd></span></small></span>`;
    b.addEventListener("click", () => visitSite(i));
    $("world-markers").appendChild(b);
    markers.push(b);
  });
  syncUI();
}
function beginScan() {
  if (!world || scanRunning || modalOpen) return;
  scanRunning = true;
  scanStart = world.elapsed;
  world.scan();
  audio.scan();
  document.body.classList.add("scanning");
  $("scan-status").hidden = false;
  $("scan-button").disabled = true;
  $("scan-button").querySelector("strong").textContent = "Сканирование…";
  $("scanner-subtitle").textContent = "АНАЛИЗ ПОВЕРХНОСТИ";
}
function finishScan() {
  scanRunning = false;
  document.body.classList.remove("scanning");
  $("scan-status").hidden = true;
  $("scan-button").disabled = false;
  $("scan-button").querySelector("strong").textContent = "Сканировать";
  state.scanned = true;
  save();
  syncUI();
  audio.tone(660, 0.5);
  notify(
    "Обнаружено 3 спектральных сигнала",
    "Выберите отметку в ландшафте или на карте, чтобы исследовать реликвию.",
  );
}
function visitSite(index) {
  if (!world) return;
  if (!state.scanned) {
    notify(
      "Сигнал ещё не идентифицирован",
      "Нажмите Q или «Сканировать», чтобы проанализировать поверхность.",
    );
    audio.tone(160, 0.2);
    return;
  }
  if (modalOpen) closeModal();
  if (world.distance(index) > 16) {
    world.focusSite(index);
    pendingInspection = index;
    notify(
      "Прокладываем маршрут",
      `Автопереход к объекту «${SITES[index].name}».`,
      2200,
    );
  } else openArtifact(index);
}
function frame(t) {
  if (scanRunning) {
    const p = Math.min(100, ((t - scanStart) / 4.2) * 100);
    $("scan-percent").textContent = `${Math.floor(p)}%`;
    if (p >= 100) finishScan();
  }
  if (pendingInspection >= 0 && !world?.travel && world) {
    const index = pendingInspection;
    pendingInspection = -1;
    openArtifact(index);
  }
  if (t - lastUiUpdate < 0.07 || !world) return;
  lastUiUpdate = t;
  markers.forEach((m, i) => {
    const p = world.project(SITES[i].position);
    const shown = p.visible && (state.scanned || i === 0) && !photoMode;
    m.style.display = shown ? "flex" : "none";
    m.style.left = `${p.x}px`;
    m.style.top = `${p.y}px`;
    m.classList.toggle("label-left", p.x > innerWidth - 205);
    m.querySelector(".marker-distance").textContent = Math.round(
      world.distance(i),
    );
    m.querySelector(".marker-action").style.display = state.scanned
      ? "inline"
      : "none";
  });
  const angle = (Math.round((-world.yaw * 180) / Math.PI) + 360) % 360;
  $("heading").textContent = angle < 15 || angle > 345 ? "С" : `${angle}°`;
  const p = world.camera.position;
  $("altitude").textContent = Math.round(118 + p.y);
  $("coordinates").textContent =
    `24° ${String(Math.round(18 + p.z * 0.04)).padStart(2, "0")}′ N   08° ${String(Math.round(42 + p.x * 0.04)).padStart(2, "0")}′ E`;
  const s = Math.floor(t) + 17 * 3600 + 42 * 60 + 8;
  $("local-time").textContent =
    `${String(Math.floor(s / 3600) % 24).padStart(2, "0")}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")} LST`;
}
function showModal(title, type, html, eyebrow = "БОРТОВАЯ СИСТЕМА / ЭРЕБУС") {
  stopCleaning();
  if (!modalOpen) lastFocus = document.activeElement;
  modalOpen = true;
  modalType = type;
  $("modal-title").textContent = title;
  $("modal-eyebrow").textContent = eyebrow;
  $("modal-content").innerHTML = html;
  $("modal-backdrop").hidden = false;
  if (world) {
    world.enabled = false;
    world.keys.clear();
  }
  refreshIcons();
  $("close-modal").focus();
}
function closeModal() {
  stopCleaning();
  modalOpen = false;
  modalType = "";
  activeRelic = -1;
  $("modal-backdrop").hidden = true;
  if (world) world.enabled = true;
  if (lastFocus?.isConnected) lastFocus.focus();
  else document.activeElement?.blur();
}
function help() {
  showModal(
    "Добро пожаловать, странник.",
    "help",
    `<p class="lead">Вы — первый археолог на Эребусе. Под слоем пыли здесь осталась память цивилизации, исчезнувшей 84 тысячи лет назад.</p><p>Просканируйте плато, найдите три реликвии и восстановите их историю. Выбирайте светящиеся отметки для автоперехода или исследуйте мир самостоятельно.</p><div class="controls-grid"><div class="control-item"><kbd>WASD</kbd> Передвижение · Shift — быстрее</div><div class="control-item"><i data-lucide="mouse"></i> Зажмите фон и тяните для обзора</div><div class="control-item"><kbd>Q</kbd> Спектральное сканирование</div><div class="control-item"><kbd>E</kbd> Ближайшая реликвия</div><div class="control-item"><kbd>J / M</kbd> Журнал / карта сектора</div><div class="control-item"><kbd>P</kbd> Обзор без интерфейса · Esc — выход</div></div><p class="subtle">На телефоне используйте стрелки и жест обзора. Звук включается кнопкой в верхнем правом углу. Прогресс автоматически сохраняется в этом браузере. Кислород и погода — телеметрия, не таймер выживания.</p><div class="modal-actions"><button class="primary-button" id="start-exploration">Продолжить экспедицию <i data-lucide="arrow-right"></i></button></div>`,
  );
  $("start-exploration").onclick = closeModal;
}
function journal() {
  const n = countRelics(state);
  showModal(
    "Полевой журнал",
    "journal",
    `<div class="panel-topline"><span>ЭКСПЕДИЦИЯ «ЭРЕБУС»</span><span>${String(n).padStart(2, "0")} / 03 ЗАПИСИ</span></div>${SITES.map(
      (site, i) => {
        const r = state.relics[i];
        return `<article class="journal-entry ${r.decoded ? "found" : ""}"><div class="entry-number">0${i + 1}</div><div><h3>${r.decoded ? site.name : state.scanned ? "Неизученная реликвия" : "Неизвестный сигнал"}</h3><p>${r.decoded ? site.story : state.scanned ? "Сигнал локализован. Очистите реликвию и расшифруйте надпись, чтобы открыть запись." : "Проведите спектральное сканирование поверхности."}</p><span class="entry-label">${r.decoded ? site.code + " / ЗАПИСЬ ВОССТАНОВЛЕНА" : "ЗАПИСЬ НЕДОСТУПНА"}</span></div></article>`;
      },
    ).join(
      "",
    )}${state.completed ? `<p class="lead accent">«Мы были. И этого достаточно.»</p><p>Архив восстановлен. Эребус был не некрополем, а последней попыткой сохранить память целого мира. Ваша экспедиция дала этим голосам будущее.</p>` : ""}<div class="modal-actions"><button class="secondary-button" id="journal-map"><i data-lucide="map"></i> Открыть карту</button></div>`,
    "ЛИЧНЫЙ АРХИВ / А. ВОЛКОВ",
  );
  $("journal-map").onclick = openMap;
}
function openMap() {
  showModal(
    "Плато забвения",
    "map",
    `<p>Сектор 07 · Некрополь Эха. ${state.scanned ? "Выберите объект для автоматического перехода." : "Просканируйте поверхность, чтобы локализовать реликвии."}</p><div class="field-map"><svg viewBox="0 0 560 330" fill="none" stroke="#9db3a1" stroke-width="1"><path d="M-20 140Q60-50 175 65T380 50T600 70M-20 156Q60-34 175 81T380 66T600 86M-20 172Q60-18 175 97T380 82T600 102M-20 188Q60-2 175 113T380 98T600 118M-20 204Q60 14 175 129T380 114T600 134M-20 220Q60 30 175 145T380 130T600 150M-20 236Q60 46 175 161T380 146T600 166M-20 252Q60 62 175 177T380 162T600 182M-20 268Q60 78 175 193T380 178T600 198M-20 284Q60 94 175 209T380 194T600 214M-20 300Q60 110 175 225T380 210T600 230M-20 316Q60 126 175 241T380 226T600 246"/><circle cx="280" cy="125" r="41" stroke-width="7"/><path d="M244 144v27h72v-27M267 179v82M293 179v82"/><path d="M120 110l45 25-14 18-45-25zM400 200l24-51 14 7-24 51z"/></svg><span class="north">↑ N</span>${SITES.map((site, i) => `<button class="map-site" data-site="${i}" style="left:${[30, 73, 50][i]}%;top:${[62, 51, 30][i]}%" aria-label="Перейти к объекту ${site.name}"><span></span>${state.scanned ? (state.relics[i].decoded ? "✓ " + site.name : site.name) : "НЕИЗВЕСТНО"}</button>`).join("")}<span class="map-you" style="left:${Math.max(5, Math.min(95, 50 + world.camera.position.x * 0.5))}%;bottom:${Math.max(8, Math.min(82, 26 - world.camera.position.z * 0.27))}%">ВЫ</span></div><div class="map-legend"><span>◇ АРХЕОЛОГИЧЕСКИЙ СИГНАЛ</span><span>СХЕМА СЕКТОРА · 120 × 120 М</span></div><div class="modal-actions"><button class="secondary-button" id="return-position"><i data-lucide="navigation"></i> Вернуться к точке высадки</button></div>`,
  );
  document
    .querySelectorAll("[data-site]")
    .forEach((b) => (b.onclick = () => visitSite(Number(b.dataset.site))));
  $("return-position").onclick = () => {
    world.resetView();
    pendingInspection = -1;
    closeModal();
    notify(
      "Точка высадки",
      "Координаты восстановлены. Экспедиция продолжается.",
    );
  };
}
function artifactSVG(index) {
  const shapes = [
    `<path d="M57 12L91 44 83 129 52 151 27 113 32 47Z" fill="#334e47" stroke="#809b75"/><path d="M57 12L54 66 83 129M32 47L54 66 27 113M54 66L52 151" fill="none" stroke="#688569"/><path d="M54 75v39m-9-28l18 10m-20 8l19-21" fill="none" stroke="#c9dfa8" stroke-width="2"/>`,
    `<ellipse cx="58" cy="83" rx="43" ry="49" fill="none" stroke="#6d886a" stroke-width="8"/><ellipse cx="58" cy="83" rx="33" ry="39" fill="none" stroke="#b6c799" stroke-width="1"/><path d="M58 28v24M58 114v24M12 83h24M80 83h24" stroke="#c6d9aa" stroke-width="2"/><path d="M58 59l17 24-17 25-17-25z" fill="#8fa87f" stroke="#d5e8b2"/>`,
    `<path d="M58 17l41 29 5 63-46 35-42-35 1-63z" fill="#456350" stroke="#a8bb88"/><path d="M58 17l-1 52-40-23m40 23l42-23m-42 23l47 40m-47-40l1 75m-1-75l-41 40" fill="none" stroke="#85a576"/><path d="M58 52l18 32-18 33-17-33z" fill="#b5d59c"/>`,
  ];
  return `<svg viewBox="0 0 116 165" aria-hidden="true">${shapes[index]}</svg>`;
}
function openArtifact(index) {
  activeRelic = index;
  const site = SITES[index],
    r = state.relics[index];
  showModal(
    site.name,
    "artifact",
    `<div class="artifact-inspection"><div class="artifact-visual ${r.clean >= 100 ? "clean" : ""}">${artifactSVG(index)}<div class="artifact-dust" id="artifact-dust" style="opacity:${1 - r.clean / 100}"></div><small>${site.code} / ОБЪЕКТ ${index + 1}</small></div><div class="artifact-info"><div class="relic-meta">${site.code} · ВОЗРАСТ ${site.age}<br>СТАТУС: ${r.decoded ? "АРХИВИРОВАНО" : r.clean >= 100 ? "ГОТОВ К ДЕШИФРОВКЕ" : "МИНЕРАЛЬНЫЕ ОТЛОЖЕНИЯ"}</div><h3>${r.decoded ? "Голос из прошлого" : r.clean >= 100 ? "Услышать прошлое" : "Под слоем времени"}</h3><p>${r.decoded ? site.story : site.description}</p></div></div><div id="artifact-step"></div>`,
    "ПОЛЕВАЯ ЛАБОРАТОРИЯ / ИССЛЕДОВАНИЕ",
  );
  activeRelic = index;
  renderArtifactStep();
}
function renderArtifactStep() {
  const index = activeRelic,
    r = state.relics[index],
    site = SITES[index];
  if (r.decoded) {
    $("artifact-step").innerHTML =
      `<div class="complete-mark"><i data-lucide="check"></i> Память восстановлена. Запись добавлена в журнал.</div><div class="modal-actions"><button class="primary-button" id="artifact-done">${state.completed ? "Прочитать историю" : "Продолжить исследование"} <i data-lucide="arrow-right"></i></button></div>`;
    refreshIcons();
    $("artifact-done").onclick = state.completed ? journal : closeModal;
    return;
  }
  if (r.clean < 100) {
    $("artifact-step").innerHTML =
      `<div class="excavation-progress"><div><span>01 / МИКРОАБРАЗИВНАЯ ОЧИСТКА</span><span id="clean-percent">${Math.floor(r.clean)}%</span></div><div class="progress-track"><span id="clean-progress" style="width:${r.clean}%"></span></div></div><button class="primary-button clean-button" id="clean-button"><i data-lucide="brush"></i> Удерживайте, чтобы очистить</button><p class="subtle">Удалите минеральный слой, не повреждая поверхность. Можно удерживать кнопку, Enter или нажимать несколько раз.</p>`;
    refreshIcons();
    const b = $("clean-button");
    b.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      startCleaning();
    });
    b.addEventListener("pointerup", () => {
      if (cleanHeld) advanceCleaning(9);
      stopCleaning();
    });
    b.addEventListener("pointercancel", stopCleaning);
    b.addEventListener("keydown", (e) => {
      if (["Enter", "Space"].includes(e.code)) {
        e.preventDefault();
        if (!e.repeat) startCleaning();
      }
    });
    b.addEventListener("keyup", (e) => {
      if (["Enter", "Space"].includes(e.code)) {
        e.preventDefault();
        stopCleaning();
      }
    });
    b.addEventListener("click", (e) => {
      if (e.detail === 0 && !cleanHeld) advanceCleaning(12);
    });
  } else {
    const values = [0, 0, 0];
    $("artifact-step").innerHTML =
      `<div class="excavation-progress"><div><span>02 / ДЕШИФРОВКА ПАМЯТИ</span><span>ТРИАДА СИМВОЛОВ</span></div></div><p>Сопоставьте символы с сохранившейся надписью. Нажимайте на ячейки, чтобы менять знаки.</p><div class="glyph-clue" aria-label="Надпись: ${site.glyphs.map((v) => GLYPHS[v]).join(" ")}">${site.glyphs.map((v) => GLYPHS[v]).join(" ")}</div><div class="glyph-puzzle">${values.map((v, i) => `<button class="glyph-button" data-glyph="${i}" aria-label="Символ ${i + 1}: ${GLYPHS[v]}">${GLYPHS[v]}</button>`).join("")}</div><div class="decode-feedback" id="decode-feedback" role="status">Восстановите последовательность слева направо.</div><div class="modal-actions"><button class="primary-button" id="decode-button"><i data-lucide="sparkles"></i> Восстановить запись</button></div>`;
    refreshIcons();
    document.querySelectorAll("[data-glyph]").forEach(
      (b) =>
        (b.onclick = () => {
          const n = Number(b.dataset.glyph);
          values[n] = (values[n] + 1) % 4;
          b.textContent = GLYPHS[values[n]];
          b.setAttribute("aria-label", `Символ ${n + 1}: ${GLYPHS[values[n]]}`);
          audio.tone(260 + values[n] * 80, 0.12);
        }),
    );
    $("decode-button").onclick = () => {
      if (decodeRelic(state, index, values, site.glyphs)) {
        save();
        syncUI();
        audio.discovery();
        openArtifact(index);
        if (state.completed)
          notify(
            "Экспедиция завершена",
            "Три голоса. Одна история. Архив Эребуса восстановлен.",
            7000,
          );
        else
          notify(
            "Новая запись в журнале",
            `«${site.name}» · Восстановлено ${countRelics(state)} из 3 фрагментов.`,
          );
      } else {
        $("decode-feedback").textContent =
          "Последовательность не совпадает. Сравните знаки с надписью.";
        audio.tone(130, 0.2);
      }
    };
  }
}
function startCleaning() {
  if (cleanHeld) return;
  cleanHeld = true;
  audio.tone(180, 0.3);
  cleaningTimer = setInterval(() => advanceCleaning(1.8), 65);
}
function advanceCleaning(amount) {
  if (activeRelic < 0 || modalType !== "artifact") return;
  const complete = cleanRelic(state, activeRelic, amount),
    r = state.relics[activeRelic];
  if ($("clean-percent"))
    $("clean-percent").textContent = `${Math.floor(r.clean)}%`;
  if ($("clean-progress")) $("clean-progress").style.width = `${r.clean}%`;
  if ($("artifact-dust")) $("artifact-dust").style.opacity = 1 - r.clean / 100;
  if (complete) {
    stopCleaning();
    audio.tone(550, 0.4);
    save();
    openArtifact(activeRelic);
  }
}
function stopCleaning() {
  clearInterval(cleaningTimer);
  if (cleanHeld) save();
  cleanHeld = false;
}
async function toggleAudio() {
  try {
    const on = await audio.toggle();
    $("audio-toggle").innerHTML =
      `<i data-lucide="${on ? "volume-2" : "volume-x"}"></i>`;
    $("audio-toggle").setAttribute(
      "aria-label",
      on ? "Выключить звук" : "Включить звук",
    );
    $("audio-toggle").setAttribute("aria-pressed", String(on));
    if ($("setting-sound")) {
      $("setting-sound").classList.toggle("on", on);
      $("setting-sound").setAttribute("aria-checked", String(on));
    }
    refreshIcons();
  } catch {
    notify("Звук недоступен", "Этот браузер не разрешил запуск аудиосистемы.");
  }
}
function settings() {
  showModal(
    "Настройки экспедиции",
    "settings",
    `<div class="setting-row"><label for="quality">Качество изображения<small>Тени, плотность пикселей и частицы пыли</small></label><select id="quality"><option value="high" ${world.quality === "high" ? "selected" : ""}>Высокое</option><option value="low" ${world.quality === "low" ? "selected" : ""}>Производительность</option></select></div><div class="setting-row"><div>Звуковая атмосфера<small>Ветер, низкий гул и отклик приборов</small></div><button id="setting-sound" class="toggle ${audio.enabled ? "on" : ""}" role="switch" aria-checked="${audio.enabled}" aria-label="Звуковая атмосфера"></button></div><div class="setting-row"><label for="volume">Громкость</label><input id="volume" type="range" min="0" max="100" value="${audio.volume * 100}"/></div><div class="setting-row"><label for="sensitivity">Чувствительность обзора</label><input id="sensitivity" type="range" min="30" max="180" value="${world.sensitivity * 100}"/></div><div class="setting-row"><div>Уменьшить движение<small>Отключает колебания реликвий и движение пыли</small></div><button id="setting-motion" class="toggle ${world.reducedMotion ? "on" : ""}" role="switch" aria-checked="${world.reducedMotion}" aria-label="Уменьшить движение"></button></div><p class="subtle">Прогресс исследований сохраняется автоматически на этом устройстве. Аудио и параметры графики действуют до перезагрузки страницы.</p><div class="modal-actions"><button class="secondary-button" id="reset-expedition"><i data-lucide="rotate-ccw"></i> Новая экспедиция</button><button class="primary-button" id="settings-done">Готово</button></div>`,
  );
  $("quality").onchange = (e) => world.setQuality(e.target.value);
  $("volume").oninput = (e) => audio.setVolume(Number(e.target.value) / 100);
  $("sensitivity").oninput = (e) =>
    (world.sensitivity = Number(e.target.value) / 100);
  $("setting-sound").onclick = toggleAudio;
  $("setting-motion").onclick = () => {
    world.reducedMotion = !world.reducedMotion;
    $("setting-motion").classList.toggle("on", world.reducedMotion);
    $("setting-motion").setAttribute(
      "aria-checked",
      String(world.reducedMotion),
    );
  };
  $("settings-done").onclick = closeModal;
  $("reset-expedition").onclick = () => {
    showModal(
      "Начать заново?",
      "reset",
      `<p class="lead">Все восстановленные записи и результаты очистки будут удалены из локального журнала.</p><p>Эребус снова станет неизведанным.</p><div class="modal-actions"><button class="secondary-button" id="cancel-reset">Отмена</button><button class="primary-button" id="confirm-reset">Начать новую экспедицию</button></div>`,
    );
    $("cancel-reset").onclick = settings;
    $("confirm-reset").onclick = () => {
      state = initialState();
      save();
      pendingInspection = -1;
      scanRunning = false;
      document.body.classList.remove("scanning");
      $("scan-status").hidden = true;
      $("scan-button").disabled = false;
      $("scan-button").querySelector("strong").textContent = "Сканировать";
      world.resetView();
      world.relics.forEach((r) => {
        r.collected = false;
        r.point.intensity = 6;
      });
      syncUI();
      closeModal();
      notify(
        "Новая экспедиция",
        "Все системы готовы. Просканируйте руины, чтобы начать.",
      );
    };
  };
}
function togglePhoto() {
  photoMode = !photoMode;
  document.body.classList.toggle("photo-mode", photoMode);
  $("exit-photo").hidden = !photoMode;
  if (photoMode) {
    $("notification").classList.remove("show");
    document.activeElement?.blur();
  } else $("photo-button").focus();
}
$("scan-button").onclick = beginScan;
$("journal-button").onclick = journal;
$("map-button").onclick = openMap;
$("minimap-button").onclick = openMap;
$("photo-button").onclick = togglePhoto;
$("exit-photo").onclick = togglePhoto;
$("help-button").onclick = help;
$("brand").onclick = (e) => {
  e.preventDefault();
  help();
};
$("settings-button").onclick = settings;
$("audio-toggle").onclick = toggleAudio;
$("close-modal").onclick = closeModal;
$("modal-backdrop").addEventListener("click", (e) => {
  if (e.target === $("modal-backdrop")) closeModal();
});
window.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    if (modalOpen) closeModal();
    else if (photoMode) togglePhoto();
    else if (world?.travel) {
      world.travel = null;
      pendingInspection = -1;
    }
    return;
  }
  if (modalOpen && e.code === "Tab") {
    const focusables = $("modal").querySelectorAll(
      'button:not([disabled]),input,select,[tabindex="0"]',
    );
    const first = focusables[0],
      last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
    return;
  }
  if (
    modalOpen ||
    !world ||
    e.repeat ||
    ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)
  )
    return;
  if (e.code === "KeyP") {
    togglePhoto();
    return;
  }
  if (photoMode) return;
  if (e.code === "KeyQ") {
    e.preventDefault();
    beginScan();
  }
  if (e.code === "KeyJ") journal();
  if (e.code === "KeyM") openMap();
  if (e.code === "KeyE") {
    let closest = 0;
    SITES.forEach((_, i) => {
      if (world.distance(i) < world.distance(closest)) closest = i;
    });
    visitSite(closest);
  }
});
window.addEventListener("blur", stopCleaning);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopCleaning();
    world?.keys.clear();
  }
});
const touch = document.createElement("div");
touch.className = "touch-controls";
touch.innerHTML = `<button data-move="KeyW" aria-label="Вперёд"><i data-lucide="arrow-up"></i></button><button data-move="KeyA" aria-label="Влево"><i data-lucide="chevron-left"></i></button><button data-move="KeyS" aria-label="Назад"><i data-lucide="arrow-down"></i></button><button data-move="KeyD" aria-label="Вправо"><i data-lucide="chevron-right"></i></button>`;
$("app").appendChild(touch);
touch.querySelectorAll("button").forEach((b) => {
  b.onpointerdown = (e) => {
    if (!world?.enabled) return;
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    world.keys.add(b.dataset.move);
  };
  b.onpointerup = b.onpointercancel = () => world?.keys.delete(b.dataset.move);
});
refreshIcons();
function bootError(error) {
  $("boot").classList.add("boot-error");
  $("boot").innerHTML =
    `<div class="boot-title">PALIMPSEST</div><p>ТРЁХМЕРНЫЙ ДВИЖОК НЕДОСТУПЕН<br>Включите аппаратное ускорение и WebGL 2 в настройках браузера.</p><button class="primary-button" id="reload-world">Перезапустить экспедицию</button>`;
  $("reload-world").onclick = () => location.reload();
  console.error(error);
}
try {
  world = new World($("world"), {
    onReady: () => {
      $("boot").style.opacity = "0";
      setTimeout(() => ($("boot").hidden = true), 850);
      if (state.scanned)
        notify(
          "Добро пожаловать на Эребус",
          `Восстановлена экспедиция: ${countRelics(state)} из 3 записей.`,
          4500,
        );
    },
    onFrame: frame,
    onError: bootError,
  });
  if (world.renderer) {
    createMarkers();
    if (innerWidth < 760) world.setQuality("low");
  }
} catch (error) {
  bootError(error);
}

/** Read-only instrumentation for browser QA; no gameplay state is exposed. */
export function getDiagnostics() {
  if (!world?.renderer) return null;
  const info = world.renderer.info;
  return {
    drawCalls: info.render.calls,
    triangles: info.render.triangles,
    geometries: info.memory.geometries,
    textures: info.memory.textures,
    quality: world.quality,
  };
}
