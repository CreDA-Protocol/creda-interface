import ImageCommon from "@assets/common/ImageCommon";
import { RowCenter } from '@components/Row';
import styled from 'styled-components';
import { AddEthereumChainParameter, addNetwork, networkConfigs } from "../../common/Common";
import { BaseView, FlexViewBetween, FlexViewCenterColumn } from "../Common";
import Modal from '../NormalModal';

const Container = styled(FlexViewCenterColumn)`
  width:600px;
  height: 80%;
  padding:30px;
  background-color:#000000;
  flex-direction:column;
  border-radius:20px;
  @media (max-width: 768px) {
    padding:15px;
    width:90%;
  };

`
const Logo = styled.img`
    width:200px;
    height:auto;
`
const SwitchTitle = styled(BaseView)`
    font-size: 24px;
    color: #fff;
    font-weight: 200;
    margin-top: 10px;
`
const FlexViewWrap = styled(FlexViewBetween)`
   flex-wrap: wrap;
`

const WrapItem = styled(FlexViewCenterColumn)`
    border-radius: 10px;
    width: 40%;
    margin:auto;
    background-color: #0c0f15;
    height:190px;
    cursor:pointer;
    &:hover {
        background-color:#0d1119;
    }
    @media (max-width: 768px) {
        height:150px;
    };
`
const NetworkIcon = styled.img`
    width:50px;
    height:auto;
    @media (max-width: 768px) {
        width:30px;
    };
`
const NetworkTitle = styled(BaseView)`
    font-size: 20px;
    color: #fff;
    font-weight: 400;
    margin-top: 20px;
    @media (max-width: 768px) {
        font-size: 16px;
    };
`
const CancelTitle = styled(BaseView)`
    font-size: 16px;
    color: #4E55FF;
    font-weight: 400;
    margin-top: 20px;
    cursor:pointer;
     @media (max-width: 768px) {
        font-size: 14px;
    };
`

export default function SwitchNetworkModal({
    show = true,
    onDismiss,
}: {
    show?: boolean
    onDismiss: () => void,
}) {
    async function switchNetwork(param: AddEthereumChainParameter) {
        try {
            onDismiss();
            await addNetwork(param);
        }
        catch (e) {
          console.warn('switchNetwork error:', e)
          onDismiss();
        }
    }
    return (
        <Modal isOpen={show} onDismiss={onDismiss} >
            <RowCenter>
                <Container>
                    <Logo
                        src={ImageCommon.BrandLogoDarkMode}
                    ></Logo>
                    <SwitchTitle>Switch Network</SwitchTitle>

                    <FlexViewWrap>
                      {networkConfigs.map(item => {
                          return <NetworkItem
                            title={item.chainParam.chainName}
                            icon={item.icon}
                            onClick={() => switchNetwork(item.chainParam)}
                          ></NetworkItem>
                        })
                      }
                    </FlexViewWrap>

                    <CancelTitle
                        onClick={onDismiss}
                    >Cancel</CancelTitle>
                </Container>
            </RowCenter>
        </Modal>
    )
}

function NetworkItem({ title, icon, onClick }: any) {
    return (
        <WrapItem onClick={onClick}>
            <NetworkIcon
                src={icon}
            ></NetworkIcon>
            <NetworkTitle>{title}</NetworkTitle>
        </WrapItem>
    )
}
