
import React, { useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import ImageCommon from '../../assets/common/ImageCommon'
import Column from '../Column'
import Row, {Text,Image, RowBetween, SpaceHeight, RowCenter, SpaceWidth} from '../Row'

const HeaderFrame = styled.div`
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  display: flex;
  @media (max-width: 768px) {
  };
  margin-top:170px
`
const UniIcon = styled.img`
  width:197px;
  height:74px;
  @media (max-width: 768px) {
    width:98px;
    height:37px;
    margin-bottom:19px
  };
`
const ConnetImage = styled(Image)`
  margin-right:28px;
  @media (max-width: 768px) {
    margin-right:0px;
    width:27px;
    height:27px;
    margin-top:50px
  };
  width:54px;
  height:54px;
  cursor:pointer
`

export default function Bottom() {
  return (
    <>
      {
        isMobile ? <RowCenter>
          <ConnetImage src={ImageCommon.facebook}/>
          <SpaceWidth width={0} widthApp={14}/>
          <ConnetImage src={ImageCommon.twitter}/>
          <SpaceWidth width={0} widthApp={14}/>
          <ConnetImage src={ImageCommon.linkedin}/>
          <SpaceWidth width={0} widthApp={14}/>
          <ConnetImage src={ImageCommon.instagram}/>
          <SpaceWidth width={0} widthApp={14}/>
          <ConnetImage src={ImageCommon.telegram}/>
        </RowCenter> : <HeaderFrame>
      <RowBetween style={{alignItems:'flex-end'}}>
        <Row>
          <ConnetImage src={ImageCommon.facebook}/>
          <ConnetImage src={ImageCommon.twitter}/>
          <ConnetImage src={ImageCommon.linkedin}/>
          <ConnetImage src={ImageCommon.instagram}/>
          <ConnetImage src={ImageCommon.telegram}/>
        </Row>
        <UniIcon src={ImageCommon.whitelogo}/>
      </RowBetween>
      <SpaceHeight height={38} heightApp={19}/>
      <RowBetween>
        <Text fontSize={16}>Terms of Use · Privacy Policy · Cookie Policy</Text>
        <Text fontSize={18}>Copyright © 2021 CreDA</Text>
      </RowBetween>
    </HeaderFrame>
      }
    </>
    
  )
}
