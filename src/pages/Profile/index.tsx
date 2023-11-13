import { Body, FlexView } from "@components/Common";
import { ConnectToWalletModal } from "@components/ConnectToWalletModal";
import { NetworkInfo } from "@components/NetworkInfo";
import { RowBetween, RowCenter, SpaceWidth } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { AppBody, MainFullBody } from "@pages/AppBody";
import { useCreditInfo } from "@services/credit.service";
import { useOpenWarning, useWalkThroughStep } from "@states/application/hooks";
import { useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { formatAccount } from "../../common/Common";
import { WalletAddressContext } from "../../contexts";
import { Segment } from "./components/Segment";
import { TopHeader } from "./components/TopHeader";
import { ApprovalSegment } from "./components/approvals/ApprovalSegment";
import { BindInput } from "./components/did/BindInput";
import { CopyAccount } from "./components/did/CopyAccount";
import { PortfolioSegment } from "./components/portfolio/PortfolioSegment";
import { WalletSegment } from "./components/wallet/WalletSegment";

function Profile(props: any) {
    const [connectToModal, setConnectToModal] = useState(false);
    const { account, isaccountLoading } = useContext(WalletAddressContext);
    const [segmentIndex, setSegmentIndex] = useState(0);
    const showWarning = useOpenWarning(true);
    const creditInfo = useCreditInfo();
    const walkThroughStep = useWalkThroughStep();

    console.log("xxxx", !account && !isaccountLoading && (walkThroughStep === 5 || walkThroughStep === 1))

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

    return (
        <MainFullBody history={props.history}>
            {
                props.location.props !== "fromConnectWallet" &&
                <ConnectToWalletModal
                    show={!account && !isaccountLoading && connectToModal && (walkThroughStep === 5 || walkThroughStep === 1)}
                    onDismiss={() => { setConnectToModal(false) }}
                />
            }

            <AppBody history={props.history}>
                <Body style={{ width: '100%', paddingRight: 20 }}>
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
                        <NetworkInfo />
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