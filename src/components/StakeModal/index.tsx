import { ButtonClick } from '@components/Button'
import {
  GradientButton,
  RowCenter,
  RowEnd,
  RowFixed,
  SpaceHeight,
  SpaceWidth,
  TextEqure
} from '@components/Row'
import { TransactionResponse } from '@ethersproject/providers'
import { ChainIds, chainFromId } from "@services/chain.service"
import { useContract } from "@services/contracts.service"
import { useContext, useState } from 'react'
import styled from 'styled-components'
import { GasInfo, balanceToBigNumber, formatBalance, stringReplaceSpace } from "../../common/Common"
import { NetworkTypeContext, WalletAddressContext } from "../../contexts"
import ContractConfig from "../../contract/ContractConfig"
import { LoadingContext, LoadingType } from "../../provider/LoadingProvider"
import { useTransactionAdder } from "../../states/transactions/hooks"
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
export default function StakeModal({
  isOpen,
  onDismiss,
  title,
  data
}: {
  isOpen: boolean
  onDismiss: () => void,
  title: string,
  data: any
}) {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const maxNum = title === "Stake" ? data.lpBalance : data.staked;
  const addTransaction = useTransactionAdder();
  const IFNTContract = useContract(ContractConfig.CREDA[network]?.address, ContractConfig.CREDA.abi);
  const [input, setInput] = useState('')
  const loading = useContext(LoadingContext)

  const showTitle = chainId == ChainIds.esc ? 'ELA_CREDA_GLIDE_LP' : 'ETH_CREDA_SUSHI_LP'

  function onClick() {
    let endString = stringReplaceSpace(input)

    if (!endString) {
      return
    }


    if (title == 'Stake') {
      loading.show(LoadingType.confirm, 'Stake')
      IFNTContract?.stake(ContractConfig.ETH_CREDA_LP[network]?.address, balanceToBigNumber(endString), GasInfo)
        .then(async (response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Deposit ${showTitle}`,
          })
          loading.show(LoadingType.pending, response.hash)

          await response.wait();
          onDismiss();
          loading.show(LoadingType.success, response.hash)
          setInput('')
        })
        .catch((err: any) => {
          console.log(err)
          loading.show(LoadingType.error, err.reason || err.message)

        })
    } else {
      loading.show(LoadingType.confirm, 'unStake')

      IFNTContract?.unstake(ContractConfig.ETH_CREDA_LP[network]?.address, balanceToBigNumber(endString))
        .then(async (response: TransactionResponse) => {
          addTransaction(response, {
            summary: `Unlock ${showTitle}`,
          })
          loading.show(LoadingType.pending, response.hash)

          await response.wait();
          loading.show(LoadingType.success, response.hash)
          setInput('')
          onDismiss();
        })
        .catch((err: any) => {
          loading.show(LoadingType.error, err.reason || err.message)

          console.log(err)
        })
    }
    onDismiss()
  }
  function onMax() {
    setInput(maxNum + "")
  }
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} >
      <RowCenter>
        <Container>
          <RowCenter>
            <TextEqure fontColor={'#0D0D11'} fontSize={20} fontWeight={'bold'}>{title}</TextEqure>
          </RowCenter>
          <SpaceHeight height={30} heightApp={15} />
          <RowEnd>
            <TextEqure fontColor={'#777E90'} fontSize={15} fontWeight={'bold'}>{formatBalance(maxNum, 8)}LP</TextEqure>
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
            <CancelButton onClick={onDismiss}>Cancel</CancelButton>
            <SpaceWidth width={30} widthApp={15} />
            <GradientButton style={{ width: '100%', height: 40 }} onClick={onClick}>{title}</GradientButton>
          </RowCenter>
        </Container>
      </RowCenter>
    </Modal>
  )
}
