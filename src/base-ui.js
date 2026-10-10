import {
  UPGRADES,
  cargoCount,
  researchCredits,
  deliverCargo,
  researchSpecimen,
  buyUpgrade,
  transmitArchive,
  equipment,
} from "./base-state.js";
import { glyphSVG } from "./glyphs.js";
import { STATIONS, BASE_POSITION } from "./base-world.js";

const REPORTS = [
  "Пластина — часть распределённого носителя памяти. Структура световых каналов позволила уточнить алгоритм обработки спектрального сигнала.",
  "Сплав кольца стабилизирует магнитную ось без источника питания. Анализ подтвердил искусственное происхождение материала.",
  "Центральный узел объединяет записи двух других находок. Контрольные последовательности согласованы: архив пригоден для передачи на орбиту.",
];
export function createBaseHub({
  getState,
  getWorld,
  sites,
  showModal,
  closeModal,
  beforeEnter,
  onChange,
  onInspect,
  onMap,
  notify,
}) {
  const $ = (id) => document.getElementById(id);
  const button = document.createElement("button");
  button.id = "base-button";
  button.className = "dock-tool";
  button.title = "Быстрый переход на базу [B]";
  button.setAttribute("aria-label", "Посадочный модуль — база");
  button.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 20V8l8-5 8 5v12H4Z M9 20v-8h6v8 M2 20h20 M7 9h2m6 0h2"/></svg><span>База</span><b id="cargo-badge" hidden>0</b>';
  document.querySelector(".tool-dock").append(button);
  const hud = document.createElement("section");
  hud.id = "base-hud";
  hud.hidden = true;
  hud.setAttribute("aria-label", "Посадочный модуль");
  hud.innerHTML = `<div class="base-heading"><div class="eyebrow">ЛИЧНАЯ БАЗА / СЕКТОР 07</div><h1>Странник<span> / 01</span></h1><p>Полевой научный модуль</p><div class="base-telemetry"><span>+21 °C</span><span>1,0 атм</span><span>ГЕРМОКОНТУР СТАБИЛЕН</span></div></div><div class="base-manifest glass"><small>ЭКСПЕДИЦИОННЫЙ МАНИФЕСТ</small><strong id="base-manifest-count"></strong><span id="base-manifest-hint"></span></div><div class="base-bottom"><p class="base-walk-hint">WASD — по кабине · Зажмите фон для обзора · E — ближайшая станция</p><nav class="base-stations" aria-label="Станции модуля">${STATIONS.map((s, i) => `<button data-station="${s.id}"><span>0${i + 1}</span><strong>${s.name}</strong><small>${s.subtitle}</small></button>`).join("")}<button id="base-map"><span>04</span><strong>Карта</strong><small>ПЛАНИРОВАНИЕ ВЫЛАЗКИ</small></button></nav><button class="secondary-button" id="leave-base">Выйти в поле <kbd>B</kbd></button></div>`;
  document.body.append(hud);
  const marker = document.createElement("button");
  marker.id = "base-marker";
  marker.className = "world-marker base-world-marker";
  marker.setAttribute("aria-label", "Войти в посадочный модуль");
  marker.innerHTML =
    '<span class="marker-diamond"></span><span class="marker-label"><span class="marker-name">СТРАННИК / БАЗА</span><small>БЫСТРЫЙ ПЕРЕХОД <kbd>B</kbd></small></span>';
  $("world-markers").append(marker);
  button.onclick = marker.onclick = () => enter();
  $("leave-base").onclick = () => leave();
  $("base-map").onclick = onMap;
  hud
    .querySelectorAll("[data-station]")
    .forEach((b) => (b.onclick = () => openStation(b.dataset.station)));
  function sync() {
    const s = getState(),
      cargo = cargoCount(s),
      researched = s.base.researched.filter(Boolean).length;
    $("cargo-badge").hidden = cargo === 0;
    $("cargo-badge").textContent = cargo;
    $("base-manifest-count").textContent =
      `${s.base.deposited.filter(Boolean).length} / 3 находки на борту`;
    $("base-manifest-hint").textContent = s.base.transmitted
      ? "Архив принят орбитальной станцией"
      : cargo
        ? `В рюкзаке: ${cargo}. Передайте находки лаборатории.`
        : researched === 3
          ? "Все исследования завершены. Передайте архив."
          : `Исследовано: ${researched} / 3 · Данные: ${researchCredits(s)}`;
    getWorld()?.syncBase(s.base);
  }
  function enter() {
    const w = getWorld();
    if (!w || w.inBase) return;
    closeModal();
    beforeEnter();
    w.enterBase(getState().base);
    document.body.classList.add("in-base");
    hud.hidden = false;
    sync();
    hud.querySelector("[data-station]").focus();
    notify(
      "Посадочный модуль «Странник»",
      "Лаборатория, коллекция и терминал доступны. B — вернуться к месту исследования.",
      4000,
    );
  }
  function leave() {
    const w = getWorld();
    if (!w?.inBase) return;
    closeModal();
    w.exitBase();
    document.body.classList.remove("in-base");
    hud.hidden = true;
    button.focus();
  }
  function changed(title, text) {
    onChange();
    sync();
    if (title) notify(title, text, 3500);
  }
  function tabs(active) {
    return `<nav class="base-tabs" aria-label="Разделы базы">${STATIONS.map((s) => `<button data-base-tab="${s.id}" aria-current="${s.id === active ? "page" : "false"}">${s.name}</button>`).join("")}</nav>`;
  }
  function bindTabs() {
    document
      .querySelectorAll("[data-base-tab]")
      .forEach((b) => (b.onclick = () => openStation(b.dataset.baseTab)));
  }
  function openStation(id) {
    if (!getWorld()?.inBase) return;
    if (id === "lab") laboratory();
    else if (id === "collection") collection();
    else terminal();
    bindTabs();
  }
  function laboratory() {
    const s = getState(),
      cargo = cargoCount(s);
    showModal(
      "Лаборатория модуля",
      "base-lab",
      `${tabs("lab")}<div class="base-intro"><div><span class="base-label">ПРИЁМ ОБРАЗЦОВ</span><h3>${cargo ? `${cargo} находки ожидают выгрузки` : "Приёмный лоток готов"}</h3><p>Расшифрованные в поле реликвии помещаются в рюкзак. Доставьте их сюда: каждый анализ открывает отчёт и даёт 1 единицу исследовательских данных.</p></div><button class="primary-button" id="deliver-cargo" ${cargo ? "" : "disabled"}>Выгрузить находки (${cargo})</button></div><div class="base-research-list">${sites
        .map((site, i) => {
          const deposited = s.base.deposited[i],
            done = s.base.researched[i];
          return `<article class="base-research-card ${done ? "done" : ""}"><span class="base-card-number">0${i + 1}</span><div><span class="base-label">${site.code} / ${done ? "АНАЛИЗ ЗАВЕРШЁН" : deposited ? "В ЛАБОРАТОРИИ" : s.relics[i].decoded ? "В РЮКЗАКЕ" : "ОБРАЗЕЦ НЕ НАЙДЕН"}</span><h3>${site.name}</h3><p>${done ? REPORTS[i] : deposited ? "Образец принят. Проведите структурный анализ, чтобы получить данные для улучшений." : "Найдите, очистите и расшифруйте объект на плато."}</p><button class="secondary-button" data-research="${i}" ${!deposited || done ? "disabled" : ""}>${done ? "Исследовано" : "Провести анализ · +1 данные"}</button></div></article>`;
        })
        .join("")}</div>`,
      "СТРАННИК / НАУЧНЫЙ ОТСЕК",
    );
    $("deliver-cargo").onclick = () => {
      const n = deliverCargo(getState());
      if (n) {
        changed("Груз принят", `${n} находки размещены в хранилище.`);
        openStation("lab");
      }
    };
    document.querySelectorAll("[data-research]").forEach(
      (b) =>
        (b.onclick = () => {
          if (researchSpecimen(getState(), Number(b.dataset.research))) {
            changed(
              "Анализ завершён",
              "Получена 1 единица данных. Улучшения доступны в терминале.",
            );
            openStation("lab");
          }
        }),
    );
  }
  function collection() {
    const s = getState();
    showModal(
      "Коллекция экспедиции",
      "base-collection",
      `${tabs("collection")}<p class="lead">Не трофеи. Свидетельства чужой жизни.</p><p>Доставленные предметы занимают витрины в кабине. Результаты полевого исследования и лабораторные отчёты сохраняются вместе с ними.</p><div class="collection-grid">${sites.map((site, i) => `<article class="collection-card ${s.base.deposited[i] ? "filled" : ""}"><div class="collection-emblem">${glyphSVG(site.glyphs[0])}</div><span class="base-label">ВИТРИНА 0${i + 1}</span><h3>${s.base.deposited[i] ? site.name : "Место для находки"}</h3><p>${s.base.deposited[i] ? `${site.age} · ${s.base.researched[i] ? "Исследовано" : "Ожидает анализа"}` : "Доставьте реликвию на базу."}</p><button class="secondary-button" data-specimen="${i}" ${s.base.deposited[i] ? "" : "disabled"}>Осмотреть в 3D</button></article>`).join("")}</div>`,
      "СТРАННИК / ХРАНИЛИЩЕ",
    );
    document.querySelectorAll("[data-specimen]").forEach(
      (b) =>
        (b.onclick = () => {
          const i = Number(b.dataset.specimen);
          if (getState().base.deposited[i]) onInspect(i);
        }),
    );
  }
  function terminal() {
    const s = getState(),
      credits = researchCredits(s),
      eq = equipment(s),
      ready = s.base.researched.every(Boolean);
    showModal(
      "Терминал экспедиции",
      "base-terminal",
      `${tabs("terminal")}<div class="base-credit-bar"><span>ИССЛЕДОВАТЕЛЬСКИЕ ДАННЫЕ</span><strong id="research-credits">${credits}</strong></div><div class="base-upgrades">${UPGRADES.map(
        (u) => {
          const owned = s.base.upgrades.includes(u.id);
          return `<article class="upgrade-card"><span class="base-label">${u.category}</span><h3>${u.name}</h3><p>${u.description}</p><button class="${owned ? "secondary" : "primary"}-button" data-upgrade="${u.id}" ${owned || credits < u.cost ? "disabled" : ""}>${owned ? "Установлено" : `Установить · ${u.cost} данные`}</button></article>`;
        },
      ).join(
        "",
      )}</div><p class="equipment-readout" id="equipment-readout">ТЕКУЩАЯ КОНФИГУРАЦИЯ: сканер ${eq.scanDuration.toFixed(1)} с · очистка ×${eq.cleaningMultiplier.toFixed(1)}</p><section class="base-uplink"><div class="base-label">ОРБИТАЛЬНЫЙ КАНАЛ / АРХИВ ЭРЕБУСА</div><h3>${s.base.transmitted ? "Передача подтверждена" : "Отправить результаты экспедиции"}</h3><p>${s.base.transmitted ? "«Странник, архив принят. Вы сохранили не просто данные — вы вернули этому миру место в нашей памяти. Возвращайтесь домой»." : `Готовность: ${s.base.researched.filter(Boolean).length} / 3 отчёта. Для передачи исследуйте все находки. Установка улучшений не обязательна.`}</p><button class="secondary-button" id="transmit-archive" ${!ready || s.base.transmitted ? "disabled" : ""}>${s.base.transmitted ? "Архив принят станцией" : "Передать архив на орбиту"}</button></section><div class="modal-actions"><button class="secondary-button" id="terminal-map">Планировать следующую вылазку</button></div>`,
      "СТРАННИК / БОРТОВОЙ КОМПЬЮТЕР",
    );
    document.querySelectorAll("[data-upgrade]").forEach(
      (b) =>
        (b.onclick = () => {
          if (buyUpgrade(getState(), b.dataset.upgrade)) {
            changed(
              "Оборудование обновлено",
              "Улучшение установлено и действует при следующем использовании инструмента.",
            );
            openStation("terminal");
          }
        }),
    );
    $("transmit-archive").onclick = () => {
      if (transmitArchive(getState())) {
        changed(
          "Архив передан",
          "Орбитальная станция подтвердила получение трёх исследований.",
        );
        openStation("terminal");
      }
    };
    $("terminal-map").onclick = onMap;
  }
  function frame() {
    const w = getWorld();
    if (!w) return;
    const p = w.project(BASE_POSITION);
    marker.style.display = !w.inBase && p.visible ? "flex" : "none";
    marker.style.left = `${p.x}px`;
    marker.style.top = `${p.y}px`;
  }
  function nearestStation() {
    const p = getWorld().camera.position;
    return STATIONS.reduce(
      (best, s) =>
        Math.hypot(s.position[0] - p.x, s.position[2] - p.z) <
        Math.hypot(best.position[0] - p.x, best.position[2] - p.z)
          ? s
          : best,
      STATIONS[0],
    ).id;
  }
  return { enter, leave, sync, frame, openStation, nearestStation };
}
