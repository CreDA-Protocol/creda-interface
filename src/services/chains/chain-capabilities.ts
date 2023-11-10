import { ChainName } from "./chain.service";

export type ChainCapability = {
  canFetchWalletTokens: boolean; // We can fetch the list of user's tokens (wallet tab of portfolio) using the third party portfolio api
  hasBankFeature: boolean; // Whether to show the bank screen or not
  hasVaultFeature: boolean; // Whether to show the "vault" screen or not
}

/**
 * List of chain capabilities, as different chains can have different behaviours.
 */
export const chainCapabilities: {
  [chainId in ChainName]: ChainCapability;
} = {
  ethereum: {
    canFetchWalletTokens: true,
    hasBankFeature: false,
    hasVaultFeature: false
  },
  arbitrum: {
    canFetchWalletTokens: true,
    hasBankFeature: true,
    hasVaultFeature: true
  },
  esc: {
    canFetchWalletTokens: true,
    hasBankFeature: true,
    hasVaultFeature: true
  },
  elatest: {
    canFetchWalletTokens: false,
    hasBankFeature: false,
    hasVaultFeature: false
  },
  heco: {
    canFetchWalletTokens: true,
    hasBankFeature: false,
    hasVaultFeature: false
  },
  hecotest: {
    canFetchWalletTokens: false,
    hasBankFeature: false,
    hasVaultFeature: false
  },
  bsc: {
    canFetchWalletTokens: true,
    hasBankFeature: false,
    hasVaultFeature: false
  },
  local: {
    canFetchWalletTokens: false,
    hasBankFeature: false,
    hasVaultFeature: false
  },
  polygon: {
    canFetchWalletTokens: true,
    hasBankFeature: false,
    hasVaultFeature: false
  },
  ropsten: {
    canFetchWalletTokens: false,
    hasBankFeature: false,
    hasVaultFeature: false
  },
  celo: {
    canFetchWalletTokens: true,
    hasBankFeature: false,
    hasVaultFeature: false
  },
  celotest: {
    canFetchWalletTokens: false,
    hasBankFeature: false,
    hasVaultFeature: false
  }
};
