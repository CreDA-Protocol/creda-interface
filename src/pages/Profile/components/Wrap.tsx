import { Tooltip } from "antd";
import { useTheme } from "src/state/application/hooks";
import { chainIndexToId, chainTitles } from "../chainsConfig";
import { WrapDiv, WrapItem } from "./StyledComponents";

export function Wrap({ onIndexChange, selectedIndex }: any) {
  const themeDark = useTheme();
  return (
    <WrapDiv>
      {chainIndexToId.map((item, index) => {
        if (index > 3) {
          return (
            <Tooltip placement="top" title={"Coming soon..."}>
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
                disabled={index > 3}
              >
                {chainTitles[item]}
              </WrapItem>
            </Tooltip>
          );
        }
        return (
          <WrapItem
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
            disabled={index > 3}
          >
            {chainTitles[item]}
          </WrapItem>
        );
      })}
    </WrapDiv>
  );
}