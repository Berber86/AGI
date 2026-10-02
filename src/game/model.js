// @ts-nocheck
// React and the standalone legacy screen share one campaign model and one save format.
// index.html loads campaign-map.js and campaign.js before the React module entry.
const Campaign = globalThis.CampaignMvp;
if (!Campaign) throw new Error("Load campaign-map.js and campaign.js before the campaign model.");

export const M = {
  ...Campaign,
  // The standalone UI exposes stateful click handlers under these names;
  // the React store needs the corresponding pure state transitions.
  settleRegion: Campaign.settleRegionState,
  buildRegionBuilding: Campaign.buildRegionBuildingState,
  beginRegionExpedition: Campaign.beginRegionExpeditionState,
  finishRegionExpedition: Campaign.finishRegionExpeditionState,
  markExpeditionBattleStarted: Campaign.markExpeditionBattleStartedState,
  chooseDecree: Campaign.chooseDecreeState,
  chooseCulture: Campaign.chooseCultureState,
  toggleBuilding: Campaign.toggleBuildingState,
  toggleDeckCard: Campaign.toggleDeckCardState,
  finishDay: Campaign.finishDayState,
  completeSeason: Campaign.completeSeasonState,
  assignWorker: Campaign.assignWorkerState,
  beginCardCraft: Campaign.beginCardCraftState,
  completeCardCraft: Campaign.completeCardCraftState,
  failCardCraft: Campaign.failCardCraftState,
  claimCardCraft: Campaign.claimCardCraftState,
};
