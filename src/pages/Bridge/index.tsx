// import styled from 'styled-components'
// import ImageCommon from '@assets/common/ImageCommon'
import ImageCommon from "@assets/common/ImageCommon";
import ImageToken from "@assets/tokens/ImageToken";
import {
    CustomIcon,
    FlexView,
    FlexViewAround,
    FlexViewBetween,
    FlexViewCenter,
    FlexViewCenterColumn,
    MobileView,
    WinView
} from "@components/Common";
import { TransactionResponse } from "@ethersproject/providers";
import AppBody, { MainFullBody } from '@pages/components/AppBody';
import { ChainIds, chainFromId } from "@services/chain.service";
import { useCredaInfo } from "@services/creda-token.service";
import { useWrapAmount } from "@services/swap-bridge.service";
import { useApprove } from "@services/tokens.service";
import { BigNumber } from "ethers";
import React, { useCallback, useContext } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import { ApprovalState, GasInfo, balanceToBigNumber, colors, formatBalance } from "../../common/Common";
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";
import ContractConfig from "../../contract/ContractConfig";
import { useContract } from "../../hooks/useContract";
import { LoadingType, useLoadingContext } from "../../provider/LoadingProvider";
import { useTheme } from "../../state/application/hooks";
import { useAddToast } from "../../state/toast";
import { useTransactionAdder } from "../../state/transactions/hooks";

function Bridge(props: any) {
    const isDark = useTheme()
    return (
        <MainFullBody history={props.history}>
            <AppBody history={props.history}>
                <FlexViewCenterColumn>
                    <BridgeContent
                        isDark={isDark}
                    ></BridgeContent>
                </FlexViewCenterColumn>

            </AppBody>
        </MainFullBody>
    )
}

export default Bridge;

