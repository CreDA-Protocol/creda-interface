// Token logos

// Generic token contracts
import ERC20_ABI from "@abi/generic/ERC20.json";
import qERC20_ABI from '@abi/generic/qERC20.json';

// Creda core contracts
import APIConsumer_ABI from '@abi/creda/APIConsumer.json'; // Seems to be doing creda/credit/did things...
import CredaCore_ABI from '@abi/creda/CredaCore.json';
import Creda_ABI from '@abi/creda/CredaTest.json';
import CredaTestPlus_ABI from '@abi/creda/CredaTestPlus.json';
import CreditNFT_ABI from '@abi/creda/CreditNFT.json';
import CreditNFTV2_ABI from "@abi/creda/CreditNFTV2.json";
import CreditNFTV3_ABI from "@abi/creda/CreditNFTV3.json";
import DataContract_ABI from "@abi/creda/DataContract.json";
import CNETWORK_ABI from '@abi/creda/cNETWORK.json';

// Swapping
import IUniswapV2Pair_ABI from "@abi/swap/IUniswapV2Pair.json";
import IWMasterChef_ABI from "@abi/swap/IWMasterChef.json";
import MdexFactory_ABI from '@abi/swap/MdexFactory.json';
import MdexRouter_ABI from '@abi/swap/MdexRouter.json';
import PancakeFactory_ABI from "@abi/swap/PancakeFactory.json";
import PancakeRouter_ABI from "@abi/swap/PancakeRouter.json";
import QuickSwapFactory_ABI from '@abi/swap/QuickSwapFactory.json';
import QuickSwapRouter_ABI from '@abi/swap/QuickSwapRouter.json';
import Router_ABI from "@abi/swap/Router.json";
import SushiFactory_ABI from "@abi/swap/SushiFactory.json";

// CREDA locked/unlocked tokens management in various chains
import InitialMint_ABI from '@abi/InitialMint.json';
import PersonalDataMinePoolFix_ABI from '@abi/PersonalDataMinePoolFix.json';
import PersonalDataMinePoolPlus_ABI from '@abi/PersonalDataMinePoolPlus.json';
import PersonalDataMinePoolV2_ABI from '@abi/PersonalDataMinePoolV2.json';
import PersonalDataMinePoolV2ESC_ABI from '@abi/PersonalDataMinePoolV2ESC.json';

// Unclear usage contracts
import IFNT_ABI from '@abi/IFNT.json';
import IFNTunlock_ABI from '@abi/IFNTunlock.json';
import HomoraBank_ABI from "@abi/banking/HomoraBank.json";
import NFTStore_ABI from '@abi/banking/NFTStore.json';
import Vault_ABI from '@abi/banking/Vault.json';
import cPiggyVault_ABI from '@abi/banking/cPiggyVault.json';
import cVault_ABI from '@abi/banking/cVault.json';
import SushiswapSpellV1_ABI from "@abi/swap/SushiswapSpellV1.json";

// Deprecated gaming contracts
import BuildDataBase_ABI from '@abi/gaming/BuildDataBase.json';
import BuildOpreta_ABI from '@abi/gaming/BuildOpreta.json';
import BuildReward_ABI from '@abi/gaming/BuildReward.json';
import Collection_ABI from '@abi/gaming/Collection.json';
import CreateWarship_ABI from '@abi/gaming/CreateWarship.json';
import GameBuild_ABI from '@abi/gaming/GameBuild.json';
import InitializeAddress_ABI from '@abi/gaming/InitializeAddress.json';
import Items_ABI from '@abi/gaming/Items.json';
import Production_ABI from '@abi/gaming/Production.json'; // Also seems related to gaming
import WarshipExplore_ABI from '@abi/gaming/WarshipExplore.json';
import WarshipNFT_ABI from '@abi/gaming/WarshipNFT.json';
import { ImageToken } from "@assets/tokens/ImageToken";
import { ChainName } from '@services/chains/chain.service';

type ChainContractConfig = {
  address: string;
  abi?: any;
}

type ContractItemConfigBase = {
  symbol: string;
  abi?: any;
  address?: string; // Default contract address, if no specific address given in chain configs
  icon?: string;
}

type ContractItemConfig = ContractItemConfigBase & {
  [chain in ChainName]?: ChainContractConfig;
}

type ContractsConfig = {
  [contractName: string]: ContractItemConfig;
}

