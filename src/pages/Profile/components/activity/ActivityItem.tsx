import { Column } from "@components/Column";
import { useState } from "react";
import { Wrap } from "../Wrap";
import { ActivityDiv } from "./ActivityDiv";

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