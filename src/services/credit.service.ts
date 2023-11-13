import { ImageCommon } from '@assets/common/ImageCommon';
import { ApprovalState, ERC20_ABI, bigNumberToBalance, enableNetwork, formatBalance, logError } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import axios, { AxiosResponse } from "axios";
import { BigNumber, Contract, ethers } from "ethers";
import { formatUnits, toUtf8String } from "ethers/lib/utils";
import moment, { Moment } from 'moment';
import { useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import { ContractConfig } from "src/contract/ContractConfig";
import { PermanentCache } from './caches/permanent-cache';
import { ChainIds } from './chains/chain-configs';
import { chainFromId } from './chains/chain.service';
import { useContract } from "./contracts.service";

export type CreditData = {
  score: string,
  address: string,
  proofs: string[],
  proof: string,
  leaf: string,
}

export type CreditDataLocal = CreditData & {
  disableScore?: number
}

/**
 * API response format for the oracle API
 */
export type CreditOracleResponse<T> = {
  code: number,
  message: string,
  data: T;
}

export type CreditDataFromContract = {
  creditScore: number, // disable number
  timestamp: number,
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

async function getCreditInfoByApi(address: string): Promise<CreditOracleResponse<CreditData>> {
  // The credit score is calculated based on all chains that deployed contracts.
  try {
    const url = `${process.env.REACT_APP_ORACLE_API}/contract/getCreditInfo?address=${address}`;
    let res: AxiosResponse<CreditOracleResponse<CreditData>> = await axios.get(url);
    return res.data;
  } catch (e) {
    // Get exception if no credit score has been generated for new address.
    console.warn("getCreditInfoByApi error:", e);
  }

  return null;
}

async function getCreditScoreByApi(address: string): Promise<CreditDataLocal> {
  let creditData: CreditDataLocal = null;
  try {
    let data = await getCreditInfoByApi(address);
    creditData = data.data;

    let disableScore = 0;
    if (data.code === 200) {
      disableScore = getDisableScore(data.data.score);
    } else if (data.code === 500) {
      // Use the default score if no credit score has been generated for new address.
      disableScore = 50;
    } else {
      console.warn("getCreditScoreByApi failed:", data);
    }

    creditData.disableScore = disableScore;
  } catch (e) {
    console.warn("getCreditScoreByApi error:", e);
  }
  return creditData;
}


async function getCreditDataByContract(address: string, dataContract: Contract): Promise<CreditDataFromContract> {
  if (!address || !dataContract) {
    throw Error("Invalid parameter");
  }

  let info = await dataContract.getCreditInfo(address)
  let score = getDisableScore(info.credit);
  let timestamp = Number(formatUnits(info.timestamp, 0))

  let creditData: CreditDataFromContract = {
    creditScore: score,
    timestamp: timestamp
  }
  return creditData;
}

// Get credit scores from data contract (if there is a data contract on the target chain), or call the backend api to get the credit score
// TODO: don't use credaContract
async function getCreditScore(account: string, chainId: number, credaContract: Contract | null, dataContract: Contract | null): Promise<CreditDataFromContract> {
  let creditDataFromContract: CreditDataFromContract = {
    creditScore: 0,
    timestamp: 0
  };
  try {
    if (dataContract) {
      creditDataFromContract = await getCreditDataByContract(account, dataContract);
    }
    else if (chainId === ChainIds.esc) {
      const creditScore = await credaContract.creditScore(account)
      // console.log('credaContract.getCreditInfo:', creditScore)
      creditDataFromContract.creditScore = Number(formatBalance(creditScore.toString(), 2))
    } else {
      // TODO: remove it
      let creditData = await getCreditScoreByApi(account);
      creditDataFromContract.creditScore = creditData.disableScore <= 0 ? calcScore(account) : creditData.disableScore;
    }
  } catch (e) {
    console.log("getCreditScore error:", e)
  }
  return creditDataFromContract;
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
    timestamp: 0,
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

        let creditData = await getCreditScore(account, chainId, CredaContract, DataContract);
        setInfo({
          loading: false,
          score: creditData.creditScore,
          timestamp: creditData.timestamp,
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
export function useContractCreditScore(): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const CredaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi)
  const DataContract = useContract(ContractConfig.DataContract[network]?.address, ContractConfig.DataContract.abi)
  const [info, setInfo] = useState({
    loading: true,
    data: 0,
    timestamp: 0,
  });
  useEffect(() => {
    const getResult = async () => {
      try {
        if (!account || (!CredaContract && !DataContract)) {
          return;
        }
        let creditData = await getCreditScore(account, chainId, CredaContract, DataContract);
        setInfo({
          loading: false,
          data: creditData.creditScore,
          timestamp: creditData.timestamp
        })
      } catch (e) {
        logError("useContractCreditScore", e)
      }
    };
    getResult()
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, CredaContract, DataContract, chainId])
  return info;
}

export type APICreditScoreInfo = {
  loading: boolean;
  data: CreditDataLocal;
}

/**
 * Get Credit Data from backend api
 */
export function useAPICreditScore(): APICreditScoreInfo {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const CredaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi)
  const DataContract = useContract(ContractConfig.DataContract[network]?.address, ContractConfig.DataContract.abi)
  const [info, setInfo] = useState({
    loading: true,
    data: null,
  });
  useEffect(() => {
    const getResult = async () => {
      try {
        if (!account) {
          return;
        }
        let creditInfo = await getCreditScoreByApi(account);
        if (!creditInfo) return;
        setInfo({
          loading: false,
          data: creditInfo,
        })
      } catch (e) {
        logError("useAPICreditScore", e)
      }
    };
    getResult()
    // The score is updated once a day
    // const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    // return () => clearInterval(interval);
  }, [account, CredaContract, DataContract, chainId])
  return info;
}

// TODO: why get score by address? Fake score?
function calcScore(account: string): number {
  const res = Number(account).toFixed(2).slice(2, 4)
  return Number(res) + 150
}

/**
 * Convert the score that get from api or contract into a displayable number
 * @param score
 * @returns
 */
function getDisableScore(score: string): number {
  let paddedHexNumber = ethers.utils.hexZeroPad(score, 32);
  return Number(paddedHexNumber.slice(2, 6)) + Number(paddedHexNumber.slice(6, 10)) + Number(paddedHexNumber.slice(10, 14)) + Number(paddedHexNumber.slice(14, 18))
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

type GetMerkleRootResponse = {
  dateRef: string; //  "20231112",
  root: string; // "0x1c414d99fad7352817933075b7bea8583dec7c5940f1c0c146bbe655dfb92722"
}

export type MerkleRootInfo = {
  root: string;
  timestamp: Moment; // Date (no time value) at which the merkle root was last generated.
}

const merkleRootInfoCache = new PermanentCache<GetMerkleRootResponse, {}>("merkle-root-info", async key => {
  try {
    const url = `${process.env.REACT_APP_ORACLE_API}/contract/getMerkleRoot`;
    let res: AxiosResponse<CreditOracleResponse<GetMerkleRootResponse>> = await axios.get(url);
    return res.data?.data;
  } catch (e) {
    console.warn("getMerkleRoot error:", e);
    return undefined; // not null, to prevent caching
  }
}, 30 * 60); // 30 minutes cache

/**
 * Returns the most recent merkle root (root itself + computation time) information from the API.
 * Note: computation time is approximate and only for display because the API only return the date,
 * not the time.
 */
const getLatestMerkleRootInfo = (): Promise<MerkleRootInfo> => {
  return merkleRootInfoCache.get("info").then(async data => {
    if (!data)
      return null;

    // Score is computed at dateRef's YYYYMMDD's 1am every day. So let's do a bit of gymnastic to convert
    // this value into user's current timezone's date/time
    const chinaOffset = 8; // UTC+8 / china
    // Represent the date  and add the 1 AM time info (china time)
    // NOTE: WE ARE ACTUALLY NOT SO SURE THE SCORE IS COMPUTED AT 1AM CHINA TIMEZONE...
    const timestamp = moment(data.dateRef, 'YYYYMMDD').hours(1).minutes(0).seconds(0);
    timestamp.utcOffset(chinaOffset * 60);

    return {
      root: data.root,
      timestamp
    }
  });
}

export const useAPIMerkleRootInfo = (): MerkleRootInfo => {
  const [info, setInfo] = useState<MerkleRootInfo>(null);

  useEffect(() => {
    getLatestMerkleRootInfo().then(_info => setInfo(_info));
  }, []);

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