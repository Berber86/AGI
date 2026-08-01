/*************************************************************************
 * LEVEL 4/10 ENGINE MODULE
 * Combat simulation, pathfinding, synergies, and tactical formations
 *************************************************************************/

const GRID_COLS = 8;
const GRID_ROWS = 6;
const CELL_W = 840 / GRID_COLS;
const CELL_H = 520 / GRID_ROWS;

function computeSynergies() {
    let heavy = 0, piercing = 0, mobile = 0, siege = 0;
    state.board.forEach(u => {
        if (u.armor === 'heavy') heavy++;
        if (u.attack === 'piercing') piercing++;
        if (u.armor === 'mobile') mobile++;
        if (u.attack === 'siege') siege++;
    });
    return {
        heavy: heavy >= 2,
        piercing: piercing >= 2,
        mobile: mobile >= 2,
        siege: siege >= 2,
        counts: { heavy, piercing, mobile, siege }
    };
}

function startBattle() {
    if (state.board.length === 0) {
        showToast("⚠️ Разместите хотя бы одного юнита на поле боя!");
        return;
    }
    state.phase = 'battle';
    state.speed = 1;
    const btns = document.querySelectorAll('.speed-btn');
    if (btns.length > 0) {
        btns.forEach(b => b.classList.remove('active'));
        btns[0].classList.add('active');
    }

    const syn = computeSynergies();

    [...state.board, ...state.enemies].forEach(u => {
        u.dead = false;
        u.target = null;
        u.attackCooldown = 0;
        u.x = u.gx * CELL_W + CELL_W / 2;
        u.y = u.gy * CELL_H + CELL_H / 2;
        u.lunge = 0;

        const baseMult = u.star === 1 ? 1 : (u.star === 2 ? 2 : 4);
        const baseData = UNITS_DATA[u.type];
        u.maxHp = Math.round(baseData.hp * baseMult);
        u.dmg = Math.round(baseData.dmg * baseMult);

        if (u.team === 'player') {
            u.damageDealt = 0;
            // Class synergies (soft support 12-15%)
            if (syn.heavy && u.armor === 'heavy') {
                u.maxHp = Math.round(u.maxHp * 1.12);
            }
            // Grid zone bonuses (column 3 +15% HP, column 0 +15% damage)
            if (u.gx === 3) {
                u.maxHp = Math.round(u.maxHp * 1.15);
            }
            if (u.gx === 0) {
                u.dmg = Math.round(u.dmg * 1.15);
            }
            // L04 FORMATION BONUSES
            if (state.formation === 'shield_wall') {
                u.maxHp = Math.round(u.maxHp * 1.15);
            } else if (state.formation === 'artillery' && u.gx === 0) {
                u.dmg = Math.round(u.dmg * 1.15);
            }
        }
        u.hp = u.maxHp;
    });

    state.projectiles = [];
    state.particles = [];
    state.floatingTexts = [];
    updateUI();
}

function setSpeed(spd) {
    state.speed = spd;
    const btns = document.querySelectorAll('.speed-btn');
    btns.forEach(b => {
        if (parseInt(b.textContent) === spd) b.classList.add('active');
        else b.classList.remove('active');
    });
}

