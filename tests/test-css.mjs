// =============================================================================
//  tests/test-css.mjs — сторож оформления.
//  Визуальный слой ломается тихо: класс остаётся в разметке, а правило для него
//  теряется при правке стилей, и элемент оформляется браузерным дефолтом.
//  Ни линковка ESM, ни отрисовка, ни ui-smoke такого не ловят — нужен отдельный
//  статический набор. Плюс проверка процедурного арта: он рисуется математикой,
//  и регрессия там тоже невидима до глазами.
// =============================================================================
import { readFileSync } from 'node:fs';
import { suite, test, ok, eq } from './harness.mjs';
import { markupClasses, styledClasses } from '../tools/check-css.mjs';
import * as art from '../src/ui/art.js';
import { generateCard } from '../src/engine/cardgen.js';
import { GEARS, DOMAINS } from '../src/engine/gears.js';

const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

// Имена, которые классами не являются: обрезки шаблонных строк и префиксы
// динамических модификаторов (`brow--${side}` → в CSS есть .brow--me/.brow--foe).
const ALLOW = new Set([
  // обрезки шаблонных строк: `id="${x}"`, `class: \`card--${size}\`` и т. п.
  'cls', 'coverage', 'i', 'id', 'kind', 'next', 'goal__t',
  'brow--', 'fx-banner--', 'fx-flash--', 'fx-float--', 'leader--', 'log--',
  'scout__odds--', 'scout__tip--', 'screen--', 'title__gear--', 'toast--',
]);

const BP3 = generateCard(['stonework', 'phalanx', 'cavalry'], { era: 2, rngSeed: 'css' });
ok(BP3, 'тестовая карта из трёх открытий собирается');

suite('Оформление: целостность и покрытие');

test('таблица стилей синтаксически целая', () => {
  let open = 0, close = 0;
  for (const ch of css) { if (ch === '{') open++; if (ch === '}') close++; }
  eq(open, close, 'скобок открывается и закрывается поровну');
  ok(open > 400, `правил много, файл не выхолостен: ${open} блоков`);
  ok(css.length > 40000, `объём ${(css.length / 1024).toFixed(0)} КБ`);
});

test('каждый класс из разметки оформлен', () => {
  const naked = [...markupClasses()].filter((c) => !styledClasses(css).has(c) && !ALLOW.has(c));
  eq(naked.length, 0, naked.length ? 'классы без правил: ' + naked.join(' ') : 'висячих классов нет');
});

test('покрытие классов не деградирует', () => {
  const markup = [...markupClasses()].filter((c) => !ALLOW.has(c));
  const styled = styledClasses(css);
  const covered = markup.filter((c) => styled.has(c)).length;
  ok(covered / markup.length > 0.94,
    `оформлено ${covered} из ${markup.length} (${Math.round((covered / markup.length) * 100)}%)`);
});

test('оформление покрывает и классы, на которые завязаны UI-тесты', () => {
  // эти селекторы ищут тесты интерфейса: потеря правила их не уронит,
  // но элемент перестанет выглядеть так, как задумано
  const styled = styledClasses(css);
  for (const c of ['disc__add--triple', 'disc__star', 'triplecard', 'forecast__pair',
    'scout__odds', 'diag__row', 'block-console__incoming', 'atkrow__verdict',
    'fx-banner', 'handcell__go', 'res__v', 'rnode']) {
    ok(styled.has(c), `.${c} оформлен`);
  }
});

suite('Оформление: дизайн-система');

test('токены редкости задают четыре разных металла', () => {
  const grab = (t) => (css.match(new RegExp(t.replace(/[-]/g, '\\-') + ':\\s*([^;]+);')) || [])[1];
  const names = ['--metal-1-a', '--metal-2-a', '--metal-3-a', '--metal-4-a'];
  for (const t of names) ok(grab(t), `объявлен ${t}`);
  eq(new Set(names.map(grab)).size, 4, 'металлы различаются, а не скопированы');
});

test('редкости выше обычной переопределяют металл рамки', () => {
  for (const r of ['uncommon', 'rare', 'legendary']) {
    ok(new RegExp(`\\.rarity-${r}\\s*\\{[^}]*--m-a`).test(css), `.rarity-${r} задаёт --m-a`);
  }
});

test('движение и высота описаны токенами, а не разрозненными числами', () => {
  for (const t of ['--e-out', '--e-spring', '--t-2', '--el-3', '--bevel', '--inset', '--r-lg', '--s-4']) {
    ok(css.includes(t + ':'), `токен ${t} объявлен`);
  }
  const raw = (css.match(/transition:[^;]*?\d+m?s/g) || []).length;
  ok(raw < 8, `переходов с числами мимо токенов мало: ${raw}`);
});

test('фактуры объявлены токенами и реально применяются', () => {
  for (const t of ['--tex-grain', '--tex-grid', '--tex-brushed', '--tex-felt']) {
    ok(css.includes(t + ':'), `${t} объявлен`);
    ok(css.split(t).length > 2, `${t} применяется, а не висит мёртвым токеном`);
  }
});

suite('Оформление: слои страницы');

test('атмосферный слой на месте и не мешает взаимодействию', () => {
  ok(html.includes('class="ambient"'), 'в index.html есть .ambient');
  ok(html.includes('ambient__gear--a') && html.includes('ambient__gear--c'), 'силуэты шестерён');
  ok(/\.ambient\s*\{[^}]*pointer-events:\s*none/.test(css), 'слой не ловит указатель');
  ok(/class="ambient" aria-hidden="true"/.test(html), 'слой скрыт от читалок');
});

