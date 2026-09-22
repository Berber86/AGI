import { useMemo, useState } from 'react';
import { TECHS, TECH_ICON_META } from '@/data/techs';
import { canResearch, requirementClosure } from '@/engine/economy/techTree';
import { useGameStore } from '@/store/useGameStore';
import { describeTech } from './describe';

const NODE_W = 190;
const NODE_H = 64;
const COL_GAP = 110;
const ROW_GAP = 16;
const MARGIN = 34;

interface Pos {
  x: number;
  y: number;
}

function nodeClass(researched: boolean, available: boolean, highlighted: boolean): string {
  if (highlighted) return 'fill-amber-500/15 stroke-amber-400';
  if (researched) return 'fill-emerald-500/15 stroke-emerald-500/70';
  if (available) return 'fill-sky-500/10 stroke-sky-500/60';
  return 'fill-slate-900/70 stroke-slate-700';
}

export function TechGraph() {
  const d = useGameStore((s) => s.data);
  const research = useGameStore((s) => s.research);
  const [hovered, setHovered] = useState<string | null>(null);

  const layout = useMemo(() => {
    const positions = new Map<string, Pos>();
    let width = 0;
    let height = 0;
    for (let era = 1; era <= 3; era++) {
      const ids = TECHS.filter((t) => t.era === era);
      ids.forEach((t, i) => {
        positions.set(t.id, { x: MARGIN + (era - 1) * (NODE_W + COL_GAP), y: MARGIN + i * (NODE_H + ROW_GAP) });
      });
      width = Math.max(width, MARGIN + (era - 1) * (NODE_W + COL_GAP) + NODE_W + MARGIN);
      height = Math.max(height, MARGIN + ids.length * (NODE_H + ROW_GAP) - ROW_GAP + MARGIN);
    }
    const edges: { from: Pos; to: Pos; key: string }[] = [];
    for (const t of TECHS) {
      const to = positions.get(t.id)!;
      for (const r of t.requires) {
        const from = positions.get(r);
        if (from) edges.push({ from, to, key: `${r}->${t.id}` });
      }
    }
    return { positions, edges, width, height };
  }, []);

  const closure = useMemo(() => (hovered ? requirementClosure(hovered) : new Set<string>()), [hovered]);

  return (
    <div className="thin-scroll overflow-auto rounded-xl border border-slate-800 bg-slate-950/60" style={{ maxHeight: '64vh' }}>
      <svg width={layout.width} height={layout.height} className="min-w-full">
        {/* заголовки эр */}
        {[1, 2, 3].map((era) => (
          <text
            key={era}
            x={MARGIN + (era - 1) * (NODE_W + COL_GAP) + 4}
            y={MARGIN - 12}
            fontSize={11}
            className="fill-slate-500 uppercase"
            style={{ letterSpacing: '0.2em' }}
          >
            {['ЭРА I', 'ЭРА II', 'ЭРА III'][era - 1]}
          </text>
        ))}

        {/* связи */}
        {layout.edges.map((e) => {
          const midX = e.from.x + NODE_W + COL_GAP / 2 - 10;
          const y1 = e.from.y + NODE_H / 2;
          const y2 = e.to.y + NODE_H / 2;
          const active = hovered !== null && (e.key.startsWith(`${hovered}->`) || closure.has(e.key.split('->')[0]!) || e.key.split('->')[1] === hovered);
          return (
            <path
              key={e.key}
              d={`M ${e.from.x + NODE_W} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${e.to.x} ${y2}`}
              fill="none"
              strokeWidth={active ? 2.5 : 1.5}
              className={active ? 'stroke-amber-400/90' : 'stroke-slate-600/50'}
            />
          );
        })}

        {/* узлы */}
        {TECHS.map((t) => {
          const p = layout.positions.get(t.id)!;
          const researched = d.techs.includes(t.id);
          const available = canResearch(t, d.techs, d.resources.science).ok;
          const highlighted = hovered === t.id || closure.has(t.id);
          return (
            <g
              key={t.id}
              transform={`translate(${p.x},${p.y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => research(t.id)}
            >
              <title>{`${t.name} — ${t.description}`}</title>
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={10}
                strokeWidth={highlighted ? 2.5 : 1.5}
                className={nodeClass(researched, available, highlighted)}
              />
              <text x={10} y={22} fontSize={13} fontWeight={700} className="fill-slate-100">
                {t.icon} {t.name}
              </text>
              <text x={10} y={40} fontSize={11}>
                <tspan>{t.icons.map((ic) => TECH_ICON_META[ic].emoji).join('')}</tspan>
                <tspan className="fill-slate-400"> · 📜{t.cost}</tspan>
                {researched && <tspan className="fill-emerald-400"> ✓</tspan>}
              </text>
              <text x={10} y={55} fontSize={9} className="fill-slate-400">
                {describeTech(t).slice(0, 42)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
