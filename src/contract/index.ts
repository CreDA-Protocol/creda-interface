import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  ApprovalState,
  BSC_PROVIDER,
  ChainId,
  SwapList,
  balanceToBigNumber,
  bigNumberToBalance,
  config,
  enableNetwork,
  formatBalance,
  getBuildStatus,
  getPriceByApi,
  getPriceESC,
  logError,
  marketsConfig,
  mathPriceTo8,
  multiCallConfig,
  packageInfoConfig,
  walletInfo
} from '../common/Common'
import { NetworkTypeContext, WalletAddressContext } from "../context"
import { useContract, useContractWithProvider, useTokenContract } from "../hooks/useContract"
import { useTransactionAdder } from "../state/transactions/hooks"
import ContractConfig, { BankConfig, EarnConfig } from './ContractConfig'

import axios from 'axios'
import { ContractCallContext, Multicall } from 'ethereum-multicall'
import { toUtf8String } from "ethers/lib/utils"
import ERC20_ABI from '../abiJson/ERC20.json'
import { Covalent_enableNetwork, Covalent_fetchTokenBalances, WalletToken } from '../common/covalent.helper'
import { ChainType2Id, ProjectConfig } from "../pages/Profile"
import { LoadingContext, LoadingType } from "../provider/loadingProvider"

/**
 * 获取是否授权过获取信用分数
 */
export function useApproveCredit(): number {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [approve, setApprove] = useState(ApprovalState.PENDING);
    const credaContract = useContract(ContractConfig.CredaPool[network]?.address, ContractConfig.CredaPool.abi);
    useEffect(() => {
        const getResult = () => {
            if (!account || !credaContract || !enableNetwork(chainId)) {
                return;
            }
            credaContract?.initialAccount(account)
                .then((res: boolean) => {
                    if (res) {
                        setApprove(ApprovalState.APPROVED)
                    } else {
                        setApprove(ApprovalState.NOT_APPROVED);
                    }
                })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [chainId, account, credaContract])
    return approve;
}

/**
 * 获取信用分数
 */
export function useCreditPoints(): string {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [points, setPoints] = useState("");
    const credaContract = useContract(ContractConfig.CredaPool[network]?.address, ContractConfig.CredaPool.abi);
    useEffect(() => {
        const getResult = () => {
            if (!account || !credaContract) {
                return;
            }
            credaContract?.creditPoint(account)
                .then((res: BigNumber) => {
                    setPoints(bigNumberToBalance(res));
                })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, credaContract])
    return points;
}

/**
 * 获取余额
 */
export function useBalance(symbol: string): string {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
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
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, tokenContract])
    return balance;
}

/**
 * 获取余额
 */
export function useBalanceV2(symbol: string): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [info, setInfo] = useState({
        loading: true,
        balance: 0
    });
    const tokenContract = useTokenContract(ContractConfig[symbol][network]?.address);

    useEffect(() => {
        const getResult = () => {
            if (!account || !tokenContract) {
                return;
            }
            tokenContract?.balanceOf(account)
                .then((res: BigNumber) => {
                    setInfo({
                        loading: false,
                        balance: Number(bigNumberToBalance(res))
                    });
                })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, tokenContract])
    return info;
}

/**
 * 获取收益信息
 */
export function useMiningInfo(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({});
    const credaContract = useContract(ContractConfig.CredaPool[network]?.address, ContractConfig.CredaPool.abi);
    const credaPlusContract = useContract(ContractConfig.CredaTestPlus[network]?.address, ContractConfig.CredaTestPlus.abi);
    // console.log(credaContract,"credaContract")
    useEffect(() => {
        const getResult = async () => {
            if (!account || !credaContract) {
                return;
            }
            const speedRes: BigNumber = await credaContract?.miningSpeed(account);
            const earnedRes: BigNumber = await credaPlusContract?.earned(account);
            let obj = {
                speed: bigNumberToBalance(speedRes, 6),
                earned: bigNumberToBalance(earnedRes)
            }
            setInfo(obj);
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, credaContract, credaPlusContract])

    return info;
}

// /**
//  * 获取质押
//  */
// export function useStake(symbol: string): string {
//     const {chainId} = useActiveWeb3React()
//     const network = NetWorkConfig[chainId || ChainId.ESC];
//     const [balance, setBlance] = useState("");
//     const credaContract = useContract(ContractConfig.CredaPool[network]?.address, ContractConfig.CredaPool.abi);
//     const {account} = useActiveWeb3React();
//
//     useEffect(() => {
//         const getResult = () => {
//             if (!account || !credaContract) {
//                 return;
//             }
//             credaContract?.balanceOf(ContractConfig[symbol][network]?.address, account)
//                 .then((res: BigNumber) => {
//                     setBlance(bigNumberToBalance(res));
//                 })
//         }
//         const interval = setInterval(getResult, config.refreshInterval);
//         return () => clearInterval(interval);
//     }, [account, credaContract])
//     return balance;
// }
//
/**
 * 获取质押
 */
export function useStakeV2(symbol: string): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        stake: 0,
        stakeBg: BigNumber.from(0)
    });
    const credaContract = useContract(ContractConfig.CredaPool[network]?.address, ContractConfig.CredaPool.abi);

    useEffect(() => {
        const getResult = () => {
            if (!account || !credaContract) {
                return;
            }
            credaContract?.balanceOf(ContractConfig[symbol][network]?.address, account)
                .then((res: BigNumber) => {
                    setInfo({
                        loading: false,
                        stake: Number(bigNumberToBalance(res)),
                        stakeBg: res
                    });
                })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, credaContract, network, symbol])
    return info;
}

// 授权方法
export function useApprove(tokenAddress: string, spender: string): [ApprovalState, () => Promise<void>] {
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
        if (!currentAllowance) {
            setApproveState(ApprovalState.UNKNOWN);
        } else if (currentAllowance.eq(BigNumber.from(0))) {
            // console.log(currentAllowance,MaxUint256,"授权额度小了")
            setApproveState(ApprovalState.NOT_APPROVED);
        } else {
            // console.log(currentAllowance,"currentAllowance")
            setApproveState(ApprovalState.APPROVED);
        }
    }, [currentAllowance])
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

