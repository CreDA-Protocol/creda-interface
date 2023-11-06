
export type PortfolioAvailableProject = {
  chainName: string; // ie: "heco". Seems to be the same as "chainType" in other UI parts
  name: string; // ie: "supernova". Seems to be a "project" name
}

/**
 * Details about a single project/farm, for the active wallet (ie: owned assets in that project).
 */
export type PortfolioStakingDetails = {
  name: string; // Project name
  value: number; // User's balance, total USD value, available and in farming
  farmingValue: number; // User's balance, total USD value, pending only (need to withdraw)
  icon: string; // project http image
  desc: string; // project description
}