const BridgeContent = React.memo(({ isDark }: any) => {
    const { t } = useTranslation();
    const { chainId } = useContext(NetworkTypeContext);
    const { account } = useContext(WalletAddressContext);
    const network = chainFromId(chainId);
    const credaInfo = useCredaInfo()

    const [val, setVal] = React.useState('')
    const coinList: any[] = [
        { symbol: "CREDA", title: "CREDA" }
    ];
    const arb = {
        symbol: "arbitrum",
        title: "Arbitrum"
    }
    const esc = {
        symbol: "ela",
        title: "ESC"
    }
    let fromInfo = arb
    let toInfo = esc
    if (chainId === ChainIds.esc) {
        fromInfo = esc
        toInfo = arb
    }
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const RouterContract = useContract(
        ContractConfig.Router[network]?.address,
        ContractConfig.Router.abi
    );
    const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setVal(e.currentTarget.value)
    }, [setVal])
    //
    const handleSelectMax = useCallback(() => {
        setVal(formatBalance(credaInfo.unlocked))
    }, [credaInfo.unlocked, setVal]);


    const [approval, approveCallback] = useApprove(
        ContractConfig.CREDA[network]?.address,
        ContractConfig.Router[network]?.address
    );
    const [approvalWCREDA, approveWCREDACallback] = useApprove(
        ContractConfig.WCREDA[network]?.address,
        ContractConfig.Router[network]?.address
    );
    const addTransaction = useTransactionAdder();
    const addToast = useAddToast();
    const wrapInfo = useWrapAmount()
    const { show } = useLoadingContext()
    const wrapChainId = chainId === ChainIds.esc ? 0 : 1
    function onWrap() {
        if (!RouterContract || !val) return
        show(LoadingType.confirm, "WRAP & BRIDGE")
        RouterContract.bridge(balanceToBigNumber(val), BigNumber.from(wrapChainId), GasInfo)
            .then(async (response: TransactionResponse) => {
                show(LoadingType.pending, response.hash)
                await response.wait();
                show(LoadingType.success, response.hash)
            })
            .catch((err: any) => {
                show(LoadingType.error, err.reason || err.message)
            });
    }
    function onReceive() {
        if (!RouterContract || !wrapInfo.data) return
        show(LoadingType.confirm, "UNWRAP")
        RouterContract.wrap(BigNumber.from(wrapChainId), GasInfo)
            .then(async (response: TransactionResponse) => {
                show(LoadingType.pending, response.hash)
                await response.wait();
                show(LoadingType.success, response.hash)
            })
            .catch((err: any) => {
                show(LoadingType.error, err.reason || err.message)
            });
    }
    return (
        <HoleContent
            isDark={isDark}
        >
            {/*<WinView>*/}
            {/*    <PlaceholderView*/}
            {/*        height={"50px"}*/}
            {/*    ></PlaceholderView>*/}
            {/*</WinView>*/}
            {/*<MobileView>*/}
            {/*    <PlaceholderView*/}
            {/*        height={"20px"}*/}
            {/*    ></PlaceholderView>*/}
            {/*</MobileView>*/}
            <TitleH4
                marginBottom={"10px"}
                isDark={isDark}
            >
                {t("selectAsset")}
            </TitleH4>
            <SelectCoin
                isDark={isDark}
                coins={coinList}
                select={coinList[currentIndex]}
                onSelect={(index: number) => {
                    console.log(index)
                }}
            ></SelectCoin>
            <PlaceholderView
                height={isMobile ? "10px" : "20px"}
            ></PlaceholderView>

            <TitleH4
                isDark={isDark}
            >
                {t("crossAmount")}
            </TitleH4>
            <InputView
                marginTop={"10px"}
                isDark={isDark}
            >
                <CustomIcon
                    src={ImageToken[coinList[currentIndex].symbol]}
                    size={30}
                    mSize={20}
                ></CustomIcon>
                <Input
                    placeholder={"minimum 2"}
                    type={"number"}
                    value={val}
                    onChange={handleChange}
                ></Input>
                <MaxBtn
                    onClick={handleSelectMax}
                >MAX</MaxBtn>
            </InputView>
            <PlaceholderView
                height={isMobile ? "10px" : "20px"}
            ></PlaceholderView>
            <FlexView>
                <TitleH4
                    isDark={isDark}
                >
                    Balance(Unlocked)：{formatBalance(credaInfo.unlocked)}&nbsp;
                </TitleH4>
                <CustomIcon
                    src={ImageToken.CREDA}
                    size={20}
                    mSize={15}
                ></CustomIcon>
            </FlexView>
            <PlaceholderView
                height={isMobile ? "10px" : "20px"}
            ></PlaceholderView>
            <ChainWrapView>
                <ChainWrap>
                    <TitleH4
                        isDark={isDark}
                    >
                        {t("from")}
                    </TitleH4>
                    <SelectChain
                        isDark={isDark}
                        coins={[
                            fromInfo,
                            // toInfo
                        ]}
                        select={fromInfo}
                        onSelect={(index: number) => {
                            console.log(index)
                        }}
                    ></SelectChain>
                </ChainWrap>
                <WinView>
                    <ArrowRight
                        src={ImageCommon.icon_arrow_right}
                        marginTop={"30px"}
                        marginLeft={"60px"}
                        marginRight={"60px"}
                    ></ArrowRight>
                </WinView>
                <MobileView>
                    <ArrowRight
                        src={ImageCommon.icon_arrow_right}
                        marginTop={"20px"}
                        marginLeft={"10px"}
                        marginRight={"10px"}
                    ></ArrowRight>
                </MobileView>
                <ChainWrap>
                    <TitleH4
                        isDark={isDark}
                    >
                        {t("to")}
                    </TitleH4>
                    <SelectChain
                        isDark={isDark}
                        coins={[
                            // fromInfo,
                            toInfo
                        ]}
                        select={toInfo}
                        onSelect={(index: number) => {
                            console.log(index)
                        }}
                    ></SelectChain>
                </ChainWrap>
            </ChainWrapView>

            <PlaceholderView
                height={isMobile ? "10px" : "20px"}
            ></PlaceholderView>
            {/*<FlexView>*/}
            {/*    <TitleH4*/}
            {/*        isDark={isDark}*/}
            {/*    >*/}
            {/*        {t("serviceCharge")}：*/}
            {/*    </TitleH4>*/}
            {/*    <TitleWhite*/}
            {/*        isDark={isDark}*/}
            {/*    >{0 + ' CREDA'}</TitleWhite>*/}
            {/*</FlexView>*/}

            {/*<FlexView>*/}
            {/*    <TitleH4*/}
            {/*        isDark={isDark}*/}
            {/*    >*/}
            {/*        You will get：*/}
            {/*    </TitleH4>*/}
            {/*    <TitleWhite*/}
            {/*        isDark={isDark}*/}
            {/*    >{formatBalance(walletInfo.CREDA) + ' WCREDA'} on {chainId===ChainId.esc?"ARB":"ESC"}</TitleWhite>*/}
            {/*</FlexView>*/}
            <TitleH4
                isDark={isDark}
            >
                You will get：
            </TitleH4>
            <InputView
                marginTop={"10px"}
                isDark={isDark}
            >
                <CustomIcon
                    src={ImageToken[coinList[currentIndex].symbol]}
                    size={30}
                    mSize={20}
                ></CustomIcon>
                <Input
                    value={`${formatBalance(val) + ' WCREDA'} on ${chainId === ChainIds.esc ? "ARB" : "ESC"}`}
                    disabled={true}
                ></Input>
            </InputView>
            {approval !== ApprovalState.APPROVED ? <MainButton
                marginTop={isMobile ? "10px" : "30px"}
                onClick={approveCallback}
            >APPROVE WRAP & BRIDGE</MainButton> : <MainButton
                marginTop={isMobile ? "10px" : "30px"}
                disabled={val == '' || Number(val) < 2}
                onClick={onWrap}
            >WRAP & BRIDGE</MainButton>}
            <PlaceholderView
                height={isMobile ? "10px" : "20px"}
            ></PlaceholderView>
            <FlexView>
                <TitleH4
                    isDark={isDark}
                >
                    WCREDA on {chainId === ChainIds.esc ? "ESC" : "ARB"}：{formatBalance(wrapInfo.data)}&nbsp;
                </TitleH4>
                <CustomIcon
                    src={ImageToken.CREDA}
                    size={20}
                    mSize={15}
                ></CustomIcon>
            </FlexView>
            {approvalWCREDA !== ApprovalState.APPROVED ? <MainButton
                marginTop={isMobile ? "10px" : "30px"}
                onClick={approveWCREDACallback}
            >APPROVE UNWRAP</MainButton> : <MainButton
                marginTop={isMobile ? "10px" : "30px"}
                disabled={wrapInfo.data <= 0}
                onClick={onReceive}
            >UNWRAP</MainButton>}
        </HoleContent>
    )
});
type coin_info = {
    symbol: string,
    title: string
};
type coin = Array<coin_info>
type select_coin = {
    coins: coin,
    onSelect?: any,
    select: coin_info,
    isDark: boolean
}
const SelectCoin = React.memo(({
    coins, onSelect = () => {
    }, isDark
}: select_coin) => {
    const [dropShow, setDropShow] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    return (
        <InputView
            isDark={isDark}
            onClick={() => setDropShow(!dropShow)}
        >
            <FlexViewCenter>
                <WinView>
                    <CustomIcon
                        src={ImageToken[coins[currentIndex].symbol]}
                        size={40}
                    ></CustomIcon>
                </WinView>
                <MobileView>
                    <CustomIcon
                        src={ImageToken[coins[currentIndex].symbol]}
                        size={30}
                        mSize={20}
                    ></CustomIcon>
                </MobileView>
                <TitleH3>{coins[currentIndex].symbol}</TitleH3>
            </FlexViewCenter>
            <IconRight
                src={ImageCommon.icon_right_black}
            ></IconRight>
            {dropShow && <DropDown>
                {coins.map((item, index) => {
                    return (
                        <div
                            style={{
                                borderBottomWidth: '1px',
                                borderBottomColor: '#F0F0F0',
                                borderBottomStyle: 'solid'
                            }}
                            onClick={() => {
                                onSelect(index);
                                setCurrentIndex(index);
                            }}
                            key={'item_' + index}
                        >
                            <InputView
                                isDark={isDark}
                            >

                                <FlexViewCenter>
                                    <CustomIcon
                                        src={ImageToken[item.symbol]}
                                        size={40}
                                    ></CustomIcon>
                                    <TitleH3>{item.symbol}</TitleH3>
                                </FlexViewCenter>

                            </InputView>
                        </div>
                    )
                })}
            </DropDown>}
        </InputView>
    )
})
const SelectChain = React.memo(({
    coins, onSelect = () => {
    }, isDark
}: select_coin) => {
    const [dropShow, setDropShow] = React.useState(false);
    return (
        <ChainView
            isDark={isDark}
            marginTop={"10px"}
            onClick={() => setDropShow(!dropShow)}
        >
            <FlexViewCenter>
                <WinView>
                    <CustomIcon
                        src={ImageCommon[coins[0].symbol]}
                        size={40}
                        mSize={20}
                    ></CustomIcon>
                </WinView>
                <MobileView>
                    <CustomIcon
                        src={ImageCommon[coins[0].symbol]}
                        size={30}
                        mSize={20}
                    ></CustomIcon>
                </MobileView>
                <TitleH3>{coins[0].title}</TitleH3>
            </FlexViewCenter>
            <IconRight
                src={ImageCommon.icon_right_black}
            ></IconRight>
            {dropShow && <DropDown>
                {coins.map((item, index) => {
                    return (
                        <div
                            style={{
                                borderBottomWidth: '1px',
                                borderBottomColor: '#F0F0F0',
                                borderBottomStyle: 'solid'
                            }}
                            onClick={() => onSelect(index)}
                            key={'item_' + index}
                        >
                            <InputView
                                isDark={isDark}
                            >

                                <FlexViewCenter>
                                    <CustomIcon
                                        src={ImageCommon[item.symbol]}
                                        size={40}
                                    ></CustomIcon>
                                    <TitleH3>{item.title}</TitleH3>
                                </FlexViewCenter>

                            </InputView>
                        </div>
                    )
                })}
            </DropDown>}
        </ChainView>
    )
})
interface ITheme {
    isDark: boolean;
}
type placeholder_view = {
    height: string;
}
export const PlaceholderView = styled.div<placeholder_view>`
    height:${props => props.height};
`
const DropDown = styled.div`
    position:absolute;
    left:0;
    right:0;
    top:85%;
    background-color:${colors.white};
    z-index:999;
    border-bottom-left-radius:20px;
    border-bottom-right-radius:20px;
    overflow:hidden;
`
const HoleContent = styled.div<ITheme>`
    width: 690px;
  background: ${colors.background};
    border-radius: 20px;
    padding-top:30px;
    padding-bottom:30px;
    padding-left:70px;
    padding-right:70px;
    position:relative;
  ${props => props.isDark && css`

    background: ${colors.dark_background};
  `}
    @media (max-width: 768px) {
        width: 90%;
        padding-left:20px;
        padding-right:20px;
   };
`
const TabTitle = styled.div`
    font-size: 20px;
    font-weight: 800;
    color: ${colors.white};
    cursor:pointer;
     @media (max-width: 768px) {
        font-size: 15px;
    };
`

