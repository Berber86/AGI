/*************************************************************************
 * LEVEL 4/10 UI MODULE
 * UI rendering, shop, bench, scout, synergies, formations, DPS meter, and canvas
 *************************************************************************/

function updateUI() {
    const hpEl = document.getElementById('playerHp');
    if (hpEl) hpEl.textContent = state.hp;
    const goldEl = document.getElementById('playerGold');
    if (goldEl) goldEl.textContent = state.gold;
    const ageObj = AGES.find(a => a.id === state.age);
    const ageNameEl = document.getElementById('currentAgeName');
    if (ageNameEl && ageObj) ageNameEl.textContent = ageObj.name;
    const armyEl = document.getElementById('armyCount');
    if (armyEl && ageObj) armyEl.textContent = `${state.board.length} / ${ageObj.limit}`;

    const waveText = state.endlessMode ? `${state.wave} (Бесконечный)` : `${state.wave}`;
    const waveNumEl = document.getElementById('waveNumber');
    if (waveNumEl) waveNumEl.textContent = waveText;
    const scoutWaveEl = document.getElementById('scoutWaveNum');
    if (scoutWaveEl) scoutWaveEl.textContent = waveText;
    const phaseEl = document.getElementById('phaseIndicator');
    const btnStart = document.getElementById('btnStartBattle');
    const speedCtrl = document.getElementById('speedControls');
    if (phaseEl) {
        if (state.phase === 'prep') {
            phaseEl.innerHTML = `<span>⏳ ФАЗА ПОДГОТОВКИ — ВОЛНА <b>${waveText}</b>/12</span>`;
            if (btnStart) btnStart.style.display = 'flex';
            if (speedCtrl) speedCtrl.style.display = 'none';
        } else {
            phaseEl.innerHTML = `<span style="color:var(--accent-red);">⚔️ БОЕВАЯ ФАЗА — ВОЛНА <b>${waveText}</b>/12</span>`;
            if (btnStart) btnStart.style.display = 'none';
            if (speedCtrl) speedCtrl.style.display = 'flex';
        }
    }

    const btnRes = document.getElementById('btnResearch');
    if (btnRes) {
        if (state.age < 6) {
            const nextAge = AGES.find(a => a.id === state.age + 1);
            btnRes.textContent = `🚀 Эволюция: ${nextAge.name.split('.')[1]} (${nextAge.cost} 💰)`;
            btnRes.disabled = state.gold < nextAge.cost || state.phase !== 'prep';
        } else {
            btnRes.textContent = `🚀 Макс. Эпоха (VI. Будущее)`;
            btnRes.disabled = true;
        }
    }

    const sellContainer = document.getElementById('sellUnitContainer');
    const btnSell = document.getElementById('btnSellUnit');
    if (sellContainer && btnSell) {
        if (state.selectedUnit && state.phase === 'prep') {
            const u = state.selectedUnit.source === 'bench'
                ? state.bench[state.selectedUnit.index]
                : state.board[state.selectedUnit.index];
            if (u) {
                const refund = Math.round(u.cost * (u.star === 1 ? 0.75 : u.star === 2 ? 1.5 : 3.0));
                btnSell.textContent = `💰 Продать ${u.name} (+${refund} 💰)`;
                sellContainer.style.display = 'block';
            } else {
                sellContainer.style.display = 'none';
            }
        } else {
            sellContainer.style.display = 'none';
        }
    }

    renderBench();
    renderShop();
    renderScoutList();
    renderSynergiesPanel();
    renderFormationsSelector();
}

function renderSynergiesPanel() {
    const listEl = document.getElementById('synergiesList');
    if (!listEl) return;
    const syn = computeSynergies();
    listEl.innerHTML = `
        <div class="synergy-item ${syn.heavy ? 'active' : ''}">
            <span class="synergy-label">🛡️ Тяжёлая броня (${syn.counts.heavy}/2)</span>
            <span class="synergy-status ${syn.heavy ? 'active' : 'inactive'}">${syn.heavy ? '🔥 +12% HP' : 'неакт.'}</span>
        </div>
        <div class="synergy-item ${syn.piercing ? 'active' : ''}">
            <span class="synergy-label">🎯 Пробивающие (${syn.counts.piercing}/2)</span>
            <span class="synergy-status ${syn.piercing ? 'active' : 'inactive'}">${syn.piercing ? '🔥 +15% Крит' : 'неакт.'}</span>
        </div>
        <div class="synergy-item ${syn.mobile ? 'active' : ''}">
            <span class="synergy-label">🐎 Конница/Дроны (${syn.counts.mobile}/2)</span>
            <span class="synergy-status ${syn.mobile ? 'active' : 'inactive'}">${syn.mobile ? '🔥 +15% Скор.атаки' : 'неакт.'}</span>
        </div>
        <div class="synergy-item ${syn.siege ? 'active' : ''}">
            <span class="synergy-label">💣 Осадные (${syn.counts.siege}/2)</span>
            <span class="synergy-status ${syn.siege ? 'active' : 'inactive'}">${syn.siege ? '🔥 +15% Splash' : 'неакт.'}</span>
        </div>
    `;
}

