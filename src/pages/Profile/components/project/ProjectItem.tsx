import { formatBalance } from "@common/Common";
import { Column } from "@components/Column";
import { RowBetween, RowFixed, SpaceWidth, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { ProfileProjectsConfig } from "../../projectsConfig";
import { SmallIconIcon } from "../StyledComponents";
import { ProjectBankItem } from "./ProjectBankItem";

export function ProjectItem({ item }: any) {
  return (
    <Column style={{ width: "100%" }}>
      <RowBetween>
        <RowFixed>
          <SmallIconIcon src={item.icon} />
          <TextEqure fontSize={34} fontColor={"#4F56FF"} fontWeight={"bold"}>
            {item.desc}
          </TextEqure>
        </RowFixed>
        <RowFixed>
          <TextEqure fontSize={18} fontColor={"#777E90"} fontWeight={"bold"}>
            Mining assets
          </TextEqure>
          <SpaceWidth width={20} widthApp={0} />
          <ThemeTextEqure fontSize={18} fontWeight={"bold"}>
            ${formatBalance(item.asset)}
          </ThemeTextEqure>
          <SpaceWidth width={50} widthApp={0} />
          <TextEqure fontSize={18} fontColor={"#777E90"} fontWeight={"bold"}>
            To be claimed
          </TextEqure>
          <SpaceWidth width={20} widthApp={0} />
          <TextEqure fontSize={18} fontColor={"#4F56FF"} fontWeight={"bold"}>
            ${formatBalance(item.farmingValue)}
          </TextEqure>
        </RowFixed>
      </RowBetween>
      <ProjectBankItem
        title={ProfileProjectsConfig[item.name]?.title1}
        data={item[ProfileProjectsConfig[item.name]?.key1] || []}
        name={item.name}
        tokensKey={ProfileProjectsConfig[item.name]?.tokensKey1}
      ></ProjectBankItem>
      <ProjectBankItem
        title={ProfileProjectsConfig[item.name]?.title2}
        data={item[ProfileProjectsConfig[item.name]?.key2] || []}
        name={item.name}
        tokensKey={ProfileProjectsConfig[item.name]?.tokensKey2}
      ></ProjectBankItem>
    </Column>
  );
}