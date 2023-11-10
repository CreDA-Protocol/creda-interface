import { Button as RebassButton } from "rebass";
import { Box } from 'rebass/styled-components';
import styled from 'styled-components';
export const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean,
  disabled?:boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '18px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 500;
  text-align: center;
  border-radius: 10px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`
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
  pointer-events:${props=>props.disabled?"none":"auto"};
  opacity:${props=>props.disabled?0.5:1};
`
export const Row = styled(Box)<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  position: relative;
  width: 100%;
  display: flex;
  padding: 0;
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`

export const RowBetween = styled(Row)`
  justify-content: space-between;
`
export const RowCenter = styled(Row)`
  justify-content: center;
`
export const RowEnd = styled(Row)`
  justify-content: flex-end;
`
export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`

export const FontPoppins = styled.span`
  font-family: 'Poppins Regular';
  > * {
    font-family: 'Poppins Regular' !important;
  }
`

export const WrapMaxWidth = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  @media (min-width: 1610px) {
    max-width: 1589px;
  }
`

export const TheGradientOne = styled.div<{
  themeDark?:boolean|null
}>`
  background: ${({themeDark}) => `${themeDark?'linear-gradient(70.34deg, #000000 63.47%, #4F029B 81.69%, #4926F6 100%)':'linear-gradient(70.34deg,#f1f4f6 63.47%,#4f029b26 81.69%,#4926F6 100%)'}`};
`

export const TheGradientTwo = styled.div<{
  themeDark?:boolean|null
}>`
  background: ${({themeDark}) => `${themeDark?'linear-gradient(269.81deg, #000000 24.14%, #4B0191 51.46%, #4926F6 99.83%)':'linear-gradient(240.34deg,#f1f4f6 63.47%,#4f029b42 81.69%,#4926f6 100%)'}`};
`

export const CustomGrid = styled.div<{
  paddingTopBottom?:number,
  mobPaddingTopBottom?:number,
  paddingLeftRight?:number,
  mobPaddingLeftRight?:number,
  templateColumns?:string,
  columnGap?:number,
  rowGap?:number,
  mobTemplateColumns?:string,
  mobColumnGap?:number,
  mobRowGap?:number,
  alignItems?:string
}>`
  font-family: 'DMSans';
  display: grid;
  grid-template-columns: ${({templateColumns})=>`${templateColumns??'1fr'}`};
  column-gap: ${({columnGap})=>`${columnGap??0}px`};
  row-gap: ${({rowGap})=>`${rowGap??0}px`};
  max-width: 1140px;
  margin: 0 auto;
  padding: ${({paddingTopBottom, paddingLeftRight})=> `${paddingTopBottom??0}px ${paddingLeftRight??0}px` };
  align-items: ${({alignItems})=>`${alignItems??'center'}`};
  @media (max-width: 767px) {
    grid-template-columns: ${({mobTemplateColumns})=>`${mobTemplateColumns??'1fr'}`};
    column-gap: ${({mobColumnGap})=>`${mobColumnGap??0}px`};
    row-gap: ${({mobRowGap})=>`${mobRowGap??0}px`};
    padding: ${({mobPaddingTopBottom, mobPaddingLeftRight})=> `${mobPaddingTopBottom??0}px ${mobPaddingLeftRight??0}px` };
  }
  @media (min-width: 1610px) {
    max-width: 1589px;
  }
  @media (max-width: 1190px) {
    max-width: 100%;
    padding-left: 16px;
    padding-right: 16px;
  }
`
export const ContentHeading = styled.h2<{
  themeDark?:boolean|null,
  fontSize?:number,
  mobFontSize?:number,
  marginBottom?:number,
}>`
  font-size: ${({fontSize})=>`${fontSize??'24'}px`};
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: ${({marginBottom})=>`${marginBottom??24}px`};;
  color: ${({themeDark})=>`${themeDark?'#0ECFF2':'#000000'}`};
  @media (max-width: 767px) {
    margin-top: 24px;
    font-size: ${({mobFontSize})=>`${mobFontSize??'24'}px`};
  }
