import ImageCommon from '@assets/common/ImageCommon'
import lottie_loading from '@assets/lottie/lf30_editor_zt6iytgw.json'
import Circle from '@assets/svg/lightcircle.svg'
import ImageToken from '@assets/tokens/ImageToken'
import { Lottie } from "@crello/react-lottie"
import { Skeleton } from "antd"
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useHistory } from 'react-router-dom'
import { animated, config, useSpring } from 'react-spring'
import styled, { keyframes } from 'styled-components'
import { colors, formatBalance, panelPairs } from '../../common/Common'
import ContractConfig from '../../contract/ContractConfig'
import { useTheme } from "../../state/application/hooks"
import { useBalance } from '@services/tokens.service'

export const Content = styled.div`
  width:100%;
`

export interface base_type {
  marginLeft?: string,
  marginRight?: string,
  marginTop?: string,
  marginBottom?: string,
  height?: string,
  width?: string,
  onClick?: any,
  textAlign?: string,
  backgroundColor?: string,
  maxWidth?: string,
  minWidth?: string,
  paddingLeft?: string,
  paddingRight?: string,
  paddingTop?: string,
  paddingBottom?: string,
  opacity?: number,
  pointerEvents?: string,
  disabled?: boolean,
  position?: string,
  cursor?: string
}

export const BaseView = styled.div<base_type>`
   margin-left:${props => props.marginLeft};
    margin-right:${props => props.marginRight};
    margin-top:${props => props.marginTop};
    margin-bottom:${props => props.marginBottom};
    padding-left:${props => props.paddingLeft};
    padding-right:${props => props.paddingRight};
    padding-top:${props => props.paddingTop};
    padding-bottom:${props => props.paddingBottom};
    height:${props => props.height};
    width:${props => props.width};
    text-align:${props => props.textAlign};
    background-color:${props => props.backgroundColor};
    max-width:${props => props.maxWidth};
    min-width:${props => props.minWidth};
    opacity:${props => props.disabled ? 0.6 : 1};
    pointer-events:${props => props.disabled ? "none" : "auto"};
    position:${props => props.position};
    cursor:${props => props.cursor};
    position:relative;
`
export const WinView = styled(BaseView)`
     @media (max-width: 768px) {
       display:none;
     };
`
export const MobileView = styled(BaseView)`
     display:none;
     @media (max-width: 768px) {
       display:block;
    };
`
export const CenterView = styled(BaseView)`
   text-align:center;
`
export const FlexView = styled(BaseView)`
   display:flex;
   align-items:center;
`
export const FlexViewItem = styled(BaseView)`
   flex:1;
`
export const FlexViewCenter = styled(BaseView)`
   display:flex;
   align-items:center;
   justify-content:center;
   width:100%;
`
export const FlexViewCenterColumn = styled(FlexViewCenter)`
   flex-direction:column;
`
export const FlexViewBetween = styled(BaseView)`
   display:flex;
   align-items:center;
   justify-content:space-between;
   width:100%;
`
export const FlexViewAround = styled(BaseView)`
   display:flex;
   align-items:center;
   justify-content:space-around;
`
export const TopContent = styled(FlexViewCenter)`
  flex-direction:column;
`
export const ButtonView = styled(FlexViewCenter)`
  height: 25px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 800;
  color: ${colors.main};
  width:100%;
  cursor:pointer;
`
export const ButtonIcon = styled.img`
  width:15px;
  margin-right:15px;
`
export const ButtonViewSamll = styled(ButtonView)`
  height: 18px;
 font-size:10px;
 border-radius: 5px;
 max-width:100px;
 color: ${colors.white};
`
export const Button = React.memo(({ icon, title, style, size }: any) => {
  let Warp = ButtonView
  if (size === 'sm') {
    Warp = ButtonViewSamll
  }
  return (
    <Warp
      {...style}
    >
      {icon && <ButtonIcon
        src={icon}
      ></ButtonIcon>}
      {title}
    </Warp>
  )
})

export const CardView = styled(BaseView)`
  border-radius: 10px;
  padding:15px;
  background-size:auto 100%;
  background-position:top right;
  background: linear-gradient(212deg, #181B2C, #A7E4E5);
`
export const CardNumber = styled(BaseView)`
  font-size: 15px;
  font-weight: bold;
  color: ${colors.white};
  text-shadow: 0px 1px 5px #000000;
  background: linear-gradient(161deg, #FFFFFF 0%, #A7E4E5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
export const CardIcon = styled.img`
  height:18px;