function renderFormationsSelector() {
    const container = document.getElementById('formationSelector');
    if (!container) return;
    container.innerHTML = '';
    Object.values(FORMATIONS_DATA).forEach(f => {
        const btn = document.createElement('button');
        btn.className = 'formation-btn' + (state.formation === f.id ? ' active' : '');
        btn.textContent = `${f.icon} ${f.name}`;
        btn.title = f.desc;
        btn.onclick = () => {
            if (state.phase === 'prep') {
                state.formation = f.id;
                playSound('click');
                updateUI();
                showToast(`⚔️ Строй изменён: ${f.name} (${f.desc})`);
            }
        };
        container.appendChild(btn);
    });
}

function rerollShop(free = false) {
    if (!free) {
        if (state.gold < 2 || state.phase !== 'prep') return;
        state.gold -= 2;
        playSound('click');
    }

    state.shop = [];
    const availableUnits = Object.values(UNITS_DATA).filter(u => u.age <= state.age && u.id !== 'boss_mech');
    for (let i = 0; i < 5; i++) {
        const randUnit = availableUnits[Math.floor(Math.random() * availableUnits.length)];
        state.shop.push(randUnit.id);
    }
    updateUI();
}

function renderShop() {
    const shopContainer = document.getElementById('shopCards');
    if (!shopContainer) return;
    shopContainer.innerHTML = '';

    state.shop.forEach((unitId, index) => {
        if (!unitId) {
            const emptyCard = document.createElement('div');
            emptyCard.className = 'shop-card disabled';
            emptyCard.innerHTML = `<div style="text-align:center; padding:15px; color:#555;">Куплено</div>`;
            shopContainer.appendChild(emptyCard);
            return;
        }
        const unit = UNITS_DATA[unitId];
        const canBuy = state.gold >= unit.cost && state.phase === 'prep';
        const card = document.createElement('div');
        card.className = 'shop-card' + (canBuy ? '' : ' disabled');
        card.onclick = () => buyUnit(index);

        let armorBadge = '';
        if (unit.armor === 'light') armorBadge = `<span class="type-tag type-light">🛡️ Легкая</span>`;
        else if (unit.armor === 'heavy') armorBadge = `<span class="type-tag type-heavy">🛡️ Тяжелая</span>`;
        else armorBadge = `<span class="type-tag type-mobile">🛡️ Конница</span>`;

        let attackBadge = '';
        if (unit.attack === 'melee') attackBadge = `<span class="type-tag type-light">⚔️ Ударная -> x1.5 Легкая</span>`;
        else if (unit.attack === 'piercing') attackBadge = `<span class="type-tag type-heavy">🎯 Пробивающая -> x1.5 Тяжелая</span>`;
        else if (unit.attack === 'anti_mobile') attackBadge = `<span class="type-tag type-mobile">🐎 Колющая -> x1.5 Конница</span>`;
        else attackBadge = `<span class="type-tag" style="background:#243c2c;color:#98c379;">💣 Осадная -> Splash урон</span>`;

        card.innerHTML = `
            <div class="shop-card-header">
                <span class="shop-card-title">${unit.name} <span style="font-size:0.75rem; color:#888;">(Эп. ${unit.age})</span></span>
                <span class="shop-card-cost">💰 ${unit.cost}</span>
            </div>
            <div class="shop-card-body">
                <div class="shop-card-icon">${unit.icon}</div>
                <div class="shop-card-stats">
                    <div>❤️ HP: <b>${unit.hp}</b> &nbsp; ⚔️ Урон: <b>${unit.dmg}</b></div>
                    <div style="margin-top:2px;">${armorBadge}</div>
                    <div style="margin-top:2px;">${attackBadge}</div>
                </div>
            </div>
        `;
        shopContainer.appendChild(card);
    });
}

