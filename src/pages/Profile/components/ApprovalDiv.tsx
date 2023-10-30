import { chainFromId, switchNetwork, ChainIdConfig } from "@common/Common";
import { ProfileLoading } from "@components/Common";
import { RowBetween, TextEqure, SpaceHeight } from "@components/Row";
import { useContext } from "react";
import { NetworkTypeContext } from "src/contexts";
import { useTheme } from "styled-components";
import { ApproveItem } from "./ApproveItem";
import { BGDiv } from "./StyledComponents";

export function ApprovalDiv({ data, netType }: any) {
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