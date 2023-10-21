

export type WalletToken = {
  valueBTC: number;
  value: number;
  icon: string; // token http image
  symbol: string;
  price: number;
  priceChangePercentage24h?: number;
  amount: string;
}

export type WalletList = {
  total: number;
  tokens: WalletToken[];
}

export type GlidePrice = {
  derivedELA: string;
  derivedUSD: string;
  id: string;  // token contract address
  name: string;
  symbol: string;
  totalLiquidity: string;
  totalTransactions: string;
  tradeVolumeUSD: string;
}