function updateBattle(dt) {
    if (state.phase !== 'battle') return;
    const effectiveDt = dt * state.speed;

    const syn = computeSynergies();
    const playersAlive = state.board.filter(u => !u.dead);
    const enemiesAlive = state.enemies.filter(u => !u.dead);

    if (enemiesAlive.length === 0) {
        state.phase = 'prep';
        setTimeout(() => showRoundResult(true), 500);
        return;
    }
    if (playersAlive.length === 0) {
        state.phase = 'prep';
        setTimeout(() => showRoundResult(false), 500);
        return;
    }

    const allAlive = [...playersAlive, ...enemiesAlive];
    allAlive.forEach(u => {
        if (u.attackCooldown > 0) u.attackCooldown -= effectiveDt;
        if (u.recoil > 0) u.recoil = Math.max(0, u.recoil - effectiveDt * 5);
        if (u.lunge > 0) u.lunge = Math.max(0, u.lunge - effectiveDt * 4);

        const enemyTeam = u.team === 'player' ? enemiesAlive : playersAlive;
        if (enemyTeam.length === 0) return;

        let nearest = null;
        let minDist = Infinity;
        enemyTeam.forEach(e => {
            const dist = Math.hypot(e.x - u.x, e.y - u.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        });

        if (!nearest) return;

        const attackRangePx = u.range * CELL_W;
        if (minDist <= attackRangePx) {
            if (u.attackCooldown <= 0) {
                performAttack(u, nearest, syn);
                let baseCooldown = 1.2 / u.speed;
                if (u.team === 'player' && syn.mobile && u.armor === 'mobile') {
                    baseCooldown *= 0.85; // +15% attack speed synergy
                }
                if (u.team === 'player' && state.formation === 'flanking' && (u.gy === 0 || u.gy === 5)) {
                    baseCooldown *= 0.85; // +15% attack speed from flanking formation
                }
                u.attackCooldown = baseCooldown / state.speed;
                u.lunge = 1.0;
            }
        } else {
            const angle = Math.atan2(nearest.y - u.y, nearest.x - u.x);
            let moveSpeed = 65 * u.speed;
            if (u.team === 'player' && state.formation === 'shield_wall') {
                moveSpeed *= 0.90; // -10% speed penalty
            }
            u.x += Math.cos(angle) * moveSpeed * effectiveDt;
            u.y += Math.sin(angle) * moveSpeed * effectiveDt;
            u.x = Math.max(20, Math.min(840 - 20, u.x));
            u.y = Math.max(20, Math.min(520 - 20, u.y));
        }
    });

    // Update Projectiles
    for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const p = state.projectiles[i];
        if (p.target.dead) {
            state.projectiles.splice(i, 1);
            continue;
        }
        const angle = Math.atan2(p.target.y - p.y, p.target.x - p.x);
        const speedPx = p.speed || 380;
        p.x += Math.cos(angle) * speedPx * effectiveDt;
        p.y += Math.sin(angle) * speedPx * effectiveDt;

        // L04 GRAPHIC DESIGNER FEATURE: CONTINUOUS PARTICLE TRAILS & BURSTS
        if (p.type === 'bullet' || p.type === 'cannon') {
            state.particles.push({
                x: p.x, y: p.y,
                vx: (Math.random() - 0.5) * 15, vy: -12,
                color: 'rgba(200, 200, 210, 0.45)',
                size: 3 + Math.random() * 3, alpha: 0.8
            });
        } else if (p.type === 'laser' || p.type === 'arrow' || p.type === 'spear') {
            state.particles.push({
                x: p.x, y: p.y,
                vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
                color: p.color,
                size: 2 + Math.random() * 2, alpha: 0.6
            });
        }

        const dist = Math.hypot(p.target.x - p.x, p.target.y - p.y);
        if (dist < 20) {
            applyDamage(p.source, p.target, syn);
            createImpactParticles(p.target.x, p.target.y, p.source.attack, p.type);
            state.projectiles.splice(i, 1);
        }
    }

    // Update Particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const pt = state.particles[i];
        pt.x += pt.vx * effectiveDt;
        pt.y += pt.vy * effectiveDt;
        pt.alpha -= effectiveDt * 1.8;
        if (pt.alpha <= 0) {
            state.particles.splice(i, 1);
        }
    }

    // Update Floating Damage Texts
    for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y -= 38 * effectiveDt;
        ft.alpha -= effectiveDt * 1.2;
        if (ft.alpha <= 0) {
            state.floatingTexts.splice(i, 1);
        }
    }
}

function performAttack(attacker, target, syn) {
    if (attacker.range > 1) {
        let projType = 'arrow';
        let projColor = '#e5c07b';
        let speedPx = 380;

        if (attacker.age === 1) {
            projType = 'spear';
            projColor = '#a3815e';
            speedPx = 320;
        } else if (attacker.age === 2 || attacker.age === 3) {
            projType = 'arrow';
            projColor = '#d6b880';
            speedPx = 390;
        } else if (attacker.age === 4) {
            if (attacker.type === 'cannon') {
                projType = 'cannon';
                projColor = '#3a3e47';
                speedPx = 300;
            } else {
                projType = 'bullet';
                projColor = '#ffdf7a';
                speedPx = 480;
            }
        } else if (attacker.age === 5) {
            projType = 'bullet';
            projColor = '#ffb347';
            speedPx = 520;
        } else {
            projType = 'laser';
            projColor = attacker.team === 'player' ? '#61afef' : '#c678dd';
            speedPx = 650;
        }

        state.projectiles.push({
            x: attacker.x,
            y: attacker.y - 15,
            source: attacker,
            target: target,
            color: projColor,
            type: projType,
            speed: speedPx
        });

        if (projType === 'bullet' || projType === 'cannon' || projType === 'laser') {
            for (let i = 0; i < 6; i++) {
                state.particles.push({
                    x: attacker.x,
                    y: attacker.y - 15,
                    vx: (Math.random() - 0.5) * 60,
                    vy: (Math.random() - 0.5) * 60,
                    color: projType === 'laser' ? '#61afef' : '#ffcf4d',
                    size: 4 + Math.random() * 4,
                    alpha: 1.0
                });
            }
        }
    } else {
        applyDamage(attacker, target, syn);
        createImpactParticles(target.x, target.y, attacker.attack, 'melee');
        target.recoil = 1.0;
    }
}

