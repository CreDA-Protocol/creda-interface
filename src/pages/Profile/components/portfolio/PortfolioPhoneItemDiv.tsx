import ImageCommon from "@assets/common/ImageCommon";
import { formatBalance } from "@common/Common";
import { Column } from "@components/Column";
import { RowBetween, RowFixed, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { useState } from "react";
import { useTheme } from "styled-components";
import { ProfileProjectsConfig } from "../../projectsConfig";
import { Arrow, LineH, SmallIconIcon } from "../StyledComponents";
import { ProjectBankItemMobile } from "../project/ProjectBankItemMobile";

export function PortfolioPhoneItemDiv({ item }: any) {
  const [showMore, setShowMore] = useState(false);
  const themeDark = useTheme();
  return (
    <Column style={{ width: "100%" }}>
      <LineH height={10} />
      <RowBetween>
        <RowFixed>
          <SmallIconIcon src={item.icon} />
          <ThemeTextEqure fontSize={17} fontWeight={"bold"}>
            {item.desc}
          </ThemeTextEqure>
        </RowFixed>
        <RowFixed onClick={() => setShowMore(!showMore)}>
          <Column>
            <TextEqure fontSize={17} fontColor={"#4F56FF"} fontWeight={"bold"}>
              ${formatBalance(item.asset)}
            </TextEqure>
            <ThemeTextEqure fontSize={17}>
              ${formatBalance(item.farmingValue)}
            </ThemeTextEqure>
          </Column>
          <Arrow src={ImageCommon.ArrowDownIcon_white} />
        </RowFixed>
      </RowBetween>
      {showMore && (
        <>
          <ProjectBankItemMobile
            title={ProfileProjectsConfig[item.name]?.title1}
            data={item[ProfileProjectsConfig[item.name]?.key1] || []}
            name={item.name}
            tokensKey={ProfileProjectsConfig[item.name]?.tokensKey1}
          ></ProjectBankItemMobile>
          <ProjectBankItemMobile
            title={ProfileProjectsConfig[item.name]?.title2}
            data={item[ProfileProjectsConfig[item.name]?.key2] || []}
            name={item.name}
            tokensKey={ProfileProjectsConfig[item.name]?.tokensKey2}
          ></ProjectBankItemMobile>
        </>
      )}
    </Column>
  );
}