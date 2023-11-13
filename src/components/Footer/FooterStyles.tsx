import { Column } from "@components/Column";
import {
  CustomGrid,
  RowBetween,
  Text
} from "@components/Row";
import styled from "styled-components";

export const FooterLink = styled.div`
  padding-bottom: 10px;
  @media (max-width: 767px) {
    padding-bottom: 5px;
  }
`;

export const FooterLinkWrap = styled.div`
  padding: 80px 0;
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 20px 0;
    ${CustomGrid} {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    ${CustomGrid} ${Text} {
      font-size: 12px;
    }
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    ${CustomGrid} .ft_hd {
      font-size: 17px !important;
    }
  }
  @media (max-width: 767px) {
    padding: 0px 0;
    ${CustomGrid} .ft_hd {
      font-size: 14px !important;
    }
    ${CustomGrid} ${Text} {
      font-size: 12px;
    }
  }
`;

export const BottomInfoPhoneDiv = styled(Column)`
  background-color: #0d0d11;
  padding: 0px 0px 25px 0px;
  width: 100%;
`;

export const BottomInfoDiv = styled(Column)`
  height: 100%;
  //height:410px;
  width: 100%;
  background-color: #121316;
  @media (max-width: 767px) {
    padding-top: 20px;
  }
`;

export const BottomLineH = styled.div`
  height: 1px;
  width: 100%;
  background-color: #22262e;
`;

export const BottomLineV = styled.div`
  width: 1px;
  background-color: #22262e;
  margin: 0px 40px;
  height: 340px;
`;

export const BottomDown = styled(RowBetween)`
  height: 121px;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  @media (min-width: 1610px) {
    max-width: 1589px;
  }
  @media (max-width: 1190px) {
    height: 76px;
    max-width: 100%;
    padding-left: 30px;
    padding-right: 30px;
  }
`;

export const BottomIcon = styled.img`
  height: 21px;
  @media (max-width: 767px) {
    height: 16px;
  }
`;

export const BottomDiscordIcon = styled.img`
  height: 21px;
  @media (max-width: 767px) {
    height: 23px;
  }
`;

export const BottomRedditIcon = styled.img`
  height: 21px;
  @media (max-width: 767px) {
    height: 23px;
  }
`;

export const BottomMediumIcon = styled.img`
  height: 21px;
  @media (max-width: 767px) {
    height: 23px;
  }
`;

export const ArrowRightUp = styled.img`
  height: 4px;
  width: 4px;
  margin-top: 5px;
  margin-left: 5px;
`;

export const PhoneBottomLogo = styled.img`
  width: 193px;
`;

export const BottomFooterWrap = styled.div`
  background: linear-gradient(
    90.02deg,
    #0e042f 0.64%,
    #3a058e 38.41%,
    #451edb 60.15%,
    #04b0ff 99.99%
  );
  @media (min-width: 768px) and (max-width: 1700px) {
    ${Text} {
      font-size: 17px;
    }
    ${BottomIcon} {
      height: 17px;
    }
  }
`;
