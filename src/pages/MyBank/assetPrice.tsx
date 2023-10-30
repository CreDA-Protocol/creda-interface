import ImageCommon from '@assets/common/ImageCommon'
import ImageToken from '@assets/tokens/ImageToken'
import CREDAIcon from '@assets/tokens/creda.png'
import { Column } from '@components/Column'
import { RowBetween, RowFixed, SpaceHeight } from '@components/Row'
import { ThemeText, ThemeTextEqure } from '@components/ThemeComponent'
import { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styled from 'styled-components'
import { ChainIds, MyBankAssetPriceIcons, MyBankAssetPriceIconsESC, chainFromId, formatBalance } from "../../common/Common"
import { NetworkTypeContext, WalletAddressContext } from "../../contexts"
import { useSushiPrice } from '../../contract'
import ContractConfig from '../../contract/ContractConfig'
import { GlidePrice, getCoinPrice } from '../../services/glidefinance.service'
import { useTheme } from '../../state/application/hooks'
import AppBody, { MainFullBody } from '../AppBody'
import { BankTopInfo } from './index'

const Body = styled(Column)`
  width:100%;
  height:100%;
  padding:0px 15px
`
const IconIcon = styled.img`
  width:30px;
  height:auto;
  margin-right:10px;
  @media (max-width: 768px) {
    width:20px;
  }
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
  padding:10px;
  width:100px;
  display:flex;
  flex-direction:row;
  cursor:pointer;
  :hover{
    background-color:#4E55FF;
  };
  @media (max-width: 768px) {
    width:100%;
    flex:1
  }
`
function MyBankAssetPrice(props: any) {

  return (
    <MainFullBody history={props.history}>
      <AppBody history={props.history}>
        <Body>
          <BankTopInfo />
          <Earn />
        </Body>
      </AppBody>
    </MainFullBody>
  )
}


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
const WarpView = styled(RowFixed)`
  flex-wrap:wrap;
  width:100%
`
const WarpSubView = styled(RowBetween)`
  border:1px solid #353945;
  width:32%;
  border-radius:10px;
  margin-right:1%;
  @media (max-width: 768px) {
    width:100%;
    border-radius:5px;
    padding:5px 10px;
    margin-bottom:10px;
    // margin-right:5%;
  };
  padding:10px 20px;
  margin-bottom:20px
`



function Earn() {
  const themeDark = useTheme()
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const sushiPrice = useSushiPrice(1, [ContractConfig.CREDA[network]?.address, ContractConfig.USDT[network]?.address])
  // console.log('sushiPrice==',sushiPrice);
  let earnPool = MyBankAssetPriceIcons
  if (chainId === ChainIds.esc) {
    earnPool = MyBankAssetPriceIconsESC
  }
  const [iconList, setIconList] = useState(earnPool)

  useEffect(() => {
    if (chainId !== ChainIds.esc) {
      let iconStriing = ''
      earnPool.map((item, index) => {
        iconStriing = iconStriing + item.name + ','
      })
      iconStriing = iconStriing.substring(0, iconStriing.length - 1)
      fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${iconStriing}&tsyms=USD`).then((response) => response.json()).then((info) => {
        let temp = [...earnPool]
        temp.map((item: any) => {
          if (info.DISPLAY[item.name]) {
            item.price = info.DISPLAY[item.name]['USD'].PRICE
          } else {
            item.price = '0'
          }
        })
        setIconList(temp)
      })
    } else {

      earnPool.push({
        name: 'CREDA',
        icon: ImageToken.CREDA,
      })
      let coinList: any = []
      earnPool.forEach((item: any, index: number) => {
        coinList.push(ContractConfig[item.name][network]?.address.toLowerCase())
      })

      getCoinPrice(JSON.stringify(coinList)).then((prices: GlidePrice[]) => {
        let result: any = []

        prices.forEach((item: any, index: number) => {
          let upper = item.id.toLowerCase()
          let temp = coinList.indexOf(upper)
          if (temp > -1) {
            if (earnPool[temp].name === 'CREDA') {
              result.unshift({
                name: earnPool[temp].name,
                price: formatBalance(item.derivedUSD, 4),
                icon: ImageToken[earnPool[temp].name]
              })
            } else {
              result.push({
                name: earnPool[temp].name,
                price: formatBalance(item.derivedUSD, 4),
                icon: ImageToken[earnPool[temp].name]
              })
            }
          }
        })
        console.log('result==', result);
        setIconList(result)
      })
    }
  }, [earnPool, chainId, network])

  return <BGDiv style={{
    backgroundColor: themeDark ? '#17181A' : 'white',
    padding: isMobile ? 15 : 30
  }}>
    <RowFixed>
      <LeftIcon src={ImageCommon.myBank_asset} />
      <ThemeTextEqure fontSize={24} fontWeight={'bold'}>Asset Price</ThemeTextEqure>
    </RowFixed>
    <SpaceHeight height={30} heightApp={15} />
    <WarpView>
      {chainId !== ChainIds.esc && <WarpSubView>
        <RowFixed>
          <IconIcon src={CREDAIcon} />
          <ThemeText fontSize={24}>CREDA</ThemeText>
        </RowFixed>
        <ThemeText fontSize={24}>${Number(sushiPrice.to).toFixed(2)}</ThemeText>
      </WarpSubView>}
      {
        iconList.map((item: any, index: number) => {
          return <WarpSubView>
            <RowFixed>
              <IconIcon src={item.icon} />
              <ThemeText fontSize={24}>{item.name}</ThemeText>
            </RowFixed>
            <ThemeText fontSize={24}>${item.price}</ThemeText>
          </WarpSubView>
        })
      }
    </WarpView>
  </BGDiv>
}

export default MyBankAssetPrice;
