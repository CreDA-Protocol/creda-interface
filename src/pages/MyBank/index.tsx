import ImageCommon from '@assets/common/ImageCommon'
import ImageToken from '@assets/tokens/ImageToken'
import { Column } from '@components/Column'
import { BaseView, CardPair, FlexView, LgWhiteButton, LoadingRow, MobileView, WinView } from '@components/Common'
import { H4, HeaderView } from "@components/ConnectWallet"
import CustomStakeModal from "@components/CustomStakeModal"
import {
  GradientButton,
  RowBetween,
  RowCenter,
  RowEnd,
  RowFixed,
  SpaceHeight,
  Text,
  TextEqure
} from '@components/Row'
import { ThemeText, ThemeTextEqure } from '@components/ThemeComponent'
import { TransactionResponse } from "@ethersproject/providers"
import AppBody, { MainFullBody } from '@pages/components/AppBody'
import { useDaInfo, useMarketsResult } from '@services/banking.service'
import { chainFromId } from "@services/chain.service"
import { useContract } from "@services/contracts.service"
import { getNFTCardBgImage, useCNFTInfo } from '@services/credit.service'
import { useApprove } from '@services/tokens.service'
import { Badge, Skeleton } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import {
  ApprovalState,
  balanceToBigNumber,
  formatBalance,
  formatPercent,
  platforms,
  tipError
} from "../../common/Common"
import { NetworkTypeContext, WalletAddressContext } from "../../contexts"
import ContractConfig, { BankConfig, EarnConfig } from "../../contract/ContractConfig"
import { LoadingContext, LoadingType } from "../../provider/LoadingProvider"
import { useOpenWarning, useTheme } from '../../states/application/hooks'
import { useAddToast } from "../../states/toast"
import { useTransactionAdder } from "../../states/transactions/hooks"
import { Earn } from './earn'

const Body = styled(Column)`
  width:100%;
  height:100%;
  padding:0px 15px
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
const TopLeftDiv = styled(Column)`
  width:314px;
  height:177px;
  border-radius:24px;
  background-color:#4E55FF;
  padding:30px;
  @media (max-width: 768px) {
    flex:1;
    border-radius:12px;
    margin-bottom:15px;
    padding:20px;
    width:100%
  };
  margin-bottom:40px;
  position:relative
`
const TopRightDiv = styled(TopLeftDiv)`
  background-color:#000000;
`
const SegmentDiv = styled(RowFixed)`
  background-color:#17181A;
  height:40px;
  border-radius:20px;
  margin:20px 0px;
  @media (max-width: 768px) {
    flex:1;
    // width:100%;
    margin:15px 15px
  };
  margin-bottom:0px
`
const LineH = styled.div`
  height:1px;
  background-color:#2E313A;
  width:100%;
  margin:30px 0px;
  margin-top:0px
`
const LinePH = styled.div`
  height:1px;
  background-color:#2E313A;
  width:100%;
  margin:20px 0px;
`
const SegmentItem = styled(RowCenter) <{
  isChoose?: boolean
}>`
  background:${({ isChoose }) => isChoose ? 'linear-gradient(90deg, #4a1ee1, #1890ff)' : 'transparent'};
  height:100%;
  color:${({ isChoose }) => isChoose ? 'white' : '#777E90'};
  align-items:center;
  border-radius:20px;
  font-size:22px;
  font-weight:bold;
  cursor:pointer;
  @media (max-width: 768px) {
    font-size:17px;
    flex:1;
    padding:0 10px
  };
  padding:0 20px;
  width:fit-content
`
const IconIcon = styled.img`
  width:16px;
  height:auto;
  margin-right:10px
`
const IconIconT = styled.img`
  width:24px;
  height:auto;
  margin-right:10px
`
const SwitchIcon = styled.img`
  width:64px;
  height:auto;
  margin-right:10px;
  cursor:pointer;
`
const BGDiv = styled(Column)`
  background-color:#17181A;
  border-radius:24px;
  margin:20px 0px;
  width:100%;
  @media (max-width: 768px) {
    border:1px solid #363739
  }
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
  }