// 查询授权额度
const useAllowance = (tokenAddress: string, spender: string) => {
    const [allowance, setAllowance] = useState(BigNumber.from(0));
    const token = useTokenContract(tokenAddress);
    // const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    // const network = ChainId[chainId];

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
 * 获取卡片信息
 */
export function useCardInfo(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [info, setInfo] = useState({});
    const nftContract = useContract(ContractConfig.CreditNFT[network]?.address, ContractConfig.CreditNFT.abi);
    // console.log(nftContract,network,ContractConfig.CreditNFT[network]?.address, ContractConfig.CreditNFT.abi,"nftContract")
    useEffect(() => {
        const getResult = async () => {
            if (!account || !nftContract) {
                return;
            }
            const infoRes: any = await nftContract?.getOwnerNFTInfo(account);
            // console.log(infoRes,"useCardInfo")
            let obj = {
                level: infoRes.level.toNumber(),
                id: infoRes.nftNo.toNumber(),
            }
            setInfo(obj);
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, nftContract])

    return info;
}

/**
 * Banking  获取市场借贷信息
 */
export function useMarketsResult() {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [info, setInfo] = useState({});
    let markets: any = Object.values(BankConfig);
    let contractCallContext: ContractCallContext[] = []
    const contractCallResult: any = {}
    for (let item of markets) {
        const itemInfo = item[network];
        if (!itemInfo) {
            continue
        }
        // console.log(itemInfo)
        let callContext: ContractCallContext = {
            reference: itemInfo.symbol + '.cToken',
            contractAddress: itemInfo.cToken.address,
            abi: itemInfo.cToken.abi,
            calls: [
                {
                    reference: itemInfo.symbol + '.cToken.balanceOf.' + account,
                    methodName: 'balanceOf',
                    methodParameters: [account]
                },
                {
                    reference: itemInfo.symbol + '.cToken.decimals.' + account,
                    methodName: 'decimals',
                    methodParameters: []
                },
                {
                    reference: itemInfo.symbol + '.cToken.totalSupply.' + account,
                    methodName: 'totalSupply',
                    methodParameters: []
                },
            ]
        }
        let originContext: ContractCallContext = {
            reference: itemInfo.symbol + '.cTokenOrigin',
            contractAddress: itemInfo.cToken.caddress,
            abi: itemInfo.cToken.cabi,
            calls: [
                {
                    reference: itemInfo.symbol + '.cToken.supplyRatePerBlock',
                    methodName: 'supplyRatePerBlock',
                    methodParameters: []
                },
            ]
        }
        let erc20CallContext: ContractCallContext = {
            reference: itemInfo.symbol + '.token',
            contractAddress: itemInfo.address,
            abi: itemInfo.abi,
            calls: []
        }
        if (!isNativeToken(itemInfo.symbol)) {
            erc20CallContext.calls.push(
                {
                    reference: itemInfo.symbol + '.token.balanceOf.' + account,
                    methodName: 'balanceOf',
                    methodParameters: [account]
                }, {
                    reference: itemInfo.symbol + '.token.decimals.' + account,
                    methodName: 'decimals',
                    methodParameters: []
                }
            )
        }
        contractCallContext.push(callContext)
        contractCallContext.push(originContext)
        contractCallContext.push(erc20CallContext)
    }

    useEffect(() => {
        async function getResult() {
            try {
                if (!account) {
                    return;
                }
                if (!walletInfo.provider) {
                    return
                }
                if (chainId !== ChainId.arbitrum) {
                    return
                }

                const multicall = new Multicall({
                    multicallCustomContractAddress: multiCallConfig.network[network]?.address,
                    ethersProvider: walletInfo.provider
                });
                // console.log("multicall 开始请求")
                const multicallResult = await multicall.call(contractCallContext)
                // console.log(multicallResult)
                for (const resultItem in multicallResult.results) {
                    let callsReturnArray = multicallResult.results[resultItem].callsReturnContext
                    for (let callsReturnItem of callsReturnArray) {
                        contractCallResult[callsReturnItem.reference] = callsReturnItem.returnValues
                    }
                }
                // console.log(contractCallResult,"multicall 请求结束")
                setInfo(contractCallResult)
            } catch (e) {
                console.log(e)
            }
        }

        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account,chainId, contractCallContext, contractCallResult, network])
    return info;
}

/**
 * 获取币种借贷信息
 */
export function useDaInfo(symbol: string, markets: any): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    // const network = ChainId[chainId];
    const [info, setInfo] = useState({
        loading: true
    });
    // console.log(credaContract,"credaContract")
    const ethMantissa = 1e18;
    const blocksPerDay = 20 * 60 * 24;
    const daysPerYear = 365;
    useEffect(() => {
        const getResult = async () => {
            if (!account || !symbol || !Object.values(markets).length || !markets[symbol + '.token.balanceOf.' + account]) {
                return;
            }
            const priceConfig: any = {
                USDT: 1,
                USDC: 0.9993,
                WBTC: 54880,
                DAI: 1.001
            }
            const data = markets;
            // 存款
            const supplyRes: BigNumber = BigNumber.from(data[symbol + '.cToken.supplyRatePerBlock'][0].hex);
            const supplyApy = (((Math.pow((supplyRes.toNumber() / ethMantissa * blocksPerDay) + 1, daysPerYear - 1))) - 1) * 100;
            // 自己存款余额
            const savingscTokenBalanceRes: BigNumber = BigNumber.from(data[symbol + '.cToken.balanceOf.' + account][0].hex);
            const savingscTokenDecimalRes: number = data[symbol + '.cToken.decimals.' + account][0];
            const savingscTokenBalance = Number(bigNumberToBalance(savingscTokenBalanceRes, savingscTokenDecimalRes));
            // 钱包余额
            const walletBalanceRes: BigNumber = data[symbol + '.token.balanceOf.' + account][0].hex
            const walletBalanceDecimalRes: number = data[symbol + '.token.decimals.' + account][0];
            const walletBalance = Number(bigNumberToBalance(walletBalanceRes, walletBalanceDecimalRes))
            //tvl
            const cTokenTvlRes: BigNumber = data[symbol + '.cToken.totalSupply.' + account][0].hex
            const cTokenTvl: number = Number(bigNumberToBalance(cTokenTvlRes, savingscTokenDecimalRes))
            let obj = {
                loading: false,
                savingsApy: supplyApy,
                balance: walletBalanceRes,
                formatBalance: walletBalance,
                decimals: walletBalanceDecimalRes,
                cBalance: savingscTokenBalanceRes,
                cFormatBalance: savingscTokenBalance,
                cDecimals: savingscTokenDecimalRes,
                cTvl: cTokenTvlRes,
                cFormatTvl: cTokenTvl * priceConfig[symbol]
            }
            // console.log(obj)
            setInfo(obj);
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, markets, blocksPerDay, symbol])

    return info;
}

/**
 * 获取币种借贷信息
 */
export function useEarnInfo(symbol: string, markets: any): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [info, setInfo] = useState({
        loading: true
    });

    // console.log(credaContract,"credaContract")
    const ethMantissa = 1e18;
    const blocksPerDay = 20 * 60 * 24;
    const daysPerYear = 365;
    useEffect(() => {
        const getResult = async () => {
            if (!account || !symbol || !Object.values(markets).length || !markets[symbol + '.token.balanceOf.' + account]) {
                return;
            }
            const priceConfig: any = {
                USDT: 1,
                USDC: 0.9993,
                WBTC: 54880,
                DAI: 1.001
            }
            const data = markets;
            // 存款
            const supplyRes: BigNumber = BigNumber.from(data[symbol + '.cToken.supplyRatePerBlock'][0].hex);
            let supplyApy = (((Math.pow((supplyRes.toNumber() / ethMantissa * blocksPerDay) + 1, daysPerYear - 1))) - 1);
            if (symbol === "USDT") {
                supplyApy = supplyApy / 400
            }
            // 自己存款余额
            const savingscTokenBalanceRes: BigNumber = BigNumber.from(data[symbol + '.cToken.balanceOf.' + account][0].hex);
            const savingscTokenDecimalRes: number = data[symbol + '.cToken.decimals.' + account][0];
            const savingscTokenBalance = Number(bigNumberToBalance(savingscTokenBalanceRes, savingscTokenDecimalRes));
            // 钱包余额
            const walletBalanceRes: BigNumber = data[symbol + '.token.balanceOf.' + account][0].hex
            const walletBalanceDecimalRes: number = data[symbol + '.token.decimals.' + account][0];
            const walletBalance = Number(bigNumberToBalance(walletBalanceRes, walletBalanceDecimalRes))
            //tvl
            const cTokenTvlRes: BigNumber = data[symbol + '.cToken.totalSupply.' + account][0].hex
            const cTokenTvl: number = Number(bigNumberToBalance(cTokenTvlRes, savingscTokenDecimalRes))
            // console.log(symbol,cTokenTvlRes,savingscTokenDecimalRes)
            const price = await getPriceByApi(symbol)
            let obj = {
                loading: false,
                savingsApy: supplyApy,
                balance: walletBalanceRes,
                formatBalance: walletBalance,
                decimals: walletBalanceDecimalRes,
                cBalance: savingscTokenBalanceRes,
                cFormatBalance: savingscTokenBalance,
                cDecimals: savingscTokenDecimalRes,
                cTvl: cTokenTvlRes,
                cFormatTvl: cTokenTvl * price
            }

            setInfo(obj);
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, markets, blocksPerDay, symbol])

    return info;
}

/**
 * Earn  获取钱包信息
 */
export function useEarnResult() {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [info, setInfo] = useState({});
    let markets: any = Object.values(EarnConfig);
    let contractCallContext: ContractCallContext[] = []
    const contractCallResult: any = {}
    for (let item of markets) {
        const itemInfo = item[network];
        if (!itemInfo) {
            continue
        }
        // console.log(itemInfo)
        let callContext: ContractCallContext = {
            reference: itemInfo.symbol + '.cToken',
            contractAddress: itemInfo.cToken.address,
            abi: itemInfo.cToken.abi,
            calls: [
                {
                    reference: itemInfo.symbol + '.cToken.balanceOf.' + account,
                    methodName: 'balanceOf',
                    methodParameters: [account]
                },
                {
                    reference: itemInfo.symbol + '.cToken.decimals.' + account,
                    methodName: 'decimals',
                    methodParameters: []
                },
                {
                    reference: itemInfo.symbol + '.cToken.totalSupply.' + account,
                    methodName: 'totalSupply',
                    methodParameters: []
                },
            ]
        }
        let originContext: ContractCallContext = {
            reference: itemInfo.symbol + '.cTokenOrigin',
            contractAddress: itemInfo.cToken.caddress,
            abi: itemInfo.cToken.cabi,
            calls: [
                {
                    reference: itemInfo.symbol + '.cToken.supplyRatePerBlock',
                    methodName: 'supplyRatePerBlock',
                    methodParameters: []
                },
            ]
        }
        let erc20CallContext: ContractCallContext = {
            reference: itemInfo.symbol + '.token',
            contractAddress: itemInfo.address,
            abi: itemInfo.abi,
            calls: []
        }
        if (!isNativeToken(itemInfo.symbol)) {
            erc20CallContext.calls.push(
                {
                    reference: itemInfo.symbol + '.token.balanceOf.' + account,
                    methodName: 'balanceOf',
                    methodParameters: [account]
                }, {
                    reference: itemInfo.symbol + '.token.decimals.' + account,
                    methodName: 'decimals',
                    methodParameters: []
                }
            )
        }
        contractCallContext.push(callContext)
        contractCallContext.push(originContext)
        contractCallContext.push(erc20CallContext)
    }
    useEffect(() => {
        async function getResult() {
            if (!account) {
                return;
            }
            if (!walletInfo.provider) {
                return
            }
            if (chainId !== ChainId.arbitrum) {
                return
            }
            const multicall = new Multicall({
                multicallCustomContractAddress: multiCallConfig.network[network]?.address,
                ethersProvider: walletInfo.provider
            });

            // console.log(contractCallContext,"multicall 开始请求")
            const multicallResult = await multicall.call(contractCallContext)
            // console.log(multicallResult)
            for (const resultItem in multicallResult.results) {
                let callsReturnArray = multicallResult.results[resultItem].callsReturnContext
                for (let callsReturnItem of callsReturnArray) {
                    contractCallResult[callsReturnItem.reference] = callsReturnItem.returnValues
                }
            }
            // console.log(contractCallResult,"multicall 请求结束")
            setInfo(contractCallResult)
        }

        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account,chainId, contractCallContext, contractCallResult, network])
    return info;
}

/**
 * 获取存款/借款总额
 */
export function getTotalDaiBalance(account: string, network: string, markets: any) {
    let obj = {
        totalSavingsBalance: 0,
        totalLoanBalance: 0
    }
    if (!markets || !Object.values(markets).length || !account) {
        return obj;
    }

    const marketsArr = Object.values(marketsConfig);
    marketsArr.forEach((item: any, index) => {
        const data = item[network];
        if (data) {
            const savingsBalance = BigNumber.from(markets[data.symbol + '.cToken.balanceOfUnderlying.' + account][0].hex)
            const loanBalance = BigNumber.from(markets[data.symbol + '.cToken.borrowBalanceCurrent.' + account][0].hex)
            obj.totalSavingsBalance += Number(bigNumberToBalance(savingsBalance))
            obj.totalLoanBalance += Number(bigNumberToBalance(loanBalance))
        }
    })
    return obj;
}

/**
 * 获取借款比例
 * @param markets
 * @param symbol
 */
export function getDaiFactor(markets: any, symbol: string, account: string, network: string): number {
    // 借款比例
    const collateralFactorMantissa = BigNumber.from(markets[symbol + ".compoundLens.cTokenMetadata"][10].hex)
    const collateralFactor = Number(bigNumberToBalance(collateralFactorMantissa))
    const status = getDaiStatus(markets, symbol, account, network)
    return status ? collateralFactor : 0;
}

/**
 * 获取借款限制
 * @param markets
 * @param symbol
 * @param account
 */
export function getBorrowLimit(markets: any, symbol: string, account: string, network: string) {
    if (!Object.values(markets).length) {
        return {
            borrowLimit: 0,
            borrowFait: 0
        }
    }
    const savingsBalanceRes: BigNumber = BigNumber.from(markets[symbol + '.cToken.balanceOfUnderlying.' + account][0].hex);
    const savingsBalance = Number(bigNumberToBalance(savingsBalanceRes))
    console.log(savingsBalance, "savingsBalance")
    const borrowLimit = savingsBalance * getDaiFactor(markets, symbol, account, network)
    const priceRes = BigNumber.from(markets[symbol + '.priceOracle.getUnderlyingPrice'][0].hex)
    const price = Number(bigNumberToBalance(priceRes))
    const borrowFait = borrowLimit * price;
    return {
        borrowLimit,
        borrowFait
    }
}

export function getTotalBorrowLimit(markets: any, account: string, network: string) {
    let marketsArr = Object.values(marketsConfig)
    let total = 0;
    marketsArr.forEach((item: any, index: number) => {
        total += getBorrowLimit(markets, item[network].symbol, account, network).borrowFait
    })
    console.log(total, "getTotalBorrowLimit")
    return total;
}

/**
 * 判断是否开启质押
 * @param markets
 * @param symbol
 * @param account
 * @param network
 */
export function getDaiStatus(markets: any, symbol: string, account: string, network: string) {

    // 是否开启抵押
    const daiStatusRes: any = markets["comptroller.getAssetsIn." + account];
    let daiStatus = false;
    for (let i = 0, len = daiStatusRes.length; i < len; i++) {
        if (daiStatusRes[i].toLowerCase() === marketsConfig[symbol][network].cToken.address.toLowerCase()) {
            daiStatus = true;
            break;
        }
    }
    return daiStatus;
}

/**
 * 判断是否是 native token
 * @param symbol
 */
function isNativeToken(symbol: string) {
    // console.log(symbol,"symbol")
    if (symbol === 'ETH' || symbol === 'ELA' || symbol === 'HT') {
        return true
    }
    return false
}

/**
 * 获取加入星球信息
 */
export function useMyStar(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        status: false,
        pid: 0
    });
    const initContract = useContract(ContractConfig.InitializeAddress[network]?.address, ContractConfig.InitializeAddress.abi);

    useEffect(() => {
        const getResult = async () => {
            if (!account || !initContract) {
                return;
            }
            const status: number = await initContract?.initialize(account);
            const pid: BigNumber = await initContract?.planet(account);
            setInfo({
                loading: false,
                status: Boolean(status),
                pid: Number(pid.toString())
            })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, initContract])
    return info;
}

/**
 * 获取星球总人数
 */
export function useStarInfo(pid: number): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        amount: 0
    });
    const initContract = useContract(ContractConfig.InitializeAddress[network]?.address, ContractConfig.InitializeAddress.abi);

    useEffect(() => {
        const getResult = async () => {
            if (!account || !initContract || !pid) {
                return;
            }
            const amount: BigNumber = await initContract?.initializeAmount(BigNumber.from(pid));
            setInfo({
                loading: false,
                amount: Number(amount.toString())
            })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, initContract, pid])
    return info;
}

