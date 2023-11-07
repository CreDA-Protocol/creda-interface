export type PortfolioApiFarm = {
  name: string; // 'Pancakebunny',
  shortName: string; // 'pancakebunny',
  description: string; // null,
  url: string; // 'https://pancakebunny.finance/',
  icon: string; //'pancakebunny',
  color: null,
  chainIds: number[],
  tvl: number; //null,
  audit: boolean; // true,
  auditUrl: string; // 'https://github.com/PancakeBunny-finance/Bunny/blob/main/audits/[HAECHI%20AUDIT]%20PancakeBunny%20Smart%20Contract%20Audit%20Report%20ver%202.0.pdf',
  rugpull: null, // ?
  insurance: null // ?
};

export type PortfolioApiFarmAssetPool = {
  id: string; // "73e7b868-2320-42ec-8e8a-b4cb6fae83b3",
  type: string; // "erc20",
  poolId: number; //0,
  name: string; // "Glide",
  symbol: string; // "glide",
  icon: null,
  decimals: number; // 18,
  chainId: number; //20,
  address: string // "0xd39ec832ff1caafab2729c76ddeac967abca8f27",
  contractAddress: string; // "0xbe224bb2efe1ae7437ab428557d3054e63033da9",
  transactionAddress: string; // "0xd39ec832ff1caafab2729c76ddeac967abca8f27",
  tokens: PortfolioApiWalletToken[],
  rewardTokens: number; // null,
  position: number; // null,
  price: number; // 0.01023421043948837,
  ratio: [], // ?
  totalSupply: number; // 24535038.04532455,
  tvl: number; //0,
  apy: number; // null,
  dailyApy: number; // null,
  riskScore: number; // null,
  amount: number; //146.77145576545234,
  amountPrice: number; //1.5020899648136978,
  pendingPrice: number; //null,
}

export type PortfolioApiFarmAsset = {
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
  pools: PortfolioApiFarmAssetPool[],
  amountPrice: number; // USD price - 6493.844381977916,
  pendingPrice: number; // 0, // ?
  borrowPrice: number; // 0, // ?
  wallet: string;
};

export type PortfolioApiWalletToken = {
  name: string;
  icon: string;
  price: number; // USD value of one token
  balance: number; // user's number of tokens
  balanceUSD: number; // user's USD worth of this token
  symbol: string;
}

export type PortfolioApiSpendableContract = {
  name: string; // "Tether",
  symbol: string; // "usdt",
  chainId: number; // 1,
  icon: string; // "https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663",
  address: string; // "0xdac17f958d2ee523a2206206994597c13d831ec7",
  price: number; // 1.001,
  type: string; // "tokens"
}

export type PortfolioApiApprovedSpender = {
  contract: string; // ERC20 token that can be spent - "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  approved: {
    address: string; // "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    type: string; // "farms"
    id?: string; // "73c5315d-390d-4810-96c1-4f789865d696",
    farmId?: string; // "20ce04ee-441a-469d-aaae-d66b93772c20",
    farm?: {
      id: string; // "20ce04ee-441a-469d-aaae-d66b93772c20",
      name: string; // "Glide",
      url: string; // "https://glidefinance.io/",
      icon: string; // "glide"
    },
  },
  timeStamp: number; // "1692538535",
  allowance: string; // "00000000000000000000000000000000000000000000000000000002540be400"
}

export type PortfolioApiApproval = {
  contract: PortfolioApiSpendableContract;
  approved: PortfolioApiApprovedSpender[];
  wallet: string; // "0x0b93af06e1a7b7b5b00f9a229727855d693fb5fe"
}