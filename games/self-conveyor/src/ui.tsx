import { useState, type ReactNode } from 'react';

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span className="lbl">{label}</span>
      {children}
    </label>
  );
}

export function Check({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button className={`check ${on ? 'on' : ''}`} onClick={onToggle} aria-pressed={on}>
      {on ? '✓' : ''}
    </button>
  );
}

export function ErrorBox({ error }: { error: string | null }) {
  if (!error) return null;
  return <div className="error-box">{error}</div>;
}

/** Баннер «сырой черновик» для разделов этапов 2–3 */
export function DraftBanner({ stage, note }: { stage: 2 | 3; note?: string }) {
  return (
    <div className="draft-banner">
      <b>Черновик этапа {stage}</b> — работает грубо и в текущей итерации не дорабатывается.
      Фокус сейчас — этап 1 (база конвейера). {note}
    </div>
  );
}

/** Хелпер для ИИ-кнопок: спиннер-состояние и единый обработчик ошибок. */
export function useAIAction() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const run = async (key: string, fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(key);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };
  return { busy, error, run, setError };
}

export function Sparkline({
  points,
  width = 160,
  height = 42,
  color = '#4f8cff',
}: {
  points: { t: number; v: number }[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (points.length < 2) {
    return <svg width={width} height={height} />;
  }
  const vs = points.map((p) => p.v);
  const min = Math.min(...vs);
  const max = Math.max(...vs);
  const span = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (width - 6) + 3;
    const y = height - 5 - ((p.v - min) / span) * (height - 12);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={width} height={height}>
      <polyline points={coords.join(' ')} fill="none" stroke={color} strokeWidth="2" />
      <circle
        cx={coords[coords.length - 1].split(',')[0]}
        cy={coords[coords.length - 1].split(',')[1]}
        r="3"
        fill={color}
      />
    </svg>
  );
}

export function RadarChart({
  areas,
  size = 240,
}: {
  areas: { name: string; score: number }[];
  size?: number;
}) {
  const n = areas.length;
  if (n < 3) return null;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 26;
  const pt = (i: number, score: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const rad = (Math.max(0, Math.min(10, score)) / 10) * r;
    return [cx + rad * Math.cos(angle), cy + rad * Math.sin(angle)];
  };
  const poly = areas.map((a, i) => pt(i, a.score).join(',')).join(' ');
  const rings = [2, 4, 6, 8, 10].map((sc) => (
    <polygon
      key={sc}
      points={areas.map((_, i) => pt(i, sc).join(',')).join(' ')}
      fill="none"
      stroke="#2b3644"
      strokeWidth="1"
    />
  ));
  const labels = areas.map((a, i) => {
    const [x, y] = pt(i, 11.6);
    return (
      <text key={a.name + i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#8b98a8" fontSize="9.5">
        {a.name.length > 16 ? a.name.slice(0, 15) + '…' : a.name}
      </text>
    );
  });
  return (
    <svg width={size} height={size}>
      {rings}
      <polygon points={poly} fill="rgba(79,140,255,0.22)" stroke="#4f8cff" strokeWidth="2" />
      {areas.map((a, i) => {
        const [x, y] = pt(i, a.score);
        return <circle key={i} cx={x} cy={y} r="3" fill="#4f8cff" />;
      })}
      {labels}
    </svg>
  );
}