test('интерфейс поднят над атмосферой', () => {
  ok(/#app\s*\{[^}]*z-index:\s*1/.test(css), 'у #app z-index поверх фона');
});

test('.view остаётся скролл-контейнером, а бой монтируется в корень', () => {
  // регрессия была реальной: .screen случайно сделали скроллером, и боевой
  // экран, который монтируется мимо .view, потерял бы раскладку
  ok(/\.view\s*\{[^}]*overflow:\s*auto/.test(css), '.view прокручивается');
  ok(/\.screen\s*\{[^}]*min-height:\s*100%/.test(css), '.screen растянут на высоту');
});

test('карта умеет объёмный наклон и он отключаем', () => {
  ok(/\.card--tilt:hover/.test(css), 'есть правило наклона');
  ok(/\.card::before\s*\{[^}]*var\(--mx\)/.test(css), 'блик следует за указателем');
  const rm = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  ok(/\.card--tilt:hover\s*\{[^}]*transform:\s*none/.test(rm), 'наклон гасится при «меньше движения»');
  ok(/\.card--tilt:hover\s*\{[^}]*transform:\s*none/.test(css.slice(css.indexOf('@media (hover: none)'))),
    'на тач-устройствах наклона нет');
});

test('легендарная карта отличается анимацией фольги', () => {
  ok(/\.rarity-legendary \.card__art::before/.test(css), 'есть слой фольги');
  ok(/@keyframes foil/.test(css), 'фольга анимирована');
});

test('«меньше движения» гасит всю декоративную анимацию', () => {
  const rm = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  ok(rm.includes('.ambient__gear'), 'фоновые шестерни останавливаются');
  ok(rm.includes('.title__gear'), 'шестерни заставки останавливаются');
  ok(rm.includes('animation-duration: .001ms'), 'общий сброс анимаций');
});

test('клавиатурная доступность сохранена', () => {
  ok(/:focus-visible\s*\{[^}]*outline/.test(css), ':focus-visible с обводкой');
  ok(/\.skip:focus\s*\{[^}]*top:\s*0/.test(css), 'ссылка «К содержимому» выезжает по фокусу');
  ok(/\.bunit:focus-visible/.test(css), 'ячейка поля получает видимый фокус');
});

suite('Оформление: процедурный арт');

test('контур шестерни замкнут и даёт нужное число сегментов', () => {
  const d = art.gearPath(50, 50, 40, 10);
  ok(d.startsWith('M') && d.endsWith('Z'), 'контур замкнут');
  eq((d.match(/L/g) || []).length, 49, 'на 10 зубьев — 49 сегментов L (по 5 точек на зуб, первая — M)');
});

test('сигил детерминирован: одна карта — один арт', () => {
  // id уникальны на каждый вызов (иначе градиенты слипаются), поэтому
  // сравниваем геометрию, вычистив все ссылки на них: id=, href=, url(#…)
  const strip = (x) => x.replace(/id="[^"]*"|href="#[^"]*"|url\(#[^)]*\)/g, '');
  eq(strip(art.sigilSVG(BP3, 150)), strip(art.sigilSVG(BP3, 150)), 'повторный рендер совпадает');
});

test('сигил не плодит одинаковые id — иначе градиенты слипаются', () => {
  const ids = art.sigilSVG(BP3, 150).match(/id="[^"]+"/g) || [];
  eq(new Set(ids).size, ids.length, `все ${ids.length} id уникальны`);
});

test('два разных сигила на странице не перехватывают градиенты друг друга', () => {
  const a = art.sigilSVG(BP3, 150).match(/id="([^"]+)"/g) || [];
  // вторая карта — другая редкость, чтобы ids точно шли от нового вызова
  const bp2 = generateCard(['fire_mastery', 'stonework', 'phalanx', 'cavalry'], { era: 2, rngSeed: 'css2' }) || BP3;
  const b = (art.sigilSVG(bp2, 180).match(/id="([^"]+)"/g) || []);
  eq(a.filter((x) => b.includes(x)).length, 0, 'пересечений id между картами нет');
});

test('арт не распухает: сигил легче 12 КБ', () => {
  const bytes = art.sigilSVG(BP3, 150).length;
  ok(bytes < 12000, `сигил ${bytes} байт`);
});

test('мелкие шестерни плоские, крупные — с металлом', () => {
  const small = art.gearSVG('alloy', 13);
  const big = art.gearSVG('alloy', 34);
  ok(!small.includes('radialGradient'), 'на 13px градиента нет — не читается');
  ok(big.includes('radialGradient'), 'на 34px металл есть');
  ok(small.includes('class="gear"') && big.includes('class="gear"'), 'класс сохранён для стилей');
});

test('все шестерни и все домены рисуются без падения', () => {
  for (const g of Object.keys(GEARS)) ok(art.gearSVG(g, 26).includes('<svg'), `шестерня ${g}`);
  for (const d of Object.keys(DOMAINS)) {
    const svg = art.sigilSVG({ ...BP3, domain: d }, 120);
    ok(svg.includes('class="sigil"'), `домен ${d} отрисован`);
  }
});

test('колесо с несколькими шестернями одного типа показывает множитель', () => {
  const svg = art.sigilSVG(BP3, 150);
  ok(svg.includes('×2'), 'сдвоенная шестерня подписана ×2');
  ok(svg.includes('class="wheel"'), 'колёса размечены классом для анимации');
});

test('циферблат эпохи отмечает пройденные эпохи', () => {
  const e1 = art.sigilSVG({ ...BP3, era: 1 }, 150);
  const e5 = art.sigilSVG({ ...BP3, era: 5 }, 150);
  const dots = (s) => (s.match(/opacity="\.85"\/>/g) || []).length;
  ok(dots(e5) > dots(e1), `в V эпохе меток больше (${dots(e5)} против ${dots(e1)})`);
});
