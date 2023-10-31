import ERC20_ABI from "@abi/generic/ERC20.json"
import ImageCommon from '@assets/common/ImageCommon'
import { Column } from '@components/Column'
import { CardPair, CardPairCustom, LoadingRow } from '@components/Common'
import Row, { GradientButton, RowBetween, RowCenter, RowFixed, RowFlat, SpaceHeight, SpaceWidth, Text, TextEqure } from '@components/Row'
import { ThemeText, ThemeTextEqure } from '@components/ThemeComponent'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import AppBody, { MainFullBody } from '@pages/components/AppBody'
import { useIconPrice } from "@services/banking.service"
import { usePositionInfo } from "@services/mining-staking.service"
import { Tooltip } from 'antd'
import { ethers } from 'ethers'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import {
  MyBankAssetFarmingIcon,
  balanceToBigNumber,
  bigNumberToBalance,
  chainFromId,
  mathPriceTo8,
  walletInfo
} from "../../common/Common"
import { NetworkTypeContext, WalletAddressContext } from "../../contexts"
import ContractConfig from "../../contract/ContractConfig"
import { getContract, useContract } from "../../hooks/useContract"
import { LoadingContext, LoadingType } from "../../provider/LoadingProvider"
import { useTheme } from '../../state/application/hooks'
import AddPositionModal from './AddPositionModal'
import EarnFarmModal from './EarnFarmModal'
import RemovePositionModal from './RemovePositionModal'
import { BankTopInfo } from './index'


const Body = styled(Column)`
  width:100%;
  height:100%;
  padding:0px 15px
`
const IconIcon = styled.img`
  width:16px;
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
  }
`
export const DrawButton = styled.div`
  color:white;
  border:1px solid #4E55FF;
  align-items:center;
  justify-content:center;
  height:30px;
  border-radius:15px;
  padding:5px;
  width:100px;
  display:flex;
  flex-direction:row;
  cursor:pointer;
  :hover{
    background-color:#4E55FF;
  };
  @media (max-width: 768px) {
    width:100%;
    width:50px;
    height:20px;
    border-radius:10px;
  }
`
function MyBankFarming(props: any) {

  return (
    <MainFullBody history={props.history}>
      <AppBody history={props.history}>
        <Body>
          <BankTopInfo />
          <MyPostion />
          <Earn />
        </Body>
      </AppBody>
    </MainFullBody>
  )
}

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
    justify-content:space-between
  }
`

const SegmentDiv = styled(RowFixed)`
  background-color:#17181A;
  height:40px;
  border-radius:20px;
  margin:20px 0px;
  overflow:hidden;
  border:1px solid #353945;
  @media (max-width: 768px) {
    // flex:1;
    width:100%;
    margin:20px 0px
  };
  margin-bottom:0px
`

const SegmentItem = styled(RowCenter) <{
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
const DownSubItem = styled(RowFixed)`
  @media (max-width: 768px) {
    width:100%;
    justify-content:space-between;
  };
`
const DownCenterItemView = styled(Column)`
  @media (max-width: 768px) {
    width:100%;
  };
`
const DownTopItemView = styled(RowFixed)`
  @media (max-width: 768px) {
    flex-direction:column;
    align-items:flex-start
  };
`
const FenXiaing = styled.img`
  width:20px;
  margin-left:20px;
  cursor:pointer
`
const LinePH = styled.div`
  height:1px;
  background-color:#2E313A;
  width:100%;
  margin:20px 0px;
