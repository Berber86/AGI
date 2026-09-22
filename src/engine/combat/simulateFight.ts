import type { Ability, ComputedUnit } from '@/engine/unit/unit.types';
import { createRng, type Rng } from '@/utils/rng';
import { MOMENTUM_RULES, MORALE_BREAK, type BattleEvent, type BattleOptions, type BattlePhase, type BattleResult, type BattleUnitState, type MomentumTactic, type Side } from './combat.types';
import { frontLine, isActive, selectCleaveTarget, selectTarget } from './targeting';

/** Константы боя. Вынесены, чтобы баланс правился в одном месте и был виден в тестах. */
export const COMBAT = {
  maxRounds: 30,
  hitFloor: 5,
  hitCeil: 100,
  varianceMin: 0.9,
  varianceMax: 1.1,
  surpriseMult: 1.25,
  /** Внезапная атака доступна, если скорость выше максимальной вражеской в столько раз. */
  ambushSpeedRatio: 1.25,
  poisonDmgPerStack: 3,
  poisonMaxStacks: 10,
  slowSpeedFactor: 0.6,
  stunMaxRounds: 3,
  slowMaxRounds: 3,
  morale: { allyDeath: -15, enemyDeath: 10, below50: -10, below25: -15, gotCrit: -5, routChancePerPoint: 4 },
  momentum: { rageDmgMult: 1.5, focusAcc: 30, focusCrit: 20, guardShield: 25, guardEva: 10 },
} as const;

function findAbility<K extends Ability['key']>(u: BattleUnitState, key: K): Extract<Ability, { key: K }> | undefined {
  return u.abilities.find((a) => a.key === key) as Extract<Ability, { key: K }> | undefined;
}

const isFearless = (u: BattleUnitState): boolean => u.tags.includes('fearless');

function toState(unit: ComputedUnit, side: Side): BattleUnitState {
  const shield = findAbility({ abilities: unit.abilities } as BattleUnitState, 'shield')?.amount ?? 0;
  const ward = unit.abilities.find((a) => a.key === 'wardOnStart');
  return {
    id: unit.id,
    side,
    name: unit.name,
    icon: unit.icon,
    recruitId: unit.recruitId,
    stats: { ...unit.stats },
    hp: unit.stats.hp,
    maxHp: unit.stats.hp,
    shield,
    morale: unit.stats.morale,
    poison: 0,
    stunRounds: 0,
    slowRounds: 0,
    wardCharges: ward?.charges ?? 0,
    wardPerCharge: ward?.perCharge ?? 0,
    bonusEva: 0,
    line: unit.line,
    column: unit.column,
    alive: true,
    routed: false,
    tags: [...unit.tags],
    abilities: unit.abilities.map((a) => ({ ...a })),
    targeting: unit.targeting,
    element: unit.element,
    rarity: unit.rarity,
    setCounts: { ...unit.setCounts },
    hpFlags: { below50: false, below25: false },
    kills: 0,
    damageDealt: 0,
  };
}

const clone = (u: BattleUnitState): BattleUnitState => ({
  ...u,
  stats: { ...u.stats },
  tags: [...u.tags],
  abilities: u.abilities.map((a) => ({ ...a })),
  setCounts: { ...u.setCounts },
  hpFlags: { ...u.hpFlags },
});

interface SimState {
  rng: Rng;
  units: BattleUnitState[];
  events: BattleEvent[];
  round: number;
  phase: BattlePhase;
  maxRounds: number;
  /** Ресурс Momentum. */
  spirit: number;
  /** Выбранная тактика, вступит в силу в начале следующего раунда. */
  pending: MomentumTactic | null;
  /** Тактика, действующая в текущем раунде. */
  active: MomentumTactic | null;
  /** Раунд последнего чекпоинта Momentum (использован или пропущен). */
  lastMomentumRound: number;
}

