import ImageCommon from "@assets/common/ImageCommon";
import { formatBalance, formatPositiveNumber } from "@common/Common";
import { Column } from "@components/Column";
import { RowBetween, RowCenter, RowFixed, SpaceHeight, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { Row } from "antd";
import { FC, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTheme } from "styled-components";
import { BGDiv, InputDiv, LineH, MoreIcon, SearchDiv, SearchIcon, SmallIconIcon } from "./StyledComponents";

export const WalletDiv: FC<{
  data: any;
  chainTitle: string;
}> = ({ data, chainTitle }) => {
  // console.log(data)
  const [input, setInput] = useState("");
  const themeDark = useTheme();
  const [hidden, setHidden] = useState(true)
  return (
    <BGDiv
      style={{
        backgroundColor: themeDark ? "#17181A" : "white",
      }}
    >
      <RowBetween>
        <ThemeTextEqure fontSize={28} fontWeight={"bold"}>
          Wallet
        </ThemeTextEqure>
        {!isMobile && (
          <SearchDiv>
            <InputDiv
              value={input}
              placeholder={"Search coin"}
              onChange={(e) => setInput(e.target.value)}
            />
            <SearchIcon src={ImageCommon.search_icon} />
          </SearchDiv>
        )}
      </RowBetween>
      <SpaceHeight height={40} heightApp={20} />
      <RowBetween>
        <Column style={{ justifyContent: "flex-start", flex: 0.5 }}>
          <ThemeTextEqure
            style={{ marginLeft: 50 }}
            fontWeight={"600"}
            fontSize={20}
          >
            Asset
          </ThemeTextEqure>
        </Column>
        {!isMobile && (
          <Column style={{ flex: 1, alignItems: "flex-end" }}>
            <ThemeTextEqure fontWeight={"600"} fontSize={20}>
              Price
            </ThemeTextEqure>
          </Column>
        )}
        {!isMobile && (
          <Column style={{ flex: 1, alignItems: "flex-end" }}>
            <ThemeTextEqure fontWeight={"600"} fontSize={20}>
              Balance
            </ThemeTextEqure>
          </Column>
        )}
        <Column style={{ flex: 1, alignItems: "flex-end" }}>
          <ThemeTextEqure
            style={isMobile ? { marginRight: 30 } : {}}
            fontWeight={"600"}
            fontSize={20}
          >
            Value
          </ThemeTextEqure>
        </Column>
      </RowBetween>
      <Column style={{ width: '100%' }}>
        {/* <ProfileLoading loading={data.loading}></ProfileLoading> */}
        {!data.support &&
          <RowCenter>
            <ThemeTextEqure fontWeight={"bold"} fontSize={30}>
              coming soon~
            </ThemeTextEqure>
          </RowCenter>
        }

        {!data.loading &&
          data.data.tokens.map((item: any, index: number) => {
            if (hidden && item.value < 1) {
              return null
            }
            return (
              <Row key={index}>
                <LineH />
                <RowBetween>
                  <RowFixed style={{ flex: 0.5 }}>
                    <SmallIconIcon src={item.icon} />
                    <Column>
                      <ThemeTextEqure fontWeight={"bold"} fontSize={14}>
                        {item.symbol}
                      </ThemeTextEqure>
                      <TextEqure fontColor={"#777E90"} fontSize={14}>
                        {chainTitle}
                      </TextEqure>
                    </Column>
                  </RowFixed>
                  {!isMobile && (
                    <Column style={{ alignItems: "flex-end", flex: 1 }}>
                      <ThemeTextEqure fontWeight={"bold"} fontSize={14}>
                        ${formatPositiveNumber(item.price)}
                      </ThemeTextEqure>
                      {/* <TextEqure fontColor={"#777E90"} fontSize={14}>
                                          {formatBalance(item.priceChangePercentage24h)}%
                                      </TextEqure> */}
                    </Column>
                  )}
                  {!isMobile && (
                    <Column style={{ alignItems: "flex-end", flex: 1 }}>
                      <ThemeTextEqure fontWeight={"bold"} fontSize={14}>
                        {formatBalance(item.amount)} {item.symbol}
                      </ThemeTextEqure>
                      <TextEqure fontColor={"#777E90"} fontSize={14}>
                        &nbsp;
                      </TextEqure>
                    </Column>
                  )}
                  <Row style={{ alignItems: "flex-start", flex: 1 }}>
                    <Column style={{ alignItems: "flex-end", flex: 1 }}>
                      <ThemeTextEqure fontWeight={"bold"} fontSize={14}>
                        ${formatPositiveNumber(item.value)}
                      </ThemeTextEqure>
                      <TextEqure fontColor={"#777E90"} fontSize={14}>
                        {/*{formatBalance(item.valueBTC)} BTC*/}
                      </TextEqure>
                    </Column>
                    {isMobile && (
                      <MoreIcon
                        style={{ marginLeft: 10 }}
                        src={ImageCommon.icon_more_icon}
                      />
                    )}
                  </Row>
                </RowBetween>
              </Row>
            );
          })}
      </Column>
      <SpaceHeight height={40} heightApp={20} />
      <RowCenter>
        <TextEqure fontColor={"#777E90"} fontSize={12}>
          {`Tokens with value <$1 are hidden`}
        </TextEqure>
        <TextEqure
          style={{ cursor: "pointer", marginLeft: 15 }}
          onClick={() => {
            setHidden(false)
          }}
          fontColor={"#4E55FF"}
          fontSize={12}
        >
          Show all
        </TextEqure>
      </RowCenter>
    </BGDiv>
  );
}