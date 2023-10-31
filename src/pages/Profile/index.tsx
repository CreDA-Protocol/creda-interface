import ImageCommon from "@assets/common/ImageCommon";
import creditScore from '@assets/lottie/CreDa_creditScore_animation.json';
import { Column } from "@components/Column";
import {
    CustomGrid,
    FontPoppins,
    GradientButton,
    RowBetween,
    RowCenter,
    RowFixed,
    SpaceHeight,
    SpaceWidth,
    TextEqure,
} from "@components/Row";
import AppBody, { MainFullBody } from "@pages/components/AppBody";
import styled from "styled-components";

import BNB from "@assets/tokens/Binance Coin (BNB).png";
import ESC from "@assets/tokens/ELA.png";
import ETH from "@assets/tokens/Ethereum (ETH).png";
import { Lottie } from "@crello/react-lottie";
import { TransactionResponse } from "@ethersproject/providers";
import { message } from "antd";
import copy from "copy-to-clipboard";
import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

import { BlueButton, FlexView, WhiteButton } from "@components/Common";
import ConnectToWalletModal from "@components/ConnectToWalletModal";
import { H4 } from "@components/ConnectWallet";
import CustomStakeModal from "@components/CustomStakeModal";
import { ThemeText, ThemeTextEqure } from "@components/ThemeComponent";
import { useCNFTInfo, useCreditInfo, useCreditScore } from "@services/credit.service";
import { usePortfolioWalletTokenList } from "@services/portfolio.service";
import { useApprove } from "@services/tokens.service";
import {
    ApprovalState,
    ChainIds,
    GasInfo,
    balanceToBigNumber,
    chainFromId,
    enableNetwork,
    formatAccount,
    formatBalance,
    getNFTCardBgImage,
    tipError
} from "../../common/Common";
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";
import ContractConfig from "../../contract/ContractConfig";
import { useContract } from "../../hooks/useContract";
import { LoadingContext, LoadingType } from "../../provider/LoadingProvider";
import { useOpenWarnning, useTheme, useWalkThroughStep, } from "../../state/application/hooks";
import { ToastStatus, useAddToast } from "../../state/toast";
import { useTransactionAdder } from "../../state/transactions/hooks";
import { Segment } from "./components/Segment";
import { AddressText, BGDiv, Body, CenterItemDiv, ColorDiv, ColorDivNoBorder, CopyIcon, IconIcon, IconIconBlue, LineH, LineV, MoreIcon, NFTBgImage, TopItemDiv } from './components/StyledComponents';
import { WalletDiv } from "./components/WalletDiv";
import { Wrap } from "./components/Wrap";
import { ApprovalItem } from "./components/approval/ApprovalItem";
import { PortfolioItem } from "./components/portfolio/PortfolioItem";
import { chainIndexToId, chainTitles } from './configs/chainsConfig';

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
    const walletList = usePortfolioWalletTokenList(chainIndexToId[chainIndex]);
    const walletListEth = usePortfolioWalletTokenList(chainIndexToId[0]);
    const walletListBsc = usePortfolioWalletTokenList(chainIndexToId[1]);
    const walletListEsc = usePortfolioWalletTokenList(chainIndexToId[2]);
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

export default Profile;