function buyUnit(shopIndex) {
    const unitId = state.shop[shopIndex];
    if (!unitId || state.phase !== 'prep') return;
    const unitData = UNITS_DATA[unitId];
    if (state.gold < unitData.cost) {
        showToast("⚠️ Недостаточно золота!");
        return;
    }

    const emptyIdx = state.bench.findIndex(s => s === null);
    if (emptyIdx === -1) {
        showToast("⚠️ Резерв заполнен! Разместите войска на поле или продайте.");
        return;
    }

    state.gold -= unitData.cost;
    state.bench[emptyIdx] = createUnitInstance(unitId, 1, 'player');
    state.shop[shopIndex] = null;

    playSound('buy');
    checkAutoMerge();
    updateUI();
}

function sellSelectedUnit() {
    if (!state.selectedUnit || state.phase !== 'prep') return;
    const u = state.selectedUnit.source === 'bench'
        ? state.bench[state.selectedUnit.index]
        : state.board[state.selectedUnit.index];
    if (!u) return;

    const refund = Math.round(u.cost * (u.star === 1 ? 0.75 : u.star === 2 ? 1.5 : 3.0));
    state.gold += refund;

    state.floatingTexts.push({
        x: u.x || 420,
        y: (u.y || 460) - 15,
        text: `+${refund} 💰`,
        color: '#ffdf7a',
        alpha: 1.0,
        size: 22
    });

    removeUnitInstance(u.id);
    state.selectedUnit = null;

    playSound('coin');
    showToast(`💰 Продано: ${u.name} (+${refund} 💰)`);
    updateUI();
}

function checkAutoMerge() {
    let mergedAny = false;
    const allUnits = [...state.bench, ...state.board].filter(u => u !== null);
    const counts = {};

    allUnits.forEach(u => {
        const key = `${u.type}_${u.star}`;
        if (!counts[key]) counts[key] = [];
        counts[key].push(u);
    });

    for (const key in counts) {
        if (counts[key].length >= 3) {
            const ulist = counts[key];
            const targetStar = ulist[0].star + 1;
            if (targetStar > 3) continue;

            const [u1, u2, u3] = ulist.slice(0, 3);
            removeUnitInstance(u2.id);
            removeUnitInstance(u3.id);

            const base = UNITS_DATA[u1.type];
            const mult = targetStar === 1 ? 1 : (targetStar === 2 ? 2 : 4);
            u1.star = targetStar;
            u1.maxHp = Math.round(base.hp * mult);
            u1.hp = u1.maxHp;
            u1.dmg = Math.round(base.dmg * mult);

            mergedAny = true;
            playSound('merge');
            createMergeCelebration(u1.x, u1.y);
            showToast(`✨ СЛИЯНИЕ ЗВЕЗД! ${u1.name} достиг ${targetStar}★ (Параметры удвоены)!`);
            break;
        }
    }

    if (mergedAny) {
        checkAutoMerge();
    }
}

function createMergeCelebration(x, y) {
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 110;
        state.particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: i % 2 === 0 ? '#e5c07b' : '#61afef',
            size: 4 + Math.random() * 5,
            alpha: 1.0,
            type: 'star'
        });
    }
}

function removeUnitInstance(unitId) {
    for (let i = 0; i < state.bench.length; i++) {
        if (state.bench[i] && state.bench[i].id === unitId) {
            state.bench[i] = null;
            return;
        }
    }
    for (let i = 0; i < state.board.length; i++) {
        if (state.board[i].id === unitId) {
            state.board.splice(i, 1);
            return;
        }
    }
}

function researchAge() {
    if (state.age >= 6 || state.phase !== 'prep') return;
    const nextAge = AGES.find(a => a.id === state.age + 1);
    if (state.gold < nextAge.cost) {
        showToast("⚠️ Недостаточно золота для эволюции!");
        return;
    }

    state.gold -= nextAge.cost;
    state.age++;
    playSound('evolve');
    showToast(`🏛️ ЭВОЛЮЦИЯ! Вы перешли в ${nextAge.name}! Лимит армии: ${nextAge.limit}`);
    updateUI();
}

