import { ChainId, ChainName, logError } from "@common/Common";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { WalletAddressContext } from "src/contexts";
import { PermanentCache } from "../caches/permanent-cache";
import { simulatedPortfolioApi_assets_staking, simulatedPortfolioApi_assets_tokens } from "./simulated-portfolio-api";
import { SummarizedStakedAssets } from "./simulated-portfolio-api/model/tinnetwork/assets";
import { WalletToken } from "./simulated-portfolio-api/model/tinnetwork/tokens.";

const oneDayInSeconds = (24 * 60 * 60);
const oneHoursInSeconds = (60 * 60);

export type PortfolioAvailableProject = {
  chainName: string; // ie: "heco". Seems to be the same as "chainType" in other UI parts
  name: string; // ie: "supernova". Seems to be a "project" name
}

/**
 * Details about a single project, for the active wallet (ie: owned assets in that project).
 */
export type PortfolioProjectDetails = {
  name: string; // Project name
  value: number; // User's balance, total USD value, available and in farming
  farmingValue: number; // User's balance, total USD value, pending only (need to withdraw)
  icon: string; // project http image
  desc: string; // project description
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

export type PortfolioWalletToken = {
  //valueBTC: number;
  value: number; // number of tokens (TBD?)
  icon: string; // token http image
  symbol: string;
  price: number; // USD value of 1 token
  priceChangePercentage24h?: number; // 0-1 percent change of the market price in the last 24h
  amount: number; // USD total balance for the user
}

export type PortfolioWalletTokenList = {
  total: number;
  tokens: PortfolioWalletToken[];
}

export type PortfolioDataset<T> = {
  loading: boolean;
  supported?: boolean; // Whether the feature is supported by the target chain/wallet. For example, project details cannot be returned for all chains.
  data: T;
}

/* const portfolioProjectsCache = new PermanentCache<string, {}>("portfolio-projects-cache", async (key) => {
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
}, oneDayInSeconds); */

/**
 * List of Defi projects available at the third party service, from which we can
 * get info from.
 */
/* export function useAvailablePortfolioProjects(): PortfolioAvailableProjects {
  const [availableProjects, setAvailableProjects] = useState<PortfolioAvailableProjects>(null);

  useEffect(() => {
    portfolioProjectsCache.get("all-projects", null, false).then(allProjectsStr => {
      setAvailableProjects(allProjectsStr ? JSON.parse(allProjectsStr) : null);
    })
  }, []);

  return availableProjects;
} */

const stakingInitialState: PortfolioDataset<PortfolioProjectDetails[]> = {
  loading: true,
  data: []
}

const portfolioUserStakingCache = new PermanentCache<string, { account: string; targetChainId: number }>("portfolio-user-staking-cache", async (key, { account, targetChainId }) => {
  // Miss cache, when the cache cannot deliver the requested data.
  try {
    console.log("usePortfolioWalletTokenList starting fetch for:", account, targetChainId);

    const stakingResponse = await simulatedPortfolioApi_assets_staking(account, targetChainId);
    if (stakingResponse) {
      const tinStakingData: SummarizedStakedAssets[] = JSON.parse(stakingResponse);

      const staking: PortfolioDataset<PortfolioProjectDetails[]> = {
        loading: false,
        data: []
      };

      staking.data = tinStakingData.map(project => ({
        name: project.farmShortName,
        value: project.amountUSD,
        account,
        desc: project.farmName,
        icon: project.farmIconUrl,
        farmingValue: project.pendingAmountUSD
      }));

      return JSON.stringify(staking);
    }
    else {
      return null;
    }
  } catch (e) {
    logError("useAvailablePortfolioProjects() error:", e)
    return null;
  }
}, oneDayInSeconds);

/**
 * Returns detailed information about all Defi projects a users has assets into,
 * with the balance. projectNames list must among projects returns by useAvailablePortfolioProjects()
 */
export function usePortfolioAllWalletProjects(targetChainId: ChainId): PortfolioDataset<PortfolioProjectDetails[]> {
  let { account } = useContext(WalletAddressContext);
  const chainRef = useRef(targetChainId);

  account = "0x0b93af06e1a7b7b5b00f9a229727855d693fb5fe"; // DEBUG

  const [walletProjects, setWalletProjects] = useState<PortfolioDataset<PortfolioProjectDetails[]>>(stakingInitialState);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!account || !targetChainId)
          return;

        if (chainRef.current !== targetChainId)
          setWalletProjects(stakingInitialState);

        portfolioUserStakingCache.get(`${account}-${targetChainId}`, { account, targetChainId }).then(stakingList => {
          if (!stakingList)
            setWalletProjects({ loading: false, data: [] });
          else
            setWalletProjects(JSON.parse(stakingList));
        });
      } catch (e) {
        logError("usePortfolioAllWalletProjects()", e)
      }
    }
    fetchProjects();
  }, [account, targetChainId]);

  return walletProjects;
}

