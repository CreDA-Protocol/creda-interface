import { bigNumberToBalance, logError, mathPriceTo8 } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { chainFromId, chainHasCredaToken } from "@services/chains/chain.service";
import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import { ContractConfig } from "src/contract/ContractConfig";
import { useContract, useTokenContract } from "./contracts.service";

/**
 * 获取CREDA info
 */
export function useCredaInfo(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

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
        if (!account || !CredaContract || !chainHasCredaToken(chainId)) {
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, CredaContract])
  return info;
}

/**
 * Get information about unlocked creda tokens
 */
export function useUnLockInfo(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

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
      if (!account || !chainHasCredaToken(chainId) || !INFTContract || !INFTUnlockContract || !INFTLpContract) {
        return;
      }
      const balance: BigNumber = await INFTContract?.balanceOf(account);
      const locked: BigNumber = await INFTContract?.lockedOf(account);
      const staked: BigNumber = await INFTUnlockContract?.getStaked(ContractConfig.ETH_CREDA_LP[network]?.address);
      // console.log(account,ContractConfig.IFNT_USDT_LP[network]?.address)

      let speed: BigNumber = BigNumber.from(0)
      let unlock: BigNumber = BigNumber.from(0)
      let lpBalance: BigNumber = BigNumber.from(0)
      try {
        speed = await INFTUnlockContract?.getUnlockSpeed(account, ContractConfig.ETH_CREDA_LP[network]?.address);
      } catch {
      }

      try {
        unlock = await INFTUnlockContract?.claimableUnlocked(ContractConfig.ETH_CREDA_LP[network]?.address);
      } catch {
      }

      try {
        lpBalance = await INFTLpContract?.balanceOf(account);
      } catch {
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, INFTContract, INFTUnlockContract, INFTLpContract, network])
  return info;
}
