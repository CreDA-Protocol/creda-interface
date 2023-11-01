


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
