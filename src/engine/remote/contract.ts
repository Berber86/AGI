/**
 * Контракт серверной симуляции боя (см. docs/API_CONTRACT.md).
 * Цель: бой можно посчитать изолированно на сервере — армия описывается
 * данными (никаких ссылок на localStorage/React), валидация чистая.
 */

import { RECRUIT_BY_ID } from '@/data/recruits';
import { GEAR_BY_ID } from '@/data/gear';
import { simulateFight } from '@/engine/combat/simulateFight';
import { computeUnit } from '@/engine/unit/computeUnit';
import { GEAR_SLOTS, RARITIES, type Affix, type GearInstance, type GearSlot, type Rarity, type SquadSetup } from '@/engine/unit/unit.types';

export const PROTOCOL_VERSION = 1;

/** Экземпляр предмета в контракте — без uid (сервер генерирует его сам). */
export interface GearPayload {
  defId: string;
  rarity?: Rarity;
  quality?: number;
  affixes?: Affix[];
  cycle?: number;
}

export interface UnitPayload {
  id: string;
  recruitId: string;
  gear?: Partial<Record<GearSlot, GearPayload | null>>;
  line?: number;
  column?: number;
  statScale?: number;
  extraTags?: SquadSetup['extraTags'];
  name?: string;
}

export interface ArmyPayload {
  units: UnitPayload[];
}

export interface BattleSimulateRequest {
  protocolVersion: number;
  /** Seed генерирует сервер, если клиент не передал (для PvE-реплеев можно передать). */
  seed?: number;
  maxRounds?: number;
  player: ArmyPayload;
  enemy: ArmyPayload;
}

export interface BattleSimulateResponse {
  protocolVersion: number;
  ok: boolean;
  error?: string;
  result?: {
    seed: number;
    winner: 'player' | 'enemy' | 'draw';
    rounds: number;
    events: unknown[];
    initial: unknown[];
    final: unknown[];
  };
}

