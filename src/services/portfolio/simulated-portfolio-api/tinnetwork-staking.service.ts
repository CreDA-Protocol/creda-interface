import { SummarizedStakedAssets, TinFarmAsset, TinFarmAssetsResponse } from "./model/tinnetwork/assets";
import { TinFarm } from "./model/tinnetwork/farms";
import { StakedAssetsCache } from "./model/tinnetwork/staking";
import { getTinFarmByShortName, getTopFarmsForChain, isSupportedChain, tinNetworkConfig, tinRootOperationsQueue } from "./tinnetwork-base.service";

const STAKED_ASSETS_FARMS_CACHE_DURATION_SEC = (24 * 60 * 60); // 1 day to re-check possible farms where an address has assets
const STAKED_ASSETS_ASSETS_CACHE_DURATION_SEC = (10 * 60); // 10 minutes to refresh value of stakes assets fo a known farm

const stakedAssetsCache: StakedAssetsCache = {}; // Empty cache when the service starts

/**
 * Returns staked assets for a given address from the cache.
 * If the information is too old, we fetch fresh information from an external staking API.
 *
 * https://openapi.tin.network/v1/chains
 * https://openapi.tin.network/v1/farms
 * https://openapi.tin.network/v1/users/farms/{address}?farms={farm-shortName}&chainId={chainId}
 *
 * header: {
 *  X-API-KEY: {YOUR-ACCESS-TOKEN}
 * }
 *
 * NOTES:
 * - the /farms api requires to pass a chain id and a list of farms. Tin network api is far from being optimized.
 * - So we need to manually discover which farms an address is in and then query assets for those farms for a given network.
 * - It is recommended to pass a list of 1-4 farms max per query, because a long list of farms may be slow
 * - Note that each "farm" can exist on several networks
 */
export async function getStakedAssets(address: string, chainId: number): Promise<SummarizedStakedAssets[] | null> {
  return tinRootOperationsQueue.add(async () => {
    // Create an entry for this address if we don't have one
    if (!(address in stakedAssetsCache)) {
      stakedAssetsCache[address] = {
        fetchInProgress: false,
        chains: {}
      };
    }

    let addressCache = stakedAssetsCache[address];

    // Fetch on going, don't fetch multiple times, just return the cache
    if (addressCache.fetchInProgress)
      return null;

    if (!isSupportedChain(chainId)) {
      // requested chain id doesn't exist on tin network
      return null;
    }

    addressCache.fetchInProgress = true;

    // Make sure that we checked chains in which this address is recently enough
    if (!(chainId in addressCache.chains)) {
      addressCache.chains[chainId] = {
        updatedAt: 0,
        farms: {}
      }
    }

    let fetchAllFarms = false;
    if (addressCache.chains[chainId].updatedAt + STAKED_ASSETS_FARMS_CACHE_DURATION_SEC < (Date.now() / 1000)) {
      console.log(`no cache or cache expired for address ${address} for chain ${chainId}. Fetching all farms`);
      fetchAllFarms = true;
    }

    // Chain id unknown yet or cache expired - fetch farms for this chains for this address.
    // We should check all farms for this chain.
    let userChains = addressCache.chains[chainId];
    let farmsForThisChain = getTopFarmsForChain(chainId);

    console.log("Number of farms to check: " + farmsForThisChain.length);
    for (let farm of farmsForThisChain) {
      if (fetchAllFarms || !(farm.shortName in userChains.farms) || (userChains.farms[farm.shortName].assetsStaked && userChains.farms[farm.shortName].assets.updatedAt + STAKED_ASSETS_ASSETS_CACHE_DURATION_SEC < (Date.now() / 1000))) {
        console.log(`no cache or cache expired for address ${address} for chain ${chainId} for farm ${farm.shortName}`);
        // No assets fetched or expired assets, fetch them all for this chain.
        const farmAssets = await fetchFarmAssets(address, farm, chainId);
        if (!farmAssets)
          return null; // if one asset fails, return null so we don't cache empty data by mistake.

        if (farmAssets.amount !== null) { // null probably means error. So we just don't remember this attempt and we'll try again next time
          console.log("farmValue", farmAssets.amount, farmAssets.pendingAmount);

          // Entry not existing, create it with placeholders firt
          if (!(farm.shortName in userChains.farms)) {
            userChains.farms[farm.shortName] = {
              assetsStaked: false,
              farm: farm.shortName,
              assets: {
                updatedAt: 0,
                amount: 0,
                pendingAmount: 0
              }
            }
          }

          // Fill with real data
          let userFarm = userChains.farms[farm.shortName];
          userFarm.assetsStaked = farmAssets.amount > 0;
          userFarm.assets = {
            updatedAt: Date.now() / 1000,
            amount: farmAssets.amount,
            pendingAmount: farmAssets.pendingAmount
          };
        }
      }
    }

    // If we really fetched all farms, we save this date as last updated date for this chainid
    if (fetchAllFarms)
      addressCache.chains[chainId].updatedAt = Date.now() / 1000;

    addressCache.fetchInProgress = false;

    console.log("addressCache", addressCache.chains[chainId]);

    // Produce output data - one array entry per farm
    let userFarmKeys = Object.keys(addressCache.chains[chainId].farms);
    let summarizedAssets: SummarizedStakedAssets[] = userFarmKeys.map(farmShortName => {
      let userFarm = addressCache.chains[chainId].farms[farmShortName];
      let tinFarm = getTinFarmByShortName(farmShortName);
      return {
        farmName: tinFarm.name,
        farmShortName: tinFarm.shortName,
        farmUrl: tinFarm.url,
        farmIconUrl: `https://api.tin.network/icons/farms/${tinFarm.icon}.png`,
        amountUSD: userFarm.assets.amount,
        pendingAmountUSD: userFarm.assets.pendingAmount,
        lastUpdated: userFarm.assets.updatedAt
      }
    });

    return summarizedAssets;
  });
}

