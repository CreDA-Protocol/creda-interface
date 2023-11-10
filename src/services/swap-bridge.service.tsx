import { balanceToBigNumber, bigNumberToBalance, logError } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { chainFromId } from "@services/chains/chain.service";
import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import { ContractConfig } from "src/contract/ContractConfig";
import { useContract } from "./contracts.service";
import { ChainIds } from "./chains/chain-configs";

// 获取跨链数量
export function useWrapAmount(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const contract = useContract(ContractConfig.Router[network]?.address, ContractConfig.Router.abi)
  const [data, setData] = useState({
    loading: true,
    data: 0,
  });

  useEffect(() => {
    const getResult = async () => {
      if (!contract || !account) {
        return
      }
      const wrapChainId = chainId === ChainIds.esc ? 0 : 1
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [contract, account, chainId])
  return data;
}

// 获取自己所有币种的钱包余额
/* export function useSwapBalance() {
    const { chainId } = useContext(NetworkTypeContext);
    const { account } = useContext(WalletAddressContext);
    const network = chainFromId(chainId);
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
        const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
        return () => clearInterval(interval);
    }, [account, network])
    return info;
} */

export function useSwapPrice(amount: number, tokens: string[]) {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
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

    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, routerContract, amount, tokens, path])
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