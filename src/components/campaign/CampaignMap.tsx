import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { NodeType } from '../../data/campaign';
import { getAvailableNextNodes } from '../../engine/campaign/nodeLogic';
import { Swords, ShieldAlert, Hammer, Tent, Skull, CheckCircle2, HelpCircle } from 'lucide-react';

const NODE_ICONS: Record<NodeType, React.ReactNode> = {
  battle: <Swords className="w-5 h-5 text-amber-400" />,
  elite: <ShieldAlert className="w-5 h-5 text-rose-400" />,
  rest: <Tent className="w-5 h-5 text-emerald-400" />,
  workshop: <Hammer className="w-5 h-5 text-sky-400" />,
  event: <HelpCircle className="w-5 h-5 text-purple-400" />,
  boss: <Skull className="w-6 h-6 text-purple-400" />,
};

const NODE_TITLES: Record<NodeType, string> = {
  battle: 'Стычка с Автоматонами',
  elite: 'Элитный Страж',
  rest: 'Привал и Охлаждение',
  workshop: 'Кочевая Кузня',
  event: 'Случайное Событие',
  boss: 'Владыка «Кронос III»',
};

export const CampaignMap: React.FC = () => {
  const { campaign, startBattle, handleRestNode, handleWorkshopNode, handleEventChoice, resources } = useGameStore();
  const availableNodes = getAvailableNextNodes(campaign);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    availableNodes.length > 0 ? availableNodes[0].id : null
  );
  const [eventResultMsg, setEventResultMsg] = useState<string | null>(null);

  const selectedNode = campaign.nodes.find(n => n.id === selectedNodeId) || availableNodes[0];

  // Group nodes by stage (1..5)
  const stages = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-4 rounded-xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-amber-400 tracking-wide uppercase">
              Экспедиция в Сердце Часового Мира
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Цикл {campaign.cycle} (New Game+)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Продвигайтесь по узлам карты к Цитадели Кроноса. Уничтожайте дозоры, перековывайте шестерни и готовьте отряды.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>Пройдено узлов:</span>
          <span className="font-bold text-emerald-400">{campaign.completedNodeIds.length} / {campaign.nodes.length}</span>
        </div>
      </div>

      {/* Main Campaign Grid and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Stages Tree Map */}
        <div className="lg:col-span-8 bg-slate-900/60 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            <span>Маршрут Экспедиции (Roguelike Progression)</span>
            <span className="text-[11px] text-amber-400">Выберите узел для продвижения</span>
          </div>

          <div className="grid grid-cols-5 gap-3 items-center min-h-[380px]">
            {stages.map(stageNum => {
              const stageNodes = campaign.nodes.filter(n => n.stage === stageNum);
              return (
                <div key={stageNum} className="flex flex-col gap-4 items-center justify-center relative">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-widest bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Этап {stageNum}
                  </span>

                  <div className="flex flex-col gap-3 w-full">
                    {stageNodes.map(node => {
                      const isCompleted = node.completed;
                      const isCurrent = campaign.currentNodeId === node.id;
                      const isAvailable = availableNodes.some(an => an.id === node.id);
                      const isSelected = selectedNode?.id === node.id;

                      return (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          disabled={!isAvailable && !isCompleted && !isCurrent}
                          className={`relative p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all text-center w-full ${
                            isSelected
                              ? 'ring-2 ring-amber-400 scale-105 z-10'
                              : ''
                          } ${
                            isCompleted
                              ? 'bg-slate-950/70 border-emerald-500/40 text-slate-400'
                              : isAvailable
                              ? 'bg-gradient-to-b from-slate-900 to-amber-950/30 border-amber-500/80 hover:border-amber-400 shadow-lg shadow-amber-950/40 animate-pulse'
                              : 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {/* Node Icon */}
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                            {NODE_ICONS[node.type]}
                          </div>

                          <span className="text-xs font-bold leading-tight text-slate-200 line-clamp-1">
                            {node.name}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {node.type === 'boss' ? 'Босс' : node.type === 'elite' ? 'Элита' : node.type === 'rest' ? 'Привал' : node.type === 'workshop' ? 'Кузня' : node.type === 'event' ? 'Событие' : 'Битва'}
                          </span>

                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-1 right-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details & Launch Panel */}
        <div className="lg:col-span-4 flex flex-col bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-lg justify-between gap-4">
          {selectedNode ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-700">
                    {NODE_ICONS[selectedNode.type]}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {NODE_TITLES[selectedNode.type]}
                    </span>
                    <h3 className="text-base font-bold text-slate-100">{selectedNode.name}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
                  {selectedNode.description}
                </p>

                {/* Event Narrative & Choices */}
                {selectedNode.type === 'event' && selectedNode.eventData && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                      Сюжетная Развилка:
                    </span>
                    <p className="text-xs text-slate-300 bg-purple-950/20 p-3 rounded-lg border border-purple-500/30 leading-relaxed italic">
                      "{selectedNode.eventData.narrative}"
                    </p>

                    {eventResultMsg ? (
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold">
                        {eventResultMsg}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedNode.eventData.choices.map(choice => {
                          const canPick =
                            (!choice.requirement?.gold || resources.gold >= choice.requirement.gold) &&
                            (!choice.requirement?.cogParts || resources.cogParts >= choice.requirement.cogParts);

                          return (
                            <button
                              key={choice.id}
                              disabled={!canPick || !availableNodes.some(an => an.id === selectedNode.id)}
                              onClick={() => {
                                const res = handleEventChoice(selectedNode.id, choice.id);
                                if (res.success) setEventResultMsg(res.message);
                              }}
                              className={`w-full p-2.5 rounded-xl text-left border transition text-xs flex flex-col gap-1 ${
                                canPick && availableNodes.some(an => an.id === selectedNode.id)
                                  ? 'bg-slate-950 hover:bg-slate-900 border-slate-700 hover:border-purple-400 text-slate-200'
                                  : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <span className="font-bold text-amber-300">{choice.text}</span>
                              <span className="text-[10px] text-slate-400">{choice.consequenceText}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Enemy Preview if Battle */}
                {selectedNode.enemySquads && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                      Состав Гарнизона:
                    </span>
                    <div className="space-y-1">
                      {selectedNode.enemySquads.map((e, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded border border-slate-800"
                        >
                          <span className="text-slate-200 font-medium">{e.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            Линия {e.row + 1} • {e.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rewards Preview */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Возможная Награда:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Золото</span>
                      <span className="font-bold text-amber-300">+{selectedNode.rewards.gold}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Шестерни</span>
                      <span className="font-bold text-orange-400">+{selectedNode.rewards.cogParts}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Наука</span>
                      <span className="font-bold text-sky-400">+{selectedNode.rewards.science}</span>
                    </div>
                  </div>
                  {selectedNode.rewards.gearDropChance > 0 && (
                    <div className="text-[11px] text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-500/30">
                      ⚙️ Шанс редкого лута: {Math.round(selectedNode.rewards.gearDropChance * 100)}%
                      {selectedNode.rewards.guaranteedRarity && ` (Гарантирован: ${selectedNode.rewards.guaranteedRarity})`}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {selectedNode.completed ? (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center text-emerald-300 text-xs font-bold">
                    ✓ Узел уже пройден
                  </div>
                ) : selectedNode.type === 'event' ? (
                  <div className="text-center text-[11px] text-slate-500">
                    Выберите вариант развития событий выше
                  </div>
                ) : availableNodes.some(an => an.id === selectedNode.id) ? (
                  selectedNode.type === 'rest' ? (
                    <button
                      onClick={() => handleRestNode(selectedNode.id)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                    >
                      <Tent className="w-4 h-4" />
                      Разбить Лагерь и Отремонтировать Отряды
                    </button>
                  ) : selectedNode.type === 'workshop' ? (
                    <button
                      onClick={() => handleWorkshopNode(selectedNode.id)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                    >
                      <Hammer className="w-4 h-4" />
                      Посетить Кузню и Получить Детали
                    </button>
                  ) : (
                    <button
                      onClick={() => startBattle(selectedNode.id)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 tracking-wide uppercase"
                    >
                      <Swords className="w-4 h-4" />
                      Вступить в Бой
                    </button>
                  )
                ) : (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center text-slate-500 text-xs">
                    Сначала завершите текущий узел пути
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-500">
              Выберите узел на карте слева
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
