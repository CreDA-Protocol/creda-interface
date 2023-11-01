import { ChainId } from "@common/Common";
import { Column } from "@components/Column";
import { ProfileLoading } from "@components/Common";
import { PortfolioAvailableProjects, usePortfolioAllWalletProjects } from "@services/portfolio/portfolio.service";
import { FC } from "react";
import { ChainType } from "../../configs/chainsConfig";
import { PortfolioPhoneItemDiv } from "./PortfolioPhoneItemDiv";

export const PortfolioPhoneDiv: FC<{
  availableProjects: PortfolioAvailableProjects;
  chainType: ChainId;
}> = ({ availableProjects, chainType }) => {
  const activeChainProjects = Object.values(availableProjects[chainType] || []);
  const projectNames = activeChainProjects.map(item => item.name);
  const allProjectsDataset = usePortfolioAllWalletProjects(ChainType[chainType], projectNames);
  const projects = allProjectsDataset?.data;

  // Keep only projects with positive balance assets
  const projectsWithAssets = projects?.filter(currentValue => currentValue?.asset > 0);

  // Sort projects by asset name
  projectsWithAssets.sort((a: any, b: any) => {
    return b.asset - a.asset;
  });

  if (allProjectsDataset.loading)
    return <ProfileLoading loading={allProjectsDataset.loading}></ProfileLoading>;

  return (
    <Column style={{ width: "100%", marginTop: 15 }}>
      {projectsWithAssets.map((item: any, index: number) => {
        return <PortfolioPhoneItemDiv item={item}></PortfolioPhoneItemDiv>;
      })}
    </Column>
  );
}