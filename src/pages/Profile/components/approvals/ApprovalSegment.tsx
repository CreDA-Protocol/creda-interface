import { Column } from "@components/Column";
import { usePortfolioApprovalsList } from "@services/portfolio/portfolio.service";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { Wrap } from "../Wrap";
import { ApprovalDiv } from "./ApprovalDiv";
import { ApprovalPhoneDiv } from "./ApprovalPhoneDiv";
import { chainIndexToId } from "@services/chains/chain-configs";

export function ApprovalSegment() {
  const [chainIndex, setChainIndex] = useState(0);
  const approveList = usePortfolioApprovalsList(chainIndexToId[chainIndex]);
  const chainId = chainIndexToId[chainIndex];

  function changeChainIndex(index: number) {
    setChainIndex(index);
  }

  return (
    <Column style={{ width: "100%" }}>
      <Wrap onIndexChange={changeChainIndex} selectedIndex={chainIndex} />
      {isMobile ? (
        <ApprovalPhoneDiv
          data={approveList}
          chainId={chainId}
        />
      ) : (
        <ApprovalDiv
          data={approveList}
          chainId={chainId}
        />
      )}
    </Column>
  );
}