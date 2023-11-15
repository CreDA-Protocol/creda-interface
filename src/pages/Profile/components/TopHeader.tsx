import creditScore from '@assets/lottie/CreDa_creditScore_animation.json';
import { ApprovalState, GasInfo, balanceToBigNumber, enableNetwork, formatBalance, tipError } from "@common/Common";
import { Column } from "@components/Column";
import { BlueButton, FlexView } from "@components/Common";
import { CustomStakeModal } from '@components/CustomStakeModal';
import { GradientButton, RowBetween, RowFixed, SpaceHeight, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { Lottie } from "@crello/react-lottie";
import { TransactionResponse } from "@ethersproject/providers";
import { chainIndexToId } from "@services/chains/chain-configs";
import { chainFromId } from '@services/chains/chain.service';
import { useContract } from '@services/contracts.service';
import { getNFTCardBgImage, useCNFTInfo } from "@services/credit.service";
import { usePortfolioWalletTokenList } from "@services/portfolio/portfolio.service";
import { useApprove } from '@services/tokens.service';
import { FC, useContext, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { NetworkTypeContext } from "src/contexts";
import { ContractConfig } from 'src/contract/ContractConfig';
import { LoadingContext, LoadingType } from "src/provider/LoadingProvider";
import { useTheme } from 'src/states/application/hooks';
import { ToastStatus, useAddToast } from "src/states/toast";
import { useTransactionAdder } from "src/states/transactions/hooks";
import { Score } from './Score';
import { ColorDiv, ColorDivNoBorder, NFTBgImage, TopItemDiv } from "./StyledComponents";

enum StakeType {
  hidden = 0,
  mint = 1,
  upgrade = 2,
}

export const TopHeader: FC<{
  walkThroughStep: number;
}> = ({ walkThroughStep }) => {
  const [stopAnimation, setStopAnimation] = useState(false)
  const { chainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);
  const walletListEth = usePortfolioWalletTokenList(chainIndexToId[0]);
  const walletListBsc = usePortfolioWalletTokenList(chainIndexToId[1]);
  const walletListEsc = usePortfolioWalletTokenList(chainIndexToId[2]);

  const addTransaction = useTransactionAdder();
  const addToast = useAddToast();
  const loading = useContext(LoadingContext)
  const themeDark = useTheme();
  const [modalType, setModalType] = useState(StakeType.hidden);
  const cnftInfo = useCNFTInfo();
  const [approval, approveCallback] = useApprove(
    ContractConfig.CREDA[network]?.address,
    ContractConfig.CreditNFT[network]?.address,
    true
  );

  const CredaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi)
  const CNFTContract = useContract(
    ContractConfig.CreditNFT[network]?.address,
    ContractConfig.CreditNFT[network]?.abi || ContractConfig.CreditNFT.abi
  );

  function mintCNFT() {
    if (approval !== ApprovalState.APPROVED && enableNetwork(chainId)) {
      approveCallback();
      return;
    }
    loading.show(LoadingType.confirm, "Mint NFT")
    CNFTContract?.mintNFT(GasInfo)
      .then(async (response: TransactionResponse) => {
        console.log("CNFTContract.mintNFT response:", response)
        loading.show(LoadingType.pending, response.hash)
        await response.wait();
        loading.show(LoadingType.success, response.hash)
      })
      .catch((err: any) => {
        // addToast(ToastStatus.error, err.data?.message);
        console.log("CNFTContract.mintNFT error:", err)
        loading.show(LoadingType.error, err.reason || err.message)
        tipError(err);
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

  useEffect(() => {
    setTimeout(() => {
      setStopAnimation(true)
    }, 1800);
  }, [stopAnimation])

  return (
    <section style={{ position: "relative", width: "100%" }}>
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

            {/* Credit score information + sync button */}
            <div
              style={{
                position: "absolute",
                top: isMobile ? "147px" : "195px",
                left: isMobile ? "160px" : "200px",
              }}
            >
              <Score walkThroughStep={walkThroughStep} />
            </div>
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
                  <GradientButton style={{ zIndex: walkThroughStep === 3 ? 700 : 0 }} onClick={mintCNFT}>
                    {enableNetwork(chainId) ? (approval === ApprovalState.APPROVED ? "Mint" : "Approve") : "Mint"}
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
              {(cnftInfo.no > 0) && CredaContract && (
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
      <CustomStakeModal
        show={modalType !== StakeType.hidden}
        title={modalType === StakeType.mint ? "Mint" : "Upgrade"}
        onDismiss={() => setModalType(StakeType.hidden)}
        maxNum={cnftInfo.balance}
        onConfirm={onUpgrade}
      ></CustomStakeModal>
    </section>
  )
}