import React, {useCallback, useContext, useState} from 'react'
import styled from 'styled-components'
import Modal from '../Alert'
import {RowCenter, Image, Text, SpaceWidth, SpaceHeight, RowFixed, RowBetween} from '../Row'
import {ColumnCenter,ColumnEnd,ColumnBetween} from '../Column'
import USDT_icon from '../../assets/tokens/USDT.png'
import { isMobile } from 'react-device-detect'
import {
  balanceToBigNumber,
  bigNumberToBalance,
  ChainId,
  colors,
  formatPercent,
  marketsConfig
} from "../../common/Common";
import {BigNumber} from "ethers";
import {useDaInfo} from "../../contract";
import {NetworkTypeContext, WalletAddressContext} from "../../context";
import {useContract} from "../../hooks/useContract";
import {useTransactionAdder} from "../../state/transactions/hooks";
import {TransactionResponse} from '@ethersproject/providers'
import {LoadingCircle} from "../Common";

import {Button} from "antd";

const Container = styled.div`
  height:480px;
  width:100%;

  @media (max-width: 768px) {
    height:240px;
  };
  
`
const InputDiv = styled.div`
  height:80px;
  width:100%;
  border-radius:10px;
  border: 1px solid #4022F3;
  @media (max-width: 768px) {
    height:40px;
    border-radius:5px;
  };
  display:flex;
  flex-direction:row
`
const PanelValue = styled.input`
  font-size: 30px;
  font-weight:bold;
  flex:1;
  height:60px;
  outline: none;
  outline:none;
  border:none;
  font-weight: 500;
  width: 100%;
  margin-left:10px;
  margin-top:10px;
  @media (max-width: 768px) {
    font-size: 15px;
    height:30px;
    margin-top:5px;
    margin-left:5px;
  };
`
const MaxButton = styled.div`
  width: 120px;
  height: 60px;
  background-color: #4022F3;
  border-radius: 10px;
  color:white;
  font-weight:bold;
  margin-right:10px;
  cursor:pointer;
  margin-top:10px;
  margin-left:10px;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
  @media (max-width: 768px) {
    width: 60px;
    height: 30px;
    margin-top:5px;
    border-radius: 5px;
    margin-right:5px;
    margin-left:5px
  };
`

export default function RepayModal({
  isOpen,
  onDismiss,
    symbol,
    markets
}: {
  isOpen: boolean
  onDismiss: () => void,
  symbol:string,
  markets:any
}) {
  const [input,setInput] = useState("");
  // console.log(markets,"markets")
  const daiInfo = useDaInfo(symbol,markets);
  const maxNum = daiInfo.borrowBalance || 0;
  const {chainId} = useContext(NetworkTypeContext);
  const {account} = useContext(WalletAddressContext);
  const network = ChainId[chainId];
  const qContract = useContract(marketsConfig[symbol]?.[network].qToken.address,marketsConfig[symbol]?.[network].qToken.abi)
  const addTransaction = useTransactionAdder();
  const [repayAllLoading,setRepayAllLoading] = useState(false);
  const [repayCustomLoading,setRepayCustomLoading] = useState(false);

  const onMax=()=>{
      setInput(maxNum.toString())
  }
  function onRepayAll(all=true) {
    const minusOne = all?BigNumber.from(2).pow(256).sub(1):balanceToBigNumber(input);
    console.log(minusOne,"minusOne")
    all ? setRepayAllLoading(true) : setRepayCustomLoading(true);
    qContract?.repayBorrow(minusOne)
        .then(async (response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Repay '+symbol,
          })
          await response.wait();
          onDismiss();
          setRepayAllLoading(false)
          setRepayCustomLoading(false)
        })
        .catch((err: any) => {
          console.log(err)
          setRepayAllLoading(false)
          setRepayCustomLoading(false)
        })
  }
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={468}>
      <Container>
        <ColumnBetween>
          <div>
            <ColumnCenter>
              <RowCenter>
                <Image size={46} src={USDT_icon}/>
                <SpaceWidth width={40} widthApp={20}/>
                <Text fontSize={34} fontColor={'#3A3A3A'}>{symbol}</Text>
              </RowCenter>
              <SpaceHeight height={30} heightApp={15}/>
              <Text fontSize={24} fontColor={'#3A3A3A'}>
                Repay {symbol}
                </Text>
            </ColumnCenter>
            <SpaceHeight height={50} heightApp={25}/>
            {
             <ColumnEnd>
              <Text fontSize={20} fontColor={'#3A3A3A'}>{maxNum.toFixed(4)} {symbol}</Text>
            </ColumnEnd>
            }
            <SpaceHeight height={20} heightApp={10}/>
            <InputDiv>
              <PanelValue
                  value={input}
                  onChange={e => setInput(e.target.value)}
              />
              <MaxButton onClick={onMax}>
                MAX
              </MaxButton>
            </InputDiv>
          </div>
          <RowBetween style={{
            width:'100%',
            }}>
            <Button
              type={"primary"}
              onClick={onDismiss}
              size={"large"}
              block
            >Cancel</Button>
            <ReapyAllButton
              block
              type={"primary"}
              size={"large"}
              onClick={()=>onRepayAll(true)}
              loading={repayAllLoading}
            >Repay All</ReapyAllButton>
            <Button
                type={"primary"}
                size={"large"}
                block
                onClick={()=>onRepayAll(false)}
                loading={repayCustomLoading}
            >Repay Custom</Button>
            {/*<Button style={{ flex:1,height:isMobile ? 30 : 60}}*/}
            {/*        backgroundColor={'#4022F3'}*/}
            {/*        fontSize={24}*/}
            {/*        fontWeight={'bold'}*/}
            {/*        onClick={onDismiss}*/}
            {/*>Cancel</Button>*/}
            {/*<SpaceWidth width={48} widthApp={24}/>*/}
            {/*<Button style={{ flex:1,height:isMobile ? 30 : 60 }}*/}
            {/*        backgroundColor={'#4A29FF'}*/}
            {/*        fontWeight={'bold'}*/}
            {/*        fontSize={24}*/}
            {/*        onClick={onWithDraw}*/}
            {/*        disabled={withDrawLoading}*/}
            {/*>WithDraw*/}
            {/*  {withDrawLoading && <LoadingCircle></LoadingCircle>}*/}
            {/*</Button>*/}
          </RowBetween>
        </ColumnBetween>
      </Container>
    </Modal>
  )
}
const ReapyAllButton = styled(Button)`
  margin-left:10%;
  margin-right:10%;
  background:${colors.active};
  border-color: ${colors.active};
  &:hover,&:focus {
    background: ${colors.active};
    border-color: ${colors.active};
  }
`