function renderBench() {
    const benchContainer = document.getElementById('benchSlots');
    if (!benchContainer) return;
    benchContainer.innerHTML = '';

    let count = 0;
    state.bench.forEach((unit, index) => {
        const slot = document.createElement('div');
        slot.className = 'bench-slot';
        if (unit) {
            count++;
            slot.classList.add('occupied');
            if (state.selectedUnit && state.selectedUnit.source === 'bench' && state.selectedUnit.index === index) {
                slot.classList.add('selected');
            }
            const starText = '★'.repeat(unit.star);
            slot.innerHTML = `
                <div style="text-align:center; position:relative; width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <span style="font-size:1.9rem; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6));">${unit.icon}</span>
                    <span style="font-size:0.72rem; font-weight:700; color:var(--text-bright); margin-top:2px;">${unit.name}</span>
                    <span style="position:absolute; top:3px; right:6px; color:var(--accent-gold); font-size:0.75rem; font-weight:800; text-shadow:0 1px 2px #000;">${starText}</span>
                    <span style="position:absolute; bottom:3px; left:6px; font-size:0.65rem; color:#8bb4e0; font-weight:600;">Эп.${unit.age}</span>
                </div>
            `;
        }

        slot.onclick = () => onBenchSlotClick(index);
        benchContainer.appendChild(slot);
    });

    const countText = document.getElementById('benchCountText');
    if (countText) countText.textContent = `${count}/8`;
}

function onBenchSlotClick(index) {
    if (state.phase !== 'prep') return;
    playSound('click');

    if (state.selectedUnit && state.selectedUnit.source === 'bench' && state.selectedUnit.index === index) {
        state.selectedUnit = null;
        updateUI();
        return;
    }

    if (state.selectedUnit && state.selectedUnit.source === 'board') {
        const boardIdx = state.selectedUnit.index;
        const boardUnit = state.board[boardIdx];
        if (!state.bench[index]) {
            state.bench[index] = boardUnit;
            state.board.splice(boardIdx, 1);
            state.selectedUnit = null;
            updateUI();
        }
        return;
    }

    if (state.bench[index]) {
        state.selectedUnit = { source: 'bench', index: index };
        updateUI();
    }
}

function loadScoutWave(waveNum) {
    const waveObj = WAVES.find(w => w.num === waveNum) || WAVES[WAVES.length - 1];
    state.enemies = waveObj.enemies.map(ed => {
        const u = createUnitInstance(ed.type, ed.star || 1, 'enemy', ed.x, ed.y);
        if (state.endlessMode && waveNum > 12) {
            const factor = 1 + (waveNum - 12) * 0.35;
            u.maxHp = Math.round(u.maxHp * factor);
            u.hp = u.maxHp;
            u.dmg = Math.round(u.dmg * factor);
        }
        return u;
    });
    renderScoutList();
}

function renderScoutList() {
    const listEl = document.getElementById('scoutList');
    if (!listEl) return;
    listEl.innerHTML = '';

    const counts = {};
    state.enemies.forEach(e => {
        if (!counts[e.type]) {
            counts[e.type] = { count: 0, unit: e };
        }
        counts[e.type].count++;
    });

    Object.values(counts).forEach(item => {
        const u = item.unit;
        const card = document.createElement('div');
        card.className = 'scout-card';

        let armorBadge = '';
        if (u.armor === 'light') armorBadge = `<span class="type-tag type-light">🛡️ Легкая</span>`;
        else if (u.armor === 'heavy') armorBadge = `<span class="type-tag type-heavy">🛡️ Тяжелая</span>`;
        else armorBadge = `<span class="type-tag type-mobile">🛡️ Конница</span>`;

        let attackBadge = '';
        if (u.attack === 'melee') attackBadge = `<span class="type-tag type-light">⚔️ Ударная</span>`;
        else if (u.attack === 'piercing') attackBadge = `<span class="type-tag type-heavy">🎯 Пробивающая</span>`;
        else if (u.attack === 'anti_mobile') attackBadge = `<span class="type-tag type-mobile">🐎 Колющая</span>`;
        else attackBadge = `<span class="type-tag" style="background:#243c2c;color:#98c379;">💣 Осадная</span>`;

        card.innerHTML = `
            <div class="scout-card-info">
                <span class="scout-card-title">${u.icon} ${u.name} x${item.count}</span>
                <div class="scout-card-types">
                    ${armorBadge}
                    ${attackBadge}
                </div>
            </div>
            <div style="font-size:0.75rem; text-align:right;">
                <div>HP: <b>${u.hp}</b></div>
                <div>Урон: <b>${u.dmg}</b></div>
            </div>
        `;
        listEl.appendChild(card);
    });
}

