import { TinToken } from "./tokens.";

export type TinFarmAssetPool = {
  "id": string; // "73e7b868-2320-42ec-8e8a-b4cb6fae83b3",
  "type": string; // "erc20",
  "poolId": number; //0,
  "name": string; // "Glide",
  "symbol": string; // "glide",
  "icon": null,
  "decimals": number; // 18,
  "chainId": number; //20,
  "address": string // "0xd39ec832ff1caafab2729c76ddeac967abca8f27",
  "contractAddress": string; // "0xbe224bb2efe1ae7437ab428557d3054e63033da9",
  "transactionAddress": string; // "0xd39ec832ff1caafab2729c76ddeac967abca8f27",
  "tokens": TinToken[],
  "rewardTokens": number; // null,
  "position": number; // null,
  "price": number; // 0.01023421043948837,
  "ratio": [], // ?
  "totalSupply": number; // 24535038.04532455,
  "tvl": number; //0,
  "apy": number; // null,
  "dailyApy": number; // null,
  "riskScore": number; // null,
  "amount": number; //146.77145576545234,
  "amountPrice": number; //1.5020899648136978,
  "pendingPrice": number; //null,
}

export type TinFarmAsset = {
  id: string; // '20ce04ee-441a-469d-aaae-d66b93772c20',
  name: string; //'Glide',
  shortName: string; //'glide',
  url: string; //'https://glidefinance.io/',
  icon: string; //'glide',
  chainIds: number[],
  tvl: number;
  twitter: string; // 'GlideFinance',
  rugdoc: null, // ?
  rugpull: null, // ?
  insurance: null, // ?
  feature: boolean, // ?
  pools: TinFarmAssetPool[],
  amountPrice: number; // 6493.844381977916,
  pendingPrice: number; // 0, // ?
  borrowPrice: number; // 0, // ?
  wallet: string;
};

export type TinFarmAssetsResponse = {
  statusCode: 200;
  message: 'Done!';
  data: TinFarmAsset | TinFarmAsset[];
};

/**
 * Data returned by our stake api with less information than we get from TIN.
 */
export type SummarizedStakedAssets = {
  farmName: string;
  farmShortName: string;
  amountUSD: number;
  pendingAmountUSD: number;
  lastUpdated: number; // Timestamp
  farmUrl: string;
  farmIconUrl: string;
}