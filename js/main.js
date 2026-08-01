/*************************************************************************
 * LEVEL 4/10 MAIN MODULE
 * Game initialization, state management, event listeners, and main loop
 *************************************************************************/

let state = {
    hp: 100,
    gold: 15,
    age: 1,
    wave: 1,
    phase: 'prep',
    speed: 1,
    formation: 'standard', // L04 feature: tactical formation
    bench: [ null, null, null, null, null, null, null, null ],
    board: [],
    enemies: [],
    shop: [],
    selectedUnit: null,
    projectiles: [],
    particles: [],
    floatingTexts: [],
    endlessMode: false
};
window.state = state;

const requestAnimFrame = window.requestAnimationFrame || function(callback) { setTimeout(() => callback(Date.now()), 16); };

window.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupCanvasInteraction();
    requestAnimFrame(gameLoop);
});

function initGame() {
    state.hp = 100;
    state.gold = 15;
    state.age = 1;
    state.wave = 1;
    state.phase = 'prep';
    state.formation = 'standard';
    state.bench = [ null, null, null, null, null, null, null, null ];
    state.board = [];
    state.enemies = [];
    state.projectiles = [];
    state.particles = [];
    state.floatingTexts = [];
    state.endlessMode = false;

    // Grant starting units
    state.bench[0] = createUnitInstance('spearman', 1, 'player');
    state.bench[1] = createUnitInstance('clubman', 1, 'player');

    rerollShop(true);
    loadScoutWave(state.wave);
    updateUI();
}

function createUnitInstance(typeKey, star = 1, team = 'player', gx = 0, gy = 0) {
    const base = UNITS_DATA[typeKey];
    const multiplier = star === 1 ? 1.0 : (star === 2 ? 2.0 : 4.0);
    return {
        id: Math.random().toString(36).substr(2, 9),
        type: typeKey,
        name: base.name,
        age: base.age,
        cost: base.cost,
        armor: base.armor,
        attack: base.attack,
        maxHp: Math.round(base.hp * multiplier),
        hp: Math.round(base.hp * multiplier),
        dmg: Math.round(base.dmg * multiplier),
        range: base.range,
        speed: base.speed,
        icon: base.icon,
        star: star,
        team: team,
        gx: gx,
        gy: gy,
        x: gx * CELL_W + CELL_W / 2,
        y: gy * CELL_H + CELL_H / 2,
        target: null,
        attackCooldown: 0,
        dead: false,
        recoil: 0,
        lunge: 0,
        damageDealt: 0
    };
}

function setupCanvasInteraction() {
    const canvas = document.getElementById('gameCanvas');
    const tooltip = document.getElementById('tooltip');
    if (!canvas || !tooltip) return;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const gx = Math.floor(mx / CELL_W);
        const gy = Math.floor(my / CELL_H);

        const unit = [...state.board, ...state.enemies].find(u => u.gx === gx && u.gy === gy && !u.dead);
        if (unit) {
            let armorText = unit.armor === 'light' ? 'Легкая' : (unit.armor === 'heavy' ? 'Тяжелая' : 'Конница/Мобильная');
            let attackText = unit.attack === 'melee' ? 'Ударная (x1.5 по Легкой)' :
                             (unit.attack === 'piercing' ? 'Пробивающая (x1.5 по Тяжелой)' :
                             (unit.attack === 'anti_mobile' ? 'Колющая (x1.5 по Коннице)' : 'Осадная (Splash)'));
            tooltip.innerHTML = `
                <div style="font-weight:800; color:var(--accent-gold); font-size:0.95rem;">${unit.icon} ${unit.name} (${'★'.repeat(unit.star)})</div>
                <div style="font-size:0.75rem; color:#aaa;">Эпоха ${unit.age} • ${unit.team === 'player' ? 'Игрок (Ваша армия)' : 'Враг (Волна)'}</div>
                <hr style="border:none; border-top:1px solid #444; margin:6px 0;">
                <div>❤️ HP: <b>${Math.round(unit.hp)}</b> / ${unit.maxHp}</div>
                <div>⚔️ Урон: <b>${unit.dmg}</b> | Дальность: <b>${unit.range}</b></div>
                <div style="margin-top:5px;">🛡️ Броня: <b style="color:var(--accent-blue);">${armorText}</b></div>
                <div>🗡️ Атака: <b style="color:var(--accent-red);">${attackText}</b></div>
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY + 15) + 'px';
        } else {
            tooltip.style.display = 'none';
        }
    });

    canvas.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    canvas.addEventListener('click', (e) => {
        if (state.phase !== 'prep') return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const gx = Math.floor(mx / CELL_W);
        const gy = Math.floor(my / CELL_H);

        if (gx >= 4) {
            showToast("⚠️ Размещайте войска в левой половине поля (ваша зона)!");
            return;
        }

        const existingBoardIdx = state.board.findIndex(u => u.gx === gx && u.gy === gy);

        if (state.selectedUnit && state.selectedUnit.source === 'bench') {
            const ageObj = AGES.find(a => a.id === state.age);
            if (state.board.length >= ageObj.limit && existingBoardIdx === -1) {
                showToast(`⚠️ Лимит армии (${ageObj.limit}) достигнут! Исследуйте следующую эпоху для увеличения лимита.`);
                return;
            }

            const benchIdx = state.selectedUnit.index;
            const benchUnit = state.bench[benchIdx];

            if (existingBoardIdx !== -1) {
                const boardUnit = state.board[existingBoardIdx];
                state.bench[benchIdx] = boardUnit;
                benchUnit.gx = gx;
                benchUnit.gy = gy;
                benchUnit.x = gx * CELL_W + CELL_W / 2;
                benchUnit.y = gy * CELL_H + CELL_H / 2;
                state.board[existingBoardIdx] = benchUnit;
            } else {
                benchUnit.gx = gx;
                benchUnit.gy = gy;
                benchUnit.x = gx * CELL_W + CELL_W / 2;
                benchUnit.y = gy * CELL_H + CELL_H / 2;
                state.board.push(benchUnit);
                state.bench[benchIdx] = null;
            }

            playSound('click');
            state.selectedUnit = null;
            updateUI();
        } else if (existingBoardIdx !== -1) {
            state.selectedUnit = { source: 'board', index: existingBoardIdx };
            updateUI();
        } else if (state.selectedUnit && state.selectedUnit.source === 'board') {
            const boardUnit = state.board[state.selectedUnit.index];
            boardUnit.gx = gx;
            boardUnit.gy = gy;
            boardUnit.x = gx * CELL_W + CELL_W / 2;
            boardUnit.y = gy * CELL_H + CELL_H / 2;
            playSound('click');
            state.selectedUnit = null;
            updateUI();
        }
    });
}

let lastTime = 0;
function gameLoop(timestamp) {
    const dt = Math.min(0.1, (timestamp - lastTime) / 1000 || 0);
    lastTime = timestamp;

    updateBattle(dt);
    drawBattlefield(timestamp);

    requestAnimFrame(gameLoop);
}

// Expose globals for testing
window.initGame = initGame;
window.createUnitInstance = createUnitInstance;
window.rerollShop = rerollShop;
window.buyUnit = buyUnit;
window.sellSelectedUnit = sellSelectedUnit;
window.startBattle = startBattle;
window.updateBattle = updateBattle;
window.computeSynergies = computeSynergies;
