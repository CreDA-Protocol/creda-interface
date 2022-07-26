import React, {useContext, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import AppBody, {MainFullBody} from '../AppBody'
import {
  CustomGrid,
  FontPoppins,
  GradientButton,
  GradientGaryButton,
  RowBetween,
  RowCenter,
  RowEnd,
  RowFixed,
  SpaceHeight,
  SpaceWidth,
  Text,
  TextEqure
} from '../../components/Row'
import Column, {ColumnBetween, ColumnCenter} from '../../components/Column'
import {isMobile} from 'react-device-detect';
import {
  BaseView,
  BlueButton,
  CardPair,
  CustomIcon,
  FlexViewBetween,
  FlexViewCenter,
  LgBorderButton,
  LgWhiteButton,
  LoadingRow,
  MobileView,
  WinView
} from '../../components/Common'
import {
  useApprove,
  useCnetWorkInfo,
  useCNFTInfo,
  useCredaInfo,
  useCreditInfo,
  useHardPoolInfo,
  useMiningPoolInfo,
  useUnLockInfo,
} from "../../contract";
import {
  ApprovalState,
  balanceToBigNumber,
  bigNumberToBalance,
  ChainId,
  colors,
  formatBalance,
  formatPercent,
  GasInfo,
  getNFTCardBgImage,
  MiningPool,
  MyBankAssetPriceIcons,
  MyBankAssetPriceIconsESC,
  tipError
} from "../../common/Common";
import {NetworkTypeContext, WalletAddressContext} from "../../context";
import {useTransactionAdder} from "../../state/transactions/hooks";
import {useOpenWarnning, useTheme} from "../../state/application/hooks";
import {useContract} from "../../hooks/useContract";
import ContractConfig, {EarnConfig} from "../../contract/ContractConfig";
import {useTranslation} from "react-i18next";
import {TransactionResponse} from '@ethersproject/providers'
import StakeModal from '../../components/StakeModal'
import {H4} from "../../components/ConnectWallet";
import {ThemeText, ThemeTextEqure} from '../../components/ThemeComponent'
import ImageToken from "../../assets/tokens/ImageToken";
import CustomStakeModal from "../../components/CustomStakeModal";
import {BigNumber} from "ethers";
import {ToastStatus, useAddToast} from "../../state/toast";
import ImageCommon from "../../assets/common/ImageCommon";
import {Badge, Button, message, Skeleton, Tooltip} from 'antd';
import Countdown from 'react-countdown'
import {LoadingContext, LoadingType} from "../../provider/loadingProvider";
import {QuestionCircleOutlined} from "@ant-design/icons/lib";
import BorrowCollateralModal from './BorrowCollateralModal'

const Body = styled(Column)`
  width:100%;
  height:100%;
  padding:0px 15px
`
const CoinIcon = styled.img`
  width:20px;
  height:auto;
  margin-right:10px;
`
const CopyIcon = styled.img`
  width:14px;
  height:13px;
  @media (max-width: 768px) {
    margin-left:10px;
    margin-top:5px
  };
  margin-left:20px;
  margin-top:10px
`
const AddressText = styled(TextEqure)`
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ;
  -webkit-box-orient: vertical;
  margin-top:10px;
  width:fit-content;
  @media (max-width: 768px) {
    margin-top:5px;
    width:100px
  };
`
const ColorDiv = styled(Column)`
  width:314px;
  height:177px;
  border-radius:24px;
  background-color:#4E55FF;
  padding:30px;
  padding-bottom:0px;
  @media (max-width: 768px) {
    flex:1;
    width:100%;
    border-radius:12px;
    margin-bottom:15px;
    border:1px solid #363739;
    padding:20px;
    height:160px;
  };
  position:relative
`
const ColorDivNoBorder = styled(ColorDiv)`
@media (max-width: 768px) {
  border:0px solid #363739;
};
`
const NormalDiv = styled(ColorDiv)`
  background-color:#17181A;
`
const GreenDiv = styled(RowCenter)`
  height:24px;
  border-radius:12px;
  background-color:#58BC7C;
  align-items:center;
  width:fit-content;
  margin-left:10px;
  padding:10px;
  @media (max-width: 768px) {
    margin-left:5px;
    padding:5px;
  }
`
const TopItemDiv = styled(RowBetween)`
  @media (max-width: 768px) {
   flex-direction:column;
   align-items:flex-start
  };
`
const BGDiv = styled(Column)<{background:string}>`
  background:${props=>props.background};
  border-radius:24px;
  padding:23px 28px;
  margin:20px 0px;
  width:100%;
  @media (max-width: 768px) {
    border:1px solid #363739
  };
  position:relative
`
// const BlueButton = styled(ButtonClick)`
//   background-color:#4E55FF;
//   height:40px;
//   border-radius:20px;
//   padding:0px 20px;
//   @media (max-width: 768px) {
//     padding:0px 10px;
//   };
//   align-items:center;
//   justify-content:center;
//   color:white;
//   font-size:14px;
//   font-weight:bold
// `
const BorderButton = styled(BlueButton)`
  background-color:transparent;
  border:1px solid #FBFCFC
`
const VualtDiv = styled(RowBetween)`
  @media (max-width: 768px) {
    flex-direction:column
  };
`
const VualtItemDiv = styled(Column)`
  @media (max-width: 768px) {
    flex-direction:row;
    justify-content:space-between;
    width:100%;
    margin-bottom:10px
  };
`
const CountDownView = styled(RowCenter)`
  position:absolute;
  background-color:rgba(0,0,0,0.8);
  width:100%;
  height:100%;
  z-index:10;
  border-radius:24px;
`
const NFTBgImage = styled.img`
  position:absolute;
  width:314px;
  height:177px;
  @media (max-width: 768px) {
    flex:1;
    width:100%;
    height:160px;
  };
  top:0px;
  left:0px;
`
enum ButtonType {
  hidden=0,
  stake=1,
  unstake=2,
  claim=3,
  upgrade=3
}

function Vault(props: any) {
  const unlockInfo = useUnLockInfo()
  // const unlockInfo:any = {}
  const {chainId} = useContext(NetworkTypeContext);
  const {account} = useContext(WalletAddressContext);
  const network = ChainId[chainId];
  const addTransaction = useTransactionAdder();
  const addToast = useAddToast();
  const IFNTContract = useContract(ContractConfig.CREDA[network]?.address,ContractConfig.CREDA.abi);
  const MintContract = useContract(ContractConfig.PersonalDataMinePoolPlus[network]?.address,ContractConfig.PersonalDataMinePoolPlus.abi);
  const cnetworkContract = useContract(ContractConfig.CNETWORK[network]?.address,ContractConfig.CNETWORK.abi);
  const {t} = useTranslation();
  const showWarning = useOpenWarnning(true)
  const credaInfo = useCredaInfo()
  const creditInfo = useCreditInfo()
  const themeDark = useTheme()
  const [modalType,setModalType] = useState(ButtonType.hidden)
  const [hardModalType,setHardModalType] = useState(ButtonType.hidden)
  const [modalType2,setModalType2] = useState(ButtonType.hidden)
  const [info,setInfo] = useState<any>({})
  const cnftInfo = useCNFTInfo()
  const cnetworkInfo = useCnetWorkInfo(cnftInfo.no)
  const [approval, approveCallback] = useApprove(ContractConfig.CREDA[network]?.address, ContractConfig.CreditNFT[network]?.address)
  const CNFTContract = useContract(ContractConfig.CreditNFT[network]?.address,ContractConfig.CreditNFT.abi)
  const [active,setActive] = useState(false)
  const CredaContract = useContract(ContractConfig.InitialMint[network]?.address,ContractConfig.InitialMint[network]?.abi)
  const loading = useContext(LoadingContext)
  const hardContract = useContract(ContractConfig.PersonalDataMinePoolV2[network]?.address,ContractConfig.PersonalDataMinePoolV2[network]?.abi);
  const [visible,setVisible] = useState(false)

  let lpName = "SUSHI-LP"
  let coinleft = 'USDT'
  let coinright = 'CREDA'
  let buyLpAddr = "https://app.sushi.com/add/0xc136E6B376a9946B156db1ED3A34b08AFdAeD76d/0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"
  let layerSymbol = "ETH"
  if(chainId===ChainId.esc){
    lpName = "CREDA/ELA-LP"
    buyLpAddr = "https://glidefinance.io/add/0xc136E6B376a9946B156db1ED3A34b08AFdAeD76d/ELA"
    layerSymbol = "ELA"
    coinleft = 'ELA'
    coinright = 'CREDA'
  }
  useEffect(()=>{
    showWarning()
  },[])
  function claimCreda() {
    loading.show(LoadingType.confirm, `Claim CREDA Token`)
    CredaContract?.claim(GasInfo)
        .then(async (response: TransactionResponse) => {
          loading.show(LoadingType.pending,response.hash)
          // addTransaction(response, {
          //   summary: "Claim"
          // })
          await response.wait();
          loading.show(LoadingType.success,response.hash)
        })
        .catch((err: any) => {
          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          tipError(err)
        })
  }
  function claim() {
    loading.show(LoadingType.confirm, lpName)
    IFNTContract?.claimUnlocked(ContractConfig.ETH_CREDA_LP[network]?.address)
        .then(async (response: TransactionResponse) => {
         loading.show(LoadingType.pending, response.hash)
          await response.wait();
          loading.show(LoadingType.success, response.hash)
        })
        .catch((err: any) => {
          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          tipError(err)
        })
  }
  function poolAction(infoParam:any) {
    if(creditInfo.score<=0){
      loading.show(LoadingType.error, "Need Score > 0")
      return;
    }
    setInfo(infoParam)
    if(infoParam.type===ButtonType.claim){
      onClaim(infoParam)
      return
    }
    setModalType(infoParam.type)
  }
  function hardpoolAction(infoParam:any) {
    // if(creditInfo.score<=0){
    //   return;
    // }
    setInfo(infoParam)
    if(infoParam.type===ButtonType.claim){
      onHardClaim()
      return
    }
    setHardModalType(infoParam.type)
  }
  function onHardStake(amount:string) {
    loading.show(LoadingType.confirm, `Stake ${info.symbol}`)
    if (info.symbol==="ELA"){
      hardContract?.stakeELA(balanceToBigNumber(amount,info.decimals),BigNumber.from(info.pid),{
        value:balanceToBigNumber(amount,info.decimals),
        ...GasInfo
      })
          .then(async (response: TransactionResponse) => {
            loading.show(LoadingType.pending, response.hash)
            await response.wait();
            loading.show(LoadingType.success, response.hash)
          })
          .catch((err: any) => {
            if(err.code===4001){
              loading.show(LoadingType.error, err.reason || err.message)
              return
            }
            loading.show(LoadingType.error, err.reason || err.message)
            tipError(err)
          })
    }else {
      hardContract?.stake(balanceToBigNumber(amount,info.decimals),BigNumber.from(info.pid),GasInfo)
          .then(async (response: TransactionResponse) => {
            loading.show(LoadingType.pending, response.hash)
            await response.wait();
            loading.show(LoadingType.success, response.hash)
          })
          .catch((err: any) => {
            if(err.code===4001){
              loading.show(LoadingType.error, err.reason || err.message)
              return
            }
            loading.show(LoadingType.error, err.reason || err.message)
            tipError(err)
          })
    }
  }
  function onHardWithdraw(amount:string) {
    loading.show(LoadingType.confirm, `UnStake ${info.symbol}`)
    hardContract?.[info.symbol==="ELA"?"withdrawELA":"withdraw"](balanceToBigNumber(amount,info.decimals),BigNumber.from(info.pid))
        .then(async (response: TransactionResponse) => {
          loading.show(LoadingType.pending, response.hash)
          await response.wait();
          loading.show(LoadingType.success, response.hash)
        })
        .catch((err: any) => {
          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          tipError(err)
        })
  }
  function onHardClaim() {
    loading.show(LoadingType.confirm, `Claim`)
    hardContract?.claimReward()
        .then(async (response: TransactionResponse) => {
          loading.show(LoadingType.pending, response.hash)
          await response.wait();
          loading.show(LoadingType.success, response.hash)
        })
        .catch((err: any) => {
          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          tipError(err)
        })
  }
  function onStake(amount:string) {
    console.log('onStake');

    loading.show(LoadingType.confirm, `Stake c${info.symbol}`)

    MintContract?.stake(balanceToBigNumber(amount,info.decimals),BigNumber.from(info.pid),{
      value:balanceToBigNumber(amount,info.decimals)
    },GasInfo)
        .then(async (response: TransactionResponse) => {
          loading.show(LoadingType.pending, response.hash)
          await response.wait();
          loading.show(LoadingType.success, response.hash)
        })
        .catch((err: any) => {
          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          tipError(err)
        })
  }
  function onWithdraw(amount:string) {
    console.log('onWithdraw');

    loading.show(LoadingType.confirm, `UnStake ${info.symbol}`)
    MintContract?.[info.symbol==="ELA"?"withdrawELA":"withdraw"](balanceToBigNumber(amount,info.decimals),BigNumber.from(info.pid))
        .then(async (response: TransactionResponse) => {
          loading.show(LoadingType.pending, response.hash)
          await response.wait();
          loading.show(LoadingType.success, response.hash)
        })
        .catch((err: any) => {
          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          tipError(err)
        })
  }
  function onClaim(infoParam:any) {
    loading.show(LoadingType.confirm, `Claim ${infoParam.symbol}`)
    MintContract?.claimReward(BigNumber.from(infoParam.pid))
        .then(async (response: TransactionResponse) => {
          loading.show(LoadingType.pending, response.hash)
          await response.wait();
          loading.show(LoadingType.success, response.hash)
        })
        .catch((err: any) => {
          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          tipError(err)
        })
  }

  function onJoin() {
    loading.show(LoadingType.confirm, `JOIN`)
    cnetworkContract?.Active(account)
        .then(async (response: TransactionResponse) => {
          loading.show(LoadingType.pending, response.hash)
          await response.wait();
          loading.show(LoadingType.success, response.hash)
        })
        .catch((err: any) => {
          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          tipError(err)
        })
  }
  function onUpgrade(amount:string) {
    // if(approval!==ApprovalState.APPROVED){
    //   approveCallback()
    //   return
    // }
    CNFTContract?.updateNFTAmount(cnftInfo.no,balanceToBigNumber(amount))
        .then(async (response: TransactionResponse) => {
          addTransaction(response, {
            summary: "Upgrade"
          })
          await response.wait();
        })
        .catch((err: any) => {
          addToast(ToastStatus.error,err.data?.message)
          tipError(err)
        })
  }
  return (
    <MainFullBody history={props.history}>
      <AppBody history={props.history}>
        <Body>
          <RowBetween style={{
            paddingLeft:isMobile?15:30,
            paddingBottom:isMobile?20:40
          }}>
            <ThemeTextEqure fontSize={32} fontWeight={'bold'}>Vault</ThemeTextEqure>
            <CustomGrid style={{marginRight:'unset', textAlign:'right'}} templateColumns={'1fr 1fr'} mobTemplateColumns={'1fr 1fr'} columnGap={15} mobColumnGap={15}>
              <FontPoppins>
                <ThemeText fontSize={22} style={{fontWeight:800}} >Network</ThemeText>
              </FontPoppins>
              <GradientButton className="network_title" style={{width:!isMobile?162:'auto', textTransform:'capitalize'}}>
                <H4>{network.toUpperCase()}</H4>
              </GradientButton>
            </CustomGrid>
          </RowBetween>
          <TopItemDiv>
            <ColorDiv>
              {credaInfo.loading?<Skeleton active paragraph={{rows:2}}/>:<>
                <TextEqure fontColor={'#BBBDFF'} fontSize={18}>CREDA TOKEN</TextEqure>
                <TextEqure fontSize={40} fontWeight={'bold'}>{formatBalance(credaInfo.balance)}</TextEqure>
                <TextEqure fontColor={'#BBBDFF'}  fontSize={18} fontWeight={'bold'}>Locked: {formatBalance(credaInfo.locked)}</TextEqure>
              </>}
            </ColorDiv>
            <ColorDiv style={{
              backgroundColor:themeDark? '#17181A' : 'white'
            }}>
              {credaInfo.loading?<Skeleton active paragraph={{rows:2}}/>:<><TextEqure fontColor={'#777E90'} fontSize={18}>Unlocked CREDA</TextEqure>
              <ThemeTextEqure fontSize={40} fontWeight={'bold'}>{formatBalance(credaInfo.unlocked)}</ThemeTextEqure>
              <TextEqure fontColor={'#777E90'}  fontSize={18} fontWeight={'bold'}>${formatBalance(0)}</TextEqure></>}
            </ColorDiv>
            <ColorDivNoBorder style={{
              backgroundColor:'transparent'
            }}>
              <NFTBgImage src={getNFTCardBgImage(cnftInfo.lv)}/>
              {cnftInfo.loading?<Column style={{zIndex:1}}><Skeleton active paragraph={{rows:2}}/></Column>:<Column style={{zIndex:1}}>
                <RowFixed style={{
                  width:'100%',
                  justifyContent:isMobile?'space-between':'flex-start',
                  }}>
                  <TextEqure fontSize={16}>Credit NFT(Minted CREDA:{cnftInfo.loading?"-":formatBalance(cnftInfo.amount)})</TextEqure>
                </RowFixed>
                <SpaceHeight height={20} heightApp={10}/>
                <RowFixed>
                  <TextEqure  fontSize={12}>Level</TextEqure>
                  <ThemeTextEqure style={{marginLeft:20, color:'#FFF'}} fontSize={24} fontWeight={'bold'}>{cnftInfo.loading?"-":cnftInfo.lv}</ThemeTextEqure>
                </RowFixed>
                <RowFixed>
                  <TextEqure fontSize={12}>NO.</TextEqure>
                  <ThemeTextEqure style={{marginLeft:20, color:'#FFF'}} fontSize={24} fontWeight={'bold'}>{cnftInfo.loading?"-":cnftInfo.no}</ThemeTextEqure>
                </RowFixed>
              </Column>}
            </ColorDivNoBorder>
          </TopItemDiv>
          {!creditInfo.loading && creditInfo.earn>0 && <JoinView
              background={themeDark?colors.dark_background:colors.background}
          >
            <JoinTitle
                color={themeDark?colors.white:colors.dark_title}
            >You have received {formatBalance(creditInfo.earn,2)} CREDA Token to unlock.  </JoinTitle>
            <BlueButton
              onClick={claimCreda}
            >CLAIM</BlueButton>
          </JoinView>}
          {chainId !== ChainId.esc && !cnetworkInfo.loading && !cnetworkInfo.isJoin && <JoinView
              background={themeDark?colors.dark_background:colors.background}
          >
            <JoinTitle
                color={themeDark?colors.white:colors.dark_title}
            >An Invitation From Credit Network</JoinTitle>
            <BlueButton
                onClick={onJoin}
            >JOIN</BlueButton>
          </JoinView>}
          {chainId !== ChainId.esc && !cnetworkInfo.loading && cnetworkInfo.isLayer && <>
            <RowFixed style={{
              paddingLeft:isMobile?15:30,
              paddingTop:isMobile?20:40
            }}>
              <ThemeTextEqure fontSize={28} fontWeight={'bold'}>Credit Network</ThemeTextEqure>
            </RowFixed>
            <BGDiv
              background={themeDark?colors.dark_background:colors.background}
            >
              {/*<NetworkTitle>Credit Network</NetworkTitle>*/}
              <LayerView>
                <WinView>
                    <LayerTitle>Efficient</LayerTitle>
                    <LayerPrice
                        color={themeDark?colors.white:colors.dark_title}
                    >{cnetworkInfo.loading?"-":formatBalance(cnetworkInfo.setting,0)}</LayerPrice>
                    <LayerDesc>Credit Score</LayerDesc>
                    <LayerDesc>&nbsp;</LayerDesc>
                    <LayerTitle>Credit Loan</LayerTitle>
                    <LayerPrice
                        color={themeDark?colors.white:colors.dark_title}
                    >${cnetworkInfo.loading?"-":formatBalance(cnetworkInfo.network,0)}</LayerPrice>
                    <LayerDesc>&nbsp;</LayerDesc>
                </WinView>
                <MobileView
                  style={{width:"100%"}}
                >
                  <RowBetween>
                    <div>
                      <LayerTitle>Efficient</LayerTitle>
                      <LayerPrice
                          color={themeDark?colors.white:colors.dark_title}
                      >{cnetworkInfo.loading?"-":formatBalance(cnetworkInfo.setting,0)}</LayerPrice>
                      <LayerDesc>Credit Score</LayerDesc>
                      <LayerDesc>&nbsp;</LayerDesc>
                    </div>
                    <div
                        style={{textAlign:'right'}}
                    >
                      <LayerTitle>Credit Loan</LayerTitle>
                      <LayerPrice
                          color={themeDark?colors.white:colors.dark_title}
                      >${cnetworkInfo.loading?"-":formatBalance(cnetworkInfo.network,0)}</LayerPrice>
                      <LayerDesc>&nbsp;</LayerDesc>
                    </div>
                  </RowBetween>
                </MobileView>
                <FlexViewCenter>
                  {/*<AnimateView></AnimateView>*/}
                  <AnimateImg src={themeDark?ImageCommon.animate_black:ImageCommon.animate_white} alt=""/>
                </FlexViewCenter>
                <WinView>
                  <BaseView
                      style={{textAlign:"right"}}
                  >
                    <LayerTitle>Layer 1</LayerTitle>
                    <LayerPrice
                        color={themeDark?colors.white:colors.dark_title}
                    >{cnetworkInfo.loading?"-":formatBalance(cnetworkInfo.layer1,0)}</LayerPrice>
                    <LayerDesc>&nbsp;</LayerDesc>
                    <LayerDesc>&nbsp;</LayerDesc>
                    <LayerTitle>Layer 2</LayerTitle>
                    <LayerPrice
                        color={themeDark?colors.white:colors.dark_title}
                    >{cnetworkInfo.loading?"-":formatBalance(cnetworkInfo.layer2,0)}</LayerPrice>
                    <LayerDesc>&nbsp;</LayerDesc>

                  </BaseView>
                </WinView>
                <MobileView
                  style={{width:"100%"}}
                >
                  <RowBetween>
                    <div>
                      <LayerTitle>Layer 1</LayerTitle>
                      <LayerPrice
                          color={themeDark?colors.white:colors.dark_title}
                      >{cnetworkInfo.loading?"-":formatBalance(cnetworkInfo.layer1,0)}</LayerPrice>
                      <LayerDesc>&nbsp;</LayerDesc>
                      <LayerDesc>&nbsp;</LayerDesc>
                    </div>
                   <div
                    style={{textAlign:'right'}}
                   >
                     <LayerTitle>Layer 2</LayerTitle>
                     <LayerPrice
                         color={themeDark?colors.white:colors.dark_title}
                     >{cnetworkInfo.loading?"-":formatBalance(cnetworkInfo.layer2,0)}</LayerPrice>
                     <LayerDesc>&nbsp;</LayerDesc>
                   </div>

                  </RowBetween>
                </MobileView>
              </LayerView>
              <SpaceHeight height={40} heightApp={20}/>
              <RowBetween style={{
                flexDirection:isMobile?'column':'row'
              }}>
                <ColumnCenter style={{
                  flexDirection:isMobile?'row':'column',
                  justifyContent:isMobile?'space-between':'flex-start',
                }}>
                  <LayerTitle>Insure Amount</LayerTitle>
                  <ThemeText fontSize={24} fontWeight={'bold'}>0.00{layerSymbol}($0)</ThemeText>
                </ColumnCenter>
                <SpaceHeight height={0} heightApp={5}/>
                <ColumnCenter style={{
                  flexDirection:isMobile?'row':'column',
                  justifyContent:isMobile?'space-between':'flex-start',
                }}>
                  <LayerTitle>Payout  Amount</LayerTitle>
                  <RowFixed>
                    <ThemeText fontSize={24} fontWeight={'bold'}>0.00{layerSymbol}($0)</ThemeText>
                    <SpaceWidth width={10} widthApp={5}/>
                    <GradientGaryButton onClick={()=>{}} >Repay</GradientGaryButton>
                  </RowFixed>
                </ColumnCenter>
                <SpaceHeight height={0} heightApp={5}/>
                <ColumnCenter style={{
                  flexDirection:isMobile?'row':'column',
                  justifyContent:isMobile?'space-between':'flex-start',
                }}>
                  <LayerTitle>Insurance Income</LayerTitle>
                  <RowFixed>
                    <ThemeText fontSize={24} fontWeight={'bold'}>0.00{layerSymbol}($0)</ThemeText>
                    <SpaceWidth width={10} widthApp={5}/>
                    <GradientGaryButton onClick={()=>{}} >Claim</GradientGaryButton>
                  </RowFixed>
                </ColumnCenter>
              </RowBetween>
            </BGDiv>
          </>}
          {chainId !== ChainId.esc && !cnetworkInfo.loading && cnetworkInfo.isLayer && <Column>
              <SpaceHeight height={40} heightApp={20}/>
              <ThemeText fontSize={30} fontWeight={'bold'}>Credit Account</ThemeText>
              <CreditAccount/>
            </Column>}
          <SpaceHeight height={40} heightApp={20}/>
          <ThemeText fontSize={30} fontWeight={'bold'}>Unlock CREDA</ThemeText>
          {
            [1].map((item,index)=>{
              return unlockInfo.loading?<BGDiv
                  background={themeDark?colors.dark_background:colors.background}
              >
                <Skeleton active paragraph={{rows:2}}/>
              </BGDiv>:<BGDiv
                  background={themeDark?colors.dark_background:colors.background}
              >
                <VualtDiv>
                  <VualtItemDiv>
                    <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Name</TextEqure>
                    {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
                    <RowFixed>
                      <CardPair pair1={coinright} pair2={coinleft} showTitle={false}/>
                      <ThemeTextEqure fontSize={14} fontWeight={'500'}>{lpName}</ThemeTextEqure>
                    </RowFixed>
                  </VualtItemDiv>
                  <VualtItemDiv>
                    <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Staked</TextEqure>
                    {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
                    <ThemeTextEqure fontSize={14} fontWeight={'500'}>{unlockInfo.loading?"-":formatBalance(unlockInfo.staked)}</ThemeTextEqure>
                  </VualtItemDiv>
                  <VualtItemDiv>
                    <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Speed/Day</TextEqure>
                    {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
                    <ThemeTextEqure fontSize={14} fontWeight={'500'}>{unlockInfo.loading?"-":formatBalance((unlockInfo.speed * 3600 *24/10**18))}</ThemeTextEqure>
                  </VualtItemDiv>
                  <VualtItemDiv>
                    <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Unlocked</TextEqure>
                    {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
                    <ThemeTextEqure fontSize={14} fontWeight={'500'}>{unlockInfo.loading?"-":formatBalance(unlockInfo.unlock)}</ThemeTextEqure>
                  </VualtItemDiv>
                  <VualtItemDiv>
                    <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Remaining</TextEqure>
                    {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
                    <ThemeTextEqure fontSize={14} fontWeight={'500'}>{unlockInfo.loading?"-":formatBalance(unlockInfo.locked - unlockInfo.unlock)}</ThemeTextEqure>
                  </VualtItemDiv>
                  <SpaceHeight height={30} heightApp={15}/>
                  <RowFixed>
                    {unlockInfo.unlock > 0 ? <GradientButton
                      onClick={claim}
                    >Claim</GradientButton> :  <GradientGaryButton>Claim</GradientGaryButton>}
                    <SpaceWidth width={30} widthApp={15}/>
                    <a href={buyLpAddr}>
                      <LgBorderButton
                          style={{
                            border: themeDark?'1px solid #FBFCFC':'1px solid #17181A',
                            color:themeDark? 'white' : '#17181A'
                          }}
                      >Get LP</LgBorderButton>
                    </a>
                  </RowFixed>
                </VualtDiv>
                <SpaceHeight height={30} heightApp={15}/>
               <StakeButtons
                  unlockInfo={unlockInfo}
               />
              </BGDiv>
            })
          }
          <SpaceHeight height={40} heightApp={20}/>
            {/*<ActiveBar*/}
            {/*    data={[{title:"Active"},{title:"Inactive"}]}*/}
            {/*    initSelect={active?0:1}*/}
            {/*    onItemChange={(index:number)=>(setActive(!index))}*/}
            {/*></ActiveBar>*/}



          <HardMiningPoolView hardpoolAction={hardpoolAction}/>


          {chainId!==ChainId.esc && <>
            <SpaceHeight height={40} heightApp={20}/>
            <RowFixed style={{
              paddingLeft:isMobile?15:30,
              // paddingBottom:isMobile?20:40
            }}>
              <ThemeText fontSize={30} fontWeight={'bold'} >Soft Launch Mining Pool</ThemeText>
              {/*<ActiveBar*/}
              {/*    data={[{title:"Active"},{title:"Inactive"}]}*/}
              {/*    initSelect={active?0:1}*/}
              {/*    onItemChange={(index:number)=>(setActive(!index))}*/}
              {/*></ActiveBar>*/}
            </RowFixed>

            <FlexViewBetween
                style={{
                  flexWrap:"wrap"
                }}
            >
              {
                MiningPool.map((item:any,index:number)=>{
                  return(
                      <SoftLaunch
                          symbol={item}
                          index={index}
                          poolAction={poolAction}
                          open={true}
                      ></SoftLaunch>
                  )
                })
              }
            </FlexViewBetween>
          </>}
        </Body>
      </AppBody>
      <CustomStakeModal
          show={modalType!==ButtonType.hidden}
          onDismiss={()=>setModalType(ButtonType.hidden)}
          title={(info.type===ButtonType.stake?"Stake ":"Unstake ")+info.symbol}
          maxNum={info.type===ButtonType.stake?info.balance:info.staked}
          onConfirm={info.type===ButtonType.stake?onStake:onWithdraw}
          symbol={info.symbol}
      ></CustomStakeModal>
      <CustomStakeModal
          show={hardModalType!==ButtonType.hidden}
          onDismiss={()=>setHardModalType(ButtonType.hidden)}
          title={(info.type===ButtonType.stake?"Stake ":"Unstake ")+(chainId==ChainId.esc?'':'c')+info.symbol}
          maxNum={info.type===ButtonType.stake?info.balance:info.staked}
          onConfirm={info.type===ButtonType.stake?onHardStake:onHardWithdraw}
          symbol={info.symbol}
      ></CustomStakeModal>
      <CustomStakeModal
          show={modalType2!==ButtonType.hidden}
          title={"Upgrade"}
          onDismiss={()=>setModalType2(ButtonType.hidden)}
          maxNum={cnftInfo.balance}
          onConfirm={onUpgrade}
          symbol={info.symbol}
      ></CustomStakeModal>
      <CalculaterModal
        visible={visible}
        onClose={()=>setVisible(false)}
      ></CalculaterModal>
    </MainFullBody>
  )
}

function SoftLaunch({symbol,index,poolAction,open}:any) {
  const themeDark = useTheme()
  const {chainId} = useContext(NetworkTypeContext);
  const {account} = useContext(WalletAddressContext);
  const network = ChainId[chainId];
  const [approval, approveCallback] = useApprove(ContractConfig[symbol]?.[network]?.address, ContractConfig.PersonalDataMinePoolPlus?.[network]?.address)
  const info = useMiningPoolInfo(symbol,index)
  function action(type:ButtonType) {
    if(approval!==ApprovalState.APPROVED){
      approveCallback()
      return
    }
    info.symbol = symbol
    info.type = type
    poolAction && poolAction(info)
  }

  const contentDiv = <div
    style={{padding:"25px",paddingTop:"30px",paddingBottom:"20px"}}
  >
    <VualtDiv>
      <VualtItemDiv>
        <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Name</TextEqure>
        {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
        <RowFixed>
          <CoinIcon src={ImageToken[symbol]}></CoinIcon>
          <ThemeTextEqure fontSize={14} fontWeight={'500'}>{symbol}</ThemeTextEqure>
        </RowFixed>
      </VualtItemDiv>
      <VualtItemDiv>
        <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Staked</TextEqure>
        {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
        <ThemeTextEqure fontSize={14} fontWeight={'500'}>{info.loading?"-":formatBalance(info.staked)}</ThemeTextEqure>
      </VualtItemDiv>
      <VualtItemDiv>
        <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Claimable</TextEqure>
        {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
        <ThemeTextEqure fontSize={14} fontWeight={'500'}>{info.loading?"-":formatBalance(info.claimable)}</ThemeTextEqure>
      </VualtItemDiv>
      <VualtItemDiv>
        <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>APR</TextEqure>
        {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
        <ThemeTextEqure fontSize={14} fontWeight={'500'}>{info.loading?"-":formatPercent(info.apr)}</ThemeTextEqure>
      </VualtItemDiv>
      <VualtItemDiv>
        <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>
          MineLimit
        </TextEqure>
        {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
        <ThemeTextEqure fontSize={14} fontWeight={'500'}>{info.loading?"-":formatBalance(info.MineLimit,2
        )}</ThemeTextEqure>
      </VualtItemDiv>
    </VualtDiv>
    <SpaceHeight height={20} heightApp={10}/>
    <RowBetween>
      {
        !open && <GradientButton
        onClick={()=>action(ButtonType.stake)}
        >{approval===ApprovalState.APPROVED?"Stake":"Approve"}</GradientButton>
      }
      <GradientButton
          onClick={()=>action(ButtonType.unstake)}
      >UnStake</GradientButton>
     {
       !open &&  <LgWhiteButton style={{padding:'0 24px'}}
        onClick={()=>action(ButtonType.claim)}
    >Claim</LgWhiteButton>
     }
    </RowBetween>
  </div>

  return(
      <BGDiv
          background={themeDark?colors.dark_background:colors.background}
          style={{
            width:isMobile?"100%":"48%",
            padding:0
          }}>
          {info.loading?<div
              style={{padding:"25px",paddingTop:"30px",paddingBottom:"20px"}}
          ><Skeleton active paragraph={{rows:2}}/></div>:open ? <Badge.Ribbon text="InActive" color="grey" placement={'start'}>
            {contentDiv}
          </Badge.Ribbon> : <div>{contentDiv}</div> }
        {/*{!open && <CountDown/>}*/}
      </BGDiv>
  )

}

function HardMiningPoolView({hardpoolAction}:any){
  const themeDark = useTheme()
  const {chainId} = useContext(NetworkTypeContext);
  const [claimable,setClaimable] = useState<{[key:string]:number}>({})
  let hardPools = MyBankAssetPriceIcons
  if(chainId === ChainId.esc){
    hardPools = MyBankAssetPriceIconsESC
  }
  const info = useHardPoolInfo(hardPools[0].name,0)

  return  <BGDiv
    background={themeDark?colors.dark_background:colors.background}>
      <TopItemDiv>
        <ThemeText fontSize={30} fontWeight={'bold'} >Hard Launch Mining Pool</ThemeText>
        <SpaceHeight height={0} heightApp={20}/>
        {info.loading?<LoadingRow width={"200px"}></LoadingRow>:<MiningPoolRight>
          <MiningPoolRightItem>
            <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Claimable</TextEqure>
            <SpaceWidth width={10} widthApp={5}/>
            <ThemeTextEqure fontSize={14} fontWeight={'500'}>{formatBalance(info.claimable)} CREDA</ThemeTextEqure>
          </MiningPoolRightItem>
          <SpaceWidth width={50} widthApp={0}/>
          <Tooltip title="The CREDA Tokens to mine are limited by Credit Score.The amount shows how many CREDA tokens you can mine from the hard launch mining pools. ">
            <MiningPoolRightItem>
              <WinView>
                <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>MineLimit </TextEqure>
              </WinView>
              <MobileView>
                <RowCenter>
                  <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>MineLimit </TextEqure>
                  &nbsp;<QuestionCircleOutlined style={{color:"#777E90"}}/>
                </RowCenter>
              </MobileView>
              <SpaceWidth width={10} widthApp={5}/>
              <ThemeTextEqure fontSize={14} fontWeight={'500'}>{formatBalance(info.limit,2)}</ThemeTextEqure>
              <WinView>
                &nbsp;<QuestionCircleOutlined style={{color:"#777E90"}}/>
              </WinView>
            </MiningPoolRightItem>
          </Tooltip>

          <SpaceWidth width={50} widthApp={0}/>
          <LgWhiteButton style={{padding:'0 24px',
            // background:themeDark?colors.background:colors.dark_background,
            // color:themeDark?colors.dark_background:colors.background,

          }}
                         onClick={()=>{
                           hardpoolAction({type:ButtonType.claim})
                         }}
          >Claim</LgWhiteButton>

        </MiningPoolRight>}
      </TopItemDiv>
      <SpaceHeight height={40} heightApp={0}/>
      {
        !isMobile && <RowBetween >
          <TextEqure style={{flex:1}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Name</TextEqure>
          <TextEqure style={{flex:1}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Staked</TextEqure>
          <TextEqure style={{flex:1}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>APR</TextEqure>
          <TextEqure style={{flex:1.5,textAlign:'right'}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}></TextEqure>
        </RowBetween>
      }
      {/* <SpaceHeight height={10} heightApp={5}/>
      <LineH /> */}
      <SpaceHeight height={10} heightApp={5}/>
    {
      hardPools.map((item:any,index:number)=>{
        return(
            <HardLaunch
                symbol={item.name}
                index={index}
                poolAction={hardpoolAction}
                open={true}
            ></HardLaunch>
        )
      })
    }
  </BGDiv>
}

function HardLaunch({symbol,index,poolAction,open}:any) {
  const {chainId} = useContext(NetworkTypeContext);
  const {account} = useContext(WalletAddressContext);
  const network = ChainId[chainId];
  const [approval, approveCallback] = useApprove(EarnConfig[symbol]?.[network]?.cToken?.address, ContractConfig.PersonalDataMinePoolV2?.[network]?.address)

  const info = useHardPoolInfo(symbol,index)
  function action(type:ButtonType) {
    if(approval!==ApprovalState.APPROVED && !(chainId===ChainId.esc && info.pid===0)){
      approveCallback()
      return
    }
    info.symbol = symbol
    info.type = type
    poolAction && poolAction(info)
  }


  const contentDiv = <div
      style={{padding:"25px"}}
  >
    <MiningLineItem>
      <RowFixed style={{flex:1,marginTop:10}}>
        <CoinIcon src={ImageToken[symbol]}></CoinIcon>
        <ThemeTextEqure fontSize={14} fontWeight={'500'}>{chainId===ChainId.arbitrum && 'c'}{symbol}</ThemeTextEqure>
      </RowFixed>
      <SpaceHeight height={0} heightApp={10}/>
      <MiningRowBetweenItem>
        {isMobile && <TextEqure fontColor={'#777E90'} fontSize={14} fontWeight={'500'}>Staked</TextEqure>}
        <ThemeTextEqure fontSize={14} fontWeight={'500'}>{info.loading?"-":formatBalance(info.staked,6)}</ThemeTextEqure>
      </MiningRowBetweenItem>

      {/* <VualtItemDiv>
        <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>Claimable</TextEqure>
        {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
        <ThemeTextEqure fontSize={14} fontWeight={'500'}>{info.loading?"-":formatBalance(info.claimable)}</ThemeTextEqure>
      </VualtItemDiv> */}

      <MiningRowBetweenItem>
        {isMobile && <TextEqure fontColor={'#777E90'} fontSize={14} fontWeight={'500'}>APR</TextEqure>}
        <ThemeTextEqure fontSize={14} fontWeight={'500'}>{info.loading?"-":formatPercent(info.apr)}</ThemeTextEqure>
      </MiningRowBetweenItem>

      {/* <VualtItemDiv>
        <TextEqure fontColor={'#777E90'} fontSize={17} fontWeight={'500'}>MineLimit
        </TextEqure>
        {!isMobile && <SpaceHeight height={15} heightApp={10}/>}
        <ThemeTextEqure fontSize={14} fontWeight={'500'}>{info.loading?"-":formatBalance(info.MineLimit,2
        )}</ThemeTextEqure>
      </VualtItemDiv> */}


      <SpaceHeight height={0} heightApp={10}/>
      <MiningButtonRow style={{flex:1.5}}>
        {chainId===ChainId.esc &&info.pid===0? <GradientButton
            onClick={()=>action(ButtonType.stake)}
        >Stake</GradientButton>: <GradientButton
            onClick={()=>action(ButtonType.stake)}
        >{approval===ApprovalState.APPROVED?"Stake":"Approve"}</GradientButton>}
        <SpaceWidth width={32} widthApp={0}/>
        <GradientButton
            onClick={()=>action(ButtonType.unstake)}>UnStake</GradientButton>
      </MiningButtonRow>



    </MiningLineItem>

    {/* <SpaceHeight height={20} heightApp={10}/>
    <RowBetween>
      {
        <GradientButton
            onClick={()=>action(ButtonType.stake)}
        >{approval===ApprovalState.APPROVED?"Stake":"Approve"}</GradientButton>
      }
      <GradientButton
          onClick={()=>action(ButtonType.unstake)}
      >UnStake</GradientButton>
      {
        <LgWhiteButton style={{padding:'0 24px'}}
          onClick={()=>action(ButtonType.claim)}
        >Claim</LgWhiteButton>
      }
    </RowBetween> */}
  </div>

  return(
      <Column>
        <LineH />
        {info.loading?<Skeleton active paragraph={false}/>:open ? <Badge.Ribbon text="Active" color={colors.main} placement={'start'}>
          {contentDiv}
        </Badge.Ribbon> : <div>{contentDiv}</div>}
        {/*{!open && <CountDown/>}*/}
      </Column>
  )

}
function CountDown(){
  const renderer = ({ days,hours, minutes, seconds, completed }:any) => {
    return <ColumnCenter>
      <TextEqure fontColor={'#fff'} fontSize={20} fontWeight={'800'}>Countdown</TextEqure>
      <TextEqure fontColor={'#fff'} fontSize={34} fontWeight={'800'}>{days * 24 + hours} : {minutes} : {seconds}</TextEqure>
    </ColumnCenter>
  };
  return <CountDownView>
    <Countdown date={1637834400000} renderer={renderer}/>
  </CountDownView>
}

function StakeButtons({unlockInfo}:any){
  const [show,setShow] = useState(false)
  const title = useRef<string>('')
  const {chainId} = useContext(NetworkTypeContext);
  const {account} = useContext(WalletAddressContext);
  const network = ChainId[chainId];
  const [approval, approveCallback] = useApprove(ContractConfig.ETH_CREDA_LP[network]?.address, ContractConfig.CREDA[network]?.address)
  return <RowBetween>
    <GradientButton style={{flex:1}} onClick={()=>{
      if(approval!==ApprovalState.APPROVED){
        // message.warning("Need Approve")
        approveCallback()
        return
      }
      title.current = 'Stake'
      setShow(true)
    }}>{approval!==ApprovalState.APPROVED?"Approve":"Stake"}</GradientButton>
    <SpaceWidth width={32} widthApp={16}/>
    <GradientButton style={{flex:1}} onClick={()=>{
      title.current = 'UnStake'
      setShow(true)
    }}>Unstake</GradientButton>
    <StakeModal
        title={title.current}
        isOpen={show}
        onDismiss={()=>{
      setShow(false)
    }}
        data={unlockInfo}
    />
  </RowBetween>
}
export default Vault;

function CalculaterModal({visible=false,onClose}:any) {
  const themeDark = useTheme()
  if(!visible){
    return null
  }
  return (
      <FlexViewCenter
        style={{position:"fixed",left:0,top:0,right:0,bottom:0,backgroundColor:colors.bg_modal, zIndex:999}}
      >
        <CalcView
          themeDark={Boolean(themeDark)}
        >
          <FlexViewBetween>
            <ThemeText fontSize={28} fontWeight={'bold'}>Unlock Calculator</ThemeText>

            <CustomIcon
                src={ImageCommon.icon_calc_close}
                size={isMobile?15:30}
                onClick={onClose}
            ></CustomIcon>
          </FlexViewBetween>
          <LocakAmount
              themeDark={Boolean(themeDark)}
            marginTop={isMobile?"24px":"58px"}
            marginBottom={isMobile?"10px":"40px"}
          >
            <Text fontColor={themeDark?"#131416":"#FFFFFF"} fontSize={28} fontWeight={'bold'}>Locked amount</Text>
            <Text fontColor={themeDark?"#131416":"#FFFFFF"} fontSize={30} fontWeight={'bold'}>1234</Text>
          </LocakAmount>
          <Text
              fontColor={"#777E90"} fontSize={20} fontWeight={'500'}>Recommended LP</Text>
          <FlexViewBetween
            marginTop={isMobile?"10px":"20px"}
          >
            <LpLeft
                themeDark={Boolean(themeDark)}
            >
              <Text fontColor={themeDark?"#777E90":"#FFFFFF"} fontSize={30} fontWeight={'bold'}>1118.03398875</Text>
              <Text fontColor={themeDark?"#131416":"#FFFFFF"} fontSize={24} fontWeight={'bold'}>1234</Text>
            </LpLeft>
            <CustomIcon
                style={{margin:isMobile?"0 5px":"0 10px"}}
              src={ImageCommon.icon_calc_exchange}
              size={isMobile?20:40}
            ></CustomIcon>
            <LpRight
                themeDark={Boolean(themeDark)}
            >
              <LocakAmount
                  themeDark={Boolean(themeDark)}
              >
                <Text fontColor={themeDark?"#131416":"#FFFFFF"} fontSize={30} fontWeight={'bold'}>1234</Text>
                <Text fontColor={themeDark?"#131416":"#FFFFFF"} fontSize={30} fontWeight={'bold'}>CREDA</Text>
              </LocakAmount>
              <RowBetween
                padding={isMobile?"5px 10px":"15px 30px"}
              >
                <Text
                    style={{whiteSpace:"pre-wrap",width:"80px",lineHeight:"1"}}
                    fontColor={themeDark?"#777E90":"#FFFFFF"} fontSize={24} fontWeight={'400'}>3,669.2
                  611464</Text>
                <Text fontColor={themeDark?"#777E90":"#FFFFFF"} fontSize={30} fontWeight={'400'}>USDT</Text>
              </RowBetween>
              <CustomIcon
                  style={{position:'absolute',left:'50%',top:'50%',marginLeft:isMobile?"-10px":"-20px",marginTop:isMobile?"-10px":"-20px"}}
                  src={ImageCommon.icon_calc_add}
                  size={isMobile?20:40}
              ></CustomIcon>
            </LpRight>
          </FlexViewBetween>
          <FlexViewBetween
            marginTop={isMobile?"19px":"38px"}
          >
            <BaseView>
              <BaseView>
                <Text fontColor={"#777E90"} fontSize={20} fontWeight={'500'}>Unlock speed <Text fontColor={"#4F56FF"} fontSize={20} fontWeight={'500'}>0.02272727</Text> O3/block</Text>
              </BaseView>
              <Text fontColor={"#777E90"} fontSize={20} fontWeight={'500'}>Unlock time <Text fontColor={"#4F56FF"} fontSize={20} fontWeight={'500'}>48.03</Text> hours</Text>
            </BaseView>
            <GetLp>Get LP</GetLp>
          </FlexViewBetween>
        </CalcView>

      </FlexViewCenter>
  )
}

function CreditAccount() {
  const {chainId} = useContext(NetworkTypeContext);

  const [leftIndex,setLeftIndex] = useState(chainId!==ChainId.esc?0:1)
  const [rightIndex,setRightIndex] = useState(0)
  const leftIcon = useRef(chainId!==ChainId.esc?'USDT':'USDC')
  const themeDark = useTheme()
  const [show,setShow] = useState(false)
  const modalType = useRef('0')

  return <Column>
    <BorrowCollateralModal type={modalType.current} isOpen={show} onDismiss={()=>{setShow(false)}}/>
    <RowBetween style={{
    }}>
      <Segment onSelect={(index:number,icon:string)=>{
          leftIcon.current = icon
          setLeftIndex(index)
        }}/>
      <SegmentRight onSelect={(index:number)=>{
        setRightIndex(index)
      }}/>
    </RowBetween>
    <BGDiv background={themeDark?colors.dark_background:colors.background}>
      {
        rightIndex == 0 ? <RowBetween>
            <ColumnCenter>
              <Text fontColor={'#777E90'} fontSize={28} fontWeight={'500'}>LOAN AVAILABLE</Text>
              <RowFixed>
                <ThemeText fontSize={30} fontWeight={'500'}>0</ThemeText>
                <SmallIconIcon src={ImageToken[leftIcon.current]}/>
              </RowFixed>
            </ColumnCenter>
            <ColumnCenter>
              <Text fontColor={'#777E90'} fontSize={28} fontWeight={'500'}>BORROW</Text>
              <RowFixed>
                <ThemeText fontSize={30} fontWeight={'500'}>0</ThemeText>
                <SmallIconIcon src={ImageToken[leftIcon.current]}/>
              </RowFixed>
            </ColumnCenter>
            <ColumnCenter>
              <Text fontColor={'#777E90'} fontSize={28} fontWeight={'500'}>TOTAL VALUE</Text>
              <RowFixed>
                <ThemeText fontSize={30} fontWeight={'500'}>0</ThemeText>
                <SmallIconIcon src={ImageToken[leftIcon.current]}/>
              </RowFixed>
            </ColumnCenter>
          </RowBetween> : <Column>
            <ThemeText fontSize={20} fontWeight={'bold'}>Manage debt</ThemeText>
            <Progress />
            <RowBetween>
              <GradientGaryButton style={{flex:1}} onClick={()=>{
                // modalType.current = '0'
                // setShow(true)
                message.info('Minimum Credit Network Requirements not met')
              }} >+Borrow</GradientGaryButton>
              <SpaceWidth width={40} widthApp={20}/>
              <GradientGaryButton style={{flex:1}} onClick={()=>{
                //  modalType.current = '1'
                //  setShow(true)
                message.info('Minimum Credit Network Requirements not met')
              }} >-Repay</GradientGaryButton>
            </RowBetween>
        </Column>
      }
    </BGDiv>
  </Column>
}
function Progress(){
  return <ProgressDiv>
    <ProgressPositionDiv progress={0}/>
    <RowCenter style={{height:'100%'}}>
      <ThemeText fontSize={20} fontWeight={'bold'}>Health factor:1</ThemeText>
    </RowCenter>
  </ProgressDiv>
}

const Segment = React.memo(({onSelect}:{onSelect:(index:number,icon:string)=>void})=> {
  const [selectIndex, setSelectIndex] = useState(0)
  const themeDark = useTheme()
  const {chainId} = useContext(NetworkTypeContext);

  return <SegmentDiv style={{
      backgroundColor: themeDark ? '#17181A' : 'white'
  }}>
    {chainId!==ChainId.esc &&<SegmentItem isChoose={selectIndex == 0} onClick={() => {
        setSelectIndex(0)
        onSelect && onSelect(0,'USDT')
    }}><IconIcon src={ImageToken.USDT}/>USDT</SegmentItem>}
    <SegmentItem isChoose={selectIndex == 1} onClick={()=>{
      setSelectIndex(1)
      onSelect && onSelect(1,'USDC')
    }}><IconIcon src={ImageToken.USDC}/>USDC</SegmentItem>
    {chainId!==ChainId.esc &&<SegmentItem isChoose={selectIndex == 2} onClick={()=>{
      setSelectIndex(2)
      onSelect && onSelect(2,'DAI')
    }}><IconIcon src={ImageToken.DAI}/>DAI</SegmentItem>}
  </SegmentDiv>
},()=>{return true})
const SegmentRight = React.memo(({onSelect}:{onSelect:(index:number)=>void})=> {
  const [selectIndex, setSelectIndex] = useState(0)
  const themeDark = useTheme()
  return <SegmentDiv style={{
      backgroundColor: themeDark ? '#17181A' : 'white'
  }}>
    <SegmentItem isChoose={selectIndex == 0} onClick={() => {
        setSelectIndex(0)
        onSelect && onSelect(0)
    }}>STATES</SegmentItem>
    <SegmentItem style={{width:180}} isChoose={selectIndex == 1} onClick={()=>{
      setSelectIndex(1)
      onSelect && onSelect(1)
    }}>MANAGEMENT</SegmentItem>
  </SegmentDiv>
},()=>{return true})
const ProgressDiv = styled(Column)`
  height:50px;
  border-radius:20px;
  background-color:#777E90;
  margin-top:20px;
  @media (max-width: 768px) {
    height:30px;
    border-radius:10px;
    margin-top:10px;
    margin-bottom:10px
  };
  position:relative;
  margin-bottom:20px;
  overflow:hidden
`
const ProgressPositionDiv = styled(Column)<{
  progress:number
}>`
  height:50px;
  background-color:${colors.main};
  @media (max-width: 768px) {
    height:30px;
  };
  width:${({progress})=>`${progress * 100}%`};
  position:absolute;

`
const IconIcon = styled.img`
  width:30px;
  margin-right:10px;
  @media (max-width: 768px) {
    width:20px;
    margin-right:5px;
  }
`
const SmallIconIcon = styled.img`
  width:20px;
  margin-left:5px;
  @media (max-width: 768px) {
    width:15px;
    margin-left:2px;
  }
`
const SegmentDiv = styled(RowFixed)`
  background-color:#17181A;
  height:40px;
  border-radius:20px;
  margin:20px 0px;
  overflow:hidden;
  @media (max-width: 768px) {
    flex:1;
    // width:100%;
    margin:10px 0px;
    border-radius:10px;
    height:30px;
  };
  margin-bottom:0px
`

const SegmentItem = styled(RowCenter)<{
  isChoose?: boolean
}>`
  width:150px;
  background:${({isChoose}) => isChoose ? 'linear-gradient(90deg, #4a1ee1, #1890ff)' : 'transparent'};
  height:100%;
  color:${({isChoose}) => isChoose ? 'white' : '#777E90'};
  align-items:center;
  border-radius:20px;
  font-size:22px;
  font-weight:bold;
  cursor:pointer;
  @media (max-width: 768px) {
    font-size:14px;
    flex:1;
    border-radius:10px;
  };
`

const JoinView = styled(BGDiv)`
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
`
const JoinTitle = styled.div<{color:string}>`
  font-size: 28px;
  font-weight: bold;
  color: ${props=>props.color};
`
const NetworkTitle = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #4F56FF;
  @media (max-width: 768px) {
    font-size: 24px;
  };
`
const LayerTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #777E90;
  // text-align:right;
  white-space: pre;
  @media (max-width: 768px) {
    font-size: 16px;
  };
`
const LayerDesc = styled(LayerTitle)`
font-size: 16px;
  @media (max-width: 768px) {
    font-size: 12px;
  };
`
const LayerPrice = styled.div<{color:string}>`
  font-size: 48px;
  font-weight: bold;
  color: ${props=>props.color};
  line-height: 70px;
  // text-align:center;
  // text-align:right;
  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 40px;
  };
`
const LayerView = styled(RowBetween)`
   @media (max-width: 768px) {
    flex-direction:column;
  };
`
const AnimateImg = styled.img`
   @media (max-width: 768px) {
    width:70%;
    height:auto;
  };
`






const MiningPoolRight = styled(RowFixed)`
  @media (max-width: 768px){
    justify-content:space-between;
    width:100%
  }
`
const MiningPoolRightItem = styled(RowFixed)`
  @media (max-width: 768px){
    flex-direction:column;
    align-items:center
  }
`
const LineH = styled.div`
  height:1px;
  background-color:#2E313A;
  width:100%;
  margin:5px 0px;
  @media (max-width: 768px){
    margin:0px 0px;
  }
`
const MiningLineItem = styled(RowBetween)`
  @media (max-width: 768px){
    flex-direction:column;
    align-items:flex-start
  }
`
const MiningButtonRow = styled(RowEnd)`
  @media (max-width: 768px){
    justify-content:space-between
  }
`
const MiningRowBetweenItem = styled(RowFixed)`
  flex:1;
  @media (max-width: 768px){
    justify-content:space-between;
    width:100%
  };

`
const CalcView = styled.div<{themeDark:boolean}>`
  background: ${props=>props.themeDark?'#17181A':"#FFFFFF"};
  border: 1px solid ${props=>props.themeDark?'#363739':"#FFFFFF"};
  border-radius: 24px;
  width:90%;
  max-width:690px;
  padding:30px;
  @media (max-width: 768px){
   padding:20px;
  };
`
const LocakAmount = styled(FlexViewBetween)<{themeDark:boolean}>`
  height: 80px;
  background: ${props=>props.themeDark?'#FFFFFF':"#17181A"};
  border-radius: 20px;
  padding:0 30px;
  @media (max-width: 768px){
    height: 40px;
    padding:0 15px;
  };
`
const LpLeft = styled(ColumnBetween)<{themeDark:boolean}>`
  height: 160px;
  background: ${props=>props.themeDark?'#FFFFFF':"#17181A"};
  border-radius: 20px;
  padding:30px;
  @media (max-width: 768px){
    height: 80px;
    padding:15px;
    border-radius: 10px;
  };
`
const LpRight = styled(LpLeft)`
  background: #17181A;
  border: 1px solid #363739;
  border-radius: 20px;
  position:relative;
  padding:0;
  
`
const GetLp = styled(Button)`
width: 120px;
height: 40px;
background: #4F56FF;
border-radius: 10px;
border-width:0;
font-size: 24px;
font-weight: 800;
color:#FFFFFF;
padding:0;
@media (max-width: 768px){
    width: 60px;
  height: 20px;
  border-radius: 5px;
  font-size: 12px;
  };
`