`

export const ContentParagraph = styled.p<{
  themeDark?:boolean|null,
  fontSize?:number,
  mobFontSize?:number,
  marginBottom?:number,
}>`
  font-size: ${({fontSize})=>`${fontSize??'20'}px`};
  line-height: 1.5;
  margin-top: 0;
  margin-bottom: ${({marginBottom})=>`${marginBottom??17}px`};
  color: ${({themeDark})=>`${themeDark?'#FFF':'#000000'}`};
  @media (min-width: 768px) and (max-width: 1700px) {
    font-size: 17px;
  }
  @media (max-width: 767px) {
    font-size: 12px;
  }
`

export const LinearView = styled.div<{
  from:string
  to:string
  paddingH?:number
  paddingV?:number
  borderRadius?:number
}>`
  width: 100%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: ${({ borderRadius }) => `${borderRadius ?? 0}px`};
  padding-left:${({ paddingH }) => `${paddingH ?? 10}px`};
  padding-right:${({ paddingH }) => `${paddingH ?? 10}px`};
  padding-top:${({ paddingV }) => `${paddingV ?? 10}px`};
  padding-bottom:${({ paddingV }) => `${paddingV ?? 10}px`};
  margin-bottom:22px;
  background-image: linear-gradient(to right, ${({ from }) => from}, ${({ to }) => to});
  overflow: hidden;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    padding-left:${({ paddingH }) => `${paddingH ? paddingH / 2 : 10}px`};
    padding-right:${({ paddingH }) => `${paddingH ? paddingH / 2 : 10}px`};
    padding-top:${({ paddingV }) => `${paddingV ? paddingV / 2 : 10}px`};
    padding-bottom:${({ paddingV }) => `${paddingV ? paddingV / 2 : 10}px`};
  };
`


export const LinearText = styled.div<{
  from:string;
  to:string;
  fontSize?:number
}>`
  font-size:${({ fontSize }) => `${fontSize}px` ?? '10px'};;
  font-weight: bold;
  background-image: linear-gradient(to top right, ${({ from }) => from}, ${({ to }) => to});
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  @media (max-width: 768px) {
    font-size:${({ fontSize }) => `${fontSize ? fontSize / 2 : 10}px`};
  };
`
export const ButtonImage = styled.img<{
  margin?:string;
  padding?:string;
  width?:number;
  height?:number
}>`
  cursor:pointer;
  margin:${({ margin }) => margin ?? ''};
  padding:${({ padding }) => padding ?? ''};
  display:flex;
  width:${({ width }) => `${width ?? 10}px`};
  height:${({ height }) => `${height ?? 10}px`};
`
export const Button = styled.div<{
  borderRadius?:number;
  backgroundColor?:string;
  color?:string;
  fontSize?:number;
  fontWeight?:string;
  margin?:string;
  padding?:string,
  disabled?:boolean,
  loading?:boolean,
}>`
  border-radius:${({ borderRadius }) => `${borderRadius ?? 5}px`};
  background-color:${({ backgroundColor }) => backgroundColor ?? 'white'};
  color:${({ color }) => color ?? 'white'};
  font-size:${({ fontSize }) => `${fontSize ?? 10}px`};
  font-weight:${({ fontWeight }) => fontWeight ?? 'Medium'};
  cursor:pointer;
  justify-content:center;
  align-items: center;
  margin:${({ margin }) => margin ?? ''};
  padding:${({ padding }) => padding ?? ''};
  display:flex;
  pointer-events:${props=>props.disabled?'none':'auto'};
  opacity:${props=>props.disabled?0.8:1};
  @media (max-width: 768px) {
    font-size:${({ fontSize }) => `${fontSize ? fontSize / 2 : 10}px`};
  };
