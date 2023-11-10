/* import { Dropdown, Menu } from 'antd';
import { isMobile } from 'react-device-detect';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

import { ImageCommon } from '@assets/common/ImageCommon';
import { Row } from '../../../components/Row';
const TopMenuImage = styled.img`
  width: 28px;
  height: 20px;
  margin-bottom:30px
`
const TopMenuItem = styled.div`
  display:flex;
  align-items: center;
  flex-direction:column;
  justify-content:center;
`
const TopMenuButtonImage = styled.img`
  width: 136px;
  height: 40px;
  cursor:pointer;
  margin-left:20px
`

export function SubMenu({ history }: any) {
  const { t } = useTranslation();

  function onPush(index: number) {
    switch (index) {
      case 0:
        // history.push('/searching')
        break;
      case 1:
        history.push('/starMoney')
        break;
      case 2:
        history.push('/starTrain')
        break;
      case 3:
        history.push('/search')
        break;
      case 4:
        history.push('/starTrad')
        break;
      case 5:
        history.push('/starBuild')
        break;
      default:
        break;
    }
  }

  return (
    <>
      {isMobile ? <Dropdown overlay={<Menu>
        <Menu.Item>
          <TopMenuItem onClick={() => {
            onPush(0)
          }}>
            {t('go yo fight')}
          </TopMenuItem>
        </Menu.Item>
        <Menu.Item>
          <TopMenuItem onClick={() => {
            onPush(1)
          }}>
            {t('money reward')}
          </TopMenuItem>
        </Menu.Item>
        <Menu.Item>
          <TopMenuItem onClick={() => {
            onPush(2)
          }}>
            {t('go to drill')}
          </TopMenuItem>
        </Menu.Item>
        <Menu.Item>
          <TopMenuItem onClick={() => {
            onPush(3)
          }}>
            {t('go to search')}
          </TopMenuItem>
        </Menu.Item>
        <Menu.Item>
          <TopMenuItem onClick={() => {
            onPush(4)
          }}>
            {t('go to trad')}
          </TopMenuItem>
        </Menu.Item>
        <Menu.Item>
          <TopMenuItem onClick={() => {
            onPush(5)
          }}>
            {t('go to build')}
          </TopMenuItem>
        </Menu.Item>
      </Menu>} >
        <TopMenuImage
          src={ImageCommon.money_right_menu}
        ></TopMenuImage>
      </Dropdown> : <Row>
        <TopMenuButtonImage onClick={() => onPush(0)} src={ImageCommon.gotofight} />
        <TopMenuButtonImage onClick={() => onPush(1)} src={ImageCommon.gotomoney} />
        <TopMenuButtonImage onClick={() => onPush(2)} src={ImageCommon.gotodrillbg} />
        <TopMenuButtonImage onClick={() => onPush(3)} src={ImageCommon.gotosearch} />
        <TopMenuButtonImage onClick={() => onPush(4)} src={ImageCommon.gototrad} />
        <TopMenuButtonImage onClick={() => onPush(5)} src={ImageCommon.gotobuildbg} />
      </Row>}
    </>
  )
}
 */

export default {}