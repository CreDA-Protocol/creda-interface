import { logError } from "@common/Common";
import { ChainId } from "@services/chain.service";
import { useContext, useEffect, useState } from "react";
import { WalletAddressContext } from "src/contexts";
import { PermanentCache } from "../caches/permanent-cache";
import { PortfolioDataset } from "./model/dataset";
import { PortfolioApiApproval, PortfolioApiFarm, PortfolioApiFarmAsset, PortfolioApiWalletToken } from "./model/portfolio-api.dto";
import { PortfolioApprovedToken } from "./model/portfolio-approved-token";
import { PortfolioWalletToken, PortfolioWalletTokenList } from "./model/tokens";

const oneDayInSeconds = (24 * 60 * 60);
const oneHourInSeconds = (60 * 60);

const topStakingProjectsCache = new PermanentCache<string, { chainId: ChainId }>("top-staking-projects", async (key, { chainId }) => {
  try {
    const projects: PortfolioApiFarm[] = await fetch(`${process.env.REACT_APP_PORTFOLIO_API_URL}/assets/topfarms?chainid=${chainId}`).then((response) => response.json());
    if (!projects)
      return undefined;

    return JSON.stringify(projects);
  }
  catch (e) {
    logError("top projects caching fetch", e);
    return undefined;
  }
}, oneHourInSeconds);

/**
 * Returns the list of top defi farming projects on the given chain.
 */
export function useTopStakingProjects(chainId: ChainId) {
  const [projects, setProjects] = useState<PortfolioApiFarm[]>([]);

  //account = "0x0b93af06e1a7b7b5b00f9a229727855d693fb5fe"; // DEBUG - unknown address found on glide, has stake on arbitrum

  useEffect(() => {
    setProjects(null);
    topStakingProjectsCache.get(`${chainId}`, { chainId }).then(_projects => {
      if (_projects)
        setProjects(JSON.parse(_projects));
      else
        setProjects(null);
    });
  }, [chainId]);

  return projects;
}

const stakingInitialState: PortfolioDataset<PortfolioApiFarmAsset[]> = {
  loading: true,
  data: []
}

const portfolioUserStakingCache = new PermanentCache<string, { account: string; chainId: number; farmId: string; }>("portfolio-user-staking-cache", async (key, { account, chainId, farmId }) => {
  // Miss cache, when the cache cannot deliver the requested data.
  try {
    console.log("portfolioUserStakingCache starting fetch for:", account, chainId, farmId);

    const tinStakingData: PortfolioApiFarmAsset = await fetch(`${process.env.REACT_APP_PORTFOLIO_API_URL}/assets/staking?address=${account}&chainid=${chainId}&farmid=${farmId}`).then((response) => response.json());
    console.log("portfolioUserStakingCache AFTER fetch for:", account, chainId, farmId);
    if (tinStakingData) {
      return JSON.stringify(tinStakingData);
    }
    else {
      return null; // null because we got a successfull response but it's empty, meaning no asset on this farm.
    }
  } catch (e) {
    logError("portfolioUserStakingCache error:", e)
    return undefined; // undefined to not cache and retry later (network error, etc)
  }
}, oneDayInSeconds);

/**
 * Returns detailed information about top Defi projects a users has assets into,
 * with the balance.
 */
