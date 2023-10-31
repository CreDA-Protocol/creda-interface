import { ChainIds, logError, ChainName, chainFromId } from "@common/Common";
import { ChainId } from "@lychees/uniscam-sdk";
import { ProfileProjectsConfig } from "@pages/Profile/configs/projectsConfig";
import axios from "axios";
import { useContext, useRef, useState, useEffect } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import { WalletList, WalletToken } from "src/model/wallet";
import { celoFetchTokenBalances } from "./chains/celo.service";
import { elastosESCFetchTokenBalances } from "./chains/elastos-esc.service";
import { Covalent_enableNetwork, covalentFetchTokenBalances } from "./covalent.service";

type DefiboxState = {
  loading: boolean;
  support: boolean;
  data: WalletList;
}

const defiBoxInitialState: DefiboxState = {
  loading: true,
  support: false,
  data: {
    total: 0,
    tokens: [] as WalletToken[]
  }
};

/**
* Gets wallet information from third party api.
* "Information" meaning, a list of tokens and their balance for the given wallet address.
*/
export function useDefiBoxWalletInfo(targetChainId: ChainId) {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  // const account="0xd2050719ea37325bdb6c18a85f6c442221811fac"
  // const network = chainFromId(chainId);
  const chainRef = useRef<ChainId>(targetChainId);
  const [info, setInfo] = useState<DefiboxState>(defiBoxInitialState);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        if (!account || !targetChainId)
          return;

        // Active chain changed, reset the info
        if (chainRef.current !== targetChainId)
          setInfo(defiBoxInitialState)

        let support = true;
        let data: WalletList = { total: 0, tokens: [] };

        console.log("useDefiBoxWalletInfo starting fetch for:", account, targetChainId);

        switch (targetChainId) {
          case ChainIds.celo:
          case ChainIds.celotest:
            data = await celoFetchTokenBalances(account, targetChainId)
            break;
          case ChainIds.esc:
          case ChainIds.elatest:
            data = await elastosESCFetchTokenBalances(account, targetChainId)
            break;
          default:
            if (Covalent_enableNetwork(targetChainId)) {
              data = await covalentFetchTokenBalances(account, targetChainId)
            } else {
              support = false;
            }
            break;
        }
        if (support)
          setInfo({
            loading: false,
            support: support,
            data: data
          })
      } catch (e) {
        logError("useBoxWalletList", e)
        setInfo(defiBoxInitialState)
      }
    }

    fetchTokenInfo();

    // const interval = setInterval(getResult, config.refreshInterval);
    // return () => clearInterval(interval);
  }, [account, targetChainId]);

  return info;
}

// 获取DeFiBox授权列表
export function useBoxApproveList(chainType: ChainName): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  // const account="0xd2050719ea37325bdb6c18a85f6c442221811fac"
  // const network = chainFromId(chainId);
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
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  // const account = "0xd2050719ea37325bdb6c18a85f6c442221811fac"
  const network = chainFromId(chainId);

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
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  // const account="0xd2050719ea37325bdb6c18a85f6c442221811fac"
  const network = chainFromId(chainId);
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
          if (Object.keys(ProfileProjectsConfig).indexOf(item) >= 0) {
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
  }, [account, chainType, projectNames.join(","), initialState])
  return info;
}
