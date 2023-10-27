import CELO from "@assets/tokens/Celo (CELO).png";
import { BigNumber } from "ethers";

import { ChainId, bigNumberToBalance } from "../../common/Common";
import { TokenInfo, TokenType, WalletList } from "../../model/wallet";


/**
 * Fetches Celo, ERC20/721/1155 token balances for an EVM (0x) address.
 */
export async function celoFetchTokenBalances(accountAddress: string, chainId: number): Promise<WalletList> {
  return new Promise((resolve, reject) => {
    let rpcUrl = 'https://explorer.celo.org/mainnet/api/?module=account&action=tokenlist&address=';
    if (chainId === 44787) {
      rpcUrl = 'https://explorer.celo.org/alfajores/api/?module=account&action=tokenlist&address=';
    }

    const walletListEmpty: WalletList = {
      total: 0,
      tokens: []
    }
    let tokenBalancesUrl = rpcUrl + accountAddress;
    fetch(tokenBalancesUrl)
      .then((response) => response.json())
      .then((result) => {
        if (!result || !result.result || result.result.length === 0) {
          console.log('No tokens from covalent')
          resolve(walletListEmpty)
        }

        const walletList = convertResult2WalletList(result.result);
        resolve(walletList);
      })
      .catch(err => {
        console.log("Celo_fetchTokenBalances error:", err)
        resolve(walletListEmpty)
      })
  })
}

async function convertResult2WalletList(tokenInfos: TokenInfo[]) {
  let walletList: WalletList = {
    total: 0,
    tokens: []
  };

  let tokenContracts = tokenInfos.map(t => {
    return t.contractAddress;
  }).filter(t => t != null)

  // TODO: get the token price
  // const priceInfo = [];
  for (let token of tokenInfos) {
    if (token.type !== TokenType.ERC_20) {
      // TODO: how to show nft?
      continue;
    }
    if (token.decimals === '') {
      token.decimals = '0'
    }

    let price = -1;
    // const tokenPrice = priceInfo.find( p => p.id === token.contractAddress)
    // if (tokenPrice)
    //   price = Number( formatBalance(tokenPrice.derivedUSD,4))

    let amount = bigNumberToBalance(BigNumber.from(token.balance), parseInt(token.decimals));
    let value = price !== -1 ? parseFloat((price * parseFloat(amount)).toFixed(2)) : -1;

    let walletToken = {
      symbol: token.symbol,
      value: value,
      icon: CELO,
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

export function celoEnableNetwork(chainId: number) {
  switch (chainId) {
    case ChainId.celo:
    case ChainId.celotest:
      return true;
    default:
      return false;
  }
}