`
const GoButton = styled.div`
  color:white;
  align-items:center;
  justify-content:center;
  height:30px;
  border-radius:15px;
  padding:10px;
  // width:100px;
  display:flex;
  flex-direction:row;
  background-color:#4E55FF;
  cursor:pointer;
  @media (max-width: 768px) {
    font-sizze:14px;
  }
`
const TopDiv = styled(RowBetween)`
  @media (max-width: 768px) {
    flex-direction:column
  }
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
const PositionButton = styled(GradientButton)`
  border-radius:10px;
  font-size:14px;
  padding:0px 10px;
  cursor:pointer;
  @media (max-width: 768px) {
    width:100%
  };
  width:100px;
`

enum ButtonType {
  deposit = 0,
  withdraw = 1
}

function MyBank(props: any) {
  const showWarning = useOpenWarning(true)
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const bankInfo = useMarketsResult();
  const [showModal, setShowModal] = useState(false)
  const [info, setInfo] = useState<any>({})
  useEffect(() => {
    showWarning()
  }, [])

  function onAction(info: any) {
    setInfo(info)
    setShowModal(true)
  }

  return (
    <MainFullBody history={props.history}>
      <AppBody history={props.history}>
        <Body>
          <BankTopInfo />
          <MyPostion />
          <Earn />
          <BottomAction
            symbol={"USDT"}
            bankInfo={bankInfo}
            onAction={onAction}
          ></BottomAction>
          <BottomAction
            symbol={"USDC"}
            bankInfo={bankInfo}
            onAction={onAction}
          ></BottomAction>
          <BottomAction
            symbol={"WBTC"}
            bankInfo={bankInfo}
            onAction={onAction}
          ></BottomAction>
          <BottomAction
            symbol={"DAI"}
            bankInfo={bankInfo}
            onAction={onAction}
          ></BottomAction>
        </Body>
      </AppBody>
      <CustomStakeModal
        show={showModal}
        onDismiss={() => setShowModal(false)}
        title={(info.type === ButtonType.deposit ? "Deposit " : "Withdraw ") + info.symbol}
        balanceTitle={info.symbol}
        maxNum={info.type === ButtonType.deposit ? info.formatBalance : info.cFormatBalance}
        onConfirm={info.type === ButtonType.deposit ? info.onDeposit : info.onWithDraw}
      ></CustomStakeModal>
    </MainFullBody>
  )
}