function showRoundResult(playerWon) {
    state.phase = 'prep';
    const modal = document.getElementById('resultModal');
    const titleEl = document.getElementById('resultTitle');
    const subEl = document.getElementById('resultSubtitle');
    const textEl = document.getElementById('resultText');
    const iconEl = document.getElementById('resultIcon');
    const rewardEl = document.getElementById('rewardBreakdown');
    const btnNext = document.getElementById('btnNextRound');

    const waveObj = WAVES.find(w => w.num === state.wave) || WAVES[WAVES.length - 1];

    if (playerWon) {
        playSound('victory');
        const baseReward = waveObj.reward;
        const interest = Math.min(5, Math.floor(state.gold / 10));
        const winStreak = 2;
        const totalReward = baseReward + interest + winStreak;
        state.gold += totalReward;

        titleEl.textContent = "Итоги боя: Победа!";
        iconEl.textContent = "🏆";
        subEl.textContent = `Волна ${state.wave} успешно отражена!`;
        subEl.style.color = "var(--accent-green)";
        textEl.textContent = "Ваши войска доказали тактическое превосходство.";

        rewardEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Базовая награда:</span> <b>+${baseReward} 💰</b>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Процент на накопления:</span> <b>+${interest} 💰</b>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                <span>Бонус победы:</span> <b>+${winStreak} 💰</b>
            </div>
            <hr style="border:none; border-top:1px solid #444; margin:6px 0;">
            <div style="display:flex; justify-content:space-between; color:var(--accent-gold); font-size:1.05rem;">
                <span>Итого получено:</span> <b>+${totalReward} 💰</b>
            </div>
        `;

        if (state.wave === 12 && !state.endlessMode) {
            btnNext.textContent = "🎉 Войти в Бесконечный Режим";
            btnNext.onclick = () => {
                state.endlessMode = true;
                state.wave++;
                closeModal('resultModal');
                loadScoutWave(state.wave);
                updateUI();
            };
        } else {
            btnNext.textContent = "Следующая волна ➔";
            btnNext.onclick = () => {
                state.wave++;
                closeModal('resultModal');
                loadScoutWave(state.wave);
                updateUI();
            };
        }
    } else {
        playSound('defeat');
        const surviving = state.enemies.filter(e => !e.dead).length;
        const hpLoss = Math.min(state.hp, surviving * 8 + 10);
        state.hp -= hpLoss;

        titleEl.textContent = "Итоги боя: Поражение";
        iconEl.textContent = "💥";
        subEl.textContent = `Вражеская волна прорвала оборону!`;
        subEl.style.color = "var(--accent-red)";
        textEl.textContent = `Оставшиеся враги (${surviving}) нанесли урон вашей базе.`;

        rewardEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; color:var(--accent-red); font-size:1.05rem;">
                <span>Урон здоровью базы:</span> <b>-${hpLoss} ❤️</b>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:8px;">
                <span>Утешительное золото:</span> <b>+8 💰</b>
            </div>
        `;
        state.gold += 8;

        if (state.hp <= 0) {
            subEl.textContent = "Кампания проиграна (База разрушена)";
            btnNext.textContent = "🔄 Начать заново";
            btnNext.onclick = () => {
                closeModal('resultModal');
                initGame();
            };
        } else {
            btnNext.textContent = "Повторить попытку ➔";
            btnNext.onclick = () => {
                closeModal('resultModal');
                loadScoutWave(state.wave);
                updateUI();
            };
        }
    }

    renderDPSMeter();
    updateUI();
    openModal('resultModal');
}

function renderDPSMeter() {
    const container = document.getElementById('dpsRows');
    if (!container) return;
    container.innerHTML = '';

    const deployed = [...state.board];
    if (deployed.length === 0) {
        container.innerHTML = `<div style="color:#666; font-size:0.8rem;">Нет данных</div>`;
        return;
    }

    deployed.sort((a, b) => (b.damageDealt || 0) - (a.damageDealt || 0));
    const totalDamage = deployed.reduce((acc, u) => acc + (u.damageDealt || 0), 0) || 1;

    deployed.forEach(u => {
        const dmg = u.damageDealt || 0;
        const pct = Math.round((dmg / totalDamage) * 100);
        const starStr = '★'.repeat(u.star);
        const row = document.createElement('div');
        row.className = 'dps-row';

        row.innerHTML = `
            <div class="dps-row-header">
                <span>${u.icon} <b>${u.name}</b> <span style="color:var(--accent-gold);">${starStr}</span></span>
                <span><b>${dmg}</b> урона (${pct}%)</span>
            </div>
            <div class="dps-bar-bg">
                <div class="dps-bar-fill" style="width: ${Math.max(3, pct)}%;"></div>
            </div>
        `;
        container.appendChild(row);
    });
}

