import React, { useContext } from 'react'
import styled from 'styled-components'
import Modal from '../NormalModal'
import { RowCenter } from '../../components/Row'
import {ChainId} from "../../common/Common";
import {NetworkTypeContext, WalletAddressContext} from "../../context";
import { BaseView, FlexViewBetween, FlexViewCenterColumn } from '../Common';
import ConnectWallet from '../ConnectWallet';
import { BgImages } from '../../assets/bgImages/bgImages';
import { Lottie } from '@crello/react-lottie';
import creditScore from '../../lottie/CreDa_creditScore_animation.json'
import { isMobile } from 'react-device-detect';


const Container = styled.div`
display:flex;
transition: .5s;
   align-items:center;
   justify-content:center;
   width:100%;
   flex-direction:column;
  width:500px;
  font-family:'Poppins Regular';
  padding:30px;
  background-color:#000000;
  flex-direction:column;
  border-radius:20px;
  @media (max-width: 768px) {
    padding:15px;
    width:90%;
  };
 
`
const LaterTitle = styled.label`
    font-size: 16px;
    color: #4E55FF;
    font-weight: 400;
    margin-top: 10px;
    cursor:pointer;
     @media (max-width: 768px) {
        font-size: 14px;
    };
`
export default function ConnectToWalletModal({
  show=true,
  onDismiss,
}: {
    show?: boolean
  onDismiss: () => void,
}) {
  const {chainId} = useContext(NetworkTypeContext);
  const {account} = useContext(WalletAddressContext);
  const network = ChainId[chainId];
  return (
    <Modal isOpen={show} onDismiss={onDismiss} prop={'fromprofile'}>
      <RowCenter>
          <Container>
              <FlexViewBetween style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <div style={{marginBottom:'19px',position:'relative'}}>
                  {/* <img style={{height:'325px',width:'100%'}} src={BgImages.CredaBGC}></img> */}
                  <Lottie
                  config={{
                    loop: true,
                    autoplay: true,
                    animationData: creditScore,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                        width={isMobile?"416px":"440px"}
                        height={"325px"}/>
                  <label style={{position:'absolute',bottom:'117px',left:'169px'}}>
                    <strong style={{fontSize:'66px',color:'white'}}>?</strong>
                    <label style={{fontSize:'28px',fontWeight:700,color:'white'}}>/1000</label>
                  </label>
                </div>
              </FlexViewBetween>
              
              <div style={{marginBottom:'10px'}}>
                  <label style={{color:'#ffffff'}}>Connect your wallet to get the most out of CreDA platform.</label>
                </div>
              <div onClick={onDismiss}>
              <ConnectWallet popup='popup'></ConnectWallet>
              </div>
            <LaterTitle onClick={onDismiss}>Skip</LaterTitle>
          </Container>
      </RowCenter>
    </Modal>
  )
}

