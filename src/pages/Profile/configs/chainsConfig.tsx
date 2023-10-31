import { ChainId, ChainIds } from "@common/Common";

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
