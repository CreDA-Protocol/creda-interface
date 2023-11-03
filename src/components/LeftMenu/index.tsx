import ImageCommon from '@assets/common/ImageCommon';
import { ChainIds } from "@services/chain.service";
import { Tooltip, message } from "antd";
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { bankIsEnabledOnChain, vaultIsEnabledOnChain } from '../../common/Common';
import { NetworkTypeContext, WalletAddressContext } from '../../contexts';
import { useTheme, useWalkThroughStep } from '../../state/application/hooks';
import { Column, ColumnCenter } from '../Column';
import { RowCenter, RowFixed, Text } from '../Row';

const HeaderFrame = styled.div`
  flex-direction: column;
  display: flex;
  background-color: #17181A;
  width: 190px;
  margin-right: 24px;
  // align-items:center;
  padding: 40px 15px;
  border-radius: 20px;
  height: 600px;
`
const UniIcon = styled.img`
  width: 110px;
  height: 110px;
  background-color: #24262A;
  border-radius: 55px;
  margin-left: 15px;
`
const StyledNavLink = styled.div`
  align-items: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  background: transparent;
  font-size: 16px;
  //color:white;
  font-weight: 400;
  margin-top: 30px;
  color: #777E90;
  display: flex;
  flex-direction: row;
  width: 100%;
  // height:40px;
  border-radius: 20px;
  padding: 0px 10px;

  &.active {
    background: linear-gradient(90deg, #4a1ee1, #1890ff);
    color: #FFF;
  }

  /*&:hover {
    background: linear-gradient(90deg, #33B8FF, #33D4FF);
    color: #FFF;
  }
  &:focus {
    background: linear-gradient(90deg, #3A0080, #4A29FF);
    color: #00FFFF;
  }*/
  padding: 10px 10px;
`
const DocDiv = styled.div`
  align-items: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  color: white;
  font-weight: 400;
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  // justify-content:center;
  width: 100%;
  height: 40px;
  border-radius: 20px;
  padding: 0px 10px
`
const LeftIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 12px
`
const ArrowDown = styled.img`
  width: 6px;
  height: 6px;
  margin-left: 5px;
  margin-top: 5px
`

const StepModalWrap = styled.div<{
  isMobile: boolean | null
}>`
  .walk-through-modal-wrapper {
    top: ${({ isMobile }) => isMobile ? '97px' : '145px'};
    left: 53px;
    @media (min-width: 768px) and (max-width: 1700px) {
      top: 150px;
      left: 50%;
    }
  }
`
const ArrowJianTou = styled.img`
  width: 10px;
  height: 6px;
  margin-left: 10px;
  // margin-top:5px
`
const ArrowJianTouRight = styled.img`
  width: 6px;
  height: 6px;
  margin-left: 10px;
`
const SubItemIcon = styled.img`
  width: 24px;
  height: 28px;
  margin-right: 10px;
`
const SubItemLine = styled.div`
  height: 1px;
  background-color: #fff;
  margin: 15px 0px
