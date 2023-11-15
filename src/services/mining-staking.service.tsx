import { ERC20_ABI, bigNumberToBalance, formatBalance, logError, mathPriceTo8, walletInfo } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { BigNumber, ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import { ContractConfig, EarnConfig } from "src/contract/ContractConfig";
import { ChainIds } from "./chains/chain-configs";
import { chainFromId, chainHasCredaToken } from "./chains/chain.service";
import { useContract } from "./contracts.service";
import { getCoinPrice } from "./glidefinance.service";
import { getPriceByApi } from "./pricing.service";

/**
 * 获取softlaunch信息
 */
export function useMiningPoolInfo(symbol: string, pid: number): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  // const account = "0xa3d41a68dbf6427aeF1eAD570763eDdb01D3E022"
  const network = chainFromId(chainId);

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
  const InitialMintContract = chainId === ChainIds.esc ? escContract : arbContract
  const tokenContract = useContract(ContractConfig[symbol][network]?.address, ERC20_ABI)
  const credaContract = useContract(ContractConfig.PersonalDataMinePoolFix[network]?.address, ContractConfig.PersonalDataMinePoolFix.abi);

  useEffect(() => {
    const getResult = async () => {
      try {
        if (!account || !chainHasCredaToken(chainId) || !InitialMintContract || !tokenContract || !credaContract) {
          return;
        }
        const decimals: number = await tokenContract.decimals()
        const balance: BigNumber = await tokenContract.balanceOf(account)
        const staked: BigNumber = await InitialMintContract?.balanceOf(account, BigNumber.from(pid));
        const claimable: BigNumber = await (chainId === ChainIds.esc ? InitialMintContract?.earned(account) : InitialMintContract?.earned(account, BigNumber.from(pid)))
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, InitialMintContract, tokenContract, credaContract, pid, symbol])
  return info;
}

/**
* 获取hardlaunch信息
*/
export function useHardPoolInfo(symbol: string, pid: number): any {
  // console.log(symbol,pid)
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  // const account = "0xa3d41a68dbf6427aeF1eAD570763eDdb01D3E022"
  const network = chainFromId(chainId);

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
        if (!account || !chainHasCredaToken(chainId) || !InitialMintContract || !tokenContract || !credaContract || !ctokenContract) {
          return;
        }
        const decimals: number = await tokenContract.decimals()
        let balance: BigNumber = BigNumber.from(0)

        if (chainId === ChainIds.esc && symbol === 'ELA') {
          balance = await walletInfo.provider?.getBalance(account) as BigNumber
        } else {
          balance = await ctokenContract.balanceOf(account)
        }

        const staked: BigNumber = await InitialMintContract?.balanceOf(account, BigNumber.from(pid));
        let claimable: BigNumber = BigNumber.from(0)

        try {
          claimable = await InitialMintContract?.earned(account);

        } catch { }
        const poolInfo: any = await InitialMintContract?.poolInfo(BigNumber.from(pid))
        const totalSupply: BigNumber = await InitialMintContract.totalSupply(BigNumber.from(pid))
        const priceConfig: any = {
          CPUSDT: 1,
          CPUSDC: 0.9993,
          CPWBTC: 54880,
          CPDAI: 1.001
        }
        let price: any = ''
        if (chainId === ChainIds.esc) {
          const priceInfo = await getCoinPrice(JSON.stringify([ContractConfig[symbol][network]?.address.toLowerCase()]))
          if (priceInfo && priceInfo[0])
            price = Number(formatBalance(priceInfo[0].derivedUSD, 4))
        } else {
          price = await getPriceByApi(symbol)
        }

        console.log('useHardPoolInfo price:', symbol, price);

        const tvl = Number(bigNumberToBalance(totalSupply, decimals)) * price * 2

        const dailyRes = poolInfo[4]

        const apr = tvl === 0 ? 0 : Number(bigNumberToBalance(dailyRes)) * 365 * 86400 / tvl

        let pointRes: BigNumber = BigNumber.from(0)
        try {
          pointRes = await credaContract?.creditScore(account)

        } catch { }

        let claimed: BigNumber = BigNumber.from(0)
        try {
          claimed = await credaContract?.credaClaimed(account)

        } catch { }
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, InitialMintContract, tokenContract, credaContract, ctokenContract, network, pid, symbol])
  return info;
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
        logError("usePositionInfo", e)
      }
    };
    getResult()
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [])
  return positionInfo;
}


// 获取pool信息
export function usePoolInfo(tokenA: string, tokenB: string) {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
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

    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, factoryContract, network, routerContract, tokenA, tokenB])
  return info;
}

/**
 * 获取收益信息
 */
/* export function useMiningInfo(): any {
    const { chainId } = useContext(NetworkTypeContext);
    const { account } = useContext(WalletAddressContext);
    const network = chainFromId(chainId);

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
        const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
        return () => clearInterval(interval);
    }, [account, credaContract, credaPlusContract])

    return info;
} */

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
/* export function useStakeV2(symbol: string): any {
    const { chainId } = useContext(NetworkTypeContext);
    const { account } = useContext(WalletAddressContext);
    const network = chainFromId(chainId);

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
        const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
        return () => clearInterval(interval);
    }, [account, credaContract, network, symbol])
    return info;
} */
