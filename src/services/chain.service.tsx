export type ChainCapability = {
  canFetchWalletTokens: boolean; // We can fetch the list of user's tokens (wallet tab of portfolio) using the third party portfolio api
}

/**
 * List of chain capabilities, as different chains can have different behaviours.
 */
const chainCapabilities: {
  [chainId in ChainName]: ChainCapability;
} = {
  ethereum: {
    canFetchWalletTokens: true
  },
  arbitrum: {
    canFetchWalletTokens: true
  },
  esc: {
    canFetchWalletTokens: true
  },
  elatest: {
    canFetchWalletTokens: false
  },
  heco: {
    canFetchWalletTokens: true
  },
  hecotest: {
    canFetchWalletTokens: false
  },
  bsc: {
    canFetchWalletTokens: true
  },
  local: {
    canFetchWalletTokens: false
  },
  polygon: {
    canFetchWalletTokens: true
  },
  ropsten: {
    canFetchWalletTokens: false
  },
  celo: {
    canFetchWalletTokens: true
  },
  celotest: {
    canFetchWalletTokens: false
  }
};

export function canFetchWalletTokens(chainId: ChainId) {
  return chainCapabilities[chainFromId(chainId)].canFetchWalletTokens;
}

export type ChainName = 'arbitrum' | 'esc' | 'elatest' | 'heco' | 'hecotest' | 'bsc' | 'local' | 'polygon' | 'ethereum' | 'ropsten' | 'celo' | 'celotest';

export type ChainIdList = {
  [chain in ChainName]: number;
}

export type ChainId = ChainIdList[keyof ChainIdList];

export const ChainIds: ChainIdList = {
  ethereum: 1,
  ropsten: 3,
  esc: 20,
  elatest: 21,
  heco: 128,
  hecotest: 256,
  bsc: 56,
  local: 1337,
  polygon: 137,
  arbitrum: 42161,
  //kovan: 42,
  //rinkeby: 4,
  //goerli: 5,
  celo: 42220,
  celotest: 44787
}

export function chainFromId(chainId: number): ChainName {
  const chain = Object.entries(ChainIds).find(([key, val]) => val === chainId)?.[0] as ChainName;
  if (!chain)
    console.warn(`Chain ID ${chainId} is not in the configured chains!`);

  return chain;
}


/**
 * Mapping between chain index in the UI vs chain id
 */
export const chainIndexToId: ChainId[] = [
  ChainIds.ethereum, // "Ethereum",
  ChainIds.bsc, // "BSC",
  ChainIds.esc, // "Elastos ESC",
  ChainIds.celo, // "CELO",
  // ChainIds.heco, // "HECO", hide
  ChainIds.arbitrum, // "Arbitrum",
  ChainIds.polygon, // "Polygon",
];

export const chainTitles: { [chainId: ChainId]: string } = {
  [ChainIds.ethereum]: "Ethereum",
  [ChainIds.bsc]: "BSC",
  [ChainIds.esc]: "Elastos ESC",
  [ChainIds.celo]: "CELO",
  [ChainIds.heco]: "HECO",
  [ChainIds.polygon]: "Polygon",
  [ChainIds.arbitrum]: "Arbitrum"
};

export const ChainType: any = {
  Ethereum: "eth",
  HECO: "heco",
  Polygon: "polygon",
  BSC: "bsc",
  CELO: 'celo',
  "Elastos ESC": "esc"
};