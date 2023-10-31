

export type WalletToken = {
  valueBTC: number;
  value: number;
  icon: string; // token http image
  symbol: string;
  price: number;
  priceChangePercentage24h?: number;
  amount: string;
}

export type WalletTokenList = {
  total: number;
  tokens: WalletToken[];
}

export enum TokenType {
  ELA = "ELA",
  ERC_20 = "ERC-20",
  ERC_721 = "ERC-721",
  ERC_1155 = "ERC-1155",
}

/**
 * Information about Token
 */
export type TokenInfo = {
  type: TokenType;
  symbol: string;
  name: string;
  decimals: string;
  contractAddress: string;
  balance: string;
}
