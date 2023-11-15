import { ChainName } from "./chain.service";

export type ChainCapability = {
  canFetchWalletTokens?: boolean; // We can fetch the list of user's tokens (wallet tab of portfolio) using the third party portfolio api
  hasBankFeature?: boolean; // Whether to show the bank screen or not
  hasVaultFeature?: boolean; // Whether to show the "vault" screen or not
  supportsCNFT?: boolean; // Whether the CreditNFT contract is deployed and supported on this chain
  hasCREDAToken?: boolean; // Whether a CREDA ERC20 token exists on this chain.
}

/**
 * List of chain capabilities, as different chains can have different behaviours.
 */
export const chainCapabilities: {
  [chainId in ChainName]: ChainCapability;
} = {
  ethereum: {
    canFetchWalletTokens: true
  },
  arbitrum: {
    canFetchWalletTokens: true,
    hasBankFeature: true,
    hasVaultFeature: true,
    supportsCNFT: true,
    hasCREDAToken: true
  },
  esc: {
    canFetchWalletTokens: true,
    hasBankFeature: true,
    hasVaultFeature: true,
    supportsCNFT: true,
    hasCREDAToken: true
  },
  elatest: {
    supportsCNFT: true
  },
  heco: {
    canFetchWalletTokens: true
  },
  hecotest: {},
  bsc: {
    canFetchWalletTokens: true
  },
  local: {},
  polygon: {
    canFetchWalletTokens: true
  },
  ropsten: {},
  celo: {
    canFetchWalletTokens: true,
    supportsCNFT: true,
    hasCREDAToken: false
  },
  celotest: {
    supportsCNFT: true,
    hasCREDAToken: false
  }
};
