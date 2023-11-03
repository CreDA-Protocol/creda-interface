import { bigNumberToBalance, getPriceByApi, logError, marketsConfig, multiCallConfig, walletInfo } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { useTokenContract } from "@hooks/useContract";
import { ChainIds, chainFromId } from "@services/chain.service";
import { ContractCallContext, Multicall } from "ethereum-multicall";
import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import ContractConfig, { BankConfig, EarnConfig } from "src/contract/ContractConfig";
import { isNativeToken } from "./tokens.service";

/**
 * 获取币种借贷信息
 */
export function useDaInfo(symbol: string, markets: any): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  // const network = chainFromId(chainId);
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, markets, blocksPerDay, symbol])

  return info;
}

/**
* 获取币种借贷信息
*/
export function useEarnInfo(symbol: string, markets: any): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, markets, blocksPerDay, symbol])

  return info;
}

/**
* Earn  获取钱包信息
*/
export function useEarnResult() {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const [info, setInfo] = useState({});
  let markets: any = Object.values(EarnConfig);
  let contractCallContext: ContractCallContext[] = [];
  const contractCallResult: any = {};

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
      if (chainId !== ChainIds.arbitrum) {
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, contractCallContext, contractCallResult, network])
  return info;
}

/**
 * Banking  获取市场借贷信息
 */
export function useMarketsResult() {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
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
        if (chainId !== ChainIds.arbitrum) {
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, contractCallContext, contractCallResult, network]);

  return info;
}

/**
 * 获取钱包余额
 */
export function useWalletInfo(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const [info, setInfo] = useState({
    loading: true,
    ETH: 0,
    USDT: 0,
    USDC: 0,
    DAI: 0,
    CREDA: 0,
  });
  const USDTContract = useTokenContract(ContractConfig.USDT[network]?.address);
  const USDContract = useTokenContract(ContractConfig.USDC[network]?.address);
  const DAIContract = useTokenContract(ContractConfig.DAI[network]?.address);
  const CREDAContract = useTokenContract(ContractConfig.CREDA[network]?.address);

  useEffect(() => {
    const getResult = async () => {
      if (!account || !USDTContract || !USDContract || !DAIContract || !CREDAContract) {
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, USDTContract, USDContract, DAIContract, CREDAContract, network])
  return info;
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
* 获取存款
*/
function getSavingsBalance(markets: any, symbol: string, account: string) {
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
  const usdtPrice = BigNumber.from(markets['USDT.priceOracle.getUnderlyingPrice'][0].hex)
  const price = Number(bigNumberToBalance(priceRes)) / Number(bigNumberToBalance(usdtPrice))
  console.log(`${symbol} priceInUsdt: ${price}`)
  return price;
}

export function useIconPrice(icon: string): any {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const getResult = async () => {
      try {
        const info: any = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD`).then((response) => response.json())
        if (info.DISPLAY[icon]) {
          let temp = info.DISPLAY[icon]['USD'].PRICE.split(' ')[1].replace(/,/g, '')
          setPrice(Number(temp))
        } else {
          setPrice(0)
        }
      } catch (e) {
        logError("useCNFTInfo", e)
      }
    };
    getResult()
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [icon])
  return price;
}

/**
 * 获取采集信息- USDT
 */
/* export function useEarnedUSDTInfo(id: number): any {
    const { chainId } = useContext(NetworkTypeContext);
    const { account } = useContext(WalletAddressContext);
    const network = chainFromId(chainId);

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
        const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
        return () => clearInterval(interval);
    }, [account, collectContract, id, network])
    return info;
} */

/**
 * 获取借款比例
 * @param markets
 * @param symbol
 */
function getDaiFactor(markets: any, symbol: string, account: string, network: string): number {
  // 借款比例
  const collateralFactorMantissa = BigNumber.from(markets[symbol + ".compoundLens.cTokenMetadata"][10].hex)
  const collateralFactor = Number(bigNumberToBalance(collateralFactorMantissa))
  const status = getDaiStatus(markets, symbol, account, network)
  return status ? collateralFactor : 0;
}


/**
* 判断是否开启质押
* @param markets
* @param symbol
* @param account
* @param network
*/
function getDaiStatus(markets: any, symbol: string, account: string, network: string) {

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