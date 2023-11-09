import { ApprovalState, ERC20_ABI, bigNumberToBalance, } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { MaxUint256 } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';
import { ChainId, chainFromId, getRPCProvider } from "@services/chain.service";
import { BigNumber, constants } from "ethers";
import { useCallback, useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import ContractConfig from "src/contract/ContractConfig";
import { LoadingContext, LoadingType } from "src/provider/LoadingProvider";
import { useTransactionAdder } from "src/state/transactions/hooks";
import { getContract, useChainContract, useContractWithProvider, useTokenContract } from "./contracts.service";

/**
 * 判断是否是 native token
 * @param symbol
 */
export function isNativeToken(symbol: string) {
  if (symbol === 'ETH' || symbol === 'ELA' || symbol === 'HT') {
    return true
  }
  return false
}

/**
 * 获取余额
 */
/* export function useBalance(symbol: string): string {
    const { chainId } = useContext(NetworkTypeContext);
    const { account } = useContext(WalletAddressContext);
    const network = chainFromId(chainId);
    const [balance, setBlance] = useState("");
    const tokenContract = useTokenContract(ContractConfig[symbol][network]?.address);

    useEffect(() => {
        const getResult = () => {
            if (!account || !tokenContract) {
                return;
            }
            // console.log(symbol,tokenContract,account,"++++++")
            tokenContract?.balanceOf(account)
                .then((res: BigNumber) => {
                    setBlance(bigNumberToBalance(res));
                })
        }
        const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
        return () => clearInterval(interval);
    }, [account, tokenContract])
    return balance;
} */

/**
 * Gets the balance of a given token, for the active UI wallet, on the given chain.
 *
 * The returned balance is a number of tokens.
 */
export function useBalance(tokenContractAddress: string, chainId: ChainId): { loading: boolean; balance: number; } {
  const { account } = useContext(WalletAddressContext);
  const [balanceInfo, setBalanceInfo] = useState({ loading: true, balance: 0 });
  const tokenContract = useChainContract(tokenContractAddress, ERC20_ABI, chainId);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!account || !tokenContract)
        return;

      const res: BigNumber = await tokenContract?.balanceOf(account);
      setBalanceInfo({ loading: false, balance: Number(bigNumberToBalance(res)) });
    }
    fetchTokenBalance();
  }, [account, tokenContract]);

  return balanceInfo;
}

/**
 * Gets the balance of a given token, for the active UI wallet, on the active UI network.
 *
 * The returned balance is a number of tokens.
 */
export function useBalanceBySymbol(symbol: string): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const [info, setInfo] = useState({ loading: true, balance: 0 });
  const tokenContract = useTokenContract(ContractConfig[symbol][network]?.address);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!account || !tokenContract)
        return;

      const res: BigNumber = await tokenContract?.balanceOf(account);
      setInfo({
        loading: false,
        balance: Number(bigNumberToBalance(res)) // TODO: NOT OK - WORKS ONLY FOR 18 decimals TOKENS!
      });
    }

    // Repeatedly fetch the balance until unmounted.
    const interval = setInterval(fetchTokenBalance, GlobalConfiguration.refreshInterval);

    return () => clearInterval(interval);
  }, [account, tokenContract]);

  return info;
}

export const getTokenDecimals = (chainId: ChainId, tokenAddress: string): Promise<number> => {
  const rpcProvider = getRPCProvider(chainId);
  const tokenContract = getContract(tokenAddress, ERC20_ABI, rpcProvider);
  return tokenContract.decimals();
}

/**
 * Returns the number of decimals for the given token on the given chain.
 *
 * TODO: Disk cache...
 */
export const useTokenDecimals = (tokenAddress: string, chainId: ChainId): number => {
  const [decimals, setDecimals] = useState<number>(-1);

  useEffect(() => {
    getTokenDecimals(chainId, tokenAddress)
      .then(_decimals => setDecimals(_decimals))
      .catch((e: any) => {
        console.warn("useTokenDecimals error:", e);
      });
  }, [chainId, tokenAddress]);

  return decimals;
}

/**
 * Tells if a given value is the max allowed value for a uint256
 */
export const isMaxUInt256 = (value: BigNumber): boolean => {
  return value.eq(constants.MaxUint256);
}

export const fetchTokenAllowance = (tokenAddress: string, owner: string, spender: string, chainId: ChainId): Promise<BigNumber> => {
  const rpcProvider = getRPCProvider(chainId);
  const tokenContract = getContract(tokenAddress, ERC20_ABI, rpcProvider);

  // Method code (debug): 0xdd62ed3e
  try {
    return tokenContract.allowance(owner, spender);
  }
  catch (e: any) {
    console.warn("useAllowance error:", e);
    // Silent catch for some reason (legacy). But if not caught, exception happens when launching creda.
    return null;
  };
}