const TabTitleActive = styled(TabTitle)`
    color: ${colors.main};
    cursor:pointer;
`

const TitleH4 = styled(FlexView) <ITheme>`
    font-size: 18px;
    font-weight: 400;
    color: ${colors.black};
  ${props => props.isDark && css`
    color: ${colors.white};
  `}
     @media (max-width: 768px) {
        font-size: 12px;
    };
`
const TitleWhite = styled.div<ITheme>`
    font-size: 16px;
    font-weight: 800;
    color: ${colors.black_7};
  ${props => props.isDark && css`
    color: ${colors.white};
  `};
  @media (max-width: 768px){
  font-size: 12px;
}
`
const TitleH3 = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: ${colors.black};
    margin-left:5px;
    @media (max-width: 768px) {
        font-size: 14px;
    };
`
const InputView = styled(FlexViewBetween) <ITheme>`
    height: 60px;
  background: #eeeeee;
    border-radius: 10px;
    padding-left:20px;
    padding-right:20px;
    width:100%;
    position:relative;
    cursor:pointer;
  ${props => props.isDark && css`
    background: ${colors.white};
  `};
    @media (max-width: 768px) {
        padding-left:5px;
        padding-right:5px;
        height: 40px;
    };
`
const ChainView = styled(InputView)`
    height: 100px;
    @media (max-width: 768px) {
       height: 50px;
      padding:0 10px;
   };
