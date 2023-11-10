import ImageCommon from '@assets/common/ImageCommon';
import { ApprovalState, ERC20_ABI, bigNumberToBalance, enableNetwork, formatBalance, logError } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { ChainIds, chainFromId } from "@services/chain.service";
import axios, { AxiosResponse } from "axios";
import { BigNumber, Contract } from "ethers";
import { toUtf8String } from "ethers/lib/utils";
import { useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import ContractConfig from "src/contract/ContractConfig";
import { useContract } from "./contracts.service";

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

export function getNFTCardBgImage(type: string) {
  switch (type) {
    case '1': {
      return ImageCommon.NFT_LV1
    }
    case '2': {
      return ImageCommon.NFT_LV2
    }
    case '3': {
      return ImageCommon.NFT_LV3
    }
    case '4': {
      return ImageCommon.NFT_LV4
    }
    case '5': {
      return ImageCommon.NFT_LV5
    }
    default: {
      return ImageCommon.NFT_LV1
    }
  }
}

async function getCreditInfoByApi(address: string): Promise<CreditResponse> {
  // The credit score is calculated based on all chains that deployed contracts.
  const originUrl = `https://staging-api.creda.app/contract/getCreditInfo?address=${address}`;
  try {
    let res: AxiosResponse<CreditResponse> = await axios.get(originUrl);
    return res.data;
  } catch (e) {
    // Get exception if no credit score has been generated for new address.
    console.warn("getCreditInfoByApi error:", e);
  }

  return null;
}

async function getCreditScoreByApi(address: string): Promise<number> {
  let score = 0;
  try {
    let data = await getCreditInfoByApi(address);
    if (!data) return score;

    if (data.code === 200) {
      let str = data.data.score
      score = Number(str.slice(2, 6)) + Number(str.slice(6, 10)) + Number(str.slice(10, 14)) + Number(str.slice(14, 18))
    } else if (data.code === 500) {
      // Use the default score if no credit score has been generated for new address.
      score = 50;
    } else {
      console.warn("getCreditScoreByApi failed:", data);
    }
  } catch (e) {
    console.warn("getCreditScoreByApi error:", e);
  }
  return score;
}

// Get credit scores from there (if there is a data contract on the target chain), or call the backend api to get the credit score
// TODO: don't use credaContract
async function getCreditScore(account: string, chainId: number, credaContract: Contract | null, dataContract: Contract | null): Promise<number> {
  let score = 0;
  try {
    if (dataContract) {
      // TODO: We get credit from backend api, then call updateCredit to update data to dataContract.
      let info = await dataContract.getCreditInfo(account)
      // console.log('dataContract.getCreditInfo:', info, account)
      score = Number(formatBalance(info.credit, 2))

      if (score === 0) {
        // Use the default score if no credit score has been generated for new address.
        score = 50;
      }
    }
    else if (chainId === ChainIds.esc) {
      const creditScore = await credaContract.creditScore(account)
      // console.log('credaContract.getCreditInfo:', creditScore)
      score = Number(formatBalance(creditScore.toString(), 2))
    } else {
      let scoreByApi = await getCreditScoreByApi(account);
      score = scoreByApi <= 0 ? calcScore(account) : scoreByApi;
    }
  } catch (e) {
    console.log("getCreditScore error:", e)
  }
  return score;
}

/**
 * Call the backend API’s getCreditInfo() to retrieve the user's score and Merkle Proof
 * Then, call the data contract's updateCredit()
 */
export async function getAndUpdateCredit(address: string): Promise<any> {
  let data = await getCreditInfoByApi(address);
  if (!data) {
    return;
  }

  console.log('getAndUpdateCredit:', data)
  if (data.code === 200) {
    // call the data contract's updateCredit()
  } else if (data.code === 500) {
    // new address, don't call updateCredit()
  } else {
    console.warn("getCreditInfoByApi failed:", data);
  }
  return Promise.resolve({ hash: '0x11111111111111111111111111111111' });
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
  const DataContract = useContract(ContractConfig.DataContract[network]?.address, ContractConfig.DataContract.abi)

  useEffect(() => {
    const getResult = async () => {
      try {
        if (!account || !enableNetwork(chainId)) {
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

        let score = await getCreditScore(account, chainId, CredaContract, DataContract);
        setInfo({
          loading: false,
          score: score,
          earn: Number(bigNumberToBalance(earn)),
          did: did.length === 66 ? btoa(did) : (!did ? did : toUtf8String(did))
        })
      } catch (e) {
        logError("useCreditInfo", e)
      }
    };
    getResult()
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, CredaContract, APIContract, DataContract])
  return info;
}

/**
 * Get Credit Score
 */
export function useCreditScore(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const CredaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi)
  const DataContract = useContract(ContractConfig.DataContract[network]?.address, ContractConfig.DataContract.abi)
  const [info, setInfo] = useState({
    loading: true,
    data: 0,
  });
  useEffect(() => {
    const getResult = async () => {
      try {
        if (!account || (!CredaContract && !DataContract)) {
          return;
        }
        let score = await getCreditScore(account, chainId, CredaContract, DataContract);
        setInfo({
          loading: false,
          data: score
        })
      } catch (e) {
        logError("useCreditScore", e)
      }
    };
    getResult()
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, CredaContract, DataContract, chainId])
  return info;
}

// TODO: why get core by address? Fake score?
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
        if (!account || !CNFTContract || !enableNetwork(chainId)) {
          return;
        }
        let lv: number = await CNFTContract.getOwnerNFTLevel(account)
        let balance = 0;
        // There is no credaContract on some chain.
        if (credaContract) {
          let balanceBignumber: BigNumber = await credaContract.balanceOf(account)
          balance = Number(bigNumberToBalance(balanceBignumber))
        }
        let no: BigNumber = await CNFTContract.getOwnerNFTNo(account)
        let nftInfo: any = await CNFTContract.nftsDict(no)
        setInfo({
          loading: false,
          lv,
          no: Number(no.toString()),
          balance: balance,
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