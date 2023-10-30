import ImageCommon from "@assets/common/ImageCommon";
import { Column } from "@components/Column";
import { RowBetween, RowCenter, RowFixed, TextEqure } from "@components/Row";
import styled from "styled-components";

export const Parenter_icon_3 = styled.img`
  width: 130px;
  height: auto;
  @media (max-width: 768px) {
    width: 40px;
  }
`;

export const Body = styled(Column)`
  width: 100%;
  height: 100%;
  padding: 0px 15px;
`;

export const CopyIcon = styled.img`
  width: 14px;
  height: 13px;
  @media (max-width: 768px) {
    margin-left: 10px;
    margin-top: 5px;
  }
  margin-left: 20px;
  margin-top: 10px;
`;

export const AddressText = styled(TextEqure)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ;
  -webkit-box-orient: vertical;
  margin-top: 10px;
  width: fit-content;
  @media (max-width: 768px) {
    margin-top: 5px;
    width: 100px;
  };
`;

export const ColorDiv = styled(Column)`
  width: 314px;
  height: 177px;
  border-radius: 24px;
  background-color: #4e55ff;
  padding: 30px;
  padding-bottom: 0px;
  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
    border-radius: 12px;
    margin-bottom: 15px;
    border: 1px solid #363739;
    padding: 20px;
    height: 160px;
  }
  position: relative;
`;

export const ColorDivNoBorder = styled(ColorDiv)`
  @media (max-width: 768px) {
    border: 0px solid #363739;
  }
`;

export const NFTBgImage = styled.img`
  position: absolute;
  width: 314px;
  height: 177px;
  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
    // height:160px;
  }
  top: 0px;
  left: 0px;
`;

export const GreenDiv = styled(RowCenter)`
  height: 24px;
  border-radius: 12px;
  background-color: #58bc7c;
  align-items: center;
  width: fit-content;
  margin-left: 10px;
  padding: 10px;
  @media (max-width: 768px) {
    margin-left: 5px;
    padding: 5px;
  }
`;

export const TopItemDiv = styled(RowBetween)`
  @media (max-width: 768px) {
    flex-direction: column;
  };
`;

export const SegmentDiv = styled(RowFixed)`
  background-color: #17181a;
  height: 40px;
  border-radius: 20px;
  width: 414px;
  margin: 40px 0px;
  overflow: hidden;
  @media (max-width: 768px) {
    flex: 1;
    // width:100%;
    margin: 15px 15px;
  };
`;

export const SegmentItem = styled(RowCenter) <{
  isChoose?: boolean;
}>`
  width: 338px;
  background: ${({ isChoose }) =>
    isChoose ? "linear-gradient(90deg, #4a1ee1, #1890ff)" : "transparent"};
  height: 100%;
  color: ${({ isChoose }) => (isChoose ? "white" : "#777E90")};
  align-items: center;
  border-radius: 20px;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 17px;
    flex: 1;
  };
`;

export const WrapDiv = styled(RowBetween)`
  flex-wrap: wrap;
  @media (max-width: 768px) {
    flex: 1;
    // width:100%;
    margin: 0px 15px;
  }
  justify-content: flex-start;
