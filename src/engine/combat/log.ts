import type { BattleEvent, BattleUnitState } from './combat.types';

export interface LogLine {
  text: string;
  tone: 'neutral' | 'player' | 'enemy' | 'crit' | 'miss' | 'death' | 'system';
  round: number;
}

/** Превращает событие боя в человекочитаемую строку. Чистая функция — используется UI и тестами. */
export function describeEvent(ev: BattleEvent, units: ReadonlyMap<string, BattleUnitState>): LogLine | null {
  const name = (id: string): string => {
    const u = units.get(id);
    return u ? `${u.icon} ${u.name}` : id;
  };
  const sideTone = (id: string): 'player' | 'enemy' => (units.get(id)?.side === 'player' ? 'player' : 'enemy');

  switch (ev.type) {
    case 'phase':
      return { text: ev.phase === 'surprise' ? '⚡ Фаза внезапной атаки' : '⚔️ Основная схватка', tone: 'system', round: 0 };
    case 'roundStart':
      return { text: `— Раунд ${ev.round} —`, tone: 'system', round: ev.round };
    case 'momentum':
      return { text: `⚡ Тактика: ${ev.tactic.toUpperCase()}`, tone: 'player', round: ev.round };
    case 'attack': {
      if (!ev.hit) return { text: `${name(ev.src)} промахивается по ${name(ev.tgt)}`, tone: 'miss', round: ev.round };
      const verb = ev.kind === 'cleave' ? 'рассекает' : ev.kind === 'counter' ? 'контратакует' : ev.kind === 'ranged' ? 'стреляет в' : 'бьёт';
      const parts = [`${name(ev.src)} ${verb} ${name(ev.tgt)}: ${ev.dmg} урона`];
      if (ev.crit) parts.push('КРИТ!');
      if (ev.absorbed > 0) parts.push(`(щит поглотил ${ev.absorbed})`);
      if (ev.surprise) parts.push('[внезапно]');
      parts.push(`→ ${ev.tgtHp} HP`);
      return { text: parts.join(' '), tone: ev.crit ? 'crit' : sideTone(ev.src), round: ev.round };
    }
    case 'dot':
      return { text: `${name(ev.tgt)} страдает от яда: ${ev.dmg} урона → ${ev.tgtHp} HP`, tone: 'neutral', round: ev.round };
    case 'heal':
      return { text: `${name(ev.tgt)} восстанавливает ${ev.amount} HP (${ev.source === 'regen' ? 'регенерация' : 'вампиризм'}) → ${ev.tgtHp} HP`, tone: 'neutral', round: ev.round };
    case 'status':
      if (ev.status === 'poison') return { text: `${name(ev.tgt)} отравлен (${ev.stacks} зар.)`, tone: 'neutral', round: ev.round };
      if (ev.status === 'stun') return { text: `${name(ev.tgt)} оглушён (${ev.stacks})`, tone: 'neutral', round: ev.round };
      if (ev.status === 'slow') return { text: `${name(ev.tgt)} замедлен (${ev.stacks})`, tone: 'neutral', round: ev.round };
      return { text: `${name(ev.tgt)} получает щит ${ev.stacks}`, tone: 'player', round: ev.round };
    case 'morale':
      if (Math.abs(ev.delta) < 10) return null; // мелкие колебания не засоряют лог
      return { text: `${name(ev.unit)}: мораль ${ev.delta > 0 ? '+' : ''}${ev.delta} (${ev.reason}) → ${ev.morale}`, tone: 'neutral', round: ev.round };
    case 'death':
      return { text: `☠️ ${name(ev.unit)} погибает${ev.killer ? ` от руки ${name(ev.killer)}` : ''}`, tone: 'death', round: ev.round };
    case 'rout':
      return { text: `🏳️ ${name(ev.unit)} обращается в бегство (мораль ${ev.morale})`, tone: 'death', round: ev.round };
    case 'advance':
      return { text: `${name(ev.unit)} продвигается вперёд: линия ${ev.fromLine} → ${ev.toLine}`, tone: 'neutral', round: ev.round };
    case 'skip':
      return ev.reason === 'stunned'
        ? { text: `${name(ev.unit)} оглушён и пропускает раунд`, tone: 'neutral', round: ev.round }
        : { text: `${name(ev.unit)} не находит цели`, tone: 'neutral', round: ev.round };
    case 'end': {
      const who = ev.winner === 'player' ? '🏆 Победа!' : ev.winner === 'enemy' ? '💀 Поражение' : '🤝 Ничья';
      return { text: `${who} (раундов: ${ev.rounds})`, tone: 'system', round: ev.rounds };
    }
  }
}

export function buildLog(events: readonly BattleEvent[], initial: readonly BattleUnitState[]): LogLine[] {
  const map = new Map(initial.map((u) => [u.id, u]));
  const out: LogLine[] = [];
  for (const ev of events) {
    const line = describeEvent(ev, map);
    if (line) out.push(line);
  }
  return out;
}
