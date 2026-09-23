// =============================================================================
//  ШЕСТЕРНИ ЭПОХ — ai.js
//  Противник в бою: выставление юнитов, решение об атаке, блокирование.
//  Играет теми же правилами, что и человек — без читов на ресурсы.
// =============================================================================

import {
  side, enemySide, isAlive, unitAtk, unitHp, unitArmor, canAttack, canPlay, playCard,
  legalBlockers, effectiveCost, boardRoom, log,
} from './battle.js';

export const powerOf = (u) => u.atk * 1.15 + u.hp * 0.8 + u.keywords.reduce((s, k) => s + (k.value || 1), 0);

// ---------------------------------------------------------------------------
//  Главная фаза: что выставить
// ---------------------------------------------------------------------------
export function aiPickCard(b, sideId) {
  const s = side(b, sideId);
  const foe = enemySide(b, sideId);
  if (boardRoom(b, sideId) <= 0) return null;

  const playable = s.hand.filter((u) => canPlay(b, u));
  if (!playable.length) return null;

  const foeBoard = foe.board.filter(isAlive);
  const foeSiege = foeBoard.some((u) => u.fx.siege);
  const myLowHp = s.leader.hp * 2 <= s.leader.maxHp;
  const foeLowHp = foe.leader.hp * 2 <= foe.leader.maxHp;
  const foeBig = foeBoard.reduce((m, u) => Math.max(m, unitAtk(b, u)), 0);

  let best = null;
  for (const u of playable) {
    const cost = Math.max(1, effectiveCost(b, u));
    let score = powerOf(u) / cost + powerOf(u) * 0.12;

    // ситуативные поправки
    if (u.fx.haste) score += foeLowHp ? 4 : 1.5;
    if (u.fx.etbBlast) score += 2;
    if (u.fx.etbStun && foeBoard.length >= 2) score += 3 + foeBoard.length;
    if (u.fx.etbExhaust && foeBig >= 4) score += 3;
    if (u.fx.etbDiscard && foe.hand.length >= 3) score += 2;
    if (u.fx.reach && foeSiege) score += 3;
    if (u.fx.siege && !foeBoard.some((x) => x.fx.reach)) score += 3;
    if (u.fx.deathtouch && foeBig >= 5) score += 3.5;
    if (u.fx.endPlague && foeBoard.length >= 2) score += 2.5;
    if (u.fx.etbInspire && s.board.length >= 2) score += 2.5;
    if (u.fx.etbSwarm) score += 1;
    if (myLowHp) {
      if (u.fx.lifelink) score += 3;
      if (u.fx.etbDivine) score += 3;
      if (u.fx.etbFortify) score += 2.5;
      if (u.fx.armor) score += 2;
      score += unitHp(u) * 0.15;
    }
    if (s.board.length === 0) score += 3 - cost * 0.25;   // нужен хоть кто-то на столе
    if (cost === s.energy) score += 0.8;                  // докрутить энергию
    score += b.rng.next() * 0.7;

    if (!best || score > best.score) best = { u, score };
  }
  return best ? best.u : null;
}

/** Выставляет одну карту. Возвращает true, если что-то сыграно. */
export function aiPlayOne(b, sideId) {
  const u = aiPickCard(b, sideId);
  if (!u) return false;
  return playCard(b, u);
}

