import WalletConnectProvider from "@walletconnect/web3-provider";
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import ImageCommon from '../assets/common/ImageCommon';
import DAIIcon from '../assets/tokens/Dai (DAI).png';
import ETHIcon from '../assets/tokens/Ethereum (ETH).png';
import ImageToken from "../assets/tokens/ImageToken";
import USDTIcon from '../assets/tokens/Tether (USDT).png';
import USDCIcon from '../assets/tokens/USD Coin (USDC).png';
import WBTCIcon from '../assets/tokens/Wrapped Bitcoin (WBTC).png';
import { TransactionDetails } from "../state/transactions/reducer";


export const qERC20_ABI = require('../abiJson/qERC20.json');
export const ERC20_ABI = require("../abiJson/ERC20.json");

export const Comptroller_ABI = require("../abiJson/Comptroller.json");
export const CompoundLens_ABI = require("../abiJson/CompoundLens.json");
export const PriceOracle_ABI = require("../abiJson/PriceOracle.json");

export const ethereum = (window as any).ethereum;

export const provider = ethereum ? new ethers.providers.Web3Provider(ethereum, "any") : null;
export const signer = provider?.getSigner();
export const walletInfo = {
    provider:provider,
    signer:provider?.getSigner()
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
    dark_title:"#0D0D11",
    background:"#FFFFFF",
    dark_background:"#17181A",
    disabled:"#5a5a5a",
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
export function formatBalance(s: string|number, decimals = 2): string {
    const a = 0
    if (isNaN(Number(s))) {
        return a.toFixed(decimals)
    }
    return s ? Number(s).toFixed(decimals) : a.toFixed(decimals)
}

export function mathPriceTo8(value:any) {
  return Math.floor(Number(value) * 100000000) / 100000000
}
export function mathPriceTo4(value:any) {
  return Math.floor(Number(value) * 10000) / 10000
}
export function mathPriceTo6(value:any) {
  return Math.floor(Number(value) * 1000000) / 1000000
}
export function mathPriceTo12(value:any) {
  return Math.floor(Number(value) * 1000000000000) / 1000000000000
}
export function mathPriceTo18(value:any) {
  return Math.floor(Number(value) * 1000000000000000000) / 1000000000000000000
}

export function formatPercent(s: string | number, decimals = 2): string {
    if (Number(s) / 100 > 999999) {
        return '999999%'
    }
    return s ? (Number(s) * 100).toFixed(decimals) + '%' : '0%'
}

export function stringReplaceSpace(str:string){
  return str.replace(/\s/g,"");
}

export const getCurrencyFormatted = (num: string | number, decimals = 2) => {
    // num = parseFloat(num) * price.HT
    num = parseFloat(String(num))
    let si = [
        {value: 1, symbol: ""},
        {value: 1E3, symbol: " K"},
        {value: 1E6, symbol: " M"}
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
//一些配置信息
export const config = {
    refreshInterval: 5000
}

/**
 * 获取加速状态图标
 * @param percent
 */
export function getSpeedIcon(percent: number | string) {
    percent = Number(percent) * 100;
    if (percent < 100) {
        return ImageCommon.icon_wugui;
    }
    if (percent < 500 && percent >= 100) {
        return ImageCommon.icon_tuzi;
    }
    return ImageCommon.icon_huojian;
}

export const CardPrice = [
    {
        level: 1,
        price: 1,
    },
    {
        level: 2,
        price: 10,
    },
    {
        level: 3,
        price: 100,
    },
    {
        level: 4,
        price: 1000,
    },
    {
        level: 5,
        price: 10000,
    },
]

export enum ChainId {
    ethereum=1,
    ropsten=3,
    esc = 20,
    elatest = 21,
    heco = 128,
    hecotest = 256,
    bsc = 56,
    local = 1337,
    polygon=137,
    arbitrum=42161,
    kovan=42,
    rinkeby=4,
    goerli=5
}

// chainId
export const chainIdConfig: any = {
    [ChainId.esc]: "esc",
    [ChainId.elatest]: "elatest",
    [ChainId.heco]: "heco",
    [ChainId.hecotest]: "hecotest",
    [ChainId.bsc]: "bsc",
    [ChainId.local]: "local",
    [ChainId.polygon]: "polygon",
    [ChainId.arbitrum]: "arbitrum",
    [ChainId.kovan]: "kovan"
}

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

export const ResourceStore=[
  {
    image:ImageCommon.resourceLv1,
    title:"elementaryResourcePack",
    des:"elementaryResourcePackDes",
    price1:100,
    price2:100,
    id:7,
    amount:100
  },
  {
    image:ImageCommon.resourceLv2,
    title:"intermediateResourcePack",
    des:"intermediateResourcePackDes",
    price1:500,
    price2:500,
    id:6,
    amount:50
  },
  {
    image:ImageCommon.resourceLv3,
    title:"advancedResourcePack",
    des:"advancedResourcePackDes",
    price1:2000,
    price2:2000,
    id:5,
    amount:20
  },
  {
    image:ImageCommon.resourceLv4,
    title:"topResourcePack",
    des:"topResourcePackDes",
    price1:10000,
    price2:10000,
    id:4,
    amount:10
  },
]
export const ScienceStore:any=[
  {
    image:ImageCommon.scienceLv1,
    title:"elementaryTechnologyPackage",
    des:"elementaryTechnologyPackageDes",
    price:50,
    id:3,
    amount:100
  },
  {
    image:ImageCommon.scienceLv2,
    title:"intermediateTechnologyPackage",
    des:"intermediateTechnologyPackageDes",
    price:500,
    id:2,
    amount:50
  },
  {
    image:ImageCommon.scienceLv3,
    title:"advancedTechnologyPackage",
    des:"advancedTechnologyPackageDes",
    price:2000,
    id:1,
    amount:20
  },
  {
    image:ImageCommon.scienceLv4,
    title:"topTechnologyPackage",
    des:"topTechnologyPackageDes",
    price:5000,
    id:0,
    amount:10
  },
]

export const packageInfoConfig:any = {
  1:{
    id:1,
    title: "Kryptonite",
    icon:ImageCommon.bag_lv1_5,
    icon_op:ImageCommon.bag_lv1_5_op,
  },
  2:{
    id:2,
    title: "gas",
    icon:ImageCommon.bag_lv2_5,
    icon_op:ImageCommon.bag_lv2_5_op,
  },
  11:{
    id:11,
    title: "Element (origin)",
    icon:ImageCommon.bag_lv3_5,
    icon_op:ImageCommon.bag_lv3_5_op,
  },
  21:{
    id:21,
    title: "Metal (fire)",
    icon:ImageCommon.bag_lv4_5,
    icon_op:ImageCommon.bag_lv4_5_op,
  },
  101:{
    id:101,
    title: "Planet detection component",
    icon:ImageCommon.bag_lv1_7
  },
  102:{
    id:102,
    title: "Planetary transition components",
    icon:ImageCommon.bag_lv1_1
  },
  103:{
    id:103,
    title: "Planetary acceleration component",
    icon:ImageCommon.icon_star_add
  },
  104:{
    id:104,
    title: "Planet armor components",
    icon:ImageCommon.bag_lv3_1
  },
  105:{
    id:105,
    title: "Planetary firepower components",
    icon:ImageCommon.bag_lv4_1
  },

  111:{
    id:111,
    title: "Interstellar exploration components",
    icon:ImageCommon.bag_lv2_7
  },
  112:{
    id:112,
    title: "Interstellar transition components",
    icon:ImageCommon.bag_lv2_1
  },
  113:{
    id:113,
    title: "Interplanetary acceleration components",
    icon:ImageCommon.bag_lv4_7
  },
  114:{
    id:114,
    title: "Interstellar armor components",
    icon:ImageCommon.icon_inter_arm
  },
  115:{
    id:115,
    title: "Interstellar Fire Components",
    icon:ImageCommon.bag_lv1_6
  },
  1001:{
    id:1001,
    title: "Elementary Technology Blueprint",
    icon:ImageCommon.bag_lv1_4
  },
  1002:{
    id:1002,
    title: "Medium technology blueprint",
    icon:ImageCommon.bag_lv2_4
  },
  1003:{
    id:1003,
    title: "Advanced technology blueprint",
    icon:ImageCommon.bag_lv3_4
  },
  1004:{
    id:1004,
    title: "Top technology blueprint",
    icon:ImageCommon.bag_lv4_4
  },
  121:{
    id:121,
    title: "Cosmic exploration components",
    icon:ImageCommon.bag_lv3_6
  },
  122:{
    id:122,
    title: "Cosmic transition component",
    icon:ImageCommon.bag_lv4_6
  },
  123:{
    id:123,
    title: "Universe acceleration component",
    icon:ImageCommon.bag_lv1_2
  },
  124:{
    id:124,
    title: "Cosmic armor components",
    icon:ImageCommon.bag_lv2_2
  },
  125:{
    id:125,
    title: "Cosmic firepower component",
    icon:ImageCommon.bag_lv3_2
  },

  131:{
    id:131,
    title: "Wormhole Detection components",
    icon:ImageCommon.bag_lv4_2
  },
  132:{
    id:132,
    title: "Wormhole Transition components",
    icon:ImageCommon.icon_wormhole_2
  },
  133:{
    id:133,
    title: "Wormhole Acceleration component",
    icon:ImageCommon.bag_lv2_3
  },
  134:{
    id:134,
    title: "Wormhole Armor components",
    icon:ImageCommon.bag_lv3_3
  },
  135:{
    id:135,
    title: "Wormhole Firepower Components",
    icon:ImageCommon.bag_lv4_3
  },
  // 合成
  601: {
      id: 601,
      title: "Detector Type I",
      buildId:11,
      need: {
          time: 24,
          data: [{
              id: 1,
              amount: 10000
          }, {
              id: 21,
              amount: 2000
          }]
      },
      icon:ImageCommon.tan_ce_qi_I_no,
      icon_op:ImageCommon.tan_ce_qi_I,
  },
  602: {
      id: 602,
      title: "Detector Type II",
      buildId:11,
      need: {
          time: 48,
          data: [{
              id: 1,
              amount: 20000
          }, {
              id: 21,
              amount: 5000
          }]
      },
      icon:ImageCommon.tan_ce_qi_II_no,
      icon_op:ImageCommon.tan_ce_qi_II,
  },
  603: {
      id: 603,
      title: "Detector Type III",
      buildId:11,
      need: {
          time: 96,
          data: [{
              id: 1,
              amount: 100000
          }, {
              id: 21,
              amount: 20000
          }]
      },
      icon_op:ImageCommon.tan_ce_qi_III,
      icon:ImageCommon.tan_ce_qi_III_no

  },
  201: {
      id: 201,
      title: "Space locator type I",
      buildId:11,
      need: {
          time: 24,
          data: [{
              id: 1,
              amount: 2000
          }, {
              id: 21,
              amount: 5000
          }]
      },
      icon:ImageCommon.kong_jian_ding_wei_I_no,
      icon_op:ImageCommon.kong_jian_ding_wei_I,

    },
  202: {
      id: 202,
      title: "Spatial locator type II",
      buildId:11,
      need: {
          time: 48,
          data: [{
              id: 1,
              amount: 20000
          }, {
              id: 21,
              amount: 10000
          }]
      },
      icon:ImageCommon.kong_jian_ding_wei_II_no,
      icon_op:ImageCommon.kong_jian_ding_wei_II,

  },
  203: {
      id: 203,
      title: "Spatial locator type III",
      buildId:11,
      need: {
          time: 96,
          data: [{
              id: 1,
              amount: 20000
          }, {
              id: 21,
              amount: 50000
          }]
      },
      icon:ImageCommon.kong_jian_ding_wei_III_no,
      icon_op:ImageCommon.kong_jian_ding_wei_III,

  },
  41: {
      id: 41,
      title: "Device housing",
      buildId:11,
      need: {
          time: 1,
          data: [{
              id: 1,
              amount: 10000
          }]
      },
      icon:ImageCommon.qi_jian_wai_ke_no,
      icon_op:ImageCommon.qi_jian_wai_ke,

  },
  42: {
      id: 42,
      title: "Basic circuit components",
      buildId:11,
      need: {
          time: 1,
          data: [{
              id: 21,
              amount: 1000
          }]
      },
      icon:ImageCommon.base_dian_lu_no,
      icon_op:ImageCommon.base_dian_lu,

  },
  1101: {
      id: 1101,
      title: "Basic detection components",
      buildId:11,
      need: {
          time: 24,
          data: [
              {
                  id: 601,
                  amount: 1
              },
              {
                  id: 41,
                  amount: 10
              },
              {
                  id: 42,
                  amount: 50
              }
          ]
      },
      icon:ImageCommon.base_tab_ce_no,
      icon_op:ImageCommon.base_tab_ce,

  },
  1102: {
    id: 1102,
    title: "Primary detection component",
      buildId:11,
    need: {
      time: 24,
      data: [
        {
          id: 602,
          amount: 1
        },
        {
          id: 41,
          amount: 10
        },
        {
          id: 42,
          amount: 50
        }
      ]
    },
    icon:ImageCommon.chu_ji_tan_ce_no,
    icon_op:ImageCommon.chu_ji_tan_ce,

  },
  1103: {
    id: 1103,
    title: "Intermediate detection components",
      buildId:11,
    need: {
      time: 24,
      data: [
        {
          id: 603,
          amount: 1
        },
        {
          id: 41,
          amount: 10
        },
        {
          id: 42,
          amount: 50
        }
      ]
    },
    icon:ImageCommon.zhong_ji_tan_ce_no,
    icon_op:ImageCommon.zhong_ji_tan_ce,

  },
  1201: {
    id: 1201,
    title: "Basic transition components",
      buildId:11,
    need: {
      time: 24,
      data: [
        {
          id: 201,
          amount: 1
        },
        {
          id: 41,
          amount: 40
        },
        {
          id: 42,
          amount: 20
        }
      ]
    },
    icon:ImageCommon.base_yue_qian_no,
    icon_op:ImageCommon.base_yue_qian,

  },
  1202: {
    id: 1202,
    title: "Primary transition component",
      buildId:11,
    need: {
      time: 24,
      data: [
        {
          id: 202,
          amount: 1
        },
        {
          id: 41,
          amount: 40
        },
        {
          id: 42,
          amount: 20
        }
      ]
    },
    icon:ImageCommon.chu_ji_yue_jin_no,
    icon_op:ImageCommon.chu_ji_yue_jin,

  },
  1203: {
    id: 1203,
    title: "Intermediate transition components",
      buildId:11,
    need: {
      time: 24,
      data: [
        {
          id: 203,
          amount: 1
        },
        {
          id: 41,
          amount: 40
        },
        {
          id: 42,
          amount: 20
        }
      ]
    },
    icon:ImageCommon.zhong_ji_yue_jin_no,
    icon_op:ImageCommon.zhong_ji_yue_jin,

  },
  301: {
    id: 301,
    title: "Energy Core Type I",
      buildId:12,
    need: {
      time: 24,
      data: [
        {
          id: 1,
          amount: 10000
        },
        {
          id: 2,
          amount: 20000
        }
      ]
    },
    icon:ImageCommon.neng_ling_he_xin_I_no,
    icon_op:ImageCommon.neng_ling_he_xin_I,

  },
  302: {
    id: 302,
    title: "Energy Core Type II",
      buildId:12,
    need: {
      time: 48,
      data: [
        {
          id: 1,
          amount: 20000
        },
        {
          id: 2,
          amount: 50000
        }
      ]
    },
    icon:ImageCommon.neng_ling_he_xin_II_no,
    icon_op:ImageCommon.neng_ling_he_xin_II,

  },
  303: {
    id: 303,
    title: "Energy Core Type III",
      buildId:12,
    need: {
      time: 96,
      data: [
        {
          id: 1,
          amount: 100000
        },
        {
          id: 2,
          amount: 200000
        }
      ]
    },
    icon:ImageCommon.neng_ling_he_xin_III_no,
    icon_op:ImageCommon.neng_ling_he_xin_III,

  },
  1301: {
    id: 1301,
    title: "Basic power components",
      buildId:12,
    need: {
      time: 24,
      data: [
        {
          id: 301,
          amount: 1
        },
        {
          id: 41,
          amount: 100
        }
      ]
    },
    icon:ImageCommon.base_dong_li_no,
    icon_op:ImageCommon.base_dong_li,

  },
  1302: {
    id: 1302,
    title: "Primary power components",
      buildId:12,
    need: {
      time: 24,
      data: [
        {
          id: 302,
          amount: 1
        },
        {
          id: 41,
          amount: 100
        }
      ]
    },
    icon:ImageCommon.chu_ji_dong_li_no,
    icon_op:ImageCommon.chu_ji_dong_li,

  },
  1303: {
    id: 1303,
    title: "Intermediate power components",
      buildId:12,
    need: {
      time: 24,
      data: [
        {
          id: 303,
          amount: 1
        },
        {
          id: 41,
          amount: 100
        }
      ]
    },
    icon:ImageCommon.zhong_ji_dong_li_no,
    icon_op:ImageCommon.zhong_ji_dong_li,

  },
  401: {
    id: 401,
    title: "Antimatter Core Type I",
      buildId:13,
    need: {
      time: 24,
      data: [
        {
          id: 11,
          amount: 1000
        },
        {
          id: 2,
          amount: 20000
        }
      ]
    },
    icon:ImageCommon.fan_wu_zhi_he_xin_I_no,
    icon_op:ImageCommon.fan_wu_zhi_he_xin_I,

  },
  402: {
    id: 402,
    title: "Antimatter Core II",
      buildId:13,
    need: {
      time: 48,
      data: [
        {
          id: 11,
          amount: 2000
        },
        {
          id: 2,
          amount: 50000
        }
      ]
    },
    icon:ImageCommon.fan_wu_zhi_he_xin_II_no,
    icon_op:ImageCommon.fan_wu_zhi_he_xin_II,

  },
  403: {
    id: 403,
    title: "Antimatter Core Type III",
      buildId:13,
    need: {
      time: 96,
      data: [
        {
          id: 11,
          amount: 5000
        },
        {
          id: 2,
          amount: 200000
        }
      ]
    },
    icon:ImageCommon.fan_wu_zhi_he_xin_III_no,
    icon_op:ImageCommon.fan_wu_zhi_he_xin_III,

  },
  1401: {
    id: 1401,
    title: "Basic firepower components",
      buildId:13,
    need: {
      time: 24,
      data: [
        {
          id: 401,
          amount: 1
        },
        {
          id: 41,
          amount: 20
        },
        {
          id: 42,
          amount: 20
        }
      ]
    },
    icon:ImageCommon.base_huo_li_no,
    icon_op:ImageCommon.base_huo_li,

  },
  1402: {
    id: 1402,
    title: "Primary firepower component",
      buildId:13,
    need: {
      time: 24,
      data: [
        {
          id: 402,
          amount: 1
        },
        {
          id: 41,
          amount: 20
        },
        {
          id: 42,
          amount: 20
        }
      ]
    },
    icon:ImageCommon.chu_ji_huo_liu_no,
    icon_op:ImageCommon.chu_ji_huo_liu,

  },
  1403: {
    id: 1403,
    title: "Intermediate firepower components",
      buildId:13,
    need: {
      time: 24,
      data: [
        {
          id: 403,
          amount: 1
        },
        {
          id: 41,
          amount: 20
        },
        {
          id: 42,
          amount: 20
        }
      ]
    },
    icon:ImageCommon.zhong_ji_huo_li_no,
    icon_op:ImageCommon.zhong_ji_huo_li,

  },
  501: {
    id: 501,
    title: "Reactive Armor Type I",
      buildId:14,
    need: {
      time: 24,
      data: [
        {
          id: 11,
          amount: 1000
        },
        {
          id: 21,
          amount: 5000
        },
      ]
    },
    icon:ImageCommon.fan_ying_zhuang_jia_I_no,
    icon_op:ImageCommon.fan_ying_zhuang_jia_I,

  },
  502: {
    id: 502,
      buildId:14,
    title: "Reactive Armor Type II",
    need: {
      time: 48,
      data: [
        {
          id: 11,
          amount: 2000
        },
        {
          id: 21,
          amount: 20000
        },
      ]
    },
    icon:ImageCommon.fan_ying_zhuang_jia_II_no,
    icon_op:ImageCommon.fan_ying_zhuang_jia_II,

  },
  503: {
    id: 503,
    title: "Reactive Armor Type III",
      buildId:14,
    need: {
      time: 96,
      data: [
        {
          id: 11,
          amount: 5000
        },
        {
          id: 21,
          amount: 50000
        },
      ]
    },
    icon:ImageCommon.fan_ying_zhuang_jia_III_no,
    icon_op:ImageCommon.fan_ying_zhuang_jia_III,

  },
  1501: {
    id: 1501,
    title: "Basic armor components",
      buildId:14,
    need: {
      time: 24,
      data: [
        {
          id: 501,
          amount: 1
        },
        {
          id: 41,
          amount: 20
        },
        {
          id: 42,
          amount: 20
        }
      ]
    },
    icon:ImageCommon.base_zhuang_jia_no,
    icon_op:ImageCommon.base_zhuang_jia,

  },
  1502: {
    id: 1502,
    title: "Primary armor components",
      buildId:14,
    need: {
      time: 24,
      data: [
        {
          id: 502,
          amount: 1
        },
        {
          id: 41,
          amount: 20
        },
        {
          id: 42,
          amount: 20
        }
      ]
    },
    icon:ImageCommon.zhu_ji_zhuang_jia_no,
    icon_op:ImageCommon.zhu_ji_zhuang_jia,

  },
  1503: {
    id: 1503,
    title: "Intermediate armor components",
      buildId:14,
    need: {
      time: 24,
      data: [
        {
          id: 503,
          amount: 1
        },
        {
          id: 41,
          amount: 20
        },
        {
          id: 42,
          amount: 20
        }
      ]
    },
    icon:ImageCommon.zhong_ji_zhuang_jia_no,
    icon_op:ImageCommon.zhong_ji_zhuang_jia,

  }
}


export enum BuildStatus {
    Not_Build = 0,
    Building = 1,
    Need_Complete = 2,
    Complete = 3
}

export function StarNormalList(type: string) {
    switch (type) {
        case 'heco': {
            return [
                ImageCommon.sNULS_n,
                ImageCommon.sMDX_n,
                ImageCommon.sXF_n,
                ImageCommon.sCASH_n,
                ImageCommon.sHT_n,
                ImageCommon.sNEO_n,
                ImageCommon.sFILDA_n,
                ImageCommon.sMAN_n,
            ]
        }
        case 'bsc': {
            return [
                ImageCommon.bBTC_n,
                ImageCommon.bDOT_n,
                ImageCommon.bETH_n,
                ImageCommon.bCASH_n,
                ImageCommon.bFIL_n,
            ]
        }
        case 'eth': {
            return []
        }
        default:
            return []
    }
}

export function StarSelectList(type: string) {
    switch (type) {
        case 'heco': {
            return [
                ImageCommon.sNULS_s,
                ImageCommon.sMDX_s,
                ImageCommon.sXF_s,
                ImageCommon.sCASH_s,
                ImageCommon.sHT_s,
                ImageCommon.sNEO_s,
                ImageCommon.sFILDA_s,
                ImageCommon.sMAN_s,
            ]
        }
        case 'bsc': {
            return [
                ImageCommon.bBTC_s,
                ImageCommon.bDOT_s,
                ImageCommon.bETH_s,
                ImageCommon.bCASH_s,
                ImageCommon.bFIL_s,
            ]
        }
        case 'eth': {
            return []
        }
        default:
            return []
    }
}

export function StarNameList(type: string) {
    switch (type) {
        case 'heco': {
            return ["sNULS", "sMDX", "sXF", "sCASH", "sHT", "sNEO", "sFILDA", "sMAN"]
        }
        case 'bsc': {
            return ["bBTC", "bDOT", "bETH", "bCASH", "bFIL"]

        }
        case 'eth': {
            return []
        }
        default:
            return []
    }
}

const planetId: any = {
    sCASH: 1,
    sHT: 2,
    sNEO: 3,
    sFILDA: 4,
    sMAN: 5,
    sNULS: 6,
    sMDX: 7,
    sXF: 8
}
const planetIdBSC: any = {
    bCASH: 1,
    sHT: 2,
    sNEO: 3,
    sFILDA: 4,
    sMAN: 5,
    sNULS: 6,
    sMDX: 7,
    sXF: 8
}

enum planetIdEnum {
    sCASH = 1,
    sHT = 2,
    sNEO = 3,
    sFILDA = 4,
    sMAN = 5,
    sNULS = 6,
    sMDX = 7,
    sXF = 8
}

enum planetIdEnumBSC {
    bCASH = 1,
    sHT = 2,
    sNEO = 3,
    sFILDA = 4,
    sMAN = 5,
    sNULS = 6,
    sMDX = 7,
    sXF = 8
}

export function PlanetId(type: string) {
    switch (type) {
        case 'heco': {
            return planetId
        }
        case 'bsc': {
            return planetIdBSC

        }
        case 'eth': {
            return {}
        }
        default:
            return {}
    }
}

export function PlanetIdEnum(type: string) {
    switch (type) {
        case 'heco': {
            return planetIdEnum
        }
        case 'bsc': {
            return planetIdEnumBSC

        }
        case 'eth': {
            return {}
        }
        default:
            return {}
    }
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
export function getBuildStatus(overTime:number) {
    let status = BuildStatus.Not_Build
    if(overTime>new Date().getTime()/1000){
        status = BuildStatus.Building
    }else if(overTime <= new Date().getTime()/1000 && overTime > 0){
        status = BuildStatus.Need_Complete
    }
    return status;
}

export function logError(name:string,e:any) {
    console.error(`${name}出错了,${e}`)
}

export function getPercentFlag(percent:string|number) {
    percent = Number(percent)
    if(percent>0){
        return "+"
    }else if(percent===0){
        return ""
    }else {
        return "-"
    }
}

export const platforms = {
    AaveV1:{
        title:"Aave V1",
        icon:"https://defigogo.s3-ap-northeast-1.amazonaws.com/images/b7d8f173-de3f-4dc3-9316-00268fc402a9.jpg"
    },
    Compound:{
        title:"Compound",
        icon:"https://defigogo.s3-ap-northeast-1.amazonaws.com/images/a975ce58-796d-4b7a-a8c7-e06368043c1c.png"
    },
    Curve:{
        title:"Curve",
        icon:"https://defigogo.s3-ap-northeast-1.amazonaws.com/images/9d9db459-8ae6-48e8-aee9-295d23211ed5.jpg"
    },
    FILDA:{
        title:"FILDA",
        icon:ImageToken.FILDA
    },
    Wepiggy:{
        title:"Wepiggy",
        icon:ImageToken.WEPIGGY
    }
}

export function tipError(e:any) {
    // message.error(e?.message)
}

export const ChainIdConfig:any = {
    eth:"0x1",
    bsc:BigNumber.from(56).toHexString(),
    heco:BigNumber.from(128).toHexString(),
    polygon:BigNumber.from(66).toHexString(),
}
export function switchNetwork(chainId:string) {
    return ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: chainId,
            }
        ]
    })
}

