import creditScore from '@assets/lottie/CreDa_creditScore_animation.json';
import styled from "styled-components";
import ImageCommon from "../../assets/common/ImageCommon";
import Column from "../../components/Column";
import Row, {
    CustomGrid,
    FontPoppins,
    GradientButton,
    RowBetween,
    RowCenter,
    RowFixed,
    SpaceHeight,
    SpaceWidth,
    TextEqure,
} from "../../components/Row";
import AppBody, { MainFullBody } from "../AppBody";

import { Lottie } from "@crello/react-lottie";
import { TransactionResponse } from "@ethersproject/providers";
import { Tooltip, message } from "antd";
import axios from "axios";
import copy from "copy-to-clipboard";
import { BigNumber } from "ethers";
import { FC, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import BNB from "../../assets/tokens/Binance Coin (BNB).png";
import ESC from "../../assets/tokens/ELA.png";
import ETH from "../../assets/tokens/Ethereum (ETH).png";

import {
    ApprovalState,
    ChainId,
    ChainIdConfig,
    ChainIds,
    GasInfo,
    balanceToBigNumber,
    chainFromId,
    enableNetwork,
    formatAccount,
    formatBalance,
    formatPercent,
    formatPositiveNumber,
    getNFTCardBgImage,
    switchNetwork,
    tipError
} from "../../common/Common";
import { BlueButton, CardPairOrigin, FlexView, ProfileLoading, WhiteButton } from "../../components/Common";
import ConnectToWalletModal from "../../components/ConnectToWalletModal";
import { H4 } from "../../components/ConnectWallet";
import CustomStakeModal from "../../components/CustomStakeModal";
import { ThemeText, ThemeTextEqure } from "../../components/ThemeComponent";
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";
import {
    useApprove,
    useBoxApproveList,
    useBoxProjectAll,
    useCNFTInfo,
    useCreditInfo,
    useCreditScore,
    useDefiBoxWalletInfo,
} from "../../contract";
import ContractConfig from "../../contract/ContractConfig";
import { useContract, useTokenContract } from "../../hooks/useContract";
import { LoadingContext, LoadingType } from "../../provider/LoadingProvider";
import { useOpenWarnning, useTheme, useWalkThroughStep, } from "../../state/application/hooks";
import { ToastStatus, useAddToast } from "../../state/toast";
import { useTransactionAdder } from "../../state/transactions/hooks";

const Parenter_icon_3 = styled.img`
  width: 130px;
  height: auto;
  @media (max-width: 768px) {
    width: 40px;
  }
`;
const Body = styled(Column)`
  width: 100%;
  height: 100%;
  padding: 0px 15px;
`;
const CopyIcon = styled.img`
  width: 14px;
  height: 13px;
  @media (max-width: 768px) {
    margin-left: 10px;
    margin-top: 5px;
  }
  margin-left: 20px;
  margin-top: 10px;
`;

const AddressText = styled(TextEqure)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ;
  -webkit-box-orient: vertical;
  margin-top: 10px;
  width: fit-content;
  @media (max-width: 768px) {
    margin-top: 5px;
    width: 100px;
  };
`;
const ColorDiv = styled(Column)`
  width: 314px;
  height: 177px;
  border-radius: 24px;
  background-color: #4e55ff;
  padding: 30px;
  padding-bottom: 0px;
  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
    border-radius: 12px;
    margin-bottom: 15px;
    border: 1px solid #363739;
    padding: 20px;
    height: 160px;
  }
  position: relative;
`;
const ColorDivNoBorder = styled(ColorDiv)`
  @media (max-width: 768px) {
    border: 0px solid #363739;
  }
`;
const NFTBgImage = styled.img`
  position: absolute;
  width: 314px;
  height: 177px;
  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
    // height:160px;
  }
  top: 0px;
  left: 0px;
`;
const GreenDiv = styled(RowCenter)`
  height: 24px;
  border-radius: 12px;
  background-color: #58bc7c;
  align-items: center;
  width: fit-content;
  margin-left: 10px;
  padding: 10px;
  @media (max-width: 768px) {
    margin-left: 5px;
    padding: 5px;
  }
`;
const TopItemDiv = styled(RowBetween)`
  @media (max-width: 768px) {
    flex-direction: column;
  };
`;
const SegmentDiv = styled(RowFixed)`
  background-color: #17181a;
  height: 40px;
  border-radius: 20px;
  width: 414px;
  margin: 40px 0px;
  overflow: hidden;
  @media (max-width: 768px) {
    flex: 1;
    // width:100%;
    margin: 15px 15px;
  };
`;
const SegmentItem = styled(RowCenter) <{
    isChoose?: boolean;
}>`
  width: 338px;
  background: ${({ isChoose }) =>
        isChoose ? "linear-gradient(90deg, #4a1ee1, #1890ff)" : "transparent"};
  height: 100%;
  color: ${({ isChoose }) => (isChoose ? "white" : "#777E90")};
  align-items: center;
  border-radius: 20px;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 17px;
    flex: 1;
  };
`;
const WrapDiv = styled(RowBetween)`
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex: 1;
    // width:100%;
    margin: 0px 15px;
  }
  justify-content: flex-start;