`;

export const WrapItem = styled(RowCenter) <{
  selected?: boolean;
  disabled?: boolean;
  themeDark?: boolean | null;
}>`
  background: ${({ themeDark }) => (themeDark ? "#17181a" : "#FFF")};
  font-size: 16px;
  font-weight: bold;
  align-items: center;
  width: 142px;
  cursor: pointer;
  color: ${({ themeDark }) => (themeDark ? "#FFF" : "#17181a")};
  height: 40px;
  border-radius: 20px;
  margin-right: 20px;
  margin-bottom: 18px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
    // pointer-events:${({ disabled }) => (disabled ? "none" : "auto")};
  &.active {
    background: linear-gradient(90deg, #4a1ee1, #1890ff);
    color: #fff;
  }

  &:hover {
    background: linear-gradient(90deg, #33b8ff, #33d4ff);
    color: #fff;
  }

  &:focus {
    background: linear-gradient(90deg, #3a0080, #4a29ff);
    color: #00ffff;
  }

  @media (max-width: 768px) {
    width: fit-content;
    padding: 5px 10px;
    background: ${({ themeDark }) => (themeDark ? "#17181a" : "#FFF")};

    border-bottom: ${({ selected: isChoose }) =>
    isChoose ? "1px solid #4E55FF" : "none"};
    border-radius: 10px;
    margin-right: 10px;
    font-size: 14px;
    color: ${({ selected: isChoose }) => (isChoose ? "#4E55FF" : "#777E90")};
  };
`;

export const StepTwoModalWrap = styled.div<{
  isMobile: boolean | null;
}>`
  .walk-through-modal-wrapper {
    top: ${({ isMobile }) => (isMobile ? "337px" : "124px")};
    left: ${({ isMobile }) => (isMobile ? "48%" : "50%")};
    @media (min-width: 768px) and (max-width: 1700px) {
      top: 336px;
      left: 25%;
    }
    @media (min-width: 1700px) {
      top: 337px;
      left: 25%;
    }
  }
`;

export const StepThreeModalWrap = styled.div<{
  isMobile: boolean | null;
}>`
  .walk-through-modal-wrapper {
    top: ${({ isMobile }) => (isMobile ? "124px" : "124px")};
    left: -57%;
    @media (min-width: 768px) and (max-width: 1700px) {
      top: 127px;
      left: 50%;
    }
    @media (min-width: 1700px) {
      top: 145px;
      left: 50%;
    }
  }
`;

export const StepFourthModalWrap = styled.div<{
  isMobile: boolean | null;
}>`
  .walk-through-modal-wrapper {
    top: ${({ isMobile }) => (isMobile ? "171px" : "124px")};
    left: 124px;
    @media (min-width: 768px) and (max-width: 1700px) {
      top: 172px;
      left: 21%;
    }
    @media (min-width: 1700px) {
      top: 175px;
      left: 23%;
    }
  }
`;

export const BGDiv = styled(Column)`
  background-color: #17181a;
  border-radius: 24px;
  padding: 23px 28px;
  margin: 20px 0px;
  width: 100%;
  @media (max-width: 768px) {
    border: 1px solid #363739;
    padding: 10px;
    margin: 10px 0px;
    border-radius: 12px;
  }
`;

export const IconIcon = styled.img`
  width: 45px;
  height: auto;
  margin-right: 15px;
  // background-color:#353945;
`;

export const IconIconBlue = styled.div`
  width: 46px;
  height: 46px;
  margin-right: 15px;
  border-radius: 23px;
  background-color: #4e55ff;
`;

export const SmallIconIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  // background-color:#353945;
  border-radius: 15px;
`;

export const LineV = styled.div<{
  width?: number;
}>`
  height: 50px;
  background-color: #2e313a;
  width: 1px;
  margin: ${({ width }) => (width ? `0px  ${width}px` : " 0px  30px")};
`;

export const LineH = styled.div<{
  height?: number;
}>`
  height: 1px;
  background-color: #2e313a;
  width: 100%;
  margin: ${({ height }) => (height ? `${height}px 0px` : "30px 0px")};
`;

export const LineHNor = styled.div`
  height: 1px;
  background-color: #2e313a;
  width: 100%;
`;

export const CenterItemDiv = styled(RowFixed)`
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  };
`;

export const SearchDiv = styled(RowFixed)`
  width: 256px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #22252d;
  margin-right: 30px;
`;

export const InputDiv = styled.input`
  font-size: 16px;
  flex: 1;
  height: 30px;
  outline: none;
  border: none;
  font-weight: 500;
  width: 100%;
  margin-left: 10px;
  background-color: transparent;
  color: white;
`;

export const SearchIcon = styled.img`
  width: 18px;
  height: auto;
  margin-right: 10px;
`;

export const MoreIcon = styled.img`
  width: 24px;
  height: auto;
`;

export const PortfolioTopBg = styled(RowCenter)`
  align-items: center;
  justify-content: flex-start;
  width: 150px;
  height: 22px;
  background-image: url(${ImageCommon.portfolio_item_bgimage});
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: white;
  font-size: 22px;
  padding-left: 50px;
  margin-left: -28px;
  @media (max-width: 768px) {
    width: 100px;
    height: 15px;
    font-size: 11px;
    padding-left: 25px;
    margin-left: 0px;
  }
`;

export const Arrow = styled.img`
  width: 6px;
  height: 4px;
  margin-left: 10px;
`;

export const DrawButton = styled.div`
  color: white;
  border: 1px solid #fbfcfc;
  align-items: center;
  justify-content: center;
  // height:30px;
  border-radius: 15px;
  padding: 2px 5px;
  // width:100px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  background-color: #ffffff;
  color: #4e55ff;
  font-weight: bold;
`;

export const CancelButton = styled(DrawButton)`
  color: white;
  background-color: transparent;
  padding: 2px 10px;
`;

export const BottomRight = styled(RowBetween)`
  height: 70px;
  border-left: 1px solid #2e313a;
  padding-left: 24px;
`;

export const AddressShowText = styled(TextEqure)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
