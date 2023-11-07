import { BSC_PROVIDER, ERC20_ABI, balanceToBigNumber, bigNumberToBalance, enableNetwork, logError } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { chainFromId } from "@services/chain.service";
import { useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import ContractConfig from "src/contract/ContractConfig";
import { useContract, useContractWithProvider } from "./contracts.service";

/**
 * Gets the BSC balance in USDT, of the currently active wallet.
 */
export function useBscUsdt(): any {
  const contract = useContractWithProvider(ContractConfig.USDT.bsc.address, ERC20_ABI, BSC_PROVIDER)
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const [data, setData] = useState({
    loading: true,
    data: 0,
  });

  useEffect(() => {
    const getResult = async () => {
      if (!contract || !account) {
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [contract, account])
  return data;
}

export function useSushiPrice(amount: number, path: string[]): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, contract, amount, path])
  return info;
}