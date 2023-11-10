import USDT_icon from '@assets/tokens/USDT.png'
import { useDaInfo } from '@services/banking.service'
import { BigNumber } from "ethers"
import { useCallback, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import { bigNumberToBalance, formatPercent } from "../../common/Common"
import { AlertModal } from '../Alert'
import { ColumnBetween, ColumnCenter, ColumnEnd } from '../Column'
import { Button, Image, RowCenter, RowFixed, SpaceHeight, SpaceWidth, Text } from '../Row'

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

export function DepositBorrowModal({
  isOpen,
  onConfirm,
  onDismiss,
  type,
  symbol,
  markets, account
}: {
  isOpen: boolean
  onConfirm: (amount: string) => void,
  onDismiss: () => void,
  type: string,
  symbol: string,
  account: string,
  markets: any
}) {
  const [input, setInput] = useState("");
  // console.log(markets,"markets")
  const maxNum = markets[symbol + '.token.balanceOf.' + account] ? Number(bigNumberToBalance(BigNumber.from(markets[symbol + '.token.balanceOf.' + account][0].hex))) : 0;
  const daiInfo = useDaInfo(symbol, markets);
  const borrowLimit = daiInfo.daiStatus ? daiInfo.collateralFactor * daiInfo.savingsBalance : 0;
  // console.log(maxNum,"maxNum")

  const borrowSafe = getValue(0.85) || 0;
  const borrowMax = getValue(0.99) || 0;
  let updatedLoanBalance = daiInfo.borrowBalance + Number(input) * 1;
  const loanUsedPercent = updatedLoanBalance / borrowLimit

  const handleDismiss = useCallback(() => null, [])

  const onMax = () => {
    // 质押
    if (type === "deposit") {
      setInput(maxNum.toString())
    } else {
      setInput(borrowMax.toString())
    }

  }
  function getValue(percent = 1) {
    // console.log(daiInfo.liquidity)
    const borrowSafeMaxTotal = borrowLimit * percent
    const alreayBorrowAmount = daiInfo.borrowBalance / 1
    let accountLiquidity = alreayBorrowAmount >= borrowSafeMaxTotal ? 0 : borrowSafeMaxTotal - alreayBorrowAmount
    let marketLiquidity = daiInfo.liquidity
    let borrowSafeMax = accountLiquidity > marketLiquidity ? marketLiquidity : accountLiquidity
    // console.log(accountLiquidity,marketLiquidity,"getValue")
    return borrowSafeMax
  }
  return (
    <AlertModal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={468}>
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
                {type == 'deposit' ? 'Deposit to Supply Account' :
                  'Borrow Safe Max ' + borrowSafe.toFixed(4) + symbol}
              </Text>
            </ColumnCenter>
            <SpaceHeight height={50} heightApp={25} />
            {
              type == 'deposit' && <ColumnEnd>
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
            {
              type !== 'deposit' && <ColumnCenter>
                <SpaceHeight height={30} heightApp={15} />
                <Text style={{ textAlign: 'center' }} fontSize={20} fontColor={'#3A3A3A'}>
                  Loan utilization rate {formatPercent(loanUsedPercent)}
                </Text>
              </ColumnCenter>
            }
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
              onClick={() => onConfirm(input)}
            >{
                type == 'deposit' ? 'Deposit' : 'Borrow'
              }</Button>
          </RowFixed>
        </ColumnBetween>
      </Container>
    </AlertModal>
  )
}
