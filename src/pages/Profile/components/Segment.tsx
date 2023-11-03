import { useState } from "react";
import { useTheme } from "src/state/application/hooks";
import { SegmentDiv, SegmentItem } from "./StyledComponents";

export function Segment({ onSegmentSelect }: any) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const themeDark = useTheme();

  return (
    <SegmentDiv
      style={{
        backgroundColor: themeDark ? "#17181A" : "white",
      }}
    >
      <SegmentItem
        isSelected={selectedIndex === 0}
        onClick={() => {
          setSelectedIndex(0);
          onSegmentSelect(0);
        }}
      >
        Wallet
      </SegmentItem>
      {/*<Tooltip placement="top" title={"Coming soon..."}>*/}
      <SegmentItem
        isSelected={selectedIndex === 1}
        onClick={() => {
          setSelectedIndex(1);
          onSegmentSelect(1);
        }}
      >
        Portfolio
      </SegmentItem>
      {/*</Tooltip>*/}
      <SegmentItem
        isSelected={selectedIndex === 2}
        onClick={() => {
          setSelectedIndex(2);
          onSegmentSelect(2);
        }}
      >
        Approval
      </SegmentItem>
    </SegmentDiv>
  );
}