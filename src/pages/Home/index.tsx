import { BgImages } from "@assets/bgImages/bgImages"
import ImageCommon from '@assets/common/ImageCommon'
import anim1 from '@assets/lottie/CreDa_website_animation1.json'
import anim2 from '@assets/lottie/CreDa_website_animation2-wallets.json'
import mobile_anim2 from '@assets/lottie/CreDa_website_animation2_resizeForMobile.json'
import anim3 from '@assets/lottie/CreDa_website_animation3-hand.json'
import mobile_anim3 from '@assets/lottie/CreDa_website_animation3_mobileview.json'
import anim4 from '@assets/lottie/CreDa_website_animation4.json'
import mobile_anim4 from '@assets/lottie/CreDa_website_animation4_mobileview.json'
import { Base } from "@components/Button"
import { Column, ColumnCenter } from '@components/Column'
import Row, {
  ContentParagraph,
  CustomGrid,
  FontPoppins,
  GradientButton,
  RowBetween,
  RowCenter,
  SpaceHeight,
  Text,
  WrapMaxWidth
} from '@components/Row'
import { ThemeText } from '@components/ThemeComponent'
import { Lottie } from "@crello/react-lottie"
import { useContext, useEffect, useRef } from 'react'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { WalletAddressContext } from "../../contexts"
import { useOpenWarnning, useTheme } from "../../state/application/hooks"
import { MainFullBody } from '../AppBody'

export const ButtonClick = styled(Base)`
  padding: 0;
  width: fit-content;
  border-radius: 0;
  outline: none;
  text-decoration: none;
  display: flex;
  flex-wrap: nowrap;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  };
  background-color:transparent;
  flex-direction: row;
  pointer-events:${props => props.disabled ? "none" : "auto"};
  opacity:${props => props.disabled ? 0.5 : 1};
`
const TopImage = styled.img`
  height:1250px;
  width:auto;
  position:absolute;
  top:0;
  left:0;
`
const TopImageRigth = styled.img`
  height:1035px;
  width:auto;
  position:absolute;
  top:0;
  right:0;
`

const TopPhoneImage = styled.img`
  width:100%;
  position:absolute;
  top:400px;
  left:0;
`
const CenterImage = styled.img`
  width:630px;
  position:absolute;
  top:1700px;
  right:0;
  // z-index:-2
`
const GetStarted = styled(ButtonClick)`
  color:#FBFCFC;
  background-color:#4F56FF;
  font-size:16px;
  height:48px;
  border-radius:24px;
  margin-right:40px;
  padding:0px 24px;
  @media (max-width: 768px) {
    margin-right:28px;
  };
`
const LearnMore = styled(ButtonClick)`
  color:#FBFCFC;
  font-size:16px;
  height:48px;
  border-radius:24px;
  border:1px solid #FBFCFC;
  padding:0px 24px
`
const CenterBody = styled(RowBetween)`
  width:972px;
  border-radius:24px;
  padding:90px;
  height:500px;
`
const CarsouBodyPhone = styled(ColumnCenter)`
  width:${window.screen.width - 60}px;
  border-radius:20px;
  padding:0px 20px;
  padding-top:36px;
  background-color:red;
  height:570px
`
const CenterArrowImage = styled.img`
  width:20px;
  height:auto
`
const CenterRightImage = styled.img`
  width:353px;
  height:auto;
  @media (max-width: 768px) {
    width:200px;
  };
`
const DownItem = styled(Column)`
  width:357px;
  height:500px;
  border-radius:20px;
  padding:0px 30px;
  // justify-content:center;
  align-items:center
`
const DownItemCircle = styled.img`
  width:126px;
  height:auto;
  margin-top:97px;
  margin-bottom:47px;
  @media (max-width: 768px) {
    margin-top:40px;
    margin-bottom:35px;
  }
`
const LineCircle = styled.div`
  height:12px;
  width:12px;
  border-radius:6px;
  border:2px solid #4E55FF
`
const LineItem = styled.div`
  height:1px;
  width:5px;
  background-color:#4E55FF;
  margin:0px 2px;
  @media (max-width: 768px) {
    height:5px;
    width:1px;
    margin:2px 0px
  }
`
const StepCircle = styled(Column)`
  height:54px;
  width:54px;
  margin-bottom:30px;
  align-items:center;
  justify-content:center;
  @media (max-width: 768px) {
    height:74px;
    width:74px;
    margin-bottom:20px;
  };
`
const StepCircleImage = styled.img`
  width:auto;
  height:54px;
  @media (max-width: 768px) {
    height:74px;
  }
`
const CarouselBodyPhone = styled(ColumnCenter)`
  background-color:#0D0D11;
  padding:35px 20px 0px 20px;
  height:700px;
  width:100%;
  border-radius:20px;
  justify-content:space-between;
  padding-bottom:50px;
  @media (max-width: 768px) {
    padding:20px 10px 20px 10px;
  }
`
const Parenter = styled(ColumnCenter)`
  background-image:${() => isMobile ? null : `url(${ImageCommon.parenterBgImg})`};
  background-position:center;
  background-size:895px 400px;
  background-repeat: no-repeat;
  height:400px;
  width:895px;
  padding:120px 97px;
  justify-content:space-between;
  @media (max-width: 768px) {
    width:100%;
    height:240px;
    background-size:100% 100px;
    padding:20px 20px;
  }
`
const Parenter_icon_1 = styled.img`
  width:150px;
  height:auto;
  @media (max-width: 768px) {
    width:150px;
  }
`
const Parenter_icon_2 = styled.img`
  width:250px;
  height:auto;
  @media (max-width: 768px) {
    width:150px;
  }
`
const Parenter_icon_3 = styled.img`
  width:130px;
  height:auto;
  @media (max-width: 768px) {
    width:150px;
  }
`

const TopCardTras1 = styled(Column)`
  position:absolute;
  width:480px;
  left:140px;
  top:360px;
  padding-left:30px;
  transform:rotate(14deg);
  -ms-transform:rotate(14deg);
  -moz-transform:rotate(14deg);
  -webkit-transform:rotate(14deg);
  -o-transform:rotate(14deg);
`
const TopCardTras2 = styled(Column)`
  position:absolute;
  width:480px;
  left:200px;
  top:600px;
  padding-left:30px;
  transform:rotate(-17deg);
  -ms-transform:rotate(-17deg);
  -moz-transform:rotate(-17deg);
  -webkit-transform:rotate(-17deg);
  -o-transform:rotate(-17deg);
`

const CenterCarouse = styled.img`
  width:100%;
  height:auto;
  position:absolute;
  top:3700px
`
const DownItemPhone = styled(Column)`
  background-color:#121316;
  border-radius:20px;
  margin-left:30px;
  margin-right:30px;
  align-items:center;
  padding:0px 15px;
  padding-bottom:58px
`

const PhoneTopCardTras1 = styled(Column)`
  margin-top:50px;
  width:311px;
  height:297px;
  background-image:url(${ImageCommon.phone_card_1_img});
  background-position:center;
  background-size:100% 100%;
  background-repeat: no-repeat;
  z-index:2
`
const PhoneTopCardTras2 = styled(Column)`
  width:296px;
  height:268px;
  background-image:url(${ImageCommon.phone_card_2_img});
  background-position:center;
  background-size:100% 100%;
  background-repeat: no-repeat;
  margin-top:-100px;
  z-index:1
`
const PhoneTopCardTras1_Item = styled(Column)`
  transform:rotate(15deg);
  -ms-transform:rotate(15deg);
  -moz-transform:rotate(15deg);
  -webkit-transform:rotate(15deg);
  -o-transform:rotate(15deg);
  width:80%;
  height:100px;
  margin-top:125px;
  justify-content:space-between;
  margin-left:35px
`
const PhoneTopCardTras2_Item = styled(Column)`
  transform:rotate(-17deg);
  -ms-transform:rotate(-17deg);
  -moz-transform:rotate(-17deg);
  -webkit-transform:rotate(-17deg);
  -o-transform:rotate(-17deg);
  width:80%;
  height:100px;
  margin-top:110px;
  justify-content:space-between;
  margin-left:50px
`