/**
 * 获取钱包余额
 */
export function useWalletInfo(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [info, setInfo] = useState({
        loading: true,
        ETH: 0,
        USDT: 0,
        USDC: 0,
        DAI: 0,
        CREDA:0,
    });
    const USDTContract = useTokenContract(ContractConfig.USDT[network]?.address);
    const USDContract = useTokenContract(ContractConfig.USDC[network]?.address);
    const DAIContract = useTokenContract(ContractConfig.DAI[network]?.address);
    const CREDAContract = useTokenContract(ContractConfig.CREDA[network]?.address);

    useEffect(() => {
        const getResult = async () => {
            if (!account || !USDTContract || !USDContract || !DAIContract ||!CREDAContract) {
                return;
            }
            const usdc_decimals: number = await USDContract.decimals()
            const usdt_decimals: number = await USDTContract.decimals()
            const dai_decimals: number = await DAIContract.decimals()
            const creda_decimals: number = await CREDAContract.decimals()

            const ETH: any = await walletInfo.provider?.getBalance(account)
            const USDT: BigNumber = await USDTContract?.balanceOf(account);
            const USDC: BigNumber = await USDContract?.balanceOf(account);
            const DAI: BigNumber = await DAIContract?.balanceOf(account);
            const CREDA: BigNumber = await CREDAContract?.balanceOf(account);
            setInfo({
                loading: false,
                ETH: Number(bigNumberToBalance(ETH)),
                USDT: Number(bigNumberToBalance(USDT, usdt_decimals)),
                USDC: Number(bigNumberToBalance(USDC, usdc_decimals)),
                DAI: Number(bigNumberToBalance(DAI, dai_decimals)),
                CREDA: Number(bigNumberToBalance(CREDA, creda_decimals)),
            })
          }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, USDTContract, USDContract, DAIContract, CREDAContract, network])
    return info;
}