`
export const CardPairIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  // background-color:red;
  @media (max-width: 768px) {
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
`
export const CardPairIcon2 = styled(CardPairIcon)`
  position:relative;
  margin-left:-10px;
  @media (max-width: 768px) {
    margin-left:-8px;
  }
`
export const CardPairTitle = styled(BaseView)`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  @media (max-width: 768px) {
    font-size: 12px;
  };
  margin-left:10px;
`
export const CardPair = React.memo(({ pair1, pair2, style, showTitle }: any) => {
  return (
    <FlexView
      {...style}
    >
      <CardPairIcon src={ImageToken[pair1]}></CardPairIcon>
      {pair2 && <CardPairIcon2 src={ImageToken[pair2]}></CardPairIcon2>}
      {
        showTitle && <CardPairTitle>
          {
            pair2 ? (pair1 + '/' + pair2) : pair1
          }
        </CardPairTitle>
      }
    </FlexView>
  )
})
export const CardPairCustom = React.memo(({ pair1, pair2, style, showTitle }: any) => {
  return (
    <FlexView
      {...style}
    >
      <CardPairIcon src={pair1}></CardPairIcon>
      {pair2 && <CardPairIcon2 src={pair2}></CardPairIcon2>}
      {
        showTitle && <CardPairTitle>
          {
            pair2 ? (pair1 + '/' + pair2) : pair1
          }
        </CardPairTitle>
      }
    </FlexView>
  )
})
export const CardPairOrigin = React.memo(({ pairs, icons, style, showTitle }: any) => {
  if (!pairs || !icons) {
    return null
  }
  return (
    <FlexView
      {...style}
    >

      {
        icons.map((item: any, index: number) => {
          if (index === 0) {
            return <CardPairIcon src={item}></CardPairIcon>
          }
          return <CardPairIcon2
            src={item}
          ></CardPairIcon2>
        })
      }
      {
        showTitle && <CardPairTitle>
          {
            pairs.join("+")
          }
        </CardPairTitle>
      }
    </FlexView>
  )
})
export function AnimatedNumber({ to, view }: any) {
  const AnimatedView = animated(view)
  const { number } = useSpring({
    reset: true,
    from: { number: 0 },
    number: Number(to),
    delay: 50,
    config: config.default
  })

  return <AnimatedView>{number}</AnimatedView>
}

export const ModalView = styled(FlexViewCenter)`
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  backgroundColor:${colors.black_7};
  z-index:9999;
`

export interface modal_type {
  onCancel: () => void,
  show: boolean,
  children?: any
}

export function Modal({ onCancel, show, children }: modal_type) {
  if (!show) {
    return null
  }
  return (
    <ModalView
      onClick={onCancel}
    >
      {children}
    </ModalView>
  )
}

const PanelView = styled(FlexView)`
  height: 60px;
  border: 2px solid ${colors.main};
  border-radius: 5px;
  padding-left:20px;
  padding-right:20px;
  position:relative;
  @media (max-width: 768px) {
    height: 30px;
    border: 1px solid ${colors.main};
    padding-left:10px;
    padding-right:10px;
  };
`
const PanelValue = styled.input`
  font-size: 26px;
  flex:1;
  outline: none;
  background:none;
  outline:none;
  border:none;
  font-weight: 500;
  width: 100%;
  @media (max-width: 768px) {
    font-size: 13px;
  };
`
const MaxButton = styled(FlexViewCenter)`
  width: 75px;
  height: 30px;
  background: ${colors.main};
  border-radius: 5px;
  color:${colors.white};
  margin-right:20px;
  cursor:pointer;
  padding:5px 10px;
  @media (max-width: 768px) {
    width: 37px;
    height: 15px;
    margin-right:10px;
    font-size:10px;
    padding:2px 5px;
  };
`

