
export type PortfolioWalletToken = {
  //valueBTC: number;
  value: number; // number of tokens (TBD?)
  icon: string; // token http image
  symbol: string;
  price: number; // USD value of 1 token
  priceChangePercentage24h?: number; // 0-1 percent change of the market price in the last 24h
  amount: number; // USD total balance for the user
}

export type PortfolioWalletTokenList = {
  total: number;
  tokens: PortfolioWalletToken[];
}