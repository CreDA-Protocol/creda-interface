import ImageCommon from '@assets/common/ImageCommon';
import ImageToken from '@assets/tokens/ImageToken';
import { ButtonNormal } from '@components/Button';
import { Column, ColumnCenter } from '@components/Column';
import Modal from '@components/NormalModal';
import { GradientButton, RowBetween, RowCenter, RowFixed, SpaceHeight, SpaceWidth, Text } from '@components/Row';
import { TransactionResponse } from '@ethersproject/providers';
import { chainFromId } from '@services/chains/chain.service';
import { useContract } from "@services/contracts.service";
import { useContext, useState } from 'react';
import styled from 'styled-components';
import {
  colors
} from "../../common/Common";
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";
import ContractConfig from "../../contract/ContractConfig";
import { LoadingContext, LoadingType } from "../../provider/LoadingProvider";
;

const Container = styled.div`
  display:flex;
  width:750px;
  // height:600px;
  flex-direction:column;
  padding:30px;
  background-color:#131416;
  border-radius:20px;
  @media (max-width: 768px) {
    padding:15px;
    width:94%;
    border-radius:10px;
    // height:500px;
  };
  overflow-y:scroll;
  border:1px solid #363739;
  ::-webkit-scrollbar{
  　width:0;
　}
`
const BottomButton = styled(GradientButton)`
  background-color:${colors.main};
  @media (max-width: 768px) {
    height:30px
  };
  width:100%;
  margin-top:20px;
  height:40px
`
const ArrowRight = styled.img`
  width:24px;
  margin:0px 10px;
  @media (max-width: 768px) {
    width:12px;
    margin:0px 5px
  };
`
const ArrowLeft = styled.img`
  height:27px;
  margin-right:30px;
  @media (max-width: 768px) {
    height:14px;
    margin-right:15px
  }
`
const IconIcon = styled.img`
  height:40px;
  width:40px;
  @media (max-width: 768px) {
    height:30px;
    width:30px;
    margin-right:5px
  };
  margin-right:10px
`
const InputView = styled(Column)`
  background-color:#000;
  border-radius:20px;
  margin:20px 0px;
  padding:20px 20px;
  @media (max-width: 768px) {
    border-radius:10px;
    margin:10px 0px;
    padding:10px 10px;
  };
  margin-top:0px
`
const MaxButton = styled(ColumnCenter)`
  width: 60px;
  height: 40px;
  background: ${colors.main};
  border-radius: 5px;
  color:${colors.white};
  margin-right:20px;
  cursor:pointer;
  justify-content:center;
  font-size:20px;
  @media (max-width: 768px) {
    width: 40px;
    height: 30px;
    margin-right:10px;
    font-size:10px;
    padding:2px 5px;
  };
  font-weight:bold;
`
const BackButton = styled(ButtonNormal)`
`
export default function BorrowCollateralModal({
  isOpen,
  onDismiss,
  type
}: {
  isOpen: boolean
  onDismiss: () => void,
  type: string
}) {

  const [input, setInput] = useState('')

  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

  // const [approval, approveCallback] = useApprove(ContractConfig.CREDA[network]?.address, ContractConfig.CreditNFT[network]?.address)
  const homoraContract = useContract(ContractConfig.HomoraBank[network]?.address, ContractConfig.HomoraBank.abi)
  const loading = useContext(LoadingContext)

  function execute() {
    loading.show(LoadingType.confirm, `Execute`)
    homoraContract?.execute(0, 'address',)
      .then(async (response: TransactionResponse) => {
        loading.show(LoadingType.pending, response.hash)
        await response.wait();
      })
      .catch((err: any) => {
        loading.show(LoadingType.error, err.reason || err.message)
      })
  }

  return (
    <Modal isOpen={isOpen} onDismiss={() => { }}>
      <RowCenter>
        <Container>
          <RowFixed>
            <BackButton onClick={onDismiss}>
              <ArrowLeft src={ImageCommon.fanhui} />
            </BackButton>
            <Text fontSize={28} fontWeight={'bold'}>{type == '0' ? 'Borrow' : 'Repay'}</Text>
          </RowFixed>
          <SpaceHeight height={20} heightApp={10} />
          <InputView>
            <RowBetween>
              <Text fontSize={22}>Input</Text>
              <Text fontSize={22}>Balance:0.0</Text>
            </RowBetween>
            <RowBetween>
              <PanelValue placeholder='0.0' value={input} onChange={e => setInput(e.target.value)} />
              <MaxButton>MAX</MaxButton>
              <IconIcon src={ImageToken.DAI} />
              <Text fontSize={28} fontWeight={'bold'}>DAI</Text>
            </RowBetween>
          </InputView>
          <Text fontSize={24}>{type == '0' ? des1 : des2}</Text>
          <SpaceHeight height={40} heightApp={20} />
          <RowBetween>
            <ColumnCenter>
              <Text fontSize={28} fontWeight='bold'>0.00</Text>
              <Text fontSize={20} >Total value</Text>
            </ColumnCenter>
            <ColumnCenter>
              <Text fontSize={28} fontWeight='bold'>0.00</Text>
              <Text fontSize={20} >Borrowed value</Text>
            </ColumnCenter>
            <ColumnCenter>
              <Text fontSize={28} fontWeight='bold'>0.00</Text>
              <Text fontSize={20} >Total value</Text>
            </ColumnCenter>
          </RowBetween>
          <SpaceHeight height={40} heightApp={20} />
          <RowCenter>
            <Text fontColor='#777E90' fontSize={30} >Health factor</Text>
            <SpaceWidth width={20} widthApp={10} />
            <Text fontColor={colors.main} fontSize={30} >1.16</Text>
            <ArrowRight src={ImageCommon.center_right_arrow} />
            <Text fontColor={colors.main} fontSize={30} >1.16</Text>
          </RowCenter>
          <BottomButton>enter amount</BottomButton>
        </Container>
      </RowCenter>
    </Modal>
  )
}
const des1 = 'Tip:You can maximize your position and borrow more leverage. Make sure to keep your health factor high enough or you might be liquidated'
const des2 = 'Tip:You can add collateral to your Credit Account to increase your borrowing power or to improve your health factor. This way. you can protect yourself from liquidations.'

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
  background-color:transparent;
  color:#fff
`