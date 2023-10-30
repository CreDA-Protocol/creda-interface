import { useContext, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import ImageCommon from '../../assets/common/ImageCommon';
import {
  chainFromId,
  mathPriceTo18,
  mathPriceTo6
} from "../../common/Common";
import { ButtonNormal } from '../../components/Button';
import Column, { ColumnCenter } from '../../components/Column';
import { CardPair } from '../../components/Common';
import Modal from '../../components/NormalModal';
import Row, { RowBetween, RowCenter, RowFixed, SpaceHeight, Text } from '../../components/Row';
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";

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
    height:80%;
    width:90%
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
const WhiteView = styled(RowFixed)`
  background-color:#000;
  border-radius:20px;
  padding:10px 10px;
  @media (max-width: 768px) {
    border-radius:10px;
    padding:5px 5px;
    width:50px;
    height:20px
  };
  width:100px;
  height:40px
`
const BackButton = styled(ButtonNormal)`
`

export default function RemovePositionModal({
  isOpen,
  onDismiss,
  pairInfo,
  onRemove
}: {
  pairInfo: any,
  isOpen: boolean
  onDismiss: () => void,
  onRemove: (info: any) => void,
}) {
  const progress = useRef(0)
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

  const [icon1Value, setIcon1Value] = useState(0)
  const [icon2Value, setIcon2Value] = useState(0)

  function onProgress(value: number) {
    setIcon1Value(mathPriceTo18(Number(pairInfo.icon1Debts) * value / 100))
    setIcon2Value(pairInfo.pair2 == 'DAI' ? mathPriceTo18(Number(pairInfo.icon2Debts) * value / 100) : mathPriceTo6(Number(pairInfo.icon2Debts) * value / 100))
  }

  return (
    <Modal isOpen={isOpen} onDismiss={() => { }}>
      <ColumnCenter>
        <MainView>
          <Column style={{ width: '100%' }}>
            <Row>
              <BackButton onClick={() => {
                progress.current = 0
                onDismiss()
                setIcon1Value(0)
                setIcon2Value(0)
              }}>
                <ArrowLeft src={ImageCommon.fanhui} />
              </BackButton>
              <RowBetween>
                <Text fontSize={28} fontWeight={'bold'}>Your Position Balance</Text>
              </RowBetween>
            </Row>
            <SpaceHeight height={40} heightApp={20} />
          </Column>
          <Container>
            <Column>
              <Text fontSize={28} fontWeight={'bold'}>I'd like to remove</Text>
              <SpaceHeight height={20} heightApp={10} />
              <Progress callBack={(value: number) => {
                console.log('callBack===', value);
                progress.current = value
                onProgress(value)
              }} />
              <SpaceHeight height={40} heightApp={20} />
              <Text fontSize={28} fontWeight={'bold'}>To receive</Text>
              <SpaceHeight height={20} heightApp={10} />
              <RowBetween>
                <CardPair pair1={pairInfo.pair1} showTitle={true} />
                <Text fontSize={28} fontWeight={'bold'}>{icon1Value}</Text>
              </RowBetween>
              <RowBetween>
                <CardPair pair1={pairInfo.pair2} showTitle={true} />
                <Text fontSize={28} fontWeight={'bold'}>{icon2Value}</Text>
              </RowBetween>
            </Column>
            <FarmButton onClick={() => {
              if (progress.current == 0) {
                return
              }
              onRemove({
                ...pairInfo,
                icon1Value,
                icon2Value,
                progress: progress.current
              })
              onDismiss()
            }}>Remove</FarmButton>
          </Container>
        </MainView>
      </ColumnCenter>
    </Modal>
  )
}

const pWidth = isMobile ? 40 : 100
function Progress({ callBack }: any) {
  const [input, setInput] = useState('')
  const [value, setValue] = useState(0)

  return <ProgressDown>
    <Column>
      <ProgressTopView>
        <ProgressLine />
        <ProgressCircle style={{
          left: (pWidth / 2) + 0 * pWidth,
          width: value == 0 ? 8 : 4,
          height: value == 0 ? 8 : 4,
          borderRadius: value == 0 ? 4 : 2,
        }} />
        <ProgressCircle style={{
          left: (pWidth / 2) + 1 * pWidth,
          width: value == 25 ? 8 : 4,
          height: value == 25 ? 8 : 4,
          borderRadius: value == 25 ? 4 : 2,
        }} />
        <ProgressCircle style={{
          left: (pWidth / 2) + 2 * pWidth,
          width: value == 50 ? 8 : 4,
          height: value == 50 ? 8 : 4,
          borderRadius: value == 50 ? 4 : 2,
        }} />
        <ProgressCircle style={{
          left: (pWidth / 2) + 3 * pWidth,
          width: value == 75 ? 8 : 4,
          height: value == 75 ? 8 : 4,
          borderRadius: value == 75 ? 4 : 2,
        }} />
        <ProgressCircle style={{
          left: (pWidth / 2) + 4 * pWidth,
          width: value == 100 ? 8 : 4,
          height: value == 100 ? 8 : 4,
          borderRadius: value == 100 ? 4 : 2,
        }} />
      </ProgressTopView>
      <RowFixed>
        <ProgressButton onClick={() => {
          setValue(0)
          callBack(0)
        }}>0%</ProgressButton>
        <ProgressButton onClick={() => {
          setValue(25)
          callBack(25)
        }}>25%</ProgressButton>
        <ProgressButton onClick={() => {
          setValue(50)
          callBack(50)
        }}>50%</ProgressButton>
        <ProgressButton onClick={() => {
          setValue(75)
          callBack(75)
        }}>75%</ProgressButton>
        <ProgressButton onClick={() => {
          setValue(100)
          callBack(100)
        }}>100%</ProgressButton>
      </RowFixed>
    </Column>
    <RowFixed>
      <WhiteView>
        <PanelValue placeholder='0' value={input} onChange={e => {
          setInput(e.target.value)
          callBack(Number(e.target.value))
        }} />
      </WhiteView>
      <Text fontSize={28} fontWeight={'bold'}>%</Text>
    </RowFixed>
  </ProgressDown>
}
const ProgressDown = styled(RowBetween)`
  @media (max-width: 768px) {
    // flex-direction:column
  };
  margin-left:-10px
`
const ProgressTopView = styled(RowFixed)`
  position:relative;
  height:8px;
`
const ProgressCircle = styled(RowFixed)`
  width:8px;
  height:8px;
  border-radius:4px;
  background-color:#fff;
  position:absolute;
`
const ProgressLine = styled(RowFixed)`
  width:${pWidth * 4}px;
  height:1px;
  margin-left:${pWidth / 2}px;
  background-color:#fff
`
const ProgressButton = styled(ButtonNormal)`
  width:${pWidth}px;
  height:50px;
  flex-direction:column;
  justify-content:flex-end;
  font-size:20px;
  @media (max-width: 768px) {
    font-size:10px;
    height:30px;
  };
  margin-top:-10px
`

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