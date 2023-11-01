import { Column } from "@components/Column";
import { ProfileLoading } from "@components/Common";
import { ChainId } from "@lychees/uniscam-sdk";
import { PortfolioAvailableProjects, usePortfolioAllWalletProjects } from "@services/portfolio/portfolio.service";
import { FC } from "react";
import { ChainType } from "../../configs/chainsConfig";
import { ProjectItem } from "../project/ProjectItem";

export const PortfolioDiv: FC<{
  availableProjects: PortfolioAvailableProjects;
  chainType: ChainId;
}> = ({ availableProjects, chainType }) => {
  const activeChainProjects = Object.values(availableProjects[chainType] || []);
  const projectNames = activeChainProjects.map(project => project.name);
  const allProjectsDataset = usePortfolioAllWalletProjects(ChainType[chainType], projectNames);
  const projects = allProjectsDataset.data;

  // Keep only projects with positive balance assets
  const projectsWithAssets = projects?.filter(currentValue => currentValue?.asset > 0);

  // Sort projects by asset name
  projectsWithAssets.sort((a: any, b: any) => {
    return b.asset - a.asset;
  });

  if (allProjectsDataset.loading)
    return <ProfileLoading loading={allProjectsDataset.loading}></ProfileLoading>;

  return (
    <Column style={{ width: "100%", marginTop: 30 }}>
      {projectsWithAssets.map((item: any, index: number) => {
        return <ProjectItem item={item}></ProjectItem>;
      })}
    </Column>
  );
}