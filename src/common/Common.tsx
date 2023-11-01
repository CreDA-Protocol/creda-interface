import ImageCommon from '@assets/common/ImageCommon';
import DAIIcon from '@assets/tokens/Dai (DAI).png';
import ETHIcon from '@assets/tokens/Ethereum (ETH).png';
import ImageToken from "@assets/tokens/ImageToken";
import USDTIcon from '@assets/tokens/Tether (USDT).png';
import USDCIcon from '@assets/tokens/USD Coin (USDC).png';
import WBTCIcon from '@assets/tokens/Wrapped Bitcoin (WBTC).png';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BigNumber, ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { TransactionDetails } from "../state/transactions/reducer";

import CompoundLens_ABI from "@abi/banking/CompoundLens.json";
import Comptroller_ABI from "@abi/banking/Comptroller.json";
import ERC20_ABI from "@abi/generic/ERC20.json";
import qERC20_ABI from '@abi/generic/qERC20.json';
import PriceOracle_ABI from "@abi/swap/PriceOracle.json";

export { CompoundLens_ABI, Comptroller_ABI, ERC20_ABI, PriceOracle_ABI, qERC20_ABI };

//export const ethereum = (window as any).ethereum;
export const ethereum = window.ethereum;

export const provider = ethereum ? new ethers.providers.Web3Provider(ethereum, "any") : null;
export const signer = provider?.getSigner();
export const walletInfo = {
  provider: provider,
  signer: provider?.getSigner()
}
// 通过定制 URL 连接 :
export const HECO_URL = "https://http-mainnet.hecochain.com";
export const BSC_URL = "https://bsc-dataseed1.binance.org/";
export const Arbitrum_Url = "https://arb1.arbitrum.io/rpc/";

export const HECO_PROVIDER = new ethers.providers.JsonRpcProvider(HECO_URL);
export const BSC_PROVIDER = new ethers.providers.JsonRpcProvider(BSC_URL);
export const Arbitrum_Provider = new ethers.providers.JsonRpcProvider(Arbitrum_Url);

export const colors = {
  cardBg: '#061B2B',
  main: '#4E55FF',
  black: '#000000',
  white: '#FFFFFF',
  warning: '#8e1515',
  transparent: 'transparent',
  loadingBackground: '#111722',
  loadingForeground: '#1A212D',
  active: '#F99948',
  black_7: 'rgba(0,0,0,0.7)',
  bg_modal: 'rgba(0,0,0,0.3)',
  grey: "#17181A",
  title: "#3A3A3A",
  dark_title: "#0D0D11",
  background: "#FFFFFF",
  dark_background: "#17181A",
  disabled: "#5a5a5a",
}

interface token {
  [propName: string]: string
}