export function BankTopInfo() {
  const { chainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);
  const themeDark = useTheme()
  const cnftInfo = useCNFTInfo()
  return <>
    <RowBetween style={{
      paddingLeft: isMobile ? 15 : 30,
      paddingBottom: isMobile ? 20 : 40
    }}>
      <FlexView>
        <ThemeTextEqure fontSize={32} fontWeight={'bold'}>Bank Overview</ThemeTextEqure>
        {/*<SpaceWidth width={30} widthApp={15}/>*/}
        {/*<AddressText fontColor={'#777E90'} fontSize={14} fontWeight={'bold'}>0x8769b23dg83d6e27724ae45b550j745e5b7858dc</AddressText>*/}
        {/*<CopyIcon onClick={()=>{*/}
        {/*  copy('0x8769b23dg83d6e27724ae45b550j745e5b7858dc')*/}
        {/*  message.success('copy success')*/}
        {/*}} src={ImageCommon.CopyIcon}/>*/}
      </FlexView>
      <HeaderView>
        <H4>{network}</H4>
      </HeaderView>
    </RowBetween>
    <TopDiv>
      <TopLeftDiv>
        <TextEqure fontColor={'#BBBDFF'} fontSize={18}>Total Supply</TextEqure>
        <SpaceHeight height={20} heightApp={10} />
        <TextEqure fontColor={'white'} fontSize={40} fontWeight={'bold'}>${formatBalance(0)}</TextEqure>
      </TopLeftDiv>
      <TopLeftDiv style={{
        backgroundColor: themeDark ? '#17181A' : 'white'
      }}>
        <TextEqure fontColor={'#BBBDFF'} fontSize={18}>Total Borrow</TextEqure>
        <SpaceHeight height={20} heightApp={10} />
        <ThemeTextEqure fontSize={40} fontWeight={'bold'}>${formatBalance(0)}</ThemeTextEqure>
      </TopLeftDiv>
      <TopLeftDiv style={{
        backgroundColor: 'transparent'
      }}>
        <NFTBgImage src={getNFTCardBgImage(cnftInfo.lv)} />
        {cnftInfo.loading ? <Column style={{ zIndex: 1 }}><Skeleton active paragraph={{ rows: 2 }} /></Column> :
          <Column style={{ zIndex: 1 }}>
            <TextEqure fontSize={18}>Credit NFT</TextEqure>
            <SpaceHeight height={20} heightApp={10} />
            <RowFixed>
              <TextEqure fontSize={12}>Level</TextEqure>
              <ThemeTextEqure style={{ marginLeft: 20 }} fontSize={24}
                fontWeight={'bold'}>{cnftInfo.loading ? "-" : cnftInfo.lv}</ThemeTextEqure>
            </RowFixed>
            <RowFixed>
              <TextEqure fontSize={12}>NO.</TextEqure>
              <ThemeTextEqure style={{ marginLeft: 20 }} fontSize={24}
                fontWeight={'bold'}>{cnftInfo.loading ? "-" : cnftInfo.no}</ThemeTextEqure>
            </RowFixed>
          </Column>}
      </TopLeftDiv>
    </TopDiv>
  </>
}
const PositionItem = styled(RowBetween)`
  @media (max-width: 768px) {
    flex-direction:column;
    width:100%;
  }
`
const PositionSubItem = styled(Column)`
  @media (max-width: 768px) {
    flex-direction:row;
    width:100%;
    justify-content:space-between
  }
`
const PositionButtonRow = styled(RowFixed)`
  @media (max-width: 768px) {
    width:100%
  }
`
const LeftIcon = styled.img`
  width:30px;
  @media (max-width: 768px) {
    width:20px;
    margin-right:10px
  };
  margin-right:20px
`
const AccountSegment = React.memo(() => {
  const [selectIndex, setSelectIndex] = useState(0)
  const themeDark = useTheme()
  return <RowCenter>
    <SegmentDiv style={{
      backgroundColor: themeDark ? '#000' : 'white'
    }}>
      <SegmentItem isChoose={selectIndex == 0} onClick={() => {
        setSelectIndex(0)
      }}>Credit Account</SegmentItem>
      <SegmentItem isChoose={selectIndex == 1} onClick={() => {
        setSelectIndex(1)
      }}>Wallet Account</SegmentItem>
    </SegmentDiv>
  </RowCenter>
}, () => { return true })

