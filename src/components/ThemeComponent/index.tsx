// import { useActiveWeb3React } from '../../hooks'
import {
  useTheme
} from "../../states/application/hooks";
import { Text, TextEqure } from "../Row";

export const ThemeText = (props: any) => {
  const isThemDark = useTheme();
  return (
    <Text
      fontWeight={props.fontWeight}
      fontSize={props.fontSize}
      fontColor={isThemDark ? "#F1F4F6" : "#0D0D11"}
      {...props}
    />
  );
};
export const ThemeTextEqure = (props: any) => {
  const isThemDark = useTheme();
  return (
    <TextEqure
      fontWeight={props.fontWeight}
      fontSize={props.fontSize}
      fontColor={isThemDark ? "#F1F4F6" : "#0D0D11"}
      {...props}
    />
  );
};
