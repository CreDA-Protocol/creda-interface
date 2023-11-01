import { getStakedAssets } from "./tinnetwork-staking.service";
import { getWalletTokens } from "./tinnetwork-tokens.service";

/**
 * Returns assets staking information for a given EVM address.
 *
 * NOTE: short term we simulate this on the client and we call TIN network apis directly from here. But
 * this will have to be migrated to a backend to hide the api key
 */
export async function simulatedPortfolioApi_assets_staking(walletAddress: string, chainId: number) {
  if (!walletAddress || typeof walletAddress !== "string")
    throw new Error('Missing parameter: address');

  if (!chainId)
    throw new Error('Missing parameter: chainid');

  try {
    let stakedAssets = await getStakedAssets(walletAddress, chainId);
    return JSON.stringify(stakedAssets); // Simulated raw json, don't share types with client
  }
  catch (e) {
    console.error("Portfolio simulated api error:", e);
    return null;
  }
}

export async function simulatedPortfolioApi_assets_tokens(walletAddress: string, chainId: number) {
  if (!walletAddress || typeof walletAddress !== "string")
    throw new Error('Missing parameter: address');

  if (!chainId)
    throw new Error('Missing parameter: chainid');

  try {
    let walletTokens = await getWalletTokens(walletAddress, chainId);
    return JSON.stringify(walletTokens); // Simulated raw json, don't share types with client
  }
  catch (e) {
    console.error("Portfolio simulated api error:", e);
    return null;
  }
}