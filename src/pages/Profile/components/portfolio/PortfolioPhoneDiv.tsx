import { Column } from "@components/Column";
import { ProfileLoading } from "@components/Common";
import { FC } from "react";
import { useBoxProjectAll } from "src/contract";
import { ChainType } from "../../configs/chainsConfig";
import { PortfolioPhoneItemDiv } from "./PortfolioPhoneItemDiv";

export const PortfolioPhoneDiv: FC<{
  project: any,
  chainType: number
}> = ({ project, chainType }) => {
  const data = Object.values(project[chainType] || {});

  const projectNames = data.map((item: any, index: number) => {
    return item.name;
  });
  const allProject = useBoxProjectAll(ChainType[chainType], projectNames);
  const projects = allProject.data;
  const projectsFilterRes = projects.filter(
    (currentValue: any, index: number, arr: any) => {
      return currentValue?.asset > 0;
    }
  );
  projectsFilterRes.sort((a: any, b: any) => {
    return b.asset - a.asset;
  });
  if (allProject.loading) {
    return <ProfileLoading loading={allProject.loading}></ProfileLoading>;
  }
  return (
    <Column style={{ width: "100%", marginTop: 15 }}>
      {projectsFilterRes.map((item: any, index: number) => {
        return <PortfolioPhoneItemDiv item={item}></PortfolioPhoneItemDiv>;
      })}
    </Column>
  );
}