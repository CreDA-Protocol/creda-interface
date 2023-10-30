import { Column } from "@components/Column";
import { ProfileLoading } from "@components/Common";
import { useBoxProjectAll } from "src/contract";
import { ChainType } from "../../configs/chainsConfig";
import { ProjectItem } from "../project/ProjectItem";

export function PortfolioDiv({ project, chainType }: any) {
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
    <Column style={{ width: "100%", marginTop: 30 }}>
      {projectsFilterRes.map((item: any, index: number) => {
        return <ProjectItem item={item}></ProjectItem>;
      })}
    </Column>
  );
}