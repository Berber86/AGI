import './styles.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Не найден корневой элемент #app');
}

app.innerHTML = `
  <main class="shell" aria-labelledby="game-title">
    <section class="hero">
      <p class="eyebrow">Сессия 1 · проектирование</p>
      <h1 id="game-title">☢️ Emoji Wasteland Arena</h1>
      <p class="lead">
        Hello, game! Здесь появится пошаговая roguelike-арена про вылазки
        по лёгкому постапокалипсису, где все герои, враги и находки — эмодзи.
      </p>
      <div class="status-card" role="status" aria-live="polite">
        <span class="status-card__icon" aria-hidden="true">🛠️</span>
        <div>
          <strong>Сейчас готовится фундамент.</strong>
          <p>Игровая логика начнётся не раньше сессии 3 согласно README.</p>
        </div>
      </div>
    </section>
  </main>
`;
