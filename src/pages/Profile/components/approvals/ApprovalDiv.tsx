import { ProfileLoading } from "@components/Common";
import { RowBetween, SpaceHeight, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { ChainId, switchNetwork } from "@services/chains/chain.service";
import { PortfolioDataset } from "@services/portfolio/model/dataset";
import { PortfolioApprovedToken } from "@services/portfolio/model/portfolio-approved-token";
import { FC, useContext } from "react";
import { NetworkTypeContext } from "src/contexts";
import { useTheme } from "src/states/application/hooks";
import { BGDiv } from "../StyledComponents";
import { ApproveItem } from "./ApproveItem";

export const ApprovalDiv: FC<{
  data: PortfolioDataset<PortfolioApprovedToken[]>;
  chainId: ChainId; // Chain ID for which we are showing approvals
}> = ({ data, chainId }) => {
  const { chainId: activeChainId } = useContext(NetworkTypeContext);
  const themeDark = useTheme();

  function cancel(cancelApprove: () => void) {
    if (chainId === activeChainId) {
      cancelApprove && cancelApprove();
    } else {
      switchNetwork(chainId);
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
          <RowBetween style={{ flex: 1 }}>
            <TextEqure
              style={{ marginLeft: 24 }}
              fontColor={"#777E90"}
              fontSize={18}
            >
              Project/Contract
            </TextEqure>
          </RowBetween>
          <TextEqure
            style={{ flex: 1, marginLeft: 30 }}
            fontColor={"#777E90"}
            fontSize={18}
          >
            Exposure to spender
          </TextEqure>
        </RowBetween>
      </RowBetween>
      <SpaceHeight height={30} heightApp={15} />
      <ProfileLoading loading={data.loading}></ProfileLoading>
      {!data.loading && data.data?.map((item, index) => {
        return <ApproveItem token={item} cancel={cancel} chainId={chainId} key={index}></ApproveItem>;
      })}
      {!data.loading && data.data?.length === 0 && <ThemeTextEqure fontSize={18} fontWeight={"bold"} style={{ textAlign: "center" }}>
        Nothing approved on this network, all good.
      </ThemeTextEqure>}
    </BGDiv>
  );
}