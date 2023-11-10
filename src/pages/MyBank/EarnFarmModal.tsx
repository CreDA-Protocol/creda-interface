import ImageCommon from '@assets/common/ImageCommon';
import { ButtonNormal } from '@components/Button';
import { Column, ColumnCenter } from '@components/Column';
import { CardPair, LoadingRow } from '@components/Common';
import Modal from '@components/NormalModal';
import { RowBetween, RowCenter, RowFixed, SpaceHeight, Text } from '@components/Row';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { useIconPrice, useWalletInfo } from '@services/banking.service';
import { chainFromId } from "@services/chain.service";
import { useContract } from "@services/contracts.service";
import { useApprove } from '@services/tokens.service';
import { message } from 'antd';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ApprovalState,
  balanceToBigNumber,
} from "../../common/Common";
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";
import ContractConfig from "../../contract/ContractConfig";
import { LoadingContext, LoadingType } from "../../provider/LoadingProvider";
import { useTheme } from '../../states/application/hooks';

export const DrawButton = styled.div`
  color:white;
  align-items:center;
  justify-content:center;
  height:30px;
  border-radius:15px;
  padding:10px;
  width:100px;
  display:flex;
  flex-direction:row;
  cursor:pointer;
  background-color:#4E55FF;
  @media (max-width: 768px) {
    width:fit-content;
  };
  :hover{
    color:#4E55FF;
    background-color:transparent;
    border:1px solid #4E55FF
  };
  :active{
    background-color:#4E55FF;
    color:white;
  }
`
const MainView = styled(ColumnCenter)`
  border:1px solid #363739;
  background-color:#131416;
  width:fit-content;
  border-radius:20px;
  @media (max-width: 768px) {
    border-radius:10px;
    padding:15px;
    max-height:80%
  };
  padding:30px;
  overflow-y:scroll;
  ::-webkit-scrollbar{
  　width:0;
　}

`
const Container = styled.div`
  display:flex;
  width:750px;
  height:600px;
  flex-direction:column;
  @media (max-width: 768px) {
    width:94%;
    height:500px;
  };
  overflow-y:scroll;
  ::-webkit-scrollbar{
  　width:0;
　}
`
const Line = styled.div`
  padding:0.5px 0px;
  background-color:#353945;
  margin:20px 0px;
  @media (max-width: 768px) {
    margin:10px 0px;
  }
`
const ArrowRight = styled.img`
  width:24px;
  margin:0px 10px;
  @media (max-width: 768px) {
    width:12px;
    margin:0px 5px
  }
`
const ArrowLeft = styled.img`
  height:27px;
  margin-right:30px;
  @media (max-width: 768px) {
    height:14px;
    margin-right:15px
  }
`
const Cricle = styled.div`
  height:20px;
  width:20px;
  margin:10px;
  background-color:#353945;
  border-radius:50%;
  @media (max-width: 768px) {
    height:10px;
    width:10px;
    margin:5px;
  }
`
const WhiteView = styled(RowBetween)`
  background-color:#fff;
  border-radius:20px;
  margin:20px 0px;
  padding:10px 10px;
  @media (max-width: 768px) {
    border-radius:10px;
    margin:10px 0px;
    padding:5px 5px;
  };
  margin-top:0px
`
const BackButton = styled(ButtonNormal)`
`

