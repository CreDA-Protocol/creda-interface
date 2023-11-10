import styled from "styled-components";
// import { useActiveWeb3React } from '../../hooks'
import {
  useChangeTemeDark,
  useTheme
} from "../../states/application/hooks";

const HeaderView = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    height: 20px;
  } ;
`;

const Arrow = styled.img`
  width: 20px;
  height: 20px;
  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

export const LightBtn = styled.div`
  background: #33b8ff;
  color: #fff;
  font-size: 21px;
  padding: 0px 38px;
  border-radius: 54px;
  font-weight: 600;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  > svg :is(path, circle) {
    fill: #fff;
  }
  &:hover {
    background: linear-gradient(90deg, #33b8ff, #33d4ff);
  }
  &:focus {
    background: linear-gradient(90deg, #3a0080, #4a29ff);
    color: #00ffff;
  }
  > svg {
    position: absolute;
    right: 8px;
    height: 26px;
  }
  &:focus > svg :is(path, circle) {
    fill: #00ffff;
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    height: 32px;
    font-size: 16px;
    > svg {
      height: 20px;
    }
    //margin-right: 10px;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    height: 24px;
    font-size: 12px;
    padding: 0 24px;
    margin-right: 10px;
    > svg {
      height: 14px;
      right: 5px;
    }
  }
  @media (max-width: 767px) {
    height: 24px;
    font-size: 12px;
    padding: 0 24px;
    margin-right: 10px;
    > svg {
      height: 14px;
      right: 5px;
    }
  }
  @media (max-width: 1024px) {
    margin-right: 10px;
  }
  @media (min-width: 1800px) {
    height: 38px;
    min-width: 146px;
    > svg {
      height: 24px;
    }
  }
  @media (max-width: 374px) {
    font-size: 10px;
  }
`;

export const DarkBtn = styled.div`
  background: #4a29ff;
  color: #fff;
  font-size: 21px;
  font-weight: 600;
  padding: 0px 38px;
  border-radius: 54px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  > svg path {
    fill: #fff;
  }
  &:hover {
    background: linear-gradient(90deg, #33b8ff, #33d4ff);
  }
  &:focus {
    background: linear-gradient(90deg, #3a0080, #4a29ff);
    color: #00ffff;
  }
  &:focus > svg path {
    fill: #00ffff;
  }
  > svg {
    position: absolute;
    left: 8px;
    height: 26px;
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    height: 32px;
    font-size: 16px;
    //margin-right: 10px;
    > svg {
      height: 20px;
    }
  }
  @media (max-width: 767px) {
    height: 24px;
    font-size: 12px;
    margin-right: 10px;
    padding: 0 24px;
    > svg {
      height: 14px;
      left: 5px;
    }
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    height: 24px;
    font-size: 12px;
    padding: 0 24px;
    margin-right: 10px;
    > svg {
      height: 14px;
      right: 5px;
    }
  }
  @media (max-width: 1024px) {
    margin-right: 10px;
  }
  @media (min-width: 1800px) {
    height: 38px;
    min-width: 146px;
    > svg {
      height: 24px;
    }
  }
  @media (max-width: 374px) {
    font-size: 10px;
  }
`;

export default function ThemeIcon() {
  const toggleDark = useChangeTemeDark();

  const themeIsDark = useTheme();

  return (
    <HeaderView
      onClick={() => {
        toggleDark();
      }}
    >
      {themeIsDark ? (
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
      {/*<Arrow src={themeIsDark?ImageCommon.theme_dark_icon:ImageCommon.theme_light_icon}/>*/}
    </HeaderView>
  );
}

export const halfMoonSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.63 33.98">
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path
          className="cls-1"
          d="M15.28,17a16.92,16.92,0,0,1,9.35-15.1A17,17,0,1,0,17,34a16.83,16.83,0,0,0,7.64-1.89A16.93,16.93,0,0,1,15.28,17Z"
        />
      </g>
    </g>
  </svg>
);

export const fullMoonSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.27 33.98">
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path
          className="cls-1"
          d="M15.28,17a16.92,16.92,0,0,1,9.35-15.1A17,17,0,1,0,17,34a16.83,16.83,0,0,0,7.64-1.89A16.93,16.93,0,0,1,15.28,17Z"
        />
        <path
          className="cls-1"
          d="M19,17a17,17,0,0,1-9.35,15.1A16.76,16.76,0,0,0,17.28,34a17,17,0,1,0,0-34A16.76,16.76,0,0,0,9.65,1.89,16.94,16.94,0,0,1,19,17Z"
        />
        <circle
          className="cls-1"
          cx="17.18"
          cy="16.59"
          r="10.23"
          transform="translate(-2.92 29.48) rotate(-76.66)"
        />
      </g>
    </g>
  </svg>
);
