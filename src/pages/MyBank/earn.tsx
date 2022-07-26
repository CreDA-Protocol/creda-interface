import styled from 'styled-components'
import ImageCommon from '../../assets/common/ImageCommon'
import AppBody, {MainFullBody} from '../AppBody'
import Row, {RowBetween, RowCenter, RowFixed, SpaceHeight, SpaceWidth, TextEqure} from '../../components/Row'
import Column, {ColumnCenter} from '../../components/Column'
import {isMobile} from 'react-device-detect';
import React, {useContext, useState} from 'react'
import {
  ApprovalState,
  balanceToBigNumber,
  ChainId,
  formatBalance,
  formatPercent,
  MyBankAssetPriceIcons, tipError
} from "../../common/Common";
import {useTheme} from '../../state/application/hooks'
import {ThemeTextEqure} from '../../components/ThemeComponent'
import {BankTopInfo} from './index'
import Countdown from 'react-countdown'
import {useApprove, useEarnInfo, useEarnResult} from "../../contract";
import ContractConfig, {BankConfig, EarnConfig} from "../../contract/ContractConfig";
import {NetworkTypeContext, WalletAddressContext} from "../../context";
import {LoadingContext, LoadingType} from "../../provider/loadingProvider";
import {TransactionResponse} from "@ethersproject/providers";
import CustomStakeModal from "../../components/CustomStakeModal";
import {useContract} from "../../hooks/useContract";
import {LgWhiteButton, LoadingRow} from "../../components/Common";

const Body = styled(Column)`
  width:100%;
  height:100%;
  padding:0px 15px
`
const IconIcon = styled.img`
  width:30px;
  height:auto;
  margin-right:10px
`
const BGDiv = styled(Column)`
  background-color:#17181A;
  border-radius:24px;
  margin:20px 0px;
  width:100%;
  @media (max-width: 768px) {
    border:1px solid #363739
  };
  position:relative
`
export const DrawButton = styled.div`
  color:white;
  border:1px solid #4E55FF;
  align-items:center;
  justify-content:center;
  height:30px;
  border-radius:15px;
  padding:10px;
  width:100px;
  display:flex;
  flex-direction:row;
  cursor:pointer;
  :hover{
    background-color:#4E55FF;
  };
  @media (max-width: 768px) {
    width:100%;
    flex:1
  }
`
const CountDownView = styled(RowCenter)`
  position:absolute;
  background-color:rgba(0,0,0,0.8);
  width:100%;
  height:100%;
  z-index:10;
  border-radius:24px;
  left:0px;
  top:0px
`
function MyBankEarn(props: any) {
  // const [show,setShow] = useState(true)
  return (
    <MainFullBody history={props.history}>
      <AppBody history={props.history}>
        <Body>
          <BankTopInfo/>
          <Earn/>
        </Body>
      </AppBody>
    </MainFullBody>
  )
}


