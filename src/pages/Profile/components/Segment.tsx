import { useState } from "react";
import { useTheme } from "src/state/application/hooks";
import { SegmentDiv, SegmentItem } from "./StyledComponents";

export function Segment({ onSegmentSelect }: any) {
  const [selectIndex, setSelectIndex] = useState(0);
  const themeDark = useTheme();
  return (
    <SegmentDiv
      style={{
        backgroundColor: themeDark ? "#17181A" : "white",
      }}
    >
      <SegmentItem
        isChoose={selectIndex === 0}
        onClick={() => {
          setSelectIndex(0);
          onSegmentSelect(0);
        }}
      >
        Wallet
      </SegmentItem>
      {/*<Tooltip placement="top" title={"Coming soon..."}>*/}
      <SegmentItem
        isChoose={selectIndex === 1}
        onClick={() => {
          setSelectIndex(1);
          onSegmentSelect(1);
        }}
      >
        Portfolio
      </SegmentItem>
      {/*</Tooltip>*/}
      <SegmentItem
        isChoose={selectIndex === 2}
        onClick={() => {
          setSelectIndex(2);
          onSegmentSelect(2);
        }}
      >
        Approval
      </SegmentItem>
    </SegmentDiv>
  );
}