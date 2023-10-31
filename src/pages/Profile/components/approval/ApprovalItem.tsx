import { chainFromId } from "@common/Common";
import { Column } from "@components/Column";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { ChainType, chainIndexToId } from "../../configs/chainsConfig";
import { Wrap } from "../Wrap";
import { ApprovalDiv } from "./ApprovalDiv";
import { ApprovalPhoneDiv } from "./ApprovalPhoneDiv";
import { useBoxApproveList } from "@services/portfolio.service";

export function ApprovalItem() {
  const [chainIndex, setChainIndex] = useState(0);
  const approveList = useBoxApproveList(chainFromId(chainIndexToId[chainIndex]));

  function changeChainIndex(index: number) {
    setChainIndex(index);
  }

  return (
    <Column style={{ width: "100%" }}>
      <Wrap onIndexChange={changeChainIndex} selectIndex={chainIndex} />
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