import { ChainId } from "@services/chain.service";

export type PortfolioApprovedSpender = {
  icon: string;
  name: string;
  address: string; // Spender contract/project address (ie: a DEX contract)
}

/**
 * User wallet's token for which external projects have authorization to spend
 */
export type PortfolioApprovedToken = {
  icon: string;
  address: string; // ERC20 token address
  symbol: string;
  chainId: ChainId;
  //balance: number; // Current USD balance of user for this token
  sumExposureUsd: number; // Total amount of USD all spenders are still allowed to withdraw together
  spenders: PortfolioApprovedSpender[]; // List of contracts/projects allowed to spend this token
}