export function enableNetwork(chainId:number) {
    if(chainId===ChainId.arbitrum || chainId===ChainId.esc){
        return true
    }
    return false
}
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const MiningPool = ["CPUSDC","CPUSDT","CPWBTC","CPDAI"]
// export const MiningPool = ["CREDA"]
const rpcUrls = {
    // TODO: add others
    20: "https://api.elastos.io/esc",           // Elastos mainnet
    21: "https://api-testnet.elastos.io/eth",       // Elastos testnet
    128: "https://heconode.ifoobar.com",             // HECO mainnet
    [ChainId.arbitrum]:"https://arb1.arbitrum.io/rpc",        // Arbitrum
    56:"https://bsc-dataseed1.binance.org/",        // BSC
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
    chainId: ChainId.arbitrum,
    networkId: ChainId.arbitrum,
    qrcode:true,
    clientMeta: {
        name: "CREDA.app",
        description: "CREDA - A DeFi app powered by CREDA Team",
        url: "https://creda.app",
        icons: [
            "https://creda.app/favicon.ico"
        ]
    }
}
export const createWalletConnectWeb3Provider = async function() {

    //  Create WalletConnect Provider
    let provider = new WalletConnectProvider(walletConnect);

    return provider;
}

export const globalObj:any = global
export const globalObject:any = global


