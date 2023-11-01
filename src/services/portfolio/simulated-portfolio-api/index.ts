import { tinNetworkService } from "./tinnetwork.service";

/**
 * Returns assets staking information for a given EVM address.
 *
 * NOTE: short term we simulate this on the client and we call TIN network apis directly from here. But
 * this will have to be migrated to a backend to hide the api key
 */
export async function simulatedPortfolioApi_assetsStaking(walletAddress: string, chainId: number) {
  if (!walletAddress || typeof walletAddress !== "string")
    throw new Error('Missing parameter: address');

  if (!chainId)
    throw new Error('Missing parameter: chainid');

  try {
    let stakedAssets = await tinNetworkService.getStakedAssets(walletAddress, chainId);
    return JSON.stringify(stakedAssets); // Simulated raw json, don't share types with client
  }
  catch (e) {
    console.error("Portfolio simulated api error:", e);
    return null;
  }
}
