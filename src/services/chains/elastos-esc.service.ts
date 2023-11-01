import ESC from "@assets/tokens/ELA.png";
import { ChainId, ChainIds, bigNumberToBalance, formatBalance } from "@common/Common";
import { getCoinPrice } from "@services/glidefinance.service";
import { PortfolioWalletTokenList } from "@services/portfolio/portfolio.service";
import axios, { AxiosResponse } from "axios";
import { BigNumber } from "ethers";
import { TokenInfo, TokenType } from "src/model/wallet";

type BalanceData = {
  id: string,
  jsonrpc: string,
  result: string,
}

/**
 * Fetches ELA, ERC20/721/1155 token balances for an EVM (0x) address.
 */
export async function elastosESCFetchTokenBalances(accountAddress: string, chainId: ChainId): Promise<PortfolioWalletTokenList> {
  let allTokenInfos: TokenInfo[] = [];

  let elaToken = await elastosESCFetchELABalances(accountAddress, chainId);
  allTokenInfos.push(elaToken);

  let ercTokens = await elastosESCFetchERC20TokenBalances(accountAddress, chainId);
  allTokenInfos = [...allTokenInfos, ...ercTokens];

  return convertESCResult2WalletList(allTokenInfos);
}

/**
 * Fetches ERC20/721/1155 token balances for an EVM (0x) address and saves tokens to wallet.
 */
export function elastosESCFetchELABalances(address: string, chainId: ChainId): Promise<TokenInfo> {
  return new Promise((resolve, reject) => {
    let rpcUrl = 'https://api.elastos.io/esc';
    if (chainId === 21) {
      rpcUrl = 'https://api-testnet.elastos.io/eth';
    }

    let elaToken = {
      type: TokenType.ELA,
      symbol: "ELA",
      name: "ELA",
      decimals: '18',
      contractAddress: "0x517e9e5d46c1ea8ab6f78677d6114ef47f71f6c4", // lowcase
      balance: '0'
    }

    const param = {
      method: 'eth_getBalance',
      params: [
        address,
        'latest'
      ],
      jsonrpc: "2.0",
      id: '1'
    };
    axios.post(rpcUrl, param).then((res: AxiosResponse<BalanceData>) => {
      elaToken.balance = res.data.result;
      resolve(elaToken)
    }).catch((e: any) => {
      console.log('Esc_fetchELABalances error', e);
      resolve(elaToken)
    })
  })
}

/**
 * Fetches ERC20/721/1155 token balances for an EVM (0x) address and saves tokens to wallet.
 */
export function elastosESCFetchERC20TokenBalances(accountAddress: string, chainId: ChainId): Promise<TokenInfo[]> {
  return new Promise((resolve) => {
    let browserApiUrl = 'https://esc.elastos.io/api';
    if (chainId === 21) {
      browserApiUrl = 'https://esc-testnet.elastos.io/api';
    }
    const ethscgetTokenListUrl = browserApiUrl + '?module=account&action=tokenlist&address=' + accountAddress;

    fetch(ethscgetTokenListUrl)
      .then((response) => response.json())
      .then(async (result) => {
        if (!result || !result.result || result.result.length === 0) {
          resolve([])
        }

        let erc20Ttokens = (result.result as TokenInfo[]).filter(t => t.type === TokenType.ERC_20)
        resolve(erc20Ttokens);
      })
      .catch(err => {
        console.log("Esc_fetchTokenBalances error:", err)
        resolve([])
      })
  })
}

async function convertESCResult2WalletList(tokenInfos: TokenInfo[]) {
  let walletList: PortfolioWalletTokenList = {
    total: 0,
    tokens: []
  };

  let tokenContracts = tokenInfos.map(t => {
    return t.contractAddress;
  }).filter(t => t != null)

  const priceInfo = await getCoinPrice(JSON.stringify(tokenContracts));
  for (let token of tokenInfos) {
    if ((token.type !== TokenType.ERC_20) && (token.type !== TokenType.ELA)) {
      // TODO: how to show nft?
      continue;
    }
    if (token.decimals === '') {
      token.decimals = '0'
    }

    let price = -1;
    const tokenPrice = priceInfo.find(p => p.id === token.contractAddress)
    if (tokenPrice)
      price = Number(formatBalance(tokenPrice.derivedUSD, 4))

    let amount = bigNumberToBalance(BigNumber.from(token.balance), parseInt(token.decimals));
    let value = price !== -1 ? parseFloat((price * parseFloat(amount)).toFixed(2)) : -1;

    let walletToken = {
      symbol: token.symbol,
      value: value,
      icon: ESC,
      price: price,
      priceChangePercentage24h: 0, // TODO
      amount: amount,
      valueBTC: 0,
    }
    if (value > 0) {
      walletList.total += value;
    }
    walletList.tokens.push(walletToken);
  }

  walletList.tokens.sort((a, b) => {
    if (a.value > b.value)
      return -1;
    else if (a.value < b.value)
      return 1;
    else
      return 0;
  });

  return walletList;
}

export function elastosESCEnableNetwork(chainId: number) {
  switch (chainId) {
    case ChainIds.esc:
    case ChainIds.elatest:
      return true;
    default:
      return false;
  }
}