/**
 * 获取礼包信息
 */
export function useGiftInfo(tid: number): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        token1: "",
        token2: "",
        price1: 0,
        price2: 0,
        amount: 0,
        planet: 0,
    });
    const initContract = useContract(ContractConfig.InitializeAddress[network]?.address, ContractConfig.InitializeAddress.abi)

    useEffect(() => {
        const getResult = async () => {
            if (!account || !initContract || tid < 0) {
                return;
            }
            const infoRes: any = await initContract?.giftType(BigNumber.from(tid));
            setInfo({
                loading: false,
                token1: infoRes.token1,
                token2: infoRes.token2,
                price1: Number(bigNumberToBalance(infoRes.price1)),
                price2: Number(bigNumberToBalance(infoRes.price2)),
                amount: Number(infoRes.amount.toString()),
                planet: Number(infoRes.planet.toString()),
            })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, initContract, tid])
    return info;
}



/**
 * 获取采集信息- USDT
 */
export function useEarnedUSDTInfo(id: number): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        earned: 0
    });
    const collectContract = useContract(ContractConfig.Vault[network]?.address, ContractConfig.Vault.abi)

    useEffect(() => {
        const getResult = async () => {
            if (!account || !collectContract || id < 0) {
                return;
            }
            const infoRes: BigNumber = await collectContract?.earned(ContractConfig.USDT[network]?.address)
            setInfo({
                loading: false,
                earned: Number(infoRes.toString())
            })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, collectContract, id, network])
    return info;
}


/**
 * 获取采集信息- sCASH
 */
export function useEarnedsCASHInfo(id: number): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        earned: 0
    });
    const collectContract = useContract(ContractConfig.Vault[network]?.address, ContractConfig.Vault.abi)

    useEffect(() => {
        const getResult = async () => {
            if (!account || !collectContract || id < 0) {
                return;
            }
            const infoRes: BigNumber = await collectContract?.earned(ContractConfig.sCASH[network]?.address)
            setInfo({
                loading: false,
                earned: Number(infoRes.toString())
            })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, collectContract, id, network])
    return info;
}

// 获取自己所有币种的钱包余额
export function useSwapBalance() {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [info, setInfo] = useState<any>({
        loading: true,
        data: {}
    });


    useEffect(() => {
        const getResult = async () => {
            if (!account) {
                return;
            }
            if (!walletInfo.provider) {
                return
            }
            const multicall = new Multicall({
                multicallCustomContractAddress: multiCallConfig.network[network]?.address,
                ethersProvider: walletInfo.provider
            });
            let contractCallContext: ContractCallContext[] = []

            const contractCallResult: any = {};
            for (let item of SwapList) {

                let erc20CallContext: ContractCallContext = {
                    reference: item + '.token',
                    contractAddress: ContractConfig[item][network]?.address,
                    abi: ERC20_ABI,
                    calls: [{
                        reference: item + '.balanceOf.' + account,
                        methodName: 'balanceOf',
                        methodParameters: [account]
                    }]
                }
                contractCallContext.push(erc20CallContext)
            }
            const multicallResult = await multicall.call(contractCallContext)
            for (const resultItem in multicallResult.results) {
                let callsReturnArray = multicallResult.results[resultItem].callsReturnContext
                for (let callsReturnItem in callsReturnArray) {
                    const data = callsReturnArray[callsReturnItem]
                    contractCallResult[data.reference] = Number(bigNumberToBalance(BigNumber.from(data.returnValues[0].hex)))
                }
            }
            // console.log(contractCallResult)
            setInfo({
                loading: false,
                data: contractCallResult
            })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, network])
    return info;
}

export function useSwapPrice(amount: number, tokens: string[]) {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const routerContract = useContract(ContractConfig.MdexRouter[network]?.address, ContractConfig.MdexRouter.abi);
    const [info, setInfo] = useState<any>({
        loading: true,
        data: {}
    });

    const path = tokens.map(item => {
        return ContractConfig[item][network]?.address
    })


    useEffect(() => {
        const getResult = async () => {
            console.log(amount)
            if (amount === 0) {
                setInfo({
                    loading: false,
                    data: {
                        [tokens[0]]: 0,
                        [tokens[1]]: 0
                    }
                })
                return
            }
            if (!account || !routerContract) {
                return;
            }
            const res: any = await routerContract?.getAmountsOut(balanceToBigNumber(amount), path)
            setInfo({
                loading: false,
                data: {
                    [tokens[0]]: Number(bigNumberToBalance(res[0])),
                    [tokens[1]]: Number(bigNumberToBalance(res[1]))
                }
            })
        };

        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, routerContract, amount, tokens])
    return info;
}

export async function getSwapPrice(amount: number, path: string[], routerContract: any, factoryContract: any) {
    if (!amount || !path.length || !routerContract || !factoryContract) {
        return {
            from: 0,
            to: 0
        }
    }
    const res: any = await routerContract?.getAmountsOut(balanceToBigNumber(amount), path)
    return {
        from: Number(bigNumberToBalance(res[0])),
        to: Number(bigNumberToBalance(res[1]))
    }
}

// 获取pool信息
export function usePoolInfo(tokenA: string, tokenB: string) {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const routerContract = useContract(ContractConfig.MdexRouter[network]?.address, ContractConfig.MdexRouter.abi);
    const factoryContract = useContract(ContractConfig.MdexFactory[network]?.address, ContractConfig.MdexFactory.abi);
    const [info, setInfo] = useState<any>({
        loading: true,
        data: {}
    });
    useEffect(() => {
        const getResult = async () => {


            if (!account || !factoryContract || !walletInfo.provider) {
                return;
            }
            const lpAddr: string = await routerContract?.pairFor(ContractConfig[tokenA][network]?.address, ContractConfig[tokenB][network]?.address)
            const lpContract = new ethers.Contract(lpAddr, ERC20_ABI, walletInfo.provider);
            const totalSupply = await lpContract?.totalSupply();
            const res: any = await factoryContract?.getReserves(ContractConfig[tokenA][network]?.address, ContractConfig[tokenB][network]?.address);
            const lpBalance = await lpContract?.balanceOf(account);
            setInfo({
                loading: false,
                data: {
                    lpAddr: lpAddr,
                    totalSupply: Number(bigNumberToBalance(totalSupply)),
                    [tokenA]: Number(bigNumberToBalance(res[0])),
                    [tokenB]: Number(bigNumberToBalance(res[1])),
                    scale: Number(bigNumberToBalance(res[1])) / Number(bigNumberToBalance(res[0])),
                    lpBalance: Number(bigNumberToBalance(lpBalance))
                }
            })
        };

        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, factoryContract, network, routerContract, tokenA, tokenB])
    return info;
}

/**
 * 获取战舰状态
 */
export function useWarShipBuildInfo(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        data: {}
    });
    const gameBuildContract = useContract(ContractConfig.CreateWarship[network]?.address, ContractConfig.CreateWarship.abi)

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !gameBuildContract) {
                    return;
                }
                const infoRes: any = await gameBuildContract?.myCreating();
                // console.log(infoRes)
                // const data = infoRes.map((item:any,index:number)=>{
                //     return {
                //         id:Number(item[0].toString()),
                //         // status:Number(item[1].toString()),
                //         overTime:Number(item[1].toString()),
                //     }
                // })
                if (!infoRes.length) {
                    setInfo({
                        loading: false,
                        data: {}
                    })
                    return
                }
                const data = {
                    id: Number(infoRes[0].toString()),
                    // status:Number(item[1].toString()),
                    overTime: Number(infoRes[1].toString()),
                }
                setInfo({
                    loading: false,
                    data: data
                })
            } catch (e) {
                // console.log(e,"useWarShipBuildInfo")
                setInfo({
                    loading: false,
                    data: {}
                })
            }
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, gameBuildContract])
    return info;
}

/**
 * 获取战舰状态
 */
