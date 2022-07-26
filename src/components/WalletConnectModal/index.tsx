import React, { useContext } from 'react'
import styled from 'styled-components'
import Modal from '../NormalModal'
import { RowCenter } from '../../components/Row'
import {ChainId, createWalletConnectWeb3Provider, ethereum, logError, walletInfo} from "../../common/Common";
import {NetworkTypeContext, WalletAddressContext} from "../../context";
import ImageCommon from "../../assets/common/ImageCommon";
import {BaseView, CenterView, FlexViewBetween, FlexViewCenterColumn} from "../Common";
import {BigNumber, ethers} from "ethers";
const Container = styled(FlexViewCenterColumn)`
  width:500px;
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
    width:280px;
    height:auto;
`
const ConnectTitle = styled(BaseView)`
    font-size: 24px;
    color: #fff;
    font-weight: 200;
    margin-top: 10px;
`
const WrapItem = styled(FlexViewCenterColumn)`
    border-radius: 10px;
    width: 49%;
    margin-top: 10px;
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
const WalletIcon = styled.img`
    width:50px;
    height:auto;
    @media (max-width: 768px) {
        width:30px;
    };
`
const WalletTitle = styled(BaseView)`
    font-size: 24px;
    color: #fff;
    font-weight: 400;
    margin-top: 20px;
    @media (max-width: 768px) {
        font-size: 16px;
    };
`
const LaterTitle = styled(BaseView)`
    font-size: 16px;
    color: #4E55FF;
    font-weight: 400;
    margin-top: 20px;
    cursor:pointer;
     @media (max-width: 768px) {
        font-size: 14px;
    };
`
enum ConnectType {
    metamask=0,
    walletconnect=1
}
export default function WalletConnectModal({
  show=true,
  onDismiss,
                                               changeChainId,
                                               changeAccount
}: {
    show?: boolean
  onDismiss: () => void,
    changeChainId:(num:number)=>void,
    changeAccount:(str:string[])=>void
}) {
  const {chainId} = useContext(NetworkTypeContext);
  const {account} = useContext(WalletAddressContext);
  const network = ChainId[chainId];
  async function connectWallet(type:ConnectType) {
        try {
            if(type===ConnectType.walletconnect){
                const connectProvider = await createWalletConnectWeb3Provider();
                connectProvider.enable()
                walletInfo.provider = new ethers.providers.Web3Provider(connectProvider)
                walletInfo.signer = walletInfo.provider.getSigner()
                if(connectProvider.connected){
                    changeAccount(connectProvider.accounts)
                    changeChainId(connectProvider.chainId)
                }
                connectProvider.on("disconnect", ()=>{
                    console.log("Wallet connect disconnection event from the wallet");
                    walletInfo.provider = null
                    walletInfo.signer = undefined
                    changeAccount([])
                })
                connectProvider.on('chainChanged', changeChainId)
                connectProvider.on('accountsChanged', (accounts:string[])=>{
                    changeAccount(accounts)
                    changeChainId(connectProvider.chainId)
                })
            }else {
                console.log("MetaMaskLogin")
                if ([ChainId.arbitrum,ChainId.ropsten,ChainId.esc].indexOf(chainId)>=0) {
                    console.log("ifMetaMask")
                    ethereum.request({method: 'eth_requestAccounts'});
                    window.location.reload()
                } else {
                    console.log("elseMetaMask")
                    ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                            chainId: BigNumber.from(ChainId.arbitrum).toHexString(),
                                            chainName: 'Arbitrum',
                                            nativeCurrency: {
                                                name: 'ETH',
                                                symbol: 'ETH', // 2-6 characters long
                                                decimals: 18
                                            },
                                            rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                                            blockExplorerUrls: ['https://arbiscan.io/']
                            }
                        ]
                    }).then((res: any) => {
                        //添加成功
                    }).catch((err: any) => {
                        //添加失败
                    })
                }
            }
            onDismiss()

        }catch (e) {
            logError("connectWallet",e)
        }
    }
  return (
    <Modal isOpen={show} onDismiss={onDismiss} >
      <RowCenter>
        <Container>
            <Logo
                src={ImageCommon.BrandLogoDarkMode}
            ></Logo>
            <ConnectTitle>Connect Wallet</ConnectTitle>
            <FlexViewBetween>
                <WalletItem
                    title={"MetaMask"}
                    icon={ImageCommon.metamask}
                    onClick={()=>connectWallet(ConnectType.metamask)}
                ></WalletItem>
                <WalletItem
                    title={"WalletConnect"}
                    icon={ImageCommon.walletconnect}
                    onClick={()=>connectWallet(ConnectType.walletconnect)}
                ></WalletItem>
            </FlexViewBetween>

            <div style={{marginTop:'10px'}}>
                    <label style={{color:'#ffffff'}}>Get your Crypto Credit Score by syncing your wallet</label>
                </div>
            <LaterTitle
                onClick={onDismiss}
            >Later</LaterTitle>
        </Container>
      </RowCenter>
    </Modal>
  )
}

function WalletItem({title,icon,onClick}:any) {
    return(
        <WrapItem
            onClick={onClick}
        >
            <WalletIcon
                src={icon}
            ></WalletIcon>
            <WalletTitle>{title}</WalletTitle>
        </WrapItem>
    )
}
