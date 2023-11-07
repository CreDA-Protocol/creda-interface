import { Column } from "@components/Column";
import { ChainType, chainIndexToId } from "@services/chain.service";
import { usePortfolioApprovalsList } from "@services/portfolio/portfolio.service";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { Wrap } from "../Wrap";
import { ApprovalDiv } from "./ApprovalDiv";
import { ApprovalPhoneDiv } from "./ApprovalPhoneDiv";

export function ApprovalSegment() {
  const [chainIndex, setChainIndex] = useState(0);
  const approveList = usePortfolioApprovalsList(chainIndexToId[chainIndex]);

  function changeChainIndex(index: number) {
    setChainIndex(index);
  }

  return (
    <Column style={{ width: "100%" }}>
      <Wrap onIndexChange={changeChainIndex} selectedIndex={chainIndex} />
      {isMobile ? (
        <ApprovalPhoneDiv
          data={approveList}
          netType={ChainType[chainIndexToId[chainIndex]]}
        />
      ) : (
        <ApprovalDiv
          data={approveList}
          netType={ChainType[chainIndexToId[chainIndex]]}
        />
      )}
    </Column>
  );
}