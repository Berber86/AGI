import type { LogLine } from '@/engine/combat/log';

const TONE_CLS: Record<LogLine['tone'], string> = {
  neutral: 'text-slate-300',
  player: 'text-sky-300',
  enemy: 'text-red-300',
  crit: 'text-amber-300 font-bold',
  miss: 'text-slate-500 italic',
  death: 'text-red-400 font-semibold',
  system: 'text-amber-200 uppercase tracking-wide text-[10px]',
};

export function FightLog({ lines }: { lines: LogLine[] }) {
  return (
    <div className="space-y-0.5 font-mono text-xs leading-relaxed">
      {lines.map((l, i) => (
        <div key={i} className={TONE_CLS[l.tone]}>{l.text}</div>
      ))}
    </div>
  );
}
