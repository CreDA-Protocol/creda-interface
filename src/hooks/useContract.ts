import ERC20_ABI from "@abi/generic/ERC20.json";
import { Contract, ethers } from "ethers";
import { useMemo } from "react";
import { walletInfo } from "../common/Common";
export function getContract(address: string, abi: any, other?: any) {
    if (!address || !abi) {
        return null;
    }
    // 使用Provider 连接合约，将只有对合约的可读权限
    return new ethers.Contract(address, abi, other);
}

export function getTokenContract(address: string) {
    return getContract(address, ERC20_ABI);
}

// returns null on errors
export function useContract(address: string, ABI: any, withSignerIfPossible = true): Contract | null {
    return useMemo(() => {
        if (!address || !ABI) return null
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
export function useContractWithProvider(address: string, ABI: any, provider: any): Contract | null {
    return useMemo(() => {
        if (!address || !ABI) return null
        try {
            return getContract(address, ABI, provider)
        } catch (error) {
            console.error('Failed to useContractWithProvider', error)
            return null
        }
    }, [address, ABI, provider])
}

