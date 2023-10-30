import { Column } from "@components/Column";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { useBoxApproveList } from "src/contract";
import { ChainType, chainIndexToId } from "../chainsConfig";
import { ApprovalDiv } from "./ApprovalDiv";
import { ApprovalPhoneDiv } from "./ApprovalPhoneDiv";
import { Wrap } from "./Wrap";

export function ApprovalItem() {
  const [chainIndex, setChainIndex] = useState(0);
  const approveList = useBoxApproveList(ChainType[chainIndexToId[chainIndex]]);

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