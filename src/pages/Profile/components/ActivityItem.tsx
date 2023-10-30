import { Column } from "@components/Column";
import { useState } from "react";
import { ActivityDiv } from "./ActivityDiv";
import { Wrap } from "./Wrap";

function ActivityItem() {
  const [chainIndex, setChainIndex] = useState(0);

  function changChainIndex(index: number) {
    setChainIndex(index);
  }

  return (
    <Column style={{ width: "100%" }}>
      <Wrap onIndexChange={changChainIndex} selectIndex={chainIndex} />
      <ActivityDiv />
    </Column>
  );
}