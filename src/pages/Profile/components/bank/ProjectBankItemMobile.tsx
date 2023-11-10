import { RowBetween, SpaceHeight, TextEqure } from "@components/Row";
import { useTheme } from "src/states/application/hooks";
import { BGDiv, PortfolioTopBg } from "../StyledComponents";
import { ProjectBankListMobile } from "./ProjectBankListMobile";

export function ProjectBankItemMobile({ title, data, name, tokensKey }: any) {
  const themeDark = useTheme();
  if (!data.length) {
    return null;
  }
  return (
    <BGDiv
      style={{
        padding: 0,
        paddingTop: 10,
        backgroundColor: themeDark ? "#17181A" : "white",
      }}
    >
      <PortfolioTopBg>{title}</PortfolioTopBg>
      <SpaceHeight height={0} heightApp={15} />
      <RowBetween>
        <TextEqure
          style={{ marginLeft: 10 }}
          fontWeight={"600"}
          fontColor={"#4F56FF"}
          fontSize={15}
        >
          Pooled funds
        </TextEqure>
        <TextEqure
          style={{ marginRight: 10 }}
          fontWeight={"600"}
          fontColor={"#4F56FF"}
          fontSize={15}
        >
          To be claimed
        </TextEqure>
      </RowBetween>
      {data.map((subItem: any, subIndex: number) => {
        return (
          <ProjectBankListMobile
            item={subItem}
            name={name}
            tokensKey={tokensKey}
          ></ProjectBankListMobile>
        );
      })}
    </BGDiv>
  );
}