export function useMyShip(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        data: []
    });
    const gameBuildContract = useContract(ContractConfig.WarshipNFT[network]?.address, ContractConfig.WarshipNFT.abi)

    useEffect(() => {
        const getResult = async () => {
            if (!account || !gameBuildContract) {
                return;
            }
            const infoRes: any = await gameBuildContract?.getOwnerOf();
            // console.log(infoRes)
            const data = infoRes.map((item: any, index: number) => {
                return {
                    id: Number(item.toString()),
                }
            })
            setInfo({
                loading: false,
                data: data
            })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, gameBuildContract])
    return info;
}

/**
 * 获取战舰状态
 */
export function useShipInfo(id: number): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        data: {}
    });
    const gameBuildContract = useContract(ContractConfig.WarshipNFT[network]?.address, ContractConfig.WarshipNFT.abi)

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !gameBuildContract || !id) {
                    return;
                }
                const infoRes: any = await gameBuildContract?.getWarshipInfo(account, BigNumber.from(id));
                // console.log(infoRes)
                // uint256 warshipNumber; // 我的战舰ID
                // uint256 typeNumber; // 战舰类型
                // uint32 level; // 战舰等级
                // uint256 createTime; // 创建时间
                // uint32 a; // a 速度
                // uint32 b; // b 火力
                // uint32 c; // c 装甲
                // uint32 d; // d 探索
                const data = {
                    id: Number(infoRes.warshipNumber.toString()),
                    tid: Number(infoRes.typeNumber.toString()),
                    level: infoRes.level,
                    createTime: Number(infoRes.createTime.toString()),
                    a: infoRes.a,
                    b: infoRes.b,
                    c: infoRes.c,
                    d: infoRes.d,
                }
                setInfo({
                    loading: false,
                    data: data
                })
            } catch (e) {
                console.log(e)
            }
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, gameBuildContract, id])
    return info;
}

/**
 * 获取制造状态
 */
export function useOpretaBuildInfo(id: number): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        data: {}
    });
    const gameBuildContract = useContract(ContractConfig.BuildOpreta[network]?.address, ContractConfig.BuildOpreta.abi)

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !gameBuildContract) {
                    return;
                }
                const infoRes: any = await gameBuildContract?.creatingData(account, id);
                // console.log(infoRes)
                // const data = infoRes.map((item:any,index:number)=>{
                //     return {
                //         id:Number(item[0].toString()),
                //         // status:Number(item[1].toString()),
                //         overTime:Number(item[1].toString()),
                //     }
                // })
                const data = {
                    id: id,
                    // status:Number(item[1].toString()),
                    overTime: Number(infoRes.toString()),
                }
                setInfo({
                    loading: false,
                    data: data
                })
            } catch (e) {
                console.log(e, "useOpretaBuildInfo")
                setInfo({
                    loading: false,
                    data: {}
                })
            }
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, gameBuildContract, id])
    return info;
}

/**
 * 获取制造中心 信息
 */
export function useDataBaseBuildInfo(id: number): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        data: {}
    });
    const gameBuildContract = useContract(ContractConfig.BuildDataBase[network]?.address, ContractConfig.BuildDataBase.abi)

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !gameBuildContract) {
                    return;
                }
                const infoRes: any = await gameBuildContract?.getBuildData(account, id);
                // console.log(infoRes)
                // const data = infoRes.map((item:any,index:number)=>{
                //     return {
                //         id:Number(item[0].toString()),
                //         // status:Number(item[1].toString()),
                //         overTime:Number(item[1].toString()),
                //     }
                // })
                const data = {
                    id: id,
                    level: infoRes.level,
                    lastUpdateTime: Number(infoRes.lastUpdateTime.toString()),
                    startTime: Number(infoRes.startTime.toString()),
                }
                setInfo({
                    loading: false,
                    data: data
                })
            } catch (e) {
                console.log(e, "useDataBaseBuildInfo")
                setInfo({
                    loading: false,
                    data: {}
                })
            }
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, gameBuildContract, id])
    return info;
}

/**
 * 获取探索信息
 */
export function useExploreInfo(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        data: {}
    });
    const exploreContract = useContract(ContractConfig.WarshipExplore[network]?.address, ContractConfig.WarshipExplore.abi)

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !exploreContract) {
                    return;
                }
                const statusRes: BigNumber = await exploreContract?.exploreStatus(account);
                const endTimeRes: BigNumber = await exploreContract?.exploreEndtime(account);

                const data = {
                    status: Number(statusRes.toString()),
                    exploreEndtime: Number(endTimeRes.toString()),
                }
                setInfo({
                    loading: false,
                    data: data
                })
            } catch (e) {
                console.log(e, "useExploreInfo")
                setInfo({
                    loading: false,
                    data: {}
                })
            }
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, exploreContract])
    return info;
}

// 获取自己所有建筑生产任务的信息
export function useBuildTasking(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const [info, setInfo] = useState<any>({
        loading: true,
        data: {}
    });


    useEffect(() => {
        const getResult = async () => {
            if (!account) {
                return;
            }
            if (!walletInfo.provider) {
                return
            }
            const multicall = new Multicall({
                multicallCustomContractAddress: multiCallConfig.network[network]?.address,
                ethersProvider: walletInfo.provider
            });
            let contractCallContext: ContractCallContext[] = []

            const contractCallResult: any = {};
            const items = Object.values(packageInfoConfig)
            const needItems: any = items.filter((item: any, index) => {
                if (item.need) {
                    return true;
                }
            })
            // const needItems = [packageInfoConfig["41"]];
            let buildTaskingCallContext: ContractCallContext = {
                reference: 'getBuildTasking',
                contractAddress: ContractConfig.Production[network]?.address,
                abi: ContractConfig.Production.abi,
                calls: []
            }

            for (let item of needItems) {
                let callsItem = {
                    reference: item.id + '.getBuildTasking.' + account,
                    methodName: 'getBuildTasking',
                    methodParameters: [account, BigNumber.from(item.buildId)]
                }
                buildTaskingCallContext.calls.push(callsItem)
            }
            contractCallContext.push(buildTaskingCallContext)
            const multicallResult = await multicall.call(contractCallContext)
            for (const resultItem in multicallResult.results) {
                let callsReturnArray = multicallResult.results[resultItem].callsReturnContext
                for (let callsReturnItem in callsReturnArray) {
                    const data = callsReturnArray[callsReturnItem]
                    // console.log(data,"callsReturnArray")
                    contractCallResult[data.reference] = (data.returnValues.length && BigNumber.from(data.returnValues[0].hex).toString() === data.reference.slice(0, data.reference.indexOf('.'))) ? {
                        id: Number(BigNumber.from(data.returnValues[0].hex).toString()),
                        completeTime: Number(BigNumber.from(data.returnValues[1].hex).toString()),
                        status: getBuildStatus(Number(BigNumber.from(data.returnValues[1].hex).toString()))
                    } : {
                        id: 0,
                        completeTime: 0,
                        status: getBuildStatus(0)
                    }
                }
            }
            // console.log(contractCallResult)
            setInfo({
                loading: false,
                data: contractCallResult
            })
        }
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, network])
    return info;
}

/**
 * 获取存款
 */
export function getSavingsBalance(markets: any, symbol: string, account: string) {
    let obj = {
        savingsBalance: BigNumber.from(0),
        savingsBalanceFormatted: 0,
        savingsBalanceFiat: 0
    }
    if (!markets || !Object.values(markets).length || !account) {
        return obj;
    }

    const symbolPrice = getPrice(markets, symbol)
    const savingsBalance = BigNumber.from(markets[symbol + '.cToken.balanceOfUnderlying.' + account][0].hex)
    const savingsBalanceFormatted = Number(bigNumberToBalance(savingsBalance));
    const savingsBalanceFiat = savingsBalanceFormatted * symbolPrice;
    return {
        savingsBalance,
        savingsBalanceFormatted,
        savingsBalanceFiat
    }
}

/**
 * 获取存款总额
 */
export function getTotalSavingsBalance(markets: any, account: string, network: string) {
    let totalSavingsBalanceInFiat = 0;
    if (!markets || !Object.values(markets).length || !account) {
        return totalSavingsBalanceInFiat;
    }
    const marketsArr = Object.values(marketsConfig);
    marketsArr.forEach((item: any, index) => {
        const data = item[network];
        const balanceFiat = getSavingsBalance(markets, data.symbol, account).savingsBalanceFiat
        totalSavingsBalanceInFiat += balanceFiat;
    })
    return totalSavingsBalanceInFiat;
}

