import styled from 'styled-components'
// import { useActiveWeb3React } from '../../hooks'
import { ImageCommon } from '@assets/common/ImageCommon'

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


export function Setting() {
  return <HeaderView onClick={() => {

  }}>
    <Arrow src={ImageCommon.Setting_white} />
  </HeaderView>
}