`


const SubItemButton = styled(RowFixed)`
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 5px
`

function getSelectIndex(path: string) {
  console.log('====', path);

  let index = 0
  switch (path) {
    case '/profile':
      index = 1
      break;
    case '/vault':
      index = 2
      break;
    case '/myBankEarn':
    case '/myBankFarming':
    case '/myBankAssetPrice':
    case '/myBank':
      index = 3
      break;
    case '/bridge':
      index = 4
      break;
    case '/governance':
      index = 5
      break;
    default:
      break;
  }
  return index
}

const normalImg = [
  ImageCommon.left_menu_home,
  ImageCommon.left_menu_profile,
  ImageCommon.left_menu_vault,
  ImageCommon.left_menu_myBank,
  ImageCommon.left_menu_bridge,
  ImageCommon.left_menu_governace,
  ImageCommon.left_menu_doc
]
const selImg = [
  ImageCommon.left_menu_home_white,
  ImageCommon.left_menu_profile_white,
  ImageCommon.left_menu_vault_white,
  ImageCommon.left_menu_myBank_white,
  ImageCommon.left_menu_bridge_white,
  ImageCommon.left_menu_governace_white,
  ImageCommon.left_menu_doc_white
]

let subItemIndex = 0

export default React.memo(LeftMenu)

function LeftMenu({ history }: any) {
  const [selectIndex, setSelectIndex] = useState(getSelectIndex(history.location.pathname))
  const [subIndex, setSubIndex] = useState(0)
  const [wrongNetwork, setWrongNetwork] = useState(false)
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const themeDark = useTheme()
  const walkThroughStep = useWalkThroughStep()

  useEffect(() => {
    if (account && [ChainIds.arbitrum, ChainIds.ropsten, ChainIds.esc].indexOf(chainId) < 0) {
      setWrongNetwork(true)
    }
  }, [account, chainId])

  useEffect(() => {
    if (selectIndex != 3) {
      if (subIndex != 0) {
        setSubIndex(0)
      }
    }
  }, [selectIndex, subIndex])

  function changeNav(path: string) {
    if (chainId !== ChainIds.arbitrum && chainId !== ChainIds.esc && !["home", "profile", "bridge"].includes(path)) {
      message.warn("Coming Soon!")
      return
    }
    history.push("/" + path)
  }

  return <HeaderFrame style={{
    backgroundColor: themeDark ? '#17181A' : 'white'
  }}>
    {/*<FlexViewCenter>
      <Avatar
          src={ImageCommon.icon_vector}
          size={"large"}
      >
      </Avatar>
    </FlexViewCenter>*/}

    <StyledNavLink className={
      selectIndex === 0 ? 'active' : ''
    } onClick={() => {
      changeNav("home")
      setSelectIndex(0)
    }}>
      <LeftIcon src={selectIndex == 0 ? selImg[0] : normalImg[0]} />
      Home
    </StyledNavLink>
    <div
      style={{ position: 'relative' }}>
      <StyledNavLink className={
        selectIndex === 1 ? 'active' : ''
      } onClick={() => {
        changeNav("profile")
        setSelectIndex(1)
      }}>
        <LeftIcon src={selectIndex == 1 ? selImg[1] : normalImg[1]} />
        Profile
      </StyledNavLink>
      {/* { location==='/vault'?
   <StepModalWrap isMobile={isMobile}>
           <WalkThroughModal currentStep={2} title="Step 2" steps={false} content="Go to Profile Page"/>

    </StepModalWrap>:''} */}
    </div>
    {vaultIsEnabledOnChain(chainId) &&
      <StyledNavLink className={selectIndex === 2 ? 'active' : ''}
        onClick={() => {
          changeNav("vault")
          setSelectIndex(2)
        }}>
        <LeftIcon src={selectIndex == 2 ? selImg[2] : normalImg[2]} />
        Vault
      </StyledNavLink>
    }
    {bankIsEnabledOnChain(chainId) &&
      <StyledNavLink className={selectIndex === 3 ? 'active' : ''}
        onClick={() => {
          setSelectIndex(3)
        }}>
        <ColumnCenter>
          <RowCenter style={{ cursor: 'pointer' }} onClick={() => {
            changeNav("myBank")
            setSelectIndex(3)
            setSubIndex(0)
            subItemIndex = 0
          }}>
            <LeftIcon src={selectIndex == 3 ? selImg[3] : normalImg[3]} />
            My Bank
            <ArrowJianTou src={selectIndex == 3 ? ImageCommon.jiantou_up : ImageCommon.jiantou_down_nor} />
          </RowCenter>
          {
            <Column style={{ marginLeft: 20 }}>
              <SubItemButton onClick={() => {
                changeNav("myBankEarn")
                setSubIndex(1)
              }}>
                <Text fontSize={12} fontColor={subIndex == 1 ? '#fff' : '#cfcdcd'}>Earn</Text>
              </SubItemButton>
              <SubItemButton onClick={() => {
                changeNav("myBankFarming")
                setSubIndex(2)
              }}>
                <Text fontSize={12} fontColor={subIndex == 2 ? '#fff' : '#cfcdcd'}>Farming</Text>
              </SubItemButton>
              <SubItemButton onClick={() => {
                changeNav("myBankAssetPrice")
                setSubIndex(3)
              }}>
                <Text fontSize={12} fontColor={subIndex == 3 ? '#fff' : '#cfcdcd'}>Asset Price</Text>
              </SubItemButton>
            </Column>
          }
        </ColumnCenter>
      </StyledNavLink>}
    {/*<Tooltip placement="right" title={"Coming soon..."}>*/}
    <StyledNavLink
      onClick={() => {
        changeNav('bridge')
        setSelectIndex(4)
      }}
      className={
        selectIndex === 4 ? 'active' : ''
      }>
      <LeftIcon src={selectIndex == 4 ? selImg[4] : normalImg[4]} />
      Bridge
    </StyledNavLink>
    {/*</Tooltip>*/}
    <Tooltip placement="right" title={"Coming soon..."}>
      <StyledNavLink
        //     onClick={()=>{
        //   history.push('./governance')
        //   setSelectIndex(5)
        // }}
        className={
          selectIndex === 5 ? 'active' : ''
        }>
        <LeftIcon src={selectIndex == 5 ? selImg[5] : normalImg[5]} />
        Governance
      </StyledNavLink>
    </Tooltip>

    {/* <StyledNavLink onClick={()=>{
      window.open("https://creda-app.gitbook.io/protocol/introduction/creda-protocol-whitepaper")
    }}>
      <LeftIcon src={selectIndex == 6 ? selImg[6] : normalImg[6]}/>
      Doc
    </StyledNavLink> */}
  </HeaderFrame>
}