export function getPrice(markets: any, symbol: string) {
    // console.log(markets,Object.values(markets).length,symbol)
    if (!Object.values(markets).length || !symbol) {
        return 0
    }
    const priceRes = BigNumber.from(markets[symbol + '.priceOracle.getUnderlyingPrice'][0].hex)
    const usdtPrice = BigNumber.from(markets['USDT' + '.priceOracle.getUnderlyingPrice'][0].hex)
    const price = Number(bigNumberToBalance(priceRes)) / Number(bigNumberToBalance(usdtPrice))
    console.log(`${symbol} priceInUsdt: ${price}`)
    return price;
}

/***
 * 船新版本
 */
// 获取DeFiBox钱包列表
export function useBoxWalletList(chainType: string): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    // const account="0xd2050719ea37325bdb6c18a85f6c442221811fac"
    // const network = ChainId[chainId];
    const chainRef = useRef(chainType)
    const initialState = {
        loading: true,
        support: false,
        data: {
            total: 0,
            tokens: [] as WalletToken[]
        }
    }
    const [info, setInfo] = useState(initialState);

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !chainType) {
                    return;
                }
                if (chainRef.current !== chainType) {
                    setInfo(initialState)
                }
                const networkChainId = ChainType2Id[chainType]
                if (networkChainId && Covalent_enableNetwork(networkChainId)) {
                    const data = await Covalent_fetchTokenBalances(account, networkChainId)
                    setInfo({
                        loading: false,
                        support: true,
                        data: data
                    })
                } else {
                  // TODO: other chains
                }
            } catch (e) {
                logError("useBoxWalletList", e)
                setInfo(initialState)
            }
        }
        getResult()
        // const interval = setInterval(getResult, config.refreshInterval);
        // return () => clearInterval(interval);
    }, [account, chainType])
    return info;
}

// 获取DeFiBox授权列表
export function useBoxApproveList(chainType: string): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    // const account="0xd2050719ea37325bdb6c18a85f6c442221811fac"
    // const network = ChainId[chainId];
    const chainRef = useRef(chainType);
    const initialState = {
        loading: true,
        data: {}
    }
    const [info, setInfo] = useState(initialState);

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !chainType) {
                    return;
                }
                if (chainRef.current !== chainType) {
                    setInfo(initialState)
                }
                // const originUrl = `https://defi-app.whatscoin.com/asset/authorized/eth?lang=cn&address=0xd2050719ea37325bdb6c18a85f6c442221811fac&chain=ETH`;
                const originUrl = `https://defi-app.whatscoin.com/asset/authorized/${chainType}?lang=cn&address=${account}&chain=${chainType.toUpperCase()}`;
                let res = await axios.get(originUrl)
                setInfo({
                    loading: false,
                    data: res.data.data
                })
            } catch (e) {
                logError("useBoxApproveList", e)
                setInfo(initialState)
            }
        }
        getResult()
        // const interval = setInterval(getResult, config.refreshInterval);
        // return () => clearInterval(interval);
    }, [account, chainType])
    return info;
}

// 获取DeFiBox参与的项目列表
export function useBoxProjectList(chainType: string, projectName: string): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    // const account = "0xd2050719ea37325bdb6c18a85f6c442221811fac"
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        data: []
    });

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !chainType || !projectName) {
                    return;
                }
                // https://defi-app.whatscoin.com/dgg/account/project/heco/supernova?lang=cn&address=0xd2050719ea37325bdb6c18a85f6c442221811fac
                // https://defi-app.whatscoin.com/dgg/account/project-v2/heco/supernova?lang=en&address=0xd2050719ea37325bdb6c18a85f6c442221811fac
                const originUrl = `https://defi-app.whatscoin.com/dgg/account/project-v2/${chainType}/${projectName}?lang=cn&address=${account}`;
                let res = await axios.get(originUrl)
                // console.log(res)
                setInfo({
                    loading: false,
                    data: res.data.data
                })
            } catch (e) {
                logError("useBoxProjectList", e)
                setInfo({
                    loading: false,
                    data: []
                })
            }
        }
        getResult()
        // const interval = setInterval(getResult, config.refreshInterval);
        // return () => clearInterval(interval);
    }, [account, chainType, projectName])
    return info;
}

// 获取DeFiBox参与的项目列表
export function useBoxProjectAll(chainType: string, projectNames: string[]): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    // const account="0xd2050719ea37325bdb6c18a85f6c442221811fac"
    const network = ChainId[chainId];
    const chainRef = useRef(chainType)
    const initialState: any = {
        loading: true,
        data: []
    }
    const [info, setInfo] = useState(initialState);

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !chainType || !projectNames.length) {
                    return;
                }
                if (chainRef.current !== chainType) {
                    setInfo(initialState)
                }
                // https://defi-app.whatscoin.com/dgg/account/project/heco/supernova?lang=cn&address=0xd2050719ea37325bdb6c18a85f6c442221811fac
                // https://defi-app.whatscoin.com/dgg/account/project-v2/heco/supernova?lang=en&address=0xd2050719ea37325bdb6c18a85f6c442221811fac
                const getBoxProject = (projectName: string) => {
                    const originUrl = `https://defi-app.whatscoin.com/dgg/account/project-v2/${chainType}/${projectName}?lang=cn&address=${account}`;
                    return axios.get(originUrl)
                }
                let allFetch: any = []
                projectNames.forEach((item: string, index: number) => {
                    if (Object.keys(ProjectConfig).indexOf(item) >= 0) {
                        allFetch.push(getBoxProject(item))
                    }
                })
                let res = await axios.all(allFetch)
                let data = res.map((item: any, index: number) => {
                    return item.data.data
                })

                setInfo({
                    loading: false,
                    data: data
                })
            } catch (e) {
                logError("useBoxProjectAll", e)
                // setInfo(initialState)
            }
        }
        getResult()
        // const interval = setInterval(getResult, config.refreshInterval);
        // return () => clearInterval(interval);
    }, [account, chainType, projectNames.join(",")])
    return info;
}

/**
 * 获取解锁信息
 */
export function useUnLockInfo(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        balance: 0,
        locked: 0,
        staked: 0,
        speed: 0,
        unlock: 0,
        lpBalance: 0
    });
    const INFTContract = useContract(ContractConfig.CREDA[network]?.address, ContractConfig.CREDA.abi)
    const INFTUnlockContract = useContract(ContractConfig.CREDA[network]?.address, ContractConfig.CREDA.abi)
    const INFTLpContract = useTokenContract(ContractConfig.ETH_CREDA_LP[network]?.address)


    useEffect(() => {
        const getResult = async () => {
            if (!account || !enableNetwork(chainId) || !INFTContract || !INFTUnlockContract || !INFTLpContract) {
                return;
            }
            const balance: BigNumber = await INFTContract?.balanceOf(account);
            const locked: BigNumber = await INFTContract?.lockedOf(account);
            const staked: BigNumber = await INFTUnlockContract?.getStaked(ContractConfig.ETH_CREDA_LP[network]?.address);
            // console.log(account,ContractConfig.IFNT_USDT_LP[network]?.address)

            let speed:BigNumber = BigNumber.from(0)
            let unlock:BigNumber = BigNumber.from(0)
            let lpBalance:BigNumber = BigNumber.from(0)
            try{
                speed = await INFTUnlockContract?.getUnlockSpeed(account, ContractConfig.ETH_CREDA_LP[network]?.address);
            }catch{
            }

            try{
                unlock = await INFTUnlockContract?.claimableUnlocked(ContractConfig.ETH_CREDA_LP[network]?.address);
            }catch{
            }

            try{
              lpBalance = await INFTLpContract?.balanceOf(account);
            }catch{
            }

            setInfo({
                loading: false,
                balance: Number(mathPriceTo8(bigNumberToBalance(balance))),
                locked: Number(bigNumberToBalance(locked)),
                staked: Number(mathPriceTo8(bigNumberToBalance(staked))),
                speed: Number(bigNumberToBalance(speed)),
                unlock: Number(bigNumberToBalance(unlock)),
                lpBalance: Number(mathPriceTo8(bigNumberToBalance(lpBalance))),
            })
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, chainId, INFTContract, INFTUnlockContract, INFTLpContract, network])
    return info;
}

