import { ChainIdConfig } from "@common/Common";
import { ProfileLoading } from "@components/Common";
import { RowBetween, SpaceHeight, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { ChainId, ChainType, chainFromId } from "@services/chain.service";
import { switchNetwork } from "@services/network.service";
import { PortfolioDataset } from "@services/portfolio/model/dataset";
import { PortfolioApprovedToken } from "@services/portfolio/model/portfolio-approved-token";
import { FC } from "react";
import { useTheme } from "src/state/application/hooks";
import { BGDiv } from "../StyledComponents";
import { ApproveItem } from "./ApproveItem";

export const ApprovalDiv: FC<{
  data: PortfolioDataset<PortfolioApprovedToken[]>;
  chainId: ChainId;
}> = ({ data, chainId }) => {
  const netType = ChainType[chainId];
  const network = chainFromId(chainId);
  const themeDark = useTheme();

  function cancel(cancelApprove: () => void) {
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