let segment = 0
export default function EarnFarmModal({
  isOpen,
  onDismiss,
  pairInfo
}: {
  pairInfo: any,
  isOpen: boolean
  onDismiss: () => void,
}) {

  const [firstInput, setFirstInput] = useState('0')
  const [secondInput, setSecondInput] = useState('0')
  const [constValue, setCountValue] = useState(1)

  const walletInfo = useWalletInfo()
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

  const homoraContract = useContract(ContractConfig.HomoraBank[network]?.address, ContractConfig.HomoraBank.abi)
  const spellContract = useContract(ContractConfig.SushiswapSpellV1[network]?.address, ContractConfig.SushiswapSpellV1.abi)

  const [USDCapproval, approveUSDCCallback] = useApprove(ContractConfig.USDC[network]?.address, ContractConfig.HomoraBank[network]?.address)
  const [USDTapproval, approveUSDTCallback] = useApprove(ContractConfig.USDT[network]?.address, ContractConfig.HomoraBank[network]?.address)
  const [DAIapproval, approveDAICallback] = useApprove(ContractConfig.DAI[network]?.address, ContractConfig.HomoraBank[network]?.address)
  const [ETHapproval, approveETHCallback] = useApprove(ContractConfig.wETH[network]?.address, ContractConfig.HomoraBank[network]?.address)



  const loading = useContext(LoadingContext)

  const ethPrice = useIconPrice('ETH')
  const [segmentType, setSegmentType] = useState(0)

  useEffect(() => {
    if (!homoraContract) {
      return
    }
    function eventListener(address: string) {
      if (address === account) {

      }
    }
    // homoraContract.on("EXECUTOR", eventListener)
    return () => {
      // homoraContract.off("EXECUTOR",eventListener)
    }
  }, [homoraContract, account])

  function framClick() {
    if (ETHapproval !== ApprovalState.APPROVED) {
      message.warn('approve ETH')
      return
    }
    if (pairInfo.name2 == 'USDT' && USDTapproval !== ApprovalState.APPROVED) {
      message.warn('approve USDT')
      return
    }
    if (pairInfo.name2 == 'USDC' && USDCapproval !== ApprovalState.APPROVED) {
      message.warn('approve USDC')
      return
    }
    if (pairInfo.name2 == 'DAI' && DAIapproval !== ApprovalState.APPROVED) {
      message.warn('approve DAI')
      return
    }

    if (firstInput == '') {
      return
    }
    if (secondInput == '') {
      return
    }

    // 质押物价值 V= Supplied Token A* ETH Price + Supplied Token B
    let V = Number(firstInput) * ethPrice + Number(secondInput)
    // A*(M-1)
    let borrowA = Number(firstInput) * (constValue - 1)
    // B*(M-1)
    let borrowB = Number(secondInput) * (constValue - 1)
    const iface = new ethers.utils.Interface([
      "function addLiquidityWMiniChef(address tokenA, address tokenB, tuple(uint256 amtAUser, uint256 amtBUser, uint256 amtLPUser, uint256 amtABorrow, uint256 amtBBorrow, uint256 amtLPBorrow, uint256 amtAMin, uint256 amtBMin), uint256 amounts, )",
    ])
    const hexString = iface.encodeFunctionData("addLiquidityWMiniChef", [
      ContractConfig.wETH[network]?.address,  // wETH的合约地址
      ContractConfig[pairInfo.name2][network]?.address,  // USDT、USDC、DAI合约地址
      [
        BigNumber.from(0),               // supply WETH         输入的ETH数量0
        balanceToBigNumber(secondInput, pairInfo.name2 == 'DAI' ? 18 : 6),        // supply USDT         输入的USDT、USDC、DAI数量
        BigNumber.from(0),               // supply LP           输入的LP数量
        balanceToBigNumber(borrowA),       // borrow WETH         borrow A
        balanceToBigNumber(borrowB, pairInfo.name2 == 'DAI' ? 18 : 6),       // borrow USDT         borrowB
        BigNumber.from(0),               // borrow LP tokens    borrow LP数量
        BigNumber.from(0),               // min ETH             交易最低A数量(滑点相关）
        BigNumber.from(0),             // min UsDT            交易最低USDT
      ],
      BigNumber.from(pairInfo.name2 == 'USDC' ? 0 : pairInfo.name2 == 'USDT' ? 4 : 14),  // eth转成weth
    ])


    // const hexString = iface.encodeFunctionData("addLiquidityWMiniChef", [
    //   ContractConfig.wETH[network]?.address,  // wETH的合约地址
    //   ContractConfig[pairInfo.name2][network]?.address,  // USDT、USDC、DAI合约地址
    //   [
    //     BigNumber.from(0),               // supply WETH         输入的ETH数量0
    //     balanceToBigNumber(secondInput,6),        // supply USDT         输入的USDT、USDC、DAI数量
    //     BigNumber.from(0),               // supply LP           输入的LP数量
    //     BigNumber.from(0),       // borrow WETH         borrow A
    //     balanceToBigNumber(secondInput,6),       // borrow USDT         borrowB
    //     BigNumber.from(0),               // borrow LP tokens    borrow LP数量
    //     BigNumber.from(0),               // min ETH             交易最低A数量(滑点相关）
    //     BigNumber.from(0),               // min UsDT            交易最低USDT
    //   ],
    //   BigNumber.from(0)  // eth转成weth
    // ])

    loading.show(LoadingType.confirm, `Farm`)
    homoraContract?.execute(
      0,
      ContractConfig.SushiswapSpellV1[network]?.address,
      hexString,
      {
        value: balanceToBigNumber(firstInput),
      }
    ).then(async (response: TransactionResponse) => {
      loading.show(LoadingType.pending, response.hash)
      await response.wait();
      loading.show(LoadingType.success, response.hash)
      onDismiss()
    })
      .catch((err: any) => {
        loading.show(LoadingType.error, err.reason || err.message)
      })
  }

  return (
    <Modal isOpen={isOpen} onDismiss={() => { }}>
      <ColumnCenter>
        <MainView>
          <Column style={{ width: '100%' }}>
            <RowFixed>
              <BackButton onClick={onDismiss}>
                <ArrowLeft src={ImageCommon.fanhui} />
              </BackButton>
              <Text fontSize={28} fontWeight={'bold'}>Farm Sushiswap {pairInfo.name1} / {pairInfo.name2} Pool</Text>
            </RowFixed>
            <SpaceHeight height={10} heightApp={10} />
            <AccountSegment callBack={(type: number) => {
              segment = type
              setSegmentType(type)
            }} />
            <SpaceHeight height={20} heightApp={10} />
          </Column>
          <Container>
            <RowBetween>
              <Text fontSize={20} fontColor={'#777E90'}>Total Debt</Text>
              <Text fontSize={20}>0%</Text>
            </RowBetween>
            <RowBetween>
              <Text fontSize={20} fontColor={'#777E90'}>Slippage and trading fees </Text>
              <Text fontSize={20}>0.3%</Text>
            </RowBetween>
            <RowBetween>
              <Text fontSize={20} fontColor={'#777E90'}>Total SushiswapLP Token {pairInfo.name1} / {pairInfo.name2} Sushi-LPs</Text>
              <Text fontSize={20}>0.0</Text>
            </RowBetween>
            <Line />
            <RowBetween>
              <Text fontSize={20} fontColor={'#777E90'}>Yield Farm APR</Text>
              <RowFixed>
                <Text style={{ textDecoration: 'line-through' }} fontSize={20}>{(pairInfo.Fee + pairInfo.APR - pairInfo.APY).toFixed(2)}%</Text>
                <ArrowRight src={ImageCommon.youjiantou} />
                <Text fontSize={20}>{(pairInfo.Fee * constValue + pairInfo.APR * constValue - pairInfo.APY * (constValue - 1)).toFixed(2)}%</Text>
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Text fontSize={20} fontColor={'#777E90'}>Trading Fees APR (7-day avg.) </Text>
              <RowFixed>
                <Text style={{ textDecoration: 'line-through' }} fontSize={20}>{pairInfo.Fee.toFixed(2)}%</Text>
                <ArrowRight src={ImageCommon.youjiantou} />
                <Text fontSize={20}>{(pairInfo.Fee * constValue).toFixed(2)}%</Text>
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Text fontSize={20} fontColor={'#777E90'}>Sushi Rewards APR</Text>
              <RowFixed>
                <Text style={{ textDecoration: 'line-through' }} fontSize={20}>{pairInfo.APR.toFixed(2)}%</Text>
                <ArrowRight src={ImageCommon.youjiantou} />
                <Text fontSize={20}>{(pairInfo.APR * constValue).toFixed(2)}%</Text>
              </RowFixed>
            </RowBetween>
            <RowBetween>
              <Text fontSize={20} fontColor={'#777E90'}>Borrowing Interest APR</Text>
              <RowFixed>
                <Text style={{ textDecoration: 'line-through' }} fontSize={20}>-{pairInfo.APY.toFixed(2)}%</Text>
                <ArrowRight src={ImageCommon.youjiantou} />
                <Text fontSize={20}>-{(pairInfo.APY * (constValue - 1)).toFixed(2)}%</Text>
              </RowFixed>
            </RowBetween>
            <SpaceHeight height={40} heightApp={20} />
            <Text fontSize={28} fontWeight={'bold'}>How much would you like to farm?</Text>
            <RowFixed>
              <Text fontSize={20} fontColor={'#777E90'}>Available Balance：</Text>
              {
                segmentType == 0 ? <Text fontSize={20} fontColor={'#777E90'}>0</Text> : (ETHapproval !== ApprovalState.APPROVED ? <Text fontSize={20} fontColor={'#777E90'}>0</Text> : (walletInfo.loading ? <LoadingRow /> : <Text fontSize={20} fontColor={'#777E90'}>{mathPrice(walletInfo.ETH)} {pairInfo.name1}</Text>))
              }
            </RowFixed>
            <WhiteView>
              <CardPair pair1={pairInfo.name1} showTitle={true} />
              {
                segmentType == 0 ? <PanelValue placeholder='0.0' value={firstInput} onChange={e => setFirstInput(e.target.value)} /> : (ETHapproval !== ApprovalState.APPROVED ? <DrawButton onClick={approveETHCallback}>APPROVE</DrawButton> : <PanelValue placeholder='0.0' value={firstInput} onChange={e => setFirstInput(e.target.value)} />)
              }
            </WhiteView>
            <Segment onSelect={(value: number) => {
              if (segmentType == 0) {
                setFirstInput(mathPrice(walletInfo.ETH * value) + '')
              } else {
                if (ETHapproval !== ApprovalState.APPROVED) {
                  setFirstInput("0")
                } else {
                  setFirstInput(mathPrice(walletInfo.ETH * value) + '')
                }
              }
            }} />
            <SpaceHeight height={10} heightApp={5} />
            <RowFixed>
              <Text fontSize={20} fontColor={'#777E90'}>Available Balance：</Text>
              {segmentType == 0 && <Text fontSize={20} fontColor={'#777E90'}>0</Text>}
              {
                segmentType == 1 && pairInfo.name2 == 'USDT' && (USDTapproval !== ApprovalState.APPROVED ? <Text fontSize={20} fontColor={'#777E90'}>0</Text> : (walletInfo.loading ? <LoadingRow /> : <Text fontSize={20} fontColor={'#777E90'}>{mathPrice(walletInfo[pairInfo.name2])} {pairInfo.name2}</Text>))
              }
              {
                segmentType == 1 && pairInfo.name2 == 'USDC' && (USDCapproval !== ApprovalState.APPROVED ? <Text fontSize={20} fontColor={'#777E90'}>0</Text> : (walletInfo.loading ? <LoadingRow /> : <Text fontSize={20} fontColor={'#777E90'}>{mathPrice(walletInfo[pairInfo.name2])} {pairInfo.name2}</Text>))
              }
              {
                segmentType == 1 && pairInfo.name2 == 'DAI' && (DAIapproval !== ApprovalState.APPROVED ? <Text fontSize={20} fontColor={'#777E90'}>0</Text> : (walletInfo.loading ? <LoadingRow /> : <Text fontSize={20} fontColor={'#777E90'}>{mathPrice(walletInfo[pairInfo.name2])} {pairInfo.name2}</Text>))
              }
            </RowFixed>
            <WhiteView>
              <CardPair pair1={pairInfo.name2} showTitle={true} />
              {segmentType == 0 && <PanelValue placeholder='0.0' value={secondInput} onChange={e => setSecondInput(e.target.value)} />}
              {
                segmentType == 1 && pairInfo.name2 == 'USDT' && (USDTapproval !== ApprovalState.APPROVED ? <DrawButton onClick={approveUSDTCallback}>APPROVE</DrawButton> : <PanelValue placeholder='0.0' value={secondInput} onChange={e => setSecondInput(e.target.value)} />)
              }
              {
                segmentType == 1 && pairInfo.name2 == 'USDC' && (USDCapproval !== ApprovalState.APPROVED ? <DrawButton onClick={approveUSDCCallback}>APPROVE</DrawButton> : <PanelValue placeholder='0.0' value={secondInput} onChange={e => setSecondInput(e.target.value)} />)
              }
              {
                segmentType == 1 && pairInfo.name2 == 'DAI' && (DAIapproval !== ApprovalState.APPROVED ? <DrawButton onClick={approveDAICallback}>APPROVE</DrawButton> : <PanelValue placeholder='0.0' value={secondInput} onChange={e => setSecondInput(e.target.value)} />)
              }
            </WhiteView>
            <Segment onSelect={(value: number) => {
              if (segmentType == 0) {
                setSecondInput(mathPrice(walletInfo[pairInfo.name2] * value) + '')
              } else {
                if (pairInfo.name2 == 'USDT' && USDTapproval !== ApprovalState.APPROVED) {
                  setSecondInput('0')
                } else if (pairInfo.name2 == 'USDC' && USDCapproval !== ApprovalState.APPROVED) {
                  setSecondInput('0')
                } else if (pairInfo.name2 == 'DAI' && DAIapproval !== ApprovalState.APPROVED) {
                  setSecondInput('0')
                } else {
                  setSecondInput(mathPrice(walletInfo[pairInfo.name2] * value) + '')
                }
              }
            }} />
            <SpaceHeight height={40} heightApp={20} />
            <RowBetween>
              <Text fontSize={20} fontColor={'#777E90'}>Leverage</Text>
              {/* <ButtonNormal>
                <Text style={{textDecoration:'underline'}} fontSize={20}>Learn more about risk</Text>
              </ButtonNormal> */}
            </RowBetween>
            <SpaceHeight height={10} heightApp={5} />
            <ChooseRisk firstValue={firstInput} secondValue={secondInput} icon={pairInfo.name2} select={constValue} onFram={(value: number) => {
              setCountValue(value)
            }} framClick={() => {
              if (segmentType == 0) {
                message.info('Insufficient Amounts')
                return
              }
              framClick()
            }} />
          </Container>
        </MainView>
      </ColumnCenter>
    </Modal>
  )
}


