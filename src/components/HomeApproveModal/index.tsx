import { useCallback } from 'react'
import styled from 'styled-components'
// import { useTranslation } from 'react-i18next'
import { Button, SpaceHeight, Text } from '@components/Row'
import { ExternalLink } from '../../theme'
import Modal from '../Modal'

const WarningContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: rgba(242, 150, 2, 0.05);
  border-radius: 20px;
  overflow: auto;
`

export default function HomeApproveModal({
  isOpen,
  onConfirm
}: {
  isOpen: boolean
  onConfirm: () => void
}) {
  const handleDismiss = useCallback(() => null, [])

  // const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <WarningContainer className="token-warning-container">
        <Text fontColor={'#3A3A3A'} fontSize={24}>Kindly note: before you join CreDA beta-test, you should bind your wallet address with Elastos DID.</Text>
        <SpaceHeight heightApp={15} height={30} />
        <ExternalLink href={'http://119.28.26.187:9091/public/home/index'}>
          <Text style={{ textDecorationLine: 'underline' }} fontColor={'#4022F3'} fontSize={24}>Click here to bind DID</Text>
        </ExternalLink>
        <SpaceHeight heightApp={15} height={30} />
        <Button
          backgroundColor={'#4022F3'}
          color={'#FFFFFF'}
          fontSize={24}
          padding={'6px 20px'}
          onClick={onConfirm}
        >I Kown</Button>
      </WarningContainer>
    </Modal>
  )
}