`
const ChainWrap = styled.div`
    flex:1;
     @media (max-width: 768px) {
       width:100%;
      };
`
type arrow_right = {
    marginTop?: string,
    marginLeft?: string,
    marginRight?: string,
}
const ArrowRight = styled.img<arrow_right>`
    src:${props => props.src};
    width: auto;
    height: 24px;
    margin-left:${props => props.marginLeft};
    margin-right:${props => props.marginRight};
    margin-top:${props => props.marginTop};
    @media (max-width: 768px) {
       height: 15px;
      };
`
const Input = styled.input`
    flex:1;
    border: 0px;
    background-color: transparent;
    outline: none;
    height:100%;
  font-size: 22px;
  text-align: right;
    &:focus{
       outline: none;
    }
  @media (max-width: 768px){
    font-size: 12px;
  }
`
const MaxBtn = styled(FlexViewCenter)`
     width: 70px;
    height: 40px;
    background: ${colors.main};
    border-radius: 10px;
    cursor:pointer;
    color:${colors.white};
     @media (max-width: 768px) {
        width: 50px;
        height: 30px;
      };
`
const AcrossView = styled(FlexViewAround)`
    border: 2px solid ${colors.main};
    border-radius: 10px;
    padding:20px;
     @media (max-width: 768px) {
       margin-bottom:10px;
       padding:10px;
      };
