import Queue from "promise-queue";
import { TinChain, TinChainsResponse } from "./model/tinnetwork/chains";
import { TinFarm, TinFarmsResponse } from "./model/tinnetwork/farms";
import { StakedAssetsCache } from "./model/tinnetwork/staking";

/**
 * TIN Network API documentation: https://openapi.tin.network/
 */

type TinNetworkConfig = {
  apiEndpoint: string;
  apiKey: string;
}

// TEMP
export const tinNetworkConfig: TinNetworkConfig = {
  apiEndpoint: "https://openapi.tin.network/v1",
  apiKey: process.env.REACT_APP_TEMP_TIN_NETWORK_API_KEY // PAY PER USE - SHOULD BE IN A BACKEND - RESET AFTER MIGRATING TO BACKEND
}

const STAKED_ASSETS_FARMS_CACHE_DURATION_SEC = (24 * 60 * 60); // 1 day to re-check possible farms where an address has assets
const STAKED_ASSETS_ASSETS_CACHE_DURATION_SEC = (10 * 60); // 10 minutes to refresh value of stakes assets fo a known farm

const stakedAssetsCache: StakedAssetsCache = {}; // Empty cache when the service starts

let tinFarms: TinFarm[] = [];
let tinChains: TinChain[] = [];

export const tinRootOperationsQueue = new Queue(1);

async function fetchFarmsList(): Promise<void> {
  // This api returns all the farms at once
  console.log("Fetching TIN farms list");
  try {
    let response = await fetch(`${tinNetworkConfig.apiEndpoint}/farms`);
    if (response.ok) {
      let farms = await response.json() as TinFarmsResponse;
      tinFarms = farms.data;

      console.log(`Fetched ${tinFarms.length} TIN farms`);
    }
    else {
      throw new Error("TIN Network farms list couldn't be fetched! Staking info won't be available!");
    }
  }
  catch (e) {
    console.error("TIN Network farms list couldn't be fetched! Staking info won't be available!", e);
  }
}

async function fetchChainsList() {
  console.log("Fetching TIN chains list");
  try {
    let response = await fetch(`${tinNetworkConfig.apiEndpoint}/chains`);
    if (response.ok) {
      let farms = await response.json() as TinChainsResponse;
      tinChains = farms.data;

      console.log(`Fetched ${tinChains.length} TIN chains`);
    }
    else {
      throw new Error("TIN Network chains list couldn't be fetched! Staking info won't be available!");
    }
  }
  catch (e) {
    console.error("TIN Network chains list couldn't be fetched! Staking info won't be available!", e);
  }
}

/**
   * Is this chain supported by TIN network?
   */
export function isSupportedChain(chainId: number): boolean {
  return tinChains.findIndex(c => c.chainId === chainId) > 0;
}

export function getTinFarmByShortName(shortName: string): TinFarm {
  return tinFarms.find(tf => tf.shortName === shortName);
}

export function getFarmsForChain(chainId: number): TinFarm[] {
  return tinFarms.filter(tf => tf.chainIds.indexOf(chainId) >= 0);
}

async function tinInit() {
  console.log("TIN Network: fetching farms and chains");

  // Load the whole list of available farms and save it. Updated only once per service start
  await Promise.all([
    fetchFarmsList(),
    fetchChainsList()
  ]);
}

// Queue this initialization method right at init to make sure farm/token list requests always get executed after farms and chain lists are known.
tinRootOperationsQueue.add(() => tinInit());