function proceedNextRound() {
    closeModal('resultModal');
}

function drawBattlefield(timestamp) {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
            const x = c * CELL_W;
            const y = r * CELL_H;

            if ((r + c) % 2 === 0) {
                ctx.fillStyle = c < 4 ? 'rgba(28, 38, 54, 0.55)' : 'rgba(54, 28, 32, 0.55)';
            } else {
                ctx.fillStyle = c < 4 ? 'rgba(23, 31, 44, 0.55)' : 'rgba(44, 23, 27, 0.55)';
            }
            ctx.fillRect(x, y, CELL_W, CELL_H);

            if (c === 0) {
                ctx.fillStyle = 'rgba(198, 120, 221, 0.08)';
                ctx.fillRect(x, y, CELL_W, CELL_H);
                ctx.strokeStyle = 'rgba(198, 120, 221, 0.7)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + 2, y); ctx.lineTo(x + 2, y + CELL_H);
                ctx.stroke();
            } else if (c === 3) {
                ctx.fillStyle = 'rgba(152, 195, 121, 0.08)';
                ctx.fillRect(x, y, CELL_W, CELL_H);
                ctx.strokeStyle = 'rgba(152, 195, 121, 0.7)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + CELL_W - 2, y); ctx.lineTo(x + CELL_W - 2, y + CELL_H);
                ctx.stroke();
            }

            ctx.strokeStyle = c === 3 ? 'rgba(229, 192, 123, 0.7)' : 'rgba(255, 255, 255, 0.07)';
            ctx.lineWidth = c === 3 ? 2 : 1;
            ctx.strokeRect(x, y, CELL_W, CELL_H);

            if (r === GRID_ROWS - 1) {
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.font = '600 10px Segoe UI';
                ctx.fillText(String.fromCharCode(65 + c), x + 6, y + CELL_H - 6);
            }

            if (r === 0 && c === 0) {
                ctx.fillStyle = 'rgba(198, 120, 221, 0.6)';
                ctx.font = '700 11px Segoe UI';
                ctx.fillText('⚔️ ТЫЛ (+15% УРОН)', x + 6, y + 18);
            }
            if (r === 0 && c === 3) {
                ctx.fillStyle = 'rgba(152, 195, 121, 0.6)';
                ctx.font = '700 11px Segoe UI';
                ctx.fillText('🛡️ АВАНГАРД (+15% HP)', x + 6, y + 18);
            }
            if (r === 0 && c === 5) {
                ctx.fillStyle = 'rgba(224, 108, 117, 0.45)';
                ctx.font = '700 12px Segoe UI';
                ctx.fillText('⚔️ ЗОНА ВРАГА (ВОЛНА)', x, y + 20);
            }
        }
    }

    const syn = computeSynergies();
    const allUnits = [...state.enemies, ...state.board];

    allUnits.forEach(u => {
        if (u.dead) return;

        ctx.save();
        ctx.translate(u.x, u.y);

        const swayY = Math.sin(timestamp * 0.003 + u.gx * 2 + u.gy) * 2.0;
        let lungeX = 0;
        if (u.lunge > 0) {
            const dir = u.team === 'player' ? 1 : -1;
            lungeX = dir * Math.sin(u.lunge * Math.PI) * 14;
        }
        if (u.recoil > 0) {
            const dir = u.team === 'player' ? 1 : -1;
            lungeX = -dir * Math.sin(u.recoil * Math.PI) * 8;
        }

        ctx.beginPath();
        ctx.ellipse(0, 22, 26, 11, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, 20, 24, 10, 0, 0, Math.PI * 2);
        const baseGrad = ctx.createRadialGradient(0, 20, 4, 0, 20, 24);
        if (u.team === 'player') {
            baseGrad.addColorStop(0, '#2e496b');
            baseGrad.addColorStop(1, '#152538');
        } else {
            baseGrad.addColorStop(0, '#6b2e35');
            baseGrad.addColorStop(1, '#381519');
        }
        ctx.fillStyle = baseGrad;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = u.team === 'player' ? '#61afef' : '#e06c75';
        ctx.stroke();

        ctx.save();
        ctx.translate(lungeX, swayY);
        drawUnitSilhouette(ctx, u.type, u.team, u.star);
        ctx.restore();

        const starStr = '★'.repeat(u.star);
        ctx.font = '700 12px Segoe UI';
        ctx.fillStyle = '#e5c07b';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText(starStr, 0, -36);
        ctx.shadowBlur = 0;

        if (u.team === 'player') {
            let badgeY = -49;
            if (syn.heavy && u.armor === 'heavy') {
                drawSynergyBadge(ctx, 0, badgeY, '🛡️+HP', '#e5c07b');
                badgeY -= 14;
            } else if (syn.piercing && u.attack === 'piercing') {
                drawSynergyBadge(ctx, 0, badgeY, '🎯+Крит', '#e06c75');
                badgeY -= 14;
            } else if (syn.mobile && u.armor === 'mobile') {
                drawSynergyBadge(ctx, 0, badgeY, '🐎+Скор', '#61afef');
                badgeY -= 14;
            } else if (syn.siege && u.attack === 'siege') {
                drawSynergyBadge(ctx, 0, badgeY, '💣+Splash', '#98c379');
                badgeY -= 14;
            }

            // FORMATION BADGE (L04 CRITIC CHOICE: HUD BADGES FOR ACTIVE FORMATION)
            if (state.formation === 'shield_wall') {
                drawSynergyBadge(ctx, 0, badgeY, '🛡️Строй', '#98c379');
            } else if (state.formation === 'flanking' && (u.gy === 0 || u.gy === 5)) {
                drawSynergyBadge(ctx, 0, badgeY, '🐎Фланг', '#98c379');
            } else if (state.formation === 'artillery' && u.gx === 0) {
                drawSynergyBadge(ctx, 0, badgeY, '💣Тыл+', '#98c379');
            }
        }

        const hbWidth = 46;
        const hbHeight = 6;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(-hbWidth / 2, 29, hbWidth, hbHeight);

        const hpRatio = Math.max(0, u.hp / u.maxHp);
        ctx.fillStyle = hpRatio > 0.5 ? '#98c379' : (hpRatio > 0.25 ? '#e5c07b' : '#e06c75');
        ctx.fillRect(-hbWidth / 2 + 1, 30, (hbWidth - 2) * hpRatio, hbHeight - 2);

        ctx.restore();
    });

    state.projectiles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        const angle = Math.atan2(p.target.y - p.y, p.target.x - p.x);
        ctx.rotate(angle);

        if (p.type === 'spear') {
            ctx.fillStyle = '#8b5a2b';
            ctx.fillRect(-12, -2, 24, 4);
            ctx.fillStyle = '#b0b0b0';
            ctx.beginPath();
            ctx.moveTo(12, -4);
            ctx.lineTo(20, 0);
            ctx.lineTo(12, 4);
            ctx.closePath();
            ctx.fill();
        } else if (p.type === 'arrow') {
            ctx.strokeStyle = '#d6b880';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(10, 0);
            ctx.stroke();
            ctx.fillStyle = '#e06c75';
            ctx.fillRect(-12, -3, 4, 6);
        } else if (p.type === 'bullet') {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'cannon') {
            ctx.fillStyle = '#3a3e47';
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ff8c42';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (p.type === 'laser') {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 4;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(-16, 0);
            ctx.lineTo(16, 0);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }

        ctx.restore();
    });

    state.particles.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    state.floatingTexts.forEach(ft => {
        ctx.font = `800 ${ft.size || 16}px Segoe UI`;
        ctx.textAlign = 'center';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
    });
}