const ContentBox = styled.div<{
  themeDark?: boolean | null
}>`
  position: relative;
  z-index: 1;
  background: ${({ themeDark }) => `${themeDark ? '#000000' : '#FFFFFF'}`};
  padding: 36px 36px;
  max-width: 730px;
  margin-left: auto;
  font-family: 'Poppins Regular';
  @media (min-width: 768px) and (max-width: 1024px) {
    max-width: 380px !important;
    .subHeading {
      font-size: 30px;
    }
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    max-width: 510px;
    .subHeading {
      font-size: 30px;
    }
  }
  @media (max-width: 767px) {
    padding: 20px;
    margin-right: -16px;
    width: 320px;
    margin-top: ${({ themeDark }) => `${themeDark ? '108px' : '200px'}`};
    //margin-top: 200px;
  }
`

const ContentBoxFull = styled.div<{
  themeDark?: boolean | null
}>`
  background: ${({ themeDark }) => `${themeDark ? '#000000' : '#FFFFFF'}`};
  padding: 55px;
  width: 100%;
  @media (min-width: 768px) and (max-width: 1700px) {
    .subHeading {
      font-size: 30px;
    }
  }
  @media (max-width: 1160px) {
    padding: 30px;
    ${CustomGrid} {
      padding-left: 0;
      padding-right: 0;
    }
  }
  @media (max-width: 767px) {
    padding: 20px;
  }
`

const CustomPreTag = styled.pre`
  overflow: unset;
  font-family: inherit;
  white-space: pre-line;
  line-height: 1.1;
  margin-bottom: 20px;
`

const GradientText = styled.span`
  background: linear-gradient(360deg, #00B8FF 0%, #3466FF 103.91%);
  background: -webkit-linear-gradient(0deg, #00B8FF 0%, #3466FF 103.91%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media(max-width: 767px) {
    display: block;
  }
`

const PlayButton = styled.div`
  position: relative;
`

const GradientBox = styled.div`
  padding: 30px;
  background: linear-gradient(180deg, #3D13B8 0%, #1AB3FF 100%);
  min-height: 300px;
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 20px;
  }
`

const HeroSection = styled.div<{
  themeDark: boolean | null
}>`
  position: relative;
  background-image: ${({ themeDark }) => `${themeDark ? 'radial-gradient(100% 197.84% at 100% 0%, #4926F6 0%, #300169 46.28%, #000100 100%)' : 'url(' + BgImages.HeroSectionBg + ')'}`};
  // background-image: ${({ themeDark }) => `${themeDark ? 'url(' + BgImages.Binary476ImgBg + '),radial-gradient(100% 197.84% at 100% 0%, #4926F6 0%, #300169 46.28%, #000100 100%)' : 'url(' + BgImages.HeroSectionBg + ')'}`};
  background-repeat: no-repeat;
  background-position: ${({ themeDark }) => `${themeDark ? 'left center' : 'center'}`};
  background-size: ${({ themeDark }) => `${themeDark ? 'auto 100%' : 'cover'}`};
  transition: .4s;
  .heroSectionWrap {
    margin-top: 100px;
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    .heroHeading {
      font-size: 45px !important;
    }
  }
  @media (min-width: 1701px){
    .heroSectionWrap {
      margin-top: 270px;
    }
  }
  @media (max-width: 767px){
    background-position: ${({ themeDark }) => `${themeDark ? '0px top' : '-215px top'}`}  ;
    background-size: ${({ themeDark }) => `${themeDark ? '170%' : 'cover'}`};
    .heroSectionWrap {
      margin-top: ${({ themeDark }) => `${themeDark ? '121px' : '270px'}`};
      //margin-top: 270px;
      margin-right: -16px;
    }
    .heroHeading {
      font-size: 22px !important;
    }
    ${ContentBox} {
      width: 300px;
    }
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    background-position: ${({ themeDark }) => `${themeDark ? '0px center' : '-228px top'}`}  ;
    background-size: ${({ themeDark }) => `${themeDark ? '137%' : 'cover'}`};
    ${CustomGrid} {
      grid-template-columns: 35% 65%;
      padding-top: 60px;
      padding-bottom: 60px;
    }
  }
`

const SecondSection = styled.div<{
  themeDark: boolean | null
}>`
  position:relative;
  background-image: ${({ themeDark }) => `${themeDark ? 'radial-gradient(100% 1381.64% at 100% 0%, #4825F2 0%, #2F0168 45.31%, #000100 76.04%)' : 'url(' + BgImages.HandKeyboardBg + ')'}`};
  //background-image: ${({ themeDark }) => `${themeDark ? 'url(' + BgImages.FoldersImgBg + '),radial-gradient(100% 1381.64% at 100% 0%, #4825F2 0%, #2F0168 45.31%, #000100 76.04%)' : 'url(' + BgImages.HandKeyboardBg + ')'}`};
  background-repeat: no-repeat;
  background-position: ${({ themeDark }) => `${themeDark ? 'left center' : 'center'}`};
  background-size: ${({ themeDark }) => `${themeDark ? 'auto 100%' : 'cover'}`};
  transition: .4s;
  @media (max-width: 767px) {
    background-image: ${({ themeDark }) => `${themeDark ? 'radial-gradient(100% 1381.64% at 100% 0%, #4825F2 0%, #2F0168 45.31%, #000100 76.04%)' : 'url(' + BgImages.HandKeyboardBgMob + ')'}`};
    background-position: ${({ themeDark }) => `${themeDark ? '0px top' : '0 top'}`}  ;
    background-size: ${({ themeDark }) => `${themeDark ? '130%' : 'cover'}`};
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    background-position: ${({ themeDark }) => `${themeDark ? '0px top' : '-123px  top'}`}  ;
    background-size: ${({ themeDark }) => `${themeDark ? '100%' : 'cover'}`};
    ${CustomGrid} {
      grid-template-columns: 35% 65%;
      padding-top: 60px;
      padding-bottom: 60px;
    }
  }
  @media (max-width: 1910px) and (min-width: 768px) {
    ${CustomGrid} {
      padding-top: 60px !important;
      padding-bottom: 60px !important;
    }
  }
`

const ThirdSection = styled.div<{
  themeDark: boolean | null
}>`
  position:relative;
  background-image: ${({ themeDark }) => `${themeDark ? 'radial-gradient(109.36% 3021.89% at -5.77% 8.82%, #4825F2 0%, #2F0168 50.19%, #22014D 87.44%, #000100 100%)' : 'url(' + BgImages.MobilesBg + ')'}`};
  // background-image: ${({ themeDark }) => `${themeDark ? 'url(' + BgImages.BitCoinsHandBg + '),radial-gradient(109.36% 3021.89% at -5.77% 8.82%, #4825F2 0%, #2F0168 50.19%, #22014D 87.44%, #000100 100%)' : 'url(' + BgImages.MobilesBg + ')'}`};
  background-repeat: no-repeat;
  background-position: ${({ themeDark }) => `${themeDark ? 'left center' : '-40px center'}`};
  background-size: ${({ themeDark }) => `${themeDark ? 'auto 100%' : 'cover'}`};
  transition: .4s;
  @media (max-width: 767px) {
    background-position: ${({ themeDark }) => `${themeDark ? '0px top' : '-279px top'}`}  ;
    background-size: ${({ themeDark }) => `${themeDark ? '200%' : 'cover'}`};
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    background-position: ${({ themeDark }) => `${themeDark ? '0px center' : '-279px top'}`}  ;
    background-size: ${({ themeDark }) => `${themeDark ? '100%' : 'cover'}`};
    ${CustomGrid} {
      grid-template-columns: 35% 65%;
      padding-top: 60px;
      padding-bottom: 60px;
    }
  }
  @media (max-width: 1910px) and (min-width: 768px) {
    ${CustomGrid} {
      padding-top: 60px !important;
      padding-bottom: 60px !important;
    }
  }
  @media (min-width: 1900px) {
    background-position: ${({ themeDark }) => `${themeDark ? 'left center' : '6px center'}`};

  }
`