export const tokenContracts: token = {
  // token
  USDT: '0xa71edc38d189767582c38a3145b5873052c3e47a',
  HT: '0x64ff637fb478863b7468bc97d30a5bf3a428a1fd',
  MDX: '0x25d2e80cb6b86881fd7e07dd263fb79f4abe033c',

  HUSD: '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
  HBTC: '0x66a79d23e58475d2738179ca52cd0b41d73f0bea',
  wETH: '0x64ff637fb478863b7468bc97d30a5bf3a428a1fd',
  wHT: '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f',
  pNEO: '0x6514a5ebff7944099591ae3e8a5c0979c83b2571',
  HFIL: '0xae3a768f9ab104c69a7cd6041fe16ffa235d1810',
  HDOT: '0xa2c49cee16a5e5bdefde931107dc1fae9f7773e3',
  HLTC: '0xecb56cf772b5c9a6907fb7d32387da2fcbfb63b4',
  BAG: '0xa042fb0e60125a4022670014ac121931e7501af4',
  FILDA: '0xe36ffd17b2661eb57144ceaef942d95295e637f0',
  TPT: '0x9ef1918a9bee17054b35108bd3e2665e2af1bb1b',
  LHB: '0x8f67854497218043e1f72908ffe38d0ed7f24721',
  HBO: '0x8764bd4fcc027faf72ba83c0b2028a3bae0d2d57',
  NULS: '0xd938e45680da19ad36646ae8d4c671b2b1270f39',
  CAN: '0x1e6395e6b059fc97a4dda925b6c5ebf19e05c69f',
  HPT: '0xe499ef4616993730ced0f31fa2703b92b50bb536',
  LAVA: '0x56f95662e71f30b333b456439248c6de589082a4',
  FIX: '0xde9495de889996404b14ddbf05f66db7401f0733',
  SOVI: '0x49e16563a2ba84e560780946f0fb73a8b32c841e',
  BEE: '0xb1f80844a1b84c61ab80cafd88b1f8c09f9342e1',
  EDC: '0x68a0a1fef18dfcc422db8be6f0f486dea1999edc',
  SWFTC: '0x329dda64cbc4dfd5fa5072b447b3941ce054ebb3',
  DATT: '0x018619e9740466da2146fd2528d1351824ca98b1',
  ARCH: '0xfB6f575FdD24c17Ea5F19892c82C9eA878400a2a',
  GOBLIN: '0xe66bfdfc19c8b4caa76b18022c40c45beee22294',
  NVT: '0xf0e406c49c63abf358030a299c0e00118c4c6ba5',
  MAN: '0x7a45d615f26da940ffff43eca1274d8ea116ce0c',
  xFarmer: '0xe0fe25eefcfcaddef844fe30b8be1d68ac6b7af3',
  JOIN: '0x1d9fd228adda1975e376afa6b73e35ee6c2cf9ae',
  // JOIN: '0x6bc130930dca5f99f21cb701202ccea8a03bf182', //test
  // lp token
  JOIN_USDT: '0x633B44263B66376468F4b8da8E041821AAEc9Fc6',
  HBTC_USDT: '0x2f9FBD88B542eF091Fbff2DeC224A9B957d82076',
  HBTC_HUSD: '0x04ae6670D824A48CDcbD697A116418A63D52E0E7',
  wETH_USDT: '0xc8235B4b63391E5f6108dae98D63a9632c646257',
  wETH_HUSD: '0x6Ad950563D71BA2abB2E1aF648007E84a58EA62B',
  wHT_USDT: '0x4a137b184Ec12356885aDC54eb0BEA7429402C3b',
  wHT_HUSD: '0x452A566312074DA24BF5459512CE0DBA76401E54',
  USDT_HUSD: '0xa1a7FcaaD67Ca8fb75b694d4eB97E7F9b74a9a94'
}
// multiCall配置
export const multiCallConfig: any = {
  "network": {
    "heco": {
      "address": "0x6Bd3A85Dfc401e81D31717EFf0b67D7931c265d2"
    },
    "hecotest": {
      "address": "0x8065392FC4c02B2aBf883FdDeC5545cEd0dd5f5c"
    },
    "bsc": {
      "address": "0x6Bd3A85Dfc401e81D31717EFf0b67D7931c265d2"
    },
    "local": {
      "address": "0x25E1d9E6F6be909858b112A9802d75F56a5AC895"
    },
    arbitrum: {
      address: "0x0B7035b1B32B4a8Be30055efc3909e4358000527"
    },
  }
}