function drawSynergyBadge(ctx, x, y, text, color) {
    ctx.save();
    ctx.font = '700 9px Segoe UI';
    const metrics = ctx.measureText(text);
    const w = metrics.width + 8;
    const h = 13;
    ctx.fillStyle = 'rgba(14, 17, 23, 0.9)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - w/2, y - h/2, w, h, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
}

function drawUnitSilhouette(ctx, type, team, star) {
    const isPlayer = team === 'player';
    const color = isPlayer ? '#7fb8f0' : '#f0898b';
    const accentColor = isPlayer ? '#e5c07b' : '#e0a0a0';

    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    ctx.save();
    if (!isPlayer) {
        ctx.scale(-1, 1);
    }

    if (type === 'spearman') {
        ctx.beginPath(); ctx.arc(0, -18, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-5, -12, 10, 16);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-10, -5); ctx.lineTo(18, -25); ctx.stroke();
    } else if (type === 'clubman') {
        ctx.beginPath(); ctx.arc(0, -18, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-7, -11, 14, 18);
        ctx.fillStyle = accentColor;
        ctx.beginPath(); ctx.arc(12, -18, 7, 0, Math.PI * 2); ctx.fill();
    } else if (type === 'slinger') {
        ctx.beginPath(); ctx.arc(0, -16, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-4, -10, 8, 15);
        ctx.strokeStyle = accentColor;
        ctx.beginPath(); ctx.arc(6, -18, 8, 0, Math.PI * 1.3); ctx.stroke();
    } else if (type === 'hoplite') {
        ctx.fillStyle = accentColor;
        ctx.fillRect(-4, -26, 8, 5);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(0, -18, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-6, -11, 12, 18);
        ctx.fillStyle = accentColor;
        ctx.beginPath(); ctx.arc(-8, -2, 10, 0, Math.PI * 2); ctx.fill();
    } else if (type === 'archer') {
        ctx.beginPath(); ctx.arc(0, -17, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-5, -11, 10, 16);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(8, -4, 12, -Math.PI * 0.4, Math.PI * 0.4); ctx.stroke();
    } else if (type === 'chariot') {
        ctx.fillStyle = accentColor;
        ctx.beginPath(); ctx.arc(-10, 5, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = color;
        ctx.fillRect(-6, -14, 16, 12);
        ctx.beginPath(); ctx.arc(12, -10, 6, 0, Math.PI * 2); ctx.fill();
    } else if (type === 'knight') {
        ctx.fillRect(-6, -22, 12, 10);
        ctx.fillRect(-8, -11, 16, 18);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(10, 5); ctx.lineTo(14, -24); ctx.stroke();
    } else if (type === 'crossbow') {
        ctx.beginPath(); ctx.arc(0, -17, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-5, -11, 10, 16);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(16, -6); ctx.stroke();
    } else if (type === 'cavalry') {
        ctx.fillRect(-14, -6, 26, 14);
        ctx.beginPath(); ctx.arc(14, -10, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-6, -14); ctx.lineTo(24, -14); ctx.stroke();
    } else if (type === 'line_inf') {
        ctx.fillRect(-4, -24, 8, 6);
        ctx.beginPath(); ctx.arc(0, -16, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-5, -10, 10, 17);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(20, -16); ctx.stroke();
    } else if (type === 'musket') {
        ctx.beginPath(); ctx.arc(0, -17, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-6, -11, 12, 17);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(-2, -4); ctx.lineTo(18, -8); ctx.stroke();
    } else if (type === 'cannon') {
        ctx.fillStyle = accentColor;
        ctx.beginPath(); ctx.arc(-6, 4, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = color;
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(16, -10); ctx.stroke();
    } else if (type === 'assault') {
        ctx.beginPath(); ctx.arc(0, -17, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-6, -11, 12, 17);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(-2, -2); ctx.lineTo(16, -2); ctx.stroke();
    } else if (type === 'sniper') {
        ctx.beginPath(); ctx.arc(0, -15, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-6, -9, 12, 15);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(-6, -5); ctx.lineTo(22, -5); ctx.stroke();
    } else if (type === 'tank') {
        ctx.fillRect(-18, -4, 36, 12);
        ctx.fillStyle = accentColor;
        ctx.fillRect(-10, -14, 20, 10);
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(24, -10); ctx.stroke();
    } else if (type === 'exo') {
        ctx.fillRect(-8, -20, 16, 24);
        ctx.fillStyle = accentColor;
        ctx.beginPath(); ctx.arc(0, -22, 6, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(-4, -6); ctx.lineTo(18, -6); ctx.stroke();
    } else if (type === 'railgun') {
        ctx.fillRect(-16, -6, 32, 14);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(26, -12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(26, -8); ctx.stroke();
    } else if (type === 'drone') {
        ctx.beginPath();
        ctx.moveTo(16, -16);
        ctx.lineTo(-14, -24);
        ctx.lineTo(-14, -8);
        ctx.closePath();
        ctx.fill();
    } else if (type === 'boss_mech') {
        ctx.fillStyle = '#e06c75';
        ctx.fillRect(-16, -26, 32, 30);
        ctx.fillStyle = '#e5c07b';
        ctx.beginPath(); ctx.arc(0, -16, 8, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(10, -12); ctx.lineTo(28, -12); ctx.stroke();
    } else {
        ctx.beginPath(); ctx.arc(0, -12, 10, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
}

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}

function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 3200);
}