function applyDamage(attacker, target, syn) {
    if (target.dead) return;

    let mult = 1.0;
    if (COUNTER_TABLE[attacker.attack] && COUNTER_TABLE[attacker.attack][target.armor]) {
        mult = COUNTER_TABLE[attacker.attack][target.armor];
    }

    if (attacker.team === 'player' && syn && syn.piercing && attacker.attack === 'piercing' && mult > 1.0) {
        mult *= 1.15; // +15% crit damage from synergy
    }

    const rawDmg = attacker.dmg * mult;
    const finalDmg = Math.max(1, Math.round(rawDmg));

    target.hp -= finalDmg;

    if (attacker.damageDealt !== undefined) {
        attacker.damageDealt += finalDmg;
    }

    let iconPrefix = attacker.attack === 'melee' ? '🗡️ ' :
                     (attacker.attack === 'piercing' ? '🎯 ' :
                     (attacker.attack === 'anti_mobile' ? '🐎 ' : '💣 '));
    let color = '#ffffff';
    let text = `${iconPrefix}${finalDmg}`;
    if (mult > 1.0) {
        color = '#e06c75';
        text = `${iconPrefix}${finalDmg}!`;
        playSound('hit_pierce');
        createImpactParticles(target.x, target.y, 'crit', 'crit');
    } else if (mult < 1.0) {
        color = '#888888';
        playSound('hit_melee');
    } else {
        playSound('hit_melee');
    }

    state.floatingTexts.push({
        x: target.x,
        y: target.y - 30,
        text: text,
        color: color,
        alpha: 1.0
    });

    if (attacker.attack === 'siege') {
        playSound('hit_siege');
        let splashRadius = CELL_W * 1.25;
        if (attacker.team === 'player' && syn && syn.siege) {
            splashRadius *= 1.15; // +15% splash radius synergy
        }
        const enemyPool = attacker.team === 'player' ? state.enemies : state.board;
        enemyPool.forEach(e => {
            if (e.id !== target.id && !e.dead) {
                const dist = Math.hypot(e.x - target.x, e.y - target.y);
                if (dist <= splashRadius) {
                    const splashDmg = Math.round(finalDmg * 0.5);
                    e.hp -= splashDmg;
                    if (attacker.damageDealt !== undefined) {
                        attacker.damageDealt += splashDmg;
                    }
                    state.floatingTexts.push({
                        x: e.x,
                        y: e.y - 25,
                        text: `💣 ${splashDmg}`,
                        color: '#e5c07b',
                        alpha: 1.0
                    });
                    if (e.hp <= 0) killUnit(e);
                }
            }
        });
    }

    if (target.hp <= 0) {
        killUnit(target);
    }
}

function killUnit(unit) {
    if (unit.dead) return;
    unit.dead = true;
    unit.hp = 0;
    createImpactParticles(unit.x, unit.y, 'kill', 'kill');
}

function createImpactParticles(x, y, attackType, projType) {
    const count = attackType === 'kill' ? 30 : (projType === 'cannon' ? 24 : 12);
    let color = '#ffffff';
    if (attackType === 'kill') color = '#e06c75';
    else if (projType === 'cannon' || attackType === 'siege') color = '#ff9138';
    else if (projType === 'laser') color = '#61afef';
    else if (projType === 'crit') color = '#ff4d4d';
    else color = '#e5c07b';

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 35 + Math.random() * 95;
        state.particles.push({
            x: x,
            y: y - 10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            size: 3 + Math.random() * 4,
            alpha: 1.0
        });
    }
}
