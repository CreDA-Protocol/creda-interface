import ImageToken from "@assets/tokens/ImageToken";
import { ChainIdList, ChainId } from "./chain.service";

export const ChainIds: ChainIdList = {
  ethereum: 1,
  ropsten: 3,
  esc: 20,
  elatest: 21,
  heco: 128,
  hecotest: 256,
  bsc: 56,
  local: 1337,
  polygon: 137,
  arbitrum: 42161,
  //kovan: 42,
  //rinkeby: 4,
  //goerli: 5,
  celo: 42220,
  celotest: 44787
}

/**
 * Mapping between chain index in the UI vs chain id
 */
export const chainIndexToId: ChainId[] = [
  ChainIds.ethereum, // "Ethereum",
  ChainIds.bsc, // "BSC",
  ChainIds.esc, // "Elastos ESC",
  ChainIds.celo, // "CELO",
  // ChainIds.heco, // "HECO", hide
  ChainIds.arbitrum, // "Arbitrum",
  ChainIds.polygon, // "Polygon",
];

export const chainTitles: { [chainId: ChainId]: string } = {
  [ChainIds.ethereum]: "Ethereum",
  [ChainIds.bsc]: "BSC",
  [ChainIds.esc]: "Elastos ESC",
  [ChainIds.celo]: "CELO",
  [ChainIds.heco]: "HECO",
  [ChainIds.polygon]: "Polygon",
  [ChainIds.arbitrum]: "Arbitrum"
};

export const ChainType: any = {
  Ethereum: "eth",
  HECO: "heco",
  Polygon: "polygon",
  BSC: "bsc",
  CELO: 'celo',
  "Elastos ESC": "esc"
};

/**
 * JSON RPC URL for each supported chain.
 */
export const ChainRPCs: { [chainId: ChainId]: string } = {
  [ChainIds.ethereum]: "https://eth.llamarpc.com",
  [ChainIds.bsc]: "https://bsc-dataseed1.defibit.io",
  [ChainIds.esc]: "https://api.trinity-tech.io/esc",
  [ChainIds.celo]: "https://rpc.ankr.com/celo",
  [ChainIds.polygon]: "https://polygon.llamarpc.com",
  [ChainIds.arbitrum]: "https://arb1.arbitrum.io/rpc",
  // Testnet
  [ChainIds.celotest]: "https://alfajores-forno.celo-testnet.org",
  [ChainIds.elatest]: "https://api-testnet.elastos.io/esc",
};

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
      rpcUrls: [ChainRPCs[ChainIds.ethereum]],
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
      rpcUrls: [ChainRPCs[ChainIds.arbitrum]],
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
      rpcUrls: [ChainRPCs[ChainIds.bsc]],
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
      rpcUrls: [ChainRPCs[ChainIds.celo]],
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
      rpcUrls: [ChainRPCs[ChainIds.esc]],
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
      rpcUrls: [ChainRPCs[ChainIds.celotest]],
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
      rpcUrls: [ChainRPCs[ChainIds.elatest]],
      blockExplorerUrls: ['https://esc-testnet.elastos.io/']
    },
    icon: ImageToken.ELA,
  },
]