/**
 * Returns the total asset amount (usd) for the given address, chain and farm.
 */
async function fetchFarmAssets(address: string, farm: TinFarm, chainId: number): Promise<{ amount: number; pendingAmount: number; } | null> {
  console.log(`Fetching staked assets for address ${address}, farm ${farm.shortName}, chain ${chainId}`);

  try {
    let response = await fetch(`${tinNetworkConfig.apiEndpoint}/users/farm/${address}?chainId=${chainId}&farmId=${farm.shortName}`, {
      headers: {
        "X-API-KEY": tinNetworkConfig.apiKey
      }
    });

    if (response.ok) {
      let assets = await response.json() as TinFarmAssetsResponse;
      //console.log("tin assets", assets);

      // Normally only 1 item in "data" as we filtered with a single farm but let's loop.
      let amount = 0;
      let pendingAmount = 0; // staked amount, need to withdraw
      let iterableAssets: TinFarmAsset[] = [];

      // Make an asset array out of a possible "array or object"
      if (assets.data) { // Can be null, if Tin provides no info about a specific farm (eg: filda on ESC)
        if (Array.isArray(assets.data))
          iterableAssets = assets.data;
        else
          iterableAssets = [assets.data];
      }

      for (let asset of iterableAssets) {
        // In case of error, the amount can be null or undefined in tin api.
        if (asset.amountPrice === undefined || asset.amountPrice === null) {
          console.log("fetchFarmAssets KO - unknown amount price", asset.amountPrice);
          return null;
        }
        else {
          amount += asset.amountPrice;
          pendingAmount += asset.pendingPrice || 0;
        }
      }

      return { amount, pendingAmount };
    }
    else {
      console.log("fetchFarmAssets KO", response.statusText);
      return null;
    }
  }
  catch (e) {
    console.error(e);
    console.log("fetchFarmAssets KO");
    return null;
  }
}