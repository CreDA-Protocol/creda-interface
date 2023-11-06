import ImageCommon from "@assets/common/ImageCommon";
import ImageToken from "@assets/tokens/ImageToken";
import { formatBalance } from "@common/Common";
import { Column } from "@components/Column";
import { RowFixed, SpaceHeight, SpaceWidth, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { chainIndexToId, chainTitles } from "@services/chain.service";
import { usePortfolioWalletTokenList } from "@services/portfolio/portfolio.service";
import { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTheme } from "styled-components";
import { BGDiv, CenterItemDiv, IconIcon, IconIconBlue, LineH, LineV, MoreIcon } from "../StyledComponents";
import { Wrap } from "../Wrap";
import { WalletDiv } from "./WalletDiv";

export const WalletSegment: FC = () => {
  const [chainIndex, setChainIndex] = useState(0);
  const activeChainId = chainIndexToId[chainIndex];
  const walletList = usePortfolioWalletTokenList(activeChainId);
  const walletListEth = usePortfolioWalletTokenList(chainIndexToId[0]);
  const walletListBsc = usePortfolioWalletTokenList(chainIndexToId[1]);
  const walletListEsc = usePortfolioWalletTokenList(chainIndexToId[2]);
  const themeDark = useTheme();

  return (
    <>
      <Wrap
        onIndexChange={index => setChainIndex(index)}
        selectedIndex={chainIndex}
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
              <IconIcon src={ImageToken.ETH} />
              <Column>
                <TextEqure fontColor={"#777E90"} fontSize={16}>
                  Assets on Ethereum
                </TextEqure>
                <RowFixed>
                  <ThemeTextEqure fontWeight={"bold"} fontSize={30}>
                    ${formatBalance(walletListEth.data?.total)}
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
              <IconIcon src={ImageToken.BSC} />
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
              <IconIcon src={ImageToken.ELA} />
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
      <WalletDiv data={walletList} chainTitle={chainTitles[chainIndexToId[chainIndex]]} chainId={activeChainId} />
    </>
  )
}