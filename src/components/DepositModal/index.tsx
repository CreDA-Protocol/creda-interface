import USDT_icon from '@assets/tokens/USDT.png';
import { TransactionResponse } from '@ethersproject/providers';
import { chainFromId } from '@services/chains/chain.service';
import { useContract } from "@services/contracts.service";
import { useApprove } from '@services/tokens.service';
import { BigNumber } from "ethers";
import { useContext, useState } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { ApprovalState, balanceToBigNumber, bigNumberToBalance, marketsConfig } from "../../common/Common";
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";
import { useTransactionAdder } from "../../states/transactions/hooks";
import Modal from '../Alert';
import { ColumnBetween, ColumnCenter, ColumnEnd } from '../Column';
import { LoadingCircle } from "../Common";
import { Button, Image, RowCenter, RowFixed, SpaceHeight, SpaceWidth, Text } from '../Row';

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

export default function DepositMdoal({
  isOpen,
  onDismiss,
  symbol,
  markets,
}: {
  isOpen: boolean
  onDismiss: () => void,
  symbol: string,
  markets: any
}) {
  const [input, setInput] = useState("");
  // console.log(markets,"markets")
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const maxNum = markets[symbol + '.token.balanceOf.' + account] ? Number(bigNumberToBalance(BigNumber.from(markets[symbol + '.token.balanceOf.' + account][0].hex))) : 0;
  const qContract = useContract(marketsConfig[symbol]?.[network].qToken.address, marketsConfig[symbol]?.[network].qToken.abi)
  const addTransaction = useTransactionAdder();
  const [withDrawLoading, setWithDrawLoading] = useState(false);

  const [approval, approveCallback] = useApprove(marketsConfig[symbol]?.[network]?.address, marketsConfig[symbol]?.[network].qToken.address)

  const onMax = () => {
    setInput(maxNum.toString())
  }
  function onWithDraw() {
    if (!input || Number(input) <= 0) {
      return;
    }
    setWithDrawLoading(true)
    qContract?.mint(balanceToBigNumber(input))
      .then(async (response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Deposit ' + symbol,
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
                <Image size={46} src={USDT_icon} />
                <SpaceWidth width={40} widthApp={20} />
                <Text fontSize={34} fontColor={'#3A3A3A'}>{symbol}</Text>
              </RowCenter>
              <SpaceHeight height={30} heightApp={15} />
              <Text fontSize={24} fontColor={'#3A3A3A'}>
                Deposit {symbol}
              </Text>
            </ColumnCenter>
            <SpaceHeight height={50} heightApp={25} />
            {
              <ColumnEnd>
                <Text fontSize={20} fontColor={'#3A3A3A'}>{maxNum.toFixed(4)} {symbol}</Text>
              </ColumnEnd>
            }
            <SpaceHeight height={20} heightApp={10} />
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
            width: '100%',
          }}>
            <Button style={{ flex: 1, height: isMobile ? 30 : 60 }}
              backgroundColor={'#4022F3'}
              fontSize={24}
              fontWeight={'bold'}
              onClick={onDismiss}
            >Cancel</Button>
            <SpaceWidth width={48} widthApp={24} />
            <Button style={{ flex: 1, height: isMobile ? 30 : 60 }}
              backgroundColor={'#4A29FF'}
              fontWeight={'bold'}
              fontSize={24}
              onClick={approval === ApprovalState.APPROVED ? onWithDraw : approveCallback}
              disabled={withDrawLoading || approval === ApprovalState.PENDING}
            >{approval === ApprovalState.APPROVED ? "Deposit" : "Approve"}
              {(withDrawLoading || approval === ApprovalState.PENDING) && <LoadingCircle></LoadingCircle>}
            </Button>
          </RowFixed>
        </ColumnBetween>
      </Container>
    </Modal>
  )
}
