import { useContext, useEffect } from 'react'
import { X } from 'react-feather'
import { animated, useSpring } from 'react-spring'
import styled, { ThemeContext } from 'styled-components'
import { ToastStatus, usePopToast } from "../../states/toast"
import { ToastPopup } from './ToastPopup'

export const StyledClose = styled(X)`
  position: absolute;
  right: 10px;
  top: 10px;

  :hover {
    cursor: pointer;
  }
`
export const Popup = styled.div`
  display: inline-block;
  width: 100%;
  padding: 1em;
  background-color: ${({ theme }) => theme.bg1};
  position: relative;
  border-radius: 10px;
  padding: 20px;
  padding-right: 35px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 290px;
  `}
`
const Fader = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background-color: orange;
`

const AnimatedFader = animated(Fader)
const removeAfterMs = 3000
export function ToastItem({
  type,
  content,
}: {
  type: ToastStatus,
  content: string
}) {
  const popToast = usePopToast()
  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      popToast()
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [removeAfterMs, popToast])

  const theme = useContext(ThemeContext)

  let popupContent = <ToastPopup type={type} content={content}></ToastPopup>

  const faderStyle = useSpring({
    from: { width: '100%' },
    to: { width: '0%' },
    config: { duration: removeAfterMs ?? undefined }
  })

  return (
    <Popup>
      <StyledClose color={theme.text2} onClick={popToast} />
      {popupContent}
      {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
    </Popup>
  )
}
