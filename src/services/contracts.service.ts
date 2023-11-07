import ERC20_ABI from "@abi/generic/ERC20.json";
import { ChainId, getRPCProvider } from "@services/chain.service";
import { Contract, Signer, ethers, providers } from "ethers";
import { useMemo } from "react";
import { walletInfo } from "../common/Common";

export function getContract(address: string, abi: any, signerOrProvider?: Signer | providers.BaseProvider): Contract {
  if (!address || !abi) {
    return null;
  }

  // If a custom provider is used, only read-only methods can be called in contracts.
  return new ethers.Contract(address, abi, signerOrProvider);
}

/* export function getTokenContract(address: string) {
    return getContract(address, ERC20_ABI);
} */

// returns null on errors
export function useContract(address: string, ABI: any, withSignerIfPossible = true): Contract | null {
  return useMemo(() => {
    if (!address || !ABI)
      return null;

    try {
      return getContract(address, ABI, withSignerIfPossible ? walletInfo.signer : walletInfo.provider)
    } catch (error) {
      console.error('Failed to useContract', error)
      return null
    }
  }, [address, ABI, withSignerIfPossible])
}

export function useTokenContract(tokenAddress: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

// returns null on errors
export function useContractWithProvider(address: string, ABI: any, signerOrProvider?: Signer | providers.BaseProvider): Contract | null {
  return useMemo(() => {
    if (!address || !ABI) return null
    try {
      return getContract(address, ABI, signerOrProvider)
    } catch (error) {
      console.error('Failed to useContractWithProvider', error)
      return null
    }
  }, [address, ABI, signerOrProvider])
}

/**
 * Returns a Contract instance that uses a read-only JSON RPC provider for the given chain ID.
 */
export function useChainContract(contractAddress: string, ABI: any, chainId: ChainId): Contract | null {
  return useMemo(() => {
    const provider = getRPCProvider(chainId);

    if (!contractAddress || !ABI || !provider)
      return null;

    try {
      return getContract(contractAddress, ABI, provider)
    } catch (error) {
      console.error('Failed to useContractWithProvider', error)
      return null
    }
  }, [contractAddress, ABI, chainId])
}