const ForthSection = styled.div<{
  themeDark: boolean | null
}>`
  position:relative;
  background-image: ${({ themeDark }) => `${themeDark ? 'radial-gradient(100% 1381.64% at 100% 0%, #4825F2 0%, #2F0168 45.31%, #000100 76.04%)' : 'url(' + BgImages.ShopOpenBg + ')'}`};
  // background-image: ${({ themeDark }) => `${themeDark ? 'url(' + BgImages.SpreadedDollarBg + '),radial-gradient(100% 1381.64% at 100% 0%, #4825F2 0%, #2F0168 45.31%, #000100 76.04%)' : 'url(' + BgImages.ShopOpenBg + ')'}`};
  background-repeat: no-repeat;
  background-position: ${({ themeDark }) => `${themeDark ? 'left center' : 'center'}`};
  background-size: ${({ themeDark }) => `${themeDark ? 'auto 100%' : 'cover'}`};
  transition: .4s;
  @media (max-width: 767px) {
    background-image: ${({ themeDark }) => `${themeDark ? 'radial-gradient(100% 1381.64% at 100% 0%, #4825F2 0%, #2F0168 45.31%, #000100 76.04%)' : 'url(' + BgImages.ShopOpenBgMob + ')'}`};
    background-position: ${({ themeDark }) => `${themeDark ? '0px top' : '0 top'}`}  ;
    background-size: ${({ themeDark }) => `${themeDark ? '100%' : 'cover'}`};
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    background-position: ${({ themeDark }) => `${themeDark ? '0px top' : '-224px top'}`}  ;
    background-size: ${({ themeDark }) => `${themeDark ? '100%' : 'cover'}`};
    ${CustomGrid} {
      grid-template-columns: 35% 65%;
      padding-top: 60px;
      padding-bottom: 60px;
    }
  }
  @media (max-width: 1910px) and (min-width: 768px) {
    ${CustomGrid} {
      padding-top: 60px !important;
      padding-bottom: 60px !important;
    }
  }
`

const GradientWrap = styled.div`
  background: linear-gradient(90deg, #33D1FF 0%, #4A29FE 49.92%, #3B0184 100%);
`

const StepsIconImg = styled.img`
  max-width: 100%;
  margin-bottom: 44px;
`

const StepsJoiningArrow = styled.img`
  max-width: 100%;
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-40px);
`

const StepsSection = styled.div`
  @media (min-width: 768px) and (max-width: 1700px) {
    .stepIndication {
      font-size: 24px;
    }
    .stepsContent {
      font-size: 17px;
    }
    ${CustomGrid} {
      column-gap: 30px;
    }
    ${StepsIconImg} {
      height: 90px;
    }
    ${StepsJoiningArrow} {
      height: 20px;
      left: 95%;
      transform: translateY(-36px);
    }
  }
  @media (max-width: 767px) {
    ${CustomGrid} {
      row-gap: 40px;
    }
  }
`

const ThreeCardsSection = styled.div`
  margin: 80px 0;
  @media (min-width: 1701px) {
    margin: 144px 0;
    ${CustomGrid} > div {
      min-height: 500px;
    }
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    ${CustomGrid} {
      grid-template-columns: 1fr;
      row-gap: 24px
    }
    margin: 0;
  }
    @media (min-width: 768px) and (max-width: 1700px) {
    ${CustomGrid} {
      align-items: baseline;
    }
    ${CustomGrid} > div {
      min-height: 100%;
    }
    .textBadge, .servContent {
      font-size: 14px
    }
    .servHeading {
      font-size: 18px
    }
  }
  @media (max-width: 767px) {
    margin: 0;
    ${CustomGrid} {
      row-gap: 20px;
      .textBadge, .servContent,  .servContent span {
        font-size: 14px
      }
      .servHeading {
        font-size: 18px
      }
    }
  }
`

const GradFrameEff = styled.div`
  padding: 30px;
  @media (min-width: 1191px) {
    padding: 38px;
  }
  @media (max-width: 767px) {
    padding: 16px;
  }
`
const GradFrameEffHome2 = styled.div`
  @media (max-width: 767px) {
    padding: 0px;
  }
`

const VideoDemo = styled.div`
  @media (max-width: 767px) {
    height: 170px !important;
    svg {
      width: 35px;
    }
  }
`

const StepInner = styled.div`
  @media (max-width: 767px) {
    display: grid;
    grid-template-columns: 28% 60% 12%;
    column-gap: 30px;
    align-items: flex-start;
    ${RowCenter} {
      align-items: flex-start;
    }
    .stepIndication {
      text-transform: uppercase;
    }
    ${StepsIconImg} {
      width: 68px;
    }
    ${StepsJoiningArrow} {
      display: none;
    }
    > div:last-child {
      padding-right: 12px;
    }
    .stepsContent {
      font-size: 14px;
      line-height: 1.5;
    }
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    ${StepsIconImg} {
      height: 56px;
    }
    ${StepsJoiningArrow} {
      height: 16px;
    }
    .stepsContent {
      font-size: 15px;
    }
  }
`

const HeroSectionAnimBox = styled.div`
  position: absolute;
  left: -100px;
  @media (min-width: 768px) {
    top: 50%;
    transform: translateY(-50%);
  }
  @media (max-width: 767px) {
    left: 0;
  }
`

const SecondSectionAnimBox = styled.div`
  position: absolute;
  left: 0px;
  @media (min-width: 768px) {
    top: 50%;
    transform: translateY(-50%);

  }
  /*svg > g > g:first-child > image {
    display: none;
  }*/
  @media (max-width: 767px) {
    /*svg > g > g:first-child > image {
      display: none;

    }*/
    svg{
      width:87% !important
    }
    > div {
      // transform: scale(1.5) translateX(30px) translateY(20px);
      //height: 175px !important;
    }
  }
  /*> div {
    height: 596px !important;
  }*/
`

const ThirdSectionAnimBox = styled.div`
  position: absolute;
  left: 0px;
  @media (min-width: 768px) {
    top: 50%;
    transform: translateY(-50%);
  }
  @media (max-width: 767px) {
    > div {
      // transform: scale(1.5) translateX(62px) translateY(29px);
    }
    svg{
      width:90% !important
    }
  }
  /*> div {
    height: 596px !important;
  }*/
`

const IframeWrapper = styled.div`
@media (min-width: 768px) and (max-width: 1700px) {
  >iframe{
    width:497px;
    height:281px
  }
}
@media (min-width: 1700px) {
  >iframe{
    width:700px;
    height:350px
  }
}
`
export const RowCenterWrapper = styled(Row)`
  justify-content: center;
  @media (min-width: 768px) and (max-width: 1700px) {
    margin:48px 0px
  }
  @media (min-width: 1700px) {
   margin:90px -76px
  }
`

const ForthSectionAnimBox = styled.div`
  position: absolute;
  left: 0px;
  @media (min-width: 768px) {
    top: 50%;
    transform: translateY(-50%);
  }
  @media (max-width: 767px) {
    > div {
      // transform: scale(1.5) translateX(62px) translateY(29px);
    }
    svg{
      width:95% !important
    }
  }
  /*> div {
    height: 596px !important;
  }*/
`

