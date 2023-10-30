import { Column } from "@components/Column";
import {
  RowBetween,
  RowCenter,
  SpaceHeight,
  TextEqure
} from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { useState } from "react";
import { useTheme } from "src/state/application/hooks";
import { BGDiv, LineH, WrapDiv } from "./StyledComponents";
import styled from "styled-components";

const ActivityDivTopItem = styled(RowCenter) <{ isChoose: boolean; }>`
  align-items: center;
  cursor: pointer;
  background-color: ${({ isChoose }) => (isChoose ? "#353945" : "transparent")};
  height: 30px;
  border-radius: 15px;
  color: ${({ isChoose }) => (isChoose ? "#FBFCFC" : "#777E90")};
  font-size: 14px;
  font-weight: bold;
  padding: 10px 15px;
  margin-right: 28px;
  width: fit-content;
  @media (max-width: 768px) {
    padding: 5px 10px;
    margin-right: 14px;
  };
`;

export function ActivityDiv({ data }: any) {
  const [topIndex, setTopIndex] = useState(0);
  const themeDark = useTheme();
  return (
    <BGDiv
      style={{
        backgroundColor: themeDark ? "#17181A" : "white",
      }}
    >
      <WrapDiv
        style={{ justifyContent: "flex-start", marginLeft: 0, marginRight: 0 }}
      >
        {["All types", "Withdrawals", "Deposit", "Transfer"].map(
          (item, index) => {
            return (
              <ActivityDivTopItem
                isChoose={topIndex === index}
                onClick={() => {
                  setTopIndex(index);
                }}
              >
                {item}
              </ActivityDivTopItem>
            );
          }
        )}
      </WrapDiv>
      <LineH />
      <ThemeTextEqure fontSize={28} fontWeight={"bold"}>
        Activity
      </ThemeTextEqure>
      <SpaceHeight height={40} heightApp={20} />
      <RowBetween>
        <Column style={{ flex: 1 }}>
          <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={12}>
            Coin
          </TextEqure>
        </Column>
        <Column style={{ flex: 1 }}>
          <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={12}>
            Amount
          </TextEqure>
        </Column>
        <Column style={{ flex: 1 }}>
          <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={12}>
            Address
          </TextEqure>
        </Column>
        <Column style={{ flex: 1 }}>
          <TextEqure fontColor={"#777E90"} fontWeight={"600"} fontSize={12}>
            Transaction ID
          </TextEqure>
        </Column>
      </RowBetween>
      <SpaceHeight height={40} heightApp={20} />
      <RowCenter>
        <TextEqure fontColor={"#777E90"} fontSize={12}>
          {`Tokens with value <$100 are hidden`}
        </TextEqure>
        <ThemeTextEqure
          style={{ cursor: "pointer", marginLeft: 15 }}
          onClick={() => { }}
          fontColor={"#4E55FF"}
          fontSize={12}
        >
          Show all
        </ThemeTextEqure>
      </RowCenter>
    </BGDiv>
  );
}