// 下拉列表组件
export const InputPanel = ({ onChangeValue, onChangeSymbol }: any) => {
  const [show, setShow] = useState(false);
  const [item, setItem] = useState<any>({});
  const [value, setValue] = useState("");
  useEffect(() => {
    changeSymbol(panelPairs[1], "0")
  }, [])

  function changeValue(value: string) {
    setValue(value)
    onChangeValue && onChangeValue(value);
  }

  function changeSymbol(symbol: string, balance: string) {
    setItem({
      symbol: symbol,
      balance: balance
    })
    setShow(false)
    onChangeSymbol && onChangeSymbol(symbol);
  }

  return (
    <PanelView>
      <PanelValue
        placeholder={'0.0000'}
        value={value}
        onChange={(e) => changeValue(e.target.value)}
      ></PanelValue>
      {item.symbol ? <>
        <MaxButton
          onClick={() => changeValue(item.balance)}
        >
          MAX
        </MaxButton>
        <TokenInfo
          symbol={item.symbol}
        ></TokenInfo>
      </> : <TokenTitle>Select token</TokenTitle>}
      <CustomIcon
        src={ImageCommon.icon_down}
        size={isMobile ? 12 : 25}
        onClick={() => setShow(!show)}
      ></CustomIcon>
      {show && <PanelList
        onChangeItem={(data: any) => {
          changeSymbol(data.symbol, data.balance);
        }}
      ></PanelList>}
    </PanelView>
  )
}
const PanelList = ({ onChangeItem }: any) => {
  // useEffect(()=>{
  //   onChangeItem && onChangeItem(panelPairs[0])
  // },[])
  return (
    <PanelItemView>
      {panelPairs.map((item, index) => {
        return (<PanelItem
          symbol={item}
          onSelect={(data: any) => {
            onChangeItem && onChangeItem(data)
          }}
        ></PanelItem>)
      })}
    </PanelItemView>
  )
}
const PanelItemView = styled(BaseView)`
  position:absolute;
  left:0;
  right:0;
  top:100%;
  z-index:999;
  background:${colors.white};
  padding:10px;
  padding-bottom:0;
`
const PanelItemList = styled(FlexViewBetween)`
  margin-bottom:10px;
  cursor:pointer;
  &:hover {
    background:${colors.grey};
  }
`
const PanelItem = ({ symbol, onSelect }: any) => {
  const info = useBalance(symbol);
  return (
    <PanelItemList
      onClick={() => {
        onSelect && onSelect({ symbol, balance: info.balance })
      }}
    >
      <TokenInfoItem
        symbol={symbol}
      ></TokenInfoItem>
      {info.loading ? <CustomLightSpinner src={Circle} alt="loader" size={'20px'} /> :
        <PanelItemTitle>{formatBalance(info.balance)}</PanelItemTitle>}

    </PanelItemList>
  )
}

const PanelItemTitle = styled(BaseView)`
  font-size: 18px;
  font-weight: 500;
  color: ${colors.title};
  @media (max-width: 768px) {
    font-size: 9px;
  };
`

interface icon_type {
  size?: number,
  mSize?: number
}

export const CustomIcon = styled.img<icon_type>`
  width: ${props => props.size ? props.size + "px" : "36px"};
  height: auto;
  cursor:pointer;
  @media (max-width: 768px) {
    width: ${props => ((props.mSize || props.size) + "px") || "36px"};
  };
`
export const TokenTitle = styled(BaseView)`
  font-size: 24px;
  font-weight: 500;
  color: ${colors.title};
  margin-left:10px;
  margin-right:10px;
  @media (max-width: 768px) {
    font-size: 12px;
    margin-left:5px;
    margin-right:5px;
  };
`
export const TokenTitleItem = styled(TokenTitle)`
 font-size: 16px;
 @media (max-width: 768px) {
  font-size: 8px;
};

`
export const TokenInfo = ({ symbol }: any) => {
  return (
    <FlexView>
      <CustomIcon
        size={isMobile ? 18 : 36}
        src={ContractConfig[symbol]?.icon}
      ></CustomIcon>
      <TokenTitle>{symbol}</TokenTitle>
    </FlexView>
  )
}
export const TokenInfoItem = ({ symbol }: any) => {
  return (
    <FlexView
      minWidth={isMobile ? "30px" : "85px"}
    >
      <CustomIcon
        src={ContractConfig[symbol].icon}
        size={isMobile ? 10 : 20}
      ></CustomIcon>
      <TokenTitleItem>{symbol}</TokenTitleItem>
    </FlexView>
  )
}
export const ModalBg = styled(BaseView)`
    position:absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background-color:${colors.black_7};
`

