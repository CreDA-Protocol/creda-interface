import { useCreditInfo } from '@services/credit.service';
import { useContext, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { WalletAddressContext } from '../../contexts';
import { useWalkThrough, useWalkThroughStep } from '../../states/application/hooks';
import { setDecrement, setIncrement } from '../../states/walkthrough/actions';
import { BlueButton } from '../Common';

export const Wrapper = styled.div<{
  walkThroughStep: Number | null,
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
    left:${({ isMobile, walkThroughStep }) => (!isMobile ? "50%" : walkThroughStep === 1 ? "50%" : walkThroughStep === 3 ? "80%" : walkThroughStep == 2 ? '50%' : "26%")};
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
  position: relative;
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
  padding: 10px;
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

export default function WalkThroughModal({
  currentStep,
  Test,
  title,
  TestHere,
  content,
  Next,
  steps,
  Previous,
  prevsteps,
  setShowModal,
}: {
  currentStep?: Number | undefined,
  Test?: string,
  title?: string,
  TestHere?: string,
  content?: string,
  Next?: string,
  steps?: boolean,
  Previous?: string,
  prevsteps?: string,
  setShowModal?: any,
}) {
  const countRef = useRef(1);
  const walkthrough = useWalkThrough();
  const walkThroughStep = useWalkThroughStep()
  // if(walkThroughStep===countRef.current){
  //   window.location.href='./profile'
  // }
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [count, setcount] = useState(1);
  const { account } = useContext(WalletAddressContext);
  const creditInfo = useCreditInfo();
  const [cookies, setCookie] = useCookies(['user']);

  useEffect(() => {
    if (walkThroughStep === currentStep) {
      setModal(true)
    } else {
      setModal(false)
    }
  }, [walkThroughStep]);

  const handleNextSteps = () => {
    //
    dispatch(setIncrement(Number(walkThroughStep)))
    // if(walkThroughStep===1){
    //   window.location.href='/profile'
    // }
  }

  const handlePrevSteps = () => {
    dispatch(setDecrement(Number(walkThroughStep)))
    // if(walkThroughStep===2){
    //   window.location.href='/vault'
    // }
  }

  return (
    <>
      {modal ?
        <div >
          <Backdrop />
          <Wrapper className='walk-through-modal-wrapper' walkThroughStep={walkThroughStep} isMobile={isMobile} >
            <StyledModal >
              <Header>
                <HeaderText>{title || "Test "}</HeaderText>
                {/* <CloseButton >X</CloseButton> */}
              </Header>
              <Content>{content}</Content>
              <ButtonWrap>
                {
                  walkThroughStep !== 1
                    ?
                    <BlueButton style={{ marginRight: '10px', borderRadius: '80px' }} onClick={() => handlePrevSteps()}>Previous</BlueButton> : ''
                }
                <BlueButton style={{ borderRadius: '80px' }} onClick={() => handleNextSteps()} disabled={steps}>Next</BlueButton>
              </ButtonWrap>
            </StyledModal>
          </Wrapper>
        </div> : ''}

    </>
  )

}