const alliesOf = (s: SimState, u: BattleUnitState): BattleUnitState[] => s.units.filter((x) => x.side === u.side);
const enemiesOf = (s: SimState, u: BattleUnitState): BattleUnitState[] => s.units.filter((x) => x.side !== u.side);
const activeCount = (s: SimState, side: Side): number => s.units.filter((u) => u.side === side && isActive(u)).length;

function changeMorale(s: SimState, u: BattleUnitState, delta: number, reason: string): void {
  if (!isActive(u) || delta === 0 || isFearless(u)) return;
  const next = Math.max(0, Math.min(150, u.morale + delta));
  if (next === u.morale) return;
  u.morale = next;
  s.events.push({ type: 'morale', round: s.round, unit: u.id, delta, morale: u.morale, reason });
}

function heal(s: SimState, u: BattleUnitState, amount: number, source: 'regen' | 'lifesteal'): void {
  if (!isActive(u) || amount <= 0) return;
  const real = Math.min(u.maxHp - u.hp, Math.round(amount));
  if (real <= 0) return;
  u.hp += real;
  s.events.push({ type: 'heal', round: s.round, tgt: u.id, amount: real, tgtHp: u.hp, source });
}

function checkHpMorale(s: SimState, u: BattleUnitState): void {
  const pct = u.hp / u.maxHp;
  if (pct < 0.5 && !u.hpFlags.below50) {
    u.hpFlags.below50 = true;
    changeMorale(s, u, COMBAT.morale.below50, 'тяжёлые потери');
  }
  if (pct < 0.25 && !u.hpFlags.below25) {
    u.hpFlags.below25 = true;
    changeMorale(s, u, COMBAT.morale.below25, 'на грани гибели');
  }
}

function kill(s: SimState, victim: BattleUnitState, killer?: BattleUnitState): void {
  victim.alive = false;
  victim.hp = 0;
  victim.poison = 0;
  victim.stunRounds = 0;
  victim.slowRounds = 0;
  s.events.push({ type: 'death', round: s.round, unit: victim.id, killer: killer?.id });
  for (const ally of alliesOf(s, victim)) if (ally.id !== victim.id) changeMorale(s, ally, COMBAT.morale.allyDeath, `гибель: ${victim.name}`);
  if (killer) {
    killer.kills += 1;
    const rally = findAbility(killer, 'rally');
    for (const ally of alliesOf(s, killer)) {
      changeMorale(s, ally, COMBAT.morale.enemyDeath, `враг повержен`);
      if (rally) changeMorale(s, ally, rally.morale, `воодушевление: ${killer.name}`);
    }
  }
}

/** Прямое нанесение урона: сначала заряды брони-щита, затем обычный щит, затем HP. */
function applyDamage(target: BattleUnitState, dmg: number): { absorbed: number; hpLoss: number } {
  let rest = dmg;
  let absorbed = 0;
  if (target.wardCharges > 0 && rest > 0) {
    const byWard = Math.min(target.wardPerCharge, rest);
    rest -= byWard;
    absorbed += byWard;
    target.wardCharges -= 1;
  }
  const byShield = Math.min(target.shield, rest);
  target.shield -= byShield;
  rest -= byShield;
  absorbed += byShield;
  target.hp = Math.max(0, target.hp - rest);
  return { absorbed, hpLoss: dmg - absorbed };
}

interface AttackOpts {
  mult: number;
  allowDouble: boolean;
  allowRetaliate: boolean;
  kind: 'melee' | 'ranged' | 'counter';
  surprise: boolean;
}

function computeRawDamage(s: SimState, attacker: BattleUnitState, target: BattleUnitState, crit: boolean, mult: number): number {
  const variance = s.rng.float(COMBAT.varianceMin, COMBAT.varianceMax);
  let raw = attacker.stats.atk * variance * mult;
  if (crit) raw *= attacker.stats.critDmg / 100;
  const exec = findAbility(attacker, 'execute');
  if (exec && target.hp / target.maxHp < exec.threshold / 100) raw *= 1 + exec.bonus / 100;
  const effDef = target.stats.def * (1 - attacker.stats.armorPen / 100);
  return Math.max(1, Math.round((raw * 100) / (100 + effDef)));
}