// markets配置
export const marketsConfig: any = {
  USDT: {
    heco: {
      symbol: "USDT",
      address: tokenContracts.USDT,
      abi: ERC20_ABI,
      qToken: {
        symbol: "uUSDT",
        address: "0x403a0399B54D932e1df25CAf461D9b5ae34917fF",
        abi: qERC20_ABI
      }
    }
  },
  HT: {
    heco: {
      symbol: "HT",
      address: tokenContracts.HT,
      abi: ERC20_ABI,
      qToken: {
        symbol: "uHT",
        address: "0x81376D428e6D835D7eaFea84503Ac9fb01e6EcbB",
        abi: qERC20_ABI
      }
    },
  },
  MDX: {
    heco: {
      symbol: "MDX",
      address: tokenContracts.MDX,
      abi: ERC20_ABI,
      qToken: {
        symbol: "uMDX",
        address: "0x1d6Cc73a2a0486d95260e8557b314537dd66eC15",
        abi: qERC20_ABI
      }
    },
  },
}
export const compoundLens: any = {
  "ABI": CompoundLens_ABI,
  "network": {
    "elatest": {
      "address": "0xFe6a82ddAfb400d734ccf57D5d7D1866fd97601f"
    },
    "hecotest": {
      "address": "0x46F27679e96CABEcb6d20A0332F6Aab19685E733"
    },
    "heco": {
      "address": "0xB1EEEE11dc9993AFbfDFA911f5818bB69EAcebfE"
    }
  }
}
export const comptrollerConfig: any = {
  "network": {
    "main": {
      "address": "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"
    },
    "ropsten": {
      "address": "0x54188bBeDD7b68228fa89CbDDa5e3e930459C6c6"
    },
    "rinkeby": {
      "address": "0x2EAa9D77AE4D8f9cdD9FAAcd44016E746485bddb"
    },
    "private": {
      "address": "0x0866c12B85AD8fca53f0f0918B5AA30286d39D62"
    },
    "elatest": {
      "address": "0x9bCDf73B28F9214f51f8722a32Bd96bfe4f16Fa6",
      abi: Comptroller_ABI
    },
    "hecotest": {
      "address": "0xb74633f2022452f377403B638167b0A135DB096d",
      abi: Comptroller_ABI
    },
    "heco": {
      "address": "0x8A7586f46a281900b41744D30859Bdd66d428072",
      abi: Comptroller_ABI
    }
  }
}
export const priceOracle: any = {
  "ABI": PriceOracle_ABI,
  "network": {
    "main": {
      "address": "0x922018674c12a7F0D394ebEEf9B58F186CdE13c1"
    },
    "ropsten": {
      "address": "0xe23874df0276AdA49D58751E8d6E088581121f1B"
    },
    "rinkeby": {
      "address": "0x5722A3F60fa4F0EC5120DCD6C386289A4758D1b2"
    },
    "private": {
      "address": "0xb833Cc1B7222022e473af358e35fcf339533d20B"
    },
    "elatest": {
      "address": "0x916dAbC2544287E6b1145DEe7976CF085E5EEa5b"
    },
    "hecotest": {
      "address": "0x0a6a06003417dA7BCF1C2bdc27e2A30C38EfF4Ad"
    },
    "heco": {
      "address": "0x30fADfd1C644a8E341Aa2541fc5840A0b25f0b4d"
      //"address": "0xcaffe113e75efe0e12ac7a15d90b170726241b61" // The price oracle without link
    }
  }
}

// 根据不同的lp 或 token 获取名字
export function getPairTitle(pair: string): string {
  pair = pair.replace('wETH', 'ETH')
  return pair.indexOf('_') ? pair.replace('_', '/') : pair
}

export function bigNumberToBalance(s: BigNumber, decimal = 18): string {
  return formatUnits(s, decimal)
}

// 余额转bignumber
export function balanceToBigNumber(d: string | number, decimals = 18): BigNumber {
  return parseUnits(String(d), decimals)
}

// bignumber转余额
export function formatBalance(s: string | number, decimals = 2): string {
  const a = 0
  if (isNaN(Number(s))) {
    return a.toFixed(decimals)
  }
  return s ? Number(s).toFixed(decimals) : a.toFixed(decimals)
}

// if the number < 0, it indicates that we can't get the right data. eg. token price.
export function formatPositiveNumber(s: string | number, decimals = 2): string {
  if (Number(s) < 0) {
    return '--'
  }
  return formatBalance(s, decimals)
}

export function mathPriceTo8(value: any) {
  return Math.floor(Number(value) * 100000000) / 100000000
}
export function mathPriceTo4(value: any) {
  return Math.floor(Number(value) * 10000) / 10000
}
export function mathPriceTo6(value: any) {
  return Math.floor(Number(value) * 1000000) / 1000000
}
export function mathPriceTo12(value: any) {
  return Math.floor(Number(value) * 1000000000000) / 1000000000000
}
export function mathPriceTo18(value: any) {
  return Math.floor(Number(value) * 1000000000000000000) / 1000000000000000000
}

export function formatPercent(s: string | number, decimals = 2): string {
  if (Number(s) / 100 > 999999) {
    return '999999%'
  }
  return s ? (Number(s) * 100).toFixed(decimals) + '%' : '0%'
}

export function stringReplaceSpace(str: string) {
  return str.replace(/\s/g, "");
}

export const getCurrencyFormatted = (num: string | number, decimals = 2) => {
  // num = parseFloat(num) * price.HT
  num = parseFloat(String(num))
  let si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: " K" },
    { value: 1E6, symbol: " M" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return "$" + (num / si[i].value).toFixed(decimals).replace(rx, "$1") + si[i].symbol;
}

export type ChainName = 'arbitrum' | 'esc' | 'elatest' | 'heco' | 'hecotest' | 'bsc' | 'local' | 'polygon' | 'ethereum' | 'ropsten' | 'celo' | 'celotest';

