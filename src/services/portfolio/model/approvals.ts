
/**
 * List of approvals (token spending) given to a wallet.
 * Authorization addresses are the list of apps/wallets that can spend user's tokens.
 */
export type PortfolioApprovals = {
  authorizations: {
    address: string; // authorized token contract address
  }[]
}
