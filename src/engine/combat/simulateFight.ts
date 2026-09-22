import { UnitEntity } from '../unit/unit.types';
import { CombatFrame, CombatUnitSnapshot, FightSimulationResult, TacticalCard } from './combat.types';
import { selectBestTarget } from './targeting';

// Deterministic PRNG: Mulberry32
export function createPRNG(seed: number) {
  let s = Math.floor(seed);
  return function next(): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSnapshots(units: UnitEntity[]): CombatUnitSnapshot[] {
  return units.map(u => ({
    id: u.id,
    name: u.name,
    isPlayer: u.isPlayer,
    row: u.row,
    col: u.col,
    currentHp: u.currentHp,
    maxHp: u.maxHp,
    shield: u.shield,
    morale: u.morale,
    isDead: u.currentHp <= 0,
    isFled: u.isFled,
  }));
}

export interface FightOptions {
  seed?: number;
  tacticalCardsPlayed?: { round: number; card: TacticalCard }[];
  maxRounds?: number;
}

export function simulateFight(
  playerTeam: UnitEntity[],
  enemyTeam: UnitEntity[],
  options: FightOptions = {}
): FightSimulationResult {
  const seed = options.seed ?? Math.floor(Math.random() * 1000000);
  const rng = createPRNG(seed);
  const maxRounds = options.maxRounds ?? 25;

  // Deep clone units for simulation
  const players: UnitEntity[] = playerTeam.map(u => ({
    ...u,
    stats: { ...u.stats },
    statuses: [...u.statuses],
  }));

  const enemies: UnitEntity[] = enemyTeam.map(u => ({
    ...u,
    stats: { ...u.stats },
    statuses: [...u.statuses],
  }));

  const allUnits = [...players, ...enemies];
  const frames: CombatFrame[] = [];
  let frameIndex = 0;
  let totalDamageDealtByPlayer = 0;
  let totalDamageDealtByEnemy = 0;

  function pushFrame(frame: Omit<CombatFrame, 'frameIndex' | 'unitSnapshots'>) {
    frames.push({
      ...frame,
      frameIndex: frameIndex++,
      unitSnapshots: makeSnapshots(allUnits),
    });
  }

  // --- 0. AMBUSH / SUDDEN ATTACK PHASE ---
  const ambushUnits = allUnits.filter(
    u => u.currentHp > 0 && !u.isFled && (u.stats.speed >= 16 || u.role === 'duelist')
  ).sort((a, b) => b.stats.speed - a.stats.speed);

  for (const attacker of ambushUnits) {
    const oppTeam = attacker.isPlayer ? enemies : players;
    const target = selectBestTarget(attacker, oppTeam);
    if (!target || target.currentHp <= 0) continue;

    const hitRoll = rng();
    const hitChance = Math.min(0.95, Math.max(0.2, attacker.stats.accuracy - target.stats.dodgeRate));
    if (hitRoll > hitChance) {
      pushFrame({
        round: 0,
        isAmbush: true,
        actionType: 'dodge',
        actorId: attacker.id,
        actorName: attacker.name,
        actorIsPlayer: attacker.isPlayer,
        targetId: target.id,
        targetName: target.name,
        damage: 0,
        isCrit: false,
        isDodge: true,
        absorbedByShield: 0,
        logMessage: `[Внезапная атака] ${attacker.name} атакует ${target.name}, но цель уклоняется!`,
      });
      continue;
    }

    const isCrit = rng() < attacker.stats.critChance * 1.25; // повышенный крит при засаде
    const armorPen = attacker.stats.armorPenetration || 0;
    const effDef = Math.max(0, target.stats.defense * (1 - armorPen));
    const rawDmg = Math.round(attacker.stats.attack * (isCrit ? 1.75 : 1.1));
    const dmg = Math.max(2, Math.round(rawDmg - effDef * 0.6));

    let damageToApply = dmg;
    let absorbed = 0;
    if (target.shield > 0) {
      absorbed = Math.min(target.shield, damageToApply);
      target.shield -= absorbed;
      damageToApply -= absorbed;
    }
    target.currentHp = Math.max(0, target.currentHp - damageToApply);

    if (attacker.isPlayer) totalDamageDealtByPlayer += dmg;
    else totalDamageDealtByEnemy += dmg;

    if (isCrit) {
      oppTeam.forEach(u => (u.morale = Math.max(0, u.morale - 8)));
    }

    if (target.currentHp <= 0) {
      oppTeam.forEach(u => (u.morale = Math.max(0, u.morale - 25)));
    }

    pushFrame({
      round: 0,
      isAmbush: true,
      actionType: isCrit ? 'critical_strike' : 'ambush_strike',
      actorId: attacker.id,
      actorName: attacker.name,
      actorIsPlayer: attacker.isPlayer,
      targetId: target.id,
      targetName: target.name,
      damage: dmg,
      isCrit,
      isDodge: false,
      absorbedByShield: absorbed,
      logMessage: `[Внезапная атака] ${attacker.name} наносит внезапный удар по ${target.name} на ${dmg} урона!${
        isCrit ? ' (Критический урон!)' : ''
      }`,
    });
  }

  // --- MAIN ROUNDS ---
  let currentRound = 1;

  while (currentRound <= maxRounds) {
    const activePlayers = players.filter(u => u.currentHp > 0 && !u.isFled);
    const activeEnemies = enemies.filter(u => u.currentHp > 0 && !u.isFled);

    if (activePlayers.length === 0 || activeEnemies.length === 0) {
      break;
    }

    // Process tactical cards if queued for this round
    if (options.tacticalCardsPlayed) {
      const cardPlay = options.tacticalCardsPlayed.find(c => c.round === currentRound);
      if (cardPlay) {
        if (cardPlay.card.effect === 'shield_all') {
          activePlayers.forEach(p => {
            p.shield += 40;
          });
          pushFrame({
            round: currentRound,
            isAmbush: false,
            actionType: 'tactical_card',
            actorId: 'player_tactics',
            actorName: 'Командный Приказ',
            actorIsPlayer: true,
            damage: 0,
            isCrit: false,
            isDodge: false,
            absorbedByShield: 0,
            logMessage: `Тактическая карта: «${cardPlay.card.name}» разворачивает паровой барьер (+40 щита всем союзникам)!`,
          });
        } else if (cardPlay.card.effect === 'focused_fire') {
          activePlayers.forEach(p => {
            p.stats.critChance += 0.25;
            p.stats.accuracy = Math.min(0.99, p.stats.accuracy + 0.15);
          });
          pushFrame({
            round: currentRound,
            isAmbush: false,
            actionType: 'tactical_card',
            actorId: 'player_tactics',
            actorName: 'Командный Приказ',
            actorIsPlayer: true,
            damage: 0,
            isCrit: false,
            isDodge: false,
            absorbedByShield: 0,
            logMessage: `Тактическая карта: «${cardPlay.card.name}» синхронизирует огонь (+25% к шансу крита)!`,
          });
        }
      }
    }

    // Status ticks at round start (poison, etc.)
    for (const unit of allUnits) {
      if (unit.currentHp <= 0 || unit.isFled) continue;
      const poisonStatus = unit.statuses.find(s => s.type === 'poison');
      if (poisonStatus && poisonStatus.duration > 0) {
        const pDmg = poisonStatus.value;
        unit.currentHp = Math.max(0, unit.currentHp - pDmg);
        poisonStatus.duration -= 1;

        pushFrame({
          round: currentRound,
          isAmbush: false,
          actionType: 'status_damage',
          actorId: unit.id,
          actorName: unit.name,
          actorIsPlayer: unit.isPlayer,
          damage: pDmg,
          isCrit: false,
          isDodge: false,
          absorbedByShield: 0,
          logMessage: `${unit.name} получает ${pDmg} урона от яда!`,
        });
      }
    }

    // Sort turn order by speed + d20 initiative roll
    const roundUnits = [...players, ...enemies]
      .filter(u => u.currentHp > 0 && !u.isFled)
      .map(u => ({
        unit: u,
        initiative: u.stats.speed + Math.floor(rng() * 20),
      }))
      .sort((a, b) => b.initiative - a.initiative)
      .map(entry => entry.unit);

    for (const actor of roundUnits) {
      if (actor.currentHp <= 0 || actor.isFled) continue;

      // Check stun
      const stunIdx = actor.statuses.findIndex(s => s.type === 'stun' && s.duration > 0);
      if (stunIdx >= 0) {
        actor.statuses[stunIdx].duration -= 1;
        pushFrame({
          round: currentRound,
          isAmbush: false,
          actionType: 'stunned_skip',
          actorId: actor.id,
          actorName: actor.name,
          actorIsPlayer: actor.isPlayer,
          damage: 0,
          isCrit: false,
          isDodge: false,
          absorbedByShield: 0,
          logMessage: `${actor.name} оглушен и пропускает ход!`,
        });
        continue;
      }

      // Check morale retreat
      if (actor.morale <= 0) {
        actor.isFled = true;
        pushFrame({
          round: currentRound,
          isAmbush: false,
          actionType: 'flee',
          actorId: actor.id,
          actorName: actor.name,
          actorIsPlayer: actor.isPlayer,
          damage: 0,
          isCrit: false,
          isDodge: false,
          absorbedByShield: 0,
          logMessage: `Боевой дух ${actor.name} сломлен! Отряд отступает с поля боя.`,
        });
        continue;
      }

      const oppTeam = actor.isPlayer ? enemies : players;
      const target = selectBestTarget(actor, oppTeam);
      if (!target || target.currentHp <= 0) continue;

      // Low morale penalty
      const moralePenalty = actor.morale < 25 ? 0.75 : 1.0;

      // Accuracy and Dodge
      const hitChance = Math.min(0.96, Math.max(0.15, (actor.stats.accuracy * moralePenalty) - target.stats.dodgeRate));
      const hitRoll = rng();

      if (hitRoll > hitChance) {
        pushFrame({
          round: currentRound,
          isAmbush: false,
          actionType: 'dodge',
          actorId: actor.id,
          actorName: actor.name,
          actorIsPlayer: actor.isPlayer,
          targetId: target.id,
          targetName: target.name,
          damage: 0,
          isCrit: false,
          isDodge: true,
          absorbedByShield: 0,
          logMessage: `${actor.name} целится в ${target.name}, но промахивается!`,
        });
        continue;
      }

      // Hit & Damage
      const isCrit = rng() < actor.stats.critChance;
      const critMultiplier = isCrit ? (actor.role === 'duelist' ? 2.2 : 1.75) : 1.0;
      const armorPen = actor.stats.armorPenetration || 0;
      const effectiveDefense = Math.max(0, target.stats.defense * (1 - armorPen));
      const rawDamage = actor.stats.attack * critMultiplier * moralePenalty;
      const baseReduction = effectiveDefense * 0.65;
      const calculatedDamage = Math.max(1, Math.round(rawDamage - baseReduction));

      let damageToApply = calculatedDamage;
      let absorbed = 0;
      if (target.shield > 0) {
        absorbed = Math.min(target.shield, damageToApply);
        target.shield -= absorbed;
        damageToApply -= absorbed;
      }
      target.currentHp = Math.max(0, target.currentHp - damageToApply);

      if (actor.isPlayer) totalDamageDealtByPlayer += calculatedDamage;
      else totalDamageDealtByEnemy += calculatedDamage;

      // Morale impact
      if (isCrit) {
        oppTeam.forEach(u => (u.morale = Math.max(0, u.morale - 10)));
      }
      if (target.currentHp <= 0) {
        oppTeam.forEach(u => (u.morale = Math.max(0, u.morale - 25)));
      }

      // Check arcanist cleave / squad passive
      let splashLog = '';
      if (actor.role === 'arcanist') {
        const neighbors = oppTeam.filter(
          u => u.id !== target.id && u.currentHp > 0 && Math.abs(u.row - target.row) <= 1
        );
        for (const splashTarget of neighbors) {
          const splashDmg = Math.max(1, Math.round(calculatedDamage * 0.3));
          splashTarget.currentHp = Math.max(0, splashTarget.currentHp - splashDmg);
          splashLog += ` [Осколки: ${splashTarget.name} -${splashDmg}]`;
        }
      }

      pushFrame({
        round: currentRound,
        isAmbush: false,
        actionType: isCrit ? 'critical_strike' : 'attack',
        actorId: actor.id,
        actorName: actor.name,
        actorIsPlayer: actor.isPlayer,
        targetId: target.id,
        targetName: target.name,
        damage: calculatedDamage,
        isCrit,
        isDodge: false,
        absorbedByShield: absorbed,
        logMessage: `${actor.name} атакует ${target.name} и наносит ${calculatedDamage} урона!${
          isCrit ? ' 💥 КРИТИЧЕСКИЙ УДАР!' : ''
        }${absorbed > 0 ? ` (Щит поглотил ${absorbed})` : ''}${splashLog}`,
      });
    }

    currentRound++;
  }

  const activePlayersFinal = players.filter(u => u.currentHp > 0 && !u.isFled);
  const activeEnemiesFinal = enemies.filter(u => u.currentHp > 0 && !u.isFled);

  let winner: 'player' | 'enemy' | 'draw' = 'draw';
  if (activePlayersFinal.length > 0 && activeEnemiesFinal.length === 0) {
    winner = 'player';
  } else if (activeEnemiesFinal.length > 0 && activePlayersFinal.length === 0) {
    winner = 'enemy';
  } else if (activePlayersFinal.length > 0 && activeEnemiesFinal.length > 0) {
    winner = activePlayersFinal.length >= activeEnemiesFinal.length ? 'player' : 'enemy';
  }

  return {
    winner,
    roundsCount: Math.min(maxRounds, currentRound - 1),
    frames,
    playerSurvivedCount: activePlayersFinal.length,
    enemiesDefeatedCount: enemies.length - activeEnemiesFinal.length,
    totalDamageDealtByPlayer,
    totalDamageDealtByEnemy,
    seed,
  };
}