function performAttack(s: SimState, attacker: BattleUnitState, target: BattleUnitState, opts: AttackOpts): void {
  if (!isActive(attacker) || !isActive(target)) return;

  const isCounter = opts.kind === 'counter';
  const focus = s.active === 'focus' && attacker.side === 'player';
  let hitChance = isCounter ? 100 : attacker.stats.acc - target.stats.eva - target.bonusEva;
  if (focus) hitChance += COMBAT.momentum.focusAcc;
  hitChance = Math.max(COMBAT.hitFloor, Math.min(COMBAT.hitCeil, hitChance));
  const hit = s.rng.chance(hitChance);
  if (!hit) {
    s.events.push({
      type: 'attack', round: s.round, src: attacker.id, tgt: target.id, hit: false, crit: false, dmg: 0, absorbed: 0,
      tgtHp: target.hp, tgtShield: target.shield, tgtWard: target.wardCharges, kind: opts.kind, element: attacker.element, surprise: opts.surprise,
    });
    return;
  }

  const critChance = attacker.stats.crit + (focus ? COMBAT.momentum.focusCrit : 0);
  const crit = !isCounter && s.rng.chance(critChance);
  const dmg = computeRawDamage(s, attacker, target, crit, opts.mult);
  const { absorbed } = applyDamage(target, dmg);
  attacker.damageDealt += dmg;
  s.events.push({
    type: 'attack', round: s.round, src: attacker.id, tgt: target.id, hit: true, crit, dmg, absorbed,
    tgtHp: target.hp, tgtShield: target.shield, tgtWard: target.wardCharges, kind: opts.kind, element: attacker.element, surprise: opts.surprise,
  });

  if (attacker.stats.lifesteal > 0) heal(s, attacker, (dmg * attacker.stats.lifesteal) / 100, 'lifesteal');

  if (target.hp <= 0) {
    kill(s, target, attacker);
  } else {
    if (crit) changeMorale(s, target, COMBAT.morale.gotCrit, 'критический удар');
    checkHpMorale(s, target);
    const poison = findAbility(attacker, 'poisonOnHit');
    if (poison && !isCounter) {
      target.poison = Math.min(COMBAT.poisonMaxStacks, target.poison + poison.stacks);
      s.events.push({ type: 'status', round: s.round, tgt: target.id, status: 'poison', stacks: target.poison });
    }
    const stun = findAbility(attacker, 'stunOnHit');
    if (stun && !isCounter && s.rng.chance(stun.chance)) {
      target.stunRounds = Math.min(COMBAT.stunMaxRounds, target.stunRounds + stun.rounds);
      s.events.push({ type: 'status', round: s.round, tgt: target.id, status: 'stun', stacks: target.stunRounds });
    }
    const slow = findAbility(attacker, 'slowOnHit');
    if (slow && !isCounter) {
      target.slowRounds = Math.min(COMBAT.slowMaxRounds, Math.max(target.slowRounds, slow.rounds));
      s.events.push({ type: 'status', round: s.round, tgt: target.id, status: 'slow', stacks: target.slowRounds });
    }
    // Контратака — только на ближний удар и только если защитник выжил.
    const ret = findAbility(target, 'retaliate');
    if (ret && opts.allowRetaliate && opts.kind === 'melee') {
      performAttack(s, target, attacker, { mult: ret.pct / 100, allowDouble: false, allowRetaliate: false, kind: 'counter', surprise: false });
    }
  }

  // Рассечение: вторая цель в той же линии, без броска на попадание и крит.
  const cleave = findAbility(attacker, 'cleave');
  if (cleave && !isCounter && isActive(attacker)) {
    const second = selectCleaveTarget(target, enemiesOf(s, attacker));
    if (second) {
      const cdmg = Math.max(1, Math.round((dmg * cleave.pct) / 100));
      applyDamage(second, cdmg);
      attacker.damageDealt += cdmg;
      s.events.push({
        type: 'attack', round: s.round, src: attacker.id, tgt: second.id, hit: true, crit: false, dmg: cdmg, absorbed: 0,
        tgtHp: second.hp, tgtShield: second.shield, tgtWard: second.wardCharges, kind: 'cleave', element: attacker.element, surprise: opts.surprise,
      });
      if (second.hp <= 0) kill(s, second, attacker);
      else checkHpMorale(s, second);
    }
  }

  // Двойной удар: повторная атака (при необходимости — по новой цели).
  const dbl = findAbility(attacker, 'doubleStrike');
  if (dbl && opts.allowDouble && isActive(attacker) && s.rng.chance(dbl.chance)) {
    const next = isActive(target) ? target : selectTarget(attacker, alliesOf(s, attacker), enemiesOf(s, attacker), s.rng);
    if (next) performAttack(s, attacker, next, { ...opts, allowDouble: false });
  }
}

