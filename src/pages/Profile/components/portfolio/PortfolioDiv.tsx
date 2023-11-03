import { Column } from "@components/Column";
import { ProfileLoading } from "@components/Common";
import { ChainId } from "@lychees/uniscam-sdk";
import { usePortfolioAllWalletProjects } from "@services/portfolio/portfolio.service";
import { FC } from "react";
import { isMobile } from "react-device-detect";
import { PortfolioItemDiv } from "./PortfolioItemDiv";
import { PortfolioPhoneItemDiv } from "./PortfolioPhoneItemDiv";

export const PortfolioDiv: FC<{
  chainId: ChainId;
}> = ({ chainId }) => {
  const allProjectsDataset = usePortfolioAllWalletProjects(chainId);
  const projects = allProjectsDataset.data;

  // Keep only projects with positive balance assets
  const projectsWithAssets = projects?.filter(project => project?.value > 0);

  // Sort projects by asset name
  projectsWithAssets.sort((a, b) => {
    return b.value - a.value;
  });

  if (allProjectsDataset.loading)
    return <ProfileLoading loading={allProjectsDataset.loading}></ProfileLoading>;

  return (
    <Column style={{ width: "100%", marginTop: 30 }}>
      {!isMobile && projectsWithAssets.map((item, index) => {
        return <PortfolioItemDiv item={item} key={index}></PortfolioItemDiv>;
      })}
      {isMobile && projectsWithAssets.map((item, index) => {
        return <PortfolioPhoneItemDiv item={item} key={index}></PortfolioPhoneItemDiv>;
      })}
    </Column>
  );
}