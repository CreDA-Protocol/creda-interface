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

/**
 * Data returned by our stake api with less information than we get from TIN.
 */
export type PortfolioApiStakedAssets = {
  farmName: string;
  farmShortName: string;
  amountUSD: number;
  pendingAmountUSD: number;
  lastUpdated: number; // Timestamp
  farmUrl: string;
  farmIconUrl: string;
}

export type PortfolioApiWalletToken = {
  name: string;
  icon: string;
  price: number; // USD value of one token
  balance: number; // user's number of tokens
  balanceUSD: number; // user's USD worth of this token
  symbol: string;
}