const LeftIcon = styled.img`
  width:30px;
  @media (max-width: 768px) {
    width:20px;
    margin-right:10px
  };
  margin-right:20px
`
const DownLine = styled.div`
  height:1px;
  background-color:#353945;
  margin:20px 0px
`
const DownCenterView = styled.div`
  display:flex;
  flex-direction:column;
  width:fit-content;
  align-items:center;
  @media (max-width: 768px) {
    align-items:flex-end;
  };
`
const SubView = styled(RowBetween)`
  @media (max-width: 768px) {
    flex-direction:column;
    justify-content:flex-start;
    align-items:flex-start
  }
`
const DownButtonView = styled(Column)`
  @media (max-width: 768px) {
    flex-direction:row;
    width:100%;
    margin-top:10px
  }
`
const DownSubView = styled(Row)`
  @media (max-width: 768px) {
    justify-content:space-between;
    align-items:flex-start
  }
`
export function Earn(){
  const themeDark = useTheme()
  const earnRes = useEarnResult()
  const [info,setInfo] = useState<any>({})
  const [showModal,setShowModal] = useState(false)
  function onAction(info:any) {
    setInfo(info)
    setShowModal(true)
  }

  return <BGDiv style={{
    backgroundColor:themeDark? '#17181A' : 'white',
    padding:isMobile?15:30
  }}>
        {/*<CountDown/>*/}

    <RowFixed>
      <LeftIcon src={ImageCommon.myBank_earn}/>
      <ThemeTextEqure fontSize={24} fontWeight={'bold'}>Earn</ThemeTextEqure>
      <TextEqure style={{marginLeft:10}} fontColor={'#777E90'} fontSize={12} fontWeight={'500'}>(5 Assets)</TextEqure>
    </RowFixed>
    <SpaceHeight height={30} heightApp={0}/>
    {
      !isMobile && <RowBetween>
        <TextEqure style={{flex:1}} fontColor={'#777E90'} fontSize={18} fontWeight={'500'}></TextEqure>
        <TextEqure style={{flex:1}} fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>APY</TextEqure>
        <ColumnCenter style={{flex:1,alignItems:'flex-start'}}>
          <TextEqure fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>Total Supply</TextEqure>
        </ColumnCenter>
        <ColumnCenter style={{flex:1 ,alignItems:'flex-start'}}>
          <TextEqure fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>Total Borrow</TextEqure>
        </ColumnCenter>
        <TextEqure style={{flex:1}} fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>Utilization</TextEqure>
        <TextEqure style={{flex:1}} fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>Balance</TextEqure>
        <TextEqure style={{flex:1}} fontColor={'#777E90'} fontSize={18} fontWeight={'500'}></TextEqure>
      </RowBetween>
    }
    {
      MyBankAssetPriceIcons.map((item:any,index:number)=>{
        return <EarnItem
          item={item}
          themeDark={themeDark}
          earnRes={earnRes}
          onAction={onAction}
        ></EarnItem>
      })
    }
    <CustomStakeModal
        show={showModal}
        onDismiss={()=>setShowModal(false)}
        title={(info.type===ButtonType.deposit?"Deposit ":"Withdraw ")+info.symbol}
        balanceTitle={info.symbol}
        maxNum={info.type===ButtonType.deposit?info.formatBalance:info.cFormatBalance}
        onConfirm={info.type===ButtonType.deposit?info.onDeposit:info.onWithDraw}
    ></CustomStakeModal>
  </BGDiv>
}