function actUnit(s: SimState, unit: BattleUnitState, surprise: boolean): void {
  if (!isActive(unit)) return;
  // Оглушение: юнит теряет действие.
  if (unit.stunRounds > 0) {
    unit.stunRounds -= 1;
    s.events.push({ type: 'skip', round: s.round, unit: unit.id, reason: 'stunned' });
    return;
  }
  const allies = alliesOf(s, unit);
  const enemies = enemiesOf(s, unit);
  const volley = s.active === 'volley' && unit.side === 'player';
  const target = selectTarget(unit, allies, enemies, s.rng, { ignoreRange: volley });
  if (!target) {
    const front = frontLine(allies);
    if (unit.line > front) {
      const from = unit.line;
      unit.line -= 1;
      s.events.push({ type: 'advance', round: s.round, unit: unit.id, fromLine: from, toLine: unit.line });
    } else {
      s.events.push({ type: 'skip', round: s.round, unit: unit.id, reason: 'noTarget' });
    }
    return;
  }
  const kind = unit.stats.range > 1 ? 'ranged' : 'melee';
  const rage = s.active === 'rage' && unit.side === 'player' ? COMBAT.momentum.rageDmgMult : 1;
  performAttack(s, unit, target, { mult: (surprise ? COMBAT.surpriseMult : 1) * rage, allowDouble: true, allowRetaliate: true, kind, surprise });
}

/** Эффективная скорость с учётом замедления. */
export function effectiveSpd(u: BattleUnitState): number {
  return u.slowRounds > 0 ? Math.max(1, Math.ceil(u.stats.spd * COMBAT.slowSpeedFactor)) : u.stats.spd;
}

/** Порядок ходов: скорость по убыванию; равные — случайно (детерминированно по seed). */
function turnOrder(s: SimState): BattleUnitState[] {
  const jitter = new Map<string, number>();
  for (const u of s.units) jitter.set(u.id, s.rng.next());
  return s.units.filter(isActive).sort((a, b) => effectiveSpd(b) - effectiveSpd(a) || jitter.get(a.id)! - jitter.get(b.id)!);
}

function winnerOf(s: SimState): Side | 'draw' | null {
  const p = activeCount(s, 'player');
  const e = activeCount(s, 'enemy');
  if (p === 0 && e === 0) return 'draw';
  if (e === 0) return 'player';
  if (p === 0) return 'enemy';
  return null;
}