export function usePortfolioUserStaking(chainId: ChainId): PortfolioDataset<PortfolioApiFarmAsset[]> {
  const topChainProjects = useTopStakingProjects(chainId); // Retrieve top projects first, so we know which ones to check for assets
  let { account } = useContext(WalletAddressContext);

  //account = "0x0b93af06e1a7b7b5b00f9a229727855d693fb5fe"; // DEBUG - unknown address found on glide, has stake on arbitrum

  const [walletProjects, setWalletProjects] = useState<PortfolioDataset<PortfolioApiFarmAsset[]>>(stakingInitialState);

  useEffect(() => {
    const fetchStaking = async () => {
      try {
        setWalletProjects({ loading: true, data: null });

        if (!account || !chainId || !topChainProjects)
          return;

        const stakingDetails: PortfolioApiFarmAsset[] = [];
        let loadedInfo = 0;
        for (const project of topChainProjects) {
          // eslint-disable-next-line no-loop-func
          portfolioUserStakingCache.get(`${account}-${chainId}-${project.shortName}`, { account, chainId, farmId: project.shortName }).then(stakingInfo => {
            loadedInfo++;
            console.log("portfolioUserStakingCache cache get result", account, chainId, project.shortName, loadedInfo, topChainProjects.length, stakingInfo);

            if (stakingInfo) {
              stakingDetails.push(JSON.parse(stakingInfo));
            }

            setWalletProjects({ loading: loadedInfo !== topChainProjects.length, data: [...stakingDetails] });
          });
        }
      } catch (e) {
        logError("usePortfolioUserStaking()", e)
      }
    }
    fetchStaking();

    // IMPORTANT: Do NOT depend on chain id here because we don't want to fetch staking details for a wrong
    // list of top projects (previous chain id). Top projects themselves already depend on chain id so we
    // will get refreshed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, topChainProjects]);

  return walletProjects;
}

const defiBoxInitialState: PortfolioDataset<PortfolioWalletTokenList> = {
  loading: true,
  data: {
    total: 0,
    tokens: [] as PortfolioWalletToken[]
  }
};

const portfolioWalletTokenListCache = new PermanentCache<string, { account: string; targetChainId: ChainId }>("portfolio-wallet-token-list-cache", async (key, { account, targetChainId }) => {
  try {
    let tokenList: PortfolioWalletTokenList = { total: 0, tokens: [] };

    console.log("usePortfolioWalletTokenList starting fetch for:", account, targetChainId);

    const tokens: PortfolioApiWalletToken[] = await fetch(`${process.env.REACT_APP_PORTFOLIO_API_URL}/assets/tokens?address=${account}&chainid=${targetChainId}`).then((response) => response.json());
    if (tokens) {
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
      return undefined; // undefined to not cache, null would be cached
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
    return undefined;
  }
}, oneHourInSeconds);

/**
* Gets wallet information from third party api.
* "Information" meaning, a list of tokens and their balance for the given wallet address.
*
* Data is cached in a permanent disk storage.
*/
export function usePortfolioWalletTokenList(targetChainId: ChainId): PortfolioDataset<PortfolioWalletTokenList> {
  let { account } = useContext(WalletAddressContext);
  const [walletTokens, setWalletTokens] = useState<PortfolioDataset<PortfolioWalletTokenList>>(defiBoxInitialState);

  //account = "0x0b93af06e1a7b7b5b00f9a229727855d693fb5fe"; // DEBUG

  useEffect(() => {
    setWalletTokens(defiBoxInitialState);

    if (!account || !targetChainId)
      return;

    portfolioWalletTokenListCache.get(`${account}-${targetChainId}`, { account, targetChainId }).then(tokenList => {
      if (tokenList) {
        setWalletTokens({ loading: false, data: JSON.parse(tokenList) });
      }
      else {
        setWalletTokens({ loading: false, data: null });
      }
    });
  }, [account, targetChainId]);

  return walletTokens;
}

const approvalsCache = new PermanentCache<string, { account: string; chainId: ChainId }>("portfolio-approvals", async (key, { account, chainId }) => {
  try {
    const approvals: PortfolioApiApproval[] = await fetch(`${process.env.REACT_APP_PORTFOLIO_API_URL}/assets/approvals?address=${account}&chainid=${chainId}`).then((response) => response.json());
    if (!approvals)
      return undefined;

    return JSON.stringify(approvals);
  }
  catch (e) {
    logError("Approvals caching fetch", e);
    return undefined;
  }
}, oneDayInSeconds);

const approvalsInitialState: PortfolioDataset<PortfolioApprovedToken[]> = {
  loading: true,
  data: []
};

/**
 * Gets the list of token spending approvals given by the active wallet, to third party
 * projects/apps.
 */
export function usePortfolioApprovalsList(chainId: ChainId): PortfolioDataset<PortfolioApprovedToken[]> {
  const { account } = useContext(WalletAddressContext);
  const [approvals, setApprovals] = useState(approvalsInitialState);

  useEffect(() => {
    setApprovals({ loading: true, data: [] });

    approvalsCache.get(`${account}-${chainId}`, { account, chainId }).then(async rawApiApprovals => {
      if (rawApiApprovals) {
        const apiApprovals: PortfolioApiApproval[] = JSON.parse(rawApiApprovals);

        let approvedTokens: PortfolioApprovedToken[] = [];
        for (const apiApproval of apiApprovals) {
          const approvedToken = await PortfolioApprovedToken.fromApiApproval(apiApproval, account, chainId);
          if (approvedToken)
            approvedTokens.push(approvedToken);
        }

        setApprovals({ loading: false, data: approvedTokens });
      }
      else
        setApprovals({ loading: false, data: null });
    }).catch(e => {
      logError("usePortfolioApprovalsList", e);
      setApprovals(approvalsInitialState);
    });
  }, [account, chainId]);

  return approvals;
}

/**
 * Delete the current client cache for approvals, for the given account/chain.
 * Use for example after cancelling token spending approval.
 */
export function deletePortfolioApprovalCache(account: string, chainId: ChainId) {
  approvalsCache.delete(`${account}-${chainId}`);
}