export default MyBankEarn;
enum ButtonType {
  deposit=0,
  withdraw=1
}
function EarnItem({item,themeDark,earnRes,onAction}:any) {

  const {chainId} = useContext(NetworkTypeContext);
  const {account} = useContext(WalletAddressContext);
  const network = ChainId[chainId];
  const symbol = item.name
  const [approval, approveCallback] = useApprove(ContractConfig[symbol]?.[network]?.address, EarnConfig[symbol]?.[network]?.cToken?.address)
  const info = useEarnInfo(item.name,earnRes)
  const loading = useContext(LoadingContext)
  const cTokenContract = useContract(EarnConfig[symbol]?.[network]?.cToken?.address,EarnConfig[symbol]?.[network]?.cToken?.abi)

  function action(type:ButtonType) {
    if(approval!==ApprovalState.APPROVED){
      approveCallback()
      return
    }
    info.symbol=item.name
    info.type=type
    info.onDeposit = deposit
    info.onWithDraw = withdraw
    onAction && onAction(info)
  }
  function deposit(amount:string) {
    // console.log(amount,info.decimals)
    loading.show(LoadingType.confirm, `Deposit ${info.symbol}`)
    cTokenContract?.deposit(balanceToBigNumber(amount,info.decimals))
        .then(async (response: TransactionResponse) => {
          loading.show(LoadingType.pending, response.hash)
          // addTransaction(response, {
          //   summary: `Deposit ${daiInfo.symbol}`,
          // })
          await response.wait();
          loading.show(LoadingType.success, response.hash)
        })
        .catch((err: any) => {
          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            // addToast(ToastStatus.error,err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          // addToast(ToastStatus.error,err.data?.message)
          tipError(err)
        })
  }
  function withdraw(amount:string) {
    loading.show(LoadingType.confirm, `Withdraw ${info.symbol}`)
    cTokenContract?.withdraw(balanceToBigNumber(amount,info.decimals))
        .then(async (response: TransactionResponse) => {
          loading.show(LoadingType.pending, response.hash)
          // addTransaction(response, {
          //   summary: `Withdraw ${daiInfo.symbol}`,
          // })
          await response.wait();
          loading.show(LoadingType.success, response.hash)
        })
        .catch((err: any) => {

          if(err.code===4001){
            loading.show(LoadingType.error, err.reason || err.message)
            // addToast(ToastStatus.error,err.message)
            return
          }
          loading.show(LoadingType.error, err.reason || err.message)
          // addToast(ToastStatus.error,err.data?.message)
          tipError(err)
        })
  }
  if(info.loading){
    return <LoadingRow width={"auto"}></LoadingRow>
  }
  return <Column>
    <DownLine/>
    <SubView>
      <RowFixed style={{flex:1,marginBottom:isMobile?10:0}}>
        <IconIcon src={item.icon}/>
        <ThemeTextEqure fontSize={20} fontWeight={'400'}>c{item.name}</ThemeTextEqure>
      </RowFixed>
      <DownSubView style={{flex:1}}>
        {
          isMobile && <TextEqure style={{width:100}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>APY</TextEqure>
        }
        <ThemeTextEqure fontSize={22} fontWeight={'400'}>{info.loading?"-":formatPercent(info.savingsApy)}</ThemeTextEqure>
      </DownSubView>
      <DownSubView style={{flex:1}}>
        {
          isMobile && <TextEqure style={{width:100}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Total Supply</TextEqure>
        }
        <ColumnCenter style={{alignItems:isMobile ? 'flex-end' : 'flex-start'}}>
          <DownCenterView>
            <ThemeTextEqure fontSize={22} fontWeight={'400'}>${info.loading?"-":formatBalance(info.cFormatTvl)}</ThemeTextEqure>
            {/*<TextEqure fontColor={'#777E90'} fontSize={20}>-</TextEqure>*/}
          </DownCenterView>
        </ColumnCenter>
      </DownSubView>
      <DownSubView style={{flex:1}}>
        {
          isMobile && <TextEqure style={{width:100}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Total Borrow</TextEqure>
        }
        <ColumnCenter style={{alignItems:isMobile ? 'flex-end' : 'flex-start'}}>
          <DownCenterView>
            <ThemeTextEqure fontSize={22} fontWeight={'400'}>$0</ThemeTextEqure>
            {/*<TextEqure fontColor={'#777E90'} fontSize={20}>-</TextEqure>*/}
          </DownCenterView>
        </ColumnCenter>
      </DownSubView>
      <DownSubView style={{flex:1}}>
        {
          isMobile && <TextEqure style={{width:100}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Utilization</TextEqure>
        }
        <ThemeTextEqure fontSize={22} fontWeight={'400'}>0%</ThemeTextEqure>
      </DownSubView>
      <DownSubView style={{flex:1}} >
        {
          isMobile && <TextEqure style={{width:100}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Balance</TextEqure>
        }
        <ThemeTextEqure fontSize={22} fontWeight={'400'}>{info.loading?"-":formatBalance(info.cFormatBalance)}</ThemeTextEqure>
      </DownSubView>
      <DownButtonView style={{flex:1}}>
        <DrawButton
            style={{color: themeDark? 'white' : '#17181A'}}
            onClick={()=>action(ButtonType.deposit)}
        >{approval===ApprovalState.APPROVED?"SUPPLY":"Approve"}</DrawButton>
        <SpaceHeight height={20} heightApp={0}/>
        <SpaceWidth width={0} widthApp={20}/>
        <DrawButton style={{color: themeDark? 'white' : '#17181A'}}
                    onClick={()=>action(ButtonType.withdraw)}
        >Withdraw</DrawButton>
      </DownButtonView>
    </SubView>
  </Column>
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