`

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
function Segment() {
  const [selectIndex, setSelectIndex] = useState(0)
  const themeDark = useTheme()
  return <RowCenter>
    <SegmentDiv style={{
      backgroundColor: themeDark ? '#17181A' : 'white'
    }}>
      <SegmentItem isChoose={selectIndex == 0} onClick={() => {
        setSelectIndex(0)
      }}>ALL</SegmentItem>
      <Tooltip placement="top" title={"Coming soon..."}>
        <SegmentItem isChoose={selectIndex == 1} onClick={() => {
          // setSelectIndex(1)
        }}
        >
          <span>YIELD</span>
          <span>FARMING</span>
        </SegmentItem>
      </Tooltip>
      <Tooltip placement="top" title={"Coming soon..."}>
        <SegmentItem isChoose={selectIndex == 2} onClick={() => {
          // setSelectIndex(2)
        }}>
          <span>LIQUIDITY</span>
          <span>PROVIDING</span>
        </SegmentItem>
      </Tooltip>
    </SegmentDiv>
  </RowCenter>
}

function Earn() {
  const themeDark = useTheme()
  const [show, setShow] = useState(false)

  const pairInfo = useRef(MyBankAssetFarmingIcon[0])
  const [showValue, setShowValue] = useState(false)

  const { chainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);

  useEffect(() => {
    setTimeout(() => {
      setShowValue(true)
    }, 2000);
  }, [])


  return <BGDiv style={{
    backgroundColor: themeDark ? '#17181A' : 'white',
    padding: isMobile ? 15 : 30
  }}>
    <EarnFarmModal pairInfo={pairInfo.current} isOpen={show} onDismiss={() => { setShow(false) }} />
    <RowFixed>
      <LeftIcon src={ImageCommon.myBank_farm} />
      <ThemeTextEqure fontSize={24} fontWeight={'bold'}>Farming</ThemeTextEqure>
      <TextEqure style={{ marginLeft: 10 }} fontColor={'#777E90'} fontSize={12} fontWeight={'500'}>(3 Pools)</TextEqure>
    </RowFixed>
    <SpaceHeight height={30} heightApp={0} />
    {
      MyBankAssetFarmingIcon.map((item: any, index: number) => {
        return <Column>
          <SubView>
            <DownTopItemView>
              <RowFixed>
                <CardPairCustom pair1={item.icon1} pair2={item.icon2} showTitle={false} />
                <Column style={{ alignItems: 'flex-start', marginLeft: 10 }}>
                  <TextEqure fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>YIELD FARMING</TextEqure>
                  <RowFixed>
                    <TextEqure fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>Sushi</TextEqure>
                    <FenXiaing onClick={() => {
                      window.open(item.linkUrl)
                    }} src={ImageCommon.fenxiang} />
                  </RowFixed>
                  <ThemeTextEqure fontSize={20} fontWeight={'bold'}>{item.name1}/{item.name2}</ThemeTextEqure>
                </Column>
              </RowFixed>
              <SpaceWidth width={80} widthApp={0} />
              <Column>
                {
                  showValue ? <ThemeTextEqure fontSize={24} fontWeight={'bold'}>{(item.Fee * 3 + item.APR * 3 - item.APY * 2).toFixed(2)}%</ThemeTextEqure>
                    : <LoadingRow />
                }
                {
                  showValue ? <ThemeTextEqure style={{ textDecorationLine: 'line-through' }} fontSize={18} fontWeight={'bold'}>{item.line_pre.toFixed(2)}%</ThemeTextEqure>
                    : <LoadingRow />
                }
              </Column>
            </DownTopItemView>
            <SpaceHeight height={0} heightApp={10} />
            <DownCenterItemView>
              <DownSubItem>
                <TextEqure style={{ width: 110 }} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Trading Fee</TextEqure>
                <SpaceWidth width={80} widthApp={0} />
                {
                  showValue ? <ThemeTextEqure fontSize={20} fontWeight={'bold'}>{(item.Fee * 3).toFixed(2)}%</ThemeTextEqure>
                    : <LoadingRow />
                }
              </DownSubItem>
              <DownSubItem>
                <TextEqure style={{ width: 110 }} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Sushi APR</TextEqure>
                <SpaceWidth width={80} widthApp={0} />
                {
                  showValue ? <ThemeTextEqure fontSize={20} fontWeight={'bold'}>{(item.APR * 3).toFixed(2)}%</ThemeTextEqure>
                    : <LoadingRow />
                }
              </DownSubItem>
              <DownSubItem>
                <TextEqure style={{ width: 110 }} fontColor={'#777E90'} fontSize={20} fontWeight={'500'}>Borrow APY</TextEqure>
                <SpaceWidth width={80} widthApp={0} />
                {
                  showValue ? <ThemeTextEqure fontSize={20} fontWeight={'bold'}>-{(item.APY * 2).toFixed(2)}%</ThemeTextEqure>
                    : <LoadingRow />
                }
              </DownSubItem>
            </DownCenterItemView>
            <RowFlat style={isMobile ? { width: '100%', marginTop: 10 } : {}}>
              <DrawButton onClick={() => {
                pairInfo.current = item
                setShow(true)
              }} style={{ color: themeDark ? 'white' : '#17181A' }}>FARM</DrawButton>
            </RowFlat>
          </SubView>
          <DownLine />
        </Column>
      })
    }
  </BGDiv>
}
function PositionSegment() {
  const [selectIndex, setSelectIndex] = useState(0)
  const themeDark = useTheme()
  return <SegmentDiv style={{
    backgroundColor: themeDark ? '#17181A' : 'white'
  }}>
    <SegmentItem isChoose={selectIndex == 0} onClick={() => {
      setSelectIndex(0)
    }}>Credit Position</SegmentItem>
    {/* <Tooltip placement="top" title={"Coming soon..."}>
          <SegmentItem isChoose={selectIndex == 1}
              //              onClick={()=>{
              //   setSelectIndex(1)
              // }}
          >Borrow</SegmentItem>
      </Tooltip> */}
  </SegmentDiv>
}

const AccountSegment = React.memo(({ callBack }: any) => {
  const [selectIndex, setSelectIndex] = useState(0)
  const themeDark = useTheme()
  return <RowCenter>
    <SegmentDiv style={{
      backgroundColor: themeDark ? '#000' : 'white'
    }}>
      <SegmentItem isChoose={selectIndex == 0} onClick={() => {
        setSelectIndex(0)
        callBack(0)
      }}>Credit Account</SegmentItem>
      <SegmentItem isChoose={selectIndex == 1} onClick={() => {
        setSelectIndex(1)
        callBack(1)
      }}>Wallet Account</SegmentItem>
    </SegmentDiv>
  </RowCenter>
}, () => { return true })



function MyPostion() {
  const themeDark = useTheme()
  const [segment, setSegment] = useState(0)
  const positionInfo = usePositionInfo()
  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const ethPrice = useIconPrice('ETH')

  const loading = useContext(LoadingContext)
  const { chainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);
  const homoraContract = useContract(ContractConfig.HomoraBank[network]?.address, ContractConfig.HomoraBank.abi)
  const { account } = useContext(WalletAddressContext);

  const [positions, setPositions] = useState([])
  const [showLoadingRow, setShowLoadingRow] = useState(false)

  const currentPositionInfo = useRef({})

  const getPositionInfo = async () => {
    if (!positionInfo.loading) {
      if (positions.length == 0) {
        setShowLoadingRow(true)
      }
      let lps: any = []
      for (let index = 0; index < Object.keys(positionInfo.data).length; index++) {
        let key = Object.keys(positionInfo.data)[index]
        let value = positionInfo.data[key]
        if (account == value) {
          let lp = await getInfo(Object.keys(positionInfo.data)[index])
          if (lp) {
            lps.push(lp)
          }
        }
      }
      setShowLoadingRow(false)
      setPositions(lps)
    }
  }

  useEffect(() => {
    getPositionInfo()
  }, [positionInfo])

  async function getInfo(positionId: any) {
    if (!positionId) { return }
    const ethValue = await homoraContract?.getCollateralETHValue(positionId)
    // return
    if (Number(bigNumberToBalance(ethValue)) <= 0) {
      return
    }
    const amtLPTakeInfo = await homoraContract?.getPositionInfo(positionId)
    if (!amtLPTakeInfo) { return }
    let collId: BigNumber = amtLPTakeInfo.collId
    let collToken: string = amtLPTakeInfo.collToken // IWMasterChef 的合约地址
    let IWMasterChefContract = getContract(collToken, ContractConfig.IWMasterChef.abi, walletInfo.signer)
    let IUniswapV2PairChefAddress: any = await IWMasterChefContract?.getUnderlyingToken(collId) // IUniswapV2PairChef的合约地址
    let IUniswapV2PairChefContract = getContract(IUniswapV2PairChefAddress, ContractConfig.IUniswapV2Pair.abi, walletInfo.signer)
    let token0: string = await IUniswapV2PairChefContract?.token0()
    let token1: string = await IUniswapV2PairChefContract?.token1()


    let token1Name = ''
    if (ContractConfig.USDT[network]?.address == token1.toLowerCase()) {
      token1Name = 'USDT'
    }
    if (ContractConfig.USDC[network]?.address == token1.toLowerCase()) {
      token1Name = 'USDC'
    }
    if (ContractConfig.DAI[network]?.address == token1.toLowerCase()) {
      token1Name = 'DAI'
    }

    const borrowValue = await homoraContract?.getBorrowETHValue(positionId)

    let ERC20Contract = getContract(IUniswapV2PairChefAddress, ERC20_ABI, walletInfo.signer)
    const totalSupply = await ERC20Contract?.totalSupply()
    let getReserves: any = await IUniswapV2PairChefContract?.getReserves()
    // LP数量
    // LP总量  totalSupply
    // eth 和dai是18  usdc和usdt是6
    const lp_amount = bigNumberToBalance(amtLPTakeInfo.collateralSize, (token1Name == 'USDT' || token1Name == 'USDC') ? 6 : 18)
    const lp_total = bigNumberToBalance(totalSupply, (token1Name == 'USDT' || token1Name == 'USDC') ? 6 : 18)
    // 乘以LP的数量 然后再除以LP的总量
    let getReserves0 = bigNumberToBalance(getReserves[0])
    let getReserves1 = bigNumberToBalance(getReserves[1], (token1Name == 'USDT' || token1Name == 'USDC') ? 6 : 18)

    let has1 = Number(getReserves0) * Number(lp_amount) / Number(lp_total)
    let has2 = Number(getReserves1) * Number(lp_amount) / Number(lp_total)

    const debts = await homoraContract?.getPositionDebts(positionId)
    let icon1Debts = '0'
    let icon2Debts = '0'

    if (debts && debts[0] && debts[0][0] == ContractConfig.wETH[network]?.address) {
      icon1Debts = bigNumberToBalance(debts[1][0])
    }
    if (debts && debts[0] && debts[0][1] && debts[1] && debts[1][1]) {
      icon2Debts = bigNumberToBalance(debts[1][1], (token1Name == 'USDT' || token1Name == 'USDC') ? 6 : 18)
    }

    if (ContractConfig.USDT[network]?.address == token1.toLowerCase()) {
      return {
        pair1: 'ETH',
        pair2: 'USDT',
        ethValue: bigNumberToBalance(ethValue),
        borrowValue: bigNumberToBalance(borrowValue),
        pid: positionId,
        has1,
        has2,
        icon1Debts,
        icon2Debts
      }
    }
    if (ContractConfig.USDC[network]?.address == token1.toLowerCase()) {
      return {
        pair1: 'ETH',
        pair2: 'USDC',
        ethValue: bigNumberToBalance(ethValue),
        borrowValue: bigNumberToBalance(borrowValue),
        pid: positionId,
        has1,
        has2,
        icon1Debts,
        icon2Debts
      }
    }
    if (ContractConfig.DAI[network]?.address == token1.toLowerCase()) {
      return {
        pair1: 'ETH',
        pair2: 'DAI',
        ethValue: bigNumberToBalance(ethValue),
        borrowValue: bigNumberToBalance(borrowValue),
        pid: positionId,
        has1,
        has2,
        icon1Debts,
        icon2Debts
      }
    }
  }

  function add() {
    setShowAdd(true)
  }
  function onAdd(pairInfo: any) {
    const iface = new ethers.utils.Interface([
      "function addLiquidityWMiniChef(address tokenA, address tokenB, tuple(uint256 amtAUser, uint256 amtBUser, uint256 amtLPUser, uint256 amtABorrow, uint256 amtBBorrow, uint256 amtLPBorrow, uint256 amtAMin, uint256 amtBMin), uint256 amounts, )",
    ])
    const hexString = iface.encodeFunctionData("addLiquidityWMiniChef", [
      ContractConfig.wETH[network]?.address,  // wETH的合约地址
      ContractConfig[pairInfo.pair2][network]?.address,  // USDT、USDC、DAI合约地址
      [
        BigNumber.from(0),               // supply WETH         输入的ETH数量0
        balanceToBigNumber(pairInfo.secondInput, pairInfo.pair2 == 'DAI' ? 18 : 6),        // supply USDT         输入的USDT、USDC、DAI数量
        BigNumber.from(0),               // supply LP           输入的LP数量
        balanceToBigNumber(pairInfo.firstInput),       // borrow WETH         borrow A
        balanceToBigNumber(pairInfo.secondInput, pairInfo.pair2 == 'DAI' ? 18 : 6),       // borrow USDT         borrowB
        BigNumber.from(0),               // borrow LP tokens    borrow LP数量
        BigNumber.from(0),               // min ETH             交易最低A数量(滑点相关）
        BigNumber.from(0),             // min UsDT            交易最低USDT
      ],
      BigNumber.from(pairInfo.pair2 == 'USDC' ? 0 : pairInfo.pair2 == 'USDT' ? 4 : 14),  // eth转成weth
    ])


    loading.show(LoadingType.confirm, `Add`)
    homoraContract?.execute(
      pairInfo.pid,
      ContractConfig.SushiswapSpellV1[network]?.address,
      hexString,
      {
        value: balanceToBigNumber(pairInfo.firstInput),
      }
    ).then(async (response: TransactionResponse) => {
      loading.show(LoadingType.pending, response.hash)
      await response.wait();
      loading.show(LoadingType.success, response.hash)
    })
      .catch((err: any) => {
        loading.show(LoadingType.error, err.reason || err.message)
      })
  }
  function remove() {
    setShowRemove(true)
  }
  async function onRemove(pairInfo: any) {
    console.log('pairInfo.icon1Debts', pairInfo.icon1Debts);
    console.log('pairInfo.icon2Debts', pairInfo.icon2Debts);
    console.log('pairInfo.icon1Value', pairInfo.icon1Value);
    console.log('pairInfo.icon2Value', pairInfo.icon2Value);
    console.log('pairInfo.has1', pairInfo.has1);
    console.log('pairInfo.has2', pairInfo.has2);
    console.log('balanceToBigNumber(pairInfo.icon1Value)', balanceToBigNumber(pairInfo.icon1Value).toString());
    console.log('balanceToBigNumber(pairInfo.icon2Value)', balanceToBigNumber(pairInfo.icon2Value, pairInfo.pair2 == 'DAI' ? 18 : 6).toString());


    const amtLPTakeInfo = await homoraContract?.getPositionInfo(pairInfo.pid)
    const size: BigNumber = amtLPTakeInfo.collateralSize
    const pro_size = Number(size.toString()) * (pairInfo.progress / 100)

    const iface = new ethers.utils.Interface([
      "function removeLiquidityWMiniChef(address tokenA, address tokenB, tuple(uint256 amtLPTake, uint256 amtLPWithdraw, uint256 amtARepay, uint256 amtBRepay, uint256 amtLPRepay, uint256 amtAMin, uint256 amtBMin))",
    ])
    const hexString = iface.encodeFunctionData("removeLiquidityWMiniChef", [
      ContractConfig.wETH[network]?.address,  // wETH的合约地址
      ContractConfig[pairInfo.pair2][network]?.address,  // USDT、USDC、DAI合约地址
      [
        BigNumber.from(pro_size), // Take out LP token amount (from Homora)
        BigNumber.from(0), // Withdraw LP token amount (back to caller)
        balanceToBigNumber(pairInfo.icon1Value), // Repay tokenA amount  2^256-1
        balanceToBigNumber(pairInfo.icon2Value, pairInfo.pair2 == 'DAI' ? 18 : 6), // Repay tokenB amount
        BigNumber.from(0), // Repay LP token amount
        BigNumber.from(0), // Desired tokenA amount
        BigNumber.from(0), // Desired tokenB amount
      ]
    ])

    console.log('hexString===', hexString);
    loading.show(LoadingType.confirm, `Farm`)
    homoraContract?.execute(
      pairInfo.pid,
      ContractConfig.SushiswapSpellV1[network]?.address,
      hexString,
    ).then(async (response: TransactionResponse) => {
      loading.show(LoadingType.pending, response.hash)
      await response.wait();
      loading.show(LoadingType.success, response.hash)
    })
      .catch((err: any) => {
        loading.show(LoadingType.error, err.reason || err.message)
      })
  }

  async function close(pid: string, tokenB: string) {
    const amtLPTakeInfo = await homoraContract?.getPositionInfo(pid)
    const iface = new ethers.utils.Interface([
      "function removeLiquidityWMiniChef(address tokenA, address tokenB, tuple(uint256 amtLPTake, uint256 amtLPWithdraw, uint256 amtARepay, uint256 amtBRepay, uint256 amtLPRepay, uint256 amtAMin, uint256 amtBMin))",
    ])
    const hexString = iface.encodeFunctionData("removeLiquidityWMiniChef", [
      ContractConfig.wETH[network]?.address,  // wETH的合约地址
      ContractConfig[tokenB][network]?.address,  // USDT、USDC、DAI合约地址
      [
        amtLPTakeInfo.collateralSize, // Take out LP token amount (from Homora)
        BigNumber.from(0), // Withdraw LP token amount (back to caller)
        BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935"), // Repay tokenA amount  2^256-1
        BigNumber.from("115792089237316195423570985008687907853269984665640564039457584007913129639935"), // Repay tokenB amount
        BigNumber.from(0), // Repay LP token amount
        BigNumber.from(0), // Desired tokenA amount
        BigNumber.from(0), // Desired tokenB amount
      ]
    ])
    console.log('hexString===', hexString);
    loading.show(LoadingType.confirm, `Farm`)
    homoraContract?.execute(
      pid,
      ContractConfig.SushiswapSpellV1[network]?.address,
      hexString,
    ).then(async (response: TransactionResponse) => {
      loading.show(LoadingType.pending, response.hash)
      await response.wait();
      loading.show(LoadingType.success, response.hash)
    })
      .catch((err: any) => {
        loading.show(LoadingType.error, err.reason || err.message)
      })

  }
  async function harvest(pid: string, tokenB: string) {
    const amtLPTakeInfo = await homoraContract?.getPositionInfo(pid)
    const iface = new ethers.utils.Interface([
      "function harvestWMiniChef()",
    ])
    const hexString = iface.encodeFunctionData("harvestWMiniChef")

    console.log('hexString===', hexString);
    loading.show(LoadingType.confirm, `Farm`)
    homoraContract?.execute(
      pid,
      ContractConfig.SushiswapSpellV1[network]?.address,
      hexString,
    ).then(async (response: TransactionResponse) => {
      loading.show(LoadingType.pending, response.hash)
      await response.wait();
      loading.show(LoadingType.success, response.hash)
    })
      .catch((err: any) => {
        loading.show(LoadingType.error, err.reason || err.message)
      })
  }


  return <BGDiv style={{
    backgroundColor: themeDark ? '#17181A' : 'white',
    padding: isMobile ? 10 : 20
  }}>
    <AddPositionModal pairInfo={currentPositionInfo.current} isOpen={showAdd} onDismiss={() => { setShowAdd(false) }} onAdd={onAdd} />
    <RemovePositionModal pairInfo={currentPositionInfo.current} isOpen={showRemove} onDismiss={() => { setShowRemove(false) }} onRemove={onRemove} />

    <RowFixed>
      <LeftIcon src={ImageCommon.myposition} />
      <ThemeTextEqure fontSize={24} fontWeight={'bold'}>Your Positions</ThemeTextEqure>
    </RowFixed>
    <AccountSegment callBack={(type: number) => {
      setSegment(type)
    }} />
    <SpaceHeight height={20} heightApp={10} />
    {
      segment == 0 ? <RowCenter>
        <ThemeText fontSize={28} fontWeight={'400'}>You don't have any active positions</ThemeText>
      </RowCenter> : <Column>
        {
          showLoadingRow ? <LoadingRow width={'100%'} /> : (positions.length == 0 ? <RowCenter>
            <ThemeText fontSize={28} fontWeight={'400'}>You don't have any active positions</ThemeText>
          </RowCenter> : <Column>
            <Row>
              <Text style={{ flex: 1, textAlign: 'center' }} fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>Pool</Text>
              <Text style={{ flex: 1 }} fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>Borrow</Text>
              <Text style={{ flex: 1 }} fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>Position Value</Text>
              <Text style={{ flex: isMobile ? 1.5 : 1, textAlign: 'center' }} fontColor={'#777E90'} fontSize={18} fontWeight={'500'}>Actions</Text>
            </Row>
            {
              positions.map((item: any, index: number) => {
                if (!item)
                  return null;

                return <RowBetween style={{ marginBottom: 20 }}>
                  <RowFixed style={{ flex: 1 }}>
                    <ThemeText style={{ width: isMobile ? 50 : 80 }} fontSize={20} fontWeight={'400'}>#{item.pid}</ThemeText>
                    <SpaceWidth width={10} widthApp={10} />
                    <CardPair pair1={item.pair1} pair2={item.pair2} showTitle={isMobile ? false : true} />
                  </RowFixed>
                  <Column style={{ flex: 1 }}>
                    <ThemeText fontSize={20} fontWeight={'400'}>${mathPriceTo8(item.borrowValue * ethPrice)}</ThemeText>
                  </Column>
                  <Column style={{ flex: 1 }}>
                    <ThemeText fontSize={20} fontWeight={'400'}>${mathPriceTo8(item.ethValue * ethPrice)}</ThemeText>
                  </Column>
                  <RowFixed style={{ flex: isMobile ? 1.5 : 1 }}>
                    <Column>
                      <DrawButton onClick={() => close(item.pid, item.pair2)}>
                        <ThemeText fontSize={16} fontWeight={'400'}>Close</ThemeText>
                      </DrawButton>
                      <SpaceHeight height={10} heightApp={5} />
                      <DrawButton onClick={() => {
                        currentPositionInfo.current = item
                        add()
                      }}>
                        <ThemeText fontSize={16} fontWeight={'400'}>Add</ThemeText>
                      </DrawButton>
                    </Column>
                    <SpaceWidth width={30} widthApp={5} />
                    <Column>
                      <DrawButton onClick={() => {
                        currentPositionInfo.current = item
                        remove()
                      }}>
                        <ThemeText fontSize={16} fontWeight={'400'}>Remove</ThemeText>
                      </DrawButton>
                      <SpaceHeight height={10} heightApp={5} />
                      <DrawButton onClick={() => harvest(item.pid, item.pair2)}>
                        <ThemeText fontSize={16} fontWeight={'400'}>Harvest</ThemeText>
                      </DrawButton>
                    </Column>
                  </RowFixed>
                </RowBetween>
              })
            }
          </Column>
          )
        }
      </Column>
    }
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
export default MyBankFarming;
