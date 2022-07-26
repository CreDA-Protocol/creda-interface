import React from 'react'
import styled from 'styled-components'

import ImageCommon from '../../assets/common/ImageCommon'

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height:auto;
  background-image:url(${ImageCommon.home_top_bg});
  background-position:left top;
  background-size:100% auto;
  background-repeat: no-repeat;
  @media (max-width: 768px) {
    background-image:url(${ImageCommon.home_top_bg_mobil});
  }
`
const DownBackgroundContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height:100%;
  background-image:url(${ImageCommon.home_down_bg});
  background-position:left top;
  background-size:cover;
  background-repeat: no-repeat;
  @media (max-width: 768px) {
    background-image:url(${ImageCommon.home_down_bg_app});
    height:100%;
    background-size:cover;
  };
`
export default function Background() {
  return (
    <BackgroundContainer>
    </BackgroundContainer>
  )
}
export function DownBackground() {
  return (
    <DownBackgroundContainer>
    </DownBackgroundContainer>
  )
}
