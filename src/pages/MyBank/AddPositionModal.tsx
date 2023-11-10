import { ImageCommon } from '@assets/common/ImageCommon';
import { ButtonNormal } from '@components/Button';
import { Column, ColumnCenter } from '@components/Column';
import { CardPair, LoadingRow } from '@components/Common';
import { NormalModal } from '@components/NormalModal';
import { Row, RowBetween, RowCenter, RowEnd, RowFixed, SpaceHeight, Text } from '@components/Row';
import { useWalletInfo } from '@services/banking.service';
import { useState } from 'react';
import styled from 'styled-components';
import {
  mathPriceTo4
} from "../../common/Common";

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
    width:100%;
    flex:1
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
    height:80%
  };
  padding:30px;
  height:700px

`
const Container = styled.div`
  display:flex;
  width:750px;
  height:600px;
  flex-direction:column;
  justify-content:space-between;
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
  background-color:#000;
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

export function AddPositionModal({
  isOpen,
  onDismiss,
  onAdd,
  pairInfo,
}: {
  pairInfo: any,
  isOpen: boolean
  onDismiss: () => void,
  onAdd: (info: any) => void,
}) {
  const [firstInput, setFirstInput] = useState('')
  const [secondInput, setSecondInput] = useState('')

  const walletInfo = useWalletInfo()

  return (
    <NormalModal isOpen={isOpen} onDismiss={() => { }}>
      <ColumnCenter>
        <MainView>
          <Column style={{ width: '100%' }}>
            <Row>
              <BackButton onClick={onDismiss}>
                <ArrowLeft src={ImageCommon.fanhui} />
              </BackButton>
              <RowBetween>
                <Text fontSize={28} fontWeight={'bold'}>My position has</Text>
                <Column>
                  <Text fontSize={20}>{pairInfo.pair1}：{mathPriceTo4(pairInfo.has1)}</Text>
                  <Text fontSize={20}>{pairInfo.pair2}：{mathPriceTo4(pairInfo.has2)}</Text>
                </Column>
              </RowBetween>
            </Row>
            <SpaceHeight height={40} heightApp={20} />
            <RowBetween>
              <Text fontSize={20}>I'd like to supply more</Text>
              <Text fontSize={20}>Debt Ratio：{mathPriceTo4(pairInfo.borrowValue)}/{mathPriceTo4(pairInfo.ethValue * 0.7)}</Text>
            </RowBetween>
            <SpaceHeight height={20} heightApp={10} />
          </Column>
          <Container>
            <Column>
              <RowEnd>
                {walletInfo.loading ? <LoadingRow /> : <Text fontSize={20} fontColor={'#777E90'}>Balance：{mathPriceTo4(walletInfo[pairInfo.pair1])} {pairInfo.pair1}</Text>}
              </RowEnd>
              <WhiteView>
                <CardPair pair1={pairInfo.pair1} showTitle={true} />
                <PanelValue placeholder='0.0' value={firstInput} onChange={e => setFirstInput(e.target.value)} />
                <MaxButton onClick={() => {
                  setFirstInput(mathPriceTo4(walletInfo[pairInfo.pair1]) + '')
                }}>
                  MAX
                </MaxButton>
              </WhiteView>
              <RowEnd>
                {walletInfo.loading ? <LoadingRow /> : <Text fontSize={20} fontColor={'#777E90'}>Balance：{mathPriceTo4(walletInfo[pairInfo.pair2])} {pairInfo.pair2}</Text>}
              </RowEnd>
              <WhiteView>
                <CardPair pair1={pairInfo.pair2} showTitle={true} />
                <PanelValue placeholder='0.0' value={secondInput} onChange={e => setSecondInput(e.target.value)} />
                <MaxButton onClick={() => {
                  setSecondInput(mathPriceTo4(walletInfo[pairInfo.pair2]) + '')
                }}>
                  MAX
                </MaxButton>
              </WhiteView>
            </Column>
            <FarmButton onClick={() => {
              onAdd({
                ...pairInfo,
                firstInput,
                secondInput
              })
              onDismiss()
            }}>Add</FarmButton>
          </Container>
        </MainView>
      </ColumnCenter>
    </NormalModal>
  )
}


const MaxButton = styled.div`
  width: 100px;
  height: 40px;
  border:1px solid #fff;
  border-radius: 20px;
  color:#fff;
  font-weight:bold;
  cursor:pointer;
  margin-left:20px;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
  @media (max-width: 768px) {
    width: 50px;
    height: 20px;
    border-radius: 5px;
    margin-left:10px
  };
  :hover{
    background-color:#4E55FF;
  };
  :active{
    border:1px solid #4E55FF;
  }
`

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
  text-align:right;
  background-color:transparent;
  color:#fff
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
    padding:0px 10px
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