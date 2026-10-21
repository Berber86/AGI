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