function Home(props: any) {
  const hideWarning = useOpenWarnning(false)

  useEffect(() => {
    hideWarning()
  }, [])
  return <>
    {
      isMobile ? <PhoneHomePage props={props} /> : <HomePage props={props} />
    }
  </>
}

const PhoneHomePage = ({ props }: any) => {
  const location = window.location.pathname
  const carouselRef: any = useRef<undefined>()
  const themeDark = useTheme()
  const { t } = useTranslation()
  const { account } = useContext(WalletAddressContext);
  return <MainFullBody history={props.history}>
    <div style={{
      // backgroundColor:'#0D0D11',
      width: '100%',
      paddingTop: 0,
      zIndex: 50
    }}>
      <FontPoppins>
        {location !== '/home2' ?
          <HeroSection themeDark={themeDark}>
            {
              themeDark ?
                <HeroSectionAnimBox>
                  <Lottie config={{
                    loop: true,
                    autoplay: true,
                    animationData: anim1,
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid slice'
                    }
                  }} />
                </HeroSectionAnimBox> : ''
            }
            <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={108} mobPaddingTopBottom={50} mobPaddingLeftRight={30}>
              <div>
                {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
              </div>
              <div>
                <ContentBox className="heroSectionWrap" themeDark={themeDark}>
                  <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                    <FontPoppins>
                      <GradientText>
                        {
                          themeDark ? t('TheWorldsFirst') : t('GetYour')
                        }
                      </GradientText>
                    </FontPoppins>
                  </ThemeText>

                  <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                    <FontPoppins>
                      <GradientText>
                        {
                          themeDark ? t('DeFiCreditRating') : t('CryptoCreditScore')
                        }
                      </GradientText>
                    </FontPoppins>
                  </ThemeText>
                  {
                    themeDark ?
                      <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}><GradientText>{t('System')}</GradientText></ThemeText>
                      : ''
                  }
                  <SpaceHeight height={24} heightApp={15} />
                  <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', alignItems: 'center', gap: '5px' }}>
                    <div>
                      <ContentParagraph fontSize={22} themeDark={themeDark} style={{ marginBottom: '0' }}>
                        <FontPoppins>
                          {
                            themeDark ? t('MintYourCRating') : t('YesYouOne')
                          }
                        </FontPoppins>
                      </ContentParagraph>
                      {
                        !themeDark ? <ContentParagraph themeDark={themeDark} style={{ marginTop: '-4px', marginBottom: '0' }}>
                          <FontPoppins>
                            {t('FindOutWhen')}
                          </FontPoppins>
                        </ContentParagraph> : ''
                      }
                    </div>
                    <div>
                      <GradientButton
                        onClick={() => {
                          props.history.push("/profile")
                        }}
                      >
                        Launch App
                      </GradientButton>
                    </div>
                  </div>

                  {/* <SpaceHeight height={12} heightApp={15}/> */}

                </ContentBox>
              </div>
            </CustomGrid>
          </HeroSection>
          :
          <>
            <GradFrameEffHome2>
              <ContentBoxFull themeDark={themeDark} >
                <WrapMaxWidth>
                  <RowCenter style={{ paddingBottom: '16px' }}>
                    <iframe width="360" height="192" src="https://www.youtube.com/embed/VN31gl4lZCc?controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    {/*<VideoDemo style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:700, height:400, background:'linear-gradient(45deg, #320162, #4a21e9)'}}>
                      <PlayButton>
                        <svg width="127" height="127" viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="63.5" cy="63.5" r="63.5" fill="white" fillOpacity="0.36"/>
                          <path d="M43.4873 35.4472L92.8288 63.9345L43.4873 92.4218L43.4873 35.4472Z" fill="white"/>
                        </svg>
                      </PlayButton>
                    </VideoDemo>*/}
                  </RowCenter>
                  <ThemeText style={{ fontSize: '22px', marginTop: '10px' }} fontWeight={'900'} fontFamily={'Poppins Regular'}>
                    <GradientText style={{ display: 'inherit' }}>{t('ConnectWallet')}</GradientText><br />
                    <GradientText style={{ display: 'inherit' }}>{t('MintYourCreditScore')}</GradientText><br />
                    <GradientText style={{ display: 'inherit' }}>{t('OpenDoors')}</GradientText>
                  </ThemeText>
                </WrapMaxWidth>
              </ContentBoxFull>
            </GradFrameEffHome2>
            <HeroSection themeDark={themeDark}>
              {
                themeDark ?
                  <HeroSectionAnimBox>
                    <Lottie config={{
                      loop: true,
                      autoplay: true,
                      animationData: anim1,
                      rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                      }
                    }} />
                  </HeroSectionAnimBox> : ''
              }
              <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={108} mobPaddingTopBottom={50} mobPaddingLeftRight={30}>
                <div>
                  {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
                </div>
                <div>
                  <ContentBox className="heroSectionWrap" themeDark={themeDark}>
                    <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                      <FontPoppins>
                        <GradientText>
                          {
                            themeDark ? t('TheWorldsFirst') : t('GetYour')
                          }
                        </GradientText>
                      </FontPoppins>
                    </ThemeText>

                    <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                      <FontPoppins>
                        <GradientText>
                          {
                            themeDark ? t('DeFiCreditRating') : t('CryptoCreditScore')
                          }
                        </GradientText>
                      </FontPoppins>
                    </ThemeText>
                    {
                      themeDark ?
                        <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}><GradientText>{t('System')}</GradientText></ThemeText>
                        : ''
                    }
                    <SpaceHeight height={24} heightApp={15} />
                    <div style={{ display: 'grid', gridTemplateColumns: '50% 50%', alignItems: 'center', gap: '5px' }}>
                      <div>
                        <ContentParagraph fontSize={22} themeDark={themeDark} style={{ marginBottom: '0' }}>
                          <FontPoppins>
                            {
                              themeDark ? t('MintYourCRating') : t('YesYouOne')
                            }
                          </FontPoppins>
                        </ContentParagraph>
                        {
                          !themeDark ? <ContentParagraph themeDark={themeDark} style={{ marginTop: '-4px', marginBottom: '0' }}>
                            <FontPoppins>
                              {t('FindOutWhen')}
                            </FontPoppins>
                          </ContentParagraph> : ''
                        }
                      </div>
                      <div>
                        <GradientButton
                          onClick={() => {
                            props.history.push("/profile")
                          }}
                        >
                          Launch App
                        </GradientButton>
                      </div>
                    </div>

                    {/* <SpaceHeight height={12} heightApp={15}/> */}

                  </ContentBox>
                </div>
              </CustomGrid>
            </HeroSection>
          </>
        }
        <SecondSection themeDark={themeDark}>
          {
            themeDark ?
              <SecondSectionAnimBox>
                <Lottie config={{
                  loop: true,
                  autoplay: true,
                  animationData: isMobile ? mobile_anim2 : anim2,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                  }
                }} />
              </SecondSectionAnimBox> : ''
          }
          <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={144} mobPaddingTopBottom={50} mobPaddingLeftRight={30}>
            <div>
              {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
            </div>
            <div>
              <ContentBox themeDark={themeDark}>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('CreditScoresCalculated') : t('TurnYourCryptoExperience')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('AcrossMultipleChains') : t('CreditWorthiness')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                {/*<ContentHeading fontSize={38} themeDark={themeDark} marginBottom={0}>
                {t('TurnYourCryptoExperience')}
              </ContentHeading>*/}
                <SpaceHeight height={24} heightApp={15} />
                <ContentParagraph themeDark={themeDark} marginBottom={0}>
                  {
                    themeDark ? t('BuiltOnEthereumLayer2') : t('CreDAConnects')
                  }
                </ContentParagraph>
                {/*<SpaceHeight height={12} heightApp={15}/>*/}
                {/*<GetStarted
                  onClick={()=>{
                    props.history.push("/profile")
                  }}
              >
                Let's get started
              </GetStarted>*/}
              </ContentBox>
            </div>
          </CustomGrid>
        </SecondSection>
        <ThirdSection themeDark={themeDark}>
          {
            themeDark ?
              <ThirdSectionAnimBox>
                <Lottie config={{
                  loop: true,
                  autoplay: true,
                  animationData: isMobile ? mobile_anim3 : anim3,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                  }
                }} />
              </ThirdSectionAnimBox> : ''
          }
          <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={144} mobPaddingTopBottom={50} mobPaddingLeftRight={30}>
            <div>
              {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
            </div>
            <div>
              <ContentBox themeDark={themeDark}>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('ConnectingOnChain') : t('ExpandYour')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('AndOffChainData') : t('FinancialIdentity')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                {/*<ContentHeading fontSize={38} themeDark={themeDark} marginBottom={0}>
                {t('TurnYourCryptoExperience')}
              </ContentHeading>*/}
                <SpaceHeight height={24} heightApp={15} />
                <ContentParagraph themeDark={themeDark} marginBottom={0}>
                  {
                    themeDark ? t('TheCreDAOracle') : t('CreDaIsWorking')
                  }
                </ContentParagraph>
                {/*<SpaceHeight height={12} heightApp={15}/>*/}
                {/*<GetStarted
                  onClick={()=>{
                    props.history.push("/profile")
                  }}
              >
                Let's get started
              </GetStarted>*/}
              </ContentBox>
            </div>
          </CustomGrid>
        </ThirdSection>
        <ForthSection themeDark={themeDark}>
          {
            themeDark ?
              <ForthSectionAnimBox>
                <Lottie config={{
                  loop: true,
                  autoplay: true,
                  animationData: isMobile ? mobile_anim4 : anim4,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                  }
                }} />
              </ForthSectionAnimBox> : ''
          }
          <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={144} mobPaddingTopBottom={50} mobPaddingLeftRight={30}>
            <div>
              {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
            </div>
            <div>
              <ContentBox themeDark={themeDark}>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('ALowCost') : t('FinallyCredit')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('ForBothLending') : t('WhereCreditDue')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                {
                  themeDark ?
                    <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                      <FontPoppins>
                        <GradientText>
                          {
                            t('andUsers')
                          }
                        </GradientText>
                      </FontPoppins>
                    </ThemeText> : ''
                }
                {/*<ContentHeading fontSize={38} themeDark={themeDark} marginBottom={0}>
                {t('TurnYourCryptoExperience')}
              </ContentHeading>*/}
                <SpaceHeight height={24} heightApp={15} />
                <ContentParagraph themeDark={themeDark} marginBottom={0}>
                  {
                    themeDark ? t('AfterMintingcNFT') : t('AccessToCredit')
                  }
                </ContentParagraph>
                {/*<SpaceHeight height={12} heightApp={15}/>*/}
                {/*<GetStarted
                  onClick={()=>{
                    props.history.push("/profile")
                  }}
              >
                Let's get started
              </GetStarted>*/}
              </ContentBox>
            </div>
          </CustomGrid>
        </ForthSection>
        <GradientWrap>
          {location !== '/home2'
            ?
            <GradFrameEff>
              <ContentBoxFull themeDark={themeDark} >
                <WrapMaxWidth>
                  <ThemeText className="subHeading" fontSize={38} fontWeight={'800'}><GradientText>{t('AThankYouToCrypt')} {
                    themeDark ? t('thatsYou') : ''
                  }</GradientText></ThemeText>

                  <RowCenter style={{ margin: '30px 0px 0px 0px' }}>
                    <iframe width="360" height="192" src="https://www.youtube.com/embed/VN31gl4lZCc?controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    {/*<VideoDemo style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:700, height:400, background:'linear-gradient(45deg, #320162, #4a21e9)'}}>
                    <PlayButton>
                      <svg width="127" height="127" viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="63.5" cy="63.5" r="63.5" fill="white" fillOpacity="0.36"/>
                        <path d="M43.4873 35.4472L92.8288 63.9345L43.4873 92.4218L43.4873 35.4472Z" fill="white"/>
                      </svg>
                    </PlayButton>
                  </VideoDemo>*/}
                  </RowCenter>

                </WrapMaxWidth>
              </ContentBoxFull>
            </GradFrameEff>
            : ''}
          <GradFrameEff style={{ paddingTop: '16px' }}>
            <ContentBoxFull themeDark={themeDark} >
              <WrapMaxWidth>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'}><GradientText>{t('HowToGetCryptoCredit')}</GradientText></ThemeText>
                <StepsSection>
                  <CustomGrid className="stepsGrid" alignItems={'self-start'} style={{ marginTop: '50px', marginBottom: '10px' }} templateColumns={'repeat(4, 1fr)'} columnGap={128}>
                    <StepInner>
                      <RowCenter>
                        <StepsIconImg src={ImageCommon.Step1IconImg} />
                        <StepsJoiningArrow src={ImageCommon.StepJoinIcon} />
                      </RowCenter>
                      <div>
                        <ThemeText className="stepIndication" fontSize={28} fontWeight={800}>{t('Step1')}</ThemeText>
                        <SpaceHeight heightApp={6} height={24} />
                        <div>
                          <ThemeText className="stepsContent" fontSize={21} fontWeight={800}>{themeDark ? t('ConnectYourWallets') : t('ConnectYourWallet')}</ThemeText>
                        </div>
                        <ThemeText className="stepsContent" fontSize={21}>{t('EssentialsToken')}</ThemeText>
                      </div>

                    </StepInner>
                    <StepInner>
                      <RowCenter>
                        <StepsIconImg src={ImageCommon.Step2IconImg} />
                        <StepsJoiningArrow src={ImageCommon.StepJoinIcon} />
                      </RowCenter>
                      <div>
                        <ThemeText className="stepIndication" fontSize={28} fontWeight={800}>{t('Step2')}</ThemeText>
                        <SpaceHeight heightApp={6} height={24} />
                        <div>
                          <ThemeText className="stepsContent" fontSize={21} fontWeight={800}>{t('ClaimCredaToken')}</ThemeText>
                        </div>
                        <ThemeText className="stepsContent" fontSize={21}>{t('InitiallyLockedIn')}</ThemeText>
                      </div>
                    </StepInner>
                    <StepInner>
                      <RowCenter>
                        <StepsIconImg src={ImageCommon.Step3IconImg} />
                        <StepsJoiningArrow src={ImageCommon.StepJoinIcon} />
                      </RowCenter>
                      <div>
                        <ThemeText className="stepIndication" fontSize={28} fontWeight={800}>{t('Step3')}</ThemeText>
                        <SpaceHeight heightApp={6} height={24} />
                        <div>
                          <ThemeText className="stepsContent" fontSize={21} fontWeight={800}>{themeDark ? t('MintcNFT') : t('MintCreditNFT')}</ThemeText>
                        </div>
                        <ThemeText className="stepsContent" fontSize={21}>{t('TheHigherLevel')}</ThemeText>
                      </div>
                    </StepInner>
                    <StepInner>
                      <RowCenter>
                        <StepsIconImg src={ImageCommon.Step4IconImg} />
                      </RowCenter>
                      <div>
                        <ThemeText className="stepIndication" fontSize={28} fontWeight={800}>{t('Step4')}</ThemeText>
                        <SpaceHeight heightApp={6} height={24} />
                        <div>
                          <ThemeText className="stepsContent" fontSize={21} fontWeight={800}>{t('EnjoyCreditPrivileges')}</ThemeText>
                        </div>
                        <ThemeText className="stepsContent" fontSize={21}>{t('OnCredaPartner')}</ThemeText>
                      </div>
                    </StepInner>
                  </CustomGrid>
                </StepsSection>
                <SpaceHeight height={30} heightApp={15} />
                <RowCenter>
                  <div>
                    <ThemeText fontSize={28} fontWeight={800}>{t('LetsGetStarted')}</ThemeText>
                  </div>
                </RowCenter>
                <SpaceHeight height={12} heightApp={15} />
                <RowCenter>
                  <GradientButton
                    onClick={() => {
                      props.history.push("/profile")
                    }}
                  >
                    Launch App
                  </GradientButton>
                </RowCenter>
              </WrapMaxWidth>
            </ContentBoxFull>
          </GradFrameEff>
          <GradFrameEff style={{ paddingTop: 0 }}>
            <ContentBoxFull themeDark={themeDark}>
              <WrapMaxWidth>
                <ThreeCardsSection>
                  <CustomGrid templateColumns={'1fr 1fr 1fr'} columnGap={24}>
                    <GradientBox>
                      <FontPoppins>
                        <Text className="textBadge" fontSize={21} style={{ display: 'block' }}>{t('Partnerships')}</Text>
                        <Text className="servHeading" fontSize={28} fontWeight={'800'} style={{ display: 'block', margin: '10px 0' }}>{t('DeriskingDeFi')}</Text>
                        <Text className="servContent" fontSize={21} style={{ display: 'block', margin: '10px 0' }}>{t('CreDAReducesExposure')}</Text>
                        <SpaceHeight height={28} heightApp={15} />
                        <RowCenter style={{ margin: '0' }}>
                          <a href="mailto:BD@creda.app">
                            <GradientButton>
                              Become a partner
                            </GradientButton>
                          </a>
                        </RowCenter>
                      </FontPoppins>
                    </GradientBox>
                    <GradientBox>
                      <FontPoppins>
                        <Text className="textBadge" fontSize={21} style={{ display: 'block' }}>{t('Technology')}</Text>
                        <Text className="servHeading" fontSize={28} fontWeight={'800'} style={{ display: 'block', margin: '10px 0' }}>{t('WhatBlockchainMeant')}</Text>
                        <Text className="servContent" fontSize={21} style={{ display: 'block', margin: '10px 0' }}>{t('BuiltEthereumLayer2')}</Text>
                      </FontPoppins>
                    </GradientBox>
                    <GradientBox>
                      <FontPoppins>
                        <Text className="textBadge" fontSize={21} style={{ display: 'block' }}>{t('PrivacySecurity')}</Text>
                        <Text className="servHeading" fontSize={28} fontWeight={'800'} style={{ display: 'block', margin: '10px 0' }}>{t('PersonalizedPersonal')}</Text>
                        <Text className="servContent" fontSize={21} style={{ display: 'block', margin: '10px 0' }}>{t('CreDAAggregates')}</Text>
                        <SpaceHeight height={28} heightApp={15} />
                        <Text className="servContent" fontSize={21} style={{ display: 'block', margin: '20px 0' }}><Text fontWeight={'800'}>{t('LastAuditBy')}</Text> {t('CertikDaysAgo')}</Text>
                      </FontPoppins>
                    </GradientBox>
                  </CustomGrid>
                </ThreeCardsSection>
              </WrapMaxWidth>
            </ContentBoxFull>
          </GradFrameEff>
        </GradientWrap>
      </FontPoppins>
      {/*<SpaceHeight height={50} heightApp={100}/>*/}
    </div>
  </MainFullBody>
}

