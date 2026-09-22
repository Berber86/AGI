import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { UnitCard } from './UnitCard';
import { Play, Pause, SkipForward, FastForward, Zap, Award, Skull } from 'lucide-react';

export const BattleArena: React.FC = () => {
  const {
    activeBattle,
    stepBattle,
    setBattleFrameIndex,
    setPlaybackSpeed,
    setIsPlaying,
    useTacticalCard,
    finishBattle,
  } = useGameStore();

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Playback timer loop
  useEffect(() => {
    if (!activeBattle.isFighting || !activeBattle.isPlaying || activeBattle.battleEnded) return;

    if (activeBattle.playbackSpeed === 'instant') {
      if (activeBattle.fightResult) {
        setBattleFrameIndex(activeBattle.fightResult.frames.length - 1);
        setIsPlaying(false);
      }
      return;
    }

    const intervalMs = activeBattle.playbackSpeed === 2 ? 400 : 900;
    const timer = setInterval(() => {
      stepBattle();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    activeBattle.isFighting,
    activeBattle.isPlaying,
    activeBattle.playbackSpeed,
    activeBattle.battleEnded,
    stepBattle,
    setBattleFrameIndex,
    setIsPlaying,
    activeBattle.fightResult,
  ]);

  // Auto-scroll log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [activeBattle.frameIndex]);

  if (!activeBattle.isFighting || !activeBattle.fightResult) {
    return null;
  }

  const result = activeBattle.fightResult;
  const currentFrame = result.frames[activeBattle.frameIndex] || result.frames[0];
  const snapshots = currentFrame?.unitSnapshots || [];

  const playerSnapshots = snapshots.filter(s => s.isPlayer);
  const enemySnapshots = snapshots.filter(s => !s.isPlayer);

  const isLastFrame = activeBattle.frameIndex >= result.frames.length - 1;
  const isVictory = result.winner === 'player';

  return (
    <div className="flex flex-col h-full bg-[#0d0f12] text-slate-100 p-4 gap-4 overflow-y-auto">
      {/* Top Status & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Узел Битвы</span>
            <span className="text-base font-bold text-amber-400">{activeBattle.currentNode?.name}</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
              {currentFrame?.isAmbush ? (
                <span className="text-amber-400 font-bold">⚡ Фаза Внезапной Атаки</span>
              ) : (
                <span>Раунд {currentFrame?.round || 1}</span>
              )}
            </span>
            <span className="text-xs text-slate-400">
              Кадр {activeBattle.frameIndex + 1} / {result.frames.length}
            </span>
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!activeBattle.isPlaying)}
            disabled={isLastFrame}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium text-xs transition ${
              activeBattle.isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            } disabled:opacity-40`}
          >
            {activeBattle.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {activeBattle.isPlaying ? 'Пауза' : 'Автоход'}
          </button>

          <button
            onClick={stepBattle}
            disabled={isLastFrame}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 disabled:opacity-40 border border-slate-700"
            title="Один шаг вперед"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Шаг
          </button>

          {/* Speed toggles */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button
              onClick={() => setPlaybackSpeed(1)}
              className={`px-2 py-1 rounded ${
                activeBattle.playbackSpeed === 1 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setPlaybackSpeed(2)}
              className={`px-2 py-1 rounded ${
                activeBattle.playbackSpeed === 2 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => setPlaybackSpeed('instant')}
              className={`px-2 py-1 rounded flex items-center gap-0.5 ${
                activeBattle.playbackSpeed === 'instant'
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Мгновенный исход"
            >
              <FastForward className="w-3 h-3" />
              Мгн.
            </button>
          </div>
        </div>
      </div>

      {/* Main Arena (10x20 field preview + Unit Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Player Army Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-400 pb-1 border-b border-amber-500/20">
            <span>Имперские Отряды ({playerSnapshots.filter(u => !u.isDead && !u.isFled).length}/3 в строю)</span>
            <span>Позиция (0..9)</span>
          </div>
          <div className="space-y-3">
            {playerSnapshots.map(snap => {
              const original = activeBattle.playerUnits.find(p => p.id === snap.id);
              if (!original) return null;
              const isActor = currentFrame.actorId === snap.id;
              const isTarget = currentFrame.targetId === snap.id;
              const damageText = isTarget && currentFrame.damage > 0 ? `-${currentFrame.damage}` : null;

              return (
                <div key={snap.id} className="relative">
                  <div className="text-[10px] text-slate-400 mb-0.5 flex justify-between px-1">
                    <span>Линия {snap.row + 1} (Ряд {snap.row}, Колонка {snap.col})</span>
                    {isActor && <span className="text-amber-300 font-bold animate-pulse">Атакует!</span>}
                  </div>
                  <UnitCard
                    id={snap.id}
                    name={snap.name}
                    role={original.role}
                    isPlayer={true}
                    currentHp={snap.currentHp}
                    maxHp={snap.maxHp}
                    shield={snap.shield}
                    morale={snap.morale}
                    stats={original.stats}
                    equippedGear={original.equippedGear}
                    activeSets={original.stats.activeSets}
                    isDead={snap.isDead}
                    isFled={snap.isFled}
                    isAttacking={isActor}
                    isDamaged={isTarget && currentFrame.damage > 0}
                    isCritTarget={isTarget && currentFrame.isCrit}
                    isDodging={isTarget && currentFrame.isDodge}
                    recentDamageText={damageText}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: 10x20 Grid Visual Representation */}
        <div className="lg:col-span-2 hidden xl:flex flex-col justify-center items-center bg-slate-900/40 p-2 rounded-xl border border-slate-800 text-[10px]">
          <div className="font-bold text-slate-300 mb-2 uppercase tracking-widest text-[9px]">Поле 10x20</div>
          <div className="grid grid-rows-5 gap-1.5 w-full">
            {[0, 1, 2, 3, 4].map(rowIndex => (
              <div key={rowIndex} className="flex items-center justify-between bg-slate-950/70 p-1 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 font-mono">L{rowIndex + 1}</span>
                <div className="flex items-center gap-1">
                  {/* Player side indicator */}
                  {playerSnapshots.filter(p => p.row === rowIndex && !p.isDead).map(p => (
                    <span key={p.id} className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" title={p.name} />
                  ))}
                </div>
                <span className="text-slate-700">⚔️</span>
                <div className="flex items-center gap-1">
                  {/* Enemy side indicator */}
                  {enemySnapshots.filter(e => e.row === rowIndex && !e.isDead).map(e => (
                    <span key={e.id} className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" title={e.name} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <span className="text-[9px] text-slate-500 mt-2 text-center">Авангард держит фронт</span>
        </div>

        {/* Right: Enemy Army Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-400 pb-1 border-b border-rose-500/20">
            <span>Вражеский Строй ({enemySnapshots.filter(u => !u.isDead && !u.isFled).length}/{enemySnapshots.length})</span>
            <span>Позиция (10..19)</span>
          </div>
          <div className="space-y-3">
            {enemySnapshots.map(snap => {
              const original = activeBattle.enemyUnits.find(e => e.id === snap.id);
              if (!original) return null;
              const isActor = currentFrame.actorId === snap.id;
              const isTarget = currentFrame.targetId === snap.id;
              const damageText = isTarget && currentFrame.damage > 0 ? `-${currentFrame.damage}` : null;

              return (
                <div key={snap.id} className="relative">
                  <div className="text-[10px] text-slate-400 mb-0.5 flex justify-between px-1">
                    <span>Линия {snap.row + 1} (Ряд {snap.row}, Колонка {snap.col})</span>
                    {isActor && <span className="text-rose-400 font-bold animate-pulse">Атакует!</span>}
                  </div>
                  <UnitCard
                    id={snap.id}
                    name={snap.name}
                    role={original.role}
                    isPlayer={false}
                    currentHp={snap.currentHp}
                    maxHp={snap.maxHp}
                    shield={snap.shield}
                    morale={snap.morale}
                    stats={original.stats}
                    equippedGear={original.equippedGear}
                    activeSets={original.stats.activeSets}
                    isDead={snap.isDead}
                    isFled={snap.isFled}
                    isAttacking={isActor}
                    isDamaged={isTarget && currentFrame.damage > 0}
                    isCritTarget={isTarget && currentFrame.isCrit}
                    isDodging={isTarget && currentFrame.isDodge}
                    recentDamageText={damageText}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tactical Morale Cards (Momentum Deck) */}
      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Тактические Карты Моментума (Командный резерв: {Math.round(activeBattle.tacticalMorale)}/100)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 italic">Накапливается за раунды и удары</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeBattle.availableTactics.map(card => {
            const canAfford = activeBattle.tacticalMorale >= card.costMorale;
            return (
              <button
                key={card.id}
                onClick={() => useTacticalCard(card.id)}
                disabled={!canAfford || activeBattle.battleEnded}
                className={`p-2 rounded-lg border text-left flex-1 min-w-[200px] transition ${
                  canAfford && !activeBattle.battleEnded
                    ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400 hover:bg-amber-900/40'
                    : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-amber-300">{card.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {card.costMorale} Духа
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-snug">{card.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Combat Log Drawer */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-inner flex flex-col max-h-48">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Летопись Схватки</span>
        <div ref={logContainerRef} className="overflow-y-auto space-y-1 text-xs font-mono pr-2">
          {result.frames.slice(0, activeBattle.frameIndex + 1).map((f, i) => (
            <div
              key={i}
              className={`p-1 rounded leading-relaxed ${
                f.isCrit
                  ? 'bg-amber-950/40 text-amber-300 border-l-2 border-amber-500'
                  : f.isDodge
                  ? 'text-sky-300'
                  : f.actionType === 'tactical_card'
                  ? 'bg-purple-950/40 text-purple-300 font-bold'
                  : f.actorIsPlayer
                  ? 'text-slate-200'
                  : 'text-rose-300'
              }`}
            >
              <span className="text-slate-500 mr-2">[{f.isAmbush ? 'ЗАКАДР' : `Р${f.round}`}]</span>
              {f.logMessage}
            </div>
          ))}
        </div>
      </div>

      {/* Victory / Defeat Modal */}
      {(isLastFrame || activeBattle.battleEnded) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 to-[#14171d] border-2 border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="flex justify-center">
              {isVictory ? (
                <div className="p-3 bg-amber-500/20 rounded-full border border-amber-500/40 text-amber-400">
                  <Award className="w-12 h-12" />
                </div>
              ) : (
                <div className="p-3 bg-rose-500/20 rounded-full border border-rose-500/40 text-rose-400">
                  <Skull className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h2 className={`text-2xl font-black tracking-wide ${isVictory ? 'text-amber-400' : 'text-rose-400'}`}>
                {isVictory ? 'ТРИУМФ МЕХАНИЗМА' : 'ПОРАЖЕНИЕ ЭКСПЕДИЦИИ'}
              </h2>
              <p className="text-xs text-slate-400">
                {isVictory
                  ? 'Вражеские автоматоны разгромлены. Мастера собирают ценные трофеи.'
                  : 'Отряды вынуждены отступить к цитадели для экстренного ремонта.'}
              </p>
            </div>

            {/* Battle Stats */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Раундов боя:</span>
                <span className="font-bold text-slate-200">{result.roundsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Урон наших отрядов:</span>
                <span className="font-bold text-amber-400">{result.totalDamageDealtByPlayer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Уцелевших бойцов:</span>
                <span className="font-bold text-emerald-400">{result.playerSurvivedCount} / 3</span>
              </div>
            </div>

            {/* Rewards */}
            {isVictory && activeBattle.currentNode && (
              <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl text-left space-y-1">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Полученные трофеи:</div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <span>💰 +{activeBattle.currentNode.rewards.gold} Золота</span>
                  <span>⚙️ +{activeBattle.currentNode.rewards.cogParts} Шестерен</span>
                  <span>📜 +{activeBattle.currentNode.rewards.science} Науки</span>
                </div>
              </div>
            )}

            <button
              onClick={finishBattle}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition shadow-lg ${
                isVictory
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isVictory ? 'Забрать трофеи и продолжить поход' : 'Вернуться на базу'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
