import { ChainIds, ChainName, logError } from "@common/Common";
import { ChainId } from "@lychees/uniscam-sdk";
import { ProfileProjectsConfig } from "@pages/Profile/configs/projectsConfig";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletAddressContext } from "src/contexts";
import { WalletToken, WalletTokenList } from "src/model/wallet";
import { PermanentCache } from "../caches/permanent-cache";
import { celoFetchTokenBalances } from "../chains/celo.service";
import { elastosESCFetchTokenBalances } from "../chains/elastos-esc.service";
import { Covalent_enableNetwork, covalentFetchTokenBalances } from "../covalent.service";
import { simulatedPortfolioApi_assetsStaking } from "./simulated-portfolio-api";

// TEMP TEST
console.log("Fetching TIN assets (test)");
simulatedPortfolioApi_assetsStaking("0xbA1ddcB94B3F8FE5d1C0b2623cF221e099f485d1", 20).then(stakedAssets => {
  console.log("Staked assets:", stakedAssets);
});

const oneDayInSeconds = (24 * 60 * 60);

export type PortfolioAvailableProject = {
  chainName: string; // ie: "heco". Seems to be the same as "chainType" in other UI parts
  name: string; // ie: "supernova". Seems to be a "project" name
}

/**
 * Details about a single project, for the active wallet (ie: owned assets in that project).
 */
export type PortfolioProjectDetails = {
  name: string; // Project name
  asset: number; // NOT CLEAR: it's an asset balance but what asset?
  icon: string; // project http image
  desc: string; // project description
  farmingValue: number;
}

/**
 * List of projects available on the third party service. These are projects we can get information
 * from for a user wallet later.
 */
export type PortfolioAvailableProjects = {
  [chainName: string]: PortfolioAvailableProject[];
};

/**
 * List of approvals (token spending) given to a wallet.
 * Authorization addresses are the list of apps/wallets that can spend user's tokens.
 */
export type PortfolioApprovals = {
  authorizations: {
    address: string; // authorized token contract address
  }[]
}

export type PortfolioDataset<T> = {
  loading: boolean;
  supported?: boolean; // Whether the feature is supported by the target chain/wallet. For example, project details cannot be returned for all chains.
  data: T;
}

const portfolioProjectsCache = new PermanentCache<string, {}>("portfolio-projects-cache", async (key) => {
  // Miss cache, when the cache cannot deliver the requested data.
  try {
    const originUrl = `https://defi-app.whatscoin.com/dgg/account/defi?lang=cn`;
    let res = await axios.get(originUrl);

    let obj: PortfolioAvailableProjects = {};
    res.data.data.forEach((item: { chainName: string; name: string }, index: number) => {
      if (!obj[item.chainName])
        obj[item.chainName] = [];

      obj[item.chainName].push(item);
    });

    return JSON.stringify(obj);
  } catch (e) {
    logError("useAvailablePortfolioProjects() error:", e)
    return null;
  }
}, oneDayInSeconds);

/**
 * List of Defi projects available at the third party service, from which we can
 * get info from.
 */
export function useAvailablePortfolioProjects(): PortfolioAvailableProjects {
  const [availableProjects, setAvailableProjects] = useState<PortfolioAvailableProjects>(null);

  useEffect(() => {
    portfolioProjectsCache.get("all-projects", null, false).then(allProjectsStr => {
      setAvailableProjects(allProjectsStr ? JSON.parse(allProjectsStr) : null);
    })
  }, []);

  return availableProjects;
}

const allWalletProjectsInitialState: PortfolioDataset<PortfolioProjectDetails[]> = {
  loading: true,
  data: []
}

/**
 * Returns detailed information about all Defi projects a users has assets into,
 * with the balance. projectNames list must among projects returns by useAvailablePortfolioProjects()
 */