const HomePage = ({ props }: any) => {
  const { t } = useTranslation()
  const location = window.location.pathname
  console.log("lo", location)
  const themeDark = useTheme()
  const { account } = useContext(WalletAddressContext);
  return <MainFullBody history={props.history}>
    <div style={{
      // backgroundColor:'#0D0D11',
      width: '100%',
      paddingTop: 0,
      zIndex: 50
    }}>
      <FontPoppins>
        {location !== '/home2' ?
          <HeroSection themeDark={themeDark}>
            {
              themeDark ?
                <HeroSectionAnimBox>
                  <Lottie config={{
                    loop: true,
                    autoplay: true,
                    animationData: anim1,
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid slice'
                    }
                  }} />
                </HeroSectionAnimBox> : ''
            }
            <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={108} mobPaddingTopBottom={80} mobPaddingLeftRight={30}>
              <div>
                {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
              </div>
              <div>
                <ContentBox className="heroSectionWrap" themeDark={themeDark}>
                  <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                    <FontPoppins>
                      <GradientText>
                        {
                          themeDark ? t('TheWorldsFirst') : t('GetYour')
                        }
                      </GradientText>
                    </FontPoppins>
                  </ThemeText>

                  <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                    <FontPoppins>
                      <GradientText>
                        {
                          themeDark ? t('DeFiCreditRating') : t('CryptoCreditScore')
                        }
                      </GradientText>
                    </FontPoppins>
                  </ThemeText>
                  {
                    themeDark ?
                      <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}><GradientText>{t('System')}</GradientText></ThemeText>
                      : ''
                  }
                  <SpaceHeight height={24} heightApp={15} />
                  <div style={{ display: 'grid', gridTemplateColumns: themeDark ? '65% 35%' : '38% 62%', alignItems: themeDark ? 'center' : 'end', gap: '10px' }}>
                    <div>
                      <ContentParagraph fontSize={22} themeDark={themeDark} style={{ marginBottom: themeDark ? '0' : '15px' }}>
                        <FontPoppins>
                          {
                            themeDark ? t('MintYourCRating') : t('YesYouOne')
                          }
                        </FontPoppins>
                      </ContentParagraph>
                      {
                        !themeDark ? (
                          <ContentParagraph themeDark={themeDark} style={{ marginTop: '-4px', marginBottom: '0' }}>
                            <FontPoppins>
                              {t('FindOutWhen')}
                            </FontPoppins>
                          </ContentParagraph>
                        ) : ''
                      }
                    </div>
                    <div>
                      <GradientButton
                        onClick={() => {
                          props.history.push("/profile")
                        }}
                      >
                        Launch App
                      </GradientButton>
                    </div>
                  </div>
                </ContentBox>
              </div>
            </CustomGrid>
          </HeroSection>
          :
          <>
            <GradFrameEffHome2>
              <ContentBoxFull themeDark={themeDark} >
                <WrapMaxWidth>
                  {/* <ThemeText className="subHeading" fontSize={38} fontWeight={'800'}>
                  <GradientText>{t('AThankYouToCrypt')}{
                  themeDark ? t('thatsYou') : ''
                }</GradientText>
                </ThemeText> */}

                  <RowCenterWrapper
                  >

                    {/* <iframe width="700" height="393" src="https://www.youtube.com/embed/VN31gl4lZCc?controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
                    <IframeWrapper>
                      <iframe src="https://www.youtube.com/embed/VN31gl4lZCc?controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </IframeWrapper>
                    <IframeWrapper style={{ marginLeft: '60px' }}>
                      <ThemeText fontSize={45} fontWeight={'900'} style={{ lineHeight: '1.7' }} fontFamily={'Poppins Regular'}>
                        <GradientText>{t('ConnectWallet')}</GradientText><br />
                        <GradientText>{t('MintYourCreditScore')}</GradientText><br />
                        <GradientText>{t('OpenDoors')}</GradientText>
                      </ThemeText>
                    </IframeWrapper>
                    {/*<VideoDemo style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:700, height:400, background:'linear-gradient(45deg, #320162, #4a21e9)'}}>
                    <PlayButton>
                      <svg width="127" height="127" viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="63.5" cy="63.5" r="63.5" fill="white" fillOpacity="0.36"/>
                        <path d="M43.4873 35.4472L92.8288 63.9345L43.4873 92.4218L43.4873 35.4472Z" fill="white"/>
                      </svg>
                    </PlayButton>
                  </VideoDemo>*/}
                  </RowCenterWrapper>

                </WrapMaxWidth>
              </ContentBoxFull>
            </GradFrameEffHome2>
            <HeroSection themeDark={themeDark}>
              {
                themeDark ?
                  <HeroSectionAnimBox>
                    <Lottie config={{
                      loop: true,
                      autoplay: true,
                      animationData: anim1,
                      rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                      }
                    }} />
                  </HeroSectionAnimBox> : ''
              }
              <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={108} mobPaddingTopBottom={80} mobPaddingLeftRight={30}>
                <div>
                  {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
                </div>
                <div>
                  <ContentBox className="heroSectionWrap" themeDark={themeDark}>
                    <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.5 }}>
                      <FontPoppins>
                        <GradientText>
                          {
                            themeDark ? t('TheWorldsFirst') : t('GetYour')
                          }
                        </GradientText>
                      </FontPoppins>
                    </ThemeText>

                    <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                      <FontPoppins>
                        <GradientText>
                          {
                            themeDark ? t('DeFiCreditRating') : t('CryptoCreditScore')
                          }
                        </GradientText>
                      </FontPoppins>
                    </ThemeText>
                    {
                      themeDark ?
                        <ThemeText className="heroHeading" fontSize={55} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}><GradientText>{t('System')}</GradientText></ThemeText>
                        : ''
                    }
                    <SpaceHeight height={24} heightApp={15} />
                    <div style={{ display: 'grid', gridTemplateColumns: themeDark ? '65% 35%' : '38% 62%', alignItems: themeDark ? 'center' : 'end', gap: '10px' }}>
                      <div>
                        <ContentParagraph fontSize={22} themeDark={themeDark} style={{ marginBottom: themeDark ? '0' : '15px' }}>
                          <FontPoppins>
                            {
                              themeDark ? t('MintYourCRating') : t('YesYouOne')
                            }
                          </FontPoppins>
                        </ContentParagraph>
                        {
                          !themeDark ? (
                            <ContentParagraph themeDark={themeDark} style={{ marginTop: '-4px', marginBottom: '0' }}>
                              <FontPoppins>
                                {t('FindOutWhen')}
                              </FontPoppins>
                            </ContentParagraph>
                          ) : ''
                        }
                      </div>
                      <div>
                        <GradientButton
                          onClick={() => {
                            props.history.push("/profile")
                          }}
                        >
                          Launch App
                        </GradientButton>
                      </div>
                    </div>
                  </ContentBox>
                </div>
              </CustomGrid>
            </HeroSection>
          </>
        }
        <SecondSection themeDark={themeDark}>
          {
            themeDark ?
              <SecondSectionAnimBox>
                <Lottie config={{
                  loop: true,
                  autoplay: true,
                  animationData: anim2,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                  }
                }} />
              </SecondSectionAnimBox> : ''
          }
          <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={99} mobPaddingTopBottom={80} mobPaddingLeftRight={30}>
            <div>
              {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
            </div>
            <div>
              <ContentBox themeDark={themeDark}>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('CreditScoresCalculated') : t('TurnYourCryptoExperience')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('AcrossMultipleChains') : t('CreditWorthiness')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                {/*<ContentHeading fontSize={38} themeDark={themeDark} marginBottom={0}>
                {t('TurnYourCryptoExperience')}
              </ContentHeading>*/}
                <SpaceHeight height={24} heightApp={15} />
                <ContentParagraph themeDark={themeDark} marginBottom={0}>
                  {
                    themeDark ? t('BuiltOnEthereumLayer2') : t('CreDAConnects')
                  }
                </ContentParagraph>
                {/*<SpaceHeight height={12} heightApp={15}/>*/}
                {/*<GetStarted
                  onClick={()=>{
                    props.history.push("/profile")
                  }}
              >
                Let's get started
              </GetStarted>*/}
              </ContentBox>
            </div>
          </CustomGrid>
        </SecondSection>
        <ThirdSection themeDark={themeDark}>
          {
            themeDark ?
              <ThirdSectionAnimBox>
                <Lottie config={{
                  loop: true,
                  autoplay: true,
                  animationData: anim3,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                  }
                }} />
              </ThirdSectionAnimBox> : ''
          }
          <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={99} mobPaddingTopBottom={80} mobPaddingLeftRight={30}>
            <div>
              {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
            </div>
            <div>
              <ContentBox themeDark={themeDark}>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('ConnectingOnChain') : t('ExpandYour')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('AndOffChainData') : t('FinancialIdentity')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                {/*<ContentHeading fontSize={38} themeDark={themeDark} marginBottom={0}>
                {t('TurnYourCryptoExperience')}
              </ContentHeading>*/}
                <SpaceHeight height={24} heightApp={15} />
                <ContentParagraph themeDark={themeDark} marginBottom={0}>
                  {
                    themeDark ? t('TheCreDAOracle') : t('CreDaIsWorking')
                  }
                </ContentParagraph>
                {/*<SpaceHeight height={12} heightApp={15}/>*/}
                {/*<GetStarted
                  onClick={()=>{
                    props.history.push("/profile")
                  }}
              >
                Let's get started
              </GetStarted>*/}
              </ContentBox>
            </div>
          </CustomGrid>
        </ThirdSection>
        <ForthSection themeDark={themeDark}>
          {
            themeDark ?
              <ForthSectionAnimBox>
                <Lottie config={{
                  loop: true,
                  autoplay: true,
                  animationData: anim4,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                  }
                }} />
              </ForthSectionAnimBox> : ''
          }
          <CustomGrid templateColumns={'50% 50%'} paddingTopBottom={99} mobPaddingTopBottom={80} mobPaddingLeftRight={30}>
            <div>
              {/*<img style={{filter: "invert(1)"}} src="https://via.placeholder.com/300"/>*/}
            </div>
            <div>
              <ContentBox themeDark={themeDark}>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('ALowCost') : t('FinallyCredit')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                  <FontPoppins>
                    <GradientText>
                      {
                        themeDark ? t('ForBothLending') : t('WhereCreditDue')
                      }
                    </GradientText>
                  </FontPoppins>
                </ThemeText>
                {
                  themeDark ?
                    <ThemeText className="subHeading" fontSize={38} fontWeight={'800'} style={{ width: '100%', display: 'block', lineHeight: 1.2 }}>
                      <FontPoppins>
                        <GradientText>
                          {
                            t('andUsers')
                          }
                        </GradientText>
                      </FontPoppins>
                    </ThemeText> : ''
                }
                {/*<ContentHeading fontSize={38} themeDark={themeDark} marginBottom={0}>
                {t('TurnYourCryptoExperience')}
              </ContentHeading>*/}
                <SpaceHeight height={24} heightApp={15} />
                <ContentParagraph themeDark={themeDark} marginBottom={0}>
                  {
                    themeDark ? t('AfterMintingcNFT') : t('AccessToCredit')
                  }
                </ContentParagraph>
                {/*<SpaceHeight height={12} heightApp={15}/>*/}
                {/*<GetStarted
                  onClick={()=>{
                    props.history.push("/profile")
                  }}
              >
                Let's get started
              </GetStarted>*/}
              </ContentBox>
            </div>
          </CustomGrid>
        </ForthSection>
        <GradientWrap>
          {location !== '/home2' ?
            <GradFrameEff>
              <ContentBoxFull themeDark={themeDark} >
                <WrapMaxWidth>
                  <ThemeText className="subHeading" fontSize={38} fontWeight={'800'}><GradientText>{t('AThankYouToCrypt')}{
                    themeDark ? t('thatsYou') : ''
                  }</GradientText></ThemeText>

                  <RowCenter style={{ margin: '88px 0' }}>

                    {/* <iframe width="700" height="393" src="https://www.youtube.com/embed/VN31gl4lZCc?controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}

                    <iframe width="700" height="394" src="https://www.youtube.com/embed/VN31gl4lZCc?controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    {/*<VideoDemo style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:700, height:400, background:'linear-gradient(45deg, #320162, #4a21e9)'}}>
                    <PlayButton>
                      <svg width="127" height="127" viewBox="0 0 127 127" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="63.5" cy="63.5" r="63.5" fill="white" fillOpacity="0.36"/>
                        <path d="M43.4873 35.4472L92.8288 63.9345L43.4873 92.4218L43.4873 35.4472Z" fill="white"/>
                      </svg>
                    </PlayButton>
                  </VideoDemo>*/}
                  </RowCenter>

                </WrapMaxWidth>
              </ContentBoxFull>
            </GradFrameEff> : ''}
          <GradFrameEff
          // style={{ paddingTop: 0}}
          >
            <ContentBoxFull themeDark={themeDark} >
              <WrapMaxWidth>
                <ThemeText className="subHeading" fontSize={38} fontWeight={'800'}><GradientText>{t('HowToGetCryptoCredit')}</GradientText></ThemeText>
                <StepsSection>
                  <CustomGrid className="stepsGrid" alignItems={'self-start'} style={{ margin: '88px 0' }} templateColumns={'repeat(4, 1fr)'} columnGap={128}>
                    <div>
                      <RowCenter height={200}>
                        <StepsIconImg src={ImageCommon.Step1IconImg} />
                        <StepsJoiningArrow src={ImageCommon.StepJoinIcon} />
                      </RowCenter>
                      <ThemeText className="stepIndication" fontSize={28} fontWeight={800}>{t('Step1')}</ThemeText>
                      <SpaceHeight heightApp={15} height={24} />
                      <div>
                        <ThemeText className="stepsContent" fontSize={21} fontWeight={800}>{themeDark ? t('ConnectYourWallets') : t('ConnectYourWallet')}</ThemeText>
                      </div>
                      <ThemeText className="stepsContent" fontSize={21}>{t('EssentialsToken')}</ThemeText>
                    </div>
                    <div>
                      <RowCenter height={200}>
                        <StepsIconImg src={ImageCommon.Step2IconImg} />
                        <StepsJoiningArrow src={ImageCommon.StepJoinIcon} />
                      </RowCenter>
                      <ThemeText className="stepIndication" fontSize={28} fontWeight={800}>{t('Step2')}</ThemeText>
                      <SpaceHeight heightApp={15} height={24} />
                      <div>
                        <ThemeText className="stepsContent" fontSize={21} fontWeight={800}>{t('ClaimCredaToken')}</ThemeText>
                      </div>
                      <ThemeText className="stepsContent" fontSize={21}>{t('InitiallyLockedIn')}</ThemeText>
                    </div>
                    <div>
                      <RowCenter height={200}>
                        <StepsIconImg src={ImageCommon.Step3IconImg} />
                        <StepsJoiningArrow src={ImageCommon.StepJoinIcon} />
                      </RowCenter>
                      <ThemeText className="stepIndication" fontSize={28} fontWeight={800}>{t('Step3')}</ThemeText>
                      <SpaceHeight heightApp={15} height={24} />
                      <div>
                        <ThemeText className="stepsContent" fontSize={21} fontWeight={800}>{themeDark ? t('MintcNFT') : t('MintCreditNFT')}</ThemeText>
                      </div>
                      <ThemeText className="stepsContent" fontSize={21}>{t('TheHigherLevel')}</ThemeText>
                    </div>
                    <div>
                      <RowCenter height={200}>
                        <StepsIconImg src={ImageCommon.Step4IconImg} />
                      </RowCenter>
                      <ThemeText className="stepIndication" fontSize={28} fontWeight={800}>{t('Step4')}</ThemeText>
                      <SpaceHeight heightApp={15} height={24} />
                      <div>
                        <ThemeText className="stepsContent" fontSize={21} fontWeight={800}>{t('EnjoyCreditPrivileges')}</ThemeText>
                      </div>
                      <ThemeText className="stepsContent" fontSize={21}>{t('OnCredaPartner')}</ThemeText>
                    </div>
                  </CustomGrid>
                </StepsSection>
                <RowCenter>
                  <div>
                    <ThemeText fontSize={28} fontWeight={800}>{t('LetsGetStarted')}</ThemeText>
                  </div>
                </RowCenter>
                <SpaceHeight height={12} heightApp={15} />
                <RowCenter>
                  <GradientButton
                    onClick={() => {
                      props.history.push("/profile")
                    }}
                  >
                    Launch App
                  </GradientButton>
                </RowCenter>
              </WrapMaxWidth>
            </ContentBoxFull>
          </GradFrameEff>
          <GradFrameEff style={{ paddingTop: 0 }}>
            <ContentBoxFull themeDark={themeDark}>
              <WrapMaxWidth>
                <ThreeCardsSection>
                  <CustomGrid templateColumns={'1fr 1fr 1fr'} columnGap={24}>
                    <GradientBox>
                      <FontPoppins>
                        <Text className="textBadge" fontSize={21} style={{ display: 'block' }}>{t('Partnerships')}</Text>
                        <Text className="servHeading" fontSize={28} fontWeight={'800'} style={{ display: 'block', margin: '10px 0' }}>{t('DeriskingDeFi')}</Text>
                        <Text className="servContent" fontSize={21} style={{ display: 'block', margin: '10px 0' }}>{t('CreDAReducesExposure')}</Text>
                        <SpaceHeight height={28} heightApp={15} />
                        <RowCenter style={{ margin: '0' }}>
                          <a href="mailto:BD@creda.app">
                            <GradientButton>
                              Become a partner
                            </GradientButton>
                          </a>
                        </RowCenter>
                      </FontPoppins>
                    </GradientBox>
                    <GradientBox>
                      <FontPoppins>
                        <Text className="textBadge" fontSize={21} style={{ display: 'block' }}>{t('Technology')}</Text>
                        <Text className="servHeading" fontSize={28} fontWeight={'800'} style={{ display: 'block', margin: '10px 0' }}>{t('WhatBlockchainMeant')}</Text>
                        <Text className="servContent" fontSize={21} style={{ display: 'block', margin: '10px 0' }}>{t('BuiltEthereumLayer2')}</Text>
                      </FontPoppins>
                    </GradientBox>
                    <GradientBox>
                      <FontPoppins>
                        <Text className="textBadge" fontSize={21} style={{ display: 'block' }}>{t('PrivacySecurity')}</Text>
                        <Text className="servHeading" fontSize={28} fontWeight={'800'} style={{ display: 'block', margin: '10px 0' }}>{t('PersonalizedPersonal')}</Text>
                        <Text className="servContent" fontSize={21} style={{ display: 'block', margin: '10px 0' }}>{t('CreDAAggregates')}</Text>
                        <SpaceHeight height={28} heightApp={15} />
                        <Text className="servContent" fontSize={21} style={{ display: 'block', margin: '20px 0' }}><Text fontWeight={'800'}>{t('LastAuditBy')}</Text> {t('CertikDaysAgo')}</Text>
                      </FontPoppins>
                    </GradientBox>
                  </CustomGrid>
                </ThreeCardsSection>
              </WrapMaxWidth>
            </ContentBoxFull>
          </GradFrameEff>
        </GradientWrap>
      </FontPoppins>
      {/*<SpaceHeight height={50} heightApp={100}/>*/}
    </div>
  </MainFullBody>
}

export default Home;