export const ContractConfig: ContractsConfig = {
  WCREDA: {
    symbol: "WCREDA",
    abi: ERC20_ABI,
    arbitrum: {
      address: "0x7a6b1B6798fd501224eBC20398928f3359e8403F",
    },
    esc: {
      address: "0x0bF8f955e15f2eDd754f5591CBc201F560204A09",
    },
  },
  Router: {
    symbol: "Router",
    abi: Router_ABI,
    arbitrum: {
      address: "0x20785875b158EA838a4F24Dff68F50B56a14afc6",
    },
    esc: {
      address: "0xD3f0c10Aac71994CCEE2bEaf347a41FAA0fDCB82",
    },
  },
  IUniswapV2Pair: {
    symbol: "IUniswapV2Pair",
    abi: IUniswapV2Pair_ABI,
  },
  IWMasterChef: {
    symbol: "IWMasterChef",
    abi: IWMasterChef_ABI,
  },
  SushiswapSpellV1: {
    symbol: "SushiswapSpellV1",
    abi: SushiswapSpellV1_ABI,
    arbitrum: {
      address: "0x3745A5A808734D9bC2b2c8dF0f72910BF7F50b25",
    },
  },
  CNETWORK: {
    symbol: "CNETWORK",
    abi: CNETWORK_ABI,
    heco: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB"
    },
    esc: {
      address: "0xaa5ef6891401cAfb72ad349F29f0bBeA58c50797",
    },
    arbitrum: {
      address: "0x7507ca5E03cfB7ABC122aaC6aDb22A7fDD355e54",
    },
    bsc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f"
    },
    local: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    ropsten: {
      address: "0xd4a7Ce1615F7Dc8cb619be89E8455a9b8Da933A2"
    }
  },
  PersonalDataMinePoolPlus: {
    symbol: "PersonalDataMinePoolPlus",
    address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    icon: ImageToken.bCASH,
    abi: PersonalDataMinePoolPlus_ABI,
    heco: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB"
    },
    esc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    },
    arbitrum: {
      address: "0x24EbF501b80c21d64Ab80d15E74c61D20f6817EC",
    },
    bsc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f"
    },
    local: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    ropsten: {
      address: "0x5Eea1b2D06970135B16FE27cA113A40aDB9D29A8"
    }
  },
  PersonalDataMinePoolFix: {
    symbol: "PersonalDataMinePoolFix",
    address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    icon: ImageToken.bCASH,
    abi: PersonalDataMinePoolFix_ABI,
    heco: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB"
    },
    esc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    },
    arbitrum: {
      address: "0x74D4bA5971d9d631159cfA0A3df8bd2D2EC3206A",
    },
    bsc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f"
    },
    local: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    ropsten: {
      address: "0x5Eea1b2D06970135B16FE27cA113A40aDB9D29A8"
    }
  },
  PersonalDataMinePoolV2: {
    symbol: "PersonalDataMinePoolV2",
    address: "0x4D071352a133Eb830Ae02acEBbA162dca39C2FB5",
    abi: PersonalDataMinePoolV2_ABI,
    heco: {
      address: "0x4D071352a133Eb830Ae02acEBbA162dca39C2FB5",
      abi: PersonalDataMinePoolV2_ABI,
    },
    esc: {
      address: "0x9979B5a517cB99FD3f3b9F30c552F994eB214685",
      abi: PersonalDataMinePoolV2ESC_ABI,
    },
    arbitrum: {
      address: "0x4D071352a133Eb830Ae02acEBbA162dca39C2FB5",
      abi: PersonalDataMinePoolV2_ABI,
    },
    bsc: {
      address: "0x4D071352a133Eb830Ae02acEBbA162dca39C2FB5",
      abi: PersonalDataMinePoolV2_ABI,
    },
    local: {
      address: "0x4D071352a133Eb830Ae02acEBbA162dca39C2FB5",
      abi: PersonalDataMinePoolV2_ABI,
    },
    polygon: {
      address: "0x4D071352a133Eb830Ae02acEBbA162dca39C2FB5",
      abi: PersonalDataMinePoolV2_ABI,
    },
    ropsten: {
      address: "0x4D071352a133Eb830Ae02acEBbA162dca39C2FB5",
      abi: PersonalDataMinePoolV2_ABI,
    }
  },
  APIConsumer: {
    symbol: "APIConsumer",
    address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    icon: ImageToken.bCASH,
    abi: APIConsumer_ABI,
    heco: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB"
    },
    esc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    },
    arbitrum: {
      address: "0xF8389a26E7ec713D15E7Fe9376B06CB63dE27624",
    },
    bsc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f"
    },
    local: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    ropsten: {
      address: "0xF07373be9D1CB3E37e33109847DD595f987926B7"
    }
  },
  CPUSDC: {
    symbol: "CPUSDC",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.CPUSDC,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0x1beF044377C4cF5c5384914af21869Fde99F6Fae",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  CPUSDT: {
    symbol: "CPUSDT",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.CPUSDT,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0xA8B721F2799744c349Bf0C89b357Fd0a55317d78",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  CPWBTC: {
    symbol: "CPWBTC",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.CPWBTC,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0x8370E666544C020d49458e373245b43222c878B1",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  CPDAI: {
    symbol: "CPDAI",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.CPDAI,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0xAC011fcB9eb7F714bF443cb33033439bC433a781",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  DAI: {
    symbol: "DAI",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.DAI,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  WBTC: {
    symbol: "WBTC",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.WBTC,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  USDT: {
    symbol: "USDT",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.USDT,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  HUSD: {
    symbol: "HUSD",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.HUSD,
    heco: {
      address: "0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0xb3C40dF271CE4b5B636e1D24e5B2AF5C9873975C",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  USDC: {
    symbol: "USDC",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.USDC,
    heco: {
      address: "0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047"
    },
    esc: {
      address: "0xa06be0f5950781ce28d965e5efc6996e88a8c141",
    },
    arbitrum: {
      address: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  sCASH: {
    symbol: "sCASH",
    address: "0xb6ccFA7Ef3a295932536E0988CffD85228cB177c",
    icon: ImageToken.sCASH,
    heco: {
      address: "0xb6ccFA7Ef3a295932536E0988CffD85228cB177c"
    },
    esc: {
      address: "0xb6ccFA7Ef3a295932536E0988CffD85228cB177c",
    },
    arbitrum: {
      address: "0xb6ccFA7Ef3a295932536E0988CffD85228cB177c",
    },
    bsc: {
      address: "0xb6ccFA7Ef3a295932536E0988CffD85228cB177c",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  IFNT: {
    symbol: "IFNT",
    address: "0x246ccCb62DBCB08b4aBD33790e61068C3f507940",
    icon: ImageToken.IFNT,
    abi: IFNT_ABI,
    heco: {
      address: "0x7d4c107ec8fd251fd39c32199c70b76eae4e67c1"
    },
    esc: {
      address: "0x246ccCb62DBCB08b4aBD33790e61068C3f507940",
    },
    arbitrum: {
      address: "0x246ccCb62DBCB08b4aBD33790e61068C3f507940",
    },
    bsc: {
      address: "0x246ccCb62DBCB08b4aBD33790e61068C3f507940",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0x198380a405036307cf3eca2a6350560d0a14bc6a",
    }
  },
  MAN: {
    symbol: "MAN",
    address: "0x7a45d615f26da940ffff43eca1274d8ea116ce0c",
    icon: ImageToken.MAN,
  },
  FILDA: {
    symbol: "FILDA",
    address: "0xb9ae03e3320235d3a8ae537f87ff8529b445b590",
    icon: ImageToken.FILDA,
    esc: {
      address: "0x00e71352c91ff5b820ab4df08bb47653db4e32c0",
    },
    arbitrum: {
      address: "0x43A7d5573d0C3D0Fac233c0cd1C9a73C8ce9fF72",
    }
  },
  GLIDE: {
    symbol: "GLIDE",
    address: "0xb9ae03e3320235d3a8ae537f87ff8529b445b590",
    icon: ImageToken.GLIDE,
    esc: {
      address: "0xd39ec832ff1caafab2729c76ddeac967abca8f27",
    },
    arbitrum: {
      address: "0x43A7d5573d0C3D0Fac233c0cd1C9a73C8ce9fF72",
    }
  },
  ELK: {
    symbol: "ELK",
    address: "0xeeeeeb57642040be42185f49c52f7e9b38f8eeee",
    icon: ImageToken.ELK,
    esc: {
      address: "0xeeeeeb57642040be42185f49c52f7e9b38f8eeee",
    },
    arbitrum: {
      address: "0x43A7d5573d0C3D0Fac233c0cd1C9a73C8ce9fF72",
    }
  },
  ELA: {
    symbol: "ELA",
    address: "0xb9ae03e3320235d3a8ae537f87ff8529b445b590",
    icon: ImageToken.ELA,
    esc: {
      address: "0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4",
    },
    arbitrum: {
      address: "0xc0dB6d86C391dA044fc30835954E8158C45B7dF3",
    }
  },
  wELA: {
    symbol: "wELA",
    address: "0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4",
    icon: ImageToken.ELA,
    esc: {
      address: "0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4",
    },
    arbitrum: {
      address: "0xc0dB6d86C391dA044fc30835954E8158C45B7dF3",
    }
  },
  HT: {
    symbol: "HT",
    address: "0xeceefC50f9aAcF0795586Ed90a8b9E24f55Ce3F3",
    icon: ImageToken.ELA,
  },
  CREDA: {
    symbol: "CREDA",
    address: "0x71E1EF01428138e516a70bA227659936B40f0138",
    icon: ImageToken.CREDA,
    abi: CredaCore_ABI,
    esc: {
      address: "0xc136E6B376a9946B156db1ED3A34b08AFdAeD76d",
    },
    ropsten: {
      address: "0x6812891dD6Ab4e2ebDde659a57EB8dA5F25B0Dd3"
    },
    arbitrum: {
      address: "0xc136E6B376a9946B156db1ED3A34b08AFdAeD76d"
    }
  },
  InitialMint: {
    symbol: "InitialMint",
    address: "0x71E1EF01428138e516a70bA227659936B40f0138",
    icon: ImageToken.FILDA,
    abi: InitialMint_ABI,
    esc: {
      address: "0x9979B5a517cB99FD3f3b9F30c552F994eB214685",
      abi: PersonalDataMinePoolV2ESC_ABI,
    },
    ropsten: {
      address: "0xD1d43e3747380cE6C78B96F1c73de6f48951F5E3"
    },
    arbitrum: {
      address: "0x4D071352a133Eb830Ae02acEBbA162dca39C2FB5",
      abi: InitialMint_ABI,
    }
  },
  CredaPool: {
    symbol: "CredaPool",
    address: "0xcD798F3C4CD9d228334E9EC470ddFB65c65fB9a6",
    icon: ImageToken.MAN,
    abi: Creda_ABI,
    esc: {
      address: "0x6e548f0980E6b3B7292dC782Bd8Eafb6fbE29a95",
    },
    arbitrum: {
      address: "0x6e548f0980E6b3B7292dC782Bd8Eafb6fbE29a95",
    }
  },
  CredaTestPlus: {
    symbol: "CredaTestPlus",
    address: "0x4424068eaFc8aE5f2d59e08073D0b79783C3dC69",
    icon: ImageToken.MAN,
    abi: CredaTestPlus_ABI,
    esc: {
      address: "0x169C567505ed15308089A7147D98c376D6695082",
    },
    arbitrum: {
      address: "0x169C567505ed15308089A7147D98c376D6695082",
    }
  },
  NFTStore: {
    symbol: "NFTStore",
    address: "0x8373dD0dADC1e73BAd7F9cC9145f50cd4097fBe9",
    icon: ImageToken.MAN,
    abi: NFTStore_ABI,
    esc: {
      address: "0x8373dD0dADC1e73BAd7F9cC9145f50cd4097fBe9",
    },
    arbitrum: {
      address: "0x221049E27a4F3a8E79ca17B87639E4879a8B94C5",
    }
  },
  CreditNFT: {
    symbol: "CreditNFT",
    address: "0x2784D32751419630972E161939a89e9e63419659",
    icon: ImageToken.MAN,
    abi: CreditNFT_ABI,
    esc: {
      address: "0x0E0e0fCb700c3CfEe1AeEa5c1d7A21dd90d1ce7E",
      abi: CreditNFTV2_ABI
    },
    elatest: {
      address: "0xd4563C741DE9C13F1Fdc31467AC6eAc451e10f57",
      abi: CreditNFTV3_ABI
    },
    celo: {
      address: "0xDe19103a6Ef95312FF1bA093a9c78904D947A419",
      abi: CreditNFTV3_ABI
    },
    ropsten: {
      address: "0x67EBeB38Ce79E0A3B723bA42393910504db28758"
    },
    arbitrum: {
      address: "0x7308a054F7ADb93C286529aDc954976377eB0cF0",
    }
  },
  DataContract: {
    symbol: "DataContract",
    address: "0x878063db2d3d54e4F18e7bC448FA56A0e111C054",
    icon: ImageToken.MAN,
    abi: DataContract_ABI,
    elatest: {
      address: "0x36aFfC79ABBd2F8Aaf32800A1333c524aF3bCE79",
    },
    celo: {
      address: "0xBc736a54dD3FE55db6C752c5F495A331f2855377",
    }
  },
  // 游戏
  InitializeAddress: {
    symbol: "InitializeAddress",
    address: "0x0D11db38B0E352B21192364822BdF375CcF03d69",
    icon: ImageToken.MAN,
    abi: InitializeAddress_ABI,
    heco: {
      address: "0x0D11db38B0E352B21192364822BdF375CcF03d69"
    },
    esc: {
      address: "0x0D11db38B0E352B21192364822BdF375CcF03d69",
    },
    arbitrum: {
      address: "0x0D11db38B0E352B21192364822BdF375CcF03d69",
    },
    bsc: {
      address: "0xdC2e8de61dF6945635Bf7e8da369fc859919Be60"
    },
    local: {
      address: "0xF892b0458246cB338820Aba210626a5002a8324B"
    },
    polygon: {
      address: "0x61C0F7C1a87d36f43C8EeAB2ffbC4deD6aaB4528",
    }
  },
  Items: {
    symbol: "Items",
    address: "0xC855f9ffd49062eE100d13B709d88783ae6f8f5F",
    icon: ImageToken.MAN,
    abi: Items_ABI,
    heco: {
      address: "0xC855f9ffd49062eE100d13B709d88783ae6f8f5F"
    },
    esc: {
      address: "0xC855f9ffd49062eE100d13B709d88783ae6f8f5F",
    },
    arbitrum: {
      address: "0xC855f9ffd49062eE100d13B709d88783ae6f8f5F",
    },
    bsc: {
      address: "0x1E8850cED468D35e527eE9352d0504798AFe1e35",
    },
    local: {
      address: "0xa243a51aacf3af926d5df9d4C2D305E55BcA2341"
    },
    polygon: {
      address: "0xED097d8c76B5d63E26cfA8dE417c05563f27519c",
    }
  },
  GameBuild: {
    symbol: "GameBuild",
    address: "0xdD46E97B595c30C08c8958e30B3A3A489424f37C",
    icon: ImageToken.MAN,
    abi: GameBuild_ABI,
    heco: {
      address: "0xdD46E97B595c30C08c8958e30B3A3A489424f37C"
    },
    esc: {
      address: "0xdD46E97B595c30C08c8958e30B3A3A489424f37C",
    },
    arbitrum: {
      address: "0xdD46E97B595c30C08c8958e30B3A3A489424f37C",
    },
    bsc: {
      address: "0xdD46E97B595c30C08c8958e30B3A3A489424f37C",
    },
    local: {
      address: "0x4a31997F16c8515E90196Ed99906Fb0faBf83A7B",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  Vault: {
    symbol: "Vault",
    address: "0xFF22b592542fa60045a453E092afda3013ab271b",
    icon: ImageToken.MAN,
    abi: Vault_ABI,
    heco: {
      address: "0xFF22b592542fa60045a453E092afda3013ab271b"
    },
    esc: {
      address: "0xFF22b592542fa60045a453E092afda3013ab271b",
    },
    arbitrum: {
      address: "0xFF22b592542fa60045a453E092afda3013ab271b",
    },
    bsc: {
      address: "0xFF22b592542fa60045a453E092afda3013ab271b",
    },
    local: {
      address: "0xFF22b592542fa60045a453E092afda3013ab271b",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  Collections: {
    symbol: "Collections",
    address: "0x3846F47042f5681e0E2ffF4b37D3CcA970d801BE",
    icon: ImageToken.MAN,
    abi: Collection_ABI,
    heco: {
      address: "0x3846F47042f5681e0E2ffF4b37D3CcA970d801BE"
    },
    esc: {
      address: "0x3846F47042f5681e0E2ffF4b37D3CcA970d801BE",
    },
    arbitrum: {
      address: "0x3846F47042f5681e0E2ffF4b37D3CcA970d801BE",
    },
    bsc: {
      address: "0x3846F47042f5681e0E2ffF4b37D3CcA970d801BE",
    },
    local: {
      address: "0x3846F47042f5681e0E2ffF4b37D3CcA970d801BE",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  IFNT_USDT_LP: {
    symbol: "IFNT_USDT_LP",
    address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    icon: ImageToken.bCASH,
    heco: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB"
    },
    esc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    },
    arbitrum: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    },
    bsc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f"
    },
    local: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  ETH_CREDA_LP: {
    symbol: "ETH_CREDA_LP",
    address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f",
    icon: ImageToken.bCASH,
    heco: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB"
    },
    esc: {
      address: "0x922BfF1d745e88DEDEe5f38776cFe343bd843A7c",
    },
    arbitrum: {
      address: "0x2F73FB16933585Ba089100C05561D58FD342bDf5",
    },
    bsc: {
      address: "0x8F4f826C28bC6588c44aAd45c467f8123079507f"
    },
    local: {
      address: "0x9dBEa32d045535b9b6061BAC1CAB764178C61fcB",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    ropsten: {
      address: "0xB6DAcc639c4C8fd3e46B96221D71f3B7EBdF5cDB"
    }
  },
  IFNTUnlock: {
    symbol: "IFNTUnlock",
    address: "0x4C09075bb1e21c3936604295013D5414ae7C9ED6",
    abi: IFNTunlock_ABI,
    heco: {
      address: "0x7E12760F93dB148a75C8D76dbb777050e5038fCa"
    },
    esc: {
      address: "0x4C09075bb1e21c3936604295013D5414ae7C9ED6",
    },
    arbitrum: {
      address: "0x4C09075bb1e21c3936604295013D5414ae7C9ED6",
    },
    bsc: {
      address: "0x4C09075bb1e21c3936604295013D5414ae7C9ED6"
    },
    local: {
      address: "0x7E12760F93dB148a75C8D76dbb777050e5038fCa",
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  MdexRouter: {
    symbol: "MdexRouter",
    address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300",
    abi: MdexRouter_ABI,
    heco: {
      address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300"
    },
    esc: {
      address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300",
    },
    arbitrum: {
      address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300",
    },
    bsc: {
      address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300"
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  MdexFactory: {
    symbol: "MdexFactory",
    address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941",
    abi: MdexFactory_ABI,
    heco: {
      address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941"
    },
    esc: {
      address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941",
    },
    arbitrum: {
      address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941",
    },
    bsc: {
      address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941"
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  QuickRouter: {
    symbol: "QuickRouter",
    address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300",
    abi: QuickSwapRouter_ABI,
    heco: {
      address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300"
    },
    esc: {
      address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300",
    },
    arbitrum: {
      address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300",
    },
    bsc: {
      address: "0xED7d5F38C79115ca12fe6C0041abb22F0A06C300"
    },
    polygon: {
      address: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    }
  },
  QuickFactory: {
    symbol: "QuickFactory",
    address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941",
    abi: QuickSwapFactory_ABI,
    heco: {
      address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941"
    },
    esc: {
      address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941",
    },
    arbitrum: {
      address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941",
    },
    bsc: {
      address: "0xb0b670fc1F7724119963018DB0BfA86aDb22d941"
    },
    polygon: {
      address: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
    }
  },
  PancakeRouter: {
    symbol: "PancakeRouter",
    address: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    abi: PancakeRouter_ABI,
    heco: {
      address: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    },
    esc: {
      address: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    },
    arbitrum: {
      address: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    },
    bsc: {
      address: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    }
  },
  PancakeFactory: {
    symbol: "PancakeFactory",
    address: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    abi: PancakeFactory_ABI,
    heco: {
      address: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
    },
    esc: {
      address: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    },
    arbitrum: {
      address: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    },
    bsc: {
      address: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
    }
  },
  // bsc
  bUSD: {
    symbol: "bUSD",
    address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    icon: ImageToken.bUSD,
    heco: {
      address: "0xe9e7cea3dedca5984780bafc599bd69add087d56"
    },
    esc: {
      address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    },
    arbitrum: {
      address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    },
    bsc: {
      address: "0xe9e7cea3dedca5984780bafc599bd69add087d56"
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E"
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  bCASH: {
    symbol: "bCASH",
    address: "0x1Ce5eC42c7bf29eB0CB733045aAfDe275c0dC7E7",
    icon: ImageToken.bCASH,
    heco: {
      address: "0x1Ce5eC42c7bf29eB0CB733045aAfDe275c0dC7E7"
    },
    esc: {
      address: "0x1Ce5eC42c7bf29eB0CB733045aAfDe275c0dC7E7",
    },
    arbitrum: {
      address: "0x1Ce5eC42c7bf29eB0CB733045aAfDe275c0dC7E7",
    },
    bsc: {
      address: "0x1Ce5eC42c7bf29eB0CB733045aAfDe275c0dC7E7"
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E"
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  WarshipNFT: {
    symbol: "WarshipNFT",
    address: "0xaE2a1E04958C385eE1dF7762a0bd69dAd66B5C72",
    abi: WarshipNFT_ABI,
    heco: {
      address: "0x90590D7197f540334A66280f61ad41130c408696"
    },
    esc: {
      address: "0xaE2a1E04958C385eE1dF7762a0bd69dAd66B5C72",
    },
    arbitrum: {
      address: "0xaE2a1E04958C385eE1dF7762a0bd69dAd66B5C72",
    },
    bsc: {
      address: "0xaE2a1E04958C385eE1dF7762a0bd69dAd66B5C72"
    },
    local: {
      address: "0x82e78A46d278f37c7Ef2B2E229b7f52851Fc044e"
    },
    polygon: {
      address: "0xE84586AA01F66346fDe9b27fb77da42989Df8362",
    }
  },
  CreateWarship: {
    symbol: "CreateWarship",
    address: "0x586c4fB0aBA3D769Cd4F08075B377af64b122FA0",
    abi: CreateWarship_ABI,
    heco: {
      address: "0x9b76641F46e29Af7b81330C3d5B56A8a22d57393"
    },
    esc: {
      address: "0x586c4fB0aBA3D769Cd4F08075B377af64b122FA0",
    },
    arbitrum: {
      address: "0x586c4fB0aBA3D769Cd4F08075B377af64b122FA0",
    },
    bsc: {
      address: "0x586c4fB0aBA3D769Cd4F08075B377af64b122FA0"
    },
    local: {
      address: "0x9b76641F46e29Af7b81330C3d5B56A8a22d57393"
    },
    polygon: {
      address: "0x072F6E5572F63Be870ea84C784962BC38dBdf67A",
    }
  },
  BuildDataBase: {
    symbol: "BuildDataBase",
    address: "0x8DbCD706Fe6432E906574cFDf6AFBB6Be16281AD",
    abi: BuildDataBase_ABI,
    heco: {
      address: "0x83BF3dcca19BdE5C577528C4d30fEB9Aa4dd607c"
    },
    esc: {
      address: "0x8DbCD706Fe6432E906574cFDf6AFBB6Be16281AD",
    },
    arbitrum: {
      address: "0x8DbCD706Fe6432E906574cFDf6AFBB6Be16281AD",
    },
    bsc: {
      address: "0x8C9E26Ae6181c3b09Bd33295799DAB159cD5398A"
    },
    local: {
      address: "0x175420D24b7A1C05D5e21688D269945A2eB9586A"
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  BuildOpreta: {
    symbol: "BuildOpreta",
    address: "0x3EB6c0C0f550805Fd69Ab6559ccA3E3824b5EB77",
    abi: BuildOpreta_ABI,
    heco: {
      address: "0x4a35a4d8b613bbD1150c02A279Fa66c870418845"
    },
    esc: {
      address: "0x3EB6c0C0f550805Fd69Ab6559ccA3E3824b5EB77",
    },
    arbitrum: {
      address: "0x3EB6c0C0f550805Fd69Ab6559ccA3E3824b5EB77",
    },
    bsc: {
      address: "0xa6A528c6995E527eE70122174b1301A172992Efe"
    },
    local: {
      address: "0x467f5b47B60e957caBbEEC6E200918376b9c9B94"
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  BuildReward: {
    symbol: "BuildReward",
    address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32",
    abi: BuildReward_ABI,
    heco: {
      address: "0x014b50f0C6a1A439D17B23b09c37A6220ebacBb5"
    },
    esc: {
      address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32",
    },
    arbitrum: {
      address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32",
    },
    bsc: {
      address: "0x29a86C3C2F8CF1c2049C71A565A760A22152994B"
    },
    local: {
      address: "0xe1dc8903C2e364371C5A70A7aa5434bCA9530f41"
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  WarshipExplore: {
    symbol: "WarshipExplore",
    address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32",
    abi: WarshipExplore_ABI,
    heco: {
      address: "0xDdf560A8f275d58DF94f4838bC96abBa19F1AAeE"
    },
    esc: {
      address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32",
    },
    arbitrum: {
      address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32",
    },
    bsc: {
      address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32"
    },
    local: {
      address: "0xbD3D9eF5DFF9600eD79f5562Ff8CedA7122F092A"
    },
    polygon: {
      address: "0xbCC5916d2846179D1de273BE0F4260c567eF22eA",
    }
  },
  Production: {
    symbol: "Production",
    address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32",
    abi: Production_ABI,
    heco: {
      address: "0x54cDF90863c50b43Ea6F7d5376893AE45157f48f"
    },
    esc: {
      address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32",
    },
    arbitrum: {
      address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32",
    },
    bsc: {
      address: "0x6F1EeebEf412C97a1D3F2ed5aF018b0b4B2Ecf32"
    },
    local: {
      address: "0x9bBA77015F6573EB62Bd84F0a6c39CD0107d878B"
    },
    polygon: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    }
  },
  SushiFactory: {
    symbol: "SushiFactory",
    abi: SushiFactory_ABI,
    arbitrum: {
      address: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
    },
  },
  HomoraBank: {
    symbol: "HomoraBank",
    abi: HomoraBank_ABI,
    arbitrum: {
      address: "0x8d2d7a730B4d4ac817A0495e435f287B89ca32da"
    },
  },

  UNI: {
    symbol: "CPUSDC",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.CPUSDC,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0x1beF044377C4cF5c5384914af21869Fde99F6Fae",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  wETH: {
    symbol: "ETH",
    icon: ImageToken.ETH,
    arbitrum: {
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    },
  },
  ETH: {
    symbol: "CPUSDC",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.CPUSDC,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0x2F73FB16933585Ba089100C05561D58FD342bDf5",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  LINK: {
    symbol: "LINK",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.LINK,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },
  SUSHI: {
    symbol: "CPUSDC",
    address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    icon: ImageToken.CPUSDC,
    heco: {
      address: "0xa71edc38d189767582c38a3145b5873052c3e47a"
    },
    esc: {
      address: "0x764acca5f51f83fc0561808c432823df8a135b86",
    },
    arbitrum: {
      address: "0x1beF044377C4cF5c5384914af21869Fde99F6Fae",
    },
    bsc: {
      address: "0x55d398326f99059fF775485246999027B3197955",
    },
    local: {
      address: "0x719D9d62f1aE9B9A22B406cBB841bfcd2a70465E",
    },
    polygon: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    }
  },


}

// 目前仅支持arbitrum
// heco测试
// bank配置
export const BankConfig: any = {
  USDC: {
    arbitrum: {
      symbol: "USDC",
      address: ContractConfig.USDC.arbitrum?.address,
      abi: ERC20_ABI,
      cToken: {
        symbol: "cUSDC",
        address: "0x1beF044377C4cF5c5384914af21869Fde99F6Fae", //cpusdc
        caddress: "0x2Bf852e22C92Fd790f4AE54A76536c8C4217786b",
        abi: cPiggyVault_ABI,
        cabi: qERC20_ABI
      }
    }
  },
  USDT: {
    arbitrum: {
      symbol: "USDT",
      address: ContractConfig.USDT.arbitrum?.address,
      abi: ERC20_ABI,
      cToken: {
        symbol: "cUSDT",
        address: "0xA8B721F2799744c349Bf0C89b357Fd0a55317d78", //cpusdt
        caddress: "0xB65Ab7e1c6c1Ba202baed82d6FB71975D56F007C",
        abi: cPiggyVault_ABI,
        cabi: qERC20_ABI
      }
    }
  },
  WBTC: {
    arbitrum: {
      symbol: "WBTC",
      address: ContractConfig.WBTC.arbitrum?.address,
      abi: ERC20_ABI,
      cToken: {
        symbol: "cWBTC",
        address: "0x8370E666544C020d49458e373245b43222c878B1",
        caddress: "0x3393cD223f59F32CC0cC845DE938472595cA48a1",
        abi: cPiggyVault_ABI,
        cabi: qERC20_ABI
      }
    }
  },
  DAI: {
    arbitrum: {
      symbol: "DAI",
      address: ContractConfig.DAI.arbitrum?.address,
      abi: ERC20_ABI,
      cToken: {
        symbol: "cDAI",
        address: "0xAC011fcB9eb7F714bF443cb33033439bC433a781",
        caddress: "0xde39adfb2025d2aa51f6fd967e7c1753215f1905",
        abi: cPiggyVault_ABI,
        cabi: qERC20_ABI
      }
    }
  }
}

// earn 配置
export const EarnConfig: any = {
  USDC: {
    arbitrum: {
      symbol: "USDC",
      address: ContractConfig.USDC.arbitrum?.address,
      abi: ERC20_ABI,
      cToken: {
        symbol: "cUSDC",
        address: "0x16AFC4Aa8703364e8Ff1a49A45a46aa4c5485896", //ctoken地址和合约地址 是一个地址
        caddress: "0x2Bf852e22C92Fd790f4AE54A76536c8C4217786b",
        abi: cVault_ABI,
        cabi: qERC20_ABI
      }
    },
    esc: {
      cToken: {
        address: ContractConfig.USDC.esc?.address,
      }
    }
  },
  USDT: {
    arbitrum: {
      symbol: "USDT",
      address: ContractConfig.USDT.arbitrum?.address,
      abi: ERC20_ABI,
      cToken: {
        symbol: "cUSDT",
        address: "0xffC708B40D3255B57EF946C27478c23d39f11ba8",
        caddress: "0xB65Ab7e1c6c1Ba202baed82d6FB71975D56F007C",
        abi: cVault_ABI,
        cabi: qERC20_ABI
      }
    },
    esc: {
      cToken: {
        address: ContractConfig.USDT.esc?.address,
      }
    }
  },
  WBTC: {
    arbitrum: {
      symbol: "WBTC",
      address: ContractConfig.WBTC.arbitrum?.address,
      abi: ERC20_ABI,
      cToken: {
        symbol: "cWBTC",
        address: "0x51D8bA1973704A76Ba8F8bDfb5A25FccF64D04D2",
        caddress: "0x3393cD223f59F32CC0cC845DE938472595cA48a1",
        abi: cVault_ABI,
        cabi: qERC20_ABI
      }
    },
    esc: {
      cToken: {
        address: ContractConfig.WBTC.esc?.address,
      }
    }
  },
  DAI: {
    arbitrum: {
      symbol: "DAI",
      address: ContractConfig.DAI.arbitrum?.address,
      abi: ERC20_ABI,
      cToken: {
        symbol: "cDAI",
        address: "0x3D4eD1438fB53859d89aC94EF6F04bf257e7778D",
        caddress: "0xde39adfb2025d2aa51f6fd967e7c1753215f1905",
        abi: cVault_ABI,
        cabi: qERC20_ABI
      }
    },
    esc: {
      cToken: {
        address: ContractConfig.DAI.esc?.address,
      }
    }
  },
  LINK: {
    arbitrum: {
      symbol: "LINK",
      address: ContractConfig.LINK.arbitrum?.address,
      abi: ERC20_ABI,
      cToken: {
        symbol: "cDAI",
        address: "0xF9F4030FAcDAf9C532aEa1563f433AAb4d93cfeB",
        caddress: "0x8F87c9c6Efe9CA6997d6FEC8BC930C1fEd90ccC7",
        abi: cVault_ABI,
        cabi: qERC20_ABI
      }
    },
    esc: {
      cToken: {
        address: ContractConfig.LINK.esc?.address,
      }
    }
  },
  ELA: {
    esc: {
      cToken: {
        address: ContractConfig.ELA.esc?.address,
      }
    }
  },
  FILDA: {
    esc: {
      cToken: {
        address: ContractConfig.FILDA.esc?.address,
      }
    }
  },
  GLIDE: {
    esc: {
      cToken: {
        address: ContractConfig.GLIDE.esc?.address,
      }
    }
  },
  ELK: {
    esc: {
      cToken: {
        address: ContractConfig.ELK.esc?.address,
      }
    }
  }
}
