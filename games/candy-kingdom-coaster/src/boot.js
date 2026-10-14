// Keep boot failures recoverable instead of leaving a disabled Play button.
import { failLoading } from './loading.js';

document.getElementById('btn-reload').addEventListener('click', () => location.reload());

try {
  await import('./main.js');
} catch (error) {
  console.error('[CKC] Startup failed:', error);
  failLoading('Не удалось загрузить игру. Попробуй ещё раз.');
}
