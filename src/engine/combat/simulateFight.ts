import type { Ability, ComputedUnit } from '@/engine/unit/unit.types';
import { createRng, type Rng } from '@/utils/rng';
import { MORALE_BREAK, type BattleEvent, type BattleOptions, type BattlePhase, type BattleResult, type BattleUnitState, type Side } from './combat.types';
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
  morale: { allyDeath: -15, enemyDeath: 10, below50: -10, below25: -15, gotCrit: -5, routChancePerPoint: 4 },
} as const;

function findAbility<K extends Ability['key']>(u: BattleUnitState, key: K): Extract<Ability, { key: K }> | undefined {
  return u.abilities.find((a) => a.key === key) as Extract<Ability, { key: K }> | undefined;
}

const isFearless = (u: BattleUnitState): boolean => u.tags.includes('fearless');

function toState(unit: ComputedUnit, side: Side): BattleUnitState {
  const shield = findAbility({ abilities: unit.abilities } as BattleUnitState, 'shield')?.amount ?? 0;
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

interface Sim {
  rng: Rng;
  units: BattleUnitState[];
  events: BattleEvent[];
  round: number;
  phase: BattlePhase;
}

const alliesOf = (sim: Sim, u: BattleUnitState): BattleUnitState[] => sim.units.filter((x) => x.side === u.side);
const enemiesOf = (sim: Sim, u: BattleUnitState): BattleUnitState[] => sim.units.filter((x) => x.side !== u.side);
const activeCount = (sim: Sim, side: Side): number => sim.units.filter((u) => u.side === side && isActive(u)).length;

function changeMorale(sim: Sim, u: BattleUnitState, delta: number, reason: string): void {
  if (!isActive(u) || delta === 0 || isFearless(u)) return;
  const next = Math.max(0, Math.min(150, u.morale + delta));
  if (next === u.morale) return;
  u.morale = next;
  sim.events.push({ type: 'morale', round: sim.round, unit: u.id, delta, morale: u.morale, reason });
}

function heal(sim: Sim, u: BattleUnitState, amount: number, source: 'regen' | 'lifesteal'): void {
  if (!isActive(u) || amount <= 0) return;
  const real = Math.min(u.maxHp - u.hp, Math.round(amount));
  if (real <= 0) return;
  u.hp += real;
  sim.events.push({ type: 'heal', round: sim.round, tgt: u.id, amount: real, tgtHp: u.hp, source });
}

function checkHpMorale(sim: Sim, u: BattleUnitState): void {
  const pct = u.hp / u.maxHp;
  if (pct < 0.5 && !u.hpFlags.below50) {
    u.hpFlags.below50 = true;
    changeMorale(sim, u, COMBAT.morale.below50, 'тяжёлые потери');
  }
  if (pct < 0.25 && !u.hpFlags.below25) {
    u.hpFlags.below25 = true;
    changeMorale(sim, u, COMBAT.morale.below25, 'на грани гибели');
  }
}

function kill(sim: Sim, victim: BattleUnitState, killer?: BattleUnitState): void {
  victim.alive = false;
  victim.hp = 0;
  victim.poison = 0;
  sim.events.push({ type: 'death', round: sim.round, unit: victim.id, killer: killer?.id });
  for (const ally of alliesOf(sim, victim)) if (ally.id !== victim.id) changeMorale(sim, ally, COMBAT.morale.allyDeath, `гибель: ${victim.name}`);
  if (killer) {
    killer.kills += 1;
    const rally = findAbility(killer, 'rally');
    for (const ally of alliesOf(sim, killer)) {
      changeMorale(sim, ally, COMBAT.morale.enemyDeath, `враг повержен`);
      if (rally) changeMorale(sim, ally, rally.morale, `воодушевление: ${killer.name}`);
    }
  }
}

/** Прямое нанесение урона с учётом щита. Возвращает фактически снятые HP. */
function applyDamage(target: BattleUnitState, dmg: number): { absorbed: number; hpLoss: number } {
  const absorbed = Math.min(target.shield, dmg);
  target.shield -= absorbed;
  const hpLoss = dmg - absorbed;
  target.hp = Math.max(0, target.hp - hpLoss);
  return { absorbed, hpLoss };
}

interface AttackOpts {
  mult: number;
  allowDouble: boolean;
  allowRetaliate: boolean;
  kind: 'melee' | 'ranged' | 'counter';
  surprise: boolean;
}

function computeRawDamage(sim: Sim, attacker: BattleUnitState, target: BattleUnitState, crit: boolean, mult: number): number {
  const variance = sim.rng.float(COMBAT.varianceMin, COMBAT.varianceMax);
  let raw = attacker.stats.atk * variance * mult;
  if (crit) raw *= attacker.stats.critDmg / 100;
  const exec = findAbility(attacker, 'execute');
  if (exec && target.hp / target.maxHp < exec.threshold / 100) raw *= 1 + exec.bonus / 100;
  const effDef = target.stats.def * (1 - attacker.stats.armorPen / 100);
  return Math.max(1, Math.round((raw * 100) / (100 + effDef)));
}

function performAttack(sim: Sim, attacker: BattleUnitState, target: BattleUnitState, opts: AttackOpts): void {
  if (!isActive(attacker) || !isActive(target)) return;

  const isCounter = opts.kind === 'counter';
  const hitChance = isCounter ? 100 : Math.max(COMBAT.hitFloor, Math.min(COMBAT.hitCeil, attacker.stats.acc - target.stats.eva));
  const hit = sim.rng.chance(hitChance);
  if (!hit) {
    sim.events.push({
      type: 'attack', round: sim.round, src: attacker.id, tgt: target.id, hit: false, crit: false, dmg: 0, absorbed: 0,
      tgtHp: target.hp, tgtShield: target.shield, kind: opts.kind, element: attacker.element, surprise: opts.surprise,
    });
    return;
  }

  const crit = !isCounter && sim.rng.chance(attacker.stats.crit);
  const dmg = computeRawDamage(sim, attacker, target, crit, opts.mult);
  const { absorbed } = applyDamage(target, dmg);
  attacker.damageDealt += dmg;
  sim.events.push({
    type: 'attack', round: sim.round, src: attacker.id, tgt: target.id, hit: true, crit, dmg, absorbed,
    tgtHp: target.hp, tgtShield: target.shield, kind: opts.kind, element: attacker.element, surprise: opts.surprise,
  });

  if (attacker.stats.lifesteal > 0) heal(sim, attacker, (dmg * attacker.stats.lifesteal) / 100, 'lifesteal');

  if (target.hp <= 0) {
    kill(sim, target, attacker);
  } else {
    if (crit) changeMorale(sim, target, COMBAT.morale.gotCrit, 'критический удар');
    checkHpMorale(sim, target);
    const poison = findAbility(attacker, 'poisonOnHit');
    if (poison && !isCounter) {
      target.poison = Math.min(COMBAT.poisonMaxStacks, target.poison + poison.stacks);
      sim.events.push({ type: 'status', round: sim.round, tgt: target.id, status: 'poison', stacks: target.poison });
    }
    // Контратака — только на ближний удар и только если защитник выжил.
    const ret = findAbility(target, 'retaliate');
    if (ret && opts.allowRetaliate && opts.kind === 'melee') {
      performAttack(sim, target, attacker, { mult: ret.pct / 100, allowDouble: false, allowRetaliate: false, kind: 'counter', surprise: false });
    }
  }

  // Рассечение: вторая цель в той же линии, без броска на попадание и крит.
  const cleave = findAbility(attacker, 'cleave');
  if (cleave && !isCounter && isActive(attacker)) {
    const second = selectCleaveTarget(target, enemiesOf(sim, attacker));
    if (second) {
      const cdmg = Math.max(1, Math.round((dmg * cleave.pct) / 100));
      applyDamage(second, cdmg);
      attacker.damageDealt += cdmg;
      sim.events.push({
        type: 'attack', round: sim.round, src: attacker.id, tgt: second.id, hit: true, crit: false, dmg: cdmg, absorbed: 0,
        tgtHp: second.hp, tgtShield: second.shield, kind: 'cleave', element: attacker.element, surprise: opts.surprise,
      });
      if (second.hp <= 0) kill(sim, second, attacker);
      else checkHpMorale(sim, second);
    }
  }

  // Двойной удар: повторная атака (при необходимости — по новой цели).
  const dbl = findAbility(attacker, 'doubleStrike');
  if (dbl && opts.allowDouble && isActive(attacker) && sim.rng.chance(dbl.chance)) {
    const next = isActive(target) ? target : selectTarget(attacker, alliesOf(sim, attacker), enemiesOf(sim, attacker), sim.rng);
    if (next) performAttack(sim, attacker, next, { ...opts, allowDouble: false });
  }
}

function actUnit(sim: Sim, unit: BattleUnitState, surprise: boolean): void {
  if (!isActive(unit)) return;
  const allies = alliesOf(sim, unit);
  const enemies = enemiesOf(sim, unit);
  const target = selectTarget(unit, allies, enemies, sim.rng);
  if (!target) {
    const front = frontLine(allies);
    if (unit.line > front) {
      const from = unit.line;
      unit.line -= 1;
      sim.events.push({ type: 'advance', round: sim.round, unit: unit.id, fromLine: from, toLine: unit.line });
    } else {
      sim.events.push({ type: 'skip', round: sim.round, unit: unit.id, reason: 'noTarget' });
    }
    return;
  }
  const kind = unit.stats.range > 1 ? 'ranged' : 'melee';
  performAttack(sim, unit, target, { mult: surprise ? COMBAT.surpriseMult : 1, allowDouble: true, allowRetaliate: true, kind, surprise });
}

/** Порядок ходов: скорость по убыванию; равные — случайно (детерминированно по seed). */
function turnOrder(sim: Sim): BattleUnitState[] {
  const jitter = new Map<string, number>();
  for (const u of sim.units) jitter.set(u.id, sim.rng.next());
  return sim.units.filter(isActive).sort((a, b) => b.stats.spd - a.stats.spd || jitter.get(a.id)! - jitter.get(b.id)!);
}

function winnerOf(sim: Sim): Side | 'draw' | null {
  const p = activeCount(sim, 'player');
  const e = activeCount(sim, 'enemy');
  if (p === 0 && e === 0) return 'draw';
  if (e === 0) return 'player';
  if (p === 0) return 'enemy';
  return null;
}

function startOfRound(sim: Sim): void {
  for (const u of turnOrder(sim)) {
    if (!isActive(u)) continue;
    const regen = findAbility(u, 'regen');
    if (regen) heal(sim, u, regen.hp, 'regen');
    // Восстановление боевого духа: паника — временное явление.
    if (!isFearless(u) && u.morale < u.stats.morale) {
      changeMorale(sim, u, 2, 'восстановление духа');
    }
    if (u.poison > 0) {
      const dmg = u.poison * COMBAT.poisonDmgPerStack;
      applyDamage(u, dmg);
      sim.events.push({ type: 'dot', round: sim.round, tgt: u.id, dmg, tgtHp: u.hp, status: 'poison' });
      u.poison -= 1;
      if (u.hp <= 0) {
        kill(sim, u);
        continue;
      }
      checkHpMorale(sim, u);
    }
    if (!isFearless(u) && u.morale < MORALE_BREAK) {
      const chance = (MORALE_BREAK - u.morale) * COMBAT.morale.routChancePerPoint;
      if (sim.rng.chance(chance)) {
        u.routed = true;
        sim.events.push({ type: 'rout', round: sim.round, unit: u.id, morale: u.morale });
        for (const ally of alliesOf(sim, u)) if (ally.id !== u.id) changeMorale(sim, ally, Math.round(COMBAT.morale.allyDeath / 2), `бегство: ${u.name}`);
      }
    }
  }
}

/**
 * Симуляция боя. Чистая функция: результат полностью определяется входом и seed.
 * Возвращает список событий-кадров, по которым UI воспроизводит бой.
 */
export function simulateFight(player: ComputedUnit[], enemy: ComputedUnit[], options: BattleOptions): BattleResult {
  const maxRounds = options.maxRounds ?? COMBAT.maxRounds;
  const sim: Sim = {
    rng: createRng(options.seed),
    units: [...player.map((u) => toState(u, 'player')), ...enemy.map((u) => toState(u, 'enemy'))],
    events: [],
    round: 0,
    phase: 'surprise',
  };
  const initial = sim.units.map(clone);

  // ---- Фаза внезапной атаки ----
  sim.events.push({ type: 'phase', phase: 'surprise' });
  const maxSpd = (side: Side): number => Math.max(0, ...sim.units.filter((u) => u.side === side && isActive(u)).map((u) => u.stats.spd));
  const ambushers = turnOrder(sim).filter((u) => {
    const enemyMax = maxSpd(u.side === 'player' ? 'enemy' : 'player');
    return findAbility(u, 'firstStrike') !== undefined || u.stats.spd >= enemyMax * COMBAT.ambushSpeedRatio;
  });
  for (const u of ambushers) {
    if (winnerOf(sim)) break;
    actUnit(sim, u, true);
  }

  // ---- Основные раунды ----
  sim.phase = 'main';
  sim.events.push({ type: 'phase', phase: 'main' });
  let winner = winnerOf(sim);
  while (!winner && sim.round < maxRounds) {
    sim.round += 1;
    sim.events.push({ type: 'roundStart', round: sim.round });
    startOfRound(sim);
    winner = winnerOf(sim);
    if (winner) break;
    for (const u of turnOrder(sim)) {
      actUnit(sim, u, false);
      winner = winnerOf(sim);
      if (winner) break;
    }
  }
  if (!winner) winner = 'draw';

  sim.events.push({ type: 'end', winner, rounds: sim.round });
  return { seed: options.seed, winner, rounds: sim.round, events: sim.events, initial, final: sim.units.map(clone) };
}
