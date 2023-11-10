import { useRef } from 'react'
import styled from 'styled-components'
import i18n from '../../i18n'
// import { useActiveWeb3React } from '../../hooks'
import { ImageCommon } from '@assets/common/ImageCommon'
import { RowCenter } from '@components/Row'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../states/application/actions'
import { useModalOpen, useTheme, useToggleModal } from '../../states/application/hooks'


const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 100;
  background-image:url(${ImageCommon.lan_bg_image});
  background-position:center;
  background-size:100% 100%;
  background-repeat: no-repeat;
  width:157px;
  height:140px;
  top:40px;
  right:-35px;
  padding-top:35px;
  padding-left:30px
`

const MenuItem = styled.div`
  cursor: pointer;
  font-size:12px;
  color:#040717
`
const MenuItemIcon = styled.img`
  width: 30px;
  height:30px;
  margin-right:10px
`
const HeaderView = styled(RowCenter) <{
  themeDark?: boolean | null
}>`
  height: 40px;
  color: white;
  font-size:28px;
  font-weight:bold;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items:center;
  transition: .4s;
  color: ${({ themeDark }) => `${themeDark ? '#3278FF' : '#000'}`};
  &:hover{
    color: #33D4FF !important;
    transition: .4s;
  }
  &:focus{
    color: #4A29FF !important;
    transition: .4s;
  }
  @media (max-width: 768px) {
    height: 20px;
    border-radius: 5px;
    font-size:15px;
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    font-size: 18px;
  }
`
const Arrow = styled.img`
  width:6px;
  height:4px;
  margin-left:10px;
  margin-top:5px;
`
const LanIcon = styled.img`
  width:15px;
  height:15px;
  margin-right:10px;
  @media (max-width: 768px) {
    width:20px;
    height:20px;
  }
`
const SpaceHeight = styled.div`
  height:20px
`


// const CODE_LINK = 'https://github.com/KodamaSakuno/uniswap-interface'

export default function I18nSwitch() {
  // const { account } = useActiveWeb3React()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    toggle()
  }

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.I18N)
  const toggle = useToggleModal(ApplicationModal.I18N)
  useOnClickOutside(node, open ? toggle : undefined)
  const themeDark = useTheme()

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <HeaderView themeDark={themeDark} onClick={() => {
        toggle()
      }}>
        {/*<LanIcon src={i18n.language == 'zh-CN'?ImageCommon.cn_icon:ImageCommon.en_icon}/>*/}
        {i18n.language == 'zh-CN' ? "CN" : 'EN'}
        {/* <Arrow src={ImageCommon.ArrowDownIcon_white}/> */}
      </HeaderView>
      {open && (
        <MenuFlyout>
          <MenuItem onClick={() => changeLanguage('en')}>
            <MenuItemIcon src={ImageCommon.en_icon} />
            English
          </MenuItem>
          <SpaceHeight />
          <MenuItem onClick={() => changeLanguage('zh-CN')}>
            <MenuItemIcon src={ImageCommon.cn_icon} />
            Chinese
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
