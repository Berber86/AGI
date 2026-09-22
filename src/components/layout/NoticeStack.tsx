import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';

const TONE_CLS = {
  info: 'border-sky-500/40 bg-sky-950/80 text-sky-200',
  success: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-200',
  warn: 'border-red-500/40 bg-red-950/80 text-red-200',
} as const;

function Notice({ id, text, tone }: { id: number; text: string; tone: keyof typeof TONE_CLS }) {
  const dismiss = useGameStore((s) => s.dismissNotice);
  useEffect(() => {
    const t = setTimeout(() => dismiss(id), 6000);
    return () => clearTimeout(t);
  }, [id, dismiss]);
  return (
    <div className={`pointer-events-auto rounded-lg border px-3 py-2 text-xs shadow-lg backdrop-blur ${TONE_CLS[tone]}`}>
      {text}
    </div>
  );
}

export function NoticeStack() {
  const notices = useGameStore((s) => s.data.notices);
  return (
    <div className="pointer-events-none fixed right-3 top-14 z-50 flex w-72 flex-col gap-1.5">
      {notices.slice(-6).map((n) => (
        <Notice key={n.id} id={n.id} text={n.text} tone={n.tone} />
      ))}
    </div>
  );
}
