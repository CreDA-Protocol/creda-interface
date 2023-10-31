import { ApprovalState, ChainIds, ERC20_ABI, bigNumberToBalance, chainFromId, enableNetwork, formatBalance, logError } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { useContract } from "@hooks/useContract";
import axios, { AxiosResponse } from "axios";
import { BigNumber } from "ethers";
import { toUtf8String } from "ethers/lib/utils";
import { useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import ContractConfig from "src/contract/ContractConfig";

export type CreditData = {
    score: string,
    address: string,
    proofs: string[],
    proof: string,
    leaf: string,
}

export type CreditResponse = {
    code: number,
    message: string,
    data: CreditData
}

async function getCreditInfo(address: string): Promise<number> {
    const originUrl = `https://contracts-elamain.creda.app/api/public/home/contract/getCreditInfo?address=${address}`;
    let score = 0;
    try {
        let res: AxiosResponse<CreditResponse> = await axios.get(originUrl);
        // console.log(res)
        let data = res.data
        if (data.code === 200) {
            let str = data.data.score
            score = Number(str.slice(2, 6)) + Number(str.slice(6, 10)) + Number(str.slice(10, 14)) + Number(str.slice(14, 18))
        }
    } catch (e) {
        console.warn("getCreditInfo error:", e);
    }
    return score;
}

/**
 * Get latest credit score information.
 */
export function useCreditInfo(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

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
        try {
          earn = await CredaContract.claimable(account)
        } catch { }

        let did: string = ''
        try {
          did = await APIContract.getDidByAddress(account)
        } catch { }

        if (chainId === ChainIds.esc) {
          const creditScore = await CredaContract.creditScore(account)
          setInfo({
            loading: false,
            score: Number(formatBalance(creditScore.toString(), 2)),
            earn: Number(bigNumberToBalance(earn)),
            did: did.length === 66 ? btoa(did) : (!did ? did : toUtf8String(did))
          })
        } else {
          let score = await getCreditInfo(account);

          setInfo({
            loading: false,
            score: score <= 0 ? calcScore(account) : score,
            earn: Number(bigNumberToBalance(earn)),
            did: did.length === 66 ? btoa(did) : (!did ? did : toUtf8String(did))
          })
        }
      } catch (e) {
        logError("useCreditInfo", e)
      }
    };
    getResult()
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, CredaContract, APIContract])
  return info;
}

/**
 * Get Credit Score
 */
export function useCreditScore(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const credaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi)
  const [info, setInfo] = useState({
    loading: true,
    data: 0,
  });
  useEffect(() => {
    const getResult = async () => {
      try {
        if (!account || !credaContract) {
          return;
        }
        let score = 0;
        if (chainId === ChainIds.esc) {
          const creditScore = await credaContract.creditScore(account)
          setInfo({
            loading: false,
            data: Number(formatBalance(creditScore.toString(), 2))
          })
        } else {
          score = await getCreditInfo(account);

          setInfo({
            loading: false,
            data: score <= 0 ? calcScore(account) : score
          })
        }
      } catch (e) {
        logError("useCreditScore", e)
      }
    };
    getResult()
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, credaContract, chainId])
  return info;
}

function calcScore(account: string): number {
  const res = Number(account).toFixed(2).slice(2, 4)
  return Number(res) + 150
}

/**
 * Get CNFT info
 */
export function useCNFTInfo(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, CNFTContract, credaContract])
  return info;
}

/**
 * Get CnetWork info
 */
export function useCnetWorkInfo(id: number): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, contract, id])
  return info;
}

/**
 * 获取信用分数
 */
/* export function useCreditPoints(): string {
    const { chainId } = useContext(NetworkTypeContext);
    const { account } = useContext(WalletAddressContext);
    const network = chainFromId(chainId);
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
        const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
        return () => clearInterval(interval);
    }, [account, credaContract])
    return points;
} */


/**
 * 获取是否授权过获取信用分数
 */
export function useApproveCredit(): number {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
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
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [chainId, account, credaContract])
  return approve;
}

/**
* 获取卡片信息
*/
/* export function useCardInfo(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
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
      const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
      return () => clearInterval(interval);
  }, [account, nftContract])

  return info;
} */