import { CampaignNode, generateCampaignGraph } from '../../data/campaign';

export interface CampaignState {
  cycle: number;
  currentNodeId: string | null;
  nodes: CampaignNode[];
  completedNodeIds: string[];
}

export function initializeCampaign(cycle: number = 1): CampaignState {
  const nodes = generateCampaignGraph(cycle);
  return {
    cycle,
    currentNodeId: null, // ready to pick starting node (stage 1)
    nodes,
    completedNodeIds: [],
  };
}

export function getAvailableNextNodes(campaign: CampaignState): CampaignNode[] {
  // If no node selected yet, can pick any stage 1 node
  if (!campaign.currentNodeId) {
    return campaign.nodes.filter(n => n.stage === 1);
  }

  const currentNode = campaign.nodes.find(n => n.id === campaign.currentNodeId);
  if (!currentNode) return [];

  return campaign.nodes.filter(n => currentNode.connections.includes(n.id) && !n.completed);
}

export function completeCampaignNode(
  campaign: CampaignState,
  nodeId: string
): { updatedCampaign: CampaignState; isBossDefeated: boolean } {
  const node = campaign.nodes.find(n => n.id === nodeId);
  const isBossDefeated = node?.type === 'boss';

  const updatedNodes = campaign.nodes.map(n =>
    n.id === nodeId ? { ...n, completed: true } : n
  );

  const updatedCampaign: CampaignState = {
    ...campaign,
    currentNodeId: nodeId,
    completedNodeIds: [...campaign.completedNodeIds, nodeId],
    nodes: updatedNodes,
  };

  return { updatedCampaign, isBossDefeated };
}

export function advanceToNextCycle(campaign: CampaignState): CampaignState {
  const nextCycle = campaign.cycle + 1;
  return initializeCampaign(nextCycle);
}
