import { ethereum } from "@common/Common";
import { providers } from "ethers";
import { ChainCapability, chainCapabilities } from "./chain-capabilities";
import { AddEthereumChainParameter, ChainIds, ChainRPCs } from "./chain-configs";

export type ChainName = 'arbitrum' | 'esc' | 'elatest' | 'heco' | 'hecotest' | 'bsc' | 'local' | 'polygon' | 'ethereum' | 'ropsten' | 'celo' | 'celotest';

export type ChainIdList = {
  [chain in ChainName]: number;
}

export type ChainId = ChainIdList[keyof ChainIdList];

const getChainCapability = (chainId: ChainId): ChainCapability => {
  const chain = chainFromId(chainId);
  if (chain in chainCapabilities)
    return chainCapabilities[chain];
  else return null;
}

/**
 * Tells if we are able to retrieve portfolio wallet tokens list through third party provider or not.
 */
export function canFetchWalletTokens(chainId: ChainId) {
  return getChainCapability(chainId)?.canFetchWalletTokens || false;
}

/**
 * Tells if the "My bank" menu is available on the UI for the given chain.
 */
export function bankIsEnabledOnChain(chainId: ChainId): boolean {
  return getChainCapability(chainId)?.hasBankFeature || false;
}

/**
 * Tells if the "Vault" menu is available on the UI for the given chain.
 */
export function vaultIsEnabledOnChain(chainId: ChainId): boolean {
  return getChainCapability(chainId)?.hasVaultFeature || false;
}

export function chainSupportsCNFT(chainId: ChainId): boolean {
  return getChainCapability(chainId)?.supportsCNFT || false;
}

export function chainHasCredaToken(chainId: ChainId): boolean {
  return getChainCapability(chainId)?.hasCREDAToken || false;
}

export function chainFromId(chainId: number): ChainName {
  const chain = Object.entries(ChainIds).find(([key, val]) => val === chainId)?.[0] as ChainName;
  if (!chain) {
    console.error(`Chain ID ${chainId} is not in the configured chains!`);
    return null;
  }

  return chain;
}

const rpcProvidersCache: { [chainId: ChainId]: providers.JsonRpcProvider } = {};

export const getRPCProvider = (chainId: ChainId) => {
  if (chainId in rpcProvidersCache)
    return rpcProvidersCache[chainId];

  if (!(chainId in ChainRPCs)) {
    console.error(`No JSON RPC url configured for chain id ${chainId}`);
    return null;
  }

  const rpcUrl = ChainRPCs[chainId];
  rpcProvidersCache[chainId] = new providers.JsonRpcProvider(rpcUrl);
  return rpcProvidersCache[chainId];
}

export function switchNetwork(chainId: ChainId) {
  return ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: "0x" + chainId.toString(16),
      }
    ]
  })
}

/**
 * Switches to the given network is already configured in user's wallet.
 * Otherwise, adds the network to user's wallet first.
 */
export function addNetwork(param: AddEthereumChainParameter) {
  // TODO: it will add a new network if call wallet_addEthereumChain for ethereum.
  if (param.chainId === '0x1') {
    return switchNetwork(parseInt(param.chainId));
  }

  return ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [param]
  })
}
