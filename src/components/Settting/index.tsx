import React, { useRef } from 'react'
import styled from 'styled-components'
import i18n from '../../i18n'
// import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ExternalLink } from '../../theme'
import Row, {RowCenter} from '../../components/Row'
import ImageCommon from '../../assets/common/ImageCommon'
import { isMobile } from 'react-device-detect'
import {colors} from "../../common/Common";

const HeaderView = styled.div`
  cursor:pointer;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
  @media (max-width: 768px) {
    height:20px;
  };
`

const Arrow = styled.img`
  width:20px;
  height:20px;
  @media (max-width: 768px) {
    width:10px;
    height:10px;
  }
`


export default function Setting() {
  return <HeaderView onClick={()=>{

  }}>
    <Arrow src={ImageCommon.Setting_white}/>
  </HeaderView>
}
