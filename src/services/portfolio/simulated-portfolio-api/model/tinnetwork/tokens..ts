
export type WalletToken = {
  name: string;
  icon: string;
  price: number; // USD value of one token
  balance: number; // user's number of tokens
  balanceUSD: number; // user's USD worth of this token
  symbol: string;
}

export type WalletTokensCacheEntries = {
  fetchInProgress: boolean;
  updatedAt: number; // Timestamp (sec) at which the tokens list was last fetched
  tokens: WalletToken[];
}

// In memory cache for users tokens
export type WalletTokensCache = {
  [address: string]: WalletTokensCacheEntries;
}

export type TinWalletAsset = {
  name: string; // "Tether"
  symbol: string; // "usdt"
  decimals: number; // 6
  icon: string; // "https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663"
  address: string // "0xdac17f9xxxxxxxxxxxxxxxx31ec7",
  amount: number; // Number of tokens owned by the user - 390.514555
  amountPrice: number; // Total balance in USD owner by user - 390.514555
  price: number; // USD value of one token - 1
  price24h: number; // -0.0015546603685503595
  coingeckoId: string; // "tether"
  stable: boolean; // true
  chainId: number; // 1
  wallet: string; // "0x0b93axxxxxxxxxxxxxxxxxxx693fb5fe"
}

export type TinWalletTokensResponse = {
  statusCode: number; // 200,
  message: string; // 'Done!',
  data: TinWalletAsset[]
}