const AccountSegment = React.memo(({ callBack }: any) => {
  const [selectIndex, setSelectIndex] = useState(segment)
  const themeDark = useTheme()

  return <RowCenter>
    <SegmentDiv style={{
      backgroundColor: themeDark ? '#000' : 'white'
    }}>
      <TopSegmentItem isChoose={selectIndex == 0} onClick={() => {
        setSelectIndex(0)
        callBack && callBack(0)
      }}>Credit Account</TopSegmentItem>
      <TopSegmentItem isChoose={selectIndex == 1} onClick={() => {
        setSelectIndex(1)
        callBack && callBack(1)
      }}>Wallet Account</TopSegmentItem>
    </SegmentDiv>
  </RowCenter>
}, () => { return true })

function mathPrice(value: any) {
  return Math.floor(Number(value) * 10000) / 10000
}


function Segment({ onSelect }: any) {
  const [select, setSelect] = useState(-1)
  return <RowBetween>
    <SegmentItem select={select == 0} onClick={() => {
      if (select == 0) {
        setSelect(-1)
        onSelect(0)
        return
      }
      setSelect(0)
      onSelect(0.25)
    }}>25%</SegmentItem>
    <SegmentItem select={select == 1} onClick={() => {
      if (select == 1) {
        setSelect(-1)
        onSelect(0)
        return
      }
      setSelect(1)
      onSelect(0.5)
    }}>50%</SegmentItem>
    <SegmentItem select={select == 2} onClick={() => {
      if (select == 2) {
        setSelect(-1)
        onSelect(0)
        return
      }
      setSelect(2)
      onSelect(0.75)
    }}>75%</SegmentItem>
    <SegmentItem select={select == 3} onClick={() => {
      if (select == 3) {
        setSelect(-1)
        onSelect(0)
        return
      }
      setSelect(3)
      onSelect(1)
    }}>Max</SegmentItem>
  </RowBetween>
}
function ChooseRisk({ select, onFram, icon, firstValue, secondValue, framClick, approvalState }: any) {
  // const [select,setSelect] = useState(1)
  return <Column>
    <RowBetween style={{ position: 'relative' }}>
      <PositionLine />
      <RiskItem select={select == 1} onClick={() => {
        // setSelect(1)
        onFram(1)
      }}>1x</RiskItem>
      <RiskItem select={select == 1.5} onClick={() => {
        // setSelect(1.5)
        onFram(1.5)
      }}>1.5x</RiskItem>
      <RiskItem select={select == 2} onClick={() => {
        // setSelect(2)
        onFram(2)
      }}>2x</RiskItem>
      <RiskItem select={select == 2.5} onClick={() => {
        // setSelect(2.5)
        onFram(2.5)
      }}>2.5x</RiskItem>
      <RiskItem select={select == 3.0} onClick={() => {
        // setSelect(3.0)
        onFram(3)
      }}>3.0x</RiskItem>
    </RowBetween>
    <RowBetween>
      <Text fontSize={20} fontColor={'#777E90'}>Low risk</Text>
      <Text fontSize={20} fontColor={'#777E90'}>Moderate risk</Text>
      <Text fontSize={20} fontColor={'#777E90'}>Moderate risk</Text>
      <Text fontSize={20} fontColor={'#777E90'}>High risk</Text>
      <Text fontSize={20} fontColor={'#777E90'}>Higher risk</Text>
    </RowBetween>
    <SpaceHeight height={20} heightApp={10} />
    <RowBetween>
      <Text fontSize={20} fontColor={'#777E90'}>Summary </Text>
    </RowBetween>
    <RowBetween>
      <Text fontSize={20} fontColor={'#777E90'}>Assets supplied</Text>
      <Text fontSize={20}>{firstValue} ETH + {secondValue} {icon}</Text>
    </RowBetween>
    <RowBetween>
      <Text fontSize={20} fontColor={'#777E90'}>Assets in position value</Text>
      <Text fontSize={20}>{mathPrice(firstValue * select)} ETH + {mathPrice(secondValue * select)} {icon}</Text>
    </RowBetween>
    <SpaceHeight height={20} heightApp={10} />
    <FarmButton onClick={() => {
      framClick()
    }}>Farm {select}x</FarmButton>
  </Column>
}