export function LoadingCircle() {
  return (
    <CustomLightSpinner src={Circle} alt="loader" size={'20px'} marginLeft={10} />
  )
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
export const Spinner = styled.img`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`
// 动画loading
export const CustomLightSpinner = styled(Spinner) <{ size: string, marginLeft?: number }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  margin-left:${({ marginLeft }) => marginLeft + 'px'};
`
export const Body = styled.div`
  display:flex;
  height:100%;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  overflow-y: hidden;
  padding-bottom:200px;
`
export const BottomLogo = styled(FlexViewCenter)`
  position:absolute;
  left:0;
  bottom:0;
  padding-top:20px;
  padding-bottom:20px;
`
const LoadingView = styled(FlexViewCenter)`
    position:absolute;
    left:0;
    top:0;
    bottom:0;
    right:0;
    pointer-events:auto;
`

export function BgLoading() {
  return (
    <LoadingView
      onClick={(e: any) => {
        e.stopPropagation()
      }}
    >
      <Lottie config={{
        loop: true,
        autoplay: true,
        animationData: lottie_loading,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }}
        width={"60%"}
        height={"auto"}
      />
    </LoadingView>
  )
}

export function ProfileLoading({ loading = true }) {
  if (!loading) {
    return null
  }
  return (
    <FlexViewCenter
      onClick={(e: any) => {
        e.stopPropagation()
      }}
    >
      <Lottie config={{
        loop: true,
        autoplay: true,
        animationData: ImageCommon.profileLoading,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      }}
        width={"30%"}
        height={"auto"}
      />
    </FlexViewCenter>
  )
}

export const BlueButton = styled(CenterView)`
    width: 90px;
    height: 30px;
    background: linear-gradient(
90deg,#4a1ee1,#1890ff);
    border-radius: 15px;
    font-size:14px;
    line-height:30px;
    color: #FBFCFC;
    cursor:pointer;
    font-weight: bold;
    &:hover {
        background: #4fa2ff;
    }
    @media (max-width: 768px) {
        width: 70px;
        font-size:13px;
    }
`
export const WhiteButton = styled(BlueButton)`
   background: #FFFFFF;
   color: #4E55FF;
   &:hover {
        background: #4fa2ff;
        color: #FFFFFF;
    }
`

export const LgWhiteButton = styled.button`
  font-weight: 600;
  font-size: 19px;
  height: 38px;
  border-radius: 40px;
  padding: 0px 38px;
  border: none;
  &:focus {
    background: linear-gradient(90deg, #3A0080, #4A29FF);
    color: #00FFFF;
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    padding: 0 20px;
    height: 32px;
    font-size: 16px;
  }
  @media (max-width: 767px) {
    padding: 0 16px;
    height: 28px;
    font-size: 13px;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0 10px;
    font-size: 13px;
  }
  @media (min-width: 1800px) {
    height: 48px;
    //min-width: 146px;
  }



   background: #FFFFFF;
   color: #4E55FF;
   &:hover {
        background: #4fa2ff;
        color: #FFFFFF;
    }
`

export const LgBorderButton = styled.button`
  cursor: pointer;
  font-weight: 600;
  font-size: 19px;
  height: 38px;
  border-radius: 40px;
  padding: 0px 38px;
  background-color:transparent;
  border:1px solid #FBFCFC;
  &:focus {
    background: linear-gradient(90deg, #3A0080, #4A29FF);
    color: #00FFFF;
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    padding: 0 26px;
    height: 32px;
    font-size: 16px;
  }
  @media (max-width: 767px) {
    padding: 0 24px;
    height: 28px;
    font-size: 13px;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 0 15px;
    font-size: 13px;
  }
  @media (min-width: 1800px) {
    height: 48px;
    //min-width: 146px;
  }
   /*&:hover {
        background: #17181A;
        color: #FFFFFF !important;
    }*/
`
interface active_item {
  data: { title: string }[],
  initSelect?: number,
  onItemChange?: any
}

export const ActiveBar = React.memo(({
  data, initSelect = 0, onItemChange = () => {
  }
}: active_item) => {
  const themeDark = useTheme()
  const [select, setSelect] = React.useState(initSelect);

  function changeTab(index: number) {
    setSelect(index);
    onItemChange(index);
  }

  return (
    <ActiveWrap>
      {data.map((item, index) => {
        return select === index ? <ActiveItem
          themeDark={Boolean(themeDark)}
        >
          {item.title}
        </ActiveItem> : <ActiveItemUn
          themeDark={Boolean(themeDark)}
          onClick={() => changeTab(index)}
        >
          {item.title}
        </ActiveItemUn>
      })}
    </ActiveWrap>
  )
})

const ActiveWrap = styled(FlexViewCenter)`
    width: 240px;
    height: 44px;
    border: 1px solid ${colors.main};
    border-radius: 10px;
    overflow:hidden;
    cursor:pointer;
     @media (max-width: 768px) {
       width: 120px;
        height: 30px;
    };
`
const ActiveItem = styled(FlexViewCenter) <{
  themeDark: boolean
}>`
    background-color:${colors.main};
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.themeDark ? colors.black : colors.white};
    flex:1;
    height:100%;
     @media (max-width: 768px) {
        font-size: 14px;
    };
`
const ActiveItemUn = styled(ActiveItem) <{
  themeDark: boolean
}>`
     color: ${props => props.themeDark ? colors.white : colors.black};
    background-color:${colors.transparent};
`
let scrollY = 0;
export function ScrollToTop(props: any) {
  const history = useHistory();
  // const location = useLocation()
  useEffect(() => {

    history.listen((locationState, action) => {
      if (action === "PUSH") {
        scrollY = window.scrollY
        window.scrollTo({ left: 0, top: 0 })
      }
      if (action === "POP") {
        window.scrollTo({ left: 0, top: scrollY })
      }
      // console.log(action,location,locationState)
    })
  }, [])
  return props.children
}

export function LoadingRow({ width = "100px" }) {
  return <BaseView
    width={width}
  >
    <Skeleton active paragraph={false} />
  </BaseView>
}