function startOfRound(s: SimState): void {
  for (const u of turnOrder(s)) {
    if (!isActive(u)) continue;
    const regen = findAbility(u, 'regen');
    if (regen) heal(s, u, regen.hp, 'regen');
    if (u.slowRounds > 0) u.slowRounds -= 1;
    // Яд — внутренний урон, щитом и бронёй не поглощается (D-16).
    if (u.poison > 0) {
      const dmg = u.poison * COMBAT.poisonDmgPerStack;
      u.hp = Math.max(0, u.hp - dmg);
      s.events.push({ type: 'dot', round: s.round, tgt: u.id, dmg, tgtHp: u.hp, status: 'poison' });
      u.poison -= 1;
      if (u.hp <= 0) {
        kill(s, u);
        continue;
      }
      checkHpMorale(s, u);
    }
    if (!isFearless(u) && u.morale < MORALE_BREAK) {
      const chance = (MORALE_BREAK - u.morale) * COMBAT.morale.routChancePerPoint;
      if (s.rng.chance(chance)) {
        u.routed = true;
        s.events.push({ type: 'rout', round: s.round, unit: u.id, morale: u.morale });
        for (const ally of alliesOf(s, u)) if (ally.id !== u.id) changeMorale(s, ally, Math.round(COMBAT.morale.allyDeath / 2), `бегство: ${u.name}`);
      }
    }
  }
}

/** Накопление духа за раунд: время + урон по врагам + убийства (только сторона игрока). */
function gainSpirit(s: SimState, from: number): void {
  let gained = 1; // за сам раунд
  let damage = 0;
  let kills = 0;
  for (let i = from; i < s.events.length; i++) {
    const ev = s.events[i]!;
    if (ev.type === 'attack' && ev.hit) {
      const src = s.units.find((u) => u.id === ev.src);
      if (src?.side === 'player') damage += ev.dmg;
    } else if (ev.type === 'death' && ev.killer) {
      const killer = s.units.find((u) => u.id === ev.killer);
      if (killer?.side === 'player') kills += 1;
    }
  }
  gained += Math.floor(damage / MOMENTUM_RULES.spiritPerDamage) + kills * MOMENTUM_RULES.spiritPerKill;
  s.spirit = Math.min(MOMENTUM_RULES.maxSpirit, s.spirit + gained);
}

/** Пошаговый симулятор боя. Основа ручного режима (Momentum) и реплеев. */
export class BattleSim {
  private readonly s: SimState;
  private readonly initial: BattleUnitState[];

  private readonly seed: number;

  constructor(player: ComputedUnit[], enemy: ComputedUnit[], options: BattleOptions) {
    this.seed = options.seed;
    this.s = {
      rng: createRng(options.seed),
      units: [...player.map((u) => toState(u, 'player')), ...enemy.map((u) => toState(u, 'enemy'))],
      events: [],
      round: 0,
      phase: 'surprise',
      maxRounds: options.maxRounds ?? COMBAT.maxRounds,
      spirit: 0,
      pending: null,
      active: null,
      lastMomentumRound: 0,
    };
    this.s.events.push({ type: 'phase', phase: 'surprise' });
    this.initial = this.s.units.map(clone);
  }

  get events(): readonly BattleEvent[] {
    return this.s.events;
  }

  get round(): number {
    return this.s.round;
  }

  get phase(): BattlePhase {
    return this.s.phase;
  }

  get spirit(): number {
    return this.s.spirit;
  }

  get units(): readonly BattleUnitState[] {
    return this.s.units;
  }

  /** Стартовые состояния — вход для воспроизведения (computeFrameState). */
  get initialUnits(): readonly BattleUnitState[] {
    return this.initial;
  }

  get seedValue(): number {
    return this.seed;
  }

  get finished(): boolean {
    return winnerOf(this.s) !== null || this.s.round >= this.s.maxRounds;
  }

  get winner(): Side | 'draw' | null {
    return winnerOf(this.s);
  }

