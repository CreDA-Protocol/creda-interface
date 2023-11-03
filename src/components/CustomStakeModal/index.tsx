import { ButtonClick } from '@components/Button'
import { RowCenter, RowEnd, RowFixed, SpaceHeight, SpaceWidth, TextEqure } from '@components/Row'
import { ChainIds, chainFromId } from "@services/chain.service"
import { useContext, useState } from 'react'
import styled from 'styled-components'
import { formatBalance, stringReplaceSpace } from "../../common/Common"
import { NetworkTypeContext, WalletAddressContext } from "../../contexts"
import Modal from '../NormalModal'


const Container = styled.div`
  width:400px;
  padding:30px;
  background-color:white;
  @media (max-width: 768px) {
    padding:15px;
    width:90%;
  };
  display:flex;
  flex-direction:column;
  border-radius:20px
`
const SearchDiv = styled(RowFixed)`
  width:100%;
  height:40px;
  border-radius:10px;
  border:1px solid #E4E4E4
`
const InputDiv = styled.input`
  font-size: 16px;
  flex:1;
  height:40px;
  outline: none;
  outline:none;
  border:none;
  font-weight: 500;
  width: 100%;
  margin-left:10px;
  background-color:transparent;
  color:#17181A;
`
const SearchButton = styled(RowCenter)`
  align-items:center;
  background-color:#4E55FF;
  border-radius:20px;
  border-radius:10px;
  width:fit-content;
  padding:5px 20px;
  color:#FBFCFC;
  font-weight:bold;
  margin-right:5px;
  cursor:pointer
`
const BlueButton = styled(ButtonClick)`
  background-color:#4E55FF;
  height:40px;
  border-radius:20px;
  padding:0px 20px;
  @media (max-width: 768px) {
    padding:0px 10px;
  };
  align-items:center;
  justify-content:center;
  color:#FBFCFC;
  font-size:14px;
  font-weight:bold;
  width:100%
`
const CancelButton = styled(BlueButton)`
  background-color:transparent;
  border:1px solid #777E90;
  color:#777E90;
`
enum ButtonType {
  cancel = 0,
  confirm = 1
}
export default function CustomStakeModal({
  show = true,
  onDismiss,
  title,
  maxNum = 0,
  onConfirm,
  cancelTitle = "Cancel",
  confirmTitle = "Confirm",
  balanceTitle = "",
  symbol = ''
}: {
  show?: boolean
  onDismiss: () => void,
  title?: string,
  maxNum?: number,
  onConfirm?: any,
  cancelTitle?: string,
  confirmTitle?: string,
  balanceTitle?: string,
  symbol?: string
}) {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const [input, setInput] = useState('')
  function onClick(type: ButtonType) {
    if (type === ButtonType.confirm) {
      let amount = stringReplaceSpace(input)
      if (!amount) {
        return
      }
      // TODO: check the amount
      onConfirm && onConfirm(amount)
      setInput('')
    }
    onDismiss()
  }
  function onMax() {
    setInput(maxNum + "")
  }

  if (chainId === ChainIds.esc && symbol == 'ELA') {

  }
  return (
    <Modal isOpen={show} onDismiss={onDismiss} >
      <RowCenter>
        <Container>
          <RowCenter>
            <TextEqure fontColor={'#0D0D11'} fontSize={20} fontWeight={'bold'}>{title}</TextEqure>
          </RowCenter>
          <SpaceHeight height={30} heightApp={15} />
          <RowEnd>
            <TextEqure fontColor={'#777E90'} fontSize={15} fontWeight={'bold'}>{formatBalance(maxNum, 8)}{balanceTitle}</TextEqure>
          </RowEnd>
          <SearchDiv>
            <InputDiv value={input}
              placeholder={''}
              onChange={e => setInput(e.target.value)} />
            <SearchButton
              onClick={onMax}
            >Max</SearchButton>
          </SearchDiv>
          <SpaceHeight height={30} heightApp={15} />
          <RowCenter>
            <CancelButton onClick={() => onClick(ButtonType.cancel)}>{cancelTitle}</CancelButton>
            <SpaceWidth width={30} widthApp={15} />
            <BlueButton onClick={() => onClick(ButtonType.confirm)}>{confirmTitle}</BlueButton>
          </RowCenter>
        </Container>
      </RowCenter>
    </Modal>
  )
}
