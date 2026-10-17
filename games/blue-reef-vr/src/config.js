// Голубой риф VR — единые числа мира и пресеты качества.
// Все расстояния в метрах: так «20 см стереобазиса» не превращается в 20 мировых единиц.

export const WORLD = {
  seabedY: 0,        // песчаное дно
  surfaceY: 17,      // поверхность воды (~10.6 м над глазами пловца)
  eyeY: 6.4,         // глаза ребёнка: 6.4 м над дном
  clearing: 9.5,     // радиус свободной поляны: кораллы начинаются за ним
  reefRadius: 46,    // внешняя граница рифа
  fogColor: 0x1f86a0,
  fogDensity: 0.019, // видимость порядка 50 м
  sunDir: [-0.22, 1, 0.18],
};

// Пределы обзора головой утверждены контрактом: ±70° в стороны, ±45° вверх/вниз.
export const LOOK = {
  maxYawDeg: 70,
  maxPitchDeg: 45,
  smoothing: 7,      // чем больше, тем быстрее взгляд догоняет метку
};

export const VR_BASELINE_MIN_CM = 10;
export const VR_BASELINE_MAX_CM = 150;
export const VR_BASELINE_DEFAULT_CM = 64; // человеческое межзрачковое — самое безопасное начало

export const LOOK_MODES = {
  forward: { id: 'forward', label: 'Прямо', hint: 'Камера смотрит вперёд, метки не нужны' },
  camera: { id: 'camera', label: 'По метке', hint: 'Одна цветная коробка перед ребёнком' },
  'camera-dual': { id: 'camera-dual', label: 'По двум меткам', hint: 'Две коробки: слева и справа' },
};

// Ручные пресеты: игра сама ничего не ухудшает (так выбрал пользователь).
// `antialias` задаётся один раз при создании WebGLRenderer и на ходу не
// меняется — в прогонах он включён всегда, поэтому поле оставлено как намерение
// пресета и в расчёт не берётся.
export const PRESETS = {
  beautiful: {
    id: 'beautiful', label: 'Красиво', hint: 'Максимум деталей. Для мощного телефона и обычного экрана.',
    dpr: 1.75, fish: 1, corals: 1, particles: 4200, rays: 14, bubbles: 260,
    seabedSegments: 200, causticOctaves: 3, bloom: true, antialias: true,
  },
  balanced: {
    id: 'balanced', label: 'Сбалансированно', hint: 'Нормальный выбор для VR-очков.',
    dpr: 1.25, fish: 0.62, corals: 0.72, particles: 2200, rays: 9, bubbles: 160,
    seabedSegments: 144, causticOctaves: 2, bloom: false, antialias: true,
  },
  smooth: {
    id: 'smooth', label: 'Плавно', hint: 'Всё ради ровного движения. Рекомендуем для VR.',
    dpr: 1.0, fish: 0.34, corals: 0.45, particles: 1000, rays: 5, bubbles: 90,
    seabedSegments: 96, causticOctaves: 2, bloom: false, antialias: false,
  },
};
export const PRESET_ORDER = ['beautiful', 'balanced', 'smooth'];
export const DEFAULT_PRESET = 'balanced';

export function presetOf(id) {
  return PRESETS[id] || PRESETS[DEFAULT_PRESET];
}

export const STORAGE_KEY = 'brvr_settings_v1';

export const DEFAULT_SETTINGS = {
  lookMode: 'camera-dual',
  baselineCm: VR_BASELINE_DEFAULT_CM,
  preset: DEFAULT_PRESET,
  camColor: 'raspberry',
  camHue: null,
  camLeftColor: 'orange',
  camLeftHue: null,
  camRightColor: 'raspberry',
  camRightHue: null,
  camTol: 26,
  camSat: 42,
};
