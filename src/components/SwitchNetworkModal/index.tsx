import ImageCommon from "@assets/common/ImageCommon";
import { RowCenter } from '@components/Row';
import { AddEthereumChainParameter, addNetwork, mainnetNetworkConfigs, testnetNetworkConfigs } from "@services/network.service";
import styled from 'styled-components';
import { BaseView, FlexViewBetween, FlexViewCenterColumn, FlexViewLeft } from "../Common";
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

const TestNetTitle = styled(BaseView)`
    font-size: 20px;
    color: #fff;
    font-weight: 200;
    margin-top: 10px;
    text-align: left;
`

const FlexViewWrap = styled(FlexViewBetween)`
   flex-wrap: wrap;
`

const WrapItem = styled(FlexViewLeft)`
    border-radius: 10px;
    width: 48%;
    margin-top: 10px;
    background-color: #0c0f15;
    height:80px;
    cursor:pointer;
    &:hover {
        background-color:#0d1119;
    }
    @media (max-width: 768px) {
        height:150px;
    };
`
const NetworkIcon = styled.img`
    width: 50px;
    height: auto;
    margin: auto 0;
    @media (max-width: 768px) {
        width: 30px;
    };
`
const NetworkTitle = styled(BaseView)`
    font-size: 20px;
    color: #fff;
    font-weight: 400;
    margin: auto auto auto 10px;
    @media (max-width: 768px) {
        font-size: 16px;
    };
`
const CancelTitle = styled(BaseView)`
    font-size: 20px;
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
            <RowCenter onClick={onDismiss}>
                <Container>
                    <Logo
                        src={ImageCommon.BrandLogoDarkMode}
                    ></Logo>
                    <SwitchTitle>Select Network</SwitchTitle>

                    <FlexViewWrap>
                        {mainnetNetworkConfigs.map((item, index) => {
                            return <NetworkItem
                                key={index}
                                title={item.chainParam.chainName}
                                icon={item.icon}
                                onClick={() => switchNetwork(item.chainParam)}
                            ></NetworkItem>
                        })
                        }
                    </FlexViewWrap>

                    <FlexViewBetween>
                        <TestNetTitle>TestNet</TestNetTitle>
                        {/* <Toogle>Hide TestNet</Toogle> */}
                    </FlexViewBetween>

                    <FlexViewWrap>
                        {testnetNetworkConfigs.map((item, index) => {
                            return <NetworkItem
                                key={index}
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
