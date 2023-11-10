import ImageToken from "@assets/tokens/ImageToken";
import { ethereum } from "@common/Common";
import { ChainId, ChainIds } from "./chain.service";

export type AddEthereumChainParameter = {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export type NetworkConfig = {
  chainParam: AddEthereumChainParameter,
  icon: string,
}

export const mainnetNetworkConfigs: NetworkConfig[] = [
  {
    chainParam: {
      chainId: '0x1',
      chainName: 'Ethereum',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH', // 2-6 characters long
        decimals: 18
      },
      rpcUrls: ['https://mainnet.infura.io/v3/'],
      blockExplorerUrls: ['https://etherscan.io/']
    },
    icon: ImageToken.ETH,
  },
  {
    chainParam: {
      chainId: '0x' + ChainIds.arbitrum.toString(16),
      chainName: 'Arbitrum One Mainnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH', // 2-6 characters long
        decimals: 18
      },
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      blockExplorerUrls: ['https://arbiscan.io/']
    },
    icon: ImageToken.ARB,
  },
  {
    chainParam: {
      chainId: '0x' + ChainIds.bsc.toString(16),
      chainName: 'Binance Smart Chain',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB', // 2-6 characters long
        decimals: 18
      },
      rpcUrls: ['https://bsc-dataseed1.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com/']
    },
    icon: ImageToken.BSC,
  },
  {
    chainParam: {
      chainId: '0x' + ChainIds.celo.toString(16),
      chainName: 'Celo Mainnet',
      nativeCurrency: {
        name: 'CELO',
        symbol: 'CELO', // 2-6 characters long
        decimals: 18
      },
      rpcUrls: ['https://forno.celo.org'],
      blockExplorerUrls: ['https://celoscan.io']
    },
    icon: ImageToken.CELO,
  },
  {
    chainParam: {
      chainId: '0x' + ChainIds.esc.toString(16),
      chainName: 'ELA Smart Chain',
      nativeCurrency: {
        name: 'ELA',
        symbol: 'ELA', // 2-6 characters long
        decimals: 18
      },
      rpcUrls: ['https://api.elastos.io/esc'],
      blockExplorerUrls: ['https://esc.elastos.io']
    },
    icon: ImageToken.ELA,
  },
]

export const testnetNetworkConfigs: NetworkConfig[] = [
  {
    chainParam: {
      chainId: '0x' + ChainIds.celotest.toString(16),
      chainName: 'Celo Alfajores Testnet',
      nativeCurrency: {
        name: 'CELO',
        symbol: 'CELO', // 2-6 characters long
        decimals: 18
      },
      rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
      blockExplorerUrls: ['https://alfajores.celoscan.io']
    },
    icon: ImageToken.CELO,
  },
  {
    chainParam: {
      chainId: '0x' + ChainIds.elatest.toString(16),
      chainName: 'ESC TestNet',
      nativeCurrency: {
        name: 'tELA',
        symbol: 'tELA', // 2-6 characters long
        decimals: 18
      },
      rpcUrls: ['https://api-testnet.elastos.io/esc'],
      blockExplorerUrls: ['https://esc-testnet.elastos.io/']
    },
    icon: ImageToken.ELA,
  },
]


export function switchNetwork(chainId: ChainId) {
  return ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: "0x" + chainId.toString(16),
      }
    ]
  })
}

export function addNetwork(param: AddEthereumChainParameter) {
  // TODO: it will add a new network if call wallet_addEthereumChain for ethereum.
  if (param.chainId === '0x1') {
    return switchNetwork(parseInt(param.chainId));
  }
  return ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [param]
  })
}
