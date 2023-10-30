import ImageCommon from '@assets/common/ImageCommon'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import Modal from '../NormalModal'

const Container = styled.div`
  width:100%;
  height:${window.screen.height}px;
  padding:0px 30px;
  background-color:transparent;
  @media (max-width: 768px) {
    padding:0px 15px;
  };
  display:flex;
  flex-direction:column;
  align-items:center;
  background-color:#2FA7F6;
  position:relative;

`

const ContainerClose = styled.img`
  width:20px;
  height:20px;
  position:absolute;
  cursor: pointer;
  top:20px;
  right:15px
`
const ContainerTitle = styled.span`
  color:white;
  font-size:36px;
  font-weight:bold;
  margin-bottom:30px;
  @media (max-width: 768px) {
    font-size:18px;
    margin-bottom:15px;
  };
  text-align:center
`
const ContainerNum = styled.span`
  color:white;
  font-size:22px;
  font-weight:bold;
  margin-right:8px;
  margin-bottom:4px;
  @media (max-width: 768px) {
    font-size:11px;
    margin-right:4px;
    margin-bottom:2px
  };
`
const ContainerWrapDiv = styled.div`
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  overflow-y: auto;
  ::-webkit-scrollbar {
    height: 0;
    width: 0;
    color: transparent;
  };
`
const ContainerTopItem = styled.div<{
  image: any
}>`
  width:${() => `${(750 - 60 - 30 * 3) / 4}px`};
  height:${() => `${(750 - 60 - 30 * 3) / 4}px`};
  background-image:${({ image }) => `url(${image})`};
  background-size:${() => `${(750 - 60 - 30 * 3) / 4}px ${(750 - 60 - 30 * 3) / 4}px`};
  background-repeat: no-repeat;
  @media (max-width: 768px) {
    width:${() => `${(window.screen.width - 30 - 30 - 15 * 3) / 4}px`};
    height:${() => `${(window.screen.width - 30 - 30 - 15 * 3) / 4}px`};
    background-size:${() => `${(window.screen.width - 30 - 30 - 15 * 3) / 4}px ${(window.screen.width - 30 - 30 - 15 * 3) / 4}px`};
  };
  display:flex;
  flex-direction:row;
  align-items:flex-end;
  justify-content:flex-end;
`
const ContainerTopChoose = styled.div`
  width:100%;
  height:60px;
  font-size:30px;
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
  color:white;
  font-weight:bold;
  cursor: pointer;
  @media (max-width: 768px) {
    height:30px;
    font-size:15px;
  };
`
interface button_type {
  disabled?: boolean
}
const ContainerOpenbutton = styled.img<button_type>`
  width:136px;
  height:40px;
  cursor: pointer;
  margin-top:20px;
  pointer-events:${props => props.disabled ? "none" : "auto"};
  opacity:${props => props.disabled ? 0.6 : 1};
  @media (max-width: 768px) {
    width:68px;
    height:20px;
    margin-top:10px;
  };
`
const ContainerReceivebutton = styled.img`
  width:220px;
  height:65px;
  cursor: pointer;
  margin-top:60px;
  @media (max-width: 768px) {
    width:110px;
    height:32px;
    margin-top:30px;
  };
`
const ContainerTopHeaderImg = styled.img`
  width:627px;
  height:350px;
  margin-bottom:60px;
  @media (max-width: 768px) {
    width:313px;
    height:174px;
    margin-bottom:30px;
  };
`
const UniIcon = styled.img`
  width:226px;
  height:62px;
  margin-bottom:20px;
  margin-top:50px
`
const activeClassName = 'ACTIVE'
const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  align-items: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 20px;
  color:white;
  font-weight: 400;
  margin-top:20px;
  &.${activeClassName} {
    background-color:#0079F3;
    color:white
  };
  width:100%;
  display: flex;
  flex-direction: row;
  justify-content:center
`
export default function MenuAppModal({
  isOpen,
  onDismiss,
}: {
  isOpen: boolean
  onDismiss: () => void,
}) {

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} >
      <Container>
        <ContainerClose src={ImageCommon.close_app} onClick={onDismiss} />
        <UniIcon src={ImageCommon.whitelogo} />
        <StyledNavLink onClick={onDismiss} to={'/home'} >HOME</StyledNavLink>
        <StyledNavLink onClick={onDismiss} to={'/vault'} >Vault</StyledNavLink>
        <StyledNavLink onClick={onDismiss} to={'/bank'} >Bank</StyledNavLink>
        <StyledNavLink onClick={onDismiss} to={'/farms'} >Farms</StyledNavLink>
        <StyledNavLink onClick={onDismiss} to={'/whitehold'} >Whitehold</StyledNavLink>
        <StyledNavLink onClick={onDismiss} to={'/infinite'} >INFINITE</StyledNavLink>
      </Container>
    </Modal>
  )
}
