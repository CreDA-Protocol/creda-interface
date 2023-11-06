import { ChainIds } from "@services/chain.service";
import { switchNetwork } from "@services/network.service";
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { BlueButton } from '../Common';

export const Wrapper = styled.div<{
  isMobile: boolean | null,
}>`
  position: absolute;
  right: 0;
  transform: translate(-50%, -50%);
  z-index: 700;
  width: 292px;
  outline: 0;
  font-family:'Poppins Regular' !important;
  &:before {
    content: '';
    display: block;
    width: 15px;
    height: 15px;
    background-color: #ffffff;
    top: -8px;
    left:50%;
    position: absolute;
    border-radius: 2px 0 0 0;
    box-shadow: 0px 1px 6px 1px #56565682;
    transform: translateX(-50%) rotate(
    45deg
    );
  }
`;

const GradButton = styled.button`
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
`;

export const Backdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 500;
`;
export const StyledModal = styled.div`
  z-index: 100;
  background: white;
  position: relative;
  margin: auto;
  border-radius: 24px;
  padding:17px;
  padding-bottom:10px;
  box-shadow: 0px 5px 6px 3px #56565682;

`;
export const Header = styled.div`
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  padding: 6px 12px;
`;
export const HeaderText = styled.div`
  color: #747474 !important;
  align-self: center;
  font-weight:bolder
`;
export const CloseButton = styled.button`
  font-size: 0.8rem;
  border: none;
  border-radius: 3px;
  margin-left: 0.5rem;
  background: none;
  :hover {
    cursor: pointer;
  }
`;
export const Content = styled.div`
  padding: 7px;
  max-height: 30rem;
  color: black;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const ButtonWrap = styled.div`
  margin-right: 5px;
  padding:6px 12px;
  display:inline-flex;
`;

const Headerdiv = styled.div`
  height: 5px;
  background: linear-gradient( 90deg,#4a1ee1,#1890ff);
  `;

export default function WrongNetworkModal({
  modal
}: {
  modal?: boolean
}) {

  return (
    <>
      {modal ?
        <div >
          <Backdrop />
          <Wrapper className='walk-through-modal-wrapper' isMobile={isMobile} >
            <StyledModal >
              <Content>{'Please switch to Arbitrium Network.'}</Content>
              <ButtonWrap>
                <BlueButton onClick={() => switchNetwork(`0x${(ChainIds.arbitrum).toString(16)}`)} style={{ borderRadius: '80px' }}>Switch</BlueButton>
              </ButtonWrap>
            </StyledModal>
          </Wrapper>
        </div> : ''}

    </>
  )

}