export type ChainIdList = {
  [chain in ChainName]: number;
}

export type ChainId = ChainIdList[keyof ChainIdList];

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

export function chainFromId(chainId: number): ChainName {
  const chain = Object.entries(ChainIds).find(([key, val]) => val === chainId)?.[0] as ChainName;
  if (!chain)
    throw new Error(`Chain ID ${chainId} is not in the configured chains!`);

  return chain;
}

/**
 * Tells if the "My bank" menu is available on the UI for the given chain.
 */
export function bankIsEnabledOnChain(chainId: ChainId): boolean {
  switch (chainId) {
    case ChainIds.esc:
    case ChainIds.arbitrum:
      return true;
    default:
      return false;
  }
}

/**
 * Tells if the "Vault" menu is available on the UI for the given chain.
 */
export function vaultIsEnabledOnChain(chainId: ChainId): boolean {
  switch (chainId) {
    case ChainIds.esc:
    case ChainIds.arbitrum:
      return true;
    default:
      return false;
  }
}

// chainId
/* export const chainIdConfig: any = {
  [ChainId.esc]: "esc",
  [ChainId.elatest]: "elatest",
  [ChainId.heco]: "heco",
  [ChainId.hecotest]: "hecotest",
  [ChainId.bsc]: "bsc",
  [ChainId.local]: "local",
  [ChainId.polygon]: "polygon",
  [ChainId.arbitrum]: "arbitrum",
  [ChainId.kovan]: "kovan",
  [ChainId.celo]: "celo",
  [ChainId.celotest]: "celotest",
} */

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

export const panelPairs = ["USDT", "FILDA", "wELA"];

export function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export function formatAccount(account: string) {
  return account.slice(0, 4) + '****' + account.slice(-4);
}

export enum BuildStatus {
  Not_Build = 0,
  Building = 1,
  Need_Complete = 2,
  Complete = 3
}

export const SwapList = ["USDT", "IFNT"];

export function save8(num: number) {
  return Number(num.toString().slice(0, 8))
}

export function reverseArray(data: any) {
  data = data.concat()
  return data.reverse()
}

export function getDeadLine() {
  return "0x" + (Math.floor(new Date().getTime() / 1000) + 20).toString(16)
}

export const minScale = 0.8;

export function timeToH_M_S(time: number) {
  const check = (num: number) => {
    if (num < 10) {
      return '0' + num
    }
    return num
  }
  let min = Math.floor(time % 3600);
  return check(Math.floor(time / 3600)) + ':' + check(Math.floor(min / 60)) + ':' + check(time % 60)
}
export function getBuildStatus(overTime: number) {
  let status = BuildStatus.Not_Build
  if (overTime > new Date().getTime() / 1000) {
    status = BuildStatus.Building
  } else if (overTime <= new Date().getTime() / 1000 && overTime > 0) {
    status = BuildStatus.Need_Complete
  }
  return status;
}

export function logError(name: string, e: any) {
  console.error(`${name}出错了,${e}`)
}

export function getPercentFlag(percent: string | number) {
  percent = Number(percent)
  if (percent > 0) {
    return "+"
  } else if (percent === 0) {
    return ""
  } else {
    return "-"
  }
}

export const platforms = {
  AaveV1: {
    title: "Aave V1",
    icon: "https://defigogo.s3-ap-northeast-1.amazonaws.com/images/b7d8f173-de3f-4dc3-9316-00268fc402a9.jpg"
  },
  Compound: {
    title: "Compound",
    icon: "https://defigogo.s3-ap-northeast-1.amazonaws.com/images/a975ce58-796d-4b7a-a8c7-e06368043c1c.png"
  },
  Curve: {
    title: "Curve",
    icon: "https://defigogo.s3-ap-northeast-1.amazonaws.com/images/9d9db459-8ae6-48e8-aee9-295d23211ed5.jpg"
  },
  FILDA: {
    title: "FILDA",
    icon: ImageToken.FILDA
  },
  Wepiggy: {
    title: "Wepiggy",
    icon: ImageToken.WEPIGGY
  }
}

export function tipError(e: any) {
  // message.error(e?.message)
}

export const ChainIdConfig: any = {
  eth: "0x1",
  bsc: BigNumber.from(56).toHexString(),
  heco: BigNumber.from(128).toHexString(),
  polygon: BigNumber.from(66).toHexString(),
}