  /** Один шаг: фаза внезапной атаки либо один полный раунд. Возвращает новые события. */
  step(): BattleEvent[] {
    const s = this.s;
    if (this.finished) return [];
    const start = s.events.length;
    if (s.phase === 'surprise') {
      const maxSpd = (side: Side): number => Math.max(0, ...s.units.filter((u) => u.side === side && isActive(u)).map((u) => u.stats.spd));
      const ambushers = turnOrder(s).filter((u) => {
        const enemyMax = maxSpd(u.side === 'player' ? 'enemy' : 'player');
        return findAbility(u, 'firstStrike') !== undefined || u.stats.spd >= enemyMax * COMBAT.ambushSpeedRatio;
      });
      for (const u of ambushers) {
        if (winnerOf(s)) break;
        actUnit(s, u, true);
      }
      s.phase = 'main';
      s.events.push({ type: 'phase', phase: 'main' });
      return s.events.slice(start);
    }

    s.round += 1;
    s.active = s.pending;
    s.pending = null;
    s.events.push({ type: 'roundStart', round: s.round });
    if (s.active) s.events.push({ type: 'momentum', round: s.round, tactic: s.active });
    if (s.active === 'guard') {
      for (const u of s.units) {
        if (u.side === 'player' && isActive(u)) {
          u.shield += COMBAT.momentum.guardShield;
          u.bonusEva = COMBAT.momentum.guardEva;
          s.events.push({ type: 'status', round: s.round, tgt: u.id, status: 'shield', stacks: u.shield });
        }
      }
    }
    startOfRound(s);
    let winner = winnerOf(s);
    if (!winner) {
      for (const u of turnOrder(s)) {
        actUnit(s, u, false);
        winner = winnerOf(s);
        if (winner) break;
      }
    }
    // Тактика действует один раунд.
    s.active = null;
    for (const u of s.units) u.bonusEva = 0;
    gainSpirit(s, start);
    return s.events.slice(start);
  }

  /** Доступен ли Momentum на текущем стыке. */
  canMomentum(): boolean {
    const s = this.s;
    return (
      !this.finished &&
      s.phase === 'main' &&
      s.round >= MOMENTUM_RULES.everyRounds &&
      s.round % MOMENTUM_RULES.everyRounds === 0 &&
      s.round > s.lastMomentumRound &&
      s.spirit >= MOMENTUM_RULES.cost
    );
  }

  /** Активировать тактику — вступит в силу в следующем раунде. */
  useMomentum(tactic: MomentumTactic): void {
    if (!this.canMomentum()) return;
    this.s.spirit -= MOMENTUM_RULES.cost;
    this.s.pending = tactic;
    this.s.lastMomentumRound = this.s.round;
  }

  /** Пропустить чекпоинт (не тратить дух). */
  skipMomentum(): void {
    if (!this.canMomentum()) return;
    this.s.lastMomentumRound = this.s.round;
  }

  /** Состояние всех юнитов (для превью/логов). */
  unitById(id: string): BattleUnitState | undefined {
    return this.s.units.find((u) => u.id === id);
  }

  result(): BattleResult {
    let winner = winnerOf(this.s);
    if (winner === null) winner = 'draw';
    if (this.s.events[this.s.events.length - 1]?.type !== 'end') {
      this.s.events.push({ type: 'end', winner, rounds: this.s.round });
    }
    return {
      seed: this.seed,
      winner,
      rounds: this.s.round,
      events: [...this.s.events],
      initial: this.initial.map(clone),
      final: this.s.units.map(clone),
    };
  }
}

/** Преобразование расчётного юнита в боевое состояние — для превью таргетинга. */
export function toBattleState(unit: ComputedUnit, side: Side): BattleUnitState {
  return toState(unit, side);
}

/**
 * Одноразовая симуляция всего боя (автобой без вмешательства).
 * Детерминирована: одинаковый вход и seed → побитово одинаковый результат.
 */
export function simulateFight(player: ComputedUnit[], enemy: ComputedUnit[], options: BattleOptions): BattleResult {
  const sim = new BattleSim(player, enemy, options);
  while (!sim.finished) sim.step();
  const result = sim.result();
  return { ...result, seed: options.seed };
}
