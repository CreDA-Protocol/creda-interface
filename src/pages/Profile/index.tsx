import {
    CustomGrid,
    FontPoppins,
    GradientButton,
    RowBetween,
    RowCenter,
    SpaceWidth
} from "@components/Row";
import AppBody, { MainFullBody } from "@pages/components/AppBody";

import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

import { FlexView } from "@components/Common";
import ConnectToWalletModal from "@components/ConnectToWalletModal";
import { H4 } from "@components/ConnectWallet";
import SwitchNetworkModal from "@components/SwitchNetworkModal";
import { ThemeText, ThemeTextEqure } from "@components/ThemeComponent";
import { chainFromId } from "@services/chain.service";
import { useCreditInfo } from "@services/credit.service";
import { formatAccount } from "../../common/Common";
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";
import { useOpenWarning, useWalkThroughStep } from "../../states/application/hooks";
import { Segment } from "./components/Segment";
import { Body } from './components/StyledComponents';
import { TopHeader } from "./components/TopHeader";
import { ApprovalSegment } from "./components/approvals/ApprovalSegment";
import { BindInput } from "./components/did/BindInput";
import { CopyAccount } from "./components/did/CopyAccount";
import { PortfolioSegment } from "./components/portfolio/PortfolioSegment";
import { WalletSegment } from "./components/wallet/WalletSegment";

function Profile(props: any) {
    const [connectToModal, setConnectToModal] = useState(false);
    const { account, isaccountLoading } = useContext(WalletAddressContext);
    const { chainId } = useContext(NetworkTypeContext);
    const network = chainFromId(chainId);
    const [segmentIndex, setSegmentIndex] = useState(0);
    const showWarning = useOpenWarning(true);
    const creditInfo = useCreditInfo();
    const walkThroughStep = useWalkThroughStep();
    const [switchNetworkModal, setSwitchNetworkModal] = useState(false);

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

    function onSegmentSelect(index: number) {
        setSegmentIndex(index);
    }

    function switchNetwork() {
        setSwitchNetworkModal(true)
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
                                <BindInput></BindInput>
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
                                onClick={switchNetwork}
                            >
                                {account && network &&
                                    <H4>{network.toUpperCase()}</H4>
                                }
                                {account && !network &&
                                    <H4> Wrong NetWork</H4>
                                }
                                {!account &&
                                    <H4> Not Connected</H4>
                                }
                            </GradientButton>
                            <SwitchNetworkModal
                                show={switchNetworkModal}
                                onDismiss={() => {
                                    setSwitchNetworkModal(false);
                                }}
                            ></SwitchNetworkModal>
                        </CustomGrid>
                    </RowBetween>

                    {/* Header with credit score, mint cnft, total assets value */}
                    <TopHeader walkThroughStep={walkThroughStep} />

                    <RowCenter>
                        <Segment onSegmentSelect={onSegmentSelect} />
                    </RowCenter>
                    {segmentIndex === 0 ? (
                        <WalletSegment />
                    ) : segmentIndex === 1 ?
                        <PortfolioSegment />
                        : <ApprovalSegment />
                    }
                </Body>
            </AppBody>
        </MainFullBody>
    );
}

export default Profile;