// ---------------------------------------------------------------------------
//  Атака
// ---------------------------------------------------------------------------
export function aiDeclareAttack(b, sideId) {
  const s = side(b, sideId);
  const foe = enemySide(b, sideId);
  b.attacking = [];
  b.blockers = {};

  const ready = s.board.filter((u) => isAlive(u) && canAttack(b, u));
  if (!ready.length) return [];

  const totalDmg = ready.reduce((sum, u) => sum + unitAtk(b, u), 0);
  const foeDefence = foe.leader.hp + foe.leader.armor;

  // Летал — бьём всем.
  if (totalDmg >= foeDefence && !foe.board.filter(isAlive).length) {
    b.attacking = ready.map((u) => u.uid);
    log(b, `${s.name}: общий штурм — летал!`, 'bad');
    return b.attacking;
  }
  const unblockable = ready.filter((u) => legalBlockers(b, u).length === 0);
  if (totalDmg >= foeDefence && unblockable.reduce((x, u) => x + unitAtk(b, u), 0) >= foeDefence) {
    b.attacking = unblockable.map((u) => u.uid);
    return b.attacking;
  }

  const foeBoard = foe.board.filter(isAlive);
  const chosen = [];

  for (const u of ready) {
    const dmg = unitAtk(b, u);
    if (dmg <= 0) continue;
    const blockers = legalBlockers(b, u);
    let score = 0;

    if (blockers.length === 0) {
      score = 10 + dmg * 1.2;
      if (u.fx.lifelink) score += dmg;
    } else {
      // худший для нас размен: противник выберет самого выгодного блокера
      let worst = -Infinity;
      for (const bl of blockers) {
        const blDmg = unitAtk(b, bl);
        const iDie = blDmg >= unitHp(u) - u.damage + unitArmor(u) || bl.fx.deathtouch;
        const iKill = dmg >= unitHp(bl) - bl.damage + unitArmor(bl) || u.fx.deathtouch;
        const trade = (iKill ? powerOf(bl) : 0) - (iDie ? powerOf(u) : 0);
        const value = trade + (iKill && !iDie ? 3 : 0) + dmg * 0.45
          + (u.fx.trample ? 2 : 0) + (u.fx.lifelink && iKill ? 2 : 0)
          - (bl.fx.thorns ? 2 : 0) - (iDie && !iKill ? 2 : 0);
        worst = Math.max(worst, value);
      }
      // противник не обязан блокировать: если не блокирует — мы бьём в лицо
      const face = 11 + dmg * 1.4;
      score = Math.max(worst * 0.65, face * 0.45);
      if (u.fx.indestructible) score += 5;
      if (u.fx.regenerate && !u.regenUsed) score += 3;
      if (u.fx.deathWildfire || u.fx.deathVolatile || u.fx.deathEmp || u.fx.deathZap) score += 2.5;
      if (u.fx.vigilance) score += 2.5;
    }

    // не кормим Смертельный удар
    if (blockers.some((bl) => bl.fx.deathtouch) && !u.fx.indestructible && !u.fx.regenerate) score -= 6;
    // держим стену, если лидер на грани и юнит может блокировать
    if (s.leader.hp <= foeBoard.reduce((x, q) => x + unitAtk(b, q), 0) && !u.fx.haste) score -= 3;

    score += b.rng.next() * 1.2;
    if (score > 4.4) chosen.push(u.uid);
  }

  b.attacking = chosen;
  return chosen;
}

// ---------------------------------------------------------------------------
//  Подсказка блоков для человека (та же логика, что у ИИ)
// ---------------------------------------------------------------------------
export function suggestBlocks(b, defenderId) {
  const def = side(b, defenderId);
  const atk = enemySide(b, defenderId);
  const attackers = (b.attacking || []).map((id) => atk.board.find((u) => u.uid === id)).filter((u) => u && isAlive(u));
  const pool = def.board.filter((u) => isAlive(u) && !u.exhausted);
  const used = new Map(pool.map((u) => [u.uid, 0]));
  const out = {};

  const incoming = attackers.reduce((s, a) => s + unitAtk(b, a), 0);
  const lethalRisk = incoming >= def.leader.hp + def.leader.armor;

  const ordered = attackers.slice().sort((x, y) => unitAtk(b, y) - unitAtk(b, x));
  for (const a of ordered) {
    const dmg = unitAtk(b, a);
    if (dmg <= 0) continue;
    const legal = pool.filter((u) => used.get(u.uid) < (u.fx.tactician ? 2 : 1) && canBlockFor(b, u, a));
    if (!legal.length) continue;
    let best = null;
    for (const u of legal) {
      const myDmg = unitAtk(b, u);
      const kills = myDmg >= unitHp(a) - a.damage + unitArmor(a) || u.fx.deathtouch;
      const survives = dmg < unitHp(u) - u.damage + unitArmor(u) && !a.fx.deathtouch;
      const score = (kills ? 100 : 0) + (survives ? 60 : 0) + (kills && survives ? 40 : 0)
        + (a.fx.deathtouch ? -150 : 0) + (u.fx.indestructible ? 40 : 0) + (u.fx.regenerate && !u.regenUsed ? 30 : 0)
        + myDmg * 2 - powerOf(u) * 0.35 - (u.fx.deathWildfire ? -10 : 0);
      if (!best || score > best.score) best = { u, score, kills, survives };
    }
    if (!best) continue;
    if (lethalRisk || best.kills || best.survives || dmg >= def.leader.hp * 0.3) {
      used.set(best.u.uid, used.get(best.u.uid) + 1);
      out[a.uid] = [best.u.uid];
    }
  }
  return out;
}

function canBlockFor(b, u, attacker) {
  if (u.owner === attacker.owner) return false;
  if (attacker.fx.siege && !u.fx.reach) return false;
  return true;
}