/**
 * 获取Credit Score
 */
export function useCreditInfo(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        score: 0,
        earn: 0,
        did: ""
    });
    const CredaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi)
    const APIContract = useContract(ContractConfig.APIConsumer[network]?.address, ContractConfig.APIConsumer.abi)


    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !CredaContract || !enableNetwork(chainId) || !APIContract) {
                    return;
                }

                let earn: BigNumber = BigNumber.from(0)
                try{
                    earn = await CredaContract.claimable(account)
                }catch{}

                let did: string = ''
                try{
                  did = await APIContract.getDidByAddress(account)
                }catch{}

                if (chainId===ChainId.esc){
                  const creditScore = await CredaContract.creditScore(account)
                  setInfo({
                    loading: false,
                    score: Number(formatBalance(creditScore.toString(),2)),
                    earn: Number(bigNumberToBalance(earn)),
                    did: did.length === 66 ? btoa(did) :(!did ? did :  toUtf8String(did))
                  })
                }else {
                  let score = 0;
                  try{
                      const originUrl = `https://contracts-elamain.creda.app/api/public/home/contract/getCreditInfo?address=${account}`;
                      let res:any = await axios.get(originUrl);
                      // console.log(res)
                      res = res.data
                      if(res.code===200){
                          let str = res.data.score
                          // console.log(Number(str.slice(2,6)),Number(str.slice(6,10)),Number(str.slice(10,14)),Number(str.slice(14,18)))
                          score = Number(str.slice(2,6))+Number(str.slice(6,10))+Number(str.slice(10,14))+Number(str.slice(14,18))
                      }
                  }catch (e) {
                  }
                  setInfo({
                    loading: false,
                    score:score<=0?calcScore(account):score,
                    earn: Number(bigNumberToBalance(earn)),
                    did: did.length === 66 ? btoa(did) :(!did ? did :  toUtf8String(did))
                  })
                }
            } catch (e) {
                logError("useCreditInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, chainId, CredaContract, APIContract])
    return info;
}
/**
 * 获取Credit Score
 */
export function useCreditScore(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const credaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi)
    const [info, setInfo] = useState({
        loading: true,
        data: 0,
    });
    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account ||!credaContract) {
                    return;
                }
                let score = 0;
                if (chainId===ChainId.esc){
                  const creditScore = await credaContract.creditScore(account)
                  setInfo({
                    loading: false,
                    data: Number(formatBalance(creditScore.toString(),2))
                  })
                }else {
                  try {
                    const originUrl = `https://contracts-elamain.creda.app/api/public/home/contract/getCreditInfo?address=${account}`;
                    let res:any = await axios.get(originUrl);
                    res = res.data
                    if(res.code===200){
                        let str = res.data.score
                        score = Number(str.slice(2,6))+Number(str.slice(6,10))+Number(str.slice(10,14))+Number(str.slice(14,18))
                    }
                    }catch (e) {

                    }
                    setInfo({
                      loading: false,
                      data: score<=0?calcScore(account):score
                  })
                }
            } catch (e) {
                logError("useCreditScore", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account,credaContract,chainId])
    return info;
}
function calcScore(account:string):number{
    const res = Number(account).toFixed(2).slice(2,4)
    return Number(res)+150
}
/**
 * 获取CREDA info
 */
