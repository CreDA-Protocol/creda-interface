import { Column } from "@components/Column";
import { useAvailablePortfolioProjects } from "@services/portfolio.service";
import { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import { chainIndexToId } from "../../configs/chainsConfig";
import { Wrap } from "../Wrap";
import { PortfolioDiv } from "./PortfolioDiv";
import { PortfolioPhoneDiv } from "./PortfolioPhoneDiv";

export const PortfolioItem: FC = () => {
  const [chainIndex, setChainIndex] = useState(0);
  const availableDefiProjects = useAvailablePortfolioProjects();

  function changChainIndex(index: number) {
    setChainIndex(index);
  }

  return (
    <Column style={{ width: "100%" }}>
      <Wrap onIndexChange={changChainIndex} selectIndex={chainIndex} />
      {isMobile ? (
        <PortfolioPhoneDiv
          availableProjects={availableDefiProjects}
          chainType={chainIndexToId[chainIndex]}
        />
      ) : (
        <PortfolioDiv availableProjects={availableDefiProjects} chainType={chainIndexToId[chainIndex]} />
      )}
    </Column>
  );
}