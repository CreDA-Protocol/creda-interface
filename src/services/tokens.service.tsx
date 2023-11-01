import { ApprovalState, bigNumberToBalance, chainFromId } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { MaxUint256 } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';
import { useTokenContract } from "@hooks/useContract";
import { BigNumber } from "ethers";
import { useCallback, useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import ContractConfig from "src/contract/ContractConfig";
import { LoadingContext, LoadingType } from "src/provider/LoadingProvider";
import { useTransactionAdder } from "src/state/transactions/hooks";

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
 * Gets the balance of a given token, for the active UI wallet, on the active UI network.
 * The returned balance is a number of tokens.
 */
export function useBalance(symbol: string): any {
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
        balance: Number(bigNumberToBalance(res))
      });
    }

    // Repeatedly fetch the balance until unmounted.
    const interval = setInterval(fetchTokenBalance, GlobalConfiguration.refreshInterval);

    return () => clearInterval(interval);
  }, [account, tokenContract]);

  return info;
}

/**
 * Queries the current amount of tokens authorized to be spend from user's tokens at
 * given token address, by the given spender.
 */
const useAllowance = (tokenAddress: string, spender: string) => {
  const [allowance, setAllowance] = useState(BigNumber.from(0));
  const token = useTokenContract(tokenAddress);
  const { account } = useContext(WalletAddressContext);

  useEffect(() => {
    const getResult = () => {
      if (!account || !token || !spender) {
        return;
      }
      token?.allowance(account, spender)
        .then((res: BigNumber) => {
          setAllowance(res);
        })
    }
    getResult();
  }, [account, spender, token]);

  return allowance;
};

/**
 * Approves a spender to spend user's tokens from the given token contract.
 */
export function useApprove(tokenAddress: string, spender: string, approvedIfTokenContractMissing = false): [ApprovalState, () => Promise<void>] {

  const loading = useContext(LoadingContext)
  const tokenContract = useTokenContract(tokenAddress);
  const currentAllowance = useAllowance(tokenAddress, spender)
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