export function useCredaInfo(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        balance: 0,
        locked: 0,
        unlocked: 0
    });
    const CredaContract = useContract(ContractConfig.CREDA[network]?.address, ContractConfig.CREDA.abi)


    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !CredaContract || !enableNetwork(chainId)) {
                    return;
                }
                let balance: BigNumber = await CredaContract.balanceOf(account)
                let locked: BigNumber = await CredaContract.lockedOf(account)
                let unlocked: BigNumber = await CredaContract.unlockedOf(account)
                setInfo({
                    loading: false,
                    balance: Number(bigNumberToBalance(balance)),
                    locked: Number(bigNumberToBalance(locked)),
                    unlocked: Number(mathPriceTo8(bigNumberToBalance(unlocked))),
                })
            } catch (e) {
                logError("useCredaInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, chainId, CredaContract])
    return info;
}

/**
 * 获取softlaunch信息
 */
export function useMiningPoolInfo(symbol: string, pid: number): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    // const account = "0xa3d41a68dbf6427aeF1eAD570763eDdb01D3E022"
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        staked: 0,
        claimable: 0,
        balance: 0,
        decimals: 0,
        pid,
        apr: 0,
        limit: 0
    });
    const arbContract = useContract(ContractConfig.PersonalDataMinePoolPlus[network]?.address, ContractConfig.PersonalDataMinePoolPlus.abi)
    const escContract = useContract(ContractConfig.PersonalDataMinePoolV2[network]?.address, ContractConfig.PersonalDataMinePoolV2[network]?.abi)
    const InitialMintContract = chainId===ChainId.esc?escContract:arbContract
    const tokenContract = useContract(ContractConfig[symbol][network]?.address, ERC20_ABI)
    const credaContract = useContract(ContractConfig.PersonalDataMinePoolFix[network]?.address, ContractConfig.PersonalDataMinePoolFix.abi);

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !enableNetwork(chainId) || !InitialMintContract || !tokenContract || !credaContract) {
                    return;
                }
                const decimals: number = await tokenContract.decimals()
                const balance: BigNumber = await tokenContract.balanceOf(account)
                const staked: BigNumber = await InitialMintContract?.balanceOf(account, BigNumber.from(pid));
                const claimable: BigNumber = await (chainId===ChainId.esc?InitialMintContract?.earned(account):InitialMintContract?.earned(account, BigNumber.from(pid)))
                const poolInfo: any = await InitialMintContract?.poolInfo(BigNumber.from(pid))
                const totalSupply: BigNumber = await InitialMintContract.totalSupply(BigNumber.from(pid))
                const priceConfig: any = {
                    CPUSDT: 1,
                    CPUSDC: 0.9993,
                    CPWBTC: 54880,
                    CPDAI: 1.001
                }
                const tvl = Number(bigNumberToBalance(totalSupply, decimals)) * priceConfig[symbol] * 2
                const dailyRes = poolInfo[4]
                const apr = Number(bigNumberToBalance(dailyRes)) * 365 * 86400 / tvl
                const pointRes: BigNumber = await credaContract?.creditPoint(account)
                const claimed: BigNumber = await credaContract?.credaClaimed(account)
                setInfo({
                    loading: false,
                    staked: Number(bigNumberToBalance(staked, decimals)),
                    // staked:0,
                    claimable: Number(bigNumberToBalance(claimable)),
                    // claimable:0,
                    balance: Number(bigNumberToBalance(balance, decimals)),
                    decimals: decimals,
                    pid,
                    apr,
                    limit: (Number(bigNumberToBalance(pointRes)) - Number(bigNumberToBalance(claimed))) / 4 - Number(bigNumberToBalance(claimable))
                })
            } catch (e) {
                logError("useMiningPoolInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, chainId, InitialMintContract, tokenContract, credaContract, pid, symbol])
    return info;
}

/**
 * 获取hardlaunch信息
 */
export function useHardPoolInfo(symbol: string, pid: number): any {
    // console.log(symbol,pid)
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    // const account = "0xa3d41a68dbf6427aeF1eAD570763eDdb01D3E022"
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        staked: 0,
        claimable: 0,
        balance: 0,
        decimals: 0,
        pid,
        apr: 0,
        limit: 0
    });

    const InitialMintContract = useContract(ContractConfig.PersonalDataMinePoolV2[network]?.address, ContractConfig.PersonalDataMinePoolV2[network]?.abi)
    // console.log(ContractConfig.PersonalDataMinePoolV2[network]?.address)
    const tokenContract = useContract(ContractConfig[symbol][network]?.address, ERC20_ABI)
    // console.log(ContractConfig[symbol][network]?.address)
    const credaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi);
    const ctokenContract = useContract(EarnConfig[symbol][network]?.cToken?.address, ERC20_ABI) //esc随便给了个地址
    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !enableNetwork(chainId) || !InitialMintContract || !tokenContract || !credaContract || !ctokenContract) {
                    return;
                }
                const decimals: number = await tokenContract.decimals()
                let balance: BigNumber = BigNumber.from(0)

                if (chainId === ChainId.esc && symbol === 'ELA'){
                  balance = await walletInfo.provider?.getBalance(account) as BigNumber
                }else {
                  balance = await ctokenContract.balanceOf(account)
                }

                const staked: BigNumber = await InitialMintContract?.balanceOf(account, BigNumber.from(pid));
                let claimable: BigNumber = BigNumber.from(0)

                try{
                    claimable = await InitialMintContract?.earned(account);

                }catch{}
                const poolInfo: any = await InitialMintContract?.poolInfo(BigNumber.from(pid))
                const totalSupply: BigNumber = await InitialMintContract.totalSupply(BigNumber.from(pid))
                const priceConfig: any = {
                    CPUSDT: 1,
                    CPUSDC: 0.9993,
                    CPWBTC: 54880,
                    CPDAI: 1.001
                }
                let price:any = ''
                if (chainId===ChainId.esc){
                  const priceInfo = await getPriceESC(JSON.stringify([ContractConfig[symbol][network]?.address.toLowerCase()]))
                  price = Number( formatBalance(priceInfo[0].derivedUSD,4))
                }else {
                  price = await getPriceByApi(symbol)
                }
                // console.log('symbol==',symbol);

                // console.log('totalSupply==',bigNumberToBalance(totalSupply, decimals));
                console.log('price==',symbol,price);

                const tvl = Number(bigNumberToBalance(totalSupply, decimals)) * price * 2
                // console.log('tvl==',tvl);

                const dailyRes = poolInfo[4]
                // console.log('dailyRes==',bigNumberToBalance(dailyRes));

                const apr = tvl === 0? 0: Number(bigNumberToBalance(dailyRes)) * 365 * 86400 / tvl
                // console.log('apr==',apr);
                // console.log('===================================================');

                let pointRes: BigNumber = BigNumber.from(0)
                try{
                    pointRes = await credaContract?.creditScore(account)

                }catch{}

                let claimed: BigNumber = BigNumber.from(0)
                try{
                    claimed = await credaContract?.credaClaimed(account)

                }catch{}
                setInfo({
                    loading: false,
                    staked: Number(mathPriceTo8(bigNumberToBalance(staked, decimals))),
                    // staked:0,
                    claimable: Number(bigNumberToBalance(claimable)),
                    // claimable:0,
                    balance: Number(mathPriceTo8(bigNumberToBalance(balance, decimals))),
                    decimals: decimals,
                    pid,
                    apr,
                    limit: Number(bigNumberToBalance(pointRes, 0)) - Number(bigNumberToBalance(claimed))
                })
            } catch (e) {
                logError("useHardPoolInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, chainId, InitialMintContract, tokenContract, credaContract, ctokenContract, network, pid, symbol])
    return info;
}

/**
 * 获取CNFT info
 */
export function useCNFTInfo(): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        lv: 0,
        no: 0,
        balance: 0,
        amount: 0
    });
    const CNFTContract = useContract(ContractConfig.CreditNFT[network]?.address, ContractConfig.CreditNFT[network]?.abi || ContractConfig.CreditNFT.abi)
    const credaContract = useContract(ContractConfig.CREDA[network]?.address, ERC20_ABI)


    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !CNFTContract || !enableNetwork(chainId) || !credaContract) {
                    return;
                }
                let lv: number = await CNFTContract.getOwnerNFTLevel(account)
                let balance: BigNumber = await credaContract.balanceOf(account)
                let no: BigNumber = await CNFTContract.getOwnerNFTNo(account)
                let nftInfo: any = await CNFTContract.nftsDict(no)
                setInfo({
                    loading: false,
                    lv,
                    no: Number(no.toString()),
                    balance: Number(bigNumberToBalance(balance)),
                    amount: Number(bigNumberToBalance(nftInfo.amount))
                })
            } catch (e) {
                logError("useCNFTInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, chainId, CNFTContract, credaContract])
    return info;
}

/**
 * 获取CnetWork info
 */
export function useCnetWorkInfo(id: number): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        isJoin: false,
        isLayer: false,
        layer1: 0,
        layer2: 0,
        setting: 0,
        network: 0
    });
    const contract = useContract(ContractConfig.CNETWORK[network]?.address, ContractConfig.CNETWORK.abi)


    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !enableNetwork(chainId) || !contract) {
                    return;
                }
                let isJoin: boolean = await contract.ActiveStatus(account)
                let isLayer = false
                if (id) {
                    isLayer = await contract.activeStatus(BigNumber.from(id))
                }
                let layer1: BigNumber = await contract.LayerStatus(BigNumber.from("0"), account)
                let layer2: BigNumber = await contract.LayerStatus(BigNumber.from("1"), account)
                let netInfo: any = await contract.netInfo(account)
                let network: BigNumber = await contract.EfficientNetwork()
                setInfo({
                    loading: false,
                    isJoin,
                    isLayer,
                    layer1: Number(bigNumberToBalance(layer1)),
                    layer2: Number(bigNumberToBalance(layer2)),
                    setting: Number(bigNumberToBalance(netInfo.csSetting, 0)),
                    network: Number(bigNumberToBalance(network, 0)),
                })
            } catch (e) {
                logError("useCnetWorkInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, chainId, contract, id])
    return info;
}


export function useSushiPrice(amount: number, path: string[]): any {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

    const [info, setInfo] = useState({
        loading: true,
        from: '0',
        to: '0'
    });
    const contract = useContract(ContractConfig.SushiFactory[network]?.address, ContractConfig.SushiFactory.abi)

    useEffect(() => {
        const getResult = async () => {
            try {
                if (!account || !contract || !enableNetwork(chainId)) {
                    return;
                }
                const res: any = await contract.getAmountsOut(balanceToBigNumber(amount), path)

                setInfo({
                    from: bigNumberToBalance(res[0]),
                    to: bigNumberToBalance(res[1], 6),
                    loading: false,
                })
            } catch (e) {
                logError("useCNFTInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [account, chainId, contract, amount, path])
    return info;
}


export function useIconPrice(icon: string): any {

    const [price, setPrice] = useState(0);

    useEffect(() => {
        const getResult = async () => {
            try {
                const info: any = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD`).then((response) => response.json())
                if (info.DISPLAY[icon]) {
                    let temp = info.DISPLAY[icon]['USD'].PRICE.split(' ')[1].replace(/\,/g, '')
                    setPrice(Number(temp))
                } else {
                    setPrice(0)
                }
            } catch (e) {
                logError("useCNFTInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [icon])
    return price;
}


export function usePositionInfo(): any {

    const [positionInfo, setPositionInfo] = useState({
        loading: true,
        data: [],
    });

    useEffect(() => {
        const getResult = async () => {
            try {
                const info: any = await fetch(`https://joincache.joinswap.me/position_address.json`).then((response) => response.json())
                setPositionInfo({
                    loading: false,
                    data: info,
                })
            } catch (e) {
                logError("useCNFTInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [])
    return positionInfo;
}

// 获取bsc usdt余额
export function useBscUsdt(): any {
    const contract = useContractWithProvider(ContractConfig.USDT.bsc.address,ERC20_ABI,BSC_PROVIDER)
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const [data, setData] = useState({
        loading: true,
        data: 0,
    });

    useEffect(() => {
        const getResult = async () => {
            if(!contract || !account){
                return
            }
            try {
                const res: any = await contract.balanceOf(account)
                setData({
                    loading: false,
                    data: Number(bigNumberToBalance(res)),
                })
            } catch (e) {
                logError("useCNFTInfo", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [contract,account])
    return data;
}
// 获取跨链数量
export function useWrapAmount(): any {

    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];
    const contract = useContract(ContractConfig.Router[network]?.address,ContractConfig.Router.abi)
    const [data, setData] = useState({
        loading: true,
        data: 0,
    });

    useEffect(() => {
        const getResult = async () => {
            if(!contract || !account){
                return
            }
            const wrapChainId = chainId===ChainId.esc?0:1
            try {
                const res: any = await contract.wrapAmount(BigNumber.from(wrapChainId))
                setData({
                    loading: false,
                    data: Number(bigNumberToBalance(res)),
                })
            } catch (e) {
                logError("useWrapAmount", e)
            }
        };
        getResult()
        const interval = setInterval(getResult, config.refreshInterval);
        return () => clearInterval(interval);
    }, [contract, account, chainId])
    return data;
}