const RiskItem = styled(RowCenter) <{
  select: boolean
}>`
  background-color:${({ select }) => select ? '#4F56FF' : '#777E90'};
  font-size:24px;
  border-radius:50%;
  @media (max-width: 768px) {
    font-size:12px;
    width:50px;
    height:50px
  };
  cursor:pointer;
  width:80px;
  height:80px;
  color:#fff
`
const PositionLine = styled.div`
  position:absolute;
  background-color:#777E90;
  padding:0.5px 0px;
  width:100%
`
const FarmButton = styled(ButtonNormal)`
  border:1px solid #4F56FF;
  padding:10px 0px;
  color:#fff;
  width:100%;
  font-size:24px;
  font-weight:bold;
  @media (max-width: 768px) {
    padding:5px 0px;
    font-size:12px;
  };
  :hover{
    background-color:#4E55FF;
  };
  :active{
    background-color:transparent;
  }
`

const PanelValue = styled.input`
  font-size: 30px;
  font-weight:bold;
  flex:1;
  outline: none;
  outline:none;
  border:none;
  font-weight: 500;
  width: 100%;
  @media (max-width: 768px) {
    font-size: 15px;
  };
  text-align:right
`
const SegmentDiv = styled(RowFixed)`
  background-color:#000;
  height:40px;
  width:fit-content;
  border-radius:20px;
  border:1px solid #17181A;
  @media (max-width: 768px) {
    // flex:1;
    width:100%;
    margin:20px 0px
  };
`

const TopSegmentItem = styled(RowCenter) <{
  isChoose?: boolean
}>`
  width:fit-content;
  background-color:${({ isChoose }) => isChoose ? '#4E55FF' : 'transparent'};
  height:100%;
  color:${({ isChoose }) => isChoose ? 'white' : '#777E90'};
  align-items:center;
  border-radius:20px;
  font-size:22px;
  font-weight:bold;
  cursor:pointer;
  @media (max-width: 768px) {
    font-size:14px;
    justify-content:center;
    align-items:center;
    font-weight:400;
    flex-direction:column;
    line-height:15px;
    padding:0px 10px;
    width:100%
  };
  padding:0px 20px
`
const SegmentItem = styled(RowCenter) <{
  select: boolean
}>`
  background-color:${({ select }) => select ? '#4F56FF' : '#777E90'};
  font-size:24px;
  border-radius:10px;
  padding:5px 15px;
  @media (max-width: 768px) {
    font-size:12px;
    border-radius:5px;
    padding:2px 10px;
  };
  cursor:pointer;
  width:fit-content;
  color:#fff
`