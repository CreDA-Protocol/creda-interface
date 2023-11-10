import WalletConnectProvider from "@walletconnect/web3-provider";
import { ChainRPCs, ChainIds } from "./chains/chain-configs";

const walletConnect = {
  rpc: ChainRPCs,
  bridge: "https://walletconnect.elastos.net/v2",

  // Good wallet integrations such as metamask mobile are able to detect if we don't send
  // a chainId manually and automatically return the network selected by users in the wallet.
  // Though, most other wallets such as TokenPocket consider that if no chainId is given by us,
  // they simply return chainId 1 (ethereum mainnet) which is not what we want.
  // Our solution is therefore to force the chainId to HECO for now.
  chainId: ChainIds.arbitrum,
  networkId: ChainIds.arbitrum,
  qrcode: true,
  clientMeta: {
    name: "CREDA.app",
    description: "CREDA - A DeFi app powered by CREDA Team",
    url: "https://creda.app",
    icons: [
      "https://creda.app/favicon.ico"
    ]
  }
}


export const createWalletConnectWeb3Provider = async function () {

  //  Create WalletConnect Provider
  let provider = new WalletConnectProvider(walletConnect);

  return provider;
}
