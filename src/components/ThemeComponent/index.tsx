import React, { useRef } from "react";
import styled from "styled-components";
import i18n from "../../i18n";
// import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { ApplicationModal } from "../../state/application/actions";
import {
  useModalOpen,
  useToggleModal,
  useChangeTemeDark,
  useTheme,
} from "../../state/application/hooks";
import { ExternalLink } from "../../theme";
import Row, { RowCenter, Text, TextEqure } from "../Row";
import ImageCommon from "../../assets/common/ImageCommon";
import { isMobile } from "react-device-detect";

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
