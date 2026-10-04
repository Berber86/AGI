// @ts-nocheck
// Единственная модель игры: React-слой обращается к campaign.js через этот адаптер.
// index.html подключает campaign.js до модульной точки входа.
const Campaign = globalThis.CampaignMvp;
if (!Campaign) throw new Error("Load campaign.js before the campaign model.");

export const M = {
  ...Campaign,
  // Чистые переходы состояния: стор вызывает их с клоном и коммитит результат.
  foundCampaign: Campaign.foundCampaignState,
  recordBattle: Campaign.recordBattleState,
  buyUpgrade: Campaign.buyUpgradeState,
  toggleDeckCard: Campaign.toggleDeckCardState,
  chooseCulture: Campaign.chooseCultureState,
  beginCraft: Campaign.beginCraftState,
  completeCraft: Campaign.completeCraftState,
  failCraft: Campaign.failCraftState,
};
