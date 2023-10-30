import ImageCommon from '@assets/common/ImageCommon';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import Modal from '../NormalModal';

const Container = styled.div`
  width:100%;
  padding:0px 30px;
  background-color:transparent;
  @media (max-width: 768px) {
    padding:0px 15px;
  };
  display:flex;
  flex-direction:column;
  align-items:center;
`
const ContainerTop = styled.div`
  width:500px;
  height:200px;
  background-image:url(${ImageCommon.alertbgimage});
  background-position:center;
  background-size:500px 200px;
  background-repeat: no-repeat;
  @media (max-width: 768px) {
    width:250px;
    height:100px;
    background-size:250px 100px;
    padding:20px 30px
  };
  display:flex;
  flex-direction:column;
  padding:40px 60px;
  align-items:center;
  justify-content:space-between;
`
const ContainerReveiveTop = styled.div`
  width:100%;
  height:30px;
  @media (max-width: 768px) {
    width:100%;
    height:16px;
    font-size:9px;
    border-radius:8px
  };
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  color:black;
  font-size:18px;
  background-color:white;
  border-radius:15px;
  cursor: pointer; 
`
const ContainerTitle = styled.span`
  color:white;
  font-size:24px;
  font-weight:bold;
  margin-bottom:30px;
  @media (max-width: 768px) {
    font-size:12px;
    margin-bottom:15px;
  };
  text-align:center
`
export default function AlertModal({
  isOpen,
  onDismiss,
  title,
}: {
  isOpen: boolean
  onDismiss: () => void,
  title: string
}) {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onDismiss={() => { }} >
      <Container>
        <ContainerTop>
          <ContainerTitle>{title}</ContainerTitle>
          <ContainerReveiveTop onClick={onDismiss}>{t("i see")}</ContainerReveiveTop>
        </ContainerTop>
      </Container>
    </Modal>
  )
}

const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];
