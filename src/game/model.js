// @ts-nocheck
// Единственная модель игры: React-слой обращается к campaign.js через этот адаптер.
// campaign.js подключается side-effect импортом, а не тегом в index.html: так он гарантированно
// выполняется раньше тела этого модуля и попадает в бандл — и в dev, и в production-сборке
// (копию в dist больше не нужно делать отдельным скриптом, и /campaign.js не может «потеряться»).
import "../../campaign.js";

const Campaign = globalThis.CampaignMvp;
if (!Campaign) throw new Error("campaign.js did not register CampaignMvp.");

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