export function usePortfolioAllWalletProjects(chainType: string, projectNames: string[]): PortfolioDataset<PortfolioProjectDetails[]> {
  const { account } = useContext(WalletAddressContext);
  const chainRef = useRef(chainType);

  const [walletProjects, setWalletProjects] = useState<PortfolioDataset<PortfolioProjectDetails[]>>(allWalletProjectsInitialState);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!account || !chainType || !projectNames.length)
          return;

        if (chainRef.current !== chainType)
          setWalletProjects(allWalletProjectsInitialState)

        // https://defi-app.whatscoin.com/dgg/account/project/heco/supernova?lang=cn&address=0xd2050719ea37325bdb6c18a85f6c442221811fac
        // https://defi-app.whatscoin.com/dgg/account/project-v2/heco/supernova?lang=en&address=0xd2050719ea37325bdb6c18a85f6c442221811fac
        const getProjectDetails = (projectName: string) => {
          const originUrl = `https://defi-app.whatscoin.com/dgg/account/project-v2/${chainType}/${projectName}?lang=cn&address=${account}`;
          return axios.get(originUrl)
        }

        let allFetch: any = []
        projectNames.forEach(item => {
          // Only keep information about the projects we want to support (configured in projects config)
          if (item in ProfileProjectsConfig)
            allFetch.push(getProjectDetails(item));
        });

        let res: any[] = await axios.all(allFetch);
        let data = res.map(item => item.data.data);

        setWalletProjects({ loading: false, data });
      } catch (e) {
        logError("usePortfolioAllWalletProjects()", e)
      }
    }
    fetchProjects();
  }, [account, chainType, projectNames]);

  return walletProjects;
}

const defiBoxInitialState: PortfolioDataset<WalletTokenList> = {
  loading: true,
  supported: false,
  data: {
    total: 0,
    tokens: [] as WalletToken[]
  }
};

/**
* Gets wallet information from third party api.
* "Information" meaning, a list of tokens and their balance for the given wallet address.
*/
export function usePortfolioWalletTokenList(targetChainId: ChainId): PortfolioDataset<WalletTokenList> {
  const { account } = useContext(WalletAddressContext);
  const chainRef = useRef<ChainId>(targetChainId);
  const [walletTokens, setWalletTokens] = useState<PortfolioDataset<WalletTokenList>>(defiBoxInitialState);

  useEffect(() => {
    const fetchWalletTokens = async () => {
      try {
        if (!account || !targetChainId)
          return;

        // Active chain changed, reset the info
        if (chainRef.current !== targetChainId)
          setWalletTokens(defiBoxInitialState)

        let supportedChain = true;
        let data: WalletTokenList = { total: 0, tokens: [] };

        console.log("usePortfolioWalletTokenList starting fetch for:", account, targetChainId);

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
              supportedChain = false;
            }
            break;
        }

        if (supportedChain) {
          setWalletTokens({
            loading: false,
            supported: supportedChain,
            data: data
          });
        }
      } catch (e) {
        logError("usePortfolioWalletTokenList", e);
        setWalletTokens(defiBoxInitialState);
      }
    }

    fetchWalletTokens();
  }, [account, targetChainId]);

  return walletTokens;
}

const approvalsInitialState: PortfolioDataset<PortfolioApprovals> = {
  loading: true,
  data: {
    authorizations: []
  }
};

/**
 * Gets the list of token spending approvals given by the active wallet, to third party
 * projects/apps.
 */
export function useBoxApproveList(chainType: ChainName): PortfolioDataset<PortfolioApprovals> {
  const { account } = useContext(WalletAddressContext);
  const chainRef = useRef(chainType);
  const [approvals, setApprovals] = useState(approvalsInitialState);

  useEffect(() => {
    const fetchApprovalsInfo = async () => {
      try {
        if (!account || !chainType)
          return;

        if (chainRef.current !== chainType)
          setApprovals(approvalsInitialState)

        const originUrl = `https://defi-app.whatscoin.com/asset/authorized/${chainType}?lang=cn&address=${account}&chain=${chainType.toUpperCase()}`;
        let res = await axios.get(originUrl);

        setApprovals({ loading: false, data: res.data.data });
      } catch (e) {
        logError("useBoxApproveList", e)
        setApprovals(approvalsInitialState)
      }
    }
    fetchApprovalsInfo();
  }, [account, chainType]);

  return approvals;
}

// 获取DeFiBox参与的项目列表
/* export function useBoxProjectList(chainType: string, projectName: string): any {
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
} */