const defiBoxInitialState: PortfolioDataset<PortfolioWalletTokenList> = {
  loading: true,
  supported: false,
  data: {
    total: 0,
    tokens: [] as PortfolioWalletToken[]
  }
};

const portfolioWalletTokenListCache = new PermanentCache<string, { account: string; targetChainId: ChainId }>("portfolio-wallet-token-list-cache", async (key, { account, targetChainId }) => {
  try {
    let tokenList: PortfolioWalletTokenList = { total: 0, tokens: [] };

    console.log("usePortfolioWalletTokenList starting fetch for:", account, targetChainId);

    const tokensResponse = await simulatedPortfolioApi_assets_tokens(account, targetChainId);
    if (tokensResponse) {
      const tokens: WalletToken[] = JSON.parse(tokensResponse);

      const portfolioTokens: PortfolioWalletToken[] = tokens.map(t => ({
        price: t.price,
        value: t.balanceUSD,
        amount: t.balance,
        icon: t.icon,
        symbol: t.symbol,
      }));

      tokenList.tokens = portfolioTokens;
      tokenList.total = portfolioTokens.map(t => t.value).reduce((sum, value) => sum + value, 0);

      return JSON.stringify(tokenList);
    }
    else {
      console.warn(`Failed to retrieve token list for account ${account} chain ${targetChainId}`);
      return null;
    }

    /* switch (targetChainId) {
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
    } */
  } catch (e) {
    logError("usePortfolioWalletTokenList", e);
  }
}, oneHoursInSeconds);

/**
* Gets wallet information from third party api.
* "Information" meaning, a list of tokens and their balance for the given wallet address.
*
* Data is cached in a permanent disk storage.
*/
export function usePortfolioWalletTokenList(targetChainId: ChainId): PortfolioDataset<PortfolioWalletTokenList> {
  let { account } = useContext(WalletAddressContext);
  const chainRef = useRef<ChainId>(targetChainId);
  const [walletTokens, setWalletTokens] = useState<PortfolioDataset<PortfolioWalletTokenList>>(defiBoxInitialState);

  account = "0x0b93af06e1a7b7b5b00f9a229727855d693fb5fe"; // DEBUG

  useEffect(() => {
    if (!account || !targetChainId)
      return;

    // Active chain changed, reset the info
    if (chainRef.current !== targetChainId)
      setWalletTokens(defiBoxInitialState)

    portfolioWalletTokenListCache.get(`${account}-${targetChainId}`, { account, targetChainId }).then(tokenList => {
      if (tokenList) {
        setWalletTokens({
          loading: false,
          supported: true,
          data: JSON.parse(tokenList)
        });
      }
      else {
        setWalletTokens({ loading: false, supported: false, data: null });
      }
    }).catch(e => {
      setWalletTokens(defiBoxInitialState);
    });
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
export function usePortfolioApprovalsList(chainType: ChainName): PortfolioDataset<PortfolioApprovals> {
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
        logError("usePortfolioApprovalsList", e)
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