/**
 * Queries the CURRENT amount of tokens authorized to be spend from user's tokens at
 * given token address, by the given spender. This can be lower than the initially approved amount
 * if spender has spent tokens already.
 *
 * The raw (chain) allowance value is returned
 */
export const useTokenAllowance = (tokenAddress: string, spender: string, chainId: ChainId): BigNumber => {
  const [allowance, setAllowance] = useState<BigNumber>(null);
  const rpcProvider = getRPCProvider(chainId);
  const tokenContract = useContractWithProvider(tokenAddress, ERC20_ABI, rpcProvider);
  const { account } = useContext(WalletAddressContext);

  useEffect(() => {
    if (!account || !tokenAddress || !spender || !chainId) {
      setAllowance(null);
      return;
    }

    fetchTokenAllowance(tokenAddress, account, spender, chainId).then(_allowance => setAllowance(_allowance));
  }, [account, tokenAddress, spender, tokenContract, chainId]);

  return allowance;
};

/**
 * See useAllowance. Returned value is in number of tokens, not raw.
 */
export const useAllowanceInTokens = (tokenAddress: string, spender: string, chainId: ChainId): string => {
  const [allowanceInTokens, setAllowanceInTokens] = useState<string>(null);
  const allowance = useTokenAllowance(tokenAddress, spender, chainId);
  const decimals = useTokenDecimals(tokenAddress, chainId);

  useEffect(() => {
    if (allowance === null || decimals === -1)
      setAllowanceInTokens(null);
    else
      setAllowanceInTokens(bigNumberToBalance(allowance, decimals));
  }, [allowance, decimals]);

  return allowanceInTokens;
}

/**
 * Approves a spender to spend user's tokens from the given token contract.
 */
export function useApprove(tokenAddress: string, spender: string, approvedIfTokenContractMissing = false): [ApprovalState, () => Promise<void>] {
  const loading = useContext(LoadingContext)
  const { chainId } = useContext(NetworkTypeContext);
  const tokenContract = useTokenContract(tokenAddress);
  const currentAllowance = useTokenAllowance(tokenAddress, spender, chainId);
  // const pendingApproval = useHasPendingApproval(tokenContract?.address, spender)
  // check the current approval status
  // const approvalState: ApprovalState = useMemo(() => {
  //     // we might not have enough data to know whether or not we need to approve
  //     if (!currentAllowance) return ApprovalState.UNKNOWN;
  //
  //     // amountToApprove will be defined if currentAllowance is
  //     return currentAllowance.lt(MaxUint256)
  //         ? pendingApproval
  //             ? ApprovalState.PENDING
  //             : ApprovalState.NOT_APPROVED
  //         : ApprovalState.APPROVED;
  // }, [currentAllowance, pendingApproval]);
  const [approvalState, setApproveState] = useState(ApprovalState.UNKNOWN);
  const addTransaction = useTransactionAdder();
  useEffect(() => {
    // Don't need to call approve if the chain doesn't have creda erc20 token.
    if (approvedIfTokenContractMissing && !tokenAddress) {
      setApproveState(ApprovalState.APPROVED);
      return;
    }

    if (!currentAllowance) {
      setApproveState(ApprovalState.UNKNOWN);
    } else if (currentAllowance.eq(BigNumber.from(0))) {
      // console.log(currentAllowance,MaxUint256,"授权额度小了")
      setApproveState(ApprovalState.NOT_APPROVED);
    } else {
      // console.log(currentAllowance,"currentAllowance")
      setApproveState(ApprovalState.APPROVED);
    }
  }, [currentAllowance, approvedIfTokenContractMissing, tokenAddress])

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    setApproveState(ApprovalState.PENDING);
    loading.show(LoadingType.confirm, "Approve")
    tokenContract?.approve(spender, MaxUint256)
      .then(async (response: TransactionResponse) => {
        // addTransaction(response, {
        //     summary: 'Approve',
        //     approval: {
        //         tokenAddress: tokenAddress,
        //         spender: spender
        //     }
        // })
        loading.show(LoadingType.pending, response.hash)
        await response.wait();
        loading.show(LoadingType.success, response.hash)
        setApproveState(ApprovalState.APPROVED);
      })
      .catch((err: any) => {
        setApproveState(ApprovalState.NOT_APPROVED);
        if (err.code === 4001) {
          loading.show(LoadingType.error, err.reason || err.message)
          return
        }
        loading.show(LoadingType.error, err.reason || err.message)
      })
  }, [approvalState, tokenContract, spender, loading]);
  // console.log(approvalState,tokenAddress,spender,currentAllowance.toString(),MaxUint256.toString())
  return [approvalState, approve];
}