function isFiniteNumber(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

function validateGearPayload(slot: string, g: unknown): string | null {
  if (g === null || g === undefined) return null;
  if (typeof g !== 'object') return `gear.${slot}: не объект`;
  const gear = g as GearPayload;
  if (!gear.defId || typeof gear.defId !== 'string') return `gear.${slot}: нет defId`;
  if (!GEAR_BY_ID[gear.defId]) return `gear.${slot}: неизвестный предмет ${gear.defId}`;
  if (GEAR_BY_ID[gear.defId]!.slot !== slot) return `gear.${slot}: предмет другого слота`;
  if (gear.rarity !== undefined && !RARITIES.includes(gear.rarity)) return `gear.${slot}: неизвестная редкость`;
  if (gear.quality !== undefined && (!isFiniteNumber(gear.quality) || gear.quality < 0.5 || gear.quality > 1.5)) {
    return `gear.${slot}: качество вне диапазона 0.5..1.5`;
  }
  if (gear.affixes !== undefined) {
    if (!Array.isArray(gear.affixes)) return `gear.${slot}: affixes не массив`;
    for (const a of gear.affixes) {
      if (!a || !isFiniteNumber(a.value) || a.value < 0 || a.value > 200) return `gear.${slot}: некорректный аффикс`;
    }
  }
  return null;
}

/**
 * Валидация запроса. Возвращает null, если запрос корректен, иначе текст ошибки.
 * Сервер считает статы САМ из defId/рекрута (client data — только намерение),
 * поэтому payload-поля статов отсутствуют в контракте.
 */
export function validateBattleRequest(req: unknown): string | null {
  if (!req || typeof req !== 'object') return 'тело запроса не объект';
  const r = req as BattleSimulateRequest;
  if (r.protocolVersion !== PROTOCOL_VERSION) return `версия протокола: ждём ${PROTOCOL_VERSION}`;
  if (r.seed !== undefined && !isFiniteNumber(r.seed)) return 'seed не число';
  if (r.maxRounds !== undefined && (!isFiniteNumber(r.maxRounds) || r.maxRounds < 1 || r.maxRounds > 200)) return 'maxRounds вне 1..200';
  for (const side of ['player', 'enemy'] as const) {
    const army = r[side];
    if (!army || typeof army !== 'object' || !Array.isArray(army.units)) return `${side}.units не массив`;
    if (army.units.length === 0) return `${side}: пустая армия`;
    if (army.units.length > 3) return `${side}: максимум 3 отряда`;
    const ids = new Set<string>();
    for (const u of army.units) {
      if (!u || typeof u !== 'object') return `${side}: юнит не объект`;
      if (!u.id || typeof u.id !== 'string') return `${side}: юнит без id`;
      if (ids.has(u.id)) return `${side}: дубликат id ${u.id}`;
      ids.add(u.id);
      if (!u.recruitId || !RECRUIT_BY_ID[u.recruitId]) return `${side}: неизвестный рекрут ${u.recruitId}`;
      if (u.line !== undefined && (!isFiniteNumber(u.line) || u.line < 0 || u.line > 4)) return `${side}: линия вне 0..4`;
      if (u.column !== undefined && (!isFiniteNumber(u.column) || u.column < 0 || u.column > 9)) return `${side}: колонка вне 0..9`;
      if (u.gear) {
        for (const [slot, g] of Object.entries(u.gear)) {
          if (!(GEAR_SLOTS as readonly string[]).includes(slot)) return `${side}: неизвестный слот ${slot}`;
          const err = validateGearPayload(slot, g);
          if (err) return `${side}: ${err}`;
        }
      }
    }
  }
  return null;
}

function toInstance(slot: GearSlot, g: GearPayload | null | undefined, cycle: number): GearInstance | null {
  if (!g) return null;
  const def = GEAR_BY_ID[g.defId];
  if (!def || def.slot !== slot || def.questOnly) return null;
  return {
    uid: `req_${g.defId}`,
    defId: g.defId,
    rarity: g.rarity ?? def.rarity,
    quality: Math.max(0.5, Math.min(1.5, g.quality ?? 1)),
    affixes: (g.affixes ?? []).filter((a) => a && isFiniteNumber(a.value)).slice(0, 4),
    cycle,
  };
}

/** Запрос → вычисленные армии (серверная сборка статов из справочников). */
export function armiesFromRequest(req: BattleSimulateRequest): { player: SquadSetup[]; enemy: SquadSetup[] } {
  const toSquads = (army: ArmyPayload): SquadSetup[] =>
    army.units.map((u) => ({
      id: u.id,
      name: u.name ?? RECRUIT_BY_ID[u.recruitId]!.name,
      recruitId: u.recruitId,
      gear: Object.fromEntries(
        GEAR_SLOTS.map((slot) => [slot, toInstance(slot, u.gear?.[slot], 1)]),
      ) as SquadSetup['gear'],
      line: u.line ?? 0,
      column: u.column ?? 0,
      statScale: u.statScale,
      extraTags: u.extraTags,
    }));
  return { player: toSquads(req.player), enemy: toSquads(req.enemy) };
}

/** Полный цикл запроса: валидация → сборка → детерминированная симуляция. */
export function simulateFromRequest(req: BattleSimulateRequest): BattleSimulateResponse {
  const error = validateBattleRequest(req);
  if (error) return { protocolVersion: PROTOCOL_VERSION, ok: false, error };
  const { player, enemy } = armiesFromRequest(req);
  const playerUnits = player.map((s) => computeUnit(s));
  const enemyUnits = enemy.map((s) => computeUnit(s));
  const seed = req.seed ?? 0;
  const result = simulateFight(playerUnits, enemyUnits, { seed, maxRounds: req.maxRounds });
  return {
    protocolVersion: PROTOCOL_VERSION,
    ok: true,
    result: {
      seed: result.seed,
      winner: result.winner,
      rounds: result.rounds,
      events: result.events,
      initial: result.initial,
      final: result.final,
    },
  };
}