export function getNFTCardBgImage(type: string) {
  switch (type) {
      case '1': {
          return ImageCommon.NFT_LV1
          break
      }
      case '2': {
        return ImageCommon.NFT_LV2
        break
      }
      case '3': {
          return ImageCommon.NFT_LV3
          break
      }
      case '4': {
          return ImageCommon.NFT_LV4
          break
      }
      case '5': {
          return ImageCommon.NFT_LV5
          break
      }
      default:{
        return ImageCommon.NFT_LV1
        break
      }

  }
}
export function getRandom(num:number) {
    return Math.floor(Math.random()*num);
}


export const MyBankAssetPriceIcons = [
  {
    name:'USDC',
    icon:USDCIcon,
  },
  {
    name:'USDT',
    icon:USDTIcon,
  },

  // {
  //   name:'UNI',
  //   icon:UNIIcon,
  // },
  {
    name:'WBTC',
    icon:WBTCIcon,
  },
    {
        name:'DAI',
        icon:DAIIcon,
    },
    {
        name:'LINK',
        icon:ImageToken.LINK,
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
        name:'ELA',
        icon:ImageToken.ELA,
    },
    {
        name:'USDC',
        icon:USDCIcon,
    },
    {
        name:'FILDA',
        icon:ImageToken.FILDA,
    },
    {
        name:'GLIDE',
        icon:ImageToken.GLIDE,
    },
    {
      name:'ELK',
      icon:ImageToken.GLIDE,
    },
]
export const MyBankAssetFarmingIcon = [
  {
    name1:'ETH',
    icon1:ETHIcon,
    name2:'USDT',
    icon2:USDTIcon,
    linkUrl:'https://analytics-arbitrum.sushi.com/pairs/0xcb0e5bfa72bbb4d16ab5aa0c60601c438f04b4ad',
    Fee:51.49,
    APR:5.23,
    APY:(17.56+20.41) / 2,
    line_pre:51.49 + 5.23
  },
  {
    name1:'ETH',
    icon1:ETHIcon,
    name2:'USDC',
    icon2:USDCIcon,
    linkUrl:'https://analytics-arbitrum.sushi.com/pairs/0x905dfcd5649217c42684f23958568e533c711aa3',
    Fee:52.25,
    APR:0.64,
    APY:(17.56+9.69) / 2,
    line_pre:52.25 + 0.64
  },
  {
    name1:'ETH',
    icon1:ETHIcon,
    name2:'DAI',
    icon2:DAIIcon,
    linkUrl:'https://analytics-arbitrum.sushi.com/pairs/0x692a0b300366d1042679397e40f3d2cb4b8f7d30',
    Fee:32.67,
    APR:14.02,
    APY:(17.56+18.72) / 2,
    line_pre:32.67 + 14.02
  }
]
export function getPriceByApi(symbol:string): Promise<number>{
    return new Promise((resolve, reject) => {
        fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD`)
            .then((response)=>response.json())
            .then(res=>{
                resolve(res.RAW[symbol]["USD"].PRICE || 0)
            })
            .catch(err=>{
                console.log(err)
                resolve(0)
            })
    })

}
export function getPriceESC(symbol:string): Promise<any>{
  return new Promise((resolve, reject) => {
    const url = `https://api.glidefinance.io/subgraphs/name/glide/exchange`;
    const params ={
      "query": "\n" +
      "      query tokens {\n" +
      "        now: tokens(\n" +
      `      where: {id_in:${symbol}}\n` +
      "      \n" +
      "      orderBy: tradeVolumeUSD\n" +
      "      orderDirection: desc\n" +
      "    ) {\n" +
      "      id\n" +
      "      symbol\n" +
      "      name\n" +
      "      derivedELA\n" +
      "      derivedUSD\n" +
      "      tradeVolumeUSD\n" +
      "      totalTransactions\n" +
      "      totalLiquidity\n" +
      "    }\n" +
      "      }\n" +
      "    "
        }
    axios.post(url,params).then((res:any)=>{
          resolve(res.data.data.now)
        }).catch((e:any)=>{
          console.log('getPriceESC==',e);
          resolve(0)

        })
  })

}

export const GasInfo = {
    gasLimit:1000000
}