export function switchNetwork(chainId: string) {
  return ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: chainId,
      }
    ]
  })
}

export function enableNetwork(chainId: number) {
  if (chainId === ChainIds.arbitrum || chainId === ChainIds.esc || chainId === ChainIds.elatest || chainId === ChainIds.celo || chainId === ChainIds.celotest) {
    return true
  }
  return false
}
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const MiningPool = ["CPUSDC", "CPUSDT", "CPWBTC", "CPDAI"]
// export const MiningPool = ["CREDA"]
const rpcUrls = {
  // TODO: add others
  20: "https://api.elastos.io/esc",           // Elastos mainnet
  21: "https://api-testnet.elastos.io/eth",       // Elastos testnet
  128: "https://heconode.ifoobar.com",             // HECO mainnet
  [ChainIds.arbitrum]: "https://arb1.arbitrum.io/rpc",        // Arbitrum
  56: "https://bsc-dataseed1.binance.org/",        // BSC
  42220: "https://forno.celo.org",        // Celo
  44787: "https://alfajores-forno.celo-testnet.org",        // Celo testnet
}
const walletConnect = {
  rpc: rpcUrls,
  //bridge: "http://192.168.31.114:5001"
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

export const globalObj: any = global
export const globalObject: any = global


export function getNFTCardBgImage(type: string) {
  switch (type) {
    case '1': {
      return ImageCommon.NFT_LV1
    }
    case '2': {
      return ImageCommon.NFT_LV2
    }
    case '3': {
      return ImageCommon.NFT_LV3
    }
    case '4': {
      return ImageCommon.NFT_LV4
    }
    case '5': {
      return ImageCommon.NFT_LV5
    }
    default: {
      return ImageCommon.NFT_LV1
    }
  }
}

export function getRandom(num: number) {
  return Math.floor(Math.random() * num);
}


export const MyBankAssetPriceIcons = [
  {
    name: 'USDC',
    icon: USDCIcon,
  },
  {
    name: 'USDT',
    icon: USDTIcon,
  },

  // {
  //   name:'UNI',
  //   icon:UNIIcon,
  // },
  {
    name: 'WBTC',
    icon: WBTCIcon,
  },
  {
    name: 'DAI',
    icon: DAIIcon,
  },
  {
    name: 'LINK',
    icon: ImageToken.LINK,
  },
  // {
  //   name:'ETH',
  //   icon:ETHIcon,
  // },
  // {
  //   name:'LINK',
  //   icon:LINKIcon,
  // },
  // {
  //   name:'SUSHI',
  //   icon:SUSHIIcon,
  // }
]

export const MyBankAssetPriceIconsESC = [
  {
    name: 'ELA',
    icon: ImageToken.ELA,
  },
  {
    name: 'USDC',
    icon: USDCIcon,
  },
  {
    name: 'FILDA',
    icon: ImageToken.FILDA,
  },
  {
    name: 'GLIDE',
    icon: ImageToken.GLIDE,
  },
  {
    name: 'ELK',
    icon: ImageToken.GLIDE,
  },
]
export const MyBankAssetFarmingIcon = [
  {
    name1: 'ETH',
    icon1: ETHIcon,
    name2: 'USDT',
    icon2: USDTIcon,
    linkUrl: 'https://analytics-arbitrum.sushi.com/pairs/0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad',
    Fee: 51.49,
    APR: 5.23,
    APY: (17.56 + 20.41) / 2,
    line_pre: 51.49 + 5.23
  },
  {
    name1: 'ETH',
    icon1: ETHIcon,
    name2: 'USDC',
    icon2: USDCIcon,
    linkUrl: 'https://analytics-arbitrum.sushi.com/pairs/0x905dfcd5649217c42684f23958568e533c711aa3',
    Fee: 52.25,
    APR: 0.64,
    APY: (17.56 + 9.69) / 2,
    line_pre: 52.25 + 0.64
  },
  {
    name1: 'ETH',
    icon1: ETHIcon,
    name2: 'DAI',
    icon2: DAIIcon,
    linkUrl: 'https://analytics-arbitrum.sushi.com/pairs/0x692a0b300366d1042679397e40f3d2cb4b8f7d30',
    Fee: 32.67,
    APR: 14.02,
    APY: (17.56 + 18.72) / 2,
    line_pre: 32.67 + 14.02
  }
]
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

export const GasInfo = {
  gasLimit: 1000000
}