`
const LogoView = styled.img`
    src:${props => props.src};
    width:auto;
    height:50px;
     @media (max-width: 768px) {
       height:25px;
      };
`
const AcrossItemView = styled(AcrossView)`
    display:block;
    height:300px;
`
const AcrossInputView = styled(FlexViewCenter)`
    padding:10px;
    border: 1px solid ${colors.white};
    border-radius: 10px;
`
const AcrossInput = styled(Input)`
    font-size: 12px;
    font-weight: 400;
    color: #6E6E6E;
`
const AcrossBtn = styled(FlexViewCenter)`
     width: 40px;
    height: 26px;
    background: ${colors.main};
    border-radius: 10px;
    cursor:pointer;
`
const AcrossSymbolTitle = styled(FlexViewCenter)`
    font-size: 30px;
    font-weight: 500;
    color: ${colors.white};
     @media (max-width: 768px) {
        font-size: 18px;
        font-weight:bold;
        margin-top:20px;
        margin-bottom:20px;
      };
`
const AcrossSymbolAmount = styled(FlexViewCenter)`
   font-size: 30px;
    font-weight: bold;
    color: ${colors.main};
     @media (max-width: 768px) {
         font-size: 18px;
          margin-bottom:38px;
      };
`
const IconRight = styled.img`
    src:${props => props.src};
    width: auto;
    height: 20px;
     @media (max-width: 768px) {
        height: 10px;
      };
`
const IconBottom = styled.img`
    src:${props => props.src};
    width: 20px;
    height: 11px;
`
type tab_flag = {
    left?: string
}
const TabFlag = styled.div<tab_flag>`
    width: 60px;
    height: 2px;
    background: ${colors.main};
    margin-top:10px;
    position:relative;
    transform:translateX(${props => props.left});
    transition: all 0.5s ease-in-out;
`
const ChainWrapView = styled(FlexViewBetween)`

`
const CrossInfoView = styled(FlexViewCenter)`
    flex-direction:column;

`
const PositionView = styled.div`
    position:relative;
    top:-20px;
    @media (max-width: 768px) {
        top:-50px;
    };
`
type main_button = {
    marginTop?: string,
    disabled?: boolean,
}
export const MainButton = styled(FlexViewCenter) <main_button>`
    height: 60px;
    background: ${props => props.disabled ? colors.disabled : colors.main};
    border-radius: 10px;
    font-size: 24px;
    font-weight: bold;
    color: ${colors.white};
    margin-top:${props => props.marginTop};
    cursor:pointer;
    pointer-events:${props => props.disabled ? "none" : "auto"};
     @media (max-width: 768px) {
       height: 40px;
       font-size: 18px;
    };
`