`;
const WrapItem = styled(RowCenter) <{
    selected?: boolean;
    disabled?: boolean;
    themeDark?: boolean | null;
}>`
  background: ${({ themeDark }) => (themeDark ? "#17181a" : "#FFF")};
  font-size: 16px;
  font-weight: bold;
  align-items: center;
  width: 142px;
  cursor: pointer;
  color: ${({ themeDark }) => (themeDark ? "#FFF" : "#17181a")};
  height: 40px;
  border-radius: 20px;
  margin-right: 20px;
  margin-bottom: 18px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
    // pointer-events:${({ disabled }) => (disabled ? "none" : "auto")};
  &.active {
    background: linear-gradient(90deg, #4a1ee1, #1890ff);
    color: #fff;
  }

  &:hover {
    background: linear-gradient(90deg, #33b8ff, #33d4ff);
    color: #fff;
  }

  &:focus {
    background: linear-gradient(90deg, #3a0080, #4a29ff);
    color: #00ffff;
  }

  @media (max-width: 768px) {
    width: fit-content;
    padding: 5px 10px;
    background: ${({ themeDark }) => (themeDark ? "#17181a" : "#FFF")};

    border-bottom: ${({ selected: isChoose }) =>
        isChoose ? "1px solid #4E55FF" : "none"};
    border-radius: 10px;
    margin-right: 10px;
    font-size: 14px;
    color: ${({ selected: isChoose }) => (isChoose ? "#4E55FF" : "#777E90")};
  };
`;

const StepTwoModalWrap = styled.div<{
    isMobile: boolean | null;
}>`
  .walk-through-modal-wrapper {
    top: ${({ isMobile }) => (isMobile ? "337px" : "124px")};
    left: ${({ isMobile }) => (isMobile ? "48%" : "50%")};
    @media (min-width: 768px) and (max-width: 1700px) {
      top: 336px;
      left: 25%;
    }
    @media (min-width: 1700px) {
      top: 337px;
      left: 25%;
    }
  }
`;

const StepThreeModalWrap = styled.div<{
    isMobile: boolean | null;
}>`
  .walk-through-modal-wrapper {
    top: ${({ isMobile }) => (isMobile ? "124px" : "124px")};
    left: -57%;
    @media (min-width: 768px) and (max-width: 1700px) {
      top: 127px;
      left: 50%;
    }
    @media (min-width: 1700px) {
      top: 145px;
      left: 50%;
    }
  }
`;

const StepFourthModalWrap = styled.div<{
    isMobile: boolean | null;
}>`
  .walk-through-modal-wrapper {
    top: ${({ isMobile }) => (isMobile ? "171px" : "124px")};
    left: 124px;
    @media (min-width: 768px) and (max-width: 1700px) {
      top: 172px;
      left: 21%;
    }
    @media (min-width: 1700px) {
      top: 175px;
      left: 23%;
    }
  }
`;

const BGDiv = styled(Column)`
  background-color: #17181a;
  border-radius: 24px;
  padding: 23px 28px;
  margin: 20px 0px;
  width: 100%;
  @media (max-width: 768px) {
    border: 1px solid #363739;
    padding: 10px;
    margin: 10px 0px;
    border-radius: 12px;
  }
`;
const IconIcon = styled.img`
  width: 45px;
  height: auto;
  margin-right: 15px;
  // background-color:#353945;
`;
const IconIconBlue = styled.div`
  width: 46px;
  height: 46px;
  margin-right: 15px;
  border-radius: 23px;
  background-color: #4e55ff;
`;
const SmallIconIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  // background-color:#353945;
  border-radius: 15px;
`;
const LineV = styled.div<{
    width?: number;
}>`
  height: 50px;
  background-color: #2e313a;
  width: 1px;
  margin: ${({ width }) => (width ? `0px  ${width}px` : " 0px  30px")};
`;
const LineH = styled.div<{
    height?: number;
}>`
  height: 1px;
  background-color: #2e313a;
  width: 100%;
  margin: ${({ height }) => (height ? `${height}px 0px` : "30px 0px")};
`;
const LineHNor = styled.div`
  height: 1px;
  background-color: #2e313a;
  width: 100%;
`;
const CenterItemDiv = styled(RowFixed)`
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  };
`;
const SearchDiv = styled(RowFixed)`
  width: 256px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #22252d;
  margin-right: 30px;
`;
const InputDiv = styled.input`
  font-size: 16px;
  flex: 1;
  height: 30px;
  outline: none;
  border: none;
  font-weight: 500;
  width: 100%;
  margin-left: 10px;
  background-color: transparent;
  color: white;
`;
const SearchIcon = styled.img`
  width: 18px;
  height: auto;
  margin-right: 10px;
`;
const MoreIcon = styled.img`
  width: 24px;
  height: auto;
`;
const PortfolioTopBg = styled(RowCenter)`
  align-items: center;
  justify-content: flex-start;
  width: 150px;
  height: 22px;
  background-image: url(${ImageCommon.portfolio_item_bgimage});
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: white;
  font-size: 22px;
  padding-left: 50px;
  margin-left: -28px;
  @media (max-width: 768px) {
    width: 100px;
    height: 15px;
    font-size: 11px;
    padding-left: 25px;
    margin-left: 0px;
  }
`;
const Arrow = styled.img`
  width: 6px;
  height: 4px;
  margin-left: 10px;
`;

/**
 * Mapping between chain index in the UI vs chain id
 */
const chainIndexToId: ChainId[] = [
    ChainIds.ethereum, // "Ethereum",
    ChainIds.bsc, // "BSC",
    ChainIds.esc, // "Elastos ESC",
    ChainIds.celo, // "CELO",
    ChainIds.heco, // "HECO",
    ChainIds.polygon, // "Polygon",
    ChainIds.arbitrum // "Arbitrum",
];

const chainTitles: { [chainId: ChainId]: string } = {
    [ChainIds.ethereum]: "Ethereum",
    [ChainIds.bsc]: "BSC",
    [ChainIds.esc]: "Elastos ESC",
    [ChainIds.celo]: "CELO",
    [ChainIds.heco]: "HECO",
    [ChainIds.polygon]: "Polygon",
    [ChainIds.arbitrum]: "Arbitrum"
};

const ChainType: any = {
    Ethereum: "eth",
    HECO: "heco",
    Polygon: "polygon",
    BSC: "bsc",
    CELO: 'celo',
    "Elastos ESC": "esc"
};

export const ChainType2Id: any = {
    "eth": 1,
    "heco": 128,
    "polygon": 137,
    "bsc": 56,
    "esc": 20,
    "celo": 42220,
};

export const ProjectConfig: any = {
    basisdollar: {
        title1: "Balance",
        key1: "farmingPools",
        title2: "Liquidity",
        key2: "sharePools",
        tokensKey1: "collateralTokens",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimToken",
    },
    curve: {
        title1: "Farm",
        key1: "farmingPools",
        title2: "Liquidity",
        key2: "liquidityPools",
        tokensKey1: "stakedList",
        tokensKey2: "stakedList",
        unclaimKey: "rewardList",
    },
    yfii: {
        title1: "抵押",
        key1: "staking",
        title2: "Farm",
        key2: "liquidities",
        tokensKey1: "token",
        tokensKey2: "tokens",
        unclaimKey: "rewardToken",
    },
    cream: {
        title1: "Liquidity",
        key1: "liquidityPairInfos",
        tokensKey1: "collateralTokens",
        title2: "Farm",
        key2: "farmingPairInfos",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimToken",
    },
    harvest: {
        title1: "Farm",
        key1: "stakePairInfos",
        tokensKey1: "collateralTokens",
        title2: "Vault",
        key2: "vaultPairInfos",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimToken",
    },
    keeperdao: {
        title1: "Liquidity",
        key1: "pools",
        tokensKey1: "token",
        title2: "Farm",
        unclaimKey: "unclaimToken",
    },
    sushiswap: {
        title1: "Farm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        title2: "Liquidity",
        key2: "liquidityPools",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    badger: {
        title1: "Liquidity",
        key1: "settPairInfos",
        tokensKey1: "collateralTokens",
        title2: "Farm",
        key2: "stakePairInfos",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimToken",
    },
    mooniswap: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "collateralTokens",
        title2: "Farm",
        unclaimKey: "unclaimTokens",
    },
    mithcash: {
        title1: "Liquidity",
        key1: "pools",
        tokensKey1: "tokens",
        title2: "Boardroom",
        // key2:"boardroom",
        // tokensKey2:"token",
        unclaimKey: "reward",
    },
    dodo: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "pairToken",
        title2: "Farm",
        key2: "farmingPools",
        tokensKey2: "pairToken",
        unclaimKey: "unclaimToken",
    },
    hegic: {
        title1: "Farm",
        key1: "stakingInfos",
        tokensKey1: "token",
        title2: "Balance",
        key2: "options",
        tokensKey2: "token",
        unclaimKey: "rewardToken",
    },
    uniswapv2: {
        title1: "UNIFarm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        title2: "V2",
        key2: "liquidityPools",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    powerindex: {
        title1: "Balance",
        key1: "pools",
        tokensKey1: "tokens",
        title2: "Liquidity",
        unclaimKey: "unclaimToken",
    },
    dusd: {
        title1: "Balance",
        // key1:"saving",
        // tokensKey1:"token",
        title2: "Farm",
        key2: "pools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    barnbridge: {
        title1: "Balance",
        key1: "assets",
        tokensKey1: "token",
        title2: "Farm",
        key2: "pools",
        tokensKey2: "tokens",
        unclaimKey: "potentialReward",
    },
    bancor: {
        title1: "Liquidity",
        key1: "assets",
        tokensKey1: "tokens",
        title2: "protection",
        key2: "protection",
        tokensKey2: "tokens",
        unclaimKey: "potentialReward",
    },
    wepiggy: {
        title1: "Farm",
        key1: "pools",
        tokensKey1: "token",
        // title2:"protection",
        // key2:"protection",
        // tokensKey2:"tokens",
        unclaimKey: "reward",
    },
    balancer: {
        title1: "Liquidity",
        key1: "pools",
        tokensKey1: "tokens",
        title2: "protection",
        // key2:"protection",
        // tokensKey2:"tokens",
        unclaimKey: "reward",
    },
    dforce: {
        title1: "Uniswap",
        key1: "stakingPools",
        tokensKey1: "tokens",
        title2: "protection",
        // key2:"protection",
        // tokensKey2:"tokens",
        unclaimKey: "reward",
    },
    frax: {
        title1: "Balance",
        key1: "pools",
        tokensKey1: "tokens",
        title2: "protection",
        // key2:"protection",
        // tokensKey2:"tokens",
        unclaimKey: "reward",
    },
    pandayield: {
        title1: "Liquidity",
        key1: "pairs",
        tokensKey1: "tokens",
        title2: "Liquidity",
        key2: "liquidityPools",
        tokensKey2: "tokens",
        unclaimKey: "rewardToken",
    },
    alpaca: {
        title1: "Farm",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    pancake: {
        title1: "Liquidity_V1",
        key1: "pairs",
        tokensKey1: "tokens",
        title2: "Liquidity",
        key2: "liquidityPools",
        tokensKey2: "tokens",
        unclaimKey: "rewardToken",
    },
    autofarmheco: {
        title1: "Liquidity",
        key1: "pools",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    goose: {
        title1: "Deposit",
        key1: "singlePools",
        tokensKey1: "tokens",
        title2: "Farm",
        key2: "liquidityPools",
        tokensKey2: "tokens",
        unclaimKey: "rewardToken",
    },
    bakeryswap: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    viking: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        title2: "Farm",
        key2: "pairs",
        tokensKey2: "tokens",
        unclaimKey: "rewardToken",
    },
    ellipsis: {
        title1: "Farm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    ramenswap: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        title2: "Liquidity",
        key2: "farmPools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    rabbit: {
        title1: "Farm",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    bunny: {
        title1: "Farm",
        key1: "item",
        tokensKey1: "token",
        unclaimKey: "reward",
    },
    stormswap: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        title2: "Liquidity",
        key2: "farmPools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    venus: {
        title1: "Farm",
        key1: "pools",
        tokensKey1: "token",
        unclaimKey: "reward",
    },
    pureswap: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        title2: "Liquidity",
        key2: "farmPools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    julswap: {
        title1: "Farm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    belt: {
        title1: "Farm",
        key1: "pools",
        tokensKey1: "tokens",
        unclaimKey: "rewardToken",
    },
    valuedefi: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        unclaimKey: "rewardToken",
    },
    ubu: {
        title1: "Farm",
        key1: "farmPools",
        tokensKey1: "tokens",
        title2: "UBANK",
        key2: "bankPools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    "1inch": {
        title1: "Farm",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        unclaimKey: "rewardToken",
    },
    btcst: {
        title1: "Farm",
        key1: "pools",
        tokensKey1: "tokens",
        unclaimKey: "rewardToken",
    },
    apeswap: {
        title1: "Liquidity",
        key1: "farmPools",
        tokensKey1: "farmTokens",
        unclaimKey: "rewardToken",
    },
    babyswap: {
        title1: "Liquidity",
        key1: "farmPools",
        tokensKey1: "farmTokens",
        unclaimKey: "rewardToken",
    },
    wault: {
        title1: "Liquidity",
        key1: "farmPools",
        tokensKey1: "farmTokens",
        title2: "Farm",
        key2: "stakePools",
        tokensKey2: "stakeToken",
        unclaimKey: "rewardToken",
    },
    definix: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "liquidityTokens",
        title2: "Liquidity",
        key2: "farmPools",
        tokensKey2: "farmTokens",
        unclaimKey: "rewardToken",
    },
    alitaswap: {
        title1: "Liquidity",
        key1: "farmPools",
        tokensKey1: "farmTokens",
        unclaimKey: "rewardToken",
    },
    pantherswap: {
        title1: "Liquidity",
        key1: "farmPools",
        tokensKey1: "farmTokens",
        unclaimKey: "rewardToken",
    },
    biswap: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        title2: "Liquidity",
        key2: "farmPools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    warden: {
        title1: "Liquidity",
        key1: "farmPools",
        tokensKey1: "farmTokens",
        unclaimKey: "rewardToken",
    },
    nerve: {
        title1: "Liquidity",
        key1: "farmPools",
        tokensKey1: "farmTokens",
        unclaimKey: "rewardToken",
    },
    bdollar: {
        title1: "Farm",
        key1: "sharePools",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    mozert: {
        title1: "Farm",
        key1: "singlePools",
        tokensKey1: "tokens",
        unclaimKey: "rewardToken",
    },
    kimochi: {
        title1: "Deposit",
        key1: "liquidityPools",
        tokensKey1: "token",
        unclaimKey: "rewardToken",
    },
    supernova: {
        title1: "Bank",
        key1: "bankPools",
        tokensKey1: "tokens",
        title2: "Boardroom",
        key2: "daoPools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    earndefi: {
        title1: "Deposit",
        key1: "pledges",
        tokensKey1: "tokens",
        title2: "Vault",
        key2: "smarts",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    bxh: {
        title1: "Farm",
        key1: "liquidityPools",
        tokensKey1: "tokens",
        title2: "DAO",
        key2: "boardPools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    mdex: {
        title1: "Liquidity",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        title2: "Liquidity",
        key2: "liquidityPools",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    filda: {
        title1: "Farm",
        key1: "stakings",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    hfi: {
        title1: "Deposit",
        key1: "stakingPools",
        tokensKey1: "tokens",
        title2: "Vault",
        key2: "vaultPools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    converter: {
        title1: "Deposit",
        key1: "vaultPools",
        tokensKey1: "tokens",
        title2: "Farm",
        key2: "liquidityPools",
        tokensKey2: "tokens",
        unclaimKey: "reward",
    },
    coinwind: {
        title1: "Farm_V1",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        title2: "Farm",
        key2: "farmingPools",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    newland: {
        title1: "Liquidity",
        key1: "pools",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    channels: {
        title1: "Liquidity",
        key1: "stakings",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    arkswap: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    lavaswap: {
        title1: "Farm_V1",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        title2: "Liquidity",
        key2: "liquidityPools",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    basisgold: {
        title1: "Liquidity",
        key1: "pools",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    pippi: {
        title1: "Farm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        title2: "Liquidity",
        key2: "liquidityPools",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    lilithcash: {
        title1: "Farm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    circleswap: {
        title1: "Liquidity",
        key1: "pools",
        tokensKey1: "tokens",
        title2: "Liquidity",
        key2: "miningPools",
        tokensKey2: "deposit",
        unclaimKey: "reward",
    },
    nftstk: {
        title1: "Farm",
        key1: "commonPool",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    starlink: {
        title1: "Farm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    lendhub: {
        title1: "Farm",
        key1: "pools",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    depth: {
        title1: "Farm",
        key1: "pools",
        tokensKey1: "tokens",
        unclaimKey: "reward",
    },
    htmoon: {
        title1: "Liquidity",
        key1: "liquidityPools",
        tokensKey1: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    pilot: {
        title1: "DAO",
        key1: "daoPools",
        tokensKey1: "tokens",
        unclaimKey: "rewardToken",
    },
    nfthero: {
        title1: "Farm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    hbo: {
        title1: "Farm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    hsswap: {
        title1: "Farm",
        key1: "liquidityPools",
        tokensKey1: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    qidao: {
        title1: "Farm",
        key1: "farmingInfoList",
        tokensKey1: "supplyTokenList",
        unclaimKey: "rewardTokenList",
    },
    curvev3: {
        title1: "Liquidity",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        title2: "UNIFarm",
        key2: "liquidityPools",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    dfyn: {
        title1: "Farm",
        key1: "farmingPools",
        tokensKey1: "collateralTokens",
        title2: "Liquidity",
        key2: "liquidityPools",
        tokensKey2: "collateralTokens",
        unclaimKey: "unclaimTokens",
    },
    balancerv2: {
        title1: "Liquidity",
        key1: "liquidityInfoList",
        tokensKey1: "supplyTokenList",
        unclaimKey: "rewardTokenList",
    },
};

enum StakeType {
    hidden = 0,
    mint = 1,
    upgrade = 2,
}

function Profile(props: any) {
    const [connectToModal, setConnectToModal] = useState(false);
    const [stopAnimation, setStopAnimation] = useState(false)
    const { account, isaccountLoading } = useContext(WalletAddressContext);
    const { chainId } = useContext(NetworkTypeContext);
    const network = chainFromId(chainId);
    const [chainIndex, setChainIndex] = useState(0);
    const [segmentIndex, setSegmentIndex] = useState(0);
    const walletList = useDefiBoxWalletInfo(chainIndexToId[chainIndex]);
    const walletListEth = useDefiBoxWalletInfo(chainIndexToId[0]);
    const walletListBsc = useDefiBoxWalletInfo(chainIndexToId[1]);
    const walletListEsc = useDefiBoxWalletInfo(chainIndexToId[2]);
    const showWarning = useOpenWarnning(true);
    const creditInfo = useCreditInfo();
    const scoreInfo = useCreditScore()
    const addTransaction = useTransactionAdder();
    const addToast = useAddToast();
    const loading = useContext(LoadingContext)
    const themeDark = useTheme();

    // Contracts
    const CredaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi)
    const APIContract = useContract(
        ContractConfig.APIConsumer[network]?.address,
        ContractConfig.APIConsumer.abi
    );
    const CNFTContract = useContract(
        ContractConfig.CreditNFT[network]?.address,
        ContractConfig.CreditNFT[network]?.abi || ContractConfig.CreditNFT.abi
    );
    const [approval, approveCallback] = useApprove(
        ContractConfig.CREDA[network]?.address,
        ContractConfig.CreditNFT[network]?.address
    );

    //stakemodal
    const [modalType, setModalType] = useState(StakeType.hidden);
    const cnftInfo = useCNFTInfo();
    const walkThroughStep = useWalkThroughStep();

    useEffect(() => {
        // if(props.location.props==='fromConnectWallet'){
        //   console.log("if")
        // }else{
        //   console.log("else")
        //   if(!account){
        //     if(!isaccountLoading){
        //     globalObject && globalObject?.showConnectToModal()
        //     }
        //   }
        // }
        setConnectToModal(true);
    }, []);

    useEffect(() => {
        showWarning();
    }, [showWarning]);

    useEffect(() => {
        setTimeout(() => {
            setStopAnimation(true)
        }, 1800);
    }, [stopAnimation])

    function approve() {
        loading.show(LoadingType.confirm, `Sync`)
        // console.log("CredaC_func", CredaContract?.creditUpdate())
        CredaContract?.creditUpdate(GasInfo)
            .then(async (response: TransactionResponse) => {
                addTransaction(response, {
                    summary: "Sync",
                });
                await response.wait();
                loading.show(LoadingType.success, response.hash)

            })
            .catch((err: any) => {
                addToast(ToastStatus.error, err.data?.message);
                tipError(err);
                loading.show(LoadingType.error, err.reason || err.message)
            });
    }

    function claim() {
        CredaContract?.claim()
            .then(async (response: TransactionResponse) => {
                addTransaction(response, {
                    summary: "Claim",
                });
                await response.wait();
            })
            .catch((err: any) => {
                addToast(ToastStatus.error, err.data?.message);
                tipError(err);
            });
    }

    function changChainIndex(index: number) {
        setChainIndex(index);
    }

    function onSegmentSelect(index: number) {
        setSegmentIndex(index);
    }

    function bindDID(did: string) {
        // console.log(APIContract);
        APIContract?.bindAddress(did)
            .then(async (response: TransactionResponse) => {
                addTransaction(response, {
                    summary: "Bind DID",
                });
                await response.wait();
            })
            .catch((err: any) => {
                addToast(ToastStatus.error, err.data?.message);
                tipError(err);
            });
    }

    function mintCNFT() {
        // console.log("CNFTContract?.mintNFT()", CNFTContract?.mintNFT())
        if (approval !== ApprovalState.APPROVED && enableNetwork(chainId)) {
            approveCallback();
            return;
        }
        loading.show(LoadingType.confirm, "Mint NFT")
        CNFTContract?.mintNFT()
            .then(async (response: TransactionResponse) => {
                // console.log("CNFTContract?.mintNFT()_ay")
                // addTransaction(response, {
                //     summary: "Mint NFT",
                // });
                loading.show(LoadingType.pending, response.hash)
                await response.wait();
                loading.show(LoadingType.success, response.hash)
            })
            .catch((err: any) => {
                // addToast(ToastStatus.error, err.data?.message);
                loading.show(LoadingType.error, err.reason || err.message)
                tipError(err);
            });
    }

    function onUpgrade(amount: string) {
        if (approval !== ApprovalState.APPROVED) {
            approveCallback();
            return;
        }
        CNFTContract?.updateNFTAmount(cnftInfo.no, balanceToBigNumber(amount))
            .then(async (response: TransactionResponse) => {
                addTransaction(response, {
                    summary: "Upgrade",
                });
                await response.wait();
            })
            .catch((err: any) => {
                addToast(ToastStatus.error, err.data?.message);
                tipError(err);
            });
    }

    // console.log("first",walkThroughStep)
    return (
        <MainFullBody history={props.history}>
            {
                props.location.props !== "fromConnectWallet" ? (
                    <>
                        {!account && !account ? (
                            <>
                                {isaccountLoading ? (
                                    ""
                                ) : (
                                    <>
                                        {!account && !account ? (
                                            <>
                                                {isaccountLoading ? (
                                                    ""
                                                ) : (
                                                    <>
                                                        {walkThroughStep !== 5 && walkThroughStep !== 1 ? (
                                                            ""
                                                        ) : (
                                                            <ConnectToWalletModal
                                                                show={connectToModal}
                                                                onDismiss={() => setConnectToModal(false)}
                                                            />)
                                                        }
                                                    </>)
                                                }
                                            </>) : <></>

                                        }
                                    </>
                                )}
                            </>
                        ) : (
                            ""
                        )}
                    </>
                ) : (
                    ""
                )
            }
            <AppBody history={props.history}>
                <Body>
                    <RowBetween
                        style={{
                            paddingLeft: isMobile ? 15 : 30,
                            paddingBottom: isMobile ? 20 : 40,
                        }}
                    >
                        <FlexView>
                            <ThemeTextEqure fontSize={32} fontWeight={"bold"}>
                                Profile
                            </ThemeTextEqure>
                            <SpaceWidth width={30} widthApp={15} />
                            {creditInfo.did ? (
                                <CopyAccount
                                    account={
                                        creditInfo.did.length >= 32
                                            ? formatAccount(creditInfo.did)
                                            : creditInfo.did.slice(
                                                creditInfo.did.lastIndexOf(":") + 1
                                            )
                                    }
                                    originAccount={
                                        creditInfo.did.length >= 32
                                            ? creditInfo.did
                                            : creditInfo.did.slice(
                                                creditInfo.did.lastIndexOf(":") + 1
                                            )
                                    }
                                ></CopyAccount>
                            ) : (
                                <BindInput bindDID={bindDID}></BindInput>
                            )}
                        </FlexView>
                        <CustomGrid
                            style={{ marginRight: "unset", textAlign: "right" }}
                            templateColumns={"1fr 1fr"}
                            mobTemplateColumns={"1fr 1fr"}
                            columnGap={15}
                            mobColumnGap={15}
                        >
                            {!isMobile && <FontPoppins>
                                <ThemeText fontSize={22} style={{ fontWeight: 800 }}>
                                    Network
                                </ThemeText>
                            </FontPoppins>}
                            <GradientButton
                                className="network_title"
                                style={{
                                    width: !isMobile ? 162 : "fit-content",
                                    textTransform: "capitalize",
                                }}
                            >
                                <H4>{network.toUpperCase()}</H4>
                            </GradientButton>
                        </CustomGrid>
                    </RowBetween>
                    <section style={{ position: "relative" }}>
                        <TopItemDiv
                            style={{
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                flexDirection: "column",
                                flex: "1",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        position: "absolute",
                                        zIndex: walkThroughStep === 2 ? 700 : 0,
                                        left: isMobile ? "9%" : "50%",
                                        transform: isMobile
                                            ? "translate(-17%,-5px)"
                                            : "translate(-96%,-82px)",
                                    }}
                                >
                                    <Lottie
                                        playingState={stopAnimation ? 'paused' : 'playing'}
                                        config={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: creditScore,
                                            rendererSettings: {
                                                preserveAspectRatio: 'xMidYMid slice',
                                            }
                                        }}
                                        width={isMobile ? "416px" : "534px"}
                                        height={"auto"} />
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: isMobile ? "167px" : "227px",
                                            left: isMobile ? "180px" : "231px",
                                        }}
                                    >
                                        <TextEqure
                                            fontColor={themeDark ? "white" : "black"}
                                            fontSize={40}
                                            fontWeight={"bold"}
                                        >
                                            {scoreInfo.data <= 0
                                                ? "---"
                                                : formatBalance(scoreInfo.data, 0)}
                                        </TextEqure>
                                        <div></div>
                                        {scoreInfo.data > 0 && <TextEqure
                                            fontColor={themeDark ? "white" : "black"}
                                            fontSize={20}
                                            style={{ marginLeft: isMobile ? "-30px" : "-25px" }}
                                        // fontWeight={"bold"}
                                        >
                                            Credit Score
                                        </TextEqure>}

                                    </div>

                                    {chainId === ChainIds.esc && <div>
                                        {scoreInfo.data <= 0 && (
                                            <div style={{ position: "relative" }}>

                                                <WhiteButton
                                                    style={{
                                                        position: "absolute",
                                                        top: isMobile ? "-195px" : "-249px",
                                                        left: isMobile ? "175px" : "217px",
                                                        zIndex: walkThroughStep === 2 ? 700 : 0,
                                                    }}
                                                    onClick={approve}
                                                >
                                                    Sync
                                                </WhiteButton>
                                            </div>)}
                                    </div>}
                                </div>
                                {/* <StepTwoModalWrap isMobile={isMobile}>
                  <WalkThroughModal
                    currentStep={2}
                    title="Step 2"
                    steps={scoreInfo.data?false:true}
                    content="Click 'Sync' to get your Crypto Credit Score."
                  />
                </StepTwoModalWrap> */}
                            </div>

                            <ColorDivNoBorder
                                style={{
                                    backgroundColor: "transparent",
                                    marginTop: isMobile ? "393px" : "",
                                    marginRight: !isMobile ? "137px" : "",
                                }}
                            >
                                <NFTBgImage src={getNFTCardBgImage(cnftInfo.lv)} />
                                <Column style={{ zIndex: 1 }}>
                                    <TextEqure fontSize={18}>
                                        Credit NFT {enableNetwork(chainId) ? (`CREDA:
                                                                                    ${cnftInfo.loading ? "-" : formatBalance(cnftInfo.amount, 2)}
                                    `) : ""}
                                        {/* <Tooltip
                      color="#3e3b3b"
                      placement="right"
                      title={"Lorem Ipsum"}
                    >
                      <img
                        style={{ height: "16px", marginLeft: "5px" }}
                        src={ImageCommon.ExclamtionLight}
                      ></img>
                    </Tooltip> */}
                                    </TextEqure>
                                    <SpaceHeight height={20} heightApp={10} />
                                    <RowBetween>
                                        <FlexView>
                                            <TextEqure fontSize={12}>Level</TextEqure>
                                            <ThemeTextEqure
                                                style={{ marginLeft: 20, color: "#FFF" }}
                                                fontSize={24}
                                                fontWeight={"bold"}
                                            >
                                                {cnftInfo.loading ? "-" : cnftInfo.lv}
                                            </ThemeTextEqure>
                                        </FlexView>
                                        {cnftInfo.no <= 0 && (
                                            <div style={{ position: "relative" }}>
                                                <GradientButton
                                                    style={{ zIndex: walkThroughStep === 3 ? 700 : 0 }}
                                                    onClick={mintCNFT}
                                                >
                                                    {enableNetwork(chainId) ? (approval === ApprovalState.APPROVED
                                                        ? "Mint"
                                                        : "Approve") : "Mint"}
                                                </GradientButton>
                                                {/* <StepThreeModalWrap isMobile={isMobile}>
                          <WalkThroughModal
                            title="Step 3"
                            currentStep={3}
                            steps={false}
                            content="Here is where it shows your total assets in your wallet."
                          />
                        </StepThreeModalWrap> */}
                                            </div>
                                        )}
                                    </RowBetween>
                                    <RowBetween>
                                        <FlexView>
                                            <TextEqure fontSize={12}>NO.</TextEqure>
                                            <ThemeTextEqure
                                                style={{ marginLeft: 20, color: "#FFF" }}
                                                fontSize={24}
                                                fontWeight={"bold"}
                                            >
                                                {cnftInfo.loading ? "-" : cnftInfo.no}
                                            </ThemeTextEqure>
                                        </FlexView>
                                        {cnftInfo.no > 0 && (
                                            <BlueButton
                                                onClick={() => setModalType(StakeType.upgrade)}
                                            >
                                                Upgrade
                                            </BlueButton>
                                        )}
                                    </RowBetween>
                                    <TextEqure fontSize={18} fontWeight={"bold"}>
                                        &nbsp;
                                    </TextEqure>
                                </Column>
                            </ColorDivNoBorder>

                            <ColorDiv
                                style={{
                                    backgroundColor: themeDark ? "#17181A" : "white",
                                    marginTop: "15px",
                                    marginRight: !isMobile ? "137px" : "",
                                }}
                            >
                                <RowFixed
                                    style={{
                                        width: "100%",
                                        justifyContent: isMobile ? "space-between" : "flex-start",
                                    }}
                                >
                                    <TextEqure fontColor={"#BBBDFF"} fontSize={18}>
                                        Total Value of Assets (USD)
                                        {/* <Tooltip
                      color="#3e3b3b"
                      placement="right"
                      title={"Lorem Ipsum"}
                    >
                      <img
                        style={{ height: "16px", marginLeft: "5px" }}
                        src={
                          themeDark
                            ? ImageCommon.ExclamtionLight
                            : ImageCommon.ExclamtionDark
                        }
                      ></img>
                    </Tooltip> */}
                                        {/* <StepFourthModalWrap style={{fontSize:'14px'}} isMobile={isMobile}>
                          <WalkThroughModal
                            title="Step 4"
                            currentStep={4}
                            steps={false}
                            content="Now your can make the most out of the platform."
                          />
                        </StepFourthModalWrap> */}
                                    </TextEqure>
                                    {/*<GreenDiv>*/}
                                    {/*  <TextEqure fontSize={12}>+0.79%</TextEqure>*/}
                                    {/*</GreenDiv>*/}
                                </RowFixed>
                                <ThemeTextEqure fontSize={40} fontWeight={"bold"}>
                                    $
                                    {formatBalance(
                                        walletListEth.data?.total +
                                        walletListBsc.data?.total +
                                        walletListEsc.data?.total,
                                        2
                                    )}
                                </ThemeTextEqure>
                                <TextEqure
                                    fontColor={"#777E90"}
                                    fontSize={18}
                                    fontWeight={"bold"}
                                >
                                    &nbsp;
                                </TextEqure>
                            </ColorDiv>
                        </TopItemDiv>
                    </section>

                    <RowCenter>
                        <Segment onSegmentSelect={onSegmentSelect} />
                    </RowCenter>
                    {segmentIndex === 0 ? (
                        <>
                            <Wrap
                                onIndexChange={changChainIndex}
                                selectIndex={chainIndex}
                            ></Wrap>
                            <BGDiv
                                style={{
                                    backgroundColor: themeDark ? "#17181A" : "white",
                                }}
                            >
                                <ThemeTextEqure fontSize={28} fontWeight={"bold"}>
                                    Asset Overview
                                </ThemeTextEqure>
                                <SpaceHeight height={36} heightApp={18} />
                                <CenterItemDiv>
                                    <RowFixed
                                        style={
                                            isMobile
                                                ? { width: "100%", justifyContent: "space-between" }
                                                : {}
                                        }
                                    >
                                        <RowFixed>
                                            <IconIcon src={ETH} />
                                            <Column>
                                                <TextEqure fontColor={"#777E90"} fontSize={16}>
                                                    Assets on Ethereum
                                                </TextEqure>
                                                <RowFixed>
                                                    <ThemeTextEqure fontWeight={"bold"} fontSize={30}>
                                                        ${formatBalance(walletListEth.data.total)}
                                                    </ThemeTextEqure>
                                                    {/*<TextEqure style={{marginTop:10,marginLeft:10}} fontColor={'#4E55FF'} fontSize={12}>10%</TextEqure>*/}
                                                </RowFixed>
                                            </Column>
                                        </RowFixed>
                                        {isMobile && <MoreIcon src={ImageCommon.icon_more_icon} />}
                                    </RowFixed>
                                    {isMobile ? <LineH /> : <LineV />}
                                    <RowFixed
                                        style={
                                            isMobile
                                                ? { width: "100%", justifyContent: "space-between" }
                                                : {}
                                        }
                                    >
                                        <RowFixed>
                                            <IconIcon src={BNB} />
                                            <Column>
                                                <TextEqure fontColor={"#777E90"} fontSize={16}>
                                                    Assets on BSC
                                                </TextEqure>
                                                <RowFixed>
                                                    <ThemeTextEqure fontWeight={"bold"} fontSize={30}>
                                                        ${formatBalance(walletListBsc.data?.total)}
                                                    </ThemeTextEqure>
                                                    {/*<TextEqure style={{marginTop:10,marginLeft:10}} fontColor={'#4E55FF'} fontSize={12}>10%</TextEqure>*/}
                                                </RowFixed>
                                            </Column>
                                        </RowFixed>
                                        {isMobile && <MoreIcon src={ImageCommon.icon_more_icon} />}
                                    </RowFixed>
                                    {isMobile ? <LineH /> : <LineV />}
                                    <RowFixed
                                        style={
                                            isMobile
                                                ? { width: "100%", justifyContent: "space-between" }
                                                : {}
                                        }
                                    >
                                        <RowFixed>
                                            <IconIcon src={ESC} />
                                            <Column>
                                                <TextEqure fontColor={"#777E90"} fontSize={16}>
                                                    Assets on ESC
                                                </TextEqure>
                                                <RowFixed>
                                                    <ThemeTextEqure fontWeight={"bold"} fontSize={30}>
                                                        ${formatBalance(walletListEsc.data?.total)}
                                                    </ThemeTextEqure>
                                                    {/*<TextEqure style={{marginTop:10,marginLeft:10}} fontColor={'#4E55FF'} fontSize={12}>10%</TextEqure>*/}
                                                </RowFixed>
                                            </Column>
                                        </RowFixed>
                                        {isMobile && <MoreIcon src={ImageCommon.icon_more_icon} />}
                                    </RowFixed>
                                </CenterItemDiv>
                            </BGDiv>
                            {!isMobile && (
                                <BGDiv
                                    style={{
                                        backgroundColor: themeDark ? "#17181A" : "white",
                                    }}
                                >
                                    <ThemeTextEqure fontSize={28} fontWeight={"bold"}>
                                        Asset Details
                                    </ThemeTextEqure>
                                    <SpaceHeight height={36} heightApp={18} />
                                    <CenterItemDiv>
                                        {!isMobile && <SpaceWidth width={60} widthApp={40} />}
                                        <RowFixed
                                            style={
                                                isMobile
                                                    ? { width: "100%", justifyContent: "space-between" }
                                                    : {}
                                            }
                                        >
                                            <RowFixed>
                                                {isMobile && <IconIconBlue />}
                                                <Column>
                                                    <TextEqure fontColor={"#777E90"} fontSize={16}>
                                                        Wallet Total
                                                    </TextEqure>
                                                    <RowFixed>
                                                        <ThemeTextEqure fontWeight={"bold"} fontSize={30}>
                                                            ${formatBalance(walletList.data?.total)}
                                                        </ThemeTextEqure>
                                                        {isMobile && (
                                                            <TextEqure
                                                                style={{ marginTop: 10, marginLeft: 10 }}
                                                                fontColor={"#4E55FF"}
                                                                fontSize={12}
                                                            >
                                                                10%
                                                            </TextEqure>
                                                        )}
                                                    </RowFixed>
                                                </Column>
                                            </RowFixed>
                                            {isMobile && (
                                                <MoreIcon src={ImageCommon.icon_more_icon} />
                                            )}
                                        </RowFixed>
                                        {isMobile ? <LineH /> : <LineV width={100} />}
                                        <RowFixed
                                            style={
                                                isMobile
                                                    ? { width: "100%", justifyContent: "space-between" }
                                                    : {}
                                            }
                                        >
                                            <RowFixed>
                                                {isMobile && <IconIconBlue />}
                                                <Column>
                                                    <TextEqure fontColor={"#777E90"} fontSize={16}>
                                                        Wallet Balance
                                                    </TextEqure>
                                                    <RowFixed>
                                                        <ThemeTextEqure fontWeight={"bold"} fontSize={30}>
                                                            ${formatBalance(walletList.data?.total)}
                                                        </ThemeTextEqure>
                                                        {isMobile && (
                                                            <TextEqure
                                                                style={{ marginTop: 10, marginLeft: 10 }}
                                                                fontColor={"#4E55FF"}
                                                                fontSize={12}
                                                            >
                                                                10%
                                                            </TextEqure>
                                                        )}
                                                    </RowFixed>
                                                </Column>
                                            </RowFixed>
                                            {isMobile && (
                                                <MoreIcon src={ImageCommon.icon_more_icon} />
                                            )}
                                        </RowFixed>
                                        {isMobile ? <LineH /> : <LineV width={100} />}
                                        <RowFixed
                                            style={
                                                isMobile
                                                    ? { width: "100%", justifyContent: "space-between" }
                                                    : {}
                                            }
                                        >
                                            <RowFixed>
                                                {isMobile && <IconIconBlue />}
                                                <Column>
                                                    <TextEqure fontColor={"#777E90"} fontSize={16}>
                                                        Invested Balance
                                                    </TextEqure>
                                                    <RowFixed>
                                                        <ThemeTextEqure fontWeight={"bold"} fontSize={30}>
                                                            ${formatBalance(0)}
                                                        </ThemeTextEqure>
                                                        {isMobile && (
                                                            <TextEqure
                                                                style={{ marginTop: 10, marginLeft: 10 }}
                                                                fontColor={"#4E55FF"}
                                                                fontSize={12}
                                                            >
                                                                10%
                                                            </TextEqure>
                                                        )}
                                                    </RowFixed>
                                                </Column>
                                            </RowFixed>
                                            {isMobile && (
                                                <MoreIcon src={ImageCommon.icon_more_icon} />
                                            )}
                                        </RowFixed>
                                    </CenterItemDiv>
                                </BGDiv>
                            )}
                            <WalletDiv data={walletList} chainTitle={chainTitles[chainIndexToId[chainIndex]]} />
                        </>
                    ) : segmentIndex === 1 ? (
                        <>
                            <PortfolioItem />
                        </>
                    ) : (
                        <>
                            <ApprovalItem />
                        </>
                    )}
                </Body>
            </AppBody>
            <CustomStakeModal
                show={modalType !== StakeType.hidden}
                title={modalType === StakeType.mint ? "Mint" : "Upgrade"}
                onDismiss={() => setModalType(StakeType.hidden)}
                maxNum={cnftInfo.balance}
                onConfirm={onUpgrade}
            ></CustomStakeModal>
        </MainFullBody>
    );
}

//bind input
function BindInput({ bindDID }: any) {
    const [edit, setEdit] = useState(false);
    const [input, setInput] = useState("");
    const themeDark = useTheme();
    if (!edit) {
        return (
            <EditIcon
                src={ImageCommon.icon_edit}
                onClick={() => setEdit(true)}
            ></EditIcon>
        );
    }
    return (
        <FlexView>
            <BInput
                themeDark={themeDark}
                placeholder={"Input the DID"}
                onChange={(e) => setInput(e.target.value)}
                value={input}
            ></BInput>
            <GradientButton
                onClick={() => {
                    bindDID && bindDID(input);
                }}
            >
                Confirm
            </GradientButton>
        </FlexView>
    );
}

const EditIcon = styled.img`
  width: 22px;
  height: auto;
  cursor: pointer;
`;

// copy账号
function CopyAccount({ account, originAccount }: any) {
    return (
        <FlexView>
            <AddressText fontColor={"#777E90"} fontSize={14} fontWeight={"bold"}>
                DID:{account}
            </AddressText>
            <CopyIcon
                onClick={() => {
                    copy(originAccount);
                    message.success("copy success");
                }}
                src={ImageCommon.CopyIcon}
            />
        </FlexView>
    );
}

const BInput = styled.input<{
    themeDark?: boolean | null;
}>`
  font-family: "Poppins Regular", sans-serif;
  outline: none;
  background: none;
  outline: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: ${({ themeDark }) => `${themeDark ? "#FFFFFF" : "#17181A"}`};
  line-height: 70px;
  @media (max-width: 768px) {
    width: 100%;
    font-size: 12px;
  };
`;

const BBtn = styled(RowCenter)`
  width: 80px;
  height: 30px;
  background: #4f56ff;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 60px;
    height: 20px;
    font-size: 10px;
  };
`;

function Segment({ onSegmentSelect }: any) {
    const [selectIndex, setSelectIndex] = useState(0);
    const themeDark = useTheme();
    return (
        <SegmentDiv
            style={{
                backgroundColor: themeDark ? "#17181A" : "white",
            }}
        >
            <SegmentItem
                isChoose={selectIndex === 0}
                onClick={() => {
                    setSelectIndex(0);
                    onSegmentSelect(0);
                }}
            >
                Wallet
            </SegmentItem>
            {/*<Tooltip placement="top" title={"Coming soon..."}>*/}
            <SegmentItem
                isChoose={selectIndex === 1}
                onClick={() => {
                    setSelectIndex(1);
                    onSegmentSelect(1);
                }}
            >
                Portfolio
            </SegmentItem>
            {/*</Tooltip>*/}
            <SegmentItem
                isChoose={selectIndex === 2}
                onClick={() => {
                    setSelectIndex(2);
                    onSegmentSelect(2);
                }}
            >
                Approval
            </SegmentItem>
        </SegmentDiv>
    );
}

function Wrap({ onIndexChange, selectedIndex }: any) {
    const themeDark = useTheme();
    return (
        <WrapDiv>
            {chainIndexToId.map((item, index) => {
                if (index > 3) {
                    return (
                        <Tooltip placement="top" title={"Coming soon..."}>
                            <WrapItem
                                themeDark={themeDark}
                                className={selectedIndex === index ? "active" : ""}
                                style={
                                    {
                                        // backgroundColor: selectIndex == index ? '#4E55FF': (themeDark? '#17181A' : 'white'),
                                        // color:selectIndex == index ? 'white' : (themeDark? 'white' : '#17181A')
                                    }
                                }
                                selected={selectedIndex === index}
                                // onClick={()=>{
                                //   onIndexChange(index)
                                // }}
                                disabled={index > 3}
                            >
                                {chainTitles[item]}
                            </WrapItem>
                        </Tooltip>
                    );
                }
                return (
                    <WrapItem
                        themeDark={themeDark}
                        className={selectedIndex === index ? "active" : ""}
                        style={
                            {
                                // background: selectIndex == index ? 'linear-gradient(90deg, #4a1ee1, #1890ff)': (themeDark? '#17181A' : 'white'),
                                // color:selectIndex == index ? 'white' : (themeDark? 'white' : '#17181A')
                            }
                        }
                        selected={selectedIndex === index}
                        onClick={() => {
                            onIndexChange(index);
                        }}
                        disabled={index > 3}
                    >
                        {chainTitles[item]}
                    </WrapItem>
                );
            })}
        </WrapDiv>
    );
}

const WalletDiv: FC<{
    data: any;
    chainTitle: string;
}> = ({ data, chainTitle }) => {
    // console.log(data)
    const [input, setInput] = useState("");
    const themeDark = useTheme();
    const [hidden, setHidden] = useState(true)
    return (
        <BGDiv
            style={{
                backgroundColor: themeDark ? "#17181A" : "white",
            }}
        >
            <RowBetween>
                <ThemeTextEqure fontSize={28} fontWeight={"bold"}>
                    Wallet
                </ThemeTextEqure>
                {!isMobile && (
                    <SearchDiv>
                        <InputDiv
                            value={input}
                            placeholder={"Search coin"}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <SearchIcon src={ImageCommon.search_icon} />
                    </SearchDiv>
                )}
            </RowBetween>
            <SpaceHeight height={40} heightApp={20} />
            <RowBetween>
                <Column style={{ justifyContent: "flex-start", flex: 0.5 }}>
                    <ThemeTextEqure
                        style={{ marginLeft: 50 }}
                        fontWeight={"600"}
                        fontSize={20}
                    >
                        Asset
                    </ThemeTextEqure>
                </Column>
                {!isMobile && (
                    <Column style={{ flex: 1, alignItems: "flex-end" }}>
                        <ThemeTextEqure fontWeight={"600"} fontSize={20}>
                            Price
                        </ThemeTextEqure>
                    </Column>
                )}
                {!isMobile && (
                    <Column style={{ flex: 1, alignItems: "flex-end" }}>
                        <ThemeTextEqure fontWeight={"600"} fontSize={20}>
                            Balance
                        </ThemeTextEqure>
                    </Column>
                )}
                <Column style={{ flex: 1, alignItems: "flex-end" }}>
                    <ThemeTextEqure
                        style={isMobile ? { marginRight: 30 } : {}}
                        fontWeight={"600"}
                        fontSize={20}
                    >
                        Value
                    </ThemeTextEqure>
                </Column>
            </RowBetween>
            <Column style={{ width: '100%' }}>
                {/* <ProfileLoading loading={data.loading}></ProfileLoading> */}
                {!data.support &&
                    <RowCenter>
                        <ThemeTextEqure fontWeight={"bold"} fontSize={30}>
                            coming soon~
                        </ThemeTextEqure>
                    </RowCenter>
                }

                {!data.loading &&
                    data.data.tokens.map((item: any, index: number) => {
                        if (hidden && item.value < 1) {
                            return null
                        }
                        return (
                            <>
                                <LineH />
                                <RowBetween>
                                    <RowFixed style={{ flex: 0.5 }}>
                                        <SmallIconIcon src={item.icon} />
                                        <Column>
                                            <ThemeTextEqure fontWeight={"bold"} fontSize={14}>
                                                {item.symbol}
                                            </ThemeTextEqure>
                                            <TextEqure fontColor={"#777E90"} fontSize={14}>
                                                {chainTitle}
                                            </TextEqure>
                                        </Column>
                                    </RowFixed>
                                    {!isMobile && (
                                        <Column style={{ alignItems: "flex-end", flex: 1 }}>
                                            <ThemeTextEqure fontWeight={"bold"} fontSize={14}>
                                                ${formatPositiveNumber(item.price)}
                                            </ThemeTextEqure>
                                            {/* <TextEqure fontColor={"#777E90"} fontSize={14}>
                                            {formatBalance(item.priceChangePercentage24h)}%
                                        </TextEqure> */}
                                        </Column>
                                    )}
                                    {!isMobile && (
                                        <Column style={{ alignItems: "flex-end", flex: 1 }}>
                                            <ThemeTextEqure fontWeight={"bold"} fontSize={14}>
                                                {formatBalance(item.amount)} {item.symbol}
                                            </ThemeTextEqure>
                                            <TextEqure fontColor={"#777E90"} fontSize={14}>
                                                &nbsp;
                                            </TextEqure>
                                        </Column>
                                    )}
                                    <Row style={{ alignItems: "flex-start", flex: 1 }}>
                                        <Column style={{ alignItems: "flex-end", flex: 1 }}>
                                            <ThemeTextEqure fontWeight={"bold"} fontSize={14}>
                                                ${formatPositiveNumber(item.value)}
                                            </ThemeTextEqure>
                                            <TextEqure fontColor={"#777E90"} fontSize={14}>
                                                {/*{formatBalance(item.valueBTC)} BTC*/}
                                            </TextEqure>
                                        </Column>
                                        {isMobile && (
                                            <MoreIcon
                                                style={{ marginLeft: 10 }}
                                                src={ImageCommon.icon_more_icon}
                                            />
                                        )}
                                    </Row>
                                </RowBetween>
                            </>
                        );
                    })}
            </Column>
            <SpaceHeight height={40} heightApp={20} />
            <RowCenter>
                <TextEqure fontColor={"#777E90"} fontSize={12}>
                    {`Tokens with value <$1 are hidden`}
                </TextEqure>
                <TextEqure
                    style={{ cursor: "pointer", marginLeft: 15 }}
                    onClick={() => {
                        setHidden(false)
                    }}
                    fontColor={"#4E55FF"}
                    fontSize={12}
                >
                    Show all
                </TextEqure>
            </RowCenter>
        </BGDiv>
    );
}

function PortfolioItem() {
    const [chainIndex, setChainIndex] = useState(0);
    const [defiProject, setDefiProject] = useState<Object>({});
    useEffect(() => {
        async function getResult() {
            try {
                const originUrl = `https://defi-app.whatscoin.com/dgg/account/defi?lang=cn`;
                let res = await axios.get(originUrl);
                let obj: any = {};
                res.data.data.forEach((item: any, index: number) => {
                    // console.log(item)
                    if (!obj[item.chainName]) {
                        obj[item.chainName] = {};
                    }
                    obj[item.chainName][item.name] = item;
                });
                setDefiProject(obj);
            } catch (e) {
                console.warn("PortfolioItem", e)
            }
        }

        getResult();
    }, []);

    function changChainIndex(index: number) {
        setChainIndex(index);
    }

    return (
        <Column style={{ width: "100%" }}>
            <Wrap onIndexChange={changChainIndex} selectIndex={chainIndex} />
            {isMobile ? (
                <PortfolioPhoneDiv
                    project={defiProject}
                    chainType={chainIndexToId[chainIndex]}
                />
            ) : (
                <PortfolioDiv project={defiProject} chainType={chainIndexToId[chainIndex]} />
            )}
        </Column>
    );
}

const PortfolioPhoneDiv: FC<{
    project: any,
    chainType: number
}> = ({ project, chainType }) => {
    const data = Object.values(project[chainType] || {});

    const projectNames = data.map((item: any, index: number) => {
        return item.name;
    });
    const allProject = useBoxProjectAll(ChainType[chainType], projectNames);
    const projects = allProject.data;
    const projectsFilterRes = projects.filter(
        (currentValue: any, index: number, arr: any) => {
            return currentValue?.asset > 0;
        }
    );
    projectsFilterRes.sort((a: any, b: any) => {
        return b.asset - a.asset;
    });
    if (allProject.loading) {
        return <ProfileLoading loading={allProject.loading}></ProfileLoading>;
    }
    return (
        <Column style={{ width: "100%", marginTop: 15 }}>
            {projectsFilterRes.map((item: any, index: number) => {
                return <PortfolioPhoneItemDiv item={item}></PortfolioPhoneItemDiv>;
            })}
        </Column>
    );
}

function PortfolioPhoneItemDiv({ item }: any) {
    const [showMore, setShowMore] = useState(false);
    const themeDark = useTheme();
    return (
        <Column style={{ width: "100%" }}>
            <LineH height={10} />
            <RowBetween>
                <RowFixed>
                    <SmallIconIcon src={item.icon} />
                    <ThemeTextEqure fontSize={17} fontWeight={"bold"}>
                        {item.desc}
                    </ThemeTextEqure>
                </RowFixed>
                <RowFixed onClick={() => setShowMore(!showMore)}>
                    <Column>
                        <TextEqure fontSize={17} fontColor={"#4F56FF"} fontWeight={"bold"}>
                            ${formatBalance(item.asset)}
                        </TextEqure>
                        <ThemeTextEqure fontSize={17}>
                            ${formatBalance(item.farmingValue)}
                        </ThemeTextEqure>
                    </Column>
                    <Arrow src={ImageCommon.ArrowDownIcon_white} />
                </RowFixed>
            </RowBetween>
            {showMore && (
                <>
                    <ProjectBankItemMobile
                        title={ProjectConfig[item.name]?.title1}
                        data={item[ProjectConfig[item.name]?.key1] || []}
                        name={item.name}
                        tokensKey={ProjectConfig[item.name]?.tokensKey1}
                    ></ProjectBankItemMobile>
                    <ProjectBankItemMobile
                        title={ProjectConfig[item.name]?.title2}
                        data={item[ProjectConfig[item.name]?.key2] || []}
                        name={item.name}
                        tokensKey={ProjectConfig[item.name]?.tokensKey2}
                    ></ProjectBankItemMobile>
                </>
            )}
        </Column>
    );
}

function ProjectBankItemMobile({ title, data, name, tokensKey }: any) {
    const themeDark = useTheme();
    if (!data.length) {
        return null;
    }
    return (
        <BGDiv
            style={{
                padding: 0,
                paddingTop: 10,
                backgroundColor: themeDark ? "#17181A" : "white",
            }}
        >
            <PortfolioTopBg>{title}</PortfolioTopBg>
            <SpaceHeight height={0} heightApp={15} />
            <RowBetween>
                <TextEqure
                    style={{ marginLeft: 10 }}
                    fontWeight={"600"}
                    fontColor={"#4F56FF"}
                    fontSize={15}
                >
                    Pooled funds
                </TextEqure>
                <TextEqure
                    style={{ marginRight: 10 }}
                    fontWeight={"600"}
                    fontColor={"#4F56FF"}
                    fontSize={15}
                >
                    To be claimed
                </TextEqure>
            </RowBetween>
            {data.map((subItem: any, subIndex: number) => {
                return (
                    <ProjectBankListMobile
                        item={subItem}
                        name={name}
                        tokensKey={tokensKey}
                    ></ProjectBankListMobile>
                );
            })}
        </BGDiv>
    );
}

function ProjectBankListMobile({ item, name, tokensKey }: any) {
    const tokens = item[tokensKey] || [];
    const unclaimToken =
        item[ProjectConfig[name]?.unclaimKey]?.[0] ||
        item[ProjectConfig[name]?.unclaimKey] ||
        {};
    item.amount = Math.max(item.balance || 0, item.amount || 0);
    unclaimToken.amount = Math.max(
        unclaimToken.balance || 0,
        unclaimToken.amount || 0
    );

    if (!tokens.length) {
        if (["yfii", "keeperdao", "dodo", "hegic", "wepiggy"].indexOf(name) >= 0) {
            item.icon = tokens.icon;
            item.symbol = tokens.symbol;
        }
        if (["dodo", "dusd"].indexOf(name) >= 0) {
            item.amount = Math.max(item.amount || 0, tokens.amount || 0);
            item.value = Math.max(item.value || 0, tokens.value || 0);
        }
        const icons = [item.icon];
        const pairs = [item.symbol];

        return (
            <Column style={{ padding: 10 }}>
                <div
                    style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: "#2E313A",
                        marginBottom: 20,
                    }}
                ></div>
                <RowBetween>
                    <RowFixed>
                        <CardPairOrigin pairs={pairs} icons={icons} showTitle={false} />
                        <Column>
                            <ThemeTextEqure fontWeight={"600"} fontSize={15}>
                                {formatBalance(item.amount)} {item.symbol}
                            </ThemeTextEqure>
                            <ThemeTextEqure fontSize={12}>
                                ${formatBalance(item.value)}
                            </ThemeTextEqure>
                        </Column>
                    </RowFixed>
                    <Column style={{ alignItems: "flex-end" }}>
                        <ThemeTextEqure fontWeight={"600"} fontSize={15}>
                            {formatBalance(unclaimToken.amount)} {unclaimToken.symbol}($
                            {formatBalance(unclaimToken.value)})
                        </ThemeTextEqure>
                        <ThemeTextEqure fontSize={12}>
                            {formatPercent(item.apy)}
                        </ThemeTextEqure>
                    </Column>
                </RowBetween>
            </Column>
        );
    }

    const icons = tokens.map((item: any, index: number) => {
        return item.icon;
    });
    const pairs = tokens.map((item: any, index: number) => {
        return item.symbol;
    });
    const balance = tokens.map((item: any, index: number) => {
        return (
            formatBalance(Math.max(item.amount || 0, item.balance || 0)) + item.symbol
        );
    });
    return (
        <Column style={{ padding: 10 }}>
            <div
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#2E313A",
                    marginBottom: 20,
                }}
            ></div>
            <RowBetween>
                <RowFixed>
                    <CardPairOrigin pairs={pairs} icons={icons} showTitle={false} />
                    <Column>
                        <ThemeTextEqure fontWeight={"600"} fontSize={15}>
                            {balance.join("+")}
                        </ThemeTextEqure>
                        <ThemeTextEqure fontSize={12}>
                            ${formatBalance(item.value)}
                        </ThemeTextEqure>
                    </Column>
                </RowFixed>
                <Column style={{ alignItems: "flex-end" }}>
                    <ThemeTextEqure fontWeight={"600"} fontSize={15}>
                        {formatBalance(unclaimToken.amount)} {unclaimToken.symbol}($
                        {formatBalance(unclaimToken.value)})
                    </ThemeTextEqure>
                    <ThemeTextEqure fontSize={12}>
                        {formatPercent(item.apy)}
                    </ThemeTextEqure>
                </Column>
            </RowBetween>
        </Column>
    );
}

function PortfolioDiv({ project, chainType }: any) {
    const data = Object.values(project[chainType] || {});

    const projectNames = data.map((item: any, index: number) => {
        return item.name;
    });
    const allProject = useBoxProjectAll(ChainType[chainType], projectNames);
    const projects = allProject.data;
    const projectsFilterRes = projects.filter(
        (currentValue: any, index: number, arr: any) => {
            return currentValue?.asset > 0;
        }
    );
    projectsFilterRes.sort((a: any, b: any) => {
        return b.asset - a.asset;
    });
    if (allProject.loading) {
        return <ProfileLoading loading={allProject.loading}></ProfileLoading>;
    }
    return (
        <Column style={{ width: "100%", marginTop: 30 }}>
            {projectsFilterRes.map((item: any, index: number) => {
                return <ProjectItem item={item}></ProjectItem>;
            })}
        </Column>
    );
}

function ProjectItem({ item }: any) {
    return (
        <Column style={{ width: "100%" }}>
            <RowBetween>
                <RowFixed>
                    <SmallIconIcon src={item.icon} />
                    <TextEqure fontSize={34} fontColor={"#4F56FF"} fontWeight={"bold"}>
                        {item.desc}
                    </TextEqure>
                </RowFixed>
                <RowFixed>
                    <TextEqure fontSize={18} fontColor={"#777E90"} fontWeight={"bold"}>
                        Mining assets
                    </TextEqure>
                    <SpaceWidth width={20} widthApp={0} />
                    <ThemeTextEqure fontSize={18} fontWeight={"bold"}>
                        ${formatBalance(item.asset)}
                    </ThemeTextEqure>
                    <SpaceWidth width={50} widthApp={0} />
                    <TextEqure fontSize={18} fontColor={"#777E90"} fontWeight={"bold"}>
                        To be claimed
                    </TextEqure>
                    <SpaceWidth width={20} widthApp={0} />
                    <TextEqure fontSize={18} fontColor={"#4F56FF"} fontWeight={"bold"}>
                        ${formatBalance(item.farmingValue)}
                    </TextEqure>
                </RowFixed>
            </RowBetween>
            <ProjectBankItem
                title={ProjectConfig[item.name]?.title1}
                data={item[ProjectConfig[item.name]?.key1] || []}
                name={item.name}
                tokensKey={ProjectConfig[item.name]?.tokensKey1}
            ></ProjectBankItem>
            <ProjectBankItem
                title={ProjectConfig[item.name]?.title2}
                data={item[ProjectConfig[item.name]?.key2] || []}
                name={item.name}
                tokensKey={ProjectConfig[item.name]?.tokensKey2}
            ></ProjectBankItem>
        </Column>
    );
}

function ProjectBankItem({ title, data, name, tokensKey }: any) {
    const themeDark = useTheme();
    if (!data.length) {
        return null;
    }
    return (
        <BGDiv
            style={{
                backgroundColor: themeDark ? "#17181A" : "white",
            }}
        >
            <PortfolioTopBg>{title}</PortfolioTopBg>
            <SpaceHeight height={30} heightApp={20} />
            <RowBetween>
                <Column style={{ flex: 1.5 }}>
                    <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
                        Pooled funds
                    </TextEqure>
                </Column>
                <Column style={{ flex: 2 }}>
                    <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
                        Balance
                    </TextEqure>
                </Column>
                <Column style={{ flex: 1 }}>
                    <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
                        Value
                    </TextEqure>
                </Column>
                <Column style={{ flex: 1.5 }}>
                    <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
                        To be claimed
                    </TextEqure>
                </Column>
                <Column style={{ flex: 1, alignItems: "flex-end" }}>
                    <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
                        APY
                    </TextEqure>
                </Column>
            </RowBetween>
            <LineH style={{ marginTop: 10, marginBottom: 20 }} />
            {data.map((subItem: any, subIndex: number) => {
                return (
                    <ProjectBankList
                        item={subItem}
                        name={name}
                        tokensKey={tokensKey}
                    ></ProjectBankList>
                );
            })}
        </BGDiv>
    );
}

function ProjectBankList({ item, name, tokensKey }: any) {
    const tokens = item[tokensKey] || [];
    const unclaimToken =
        item[ProjectConfig[name]?.unclaimKey]?.[0] ||
        item[ProjectConfig[name]?.unclaimKey] ||
        {};
    item.amount = Math.max(item.balance || 0, item.amount || 0);
    unclaimToken.amount = Math.max(
        unclaimToken.balance || 0,
        unclaimToken.amount || 0
    );

    if (!tokens.length) {
        if (["yfii", "keeperdao", "dodo", "hegic", "wepiggy"].indexOf(name) >= 0) {
            item.icon = tokens.icon;
            item.symbol = tokens.symbol;
        }
        if (["dodo", "dusd"].indexOf(name) >= 0) {
            item.amount = Math.max(item.amount || 0, tokens.amount || 0);
            item.value = Math.max(item.value || 0, tokens.value || 0);
        }
        const icons = [item.icon];
        const pairs = [item.symbol];

        return (
            <RowBetween style={{ height: 50 }}>
                <Column style={{ flex: 1.5 }}>
                    <RowFixed>
                        <CardPairOrigin pairs={pairs} icons={icons} showTitle={false} />
                        <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                            {pairs.join("+")}
                        </ThemeTextEqure>
                    </RowFixed>
                </Column>
                <Column style={{ flex: 2 }}>
                    <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                        {formatBalance(item.amount)} {item.symbol}
                    </ThemeTextEqure>
                </Column>
                <Column style={{ flex: 1 }}>
                    <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                        ${formatBalance(item.value)}
                    </ThemeTextEqure>
                </Column>
                <Column style={{ flex: 1.5 }}>
                    <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                        {formatBalance(unclaimToken.amount)} {unclaimToken.symbol}($
                        {formatBalance(unclaimToken.value)})
                    </ThemeTextEqure>
                </Column>
                <Column style={{ flex: 1, alignItems: "flex-end" }}>
                    <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                        {formatPercent(item.apy)}
                    </ThemeTextEqure>
                </Column>
            </RowBetween>
        );
    }

    const icons = tokens.map((item: any, index: number) => {
        return item.icon;
    });
    const pairs = tokens.map((item: any, index: number) => {
        return item.symbol;
    });
    const balance = tokens.map((item: any, index: number) => {
        return (
            formatBalance(Math.max(item.amount || 0, item.balance || 0)) + item.symbol
        );
    });
    return (
        <RowBetween style={{ height: 50 }}>
            <Column style={{ flex: 1.5 }}>
                <RowFixed>
                    <CardPairOrigin pairs={pairs} icons={icons} showTitle={false} />
                    <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                        {pairs.join("+")}
                    </ThemeTextEqure>
                </RowFixed>
            </Column>
            <Column style={{ flex: 2 }}>
                <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                    {balance.join("+")}
                </ThemeTextEqure>
            </Column>
            <Column style={{ flex: 1 }}>
                <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                    ${formatBalance(item.value)}
                </ThemeTextEqure>
            </Column>
            <Column style={{ flex: 1.5 }}>
                <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                    {formatBalance(unclaimToken.amount)} {unclaimToken.symbol}($
                    {formatBalance(unclaimToken.value)})
                </ThemeTextEqure>
            </Column>
            <Column style={{ flex: 1, alignItems: "flex-end" }}>
                <ThemeTextEqure fontWeight={"600"} fontSize={18}>
                    {formatPercent(item.apy)}
                </ThemeTextEqure>
            </Column>
        </RowBetween>
    );
}

function ActivityItem() {
    const [chainIndex, setChainIndex] = useState(0);

    function changChainIndex(index: number) {
        setChainIndex(index);
    }

    return (
        <Column style={{ width: "100%" }}>
            <Wrap onIndexChange={changChainIndex} selectIndex={chainIndex} />
            <ActivityDiv />
        </Column>
    );
}

function ActivityDiv({ data }: any) {
    const [topIndex, setTopIndex] = useState(0);
    const themeDark = useTheme();
    return (
        <BGDiv
            style={{
                backgroundColor: themeDark ? "#17181A" : "white",
            }}
        >
            <WrapDiv
                style={{ justifyContent: "flex-start", marginLeft: 0, marginRight: 0 }}
            >
                {["All types", "Withdrawals", "Deposit", "Transfer"].map(
                    (item, index) => {
                        return (
                            <ActivityDivTopItem
                                isChoose={topIndex === index}
                                onClick={() => {
                                    setTopIndex(index);
                                }}
                            >
                                {item}
                            </ActivityDivTopItem>
                        );
                    }
                )}
            </WrapDiv>
            <LineH />
            <ThemeTextEqure fontSize={28} fontWeight={"bold"}>
                Activity
            </ThemeTextEqure>
            <SpaceHeight height={40} heightApp={20} />
            <RowBetween>
                <Column style={{ flex: 1 }}>
                    <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={12}>
                        Coin
                    </TextEqure>
                </Column>
                <Column style={{ flex: 1 }}>
                    <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={12}>
                        Amount
                    </TextEqure>
                </Column>
                <Column style={{ flex: 1 }}>
                    <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={12}>
                        Address
                    </TextEqure>
                </Column>
                <Column style={{ flex: 1 }}>
                    <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={12}>
                        Transaction ID
                    </TextEqure>
                </Column>
            </RowBetween>
            <SpaceHeight height={40} heightApp={20} />
            <RowCenter>
                <TextEqure fontColor={"#777E90"} fontSize={12}>
                    {`Tokens with value <$100 are hidden`}
                </TextEqure>
                <ThemeTextEqure
                    style={{ cursor: "pointer", marginLeft: 15 }}
                    onClick={() => { }}
                    fontColor={"#4E55FF"}
                    fontSize={12}
                >
                    Show all
                </ThemeTextEqure>
            </RowCenter>
        </BGDiv>
    );
}

function ApprovalItem() {
    const [chainIndex, setChainIndex] = useState(0);
    const approveList = useBoxApproveList(ChainType[chainIndexToId[chainIndex]]);

    function changeChainIndex(index: number) {
        setChainIndex(index);
    }

    return (
        <Column style={{ width: "100%" }}>
            <Wrap onIndexChange={changeChainIndex} selectIndex={chainIndex} />
            {isMobile ? (
                <ApprovalPhoneDiv
                    data={approveList}
                    netType={ChainType[chainIndexToId[chainIndex]]}
                />
            ) : (
                <ApprovalDiv
                    data={approveList}
                    netType={ChainType[chainIndexToId[chainIndex]]}
                />
            )}
        </Column>
    );
}

function ApprovalPhoneDiv({ data, netType }: any) {
    const { chainId } = useContext(NetworkTypeContext);
    const network = chainFromId(chainId);

    function cancel(cancelApprove: any) {
        if (network === netType) {
            cancelApprove && cancelApprove();
        } else {
            switchNetwork(ChainIdConfig[netType]);
        }
    }

    return (
        <>
            {!data.loading &&
                data.data.authorizations.map((item: any, index: number) => {
                    return <ApprovalPhoneItemDiv item={item} cancel={cancel} />;
                })}
        </>
    );
}

function ApprovalPhoneItemDiv({ item, cancel }: any) {
    const [showMore, setShowMore] = useState(false);
    const tokenContract = useTokenContract(item.address);
    const addTransaction = useTransactionAdder();
    const themeDark = useTheme();

    function cancelApprove(spender: string) {
        tokenContract
            ?.approve(spender, BigNumber.from(0))
            .then(async (response: TransactionResponse) => {
                addTransaction(response, {
                    summary: "Cancel Approve",
                });
                await response.wait();
            })
            .catch((err: any) => {
            });
    }

    return (
        <Column>
            <RowBetween>
                <RowFixed>
                    <SmallIconIcon />
                    <Column>
                        <TextEqure fontColor={"#777E90"} fontSize={18}>
                            {item.symbol}
                        </TextEqure>
                        <ThemeTextEqure fontSize={16}>
                            {formatBalance(item.balance)} {item.symbol}
                        </ThemeTextEqure>
                    </Column>
                </RowFixed>
                <RowFixed
                    onClick={() => {
                        setShowMore(!showMore);
                    }}
                >
                    <ThemeTextEqure fontSize={20}>
                        ${formatBalance(item.sumExposureUsd)}
                    </ThemeTextEqure>
                    <Arrow src={ImageCommon.ArrowDownIcon_white} />
                </RowFixed>
            </RowBetween>
            {showMore && (
                <BGDiv
                    style={{
                        backgroundColor: themeDark ? "#17181A" : "white",
                    }}
                >
                    {item.projects.map((subItem: any, subIndex: number) => {
                        return (
                            <Column style={{ marginTop: 15 }}>
                                <RowBetween>
                                    <RowFixed>
                                        <SmallIconIcon src={subItem.icon} />
                                        <ThemeTextEqure fontSize={15}>
                                            {subItem.name ? subItem.name : "Unknown project"}
                                        </ThemeTextEqure>
                                    </RowFixed>
                                    <CancelButton
                                        onClick={() => {
                                            cancel(() => cancelApprove(subItem.address));
                                        }}
                                    >
                                        Cancel
                                    </CancelButton>
                                </RowBetween>
                                <RowBetween>
                                    <TextEqure fontColor={"#777E90"} fontSize={10}>
                                        Risk exposure
                                    </TextEqure>
                                    <ThemeTextEqure fontSize={18}>
                                        ${formatBalance(subItem.exposureUsd)}
                                    </ThemeTextEqure>
                                </RowBetween>
                                <RowBetween>
                                    <TextEqure fontColor={"#777E90"} fontSize={10}>
                                        Approved amount
                                    </TextEqure>
                                    <ThemeTextEqure fontSize={18}>All</ThemeTextEqure>
                                </RowBetween>
                                <RowBetween style={{ overflow: "hidden" }}>
                                    <TextEqure fontColor={"#777E90"} fontSize={10}>
                                        Project/Contract
                                    </TextEqure>
                                    <ThemeTextEqure style={{ width: 100 }} fontSize={10}>
                                        {subItem.address}
                                    </ThemeTextEqure>
                                </RowBetween>
                            </Column>
                        );
                    })}
                </BGDiv>
            )}
            <LineH height={15} />
        </Column>
    );
}

function ApprovalDiv({ data, netType }: any) {
    const { chainId } = useContext(NetworkTypeContext);
    const network = chainFromId(chainId);
    const themeDark = useTheme();

    function cancel(cancelApprove: any) {
        if (network === netType) {
            cancelApprove && cancelApprove();
        } else {
            switchNetwork(ChainIdConfig[netType]);
        }
    }

    return (
        <BGDiv
            style={{
                backgroundColor: themeDark ? "#17181A" : "white",
            }}
        >
            <RowBetween>
                <RowBetween style={{ flex: 1, marginRight: 24 }}>
                    <TextEqure fontColor={"#777E90"} fontSize={18}>
                        Token/Balance
                    </TextEqure>
                    <TextEqure fontColor={"#777E90"} fontSize={18}>
                        Token exposure
                    </TextEqure>
                </RowBetween>
                <RowBetween style={{ flex: 2 }}>
                    <RowBetween style={{ flex: 2 }}>
                        <TextEqure
                            style={{ marginLeft: 24 }}
                            fontColor={"#777E90"}
                            fontSize={18}
                        >
                            Project/Contract
                        </TextEqure>
                        <TextEqure fontColor={"#777E90"} fontSize={18}>
                            Approved amount
                        </TextEqure>
                    </RowBetween>
                    <TextEqure
                        style={{ flex: 1, marginLeft: 30 }}
                        fontColor={"#777E90"}
                        fontSize={18}
                    >
                        Risk exposure
                    </TextEqure>
                </RowBetween>
            </RowBetween>
            <SpaceHeight height={30} heightApp={15} />
            <ProfileLoading loading={data.loading}></ProfileLoading>
            {!data.loading &&
                data.data.authorizations.map((item: any, index: number) => {
                    return <ApproveItem item={item} cancel={cancel}></ApproveItem>;
                })}
        </BGDiv>
    );
}

function ApproveItem({ item, cancel }: any) {
    const tokenContract = useTokenContract(item.address);
    const addTransaction = useTransactionAdder();

    function cancelApprove(spender: string) {
        tokenContract
            ?.approve(spender, BigNumber.from(0))
            .then(async (response: TransactionResponse) => {
                addTransaction(response, {
                    summary: "Cancel Approve",
                });
                await response.wait();
            })
            .catch((err: any) => {
            });
    }

    return (
        <>
            <LineHNor />
            <RowBetween style={{ alignItems: "flex-start" }}>
                <RowBetween style={{ flex: 1, marginRight: 24, marginTop: 10 }}>
                    <RowFixed>
                        <SmallIconIcon src={item.icon} />
                        <Column>
                            <TextEqure fontColor={"#777E90"} fontSize={18}>
                                {item.symbol}
                            </TextEqure>
                            <TextEqure fontColor={"#353945"} fontSize={16}>
                                {formatBalance(item.balance)} {item.symbol}
                            </TextEqure>
                        </Column>
                    </RowFixed>
                    <ThemeTextEqure fontSize={20}>
                        ${formatBalance(item.sumExposureUsd)}
                    </ThemeTextEqure>
                </RowBetween>
                <Column style={{ flex: 2 }}>
                    {item.projects.map((subItem: any, subIndex: number) => {
                        return (
                            <BottomRight>
                                <RowBetween style={{ flex: 2 }}>
                                    <RowFixed>
                                        <SmallIconIcon src={subItem.icon} />
                                        <Column>
                                            <ThemeTextEqure fontSize={20}>
                                                {subItem.name ? subItem.name : "Unknown project"}
                                            </ThemeTextEqure>
                                            <AddressShowText
                                                style={{ width: 250 }}
                                                fontColor={"#777E90"}
                                                fontSize={16}
                                            >
                                                {subItem.address}
                                            </AddressShowText>
                                        </Column>
                                    </RowFixed>
                                    <ThemeTextEqure fontSize={20}>All</ThemeTextEqure>
                                </RowBetween>
                                <RowFixed style={{ flex: 1, marginLeft: 30 }}>
                                    <SpaceWidth width={30} widthApp={35} />
                                    <ThemeTextEqure fontSize={20}>
                                        ${formatBalance(subItem.exposureUsd)}
                                    </ThemeTextEqure>
                                    <SpaceWidth width={30} widthApp={35} />
                                    <CancelButton
                                        onClick={() => {
                                            cancel(() => cancelApprove(subItem.address));
                                        }}
                                    >
                                        Cancel
                                    </CancelButton>
                                </RowFixed>
                            </BottomRight>
                        );
                    })}
                </Column>
            </RowBetween>
        </>
    );
}

export default Profile;

const BottomRight = styled(RowBetween)`
  height: 70px;
  border-left: 1px solid #2e313a;
  padding-left: 24px;
`;
const AddressShowText = styled(TextEqure)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ActivityDivTopItem = styled(RowCenter) <{
    isChoose: boolean;
}>`
  align-items: center;
  cursor: pointer;
  background-color: ${({ isChoose }) => (isChoose ? "#353945" : "transparent")};
  height: 30px;
  border-radius: 15px;
  color: ${({ isChoose }) => (isChoose ? "#FBFCFC" : "#777E90")};
  font-size: 14px;
  font-weight: bold;
  padding: 10px 15px;
  margin-right: 28px;
  width: fit-content;
  @media (max-width: 768px) {
    padding: 5px 10px;
    margin-right: 14px;
  };
`;
const DrawButton = styled.div`
  color: white;
  border: 1px solid #fbfcfc;
  align-items: center;
  justify-content: center;
  // height:30px;
  border-radius: 15px;
  padding: 2px 5px;
  // width:100px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  background-color: #ffffff;
  color: #4e55ff;
  font-weight: bold;
`;
const CancelButton = styled(DrawButton)`
  color: white;
  background-color: transparent;
  padding: 2px 10px;
`;
