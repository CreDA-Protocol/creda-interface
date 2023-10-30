import { Column } from "@components/Column";
import { RowBetween, SpaceHeight, TextEqure } from "@components/Row";
import { useTheme } from "styled-components";
import { BGDiv, LineH, PortfolioTopBg } from "../StyledComponents";
import { ProjectBankList } from "./ProjectBankList";


export function ProjectBankItem({ title, data, name, tokensKey }: any) {
  const themeDark = useTheme();
  if (!data.length) {
    return null;
  }
  return (
    <BGDiv
      style={{
        backgroundColor: themeDark ? "#17181A" : "white",
      }}
    >
      <PortfolioTopBg>{title}</PortfolioTopBg>
      <SpaceHeight height={30} heightApp={20} />
      <RowBetween>
        <Column style={{ flex: 1.5 }}>
          <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
            Pooled funds
          </TextEqure>
        </Column>
        <Column style={{ flex: 2 }}>
          <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
            Balance
          </TextEqure>
        </Column>
        <Column style={{ flex: 1 }}>
          <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
            Value
          </TextEqure>
        </Column>
        <Column style={{ flex: 1.5 }}>
          <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
            To be claimed
          </TextEqure>
        </Column>
        <Column style={{ flex: 1, alignItems: "flex-end" }}>
          <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={18}>
            APY
          </TextEqure>
        </Column>
      </RowBetween>
      <LineH style={{ marginTop: 10, marginBottom: 20 }} />
      {data.map((subItem: any, subIndex: number) => {
        return (
          <ProjectBankList
            item={subItem}
            name={name}
            tokensKey={tokensKey}
          ></ProjectBankList>
        );
      })}
    </BGDiv>
  );
}