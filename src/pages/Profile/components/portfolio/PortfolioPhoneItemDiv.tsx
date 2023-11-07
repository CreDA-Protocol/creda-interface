import ImageCommon from "@assets/common/ImageCommon";
import { formatBalance } from "@common/Common";
import { Column } from "@components/Column";
import { RowBetween, RowFixed, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { PortfolioApiFarmAsset } from "@services/portfolio/model/portfolio-api.dto";
import { FC, useState } from "react";
import { ProfileProjectsConfig } from "../../configs/projectsConfig";
import { Arrow, LineH, SmallIconIcon } from "../StyledComponents";
import { ProjectBankItemMobile } from "../bank/ProjectBankItemMobile";

export const PortfolioPhoneItemDiv: FC<{
  item: PortfolioApiFarmAsset;
}> = ({ item }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <Column style={{ width: "100%" }}>
      <LineH height={10} />
      <RowBetween>
        <RowFixed>
          <SmallIconIcon src={item.icon} />
          <ThemeTextEqure fontSize={17} fontWeight={"bold"}>
            {item.name}
          </ThemeTextEqure>
        </RowFixed>
        <RowFixed onClick={() => setShowMore(!showMore)}>
          <Column>
            <TextEqure fontSize={17} fontColor={"#4F56FF"} fontWeight={"bold"}>
              ${formatBalance(item.amountPrice)}
            </TextEqure>
            <ThemeTextEqure fontSize={17}>
              ${formatBalance(item.pendingPrice)}
            </ThemeTextEqure>
          </Column>
          <Arrow src={ImageCommon.ArrowDownIcon_white} />
        </RowFixed>
      </RowBetween>
      {showMore && (
        <>
          <ProjectBankItemMobile
            title={ProfileProjectsConfig[item.name]?.title1}
            data={(item as any)[ProfileProjectsConfig[item.name]?.key1] || []}
            name={item.name}
            tokensKey={ProfileProjectsConfig[item.name]?.tokensKey1}
          ></ProjectBankItemMobile>
          <ProjectBankItemMobile
            title={ProfileProjectsConfig[item.name]?.title2}
            data={(item as any)[ProfileProjectsConfig[item.name]?.key2] || []}
            name={item.name}
            tokensKey={ProfileProjectsConfig[item.name]?.tokensKey2}
          ></ProjectBankItemMobile>
        </>
      )}
    </Column>
  );
}