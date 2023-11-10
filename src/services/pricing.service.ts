import { balanceToBigNumber, bigNumberToBalance, enableNetwork, logError } from "@common/Common";
import { GlobalConfiguration } from "@common/config";
import { chainFromId } from "@services/chains/chain.service";
import { useContext, useEffect, useState } from "react";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import { ContractConfig } from "src/contract/ContractConfig";
import { PermanentCache } from "./caches/permanent-cache";
import { useContract } from "./contracts.service";
import { getCoinPrice } from "./glidefinance.service";

// Method able to deliver a price for a given token symbol.
type PricingProvider = (symbol: string) => Promise<number>;

/**
 * Default pricing provider for all tokens that don't specify a custom one.
 */
const defaultPricingProvider: PricingProvider = async (symbol: string): Promise<number> => {
  try {
    const info = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD`).then((response) => response.json());
    if (info?.RAW?.[symbol]) {
      return info.RAW[symbol]['USD'].PRICE;
    } else {
      return null;
    }
  }
  catch (e) {
    return null;
  }
}

const pricingCache = new PermanentCache("token-usd-prices", async (symbol) => {
  // If there is a custom pricing provider defined, use it. Otherwise use the default provider
  if (symbol in customPricings)
    return customPricings[symbol](symbol);
  else
    return defaultPricingProvider(symbol);
}, 10 * 60); // 10 minutes cache

/**
 * Gets a token price in USD from the CryptoCompare API.
 *
 * TODO: cache
 */
export const getUSDTokenPriceBySymbol = (symbol: string): Promise<number> => {
  if (!symbol)
    throw new Error("Token symbol missing for getUSDTokenPriceBySymbol().");

  return pricingCache.get(symbol.toUpperCase()) as Promise<number>;
}

// DEPRECATED - REWORK TO USE getUSDTokenPriceBySymbol()
export function getPriceByApi(symbol: string): Promise<number> {
  return new Promise((resolve, reject) => {
    fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD`)
      .then((response) => response.json())
      .then(res => {
        resolve(res.RAW[symbol]["USD"].PRICE || 0)
      })
      .catch(err => {
        console.log(err)
        resolve(0)
      })
  })
}

const glidePricingProvider: PricingProvider = async (symbol: string): Promise<number> => {
  // Glide API takes token addresses as input. Glide is always on ESC, so we get the contract config for ESC...
  const tokenAddress = ContractConfig[symbol]["esc"]?.address.toLowerCase();
  if (!tokenAddress)
    return null;

  const prices = await getCoinPrice(JSON.stringify([tokenAddress]));
  if (prices?.length > 0) {
    return parseFloat(prices[0].derivedUSD);
  }

  return null;
}

/**
 * List of tokens that require a special way to get fetched, with their custom pricing provider attached.
 */
const customPricings: { [symbol: string]: PricingProvider } = {
  "CREDA": glidePricingProvider,
  "GLIDE": glidePricingProvider,
  "ELK": glidePricingProvider
}

/*

TODO: CREDA PRICE FROM GLIDE

 */

/**
 * Gets the BSC balance in USDT, of the currently active wallet.
 */
/* export function useBscUsdt(): any {
  const contract = useContractWithProvider(ContractConfig.USDT.bsc.address, ERC20_ABI, BSC_PROVIDER)
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const [data, setData] = useState({
    loading: true,
    data: 0,
  });

  useEffect(() => {
    const getResult = async () => {
      if (!contract || !account) {
        return
      }
      try {
        const res: any = await contract.balanceOf(account)
        setData({
          loading: false,
          data: Number(bigNumberToBalance(res)),
        })
      } catch (e) {
        logError("useCNFTInfo", e)
      }
    };
    getResult()
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [contract, account])
  return data;
} */

export function useSushiPrice(amount: number, path: string[]): any {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

  const [info, setInfo] = useState({
    loading: true,
    from: '0',
    to: '0'
  });
  const contract = useContract(ContractConfig.SushiFactory[network]?.address, ContractConfig.SushiFactory.abi)

  useEffect(() => {
    const getResult = async () => {
      try {
        if (!account || !contract || !enableNetwork(chainId)) {
          return;
        }
        const res: any = await contract.getAmountsOut(balanceToBigNumber(amount), path)

        setInfo({
          from: bigNumberToBalance(res[0]),
          to: bigNumberToBalance(res[1], 6),
          loading: false,
        })
      } catch (e) {
        logError("useSushiPrice", e)
      }
    };
    getResult()
    const interval = setInterval(getResult, GlobalConfiguration.refreshInterval);
    return () => clearInterval(interval);
  }, [account, chainId, contract, amount, path])
  return info;
}