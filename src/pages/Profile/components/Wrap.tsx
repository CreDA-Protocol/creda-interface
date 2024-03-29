import { Tooltip } from "antd";
import { FC } from "react";
import { useTheme } from "src/states/application/hooks";
import { WrapDiv, WrapItem } from "./StyledComponents";
import { chainIndexToId, chainTitles } from "@services/chains/chain-configs";

export const Wrap: FC<{
  onIndexChange: (newIndex: number) => any;
  selectedIndex: number;
}> = ({ onIndexChange, selectedIndex }) => {
  const themeDark = useTheme();
  const disableIndex = 4;
  return (
    <WrapDiv>
      {chainIndexToId.map((item, index) => {
        if (index > disableIndex) {
          return (
            <Tooltip placement="top" title={"Coming soon..."} key={index}>
              <WrapItem
                themeDark={themeDark}
                className={selectedIndex === index ? "active" : ""}
                style={
                  {
                    // backgroundColor: selectIndex == index ? '#4E55FF': (themeDark? '#17181A' : 'white'),
                    // color:selectIndex == index ? 'white' : (themeDark? 'white' : '#17181A')
                  }
                }
                selected={selectedIndex === index}
                // onClick={()=>{
                //   onIndexChange(index)
                // }}
                disabled={index > disableIndex}
              >
                {chainTitles[item]}
              </WrapItem>
            </Tooltip>
          );
        }

        return (
          <WrapItem
            key={index}
            themeDark={themeDark}
            className={selectedIndex === index ? "active" : ""}
            style={
              {
                // background: selectIndex == index ? 'linear-gradient(90deg, #4a1ee1, #1890ff)': (themeDark? '#17181A' : 'white'),
                // color:selectIndex == index ? 'white' : (themeDark? 'white' : '#17181A')
              }
            }
            selected={selectedIndex === index}
            onClick={() => {
              onIndexChange(index);
            }}
            disabled={index > disableIndex}
          >
            {chainTitles[item]}
          </WrapItem>
        );
      })}
    </WrapDiv>
  );
}