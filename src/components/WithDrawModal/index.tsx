import React, {useCallback, useContext, useState} from 'react'
import styled from 'styled-components'
import Modal from '../Alert'
import { RowCenter,Image,Text,SpaceWidth,SpaceHeight,Button, RowFixed } from '../Row'
import {ColumnCenter,ColumnEnd,ColumnBetween} from '../Column'
import USDT_icon from '../../assets/tokens/USDT.png'
import { isMobile } from 'react-device-detect'
import {balanceToBigNumber, bigNumberToBalance, ChainId, formatPercent, marketsConfig} from "../../common/Common";
import {BigNumber} from "ethers";
import {useDaInfo} from "../../contract";
import {NetworkTypeContext, WalletAddressContext} from "../../context";
import {useContract} from "../../hooks/useContract";
import {useTransactionAdder} from "../../state/transactions/hooks";
import {TransactionResponse} from '@ethersproject/providers'
import {LoadingCircle} from "../Common";

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

export default function WidthDrawModal({
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
  const maxNum = daiInfo.savingsBalance || 0;
  const {chainId} = useContext(NetworkTypeContext);
  const {account} = useContext(WalletAddressContext);
  const network = ChainId[chainId];
  const qContract = useContract(marketsConfig[symbol]?.[network].qToken.address,marketsConfig[symbol]?.[network].qToken.abi)
  const addTransaction = useTransactionAdder();
  const [withDrawLoading,setWithDrawLoading] = useState(false);

  const onMax=()=>{
      setInput(maxNum.toString())
  }
  function onWithDraw() {
    if(!input || Number(input)<=0){
      return;
    }
    setWithDrawLoading(true)
    qContract?.redeemUnderlying(balanceToBigNumber(input))
        .then(async (response: TransactionResponse) => {
            addTransaction(response, {
                summary: 'Withdraw '+symbol,
            })
            await response.wait();
          onDismiss();
          setWithDrawLoading(false)
        })
        .catch((err: any) => {
            console.log(err)
          setWithDrawLoading(false)
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
                Withdraw {symbol}
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
          <RowFixed style={{
            width:'100%',
            }}>
            <Button style={{ flex:1,height:isMobile ? 30 : 60}}
                    backgroundColor={'#4022F3'}
                    fontSize={24}
                    fontWeight={'bold'}
                    onClick={onDismiss}
            >Cancel</Button>
            <SpaceWidth width={48} widthApp={24}/>
            <Button style={{ flex:1,height:isMobile ? 30 : 60 }}
                    backgroundColor={'#4A29FF'}
                    fontWeight={'bold'}
                    fontSize={24}
                    onClick={onWithDraw}
                    disabled={withDrawLoading}
            >WithDraw
              {withDrawLoading && <LoadingCircle></LoadingCircle>}
            </Button>
          </RowFixed>
        </ColumnBetween>
      </Container>
    </Modal>
  )
}
