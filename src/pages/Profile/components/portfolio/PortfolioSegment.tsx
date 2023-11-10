import { Column } from "@components/Column";
import { FC, useState } from "react";
import { Wrap } from "../Wrap";
import { PortfolioDiv } from "./PortfolioDiv";
import { chainIndexToId } from "@services/chains/chain-configs";

export const PortfolioSegment: FC = () => {
  const [chainIndex, setChainIndex] = useState(0);

  function changChainIndex(index: number) {
    setChainIndex(index);
  }

  return (
    <Column style={{ width: "100%" }}>
      <Wrap onIndexChange={changChainIndex} selectedIndex={chainIndex} />
      <PortfolioDiv chainId={chainIndexToId[chainIndex]} />
    </Column>
  );
}