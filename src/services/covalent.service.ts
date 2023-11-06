import { ChainId, ChainIds } from "@services/chain.service";
import { BigNumber } from "ethers";
import { bigNumberToBalance } from "../common/Common";
import { PortfolioWalletTokenList, PortfolioWalletToken } from "./portfolio/model/tokens";

const covalentApiUrl = 'https://api.covalenthq.com/v1/';
const API_KEY = 'ckey_4d8058ee307e4d05bd2572d7a2f'; // https://www.covalenthq.com/

export type CovalentTransaction = {
  block_signed_at: string,
  block_height: number,
  tx_hash: string,
  tx_offset: number,
  successful: boolean,
  from_address: string,
  from_address_label: string,
  to_address: string,
  to_address_label: string,
  value: string,
  value_quote: string,
  gas_offered: number,
  gas_spent: number,
  gas_price: number,
  gas_quote: string,
  gas_quote_rate: string,
  log_event?: [],
  transfers?: CovalentTransfer[] // Token Transaction
}

export type CovalentTokenBalanceNFTItem = {
  token_id: string;
  token_balance: string;
  token_url: string;
  supports_erc?: string[]; // eg: ["erc20"]
  token_price_wei: string; // eg: null
  token_quote_rate_eth: string; // eg: null
  original_owner: string;
  external_data: string; // eg: null
  owner: string;
  owner_address: string; // eg: null
  burned: string; // eg: null
}

export type CovalentTokenBalanceItem = {
  balance: string; // eg: "0"
  balance_24h: string; // eg: "0"
  contract_address: string; // eg: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  contract_decimals: number; // eg: 18
  contract_name: string; // eg: "IoTeX"
  contract_ticker_symbol: string; // eg: "IOTX"
  last_transferred_at: string; // eg: null
  logo_url: string; // eg: "https://www.covalenthq.com/static/images/icons/display-icons/iotex-logo.svg"
  nft_data: CovalentTokenBalanceNFTItem[]; // eg: null
  quote: number; // eg: 0
  quote_24h: number; // eg: 0
  quote_rate: number; // eg: 0.0729151
  quote_rate_24h: number; // eg: 0.07290881
  supports_erc?: string[]; // eg: ["erc20"]
  type: "cryptocurrency" | "stablecoin" | "nft" | "dust";
}

export type Pagination = {
  has_more: boolean,
  page_number: number,
  page_size: number,
  total_count: number,
}

export type CovalentData<T> = {
  address: string,
  updated_at: string, //"2021-10-12T06:20:54.298104895Z"
  next_update_at: string,
  quote_currency: string, //"USD"
  chain_id: number,
  items: T[],
  pagination: Pagination
}

export type CovalentResult<T> = {
  data: CovalentData<T>,
  error: string,
  error_message: string,
  error_code: string
}

export type CovalentTransfer = {
  block_signed_at: string; // The signed time of the block.
  tx_hash: string; // The transaction hash.
  from_address: string; // The address where the transfer is from.
  from_address_label: string; // The label of from address.
  to_address: string; // The address where the transfer is to.
  to_address_label: string; // The label of to address.
  contract_decimals: number; // Smart contract decimals.
  contract_name: string; // Smart contract name.
  contract_ticker_symbol: string; // Smart contract ticker symbol.
  contract_address: string; //Smart contract address.
  logo_url: string; // Smart contract URL.
  transfer_type: string; // IN/OUT.
  delta: string; // The delta attached to this transfer.
  balance: number; // The transfer balance. Use contract_decimals to scale this balance for display purposes.
  quote_rate: number; // The current spot exchange rate in quote-currency.
  delta_quote: number; // The current delta converted to fiat in quote-currency.
  balance_quote: number; // The current balance converted to fiat in quote-currency.
  method_calls: any[]; // Additional details on which transfer events were invoked. Defaults to true.
};

export type BlockTransactionWithContractTransfers = {
  block_signed_at: string; // The signed time of the block.
  block_height: number; // The height of the block.
  tx_hash: string; // The transaction hash.
  tx_offset: number; // The transaction offset.
  successful: boolean; // The transaction status.
  from_address: string; // The address where the transaction is from.
  from_address_label: string; // The label of from address.
  to_address: string; // The address where the transaction is to.
  to_address_label: string; // The label of to address.
  value: number; // The value attached to this tx.
  value_quote: number; // The value attached in quote-currency to this tx.
  gas_offered: number; // The gas offered for this tx.
  gas_spent: number; // The gas spent for this tx.
  gas_price: number; // The gas price at the time of this tx.
  fees_paid: number; // The total transaction fees paid for this tx.
  gas_quote: number; // The gas spent in quote-currency denomination.
  gas_quote_rate: number; // The gas exchange rate at the time of Tx in quote_currency.
  transfers: CovalentTransfer[]; // Transfer items.
}

/**
 * Fetches ERC20/721/1155 token balances for an EVM (0x) address and saves tokens to wallet.
 */
export function covalentFetchTokenBalances(accountAddress: string, chainId: ChainId): Promise<PortfolioWalletTokenList> {
  console.log('Covalent_fetchTokenBalances chainId:', chainId, ' accountAddress:', accountAddress)
  return new Promise((resolve, reject) => {
    let tokenBalancesUrl = covalentApiUrl;
    tokenBalancesUrl += chainId;
    tokenBalancesUrl += '/address/' + accountAddress;
    tokenBalancesUrl += '/balances_v2/';
    tokenBalancesUrl += '?key=' + API_KEY;
    tokenBalancesUrl += '&format=JSON&nft=true&no-nft-fetch=false';

    const walletListEmpty: PortfolioWalletTokenList = {
      total: 0,
      tokens: []
    }
    fetch(tokenBalancesUrl)
      .then((response) => response.json())
      .then((result) => {
        if (!result || !result.data || !result.data.items || result.data.items.length === 0) {
          console.log('No tokens from covalent')
          resolve(walletListEmpty)
        }

        const walletList = convertCovalentResult2WalletList(result.data.items);
        resolve(walletList);
      })
      .catch(err => {
        console.log("Covalent_fetchTokenBalances error:", err)
        resolve(walletListEmpty)
      })
  })
}

function convertCovalentResult2WalletList(balanceItems: CovalentTokenBalanceItem[]) {
  let walletList: PortfolioWalletTokenList = {
    total: 0,
    tokens: []
  };

  for (let item of balanceItems) {
    let walletToken: PortfolioWalletToken = {
      symbol: item.contract_ticker_symbol,
      value: item.quote,
      icon: item.logo_url,
      price: item.quote_rate,
      priceChangePercentage24h: 0, // TODO
      amount: parseFloat(bigNumberToBalance(BigNumber.from(item.balance), item.contract_decimals)),
      //valueBTC: 0,
    }
    walletList.total += item.quote;
    walletList.tokens.push(walletToken);
  }
  return walletList;
}

export function Covalent_enableNetwork(chainId: number) {
  switch (chainId) {
    case ChainIds.ethereum:
    case ChainIds.bsc:
    case ChainIds.arbitrum:
    case ChainIds.polygon:
      //case ChainId.goerli:
      return true;
    default:
      return false;
  }
}