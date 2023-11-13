import { Header } from "@components/Header";
import LeftMenu from '@components/LeftMenu';
import React from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { useTheme } from "../states/application/hooks";

const BodyWrapper = styled.div`
  overflow: unset;
  position: relative;
  width: 100%;
  display:flex;
  flex-direction:row;
  @media (max-width: 768px) {
    // background-color:#0D0D11
  };

  //max-width:1220px;
  padding:0px;
  z-Index:100;
`
export const MainFullBodyDiv = styled.div`
  position: relative;
  width: 100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  @media (max-width: 768px) {
    // background-color:#0D0D11
  };
  @media (min-width: 768px) {
    min-width:1200px;
  };
  padding:0px;
  overflow:unset
`

export function AppBody({ children, history }: { children: React.ReactNode, history: any }) {
  const themeDark = useTheme()

  return <BodyWrapper style={{
    backgroundColor: themeDark ? '#0D0D11' : '#F1F4F6'
  }}>
    {
      !isMobile && <LeftMenu history={history} />
    }
    {children}
  </BodyWrapper>
}

export function MainFullBody({ children, history }: { children: React.ReactNode, history?: any }) {
  const themeDark = useTheme()
  return <MainFullBodyDiv style={{
    backgroundColor: themeDark ? '#0D0D11' : '#F1F4F6'
  }}>
    <Header history={history} />
    {children}
  </MainFullBodyDiv>
}
