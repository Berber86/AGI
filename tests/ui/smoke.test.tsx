// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/App';
import { useGameStore } from '@/store/useGameStore';

function setupGame() {
  useGameStore.getState().hardReset();
  const st = useGameStore.getState();
  useGameStore.setState((s) => ({ data: { ...s.data, campaignSeed: 1234567 } }));
  st.hire('sq1', 'militia');
  st.hire('sq2', 'militia');
  st.hire('sq3', 'militia');
  const d = useGameStore.getState().data;
  useGameStore.setState((s) => ({
    data: { ...s.data, resources: { ...s.data.resources, food: d.resources.food } },
  }));
}

beforeEach(() => {
  cleanup();
  setupGame();
});

describe('UI smoke: приложение рендерится и петля кликабельна', () => {
  it('шапка и вкладки на месте', () => {
    render(<App />);
    // Заголовок встречается и в шапке, и в футере.
    expect(screen.getAllByText(/МЕХАНИЗМ ЦИВИЛИЗАЦИИ/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText(/Город/));
    expect(screen.getByText(/Доход за ход/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/Технологии/));
    expect(screen.getByText(/Иконки цивилизации/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/Мастерская/));
    expect(screen.getByText(/Слияние 3 → 1/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/Слава/));
    expect(screen.getByText(/Статистика командира/i)).toBeTruthy();
    expect(screen.getByText(/Испытания/i)).toBeTruthy();
    expect(screen.getByText(/Квестовые шестерёнки/i)).toBeTruthy();
    // Достижение «Первая кровь» ещё не выполнено, но квест-плитки отрисованы.
    expect(screen.getAllByText(/Победи Босса цикла/i).length).toBeGreaterThan(0);
  });

  it('полный боевой цикл: расстановка → бой → итог → продолжить', async () => {
    render(<App />);
    // Кампания открыта по умолчанию; оба узла слоя 1 боевые — берём первый доступный.
    const nodes = screen.getAllByTitle('Обычная стычка. 1 шестерёнка за победу.');
    fireEvent.click(nodes[0]!);
    // Модалка расстановки.
    expect(screen.getByText(/Расстановка/i)).toBeTruthy();
    expect(screen.getAllByText(/Наши отряды|Враги/i).length).toBeGreaterThan(0);
    // В бой!
    fireEvent.click(screen.getByText(/В бой!/));
    // Живой бой: дух и лог присутствуют.
    expect(screen.getByText(/Дух:/i)).toBeTruthy();
    // Мгновенный итог.
    fireEvent.click(screen.getByText(/Итог/));
    const cont = await waitFor(() => screen.getByText('Продолжить'), { timeout: 2000 });
    fireEvent.click(cont);
    // Оверлей закрылся, карта снова видна.
    expect(await waitFor(() => screen.getByText(/Стычка \(фарм\)/i))).toBeTruthy();
    const d = useGameStore.getState().data;
    expect(d.stats.battles).toBe(1);
    expect(d.stats.wins + d.stats.losses + d.stats.draws).toBe(1);
  });

  it('сталкичка через фарм-кнопку работает', async () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Стычка \(фарм\)/i));
    fireEvent.click(screen.getByText(/В бой!/));
    fireEvent.click(screen.getByText(/Итог/));
    fireEvent.click(await waitFor(() => screen.getByText('Продолжить'), { timeout: 2000 }));
    expect(useGameStore.getState().data.campaign.skirmishCount).toBe(1);
  });
});
