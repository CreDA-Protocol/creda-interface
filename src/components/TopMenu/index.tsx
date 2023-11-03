import { useContext, useState } from 'react'
import styled from 'styled-components'
// import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../state/application/hooks'

import ImageCommon from '@assets/common/ImageCommon'
import { ThemeText } from '@components/ThemeComponent'
import { ChainIds } from "@services/chain.service"
import { message } from "antd"
import { bankIsEnabledOnChain, vaultIsEnabledOnChain } from "../../common/Common"
import { NetworkTypeContext } from "../../contexts"
import { ButtonClick, ButtonLink } from '../Button'
import { RowCenter, RowFixed } from '../Row'

const DropFlyWrap = styled.div`
  position: relative;
`

const MenuFlyout = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 100;
  background-image:url(${ImageCommon.doc_bg_image});
  background-position:center;
  background-size:100% 100%;
  background-repeat: no-repeat;
  width:186px;
  height:125px;
  /*top:60px;
  right:330px;*/
  top: 54px;
  right: -79px;
  padding-top:40px;
  padding-left:30px;
  z-index:1000
`

const MenuItem = styled.div`
  cursor: pointer;
  font-size:12px;
  color:#040717;
`
const MenuItemIcon = styled.img`
  width: 6px;
  height:6px;
  margin-left:10px
`
const Arrow = styled.img`
  width:6px;
  height:4px;
  margin-left:10px;
  margin-top:5px;
`
const SpaceHeight = styled.div`
  height:20px
`
const SpaceWidth = styled.div`
  width:25px;
  @media (max-width: 768px) {
    width:15px;
  }
`
const Title = styled(ThemeText)`
  color:white;
  font-size:16px;
  font-weight:bold
`
const SearchDiv = styled(RowFixed)`
  width:256px;
  height:32px;
  padding: 0 10px;
  border-radius:50px;
  border:1px solid #22252D;
  margin-right:30px;
  @media (min-width:1700px) {
    height: 48px;
  }
`
const InputDiv = styled.input<{
  themeDark?: boolean | null
}>`
  font-size: 16px;
  flex:1;
  height:30px;
  outline: none;
  outline:none;
  border:none;
  font-weight: 500;
  width: 100%;
  margin-left:10px;
  background-color:transparent;
  color: ${({ themeDark }) => `${themeDark ? 'white' : '#0d0d11'}`}
`
const SearchIcon = styled.img`
  width:18px;
  height:auto;
  margin-right:10px
`
const HeaderLink = styled.div`
  > * {
    font-size: 21px;
    color: #3278FF;
    transition: .4s;
    &:focus {
      color: #4A29FF;
      transition: .4s;
    }
    &:hover {
      color: #33D4FF;
      transition: .4s;
    }
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    > * {
      font-size: 16px;
    }
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    > * {
      font-size: 13px;
    }
  }
`

export default function TopMenu({ history }: any) {
  const { chainId } = useContext(NetworkTypeContext);
  const [isHome] = useState(history.location.pathname == '/home')
  const [isMediaPage] = useState(history.location.pathname == '/news-and-media')
  const [isAboutPage] = useState(history.location.pathname == '/about-us')


  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const themeDark = useTheme()
  function changeNav(path: string) {
    if (chainId !== ChainIds.arbitrum && chainId !== ChainIds.esc && !["home", "profile"].includes(path)) {
      message.warn("Coming Soon!")
      return
    }
    history.push("/" + path)
  }
  return <RowFixed>
    <SpaceWidth />
    {
      isHome || isMediaPage || isAboutPage || '/home2' ? <RowFixed>
        <ButtonClick
          onClick={() => changeNav("home")}
        >
          <HeaderLink>
            <ThemeText>{t('Home')}</ThemeText>
          </HeaderLink>
        </ButtonClick>
        <SpaceWidth />
        <ButtonClick
          onClick={() => changeNav("profile")}
        >
          <HeaderLink>
            <ThemeText>{t('Profile')}</ThemeText>
          </HeaderLink>
        </ButtonClick>
        <SpaceWidth />
        {vaultIsEnabledOnChain(chainId) && <ButtonClick
          onClick={() => changeNav("vault")}
        >
          <HeaderLink>
            <ThemeText>{t('Vault')}</ThemeText>
          </HeaderLink>
        </ButtonClick>}
        {vaultIsEnabledOnChain(chainId) && <SpaceWidth />}
        {bankIsEnabledOnChain(chainId) && <ButtonClick
          onClick={() => changeNav("myBank")}
        >
          <HeaderLink>
            <ThemeText>{t('My Bank')}</ThemeText>
          </HeaderLink>
        </ButtonClick>}
        {vaultIsEnabledOnChain(chainId) && <SpaceWidth />}
        <ButtonLink to={'/about-us'}>
          <HeaderLink>
            <ThemeText>{t('About Us')}</ThemeText>
          </HeaderLink>
        </ButtonLink>
        <SpaceWidth />
      </RowFixed> :
        ''
    }

    <DropFlyWrap>
      <ButtonClick onClick={() => window.open('https://creda-app.gitbook.io/protocol/introduction/creda-protocol-whitepaper')}>
        <RowCenter>
          <HeaderLink>
            <ThemeText style={{ marginRight: '25px' }}>{t('Whitepaper')}</ThemeText>
          </HeaderLink>
          {/*<Arrow src={themeDark?ImageCommon.ArrowDownIcon_white:ImageCommon.ArrowDownIcon_black} style={{transform:`${open ? 'rotate(180deg)' : 'rotate(0deg)'}`, transition:'.4s'}} />*/}
        </RowCenter>
      </ButtonClick>
      {open && (
        <MenuFlyout>
          <MenuItem onClick={() => {
            setOpen(false)
            window.open('https://creda-app.gitbook.io/protocol/introduction/creda-protocol-whitepaper')
          }}>
            {t('Whitepaper')}
            <MenuItemIcon src={ImageCommon.Group_arrow} />
          </MenuItem>
          <SpaceHeight />
          <MenuItem onClick={() => {
            setOpen(false)
            window.open('https://creda-app.gitbook.io/creda-protocol/')
          }}>
            {t('Protocal Litepaper')}
            <MenuItemIcon src={ImageCommon.Group_arrow} />
          </MenuItem>
        </MenuFlyout>
      )}
    </DropFlyWrap>
  </RowFixed>
}