`
export const SpaceHeight = styled.div<{
  height:number;
  heightApp:number
}>`
  margin-top:${({ height }) => `${height}px`};
  @media (max-width: 768px) {
    margin-top:${({ heightApp }) =>  `${heightApp}px`};
  };
`
export const SpaceWidth = styled.div<{
  width:number;
  widthApp:number
}>`
  margin-left:${({ width }) => `${width}px`};
  @media (max-width: 768px) {
    margin-left:${({ widthApp }) => `${widthApp}px`};
  };
`

export const Image = styled.img<{
  size?:number;
}>`
  width:${({ size }) => `${size ?? 10}px`};
  height:${({ size }) => `${size ?? 10}px`};
  @media (max-width: 768px) {
    width:${({ size }) => `${size ? size / 2 : 10}px`};
    height:${({ size }) => `${size ?size / 2 : 10}px`};
  };
`

export const ImageCustom = styled.img<{
  width?:number;
  height?:number;
}>`
  width:${({ width }) => `${width ?? 10}px`};
  height:${({ height }) => `${height ?? 10}px`};
  @media (max-width: 768px) {
    width:${({ width }) => `${width ? width / 2 : 10}px`};
    height:${({ height }) => `${height ? height / 2 : 10}px`};
  };
`

export const Text = styled.span<{
  fontSize?:number;
  fontColor?:string;
  fontWeight?:string;
  fontFamily?:string;
}>`
  font-size:${({ fontSize }) => `${fontSize}px` ?? '10px'};
  color:${({ fontColor }) => fontColor ?? '#FBFCFC'};
  font-weight:${({ fontWeight }) => fontWeight ?? 'normal'};
  font-family:${({ fontFamily }) => fontFamily ?? 'DMSans'};
  @media (max-width: 768px) {
    font-size:${({ fontSize }) => `${fontSize ? fontSize / 2 : 10}px`};
    color:${({ fontColor }) => fontColor ?? '#E5E8EB'};
  };
`
export const TextEqure = styled.span<{
  fontSize?:number;
  fontColor?:string;
  fontWeight?:string;
  fontFamily?:string;
}>`
  font-size:${({ fontSize }) => `${fontSize}px` ?? '10px'};
  color:${({ fontColor }) => fontColor ?? '#FBFCFC'};
  font-weight:${({ fontWeight }) => fontWeight ?? 'normal'};
  font-family:${({ fontFamily }) => fontFamily ?? 'DMSans'};
`
export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
`


export const GradientButton = styled(ButtonClick)`
  color: #FBFCFC;
  background: linear-gradient(90deg, #4a1ee1, #1890ff);
  font-weight: 600;
  font-size: 19px;
  // height: 38px;
  border-radius: 10px;
  padding: 0px 38px;
  border: none;
  &:hover {
    background: linear-gradient(90deg, #33B8FF, #33D4FF);
  }
  &:focus {
    background: linear-gradient(90deg, #3A0080, #4A29FF);
    color: #00FFFF;
  }
  @media (max-width: 767px) {
    padding: 0 16px;
    // height: 28px;
    font-size: 12px;
  }
`

export const GradientGaryButton = styled(ButtonClick)`
  color: #fff;
  background-color:#999999;
  font-weight: 600;
  font-size: 19px;
  // height: 38px;
  border-radius: 10px;
  padding: 0px 38px;
  border: none;
  &:hover {
  }
  &:focus {
  }
  @media (max-width: 767px) {
    padding: 0 16px;
    // height: 28px;
    font-size: 12px;
  }
`
// @media (min-width: 768px) and (max-width: 1700px) {
//   padding: 0 20px;
//   height: 32px;
//   font-size: 16px;
// }
// @media (min-width: 768px) and (max-width: 1024px) {
//   padding: 0 10px;
//   font-size: 13px;
// }
// @media (min-width: 1800px) {
//   height: 48px;
//   min-width: 146px;
//   &.network_title > div {
//     font-size: 20px
//   }
//   &.header_cnt_wal_btn {
//     height: 38px;
//   }
// }
