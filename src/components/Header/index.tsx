import ImageCommon from '@assets/common/ImageCommon'
import { Column } from '@components/Column'
import { FontPoppins, GradientButton, RowBetween, RowEnd, RowFixed, Text, TextEqure } from '@components/Row'
import { message } from "antd"
import { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import { ChainIds } from "../../common/Common"
import { NetworkTypeContext, WalletAddressContext } from "../../contexts"
import {
  useChangeTemeDark,
  useOpenWarnning,
  useTheme,
  useWalkThroughStep,
  useWarnning,
} from "../../state/application/hooks"
import ConnectWallet from '../ConnectWallet'
import I18nSwitch from '../I18nSwitch'
import ThemeIcon, { DarkBtn, LightBtn, fullMoonSvg, halfMoonSvg } from '../ThemeIcon'
import TopMenu from '../TopMenu'

const MenuToggleWrap = styled.div`
  display: flex;
  align-items: center;
`;
const HeaderFrame = styled.div`
  position: relative;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  z-index: 200;
  // position: fixed;
  display: flex;
  padding: 20px 0;
  max-width: 1140px;
  margin: 0 auto;
  @media (min-width: 1610px) {
    max-width: 1589px;
  }
  @media (max-width: 767px) {
    > img {
      width: 60px;
    }
    > ${MenuToggleWrap} {
      width: 75%;
      justify-content: end;
    }
    padding: 50px 32px 30px 32px;
    // background-color:#0D0D11
  }
  @media (max-width: 1190px) {
    padding: 6px 16px;
    max-width: 100%;
    // background-color:#0D0D11
  } ;
`;

const HeaderTopGradient = styled.div`
  position: relative;
  height: 15px;
  background: linear-gradient(90deg, #14c5ff 0%, #4636ff 73.87%, #3f0da7 100%);
  @media (max-width: 767px) {
    height: 9px;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SpaceWidth = styled.div`
  width: 30px;
  @media (max-width: 768px) {
    width: 15px;
  }
`;
const LogoImg = styled.img`
  cursor: pointer;
  width: 140px;
  position: relative;
  top: 0px;
  left: 0px;
  @media (max-width: 767px) {
    width: 130px;
    top: 0px;
    left: 0px;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 65px;
  }
`;
const MenuImage = styled.img`
  //width:32px;
  height: 28px;
  /*@media (max-width: 767px) {
    width: 20px;
  }*/
`;

const ConnectWalletHeader = styled.div`
  ${GradientButton} {
    height: 24px;
    font-size: 12px;
    margin-right: 10px;
  }
  @media (max-width: 374px) {
    ${GradientButton} {
      padding: 0 10px;
      font-size: 10px;
    }
  }
`;

const StepModalWrap = styled.div<{
  isMobile: boolean | null
}>`
  .walk-through-modal-wrapper {
    top:${({ isMobile }) => isMobile ? '97px' : '145px'};
    left:53px;
    @media (min-width: 768px) and (max-width: 1700px) {
      top:139px;
      left:50%;
    }
  }
`

const SubItemButton = styled(RowFixed)`
  cursor:pointer;
  padding:5px 0px
`
const menus = [
  {
    title: "Home",
    key: "home",
    image: ImageCommon.left_menu_home_white,
  },
  {
    title: "Profile",
    key: "profile",
    image: ImageCommon.left_menu_profile_white,
  },
  {
    title: "Vault",
    key: "vault",
    image: ImageCommon.left_menu_vault_white,
  },
  {
    title: 'Bridge',
    key: 'bridge',
    image: ImageCommon.Bridge_white,
  },
  {
    title: "My Bank",
    key: "myBank",
    image: ImageCommon.left_menu_myBank_white,
  },
  {
    title: "About Us",
    key: "aboutus",
    image: ImageCommon.About_white,
  },
  {
    title: "News & Media",
    key: "news&media",
    image: ImageCommon.left_menu_myBank_white,
  },
  {
    title: "Whitepaper",
    key: "doc",
    image: ImageCommon.left_menu_doc_white,
  },
  // {
  //   title:'Governance',
  //   key:'governance'
  // },
  // {
  //   title:'Doc',
  //   key:'doc'
  // }
];

export default function Header({ history }: any) {
  // const [changeColor,setChangeColor] = useState(false)
  // useEffect(()=>{
  //   window.addEventListener('scroll',onScroll)
  //   return ()=>{
  //     window.removeEventListener('scroll',onScroll)
  //   }
  // },[])
  // function onScroll(e:any){
  //   const scrollTop = (e.srcElement ? e.srcElement.documentElement.scrollTop : false) || window.pageYOffset || (e.srcElement ? e.srcElement.body.scrollTop : 0);
  //   console.log('scrollTop====',scrollTop);

  //   // style={{backgroundColor:changeColor?'#0D0D11':'transparent'}}
  // }
  const [showModal, setShowModal] = useState(false);
  // const [wrongNetwork, setWrongNetwork] = useState(false)
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);


  // useEffect(() => {
  //   if(account && [ChainId.arbitrum, ChainId.ropsten].indexOf(chainId) < 0){
  //     setWrongNetwork(true)
  //   }
  // }, [account])

  const warnning = useWarnning();
  const closeWarnning = useOpenWarnning(false);
  // useEffect(()=>{
  //   if (warnning){
  //     setTimeout(() => {
  //       closeWarnning()
  //     }, 3000);
  //   }
  // },[warnning])

  const toggleIsDark = useChangeTemeDark();

  const getWarningText = () => {
    return 'Please note the CreDA Protocol is in Beta phase: Use at your own risk.'
  }

  const themeDark = useTheme();
  return (
    <>
      <Column
        style={{
          width: "100%",
          position: "sticky",
          backgroundColor: `${themeDark ? "#0d0d11" : "#f1f4f6"}`,
          top: 0,
          zIndex: 999,
        }}
      >
        <FontPoppins>
          <HeaderTopGradient />
          <HeaderFrame>
            <LogoImg
              src={
                themeDark
                  ? ImageCommon.BrandLogoDarkMode
                  : ImageCommon.BrandLogoLightMode
              }
              onClick={() => {
                window.location.href = "/home";
              }}
            />
            {isMobile ? (
              <>
                <MenuToggleWrap className={"menuToggleWrap"}>
                  <ConnectWalletHeader>
                    {history.location.pathname === "/home" ? (
                      <ConnectWallet history={history} fromHome={true} />
                    ) : (
                      <ConnectWallet history={history} fromHome={false} />
                    )}
                  </ConnectWalletHeader>
                  <div
                    onClick={() => {
                      toggleIsDark();
                    }}
                  >
                    {themeDark ? (
                      <DarkBtn>
                        Dark
                        {halfMoonSvg()}
                      </DarkBtn>
                    ) : (
                      <LightBtn>
                        Light
                        {fullMoonSvg()}
                      </LightBtn>
                    )}
                  </div>

                  <MenuImage
                    src={
                      themeDark
                        ? ImageCommon.HamburgerIcon
                        : ImageCommon.HamburgerBlackIcon
                    }
                    onClick={() => {
                      setShowModal(true);
                    }}
                  />
                </MenuToggleWrap>
              </>
            ) : (
              <HeaderControls>
                <TopMenu history={history} />
                <SpaceWidth />
                {history.location.pathname === "/home" ? (
                  <ConnectWallet history={history} fromHome={true} />
                ) : (
                  <ConnectWallet history={history} fromHome={false} />
                )}
                {/* <SpaceWidth/> */}
                {/* <Settting/> */}
                <SpaceWidth />
                <ThemeIcon />
                {/*<SpaceWidth/>*/}
                {/*<I18nSwitch/>*/}
              </HeaderControls>
            )}
            {showModal && (
              <MenuView themeDark={themeDark}>
                <Column
                  style={{
                    // height:window.screen.height/2,
                    paddingTop: 44,
                  }}
                >
                  <RowEnd>
                    <MenuIcon
                      themeDark={themeDark}
                      src={ImageCommon.icon_close}
                      onClick={() => setShowModal(false)}
                    />
                  </RowEnd>
                  <RowBetween
                    style={{
                      paddingLeft: 15,
                      paddingRight: 15,
                      marginBottom: 50,
                    }}
                  >
                    <LogoImg
                      src={
                        themeDark
                          ? ImageCommon.BrandLogoDarkMode
                          : ImageCommon.BrandLogoLightMode
                      }
                      style={{ width: "134px" }}
                    />
                    <ConnectWallet />
                  </RowBetween>
                  <MenuList setShowModal={setShowModal} history={history} />
                </Column>
                <RowBetween
                  style={{
                    paddingLeft: 15,
                    paddingRight: 15,
                    // height:window.screen.height/2,
                    alignItems: "flex-end",
                    paddingBottom: 100,
                    paddingTop: 50,
                    marginTop: 20,
                  }}
                >
                  <ThemeButton
                    onClick={() => {
                      toggleIsDark();
                      setShowModal(false);
                    }}
                  >
                    {themeDark ? (
                      <DarkBtn>
                        Dark
                        {halfMoonSvg()}
                      </DarkBtn>
                    ) : (
                      <LightBtn>
                        Light
                        {fullMoonSvg()}
                      </LightBtn>
                    )}
                  </ThemeButton>

                  <Column style={{ marginBottom: 5 }}>
                    <I18nSwitch />
                  </Column>
                </RowBetween>
              </MenuView>
            )}
          </HeaderFrame>
        </FontPoppins>
      </Column>
      {warnning && (
        <WarnningView>
          <WarnningIcon src={ImageCommon.warnning_icon} />
          <TextEqure fontSize={isMobile ? 12 : 22}>
            {getWarningText()}
          </TextEqure>
        </WarnningView>
      )}
    </>
  );
}
let select = 0;
let subSelect = 0;

function MenuList({ history, setShowModal }: any) {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const [subIndex, setSubIndex] = useState(subSelect)
  const [selectIndex, setSelectIndex] = useState(select);
  const themeDark = useTheme();
  const walkThroughStep = useWalkThroughStep()
  const titleColor = themeDark ? "#FFFFFF" : "#000000"
  const isDark = useTheme();
  const [wrongNetwork, setWrongNetwork] = useState(false)



  useEffect(() => {
    if (account && [ChainIds.arbitrum, ChainIds.ropsten, ChainIds.esc].indexOf(chainId) < 0) {
      setWrongNetwork(true)
    }
  }, [account, chainId])
  useEffect(() => {
    if (selectIndex !== 3) {
      if (subIndex !== 0) {
        setSubIndex(0)
        subSelect = 0
      }
    }
  }, [selectIndex, subIndex]);
  function changeNav(data: string) {
    // console.log(chainId,data)
    if (chainId !== ChainIds.arbitrum && chainId !== ChainIds.esc && !["home", "profile", "aboutus", "news&media", "doc", "bridge"].includes(data)) {
      message.warn("Coming Soon!")
      return
    }
    switch (data) {
      case "home":
        history.push("./home");
        break;
      case "profile":
        history.push("./profile");
        break;
      case "vault":
        history.push("./vault");
        break;
      case "aboutus":
        history.push("./about-us");
        break;
      case "myBank":
        if (chainId === ChainIds.esc) {
          message.warn('coming soon~')
        } else {
          history.push("./myBank");
        }
        break;
      case "news&media":
        history.push("./news-and-media");
        break;
      case "bridge":
        // message.warn("Coming Soon!")
        history.push("./bridge");
        break;
      case "governance":
        history.push("./governance");
        break;
      case "myBankEarn":
        history.push("./myBankEarn");
        break;
      case "myBankFarming":
        history.push("./myBankFarming");
        break;
      case "myBankAssetPrice":
        history.push("./myBankAssetPrice");
        break;
      case "doc":
        window.open(
          "https://creda-app.gitbook.io/protocol/introduction/creda-protocol-whitepaper"
        );
        break;
      default:
        history.push("./home");
    }
  }
  return (
    <div>
      {menus.map((item: any, index: number) => {
        if (chainId === ChainIds.esc && item.title === 'My Bank') {
          return
        }
        return (
          <StyledNavLink
            style={{
              backgroundColor: selectIndex === index ? "#4E55FF" : "transparent",
            }}
            key={"item_" + index}
            onClick={() => {
              setSelectIndex(index)
              if (index !== 3) {
                changeNav(item.key)
                select = index
              }
            }}
          >
            <RowFixed style={{
              width: '100%',
              color: titleColor, justifyContent: 'flex-start', fontSize: 16, marginLeft: 100
            }}>
              <Column>
                <RowFixed onClick={() => {
                  changeNav(item.key)
                  select = index
                  setSubIndex(0)
                  subSelect = 0
                }}
                  style={{ alignItems: "center" }}
                >
                  {selectIndex === index ? (
                    <ArrowIcon src={item.image} themeDark={true} />
                  ) : (
                    item.key === 'aboutus' ?
                      <ArrowIcon className="custom-about-us-icon" src={item.image} themeDark={themeDark} />
                      :
                      <>
                        {
                          item.key === "profile"
                            ?
                            <div style={{ position: 'relative' }}>
                              <ArrowIcon src={item.image} themeDark={themeDark} />
                            </div>
                            :
                            <ArrowIcon src={item.image} themeDark={themeDark} />
                        }
                      </>
                  )}
                  {item.title}
                </RowFixed>
                {
                  chainId !== ChainIds.esc && index === 4 &&
                  (
                    <Column style={{ marginLeft: 30 }}>
                      <SubItemButton onClick={(e: any) => {
                        // if(chainId===ChainId.esc){
                        //   message.warn('coming soon~')
                        //   return
                        // }
                        e.stopPropagation()
                        setSubIndex(1)
                        changeNav("myBankEarn")

                      }}>
                        <Text
                          fontSize={24}
                          fontColor={subIndex === 1 ? "#fff" : isDark ? "#fff" : "#000"}
                        >
                          Earn
                        </Text>
                      </SubItemButton>
                      {
                        !wrongNetwork
                          ?
                          <SubItemButton
                            onClick={(e: any) => {
                              // if(chainId===ChainId.esc){
                              //   message.warn('coming soon~')
                              //   return
                              // }
                              e.stopPropagation()
                              setSubIndex(2)
                              changeNav("myBankFarming")
                            }}>

                            <Text
                              fontSize={24}
                              fontColor={subIndex === 2 ? "#fff" : isDark ? "#fff" : "#000"}
                            >
                              Farming
                            </Text>
                          </SubItemButton>
                          :
                          <SubItemButton >
                            <Text
                              fontSize={24}
                              fontColor={subIndex === 2 ? "#ffffff4f" : isDark ? "#fff" : "#000"}
                            >
                              Farming
                            </Text>
                          </SubItemButton>
                      }
                      {!wrongNetwork ?
                        <SubItemButton onClick={(e: any) => {
                          e.stopPropagation()
                          setSubIndex(3)
                          changeNav("myBankAssetPrice")
                        }
                        }>
                          <Text
                            fontSize={24}
                            fontColor={subIndex === 3 ? "#fff" : isDark ? "#fff" : "#000"}
                          >
                            Asset Price
                          </Text>
                        </SubItemButton>
                        :
                        <SubItemButton onClick={() => setSubIndex(3)}>
                          <Text
                            fontSize={24}
                            fontColor={subIndex === 3 ? "#ffffff4f" : isDark ? "#fff" : "#000"}
                          >
                            Asset Price
                          </Text>
                        </SubItemButton>
                      }
                    </Column>
                  )
                }
              </Column>
            </RowFixed>
          </StyledNavLink>
        );
      })}
      {/*{
      menus[selectIndex].key == 'doc' && <ColumnCenter>
        <Text style={{marginTop:5,marginBottom:5,width:150,marginLeft:50}} fontSize={15} onClick={()=>{
          window.open('https://creda.app/img/creda_whitepaper.pdf')
        }}>Whitepaper</Text>
        <Text style={{width:150,marginLeft:50}} fontSize={15} onClick={()=>{
          window.open('https://creda-app.gitbook.io/creda-protocol/')
        }}>Protocol Litepaper</Text>
      </ColumnCenter>
    }*/}
    </div>)
}
const ThemeButton = styled(RowFixed)`
  // width:60px;
  // height:60px;
`;
const JianTouIcon = styled.img`
  width: 5px;
  margin-left:2px
`;
const ArrowIcon = styled.img<{
  themeDark?: boolean | null;
}>`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  filter: ${({ themeDark }) => `${themeDark ? "invert(0)" : "invert(1)"}`};

  &.custom-about-us-icon {
    height: 26px;
    width:19px;
  }

`;
const WarnningIcon = styled.img`
  width: 26px;
  height: auto;
  margin-right: 10px;
  margin-top: -10px;
  @media (max-width: 768px) {
    width: 14px;
    margin-top: 1px;
  } ;
`;
const WarnningView = styled.div`
  width: 100%;
  background-color: #4e55ff;
  padding: 10px 90px;
  @media (max-width: 768px) {
    padding: 5px 15px;
    margin-bottom: 15px;
  }
  margin-bottom: 30px;
`;

const MenuView = styled.div<{
  themeDark?: boolean | null;
}>`
  position: fixed;
  left: 0;
  right: 0;
  top: 0px;
  bottom: 0px;
  z-index: 999;
  background-color: ${({ themeDark }) => `${themeDark ? "black" : "white"}`};
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
const StyledNavLink = styled.div`
  align-items: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // height: 45px;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 12px;
`;
const StyledNormal = styled(Column)`
  align-items: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 45px;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 0px;
`;
const MenuIcon = styled.img<{
  themeDark?: boolean | null;
}>`
  width: 20px;
  height: 20px;
  margin-right: 15px;
  filter: ${({ themeDark }) => `${themeDark ? "invert(0)" : "invert(1)"}`};
`;
