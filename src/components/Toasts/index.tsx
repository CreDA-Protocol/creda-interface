import styled from 'styled-components'
import { useToasts } from '../../states/application/hooks'
import { AutoColumn } from '../Column'
import ToastItem from './PopupItem'

const MobilePopupWrapper = styled.div<{ height: string | number }>`
  position: fixed;
  max-width: 80%;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? '0 auto;' : 0)};
  margin-bottom: ${({ height }) => (height ? '20px' : 0)}};
  display: none;
  z-index:999;
  top:10%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

const MobilePopupInner = styled.div`
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`

const FixedPopupColumn = styled(AutoColumn) <{ extraPadding: boolean }>`
  position: fixed;
  top: ${({ extraPadding }) => (extraPadding ? '108px' : '88px')};
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 1090;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export default function Toasts() {
  // get all popups
  const activeToasts = useToasts()

  // const urlWarningActive = useURLWarningVisible()

  return (
    <>
      <FixedPopupColumn gap="20px" extraPadding={true}>
        {activeToasts.map(item => (
          <ToastItem type={item.type} content={item.content} />
        ))}
      </FixedPopupColumn>
      <MobilePopupWrapper height={activeToasts?.length > 0 ? 'fit-content' : 0}>
        <MobilePopupInner>
          {activeToasts // reverse so new items up front
            .slice(0)
            .reverse()
            .map((item: any) => (
              <ToastItem type={item.type} content={item.content} />
            ))}
        </MobilePopupInner>
      </MobilePopupWrapper>
    </>
  )
}