function MyPostion() {
  const themeDark = useTheme()
  return <BGDiv style={{
    backgroundColor: themeDark ? '#17181A' : 'white',
    padding: isMobile ? 10 : 20
  }}>
    <RowFixed>
      <LeftIcon src={ImageCommon.myposition} />
      <ThemeTextEqure fontSize={24} fontWeight={'bold'}>Your Positions</ThemeTextEqure>
    </RowFixed>
    <AccountSegment />
    <SpaceHeight height={20} heightApp={10} />
    <RowCenter>
      <ThemeText fontSize={28} fontWeight={'400'}>You don't have any active positions</ThemeText>
    </RowCenter>
    {/* {
      !isMobile && <RowBetween>
        <Text style={{flex: 1,textAlign:'center'}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Pool</Text>
        <Text style={{flex: 1,textAlign:'center'}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Borrow</Text>
        <Text style={{flex: 1.2,textAlign:'center'}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Position Value</Text>
        <Text style={{flex: 1.2,textAlign:'center'}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Debt Ratio</Text>
        <Text style={{flex: 1}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>APY</Text>
        <Text style={{flex: 1}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Reward</Text>
        <Text style={{flex: 1.5,textAlign:'center'}} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Actions</Text>
      </RowBetween>
    }
    {
      [1,2].map((item,index)=>{
        return <>
          <LinePH/>
          <PositionItem>
            <PositionSubItem style={{flex: 1}}>
              {
                isMobile && <TextEqure fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Pool</TextEqure>
              }
              <RowFixed>
                <CardPair pair1={"CREDA"} pair2={'USDT'}/>
                <SpaceWidth width={10} widthApp={5}/>
                <ColumnFixed>
                  <ThemeTextEqure fontSize={14} fontWeight={'400'}>Trader joe</ThemeTextEqure>
                  <ThemeTextEqure fontSize={14} fontWeight={'400'}>CREDA/USDT</ThemeTextEqure>
                </ColumnFixed>
              </RowFixed>
            </PositionSubItem>
            <PositionSubItem style={{flex: 1,alignItems:'center'}}>
              {
                isMobile && <TextEqure fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Borrow</TextEqure>
              }
              <ThemeTextEqure fontSize={14} fontWeight={'400'}>$173.40</ThemeTextEqure>
            </PositionSubItem>
            <PositionSubItem style={{flex: 1.2,alignItems:'center'}}>
              {
                isMobile && <TextEqure fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Position Value</TextEqure>
              }
              <ThemeTextEqure fontSize={14} fontWeight={'400'}>$281.82</ThemeTextEqure>
            </PositionSubItem>
            <PositionSubItem style={{flex: 1.2,alignItems:'center'}}>
              {
                isMobile && <TextEqure fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Debt Ratio</TextEqure>
              }
              <ThemeTextEqure fontSize={14} fontWeight={'400'}>79.54%</ThemeTextEqure>
            </PositionSubItem>
            <PositionSubItem style={{flex: 1}}>
              {
                isMobile && <TextEqure fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>APY</TextEqure>
              }
              <ThemeTextEqure fontSize={14} fontWeight={'400'}>$173.40</ThemeTextEqure>
            </PositionSubItem>
            <PositionSubItem style={{flex: 1}}>
              {
                isMobile && <TextEqure fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Reward</TextEqure>
              }
              <ColumnFixed style={{alignItems:isMobile?'flex-end' : 'center'}}>
                <ThemeTextEqure fontSize={14} fontWeight={'400'}>$173.40</ThemeTextEqure>
                <TextEqure fontColor={'#777E90'} fontSize={14}>($0.000012)</TextEqure>
              </ColumnFixed>
            </PositionSubItem>
            <Column style={{flex: 1.5,width:isMobile?'100%':'fit-content'}}>
              <PositionButtonRow>
                <PositionButton
                    onClick={() => {}}
                >ADD</PositionButton>
                <SpaceWidth width={10} widthApp={10}/>
                <PositionButton
                    onClick={() => {}}
                >REMOVE</PositionButton>
              </PositionButtonRow>
              <SpaceHeight height={10} heightApp={10}/>
              <PositionButtonRow>
                <PositionButton
                    onClick={() => {}}
                >CLOSE</PositionButton>
                <SpaceWidth width={10} widthApp={10}/>
                <PositionButton
                    onClick={() => {}}
                >HARVEST</PositionButton>
              </PositionButtonRow>
            </Column>
          </PositionItem>
        </>
      })
    } */}
  </BGDiv>
}
function BottomAction({ symbol, bankInfo, onAction }: any) {

  const themeDark = useTheme()
  return <BGDiv style={{
    backgroundColor: themeDark ? '#17181A' : 'white'
  }}>
    <Badge.Ribbon text="InActive" color="grey">
      <RowFixed style={{ padding: isMobile ? 15 : 30 }}>
        <IconIconT src={ImageToken[symbol]} />
        <Column>
          <ThemeTextEqure fontSize={30} fontWeight={'400'}>{symbol} </ThemeTextEqure>
          <ThemeTextEqure fontSize={15} fontWeight={'400'}>(SoftLaunch Limit:$1000)</ThemeTextEqure>
        </Column>
      </RowFixed>
      <LineH />
      <RowBetween style={{ padding: isMobile ? 15 : 30, paddingTop: 0 }}>
        <Text style={{ flex: 1 }} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Platform</Text>
        {
          <Text style={{ flex: 1 }} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Reward APR</Text>
        }
        {
          !isMobile &&
          <Text style={{ flex: 1 }} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>TVL</Text>
        }
        {!isMobile &&
          <Text style={{ flex: 1 }} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Reward</Text>}
        {
          <Text style={{ flex: 1 }} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Deposited</Text>
        }
        <Text style={{ flex: 1.5, textAlign: 'right' }} fontColor={'#777E90'} fontSize={20}
          fontWeight={'500'}></Text>
      </RowBetween>
      {
        Object.values(platforms).map((item: any, index: number) => {
          return <DaiItem
            item={item}
            symbol={symbol}
            bankInfo={bankInfo}
            onAction={onAction}
          ></DaiItem>
        })
      }
    </Badge.Ribbon>
  </BGDiv>
}

function DaiItem({ item, symbol, bankInfo, onAction }: any) {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const loading = useContext(LoadingContext)
  const daiInfo = useDaInfo(symbol, bankInfo)
  const [approval, approveCallback] = useApprove(ContractConfig[symbol]?.[network]?.address, BankConfig[symbol]?.[network]?.cToken?.address)
  const [mapproval, mapproveCallback] = useApprove(BankConfig[symbol]?.[network]?.cToken?.address, EarnConfig[symbol]?.[network]?.cToken?.address)
  const addTransaction = useTransactionAdder();
  const addToast = useAddToast();
  const cTokenContract = useContract(BankConfig[symbol]?.[network]?.cToken?.address, BankConfig[symbol]?.[network]?.cToken?.abi)
  const migrateContract = useContract(EarnConfig[symbol]?.[network]?.cToken?.address, EarnConfig[symbol]?.[network]?.cToken?.abi)
  const themeDark = useTheme()

  function action(type: ButtonType) {
    if (approval !== ApprovalState.APPROVED) {
      approveCallback()
      return
    }
    daiInfo.symbol = symbol
    daiInfo.type = type
    daiInfo.onDeposit = deposit
    daiInfo.onWithDraw = withdraw
    onAction && onAction(daiInfo)
  }

  function migrate() {
    if (mapproval !== ApprovalState.APPROVED) {
      mapproveCallback()
      return
    }
    loading.show(LoadingType.confirm, `Migrate`)
    migrateContract?.migrate()
      .then(async (response: TransactionResponse) => {
        loading.show(LoadingType.pending, response.hash)
        await response.wait();
        loading.show(LoadingType.success, response.hash)
      })
      .catch((err: any) => {
        if (err.code === 4001) {
          loading.show(LoadingType.error, err.reason || err.message)
          return
        }
        loading.show(LoadingType.error, err.reason || err.message)
        tipError(err)
      })
  }

  function deposit(amount: string) {
    loading.show(LoadingType.confirm, `Deposit ${daiInfo.symbol}`)
    cTokenContract?.deposit(balanceToBigNumber(amount, daiInfo.decimals))
      .then(async (response: TransactionResponse) => {
        loading.show(LoadingType.pending, response.hash)
        // addTransaction(response, {
        //   summary: `Deposit ${daiInfo.symbol}`,
        // })
        await response.wait();
        loading.show(LoadingType.success, response.hash)
      })
      .catch((err: any) => {
        if (err.code === 4001) {
          loading.show(LoadingType.error, err.reason || err.message)
          // addToast(ToastStatus.error,err.message)
          return
        }
        loading.show(LoadingType.error, err.reason || err.message)
        // addToast(ToastStatus.error,err.data?.message)
        tipError(err)
      })
  }

  function withdraw(amount: string) {
    loading.show(LoadingType.confirm, `Withdraw ${daiInfo.symbol}`)
    cTokenContract?.withdraw(balanceToBigNumber(amount, daiInfo.decimals))
      .then(async (response: TransactionResponse) => {
        loading.show(LoadingType.pending, response.hash)
        // addTransaction(response, {
        //   summary: `Withdraw ${daiInfo.symbol}`,
        // })
        await response.wait();
        loading.show(LoadingType.success, response.hash)
      })
      .catch((err: any) => {

        if (err.code === 4001) {
          loading.show(LoadingType.error, err.reason || err.message)
          // addToast(ToastStatus.error,err.message)
          return
        }
        loading.show(LoadingType.error, err.reason || err.message)
        // addToast(ToastStatus.error,err.data?.message)
        tipError(err)
      })
  }
  if (daiInfo.loading) {
    return <BaseView
      style={{ padding: isMobile ? 15 : 30, paddingTop: 0 }}
    >
      <LoadingRow width={"auto"}></LoadingRow>
    </BaseView>
  }
  return (
    <>
      <RowBetween style={{ padding: isMobile ? 15 : 30, paddingTop: 0 }}>
        <RowFixed style={{ flex: 1 }}>
          <IconIcon src={item.icon} />
          <ThemeText fontSize={14} fontWeight={'400'}>{item.title}</ThemeText>
        </RowFixed>
        {
          <ThemeText style={{ flex: 1 }} fontSize={26}
            fontWeight={'400'}>{item.title !== platforms.Wepiggy.title ? "-" : daiInfo.loading ? "-" : formatPercent(daiInfo.savingsApy / 100)}</ThemeText>
        }
        {
          !isMobile && <ThemeText style={{ flex: 1 }} fontSize={26}
            fontWeight={'400'}>{item.title !== platforms.Wepiggy.title ? "-" : daiInfo.loading ? "-" : '$' + formatBalance(daiInfo.cFormatTvl, 2)}</ThemeText>
        }
        {/*<ThemeText style={{flex:1}} fontSize={26} fontWeight={'400'}></ThemeText>*/}
        {!isMobile && <RowFixed style={{ flex: 1 }}>
          <CardPair
            pair1={"CREDA"}
            pair2={symbol}
          ></CardPair>
        </RowFixed>}
        {
          <ThemeText style={{ flex: 1 }} fontSize={26}
            fontWeight={'400'}>{item.title !== platforms.Wepiggy.title ? "-" : daiInfo.loading ? "-" : formatBalance(daiInfo.cFormatBalance)}</ThemeText>
        }
        <WinView
          style={{ flex: 1.5 }}
        >
          {item.title === platforms.Wepiggy.title ? <RowEnd>
            <ApproveBtn>
              <GradientButton
                onClick={migrate}
              >{mapproval === ApprovalState.APPROVED ? "Migrate" : "Approve"}</GradientButton>
            </ApproveBtn>
            <LgWhiteButton
              onClick={() => action(ButtonType.withdraw)} style={{
                marginLeft: '10px',
                background: themeDark ? "#FFFFFF" : "#1890ff",
                color: themeDark ? "#4E55FF" : "#FFFFFF"
              }}
            >Withdraw</LgWhiteButton>
          </RowEnd> : <RowEnd>
            <GradientButton style={{ padding: '0 10px', fontSize: 14 }}>Coming Soon</GradientButton>
          </RowEnd>}
        </WinView>
      </RowBetween>
      <MobileView
        style={{ marginBottom: "20px" }}
      >
        {item.title === platforms.Wepiggy.title ? <RowCenter style={{ flex: 1.5 }}>
          <ApproveBtn>
            <GradientButton
              onClick={migrate}
            >{mapproval === ApprovalState.APPROVED ? "Migrate" : "Approve"}</GradientButton>
          </ApproveBtn>
          <LgWhiteButton
            onClick={() => action(ButtonType.withdraw)} style={{
              marginLeft: '10px',
              background: themeDark ? "#FFFFFF" : "#1890ff",
              color: themeDark ? "#4E55FF" : "#FFFFFF"
            }}
          >Withdraw</LgWhiteButton>
        </RowCenter> : <RowCenter style={{ flex: 1.5 }}>
          <GradientButton style={{ padding: '0 10px', fontSize: 14 }}>Coming Soon</GradientButton>
        </RowCenter>}
      </MobileView>
    </>
  )
}

export default MyBank;
const ApproveBtn = styled.span`

`
